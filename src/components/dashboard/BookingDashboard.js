import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Layout,
  Calendar,
  Card,
  Typography,
  Button,
  Table,
  Avatar,
  Row,
  Col,
  Input,
  Select,
  Progress,
} from "antd";
import AppSidebar from "../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../common/History";
import PostAdPermission from "../classified-templates/PostAdPermission";
import {
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
} from "../../actions";
import {
  convertISOToUtcDateformate,
  dateFormate,
  displayDateTimeFormate,
} from "../common";
import { Pie, yuan } from "ant-design-pro/lib/Charts";
import "ant-design-pro/dist/ant-design-pro.css";
import { DEFAULT_IMAGE_TYPE, DASHBOARD_TYPES } from "../../config/Config";
import { langs } from "../../config/localization";
import { DASHBOARD_KEYS } from "../../config/Constant";
import {
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./calender.less";
import "./employer.less";
import "./addportfolio.less";
import moment from "moment";
import {
  displayCalenderDate,
  displayDate,
  dateFormate3,
  startTime,
} from "../common";

const { Option } = Select;
const { Title, Text } = Typography;
let today = Date.now();
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: moment(new Date()).format("YYYY-MM-DD"),
      index: "",
      calendarView: "week",
      monthStart: "",
      monthEnd: "",
      weekStart: "",
      weekEnd: "",
    };
  }

  componentDidMount() {
    const { userDetails, loggedInUser } = this.props;

    if (loggedInUser) {
      this.props.getTraderProfile({ user_id: loggedInUser.id });
      //   this.getDashBoardDetails()
    }

    function days(current) {
      var week = new Array();
      // Starting Monday not Sunday
      var first = current.getDate() - current.getDay() + 1;
      for (var i = 0; i < 7; i++) {
        week.push(new Date(current.setDate(first++)));
      }
      return week;
    }

    var input = new Date();
    let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
    let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0);

    let first = input.getDate() - input.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6
    let firstday = new Date(input.setDate(first)).toUTCString();

    let lastday = new Date(input.setDate(last)).toUTCString();

    this.setState({
      monthStart: moment(startOfMonth).format("YYYY-MM-DD"),
      monthEnd: moment(endOfMonth).format("YYYY-MM-DD"),
      weekStart: moment(firstday).format("YYYY-MM-DD"),
      weekEnd: moment(lastday).format("YYYY-MM-DD"),
    });

    var result = days(input);
    let date = result.map((d) => d.toString());
    this.setState({ dates: date });
  }

  /**
   * @method  get DashBoard Details
   * @description get classified
   */
  getDashBoardDetails = (selectedDate, flag) => {
    // this.props.enableLoading()
    const { loggedInUser } = this.props;
    const { monthEnd, monthStart, weekStart, weekEnd } = this.state;
    let reqData = {
      user_id: loggedInUser.id,
      page_size: 10,
      page: 1,
      dashboard_type:
        loggedInUser.role_slug === langs.key.real_estate
          ? DASHBOARD_TYPES.REAL_ESTATE
          : loggedInUser.role_slug === langs.key.job
          ? DASHBOARD_TYPES.JOB
          : DASHBOARD_TYPES.GENERAL,
      created_date: selectedDate,
      from_date:
        flag === "week" ? weekStart : flag === "month" ? monthStart : "", //This field used only when we need to pass date range, else this will be empty
      to_date: flag === "week" ? weekEnd : flag === "month" ? monthEnd : "", //This field used only when we need to pass date range,
    };
    this.props.getDashBoardDetails(reqData, (res) => {
      //   this.props.disableLoading()

      if (res.success && res.success.status == 1) {
        //
        this.setState({ dashboardDetails: res.success.data });
      }
    });
  };

  renderDates = (dates) => {
    const { selectedDate, index } = this.state;
    return dates.map((el, i) => {
      // let currentDate = displayDate(el) == displayDate(Date.now()) ? 'active' : ''
      let a = selectedDate;
      let b = moment(new Date(el)).format("YYYY-MM-DD");

      return (
        <li
          key={i}
          onClick={() => {
            this.setState({
              index: i,
              selectedDate: moment(new Date(el)).format("YYYY-MM-DD"),
            });
            this.getDashBoardDetails(moment(el).format("YYYY-MM-DD"), "");
          }}
          style={{ cursor: "pointer" }}
        >
          <span className={a == b ? "active" : ""}>{displayDate(el)}</span>
        </li>
      );
    });
  };

  renderCalender = () => {
    const { dates, selectedDate } = this.state;
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span>
                {displayCalenderDate(selectedDate ? selectedDate : Date.now())}
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

  /**
   * @method render
   * @description render component
   */
  render() {
    const { calendarView } = this.state;
    const { loggedInUser } = this.props;

    return (
      <Layout>
        <Layout>
          <AppSidebar
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
            history={history}
          />
          <Layout>
            <div className="my-profile-box employee-dashborad-box booking-beauty-employee-dashborad-box-v2">
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
                                    langs.userType.events
                                  ) {
                                    window.location.assign(
                                      "/events-my-bookings"
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
                              onChange={(e) => {
                                const { selectedDate, flag } = this.state;
                                this.getDashBoardDetails(
                                  selectedDate,
                                  flag,
                                  1,
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {/* <div className="top-head-section manager-page">
                    <div className="left">
                      <Title level={2}>My Dashboard</Title>
                    </div>
                    <div className="right">
                      <Button
                        onClick={() => {
                          //Implment Conditions for Mybookings page
                          if (loggedInUser.user_type === langs.key.handyman) {
                            window.location.assign("/handyman-my-bookings");
                          } else if (
                            loggedInUser.user_type === langs.userType.fitness
                          ) {
                            window.location.assign("/fitness-my-bookings");
                          } else if (
                            loggedInUser.user_type === langs.userType.events
                          ) {
                            window.location.assign("/events-my-bookings");
                          } else if (
                            loggedInUser.user_type === langs.userType.wellbeing
                          ) {
                            window.location.assign("/spa-my-bookings");
                          } else if (
                            loggedInUser.user_type === langs.userType.beauty
                          ) {
                            window.location.assign("/beauty-my-bookings");
                          }
                        }}
                        className="orange-btn"
                      >
                        My Bookings
                      </Button>
                    </div>
                  </div> */}
                  {/* <div className="employsearch-block">
                    <div className="employsearch-right-pad">
                      <Row gutter={30}>
                        <Col xs={24} md={16} lg={16} xl={14}>
                          <div className="search-block">
                            <Input
                              placeholder="Search Dashboard arpit"
                              prefix={
                                <SearchOutlined className="site-form-item-icon" />
                              }
                            />
                          </div>
                        </Col>
                        <Col
                          xs={24}
                          md={8}
                          lg={8}
                          xl={10}
                          className="employer-right-block "
                        >
                          <div className="right-view-text">
                            <span>234 Views</span>
                            <span className="sep">|</span>
                            <span>7 Ads</span>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div> */}
                  <Row gutter={30}>
                    <Col xs={24} md={16} lg={16} xl={14}>
                      <Card
                        className="dashboard-left-calnder-block"
                        title="Latest Activity"
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              onChange={(e) =>
                                this.setState({ calendarView: e })
                              }
                              defaultValue="This week"
                              dropdownMatchSelectWidth={false}
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
                              <Calendar
                              // onSelect={(e) => {
                              //
                              //   this.setState({ selectedDate: moment(new Date(e)).format('YYYY-MM-DD') })
                              //   this.getDashBoardDetails(moment(e).format('YYYY-MM-DD'), '')
                              // }}
                              />
                            )}
                          </Col>
                          {/* <Table dataSource={dashboardDetails.job_user_listing} columns={columnType} /> */}
                        </Row>
                      </Card>
                    </Col>
                    <Col
                      xs={24}
                      md={8}
                      lg={8}
                      xl={10}
                      className="employer-right-block "
                    >
                      <Calendar />
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
  getDashBoardDetails,
  getTraderProfile,
})(Dashboard);
