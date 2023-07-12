import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { ExclamationOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Menu,
  Dropdown,
  Pagination,
  Layout,
  Card,
  Typography,
  Button,
  Tabs,
  Table,
  Avatar,
  Row,
  Col,
  Input,
  Select,
  Badge,
  Modal,
} from "antd";
import AppSidebar from "../../dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import Icon from "../../customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  updateOrderStatusAPI,
  getClassfiedCategoryDetail,
  openLoginModel,
  getCustomerDashBoardDetailsClassifiedOffers,
  userJobApplicationListAPI,
  getUserInspectionList,
  getResume,
  getResumeDetail,
  getJobQuestions,
  deleteJobApplicationAPI,
  changeJobStatus,
  cancelBookedInspection,
  getPostAdDetail,
} from "../../../actions";
import { convertISOToUtcDateformate, salaryNumberFormate } from "../../common";
import "ant-design-pro/dist/ant-design-pro.css";
import {
  DEFAULT_IMAGE_TYPE,
  DASHBOARD_TYPES,
  BASE_URL,
} from "../../../config/Config";
import { langs } from "../../../config/localization";
import { DASHBOARD_KEYS } from "../../../config/Constant";
import { SearchOutlined } from "@ant-design/icons";
import { STATUS_CODES } from "../../../config/StatusCode";
import "./styles.less";
import "../../classified-templates/userdetail.less";
import ReceivedModal from "../../vendor/retail/comman-modals/ReceiveModel";
import DisputeModal from "../../dashboard/vendor-profiles/common-modals/DisputeModal";
import ReplyDisputeModal from "../../dashboard/vendor-profiles/common-modals/ReplyDisputeModal";
import UpdateOffer from "../common/modals/UpdateOffer";
import { ViewListingModal } from "../common/modals/ViewListingModal";
import ContactModal from "../common/modals/ContactModal";
import ViewOffer from "../common/modals/ViewOffer";
import SendMessageModal from "../common/modals/SendMessageModal";
import ConfirmCancelOfferModal from "../common/modals/ConfirmCancelOfferModal";
import Resume from "../../classified-templates/jobs/resume-builder/Resume";
import ViewQuestionsModal from "../common/modals/ViewQuestionsModal";
import { MESSAGES } from "../../../config/Message";
import UpdateInspectionModal from "../common/modals/UpdateInspectionModal";
import ConfirmModal from "../common/modals/ConfirmModal";
import PDFResumeModal from "../../common/PDFResumeModal";

const { Option } = Select;
const { Title, Text } = Typography;

// Pagination
function itemRender(current, type, originalElement) {
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

const JOB_APPLICATION_STATUS = [
  "Deactive",
  "Active",
  "Unapproved",
  "Rejected",
  "Incomplete",
];

class UserClassifiedsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      receivedOffers: [],
      filteredReceivedOffers: [],
      sentOffers: [],
      filteredSentOffers: [],
      topRatedList: [],
      recentlyViewList: [],
      orderDetail: "",
      receiveModal: false,
      search_keyword: "",
      visibleDisputeModal: false,
      visibleReplyDisputeModal: false,
      selectedCategory: "",
      updateOffer: false,
      classifiedDetail: {},
      isOfferUpdated: false,
      viewListing: false,
      classified_id: "",
      categoryId: "",
      sendMessage: false,
      viewOffer: false,
      cancelOffer: false,
      JobListing: [],
      total: 0,
      viewListingType: "",
      inspectionList: [],
      total_inspections: 0,
      subCategories: [],
      isOpenResumeModel: false,
      basicInfo: {},
      experience: [],
      education: [],
      skills: {},
      addFiles: [],
      documents: {},
      isAnswerModal: false,
      questions: [],
      answer: [],
      isUpdateInspection: false,
      isCancelInspection: false,
      isUpdateSuccess: false,
      isWithdraw: false,
      isWithdrawSuccess: false,
      withdrawId: "",
      inspectionTime: "",
      selectedInspectionId: null,
      editingInspection: null,
      selectedInspection: null,
      resumeFisOpenResume: false,
    };
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    this.props.getResume((res) => {});
  }

  /**
   * @method  componentDidMount
   * @description called after mounting the component
   */
  componentDidMount() {
    this.getOffers("receiver");
    this.getOffers("sender");
    this.getJobApplicationList();
    this.getInspections();
    console.log(this.props.resumeDetails,"dddddd")
    if (this.props.resumeDetails) {
      this.setState({
        basicInfo: {
          email: this.props.resumeDetails.email,
          first_name: this.props.resumeDetails.first_name,
          headline: this.props.resumeDetails.headline,
          home_location: this.props.resumeDetails.home_location,
          last_name: this.props.resumeDetails.last_name,
          phone_number: this.props.resumeDetails.phone_number,
        },
        experience: this.props.resumeDetails.work_experience,
        education: this.props.resumeDetails.education,
        skills: this.props.resumeDetails.skills,
        addFiles: this.props.resumeDetails.documents,
      });
    }
  }

  getOffers = (type) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const { search_keyword } = this.state;
    this.props.enableLoading();
    let req = {
      user_id: loggedInDetail.id,
      type, //the type can be "receiver" and "sender" as per requirement on front-end
      search: search_keyword,
    };
    this.props.getCustomerDashBoardDetailsClassifiedOffers(req, (response) => {
      this.props.disableLoading();
      if (response.status === 200 && response.data.status) {
        if (Array.isArray(response.data.data) && type == "receiver") {
          this.setState({
            receivedOffers: response.data.data,
            filteredReceivedOffers: response.data.data,
          });
        }
        if (Array.isArray(response.data.data) && type == "sender") {
          this.setState({
            sentOffers: response.data.data,
            filteredSentOffers: response.data.data,
          });
        }
      }
    });
  };

  /**
   * @method getJobApplicationList
   * @description get job application list
   */
  getJobApplicationList = () => {
    const { loggedInUser } = this.props;
    const { search_keyword } = this.state;
    let reqData = {
      // category_id: '',
      user_id: loggedInUser.id,
      // page: page,
      // per_page: 12,
      // filter: filter,
      search: search_keyword,
    };
    this.props.userJobApplicationListAPI(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let applicationList =
          res.data && Array.isArray(res.data.data) && res.data.data.length
            ? res.data.data
            : [];
        this.setState({
          JobListing: applicationList,
          total: res.data.total_ads,
          
        });
      }
    });
  };

  /**
   * @method getInspections
   * @description get ad list of inspection
   */
  getInspections = () => {
    const { loggedInUser } = this.props;
    const { search_keyword } = this.state;
    let reqData = {
      user_id: loggedInUser.id,
      //  page: page,
      //  per_page: 12,
      // search: search_keyword
    };
    this.props.getUserInspectionList(reqData, (res) => {
      if (res.status === 200) {
        let item = res.data && res.data.data;
        let inspectionList =
          item && Array.isArray(item.data) && item.data.length ? item.data : [];
        let category =
          res.data &&
          res.data.sub_categories &&
          Array.isArray(res.data.sub_categories) &&
          res.data.sub_categories.length
            ? res.data.sub_categories
            : [];
        this.setState({
          inspectionList,
          total_inspections: item.total,
          subCategories: category,
        });
      }
    });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { selectedDate, flag } = this.state;
    this.getDashBoardDetails(selectedDate, flag, e, "");
  };

  renderCategories = () => {
    const { categories } = this.props;
    return categories.map((cat) => {
      return (
        <Option key={cat.id} value={cat.name}>
          {cat.name}
        </Option>
      );
    });
  };

  onSelectCategory = (category) => {
    if (category) {
      this.setState(
        {
          selectedCategory: category,
        },
        this.filterOrdersByCategory(category)
      );
    } else {
      this.setState(
        {
          selectedCategory: "",
        },
        this.filterOrdersByCategory("")
      );
    }
  };

  filterOrdersByCategory = (category) => {
    let result1;
    let result2;
    if (category) {
      result1 = this.state.receivedOffers.filter(
        (classified) => classified.category_name === category
      );
      result2 = this.state.sentOffers.filter(
        (classified) => classified.category_name === category
      );
    } else {
      result1 = this.state.receivedOffers;
      result2 = this.state.sentOffers;
    }
    this.setState({
      filteredReceivedOffers: result1,
      filteredSentOffers: result2,
    });
  };

  updateOfferModal = (id) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.getDetails(id);
      this.setState({
        updateOffer: true,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  viewOfferModal = (id) => {
    const { receivedOffers } = this.state;
    let selectedOffer;
    receivedOffers.forEach((offer) => {
      if (offer.msg_id == id) selectedOffer = offer;
    });
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      // this.getDetails(id)
      this.setState({
        classifiedDetail: selectedOffer,
        viewOffer: true,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = (e) => {
    this.setState({
      visible: false,
      updateOffer: false,
      viewListing: false,
      sendMessage: false,
      viewOffer: false,
    });
  };

  handleCancelOffer = () => {
    this.setState({
      cancelOffer: true,
    });
  };

  handleCancelOfferCancel = () => {
    this.setState({
      cancelOffer: false,
    });
  };
  /**
   * @method getDetails
   * @description get classified details
   */
  getDetails = (classified_id) => {
    // let classified_id = this.props.match.params.classified_id
    const { isLoggedIn, loggedInDetail } = this.props;
    const { inspectionList, selectedInspectionId, editingInspection } =
      this.state;
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    // this.props.getClassfiedCategoryDetail(reqData, (res) => {
    //   this.props.disableLoading();
    //   if (res.status === 200) {
    //     this.setState({
    //       classifiedDetail: res.data.data
    //     });
    //   }
    // });
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({
          classifiedDetail: res.data.data,
          allData: res.data,
        });
      }
    });
  };

  onViewListing = (id, catId, type) => {
    this.setState({
      viewListing: true,
      classified_id: id,
      categoryId: catId,
      viewListingType: type,
    });
  };

  /**
   * @method contactModal
   * @description contact model
   */
  contactModal = (data, type) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      if (type == "sent") this.getDetails(data);
      else if (type == "received")
        this.setState({
          classifiedDetail: data,
        });
      else if (type == "inspection") this.getDetails(data.id);
      this.setState({
        sendMessage: true,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  onSendMessage = () => {};

  onSearch = (e) => {
    this.setState(
      {
        search_keyword: e.target.value,
      },
      () => {
        this.getOffers("receiver");
        this.getOffers("sender");
        this.getJobApplicationList();
        this.getInspections();
      }
    );
  };

  /**
   * @method delete classified
   * @description delete classified
   */
  onWithdraw = (id) => {
    // const { filter, search_key } = this.state;
    // const { loggedInUser } = this.props;
    // let reqdata = {
    //   classified_id: id,
    //   user_id: loggedInUser.id,
    // };
    // this.props.deleteJobApplicationAPI(reqdata, (res) => {
    //   if (res.status === 200) {
    //     this.getJobApplicationList();
    //     toastr.success(langs.success, res.data.message);
    //   }
    // });
    this.setState({
      isWithdraw: true,
      withdrawId: id,
    });
  };

  /**
   * @method getResume
   * @description get resume
   */
  getApplicantResume = (row) => {
    this.props.getResumeDetail({ applicant_id: row.job_id }, (res) => {
      this.setState({ downloadedFile: res.job_detail.resume_file });
    });
  };

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  getQuestions = (classified_id) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    // let classified_id = this.props.parameters?.classified_id ?? this.props.match.params.classified_id;
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getJobQuestions(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200 && res.data.result) {
        let questions = Array.isArray(
          res.data.result.classified_hasmany_questions
        )
          ? res.data.result.classified_hasmany_questions
          : [];
        let ans = [];
        Array.isArray(questions) &&
          questions.map((el) => {
            if (el.ans_type !== "checkbox") {
              ans.push({
                qus_id: el.id,
                ans_value: "",
              });
            }
          });
        this.setState({ questions, answer: ans, isAnswerModal: true });
      } else {
        this.setState({ questions: [], answer: [], isAnswerModal: true });
      }
    });
  };

  cancelMyInspection = () => {
    this.setState({
      isCancelInspection: true,
      isUpdateInspection: false,
    });
  };

  updateMyInspection = () => {
    this.setState({
      isUpdateSuccess: true,
      isUpdateInspection: false,
    });
  };

  onEditInspection = (classifiedId, inspectionId, inspection) => {
    // this.setState({
    //   isUpdateInspection: true,
    //   selectedInspectionId: inspectionId,
    //   editingInspection: inspection
    // }, () => {

    const { loggedInUser, userDetails } = this.props;
    // let catId = this.props.match.params.adId;
    let reqData = {
      id: classifiedId,
      user_id: loggedInUser.id,
    };
    this.props.getPostAdDetail(reqData, (res) => {
      this.props.disableLoading();

      if (res.status === 200) {
        let data = res.data.data;

        let selInspection = null;
        data.inspection_times.forEach((v) => {
          let targetDate = moment(
            `${v.inspection_date} ${v.inspection_start_time}`
          ).format("YYYY-MM-DD hh:mm:ss");
          let compareDate = moment(inspection.inspection_date_time).format(
            "YYYY-MM-DD hh:mm:ss"
          );
          if (targetDate == compareDate) {
            selInspection = v;
          }
        });
        let inspectionTime = data.inspection_times;
        this.getDetails(classifiedId);

        this.setState({
          isUpdateInspection: true,
          selectedInspectionId: inspectionId,
          selectedInspection: selInspection,
          editingInspection: inspection,
          inspectionTime,
        });
      }
    });

    // })
  };

  // pdfOpen = () => {

  //   <div className="modal">
  //                          <object data="http://africau.edu/images/default/sample.pdf" type="application/pdf" width="100%" height="100%">
  //     <p>Alternative text - include a link <a href="http://africau.edu/images/default/sample.pdf">to the PDF!</a></p>
  // </object>
  //                     </div>
    
  // } 

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      filteredReceivedOffers,
      filteredSentOffers,
      receiveModal,
      orderDetail,
      updateOffer,
      classifiedDetail,
      viewListing,
      classified_id,
      categoryId,
      sendMessage,
      viewOffer,
      cancelOffer,
      search_keyword,
      JobListing,
      viewListingType,
      inspectionList,
      isOpenResumeModel,
      basicInfo,
      experience,
      education,
      skills,
      addFiles,
      isAnswerModal,
      questions,
      answer,
      isUpdateInspection,
      isCancelInspection,
      isUpdateSuccess,
      isWithdraw,
      isWithdrawSuccess,
      withdrawId,
      inspectionTime,
      selectedInspection,
      selectedInspectionId,
      isOpenResume,
    } = this.state;
    const { loggedInDetail } = this.props;
    const { TabPane } = Tabs;
    const allStatus = [
      "deactive",
      "active",
      "unapproved",
      "rejected",
      "incomplete",
    ];

    const columnsOfferTabs = [
      {
        title: "Item",
        dataIndex: "name",
        render: (cell, row, index) => {
          let image = row.image ? `${BASE_URL}${row.image}` : "";
          let sub_category_name = row.subcategory_name
            ? ` | ${row.subcategory_name}`
            : null;
          return (
            <>
              <div className="user-icon mr-13 d-flex userdetail-itemtable">
                <Avatar
                  src={
                    image && image !== undefined ? image : DEFAULT_IMAGE_TYPE
                  }
                />
                <div className="row-title-box">
                  <div>{row.title}</div>
                  <div className="pt-10 blue-text">
                    {row.category_name} ${sub_category_name}
                  </div>
                </div>
              </div>
            </>
          );
        },
      },
      {
        title: "Expire date",
        dataIndex: "expire_date",
        render: (cell, row, index) => {
          let expDate = "";
          if (row.is_premium && row.premium_expiry_date) {
            expDate = moment(row.premium_expiry_date).format("YYYY-MM-DD");
          } else if (row.featured_classified && row.featured_expiry_date) {
            expDate = moment(row.featured_expiry_date).format("YYYY-MM-DD");
          } else {
            expDate = moment(row.end_date).format("YYYY-MM-DD");
          }
          let note = "";
          const diff = moment(expDate, "YYYY-MM-DD").diff(
            moment().format("YYYY-MM-DD"),
            "days"
          );
          if (diff > 0) note = `${diff + 1} days left`;
          if (diff < 0) note = `Expired`;
          if (diff == 0) note = `Last day`;
          return (
            <>
              <span>{expDate}</span>
              <br></br>
              <span
                style={{
                  display: "inline-block",
                  color: diff < 3 && diff > -1 ? "red" : "#90a8be",
                }}
              >
                {note}
              </span>
            </>
          );
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        render: (cell, row, index) => {
          return <span>{row.classified_user_detail.name}</span>;
        },
      },
      {
        title: "Advertising Amount",
        dataIndex: "adv_amount",
        render: (cell, row, index) => {
          return <span>AU${row.advertising_amount}</span>;
        },
      },
      {
        title: "Offer Amount",
        className: "offeramount",
        dataIndex: "offer_amount",
        render: (cell, row, index) => {
          return (
            <span>
              <strong style={{ color: "#363B40" }}>
                AU${row.offered_amount}
              </strong>
            </span>
          );
        },
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (cell, row, index) => {
          let btnClass = "";
          let expDate = "";
          if (row.is_premium && row.premium_expiry_date) {
            expDate = moment(row.premium_expiry_date).format("YYYY-MM-DD");
          } else if (row.featured_classified && row.featured_expiry_date) {
            expDate = moment(row.featured_expiry_date).format("YYYY-MM-DD");
          } else {
            expDate = moment(row.end_date).format("YYYY-MM-DD");
          }
          const diff = moment(expDate, "YYYY-MM-DD").diff(
            moment().format("YYYY-MM-DD"),
            "days"
          );
          if (row.msgSender == loggedInDetail.id) {
            return (
              <Button
                type="primary"
                // disabled={diff < 0 ? true : false}
                className={btnClass}
                style={{
                  backgroundColor: "#7EC5F7",
                  borderColor: "#7EC5F7",
                }}
                onClick={() => this.updateOfferModal(row.msg_id)}
              >
                Update Offer
              </Button>
            );
          } else {
            return (
              
                row.msg_status === "Accepted" ? <button className="accept-offer">Accept offer</button> : row.msg_status === "Cancelled" ? <button className="declined">Declined</button> :(
              <Button
                type="primary"
                className={btnClass}
                // disabled={diff < 0 ? true : false}
                style={{
                  backgroundColor: "#7EC5F7",
                  borderColor: "#7EC5F7",
                }}
                onClick={() => this.viewOfferModal(row.msg_id)}
              >
                View Offer
              </Button>)
            );
          }
        },
      },
      {
        title: "",
        render: (cell, row, index) => {
          const menuicon = (
            <Menu>
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={
                      row.msgSender == loggedInDetail.id
                        ? () => {
                            this.onViewListing(
                              row.msg_id,
                              row.category_id,
                              "offer"
                            );
                          }
                        : () => {
                            this.onViewListing(
                              row.classified_id,
                              row.category_id,
                              "offer"
                            );
                          }
                    }
                  >
                    <span className="edit-images">
                      {" "}
                      <img src={require("./icons/view.svg")} />
                    </span>{" "}
                    <span>View Listing</span>
                  </a>
                </div>
              </Menu.Item>
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={
                      row.msgSender == loggedInDetail.id
                        ? () => {
                            this.contactModal(row.msg_id, "sent");
                          }
                        : () => {
                            this.contactModal(row, "received");
                          }
                    }
                  >
                    <span className="edit-images">
                      <img src={require("./icons/email.svg")} />{" "}
                    </span>{" "}
                    <span>Send Message</span>
                  </a>
                </div>
              </Menu.Item>
            </Menu>
          );

          return (
            <div className="edit-dropdown">
              <Row className="user-retail" style={{ float: "right" }}>
                <div className="edit-delete-dot">
                  <Dropdown
                    overlay={menuicon}
                    trigger={["click"]}
                    overlayClassName="show-phone-number  retail-dashboard"
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
              </Row>
            </div>
          );
        },
      },
    ];

    const columnsInspectionTab = [
      {
        title: "Item",
        className: "item-ins",
        dataIndex: "name",
        render: (cell, row, index) => {
          let image = row.image
            ? `http://devformee.mangoitsol.com/formee${row.image}`
            : "";
          let sub_category_name = row.subcategory_name
            ? ` | ${row.subcategory_name}`
            : null;
          return (
            <>
              <div className="user-icon mr-13 d-flex userdetail-itemtable">
                <Avatar
                  src={
                    image && image !== undefined ? image : DEFAULT_IMAGE_TYPE
                  }
                />
                <div>
                  <div>{row.title}</div>
                  <div className="pt-10 blue-text">
                    {row.category_name} ${sub_category_name}
                  </div>
                </div>
              </div>
            </>
          );
        },
      },
      {
        title: "Inspection Time",
        className: "action-time",
        dataIndex: "created_at",
        key: "created_at",
        render: (cell, row, index) => {
          return (
            <span className="ins-date">
              {String(moment(row.created_at).format("ddd DD MMM hh:mm A"))}
            </span>
          );
        },
      },
      {
        title: "Action",
        className: "action-ins",
        dataIndex: "status",
        render: (cell, row, index) => {
          return (
            <button
              className={JOB_APPLICATION_STATUS[row.status]}
              onClick={
                row.status == 2
                  ? () => {
                      this.setState({
                        classifiedDetail: row,
                        isUpdateInspection: true,
                      });
                    }
                  : () => {}
              }
            >
              {/* <Badge status="default" /> */}
              <span>{JOB_APPLICATION_STATUS[row.status]}</span>
            </button>
          );
        },
      },
      {
        title: "",
        render: (cell, row, index) => {
          const menuicon = (
            <Menu>
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      this.onEditInspection(row.id, row.inspection_id, row)
                    }
                  >
                    <span className="edit-images">
                      {" "}
                      <img src={require("./icons/view.svg")} />
                    </span>{" "}
                    <span>Edit Details</span>
                  </a>
                </div>
              </Menu.Item>
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      this.onViewListing(row.id, row.category_id, "inspection")
                    }
                  >
                    <span className="edit-images">
                      {" "}
                      <img src={require("./icons/view.svg")} />
                    </span>{" "}
                    <span>View Listing</span>
                  </a>
                </div>
              </Menu.Item>
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      this.contactModal(row, "inspection");
                    }}
                  >
                    <span className="edit-images">
                      <img src={require("./icons/email.svg")} />{" "}
                    </span>{" "}
                    <span>Send Message</span>
                  </a>
                </div>
              </Menu.Item>
            </Menu>
          );

          return (
            <div className="edit-dropdown">
              <Row className="user-retail" style={{ float: "right" }}>
                <div className="edit-delete-dot">
                  <Dropdown
                    overlay={menuicon}
                    trigger={["click"]}
                    overlayClassName="show-phone-number  retail-dashboard"
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
              </Row>
            </div>
          );
        },
      },
    ];

    const columnsJobApplicationTab = [
      {
        title: "Item",
        dataIndex: "name",
        render: (cell, row, index) => {
          let image = row.imageurl;
          let sub_category_name = row.sub_catname
            ? ` | ${row.sub_catname}`
            : null;
          return (
            <>
              <div className="user-icon mr-13 d-flex userdetail-itemtable">
                <Avatar
                  src={
                    image && image !== undefined ? image : DEFAULT_IMAGE_TYPE
                  }
                />
                <div>
                  <div>{row.title}</div>
                  <div className="pt-10 blue-text" style={{ color: "#7EC5F7" }}>
                    {row.catname} ${sub_category_name}
                  </div>
                </div>
              </div>
            </>
          );
        },
      },
      {
        title: "Date Applied",
        dataIndex: "date_applied",
        render: (cell, row, index) => {
          return (
            <span>{String(moment(row.date_applied).format("ddd DD MMM"))}</span>
          );
        },
      },
      {
        title: "Docs",
        dataIndex: "documents",

        render: (cell, row, index) => {
          console.log(row,"job list",JobListing,"list")
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textDecoration: "underline",
              }}
            >
              <Link
                style={{ textAlign: "left" }}
                // to="#"
                onClick={() => {
                  if (this.props.resumeDetails) {
                    this.setState({ isOpenResumeModel: true });
                  } else {
                   
                     this.setState({ isOpenResume: true, resumeFile: row.resume_file})
                  }
                }}
              >
                <span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_15020:199520)">
                      <path
                        d="M11.6634 3.3751L8.3999 0.111566C8.32848 0.0401426 8.23161 0 8.13061 0H2.62338C1.85102 0 1.22266 0.628367 1.22266 1.40072V11.5993C1.22266 12.3716 1.85102 13 2.62336 13H10.3743C11.1466 13 11.775 12.3716 11.775 11.5993V3.64439C11.775 3.54339 11.7349 3.44652 11.6634 3.3751ZM8.51147 1.30033L10.4747 3.26353H9.15045C8.79813 3.26353 8.51147 2.97687 8.51147 2.62455V1.30033ZM10.3743 12.2383H2.62336C2.27104 12.2383 1.98437 11.9516 1.98437 11.5993V1.40072C1.98437 1.04838 2.27104 0.761719 2.62336 0.761719H7.74972V2.62455C7.74972 3.39688 8.37809 4.02525 9.15042 4.02525H11.0133V11.5993C11.0133 11.9516 10.7266 12.2383 10.3743 12.2383Z"
                        fill="#90A8BE"
                      />
                      <path
                        d="M9.76339 10.6055H3.23633C3.02599 10.6055 2.85547 10.776 2.85547 10.9863C2.85547 11.1967 3.02599 11.3672 3.23633 11.3672H9.76339C9.97373 11.3672 10.1443 11.1967 10.1443 10.9863C10.1443 10.776 9.97373 10.6055 9.76339 10.6055Z"
                        fill="#90A8BE"
                      />
                      <path
                        d="M9.76339 8.97461H3.23633C3.02599 8.97461 2.85547 9.14513 2.85547 9.35547C2.85547 9.56581 3.02599 9.73633 3.23633 9.73633H9.76339C9.97373 9.73633 10.1443 9.56581 10.1443 9.35547C10.1443 9.14513 9.97373 8.97461 9.76339 8.97461Z"
                        fill="#90A8BE"
                      />
                      <path
                        d="M9.76339 7.3418H3.23633C3.02599 7.3418 2.85547 7.51232 2.85547 7.72266C2.85547 7.93299 3.02599 8.10352 3.23633 8.10352H9.76339C9.97373 8.10352 10.1443 7.93299 10.1443 7.72266C10.1443 7.51232 9.97373 7.3418 9.76339 7.3418Z"
                        fill="#90A8BE"
                      />
                      <path
                        d="M3.23633 6.47266H8.13164C8.34197 6.47266 8.5125 6.30213 8.5125 6.0918C8.5125 5.88146 8.34197 5.71094 8.13164 5.71094H3.23633C3.02599 5.71094 2.85547 5.88146 2.85547 6.0918C2.85547 6.30213 3.02599 6.47266 3.23633 6.47266Z"
                        fill="#90A8BE"
                      />
                      <path
                        d="M3.23633 4.84021H5.68396C5.89429 4.84021 6.06482 4.66969 6.06482 4.45935V2.01172C6.06482 1.80138 5.89429 1.63086 5.68396 1.63086H3.23633C3.02599 1.63086 2.85547 1.80138 2.85547 2.01172V4.45935C2.85547 4.66969 3.02599 4.84021 3.23633 4.84021ZM3.61719 2.39258H5.3031V4.07849H3.61719V2.39258Z"
                        fill="#90A8BE"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_15020:199520">
                        <rect width="13" height="13" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span >Resume</span>
              </Link>
              <Link
                style={{ textAlign: "left" }}
                to="#"
                onClick={() => {
                  if (this.props.coverLetter) {
                    this.setState({ isOpenResumeModel: true });
                  } else {
                   
                     this.setState({ isOpenResume: true, resumeFile: row.coverletter_file})
                  }
                }}
              >
                <span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_15020:199529)">
                      <path
                        d="M6.93045 9.08846L3.91035 9.08984C3.91035 9.08984 3.91026 9.08984 3.91016 9.08984C3.62977 9.08984 3.40244 8.86272 3.40234 8.58233C3.40215 8.30184 3.62947 8.07432 3.90986 8.07422L6.92995 8.07283H6.93015C7.21054 8.07283 7.43787 8.29996 7.43797 8.58035C7.43816 8.86083 7.21094 9.08826 6.93045 9.08846ZM6.24441 9.92635L3.90986 9.92773C3.62937 9.92793 3.40215 10.1555 3.40234 10.4358C3.40254 10.7162 3.62987 10.9434 3.91016 10.9434H3.91045L6.245 10.942C6.52549 10.9418 6.75272 10.7142 6.75252 10.4339C6.75232 10.1535 6.52499 9.92635 6.24471 9.92635C6.24461 9.92635 6.24451 9.92635 6.24441 9.92635ZM11.5288 9.83192L8.50814 12.8498C8.50804 12.8498 8.50804 12.8498 8.50804 12.8499L8.50784 12.85C8.50725 12.8507 8.50645 12.8513 8.50576 12.852C8.49465 12.8629 8.48315 12.8734 8.47115 12.8833C8.46807 12.8858 8.4648 12.8879 8.46162 12.8904C8.45171 12.8981 8.44169 12.9059 8.43118 12.9129C8.4284 12.9148 8.42542 12.9163 8.42255 12.9182C8.41144 12.9253 8.40023 12.9323 8.38853 12.9385C8.38654 12.9395 8.38456 12.9404 8.38268 12.9414C8.36988 12.9479 8.35689 12.9543 8.3435 12.9598C8.34241 12.9603 8.34132 12.9606 8.34023 12.961C8.32604 12.9668 8.31166 12.972 8.29688 12.9766C8.29569 12.9769 8.2945 12.9771 8.29341 12.9775C8.27873 12.9818 8.26395 12.9856 8.24888 12.9886C8.24551 12.9893 8.24203 12.9896 8.23856 12.9902C8.22577 12.9925 8.21288 12.9946 8.19968 12.996C8.18292 12.9977 8.16606 12.9986 8.1491 12.9986L3.40254 13C2.28228 13 1.37109 12.0888 1.37109 10.9688V2.03125C1.37109 0.911186 2.28228 0 3.40234 0H9.64566C10.7656 0 11.6769 0.911186 11.6769 2.03125L11.6775 6.93154C11.6775 7.21203 11.4502 7.43945 11.1697 7.43945C10.8892 7.43945 10.6619 7.21213 10.6619 6.93174L10.6613 2.03135C10.6613 1.47127 10.2056 1.01562 9.64566 1.01562H3.40234C2.84236 1.01562 2.38672 1.47127 2.38672 2.03125V10.9688C2.38672 11.5287 2.84236 11.9844 3.40234 11.9844L7.64119 11.9831V10.7416C7.64119 9.7616 8.43851 8.96428 9.41853 8.96428H11.1702C11.187 8.96428 11.2039 8.96517 11.2208 8.96686C11.228 8.96755 11.235 8.96894 11.2421 8.96993C11.2513 8.97122 11.2605 8.97231 11.2698 8.9742C11.2784 8.97588 11.2867 8.97826 11.2953 8.98045C11.3028 8.98233 11.3104 8.98392 11.3179 8.9863C11.3264 8.98888 11.3346 8.99205 11.343 8.99503C11.3502 8.9976 11.3575 8.99998 11.3647 9.00296C11.3727 9.00633 11.3805 9.0102 11.3882 9.01397C11.3954 9.01734 11.4027 9.02052 11.4096 9.02419C11.4174 9.02845 11.4249 9.03321 11.4325 9.03777C11.4391 9.04174 11.4457 9.04541 11.4522 9.04977C11.4612 9.05573 11.4698 9.06247 11.4784 9.06902C11.4829 9.07249 11.4877 9.07556 11.492 9.07923C11.5182 9.10065 11.5422 9.12466 11.5636 9.15084C11.5669 9.15491 11.5698 9.15927 11.5731 9.16344C11.5799 9.17246 11.5869 9.18139 11.5931 9.19081C11.597 9.19656 11.6002 9.20261 11.6039 9.20856C11.609 9.2168 11.614 9.22493 11.6187 9.23346C11.622 9.23971 11.6247 9.24606 11.6277 9.2523C11.6319 9.26103 11.6361 9.26966 11.6399 9.27859C11.6424 9.28464 11.6444 9.29079 11.6466 9.29684C11.6501 9.30636 11.6537 9.31578 11.6566 9.3255C11.6584 9.33135 11.6597 9.3373 11.6611 9.34315C11.6638 9.35337 11.6666 9.36339 11.6686 9.3737C11.6698 9.37995 11.6705 9.3863 11.6715 9.39255C11.673 9.40257 11.6748 9.41258 11.6758 9.4228C11.6767 9.43172 11.6768 9.44055 11.6772 9.44948C11.6775 9.45702 11.6783 9.46445 11.6783 9.47219C11.6783 9.47963 11.6775 9.48687 11.6772 9.49421C11.6768 9.50333 11.6767 9.51256 11.6758 9.52168C11.6748 9.5321 11.6729 9.54221 11.6714 9.55243C11.6704 9.55858 11.6698 9.56473 11.6686 9.57078C11.6665 9.58129 11.6637 9.59141 11.661 9.60162C11.6595 9.60738 11.6583 9.61323 11.6566 9.61898C11.6536 9.6288 11.6499 9.63832 11.6465 9.64784C11.6443 9.65389 11.6423 9.65994 11.6398 9.66599C11.6361 9.67492 11.6318 9.68355 11.6276 9.69228C11.6246 9.69852 11.6219 9.70487 11.6186 9.71102C11.614 9.71965 11.6089 9.72778 11.6038 9.73602C11.6002 9.74197 11.5969 9.74792 11.5931 9.75377C11.5867 9.76339 11.5795 9.77251 11.5725 9.78164C11.5694 9.78561 11.5667 9.78977 11.5635 9.79374C11.5525 9.80693 11.5409 9.81973 11.5288 9.83192ZM8.65681 10.7416V11.2656L9.9436 9.9799H9.41853C8.9985 9.9799 8.65681 10.3217 8.65681 10.7416ZM8.12024 7.10938H4.87976C4.62536 7.10938 4.38742 6.99621 4.22684 6.79884C4.06548 6.60057 4.00289 6.34319 4.05496 6.09256C4.19907 5.39858 4.63071 4.82025 5.20825 4.47133C5.01495 4.20691 4.90039 3.88129 4.90039 3.5293C4.90039 2.64727 5.61797 1.92969 6.5 1.92969C7.38203 1.92969 8.09961 2.64727 8.09961 3.5293C8.09961 3.88129 7.98505 4.20691 7.79165 4.47133C8.36929 4.82025 8.80083 5.39858 8.94504 6.09256C8.99711 6.34319 8.93443 6.60057 8.77316 6.79884C8.61258 6.99621 8.37464 7.10938 8.12024 7.10938ZM5.91602 3.5293C5.91602 3.85134 6.17796 4.11328 6.5 4.11328C6.82204 4.11328 7.08398 3.85134 7.08398 3.5293C7.08398 3.20725 6.82204 2.94531 6.5 2.94531C6.17796 2.94531 5.91602 3.20725 5.91602 3.5293ZM7.89202 6.09375C7.68295 5.52395 7.13328 5.12891 6.51329 5.12891H6.48671C5.86672 5.12891 5.31705 5.52395 5.10798 6.09375H7.89202Z"
                        fill="#90A8BE"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_15020:199529">
                        <rect width="13" height="13" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span>Cover Letter</span>
              </Link>
              <Link
                style={{ textAlign: "left" }}
                to="#"
                onClick={() => this.getQuestions(row.classifiedid)}
              >
                <span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.92188 8.46289H5.74219V9.2832H4.92188V8.46289Z"
                      fill="#90A8BE"
                    />
                    <path
                      d="M5.33203 5.5918C5.55819 5.5918 5.74219 5.77579 5.74219 6.00195C5.74219 6.23249 5.65327 6.33115 5.45218 6.53223C5.22837 6.75604 4.92188 7.06254 4.92188 7.64258H5.74219C5.74219 7.41204 5.83111 7.31339 6.0322 7.1123C6.256 6.88849 6.5625 6.582 6.5625 6.00195C6.5625 5.32347 6.01051 4.77148 5.33203 4.77148C4.65355 4.77148 4.10156 5.32347 4.10156 6.00195H4.92188C4.92188 5.77579 5.10587 5.5918 5.33203 5.5918Z"
                      fill="#90A8BE"
                    />
                    <path
                      d="M3.28125 0.259766V2.7207H0V11.7441H0.820312V13.741L3.8156 11.7441H10.6641V9.63944L13.125 11.2801V9.2832H14V0.259766H3.28125ZM9.84375 10.9238H3.56721L1.64062 12.2082V10.9238H0.820312V3.54102H9.84375V10.9238ZM13.1797 8.46289H12.3047V9.74728L10.6641 8.65353V2.7207H4.10156V1.08008H13.1797V8.46289Z"
                      fill="#90A8BE"
                    />
                  </svg>
                </span>
                <span>View Questions</span>
              </Link>
            </div>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "order_status",
        render: (cell, row, index) => {
          return (
            <button className={JOB_APPLICATION_STATUS[row.status]}>
              {/* <Badge status="default" /> */}
              <span>{JOB_APPLICATION_STATUS[row.status]}</span>
            </button>
          );
        },
      },
      {
        title: "",
        render: (cell, row, index) => {
          const menuicon = (
            <Menu>
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      this.onViewListing(row.id, row.category_id, "job")
                    }
                  >
                    <span className="edit-images">
                      {" "}
                      <img src={require("./icons/view.svg")} />
                    </span>{" "}
                    <span>View Listing</span>
                  </a>
                </div>
              </Menu.Item>
              {/* {row.status && ( */}
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      this.onWithdraw(row.job_id);
                    }}
                  >
                    <span className="edit-images">
                      <img
                        src={require("../../../assets/images/icons/delete.svg")}
                      />{" "}
                    </span>{" "}
                    <span>Withdraw</span>
                  </a>
                </div>
              </Menu.Item>
              {/* )} */}
            </Menu>
          );

          return (
            <div className="edit-dropdown">
              <Row className="user-retail" style={{ float: "right" }}>
                <div className="edit-delete-dot">
                  <Dropdown
                    overlay={menuicon}
                    trigger={["click"]}
                    overlayClassName="show-phone-number  retail-dashboard"
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
              </Row>
            </div>
          );
        },
      },
    ];

    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  {/* <div className="left">
                    <Title level={2}>Retail</Title>
                  </div> */}
                  <div className="right">
                    <div className="right-content">
                      <div className="tabs-button">
                        <Button
                          onClick={() => {
                            this.props.history.push("/dashboard");
                          }}
                          className="tabview-btn dashboard-btn"
                        >
                          My Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/retail-orders");
                          }}
                          className="tabview-btn retail-btn"
                        >
                          Retail
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/dashboard-classified");
                          }}
                          className="tabview-btn classifield-btn active"
                        >
                          Classifieds
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/my-bookings");
                          }}
                          className="tabview-btn booking-btn"
                        >
                          Booking
                        </Button>
                        {/* <Button
                          onClick={() => {
                            this.props.history.push("/food-scanner");
                          }}
                          className="tabview-btn food-scanner"
                        >
                          Food Scanner
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search Dashboard"
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                            value={search_keyword}
                            onChange={this.onSearch}
                          />
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        md={8}
                        lg={8}
                        xl={10}
                        className="employer-right-block "
                      ></Col>
                    </Row>
                  </div>
                </div>

                <div className="profile-content-box classifi-normal-user">
                  <Card bordered={false} className="add-content-box">
                    <div className="card-header-select">
                      {/* <label>Show:</label> */}
                      <Select
                        defaultValue="All Categories"
                        onChange={this.onSelectCategory}
                      >
                        <Option value="">All Categories</Option>
                        {this.renderCategories()}
                      </Select>
                    </div>
                    <Tabs defaultActiveKey="1" type="card">
                      <TabPane tab={`Received Offers`} key="1">
                        <div className="show-total-records">
                          You have {filteredReceivedOffers.length} items
                        </div>
                        <Table
                          className="retail-table"
                          dataSource={filteredReceivedOffers}
                          columns={columnsOfferTabs}
                        ></Table>
                      </TabPane>
                      <TabPane tab={`Sent Offers`} key="2">
                        <div className="show-total-records">
                          You have {filteredSentOffers.length} items
                        </div>
                        <Table
                          dataSource={filteredSentOffers}
                          columns={columnsOfferTabs}
                        />
                      </TabPane>
                      <TabPane tab={`Inspections`} key="3">
                        <div className="show-total-records">
                          You have {inspectionList.length} items
                        </div>
                        <Table
                          dataSource={inspectionList}
                          columns={columnsInspectionTab}
                        />
                      </TabPane>
                      <TabPane
                        tab={`Job Applications`}
                        key="4"
                        className="job-application"
                      >
                        <div className="show-total-records">
                          You have {JobListing.length} items
                        </div>
                        <Table
                          dataSource={JobListing}
                          columns={columnsJobApplicationTab}
                        />
                      </TabPane>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>

        {receiveModal && orderDetail && (
          <ReceivedModal
            visible={receiveModal}
            orderDetail={orderDetail}
            onCancel={() => this.setState({ receiveModal: false })}
            userRetail={true}
          />
        )}
        {viewListing && (
          <ViewListingModal
            visible={viewListing}
            onCancel={this.handleCancel}
            classified_id={classified_id}
            categoryId={categoryId}
            type={viewListingType}
          />
        )}
        {updateOffer && (
          <UpdateOffer
            visible={updateOffer}
            onCancel={this.handleCancel}
            onCancelOffer={this.handleCancelOffer}
            onUpdateSuccessful={() => this.getOffers("sender")}
            classifiedDetail={classifiedDetail && classifiedDetail}
            receiverId={
              classifiedDetail.classified_user_detail
                ? classifiedDetail.classified_user_detail.id
                : ""
            }
            classifiedid={classifiedDetail && classifiedDetail.msg_id}
            onFinish={() => this.setState({ isOfferUpdated: true })}
            userDetails={loggedInDetail}
          />
        )}

        {cancelOffer && (
          <ConfirmCancelOfferModal
            visible={cancelOffer}
            onCancel={this.handleCancelOfferCancel}
            onCancelSuccessful={() => this.getOffers("sender")}
            classifiedDetail={classifiedDetail && classifiedDetail}
            receiverId={
              classifiedDetail.classified_user_detail
                ? classifiedDetail.classified_user_detail.id
                : ""
            }
            classifiedid={classifiedDetail && classifiedDetail.msg_id}
            userId={loggedInDetail.id}
          />
        )}

        {this.state.resumeFile && (
              <PDFResumeModal
                visible={isOpenResume}
                onClose={() => {
                  this.setState({ isOpenResume: false });
                }}
                isViewResume={true}
                enquiryDetails={this.state.resumeFile}
                // booking_type="spa"
              />
            )}

        {viewOffer && (
          <ViewOffer
            visible={viewOffer}
            onCancel={() => {
              this.getOffers("receiver");
              this.getOffers("sender");
              this.setState({
                viewOffer: false,
              });
            }}
            classifiedDetail={classifiedDetail && classifiedDetail}
            receiverId={
              classifiedDetail.classified_user_detail
                ? classifiedDetail.classified_user_detail.id
                : ""
            }
            classifiedid={classifiedDetail && classifiedDetail.msg_id}
            // onFinish={() => this.setState({ isOfferUpdated: true })}
          />
        )}
        {sendMessage && (
          <SendMessageModal
            visible={sendMessage}
            onCancel={this.handleCancel}
            classifiedDetail={classifiedDetail && classifiedDetail}
            receiverId={
              classifiedDetail.classified_users
                ? classifiedDetail.classified_users.id
                : classifiedDetail.sender_id
            }
            classifiedid={
              classifiedDetail.id
                ? classifiedDetail.id
                : classifiedDetail.classified_id
            }
          />
        )}

        {isOpenResumeModel && (
          <Resume
            visible={isOpenResumeModel}
            basicInfo={basicInfo}
            experience={experience}
            education={education}
            skills={skills}
            addFiles={addFiles && addFiles}
            onCancel={() => {
              this.setState({ isOpenResumeModel: false });
            }}
          />
        )}
        {isAnswerModal && (
          <ViewQuestionsModal
            visible={isAnswerModal}
            onJobCancel={this.handleJobModalCancel}
            questions={questions}
            answer={answer}
            onCancel={() => this.setState({ isAnswerModal: false })}
          />
        )}

        {isUpdateInspection && inspectionTime && (
          <UpdateInspectionModal
            visible={isUpdateInspection}
            onCancel={() => {
              this.setState({
                isUpdateInspection: false,
              });
            }}
            cancelMyInspection={this.cancelMyInspection}
            updateMyInspection={this.updateMyInspection}
            contactType={"realstate"}
            classifiedDetail={classifiedDetail && classifiedDetail}
            receiverId={classifiedDetail.created_by}
            classifiedid={classifiedDetail && classifiedDetail.id}
            inspectionTime={inspectionTime ? inspectionTime : []}
            // callNext={this.getDetails}
            selectedInspection={selectedInspection}
            selectedInspectionId={selectedInspectionId}
          />
        )}
        {isUpdateSuccess && (
          <Modal
            title={<ExclamationOutlined />}
            visible={isUpdateSuccess}
            className={"custom-modal style1 custom-modal-contactmodal-style"}
            footer={false}
            onCancel={() => {
              this.setState({
                isUpdateSuccess: false,
              });
            }}
          >
            <div>
              <div className="success-message">
                Your inspection time is updated.
              </div>
              <div className="action-buttons">
                <button
                  onClick={() => {
                    // need to rollback update action
                    this.setState({
                      isUpdateSuccess: false,
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      isUpdateSuccess: false,
                    });
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </Modal>
        )}
        {isCancelInspection && (
          <ConfirmModal
            title=""
            visible={isCancelInspection}
            onCancel={() => {
              this.setState({
                isCancelInspection: false,
              });
            }}
            headerIcon={() => {
              return (
                <div class="icon-exp">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.875 23.375C17.875 24.1344 17.2594 24.75 16.5 24.75C15.7406 24.75 15.125 24.1344 15.125 23.375C15.125 22.6156 15.7406 22 16.5 22C17.2594 22 17.875 22.6156 17.875 23.375Z"
                      fill="#90A8BE"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.5 8.25C17.2594 8.25 17.875 8.86561 17.875 9.625V17.875C17.875 18.6344 17.2594 19.25 16.5 19.25C15.7406 19.25 15.125 18.6344 15.125 17.875V9.625C15.125 8.86561 15.7406 8.25 16.5 8.25Z"
                      fill="#90A8BE"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.5 5.5C10.4249 5.5 5.5 10.4249 5.5 16.5C5.5 22.5751 10.4249 27.5 16.5 27.5C22.5751 27.5 27.5 22.5751 27.5 16.5C27.5 10.4249 22.5751 5.5 16.5 5.5ZM2.75 16.5C2.75 8.90609 8.90609 2.75 16.5 2.75C24.0939 2.75 30.25 8.90609 30.25 16.5C30.25 24.0939 24.0939 30.25 16.5 30.25C8.90609 30.25 2.75 24.0939 2.75 16.5Z"
                      fill="#90A8BE"
                    />
                  </svg>
                </div>
              );
            }}
            message="Are you sure you want to cancel your inspection?"
            warning=""
            cancelText="No, go back"
            onAction={() => {
              // need to implement api as well
              const { isLoggedIn, loggedInDetail } = this.props;
              const { classifiedDetail } = this.state;
              let reqData = {
                user_id: loggedInDetail.id,
                classified_id: classifiedDetail.id,
                inspection_id: classifiedDetail.inspection_id,
                name: loggedInDetail.name,
                email: loggedInDetail.email,
              };
              this.props.cancelBookedInspection(reqData, (res) => {
                this.props.disableLoading();
                if (res.status === 200) {
                  // this.setState({
                  //   classifiedDetail: res.data.data
                  // });
                }
              });
              this.setState({
                isCancelInspection: false,
              });
            }}
            actionText="Yes, cancel"
          />
        )}
        {isWithdraw && (
          <ConfirmModal
            className="withdraw-job"
            title=""
            visible={isWithdraw}
            onCancel={() => {
              this.setState({
                isWithdraw: false,
              });
            }}
            headerIcon={() => {
              return (
                <div class="icon-exp">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.875 23.375C17.875 24.1344 17.2594 24.75 16.5 24.75C15.7406 24.75 15.125 24.1344 15.125 23.375C15.125 22.6156 15.7406 22 16.5 22C17.2594 22 17.875 22.6156 17.875 23.375Z"
                      fill="#90A8BE"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.5 8.25C17.2594 8.25 17.875 8.86561 17.875 9.625V17.875C17.875 18.6344 17.2594 19.25 16.5 19.25C15.7406 19.25 15.125 18.6344 15.125 17.875V9.625C15.125 8.86561 15.7406 8.25 16.5 8.25Z"
                      fill="#90A8BE"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.5 5.5C10.4249 5.5 5.5 10.4249 5.5 16.5C5.5 22.5751 10.4249 27.5 16.5 27.5C22.5751 27.5 27.5 22.5751 27.5 16.5C27.5 10.4249 22.5751 5.5 16.5 5.5ZM2.75 16.5C2.75 8.90609 8.90609 2.75 16.5 2.75C24.0939 2.75 30.25 8.90609 30.25 16.5C30.25 24.0939 24.0939 30.25 16.5 30.25C8.90609 30.25 2.75 24.0939 2.75 16.5Z"
                      fill="#90A8BE"
                    />
                  </svg>
                </div>
              );
            }}
            className="withdraw"
            message="Withdraw your application"
            warning="This cannot be undone. Are you sure you want to withdraw your application?"
            cancelText="No, go back"
            onAction={() => {
              // need to implement api as well
              this.props.enableLoading();
              this.props.changeJobStatus(
                {
                  trader_job_id: withdrawId,
                  status: "Cancelled",
                  reason: "testing",
                },
                (res) => {
                  this.props.disableLoading();
                  if (res.status === STATUS_CODES.OK) {
                    toastr.success(
                      langs.success,
                      MESSAGES.CONFIRM_HANDYMAN_BOOKING
                    );
                    // this.handleCancel()
                    this.setState({
                      isWithdraw: false,
                      isWithdrawSuccess: true,
                    });
                  } else {
                    this.setState({
                      isWithdraw: false,
                      isWithdrawSuccess: false,
                    });
                  }
                }
              );
            }}
            actionText="Yes, withdraw"
          />
        )}

        {isWithdrawSuccess && (
          <Modal
            title={<ExclamationOutlined />}
            visible={isWithdrawSuccess}
            className={"custom-modal style1 custom-modal-contactmodal-style"}
            footer={false}
            onCancel={() => {
              this.setState({
                isWithdrawSuccess: false,
              });
            }}
          >
            <div>
              <div className="success-message">
                Your application has been withdrawn.
              </div>
              <div className="action-buttons">
                <button
                  onClick={() => {
                    this.setState({
                      isWithdrawSuccess: false,
                    });
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </Modal>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, classifieds, common } = store;

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    classifieds: classifieds,
    categories: common.categoryData.classified,
    resumeDetails:
      classifieds.resumeDetails !== null ? classifieds.resumeDetails : "",
  };
};
export default connect(mapStateToProps, {
  getClassfiedCategoryDetail,
  enableLoading,
  disableLoading,
  updateOrderStatusAPI,
  openLoginModel,
  getCustomerDashBoardDetailsClassifiedOffers,
  userJobApplicationListAPI,
  getUserInspectionList,
  getResume,
  getResumeDetail,
  getJobQuestions,
  deleteJobApplicationAPI,
  changeJobStatus,
  cancelBookedInspection,
  getPostAdDetail,
})(UserClassifiedsDashboard);
