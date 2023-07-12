import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Map from "../../common/Map";
import { toastr } from "react-redux-toastr";
import { STATUS_CODES } from "../../../config/StatusCode";
import AppSidebar from "../NewSidebar";
import { SocialShare } from "../../common/social-share";
import { langs } from "../../../config/localization";
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import {
  Dropdown,
  Rate,
  Layout,
  Row,
  Col,
  Tabs,
  List,
  Typography,
  Carousel,
  Form,
  Input,
  Select,
  Button,
  Card,
  Breadcrumb,
  Table,
  Tag,
  Space,
  Modal,
  Steps,
  Progress,
  Divider,
} from "antd";
import Icon from "../../customIcons/customIcons";
import { DetailCard } from "../../common/DetailCard1";
import {
  removeRestaurantInFav,
  addRestaurantInFav,
  getBannerById,
  openLoginModel,
  getRestaurantDetail,
  enableLoading,
  disableLoading,
} from "../../../actions/index";
import NoContentFound from "../../common/NoContentFound";
import { formateTime, getDaysName,getDaysFullName} from "../../common";
import "./listing.less";
import RestaurantDetailCard from "../common/RestaurantDetailCard";
import AddToCartView from "./AddToCartView";
import ViewRestaurantCart from "./RestaurentCartChekoutProcess/ViewRestaurantCart";
import RestaurentCartChekoutProcess from "./RestaurentCartChekoutProcess/";
import ReviewList from "../common/ReviewList";
import Review from '../common/Review'

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const temp = [
  {
    title: 'Good quality, same as pic 👍',
		name: 'Sierra Ferguson',
		created_at: '11 Sep 2010',
		review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum vel vitae at lus donec. Urna ullamcorper mattis mi nulla. Urna bibendum purus augue lacus, sagittis turpis eget venenatis. Risus facilisis diam elementum odio.',
		comment: '2',
		no_of_votes_count: '5'
  },
  {
    title: 'Good quality, same as pic 👍',
		name: 'Sierra Ferguson',
		created_at: '11 Sep 2010',
		review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum vel vitae at lus donec. Urna ullamcorper mattis mi nulla. Urna bibendum purus augue lacus, sagittis turpis eget venenatis. Risus facilisis diam elementum odio.',
		comment: '',
		no_of_votes_count: ''
  },
  {
    title: 'The material is not what i thought it would be but i like the dress nice pattern.',
		name: 'Sierra Ferguson',
		created_at: '11 Sep 2010',
		review: '',
		comment: '1',
		no_of_votes_count: '1'
  },
  {
    title: 'Super ebayer und gerne wieder! Alles genau wie berieben ! 👍🏼',
		name: 'Sierra Ferguson',
		created_at: '11 Sep 2010',
		review: 'Consectetur adipiscing elit. Ipsum vel vitae at lacus donec. Urna ullamcorper mattis mi nulla. Urna bibendum purus augue lacus, sagittis turpis eget venenatis. Risus facilisis diam elementum odio.',
		comment: '1',
		no_of_votes_count: '1'
  },
	{
    title: 'The material is not what i thought it would be but i like the dress nice pattern.',
		name: 'Sierra Ferguson',
		created_at: '11 Sep 2010',
		review: '',
		comment: '1',
		no_of_votes_count: '1'
  },
];

class RestaurantReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      visible: false,
      current: 0,
      restaurantDetail: "",
      is_favourite: false,
      displayAddToCartModal: false,
      selectedItem: [],
      displayCartModal: false,
      deliveryType: "delivery",
      displayClearCart: false,
      clearCartData: "",
      restaurantCartItems: [],
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    let parameter = this.props.match.params;
    this.getDetails();
    let id = parameter.subCategoryId
      ? parameter.subCategoryId
      : parameter.categoryId;
    this.getBannerData(id);
  }

   /**
  * @method getDetails
  * @description get all restaurant details
  */
    getDetails = (filter) => {
      let itemId = this.props.match.params.itemId
      this.props.getRestaurantDetail(itemId,filter, res => {
        this.props.disableLoading()
        if (res.status === 200) {
          let data = res.data && res.data.data
          
          this.setState({ restaurantDetail: data, is_favourite: data.favourites === 1 ? true : false })
        }
      })
    }

  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = (categoryId) => {
    let parameter = this.props.match.params;
    this.props.getBannerById(3, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        const data =
          res.data.data && Array.isArray(res.data.data.banners)
            ? res.data.data.banners
            : "";
        const banner = data && data.filter((el) => el.moduleId === 3);
        const top =
          banner && banner.filter((el) => el.bannerPosition === langs.key.top);
        let temp = [],
          image;
        image =
          top.length !== 0 &&
          top.filter((el) => el.subcategoryId == categoryId);
        temp = image;
        if (temp.length === 0) {
          image =
            top.length !== 0 &&
            top.filter(
              (el) =>
                el.categoryId == parameter.categoryId && el.subcategoryId === ""
            );
        }
        this.setState({ topImages: image });
      }
    });
  };

   /**
  * @method onSelection
  * @description handle favorite unfavorite
  */
  onSelection = (data) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let parameter = this.props.match.params
    let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : ''

    if (isLoggedIn) {
      if (data.favourites === 1) {
        const requestData = {
          user_id: loggedInDetail.id,
          item_id: data.id,
          item_type: 'restaurant',
          category_id: cat_id
        }
        this.props.removeRestaurantInFav(requestData, res => {
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, res.data.message)
            this.getDetails()
          }
        })
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          item_id: data.id,
          item_type: 'restaurant',
          category_id: cat_id
        }
        this.props.addRestaurantInFav(requestData, res => {
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, res.data.message)
            this.getDetails()
          }
        })
      }
    } else {
      this.props.openLoginModel()
    }
  }

	/**
  * @method filterRating
  * @description filter rating
  */
  filterRating = () => {
      return (
          <>
          <Select
              defaultValue='Five Star'
              size='large'
              className='w-100 show-reviews-select'
              onChange={this.handleRatingChange}
          >
              <Option value={5}>Five Star</Option>
              <Option value={4}>Four Star</Option>
              <Option value={3}>Three Star</Option>
              <Option value={2}>Two Star</Option>
              <Option value={1}>One Star</Option>
          </Select>
          </>
      )
  }

  renderOperatingHours = (list) => {
    var d = new Date();
    var day = d.getDay()
    if(list && Array.isArray(list) && list.length){
      return (
        list && list.map((el, i) =>
          <li key={i}>
            <Text className={day === el.day ? 'active-date' : ''}>{getDaysFullName(el.day)}</Text>
            {el.day === 7 ?
              <Text className='pull-right'>
                Closed
              </Text> :
              <Text className={day === el.day ? 'pull-right active-date uppercase' : 'pull-right uppercase'}>
                {`${formateTime(el.start_time)} - ${formateTime(el.end_time)}`}
              </Text>
            }
          </li>
        )
      )
    }
  }

  /**
   * @method render
   * @description render component
   */
   showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { restaurantDetail, topImages } = this.state;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let categoryName = parameter.categoryName;
    let itemId = parameter.itemId
    const menu = <SocialShare {...this.props} />;
    let reviewList = restaurantDetail && Array.isArray(restaurantDetail.valid_trader_ratings) && restaurantDetail.valid_trader_ratings.length ? restaurantDetail.valid_trader_ratings : []

    return (
      <div className="booking-product-detail-parent-block">
        <Layout className="common-sub-category-landing booking-sub-category-landing">
          <Layout className="yellow-theme common-left-right-padd">
            <Layout className="right-parent-block booking-restaurant-milethree">
              <div className="detail-page right-content-block">
                <Row gutter={[0, 0]}>
                  <Col span={24}>
                    <div className="category-name" onClick={()=> this.props.history.goBack()}>
                        <Button type="ghost" shape={"round"}>
                          <Icon
                            icon="arrow-left"
                            size="20"
                            className="arrow-left-icon"
                          />
                          {categoryName}
                        </Button>
                    </div>
                  </Col>
                </Row>
                <Row gutter={[40, 40]}>
                  <Col md={24}>
                    <div className="inner-banner fm-details-banner resutrant-banner">
                      <img
                        src={
                          restaurantDetail && restaurantDetail.cover_photo
                            ? restaurantDetail.cover_photo
                            : require("../../../assets/images/restaurant-banner.jpg")
                        }
                        alt=""
                      />
                    </div>
                    <div className="fm-card-box resto-detail-box">
                      <Row>
                        <Col span="20">
                          <h3>
                            {restaurantDetail && restaurantDetail.business_name}
                          </h3>
                        </Col>
                        <Col span="4">
                          <ul className="fm-panel-action ">
                            <li
                              className={
                                restaurantDetail.favourites === 1
                                  ? "active"
                                  : ""
                              }
                            >
                              <span>
                                <Icon
                                  icon={
                                    restaurantDetail.favourites === 1
                                      ? "wishlist-fill"
                                      : "wishlist"
                                  }
                                  size="18"
                                  // className={'active'}
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    this.onSelection(restaurantDetail)
                                  }
                                />
                              </span>
                            </li>
                            <li>
                              <Dropdown overlay={menu} trigger={["click"]} overlayClassName='contact-social-detail share-ad resto-social-before'>
                                <div
                                  className="ant-dropdown-link"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <Icon icon="share" size="18" />
                                </div>
                              </Dropdown>
                            </li>
                          </ul>
                        </Col>
                        <Col span="20">
                          <h4>
                            {restaurantDetail && restaurantDetail.cusines_text}
                          </h4>
                        </Col>
                        {restaurantDetail && (
                          <Col span="20" className="mt-10 mb-10">
                            <div className="rate-section">
                              {restaurantDetail.avg_rating !== 0 ? (
                                <Fragment>
                                  <Text
                                    strong
                                    className="text-orange mr-7"
                                  >{`${parseInt(
                                    restaurantDetail.avg_rating
                                  )}.0`}</Text>
                                  <Rate
                                    disabled
                                    style={{ fontSize: "15px" }}
                                    defaultValue={
                                      restaurantDetail.avg_rating
                                        ? `${parseInt(
                                            restaurantDetail.avg_rating
                                          )}.0`
                                        : 0.0
                                    }
                                  />
                                  <Link
                                    className="more-info-orange ml-7"
                                  >
                                    {reviewList && `${reviewList.length} reviews`}
                                  </Link>
                                </Fragment>
                              ) : (
                                "No reviews yet"
                              )}
                            </div>
                          </Col>
                        )}
                        <Col className="adress-detail">
                        {restaurantDetail && restaurantDetail.user &&<p>
                            <img
                              src={require("../../../assets/images/location-icons.png")}
                              alt="edit"
                            />
                            <span className="addres-restaurant">
                            {restaurantDetail.user.business_location? restaurantDetail.user.business_location : restaurantDetail.address}
                            </span>{" "}
                          </p>}
                          <Link
                            className="more-info-orange"
                            onClick={this.showModal}
                          >
                            {" "}
                            More Info
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Fragment>
                  <div className="restaurant-reviews-wrap-inner">
										<Title level={1}>{'Reviews'}</Title>
                    <Row className="reviews-content">
                      {/* <Col md={24}>
                        <Row gutter={[86, 0]}>
                          <Col md={9}>
                            <div className="reviews-rating">
                              <div className="product-ratting">
                                <div className="left-block">
                                  <Text> {"3.0"} </Text>
                                </div>
                                <div className="right-block">
                                  <Rate
                                    disabled
                                    defaultValue={"3"}
                                    className="fs-20"
                                    style={{ position: "relative" }}
                                  />
                                  <div className="rating-figure">
                                    {"Average"} <b>{"3.0"}</b> of 5.0
                                  </div>
                                </div>
                              </div>
                              <div className="reviews-rating-status">
                                <Col md={24}>
                                  <ul className="progress-status">
                                    <li>
                                      <Text className="label">5 Excellent</Text>
                                      <Progress percent={18} />
                                    </li>
                                    <li>
                                      <Text className="label">4 Very good</Text>
                                      <Progress percent={22} />
                                    </li>
                                    <li>
                                      <Text className="label">3 Average</Text>
                                      <Progress percent={56} />
                                    </li>
                                    <li>
                                      <Text className="label">2 Poor</Text>
                                      <Progress percent={3} />
                                    </li>
                                    <li>
                                      <Text className="label">1 Terrible</Text>
                                      <Progress percent={1} />
                                    </li>
                                  </ul>
                                </Col>
                              </div>
                            </div>
                            <div className="reviews-rating-status-right">
                              <Button
                                type="default"
                                className="w-100 leave-review-btn"
                                // onClick={this.leaveReview}
                              >
                                {"Leave a Review"}
                              </Button>
                            </div>
                          </Col>
                          <Col md={15} className="bookings-all-review">
                            <Row gutter={0}>
                              <Col md={14}>
                                <Title level={3} className="mb-0">
                                  {`Top Reviews (${reviewList && reviewList.length})`}
                                </Title>
                              </Col>
                              <Col md={1}></Col>
                              <Col md={9}>{this.filterRating()}</Col>
                            </Row>
                            <div className="review-detail-block">
														<List
																itemLayout='vertical'
																dataSource={temp && temp}
																renderItem={item => (
																		<List.Item>
																				<Rate disabled defaultValue={4} className='fs-16 mb-7' />
																				<List.Item.Meta
																						title={
																								<Fragment>
																										<a href='javascript:viod(0)'>
																												by <u>{item.name}</u>                                  
																												<span className="date">{item.created_at}</span>
																										</a>
																										<a href='javascript:viod(0)' className="blue-link">Report review</a>
																								</Fragment>
																								}
																						description={<div>
																								<div className="review-discrip-heading">
																										{item.title}
																								</div>
																								<div className="review-discrip-content">
																										{item.review}
																								</div>
																								<div className="review-discrip-comment">
																										<LikeOutlined style={{ fontSize: '16px' }} onClick={() => {
																												if (this.props.isLoggedIn) {
																														this.likeReview(item)
																												} else {
																														this.props.openLoginModel()
																												}
																										}} />
																										<Text>{item.no_of_votes_count ? item.no_of_votes_count : '0'} {' '} {item.comment && `${'  ·  '} ${item.comment} Comment`}</Text>
																										<Link to={'/'} className="blue-link ml-20">{'Edit'}</Link>
																								</div>
																						</div>}
																				/>
																		</List.Item>
																)}
														/>
														<div className='align-right'>
																<a href="javascript:void(0)" className='blue-link'><span>Show More</span></a>
														</div>
												</div>
                          </Col>
                        </Row>
                      </Col> */}
                       {restaurantDetail && (
                          <Review
                            bookingDetail={restaurantDetail}
                            getDetails={this.getDetails}
                            type={'restaurant'}
                            />
                          )}
                    </Row>
                  </div>
                </Fragment>

                <Modal
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  width={720}
                  className="moredetail-restuarant"
                >
                  <div className="">
                    <div className="viewdetail-share d-flex">
                      <ul className="fm-panel-action  mb-0">
                        <li>
                          <Icon
                            icon="wishlist"
                            size="18"
                            // className={'active'}
                            className={
                              restaurantDetail.favourites === 1 ? "active" : ""
                            }
                            onClick={() => this.onSelection(restaurantDetail)}
                          />
                        </li>
                        <li>
                          <Dropdown overlay={menu} trigger={["click"]}>
                            <div
                              className="ant-dropdown-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Icon icon="share" size="18" />
                            </div>
                          </Dropdown>
                        </li>
                      </ul>
                    </div>
                    <Title level={4}>
                      {restaurantDetail && restaurantDetail.business_name}
                    </Title>
                    <Text>
                      {restaurantDetail && restaurantDetail.cusines_text}
                    </Text>
                    <div className="rate-section">
                      {restaurantDetail.avg_rating !== 0 ? (
                        <Fragment>
                          <Text strong className="mr-7">{`${parseInt(
                            restaurantDetail.avg_rating
                          )}.0`}</Text>
                          <Rate
                            disabled
                            style={{ fontSize: "15px" }}
                            defaultValue={
                              restaurantDetail.avg_rating
                                ? `${parseInt(restaurantDetail.avg_rating)}.0`
                                : 0.0
                            }
                          />
                          <Link className="more-info-orange ml-7" to={"/"}>
                            See Reviews
                          </Link>
                        </Fragment>
                      ) : (
                        "No reviews yet"
                      )}
                    </div>
                    <Divider />

                    <Row gutter={[60, 0]}>
                      <Col md={12} className="opening-hour">
                        <Text className="">
                          {" "}
                          <b>Opening Hours</b>
                        </Text>
                        <ul style={{ padding: 0 }}>
                          {this.renderOperatingHours(
                            restaurantDetail.operating_hours
                          )}
                        </ul>
                      </Col>
                      <Col md={12}>
                      {restaurantDetail && restaurantDetail.user &&<div className="adress-detail">
                          <p>
                            <img
                              src={require("../../../assets/images/location-icons.png")}
                              alt="edit"
                            />
                            <span className="addres-restaurant">
                              {restaurantDetail.user.business_location? restaurantDetail.user.business_location : restaurantDetail.address}
                            </span>{" "}
                          </p>
                        </div>}
                        {/* <img className="pt-10" src={require('../../../assets/images/map-image.png')} ></img> */}
                        {restaurantDetail && (
                          <Map className="h-200" list={[restaurantDetail]} />
                        )}
                      </Col>
                    </Row>
                  </div>
                </Modal>
              </div>
            </Layout>
          </Layout>
          <Modal
            title=""
            visible={this.state.displayAddToCartModal}
            className={"custom-modal style1 add-cart-milethree-modal"}
            footer={false}
            onCancel={() => this.hideAddToCartModal(false, "")}
            destroyOnClose={true}
          >
            <div className="padding">
              <AddToCartView
                deliveryType={this.state.deliveryType}
                selectedItem={this.state.selectedItem}
                removeAddToCartModal={(message, reqData) =>
                  this.hideAddToCartModal(message, reqData)
                }
                restaurantDetail={restaurantDetail}
              />
            </div>
          </Modal>
          <Modal
            title="Your Order"
            visible={this.state.displayCartModal}
            className={"custom-modal order-checkout style1"}
            footer={false}
            onCancel={this.hideViewCartModal}
            destroyOnClose={true}
          >
            <div className="padding order-checkout-content-block">
              <RestaurentCartChekoutProcess
                initialStep={0}
                restaurantDetail={restaurantDetail}
              />
            </div>
          </Modal>
          <Modal
            title=""
            visible={this.state.displayClearCart}
            onOk={this.handleClearCartOk}
            onCancel={this.handleClearCartCancel}
            className={"custom-modal style1 cancel-sml-modal"}
          >
            <div className="content-block">
              <div className="discrip">
                There are{" "}
                {this.state.deliveryType === "take_away"
                  ? "Delivery"
                  : "Pickup"}{" "}
                items in your cart. Please select the same service type to add
                an item to the cart. Or click OK to clear your cart.
              </div>
            </div>
          </Modal>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, {
  removeRestaurantInFav,
  addRestaurantInFav,
  getRestaurantDetail,
  getBannerById,
  openLoginModel,
  enableLoading,
  disableLoading,
})(RestaurantReviews);
