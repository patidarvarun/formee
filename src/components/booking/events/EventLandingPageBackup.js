import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import SubHeader from '../common/SubHeader';
import { getBookingSubcategoryRoute } from '../../../common/getRoutes';
import { Layout, Row, Col, Typography, Card, Button, Space, Tabs } from 'antd';
import {getEventTypes, getDailyDeals, getPopularVenues, mostPopularEvents, enableLoading, disableLoading, getBannerById } from '../../../actions/index';
import { getBookingSubcategory } from '../../../actions'
import { STATUS_CODES } from '../../../config/StatusCode'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider';
import { langs } from '../../../config/localization';
import BookingEventCard from '../../common/bookingEventCard/bookingEventCard';
import './event.less'
import { TEMPLATE, DEFAULT_IMAGE_CARD } from '../../../config/Config';
import NoContentFound from '../../common/NoContentFound'
import PopularSearchList from '../common/PopularSerach'
import DailyDealsCard from '../common/DailyDealsCard';
import { capitalizeFirstLetter } from '../../common';
//import GeneralSearch from '../common/search-bar/EventSearch'
import GeneralSearch from '../common/search-bar/EventListSearch'
//import GeneralSearch from '../common/search-bar/EventListEntertainmentSearch'
const { Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

class EventLandingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: 'tab1',
      noTitleKey: 'app',
      classifiedList: [],
      subCategory: [],
      popularEvents: [],
      dailyDealsData: [],
      eventTypes: [],
      dietaries: [],
    };
  }

  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    this.props.enableLoading()
    let parameter = this.props.match.params
    
    let cat_id = this.props.match.params.categoryId
    this.getBannerData(cat_id)
    this.getDailyDealsRecord(cat_id)
    this.getEventTypes(cat_id)
    this.props.getPopularVenues()
    this.props.mostPopularEvents(res => {
      
      if (res.status === 200) {
        let popularEvents = res.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []
        this.setState({ popularEvents: popularEvents })
      }
    })
    this.props.getBookingSubcategory(parameter.categoryId, res => {
      
      if (res.status === STATUS_CODES.OK) {
        const subCategory = Array.isArray(res.data.data) ? res.data.data : []
        this.setState({ subCategory: subCategory })
      }
    })
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props from component
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial = this.props.match.params.cat_id
    let catIdNext = nextprops.match.params.cat_id
    if (catIdInitial !== catIdNext) {
      this.getBannerData(catIdNext)
      this.getDailyDealsRecord(catIdNext)
    }
  }

  /**
   * @method getEventTypes
   * @description get event types
   */
  getEventTypes = (cat_id) => {
    this.props.getEventTypes({ booking_category_id: cat_id }, (res) => {
      if (res.status === 200) {
        this.setState({ eventTypes: res.data.event_types, dietaries: res.data.dietaries })
      }
    })
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
        this.setState({ dailyDealsData: dailyDeals, total: item.total })
        
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
      let redirectUrl = getBookingSubcategoryRoute(TEMPLATE.EVENT, TEMPLATE.EVENT, parameter.categoryId, el.slug, el.id)
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
 * @method renderPopularEvents
 * @description render popular events
 */
  renderPopularEvents = (item) => {
    if (Array.isArray(item) && item.length) {
      let list = item && item.slice(0, 3)
      return (
        <Fragment>
          <Row gutter={[19, 19]}>
            {list.map((el, i) => {
              return (
                <Col span={8}>
                  <div className='fm-card-block'>
                    {/* <Link to='/' className='ad-banner'> */}
                    <img
                      src={(el && el.image !== undefined && el.image !== null) ? el.image : DEFAULT_IMAGE_CARD}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD
                      }}
                      alt={(el && el.name !== undefined) ? el.name : ''}
                    />
                    {/* </Link> */}
                    <div className='fm-desc-stripe fm-cities-desc'>
                      <Row className='ant-row-center'>
                        <Col>
                          <h2>{capitalizeFirstLetter(el.name)}</h2>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              )
            })}

          </Row>
        </Fragment>
      )
    } else {
      return <NoContentFound />
    }
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
   * @method render
   * @description render component
   */
  render() {
    const {eventTypes, dietaries, dailyDealsData, classifiedList, topImages, subCategory, redirectTo, popularEvents } = this.state;
    const { isLoggedIn, popularVenueList } = this.props;
    let parameter = this.props.match.params
    let cat_id = this.props.match.params.categoryId
    let cat_name = this.props.match.params.categoryName
    return (
      // <Layout className=" yellow-theme event-landing">
      <Layout className="event-landing common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          <AppSidebar history={history} activeCategoryId={cat_id} />
          <Layout className="right-parent-block">
            <SubHeader showAll={false} categoryName={'EVENT'} />
            <div className='inner-banner well'>
              <CarouselSlider bannerItem={topImages} pathName='/' />
              <div className='main-banner-content'>
                {/* <Title level={2} className='text-white'>Get ready for that big event</Title>
                                <Text className='text-white fs-18'>Receive no-obligation quotes from reviewed, rated & trusted in minutes.</Text> */}
                {/* <Space className='mt-60' className='fm-btn-group'>
                  {this.renderSubCategoryBtn(subCategory)}
                </Space> */}
              </div>
            </div>
            <Tabs type='card' className={'tab-style1 job-search-tab bookings-categories-serach'}>
              <TabPane tab='Search' key='1' className="professional-jobsearch">
                <GeneralSearch 
                  eventTypes={eventTypes}
                  dietaries={dietaries}
                  handleSearchResponce={this.handleSearchResponce} 
                  landingPage={true}
                />
              </TabPane>
            </Tabs>
            <Content className='site-layout'>
              {popularVenueList.length !== 0 && <div className='wrap-inner bg-gray-linear'>
                <Title level={2} className='pt-30'>{'Featured Venue'}</Title>
                <Row gutter={[20, 20]} className='pt-30'>
                  {popularVenueList.map((el, i) => {
                    if (i <= 2) {
                      return (<Col className='gutter-row event-feature' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal'}
                          cover={
                            <img
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = require('../../../assets/images/makeup.png')
                              }}
                              src={el.image ? el.image :
                                require('../../../assets/images/makeup.png')}
                              alt='' />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {capitalizeFirstLetter(el.name)}
                            </div>
                          </div>
                          <div className='sub-title align-left' align="left">
                            {capitalizeFirstLetter(el.name)}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                          </div>
                        </Card>
                      </Col>)
                    }
                  })
                  }
                </Row>
                <div className='align-center sub-category-btm-see-btn-pad'>
                  <Button
                    onClick={() => {
                      this.props.history.push(`/bookings-popular-see-more/${TEMPLATE.EVENT}/${langs.key.featured_venue}/${cat_id}`)
                    }}
                    type='default' className='fm-btn-orange' size={'middle'}>
                    {'See All'}
                  </Button>
                </div>
              </div>}
              {/* Daily deals section is not applicable for events */}
              {/* <div className='wrap-inner bg-gray-linear'>
                                <Title level={2} className='pt-30'>{"Deals you don't want to miss"}</Title>
                                <Text className='fs-16 text-black'>{'Update your latest promotions'}</Text>
                                 {dailyDealsData.length !==0 ? <Row gutter={[38, 38]} className='pt-50'>
                                    {this.renderDailyDeals()}
                                </Row>: <NoContentFound/>}
                                {dailyDealsData.length > 3 &&<div className='align-center pt-25 pb-25'>
                                    <Button type='default'  className='fm-btn-orange' size={'middle'}>
                                        {'See All'}
                                    </Button>
                                </div>}
                            </div> */}
              {popularEvents.length !== 0 && <div className='wrap-inner bg-gray-linear fm-gradient-bg '>
                <Title level={1} className='fm-block-title'>
                  {'Popular Events'}
                </Title>
                <h3 className='fm-sub-title'>{'Simple booking to your event'}</h3>
                {this.renderPopularEvents(popularEvents)}
                {popularEvents && popularEvents.length !== 0 &&
                  <div>
                    <div className='align-center pt-25 pb-25'>
                      <Button type='default' className='fm-btn-orange' size={'middle'}>
                        <Link to={`/bookings-popular-see-more/${'events'}/${cat_id}`}>See All</Link>
                      </Button>
                    </div>
                  </div>}
              </div>}
              {popularVenueList.length !== 0 && <div className='wrap-inner nnn bg-gray-linear fm-gradient-bg fm-cities-cards'>
                <Title level={1} className='fm-block-title'>
                  {'Popular Venue Types'}
                </Title>
                <h3 className='fm-sub-title'>{'Find your best venue'}</h3>
                <Row gutter={[19, 19]}>
                  {popularVenueList.map((el, i) => {
                    if (i <= 2) {
                      return (<Col span={8}>
                        <div className='fm-card-block'>
                          <img
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = require('../../../assets/images/makeup.png')
                            }}
                            src={el.image ? el.image :
                              require('../../../assets/images/makeup.png')}
                            alt='' />
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>{capitalizeFirstLetter(el.name)}</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>)
                    }
                  })}
                </Row>
                <div className='align-center pt-25 pb-25'>
                  <Button
                    onClick={() => {
                      this.props.history.push(`/bookings-popular-see-more/${TEMPLATE.EVENT}/${langs.key.popular_venue}/${cat_id}`)
                    }}
                    type='default' className='fm-btn-orange' size={'middle'}>
                    {'See All'}
                  </Button>
                </div>
              </div>}
              <PopularSearchList parameter={parameter} />
            </Content>
          </Layout>
        </Layout>
        {redirectTo && <Redirect push to={{
          pathname: redirectTo,
          state: {
            parentCategory: classifiedList.length && classifiedList[0].catname,
            cat_id: cat_id
          }
        }}
        />}
      </Layout>
    );
  }
}


const mapStateToProps = (store) => {
  const { auth, classifieds, bookings } = store;
  
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedClassifiedList: classifieds.classifiedsList,
    popularVenueList: Array.isArray(bookings.popularVenueList) ? bookings.popularVenueList : [],
  };
}

export default connect(
  mapStateToProps,
  {getEventTypes, getDailyDeals, mostPopularEvents, getPopularVenues, enableLoading, disableLoading, getBannerById, getBookingSubcategory }
)(EventLandingPage);