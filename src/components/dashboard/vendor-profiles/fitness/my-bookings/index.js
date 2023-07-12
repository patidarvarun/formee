import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Col,
  Divider,
  Input,
  Layout,
  Avatar,
  Row,
  Typography,
  Button,
  Calendar,
  Badge,
  Menu,
  Dropdown,
  Pagination,
  Card,
  Tabs,
  Form,
  Select,
  Rate,
  Alert,
  Modal,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getFitnessMemberShipBookings,
  listCustomerServiceBookings,
  getFitnessClassListing,
  getFitnessScheduleBookings,
  listCustomerBookingsHistory,
  getCustomerMyBookingsCalender,
  getFitnessBookingsHistory,
  listTraderCustomersOfBookedClasses,
  getFitnessMemberShipListing,
} from "../../../../../actions";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import {
  displayCalenderDate,
  displayDate,
} from "../../../../../components/common";
import history from "../../../../../common/History";
import { toastr } from "react-redux-toastr";
import { MESSAGES } from "../../../../../config/Message";
import { langs } from "../../../../../config/localization";
// import './profile-vendor-restaurant.less';
import { convertTime24To12Hour } from "../../../../../components/common";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import Icon from "../../../../../components/customIcons/customIcons";
import { blankCheck } from "../../../../common";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import "./mybooking.less";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

class ProfileVendorFitness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      customerBookingList: [],
      page: "1",
      order: "desc",
      page_size: "10",
      customer_id: "",
      key: 1,
      memberships: [],
      customerBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      selectedBookingDateClass: new Date(),
      currentMonth: new Date(),
      customerCalenderBookingList: [],
      totalRecordCustomerServiceBooking: 0,
      totalRecordCustomerSpaBookingHistory: 0,
      selectedDrawerIndex: "",
      selectedCustomer: null,
      selectedMembership: null,
      selectedDate: moment().format("YYYY-MM-DD"),
      selectedClass: "",
      selectedSchedule: [],
      classes: [],
      BookingClasses: [],
      weeklyDates: [],
      calenderView: "month",
      vendorAllDayCalenderBookingList: [],
      vendorCalenderBookingList: [],
      selectedView: 1,
      cccc: 1,
      historyList: [],
      selectedHistory: "",
      distinctDates: [],
      classOptions: [],
      selectedClassOption: "",
      customerCount: 0,
      customerDetail: null,
      classExpand: false,
      classExpand_Id: "",
      classExpandMember: false,
      classExpandMember_Id: "",
      classExpandMemberCustomer_Id: "",
      classExpandMemberCustomer: false,
      AllFitnessClasses: [],
      dates: {},
      weekDays:[],
      lastDateofWeek:"",
      firstDateofWeek:"",
      allMonthDates:[],
      calenderViewClasses : "week",
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;

    // // this.props.enableLoading()
    // this.getScheduleData()
    // this.getHistoryData()

    this.getBookingClasses();
    this.getClasses();
    this.getFitnessClasses();
    this.createWeekCalender();
  }

  onTabChange = (key, type) => {
    this.setState({
      selectedTab: key,
      selectedClass: "",
      selectedCustomer: "",
      selectedHistory: "",
    });
    if (key == "1") {
      this.getMembership(1);
      this.getBookingClasses();
      this.getFitnessClasses();
    } else if (key == "2") {
      this.getMembership(1);
    } else if (key == "3") {
      this.getHistoryData(1);
    }
  };

  /**
   * @method getClasses
   * @description get classes
   */
  getClasses = () => {
    let traderProfileId = this.props.userDetails.user.trader_profile.id;
    this.props.getFitnessClassListing({ id: traderProfileId }, (res) => {
      if (res.data && res.data.status === 200) {
        let data = res.data && res.data.data;
        let traderClasses =
          data.trader_classes &&
          Array.isArray(data.trader_classes) &&
          data.trader_classes.length
            ? data.trader_classes
            : [];
        let classId = traderClasses.length ? traderClasses[0].id : "";

        this.setState({
          classOptions: traderClasses,
          selectedClassOption: classId,
        });
        this.getScheduleData(1);
      }
    });
  };

  // get booking classes
  getBookingClasses = () => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    this.props.listTraderCustomersOfBookedClasses(
      { trader_user_profile_id },
      (res) => {
        if (res.status == 200 && res.data.length) {
          this.setState({ BookingClasses: res.data });
        }
      }
    );
  };
  // Add filter by classes
  onChangeBookingClassFilter = (e) => {
    let class_id = e.target.value;
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    this.props.listTraderCustomersOfBookedClasses(
      { trader_user_profile_id, class_filter: class_id },
      (res) => {
        if (res.status == 200) {
          this.setState({ BookingClasses: res.data });
        }
      }
    );
  };
  // Get all fitness classes
  getFitnessClasses = (page) => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    let reqdata = {
      trader_user_profile_id: trader_user_profile_id,
      // page_size: defaultPageSize,
      // page: page !== undefined ? page : 1,
    };
    this.props.getFitnessMemberShipListing(reqdata, (res) => {
      if (res.status === 200) {
        this.setState({ AllFitnessClasses: res.data.fitness_types });
      }
    });
  };

  /**
   * @method getMembership
   * @description get membership
   */
  getMembership = () => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    this.props.getFitnessMemberShipBookings(
      { trader_user_profile_id },
      (res) => {
        if (Number(res.status) === 200) {
          this.setState({ memberships: res.date });
        }
      }
    );
  };

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = () => {
    const { isLoggedIn, loggedInUser } = this.props;

    let itemId = this.props.match.params.itemId;
    let reqData = {
      id: itemId,
      user_id: isLoggedIn ? loggedInUser.id : "",
    };
    this.props.getBookingDetails(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ detail: res.data.data });
      }
    });
  };

  /**
   * @method getScheduleData
   * @description get schedule data
   */
  getScheduleData = (e) => {
    const { classes, selectedDate, selectedClassOption } = this.state;

    this.props.getFitnessScheduleBookings(
      { date: selectedDate, trader_class_id: selectedClassOption },
      (res) => {
        if (res.status === 200) {
          this.setState({
            classes: res.data.data.trader_classes_schedules,
          });
        }
      }
    );
  };

  /**
   * @method getHistoryData
   * @description get schedule data
   */
  getHistoryData = (e) => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;

    this.props.getFitnessBookingsHistory(
      {
        user_id: trader_user_profile_id,
        trader_class_id: this.state.selectedClassOption,
        date: moment("2020-11-30").format("YYYY-MM-DD"),
      },
      (res) => {
        if (Number(res.status) === 200) {
          let historyList = res.data.data.trader_classes_schedules;
          let count = 0;
          if (historyList.length) {
            Object.keys(historyList[0].customerClassBooking).map(function (
              key,
              index
            ) {
              count = count + historyList[0].customerClassBooking[key].length;
            });
          }

          this.setState({ historyList, customerCount: count });
          // , () => {
          // const { historyList } = this.state;
          //

          //Date wise Seperation Logic
          // let temp = []
          // this.state.historyList.map((el) => {
          //   let date = moment(el.created_date).format('DD-MM-YYYY')
          //   let index = temp.findIndex((t) => t.date == date)
          //
          //   if (index === -1) {
          //     temp.push({ date, dateHistory: [el] })
          //   } else {
          //     temp[index].dateHistory.push(el)
          //   }
          // })
          // this.setState({ distinctDates: [...temp] })
          // })
        }
      }
    );
  };

  /**
   * @method renderClasses
   * @description render classes options
   */
  renderClasses = () => {
    const {
      BookingClasses,
      AllFitnessClasses,
      dates,
      selectedBookingDateClass,
      allMonthDates,
      weekDays,
      calenderViewClasses,
    } = this.state;
    // return classOptions.map((el) => {

    return (
      // <Option key={el.id} value={el.id}>
      //   {el.class_name}
      // </Option>

      <Fragment>
        <div class_name="vendor-mybooking-class-wrapper">
          <div className="class-date-head">
            <Row gutter={(30, 30)}>
              <Col xs={24} md={12} lg={12} xl={12} className="class-date-left">
                <label>
                  <div
                    className="icon-left"
                    onClick={() => this.onChangePrevNext("prev")}
                  >
                    <svg
                      width="7"
                      height="13"
                      viewBox="0 0 7 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.49194 1.23514L5.3998 0L-4.24385e-05 6.09947L5.3998 12.1989L6.49194 10.9638L2.18762 6.09947L6.49194 1.23514Z"
                        fill="#CFD5DA"
                      />
                    </svg>
                  </div>
                  {calenderViewClasses == "week" && (
                    <span>
                      {" "}
                      {dates && moment(dates.firstday).format("DD")} -{" "}
                      {dates && moment(dates.lastday).format("DD MMMM")}{" "}
                    </span>
                  )}
                  {calenderViewClasses == "month" && (
                    <span>
                      {dates && moment(dates.month).format("MMMM YYYY")}{" "}
                    </span>
                  )}

                  {calenderViewClasses == "today" && (
                    <span>
                      {" "}
                      {dates && moment(dates.today).format("DD MMMM")}{" "}
                    </span>
                  )}

                  <div
                    className="icon-right"
                    onClick={() => this.onChangePrevNext("next")}
                  >
                    <svg
                      width="7"
                      height="13"
                      viewBox="0 0 7 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-0.000244141 1.23514L1.0919 0L6.49174 6.09947L1.0919 12.1989L-0.000244141 10.9638L4.30408 6.09947L-0.000244141 1.23514Z"
                        fill="#CFD5DA"
                      />
                    </svg>
                  </div>
                </label>
              </Col>
              <Col xs={24} md={12} lg={12} xl={12} className="class-date-right">
                <div className="selectbox">
                  <label>Show:</label>
                  <select
                    className="ant-select"
                    onChange={this.onChangeBookingClassFilter}
                  >
                    <option value=""> All Classes </option>
                    {AllFitnessClasses &&
                      AllFitnessClasses.map((val, i) => {
                        return (
                          <option key={i} value={val.id}>
                            {" "}
                            {val.name}{" "}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </Col>
            </Row>
          </div>

          {/* loop start here */}
          <div className="class-date-row">
            <Row gutter={(30, 30)} className="">
              {/* Weekly data section */}
              {BookingClasses.length > 0 &&
                calenderViewClasses == "week" &&
                weekDays.map((el, i) => {
                  return (
                    <>
                      <Row className="class-date-label-box">
                        <Col xs={24} md={12} lg={12} xl={12}>
                          <div className="date-label">
                            {" "}
                            {moment(el).format("DD MMMM YYYY")}{" "}
                          </div>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12}>
                          <div className="completed-label">
                            {/* <i className="success-icon">
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="8.12454"
                              cy="8.12454"
                              r="8.12454"
                              fill="#2ED47A"
                            />
                            <path
                              d="M5.07788 8.39315L7.79052 11.1716L12.1869 6.09375"
                              stroke="white"
                              stroke-width="1.74097"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </i>
                        <label>Completed</label> */}
                            <Link className="delete-icon">
                              <svg
                                width="10"
                                height="12"
                                viewBox="0 0 10 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                                  fill="#90A8BE"
                                />
                              </svg>
                            </Link>
                          </div>
                        </Col>
                      </Row>
                      {/* data section */}

                      {calenderViewClasses == "week" && (
                        <div className="class-schedule-box-row">
                          {BookingClasses &&
                            BookingClasses.length > 0 &&
                            BookingClasses.map((val, i) => {
                              const { customer_class_bookings } = val && val;
                              let customer_Booked = [];
                              customer_class_bookings.map((res) => {
                                if (res.status == "Accepted-Paid") {
                                  customer_Booked.push(res);
                                }
                              });
                              // match start date & end date
                              let dateToCheck = moment(el).format("DD-MM-YYYY");
                              // console.log('ids',val.start_date,"==",dateToCheck)
                              if (
                                val.start_date < dateToCheck &&
                                val.end_date > dateToCheck
                              ) {
                                return (
                                  <Row
                                    key={i}
                                    gutter={(20, 20)}
                                    className={`class-schedule-box ${
                                      this.state.classExpand_Id == val.id
                                        ? "schedule-box-expanded"
                                        : ""
                                    } `}
                                    onClick={() =>
                                      this.setState({
                                        classExpand: !this.state.classExpand,
                                        classExpand_Id: val.id,
                                      })
                                    }
                                  >
                                    <Col xs={24} md={9} lg={9} xl={9}>
                                      <div className="class-schedule-time">
                                        <div className="time">
                                          {" "}
                                          {customer_Booked &&
                                            customer_Booked.length &&
                                            customer_Booked[0]
                                              .booking_time}{" "}
                                          pm{" "}
                                        </div>
                                        <div className="duration">
                                          {" "}
                                          {val.class_time}{" "}
                                        </div>
                                      </div>
                                    </Col>
                                    <Col xs={24} md={9} lg={9} xl={9}>
                                      <div className="class-schedule-name">
                                        <div className="name">
                                          {val.class_name}{" "}
                                        </div>
                                        <div className="category-name">
                                          Luke / Studio 2
                                        </div>
                                      </div>
                                    </Col>
                                    <Col xs={24} md={6} lg={6} xl={6}>
                                      <div className="class-user">
                                        <div className="class-thumb">
                                          <svg
                                            width="30"
                                            height="29"
                                            viewBox="0 0 30 29"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                                              fill="#90A8BE"
                                            />
                                            <path
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                                              fill="white"
                                            />
                                            <path
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                                              fill="white"
                                            />
                                          </svg>
                                        </div>
                                        <label>
                                          {" "}
                                          {customer_Booked.length} /{" "}
                                          {val.capacity}{" "}
                                        </label>
                                      </div>
                                    </Col>
                                    {this.state.classExpand_Id == val.id && (
                                      <div
                                        className="user-list-wrapper"
                                        style={{
                                          display: this.state.classExpand
                                            ? "block"
                                            : "none",
                                        }}
                                      >
                                        <ul className="user-list">
                                          {customer_Booked.map((res) => (
                                            <li> {res.customer_name} </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </Row>
                                );
                              }
                            })}
                        </div>
                      )}
                    </>
                  );
                })}
              {/* Today only data section */}
              {calenderViewClasses == "today" && (
                <>
                  <Col xs={24} md={12} lg={12} xl={12}>
                    {calenderViewClasses == "today" && (
                      <div className="date-label">
                        {" "}
                        {dates && moment(dates.today).format("DD MMMM")}{" "}
                      </div>
                    )}
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={12}>
                    <div className="completed-label">
                      {/* <i className="success-icon">
                              <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="8.12454"
                                  cy="8.12454"
                                  r="8.12454"
                                  fill="#2ED47A"
                                />
                                <path
                                  d="M5.07788 8.39315L7.79052 11.1716L12.1869 6.09375"
                                  stroke="white"
                                  stroke-width="1.74097"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </i>
                            <label>Completed</label> */}
                      <Link className="delete-icon">
                        <svg
                          width="10"
                          height="12"
                          viewBox="0 0 10 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                            fill="#90A8BE"
                          />
                        </svg>
                      </Link>
                    </div>
                  </Col>
                </>
              )}

              {BookingClasses.length > 0 &&
                calenderViewClasses == "month" &&
                allMonthDates.map((el, i) => {
                  return (
                    <>
                      <Col xs={24} md={12} lg={12} xl={12}>
                        <div className="date-label">
                          {" "}
                          {moment(el).format("DD MMMM YYYY")}{" "}
                        </div>
                      </Col>
                      <Col xs={24} md={12} lg={12} xl={12}>
                        <div className="completed-label">
                          {/* <i className="success-icon">
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="8.12454"
                              cy="8.12454"
                              r="8.12454"
                              fill="#2ED47A"
                            />
                            <path
                              d="M5.07788 8.39315L7.79052 11.1716L12.1869 6.09375"
                              stroke="white"
                              stroke-width="1.74097"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </i>
                        <label>Completed</label> */}
                          <Link className="delete-icon">
                            <svg
                              width="10"
                              height="12"
                              viewBox="0 0 10 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                                fill="#90A8BE"
                              />
                            </svg>
                          </Link>
                        </div>
                      </Col>

                      {/* data section */}

                      {calenderViewClasses == "month" && (
                        <div>
                          {BookingClasses &&
                            BookingClasses.length > 0 &&
                            BookingClasses.map((val, i) => {
                              const { customer_class_bookings } = val && val;
                              let customer_Booked = [];
                              customer_class_bookings.map((res) => {
                                if (res.status == "Accepted-Paid") {
                                  customer_Booked.push(res);
                                }
                              });
                              // match days dates with month
                              let dateToCheck = moment(el).format("DD-MM-YYYY");
                              if (dateToCheck == val.start_date) {
                                return (
                                  <Row
                                    key={i}
                                    gutter={(20, 20)}
                                    className={`class-schedule-box ${
                                      this.state.classExpand_Id == val.id
                                        ? "schedule-box-expanded"
                                        : ""
                                    } `}
                                    onClick={() =>
                                      this.setState({
                                        classExpand: !this.state.classExpand,
                                        classExpand_Id: val.id,
                                      })
                                    }
                                  >
                                    <Col xs={24} md={9} lg={9} xl={9}>
                                      <div className="class-schedule-time">
                                        <div className="time">
                                          {" "}
                                          {customer_Booked &&
                                            customer_Booked.length &&
                                            customer_Booked[0]
                                              .booking_time}{" "}
                                          pm{" "}
                                        </div>
                                        <div className="duration">
                                          {" "}
                                          {val.class_time}{" "}
                                        </div>
                                      </div>
                                    </Col>
                                    <Col xs={24} md={9} lg={9} xl={9}>
                                      <div className="class-schedule-name">
                                        <div className="name">
                                          {val.class_name}{" "}
                                        </div>
                                        <div className="category-name">
                                          Luke / Studio 2
                                        </div>
                                      </div>
                                    </Col>
                                    <Col xs={24} md={6} lg={6} xl={6}>
                                      <div className="class-user">
                                        <div className="class-thumb">
                                          <svg
                                            width="30"
                                            height="29"
                                            viewBox="0 0 30 29"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                                              fill="#90A8BE"
                                            />
                                            <path
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                                              fill="white"
                                            />
                                            <path
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                                              fill="white"
                                            />
                                          </svg>
                                        </div>
                                        <label>
                                          {" "}
                                          {customer_Booked.length} /{" "}
                                          {val.capacity}{" "}
                                        </label>
                                      </div>
                                    </Col>
                                    {this.state.classExpand_Id == val.id && (
                                      <div
                                        className="user-list-wrapper"
                                        style={{
                                          display: this.state.classExpand
                                            ? "block"
                                            : "none",
                                        }}
                                      >
                                        <ul className="user-list">
                                          {customer_Booked.map((res) => (
                                            <li> {res.customer_name} </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </Row>
                                );
                              }
                            })}
                        </div>
                      )}
                    </>
                  );
                })}
            </Row>

            {/* Today only data */}
            {calenderViewClasses == "today" && (
              <div>
                {BookingClasses &&
                  BookingClasses.length > 0 &&
                  BookingClasses.map((val, i) => {
                    const { customer_class_bookings } = val && val;
                    let customer_Booked = [];
                    customer_class_bookings.map((res) => {
                      if (res.status == "Accepted-Paid") {
                        customer_Booked.push(res);
                      }
                    });

                    let todayDate = moment(dates.today).format("DD-MM-YYYY");
                    // console.log('ids',todayDate)
                    // console.log('ids',val.end_date)
                    if (todayDate == val.start_date) {
                      return (
                        <Row
                          key={i}
                          gutter={(20, 20)}
                          className={`class-schedule-box ${
                            this.state.classExpand_Id == val.id
                              ? "schedule-box-expanded"
                              : ""
                          } `}
                          onClick={() =>
                            this.setState({
                              classExpand: !this.state.classExpand,
                              classExpand_Id: val.id,
                            })
                          }
                        >
                          <Col xs={24} md={9} lg={9} xl={9}>
                            <div className="class-schedule-time">
                              <div className="time">
                                {" "}
                                {customer_Booked &&
                                  customer_Booked.length &&
                                  customer_Booked[0].booking_time}{" "}
                                pm{" "}
                              </div>
                              <div className="duration"> {val.class_time} </div>
                            </div>
                          </Col>
                          <Col xs={24} md={9} lg={9} xl={9}>
                            <div className="class-schedule-name">
                              <div className="name">{val.class_name} </div>
                              <div className="category-name">
                                Luke / Studio 2
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} md={6} lg={6} xl={6}>
                            <div className="class-user">
                              <div className="class-thumb">
                                <svg
                                  width="30"
                                  height="29"
                                  viewBox="0 0 30 29"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                                    fill="#90A8BE"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                                    fill="white"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                                    fill="white"
                                  />
                                </svg>
                              </div>
                              <label>
                                {" "}
                                {customer_Booked.length} / {val.capacity}{" "}
                              </label>
                            </div>
                          </Col>
                          {this.state.classExpand_Id == val.id && (
                            <div
                              className="user-list-wrapper"
                              style={{
                                display: this.state.classExpand
                                  ? "block"
                                  : "none",
                              }}
                            >
                              <ul className="user-list">
                                {customer_Booked.map((res) => (
                                  <li> {res.customer_name} </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Row>
                      );
                    }
                  })}
              </div>
            )}

            {/* Weeks wise only data */}
            {/* {
                calenderViewClasses == 'week' && 
                    <div>
                        {
                        BookingClasses && BookingClasses.length>0 &&
                        BookingClasses.map((val,i)=>{
                          const {customer_class_bookings} = val && val;
                          let customer_Booked = [];
                            customer_class_bookings.map(res=>{
                            if(res.status == 'Accepted-Paid'){
                              customer_Booked.push(res)
                            }
                          })
                          return(
                            <Row
                                key={i}
                                gutter={(20, 20)}
                                className={`class-schedule-box ${this.state.classExpand_Id == val.id ? 'schedule-box-expanded' : '' } `}
                                onClick={()=>this.setState({classExpand:!this.state.classExpand, classExpand_Id:val.id})}
                              >
                                <Col xs={24} md={9} lg={9} xl={9}>
                                  <div className="class-schedule-time">
                                    <div className="time"> {customer_Booked && customer_Booked.length && customer_Booked[0].booking_time } pm </div>
                                    <div className="duration"> {val.class_time} </div>
                                  </div>
                                </Col>
                                <Col xs={24} md={9} lg={9} xl={9}>
                                  <div className="class-schedule-name">
                                    <div className="name">{val.class_name} </div>
                                    <div className="category-name">Luke / Studio 2</div>
                                  </div>
                                </Col>
                                <Col xs={24} md={6} lg={6} xl={6}>
                                  <div className="class-user">
                                    <div className="class-thumb">
                                      <svg
                                        width="30"
                                        height="29"
                                        viewBox="0 0 30 29"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                                          fill="#90A8BE"
                                        />
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                                          fill="white"
                                        />
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                                          fill="white"
                                        />
                                      </svg>
                                    </div>
                                    <label> {customer_Booked.length} / {val.capacity} </label>
                                  </div>
                                </Col>
                                {
                                  this.state.classExpand_Id == val.id &&
                                  <div className="user-list-wrapper" style={{display:this.state.classExpand ? 'block' : 'none'}}>
                                  <ul className="user-list">
                                    {
                                      customer_Booked.map(res=>(
                                        <li> {res.customer_name} </li>
                                      ))
                                    }
                                  </ul>
                                </div>
                                }
                              
                              </Row>
                          )
                        })
                        }
                    </div>
              } */}

            {/* Month only data */}
            {/* {
                calenderViewClasses == 'month' && 
                    <div>
                        {
                        BookingClasses && BookingClasses.length>0 &&
                        BookingClasses.map((val,i)=>{
                          const {customer_class_bookings} = val && val;
                          let customer_Booked = [];
                            customer_class_bookings.map(res=>{
                            if(res.status == 'Accepted-Paid'){
                              customer_Booked.push(res)
                            }
                          })
                          return(
                            <Row
                                key={i}
                                gutter={(20, 20)}
                                className={`class-schedule-box ${this.state.classExpand_Id == val.id ? 'schedule-box-expanded' : '' } `}
                                onClick={()=>this.setState({classExpand:!this.state.classExpand, classExpand_Id:val.id})}
                              >
                                <Col xs={24} md={9} lg={9} xl={9}>
                                  <div className="class-schedule-time">
                                    <div className="time"> {customer_Booked && customer_Booked.length && customer_Booked[0].booking_time } pm </div>
                                    <div className="duration"> {val.class_time} </div>
                                  </div>
                                </Col>
                                <Col xs={24} md={9} lg={9} xl={9}>
                                  <div className="class-schedule-name">
                                    <div className="name">{val.class_name} </div>
                                    <div className="category-name">Luke / Studio 2</div>
                                  </div>
                                </Col>
                                <Col xs={24} md={6} lg={6} xl={6}>
                                  <div className="class-user">
                                    <div className="class-thumb">
                                      <svg
                                        width="30"
                                        height="29"
                                        viewBox="0 0 30 29"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                                          fill="#90A8BE"
                                        />
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                                          fill="white"
                                        />
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                                          fill="white"
                                        />
                                      </svg>
                                    </div>
                                    <label> {customer_Booked.length} / {val.capacity} </label>
                                  </div>
                                </Col>
                                {
                                  this.state.classExpand_Id == val.id &&
                                  <div className="user-list-wrapper" style={{display:this.state.classExpand ? 'block' : 'none'}}>
                                  <ul className="user-list">
                                    {
                                      customer_Booked.map(res=>(
                                        <li> {res.customer_name} </li>
                                      ))
                                    }
                                  </ul>
                                </div>
                                }
                              
                              </Row>
                          )
                        })
                        }
                    </div>
            }
             */}
          </div>
          {/* <div className="class-date-row">
            <Row gutter={(30, 30)} className="class-date-label-box">
              <Col xs={24} md={12} lg={12} xl={12}>
                <div className="date-label">7 Nov, Monday</div>
              </Col>
              <Col xs={24} md={12} lg={12} xl={12}>
                <div className="completed-label">
                  <i className="success-icon">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="8.12454"
                        cy="8.12454"
                        r="8.12454"
                        fill="#2ED47A"
                      />
                      <path
                        d="M5.07788 8.39315L7.79052 11.1716L12.1869 6.09375"
                        stroke="white"
                        stroke-width="1.74097"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </i>
                  <label>Completed</label>
                  <Link className="delete-icon">
                    <svg
                      width="10"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                        fill="#90A8BE"
                      />
                    </svg>
                  </Link>
                </div>
              </Col>
            </Row>
            <Row
              gutter={(20, 20)}
              className="class-schedule-box completed-schedule"
            >
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-time">
                  <div className="time">1:30 pm - 2:30 pm </div>
                  <div className="duration">60 min</div>
                </div>
              </Col>
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-name">
                  <div className="name">Reformer Pilates - INTRO</div>
                  <div className="category-name">Shannon / Studio 1</div>
                </div>
              </Col>
              <Col xs={24} md={6} lg={6} xl={6}>
                <div className="class-user">
                  <div className="class-thumb">
                    <svg
                      width="30"
                      height="29"
                      viewBox="0 0 30 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                        fill="#90A8BE"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <label>4 / 20</label>
                </div>
              </Col>
            </Row>
            <Row
              gutter={(20, 20)}
              className="class-schedule-box  completed-schedule"
            >
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-time">
                  <div className="time">1:30 pm - 2:30 pm </div>
                  <div className="duration">60 min</div>
                </div>
              </Col>
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-name">
                  <div className="name">Reformer Pilates - INTRO</div>
                  <div className="category-name">John / Studio 2</div>
                </div>
              </Col>
              <Col xs={24} md={6} lg={6} xl={6}>
                <div className="class-user">
                  <div className="class-thumb">
                    <svg
                      width="30"
                      height="29"
                      viewBox="0 0 30 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                        fill="#90A8BE"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <label>4 / 20</label>
                </div>
              </Col>
            </Row>
          </div> */}

          {/* <div className="class-date-row">
            <Row gutter={(30, 30)} className="class-date-label-box">
              <Col xs={24} md={12} lg={12} xl={12}>
                <div className="date-label">10 Nov, Friday</div>
              </Col>
            </Row>
            <Row gutter={(20, 20)} className="class-schedule-box">
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-time">
                  <div className="time">1:30 pm - 2:30 pm </div>
                  <div className="duration">60 min</div>
                </div>
              </Col>
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-name">
                  <div className="name">Hot Yoga</div>
                  <div className="category-name">Luke / Studio 2</div>
                </div>
              </Col>
              <Col xs={24} md={6} lg={6} xl={6}>
                <div className="class-user">
                  <div className="class-thumb">
                    <svg
                      width="30"
                      height="29"
                      viewBox="0 0 30 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                        fill="#90A8BE"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <label>4 / 20</label>
                </div>
              </Col>
            </Row>
            <Row gutter={(20, 20)} className="class-schedule-box">
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-time">
                  <div className="time">1:30 pm - 2:30 pm </div>
                  <div className="duration">60 min</div>
                </div>
              </Col>
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-name">
                  <div className="name">Hot Yoga</div>
                  <div className="category-name">Luke / Studio 2</div>
                </div>
              </Col>
              <Col xs={24} md={6} lg={6} xl={6}>
                <div className="class-user">
                  <div className="class-thumb">
                    <svg
                      width="30"
                      height="29"
                      viewBox="0 0 30 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                        fill="#90A8BE"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <label>4 / 20</label>
                </div>
              </Col>
            </Row>
            <Row gutter={(20, 20)} className="class-schedule-box">
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-time">
                  <div className="time">1:30 pm - 2:30 pm </div>
                  <div className="duration">60 min</div>
                </div>
              </Col>
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-name">
                  <div className="name">Hot Yoga</div>
                  <div className="category-name">Luke / Studio 2</div>
                </div>
              </Col>
              <Col xs={24} md={6} lg={6} xl={6}>
                <div className="class-user">
                  <div className="class-thumb">
                    <svg
                      width="30"
                      height="29"
                      viewBox="0 0 30 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                        fill="#90A8BE"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <label>4 / 20</label>
                </div>
              </Col>
            </Row>
          </div>
          <div className="class-date-row">
            <Row gutter={(30, 30)} className="class-date-label-box">
              <Col xs={24} md={12} lg={12} xl={12}>
                <div className="date-label">11 Nov, Saturday</div>
              </Col>
            </Row>
            <Row gutter={(20, 20)} className="class-schedule-box">
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-time">
                  <div className="time">1:30 pm - 2:30 pm </div>
                  <div className="duration">60 min</div>
                </div>
              </Col>
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-name">
                  <div className="name">Hot Yoga</div>
                  <div className="category-name">Luke / Studio 2</div>
                </div>
              </Col>
              <Col xs={24} md={6} lg={6} xl={6}>
                <div className="class-user">
                  <div className="class-thumb">
                    <svg
                      width="30"
                      height="29"
                      viewBox="0 0 30 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                        fill="#90A8BE"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <label>4 / 20</label>
                </div>
              </Col>
            </Row>
            <Row gutter={(20, 20)} className="class-schedule-box">
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-time">
                  <div className="time">1:30 pm - 2:30 pm </div>
                  <div className="duration">60 min</div>
                </div>
              </Col>
              <Col xs={24} md={9} lg={9} xl={9}>
                <div className="class-schedule-name">
                  <div className="name">Hot Yoga</div>
                  <div className="category-name">Luke / Studio 2</div>
                </div>
              </Col>
              <Col xs={24} md={6} lg={6} xl={6}>
                <div className="class-user">
                  <div className="class-thumb">
                    <svg
                      width="30"
                      height="29"
                      viewBox="0 0 30 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.3301 29C23.3382 29 29.8301 22.5081 29.8301 14.5C29.8301 6.49187 23.3382 0 15.3301 0C7.32195 0 0.830078 6.49187 0.830078 14.5C0.830078 22.5081 7.32195 29 15.3301 29Z"
                        fill="#90A8BE"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.4822 10.4431C11.4919 8.1285 13.059 6.45187 15.22 6.44435C17.4573 6.43791 19.0072 8.15535 18.9879 10.6236C18.9696 12.9189 17.3628 14.5901 15.1964 14.5708C13.002 14.5504 11.4726 12.8512 11.4822 10.4431Z"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.1315 20.8277C13.3948 20.8288 11.6569 20.8105 9.92014 20.8374C9.22951 20.847 8.65166 20.6945 8.41321 19.9985C8.17692 19.3122 8.6291 18.8503 9.12103 18.5131C12.3282 16.308 15.7416 15.8096 19.3677 17.3745C20.1625 17.7172 20.9552 18.0791 21.5867 18.7096C21.9798 19.1016 22.2763 19.5216 22.0196 20.0909C21.7811 20.6172 21.3472 20.8374 20.7597 20.8331C18.8844 20.818 17.008 20.8277 15.1315 20.8277Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <label>4 / 20</label>
                </div>
              </Col>
            </Row>
          </div> */}
        </div>
      </Fragment>
    );
    // });
  };

  onChangeCalenderView = (view) => {
    this.setState(
      {
        calenderView: view,
        selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          // this.createWeekCalender();
        }
        // this.getBookingsForCalenderDate(new Date());
      }
    );
  };
  onChangeBookingClassalenderView = (view) => {
    this.setState(
      {
        calenderViewClasses: view,
        selectedBookingDateClass: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.createWeekCalender();
        }
        // this.getBookingsForCalenderDate(new Date());
      }
    );
  };

  // trial week calendar here
  createWeekCalender = () => {
    
    // var curr = new Date; // get current date
    // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    // var last = first + 7; // last day is the first day + 6

    // var firstday = new Date();
    // var lastday = new Date(curr.setDate(last));
    var timeFrom = (X) => {
      var dates = [];
      for (let I = 0; I < Math.abs(X); I++) {
          dates.push(new Date(new Date().getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000)));
      }
      return dates;
     }
     var firstday = timeFrom(-7)[0];
     var lastday = timeFrom(-7)[6];

    let today = new Date();
    let month = new Date();

    let weekday = {
      firstday,
      lastday,
      today,
      month,
    };
    this.setState({
      dates: weekday,
    });
   

    // calling week days funrction
    this.createWeekDays();

    //  calling all days of month
    this.createAllDaysofMonth();
  };

   // create week days function
  createWeekDays = () =>{
    // let curr = new Date();
    // let weekArray = [];
    // for (let i = 1; i <= 7; i++) {
    //   let first = curr.getDate() - curr.getDay() + i;
    //   let day = new Date(curr.setDate(first));
    //   weekArray.push(day);
    // }
    // let newWeekDatesArray = weekArray.map((d) => d.toString());

    var timeFrom = (X) => {
      var dates = [];
      for (let I = 0; I < Math.abs(X); I++) {
          dates.push(new Date(new Date().getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000)));
      }
      return dates;
     }

    this.setState({lastDateofWeek:timeFrom(-7)[6]})
    this.setState({firstDateofWeek:timeFrom(-7)[0]})
    this.setState({
      weekDays: timeFrom(-7),
    });
 
   
  }

  // create all dayes of month fuction
  createAllDaysofMonth = () => {
    var getDaysOfMonth = function (year, month) {
      var monthDate = moment(year + "-" + month, "YYYY-MM");
      var daysInMonth = monthDate.daysInMonth();
      var arrDays = [];

      while (daysInMonth) {
        var current = moment().date(daysInMonth);
        arrDays.push(current.format("MM-DD-YYYY"));
        daysInMonth--;
      }

      return arrDays;
      };
    var myMonth = moment(new Date()).format('MM');
    var myYear = moment(new Date()).format('YYYY');
    var dateList = getDaysOfMonth(myYear,myMonth);
    this.setState({currentMonth:dateList.reverse()[0]})
    this.setState({currentYear:dateList.reverse()[0]})

    this.setState({
      allMonthDates: dateList.reverse(),
    });
  };

  // chnage the Prev and Next date and months
  onChangePrevNext = (action) => {
    let weekday = {};
      if(this.state.calenderViewClasses == "today"){
        if(action == "next"){
          weekday.today = moment(this.state.dates.today).subtract(-1,'days') 
        }else{
          weekday.today=  moment(this.state.dates.today).subtract(1,'days')
        }
        this.setState({
          dates: weekday,
        });
       }else if(this.state.calenderViewClasses == "week"){
          if(action == "next"){
    
          var timeFrom = (X) => {
            var dates = [];
            for (let I = 0; I < Math.abs(X); I++) {
                dates.push(new Date(new Date(this.state.lastDateofWeek).getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000)));
            }
            return dates;
           }
            weekday.firstday = timeFrom(-7)[0] 
            weekday.lastday = timeFrom(-7)[6] 

          this.setState({lastDateofWeek:timeFrom(-7)[6]})
          this.setState({firstDateofWeek:timeFrom(-7)[0]})
         
          this.setState({
            weekDays: timeFrom(-7),
          });  
                 
          }else{
            
            var timeFrom = (X) => {
              var dates = [];
              for (let I = 0; I < Math.abs(X); I++) {
                  dates.push(new Date(new Date(this.state.firstDateofWeek).getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000)));
              }
              return dates;
             }
             weekday.firstday = timeFrom(7)[6] 
             weekday.lastday = timeFrom(7)[0] 

              this.setState({firstDateofWeek:timeFrom(7)[6]})
              this.setState({lastDateofWeek:timeFrom(7)[0]})
            
              this.setState({
                weekDays: timeFrom(7),
              });
            // console.log('ids',this.state.firstDateofWeek)  
          
          }
          this.setState({
            dates: weekday,
          });
            
       }else if(this.state.calenderViewClasses == "month"){
        if(action == "next"){
          weekday.month = moment(this.state.dates.month).subtract(-1,'months') 
          
          var myMonth = moment(new Date(this.state.currentMonth)).subtract(-1,'month').format('MM');
          
          var myYear = moment(new Date(this.state.currentYear)).format('YYYY');
     
          // const getAllDaysInMonth = (month, year) =>
          // Array.from(
          //   {length: new Date(year, month, 0).getDate() + 1},
          //   (_, i) => new Date(year, month, i)
          // );
          // const dateList = getAllDaysInMonth(myMonth, myYear).map(x => x.toLocaleDateString())
          const getDaysInMonth = (month, year) => (new Array(31)).fill('').map((v,i)=>new Date(year,month-1,i+1)).filter(v=>v.getMonth()===month-1)
          var dateList = getDaysInMonth(myMonth,myYear)
           
          this.setState({currentMonth: myMonth})
          
          this.setState({
            allMonthDates: dateList,
          });
 
        }else{
          weekday.month=  moment(this.state.dates.month).subtract(1,'months')

          var myMonth = moment(new Date(this.state.currentMonth)).subtract(1,'month').format('MM');
          var myYear = moment(new Date(this.state.currentYear)).format('YYYY');
         var checkPrevYear = moment(this.state.dates.month).subtract(1,'months').format('YYYY');
           myYear = checkPrevYear;
           this.setState({currentYear: moment(this.state.dates.month).subtract(1,'months')})
       
     
          const getDaysInMonth = (month, year) => (new Array(31)).fill('').map((v,i)=>new Date(year,month-1,i+1)).filter(v=>v.getMonth()===month-1)
          var dateList = getDaysInMonth(myMonth,myYear)
          this.setState({currentMonth: myMonth})
          
          this.setState({
            allMonthDates: dateList,
          });
        }
        // var dateList = getDaysOfMonth(myYear,myMonth);
         
        // this.setState({
        //   allMonthDates: dateList,
        // });
        this.setState({
          dates: weekday,
        });
       
     }
  }

  renderMyBooking = () => {
    const {
      detail,
      selectedDate,
      selectedView,
      selectedClass,
      selectedClassOption,
      selectedSchedule,
      classes,
    } = this.state;

    // if (classes.length) {
    return (
      <Fragment>
        <Row className="">
          <Col md={24}>
            <Select
              placeholder="Select"
              value={selectedClassOption}
              className="w-100 mt-20 input-shadow"
              allowClear
              onChange={(e) => {
                this.setState({ selectedClassOption: e }, () => {
                  this.getScheduleData(1);
                });
              }}
            >
              {this.renderClasses()}
            </Select>
            <div className="calendra-parent-block">
              {selectedView === 1 && (
                <Card className="mt-10 calendra-withicons calender-setn input-shadow">
                  <Icon
                    onClick={() => {
                      let diff = moment(selectedDate, "ddd,DD MMM").diff(
                        moment(),
                        "days"
                      );

                      if (diff >= 1) {
                        let nextDay = moment(selectedDate, "YYYY-MM-DD")
                          .add(-1, "days")
                          .format("YYYY-MM-DD");
                        this.setState({ selectedDate: nextDay }, () => {
                          this.getScheduleData();
                        });
                      } else {
                        toastr.warning(
                          langs.warning,
                          MESSAGES.DATE_SELECTION_VALIDATION
                        );
                      }
                    }}
                    icon="arrow-left"
                    size="14"
                    className="text-left"
                  />
                  <Text>{selectedDate}</Text>
                  <Icon
                    onClick={() => {
                      let nextDay = moment(selectedDate, "YYYY-MM-DD")
                        .add(1, "days")
                        .format("YYYY-MM-DD");
                      this.setState({ selectedDate: nextDay }, () => {
                        this.getScheduleData();
                      });
                    }}
                    icon="arrow-right"
                    size="14"
                    className="align-right"
                  />
                </Card>
              )}

              <div className="calender-detail">
                <Row>
                  <Col md={24} className="blue-strip">
                    {" "}
                    {moment(selectedDate, "YYYY-MM-DD").format("ddd,DD MMM")}
                  </Col>
                </Row>
                <Card>
                  {Array.isArray(classes) && classes.length ? (
                    classes.map((el, i) => {
                      return (
                        <>
                          <div className="grid-info-block">
                            <Row
                              key={i}
                              onClick={() =>
                                this.setState({ selectedClass: el })
                              }
                            >
                              <Col md={11} className="pl-24">
                                <Text>
                                  <div className="gray-dark">
                                    {moment(el.start_time, "HH:mm:ss").format(
                                      "hh:mm A"
                                    )}
                                  </div>
                                  <div className="lht-dark">
                                    <span className=" blue-text">
                                      {el.duration}
                                    </span>
                                  </div>
                                </Text>
                              </Col>
                              <Col md={10}>
                                <Text>
                                  <div className="gray-dark">
                                    {el.trader_class.class_name}
                                  </div>
                                  <div className="lht-dark ">
                                    <span className=" blue-text">
                                      {el.trader_class.instructor_name} / Studio{" "}
                                      {el.trader_class.room}
                                    </span>
                                  </div>
                                </Text>
                              </Col>
                              <Col md={3} className="pr-24 text-right">
                                <div className="user-ratio-block">
                                  <div className="user-icon">
                                    <img
                                      src={require("../../../../../assets/images/icons/user-small-icon.svg")}
                                      alt="user-small-icon"
                                    />
                                  </div>
                                  <div className="ratio-value">
                                    <Text>
                                      {el.trader_class.capacity}&nbsp;/&nbsp;
                                      {
                                        el.active_fitness_class_subscriptions
                                          .length
                                      }
                                    </Text>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <Text className="no-schedule">No Schedule available.</Text>
                  )}
                </Card>
              </div>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Fragment>
    );
    // } else {
    //   return <div>
    //     <Alert message="No records found." type="error" />
    //   </div>
    // }
  };

  renderMembershipList = () => {
    const {
      memberships,
      selectedDrawerIndex,
      selectedCustomer,
      selectedMembership,
    } = this.state;

    return memberships.map((el, index) => {
      return (
        <Fragment key={index} clas>
          <div
            className="mt-20"
            onClick={() =>
              this.setState({
                selectedDrawerIndex: index,
                selectedMembership: el,
              })
            }
          >
            <Row>
              {index === selectedDrawerIndex ? (
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  {selectedMembership.customers.map((cust, index) => {
                    return (
                      <ul
                        className="fm-field-repeat"
                        onClick={() =>
                          this.setState({ selectedCustomer: cust })
                        }
                      >
                        <li>
                          <span>{index + 1}</span> {cust.name}
                        </li>
                      </ul>
                    );
                  })}
                </Col>
              ) : (
                ""
              )}
            </Row>
          </div>
        </Fragment>
      );
    });
  };
  renderBokingCalenderItems = () => {
    const { vendorCalenderBookingList,vendorAllDayCalenderBookingList,classes,BookingClasses } = this.state;
    if (
      classes &&
      classes.length > 0 
    ) {
      return (
        <ul className="flex-container wrap">
          {classes.map((value, i) => {
            const {trader_class} = value && value;
            return (
              <li key={`${i}_vendor_bookings`}>
                <div className="appointments-label">{trader_class.class_name}</div>
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
    const listData = this.state.BookingClasses;
    let formatedCalanderDate = moment(value).format("YYYY-MM-DD");
    console.log('ids',listData)
    let isBook = false;
    listData.map(item=>{
      if(item.trader_classes_schedules.length > 0){
        isBook = true;
      }
    })
     
    return (
      <span className="events">{isBook ? <Badge status={"error"} /> : ""}</span>
    );
  };

  renderHistoryList = () => {
    const { selectedClassOption, historyList, distinctDates } = this.state;

    let me = this;
    return (
      <div>
        <Select
          placeholder="Select"
          className="w-100 mt-20 input-shadow"
          value={selectedClassOption}
          allowClear
          onChange={(e) => {
            this.setState({ selectedClassOption: e }, () => {
              this.getHistoryData(1);
            });
          }}
        >
          {this.renderClasses()}
        </Select>

        {historyList.map((his, hisKey) => {
          if (Object.keys(his.customerClassBooking).length === 0) {
            return;
          } else {
            return (
              <Fragment key={hisKey}>
                <Row className=" ">
                  <Col md={24}>
                    <div className="calendra-parent-block">
                      <div className="calender-detail">
                        <Card>
                          {Object.keys(his.customerClassBooking).map(function (
                            key,
                            index
                          ) {
                            return (
                              <div>
                                <Row>
                                  <Col md={24} className="blue-strip">
                                    {" "}
                                    {moment(key, "DD-MM-YYYY").format(
                                      "ddd,DD MMM"
                                    )}
                                  </Col>
                                </Row>
                                {Array.isArray(his.customerClassBooking[key]) &&
                                his.customerClassBooking[key].length ? (
                                  his.customerClassBooking[key].map((el, i) => {
                                    return (
                                      <div
                                        className="history-list grid-info-block mb-0"
                                        key={i}
                                      >
                                        <Row
                                          className="mybooking-history"
                                          onClick={() => {
                                            me.setState({
                                              selectedHistory: his,
                                              customerDetail: el,
                                            });
                                          }}
                                        >
                                          <Col md={11} className="pl-24">
                                            <Text>
                                              <div className="gray-dark">
                                                <span className="fm-eventb-time">
                                                  {moment(
                                                    his.start_time,
                                                    "hh:mm:ss"
                                                  ).format("LT")}{" "}
                                                  -{" "}
                                                  {moment(
                                                    his.end_time,
                                                    "hh:mm:ss"
                                                  ).format("LT")}
                                                </span>{" "}
                                              </div>
                                              <div className="lht-dark ">
                                                <span className=" blue-text">
                                                  {his.duration}
                                                </span>
                                              </div>
                                            </Text>
                                          </Col>
                                          <Col md={10}>
                                            <Text>
                                              {his.trader_class.class_name}
                                              <br />
                                              <span className=" blue-text">
                                                {
                                                  his.trader_class
                                                    .instructor_name
                                                }{" "}
                                                / Studio {his.trader_class.room}
                                              </span>
                                            </Text>
                                          </Col>
                                          <Col
                                            md={3}
                                            className="pr-24 text-right"
                                          >
                                            <Button
                                              type="primary"
                                              className="btn-success"
                                            >
                                              {his.trader_class.status}
                                            </Button>
                                          </Col>
                                        </Row>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <Text className="no-schedule">
                                    No Schedule available.
                                  </Text>
                                )}
                              </div>
                            );
                          })}
                        </Card>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Fragment>
            );
          }
        })}
      </div>
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

  renderCustomerList = (list) => {
    let count = 0;
    return Object.keys(list).map(function (key, index) {
      return list[key].map((cust, i) => {
        count = count + 1;
        return (
          <ul className="fm-field-repeat fm-field-repeat-block" key={i}>
            <li>
              <span>{count}</span> {cust.customer_name}
            </li>
          </ul>
        );
      });
    });
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      customerCount,
      customerDetail,
      selectedView,
      selectedHistory,
      selectedDate,
      selectedTab,
      selectedCustomer,
      selectedMembership,
      selectedClass,
      calenderView,
      vendorCalenderBookingList,
      memberships,
    } = this.state;

    return (
      <Layout className="event-booking-profile-wrap profile-vendor-fitness-m3">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab  employee-dashborad-box profile-fitness-vendor-dashbord"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                {/* <div className="top-head-section manager-page">
                  <div className="left">
                    <Title level={2}>My Bookings</Title>
                  </div>
                  <div className="right">
                    <Button
                      className="orange-btn"
                      onClick={() => this.props.history.push("/dashboard")}
                    >
                      My Dashboard
                    </Button>
                  </div>
                </div> */}
                <div className="profile-content-box">
                  <Row gutter={0}>
                    <Col xs={24} md={20} lg={24} xl={24}>
                      <div className="heading-search-block">
                        <div className="header-serch-tab-block">
                          <div className="heading-text">
                            <Button
                              className="orange-btn"
                              onClick={() =>
                                this.props.history.push("/dashboard")
                              }
                            >
                              My Dashboard
                            </Button>
                          </div>
                          <div className="right btn-right-block active-tab">
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
                  <div className="search-block">
                    <Input
                      placeholder="Search Bookings"
                      prefix={
                        <SearchOutlined className="site-form-item-icon" />
                      }
                      onChange={this.handleBookingPageChange}
                    />
                  </div>
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
                        {selectedTab === 1 ? (
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={12}
                            xl={12}
                            align="right"
                            className="calend-icon"
                          >
                            <div className="fm-list-icons">
                              <span
                                className="fm-cl-icon pr-5"
                                onClick={() =>
                                  this.setState({ selectedView: 1 })
                                }
                              >
                                <img
                                  src={require("../../../../../assets/images/icons/calendar-icon.svg")}
                                  alt="Calendar"
                                />
                              </span>
                              <span
                                className="fm-list-icon"
                                onClick={() =>
                                  this.setState({ selectedView: 2 })
                                }
                              >
                                <img
                                  src={require("../../../../../assets/images/icons/list-icon.svg")}
                                  alt="List"
                                />
                              </span>
                            </div>
                          </Col>
                        ) : (
                          ""
                        )}
                        <Tabs onChange={this.onTabChange} defaultActiveKey="1">
                          {/* <TabPane tab="Bookings" key="1">
                            {this.renderMyBooking()}
                          </TabPane> */}
                          <TabPane tab="Class" key="1" className="class-tab">
                            {this.renderClasses()}

                            <div className="card-header-select">
                              <label>Show:</label>
                              <Select
                                onChange={(e) =>
                                  // this.setState({ calendarView: e })
                                  this.onChangeBookingClassalenderView(e)
                                }
                                defaultValue="Week"
                                dropdownClassName="filter-dropdown"
                              >
                                <Option value="today">Today</Option>
                                <Option value="week">Week</Option>
                                <Option value="month">Month</Option>
                              </Select>
                            </div>
                          </TabPane>
                          <TabPane tab="Membership" key="2">
                            <div className="membership-tab">
                              {/* {this.renderMembershipList()} */}

                              <div className="membership-wrapper">
                                {memberships &&
                                  memberships.map((val, i) => {
                                    const {
                                      customer,
                                      fitness_class_subscriptions,
                                    } = val && val;
                                    // calculate difference week from start date & expiry date
                                    const date1 = val.available_from;
                                    const date2 = val.available_to;
                                    const diffTime = Math.abs(date2 - date1);
                                    const diffWeek = Math.ceil(
                                      diffTime / (7 * 24 * 60 * 60 * 1000)
                                    );

                                    return (
                                      <div
                                        key={i}
                                        className={`membership-row ${
                                          this.state.classExpandMember_Id ===
                                          val.id
                                            ? "expanded"
                                            : ""
                                        } `}
                                      >
                                        <Row
                                          gutter={(20, 20)}
                                          className="membership-content"
                                        >
                                          <Col xs={24} md={15} lg={15} xl={15}>
                                            <div className="membership-name-col">
                                              <div className="name">
                                                {" "}
                                                {val.name}{" "}
                                              </div>
                                              <div className="description">
                                                {val.detail}
                                              </div>
                                            </div>
                                          </Col>
                                          <Col xs={24} md={6} lg={6} xl={6}>
                                            <div className="duration-col">
                                              <label>
                                                {" "}
                                                {diffWeek && diffWeek}x/week
                                              </label>
                                              <label> {val.duration}</label>
                                            </div>
                                          </Col>
                                          <Col
                                            xs={24}
                                            md={3}
                                            lg={3}
                                            xl={3}
                                            className="price-user-col"
                                          >
                                            <label className="price">
                                              AU$ {val.total}{" "}
                                            </label>
                                            <div className="user-col">
                                              <div className="user-thumb">
                                                <svg
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 14 14"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14Z"
                                                    fill="#90A8BE"
                                                  />
                                                  <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M5.14114 5.04276C5.1458 3.92535 5.90232 3.11594 6.94558 3.11231C8.02565 3.1092 8.77388 3.93831 8.76454 5.12987C8.75573 6.23794 7.98002 7.04476 6.93417 7.03543C5.87484 7.02557 5.13647 6.20528 5.14114 5.04276Z"
                                                    fill="white"
                                                  />
                                                  <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M6.90342 10.0559C6.06497 10.0564 5.22601 10.0476 4.38756 10.0606C4.05416 10.0652 3.77519 9.99159 3.66008 9.65559C3.54601 9.32426 3.76431 9.1013 4.00179 8.93848C5.55008 7.87396 7.19794 7.63337 8.94845 8.38885C9.33216 8.55426 9.71482 8.729 10.0197 9.03337C10.2095 9.22263 10.3526 9.42537 10.2287 9.70019C10.1136 9.95426 9.90408 10.0606 9.62045 10.0585C8.71512 10.0512 7.80927 10.0559 6.90342 10.0559Z"
                                                    fill="white"
                                                  />
                                                </svg>
                                              </div>
                                              <label className="label">
                                                {
                                                  fitness_class_subscriptions.length
                                                }{" "}
                                                / {val.class_count}{" "}
                                              </label>
                                            </div>
                                          </Col>
                                        </Row>
                                        {this.state.classExpandMember ? (
                                          this.state.classExpandMember_Id ===
                                            val.id && (
                                            <button
                                              className="view-all-btn"
                                              onClick={() =>
                                                this.setState({
                                                  classExpandMember:
                                                    !this.state
                                                      .classExpandMember,
                                                  classExpandMember_Id: val.id,
                                                  classExpandMemberCustomer: false,
                                                })
                                              }
                                            >
                                              {" "}
                                              Hide{" "}
                                            </button>
                                          )
                                        ) : (
                                          <button
                                            className="view-all-btn"
                                            onClick={() =>
                                              this.setState({
                                                classExpandMember:
                                                  !this.state.classExpandMember,
                                                classExpandMember_Id: val.id,
                                                classExpandMemberCustomer: false,
                                              })
                                            }
                                          >
                                            {" "}
                                            View All Members{" "}
                                          </button>
                                        )}
                                        {this.state.classExpandMember_Id ===
                                          val.id && (
                                          <div
                                            className="user-list-wrapper"
                                            style={{
                                              display: this.state
                                                .classExpandMember
                                                ? "block"
                                                : "none",
                                            }}
                                          >
                                            <ul className="user-list">
                                              {fitness_class_subscriptions.map(
                                                (res, i) => {
                                                  const { customer, end_date } =
                                                    res && res;
                                                  return (
                                                    <li
                                                      className="expanded"
                                                      key={i}
                                                    >
                                                      <Row>
                                                        <Col
                                                          xs={24}
                                                          md={12}
                                                          lg={12}
                                                          xl={12}
                                                        >
                                                          <label className="name">
                                                            {res.name}
                                                          </label>
                                                        </Col>
                                                        <Col
                                                          xs={24}
                                                          md={12}
                                                          lg={12}
                                                          xl={12}
                                                        >
                                                          <label className="expiry-date">
                                                            <span>
                                                              Expiry Date:
                                                            </span>
                                                            <span className="date">
                                                              {end_date.date}
                                                            </span>
                                                            {end_date.date <
                                                            new Date() ? (
                                                              <span className="expired-label">
                                                                Expired
                                                              </span>
                                                            ) : null}
                                                          </label>
                                                          <div className="delete-btn">
                                                            <img
                                                              src={require("../../../../../assets/images/icons/delete-gray.svg")}
                                                            />
                                                            <label
                                                              className="name"
                                                              onClick={() =>
                                                                this.setState({
                                                                  classExpandMemberCustomer:
                                                                    !this.state
                                                                      .classExpandMemberCustomer,
                                                                  classExpandMemberCustomer_Id:
                                                                    res.id,
                                                                })
                                                              }
                                                            >
                                                              Expand here
                                                            </label>
                                                          </div>
                                                        </Col>
                                                      </Row>

                                                      {this.state
                                                        .classExpandMemberCustomer_Id ===
                                                        res.id && (
                                                        <Row
                                                          className="user-other-details"
                                                          style={{
                                                            display: this.state
                                                              .classExpandMemberCustomer
                                                              ? "flex"
                                                              : "none",
                                                          }}
                                                        >
                                                          <Col
                                                            xs={24}
                                                            md={12}
                                                            lg={12}
                                                            xl={12}
                                                          >
                                                            <div className="email-wrapper">
                                                              <label>
                                                                Email Address:
                                                              </label>
                                                              <span>
                                                                {" "}
                                                                {
                                                                  customer.email
                                                                }{" "}
                                                              </span>
                                                            </div>
                                                            <div className="phone-wrapper">
                                                              <label>
                                                                Phone Number:
                                                              </label>
                                                              <span>
                                                                {" "}
                                                                {
                                                                  customer.mobile_no
                                                                }{" "}
                                                              </span>
                                                            </div>
                                                          </Col>
                                                          <Col
                                                            xs={24}
                                                            md={12}
                                                            lg={12}
                                                            xl={12}
                                                          >
                                                            <div className="member-wrapper">
                                                              <label>
                                                                Member No.
                                                              </label>
                                                              <span>
                                                                {" "}
                                                                {
                                                                  customer.id
                                                                }{" "}
                                                              </span>
                                                            </div>
                                                            <div className="payment-wrapper">
                                                              <label>
                                                                Payment Status:
                                                              </label>
                                                              <span>
                                                                {" "}
                                                                {
                                                                  customer.payment_status
                                                                }
                                                              </span>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      )}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </TabPane>
                          {/* <TabPane tab="History" key="3">
                            {this.renderHistoryList()}
                          </TabPane> */}
                        </Tabs>
                      </Card>
                    </Col>
                    {/* {selectedView === 2 && ( */}
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
                              {/* <Option value="This year">This year</Option> */}
                            </Select>
                          </div>
                        </div>
                        {calenderView === "week" ? (
                          this.renderCalender()
                        ) : (
                          <Calendar
                            defaultValue={moment(selectedDate)}
                            format={"YYYY-MM-DD"}
                            onSelect={(e) => {
                              let selectedDate = moment(e).format("YYYY-MM-DD");
                              this.setState({ selectedDate }, () => {
                                this.getScheduleData();
                              });
                            }}
                            fullscreen={false}
                            // selectedDate={moment(selectedDate, 'ddd,DD MMM')}
                            dateCellRender={this.dateCellRender}
                          />
                        )}
                      </div>
                      <div className="appointments-slot mt-20">
                        <div className="appointments-heading">
                          <div className="date">
                            {moment(this.state.selectedBookingDate).format(
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
                    {/* // )} */}

                    {selectedView === 1 && selectedCustomer ? (
                      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div className="your-order-block membership-detail-box membership-m3-detail-box">
                          <h4 className="mb-0">Membership Details</h4>
                          <Row className="profil-member-no">
                            <Col md={18} className="profile-name-pic-detail">
                              {/* <img alt="test"
                              src={blankCheck(selectedCustomer.image_thumbnail)}
                             
                            // src={require('../../../../../assets/images/avatar3.png')}
                            /> */}
                              <Avatar
                                size={24}
                                src={blankCheck(
                                  selectedCustomer.image_thumbnail
                                )}
                              />
                              <div className="profile-name ml-5">
                                {blankCheck(selectedCustomer.name)}
                              </div>
                            </Col>
                            <Col md={6} className="profile-name">
                              <div className="gray-dark"> Member No. </div>
                              <div className="lht-dark">
                                <span className="blue-text">
                                  {blankCheck(selectedCustomer.id)}
                                </span>
                              </div>
                            </Col>
                          </Row>

                          <div className="order-detail">
                            <div className="order-name gray-dark">
                              Email Address
                            </div>
                            <div className="order-proce lht-dark">
                              <span className="blue-text">
                                {" "}
                                {blankCheck(selectedCustomer.email)}
                              </span>
                            </div>

                            <div className="">
                              <div className="order-name gray-dark">
                                Phone No:
                              </div>
                              <div className="order-proce lht-dark">
                                <span className="blue-text">
                                  {" "}
                                  {blankCheck(selectedCustomer.phonecode)}{" "}
                                  {blankCheck(selectedCustomer.mobile_no)}
                                </span>
                              </div>
                            </div>

                            <div className="">
                              <div className="item gray-dark">
                                Payment Status
                              </div>
                              <div className="amount lht-dark">
                                {blankCheck(selectedMembership.status)}{" "}
                              </div>
                            </div>
                            <div className="">
                              <div className="item gray-dark">Expiry date</div>
                              <div className="amount lht-dark">
                                {blankCheck(selectedMembership.expiry_date)}{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}
                    {selectedView === 1 && selectedClass ? (
                      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div className="your-order-block booking-right-block">
                          <h4> My Booking Class</h4>
                          <div className="body-pad">
                            <Row gutter={0}>
                              <Col md={21}>
                                <Row gutter={0}>
                                  <Col md={24}>
                                    <div>
                                      <h5>Today, {selectedDate}</h5>
                                      {/* {moment(selectedClass.start_time, "HH:mm:ss").format("hh:mm A")} <br />
                            <span className=" blue-text">{selectedClass.duration}</span> */}
                                    </div>
                                  </Col>
                                  <Col md={24}>
                                    <Text>
                                      <div className="gray-dark">
                                        {moment(
                                          selectedClass.start_time,
                                          "HH:mm:ss"
                                        ).format("hh:mm A")}{" "}
                                      </div>
                                      <div className="lht-dark">
                                        <span className=" blue-text">
                                          {selectedClass.duration}
                                        </span>
                                      </div>
                                    </Text>
                                  </Col>
                                  <Col md={24}>
                                    <div className="gray-dark">
                                      {selectedClass.trader_class.class_name}
                                    </div>
                                    <div className="lht-dark">
                                      <span className=" blue-text">
                                        {
                                          selectedClass.trader_class
                                            .instructor_name
                                        }{" "}
                                        / Studio{" "}
                                        {selectedClass.trader_class.room}
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md={3}>
                                <div className="order-total">
                                  <div className="user-ratio-block">
                                    <div className="user-icon">
                                      <img
                                        src={require("../../../../../assets/images/icons/user-small-icon.svg")}
                                        alt="user-small-icon"
                                      />
                                    </div>
                                    <div className="ratio-value">
                                      <Text>
                                        {selectedClass.trader_class.capacity}
                                        &nbsp;/&nbsp;
                                        {
                                          selectedClass
                                            .active_fitness_class_subscriptions
                                            .length
                                        }
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                                <div className="order-total order-total-list">
                                  {selectedClass.active_fitness_class_subscriptions.map(
                                    (cust, index) => {
                                      return (
                                        <ul className="fm-field-repeat">
                                          <li>
                                            <span>{index + 1}</span> {cust.name}
                                          </li>
                                        </ul>
                                      );
                                    }
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}

                    {selectedView === 1 && selectedHistory ? (
                      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div className="your-order-block booking-right-block">
                          <h4> My Booking Class</h4>
                          <div className="body-pad">
                            <Row gutter={0}>
                              <Col md={21}>
                                <Row gutter={0}>
                                  <Col md={24}>
                                    <h5>
                                      {moment(
                                        customerDetail.created_at,
                                        "DD-MM-YYYY"
                                      ).format("dddd,DD MMM")}
                                      {/* {selectedHistory.status} */}
                                    </h5>
                                  </Col>

                                  <Col md={24}>
                                    <Text>
                                      <div className="gray-dark">
                                        <span>
                                          {moment(
                                            selectedHistory.start_time,
                                            "HH:mm:ss"
                                          ).format("hh:mm A")}{" "}
                                          -{" "}
                                          {moment(
                                            selectedHistory.end_time,
                                            "HH:mm:ss"
                                          ).format("hh:mm A")}
                                        </span>
                                      </div>
                                      <div className="lht-dark">
                                        <span className=" blue-text">
                                          {selectedHistory.duration} min
                                        </span>
                                      </div>
                                    </Text>
                                  </Col>
                                  <Col md={24}>
                                    <Text>
                                      <div className="gray-dark">
                                        {
                                          selectedHistory.trader_class
                                            .class_name
                                        }
                                      </div>
                                      <div className="lht-dark">
                                        <span className=" blue-text">
                                          {
                                            selectedHistory.trader_class
                                              .instructor_name
                                          }{" "}
                                          / Studio{" "}
                                          {selectedHistory.trader_class.room}
                                        </span>
                                      </div>
                                    </Text>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md={3}>
                                <div className="order-total">
                                  <div className="user-ratio-block">
                                    <div className="user-icon">
                                      <img
                                        src={require("../../../../../assets/images/icons/user-small-icon.svg")}
                                        alt="user-small-icon"
                                      />
                                    </div>
                                    <div className="ratio-value">
                                      <Text>
                                        {selectedHistory.trader_class.capacity}
                                        &nbsp;/&nbsp;
                                        {customerCount}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              </Col>

                              <div className="order-total ">
                                {this.renderCustomerList(
                                  selectedHistory.customerClassBooking
                                )}
                              </div>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    ) : (
                      ""
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
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
  };
};
export default connect(mapStateToProps, {
  getFitnessMemberShipBookings,
  listCustomerServiceBookings,
  listCustomerBookingsHistory,
  enableLoading,
  disableLoading,
  getCustomerMyBookingsCalender,
  getFitnessClassListing,
  getFitnessScheduleBookings,
  getFitnessBookingsHistory,
  listTraderCustomersOfBookedClasses,
  getFitnessMemberShipListing,
})(ProfileVendorFitness);
