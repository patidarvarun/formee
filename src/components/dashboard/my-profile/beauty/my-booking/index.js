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
  Modal,
  Radio,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  CaretDownOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  DeleteFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getCustomerMyBookingsCalender,
  listCustomerBeautyServiceBookings,
  beautyServiceBookingsRating,
  listCustomerBeautyServiceBookingsHistory,
  deleteEventHistoryBooking,
  beautyDeletebookingHistory,
} from "../../../../../actions";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import "./mybooking.less";
import {
  displayDateTimeFormate,
  convertTime24To12Hour,
  displayCalenderDate,
  displayDate,
} from "../../../../../components/common";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import Icon from "../../../../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from "../../../../../config/Config";
import { langs } from "../../../../../config/localization";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../../config/FormValidation";
import moment from "moment";
import { Calendar, Badge } from "antd";

import { toastr } from "react-redux-toastr";
import { BOOKING_LIST, BOOKING_HISTORY } from "./static_reponse";
import {
  getStatusColor,
  checkBookingForFutureDate,
} from "../../../../../config/Helper";
import PDFInvoiceModal from "../../../../common/PDFInvoiceModal";
import LeaveReviewModel from "../../../../booking/common/LeaveReviewModel";

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

class MyBookings extends React.Component {
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
      customerBookingList: [],
      page: "1",
      order: "desc",
      page_size: PAGE_SIZE.PAGE_SIZE_12,
      customer_id: "",
      key: 1,
      customerBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      customerCalenderBookingList: [],
      totalRecordCustomerServiceBooking: 0,
      totalRecordCustomerSpaBookingHistory: 0,
      weeklyDates: [],
      calenderView: "month",
      // monthStart: '',
      // monthEnd: '',
      // weekStart: '',
      // weekEnd: '',
      monthStart: moment().startOf("month").format("YYYY-MM-DD"),
      monthEnd: moment().endOf("month").format("YYYY-MM-DD"),
      weekStart: moment().startOf("week").format("YYYY-MM-DD"),
      weekEnd: moment().endOf("week").format("YYYY-MM-DD"),
      index: "",
      customerRating: "",
      showReviewModal: false,
      bookingListCalenderView: "week",
      serviceBookingIdForReview: "",
      selectedBookingId: "",
      activeTab: "1",
      historyView: "newest",
      showMoreUpcommingBookings: false,
      showMoreHistoryBookings: false,
      searchKeyword: this.props.searchKeyword,
      selectedHistoryBookingId: "",
      selectedHistoryBookingDetail: "",
      receiptModalEventBooking: false,
      confirmDeleteBooking: false,
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
    this.createWeekCalender();
  }

  componentWillReceiveProps(nextProps) {
    const { activeTab } = this.state;
    if (this.state.searchKeyword != nextProps.searchKeyword) {
      this.setState(
        {
          searchKeyword: nextProps.searchKeyword,
          page: "1",
          customerBookingList: [],
          totalRecordCustomerServiceBooking: 0,
          customerBookingHistoryList: [],
          totalRecordCustomerSpaBookingHistory: 0,
        },
        () => {
          if (activeTab == 1) {
            this.getCustomerServiceBooking(this.state.page);
          } else {
            this.getCustomerBookingHistory(1);
          }
        }
      );
    }
  }

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
    this.setState(
      {
        key: key,
        activeTab: key,
        page: "1",
        customerBookingList: [],
        totalRecordCustomerServiceBooking: 0,
        customerBookingHistoryList: [],
        totalRecordCustomerSpaBookingHistory: 0,
      },
      () => {
        this.props.onClearSearch();
        if (key == "1") {
          this.getCustomerServiceBooking(1);
        } else {
          this.getCustomerBookingHistory(1);
        }
      }
    );
  };

  getCustomerServiceBooking = (page) => {
    const { id } = this.props.loggedInUser;
    const {
      customerBookingList,
      bookingListCalenderView,
      monthStart,
      monthEnd,
      weekStart,
      weekEnd,
      searchKeyword,
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
      page: page,
      order: this.state.order,
      page_size: this.state.page_size,
      customer_id: id,
      from_date: fromDate,
      to_date: toDate,
      search: searchKeyword,
    };
    this.props.enableLoading();
    this.props.listCustomerBeautyServiceBookings(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let records = res.data.data.customer_service_bookings;
        let totalRecords = res.data.data.total_records
          ? res.data.data.total_records
          : 0;
        let newList = [...customerBookingList, ...records];
        this.setState({
          page,
          customerBookingList: newList,
          totalRecordCustomerServiceBooking: totalRecords,
          showMoreUpcommingBookings:
            newList.length < totalRecords ? true : false,
        });
      }
    });
  };

  handleBookingPageChange = (e) => {
    const { activeTab } = this.state;
    if (activeTab == "1") this.getCustomerServiceBooking(e);
    else this.getCustomerBookingHistory(e);
  };

  getCustomerBookingHistory = (page) => {
    const { id } = this.props.loggedInUser;

    const { historyView, searchKeyword, customerBookingHistoryList } =
      this.state;

    const reqData = {
      page: page,
      page_size: this.state.page_size,
      customer_id: id,
      order: historyView == "newest" ? "desc" : "asc",
      search: searchKeyword,
    };
    this.props.enableLoading();
    this.props.listCustomerBeautyServiceBookingsHistory(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let records = res.data.data.customer_service_bookings;
        let totalRecords = res.data.data.total_records
          ? res.data.data.total_records
          : 0;
        let newList = [...customerBookingHistoryList, ...records];
        this.setState({
          page,
          customerBookingHistoryList: newList,
          totalRecordCustomerSpaBookingHistory: totalRecords,
          showMoreHistoryBookings: newList.length < totalRecords ? true : false,
        });
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
    const { selectedBookingId, showMoreUpcommingBookings, page } = this.state;
    const { name, email, mobile_no } = this.props.loggedInUser;

    if (
      this.state.customerBookingList &&
      this.state.customerBookingList.length > 0
    ) {
      return (
        <Fragment>
          {this.state.customerBookingList.map((value, i) => {
            let disPlaystatus = checkBookingForFutureDate(
              value.booking_date,
              value.start_time,
              value.status
            );
            return (
              <div
                className="my-new-order-block booking-box-content"
                onClick={() => {
                  // window.location.assign(
                  //   `/beauty/customer-booking-detail/${value.id}`
                  // )
                  if (selectedBookingId === value.id) {
                    // this.setState({ selectedEnquiryId: "" });
                  } else {
                    this.setState({
                      selectedBookingId: value.id,
                      selectedBookingDetail: value,
                    });
                  }
                }}
              >
                <Row gutter={0}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={18}
                    xl={18}
                    className="booking-left"
                  >
                    <div className="odr-no">
                      <h4>{disPlaystatus}</h4>
                      <span className="pickup">
                        {value.service_sub_bookings?.length > 0
                          ? value.service_sub_bookings[0]
                              .wellbeing_trader_service?.name
                          : "N/A"}
                      </span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic">
                          <img
                            alt="test"
                            src={
                              value.trader_user.image_thumbnail
                                ? value.trader_user.image_thumbnail
                                : require("../../../../../assets/images/avatar3.png")
                            }
                          />
                        </div>
                        <div className="profile-name">
                          {value.trader_user.business_name}
                        </div>
                      </div>
                      <div className="profile-name ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 pl-25">
                        <div className="pf-rating">
                          <Text>{this.formateRating(value.trader_rating)}</Text>
                          <Rate
                            disabled
                            defaultValue={this.formateRating(
                              value.trader_rating
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <div className="fm-eventb-date">
                          <h3>Issue Date:</h3>
                          <span>
                            {moment(value.created_at).format("MMMM DD, YYYY")}
                          </span>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={18}
                        xl={17}
                        className="fm-desc-wrap pl-0"
                      >
                        <Row gutter={0}>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={16}
                            className="booking-request"
                          >
                            <div className="fm-eventb-desc">
                              <h3>Service: </h3>
                              <span className="fm-eventb-content fs-13" >
                                {value.service_sub_bookings[0].wellbeing_trader_service?value.service_sub_bookings[0].wellbeing_trader_service.name:"undefined"}

                              </span>

                              {value.id === selectedBookingId && (
                                <div>
                                  <div className="fm-eventb-desc mt-20">
                                    <Row>
                                      <Col className="ant-col-lg-12 ant-col-xl-12">
                                        <h3>Duration: </h3>
                                        <span className="fm-eventb-content">
                                          {value.duration} mins
                                        </span>
                                      </Col>
                                      <Col className="ant-col-lg-12 ant-col-xl-12">
                                        <h3>Total: </h3>
                                        <span className="fm-eventb-content">
                                         
                                            AU$
                                                {value.total_amount
                                                  ? value.total_amount.toFixed(2)
                                                  : "0.0"}
                                        </span>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="fm-eventb-desc mt-20">
                                    <Row>
                                      <Col className="ant-col-lg-12 ant-col-xl-12">
                                        <h3>Contact Name: </h3>
                                        <span className="fm-eventb-content">
                                          {name}
                                        </span>
                                      </Col>
                                      <Col className="ant-col-lg-12 ant-col-xl-12">
                                        <h3>Email Address: </h3>
                                        <span className="fm-eventb-content">
                                          {email}
                                        </span>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="fm-eventb-desc mt-20">
                                    <h3>Phone Number: </h3>
                                    <span className="fm-eventb-content">
                                      {mobile_no}
                                    </span>
                                  </div>
                                  <div className="fm-eventb-desc mt-20">
                                    <h3>Special Note: </h3>
                                    <span className="fm-eventb-content">
                                      {value.additional_comments}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={6}
                    xl={6}
                    className="align-right  booking-right-section"
                  >
                    <div
                      className="bokng-time-date"
                      style={{ fontSize: "13px" }}
                    >
                      <span style={{ marginBottom: "0px" }}>
                        {moment(value.booking_date).format("MMM DD, YYYY")}
                      </span>
                      <span>{convertTime24To12Hour(value.start_time)} </span>
                    </div>
                    <div
                      className="orange-small"
                      style={{ marginBottom: "20px" }}
                    >
                      <span>
                        {value.category_name ? value.category_name : "N/A"}
                      </span>
                      <span>
                        {value.sub_category_name
                          ? value.sub_category_name
                          : "N/A"}
                      </span>
                    </div>
                    <Button
                      type="default"
                      className={getStatusColor(disPlaystatus)}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.assign(
                          `/beauty/customer-booking-detail/${value.id}`
                        );
                      }}
                    >
                      {"Edit-Booking"}
                    </Button>
                    {value.id === selectedBookingId && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <MinusCircleOutlined
                          onClick={() =>
                            this.setState({
                              selectedBookingId: "",
                              selectedBookingDetail: "",
                            })
                          }
                        />
                      </div>
                    )}
                  </Col>
                  {/* <Link to={`/spa/customer-booking-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
              </div>
            );
          })}
          {/* <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleBookingPageChange}
            total={this.state.totalRecordCustomerServiceBooking} //total number of card data available
            itemRender={paginationItemRender}
            className={"mb-20"}
          /> */}
          {showMoreUpcommingBookings && (
            <div className="show-more">
              <div
                type="default"
                size={"middle"}
                onClick={() => {
                  this.handleBookingPageChange(`${parseInt(page) + 1}`);
                }}
              >
                {"Show More"}
              </div>
            </div>
          )}
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
    const {
      showMoreHistoryBookings,
      page,
      selectedHistoryBookingId,
      selectedHistoryBookingDetail,
    } = this.state;

    console.log(
      "this.state.customerBookingHistoryList",
      this.state.customerBookingHistoryList
    );
    if (
      this.state.customerBookingHistoryList &&
      this.state.customerBookingHistoryList.length > 0
    ) {
      const menuicon = (
        <Menu>
          <Menu.Item key="0">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  if (selectedHistoryBookingId) {
                    window.location.assign(
                      `/beauty/customer-booking-history-detail/${selectedHistoryBookingDetail.id}`
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
            console.log(value,"value@@@@@@@@@@@@@@")
            return (
              <div
                className="my-new-order-block booking-box-content"
                // onClick={(e) => {
                //   e.stopPropagation();
                //   window.location.assign(
                //     `/beauty/customer-booking-history-detail/${value.id}`
                //   );
                // }}
                onClick={() => {
                  if (selectedHistoryBookingId === value.id) {
                    // this.setState({ selectedEnquiryId: "" });
                  } else {
                    this.setState({
                      selectedHistoryBookingId: value.id,
                      selectedHistoryBookingDetail: value,
                    });
                  }
                }}
              >
                <Row gutter={0}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={18}
                    xl={18}
                    className="booking-left"
                  >
                    <div className="odr-no">
                      <h4>{value.status}</h4>
                      <span className="pickup">
                        {/* {
                          value.service_sub_bookings[0].wellbeing_trader_service
                            ?.name
                        } */}
                      </span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic">
                          <img
                            alt="test"
                            src={
                              value.trader_user.image_thumbnail
                                ? value.trader_user.image_thumbnail
                                : require("../../../../../assets/images/avatar3.png")
                            }
                          />
                        </div>
                        <div className="profile-name">
                          {value.trader_user.business_name}
                        </div>
                      </div>
                      <div className="profile-name ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 pl-25">
                        <div className="pf-rating">
                          <Text>{this.formateRating(value.trader_rating)}</Text>
                          <Rate
                            disabled
                            defaultValue={this.formateRating(
                              value.trader_rating
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <div className="fm-eventb-date">
                          <h3>Date/Time:</h3>
                          <span className="fm-eventb-month">
                            {moment(value.created_at).format("MMM D, YYYY")}
                          </span>
                          <span className="fm-eventb-month">
                            {moment(value.created_at).format("hh:mm A")}
                          </span>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={18}
                        xl={17}
                        className="fm-desc-wrap pl-0"
                      >
                        <Row gutter={0}>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={16}
                            className="booking-request"
                          >
                            <div className="fm-eventb-desc">
                              <h3>Service: </h3>
                              <span className="fm-eventb-content">
                                {value.service_sub_bookings[0].wellbeing_trader_service.name}
                                
                              </span>

                              {value.id === selectedHistoryBookingId && (
                                <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                  <div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Duration: </h3>
                                          <span className="fm-eventb-content">
                                            {value.duration} mins
                                          </span>
                                        </Col>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Total: </h3>
                                          <span className="fm-eventb-content">
                                            AU$
                                            {value.total_amount +
                                              value.commission_amount +
                                              value.tax_amount}
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Contact Name: </h3>
                                          <span className="fm-eventb-content">
                                            {value.name}
                                          </span>
                                        </Col>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Email Address: </h3>
                                          <span className="fm-eventb-content">
                                            email@email.com
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Phone Number: </h3>
                                      <span className="fm-eventb-content">
                                        {value.phone_number}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Special Note: </h3>
                                      <span className="fm-eventb-content">
                                        {value.additional_comments}
                                      </span>
                                    </div>
                                    {(value.status === "Cancelled" || value.status === "Rejected" || value.status === "Declined") && (
                                        <div className="fm-eventb-desc mt-20 rejected-block">
                                          <div className="rj-head">
                                            {/* <CloseCircleOutlined />*/}
                                            <span><CloseCircleOutlined />STATUS {value.status}</span>
                                          </div>
                                          <div className="rj-text">
                                            <h5>
                                              {value.cancel_reason !== null ? value.cancel_reason : ""}
                                            </h5>
                                           {/*} <h4>Message</h4>
                                            <p>
                                              {value.cancle_comment !== null ? value.cancle_comment : ""}
                                            </p>*/}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </Col>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={6}
                    xl={6}
                    className="align-right  booking-right-section"
                  >
                    <div className="bokng-time-date spa-date fs-13">
                      <span className="mb-0">
                        {moment(value.booking_date).format("MMM D, YYYY")}
                      </span>
                      <span>
                        {convertTime24To12Hour(value.start_time)} -{" "}
                        {convertTime24To12Hour(value.end_time)}
                      </span>
                    </div>
                    {/* <div className="bokng-hsty-hour-price">
                      <div className="hour">{this.timestampToString(value.booking_date, value.start_time, true)} </div>
                      <div className="price">${value.total_amount}</div>
                    </div> */}
                    <div className="orange-small">
                      <span>
                        {value.category_name ? value.category_name : "N/A"}
                      </span>
                      <span>
                        {value.sub_category_name
                          ? value.sub_category_name
                          : "N/A"}
                      </span>
                      <div className="edit-delete-dot ml-5">
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
                    {/* {this.displayReviewRatingSection(value)} */}

                    {value.id === selectedHistoryBookingId && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <MinusCircleOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            this.setState({
                              selectedHistoryBookingId: "",
                              selectedHistoryBookingDetail: "",
                            });
                          }}
                        />
                      </div>
                    )}
                  </Col>
                  {/* <Link to={`/spa/customer-booking-history-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
              </div>
            );
          })}
          {/* <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleHistoryBookingPageChange}
            total={this.state.totalRecordCustomerSpaBookingHistory} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={"mb-20"}
          /> */}

          {showMoreHistoryBookings && (
            <div className="show-more">
              <div
                type="default"
                size={"middle"}
                onClick={() => {
                  this.handleHistoryBookingPageChange(`${parseInt(page) + 1}`);
                }}
              >
                {"Show More"}
              </div>
            </div>
          )}
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
    if (data.status === "Completed" && data.valid_trader_rating !== null) {
      return (
        <Rate
          defaultValue={
            data.valid_trader_rating.rating
              ? data.valid_trader_rating.rating
              : 0.0
          }
        />
      );
    } else if (
      data.status === "Completed" &&
      data.valid_trader_rating === null
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
          {" "}
          Review{" "}
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
      diffTime = new Date(dateString || 0).toDateString();
    }
    return diffTime;
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
            booking_type: "beauty",
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
   * @method onFinish
   * @description handle on submit
   */
  onFinishReview = (values) => {
    const { serviceBookingIdForReview } = this.state;
    const requestData = {
      service_booking_id: serviceBookingIdForReview,
      rated_by: "customer",
      title: values.review,
      rating: values.rating,
    };

    this.props.enableLoading();
    this.props.beautyServiceBookingsRating(requestData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(
          "Success",
          "Review has been submitted to vendor successfully."
        );
      }
      this.setState({ showReviewModal: false });
    });
  };

  onChangeBookingListDurationFilter = (view) => {
    const { activeTab } = this.state;
    if (activeTab == 2) {
      this.setState(
        {
          historyView: view,
        },
        () => {
          this.getCustomerBookingHistory(1);
        }
      );
    } else {
      this.setState(
        {
          bookingListCalenderView: view,
          customerBookingList: [],
          totalRecordCustomerServiceBooking: 0,
        },
        () => {
          if (this.state.key == "1") {
            this.getCustomerServiceBooking(1);
          }
        }
      );
    }
  };

  deleteBooking = () => {
    const { selectedHistoryBookingDetail } = this.state;
    const { loggedInUser } = this.props;
    console.log(`loggedInUser`, loggedInUser);
    console.log(`selectedHistoryBookingDetail`, selectedHistoryBookingDetail);
    let reqData = {
      service_booking_id: selectedHistoryBookingDetail.id,
    };
    this.props.enableLoading();
    this.props.beautyDeletebookingHistory(reqData, (res) => {
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
    const {
      selectedBookingDate,
      customerCalenderBookingList,
      calenderView,
      activeTab,
      historyView,
      bookingListCalenderView,
      receiptModalEventBooking,
      selectedHistoryBookingDetail,
      customerRating,
      showReviewModal,
      leaveReviewModal,
      confirmDeleteBooking,
    } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };

    return (
      <Layout>
        <Layout>
          {/* <AppSidebar history={history} /> */}
          <Layout>
            <div
              className="my-profile-box view-class-tab shadow-none"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                {/* <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>My Bookings</Title>
                  </div>
                  <div className='right'></div>
                </div>
                <div className='sub-head-section'>
                  <Text>&nbsp;</Text>
                </div> */}
                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking mt-0">
                  <Row className="tab-full" gutter={30}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Card
                        className="profile-content-shadow-box"
                        bordered={false}
                        title=""
                      >
                        <Tabs
                          className="tab-box"
                          onChange={this.onTabChange}
                          defaultActiveKey="1"
                        >
                          <TabPane tab="Bookings" key="1">
                            <h3 className="total-activity">
                              You have{" "}
                              {this.state.totalRecordCustomerServiceBooking}{" "}
                              activities
                            </h3>
                            {this.renderUpcomingBooking()}
                          </TabPane>
                          <TabPane tab="History" key="2">
                            <h3 className="total-activity">
                              You have{" "}
                              {this.state.totalRecordCustomerSpaBookingHistory}{" "}
                              activities
                            </h3>
                            {this.renderHistoryBooking()}
                          </TabPane>
                        </Tabs>
                        <div className="card-header-select">
                          <label>Show:</label>
                          {/* <Select
                            onChange={(e) =>
                              this.onChangeBookingListDurationFilter(e)
                            }
                            defaultValue="This week"
                          >
                            <Option value="week">This week</Option>
                            <Option value="month">This month</Option>
                            <Option value="today">Today</Option>
                          </Select> */}
                          {activeTab == 2 ? (
                            <Select
                              onChange={(e) =>
                                this.onChangeBookingListDurationFilter(e)
                              }
                              value={historyView}
                            >
                              <Option value="newest">Newest</Option>
                              <Option value="oldest">Oldest</Option>
                            </Select>
                          ) : (
                            <Select
                              onChange={(e) =>
                                this.onChangeBookingListDurationFilter(e)
                              }
                              value={bookingListCalenderView}
                            >
                              <Option value="today">Today</Option>
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                            </Select>
                          )}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            {leaveReviewModal && (
              <LeaveReviewModel
                visible={leaveReviewModal}
                onCancel={() => {
                  this.setState({ leaveReviewModal: false });
                }}
                type="Booking"
                // bookingDetail={selectedHistoryDetail && selectedHistoryDetail}
                bookingDetail={
                  // selectedHistoryBookingDetail && {
                  //   id: selectedHistoryBookingDetail.trader_user.id,
                  //   user: selectedHistoryBookingDetail.trader_user,
                  //   name: selectedHistoryBookingDetail.trader_user
                  //     .business_name,
                  //   image_thumbnail:
                  //     selectedHistoryBookingDetail.trader_user.image_thumbnail,
                  // }
                  selectedHistoryBookingDetail
                }
                
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

            {receiptModalEventBooking && (
              <PDFInvoiceModal
                visible={receiptModalEventBooking}
                onClose={() => {
                  this.setState({ receiptModalEventBooking: false });
                }}
                isViewInvoice={true}
                enquiryDetails={selectedHistoryBookingDetail}
                booking_type="beauty"
              />
            )}
            {confirmDeleteBooking && (
              <Modal
                title=""
                visible={confirmDeleteBooking}
                className={
                  "custom-modal style1 cancellation-reason-modal delete-popupbox"
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
  listCustomerBeautyServiceBookingsHistory,
  enableLoading,
  disableLoading,
  getCustomerMyBookingsCalender,
  beautyServiceBookingsRating,
  listCustomerBeautyServiceBookings,
  listCustomerBeautyServiceBookingsHistory,
  deleteEventHistoryBooking,
  beautyDeletebookingHistory,
})(MyBookings);
