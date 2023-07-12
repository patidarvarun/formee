import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Link } from "react-router-dom";
import queryString from "query-string";
import {
  Select,
  Layout,
  Card,
  Upload,
  message,
  Avatar,
  Row,
  Typography,
  Space,
  Button,
} from "antd";
import { LoadingOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import Icon from "../../../customIcons/customIcons";
import { Col } from "antd";
import { langs } from "../../../../config/localization";
import {
  getUserProfile,
  changeUserName,
  changeProfileImage,
  changeCompanyLogo,
  sendPaypalCode,
} from "../../../../actions/index";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import { DEFAULT_IMAGE_TYPE, TEMPLATE } from "../../../../config/Config";
import history from "../../../../common/History";
import { converInUpperCase } from "../../../common";
import UploadCompanyLogo from "./UploadCompanyLogo";
import ProfilePaymentMethods from "./PaymentMethods";

const { Title, Text, Paragraph } = Typography;

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stripe_cards: [],
      submitFromOutside: false,
      submitBussinessForm: false,
      imageUrl: DEFAULT_IMAGE_TYPE,
      companyLogoUrl: DEFAULT_IMAGE_TYPE,
      key: 1,
    };
  }
  formRef = React.createRef();

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { id } = this.props.loggedInUser;
    const { userDetails } = this.props;
    console.log("userDetails = " + JSON.stringify(userDetails));
    //console.log('userDetails = '+JSON.stringify(userDetails.stripe_sources));
    this.checkPaypalVerified();
    this.props.getUserProfile({ user_id: id }, (res) => {
      this.setState({
        imageUrl:
          userDetails.image !== undefined
            ? userDetails.image
            : DEFAULT_IMAGE_TYPE,
        companyLogoUrl: userDetails.company_logo
          ? userDetails.company_logo
          : DEFAULT_IMAGE_TYPE,
        stripe_cards: userDetails.stripe_sources,
      });
    });
  }

  /**
   * @method checkPaypalVerified
   * @description check paypal varification
   */
  checkPaypalVerified = () => {
    let filter = queryString.parse(this.props.location.search);
    if (filter.code !== undefined && filter.state !== undefined) {
      this.props.sendPaypalCode(
        { code: filter.code, state: filter.state },
        (res) => {
          if (res.data.success === true) {
            toastr.success(
              langs.success,
              langs.messages.paypal_verified_success
            );
          }
        }
      );
    }
    return;
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
   * @descriptionhandle handle file type
   */
  handleFileValidation = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    const isCorrectFormat =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    const isCorrectSize = info.file.size / 1024 / 1024 < 2;
    if (isCorrectSize && isCorrectFormat) {
      return true;
    }
  };
  /**
   * @method handleChange
   * @descriptionhandle handle photo change
   */
  handleChange = (info) => {
    const { id } = this.props.loggedInUser;
    if (this.handleFileValidation(info)) {
      const formData = new FormData();
      formData.append("image", info.file.originFileObj);
      formData.append("user_id", id);
      this.props.changeProfileImage(formData, (res) => {
        if (res.status === 1) {
          toastr.success(
            langs.success,
            langs.messages.profile_image_update_success
          );
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
   * @method render
   * @description render component
   */
  render() {
    const { imageUrl, loading } = this.state;
    const { userDetails, loggedInUser } = this.props;
    const { stripe_cards } = this.state;

    document.body.classList.add("user_type_" + userDetails.seller_type);
    console.log("userDetails");
   console.log(userDetails.is_paypal_verified);
    // if (userDetails.is_paypal_verified = 1) {
    //   (".paypalverified").addClass("show");                 
    // } 
  
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className="my-profile-box my-profile-box-v2 emp-my-profile-info-box ">
              <div className="card-container signup-tab my-profile-user">
                <Row className="header">
                  <Col md={12}>
                    <Title level={1}>My Profile</Title>
                  </Col>
                  <Col md={12} className="text-right">
                    <Link
                      to={
                        loggedInUser.user_type === "business"
                          ? "/edit-business-Profile"
                          : "/editProfile"
                      }
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
                </Row>
                <div className="sub-head-section">
                  <Text>All Fields Required</Text>
                </div>
                <Card className="profile-content-box classfied-profile-content-box">
                  <Row>
                    <Col md={16}>
                      <div className="upload-profile--box">
                        <div className="upload-profile-pic">
                          {imageUrl ? (
                            <Avatar size={91} src={imageUrl} />
                          ) : (
                            <Avatar size={91} icon={<UserOutlined />} />
                          )}
                        </div>
                        <div className="upload-profile-content">
                          <Title level={4}>{`${converInUpperCase(
                            userDetails.name
                          )}`}</Title>
                          <Text className="fs-10" style={{ display: "block" }}>
                            (Member since {userDetails.member_since})
                          </Text>
                          <div className="mt-20">
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
                                  <Link to="#">Upload photo</Link>
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
                      <Button className="btn-my-package">
                        <img
                          src={require("../../../../assets/images/icons/check-cricle-white.svg")}
                          alt="check"
                        />
                        Monthly Package
                      </Button>
                    </Col>
                  </Row>

                  <div className="payee-profile-info">
                    {/* <div className='info-heading'>

                      <Title level={4}>Profile Information</Title>
                    </div> */}
                    <Row>
                      {/* <Col md={12}>
                        <Text className='label'>Business Name:</Text>
                        <Paragraph className='label-value'>

                          Comming Soon
                        </Paragraph>
                      </Col> */}
                      <Col md={12}>
                        <Text className="label">Contact Name:</Text>
                        <Paragraph className="label-value">{`${converInUpperCase(
                          userDetails.name
                        )}`}</Paragraph>
                      </Col>

                      <Col md={12} className="contact-number-main">
                        <Text className="label">Contact Number:</Text>
                        <Paragraph className="label-value">
                          {userDetails.mobile_no}
                        </Paragraph>
                      </Col>
                      <Col md={12}>
                        <Text className="label">Email:</Text>
                        <Paragraph className="label-value">
                          {userDetails.email}
                        </Paragraph>
                      </Col>
                      <Col md={12}>
                        <Text className="label">Address:</Text>
                        <Paragraph className="label-value">
                          {userDetails.address}
                        </Paragraph>
                      </Col>
                    </Row>
                    {loggedInUser.role_slug === TEMPLATE.JOB && (
                      <UploadCompanyLogo />
                    )}
                  </div>

                  <ProfilePaymentMethods history={this.props.history} />
                  
                   
                </Card>
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  getUserProfile,
  changeUserName,
  changeProfileImage,
  changeCompanyLogo,
  sendPaypalCode,
})(MyProfile);
