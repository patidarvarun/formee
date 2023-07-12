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
  Rate,
  Modal,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../config/FormValidation";
import { langs } from "../../../../config/localization";
import { replyFeedbackAPI, replyVendorReview } from "../../../../actions";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { converInUpperCase } from "../../../common";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: "align-center pt-20",
};

class ReplyReviewModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      accurate: 0,
      communication: 0,
      reasonable: 0,
      postage: 0,
    };
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    const { selectedReview, loggedInDetail, is_feedback } = this.props;
    console.log("values", values);
    if (is_feedback) {
      let requestData = {
        retail_feedback_id: selectedReview.id,
        vendor_id: loggedInDetail.id,
        reason: values.reason,
      };
      this.props.replyFeedbackAPI(requestData, (res) => {
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, res.data.msg);
          this.props.callNext()
          this.props.onCancel();
        }
      });
    } else {
      let requestData = {
        retail_review_id: selectedReview.id,
        vendor_id: loggedInDetail.id,
        reason: values.reason,
      };
      this.props.replyVendorReview(requestData, (res) => {
        console.log(res.status, "res: ", res);
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, res.data.msg);
          this.props.onCancel();
        }
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedReview,
      visible,
      user_image,
      user_name,
      user_comment,
      user_rating,
    } = this.props;
    return (
      <Modal
        title="Reply To"
        visible={visible}
        className={"custom-modal style1 retail-vendor-replyto-style1 "}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className="padding">
          <Rate disabled value={user_rating} />
          <Row className="mb-15">
            <Col md={20}>
              <div className="reviews-content-left">
                <div className="reviews-content-avatar">
                  <Avatar
                    src={
                      user_image ? (
                        user_image
                      ) : (
                        <Avatar size={53} icon={<UserOutlined />} />
                      )
                    }
                    size={53}
                    className=""
                  />
                </div>
                <div className="reviews-content-avatar-detail">
                  <Title level={4}>
                    {user_name && converInUpperCase(user_name)}
                  </Title>
                  <p>
                    <Paragraph>{user_comment}</Paragraph>
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <Form {...layout} name="basic" onFinish={this.onFinish}>
            <Form.Item
              name="reason"
              rules={[required(""), whiteSpace("Reason"), maxLengthC(300)]}
              className="custom-astrix"
            >
              <TextArea rows={6} placeholder={"..."} className="shadow-input" />
            </Form.Item>
            <div className="btn-block">
              <Button type="default" htmlType="submit">
                Send
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, {
  replyFeedbackAPI,
  replyVendorReview,
})(ReplyReviewModel);
