import React from "react";
import { connect } from "react-redux";
import {
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
  enableLoading,
  getTraderProfileUser,
  disableLoading,
  openLoginModel,
  removeReview,
  editRetailReview,
} from "../../../../actions/index";
import { SearchOutlined } from "@ant-design/icons";
import { converInUpperCase } from "../../../common";
import ReplyToReviewModel from "../../../dashboard/vendor-profiles/ReplyVendorReviewModel";
import UpdateReviewModel from "../../../retail/retail-categories/product-review/LeaveReviewModel";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import moment from "moment";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

class UserReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      isFilter: false,
      filteredData: [],
      replayReview: false,
      selectedReview: [],
      editReviewModel: false,
      row: [],
      filter: "",
      rating: [],
      classifiedDetail: "",
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    let { id } = this.props.loggedInUser;
    const { userDetails } = this.props;
    this.setState({ row: userDetails });
    this.getCustomerReviewList(this.state.filter);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userDetails != this.props.userDetails ) {
      this.setState({ row: nextProps.userDetails,
         });
    }

  }

  getCustomerReviewList = (page) => {
    const { id } = this.props.loggedInUser;

    const reqData = {
      user_id: id,
      search: page,
    };
    // this.props.enableLoading();
    this.props.getTraderProfileUser(reqData, (res) => {
      // this.props.disableLoading();
      
      if (res.status === 200) {

      }
    });
  };


  replyToReview = (item) => {
    this.setState({ replayReview: true, selectedReview: item });
  };

  updateReview = (item) => {
    this.setState({ editReviewModel: true, selectedReview: item });
  };

  searchText = (event) => {
    this.setState({ filter: event.target.value });
    this.getCustomerReviewList(event.target.value);
  };

  deleteReview = (id,type) => {
    this.props.enableLoading();
    this.props.removeReview({ rating_id:id , rating_type:type}, (res) => {
      this.props.disableLoading();
      // const removeData = this.state.row.filter((r) => r.id !== id);
      // this.setState({ row: removeData });
      this.callNext();
    });
  };



  renderRatings = () => {
    if (this.state.row) {
      // const dataSearch = this.state.row.filter(item => {
      //   return Object.keys(item).some((key) =>
      //     item[key]
      //       .toString()
      //       .toLowerCase()
      //       .includes(this.state.filter.toString().toLowerCase())
      //   );
      // }); 
      // console.log(dataSearch);
      
      return (
        
        <div className="">
          <Card
            title={`Published Reviews (${
              this.state.row ? this.state.row.length : "0"
            })`}
          />
          
          <div className="review">
            {this.state.row.map((data) => {
              console.log(data,"dataaaa review")
              let review_rating = data.rating;
              const sellername = data.seller_type == ("events" ) ? ("Booking") :  data.seller_type == "handyman" ? ("Booking") :  data.seller_type == "beauty" ? ("Booking") :  data.seller_type == "fitness" ? ("Booking") :   data.seller_type == "wellbeing" ? ("Booking") :  data.seller_type == "trader" ? ("Booking") :  data.seller_type == "merchant" ? ("Retail") :  data.seller_type == "business" ? ("Classified") : ("FoodZone");
             
              const today = new Date();
              const date = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
              const review_date = date === moment(data.creater_date).format("DD/MM/YYYY") ? "Today" : moment(data.creater_date).format("DD MMM YYYY");
              console.log(review_date,"dateeeeee");
              return (
                  
                <div key={data.id} className="rating-review-main">
                  <div className="rating ant-col-md-5">
                    <Rate
                      disabled
                      value={review_rating}
                      className="fs-16 mb-7"
                    />
                    <p className="days"> {review_date}</p>
                    
                  </div>
                 
               
                  

                  <div className="data-right-section ant-col-md-19">
                    <div className="avtar-section">
                      {<Avatar src="" alt={""} size={37} />}
                      <span>
                        <span className="creatername">{data.creater_name}</span>
                      </span>
                      
                    </div>
                    <div className="sellername">
                      <div className={sellername}>
                         {sellername}
                      </div>
                    </div>
                    <div className="review-data">
                      <h3> {converInUpperCase(data.title)}</h3>
                      <p>{data.review}</p>
                    </div>
                    <div className="review-button">
                      <span
                        className="blue-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => this.updateReview(data)}
                      >
                        Edit
                      </span>
                      <a
                        href="javascript:void(0)"
                        onClick={() => this.deleteReview(data.id,data.rating_type)}
                      >
                        <img
                          src={require("../../../../assets/images/icons/delete-gray.svg")}
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  /**
   * @method handleRatingChange
   * @description handle rating change
   */
  handleRatingChange = (value) => {
    let row = this.state.row;
    if (value === "newest") {
      row.sort((a, b) => {
        if (moment(a.created_at).diff(moment(b.created_at), "s") > 0) {
          return -1;
        }
        if (moment(a.created_at).diff(moment(b.created_at), "s") < 0) {
          return 1;
        }
        return 0;
      });
    } else if (value === 5) {
      row.sort((a, b) => {
        if (a.rating > b.rating) {
          return -1;
        }
        if (a.rating < b.rating) {
          return 1;
        }
        return 0;
      });
    } else if (value === 4) {
      row.sort((a, b) => {
        if (a.rating < b.rating) {
          return -1;
        }
        if (a.rating > b.rating) {
          return 1;
        }
        return 0;
      });
    } else if (value === "oldest") {
      row.sort((a, b) => {
        if (moment(a.created_at).diff(moment(b.created_at), "s") < 0) {
          return -1;
        }
        if (moment(a.created_at).diff(moment(b.created_at), "s") > 0) {
          return 1;
        }
        return 0;
      });
    }
    this.setState({ row });
  };

  callNext = () => {
    toastr.success(langs.success, MESSAGES.REVIEW_UPDATE_SUCCESS);
    let { id } = this.props.loggedInUser;
    this.props.getTraderProfileUser({ user_id: id }, (res) => {
      const { userDetails } = this.props;
      this.setState({ row: userDetails });
    });
  };

  /**
   * @method render
   * @description render component
   */

  render() {
    const { userDetails, classifiedDetail } = this.props;

    const {
      selectedReview,
      replayReview,
      filteredData,
      isFilter,
      editReviewModel,
    } = this.state;
    let ratings = this.state.row;

    return (
      <Layout>
        <Layout className="profile-vendor-retail-receiv-order reviews-rating">
          <AppSidebar history={history} activeTabKey={5} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box review-box"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Reviews</Title>
                  </div>
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
                <div className="profile-content-box review-sort">
                  <Row gutter={30}>
                    <Col xs={24} md={16} lg={16} xl={14}>
                      <Card
                        className="border-none sorting-blue"
                        // title={`All Reviews (${userDetails?dataSearch.length:"0"})`}
                        extra={
                          <div className="card-header-select">
                            <label>Sort:</label>
                            <Select
                              defaultValue="Latest posted"
                              onChange={this.handleRatingChange}
                            >
                              <Option value={"newest"}>Newest</Option>
                              <Option value={5}>Rating highest</Option>
                              <Option value={4}>Rating lowest</Option>
                              <Option value={"oldest"}>Oldest</Option>
                            </Select>
                          </div>
                        }
                      >
                        <div
                          className={""}
                          style={{ overflow: "auto", height: "300" }}
                        >
                          {isFilter
                            ? this.renderRatings(filteredData)
                            : this.renderRatings(ratings)}
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
        {editReviewModel && (
          <UpdateReviewModel
            visible={editReviewModel}
            onCancel={() => this.setState({ editReviewModel: false })}
            classifiedDetail={userDetails && userDetails}
            selectedReview={selectedReview}
            callNext={this.callNext}
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
  getTraderProfileUser,
  enableLoading,
  openLoginModel,
  removeReview,
  disableLoading,
  editRetailReview,
})(UserReview);
