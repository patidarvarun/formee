import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { Typography, Row, Col, Form, Input, InputNumber, Button, Divider } from 'antd';
import { getTraderMonthWellbeingBooking, getSpaDietitianSpaBooking, updateSpaDietitianSpaBooking, applyPromocode, enableLoading, disableLoading } from '../../../../../../actions';
import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import TextArea from 'antd/lib/input/TextArea';
// import Icon from '../../../../customIcons/customIcons';
// import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { convertTime12To24Hour, convertTime24To12Hour } from '../../../../../common'

const { Title, Text } = Typography;

class Step1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: props.selected.price,
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
            discountedPrice: props.selected.price,
            disscount: 0
        };


    }

    /**
    * @method onSubmit
    * @description onsubmit
    */
    onSubmit = () => {
        const { quantity, amount, disscount, additionalComments, promocodeValue, discountedPrice, appliedPromoCode } = this.state;
        this.props.nextStep({ discountedPrice: amount, disscount, quantity, amount, additionalComments, promocodeValue, appliedPromoCode }, 1);
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

                // 
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
        const { selectedService, mergedStepsData, selected } = this.props;
        const { amount, discountedPrice, additionalComments, disscount, appliedPromoCode } = this.state;

        //
        return (
            <Fragment>
                <div className='wrap fm-step-form'>
                    <Title> Please select quantity</Title>
                    <Row className="shadow-input mt-30" >
                        <Col span={8} >
                            <Text className="availability-text">Services</Text>
                            <div className="mt-30 mb-30 ml-15 mr-15">
                                <Text> <b>{selected.class_name} </b></Text> <br />
                                <Text> {selected.description} </Text>
                            </div>
                        </Col>
                        <Col span={4} >
                            <Text className="availability-text"><span style={{opacity:'0'}}>Services</span></Text>
                            <Row className="mt-30 mb-30 ml-15 mr-15">
                                <Col md={12}>
                                    {/* <Text className="w-100 pm-am-text">AM</Text> */}
                                    <Text> {selectedService.duration} </Text> <br />
                                </Col>

                            </Row>
                        </Col>
                        <Col span={4} >
                            <Text className="availability-text">Price</Text>
                            <Row className="mt-30 mb-30 ml-15 mr-15">
                                <Col md={12}>
                                    {/* <Text className="w-100 pm-am-text">AM</Text> */}
                                    <Text> ${selected.price} </Text> <br />
                                </Col>

                            </Row>
                        </Col>
                        <Col span={4} >
                            <Text className="availability-text">Quantity</Text>
                            <Row className="mt-30 mb-30 ml-15 mr-15">
                                <Col md={12}>
                                    <InputNumber
                                        min={1}
                                        defaultValue={mergedStepsData.step1Data.quantity}
                                        onChange={(e) => {
                                            this.setState({ quantity: e, amount: e * selected.price, discountedPrice: e * selected.price })
                                        }}
                                    />
                                </Col>

                            </Row>
                        </Col>
                        <Col span={4} >
                            <Text className="availability-text">Amount</Text>
                            <Row className="mt-30 mb-30 ml-15 mr-15">
                                <Col md={12}>
                                    <Text> ${amount} </Text> <br />
                                </Col>

                            </Row>
                        </Col>

                        <Divider />
                        <Col span={20} >
                            <Row className=" mb-30 ml-15 mr-15 grand-total-sectn">
                                <Col md={12}>
                                    <Text className="pt-10"> Subtotal </Text> <br />
                                    {appliedPromoCode && <Text className="pt-10"> Code promo  </Text>}<br />
                                    <Text className="pt-10"><b>Total</b></Text>
                                </Col>

                            </Row>
                        </Col>
                        <Col span={4} >
                            <Row className=" mb-30 grand-total-sectn" >
                                <Col md={12} className="text-center">
                                    {/* <Text className="w-100 pm-am-text">AM</Text> */}
                                    <Text className="pt-10"> ${amount} </Text> <br />
                                    <Text className="pt-10"> {appliedPromoCode} </Text> <br />
                                    <Text className="pt-10"><b>${discountedPrice}</b> </Text> <br />
                                </Col>
                            </Row>
                        </Col>

                    </Row >

                    <Divider></Divider>
                    {/* <Row gutter={[45, 30]}>
                        <Col span={24} >
                            <Form.Item
                                label='Special note'
                            >
                                <TextArea defaultValue={additionalComments} maxLength={100} onChange={(e) => { this.setState({ additionalComments: e.target.value }) }} rows={2} placeholder={'Write your message here'} className='shadow-input' />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    <Form.Item className='fm-apply-label' label='Do you have code promo?'>
                        <div className='fm-apply-input'>
                            <Input placeholder={'Enter promotion code'} onChange={(e) => this.setState({ promocodeValue: e.target.value })} enterButton='Search' className='shadow-input' />
                            <Button type='primary' className='fm-apply-btn' onClick={
                                () => {

                                    this.onClickApplyPromocode()
                                }}
                            >Apply</Button>
                        </div>
                        <Link to='/' className='fm-clear-link'>Clear</Link>
                    </Form.Item>

                    <Row>
                        <div className='steps-action w-100  mb-0'>
                            <Button htmlType='submit' type='primary' size='middle' className='btn-blue fm-btn' onClick={() => this.onSubmit()}>
                                NEXT
                        </Button>
                        </div>
                    </Row>
                </div >
            </Fragment >
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