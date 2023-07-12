import React, { Fragment } from 'react';
import { connect } from 'react-redux';
// import AppSidebar from '../sidebar/HomeSideBarbar';
import AppSidebar from "./Sidebar";
import { getRetailCatLandingRoutes } from '../../common/getRoutes'
import { langs } from '../../config/localization';
import { Layout, Row, Typography, Tabs, Select, Button, Col } from 'antd';
import DetailCard from '../common/Card'
import DailyDealsCard from './retail-categories/DailyDealsCard';
import { retailDailyDeals, getRetailList, checkPermissionForPostAd, enableLoading, disableLoading, classifiedGeneralSearch, mostPapularList, getClassfiedCategoryListing, getBannerById, openLoginModel, papularSearch, getClassfiedCategoryDetail } from '../../actions/index';
import history from '../../common/History';
import { CarouselSlider } from '../common/CarouselSlider'
import { DEFAULT_ICON } from '../../config/Config'
import GeneralSearch from './GeneralRetailSearch'
import NoContentFound from '../common/NoContentFound'
import { renderMostPapularItem } from '../common/ImageCard'
// import SeeAllModal from './PapularSearch'
import PostAdPermission from '../templates/PostAdPermission'
import { capitalizeFirstLetter } from '../common'

import './retail.less'

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class RetailLandingPage extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      mostRecentList: [],
      recentlyView: [],
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
      middleImages: [],
      bestSellors: [],
      dailyDeals: []
    }
  }

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    this.props.enableLoading()
    this.getInitialData()
  }

  /**
   * @method getInitialData
   * @description get most recent records
   */
  getInitialData = () => {
    const { retailList } = this.props
    this.getMostPopularData()
    this.props.papularSearch({ module_type: langs.key.retail }, res => { });
    if (retailList && Array.isArray(retailList) && retailList.length) {
      let retailId = retailList.map(el => el.id);
      this.getMostRecentData(retailId, 'most_recent')
      this.getRecentlyViewData(retailId, 'recently_viewed')
      this.getBestSellors(retailId, 'best_seller')
      this.getDailyDeals(retailId)
    }
    this.props.getBannerById(6, res => {
      if (res.status === 200) {
        const data = res.data.success && Array.isArray(res.data.success.banners) ? res.data.success.banners : []
        
        if (data.length) {
          const banner = data.filter(el => el.moduleId === 2)
          this.getBannerData(banner)
        }
      }
    })
  }

  /**
   * @method getDailyDeals
   * @description get daily deals records
   */
  getDailyDeals = (id) => {
    let reqData = {
      category_id: id.join(',')
    }
    this.props.retailDailyDeals(reqData, res => {
      
      if (res.status === 200) {
        let data = res.data.data && res.data.data.data
        
        this.setState({ dailyDeals: data, total: res.data.data.total })
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
    const middle = banners.filter(el => el.bannerPosition === langs.key.middle)
    this.setState({ topImages: top, bottomImages: bottom, middleImages: middle })
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
  * @method getRetailData
  * @description get retail list
  */
  getRetailData = (requestData, filter) => {
    this.props.getRetailList(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        
        const retail = Array.isArray(res.data.data) ? res.data.data : []
        const newInRetail = retail.length && retail.slice(0, 12);
        if (filter === 'most_recent') {
          
          this.setState({ mostRecentList: newInRetail })
        } else if (filter === 'recently_viewed') {
          this.setState({ recentlyView: newInRetail })
        } else if (filter === 'best_seller') {
          this.setState({ bestSellors: newInRetail })
        }
      }
    })
  }

  /**
  * @method getRetailData
  * @description get retail list
  */
  getMostRecentData = (sub_cat_ids, filter) => {
    const { isLoggedIn, loggedInDetail } = this.props
    const id = sub_cat_ids && sub_cat_ids.length !== 0 && sub_cat_ids.join(',')
    const requestData = {
      id: id,
      filter: filter,
      user_id: isLoggedIn ? loggedInDetail.id : ''
    }
    this.getRetailData(requestData, filter)
  }

  /**
   * @method getRecentlyViewData
   * @description get recent view data list
   */
  getRecentlyViewData = (sub_cat_ids, filter) => {
    const { isLoggedIn, loggedInDetail } = this.props
    const id = sub_cat_ids && sub_cat_ids.length !== 0 && sub_cat_ids.join(',')
    const requestData = {
      id: id,
      filter: filter,
      user_id: isLoggedIn ? loggedInDetail.id : ''
    }
    this.getRetailData(requestData, filter)
  }

  /**
   * @method getBestSellors
   * @description get best sellors data
   */
  getBestSellors = (sub_cat_ids, filter) => {
    const { isLoggedIn, loggedInDetail } = this.props
    const id = sub_cat_ids && sub_cat_ids.length !== 0 && sub_cat_ids.join(',')
    const requestData = {
      id: id,
      filter: filter,
      user_id: isLoggedIn ? loggedInDetail.id : ''
    }
    this.getRetailData(requestData, filter)
  }




  /**
   * @method selectTemplateRoute
   * @description select tempalte route dynamically
   */
  selectTemplateRoute = (el) => {
    
    let catName = el.slug
    let path = getRetailCatLandingRoutes(el.id, catName)
    this.props.history.push(path)
  }

  /**
  * @method renderCategoryList
  * @description render category list
  */
  renderCategoryList = () => {
    const { retailList } = this.props
    if (retailList) {
      return retailList.map((el, i) => {
        let iconUrl = el.imageurl;
        return <li key={i} onClick={() => this.selectTemplateRoute(el)}>
          <div className={'item'}>
            <img onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_ICON
            }}
              src={iconUrl ? iconUrl : DEFAULT_ICON} alt='Home' width='30' className={'stroke-color'} />
            <Paragraph className='title'>{el.text}</Paragraph>
          </div>
        </li>

      })
    }
  }

  /**
  * @method renderPapularSearch
  * @description render papular search list
  */
  renderPapularSearch = (data) => {
    if (data && data.length !== 0) {
      return data.map((el, i) => {
        return (
          <li key={i}>
            {capitalizeFirstLetter(el.keyword)}
          </li>
        )
      })
    }
  }


  /**   
  * @method renderDistanceOptions
  * @description render subcategory
  */
  renderDistanceOptions = () => {
    return this.state.distanceOptions.map((el, i) => {
      return (
        <Option key={i} value={el}>{el} KM</Option>
      );
    })
  }

  /** 
     * @method handleSearchCall
     * @description Call Action for Classified Search
     */
  handleSearchCall = () => {
    // this.props.enableLoading()
    this.props.classifiedGeneralSearch(this.state.searchReqData, (res) => {
      // this.props.disableLoading()
      this.setState({ classifiedList: res.data })
    })

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
  renderCard = (categoryData) => {
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[18, 32]}>
            {categoryData && categoryData.slice(0, 4).map((data, i) => {
              return (
                <DetailCard
                  data={data} key={i}
                  retail={true}
                  col={6}
                  callNext={() => {
                    if (this.state.isSearchResult) {
                      this.handleSearchCall()
                    } else {
                      this.getMostRecentData(this.state.allId)
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

  /**
   * @method renderDailyDeals
   * @description render massage daily deals
   */
  renderDailyDeals = () => {
    const { dailyDeals } = this.state
    if (dailyDeals && Array.isArray(dailyDeals) && dailyDeals.length) {
      return dailyDeals.slice(0, 9).map((el, i) => {
        return (
          <Col className='gutter-row' md={8} key={i}>
            <DailyDealsCard data={el} type={'retail'} />
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
    const { isLoggedIn, popularSearches } = this.props;
    const { dailyDeals, total, bestSellors, middleImages, viewAll, topImages, bottomImages, mostRecentList, retailList, isSearchResult, recentlyView, selectedDistance, imageUrl, mostPapular, classifiedList } = this.state;
    let popularSearchesData = popularSearches && popularSearches.length > 10 ? popularSearches.slice(0, 10) : popularSearches
    return (
      <div className='App retail-theme common-main-category-landing new-custom-retail-landingpage'>
        <Layout>
          <Layout>
            <AppSidebar history={history} />
            <Layout className="right-parent-block">
              <div className="fix-pad-box">
                <div className='sub-header'>
                  <Title level={4} className='title'>{'WELCOME TO RETAIL'}</Title>
                  {/* <PostAdPermission history={history} title={'Start selling'}/> */}
                  <div className='action' >
                    <Button
                      type='primary'
                      className='btn-blue'
                      size={'large'}
                    >
                      {'Start Selling'}
                    </Button>
                  </div>
                </div>
                <div className='category-main-banner retail-landing category-main-banner-block'>
                  <CarouselSlider bannerItem={topImages} />
                </div>
                <GeneralSearch handleSearchResponce={this.handleSearchResponce} landingPage={true} />
              </div>
              <Content className='site-layout'>
                <div className="fix-pad-box">
                  {/* <div className='align-center new-custom-pt-60 pb-25 light-gradinat-bg'>
                    <Title level={3}>
                      {'Browse by categories'}
                    </Title>
                    <ul className='circle-icon-list dark column-5'>
                      {this.renderCategoryList()}
                    </ul>
                  </div> */}
                  <div className='wrap-inner bg-linear pb-76 pt-30'>
                    {!isSearchResult ? <Tabs type='card' className={'tab-style2'}>
                      <TabPane tab='
                                         Most Recent' key='1'>
                        {this.renderCard(mostRecentList)}
                        {mostRecentList && mostRecentList.length !== 0 &&
                          <div className='align-center see-all-btn-pad'>
                            <Button type='default' size={'middle'}
                              onClick={() => {
                                this.props.history.push(`/retail-detail/see-more/most-recent`)
                              }}
                            >
                              {'See All'}
                            </Button>
                          </div>}
                      </TabPane>
                      <TabPane tab='Daily Deals' key='2'>
                        {dailyDeals.length !== 0 ? <Row gutter={[38, 38]} >
                          {this.renderDailyDeals()}
                        </Row> : <NoContentFound />}
                        {total > 9 && <div className='align-center see-all-btn-pad'>
                          <Button type='default' size={'middle'}
                            onClick={() => {
                              this.props.history.push(`/retail-detail/see-more/daily-deals`)
                            }}>
                            {'See All'}
                          </Button>
                        </div>}
                      </TabPane>
                      <TabPane tab='Best Sellers' key='3'>
                        {this.renderCard(bestSellors)}
                        {bestSellors && bestSellors.length !== 0 &&
                          <div className='align-center see-all-btn-pad'>
                            <Button type='default' size={'middle'}
                              onClick={() => {
                                this.props.history.push(`/retail-detail/see-more/best-sellers`)
                              }}>
                              {'See All'}
                            </Button>
                          </div>}
                      </TabPane>
                      <TabPane tab='Recently Viewed' key='4'>
                        {this.renderCard(recentlyView)}
                        {recentlyView && recentlyView.length !== 0 &&
                          <div className='align-center see-all-btn-pad'>
                            <Button type='default' size={'middle'}
                              onClick={() => {
                                this.props.history.push(`/retail-detail/see-more/recently-viewed`)
                              }}>
                              {'See All'}
                            </Button>
                          </div>}
                      </TabPane>
                    </Tabs> :
                      this.renderCard(classifiedList)}
                  </div>
                </div>
                {/* <div className='category-main-banner category-mid-main-banner'>
                  <CarouselSlider bannerItem={middleImages} />
                </div> */}
                {/* <div className='ad-banner-bottom mt-0 mb-0'>
                                    <CarouselSlider bannerItem={bottomImages} className='ad-banner' />
                                </div> */}
                {/* <div className="render-mostpapular-item">
                  <div className='wrap-inner mb-50 most-popular-wrap-inner' >
                    <Title level={1} className='purple-text align-center'>
                      {'Most Popular Categories'}
                    </Title>

                    {renderMostPapularItem(mostPapular, imageUrl)}
                  </div>

                </div> */}
                <div className="fix-pad-box">
                  {/* <div className={'search-tags mt-0'}>
                    <div className={'search-tags-left'}>
                      <ul>
                        <li className={'search-tags-first'}>Popular Search:</li>
                        {popularSearchesData && this.renderPapularSearch(popularSearchesData)}
                      </ul>
                    </div>
                  </div> */}
                  <div className='ad-banner-bottom mt-0 mb-0'>
                    <CarouselSlider bannerItem={bottomImages} className='ad-banner' />
                  </div>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div >
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common, classifieds } = store;
  const { papularSearch } = classifieds
  const { categoryData } = common;
  
  let retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    retailList,
    popularSearches: papularSearch && papularSearch.success ? papularSearch.success.data : []
  };
};
export default RetailLandingPage = connect(
  mapStateToProps,
  { retailDailyDeals, getRetailList, checkPermissionForPostAd, getClassfiedCategoryListing, enableLoading, disableLoading, getBannerById, openLoginModel, papularSearch, classifiedGeneralSearch, mostPapularList }
)(RetailLandingPage);
