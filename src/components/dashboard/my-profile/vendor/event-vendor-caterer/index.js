import React, { Fragment } from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Col,
  Input,
  Layout,
  Avatar,
  Row,
  Typography,
  Button,
  Menu,
  Dropdown,
  Pagination,
  Card,
  Tabs,
  Form,
  Select,
  Rate,
  Alert,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  CaretDownOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  listCustomerServiceBookings,
  listCustomerBookingsHistory,
  getCustomerMyBookingsCalender,
} from "../../../../../actions";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import "./eventvendorcaterer.less";
import {
  displayDateTimeFormate,
  convertTime24To12Hour,
} from "../../../../../components/common";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import Icon from "../../../../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from "../../../../../config/Config";
import { langs } from "../../../../../config/localization";
import moment from "moment";
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

import { Calendar, Badge } from "antd";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

const total_count = 20;
// Pagination
function paginationItemRender(current, type, originalElement) {
  if (type === "prev") {
    return (
      <a>
        <Icon icon="arrow-left" size="14" className="icon" /> Back
      </a>
    );
  }
  if (type === "next") {
    return (
      <a>
        Next <Icon icon="arrow-right" size="14" className="icon" />
      </a>
    );
  }
  return originalElement;
}

function paginationItemRenderHistory(current, type, originalElement) {
  if (type === "prev") {
    return (
      <a>
        <Icon icon="arrow-left" size="14" className="icon" /> Back
      </a>
    );
  }
  if (type === "next") {
    return (
      <a>
        Next <Icon icon="arrow-right" size="14" className="icon" />
      </a>
    );
  }
  return originalElement;
}

class EventVendoreCaterer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerBookingList: [],
      page: "1",
      order: "desc",
      page_size: "10",
      customer_id: "",
      key: 1,
      customerBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      customerCalenderBookingList: [],
      totalRecordCustomerServiceBooking: 0,
      totalRecordCustomerSpaBookingHistory: 0,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getCustomerServiceBooking(this.state.page);
    this.getBookingsForCalenderDate(this.state.selectedBookingDate);
  }

  onTabChange = (key, type) => {
    if (key == "1") {
      this.getCustomerServiceBooking(1);
    } else {
      this.getCustomerBookingHistory(1);
    }
  };

  getCustomerServiceBooking = (page) => {
    const { id } = this.props.loggedInUser;
    const reqData = {
      page: page,
      order: this.state.order,
      page_size: this.state.page_size,
      customer_id: id,
    };

    this.props.listCustomerServiceBookings(reqData, (res) => {
      this.props.disableLoading();

      if (res.status === 200) {
        this.setState({
          customerBookingList: res.data.data.customer_service_bookings,
          totalRecordCustomerServiceBooking: res.data.data.total_records
            ? res.data.data.total_records
            : 0,
        });
      }
    });
  };

  handleBookingPageChange = (e) => {
    this.getCustomerServiceBooking(e);
  };

  getCustomerBookingHistory = (page) => {
    const { id } = this.props.loggedInUser;
    const reqData = {
      page: page,
      page_size: this.state.page_size,
      customer_id: id,
    };
    this.props.listCustomerBookingsHistory(reqData, (res) => {
      this.props.disableLoading();
      //
      if (res.status === 200) {
        this.setState({
          customerBookingHistoryList: res.data.data.customer_service_bookings,
          totalRecordCustomerSpaBookingHistory: res.data.data.total_records
            ? res.data.data.total_records
            : 0,
        });
        // this.setState({customerBookingHistoryList : []});
      }
    });
  };

  handleHistoryBookingPageChange = (e) => {
    this.getCustomerBookingHistory(e);
  };

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0;
  };
  renderUpcomingBooking = () => {
    if (
      this.state.customerBookingList &&
      this.state.customerBookingList.length > 0
    ) {
      return (
        <Fragment>
          {this.state.customerBookingList.map((value, i) => {
            return (
              <div className="my-new-order-block">
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <div className="odr-no">
                      <h4>{value.status}</h4>
                      <span className="pickup">
                        {
                          value.service_sub_bookings[0].wellbeing_trader_service
                            .name
                        }
                      </span>
                    </div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img
                          alt="test"
                          src={
                            value.trader_user.image
                              ? value.trader_user.image
                              : require("../../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">
                        {value.trader_user.business_name}
                      </div>
                      <div className="pf-rating">
                        <Text>{this.formateRating(value.trader_rating)}</Text>
                        <Rate
                          disabled
                          defaultValue={this.formateRating(value.trader_rating)}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={8}
                    xl={8}
                    className="align-right"
                  >
                    <div className="bokng-time-date">
                      <span>
                        {moment(value.booking_date).format("MMM D, YYYY")}
                      </span>
                      <span>
                        {convertTime24To12Hour(value.start_time)} -{" "}
                        {convertTime24To12Hour(value.end_time)}
                      </span>
                    </div>
                  </Col>
                  {/* <Link to={`/spa/customer-booking-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                        <div className="fm-eventb-date">
                          <h3>Booking Date:</h3>
                          <span className="fm-eventb-month">
                            December 23, 2018
                          </span>
                          <span className="fm-eventb-time">1 PM - 5 PM</span>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        xl={17}
                        className="fm-desc-wrap"
                      >
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={8} xl={16}>
                            <div className="fm-eventb-desc">
                              <h3>Request:</h3>
                              <span className="fm-eventb-content">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Curlisis consec tetur, massa
                                risus sollicitudin nisl, sit amet tincidunt
                                justo diam ac diam.
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={10}
                            xl={8}
                            className="align-right self-flex-end"
                          >
                            {this.displayReviewRatingSection(value)}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleBookingPageChange}
            total={this.state.totalRecordCustomerServiceBooking} //total number of card data available
            itemRender={paginationItemRender}
            className={"mb-20"}
          />
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };

  displayReviewRatingSection = (data) => {
    if (data.status == "Completed" && data.valid_trader_rating != null) {
      return <Rate defaultValue={0.0} />;
    } else {
      return (
        <span className="fm-btndeleteicon">
          <img
            src={require("../../../../../assets/images/icons/delete.svg")}
            alt="delete"
          />
          <Button type="default" className="success-btn">
            Upcoming
          </Button>
        </span>
      );
    }
  };
  getDateFromHours = (bookingDate, startTime) => {
    startTime = startTime.split(":");
    let now = new Date(bookingDate);
    let dateTimeSting = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...startTime
    );
    return dateTimeSting;
  };

  timestampToString = (date, time, suffix) => {
    let dateString = this.getDateFromHours(date, time);
    let diffTime = (new Date().getTime() - (dateString || 0)) / 1000;
    if (diffTime < 60) {
      diffTime = "Just now";
    } else if (diffTime > 60 && diffTime < 3600) {
      diffTime =
        Math.floor(diffTime / 60) +
        (Math.floor(diffTime / 60) > 1
          ? suffix
            ? " minutes"
            : "m"
          : suffix
          ? " minute"
          : "m") +
        (suffix ? " ago" : "");
    } else if (diffTime > 3600 && diffTime / 3600 < 24) {
      diffTime =
        Math.floor(diffTime / 3600) +
        (Math.floor(diffTime / 3600) > 1
          ? suffix
            ? " hours"
            : "h"
          : suffix
          ? " hour"
          : "h") +
        (suffix ? " ago" : "");
    } else if (diffTime > 86400 && diffTime / 86400 < 30) {
      diffTime =
        Math.floor(diffTime / 86400) +
        (Math.floor(diffTime / 86400) > 1
          ? suffix
            ? " days"
            : "d"
          : suffix
          ? " day"
          : "d") +
        (suffix ? " ago" : "");
    } else {
      diffTime = new Date(dateString || 0).toDateString();
    }
    return diffTime;
  };

  renderUpcomingEnquiries = () => {
    if (
      this.state.customerBookingHistoryList &&
      this.state.customerBookingHistoryList.length > 0
    ) {
      return (
        <Fragment>
          {this.state.customerBookingHistoryList.map((value, i) => {
            return (
              <div className="my-new-order-block">
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <div className="odr-no">
                      <h4>{value.status}</h4>
                      <span className="pickup">
                        {
                          value.service_sub_bookings[0].wellbeing_trader_service
                            .name
                        }
                      </span>
                    </div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img
                          alt="test"
                          src={
                            value.trader_user.image
                              ? value.trader_user.image
                              : require("../../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">
                        {value.trader_user.business_name}
                      </div>
                      <div className="pf-rating">
                        <Text>{this.formateRating(value.trader_rating)}</Text>
                        <Rate
                          disabled
                          defaultValue={this.formateRating(value.trader_rating)}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={6}
                    xl={6}
                    className="align-right"
                  >
                    <div className="bokng-hsty-hour-price">
                      <div className="hour">
                        {this.timestampToString(
                          value.booking_date,
                          value.start_time,
                          true
                        )}{" "}
                      </div>
                      <div className="price">${value.total_amount}</div>
                    </div>
                  </Col>
                  {/* <Link to={`/spa/customer-booking-history-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                        <div className="fm-eventb-date">
                          <h3>Date Requested:</h3>
                          <span className="fm-eventb-month">
                            December 23, 2018
                          </span>
                          <span className="fm-eventb-time">1 PM - 5 PM</span>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        xl={17}
                        className="fm-desc-wrap"
                      >
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={8} xl={16}>
                            <div className="fm-eventb-desc">
                              <h3>Request:</h3>
                              <span className="fm-eventb-content">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Curlisis consec tetur, massa
                                risus sollicitudin nisl, sit amet tincidunt
                                justo diam ac diam.
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={10}
                            xl={8}
                            className="align-right self-flex-end"
                          >
                            <div className="orange-small">
                              <span>
                                {value.category_name
                                  ? value.category_name
                                  : "N/A"}
                              </span>
                              <span>
                                {value.sub_category_name
                                  ? value.sub_category_name
                                  : "N/A"}
                              </span>
                            </div>
                            {this.displayReviewRatingSection(value)}
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                            <div className="">
                              <div className="fm-eventb-desc mt-20">
                                <h3>Venues:</h3>
                                <span className="fm-eventb-content">
                                  Art Mulch
                                </span>
                                <span>7/74 Tinning St, Brunswick 3056</span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>No. of Guests:</h3>
                                <span className="fm-eventb-content">20</span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>Contact Name:</h3>
                                <span className="fm-eventb-content">
                                  Sierra Ferguson
                                </span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>Email Address:</h3>
                                <span className="fm-eventb-content">
                                  sierra@gmail.com
                                </span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>Phone Number:</h3>
                                <span className="fm-eventb-content">
                                  +61 403 305 196
                                </span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>Photo:</h3>
                                <div className="fm-imgpr-wrap">
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img2.jpg")}
                                  />
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img4.jpg")}
                                  />
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img1.jpg")}
                                  />
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img3.jpg")}
                                  />
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img3.jpg")}
                                  />
                                </div>
                              </div>
                              <Form.Item className="fm-apply-label">
                                <span className="fm-arrow-label">Total</span>
                                <div className="fm-apply-input">
                                  <Input
                                    placeholder={"Type your quote here"}
                                    enterButton="Search"
                                    className="shadow-input"
                                  />
                                  <Button
                                    type="primary"
                                    className="fm-apply-btn"
                                  >
                                    Quote
                                  </Button>
                                </div>
                                {/* <Link to='/' className='fm-clear-link'>Clear</Link> */}
                              </Form.Item>
                              <div className="fm-eventb-btn mt-20">
                                <Button
                                  type="default"
                                  className="fm-orng-outline-btn"
                                >
                                  Decline
                                </Button>
                                <Button type="default" className="fm-orng-btn">
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleHistoryBookingPageChange}
            total={this.state.totalRecordCustomerSpaBookingHistory} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={"mb-20"}
          />
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };
  renderHistoryBooking = () => {
    if (
      this.state.customerBookingHistoryList &&
      this.state.customerBookingHistoryList.length > 0
    ) {
      return (
        <Fragment>
          {this.state.customerBookingHistoryList.map((value, i) => {
            return (
              <div className="my-new-order-block">
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <div className="odr-no">
                      <h4>{value.status}</h4>
                      <span className="pickup">
                        {
                          value.service_sub_bookings[0].wellbeing_trader_service
                            .name
                        }
                      </span>
                    </div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img
                          alt="test"
                          src={
                            value.trader_user.image
                              ? value.trader_user.image
                              : require("../../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">
                        {value.trader_user.business_name}
                      </div>
                      <div className="pf-rating">
                        <Text>{this.formateRating(value.trader_rating)}</Text>
                        <Rate
                          disabled
                          defaultValue={this.formateRating(value.trader_rating)}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={6}
                    xl={6}
                    className="align-right"
                  >
                    <div className="bokng-hsty-hour-price">
                      <div className="fm-day-ago">1 day ago</div>
                      {/* <div className="price">${value.total_amount}</div> */}
                    </div>
                  </Col>
                  {/* <Link to={`/spa/customer-booking-history-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                        <div className="fm-eventb-date">
                          <h3>Date:</h3>
                          <span className="fm-eventb-month">
                            December 23, 2018
                          </span>
                          <span className="fm-eventb-time">1 PM - 5 PM</span>
                        </div>
                        <div className="fm-eventb-date mt-20">
                          <h3>Total:</h3>
                          <span className="fm-bold">AU$750.00</span>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        xl={17}
                        className="fm-desc-wrap"
                      >
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={8} xl={16}>
                            <div className="fm-eventb-desc">
                              <h3>Request:</h3>
                              <span className="fm-eventb-content">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Curlisis consec tetur, massa
                                risus sollicitudin nisl, sit amet tincidunt
                                justo diam ac diam.
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={10}
                            xl={8}
                            className="align-right self-flex-end"
                          >
                            {this.displayReviewRatingSection(value)}
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                            <div className="">
                              <div className="fm-eventb-desc mt-20">
                                <h3>Venues:</h3>
                                <span className="fm-eventb-content">
                                  Art Mulch
                                </span>
                                <span>7/74 Tinning St, Brunswick 3056</span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>No. of Guests:</h3>
                                <span className="fm-eventb-content">20</span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>Contact Name:</h3>
                                <span className="fm-eventb-content">
                                  Sierra Ferguson
                                </span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>Email Address:</h3>
                                <span className="fm-eventb-content">
                                  sierra@gmail.com
                                </span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>Phone Number:</h3>
                                <span className="fm-eventb-content">
                                  +61 403 305 196
                                </span>
                              </div>
                              <div className="fm-eventb-desc mt-20">
                                <h3>Photo:</h3>
                                <div className="fm-imgpr-wrap">
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img2.jpg")}
                                  />
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img4.jpg")}
                                  />
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img1.jpg")}
                                  />
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img3.jpg")}
                                  />
                                  <img
                                    alt="test"
                                    src={require("../../../../../assets/images/pr-img3.jpg")}
                                  />
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })}
          <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleHistoryBookingPageChange}
            total={this.state.totalRecordCustomerSpaBookingHistory} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={"mb-20"}
          />
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };

  getBookingsForCalenderDate = (date) => {
    const { id } = this.props.loggedInUser;
    const selectedDate = moment(date).format("YYYY-MM-DD");
    this.setState(
      {
        selectedBookingDate: selectedDate,
      },
      () => {
        if (selectedDate) {
          const req = {
            customer_id: id,
            from_date: selectedDate,
            to_date: selectedDate,
          };
          this.props.getCustomerMyBookingsCalender(
            req,
            this.getCustomerMyBookingsCalenderCallback
          );
        }
      }
    );
  };

  onChangeBookingDates = (value) => {
    this.getBookingsForCalenderDate(value);
  };

  getCustomerMyBookingsCalenderCallback = (response) => {
    if (response.status === 200 && response.data) {
      this.setState({
        customerCalenderBookingList:
          response.data.data.customer_service_bookings,
      });
    }
  };

  renderBokingCalenderItems = () => {
    const { customerCalenderBookingList } = this.state;

    if (customerCalenderBookingList && customerCalenderBookingList.length > 0) {
      return (
        <ul className="flex-container wrap">
          {customerCalenderBookingList.map((value, i) => {
            return (
              <li>
                <div className="appointments-label">
                  {value.service_sub_bookings[0].wellbeing_trader_service.name}
                </div>
                {/* <div class="appointments-label">{value.service_sub_bookings[0].wellbeing_trader_service.name}</div> */}
                {/* <div className="appointments-time">{value.start_time}<span><img src={require('../../../assets/images/icons/delete.svg')} alt='delete' /></span></div> */}
                <div className="appointments-time">
                  {convertTime24To12Hour(value.start_time)}
                </div>
              </li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <div className="error-box">
          <Alert message="No Appointments" type="error" />
        </div>
      );
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { selectedBookingDate, customerCalenderBookingList } = this.state;

    return (
      <Layout className="event-booking-profile-wrap fm-event-vendor-wrap">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>My Bookings</Title>
                  </div>
                  <div className="right"></div>
                </div>
                <div className="sub-head-section">
                  <Text>&nbsp;</Text>
                </div>
                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking">
                  <Row gutter={30}>
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                      <Card
                        className="profile-content-shadow-box"
                        bordered={false}
                        title=""
                      >
                        <Tabs onChange={this.onTabChange} defaultActiveKey="1">
                          <TabPane tab="Enquiries" key="1">
                            <h3>
                              You have{" "}
                              {this.state.totalRecordCustomerServiceBooking} job
                              enquires in total
                            </h3>
                            {this.renderUpcomingEnquiries()}
                          </TabPane>
                          <TabPane tab="Bookings" key="2">
                            <h3>
                              You have{" "}
                              {this.state.totalRecordCustomerServiceBooking}{" "}
                              jobs book
                            </h3>
                            {this.renderUpcomingBooking()}
                          </TabPane>
                          <TabPane tab="History" key="3">
                            <h3>
                              You have{" "}
                              {this.state.totalRecordCustomerSpaBookingHistory}{" "}
                              jobs done
                            </h3>
                            {this.renderHistoryBooking()}
                          </TabPane>
                        </Tabs>
                        <div className="card-header-select">
                          <label>Show:</label>
                          <Select
                            onChange={(e) => this.setState({ calendarView: e })}
                            defaultValue="This week"
                          >
                            <Option value="week">This week</Option>
                            <Option value="month">This month</Option>
                            {/* <Option value="This year">This year</Option> */}
                          </Select>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <div className="appointments-slot right-calender-view">
                        <div className="appointments-heading">
                          <div className="date-heading">My Calender</div>
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              onChange={(e) =>
                                this.setState({ calendarView: e })
                              }
                              defaultValue="This week"
                            >
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                              {/* <Option value="This year">This year</Option> */}
                            </Select>
                          </div>
                        </div>
                        {/* <Calendar
                          onChange={this.onChangeBookingDates}
                          value={selectedBookingDate !== '' ? new Date(selectedBookingDate) : new Date()}
                          //view={'year'}
                          showDoubleView={false}
                          next2Label={null}
                          prev2Label={null}
                        /> */}

                        <Calendar
                          onSelect={this.onChangeBookingDates}
                          fullscreen={false}
                          dateCellRender={this.dateCellRender}
                          // onChange={this.onChangeBookingDates}
                          //value={selectedBookingDate !== '' ? new Date(selectedBookingDate) : new Date()}
                          //view={'year'}
                          // showDoubleView={false}
                          // next2Label={null}
                          // prev2Label={null}
                        />
                      </div>

                      <div className="appointments-slot mt-20">
                        <div className="appointments-heading">
                          <div className="date">
                            {moment(selectedBookingDate).format("MMM D YYYY")}
                          </div>
                          <div className="appointments-count">
                            {customerCalenderBookingList.length} Appointments
                            today
                          </div>
                        </div>
                        <div className="appointments-body">
                          {this.renderBokingCalenderItems()}
                          {/* <li>
                              <div class="appointments-label">Full Treatment</div>
                              <div class="appointments-time">1:30 PM <span><img src={require('../../../assets/images/icons/delete.svg')} alt='delete' /></span></div>
                            </li>
                            <li>
                              <div class="appointments-label">Full Treatment</div>
                              <div class="appointments-time">1:30 PM <span><img src={require('../../../assets/images/icons/delete.svg')} alt='delete' /></span></div>
                            </li>
                            <li className="active">
                              <div class="appointments-label">Full Treatment</div>
                              <div class="appointments-time">1:30 PM <span><img src={require('../../../assets/images/icons/delete.svg')} alt='delete' /></span></div>
                            </li>
                            <li>
                              <div class="appointments-label">Full Treatment</div>
                              <div class="appointments-time">1:30 PM <span><img src={require('../../../assets/images/icons/delete.svg')} alt='delete' /></span></div>
                            </li> */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  listCustomerServiceBookings,
  listCustomerBookingsHistory,
  enableLoading,
  disableLoading,
  getCustomerMyBookingsCalender,
})(EventVendoreCaterer);
