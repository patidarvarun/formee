import React, { Fragment } from 'react';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Col, Input, Layout, Row, Typography, Button, Pagination, Card, Tabs, Form, Select, Rate, Alert, Modal, Radio, Divider } from 'antd';
import { enableLoading, disableLoading, listCustomerServiceBookings, listCustomerBookingsHistory, getCustomerMyBookingsCalender,getFitnessDeleteBooking, wellbeingServiceBookingsRating, fitnessListCustomerClasses, getMyFitnessBookingCalenderList, fitnessListCustomerHistoryClasses, rateTraderClass, fitnessCustomerListAllSubscriptions } from '../../../../../actions'
import AppSidebar from '../../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import './mybooking.less';
import { convertTime24To12Hour, displayCalenderDate, displayDate } from '../../../../../components/common';
import Icon from '../../../../../components/customIcons/customIcons';
import { PAGE_SIZE } from '../../../../../config/Config';
import { getStatusColor, checkBookingForFutureDate, timestampToString } from '../../../../../config/Helper'
import moment from 'moment';
import { Menu,Calendar,Dropdown } from 'antd';
import { required, whiteSpace, maxLengthC } from '../../../../../config/FormValidation'
import { toastr } from 'react-redux-toastr';
import { MY_BOOKING, BOOKING_HISTORY, MEMBERSHIP_LISTING } from './static_response';
import { DEFAULT_IMAGE_CARD } from '../../../../../config/Config';
import PDFInvoiceModal from "../../../../common/PDFInvoiceModal";
import { DeleteFilled, MinusCircleOutlined } from "@ant-design/icons";
import LeaveReviewModel from "../../../../booking/common/LeaveReviewModel";



const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select

// Pagination
function paginationItemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
  }
  if (type === 'next') {
    return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
  }
  return originalElement;
}

function paginationItemRenderHistory(current, type, originalElement) {
  if (type === 'prev') {
    return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
  }
  if (type === 'next') {
    return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
  }
  return originalElement;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: 'left',
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: 'align-center pt-20'
};

class FitnessMyBookings extends React.Component {
  constructor(props) {
    super(props);

    let input = new Date();
    let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
    let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0)

    let first = input.getDate() - input.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6
    let firstday = new Date(input.setDate(first)).toUTCString();
    let lastday = new Date(input.setDate(last)).toUTCString();

    this.state = {
      customerBookingList: [],
      page: '1',
      order: 'desc',
      page_size: 10,
      customer_id: '',
      key: 1,
      customerBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      customerCalenderBookingList: [],
      totalRecordCustomerServiceBooking: 0,
      totalRecordCustomerSpaBookingHistory: 0,
      weeklyDates: [],
      calenderView: 'month',
      monthStart: moment(startOfMonth).format('YYYY-MM-DD'),
      monthEnd: moment(endOfMonth).format('YYYY-MM-DD'),
      weekStart: moment(firstday).format('YYYY-MM-DD'),
      weekEnd: moment(lastday).format('YYYY-MM-DD'),
      index: '',
      customerRating: '',
      showReviewModal: false,
      bookingListCalenderView: 'newest',
      confirmDeleteBooking: false,
      selectedBookedClassDetails: '',
      selectedBookedClassId: '',
      memberShipBookingList: [],
      selectedHistoryBookedClassId: '',
      selectedBookedHistoryClassDetails: '',
      leaveReviewModal: false,
      searchKeyword: "",
      show: false,
      showMoreBookings:false,
      showMoreHistory:false,
    };
  }

  /**
    * @method componentDidMount
    * @description called after render the component
    */
  componentDidMount() {
    this.props.enableLoading()
    this.getCustomerServiceBooking(this.state.page);
    this.getBookingsForCalenderDate(this.state.selectedBookingDate);
    this.createWeekCalender();
  }

  componentWillReceiveProps(nextProps) {
    const { key } = this.state;
    if (this.state.searchKeyword != nextProps.searchKeyword) {
      this.setState(
        {
          searchKeyword: nextProps.searchKeyword,
          page: "1",
          customerBookingList: [],
          totalRecordCustomerServiceBooking: 0,
          memberShipBookingList: [],
          totalRecordCustomerServiceBooking: 0,
          customerBookingHistoryList: [],
          totalRecordCustomerSpaBookingHistory: 0,
        },
        () => {
          if (key == '1') {
            this.getCustomerServiceBooking(1);
          } else if (key == '2') {
            this.getFitnessCustomerListAllSubscriptions(1);
          } else if (key == '3') {
            this.getCustomerBookingHistory(1);
          }
        }
      );
    }
  }

  onTabChange = (key, type) => {
    this.setState({ key: key, selectedBookedClassId: '', selectedBookedClassDetails: '', selectedHistoryBookedClassId: '', selectedBookedHistoryClassDetails: '' });
    if (key == '1') {
      this.getCustomerServiceBooking(1);
    } else if (key == '2') {
      this.getFitnessCustomerListAllSubscriptions(1);
    } else if (key == '3') {
      this.getCustomerBookingHistory(1);
    }
  }


  createWeekCalender = () => {
    let curr = new Date();
    let weekArray = []
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i
      let day = new Date(curr.setDate(first));
      weekArray.push(day)
    }
    let newWeekDatesArray = weekArray.map(d => d.toString());
    this.setState({
      weeklyDates: newWeekDatesArray
    });
  }

  renderCalender = () => {
    const { weeklyDates, selectedBookingDate } = this.state
    return (
      <div>
        <div className="month">
          <ul>
            <li><span>{displayCalenderDate(selectedBookingDate ? selectedBookingDate : Date.now())}</span></li>
          </ul>
        </div>
        <ul className="weekdays">
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <ul className="days">
          {weeklyDates.length && this.renderDates(weeklyDates)}
        </ul>
      </div>
    )
  }

  renderDates = (dates) => {
    const { selectedBookingDate, index } = this.state
    return dates.map((el, i) => {
      let selectedDate = selectedBookingDate;
      let clickedDate = moment(new Date(el)).format('YYYY-MM-DD');

      return (
        <li key={`${i}_weekly_date`} onClick={() => {
          this.setState({ index: i, selectedBookingDate: moment(new Date(el)).format('YYYY-MM-DD') }, () => {
            this.getBookingsForCalenderDate(el);
          });
        }} style={{ cursor: 'pointer' }}>
          <span className={selectedDate == clickedDate ? 'active' : ''}>{displayDate(el)}</span>
        </li>
      )
    })
  }

  getFitnessCustomerListAllSubscriptions = () => {
    const { id } = this.props.loggedInUser;

    const { bookingListCalenderView, monthStart, monthEnd, weekStart, weekEnd,searchKeyword } = this.state;
    console.log(searchKeyword,"searchkeyword fitness")

    let fromDate, toDate;

    // if (bookingListCalenderView === 'week') {
    //   fromDate = weekStart;
    //   toDate = weekEnd;
    // } else if (bookingListCalenderView === 'month') {
    //   fromDate = monthStart;
    //   toDate = monthEnd;
    // } else if (bookingListCalenderView === 'today') {
    //   fromDate = moment().format('YYYY-MM-DD');
    //   toDate = moment().format('YYYY-MM-DD');
    // }

    const reqData = {
      //order: this.state.order,
      // page_size: this.state.page_size,
      search: searchKeyword,
      customer_id: id,
      order: bookingListCalenderView == "newest" ? "desc" : "asc",
      // from_date: fromDate,
      // to_date: toDate
    };
    this.props.enableLoading();
    this.props.fitnessCustomerListAllSubscriptions(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        //this.setState({ memberShipBookingList: MEMBERSHIP_LISTING});
        this.setState({ memberShipBookingList: res.data.data, totalRecordCustomerServiceBooking: res.data.data.total_records ? res.data.data.total_records : 0 })
      }
    })
  }


  getCustomerServiceBooking = (page) => {
    const { id } = this.props.loggedInUser;
    const { bookingListCalenderView, monthStart, monthEnd, weekStart, weekEnd ,searchKeyword,customerBookingList,totalRecordCustomerServiceBooking} = this.state;
    let fromDate, toDate;

    // if (bookingListCalenderView === 'week') {
    //   fromDate = weekStart;
    //   toDate = weekEnd;
    // } else if (bookingListCalenderView === 'month') {
    //   fromDate = monthStart;
    //   toDate = monthEnd;
    // } else if (bookingListCalenderView === 'today') {
    //   fromDate = moment().format('YYYY-MM-DD');
    //   toDate = moment().format('YYYY-MM-DD');
    // }

    const reqData = {
      page: page,
      // order: this.state.order,
      search: searchKeyword,
      page_size: this.state.page_size,
      customer_id: id,
      // from_date: fromDate,
      // to_date: toDate
      order: bookingListCalenderView == "newest" ? "desc" : "asc",
    };
    this.props.enableLoading();
    this.props.fitnessListCustomerClasses(reqData, (res) => {
      console.log(res,"booking res")
      this.props.disableLoading();
      if (res.status === 200 && res.data.data.length !== 0) {
        let records = res.data.data;
        let totalRecords = res.data.total_record ? res.data.total_record : 0;
        let newList = [...customerBookingList, ...records];
        //this.setState({ customerBookingList: MY_BOOKING});
        this.setState({ 
          page:page,
          customerBookingList: newList, 
          totalRecordCustomerServiceBooking: totalRecords,
          showMoreBookings: records })
      }
    })
  }

 

  handleBookingPageChange = (e) => {
    const {page, key} = this.state;
    console.log(e,"handle",key);
    if(key === 1){
      console.log("i m go")
      this.getCustomerServiceBooking(+page + 1);
    } else if (key === 3) {
      this.getCustomerBookingHistory(+page + 1);
    }
   
  }

  getCustomerBookingHistory = (page) => {
    const { id } = this.props.loggedInUser;
    const { bookingListCalenderView, monthStart, monthEnd, weekStart, weekEnd,searchKeyword,customerBookingHistoryList,totalRecordCustomerSpaBookingHistory } = this.state;
    let fromDate, toDate;
    // if (bookingListCalenderView === 'week') {
    //   fromDate = weekStart;
    //   toDate = weekEnd;
    // } else if (bookingListCalenderView === 'month') {
    //   fromDate = monthStart;
    //   toDate = monthEnd;
    // } else if (bookingListCalenderView === 'today') {
    //   fromDate = moment().format('YYYY-MM-DD');
    //   toDate = moment().format('YYYY-MM-DD');
    // }

    const reqData = {
      page: page,
      page_size: this.state.page_size,
      customer_id: id,
      // from_date: fromDate,
      // to_date: toDate
      order: bookingListCalenderView == "newest" ? "desc" : "asc",
      search: searchKeyword,
    };
    this.props.enableLoading();
    this.props.fitnessListCustomerHistoryClasses(reqData, (res) => {
      console.log(res,"resss@@@@@@@@@@@@@@@@@@@@")
      this.props.disableLoading();
      if (res.status === 200) {
        let records = res.data.data;
        let totalRecords = res.data.total_records ? res.data.total_records : 0;
        let newList = [...customerBookingHistoryList, ...records];
        //this.setState({ customerBookingHistoryList: BOOKING_HISTORY });
        this.setState({ customerBookingHistoryList: newList,
          page: page,
           totalRecordCustomerSpaBookingHistory: totalRecords,
           showMoreHistory: records })
      }
    })
  }

  handleHistoryBookingPageChange = (e) => {
    this.getCustomerBookingHistory(e)
  }

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0
  }

  displaySelectedClassDetails = (data) => {
    const { selectedBookedClassId } = this.state;
    console.log(data.id,"dtaaaaaa",selectedBookedClassId)
    
    if (selectedBookedClassId === data.id) {
      this.setState({ selectedBookedClassId: '', selectedBookedClassDetails: '' });
    } else {
      this.setState({ selectedBookedClassId: data.id, selectedBookedClassDetails: data });
    }
  }

  renderUpcomingBooking = () => {
    const {selectedBookedClassId} = this.state;
    const {email} = this.props.loggedInUser;
    if (this.state.customerBookingList && this.state.customerBookingList.length > 0) {
      return (
        <Fragment>
          {this.state.customerBookingList.map((value, i) => {
            console.log(value,"ddddddddddd")
            let disPlaystatus = checkBookingForFutureDate(value.booking_date, value.start_time, value.status);
            
            return <div key={value.id} className="my-new-order-block booking-box-content" onClick={() => {
            
                  if (this.state.selectedBookedClassId === value.id) {

                  } else {
                    console.log("testing")
                    this.setState({
                      selectedBookedClassId: value.id,
                      selectedBookedClassDetails: value,

                    });
                  }
                }} >
                
              <Row gutter={0}>
                <Col xs={24} sm={24} md={24} lg={18} xl={18} className="booking-left">
                  <div className="odr-no"><h4>{disPlaystatus}</h4><span className="pickup">{value.trader_class.class_name}</span></div>
                  <div className="order-profile booking-pro mb-5">
                    <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                    <div className="profile-pic">
                      <img alt="test" src={value.vendor.image ? value.vendor.image : require('../../../../../assets/images/avatar3.png')} />
                    </div>
                    <div className="profile-name">
                      {value.vendor.name}
                    </div>
                    </div>
                    <div className="pf-rating">
                        <Text>{this.formateRating(value.trader_rating)}</Text>
                        <Rate disabled defaultValue={this.formateRating(value.trader_rating)} />
                      </div>
                  </div>
                  
                  <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <div className="fm-eventb-date">
                      <h3>Issue Date</h3>
                      <span>
                        {moment(value.booking_date).format(
                          "MMMM DD, YYYY"
                        )}
                      </span>
                    </div>
                  </Col>

                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        xl={17}
                        className="fm-desc-wrap pl-0"
                        >
                        <Row gutter={0} className=" wellbilling-fitness">
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={16}
                            className="booking-request"
                          >
                            <div className="fm-eventb-desc">
                              <h3>Class:</h3>
                              <span className="fm-eventb-content">
                              
                              {value.trader_class.class_name}
                              </span>
                               {value.id === selectedBookedClassId ? (
                                <Col xs={24} sm={24} md={24} lg={12} xl={24}>
                                  <div >
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-8 ant-col-xl-8">
                                          <h3>Duration:</h3>

                                          <span className="fm-eventb-content">
                                            {value.duration} hours
                                          </span>
                                        </Col>
                                        <Col className="ant-col-lg-8 ant-col-xl-8">
                                          <h3>Instructor: </h3>

                                          <span className="fm-eventb-content">
                                            {value.trader_class.instructor_name}
                                          </span>
                                        </Col>
                                        <Col className="ant-col-lg-8 ant-col-xl-8">
                                          <h3>Room: </h3>

                                          <span className="fm-eventb-content">
                                          {value.trader_class.room}
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-8 ant-col-xl-8">
                                          <h3>Contact Name:</h3>

                                          <span className="fm-eventb-content">
                                            {value.customer_name}
                                          </span>
                                        </Col>
                                        <Col className="ant-col-lg-8 ant-col-xl-8">
                                          <h3>Email: </h3>

                                          <span className="fm-eventb-content">
                                            {email}
                                          </span>
                                        </Col>
                                        <Col className="ant-col-lg-8 ant-col-xl-8">
                                          <h3>Phone Number: </h3>

                                          <span className="fm-eventb-content">
                                            {value.customer_phone}
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                  
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Special Note:</h3>

                                      <span className="fm-eventb-content">
                                          {value.special_note}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-10">
                                      <span className="fm-eventb-content">
                                        You can reschedule or cancel your
                                        appointment free of charge,
                                        <br /> with minimum 24 hour notice.
                                      </span>
                                    </div>
                                  </div>
                                </Col>
                            ) : (
                                    ""
                                  )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
             
                </Row>
                </Col>
                

                <Col xs={24} sm={24} md={24} lg={6} xl={6} className="align-right booking-right-section">
                  <div className="bokng-time-date spa-date fs-13">
                    <span className="mb-0">{moment(value.created_at).format("MMM D, YYYY")}</span>
                    <span>{value.booking_time ? convertTime24To12Hour(value.booking_time) : ' '} - {value.booking_end_time ? convertTime24To12Hour(value.booking_end_time) : ''}</span>
                  </div>
                  <div className="orange-small mb-15"><span>{value.category_name ? value.category_name : 'N/A'}</span><span>{value.sub_category_name ? value.sub_category_name : 'N/A'}</span></div>
                  <Button
                    type='default'
                    className={getStatusColor(disPlaystatus)} 
                    onClick={(e) => {
                      // e.stopPropagation();

                      window.location.assign(
                        `/fitness-my-booking-detail/${value.id}`
                      );
                    }}
                  >
                    {"Edit-Booking"}
                  </Button>

                  {value.id === selectedBookedClassId && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <MinusCircleOutlined
                          onClick={() =>
                            this.setState({
                              selectedBookedClassId: "",
                              selectedBookingClassDetails: "",
                            })
                          }
                        />
                      </div>
                    )}
                </Col>
              </Row>
            </div>

          })}
          {/* <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleBookingPageChange}
            total={this.state.totalRecordCustomerServiceBooking} //total number of card data available
            itemRender={paginationItemRender}
            className={'mb-20'} 
          /> */}
          {this.state.showMoreBookings.length >= 10 ? (

          <div className="show-more">
            <a onClick={(e) => this.handleBookingPageChange(e)} className="show-more" >
              Show More
            </a>
          </div>
         ): ""} 
        </Fragment>
      )
    } else {
      return <div>
        <Alert message="No records found." type="error" />
      </div>
    }
  }

  displaySelectedHistoryClassDetails = (data) => {
    console.log(data,"data")
    const { selectedHistoryBookedClassId,selectedBookedHistoryClassDetails } = this.state;
    if (selectedHistoryBookedClassId === data.id) {
      this.setState({ selectedHistoryBookedClassId: '', selectedBookedHistoryClassDetails: '' });
      
    } else {
      this.setState({ selectedHistoryBookedClassId: data.id, selectedBookedHistoryClassDetails: data });
      
    }
  }

  renderHistoryBooking = () => {

    if (this.state.customerBookingHistoryList && this.state.customerBookingHistoryList.length > 0) {
      console.log(selectedBookedHistoryClassDetails,"dataaaaaaaaaaaaaaaaaaaaa")
      const {
        customerBookingHistoryList,
        page,
        selectedHistoryBookedClassId,
        selectedBookedHistoryClassDetails,
        selectedBookedClassId,
        selectedBookedClassDetails,
      } = this.state;
      console.log(this.state.customerBookingHistoryList,"fitness")
     
    const {email} = this.props.loggedInUser;
    const menuicon = (
        <Menu>
          <Menu.Item key="0">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  if (selectedHistoryBookedClassId) {
                    window.location.assign(
                      `/fitness/customer-booking-history-detail/${selectedBookedHistoryClassDetails.id}`
                    );
                  }
                }}
              >
                <span className="edit-images">
                  {" "}
                  <img
                    src={require("../../../../classified-templates/user-classified/icons/view.svg")}
                  />
                </span>{" "}
                <span>View Details</span>
              </a>
            </div>
          </Menu.Item>
          <Menu.Item key="1">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.setState({ receiptModalEventBooking: true });
                }}
              >
                <span className="edit-images">
                  {" "}
                  <img
                    src={require("../../../../classified-templates/user-classified/icons/view.svg")}
                  />
                </span>{" "}
                <span>View Invoice</span>
              </a>
            </div>
          </Menu.Item>
          <Menu.Item key="2">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.setState({ leaveReviewModal: true });
                }}
              >
                <span className="edit-images">
                  <img
                    src={require("../../../../classified-templates/user-classified/icons/edit.svg")}
                    alt=""
                  />{" "}
                </span>{" "}
                <span>Leave Review</span>
              </a>
            </div>
          </Menu.Item>
          <Menu.Item key="3">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.setState({ confirmDeleteBooking: true });
                }}
              >
                <span className="edit-images">
                  <img
                    src={require("../../../../../assets/images/icons/delete.svg")}
                    alt=""
                  />{" "}
                </span>{" "}
                <span>Delete</span>
              </a>
            </div>
          </Menu.Item>
        </Menu>
      );
      return (
        <Fragment>
          {this.state.customerBookingHistoryList.map((value, i) => {
            
            return ( <div key={value.id} className="my-new-order-block booking-box-content" 
                
                onClick={() => {
                  if (selectedBookedClassId === value.id) {
                  } else {
                    console.log("testing")
                    this.setState({
                      selectedBookedClassId: value.id,
                      selectedBookedClassDetails: value,
                      selectedHistoryBookedClassId :value.id,
                      selectedBookedHistoryClassDetails: value,
                    });
                  }
                }} >

                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18} className="booking-left">
                    <div className="odr-no"><h4>Past</h4><span className="pickup">{value.trader_class.class_name}</span></div>
                    <div className="order-profile  booking-pro mb-5">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic">
                          <img alt="test" src={value.vendor.image ? value.vendor.image : require('../../../../../assets/images/avatar3.png')} />
                        </div>
                        <div className="profile-name">
                          {value.vendor.name}
                        </div>
                      </div> 
                      <div className="pf-rating">
                        <Text>{this.formateRating(value.trader_class.trader_ratings.length > 0 ? value.trader_class.trader_ratings[0].rating : 0.0)}</Text>
                        <Rate disabled defaultValue={this.formateRating(value.trader_class.trader_ratings.length > 0 ? value.trader_class.trader_ratings[0].rating : 0.0)} />
                      </div>
                    </div>
                    
                    <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <div className="fm-eventb-date">
                      <h3>Issue Date</h3>
                      <span>
                        {moment(value.booking_date).format(
                          "MMMM DD, YYYY"
                        )}
                      </span>
                    </div>
                  </Col>

                 <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={8}
                    xl={17}
                    className="fm-desc-wrap pl-0">
                    <Row gutter={0} className=" wellbilling-fitness">
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        xl={16}
                        className="booking-request"
                      >
                        <div className="fm-eventb-desc">
                          <h3>Class:</h3>
                          <span className="fm-eventb-content">
                          
                           {value.trader_class.class_name}
                          </span>
                           {value.id === selectedBookedClassId ? (
                            <Col xs={24} sm={24} md={24} lg={12} xl={24}>
                              <div className="">
                                <div className="fm-eventb-desc mt-20">
                                  <Row>
                                    <Col className="ant-col-lg-8 ant-col-xl-8">
                                      <h3>Duration:</h3>

                                      <span className="fm-eventb-content">
                                        {value.duration} hours
                                      </span>
                                    </Col>
                                    <Col className="ant-col-lg-8 ant-col-xl-8">
                                      <h3>Instructor: </h3>

                                      <span className="fm-eventb-content">
                                        {value.trader_class.instructor_name}
                                      </span>
                                    </Col>
                                    <Col className="ant-col-lg-8 ant-col-xl-8">
                                      <h3>Room: </h3>

                                      <span className="fm-eventb-content">
                                       {value.trader_class.room}
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="fm-eventb-desc mt-20">
                                  <Row>
                                    <Col className="ant-col-lg-8 ant-col-xl-8">
                                      <h3>Contact Name:</h3>

                                      <span className="fm-eventb-content">
                                        {value.customer_name}
                                      </span>
                                    </Col>
                                    <Col className="ant-col-lg-8 ant-col-xl-8">
                                      <h3>Email Address: </h3>

                                      <span className="fm-eventb-content">
                                        {email }
                                      </span>
                                    </Col>
                                    <Col className="ant-col-lg-8 ant-col-xl-8">
                                      <h3>Phone Number: </h3>

                                      <span className="fm-eventb-content">
                                        {value.customer_phone}
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Special Note:</h3>

                                  <span className="fm-eventb-content">
                                   additional_comments
                                  </span>
                                </div>
                                <div className="fm-eventb-desc mt-10">
                                  <span className="fm-eventb-content">
                                    You can reschedule or cancel your
                                    appointment free of charge,
                                    <br /> with minimum 24 hour notice.
                                  </span>
                                </div>
                              </div>
                            </Col>
                           ) : (
                            ""
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row> 
                  </Col>

               
                  <Col xs={24} sm={24} md={24} lg={6} xl={6} className="align-right booking-right-section">
                    <div className="bokng-hsty-hour-price spa-date fs-13">
                      <div className="hour mb-0" >
                      <span> {moment(value.created_at).format("MMM D, YYYY")}</span><br />
                    <span>{value.booking_time ? convertTime24To12Hour(value.booking_time) : ' '} - {value.booking_end_time ? convertTime24To12Hour(value.booking_end_time) : ''}</span> </div>
                      <div className="price">${value.total}</div>
                      <div className="orange-small" style={{ marginBottom:"0", marginTop:"10px",}}><span>{value.trader_class.trader_user_profile.trader_type.name ? value.trader_class.trader_user_profile.trader_type.name : 'N/A'}</span><span>{value.trader_class.trader_user_profile.trader_service.name ? value.trader_class.trader_user_profile.trader_service.name : 'N/A'}</span>
                      {this.displayReviewRatingSection(value)}
                      <div className="edit-delete-dot ml-5"  style={{ marginBottom:"5px",}}>
                        <Dropdown
                          overlay={menuicon}
                          trigger={["click"]}
                          overlayClassName="show-phone-number retail-dashboard"
                          placement="bottomRight"
                          arrow
                          // onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            width="5"
                            height="17"
                            viewBox="0 0 5 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.71649 4.81189C3.79054 4.81189 4.66931 3.93312 4.66931 2.85907C4.66931 1.78502 3.79054 0.90625 2.71649 0.90625C1.64244 0.90625 0.763672 1.78502 0.763672 2.85907C0.763672 3.93312 1.64244 4.81189 2.71649 4.81189ZM2.71649 6.76471C1.64244 6.76471 0.763672 7.64348 0.763672 8.71753C0.763672 9.79158 1.64244 10.6704 2.71649 10.6704C3.79054 10.6704 4.66931 9.79158 4.66931 8.71753C4.66931 7.64348 3.79054 6.76471 2.71649 6.76471ZM2.71649 12.6232C1.64244 12.6232 0.763672 13.5019 0.763672 14.576C0.763672 15.65 1.64244 16.5288 2.71649 16.5288C3.79054 16.5288 4.66931 15.65 4.66931 14.576C4.66931 13.5019 3.79054 12.6232 2.71649 12.6232Z"
                              fill="#C5C7CD"
                            />
                          </svg>
                        </Dropdown>

                        
                      </div>
                      </div>
                      {value.id === selectedBookedClassId && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <MinusCircleOutlined
                          onClick={() =>
                            this.setState({
                              selectedBookedClassId: "",
                              selectedBookingClassDetails: "",
                            })
                          }
                        />
                      </div>
                    )}
                    </div>
                  </Col>
                </Row>
              </div>
            )
          })
          }
           {this.state.showMoreHistory.length >= 10 ?  (

          <div className="show-more">
            <a onClick={(e) => this.handleBookingPageChange(e)} className="show-more" >
              Show More
            </a>
          </div>
          ): ""}
        </Fragment>
      )
    } else {
      return <div>
        <Alert message="No records found." type="error" />
      </div>
    }
  }

  toggle = () => this.setState((currentState) => ({show: !currentState.show}));

  renderMemberShipRowData = (data) => {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    

    if (this.state.memberShipBookingList && this.state.memberShipBookingList.length > 0) {
      return (
        <Fragment>
          {this.state.memberShipBookingList.map((value, i) => {
           
            return (
              <tr  style={{ borderColor: value.id === this.state.selectedBookedClassId ? '#ffc468' : '#fff', borderWidth: 2, borderStyle: 'solid' }} > {console.log('this.state.selectedBookedClassId',this.state.selectedBookedClassId)}
                <td>{value.package_name}</td>
                <td>{value.package_id}</td>
                <td className='subscription-type'>{value.subscription_type ? value.subscription_type : 'N/A'}  <button className={this.state.selectedBookedClassId === value.id ? 'arrow show-button' : 'arrow hide-button'} onClick={(e) => { e.stopPropagation();  this.displaySelectedClassDetails(value) }}>{this.state.selectedBookedClassId === value.id ? 'show' : 'hide'}</button> 
                
                <div>{this.state.selectedBookedClassId === value.id ? (value.package_description) : ""}</div>
                
                </td>
                
                <td>${value.package_price.toFixed(2)}</td> 
                <td className='sub-button-ac'>{(value.ending_date ===  date) ? <button className="Expired">Expired</button>:
                 (moment(value.ending_date).format("DD"))-(moment(value.ending_date).startOf("week").format("DD")) === (6||5||4||3||2||1) ? <button className="Ending">Ending</button> :
                  <button className="Active">Active</button> }</td>
                <td>{moment(value.ending_date).format('DD/MM/YY')}</td>
              </tr>
            
                 
               
            )
          })}
        </Fragment>
      )
    } else {
      return <div>
        <Alert message="No records found." type="error" />
      </div>
    }
  }

  renderMemberShipListing = () => {
    return (
      <Fragment>
        <div className="my-new-order-block">
          <Row gutter={0}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="fr-tbl-fit-wrap">
                <table className="fr-fitness-tbl fitness-table">
                  <tr>
                    <th>Name</th>
                    <th>Membership No.</th>
                    <th>Membership </th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Expiry Date</th>
                  </tr>
                  {this.renderMemberShipRowData()}
                </table>
              </div>
            </Col>
          </Row>
        </div>
      </Fragment>
    )
  }


  getBookingsForCalenderDate = (date) => {
    const { id } = this.props.loggedInUser;
    const selectedDate = moment(date).format('YYYY-MM-DD');
    this.setState({
      selectedBookingDate: selectedDate,
    }, () => {
      if (selectedDate) {
        const req = {
          //customer_id: id,
          from_date: selectedDate,
          to_date: selectedDate,
          booking_type: 'fitness'
        }
        this.props.getMyFitnessBookingCalenderList(req, this.getCustomerMyBookingsCalenderCallback)
      }
    });
  }

  onChangeBookingDates = (value) => {
    this.getBookingsForCalenderDate(value);
  }

  getCustomerMyBookingsCalenderCallback = (response) => {
    if (response.status === 200 && response.data) {
      
      this.setState({ customerCalenderBookingList: response.data.data });
    }
  }

  renderBokingCalenderItems = () => {
    const { customerCalenderBookingList } = this.state;
    if (customerCalenderBookingList && customerCalenderBookingList.length > 0) {
      return (
        <ul className="flex-container wrap">
          {customerCalenderBookingList.map((value, i) => {
            return (
              <li>
                <div className="appointments-label">{value.class_name}</div>
                {/* <div class="appointments-label">{value.service_sub_bookings[0].wellbeing_trader_service.name}</div> */}
                {/* <div className="appointments-time">{value.start_time}<span><img src={require('../../../assets/images/icons/delete.svg')} alt='delete' /></span></div> */}
                <div className="appointments-time">{convertTime24To12Hour(value.booking_time)}</div>
              </li>
            )
          })
          }
        </ul>
      )
    } else {
      return <div className="error-box">
        <Alert message="No Appointments" type="error" />
      </div>

    }
  }

  onChangeCalenderView = (view) => {
    this.setState({ calenderView: view, selectedBookingDate: moment(new Date()).format('YYYY-MM-DD') }, () => {
      if (view == 'week') {
        this.createWeekCalender();
      }
      this.getBookingsForCalenderDate(new Date());
    });
  }

  hideReviewModalCancel = () => {
    this.setState({ showReviewModal: false });
  }

  /**
    * @method handleRatingChange
    * @description handle rating selection
    */
  handleRatingChange = e => {
    this.setState({
      customerRating: e.target.value,
    });
  };

  /**
     * @method onFinish
     * @description handle on submit
     */
  onFinishReview = (values) => {
    const { selectedBookedHistoryClassDetails } = this.state;
    
    const requestData = {
      trader_class_id: selectedBookedHistoryClassDetails.trader_class_id,
      trader_id: selectedBookedHistoryClassDetails.trader_class.trader_user_profile_id,
      title: values.review,
      review: values.review,
      rating: values.rating
    }

    this.props.enableLoading();
    this.props.rateTraderClass(requestData, res => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success('Success', 'Review has been submitted to vendor successfully.');
      }
      this.setState({ showReviewModal: false })
    });
  }

  onChangeBookingListDurationFilter = (view) => {
    this.setState({ bookingListCalenderView: view }, () => {
      if (this.state.key == '1') {
        this.getCustomerServiceBooking(1);
      } else if (this.state.key == '2') {
        this.getFitnessCustomerListAllSubscriptions();
      } else if (this.state.key == '3') {
        this.getCustomerBookingHistory(1);
      }
    });
  }

  displayReviewRatingSection = (data) => {
    console.log('displayReviewRatingSection==>', data)
    if (data.status === 'Completed' && data.valid_trader_rating && data.valid_trader_rating != null) {
      return <Rate defaultValue={data.value.trader_class.trader_ratings.length > 0 ? data.trader_class.trader_ratings[0].rating : 0.0} />
    } else if (data.status === 'Completed' && data.valid_trader_rating && data.valid_trader_rating === null) {
      return <Button type='default' onClick={(e) => { e.stopPropagation(); this.setState({ showReviewModal: true, selectedBookedHistoryClassDetails: data }) }} className="gray-btn"> Review </Button>
    }
  }


  deleteBooking = () => {
    const { selectedBookedHistoryClassDetails,selectedHistoryBookedClassId } = this.state;
    const { loggedInUser } = this.props;
    console.log(`loggedInUser`, loggedInUser);
    console.log(`selectedHistoryBookingDetail`, selectedBookedHistoryClassDetails);
    console.log(`selectedHistoryBookingDetail`, selectedHistoryBookedClassId);
    let reqData = {
      fitness_class_customer_booking_id:selectedBookedHistoryClassDetails.id,
	    customer_id:selectedBookedHistoryClassDetails.customer.id,
    };
    this.props.enableLoading();
    this.props.getFitnessDeleteBooking(reqData, (res) => {
      this.props.disableLoading();
      console.log(`delete res`, res);
      if (res.status == 200) {
        toastr.success("Success", res.data.message);
        this.setState(
          {
            confirmDeleteBooking: false,
            page: "1",
            customerBookingHistoryList: [],
            totalRecordCustomerSpaBookingHistory: 0,
          },
          () => {
            this.getCustomerBookingHistory(1);
          }
        );
      } else {
        toastr.error("Error occured", "Please try again later.");
      }
    });
  };


  /**
   * @method render
   * @description render component  
   */
  render() {
    const { customerRating, leaveReviewModal, showReviewModal ,confirmDeleteBooking, selectedBookingDate,bookingListCalenderView, customerCalenderBookingList,receiptModalEventBooking, calenderView, selectedBookedClassDetails, selectedBookedHistoryClassDetails } = this.state
   console.log(selectedBookedHistoryClassDetails,"dffffffffff")
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Layout>
        <Layout>
          {/* <AppSidebar history={history} /> */}
          <Layout>
            <div className='my-profile-box view-class-tab shadow-none booking-inner-out' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                {/* <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>My Bookings</Title>
                  </div>
                  <div className='right'></div>
                </div>
                <div className='sub-head-section'>
                  <Text>&nbsp;</Text>
                </div> */}
                <div className="pf-vend-restau-myodr profile-content-box pf-vend-spa-booking pf-user-fitness-mybooking mt-0 shadow-none">
                  <Row className="tab-full" gutter={30}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Card
                        className='profile-content-shadow-box'
                        bordered={false}
                        title=''
                      >
                        <Tabs className="tab-box"  onChange={this.onTabChange} defaultActiveKey="1">
                          <TabPane tab="Bookings" key="1">
                             <h3>You have {this.state.totalRecordCustomerServiceBooking} activities</h3> 
                            {this.renderUpcomingBooking()}
                          </TabPane>
                          <TabPane tab="Membership" key="2">
                            {this.renderMemberShipListing()}
                          </TabPane>
                          <TabPane tab="History" key="3">
                            <h3>You have {this.state.totalRecordCustomerSpaBookingHistory} items</h3> 
                            {this.renderHistoryBooking()}
                          </TabPane>
                        </Tabs>
                        <div className="card-header-select"><label>Show:</label>
                          <Select onChange={(e) => this.onChangeBookingListDurationFilter(e)} defaultValue={bookingListCalenderView}>
                          <Option value="newest">New - Old</Option>
                              <Option value="oldest">Old - New</Option>
                            
                          </Select></div>
                      </Card>
                    </Col>
                   
                  </Row>
                </div>
              </div>
            </div>

            {receiptModalEventBooking && (
              <PDFInvoiceModal
                visible={receiptModalEventBooking}
                onClose={() => {
                  this.setState({ receiptModalEventBooking: false });
                }}
                isViewInvoice={true}
                enquiryDetails={selectedBookedHistoryClassDetails}
                booking_type="fitness"
              />
            )}

            {leaveReviewModal && (
              <LeaveReviewModel
                visible={leaveReviewModal}
                onCancel={() => {
                  this.setState({ leaveReviewModal: false });
                }}
                booking_type="fitness"
                // bookingDetail={selectedHistoryDetail && selectedHistoryDetail}
                bookingDetail={selectedBookedHistoryClassDetails}
                
                  //  selectedBookedHistoryClassDetails && {
                  //    id: selectedBookedHistoryClassDetails.trader_class.id,
                  //    user: selectedBookedHistoryClassDetails.trader_class,
                  //    name: selectedBookedHistoryClassDetails.trader_class
                  //      .business_name,
                  //    image_thumbnail:
                  //      selectedBookedHistoryClassDetails.trader_class.image_thumbnail,
                  //  }
                // }
                 // callNext={this.getDetails}
                callNext={() => {
                  this.setState(
                    {
                      leaveReviewModal: false,
                      page: "1",
                      customerBookingHistoryList: [],
                      totalRecordCustomerSpaBookingHistory: 0,
                    },
                    () => {
                      this.getCustomerBookingHistory(1);
                    }
                  );
                }}
              />
            )}

            {confirmDeleteBooking && (
              <Modal
                title=""
                visible={confirmDeleteBooking}
                className={
                  "custom-modal style1 cancellation-reason-modal delete-popupbox "
                }
                footer={false}
                onCancel={() => this.setState({ confirmDeleteBooking: false })}
                destroyOnClose={true}
              >
                <div
                  className="content-block"
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <DeleteFilled />
                  </div>
                  <h3
                    style={{
                      color: "#EE4928",
                    }}
                  >
                    Are you sure you want to delete this?
                  </h3>
                  <p>Once deleted, it cannot be recovered.</p>
                  <div className="button-cancel">
                    <button
                      className="grey-without-border ant-btn-default mr-15"
                      onClick={() => {
                        this.setState({
                          confirmDeleteBooking: false,
                        });
                      }}
                    >
                      No, Cancel
                    </button>
                    <button
                      className="btn-orange-fill ant-btn-default"
                      onClick={this.deleteBooking}
                    >
                      Yes Delete
                    </button>
                  </div>
                </div>
              </Modal>
            )}

            <Modal
              title='Leave a Review'
              visible={showReviewModal}
              className={'custom-modal style1'}
              footer={false}
              onCancel={() => this.hideReviewModalCancel()}
            >
              <div className='padding'>
                <Form
                  {...layout}
                  name='basic'
                  onFinish={this.onFinishReview}
                >
                  <Form.Item
                    label='Select your rate'
                    name='rating'
                    rules={[required('')]}
                  >
                    <Radio.Group onChange={this.handleRatingChange} value={customerRating}>
                      <Radio style={radioStyle} value={5}>
                        <Rate disabled defaultValue={5} />  5 Excelent
                                </Radio>
                      <Radio style={radioStyle} value={4}>
                        <Rate disabled defaultValue={4} />  4 Very Good
                                </Radio>
                      <Radio style={radioStyle} value={3}>
                        <Rate disabled defaultValue={3} />  3 Average
                                </Radio>
                      <Radio style={radioStyle} value={2}>
                        <Rate disabled defaultValue={2} />  2 Very Poor
                                </Radio>
                      <Radio style={radioStyle} value={1}>
                        <Rate disabled defaultValue={1} />  1 Terrible
                                </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label='Body of message (300) characters remaining'
                    name='review'
                    rules={[required(''), whiteSpace('Review'), maxLengthC(300)]}
                    className="custom-astrix"
                  >
                    <TextArea rows={4} placeholder={'Write your review here'} className='shadow-input' />
                  </Form.Item>
                  
                  <Form.Item {...tailLayout}>
                    <Button type='default' htmlType='submit'>Send</Button>
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};


export default connect(
  mapStateToProps,
  { listCustomerServiceBookings, listCustomerBookingsHistory, enableLoading, disableLoading, getCustomerMyBookingsCalender,getFitnessDeleteBooking, wellbeingServiceBookingsRating, fitnessListCustomerClasses, getMyFitnessBookingCalenderList, fitnessListCustomerHistoryClasses, rateTraderClass, fitnessCustomerListAllSubscriptions }
)(FitnessMyBookings);