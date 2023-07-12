import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from "../sidebar";
import { getClassifiedCatLandingRoute } from '../../common/getRoutes'
import { langs } from '../../config/localization';
import { Breadcrumb, Card, Layout, Row, Typography, Tabs, Select, Button } from 'antd';
import Icon from '../customIcons/customIcons';
import DetailCard from '../common/Card'
import { getClassifiedLandingPageData, newClassifiedList, checkPermissionForPostAd, enableLoading, disableLoading, classifiedGeneralSearch, mostPapularList, getClassfiedCategoryListing, getBannerById, openLoginModel, papularSearch, getClassfiedCategoryDetail } from '../../actions/index';
import history from '../../common/History';
import { CarouselSlider } from '../common/CarouselSlider'
import { TEMPLATE } from '../../config/Config'
import GeneralSearch from './GeneralSearch';
import NoContentFound from '../common/NoContentFound'
import SeeAllModal from './PapularSearch'
import PostAdPermission from './PostAdPermission'
import JobDetailCard from './jobs/DetailCard'
import GeneralDetailCardList from './automative/DetailCardList'

//New changes 
import { NewCarouselSlider } from '../common/NewCrousalSlider'
import SideBar from '../sidebar/ClassifiedSideBar'

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class ClassifiedsLandingPage extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      mostRecentList: [],
      topRatedList: [],
      filteredData: [],
      isFilterPage: false,
      isSearchResult: false,
      catName: '',
      classifiedList: [],
      searchLatLng: '',
      mostPapular: [],
      searchReqData: {},
      viewAll: false,
      permission: true,
      newClassifiedListData: [],
      recentlyViewList: [],
      activeTab: '1',
      tabType: 'most-recent',
      displayType: 'grid',
      isSidebarOpen: false
    }
  }

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    this.getInitialData()
  }

  /**
   * @method getInitialData
   * @description get most recent records
   */
  getInitialData = () => {
    this.props.enableLoading()
    this.getCategorisedList()
    this.props.getBannerById(2, res => {
      if (res.status === 200) {
        const data = res.data.success && Array.isArray(res.data.success.banners) ? res.data.success.banners : []
        if (data.length) {
          const banner = data.filter(el => el.moduleId === 1)
          this.getBannerData(banner)
        }
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
   * @method getCategorisedList
   * @description get category vice listing
   */
  getCategorisedList = () => {
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
    this.props.getClassifiedLandingPageData(reqData1, reqData2, reqData3, res => {
      if (res) {
        this.setState({ mostRecentList: res.mostRecent, topRatedList: res.top_rated, recentlyViewList: res.recently_view })
      }
    })
  }


  /**
   * @method selectTemplateRoute
   * @description select tempalte route dynamically
   */
  selectTemplateRoute = (data) => {
    let item = data && Array.isArray(data) && data.length ? data[0] : ''
    let templateName = item.template_slug
    let cat_id = item.parent_categoryid
    let path = ''
    if (templateName === TEMPLATE.GENERAL) {
      path = getClassifiedCatLandingRoute(TEMPLATE.GENERAL, cat_id, item.catname)
      this.props.history.push(path)
    } else if (templateName === TEMPLATE.JOB) {
      let route = getClassifiedCatLandingRoute(TEMPLATE.JOB, cat_id, item.catname)
      this.props.history.push(route);
    } else if (templateName === TEMPLATE.REALESTATE) {
      path = getClassifiedCatLandingRoute(TEMPLATE.REALESTATE, cat_id, item.catname)
      this.props.history.push(path)
    }
  }

  /** 
  * @method handleSearchResponce
  * @description Call Action for Classified Search
  */
  handleSearchResponce = (res, resetFlag, reqData) => {
    if (resetFlag) {
      this.setState({ isSearchResult: false });
      this.getMostRecentData(this.state.allId)
    } else {
      this.setState({ classifiedList: res, isSearchResult: true, searchReqData: reqData })
    }
  }

  /**
   * @method renderCard
   * @description render card details
   */
  renderClassifiedCard = (categoryData) => {
    if (categoryData && categoryData.length) {
      let temp = categoryData
      return (
        <Fragment>
          <Row gutter={[25, 25]}>
            {temp && temp.slice(0, 4).map((data, i) => {
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

  renderGeneralDetailCard = (data) => {
    if (data && data.length) {
      let temp = data
      return (
        <Fragment>
          <Row gutter={[25, 25]}>
            {temp && temp.slice(0, 4).map((data, i) => {
              return (
                <GeneralDetailCardList
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
   * @method renderCard
   * @description render card details
   */
  renderListView = (data) => {
    let item = data && Array.isArray(data) && data.length ? data[0] : ''
    let templateName = item.template_slug
    console.log('templateName', templateName)
    if (templateName === 'job') {
      if (data && data.length) {
        let temp = data
        return (
          <Fragment>
            <Row gutter={[0, 0]}>
              {temp && temp.slice(0, 4).map((data, i) => {
                return (
                  <JobDetailCard
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
    } else if (templateName === 'general') {
      return this.renderGeneralDetailCard(data)
    } else {
      return this.renderClassifiedCard(data)
    }

  }


  /**
   * @method renderCategoryBlock
   * @description render category block
   */
  renderCategoryBlock = (newClassifiedListData) => {
    if (newClassifiedListData && newClassifiedListData.length) {
      let filter = this.props.match.params.filter
      let data = filter === 'see-more' ? newClassifiedListData : newClassifiedListData.slice(0, 3)
      return data.map((el, i) => {
        return (
          <div className='product-list-wrap' key={i}>
            <Card
              title={(<span style={{ backgroundColor: '#fff', color: "#7EC5F7" }}>{el.name}</span>)}
              extra={<Link><span onClick={() => this.selectTemplateRoute(el.classifieds)}>See more</span> <Icon onClick={() => this.selectTemplateRoute(el.classifieds)} icon='arrow-right' size='13' className="arrow-right" /></Link>}
              bordered={false}
              className={'home-product-list new-in-classifieds'}
            >
              {this.renderClassifiedCard(el.classifieds)}
            </Card>
          </div>
        )
      });
    }
  }

  /**
   * @method renderSeeAllButton
   * @description render see all button 
   */
  renderSeeAllButton = () => {
    const { tabType } = this.state
    return (
      <div className='align-center see-all-btn-pad'>
        <Button type='default' size={'middle'}
          onClick={() => {
            this.props.history.push(`/classifieds/${tabType}/see-more`)
          }}>
          {'See All'}
        </Button>
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
   * @method render
   * @description render component
   */
  render() {
    const {isMenuOpen = false, popularSearches } = this.props;
    const { displayType, tabType, activeTab, recentlyViewList, viewAll, topImages, bottomImages, mostRecentList, classifiedList, isSearchResult, topRatedList, isSidebarOpen } = this.state;
    let filter = this.props.match.params.filter
    let list_type2 = tabType === 'top-rated' ? topRatedList : tabType === 'recently-view' ? recentlyViewList : mostRecentList
    let objectLength = list_type2 && list_type2.length !== 0
    let image = topImages && topImages.length && topImages[0].bannerImage
    return (
      <div className='App common-main-category-landing classified-main-category-landing'>
        <Layout className="new-custom-classified-landingpage">
          <Layout>
            {/* <AppSidebar history={history} /> */}
            <SideBar
              history={history}
              showAll={false}
              toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
            />
            <Layout className="right-parent-block">
              <div className='category-main-banner category-main-banner-block'>
                <div className='sub-header'>
                  {!isSidebarOpen ? <Title level={4} className='title'>{'WELCOME TO CLASSIFIEDS'}</Title> : ''}
                  <PostAdPermission history={history} />
                </div>
                <CarouselSlider bannerItem={topImages} />
                <GeneralSearch handleSearchResponce={this.handleSearchResponce} landingPage={true} />
              </div>
              <Content className='site-layout'>
                <Breadcrumb separator='|' className='ant-breadcrumb-pad'>
                  <Breadcrumb.Item>
                    <Link to='/'>Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to="/classifieds">Classified</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div className='wrap-inner bg-linear pb-76 wrap-inner-position-relative' >
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
                          {displayType === 'list' ? <li title={'List view'} className={'active'} onClick={() => this.setState({ displayType: 'grid' })}>
                            <Icon icon='grid' size='18' />
                          </li> :
                            <li>
                              <img src={require('../dashboard-sidebar/icons/list.png')} alt='' width='20' onClick={() => this.setState({ displayType: 'list' })} />
                            </li>}
                          <li title={'Map view'} >
                            <Icon icon='map' size='18' />
                          </li>
                          <li>
                            <label className={'mr-10'}>{'Sort'}</label>
                            <Select
                              defaultValue={'Recommended'}
                              //onChange={this.handleSort}
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
                  {!isSearchResult && filter === undefined ?
                    <Tabs type='card' className={'tab-style2'} activeKey={activeTab} onChange={this.onTabChange}>
                      <TabPane tab='Most Recent' key='1'>
                        {objectLength ?
                          this.renderCategoryBlock(list_type2) : <NoContentFound />}
                        {objectLength && this.renderSeeAllButton()}
                      </TabPane>
                      <TabPane tab='Top Rated' key='2'>
                        {objectLength ?
                          this.renderCategoryBlock(list_type2) : <NoContentFound />}
                        {objectLength && this.renderSeeAllButton()}
                      </TabPane>
                      <TabPane tab='Recently Viewed' key='3'>
                        {objectLength ?
                          this.renderCategoryBlock(list_type2) : <NoContentFound />}
                        {objectLength && this.renderSeeAllButton()}
                      </TabPane>
                    </Tabs> : filter === 'see-more' && !isSearchResult ? this.renderCategoryBlock(list_type2) :
                      this.renderClassifiedCard(classifiedList)}
                </div>
                {filter === undefined && <div className='ad-banner-bottom mt-0 mb-0'>
                  <CarouselSlider bannerItem={bottomImages} className='ad-banner' />
                </div>}
              </Content>
            </Layout>
          </Layout>
          {viewAll &&
            <SeeAllModal
              visible={viewAll}
              onCancel={() => this.setState({ viewAll: false })}
              popularSearches={popularSearches && popularSearches}
            />}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common, classifieds } = store;
  const { papularSearch } = classifieds
  const {isMenuOpen, categoryData } = common;

  let classifiedList = []
  classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    iconUrl: categoryData.classifiedAll !== undefined ? common.categoryData.classifiedAll.iconurl : '',
    classifiedList,
    popularSearches: papularSearch && papularSearch.success ? papularSearch.success.data : [],
    isMenuOpen
  };
};
export default ClassifiedsLandingPage = connect(
  mapStateToProps,
  { getClassifiedLandingPageData, newClassifiedList, checkPermissionForPostAd, getClassfiedCategoryListing, enableLoading, disableLoading, getBannerById, openLoginModel, papularSearch, classifiedGeneralSearch, mostPapularList }
)(ClassifiedsLandingPage);
