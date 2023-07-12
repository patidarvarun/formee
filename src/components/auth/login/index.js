import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import {
  login,
  forgotPassword,
  closeLoginModel,
  openForgotModel,
  closeForgotModel,
  registerSocialUserAPI,
  getProfileData,
  fetchMasterDataAPI,
  getUserMenuData,
  enableLoading,
  disableLoading,
  getTraderProfile,
  getTraderProfileData,
  getRestaurantDetail,
} from "../../../actions/index";
import { Typography, Row, Col, Form, Input, Button, Modal, Space } from "antd";
import Icon from "../../customIcons/customIcons";
import { langs } from "../../../config/localization";
import {
  FACEBOOK_APP_ID,
  GOOGLE_CLIENT_ID,
  DEFAULT_DEVICE_ID,
  DEFAULT_DEVICE_TYPE,
  DEFAULT_MODEL,
} from "../../../config/Config";
import { setLocalStorage } from "../../../common/Methods";
import { required, email } from "../../../config/FormValidation";
import "../../header/header.less";
import SocialButton from "./SocialLoginButton";
import { STATUS_CODES } from "../../../config/StatusCode";

const { Text } = Typography;

class Login extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isForgotPassword: false,
      isRedirect: false,
      redirectToDashBoard: false,
      defaultRedirect: false,
      redirectToProfileSetup: false,
    };
  }

  /**
   * @method componentDidMount
   * @description call after mount the component
   */
  componentDidMount() {
    this.props.history.listen((location, action) => {
      this.props.closeLoginModel();
    });
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    const { login } = this.props;
    this.props.enableLoading();
    login(values, (res) => {
      //Login Error
      if (res === undefined || res.status === undefined) {
        this.props.disableLoading();
        return;
      }

      //Login Success
      if (res.status === 200) {
        this.props.enableLoading();
        const { fetchMasterDataAPI, getProfileData, getUserMenuData } =
          this.props;
        let loginResponce = res;
        fetchMasterDataAPI({ timeinterval: 0 }, (res) => {});
        toastr.success(langs.success, langs.messages.login_success);
        const data = res.data && res.data.data;

        // Guest user && Intermediate step
        if (data.user_type === langs.key.private && data.menu_skipped === 0) {
          this.props.disableLoading();
          this.setState({ isRedirect: true });
          this.props.history.push("/intermediate");
        } //bussiness User
        else if (data.user_type !== langs.key.private) {
          //If it is Restaurant vender
          if (data.user_type === langs.key.restaurant) {
            this.props.history.push("/dashboard");
            this.props.getRestaurantDetail(data.id, "", (res) => {
              this.props.disableLoading();
              if (res.status === 200) {
                this.props.getTraderProfileData(data, (r) => {
                });
              }
            });
          } //Otherwise
          else {
            this.props.getTraderProfileData(data, (r) => {

              this.props.disableLoading();
              if (loginResponce.data.data.profile_completed === 0) {
                this.props.history.push("/");
              } else {
                this.props.history.push("/");
              }
            });
          }
        } else {
          // dashboard Redirection
          this.props.disableLoading();
          this.setState({ defaultRedirect: true });
        }
        getProfileData(data.token, { user_id: data.id }, (res) => {});
        getUserMenuData(data.token);
      }
    });
  };

  /**
   * @method onFinishFailed
   * @description handle on submit failed
   */
  onFinishFailed = (errorInfo) => {};

  /**
   * @method handleSocialLogin
   * @description handle social login
   */
  handleSocialLogin = (user) => {
    const { registerSocialUserAPI, onCancel } = this.props;
    const { _provider, _profile } = user;
    const { name, email, id, profilePicURL } = _profile;
    let reqBody = {
      name,
      email,
      social_id: id,
      avatar: profilePicURL,
      login_type: _provider,
      device_type: DEFAULT_DEVICE_TYPE,
      device_id: DEFAULT_DEVICE_ID,
      device_model: DEFAULT_MODEL,
      network_provider: "",
      os_version: "",
      app_version_no: "",
      password: "",
    };
    registerSocialUserAPI(reqBody, (res) => {
      if (res === undefined || res.status === undefined) return;
      if (res.status === 200) {
        const { fetchMasterDataAPI, getProfileData, getUserMenuData } =
          this.props;
        toastr.success(langs.success, langs.messages.login_success);
        setLocalStorage(res.data);
        const data = res.data && res.data.data;
        if (data.user_type === langs.key.private && data.menu_skipped === 0) {
          this.setState({ isRedirect: true });
        } else if (data.user_type !== langs.key.private) {
          this.setState({ redirectToDashBoard: true, isRedirect: false });
        } else {
          this.setState({ defaultRedirect: true });
        }
        fetchMasterDataAPI({ timeinterval: 0 }, (res) => {});
        getProfileData(data.token, { user_id: data.id }, (res) => {});
        getUserMenuData(data.token);
        // onCancel()
      }
    });
  };

  /**
   * @method handleSocialLoginFailure
   * @description handle social login failed
   */
  handleSocialLoginFailure = (err) => {};

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      isForgotPassword,
      isRedirect,
      redirectToDashBoard,
      defaultRedirect,
      redirectToProfileSetup,
    } = this.state;
    const { isLoggedIn, isOpenForgotModel } = this.props;

    return (
      <Modal
        title={
          !isOpenForgotModel
            ? "Please login to access these features"
            : "Forgot Password"
        }
        visible={!this.props.isLoggedIn && this.props.visible}
        className={"login-modal login-modal-v2"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        {!isOpenForgotModel ? (
          <React.Fragment>
            <Form onFinish={this.onFinish} layout="vertical" ref={this.formRef}>
              <Form.Item
                label="Email"
                name={"email"}
                onChange={({ target }) => {
                  this.formRef.current.setFieldsValue({
                    [target.id]: target.value.trim(),
                  });
                }}
                rules={[required("Email id"), email]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                className="mb-15"
                name={"password"}
                onChange={({ target }) => {
                  this.formRef.current.setFieldsValue({
                    [target.id]: target.value.trim(),
                  });
                }}
                rules={[required("Password")]}
              >
                <Input.Password />
              </Form.Item>
              <Row>
                <Col md={12}>
                  <p
                    className="fs-9 fm-fr-text align-left"
                    onClick={() => {
                      this.props.openForgotModel();
                      //   this.setState({ isForgotPassword: true })
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Forgot Your Password?
                  </p>
                </Col>
                <Col md={12}>
                  <Form.Item className="align-right">
                    <Button
                      type="primary"
                      htmlType="submit"
                      danger
                      className="btn-login"
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className="or-hr-line">
              <p>Or</p>
            </div>
            <Row justify="center" className="social-signup-btm">
              <Col md={24} className="social-signup-btm-left">
                <div>
                  {/* <p className="pb-15">or use facebook / google</p> */}
                  <Space size={"middle"}>
                    <SocialButton
                      provider="facebook"
                      appId={FACEBOOK_APP_ID}
                      onLoginSuccess={this.handleSocialLogin}
                      onLoginFailure={this.handleSocialLoginFailure}
                      className="facebook-btn"
                    >
                      {/* Login with Facebook */}
                      <div className="">
                        <Icon icon="facebook" size="20" />
                        <Text>Log in with Facebook</Text>
                      </div>
                    </SocialButton>
                    <SocialButton
                      provider="google"
                      clientid={GOOGLE_CLIENT_ID}
                      onLoginSuccess={this.handleSocialLogin}
                      onLoginFailure={this.handleSocialLoginFailure}
                      className="google-btn"
                      size={"large"}
                    >
                      <Icon icon="google-plus" size="20" />
                      <Text>Log in with Google</Text>
                    </SocialButton>
                  </Space>
                </div>
              </Col>
              <Col md={9} className="social-signup-btm-right">
                <div>
                  <p className="pb-15 pt-45">Don’t have an account?</p>
                  <Link
                    className="ant-btn ant-btn-ghost ant-btn-round ant-btn-lg"
                    to="/signup"
                    onClick={this.props.onCancel}
                  >
                    Sign Up
                  </Link>
                </div>
              </Col>
            </Row>
            <div className="align-center pt-40">
              <Text className="fs-10 inline-block fm-signin-textbtm">
                By Signing up or logging in, you agree to our <br />
                terms & conditions and privacy policy.
              </Text>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="frgt-sub-title">
              Enter your email and we'll send you a link to get back into your
              account.
            </p>
            <Form
              onFinish={(value) => {
                this.props.enableLoading();
                this.props.forgotPassword(value, (res) => {
                  this.props.disableLoading();
                  if (res.status === STATUS_CODES.OK && res.data.status === 1) {
                    this.props.closeLoginModel();
                    this.props.closeForgotModel();
                    toastr.success(langs.success, res.data.message);
                  }
                });
              }}
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name={"email"}
                rules={[required("Email id"), email]}
                // onChange={({ target }) => {
                //   this.formRef.current.setFieldsValue({
                //    email: target.value.trim(),
                //   });
                // }}
              >
                <Input />
              </Form.Item>
              <Form.Item className="align-center mt-20">
                <Button
                  type="primary"
                  htmlType="submit"
                  danger
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    height: "30px",
                  }}
                >
                  Send Login Link
                </Button>
              </Form.Item>

              {/* <Col span={8} className="social-signup-btm-right"> */}
              <div className="or-hr-line">
                <p>Or</p>
              </div>
              <div>
                <Link
                  className="ant-btn create-new-acc ant-btn-ghost ant-btn-round ant-btn-lg"
                  to="/signup"
                  onClick={this.props.onCancel}
                >
                  Create new Account
                </Link>
              </div>
              {/* </Col> */}
            </Form>
          </React.Fragment>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, common } = store;

  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    isOpenForgotModel: common.isOpenForgotModel,
  };
};

//  Connect with redux through connect methode
export default Login = connect(mapStateToProps, {
  login,
  forgotPassword,
  closeLoginModel,
  openForgotModel,
  closeForgotModel,
  registerSocialUserAPI,
  getProfileData,
  fetchMasterDataAPI,
  getTraderProfileData,
  getRestaurantDetail,
  getUserMenuData,
  enableLoading,
  disableLoading,
})(withRouter(Login));
