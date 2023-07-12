import React, {Fragment} from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import SubHeader from '../common/SubHeader';
import {Button,Card, Layout, Row, Col, Typography, Tabs, Breadcrumb } from 'antd';
import {getBookingSubcategory,popularSpaWellness, newInBookings, getDailyDeals, enableLoading, disableLoading, getBannerById } from '../../../actions/index';
import { getChildCategory } from '../../../actions'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider';
import { langs } from '../../../config/localization';
import TopRatedDetailCard from '../common/Card'
import {getBookingSubCatDetailRoute,getBookingCatLandingRoute } from '../../../common/getRoutes';
import DailyDealsCard from '../common/DailyDealsCard';
import NoContentFound from '../../common/NoContentFound'
import { TEMPLATE } from '../../../config/Config';
import GeneralSearch from '../common/search-bar/WellbeingSearch'
import NewSidebar from '../NewSidebar'

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

class BookingWellbeingLandingpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dailyDealsData: [],
      topRatedList: [],
      isSearchResult: false,
      popularSpa: [],
      allBookingId: '',
      most_popular:[],
      isSidebarOpen: false
    };
  }

  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    let cat_id = this.props.match.params.categoryId
    const { bookingList } = this.props
    this.props.enableLoading()
    this.getBannerData(cat_id)
    this.getDailyDealsRecord(cat_id)
    this.getTopRatedData(cat_id)
    this.getPopularSpa()
    this.props.getBookingSubcategory(cat_id, res => {
      if (res.status === 200) {
        const subCategory = Array.isArray(res.data.data) ? res.data.data : []
        this.setState({ subCategory: subCategory })
        if (subCategory && subCategory.length) {
          let allBookingId = subCategory.map(el => el.id);
          this.setState({allBookingId : allBookingId.join(',')})
        }
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
      this.getTopRatedData(catIdNext)
    }
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
      path = getBookingSubCatDetailRoute(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
      this.setState({ redirect: path })
  }

  /**
   * @method renderPopularSpaWellNess
   * @description render popular spa wellness
   */
  renderPopularSpaWellNess = (data) => {
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
    }else {
      return <NoContentFound/>
    }
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
   * @method render
   * @description render component
   */
  render() {
    const {isSidebarOpen, most_popular,allBookingId,popularSpa,total_record, total, redirect, topRatedList, dailyDealsData, bookingList, topImages, isSearchResult } = this.state;
    const parameter = this.props.match.params;
    const { isLoggedIn } = this.props;
    let cat_id = this.props.match.params.categoryId
    let cat_name = TEMPLATE.WELLBEING
    let categoryPagePath = getBookingCatLandingRoute(cat_name, cat_id, cat_name)
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          {/* <AppSidebar history={history} activeCategoryId={cat_id} /> */}
          <NewSidebar 
            history={history} 
            activeCategoryId={cat_id}  
            showAll={false} 
            categoryName={TEMPLATE.WELLBEING}
            isSubcategoryPage={true}
            toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
          />
          <Layout className="right-parent-block">
            <SubHeader
              categoryName={TEMPLATE.WELLBEING}
              showAll={false}
            />
            <div className='inner-banner well'>
              <CarouselSlider bannerItem={topImages} pathName='/' />
              <div className='main-banner-content'>
              </div>
            </div>
            <Tabs type='card' className={'tab-style1 job-search-tab bookings-categories-serach'}>
              <TabPane tab='Search' key='1' className="professional-jobsearch">
                <GeneralSearch handleSearchResponce={this.handleSearchResponce} allBookingId={allBookingId}/>
              </TabPane>
            </Tabs>
            <Content className='site-layout'>
              <div className='wrap-inner full-width-wrap-inner pt-0'>
                  <Breadcrumb separator='|' className='ant-breadcrumb-pad pt-0'>
                    <Breadcrumb.Item>
                      <Link to='/'>Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link to='/bookings'>Bookings</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {`Wellbeing`}
                    </Breadcrumb.Item>
                  </Breadcrumb>
                  {!isSearchResult ? <Tabs type='card' className={'tab-style2'} >
                    {cat_name !== 'events' && <TabPane tab='Daily Deals' key='1'>
                      {dailyDealsData.length !== 0 ? <Row gutter={[38, 38]} >
                        {this.renderDailyDeals()}
                      </Row> : <NoContentFound />}
                      {total >= 9 && <div className='align-center sub-category-tab-see-btn-pad'>
                        <Col span={24} className='fm-button-wrap' align='center'>
                          <Link to={`/bookings-see-more/daily-deals/${cat_name}/${cat_id}`} className='btn fm-btn-white'>See All</Link>
                        </Col>
                      </div>}
                    </TabPane>}
                    <TabPane tab='Top Rated' key='2'>
                      {this.renderCard(topRatedList, 'top_rated')}
                      {total_record >= 9 && <div className='align-center sub-category-tab-see-btn-pad'>
                        <Col span={24} className='fm-button-wrap' align='center'>
                          <Link to={`/bookings-see-more/top-rated/${cat_name}/${cat_id}`} className='btn fm-btn-white'>See All</Link>
                        </Col>
                      </div>}
                    </TabPane>
                    {/* <TabPane tab='Most Popular' key='3'>
                      <Row gutter={[0, 45]}>
                        {this.renderPopularSpaWellNess(popularSpa)}
                      </Row>
                      {popularSpa.length !==0  && <div className='align-center sub-category-tab-see-btn-pad'>
                        <Col span={24} className='fm-button-wrap' align='center'>
                          <Link to={`/bookings-see-all/spa-wellness/${cat_id}`} className='btn fm-btn-white'>See All</Link>
                        </Col>
                      </div>}
                    </TabPane> */}
                    <TabPane tab='Most Popular' key='3'>
                      {this.renderCard(most_popular)}
                      <div className='align-center see-btn-pad'>
                          {most_popular && most_popular.length !== 0 &&
                          <Button type='default' size={'middle'}
                              onClick={() => {
                                  this.props.history.push(`/bookings-see-more/most-popular/${cat_name}/${cat_id}`)
                              }}>
                              {'See All'}
                          </Button>}
                      </div>
                  </TabPane>
                  </Tabs> :
                    this.renderCard(bookingList, 'top_rated')}
                </div>
              {/* <div className='wrap-inner popular-view'>
                <Title level={1} className='align-center pt-30 pb-30 popular-view-title'>{`Most Popular`}</Title>
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
              </div> */}
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
  {getBookingSubcategory,popularSpaWellness, newInBookings, getDailyDeals, enableLoading, disableLoading, getBannerById, getChildCategory }
)(BookingWellbeingLandingpage);