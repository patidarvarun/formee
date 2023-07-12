import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";

import {
  Card,
  Empty,
  Menu,
  Tooltip,
  Layout,
  Typography,
  Avatar,
  Tabs,
  Row,
  Col,
  Breadcrumb,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Rate,
  Modal,
  Dropdown,
  Divider,
} from "antd";
import Icon from "../../customIcons/customIcons";
import {
  UserOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  getChildCategory,
  enableLoading,
  disableLoading,
  addToWishList,
  removeToWishList,
  openLoginModel,
  getClassfiedCategoryDetail,
} from "../../../actions/index";
import {
  getClassifiedCatLandingRoute,
  getClassifiedSubcategoryRoute,
} from "../../../common/getRoutes";
import { BASE_URL, DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../config/Config";
import { langs } from "../../../config/localization";
import AppSidebar from "../../sidebar";
import {
  displayDateTimeFormate,
  convertHTMLToText,
  displayInspectionDate,
  formateTime,
  salaryNumberFormate,
} from "../../common";
import { STATUS_CODES } from "../../../config/StatusCode";
import { MESSAGES } from "../../../config/Message";
import { SocialShare } from "../../common/social-share";
import Magnifier from "react-magnifier";
import history from "../../../common/History";
import LeaveReviewModel from "../common/modals/LeaveReviewModel";
import Map from "../../common/Map";
import "../../common/mapView.less";
import { rating } from "../CommanMethod";
import ContactModal from "../common/modals/ContactModal";
import Review from "../common/ClassifiedReview";
import BookAnInspectaion from "../common/modals/BookAnInspectionModal";
import ReportAdModal from "../common/modals/ReportAdModal";
import {
  convertISOToUtcDateformate,
  capitalizeFirstLetter,
} from "../../common";
import Carousel from "../../common/caraousal";
import "../../common/caraousal/crousal.less";
import "../../dashboard/vendor-profiles/myprofilestep.less";
import moment from "moment";
import ImageZoomModel from "../../common/ImageZoomModel";
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: "align-center pt-20",
};

class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classifiedDetail: [],
      allData: "",
      visible: false,
      makeOffer: false,
      reviewModel: false,
      is_favourite: false,
      isOpen: false,
      subCategory: [],
      catrgoryName: "",
      subCatName: "",
      tempSlug: "",
      catId: "",
      subCatId: "",
      reportAdModel: false,
      selectedInspection: "",
      imageModel: false,
    };
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    let parameter = this.props.parameters ?? this.props.match.params;
    let parentId = parameter.categoryId;
    this.getChildCategory(parentId);
    this.props.enableLoading();
    this.getChildCategory(parentId);
    this.getDetails();
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let classified_id = this.props.parameters?.classified_id ?? this.props.match.params.classified_id;
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
        this.setState({
          classifiedDetail: res.data.data,
          allData: res.data,
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
          // isFilterPage: isFilterPage,
        });
      }
    });
  };

  /**
   * @method contactModal
   * @description contact model
   */
  contactModal = (flag) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        visible: true,
        flag: flag === "is_inspection" ? true : false,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method makeOfferModal
   * @description handle make an offer model
   */
  makeOfferModal = (item) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        makeOffer: true,
        selectedInspection: item,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method contactModal
   * @description contact model
   */
  leaveReview = () => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        reviewModel: true,
      });
    } else {
      this.props.openLoginModel();
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
      reviewModel: false,
      imageModel: false,
    });
  };

  /**
   * @method renderSpecification
   * @description render specification list
   */
  renderSpecification = (data) => {
    if (data && Array.isArray(data) && data.length) {
      let sorted_list =
        data &&
        data.sort((a, b) => {
          if (a.position < b.position) return -1;
          if (a.position > b.position) return 1;
          return 0;
        });
      return (
        sorted_list &&
        Array.isArray(sorted_list) &&
        sorted_list.map((el, i) => {
          return (
            <Row className="pt-20" key={i}>
              <Col span={8}>
                <Text className="strong">{el.key}</Text>
              </Col>
              <Col span={14}>
                <Text>{el.value}</Text>
              </Col>
            </Row>
          );
        })
      );
    }
  };

  /**
   * @method getChildCategory
   * @description get getChildCategory records
   */
  getChildCategory = (id) => {
    // let isFilterPage = this.props.location.state === undefined ? false : true

    this.props.getChildCategory({ pid: id }, (res1) => {
      if (res1.status === 200) {
        const data =
          Array.isArray(res1.data.newinsertcategories) &&
          res1.data.newinsertcategories;
        this.setState({
          subCategory: data,
          // isFilterPage: isFilterPage,
        });
      }
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
   * @description render thumbnail images
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
        this.props.removeToWishList(requestData, (res) => {
          if (res.status === STATUS_CODES.OK) {
            // toastr.success(langs.success, res.data.msg)
            toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
            // this.getDetails()
            this.setState({ is_favourite: false });
          }
        });
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: classifiedid,
        };
        this.props.addToWishList(requestData, (res) => {
          this.setState({ flag: !this.state.flag });
          if (res.status === STATUS_CODES.OK) {
            // toastr.success(langs.success, res.data.msg)
            toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS);
            // this.getDetails()
            this.setState({ is_favourite: true });
          }
        });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method renderIcon
   * @description render icons
   */
  renderIcon = (data) => {
    const iconData = data.filter(
      (el) =>
        el.key === "Bedrooms" ||
        el.key === "Bathrooms" ||
        el.key === "Parking Type" ||
        el.key === "Shower" ||
        el.key === "Parking" ||
        el.key === "Property Type"
    );
    return (
      iconData &&
      Array.isArray(iconData) &&
      iconData.map((el, i) => {
        return (
          <li>
            {
              <img
                src={require("../../../assets/images/icons/bedroom.svg")}
                alt=""
              />
            }
            {<Text>{el.value}</Text>}
            {(el.key === "Shower" || el.key === "Bathrooms") && (
              <img
                src={require("../../../assets/images/icons/bathroom.svg")}
                alt=""
              />
            )}
            {(el.key === "Shower" || el.key === "Bathrooms") && (
              <Text>{el.value}</Text>
            )}
            {(el.key === "Parking" || el.key === "Parking Type") && (
              <img
                src={require("../../../assets/images/icons/carpark.svg")}
                alt=""
              />
            )}
            {(el.key === "Parking" || el.key === "Parking Type") && (
              <Text>{el.value}</Text>
            )}
            {el.key === "Property Type" && (
              <img
                src={require("../../../assets/images/icons/land-size.svg")}
                alt=""
              />
            )}
            {el.key === "Property Type" && <Text>{el.value}</Text>}
          </li>
        );
      })
    );
  };

  /**
   * @method renderInspectionTime
   * @description render inspections
   */
  renderInspectionTime = (item, visible) => {
    return (
      item &&
      Array.isArray(item) &&
      item.length &&
      item.map((el, i) => {
        return (
          <Row gutter={15}>
            <Col span={21}>
              <div className="inspection-list">
                <Icon icon="clock" size="22" />
                <Text className="ml-15">
                  {displayInspectionDate(
                    new Date(el.inspection_date).toISOString()
                  )}
                </Text>
                <div className="right">
                  <Text>
                    {formateTime(el.inspection_start_time)} -{" "}
                    {formateTime(el.inspection_end_time)}
                  </Text>
                </div>
              </div>
            </Col>
            {visible && (
              <Col span={3} style={{ display: "flex", alignItems: "center" }}>
                <Button
                  htmlType={"button"}
                  type="primary"
                  onClick={() => this.makeOfferModal(el)}
                >
                  <img
                    src={require("../../../assets/images/icons/add-booking.svg")}
                    width="16"
                    alt=""
                    // onClick={this.makeOfferModal}
                    // style={{ cursor: 'pointer' }}
                  />
                  Book
                </Button>
                {/* <Text className='ml-15' onClick={this.makeOfferModal} style={{ cursor: 'pointer' }}>Book an Inspection Time</Text> */}
              </Col>
            )}
          </Row>
        );
      })
    );
  };

  /**
   * @method renderFeatures
   * @description render features
   */
  renderFeatures = (features) => {
    if (features && Array.isArray(features) && features.length) {
      return (
        features &&
        features.map((el, i) => {
          return (
            <Col span={6} key={i}>
              {/* <Checkbox checked></Checkbox> */}
              <CheckOutlined className="check-tick" /> {el}
            </Col>
          );
        })
      );
    }
  };

  /**
   * @method renderRealestateFloorPlan
   * @description render icons
   */
  renderRealestateFloorPlan = (data) => {
    const iconData = data.filter(
      (el) =>
        el.slug === "bedroom" ||
        el.slug === "type-bathroom" ||
        el.slug === "Parking Type" ||
        el.slug === "Shower" ||
        el.slug === "Parking" ||
        el.slug === "Property Type" ||
        el.slug === "car_spaces" ||
        el.slug === "Area Size" ||
        el.slug === "type_of_parking" ||
        el.slug === "Land Size" ||
        el.slug === "Floor Size" ||
        el.slug === "tenture_type" ||
        el.slug === "furnished" ||
        el.slug === "available_from"
    );
    return (
      iconData &&
      Array.isArray(iconData) &&
      iconData.map((el, i) => {
        return (
          <Row key={i}>
            <Col span={15}>
              <Text className="strong">{el.key}</Text>
            </Col>
            <Col span={9}>
              <Text>{el.value}</Text>
            </Col>
          </Row>
        );
      })
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isLoggedIn, loggedInDetail } = this.props;
    const {
      imageModel,
      selectedInspection,
      flag,
      subCategory,
      catId,
      tempSlug,
      categoryName,
      subCatId,
      subCatName,
      isOpen,
      is_favourite,
      visible,
      classifiedDetail,
      reviewModel,
      allData,
      reportAdModel,
    } = this.state;
    let clasified_user_id =
      classifiedDetail && classifiedDetail.classified_users
        ? classifiedDetail.classified_users.id
        : "";
    let isButtonVisible =
      isLoggedIn && loggedInDetail.id === clasified_user_id ? false : true;
    let parameter = this.props.parameters?.classified_id ?? this.props.match.params;
    let cat_id = parameter.categoryId;
    let classified_id = parameter.classified_id;
    let subCategoryId = subCatId;
    let rate =
      classifiedDetail &&
      classifiedDetail.classified_hm_reviews &&
      rating(classifiedDetail.classified_hm_reviews);
    let subCategoryName = classifiedDetail.categoriesname
      ? classifiedDetail.subcategoriesname.name
      : "";
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
    let imgLength = Array.isArray(classifiedDetail.classified_image)
      ? classifiedDetail.classified_image.length
      : 1;
    let inspectionTime = allData && allData.inspections_times;
    let inspectionData =
      inspectionTime && Array.isArray(inspectionTime) && inspectionTime.length
        ? inspectionTime[0]
        : "";
    let date = inspectionData.inspection_date
      ? displayInspectionDate(
          new Date(inspectionData.inspection_date).toISOString()
        )
      : "";
    let time = inspectionData.inspection_date
      ? `${formateTime(inspectionData.inspection_start_time)} - ${formateTime(
          inspectionData.inspection_end_time
        )}`
      : "";
    const menu = <SocialShare {...this.props} />;
    let today = Date.now();
    let currentDate = moment(today).format("YYYY-MM-DD");
    const dateTime = (
      <ul className="c-dropdown-content">
        {inspectionTime &&
          Array.isArray(inspectionTime) &&
          inspectionTime.length &&
          inspectionTime.map((el, i) => (
            <li key={i}>
              {}
              <Text
                className={
                  moment(el.inspection_date).format("YYYY-MM-DD") ===
                  currentDate
                    ? "active-date"
                    : ""
                }
              >
                {displayInspectionDate(
                  new Date(el.inspection_date).toISOString()
                )}
              </Text>
              <Text
                className={
                  moment(el.inspection_date).format("YYYY-MM-DD") ===
                  currentDate
                    ? "pull-right active-date"
                    : "pull-right"
                }
              >
                {formateTime(el.inspection_start_time)} -{" "}
                {formateTime(el.inspection_end_time)}
              </Text>
            </li>
          ))}
      </ul>
    );
    let crStyle =
      imgLength === 2 || imgLength === 1 || imgLength === 3
        ? "product-gallery-nav hide-clone-slide"
        : "product-gallery-nav ";
    let contactNumber =
      classifiedDetail.contact_mobile && classifiedDetail.contact_mobile;
    // let formatedNumber = contactNumber && contactNumber.replace(/\d(?=\d{4})/g, '*')
    let formatedNumber =
      contactNumber && contactNumber.replace(/\d{7}(?=\d{3})/g, "0 XXXX XXX ");
    let specification =
      allData &&
      Array.isArray(allData.spicification) &&
      allData.spicification.length
        ? allData.spicification.filter(
            (el) =>
              el.slug === "property_type" || el.slug === "is_price_negotiable?"
          )
        : [];
    let propert_type = specification.length ? specification[0].value : "";
    let is_negotiable =
      specification && Array.isArray(specification) && specification.length
        ? specification[0].value
        : "";
    let temp =
      allData.spicification &&
      Array.isArray(allData.spicification) &&
      allData.spicification.length &&
      allData.spicification.filter((el) => el.key === "Features");
    let features =
      temp && temp.length ? temp[0].value && temp[0].value.split(",") : [];
    const number = (
      <Menu>
        <Menu.Item key="0">
          {isLoggedIn ? (
            <span className="">
              {classifiedDetail.classified_users && (
                <Tooltip placement="bottomRight">
                  <div>
                    <b>
                      <span>
                        Contact {classifiedDetail.classified_users.name}
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
              {/* <span>Please<span className='blue-link ml-16 fs-16' onClick={() => this.props.openLoginModel()}>Login</span> to view number </span> */}
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
    return (
      <div className="product-detail-parent-block">
        <Layout className="common-left-right-padd">
          {/* <AppSidebar history={history} activeCategoryId={subCategoryId} moddule={1} /> */}
          <Layout>
            <Layout className="right-parent-block">
              <Layout
                style={{ width: "calc(100% - 0px)", overflowX: "visible" }}
              >
                <Layout>
                  <div className="detail-page right-content-block">
                    <Row>
                      <Col flex="370px">
                        <div className="category-name">
                          {classifiedDetail.subcategoriesname && (
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
                        {classifiedDetail.classified_image && (
                          <Carousel
                            className="mb-4"
                            classifiedDetail={classifiedDetail}
                            slides={classifiedDetail.classified_image}
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
                                      {"AU$"}
                                      {salaryNumberFormate(
                                        classifiedDetail.price
                                      )}
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
                                    <label>Property Type:</label>
                                  </td>
                                  <td className="text-detail">
                                    {propert_type}
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
                                    {"Send Enquiry"}
                                  </Button>
                                  {inspectionTime &&
                                    inspectionTime.length !== 0 &&
                                    classifiedDetail.inspection_type !==
                                      "By Appointment" && (
                                      <Button
                                        type="default"
                                        onClick={() => this.makeOfferModal("")}
                                        className="make-offer-btn"
                                      >
                                        {"Book For Inspection"}
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
                                  <Link to={subCategoryPagePath}>
                                    <Button
                                      type="default"
                                      className="light-gray"
                                    >
                                      {classifiedDetail.subcategoriesname &&
                                        classifiedDetail.subcategoriesname.name}
                                    </Button>
                                  </Link>
                                  <div className="ad-num">
                                    <Paragraph className="text-gray">
                                      AD No. {classified_id}
                                    </Paragraph>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="report-ad">
                              <div className="view-map testing-content change-log">
                                {classifiedDetail.subcategoriesname && (
                                  <p
                                    onClick={() => {
                                      if (classifiedDetail.is_reported === 1) {
                                        toastr.warning(
                                          langs.warning,
                                          MESSAGES.REPORT_ADD_WARNING
                                        );
                                      } else {
                                        this.setState({ reportAdModel: true });
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
                    <Tabs type="card" className={"tab-style3 product-tabs"}>
                      <TabPane tab="Details" key="1">
                        <Row gutter={[0, 0]}>
                          <Col md={18}>
                            <div className="content-detail-block">
                              <Title level={4}>Property Description</Title>
                              <Paragraph>
                                {classifiedDetail.description
                                  ? convertHTMLToText(
                                      classifiedDetail.description
                                    )
                                  : ""}
                              </Paragraph>
                              {features && features.length !== 0 && (
                                <Title level={4} className="block-heading-two">
                                  Property Features
                                </Title>
                              )}
                              <div className="feture-listing">
                                <Row gutter={[0, 0]}>
                                  {features &&
                                    features.length !== 0 &&
                                    this.renderFeatures(features)}
                                </Row>
                              </div>
                            </div>
                          </Col>
                          <Col md={1}>&nbsp;</Col>
                          <Col md={5}>
                            <div className="similer-listing-parent view-floor-plan">
                              <h2>View Floor Plan</h2>
                              <div
                                className="floor-plan-img"
                                title="Click to view floor plan"
                              >
                                {
                                  <img
                                    alt="example"
                                    src={
                                      classifiedDetail.floor_plan
                                        ? `${classifiedDetail.floor_plan}`
                                        : require("../../../assets/images/floor-plan.jpg")
                                    }
                                    onClick={() =>
                                      this.setState({ imageModel: true })
                                    }
                                  />
                                }
                              </div>
                              <div className="floor-detail">
                                {allData &&
                                  allData.spicification &&
                                  this.renderRealestateFloorPlan(
                                    allData.spicification
                                  )}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane
                        tab="Inspection"
                        key="3"
                        className="book-inspection"
                      >
                        {inspectionData &&
                          classifiedDetail.inspection_type !==
                            "By Appointment" && (
                            <div>
                              <Title level={4}>
                                {"Book an Inspection Time"}
                              </Title>
                              <div className={"mt-20 mb-30"}>
                                {inspectionTime &&
                                  inspectionTime.length !== 0 &&
                                  this.renderInspectionTime(
                                    inspectionTime,
                                    isButtonVisible
                                  )}
                              </div>
                            </div>
                          )}
                        {inspectionData &&
                          classifiedDetail.inspection_type ===
                            "By Appointment" && (
                            <Title level={4}>{"By Appointment"}</Title>
                          )}
                        {inspectionData === "" && (
                          <div className="inspection-no-data">
                            <ClockCircleOutlined className="clock" />
                            <div className="empty-discrip">
                              The agent has not scheduled any inspections for
                              this property
                            </div>
                            <Button
                              type="default"
                              onClick={() => this.contactModal("is_inspection")}
                            >
                              {"Send Enquiry"}
                            </Button>
                          </div>
                        )}
                      </TabPane>
                      <TabPane tab="Advertiser Information" key="5">
                        <Row className="reviews-content">
                          <Col md={8}>
                            <div className="reviews-content-left">
                              <div className="reviews-content-avatar">
                                <Avatar
                                  src={
                                    classifiedDetail.classified_users &&
                                    classifiedDetail.classified_users
                                      .image_thumbnail ? (
                                      classifiedDetail.classified_users
                                        .image_thumbnail
                                    ) : (
                                      <Avatar
                                        size={54}
                                        icon={<UserOutlined />}
                                      />
                                    )
                                  }
                                  size={69}
                                />
                              </div>
                              <div className="reviews-content-avatar-detail">
                                <Title level={4} className="mt-0 mb-4">
                                  {classifiedDetail.classified_users &&
                                    classifiedDetail.classified_users.name}
                                </Title>
                                <Paragraph className="fs-10 text-gray">
                                  {classifiedDetail.classified_users &&
                                    `(Member since : ${classifiedDetail.classified_users.member_since})`}
                                </Paragraph>
                                {/* <div className='address text-gray mb-10'>{classifiedDetail.location}</div> */}
                                <a className="fs-10 underline">
                                  {isLoggedIn ? (
                                    <Link
                                      to={`/user-ads/${"realstate"}/${cat_id}/${classified_id}`}
                                    >{`Found ${classifiedDetail.usercount} Ads`}</Link>
                                  ) : (
                                    <span
                                      onClick={() =>
                                        this.props.openLoginModel()
                                      }
                                    >{`Found ${classifiedDetail.usercount} Ads`}</span>
                                  )}
                                </a>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    </Tabs>
                  </div>
                </Layout>
              </Layout>
            </Layout>
            {reportAdModel && (
              <ReportAdModal
                visible={reportAdModel}
                onCancel={() => this.setState({ reportAdModel: false })}
                classifiedDetail={classifiedDetail && classifiedDetail}
                callNext={this.getDetails}
              />
            )}

            {reviewModel && (
              <LeaveReviewModel
                visible={reviewModel}
                onCancel={this.handleCancel}
                classifiedDetail={classifiedDetail && classifiedDetail}
                callNext={this.getDetails}
              />
            )}
            {visible && (
              <ContactModal
                visible={visible}
                onCancel={this.handleCancel}
                contactType={"realstate"}
                flag={flag}
                classifiedDetail={classifiedDetail && classifiedDetail}
                receiverId={
                  classifiedDetail.classified_users
                    ? classifiedDetail.classified_users.id
                    : ""
                }
                classifiedid={classifiedDetail && classifiedDetail.id}
              />
            )}
            {this.state.makeOffer && (
              <BookAnInspectaion
                visible={this.state.makeOffer}
                onCancel={this.handleCancel}
                contactType={"realstate"}
                classifiedDetail={classifiedDetail && classifiedDetail}
                receiverId={
                  classifiedDetail.classified_users
                    ? classifiedDetail.classified_users.id
                    : ""
                }
                classifiedid={classifiedDetail && classifiedDetail.id}
                inspectionTime={inspectionTime ? inspectionTime : []}
                callNext={this.getDetails}
                selectedInspection={selectedInspection}
              />
            )}
            {imageModel && (
              <ImageZoomModel
                visible={imageModel}
                onCancel={this.handleCancel}
                image={classifiedDetail && classifiedDetail.floor_plan}
              />
            )}
          </Layout>
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
  getChildCategory,
  getClassfiedCategoryDetail,
  addToWishList,
  removeToWishList,
  openLoginModel,
  enableLoading,
  disableLoading,
})(DetailPage);
