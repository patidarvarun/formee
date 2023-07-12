import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AppSidebar from "./Sidebar";
import Icon from "../customIcons/customIcons";
import { getRetailCatLandingRoutes } from "../../common/getRoutes";
import { langs } from "../../config/localization";
import {Breadcrumb, Card, Layout, Row, Typography, Tabs, Select, Button, Col } from "antd";
import DetailCard from "../common/Card";
import DailyDealsCard from "./retail-categories/DailyDealsCard";
import {
  getRetailLandingPageData,
  retailDailyDeals,
  getRetailList,
  enableLoading,
  disableLoading,
  getBannerById,
  openLoginModel,
} from "../../actions/index";
import history from "../../common/History";
import { CarouselSlider } from "../common/CarouselSlider";
import GeneralSearch from "./GeneralRetailSearch";
import NoContentFound from "../common/NoContentFound";
import StartSellingModel from "./retail-categories/SellingModel";
import Newsidebar from './NewSidebar' 
import "./retail.less";

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
      catName: "",
      classifiedList: [],
      searchLatLng: "",
      mostPapular: [],
      searchReqData: {},
      viewAll: false,
      permission: true,
      middleImages: [],
      bestSellors: [],
      dailyDeals: [],
      activeTab: "1",
      tabType: "most-recent",
      isModelVisible: false,
      isSidebarOpen: false
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getInitialData();
  }

  /**
   * @method getInitialData
   * @description get most recent records
   */
  getInitialData = () => {
    const { retailList } = this.props;
    if (retailList && Array.isArray(retailList) && retailList.length) {
      let retailId = retailList.map((el) => el.id);
      this.getCategorisedList(retailId);
      this.getDailyDeals(retailId);
    }
    this.props.getBannerById(6, (res) => {
      if (res.status === 200) {
        const data =
          res.data.data && Array.isArray(res.data.data.banners)
            ? res.data.data.banners
            : [];
        if (data.length) {
          const banner = data.filter((el) => el.moduleId === 2);
          this.getBannerData(banner);
        }
      }
    });
  };

  /**
   * @method getDailyDeals
   * @description get daily deals records
   */
  getDailyDeals = (id) => {
    let reqData = {
      category_id: id.join(","),
    };
    this.props.retailDailyDeals(reqData, (res) => {
      if (res.status === 200) {
        let data = res.data.data && res.data.data.data;
        this.setState({ dailyDeals: data, total: res.data.data.total });
      }
    });
  };

  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = (banners) => {
    const top = banners.filter((el) => el.bannerPosition === langs.key.top);
    const bottom = banners.filter(
      (el) => el.bannerPosition === langs.key.bottom
    );
    const middle = banners.filter(
      (el) => el.bannerPosition === langs.key.middle
    );
    this.setState({
      topImages: top,
      bottomImages: bottom,
      middleImages: middle,
    });
  };

  /**
   * @method getCategorisedList
   * @description get category vice listing
   */
  getCategorisedList = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData1 = {
      filter: "most_recent",
      user_id: isLoggedIn ? loggedInDetail.id : "",
      condition: "",
    };
    let reqData2 = {
      filter: "best_seller",
      user_id: isLoggedIn ? loggedInDetail.id : "",
      condition: "",
    };
    let reqData3 = {
      filter: "most_viewed",
      user_id: isLoggedIn ? loggedInDetail.id : "",
      condition: "",
    };
    this.props.getRetailLandingPageData(reqData1, reqData2, reqData3, (res) => {
      this.props.disableLoading();
      console.log("res master", res);
      if (res) {
        this.setState({
          mostRecentList: res.mostRecent,
          bestSellors: res.best_sellors,
          recentlyView: res.recently_view,
        });
      }
    });
  };

  /**
   * @method getRetailData
   * @description get retail list
   */
  getRetailData = (requestData, filter) => {
    this.props.getRetailList(requestData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        const retail = Array.isArray(res.data.data) ? res.data.data : [];
        const newInRetail = retail.length ? retail.slice(0, 12) : [];
        if (filter === "most_recent") {
          this.setState({ mostRecentList: newInRetail });
        } else if (filter === "recently_viewed") {
          this.setState({ recentlyView: newInRetail });
        } else if (filter === "best_seller") {
          this.setState({ bestSellors: newInRetail });
        }
      }
    });
  };

  /**
   * @method getRetailData
   * @description get retail list
   */
  getMostRecentData = (sub_cat_ids, filter) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const id = sub_cat_ids && sub_cat_ids.length !== 0 && sub_cat_ids.join(",");
    const requestData = {
      id: id,
      filter: filter,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.getRetailData(requestData, filter);
  };

  /**
   * @method getRecentlyViewData
   * @description get recent view data list
   */
  getRecentlyViewData = (sub_cat_ids, filter) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const id = sub_cat_ids && sub_cat_ids.length !== 0 && sub_cat_ids.join(",");
    const requestData = {
      id: id,
      filter: filter,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.getRetailData(requestData, filter);
  };

  /**
   * @method getBestSellors
   * @description get best sellors data
   */
  getBestSellors = (sub_cat_ids, filter) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const id = sub_cat_ids && sub_cat_ids.length !== 0 && sub_cat_ids.join(",");
    const requestData = {
      id: id,
      filter: filter,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.getRetailData(requestData, filter);
  };

  /**
   * @method selectTemplateRoute
   * @description select tempalte route dynamically
   */
  selectTemplateRoute = (el) => {
    let item = el && Array.isArray(el) && el.length ? el[0] : "";
    let catName = item.catname;
    let path = getRetailCatLandingRoutes(item.id, catName);
    this.props.history.push(path);
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
    if (categoryData && categoryData.length) {
      let temp = categoryData.sort()
      return (
        <Fragment>
          <Row gutter={[18, 32]}>
            {temp &&
              temp.slice(0, 4).map((data, i) => {
                return <DetailCard 
                  data={data} 
                  key={i} 
                  retail={true} 
                  col={6} 
                  callNext={this.getCategorisedList}
                />;
              })}
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method renderDailyDeals
   * @description render massage daily deals
   */
  renderDailyDeals = () => {
    const { dailyDeals } = this.state;
    if (dailyDeals && Array.isArray(dailyDeals) && dailyDeals.length) {
      return dailyDeals.slice(0, 12).map((el, i) => {
        return (
          <Col className="gutter-row" md={8} key={i}>
            <DailyDealsCard data={el} type={"retail"} />
          </Col>
        );
      });
    }
  };

  /**
   * @method renderCategoryBlock
   * @description render category block
   */
  renderCategoryBlock = (newRetailData) => {
    let objectLength = newRetailData && Object.keys(newRetailData).length;
    if (objectLength) {
      let filter = this.props.match.params.filter;
      let data =
        filter === "see-more"
          ? newRetailData && Object.keys(newRetailData).sort()
          : Object.keys(newRetailData).slice(0, 3).sort();
      console.log("data", data);
      return data.map((key, i) => {
        return (
          <div className="product-list-wrap pt-0" key={i}>
            <Card
              title={<span style={{ color: "#CA71B7" }}>{key}</span>}
              extra={
                <Link>
                  <span
                    onClick={() => this.selectTemplateRoute(newRetailData[key])}
                  >
                    See more
                  </span>{" "}
                  <Icon
                    onClick={() => this.selectTemplateRoute(newRetailData[key])}
                    icon="arrow-right"
                    size="13"
                    className="arrow-right"
                  />
                </Link>
              }
              bordered={false}
              className={"home-product-list new-in-retail"}
            >
              {this.renderCard(newRetailData[key])}
            </Card>
          </div>
        );
      });
    }
  };

  /**
   * @method renderSeeAllButton
   * @description render see all button
   */
  renderSeeAllButton = () => {
    return (
      <div className="align-center see-all-btn-pad">
        <Button
          type="default"
          size={"middle"}
          onClick={() => {
            this.props.history.push(`/retail/see-more`);
          }}
        >
          {"See All"}
        </Button>
      </div>
    );
  };

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    let tabType = "most-recent";
    if (key === "1") {
      tabType = "most_recent";
    } else if (key === "2") {
      tabType = "daily-deals";
    } else if (key === "3") {
      tabType = "best-sellers";
    } else if (key === "4") {
      tabType = "recently-view";
    }
    this.setState({ activeTab: key, tabType: tabType });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    let filter = this.props.match.params.filter;
    const { isLoggedIn } = this.props
    const {
      isModelVisible,
      activeTab,
      tabType,
      dailyDeals,
      total,
      bestSellors,
      topImages,
      bottomImages,
      mostRecentList,
      isSearchResult,
      recentlyView,
      classifiedList,
      isSidebarOpen
    } = this.state;
    let list_type =
      tabType === "most-recent"
        ? mostRecentList
        : tabType === "recently-view"
        ? recentlyView
        : tabType === "best-sellers"
        ? bestSellors
        : mostRecentList;
    let objectLength = list_type && Object.keys(list_type).length ? Object.keys(list_type).length : '';
    return (
      <div className="App retail-theme common-main-category-landing new-custom-retail-landingpage ">
        <Layout>
          <Layout>
            {/* <AppSidebar history={history} /> */}
            <Newsidebar
             history={history}
             mainPage={true}
             toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
            />
            <Layout className="right-parent-block">
              <div className="category-main-banner retail-landing category-main-banner-block">
                <div className="sub-header">
                {!isSidebarOpen ?  <Title level={4} className="title">
                    {"WELCOME TO RETAIL "}
                  </Title>:''}
                  {/* <PostAdPermission history={history} title={'Start selling'}/> */}
                  <div className="action">
                    <Button
                      type="primary"
                      className="btn-blue"
                      size={"large"}
                      onClick={() => this.setState({ isModelVisible: true })}
                    >
                      {"Start Selling"}
                    </Button>
                  </div>
                </div>
                <CarouselSlider bannerItem={topImages} />
                <GeneralSearch
                  handleSearchResponce={this.handleSearchResponce}
                  landingPage={true}
                />
                </div>
              <Content className="site-layout">
                <Breadcrumb separator='|' className='ant-breadcrumb-pad'>
                  <Breadcrumb.Item>
                    <Link to='/'>Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to="/retail">Retail</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div className="fix-pad-box">
                  <div className="wrap-inner bg-linear pb-76 pt-30">
                    {!isSearchResult && filter === undefined ? (
                      <Tabs
                        type="card"
                        className={"tab-style2"}
                        activeKey={activeTab}
                        onChange={this.onTabChange}
                      >
                        <TabPane tab="Most Recent" key="1">
                          {objectLength ? (
                            this.renderCategoryBlock(list_type)
                          ) : (
                            <NoContentFound />
                          )}
                          {objectLength && this.renderSeeAllButton()}
                        </TabPane>
                        <TabPane tab="Daily Deals" key="2">
                          {dailyDeals.length !== 0 ? (
                            <Row gutter={[38, 38]}>
                              {this.renderDailyDeals()}
                            </Row>
                          ) : (
                            <NoContentFound />
                          )}
                          {total > 9 && (
                            <div className="align-center see-all-btn-pad">
                              <Button
                                type="default"
                                size={"middle"}
                                onClick={() => {
                                  this.props.history.push(
                                    `/retail-detail/see-more/daily-deals`
                                  );
                                }}
                              >
                                {"See All"}
                              </Button>
                            </div>
                          )}
                        </TabPane>
                        <TabPane tab="Best Sellers" key="3">
                          {objectLength ? (
                            this.renderCategoryBlock(list_type)
                          ) : (
                            <NoContentFound />
                          )}
                          {objectLength && this.renderSeeAllButton()}
                        </TabPane>
                        <TabPane tab="Recently Viewed" key="4">
                          {objectLength ? (
                            this.renderCategoryBlock(list_type)
                          ) : (
                            <NoContentFound />
                          )}
                          {objectLength && this.renderSeeAllButton()}
                        </TabPane>
                      </Tabs>
                    ) : filter === "see-more" && !isSearchResult ? (
                      this.renderCategoryBlock(list_type)
                    ) : (
                      this.renderCard(classifiedList)
                    )}
                  </div>
                </div>
                <div className="fix-pad-box">
                  <div className="ad-banner-bottom mt-0 mb-0">
                    <CarouselSlider
                      bannerItem={bottomImages}
                      className="ad-banner"
                    />
                  </div>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
        {isModelVisible && (
          <StartSellingModel
            visible={isModelVisible}
            onCancel={() => this.setState({ isModelVisible: false })}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { categoryData } = common;
  let retailList =
    categoryData && Array.isArray(categoryData.retail.data)
      ? categoryData.retail.data
      : [];
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    retailList,
  };
};
export default RetailLandingPage = connect(mapStateToProps, {
  getRetailLandingPageData,
  retailDailyDeals,
  getRetailList,
  enableLoading,
  disableLoading,
  getBannerById,
  openLoginModel,
})(RetailLandingPage);
