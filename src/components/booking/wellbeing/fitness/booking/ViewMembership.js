import React, { Fragment } from 'react';
import { Progress, Steps, Calendar, Card, Layout, Typography, Avatar, Tabs, Row, Col, Breadcrumb, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from "moment";
import {
    convertMinToHours,
    convertTime24To12Hour,
    dateFormat4
} from "../../../../common";
const { Title, Text } = Typography
export default class ViewMembershipModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: this.props.initialStep,
            categoyType: '',
            step1Data: {
                bookingDate: '',
                bookingTimeSlot: '',
                appliedPromoCode: '',
                promoCodeDiscount: '',
                additionalComments: '',
                traderProfileId: '',
                customerId: '',
                serviceIds: '',
                serviceBookingId: '',
                selectedTimeIndex: '',
                amTimeSlotArray: [],
                pmTimeSlotArray: [],
                quantity: 1
            }

        };
    }

    render() {
        const { bookingDetail, visible, selectedMembership } = this.props;
        console.log('selectedMembership: ', selectedMembership);
        const { current } = this.state;
        return (
            <Modal
                title="My Membership"
                visible={visible}
                className={"custom-modal style1"}
                footer={false}
                onCancel={() => this.props.onCancel()}
                destroyOnClose={true}
            >
                <div className='wrap-old book-now-popup padding'>
                    {/* <Row>
                        <Col md={24}>
                            {current !== 2 &&
                                <div className='user-detail-box'>
                                    <div className='product-detail-left'>
                                        <Avatar shape="square" src={bookingDetail.image ? bookingDetail.image : <Avatar size={54} icon={<UserOutlined />} />}
                                            icon={<UserOutlined />} />
                                    </div>
                                    <div className='product-detail-right'>
                                        <Title level={2} className='price'>
                                            {bookingDetail.business_name}
                                        </Title>
                                        <Text className="location-text">Location</Text>
                                        <div className='address'>
                                            <Text>
                                                {
                                                    bookingDetail && bookingDetail.business_location ? bookingDetail.business_location : ''
                                                }
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Col>
                    </Row> */}
                    <div className='steps-content clearfix'>
                        <Layout>
                            <Layout>
                                <Layout>
                                    <Row gutter={[20, 20]}>
                                        <Col span={12} className="mt-20">
                                            <Title level={4}>Your Membership details</Title>
                                            <Card>
                                                <Row gutter={[20, 20]}>
                                                    <Row>
                                                        <Col md={24}>
                                                            {current !== 2 &&
                                                                <div className='user-detail-box'>
                                                                    <div className='product-detail-left'>
                                                                        <Avatar shape="square" src={bookingDetail.image ? bookingDetail.image : <Avatar size={54} icon={<UserOutlined />} />}
                                                                            icon={<UserOutlined />} />
                                                                    </div>
                                                                    <div className='product-detail-right'>
                                                                        <Title level={2} className='price'>
                                                                            {bookingDetail.business_name}
                                                                        </Title>
                                                                        <Text className="location-text">Location</Text>
                                                                        <div className='address'>
                                                                            <Text>
                                                                                {
                                                                                    bookingDetail && bookingDetail.business_location ? bookingDetail.business_location : ''
                                                                                }
                                                                            </Text>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </Col>
                                                    </Row>
                                                    {/* <Col md={10}>
                                                        <div className="slide-content"> */}
                                                    {/* <img
                                                                    src={
                                                                        bookingResponse.service_sub_bookings[0]
                                                                            .wellbeing_trader_service.service_image
                                                                            ? bookingResponse.service_sub_bookings[0]
                                                                                .wellbeing_trader_service.service_image
                                                                            : DEFAULT_IMAGE_CARD
                                                                    }
                                                                    alt=""
                                                                /> */}
                                                    {/* </div>
                                                    </Col> */}
                                                    {/* <Col md={14}>
                                                            <div className="fm-user-details inner-fourth">
                                                                <Title level={4}>
                                                                    {
                                                                        bookingResponse.service_sub_bookings[0]
                                                                            .wellbeing_trader_service.name
                                                                    }
                                                                </Title>
                                                                <br></br>
                                                                <Text className="category-type">
                                                                    {bookingResponse.sub_category_name}
                                                                </Text>
                                                                <br></br>
                                                                <Text className="fm-location">
                                                                    {bookingResponse.trader_user.business_location
                                                                        ? bookingResponse.trader_user.business_location
                                                                        : ""}
                                                                </Text>
                                                            </div>
                                                        </Col> */}
                                                </Row>
                                                <Divider />
                                                <Row>
                                                    <Col md={17}>
                                                        <Text>
                                                            <b>Start Date:</b> <br></br>
                                                            {/* {dateFormat4(selectedMembership.start_date)} */}
                                                            {moment(selectedMembership.start_date).format(
                                                                "dddd, MMMM Do YYYY"
                                                            )}
                                                        </Text>
                                                    </Col>

                                                </Row>
                                                <Row className="mt-10">
                                                    <Text>
                                                        <b>Expiry:</b> <br />{" "}
                                                        {moment(selectedMembership.end_date.date).format(
                                                            "dddd, MMMM Do YYYY"
                                                        )}
                                                    </Text>
                                                </Row>
                                                <Row className="mt-10">
                                                    <Text>
                                                        <b>Contact Name:</b> <br />
                                                        {selectedMembership.trader_user.name}
                                                    </Text>
                                                </Row>
                                                <Row className="mt-10">
                                                    <Text>
                                                        <b>Email:</b> <br />
                                                        {selectedMembership.trader_user.email}
                                                    </Text>
                                                </Row>
                                                <Row className="mt-10">
                                                    <Text>
                                                        <b>Phone Number:</b> <br />
                                                        {selectedMembership.trader_user.mobile_no}
                                                    </Text>
                                                </Row>
                                                <Divider />
                                            </Card>
                                        </Col>
                                        <Col span={12} className="mt-20">
                                            <Title level={4}>Your price summary </Title>
                                            <Card className="price-summary">
                                                <Row>
                                                    <Text>
                                                        {selectedMembership.name}
                                                    </Text>
                                                </Row>
                                                <Row className="pt-5">
                                                    <Col md={8}> ${selectedMembership.trader_user ? selectedMembership.trader_users.price :'0.0'}</Col>
                                                </Row>
                                                <Row className="pt-5">
                                                    <Col md={16}>Taxes and subcharges:</Col>
                                                    <Col md={8}>${selectedMembership.taxes_fees ? selectedMembership.taxes_fees : 0.00}</Col>
                                                </Row>
                                                {selectedMembership.promo_code &&
                                                    selectedMembership.promo_code != null && (
                                                        <Row className="pt-5">
                                                            <Col md={16}>
                                                                {`Code promo ${selectedMembership.promo_code.promo_code}`}
                                                            </Col>
                                                            <Col md={8}>-${selectedMembership.discount_amount}</Col>
                                                        </Row>
                                                    )}
                                                <Divider />
                                                <Row className="pt-5">
                                                    <Col md={16}>
                                                        <b>Total:</b>{" "}
                                                    </Col>
                                                    <Col md={8}>
                                                        <b>${selectedMembership.total}</b>{" "}
                                                    </Col>
                                                </Row>
                                            </Card>
                                            <Title level={4} className="mt-30">
                                                Special Note
                  </Title>
                                            <Card>
                                                <Row>
                                                    <Text>
                                                        {selectedMembership.special_note
                                                            ? selectedMembership.special_note
                                                            : "N/A"}
                                                    </Text>
                                                </Row>
                                            </Card>
                                        </Col>
                                        {/* <div className="steps-action ">
                                                <Button
                                                    onClick={() =>
                                                        this.props.history.push({
                                                            pathname: `/booking-checkout`,
                                                            state: {
                                                                amount: bookingResponse.total_amount,
                                                                trader_user_id: bookingResponse.trader_user_id,
                                                                customerId,
                                                                service_booking_id: serviceBookingId,
                                                                customer_name: bookingResponse.customer.name,
                                                                mobile_no: bookingResponse.customer.mobile_no,
                                                                phonecode: bookingResponse.customer.phonecode,
                                                                payment_type: "firstpay",
                                                            },
                                                        })
                                                    }
                                                    size="middle"
                                                    className="text-white"
                                                    style={{ backgroundColor: "#EE4929" }}
                                                >
                                                    Pay
                  </Button>
                                            </div> */}
                                    </Row>

                                </Layout>
                            </Layout>
                        </Layout>

                    </div>
                </div>
            </Modal>
        )
    }
}