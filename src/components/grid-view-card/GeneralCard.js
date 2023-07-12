import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Link, Redirect, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { Dropdown, Card, Row, Col, Rate, Popover, Typography } from "antd";
import Icon from "../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../config/Config";
import { STATUS_CODES } from "../../config/StatusCode";
import { MESSAGES } from "../../config/Message";
import { langs } from "../../config/localization";
import {
  enableLoading,
  disableLoading,
  openLoginModel,
  setFavoriteItemId,
  addToWishList,
  removeToWishList,
} from "../../actions/index";
import {
  getClassifiedDetailPageRoute,
  getRetailDetailPageRoute,
} from "../../common/getRoutes";
import {
  formateTime,
  salaryNumberFormate,
  capitalizeFirstLetter,
  convertHTMLToText,
} from "../common";
import { rating } from "../classified-templates/CommanMethod";
const { Text } = Typography;

class DetailCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      favoriteItem: [],
      is_favourite: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called before mounting the component
   */
  componentDidMount() {
    const { data } = this.props;
    this.setState({ is_favourite: data.wishlist === 1 ? true : false });
  }

  onSelection = (data) => {
    const { favoriteItem, is_favourite } = this.state;
    const { isLoggedIn, loggedInDetail } = this.props;
    if (isLoggedIn) {
      if (data.wishlist === 1 || is_favourite) {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: data.classifiedid ? data.classifiedid : data.id,
        };
        this.props.enableLoading();
        this.props.removeToWishList(requestData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            // toastr.success(langs.success, res.data.msg)
            toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
            // this.props.callNext()
            this.setState({ is_favourite: false });
          }
        });
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: data.classifiedid ? data.classifiedid : data.id,
        };
        this.props.enableLoading();
        this.props.addToWishList(requestData, (res) => {
          this.props.disableLoading();
          this.setState({ flag: !this.state.flag });
          if (res.status === STATUS_CODES.OK) {
            // toastr.success(langs.success, res.data.msg)
            toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS);
            // this.props.callNext()
            this.setState({ is_favourite: true });
          }
        });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method selectTemplateRoute
   * @description navigate to detail Page
   */
  selectTemplateRoute = (el) => {
    let cat_id =
      this.props.match.params.categoryId !== undefined
        ? this.props.match.params.categoryId
        : el.parent_categoryid !== undefined
        ? el.parent_categoryid
        : el.id;
    const { retail } = this.props;
    let catName = el.catname;
    let classifiedId = el.classifiedid ? el.classifiedid : el.id;
    let templateName = el.template_slug;
    let path = "";
    if (retail) {
      path = getRetailDetailPageRoute(cat_id, catName, classifiedId);
      this.setState({ redirect: path });
    }
    if (templateName === TEMPLATE.GENERAL) {
      path = getClassifiedDetailPageRoute(
        templateName,
        cat_id,
        catName,
        classifiedId
      );
      this.setState({ redirect: path });
    } else if (templateName === TEMPLATE.JOB) {
      path = getClassifiedDetailPageRoute(
        templateName,
        cat_id,
        catName,
        classifiedId
      );
      this.setState({ redirect: path });
    } else if (templateName === TEMPLATE.REALESTATE) {
      path = getClassifiedDetailPageRoute(
        templateName,
        cat_id,
        catName,
        classifiedId
      );
      this.setState({ redirect: path });
    }
    // window.open(path, "_blank")
  };

  renderRate = (rating) => {
    return (
      <div className="rate-section">
        <Text>{rating ? rating : ""}</Text>
        {rating && rating === "1.0" && <Rate disabled defaultValue={1} />}
        {rating && rating === "2.0" && <Rate disabled defaultValue={2} />}
        {rating && rating === "3.0" && <Rate disabled defaultValue={3} />}
        {rating && rating === "4.0" && <Rate disabled defaultValue={4} />}
        {rating && rating === "5.0" && <Rate disabled defaultValue={5} />}
      </div>
    );
  };

  /**
   * @method renderIcon
   * @description render icons
   */
  renderCommercialIcon = (data) => {
    const iconData = data.filter(
      (el) => el.slug === "Land Size" || el.slug === "Floor Size"
    );
    console.log("iconData", iconData);
    return (
      iconData &&
      Array.isArray(iconData) &&
      iconData.map((el, i) => {
        return (
          <li>
            {el.slug === "Land Size" && (
              <img
                src={require("../../assets/images/icons/unit-squre-first.svg")}
                alt=""
              />
            )}
            {el.slug === "Land Size" && (
              <span className="unit-digit">{el.value}</span>
            )}
            {el.slug === "Floor Size" && (
              <img
                src={require("../../assets/images/icons/unit-squre-second.svg")}
                alt=""
              />
            )}
            {el.slug === "Floor Size" && (
              <span className="unit-digit">{el.value}</span>
            )}
          </li>
        );
      })
    );
  };

  /**
   * @method renderIcon
   * @description render icons
   */
  renderResidentialIcon = (data) => {
    const iconData = data.filter(
      (el) =>
        el.slug === "bedroom" ||
        el.slug === "type-bathroom" ||
        el.slug === "Parking Type" ||
        el.slug === "Shower" ||
        el.slug === "Parking" ||
        el.slug === "Property Type" ||
        el.slug === "car_spaces" ||
        el.slug === "Area Size"
    );
    return (
      iconData &&
      Array.isArray(iconData) &&
      iconData.map((el, i) => {
        return (
          <li>
            {el.slug === "bedroom" && (
              <img
                src={require("../../assets/images/icons/bedroom.svg")}
                alt=""
              />
            )}
            {el.slug === "bedroom" && (
              <span className="unit-digit">{el.value}</span>
            )}
            {(el.slug === "Shower" || el.slug === "type-bathroom") && (
              <img
                src={require("../../assets/images/icons/bathroom.svg")}
                alt=""
              />
            )}
            {(el.slug === "Shower" || el.slug === "type-bathroom") && (
              <span className="unit-digit">{el.value}</span>
            )}
            {(el.slug === "Parking" ||
              el.slug === "Parking Type" ||
              el.slug === "car_spaces") && (
              <img
                src={require("../../assets/images/icons/carpark.svg")}
                alt=""
              />
            )}
            {(el.slug === "Parking" ||
              el.slug === "Parking Type" ||
              el.slug === "car_spaces") && (
              <span className="unit-digit">{el.value}</span>
            )}
            {(el.slug === "Property Type" || el.slug === "Area Size") && (
              <img
                src={require("../../assets/images/icons/land-size.svg")}
                alt=""
              />
            )}
            {(el.slug === "Property Type" || el.slug === "Area Size") && (
              <span className="unit-digit">{el.value}</span>
            )}
          </li>
        );
      })
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { retail, data, slug } = this.props;
    let temp =
      data.spicification &&
      Array.isArray(data.spicification) &&
      data.spicification.length
        ? data.spicification
        : [];
    let temp2 = temp.length && temp.filter((el) => el.slug === "property_type");
    let property_type = temp2 && temp2.length && temp2[0].value;
    let inspection =
      data.inspections_times &&
      Array.isArray(data.inspections_times) &&
      data.inspections_times.length
        ? data.inspections_times[0]
        : "";
    const { redirect, is_favourite } = this.state;
    let isCommercial = slug === "commercial real estate";
    let is_residencial = slug === "Residential Real Estate";
    let rate =
      data && data.avg_rating
        ? `${parseInt(data.avg_rating)}.0`
        : data.reviews && rating(data.reviews);
    let templatename =
      data && data.template_slug !== undefined ? data.template_slug : "";
    let cityname = "";
    if (data.cityname) {
      cityname = data.cityname;
    } else if (data.city_data) {
      cityname = data.city_data.City;
    }
    const dateTime = (
      <ul className="c-dropdown-content">
        {data.inspections_times &&
          Array.isArray(data.inspections_times) &&
          data.inspections_times.length &&
          data.inspections_times.map((el, i) => (
            <li key={i}>
              {inspection &&
                `${moment(el.inspection_date).format("MMM")} ${formateTime(
                  el.inspection_start_time
                )} - ${moment(el.inspection_date).format("MMM")} ${formateTime(
                  el.inspection_end_time
                )}`}
            </li>
          ))}
      </ul>
    );

    let cat_id =
      this.props.match.params.categoryId !== undefined
        ? this.props.match.params.categoryId
        : data.parent_categoryid !== undefined
        ? data.parent_categoryid
        : data.id;
    let catName = data.catname;
    let classifiedId = data.classifiedid ? data.classifiedid : data.id;
    let templateName = data.template_slug;
    let path = "";
    if (retail) {
      path = getRetailDetailPageRoute(cat_id, catName, classifiedId);
    }
    if (templateName === TEMPLATE.GENERAL) {
      path = getClassifiedDetailPageRoute(
        templateName,
        cat_id,
        catName,
        classifiedId
      );
    } else if (templateName === TEMPLATE.JOB) {
      path = getClassifiedDetailPageRoute(
        templateName,
        cat_id,
        catName,
        classifiedId
      );
    } else if (templateName === TEMPLATE.REALESTATE) {
      path = getClassifiedDetailPageRoute(
        templateName,
        cat_id,
        catName,
        classifiedId
      );
    }
    return (
      <Col className="gutter-row" md={24}>
        <div className="listing-view">
          <Row gutter={30}>
            <Col md={5}>
              <div className="thumb-shadow-block">
                <Link to={path}>
                  <img
                    src={
                      data &&
                      data.imageurl !== undefined &&
                      data.imageurl !== null
                        ? data.imageurl
                        : DEFAULT_IMAGE_CARD
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE_CARD;
                    }}
                    //onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}
                    alt={data && data.title !== undefined ? data.title : ""}
                  />
                </Link>
              </div>
            </Col>
            <Col
              md={13}
              style={{ borderRight: "1px solid #DADADA", paddingLeft: "6px" }}
            >
              <div className="rate-section rating-parent">
                <span className="blue-link">
                  {data.catname
                    ? data.catname
                    : data.parentCategoryName
                    ? data.parentCategoryName
                    : ""}
                </span>
                {/* {rate ? this.renderRate(rate) : "No reviews yet"} */}
              </div>
              <Link to={path}>
                <div
                  className="title"
                  //onClick={() => this.selectTemplateRoute(data)}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                  }}
                >
                  {data && data.title !== undefined
                    ? capitalizeFirstLetter(data.title)
                    : ""}
                </div>
              </Link>

              <div
                className="price-box"
                align="middle"
                //onClick={() => this.selectTemplateRoute(data)}
                style={{ cursor: "pointer" }}
              >
                <div className="price">
                  <Link to={path}>
                    {data && data.price !== undefined
                      ? `AU$${salaryNumberFormate(parseInt(data.price))}`
                      : ""}
                  </Link>
                </div>
              </div>

              <Link to={path}>
                <div
                  className="listing-category-box"
                  //onClick={() => this.selectTemplateRoute(data)}
                  style={{ cursor: "pointer" }}
                >
                  {!isCommercial && !is_residencial && (
                    <div className="listing-category-name">
                      {data && data.description !== undefined
                        ? `${data.description.slice(0, 200)}...`
                        : ""}
                    </div>
                  )}
                  {data.tagIcon && (
                    <div
                      className="listing-tag-icon"
                      style={{ backgroundColor: `${data.tagIconColor}` }}
                    >
                      {data.tagIcon}
                    </div>
                  )}
                  {isCommercial && (
                    <ul className="listing-icon">
                      {this.renderCommercialIcon(data.spicification)}
                    </ul>
                  )}
                  {is_residencial && (
                    <ul className="listing-icon">
                      {this.renderResidentialIcon(data.spicification)}
                    </ul>
                  )}
                </div>
              </Link>
            </Col>
            <Col md={6}>
              <div className="right-detail-block">
                <ul className="wish-view-like-icon">
                  <Link to={path}>
                    <li className="cart-icon">
                      {retail ? (
                        <img
                          src={require("../dashboard-sidebar/icons/cart-dark-gray.png")}
                          alt=""
                          width="20"
                        />
                      ) : (
                        <Icon
                          icon={
                            templatename === TEMPLATE.GENERAL ||
                            templatename === TEMPLATE.JOB ||
                            templatename === TEMPLATE.REALESTATE
                              ? "email"
                              : "cart"
                          }
                          size="20"
                          //onClick={() => this.selectTemplateRoute(data)}
                        />
                      )}
                    </li>
                  </Link>
                  <li>
                    <Icon
                      icon={is_favourite ? "wishlist-fill" : "wishlist"}
                      className={is_favourite ? "active" : ""}
                      size="20"
                      onClick={() => this.onSelection(data)}
                    />
                  </li>
                  <li>
                    <Popover
                      title={
                        data && data.count !== undefined
                          ? `Total Views :  ${data.count ? data.count : "0"}`
                          : `Total Views : ${
                              data && data.views !== undefined
                                ? data.views
                                : "0"
                            }`
                      }
                    >
                      <Icon icon="view" size="20" />
                    </Popover>
                  </li>
                </ul>
                <div className="location-discription">
                  {!isCommercial && !is_residencial && (
                    <div className="location-name">
                      {data.cityname && data.cityname !== "N/A" && (
                        <Icon icon="location" size="20" className="mr-5" />
                      )}
                      {cityname}
                    </div>
                  )}
                  {isCommercial && (
                    <p>{property_type ? property_type : "Other"}</p>
                  )}
                  {/* {isCommercial &&<p>Factory & Industrial</p>} */}
                  {is_residencial &&
                    data.inspection_type &&
                    data.inspection_type !== "By Appointment" && (
                      <div>
                        <p>Open for Inspection</p>
                        {
                          <Dropdown overlay={dateTime}>
                            <p>
                              {inspection &&
                                `${moment(inspection.inspection_date).format(
                                  "MMM"
                                )} ${formateTime(
                                  inspection.inspection_start_time
                                )} - ${moment(
                                  inspection.inspection_date
                                ).format("MMM")} ${formateTime(
                                  inspection.inspection_end_time
                                )}`}
                            </p>
                          </Dropdown>
                        }
                      </div>
                    )}
                  {is_residencial &&
                    data.inspection_type == "By Appointment" && (
                      <p>Contact agent for inspection</p>
                    )}
                </div>
              </div>
            </Col>
          </Row>
          {/* {redirect && <Redirect push
                        to={{
                            pathname: redirect
                        }}
                    />
                    } */}
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { isOpenLoginModel, favoriteId } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
    isOpenLoginModel,
    favoriteId,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  openLoginModel,
  setFavoriteItemId,
  addToWishList,
  removeToWishList,
})(withRouter(DetailCard));
