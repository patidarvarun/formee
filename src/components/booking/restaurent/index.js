import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../NewSidebar';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../config/localization';
import {Breadcrumb, Layout, Row, Col, Typography, Carousel, Tabs, Form, Input, Select, Button, Checkbox, Card, Rate } from 'antd';
import Icon from '../../customIcons/customIcons';
import { searchByRestaurent,getRestaurantSpecialOffer, enableLoading, disableLoading, getPopularRestaurant, getRestaurantCustomerReviews, getBannerById, openLoginModel, getFoodTypes } from '../../../actions/index';
import history from '../../../common/History';
import { get, getBookingSearchRoute } from '../../../common/getRoutes'
import RestaurantSearch from '../common/search-bar/RestaurantSearch'
import { TEMPLATE, DEFAULT_ICON, DEFAULT_IMAGE_CARD } from '../../../config/Config'
import { CarouselSlider } from '../../common/CarouselSlider';
import PopularSearchList from '../common/PopularSerach';
import { dateFormate1, capitalizeFirstLetter } from '../../common/index';
import NoContentFound from '../../common/NoContentFound'
import RestaurantDetailCard from '../restaurent/RestaurantCard'
import './restaurant.less'
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;


class RestaurantLandingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      isSearchResult: false,
      service: 'delivery',
      specialOffer: [],
      topRatedList:[]
    }
  }

  /**
 * @method componentWillMount
 * @description called before mounting the component
 */
  componentWillMount() {
    this.props.enableLoading()
    let sub_cat_name = this.props.match.params.subCategoryName;
    let sub_cat_id = this.props.match.params.subCategoryId
    let cat_id = this.props.match.params.categoryId
    this.getBannerData(cat_id)
    this.specialOffer(cat_id)
    this.getTopRatedData()
    this.props.getRestaurantCustomerReviews()
    this.props.getPopularRestaurant()
    this.props.getFoodTypes((res) => {
      if (res.status === 200) {
        this.setState({ eventTypes: res.data.event_types, dietaries: res.data.dietaries })
      }
    })
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props from components
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial = this.props.match.params.cat_id
    let catIdNext = nextprops.match.params.cat_id
    if (catIdInitial !== catIdNext) {
      this.props.enableLoading()
      this.getBannerData(catIdNext)
    }
  }

   /**
   * @method getTopRatedData
   * @description get top rated data
   */
  getTopRatedData = () => {
    let reqData = {
      item_name:  '' ,
      latitude: '' ,
      longitude: '',
      kilometer:  '',
      page_size: 9,
      page: 1,
      filter:'top_rated'
    }
    this.props.searchByRestaurent(reqData, (res) => {
      this.props.disableLoading()
      if (res.status === 200) {
        let total_records = res.data && res.data.total
        let toprated =  res.data.data && Array.isArray(res.data.data) ? res.data.data : []
        this.setState({total_records: total_records, topRatedList: toprated})
      }
    })
  }

  /**
  * @method specialOffer
  * @description get special offer records
  */
  specialOffer = (cat_id) => {
    this.props.getRestaurantSpecialOffer({ category_id: cat_id }, res => {
      if (res.status === 200) {
        let item = res.data && res.data.data

        let specialOffer = item && item.data && Array.isArray(item.data) && item.data.length ? item.data : []
        this.setState({ specialOffer: specialOffer, total_special_offer: item.total })
      }
    })
  }

  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = (categoryId) => {
    this.props.getBannerById(3, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : ''
        const banner = data && data.filter(el => el.moduleId === 3)
        const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
        let image = top.length !== 0 && top.filter(el => el.categoryId == categoryId && el.subcategoryId === '')
        this.setState({ topImages: image })
      }
    })
  }


  /** 
  * @method handleSearchResponce
  * @description Call Action for Classified Search
  */
  handleSearchResponce = (res, resetFlag, reqData, total_records, selectedOption) => {
    let cat_id = this.props.match.params.categoryId
    let cat_name = this.props.match.params.categoryName
    let sub_cat_id = this.props.match.params.subCategoryId
    let sub_cat_name = this.props.match.params.subCategoryName
    let searchPagePath = getBookingSearchRoute(TEMPLATE.RESTAURANT, TEMPLATE.RESTAURANT, cat_id, sub_cat_name, sub_cat_id)
    if (resetFlag) {
      this.setState({ isSearchResult: false });
    } else {
      this.setState({ bookingList: res, isSearchResult: true, searchReqData: reqData })
      this.props.history.push({
        pathname: searchPagePath,
        state: {
          bookingList: res,
          multipleChoices: reqData.selectedItemsName,
          selectedItems: reqData.selectedItems,
          total_records: total_records,
          searchReqData: reqData,
          selectedOption: selectedOption ? selectedOption : ''
        }
      })
    }
  }

  /**
  * @method renderSpecialOffer
  * @description render makeup promo cards
  */
  renderSpecialOffer = () => {
    const { specialOffer } = this.state
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    if (Array.isArray(specialOffer) && specialOffer.length) {
      return specialOffer.slice(0, 9).map((el, i) => {
        let image = (el && el.image !== undefined) ? el.image : DEFAULT_IMAGE_CARD
        let path = `/bookings-restaurant-detail/${'restaurant'}/${cat_id}/${el.vendor_id}`
        return (
          <Col className='gutter-row mb-9' md={8}>
            <Link to={path}>
              <Card
                bordered={false}
                className={'detail-card horizontal fm-res-card'}
                cover={
                  <img
                    alt={''}
                    src={require('../../../assets/images/blue-lotus-restaurant.jpg')}
                  />
                }
              >
                <div className='price-box'>
                  <div className='price'>
                    {`${el.title ? capitalizeFirstLetter(el.title) : ''} ${el.category_name ? capitalizeFirstLetter(el.category_name) : ''}`}
                  </div>
                </div>
                <div className='sub-title'>
                  {'Asian'}
                </div>
                <div className='action-link'>
                  <div className='fm-delivery'>
                    {/* {'Free'} */}
                    {el.discount_percent ? `${el.discount_percent}% off` : 'Free Delivery'}
                  </div>
                  <div className='fm-delivery-status'>
                    {/* {'Delivery'} */}
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        )
      })
    }
  }

   /**
  * @method renderPopularRestaurant
  * @description render popular restaurant
  */
  renderPopularRestaurant = (popularRestaurantsList,cat_id) => {
    return (
      popularRestaurantsList.length !== 0 && <div className='wrap-inner fm-gradient-bg fm-cities-cards'>
      <Title level={1} className='fm-block-title'>
        {'Popular Restaurant'}
      </Title>
      <h3 className='fm-sub-title'>{'See our most popular Restaurant here!'}</h3>
      <Row gutter={[19, 19]}>
        {popularRestaurantsList.map((el, i) => {
          let path = `/bookings-restaurant-detail/${'restaurant'}/${cat_id}/${el.business_profile_id}`
          if (i <= 2) {
            return (
              <Col span={8}>
                <div className='fm-card-block'>
                  <Text className='ad-banner'>
                    <img
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = require('../../../assets/images/la-porchetta.png')
                      }}
                      src={el.cover_photo ? el.cover_photo :
                        require('../../../assets/images/la-porchetta.png')} alt=''
                      // onClick={() => this.props.history.push(path)}
                      style={{ cursor: 'pointer' }}
                    />
                  </Text>
                  <div className='fm-desc-stripe fm-cities-desc'>
                    <Row className='ant-row-center'>
                      <Col>
                        <h2>{capitalizeFirstLetter(el.business_name)}</h2>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            )
          }
        })}
      </Row>
      {popularRestaurantsList.length > 6 && <div className='align-center pt-25'>
        <Link to={`/bookings-popular-see-more/${TEMPLATE.RESTAURANT}/${cat_id}`}><Button type='default' size={'middle'} className='fm-btn-orange'>
          {'See All'}
        </Button></Link>
      </div>}
    </div>
    )
  }

  /**
  * @method renderCustomerReview
  * @description render customer review
  */
  renderCustomerReview = (restaurantCustomerReviews,cat_id) => {
    return (
      restaurantCustomerReviews.length !== 0 && <div className='wrap-inner customer-review-update'>
        <Title level={2} className='align-center pt-30 popular-view-title'>{'Customer Reviews'}</Title>
        <Row gutter={[21, 21]} className='pt-35 mb-25'>
          {restaurantCustomerReviews.map((el) => {
            return (
              <Col key={el.id} className='gutter-row' md={12}>
                <Card bordered={false} className={'detail-card horizontal fm-res-card fm-customer-card rs-fm-customer-card'}>
                  <div className='fm-customer-top'>
                    <div className='fm-img'><img src={el.image_thumbnail} alt='' /></div>
                    <div className='fm-description'>{el.review ? `“${el.review}”` : ''}</div>
                  </div>
                  <div className='fm-footer-description'>
                    <Row>
                      <Col span={13}>
                        <div className='rate-section'>
                          {el.rating ? `${el.rating}.0` : ''} <Rate disabled defaultValue={el.rating} />
                        </div>
                        <div className='fm-title'>
                          {capitalizeFirstLetter(el.restaurant_name)}
                        </div>
                        <div className='fm-address'>
                          {el.location}
                        </div>
                      </Col>
                      <Col span={11} className='fm-mt-auto'>
                        <div className='fm-date-box'>
                          {el.name} - {dateFormate1(el.created_at)}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }

  /**
    * @method renderCard
    * @description render card details
    */
  renderCard = (categoryData) => {
    let parameter = this.props.match.params
    if (Array.isArray(categoryData) && categoryData.length) {
        return (
            <Fragment>
                <Row gutter={[38, 38]}>
                    {categoryData.slice(0, 12).map((data, i) => {
                        return (
                            <RestaurantDetailCard
                                data={data} key={i} slug={parameter.categoryName}
                                col={6}
                            />
                        )
                    })}
                </Row>
            </Fragment>
        )
    } 
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isLoggedIn, popularRestaurantsList, restaurantCustomerReviews } = this.props;
    const { total_records,topRatedList,specialOffer, topImages, bottomImages, service } = this.state
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    return (
      <div className='App'>
        <Layout className="common-sub-category-landing booking-sub-category-landing">
          <Layout className="yellow-theme common-left-right-padd">
            <AppSidebar history={history} activeCategoryId={cat_id} showDropdown={false}/>
            <Layout className="fm-restaurant-wrap right-parent-block">
              <div className='sub-header fm-details-header'>
                <Title level={4} className='title'>{'RESTAURANT'}</Title>
              </div>
              <div className='inner-banner'>
                <CarouselSlider bannerItem={topImages} pathName='/' />
              </div>
              <Tabs type='card' className={'tab-style1 tab-yellow-style bookings-categories-serach'}>
                <TabPane tab='Delivery' key='1'>
                  <RestaurantSearch service={service} ref='child' handleSearchResponce={this.handleSearchResponce} />
                </TabPane>
              </Tabs>
              {/* <Tabs onTabClick={(e) => {
                this.setState({ service: e })

              }} type='card' className={'tab-style1 tab-yellow-style resturant-yellow-search'}>
                <TabPane tab='Delivery' key='delivery'>
                  <RestaurantSearch service={service} ref='child' handleSearchResponce={this.handleSearchResponce} />
                </TabPane>

                <TabPane tab='Pick Up' key='take_away'>
                  <RestaurantSearch service={service} ref='child' handleSearchResponce={this.handleSearchResponce} />
                </TabPane>
              </Tabs> */}
              <Content className='site-layout'>
                <div>
                  {/* This is popular restaurant removed as per the new design
                  {this.renderPopularRestaurant(popularRestaurantsList,cat_id)} */}
                  {/* {specialOffer.length !== 0 && <div className='wrap-inner fm-gradient-bg makeup-pro custom-special-offer'>
                    <Title level={2} className='pt-50'>{'Special Offer'}</Title>
                    <Text className='fs-16 text-black'>{'We offer everyday deals'}</Text>
                    {specialOffer.length !== 0 ? <Row gutter={[18, 18]} className='pt-50'>
                      {this.renderSpecialOffer()}

                    </Row> : <NoContentFound />}
                    {specialOffer.length > 9 && <div className='align-center bok-rest-btn-t-b-space'>
                      <Button
                        type='default'
                        size={'middle'}
                        className='fm-btn-orange'
                        onClick={() => {
                          this.props.history.push(`/bookings-see-all/${langs.key.special_offer}/${cat_id}`)
                        }}
                      >
                        {'See All'}
                      </Button>
                    </div>}
                  </div>} */}
                  {/* new Design changes 08/01/2021 */}
                   <div className='wrap-inner full-width-wrap-inner'>
                      <Breadcrumb separator='|' className='ant-breadcrumb-pad restaurent-ant-breadcrumb-pad'>
                          <Breadcrumb.Item>
                              <Link to='/'>Home</Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Item>
                              <Link to='/bookings'>Bookings</Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Item>{'Restaurant'}</Breadcrumb.Item>

                      </Breadcrumb>
                      <Tabs type='card' className={'tab-style2'}>
                        <TabPane tab='Daily Deals' key='1'>
                          {specialOffer.length !== 0 ? <Row gutter={[18, 18]} className='pt-50'>
                            {this.renderSpecialOffer()}
                            </Row> : <NoContentFound />}
                            {specialOffer.length > 9 && 
                              <div className='align-center bok-rest-btn-t-b-space'>
                                  <Button
                                    type='default'
                                    size={'middle'}
                                    className='fm-btn-orange'
                                    onClick={() => {
                                      this.props.history.push(`/bookings-see-all/${langs.key.special_offer}/${cat_id}`)
                                    }}
                                  >
                                    {'See All'}
                                  </Button>
                                </div>
                              }
                        </TabPane>
                          <TabPane tab='Top Rated' key='2'>
                            {topRatedList && topRatedList.length !== 0 ?<Row gutter={[18, 18]} className='pt-50'>
                              {this.renderCard(topRatedList)}
                            </Row> : <NoContentFound />}
                              {total_records > 2 && 
                                <div className='align-center bok-rest-btn-t-b-space'>
                                    <Button
                                      type='default'
                                      size={'middle'}
                                      className='fm-btn-orange'
                                      onClick={() => {
                                        this.props.history.push(`/bookings-see-all/${'restaurant-top-rated'}/${cat_id}`)
                                      }}
                                    >
                                      {'See All'}
                                    </Button>
                                  </div>
                                }
                          </TabPane>
                      </Tabs> 
                  </div>
                  {/* //Customer Reviews */}
                  {this.renderCustomerReview(restaurantCustomerReviews,cat_id)}
                </div>
                {/* <PopularSearchList parameter={parameter} /> */}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common, bookings } = store;
  
  const { savedCategories, categoryData } = common;
  let classifiedList = []
  let isEmpty = savedCategories.data.booking.length === 0 && savedCategories.data.retail.length === 0 && savedCategories.data.classified.length === 0 && (savedCategories.data.foodScanner === '' || (Array.isArray(savedCategories.data.foodScanner) && savedCategories.data.foodScanner.length === 0))
  if (auth.isLoggedIn) {
    if (!isEmpty) {
      isEmpty = false
      classifiedList = savedCategories.data.classified && savedCategories.data.classified.filter(el => el.pid === 0);
    } else {
      isEmpty = true
      classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
    }
  } else {
    isEmpty = true
    classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
  }

  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    restaurantCustomerReviews: Array.isArray(bookings.restaurantCustomerReviews) ? bookings.restaurantCustomerReviews : [],
    popularRestaurantsList: Array.isArray(bookings.popularRestaurantsList) ? bookings.popularRestaurantsList : [],
    classifiedList,
    isEmpty
  };
};
export default connect(
  mapStateToProps,
  {searchByRestaurent, getRestaurantSpecialOffer, enableLoading, disableLoading, getPopularRestaurant, getRestaurantCustomerReviews, getBannerById, openLoginModel, getFoodTypes }
)(RestaurantLandingPage);