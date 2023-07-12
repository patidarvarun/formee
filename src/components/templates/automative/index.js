import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppSidebar from "../../sidebar";
import {
  Layout,
  Row,
  Tabs,
  Button,
  Breadcrumb,
  Card, Select
} from "antd";
import {
  getMostViewdData,
  getBannerById,
  enableLoading,
  disableLoading,
  getClassfiedTabListing,
  papularSearch,
  getClassfiedCategoryListing,
  classifiedGeneralSearch,
  getClassfiedCategoryDetail,
  openLoginModel,
  getChildCategory,
} from "../../../actions/index";
import DetailCard from "../../common/Card";
import MostPopularCard from '../../common/DetailCard'
import history from "../../../common/History";
import GeneralSearch from '../GeneralSearch';
import { CarouselSlider } from "../../common/CarouselSlider";
import SubHeader from "../../common/SubHeader";
import NoContentFound from "../../common/NoContentFound";
import { TAB_FILTER } from "../../../config/Config";
import SeeAllModal from "../PapularSearch";
import { langs } from "../../../config/localization";
import { capitalizeFirstLetter } from '../../common'
import Icon from '../../../components/customIcons/customIcons';
import GeneralCard from '../../grid-view-card/GeneralCard'
import JobDetailCard from '../../grid-view-card/JobDetailCard'

//New changes 
import { NewCarouselSlider } from '../../common/NewCrousalSlider'
import SideBar from '../../sidebar/ClassifiedSideBar'
const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

class SimpleLandingPage extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      key: "tab1",
      noTitleKey: "app",
      classifiedList: [],
      subCategory: [],
      filteredData: [],
      isFilterPage: false,
      isSearchResult: false,
      catName: "",
      isOpen: false,
      searchLatLng: "",
      mostRecentList: [],
      topRatedList: [],
      papularViewData: [],
      searchReqData: {},
      viewAll: false,
      tempSlug: '',
      slug: '',
      displayType: 'grid',
      activTab: '1',
      isSidebarOpen: false
    };
  }

  /**
   * @methodcomponentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial = this.props.match.params.categoryId;
    let catIdNext = nextprops.match.params.categoryId;
    if (catIdInitial !== catIdNext) {
      this.getBannerData(catIdNext)
      this.getMostRecentData(catIdNext);
      this.getChildCategory(catIdNext);
      this.getPopularView(catIdNext);
      this.setState({ isSearchResult: false, isSidebarOpen:false })
      this.props.papularSearch(
        { module_type: langs.key.classified, category_id: catIdNext },
        (res) => { }
      );
    }
  }

  /**
  * @methodcomponentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    let cat_id = this.props.match.params.categoryId;
    this.getBannerData(cat_id)
    this.getMostRecentData(cat_id);
    this.getPopularView(cat_id);
    this.props.papularSearch(
      { module_type: langs.key.classified, category_id: cat_id },
      (res) => { }
    );
    this.getChildCategory(cat_id);
  }


  /**
   * @method getPopularView
   * @description get all popular viewd data
   */
  getPopularView = (cat_id) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const requestData = {
      category_id: cat_id,
      module_type: langs.key.classified,
      user_id: isLoggedIn ? loggedInDetail.id : "",
      page: 1,
      page_size: 12
    };
    this.props.getMostViewdData(requestData, (res) => {
      if (res.status === 200) {
        const data1 = res.data.data.classifiedMostViewed;
        const classified = data1.length && data1;
        this.setState({ papularViewData: classified });
      }
    });
  };

  /**
   * @method getChildCategory
   * @description get getChildCategory records
   */
  getChildCategory = (id) => {
    let isFilterPage = this.props.location.state === undefined ? false : true;
    this.props.getChildCategory({ pid: id }, (res1) => {
      if (res1.status === 200) {
        const data =
          Array.isArray(res1.data.newinsertcategories) &&
          res1.data.newinsertcategories;
        this.setState({
          subCategory: data,
          isFilterPage: isFilterPage,
        });
      }
    });
  };

  /**
   * @method getBannerData
   * @description get most recent records
   */
  getBannerData = (catId) => {
    this.props.enableLoading()
    this.props.getBannerById(3, (res) => {

      this.props.disableLoading()
      if (res.status === 200) {
        const banner = res.data.success && res.data.success.banners;
        const generalBanner = banner.filter(el => el.moduleId === 1)
        const top = generalBanner.filter(
          (el) => String(el.categoryId) === String(catId) && el.subcategoryId === ""
        );
        this.setState({
          topImages: top
        });
      }
    });
  };

  /**
   * @method getMostRecentData
   * @description get most recent records
   */
  getMostRecentData = (id) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData1 = {
      id: id,
      page: 1,
      page_size: 12,
      filter: TAB_FILTER.MOST_RECENT,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    //deep copy
    let reqData2 = Object.assign({}, reqData1);
    reqData2.filter = TAB_FILTER.TOP_RATED

    this.props.getClassfiedTabListing(reqData1, reqData2, (res1, res2) => {
      let mostRecentList = []
      let topRatedList = []
      let tempSlug = '';
      let catName = ''
      let slug = ''
      if (res1.status === 200) {
        mostRecentList = res1.data.data
        tempSlug = res1.data.template_slug
        catName = res1.data.category_name
        slug = res1.data.slug
      }
      if (res2.status === 200) {
        topRatedList = res2.data.data
      }
      this.setState({ mostRecentList, topRatedList, tempSlug, catName, slug: slug })
    })
  };

  /**
   * @method getClassifiedListing
   * @description getClassifiedListing records
   */
  getClassifiedListing = (id, filter = TAB_FILTER.MOST_RECENT) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData = {
      id: id,
      page: 1,
      page_size: 12,
      filter,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getClassfiedCategoryListing(reqData, (res) => {
      if (res.status === 200) {
        this.setState({
          classifiedList: res.data.data,
        });
      }
    });
  };

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    this.setState({ [type]: key, activTab: key });
  };

  /**
   * @method renderPapularSearch
   * @description render papular search list
   */
  renderPapularSearch = (data) => {
    return (
      data.length &&
      data.map((el, i) => {
        return <li key={i}>{capitalizeFirstLetter(el.keyword)}</li>;
      })
    );
  };

  /**
   * @method handleSearchCall
   * @description Call Action for Classified Search
   */
  handleSearchCall = () => {
    this.props.classifiedGeneralSearch(this.state.searchReqData, (res) => {
      this.setState({ classifiedList: res.data });
    });
  };

  /**
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    let cat_id = this.props.match.params.categoryId;
    if (resetFlag) {
      this.setState({ isSearchResult: false });
      this.getMostRecentData(cat_id);
    } else {
      this.setState({
        classifiedList: res,
        isSearchResult: true,
        searchReqData: reqData,
      });
    }
  };

  /**
   * @method renderCard
   * @description render card details
   */
  renderCard = (categoryData) => {
    const { displayType } = this.state
    if (displayType === 'grid') {
      return this.renderGridView(categoryData)
    } else {
      return this.renderListView(categoryData)
    }
  };

  /**
   * @method renderGridView
   * @description render grid view
   */
  renderGridView = (categoryData) => {
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[18, 32]}>
            {categoryData &&
              categoryData.map((data, i) => {
                return (
                  <DetailCard
                    data={data}
                    key={i}
                  />
                );
              })}
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  }

  /**
   * @method renderListView
   * @description render list view
   */
  renderListView = (categoryData) => {
    const { tempSlug } = this.state
    if (categoryData && categoryData.length) {
      if (tempSlug !== 'job') {
        return (
          <Fragment>
            <Row gutter={[0, 0]}>
              {categoryData &&
                categoryData.map((data, i) => {
                  return (
                    <GeneralCard
                      data={data}
                      key={i}
                      tempSlug={tempSlug}
                    />
                  );
                })}
            </Row>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <Row gutter={[0, 0]}>
              {categoryData &&
                categoryData.map((data, i) => {
                  return (
                    <JobDetailCard
                      data={data}
                      key={i}
                      tempSlug={tempSlug}
                    />
                  );
                })}
            </Row>
          </Fragment>
        );
      }
    } else {
      return <NoContentFound />;
    }
  }

  /**
   * @method renderMostPopular
   * @description render most popular card
   */
  renderMostPopular = (categoryData) => {
    const { displayType } = this.state
    if (displayType === 'grid') {
      return this.renderMostPopularGrid(categoryData)
    } else {
      return this.renderListView(categoryData)
    }
  }


  /**
   * @method renderMostPopularGrid
   * @description render most popular card
   */
  renderMostPopularGrid = (categoryData) => {
    if (categoryData && categoryData.length) {
      return (
        <MostPopularCard
          destructuredKey={{
            catIdkey: 'parent_categoryid',
            subCatIdKey: 'id',
            catname: 'parentCategoryName'
          }}
          flag={{ wishlist: 'wishlist' }}
          topData={categoryData}
        />
      )
    } else {
      return <NoContentFound />;
    }
  }

  /**
  * @method handleSort
  * @description handle sort
  */
  handleSort = (e) => {
    const { isSearchResult, classifiedList, mostRecentList, topRatedList, papularViewData, activTab } = this.state;
    let data = mostRecentList
    if (isSearchResult) {
      data = classifiedList
    } else if (activTab == '1') {
      data = mostRecentList
    } else if (activTab == '2') {
      data = topRatedList
    } else if (activTab == '3') {
      data = papularViewData
    }
    this.setState({ sortBy: e })
    let filteredList = data.sort(function (a, b) {
      if (e == 2) {
        if (a.title < b.title) { return -1; }
        if (a.title > b.title) { return 1; }
        return 0;
      } else if (e == 3) {
        if (a.title > b.title) { return -1; }
        if (a.title < b.title) { return 1; }
        return 0;
      } else if (e == 1) {
        if (a.price > b.price) { return -1; }
        if (a.price < b.price) { return 1; }
        return 0;
      } else {
        if (a.price < b.price) { return -1; }
        if (a.price > b.price) { return 1; }
        return 0;
      }
    })
    if (isSearchResult) {
      this.setState({ classifiedList: filteredList })
    } else if (activTab == '1') {
      this.setState({ topRatedList: filteredList })
    } else if (activTab == '2') {
      this.setState({ mostRecentList: filteredList })
    } else if (activTab == '3') {
      this.setState({ papularViewData: filteredList })
    }
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      viewAll,
      papularViewData,
      topRatedList,
      mostRecentList,
      redirectTo,
      classifiedList,
      topImages,
      subCategory,
      isSearchResult,
      tempSlug,
      catName,
      slug,
      displayType,
      isSidebarOpen
    } = this.state;
    const { popularSearches } = this.props;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let templateName = tempSlug
    console.log('displayType', displayType)
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing category-sub-category-landing">
        <Layout className="common-left-right-padd">
          {/* <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} /> */}
          <SideBar
            history={history}
            activeCategoryId={cat_id}
            moddule={1}
            subCategory={subCategory}
            classifiedList={mostRecentList.length ? mostRecentList : topRatedList}
            pid={cat_id && cat_id}
            parameter={parameter}
            template={templateName}
            catName={catName}
            toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
          />
          <Layout className="right-parent-block">

            <div className="inner-banner custom-inner-banner">
              <SubHeader
                subCategory={subCategory}
                classifiedList={
                  mostRecentList.length ? mostRecentList : topRatedList
                }
                pid={cat_id && cat_id}
                parameter={parameter}
                template={templateName}
                catName={catName}
                isSidebarOpen={isSidebarOpen}
              />
              <CarouselSlider bannerItem={topImages} pathName="/" />
              <GeneralSearch
                ref="child"
                handleSearchResponce={this.handleSearchResponce}
                showMoreOption={true}
                template={templateName}
                slug={slug}
              />
            </div>
            <Content className="site-layout">
              <Breadcrumb separator="|"
                className='ant-breadcrumb-pad'
              >
                <Breadcrumb.Item>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/classifieds">Classified</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{parameter.categoryName}</Breadcrumb.Item>
              </Breadcrumb>
              <div className='wrap-inner full-width-wrap-inner wrap-inner-position-relative pt-0'>
                <div className="card-tile-listing">
                  <Card
                    bordered={false}
                    extra={
                      <ul className='panel-action'>
                        {/* <li>
                          <div className='location-name'>
                            <Icon icon='location' size='20' className='mr-5' />
                                  Melbourne City
                            </div>
                          </li> */}
                          <li title={'List view'} className={displayType === 'list' ? 'active' : ''}>
                              <img src={require('../../dashboard-sidebar/icons/list-gray.svg')}   alt='' width='18' onClick={() => this.setState({displayType: 'list'})}/>
                          </li>
                          <li title={'Grid view'} className={displayType === 'grid' ? 'active' : ''} onClick={() => this.setState({displayType: 'grid'})}>
                              <Icon icon='grid' size='18' />
                          </li>
                           
                          <li>
                            {/* <label className={'mr-10'}>{'Sort'}</label>
                            <Select
                                defaultValue={'Recommended'}
                                onChange={this.handleSort}
                                dropdownMatchSelectWidth={false}
                            >
                                <Option value='0'>Price: Low to High</Option>
                                <Option value='1'>Price: High to Low</Option>
                                <Option value='2'>Name: A to Z</Option>
                                <Option value='3'>Name: Z to A</Option>
                            </Select> */}
                          </li>
                        </ul>
                        }
                        className={'home-product-list header-nospace'}
                      >
                    </Card>
                  </div>
        
                {!isSearchResult ? (
                  <Tabs
                    type="card"
                    className={"tab-style2"}
                    onChange={this.onTabChange}
                  >
                    <TabPane tab="Most Recent" key="1">
                      {this.renderCard(mostRecentList)}
                      <div className="align-center see-all-wrapp">
                        {mostRecentList && mostRecentList.length !== 0 && (
                          <Button
                            type="default"
                            size={"middle"}
                            onClick={() => {
                              this.props.history.push(
                                `/classifieds/see-more/most-recent/${displayType}/${cat_id}`
                              );
                            }}
                          >
                            {"See All"}
                          </Button>
                        )}
                      </div>
                    </TabPane>
                    <TabPane tab="Top Rated" key="2">
                      {this.renderCard(topRatedList)}
                      <div className="align-center see-all-wrapp">
                        {topRatedList && topRatedList.length !== 0 && (
                          <Button
                            type="default"
                            size={"middle"}
                            onClick={() => {
                              this.props.history.push(
                                `/classifieds/see-more/top-rated/${displayType}/${cat_id}`
                              );
                            }}
                          >
                            {"See All"}
                          </Button>
                        )}
                      </div>
                    </TabPane>
                    <TabPane tab="Most Popular" key="3">
                      {this.renderMostPopular(papularViewData)}
                      <div className="align-center see-all-wrapp">
                        {papularViewData && papularViewData.length !== 0 && (
                          <Button
                            type="default"
                            size={"middle"}
                            onClick={() => {
                              this.props.history.push(
                                `/see-more/popular-view/${displayType}/${templateName}/${parameter.categoryName}/${cat_id}`
                              );
                            }}
                          >
                            {"See All"}
                          </Button>
                        )}
                      </div>
                    </TabPane>
                  </Tabs>
                ) : <div className="serch-list-view-result">
                     {this.renderCard(classifiedList)}
                  </div>}
              </div>
            </Content>
          </Layout>
        </Layout>
        {redirectTo && (
          <Redirect
            push
            to={{
              pathname: redirectTo,
              state: {
                parentCategory: parameter.categoryName,
                cat_id: cat_id,
              },
            }}
          />
        )}
        {viewAll && (
          <SeeAllModal
            visible={viewAll}
            onCancel={() => this.setState({ viewAll: false })}
            popularSearches={popularSearches && popularSearches}
          />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, classifieds } = store;
  const { papularSearch } = classifieds;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    popularSearches:
      papularSearch && papularSearch.success ? papularSearch.success.data : [],
  };
};

export default connect(mapStateToProps, {
  getClassfiedCategoryListing,
  enableLoading,
  disableLoading,
  classifiedGeneralSearch,
  getClassfiedCategoryDetail,
  getBannerById,
  openLoginModel,
  getChildCategory,
  papularSearch,
  getMostViewdData,
  getClassfiedTabListing,
})(withRouter(SimpleLandingPage));
