import React, { Fragment } from "react";
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import {
  Layout,
  Row,
  Typography,
  Tabs,
  Select,
  Button,
  Breadcrumb
} from "antd";
import {
  enableLoading,
  disableLoading,
  getBannerById,
  openLoginModel
} from "../../actions/index";
import { getProductList } from "../../actions/food-scanner/FoodScanner";
import { CarouselSlider } from "../common/CarouselSlider";
import NoContentFound from "../common/NoContentFound";
import SeeAllModal from "../classified-templates/PapularSearch";
import FoodScannerSearch from "./FoodScannerSearch";
import FoodProductDetailCard from "./FoodProductDetailCard";
import "./style.less";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class FoodScannerLandingPage extends React.Component {
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
      catName: "",
      searchLatLng: "",
      mostPapular: [],
      searchReqData: {},
      viewAll: false,
      permission: true,
      classifiedList: [],
      productList: [],
      listType: "most_popular", //recent
      selectedCompareItem: [],
      searchResults: [],
      isSearchResult: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.getInitialData();
  }

  /**
   * @method getInitialData
   * @description get most recent records
   */
  getInitialData = () => {
    this.props.enableLoading();
    this.props.getBannerById(2, (res) => {
      this.getProductListing("most_popular");
      if (res.status === 200) {
        this.props.disableLoading();
        if (res.status === 200) {
          const data =
            res.data.data && Array.isArray(res.data.data.banners)
              ? res.data.data.banners
              : [];
          if (data.length) {
            const banner = data.filter((el) => el.moduleId === 4);
            this.getBannerData(banner);
          }
        }
      }
    });
  };

  getProductListing = (listTypeValue) => {
    const { loggedInDetail, isLoggedIn } = this.props;
    this.props.enableLoading();
    const requestData = {
      filter: listTypeValue,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getProductList(requestData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ productList: res.data.data.data });
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
    this.setState({ topImages: top, bottomImages: bottom });
  };

  /**
   * @method setSearchResults
   * @description get most recent records
   */
  setSearchResults = (result) => {
    console.log("result: ", result);
    this.setState({ searchResults: result, isSearchResult: true });
  };

  /**
   * @method renderCard
   * @description render card details
   */
  renderCard = (productListData) => {
    if (productListData && productListData.length) {
      return (
        <Fragment>
          <Row gutter={[18, 32]}>
            {productListData &&
              productListData.map((data, i) => {
                return (
                  <FoodProductDetailCard
                    data={data}
                    key={i}
                    col={6}
                    selectedCompareItem={this.state.selectedCompareItem}
                    setSelectedItem={(item) =>
                      this.setState({ selectedCompareItem: item })
                    }
                  />
                );
              })}
          </Row>
        </Fragment>
      );
    } else {
      return (
        <div>
          <NoContentFound />
          <Button
            type="primary"
            className="btn-blue add-product"
            size={"large"}
            onClick={()=>{
              if(this.props.isLoggedIn){
              this.props.history.push(`/add-product`)
              }else{
                this.props.openLoginModel()
              }
            }}
          >
            Add Product
          </Button>
        </div>
      );
    }
  };

  handleTabChange = (tab) => {
    switch (tab) {
      case "1":
        return this.getProductListing("most_popular");
      case "2":
        return this.getProductListing("recent");
      default:
        return;
    }
  };

  handleCompareProductClick = () => {
    const { selectedCompareItem } = this.state;
    if (
      selectedCompareItem &&
      selectedCompareItem.length &&
      selectedCompareItem.length <= 2
    ) {
      this.props.history.push("/compare-product");
    } else {
      toastr.warning("Warning", "Select two items to compare.");
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { popularSearches } = this.props;
    const {
      viewAll,
      topImages,
      selectedCompareItem,
      searchResults,
      isSearchResult,
    } = this.state;

    return (
      <div className="App foodscanner-green-main-wrap new-custom-foodscanner-landingpage">
        <Layout>
          <Layout>
            {/* <AppSidebar history={history} /> */}
            <Layout>
              <div className="inner-banner category-main-banner-block">
              <div className="sub-header">
                <Title level={4} className="title">
                  {"FOOD SCANNER"}
                </Title>
                <div className="action">
                  <Button
                    type="primary"
                    className="btn-blue"
                    size={"large"}
                    onClick={() => this.handleCompareProductClick()}
                  >
                    Compare Products{" "}
                    {selectedCompareItem.length
                      ? selectedCompareItem.length
                      : ""}
                  </Button>
                </div>
              </div>
                <CarouselSlider bannerItem={topImages} />
                <FoodScannerSearch setSearchResults={this.setSearchResults} />
              </div>
              <Content className="site-layout">
                <Breadcrumb separator='|' className='ant-breadcrumb-pad'>
                    <Breadcrumb.Item>
                        <Link to='/'>Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/food-scanner'>Food Scanner</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="wrap-inner bg-linear pb-76 food-scanner-wrap-inner">
                  {!isSearchResult && searchResults.length === 0 ? (
                    <Tabs
                      type="card"
                      className={"tab-style2"}
                      onChange={(tab) => this.handleTabChange(tab)}
                    >
                      <TabPane tab="Most Viewed" key="1">
                        {this.renderCard(this.state.productList)}
                        {this.state.productList &&
                          this.state.productList.length !== 0 && (
                            <div className="align-center see-all-btn-pad">
                              <Button
                                type="default"
                                size={"middle"}
                                onClick={() => {
                                  this.props.history.push(
                                    `/see-all-products/most_popular`
                                  );
                                }}
                              >
                                {"See All"}
                              </Button>
                            </div>
                          )}
                      </TabPane>
                      <TabPane tab="Recently Added" key="2">
                        {this.renderCard(this.state.productList)}
                        {this.state.productList &&
                          this.state.productList.length !== 0 && (
                            <div className="align-center see-all-btn-pad">
                              <Button
                                type="default"
                                size={"middle"}
                                onClick={() => {
                                  this.props.history.push(
                                    `/see-all-products/recent`
                                  );
                                }}
                              >
                                {"See All"}
                              </Button>
                            </div>
                          )}
                      </TabPane>
                    </Tabs>
                  ) : (
                    this.renderCard(this.state.searchResults)
                  )}
                </div>
              </Content>
            </Layout>
          </Layout>
          {viewAll && (
            <SeeAllModal
              visible={viewAll}
              onCancel={() => this.setState({ viewAll: false })}
              popularSearches={popularSearches && popularSearches}
            />
          )}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default FoodScannerLandingPage = connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getBannerById,
  getProductList,
  openLoginModel
})(FoodScannerLandingPage);
