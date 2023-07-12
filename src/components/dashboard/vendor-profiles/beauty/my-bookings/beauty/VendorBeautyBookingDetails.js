import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Steps, Calendar, Card, Layout, Progress, Typography, Avatar, Tabs, Row, Col, Breadcrumb, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider, Descriptions, Anchor, Radio } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { vendorServiceBookingResponse, enableLoading, disableLoading, getBeautyServiceBooking } from '../../../../../../actions';
import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import { DEFAULT_IMAGE_CARD } from '../../../../../../config/Config';
import AppSidebar from '../../../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../../../common/History';
import './mybooking.less';
import '../../../../../booking/booking.less'
import { convertMinToHours, convertTime24To12Hour, calculateHoursDiffBetweenDates } from '../../../../../../components/common';
import { required, whiteSpace, maxLengthC } from '../../../../../../config/FormValidation'


const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;
const { TextArea } = Input;
const tailLayout = {
  wrapperCol: { span: 24 },
  className: 'align-center pt-20'
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  labelAlign: 'left',
  colon: false,
};

const VENDOR_CANCELLATION_REASON_DURING_JOB = [
  'I do not want to work with this customer - I do not think this should be an option. Its discrimination',
  'I am no longer available',
  'I want to reschedule',
  'I do not feel safe',
  'The job is different to the customer original request',
  'I have under quoted this job',
  'The customer has asked me to cancel upon arrival',
  'The customer is not ressponding to my messages or calls',
  'The customer changed the location',
  'A personal emergency has occurred supportive photo evidence required',
  'Other'
];

const VENDOR_CANCELLATION_REASON_BEFORE_24_HOURS_JOB = [
  'I have accidentally accepted this job',
  'I  customer is located too far away',
  'The customer has changed their location',
  'The customer is not responding to my message/unresponsive',
  'I have quoted this job too low',
  'I am no longer available on that day',
  'I do not feel safe while communicating with the customer',
  'The vendor has asked me to cancel via message',
  'The customer has asked me to cancel via message',
  'Other'
]
const VENDOR_CANCELLATION_REASON_IN_24_HOURS_JOB = [
  'I have changed my mind',
  'I want to reschedule this job',
  'The customer is not responding to my messages/unresponsive',
  'The customer has asked me to cancel upon arrival',
  'I do not feel safe',
  'The customer changed the location',
  'A personal emergency has occurred supportive photo evidence required*',
  'Other'
]

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

class VendorBeautyBookingDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookingResponse: '',
      displaySpaBookingModal: false,
      displayCancelBookingModal: false,
      isOtherCancelResaon: false,
      // serviceBookingId: this.props.serviceBookingId
      serviceBookingId: '',
      displayCancelBookingConfirmationModal: false,
      selectedReasonForCancel: '',
    };
  }

  componentDidMount() {
    const parameter = this.props.match.params
    let serviceBookingId = parameter.serviceBookingId;
    const reqData = {
      service_booking_id: serviceBookingId
    }
    this.setState({ serviceBookingId: serviceBookingId });
    this.props.enableLoading();
    this.props.getBeautyServiceBooking(reqData, res => {
      this.props.disableLoading();
      
      if (res.status === 200) {
        this.setState({ bookingResponse: res.data.data });
      } else {
        toastr.error('Something went wrong');
      }
    })
  }

  displaySpaBookingModal = (selectedSpaService) => {
    this.setState({
      displaySpaBookingModal: true,
      selectedSpaService: selectedSpaService
    });

  }

  hideSpaBookingModal = e => {
    this.setState({
      displaySpaBookingModal: false,
    });
  };

  hideCancelSpaBookingModal = e => {
    this.setState({
      displayCancelBookingModal: false,
    });
  };

  renderCancelReasonOptions = (bookingResponse) => {
    if (bookingResponse !== '') {
      let bookingDateTime = `${bookingResponse.booking_date} ${bookingResponse.start_time}`;
      let hourDifference = calculateHoursDiffBetweenDates(bookingDateTime);
      let cancelReasonArray = []
      if (hourDifference > 24) {
        cancelReasonArray = VENDOR_CANCELLATION_REASON_BEFORE_24_HOURS_JOB;
      } else if (hourDifference > 0 && hourDifference < 24) {
        cancelReasonArray = VENDOR_CANCELLATION_REASON_IN_24_HOURS_JOB;
      } else if (hourDifference < 0) {
        cancelReasonArray = VENDOR_CANCELLATION_REASON_DURING_JOB
      }

      return Array.isArray(cancelReasonArray) && cancelReasonArray.map((el, i) => {
        return <Radio key={`${i}_cancel_reason`} style={radioStyle} value={el}>{el}</Radio>
      })
    }
  }

  onChangeBookingCancelReason = (e) => {
    if (e.target.value === 'Other') {
      this.setState({ isOtherCancelResaon: true, selectedReasonForCancel: e.target.value, });
    } else {
      this.setState({ isOtherCancelResaon: false, selectedReasonForCancel: e.target.value, });
    }
  };

  hideCancelSpaBookinConfirmationModal = e => {
    this.setState({
      displayCancelBookingConfirmationModal: false,
    });
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onSubmitCancelBookingForm = (values) => {
    
    const reqData = {
      service_booking_id: this.state.serviceBookingId,
      status: "Cancelled",
      reason: values.cancelreason === "Other" ? values.other_reason : values.cancelreason
    }
    this.props.enableLoading();
    
    this.props.vendorServiceBookingResponse(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success('Success', 'Booking has been cancelled successfully.');
        this.setState({
          displayCancelBookingModal: false,
        });
        this.props.history.push('/dashboard');
      } else {
        toastr.success('Error', 'Something went wrong to cancel this booking.');
      }
    });
  }


  /**
  * @method render
  * @description render component
  */
  render() {
    const { bookingResponse } = this.state;
    let amountToPay = 0;
    amountToPay = parseFloat(bookingResponse.total_amount) + parseFloat(bookingResponse.tax_amount && bookingResponse.tax_amount !== '' ? bookingResponse.tax_amount : 0 ); 
    amountToPay = bookingResponse.promo_code && bookingResponse.promo_code != null ? (parseFloat(amountToPay) - parseFloat(bookingResponse.discount_amount)).toFixed(2) : parseFloat(amountToPay);
     
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box view-class-tab spa-booking-history-detail vendor-beauty-booking-detail' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>Your Booking Details</Title>
                  </div>
                  <div className='right'></div>
                </div>
                <div className='sub-head-section'>
                  <div className="back" onClick={this.props.history.goBack}>
                    <LeftOutlined /> <span>Back</span>
                  </div>
                </div>
                <div className="profile-content-box box-shdw-none book-now-popup mt-18">

                  {bookingResponse !== '' &&
                    <Row gutter={30}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <div className="left-parent-detail-block">
                          <Card>
                            <Row gutter={0}>
                              <Col md={24}>
                                <div className="body-detail">
                                  <div className="thumb-title-block">
                                    <div className='slide-content'>
                                      <img src={bookingResponse.service_sub_bookings[0].wellbeing_trader_service.service_image ? bookingResponse.service_sub_bookings[0].wellbeing_trader_service.service_image : DEFAULT_IMAGE_CARD} alt='' />
                                    </div>

                                    <div className='fm-user-details inner-fourth'>
                                      <Title level={4}>
                                        {bookingResponse.service_sub_bookings[0].wellbeing_trader_service.name}
                                      </Title>
                                      <Text className='category-type'>
                                        {bookingResponse.category_name} | {bookingResponse.sub_category_name}
                                      </Text>
                                      <Text><b>Address:</b> </Text>
                                      <Text className='fm-location'>{bookingResponse.trader_user.business_location ? bookingResponse.trader_user.business_location : ''}</Text>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            <div className="body-detail">
                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Date:</div>
                                    <div className="sub-title-detail">
                                      {moment(bookingResponse.booking_date).format("dddd, MMMM Do YYYY")}
                                    </div>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Duration:</div>
                                    <div className="sub-title-detail">{convertMinToHours(bookingResponse.duration)}</div>
                                  </div>
                                </Col>

                              </Row>
                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Time:</div>
                                    <div className="sub-title-detail">{convertTime24To12Hour(bookingResponse.start_time)}</div>

                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title"></div>
                                    <div className="sub-title-detail"></div>
                                  </div>
                                </Col>
                              </Row>

                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Contact Name:</div>
                                    <div className="sub-title-detail">{bookingResponse.customer.name}</div>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="title-sub-title-detail mb-0">
                                    <div className="title">Phone Number:</div>
                                    <div className="sub-title-detail">
                                      {bookingResponse.customer.mobile_no !== null && bookingResponse.customer.mobile_no !== '' ? `${bookingResponse.customer.phonecode} ${bookingResponse.customer.mobile_no}` : 'N/A'}
                                    </div>
                                  </div>
                                </Col>

                              </Row>

                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Email Address:</div>
                                    <div className="sub-title-detail">
                                      {bookingResponse.customer.email}
                                    </div>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    &nbsp;
                                    </div>
                                </Col>
                              </Row>
                            </div>

                          </Card>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div className="right-parent-block-detail payment-block-detail">
                          <div className="header-detail">
                            <h2>Your Price Summary</h2>
                          </div>

                          <div className="price-summary-list">
                            <div className="title">
                              <Row gutter={20}>
                                <Col xs={24} sm={24} md={6} lg={6}>
                                  1
                                </Col>
                                <Col xs={24} sm={24} md={13} lg={13}>
                                  {bookingResponse.service_sub_bookings[0].wellbeing_trader_service.name}
                                </Col>
                                <Col xs={24} sm={24} md={5} lg={5} className="text-right">
                                  ${bookingResponse.total_amount.toFixed(2)}
                              </Col>
                              </Row>
                            </div>
                          </div>
                          <div className="price-total-list">
                            <Row gutter={20}>
                              <Col md={14}>1</Col>
                              <Col md={10} className="text-right">${bookingResponse.total_amount.toFixed(2)}</Col>
                              <Col md={14}>Taxes and subcharges:</Col>
                              <Col md={10} className="text-right">${bookingResponse.tax_amount.toFixed(2)}</Col>
                              {bookingResponse.promo_code && bookingResponse.promo_code != null && <Fragment>
                                <Col md={14}>Code promo {bookingResponse.promo_code}</Col>
                                <Col md={10} className="text-right">
                                  -${bookingResponse.discount_amount.toFixed(2)}
                                </Col>
                              </Fragment>}
                              <Col md={14}><b>Total</b></Col>
                              <Col md={10} className="text-right">
                                <div className="total-amount">
                                  <b>${amountToPay.toFixed(2)}</b>
                                </div> 
                              </Col>
                            </Row>
                          </div>
                        </div>
                        <div className="right-parent-block-detail special-notes" >
                          <div className="header-detail">
                            <h2>Special Note</h2>
                          </div>
                          <div className="body-detail">
                            <p>{bookingResponse.additional_comments ? bookingResponse.additional_comments : 'N/A'}</p>
                            <Button onClick={() => this.setState({ displayCancelBookingConfirmationModal: true })}
                              size='middle' className='text-white btn-orange mt-15'>Cancel</Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  }
                  <Modal
                    title=''
                    visible={this.state.displayCancelBookingConfirmationModal}
                    className={'custom-modal style1 cancel-sml-modal'}
                    footer={false}
                    onCancel={this.hideCancelSpaBookinConfirmationModal}
                    destroyOnClose={true}
                  >
                    <div className='content-block'>
                      <div className="discrip"> If you cancel within 24 hours of the scheduled booking, 50% of the fee will still to be charged</div>
                      <Form.Item {...tailLayout}>
                        <Button type='default' onClick={() => this.setState({ displayCancelBookingConfirmationModal: false, displayCancelBookingModal: true })} > Continue </Button>
                      </Form.Item>
                    </div>
                  </Modal>
                  <Modal
                    title=''
                    visible={this.state.displayCancelBookingModal}
                    className={'custom-modal style1 cancellation-reason-modal'}
                    footer={false}
                    onCancel={this.hideCancelSpaBookingModal}
                    destroyOnClose={true}
                  >
                    <div className='content-block'>
                      <Form
                        {...layout}
                        onFinish={this.onSubmitCancelBookingForm}
                      >
                        <h2> Please choose a reason for cancellation</h2>
                        <Form.Item
                          label=''
                          name='cancelreason'
                          rules={[required('')]}
                        >
                          <Radio.Group onChange={this.onChangeBookingCancelReason}>
                            {this.renderCancelReasonOptions(bookingResponse)}
                          </Radio.Group>
                        </Form.Item>
                        {this.state.isOtherCancelResaon &&
                          <Form.Item
                            label='Specify other reason'
                            name='other_reason'
                            rules={[required(''), whiteSpace('Message'), maxLengthC(100)]}
                          >
                            <TextArea rows={4} placeholder={'Write your message here'} className='shadow-input' />
                          </Form.Item>
                        }
                        <Form.Item className="text-center">
                          <Button type='default' htmlType='submit'> Submit </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    )

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
  mapStateToProps, { enableLoading, disableLoading, vendorServiceBookingResponse, getBeautyServiceBooking }
)(withRouter(VendorBeautyBookingDetails));