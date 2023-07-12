import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {  Typography, Row, Col,  Button, Table, InputNumber } from 'antd';
import { convertMinToHours } from '../../../common'
import { enableLoading, disableLoading, beautyServiceBooking, updateBeautyServiceBooking } from '../../../../actions';
import moment from 'moment';

const { Title } = Typography;

class Step2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceBookingId: props.reqData.serviceBookingId ? props.reqData.serviceBookingId : ''
        };
    }

    /**
   * @method onClickNext
   * @description onClickNext
   */
    onClickNext = () => {
        const { serviceBookingId } = this.state;
        const { mergedStepsData , loggedInDetail} = this.props;
        const {  step1Data } = mergedStepsData; 
        const { name } = loggedInDetail

        const { appliedPromoCodeId, promoCodeDiscount, selectedServiceSumTotal } =  step1Data;
         let bookBeautyServicesRequestData = {
            trader_profile_id: step1Data.traderProfileId,
            customer_id: step1Data.customerId,
            service_ids: step1Data.serviceIds.toString(),
            start_time: step1Data.bookingTimeSlot,
            additional_comments: step1Data.additionalComments,
            name:name,
            date_of_birth: '',
            gender: ''
        };

        if(appliedPromoCodeId !== ''){
          let  discountAmount = selectedServiceSumTotal * promoCodeDiscount / 100;
            bookBeautyServicesRequestData.promo_code_id = appliedPromoCodeId;
            bookBeautyServicesRequestData.discount_amount = discountAmount; 
        }

        this.props.enableLoading();
        if (serviceBookingId === '') {
            bookBeautyServicesRequestData.booking_date = step1Data.bookingDate;
            
            this.props.beautyServiceBooking(bookBeautyServicesRequestData, this.beautyServiceBookingCallback);
        } else {
            bookBeautyServicesRequestData.service_booking_id =  serviceBookingId;
            bookBeautyServicesRequestData.booking_date = moment.isMoment(step1Data.bookingDate) ? step1Data.bookingDate.format('YYYY-MM-DD') : step1Data.bookingDate;
            
            this.props.updateBeautyServiceBooking(bookBeautyServicesRequestData, this.beautyServiceBookingCallback);
        }
    }

    beautyServiceBookingCallback = (response) =>{
        this.props.disableLoading();
        
        if (response.status === 200) {
            let serviceBookingId = response.data.service_booking_id;
            let reqData = {
                 serviceBookingId : serviceBookingId
            }
            
            this.props.nextStep(reqData, 2)
        }
    }
    /**
    * @method render
    * @description render component
    */
    render() {
        const { mergedStepsData} = this.props;
        const {  step1Data } = mergedStepsData; 
        const { appliedPromoCodeId, promoCodeDiscount, selectedServiceSumTotal,appliedPromoCode } =  step1Data;
        const { selectedBeautyService } = this.props;
        let dataSource = [];
         selectedBeautyService.map(function(item ,idx) {
            dataSource.push({
                key: idx+1,
                name: item.name,
                duration: convertMinToHours(item.duration),
                price: item.price,
                amount: item.price
            });
        });
          
        const fixedColumns = [
            {
                title: 'Service',
                key: 'name',
                dataIndex: 'name',
            },
            {
                title: 'Duration',
                key: 'duration',
                dataIndex: 'duration'
            },
            {
                title: 'Price',
                key: 'price',
                dataIndex: 'price',
                render: (price, record) => <span>${price.toFixed(2)}</span>
            },
            {
                title: 'Quantity',
                key: 'quantity',
                dataIndex: 'quantity',
                render: (quantity, record) => <InputNumber min={1} max={10} defaultValue={2} />
            },
            {
                title: 'Amount',
                key: 'amount',
                dataIndex: 'amount',
                render: (amount, record) => <span>${amount.toFixed(2)}</span>
            },
        ];
        let discountAmount = 0;
        if(appliedPromoCodeId !== ''){
           discountAmount = selectedServiceSumTotal  * promoCodeDiscount / 100;
        }
        
        return (
            <Fragment>
                <div className='wrap fm-step-form'>
                <Title> Please select quantity</Title>
                    <Row>
                        <Col span={24} >
                            <Table
                                pagination={false}
                                dataSource={dataSource}
                                columns={fixedColumns}
                                className="table-shadow product-table"
                                summary={pageData => {
                                    let totalPrice = 0;
                                    pageData.forEach(({ price }) => {
                                        totalPrice += price;
                                    });
                                    let total =  parseFloat(totalPrice) - parseFloat(discountAmount);
                                    return (
                                        <>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell colSpan="4">Subtotal</Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    ${totalPrice.toFixed(2)}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell colSpan="4">Taxes and surcharges</Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    ${'10.00'}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                            {appliedPromoCode && appliedPromoCode!= null && <Table.Summary.Row>
                                                <Table.Summary.Cell colSpan="4">Code Promo {appliedPromoCode}</Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    - ${discountAmount.toFixed(2)} 
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>}
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell colSpan="4">Total</Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    ${total.toFixed(2)}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </>
                                    );
                                }}
                            />
                        </Col>
                    </Row>
                    <div className='steps-action'>
                        <Button
                            htmlType="button"
                            onClick={() => this.props.moveBack()}
                            type="primary"
                            size="middle"
                            className="btn-trans fm-btn"
                        >
                            Back
                        </Button>
                        <Button htmlType='submit' type='primary' size='middle' className='btn-blue fm-btn' onClick={() => this.onClickNext()}>
                            NEXT
                        </Button>
                    </div>
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
    mapStateToProps, { enableLoading, disableLoading, beautyServiceBooking, updateBeautyServiceBooking }
)(Step2);