import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Pie } from "ant-design-pro/lib/Charts";
import {
  SearchOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Rate,
  Form,
  Divider,
  Progress,
  Calendar,
  Badge,
  Col,
  Input,
  Layout,
  Row,
  Typography,
  Button,
  Pagination,
  Card,
  Select,
  Alert,
  Dropdown,
  Menu,
} from "antd";
import {
  getTraderMonthBooking,
  enableLoading,
  disableLoading,
  getCustomerMyBookingsCalender,
  listVendorServiceSpaBookings,
  listVendorServiceSpaBookingsHistory,
  getVendorWellBeingMonthBookingsCalender,
  wellbeingServiceBookingsRating,
  getTraderMonthWellbeingBooking,
  DeleteTraderJobapi,
  DeleteWellBeingApi,
  DeleteTraderJobss,
  getTraderMonthBeautyBooking,
} from "../../../../../../actions";
import AppSidebar from "../../../../../../components/dashboard-sidebar/DashboardSidebar";
import { toastr } from "react-redux-toastr";
import { STATUS_CODES } from "../../../../../../config/StatusCode";

import history from "../../../../../../common/History";
import { langs } from "../../../../../../config/localization";
import "../../../spa/my-bookings/spa/mybooking.less";
import {
  convertTime24To12Hour,
  displayCalenderDate,
  displayDate,
  salaryNumberFormate,
} from "../../../../../../components/common";
import Icon from "../../../../../../components/customIcons/customIcons";
import { PAGE_SIZE } from "../../../../../../config/Config";
import {
  getStatusColor,
  checkBookingForFutureDate,
} from "../../../../../../config/Helper";
import "../../../../calender.less";
import "../../../../employer.less";
import "../../../../addportfolio.less";
import "../profile-vendor-handyman.less";
const { Title, Text } = Typography;
const { Option } = Select;

class HandymanDashboard extends React.Component {
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
      compare_visible: false,
      dropdown_label: "This Month",
      vendorBookingList: [],
      page: "1",
      order: "desc",
      page_size: PAGE_SIZE.PAGE_SIZE_12,
      customer_id: "",
      key: 1,
      vendorSpaBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      vendorCalenderBookingList: [],
      totalRecordVendorSpaBooking: 0,
      totalRecordVendorSpaBookingHistory: 0,
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
      bookingListCalenderView: "month",
      serviceBookingIdForReview: "",
      filterdata: "",
      data: [
        {
          x: "Job Completion",
          y: 0,
        },
        {
          x: "Upcoming",
          y: 0,
        },
        {
          x: "Cancelled",
          y: 0,
        },
      ],
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getDashboardDetails();
    this.createWeekCalender();
  }

  DeleteQuoteJob = (id) => {
    console.log(this.state.selectedBookingId, "delete trade");
    console.log(id, "delete id trade");
    const { activeTab } = this.state;
    if (["handyman", "trader"].includes(this.props.loggedInUser.user_type)) {
      let reqData = {
        trader_quote_request_id: id,
        user_id: this.props.loggedInUser.id,
      };
      this.props.enableLoading();
      this.props.DeleteTraderJobss(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, "Successfully deleted");
          this.getDashboardDetails();
        }
      });
    }
  };

  DeleteTraderJob = (id) => {
    console.log(this.state.selectedBookingId, "delete trade");
    console.log(id, "delete id trade@@@@@@@@@@@@@@@@@@@@@@@@");
    if (["handyman", "trader"].includes(this.props.loggedInUser.user_type)) {
      let reqData = {
        trader_job_id: id,
        user_id: this.props.loggedInUser.id,
      };
      this.props.enableLoading();
      this.props.DeleteTraderJobapi(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, "Successfully deleted");
          this.getDashboardDetails();
        }
      });
    } else {
      let reqData = {
        service_booking_id: id,
        user_id: this.props.loggedInUser.id,
      };
      this.props.enableLoading();
      this.props.DeleteWellBeingApi(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, "Successfully deleted");
          this.getDashboardDetails();
        }
      });
    }
  };
  /**
   * @method createWeekCalender
   * @description create week calender view
   */
  createWeekCalender = (selected_date = null) => {
    function days(current) {
      let week = new Array();
      // Starting Monday not Sunday
      // let first = current.getDate() - current.getDay();
      let first = new Date(moment(current).subtract(+current.getDay(), "days"));
      for (let i = 0; i < 7; i++) {
        week.push(new Date(moment(first).add(+i, "days")));
      }
      return week;
    }
    let input = selected_date ? new Date(selected_date) : new Date();
    let result = days(input);
    let weekStart = new Date(result[0]).toUTCString();
    let weekEnd = new Date(result[6]).toUTCString();
    let date = result.map((d) => d.toString());
    this.setState({ weeklyDates: date, weekStart, weekEnd });
  };

  /**
   * @method getDashboardDetails
   * @description get vendor dashboard details
   */
  getDashboardDetails = (page, search_keyword) => {
    this.setState({ search_keyword: search_keyword });
    const { id } = this.props.loggedInUser;
    const {
      bookingListCalenderView,
      monthStart,
      monthEnd,
      weekStart,
      weekEnd,
    } = this.state;
    let fromDate, toDate;
    if (bookingListCalenderView === "Week") {
      fromDate = weekStart;
      toDate = weekEnd;
    } else if (
      bookingListCalenderView === "month" ||
      bookingListCalenderView === "year"
    ) {
      fromDate = monthStart;
      toDate = monthEnd;
    } else if (bookingListCalenderView === "Today") {
      fromDate = moment().format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    }

    if (
      this.props.loggedInUser.user_type === "handyman" ||
      this.props.loggedInUser.user_type === "trader"
    ) {
      const reqData = {
        user_id: id,
        from_date: fromDate,
        to_date: toDate,
        search_keyword: search_keyword,
      };
      this.props.enableLoading();
      this.props.getTraderMonthBooking(
        reqData,

        this.getVendorBookingsCalenderCallback
      );
    } else if (this.props.loggedInUser.user_type === "wellbeing") {
      const reqData = {
        user_id: id,
        date: fromDate,
        from_date: fromDate,
        to_date: toDate,
        search_keyword: search_keyword,
      };
      this.props.enableLoading();
      this.props.getTraderMonthWellbeingBooking(
        reqData,
        this.getVendorBookingsCalenderCallback
      );
    } else if (this.props.loggedInUser.user_type === "beauty") {
      const reqData = {
        user_id: id,
        date: fromDate,
        from_date: fromDate,
        to_date: toDate,
        search_keyword: search_keyword,
      };
      this.props.enableLoading();
      this.props.getTraderMonthBeautyBooking(
        reqData,
        this.getVendorBookingsCalenderCallback
      );
    }
    this.props.disableLoading();
  };

  /**
   * @method handleBookingPageChange
   * @description handle page change
   */
  handleBookingPageChange = (e) => {
    this.setState({ filterdata: e.target.value });
    // this.getDashboardDetails(e, search_keyword);
  };

  /**
   * @method renderTotalEarning
   * @description render total earning block
   */
  renderTotalEarning = (price, percentage) => {
    const { currentEarning, lastEarning } = this.state;
    let increaseRate = 100;
    let decreaseRate = 100;
    let cEarn = currentEarning; //100;
    // Number(currentEarning);
    let lEarn = lastEarning; //90;
    Number(lastEarning);

    if (cEarn > lEarn && lEarn !== 0) {
      // The percentage increase from 30 to 40 is:
      // (40-30)/30 * 100 = 33%

      increaseRate = ((cEarn - lEarn) / lEarn) * 100;
    } else if (cEarn < lEarn && cEarn !== 0) {
      // The percentage decrease from 40 to 30 is:
      // (40-30)/40 * 100 = 25%.

      decreaseRate = ((lEarn - cEarn) / cEarn) * 100;
    }
    return (
      <Title level={2}>
        {price === 0 && lEarn === 0 ? (
          <span className="dark-text">
            <span className="pecentage-value">0%</span>
          </span>
        ) : (
          <span className="dark-text">
            <span
              className={
                price === 0 && lEarn === 0 ? "price zero" : "price show"
              }
            >
              ${salaryNumberFormate(price)}
            </span>
            <span
              className={
                price === 0 && lEarn === 0
                  ? "pecentage-value hidden"
                  : "pecentage-value show"
              }
            >
              {" "}
              {cEarn > lEarn ? <CaretUpOutlined /> : <CaretDownOutlined />}{" "}
              {lEarn === 0
                ? ""
                : cEarn === 0
                ? `${parseFloat(lEarn)}%`
                : cEarn > lEarn
                ? `${increaseRate.toFixed(2)}%`
                : `${decreaseRate.toFixed(2)}%`}
            </span>
          </span>
        )}
      </Title>
    );
  };

  isToday = (someDate) => {
    const today = new Date();
    return (
      moment(today).format("DD MMMM yy") ==
      moment(someDate).format("DD MMMM yy")
    );
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
  /**
   * @method renderVendorDashboardDetails
   * @description render dashboard details
   */
  renderVendorDashboardDetails = () => {
    const { vendorBookingList } = this.state;

    const dataSearch = vendorBookingList.filter((item) => {
      return (
        item.customer.name
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });
    if (
      vendorBookingList &&
      vendorBookingList.length &&
      dataSearch.length !== 0
    ) {
      return ["handyman", "trader"].includes(
        this.props.loggedInUser.user_type
      ) ? (
        <Fragment>
          {dataSearch.map((value, i) => {
            console.log("############################!@#", value);
            return (
              <div className="my-new-order-block" key={i}>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <div className="odr-no">
                      <h4>
                        {value.status == "Job-Done"
                          ? "Completed"
                          : value.status}
                      </h4>
                      <span className="pickup">{value.sub_category_name}</span>
                    </div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img
                          alt="test"
                          src={
                            value.customer && value.customer.image_thumbnail
                              ? value.customer.image_thumbnail
                              : require("../../../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">
                        {value.customer && value.customer.name}
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
                      <span className="fm-eventb-month date">
                        {this.state.dropdown_label === "This Month"
                          ? moment(value.date).format("DD MMMM yy")
                          : this.state.dropdown_label === "This Week"
                          ? moment(value.date).format("DD MMMM yy")
                          : this.timestampToString(
                              moment(value.date).format("DD MMMM yy"),
                              value.from,
                              true
                            )}
                      </span>

                      <div className="price">
                        {`AU$${salaryNumberFormate(value.cost)}`}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                        <div className="fm-eventb-date">
                          <h3>Date Requested:</h3>
                          <span className="fm-eventb-month">
                            {moment(value.created_at, "YYYY-MM-DD").format(
                              "MMMM DD,yy"
                            )}
                          </span>
                          <span className="fm-eventb-time">
                            {moment(value.from, "hh:mm:ss").format("LT")}-{" "}
                            {moment(value.to, "hh:mm:ss").format("LT")}
                          </span>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={18}
                        xl={17}
                        className="fm-desc-wrap"
                      >
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={8} xl={16}>
                            <div className="fm-eventb-desc">
                              <h3>Request:</h3>
                              <span className="fm-eventb-content">
                                {value.description}
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={16}
                            xl={8}
                            className="align-right self-flex-end"
                          >
                            {value.trader_job_id
                              ? value.status == "Cancelled" && (
                                  <i
                                    className="trash-icon"
                                    onClick={() => {
                                      this.DeleteTraderJob(value.trader_job_id);
                                      // this.setState({ selectedEnquiryId: "" });
                                    }}
                                  >
                                    <svg
                                      width="10"
                                      height="13"
                                      viewBox="0 0 10 13"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0.666665 10.8089C0.666665 11.5263 1.26666 12.1132 2 12.1132H7.33332C8.06665 12.1132 8.66665 11.5263 8.66665 10.8089V2.98348H0.666665V10.8089ZM9.33331 1.02712H6.99998L6.33332 0.375H2.99999L2.33333 1.02712H0V2.33136H9.33331V1.02712Z"
                                        fill="#C2CFE0"
                                      />
                                    </svg>
                                  </i>
                                )
                              : value.status == "Cancelled" && (
                                  <i
                                    className="trash-icon"
                                    onClick={() => {
                                      this.DeleteQuoteJob(value.id);
                                      // this.setState({ selectedEnquiryId: "" });
                                    }}
                                  >
                                    <svg
                                      width="10"
                                      height="13"
                                      viewBox="0 0 10 13"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0.666665 10.8089C0.666665 11.5263 1.26666 12.1132 2 12.1132H7.33332C8.06665 12.1132 8.66665 11.5263 8.66665 10.8089V2.98348H0.666665V10.8089ZM9.33331 1.02712H6.99998L6.33332 0.375H2.99999L2.33333 1.02712H0V2.33136H9.33331V1.02712Z"
                                        fill="#C2CFE0"
                                      />
                                    </svg>
                                  </i>
                                )}
                            <Button
                              type="default"
                              className={getStatusColor(
                                value.status == "Job-Done"
                                  ? "Completed"
                                  : ["Accepted", "Accepted-Paid"].includes(
                                      value.status
                                    )
                                  ? "Confirmed"
                                  : value.status
                              )}
                            >
                              {value.status == "Job-Done"
                                ? "Completed"
                                : ["Accepted", "Accepted-Paid"].includes(
                                    value.status
                                  )
                                ? "Confirmed"
                                : value.status}
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })}
        </Fragment>
      ) : (
        <Fragment>
          {dataSearch.map((value, i) => {
            return (
              <div className="my-new-order-block" key={i}>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <div className="odr-no">
                      <h4>Upcoming</h4>
                      <span className="pickup">{value.sub_category_name}</span>
                    </div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img
                          alt="test"
                          src={
                            value.customer && value.customer.image_thumbnail
                              ? value.customer.image_thumbnail
                              : require("../../../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">
                        {value.customer && value.customer.name}
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
                      <div className="price">
                        <Title level={2}>
                          {this.state.dropdown_label === "This Month"
                            ? value.booking_date
                            : this.state.dropdown_label === "This Week"
                            ? value.booking_date
                            : this.isToday(moment(value.booking_date))
                            ? "Today"
                            : ""}
                          {/* {this.isToday(moment(value.booking_date))
                            ? "Today"
                            :""} */}
                        </Title>
                      </div>
                      <span className="fm-eventb-month date-time-new">
                        {moment(value.start_time, "hh:mm:ss").format("LT")}
                      </span>
                    </div>
                  </Col>
                </Row>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={7}></Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={18}
                        xl={17}
                        className="fm-desc-wrap"
                      >
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={8} xl={16}></Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={16}
                            xl={8}
                            className="align-right self-flex-end"
                          >
                            {(value.status == "Rejected" ||
                              value.status == "Declined" ||
                              value.status == "Cancelled") && (
                              <i
                                className="trash-icon"
                                onClick={() => {
                                  this.DeleteTraderJob(value.id);
                                }}
                              >
                                <svg
                                  width="10"
                                  height="13"
                                  viewBox="0 0 10 13"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0.666665 10.8089C0.666665 11.5263 1.26666 12.1132 2 12.1132H7.33332C8.06665 12.1132 8.66665 11.5263 8.66665 10.8089V2.98348H0.666665V10.8089ZM9.33331 1.02712H6.99998L6.33332 0.375H2.99999L2.33333 1.02712H0V2.33136H9.33331V1.02712Z"
                                    fill="#C2CFE0"
                                  />
                                </svg>
                              </i>
                            )}
                            <Button
                              type="default"
                              className={getStatusColor(
                                value.status == "Job-Done"
                                  ? "Completed"
                                  : ["Accepted", "Accepted-Paid"].includes(
                                      value.status
                                    )
                                  ? "Confirmed"
                                  : value.status
                              )}
                            >
                              {value.status == "Accepted-Paid"
                                ? "Confirmed"
                                : ["Job-Done", "Booking-Done"].includes(
                                    value.status
                                  )
                                ? "Completed"
                                : value.status}
                              {/* {value.status == "Job-Done"
                                ? "Completed"
                                : ["Accepted", "Accepted-Paid"].includes(
                                    value.status
                                  )
                                ? "Confirmed"
                                : value.status} */}
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })}
        </Fragment>
      );
    } else {
      return <div className="pvf-alert-pad">No records found</div>;
    }
  };

  /**
   * @method getBookingsForCalenderDate
   * @description get booking records by date
   */
  getBookingsForCalenderDate = (date, search_keyword) => {
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
            from_date: selectedDate,
            to_date: selectedDate,
            search_keyword: search_keyword,
          };

          if (
            this.props.loggedInUser.user_type === "handyman" ||
            this.props.loggedInUser.user_type === "trader"
          ) {
            this.props.getTraderMonthBooking(
              req,
              this.getVendorBookingsCalenderCallback
            );
          } else if (this.props.loggedInUser.user_type === "wellbeing") {
            this.props.getTraderMonthWellbeingBooking(
              req,
              this.getVendorBookingsCalenderCallback
            );
          } else if (this.props.loggedInUser.user_type === "beauty") {
            this.props.getTraderMonthBeautyBooking(
              req,
              this.getVendorBookingsCalenderCallback
            );
          }
          // this.props.getTraderMonthWellbeingBooking(
          //   req,
          //   this.getVendorBookingsCalenderCallback
          // );
        }
      }
    );
  };

  /**
   * @method onChangeBookingDates
   * @description handle booking dates change
   */
  onChangeBookingDates = (value) => {
    const { search_keyword } = this.state;
    this.getBookingsForCalenderDate(value, search_keyword);
    // this.getDashboardDetails(value)
  };

  /**
   * @method getVendorBookingsCalenderCallback
   * @description get filtered booking records by date
   */
  getVendorBookingsCalenderCallback = (response) => {
    console.log(
      "🚀 ~ file: index.js ~ line 492 ~ HandymanDashboard ~ response",
      response
    );
    if (response.status === 200 && response.data) {
      let jobs,
        upcoming_count,
        complete_count,
        pending_count,
        total_amount,
        last_earning;
      if (
        this.props.loggedInUser.user_type === "handyman" ||
        this.props.loggedInUser.user_type === "trader"
      ) {
        jobs = Object.assign(response.data.jobs);
        upcoming_count = response.data.job_upcoming_count;
        complete_count = response.data.jobs_complete_count;
        pending_count = response.data.jobs_cancle_count;
        total_amount = response.data.total_amount;
        last_earning = response.data.prevoius_amount;
      } else if (
        this.props.loggedInUser.user_type === "wellbeing" ||
        this.props.loggedInUser.user_type === "beauty"
      ) {
        jobs = Object.assign(response.data.service_bookings);
        upcoming_count = response.data.service_upcoming_count;
        complete_count = response.data.service_complete_count;
        pending_count = response.data.service_cancel_count;
        total_amount = response.data.total_amount;
        last_earning = response.data.prevoius_amount;
      }

      let bookingData = [];
      let obj = Object.keys(jobs);
      obj.map((key) => {
        bookingData.push(...jobs[key]);
      });
      this.setState({
        data: [
          {
            x: "Job Completion",
            y: complete_count ? complete_count : 0,
          },

          {
            x: "Upcoming",
            y: upcoming_count ? upcoming_count : 0,
          },
          {
            x: "Cancelled",
            y: pending_count ? pending_count : 0,
          },
        ],
        currentEarning: total_amount ? total_amount : 0,
        lastEarning: last_earning ? last_earning : 0,
        vendorBookingList: bookingData,
      });
    }
  };

  /**
   * @method getCalenderBookingDataFilter
   * @description get filtered booking records by date
   */
  getCalenderBookingDataFilter = (
    vendorCalenderBookingList,
    selectedBookingDate
  ) => {
    let dataArray = [];
    let completArray = [];
    for (let key in vendorCalenderBookingList) {
      if (moment(key).isSame(selectedBookingDate)) {
        dataArray.push({ date: key, bookings: vendorCalenderBookingList[key] });
      }
      completArray.push(...vendorCalenderBookingList[key]);
    }
    return { selectedDateData: dataArray, allDayData: completArray };
  };

  /**
   * @method renderBokingCalenderItems
   * @description render calender booking items with time
   */
  renderBokingCalenderItems = () => {
    const { vendorBookingList } = this.state;
    if (vendorBookingList && vendorBookingList.length) {
      return (
        <ul className="flex-container wrap">
          {vendorBookingList.map((value, i) => {
            return (
              <li key={`${i}_vendor_bookings`}>
                <div className="appointments-label">
                  {value.sub_category_name}
                </div>
                <div className="appointments-time">
                  {convertTime24To12Hour(value.from)}
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
   * @method dateCellRender
   * @description render calender dates cells
   */
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

  renderToday = () => {
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span className="today">{displayCalenderDate(Date.now())}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  /**
   * @method renderCalender
   * @description render week calender
   */
  renderCalender = () => {
    const { weeklyDates, selectedBookingDate, search_keyword } = this.state;
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span>
                <LeftOutlined
                  onClick={() => {
                    this.setState(
                      {
                        selectedBookingDate: moment(
                          selectedBookingDate
                        ).subtract(7, "days"),
                      },
                      async () => {
                        await this.createWeekCalender(
                          moment(selectedBookingDate).subtract(7, "days")
                        );
                        this.getDashboardDetails();
                      }
                    );
                  }}
                />{" "}
                {moment(selectedBookingDate).startOf("week").format("D")} -{" "}
                {moment(selectedBookingDate).endOf("week").format("D MMM")}{" "}
                <RightOutlined
                  onClick={() => {
                    this.setState(
                      {
                        selectedBookingDate: moment(selectedBookingDate).add(
                          7,
                          "days"
                        ),
                      },
                      async () => {
                        await this.createWeekCalender(
                          moment(selectedBookingDate).add(7, "days")
                        );
                        this.getDashboardDetails();
                      }
                    );
                  }}
                />
                {/* {displayCalenderDate(
                  selectedBookingDate ? selectedBookingDate : Date.now()
                )} */}
              </span>
            </li>
          </ul>
        </div>
        <ul className="weekdays">
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className="days">
          {weeklyDates.length && this.renderDates(weeklyDates)}
        </ul>
      </div>
    );
  };

  /**
   * @method renderDates
   * @description render week dates
   */
  renderDates = (dates) => {
    const { selectedBookingDate, index, search_keyword } = this.state;
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
                this.getBookingsForCalenderDate(el, search_keyword);
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

  /**
   * @method onChangeCalenderView
   * @description handle calender view change
   */
  onChangeCalenderView = (view) => {
    const { search_keyword } = this.state;
    this.setState(
      {
        calenderView: view,
        selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.getBookingsForCalenderDate();
        }
        this.getDashboardDetails(new Date(), search_keyword);
      }
    );
  };

  /**
   * @method onChangeLeftCalenderView
   * @description handle calender view change
   */
  onChangeLeftCalenderView = (view) => {
    const { search_keyword } = this.state;

    if (view == "Week") {
      this.setState({ dropdown_label: "This Week" });
    } else if (view == "Today") {
      this.setState({ dropdown_label: "Today" });
    } else if (view == "month") {
      this.setState({ dropdown_label: "This Month" });
    }
    this.setState(
      {
        bookingListCalenderView: view,
        selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.createWeekCalender(moment(new Date()).format("YYYY-MM-DD"));
        } else if (view == "Month") {
          console.log("This Month");
        }

        this.getDashboardDetails(new Date(), search_keyword);
      }
    );
  };

  /**
   * @method calculatePercentage
   * @description calclu
   */
  calculatePercentage = (value, total) => {
    if (value && total) {
      let per = (Number(value) / Number(total)) * 100;
      return per.toFixed(0);
    } else {
      return 0;
    }
  };

  /**
   * @method Calculate max_of_three
   * @description max_of_three number
   */
  max_of_three = (x, y, z) => {
    let max_val = 0;
    if (x > y) {
      max_val = x;
    } else {
      max_val = y;
    }
    if (z > max_val) {
      max_val = z;
    }
    return max_val;
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedBookingDate,
      vendorBookingList,
      calenderView,
      bookingListCalenderView,
      search_keyword,
      compare_visible,
      dropdown_label,
    } = this.state;
    const { loggedInUser } = this.props;
    let me = this;
    let menu = (
      <Menu
        className="this-month-dropdown"
        onClick={(e) => {
          let label =
            e.key === "week"
              ? "This Week"
              : e.key === "month"
              ? "This Month"
              : "Today";
          const { monthStart, monthEnd, weekStart, weekEnd } = this.state;
          let fromDate, toDate;
          if (e.key === "week") {
            fromDate = weekStart;
            toDate = weekEnd;
          } else if (e.key === "month") {
            fromDate = monthStart;
            toDate = monthEnd;
          } else if (e.key === "today") {
            fromDate = moment().format("YYYY-MM-DD");
            toDate = moment().format("YYYY-MM-DD");
          }
          const reqData = {
            user_id: this.props.loggedInUser.id,
            date: fromDate,
            from_date: fromDate,
            to_date: toDate,
          };
          this.props.enableLoading();
          if (this.props.loggedInUser.user_type === "handyman") {
            this.props.getTraderMonthBooking(
              reqData,
              this.getVendorBookingsCalenderCallback
            );
          } else if (this.props.loggedInUser.user_type === "trader") {
            this.props.getTraderMonthBooking(
              reqData,
              this.getVendorBookingsCalenderCallback
            );
          } else if (this.props.loggedInUser.user_type === "wellbeing") {
            this.props.getTraderMonthWellbeingBooking(
              reqData,
              this.getVendorBookingsCalenderCallback
            );
          } else if (this.props.loggedInUser.user_type === "beauty") {
            this.props.getTraderMonthBeautyBooking(
              reqData,
              this.getVendorBookingsCalenderCallback
            );
          } else {
          }
          this.props.disableLoading();
          this.setState({ dropdown_label: label });
        }}
      >
        <Menu.Item key="month">This Month</Menu.Item>
        <Menu.Item key="week">This Week</Menu.Item>
        <Menu.Item key="today">Today</Menu.Item>
      </Menu>
    );
    const config = {
      forceFit: false,
      title: {
        visible: true,
        text: "Ring chart-indicator card",
      },
      description: {
        visible: false,
        text: "The ring chart indicator card can replace tooltip\uFF0C to display detailed information of each category in the hollowed-out part of the ring chart\u3002",
      },
      radius: 0.1,
      padding: "auto",
      // data: salesPieData,
      angleField: "value",
      colorField: "type",
      statistic: { visible: true },
    };
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", this.state.data);
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box view-class-tab booking-common-employee-dashborad-box-v2"
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
                            <div className="heading-text active-tab">
                              <Button className="orange-btn">
                                My Dashboard
                              </Button>
                            </div>
                            <div className="right btn-right-block ">
                              {console.log(
                                loggedInUser.user_type,
                                "loggedInUser.user_type",
                                langs.key.handyman,
                                "333333333333"
                              )}
                              <Button
                                onClick={() => {
                                  //Implment Conditions for Mybookings page
                                  if (
                                    loggedInUser.user_type ===
                                      langs.key.handyman ||
                                    loggedInUser.user_type === "trader"
                                  ) {
                                    window.location.assign(
                                      "/handyman-my-bookings"
                                    );
                                  } else if (
                                    loggedInUser.user_type ===
                                    langs.userType.fitness
                                  ) {
                                    window.location.assign(
                                      "/fitness-my-bookings"
                                    );
                                  } else if (
                                    loggedInUser.user_type ===
                                    langs.userType.wellbeing
                                  ) {
                                    window.location.assign("/spa-my-bookings");
                                  } else if (
                                    loggedInUser.user_type ===
                                    langs.userType.beauty
                                  ) {
                                    window.location.assign(
                                      "/beauty-my-bookings"
                                    );
                                  }
                                }}
                                className="orange-btn"
                              >
                                My Bookings
                              </Button>
                            </div>
                          </div>
                          <div className="search-block">
                            <Input
                              placeholder="Search Dashboard"
                              prefix={
                                <SearchOutlined className="site-form-item-icon" />
                              }
                              onChange={this.handleBookingPageChange}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="pf-vend-restau-myodr  pf-vend-spa-booking pf-vendor-handyman-dasboard">
                    <Row gutter={30}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Card
                          className="profile-content-shadow-box dashboard-left-calnder-block"
                          title="Latest Activity"
                          extra={
                            <div className="card-header-select">
                              <label>Sort:</label>
                              <Select
                                onChange={(e) => {
                                  this.onChangeLeftCalenderView(e);
                                }}
                                defaultValue={"month"}
                                dropdownMatchSelectWidth={false}
                                dropdownClassName="filter-dropdown"
                              >
                                {/* {(loggedInUser.user_type ===
                                  langs.key.handyman ||
                                  loggedInUser.user_type === "trader") && ( */}
                                <Option value="month">This Month</Option>
                                <Option value="Week">This Week</Option>
                                <Option value="Today">Today</Option>

                                {/* {loggedInUser.user_type !==
                                  langs.key.handyman &&
                                  loggedInUser.user_type !== "trader" && (
                                    <Option value="month">This Month</Option>
                                  )} */}
                              </Select>
                            </div>
                          }
                        >
                          <Row>
                            <Col className="gutter-row" md={24}>
                              {
                                bookingListCalenderView === "Week"
                                  ? this.renderCalender()
                                  : bookingListCalenderView === "Today"
                                  ? this.renderToday()
                                  : ""
                                // <Calendar
                                //   onSelect={this.onChangeBookingDates}
                                //   fullscreen={false}
                                //   dateCellRender={this.dateCellRender}
                                //   onPanelChange={(e, mode) => {
                                //     let startDate = moment(e)
                                //       .startOf("month")
                                //       .format("YYYY-MM-DD");
                                //     let endDate = moment(e)
                                //       .endOf("month")
                                //       .format("YYYY-MM-DD");
                                //     this.setState(
                                //       {
                                //         selectedMode: mode,
                                //         bookingListCalenderView: mode,
                                //         monthStart: startDate,
                                //         monthEnd: endDate,
                                //       },
                                //       () => {
                                //         this.getDashboardDetails(1);
                                //       }
                                //     );
                                //   }}
                                // />
                              }
                            </Col>
                          </Row>
                          <Divider />
                          <div className="profile-vendor-retail-orderdetail">
                            {/* {(loggedInUser.user_type === langs.key.handyman ||
                              loggedInUser.user_type === "trader") && ( */}
                            <Col className="task-statusbar gutter-row" md={24}>
                              <div className="odr-no">
                                <h3>{`${+this.state.data[0].y}/${
                                  +this.state.data[0].y +
                                  +this.state.data[1].y +
                                  +this.state.data[2].y
                                }  tasks completed`}</h3>
                              </div>
                              <Progress
                                strokeColor={{
                                  "0%": "rgb(80 234 135)",
                                  "100%": "rgb(80 234 135)",
                                }}
                                trailColor={{
                                  "0%": "rgb(80 234 135)",
                                  "100%": "rgb(80 234 135)",
                                }}
                                percent={
                                  (+this.state.data[0].y /
                                    (+this.state.data[0].y +
                                      +this.state.data[1].y +
                                      +this.state.data[2].y)) *
                                  100
                                }
                                showInfo={false}
                              />
                            </Col>
                            {/* )} */}
                            {this.renderVendorDashboardDetails()}
                          </div>
                        </Card>
                      </Col>
                      <Col
                        className="pf-vendor-dashboard-right"
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        xl={8}
                      >
                        {/* {loggedInUser.user_type !== langs.key.handyman &&
                          loggedInUser.user_type !== "trader" && (
                            <>
                              <div className="appointments-slot right-calender-view">
                                <div className="appointments-heading">
                                  <div className="date-heading">
                                    My Calender
                                  </div>
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
                                    onPanelChange={(e, mode) => {
                                      let startDate = moment(e)
                                        .startOf("month")
                                        .format("YYYY-MM-DD");
                                      let endDate = moment(e)
                                        .endOf("month")
                                        .format("YYYY-MM-DD");
                                      this.setState(
                                        {
                                          selectedMode: mode,
                                          bookingListCalenderView: mode,
                                          monthStart: startDate,
                                          monthEnd: endDate,
                                        },
                                        () => {
                                          this.getDashboardDetails(1);
                                        }
                                      );
                                    }}
                                  />
                                )}
                              </div>
                              <div className="appointments-slot mt-20">
                                <div className="appointments-heading">
                                  <div className="date">
                                    {moment(selectedBookingDate).format(
                                      "MMM D YYYY"
                                    )}
                                  </div>
                                  <div className="appointments-count">
                                    {vendorBookingList &&
                                      vendorBookingList.length}{" "}
                                    Activities today
                                  </div>
                                </div>
                                <div className="appointments-body">
                                  {this.renderBokingCalenderItems()}
                                </div>
                              </div>
                            </>
                          )} */}
                        {
                          // (loggedInUser.user_type === langs.key.handyman ||
                          //   loggedInUser.user_type === "trader") && (
                          <>
                            <Card className="pie-chart-info mb-20">
                              <div className="heading-block">
                                <Dropdown overlay={menu}>
                                  <Button>
                                    {dropdown_label}

                                    <CaretDownOutlined
                                      style={{
                                        fontSize: "11px",
                                        color: "#363B40",
                                      }}
                                    />
                                  </Button>
                                </Dropdown>
                                <div className="currancy">{"AUD"}</div>
                              </div>
                              <div className="total-earnings-detail-block">
                                <Title level={4}>Total earnings</Title>

                                {!compare_visible &&
                                  this.renderTotalEarning(
                                    this.state.currentEarning,
                                    "34"
                                  )}

                                {
                                  <Text className="subtitle-txt">
                                    Compared to last month
                                  </Text>
                                }
                              </div>
                            </Card>
                            <Card className="pie-chart" title={"Tasks"}>
                              <div>
                                <Row gutter={15}>
                                  <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                                    <Pie
                                      {...config}
                                      hasLegend={false}
                                      title="Shipment"
                                      subTitle=""
                                      total={() => {
                                        let total = `${this.calculatePercentage(
                                          +this.state.data[1].y,
                                          +this.state.data[0].y +
                                            +this.state.data[1].y +
                                            +this.state.data[2].y
                                        )}`;
                                        {console.log(total,"totall===")}
                                        return (
                                          <>
                                          <p>Completed</p>
                                          <span
                                            style={{ color: "#ebeff2" }}
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                total !== undefined && total
                                                  ? +total + "%"
                                                  : 0 + "%",
                                            }}
                                          />
                                          </>
                                        );
                                      }}
                                      data={
                                        this.max_of_three(
                                          this.state.data[0].y,
                                          this.state.data[1].y,
                                          this.state.data[2].y
                                        ) === 0
                                          ? [{ x: "", y: 100 }]
                                          : this.state.data
                                      }
                                      colors={
                                        this.max_of_three(
                                          this.state.data[0].y,
                                          this.state.data[1].y,
                                          this.state.data[2].y
                                        ) === 0
                                          ? ["#ebeff2"]
                                          : ["#FFB946", "#2ED47A", "#F7685B"]
                                      }
                                      valueFormat={(val) => <div></div>}
                                      height={215}
                                    />
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                    <ul className="pie-right-content">
                                      <li
                                        className={
                                          this.calculatePercentage(
                                            +this.state.data[1].y,
                                            +this.state.data[0].y +
                                              +this.state.data[1].y +
                                              +this.state.data[2].y
                                          ) === 0
                                            ? "yellow zero"
                                            : "yellow"
                                        }
                                      >
                                        {/* {`${this.calculatePercentage(
                                          +this.state.data[1].y,
                                          +this.state.data[0].y +
                                            +this.state.data[1].y +
                                            +this.state.data[2].y
                                        )}% `} */}
                                        {`${this.calculatePercentage(
                                          +this.state.data[0].y,
                                          +this.state.data[0].y +
                                            +this.state.data[1].y +
                                            +this.state.data[2].y
                                        )}% `}
                                        <span>Active</span>
                                      </li>
                                      <li
                                        className={
                                          this.calculatePercentage(
                                            +this.state.data[0].y,
                                            +this.state.data[0].y +
                                              +this.state.data[1].y +
                                              +this.state.data[2].y
                                          ) === 0
                                            ? "green zero"
                                            : "green"
                                        }
                                      >
                                        {`${this.calculatePercentage(
                                          +this.state.data[1].y,
                                          +this.state.data[0].y +
                                            +this.state.data[1].y +
                                            +this.state.data[2].y
                                        )}% `}
                                        {/* {`${this.calculatePercentage(
                                          +this.state.data[0].y,
                                          +this.state.data[0].y +
                                            +this.state.data[1].y +
                                            +this.state.data[2].y
                                        )}% `} */}
                                        <span>Completed</span>
                                      </li>
                                      <li
                                        className={
                                          this.calculatePercentage(
                                            +this.state.data[0].y,
                                            +this.state.data[0].y +
                                              +this.state.data[1].y +
                                              +this.state.data[2].y
                                          ) === 0
                                            ? "red zero"
                                            : "red"
                                        }
                                      >
                                        {`${this.calculatePercentage(
                                          +this.state.data[0].y,
                                          +this.state.data[0].y +
                                            +this.state.data[1].y +
                                            +this.state.data[2].y
                                        )}% `}
                                        <span>Cancelled</span>
                                      </li>
                                    </ul>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                            {this.max_of_three(
                              this.state.data[0].y,
                              this.state.data[1].y,
                              this.state.data[2].y
                            ) === 0 ? (
                              <Row gutter={[10, 20]} className="pt-20">
                                <Col md={24} className="">
                                  <div
                                    className={
                                      this.state.data[0].y === 0
                                        ? "light-white color-box"
                                        : "dark-orange color-box"
                                    }
                                  >
                                    <Title level={3}>
                                      {this.state.data[0].y}
                                    </Title>
                                    <small> {this.state.data[0].x} </small>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div
                                    className={
                                      this.state.data[0].y === 0
                                        ? "light-white color-box"
                                        : "light-yellow color-box"
                                    }
                                  >
                                    <Title level={3}>
                                      {this.state.data[1].y}
                                    </Title>
                                    <Text>{this.state.data[1].x}</Text>
                                  </div>
                                </Col>
                                <Col md={12} className="">
                                  <div
                                    className={
                                      this.state.data[0].y === 0
                                        ? "light-white color-box"
                                        : "light-orange color-box"
                                    }
                                  >
                                    <Title level={3}>
                                      {this.state.data[2].y}
                                    </Title>
                                    <small> {this.state.data[2].x}</small>
                                  </div>
                                </Col>
                              </Row>
                            ) : (
                              <Row gutter={[10, 20]} className="pt-20">
                                <Col md={24} className="">
                                  <div className="light-yellow color-box">
                                    <Title level={3}>
                                      {this.state.data[0].y}
                                    </Title>
                                    <small> {this.state.data[0].x} </small>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="dark-orange color-box">
                                    <Title level={3}>
                                      {this.state.data[1].y}
                                    </Title>
                                    <Text>{this.state.data[1].x}</Text>
                                  </div>
                                </Col>
                                <Col md={12} className="">
                                  <div className="light-orange color-box">
                                    <Title level={3}>
                                      {this.state.data[2].y}
                                    </Title>
                                    <small> {this.state.data[2].x}</small>
                                  </div>
                                </Col>
                              </Row>
                            )}
                          </>
                          // )
                        }
                      </Col>
                    </Row>
                  </div>
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
  getTraderMonthBooking,
  enableLoading,
  disableLoading,
  getCustomerMyBookingsCalender,
  listVendorServiceSpaBookings,
  listVendorServiceSpaBookingsHistory,
  getVendorWellBeingMonthBookingsCalender,
  wellbeingServiceBookingsRating,
  getTraderMonthWellbeingBooking,
  DeleteWellBeingApi,
  DeleteTraderJobapi,
  DeleteTraderJobss,
  getTraderMonthBeautyBooking,
})(HandymanDashboard);
