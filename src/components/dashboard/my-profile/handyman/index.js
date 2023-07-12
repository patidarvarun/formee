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
  DeleteFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getCustomerMyBookingsCalender,
  listCustomerHandymanBookings,
  beautyServiceBookingsRating,
  listCustomerHandymanHistory,
  listCustomerHandymanQuote,
  listCustomerHandymanEnquiryDetail,
  listCustomerHandymanBookingsDetail,
  listCustomerHandymanHistoryDetail,
  changeQuoteStatus,
  changeJobStatus,
  raiseCustomerHandymanDispute,
  raiseCustomerHandymanDisputeReply,
  submitHandymanReview,
  declineEnquiryByCustomer,
  customerServiceBookingResponse,
  getBookingDetails,
  customerCancelQuoteRequest,
  deleteCustomerHandymanHistoryBooking,
} from "../../../../actions";
import AppSidebar from "../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import "./mybooking.less";
import {
  displayDateTimeFormate,
  convertTime24To12Hour,
  displayCalenderDate,
  displayDate,
} from "../../../../components/common";
import { STATUS_CODES } from "../../../../config/StatusCode";
import Icon from "../../../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from "../../../../config/Config";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../config/FormValidation";
import moment from "moment";
import { Calendar, Badge } from "antd";
import { toastr } from "react-redux-toastr";
import { BOOKING_LIST, BOOKING_HISTORY } from "./static_reponse";
import DisputeModal from "../../vendor-profiles/common-modals/DisputeModal";
import ReplyDisputeModal from "../../vendor-profiles/common-modals/ReplyDisputeModal";
import ReviewModal from "../../vendor-profiles/common-modals/ReviewModal";
import CancelModal from "../../vendor-profiles/common-modals/CancelModal";
import {
  getStatusColor,
  checkBookingForFutureDate,
} from "../../../../config/Helper";
import "./profile-vendor-handyman.less";
import SelectDateForHandyman from "./SelectDateForHandyman";
import PDFInvoiceModal from "../../../common/PDFInvoiceModal";
import LeaveReviewModel from "../../../booking/common/LeaveReviewModel";
import BookingRescheduleModal from "../../../dashboard/vendor-profiles/common-modals/BookingRescheduleModal";

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

const layout2 = {
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

const CANCELLATION_REASON = [
  "Date & Time not available",
  "Date not available",
  "Time not available",
  "I no longer need this service",
];
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
      page_size: 10,
      customer_id: "",
      key: 1,
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      customerBookingHistoryList: [],
      customerCalenderBookingList: [],
      customerEnquiryList: [],
      bookingList: [],
      totalBookings: 0,
      totalRecordCustomerServiceBooking: 0,
      totalRecordCustomerSpaBookingHistory: 0,
      selectedEnquiryId: "",
      selectedEnquiryDetail: "",
      selectedHistoryDetail: "",
      selectedHistoryId: "",
      visibleRescheduleModal: false,
      visibleCreateQuoteModal: false,
      displayReportToAdminModal: false,
      visibleReplyDisputeModal: false,
      visibleReviewModal: false,
      visibleCancelModal: false,
      index: "",
      customerRating: "",
      showReviewModal: false,
      bookingListCalenderView: "week",
      activeTab: "1",
      serviceBookingIdForReview: "",
      selectedBookingId: "",
      monthStart: moment().startOf("month").format("YYYY-MM-DD"),
      monthEnd: moment().endOf("month").format("YYYY-MM-DD"),
      weekStart: moment().startOf("week").format("YYYY-MM-DD"),
      weekEnd: moment().endOf("week").format("YYYY-MM-DD"),
      visibleRespondToQuoteModal: false,
      declineEnquiryModal: false,
      showEditBookingOptions: false,
      bookingCancelConfirmModal: false,
      showChangeDateModal: false,
      showChangeDateSuccessModal: false,
      bookingCancellationModal: false,
      receiptModalEventBooking: false,
      confirmDeleteBooking: false,
      leaveReviewModal: false,
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
    this.props.enableLoading();
    this.getCustomerEnquiryList(this.state.page);

    // this.getBookingsForCalenderDate(this.state.selectedBookingDate);
    // this.createWeekCalender();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps,"rrrrrrrr")
    const { activeTab } = this.state;
    if (this.state.searchKeyword != nextProps.searchKeyword) {
      this.setState(
        {
          searchKeyword: nextProps.searchKeyword,
          page: "1",
          customerEnquiryList: [],
          totalRecordCustomerEnquires: 0,
          bookingList: [],
          totalBookings: 0,
          historyList: [],
          totalHistories: 0,
        },
        () => {
          if (activeTab == "1") {
            this.getCustomerEnquiryList(1);
          } else if (activeTab == "2") {
            this.getJobList(1);
          } else if (activeTab == "3") {
            this.getHistoryList(1);
          }
        }
      );
    }
  }

  // createWeekCalender = () => {
  //   let curr = new Date();
  //   let weekArray = []
  //   for (let i = 1; i <= 7; i++) {
  //     let first = curr.getDate() - curr.getDay() + i
  //     let day = new Date(curr.setDate(first));
  //     weekArray.push(day)
  //   }
  //   let newWeekDatesArray = weekArray.map(d => d.toString());
  //   this.setState({
  //     weeklyDates: newWeekDatesArray
  //   });
  // }

  onTabChange = (key, type) => {
    this.setState(
      {
        key: key,
        activeTab: key,
        page: "1",
        customerEnquiryList: [],
        totalRecordCustomerEnquires: 0,
        bookingList: [],
        totalBookings: 0,
        historyList: [],
        totalHistories: 0,
        selectedEnquiryDetail: null,
        selectedEnquiryId: null,
        selectedBookingId: null,
        selectedBookingDetail: null,
        selectedHistoryId: null,
        selectedHistoryDetail: null,
      },
      () => {
        this.props.onClearSearch();
        if (key == "1") {
          this.getCustomerEnquiryList(1);
        } else if (key == "2") {
          this.getJobList(1);
        } else {
          this.getHistoryList(1);
        }
      }
    );
  };

  handlePageChange = (e) => {

    const { activeTab, page } = this.state;
    if (activeTab == "1") {
      this.getCustomerEnquiryList(+page + 1);
    } else if (activeTab == "2") {
      this.getJobList(+page + 1);
    } else {
      // this.getHistoryList(e);
      this.getHistoryList(+page + 1);
    }
  };

  getDuration = () => {
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
    return {
      fromDate,
      toDate,
    };
  };

  getCustomerEnquiryList = (page) => {
    const { id } = this.props.loggedInUser;
    const { customerEnquiryList, searchKeyword } = this.state;
    console.log(searchKeyword,"searchkeyword handy")
    let duration = this.getDuration();

    const reqData = {
      user_id: id,
      order_by: "date",
      order: this.state.order,
      page: page,
      per_page: this.state.page_size,
      from_date: duration.fromDate,
      to_date: duration.toDate,
      search: searchKeyword,
    };
    this.props.enableLoading();
    this.props.listCustomerHandymanQuote(reqData, (res) => {
      console.log("res: methode ", res.data);
      this.props.disableLoading();
      if (res.status === 200 && res.data.quote_requests.length !== 0) {
        let records = res.data.quote_requests;
        let totalRecords = res.data.total ? res.data.total : 0;
        let newList = [...customerEnquiryList, ...records];
        this.setState({
          page: page,
          customerEnquiryList: newList,
          totalRecordCustomerEnquires: totalRecords,
          showMoreEnquiries: newList.length < totalRecords ? true : false,
        });
      }
    });
  };


  getJobList = (page) => {
    const { id } = this.props.loggedInUser;
    const { bookingList, searchKeyword } = this.state;
    let duration = this.getDuration();

    const reqData = {
      page: page,
      page_size: this.state.page_size,
      user_id: id,
      order_by: "date",
      order: "desc",
      per_page: this.state.page_size,
      from_date: duration.fromDate,
      end_date: duration.toDate,
      search: searchKeyword,
    };

    this.props.listCustomerHandymanBookings(reqData, (res) => {
      console.log(res, "resssssssssssssssss")
      this.props.disableLoading();

      if (res.status === STATUS_CODES.OK && res.data.jobs.length !== 0) {
        let records = res.data.jobs;
        let totalRecords = res.data.jobs ? res.data.jobs.length : 0;
        let newList = [...bookingList, ...records];
        this.setState({
          page: page,
          bookingList: newList,
          totalBookings: res.data.total ? res.data.total : 0,
          // showMoreBookings: newList.length < totalRecords ? true : false,
          checkblank: records,
        });
      }
    });
  };

  getHistoryList = (page) => {

    const { id } = this.props.loggedInUser;
    // let duration = this.getDuration();
    const { historyView, historyList, searchKeyword } = this.state;
    const reqData = {
      page: page,
      page_size: this.state.page_size,
      user_id: id, //657
      order: historyView == "newest" ? "desc" : "asc",
      // from_date: duration.fromDate,
      // end_date: duration.toDate,
      search: searchKeyword,
    };

    this.props.listCustomerHandymanHistory(reqData, (res) => {
      console.log("res: ", res);
      this.props.disableLoading();

      if (res.status === STATUS_CODES.OK && res.data.jobs.length !== 0) {
        let records = res.data.jobs;
        let totalRecords = res.data.total ? res.data.total : 0;
        let newList = [...historyList, ...records];
        this.setState({
          page: page,
          historyList: newList,
          totalHistories: totalRecords,
          showMoreHistory: newList.length < totalRecords ? true : false,

        });
      }

    });
  };



  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0;
  };

  displayOrderDetails = (orderID) => {
    this.setState({ selectedBookingId: orderID });
  };

  renderUpcomingEnquiries = () => {
    const {
      customerEnquiryList,
      totalRecordCustomerEnquires,
      selectedEnquiryId,
      selectedEnquiryDetail,
      showMoreEnquiries,
      page,
    } = this.state;
    console.log(`selectedEnquiryDetail`, selectedEnquiryDetail);
    const { id } = this.props.loggedInUser;
    if (customerEnquiryList.length) {
      return (
        <Fragment>
          {customerEnquiryList.map((value, i) => {
            let test = moment(value.date, "YYYY-MM-DD").format("MMMM DD,yy");

            return (
              <div
                className="my-new-order-block booking-box-content"
                key={i}
                onClick={() => {
                  if (selectedEnquiryId === value.id) {
                    // this.setState({ selectedEnquiryId: "" });
                  } else {
                    this.props.listCustomerHandymanEnquiryDetail(
                      { trader_quote_request_id: value.id, user_id: id },
                      (res) => {
                        if (res.status === STATUS_CODES.OK) {
                          this.setState({
                            selectedEnquiryId: value.id,
                            selectedEnquiryDetail: res.data.quote_request,
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
                      <span className="pickup">
                        {value.trader_service.name}
                      </span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-pic booking-profile">
                        <img
                          alt="test"
                          src={
                            value.trader_user.image
                              ? value.trader_user.image
                              : require("../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">
                        {value.trader_user.name}
                      </div>
                    </div>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                        <div className="fm-eventb-date">
                          <h3>Date Requested:</h3>
                          <span className="fm-eventb-month">
                            {console.log("value handyman", value)}
                            {moment(value.created_at, "YYYY-MM-DD").format(
                              "MMMM DD,yy"
                            )}
                          </span>
                          <span className="fm-eventb-time">
                            {moment(value.from, "hh:mm:ss").format("LT")} -{" "}
                            {moment(value.to, "hh:mm:ss").format("LT")}
                          </span>
                        </div>
                      </Col>
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
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={18}
                            xl={17}
                            className=""
                          >
                            <Row gutter={0}>
                              {value.id === selectedEnquiryId ? (
                                <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                  <div className="">
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
                                        {selectedEnquiryDetail.images.map(
                                          (imageObject) => {
                                            return (
                                              <img
                                                alt="test"
                                                src={
                                                  imageObject
                                                    ? imageObject.image
                                                    : require("../../../../assets/images/pr-img2.jpg")
                                                }
                                              />
                                            );
                                          }
                                        )}
                                      </div>
                                      {(selectedEnquiryDetail.status === "Cancelled") && (
                                        <div className="fm-eventb-desc mt-20 rejected-block">
                                          <div className="rj-head">
                                            {/* <CloseCircleOutlined />*/}
                                            <span><CloseCircleOutlined />STATUS {selectedEnquiryDetail.status}</span>
                                          </div>
                                          <div className="rj-text">
                                            <h5>
                                              {selectedEnquiryDetail.cancel_reason !== null ? selectedEnquiryDetail.cancel_reason : ""}
                                            </h5>
                                            <h4>Message</h4>
                                            <p>
                                              {selectedEnquiryDetail.cancle_comment !== null ? selectedEnquiryDetail.cancle_comment : ""}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {(selectedEnquiryDetail.status === "Rejected" || selectedEnquiryDetail.status === "Declined") && (
                                        <div className="fm-eventb-desc mt-20 rejected-block">
                                          <div className="rj-head">
                                            
                                            <span><CloseCircleOutlined />STATUS {selectedEnquiryDetail.status}</span>
                                          </div>
                                          <div className="rj-text">
                                            <h5>
                                              {selectedEnquiryDetail.cancel_reason !== null ? selectedEnquiryDetail.cancel_reason : ""}
                                            </h5>
                                            <h4>Message</h4>
                                            <p>

                                              {selectedEnquiryDetail.cancle_comment !== null ?selectedEnquiryDetail.cancle_comment: ""}

                                            </p>
                                          </div>
                                        </div>
                                      )}


                                    </div>

                                    <Form.Item className="fm-apply-label"></Form.Item>
                                    {/* {Array.isArray(value.quotes) &&
                                    value.quotes.length ? (
                                      <div className="fm-eventb-btn mt-20">
                                        <Button
                                          type="default"
                                          className="fm-orng-outline-btn mr-15"
                                          disabled={
                                            value.status === "Rejected"
                                              ? true
                                              : false
                                          }
                                          onClick={() => {
                                            this.props.changeQuoteStatus(
                                              {
                                                quote_id:
                                                  Array.isArray(value.quotes) &&
                                                  value.quotes.length
                                                    ? value.quotes[0].id
                                                    : "",
                                                status: "Rejected",
                                              },
                                              (res) => {
                                                console.log("res: ", res);
                                                if (res.data.success) {
                                                  toastr.success(
                                                    langs.success,
                                                    MESSAGES.DECILNED_BOOKING
                                                  );
                                                  this.getCustomerEnquiryList(
                                                    this.state.page
                                                  );
                                                } else {
                                                  toastr.error(
                                                    langs.error,
                                                    res.data.message
                                                  );
                                                }
                                              }
                                            );
                                          }}
                                        >
                                          Decline
                                        </Button>
                                        <Button
                                          // disabled={value.status !== 'Pending' ? true : false}
                                          onClick={() => {
                                            this.props.changeQuoteStatus(
                                              {
                                                quote_id:
                                                  Array.isArray(value.quotes) &&
                                                  value.quotes.length
                                                    ? value.quotes[0].id
                                                    : "",
                                                status: "Accepted",
                                                payment_method: "paypal",
                                              },
                                              (res) => {
                                                if (res.data.success) {
                                                  toastr.success(
                                                    langs.success,
                                                    MESSAGES.ACCEPT_QUOTE
                                                  );
                                                  this.getCustomerEnquiryList(
                                                    this.state.page
                                                  );
                                                } else {
                                                  toastr.error(
                                                    langs.error,
                                                    res.data.message
                                                  );
                                                }
                                              }
                                            );
                                          }}
                                          type="default"
                                          className="fm-orng-btn"
                                        >
                                          Accept
                                        </Button>
                                      </div>
                                    ) : (
                                      ""
                                    )} */}
                                  </div>
                                </Col>
                              ) : (
                                ""
                              )}
                            </Row>
                          </Col>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={6}
                    xl={6}
                    className="align-right booking-right booking-right-section"
                  >
                    <div className="bokng-hsty-hour-price">
                      <span className="fm-eventb-month date-time-new">
                        {moment(value.created_at, "YYYY-MM-DD").format(
                          "DD MMMM yy"
                        )}
                      </span>
                      <div className="price mt-5 fs-25">
                        {Array.isArray(value.quotes) && value.quotes.length
                          ? `AU$${value.quotes[0].amount}.00`
                          : `AU$0.00`}
                      </div>
                    </div>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={16}
                      xl={8}
                      className="align-right self-flex-end"
                    >
                      {/* {this.displayReviewRatingSection(value)} */}
                      {value.id === selectedEnquiryId &&
                        value.status == "QuoteSent" && value.tj_status == null ? (
                        <Button
                          type="default"
                          className={getStatusColor(value.status)}
                          //  className='success-btn'
                          onClick={() => {
                            this.setState({
                              visibleRespondToQuoteModal: true,
                            });
                          }}
                        >
                          Respond to Quote
                        </Button>
                      ) : value.status == "QuoteSent" &&
                        value.tj_status == "Amount-Paid-Pending"
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
                            {value.status == "QuoteSent"
                              ? "Respond to Quote"
                              : value.status}
                          </Button>
                        )}
                    </Col>
                  </Col>
                </Row>
                {value.id === selectedEnquiryId && (
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
          {/* <Pagination
            defaultCurrent={this.state.page}
            defaultPageSize={this.state.defaultPageSize} //default size of page
            onChange={this.handlePageChange}
            total={totalRecordCustomerEnquires} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={"mb-20"}
          /> */}
          {showMoreEnquiries && (
            <div className="show-more">
              <a onClick={(e) => this.handlePageChange(e)}
                className="show-more">

                {"Show More"}
              </a>
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

  changeJobBookingStatus = (status, id) => {
    this.props.changeJobStatus({ trader_job_id: id, status }, (res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.CONFIRM_HANDYMAN_BOOKING);
        // this.handleCancel()
      }
    });
  };

  renderUpcomingBookings = () => {
    const {
      bookingList,
      totalBookings,
      selectedBookingId,
      selectedBookingDetail,
      selectedEnquiryId,
      showMoreBookings,
      page,
    } = this.state;
    const { userDetails } = this.props;
    console.log("bookingList: ", showMoreBookings);
    if (bookingList.length) {
      return (
        <Fragment>
          {bookingList.map((value, i) => {

            return (
              <div
                className="my-new-order-block booking-box-content "
                key={i}
                onClick={() => {
                  if (selectedBookingId === value.id) {
                    // this.setState({ selectedEnquiryId: "" });
                  } else {
                    this.props.listCustomerHandymanBookingsDetail(
                      { trader_job_id: value.id },
                      (res) => {
                        if (res.status === STATUS_CODES.OK) {
                          this.setState(
                            {
                              selectedBookingId: value.id,
                              selectedBookingDetail: res.data.job,
                            },
                            () => {
                              const { selectedBookingDetail } = this.state;
                              this.getBookingDetails(
                                selectedBookingDetail.trader_user_id
                              );
                            }
                          );
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
                      <h4>{value.title}</h4>
                      <span className="pickup">
                        {value.trader_service.name}
                      </span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-pic booking-profile">
                        <img
                          alt="test"
                          src={
                            value.trader_user.image
                              ? value.trader_user.image
                              : require("../../../../assets/images/avatar3.png")
                          }
                        />
                      </div>
                      <div className="profile-name">
                        {value.trader_user.name}
                      </div>
                    </div>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                            <div className="fm-eventb-date">
                              <h3>Created Date:</h3>
                              <span className="fm-eventb-month">
                                {value.date
                                  ? moment(
                                    value.date,
                                    "YYYY-MM-DD"
                                  ).format("MMMM DD,yy")
                                  : ""}
                              </span>
                              <span className="fm-eventb-time">
                                {moment(value.from, "hh:mm:ss").format("LT")} -{" "}
                                {moment(value.to, "hh:mm:ss").format("LT")}
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={17}
                            className="fm-desc-wrap"
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
                                  {value.id === selectedBookingId ? (
                                    <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                      <div className="">
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Contact Name:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedBookingDetail.trader_user
                                                .name
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Email Address:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedBookingDetail.trader_user
                                                .email
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Phone Number:</h3>
                                          <span className="fm-eventb-content">
                                            {
                                              selectedBookingDetail.trader_user
                                                .full_mobile_no
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Photo:</h3>
                                          <div className="fm-imgpr-wrap">
                                            {selectedBookingDetail.images.map(
                                              (imageObject) => {
                                                return (
                                                  <img
                                                    alt="test"
                                                    src={
                                                      imageObject
                                                        ? imageObject.image
                                                        : require("../../../../assets/images/pr-img2.jpg")
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
                    className="align-right booking-right booking-right-section"
                  >
                    <div className="bokng-hsty-hour-price">
                      <div className="date-time-new fs-13 mb-0">
                        {moment(value.date, "YYYY-MM-DD").format("DD MMMM yy")}
                      </div>
                      <div className="date-time-new fs-13 ">

                        {moment(value.from, "hh:mm:ss").format("LT")} -{" "}
                        {moment(value.to, "hh:mm:ss").format("LT")}

                      </div>
                      <div>
                        {value.category_name}
                        {value.sub_category_name
                          ? ` | ${value.sub_category_name}`
                          : ""}
                      </div>
                      {/* <div className="price ">
                        {value.cost ? `AU$${value.cost}.00` : `AU$0.00`}
                      </div> */}
                    </div>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={10}
                      xl={8}
                      className="align-right self-flex-end"
                    >
                      <span className="fm-btndeleteicon">
                        {/* <Button type='default' className="success-btn">{value.status === 'Accepted-Paid' ? 'Confirmed' : value.status === 'Accepted' ? 'Pending' : value.status === 'Appointment' ? 'Pending' : ''}</Button> */}
                        <Button
                          type="default"
                          className={getStatusColor(value.status)}
                          //  className='success-btn'
                          onClick={() => {
                            if (value.status === "Accepted") {
                              this.setState({
                                visibleRespondToQuoteModal: true,
                              });
                            } else {
                              this.setState({
                                showEditBookingOptions: true,
                              });
                            }
                          }}
                        >
                          {value.status === "Appointment"
                            ? "Appointment"
                            : value.status === "Accepted"
                              ? "Accepted"
                              : value.status === "Rejected"
                                ? "Rejected"
                                : value.status === "Amount-Paid-Pending"
                                  ? "Amount-Paid-Pending"
                                  : value.status === "Accepted-Paid"
                                    ? "Accepted-Paid"
                                    : value.status === "Job-Done"
                                      ? "Job-Done"
                                      : ""}
                        </Button>
                        {/* <Button
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
                        </Button> */}
                      </span>
                    </Col>
                  </Col>
                </Row>

                {value.id === selectedBookingId && (
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
          {/* <Pagination
            defaultCurrent={this.state.page}
            defaultPageSize={this.state.defaultPageSize} //default size of page
            onChange={this.handlePageChange}
            total={totalBookings} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={"mb-20"}
          /> */}
          {this.state.checkblank.length >= 10 ? (
            <div className="show-more">
              <a onClick={(e) => this.handlePageChange(e)} className="show-more" >
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

  renderHistoryBooking = () => {
    const {
      historyList,
      totalHistories,
      selectedHistoryId,
      selectedHistoryDetail,
      bookingDetail,
      showMoreHistory,
      page,
    } = this.state;

    if (historyList && historyList.length > 0) {
      const menuicon = (
        <Menu>
          <Menu.Item key="0">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={() => {
                  if (selectedHistoryId)
                    this.props.history.push({
                      pathname: `/my-bookings/event-booking-details/${selectedHistoryId}`,
                      state: {
                        hideCheckout: true,
                      },
                    });
                }}
              >
                <span className="edit-images">
                  {" "}
                  <img
                    src={require("../../../classified-templates/user-classified/icons/view.svg")}
                    alt=""
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
                    src={require("../../../classified-templates/user-classified/icons/view.svg")}
                    alt=""
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
                    src={require("../../../classified-templates/user-classified/icons/edit.svg")}
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
                    src={require("../../../../assets/images/icons/delete.svg")}
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
          {historyList.map((value, i) => {
            return (
              <div
                className="my-new-order-block  booking-box-content"
                key={i}
                onClick={() => {
                  if (selectedHistoryId === value.id) {
                    // this.setState({ selectedEnquiryId: "" });
                  } else {
                    this.props.listCustomerHandymanHistoryDetail(
                      {
                        data_type: "job",
                        history_id: value.id,
                        trader_job_id: value.id,
                      },
                      (res) => {
                        if (res.status === STATUS_CODES.OK) {
                          this.setState(
                            {
                              selectedHistoryId: value.id,
                              selectedHistoryDetail: res.data.history,
                            },
                            () => {
                              const { selectedHistoryDetail } = this.state;
                              this.getBookingDetails(
                                selectedHistoryDetail.trader_user_id
                              );
                            }
                          );
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
                      <h4>{value.status}</h4>
                      <span className="pickup">
                        {value.trader_service.name}
                      </span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic">
                          <img
                            alt="test"
                            src={
                              value.trader_user.image
                                ? value.trader_user.image
                                : require("../../../../assets/images/avatar3.png")
                            }
                          />
                        </div>
                        <div className="profile-name">
                          {value.trader_user.name}
                        </div>
                      </div>
                      <div className="pf-rating">
                        <Text>{value.valid_trader_rating ? this.formateRating(value.valid_trader_rating.rating) : ''}</Text>
                        <Rate
                          disabled
                          value={
                            value.valid_trader_rating
                              ? value.valid_trader_rating.rating
                              : 0
                          }
                        />
                      </div>
                    </div>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                            <div className="fm-eventb-date">
                              <h3>Date Requested</h3>
                              <span className="fm-eventb-month">
                                {moment(value.date, "YYYY-MM-DD").format(
                                  "DD MMMM yy"
                                )}
                              </span>
                              <span className="fm-eventb-time">
                                {moment(value.from, "hh:mm:ss").format("LT")} -{" "}
                                {moment(value.to, "hh:mm:ss").format("LT")}
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={17}
                            className="fm-desc-wrap"
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
                                  <span className="fm-eventb-content fs-13">
                                    {value.description}
                                  </span>
                                  {value.id === selectedHistoryId ? (
                                    <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                      <div className="">
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
                                                .full_mobile_no
                                            }
                                          </span>
                                        </div>
                                        <div className="fm-eventb-desc mt-20">
                                          <h3>Photo:</h3>
                                          <div className="fm-imgpr-wrap">
                                            {selectedHistoryDetail.images.map(
                                              (imageObject) => {
                                                return (
                                                  <img
                                                    alt="test"
                                                    src={
                                                      imageObject
                                                        ? imageObject.image
                                                        : require("../../../../assets/images/pr-img2.jpg")
                                                    }
                                                  />
                                                );
                                              }
                                            )}
                                          </div>
                                          {(selectedHistoryDetail.status === "Cancelled") && (
                                            <div className="fm-eventb-desc mt-20 rejected-block">
                                              <div className="rj-head">
                                                
                                                <span><CloseCircleOutlined />STATUS {selectedHistoryDetail.status}</span>
                                              </div>
                                              <div className="rj-text">
                                                <h5>
                                                  {selectedHistoryDetail.reason !== null ? selectedHistoryDetail.reason : ""}
                                                </h5>
                                                <h4>Message</h4>
                                                <p>
                                                  {selectedHistoryDetail.comment !== null ? selectedHistoryDetail.comment : ""}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                          {(selectedHistoryDetail.status === "Rejected" || selectedHistoryDetail.status === "Declined" ) && (
                                            <div className="fm-eventb-desc mt-20 rejected-block">
                                              <div className="rj-head">
                                               
                                                <span> <CloseCircleOutlined />STATUS {selectedHistoryDetail.status}</span>
                                              </div>
                                              <div className="rj-text">
                                                <h5>
                                                  {selectedHistoryDetail.reason !== null ? selectedHistoryDetail.reason : ""}
                                                </h5>
                                                <h4>Message</h4>
                                                <p>
                                                  {selectedHistoryDetail.comment !== null ? selectedHistoryDetail.comment : ""}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        {/* <Form.Item className="fm-apply-label">
                                  <span className="fm-arrow-label">Total</span>
                                  <div className="fm-apply-input">
                                    <Input
                                      defaultValue={`$AUD ${selectedHistoryDetail.cost}.00`}
                                      placeholder={"Type your quote here"}
                                      enterButton="Search"
                                      className="shadow-input"
                                      disabled
                                    />
                                    <Button
                                      type="primary"
                                      className="fm-apply-btn"
                                    >
                                      Quote
                                    </Button>
                                  </div>
                                </Form.Item> */}
                                        {/* <Form.Item className="fm-apply-label">
                                  <Button
                                    className="fm-orng-btn mr-10"
                                    disabled={
                                      value.status === "Completed"
                                        ? false
                                        : true
                                    }
                                    onClick={() =>
                                      this.setState({
                                        visibleDisputeModal: true,
                                      })
                                    }
                                    type="primary"
                                    size="middle"
                                  >
                                    Raise Dispute
                                  </Button>
                                </Form.Item>
                                <Form.Item className="fm-apply-label">
                                  <Button
                                    disabled={
                                      value.status === "Disputed" ? false : true
                                    }
                                    onClick={() =>
                                      this.setState({
                                        visibleReplyDisputeModal: true,
                                      })
                                    }
                                    type="primary"
                                    size="middle"
                                    className="fm-orng-btn mr-10"
                                  >
                                    Reply Dispute
                                  </Button>
                                </Form.Item>
                                <Form.Item className="fm-apply-label">
                                  <Button
                                    onClick={() =>
                                      this.setState({
                                        visibleReviewModal: true,
                                      })
                                    }
                                    type="primary"
                                    size="middle"
                                    className="fm-orng-btn mr-10"
                                  >
                                    View Rating
                                  </Button>
                                </Form.Item> */}
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
                    className="align-right booking-right-section "
                  >
                    <div className="bokng-hsty-hour-price">
                      <div className="price fs-11">
                        <span className="fm-eventb-month date-time-new">
                          {moment(value.created_at).format("MMM DD, YYYY")}<br />
                          {convertTime24To12Hour(value.from)} -{" "}
                          {convertTime24To12Hour(value.to)}
                        </span>
                        {/* {displayDateTimeFormate(value.created_at)} */}
                      </div>
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
                    </Col>
                    {/* <div
                        className="fs-12 ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24 pl-25"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          textAlign:"left",
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
                      </div> */}
                  </Col>
                </Row>
              </div>
            );
          })}
          {/* <Pagination
            defaultCurrent={this.state.page}
            defaultPageSize={this.state.defaultPageSize} //default size of page
            onChange={this.handlePageChange}
            total={totalHistories} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={"mb-20"}
          /> */}

          {showMoreHistory && (

            <div className="show-more">
              <a onClick={(e) => this.handlePageChange(e)} className="show-more" >
                Show More
              </a>
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

  submitDispute = (values) => {
    const { selectedHistoryId, key, selectedBookingId } = this.state;
    this.props.enableLoading();
    let selectedId = Number(key) === 2 ? selectedBookingId : selectedHistoryId;
    console.log("selectedId: ", selectedId);
    this.props.raiseCustomerHandymanDispute(
      {
        trader_job_id: selectedId,
        reason: values.other_reason ? values.other_reason : values.reason,
      },
      (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, langs.messages.dispute_send_sucess);
          this.setState({ visibleDisputeModal: false });
        }
      }
    );
  };

  cancelBooking = (values) => {
    const { selectedBookingId } = this.state;
    this.props.enableLoading();
    this.props.customerCancelQuoteRequest(
      {
        trader_job_id: selectedBookingId,
        status: "Cancelled",
        reason: values.other_reason ? values.other_reason : values.reason,
      },
      (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, langs.messages.cancel_booking);
          this.setState({ visibleCancelModal: false });
        }
      }
    );
  };

  submitDisputeReply = (values) => {
    const { selectedHistoryId, key, selectedBookingId } = this.state;
    this.props.enableLoading();
    let selectedId = Number(key) === 2 ? selectedBookingId : selectedHistoryId;
    this.props.raiseCustomerHandymanDisputeReply(
      { job_id: selectedId, message: values.message },
      (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, langs.messages.dispute_send_sucess);
          this.setState({ visibleReplyDisputeModal: false });
        }
      }
    );
  };

  submitReview = (values) => {
    const { selectedHistoryId } = this.state;
    this.props.enableLoading();
    this.props.submitHandymanReview(
      {
        job_id: selectedHistoryId,
        rated_by: "customer",
        review: values.review,
        rating: values.rating,
      },
      (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, langs.messages.review_sucess);
          this.setState({ visibleReviewModal: false });
        }
      }
    );
  };

  onChangeBookingListDurationFilter = (view) => {
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
          bookingListCalenderView: view,
          selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
          customerEnquiryList: [],
          totalRecordCustomerEnquires: 0,
          bookingList: [],
          totalBookings: 0,
          historyList: [],
          totalHistories: 0,
        },
        () => {
          // if (view === "week") {
          //   this.createWeekCalender();
          // }

          if (Number(activeTab) === 1) {
            this.getCustomerEnquiryList(1);
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
    if (bookingResponse !== "") {
      let cancelReasonArray = CANCELLATION_REASON;

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
    }
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
  onSubmitCancelBookingDeclineForm = (values) => {
    //console.log(`onSubmitCancelEnquiryForm`, values);
    //console.log('selectedEnquiryDetail', this.state.selectedBookingDetail)

    console.log("iffffffffff",this.state.selectedEnquiryDetail)
    if(this.state.selectedEnquiryDetail !== null){

      const reqData = {
        trader_quote_request_id:
        this.state.selectedEnquiryDetail.quote_request_id,

      reason: values.cancelreason,
      comments: values.other_reason,
    };
    // console.log(`onSubmitCancelEnquiryForm`, reqData);
    this.props.enableLoading();
    this.props.customerCancelQuoteRequest(reqData, (res) => {
      console.log(`decline enquiry res`, res);
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success("Success", res.data.message);
        this.setState(
          {
            declineEnquiryModal: false,
            page: "1",
            customerEnquiryList: [],
            totalRecordCustomerEnquires: 0,
          },
          () => {
            this.getCustomerEnquiryList(1);
          }
        );
      } else {
        toastr.error("Error occured", "Please try after some time.");
      }
    });    
  }else{
    // this.props.enableLoading();
    // console.log(`onSubmitCancelEnquiryForm`, reqData);
    const reqData = {
       trader_job_id: this.state.selectedBookingDetail.id ,
      status: "Cancelled",
      reason: values.cancelreason,
      comments: values.other_reason,
    };
    this.props.enableLoading();
    this.props.changeJobStatus(reqData, (res) => {
      console.log(`decline enquiry res`, res);
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success("Success", res.data.message);
        this.setState(
          {
            declineEnquiryModal: false,
            page: "1",
            bookingList: [],
            totalBookings: 0,
          },
          () => {
            this.getJobList(1);
          }
        );
      } else {
        toastr.error("Error occured", "Please try after some time.");
      }
    });
  }
  };





  onSubmitCancelBookingForm = (values) => {
    console.log(values, "submit values")
    const reqData = {
      trader_job_id: this.state.selectedBookingId,
      status: "Cancelled",
      reason: values.cancelreason,
      comment: values.other_reason,
    };
    this.props.enableLoading();

    this.props.changeJobStatus(reqData, (res) => {
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
        toastr.error("Error occured", "Please try after some time.",res.data.message);
      }
    });
  };

  /**
   * @method getDetails
   * @description get details
   */
  getBookingDetails = (trader_id) => {
    const { isLoggedIn, loggedInUser } = this.props;
    let reqData = {
      id: trader_id,
      user_id: isLoggedIn ? loggedInUser.id : "",
      filter: "top_rated",
      login_user_id: isLoggedIn ? loggedInUser.id : "",
    };
    this.props.getBookingDetails(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({
          bookingDetail: res.data.data,
          // allData: res.data,
          // is_favourite: is_favourite,
          // selectedBeautyServiceOption: initialBeautyService
        });
      }
    });
  };

  deleteCustomerHandymanHistoryBooking = (job_id) => {
    const { userDetails } = this.props;
    let reqData = {
      job_id,
      user_id: userDetails.id,
    };
    this.props.enableLoading();
    this.props.deleteCustomerHandymanHistoryBooking(reqData, (res) => {
      this.props.disableLoading();
      console.log(`delete history res`, res);
      if (res.status === 200) {
        toastr.success("Success", "Deleted successfully.");
        this.setState(
          {
            confirmDeleteBooking: false,
            page: "1",
            historyList: [],
            totalHistories: 0,
          },
          () => {
            this.getHistoryList(1);
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
      totalBookings,
      totalEnquiry,
      visibleDisputeModal,
      visibleReviewModal,
      visibleReplyDisputeModal,
      selectedBookingId,
      selectedBookingDetail,
      totalHistories,
      selectedEnquiryId,
      activeTab,
      page,
      visibleRescheduleModal,
      visibleCreateQuoteModal,
      selectedHistoryDetail,
      visibleRespondToQuoteModal,
      selectedEnquiryDetail,
      declineEnquiryModal,
      showEditBookingOptions,
      bookingCancelConfirmModal,
      showChangeDateModal,
      showChangeDateSuccessModal,
      bookingCancellationModal,
      bookingDetail,
      receiptModalEventBooking,
      confirmDeleteBooking,
      leaveReviewModal,
      bookingListCalenderView,
      historyView,
      selectedHistoryId,
      historyList,
      showMoreHistory
    } = this.state;

    console.log(bookingDetail, "boking")

    console.log(selectedBookingId, "job_id")
    console.log(this.state.bookingList, "bookiinglist")
    console.log(selectedHistoryDetail, "historyList")
    console.log(this.state.checkblank, "checkblank")
    console.log("AAAAAAAAAA", showMoreHistory)

    let selectedDetail;
    if (activeTab == "1") {
      selectedDetail = selectedEnquiryDetail;
    } else if (activeTab == "2") {
      selectedDetail = selectedBookingDetail;
    } else if (activeTab == "3") {
      selectedDetail = selectedHistoryDetail;
    }
    const { customerRating, showReviewModal, visibleCancelModal } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };

    return (
      <Layout className="event-booking-profile-wrap">
        <Layout>
          <Layout>

            <div
              className="my-profile-box view-class-tab shadow-none"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking pf-user-event-booking mt-0">
                  <Row className="tab-full">
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
                          st
                        >
                          <TabPane tab="Enquiries" key="1">
                            <h3 className="total-activity date-today">
                              Today {moment().format("dddd, DD MMMM")}
                            </h3>
                            {this.renderUpcomingEnquiries()}
                          </TabPane>
                          <TabPane tab="Bookings" key="2">
                            <h3 className="total-activity">
                              You have{" "}
                              {this.state.totalBookings}{" "}
                              activities
                            </h3>
                            {this.renderUpcomingBookings()}
                          </TabPane>
                          <TabPane tab="History" key="3">
                            <h3 className="total-activity">
                              You have{" "}
                              {this.state.totalHistories}{" "}
                              activities
                            </h3>
                            {this.renderHistoryBooking()}
                          </TabPane>
                        </Tabs>
                        <div className="card-header-select">
                          <label>Show:</label>
                          {activeTab == 3 ? (
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
            <DisputeModal
              submitDispute={this.submitDispute}
              handleClose={() => this.setState({ visibleDisputeModal: false })}
              visibleDisputeModal={visibleDisputeModal}
              selectedBookingId={selectedBookingId}
            />
            <ReplyDisputeModal
              submitDispute={this.submitDisputeReply}
              handleClose={() =>
                this.setState({ visibleReplyDisputeModal: false })
              }
              visibleDisputeModal={visibleReplyDisputeModal}
              selectedBookingId={selectedBookingId}
            />
            {selectedHistoryDetail && (
              <ReviewModal
                submitReview={this.submitReview}
                handleClose={() => this.setState({ visibleReviewModal: false })}
                visibleReviewModal={visibleReviewModal}
                valid_customer_rating={
                  selectedHistoryDetail.valid_customer_rating
                }
              />
            )}
            <CancelModal
              submitDispute={this.cancelBooking}
              handleClose={() => this.setState({ visibleCancelModal: false })}
              visibleDisputeModal={visibleCancelModal}
              selectedBookingId={selectedBookingId}
            />

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

            {(selectedBookingId || selectedEnquiryId) &&
              visibleRespondToQuoteModal && (
                <Modal
                  // title="Create Quote"
                  visible={visibleRespondToQuoteModal}
                  className={
                    "custom-modal fm-md-modal style1 send-quote-popup respond-to-quote"
                  }
                  footer={false}
                  onCancel={() => {
                    this.setState({ visibleRespondToQuoteModal: false });
                  }}
                >
                  <div className="order-profile">
                    <div className="profile-pic booking-profile">
                      <img
                        alt="test"
                        src={
                          selectedDetail.trader_user.image
                            ? selectedDetail.trader_user.image
                            : require("../../../../assets/images/avatar3.png")
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = require("../../../../assets/images/avatar3.png");
                        }}
                      />
                    </div>
                    <div className="profile-name">
                      {selectedDetail.trader_user.name}
                      <div className="trader-se">
                        {selectedDetail.trader_service.name}
                      </div>
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
                            {selectedDetail.description}
                          </div>
                          <Input
                            disabled
                            addonBefore="AUD$"
                            placeholder={"Type your quote here"}
                            enterButton="Search"
                            className="shadow-input"
                            defaultValue={
                              activeTab == "1"
                                ? selectedDetail.quotes[0].amount
                                  ? selectedDetail.quotes[0].amount
                                  : "0.0"
                                : selectedDetail.cost
                                  ? selectedDetail.cost
                                  : "0.0"
                            }
                          />
                        </div>
                      </Form.Item>
                      <div className="fm-eventb-btn mt-20">
                        <Button
                          type="default"
                          className="fm-orng-outline-btn mr-15"
                          disabled={
                            selectedDetail.status === "Rejected" ? true : false
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
                              pathname: `/my-bookings/handyman-booking-details/${selectedDetail.id}`,
                              state: {
                                hideCheckout: false,
                                booking_type: "handyman",
                                service_booking_id: selectedDetail.id,
                                isBooking: activeTab == "1" ? false : true,
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
                className={
                  "custom-modal style1 cancellation-reason-modal decline"
                }
                footer={false}
                onCancel={() => this.setState({ declineEnquiryModal: false })}
                destroyOnClose={true}
              >
                <div className="content-block">
                  <Form {...layout2} onFinish={this.onSubmitCancelBookingDeclineForm}>
                    <h2>Reason to Decline</h2>
                    <h4>Why are you declining this quote?</h4>
                    <Form.Item
                      label=""
                      name="cancelreason"
                      rules={[required("")]}
                    >
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
                onCancel={() =>
                  this.setState({ showEditBookingOptions: false })
                }
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
                onCancel={() =>
                  this.setState({ bookingCancelConfirmModal: false })
                }
                destroyOnClose={true}
              >
                <div
                  className="content-block"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    margin: "0",
                    border: "none",
                  }}
                >
                  <div
                    className="cancel-top-section"
                    style={{
                      borderBottom: "1px solid #E3E9EF",
                      marginBottom: "25px",
                      paddingBottom: "25px",
                    }}
                  >
                    <ExclamationCircleOutlined />
                    <span>
                      If you cancel within 24 hours of the scheduled booking,
                      50% of the fee will still be charged.
                    </span>
                  </div>

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
                onCancel={() =>
                  this.setState({ bookingCancellationModal: false })
                }
                destroyOnClose={true}
              >
                <div className="content-block">
                  <Form {...layout} onFinish={this.onSubmitCancelBookingForm}>
                    <h2>Please choose a reason for cancellation</h2>
                    <Form.Item
                      className="cancel-reason"
                      label=""
                      name="cancelreason"
                      rules={[required("")]}
                    >
                      <Radio.Group onChange={this.onChangeBookingCancelReason}>
                        {this.renderCancelReasonOptions(selectedBookingDetail)}
                      </Radio.Group>
                    </Form.Item>
                    {/* {this.state.isOtherCancelResaon && ( */}
                    <Form.Item
                      className="other-reason-message"
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
                handleClose={() =>
                  this.setState({ showChangeDateModal: false })
                }
                visibleRescheduleModal={showChangeDateModal}
                selectedBookingId={selectedBookingId}
                page={page}
                selectedBookingDetail={selectedBookingDetail}
                isFromBooking={true}
                booking={this.state.bookingList}
                onChangeSuccess={() => {
                  this.setState(
                    {
                      showChangeDateModal: false,
                      page: "1",
                      bookingList: [],
                      totalBookings: 0,
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
                className={"custom-modal style1 cancellation-reason-modal"}
                footer={false}
                onCancel={() =>
                  this.setState({ showChangeDateSuccessModal: false })
                }
                destroyOnClose={true}
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
                      justifyContent: "space-around",
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
            {bookingDetail && leaveReviewModal && (
              <LeaveReviewModel
                visible={leaveReviewModal}
                onCancel={() => {
                  this.setState({ leaveReviewModal: false });
                }}
                type="Event"
                // bookingDetail={selectedHistoryDetail && selectedHistoryDetail}
                bookingDetail={selectedHistoryDetail}
                booking_type="handyman"
                // ratingId={this.state.historyList}

                // selectedHistoryDetail && {
                //   id: selectedHistoryDetail.id,
                //   // user: selectedHistoryDetail.trader_profile.user,
                //   name: selectedHistoryDetail.trader_user.name,
                //   // image_thumbnail:
                //   //   selectedHistoryDetail.trader_profile.user.image_thumbnail,
                // }
                // }
                // callNext={this.getDetails}
                callNext={() => {
                  this.setState(
                    {
                      leaveReviewModal: false,
                      page: "1",
                      historyList: [],
                      totalHistories: 0,
                    },
                    () => {
                      this.getHistoryList(1);
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
                enquiryDetails={selectedHistoryDetail}
                booking_type={"handyman"}
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
                    <button className="btn-orange-fill ant-btn-default"
                      onClick={() =>
                        this.deleteCustomerHandymanHistoryBooking(
                          selectedHistoryId
                        )
                      }
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
  listCustomerHandymanHistory,
  enableLoading,
  disableLoading,
  getCustomerMyBookingsCalender,
  beautyServiceBookingsRating,
  listCustomerHandymanBookings,
  listCustomerHandymanQuote,
  listCustomerHandymanEnquiryDetail,
  listCustomerHandymanBookingsDetail,
  listCustomerHandymanHistoryDetail,
  changeQuoteStatus,
  changeJobStatus,
  raiseCustomerHandymanDispute,
  raiseCustomerHandymanDisputeReply,
  submitHandymanReview,
  declineEnquiryByCustomer,
  customerServiceBookingResponse,
  getBookingDetails,
  customerCancelQuoteRequest,
  deleteCustomerHandymanHistoryBooking,
})(withRouter(MyBookings));
