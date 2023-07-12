import React from "react";
import { connect } from "react-redux";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import {
  Button,
  Card,
  Layout,
  Typography,
  List,
  Row,
  Col,
  Rate,
  Input,
  Select,
} from "antd";
import {
  enableLoading,
  disableLoading,
  sellerFeedbackListAPI,
  voteRetailFeedback,
} from "../../../../actions";
import {
  DislikeOutlined,
  SearchOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { displayDateTimeFormate, roundToTwo } from "../../../common";
import ReportFeedback from "./ReportReview";
import ReplyToReviewModel from "./ReplyReviewModel";
const { Title } = Typography;
const { Option } = Select;

class SellerFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLabel: "All Feedback",
      reviewData: [],
      report_review: false,
      selectedFeedback: "",
      filter: "",
      feedbacks_avg: "",
      replayReview: false,
      avg_rating: "",
    };
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getFeedbackListing();
  }

  /**
   * @method getFeedbackListing
   * @description get feedback listing of seller
   */
  getFeedbackListing = (filter) => {
    console.log(filter + "<----------------filter");
    const { loggedInDetail } = this.props;
    const reqData = {
      vendor_id: loggedInDetail.id,
      filter: filter,
    };
    this.props.sellerFeedbackListAPI(reqData, (res) => {
      this.props.disableLoading();
      let temp = res.data;
     // console.log("temp", temp.data);
     // console.log("currentpage", temp.current_page);
      let feedback =
        temp.data && Array.isArray(temp.data.data) && temp.data.data.length
          ? temp.data.data
          : [];
      if (res.status === 200) {
        this.setState({
          reviewData: feedback,
          filter: filter,
          feedbacks_avg: temp.feedbacks_avg,
        });
      }
    });
  };

  /**
   * @method contactModal
   * @description contact model
   */
  handleReportReview = (item) => {
    this.setState({ report_review: true, selectedFeedback: item });
  };

  /**
   * @method handleReplyReview
   * @description handle reply review
   */
  handleReplyReview = (item) => {
    let avg_rating =
      (Number(item.accurate_description) +
        Number(item.communication) +
        Number(item.postage_speed) +
        Number(item.reasonable_postage_costs)) /
      4;
    this.setState({
      replayReview: true,
      selectedFeedback: item,
      avg_rating: avg_rating,
    });
  };

  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = () => {
    this.setState({
      replayReview: false,
      report_review: false,
    });
  };

  /**
   * @method handleRatingChange
   * @description handle rating change
   */
  handleRatingChange = (list) => {
    const data = list.feedbacks ? list.feedbacks : [];
    this.setState({
      reviewData: data,
    });
  };

  /**
   * @method filterRating
   * @description filter rating
   */
  filterRating = () => {
    return (
      <Select
        defaultValue="New - Old"
        onChange={(e) => {
          this.getFeedbackListing(e);
        }}
      >
        <Option value={"recent"}>New - Old</Option>
        <Option value={"old"}>Old - New</Option>
      </Select>
    );
  };

  /**
   * @method likeReview
   * @description like this review
   */
  likeReview = (item) => {
    const { loggedInDetail } = this.props;
    const { filter } = this.state;
    let reqData = {
      user_id: loggedInDetail.id,
      feedback_id: item.id,
      is_like: item.is_feedback_like === 1 ? 0 : 1,
    };
    this.props.voteRetailFeedback(reqData, () => {
      this.getFeedbackListing(filter);
    });
  };

  /**
   * @method renderFeedbacks
   * @description render feedback
   */
  renderFeedbacks = (feedback) => {
    console.log("feedback: ", feedback);
    return (
      <div className="review-detail-block ">
        <List
          itemLayout="vertical"
          dataSource={feedback && feedback}
          renderItem={(el) => (
            <List.Item>
              <Rate
                disabled
                value={
                  (Number(el.accurate_description) +
                    Number(el.communication) +
                    Number(el.postage_speed) +
                    Number(el.reasonable_postage_costs)) /
                  4
                }
                className="fs-16 mb-7"
              />
              <List.Item.Meta
                title={
                  <a href="javascript:viod(0)">
                    by <u>{el.feedback_user ? el.feedback_user.name : ""}</u>
                    <br />
                    <span>{displayDateTimeFormate(el.created_at)}</span>
                  </a>
                }
                description={
                  <div>
                    <div className="review-discrip-heading">
                      {el.title}{" "}
                      <img
                        src={require("../../../../assets/images/hand-img.png")}
                        alt=""
                      />
                    </div>
                    <p className="review-discrip-content">{el.comment}</p>
                    <div className="retail-review-like-dis-parent-block">
                      <div className="review-like-dislike mt-0">
                        {el.is_feedback_like ? (
                          <LikeOutlined
                            onClick={() => {
                              this.likeReview(el);
                            }}
                          />
                        ) : (
                          <LikeOutlined
                            onClick={() => {
                              this.likeReview(el);
                            }}
                          />
                        )}
                        <span>{el.no_of_votes_count}</span>
                        <span className="date ml-21">{`${el.replies_count} Comment`}</span>
                      </div>

                      <div className="review-date-detail ad-num">
                        <span>Ad No.</span>&nbsp;
                        <span className="date">
                          <u>
                            {el.retail_classified_id
                              ? `${el.retail_classified_id}`
                              : ""}
                          </u>
                        </span>
                      </div>

                      <div className="review-reply-review">
                        <Button onClick={() => this.handleReplyReview(el)}>
                          Reply
                        </Button>
                        <span
                          className="report-review"
                          onClick={() => this.handleReportReview(el)}
                        >
                          <img
                            src={require("../../../../assets/images/icons/notify.svg")}
                            alt="notify"
                          />
                        </span>
                      </div>
                      <br />
                    </div>
                    {el.replies &&
                      Array.isArray(el.replies) &&
                      el.replies.length !== 0 && (
                        <div className="feedback-response">
                          <b className="mr-15">Response from me</b>
                          <span>
                            {el.replies[0] &&
                              displayDateTimeFormate(el.replies[0].created_at)}
                          </span>
                          <div className="review-discrip-content">
                            hi {el.feedback_user ? el.feedback_user.name : ""}
                            <br />
                            {el.replies[0] && el.replies[0].reason
                              ? el.replies[0].reason
                              : "Thank you for your feedback."}
                          </div>
                          {el.replies[0].is_feedback_like ? (
                            <LikeOutlined />
                          ) : (
                            <DislikeOutlined />
                          )}
                          <span>
                            {el.replies[0] && el.replies[0].no_of_votes_count}
                          </span>
                        </div>
                      )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    console.log(this.props,"props")
    const {
      avg_rating,
      replayReview,
      selectedLabel,
      reviewData,
      feedbacks_avg,
      report_review,
      selectedFeedback,
    } = this.state;
    let avg = feedbacks_avg ? feedbacks_avg : "";
    return (
      <Layout className="retail-vendor-seller-feedback-v2">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800 }}
            >
              
              <div className="card-container signup-tab">
                <div className="profile-content-box mt-50">
                  {/* <div
                  className="go-back"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.props.history.goBack()}
                >
                  <LeftOutlined /> Back
                </div> */}
                  <div className="heading-search-block">
                    <div className="">
                      <Row gutter={0}>
                        <Col xs={24} md={24} lg={24} xl={24}>
                          <h1>
                            <span>Reviews</span>
                          </h1>
                          <div className="search-block">
                            <Input
                              placeholder="Search"
                              prefix={
                                <SearchOutlined className="site-form-item-icon" />
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <Row className="grid-block reviews-content mt-16" gutter={18}>
                    <Col xs={24} sm={16} md={16} lg={16}>
                      <Card
                        bordered={false}
                        className=""
                        title={
                          <Title level={2}>
                            {selectedLabel &&
                              `${selectedLabel} (${
                                reviewData ? reviewData.length : "0"
                              })`}
                          </Title>
                        }
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            {this.filterRating()}
                          </div>
                        }
                      >
                        <div className="review-body-content-block">
                          {reviewData && this.renderFeedbacks(reviewData)}
                        </div>
                      </Card>
                    </Col>
                    <Col md={8}>
                      <Card
                        bordered={false}
                        className="product-ratting feedback-right-rating"
                      >
                        <div>
                          <h4 className="no-review-text">Feedback Rating</h4>
                          <div className="rating-large-value">
                            <div className="rate-ratio-value">
                              {avg ? roundToTwo(avg.overall_average) : 0}
                            </div>{" "}
                            <Rate
                              allowHalf
                              disabled
                              value={avg ? roundToTwo(avg.overall_average) : 0}
                            />
                          </div>
                          <div className="average-feedback">
                            Average Feedback{" "}
                            <strong>
                              {avg ? roundToTwo(avg.overall_average) : 0}
                            </strong>{" "}
                            of 5.0{" "}
                            {reviewData ? `(${reviewData.length})` : "(0)"}
                          </div>

                          <div className="pro-ratting-label">
                            <ul>
                              <li>
                                <label>Accurate description</label>
                                <div className="rate-for-pro">
                                  <Rate
                                    allowHalf
                                    disabled
                                    value={
                                      avg
                                        ? roundToTwo(
                                            avg.accurate_description_avg
                                          )
                                        : 0
                                    }
                                  />
                                  <span className="rating-digit">
                                    {avg
                                      ? roundToTwo(avg.accurate_description_avg)
                                      : 0}
                                  </span>
                                </div>
                              </li>
                              <li>
                                <label>Reasonable postage costs</label>
                                <div className="rate-for-pro">
                                  <Rate
                                    allowHalf
                                    disabled
                                    value={
                                      avg
                                        ? roundToTwo(
                                            avg.reasonable_postage_costs_avg
                                          )
                                        : 0
                                    }
                                  />
                                  <span className="rating-digit">
                                    {avg
                                      ? roundToTwo(
                                          avg.reasonable_postage_costs_avg
                                        )
                                      : 0}
                                  </span>
                                </div>
                              </li>
                              <li>
                                <label>Postage speed</label>
                                <div className="rate-for-pro">
                                  <Rate
                                    allowHalf
                                    disabled
                                    value={
                                      avg
                                        ? roundToTwo(avg.postage_speed_avg)
                                        : 0
                                    }
                                  />
                                  <span className="rating-digit">
                                    {avg
                                      ? roundToTwo(avg.postage_speed_avg)
                                      : 0}
                                  </span>
                                </div>
                              </li>
                              <li>
                                <label>Communication</label>
                                <div className="rate-for-pro">
                                  <Rate
                                    allowHalf
                                    disabled
                                    value={
                                      avg
                                        ? roundToTwo(avg.communication_avg)
                                        : 0
                                    }
                                  />
                                  <span className="rating-digit">
                                    {avg
                                      ? roundToTwo(avg.communication_avg)
                                      : 0}
                                  </span>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <span className="custom-br"></span>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {report_review && (
          <ReportFeedback
            visible={report_review}
            onCancel={this.handleCancel}
            callNext={this.getFeedbackListing}
            is_user={true}
            selectedReview={selectedFeedback}
          />
        )}
        {replayReview && (
          <ReplyToReviewModel
            visible={replayReview}
            onCancel={() => this.setState({ replayReview: false })}
            selectedReview={selectedFeedback}
            is_feedback={true}
            user_image={
              selectedFeedback && selectedFeedback.feedback_user
                ? selectedFeedback.feedback_user.image_thumbnail
                : ""
            }
            user_name={
              selectedFeedback && selectedFeedback.feedback_user
                ? selectedFeedback.feedback_user.name
                : ""
            }
            user_comment={selectedFeedback ? selectedFeedback.comment : ""}
            user_rating={avg_rating}
            callNext={this.getFeedbackListing}
          />
        )}
      </Layout>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};

export default connect(mapStateToProps, {
  sellerFeedbackListAPI,
  voteRetailFeedback,
  enableLoading,
  disableLoading,
})(SellerFeedback);
