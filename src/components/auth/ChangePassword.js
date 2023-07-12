import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Link } from "react-router-dom";
import {
  Alert,
  Form,
  Input,
  Typography,
  Button,
  Layout,
  Card,
  Row,
  Col,
} from "antd";
import AppSidebar from "../dashboard-sidebar/DashboardSidebar";
import { ChangePasswordAPI, logout } from "../../actions/index";
import { STATUS_CODES } from "../../config/StatusCode";
import { MESSAGES } from "../../config/Message";
import { langs } from "../../config/localization";
import {
  required,
  email,
  password,
  minLength,
  newPassword,
  confirmPassword,
} from "../../config/FormValidation";
import history from "../../common/History";
const { Title } = Typography;

class ChangePassword extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false,
      isSubmitted: false,
    };
  }

  /**
   * @method Logout User
   * @description Logout the user & clear the Session
   */
  logout = () => {
    this.props.logout();
  };

  /**
   * @method onFinish
   * @description called to submit form
   */
  onFinish = (values) => {
    const { loggedInDetail } = this.props;
    const requestData = {
      user_id: loggedInDetail.id,
      current_password: values.current_password,
      new_password: values.new_password,
    };
    values.user_id = loggedInDetail.id;
    this.props.ChangePasswordAPI(requestData, (res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.CHANGE_PASSWORD_SUCCESS);
        // window.location.assign('/')
        // this.logout();
        this.setState({ isSubmitted: true });
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isSubmitted } = this.state;
    const { isPrivateUser, loggedInUser, userDetails } = this.props;
    let path = "/myProfile";
    if (!isPrivateUser) {
      if (
        loggedInUser.user_type === "business" &&
        loggedInUser.role_slug !== langs.key.merchant
      ) {
        path = "/business-profile";
      } else {
        path = "/vendor-profile";
      }
    }
    return (
      <Layout>
        <Layout className="change-pass-box-outer">
          <AppSidebar history={history} />
          <Layout style={{ overflowX: "visible" }}>
            <div className="my-profile-box change-pass-box">
              <div className="card-container signup-tab">
                <div className="steps-content align-left mt-0">
                  <div className="top-head-section-v2">
                    <Title level={2}>Change Password</Title>
                  </div>
                  {isSubmitted ? (
                    <div className="chapass-success-msg">
                      <Alert
                        message="Password has been changed."
                        description="                                    "
                        type="success"
                        showIcon
                      />
                      <br />
                      <Link to={path}>
                        <Button type="primary" htmlType="button" danger>
                          Back to my profile
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Form
                      layout="vertical"
                      onFinish={this.onFinish}
                      ref={this.formRef}
                      initialValues={{
                        email: userDetails && userDetails.email,
                      }}
                    >
                      <Card className="profile-content-box">
                        <Row>
                          <Col md={18}>
                            <Form.Item
                              label="Email"
                              name={"email"}
                              className="email-input"
                              onChange={({ target }) => {
                                this.formRef.current.setFieldsValue({
                                  [target.id]: target.value.trim(),
                                });
                              }}
                              rules={[required("Email"), email]}
                              hasFeedback
                            >
                              <Input
                                value={userDetails && userDetails.email}
                                disabled
                              />
                              <span class="email-icon ant-form-item-children-icon"><span role="img" aria-label="check-circle" class="anticon anticon-check-circle"><svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></span></span>
                            </Form.Item>
                            <Form.Item
                              label="Current Password"
                              name="current_password"
                              rules={[password, minLength(8)]}
                              hasFeedback
                            >
                              <Input.Password
                                placeholder={"Type your current password "}
                              />
                            </Form.Item>
                            <Form.Item
                              label="New Password"
                              name="new_password"
                              rules={[newPassword, minLength(8)]}
                              hasFeedback
                            >
                              <Input.Password
                                placeholder={"Type your new password"}
                              />
                            </Form.Item>
                            <Form.Item
                              label="Confirm Password"
                              name="confirm_password"
                              dependencies={["new_password"]}
                              hasFeedback
                              rules={[
                                confirmPassword,
                                ({ getFieldValue }) => ({
                                  validator(rule, value) {
                                    if (
                                      !value ||
                                      getFieldValue("new_password") === value
                                    ) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      langs.validation_messages
                                        .newConfirmPassword
                                    );
                                  },
                                }),
                              ]}
                            >
                              <Input.Password
                                placeholder={"Confirm your new password"}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                      <Row className="chap-footer-action">
                        <Col lg={12}>
                          <Button type="default" onClick={() => history.goBack()} htmlType={"button"}>
                            Cancel
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="btn-orange btn-purple"
                          >
                            Change my password
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
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
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
    isPrivateUser: auth.isLoggedIn
      ? auth.loggedInUser.user_type === langs.key.private
      : false,
  };
};

export default connect(mapStateToProps, { ChangePasswordAPI, logout })(
  ChangePassword
);
