import React, { Fragment } from "react";

import { Link, withRouter } from "react-router-dom";
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
  CalendarOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined,
  CloseCircleOutlined,
  DeleteFilled,

} from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getCustomerCatererEnquiry,
  getCustomerCatererEnquiryDetail,
  declineCustomerEventEnquiry,
  getCustomerCatererBookings,
  getCatererBookingDetail,
  getCustomerCatererHistoryList,
  catererJobDone,
  raiseCatererDispute,
  replyCatererDispute,
  submitCatererReview,
  eventCalendarBookings,
  postBookingsDetail,
  removeCheckoutData,
  customerServiceBookingResponse,
  declineEnquiryByCustomer,
  deleteEventHistoryBooking,
} from "../../../../../actions";
import { toastr } from "react-redux-toastr";
import {
  displayDateTimeFormate,
  displayCalenderDate,
  displayDate,
  convertTime24To12Hour,
  calculateHoursDiffBetweenDates,
} from "../../../../../components/common";
import { MESSAGES } from "../../../../../config/Message";
import "./userevent.less";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import Icon from "../../../../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from "../../../../../config/Config";
import { langs } from "../../../../../config/localization";
import DeclineModal from "../../../vendor-profiles/common-modals/DeclineModal";
import moment from "moment";
import { blankCheck } from "../../../../common";
import { getStatusColor } from "../../../../../config/Helper";
import { Calendar, Badge } from "antd";
import {
  maxLengthC,
  required,
  whiteSpace,
} from "../../../../../config/FormValidation";
import SelectDate from "./SelectDateForEvents";
import PDFInvoiceModal from "../../../../common/PDFInvoiceModal";
import LeaveReviewModel from "../../../../booking/common/LeaveReviewModel";
import BookingRescheduleModal from "../../../vendor-profiles/common-modals/BookingRescheduleModal";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  labelAlign: "left",
  colon: false,
};

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

const ENQUIRY_CANCELLATION_REASON = [
  "Date & Time not available",
  "Date not available",
  "Time not available",
  "I no longer need this service",
];

const BOOKING_CANCELLATION_REASON = [
  "I accidentally posted this job",
  "I have changed my mind",
  "I want to change the description",
  "The vendor can’t meet my requirements",
  "The vendor is not responding to my messages",
  "Job quotation is too high",
  "I am no longer available on that day",
  "I don’t feel safe while communicating with the vendor",
  "The vendor has asked me to cancel via message",
  "I have not provided enough information to the vendor",
];
class MyEventBooking extends React.Component {
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
      selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
      enquiryList: [],
      totalEnquiry: 0,
      selectedEnquiryId: "",
      selectedEnquiryDetail: "",
      selectedEnquiry: "",
      visibleDeclineModal: false,
      bookingList: [],
      historyViewDetailId:'',
      totalBookings: 0,
      selectedBookingId: "",
      selectedBookingDetail: "",
      historyList: [],
      totalHistories: 0,
      selectedHistoryId: "",
      selectedHistoryDetail: "",
      customerCalenderBookingList: [],
      calenderView: "week",
      weeklyDates: [],
      monthStart: moment().startOf("month").format("YYYY-MM-DD"),
      monthEnd: moment().endOf("month").format("YYYY-MM-DD"),
      weekStart: moment().startOf("week").format("YYYY-MM-DD"),
      weekEnd: moment().endOf("week").format("YYYY-MM-DD"),
      visibleRespondToQuoteModal: false,
      declineEnquiryModal: false,
      isOtherCancelResaon: false,
      selectedReasonForCancel: "",
      activeTab: "1",
      showEditBookingOptions: false,
      bookingCancelConfirmModal: false,
      bookingCancellationModal: false,
      showChangeDateModal: false,
      showChangeDateSuccessModal: false,
      receiptModalEventBooking: false,
      leaveReviewModal: false,
      confirmDeleteBooking: false,
      historyView: "newest",
      searchKeyword: "",
      showMoreEnquiries: false,
      showMoreBookings: false,
      showMoreHistory: false,
      checkblank: "",
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { page } = this.state;
    this.props.enableLoading();
    this.getEnquiries(page);
    this.createWeekCalender();
    this.props.removeCheckoutData();
  }

  componentWillReceiveProps(nextProps) {
    const { activeTab } = this.state;
    if (this.state.searchKeyword != nextProps.searchKeyword) {
      this.setState(
        {
          searchKeyword: nextProps.searchKeyword,
          page: "1",
          enquiryList: [],
          totalEnquiry: 0,
          bookingList: [],
          totalBookings: 0,
          historyList: [],
          totalHistories: 0,
        },
        () => {
          if (activeTab == "1") {
            this.getEnquiries(1);
          } else if (activeTab == "2") {
            this.getJobList(1);
          } else if (activeTab == "3") {
            this.getHistoryList(1);
          }
        }
      );
    }
  }

  onTabChange = (key, type) => {
    this.setState({
      activeTab: key,
      page: "1",
      enquiryList: [],
      totalEnquiry: 0,
      bookingList: [],
      totalBookings: 0,
      historyList: [],
      totalHistories: 0,
    });
    this.props.onClearSearch();
    if (key == "1") {
      this.getEnquiries(1);
    } else if (key == "2") {
      this.getJobList(1);
    } else if (key == "3") {
      this.getHistoryList(1);
    }
  };

  getDuration = () => {
    const { calenderView, monthStart, monthEnd, weekStart, weekEnd } =
      this.state;
    let fromDate, toDate;

    if (calenderView === "week") {
      fromDate = weekStart;
      toDate = weekEnd;
    } else if (calenderView === "month") {
      fromDate = monthStart;
      toDate = monthEnd;
    } else if (calenderView === "today") {
      fromDate = moment().format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    }
    return {
      fromDate,
      toDate,
    };
  };

  getEnquiries = (page) => {
    const { id } = this.props.loggedInUser;
    const { enquiryList, searchKeyword } = this.state;
    console.log(searchKeyword, "searchkeyword")
    let duration = this.getDuration();

    const reqData = {
      page: page,
      from_date: duration.fromDate,
      to_date: duration.toDate,
      page_size: this.state.page_size,
      user_id: id, //657
      search: searchKeyword,
    };
    this.props.enableLoading();
    this.props.getCustomerCatererEnquiry(reqData, (res) => {
      this.props.disableLoading();

      if (res.status === STATUS_CODES.OK) {
        let records = res.data.data.list;
        let totalRecords = res.data.data.total_records
          ? res.data.data.total_records
          : 0;
        let newList = [...enquiryList, ...records];
        this.setState({
          page: page,
          enquiryList: newList,
          totalEnquiry: totalRecords,
          showMoreEnquiries: newList.length <= totalRecords ? true : false,
          checkblank: records,
        });
      }
    });
  };



  getJobList = (page) => {
    let duration = this.getDuration();
    const { bookingList, searchKeyword } = this.state;

    const reqData = {
      page: page,
      page_size: this.state.page_size,
      from_date: duration.fromDate,
      to_date: duration.toDate,
      search: searchKeyword,
    };
    this.props.enableLoading();
    this.props.getCustomerCatererBookings(reqData, (res) => {
      this.props.disableLoading();
      //
      if (res.status === STATUS_CODES.OK) {
        // let records = res.data.data.customer_service_bookings;
        // let totalRecords = res.data.data.total_records
        //   ? res.data.data.total_records
        //   : 0;
        let records = res.data.data.list;
        let totalRecords = res.data.data.total_records
          ? res.data.data.total_records
          : 0;
        let newList = [...bookingList, ...records];
        this.setState({
          page: page,
          bookingList: newList,
          totalBookings: totalRecords,
          showMoreBookings: newList.length < totalRecords ? true : false,
          checkblank: records,
        });
      }
    });
  };

  getHistoryList = (page) => {
    console.log("getHistoryList")
    const { id } = this.props.loggedInUser;
    // let duration = this.getDuration();
    const { historyList, searchKeyword } = this.state;
    let { historyView } = this.state;

    const reqData = {
      page: page,
      // order_by: 'customer_rating',
      page_size: this.state.page_size,
      order: historyView == "newest" ? "desc" : "asc",
      user_id: id, //657
      // from_date: moment().startOf("year").format("YYYY-MM-DD"),
      // to_date: moment().endOf("year").format("YYYY-MM-DD"),
      search: searchKeyword,
    };
    console.log(`reqData`, reqData);
    this.props.getCustomerCatererHistoryList(reqData, (res) => {
      this.props.disableLoading();

      if (res.status === STATUS_CODES.OK) {
        // let records = res.data.data.customer_service_bookings;
        // let totalRecords = res.data.data.total_records
        //   ? res.data.data.total_records
        //   : 0;
        let records = res.data.data.list;
        let totalRecords = res.data.data.total_records
          ? res.data.data.total_records
          : 0;
        let newList = [...historyList, ...records];
        this.setState({
          page,
          historyList: newList,
          totalHistories: totalRecords,
          showMoreHistory: newList.length < totalRecords ? true : false,
          checkblank: records,
        });
      }
    });
  };

  handlePageChange = (e) => {
    const { activeTab, page } = this.state;

    // this.setState({ page: e });
    if (activeTab == 2) {
      this.getJobList(+page + 1);
    } else if (activeTab == 3) {
      this.getHistoryList(+page + 1);
    } else {
      this.getEnquiries(+page + 1);
    }
  };

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0;
  };

  getAllDieteris = (dietery) => {
    let dList = dietery.map((d) => d.name);
    return dList.toString();
  };

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0;
  };

  bookingDetail = (data) => {
    const test = {
      trader_user_id: data.selectedEnquiryDetail.trader_user_profile.user_id,
      name: data.selectedEnquiryDetail.name,
      phone_number: data.selectedEnquiryDetail.phone_number,
      email: data.selectedEnquiryDetail.email,
      booking_date: data.selectedEnquiryDetail.booking_date,
      start_time: data.selectedEnquiryDetail.start_time,
      end_time: data.selectedEnquiryDetail.end_time,
      additional_comments: data.selectedEnquiryDetail.additional_comments,
      no_of_people: data.selectedEnquiryDetail.no_of_people,
      time: data.selectedEnquiryDetail.time,
      venue_of_event: data.selectedEnquiryDetail.venue_of_event,
      looking_for: data.selectedEnquiryDetail.looking_for,
      dietary: data.selectedEnquiryDetail.dietary,
      cusine: data.selectedEnquiryDetail.cusines,
      event_type_id: data.selectedEnquiryDetail.event_type_id,
      other_event_type: data.selectedEnquiryDetail.other_event_type,
      price: data.selectedEnquiryDetail.quote.price,
    };
    //this.props.postBookingsDetail(test);
    this.props.postBookingsDetail(test, (res) => {
      this.props.disableLoading();

      if (res.status === STATUS_CODES.OK) {
        console.log("working postBookingsDetail API");
      }
    });
  };

  renderUpcomingEnquiries = () => {
    const { loggedInUser } = this.props;
    const {
      enquiryList,
      selectedEnquiryId,
      selectedEnquiryDetail,
      showMoreEnquiries,
      page,
    } = this.state;

    if (enquiryList.length) {
      console.log(this.state.visibleRespondToQuoteModal, "quotemodel1")
      return (
        <Fragment>
          {enquiryList.map((value, i) => {
            console.log(this.state.visibleRespondToQuoteModal, "quotemodel2")
            return (
              <div
                className="my-new-order-block booking-box-content"
                key={i}
                onClick={(e) => {
                  if (selectedEnquiryId === value.enquire_response_id) {
                    // this.setState({ selectedEnquiryId: "" });
                  } else {
                    this.props.getCustomerCatererEnquiryDetail(
                      { id: value.enquire_response_id },
                      (res) => {
                        if (res.status === STATUS_CODES.OK) {
                          this.setState({
                            selectedEnquiryId: value.enquire_response_id,
                            selectedEnquiry: value,
                            selectedEnquiryDetail: res.data.data,
                          });
                        }
                      }
                    );
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
                      <h4>
                        {" "}
                        {value.status != "Pending"
                          ? "Response received"
                          : "Enquiry"}
                      </h4>
                      <span className="pickup">{value.event_type} </span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic booking-profile">
                          <img
                            alt="test"
                            src={
                              value.image
                                ? value.image
                                : require("../../../../../assets/images/avatar3.png")
                            }
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = require("../../../../../assets/images/avatar3.png");
                            }}
                          />
                        </div>
                        <div className="profile-name">{value.title}</div>
                      </div>
                      <div className="profile-name ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 pl-25">
                        <span>{parseFloat(value.average_rating)}</span>
                        <Rate defaultValue={value.average_rating} disabled />
                      </div>
                    </div>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <div className="fm-eventb-date">
                          <h3>Date Requested:</h3>
                          <span className="fm-eventb-month">
                            {moment(value.booking_date, "YYYY-MM-DD").format(
                              "MMMM DD, yy"
                            )}
                          </span>
                          <span className="fm-eventb-time">
                            {moment(value.start_time).format("LT")}{" "}
                            - {moment(value.end_time).format("LT")}
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
                              <h3>Request:</h3>
                              <span className="fm-eventb-content">
                                {value.description}
                              </span>
                              {value.enquire_response_id ===
                                selectedEnquiryId ? (
                                <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                  <div className="">
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Venues:</h3>
                                      <span className="fm-eventb-content">
                                        {blankCheck(
                                          selectedEnquiryDetail.venue_of_event
                                        )}
                                      </span>
                                      <span className="fm-eventb-content">
                                        {blankCheck(
                                          selectedEnquiryDetail.venue_address
                                        )}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>No. of Guest:</h3>
                                      <span className="fm-eventb-content">
                                        {selectedEnquiryDetail.no_of_people}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Contact Name:</h3>
                                      <span className="fm-eventb-content">
                                        {selectedEnquiryDetail.customer.name}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Email Address:</h3>
                                      <span className="fm-eventb-content">
                                        {selectedEnquiryDetail.customer.email}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Phone Number:</h3>
                                      <span className="fm-eventb-content">
                                        {
                                          selectedEnquiryDetail.customer
                                            .mobile_no
                                        }
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Photo:</h3>
                                      <div className="fm-imgpr-wrap">
                                        {selectedEnquiryDetail.enquire_images.map(
                                          (imageObject) => {
                                            return (
                                              <img
                                                alt="test"
                                                src={
                                                  imageObject
                                                    ? imageObject.image
                                                    : require("../../../../../assets/images/pr-img2.jpg")
                                                }
                                              />
                                            );
                                          }
                                        )}
                                      </div>
                                      {(selectedEnquiryDetail.quote.status === "Cancelled" || selectedEnquiryDetail.status === "Cancelled" ) && (
                                        <div className="fm-eventb-desc mt-20 rejected-block">
                                          <div className="rj-head">
                                            <span><CloseCircleOutlined />
                                              STATUS {selectedEnquiryDetail.quote.status}</span>
                                          </div>
                                          <div className="rj-text">
                                            <h5>
                                              {selectedEnquiryDetail.reasons !== null ? selectedEnquiryDetail.reasons : "there is no reason given by user"}
                                            </h5>
                                            <h4>Message</h4>
                                            <p>
                                              {selectedEnquiryDetail.comments !== null ? selectedEnquiryDetail.comments : "there is no comment given by given"}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {(selectedEnquiryDetail.quote.status === "Rejected" || selectedEnquiryDetail.quote.status === "Declined" || selectedEnquiryDetail.status === "Rejected" || selectedEnquiryDetail.status === "Declined") && (
                                        <div className="fm-eventb-desc mt-20 rejected-block">
                                          <div className="rj-head">
                                            {/* <CloseCircleOutlined />*/}
                                            <span>STATUS {selectedEnquiryDetail.quote.status}</span>
                                          </div>
                                          <div className="rj-text">
                                            <h3>
                                              {selectedEnquiryDetail.reasons !== null ? selectedEnquiryDetail.reasons : "there is no reason given by user"}
                                            </h3>
                                            <h4>Message</h4>
                                            <p>
                                              {selectedEnquiryDetail.comments !== null ? selectedEnquiryDetail.comments : "there is no comment given by given"}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {/* <div className="fm-eventb-btn mt-20">
                                  {value.status === "Pending" && (
                                    <Button
                                      type="default"
                                      className="fm-orng-outline-btn mr-15"
                                      onClick={() => {
                                        this.props.declineCustomerEventEnquiry(
                                          {
                                            reason:
                                              "I have accidentally posted it.",
                                            enquire_response_id:
                                              selectedEnquiryId,
                                            status: "Quotation Declined",
                                          },
                                          (res) => {
                                            if (
                                              res.status === STATUS_CODES.OK
                                            ) {
                                              toastr.success(
                                                langs.success,
                                                res.data.quote_message
                                              );
                                              this.getEnquiries(1);
                                            }
                                          }
                                        );
                                      }}
                                    >
                                      Decline
                                    </Button>
                                  )}
                                  <Button
                                    onClick={(e) => {
                                      {
                                        this.bookingDetail(this.state);
                                      }
                                      e.stopPropagation();

                                      return this.props.history.push({
                                        pathname: `/booking-checkout`,
                                        state: {
                                          amount: parseFloat(
                                            selectedEnquiryDetail.price
                                          ),
                                          trader_user_id:
                                            selectedEnquiryDetail
                                              .trader_user_profile.user_id,
                                          customerId: loggedInUser.id,
                                          selectedEnquiryId:
                                            selectedEnquiryDetail.event_type_id,
                                          customer_name: loggedInUser.name,
                                          payment_type: "firstpay",
                                          booking_type: "event",
                                        },
                                      });
                                    }}
                                    type="default"
                                    className="fm-orng-btn"
                                  >
                                    Book Now
                                  </Button>
                                </div> */}
                                  </div>
                                </Col>
                              ) : (
                                ""
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
                    className="align-right booking-right-section"
                  >
                    <div className="bokng-hsty-hour-price">
                      <span className="fm-eventb-month date-time-new">
                        {moment(value.created_at, "YYYY-MM-DD").format(
                          "DD / MM / YYYY"
                        )}
                      </span>
                      <div className="price mt-5 fs-25">
                        {value.price ? `AU${value.price}.00` : `AU$ 00.00`}
                      </div>
                    </div>
                    <Row>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={16}
                        xl={8}
                        className="align-right self-flex-end mt-5"
                      >
                        <div className="category-name fs-12 mr-0">
                          {value.category_name}
                          {value.subcategory_name
                            ? ` | ${value.subcategory_name}`
                            : ""}
                        </div>
                      </Col>
                    </Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={16}
                      xl={8}
                      className="align-right self-flex-end"
                    >
                      {value.enquire_response_id === selectedEnquiryId &&
                        //(value.status == "Accepted" || value.status == "Quote Sent")
                        (value.status == "Quote Sent" && value.eb_status == null) ? (
                        <>

                          <Button
                            type="default"
                            className={getStatusColor(value.status)}
                            onClick={() =>
                              this.setState({
                                visibleRespondToQuoteModal: true,
                              })
                            }
                          >
                            Respond to Quote
                          </Button>
                        </>
                      ) : value.status == "Quote Sent" &&
                        value.eb_status == "Amount-Paid-Pending"
                        ? (
                          <Button
                            type="default"
                            className={getStatusColor(value.status)}
                          //  className='success-btn'
                          >
                            Pending Confirm
                          </Button>
                        ) : (
                          <Button
                            type="default"
                            className={getStatusColor(value.status)}
                          //  className='success-btn'
                          >
                            {value.status == "Quote Sent"
                              ? "Respond to Quote"
                              : value.status === "accepted"
                                ? "reply"
                                : value.status}

                          </Button>
                        )}
                    </Col>
                  </Col>
                </Row>

                {value.enquire_response_id === selectedEnquiryId && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <MinusCircleOutlined
                      onClick={() => this.setState({ selectedEnquiryId: "" })}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {this.state.checkblank.length >= 10 ? (
            <div className="show-more">
              <a onClick={(e) => this.handlePageChange(e)}
                className="show-more">

                Show More
              </a>
            </div>
          ) : ""}
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

  renderUpcomingBookings = () => {
    const {
      bookingList,
      totalBookings,
      selectedBookingId,
      selectedBookingDetail,
      checkblank
    } = this.state;

    if (bookingList.length) {
      return (
        <Fragment>
          {bookingList.map((value, i) => {
            return (
              <div
                className="my-new-order-block booking-box-content "
                key={value.event_booking_id}
                onClick={() => {
                  // this.setState({
                  //   selectedBookingId: value.event_booking_id,
                  // });
                  if (selectedBookingId !== value.event_booking_id) {
                    this.props.getCatererBookingDetail(
                      { id: value.event_booking_id },
                      (res) => {
                        console.log(`res`, res);
                        console.log(`res.data.data`, res.data.data);
                        if (res.status === STATUS_CODES.OK) {
                          let transformedDetail = res.data.data;
                          transformedDetail.date =
                            transformedDetail.booking_date;
                          transformedDetail.to = transformedDetail.end_time;
                          transformedDetail.from = transformedDetail.start_time;
                          this.setState({
                            selectedBookingId: value.event_booking_id,
                            selectedBookingDetail: transformedDetail,
                          });
                        }
                      }
                    );
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
                      <h4>Upcoming</h4>
                      <span className="pickup">{value.event_type}</span>
                    </div>
                    <div className="order-profile booking-pro mb-5">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic booking-profile">
                          <img
                            alt="test"
                            src={
                              value.image
                                ? value.image
                                : require("../../../../../assets/images/avatar3.png")
                            }
                          />
                        </div>
                        <div className="profile-name">{value.title}</div>
                      </div>
                      <div className="profile-name ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 pl-25 ">
                        <span> {parseFloat(value.rating_count)}</span>
                        <Rate defaultValue={value.rating_count} disabled />
                      </div>
                    </div>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                            <div className="fm-eventb-date">
                              <h3>Date Requested:</h3>
                              <span className="fm-eventb-month">
                                {value.created_at
                                  ? moment(
                                    value.created_at,
                                    "YYYY-MM-DD"
                                  ).format("MMMM DD, yy")
                                  : ""}
                              </span>
                              <span className="fm-eventb-time">
                                {moment(value.start_time, "hh:mm:ss").format(
                                  "LT"
                                )}{" "}
                                -{" "}
                                {moment(value.end_time, "hh:mm:ss").format(
                                  "LT"
                                )}
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
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
                                  <h3>Request:</h3>
                                  <span className="fm-eventb-content">
                                    {value.description}
                                  </span>
                                  {value.event_booking_id ===
                                    selectedBookingId ? (
                                    <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                      <div className="">
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Venues:</h3>
                                          <span className="fm-eventb-content">
                                            {blankCheck(
                                              selectedBookingDetail.venue_of_event
                                            )}
                                          </span>
                                          <span className="fm-eventb-content">
                                            {blankCheck(
                                              selectedBookingDetail.venue_address
                                            )}
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>No. of Guest:</h3>
                                          <span className="fm-eventb-content">
                                            {selectedBookingDetail.no_of_people}
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Contact Name:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedBookingDetail.customer
                                                .name
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Email Address:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedBookingDetail.customer
                                                .email
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Phone Number:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedBookingDetail.customer
                                                .mobile_no
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Photo:</h3>
                                          <div className="fm-imgpr-wrap">
                                            {selectedBookingDetail.booking_enquiry_images.map(
                                              (imageObject) => {
                                                return (
                                                  <img
                                                    alt="test"
                                                    src={
                                                      imageObject
                                                        ? imageObject.image
                                                        : require("../../../../../assets/images/pr-img2.jpg")
                                                    }
                                                  />
                                                );
                                              }
                                            )}
                                          </div>

                                        </div>
                                      </div>
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Col>
                            </Row>
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
                    className="align-right booking-right-section"
                  >
                    <div className="bokng-hsty-hour-price">
                      <div className="date-time-new fs-12 mb-0">
                        {moment(value.booking_date, "YYYY-MM-DD").format(
                          " MMM DD, YYYY"
                        )}
                      </div>
                      <div className="date-time-new fs-12 ">
                        {moment(value.start_time, "hh:mm:ss").format("LT")} -{" "}
                        {moment(value.end_time, "hh:mm:ss").format("LT")}
                      </div>
                      {/* <div className="price ">{(value.price) ? `AU$${value.price}.00` : `AU$0.00`}</div> */}
                    </div>
                    <Row>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={16}
                        xl={8}
                        className="align-right self-flex-end mt-5"
                      >
                        <div className="category-name fs-12 mr-0">
                          {value.category_name}
                          {value.subcategory_name
                            ? ` | ${value.subcategory_name}`
                            : ""}
                        </div>
                      </Col>
                    </Row>
                    <Col
                      // xs={24}
                      // sm={24}
                      // md={24}
                      // lg={10}
                      // xl={8}
                      className="align-right self-flex-end "
                    >
                      {/* {this.displayReviewRatingSection(value)} */}
                      {/* className="fm-btndeleteicon" */}
                      <span>
                        <Button
                          type="default"
                          className="edit-btn"
                          // className={getStatusColor(value.status)}
                          onClick={() => {
                            this.setState({
                              showEditBookingOptions: true,
                            });
                          }}
                        >
                          Edit Booking
                        </Button>
                      </span>
                    </Col>
                  </Col>
                </Row>

                {value.event_booking_id === selectedBookingId && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <MinusCircleOutlined
                      onClick={() => this.setState({ selectedBookingId: "" })}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {this.state.checkblank.length >= 10 ? (
            <div className="show-more">
              <a onClick={(e) => this.handlePageChange(e)}
                className="show-more">

                {"Show More"}
              </a>
            </div>
          ) : ""}
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
      historyList,
      selectedHistoryId,
      selectedHistoryDetail,
      showMoreHistory,
      page,
      historyViewDetailId,
     
    } = this.state;
    console.log("value.status");
    console.log(historyList);
    if (historyList && historyList.length > 0) {
      const menuicon = (
        <Menu>
          <Menu.Item key="0">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={() => {
                  if (historyViewDetailId)
                    this.props.history.push({
                      pathname: `/my-bookings/event-booking-details/${historyViewDetailId}`,
                      state: {
                        hideCheckout: true,
                        booking_type: "event",
                      },
                    });
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
          {historyList.map((value, i) => {
            return (
              <div
                className="my-new-order-block booking-box-content "
                key={i}
                onClick={() => {
                  if (selectedHistoryId === value.event_booking_id) {
                    // this.setState({ selectedHistoryId: "" });
                  } else {
                    this.props.getCatererBookingDetail(
                      { id: value.event_booking_id },
                      (res) => {
                        if (res.status === STATUS_CODES.OK) {
                          this.setState({
                            selectedHistoryId: value.event_booking_id,
                            selectedHistoryDetail: res.data.data,
                            historyViewDetailId: value.enquiry_id,
                          });
                        }
                      }
                    );
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
                      <h4>History</h4>
                      <span className="pickup">{value.event_type}</span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic booking-profile">
                          <img
                            alt="test"
                            src={
                              value.service_image
                                ? value.service_image
                                : require("../../../../../assets/images/avatar3.png")
                            }
                          />
                        </div>
                        <div className="profile-name">{value.title}</div>
                      </div>
                      <div className="profile-name ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 pl-25">
                        <span>{parseFloat(value.average_rating)}</span>
                        <Rate defaultValue={value.average_rating} disabled />
                      </div>
                    </div>

                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                            <div className="fm-eventb-date">
                              <h3>Date Requested</h3>
                              <span className="fm-eventb-month">
                                {moment(
                                  value.booking_date,
                                  "YYYY-MM-DD"
                                ).format("MMMM DD, YYYY")}
                              </span>
                              <span className="fm-eventb-time">
                                {moment(value.start_time, "hh:mm:ss").format(
                                  "LT"
                                )}{" "}
                                -{" "}
                                {moment(value.end_time, "hh:mm:ss").format(
                                  "LT"
                                )}
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
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
                                  <h3>Request:</h3>
                                  <span className="fm-eventb-content">
                                    {value.description}
                                  </span>
                                  {value.event_booking_id ===
                                    selectedHistoryId ? (
                                    <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                      <div className="">
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Venues:</h3>
                                          <span className="fm-eventb-content">
                                            {blankCheck(
                                              selectedHistoryDetail.venue_of_event
                                            )}
                                          </span>
                                          <span className="fm-eventb-content">
                                            {blankCheck(
                                              selectedHistoryDetail.venue_address
                                            )}
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>No. of Guest:</h3>
                                          <span className="fm-eventb-content">
                                            {selectedHistoryDetail.no_of_people}
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Contact Name:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedHistoryDetail.customer
                                                .name
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Email Address:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedHistoryDetail.customer
                                                .email
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Phone Number:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedHistoryDetail.customer
                                                .mobile_no
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Photo:</h3>
                                          <div className="fm-imgpr-wrap">
                                            {selectedHistoryDetail.booking_enquiry_images.map(
                                              (imageObject) => {
                                                return (
                                                  <img
                                                    alt="test"
                                                    src={
                                                      imageObject
                                                        ? imageObject.image
                                                        : require("../../../../../assets/images/pr-img2.jpg")
                                                    }
                                                  />
                                                );
                                              }
                                            )}
                                          </div>
                                          {(selectedHistoryDetail.status === "Cancelled") && (
                                            <div className="fm-eventb-desc mt-20 rejected-block">
                                              <div className="rj-head">

                                                <span> <CloseCircleOutlined />STATUS {selectedHistoryDetail.status}</span>
                                              </div>
                                              <div className="rj-text">
                                                <h3>
                                                  {selectedHistoryDetail.reasons !== null ? selectedHistoryDetail.reasons : ""}
                                                </h3>
                                                <h4>Message</h4>
                                                <p>
                                                  {selectedHistoryDetail.cancel_comment !== null ? selectedHistoryDetail.cancel_comment : ""}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                          {(selectedHistoryDetail.status === "Rejected" || selectedHistoryDetail.status === "Declined") && (
                                            <div className="fm-eventb-desc mt-20 rejected-block">
                                              <div className="rj-head">
                                                {/* <CloseCircleOutlined />*/}
                                                <span>STATUS {selectedHistoryDetail.status}</span>
                                              </div>
                                              <div className="rj-text">
                                                <h3>
                                                  {selectedHistoryDetail.reasons !== null ? selectedHistoryDetail.reasons : ""}
                                                </h3>
                                                <h4>Message</h4>
                                                <p>
                                                  {selectedHistoryDetail.cancel_comment !== null ? selectedHistoryDetail.cancel_comment : ""}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Col>
                            </Row>
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
                    className="align-right booking-right-section"
                  >
                    <div className="bokng-hsty-hour-price">
                      {/* <div className="price fs-11"> */}
                      {/* {displayDateTimeFormate(value.created_at)} */}

                      <div className="fm-eventb-month">
                        <span className="fm-eventb-month fs-12">
                          {moment(value.booking_date, "YYYY-MM-DD").format(
                            "MMM DD, YYYY"
                          )}
                        </span>
                        <br />
                        <span className="fm-eventb-time fs-12">
                          {moment(value.start_time, "hh:mm:ss").format("LT")} -{" "}
                          {moment(value.end_time, "hh:mm:ss").format("LT")}
                        </span>
                      </div>
                      {/* </div> */}
                    </div>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={10}
                      xl={8}
                      className="align-right self-flex-end mt-15"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        <div className="category-name fs-12">
                          {value.category_name}
                          {value.subcategory_name
                            ? ` | ${value.subcategory_name}`
                            : ""}
                        </div>
                        <div className="edit-delete-dot">
                          <Dropdown
                            overlay={menuicon}
                            trigger={["click"]}
                            overlayClassName="show-phone-number retail-dashboard"
                            placement="bottomRight"
                            arrow
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
                      <div
                        className="fs-12"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <h3
                          className="fs-12"
                          style={{
                            padding: "0px 5px 0 0",
                          }}
                        >
                          Status:
                        </h3>{" "}
                        <span
                          className="fs-12"
                          style={{
                            margin: "2px 0 0 0",
                          }}
                        >
                          {value.status}
                        </span>
                      </div>
                    </Col>
                  </Col>
                </Row>

                {value.event_booking_id === selectedHistoryId && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <MinusCircleOutlined
                      onClick={() => this.setState({ selectedHistoryId: "" })}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {this.state.checkblank.length >= 10 ? (
            <div className="show-more">
              <a onClick={(e) => this.handlePageChange(e)}
                className="show-more">

                {"Show More"}
              </a>
            </div>
          ) : ""}
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
    // className="fm-btndeleteicon"
    if (data.status == "Completed" && data.valid_trader_rating != null) {
      return <Rate defaultValue={0.0} />;
    } else {
      return (
        <span>
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
            date: selectedDate,
            // to_date: selectedDate
          };
          this.props.eventCalendarBookings(req, (res) => {
            if (res.status === 200 && res.data) {
              let selectedDateList = res.data.event_bookings[selectedDate];

              this.setState({
                customerCalenderBookingList:
                  selectedDateList !== undefined ? selectedDateList : [],
              });
            }
          });
        }
      }
    );
  };

  onChangeBookingDates = (value) => {
    this.getBookingsForCalenderDate(value);
  };

  renderBokingCalenderItems = () => {
    const { customerCalenderBookingList } = this.state;

    if (customerCalenderBookingList && customerCalenderBookingList.length > 0) {
      return (
        <ul className="flex-container wrap">
          {customerCalenderBookingList.map((value, i) => {
            return (
              <li>
                <div className="appointments-label">{value.name}</div>
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
    const { activeTab } = this.state;
    if (activeTab == 3) {
      this.setState(
        {
          historyView: view,
          page: "1",
          historyList: [],
          totalHistories: 0,
        },
        () => {
          this.getHistoryList(1);
        }
      );
    } else {
      this.setState(
        {
          calenderView: view,
          selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
          page: "1",
          enquiryList: [],
          totalEnquiry: 0,
          bookingList: [],
          totalBookings: 0,
        },
        () => {
          if (view === "week") {
            this.createWeekCalender();
          }

          if (Number(activeTab) === 1) {
            this.getEnquiries(1);
          } else if (Number(activeTab) === 2) {
            this.getJobList(1);
          }
          // else if (Number(activeTab) === 3) {
          //   this.getHistoryList(1);
          // }
          // this.getBookingsForCalenderDate(new Date());
        }
      );
    }
  };

  renderCancelReasonOptions = (bookingResponse) => {
    const { selectedEnquiryId, selectedBookingId } = this.state;
    console.log(`selectedEnquiryId`, selectedEnquiryId);
    console.log(`selectedBookingId`, selectedBookingId);
    let cancelReasonArray = [];
    if (bookingResponse !== "" && selectedEnquiryId)
      cancelReasonArray = ENQUIRY_CANCELLATION_REASON;
    if (
      // bookingResponse !== "" &&
      selectedBookingId
    )
      cancelReasonArray = BOOKING_CANCELLATION_REASON;

    return (
      Array.isArray(cancelReasonArray) &&
      cancelReasonArray.map((el, i) => {
        return (
          <Radio key={`${i}_cancel_reason`} style={radioStyle} value={el}>
            {el}
          </Radio>
        );
      })
    );
  };

  onChangeBookingCancelReason = (e) => {
    if (e.target.value === "Other") {
      this.setState({
        isOtherCancelResaon: true,
        selectedReasonForCancel: e.target.value,
      });
    } else {
      this.setState({
        isOtherCancelResaon: false,
        selectedReasonForCancel: e.target.value,
      });
    }
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onSubmitCancelEnquiryForm = (values) => {
    const reqData = {
      enquire_response_id: this.state.selectedEnquiryDetail.id,
      reason: values.cancelreason,
      comments: values.other_reason,
    };
    this.props.enableLoading();

    this.props.declineEnquiryByCustomer(reqData, (res) => {
      this.props.disableLoading();
      console.log(`res decline enquiry`, res);
      if (res.status === 200) {
        toastr.success("Success", res.data.message);
        this.setState(
          {
            declineEnquiryModal: false,
            page: "1",
            enquiryList: [],
            totalEnquiry: 0,
          },
          () => {
            this.getEnquiries(1);
          }
        );
      } else {
        toastr.error("Error occured", "Please try again later");
      }
    });
  };

  deleteBooking = () => {
    const { selectedHistoryDetail } = this.state;
    const { loggedInUser } = this.props;
    console.log(`loggedInUser`, loggedInUser);
    console.log(`selectedHistoryDetail`, selectedHistoryDetail);
    let reqData = {
      event_booking_id: selectedHistoryDetail.id,
      user_id: loggedInUser.id,
    };
    this.props.enableLoading();
    this.props.deleteEventHistoryBooking(reqData, (res) => {
      this.props.disableLoading();
      console.log(`delete res`, res);
      if (res.status == 200) {
        toastr.success("Success", res.data.message);
        this.setState(
          {
            confirmDeleteBooking: false,
            page: "1",
            bookingList: [],
            totalBookings: 0,
          },
          () => {
            this.getHistoryList(1);
          }
        );
      } else {
        toastr.error("Error occured", "");
      }
    });
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onSubmitCancelBookingForm = (values) => {
    const reqData = {
      event_booking_id: this.state.selectedBookingId,
      status: "Cancelled",
      reason: values.cancelreason,
      comment: values.other_reason,
    };
    this.props.enableLoading();

    this.props.catererJobDone(reqData, (res) => {
      this.props.disableLoading();
      console.log(`res decline booking`, res);
      if (res.status === 200) {
        this.setState(
          {
            bookingCancellationModal: false,
            page: "1",
            bookingList: [],
            totalBookings: 0,
          },
          () => {
            this.getJobList(1);
          }
        );
        toastr.success("Success", res.data.message);
      } else {
        toastr.success("Error Occured", res.data.message);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      calenderView,
      totalBookings,
      totalEnquiry,
      totalHistories,
      selectedBookingDate,
      customerCalenderBookingList,
      visibleRespondToQuoteModal,
      selectedEnquiryDetail,
      selectedEnquiryId,
      selectedEnquiry,
      declineEnquiryModal,
      showEditBookingOptions,
      bookingCancelConfirmModal,
      bookingCancellationModal,
      selectedBookingId,
      selectedBookingDetail,
      showChangeDateModal,
      showChangeDateSuccessModal,
      receiptModalEventBooking,
      leaveReviewModal,
      selectedHistoryDetail,
      confirmDeleteBooking,
      activeTab,
      historyView,
      page,
    } = this.state;
    console.log(this.state.visibleRespondToQuoteModal, "quotemodel")

    return (
      <Layout className="event-booking-profile-wrap">
        <Layout>
          <Layout>
            <div
              className="my-profile-box view-class-tab shadow-none"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking  mt-0">
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
                          <TabPane tab="Enquiries" key="1">
                            <h3 className="total-activity date-today">
                              Today {moment().format("dddd, DD MMMM")}
                            </h3>
                            {this.renderUpcomingEnquiries()}
                          </TabPane>
                          <TabPane tab="Bookings" key="2">
                            <h3 className="total-activity">
                              You have {totalBookings} activities
                            </h3>
                            {this.renderUpcomingBookings()}
                          </TabPane>
                          <TabPane tab="History" key="3">
                            <h3 className="total-activity">
                              You have {totalHistories} activities
                            </h3>
                            {this.renderHistoryBooking()}
                          </TabPane>
                        </Tabs>
                        <div className="card-header-select history-tab">
                          <label>Show:</label>
                          {activeTab == 3 ? (
                            <Select
                              onChange={(e) => {
                                this.onChangeCalenderView(e);
                              }}
                              // defaultValue={historyView}
                              value={historyView}
                            >
                              <Option value="newest">Newest</Option>
                              <Option value="oldest">Oldest</Option>
                            </Select>
                          ) : (
                            <Select
                              onChange={(e) => {
                                this.onChangeCalenderView(e);
                              }}
                              // defaultValue={"week"}
                              value={calenderView}
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
            {/* <DeclineModal 
              submitForm={this.submitDispute} 
              handleClose={() => 
              this.setState({ visibleDeclineModal: false })} 
              visibleDeclineModal={visibleDeclineModal} 
              selectedEnquiryId={selectedEnquiryId} /> */}
          </Layout>
        </Layout>

        {selectedEnquiryId && visibleRespondToQuoteModal && (
          <Modal
            // title="Create Quote"
            visible={visibleRespondToQuoteModal}
            className={"custom-modal fm-md-modal style1 send-quote-popup"}
            footer={false}
            onCancel={() => {
              this.setState({ visibleRespondToQuoteModal: false });
            }}
          >
            <div className="order-profile">
              <div className="profile-pic">
                <img
                  alt="test"
                  src={
                    selectedEnquiryDetail.trader_user_profile.user.image
                      ? selectedEnquiryDetail.trader_user_profile.user.image
                      : require("../../../../../assets/images/avatar3.png")
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = require("../../../../../assets/images/avatar3.png");
                  }}
                />
              </div>
              <div className="profile-name">
                {selectedEnquiryDetail.trader_user_profile.user.business_name}
              </div>
              <div>
                {selectedEnquiryDetail.trader_user_profile.trader_service.name}
              </div>
            </div>
            <div class="ant-modal-header">
              <div class="ant-modal-title" id="rcDialogTitle1">
                Respond to Quote
              </div>
            </div>
            <div className="padding fm-prh-modalwrap">
              <Form name="basic">
                <Form.Item name="price" className="fm-apply-label">
                  <div className="fm-apply-input">
                    <div className="description">
                      {console.log('selectedEnquiryDetail', selectedEnquiryDetail)}
                      {selectedEnquiryDetail.description}
                    </div>
                    <Input
                      disabled
                      addonBefore="AUD$"
                      placeholder={"Type your quote here"}
                      enterButton="Search"
                      className="shadow-input"
                      defaultValue={
                        selectedEnquiry.price ? selectedEnquiry.price : "0.0"
                      }
                    />
                  </div>
                </Form.Item>
                <div className="fm-eventb-btn mt-20">
                  <Button
                    type="default"
                    className="fm-orng-outline-btn mr-15"
                    disabled={
                      selectedEnquiry.status === "Rejected" ? true : false
                    }
                    onClick={() => {
                      this.setState({
                        declineEnquiryModal: true,
                        visibleRespondToQuoteModal: false,
                      });
                    }}
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={() => {
                      this.props.history.push({
                        pathname: `/my-bookings/event-booking-details/${selectedEnquiryDetail.id}`,
                        state: {
                          hideCheckout: false,
                          booking_type: "event",
                        },
                      });
                    }}
                    type="default"
                    htmlType="submit"
                    className="fm-orng-btn"
                  >
                    Accept
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        )}
        {declineEnquiryModal && (
          <Modal
            title=""
            visible={declineEnquiryModal}
            className={"custom-modal style1 cancellation-reason-modal decline"}
            footer={false}
            onCancel={() => this.setState({ declineEnquiryModal: false })}
            destroyOnClose={true}
          >
            <div className="content-block">
              <Form {...layout} onFinish={this.onSubmitCancelEnquiryForm}>
                <h2>Reason to Decline</h2>
                <h4>Why are you declining this quote?</h4>
                <Form.Item label="" name="cancelreason" rules={[required("")]}>
                  <Radio.Group onChange={this.onChangeBookingCancelReason}>
                    {this.renderCancelReasonOptions(selectedEnquiryDetail)}
                  </Radio.Group>
                </Form.Item>
                {/* {this.state.isOtherCancelResaon && ( */}
                <Form.Item
                  label=""
                  name="other_reason"
                  rules={[whiteSpace("Message"), maxLengthC(100)]}
                >
                  <TextArea
                    rows={4}
                    placeholder={"Leave a Message (Optional)"}
                    className="shadow-input"
                  />
                </Form.Item>
                {/* )} */}
                <Form.Item className="text-center button-box pt-30 mt-30 bt">
                  <Button
                    className="grey-without-border mr-10"
                    type="default"
                    htmlType="button"
                    onClick={() =>
                      this.setState({ declineEnquiryModal: false })
                    }
                  >
                    Cancel{" "}
                  </Button>
                  <Button
                    className="btn-orange-fill ml-10"
                    type="default"
                    htmlType="submit"
                  >
                    Submit{" "}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        )}
        {showEditBookingOptions && (
          <Modal
            title="Edit Booking"
            visible={showEditBookingOptions}
            className={
              "custom-modal style1 cancellation-reason-modal edit-booking"
            }
            footer={false}
            onCancel={() => this.setState({ showEditBookingOptions: false })}
            destroyOnClose={true}
          >
            <div
              className="content-block"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => {
                  this.setState({
                    showEditBookingOptions: false,
                    showChangeDateModal: true,
                  });
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.3 14.3V18.2C14.3 18.9176 13.7176 19.5 13 19.5C12.2824 19.5 11.7 18.9176 11.7 18.2V15.6C11.7 14.8824 11.1176 14.3 10.4 14.3C9.6824 14.3 9.1 13.7176 9.1 13C9.1 12.2824 9.6824 11.7 10.4 11.7H11.7C13.1365 11.7 14.3 12.8635 14.3 14.3ZM23.4 22.1C23.4 22.8176 22.8176 23.4 22.1 23.4H3.9C3.1824 23.4 2.6 22.8176 2.6 22.1V9.1C2.6 8.3824 3.1824 7.8 3.9 7.8H22.1C22.8176 7.8 23.4 8.3824 23.4 9.1V22.1ZM23.4 2.6V1.3C23.4 0.5824 22.8176 0 22.1 0C21.3824 0 20.8 0.5824 20.8 1.3V2.6H14.3V1.3C14.3 0.5824 13.7176 0 13 0C12.2824 0 11.7 0.5824 11.7 1.3V2.6H5.2V1.3C5.2 0.5824 4.6176 0 3.9 0C3.1824 0 2.6 0.5824 2.6 1.3V2.6C1.1635 2.6 0 3.7635 0 5.2V23.4C0 24.8352 1.1635 26 2.6 26H23.4C24.8365 26 26 24.8352 26 23.4V5.2C26 3.7635 24.8365 2.6 23.4 2.6Z"
                    fill="#C1D6E9"
                  />
                </svg>
                <button>Change my booking date</button>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.999 7L4.99902 7.00001"
                    stroke="#C1D6E9"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13 13V21"
                    stroke="#C1D6E9"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 13V21"
                    stroke="#C1D6E9"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24.999 7.00001V26C24.999 26.2652 24.8937 26.5196 24.7061 26.7071C24.5186 26.8946 24.2642 27 23.999 27H7.99902C7.73381 27 7.47945 26.8946 7.29192 26.7071C7.10438 26.5196 6.99902 26.2652 6.99902 26V7"
                    stroke="#C1D6E9"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21 7V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H13C12.4696 3 11.9609 3.21071 11.5858 3.58579C11.2107 3.96086 11 4.46957 11 5V7"
                    stroke="#C1D6E9"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <button
                  onClick={() => {
                    this.setState({
                      bookingCancelConfirmModal: true,
                      showEditBookingOptions: false,
                    });
                  }}
                >
                  Cancel my booking
                </button>
              </div>
            </div>
          </Modal>
        )}
        {bookingCancelConfirmModal && (
          <Modal
            title=""
            visible={bookingCancelConfirmModal}
            className={
              "custom-modal style1 cancellation-reason-modal canel-booking-first"
            }
            footer={false}
            onCancel={() => this.setState({ bookingCancelConfirmModal: false })}
            destroyOnClose={true}
          >
            <div className="cancel-top-section">
              <ExclamationCircleOutlined />
              <span>
                If you cancel within 24 hours of the scheduled booking, 50% of
                the fee will still be charged.
              </span>
            </div>
            <div
              className="content-block"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <button
                  className="grey-without-border ant-btn-default"
                  onClick={() => {
                    this.setState({
                      bookingCancelConfirmModal: false,
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <button
                  className="btn-orange-fill ant-btn-default"
                  onClick={() => {
                    this.setState({
                      bookingCancelConfirmModal: false,
                      bookingCancellationModal: true,
                    });
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </Modal>
        )}
        {bookingCancellationModal && (
          <Modal
            title=""
            visible={bookingCancellationModal}
            className={
              "custom-modal style1 cancellation-reason-modal please-choose-box"
            }
            footer={false}
            onCancel={() => this.setState({ bookingCancellationModal: false })}
            destroyOnClose={true}
          >
            <div className="content-block">
              <Form {...layout} onFinish={this.onSubmitCancelBookingForm}>
                <h2>Please choose a reason for cancellation</h2>
                <Form.Item label="" name="cancelreason" rules={[required("")]}>
                  <Radio.Group onChange={this.onChangeBookingCancelReason}>
                    {this.renderCancelReasonOptions(selectedBookingDetail)}
                  </Radio.Group>
                </Form.Item>
                {/* {this.state.isOtherCancelResaon && ( */}
                <Form.Item
                  label="Message (Optional)"
                  name="other_reason"
                  rules={[whiteSpace("Message"), maxLengthC(100)]}
                >
                  <TextArea
                    rows={4}
                    placeholder={"..."}
                    className="shadow-input"
                  />
                </Form.Item>
                {/* )} */}
                <Form.Item className="text-center button-box">
                  <Button
                    className="grey-without-border"
                    type="default"
                    htmlType="button"
                    onClick={() =>
                      this.setState({ bookingCancellationModal: false })
                    }
                  >
                    Cancel{" "}
                  </Button>
                  <Button
                    className="btn-orange-fill"
                    type="default"
                    htmlType="submit"
                  >
                    Submit{" "}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        )}
        {showChangeDateModal && (
          <BookingRescheduleModal
            handleClose={() => this.setState({ showChangeDateModal: false })}
            visibleRescheduleModal={showChangeDateModal}
            selectedBookingId={selectedBookingId}
            page={page}
            selectedBookingDetail={selectedBookingDetail}
            isFromBooking={true}
            onChangeSuccess={() => {
              this.setState(
                {
                  showChangeDateModal: false,
                  page: "1",
                  historyList: [],
                  totalHistories: 0,
                },
                () => {
                  this.getJobList(1);
                }
              );
            }}
          />
        )}

        {showChangeDateSuccessModal && (
          <Modal
            title=""
            visible={showChangeDateSuccessModal}
            className={
              "custom-modal style1 cancellation-reason-modal update-last "
            }
            footer={false}
            onCancel={() =>
              this.setState({ showChangeDateSuccessModal: false })
            }
            destroyOnClose={false}
          >
            <div>
              <div>
                <ExclamationCircleOutlined />
              </div>
              <h3>
                Your booking information
                <br />
                has been updated.
              </h3>

              <div
                className="content-block"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <button
                    type="default"
                    className="grey-without-border ant-btn-default"
                    onClick={() => {
                      this.setState({
                        showChangeDateSuccessModal: false,
                      });
                    }}
                  >
                    Close
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <button
                    type="default"
                    className="btn-orange-fill ant-btn-default"
                    onClick={() => {
                      this.setState({
                        showChangeDateSuccessModal: false,
                      });
                    }}
                  >
                    Back to booking
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {receiptModalEventBooking && (
          <PDFInvoiceModal
            visible={receiptModalEventBooking}
            onClose={() => {
              this.setState({ receiptModalEventBooking: false });
            }}
            isViewInvoice={true}
            enquiryDetails={selectedHistoryDetail}
            booking_type="event"
          />
        )}
        {leaveReviewModal && (
          <LeaveReviewModel
            visible={leaveReviewModal}
            onCancel={() => {
              this.setState({ leaveReviewModal: false });
            }}
            type="Event"
            // bookingDetail={selectedHistoryDetail && selectedHistoryDetail}
            bookingDetail={selectedHistoryDetail}
            booking_type="event"

            // callNext={this.getDetails}
            callNext={() => {
              this.setState(
                {
                  leaveReviewModal: false,
                  page: "1",
                  bookingList: [],
                  totalBookings: 0,
                },
                () => {
                  this.getHistoryList(1);
                }
              );
            }}
          />
        )}
        {confirmDeleteBooking && (
          <Modal
            title=""
            visible={confirmDeleteBooking}
            className={"custom-modal style1 cancellation-reason-modal delete-popupbox "}
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
                <button className="grey-without-border ant-btn-default mr-15"
                  onClick={() => {
                    this.setState({
                      confirmDeleteBooking: false,
                    });
                  }}
                >
                  No, Cancel
                </button>
                <button className="btn-orange-fill ant-btn-default" onClick={this.deleteBooking}>Yes Delete</button>
              </div>
            </div>
          </Modal>
        )}
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
  getCustomerCatererEnquiry,
  getCustomerCatererEnquiryDetail,
  declineCustomerEventEnquiry,
  getCustomerCatererBookings,
  getCatererBookingDetail,
  getCustomerCatererHistoryList,
  catererJobDone,
  raiseCatererDispute,
  replyCatererDispute,
  submitCatererReview,
  eventCalendarBookings,
  postBookingsDetail,
  removeCheckoutData,
  customerServiceBookingResponse,
  declineEnquiryByCustomer,
  deleteEventHistoryBooking,
})(withRouter(MyEventBooking));
