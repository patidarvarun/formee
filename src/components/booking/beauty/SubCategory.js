import React, { Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import { Button, Layout, Row, Col, Typography, Tabs, Breadcrumb, Card } from 'antd';
import { langs } from '../../../config/localization';
import { popularSpaWellness, getDailyDeals, getPopularFitnessTypes, newInBookings, getEventTypes, getFitnessTypes, mostPapularList, getBannerById, enableLoading, disableLoading } from '../../../actions/index';
import { openLoginModel } from '../../../actions';
import DailyDealsDetailCard from '../common/BeautyCard'
import TopRatedDetailCard from '../common/Card'
import { getBookingSubCatDetailRoute } from '../../../common/getRoutes';
import history from '../../../common/History';
import WellBeingFitnessSearch from '../common/search-bar/WellbeingSearch'
import GeneralSearch from '../common/search-bar/GeneralSearch'
import EventSearch from '../common/search-bar/EventListSearch'
import { CarouselSlider } from '../../common/CarouselSlider'
import SubHeader from '../common/SubHeader'
import NoContentFound from '../../common/NoContentFound'
import { converInUpperCase, capitalizeFirstLetter } from '../../common'
import DailyDealsCard from '../common/DailyDealsCard';
import { TEMPLATE } from '../../../config/Config';
import { getBookingCatLandingRoute, getBookingSearchRoute } from '../../../common/getRoutes'
import NewSidebar from '../NewSidebar';
const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

class SubCategory extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      key: 'tab1',
      noTitleKey: 'app',
      bookingList: [],
      subCategory: [],
      filteredData: [],
      isFilterPage: false,
      isSearchResult: false,
      catName: '',
      isOpen: false,
      searchLatLng: '',
      mostRecentList: [],
      topRatedList: [],
      papularViewData: [],
      searchReqData: {},
      viewAll: false,
      mostPapular: [],
      bottomImages: [],
      eventTypes: [],
      dietaries: [],
      data: '',
      total_record: '', total: '',
      tabkey: 1,
      popularFitness: [],
      dailyDealsData: [],
      popularSpa: [],
      most_popular:[],
      isSidebarOpen: false 
    };
  }

  /**
  * @method componentWillReceiveProps
  * @description receive props
  */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial = this.props.match.params.categoryId
    let catIdNext = nextprops.match.params.categoryId
    let catNameNext = nextprops.match.params.categoryName
    let subCatIdInitial = this.props.match.params.subCategoryId
    let subCatIdNext = nextprops.match.params.subCategoryId
    let subCatNameNext = nextprops.match.params.subCategoryName

    if ((catIdInitial !== catIdNext) || (subCatIdInitial !== subCatIdNext)) {
      this.props.enableLoading()
      this.getMostRecentData(catIdNext, subCatIdNext)
      this.getDailyDealsRecord(catIdNext, subCatIdNext)
      const id = nextprops.match.params.subCategoryId ? nextprops.match.params.subCategoryId : nextprops.match.params.categoryId
      this.getBannerData(id)
      if (subCatNameNext == langs.key.fitness) {
        this.props.getFitnessTypes((res) => { })
      }
      else if (catNameNext == langs.key.events) {
        this.props.getEventTypes({ booking_category_id: subCatIdNext }, (res) => {
          if (res.status === 200) {
            this.setState({ eventTypes: res.data.event_types, dietaries: res.data.dietaries })
          }
        })
      }
    }
  }

  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    this.props.enableLoading()
    let parameter = this.props.match.params
    let sub_cat_name = this.props.match.params.subCategoryName;
    let sub_cat_id = this.props.match.params.subCategoryId
    let cat_id = this.props.match.params.categoryId
    let cat_name = this.props.match.params.categoryName
    this.getMostRecentData(cat_id, sub_cat_id)
    this.getMostPopularData(cat_id, sub_cat_id)
    this.getDailyDealsRecord(cat_id, sub_cat_id)
    this.getPopularSpa()
    let id = parameter.subCategoryId ? parameter.subCategoryId : parameter.categoryId
    this.getBannerData(id)
    if (sub_cat_name == langs.key.fitness) {
      this.props.getFitnessTypes((res) => { })
      this.props.getPopularFitnessTypes(res => {
        if (res.status === 200) {
          let data = res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []
          
          this.setState({ popularFitness: data })
        }
      })
    }
    else if (cat_name == langs.key.events) {
      this.props.getEventTypes({ booking_category_id: sub_cat_id }, (res) => {
        if (res.status === 200) {
          this.setState({ eventTypes: res.data.event_types, dietaries: res.data.dietaries })
        }
      })
    }
  }

  /**
    * @method getPopularSpa
    * @description get popular spa wellness
    */
  getPopularSpa = () => {
    this.props.popularSpaWellness(res => {
      if (res.status === 200) {
        let data = res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []
        
        this.setState({ popularSpa: data })
      }
    })
  }

  /**
   * @method getDailyDealsRecord
   * @description get daily deals records
   */
  getDailyDealsRecord = (id, sub_cat_id) => {
    this.setState({ dailyDealsData: [] })
    let requestData = {
      category_id: id,
      sub_category_id: sub_cat_id
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
  * @method getMostPopularData
  * @description get most papular data
  */
  getMostPopularData = () => {
    this.props.mostPapularList(res => {
      if (res.status === 200) {
        const data = res.data.data && res.data.data.feactured_category
        this.setState({ imageUrl: res.data.data.imageurl, mostPapular: data })
      }
    })
  }

  /**
    * @method getBannerData
    * @description get banner detail
    */
  getBannerData = (categoryId) => {
    let parameter = this.props.match.params
    this.props.getBannerById(3, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : ''
        const banner = data && data.filter(el => el.moduleId === 3)
        const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
        let temp = [], image;
        image = top.length !== 0 && top.filter(el => el.subcategoryId == categoryId)
        temp = image
        if (temp.length === 0) {
          image = top.length !== 0 && top.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
        }
        this.setState({ topImages: image })
      }
    })
  }

  /**
  * @method getMostRecentData
  * @description get most recent booking data
  */
  getMostRecentData = (cat_id, sub_cat_id) => {
    const { isLoggedIn, loggedInDetail } = this.props
    const requestData = {
      user_id: isLoggedIn ? loggedInDetail.id : '',
      page: 1,
      per_page: 12,
      cat_id,
      sub_cat_id
    }
    this.props.newInBookings(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        this.setState({ mostRecentList: data, data: res.data, total_record: res.data.total })
      }
    })
    this.getTopRatedData(cat_id, sub_cat_id)
  }

  /**
  * @method getTopRatedData
  * @description get top rated records
  */
  getTopRatedData = (cat_id, sub_cat_id) => {
    const { isLoggedIn, loggedInDetail } = this.props
    const requestData = {
      user_id: isLoggedIn ? loggedInDetail.id : '',
      page: 1,
      per_page: 12,
      cat_id,
      sub_cat_id,
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
        filter: 'most_popular',
        sub_cat_id: parameter.subCategoryId
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
  * @method onTabChange
  * @description manage tab change
  */
  onTabChange = (key, type) => {
    this.setState({ [type]: key, tabkey: key });
  };



  /** 
   * @method handleSearchCall
   * @description Call Action for Classified Search
   */
  handleSearchCall = () => {
    this.props.newInBookings(this.state.searchReqData, (res) => {
      this.setState({ bookingList: res.data.data, total_record: res.data.total })
    })
  }


  /** 
  * @method handleSearchResponce
  * @description Call Action for Classified Search
  */
  handleSearchResponce = (res, resetFlag, reqData, total_record) => {
    let cat_id = this.props.match.params.categoryId
    let cat_name = this.props.match.params.categoryName
    let sub_cat_id = this.props.match.params.subCategoryId
    let sub_cat_name = this.props.match.params.subCategoryName
    let searchPagePath = getBookingSearchRoute(cat_name, cat_name, cat_id, sub_cat_name, sub_cat_id)
    if (resetFlag) {
      this.setState({ isSearchResult: false });
      this.getMostRecentData(cat_id, sub_cat_id)
    } else {
      this.setState({ bookingList: res, searchReqData: reqData })
      this.props.history.push({
        pathname: searchPagePath,
        state: {
          bookingList: res,
          total_record: total_record,
          multipleChoices: sub_cat_name == langs.key.fitness ? reqData.selectedItemsName : sub_cat_name,
          selectedItems: sub_cat_name == langs.key.fitness ? reqData.selectedItems : [],
          searchReqData: reqData
        }
      })
    }
  }

  /** 
  * @method renderPopularEventType
  * @description render popular event
  */
  renderPopularEventType = (data) => {
    const { isLoggedIn, loggedInDetail } = this.props
    let cat_id = this.props.match.params.categoryId
    let cat_name = this.props.match.params.categoryName
    let sub_cat_id = this.props.match.params.subCategoryId
    let sub_cat_name = this.props.match.params.subCategoryName
    let searchPagePath = getBookingSearchRoute(cat_name, cat_name, cat_id, sub_cat_name, sub_cat_id)
    const requestData = {
      user_id: isLoggedIn ? loggedInDetail.id : '',
      page: 1,
      per_page: 12,
      event_type_id: data.id,
      sub_cat_id
    }
    this.props.newInBookings(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        this.props.history.push({
          pathname: searchPagePath,
          state: {
            bookingList: data,
            multipleChoices: sub_cat_name,
            selectedItems: []
          }
        })
      }
    })

  }


  /**
  * @method renderCard
  * @description render card details
  */
  renderCard = (categoryData, type) => {
    let parameter = this.props.match.params
    let cat_id = parameter.categoryId
    let sub_cat_id = parameter.subCategoryId

    if (Array.isArray(categoryData) && categoryData.length) {
      let list = this.state.isSearchResult ? categoryData : categoryData.slice(0, 12)
      return (
        <Fragment>
          {type === langs.key.daily_deals ? <Row gutter={[20, 20]}>
            {list.slice(0, 12).map((data, i) => {
              return (
                <Col span={6} >
                  <DailyDealsDetailCard
                    data={data} key={i} slug={parameter.categoryName}
                    callNext={() => {
                      if (this.state.isSearchResult) {
                        this.handleSearchCall()
                      } else {
                        this.getMostRecentData(cat_id, sub_cat_id)
                      }
                    }}
                  />
                </Col>
              )
            })}
          </Row> : <Row gutter={[18, 40]}>
              {list.slice(0, 12).map((data, i) => {
                return (
                  <TopRatedDetailCard
                    data={data} key={i} slug={parameter.categoryName}
                    callNext={() => {
                      if (this.state.isSearchResult) {
                        this.handleSearchCall()
                      } else {
                        this.getMostRecentData(cat_id)
                      }
                    }}
                  />
                )
              })}
            </Row>}
        </Fragment>
      )
    } else {
      return <NoContentFound />
    }
  }

  /**
  * @method renderEventsType
  * @description render events type
  */
  renderEventsType = (type, categoryData) => {
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[20, 20]} className="event-type">
            {categoryData && categoryData.slice(0, 9).map((data, i) => {
              return (
                <Col span={8} key={i}>
                  <div className='fm-card-block' onClick={() => this.renderPopularEventType(data)} style={{ cursor: 'pointer' }}>
                    <img
                      src={(data && data.image !== undefined && data.image !== null) ? data.image : require('../../../assets/images/birthday-parties.png')}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = require('../../../assets/images/birthday-parties.png')
                      }}
                      alt={type === 'events' && (data && data.title !== undefined) ? data.title : ''}
                    />
                    <div className='fm-desc-stripe fm-cities-desc'>
                      <Row className='ant-row-center'>
                        <Col>
                          <h2>{type === 'events' ? capitalizeFirstLetter(data.name) : capitalizeFirstLetter(data.class_name)}</h2>
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
      return dailyDealsData.slice(0, 12).map((el, i) => {
        return (
          <Col className='gutter-row' md={6}>
            <DailyDealsCard data={el} />
          </Col>
        )
      })
    }
  }

  /**
   * @method renderPopularSpaWellNess
   * @description render popular spa wellness
   */
  renderPopularSpaWellNess = (data) => {
    // let data = [1,2,3,4,5,6]
    if (data && data.length) {
      return data && data.slice(0, 9).map((el, i) => {
        return (
          <Col md={8}>
            <Card
              onClick={() => this.wellbeingSpaRoutes(el)} style={{ cursor: 'pointer' }}
              bordered={false}
              className={'detail-card horizontal'}
              cover={
                <img
                  src={el.cover_photo ? el.cover_photo : require('../../../assets/images/card-img.png')}
                  alt={''}
                />
              }
            >
              <div className='price-box'>
                <div className='price'>
                  {el.title ? el.title : ''}
                </div>
              </div>
              <div className='sub-title align-left'>
                Bookings Available
                       </div>
              <div className='mt-10 price-box'>
                <div className="">
                  from <b>{`AU$${el.total_amount}`}</b> <br /> per adult
                           </div>
                {/* <div className="discount-sect">
                               <Title className="mb-0" level={3}> 35%</Title>off
                           </div> */}
              </div>
            </Card>
          </Col>
        )
      })
    }
  }

  /***
  * @method wellbeingSpaRoutes
  * @description navigate to detail Page
  */
  wellbeingSpaRoutes = (el) => {
    let cat_id = el.booking_cat_id
    let templateName = el.category_name
    let subCategoryName = el.sub_category_name
    let subCategoryId = el.booking_sub_cat_id
    let classifiedId = el.user_id;
    let path = ''
    if (templateName === TEMPLATE.WELLBEING) {
      path = getBookingSubCatDetailRoute(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
      this.setState({ redirect: path })
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const {isSidebarOpen,most_popular, redirect, popularSpa, total, dailyDealsData, popularFitness, tabkey, total_record, data, bottomImages, eventTypes, dietaries, topRatedList, mostRecentList, redirectTo, bookingList, topImages, subCategory, isSearchResult } = this.state;
    const parameter = this.props.match.params;
    let total_count = data && data.total
    let cat_id = parameter.categoryId;
    let cat_name = parameter.categoryName;
    let sub_cat_name = parameter.subCategoryName;
    let sub_cat_id = parameter.subCategoryId
    let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName
    let categoryPagePath = getBookingCatLandingRoute(cat_name, cat_id, cat_name)
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd booking-parent-sub-category">
          {/* <AppSidebar 
            history={history} 
            activeCategoryId={sub_cat_id ? sub_cat_id : cat_id}
            isSubcategoryPage={true}  
            moddule={1} 
          /> */}
          <NewSidebar 
            history={history} 
            activeCategoryId={sub_cat_id ? sub_cat_id : cat_id}
            isSubcategoryPage={true}  
            moddule={1} 
            showAll={false}
            toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
          />
          <Layout className="right-parent-block">            
            <div className='inner-banner'>
            <SubHeader showAll={false}/>
              <CarouselSlider bannerItem={topImages} pathName='/' />
              {(cat_name === langs.key.wellbeing || cat_name === langs.key.beauty)  ? <WellBeingFitnessSearch ref='child' handleSearchResponce={this.handleSearchResponce} tabkey={'2'} /> :
              (cat_name === langs.key.events) ? <EventSearch dietaries={dietaries} eventTypes={eventTypes} handleSearchResponce={this.handleSearchResponce} tabkey={tabkey} /> : <GeneralSearch ref='child' handleSearchResponce={this.handleSearchResponce} tabkey={tabkey} />}
            </div>            
            <Content className='site-layout'>
              <div className='wrap-inner full-width-wrap-inner'>
                <Breadcrumb separator='|' className='ant-breadcrumb-pad'>
                  <Breadcrumb.Item>
                    <Link to='/'>Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to='/bookings'>Bookings</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to={categoryPagePath}>
                      {`${converInUpperCase(parameter.categoryName)}`}
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    {subCategoryName && `${converInUpperCase(subCategoryName)}`}
                  </Breadcrumb.Item>
                </Breadcrumb>
                {!isSearchResult ? <Tabs type='card' className={'tab-style2'} onChange={this.onTabChange}>
                  {cat_name !== langs.key.events && <TabPane tab='Daily Deals' key='1'>
                    {dailyDealsData.length !== 0 ? <Row gutter={[38, 38]} >
                      {this.renderDailyDeals()}
                    </Row> : <NoContentFound />}
                    {total >= 9 && <div className='align-center sub-category-tab-see-btn-pad'>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link to={`/bookings-see-more/daily-deals/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`} className='btn fm-btn-white'>See All</Link>
                      </Col>
                    </div>}
                  </TabPane>}
                  <TabPane tab='Top Rated' key='2'>
                    {this.renderCard(topRatedList, 'top_rated')}
                    {total_record >= 9 && <div className='align-center sub-category-tab-see-btn-pad'>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link to={`/bookings-see-more/top-rated/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`} className='btn fm-btn-white'>See All</Link>
                      </Col>
                    </div>}
                  </TabPane>
                  {/* {(cat_name == langs.key.events || sub_cat_name == langs.key.fitness || sub_cat_name == langs.key.spa) &&
                  <TabPane tab='Most Popular' key='3'>
                    {(cat_name == langs.key.events) &&  this.renderEventsType('events', eventTypes)}
                    {(cat_name == langs.key.events) && eventTypes.length !== 0 && <div className='align-center sub-category-tab-see-btn-pad'>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link to={`/bookings-popular-see-more/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`} className='btn fm-btn-white'>See All</Link>
                      </Col>
                    </div>}
                   
                    {(sub_cat_name == langs.key.fitness) &&  this.renderEventsType('fitness', popularFitness)}
                    {(sub_cat_name == langs.key.fitness) && popularFitness.length !== 0 && <div className='align-center sub-category-tab-see-btn-pad'>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link  to={`/bookings-popular-see-more/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`} className='btn fm-btn-white'>See All</Link>
                      </Col>
                    </div>}
                     
                     {(sub_cat_name == langs.key.spa) &&  
                      <Row gutter={[0, 45]}>
                        {this.renderPopularSpaWellNess(popularSpa)}
                      </Row>}
                    {(sub_cat_name == langs.key.spa) && popularSpa.length !== 0 && <div className='align-center sub-category-tab-see-btn-pad'>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link  to={`/bookings-see-all/spa-wellness/${cat_id}`} className='btn fm-btn-white'>See All</Link>
                      </Col>
                    </div>}
                  </TabPane>} */}
                   <TabPane tab='Most Popular' key='3'>
                      {this.renderCard(most_popular)}
                      <div className='align-center see-btn-pad'>
                          {most_popular && most_popular.length !== 0 &&
                          <Button type='default' size={'middle'}
                              onClick={() => {
                                  this.props.history.push(`/bookings-see-more/most-popular/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`)
                              }}>
                              {'See All'}
                          </Button>}
                      </div>
                  </TabPane>
                </Tabs> :
                  this.renderCard(bookingList, 'top_rated')}
              </div>
              {/* {(sub_cat_name == langs.key.caterers || sub_cat_name == langs.key.venues) && eventTypes.length !==0 && */}
              {/* {(cat_name == langs.key.events) && eventTypes.length !== 0 &&
                <div className='wrap-inner browser-by-event'>
                  <Title level={1} className='align-center pt-30 pb-30'>{sub_cat_name == langs.key.caterers ? 'Browse By Event Types' : `Popular Event Types`}</Title>
                  {this.renderEventsType('events', eventTypes)}
                  {eventTypes && eventTypes.length > 3 &&
                    <div className='align-center pt-25 pb-35 '>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link to={`/bookings-popular-see-more/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`} className='btn fm-btn-white '>See All</Link>
                      </Col>
                    </div>}
                </div>
              } */}
              {/* {(sub_cat_name == langs.key.fitness) && popularFitness.length !== 0 &&
                <div className='wrap-inner popular-gym'>
                  <Title level={1} className='align-center pt-30 pb-30'>{`Popular Gym Fitness`}</Title>
                  {this.renderEventsType('fitness', popularFitness)}
                  {popularFitness && popularFitness.length > 3 &&
                    <div className='align-center pt-25 pb-35 '>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <Link to={`/bookings-popular-see-more/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`} className='btn fm-btn-white '>See All</Link>
                      </Col>
                    </div>
                  }
                </div>
              } */}
              {/* {sub_cat_name == langs.key.spa && popularSpa.length !== 0 && <div className='wrap-inner popular-view'>
                <Title level={1} className='align-center pt-30 pb-30 popular-view-title'>{`Popular Spa & Wellness`}</Title>
                <Row gutter={[0, 45]}>
                  {this.renderPopularSpaWellNess(popularSpa)}
                </Row>
                {popularSpa.length > 9 && 
                <div className='align-center sub-category-btm-see-btn-pad'>
                  <Col span={24} className='fm-button-wrap' align='center'>
                    <Link to={`/bookings-see-all/spa-wellness/${cat_id}`} className='btn fm-btn-white '>See All</Link>
                  </Col>
                </div>
              }
              </div>} */}
              {/* <PopularSearchList parameter={parameter} /> */}
            </Content>
          </Layout>
        </Layout>
        {redirectTo && <Redirect push to={{
          pathname: redirectTo,
        }}
        />}
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
  const { auth, bookings, common } = store;
  const { location } = common;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],
    lat: location ? location.lat : '',
    long: location ? location.long : ''
  };
}

export default connect(
  mapStateToProps,
  { popularSpaWellness, getDailyDeals, getPopularFitnessTypes, getEventTypes, newInBookings, getEventTypes, getFitnessTypes, mostPapularList, enableLoading, disableLoading, getBannerById, openLoginModel }
)(withRouter(SubCategory));