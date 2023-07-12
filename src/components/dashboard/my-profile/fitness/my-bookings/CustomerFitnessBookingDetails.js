import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Card, Layout, Typography, Row, Col, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider, Descriptions, Anchor, Radio } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { enableLoading, disableLoading, getBeautyServiceBooking, cancelFitnessServiceBooking, cancelBeautyServiceBooking, getTraderMonthWellbeingBooking, updateBeautyServiceBooking,updateBeautyServiceBookingFitness, showCustomerClass } from '../../../../../actions';
import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import { DEFAULT_IMAGE_CARD } from '../../../../../config/Config';
import AppSidebar from '../../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import './mybooking.less';
import '../../../../booking/booking.less'
import { convertMinToHours, convertTime24To12Hour, calculateHoursDiffBetweenDates, convertTime12To24Hour } from '../../../../../components/common';

import { required, whiteSpace, maxLengthC } from '../../../../../config/FormValidation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Icon from '../../../../../components/customIcons/customIcons';
import { BOOKING_DETAILS } from './static_response';

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;
const { TextArea } = Input;
const tailLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: 'align-center pt-20'
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  labelAlign: 'left',
  colon: false,
};

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

const CANCELLATION_REASON_DURING_JOB = [
  'I am no longer available',
  'I want to reschedule',
  'I dont fell safe',
  'The vendor has asked me to cancel upon arrival',
  '30 minutes has passed and the vendor has not arrived',
  'The vendor is not responding to my message or calls',
  'A personal emergency has occurred supportive photo evidence required',
  'Other'
];

const CANCELLATION_REASON_BEFORE_24_HOURS_JOB = [
  'I have accidentally posted this job',
  'I have changed my mind',
  'I want to chnage the job description',
  'The vendor can not meet my requirements',
  'The vendor is not responding to my messages/unresponsive',
  'The job quotation is too high',
  'I am no longer available on that day',
  'I do not feel safe while communicating with the vendor',
  'The vendor has asked me to cancel via message',
  'I have not provided enough information to the vendor',
  'Other'
]
const CANCELLATION_REASON_IN_24_HOURS_JOB = [
  'I have changed my mind',
  'I am no longer available',
  'I would like to reschedule',
  'I do not feel safe',
  'The vendor has asked me to cancel via message',
  'The vendor is not responding to my messages/unresponsive',
  'A personal emergency has occurred supportive photo evidence required*',
  'Other'
]

class CustomerFitnessBookingDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookingResponse: '',
      displayUpdateSpaBookingModal: false,
      displayCancelBookingModal: false,
      isOtherCancelResaon: false,

      selectedBookingDate: '',
      bookingTimeSlot: '',
      appliedPromoCode: '',
      promoCodeDiscount: '',
      additionalComments: '',
      slotsArrayForDate: [],
      selectedTimeIndex: '',
      amTimeSlotArray: [],
      pmTimeSlotArray: [],
      displayCancelBookingConfirmationModal: false,
      selectedReasonForCancel: '',
      classBookingId: ''

    };
  }

  componentDidMount() {
    const { loggedInDetail } = this.props;
    const parameter = this.props.match.params
    let classBookingId = parameter.classBookingId;
    this.setState({ classBookingId: parseInt(classBookingId), customerId: loggedInDetail.id });
    this.getBookingDetails(classBookingId);
  }

  getBookingDetails = (classBookingId) => {
    const getBookingReqData = {
      booking_class_id: parseInt(classBookingId)
    }
    this.props.enableLoading();
    this.props.showCustomerClass(getBookingReqData, res => {
      console.log(res,"ress")
      this.props.disableLoading();

      if (res.status === 200) {
        console.log('getBookingRes', res.data.data);
        if (res.data.data != null) {
          this.setState({ bookingResponse: res.data.data });
        }

      }
    });
  }

  displaySpaBookingModal = () => {
    this.setState({
      displayUpdateSpaBookingModal: true,
    });

  }

  hideUpdateSpaBookingModal = e => {
    this.setState({
      displayUpdateSpaBookingModal: false,
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
        cancelReasonArray = CANCELLATION_REASON_BEFORE_24_HOURS_JOB;
      } else if (hourDifference > 0 && hourDifference < 24) {
        cancelReasonArray = CANCELLATION_REASON_IN_24_HOURS_JOB;
      } else if (hourDifference < 0) {
        cancelReasonArray = CANCELLATION_REASON_DURING_JOB
      }
      return Array.isArray(cancelReasonArray) && cancelReasonArray.map((el, i) => {
        return <Radio key={`${i}_cancel_reason`} style={radioStyle} value={el}>{el}</Radio>
      })
    }
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onSubmitCancelBookingForm = (values) => {

    const reqData = { 
      booking_id: this.state.classBookingId,
      status: "Cancelled",
      reason: values.cancelreason === "Other" ? values.other_reason : values.cancelreason
    }
    this.props.enableLoading();
    this.props.cancelFitnessServiceBooking(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success('Success', 'Booking has been cancelled successfully.');
        this.setState({
          displayCancelBookingModal: false,
        });
        this.props.history.push('/my-bookings');
      } else if (res.status === 400) {
        toastr.error('Error', 'Booking Already Cancelled');
      }
    });
  }

  onChangeBookingDates = (value) => {
    const selectedDate = moment(value).format('YYYY-MM-DD');
    this.setState({

      selectedBookingDate: selectedDate,
      bookingTimeSlot: '',
      selectedTimeIndex: '',
      amTimeSlotArray: '',
      pmTimeSlotArray: ''
    }, () => {
      if (selectedDate) {
        const req = {
          user_id: this.state.bookingResponse.trader_user_id,
          date: selectedDate
        }
        this.props.getTraderMonthWellbeingBooking(req, this.setTraderTimeSlotAvailability)
      }
    });
  }

  setTraderTimeSlotAvailability = (response) => {
    //
    if (response.status === 200 && response.data) {
      const { month_slots } = response.data;
      const allowed = [this.state.selectedBookingDate];
      const selectedDateSlots = Object.keys(month_slots)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = month_slots[key];
          return obj;
        }, {});
      const timeSlotArray = selectedDateSlots[this.state.selectedBookingDate].slots;
      let regex = /\./g
      let formatedTimeSlotArray = timeSlotArray.map(dots => {
        return {
          time: dots.time.replace(regex, '\:'),
          occupied_by: dots.occupied_by
        }
      });
      let amSlotArray = [];
      let pmSlotArray = [];

      formatedTimeSlotArray.map(value => {
        if (value.time.indexOf("AM") > -1 || value.time.indexOf("am") > -1) {
          amSlotArray.push(value);
        } else if (value.time.indexOf("PM") > -1 || value.time.indexOf("pm") > -1) {
          pmSlotArray.push(value);
        }
      });
      this.setState({
        slotsArrayForDate: formatedTimeSlotArray,
        amTimeSlotArray: amSlotArray,
        pmTimeSlotArray: pmSlotArray,
      });
    }
  }

  onTimeSlotSelect = (selectedTimeIndex, selectedTime) => {
    this.setState({ bookingTimeSlot: selectedTime, selectedTimeIndex: selectedTimeIndex })
  }


  onSubmit = () => {
    const { bookingResponse, classBookingId, selectedBookingDate, bookingTimeSlot, appliedPromoCode, promoCodeDiscount, additionalComments, selectedTimeIndex, amTimeSlotArray, pmTimeSlotArray } = this.state;
console.log(bookingResponse,"booking response")

    const { loggedInDetail } = this.props;

    if (!selectedBookingDate) {
      toastr.warning('Please select booking date.')
    } else if (!bookingTimeSlot) {
      toastr.warning('Please select booking time.')
    } else {

      // let serviceIdsArray = bookingResponse.service_sub_bookings.map(function (item) {
      //   return item['id'];
      // });

      // Convert time 12 hour to 24 hours formate
      // let bookingTimeFormated = convertTime12To24Hour(bookingTimeSlot);

      let updateBeautyServicesRequestData = {
        trader_class_id:bookingResponse.trader_class_id,
        // date: bookingResponse.booking_date,
        booking_type: bookingResponse.booking_type,
        start_time: bookingResponse.booking_time,
        booking_id: bookingResponse.id,
        trader_profile_id:bookingResponse.vendor.trader_profile.id,
        special_note: additionalComments.trim(),
        quantity: bookingResponse.quantity,
        date: moment.isMoment(selectedBookingDate) ? selectedBookingDate.format('YYYY-MM-DD') : selectedBookingDate,
        subscription_id: bookingResponse.subscription_id
        
      };

      console.log(updateBeautyServicesRequestData,"updateBeautyServiceBookingCallback")


      this.props.updateBeautyServiceBookingFitness(updateBeautyServicesRequestData, this.updateBeautyServiceBookingCallback);
    }
  }


  updateBeautyServiceBookingCallback = (response) => {
    console.log(response,"response")

    if (response.status === 200) {
      toastr.success('Success', 'Booking date has been update successfully.');
      this.getBookingDetails(this.state.classBookingId);
      this.setState({
        displayUpdateSpaBookingModal: false,
      });
    } else {
      toastr.warning(response.data && response.data.message ? response.data.message : 'Something went wrong');
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

  renderTotalAmount = (total_amount, tax_amount) => {
    let totalAmountIncTax = parseFloat(total_amount) + parseFloat(tax_amount);
    return totalAmountIncTax.toFixed(2);
  }

  /**
  * @method render
  * @description render component
  */
  render() {
    const { bookingResponse,amTimeSlotArray,pmTimeSlotArray,slotsArrayForDate,selectedBookingDate,displayUpdateSpaBookingModal,selectedTimeIndex,bookingTimeSlot} = this.state;

    // const { customerId, classBookingId, slotsArrayForDate, selectedBookingDate, bookingTimeSlot, additionalComments, selectedTimeIndex, amTimeSlotArray, pmTimeSlotArray } = this.state;
    // let amountToPay = 0;
    // if (bookingResponse !== null && bookingResponse !== '') {
    //   amountToPay = parseFloat(bookingResponse.sub_total) + parseFloat(bookingResponse.taxes_fees ? bookingResponse.taxes_fees : 0)
    //   amountToPay = bookingResponse.promo && bookingResponse.promo != null ? (parseFloat(amountToPay) - parseFloat(bookingResponse.discount_amount)).toFixed(2) : parseFloat(amountToPay);
    // }
    let gst = bookingResponse.gst_percentage ? bookingResponse.gst_percentage:0;
    let taxes = bookingResponse.taxes_fees ? bookingResponse.taxes_fees : 0;
    let final_tax = gst + taxes;
    
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box view-class-tab spa-booking-history-detail customer-beauty-booking-detail' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>View Details</Title>
                  </div>
                  <div className='right'></div>
                </div>
                <div className='sub-head-section block-display'>

                  <div className="back" onClick={this.props.history.goBack}>
                    <LeftOutlined /> <span>Back</span>
                  </div>
                </div>
                <div className="profile-content-box box-shdw-none book-now-popup mt-18">

                  {bookingResponse != null && bookingResponse !== '' &&
                    <Row gutter={30}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <div className="left-parent-detail-block">
                          <Card>
                            <Row gutter={0}>
                              <Col md={24}>
                              <div className="header-detail mb-25" style={{ paddingLeft: "0", paddingRight: "0", paddingTop: "11px", }}>
                                  <div className="title-respone">Your Booking</div>
                                    { bookingResponse.status === "Booking-Done" || bookingResponse.status === "Accepted-Paid" ? (<button className="Accepted-paid"> {bookingResponse.status} </button> ):(<button className=""> {bookingResponse.status}</button>) }  
                                </div>
                                <div className="header-left-detail">
                                  <h2 className="booking-id mt-20"> Booking ID <strong>#{bookingResponse.id}</strong></h2>

                                </div>
                                <div className="body-detail">
                                  <div className="thumb-title-block">
                                    <div className='slide-content'>
                                      <img src={bookingResponse.trader_class.image ? bookingResponse.trader_class.image : DEFAULT_IMAGE_CARD} alt='' />
                                    </div>
                                    <div className='fm-user-details inner-fourth'>
                                      <Title level={4}>
                                        {bookingResponse.trader_class.class_name}
                                      </Title>
                                      <Text className='category-type'>
                                        {bookingResponse.vendor.trader_profile.trader_type.name}
                                      </Text>
                                      <Text><b>Address:</b> </Text>
                                      <Text className='fm-location'>{bookingResponse.vendor.business_location}</Text>
                                    </div>
                                  </div>
                                </div>
                                
                              </Col>
                            </Row>

                            <div className="body-detail">
                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Service:</div>
                                    <div className="sub-title-detail">
                                      {bookingResponse.trader_class.class_name}
                                    </div>
                                  </div>
                                </Col> 
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Date/Time:</div>
                                    <div className="sub-title-detail">
                                      {moment(bookingResponse.booking_date).format("dddd, MMMM Do YYYY")} <br />  {convertTime24To12Hour(bookingResponse.booking_time)}
                                    </div>
                                   
                                  <div className="title-sub-title-detail">
                                    {/* <div className="title">Time:</div>
                                    <div className="sub-title-detail">
                                      {convertTime24To12Hour(bookingResponse.booking_time)}
                                    </div> */}
                                    <div className="title-sub-title-detail">
                                    <div 
                                     onClick={() => this.setState({ 
                                      displayUpdateSpaBookingModal: true, 
                                      selectedBookingDate: new Date(bookingResponse.booking_date),
                                      slotsArrayForDate: [],
                                      amTimeSlotArray: [],
                                      pmTimeSlotArray: [], 
                                      bookingTimeSlot: bookingResponse.booking_time,
                                      })}
                                      type='primary' size='middle' className='change-bkg pnt-curs' style={{textAlign:"left"}}>
                                      Change Booking
                                    </div>
                                  </div>
                                  </div>
                                
                                  </div>
                                </Col>
                                

                              </Row>
                              <Row gutter={15}>
                                <Col md={12}>
                                <div className="title-sub-title-detail">
                                    <div className="title">Instructor:</div>
                                    <div className="sub-title-detail">
                                      {bookingResponse.trader_class.instructor_name}
                                    </div>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Quantity:</div>
                                    <div className="sub-title-detail">
                                      {bookingResponse.quantity}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                             
                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Contact Name:</div>
                                    <div className="sub-title-detail">
                                      {bookingResponse.customer.name}
                                    </div>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Email Address:</div>
                                    <div className="sub-title-detail">
                                      {bookingResponse.customer.email}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <Row gutter={15}>
                                
                                
                              </Row>
                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Phone Number:</div>
                                    <div className="sub-title-detail">
                                      {bookingResponse.customer.mobile_no !== null && bookingResponse.customer.mobile_no !== '' ? `${bookingResponse.customer.mobile_no}` : 'N/A'}
                                    </div>
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
                                <Col xs={24} sm={24} md={3} lg={3}>
                                  1
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={16}>
                                {bookingResponse.trader_class.class_name}
                                </Col>
                                <Col xs={24} sm={24} md={5} lg={5} className="text-right">
                                  ${this.renderTotalAmount(bookingResponse.sub_total , final_tax)}
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div className="price-total-list">
                            <Row gutter={20}>
                              <Col md={14}>Subtotal</Col>
                              <Col md={10} className="text-right">${bookingResponse.sub_total.toFixed(2)} {bookingResponse.trader_class.class_time ? bookingResponse.trader_class.class_time : "" }</Col>
                              <Col md={14}>Taxes and surcharges</Col>
                              <Col md={10} className="text-right">${final_tax.toFixed(2)}</Col>
                              <Col md={14}><b>Total</b></Col>
                              <Col md={10} className="text-right">
                                <div className="total-amount">
                                  <b>${this.renderTotalAmount(bookingResponse.sub_total , final_tax)}</b>
                                  <span>Taxes & fees included</span>
                                </div> </Col>
                            </Row>
                          </div>
                        </div>
                        <div className="right-parent-block-detail special-notes" >
                          <div className="header-detail">
                            <h2>Special Note</h2>
                          </div>
                          <div className="body-detail">
                            <p>{bookingResponse.special_note ? bookingResponse.special_note : 'N/A'}</p>
                            {/* {
                              bookingResponse.status === 'payment_error' &&

                              <Button onClick={() => this.props.history.push({
                                pathname: `/booking-checkout`,
                                state: {
                                  amount: amountToPay,
                                  trader_user_id: bookingResponse.trader_user_id,
                                  customerId,
                                  service_booking_id: classBookingId,
                                  customer_name: bookingResponse.customer.name,
                                  mobile_no: bookingResponse.customer.mobile_no,
                                  phonecode: bookingResponse.customer.phonecode,
                                  payment_type: 'repay',
                                  booking_type: 'beauty',

                                }
                              })} size='middle' className='text-white btn-orange mt-15' >Repay</Button>

                            } */}
                            <Button onClick={() => this.setState({ displayCancelBookingConfirmationModal: true })} size='middle' className='text-white btn-orange mt-15'>Cancel</Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  }
                   <Modal
                    title='Update Booking Date'
                    visible={this.state.displayUpdateSpaBookingModal}
                    className={'custom-modal style1 bookinghandyman-maintemplate-requestbooking change-date-handi boking-wellbeing-spa-modal customer-update-booking-date customer-update-booking-modal'}
                    footer={false}
                    onCancel={this.hideUpdateSpaBookingModal}
                    destroyOnClose={true}
                  >

                    
                    <div className='padding caterers-event'>
                      <Fragment>
                        <div className='wrap fm-step-form'>
                          <Title> Please select a date and time </Title>
                          
                          <Row className="mb-10 shadow-input pl-15 pr-15" align="middle">
                            <Icon className=" pr-2" icon='clock' size='16' />
                            <Col> <Text className="d-flex align-center">   Your currently selected Date is:  {this.state.selectedBookingDate && this.state.bookingTimeSlot && moment(this.state.selectedBookingDate).format("ddd, MMM Do YYYY")} {this.state.bookingTimeSlot.toLowerCase()} </Text></Col>
                          </Row>
                          <Row className="shadow-input mt-30" >
                            <Col span={8}>
                            
                              <Calendar
                                onChange={this.onChangeBookingDates}
                                value={this.state.selectedBookingDate !== '' ? new Date(this.state.selectedBookingDate) : new Date()}
                                minDate={new Date()}
                                showDoubleView={false}
                                next2Label={null}
                                prev2Label={null}
                              />
                            </Col>
                            <Col span={16} className="bdr-left" >
                              <Text className="availability-text">Availability for {this.state.selectedBookingDate !== '' ? moment(this.state.selectedBookingDate).format("dddd, Do MMM, YYYY") : '-'} </Text>
                              <Row className=" ">
                                <Col md={12} className="calendar-right-content">
                                  <Text className="w-100 pm-am-text">AM</Text>
                                  {amTimeSlotArray.length > 0 ? amTimeSlotArray.map((val, index) => {
                                    if (val.occupied_by === 'none') {
                                      return <Button key={`am_active_date_${index}`} size='small' className="slot-btn" style={{ color: selectedTimeIndex === `${index}_am` ? '#FFFFFF' : '#000000', background: selectedTimeIndex === `${index}_am` ? '#1890ff' : 'transparent', borderColor: selectedTimeIndex === `${index}_am` ? '#1890ff' : '#d9d9d9' }} onClick={() => this.onTimeSlotSelect(`${index}_am`, val.time)} >
                                        {val.time.toLowerCase()}
                                      </Button>
                                    } else {
                                      return <Button key={`am_inactive_date_${index}`} size='small' className='slot-btn' disabled>
                                        {val.time.toLowerCase()}
                                      </Button>
                                    }
                                  }) : <Text className=""> No time slot available  </Text>}
                                </Col>
                                <Col md={12}>
                                <div className="calendar-right-content calendar-right-content-pm"> 
                                  <Text className="w-100 pm-am-text">PM</Text>
                                  {pmTimeSlotArray.length > 0 ? pmTimeSlotArray.map((val, index) => {
                                    if (val.occupied_by === 'none') {
                                      return <Button key={`pm_active_date_${index}`} size='small' className="slot-btn" style={{ color: selectedTimeIndex === `${index}_pm` ? '#FFFFFF' : '#000000', background: selectedTimeIndex === `${index}_pm` ? '#1890ff' : 'transparent', borderColor: selectedTimeIndex === `${index}_pm` ? '#1890ff' : '#d9d9d9' }} onClick={() => this.onTimeSlotSelect(`${index}_pm`, val.time)} >
                                        {val.time.toLowerCase()}
                                      </Button>
                                    } else {
                                      return <Button key={`pm_inactive_date_${index}`} size='small' className='slot-btn' disabled>
                                        {val.time.toLowerCase()}
                                      </Button>
                                    }
                                  }) : <Text className=""> No time slot available  </Text>}
                                </div>  
                                </Col>
                              </Row>
                            </Col>
                          </Row >
                          <Divider></Divider>
                          <Row gutter={[45, 30]}>
                            <Col span={24} >
                              <Form.Item
                                label='Comment'
                              >
                                <TextArea defaultValue="additionalComments" maxLength={100} onChange={(e) => { this.setState({ additionalComments: e.target.value }) }} rows={2} placeholder={'Write your message here'} className='shadow-input' />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <div className='steps-action w-100 mb-0 mt-0'>
                              <Button htmlType='submit' type='primary' size='middle' className='btn-blue fm-btn' onClick={() => this.onSubmit()}>
                                Update
                        </Button>
                            </div>
                          </Row>
                        </div >
                      </Fragment>
                    </div>
                  </Modal> 
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
                      <Form.Item className="text-center">
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
  mapStateToProps, { enableLoading, disableLoading, getBeautyServiceBooking,cancelFitnessServiceBooking, updateBeautyServiceBookingFitness, cancelBeautyServiceBooking, getTraderMonthWellbeingBooking, updateBeautyServiceBooking, showCustomerClass }
)(withRouter(CustomerFitnessBookingDetails));