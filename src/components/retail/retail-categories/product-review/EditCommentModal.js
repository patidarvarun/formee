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
import { updateReplyRatingVendor } from "../../../../actions";
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

class EditCommentModal extends React.Component {
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
    const { selectedReview, loggedInDetail,commentData } = this.props;
    console.log("values", values);
    console.log("selectedReview", selectedReview);

    let requestData = {
      rating_id: selectedReview.id,
      booking_replay_rating_id: commentData.id,
      vendor_id: loggedInDetail.id,
      reason: values.reason,
    };
    this.props.updateReplyRatingVendor(requestData, (res) => {
      console.log(res.status, "res: ", res);
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, res.data.msg);
        this.props.onCancel();
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { selectedReview, visible, commentData } = this.props;
 
    return (
      <Modal
        title="Edit your comment"
        visible={visible}
        className={"custom-modal style1 reply-to-popup"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className="padding">
          <Rate disabled value={selectedReview.rating} />
          <Row className="mb-15">
            <Col md={20}>
              <div className="reviews-content-left">
                <div className="reviews-content-avatar">
                  <Avatar
                    src={
                      selectedReview &&
                      selectedReview.rated_by &&
                      selectedReview.rated_by.image_thumbnail ? (
                        selectedReview.rated_by.image_thumbnail
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
                    {selectedReview.rated_by &&
                      converInUpperCase(selectedReview.rated_by.name)}
                  </Title>
                  <p>
                    <Paragraph>
                      {selectedReview && selectedReview.review}
                    </Paragraph>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
          <div className="posted-date">
            <p>Posted Date : {commentData.created_at}</p>
          </div>
          <Form {...layout} name="basic" onFinish={this.onFinish}>
            <Form.Item
              name="reason"
              rules={[required(""), whiteSpace("Reason"), maxLengthC(300)]}
              className="custom-astrix"
            >
                <TextArea rows={4} placeholder={commentData.reason} className="shadow-input" />
             
                {/* value={commentData.reason} */}
              {/* {commentData.reason} */}
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="default" htmlType="submit">
                Update
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
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, { updateReplyRatingVendor })(
  EditCommentModal
);
