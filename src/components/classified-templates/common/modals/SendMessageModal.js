import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  Form,
  Input,
  Typography,
  Row,
  Col,
  Button,
  Modal,
  Checkbox,
} from "antd";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../config/FormValidation";
import {
  enableLoading,
  disableLoading,
  contactAdSendMessageAPI,
  getOtherProfileData,
} from "../../../../actions";
import { langs } from "../../../../config/localization";
import { MESSAGES } from "../../../../config/Message";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { dateFormat4 } from "../../../common/index";
const { Text } = Typography;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { span: 18, offset: 3 },
  className: "align-center pt-20",
};

class SendMessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      inspection: 0,
      price: 0,
      sales: 0,
      property: 0,
      count: 1500,
      receiver: null,
    };
  }
  componentDidMount() {
    this.fetchUserDetails();
  }
  componentDidUpdate() {
    this.fetchUserDetails();
  }

  fetchUserDetails = () => {
    console.log(`this.props.receiverId`, this.props.receiverId);
    if (!this.state.receiver && this.props.receiverId) {
      this.props.getOtherProfileData(
        {
          user_id: this.props.receiverId,
        },
        (res) => {
          console.log(`user details: `, res);
          this.setState({
            receiver: res.data.data,
          });
        }
      );
    }
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    this.props.enableLoading();
    const {
      classifiedDetail,
      flag,
      loggedInDetail,
      receiverId,
      classifiedid,
      contactType,
      user_data,
    } = this.props;
    console.log(
      classifiedDetail,
      "receiverId",
      receiverId,
      classifiedid,
      user_data
    );

    const { sales, price, property, inspection } = this.state;

    if (this.props.user_data.enquire_images) {
      const requestData = {
        user_id: loggedInDetail.id,
        classifieduser_id: receiverId || user_data.customer.id,
        // classifiedid: classifiedid || user_data.id,
        enquire_id: classifiedid || user_data.id,
        massage: values.message,
        messagable_type: "Job",
      };
      if (contactType === "realstate") {
        requestData.inspection_times = flag ? 1 : inspection ? 1 : 0;
        requestData.price_guide = price ? 1 : 0;
        requestData.contract_of_sale = sales ? 1 : 0;
        requestData.similar_properties = property ? 1 : 0;
      }

      this.props.contactAdSendMessageAPI(requestData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, MESSAGES.MESSAGE_SENT_SUCCESS);
          this.props.onCancel();
        }
      });
    } else {
      const requestData = {
        user_id: loggedInDetail.id,
        classifieduser_id: receiverId || user_data.customer.id,
        // classifiedid: classifiedid || user_data.id,
        event_id: classifiedid || user_data.id,
        massage: values.message,
        messagable_type: "Job",
      };
      if (contactType === "realstate") {
        requestData.inspection_times = flag ? 1 : inspection ? 1 : 0;
        requestData.price_guide = price ? 1 : 0;
        requestData.contract_of_sale = sales ? 1 : 0;
        requestData.similar_properties = property ? 1 : 0;
      }

      this.props.contactAdSendMessageAPI(requestData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, MESSAGES.MESSAGE_SENT_SUCCESS);
          this.props.onCancel();
        }
      });
    }

    // if (contactType === "realstate") {
    //   requestData.inspection_times = flag ? 1 : inspection ? 1 : 0;
    //   requestData.price_guide = price ? 1 : 0;
    //   requestData.contract_of_sale = sales ? 1 : 0;
    //   requestData.similar_properties = property ? 1 : 0;
    // }

    // this.props.contactAdSendMessageAPI(requestData, (res) => {
    //   this.props.disableLoading();
    //   if (res.status === STATUS_CODES.OK) {
    //     toastr.success(langs.success, MESSAGES.MESSAGE_SENT_SUCCESS);
    //     this.props.onCancel();
    //   }
    // });
  };

  /**
   * @method handleInspection
   * @description handle inspection
   */
  handleInspection = (e) => {
    this.setState({ inspection: e.target.checked });
  };

  /**
   * @method handleProperty
   * @description handle property
   */
  handleProperty = (e) => {
    this.setState({ property: e.target.checked });
  };

  /**
   * @method handleSale
   * @description handle sale
   */
  handleSale = (e) => {
    this.setState({ sales: e.target.checked });
  };

  /**
   * @method handlePrice
   * @description handle price
   */
  handlePrice = (e) => {
    this.setState({ price: e.target.checked });
  };

  /**
   * @method handleTextAreaChange
   * @description handle text area change
   */
  handleTextAreaChange = ({ target: { value } }) => {
    let count = "";
    if (value.length <= 1500) {
      count = 1500 - value.length;
    } else {
      count = 0;
    }
    this.setState({ message: value, count: count });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      flag,
      visible,
      classifiedDetail,
      userDetails,
      contactType,
      user_data,
    } = this.props;
    const { receiver } = this.state;

    const { inspection, count } = this.state;
    return (
      <Modal
        title={contactType === "realstate" ? "Send Enquiry" : "Message to"}
        visible={visible}
        className={
          "custom-modal style1 custom-modal-contactmodal-style send-message-popup"
        }
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className="padding">
          <Row className="mb-35">
            <Col md={13}>
              {contactType === "realstate" ? (
                <Text className="fs-18">{classifiedDetail.location}</Text>
              ) : (
                // <Text className="fs-18">
                //   To:
                //   {this.props.loggedInDetail.user_type === "handyman"
                //     ? (receiver && receiver.name) || vendor_data.customer.email
                //     : this.props.loggedInDetail.user_type === "wellbeing"
                //     ? ""
                //     : // vendor_data.customer.name || vendor_data[0].customer.name
                //       ""}
                // </Text>
                ""
              )}
            </Col>
          </Row>

          <Form {...layout} onFinish={this.onFinish}>
            <Row>
              <Col md={3} className="user-thumb-wrapper">
                <div className="user-thumb">
                  <img src={this.props.image} alt="" />
                </div>
              </Col>
              <Col md={21}>
                <Form.Item name="name">
                  {/* <Input
                    disabled
                    className="shadow-input username"
                    defaultValue={userDetails.name}
                  /> */}
                  <label className="username">{this.props.name}</label>
                </Form.Item>
                {contactType !== "realstate" && (
                  <Col md={24}>
                    <Text className="text-gray">
                      {" "}
                      {`Member since ${
                        userDetails.member_since ? userDetails.member_since : ""
                      }`}
                    </Text>
                  </Col>
                )}
              </Col>
            </Row>

            {contactType !== undefined && contactType === "realstate" && (
              <Row>
                <Col span={6}></Col>
                <Col span={24}>
                  <Text className="strong">
                    Please send me more information regarding
                  </Text>
                  <Row gutter={[10, 10]} className="mt-6 mb-35">
                    <Col span={12}>
                      <Checkbox
                        checked={flag ? true : inspection ? true : false}
                        onChange={this.handleInspection}
                      >
                        Inspection times
                      </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox onChange={this.handleSale}>
                        Contract of sale
                      </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox onChange={this.handlePrice}>
                        Price guide
                      </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox onChange={this.handleProperty}>
                        Similar properties
                      </Checkbox>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
            <Form.Item
              // label={
              //   <label for="message" class="ant-form-item-no-colon">
              //     Body of message (1500)
              //     <br />
              //     <span className="less-count-red">{count}</span> characters
              //     remaining
              //   </label>
              // }
              name="message"
              className="custom-astrix"
              rules={[required(""), whiteSpace("Message"), maxLengthC(1500)]}
            >
              <TextArea
                rows={9}
                className="shadow-input"
                onChange={this.handleTextAreaChange}
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
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    authToken: auth.isLoggedIn ? auth.loggedInUser.token : "",
  };
};

export default connect(mapStateToProps, {
  contactAdSendMessageAPI,
  enableLoading,
  disableLoading,
  getOtherProfileData,
})(SendMessageModal);
