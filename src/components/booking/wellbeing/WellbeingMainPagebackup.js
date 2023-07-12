

import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import SubHeader from '../common/SubHeader';
import { STATUS_CODES } from '../../../config/StatusCode'
import { Layout, Row, Col, Rate, Typography, Card, Tabs, Form, Input, Select, Checkbox, Button, Breadcrumb, Space } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { getBookingPromoAPI, getDailyDeals, enableLoading, disableLoading, getBannerById } from '../../../actions/index';
import { getClassfiedCategoryListing, getBookingSubcategory, getClassfiedCategoryDetail } from '../../../actions';
import { getChildCategory } from '../../../actions'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider';
import { langs } from '../../../config/localization';
import { getBookingSubcategoryRoute } from '../../../common/getRoutes';
import BannerCard from '../../common/bannerCard/BannerCard'
import DailyDealsCard from '../common/DailyDealsCard';
import NoContentFound from '../../common/NoContentFound'
import { TEMPLATE, DEFAULT_IMAGE_CARD } from '../../../config/Config';
import PopularSearchList from '../common/PopularSerach'
import { getBookingDailyDealsDetailRoutes } from '../../../common/getRoutes'
import { capitalizeFirstLetter } from '../../common'
import GeneralSearch from '../common/search-bar/WellbeingSearch'
const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const tempData = [{
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '30,000',
  category: 'subcategory',
  location: 'indore'
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '20,000',
  category: 'subcategory',
  location: 'indore'
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '5000',
  category: 'subcategory',
  location: 'indore'
}
]


class BookingBeautyLandingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: 'tab1',
      noTitleKey: 'app',
      classifiedList: [],
      subCategory: [],
      dailyDealsData: [],
      bookingPromoData: [],
      nutritionData: [],
      dietationData: [],
    };
  }

  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    let cat_id = this.props.match.params.categoryId
    let parameter = this.props.match.params
    this.props.enableLoading()
    this.getBannerData(cat_id)
    this.getDailyDealsRecord(cat_id)
    this.getPromoRecords(cat_id)
    this.props.getBookingSubcategory(parameter.categoryId, res => {
      if (res.status === STATUS_CODES.OK) {
        const subCategory = Array.isArray(res.data.data) ? res.data.data : []
        this.setState({ subCategory: subCategory })
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
      this.getBannerData(catIdNext)
      this.getDailyDealsRecord(catIdNext)
      this.getPromoRecords(catIdNext)
    }
  }

  /**
   * @method getDailyDealsRecord
   * @description get daily deals records
   */
  getDailyDealsRecord = (id) => {
    let requestData = {
      category_id: id
    }
    this.props.getDailyDeals(requestData, res => {
      if (res.status === 200) {
        let item = res.data && res.data.data
        
        let dailyDeals = item && item.data && Array.isArray(item.data) && item.data.length ? item.data : []
        let nutrition = dailyDeals.length && dailyDeals.filter(el => el.service_type === "nutrition")
        let dietation = dailyDeals.length && dailyDeals.filter(el => el.service_type === "dietation")
        this.setState({ dailyDealsData: dailyDeals, total: item.total, nutritionData: nutrition, dietationData: dietation })
        
      }
    })
  }

  /**
   * @method getPromoRecords
   * @description get make up promo records
   */
  getPromoRecords = (id) => {
    let requestData = {
      category_id: id
    }
    this.props.getBookingPromoAPI(requestData, res => {
      if (res.status === 200) {
        let item = res.data && res.data.data
        
        let promo = item && item.data && Array.isArray(item.data) && item.data.length ? item.data : []
        this.setState({ bookingPromoData: promo, total: item.total })
        
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
        const data = res.data.success && Array.isArray(res.data.success.banners) ? res.data.success.banners : ''
        // const banner = data && data.filter(el => el.moduleId === 3)
        const banner = data
        const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
        let image = top.length !== 0 && top.filter(el => el.categoryId == categoryId && el.subcategoryId === '')
        
        this.setState({ topImages: image })
      }
    })
  }


  /**
   * @method renderSubCategory
   * @description render subcategory
   */
  renderSubCategoryBtn = (childCategory) => {
    let parameter = this.props.match.params;
    return childCategory.length !== 0 && childCategory.map((el, i) => {
      let redirectUrl = getBookingSubcategoryRoute(TEMPLATE.WELLBEING, TEMPLATE.WELLBEING, parameter.categoryId, el.slug, el.id)
      return (
        <Button
          type={'primary'}
          size={'large'}
          onClick={() => {
            this.props.history.push(redirectUrl)
          }}
        >
          {el.name}
        </Button>
      );
    })
  }

  /**
   * @method renderDailyDeals
   * @description render massage daily deals
   */
  renderDailyDeals = () => {
    const { dailyDealsData } = this.state
    if (Array.isArray(dailyDealsData) && dailyDealsData.length) {
      return dailyDealsData.slice(0, 3).map((el, i) => {
        return (
          <Col className='gutter-row' md={6}>
            <DailyDealsCard data={el} />
          </Col>
        )
      })
    }
  }

  /**
   * @method selectTemplateRoute
   * @description navigate to detail Page
   */
  selectTemplateRoute = (el) => {
    const { handyman, type } = this.props
    let parameter = this.props.match.params
    let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : el.user && el.user.booking_cat_id
    let templateName = parameter.categoryName ? parameter.categoryName : el.category_name.toLowerCase()
    let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : el.subcategory_name.toLowerCase()
    let subCategoryId = parameter.subCategoryId ? parameter.subCategoryId : el.user && el.user.booking_sub_cat_id
    let classifiedId = el.user && el.user.user_id;
    let catName = ''
    let path = ''
    if (templateName === TEMPLATE.HANDYMAN || templateName.toLowerCase() === TEMPLATE.HANDYMAN) {
      path = getBookingDailyDealsDetailRoutes(templateName.toLowerCase(), cat_id, subCategoryId, subCategoryName, classifiedId)
      this.setState({ redirect: path })
    } else if (templateName === TEMPLATE.BEAUTY) {
      path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
      this.setState({ redirect: path })
    } else if (templateName === TEMPLATE.EVENT) {
      path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
      this.setState({ redirect: path })
    } else if (templateName === TEMPLATE.WELLBEING) {
      
      path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
      this.setState({ redirect: path })
    } else if (type === TEMPLATE.PSERVICES) {
      path = getBookingDailyDealsDetailRoutes(TEMPLATE.PSERVICES, cat_id, catName, classifiedId)
      this.setState({ redirect: path })
    } else if (templateName === TEMPLATE.PSERVICES) {
      path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
      this.setState({ redirect: path })
    }
  }

  /**
   * @method renderPromoCards
   * @description render makeup promo cards
   */
  renderPromoCards = () => {
    const { bookingPromoData } = this.state
    if (Array.isArray(bookingPromoData) && bookingPromoData.length) {
      return bookingPromoData.slice(0, 6).map((el, i) => {
        let image = (el && el.service && el.service.image !== undefined && el.service !== null) ? el.service.image : DEFAULT_IMAGE_CARD
        return (
          <Col className='gutter-row' md={8}>
            <Card
              bordered={false}
              className={'detail-card horizontal'}
              onClick={() => this.selectTemplateRoute(el)} style={{ cursor: 'pointer' }}
              cover={
                <img
                  src={image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE_CARD
                  }}
                  alt={''}
                />
              }
            >
              <div className='price-box'>
                <div className='price'>
                  {el.service ? capitalizeFirstLetter(el.service.class_name) : ''}
                </div>
              </div>
              <div className='sub-title'>
                {el.subcategory_name ? capitalizeFirstLetter(el.subcategory_name) : ''}
              </div>
              <div className='action-link'>
                {el.discount_percent ? `${el.discount_percent}% off` : ''}
              </div>
            </Card>
          </Col>
        )
      })
    }
  }

  renderLookingForRecords = (data) => {
    let title = '', image = ''
    if (Array.isArray(data) && data.length) {
      return data.slice(0, 3).map((el, i) => {
        title = el.service && el.service.class_name ? el.service.class_name : el.service.name ? el.service.name : ''
        image = (el.service && el.service.service_image !== undefined && el.service.service_image !== null) ? el.service.service_image : require('../../../assets/images/birthday-parties.png')
        return (
          <Col span={8}>
            <div className='fm-card-block' onClick={() => this.selectTemplateRoute(el)} style={{ cursor: 'pointer' }}>
              <Link className='ad-banner'>
                <img src={image} alt='' />
              </Link>
              <div className='fm-desc-stripe fm-cities-desc'>
                <Row className='ant-row-center'>
                  <Col>
                    <h2>{capitalizeFirstLetter(title)}</h2>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        )
      })
    }
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const { redirect, nutritionData, dietationData, bookingPromoData, dailyDealsData, classifiedList, topImages, subCategory, redirectTo } = this.state;
    
    const parameter = this.props.match.params;
    const { isLoggedIn } = this.props;
    let cat_id = this.props.match.params.categoryId
    let cat_name = this.props.match.params.categoryName
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          <AppSidebar history={history} activeCategoryId={cat_id} />
          <Layout className="right-parent-block">
            <SubHeader
              categoryName={TEMPLATE.WELLBEING}
              showAll={false}
            />

            <div className='inner-banner well'>
              {/* <img src={require('../../../assets/images/samuele-errico.png')} alt='' /> */}
              <CarouselSlider bannerItem={topImages} pathName='/' />
              <div className='main-banner-content'>
                {/* <Title level={2} className='text-white'>Wellbeing, building the life you want</Title>
                                <Text className='text-white fs-18'>Helping you to find the balance of your life in all areas</Text> */}
                {/* <Space className='mt-60 fm-btn-group'>
                                    {this.renderSubCategoryBtn(subCategory)}
                                </Space> */}
              </div>
            </div>
            <Tabs type='card' className={'tab-style1 job-search-tab bookings-categories-serach'}>
              <TabPane tab='Search' key='1' className="professional-jobsearch">
                <GeneralSearch handleSearchResponce={this.handleSearchResponce} />
              </TabPane>
            </Tabs>
            <Content className='site-layout'>
              {bookingPromoData.length !== 0 &&
                <div className='wrap-inner bg-gray-linear'>
                  <Title level={2} className='pt-30'>{'Fitness promo'}</Title>
                  <Text className='fs-16 text-black'>{'Deals are limited, book now before places run out!'}</Text>
                  {bookingPromoData.length !== 0 ? <Row gutter={[20, 20]} className='pt-50 fitness-promo'>
                    {this.renderPromoCards()}
                  </Row> : <NoContentFound />}
                  {bookingPromoData.length > 6 && <div className='align-center pt-25 pb-25'>
                    <Button
                      type='default'
                      className='fm-btn-orange'
                      size={'middle'}
                      onClick={() => {
                        this.props.history.push(`/bookings-see-all/${langs.key.fitness_promo}/${cat_id}`)
                      }}
                    >
                      {'See All'}
                    </Button>
                  </div>}
                </div>
              }
              {dailyDealsData.length !== 0 &&
                <div className='wrap-inner bg-gray-linear welling-card-detail'>
                  <Title level={2} className='pt-40'>{"Spa and Massage deals you don't want to miss"}</Title>
                  <Text className='fs-16 text-black'>{'Update your do with these latest Hair promotions'}</Text>

                  {dailyDealsData.length !== 0 ? <Row gutter={[38, 38]} className='pt-50'>
                    {this.renderDailyDeals()}
                  </Row> : <NoContentFound />}
                  {dailyDealsData.length > 3 && <div className='align-center pt-25 pb-25'>
                    <Button type='default'
                      className='fm-btn-orange'
                      size={'middle'}
                      onClick={() => {
                        this.props.history.push(`/bookings-see-more/daily-deals/${TEMPLATE.WELLBEING}/${cat_id}`)
                      }}
                    >
                      {'See All'}
                    </Button>
                  </div>}
                </div>
              }
              {nutritionData.length !== 0 &&
                <div className='wrap-inner bg-gray-linear fm-gradient-bg '>
                  <Title level={1} className='fm-block-title '>
                    {'Looking for Nutritionists?'}
                  </Title>
                  <h3 className='fm-sub-title '>{'Find your nutritionists near your area.'}</h3>
                  {nutritionData.length !== 0 ? <Row gutter={[19, 19]}>
                    {this.renderLookingForRecords(nutritionData)}
                  </Row> : <NoContentFound />}
                  {nutritionData.length > 3 && <div className='align-center pt-25 pb-25'>
                    <Button
                      type='default'
                      className='fm-btn-orange'
                      size={'middle'}
                      onClick={() => {
                        this.props.history.push(`/bookings-see-all/${langs.key.nutritionists}/${cat_id}`)
                      }}
                    >
                      {'See All'}
                    </Button>
                  </div>}
                </div>
              }
              {/* <div className='wrap-inner bg-gray-linear fm-gradient-bg fm-cities-cards'> */}
              {dietationData.length !== 0 &&
                <div className='wrap-inner bg-gray-linear fm-gradient-bg '>
                  <Title level={1} className='fm-block-title'>
                    {'Find Dietitians near you'}
                  </Title>
                  <h3 className='fm-sub-title '>{'Find your dietitions near your area.'}</h3>
                  {dietationData.length !== 0 ? <Row gutter={[19, 19]}>
                    {this.renderLookingForRecords(dietationData)}
                  </Row> : <NoContentFound />}
                  {dietationData.length > 3 && <div className='align-center pt-25 pb-25'>
                    <Button
                      type='default'
                      className='fm-btn-orange'
                      size={'middle'}
                      onClick={() => {
                        this.props.history.push(`/bookings-see-all/${langs.key.dietitians}/${cat_id}`)
                      }}
                    >
                      {'See All'}
                    </Button>
                  </div>}
                </div>
              }
              <PopularSearchList parameter={parameter} />
            </Content>
          </Layout>
        </Layout>
        {redirect && <Redirect push
          to={{
            pathname: redirect
          }}
        />
        }
      </Layout>
    );
  }
}


const mapStateToProps = (store) => {
  const { auth, classifieds } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedClassifiedList: classifieds.classifiedsList,
  };
}

export default connect(
  mapStateToProps,
  { getBookingPromoAPI, getDailyDeals, enableLoading, disableLoading, getClassfiedCategoryListing, getBookingSubcategory, getClassfiedCategoryDetail, getBannerById, getChildCategory }
)(BookingBeautyLandingPage);