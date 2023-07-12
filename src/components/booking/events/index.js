import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import SubHeader from '../common/SubHeader';
import {Breadcrumb, Layout, Row, Col, Typography, Button, Tabs } from 'antd';
import {newInBookings,getEventTypes, getDailyDeals, getPopularVenues, mostPopularEvents, enableLoading, disableLoading, getBannerById } from '../../../actions/index';
import { getBookingSubcategory } from '../../../actions'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider';
import { langs } from '../../../config/localization';
import { DEFAULT_IMAGE_CARD } from '../../../config/Config';
import NoContentFound from '../../common/NoContentFound'
import DailyDealsCard from '../common/DailyDealsCard';
import { capitalizeFirstLetter } from '../../common';
import GeneralSearch from '../common/search-bar/EventListSearch'
import TopRatedDetailCard from '../common/Card'
import { TEMPLATE } from '../../../config/Config'
import NewSidebar from '../NewSidebar';
import './event.less'
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
      topRatedList: [],
      isSearchResult: false,
      total:0,
      total_record:0,
      most_popular:[],
      isSidebarOpen: false
    };
  }

  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    this.props.enableLoading()
    let cat_id = this.props.match.params.categoryId
    this.getBannerData(cat_id)
    this.getTopRatedData(cat_id)
    this.getDailyDealsRecord(cat_id)
    this.getAllEventTypes(cat_id)
    this.props.mostPopularEvents(res => {
      if (res.status === 200) {
        let popularEvents = res.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []
        this.setState({ popularEvents: popularEvents })
      }
    })
    // this.props.getBookingSubcategory(parameter.categoryId, res => {
    //   if (res.status === STATUS_CODES.OK) {
    //     const subCategory = Array.isArray(res.data.data) ? res.data.data : []
    //     this.setState({ subCategory: subCategory })
    //   }
    // })
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
      this.getAllEventTypes(catIdNext)
    }
  }

  /**
  * @method getTopRatedData
  * @description get top rated records
  */
  getTopRatedData = (cat_id) => {
    const { isLoggedIn, loggedInDetail } = this.props
    const requestData = {
      user_id: isLoggedIn ? loggedInDetail.id : '',
      page: 1,
      per_page: 12,
      cat_id,
      sub_cat_id : '',
      filter: 'top_rated'
    }
    this.props.newInBookings(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        this.setState({ topRatedList: data, data: res.data, total_record: res.data.total })
      }
    })
    this.getMostPopularList()
  }

  /**
    * @method getMostPopularList
    * @description get most popular list
    */
   getMostPopularList = () => {
    const { isLoggedIn, loggedInDetail } = this.props
    let parameter = this.props.match.params
    let cat_id = parameter.categoryId
    const requestData = {
        user_id: isLoggedIn ? loggedInDetail.id : '',
        page: 1,
        per_page: 12,
        cat_id,
        filter: 'most_popular'
    }
    this.props.newInBookings(requestData, res => {
        this.props.disableLoading()
        if (res.status === 200) {
            const data = Array.isArray(res.data.data) ? res.data.data : [];
            this.setState({ most_popular: data })
        }
    })
  }

  /**
   * @method getEventTypes
   * @description get event types
   */
  getAllEventTypes = (cat_id) => {
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
        const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : ''
        // const banner = data && data.filter(el => el.moduleId === 3)
        const banner = data
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
  handleSearchResponce = (res, resetFlag, reqData) => {
    let cat_id = this.props.match.params.categoryId
    if (resetFlag) {
        this.setState({ isSearchResult: false });
        this.getTopRatedData(cat_id)
    } else {
        this.setState({ bookingList: res, isSearchResult: true, searchReqData: reqData })
    }
  }


  /**
 * @method renderPopularEvents
 * @description render popular events
 */
  renderPopularEvents = (item) => {
    if (Array.isArray(item) && item.length) {
      let list = item && item.slice(0, 9)
      return (
        <Fragment>
          <Row gutter={[19, 19]}>
            {list.map((el, i) => {
              return (
                <Col span={8}>
                  <div className='fm-card-block'>
                    <img
                      src={(el && el.image !== undefined && el.image !== null) ? el.image : DEFAULT_IMAGE_CARD}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD
                      }}
                      alt={(el && el.name !== undefined) ? el.name : ''}
                    />
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
  * @method renderCard
  * @description render card details
  */
  renderCard = (categoryData, type) => {
    let parameter = this.props.match.params
    if (Array.isArray(categoryData) && categoryData.length) {
      let list = this.state.isSearchResult ? categoryData : categoryData.slice(0, 12)
      return (
        <Fragment>
          <Row gutter={[18, 40]}>
              {list.slice(0, 12).map((data, i) => {
                return (
                  <TopRatedDetailCard
                    data={data} key={i} slug={parameter.categoryName}/>
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
   * @method render
   * @description render component
   */
  render() {
    const {isSidebarOpen,most_popular,total, total_record,isSearchResult,bookingList,topRatedList,eventTypes, dietaries, dailyDealsData, classifiedList, topImages, subCategory, redirectTo, popularEvents } = this.state;
    let cat_id = this.props.match.params.categoryId
    let cat_name = this.props.match.params.categoryName
    return (
      <Layout className="event-landing common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          {/* <AppSidebar history={history} activeCategoryId={cat_id} /> */}
          <NewSidebar 
            history={history} 
            activeCategoryId={cat_id}  
            showAll={false} 
            categoryName={TEMPLATE.EVENT}
            isSubcategoryPage={true}
            toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
          />
          <Layout className="right-parent-block event-type-site-layout">
            <SubHeader showAll={false} categoryName={'EVENT'} />
            <div className='inner-banner well'>
              <CarouselSlider bannerItem={topImages} pathName='/' />
            </div>
            <Tabs type='card' className={'tab-style1 job-search-tab bookings-categories-serach'}>
              <TabPane tab='Search' key='1' className="professional-jobsearch">
                <GeneralSearch 
                  eventTypes={popularEvents}
                  dietaries={dietaries}
                  handleSearchResponce={this.handleSearchResponce} 
                  landingPage={true}
                />
              </TabPane>
            </Tabs>
            <Content className='site-layout '>
              <div className='wrap-inner full-width-wrap-inner pt-0'>
                <Breadcrumb separator='|' className='ant-breadcrumb-pad pt-0'>
                  <Breadcrumb.Item>
                    <Link to='/'>Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to='/bookings'>Bookings</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                      {`Events`}
                  </Breadcrumb.Item>
                </Breadcrumb>
                {!isSearchResult ? <Tabs type='card' className={'tab-style2'} >
                  {/* <TabPane tab='Daily Deals' key='1'>
                    {dailyDealsData.length !== 0 ? <Row gutter={[38, 38]} >
                      {this.renderDailyDeals()}
                    </Row> : <NoContentFound />}
                    {total >= 9 && <div className='align-center sub-category-tab-see-btn-pad'>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link to={`/bookings-see-more/daily-deals/${cat_name}/${cat_id}`} className='btn fm-btn-white'>See All</Link>
                      </Col>
                    </div>}
                  </TabPane> */}
                  <TabPane tab='Top Rated' key='2'>
                    {this.renderCard(topRatedList, 'top_rated')}
                    {total_record >= 9 && <div className='align-center sub-category-tab-see-btn-pad'>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link to={`/bookings-see-more/top-rated/${TEMPLATE.EVENT}/${cat_id}`} className='btn fm-btn-white'>See All</Link>
                      </Col>
                    </div>}
                  </TabPane>
                  {/* <TabPane tab='Most Popular' key='3'>
                    {this.renderPopularEvents(popularEvents)}
                    {popularEvents && popularEvents.length !==0 && <div className='align-center sub-category-tab-see-btn-pad'>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link to={`/bookings-popular-see-more/${'events'}/${cat_id}`} className='btn fm-btn-white'>See All</Link>
                      </Col>
                    </div>}
                  </TabPane> */}
                  <TabPane tab='Most Popular' key='3'>
                    {this.renderCard(most_popular)}
                    <div className='align-center see-btn-pad'>
                        {most_popular && most_popular.length !== 0 &&
                        <Button type='default' size={'middle'}
                            onClick={() => {
                                this.props.history.push(`/bookings-see-more/most-popular/${TEMPLATE.EVENT}/${cat_id}`)
                            }}>
                            {'See All'}
                        </Button>}
                    </div>
                  </TabPane>
                </Tabs> :
                  this.renderCard(bookingList, 'top_rated')}
              </div>
              {/* {popularEvents.length !== 0 && 
                <div className='wrap-inner browser-by-event'>
                  <Title level={1} className='align-center pt-30 pb-30'>{'Popular Venue Types'}</Title>
                    {this.renderPopularEvents(popularEvents)}
                  {popularEvents && popularEvents.length !== 0 &&
                    <div>
                      <div className='align-center pt-25 pb-25'>
                        <Button type='default' className='fm-btn-orange' size={'middle'}>
                          <Link to={`/bookings-popular-see-more/${'events'}/${cat_id}`}>See All</Link>
                        </Button>
                      </div>
                  </div>}
                </div>
              } */}
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
  {newInBookings,getEventTypes, getDailyDeals, mostPopularEvents, getPopularVenues, enableLoading, disableLoading, getBannerById, getBookingSubcategory }
)(EventLandingPage);