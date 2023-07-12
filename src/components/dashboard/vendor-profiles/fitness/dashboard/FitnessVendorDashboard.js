import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  Layout,
  Calendar,
  Card,
  Typography,
  Button,
  Row,
  Col,
  Input,
  Select,
  Alert,
  Divider,
  Badge,
} from "antd";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import {
  enableLoading,
  disableLoading,
  vendorProfileFitnessDashboard,
  getTraderMonthFitnessBooking,
} from "../../../../../actions";
import {
  displayCalenderDate,
  displayDate,
  convertTime24To12Hour,
} from "../../../../common/";
import { DASHBOARD_KEYS } from "../../../../../config/Constant";
import "../../../calender.less";
import "../../../employer.less";
import "../../../addportfolio.less";
import "./mybooking.less";
import "./profile-vendor-restaurant.less";
import { timestampToString } from "../../../../../config/Helper";

const { Option } = Select;
const { Title, Text } = Typography;

class FitnessVendorDashboard extends React.Component {
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
      dates: [],
      index: "",
      calendarView: "week",
      monthStart: moment(startOfMonth).format("YYYY-MM-DD"),
      monthEnd: moment(endOfMonth).format("YYYY-MM-DD"),
      weekStart: moment(firstday).format("YYYY-MM-DD"),
      weekEnd: moment(lastday).format("YYYY-MM-DD"),
      selectedDateForClassBooking: new Date(),
      myCalenderView: "month",
      selectedMyBookingsCalenderDate: new Date(),
      selectedDateClassList: [],
      totalRecords: 0,
      vendorCalenderBookingList: [],
      vendorAllDayCalenderBookingList: [],
    };
  }

  componentDidMount() {
    this.getFitnessVendorClassForSelectedDate(
      this.state.selectedDateForClassBooking
    );
    this.getBookingsForCalenderDate(this.state.selectedMyBookingsCalenderDate);
    this.createWeekCalender();
  }

  getFitnessVendorClassForSelectedDate = (date) => {
    const classDate = moment(date).format("YYYY-MM-DD");
    this.setState(
      {
        selectedDateForClassBooking: classDate,
      },
      () => {
        if (classDate) {
          this.props.enableLoading();
          const { id } = this.props.loggedInUser;
          const req = {
            user_id: id,
            from_date: classDate,
            to_date: classDate,
            // user_id: 315,
            // from_date: "2019-01-01",
            // to_date: "2020-12-31",
            search_keyword: "",
          };
          this.props.vendorProfileFitnessDashboard(req, (response) => {
            this.props.disableLoading();
            if (response.status === 200) {
              this.setState({
                selectedDateClassList: response.data.data.latest_activity,
                totalRecords: response.data.data.total_records,
              });
            }
          });
        }
      }
    );
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
      dates: newWeekDatesArray,
    });
  };

  renderDates = (dates) => {
    const { selectedDateForClassBooking, index } = this.state;
    return dates.map((el, i) => {
      let a = selectedDateForClassBooking;
      let b = moment(new Date(el)).format("YYYY-MM-DD");
      return (
        <li
          key={`${i}_weekly_date`}
          onClick={() => {
            this.setState({
              index: i,
              selectedDateForClassBooking: moment(new Date(el)).format(
                "YYYY-MM-DD"
              ),
            });
            this.getFitnessVendorClassForSelectedDate(el);
          }}
          style={{ cursor: "pointer" }}
        >
          <span className={a == b ? "active" : ""}>{displayDate(el)}</span>
        </li>
      );
    });
  };

  renderCalender = () => {
    const { dates, selectedDateForClassBooking } = this.state;
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span>
                {displayCalenderDate(
                  selectedDateForClassBooking
                    ? selectedDateForClassBooking
                    : Date.now()
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
        <ul className="days">{dates.length && this.renderDates(dates)}</ul>
      </div>
    );
  };

  onChangeBookingDates = (value) => {
    this.getFitnessVendorClassForSelectedDate(value);
  };

  onChangeBookingListingCalenderView = (view) => {
    this.setState(
      {
        calendarView: view,
        selectedDateForClassBooking: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.createWeekCalender();
        }
        this.getFitnessVendorClassForSelectedDate(new Date());
      }
    );
  };

  renderClassBookings = () => {
    if (
      this.state.selectedDateClassList &&
      this.state.selectedDateClassList.length > 0
    ) {
      return (
        <Fragment>
          {this.state.selectedDateClassList.map((value, i) => {
            return (
              <div className="my-new-order-block">
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <div className="odr-no">
                      <h4>Booked Class</h4>
                      <span className="pickup">{value.title}</span>
                    </div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img
                          alt="test"
                          src={
                            value.customer_image
                              ? value.customer_image
                              : require("../../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name fvd-profile-name">
                        {value.customer_name}
                        <div className="fvd-date">
                          {moment(value.start_date, "dd,DD MMM").format(
                            "DD MMM"
                          )}{" "}
                          {value.booking_time
                            ? `, ${moment(
                                value.booking_time,
                                "hh:mm:ss"
                              ).format("LT")}`
                            : ""}
                        </div>
                      </div>

                      <div className="profile-name ">
                        {value.description}
                        <div className="fvd-date">
                          {value.instructor_name}{" "}
                          {value.room ? `/${value.room}` : ""}
                        </div>
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
                    <div className="hour">
                      {" "}
                      {timestampToString(
                        value.booking_date,
                        value.booking_time,
                        true
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
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

  renderWeeklyDates = (dates) => {
    const { selectedMyBookingsCalenderDate, index } = this.state;
    return dates.map((el, i) => {
      let a = selectedMyBookingsCalenderDate;
      let b = moment(new Date(el)).format("YYYY-MM-DD");
      return (
        <li
          key={`${i}_weekly_date`}
          onClick={() => {
            this.setState({
              index: i,
              selectedMyBookingsCalenderDate: moment(new Date(el)).format(
                "YYYY-MM-DD"
              ),
            });
            this.getBookingsForCalenderDate(el);
          }}
          style={{ cursor: "pointer" }}
        >
          <span className={a == b ? "active" : ""}>{displayDate(el)}</span>
        </li>
      );
    });
  };

  renderWeeklyCalender = () => {
    const { dates, selectedMyBookingsCalenderDate } = this.state;
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span>
                {displayCalenderDate(
                  selectedMyBookingsCalenderDate
                    ? selectedMyBookingsCalenderDate
                    : Date.now()
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
          {dates.length && this.renderWeeklyDates(dates)}
        </ul>
      </div>
    );
  };

  onChangeMyBookingCalenderView = (view) => {
    this.setState(
      {
        myCalenderView: view,
        selectedMyBookingsCalenderDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.createWeekCalender();
        }
        this.getBookingsForCalenderDate(new Date());
      }
    );
  };

  onChangeMyBookingCalenderDates = (value) => {
    this.getBookingsForCalenderDate(value);
  };

  getBookingsForCalenderDate = (date) => {
    const { id } = this.props.loggedInUser;
    const selectedDate = moment(date).format("YYYY-MM-DD");
    this.setState(
      {
        selectedMyBookingsCalenderDate: selectedDate,
      },
      () => {
        if (selectedDate) {
          const req = {
            user_id: id,
            date: selectedDate,
          };
          this.props.getTraderMonthFitnessBooking(
            req,
            this.getVendorFitnessMonthBookingsCalenderCallback
          );
        }
      }
    );
  };

  getVendorFitnessMonthBookingsCalenderCallback = (response) => {
    if (response.status === 200 && response.data) {
      let bookingData = this.getCalenderBookingDataFilter(
        response.data.class_bookings,
        this.state.selectedMyBookingsCalenderDate,
        response.data.month_slots
      );

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
                <div className="appointments-label">{value.customer.name}</div>
                <div className="appointments-time">
                  {convertTime24To12Hour(value.booking_time)}
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

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      calendarView,
      myCalenderView,
      totalRecords,
      selectedMyBookingsCalenderDate,
      vendorCalenderBookingList,
    } = this.state;

    return (
      <Layout className="event-booking-profile-wrap fm-restaurant-vendor-wrap ">
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box restaurant-vendor-dashboard-parent-block profile-fitness-vendor-dashbord"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="profile-content-box">
                  <Row gutter={0}>
                    <Col xs={24} md={24} lg={24} xl={24}>
                      <div className="heading-search-block">
                        <div className="header-serch-tab-block">
                          <div className="heading-text active-tab">
                            <Button className="orange-btn">My Dashboard</Button>
                          </div>
                          <div className="right btn-right-block ">
                            <Button
                              onClick={() =>
                                window.location.assign("/fitness-my-bookings")
                              }
                              className="orange-btn"
                            >
                              My Bookings
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search Dashboard"
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                            onChange={(e) => {}}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div> */}
                <div className="search-block">
                  <Input
                    placeholder="Search Dashboard"
                    prefix={<SearchOutlined className="site-form-item-icon" />}
                    onChange={this.handleBookingPageChange}
                  />
                </div>

                <div className="pf-vend-restau-myodr profile-content-box pf-vend-spa-booking box-shdw-none">
                  <Row gutter={30}>
                    <Col
                      xs={24}
                      md={16}
                      lg={16}
                      xl={14}
                      className="employer-left-block"
                    >
                      <Card
                        className="dashboard-left-calnder-block"
                        title="Latest Activity"
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              onChange={(e) => {
                                this.onChangeBookingListingCalenderView(e);
                              }}
                              defaultValue="This week"
                            >
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                              {/* <Option value="This year">This year</Option> */}
                            </Select>
                          </div>
                        }
                      >
                        <Row>
                          <Col className="gutter-row" md={24}>
                            {calendarView === "week" ? (
                              this.renderCalender()
                            ) : (
                              <Calendar onSelect={this.onChangeBookingDates} />
                            )}
                          </Col>
                        </Row>
                        <Divider className="m-0" />
                        <div className="restaurant-vendor-dashboard-order-listing">
                          <div className="notify-blue-text">
                            You have {totalRecords} books on this day
                          </div>
                          <div className="pf-vend-restau-myodr shadow-none pf-vend-spa-booking">
                            <Card
                              className="profile-content-shadow-box"
                              bordered={false}
                              title=""
                            >
                              {this.renderClassBookings()}
                            </Card>
                          </div>
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
                                this.onChangeMyBookingCalenderView(e);
                              }}
                              defaultValue="Monthly"
                            >
                              <Option value="week">Weekly</Option>
                              <Option value="month">Monthly</Option>
                            </Select>
                          </div>
                        </div>
                        {myCalenderView === "week" ? (
                          this.renderWeeklyCalender()
                        ) : (
                          <Calendar
                            onSelect={this.onChangeMyBookingCalenderDates}
                            fullscreen={false}
                            dateCellRender={this.dateCellRender}
                          />
                        )}
                      </div>
                      <div className="appointments-slot mt-20">
                        <div className="appointments-heading">
                          <div className="date">
                            {moment(selectedMyBookingsCalenderDate).format(
                              "MMM D YYYY"
                            )}
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
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  vendorProfileFitnessDashboard,
  getTraderMonthFitnessBooking,
})(FitnessVendorDashboard);
