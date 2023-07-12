import React, { Fragment } from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Col,
  Input,
  Layout,
  Row,
  Typography,
  Button,
  Pagination,
  Card,
  Tabs,
  Form,
  Select,
  Rate,
  Alert,
  Modal,
  Radio,
} from "antd";
import {
  enableLoading,
  disableLoading,
  getVendorWellBeingMonthBookingsCalender,
  listVendorServiceBeautyBookings,
  listVendorServiceBeautyBookingHistory,
  beautyServiceBookingsRating,
} from "../../../../../../actions";
import AppSidebar from "../../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../../common/History";
import "./mybooking.less";
import "../../../bookingVendorCommon.less";
import {
  convertTime24To12Hour,
  displayCalenderDate,
  displayDate,
} from "../../../../../../components/common";
import Icon from "../../../../../../components/customIcons/customIcons";
import moment from "moment";
import { Calendar, Badge } from "antd";
import {
  VENDOR_UPCOMING_BOOKING_LIST,
  VENDOR_HISTORY_BOOKING_LIST,
} from "./SampleAPIResponse";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../../../config/FormValidation";
import { langs } from "../../../../../../config/localization";
import VendorBeautyBookingDetails from "./VendorBeautyBookingDetails";
import { toastr } from "react-redux-toastr";
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from "../../../../../../config/Config";
import {
  getStatusColor,
  checkBookingForFutureDate,
} from "../../../../../../config/Helper";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

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

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: "align-center pt-20",
};

class VendorMyBookingsBeauty extends React.Component {
  constructor(props) {
    super(props);
    let input = new Date();
    let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
    let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0);

    let first = input.getDate() - input.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6
    let firstday = new Date(input.setDate(first)).toUTCString();
    let lastday = new Date(input.setDate(last)).toUTCString();

    this.state = {
      vendorBeautyBookingList: [],
      page: "1",
      order: "desc",
      page_size: PAGE_SIZE.PAGE_SIZE_12,
      customer_id: "",
      key: 1,
      vendorBeautyBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      vendorCalenderBookingList: [],
      totalRecordVendorBeautyBooking: 0,
      totalRecordVendorBeautyBookingHistory: 0,
      vendorAllDayCalenderBookingList: [],
      weeklyDates: [],
      calenderView: "month",
      monthStart: moment(startOfMonth).format("YYYY-MM-DD"),
      monthEnd: moment(endOfMonth).format("YYYY-MM-DD"),
      weekStart: moment(firstday).format("YYYY-MM-DD"),
      weekEnd: moment(lastday).format("YYYY-MM-DD"),
      index: "",
      customerRating: "",
      showReviewModal: false,
      bookingListCalenderView: "week",
      serviceBookingId: "",
      serviceBookingIdForReview: "",
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getVendorServiceBeautyBookings(this.state.page);
    this.getBookingsForCalenderDate(this.state.selectedBookingDate);
    this.createWeekCalender();
  }

  /**
   * @method handleRatingChange
   * @description handle rating selection
   */
  handleRatingChange = (e) => {
    this.setState({
      customerRating: e.target.value,
    });
  };

  /**
   * @method onFinishReview
   * @description handle on submit
   */
  onFinishReview = (values) => {
    const { serviceBookingIdForReview } = this.state;
    const requestData = {
      service_booking_id: serviceBookingIdForReview,
      rated_by: "trader",
      title: values.review,
      rating: values.rating,
    };
    this.props.enableLoading();
    this.props.beautyServiceBookingsRating(requestData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(
          "Success",
          "Review has been submitted to customer successfully."
        );
      }
      this.setState({ showReviewModal: false });
    });
  };

  createWeekCalender = () => {
    let curr = new Date();
    let weekArray = [];
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first));
      weekArray.push(day);
    }
    let newWeekDatesArray = weekArray.map((d) => d.toString());
    this.setState({
      weeklyDates: newWeekDatesArray,
    });
  };

  onTabChange = (key, type) => {
    this.setState({ key: key });
    if (key == "1") {
      this.getVendorServiceBeautyBookings(1);
    } else {
      this.getVendorServiceBeautyBookingsHistory(1);
    }
  };

  getVendorServiceBeautyBookings = (page) => {
    const { id, trader_profile_id } = this.props.loggedInUser;
    const {
      bookingListCalenderView,
      monthStart,
      monthEnd,
      weekStart,
      weekEnd,
    } = this.state;
    let fromDate, toDate;

    if (bookingListCalenderView === "week") {
      fromDate = weekStart;
      toDate = weekEnd;
    } else if (bookingListCalenderView === "month") {
      fromDate = monthStart;
      toDate = monthEnd;
    } else if (bookingListCalenderView === "today") {
      fromDate = moment().format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    }
    const reqData = {
      trader_profile_id: trader_profile_id,
      from_date: fromDate,
      to_date: toDate,
      page: page,
      page_size: this.state.page_size,
      //date:  moment().format('YYYY-MM-DD'),
    };
    this.props.enableLoading();
    this.props.listVendorServiceBeautyBookings(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        //this.setState({ vendorBeautyBookingList: VENDOR_UPCOMING_BOOKING_LIST, totalRecordVendorBeautyBooking: res.data.data.total_record ? res.data.data.total_record : 0 });
        this.setState({
          vendorBeautyBookingList: res.data.data.service_bookings,
          totalRecordVendorBeautyBooking: res.data.data.total_record
            ? res.data.data.total_record
            : 0,
        });
      }
    });
  };

  handleBookingPageChange = (e) => {
    this.getVendorServiceBeautyBookings(e);
  };

  getVendorServiceBeautyBookingsHistory = (page) => {
    const { id, trader_profile_id } = this.props.loggedInUser;
    const {
      bookingListCalenderView,
      monthStart,
      monthEnd,
      weekStart,
      weekEnd,
    } = this.state;

    let fromDate, toDate;
    if (bookingListCalenderView === "week") {
      fromDate = weekStart;
      toDate = weekEnd;
    } else if (bookingListCalenderView === "month") {
      fromDate = monthStart;
      toDate = monthEnd;
    } else if (bookingListCalenderView === "today") {
      fromDate = moment().format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    }

    const reqData = {
      trader_profile_id: trader_profile_id,
      from_date: fromDate,
      to_date: toDate,
      page: page,
      page_size: this.state.page_size,
    };
    this.props.enableLoading();
    this.props.listVendorServiceBeautyBookingHistory(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        //this.setState({ vendorBeautyBookingHistoryList: VENDOR_HISTORY_BOOKING_LIST, totalRecordVendorBeautyBookingHistory: res.data.data.total_record ? res.data.data.total_record : 0 })
        this.setState({
          vendorBeautyBookingHistoryList: res.data.data.service_bookings,
          totalRecordVendorBeautyBookingHistory: res.data.data.total_record
            ? res.data.data.total_record
            : 0,
        });
      }
    });
  };

  handleHistoryBookingPageChange = (e) => {
    this.getVendorServiceBeautyBookingsHistory(e);
  };

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0;
  };

  displayBookingDetails = (serviceBookingId) => {
    this.setState({ showDetails: true, serviceBookingId: serviceBookingId });
  };

  renderBeautyVendorBookings = () => {
    const { vendorBeautyBookingList } = this.state;
    if (vendorBeautyBookingList && vendorBeautyBookingList.length > 0) {
      return (
        <Fragment>
          {vendorBeautyBookingList.map((value, i) => {
            let disPlaystatus = checkBookingForFutureDate(
              value.booking_date,
              value.start_time,
              value.status
            );
            return (
              <div
                className="my-new-order-block"
                onClick={() =>
                  this.props.history.push({
                    pathname: `/vendor-beauty-bookings-detail/${value.id}`,
                  })
                }
                key={`vdr_beauty_bookings_${i}`}
              >
                {/*  <div className="my-new-order-block" key={`vdr_beauty_bookings_${i}`} onClick={()=> this.displayBookingDetails(value.id)}> */}
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <div className="odr-no">
                      <h4> {disPlaystatus}</h4>
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
                            value.customer.image_thumbnail
                              ? value.customer.image_thumbnail
                              : require("../../../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">{value.customer.name}</div>
                    </div>
                    <div className="orange-small">
                      <span>
                        {value.category_name ? value.category_name : "N/A"}
                      </span>
                      <span>
                        {value.sub_category_name
                          ? value.sub_category_name
                          : "N/A"}
                      </span>
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
                    <div className="bokng-time-date">
                      <span>
                        {moment(value.booking_date).format("MMM D, YYYY")}
                      </span>
                      <span>
                        {convertTime24To12Hour(value.start_time)} -{" "}
                        {convertTime24To12Hour(value.end_time)}
                      </span>
                    </div>
                    <Button
                      type="default"
                      className={getStatusColor(disPlaystatus)}
                    >
                      {disPlaystatus}
                    </Button>
                  </Col>
                  {/* <Link to={`/vendor-beauty-bookings-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
              </div>
            );
          })}
          <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleBookingPageChange}
            total={this.state.totalRecordVendorBeautyBooking} //total number of card data available
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
    if (data.status === "Completed" && data.valid_customer_rating !== null) {
      return (
        <Rate
          defaultValue={
            data.valid_customer_rating.rating
              ? data.valid_customer_rating.rating
              : 0.0
          }
        />
      );
    } else if (
      data.status === "Completed" &&
      data.valid_customer_rating === null
    ) {
      return (
        <Button
          type="default"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({
              showReviewModal: true,
              serviceBookingIdForReview: data.id,
            });
          }}
          className="gray-btn"
        >
          Review
        </Button>
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
      diffTime = moment(dateString).format("MMM D, YYYY");
    }
    return diffTime;
  };

  renderHistoryBooking = () => {
    const { vendorBeautyBookingHistoryList } = this.state;
    if (
      vendorBeautyBookingHistoryList &&
      vendorBeautyBookingHistoryList.length > 0
    ) {
      return (
        <Fragment>
          {vendorBeautyBookingHistoryList.map((value, i) => {
            return (
              <div
                className="my-new-order-block"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.history.push({
                    pathname: `/vendor-beauty-booking-history-detail/${value.id}`,
                  });
                }}
                key={`vdr_beauty_bookings_history_${i}`}
              >
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
                            value.customer.image_thumbnail
                              ? value.customer.image_thumbnail
                              : require("../../../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">{value.customer.name}</div>
                    </div>
                    <div className="orange-small">
                      <span>
                        {value.category_name ? value.category_name : "N/A"}
                      </span>
                      <span>
                        {value.sub_category_name
                          ? value.sub_category_name
                          : "N/A"}
                      </span>
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
                        {" "}
                        {this.timestampToString(
                          value.booking_date,
                          value.start_time,
                          true
                        )}{" "}
                      </div>
                      <div className="price">${value.total_amount}</div>
                    </div>
                    {this.displayReviewRatingSection(value)}
                  </Col>
                  {/* <Link to={`/vendor-beauty-booking-history-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
              </div>
            );
          })}
          <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={12} //default size of page
            onChange={this.handleHistoryBookingPageChange}
            total={this.state.totalRecordVendorBeautyBookingHistory} //total number of card data available
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
            user_id: id,
            date: selectedDate,
          };
          this.props.getVendorWellBeingMonthBookingsCalender(
            req,
            this.getVendorWellBeingMonthBookingsCalenderCallback
          );
        }
      }
    );
  };

  onChangeBookingDates = (value) => {
    this.getBookingsForCalenderDate(value);
  };

  getVendorWellBeingMonthBookingsCalenderCallback = (response) => {
    if (response.status === 200 && response.data) {
      let bookingData = this.getCalenderBookingDataFilter(
        response.data.service_bookings,
        this.state.selectedBookingDate,
        response.data.month_slots
      );
      //
      this.setState({
        vendorCalenderBookingList: bookingData.selectedDateData,
        vendorAllDayCalenderBookingList: bookingData.allDayData,
      });
    }
  };

  getCalenderBookingDataFilter = (
    vendorCalenderBookingList,
    selectedBookingDate,
    vendorMonthSlot
  ) => {
    let dataArray = [];
    let completArray = [];
    for (let key in vendorCalenderBookingList) {
      if (moment(key).isSame(selectedBookingDate)) {
        dataArray.push({ date: key, bookings: vendorCalenderBookingList[key] });
      }
      completArray.push({
        date: key,
        bookings: vendorCalenderBookingList[key],
      });
    }
    return { selectedDateData: dataArray, allDayData: completArray };
  };

  renderBokingCalenderItems = () => {
    const { vendorCalenderBookingList, selectedBookingDate } = this.state;

    if (
      vendorCalenderBookingList &&
      vendorCalenderBookingList.length > 0 &&
      vendorCalenderBookingList[0].bookings.length > 0
    ) {
      return (
        <ul className="flex-container wrap">
          {vendorCalenderBookingList[0].bookings.map((value, i) => {
            return (
              <li key={`${i}_vendor_bookings`}>
                <div className="appointments-label">{value.customer.name}</div>
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

  dateCellRender = (value) => {
    const listData = this.state.vendorAllDayCalenderBookingList;
    return (
      <span className="events">
        {listData.map((item) => {
          let formatedCalanderDate = moment(value).format("YYYY-MM-DD");
          if (
            moment(item.date).isSame(formatedCalanderDate) &&
            item.bookings.length > 0
          ) {
            return <Badge status={"error"} />;
          }
        })}
      </span>
    );
  };

  renderCalender = () => {
    const { weeklyDates, selectedBookingDate } = this.state;
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span>
                {displayCalenderDate(
                  selectedBookingDate ? selectedBookingDate : Date.now()
                )}
              </span>
            </li>
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
    );
  };

  renderDates = (dates) => {
    const { selectedBookingDate, index } = this.state;
    return dates.map((el, i) => {
      let selectedDate = selectedBookingDate;
      let clickedDate = moment(new Date(el)).format("YYYY-MM-DD");

      return (
        <li
          key={`${i}_weekly_date`}
          onClick={() => {
            this.setState(
              {
                index: i,
                selectedBookingDate: moment(new Date(el)).format("YYYY-MM-DD"),
              },
              () => {
                this.getBookingsForCalenderDate(el);
              }
            );
          }}
          style={{ cursor: "pointer" }}
        >
          <span className={selectedDate == clickedDate ? "active" : ""}>
            {displayDate(el)}
          </span>
        </li>
      );
    });
  };

  onChangeCalenderView = (view) => {
    this.setState(
      {
        calenderView: view,
        selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.createWeekCalender();
        }
        this.getBookingsForCalenderDate(new Date());
      }
    );
  };

  hideReviewModalCancel = () => {
    this.setState({ showReviewModal: false });
  };

  onChangeBookingListDurationFilter = (view) => {
    this.setState({ bookingListCalenderView: view }, () => {
      if (this.state.key == "1") {
        this.getVendorServiceBeautyBookings(1);
      } else {
        this.getVendorServiceBeautyBookingsHistory(1);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedBookingDate,
      vendorCalenderBookingList,
      calenderView,
      showDetails,
    } = this.state;
    const { customerRating, showReviewModal, serviceBookingId } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };

    return (
      <Layout className="beauty-booking-vendor-v2">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="profile-content-box">
                  <div className="heading-search-block">
                    <div className="">
                      <Row gutter={0}>
                        <Col xs={24} md={20} lg={24} xl={24}>
                          {/* <h1>
                            <span>My Dashboard</span>
                          </h1> */}
                          <div className="header-serch-tab-block">
                            <div className="heading-text ">
                              <Button className="orange-btn">
                                My Dashboard
                              </Button>
                            </div>
                            <div className="right btn-right-block active-tab">
                              <Button
                                className="orange-btn"
                                onClick={() =>
                                  this.props.history.push("/dashboard")
                                }
                              >
                                My Bookings
                              </Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="pf-vend-restau-myodr pf-vend-spa-booking box-shdw-none mt-65">
                    <Row gutter={30}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Card
                          className="profile-content-shadow-box"
                          bordered={false}
                          title=""
                        >
                          <Tabs
                            onChange={this.onTabChange}
                            defaultActiveKey="1"
                          >
                            <TabPane tab="My Bookings" key="1">
                              <h3>
                                You have{" "}
                                {this.state.totalRecordVendorBeautyBooking}{" "}
                                appointments in total
                              </h3>
                              {this.renderBeautyVendorBookings()}
                              {/* { showDetails=== true ? <VendorBeautyBookingDetails serviceBookingId={serviceBookingId}/> : this.renderBeautyVendorBookings() } */}
                            </TabPane>
                            <TabPane tab="History" key="2">
                              <h3>
                                You have{" "}
                                {
                                  this.state
                                    .totalRecordVendorBeautyBookingHistory
                                }{" "}
                                appointments in total
                              </h3>
                              {this.renderHistoryBooking()}
                            </TabPane>
                          </Tabs>
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              onChange={(e) =>
                                this.onChangeBookingListDurationFilter(e)
                              }
                              defaultValue="This week"
                            >
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                              <Option value="today">Today</Option>
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
                                onChange={(e) => {
                                  this.onChangeCalenderView(e);
                                }}
                                defaultValue="Monthly"
                              >
                                <Option value="week">Weekly</Option>
                                <Option value="month">Monthly</Option>
                              </Select>
                            </div>
                          </div>
                          {calenderView === "week" ? (
                            this.renderCalender()
                          ) : (
                            <Calendar
                              onSelect={this.onChangeBookingDates}
                              fullscreen={false}
                              dateCellRender={this.dateCellRender}
                            />
                          )}
                        </div>
                        <div className="appointments-slot mt-20">
                          <div className="appointments-heading">
                            <div className="date">
                              {moment(selectedBookingDate).format("MMM D YYYY")}
                            </div>
                            <div className="appointments-count">
                              {vendorCalenderBookingList.length &&
                              vendorCalenderBookingList[0].bookings.length > 0
                                ? vendorCalenderBookingList[0].bookings.length
                                : 0}{" "}
                              Appointments today
                            </div>
                          </div>
                          <div className="appointments-body">
                            {this.renderBokingCalenderItems()}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              title="Leave a Review"
              visible={showReviewModal}
              className={"custom-modal style1"}
              footer={false}
              onCancel={() => this.hideReviewModalCancel()}
            >
              <div className="padding">
                <Form {...layout} name="basic" onFinish={this.onFinishReview}>
                  <Form.Item
                    label="Select your rate"
                    name="rating"
                    rules={[required("")]}
                  >
                    <Radio.Group
                      onChange={this.handleRatingChange}
                      value={customerRating}
                    >
                      <Radio style={radioStyle} value={5}>
                        <Rate disabled defaultValue={5} /> 5 Excelent
                      </Radio>
                      <Radio style={radioStyle} value={4}>
                        <Rate disabled defaultValue={4} /> 4 Very Good
                      </Radio>
                      <Radio style={radioStyle} value={3}>
                        <Rate disabled defaultValue={3} /> 3 Average
                      </Radio>
                      <Radio style={radioStyle} value={2}>
                        <Rate disabled defaultValue={2} /> 2 Very Poor
                      </Radio>
                      <Radio style={radioStyle} value={1}>
                        <Rate disabled defaultValue={1} /> 1 Terrible
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label="Body of message (300) characters remaining"
                    name="review"
                    rules={[
                      required(""),
                      whiteSpace("Review"),
                      maxLengthC(300),
                    ]}
                    className="custom-astrix"
                  >
                    <TextArea
                      rows={4}
                      placeholder={"Write your review here"}
                      className="shadow-input"
                    />
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button type="default" htmlType="submit">
                      Send
                    </Button>
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getVendorWellBeingMonthBookingsCalender,
  listVendorServiceBeautyBookings,
  listVendorServiceBeautyBookingHistory,
  beautyServiceBookingsRating,
})(VendorMyBookingsBeauty);
