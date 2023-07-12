import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import {
  resetPassword,
  enableLoading,
  disableLoading,
} from "../../actions/index";
import { Typography, Row, Col, Form, Input, Button, Modal, Space } from "antd";
import { langs } from "../../config/localization";
import {
  minLength,
  newPassword,
  confirmPassword,
} from "../../config/FormValidation";

import { setLocalStorage } from "../../common/Methods";
import { required, email } from "../../config/FormValidation";
import "../header/header.less";
import { STATUS_CODES } from "../../config/StatusCode";
import { CheckCircleOutlined } from "@ant-design/icons";

class ResetPasswordModal extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isForgotPassword: false,
      isRedirect: false,
      redirectToDashBoard: false,
      defaultRedirect: false,
      redirectToProfileSetup: false,
      openSuccessContent: false,
    };
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    this.props.enableLoading();
    let reqData = {
      token: this.props.token,
      password: values.new_password,
      password_confirmation: values.confirm_password,
    };
    this.props.resetPassword(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK && res.data.status === 1) {
        // this.props.history.push("/");
        this.setState({ openSuccessContent: true });
        toastr.success(langs.success, res.data.message);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { openSuccessContent } = this.state;

    return (
      <Modal
        title={!openSuccessContent ? "Reset Password" : ''}
        visible={!this.props.isLoggedIn && this.props.visible}
        className={"login-modal login-modal-v2"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        {!openSuccessContent ? (
          <React.Fragment>
            <p className="frgt-sub-title">Please enter your new password.</p>
            <Form onFinish={this.onFinish} layout="vertical">
              <Form.Item
                label="New Password"
                name="new_password"
                rules={[newPassword, minLength(8)]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm New Password"
                name="confirm_password"
                dependencies={["new_password"]}
                hasFeedback
                rules={[
                  confirmPassword,
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        langs.validation_messages.newConfirmPassword
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item className="align-center mt-20">
                <Button
                  type="primary"
                  htmlType="submit"
                  danger
                  style={{ marginTop: "5px", height: "30px" }}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="passSuccesBox">
              <CheckCircleOutlined />
              <h3>Success!</h3>
              <p>Your password has successfully been reset.</p>
            </div>
            <Button
              type="primary"
              // htmlType="submit"
              danger
              style={{ height: "30px", margin: "5px auto 0" }}
              onClick={() => {
                this.props.openLoginAction();
              }}
            >
              Login
            </Button>
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
export default ResetPasswordModal = connect(mapStateToProps, {
  resetPassword,
  enableLoading,
  disableLoading,
})(withRouter(ResetPasswordModal));
