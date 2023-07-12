import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Link } from "react-router-dom";
import {
  Col,
  Select,
  Spin,
  Layout,
  Card,
  Upload,
  message,
  Avatar,
  Row,
  Typography,
  Space,
  Divider,
  Checkbox,
  Progress,
  Button,
  Modal,
  Carousel,
  Image,
} from "antd";
import {
  LoadingOutlined,
  UserOutlined,
  CheckOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Icon from "../../customIcons/customIcons";
import { langs } from "../../../config/localization";
import {
  getUserProfile,
  enableLoading,
  viewBroucher,
  viewGallery,
  viewCertification,
  viewPortfolio,
  disableLoading,
  getRestaurantDetail,
  getTraderProfile,
  changeUserName,
  changeProfileImage,
  getFitnessTypes,
} from "../../../actions/index";
import AppSidebar from "../../dashboard-sidebar/DashboardSidebar";
import { DEFAULT_IMAGE_TYPE, BASE_URL } from "../../../config/Config";
import history from "../../../common/History";
import {
  dateFormate,
  converInUpperCase,
  convertHTMLToText,
  getDaysName,
  formateTime,
  getNextMonth,
} from "../../common";
import Preview from "./DetailPreview";
import PreviewRestaurant from "./restaurant/PreviewRestaurant";
import "./myprofilestep.less";
import moment from "moment";
import { Form, Input } from "antd";

import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  EmailShareButton,
  FacebookMessengerShareButton,
  LineShareButton,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  RedditIcon,
  TumblrIcon,
  LivejournalIcon,
  MailruIcon,
  ViberIcon,
  WorkplaceIcon,
  EmailIcon,
  FacebookMessengerIcon,
  LineIcon,
} from "react-share";

const { Title, Text, Paragraph } = Typography;

const spinIcon = (
  <img
    src={require("./../../../assets/images/loader1.gif")}
    alt=""
    style={{ width: "64px", height: "64px" }}
  />
);
var d = new Date();
var day = d.getDay();

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitFromOutside: false,
      submitBussinessForm: false,
      imageUrl: DEFAULT_IMAGE_TYPE,
      key: 1,
      visible: false,
      previewRestaurant: false,
      imagesList: [],
      showBrochure: false,
      showCertificate: false,
      showPortfolio: false,
      visibility: false,
      modalData: [],
      activeImg: 0,
      amenities: [],
      trade_hour: "",
    };
  }
  formRef = React.createRef();

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    const { id, user_type } = this.props.loggedInUser;
    const { userDetails, fitnessPlan } = this.props;
    console.log("fitness", fitnessPlan);
    this.props.viewPortfolio();
    this.props.viewCertification();
    this.props.viewBroucher();
    this.props.viewGallery();
    if (user_type === langs.key.restaurant) {
      this.getServiceDetail();
    } else {
      this.props.getTraderProfile({ user_id: id }, (res) => {
        console.log("IMF");
        this.setState({
          amenities: userDetails.user.trader_profile.fitness_amenities,
        });
        this.setState({
          trade_hour: userDetails.user.trader_profile.rate_per_hour,
        });
        this.props.disableLoading();
        this.setState({
          amenities: userDetails.user.trader_profile.fitness_amenities,
        });
        this.setState({
          imageUrl:
            userDetails && userDetails.image !== undefined
              ? userDetails.image
              : DEFAULT_IMAGE_TYPE,
        });
      });
    }
    // this.props.getFitnessTypes().then((row) => {
    //   console.log("Rwow", row);
    // });
    console.log("PLAN", this.props.fitnessPlan);
  }

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props;
    this.props.getRestaurantDetail(loggedInUser.id, "", (res) => {
      // this.props.getRestaurantDetail('902', res => {
      this.props.disableLoading();
      if (res.status === 200) {
        let data = res.data && res.data.data;

        this.setState({ restaurantDetail: data });
      }
    });
  };

  /**
   * @method onTabChange
   * @description handle ontabchange
   */
  onTabChange = () => {
    const { key } = this.state;
    if (key === 1) {
      this.setState({ key: 2 });
    } else if (key === 2) {
      this.setState({ key: 1 });
    }
  };

  /**
   * @method submitCustomForm
   * @description handle custum form
   */
  submitCustomForm = () => {
    this.setState({
      submitFromOutside: true,
      submitBussinessForm: true,
    });
  };

  /**
   * @method beforeUpload
   * @descriptionhandle handle photo change
   */
  beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG & PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  /**
   * @method handleChange
   * @descriptionhandle handle photo change
   */
  handleChange = (info) => {
    const { id } = this.props.loggedInUser;
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    const isCorrectFormat =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    const isCorrectSize = info.file.size / 1024 / 1024 < 2;
    if (isCorrectSize && isCorrectFormat) {
      // if (info.file.status === 'done') {
      const formData = new FormData();
      formData.append("image", info.file.originFileObj);
      formData.append("user_id", id);
      this.props.changeProfileImage(formData, (res) => {
        if (res.status === 1) {
          toastr.success(
            langs.success,
            langs.messages.profile_image_update_success
          );
          this.props.getTraderProfile({ user_id: id });
          this.props.getUserProfile({ user_id: id });
          this.setState({
            imageUrl: res.data.image,
            loading: false,
          });
        }
      });
    }
  };

  /**
   * @method renderOperatingHours
   * @descriptionhandle render operating hours
   */
  renderOperatingHours = () => {
    const { userDetails } = this.props;
    let d = new Date();
    let currentDay = d.getDay();
    return Object.keys(userDetails.days).map((day, index) => {
      let i = userDetails.user.trader_working_hours.findIndex(
        (e) => e.day == day
      );

      let startTime = userDetails.user.trader_working_hours[i].start_time;
      let endTime = userDetails.user.trader_working_hours[i].end_time;
      let isOpen = userDetails.user.trader_working_hours[i].is_open;

      const stime = moment(String(startTime), ["HH.mm"]).format("hh:mm a");
      const etime = moment(endTime, ["HH.mm"]).format("hh:mm a");
      let dayValue = userDetails.user.trader_working_hours[i].day;
      return (
        <ul>
          <li>
            <Text className={currentDay === dayValue ? "active-date" : ""}>
              {getDaysName(dayValue)}
            </Text>
            {isOpen == 0 ? (
              <Text
                className={
                  currentDay === dayValue
                    ? "pull-right active-date"
                    : "pull-right"
                }
              >
                Closed
              </Text>
            ) : (
              <Paragraph
                className={
                  currentDay === dayValue
                    ? "pull-right active-date"
                    : "pull-right"
                }
              >
                {stime ? stime : ""} - {etime ? etime : ""}
              </Paragraph>
            )}
          </li>
        </ul>
      );
    });
  };

  /**
   * @method renderRestaurantOperatinghours
   * @descriptionhandle render restaurant operating hours
   */
  renderRestaurantOperatinghours = (item) => {
    let days = [
      { day: 1, start_time: "", end_time: "" },
      { day: 2, start_time: "", end_time: "" },
      { day: 3, start_time: "", end_time: "" },
      { day: 4, start_time: "", end_time: "" },
      { day: 5, start_time: "", end_time: "" },
      { day: 6, start_time: "", end_time: "" },
      { day: 7, start_time: "", end_time: "" },
    ];
    const results = days.filter(
      ({ day: id1 }) => !item.some(({ day: id2 }) => id2 === id1)
    );
    let hours = [...item, ...results];

    return (
      hours &&
      Array.isArray(hours) &&
      hours.length &&
      hours.map((el, i) => {
        return (
          <ul>
            <li key={i}>
              <Text className={day === el.day ? "active-date" : ""}>
                {getDaysName(el.day)}
              </Text>
              {el.start_time || el.end_time ? (
                <Text
                  className={
                    day === el.day ? "pull-right active-date" : "pull-right"
                  }
                >
                  {`${formateTime(el.start_time)} - ${formateTime(
                    el.end_time
                  )}`}
                </Text>
              ) : (
                <Text
                  className={
                    day === el.day ? "pull-right active-date" : "pull-right"
                  }
                >
                  Closed
                </Text>
              )}
            </li>
          </ul>
        );
      })
    );
  };

  /**
   * @method renderCusines
   * @description render cusines list
   */
  renderCusines = (item) => {
    let temp = [{ name: "Restaurant" }];
    let temp1 = " ";
    item.map((el, i) => {
      if (i >= 1) {
        temp1 = temp1 + ", " + el.name;
      } else {
        temp1 = temp1 + el.name;
      }
    });
    let data = [...temp, ...[{ name: temp1 }]];
    //console.log("=======", temp1);
    if (data && Array.isArray(data) && data.length) {
      let dataLength = data.length;
      return data.map((el, i) => {
        return (
          <span key={i}>
            {i == 0 || i === dataLength - 1 ? `${el.name}` : `${el.name} ,`}
          </span>
        );
      });
    }
  };

  /**
   * @method renderUploadedFiles
   * @description Used to render uploaded files
   */
  renderUploadedFiles = (list, type) => {
    if (list.length) {
      return list.map((el, i) => {
        return (
          <Col xs={24} sm={24} md={24} lg={4} xl={4}>
            <div className="add-portfolio-block-parent mb-20">
              <div className="padding resume-preview add-portfolio-block">
                <Row gutter={20}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <img src={el.path} />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        );
      });
    }
  };

  hide = () => {
    this.setState({
      visibility: false,
    });
  };

  show = (data) => {
    if (data.length > 0) {
      this.setState({
        visibility: true,
        modalData: data,
      });
    }
  };

  renderFolderList = () => {
    const { uploadedFolderList, userDetails, loggedInUser } = this.props;
    const { imagesList } = this.state;
    return uploadedFolderList.map((el, index) => {
      let isShowIndex = imagesList.findIndex((f) => f.folderId === el.id);
      return (
        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
          <div className="add-portfolio-block-parent mb-20">
            <div className="padding resume-preview add-portfolio-block">
              <Row gutter={20}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <img src={el.path} />
                  <div className="mt-10">
                    <Text>
                      <b>Folder:</b> {el.folder_name}
                    </Text>
                    <br />
                    <Text>
                      <b>Title:</b> {el.title}
                    </Text>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      );
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isLoggedIn } = this.props;
    const { amenities } = this.state;

    isLoggedIn &&
      document.body.classList.add(
        "user_type_" + this.props.loggedInUser.user_type
      );
    if (this.props.userDetails) {
      const {
        previewRestaurant,
        showBrochure,
        showCertificate,
        showGallery,
        showPortfolio,
        imageUrl,
        loading,
        visible,
      } = this.state;
      const {
        userDetails,
        loggedInUser,
        restaurantDetail,
        uploadedBrochureList,
        uploadedCertificationList,
        uploadedGalleryList,
        uploadedFolderList,
      } = this.props;
      const contentStyle = {
        height: "160px",
        color: "#fff",
        lineHeight: "160px",
        textAlign: "center",
        background: "#364d79",
      };
      const { trader_profile, business_name, trader_service_images } =
        userDetails.user;

      //
      let handyman = loggedInUser.user_type === langs.key.handyman;
      let restaurant = loggedInUser.user_type === langs.key.restaurant;
      let beauty = loggedInUser.user_type === langs.userType.beauty;
      let fitness = loggedInUser.user_type === langs.userType.fitness;
      let wellbeing = loggedInUser.user_type === langs.userType.wellbeing;
      let merchant = loggedInUser.role_slug === langs.key.merchant;
      let businessName =
        userDetails &&
        userDetails.user &&
        userDetails.user.trader_profile !== null
          ? userDetails.user.trader_profile.business_name
          : userDetails.user.business_profile
          ? userDetails.user.business_profile.business_name
          : "";
      let isOpen =
        !restaurant &&
        userDetails.user.trader_profile &&
        userDetails.user.trader_profile.is_public_closed;
      return (
        <Layout>
          <Layout>
            <AppSidebar history={history} />
            <Layout>
              <div className="my-profile-box my-profile-box-v2 emp-my-profile-info-box my-profile-setup ">
                <div className="card-container signup-tab">
                  <Row className="header">
                    <Col md={12}>
                      <Title level={1}>My Profile</Title>
                    </Col>
                    {/* {loggedInUser.user_type !== langs.userType.handyman && ( */}
                    {merchant && (
                      <Col md={12} className="text-right">
                        <Link
                          to="/vendor-profile-setup"
                          // to={
                          //   loggedInUser.user_type === "business"
                          //     ? "/edit-business-Profile"
                          //     : "/editProfile"
                          // }
                        >
                          <Space
                            style={{ color: "#2f80ed" }}
                            align={"center"}
                            className="mr-10"
                          >
                            Edit{" "}
                            <Icon
                              icon="edit"
                              size="12"
                              style={{ color: "#2f80ed" }}
                            />
                          </Space>
                        </Link>
                      </Col>
                    )}
                  </Row>
                  {/* <div className="top-head-section">
                    <div className="left">
                      <Title level={2}>My Profile Update</Title>
                    </div>
                    <div className="right"></div>
                  </div> */}
                  <div className="sub-head-section">
                    <Text>All Fields Required</Text>
                  </div>
                  <Card
                    className="profile-content-box classfied-profile-content-box"
                    // title="Profile Set Up"
                    // extra={
                    //   <Link to="/vendor-profile-setup">
                    //     <Space className="edit" align={"center"} size={9}>
                    //       <span>Edit</span>{" "}
                    //       <Icon icon="edit" size="12" className="edit-icon" />
                    //     </Space>
                    //   </Link>
                    // }
                  >
                    <Row>
                      <Col md={16}>
                        <div className="upload-profile--box">
                          {restaurant ? (
                            <div className="upload-profile-pic">
                              {restaurantDetail && userDetails.user.image ? (
                                <Avatar
                                  size={91}
                                  src={userDetails.user.image}
                                />
                              ) : (
                                <Avatar size={91} icon={<UserOutlined />} />
                              )}
                            </div>
                          ) : (
                            <div className="upload-profile-pic">
                              {userDetails.user.image ? (
                                <Avatar
                                  size={91}
                                  src={userDetails.user.image}
                                />
                              ) : (
                                <Avatar size={91} icon={<UserOutlined />} />
                              )}
                            </div>
                          )}
                          <div className="upload-profile-content">
                            {!restaurant && (
                              <Title level={4}>{`${
                                trader_profile &&
                                converInUpperCase(trader_profile.contact_name)
                              }`}</Title>
                            )}
                            {restaurant && restaurantDetail && (
                              <Title level={4}>
                                {restaurantDetail &&
                                restaurantDetail.contact_name
                                  ? converInUpperCase(
                                      restaurantDetail.contact_name
                                    )
                                  : restaurantDetail.user
                                  ? converInUpperCase(
                                      restaurantDetail.user.name
                                    )
                                  : ""}
                              </Title>
                            )}
                            <Text className="fs-10">
                              (Member since -
                              {restaurant
                                ? restaurantDetail &&
                                  restaurantDetail.user &&
                                  restaurantDetail.user.created_at &&
                                  dateFormate(restaurantDetail.user.created_at)
                                : trader_profile &&
                                  dateFormate(trader_profile.created_at)}
                              )
                            </Text>
                            <div className="up-photo">
                              <Upload
                                name="avatar"
                                listType="picture"
                                className="ml-2"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                              >
                                <div>
                                  {loading && <LoadingOutlined />}
                                  <div className="ant-upload-text float-left">
                                    <Link to="#">Upload Photo</Link>
                                  </div>
                                </div>
                              </Upload>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md={8} className="text-right">
                        <Link to="/change-password" className="change-password">
                          <svg
                            width="10"
                            height="13"
                            viewBox="0 0 10 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M3.21859 3.54167C3.21859 2.41984 4.12801 1.51042 5.24984 1.51042C6.37167 1.51042 7.28109 2.41984 7.28109 3.54167V4.89583H3.21859V3.54167ZM1.86442 4.89583L1.86442 3.54167C1.86442 1.67195 3.38012 0.15625 5.24984 0.15625C7.11955 0.15625 8.63525 1.67195 8.63525 3.54167L8.63525 4.89583C9.38314 4.89583 9.98942 5.50211 9.98942 6.25V10.9896C9.98942 11.7375 9.38314 12.3438 8.63525 12.3438H1.86442C1.11654 12.3438 0.510254 11.7375 0.510254 10.9896V6.25C0.510254 5.50211 1.11654 4.89583 1.86442 4.89583ZM1.86442 10.9896V6.25L8.63525 6.25V10.9896H1.86442Z"
                              fill="#2F80ED"
                            />
                          </svg>{" "}
                          Change Password
                        </Link>
                        {loggedInUser.user_type !== langs.userType.handyman && (
                          <Button className="btn-my-package">
                            <img
                              src={require("../../../assets/images/icons/check-cricle-white.svg")}
                              alt="check"
                            />
                            Monthly Package
                          </Button>
                        )}
                      </Col>
                    </Row>
                    <div className="profile-info-block payee-profile-info">
                      <div className="common-profile-info">
                        <div className="info-heading">
                          <Title level={4}>Profile Information</Title>
                          {/* <Link to='/change-password'><LockOutlined /> Change Password</Link> */}
                          {[
                            "handyman",
                            "events",
                            "trader",
                            "wellbeing",
                            "beauty",
                            "restaurant",
                            "fitness",
                          ].includes(loggedInUser.user_type) && (
                            <div md={12} className="text-right">
                              <Link
                                to="/vendor-profile-setup?step=0"
                                // to={
                                //   loggedInUser.user_type === "business"
                                //     ? "/edit-business-Profile"
                                //     : "/editProfile"
                                // }
                              >
                                <Space
                                  style={{ color: "#2f80ed" }}
                                  align={"center"}
                                  className="mr-10"
                                >
                                  <Icon
                                    className="edit-icon"
                                    icon="edit"
                                    size="12"
                                    style={{ color: "#2f80ed" }}
                                  />
                                </Space>
                              </Link>
                            </div>
                          )}
                        </div>
                        <Row>
                          {!restaurant && business_name && (
                            <Col md={12}>
                              <Text className="label">Business Name</Text>
                              <Paragraph className="label-value">
                                {business_name
                                  ? `${converInUpperCase(business_name)}`
                                  : ""}
                              </Paragraph>
                            </Col>
                          )}
                          {restaurant &&
                            restaurantDetail &&
                            restaurantDetail.user &&
                            restaurantDetail.user.business_name && (
                              <Col md={12}>
                                <Text className="label">Business Name</Text>
                                <Paragraph className="label-value">
                                  {restaurantDetail &&
                                  restaurantDetail.business_name
                                    ? converInUpperCase(
                                        restaurantDetail.business_name
                                      )
                                    : restaurantDetail.user.business_name
                                    ? converInUpperCase(
                                        restaurantDetail.user.business_name
                                      )
                                    : businessName
                                    ? converInUpperCase(businessName)
                                    : ""}
                                </Paragraph>
                              </Col>
                            )}
                          {!restaurant &&
                            trader_profile &&
                            trader_profile.contact_name && (
                              <Col md={12}>
                                <Text className="label">Contact Name</Text>
                                <Paragraph className="label-value">
                                  {trader_profile && trader_profile.contact_name
                                    ? trader_profile.contact_name
                                    : ""}
                                </Paragraph>
                              </Col>
                            )}
                          {restaurant && restaurantDetail && (
                            <Col md={12}>
                              <Text className="label">Contact Name</Text>
                              <Paragraph className="label-value">
                                {restaurantDetail &&
                                restaurantDetail.contact_name
                                  ? converInUpperCase(
                                      restaurantDetail.contact_name
                                    )
                                  : restaurantDetail.user
                                  ? converInUpperCase(
                                      restaurantDetail.user.name
                                    )
                                  : ""}
                              </Paragraph>
                            </Col>
                          )}
                        </Row>
                        <Row>
                          {restaurant && (
                            <Col md={12}>
                              <Text className="label">Contact Number</Text>
                              <Paragraph className="label-value">
                                {restaurantDetail &&
                                restaurantDetail.contact_number
                                  ? restaurantDetail.contact_number
                                  : userDetails.user.contact_number
                                  ? userDetails.user.contact_number
                                  : "N/A"}
                              </Paragraph>
                            </Col>
                          )}
                          <Col md={12}>
                            <Text className="label">Email</Text>
                            <Paragraph className="label-value">
                              {restaurant
                                ? restaurantDetail && restaurantDetail.email
                                : userDetails.user.email}
                            </Paragraph>
                          </Col>

                          {!restaurant && (
                            <Col md={12}>
                              <Text className="label">Contact Number</Text>
                              <Paragraph className="label-value">
                                {userDetails.user.contact_number
                                  ? userDetails.user.contact_number
                                  : "N/A"}
                              </Paragraph>
                            </Col>
                          )}
                        </Row>
                        <Row>
                          {!restaurant && (
                            <Col md={12}>
                              <Text className="label">Address</Text>
                              <Paragraph className="label-value">
                                {userDetails.user.business_location}
                              </Paragraph>
                            </Col>
                          )}
                          {restaurant && restaurantDetail && (
                            <Col span={12}>
                              <Text className="label">Address</Text>
                              <Paragraph className="label-value">
                                {restaurantDetail && restaurantDetail.address
                                  ? restaurantDetail.address
                                  : restaurantDetail.user.business_location
                                  ? restaurantDetail.user.business_location
                                  : ""}
                              </Paragraph>
                            </Col>
                          )}
                        </Row>
                      </div>
                      {!merchant && (
                        <div className="booking-profile-info">
                          {/* <div className="info-heading"></div> */}
                          {/* <Divider/> */}
                          {[
                            "handyman",
                            "events",
                            "trader",
                            "wellbeing",
                            "beauty",
                            "restaurant",
                            "fitness",
                          ].includes(loggedInUser.user_type) && (
                            <>
                              <Title level={4} className="">
                                Business Information
                                {[
                                  "handyman",
                                  "events",
                                  "trader",
                                  "wellbeing",
                                  "beauty",
                                  "restaurant",
                                  "fitness",
                                ].includes(loggedInUser.user_type) && (
                                  <div
                                    md={12}
                                    style={{ float: "right" }}
                                    className="text-right"
                                  >
                                    <Link
                                      to="/vendor-profile-setup?step=1"
                                      // to={
                                      //   loggedInUser.user_type === "business"
                                      //     ? "/edit-business-Profile"
                                      //     : "/editProfile"
                                      // }
                                    >
                                      <Space
                                        style={{ color: "#2f80ed" }}
                                        align={"center"}
                                        className="mr-10"
                                      >
                                        <Icon
                                          className="edit-icon"
                                          icon="edit"
                                          size="12"
                                          style={{ color: "#2f80ed" }}
                                        />
                                      </Space>
                                    </Link>
                                  </div>
                                )}
                              </Title>
                            </>
                          )}
                          {["wellbeing", "beauty"].includes(
                            loggedInUser.user_type
                          ) && (
                            <Row>
                              <Col
                                className="breadcrumb"
                                xs={24}
                                sm={24}
                                md={12}
                                lg={12}
                              >
                                <Text className="label">Bookings </Text>
                                <Text className="label">
                                  {trader_profile &&
                                    trader_profile.category_name}
                                </Text>
                                <Text className="label">
                                  {trader_profile &&
                                    trader_profile.sub_category_name}{" "}
                                </Text>
                              </Col>
                            </Row>
                          )}
                          {restaurant && (
                            <Row>
                              {restaurantDetail &&
                                restaurantDetail.profile_cusines.length !==
                                  0 && (
                                  <Col span={24}>
                                    {/* <Text className='label'>Restaurant:</Text> */}
                                    {/* {console.log(
                                      "--------------------------------------",
                                      restaurantDetail.profile_cusines
                                    )} */}
                                    <div className="breadcrumb">
                                      <div>
                                        {this.renderCusines(
                                          restaurantDetail.profile_cusines
                                        )}
                                      </div>
                                    </div>
                                  </Col>
                                )}
                            </Row>
                          )}
                          {loggedInUser.user_type ===
                            langs.userType.fitness && (
                            <Row className="thumb-block">
                              <Col md={24}>
                                <div className="fitness-category">
                                  <div>
                                    <span>
                                      {trader_profile &&
                                        trader_profile.category_name}
                                    </span>
                                    <span>
                                      {trader_profile &&
                                        trader_profile.sub_category_name}
                                    </span>
                                    {/* <span>Pilates,</span>
                                <span>Pole,</span>
                                <span>Fitness</span>  */}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          )}
                          {!restaurant && (
                            <Row gutter={24} className="thumb-block">
                              <Col span={24}>
                                <Row>
                                  {Array.isArray(trader_service_images) &&
                                    trader_service_images.map((el) => {
                                      return (
                                        <Col
                                          className="thumb"
                                          xs={24}
                                          sm={24}
                                          md={24}
                                          lg={4}
                                          xl={4}
                                        >
                                          <img
                                            src={""}
                                            alt="Fitness"
                                            width="160"
                                            height="127"
                                          />
                                        </Col>
                                      );
                                    })}
                                </Row>
                              </Col>
                            </Row>
                          )}
                          {restaurant && (
                            <Row gutter={24} className="thumb-block">
                              <Col span={24}>
                                <Row>
                                  {restaurantDetail &&
                                    restaurantDetail.cover_photo && (
                                      <Col
                                        className="thumb"
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={4}
                                        xl={4}
                                      >
                                        <img
                                          src={restaurantDetail.cover_photo}
                                          alt="Fitness"
                                          width="160"
                                          height="127"
                                        />
                                      </Col>
                                    )}
                                </Row>
                              </Col>
                            </Row>
                          )}

                          <Row gutter={40} className="restaurant-info">
                            {restaurant &&
                              restaurantDetail.description &&
                              restaurantDetail.description !== "<p></p>" && (
                                <Col span={24}>
                                  <Text className="restaurant-label">
                                    Restaurant Information
                                  </Text>
                                  <Paragraph className="label-value">
                                    {restaurantDetail &&
                                      convertHTMLToText(
                                        restaurantDetail.description
                                      )}
                                  </Paragraph>
                                </Col>
                              )}
                            {!restaurant &&
                              trader_profile &&
                              trader_profile.description &&
                              trader_profile.description !== "<p></p>" && (
                                <Col
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={24}
                                  className="about-us-profile"
                                >
                                  <Text className="label">About Us</Text>
                                  <Paragraph className="about-us-description">
                                    {convertHTMLToText(
                                      trader_profile.description
                                    )}
                                    {loggedInUser.user_type === "fitness" && (
                                      <div className="ameinities-section">
                                        <Text className="label">
                                          Ameinities
                                        </Text>
                                        <ul className="ameinities-list">
                                          {this.state.amenities.map((val) => {
                                            return (
                                              <>
                                                <li>{val.name}</li>
                                              </>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    )}
                                  </Paragraph>

                                  {!restaurant &&
                                    !wellbeing &&
                                    !beauty &&
                                    !merchant &&
                                    trader_profile &&
                                    trader_profile.service_and_facilities &&
                                    trader_profile.service_and_facilities !==
                                      "<p></p>" && (
                                      <Text className="label service-label">
                                        {loggedInUser.user_type === "fitness"
                                          ? "Features"
                                          : "Service"}
                                      </Text>
                                    )}
                                  {(loggedInUser.user_type === "events" ||
                                    loggedInUser.user_type === "fitness" ||
                                    loggedInUser.user_type === "handyman") && (
                                    <Paragraph className="description">
                                      {/* Restaurant, Bar, Function venue, Theatre, Floating, Conference hall, Venues with accommodation, other */}
                                      {trader_profile &&
                                        convertHTMLToText(
                                          trader_profile.service_and_facilities
                                        )}
                                    </Paragraph>
                                  )}
                                </Col>
                              )}

                            <Row gutter={40} className="features-block mt-0">
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={12}
                                xl={12}
                                className="operating-hrs-col"
                              >
                                {restaurant &&
                                  restaurantDetail &&
                                  Array.isArray(
                                    restaurantDetail.operating_hours
                                  ) &&
                                  restaurantDetail.operating_hours.length !==
                                    0 && (
                                    <Card
                                      className="operating-hours"
                                      title={
                                        <div>
                                          <Icon
                                            icon="clock"
                                            size="11"
                                            className="mr-10 icon-black"
                                          />
                                          <Text className="fs-13 mr-10 label">
                                            Operating hours
                                          </Text>
                                        </div>
                                      }
                                    >
                                      {this.renderRestaurantOperatinghours(
                                        restaurantDetail.operating_hours
                                      )}

                                      <Text className="public-holidays-text label">
                                        {restaurantDetail.is_public_closed == 1
                                          ? "Public holidays closed:  Yes"
                                          : "Public holidays closed:  No"}
                                      </Text>
                                    </Card>
                                  )}
                                {!restaurant && !merchant && (
                                  <Card
                                    className="operating-hours"
                                    title={
                                      <div>
                                        <Icon
                                          icon="clock"
                                          size="11"
                                          className="mr-10 icon-black"
                                        />
                                        <Text className="fs-13 mr-10 label">
                                          Operating hours
                                        </Text>
                                      </div>
                                    }
                                  >
                                    {this.renderOperatingHours()}

                                    <Text className="public-holidays-text label">
                                      Public holidays{" "}
                                      {isOpen === 1 ? "Yes" : "No"}
                                    </Text>
                                  </Card>
                                )}
                              </Col>

                              <Col
                                xs={24}
                                sm={24}
                                lg={12}
                                md={12}
                                className="service-area-col"
                              >
                                {console.log(
                                  "===============>",
                                  restaurantDetail
                                )}
                                {restaurant && restaurantDetail && (
                                  <Col span={6}>
                                    <Text className="label">Cusines</Text>
                                    <Paragraph className="label-value">
                                      {restaurantDetail.cusines_text}
                                    </Paragraph>
                                  </Col>
                                )}
                                {restaurant && restaurantDetail && (
                                  <Col span={6}>
                                    <Text className="label">Dietary:</Text>
                                    <Paragraph className="label-value">
                                      {restaurantDetail.dietary_text}
                                    </Paragraph>
                                  </Col>
                                )}
                                {restaurant && restaurantDetail && (
                                  <Col span={6}>
                                    <Text className="label">Service Type</Text>
                                    <Paragraph className="label-value">
                                      {restaurantDetail.service}
                                    </Paragraph>
                                  </Col>
                                )}
                                {restaurant && restaurantDetail && (
                                  <Col span={6}>
                                    <Text className="label">Standard ETA</Text>
                                    <Paragraph className="label-value">
                                      {restaurantDetail.standardeta_text}
                                    </Paragraph>
                                  </Col>
                                )}
                                <Col xs={24} sm={24} md={24} lg={24}>
                                  {!restaurant &&
                                    trader_profile &&
                                    trader_profile.service_type &&
                                    trader_profile.service_type !== "null" &&
                                    trader_profile.service_type !==
                                      "undefined" && (
                                      <>
                                        <Text className="label">
                                          Service Type
                                        </Text>
                                        <Paragraph className="label-value">
                                          {trader_profile &&
                                            trader_profile.service_type}
                                        </Paragraph>
                                      </>
                                    )}

                                  {!restaurant &&
                                    trader_profile &&
                                    trader_profile.service_area &&
                                    trader_profile.service_area !== "null" &&
                                    trader_profile.service_area !==
                                      "undefined" && (
                                      <Row>
                                        <Col
                                          xs={24}
                                          sm={24}
                                          md={24}
                                          lg={24}
                                          className="service-area"
                                        >
                                          <Text className="label">
                                            Service area
                                          </Text>
                                          <Paragraph className="label-value">
                                            {trader_profile &&
                                            trader_profile.service_area
                                              ? `${trader_profile.service_area}`
                                              : ""}
                                          </Paragraph>
                                          {/* <Text className="label">
                                            Service Type
                                          </Text>
                                          <Paragraph className="label-value">
                                            {trader_profile &&
                                            trader_profile.service_type
                                              ? `${trader_profile.service_type} Km`
                                              : "0 Km"}
                                          </Paragraph> */}
                                          {loggedInUser.user_type ===
                                            "fitness" && (
                                            <div className="charge-rate-section">
                                              <Text className="label">
                                                Charge Rate (AUD)
                                              </Text>
                                              <Row gutter={[10, 10]}>
                                                <Col
                                                  xs={24}
                                                  sm={24}
                                                  md={24}
                                                  lg={24}
                                                  xl={24}
                                                >
                                                  <Checkbox
                                                    checked={
                                                      trader_profile.rate_per_hour ===
                                                        undefined ||
                                                      trader_profile.rate_per_hour ===
                                                        null
                                                        ? false
                                                        : true
                                                    }
                                                  >
                                                    Start from{" "}
                                                    {this.state.trade_hour}
                                                  </Checkbox>
                                                </Col>
                                              </Row>
                                            </div>
                                          )}
                                        </Col>
                                        <Col className="capacity-row">
                                          {loggedInUser.user_type == "events" &&
                                            !restaurant &&
                                            trader_profile &&
                                            trader_profile.capacity && (
                                              <Col span={12}>
                                                <Text className="label">
                                                  Capacity
                                                </Text>
                                                <Paragraph
                                                  className="label-value"
                                                  style={{
                                                    marginBottom: "14px",
                                                  }}
                                                >
                                                  {trader_profile &&
                                                    trader_profile.capacity}
                                                </Paragraph>
                                              </Col>
                                            )}
                                        </Col>
                                      </Row>
                                    )}
                                  <Row>
                                    {!restaurant && !merchant && !fitness && (
                                      // !beauty &&
                                      // !wellbeing && (
                                      <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={24}
                                        xl={24}
                                      >
                                        {
                                          <div className="chargesrate">
                                            <Text className="label">
                                              Charge rate (AUD)
                                            </Text>
                                            {trader_profile &&
                                              trader_profile.rate_per_hour && (
                                                <Row gutter={[10, 10]}>
                                                  <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={24}
                                                    xl={24}
                                                  >
                                                    <Checkbox
                                                      checked={
                                                        trader_profile.rate_per_hour ===
                                                          undefined ||
                                                        trader_profile.rate_per_hour ===
                                                          null
                                                          ? false
                                                          : true
                                                      }
                                                    >
                                                      Start from{" "}
                                                      {`${
                                                        trader_profile.rate_per_hour ===
                                                          undefined ||
                                                        trader_profile.rate_per_hour ===
                                                          null
                                                          ? ""
                                                          : trader_profile.rate_per_hour &&
                                                            `${trader_profile.rate_per_hour} / hours`
                                                      }`}
                                                    </Checkbox>
                                                  </Col>
                                                </Row>
                                              )}
                                            <Row gutter={[10, 10]}>
                                              <Col
                                                xs={24}
                                                sm={24}
                                                md={24}
                                                lg={12}
                                                xl={12}
                                              >
                                                <Checkbox
                                                  checked={
                                                    trader_profile.basic_quote
                                                  }
                                                >
                                                  Basis Quote
                                                </Checkbox>
                                              </Col>
                                            </Row>
                                          </div>
                                        }
                                      </Col>
                                    )}
                                  </Row>
                                </Col>
                              </Col>
                            </Row>
                          </Row>

                          {!restaurant && !merchant && (
                            <Divider className="mb-30" />
                          )}
                          {/* {!restaurant &&
                            !merchant &&
                            loggedInUser.user_type !== langs.userType.fitness &&
                            !beauty &&
                            !wellbeing &&
                            loggedInUser.user_type !== "handyman" &&
                            loggedInUser.user_type !== "events" && (
                              <div>
                                {}
                                <Title level={4} className="mb-28">
                                  Charges rate (AUD)
                                </Title>
                                {trader_profile &&
                                  trader_profile.rate_per_hour && (
                                    <Row gutter={[10, 10]}>
                                      <Col span={6}>
                                        <Checkbox
                                          checked={
                                            trader_profile.rate_per_hour
                                              ? true
                                              : false
                                          }
                                        >
                                          Start from{" "}
                                          <b>{`${
                                            trader_profile.rate_per_hour ===
                                              undefined ||
                                            trader_profile.rate_per_hour ===
                                              null
                                              ? ""
                                              : trader_profile.rate_per_hour &&
                                                `$${trader_profile.rate_per_hour} / hours`
                                          }`}</b>
                                        </Checkbox>
                                      </Col>
                                    </Row>
                                  )}
                                <Row gutter={[10, 10]}>
                                  <Col span={6}>
                                    <Checkbox
                                      checked={trader_profile.basic_quote}
                                    >
                                      Basis Quote
                                    </Checkbox>
                                  </Col>
                                </Row>
                                {!restaurant && (
                                  <Divider
                                    className="mb-30"
                                    style={{ marginTop: "47px" }}
                                  />
                                )}
                              </div>
                            )} */}
                          {/* {loggedInUser.user_type !== langs.key.beauty && !restaurant && */}
                          {["wellbeing"].includes(loggedInUser.user_type) ? (
                            <div className="reference-files services-section">
                              <Title level={4} className="mb-30">
                                <div className="title">Services</div>
                                <div md={12} className="edit-section">
                                  <Link to="/vendor-services">
                                    <Space
                                      style={{ color: "#2f80ed" }}
                                      align={"center"}
                                      className="mr-10"
                                    >
                                      <Icon
                                        className="edit-icon"
                                        icon="edit"
                                        size="12"
                                        style={{ color: "#2f80ed" }}
                                      />
                                    </Space>
                                  </Link>
                                </div>
                              </Title>
                              <Row>
                                <Col span={6}>
                                  {/* <h2>Service</h2> */}
                                  <Link
                                    className="link-service"
                                    to="/vendor-services"
                                  >
                                    View My Services
                                  </Link>
                                </Col>
                              </Row>
                            </div>
                          ) : ["beauty"].includes(loggedInUser.user_type) ? (
                            <div className="reference-files services-section">
                              <Title level={4} className="mb-30">
                                <div className="title">Services</div>
                                <div md={12} className="edit-section">
                                  <Link to="/services">
                                    <Space
                                      style={{ color: "#2f80ed" }}
                                      align={"center"}
                                      className="mr-10"
                                    >
                                      <Icon
                                        className="edit-icon"
                                        icon="edit"
                                        size="12"
                                        style={{ color: "#2f80ed" }}
                                      />
                                    </Space>
                                  </Link>
                                </div>
                              </Title>
                              <Row>
                                <Col span={6}>
                                  {/* <h2>Service</h2> */}
                                  <Link className="link-service" to="/services">
                                    View My Services
                                  </Link>
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            ""
                          )}
                          {["fitness"].includes(loggedInUser.user_type) && (
                            <div className="reference-files services-section">
                              <Title level={4} className="mb-30">
                                <div className="title">Services</div>
                                <div md={12} className="edit-section">
                                  <Link to="/fitness-vendor-manage-classes">
                                    <Space
                                      style={{ color: "#2f80ed" }}
                                      align={"center"}
                                      className="mr-10"
                                    >
                                      <Icon
                                        className="edit-icon"
                                        icon="edit"
                                        size="12"
                                        style={{ color: "#2f80ed" }}
                                      />
                                    </Space>
                                  </Link>
                                </div>
                              </Title>
                              <Row>
                                <Col span={6}>
                                  {/* <h2>Service</h2> */}
                                  <Link
                                    className="link-service"
                                    to="/fitness-vendor-manage-classes"
                                  >
                                    {/* <Button
                                        type="primary"
                                        shape="round"
                                        icon={<FileTextOutlined />}
                                      >
                                        View Services
                                      </Button> */}
                                    View My Classes
                                  </Link>
                                  <Link
                                    className="link-service"
                                    to="/fitness-vendor-manage-classes"
                                  >
                                    {/* <Button
                                        type="primary"
                                        shape="round"
                                        icon={<FileTextOutlined />}
                                      >
                                        View Services
                                      </Button> */}
                                    View Memberships Plan
                                  </Link>
                                </Col>
                              </Row>
                            </div>
                          )}
                          {[
                            "handyman",
                            "events",
                            "trader",
                            "wellbeing",
                            "beauty",
                            "fitness",
                          ].includes(loggedInUser.user_type) && (
                            <div className="reference-files">
                              <Title level={4} className="mb-28">
                                Reference files
                                {["handyman", "events", "trader"].includes(
                                  loggedInUser.user_type
                                ) && (
                                  <div
                                    md={12}
                                    style={{ float: "right" }}
                                    className="text-right"
                                  >
                                    <Link
                                      to="/vendor-profile-setup?step=2"
                                      // to={
                                      //   loggedInUser.user_type === "business"
                                      //     ? "/edit-business-Profile"
                                      //     : "/editProfile"
                                      // }
                                    >
                                      <Space
                                        style={{ color: "#2f80ed" }}
                                        align={"center"}
                                        className="mr-10"
                                      >
                                        <Icon
                                          className="edit-icon"
                                          icon="edit"
                                          size="12"
                                          style={{ color: "#2f80ed" }}
                                        />
                                      </Space>
                                    </Link>
                                  </div>
                                )}
                                {["wellbeing", "beauty"].includes(
                                  loggedInUser.user_type
                                ) && (
                                  <div
                                    md={12}
                                    style={{ float: "right" }}
                                    className="text-right"
                                  >
                                    <Link
                                      to="/vendor-profile-setup?step=3"
                                      // to={
                                      //   loggedInUser.user_type === "business"
                                      //     ? "/edit-business-Profile"
                                      //     : "/editProfile"
                                      // }
                                    >
                                      <Space
                                        style={{ color: "#2f80ed" }}
                                        align={"center"}
                                        className="mr-10"
                                      >
                                        <Icon
                                          className="edit-icon"
                                          icon="edit"
                                          size="12"
                                          style={{ color: "#2f80ed" }}
                                        />
                                      </Space>
                                    </Link>
                                  </div>
                                )}
                                {["fitness"].includes(
                                  loggedInUser.user_type
                                ) && (
                                  <div
                                    md={12}
                                    style={{ float: "right" }}
                                    className="text-right"
                                  >
                                    <Link
                                      to="/vendor-profile-setup?step=2"
                                      // to={
                                      //   loggedInUser.user_type === "business"
                                      //     ? "/edit-business-Profile"
                                      //     : "/editProfile"
                                      // }
                                    >
                                      <Space
                                        style={{ color: "#2f80ed" }}
                                        align={"center"}
                                        className="mr-10"
                                      >
                                        <Icon
                                          className="edit-icon"
                                          icon="edit"
                                          size="12"
                                          style={{ color: "#2f80ed" }}
                                        />
                                      </Space>
                                    </Link>
                                  </div>
                                )}
                              </Title>

                              <Modal
                                // title="Basic Modal"
                                className="reference-popup"
                                header={false}
                                closable={true}
                                onOk={this.hide}
                                onCancel={this.hide}
                                visible={this.state.visibility}
                                footer={null}
                              >
                                <div>
                                  <Carousel
                                    afterChange={(a) =>
                                      this.setState({
                                        activeImg: a,
                                      })
                                    }
                                    dots={false}
                                    arrows={true}
                                    prevArrow={
                                      <span className="prev-arrow"></span>
                                    }
                                    nextArrow={
                                      <span className="next-arrow"></span>
                                    }
                                  >
                                    {this.state.modalData.map((data, i) => {
                                      return (
                                        <div>
                                          <img
                                            id={i}
                                            width={300}
                                            height={300}
                                            src={data.path}
                                            alt=""
                                          />
                                          <div className="social-icons">
                                            <ul>
                                              <li>
                                                <FacebookMessengerShareButton
                                                  url={data.path}
                                                  quote={""}
                                                  className="fb-icon"
                                                >
                                                  <FacebookMessengerIcon
                                                    size={32}
                                                    round
                                                  />
                                                </FacebookMessengerShareButton>
                                              </li>
                                              <li>
                                                <WhatsappShareButton
                                                  url={data.path}
                                                  quote={""}
                                                  className="whatsapp-icon"
                                                >
                                                  <WhatsappIcon
                                                    size={32}
                                                    round
                                                  />
                                                </WhatsappShareButton>
                                              </li>
                                              <li>
                                                <LineShareButton
                                                  url={data.path}
                                                  quote={""}
                                                  className="line-icon"
                                                >
                                                  <LineIcon size={32} round />
                                                </LineShareButton>
                                              </li>
                                              <li>
                                                <EmailShareButton
                                                  url={data.path}
                                                  quote={""}
                                                  className="email-icon"
                                                >
                                                  <EmailIcon size={32} round />
                                                </EmailShareButton>
                                              </li>
                                              {/* <li>
                                                <EmailShareButton
                                                  url={data.path}
                                                  quote={""}
                                                  className="link-icon"
                                                >
                                                  <EmailIcon size={32} round />
                                                </EmailShareButton>
                                              </li> */}
                                            </ul>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </Carousel>
                                </div>
                                <div className="slider-thumb-row">
                                  {this.state.modalData.map((data, i) => {
                                    return (
                                      <div
                                        className={
                                          i == this.state.activeImg
                                            ? "active-image"
                                            : ""
                                        }
                                      >
                                        <img
                                          id={i}
                                          width={100}
                                          height={100}
                                          src={data.path}
                                          alt=""
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </Modal>
                              <Row>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                  <div className="view-files-col">
                                    {[
                                      "handyman",
                                      "events",
                                      "trader",
                                      "wellbeing",
                                      "beauty",
                                    ].includes(loggedInUser.user_type) && (
                                      <div>
                                        <h2>Certificates</h2>
                                        {Array.isArray(
                                          uploadedCertificationList
                                        ) && (
                                          <Button
                                            onClick={
                                              () =>
                                                this.show(
                                                  uploadedCertificationList
                                                )
                                              // this.setState({
                                              //   showCertificate: !showCertificate,
                                              // })
                                            }
                                            type="primary"
                                            shape="round"
                                            icon={<FileTextOutlined />}
                                          >
                                            {`View Files (${uploadedCertificationList.length})`}
                                          </Button>
                                        )}
                                        {showCertificate && (
                                          <div className="add-portfolio-block-g-parent">
                                            {this.renderUploadedFiles(
                                              uploadedCertificationList,
                                              1
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="view-files-col">
                                    {[
                                      "handyman",
                                      "events",
                                      "trader",
                                      "wellbeing",
                                      "beauty",
                                    ].includes(loggedInUser.user_type) && (
                                      <div>
                                        <h2> Brochure</h2>
                                        {Array.isArray(
                                          uploadedBrochureList
                                        ) && (
                                          <Button
                                            onClick={
                                              () =>
                                                this.show(uploadedBrochureList)
                                              // this.setState({
                                              //   showBrochure: !showBrochure,
                                              // })
                                            }
                                            type="primary"
                                            shape="round"
                                            icon={<FileTextOutlined />}
                                          >
                                            {`View Files (${uploadedBrochureList.length})`}
                                          </Button>
                                        )}
                                        {showBrochure && (
                                          <Row
                                            gutter={30}
                                            className="add-portfolio-block-g-parent"
                                          >
                                            {this.renderUploadedFiles(
                                              uploadedBrochureList,
                                              1
                                            )}
                                          </Row>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="view-files-col">
                                    <h2>Gallery</h2>
                                    {Array.isArray(uploadedGalleryList) && (
                                      <Button
                                        className="mb-20"
                                        onClick={
                                          () => this.show(uploadedGalleryList)
                                          // this.setState({
                                          //   showGallery: !showGallery,
                                          // })
                                        }
                                        type="primary"
                                        shape="round"
                                        icon={<FileTextOutlined />}
                                      >
                                        {`View Files (${uploadedGalleryList.length})`}
                                      </Button>
                                    )}
                                    {showGallery && (
                                      <Row
                                        gutter={30}
                                        className="add-portfolio-block-g-parent"
                                      >
                                        {this.renderUploadedFiles(
                                          uploadedGalleryList,
                                          2
                                        )}
                                      </Row>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          )}

                          {loggedInUser.user_type === "test" && (
                            //  || loggedInUser.user_type === langs.key.fitness &&
                            <div className="reference-files">
                              <Title level={4} className="mb-28">
                                Reference files
                              </Title>
                              {loggedInUser.user_type ===
                              langs.userType.fitness ? (
                                <Row>
                                  <Col span={6}>
                                    <h2>Class</h2>
                                    <Button
                                      type="primary"
                                      shape="round"
                                      icon={<FileTextOutlined />}
                                    >
                                      View CLASS
                                    </Button>
                                    <h2 className="member-top-space">
                                      Membership
                                    </h2>
                                    <Button
                                      type="primary"
                                      shape="round"
                                      icon={<FileTextOutlined />}
                                    >
                                      View MEMBERSHIP
                                    </Button>
                                  </Col>
                                </Row>
                              ) : (
                                <Row>
                                  <Col xs={24} sm={24} md={24} lg={24}>
                                    <div class="view-files-col">
                                      <h2> Brochure</h2>
                                      {Array.isArray(uploadedBrochureList) && (
                                        <Button
                                          onClick={() =>
                                            this.setState({
                                              showBrochure: !showBrochure,
                                            })
                                          }
                                          type="primary"
                                          shape="round"
                                          icon={<FileTextOutlined />}
                                        >
                                          {`View Files (${uploadedBrochureList.length})`}
                                        </Button>
                                      )}
                                    </div>
                                    <div class="view-files-col">
                                      {showBrochure && (
                                        <Row
                                          gutter={30}
                                          className="add-portfolio-block-g-parent"
                                        >
                                          {this.renderFolderList()}
                                        </Row>
                                      )}
                                    </div>
                                    <div class="view-files-col">
                                      <h2>Certificates</h2>
                                      {Array.isArray(
                                        uploadedCertificationList
                                      ) && (
                                        <Button
                                          onClick={() =>
                                            this.setState({
                                              showCertificate: !showCertificate,
                                            })
                                          }
                                          type="primary"
                                          shape="round"
                                          icon={<FileTextOutlined />}
                                        >
                                          {`View Files  (${uploadedCertificationList.length})`}
                                        </Button>
                                      )}

                                      {showCertificate && (
                                        <div className="add-portfolio-block-g-parent">
                                          {this.renderUploadedFiles(
                                            uploadedBrochureList,
                                            1
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div class="view-files-col">
                                      <h2>View Portfolio</h2>
                                      {Array.isArray(uploadedFolderList) && (
                                        <Button
                                          className="mb-20"
                                          onClick={() =>
                                            this.setState({
                                              showPortfolio: !showPortfolio,
                                            })
                                          }
                                          type="primary"
                                          shape="round"
                                          icon={<FileTextOutlined />}
                                        >
                                          {`View Files (${uploadedFolderList.length})`}
                                        </Button>
                                      )}
                                      {showPortfolio && (
                                        <Row
                                          gutter={30}
                                          className="add-portfolio-block-g-parent"
                                        >
                                          {this.renderUploadedFiles(
                                            uploadedCertificationList,
                                            2
                                          )}
                                        </Row>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              )}
                            </div>
                          )}

                          {loggedInUser.user_type === langs.key.restaurant && (
                            <div className="reference-files menu-row">
                              <Title level={4} className="mb-30">
                                My Menu
                                <div
                                  md={12}
                                  style={{ float: "right" }}
                                  className="text-right"
                                >
                                  <Link to="/my-menu">
                                    <Space
                                      style={{ color: "#2f80ed" }}
                                      align={"center"}
                                      className="mr-10"
                                    >
                                      <Icon
                                        className="edit-icon"
                                        icon="edit"
                                        size="12"
                                        style={{ color: "#2f80ed" }}
                                      />
                                    </Space>
                                  </Link>
                                </div>
                              </Title>

                              <Row>
                                <Col span={6}>
                                  {/* <h2>Menu</h2> */}
                                  <Link to="/my-menu" className="link-menu">
                                    {/* <Button
                                      type="primary"
                                      shape="round"
                                      icon={<FileTextOutlined />}
                                    > */}
                                    View Menu
                                    {/* </Button> */}
                                  </Link>
                                </Col>
                              </Row>
                            </div>
                          )}
                          {/* <Divider className="mb-30" /> */}
                          {!restaurant &&
                          trader_profile &&
                          trader_profile.is_paypal_accepted ? (
                            <div>
                              {/* {true ? <div> */}
                              <Title level={4} className="mb-26 mt-12">
                                <div className="payment-title">Payment</div>
                                <div className="saved-payment-title">
                                  Your saved payment methods
                                </div>
                                {["handyman", "events", "trader"].includes(
                                  loggedInUser.user_type
                                ) && (
                                  <div
                                    md={12}
                                    style={{ float: "right" }}
                                    className="text-right"
                                  >
                                    <Link
                                      to="/vendor-profile-setup?step=3"
                                      // to={
                                      //   loggedInUser.user_type === "business"
                                      //     ? "/edit-business-Profile"
                                      //     : "/editProfile"
                                      // }
                                    >
                                      <Space
                                        style={{ color: "#2f80ed" }}
                                        align={"center"}
                                        className="mr-10"
                                      >
                                        <Icon
                                          className="edit-icon"
                                          icon="edit"
                                          size="12"
                                          style={{ color: "#2f80ed" }}
                                        />
                                      </Space>
                                    </Link>
                                  </div>
                                )}
                                {["wellbeing", "beauty"].includes(
                                  loggedInUser.user_type
                                ) && (
                                  <div
                                    md={12}
                                    style={{ float: "right" }}
                                    className="text-right"
                                  >
                                    <Link
                                      to="/vendor-profile-setup?step=4"
                                      // to={
                                      //   loggedInUser.user_type === "business"
                                      //     ? "/edit-business-Profile"
                                      //     : "/editProfile"
                                      // }
                                    >
                                      <Space
                                        style={{ color: "#2f80ed" }}
                                        align={"center"}
                                        className="mr-10"
                                      >
                                        <Icon
                                          className="edit-icon"
                                          icon="edit"
                                          size="12"
                                          style={{ color: "#2f80ed" }}
                                        />
                                      </Space>
                                    </Link>
                                  </div>
                                )}
                                {["fitness"].includes(
                                  loggedInUser.user_type
                                ) && (
                                  <div
                                    md={12}
                                    style={{ float: "right" }}
                                    className="text-right"
                                  >
                                    <Link
                                      to="/vendor-profile-setup?step=5"
                                      // to={
                                      //   loggedInUser.user_type === "business"
                                      //     ? "/edit-business-Profile"
                                      //     : "/editProfile"
                                      // }
                                    >
                                      <Space
                                        style={{ color: "#2f80ed" }}
                                        align={"center"}
                                        className="mr-10"
                                      >
                                        <Icon
                                          className="edit-icon"
                                          icon="edit"
                                          size="12"
                                          style={{ color: "#2f80ed" }}
                                        />
                                      </Space>
                                    </Link>
                                  </div>
                                )}
                              </Title>
                              {userDetails.accepted_payment_methods.paypal ===
                                1 && (
                                <div className="payment-verified-block">
                                  <img
                                    src={require("../../../assets/images/paypal-icon.jpg")}
                                    alt="Fitness"
                                  />
                                  <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    className="verified"
                                  >
                                    Verified
                                  </Button>
                                </div>
                              )}
                              {userDetails.accepted_payment_methods.stripe ===
                                1 && (
                                <div className="payment-verified-block">
                                  <img
                                    src={require("../../../assets/images/stripe-transparent-icon.png")}
                                    alt="Fitness"
                                  />
                                  <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    className="verified"
                                  >
                                    Verified
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                          {restaurant &&
                          restaurantDetail &&
                          (restaurantDetail.is_paypal_accepted ||
                            restaurantDetail.is_stripe_accepted) ? (
                            <div>
                              {/* {true ? <div> */}
                              <Title level={4} className="mb-26 mt-12">
                                <div className="payment-title">Payment</div>
                                <div className="saved-payment-title">
                                  Your saved payment methods
                                </div>
                                <div
                                  md={12}
                                  style={{ float: "right" }}
                                  className="text-right"
                                >
                                  <Link
                                    to="/vendor-profile-setup?step=3"
                                    // to={
                                    //   loggedInUser.user_type === "business"
                                    //     ? "/edit-business-Profile"
                                    //     : "/editProfile"
                                    // }
                                  >
                                    <Space
                                      style={{ color: "#2f80ed" }}
                                      align={"center"}
                                      className="mr-10"
                                    >
                                      <Icon
                                        className="edit-icon"
                                        icon="edit"
                                        size="12"
                                        style={{ color: "#2f80ed" }}
                                      />
                                    </Space>
                                  </Link>
                                </div>
                              </Title>
                              {restaurantDetail.is_paypal_accepted ? (
                                <div class="payment-verified-block">
                                  <img
                                    src={require("../../../assets/images/paypal-icon.jpg")}
                                    alt="Fitness"
                                  />
                                  <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    className="verified"
                                  >
                                    Verified
                                  </Button>
                                </div>
                              ) : (
                                ""
                              )}
                              {restaurantDetail.is_stripe_accepted ? (
                                <div class="payment-verified-block">
                                  <img
                                    src={require("../../../assets/images/stripe-transparent-icon.png")}
                                    alt="Fitness"
                                  />
                                  <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    className="verified"
                                  >
                                    Verified
                                  </Button>
                                </div>
                              ) : (
                                ""
                              )}

                              {/* <Divider /> */}
                            </div>
                          ) : (
                            ""
                          )}
                          {/* {!restaurant && !merchant && (
                            <div className="pre-btn">
                              <Button
                                type="primary"
                                onClick={() => this.setState({ visible: true })}
                              >
                                Preview
                              </Button>
                            </div>
                          )}
                          {restaurant && (
                            <div className="pre-btn">
                              <Button
                                type="primary"
                                onClick={() =>
                                  this.setState({ previewRestaurant: true })
                                }
                              >
                                Preview
                              </Button>
                            </div>
                          )} */}
                        </div>
                      )}
                    </div>
                  </Card>

                  {visible && (
                    <Preview
                      visible={visible}
                      onCancel={() => this.setState({ visible: !visible })}
                    />
                  )}
                  {previewRestaurant && (
                    <PreviewRestaurant
                      visible={previewRestaurant}
                      onCancel={() =>
                        this.setState({ previewRestaurant: !previewRestaurant })
                      }
                    />
                  )}

                  <div className="btn-block text-center preview-btn-block">
                    <button className="ant-btn ant-btn-dangerous">
                      <label className="text-orange">Preview</label>
                    </button>
                  </div>
                </div>
              </div>
            </Layout>
          </Layout>
        </Layout>
      );
    } else {
      return <div></div>;
      // </div><Spin tip='Loading...' indicator={spinIcon} spinning={true} />
    }
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings, venderDetails } = store;

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    userDetailss: profile.fitnessPlan !== null ? profile.fitnessPlan : null,
    restaurantDetail:
      bookings && bookings.restaurantDetail ? bookings.restaurantDetail : "",
    uploadedFolderList: Array.isArray(venderDetails.portfolioFolderList)
      ? venderDetails.portfolioFolderList
      : [],
    uploadedBrochureList: Array.isArray(venderDetails.brochureList)
      ? venderDetails.brochureList
      : [],
    uploadedCertificationList: Array.isArray(venderDetails.certificateList)
      ? venderDetails.certificateList
      : [],
    uploadedGalleryList: Array.isArray(venderDetails.galleryList)
      ? venderDetails.galleryList
      : [],
    restaurantDetail:
      bookings && bookings.restaurantDetail ? bookings.restaurantDetail : "",
    fitnessPlan: Array.isArray(bookings.fitnessPlan)
      ? bookings.fitnessPlan
      : [],
  };
};
export default connect(mapStateToProps, {
  getUserProfile,
  enableLoading,
  viewBroucher,
  getRestaurantDetail,
  viewCertification,
  viewGallery,
  viewPortfolio,
  disableLoading,
  getRestaurantDetail,
  getTraderProfile,
  changeUserName,
  changeProfileImage,
})(MyProfile);
