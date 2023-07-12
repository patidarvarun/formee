import React from "react";
import { connect } from "react-redux";
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
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import {
  likeUnlikeReview,
  getRetailCategoryDetail,
  getTraderProfile,
  enableLoading,
  disableLoading,
} from "../../../../actions";
import { LeftOutlined, LikeOutlined, LikeTwoTone } from "@ant-design/icons";
import { renderRating, rating } from "../../../classified-templates/CommanMethod";
import {
  dateFormat4,
  salaryNumberFormate,
  converInUpperCase,
} from "../../../common";
import ReplyToReviewModel from "./ReplyReviewModel";
import ReportThisReview from "./ReportReview";
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilter: false,
      filteredData: [],
      replayReview: false,
      reportReview: false,
      selectedReview: "",
      itemDetail: [],
      filter: "most_recent",
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { filter } = this.state;
    this.props.enableLoading();
    this.getDetails(filter);
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = (filter) => {
    const { isLoggedIn, loggedInUser } = this.props;
    let classified_id = this.props.match.params.itemId;
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInUser.id : "",
      filter: filter,
    };
    this.props.getRetailCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ itemDetail: res.data.data, allData: res.data });
      }
    });
  };

  replyToReview = (item) => {
    this.setState({ replayReview: true, selectedReview: item });
  };

  reportToReview = (item) => {
    this.setState({ reportReview: true, selectedReview: item });
  };

  /**
   * @method likeReview
   * @description like this review
   */
  likeReview = (item) => {
    console.log("item", item);
    const { loggedInUser } = this.props;
    const { filter } = this.state;
    let reqData = {
      user_id: loggedInUser.id,
      review_id: item.id,
      is_like: item.is_review_like === 1 ? 0 : 1,
    };
    this.props.likeUnlikeReview(reqData, () => {
      this.getDetails(filter);
    });
  };

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  renderRatings = (temp) => {
    console.log("temp", temp);
    return (
      // <div className="demo-infinite-container vendor-review">
      <div className="review-detail-block demo-infinite-container">
        <Row gutter={0}>
          <Col md={3}></Col>
          <Col md={1}></Col>
          <Col md={20}></Col>
        </Row>
        <List
          itemLayout="vertical"
          dataSource={temp && temp}
          renderItem={(item) => (
            <List.Item>
              <Rate
                disabled
                value={Number(item.rating)}
                className="fs-16 mb-7"
              />
              <List.Item.Meta
                title={
                  <a href="javascript:viod(0)">
                    by{" "}
                    <u>
                      {item.reviews_bt_users &&
                        converInUpperCase(item.reviews_bt_users.name)}
                    </u>
                    <span className="date">{dateFormat4(item.created_at)}</span>
                  </a>
                }
                description={
                  <div>
                    <div className="review-discrip-heading">
                      {item.title}{" "}
                      <img
                        src={require("../../../../assets/images/hand-img.png")}
                        alt=""
                      />
                    </div>
                    {item.review}
                    <div className="retail-review-like-dis-parent-block">
                      <div className="review-like-dislike mt-0">
                        {item.is_review_like ? (
                          <LikeTwoTone
                            onClick={() => {
                              this.likeReview(item);
                            }}
                          />
                        ) : (
                          <LikeOutlined
                            onClick={() => {
                              this.likeReview(item);
                            }}
                          />
                        )}
                        <span>
                          {item.no_of_votes_count}&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                      </div>
                      <div className="review-reply-review">
                        <Button onClick={() => this.replyToReview(item)}>
                          Reply
                        </Button>
                        <span
                          className="report-review"
                          style={{ cursor: "pointer" }}
                          onClick={() => this.reportToReview(item)}
                        >
                          <img
                            src={require("../../../../assets/images/icons/notify.svg")}
                            alt="notify"
                          />
                        </span>
                      </div>
                    </div>
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
   * @method handleRatingChange
   * @description handle rating change
   */
  handleRatingChange = (value) => {
    const { itemDetail } = this.state;
    let ratings = itemDetail && itemDetail.classified_hm_reviews;
    if (ratings && value) {
      let filteredData =
        ratings &&
        ratings.length !== 0 &&
        ratings.filter((el) => el.rating == value);
      console.log("ratings", filteredData, value);
      this.setState({ filteredData: filteredData, isFilter: true });
    } else {
      this.setState({ isFilter: false });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { userDetails } = this.props;
    const {
      itemDetail,
      selectedReview,
      reportReview,
      replayReview,
      filteredData,
      isFilter,
    } = this.state;
    let ratings =
      itemDetail &&
      itemDetail.classified_hm_reviews &&
      itemDetail.classified_hm_reviews.length
        ? itemDetail.classified_hm_reviews
        : [];
    console.log("userDetails", userDetails);
    let categoryName = itemDetail.categoriesname
      ? itemDetail.categoriesname.name
      : "";
    let subCategoryName = itemDetail.mid_level_category
      ? itemDetail.mid_level_category.name
      : itemDetail.subcategoriesname
      ? itemDetail.subcategoriesname.name
      : "";
    let itemImage =
      itemDetail &&
      Array.isArray(itemDetail.classified_image) &&
      itemDetail.classified_image.length !== 0
        ? itemDetail.classified_image[0]
        : "";
    let avg_rating =
      itemDetail &&
      itemDetail.classified_hm_reviews &&
      rating(itemDetail.classified_hm_reviews);
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
        <Layout className="retail-ven-ad-managment-product-review ">
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div
                  className="go-back"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.props.history.goBack()}
                >
                  <LeftOutlined /> Back
                </div>
                <div className="profile-content-box">
                  <Card
                    bordered={false}
                    title={<Title level={2}>Product Review</Title>}
                    className=""
                  >
                    <div className="thumb-detail-block">
                      <div className="thumb-left-block test">
                        <img
                          src={
                            itemImage && itemImage.full_name
                              ? itemImage.full_name
                              : DEFAULT_IMAGE_CARD
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_IMAGE_CARD;
                          }}
                          alt={""}
                        />
                      </div>
                      <div className="product-detail-right">
                        <Title level={4}>{itemDetail.title}</Title>
                        <div className="price">
                          {"AU$"} {salaryNumberFormate(itemDetail.price)}
                        </div>
                        <div className="category-title">
                          {categoryName}
                          {subCategoryName}
                        </div>
                      </div>
                    </div>
                    <Row className="grid-block reviews-content" gutter={18}>
                      <Col xs={24} sm={16} md={16} lg={16}>
                        <Card
                          title={
                            <h2>
                              Total Reviews{" "}
                              <span>{ratings && `(${ratings.length})`}</span>
                            </h2>
                          }
                          extra={
                            <div className="card-header-select">
                              <label>Show:</label>
                              <Select
                                defaultValue="Latest Posted"
                                // onChange={this.handleRatingChange}
                                onChange={(e) => {
                                  this.getDetails(e);
                                }}
                              >
                                {/* <Option value={''}>All Star</Option>
                              <Option value={4}>Four Star</Option>
                              <Option value={3}>Three Star</Option>
                              <Option value={2}>Two Star</Option>
                              <Option value={1}>One Star</Option> */}
                                <Option value={"most_recent"}>
                                  Latest Posted
                                </Option>
                                <Option value={"top_rated"}>Top Rated</Option>
                              </Select>
                            </div>
                          }
                        >
                          <div className="review-body-content-block">
                            {isFilter
                              ? this.renderRatings(filteredData)
                              : this.renderRatings(ratings)}
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} sm={8} md={8} lg={8}>
                        <div className="reviews-rating">
                          <Card
                            extra={
                              <div className="product-ratting">
                                {/* <Text>
                                  {avg_rating ? avg_rating : "No reviews yet"}
                                </Text> */}
                                <div className="left-block">
                                  {avg_rating ? (
                                    <Text> {avg_rating} </Text>
                                  ) : (
                                    <Text className="No reviews yet">
                                      No Review Yet
                                    </Text>
                                  )}
                                </div>
                                <div className="right-block">
                                  {avg_rating && (
                                    <Rate
                                      disabled
                                      defaultValue={
                                        avg_rating ? avg_rating : ""
                                      }
                                      className="fs-15 ml-6 mr-6"
                                      style={{
                                        position: "relative",
                                        top: "-1px",
                                      }}
                                    />
                                  )}
                                  <div className="rating-figure">
                                    {ratings &&
                                      `Total ${ratings.length} reviews`}
                                  </div>
                                </div>
                              </div>
                            }
                          >
                            <div>
                              {isFilter
                                ? renderRating(filteredData)
                                : renderRating(ratings)}
                            </div>
                          </Card>
                        </div>
                      </Col>
                    </Row>
                  </Card>
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
            user_image={
              selectedReview && selectedReview.reviews_bt_users
                ? selectedReview.reviews_bt_users.image_thumbnail
                : ""
            }
            user_name={
              selectedReview && selectedReview.reviews_bt_users
                ? selectedReview.reviews_bt_users.name
                : ""
            }
            user_comment={selectedReview ? selectedReview.review : ""}
            user_rating={selectedReview ? selectedReview.rating : ""}
            //callNext={this.getDetails('most_recent')}
          />
        )}
        {reportReview && (
          <ReportThisReview
            visible={reportReview}
            onCancel={() => this.setState({ reportReview: false })}
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
  getRetailCategoryDetail,
  getTraderProfile,
  enableLoading,
  disableLoading,
})(Review);
