import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import {
  Empty,
  Divider,
  Checkbox,
  Menu,
  Tooltip,
  Layout,
  Typography,
  Tabs,
  Row,
  Col,
  Input,
  Select,
  Button,
  Rate,
  Collapse,
  Dropdown,
} from "antd";
import Icon from "../../../components/customIcons/customIcons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getClassfiedCategoryDetail } from "../../../actions/classifieds";
import {
  enableLoading,
  disableLoading,
  addToWishList,
  removeToWishList,
  openLoginModel,
  getChildCategory,
} from "../../../actions/index";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../config/Config";
import { langs } from "../../../config/localization";
import AppSidebar from "../../sidebar";
import { salaryNumberFormate } from "../../common";
import { STATUS_CODES } from "../../../config/StatusCode";
import { MESSAGES } from "../../../config/Message";
import { SocialShare } from "../../common/social-share";
import Magnifier from "react-magnifier";
import history from "../../../common/History";
import ReportAdModal from "../common/modals/ReportAdModal";
import ContactModal from "../common/modals/ContactModal";
import { rating } from "../CommanMethod";
import {
  getClassifiedCatLandingRoute,
  getClassifiedSubcategoryRoute,
  getMapDetailRoute,
} from "../../../common/getRoutes";
import MakeAnOffer from "../common/modals/MakeAnOffer";
import {
  convertISOToUtcDateformate,
  capitalizeFirstLetter,
} from "../../common";
import Carousel from "../../common/caraousal";
import "../../common/caraousal/crousal.less";
import Map from "../../common/Map";
import DetailTabView from "./GeneralDetailTabView";
import "../../common/mapView.less";
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

class DetailPage extends React.PureComponent {
  formRef = React.createRef();

  myDivToFocus = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      classifiedDetail: [],
      allData: "",
      visible: false,
      makeOffer: false,
      reportAdModel: false,
      filteredData: [],
      isFilter: false,
      label: "All Star",
      reviewTab: false,
      activeTab: "1",
      showNumber: false,
      is_favourite: false,
      subCategory: [],
      catrgoryName: "",
      selectedEnquiryDetail: [],
      subCatName: "",
      tempSlug: "",
      catId: "",
      subCatId: "",
      similarAd: [],
      priorityTab: 0,
      isOfferSent: false,
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props from components
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial =
      this.props.parameters?.classified_id ??
      this.props.match.params.classified_id;
    let catIdNext =
      nextprops.parameters?.classified_id ??
      nextprops.match.params.classified_id;
    if (catIdInitial !== catIdNext) {
      this.getDetails(catIdNext);
    }
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    let parameter = this.props.parameters ?? this.props.match.params;
    let classified_id = parameter.classified_id;
    let parentId = parameter.categoryId;
    this.getChildCategory(parentId);
    this.props.enableLoading();
    this.getDetails(classified_id);
  }

  /**
   * @method getDetails
   * @description get classified details
   */
  getDetails = (classified_id) => {
    // let classified_id = this.props.match.params.classified_id
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let wishlist =
          res.data.data && res.data.data.wishlist === 1 ? true : false;
        let data = res.data.data;
        let similarAd = res.data.similaradd;
        this.setState({
          classifiedDetail: res.data.data,
          selectedEnquiryDetail: res.data.data,
          allData: res.data,
          similarAd,
          is_favourite: wishlist,
          categoryName: res.data.category_name
            ? res.data.category_name
            : data && data.categoriesname
            ? data.categoriesname.name
            : "",
          subCatName: res.data.sub_category_name
            ? res.data.sub_category_name
            : data && data.subcategoriesname
            ? data.subcategoriesname.name
            : "",
          catId: res.data.category_id
            ? res.data.category_id
            : data && data.categoriesname
            ? data.categoriesname.id
            : "",
          tempSlug: res.data.template_slug ? res.data.template_slug : "general",
          subCatId: res.data.sub_category_id
            ? res.data.sub_category_id
            : data && data.subcategoriesname
            ? data.subcategoriesname.id
            : "",
        });
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
   * @method contactModal
   * @description contact model
   */
  contactModal = () => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        visible: true,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method makeOfferModal
   * @description handle make an offer model
   */
  makeOfferModal = () => {
    const { classifiedDetail } = this.state;
    const { isLoggedIn } = this.props;
    if (classifiedDetail && classifiedDetail.price === 0) {
      toastr.warning(langs.warning, MESSAGES.NOT_ABLE_APPLY_OFFER);
      return true;
    } else if (
      (classifiedDetail && classifiedDetail.is_make_an_offered === 1) ||
      this.state.isOfferSent
    ) {
      toastr.warning(langs.warning, MESSAGES.OFFER_ALREADY_SENT);
      return true;
    } else {
      if (isLoggedIn) {
        this.setState({
          makeOffer: true,
        });
      } else {
        this.props.openLoginModel();
      }
    }
  };

  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = (e) => {
    this.setState({
      visible: false,
      makeOffer: false,
    });
  };

  /**
   * @method renderImages
   * @description render image list
   */
  renderImages = (item) => {
    if (item && item.length) {
      return (
        item &&
        Array.isArray(item) &&
        item.map((el, i) => {
          return (
            <div key={i}>
              <Magnifier
                src={el.full_name ? el.full_name : DEFAULT_IMAGE_CARD}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE_CARD;
                }}
                alt={""}
              />
            </div>
          );
        })
      );
    } else {
      return (
        <div>
          <img src={DEFAULT_IMAGE_CARD} alt="" />
        </div>
      );
    }
  };

  /**
   * @method renderThumbImages
   * @description render thumb images
   */
  renderThumbImages = (item) => {
    if (item && item.length) {
      return (
        item &&
        Array.isArray(item) &&
        item.map((el, i) => {
          return (
            <div key={i} className="slide-content">
              <img
                src={el.full_name ? el.full_name : DEFAULT_IMAGE_CARD}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE_CARD;
                }}
                alt={""}
              />
            </div>
          );
        })
      );
    } else {
      return (
        <div className="slide-content hide-cloned">
          <img src={DEFAULT_IMAGE_CARD} alt="" />
        </div>
      );
    }
  };

  /**
   * @method onSelection
   * @description handle favorite unfavorite
   */
  onSelection = (data, classifiedid) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const { is_favourite } = this.state;
    if (isLoggedIn) {
      if (data.wishlist === 1 || is_favourite) {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: classifiedid,
        };
        this.props.enableLoading();
        this.props.removeToWishList(requestData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
            this.setState({ is_favourite: false });
            this.getDetails(classifiedid);
          }
        });
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: classifiedid,
        };
        this.props.enableLoading();
        this.props.addToWishList(requestData, (res) => {
          this.props.disableLoading();
          this.setState({ flag: !this.state.flag });
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS);
            this.setState({ is_favourite: true });
            this.getDetails(classifiedid);
          }
        });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  activeTab = () => {
    this.setState({ priorityTab: 3 });
    if (this.myDivToFocus.current) {
      window.scrollTo(0, this.myDivToFocus.current.offsetTop);
    }
    this.props.enableLoading();
    setTimeout(() => {
      this.setState({ priorityTab: 0 }, () => {
        this.props.disableLoading();
      });
    }, 500);
  };

  /**
   * @method setPriorityTab
   * @description manage tab change
   */
  setPriorityTab = () => {
    this.setState({ priorityTab: 0 });
  };

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    this.setState({ activeTab: key, reviewTab: false });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isLoggedIn, loggedInDetail } = this.props;
    const {
      reportReviewModel,
      catId,
      categoryName,
      tempSlug,
      subCatId,
      subCatName,
      is_favourite,
      visible,
      makeOffer,
      showNumber,
      reviewTab,
      classifiedDetail,
      selectedEnquiryDetail,
      activeTab,
      allData,
      subCategory,
      reportAdModel,
      similarAd,
      makeReviewtabOpen,
      priorityTab,
    } = this.state;
    console.log("@@@@#########@@@@@@@", selectedEnquiryDetail);
    let clasified_user_id =
      classifiedDetail && classifiedDetail.classified_users
        ? classifiedDetail.classified_users.id
        : "";
    let isButtonVisible =
      isLoggedIn && loggedInDetail.id === clasified_user_id ? false : true;
    let rate =
      classifiedDetail &&
      classifiedDetail.classified_hm_reviews &&
      rating(classifiedDetail.classified_hm_reviews);
    let parameter = this.props.parameters ?? this.props.match.params;
    let cat_id = catId;
    let classified_id = parameter.classified_id;
    let subCategoryName = subCatName;
    let subCategoryId = subCatId;
    let categoryPagePath = classifiedDetail.categoriesname
      ? getClassifiedCatLandingRoute(
          TEMPLATE.GENERAL,
          classifiedDetail.categoriesname.id,
          categoryName
        )
      : "";
    let subCategoryPagePath = classifiedDetail.categoriesname
      ? getClassifiedSubcategoryRoute(
          TEMPLATE.GENERAL,
          categoryName,
          classifiedDetail.categoriesname.id,
          subCategoryName,
          classifiedDetail.subcategoriesname.id
        )
      : "";
    let mapPagePath = classifiedDetail.categoriesname
      ? getMapDetailRoute(
          TEMPLATE.GENERAL,
          categoryName,
          cat_id,
          subCategoryName,
          subCategoryId,
          classified_id
        )
      : "";
    const catName =
      classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname;
    let imgLength = Array.isArray(classifiedDetail.classified_image)
      ? classifiedDetail.classified_image.length
      : 1;
    const menu = <SocialShare {...this.props} />;
    let crStyle =
      imgLength === 3 || imgLength === 2 || imgLength === 1
        ? "product-gallery-nav hide-clone-slide"
        : "product-gallery-nav ";
    let contactNumber =
      classifiedDetail.contact_mobile && classifiedDetail.contact_mobile;
    // let formatedNumber = contactNumber && contactNumber.replace(/\d(?=\d{4})/g, '*')
    let formatedNumber =
      contactNumber && contactNumber.replace(/\d{7}(?=\d{3})/g, "0 XXXX XXX ");
    let specification =
      allData &&
      allData.spicification &&
      Array.isArray(allData.spicification) &&
      allData.spicification.length
        ? allData.spicification.filter(
            (el) => el.slug === "is_price_negotiable?"
          )
        : [];
    let is_negotiable =
      specification && Array.isArray(specification) && specification.length
        ? specification[0].value
        : "";
    const number = (
      <Menu>
        <Menu.Item key="0">
          {isLoggedIn ? (
            <span>
              {classifiedDetail.classified_users && (
                <Tooltip placement="bottomRight">
                  <div>
                    <b>
                      <span>
                        Contact {classifiedDetail.classified_users.name}{" "}
                      </span>
                    </b>
                    <span>
                      {" "}
                      {classifiedDetail.contact_mobile
                        ? classifiedDetail.contact_mobile
                        : "Number not found"}{" "}
                    </span>
                  </div>
                </Tooltip>
              )}
            </span>
          ) : (
            <span>
              <span>
                <b>Contact Seller</b>
              </span>
              <span>{formatedNumber}</span>
              <div>
                Please{" "}
                <b
                  className="blue-link mb-0"
                  onClick={() => this.props.openLoginModel()}
                >
                  Login
                </b>
                <br />
                to view number{" "}
              </div>
            </span>
          )}
        </Menu.Item>
      </Menu>
    );

    let conditionlabel =
      categoryName === "Automotive" ||
      categoryName === "Electronics" ||
      categoryName === "Books & Music"
        ? "Condition"
        : "Category";
    let conditionValue =
      categoryName === "Automotive" ||
      categoryName === "Electronics" ||
      categoryName === "Books & Music"
        ? classifiedDetail.ad_type
          ? classifiedDetail.ad_type
          : "New"
        : classifiedDetail.subcategoriesname &&
          classifiedDetail.subcategoriesname.name;
    return (
      <div className="product-detail-parent-block">
        <Layout className="common-left-right-padd">
          <Layout>
            <Layout className="right-parent-block">
              <Layout
                style={{ width: "calc(100% - 0px)", overflowX: "visible" }}
              >
                <Layout>
                  <div className="detail-page right-content-block">
                    <Row>
                      <Col flex="370px">
                        {this.props.match?.params && (
                          <div className="category-name">
                            {catName && (
                              <Link to={subCategoryPagePath}>
                                <Button type="ghost" shape={"round"}>
                                  <Icon
                                    icon="arrow-left"
                                    size="20"
                                    className="arrow-left-icon"
                                  />
                                  {classifiedDetail.subcategoriesname &&
                                    classifiedDetail.subcategoriesname.name}
                                </Button>
                              </Link>
                            )}
                          </div>
                        )}
                        {classifiedDetail.classified_image && (
                          <Carousel
                            className="mb-4"
                            classifiedDetail={classifiedDetail}
                            slides={classifiedDetail.classified_image}
                            parameter={parameter}
                          />
                        )}
                      </Col>
                      <Col className="parent-right-block">
                        <div className="product-detail-right">
                          <div className="product-title-block">
                            <div className="left-block">
                              <Title level={4}>
                                {capitalizeFirstLetter(classifiedDetail.title)}
                              </Title>
                              <div className="total-view">
                                <Icon icon="view" size="20" />{" "}
                                <Text>{classifiedDetail.count} Views</Text>
                              </div>
                            </div>
                            <div className="right-block">
                              <ul>
                                {classifiedDetail &&
                                  classifiedDetail.hide_mob_number === 1 && (
                                    <li>
                                      <Dropdown
                                        overlay={number}
                                        trigger={["click"]}
                                        overlayClassName="contact-social-detail"
                                        placement="bottomCenter"
                                        arrow
                                      >
                                        <div
                                          className="ant-dropdown-link"
                                          onClick={(e) => e.preventDefault()}
                                        >
                                          <Icon
                                            icon="call"
                                            size="27"
                                            onClick={(e) => e.preventDefault()}
                                          />
                                        </div>
                                      </Dropdown>
                                    </li>
                                  )}
                                <li>
                                  <Dropdown
                                    overlay={menu}
                                    trigger={["click"]}
                                    overlayClassName="contact-social-detail share-ad"
                                    placement="bottomCenter"
                                    arrow
                                  >
                                    <div
                                      className="ant-dropdown-link"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <Icon icon="share" size="27" />
                                    </div>
                                  </Dropdown>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="product-map-price-block">
                            <div className="left-block">
                              <table style={{ width: "100%" }}>
                                <tr>
                                  <td>
                                    <label>Price:</label>
                                  </td>
                                  <td>
                                    <Title level={2} className="price">
                                      {classifiedDetail.is_sold
                                        ? "Sold"
                                        : classifiedDetail.price
                                        ? `AU$${salaryNumberFormate(
                                            classifiedDetail.price
                                          )}`
                                        : "Free"}
                                      {classifiedDetail.is_ad_free
                                        ? "Free"
                                        : ""}
                                    </Title>
                                    {is_negotiable && (
                                      <Text className="mr-7 price-subtitle">
                                        {is_negotiable ? "Negotiable" : ""}
                                      </Text>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" className="space-block">
                                    &nbsp;
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <label>Date Listed:</label>
                                  </td>
                                  <td className="text-detail">
                                    {convertISOToUtcDateformate(
                                      classifiedDetail.created_at
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <label>{conditionlabel}:</label>
                                  </td>
                                  <td className="text-detail">
                                    {conditionValue}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <label>Location:</label>
                                  </td>
                                  <td className="text-detail">
                                    <div className="location-text-limit">
                                      {classifiedDetail.location}
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2">
                                    <div className="map-view">
                                      {classifiedDetail && (
                                        <Map list={[classifiedDetail]} />
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <div className="right-block">
                              {isButtonVisible && (
                                <div className="action-btn-block">
                                  <Button
                                    type="default"
                                    onClick={this.contactModal}
                                    className="contact-btn"
                                  >
                                    {"Contact"}
                                  </Button>
                                  {classifiedDetail.price !== 0 &&
                                    classifiedDetail.is_ad_free !== 1 &&
                                    classifiedDetail.is_sold !== 1 && (
                                      <Button
                                        type="default"
                                        onClick={this.makeOfferModal}
                                        className="make-offer-btn"
                                      >
                                        {"Make an Offer"}
                                      </Button>
                                    )}
                                </div>
                              )}
                              <Button
                                type="default"
                                onClick={() =>
                                  this.onSelection(
                                    classifiedDetail,
                                    classified_id
                                  )
                                }
                                className="add-wishlist-btn"
                              >
                                {classifiedDetail && (
                                  <Icon
                                    icon={
                                      is_favourite
                                        ? "wishlist-fill"
                                        : "wishlist"
                                    }
                                    size="20"
                                    className={is_favourite ? "active" : ""}
                                    onClick={() =>
                                      this.onSelection(
                                        classifiedDetail,
                                        classified_id
                                      )
                                    }
                                  />
                                )}{" "}
                                Add to Wishlist
                              </Button>
                            </div>
                          </div>

                          <div className="add-review-block">
                            <div className="ad-no-block">
                              <div className="left-block">
                                <div className="label">Ad Details:</div>
                              </div>
                              <div className="right-block">
                                <div className="add-no-right">
                                  <Link to={categoryPagePath}>
                                    <Button
                                      type="default"
                                      className="light-gray"
                                    >
                                      {categoryName}
                                    </Button>
                                  </Link>
                                  <div className="ad-num">
                                    <Paragraph className="text-gray mb-0">
                                      AD No. {classified_id}
                                    </Paragraph>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="report-ad">
                              <div className="view-map testing-content change-log pt-0">
                                {classifiedDetail.subcategoriesname && (
                                  <p
                                    onClick={() => {
                                      if (classifiedDetail.is_reported === 1) {
                                        toastr.warning(
                                          langs.warning,
                                          MESSAGES.REPORT_ADD_WARNING
                                        );
                                      } else {
                                        if (isLoggedIn) {
                                          this.setState({
                                            reportAdModel: true,
                                          });
                                        } else {
                                          this.props.openLoginModel();
                                        }
                                      }
                                    }}
                                    className="blue-p"
                                  >
                                    <ExclamationCircleOutlined /> Report this Ad
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div ref={this.myDivToFocus} className="mb-30">
                      <DetailTabView
                        setPriorityTab={this.setPriorityTab}
                        priorityTab={priorityTab}
                        makeReviewtabOpen={makeReviewtabOpen}
                        classifiedDetail={classifiedDetail}
                        allData={allData}
                        similarAd={similarAd}
                        isLoggedIn={isLoggedIn}
                        cat_id={cat_id}
                        classified_id={classified_id}
                        getDetails={() => this.getDetails(classified_id)}
                        tempSlug={tempSlug}
                      />
                    </div>
                  </div>
                </Layout>
              </Layout>
            </Layout>
          </Layout>
          {reportAdModel && (
            <ReportAdModal
              visible={reportAdModel}
              onCancel={() => this.setState({ reportAdModel: false })}
              classifiedDetail={classifiedDetail && classifiedDetail}
              callNext={() => this.getDetails(classified_id)}
            />
          )}
          {visible && (
            <ContactModal
              visible={visible}
              onCancel={this.handleCancel}
              classifiedDetail={classifiedDetail && classifiedDetail}
              receiverId={
                classifiedDetail.classified_users
                  ? classifiedDetail.classified_users.id
                  : ""
              }
              classifiedid={classifiedDetail && classifiedDetail.id}
            />
          )}
          {makeOffer && (
            <MakeAnOffer
              visible={makeOffer}
              onCancel={this.handleCancel}
              classifiedDetail={classifiedDetail && classifiedDetail}
              receiverId={
                classifiedDetail.classified_users
                  ? classifiedDetail.classified_users.id
                  : ""
              }
              classifiedid={classifiedDetail && classifiedDetail.id}
              onFinish={() => this.setState({ isOfferSent: true })}
            />
          )}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, classifieds } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedclassifiedDetail: classifieds.classifiedsList,
  };
};

export default connect(mapStateToProps, {
  getClassfiedCategoryDetail,
  addToWishList,
  removeToWishList,
  openLoginModel,
  enableLoading,
  disableLoading,
  getChildCategory,
})(DetailPage);
