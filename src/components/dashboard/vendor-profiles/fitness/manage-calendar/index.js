import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  Col,
  Input,
  Layout,
  Row,
  Typography,
  Card,
  Tabs,
  Select,
  Alert,
} from "antd";
import {
  enableLoading,
  disableLoading,
  listTraderCustomersOfBookedClasses,
  getTraderMonthFitnessBooking,
} from "../../../../../actions";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import "./fitness-vendor-profile.less";
import {
  displayCalenderDate,
  displayDate,
} from "../../../../../components/common";
import Icon from "../../../../../components/customIcons/customIcons";
import moment from "moment";
import { DASHBOARD_KEYS } from "../../../../../config/Constant";

import { Calendar, Badge } from "antd";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

class FitnessVenderMyCalendar extends React.Component {
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
      visible: false,
      customerBookingList: [],
      key: 1,
      checked: true,
      selectedBookingDate: new Date(),
      monthStart: moment(startOfMonth).format("YYYY-MM-DD"),
      monthEnd: moment(endOfMonth).format("YYYY-MM-DD"),
      weekStart: moment(firstday).format("YYYY-MM-DD"),
      weekEnd: moment(lastday).format("YYYY-MM-DD"),
      listingView: "list",
      calenderView: "month",
      bookingListCalenderView: "week",
      customersBookedClassesList: [],
      weeklyDates: [],
      vendorCalenderBookingList: [],
      vendorAllDayCalenderBookingList: [],
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getListViewTraderCustomersOfBookedClasses();
    this.createWeekCalender();
  }

  onViewChange = (key, type) => {
    if (key == "list") {
      this.setState({ listingView: key, calenderView: "month" });
      this.getListViewTraderCustomersOfBookedClasses();
    } else {
      this.setState({
        listingView: key,
        calenderView: "month",
        selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
      });

      this.getCalendarViewTraderCustomersOfBookedClasses();
    }
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
                this.onChangeBookingDates(el);
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

  getListViewTraderCustomersOfBookedClasses = () => {
    const { trader_profile_id } = this.props.loggedInUser;
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
      from_date: fromDate,
      to_date: toDate,
      trader_user_profile_id: trader_profile_id,
    };
    this.props.enableLoading();
    this.props.listTraderCustomersOfBookedClasses(reqData, (res) => {
      this.props.disableLoading();

      if (res.status === 200) {
        this.setState({ customersBookedClassesList: res.data });
      }
    });
  };

  getCalendarViewTraderCustomersOfBookedClasses = () => {
    const { id, trader_profile_id } = this.props.loggedInUser;
    const { selectedBookingDate } = this.state;
    const selectedDate = moment(selectedBookingDate).format("YYYY-MM-DD");

    const reqData = {
      from_date: selectedDate,
      to_date: selectedDate,
      trader_user_profile_id: trader_profile_id,
    };
    this.props.enableLoading();
    this.props.listTraderCustomersOfBookedClasses(reqData, (res) => {
      this.props.disableLoading();
      const req = {
        user_id: id,
        date: selectedDate,
      };
      this.props.getTraderMonthFitnessBooking(
        req,
        this.getVendorFitnessMonthBookingsCalenderCallback
      );

      if (res.status === 200) {
        this.setState({ customersBookedClassesList: res.data });
      }
    });
  };

  getVendorFitnessMonthBookingsCalenderCallback = (response) => {
    if (response.status === 200 && response.data) {
      //
      let bookingData = this.getCalenderBookingDataFilter(
        response.data.class_bookings,
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

  onChangeBookingDates = (value) => {
    this.setState(
      { selectedBookingDate: moment(value).format("YYYY-MM-DD") },
      () => {
        this.getCalendarViewTraderCustomersOfBookedClasses();
      }
    );
  };

  onChangeBookingListDurationFilter = (view) => {
    this.setState({ bookingListCalenderView: view }, () => {
      this.getListViewTraderCustomersOfBookedClasses();
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
        this.getCalendarViewTraderCustomersOfBookedClasses();
      }
    );
  };

  renderClassTimeFields = (vendorClassSchedule) => {
    //
    if (
      vendorClassSchedule.vendor_class_schedule &&
      vendorClassSchedule.vendor_class_schedule.length > 0
    ) {
      let startTime =
        vendorClassSchedule.vendor_class_schedule[0]["start_time"];
      let endTime = vendorClassSchedule.vendor_class_schedule[0]["end_time"];
      return (
        <Select
          defaultValue={
            moment(startTime, "HH:mm:ss").format("hh:mm A") -
            moment(endTime, "HH:mm:ss").format("hh:mm A")
          }
        >
          {vendorClassSchedule.vendor_class_schedule.map((value, idx) => {
            return (
              <Option
                value={
                  moment(value.start_time, "HH:mm:ss").format("hh:mm A") -
                  moment(value.end_time, "HH:mm:ss").format("hh:mm A")
                }
              >
                {moment(value.start_time, "HH:mm:ss").format("hh:mm A")} -{" "}
                {moment(value.end_time, "HH:mm:ss").format("hh:mm A")}
              </Option>
            );
          })}
        </Select>
      );
    }
  };

  renderBookedClassItem = () => {
    const { customersBookedClassesList } = this.state;
    if (customersBookedClassesList && customersBookedClassesList.length > 0) {
      return (
        <Fragment>
          {customersBookedClassesList.map((value, i) => {
            return (
              <tr key={`${i}_booking_class_item`}>
                <td>
                  {moment(value.start_date, "DD-MM-YYYY").format("DD MMM")}
                </td>
                <td>{value.class_name}</td>
                <td>{value.room}</td>
                <td>{value.instructor_name}</td>
                <td>
                  {value.customer_class_bookings_filtered !== null
                    ? `${value.customer_class_bookings_filtered.length}/${value.capacity}`
                    : ""}
                </td>
                <td>{value.class_time ? `${value.class_time} mins` : "-"}</td>
                <td> {this.renderClassTimeFields(value)}</td>
              </tr>
            );
          })}
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

  renderSelectedDate = () => {
    const {
      listingView,
      bookingListCalenderView,
      monthStart,
      monthEnd,
      weekStart,
      weekEnd,
      selectedBookingDate,
    } = this.state;
    if (listingView == "list") {
      if (bookingListCalenderView === "week") {
        return `Your class from ${moment(weekStart).format(
          "ddd, MMM Do"
        )} - ${moment(weekEnd).format("ddd, MMM Do YYYY")}`;
      } else if (bookingListCalenderView === "month") {
        return `Your class from  ${moment(monthStart).format(
          "ddd, MMM Do"
        )} - ${moment(monthEnd).format("ddd, MMM Do YYYY")}`;
      } else if (bookingListCalenderView === "today") {
        return `Your class on ${moment().format("ddd MMM Do YYYY")}`;
      }
    } else {
      return `Your class on ${moment(selectedBookingDate).format(
        "ddd MMM Do YYYY"
      )}`;
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

  /**
   * @method render
   * @description render component
   */
  render() {
    return (
      <Layout className="event-booking-profile-wrap fm-fitness-vendor-wrap">
        <Layout>
          <AppSidebar activeTabKey={DASHBOARD_KEYS.FITNESS} history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section manager-page">
                  <div className="left">
                    <Title level={2}>Calendar</Title>
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
                        title="My Classes"
                      >
                        <div className="fm-vcalender-wrap">
                          <Row className="fm-top-title" align="middle">
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                              <h5> {this.renderSelectedDate()}</h5>
                            </Col>
                            <Col
                              xs={24}
                              sm={24}
                              md={24}
                              lg={12}
                              xl={12}
                              align="right"
                            >
                              <div className="fm-list-icons">
                                <span
                                  onClick={() => this.onViewChange("calender")}
                                  className={
                                    this.state.listingView === "calender"
                                      ? "fm-cl-icon-active"
                                      : "fm-cl-icon"
                                  }
                                >
                                  <img
                                    src={require("../../../../../assets/images/icons/calendar-icon.svg")}
                                    alt="Calendar"
                                  />
                                </span>
                                <span
                                  onClick={() => this.onViewChange("list")}
                                  className={
                                    this.state.listingView === "list"
                                      ? "fm-list-icon-active"
                                      : "fm-list-icon"
                                  }
                                >
                                  <img
                                    src={require("../../../../../assets/images/icons/list-icon.svg")}
                                    alt="List"
                                  />
                                </span>
                              </div>
                            </Col>
                          </Row>
                          <div className="my-new-order-block">
                            <Row gutter={0}>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="fr-tbl-fit-wrap">
                                  <table className="fr-fitness-tbl">
                                    <tr>
                                      <th>Date</th>
                                      <th>Class</th>
                                      <th>Room</th>
                                      <th>Instructor</th>
                                      <th>Capacity</th>
                                      <th>Duration</th>
                                      <th>Time</th>
                                    </tr>
                                    {this.renderBookedClassItem()}
                                  </table>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                        {this.state.listingView == "list" && (
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              defaultValue="Weekly"
                              onChange={(e) =>
                                this.onChangeBookingListDurationFilter(e)
                              }
                            >
                              <Option value="week">Weekly</Option>
                              <Option value="month">Monthly</Option>
                              <Option value="today">Today</Option>
                            </Select>
                          </div>
                        )}
                      </Card>
                    </Col>
                    {this.state.listingView == "calender" && (
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
                          {this.state.calenderView === "week" ? (
                            this.renderCalender()
                          ) : (
                            <Calendar
                              onSelect={this.onChangeBookingDates}
                              fullscreen={false}
                              dateCellRender={this.dateCellRender}
                            />
                          )}
                        </div>
                      </Col>
                    )}
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
  enableLoading,
  disableLoading,
  listTraderCustomersOfBookedClasses,
  getTraderMonthFitnessBooking,
})(FitnessVenderMyCalendar);
