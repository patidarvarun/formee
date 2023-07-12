import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import AppSidebar from "../Sidebar";
import {
  Button,
  Tabs,
  Layout,
  Row,
  Col,
  Card,
  Select,
  Breadcrumb,
  Pagination,
} from "antd";
import Icon from "../../../components/customIcons/customIcons";
import { langs } from "../../../config/localization";
import {
  getRetailList,
  enableLoading,
  disableLoading,
  getBannerById,
  getChildCategory,
} from "../../../actions/index";
import {
  getClassfiedCategoryListing,
  classifiedGeneralSearch,
  applyRetailFilter,
  getClassfiedCategoryDetail,
} from "../../../actions";
import DetailCard from "../../common/Card";
import history from "../../../common/History";
import { CarouselSlider } from "../../common/CarouselSlider";
import ChildSubHeader from "../SubHeader";
import NoContentFound from "../../common/NoContentFound";
import {
  getMapViewRoute,
  getRetailCatLandingRoutes,
} from "../../../common/getRoutes";
import GeneralSearch from "../GeneralRetailSearch";
import Sidebar from "../NewSidebar";
import GeneralCard from "../../grid-view-card/GeneralCard";
import { TAB_FILTER } from "../../../config/Config";
const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

// Pagination
function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return (
      <a>
        <Icon icon="arrow-left" size="14" className="icon" /> Back
      </a>
    );
  }
  if (type === "next") {
    return (
      <a>
        Next <Icon icon="arrow-right" size="14" className="icon" />
      </a>
    );
  }
  return originalElement;
}

class SimpleSubCategory extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      key: "tab1",
      noTitleKey: "app",
      classifiedList: [],
      sortBy: 0,
      searchKey: "",
      isSearch: false,
      filteredData: [],
      isFilterPage:
        this.props.location.state !== undefined &&
        this.props.location.state.filterReqData !== undefined
          ? true
          : false,
      distanceOptions: [0, 5, 10, 15, 20],
      selectedDistance: 0,
      isSearchResult: false,
      catName: "",
      searchLatLng: "",
      searchReqData: {},
      filterReqData: {},
      templateName: "",
      isSidebarOpen: false,
      displayType: "grid",
      activeTab: "1",
    };
  }

  /**
   * @method componentWillMount
   * @description called before render the component
   */
  componentWillMount() {
    this.getAllData();
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    let parameter = this.props.match.params;
    let parentId = parameter.categoryId;
    let id = parameter.subCategoryId
      ? parameter.subCategoryId
      : parameter.categoryId;
    let categoryId =
      parameter.all === langs.key.all ? parameter.categoryId : id;
    this.getChildCategory(parentId);
    this.getBannerData(categoryId, parameter.all);
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let parameter = this.props.match.params;
    let catId = parameter.categoryId;
    let catIdInitial = parameter.subCategoryId;
    let catIdNext = nextprops.match.params.subCategoryId;
    if (
      catIdInitial !== catIdNext &&
      nextprops.match.params.all === undefined
    ) {
      this.props.enableLoading();
      this.getRetailListing(catIdNext, this.state.page);
      const id = nextprops.match.params.subCategoryId
        ? nextprops.match.params.subCategoryId
        : nextprops.match.params.categoryId;
      this.getBannerData(id);
    }
    if (
      nextprops.match.params.all === langs.key.all &&
      parameter.all === undefined
    ) {
      this.props.enableLoading();
      this.getAllChildData(catId, this.state.page);
      this.getBannerData(
        nextprops.match.params.categoryId,
        nextprops.match.params.all
      );
    }
  }

  /**
   * @method getBannerData
   * @description get banner data
   */
  getBannerData = (categoryId, allData) => {
    let parameter = this.props.match.params;
    this.props.getBannerById(3, (res) => {
      if (res.status === 200) {
        this.props.disableLoading();
        let top = "";
        const banner = res.data.data && res.data.data.banners;
        if (allData === langs.key.all) {
          top =
            banner.length !== 0 &&
            banner.filter(
              (el) => el.categoryId == categoryId && el.subcategoryId !== ""
            );
          if (top.length === 0) {
            top =
              banner.length !== 0 &&
              banner.filter(
                (el) =>
                  el.categoryId == parameter.categoryId &&
                  el.subcategoryId === ""
              );
          }
        } else {
          let temp = [];
          top =
            banner.length !== 0 &&
            banner.filter((el) => el.subcategoryId == categoryId);
          temp = top;
          if (temp.length === 0) {
            top =
              banner.length !== 0 &&
              banner.filter(
                (el) =>
                  el.categoryId == parameter.categoryId &&
                  el.subcategoryId === ""
              );
            console.log(parameter.categoryId, "temp", temp);
          }
        }
        console.log("top", top);
        if (top.length === 0) {
          this.props.getBannerById(7, (res) => {
            if (res.status === 200) {
              const data = res.data.data && res.data.data.banners;
              const banner = data.filter((el) => el.moduleId === 2);
              const top = banner.filter(
                (el) =>
                  el.categoryId == parameter.categoryId &&
                  el.subcategoryId == "" &&
                  el.bannerPosition === langs.key.top
              );
              this.setState({ topImages: top });
            }
          });
        } else {
          this.setState({ topImages: top });
        }
      }
    });
  };

  /**
   * @method getAllData
   * @description get all data
   */
  getAllData = () => {
    const { page, isFilterPage } = this.state;
    let parameter = this.props.match.params;
    let catIdInitial = this.props.match.params.subCategoryId;
    let catId = this.props.match.params.categoryId;
    if (isFilterPage && this.props.location.state.filterReqData !== undefined) {
      this.props.applyRetailFilter(
        this.props.location.state.filterReqData,
        (res) => {
          if (res.status === 1) {
            this.setState({
              classifiedList: res.data,
              templateName: this.props.location.state.templateName,
              filterReqData: this.props.location.state.filterReqData,
            });
          } else {
            this.setState({
              classifiedList: [],
              templateName: this.props.location.state.templateName,
              filterReqData: this.props.location.state.filterReqData,
            });
          }
        }
      );
    } else if (parameter.all === langs.key.all) {
      this.getAllChildData(catId, this.state.page);
    } else {
      this.getRetailListing(catIdInitial, page);
    }
  };

  /**
   * @method getAllChildData
   * @description get all child data
   */
  getAllChildData = (catIdInitial, page) => {
    this.props.getChildCategory({ pid: catIdInitial }, (res1) => {
      if (res1.status === 200) {
        const data =
          Array.isArray(res1.data.newinsertcategories) &&
          res1.data.newinsertcategories;
        let childCatId = data && data.length && data.map((el) => el.id);
        if (childCatId && childCatId.length) {
          let allId = childCatId.join(",");
          this.getRetailListing(allId, page);
        }
      }
    });
  };

  /**
   * @method getChildCategory
   * @description get getChildCategory records
   */
  getChildCategory = (id) => {
    this.props.getChildCategory({ pid: id }, (res1) => {
      if (res1.status === 200) {
        const data =
          Array.isArray(res1.data.newinsertcategories) &&
          res1.data.newinsertcategories;
        this.setState({
          subCategory: data,
        });
      }
    });
  };

  /**
   * @method getRetailListing
   * @description get classified listing
   */
  getRetailListing = (id, page) => {
    this.setState({ cat_id: id, page: page });
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData = {
      id: id,
      page: page,
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
        this.setState({ classifiedList: newInRetail });
      }
    });
  };

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    this.setState({ [type]: key, activeTab: key });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    let id = this.props.match.params.subCategoryId;
    this.getRetailListing(id, e);
    this.getAllChildData(id, e);
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
    const { cat_id, page } = this.state;
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
                    callNext={() => this.getRetailListing(cat_id, page)}
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
          <Row gutter={[18, 32]}>
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
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    let params = this.props.match.params;
    let catIdInitial = this.props.match.params.subCategoryId;
    const { isFilterPage } = this.state;
    if (resetFlag === true) {
      this.setState({ isSearchResult: false });
      if (params.all === langs.key.all) {
        this.getAllChildData(params.categoryId, this.state.page);
      }
      this.getRetailListing(catIdInitial, this.state.page);
      if (isFilterPage) {
        if (
          history.location &&
          history.location.state &&
          history.location.state.filterReqData
        ) {
          const state = { ...history.location.state };
          delete state.filterReqData;
          history.replace({ ...history.location, state });
        }
      }
    } else {
      this.setState({
        classifiedList: res,
        isSearchResult: true,
        searchReqData: reqData,
      });
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
      activeTab,
    } = this.state;
    let data = mostRecentList;
    if (isSearchResult) {
      data = classifiedList;
    } else if (activeTab == "1") {
      data = mostRecentList;
    } else if (activeTab == "2") {
      data = topRatedList;
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
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      mostRecentList,
      topRatedList,
      isSearchResult,
      displayType,
      isSidebarOpen,
      classifiedList,
      topImages,
      subCategory,
      redirectTo,
      isFilterPage,
    } = this.state;
    let templateName =
      classifiedList.length && classifiedList[0].template_slug
        ? classifiedList[0].template_slug
        : this.state.templateName;
    let parameter = this.props.match.params;
    let parentName = parameter.categoryName;
    let pid = parameter.categoryId;
    let subCategoryName =
      parameter.all === langs.key.all
        ? langs.key.All
        : parameter.subCategoryName;
    let subCategoryId = parameter.subCategoryId;
    let allData = parameter.all === langs.key.all ? true : false;
    let path = getMapViewRoute(
      "retail",
      parentName,
      pid,
      subCategoryName,
      subCategoryId,
      allData
    );
    let categoryPagePath = getRetailCatLandingRoutes(pid, parentName);
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="retail-theme common-left-right-padd retail-parent-sub-category">
          <Sidebar
            history={history}
            activeCategoryId={subCategoryId ? subCategoryId : pid}
            moddule={1}
            subCategoryPage={true}
            cat_id={pid}
            subCategoryId={subCategoryId}
            listingPage={true}
            toggleSideBar={() =>
              this.setState({ isSidebarOpen: !isSidebarOpen })
            }
          />
          <Layout className="right-parent-block">
            <div className="inner-banner subcategory-retail">
              <ChildSubHeader parentName={parentName} listingPage={true} />
              <CarouselSlider bannerItem={topImages} pathName="/" />
              <GeneralSearch
                handleSearchResponce={this.handleSearchResponce}
                listingPage={true}
              />
            </div>
            <Content className="site-layout">
              <Breadcrumb separator="|">
                <Breadcrumb.Item>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/retail">Retail</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={categoryPagePath}>{parentName}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{subCategoryName}</Breadcrumb.Item>
              </Breadcrumb>
              <div className="wrap-inner full-width-wrap-inner wrap-inner-position-relative pt-0">
                <div className="card-tile-listing">
                  <Card
                    bordered={false}
                    extra={
                      <ul className="panel-action">
                        <li>
                          <div className="location-name">
                            <Icon icon="location" size="20" className="mr-5" />
                            Melbourne City
                          </div>
                        </li>
                        <li title={"List view"}>
                          <img
                            src={require("../../dashboard-sidebar/icons/list.png")}
                            className={displayType === "list" ? "active" : ""}
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
                          <label className={"mr-10"}>{"Sort"}</label>
                          <Select
                            defaultValue={"Recommended"}
                            onChange={this.handleSort}
                            dropdownMatchSelectWidth={false}
                          >
                            <Option value="0">Price: Low to High</Option>
                            <Option value="1">Price: High to Low</Option>
                            <Option value="2">Name: A to Z</Option>
                            <Option value="3">Name: Z to A</Option>
                          </Select>
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
                                `/retail-detail/see-more/most-recent/${parentName}/${subCategoryId}`
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
                                `/retail-detail/see-more/top-rated/${parentName}/${subCategoryId}`
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
                  this.renderCard(classifiedList)
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
            }}
          />
        )}
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
};

export default connect(mapStateToProps, {
  getRetailList,
  enableLoading,
  disableLoading,
  getClassfiedCategoryListing,
  applyRetailFilter,
  getClassfiedCategoryDetail,
  getBannerById,
  classifiedGeneralSearch,
  getChildCategory,
})(SimpleSubCategory);
