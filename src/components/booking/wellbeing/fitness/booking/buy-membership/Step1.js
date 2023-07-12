import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { Typography, Row, Col, Form, Input, InputNumber, Button, Divider } from 'antd';
import { getTraderMonthWellbeingBooking, getSpaDietitianSpaBooking, updateSpaDietitianSpaBooking, applyPromocode, enableLoading, disableLoading } from '../../../../../../actions';
import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import TextArea from 'antd/lib/input/TextArea';
// import Icon from '../../../../../customIcons/customIcons';
// import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { convertTime12To24Hour, convertTime24To12Hour } from '../../../../../common'
import { mergeEventStores } from '@fullcalendar/react';

const { Title, Text, Paragraph } = Typography;

class Step1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: props.selectedService.total,
            quantity: 1,
            initialDate: moment(),
            selectedBookingDate: props.reqData.bookingDate ? moment(props.reqData.bookingDate) : '',
            bookingTimeSlot: props.reqData.bookingTimeSlot ? convertTime24To12Hour(props.reqData.bookingTimeSlot) : '',
            appliedPromoCode: '',
            promoCodeDiscount: '',
            additionalComments: props.reqData.additionalComments ? props.reqData.additionalComments : '',
            slotsArrayForDate: [],
            selectedTimeIndex: props.reqData.selectedTimeIndex ? props.reqData.selectedTimeIndex : '',
            amTimeSlotArray: props.reqData.amTimeSlotArray ? props.reqData.amTimeSlotArray : [],
            pmTimeSlotArray: props.reqData.pmTimeSlotArray ? props.reqData.pmTimeSlotArray : [],
            serviceBookingId: props.reqData.serviceBookingId ? props.reqData.serviceBookingId : '',
            promocodeValue: '',
            appliedPromoCodeId: '',
            promocodeValue: '',
            appliedPromoCodeId: '',
            discountedPrice: props.selectedService.total,
            disscount: 0
        };


    }

    /**
    * @method onSubmit
    * @description onsubmit
    */
    onSubmit = () => {
        const { quantity, amount, additionalComments, promocodeValue, appliedPromoCode } = this.state;
        this.props.nextStep({ quantity, amount, discountedPrice: amount, additionalComments, promocodeValue, appliedPromoCode }, 1);
    }

    onClickApplyPromocode = () => {
        
        const { amount } = this.state
        const { loggedInDetail } = this.props;
        const { trader_profile } = this.props.bookingDetail;
        let reqData = {
            promo_code: this.state.promocodeValue,
            booking_category_id: trader_profile.booking_cat_id,
            customer_id: loggedInDetail.id,
        }
        this.props.enableLoading();
        this.props.applyPromocode(reqData, (response) => {
            this.props.disableLoading();
            if (response.status === 200) {
                toastr.success('Promocode appiled successfully.');
                let disAmount = amount * response.data.data.discount_percent / 100
                
                this.setState({
                    appliedPromoCodeId: response.data.data.id,
                    appliedPromoCode: response.data.data.promo_code,
                    promoCodeDiscount: response.data.data.discount_percent,
                    disscount: disAmount,
                    discountedPrice: amount - disAmount
                });
            }
        });
    }

    /**
    * @method render
    * @description render component
    */
    render() {
        const { loggedInDetail, reqData, bookingDetail, selectedService, mergedStepsData } = this.props;
        
        const {quantity, appliedPromoCode, discountedPrice, amount, bookingTimeSlot, additionalComments, selectedTimeIndex, amTimeSlotArray, pmTimeSlotArray } = this.state;
        //
        return (
            <Fragment>
                <div className='wrap fm-step-form'>
                    <Title>Payment Summary</Title>
                    <div className="shadow-input mt-30">
                        <table className="table-modal">
                            <thead>
                                <tr>
                                    <th width="300">Services</th>
                                    <th className="text-right">Price</th>
                                    <th className="text-center"></th>
                                    <th className="text-right" width="1%">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Text className="mb-8 inline-block" strong>{selectedService.name} </Text> <br />
                                        <Text> {selectedService.detail} </Text>
                                    </td>
                                    <td className="text-right">
                                        {/* <Text className="w-100 pm-am-text">AM</Text> */}
                                        <Text> ${selectedService.price} </Text>
                                    </td>
                                  <td className="text-center"> 
                                         {/* <InputNumber
                                            min={1}
                                            // value={quantity}
                                            defaultValue={mergedStepsData.step1Data.quantity}
                                            //  max={10} 
                                            // defaultValue={mergedStepsData && mergedStepsData.step1Data !== undefined ? mergedStepsData.step1Data.quantity : 1}
                                            onChange={(e) => {
                                                this.setState({ quantity: e, amount: e * selectedService.price })
                                            }}
                                        />*/}
                                    </td>  
                                    <td className="text-right">
                                        <Text> ${amount} </Text>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3">
                                        <Paragraph>Subtotal</Paragraph>
                                        <Paragraph>Taxes and surcharges</Paragraph>
                                        <Paragraph>Code promo FOR30</Paragraph>
                                        <Title level={4}>Total</Title>
                                    </td>
                                    <td className="text-right">
                                        <Paragraph>${amount}</Paragraph>
                                        <Paragraph>{'0.00'}</Paragraph>
                                        <Paragraph>{appliedPromoCode ? appliedPromoCode : '0.00'}</Paragraph>
                                        <Title level={4}><b>${discountedPrice}</b></Title>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <Divider />
                    <Row gutter={[45, 30]}>
                        <Col span={24}>
                            <Form.Item label='Special note'>
                                <TextArea defaultValue={additionalComments} maxLength={100} onChange={(e) => { this.setState({ additionalComments: e.target.value }) }} rows={2} placeholder={'Write your message here'} className='shadow-input' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item className='fm-apply-label' label='Do you have code promo?'>
                        <div className='fm-apply-input'>
                            <Input placeholder={'Enter promotion code'} onChange={(e) => this.setState({ promocodeValue: e.target.value })} enterButton='Search' className='shadow-input' />
                            <Button type='primary' className='fm-apply-btn' onClick={() => {
                                this.onClickApplyPromocode()
                            }}>Apply</Button>
                        </div>
                        <Link to='/' className='fm-clear-link'>Clear</Link>
                    </Form.Item>

                    <Row>
                        <Col md={24}>
                            <div className='steps-action mt-15'>
                                <Button htmlType='submit' type='primary' size='middle' className='btn-blue fm-btn' onClick={() => this.onSubmit()}>
                                    Next
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}
const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser
    };
};

export default connect(
    mapStateToProps, { getTraderMonthWellbeingBooking, getSpaDietitianSpaBooking, updateSpaDietitianSpaBooking, applyPromocode, enableLoading, disableLoading }
)(Step1);