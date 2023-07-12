import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppSidebar from "../Sidebar";
import {
  Card,
  Layout,
  Row,
  Col,
  Typography,
  Tabs,
  Button,
  Breadcrumb,
  Select,
} from "antd";
import Icon from "../../customIcons/customIcons";
import {
  getMostViewdData,
  getBannerById,
  enableLoading,
  disableLoading,
  getRetailList,
  retailPopularItems,
} from "../../../actions/index";
import {
  papularSearch,
  getClassfiedCategoryListing,
  classifiedGeneralSearch,
  getClassfiedCategoryDetail,
  openLoginModel,
  mostPapularList,
  applyRetailFilter,
} from "../../../actions";
import DetailCard from "../../common/Card";
import MostPopularCard from "../../common/DetailCard";
import history from "../../../common/History";
import GeneralSearch from "../GeneralRetailSearch";
import { CarouselSlider } from "../../common/CarouselSlider";
import SubHeader from "../SubHeader";
import NoContentFound from "../../common/NoContentFound";
import { TAB_FILTER } from "../../../config/Config";
import { langs } from "../../../config/localization";
import { capitalizeFirstLetter } from "../../common";
import {
  renderMostPapularItem,
  papularView,
} from "../../classified-templates/CommanMethod";
import Sidebar from "../NewSidebar";
import GeneralCard from "../../grid-view-card/GeneralCard";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class GeneralLandingPage extends React.Component {
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
      isFilterPage:
        this.props.location.state !== undefined &&
        this.props.location.state.filterReqData !== undefined
          ? true
          : false,
      isSearchResult: false,
      catName: "",
      isOpen: false,
      searchLatLng: "",
      mostRecentList: [],
      topRatedList: [],
      papularViewData: [],
      searchReqData: {},
      viewAll: false,
      resetFlag: false,
      tabKey: "1",
      bottomImages: [],
      topImages: [],
      middle1Images: [],
      middle2Images: [],
      middle3Images: [],
      displayType: "grid",
      isSidebarOpen: false,
      activeTab: "1",
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial = this.props.match.params.categoryId;
    let catIdNext = nextprops.match.params.categoryId;
    if (catIdInitial !== catIdNext) {
      this.props.enableLoading();
      this.getBannerData(catIdNext);
      this.getMostRecentData(catIdNext);
      this.getMostPopularData(catIdNext);
    }
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    this.props.enableLoading();
    let cat_id = this.props.match.params.categoryId;
    this.getBannerData(cat_id);
    this.getDetails(cat_id);
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = (cat_id) => {
    this.getMostRecentData(cat_id);
    this.getMostPopularData(cat_id);
  };

  /**
   * @method getBannerData
   * @description get most recent records
   */
  getBannerData = (catId) => {
    this.props.getBannerById(7, (res) => {
      if (res.status === 200) {
        const data = res.data.data && res.data.data.banners;
        const banner = data.filter((el) => el.moduleId === 2);

        const top = banner.filter(
          (el) =>
            el.categoryId == catId &&
            el.subcategoryId == "" &&
            el.bannerPosition === langs.key.top
        );
        const middle1Images = banner.filter(
          (el) =>
            el.categoryId == catId &&
            el.subcategoryId == "" &&
            el.bannerPosition === langs.key.middle_one
        );
        const middle2Images = banner.filter(
          (el) =>
            el.categoryId == catId &&
            el.subcategoryId == "" &&
            el.bannerPosition === langs.key.middle_two
        );
        const middle3Images = banner.filter(
          (el) =>
            el.categoryId == catId &&
            el.subcategoryId == "" &&
            el.bannerPosition === langs.key.middle_three
        );
        const bottom = banner.filter(
          (el) =>
            el.categoryId == catId &&
            el.subcategoryId == "" &&
            el.bannerPosition === langs.key.bottom
        );

        this.setState({
          topImages: top,
          middle1Images: middle1Images,
          middle2Images: middle2Images,
          middle3Images: middle3Images,
          bottomImages: bottom,
        });
        console.log("top landing", top);
      }
    });
  };

  /**
   * @method getMostPopularData
   * @description get most papular data
   */
  getMostPopularData = (cat_id) => {
    let reqData = {
      category_id: cat_id,
    };
    this.props.retailPopularItems(reqData, (res) => {
      if (res.status === 200) {
        const data = res.data.data && res.data.data.data;
        let pupularList = Array.isArray(data) && data.length ? data : [];
        this.setState({ mostPapular: pupularList });
      }
    });
  };

  /**
   * @method getMostRecentData
   * @description get most recent records
   */
  getMostRecentData = (id) => {
    const { isFilterPage, resetFlag, tabKey } = this.state;
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData = {
      id: id,
      page: 1,
      page_size: 12,
      filter: TAB_FILTER.MOST_RECENT,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getRetailList(reqData, (res) => {
      this.props.disableLoading();
      this.getTopRatedData(id);
      if (res.status === 200) {
        const retail = Array.isArray(res.data.data) ? res.data.data : [];
        const newInRetail = retail.length ? retail.slice(0, 12) : [];
        this.setState({ mostRecentList: newInRetail });
      }
    });
  };

  /**
   * @method getTopRatedData
   * @description get top rated records
   */
  getTopRatedData = (id) => {
    const { tabKey } = this.state;
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData = {
      id: id,
      page: 1,
      page_size: 12,
      filter: TAB_FILTER.TOP_RATED,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getRetailList(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        const retail = Array.isArray(res.data.data) ? res.data.data : [];
        const newInRetail = retail.length ? retail.slice(0, 12) : [];
        this.setState({ topRatedList: newInRetail });
      }
    });
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
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    if (resetFlag) {
      this.setState({ isSearchResult: false });
      this.getMostRecentData(this.state.allId);
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
    const { displayType } = this.state;
    if (displayType === "grid") {
      return this.renderGridView(categoryData);
    } else {
      return this.renderListView(categoryData);
    }
  };

  /**
   * @method renderGridView
   * @description render grid view
   */
  renderGridView = (categoryData) => {
    let cat_id = this.props.match.params.categoryId;
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[18, 32]}>
            {categoryData &&
              categoryData.map((data, i) => {
                return (
                  <DetailCard
                    data={data}
                    retail={true}
                    key={i}
                    callNext={() => this.getDetails(cat_id)}
                  />
                );
              })}
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method renderListView
   * @description render list view
   */
  renderListView = (categoryData) => {
    const { tempSlug } = this.state;
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[0, 0]}>
            {categoryData &&
              categoryData.map((data, i) => {
                return <GeneralCard data={data} key={i} retail={true} />;
              })}
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method renderMiddleBannerCard
   * @description render middle banner cards
   */
  renderMiddleBannerCard = (bannerItem) => {
    if (bannerItem && bannerItem.length) {
      return (
        bannerItem &&
        bannerItem.map((item, i) => {
          return (
            <Fragment>
              <div className="banner-card">
                <a href={`http://${item.imageUrl}`} target="blank">
                  <img
                    src={
                      item.bannerImage
                        ? item.bannerImage
                        : require("../../../assets/images/default_image.jpg")
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = require("../../../assets/images/default_image.jpg");
                    }}
                    alt={item.bannerPosition}
                  />
                </a>
              </div>
            </Fragment>
          );
        })
      );
    } else {
      return (
        <div className="no-img-slide">
          <img
            src={require("../../../assets/images/beauty-accessories-banner5.png")}
            alt=""
          />
        </div>
      );
    }
  };

  /**
   * @method onTabChange
   * @description handle on tab change
   */
  onTabChange = (key) => {
    this.setState({ tabKey: key, activTab: key }, () => {
      let cat_id = this.props.match.params.categoryId;
      this.getMostRecentData(cat_id);
    });
  };

  /**
   * @method renderMostPopular
   * @description render most popular card
   */
  renderMostPopular = (categoryData) => {
    const { displayType } = this.state;
    if (displayType === "grid") {
      return this.renderMostPopularGrid(categoryData);
    } else {
      return this.renderListView(categoryData);
    }
  };

  /**
   * @method renderMostPopularGrid
   * @description render most popular card
   */
  renderMostPopularGrid = (categoryData) => {
    if (categoryData && categoryData.length) {
      return (
        <MostPopularCard
          destructuredKey={{
            catIdkey: "parent_categoryid",
            subCatIdKey: "id",
            catname: "parentCategoryName",
          }}
          flag={{ wishlist: "wishlist" }}
          topData={categoryData}
          retail={true}
        />
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method handleSort
   * @description handle sort
   */
  handleSort = (e) => {
    const {
      isSearchResult,
      classifiedList,
      mostRecentList,
      topRatedList,
      mostPapular,
      activeTab,
    } = this.state;
    let data = mostRecentList;
    if (isSearchResult) {
      data = classifiedList;
    } else if (activeTab == "1") {
      data = mostRecentList;
    } else if (activeTab == "2") {
      data = topRatedList;
    } else if (activeTab == "3") {
      data = mostPapular;
    }
    console.log("data", data, activeTab);
    this.setState({ sortBy: e });
    let filteredList =
      data &&
      data.sort(function (a, b) {
        if (e == 2) {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        } else if (e == 3) {
          if (a.title > b.title) {
            return -1;
          }
          if (a.title < b.title) {
            return 1;
          }
          return 0;
        } else if (e == 1) {
          if (a.price > b.price) {
            return -1;
          }
          if (a.price < b.price) {
            return 1;
          }
          return 0;
        } else {
          if (a.price < b.price) {
            return -1;
          }
          if (a.price > b.price) {
            return 1;
          }
          return 0;
        }
      });
    if (isSearchResult) {
      this.setState({ classifiedList: filteredList });
    } else if (activeTab == "1") {
      this.setState({ topRatedList: filteredList });
    } else if (activeTab == "2") {
      this.setState({ mostRecentList: filteredList });
    } else if (activeTab == "3") {
      this.setState({ mostPapular: filteredList });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      imageUrl,
      middle1Images,
      middle2Images,
      middle3Images,
      bottomImages,
      mostPapular,
      viewAll,
      papularViewData,
      topRatedList,
      mostRecentList,
      redirectTo,
      classifiedList,
      topImages,
      subCategory,
      isSearchResult,
      selectedDistance,
      isFilterPage,
      displayType,
      isSidebarOpen,
    } = this.state;
    const { popularSearches } = this.props;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let cat_name = parameter.categoryName;
    let templateName =
      mostRecentList && mostRecentList.length
        ? mostRecentList[0].template_slug
        : topRatedList.length && topRatedList[0].template_slug;
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="retail-theme common-left-right-padd">
          {/* <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} /> */}
          <Sidebar
            history={history}
            activeCategoryId={cat_id}
            moddule={1}
            subCategoryPage={true}
            toggleSideBar={() =>
              this.setState({ isSidebarOpen: !isSidebarOpen })
            }
          />
          <Layout className="right-parent-block">
            <div className="inner-banner">
              <SubHeader />
              <CarouselSlider bannerItem={topImages} pathName="/" />
              <GeneralSearch
                ref="child"
                handleSearchResponce={this.handleSearchResponce}
                subcategoryPage={true}
              />
            </div>
            <Content className="site-layout">
              <Breadcrumb separator="|" className="ant-breadcrumb-pad">
                <Breadcrumb.Item>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/retail">Retail</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{parameter.categoryName}</Breadcrumb.Item>
              </Breadcrumb>
              <div className="wrap-inner pb-88 full-width-wrap-inner wrap-inner-position-relative pt-0">
                <div className="card-tile-listing">
                  <Card
                    bordered={false}
                    extra={
                      <ul className="panel-action">
                        {/* <li>
                          <div className='location-name'>
                            <Icon icon='location' size='20' className='mr-5' />
                                  Melbourne City
                            </div>
                        </li> */}
                        <li
                          title={"List view"}
                          className={displayType === "list" ? "active" : ""}
                        >
                          <img
                            src={require("../../dashboard-sidebar/icons/list-dark-gray.png")}
                            alt=""
                            width="18"
                            onClick={() =>
                              this.setState({ displayType: "list" })
                            }
                          />
                        </li>
                        <li
                          title={"Grid view"}
                          className={displayType === "grid" ? "active" : ""}
                          onClick={() => this.setState({ displayType: "grid" })}
                        >
                          <Icon icon="grid" size="18" />
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
                    className={"home-product-list header-nospace"}
                  ></Card>
                </div>
                {!isSearchResult ? (
                  <Tabs
                    type="card"
                    className={"tab-style2"}
                    onChange={this.onTabChange}
                  >
                    <TabPane tab="Most Recent" key="1">
                      {this.renderCard(mostRecentList)}
                      <div className="see-all-wrap">
                        {mostRecentList && mostRecentList.length !== 0 && (
                          <Button
                            type="default"
                            size={"middle"}
                            onClick={() => {
                              this.props.history.push(
                                `/retail-detail/see-more/most-recent/${displayType}/${cat_name}/${cat_id}`
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
                      <div className="see-all-wrap">
                        {topRatedList && topRatedList.length !== 0 && (
                          <Button
                            type="default"
                            size={"middle"}
                            onClick={() => {
                              this.props.history.push(
                                `/retail-detail/see-more/top-rated/${displayType}/${cat_name}/${cat_id}`
                              );
                            }}
                          >
                            {"See All"}
                          </Button>
                        )}
                      </div>
                    </TabPane>
                    <TabPane tab="Most Popular" key="3">
                      {this.renderMostPopular(mostPapular)}
                      <div className="align-center see-all-wrap">
                        {mostPapular && mostPapular.length !== 0 && (
                          <Button
                            type="default"
                            size={"middle"}
                            onClick={() => {
                              this.props.history.push(
                                `/retail-detail/see-more/popular-view/${displayType}/${cat_name}/${cat_id}`
                              );
                            }}
                          >
                            {"See All"}
                          </Button>
                        )}
                      </div>
                    </TabPane>
                  </Tabs>
                ) : (
                  <div className="serch-list-view-result">
                    {this.renderCard(classifiedList)}
                  </div>
                )}
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
    selectedClassifiedList: classifieds.classifiedsList,
    popularSearches:
      papularSearch && papularSearch.success ? papularSearch.success.data : [],
  };
};

export default connect(mapStateToProps, {
  getRetailList,
  getClassfiedCategoryListing,
  enableLoading,
  disableLoading,
  classifiedGeneralSearch,
  getClassfiedCategoryDetail,
  getBannerById,
  openLoginModel,
  papularSearch,
  getMostViewdData,
  mostPapularList,
  retailPopularItems,
  applyRetailFilter,
})(withRouter(GeneralLandingPage));
