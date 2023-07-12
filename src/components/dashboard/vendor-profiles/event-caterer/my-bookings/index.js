import React, { Fragment } from "react";
import {
  SearchOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Col,
  Input,
  Layout,
  Avatar,
  Calendar,
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
  DatePicker,
  TimePicker,
  Checkbox,
} from "antd";
import {
  enableLoading,
  disableLoading,
  getCatererEnquiry,
  getCatererEnquiryDetail,
  declineEventEnquiry,
  getCatererBookings,
  getCatererBookingDetail,
  changeEventBookingStatus,
  getCatererHistoryList,
  catererJobDone,
  raiseCatererDispute,
  replyCatererDispute,
  submitCatererReview,
  eventVenderCalendarBookings,
  DeleteEventBookingapi,
  deleteEventEnquiry,
  getAllChat,
} from "../../../../../actions";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import { toastr } from "react-redux-toastr";
import { MESSAGES } from "../../../../../config/Message";
import { langs } from "../../../../../config/localization";
import "./profile-vendor-handyman.less";
import {
  displayDateTimeFormate,
  convertTime24To12Hour,
  displayCalenderDate,
} from "../../../../../components/common";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import RescheduleModal from "./BookingRescheduleModal";
import DisputeModal from "../../common-modals/DisputeModal";
import ReplyDisputeModal from "../../common-modals/ReplyDisputeModal";
import ReviewModal from "../../common-modals/ReviewModal";
import moment from "moment";
import { blankCheck } from "../../../../common";
import { getStatusColor } from "../../../../../config/Helper";
import SendMessageModal from "../../../../classified-templates/common/modals/SendMessageModal";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

class ProfileVendorHandyman extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibleM: false,
      customerBookingList: [],
      page: "1",
      order: "desc",
      page_size: 1000,
      customer_id: "",
      key: 1,
      customerBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      customerCalenderBookingList: [],
      enquiryList: [],
      enquiryListCopy: [],
      totalEnquiry: 0,
      selectedEnquiryId: "",
      selectedEnquiryDetail: "",
      bookingList: [],
      totalBookings: 0,
      selectedBookingId: "",
      selectedBookingDetail: "",
      historyList: [],
      totalHistories: 0,
      selectedHistoryId: "",
      selectedHistoryDetail: "",
      activeTab: 1,
      visibleRescheduleModal: false,
      visibleCreateQuoteModal: false,
      visibleReplyDisputeModal: false,
      visibleReviewModal: false,
      visibleDisputeModal: false,
      customerCalenderBookingList: [],
      calenderView: "month",
      weeklyDates: [],
      currentvalue: {},
      visibleQuoteSuccessModal: false,
      checked: "I have changed my mind",
      message: "",
      cancelBookingVisible: false,
      bookingListCopy: [],
      historyListCopy: [],
      messagess: [],
      filterdata: "",
      arrayy: [],
    };
    console.log(this.state.customerCalenderBookingList, "customerrr");
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
      visibleM: false,
    });
  };
  sendMessageModal = () => {
    this.setState({
      visibleM: true,
    });
  };

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { page } = this.state;
    this.props.enableLoading();
    this.getEnquiries(page);
    this.getBookingsForCalenderDate(new Date());

    this.props.enableLoading();
    const { id } = this.props.loggedInUser;
    let reqData = {
      user_id: id,
      sort_type: "",
    };
    this.props.getAllChat(reqData, (res) => {
      //  console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", res.data.data);

      this.props.disableLoading();

      if (res.status === STATUS_CODES.OK && Array.isArray(res.data.data)) {
        this.setState({ messagess: res.data.data });
      }
    });
    //   console.log("&&&&&&&&&&&&&&&&&&&&&&&&&", this.state.messagess);
  }

  onTabChange = (key, type) => {
    console.log("activeTab ", this.state.activeTab);
    this.setState({ activeTab: key });
    console.log("activeTab ", this.state.activeTab);
    console.log("this keys", key);
    if (key == "1") {
      window.location.reload();

      this.getEnquiries(1);
    } else if (key == "2") {
      this.getJobList(1);
    } else if (key == "3") {
      this.getHistoryList(1);
    }
    this.setState({
      enquiryList: [],
      enquiryListCopy: [],
      bookingList: [],
      bookingListCopy: [],
      historyList: [],
      historyListCopy: [],
      page: "1",
    });
  };

  handleBookingPageChange = (e) => {
    this.setState({ filterdata: e.target.value });
  };

  DeleteEventBooking = (id) => {
    const { activeTab } = this.state;
    let reqData = {
      event_booking_id: id,
      user_id: this.props.loggedInUser.id,
    };

    this.props.DeleteEventBookingapi(reqData, (res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, "Successfully deleted");
        if (activeTab == "1") {
          this.getEnquiries(1);
        } else if (activeTab == "2") {
          this.getJobList(1);
        } else if (activeTab == "3") {
          this.getHistoryList(1);
        }
      }
    });
  };

  DeleteEventEnquiry = (id, enq_id) => {
    const { activeTab } = this.state;
    let reqData = {
      enquire_response_id: id,
      user_id: this.props.loggedInUser.id,
      enquire_id: enq_id,
    };

    this.props.deleteEventEnquiry(reqData, (res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, "Successfully deleted");
        if (activeTab == "1") {
          this.getEnquiries(1);
        } else if (activeTab == "2") {
          this.getJobList(1);
        } else if (activeTab == "3") {
          this.getHistoryList(1);
        }
      }
    });
  };

  getEnquiries = (page) => {
    const { id } = this.props.loggedInUser;
    const reqData = {
      page: page,
      page_size: this.state.page_size,
      user_id: id, //657
    };
    this.props.enableLoading();
    this.props.getCatererEnquiry(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        // let l = res.data.data.length;
        // let tmp = res.data.data;
        // if (l > +page * +this.state.page_size) {
        //   l = l - +page * +this.state.page_size;
        //   this.setState({
        //     page: +page,
        //   });
        //   tmp = res.data.data.slice(l);
        // }
        let tmp = res.data.data;
        this.setState({
          enquiryList: tmp,
          enquiryListCopy: tmp,
          totalEnquiry: Array.isArray(res.data.data) ? res.data.data.length : 0,
        });
      }
    });
  };

  getJobList = (page) => {
    this.props.enableLoading();
    this.props.getCatererBookings((res) => {
      this.props.disableLoading();
      console.log(res, "resssssssssssss");
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        let l = res.data.data.length;
        let tmp = res.data.data;
        if (l > +page * +this.state.page_size) {
          l = l - +page * +this.state.page_size;
          this.setState({
            page: +page,
          });
          tmp = res.data.data.slice(l);
        }
        this.setState({
          bookingList: tmp,
          bookingListCopy: tmp,
          totalBookings: Array.isArray(res.data.data)
            ? res.data.data.length
            : 0,
        });
      }
    });
  };

  getHistoryList = (page) => {
    const { id } = this.props.loggedInUser;
    const reqData = {
      page: page,
      // order_by: 'customer_rating',
      page_size: this.state.page_size,
      // order: 'asc',
      user_id: id, //657
    };
    this.props.enableLoading();
    this.props.getCatererHistoryList(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        let l = res.data.data.length;
        let tmp = res.data.data;
        console.log("temp history list", tmp);
        if (l > +page * +this.state.page_size) {
          l = l - +page * +this.state.page_size;
          this.setState({
            page: +page,
          });
          tmp = res.data.data.slice(l);
        }
        this.setState({
          historyList: tmp,
          historyListCopy: tmp,
          totalHistories: Array.isArray(res.data.data)
            ? res.data.data.length
            : 0,
        });
      }
    });
  };

  handlePageChange = (e) => {
    const { activeTab, page } = this.state;
    // this.setState({ page: +page + 1 });
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

  displayReviewRatingSection = (data) => {
    if (data.status == "Completed" && data.valid_trader_rating != null) {
      return <Rate defaultValue={0.0} />;
    } else {
      return (
        <span className="fm-btndeleteicon">
          {/* <img src={require('../../../../../assets/images/icons/delete.svg')} alt='delete' /> */}
          <Button type="default" className="success-btn">
            {data.status}
          </Button>
        </span>
      );
    }
  };

  getAllDieteris = (dietery) => {
    let dList = dietery.map((d) => d.name);
    return dList.toString();
  };

  compare = (a, b) => {
    if (a.created_at < b.created_at) {
      return -1;
    }
    if (a.created_at > b.created_at) {
      return 1;
    }
    return 0;
  };

  sortlist = (e) => {
    const { enquiryList, bookingList, historyList, activeTab } = this.state;
    let tmp;
    if (activeTab == "1") {
      tmp = enquiryList;
    } else if (activeTab == "2") {
      tmp = bookingList;
    } else if (activeTab == "3") {
      tmp = historyList;
    }
    let result;
    switch (e) {
      case "pending":
        result = tmp.filter((list) => list.status === "Pending");
        break;
      case "rejected":
        result = tmp.filter((list) => list.status === "Rejected");
        break;
      case "response":
        result = tmp.filter((list) => list.status === "Response");
        break;
      case "quotesent":
        result = tmp.filter((list) => list.status === "Quote Sent");
        break;
      case "declined":
        result = tmp.filter((list) => list.status === "Declined");
        break;
      case "cancelled":
        result = tmp.filter((list) => list.status === "Cancelled");
        break;
      case "completed":
        result = tmp.filter((list) => list.status === "Completed");
        break;
      default:
        result = tmp.sort(this.compare);
        break;
    }
    if (activeTab == "1") {
      this.setState({
        enquiryListCopy: result,
      });
    } else if (activeTab == "2") {
      this.setState({
        bookingListCopy: result,
      });
    } else if (activeTab == "3") {
      this.setState({
        historyListCopy: result,
      });
    }
  };

  renderUpcomingEnquiries = () => {
    const {
      enquiryListCopy,
      totalEnquiry,
      selectedEnquiryId,
      selectedEnquiryDetail,
      visibleM,
    } = this.state;
    const messageIcon = this.state.messagess.filter((idd) => {
      return idd.unread_count >= 1;
    });
    const dataSearch = enquiryListCopy.filter((item) => {
      return (
        item.title
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });

    const current = new Date();
    const date = `${current.getDate()}/${
      current.getMonth() + 1
    }/${current.getFullYear()}`;

    if (enquiryListCopy.length) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            let match_date = moment(value.created_at).format("DD/MM/YYYY");

            return !(
              value.eb_status == null ||
              value.eb_status == "Accepted-Paid" ||
              value.eb_status == "Amount-Paid-Pending" ||
              value.eb_status == "Pending"
            ) ? null : (
              <div
                className="my-new-order-block"
                key={i}
                onClick={() => {
                  if (selectedEnquiryId !== value.enquire_response_id) {
                    this.props.getCatererEnquiryDetail(
                      { id: value.enquire_response_id },
                      (res) => {
                        if (res.status === STATUS_CODES.OK) {
                          this.setState({
                            selectedEnquiryId: value.enquire_response_id,
                            selectedEnquiryDetail: res.data.data,
                            currentvalue: value,
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
                    className="order-block-left"
                  >
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                        <div className="odr-no">
                          <h4>Quote Request</h4>
                          <span className="pickup">{value.event_type} </span>
                        </div>
                        <div className="order-profile">
                          <div className="profile-pic">
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
                          {messageIcon.map((el) => {
                            return el.id == value.enquire_response_id ? (
                              <div className="message-notifications">
                                <a href="/message">
                                  <i className="custom-badge"></i>
                                  <svg
                                    width="17"
                                    height="14"
                                    viewBox="0 0 17 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                      d="M1.40833 1.66667L1.4 11.6667C1.4 11.6668 1.4 11.6666 1.4 11.6667C1.40019 11.81 1.52331 11.9333 1.66667 11.9333H15C15.1435 11.9333 15.2667 11.8101 15.2667 11.6667V1.66667C15.2667 1.5232 15.1435 1.4 15 1.4H1.66667C1.53232 1.4 1.40833 1.51405 1.40833 1.66667ZM0.00833333 1.66667L0 11.6667C0 12.5833 0.75 13.3333 1.66667 13.3333H15C15.9167 13.3333 16.6667 12.5833 16.6667 11.6667V1.66667C16.6667 0.75 15.9167 0 15 0H1.66667C0.75 0 0.00833333 0.75 0.00833333 1.66667Z"
                                      fill="#515C61"
                                    />
                                    <path
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                      d="M0.389648 2.33128L1.27717 1L8.33341 5.70416L15.3896 1L16.2772 2.33128L8.33341 7.62712L0.389648 2.33128Z"
                                      fill="#515C61"
                                    />
                                  </svg>
                                </a>
                              </div>
                            ) : (
                              ""
                            );
                          })}
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                        <div className="fm-eventb-date">
                          <h3>Date Requested:</h3>
                          <span className="fm-eventb-month">
                            {moment(value.booking_date, "YYYY-MM-DD").format(
                              "MMMM DD,yy"
                            )}
                          </span>
                          <span className="fm-eventb-time">
                            {moment(value.start_time).format("LT")} -{" "}
                            {moment(value.end_time).format("LT")}
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
                          <Col xs={24} sm={24} md={24} lg={8} xl={16}>
                            <div className="fm-eventb-desc">
                              <h3>Request:</h3>
                              <span className="fm-eventb-content">
                                {value.description}
                              </span>
                            </div>
                          </Col>
                          {value.enquire_response_id === selectedEnquiryId ? (
                            <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                              <div className="">
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Venues:</h3>
                                  <span className="fm-eventb-content">
                                    {blankCheck(
                                      selectedEnquiryDetail.venues_of_event
                                    )}
                                  </span>
                                  <span className="fm-eventb-content">
                                    {blankCheck(
                                      selectedEnquiryDetail.venues_of_address
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
                                  <h3>Dieteries:</h3>
                                  <span className="fm-eventb-content">
                                    {this.getAllDieteris(
                                      selectedEnquiryDetail.all_dietaries
                                    )}
                                  </span>
                                </div>
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Contact Name:</h3>
                                  <span className="fm-eventb-content">
                                    {selectedEnquiryDetail.customer.name}
                                  </span>

                                  <span className="send-message">
                                    <Link onClick={this.sendMessageModal}>
                                      Send Message
                                    </Link>
                                    <SendMessageModal
                                      visible={visibleM}
                                      onCancel={this.handleCancel}
                                      user_data={selectedEnquiryDetail}
                                    />
                                  </span>
                                </div>
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Contact Email:</h3>
                                  <span className="fm-eventb-content">
                                    {selectedEnquiryDetail.customer.email}
                                  </span>
                                </div>
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Phone Number:</h3>
                                  <span className="fm-eventb-content">
                                    {selectedEnquiryDetail.customer.mobile_no}
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
                                </div>
                                {value.status === "Cancelled" && (
                                  <div className="fm-eventb-desc mt-20 rejected-block">
                                    <div className="rj-head">
                                      <CloseCircleOutlined />
                                      <span>BOOKING {value.status}</span>
                                    </div>
                                    <div className="rj-text">
                                      <h3>{value.reasons}</h3>
                                      <h4>Message</h4>
                                      <p>{value.comments}</p>
                                    </div>
                                  </div>
                                )}
                                {(value.status === "Rejected" ||
                                  value.status === "Declined") && (
                                  <div className="fm-eventb-desc mt-20 rejected-block">
                                    <div className="rj-head">
                                      <span>BOOKING {value.status}</span>
                                    </div>
                                    <div className="rj-text">
                                      <h3>{value.reasons}</h3>
                                      <h4>Message</h4>
                                      <p>{value.comments}</p>
                                    </div>
                                  </div>
                                )}
                                {value.status === "Quote Sent" &&
                                  value.eb_status === "Accepted-Paid" && (
                                    <div className="client-accepted-quote">
                                      <i>
                                        <svg
                                          width="14"
                                          height="14"
                                          viewBox="0 0 14 14"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle
                                            cx="7"
                                            cy="7"
                                            r="7"
                                            fill="#2ED47A"
                                          />
                                          <path
                                            d="M4.375 7.23113L6.71217 9.625L10.5 5.25"
                                            stroke="white"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      </i>
                                      <h3>CLIENT ACCEPTED YOUR QUOTE</h3>
                                    </div>
                                  )}
                                {/* <Form.Item className="fm-apply-label">
                                  <span className="fm-arrow-label">Total</span>
                                  <div className="fm-apply-input">
                                    <Input
                                      defaultValue={
                                        Array.isArray(value.quotes) &&
                                        value.quotes.length
                                          ? `$AUD ${value.quotes[0].amount}.00`
                                          : "$AUD 0.00"
                                      }
                                      placeholder={"Type your quote here"}
                                      enterButton="Search"
                                      className="shadow-input"
                                    />
                                    <Button
                                      type="primary"
                                      className="fm-apply-btn"
                                    >
                                      Quote
                                    </Button>
                                  </div>
                                </Form.Item>
                                <div className="fm-eventb-btn mt-20">
                                  <Button
                                    type="default"
                                    className="fm-orng-outline-btn mr-15"
                                    disabled={
                                      value.status === "Rejected" ? true : false
                                    }
                                    onClick={() => {
                                      this.showModal();
                                    }}
                                  >
                                    Decline
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      this.props.declineEventEnquiry(
                                        {
                                          price: value.price ? value.price : 0,
                                          enquire_response_id: selectedEnquiryId,
                                          status: "Accepted",
                                          comments: "",
                                        },
                                        (res) => {
                                          if (res.status === STATUS_CODES.OK) {
                                            toastr.success(
                                              langs.success,
                                              MESSAGES.REQUEST_SENT
                                            );
                                            this.getEnquiries(1);
                                          }
                                        }
                                      );
                                    }}
                                    type="default"
                                    className="fm-orng-btn"
                                  >
                                    Send
                                  </Button>
                                </div> */}
                              </div>
                            </Col>
                          ) : (
                            ""
                          )}
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
                    className="order-block-right"
                  >
                    <Row gutter={0}>
                      <div className="bokng-hsty-hour-price">
                        <span className="fm-eventb-month date">
                          {date === match_date
                            ? "Today"
                            : moment(value.created_at, "YYYY-MM-DD").format(
                                "DD MMMM yy"
                              )}
                        </span>
                        <div className="price mt-5 fs-25">
                          {value.price ? `AU$${value.price}.00` : `AU$ 00.00`}
                        </div>
                      </div>
                    </Row>
                    <Row gutter={0}>
                      {/* {this.displayReviewRatingSection(value)} */}
                      {value.enquire_response_id === selectedEnquiryId &&
                      value.status === "Pending" ? (
                        <Button
                          onClick={() =>
                            this.setState({
                              visibleCreateQuoteModal: true,
                              currentvalue: value,
                            })
                          }
                          type="default"
                          className="fm-orng-btn send-quote-btn"
                        >
                          Send Quote
                        </Button>
                      ) : value.enquire_response_id === selectedEnquiryId &&
                        value.status === "Quote Sent" &&
                        value.eb_status === "Amount-Paid-Pending" ? (
                        <>
                          <Button
                            className="send-quote-btn"
                            onClick={() => {
                              this.props.changeEventBookingStatus(
                                {
                                  event_booking_id: value.eb_id,
                                  status: "Accepted",
                                  reason: "Accepted",
                                },
                                (res) => {
                                  if (res.status === STATUS_CODES.OK) {
                                    toastr.success(
                                      langs.success,
                                      MESSAGES.CONFIRM_HANDYMAN_BOOKING
                                    );
                                    this.setState(
                                      {
                                        selectedEnquiryId: "",
                                        enquiryListCopy: [],
                                      },
                                      () => this.getEnquiries(this.state.page)
                                    );
                                    this.handleCancel();
                                  }
                                }
                              );
                            }}
                            type="default"
                            // className="fm-orng-btn"
                          >
                            Confirm
                          </Button>
                          <Button
                            className="cancel-booking-btn"
                            onClick={() => {
                              this.showModal();
                            }}
                            type="default"
                            // className="fm-orng-btn"
                          >
                            Decline
                          </Button>
                        </>
                      ) : value.enquire_response_id === selectedEnquiryId &&
                        value.status === "Accepted" ? (
                        <>
                          <Button
                            className="send-quote-btn"
                            onClick={() => {
                              this.props.changeEventBookingStatus(
                                {
                                  event_booking_id: value.enquire_response_id,
                                  status: "Booking-Done",
                                  reason: "Booking-Done",
                                },
                                (res) => {
                                  if (res.status === STATUS_CODES.OK) {
                                    toastr.success(
                                      langs.success,
                                      MESSAGES.CONFIRM_HANDYMAN_BOOKING
                                    );
                                    this.setState(
                                      {
                                        selectedEnquiryId: "",
                                        enquiryListCopy: [],
                                      },
                                      () => this.getEnquiries(this.state.page)
                                    );
                                    this.handleCancel();
                                  }
                                }
                              );
                            }}
                            type="default"
                            // className="fm-orng-btn"
                          >
                            Mark as Complete
                          </Button>
                          <Button
                            className="cancel-booking-btn"
                            onClick={() => {
                              this.showModal();
                            }}
                            type="default"
                            // className="fm-orng-btn"
                          >
                            Cancel Booking
                          </Button>
                        </>
                      ) : (
                        <>
                          {(value.status == "Rejected" ||
                            value.status == "Declined" ||
                            value.status == "Cancelled") && (
                            <i
                              className="trash-icon"
                              onClick={() => {
                                this.DeleteEventEnquiry(
                                  value.enquire_response_id,
                                  value.enquire_id
                                );
                                this.setState({ selectedEnquiryId: "" });
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
                              value.status == "Accepted"
                                ? "Confirmed"
                                : value.status == "Quote Sent" &&
                                  value.eb_status == "Amount-Paid-Pending"
                                ? "Response"
                                : value.status
                            )}
                            //  className='success-btn'
                          >
                            {value.status == "Accepted"
                              ? "Confirmed"
                              : value.status == "Quote Sent" &&
                                value.eb_status == "Amount-Paid-Pending"
                              ? "Response"
                              : value.status == "Quote Sent"
                              ? "Quote Sent"
                              : value.status}
                          </Button>
                        </>
                      )}
                    </Row>
                    {value.enquire_response_id === selectedEnquiryId && (
                      <Row>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (
                              selectedEnquiryId === value.enquire_response_id
                            ) {
                              this.setState({ selectedEnquiryId: "" });
                            }
                          }}
                        />
                      </Row>
                    )}
                  </Col>
                </Row>
              </div>
            );
          })}

          {/* <div className="btn-show-block">
            <a onClick={(e) => this.handlePageChange(e)} className="show-more">
              Show More
            </a>
          </div> */}
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
      bookingListCopy,
      totalBookings,
      selectedBookingId,
      selectedBookingDetail,
      visibleM,
    } = this.state;
    const messageIcon = this.state.messagess.filter((idd) => {
      return idd.unread_count >= 1;
    });

    const dataSearch = bookingListCopy.filter((item) => {
      return (
        item.customer.name
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });
    if (bookingListCopy.length) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            return (
              <div
                className="my-new-order-block "
                key={i}
                onClick={() => {
                  if (selectedBookingId !== value.event_booking_id) {
                    this.props.getCatererBookingDetail(
                      { id: value.event_booking_id },
                      (res) => {
                        if (res.status === STATUS_CODES.OK) {
                          this.setState({
                            selectedBookingId: value.event_booking_id,
                            selectedBookingDetail: res.data.data,
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
                    lg={17}
                    xl={17}
                    className="order-block-left"
                  >
                    <Row gutter={0}>
                      <div className="odr-no">
                        <h4>Upcoming</h4>
                        <span className="pickup">{value.event_name}</span>
                      </div>
                      <div className="order-profile mt-10 mb-10">
                        <div className="profile-pic">
                          <img
                            alt="test"
                            src={
                              value.customer.image
                                ? value.customer.image
                                : require("../../../../../assets/images/avatar3.png")
                            }
                          />
                        </div>
                        <div className="profile-name">{value.title}</div>
                        {messageIcon.map((el) => {
                          return el.id == value.event_booking_id ? (
                            <div className="message-notifications">
                              <a href="/message">
                                <i className="custom-badge"></i>
                                <svg
                                  width="17"
                                  height="14"
                                  viewBox="0 0 17 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.40833 1.66667L1.4 11.6667C1.4 11.6668 1.4 11.6666 1.4 11.6667C1.40019 11.81 1.52331 11.9333 1.66667 11.9333H15C15.1435 11.9333 15.2667 11.8101 15.2667 11.6667V1.66667C15.2667 1.5232 15.1435 1.4 15 1.4H1.66667C1.53232 1.4 1.40833 1.51405 1.40833 1.66667ZM0.00833333 1.66667L0 11.6667C0 12.5833 0.75 13.3333 1.66667 13.3333H15C15.9167 13.3333 16.6667 12.5833 16.6667 11.6667V1.66667C16.6667 0.75 15.9167 0 15 0H1.66667C0.75 0 0.00833333 0.75 0.00833333 1.66667Z"
                                    fill="#515C61"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M0.389648 2.33128L1.27717 1L8.33341 5.70416L15.3896 1L16.2772 2.33128L8.33341 7.62712L0.389648 2.33128Z"
                                    fill="#515C61"
                                  />
                                </svg>
                              </a>
                            </div>
                          ) : (
                            ""
                          );
                        })}
                      </div>
                    </Row>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Row gutter={0}>
                          <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                            <div className="fm-eventb-date">
                              <h3>Created Date:</h3>
                              <span className="fm-eventb-month">
                                {value.created_at
                                  ? moment(
                                      value.created_at,
                                      "YYYY-MM-DD"
                                    ).format("MMMM DD,yy")
                                  : ""}
                              </span>
                              {/* <span className="fm-eventb-time">{moment(value.from, "hh:mm:ss").format('LT')} - {moment(value.to, "hh:mm:ss").format('LT')}</span> */}
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
                              <Col xs={24} sm={24} md={24} lg={8} xl={16}>
                                <div className="fm-eventb-desc">
                                  <h3>Request:</h3>
                                  <span className="fm-eventb-content">
                                    {value.description}
                                  </span>
                                </div>
                              </Col>
                              {value.event_booking_id === selectedBookingId ? (
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
                                          selectedBookingDetail.venue_of_address
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
                                      <h3>Dieteries:</h3>
                                      <span className="fm-eventb-content">
                                        {this.getAllDieteris(
                                          selectedBookingDetail.all_dietaries
                                        )}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Contact Name:</h3>
                                      <span className="fm-eventb-content">
                                        {selectedBookingDetail.customer.name}
                                      </span>
                                      <span className="send-message">
                                        <Link onClick={this.sendMessageModal}>
                                          Send Message
                                        </Link>
                                        <SendMessageModal
                                          visible={visibleM}
                                          onCancel={this.handleCancel}
                                          user_data={selectedBookingDetail}
                                        />
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Contact Email:</h3>
                                      <span className="fm-eventb-content">
                                        {selectedBookingDetail.customer.email}
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
                                    {/* <Form.Item className="fm-apply-label">
                                  <span className="fm-arrow-label">Total</span>
                                  <div className="fm-apply-input">
                                    <Input
                                      defaultValue={
                                        value.price
                                          ? `$AUD ${value.price}.00`
                                          : "$AUD 0.00"
                                      }
                                      placeholder={"Type your quote here"}
                                      enterButton="Search"
                                      className="shadow-input"
                                    />
                                    <Button
                                      type="primary"
                                      className="fm-apply-btn"
                                    >
                                      Quote
                                    </Button>
                                  </div>
                                </Form.Item>
                                <div className="fm-eventb-btn mt-20">
                                  <Button
                                    onClick={() => {
                                      this.props.catererJobDone(
                                        {
                                          event_booking_id:
                                            value.event_booking_id,
                                          status: "Completed",
                                        },
                                        (res) => {
                                          if (res.status === STATUS_CODES.OK) {
                                            toastr.success(
                                              langs.success,
                                              MESSAGES.REQUEST_SENT
                                            );
                                            this.getEnquiries(1);
                                          }
                                        }
                                      );
                                    }}
                                    type="default"
                                    className="fm-orng-btn"
                                  >
                                    Job-Done
                                  </Button>
                                </div> */}
                                  </div>
                                </Col>
                              ) : (
                                ""
                              )}
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
                    lg={7}
                    xl={7}
                    className="align-right order-block-right"
                  >
                    <Row gutter={0}>
                      <div className="bokng-hsty-hour-price">
                        <div className="date mb-0">
                          {moment(value.booking_date, "YYYY-MM-DD").format(
                            "DD MMMM yy"
                          )}
                        </div>
                        <div className="time ">
                          {moment(value.start_time, "hh:mm:ss").format("LT")} -{" "}
                          {moment(value.end_time, "hh:mm:ss").format("LT")}
                        </div>
                        {/* <div className="price ">{(value.price) ? `AU$${value.price}.00` : `AU$0.00`}</div> */}
                      </div>
                    </Row>
                    <Row gutter={0} className="btns-row">
                      <Col>
                        {/* {this.displayReviewRatingSection(value)} */}
                        {/* <Button type='default' className="success-btn">{value.status}</Button> */}
                        {value.event_booking_id === selectedBookingId &&
                        (value.status === "Accepted" ||
                          value.status == "Accepted-Paid") ? (
                          <>
                            <Button
                              className="send-quote-btn"
                              onClick={() => {
                                this.props.changeEventBookingStatus(
                                  {
                                    event_booking_id: value.event_booking_id,
                                    status: "Booking-Done",
                                    reason: "Booking-Done",
                                  },
                                  (res) => {
                                    if (res.status === STATUS_CODES.OK) {
                                      toastr.success(
                                        langs.success,
                                        MESSAGES.CONFIRM_HANDYMAN_BOOKING
                                      );
                                      this.setState(
                                        {
                                          selectedBookingId: "",
                                          bookingListCopy: [],
                                        },
                                        this.getJobList(this.state.page)
                                      );
                                      this.handleCancel();
                                    }
                                  }
                                );
                              }}
                              type="default"
                              // className="fm-orng-btn"
                            >
                              Mark as Complete
                            </Button>
                            <Button
                              className="cancel-booking-btn"
                              onClick={() => {
                                this.showModal();
                              }}
                              type="default"
                              // className="fm-orng-btn"
                            >
                              Cancel Booking
                            </Button>
                          </>
                        ) : value.id === selectedBookingId &&
                          value.status === "Cancelled" ? (
                          <span className="fm-btndeleteicon">
                            <Button
                              className="send-quote-btn"
                              onClick={() => {
                                this.props.changeEventBookingStatus(
                                  {
                                    event_booking_id: value.id,
                                    status: "Cancelled",
                                    reason: "Cancelled",
                                  },
                                  (res) => {
                                    if (res.status === STATUS_CODES.OK) {
                                      toastr.success(
                                        langs.success,
                                        MESSAGES.CONFIRM_HANDYMAN_BOOKING
                                      );
                                      this.setState(
                                        {
                                          selectedBookingId: "",
                                          bookingListCopy: [],
                                        },
                                        () => this.getJobList(this.state.page)
                                      );
                                      this.handleCancel();
                                    }
                                  }
                                );
                              }}
                              type="default"
                              className="send-quote-btn"
                              // className="fm-orng-btn"
                            >
                              Move to History
                            </Button>
                            <Button
                              className="send-quote-btn"
                              onClick={() => {
                                this.DeleteTraderJob(value.id);
                              }}
                              type="default"
                              className="cancel-btn"
                              // className="fm-orng-btn"
                            >
                              Delete
                            </Button>
                          </span>
                        ) : (
                          <>
                            {(value.status == "Rejected" ||
                              value.status == "Declined") && (
                              <i
                                className="trash-icon"
                                onClick={() => {
                                  this.DeleteEventBooking(value.eb_id);
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
                            )}
                            <span className="fm-btndeleteicon">
                              <Button
                                type="default"
                                className={getStatusColor(
                                  value.status == "Accepted" ||
                                    value.status == "Accepted-Paid"
                                    ? "Confirmed"
                                    : value.status
                                )}
                                //  className='success-btn'
                              >
                                {value.status == "Accepted" ||
                                value.status == "Accepted-Paid"
                                  ? "Confirmed"
                                  : value.status == "Quote Sent"
                                  ? "Quote Sent"
                                  : value.status}
                              </Button>
                            </span>
                          </>
                        )}
                      </Col>
                    </Row>
                    {value.event_booking_id === selectedBookingId && (
                      <Row>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (selectedBookingId === value.event_booking_id) {
                              this.setState({ selectedBookingId: "" });
                            }
                          }}
                        />
                      </Row>
                    )}
                  </Col>
                </Row>
              </div>
            );
          })}
          {/* <div className="btn-show-block">
            <a onClick={(e) => this.handlePageChange(e)} className="show-more">
              Show More
            </a>
          </div> */}
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
      historyListCopy,
      totalHistories,
      selectedHistoryId,
      selectedHistoryDetail,
      visibleM,
    } = this.state;
    const dataSearch = historyListCopy.filter((item) => {
      return (
        item.event_name
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });
    if (historyListCopy && historyListCopy.length > 0) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            return (
              <div
                className="my-new-order-block "
                key={i}
                onClick={() => {
                  if (selectedHistoryId !== value.event_booking_id) {
                    this.props.getCatererBookingDetail(
                      { id: value.event_booking_id },
                      (res) => {
                        if (res.status === STATUS_CODES.OK) {
                          this.setState({
                            selectedHistoryId: value.event_booking_id,
                            selectedHistoryDetail: res.data.data,
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
                    className="order-block-left"
                  >
                    <Row gutter={0}>
                      <div className="odr-no">
                        <h4>History</h4>
                        <span className="pickup">{value.event_type.name}</span>
                      </div>
                      <div className="order-profile">
                        <div className="profile-pic">
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
                    </Row>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                        <div className="fm-eventb-date">
                          <h3>Date Requested</h3>
                          <span className="fm-eventb-month">
                            {moment(value.booking_date, "YYYY-MM-DD").format(
                              "DD MMMM yy"
                            )}
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
                        lg={8}
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
                          {value.event_booking_id === selectedHistoryId ? (
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
                                      selectedHistoryDetail.venue_of_address
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
                                  <h3>Dieteries:</h3>
                                  <span className="fm-eventb-content">
                                    {this.getAllDieteris(
                                      selectedHistoryDetail.all_dietaries
                                    )}
                                  </span>
                                </div>
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Contact Name:</h3>
                                  <span className="fm-eventb-content">
                                    {selectedHistoryDetail.customer.name}
                                  </span>
                                  <span className="send-message">
                                    <Link onClick={this.sendMessageModal}>
                                      Send Message
                                    </Link>
                                    <SendMessageModal
                                      visible={visibleM}
                                      onCancel={this.handleCancel}
                                      user_data={selectedHistoryDetail}
                                    />
                                  </span>
                                </div>
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Contact Email:</h3>
                                  <span className="fm-eventb-content">
                                    {selectedHistoryDetail.customer.email}
                                  </span>
                                </div>
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Phone Number:</h3>
                                  <span className="fm-eventb-content">
                                    {selectedHistoryDetail.customer.mobile_no}
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
                                  {selectedHistoryDetail.status ===
                                    "Cancelled" && (
                                    <div className="fm-eventb-desc mt-20 rejected-block">
                                      <div className="rj-head">
                                        <CloseCircleOutlined />
                                        <span>
                                          BOOKING {selectedHistoryDetail.status}
                                        </span>
                                      </div>
                                      <div className="rj-text">
                                        <h3>{selectedHistoryDetail.reasons}</h3>
                                        <h4>Message</h4>
                                        <p>
                                          {selectedHistoryDetail.cancel_comment}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {(selectedHistoryDetail.status ===
                                    "Rejected" ||
                                    selectedHistoryDetail.status ===
                                      "Declined") && (
                                    <div className="fm-eventb-desc mt-20 rejected-block">
                                      <div className="rj-head">
                                        {/* <CloseCircleOutlined />*/}
                                        <span>
                                          STATUS {selectedHistoryDetail.status}
                                        </span>
                                      </div>
                                      <div className="rj-text">
                                        <h3>{selectedHistoryDetail.reasons}</h3>
                                        <h4>Message</h4>
                                        <p>
                                          {selectedHistoryDetail.cancel_comment}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {(selectedHistoryDetail.status ===
                                    "Completed" ||
                                    selectedHistoryDetail.status ===
                                      "Booking-Done") && (
                                    <div className="client-accepted-quote job-completed">
                                      <i>
                                        <svg
                                          width="14"
                                          height="14"
                                          viewBox="0 0 14 14"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle
                                            cx="7"
                                            cy="7"
                                            r="7"
                                            fill="#2ED47A"
                                          />
                                          <path
                                            d="M4.375 7.23113L6.71217 9.625L10.5 5.25"
                                            stroke="white"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      </i>
                                      <h3>Job Completed</h3>
                                    </div>
                                  )}
                                </div>
                                {/* <Form.Item className="fm-apply-label">
                                  <span className="fm-arrow-label">Total</span>
                                  <div className="fm-apply-input">
                                    <Input
                                      defaultValue={
                                        value.price
                                          ? `$AUD ${value.price}.00`
                                          : "$AUD 0.00"
                                      }
                                      placeholder={"Type your quote here"}
                                      enterButton="Search"
                                      className="shadow-input"
                                    />
                                    <Button
                                      type="primary"
                                      className="fm-apply-btn"
                                    >
                                      Quote
                                    </Button>
                                  </div>
                                </Form.Item> */}
                                {/* <div className="fm-eventb-btn mt-20">

                                  <Button
                                    onClick={() => {
                                      this.props.declineEventEnquiry({ price: value.price, enquire_response_id: selectedHistoryId, status: 'Accepted', comments: '' }, (res) => {
                                        if (res.status === STATUS_CODES.OK) {
                                          toastr.success(langs.success, MESSAGES.REQUEST_SENT);
                                          this.getEnquiries(1)
                                        }
                                      })
                                    }}
                                    type='default'
                                    className="fm-orng-btn"
                                  >Send
                      </Button>
                                </div> */}
                                {/* <div className="fm-eventb-btn mt-20">
                                  <Button
                                    type="default"
                                    style={{ maxWidth: "130px" }}
                                    className="fm-orng-outline-btn mr-15"
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
                                  >
                                    Raise Dispute
                                  </Button>
                                  <Button
                                    className="fm-orng-btn"
                                    style={{ maxWidth: "130px" }}
                                    // disabled={value.status === 'Disputed' ? false : true}
                                    onClick={() =>
                                      this.setState({
                                        visibleReplyDisputeModal: true,
                                      })
                                    }
                                    type="default"
                                    size="middle"
                                    className="fm-orng-btn mr-10"
                                  >
                                    Reply Dispute
                                  </Button>

                                  <Button
                                    type="default"
                                    style={{ maxWidth: "130px" }}
                                    onClick={() =>
                                      this.setState({
                                        visibleReviewModal: true,
                                      })
                                    }
                                    className="fm-orng-outline-btn"
                                  >
                                    View Rating
                                  </Button>
                                </div>
                                <div className="fm-eventb-btn mt-20"></div>
                                <div className="fm-eventb-btn mt-20"></div> */}
                              </div>
                            </Col>
                          ) : (
                            ""
                          )}
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
                    className="align-right order-block-right"
                  >
                    <Row gutter={0}>
                      <div className="bokng-hsty-hour-price">
                        <div className="date">
                          {moment(value.booking_date, "YYYY-MM-DD").format(
                            "DD MMMM yy"
                          )}
                        </div>
                      </div>
                    </Row>
                    <Row gutter={0}>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                        className="align-right self-flex-end"
                      >
                        {/* {this.displayReviewRatingSection(value)} */}
                        {value.event_booking_id === selectedHistoryId &&
                        (value.status === "Cancelled" ||
                          value.status == "Completed" ||
                          value.status == "Job-Done" ||
                          value.status == "Booking-Done") ? (
                          <>
                            <Button
                              className="send-quote-btn"
                              onClick={() => {
                                this.DeleteEventBooking(value.event_booking_id);
                                this.setState({ selectedHistoryId: "" });
                              }}
                              type="default"
                              className="cancel-btn"
                              // className="fm-orng-btn"
                            >
                              Delete
                            </Button>
                          </>
                        ) : (
                          <>
                            {(value.status == "Rejected" ||
                              value.status == "Declined" ||
                              value.status == "Job-Done" ||
                              value.status == "Cancelled" ||
                              value.status == "Booking-Done" ||
                              value.status == "Completed") && (
                              <i
                                className="trash-icon"
                                onClick={() => {
                                  this.DeleteEventBooking(
                                    value.eb_id
                                      ? value.eb_id
                                      : value.event_booking_id
                                  );
                                  this.setState({ selectedHistoryId: "" });
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
                                value.status == "Accepted"
                                  ? "Confirmed"
                                  : value.status == "Job-Done" ||
                                    value.status == "Booking-Done"
                                  ? "Completed"
                                  : value.status
                              )}
                              //  className='success-btn'
                            >
                              {value.status == "Accepted"
                                ? "Confirmed"
                                : value.status == "Job-Done" ||
                                  value.status == "Booking-Done"
                                ? "Completed"
                                : value.status}
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                    {value.event_booking_id === selectedHistoryId && (
                      <Row>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (selectedHistoryId === value.event_booking_id) {
                              this.setState({ selectedHistoryId: "" });
                            }
                          }}
                        />
                      </Row>
                    )}
                  </Col>
                </Row>
              </div>
            );
          })}
          {/* <div className="btn-show-block">
            <a onClick={(e) => this.handlePageChange(e)} className="show-more">
              Show More
            </a>
          </div> */}
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

  submitDispute = (values) => {
    const { selectedHistoryId } = this.state;

    this.props.enableLoading();
    this.props.raiseCatererDispute(
      {
        event_bookings_id: selectedHistoryId,
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

  submitDisputeReply = (values) => {
    const { selectedHistoryId } = this.state;

    this.props.enableLoading();
    this.props.replyCatererDispute(
      { booking_id: selectedHistoryId, message: values.message },
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
    this.props.submitCatererReview(
      {
        event_bookings_id: selectedHistoryId,
        rated_by: "customer",
        title: values.review,
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
            user_id: id,
            date: selectedDate,
            // to_date: selectedDate
          };
          this.props.eventVenderCalendarBookings(req, (res) => {
            console.log(res, "resss");
            if (res.status === 200 && res.data) {
              let selectedDateList =
                res.data.event_bookings.class_bookings[selectedDate];

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

  onChangeBookingDates = (value) => {
    this.getBookingsForCalenderDate(value);
  };

  renderBokingCalenderItems = () => {
    const { customerCalenderBookingList } = this.state;
    if (customerCalenderBookingList && customerCalenderBookingList.length > 0) {
      return (
        <ul className="flex-container wrap">
          {customerCalenderBookingList.map((value, i) => {
            console.log(value, "valueeeee");
            return (
              <li>
                <div className="appointments-label" style={{ width: "60%" }}>
                  {value.name}
                </div>
                {/* <div class="appointments-label">{value.service_sub_bookings[0].wellbeing_trader_service.name}</div> */}
                {/* <div className="appointments-time">{value.start_time}<span><img src={require('../../../assets/images/icons/delete.svg')} alt='delete' /></span></div> */}
                <div className="appointments-time" style={{ width: "20%" }}>
                  {convertTime24To12Hour(value.start_time)}
                </div>
                <div className="appointments-action" style={{ width: "20%" }}>
                  <i
                    className="trash-icon"
                    onClick={() =>
                      this.DeleteEventBooking(
                        value.eb_id ? value.eb_id : value.id
                      )
                    }
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
   * @method render
   * @description render component
   */
  render() {
    const {
      visibleDisputeModal,
      visibleReplyDisputeModal,
      visibleReviewModal,
      totalBookings,
      totalEnquiry,
      selectedBookingId,
      selectedHistoryDetail,
      selectedBookingDetail,
      selectedEnquiryId,
      activeTab,
      page,
      visibleRescheduleModal,
      visibleCreateQuoteModal,
      calenderView,
      customerCalenderBookingList,
      selectedBookingDate,
      visibleQuoteSuccessModal,
      cancelBookingVisible,
    } = this.state;
    const { loggedInUser, traderDetails } = this.props;
    const decline_id = this.state.currentvalue.enquire_response_id;

    console.log(decline_id, "decline_id");
    return (
      <Layout className="event-booking-profile-wrap fm-event-vendor-wrap">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab event-my-booking"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="heading-search-block">
                  <div className="">
                    <Row gutter={0}>
                      <Col xs={24} md={20} lg={24} xl={24}>
                        {/* <h1>
                            <span>My Dashboard</span>
                          </h1> */}
                        <div className="header-serch-tab-block">
                          <div className="right btn-right-block ">
                            <Button
                              className="orange-btn"
                              onClick={() =>
                                window.location.assign("/dashboard")
                              }
                            >
                              My Dashboard
                            </Button>
                          </div>
                          <div className="heading-text active-tab">
                            <Button className="orange-btn">My Bookings</Button>
                          </div>
                        </div>
                        <div className="search-block">
                          <Input
                            placeholder="Search Bookings"
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
                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking handyman-booking">
                  <Row gutter={30}>
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                      <Card
                        className="profile-content-shadow-box"
                        bordered={false}
                        title=""
                      >
                        <Tabs onChange={this.onTabChange} defaultActiveKey="1">
                          <TabPane tab="Enquiries" key="1">
                            {totalEnquiry <= 0 ? (
                              <h3>You have no enquiries</h3>
                            ) : (
                              <h3>
                                You have {totalEnquiry} job enquires in total
                              </h3>
                            )}
                            {totalEnquiry > 0 && this.renderUpcomingEnquiries()}
                          </TabPane>
                          <TabPane tab="My Bookings" key="2">
                            {totalBookings <= 0 ? (
                              <h3>You have no jobs book</h3>
                            ) : (
                              <h3>You have {totalBookings} jobs book</h3>
                            )}
                            {totalBookings > 0 && this.renderUpcomingBookings()}
                          </TabPane>
                          <TabPane
                            className="history-tab"
                            tab="History"
                            key="3"
                          >
                            {this.state.totalHistories <= 0 ? (
                              <h3>You have no jobs done</h3>
                            ) : (
                              <h3>
                                You have {this.state.totalHistories} jobs done
                              </h3>
                            )}
                            {this.state.totalHistories > 0 &&
                              this.renderHistoryBooking()}
                          </TabPane>
                        </Tabs>
                        <div className="card-header-select">
                          <label>Sort:</label>
                          {this.state.activeTab == "1" ? (
                            <Select
                              onChange={(e) => {
                                this.sortlist(e);
                              }}
                              defaultValue={"newest"}
                              // dropdownMatchSelectWidth={false}
                              dropdownClassName="filter-dropdown"
                            >
                              <Option value="newest">Newest</Option>
                              <Option value="pending">Pending</Option>
                              <Option value="rejected">Rejected</Option>
                              <Option value="response">Response</Option>
                              <Option value="quotesent">Quote Sent</Option>
                              <Option value="declined">Declined</Option>
                              <Option value="cancelled">Cancelled</Option>
                            </Select>
                          ) : null}
                          {this.state.activeTab == "2" ? (
                            <Select
                              onChange={(e) => {
                                this.sortlist(e);
                              }}
                              defaultValue={"newest"}
                              // dropdownMatchSelectWidth={false}
                              dropdownClassName="filter-dropdown"
                            >
                              <Option value="newest">Newest</Option>
                              <Option value="pending">Pending</Option>
                              <Option value="rejected">Rejected</Option>
                              <Option value="response">Response</Option>
                              <Option value="quotesent">Quote Sent</Option>
                              <Option value="declined">Declined</Option>
                              <Option value="cancelled">Cancelled</Option>
                            </Select>
                          ) : null}
                          {this.state.activeTab == "3" ? (
                            <Select
                              onChange={(e) => {
                                this.sortlist(e);
                              }}
                              defaultValue={"newest"}
                              // dropdownMatchSelectWidth={false}
                              dropdownClassName="filter-dropdown"
                            >
                              <Option value="newest">Newest</Option>
                              <Option value="pending">Pending</Option>
                              <Option value="rejected">Rejected</Option>
                              <Option value="completed">Completed</Option>
                              <Option value="cancelled">Cancelled</Option>
                            </Select>
                          ) : null}
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <div className="appointments-slot right-calender-view">
                        <div className="appointments-heading">
                          <div className="date-heading">My Calender</div>
                          <div className="card-header-select">
                            {/* <CalendarOutlined /> */}
                            <Link to={"/dashboard-calendar"}>
                              <svg
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M4.5625 21.25C3.53125 21.25 2.59375 20.2188 2.59375 19.1875L2.5 6.25C2.5 5.21875 3.34375 4.375 4.375 4.375H6.25V2.5H8.125V4.375H15.7188V2.5H17.5938V4.375C21.0625 4.375 21.3438 4.9375 21.3438 6.90625V19.1875C21.3438 20.3125 20.5938 21.25 19.5625 21.25H4.5625ZM18.4375 19.375C18.9062 19.375 19.375 19 19.375 18.4375V11.875H4.375V18.4375C4.375 19 4.75 19.375 5.3125 19.375H18.4375ZM4.375 10H19.375V7.1875C19.375 6.625 19 6.25 18.4375 6.25H17.5V8.125H15.625V6.25H8.125V8.125H6.25V6.25H5.3125C4.75 6.25 4.375 6.71875 4.375 7.1875V10ZM15.0744 17.1664C16.0461 17.1664 16.8339 16.3786 16.8339 15.4069C16.8339 14.4352 16.0461 13.6475 15.0744 13.6475C14.1027 13.6475 13.315 14.4352 13.315 15.4069C13.315 16.3786 14.1027 17.1664 15.0744 17.1664Z"
                                  fill="#363B40"
                                />
                              </svg>
                            </Link>
                            {/* <label>Show:</label>
                            <Select
                              onChange={(e) =>
                                this.setState({ calenderView: e })
                              }
                              defaultValue="This week"
                            >
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                            </Select> */}
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
                            {moment(selectedBookingDate).format("MMM D YYYY")}
                          </div>
                          <div className="appointments-count">
                            {customerCalenderBookingList.length} Appointments
                            today
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
        {/* {selectedBookingDetail && (
          <RescheduleModal
            handleClose={() => this.setState({ visibleRescheduleModal: false })}
            visibleRescheduleModal={visibleRescheduleModal}
            selectedBookingId={selectedBookingId}
            page={page}
            selectedBookingDetail={selectedBookingDetail}
          />
        )} */}
        <DisputeModal
          submitDispute={this.submitDispute}
          handleClose={() => this.setState({ visibleDisputeModal: false })}
          visibleDisputeModal={visibleDisputeModal}
          selectedBookingId={selectedBookingId}
        />
        <ReplyDisputeModal
          submitDispute={this.submitDisputeReply}
          handleClose={() => this.setState({ visibleReplyDisputeModal: false })}
          visibleDisputeModal={visibleReplyDisputeModal}
          selectedBookingId={selectedBookingId}
        />
        <ReviewModal
          submitReview={this.submitReview}
          handleClose={() => this.setState({ visibleReviewModal: false })}
          visibleReviewModal={visibleReviewModal}
          valid_customer_rating={selectedHistoryDetail.valid_customer_rating}
        />

        <Modal
          title="Please choose a reason for declining"
          visible={this.state.visible}
          className={"custom-modal fm-md-modal style1 decline-popup"}
          footer={false}
          onCancel={this.handleCancel}
        >
          <div className="padding fm-prh-modalwrap">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={(values) => {
                console.log("values", values);
                console.log(
                  "enquire_response_id",
                  this.state.currentvalue.enquire_response_id
                );
                if (decline_id) {
                  console.log("in event active tab 1");

                  this.props.declineEventEnquiry(
                    {
                      enquire_response_id:
                        this.state.currentvalue.enquire_response_id,
                      status: "Rejected",
                      reason: this.state.checked,
                      comments: values.message,
                    },
                    (res) => {
                      if (res.status === STATUS_CODES.OK) {
                        toastr.success(
                          langs.success,
                          MESSAGES.DECILNED_ENQUIRY
                        );
                        this.getEnquiries(page);
                        this.handleCancel();
                      }
                    }
                  );
                } else {
                  console.log("in event active tab 1 else ");
                  this.props.changeEventBookingStatus(
                    {
                      event_booking_id: selectedBookingId,
                      status: "Cancelled",
                      reason: this.state.checked,
                      comment: values.message,
                    },
                    (res) => {
                      if (res.status === STATUS_CODES.OK) {
                        toastr.success(
                          langs.success,
                          MESSAGES.DECILNED_BOOKING
                        );
                        this.getJobList(page);
                        this.handleCancel();
                      }
                    }
                  );
                }
                this.setState({
                  visible: false,
                  visibleCreateQuoteModal: false,
                  cancelBookingVisible: true,
                });
              }}
            >
              {/* <span className="fm-lbl-mdl">Please select a reason</span> */}
              <Form.Item name="reason">
                <Checkbox
                  checked={this.state.checked == "I have changed my mind"}
                  onChange={() =>
                    this.setState({
                      checked: "I have changed my mind",
                    })
                  }
                >
                  {"I have changed my mind"}
                </Checkbox>
                <Checkbox
                  checked={
                    this.state.checked ==
                    "The customer can’t meet my requirements"
                  }
                  onChange={() =>
                    this.setState({
                      checked: "The customer can’t meet my requirements",
                    })
                  }
                >
                  {"The customer can’t meet my requirements"}
                </Checkbox>
                <Checkbox
                  checked={
                    this.state.checked ==
                    "The customer is not responding to my messages"
                  }
                  onChange={() =>
                    this.setState({
                      checked: "The customer is not responding to my messages",
                    })
                  }
                >
                  {"The customer is not responding to my messages"}
                </Checkbox>
                <Checkbox
                  checked={
                    this.state.checked ==
                    "I am no longer available on that date / time"
                  }
                  onChange={() =>
                    this.setState({
                      checked: "I am no longer available on that date / time",
                    })
                  }
                >
                  {"I am no longer available on that date / time"}
                </Checkbox>
                <Checkbox
                  checked={
                    this.state.checked ==
                    "I don’t feel safe while communicating with the customer"
                  }
                  onChange={() =>
                    this.setState({
                      checked:
                        "I don’t feel safe while communicating with the customer",
                    })
                  }
                >
                  {"I don’t feel safe while communicating with the customer"}
                </Checkbox>
                <Checkbox
                  checked={
                    this.state.checked ==
                    "The customer has asked me to cancel via message"
                  }
                  onChange={() =>
                    this.setState({
                      checked:
                        "The customer has asked me to cancel via message",
                    })
                  }
                >
                  {"The customer has asked me to cancel via message"}
                </Checkbox>
                <Checkbox
                  checked={
                    this.state.checked ==
                    "I have customer has not provided enough information"
                  }
                  onChange={() =>
                    this.setState({
                      checked:
                        "I have customer has not provided enough information",
                    })
                  }
                >
                  {"I have customer has not provided enough information"}
                </Checkbox>
              </Form.Item>
              <span className="fm-lbl-mdl">Message (Optional)</span>
              <Form.Item name="message">
                <TextArea rows={4} placeholder={"..."} className="" />
              </Form.Item>
              <Form.Item className="text-center fm-send-submit popup-footer">
                <Button
                  className="cancel-btn"
                  type="default"
                  onClick={() => this.setState({ visible: false })}
                >
                  Cancel
                </Button>
                <Button type="default" htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal
          // title="Create Quote"
          visible={visibleCreateQuoteModal}
          className={"custom-modal fm-md-modal style1 send-quote-popup"}
          footer={false}
          onCancel={() => {
            this.setState({ visibleCreateQuoteModal: false });
          }}
        >
          <div className="order-profile">
            <div className="profile-pic">
              <img
                alt="test"
                src={
                  this.state.currentvalue.image
                    ? this.state.currentvalue.image
                    : require("../../../../../assets/images/avatar3.png")
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = require("../../../../../assets/images/avatar3.png");
                }}
              />
            </div>
            <div className="profile-name">{this.state.currentvalue.title}</div>
          </div>
          <div class="ant-modal-header">
            <div class="ant-modal-title" id="rcDialogTitle1">
              Send Quote
            </div>
          </div>
          <div className="padding fm-prh-modalwrap">
            <Form
              name="basic"
              // initialValues={{ price: this.state.currentvalue.price ? this.state.currentvalue.price : "0.00" }}
              onFinish={(values) => {
                this.props.declineEventEnquiry(
                  {
                    price: values.price
                      ? values.price
                      : this.state.currentvalue.price
                      ? this.state.currentvalue.price
                      : 0,
                    enquire_response_id:
                      this.state.currentvalue.enquire_response_id,
                    status: "Quote Sent",
                    comments: "",
                  },
                  (res) => {
                    if (res.status === STATUS_CODES.OK) {
                      toastr.success(langs.success, MESSAGES.REQUEST_SENT);
                      this.getEnquiries(1);
                    }
                  }
                );
                this.setState({
                  visibleCreateQuoteModal: false,
                  visibleQuoteSuccessModal: true,
                });
              }}
              //   let basicQuote = traderDetails.user.trader_profile.basic_quote
              //     ? 1
              //     : 0;
              //   let ratePer = traderDetails.user.trader_profile.rate_per_hour
              //     ? traderDetails.user.trader_profile.rate_per_hour
              //     : 0;

              //   let reqdata = {
              //     from: moment(values.from).format("hh:mm:ss"),
              //     to: moment(values.to).format("hh:mm:ss"),
              //     description: values.description,
              //     date: moment(values.date).format("YYYY-MM-DD"),
              //     user_id: loggedInUser.id,
              //     trader_quote_request_id: selectedEnquiryId,
              //     amount: values.amount,
              //     basic_quote: basicQuote,
              //     per_hr: ratePer,
              //   };
              //   this.props.createQuote(reqdata, (res) => {
              //     if (res.status === STATUS_CODES.OK) {
              //       toastr.success(langs.success, MESSAGES.DECILNED_BOOKING);
              //       this.getJobList(page);
              //       this.setState({ visibleRescheduleModal: false });
              //     }
              //   });
              // }
              // }
            >
              {/* <span className="fm-lbl-mdl">Amount</span>
              <Form.Item name="amount">
                <Input type="number" />
              </Form.Item>
              <span className="fm-lbl-mdl">Date</span>
              <Form.Item name="date">
                <DatePicker
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
              <span className="fm-lbl-mdl">Start time</span>
              <Form.Item name="from">
                <TimePicker
                  minuteStep={30}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
              <span className="fm-lbl-mdl">End time</span>
              <Form.Item name="to">
                <TimePicker
                  minuteStep={30}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
              <span className="fm-lbl-mdl">Description</span>
              <Form.Item name="description">
                <TextArea
                  rows={4}
                  placeholder={"..."}
                  className="shadow-input"
                />
              </Form.Item>
              <Form.Item className="text-center fm-send-submit">
                <Button type="default" htmlType="submit">
                  Send
                </Button>
              </Form.Item> */}
              <Form.Item name="price" className="fm-apply-label">
                <div className="fm-apply-input">
                  <div className="description">
                    {this.state.currentvalue.description}
                  </div>
                  <Input
                    addonBefore="AUD$"
                    placeholder={"Type your quote here"}
                    enterButton="Search"
                    className="shadow-input"
                    defaultValue={
                      this.state.currentvalue.price
                        ? this.state.currentvalue.price
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
                    this.state.currentvalue.status === "Rejected" ? true : false
                  }
                  onClick={() => {
                    this.showModal();
                  }}
                >
                  Decline
                </Button>
                <Button
                  // onClick={() => {
                  //   this.props.declineEventEnquiry(
                  //     {
                  //       price: this.state.currentvalue.price ? this.state.currentvalue.price : 0,
                  //       enquire_response_id: selectedEnquiryId,
                  //       status: "Accepted",
                  //       comments: "",
                  //     },
                  //     (res) => {
                  //       if (res.status === STATUS_CODES.OK) {
                  //         toastr.success(
                  //           langs.success,
                  //           MESSAGES.REQUEST_SENT
                  //         );
                  //         this.getEnquiries(1);
                  //       }
                  //     }
                  //   );
                  //   this.setState({
                  //     visibleCreateQuoteModal: false,
                  //     visibleQuoteSuccessModal: true
                  //   })
                  // }}
                  type="default"
                  htmlType="submit"
                  className="fm-orng-btn"
                >
                  Send
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
        <Modal
          // title='Send Quote'
          visible={visibleQuoteSuccessModal}
          className={"custom-modal fm-md-modal style1 send-quote-popup"}
          footer={false}
          onCancel={() => {
            this.setState({ visibleQuoteSuccessModal: false });
          }}
          footer={[
            <Button
              className="cancel-booking-btn"
              key="back"
              onClick={() => {
                this.setState({
                  visibleQuoteSuccessModal: false,
                  visibleCreateQuoteModal: false,
                });
              }}
            >
              Return to Bookings
            </Button>,
          ]}
        >
          <div className="success-icon">
            <CheckCircleFilled />
          </div>
          <div className="quote-sent-title">Quote sent succesfully!</div>
          <div className="booking-name">Booking Name</div>
          <div className="booking-date-time">
            {`${moment(this.state.currentvalue.booking_date).format(
              "DD/MM/YYYY"
            )} at ${moment(this.state.currentvalue.start_time).format(
              "LT"
            )} - ${moment(this.state.currentvalue.end_time).format("LT")}`}
          </div>
        </Modal>

        <Modal
          // title='Send Quote'
          visible={cancelBookingVisible}
          className={"custom-modal fm-md-modal style1 send-quote-popup"}
          footer={false}
          onCancel={() => {
            this.setState({ cancelBookingVisible: false });
          }}
          footer={[
            <Button
              className="cancel-booking-btn"
              key="back"
              onClick={() => {
                this.setState({
                  cancelBookingVisible: false,
                });
              }}
            >
              Return to Bookings
            </Button>,
          ]}
        >
          <div className="booking-cancel-title">Booking Cancelled</div>
          <div className="booking-name">Booking Name</div>
          <div className="booking-date-time">
            {`${moment(this.state.currentvalue.booking_date).format(
              "DD/MM/YYYY"
            )} at ${moment(this.state.currentvalue.start_time).format(
              "LT"
            )} - ${moment(this.state.currentvalue.end_time).format("LT")}`}
          </div>
        </Modal>
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
    traderDetails:
      profile.traderProfile !== null ? profile.traderProfile : null,
  };
};
export default connect(mapStateToProps, {
  getCatererEnquiry,
  getCatererEnquiryDetail,
  declineEventEnquiry,
  getCatererBookings,
  getCatererBookingDetail,
  changeEventBookingStatus,
  getCatererHistoryList,
  enableLoading,
  disableLoading,
  catererJobDone,
  raiseCatererDispute,
  replyCatererDispute,
  submitCatererReview,
  eventVenderCalendarBookings,
  DeleteEventBookingapi,
  deleteEventEnquiry,
  getAllChat,
})(ProfileVendorHandyman);
