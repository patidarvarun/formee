import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Pagination,
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
import Icon from "../../components/customIcons/customIcons";
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
  salaryNumberFormate,
} from "../common";
import { Pie, yuan } from "ant-design-pro/lib/Charts";
import "ant-design-pro/dist/ant-design-pro.css";
import {
  JOB_APPICANT_STATUS,
  DEFAULT_IMAGE_TYPE,
  DASHBOARD_TYPES,
} from "../../config/Config";
import { langs } from "../../config/localization";
import { DASHBOARD_KEYS } from "../../config/Constant";
import StylingCalendar from "./Common-Calendar";
import {
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
// import './calender.less'
// import './employer.less'
// import './addportfolio.less'
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

//get week days
function days() {
  var current = new Date();

  var week = new Array();
  // Starting Monday not Sunday
  var first = current.getDate() - current.getDay();

  let mon = new Date(current.setDate(first + 1))
  week.push(mon)
  let tue = new Date(current.setDate(first + 2))
  week.push(tue)
  let wed = new Date(current.setDate(first + 3))
  week.push(wed)
  let thurs = new Date(current.setDate(first + 4))
  week.push(thurs)
  let fri = new Date(current.setDate(first + 5))
  week.push(fri)
  let sat = new Date(current.setDate(first + 6))
  week.push(sat)
  let sun = new Date(current.setDate(first + 7))
  week.push(sun)

  // for (var i = 0; i < 7; i++) {
  //   week.push(new Date(current.setDate(first++)));
  // }
  console.log('week: ', week);

  return week;

}

function getStartEndDate() {
  var input = new Date();
  let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
  let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0);
  let first = input.getDate() - input.getDay(); // First day is the day of the month - the day of the week
  let last = first + 6; // last day is the first day + 6
  let firstday = new Date(input.setDate(first)).toUTCString();
  let lastday = new Date(input.setDate(last)).toUTCString();
  console.log(lastday, 'firstday: ', firstday);
  return {
    monthStart: moment(startOfMonth).format("YYYY-MM-DD"),
    monthEnd: moment(endOfMonth).format("YYYY-MM-DD"),
    weekStart: moment(firstday).format("YYYY-MM-DD"),
    weekEnd: moment(lastday).format("YYYY-MM-DD"),
    activityFilter: { start: moment(firstday).format("YYYY-MM-DD"), end: moment(lastday).format("YYYY-MM-DD") },
    graphFilter: { start: moment(firstday).format("YYYY-MM-DD"), end: moment(lastday).format("YYYY-MM-DD") },
  }
}

class ClassifiedsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: moment(today).format("YYYY-MM-DD"),
      index: "",
      calendarView: "week",
      monthStart: "",
      monthEnd: "",
      weekStart: "",
      weekEnd: "",
      flag: 'week',
      selectedMode: "month",
      page: 1,
      activityFilter: {
        start: '',
        end: ''
      },
      graphFilter: {
        start: '',
        end: ''
      }
    };
  }

  componentDidMount() {
    const { loggedInUser } = this.props;
    const {  activityFilter, graphFilter } = this.state;
    var input = new Date();

    var result = days();
    let date = result.map((d) => d.toString());
    this.setState({ dates: date, ...getStartEndDate(input) }, () => {
      console.log('activityFilter: ', activityFilter);
      if (loggedInUser) {
        this.props.getTraderProfile({ user_id: loggedInUser.id });
        this.getDashBoardDetailsByCalendarView(
          graphFilter.start,
          graphFilter.end,
          '',
          1,
          '',
          activityFilter.start,
          activityFilter.end
        );
      }
    });
  }


  /**
   * @method  get DashBoard Details used By calendar view
   * @description get detail
   */
  getDashBoardDetailsByCalendarView = (
    start,
    end,
    flag,
    page,
    search_keyword,
    start_act,
    end_act,
    mode
  ) => {
    // this.setState({ selectedDate: selectedDate, flag: flag, page: page })
    const { loggedInUser } = this.props;
    const { activityFilter, graphFilter } = this.state;
    //console.log(graphFilter, 'activity: $$$', activityFilter);
    console.log('start_act: ', start_act);
    let reqData = {
      user_id: loggedInUser.id,
      dashboard_type:
        loggedInUser.role_slug === langs.key.real_estate
          ? DASHBOARD_TYPES.REAL_ESTATE
          : loggedInUser.role_slug === langs.key.job
            ? DASHBOARD_TYPES.JOB
            : DASHBOARD_TYPES.GENERAL,
      created_date: mode === 'date' ? start_act : '',
      from_date: start ? start : graphFilter.start, //This field used only when we need to pass date range, else this will be empty
      to_date: end ? end : graphFilter.end, //This field used only when we need to pass date range,
      // search_keyword: search_keyword,
      // activity_from_date: start_act ? start_act : '',
      // activity_to_date: end_act ? end_act : ''
      activity_from_date: mode === 'date' ? '' : start_act ? start_act : activityFilter.start,
      activity_to_date: mode === 'date' ? '' : end_act ? end_act : activityFilter.end,
    };
    console.log('reqData: $$$ ', reqData);
    this.props.getDashBoardDetails(reqData, (res) => {
      this.props.disableLoading();

      if (res.success && res.success.status == 1) {
        this.setState({
          dashboardDetails: res.success.data,
          flag: flag,
          activityFilter: (start_act && end_act) ? { start: start_act, end: end_act } : activityFilter,
          graphFilter: (start && end) ? { start, end } : graphFilter,

        });
      }
    });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { selectedDate, flag, graphFilter, activityFilter } = this.state;
    this.getDashBoardDetailsByCalendarView(
      graphFilter.start,
      graphFilter.end,
      '',
      1,
      '',
      selectedDate,
      '',
      'date'
    );
  };

  renderDates = (dates) => {
    const { selectedDate, index, activityFilter, graphFilter } = this.state;
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
            this.getDashBoardDetailsByCalendarView(
              graphFilter.start,
              graphFilter.end,
              '',
              1,
              '',
              moment(new Date(el)).format("YYYY-MM-DD"),
              '',
              'date'
            );
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
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className="days">{dates.length && this.renderDates(dates)}</ul>
      </div>
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

  renderCards = (text1, text2, text3, text4, item1, item2, item3, item4) => {
    return (
      <Row gutter={[10, 21]} className="pt-21">
        <Col md={12}>
          <div
            className={
              item1 !== undefined && item1
                ? "dark-orange color-box"
                : " color-box color-box-gray"
            }
          >
            <Title level="3">{item1 !== undefined && item1 ? item1 : 0}</Title>
            <Text>{text1}</Text>
          </div>
        </Col>
        <Col md={12} className="">
          <div
            className={
              item2 !== undefined && item2
                ? "light-orange color-box"
                : " color-box color-box-gray"
            }
          >
            <Title level="3">{item2 !== undefined && item2 ? item2 : 0}</Title>
            <small> {text2}</small>
          </div>
        </Col>
        <Col md={12} className="">
          <div
            className={
              item3 !== undefined && item3
                ? "light-yellow color-box"
                : " color-box color-box-gray"
            }
          >
            <Title level="3">{item3 !== undefined && item3 ? item3 : 0}</Title>
            <small> {text3} </small>
          </div>
        </Col>
        <Col md={12} className="">
          <div
            className={
              item4 !== undefined && item4
                ? "dark-yellow color-box"
                : " color-box color-box-gray"
            }
          >
            <Title level="3">{item4 !== undefined && item4 ? item4 : 0}</Title>
            <small> {text4} </small>
          </div>
        </Col>
      </Row>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedDate,
      flag,
      dashboardDetails,
      selectedMode,
      calendarView,
      monthStart,
      weekEnd,
      weekStart,
      monthEnd,
      activityFilter,
      graphFilter
    } = this.state;
    const { loggedInUser } = this.props;
    let label1 = 0,
      label2 = 0,
      label3 = 0,
      title1 = "",
      title2 = "",
      title3 = "",
      total = 0;
    if (dashboardDetails) {
      if (loggedInUser.role_slug === langs.key.job) {
        label1 = dashboardDetails.job_view_count;
        label2 = dashboardDetails.job_apply_count;
        label3 = dashboardDetails.job_interview_count;
        title1 = "Views";
        title2 = "Application";
        title3 = "Interviews";
        total = dashboardDetails.job_total_count;
      } else if (
        loggedInUser.role_slug === langs.key.real_estate ||
        loggedInUser.role_slug === langs.key.car_dealer
      ) {
        label1 = dashboardDetails.total_view_count;
        label2 = dashboardDetails.ads_reachout_count;
        label3 = dashboardDetails.ads_sold_count;
        title1 = "Views";
        title2 = "Reach outs";
        title3 = "Sold";
        total = dashboardDetails.ads_total_count;
      }
    }
    const columns = [
      {
        title: "",
        dataIndex: "name",
        key: "name",
        render: (cell, row, index) => {
          return (
            <div className="user-icon mr-16 d-flex">
              <Avatar
                src={row.image !== undefined ? row.image : DEFAULT_IMAGE_TYPE}
              />
              <span>{row.name}</span>
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "",
        dataIndex: "application_status",
        key: "application_status",
        render: (cell, row, index) => {
          return (
            <div>
              {/* <Button default type="primary">
                <span className="dot-color"></span>
                {row.application_status ? row.application_status : "Pending"}
              </Button> */}
              {row.application_status === JOB_APPICANT_STATUS.INTERVIEW ? (
                <Button
                  default
                  type="primary"
                  className="btn-status btn-green "
                >
                  <span className="dot-color"></span>
                  {JOB_APPICANT_STATUS.INTERVIEW}
                </Button>
              ) : row.application_status === JOB_APPICANT_STATUS.REJECT ? (
                <Button default type="primary" className="danger-red-btn">
                  <span className="dot-color"></span>
                  {"Un Processed"}
                </Button>
              ) : row.application_status === JOB_APPICANT_STATUS.SPAM ? (
                <Button
                  type="primary"
                  className="ant-btn applicationbtn violet-btn"
                >
                  <span className="dot-color"></span>
                  {"Not Suitable"}
                </Button>
              ) : row.application_status === JOB_APPICANT_STATUS.SHORTLIST ? (
                <Button default type="primary" className="pending-yellow-btn ">
                  <span className="dot-color"></span>
                  {JOB_APPICANT_STATUS.SHORTLIST}
                </Button>
              ) : (
                <Button
                  default
                  type="primary"
                  className=" ant-btn applicationbtn violet-btn"
                >
                  <span className="dot-color"></span>
                  {"New"}
                </Button>
              )}
              <Text>{displayDateTimeFormate(row.created_at)}</Text>
            </div>
          );
        },
      },
    ];

    const real_state = [
      {
        title: "",
        dataIndex: "name",
        key: "name",
        render: (cell, row, index) => {
          return (
            <div>
              {row.is_atended === 1 ? (
                <div className="user-icon mr-13 realstate-table">
                  <ClockCircleOutlined className="pr-15" width="1.25em" />
                  {dateFormate3(row.created_at)}
                </div>
              ) : (
                <div className="user-icon mr-13 realstate-table">
                  <Avatar
                    src={
                      row.image !== undefined ? row.image : DEFAULT_IMAGE_TYPE
                    }
                  />
                  <span>{row.name}</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "location",
        key: "location",
        render: (cell, row, index) => {
          return (
            <div className="realstate-location">
              <Text className="location">{row.location}</Text>
              <Text className="location-sub-title">{row.title}</Text>
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "application_status",
        // key: 'application_status'
        render: (cell, row, index) => {
          return (
            <div>
              {row.is_atended === 0 ? (
                <Button
                  className={row.is_atended === 0 ? "applicationbtn" : ""}
                  onClick={(e) => this.changeStatus(0, cell)}
                  type="primary"
                >
                  <span className="dot-color"></span> {" Application"}
                </Button>
              ) : (
                <Button
                  onClick={(e) => this.changeStatus(0, cell)}
                  type="primary"
                >
                  <span className="dot-color"></span> {"Inspection"}
                </Button>
              )}
              {row.is_atended === 0 && (
                <div style={{ fontSize: 9, color: "#90A0B7" }} className="mt-5">
                  {startTime(row.created_at)}
                </div>
              )}
            </div>
          );
        },
      },
    ];
    const generalUsercolumns = [
      {
        title: "",
        dataIndex: "name",
        // key: 'name'
        render: (cell, row, index) => {
          return (
            <div className="user-icon mr-13 d-flex generalvendor-table">
              <Avatar
                src={row.image !== undefined ? row.image : DEFAULT_IMAGE_TYPE}
              />
              <span>{dateFormate(row.created_at)}</span>
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "title",
        // key: 'title'
        render: (cell, row, index) => {
          return (
            <div className="generalvendor-location">
              <Text className="location-detail">{row.location}</Text>
              {/* Make it dynamic*/}
              <div className="price">{`AU$${salaryNumberFormate(
                row.price
              )}`}</div>
              <div className="mb-10">
                <div>
                  <Text>{row.title}</Text>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "application_status",
        render: (cell, row, index) => {
          return (
            <div>
              {row.status === "Accepted" ? (
                <Button default type="primary" className="btn-status btn-green">
                  <span className="dot-color"></span>
                  Accepted
                </Button>
              ) : row.status === "Rejected" ? (
                <Button default type="primary" className="danger-red-btn">
                  <span className="dot-color"></span>
                  Cancelled
                </Button>
              ) : (
                <Button
                  default
                  type="primary"
                  className=" ant-btn applicationbtn violet-btn"
                >
                  <span className="dot-color"></span>
                  Offer Sent
                </Button>
              )}
              <Text style={{ marginTop: "21px", display: "block" }}>
                {displayDateTimeFormate(row.created_at)}
              </Text>
            </div>
          );
        },
      },
    ];
    const config = {
      forceFit: false,
      title: {
        visible: true,
        text: "Ring chart-indicator card",
      },
      description: {
        visible: false,
        text:
          "The ring chart indicator card can replace tooltip\uFF0C to display detailed information of each category in the hollowed-out part of the ring chart\u3002",
      },
      radius: 0.1,
      padding: "auto",
      // data: salesPieData,
      angleField: "value",
      colorField: "type",
      statistic: { visible: true },
    };

    const pieDataChart = [
      {
        x: "View",
        // y: 10
        y:
          loggedInUser.role_slug === langs.key.job
            ? Number(dashboardDetails.job_view_count)
            : loggedInUser.role_slug === langs.key.real_estate
              ? Number(dashboardDetails.total_view_count)
              : Number(dashboardDetails.total_view_count),
      },
      {
        x:
          loggedInUser.role_slug === langs.key.real_estate
            ? "Reachouts"
            : "Applications",
        // y: 40
        y:
          loggedInUser.role_slug === langs.key.job
            ? Number(dashboardDetails.job_apply_count)
            : loggedInUser.role_slug === langs.key.real_estate
              ? Number(dashboardDetails.ads_reachout_count)
              : Number(dashboardDetails.ads_reachout_count),
        // y: dashboardDetails.job_apply_count,
      },
      {
        x:
          loggedInUser.role_slug === langs.key.real_estate
            ? "Sold"
            : "Interviews",
        // y: 30
        y:
          loggedInUser.role_slug === langs.key.job
            ? Number(dashboardDetails.job_interview_count)
            : loggedInUser.role_slug === langs.key.real_estate
              ? Number(dashboardDetails.ads_sold_count)
              : Number(dashboardDetails.ads_sold_count),
        // y: dashboardDetails.job_interview_count,
      },
    ];

    let columnType =
      loggedInUser.role_slug === langs.key.real_estate
        ? real_state
        : loggedInUser.role_slug === langs.key.car_dealer
          ? generalUsercolumns
          : columns;

    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box dasbaord-only employee-dashborad-box-v2"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                {/*
                *****Comment by UI memeber RY because of two heading view, at 03-06-2021****
                 <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>My Dashboard </Title>
                  </div>
                  <div className="right">
                    <div className="right-content"></div>
                  </div>
                </div>
                *****Comment by UI memeber RY because of two heading view, at 03-06-2021****
                */}
                <div className="profile-content-box">
                  <div className="heading-search-block">
                    <div className="">
                      <Row gutter={0}>
                        <Col xs={24} md={20} lg={20} xl={20}>
                          <h1>
                            <span>My Dashboard</span>
                          </h1>
                          {/*
                          Removed as per Ammar comment on skype
                          <div className="search-block">
                            <Input
                              placeholder="Search Dashboard"
                              prefix={
                                <SearchOutlined className="site-form-item-icon" />
                              }
                              onChange={(e) => {
                                this.getDashBoardDetails(
                                  selectedDate,
                                  flag,
                                  1,
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                       */}
                        </Col>
                        <Col xs={24} md={4} lg={4} xl={4}>
                          <PostAdPermission
                            title={
                              loggedInUser.role_slug === "job"
                                ? "Post a Job"
                                : "Post an Ad"
                            }
                          />
                          {/* <div className="right-view-text">
                          <span>{label1} Views</span><span className="sep">|</span><span>{total} Ads</span>
                        </div> */}
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <Row gutter={30}>
                    <Col xs={24} md={16} lg={16} xl={14}>
                      <Card
                        className="dashboard-left-calnder-block"
                        title="Latest Activity"
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              dropdownMatchSelectWidth={false}
                              onChange={(e) => {
                                this.setState({
                                  calendarView: e,
                                  selectedDate: moment(today).format(
                                    "YYYY-MM-DD"
                                  ),
                                });
                                if (e === "week") {
                                  let startDate = moment(today)
                                    .startOf("week")
                                    .format("YYYY-MM-DD");
                                  let endDate = moment(today)
                                    .endOf("week")
                                    .format("YYYY-MM-DD");
                                  this.getDashBoardDetailsByCalendarView(
                                    startDate,
                                    endDate,
                                    '',
                                    1,
                                    '',
                                    startDate,
                                    endDate
                                  );
                                } else if (e === "month") {
                                  let startDate = moment(today)
                                    .startOf("month")
                                    .format("YYYY-MM-DD");
                                  let endDate = moment(today)
                                    .endOf("month")
                                    .format("YYYY-MM-DD");
                                  console.log(endDate, 'startDate: ', startDate);
                                  this.getDashBoardDetailsByCalendarView(
                                    '',
                                    '',
                                    '',
                                    1,
                                    '',
                                    startDate,
                                    endDate
                                  );
                                }
                              }}
                              defaultValue="This week"
                            >
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                              {/* <Option value="year">This year</Option> */}
                            </Select>
                          </div>
                        }
                      >
                        <Row>
                          <Col className="gutter-row" md={24}>
                            {calendarView === "week" ? (
                              this.renderCalender()
                            ) : (
                              <div className="common-year-calendar">
                                {dashboardDetails.job_user_listing_new &&
                                  <StylingCalendar
                                    events={dashboardDetails.job_user_listing_new.data}
                                    onPanelChange={(month, mode) => {
                                      if (mode === 'month') {
                                        let startDate = moment(month)
                                          .startOf("month")
                                          .format("YYYY-MM-DD");
                                        let endDate = moment(month)
                                          .endOf("month")
                                          .format("YYYY-MM-DD");
                                        console.log(endDate, 'startDate: ', startDate);
                                        this.getDashBoardDetailsByCalendarView(
                                          '',
                                          '',
                                          '',
                                          1,
                                          '',
                                          startDate,
                                          endDate
                                        );
                                      } else {
                                        let date = moment(month).format("YYYY-MM-DD");
                                        console.log('slectedDate: ', date);
                                        this.getDashBoardDetailsByCalendarView(
                                          '',
                                          '',
                                          '',
                                          1,
                                          '',
                                          date,
                                          '',
                                          'date'
                                        );
                                      }
                                    }}
                                  />}
                              </div>
                            )}
                          </Col>
                          {dashboardDetails.job_user_listing_new &&
                            <Table
                              pagination={false}
                              // dataSource={dashboardDetails.job_user_listing}
                              dataSource={dashboardDetails.job_user_listing_new.data}
                              columns={columnType}
                            />
                          }
                        </Row>
                      </Card>
                    </Col>
                    <Col
                      xs={24}
                      md={8}
                      lg={8}
                      xl={10}
                      className="employer-right-block employer-performance-right-block"
                    >
                      <Card
                        className="pie-chart"
                        title="Performance "
                        cover={
                          <img
                            alt="pin"
                            src={require("../../assets/images/icons/pin.svg")}
                            width="9"
                            height="20"
                          />
                        }
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              dropdownMatchSelectWidth={false}
                              defaultValue="This week"
                              onChange={(e) => {
                                if (e === "week") {
                                  let startDate = moment(today)
                                    .startOf("week")
                                    .format("YYYY-MM-DD");
                                  let endDate = moment(today)
                                    .endOf("week")
                                    .format("YYYY-MM-DD");
                                  this.getDashBoardDetailsByCalendarView(
                                    startDate,
                                    endDate,
                                    '',
                                    1,
                                    '',
                                    '',
                                    ''
                                  );
                                } else if (e === "month") {
                                  let startDate = moment(today)
                                    .startOf("month")
                                    .format("YYYY-MM-DD");
                                  let endDate = moment(today)
                                    .endOf("month")
                                    .format("YYYY-MM-DD");
                                  console.log(endDate, 'startDate: ', startDate);
                                  this.getDashBoardDetailsByCalendarView(
                                    startDate,
                                    endDate,
                                    '',
                                    1,
                                    '',
                                    '',
                                    ''
                                  );
                                }
                              }}
                            >
                              <Option value="month">Monthly</Option>
                              <Option value="week">Weekly</Option>
                            </Select>
                          </div>
                        }
                      >
                        <div>
                          <Row gutter={15}>
                            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                              <Pie
                                {...config}
                                hasLegend={false}
                                title="Promotion"
                                subTitle=""
                                total={() => {
                                  let total = this.max_of_three(
                                    label1,
                                    label2,
                                    label3
                                  );
                                  return (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          total !== undefined && total
                                            ? total + "%"
                                            : 0 + "%",
                                        // yuan(salesPieData.reduce((pre, now) => now.y + pre, 0)),
                                      }}
                                    />
                                  );
                                }}
                                data={pieDataChart}
                                colors={["#00FF7F", "#4B0082", "#FFA500	"]}
                                valueFormat={
                                  (val) => <div></div>
                                  // <span dangerouslySetInnerHTML={{
                                  //   __html: ''
                                  //   //  yuan(val)
                                  //    }}
                                  // />
                                }
                                height={215}
                              />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                              <ul className="pie-right-content">
                                <li className="green">{"View"}</li>
                                <li className="yellow">
                                  {loggedInUser.role_slug === langs.key.job
                                    ? "Applications"
                                    : "Reach outs"}
                                </li>
                                <li className="violate">
                                  {loggedInUser.role_slug === langs.key.job
                                    ? "Interviews"
                                    : "Sold"}
                                </li>
                              </ul>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                      {loggedInUser.role_slug === langs.key.car_dealer &&
                        this.renderCards(
                          "Ads",
                          "Reach outs",
                          "View",
                          "Sold",
                          dashboardDetails.ads_total_count,
                          dashboardDetails.ads_reachout_count,
                          dashboardDetails.total_view_count,
                          dashboardDetails.ads_sold_count
                        )}
                      {loggedInUser.role_slug === langs.key.job &&
                        this.renderCards(
                          "Ads",
                          "Views",
                          "Job Application",
                          "Interviews",
                          dashboardDetails.job_total_count,
                          dashboardDetails.job_view_count,
                          dashboardDetails.job_apply_count,
                          dashboardDetails.job_interview_count
                        )}
                      {loggedInUser.role_slug === langs.key.real_estate &&
                        this.renderCards(
                          "Ads",
                          "Views",
                          "Reach outs",
                          "Sold",
                          dashboardDetails.ads_total_count,
                          dashboardDetails.total_view_count,
                          dashboardDetails.ads_reachout_count,
                          dashboardDetails.ads_sold_count
                        )}
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
})(ClassifiedsDashboard);
