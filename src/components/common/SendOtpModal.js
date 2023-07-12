import React from "react";
import { connect } from "react-redux";
import OtpInput from "react-otp-input";
import { Form, Input, Typography, Button, Modal } from "antd";
import { required } from "../../config/FormValidation";
import { verifyOtp, changeMobNo, sendOtp } from "../../actions";
import { langs } from "../../config/localization";
import { MESSAGES } from "../../config/Message";
import { toastr } from "react-redux-toastr";
const { Text } = Typography;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { md: 24 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { md: 24 },
  className: "align-center pt-22",
};

class SendOtpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      otpNumber: "",
      time: 0
    };
    this.timer = 0
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    console.log('nextprops.retryIn: ', nextprops.retryIn);
    if (this.state.time !== nextprops.retryIn) {
      console.log('nextprops.retryIn: Inner ', nextprops.retryIn);

      this.startTimer(nextprops.retryIn)
    }
  }


  componentDidMount() {
    this.startTimer(this.props.retryIn)

  }

  startTimer = (retryIn) => {
    this.setState({ time: retryIn ? Number(retryIn) : 0 }, () => {
      this.timings = setInterval(() => {
        let leftTime = this.state.time
        console.log(retryIn, 'leftTime: ', leftTime);
        if (leftTime > 0) {

          leftTime = leftTime - 1
          this.setState({ time: leftTime })
        } else {
          console.log('Close Time');
          clearInterval(this.timings);
        }
      }, 1000);
    })
  }
  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    const { currentField, phonecode, mobileNo } = this.props;
    const { otpNumber } = this.state;
    if (otpNumber) {
      const reqData = {
        mobileNo: `${phonecode}${mobileNo}`,
        code: otpNumber,
      };
      this.props.verifyOtp(reqData, (res) => {
        //  this.props.onCancel();
        //   this.props.callNext(true);
        console.log(res, "res verify ", res);
        if (res.data !== undefined && res.data.status === 1) {
          const reqData = {
            user_id: this.props.userDetails.id,
            phonecode,
            mobileno: currentField.mobile_no ? currentField.mobile_no : this.props.userDetails.mobile_no,
          };
          this.props.changeMobNo(reqData, (res) => {
            if (res.status === 200) {
              this.props.callNext(true);
              toastr.success(langs.success, MESSAGES.NUMBER_VARIFY_SUCCESS);
              this.props.getUserDetails()
              this.props.onCancel();
            }
          });
          // }
          // else if(res.data && res.data.status === 'ERROR'){
          //   toastr.error(langs.error, res.data.message)
        }
      });
    } else {
      toastr.warning("Please enter otp");
    }
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  resendOtp = () => {
    this.props.resendOtp()
  };

  handleOtpChange = (otp) => {
    console.log("otp >>>>>", otp);
    this.setState({ otpNumber: otp });
  };


  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, mobileNo, retryIn } = this.props;
    console.log('retryIn: ', retryIn);
    const { time } = this.state
    return (
      <Modal
        title="Phone Verification"
        visible={visible}
        className={"custom-modal style1 enterSend-otp-number"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <Form {...layout} name="basic" onFinish={this.onFinish}>
          <h5 className="sub-title">
            We sent a code to <span>{mobileNo}</span>
          </h5>
          <h4>Enter code recieved</h4>
          <Form.Item
            name="code"
            className="otp-input-container"
            rules={[required("OTP")]}
          >
            <OtpInput
              onChange={
                (otp) => {
                  console.log("otp", otp);
                  // this.setState({otpNumber: otp})
                  this.handleOtpChange(otp);
                }
                // className="test1"
              }
              numInputs={4}
              separator={<span>-</span>}
            />
            {/* </div>*/}
          </Form.Item>

          <Form.Item {...tailLayout}>
            {time > 0 ? `You Can Re-send Otp after ${time} sec` : <Button
              type="default"
              htmlType="button"
              onClick={this.resendOtp}
              className="resend-otp"
            >
              Resend Code {" "}
            </Button>}
            <Button type="default" htmlType="submit" className="btn-blue">
              VERIFY{" "}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};

export default connect(mapStateToProps, { verifyOtp, changeMobNo, sendOtp })(
  SendOtpModal
);
