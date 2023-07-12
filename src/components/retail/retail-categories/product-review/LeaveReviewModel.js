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
  Radio,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../config/FormValidation";
import { langs } from "../../../../config/localization";
import {
  editRetailReview,
  addRetailReview,
  addReveiw,
  editBookingReview,
} from "../../../../actions";
import { BASE_URL } from "../../../../config/Config";
import { MESSAGES } from "../../../../config/Message";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { capitalizeFirstLetter, dateFormat4 } from "../../../common";
import moment from "moment";
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 16 },
  className: "align-center pt-20",
};

class LeaveReviewModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  /**
   * @method handleRatingChange
   * @description handle rating selection
   */
  handleRatingChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    const { classifiedDetail, loggedInDetail, is_retail, selectedReview } =
      this.props;
      console.log(selectedReview,"selectedReview")
      console.log(selectedReview.id,"selectedReview.id")
      console.log(classifiedDetail.id,"classifiedDetail.id")
    if (selectedReview) {
      if(selectedReview.rating_type === "retail_rating"){
      const requestData = {
        review_id: selectedReview.id,
        review: values.review,
        rating: values.rating,
        title: values.title,
      };
      this.props.editRetailReview(requestData, (res) => {
        if (res.status === STATUS_CODES.OK) {
          this.props.callNext();
          toastr.success(langs.success, MESSAGES.REVIEW_UPDATE_SUCCESS);
          this.props.onCancel();
        }
      });
    }else if(selectedReview.rating_type === "trader_rating"){
      console.log(selectedReview.id,"selectedReview.id")
      const requestData = {
        rating_id: selectedReview.id,
        review: values.review,
        rating: values.rating,
        title: values.title,
      };
      this.props.editBookingReview(requestData, (res) => {
        if (res.status === STATUS_CODES.OK) {
          this.props.callNext();
          toastr.success(langs.success, MESSAGES.REVIEW_UPDATE_SUCCESS);
          this.props.onCancel();
        }
      });
    }

    } else {
      const requestData = {
        classified_id: classifiedDetail.id,
        user_id: loggedInDetail.id,
        review: values.review,
        rating: values.rating,
        title: values.title,
      };
      if (is_retail) {
        this.props.addRetailReview(requestData, (res) => {
          if (res.status === STATUS_CODES.OK) {
            this.props.callNext();
            toastr.success(langs.success, MESSAGES.REVIEW_ADD_SUCCESS);
            this.props.onCancel();
          }
        });
      }
    }
  };

  /**
   * @method getInitialValue
   * @description get initial values
   */
  getInitialValue = () => {
    let data = this.props.selectedReview;
    if (data) {
      let temp = {
        title: data.title,
        review: data.review,
        rating: data.rating,
      };
      return temp;
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, classifiedDetail, selectedReview, loggedInUser, loggedInDetail} = this.props;
    console.log(selectedReview,"selectedReview")
    console.log(classifiedDetail,"classifiedDetail")
    const { value } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    const { id } = this.props.loggedInDetail;
    // console.log(selectedReview.creater_name,"users")
   
    return (
      <Modal
        title={selectedReview ? "Edit a review" : "Product Review"}
        visible={visible}
        className={"custom-modal style1 leave-review-style1"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className="padding">
          <Row className="mb-15">
            <Col md={20}>
              <div className="reviews-content-left">
                <div className="reviews-content-avatar">
                  <Avatar
                                    src={selectedReview.image 
                                         ? BASE_URL+"/upload_images/users/"+id+"/"+selectedReview.image
                                         : 
                                        <Avatar size={53} icon={<UserOutlined />} />}
                                        size={53}
                                        className=''
                                        />
                                     
                </div>
                <div className="productname">
                  <h2>{selectedReview.product_name } </h2>
                  <div className="reviews-content-avatar-detail">
                   Posted By:{capitalizeFirstLetter(selectedReview.creater_name)}
                  <p>
                    <Paragraph>
                      {selectedReview.creater_date &&
                                            `Member Since ${moment(selectedReview.creater_date).format("MMMM YYYY")}`}
                    </Paragraph>
                  </p>
                </div>
                </div>
                
              </div>
            </Col>
          </Row>
          <Form
            {...layout}
            name="basic"
            onFinish={this.onFinish}
            initialValues={this.getInitialValue()}
          >
            <Form.Item
              label={"Title"}
              name="title"
              rules={[required(""), whiteSpace("Review")]}
              className="custom-astrix"
            >
              <Input rows={5} placeholder={"..."} className="shadow-input" />
            </Form.Item>
            <Form.Item
              // label='Body of message (1500) characters remaining'
              label={"Comment"}
              name="review"
              rules={[required(""), whiteSpace("Review"), maxLengthC(300)]}
              className="custom-astrix"
            >
              <TextArea
                rows={4}
                placeholder={"Write comments here..."}
                className="shadow-input"
              />
            </Form.Item>
            <Form.Item
              label="Select your rating"
              name="rating"
              rules={[required("")]}
            >
              <Radio.Group onChange={this.handleRatingChange} value={value}>
                <Radio style={radioStyle} value={5}>
                  <Rate disabled defaultValue={5} />{" "}
                  <span className="rating-dgt-txt">5 Excelent</span>
                </Radio>
                <Radio style={radioStyle} value={4}>
                  <Rate disabled defaultValue={4} />{" "}
                  <span className="rating-dgt-txt">4 Very Good</span>
                </Radio>
                <Radio style={radioStyle} value={3}>
                  <Rate disabled defaultValue={3} />{" "}
                  <span className="rating-dgt-txt">3 Average</span>
                </Radio>
                <Radio style={radioStyle} value={2}>
                  <Rate disabled defaultValue={2} />{" "}
                  <span className="rating-dgt-txt">2 Very Poor</span>
                </Radio>
                <Radio style={radioStyle} value={1}>
                  <Rate disabled defaultValue={1} />{" "}
                  <span className="rating-dgt-txt">1 Terrible</span>
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="default" htmlType="submit">
                {selectedReview ? "Update" : "Send"}
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

export default connect(mapStateToProps, {
  editRetailReview,
  addReveiw,
  addRetailReview,
  editBookingReview,
})(LeaveReviewModel);
