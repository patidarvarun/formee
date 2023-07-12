import React, { Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import { Layout, Row, Col, Typography, Tabs, Button, Breadcrumb } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { langs } from '../../../config/localization';
import { newInBookings, mostPapularList, getMostViewdData, getBannerById, enableLoading, disableLoading } from '../../../actions/index';
import { mostPopularInHandyMan, papularSearch, getClassfiedCategoryListing, classifiedGeneralSearch, getClassfiedCategoryDetail, openLoginModel, getChildCategory } from '../../../actions';
import DetailCard from '../common/Card'
import history from '../../../common/History';
import GeneralSearch from '../common/search-bar/WellbeingSearch'
import { CarouselSlider } from '../../common/CarouselSlider'
import SubHeader from '../common/SubHeader'
import NoContentFound from '../../common/NoContentFound'
import { TEMPLATE } from '../../../config/Config'
import { converInUpperCase } from '../../common'
import { DEFAULT_THUMB_IMAGE } from '../../../config/Config'
import NewSidebar from '../NewSidebar';
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

class PservicesLandingPage extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      key: 'tab1',
      noTitleKey: 'app',
      BookingList: [],
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
      middle1Images: [],
      middle2Images: [],
      middle3Images: [],
      most_popular: [],
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
    if (catIdInitial !== catIdNext) {
      this.props.enableLoading()
      this.getMostRecentData(catIdNext)
      this.getMostPopularData(catIdNext)
      this.getBannerData()
    }
  }

  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    this.props.enableLoading()
    let cat_id = this.props.match.params.categoryId
    this.getMostRecentData(cat_id)
    this.getMostPopularData(cat_id)
    this.getBannerData()
  }

  /** 
  * @method getMostPopularData
  * @description get most papular data
  */
  getMostPopularData = (cat_id) => {
    let requestData = {
      booking_cat_id: cat_id
    }
    this.props.mostPopularInHandyMan(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []
        this.setState({ imageUrl: res.data.data.imageurl, mostPapular: data })
      }
    })
  }

  /**
    * @method getBannerData
    * @description get banner detail
    */
  getBannerData = () => {
    this.props.getBannerById(5, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : ''
        const banner = data
        const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
        const bottom = banner && banner.filter(el => el.bannerPosition === langs.key.bottom)
        const middleOne = banner && banner.filter(el => el.bannerPosition === langs.key.middle_one)
        const middleTwo = banner && banner.filter(el => el.bannerPosition === langs.key.middle_two)
        const middleThree = banner && banner.filter(el => el.bannerPosition === langs.key.middle_three)
        this.setState({ topImages: top, bottomImages: bottom, middle1Images: middleOne, middle2Images: middleTwo, middle3Images: middleThree })
      }
    })
  }

  /**
  * @method getMostRecentData
  * @description get most recent booking data
  */
  getMostRecentData = (cat_id) => {
    const { isLoggedIn, loggedInDetail } = this.props
    let parameter = this.props.match.params
    const requestData = {
      user_id: isLoggedIn ? loggedInDetail.id : '',
      page: 1,
      per_page: 12,
      cat_id: cat_id
    }
    this.props.newInBookings(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        this.setState({ mostRecentList: data })
      }
    })
    this.getTopRatedData(cat_id)
    this.getMostPopularList()
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
      cat_id: cat_id,
      filter: 'top_rated'
    }
    this.props.newInBookings(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        this.setState({ topRatedList: data })
      }
    })
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
  * @method onTabChange
  * @description manage tab change
  */
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };



  /** 
   * @method handleSearchCall
   * @description Call Action for Classified Search
   */
  handleSearchCall = () => {
    this.props.classifiedGeneralSearch(this.state.searchReqData, (res) => {
      this.setState({ BookingList: res.data })
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
      this.getMostRecentData(cat_id)
    } else {
      this.setState({ BookingList: res, isSearchResult: true, searchReqData: reqData })
    }
  }


  /**
  * @method renderCard
  * @description render card details
  */
  renderCard = (categoryData) => {
    let parameter = this.props.match.params
    let cat_id = parameter.categoryId
    if (Array.isArray(categoryData) && categoryData.length) {
      let list = this.state.isSearchResult ? categoryData : categoryData.slice(0, 12)
      return (
        <Fragment>
          <Row gutter={[18, 32]}>
            {list.map((data, i) => {
              return (
                <DetailCard
                  data={data} key={i} type={TEMPLATE.PSERVICES}
                  col={6}
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
          </Row>
        </Fragment>
      )
    } else {
      return <NoContentFound />
    }
  }

  renderMostPapularItem = (mostPapular, imageUrl) => {
    if (mostPapular && mostPapular.length) {
      return (
        <Row gutter={[20, 20]}>
          {mostPapular && mostPapular.map((el, i) => {
            let a = el.description
            let discription = document.createElement('div');
            discription.innerHTML = a;
            return (
              <Col span={8} key={i}>
                <div className={'imageCard'}>
                  <div className='ad-banner'>
                    <img
                      src={el.banner_image ? el.banner_image : DEFAULT_THUMB_IMAGE}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_THUMB_IMAGE
                      }}
                      alt=''
                    />
                  </div>
                  <div className={'imageCardContent'}>
                    <Title level={2} className='mb-5'>
                      {discription.innerText}
                    </Title>
                    <Paragraph className='fs-18 mb-0' style={{ lineHeight: '22px' }}>
                      {el.name}<br />
                      {`${el.parent_category_classifieds_count ? el.parent_category_classifieds_count : 0}  Ads`}
                      <Icon icon='arrow-right' size='15' className='ml-40' />
                    </Paragraph>
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      )
    }
  }



  /**
   * @method render
   * @description render component
   */
  render() {
    const {isSidebarOpen, most_popular, topRatedList, mostRecentList, redirectTo, BookingList, topImages, isSearchResult } = this.state;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let cat_name = (Array.isArray(topRatedList) && topRatedList.length) ? topRatedList[0].catname : TEMPLATE.PSERVICES
   return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          {/* <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} /> */}
          <NewSidebar 
            history={history} 
            activeCategoryId={cat_id}   
            categoryName={TEMPLATE.PSERVICES}
            isSubcategoryPage={true}
            showAll={true}
            toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
          />
          <Layout className="right-parent-block">
            <SubHeader
              categoryName={cat_name}
              showAll={true}
            />
            <div className='inner-banner custom-inner-banner'>
              <CarouselSlider bannerItem={topImages} pathName='/' />
            </div>
            <Tabs type='card' className={'tab-style1 job-search-tab bookings-categories-serach'}>
              <TabPane tab='' key='1' className="professional-jobsearch ">
                <GeneralSearch handleSearchResponce={this.handleSearchResponce} />
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
                  <Breadcrumb.Item>{`${converInUpperCase(TEMPLATE.PSERVICES)}`}</Breadcrumb.Item>
                </Breadcrumb>
                {!isSearchResult ? <Tabs type='card' className={'tab-style2'} onChange={this.onTabChange}>
                  <TabPane tab='Most Recent' key='1'>
                    {this.renderCard(mostRecentList)}
                    <div className='align-center see-btn-pad'>
                      {mostRecentList && mostRecentList.length !== 0 &&
                        <Button type='default' size={'middle'}
                          onClick={() => {
                            this.props.history.push(`/bookings-see-more/most-recent/${TEMPLATE.PSERVICES}/${cat_id}`)
                          }} >
                          {'See All'}
                        </Button>}
                    </div>
                  </TabPane>
                  <TabPane tab='Top Rated' key='2'>
                    {this.renderCard(topRatedList)}
                    <div className='align-center see-btn-pad'>
                      {topRatedList && topRatedList.length !== 0 &&
                        <Button type='default' size={'middle'}
                          onClick={() => {
                            this.props.history.push(`/bookings-see-more/top-rated/${TEMPLATE.PSERVICES}/${cat_id}`)
                          }}>
                          {'See All'}
                        </Button>}
                    </div>
                  </TabPane>
                  <TabPane tab='Most Popular' key='3'>
                    {this.renderCard(most_popular)}
                    <div className='align-center see-btn-pad'>
                        {most_popular && most_popular.length !== 0 &&
                        <Button type='default' size={'middle'}
                            onClick={() => {
                                this.props.history.push(`/bookings-see-more/most-popular/${TEMPLATE.PSERVICES}/${cat_id}`)
                            }}>
                            {'See All'}
                        </Button>}
                    </div>
                  </TabPane>
                </Tabs> :
                  this.renderCard(BookingList)}
              </div>
            </Content>
          </Layout>
        </Layout>
        {redirectTo && <Redirect push to={{
          pathname: redirectTo,
        }}
        />}

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
  { mostPopularInHandyMan, newInBookings, mostPapularList, getClassfiedCategoryListing, enableLoading, disableLoading, classifiedGeneralSearch, getClassfiedCategoryDetail, getBannerById, openLoginModel, getChildCategory, papularSearch, getMostViewdData }
)(withRouter(PservicesLandingPage));