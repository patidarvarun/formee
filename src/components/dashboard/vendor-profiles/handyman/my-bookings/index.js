import React, { Fragment } from "react";
import {
  SearchOutlined,
  CloseCircleOutlined,
  WindowsFilled,
  MinusCircleOutlined,
  CalendarOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
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
  DatePicker,
  TimePicker,
  Calendar,
  Badge,
  Checkbox,
  Empty,
} from "antd";
import {
  getTraderProfile,
  enableLoading,
  disableLoading,
  getEnquiryList,
  getEnquiryDetails,
  declineEnquiry,
  getHandyManVenderJobs,
  getJobBookingDetails,
  changeHandymanBookingStatus,
  getHandymanHistoryList,
  rescheduleHanymanBooking,
  createQuote,
  raiseHandymanDispute,
  replyHandymanDispute,
  submitHandymanReview,
  eventVenderCalendarBookings,
  declineEventEnquiry,
  DeleteTraderJobapi,
  DeleteTraderJobss,
  listVendorServiceBeautyBookings,
  listVendorServiceBeautyBookingHistory,
  listVendorServiceSpaBookings,
  listVendorServiceSpaBookingsHistory,
  getTraderMonthWellbeingBooking,
  DeleteWellBeingApi,
  cancelTraderQuoteStatus,
  getTraderMonthBooking,
  deleteTraderEnquiryUrl,
  getAllChat,
} from "../../../../../actions";
import AppSidebar from "../../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import { toastr } from "react-redux-toastr";

import { MESSAGES } from "../../../../../config/Message";
import { langs } from "../../../../../config/localization";
import "./profile-vendor-handyman.less";
import {
  displayDateTimeFormate,
  convertTime24To12Hour,
  displayCalenderDate,
} from "../../../../common";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import Icon from "../../../../customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from "../../../../../config/Config";
import RescheduleModal from "./BookingRescheduleModal";
import DisputeModal from "../../common-modals/DisputeModal";
import ReplyDisputeModal from "../../common-modals/ReplyDisputeModal";
import ReviewModal from "../../common-modals/ReviewModal";
import { getStatusColor } from "../../../../../config/Helper";
import SendMessageModal2 from "../../../../classified-templates/common/modals/SendMessageModal2";
import message from "../../../message/message";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

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

class ProfileVendorHandyman extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      customerBookingList: [],
      RecordCount: 0,
      page: "1",
      order: "desc",
      page_size: 10,
      customer_id: "",
      key: 1,
      customerBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      customerCalenderBookingList: [],
      wellBeingBookingSlot: [],
      totalRecordCustomerServiceBooking: 0,
      totalRecordCustomerSpaBookingHistory: 0,
      enquiryList: [],
      enquiryListCopy: [],
      totalEnquiry: 0,
      dataSearch: 0,
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
      activeTab: ["handyman"].includes(props.loggedInUser.user_type) ? 1 : 2,
      visibleRescheduleModal: false,
      visibleCreateQuoteModal: false,
      displayReportToAdminModal: false,
      visibleReplyDisputeModal: false,
      visibleReviewModal: false,
      calenderView: "month",
      vendorBookingList: [],
      selectedBookingDate: new Date(),
      vendorAllDayCalenderBookingList: [],
      currentvalue: {},
      visibleQuoteSuccessModal: false,
      checked: "I have changed my mind",
      message: "",
      cancelBookingVisible: false,
      bookingListCopy: [],
      historyListCopy: [],
      visibleMo: false,
      checkempty: "",
      enquiryEmpty: "",
      enquiryJob: "",
      beautyEnquiry: "",
      wellBeinngg: "",
      filterdata: "",
      messagess: [],
      Arr: [],
    };
    //  console.log(this.state.customerCalenderBookingList, "idd dedo");
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  SendMessageModal2 = () => {
    this.setState({
      visibleMo: true,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
      visibleMo: false,
    });
  };
  handleBookingPageChange = (e) => {
    this.setState({ filterdata: e.target.value });
  };
  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { page, loggedInUser, activeTab } = this.state;

    this.props.enableLoading();
    if (activeTab == "1") {
      this.getEnquiries(1);
    } else if (activeTab == "2") {
      this.getJobList(1);
    } else if (activeTab == "3") {
      this.getHistoryList(1);
    }
    this.getBookingsForCalenderDate(new Date());
    if (loggedInUser) {
      this.props.getTraderProfile({ user_id: loggedInUser.id });
      //   this.getDashBoardDetails()
    }

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
    //  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&", this.state.messagess);
  }
  DeleteQuoteJob = (id) => {
    // console.log(this.state.selectedBookingId, "delete trade");
    // console.log(id, "delete id trade");
    const { activeTab } = this.state;
    if (["handyman", "trader"].includes(this.props.loggedInUser.user_type)) {
      let reqData = {
        trader_quote_request_id: id,
        user_id: this.props.loggedInUser.id,
      };
      this.props.enableLoading();
      this.props.DeleteTraderJobss(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, "Successfully deleted");
          if (activeTab == "1") {
            this.getEnquiries(1);
          }
        }
      });
    } else {
    }
  };

  DeleteTraderJob = (id) => {
    // console.log(this.state.selectedBookingId, "delete trade");
    // console.log(id, "delete id trade");
    const { activeTab } = this.state;
    if (["handyman", "trader"].includes(this.props.loggedInUser.user_type)) {
      let reqData = {
        trader_job_id: id,
        user_id: this.props.loggedInUser.id,
      };
      this.props.enableLoading();
      this.props.DeleteTraderJobapi(reqData, (res) => {
        this.props.disableLoading();
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
    } else {
      let reqData = {
        service_booking_id: id,
        user_id: this.props.loggedInUser.id,
      };

      this.props.DeleteWellBeingApi(reqData, (res) => {
        if (res.status === STATUS_CODES.OK) {
          if (activeTab == "1") {
            this.getEnquiries(1);
          } else if (activeTab == "2") {
            this.getJobList(1);
          } else if (activeTab == "3") {
            this.getHistoryList(1);
          }
        }
      });
    }
  };

  onTabChange = (key, type) => {
    this.setState({ activeTab: key });
    if (key == "1") {
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

  getEnquiries = (page) => {
    this.props.enableLoading();
    const { id } = this.props.loggedInUser;
    const reqData = {
      page: page,
      order_by: "customer_rating",
      page_size: this.state.page_size,
      order: "asc",
      user_id: id, //657
      total: "",
    };

    this.props.getEnquiryList(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        this.setState({
          enquiryList: [...this.state.enquiryList, ...res.data.quote_requests],
          totalEnquiry: res.data.total ? res.data.total : 0,
          dataSearch: res.data.total ? res.data.total : 0,
          enquiryListCopy: [
            ...this.state.enquiryList,
            ...res.data.quote_requests,
          ],
          RecordCount: res.data.total,
          enquiryEmpty: res.data,
        });
      }
    });
    // }
  };

  getJobList = (page) => {
    this.props.enableLoading();
    const { id } = this.props.loggedInUser;
    const reqData = {
      page: page,
      page_size: this.state.page_size,
      user_id: id, //657
    };
    // if (
    //   +page != "1" &&
    //   this.state.RecordCount < +page * +this.state.page_size
    // ) {
    //   toastr.success(langs.success, "No More Records");
    //   this.props.disableLoading();
    // } else {
    if (
      this.props.loggedInUser.user_type === "handyman" ||
      this.props.loggedInUser.user_type === "trader"
    ) {
      this.props.getHandyManVenderJobs(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          this.setState({
            bookingList: [...this.state.bookingList, ...res.data.jobs],
            totalBookings: res.data.total ? res.data.total : 0,
            bookingListCopy: [...this.state.bookingList, ...res.data.jobs],
            RecordCount: res.data.total,
            enquiryJob: res.data,
          });
        }
      });
    } else if (this.props.loggedInUser.user_type === "wellbeing") {
      this.props.listVendorServiceSpaBookings(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          this.setState({
            bookingList: [
              ...this.state.bookingList,
              ...res.data.data.service_bookings,
            ],
            totalBookings: res.data.data.total_record
              ? res.data.data.total_record
              : 0,
            bookingListCopy: [
              ...this.state.bookingList,
              ...res.data.data.service_bookings,
            ],
            RecordCount: res.data.data.total_record,
            wellBeinngg: res.data.data,
          });
        }
      });
    } else if (this.props.loggedInUser.user_type === "beauty") {
      this.props.listVendorServiceBeautyBookings(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          this.setState({
            bookingList: [
              ...this.state.bookingList,
              ...res.data.data.service_bookings,
            ],
            totalBookings: res.data.data.total_record
              ? res.data.data.total_record
              : 0,
            bookingListCopy: [
              ...this.state.bookingList,
              ...res.data.data.service_bookings,
            ],
            RecordCount: res.data.data.total_record,
            beautyEnquiry: res.data.data,
          });
        }
      });
    }
  };

  getHistoryList = (page, e) => {
    this.props.enableLoading();
    const { id } = this.props.loggedInUser;
    const reqData = {
      sort_type: e,
      page: page,
      page_size: this.state.page_size,
      user_id: id, //657
    };
    if (
      this.props.loggedInUser.user_type === "handyman" ||
      this.props.loggedInUser.user_type === "trader"
    ) {
      this.props.getHandymanHistoryList(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK && res.data.jobs.length !== 0) {
          this.setState({
            historyList: [...this.state.historyList, ...res.data.jobs],
            totalHistories: res.data.total ? res.data.total : 0,
            historyListCopy: [...this.state.historyList, ...res.data.jobs],
            RecordCount: res.data.total,
            checkempty: res.data.jobs,
          });
        }
      });
    } else if (this.props.loggedInUser.user_type === "wellbeing") {
      this.props.listVendorServiceSpaBookingsHistory(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          this.setState({
            historyList: [
              ...this.state.historyList,
              ...res.data.data.service_bookings,
            ],
            totalHistories: res.data.data.total_record
              ? res.data.data.total_record
              : 0,
            historyListCopy: [
              ...this.state.historyList,
              ...res.data.data.service_bookings,
            ],
            RecordCount: res.data.data.total_record,
            wellBeinngg: res.data.data,
          });
        }
      });
    } else if (this.props.loggedInUser.user_type === "beauty") {
      this.props.listVendorServiceBeautyBookingHistory(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          this.setState({
            historyList: [
              ...this.state.historyList,
              ...res.data.data.service_bookings,
            ],
            totalHistories: res.data.data.total_record
              ? res.data.data.total_record
              : 0,
            historyListCopy: [
              ...this.state.historyList,
              ...res.data.data.service_bookings,
            ],
            RecordCount: res.data.data.total_record,
            beautyEnquiry: res.data.data,
          });
        }
      });
    }
    // }
  };

  handlePageChange = () => {
    let { page } = this.state;
    const { activeTab } = this.state;
    this.setState({ page: +page + 1 });
    if (activeTab == 2) {
      this.getJobList(+page + 1);
    } else if (activeTab == 3) {
      this.getHistoryList(+page + 1);
    } else {
      this.getEnquiries(+page + 1);
    }
    this.setState({
      page: +page + 1,
    });
  };

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0;
  };

  submitDispute = (values) => {
    const { selectedHistoryId } = this.state;

    this.props.enableLoading();
    this.props.raiseHandymanDispute(
      {
        trader_job_id: selectedHistoryId,
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
    this.props.replyHandymanDispute(
      { job_id: selectedHistoryId, message: values.message },
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
        rated_by: "trader",
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

  compare = (a, b) => {
    if (a.created_at < b.created_at) {
      return -1;
    }
    if (a.created_at > b.created_at) {
      return 1;
    }
    return 0;
  };

  sortlist = (e, page) => {
    this.props.enableLoading();
    const { id } = this.props.loggedInUser;
    const { monthStart, monthEnd, weekStart, weekEnd } = this.state;
    //   // let fromDate, toDate;
    const { enquiryList, bookingList, historyList, activeTab } = this.state;

    let newDate = new Date();
    let todaydate = moment(newDate).format("YYYY-MM-DD");

    var first = newDate.getDate() - newDate.getDay();
    var last = first + 6;
    var firstday = new Date(newDate.setDate(first)).toUTCString();
    var lastday = new Date(newDate.setDate(last)).toUTCString();

    var firstDaymonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    var lastDaymonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    );
    // console.log(moment(firstDaymonth).format("YYYY-MM-DD"), "firstdaymonth");
    // console.log(moment(lastDaymonth).format("YYYY-MM-DD"), "lastdaymonth");
    // console.log(newDate, "newday");

    var nextweek = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate() - 7
    );
    let week = moment(nextweek).format("YYYY-MM-DD");
    const reqData = {
      from_date:
        e === "today"
          ? moment(todaydate).format("YYYY-MM-DD")
          : e === "week"
          ? moment(firstday).format("YYYY-MM-DD")
          : e === "month"
          ? moment(firstDaymonth).format("YYYY-MM-DD")
          : "",
      to_date:
        e === "today"
          ? moment(todaydate).format("YYYY-MM-DD")
          : e === "week"
          ? moment(lastday).format("YYYY-MM-DD")
          : e === "month"
          ? moment(lastDaymonth).format("YYYY-MM-DD")
          : "",
      sort_type: e,
      // page: this.state.page,
      // page_size: this.state.page_size,
      user_id: id, //657
    };

    let tmp;
    if (activeTab == "1") {
      this.props.getEnquiryList(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          this.setState({
            enquiryList: [
              //   ...this.state.enquiryList,
              ...res.data.quote_requests,
            ],
            totalEnquiry: res.data.total ? res.data.total : 0,
            dataSearch: res.data.total ? res.data.total : 0,
            enquiryListCopy: [
              //   ...this.state.enquiryList,
              ...res.data.quote_requests,
            ],
            RecordCount: res.data.total,
            enquiryEmpty: res.data,
          });
        }
      });
    } else if (activeTab == "2") {
      if (
        this.props.loggedInUser.user_type === "handyman" ||
        this.props.loggedInUser.user_type === "trader"
      ) {
        this.props.getHandyManVenderJobs(reqData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            this.setState({
              bookingList: [
                //  ...this.state.bookingList,
                ...res.data.jobs,
              ],
              totalBookings: res.data.total ? res.data.total : 0,
              bookingListCopy: [
                //...this.state.bookingList,
                ...res.data.jobs,
              ],
              RecordCount: res.data.total,
              enquiryJob: res.data,
            });
          }
        });
      } else if (this.props.loggedInUser.user_type === "wellbeing") {
        this.props.listVendorServiceSpaBookings(reqData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            this.setState({
              bookingList: [
                //  ...this.state.bookingList,
                ...res.data.data.service_bookings,
              ],
              totalBookings: res.data.data.total_record
                ? res.data.data.total_record
                : 0,
              bookingListCopy: [
                //...this.state.bookingList,
                ...res.data.data.service_bookings,
              ],
              RecordCount: res.data.data.total_record,
              wellBeinngg: res.data.data,
            });
          }
        });
      } else if (this.props.loggedInUser.user_type === "beauty") {
        this.props.listVendorServiceBeautyBookings(reqData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            this.setState({
              bookingList: [
                //  ...this.state.bookingList,
                ...res.data.data.service_bookings,
              ],
              totalBookings: res.data.data.total_record
                ? res.data.data.total_record
                : 0,
              bookingListCopy: [
                //  ...this.state.bookingList,
                ...res.data.data.service_bookings,
              ],
              RecordCount: res.data.data.total_record,
              beautyEnquiry: res.data.data,
            });
          }
        });
      }
    } else if (activeTab == "3") {
      if (
        this.props.loggedInUser.user_type === "handyman" ||
        this.props.loggedInUser.user_type === "trader"
      ) {
        this.props.getHandymanHistoryList(reqData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            this.setState({
              historyList: [...res.data.jobs],
              totalHistories: res.data.total ? res.data.total : 0,
              historyListCopy: [...res.data.jobs],
              RecordCount: res.data.total,
              checkempty: res.data.jobs,
            });
          }
        });
      } else if (this.props.loggedInUser.user_type === "wellbeing") {
        this.props.listVendorServiceSpaBookingsHistory(reqData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            this.setState({
              historyList: [
                //  ...this.state.historyList,
                ...res.data.data.service_bookings,
              ],
              totalHistories: res.data.data.total_record
                ? res.data.data.total_record
                : 0,
              historyListCopy: [
                //   ...this.state.historyList,
                ...res.data.data.service_bookings,
              ],
              RecordCount: res.data.data.total_record,
              wellBeinngg: res.data.data,
            });
          }
        });
      } else if (this.props.loggedInUser.user_type === "beauty") {
        this.props.listVendorServiceBeautyBookingHistory(reqData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            this.setState({
              historyList: [
                // ...this.state.historyList,
                ...res.data.data.service_bookings,
              ],
              totalHistories: res.data.data.total_record
                ? res.data.data.total_record
                : 0,
              historyListCopy: [
                //...this.state.historyList,
                ...res.data.data.service_bookings,
              ],
              RecordCount: res.data.data.total_record,
              beautyEnquiry: res.data.data,
            });
          }
        });
      }
    }
  };

  // sortlist = (e) => {
  //   // const { monthStart, monthEnd, weekStart, weekEnd } = this.state;
  //   // let fromDate, toDate;
  //   let newDate = new Date();
  //   let todaydate = moment(newDate).format("YYYY-MM-DD");

  //   var first = newDate.getDate() - newDate.getDay();
  //   var last = first + 6;
  //   var firstday = new Date(newDate.setDate(first)).toUTCString();
  //   var lastday = new Date(newDate.setDate(last)).toUTCString();

  //   var firstDaymonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  //   var lastDaymonth = new Date(
  //     newDate.getFullYear(),
  //     newDate.getMonth() + 1,
  //     0
  //   );
  // console.log(moment(firstDaymonth).format("YYYY-MM-DD"), "firstdaymonth");
  //   console.log(moment(lastDaymonth).format("YYYY-MM-DD"), "lastdaymonth");
  //   console.log(newDate, "newday");

  //   var nextweek = new Date(
  //     newDate.getFullYear(),
  //     newDate.getMonth(),
  //     newDate.getDate() - 7
  //   );
  //   let week = moment(nextweek).format("YYYY-MM-DD");
  //   // console.log(week, "nextweek");

  //   const { enquiryList, bookingList, historyList, activeTab } = this.state;
  //   let tmp;
  //   if (activeTab == "1") {
  //     tmp = enquiryList;
  //     console.log(tmp, "activeTab 1");
  //   } else if (activeTab == "2") {
  //     tmp = bookingList;
  //     console.log(tmp, "activeTab 2");
  //   } else if (activeTab == "3") {
  //     tmp = historyList;
  //     console.log(tmp, "activeTab 3");
  //   }
  //   let result;
  //   switch (e) {
  //     case "pending":
  //       result = tmp.filter((list) => list.status === "Pending");
  //       break;
  //     case "rejected":
  //       result = tmp.filter((list) => list.status === "Rejected");
  //       break;
  //     case "response":
  //       result = tmp.filter(
  //         (list) =>
  //           list.status === "QuoteSent" && list.tj_status === "Accepted-paid"
  //       );
  //       break;
  //     case "quotesent":
  //       result = tmp.filter((list) => list.status === "QuoteSent");

  //       break;
  //     case "declined":
  //       result = tmp.filter((list) => list.status === "Declined");
  //       break;
  //     case "completed":
  //       result = tmp.filter(
  //         (list) => list.status === "Job-Done" || list.status === "Booking-Done"
  //       );
  //       break;

  //     case "cancelled":
  //       result = tmp.filter((list) => list.status === "Cancelled");
  //       break;
  //     case "today":
  //       result = tmp.filter((list) => list.booking_date === todaydate);
  //       break;
  //     case "week":
  //       result = tmp.filter(
  //         (list) =>
  //           list.booking_date >= moment(firstday).format("YYYY-MM-DD") &&
  //           list.booking_date <= moment(lastday).format("YYYY-MM-DD")
  //       );
  //       // console.log(result, "resultttt");
  //       break;
  //     case "month":
  //       result = tmp.filter(
  //         (list) =>
  //           list.booking_date >= moment(firstDaymonth).format("YYYY-MM-DD") &&
  //           list.booking_date <= moment(lastDaymonth).format("YYYY-MM-DD")
  //       );
  //       console.log(result, "resultttt");

  //       break;
  //     case "confirmed":
  //       result = tmp.filter((list) => list.status === "Accepted-Paid");
  //       break;
  //     default:
  //       result = tmp.sort(this.compare);
  //       break;
  //   }
  //   if (activeTab == "1") {
  //     this.setState({
  //       enquiryListCopy: result,
  //     });
  //   } else if (activeTab == "2") {
  //     this.setState({
  //       bookingListCopy: result,
  //     });
  //   } else if (activeTab == "3") {
  //     this.setState({
  //       historyListCopy: result,
  //     });
  //   }
  // };

  renderUpcomingEnquiries = () => {
    const {
      enquiryListCopy,
      totalEnquiry,
      selectedEnquiryId,
      selectedEnquiryDetail,
      visibleMo,
    } = this.state;

    const messageIcon = this.state.messagess.filter((idd) => {
      return idd.unread_count >= 1;
    });
    console.log("$$$$$$$$$$$$$$$$$$", messageIcon);
    const dataSearch = enquiryListCopy.filter((item) => {
      return (
        item.customer.name
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });

    const current = new Date();
    const date = `${current.getDate()}/${
      current.getMonth() + 1
    }/${current.getFullYear()}`;

    if (enquiryListCopy.length && dataSearch.length !== 0) {
      return (
        <Fragment>
          {/* <h3>There are {dataSearch.length} job enquires</h3> */}
          {dataSearch.map((value, i) => {
            //console.log("$$$$$$$$$$$$$$$$$$$$$$$$", value);
            let today_date = moment(value.created_at).format("DD/MM/YYYY");

            return !(
              value.tj_status == null ||
              value.tj_status == "Accepted-Paid" ||
              value.tj_status == "Amount-Paid-Pending"
            ) ? null : (
              <div
                className="my-new-order-block"
                key={i}
                onClick={() => {
                  if (selectedEnquiryId !== value.id) {
                    if (
                      ["handyman", "trader"].includes(
                        this.props.loggedInUser.user_type
                      )
                    ) {
                      this.props.getEnquiryDetails(
                        { trader_quote_request_id: value.id },
                        (res) => {
                          if (res.status === STATUS_CODES.OK) {
                            this.setState({
                              selectedEnquiryId: value.id,
                              selectedEnquiryDetail: res.data.quote_request,
                              currentvalue: value,
                            });
                          }
                        }
                      );
                    } else {
                      this.setState({
                        selectedEnquiryId: value.id,
                        selectedEnquiryDetail: value,
                        currentvalue: value,
                      });
                    }
                  }
                }}
              >
                <Row gutter={0}>
                  <Col
                    className="order-block-left"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={18}
                    xl={18}
                  >
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                        <div className="odr-no">
                          <h4>Quote Request</h4>
                          <span className="pickup">{value.name}</span>
                        </div>
                        <div className="order-profile">
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
                          <div className="profile-name">
                            {value.customer.name}
                          </div>
                          {messageIcon.map((el) => {
                            return el.id == value.id ? (
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
                            {moment(value.date, "YYYY-MM-DD").format(
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
                        lg={18}
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
                          {value.id === selectedEnquiryId ? (
                            <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                              <div className="">
                                <div className="fm-eventb-desc mt-20">
                                  <h3>Contact Name:</h3>
                                  <span className="fm-eventb-content">
                                    {selectedEnquiryDetail.customer.name}
                                  </span>
                                  <span className="send-message">
                                    <Link onClick={this.SendMessageModal2}>
                                      Send Message
                                    </Link>
                                    <SendMessageModal2
                                      visible={visibleMo}
                                      onCancel={this.handleCancel}
                                      vendor_data={selectedEnquiryDetail}
                                      name={selectedEnquiryDetail.customer.name}
                                      image={
                                        selectedEnquiryDetail.customer
                                          .image_thumbnail
                                      }
                                    />
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
                                    {selectedEnquiryDetail.customer.mobile_no}
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
                                                : require("../../../../../assets/images/pr-img2.jpg")
                                            }
                                          />
                                        );
                                      }
                                    )}
                                  </div>
                                </div>

                                {(value.status === "Rejected" ||
                                  value.status === "Cancelled") && (
                                  <div className="fm-eventb-desc mt-20 rejected-block">
                                    <div className="rj-head">
                                      <CloseCircleOutlined />
                                      <span>QUOTE {value.status}</span>
                                    </div>
                                    <div className="rj-text">
                                      <h3>{value.cancel_reason}</h3>
                                      <h4>Message</h4>
                                      <p>{value.cancle_comment}</p>
                                    </div>
                                  </div>
                                )}
                                {value.status === "QuoteSent" &&
                                  value.tj_status === "Amount-Paid-Pending" && (
                                    <div className="fm-eventb-desc mt-20 response-block">
                                      <CheckCircleFilled />
                                      <span>Client Accepted your quote</span>
                                    </div>
                                  )}

                                {/* <Form.Item className='fm-apply-label'>
                                <span className="fm-arrow-label">Total</span>
                                <div className='fm-apply-input'>
                                  <Input defaultValue={(Array.isArray(value.quotes) && value.quotes.length) ? `$AUD ${value.quotes[0].amount}.00` : '$AUD 0.00'} placeholder={'Type your quote here'} enterButton='Search' className='shadow-input' />
                                  <Button type='primary' className='fm-apply-btn'>Quote</Button>
                                </div>
                              </Form.Item> */}
                                {/* <div className="fm-eventb-btn mt-20">
                                <Button
                                  type='default'
                                  className="fm-orng-outline-btn mr-15"
                                  disabled={value.status === 'Rejected' ? true : false}
                                  onClick={() => {
                                    this.showModal()
                                  }}
                                >Decline
                              </Button>
                                <Button
                                  disabled={value.status !== 'Pending' ? true : false}
                                  onClick={() => this.setState({ visibleCreateQuoteModal: true })}
                                  type='default'
                                  className="fm-orng-btn"
                                >Send
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
                        <span className="fm-eventb-month">
                          {moment(date).format("MM/DD/YYYY") === today_date
                            ? "Today"
                            : moment(value.created_at, "YYYY-MM-DD").format(
                                "DD MMMM yy"
                              )}
                        </span>
                        <div className="price mt-5 fs-25">
                          {Array.isArray(value.quotes) && value.quotes.length
                            ? `AU$${value.quotes[0].amount}.00`
                            : `AU$0.00`}
                        </div>
                      </div>
                    </Row>
                    <Row gutter={0} className="btns-row">
                      {/* <Col xs={24} sm={24} md={24} lg={16} xl={8} className="align-right self-flex-end"> */}
                      {/* {this.displayReviewRatingSection(value)} */}
                      {/* </Col> */}
                      {value.id === selectedEnquiryId &&
                      value.status === "Pending" ? (
                        <Button
                          className="send-quote-btn"
                          onClick={() =>
                            this.setState({
                              visibleCreateQuoteModal: true,
                              currentvalue: value,
                            })
                          }
                          type="default"
                          // className="fm-orng-btn"
                        >
                          Send Quote
                        </Button>
                      ) : value.id === selectedEnquiryId &&
                        value.status === "QuoteSent" &&
                        value.tj_status === "Amount-Paid-Pending" ? (
                        <>
                          <Button
                            className="send-quote-btn"
                            onClick={() => {
                              this.props.changeHandymanBookingStatus(
                                this.props.loggedInUser.user_type,
                                {
                                  trader_job_id: value.tj_id,
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
                            className="send-quote-btn"
                            // className="fm-orng-btn"
                          >
                            Confirm
                          </Button>
                          <Button
                            onClick={() => {
                              this.showModal();
                            }}
                            type="default"
                            className="cancel-booking-btn"
                            // className="fm-orng-btn"
                          >
                            Decline
                          </Button>
                        </>
                      ) : value.id === selectedEnquiryId &&
                        value.status === "Accepted" ? (
                        <>
                          <Button
                            className="send-quote-btn"
                            onClick={() => {
                              this.props.changeHandymanBookingStatus(
                                this.props.loggedInUser.user_type,
                                ["handyman", "trader"].includes(
                                  this.props.loggedInUser.user_type
                                )
                                  ? {
                                      trader_job_id: value.id,
                                      status: "Job-Done",
                                      reason: "Job-Done",
                                    }
                                  : {
                                      service_booking_id: value.id,
                                      status: "Completed",
                                      reason: "Completed",
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
                            className="send-quote-btn"
                            // className="fm-orng-btn"
                          >
                            Mark as Complete
                          </Button>
                          <Button
                            className="send-quote-btn"
                            onClick={() => {
                              this.showModal();
                            }}
                            type="default"
                            className="cancel-booking-btn"
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
                                this.DeleteQuoteJob(
                                  value.tj_id ? value.tj_id : value.id
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
                                : value.status == "QuoteSent" &&
                                  value.tj_status == "Amount-Paid-Pending"
                                ? "Response"
                                : value.status
                            )}
                            //  className='success-btn'
                          >
                            {value.status == "Accepted"
                              ? "Confirmed"
                              : value.status == "QuoteSent" &&
                                value.tj_status == "Amount-Paid-Pending"
                              ? "Response"
                              : value.status == "QuoteSent"
                              ? "Quote Sent"
                              : value.status}
                          </Button>
                        </>
                      )}
                    </Row>
                    {value.id === selectedEnquiryId && (
                      <Row>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (selectedEnquiryId === value.id) {
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
          {/* <Pagination
            defaultCurrent={this.state.page}
            defaultPageSize={this.state.defaultPageSize} //default size of page
            onChange={this.handlePageChange}
            total={totalEnquiry} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={'mb-20'}
          /> */}
          <div className="btn-show-block">
            {this.state.enquiryEmpty.quote_requests.length >= 10 ? (
              <a
                onClick={(e) => this.handlePageChange(e)}
                className="show-more"
              >
                Show More
              </a>
            ) : (
              ""
            )}
          </div>
        </Fragment>
      );
    } else {
      return <div className="pvf-alert-pad">No records found</div>;
    }
  };

  renderUpcomingBookings = () => {
    const {
      bookingListCopy,
      totalBookings,
      selectedBookingId,
      selectedBookingDetail,
      visibleMo,
    } = this.state;

    const messageIcon = this.state.messagess.filter((idd) => {
      return idd.unread_count >= 1;
    });
    console.log("$$$$$$$$$$$$$$$$$$", messageIcon);

    const dataSearch = bookingListCopy.filter((item) => {
      return (
        item.customer.name
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });
    const current = new Date();

    const date = `${current.getDate()}/${
      current.getMonth() + 1
    }/${current.getFullYear()}`;
    if (bookingListCopy.length && dataSearch.length !== 0) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            let today_date = moment(value.created_at).format("DD/MM/YYYY");
            //console.log(date, "da444444444444", today_date);

            return (
              <div
                className="my-new-order-block "
                key={i}
                onClick={() => {
                  if (selectedBookingId !== value.id) {
                    if (
                      ["handyman", "trader"].includes(
                        this.props.loggedInUser.user_type
                      )
                    ) {
                      this.props.getJobBookingDetails(
                        { trader_job_id: value.id },
                        (res) => {
                          if (res.status === STATUS_CODES.OK) {
                            this.setState({
                              selectedBookingId: value.id,
                              selectedBookingDetail: res.data.job,
                              currentvalue: value,
                            });
                          }
                        }
                      );
                    } else {
                      this.setState({
                        selectedBookingId: value.id,
                        selectedBookingDetail: value,
                        currentvalue: value,
                      });
                    }
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
                        <h4>
                          {/* {["handyman", "trader"].includes(
                            this.props.loggedInUser.user_type
                          )
                            ? value.title */}
                          {/* :  */}
                          Upcoming
                          {/* } */}
                        </h4>
                        <span className="pickup">
                          {["handyman", "trader"].includes(
                            this.props.loggedInUser.user_type
                          )
                            ? value.name
                            : value.service_sub_bookings[0]
                                .wellbeing_trader_service.name}
                        </span>
                      </div>
                      <div className="order-profile">
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
                        <div className="profile-name">
                          {value.customer.name}
                        </div>

                        {messageIcon.map((el) => {
                          return el.id == value.id ? (
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
                            {["handyman", "trader"].includes(
                              this.props.loggedInUser.user_type
                            ) ? (
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
                                <span className="fm-eventb-time">
                                  {moment(value.from, "hh:mm:ss").format("LT")}{" "}
                                  - {moment(value.to, "hh:mm:ss").format("LT")}
                                </span>
                              </div>
                            ) : (
                              value.id === selectedBookingId && (
                                <div className="fm-eventb-date">
                                  <h3>Issue Date</h3>
                                  <span className="fm-eventb-month">
                                    {moment(
                                      value.created_at,
                                      "YYYY-MM-DD "
                                    ).format("DD MMMM yy")}
                                  </span>
                                </div>
                              )
                            )}
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
                              {["handyman", "trader"].includes(
                                this.props.loggedInUser.user_type
                              ) && (
                                <Col xs={24} sm={24} md={24} lg={8} xl={16}>
                                  <div className="fm-eventb-desc">
                                    <h3>Request:</h3>
                                    <span className="fm-eventb-content">
                                      {value.description}
                                    </span>
                                  </div>
                                </Col>
                              )}

                              {value.id === selectedBookingId ? (
                                <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                  <div className="">
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Service:</h3>
                                      <span className="fm-eventb-content">
                                        {/* {'service_sub_bookings' in selectedBookingDetail ? selectedBookingDetail.service_sub_bookings[0].wellbeing_trader_service.name : ''} */}
                                        {"trader_service" in
                                        selectedBookingDetail
                                          ? selectedBookingDetail.trader_service
                                              .name
                                          : "service_sub_bookings" in
                                            selectedBookingDetail
                                          ? selectedBookingDetail
                                              .service_sub_bookings[0]
                                              .wellbeing_trader_service.name
                                          : ""}
                                      </span>
                                      <span className="send-message">
                                        <Link onClick={this.SendMessageModal2}>
                                          Send Message
                                        </Link>
                                        <SendMessageModal2
                                          visible={visibleMo}
                                          onCancel={this.handleCancel}
                                          vendor_data={selectedBookingDetail}
                                          name={
                                            selectedBookingDetail.customer.name
                                          }
                                          image={
                                            selectedBookingDetail.customer
                                              .image_thumbnail
                                          }
                                        />
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Contact Name:</h3>
                                      <span className="fm-eventb-content">
                                        {selectedBookingDetail.customer.name}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Email Address:</h3>
                                      <span className="fm-eventb-content">
                                        {selectedBookingDetail.customer.email}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Phone Number:</h3>
                                      <span className="fm-eventb-content">
                                        {selectedBookingDetail.customer
                                          .mobile_no
                                          ? selectedBookingDetail.customer
                                              .mobile_no
                                          : selectedBookingDetail.customer
                                              .full_mobile_no}
                                      </span>
                                    </div>
                                    {["handyman", "trader"].includes(
                                      this.props.loggedInUser.user_type
                                    ) && (
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
                                                      : require("../../../../../assets/images/pr-img2.jpg")
                                                  }
                                                />
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    <div>
                                      {(value.status === "Rejected" ||
                                        value.status === "Cancelled") && (
                                        <div className="fm-eventb-desc mt-20 rejected-block">
                                          <div className="rj-head">
                                            <CloseCircleOutlined />
                                            <span>QUOTE {value.status}</span>
                                          </div>
                                          <div className="rj-text">
                                            <h3>{value.reason}</h3>
                                            {/* <h4>Message</h4>
                                                <p>{value.comment}</p> */}
                                          </div>
                                        </div>
                                      )}

                                      {(value.status === "Booking-Done" ||
                                        value.status === "Job-Done") && (
                                        <div className="fm-eventb-desc mt-20 response-block">
                                          <CheckCircleFilled />
                                          <span>Job Completed</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* <Form.Item className='fm-apply-label'>
                                      <span className="fm-arrow-label">Total</span>
                                      <div className='fm-apply-input'>
                                        <Input defaultValue={`$AUD ${selectedBookingDetail.cost}.00`} placeholder={'Type your quote here'} enterButton='Search' className='shadow-input' />
                                        <Button type='primary' className='fm-apply-btn'>Quote</Button>
                                      </div>
                                    </Form.Item> */}
                                    {/* <div className="fm-eventb-btn mt-20">
                                      <Button
                                        type='default'
                                        className="fm-orng-outline-btn mr-10"
                                        disabled={value.status === 'Accepted-Paid' ? true : false}
                                        onClick={() => {
                                          this.props.changeHandymanBookingStatus(
                                            this.props.loggedInUser.user_type,{ trader_job_id: selectedBookingId, status: 'Accepted', reason: 'Accepted' }, (res) => {
                                            if (res.status === STATUS_CODES.OK) {
                                              toastr.success(langs.success, MESSAGES.CONFIRM_HANDYMAN_BOOKING);
                                              this.handleCancel()
                                            }
                                          })
                                        }}
                                      >Confirm
                                    </Button> */}
                                    {/* {value.status === 'appoinment' ? */}
                                    {/* <Button
                                        type='default'
                                        className="fm-orng-btn mr-10"
                                        onClick={() => {
                                          this.showModal()
                                        }}
                                      >Cancel
                                    </Button> */}
                                    {/* : ''} */}
                                    {/* <Button
                                        type='default'
                                        className="fm-orng-outline-btn"
                                        disabled={value.status === 'Rejected' ? true : false}
                                        onClick={() => {
                                          // this.showModal()
                                          this.setState({ visibleRescheduleModal: true })
                                        }}
                                      >Reschedule
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
                    className="order-block-right"
                  >
                    <Row gutter={0}>
                      {["handyman", "trader"].includes(
                        this.props.loggedInUser.user_type
                      ) ? (
                        <div className="bokng-hsty-hour-price">
                          <div className="date mb-0">
                            {date === today_date
                              ? "Today"
                              : moment(value.date, "YYYY-MM-DD").format(
                                  "DD MMMM yy"
                                )}
                          </div>
                          <div className="time ">
                            {moment(value.from, "hh:mm:ss").format("LT")}
                          </div>
                          <div className="price ">
                            {value.amount
                              ? `AU$${value.amount}.00`
                              : value.quote_id == null
                              ? `AU$${value.cost}.00`
                              : `AU$$.00`}
                          </div>
                        </div>
                      ) : (
                        <div className="bokng-hsty-hour-price">
                          <div className="time ">
                            {moment(value.start_time, "hh:mm:ss").format("LT")}
                          </div>
                          <div className="date mb-0">
                            {moment(value.booking_date, "YYYY-MM-DD").format(
                              "DD MMMM yy"
                            )}
                          </div>
                        </div>
                      )}
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
                        {value.id === selectedBookingId &&
                        value.status === "Appointment" ? (
                          <>
                            <Button
                              className="send-quote-btn"
                              onClick={() => {
                                this.props.changeHandymanBookingStatus(
                                  this.props.loggedInUser.user_type,
                                  ["handyman", "trader"].includes(
                                    this.props.loggedInUser.user_type
                                  )
                                    ? {
                                        trader_job_id: value.id,
                                        status: "Accepted",
                                        reason: "Accepted",
                                      }
                                    : {
                                        service_booking_id: value.id,
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
                              Confirm
                            </Button>
                            <Button
                              onClick={() => {
                                this.showModal();
                              }}
                              type="default"
                              className="cancel-booking-btn"
                              // className="fm-orng-btn"
                            >
                              Decline
                            </Button>
                          </>
                        ) : value.id === selectedBookingId && //value.status === "Accepted" ||
                          value.status == "Accepted-Paid" ? (
                          <span className="fm-btndeleteicon">
                            <Button
                              className="send-quote-btn"
                              onClick={() => {
                                this.props.changeHandymanBookingStatus(
                                  this.props.loggedInUser.user_type,
                                  ["handyman", "trader"].includes(
                                    this.props.loggedInUser.user_type
                                  )
                                    ? {
                                        trader_job_id: value.id,
                                        status: "Job-Done",
                                        reason: "Job-Done",
                                      }
                                    : {
                                        service_booking_id: value.id,
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
                              Mark as Complete
                            </Button>
                            <Button
                              onClick={() => {
                                this.showModal();
                              }}
                              type="default"
                              className="cancel-booking-btn"
                              // className="fm-orng-btn"
                            >
                              Cancel Booking
                            </Button>
                          </span>
                        ) : value.id === selectedBookingId &&
                          value.status === "Cancelled" ? (
                          <span className="fm-btndeleteicon">
                            <Button
                              className="send-quote-btn"
                              onClick={() => {
                                this.props.changeHandymanBookingStatus(
                                  this.props.loggedInUser.user_type,
                                  ["handyman", "trader"].includes(
                                    this.props.loggedInUser.user_type
                                  )
                                    ? {
                                        trader_job_id: value.id,
                                        status: "Job-Done",
                                        reason: "Job-Done",
                                      }
                                    : {
                                        service_booking_id: value.id,
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
                                  this.DeleteTraderJob(value.id);
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
                              {/* <Button type='default' className="success-btn">{value.status === 'Accepted-Paid' ? 'Confirmed' : value.status === 'Accepted' ? 'Pending' : value.status === 'Appointment' ? 'Pending' : ''}</Button> */}
                              <Button
                                type="default"
                                className={getStatusColor(
                                  //value.status == "Accepted" ||
                                  value.status == "Accepted-Paid"
                                    ? "Confirmed"
                                    : value.status
                                )}
                                //  className='success-btn'
                              >
                                {
                                  //value.status == "Accepted" ||
                                  value.status == "Accepted-Paid"
                                    ? "Confirmed"
                                    : value.status == "QuoteSent"
                                    ? "Quote Sent"
                                    : value.status == "Accepted"
                                    ? "Accepted"
                                    : value.status
                                }
                              </Button>
                            </span>
                          </>
                        )}
                      </Col>
                    </Row>
                    {value.id === selectedBookingId && (
                      <Row>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (selectedBookingId === value.id) {
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
          {/* <Pagination
            defaultCurrent={this.state.page}
            defaultPageSize={this.state.defaultPageSize} //default size of page
            onChange={this.handlePageChange}
            total={totalBookings} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={'mb-20'}
          /> */}
          {this.props.loggedInUser.user_type === "handyman" &&
          this.state.enquiryJob.jobs.length >= 10 ? (
            <div className="btn-show-block">
              <a
                onClick={(e) => this.handlePageChange(e)}
                className="show-more"
              >
                Show More
              </a>
            </div>
          ) : this.props.loggedInUser.user_type === "beauty" &&
            this.state.beautyEnquiry.service_bookings.length >= 10 ? (
            <div className="btn-show-block">
              <a
                onClick={(e) => this.handlePageChange(e)}
                className="show-more"
              >
                Show More
              </a>
            </div>
          ) : this.props.loggedInUser.user_type === "wellbeing" &&
            this.state.wellBeinngg.service_bookings.length >= 10 ? (
            <div className="btn-show-block">
              <a
                onClick={(e) => this.handlePageChange(e)}
                className="show-more"
              >
                Show More
              </a>
            </div>
          ) : (
            ""
          )}
        </Fragment>
      );
    } else {
      return <div className="pvf-alert-pad">No records found</div>;
    }
  };

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0;
  };

  renderHistoryBooking = () => {
    const {
      historyListCopy,
      totalHistories,
      selectedHistoryId,
      selectedHistoryDetail,
      visibleMo,
    } = this.state;
    const dataSearch = historyListCopy.filter((item) => {
      return (
        item.customer.name
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });
    if (
      historyListCopy &&
      historyListCopy.length > 0 &&
      dataSearch.length !== 0
    ) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            return (
              <Fragment>
                <div
                  className="my-new-order-block "
                  key={i}
                  onClick={() => {
                    if (selectedHistoryId !== value.id) {
                      if (
                        ["handyman", "trader"].includes(
                          this.props.loggedInUser.user_type
                        )
                      ) {
                        this.props.getJobBookingDetails(
                          {
                            data_type: "job",
                            history_id: value.id,
                            trader_job_id: value.id,
                          },
                          (res) => {
                            if (res.status === STATUS_CODES.OK) {
                              this.setState({
                                selectedHistoryId: value.id,
                                selectedHistoryDetail: res.data.job,
                              });
                            }
                          }
                        );
                      } else {
                        this.setState({
                          selectedHistoryId: value.id,
                          selectedHistoryDetail: [value],
                        });
                      }
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
                          <span className="pickup">
                            {"service_sub_bookings" in value
                              ? value.service_sub_bookings[0]
                                  .wellbeing_trader_service.name
                              : ""}
                          </span>
                        </div>
                        <div className="order-profile">
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
                          <div className="profile-name">
                            {value.customer.name}
                            <Rate
                              disabled
                              value={
                                value.valid_customer_rating
                                  ? value.valid_customer_rating.rating
                                  : 0
                              }
                            />
                            {}
                          </div>
                        </div>
                      </Row>
                      <Row gutter={0}>
                        <Col xs={24} sm={24} md={24} lg={6} xl={7}>
                          {["handyman", "trader"].includes(
                            this.props.loggedInUser.user_type
                          ) ? (
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
                          ) : (
                            value.id === selectedHistoryId && (
                              <div className="fm-eventb-date">
                                <h3>Issue Date</h3>
                                <span className="fm-eventb-month">
                                  {moment(
                                    value.booking_date,
                                    "YYYY-MM-DD"
                                  ).format("DD MMMM yy")}
                                </span>
                              </div>
                            )
                          )}
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
                            {["handyman", "trader"].includes(
                              this.props.loggedInUser.user_type
                            ) && (
                              <Col xs={24} sm={24} md={24} lg={8} xl={16}>
                                <div className="fm-eventb-desc">
                                  <h3>Request:</h3>
                                  <span className="fm-eventb-content">
                                    {value.description}
                                  </span>
                                </div>
                              </Col>
                            )}
                            {value.id === selectedHistoryId ? (
                              <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                <div className="">
                                  <div className="fm-eventb-desc mt-20">
                                    <h3>Service:</h3>
                                    <span className="fm-eventb-content">
                                      {"service_sub_bookings" in value
                                        ? value.service_sub_bookings[0]
                                            .wellbeing_trader_service.name
                                        : ""}
                                    </span>
                                  </div>
                                  <div className="fm-eventb-desc mt-20">
                                    <h3>Contact Name:</h3>
                                    <span className="fm-eventb-content">
                                      {value.customer && value.customer.name}
                                    </span>
                                    <span className="send-message">
                                      <Link onClick={this.SendMessageModal2}>
                                        Send Message
                                      </Link>
                                      {["handyman", "trader"].includes(
                                        this.props.loggedInUser.user_type
                                      ) ? (
                                        <SendMessageModal2
                                          visible={visibleMo}
                                          onCancel={this.handleCancel}
                                          vendor_data={selectedHistoryDetail}
                                          name={
                                            selectedHistoryDetail.customer.name
                                          }
                                          image={
                                            selectedHistoryDetail.customer
                                              .image_thumbnail
                                          }
                                        />
                                      ) : (
                                        <SendMessageModal2
                                          visible={visibleMo}
                                          onCancel={this.handleCancel}
                                          vendor_data={selectedHistoryDetail}
                                          name={
                                            selectedHistoryDetail[0].customer
                                              .name
                                          }
                                          image={
                                            selectedHistoryDetail[0].customer
                                              .image_thumbnail
                                          }
                                        />
                                      )}
                                    </span>
                                  </div>

                                  <div className="fm-eventb-desc mt-20">
                                    <h3>Email Address:</h3>
                                    <span className="fm-eventb-content">
                                      {value.customer.email}
                                    </span>
                                  </div>
                                  <div className="fm-eventb-desc mt-20">
                                    <h3>Phone Number:</h3>
                                    <span className="fm-eventb-content">
                                      {value.customer.full_mobile_no
                                        ? value.customer.full_mobile_no
                                        : value.customer.mobile_no}
                                    </span>
                                  </div>

                                  {["handyman", "trader"].includes(
                                    this.props.loggedInUser.user_type
                                  ) && (
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
                                                    : require("../../../../../assets/images/pr-img2.jpg")
                                                }
                                              />
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div>
                                    {(value.status === "Rejected" ||
                                      value.status === "Cancelled") && (
                                      <div className="fm-eventb-desc mt-20 rejected-block">
                                        <div className="rj-head">
                                          <CloseCircleOutlined />
                                          <span>STATUS {value.status}</span>
                                        </div>
                                        <div className="rj-text">
                                          <h3>{value.reason}</h3>
                                          <h4>
                                            {value.comment ? "Message" : ""}
                                          </h4>
                                          <p>{value.comment}</p>
                                        </div>
                                      </div>
                                    )}

                                    {(value.status === "Booking-Done" ||
                                      value.status === "Job-Done") && (
                                      <div className="fm-eventb-desc mt-20 response-block">
                                        <CheckCircleFilled />
                                        <span>Job Completed</span>
                                      </div>
                                    )}
                                  </div>
                                  {/* <Form.Item className='fm-apply-label'>
                                <span className="fm-arrow-label">Total</span>
                                <div className='fm-apply-input'>
                                  <Input defaultValue={`$AUD ${selectedHistoryDetail.cost}.00`} placeholder={'Type your quote here'} enterButton='Search' className='shadow-input' />
                                  <Button type='primary' className='fm-apply-btn'>Quote</Button>
                                </div>
                              </Form.Item>
                              <Form.Item className='fm-apply-label'>
                                <Button className="fm-orng-btn mr-10"
                                  disabled={value.status === 'Complete' ? false : true}
                                  onClick={() => this.setState({ visibleDisputeModal: true })}
                                  type='primary' size='middle' >
                                  Request Dispute
                                </Button>
                              </Form.Item>
                              <Form.Item className='fm-apply-label'>
                                <Button
                                  disabled={value.status === 'Disputed' ? false : true}
                                  onClick={() => this.setState({ visibleReplyDisputeModal: true })} type='primary' size='middle' className="fm-orng-btn mr-10"
                                >
                                  Reply Dispute
                                </Button>
                              </Form.Item>
                              <Form.Item className='fm-apply-label'>
                                <Button
                                  onClick={() => this.setState({ visibleReviewModal: true })}
                                  type='primary' size='middle' className="fm-orng-btn mr-10"
                                >
                                  View Rating
                                </Button>
                              </Form.Item> */}
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
                        {["handyman", "trader"].includes(
                          this.props.loggedInUser.user_type
                        ) ? (
                          <div className="bokng-hsty-hour-price">
                            <div className="date mb-0">
                              {moment(value.created_at).format("DD MMM, YYYY")}
                            </div>
                          </div>
                        ) : (
                          <div className="bokng-hsty-hour-price">
                            <div className="time ">
                              {moment(value.start_time, "hh:mm:ss").format(
                                "LT"
                              )}
                            </div>
                            <div className="date mb-0">
                              {moment(value.booking_date, "YYYY-MM-DD").format(
                                "DD MMMM yy"
                              )}
                            </div>
                          </div>
                        )}
                      </Row>
                      <Row gutter={0}>
                        {/* {this.displayReviewRatingSection(value)} */}
                        {value.id === selectedHistoryId &&
                        (value.status === "Cancelled" ||
                          value.status == "Completed" ||
                          value.status == "Job-Done" ||
                          value.status == "Booking-Done") ? (
                          <>
                            <Button
                              className="send-quote-btn"
                              onClick={() => {
                                this.DeleteTraderJob(value.id);
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
                              value.status == "Booking-Done") && (
                              <i
                                className="trash-icon"
                                onClick={() => {
                                  this.DeleteTraderJob(value.id);
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
                                  : ["Job-Done", "Booking-Done"].includes(
                                      value.status
                                    )
                                  ? "Completed"
                                  : value.status
                              )}
                              //  className='success-btn'
                            >
                              {value.status == "Accepted"
                                ? "Confirmed"
                                : ["Job-Done", "Booking-Done"].includes(
                                    value.status
                                  )
                                ? "Completed"
                                : value.status}
                            </Button>
                          </>
                        )}
                      </Row>
                      {value.id === selectedHistoryId && (
                        <Row>
                          <MinusCircleOutlined
                            onClick={() => {
                              if (selectedHistoryId === value.id) {
                                this.setState({ selectedHistoryId: "" });
                              }
                            }}
                          />
                        </Row>
                      )}
                    </Col>
                  </Row>
                </div>
              </Fragment>
            );
          })}
          {/* <Pagination
            defaultCurrent={this.state.page}
            defaultPageSize={this.state.defaultPageSize} //default size of page
            onChange={this.handlePageChange}
            total={totalHistories} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={'mb-20'}
          /> */}
          {this.props.loggedInUser.user_type === "handyman" &&
          this.state.checkempty.length >= 10 ? (
            <div className="btn-show-block">
              <a
                onClick={(e) => this.handlePageChange(e)}
                className="show-more"
              >
                Show More
              </a>
            </div>
          ) : this.props.loggedInUser.user_type === "beauty" &&
            this.state.beautyEnquiry.service_bookings.length >= 10 ? (
            <div className="btn-show-block">
              <a
                onClick={(e) => this.handlePageChange(e)}
                className="show-more"
              >
                Show More
              </a>
            </div>
          ) : this.props.loggedInUser.user_type === "wellbeing" &&
            this.state.wellBeinngg.service_bookings.length >= 10 ? (
            <div className="btn-show-block">
              <a
                onClick={(e) => this.handlePageChange(e)}
                className="show-more"
              >
                Show More
              </a>
            </div>
          ) : (
            ""
          )}
        </Fragment>
      );
    } else {
      return <div className="pvf-alert-pad">No records found</div>;
    }
  };

  /**
   * @method onChangeCalenderView
   * @description handle calender view change
   */
  onChangeCalenderView = (view) => {
    const { search_keyword } = this.state;
    this.setState(
      {
        calenderView: view,
        selectedBookingDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.getBookingsForCalenderDate();
        }
        this.getDashboardDetails(new Date(), search_keyword);
      }
    );
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
                {displayCalenderDate(
                  selectedBookingDate ? selectedBookingDate : Date.now()
                )}
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
  // transformActivity = (activity) => {
  //   switch (activity.activity_type) {
  //     case "Service Booked":
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.date).format("YYYY-MM-DD h:mm:ss"),
  //         startTime: activity.start_time,
  //         endTime: activity.end_time,
  //         time: `${Math.abs(
  //           moment(activity.start_time, "h:mm:ss").diff(
  //             moment(activity.end_time, "h:mm:ss"),
  //             "m"
  //           )
  //         )} mins`,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.price ? activity.price : "",
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     case "Event Enquiries":
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
  //         startTime: activity.start_time,
  //         endTime: activity.end_time,
  //         time: `${Math.abs(
  //           moment(activity.start_time, "YYYY-MM-DD h:mm:ss").diff(
  //             moment(activity.end_time, "YYYY-MM-DD h:mm:ss"),
  //             "m"
  //           )
  //         )} mins`,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.price ? activity.price : "",
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     case "Event Booked":
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
  //         startTime: activity.start_time,
  //         endTime: activity.end_time,
  //         time: `${Math.abs(
  //           moment(activity.start_time, "hh:mm").diff(
  //             moment(activity.end_time, "hh:mm"),
  //             "m"
  //           )
  //         )} mins`,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.price ? activity.price : "",
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     case "Trader Jobs":
  //       let today = moment().format("YYYY-MM-DD");
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.date).format("YYYY-MM-DD h:mm:ss"),
  //         startTime: moment(today + " " + activity.start_time).format(
  //           `YYYY-MM-DD h:mm:ss`
  //         ),
  //         endTime: moment(today + " " + activity.end_time).format(
  //           `YYYY-MM-DD h:mm:ss`
  //         ),
  //         time: `${Math.abs(
  //           moment(activity.start_time, "h:mm:ss").diff(
  //             moment(activity.end_time, "h:mm:ss"),
  //             "m"
  //           )
  //         )} mins`,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.price ? activity.price : "",
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     case "Quote Request Sent":
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.date).format("YYYY-MM-DD h:mm:ss"), // time not available
  //         startTime: null,
  //         endTime: null,
  //         time: null,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.price ? activity.price : "",
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     case "Offer Sent":
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
  //         startTime: activity.created_at,
  //         endTime: null, // end time not available
  //         time: null,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.offer_price,
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     case "Restaurant Order":
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
  //         startTime: moment(activity.created_at).format("h:mm:ss"),
  //         endTime: null, // end time not available
  //         time: null,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.offer_price,
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     case "Booked An Inspection":
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.inspection_date).format("YYYY-MM-DD h:mm:ss"),
  //         startTime: moment(activity.inspection_time).format("h:mm:ss"),
  //         endTime: null, // end time not available
  //         time: null,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.offer_price,
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     case "Applied Job":
  //       return {
  //         activity_type: activity.activity_type,
  //         module_type: activity.module_type,
  //         date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
  //         startTime: moment(activity.created_at).format("h:mm:ss"),
  //         endTime: null, // end time not available
  //         time: null,
  //         title: activity.title,
  //         description: activity.description ? activity.description : "",
  //         category: activity.category_name ? activity.category_name : "",
  //         subCategory: activity.sub_category_name
  //           ? ` | ${activity.sub_category_name}`
  //           : "",
  //         price: activity.offer_price,
  //         businessName: activity.business_name ? activity.business_name : "",
  //         quantity: null,
  //         size: null,
  //       };
  //     default:
  //       return activity;
  //   }
  // };

  // getListDataForDay = (day) => {
  //   const { monthData, monthStart } = this.state;
  //   let result = monthData.filter((activity) => {
  //     let transformedActivity = this.transformActivity(activity);
  //     if (transformedActivity) {
  //       let compareDate = moment(monthStart)
  //         .add(day, "days")
  //         .format("YYYY-MM-DD");
  //       let targetDate = moment(transformedActivity.date).format("YYYY-MM-DD");
  //       if (targetDate == compareDate) {
  //         return activity;
  //       }
  //     }
  //   });

  //   return result;
  // };

  // getListData = (value) => {
  //   let listData = [];
  //   switch (value.date()) {
  //     case 1:
  //       listData = this.getListDataForDay(0);
  //       break;
  //     case 2:
  //       listData = this.getListDataForDay(1);
  //       break;
  //     case 3:
  //       listData = this.getListDataForDay(2);
  //       break;
  //     case 4:
  //       listData = this.getListDataForDay(3);
  //       break;
  //     case 5:
  //       listData = this.getListDataForDay(4);
  //       break;
  //     case 6:
  //       listData = this.getListDataForDay(5);
  //       break;
  //     case 7:
  //       listData = this.getListDataForDay(6);
  //       break;
  //     case 8:
  //       listData = this.getListDataForDay(7);
  //       break;
  //     case 9:
  //       listData = this.getListDataForDay(8);
  //       break;
  //     case 10:
  //       listData = this.getListDataForDay(9);
  //       break;
  //     case 11:
  //       listData = this.getListDataForDay(10);
  //       break;
  //     case 12:
  //       listData = this.getListDataForDay(11);
  //       break;
  //     case 13:
  //       listData = this.getListDataForDay(12);
  //       break;
  //     case 14:
  //       listData = this.getListDataForDay(13);
  //       break;
  //     case 15:
  //       listData = this.getListDataForDay(14);
  //       break;
  //     case 16:
  //       listData = this.getListDataForDay(15);
  //       break;
  //     case 17:
  //       listData = this.getListDataForDay(16);
  //       break;
  //     case 18:
  //       listData = this.getListDataForDay(17);
  //       break;
  //     case 19:
  //       listData = this.getListDataForDay(18);
  //       break;
  //     case 20:
  //       listData = this.getListDataForDay(19);
  //       break;
  //     case 21:
  //       listData = this.getListDataForDay(20);
  //       break;
  //     case 22:
  //       listData = this.getListDataForDay(21);
  //       break;
  //     case 23:
  //       listData = this.getListDataForDay(22);
  //       break;
  //     case 24:
  //       listData = this.getListDataForDay(23);
  //       break;
  //     case 25:
  //       listData = this.getListDataForDay(24);
  //       break;
  //     case 26:
  //       listData = this.getListDataForDay(25);
  //       break;
  //     case 27:
  //       listData = this.getListDataForDay(26);
  //       break;
  //     case 28:
  //       listData = this.getListDataForDay(27);
  //       break;
  //     case 29:
  //       listData = this.getListDataForDay(28);
  //       break;
  //     case 30:
  //       listData = this.getListDataForDay(29);
  //       break;
  //     case 31:
  //       listData = this.getListDataForDay(30);
  //       break;
  //     default:
  //   }
  //   return listData || [];
  // };

  /**
   * @method dateCellRender
   * @description render calender dates cells
   */
  dateCellRender = (values) => {
    const listData = this.state.vendorAllDayCalenderBookingList;
    let formatedCalanderDate = moment(values).format("YYYY-MM-DD");
    let isBook = false;
    for (const [key, value] of Object.entries(listData)) {
      // console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"

      // if (key === formatedCalanderDate) {

      let vLength = value.slots.length;
      // value.slots.map((val) => {
      //   vLength = vLength - 1;
      //   if (vLength == 0) {
      //     if (val.occupied_by !== "none") {
      //       isBook = true;
      //     }
      //   }
      // });
      if (vLength > 0) {
        isBook = true;
      }

      // isBook = true;
      // }
    }

    return (
      <span className="events">{isBook ? <Badge status={"error"} /> : ""}</span>
    );
  };

  dateCellRenderWellbeing = (value) => {
    const listData = this.state.wellBeingBookingSlot;
    let formatedCalanderDate = moment(value).format("YYYY-MM-DD");
    let isBook = false;

    for (const [key, values] of Object.entries(listData)) {
      let vLength = values.slots.length;
      if (vLength > 0) {
        isBook = true;
      }
    }

    return (
      <span className="events">{isBook ? <Badge status={"error"} /> : ""}</span>
    );
  };

  getBookingsForCalenderDate = (date, seearchKeyword = null) => {
    const { id, user_type } = this.props.loggedInUser;
    const selectedDate = moment(date).format("YYYY-MM-DD");
    this.setState(
      {
        selectedBookingDate: selectedDate,
      },
      () => {
        if (selectedDate) {
          const req = seearchKeyword
            ? {
                user_id: id,
                date: selectedDate,
                search_keyword: seearchKeyword,
                // to_date: selectedDate
              }
            : {
                user_id: id,
                date: selectedDate,
              };
          if (["handyman"].includes(user_type)) {
            this.props.getTraderMonthBooking(req, (res) => {
              //  console.log(res, "res id month");
              if (res.status === 200 && res.data) {
                let selectedDateList = res.data.jobs[selectedDate];
                this.setState({
                  vendorAllDayCalenderBookingList: res.data.month_slots,
                });
                this.setState({
                  customerCalenderBookingList:
                    selectedDateList !== undefined ? selectedDateList : [],
                });
              }
            });
          } else if (["trader"].includes(user_type)) {
            this.props.getTraderMonthBooking(req, (res) => {
              if (res.status === 200 && res.data) {
                let selectedDateList = res.data.jobs[selectedDate];
                this.setState({
                  vendorAllDayCalenderBookingList: res.data.month_slots,
                });
                this.setState({
                  mydata: res.data.jobs,
                  customerCalenderBookingList:
                    selectedDateList !== undefined ? selectedDateList : [],
                });
              }
            });
          } else {
            this.props.getTraderMonthWellbeingBooking(req, (res) => {
              if (res.status === 200 && res.data) {
                let selectedDateList = res.data.service_bookings[selectedDate];
                this.setState({ wellBeingBookingSlot: res.data.month_slots });
                this.setState({
                  customerCalenderBookingList:
                    selectedDateList !== undefined ? selectedDateList : [],
                });
              }
            });
          }
        }
      }
    );
  };

  /**
   * @method onChangeBookingDates
   * @description handle booking dates change
   */
  onChangeBookingDates = (value) => {
    const { search_keyword } = this.state;
    this.getBookingsForCalenderDate(value, search_keyword);
    // this.getDashboardDetails(value)
  };
  /**
   * @method renderBokingCalenderItems
   * @description render calender booking items with time
   */
  renderBokingCalenderItems = () => {
    const { customerCalenderBookingList } = this.state;

    // console.log(
    //   "ProfileVendorHandyman ~ customerCalenderBookingList",
    //   customerCalenderBookingList
    // );
    if (customerCalenderBookingList && customerCalenderBookingList.length) {
      return (
        <ul className="flex-container wrap">
          {customerCalenderBookingList.map((value, i) => {
            //  console.log(value, "value!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@@@");
            return (
              <li key={`${i}_vendor_bookings`}>
                <div className="appointments-label" style={{ width: "60%" }}>
                  {value.customer.name}
                </div>

                <div className="appointments-time" style={{ width: "20%" }}>
                  {moment(
                    new Date("1979-01-01 " + (value.from || value.start_time))
                  ).format("LT")}
                </div>

                <div className="appointments-action" style={{ width: "20%" }}>
                  <i
                    className="trash-icon"
                    onClick={() =>
                      this.DeleteTraderJob(
                        value.tj_id ? value.tj_id : value.trader_job_id
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
                      ></path>
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
          <Alert message="No Appointments" type="error"></Alert>
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
      totalBookings,
      totalEnquiry,
      dataSearch,
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
      calenderView,
      vendorBookingList,
      selectedBookingDate,
      visibleQuoteSuccessModal,
      cancelBookingVisible,
      customerCalenderBookingList,
      checkempty,
      enquiryEmpty,
    } = this.state;
    const { loggedInUser, traderDetails } = this.props;
    return (
      <Layout className="event-booking-profile-wrap fm-event-vendor-wrap">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab my-booking-handyman"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section manager-page">
                  <div className="heading-search-block booking-box ">
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
                            //       this.onChangeBookingDates(
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
                <div className="sub-head-section">
                  <Text>&nbsp;</Text>
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
                          {!["trader", "wellbeing", "beauty"].includes(
                            loggedInUser.user_type
                          ) && (
                            <TabPane tab="Quotes" key="1">
                              {totalEnquiry <= 0 ? (
                                <h3>You have no enquiries</h3>
                              ) : (
                                <h3>
                                  You have {totalEnquiry} job enquires in total
                                </h3>
                              )}
                              {totalEnquiry > 0 &&
                                this.renderUpcomingEnquiries()}
                            </TabPane>
                          )}
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
                            {totalHistories <= 0 ? (
                              <h3>You have no jobs</h3>
                            ) : (
                              <h3>You have {totalHistories} appointments </h3>
                            )}
                            {totalHistories > 0 && this.renderHistoryBooking()}
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
                              <Option value="quote_sent">Quote Sent</Option>
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
                              <Option value="today">Today</Option>
                              <Option value="week">This Week</Option>
                              <Option value="month">This Month</Option>
                              <Option value="confirmed">Confirmed</Option>
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
                              <Option value="today">Today</Option>
                              <Option value="week">This Week</Option>
                              <Option value="month">This Month</Option>
                              <Option value="completed">Complete</Option>
                              <Option value="cancelled">Cancelled</Option>
                            </Select>
                          ) : null}
                        </div>
                        {/* <div className="card-header-select"><label>Show:</label>
                          <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="This week">
                            <Option value="week">This week</Option>
                            <Option value="month">This month</Option>
                          </Select></div> */}
                      </Card>
                    </Col>
                    <Col
                      className="pf-vendor-dashboard-right"
                      xs={24}
                      sm={24}
                      md={24}
                      lg={8}
                      xl={8}
                    >
                      {loggedInUser.user_type === "trader" && (
                        <>
                          <div className="appointments-slot right-calender-view">
                            <div className="appointments-heading">
                              <div className="date-heading">My Calender</div>
                              <div className="card-header-select">
                                {/* <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5625 21.25C3.53125 21.25 2.59375 20.2188 2.59375 19.1875L2.5 6.25C2.5 5.21875 3.34375 4.375 4.375 4.375H6.25V2.5H8.125V4.375H15.7188V2.5H17.5938V4.375C21.0625 4.375 21.3438 4.9375 21.3438 6.90625V19.1875C21.3438 20.3125 20.5938 21.25 19.5625 21.25H4.5625ZM18.4375 19.375C18.9062 19.375 19.375 19 19.375 18.4375V11.875H4.375V18.4375C4.375 19 4.75 19.375 5.3125 19.375H18.4375ZM4.375 10H19.375V7.1875C19.375 6.625 19 6.25 18.4375 6.25H17.5V8.125H15.625V6.25H8.125V8.125H6.25V6.25H5.3125C4.75 6.25 4.375 6.71875 4.375 7.1875V10ZM15.0744 17.1664C16.0461 17.1664 16.8339 16.3786 16.8339 15.4069C16.8339 14.4352 16.0461 13.6475 15.0744 13.6475C14.1027 13.6475 13.315 14.4352 13.315 15.4069C13.315 16.3786 14.1027 17.1664 15.0744 17.1664Z" fill="#363B40"/>
                            </svg> */}
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
                                    onChange={(e) => {
                                      this.onChangeCalenderView(e);
                                    }}
                                    defaultValue="Monthly"
                                  >
                                    <Option value="week">Weekly</Option>
                                    <Option value="month">Monthly</Option>
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
                                // onPanelChange={(e, mode) => {
                                //   let startDate = moment(e)
                                //     .startOf("month")
                                //     .format("YYYY-MM-DD");
                                //   let endDate = moment(e)
                                //     .endOf("month")
                                //     .format("YYYY-MM-DD");
                                //   this.setState(
                                //     {
                                //       selectedMode: mode,
                                //       bookingListCalenderView: mode,
                                //       monthStart: startDate,
                                //       monthEnd: endDate,
                                //     },
                                //     () => {
                                //       this.getDashboardDetails(1);
                                //     }
                                //   );
                                // }}
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
                                {customerCalenderBookingList &&
                                  customerCalenderBookingList.length}{" "}
                                Activities today
                              </div>
                            </div>
                            <div className="appointments-body">
                              {this.renderBokingCalenderItems()}
                            </div>
                          </div>
                        </>
                      )}

                      {loggedInUser.user_type === "wellbeing" && (
                        <>
                          <div className="appointments-slot right-calender-view">
                            <div className="appointments-heading">
                              <div className="date-heading">My Calender</div>
                              <div className="card-header-select">
                                {/* <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5625 21.25C3.53125 21.25 2.59375 20.2188 2.59375 19.1875L2.5 6.25C2.5 5.21875 3.34375 4.375 4.375 4.375H6.25V2.5H8.125V4.375H15.7188V2.5H17.5938V4.375C21.0625 4.375 21.3438 4.9375 21.3438 6.90625V19.1875C21.3438 20.3125 20.5938 21.25 19.5625 21.25H4.5625ZM18.4375 19.375C18.9062 19.375 19.375 19 19.375 18.4375V11.875H4.375V18.4375C4.375 19 4.75 19.375 5.3125 19.375H18.4375ZM4.375 10H19.375V7.1875C19.375 6.625 19 6.25 18.4375 6.25H17.5V8.125H15.625V6.25H8.125V8.125H6.25V6.25H5.3125C4.75 6.25 4.375 6.71875 4.375 7.1875V10ZM15.0744 17.1664C16.0461 17.1664 16.8339 16.3786 16.8339 15.4069C16.8339 14.4352 16.0461 13.6475 15.0744 13.6475C14.1027 13.6475 13.315 14.4352 13.315 15.4069C13.315 16.3786 14.1027 17.1664 15.0744 17.1664Z" fill="#363B40"/>
                            </svg> */}
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
                                    onChange={(e) => {
                                      this.onChangeCalenderView(e);
                                    }}
                                    defaultValue="Monthly"
                                  >
                                    <Option value="week">Weekly</Option>
                                    <Option value="month">Monthly</Option>
                                  </Select> */}
                              </div>
                            </div>
                            {calenderView === "week" ? (
                              this.renderCalender()
                            ) : (
                              <Calendar
                                onSelect={this.onChangeBookingDates}
                                fullscreen={false}
                                dateCellRender={this.dateCellRenderWellbeing}
                                // onPanelChange={(e, mode) => {
                                //   let startDate = moment(e)
                                //     .startOf("month")
                                //     .format("YYYY-MM-DD");
                                //   let endDate = moment(e)
                                //     .endOf("month")
                                //     .format("YYYY-MM-DD");
                                //   this.setState(
                                //     {
                                //       selectedMode: mode,
                                //       bookingListCalenderView: mode,
                                //       monthStart: startDate,
                                //       monthEnd: endDate,
                                //     },
                                //     () => {
                                //       this.getDashboardDetails(1);
                                //     }
                                //   );
                                // }}
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
                                {customerCalenderBookingList &&
                                  customerCalenderBookingList.length}{" "}
                                Activities today
                              </div>
                            </div>
                            <div className="appointments-body">
                              {this.renderBokingCalenderItems()}
                            </div>
                          </div>
                        </>
                      )}

                      {loggedInUser.user_type === "handyman" && (
                        <>
                          <div className="appointments-slot right-calender-view">
                            <div className="appointments-heading">
                              <div className="date-heading">My Calender</div>
                              <div className="card-header-select">
                                {/* <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5625 21.25C3.53125 21.25 2.59375 20.2188 2.59375 19.1875L2.5 6.25C2.5 5.21875 3.34375 4.375 4.375 4.375H6.25V2.5H8.125V4.375H15.7188V2.5H17.5938V4.375C21.0625 4.375 21.3438 4.9375 21.3438 6.90625V19.1875C21.3438 20.3125 20.5938 21.25 19.5625 21.25H4.5625ZM18.4375 19.375C18.9062 19.375 19.375 19 19.375 18.4375V11.875H4.375V18.4375C4.375 19 4.75 19.375 5.3125 19.375H18.4375ZM4.375 10H19.375V7.1875C19.375 6.625 19 6.25 18.4375 6.25H17.5V8.125H15.625V6.25H8.125V8.125H6.25V6.25H5.3125C4.75 6.25 4.375 6.71875 4.375 7.1875V10ZM15.0744 17.1664C16.0461 17.1664 16.8339 16.3786 16.8339 15.4069C16.8339 14.4352 16.0461 13.6475 15.0744 13.6475C14.1027 13.6475 13.315 14.4352 13.315 15.4069C13.315 16.3786 14.1027 17.1664 15.0744 17.1664Z" fill="#363B40"/>
                              </svg> */}
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
                                      onChange={(e) => {
                                        this.onChangeCalenderView(e);
                                      }}
                                      defaultValue="Monthly"
                                    >
                                      <Option value="week">Weekly</Option>
                                      <Option value="month">Monthly</Option>
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
                                // onPanelChange={(e, mode) => {
                                //   let startDate = moment(e)
                                //     .startOf("month")
                                //     .format("YYYY-MM-DD");
                                //   let endDate = moment(e)
                                //     .endOf("month")
                                //     .format("YYYY-MM-DD");
                                //   this.setState(
                                //     {
                                //       selectedMode: mode,
                                //       bookingListCalenderView: mode,
                                //       monthStart: startDate,
                                //       monthEnd: endDate,
                                //     },
                                //     () => {
                                //       this.getDashboardDetails(1);
                                //     }
                                //   );
                                // }}
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
                                {customerCalenderBookingList &&
                                  customerCalenderBookingList.length}{" "}
                                Activities today
                              </div>
                            </div>
                            <div className="appointments-body">
                              {this.renderBokingCalenderItems()}
                            </div>
                          </div>
                        </>
                      )}

                      {loggedInUser.user_type === "beauty" && (
                        <>
                          <div className="appointments-slot right-calender-view">
                            <div className="appointments-heading">
                              <div className="date-heading">My Calender</div>
                              <div className="card-header-select">
                                {/* <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5625 21.25C3.53125 21.25 2.59375 20.2188 2.59375 19.1875L2.5 6.25C2.5 5.21875 3.34375 4.375 4.375 4.375H6.25V2.5H8.125V4.375H15.7188V2.5H17.5938V4.375C21.0625 4.375 21.3438 4.9375 21.3438 6.90625V19.1875C21.3438 20.3125 20.5938 21.25 19.5625 21.25H4.5625ZM18.4375 19.375C18.9062 19.375 19.375 19 19.375 18.4375V11.875H4.375V18.4375C4.375 19 4.75 19.375 5.3125 19.375H18.4375ZM4.375 10H19.375V7.1875C19.375 6.625 19 6.25 18.4375 6.25H17.5V8.125H15.625V6.25H8.125V8.125H6.25V6.25H5.3125C4.75 6.25 4.375 6.71875 4.375 7.1875V10ZM15.0744 17.1664C16.0461 17.1664 16.8339 16.3786 16.8339 15.4069C16.8339 14.4352 16.0461 13.6475 15.0744 13.6475C14.1027 13.6475 13.315 14.4352 13.315 15.4069C13.315 16.3786 14.1027 17.1664 15.0744 17.1664Z" fill="#363B40"/>
                              </svg> */}
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
                                      onChange={(e) => {
                                        this.onChangeCalenderView(e);
                                      }}
                                      defaultValue="Monthly"
                                    >
                                      <Option value="week">Weekly</Option>
                                      <Option value="month">Monthly</Option>
                                    </Select> */}
                              </div>
                            </div>
                            {calenderView === "week" ? (
                              this.renderCalender()
                            ) : (
                              <Calendar
                                onSelect={this.onChangeBookingDates}
                                fullscreen={false}
                                dateCellRender={this.dateCellRenderWellbeing}
                                // onPanelChange={(e, mode) => {
                                //   let startDate = moment(e)
                                //     .startOf("month")
                                //     .format("YYYY-MM-DD");
                                //   let endDate = moment(e)
                                //     .endOf("month")
                                //     .format("YYYY-MM-DD");
                                //   this.setState(
                                //     {
                                //       selectedMode: mode,
                                //       bookingListCalenderView: mode,
                                //       monthStart: startDate,
                                //       monthEnd: endDate,
                                //     },
                                //     () => {
                                //       this.getDashboardDetails(1);
                                //     }
                                //   );
                                // }}
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
                                {customerCalenderBookingList &&
                                  customerCalenderBookingList.length}{" "}
                                Activities today
                              </div>
                            </div>
                            <div className="appointments-body">
                              {this.renderBokingCalenderItems()}
                            </div>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {selectedBookingDetail && (
          <RescheduleModal
            handleClose={() => this.setState({ visibleRescheduleModal: false })}
            visibleRescheduleModal={visibleRescheduleModal}
            selectedBookingId={selectedBookingId}
            page={page}
            selectedBookingDetail={selectedBookingDetail}
          />
        )}
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
                if (selectedEnquiryId) {
                  //   console.log("decline active tab 1", selectedEnquiryId);
                  this.props.cancelTraderQuoteStatus(
                    {
                      trader_quote_request_id: selectedEnquiryId,
                      status: "Cancelled",
                      reason: this.state.checked,
                      comments: values.message,
                    },
                    (res) => {
                      if (res.status === STATUS_CODES.OK) {
                        toastr.success(
                          langs.success,
                          MESSAGES.DECILNED_ENQUIRY
                        );
                        this.setState(
                          {
                            selectedEnquiryId: "",
                          },
                          () => this.getEnquiries(page)
                        );
                        this.handleCancel();
                      }
                    }
                  );
                } else {
                  // console.log("decline active tab 2", selectedBookingId);
                  this.props.changeHandymanBookingStatus(
                    this.props.loggedInUser.user_type,
                    ["handyman", "trader"].includes(
                      this.props.loggedInUser.user_type
                    )
                      ? {
                          trader_job_id: selectedBookingId,
                          status: "Declined",
                          reason: this.state.checked,
                          comments: values.message,
                        }
                      : {
                          service_booking_id: selectedBookingId,
                          status: "Cancelled",
                          reason: this.state.checked,
                          comments: values.message,
                        },
                    (res) => {
                      if (res.status === STATUS_CODES.OK) {
                        toastr.success(
                          langs.success,
                          MESSAGES.DECILNED_BOOKING
                        );
                        this.setState(
                          {
                            selectedBookingId: "",
                          },
                          () => this.getJobList(page)
                        );
                        this.handleCancel();
                      }
                    }
                  );
                }
                this.setState({
                  visible: false,
                  visibleCreateQuoteModal: false,
                  cancelBookingVisible: true,
                  selectedHistoryId: "",
                  selectedBookingId: "",
                  selectedEnquiryId: "",
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
                    "I don't feel safe while communicating with the customer"
                  }
                  onChange={() =>
                    this.setState({
                      checked:
                        "I don't feel safe while communicating with the customer",
                    })
                  }
                >
                  {"I don't feel safe while communicating with the customer"}
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
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <Modal
          // title='Send Quote'
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
                  this.state.currentvalue.customer &&
                  this.state.currentvalue.customer.image
                    ? this.state.currentvalue.customer.image
                    : require("../../../../../assets/images/avatar3.png")
                }
              />
            </div>
            <div className="profile-name">
              {this.state.currentvalue.customer &&
                this.state.currentvalue.customer.name}
              <Rate
                disabled
                value={
                  this.state.currentvalue.valid_customer_rating
                    ? this.state.currentvalue.valid_customer_rating.rating
                    : 0
                }
              />
              {}
            </div>
          </div>
          <div class="ant-modal-header">
            <div class="ant-modal-title" id="rcDialogTitle1">
              Send Quote
            </div>
          </div>
          <div className="padding fm-prh-modalwrap">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={(values) => {
                let basicQuote =
                  traderDetails && traderDetails.user.trader_profile.basic_quote
                    ? 1
                    : 0;
                let ratePer =
                  traderDetails &&
                  traderDetails.user.trader_profile.rate_per_hour
                    ? traderDetails.user.trader_profile.rate_per_hour
                    : 0;
                let reqdata = {
                  from: this.state.currentvalue.from,
                  to: this.state.currentvalue.to,
                  description: this.state.currentvalue.description,
                  date: this.state.currentvalue.date,
                  user_id: loggedInUser.id,
                  trader_quote_request_id: selectedEnquiryId,
                  amount: values.amount
                    ? values.amount
                    : Array.isArray(this.state.currentvalue.quotes) &&
                      this.state.currentvalue.quotes.length
                    ? `${this.state.currentvalue.quotes[0].amount}.00`
                    : "0.00",
                  basic_quote: basicQuote,
                  per_hr: ratePer,
                };

                this.props.createQuote(reqdata, (res) => {
                  if (res.status === STATUS_CODES.OK) {
                    toastr.success(langs.success, MESSAGES.CREATE_QUOTE);
                    this.setState(
                      {
                        visibleCreateQuoteModal: false,
                        visibleQuoteSuccessModal: true,
                        selectedHistoryId: "",
                        selectedBookingId: "",
                        selectedEnquiryId: "",
                      },
                      () => this.getJobList(page)
                    );
                  }
                });
              }}
            >
              <Form.Item name="amount" className="fm-apply-label">
                <div className="fm-apply-input">
                  <div className="description">
                    {this.state.currentvalue.description}
                  </div>
                  <Input
                    addonBefore="AUD$"
                    defaultValue={
                      Array.isArray(this.state.currentvalue.quotes) &&
                      this.state.currentvalue.quotes.length
                        ? `${this.state.currentvalue.quotes[0].amount}.00`
                        : "0.00"
                    }
                    placeholder={"Type your quote here"}
                    enterButton="Search"
                    className="shadow-input"
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
                    // this.setState({
                    //   selectedHistoryId: "",
                    //   selectedBookingId: "",
                    //   selectedEnquiryId: ""
                    // });
                  }}
                >
                  Decline
                </Button>
                <Button
                  disabled={
                    this.state.currentvalue.status !== "Pending" ? true : false
                  }
                  type="default"
                  className="fm-orng-btn"
                  htmlType="submit"
                >
                  Send
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/* <Modal
          title='Create Quote'
          visible={visibleCreateQuoteModal}
          className={'custom-modal fm-md-modal style1'}
          footer={false}
          onCancel={() => {
            this.setState({ visibleCreateQuoteModal: false })
          }}
        >
          <div className='padding fm-prh-modalwrap'>
            <Form name='basic' initialValues={{ remember: true }}
              onFinish={(values) => {
                
                let basicQuote = traderDetails.user.trader_profile.basic_quote ? 1 : 0
                let ratePer = traderDetails.user.trader_profile.rate_per_hour ? traderDetails.user.trader_profile.rate_per_hour : 0
                
                let reqdata = {
                  from: moment(values.from).format('hh:mm:ss'),
                  to: moment(values.to).format('hh:mm:ss'),
                  description: values.description,
                  date: moment(values.date).format('YYYY-MM-DD'),
                  user_id: loggedInUser.id,
                  trader_quote_request_id: selectedEnquiryId,
                  amount: values.amount,
                  basic_quote: basicQuote,
                  per_hr: ratePer
                }
                this.props.createQuote(reqdata, (res) => {
                  if (res.status === STATUS_CODES.OK) {
                    toastr.success(langs.success, MESSAGES.CREATE_QUOTE);
                    this.getJobList(page)
                    this.setState({ visibleCreateQuoteModal: false })
                  }
                  
                })

              }}
            >
              <span className='fm-lbl-mdl'>Amount</span>
              <Form.Item name='amount'>
                <Input type='number' />
              </Form.Item>
              <span className='fm-lbl-mdl'>Date</span>
              <Form.Item name='date'>
                <DatePicker getPopupContainer={trigger => trigger.parentElement} />
              </Form.Item>
              <span className='fm-lbl-mdl'>Start time</span>
              <Form.Item name='from'>
                <TimePicker minuteStep={30} getPopupContainer={trigger => trigger.parentElement} />
              </Form.Item>
              <span className='fm-lbl-mdl' >End time</span>
              <Form.Item name='to'>
                <TimePicker minuteStep={30} getPopupContainer={trigger => trigger.parentElement} />
              </Form.Item>
              <span className='fm-lbl-mdl'>Description</span>
              <Form.Item name='description'>
                <TextArea rows={4} placeholder={'...'} className='shadow-input' />
              </Form.Item>
              <Form.Item className='text-center fm-send-submit'>
                <Button type='default' htmlType='submit'>Send</Button>
              </Form.Item>
            </Form>
          </div>
        </Modal> */}

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
            {`${moment(this.state.currentvalue.date).format(
              "DD/MM/YYYY"
            )} at ${convertTime24To12Hour(this.state.currentvalue.from)}
            - ${convertTime24To12Hour(this.state.currentvalue.to)}`}
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
            {`${moment(this.state.currentvalue.date).format(
              "DD/MM/YYYY"
            )} at ${convertTime24To12Hour(
              this.state.currentvalue.from
                ? this.state.currentvalue.from
                : this.state.currentvalue.start_time
            )}
           - ${convertTime24To12Hour(
             this.state.currentvalue.to
               ? this.state.currentvalue.to
               : this.state.currentvalue.end_time
           )}`}
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
  getTraderProfile,
  getEnquiryList,
  getEnquiryDetails,
  declineEventEnquiry,
  declineEnquiry,
  getHandyManVenderJobs,
  getJobBookingDetails,
  changeHandymanBookingStatus,
  getHandymanHistoryList,
  enableLoading,
  disableLoading,
  rescheduleHanymanBooking,
  createQuote,
  raiseHandymanDispute,
  replyHandymanDispute,
  submitHandymanReview,
  eventVenderCalendarBookings,
  DeleteTraderJobapi,
  listVendorServiceBeautyBookings,
  listVendorServiceBeautyBookingHistory,
  getTraderMonthWellbeingBooking,
  DeleteWellBeingApi,
  listVendorServiceSpaBookings,
  listVendorServiceSpaBookingsHistory,
  cancelTraderQuoteStatus,
  DeleteTraderJobss,
  getTraderMonthBooking,
  deleteTraderEnquiryUrl,
  getAllChat,
})(ProfileVendorHandyman);
