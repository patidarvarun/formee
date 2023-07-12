import React, { Component } from "react";
import AppSidebar from "../sidebar/SidebarInner";
import {Dropdown, Layout, Breadcrumb, Typography, Tabs, Row, Col, Table } from "antd";
import { Link, withRouter } from "react-router-dom";
import history from "../../common/History";
import { DEFAULT_IMAGE_CARD } from "../../config/Config";
import { connect } from "react-redux";
import { enableLoading, disableLoading } from "../../actions/index";
import { addToFavoriteFoodScanner } from "../../actions/food-scanner/FoodScanner";
import {
  CheckSquareOutlined,
  BorderOutlined,
  HeartOutlined,
  EyeOutlined,
  ShareAltOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { langs } from "../../config/localization";
import { toastr } from "react-redux-toastr";
import { STATUS_CODES } from "../../config/StatusCode";
import { reactLocalStorage } from "reactjs-localstorage";
import Icon from "../customIcons/customIcons";
import Back from '../common/Back';
import { SocialShare } from '../common/social-share'
const { Title, Text } = Typography;
const { TabPane } = Tabs;

class FoodProductDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      nutritionTableData: [],
      productDetails: {},
      is_favorite: false,
    };
  }

  componentWillUnmount() {
    reactLocalStorage.setObject("productDetails", {});
  }

  componentDidMount() {
    let productDetails = {};
    if (this.props.productDetails) {
      productDetails = this.props.productDetails;
    } else {
      productDetails = reactLocalStorage.getObject("productDetails");
    }

    if (productDetails && productDetails.nutrition) {
      const nutritionTableDataArray = [];
      const nutritionData = productDetails.nutrition.split(",");
      const qtyPerServe = productDetails.avg_qty_per_serving.split(",");
      const qtyPer100gm = productDetails.avg_qty_per_100g.split(",");
      for (let i = 0; i <= nutritionData.length; i++) {
        nutritionTableDataArray.push({
          nutrition: nutritionData[i],
          avg_qty_per_serving: qtyPerServe[i],
          avg_qty_per_100g: qtyPer100gm[i],
        });
      }
      this.setState({
        is_favourite: productDetails.is_favorite ? true : false,
        productDetails: productDetails ? productDetails : {},
        nutritionTableData: nutritionTableDataArray,
      });
    } else {
      toastr.warning("Error", "Something went wrong.");
      this.props.history.push("/food-scanner");
    }
  }

  handleAddToFavorite = () => {
    const { is_favourite, productDetails } = this.state;
    const { isLoggedIn, loggedInDetail } = this.props;
    if (isLoggedIn) {
      const requestData = {
        food_product_id: productDetails.id,
        user_id: loggedInDetail.id,
        is_favorite: is_favourite ? 0 : 1,
      };
      this.props.addToFavoriteFoodScanner(requestData, (res) => {
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, res.data.msg);
          this.setState({ is_favourite: is_favourite ? 0 : 1 });
        }
      });
    } else {
      this.props.openLoginModel();
    }
  };

  renderCeritifcationCheckIcon = (isChecked) => {
    return isChecked === 1 ? (
      <img
        src={require("../../assets/images/blue-checkbox.png")}
        style={{marginRight:"7px"}} />) : (
      <span style={{marginRight:"9px"}}>
        {" "}
        <BorderOutlined style={{fontSize:"18px"}} />{" "}
      </span>
    );
  };

  render() {
    const columns = [
      {
        title: "",
        dataIndex: "nutrition",
      },
      {
        title: "Per Serving",
        dataIndex: "avg_qty_per_serving",
      },
      {
        title: "Per 100 gm",
        dataIndex: "avg_qty_per_100g",
      },
    ];
    const { compare } = this.props;
    const { productDetails, nutritionTableData, is_favourite } = this.state;
    const menu = (
      <SocialShare {...this.props} />
    )
    return (
      <div className='foodscanner-green-main-wrap' >
        <Layout >
          <Layout >
            {/* {!compare && <AppSidebar history={history} />} */}
            <Layout className="foodscanner-detail" >
              {/* {!compare && (
                <Breadcrumb
                  separator="|"
                  className="pt-20 pb-30"
                  style={{ paddingLeft: 50 }}
                >
                  <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to="/food-scanner">Food Scanner</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Details</Breadcrumb.Item>
                </Breadcrumb>
              )} */}
              {/* {!compare && (
                <Title level={2} className="inner-page-title">
                  <span>Food Scanner Detail</span>
                </Title>
              )} */}{!compare &&
              <div className='sub-header child-sub-header'>
                    {/* <div className='hamburger-icon' >
                    <Icon icon={'hamburger'} size='20' />
                    </div> */}
                    <Title level={4} className='title main-heading-bookg'><span className='child-sub-category'>FOOD SCANNER</span></Title>
                </div>
              }
               {!compare && 
                <div className="food-scanner-back">
                  {/* <Link to={'/food-scanner'}> */}
                  <span
                    className='back-link '
                  >
                    {/* <Icon icon='arrow-left' size='13' className='mr-3' />
                    Back */}
                    <Back {...this.props}/>
                  </span>
                  {/* </Link>                 */}
                </div>}   
               <div className={!compare && "food-prduct-detail-tabstyle2"}>
               <div className="wrap-inner detail-main-page pb-76">
                <Tabs type="card" className={"tab-style2"} style={{height:"100%",}}>
                  <TabPane tab={!compare ? "Details" : ""} key="1" >
                    <Row gutter={[15, 0]}>
                      <Col span={7} className="text-center">
                        <img
                          src={
                            productDetails && productDetails.image
                              ? productDetails.image
                              : DEFAULT_IMAGE_CARD
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_IMAGE_CARD;
                          }}
                          alt={
                            productDetails && productDetails.brand
                              ? productDetails.brand
                              : ""
                          }
                        />
                        {!compare && (
                          <Row
                            className="d-flex"
                            justify="center"
                            align="middle"
                          >
                            <div className="add-compare">
                              <Checkbox className="pr-6" /> Add to Compare
                            </div>
                          </Row>
                        )}
                        <Row justify="center" align="middle" className="mt-20">
                          <span>
                            {productDetails.is_halal === 1 ? (
                              <img
                                src={require("../../assets/images/halal-icon.png")}
                                className=" mt-5 mr-20"
                              ></img>
                            ) : (
                              ""
                            )}
                          </span>
                          <span>
                            {productDetails.is_vegan === 1 ? (
                              <img
                                src={require("../../assets/images/kosher-icons.png")}
                                className="mt-5 mr-20"
                              ></img>
                            ) : (
                              ""
                            )}
                          </span>
                          <span>
                            {productDetails.is_kosher === 1 ? (
                              <img
                                src={require("../../assets/images/vegan-icons.png")}
                                className="mt-5 mr-0"
                              ></img>
                            ) : (
                              ""
                            )}
                          </span>
                          <span>
                            {productDetails.is_vegetarian
                              ? "Vegetarian Icon"
                              : ""}
                          </span>
                        </Row>
                      </Col>
                      <Col span={17}>
                        {this.props.closeIcon ? <CloseOutlined /> : ""}
                        <div className="detail-heading">
                          {productDetails.name}
                        </div>
                        <div className="fs-18 serving-size">
                          {productDetails.serving_size}
                        </div>
                        <div className="varified-point-block">
                          <Row>
                            <Col span={24}>
                              <div className="varified-list">
                                {this.renderCeritifcationCheckIcon(
                                productDetails.is_halal
                              )}{" "}
                              Verified for Halal Cerification
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <div className="varified-list">
                              {this.renderCeritifcationCheckIcon(
                                productDetails.is_vegan
                              )}{" "}
                              Verified for Vegan Cerification
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <div className="varified-list">
                              {this.renderCeritifcationCheckIcon(
                                productDetails.is_kosher
                              )}{" "}
                              Verified for Kosher 
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <div className="varified-list">
                              {this.renderCeritifcationCheckIcon(
                                productDetails.is_vegetarian
                              )}{" "}
                              Verified for Vegetarian Cerification
                              </div>
                            </Col>
                          </Row>
                          {/* <Row>
                                                    <Col span={8}>
                                                        <span onClick={() => this.handleAddToFavorite()}>
                                                            <HeartOutlined className={is_favourite ? 'active' : ''} />
                                                        </span> |
                                                            </Col>
                                                    <Col span={8}><ShareAltOutlined /> |</Col>
                                                    <Col span={8}><EyeOutlined />{productDetails.total_views}</Col>
                                                </Row> */}
                        </div>
                        <div className="action-card mb-10">
                          <ul>
                            <li>
                              <Icon
                                icon={
                                  is_favourite ? "wishlist-fill" : "wishlist"
                                }
                                size="20"
                                className={is_favourite ? "active" : ""}
                                onClick={() => this.handleAddToFavorite()}
                              />
                            </li>
                            <li>
                              <Dropdown overlay={menu} trigger={['click']}  overlayClassName='contact-social-detail share-ad' placement="bottomCenter" arrow>
                                  <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                    <Icon icon='share' size='20' />
                                  </div>
                              </Dropdown>
                            </li>
                            <li>
                              <div>
                                <Icon icon="view" size="20" />{" "}
                                <Text>{productDetails.total_views}</Text>
                              </div>
                            </li>
                          </ul>
                        </div>
                        {!compare &&<div className="prd-detail-nutrition-information">
                          <Row gutter={0}>
                            <Col className="nutrition-information" span={24}>
                              <h4 className="blue-strip">
                                Nutrition Information
                              </h4>
                              <Table
                                columns={columns}
                                dataSource={nutritionTableData}
                                className="food-detail-table"
                              />
                              <h4 className="blue-strip mb-10 mt-30">
                                Ingredients
                              </h4>
                              <div className="dis-txt">
                                {productDetails.ingredient}
                              </div>
                              <h4 className="blue-strip mb-10 mt-30">
                                Allergen
                              </h4>
                              <div className="dis-txt">
                                {" "}
                                {productDetails.Alergen}
                              </div>
                            </Col>
                          </Row>
                        </div>}
                      </Col>
                      {compare && <Col span={24}>
                      <div className="prd-detail-nutrition-information">
                          <Row gutter={0}>
                            <Col className="nutrition-information" span={24}>
                              <h4 className="blue-strip">
                                Nutrition Information
                              </h4>
                              <Table
                                columns={columns}
                                dataSource={nutritionTableData}
                                className="food-detail-table"
                              />
                              <h4 className="blue-strip mb-10 mt-30">
                                Ingredients
                              </h4>
                              <div className="dis-txt">
                                {productDetails.ingredient}
                              </div>
                              <h4 className="blue-strip mb-10 mt-30">
                                Allergen
                              </h4>
                              <div className="dis-txt">
                                {" "}
                                {productDetails.Alergen}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>}
                    </Row>
                  </TabPane>
                </Tabs>
              </div>
                 </div>            
             
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  addToFavoriteFoodScanner,
})(withRouter(FoodProductDetailPage));
