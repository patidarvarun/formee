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
  Divider,
  Calendar,
  Badge,
  Col,
  Input,
  Layout,
  Row,
  Typography,
  Button,
  Card,
  Select,
  Alert,
  Progress,
  Dropdown,
  Menu,
} from "antd";
import {
  enableLoading,
  disableLoading,
  getTraderMonthBooking,
  getTraderMonthEventBooking,
  DeleteEventBookingapi,
  deleteEventEnquiry,
} from "../../../../../actions";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import { toastr } from "react-redux-toastr";
import { STATUS_CODES } from "../../../../../config/StatusCode";

import { langs } from "../../../../../config/localization";
import {
  convertTime24To12Hour,
  displayCalenderDate,
  displayDate,
  salaryNumberFormate,
} from "../../../../../components/common";
import { PAGE_SIZE } from "../../../../../config/Config";
import { getStatusColor } from "../../../../../config/Helper";
import "../../../calender.less";
import "../../../employer.less";
import "../../../addportfolio.less";
import "./profile-vendor-handyman.less";

const { Title, Text } = Typography;
const { Option } = Select;
class EventVendorDashboard extends React.Component {
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
      selectedDateBookingListing: new Date(),
      vendorBookingList: [],
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
    this.getDashboardListing(this.state.selectedDateBookingListing);
    // this.getBookingsForCalenderDate(this.state.selectedBookingDate);
    this.createWeekCalender();
  }
  handleBookingPageChange = (e) => {
    this.setState({ filterdata: e.target.value });
    // this.getDashboardDetails(e, search_keyword);
  };
  /**
   * @method createWeekCalender
   * @description create week calender view
   */
  getVendorBookingsCalenderCallback = (response) => {
    if (response.status === 200 && response.data) {
      let jobs,
        upcoming_count,
        complete_count,
        pending_count,
        total_amount,
        last_earning;
      if (this.props.loggedInUser.user_type === "events") {
        jobs = Object.assign(response.data.event_bookings);
        upcoming_count = response.data.event_upcoming_count;
        complete_count = response.data.event_complete_count;
        pending_count = response.data.event_cancle_count;
        total_amount = response.data.total_amount;
        last_earning = response.data.prevoius_amount;
      }

      let dataArray = [];
      let obj = Object.keys(jobs);
      obj.map((key) => {
        dataArray.push(...jobs[key]);
      });
      // let listData = response.data.event_bookings;
      // for (let key in listData) {
      //   if (moment(key).isSame(selecetdDate)) {
      //     dataArray.push({ date: key, bookings: listData[key] });
      //   }
      // }
      this.setState({
        // vendorBookingList: dataArray,
        // currentEarning: response.data.total_amount
        //   ? response.data.total_amount
        //   : 0,
        // lastEarning: response.data.prevoius_amount
        //   ? response.data.prevoius_amount
        //   : 0,
        data: [
          {
            x: "Job Completion",
            y: response.data.event_complete_count
              ? response.data.event_complete_count
              : 0,
          },
          {
            x: "Upcoming",
            y: response.data.event_upcoming_count
              ? response.data.event_upcoming_count
              : 0,
          },
          {
            x: "Cancelled",
            y: response.data.event_cancel_count
              ? response.data.event_cancel_count
              : 0,
          },
        ],
        currentEarning: total_amount ? total_amount : 0,
        lastEarning: last_earning ? last_earning : 0,
        vendorBookingList: dataArray,
      });
    }
  };

  createWeekCalender = (selected_date = null) => {
    function days(current) {
      let week = new Array();
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

  DeleteEventEnquiry = (id, enq_id) => {
    let reqData = {
      enquire_response_id: id,
      user_id: this.props.loggedInUser.id,
      enquire_id: enq_id,
    };

    this.props.deleteEventEnquiry(reqData, (res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, "Successfully deleted");
        this.getDashboardListing();
      }
    });
  };
  DeleteEventBooking = (id, event_id) => {
    let reqData = {
      event_booking_id: id || event_id,
      user_id: this.props.loggedInUser.id,
    };

    this.props.DeleteEventBookingapi(reqData, (res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, "Successfully deleted");
        this.getDashboardListing();
      }
    });
  };

  /**
   * @method getDashboardListing
   * @description get vendor dashboard details
   */
  getDashboardListing = (date) => {
    // this.setState({ search_keyword: search_keyword });
    const selecetdDate = moment(date).format("YYYY-MM-DD");
    const { selectedDateBookingListing } = this.state;
    this.setState(
      {
        selectedDateBookingListing: selecetdDate,
      },
      () => {
        if (selecetdDate) {
          this.props.enableLoading();
          const { id } = this.props.loggedInUser;
          const {
            bookingListCalenderView,
            monthStart,
            monthEnd,
            weekStart,
            weekEnd,
          } = this.state;
          // console.log("weekStart=weekEnd", weekStart, weekEnd);
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

          const reqData = {
            user_id: id,
            date: selectedDateBookingListing,
            //date: fromDate,
            from_date: fromDate,
            to_date: toDate,
            //search_keyword: search_keyword,
            search_keyword: this.state.search_keyword
              ? this.state.search_keyword
              : "",
          };
          this.props.getTraderMonthEventBooking(reqData, (response) => {
            console.log("reqDatata", reqData);
            this.props.disableLoading();
            if (response.status === 200) {
              let jobs,
                upcoming_count,
                complete_count,
                pending_count,
                total_amount,
                last_earning;
              if (this.props.loggedInUser.user_type === "events") {
                jobs = Object.assign(response.data.event_bookings);
                upcoming_count = response.data.event_upcoming_count;
                complete_count = response.data.event_complete_count;
                pending_count = response.data.event_cancle_count;
                total_amount = response.data.total_amount;
                last_earning = response.data.prevoius_amount;
              }

              let dataArray = [];
              let obj = Object.keys(jobs);
              obj.map((key) => {
                dataArray.push(...jobs[key]);
              });
              // let listData = response.data.event_bookings;
              // for (let key in listData) {
              //   if (moment(key).isSame(selecetdDate)) {
              //     dataArray.push({ date: key, bookings: listData[key] });
              //   }
              // }
              this.setState({
                // vendorBookingList: dataArray,
                // currentEarning: response.data.total_amount
                //   ? response.data.total_amount
                //   : 0,
                // lastEarning: response.data.prevoius_amount
                //   ? response.data.prevoius_amount
                //   : 0,
                data: [
                  {
                    x: "Job Completion",
                    y: response.data.event_complete_count
                      ? response.data.event_complete_count
                      : 0,
                  },
                  {
                    x: "Upcoming",
                    y: response.data.event_upcoming_count
                      ? response.data.event_upcoming_count
                      : 0,
                  },
                  {
                    x: "Cancelled",
                    y: response.data.event_cancel_count
                      ? response.data.event_cancel_count
                      : 0,
                  },
                ],
                currentEarning: total_amount ? total_amount : 0,
                lastEarning: last_earning ? last_earning : 0,
                vendorBookingList: dataArray,
              });
            }
          });
        }
      }
    );
  };

  /**
   * @method getBookingsForCalenderDate
   * @description get booking records by date
   */
  getBookingsForCalenderDate = (date) => {
    const selectedDate = moment(date).format("YYYY-MM-DD");
    this.setState(
      {
        selectedBookingDate: selectedDate,
      },
      () => {
        const { id } = this.props.loggedInUser;
        const reqData = {
          user_id: id, //862
          date: selectedDate,
          from_date: selectedDate,
          to_date: selectedDate,
          search_keyword: "",
        };
        this.props.enableLoading();
        this.props.getTraderMonthEventBooking(reqData, (response) => {
          this.props.disableLoading();
          if (response.status === 200 && response.data) {
            let bookingData = this.getCalenderBookingDataFilter(
              response.data.event_bookings,
              this.state.selectedBookingDate
            );
            this.setState({
              vendorCalenderBookingList: bookingData.selectedDateData,
              vendorAllDayCalenderBookingList: bookingData.allDayData,
            });
          }
        });
      }
    );
  };

  /**
   * @method renderVendorDashboardDetails
   * @description render dashboard details
   */
  renderVendorDashboardDetails = () => {
    const { vendorBookingList } = this.state;
    const dataSearch = vendorBookingList.filter((item) => {
      return item.event_name
        ? item.event_name
            .toString()
            .toLowerCase()
            .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
        : item.customer.name
            .toString()
            .toLowerCase()
            .indexOf(this.state.filterdata.toString().toLowerCase()) > -1;
    });
    if (
      vendorBookingList.length &&
      vendorBookingList.length > 0 &&
      dataSearch.length !== 0
    ) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            console.log("################################123", value);
            return (
              <div className="my-new-order-block" key={i}>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <div className="odr-no">
                      <h4>
                        {value.status === "Pending"
                          ? "Quotes Request"
                          : value.status}
                      </h4>
                      <span className="pickup">
                        {value.event_types ? value.event_types.name : "N/A"}
                      </span>
                    </div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img
                          alt="test"
                          src={
                            value.customer && value.customer.image_thumbnail
                              ? value.customer.image_thumbnail
                              : require("../../../../../assets/images/avatar3.png")
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
                      <span className="fm-eventb-month date-time-new">
                        {this.state.dropdown_label === "This Month"
                          ? moment(value.booking_date).format("DD MMMM yy")
                          : this.state.dropdown_label === "This Week"
                          ? moment(value.booking_date).format("DD MMMM yy")
                          : value.enquire_response_id
                          ? this.timestampToString(
                              moment(value.booking_date).format("DD MMMM yy"),
                              moment(value.start_time).format(" hh:mm:ss "),

                              true
                            )
                          : this.timestampToString(
                              moment(value.booking_date).format("DD MMMM yy"),
                              value.start_time,
                              true
                            )}
                      </span>
                      <div className="price mt-5 fs-25">
                        {`AU$${salaryNumberFormate(value.price)}`}
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
                            {moment(
                              value.created_at,
                              "YYYY-MM-DD hh:mm:ss"
                            ).format("MMMM DD,yy")}
                          </span>
                          <span className="fm-eventb-time">
                            {moment(value.start_time, "hh:mm:ss").format("LT")}{" "}
                            - {moment(value.end_time, "hh:mm:ss").format("LT")}
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
                          <Col xs={24} sm={24} md={24} lg={8} xl={15}>
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
                            xl={9}
                            className="align-right self-flex-end"
                          >
                            {value.enquire_id || value.enquire_response_id
                              ? (value.status == "Rejected" ||
                                  value.status == "Declined" ||
                                  value.status == "Cancelled") && (
                                  <i
                                    className="trash-icon"
                                    onClick={() => {
                                      this.DeleteEventEnquiry(
                                        value.enquire_response_id,
                                        value.enquire_id
                                      );
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
                              : (value.status == "Rejected" ||
                                  value.status == "Declined" ||
                                  value.status == "Cancelled") && (
                                  <i
                                    className="trash-icon"
                                    onClick={() => {
                                      this.DeleteEventBooking(
                                        value.eb_id,
                                        value.id
                                      );
                                      this.setState({ selectedBookingId: "" });
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
                                )}{" "}
                            <Button
                              type="default"
                              className={getStatusColor(
                                value.status == "Job-Done"
                                  ? "Completed"
                                  : value.status
                              )}
                            >
                              {value.status == "Job-Done"
                                ? "Completed"
                                : value.status}
                            </Button>
                            {/* {value.enquire_id || value.enquire_response_id
                              ? (value.status == "Rejected" ||
                                  value.status == "Declined" ||
                                  value.status == "Cancelled") && (
                                  <i
                                    className="trash-icon"
                                    onClick={() => {
                                      this.DeleteEventEnquiry(
                                        value.enquire_response_id,
                                        value.enquire_id
                                      );
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
                              : (value.status == "Rejected" ||
                                  value.status == "Declined" ||
                                  value.status == "Cancelled") && (
                                  <i
                                    className="trash-icon"
                                    onClick={() => {
                                      this.DeleteEventBooking(
                                        value.eb_id,
                                        value.id
                                      );
                                      this.setState({ selectedBookingId: "" });
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
                                )} */}
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
   * @method onChangeBookingDates
   * @description handle booking dates change
   */
  onChangeBookingDates = (value) => {
    this.getBookingsForCalenderDate(value);
  };

  onChangeListingBookingDates = (value) => {
    this.getDashboardListing(value);
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
      completArray.push({
        date: key,
        bookings: vendorCalenderBookingList[key],
      });
    }
    return { selectedDateData: dataArray, allDayData: completArray };
  };

  /**
   * @method renderBokingCalenderItems
   * @description render calender booking items with time
   */
  renderBokingCalenderItems = () => {
    const { vendorCalenderBookingList } = this.state;
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
                <div className="appointments-label">
                  {value.event_types.name}
                </div>
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

  renderWeeklyCalenderForListing = () => {
    const { weeklyDates, selectedDateBookingListing } = this.state;
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
                        selectedDateBookingListing: moment(
                          selectedDateBookingListing
                        ).subtract(7, "days"),
                      },
                      async () => {
                        await this.createWeekCalender(
                          moment(selectedDateBookingListing).subtract(7, "days")
                        );
                        this.getDashboardListing();
                      }
                    );
                  }}
                />{" "}
                {moment(selectedDateBookingListing).startOf("week").format("D")}{" "}
                -{" "}
                {moment(selectedDateBookingListing)
                  .endOf("week")
                  .format("D MMM")}{" "}
                <RightOutlined
                  onClick={() => {
                    this.setState(
                      {
                        selectedDateBookingListing: moment(
                          selectedDateBookingListing
                        ).add(7, "days"),
                      },
                      async () => {
                        await this.createWeekCalender(
                          moment(selectedDateBookingListing).add(7, "days")
                        );
                        this.getDashboardListing();
                      }
                    );
                  }}
                />
                {/* {displayCalenderDate(
                  selectedDateBookingListing
                    ? selectedDateBookingListing
                    : Date.now()
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
          {weeklyDates.length &&
            this.renderWeeklyCalenderDatesForListing(weeklyDates)}
        </ul>
      </div>
    );
  };

  renderWeeklyCalenderDatesForListing = (dates) => {
    const { selectedDateBookingListing } = this.state;
    return dates.map((el, i) => {
      let selectedDate = selectedDateBookingListing;
      let clickedDate = moment(new Date(el)).format("YYYY-MM-DD");
      return (
        <li
          key={`${i}_weekly_date_listing`}
          onClick={() => {
            this.setState(
              {
                index: i,
                selectedDateBookingListing: moment(new Date(el)).format(
                  "YYYY-MM-DD"
                ),
              },
              () => {
                this.getDashboardListing(el);
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
   * @method renderCalender
   * @description render week calender
   */
  renderCalender = () => {
    const { weeklyDates, selectedBookingDate } = this.state;
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
                        this.getDashboardListing();
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
                        this.getDashboardListing();
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
    const { selectedBookingDate } = this.state;
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

  /**
   * @method onChangeRightCalenderView
   * @description handle calender view change
   */
  onChangeRightCalenderView = (view) => {
    this.setState(
      {
        calenderView: view,
        selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.createWeekCalender(moment(new Date()).format("YYYY-MM-DD"));
        }
        this.getBookingsForCalenderDate(new Date());
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
        this.getDashboardListing(new Date(), search_keyword);
      }
    );
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
      calenderView,
      bookingListCalenderView,
      vendorCalenderBookingList,
      dropdown_label,
      compare_visible,
    } = this.state;
    let menu = (
      <Menu
        className="this-month-dropdown"
        onClick={(e) => {
          console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$", e);
          // let label = e.key === "year" ? "This Year" : "This Month";
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
          this.props.getTraderMonthEventBooking(
            reqData,
            // this.getBookingsForCalenderDate
            this.getVendorBookingsCalenderCallback
          );
          this.props.disableLoading();
          this.setState({ dropdown_label: label });
        }}
      >
        <Menu.Item key="month">This Month</Menu.Item>
        <Menu.Item key="week">This Week</Menu.Item>
        <Menu.Item key="today">Today</Menu.Item>
      </Menu>
      // if (e.key === "year") {
      //   const currentYear = new Date().getFullYear();
      //   const previousYear = currentYear - 1;

      //   let currentYearStartDate = moment(
      //     new Date(currentYear, 0, 1)
      //   ).format("YYYY-MM-DD");
      //   let currentYearEndDate = moment(
      //     new Date(currentYear, 11, 31)
      //   ).format("YYYY-MM-DD");
      //   let lastYearStartDate = moment(new Date(previousYear, 0, 1)).format(
      //     "YYYY-MM-DD"
      //   );
      //   let lastYearEndDate = moment(new Date(previousYear, 11, 31)).format(
      //     "YYYY-MM-DD"
      //   );

      //   this.getDashBoardDetailsByCalendarView(
      //     currentYearStartDate,
      //     currentYearEndDate,
      //     "",
      //     1,
      //     "",
      //     "",
      //     "",
      //     "",
      //     lastYearStartDate,
      //     lastYearEndDate
      //   );
      // } else if (e.key === "month") {
      //   const currentYear = new Date().getFullYear();
      //   const currentMonth = new Date().getMonth();

      //   let currentMonthStartDate = moment(
      //     new Date(currentYear, currentMonth, 1)
      //   ).format("YYYY-MM-DD");
      //   let currentMonthEndDate = moment(
      //     new Date(currentYear, currentMonth + 1, 0)
      //   ).format("YYYY-MM-DD");

      //   let lastMonthStartDate = moment(
      //     new Date(currentYear, currentMonth - 1, 1)
      //   ).format("YYYY-MM-DD");
      //   let lastMonthEndDate = moment(
      //     new Date(currentYear, currentMonth - 1 + 1, 0)
      //   ).format("YYYY-MM-DD");

      //   this.getDashBoardDetailsByCalendarView(
      //     currentMonthStartDate,
      //     currentMonthEndDate,
      //     "",
      //     1,
      //     "",
      //     "",
      //     "",
      //     "",
      //     lastMonthStartDate,
      //     lastMonthEndDate
      //   );
      // }
      // this.setState({ dropdown_label: label });
      // }}
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
    const { loggedInUser } = this.props;
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
                              <Button
                                onClick={() => {
                                  //Implment Conditions for Mybookings page
                                  if (
                                    loggedInUser.user_type ===
                                    langs.key.handyman
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
                                  } else if (
                                    loggedInUser.user_type ===
                                    langs.userType.events
                                  ) {
                                    window.location.assign(
                                      "/events-my-bookings"
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
                              // onChange={(e) => {
                              //   this.setState(
                              //     { search_keyword: e.target.value },
                              //     () => {
                              //       this.getDashboardListing(
                              //         this.state.selectedDateBookingListing
                              //       );
                              //     }
                              //   );
                              // }}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="pf-vend-restau-myodr pf-vend-spa-booking pf-vendor-handyman-dasboard pf-vendor-event-dashboard">
                    <Row gutter={30}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Card
                          className="profile-content-shadow-box dashboard-left-calnder-block event-dashboard-left"
                          title="Latest Activity"
                          extra={
                            <div className="card-header-select">
                              <label>Sort:</label>
                              <Select
                                onChange={(e) => {
                                  this.onChangeLeftCalenderView(e);
                                }}
                                // defaultValue={
                                //   loggedInUser.user_type ===
                                //   langs.userType.events
                                //     ? "today"
                                //     : "This week"
                                // }
                                // dropdownMatchSelectWidth={false}
                                // dropdownClassName="filter-dropdown"
                                defaultValue={"month"}
                                dropdownMatchSelectWidth={false}
                                dropdownClassName="filter-dropdown"
                              >
                                <Option value="month">This Month</Option>
                                <Option value="Week">This Week</Option>
                                <Option value="Today">Today</Option>
                                {/* {loggedInUser.user_type ===
                                  langs.userType.events && (
                                  <Option value="today">Today</Option>
                                  
                                )} */}
                                {/* <Option value="week">This Week</Option>
                                {loggedInUser.user_type !==
                                  langs.userType.events && (
                                  <Option value="month">This Month</Option>
                                )} */}
                              </Select>
                            </div>
                          }
                        >
                          <Row>
                            {/* <Col className="gutter-row" md={24}>
                              {bookingListCalenderView === "week" ? (
                                this.renderWeeklyCalenderForListing()
                              ) : (
                                <Calendar
                                  onSelect={this.onChangeListingBookingDates}
                                  fullscreen={false}
                                  //dateCellRender={this.dateCellRender}
                                />
                              )}
                            </Col> */}
                            <Col className="gutter-row" md={24}>
                              {
                                bookingListCalenderView === "Week"
                                  ? this.renderCalender()
                                  : bookingListCalenderView === "Today"
                                  ? this.renderToday()
                                  : ""
                                // <Calendar
                                //   onSelect={this.onChangeListingBookingDates}
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
                            {loggedInUser.user_type ===
                              langs.userType.events && (
                              <Col
                                className="task-statusbar gutter-row"
                                md={24}
                              >
                                {/* <div className="odr-no">
                                <h3>8 task completed out of 10</h3>
                              </div> */}
                                {/* <Progress strokeColor={{ '0%': 'rgb(80 234 135)', '100%': 'rgb(80 234 135)' }} trailColor={{ '0%': 'rgb(80 234 135)', '100%': 'rgb(80 234 135)' }} percent={80} showInfo={false} /> */}

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
                                    (+this.state.data[1].y /
                                      (+this.state.data[0].y +
                                        +this.state.data[1].y +
                                        +this.state.data[2].y)) *
                                    100
                                  }
                                  showInfo={false}
                                />
                              </Col>
                            )}
                            {this.renderVendorDashboardDetails()}
                          </div>
                        </Card>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        xl={8}
                        className="pf-vendor-dashboard-right"
                      >
                        {/* {loggedInUser.user_type !== langs.userType.events && (
                          <>
                            <div className="appointments-slot right-calender-view">
                              <div className="appointments-heading">
                                <div className="date-heading">My Calender</div>
                                <div className="card-header-select">
                                  <label>Show:</label>
                                  <Select
                                    onChange={(e) => {
                                      this.onChangeRightCalenderView(e);
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
                                  {moment(selectedBookingDate).format(
                                    "MMM D YYYY"
                                  )}
                                </div>
                                <div className="appointments-count">
                                  {vendorCalenderBookingList.length &&
                                  vendorCalenderBookingList[0].bookings.length >
                                    0
                                    ? vendorCalenderBookingList[0].bookings
                                        .length
                                    : 0}{" "}
                                  Activities today
                                </div>
                              </div>
                              <div className="appointments-body">
                                {this.renderBokingCalenderItems()}
                              </div>
                            </div>
                          </>
                        )}
                        {loggedInUser.user_type === langs.userType.events && ( */}
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
                              {/* {compare_visible && <Row>
                                  <Col md={12}>
                                    Last month
                                    {this.renderTotalEarning('4556', '34')}
                                  </Col>
                                  <Col md={12}>
                                    This month
                                    {this.renderTotalEarning('3456', '34')}
                                  </Col>
                                </Row>}
                              */}
                              {
                                <Text
                                  className="subtitle-txt"
                                  // onClick={() => {
                                  //   this.setState({ compare_visible: !this.state.compare_visible })
                                  // }}
                                >
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
                                      let total = this.max_of_three(
                                        this.state.data[0].y,
                                        this.state.data[0].y,
                                        this.state.data[0].y
                                      );
                                      return (
                                        <span
                                          style={{ color: "#ebeff2" }}
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              total !== undefined && total
                                                ? total + "%"
                                                : 0 + "%",
                                          }}
                                        />
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
                                        : [
                                            "#FFB946",
                                            "#2ED47A",
                                            "#F7685B",
                                            // "#ee4928",
                                          ]
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
                                      {`${this.calculatePercentage(
                                        +this.state.data[1].y,
                                        +this.state.data[0].y +
                                          +this.state.data[1].y +
                                          +this.state.data[2].y
                                      )}% `}
                                      <span>Active</span>
                                    </li>
                                    {/* <li className="violate">{`${this.calculatePercentage(
                                        "",
                                        total_count
                                      )}% Shipped`}</li> */}
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
                                        +this.state.data[0].y,
                                        +this.state.data[0].y +
                                          +this.state.data[1].y +
                                          +this.state.data[2].y
                                      )}% `}
                                      <span>Completed</span>
                                    </li>
                                    <li
                                      className={
                                        this.calculatePercentage(
                                          +this.state.data[2].y,
                                          +this.state.data[0].y +
                                            +this.state.data[1].y +
                                            +this.state.data[2].y
                                        ) === 0
                                          ? "red zero"
                                          : "red"
                                      }
                                    >
                                      {`${this.calculatePercentage(
                                        +this.state.data[2].y,
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
                                  <Title level="3">
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
                                  <Title level="3">
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
                                  <Title level="3">
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
                                  <Title level="3">
                                    {this.state.data[0].y}
                                  </Title>
                                  <small> {this.state.data[0].x} </small>
                                </div>
                              </Col>
                              <Col md={12}>
                                <div className="dark-orange color-box">
                                  <Title level="3">
                                    {this.state.data[1].y}
                                  </Title>
                                  <Text>{this.state.data[1].x}</Text>
                                </div>
                              </Col>
                              <Col md={12} className="">
                                <div className="light-orange color-box">
                                  <Title level="3">
                                    {this.state.data[2].y}
                                  </Title>
                                  <small> {this.state.data[2].x}</small>
                                </div>
                              </Col>
                            </Row>
                          )}
                        </>
                        {/* )} */}
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              {/* <div className="employsearch-block">
                <div className="employsearch-right-pad">
                  <Row gutter={30}>
                    <Col xs={24} md={16} lg={16} xl={14}>
                      <div className="search-block"></div>
                    </Col>
                    <Col
                      xs={24}
                      md={8}
                      lg={8}
                      xl={10}
                      className="employer-right-block text-right"
                    >
                      <div className="right-view-text">
                        <span>
                          {" "}
                          <img
                            src={require("../../../../../assets/images/pin.png")}
                          />{" "}
                        </span>
                        <span
                          style={{
                            display: "inline-block",
                            paddingLeft: "15px",
                            paddingRight: "34px",
                          }}
                        >
                          {" "}
                          <img
                            src={require("../../../../../assets/images/menu_list.png")}
                          ></img>{" "}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div> */}
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
  enableLoading,
  disableLoading,
  getTraderMonthBooking,
  getTraderMonthEventBooking,
  deleteEventEnquiry,
  DeleteEventBookingapi,
})(EventVendorDashboard);
