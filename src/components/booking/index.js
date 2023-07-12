import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
// import AppSidebar from '../sidebar/HomeSideBarbar';
import AppSidebar from './common/Sidebar';
import Icon from '../customIcons/customIcons';
import DetailCard from './common/Card'
import { getBookingCatLandingRoute } from '../../common/getRoutes'
import { langs } from '../../config/localization';
import { Card, Breadcrumb, Layout, Typography, Row, Col, Tabs, Select } from 'antd';
import { getBookingLandingPageData, newLandingPageBookingList, newInBookings, getBookingPopularCategories, enableLoading, disableLoading, mostPapularList, getBannerById, openLoginModel } from '../../actions/index';
import history from '../../common/History';
import { CarouselSlider } from '../common/CarouselSlider'
import { TEMPLATE, DEFAULT_ICON } from '../../config/Config'
import NoContentFound from '../common/NoContentFound'
import BookinglandingPageSearch from './common/search-bar/BookinglandingPageSearch'
import { DEFAULT_THUMB_IMAGE } from '../../config/Config'
import { capitalizeFirstLetter, converInUpperCase } from '../common'
import NewSidebar from './NewSidebar'


const { TabPane } = Tabs;
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select

class BookingLandingPage extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      bookingList: [],
      mostPapular: [],
      newBooking: [],
      bookingCategories: [],
      activeTab: '1',
      tabType: 'most-recent',
      recentlyViewList: [],
      topRatedList: [],
      mostRecentList: [],
      isSidebarOpen: false
    }
  }

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    const { bookingList } = this.props;
    this.getInitialData(bookingList)
  }

  /**
   * @method getInitialData
   * @description get most recent records
   */
  getInitialData = (bookingList) => {
    this.props.enableLoading()
    // this.getMostPopularData()
    this.getNewBookingList()
    this.props.getBannerById(2, res => {
      if (res.status === 200) {
        const banner = res.data.data && res.data.data.banners
        const mainBanner = banner.filter(el => el.moduleId === 3)
        this.getBannerData(mainBanner)
      }
    })
  }

  /**
    * @method getNewBookingList
    * @description get new booking list
    */
  getNewBookingList = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData1 = {
      filter: 'most_recent',
      user_id: isLoggedIn ? loggedInDetail.id : ''
    }
    let reqData2 = {
      filter: 'top_rated',
      user_id: isLoggedIn ? loggedInDetail.id : ''
    }
    let reqData3 = {
      filter: 'most_viewed',
      user_id: isLoggedIn ? loggedInDetail.id : ''
    }
    this.props.getBookingLandingPageData(reqData1, reqData2, reqData3, res => {
      this.props.disableLoading()
      if (res) {
        this.setState({ mostRecentList: res.mostRecent, topRatedList: res.top_rated, recentlyViewList: res.recently_view })
      }
    })
  }


  /**
  * @method getMostPopularData
  * @description get most papular data
  */
  getMostPopularData = () => {
    this.props.getBookingPopularCategories(res => {
      this.props.disableLoading()
      if (res.status === 200) {
        this.setState({ mostPapular: res.data && res.data.banner_image })
      }
    })
  }

  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = (banners) => {
    const top = banners.filter(el => el.bannerPosition === langs.key.top)
    const bottom = banners.filter(el => el.bannerPosition === langs.key.bottom)
    this.setState({ topImages: top, bottomImages: bottom })
  }

  /**
   * @method selectTemplateRoute
   * @description select tempalte route dynamically
   */
  selectTemplateRoute = (el) => {
    let slug = el.name
    if (slug === TEMPLATE.HANDYMAN) {
      let path = getBookingCatLandingRoute(TEMPLATE.HANDYMAN, el.id, el.name)
      this.props.history.push(path)
    } else if (slug === TEMPLATE.BEAUTY) {
      let path = getBookingCatLandingRoute(TEMPLATE.BEAUTY, el.id, el.name)
      this.props.history.push(path)
    } else if (slug === TEMPLATE.EVENT) {
      let path = getBookingCatLandingRoute(TEMPLATE.EVENT, el.id, el.name)
      this.props.history.push(path)
    } else if (slug === TEMPLATE.WELLBEING) {
      let path = getBookingCatLandingRoute(TEMPLATE.WELLBEING, el.id, el.name)
      this.props.history.push(path)
    } else if (slug === TEMPLATE.RESTAURANT) {
      let path = getBookingCatLandingRoute(TEMPLATE.RESTAURANT, el.id, el.name)
      this.props.history.push(path)
    } else if (slug === TEMPLATE.PSERVICES || slug === 'Professional Services') {
      let path = getBookingCatLandingRoute(TEMPLATE.PSERVICES, el.id, el.name)
      this.props.history.push(path)
    } else if (slug === TEMPLATE.SPORTS) {
      let path = getBookingCatLandingRoute(TEMPLATE.SPORTS, el.id, el.name)
      this.props.history.push(path)
    }
  }

  /**
  * @method renderCategoryList
  * @description render category list
  */
  renderCategoryList = () => {
    return this.props.bookingList.map((el) => {
      return <li key={el.key} onClick={() => this.selectTemplateRoute(el)}>
        <div className={'item bookinglanding-item'}>
          <img onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_ICON
          }}
            src={el.icon} alt='Home' className={'stroke-color main-icon-booking'} />
          <Paragraph className='title'>{capitalizeFirstLetter(el.name)}</Paragraph>
        </div>
      </li>

    })
  }

  /**
   * @method renderMostPapularItem
   * @description render most popular category
   */
  renderMostPapularItem = (mostPapular) => {
    if (mostPapular && mostPapular.length) {
      return (
        <Row gutter={[20, 20]}>
          {mostPapular && mostPapular.map((el, i) => {
            return (
              <Col span={i == 0 || i == 1 ? 12 : 8} key={i}>
                <div className={'imageCard'}>
                  <div className='ad-banner'>
                    <img
                      src={el ? el : DEFAULT_THUMB_IMAGE}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_THUMB_IMAGE
                      }}
                      alt=''
                    />
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      )
    } else {
      return <NoContentFound />
    }
  }

  /**
  * @method renderCard
  * @description render card details
  */
  renderCards = (categoryData) => {

   console.warn('categoryData kapil ->',categoryData);
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[25, 25]}>
            {categoryData && categoryData.slice(0, 4).map((data, i) => {
              return (
                <DetailCard
                  data={data} key={i}
                  col={6}
                />
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
   * @method renderCategoryBlock
   * @description render category block
   */
  renderCategoryBlock = (bookingCategories) => {
    let filter = this.props.match.params.filter
    if (bookingCategories && bookingCategories.length) {
      let data = filter === 'see-more' ? bookingCategories : bookingCategories.slice(0, 3)
      return data.map((el, i) => {
        return (
          <div className='product-list-wrap' key={i}>
            <Card
              title={(<span style={{ backgroundColor: '#fff', color: "#FFC468" }}>{el.name}</span>)}
              extra={<Link><span onClick={() => this.selectTemplateRoute(el)}>See more</span> <Icon onClick={() => this.selectTemplateRoute(el)} icon='arrow-right' size='13' className="arrow-right" /></Link>}
              bordered={false}
              className={'new-in-booking booking-product-list home-product-list'}
            >
              {this.renderCards(el.users)}
            </Card>
          </div>
        )
      })
    }
  }

  /**
   * @method renderSeeAllButton
   * @description render see all button 
   */
  renderSeeAllButton = () => {
    return (
      <div className='align-center see-btn-pad '>
        <Col span={24} align='center'>
          <Link to={`/bookings/see-more`} className='btn fm-btn-white'>See All</Link>
        </Col>
      </div>
    )
  }

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    let tabType = 'most-recent'
    if (key === '2') {
      tabType = 'top-rated'
    } else if (key === '3') {
      tabType = 'recently-view'
    } else {
      tabType = 'most_recent'
    }
    this.setState({ activeTab: key, tabType: tabType });
  };

  /** 
 * @method handleSearchResponce
 * @description Call Action for Classified Search
 */
  handleSearchResponce = (res, resetFlag, reqData) => {
    if (resetFlag) {
      this.setState({ isSearchResult: false });
      this.getNewBookingList()
    } else {
      this.setState({ bookingList: res, isSearchResult: true, searchReqData: reqData })
    }
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    let filter = this.props.match.params.filter
    const { bookingList, isSearchResult, tabType, recentlyViewList, topRatedList, mostRecentList, activeTab, bookingCategories, newBooking, topImages, bottomImages, isSidebarOpen } = this.state;
    let list_type = tabType === 'top-rated' ? topRatedList : tabType === 'recently-view' ? recentlyViewList : mostRecentList
    let isEmpty = list_type && list_type.length !== 0
    return (
      <div className='App common-main-category-landing booking-main-category-landing'>
        <Layout className=" yellow-theme booking-landingpage new-custom-booking-landingpage">
          <Layout>
            {/* <AppSidebar history={history} /> */}
            <NewSidebar
              history={history}
              showAll={false}
              toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
            />
            <Layout className="right-parent-block">
              <div className='category-main-banner category-main-banner-block'>
                <div className='sub-header'>
                  {!isSidebarOpen ? <Title level={4} className='title main-heading-bookg' >{'WELCOME TO BOOKINGS'}</Title> : ''}
                </div>
                <CarouselSlider bannerItem={topImages} />
                <BookinglandingPageSearch handleSearchResponce={this.handleSearchResponce} />
              </div>

              <Content className='site-layout'>

                <Breadcrumb separator='|' className='ant-breadcrumb-pad'>
                  <Breadcrumb.Item>
                    <Link to='/'>Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to='/bookings'>Bookings</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div className="wrap-inner-position-relative" >
                  {/* <div className="card-tile-listing">
                    <Card
                      bordered={false}
                      extra={filter === undefined &&
                        <ul className='panel-action'>
                          <li>
                            <div className='location-name'>
                              <Icon icon='location' size='20' className='mr-5' />
                          Melbourne City
                        </div>
                          </li>
                          <li title={'List view'} className={'active'}><Icon icon='grid' size='18' /></li>
                          <li title={'Map view'} >
                            <Icon icon='map' size='18' />
                          </li>
                          <li>
                            <label className={'mr-10'}>{'Sort'}</label>
                            <Select
                              defaultValue={'Recommended'}
                              onChange={this.handleSort}
                              dropdownMatchSelectWidth={false}
                            >
                              <Option value='0'>Price: Low to High</Option>
                              <Option value='1'>Price: High to Low</Option>
                              <Option value='2'>Name: A to Z</Option>
                              <Option value='3'>Name: Z to A</Option>
                            </Select>
                          </li>
                        </ul>
                      }
                      className={'home-product-list header-nospace'}
                    >
                    </Card>
                  </div> */}
                  {!isSearchResult && filter === undefined ? <Tabs type='card' className={'tab-style2'} activeKey={activeTab} onChange={this.onTabChange}>
                    <TabPane tab='Most Recent' key='1'>
                      <div>
                        {isEmpty ?
                          this.renderCategoryBlock(list_type) : <NoContentFound />}
                      </div>
                      {isEmpty && this.renderSeeAllButton()}
                    </TabPane>
                    <TabPane tab='Top Rated' key='2'>
                      <div>
                        {isEmpty ?
                          this.renderCategoryBlock(list_type) : <NoContentFound />}
                      </div>
                      {isEmpty && this.renderSeeAllButton()}
                    </TabPane>
                    <TabPane tab='Recently Viewed' key='3'>
                      <div>
                        {isEmpty ?
                          this.renderCategoryBlock(list_type) : <NoContentFound />}
                      </div>
                      {isEmpty && this.renderSeeAllButton()}
                    </TabPane>
                  </Tabs> : filter === 'see-more' && !isSearchResult ? this.renderCategoryBlock(list_type) :
                      this.renderCards(bookingList)}
                  {filter === undefined && <div className='' style={{ paddingLeft: "20px", paddingRight: "20px", justifyContent: "center" }}>
                    <Col span={24} className="offer-banner pb-30">
                      <CarouselSlider bannerItem={bottomImages} pathName='/' className='mid-banner' />
                    </Col>
                  </div>}
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common, classifieds } = store;
  const { categoryData } = common;
  let bookingList = []
  bookingList = categoryData && Array.isArray(categoryData.booking.data) ? categoryData.booking.data : []
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    iconUrl: categoryData && categoryData.classifiedAll !== undefined ? common.categoryData.classifiedAll.iconurl : '',
    bookingList,
  };
};
export default BookingLandingPage = connect(
  mapStateToProps,
  { getBookingLandingPageData, newLandingPageBookingList, newInBookings, getBookingPopularCategories, enableLoading, disableLoading, getBannerById, openLoginModel, mostPapularList }
)(BookingLandingPage);
