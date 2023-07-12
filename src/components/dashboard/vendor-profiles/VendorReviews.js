import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  Button,
  List,
  Col,
  Input,
  Layout,
  Avatar,
  Row,
  Typography,
  Card,
  Tabs,
  Select,
  Rate,
} from "antd";
import AppSidebar from "../../dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import {
  getTraderProfile,
  enableLoading,
  likeUnlikeReview,
  commentDataVendorReview,
  traderVoteAPI,
  retailVoteAPI,
  getTraderDetails,
  disableLoading,
} from "../../../actions/index";
import {
  SearchOutlined,
  LikeOutlined,
  LikeTwoTone,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import { renderRating, rating } from "../../classified-templates/CommanMethod";
import { converInUpperCase } from "../../common";
import ReplyToReviewModel from "./ReplyVendorReviewModel";
import moment from "moment";
import ReportReview from "../../classified-templates/common/modals/ReportReview";
import { langs } from "../../../config/localization";
import EditCommentModal from "../../retail/retail-categories/product-review/EditCommentModal";
import Item from "antd/lib/list/Item";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // user:[],
      filter: "",
      isFilter: false,
      filteredData: [],
      replayReview: false,
      selectedReview: "",
      reportReviewModel: false,
      reviewResponse: "",
      comment: "",
      searchKeyword: "",
      editComment: false,
      show: false,
      comment_id: "",
      resDataa: "",
      reslike: "",
      countt:"",
      row:"",
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    let { id } = this.props.loggedInUser;

    this.getTraderProfileVendor(this.state.filter);
  }

  getTraderProfileVendor = (searchWord) => {
    

    let { id } = this.props.loggedInUser;
    let reqData = {
      user_id: id,
      search: searchWord,
      filter: "top_rated",
      login_user_id: id,
      id: id,
    };
    this.props.getTraderDetails(reqData, (res) => {
      if (res) {
        this.setState({
          resDataa: res.data,
          reslike: res.data.data.valid_trader_ratings,
        });
      }
    });
  };

  commentRender = (item) => {

    // this.setState((currentState) => ({show: !currentState.show}));
    const { comment_id, comment } = this.state;
    if (comment_id === item.id) {
      this.setState({ comment_id: "", comment: "" });
    } else {
      this.setState({ comment_id: item.id, comment: item });
    }

    let reqData = {
      rating_id: item.id,
      vendor_id: item.trader_id,
    };
    if (item !== false) {
      this.props.commentDataVendorReview(reqData, (res) => {
        if (res.data.msg == "Success") {
          this.setState({ comment: res.data.data });
        } else {
          toastr.error(langs.error, "You are not replied on this review");
        }
      });
    }
  };

  replyToReview = (item) => {
    this.setState({ replayReview: true, selectedReview: item });
  };

  editCommentVendor = (item) => {
    this.setState({ editComment: true, selectedReview: item });
  };

  /**
   * @method componentDidMount
   * @description called after render the component
   */

  handleReportReview = (item) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({ reportReviewModel: true, selectedReview: item });
    } else {
      this.props.openLoginModel();
    }
  };



  likeReview = (item) => {
    const { loggedInUser } = this.props;
    const { resDataa } = this.state;


    if (resDataa.seller_type === "merchant") {
      let reqData = {
        user_id: loggedInUser.id,
        review_id: item.id,
        is_like:
          item.no_of_votes &&
          item.no_of_votes.length &&
          item.no_of_votes[0].is_like === 1
            ? 0
            : 1,
      };
      this.props.enableLoading();
      this.props.retailVoteAPI(reqData, (res) => {
        this.props.disableLoading();
      });
    } else {
      let reqData = {
        user_id: loggedInUser.id,
        rating_id: item.id,
        is_like:
          item.no_of_votes &&
          item.no_of_votes.length &&
          item.no_of_votes[0].is_like === 1
            ? 0
            : 1,
      };
      // this.props.enableLoading();
      this.props.traderVoteAPI(reqData, (res) => {
        window.location.reload();
        // this.props.disableLoading();
      });
    }
  };

  renderRatings = (temp) => {
    const {
      reportReviewModel,
      selectedReview,
      comment,
      editComment,
    } = this.state;
    let tempLike = [];
    if (temp && Array.isArray(temp)) {
      if (temp && temp.length > 0) {
        tempLike = temp.slice(0, temp.length);
      } else {
        let len = temp.length;
        tempLike = temp && temp.slice(0, len);
      }
    }
   
    return (
      <div className="demo-infinite-container">
        <List
          itemLayout="vertical"
          dataSource={temp && temp}
          renderItem={(item) => (
            <div className="review-rating-wrapper">
              {tempLike.map((data) => {
                
                return (
                  item.id == data.id ? 
                  <div className="review-rating-row">
              
                <Row gutter={(22, 22)}>
                    {console.log(item,"eeeeeee")}
                  {console.log(data,"ddddddd")}
                  <Col
                    xs={24}
                    md={4}
                    lg={4}
                    xl={4}
                    className="reviews-left-col"
                  >
                    <Rate disabled value={data.rating} className="fs-16 mb-7" />
                    <label className="username">
                      by{" "}
                      <a>
                        {data.rated_by && converInUpperCase(data.rated_by.name)}
                      </a>
                    </label>
                    <label className="duration">
                      {moment(data.created_at).format("DD MMM YYYY")}
                    </label>
                  </Col>
                  <Col
                    xs={24}
                    md={4}
                    lg={20}
                    xl={20}
                    className="reviews-right-col"
                  >
                    <h5>{data.rated_by && converInUpperCase(data.title)}</h5>
                    <p>{data.review}</p>

                    <div className="btn-block">
                      <div className="btn-block-left">
                        {/* {tempLike.map((data) => { */}
                {/* console.log(data,"templike 2") */}

                         
                          {/* return item.id == data.id ? ( */}
                            <div className="like-section">
                              <label>
                                <div>
                                  {data.no_of_votes &&
                                  data.no_of_votes.length &&
                                  data.no_of_votes[0].is_like ? (
                                    <LikeTwoTone
                                      onClick={() => {
                                        if (this.props.isLoggedIn) {
                                          this.likeReview(data);
                                        } else {
                                          this.props.openLoginModel();
                                        }
                                      }}
                                    />
                                  ) : (
                                    <LikeOutlined
                                      onClick={() => {
                                        if (this.props.isLoggedIn) {
                                          this.likeReview(data);
                                        } else {
                                          this.props.openLoginModel();
                                        }
                                      }}
                                    />
                                  )}
                                  <span>
                                    {" "}
                                    {data.no_of_votes &&
                                    data.no_of_votes.length &&
                                    data.no_of_votes[0].is_like === 1
                                      ? 1
                                      : 0}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                  </span>
                                </div>
                              </label>
                            </div>
                          {/* ) : (
                            ""
                          ); */}
                        {/* })} */}
                        <div className="comment-section">
                          <label className="label">
                            {/* <span>2</span> */}
                            {this.state.comment_id !== data.id ? (
                              <button
                                className="comment-show"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.commentRender(data);
                                }}
                              >
                                {" "}    
                                Comment
                              </button>
                            ) : (
                              <button
                                className="comment-hide"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.commentRender(false);
                                }}
                              >
                                Hide Comment
                              </button>
                            )}
                          </label>
                        </div>
                      </div>
                      <div className="btn-block-right">
                        <button
                          className="reply-btn"
                          onClick={() => this.replyToReview(data)}
                        >
                          Reply
                        </button>
                        <a
                          href="#"
                          className="report-icon"
                          onClick={() => this.handleReportReview(data)}
                        >
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M2.39242 18.3767C1.71838 18.3767 1.29745 17.6466 1.63517 17.0633L9.74253 3.05964C10.0796 2.47752 10.92 2.47751 11.257 3.05964L19.3644 17.0633C19.7021 17.6466 19.2812 18.3767 18.6071 18.3767H2.39242ZM11.3748 15.7499H10.5564C10.5377 15.7511 10.5188 15.7517 10.4998 15.7517C10.4807 15.7517 10.4619 15.7511 10.4431 15.7499H9.62478V13.9999H11.3748V15.7499ZM11.3748 12.2517H9.62478V7.87667H11.3748V12.2517Z"
                              fill="#F63730"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                    {this.state.comment_id !== data.id ? (
                      ""
                    ) : (
                      <div className="comment-response">
                        <Row>
                          <Col xs={24} md={12} lg={12} xl={12}>
                            <div className="comment-response-head">
                              <span className="username">
                                Response from me{" "}
                              </span>
                              <span className="duration">
                                {moment(comment.created_at).fromNow()}
                              </span>
                            </div>

                            <div className="comment-response-text">
                              <label className="reply-message">
                                {comment.reason}
                              </label>
                              {/* <label>Thank you so much!</label> */}
                            </div>
                          </Col>
                          <Col xs={24} md={12} lg={12} xl={12}>
                            <button
                              className="edit-btn"
                              onClick={() => this.editCommentVendor(data)}
                            >
                              Edit
                            </button>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            
                : "" )
                    })}
            </div>
            
          )}
        />
        {reportReviewModel && (
          <ReportReview
            visible={reportReviewModel}
            onCancel={() => this.setState({ reportReviewModel: false })}
            selectedReview={selectedReview}
            is_retail={true}
          />
        )}

        {editComment && (
          <EditCommentModal
            visible={editComment}
            onCancel={() => this.setState({ editComment: false })}
            selectedReview={selectedReview}
            commentData={comment}
          />
        )}

        {/* visible={reviewModel}
                                onCancel={this.handleCancel}
                                bookingDetail={bookingDetail && bookingDetail}
                                callNext={this.props.getDetails}
                                type={type} */}
      </div>
    );
  };

  searchText = (event) => {
    this.setState({ filter: event.target.value });
    this.getTraderProfileVendor(event.target.value);
  };

  /**
   * @method handleRatingChange
   * @description handle rating change
   */
  handleRatingChange = (value) => {
    const { userDetails } = this.props;
    const { reslike } = this.state;

    let row = this.state.reslike;
      // userDetails && userDetails.user && userDetails.user.valid_trader_ratings;
    console.log(row,"row")
    row.map((item)=> {
      console.log(item,"row map")
    })

    if (value === "newest") {
      reslike.sort((a, b) => {
        if (a.created_at.substring(0, 10) > b.created_at.substring(0, 10)) {
          return -1;
        }
        if (a.created_at.substring(0, 10) < b.created_at.substring(0, 10)) {
          return 1;
        }
        return this.setState({ reslike: reslike });
      });
      this.renderRatings(reslike)
      console.log(this.state.reslike,"after state new")
    } else if (value === 5) {
      reslike.sort((a, b) => {
        console.log(a,b,"gggggg")
        if (a.rating > b.rating) {
          return -1;
        }
        if (a.rating < b.rating) {
          return 1;
        }
        return this.setState({ reslike: reslike });
    
      });
      this.renderRatings(reslike)
      console.log(this.state.reslike,"after state 5")

    } else if (value === 4) {
      reslike.sort((a, b) => {
        if (a.rating < b.rating) {
          return -1;
        }
        if (a.rating > b.rating) {
          return 1;
        }
     
        return this.setState({ reslike: reslike });
      });
      console.log(this.state.reslike,"after state 4")

    } else if (value === "oldest") {
      reslike.sort((a, b) => {
        if (a.created_at.substring(0, 10) < b.created_at.substring(0, 10)) {
          return -1;
        }
        if (a.created_at.substring(0, 10) > b.created_at.substring(0, 10)) {
          return 1;
        }
        return this.setState({ reslike: reslike });
      });
      console.log(this.state.reslike,"after state old")
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { userDetails } = this.props;
    const { selectedReview, replayReview, filteredData, isFilter,countt,reslike } = this.state;

  
   console.log(filteredData,"in renderrrrr")
    let temp = userDetails && userDetails.user;
    let ratings =
      temp && temp.valid_trader_ratings.length ? temp.valid_trader_ratings : [];
     
    let avg_rating =
      temp &&
      temp.average_rating &&
      Array.isArray(temp.average_rating) &&
      temp.average_rating.length
        ? `${parseInt(temp.average_rating[0].rating)}.0`
        : [];
    let rateLabel = "";
    if (avg_rating === "5.0") {
      rateLabel = "Excelent";
    } else if (avg_rating === "4.0") {
      rateLabel = "Good";
    } else if (avg_rating === "3.0") {
      rateLabel = "Average";
    } else if (avg_rating === "2.0") {
      rateLabel = "Poor";
    } else if (avg_rating === "1.0") {
      rateLabel = "Terrible";
    }
    return (
      <Layout>
        <Layout className="profile-vendor-retail-receiv-order reviews-rating">
          <AppSidebar history={history} activeTabKey={5} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Reviews</Title>
                  </div>
                  {/* <div className='right'>
                        <div className='right-content'>&nbsp;</div>
                      </div> */}
                </div>

                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search"
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                            value={this.state.filter}
                            onChange={this.searchText}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="profile-content-box">
                  <Row gutter={15}>
                    <Col xs={24} md={18} lg={17} xl={17}>
                      <Card
                        title={`All Reviews (${ratings && ratings.length})`}
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              defaultValue="Newest"
                              onChange={this.handleRatingChange}
                              dropdownClassName="reviews-dropdown"
                            >
                              <Option value={"newest"}>Newest</Option>
                              <Option value={5}>Rating highest</Option>
                              <Option value={4}>Rating lowest</Option>
                              <Option value={"oldest"}>Oldest</Option>
                            </Select>
                          </div>
                        }
                      >
                        <div style={{ overflow: "auto" }}>
                          {isFilter
                            ? this.renderRatings(filteredData)
                            : this.renderRatings(reslike)}
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} md={6} lg={7} xl={7}>
                      <Card className="reviews-right">
                        <div className="review-right-head">
                          <Text>
                            {avg_rating ? avg_rating : "No reviews yet"}
                          </Text>
                          {avg_rating && (
                            <Rate
                              disabled
                              defaultValue={avg_rating ? avg_rating : ""}
                              className="fs-16"
                            />
                          )}
                          {/* <Text>
                            {avg_rating ? `${avg_rating} of 5.0 /` : ""}{" "}
                            {rateLabel !== "" && rateLabel}
                          </Text> */}
                          <span className="total-reviews">
                            Total {ratings && ratings.length} Reviews
                          </span>
                        </div>
                        <div>
                          {isFilter
                            ? renderRating(filteredData)
                            : renderRating(ratings)}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {replayReview && (
          <ReplyToReviewModel
            visible={replayReview}
            onCancel={() => this.setState({ replayReview: false })}
            selectedReview={selectedReview}
          />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
  };
};
export default connect(mapStateToProps, {
  likeUnlikeReview,
  getTraderProfile,
  enableLoading,
  commentDataVendorReview,
  traderVoteAPI,
  retailVoteAPI,
  getTraderDetails,
  disableLoading,
})(Review);
