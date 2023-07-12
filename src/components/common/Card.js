import React from "react";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { Card, Col, Rate, Popover, Typography } from "antd";
import Icon from "../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../config/Config";
import { STATUS_CODES } from "../../config/StatusCode";
import { MESSAGES } from "../../config/Message";
import { langs } from "../../config/localization";
import {
  addToCartAPI,
  removeToRetailWishlist,
  addToRetailWishList,
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
import { salaryNumberFormate, capitalizeFirstLetter } from "../common";
import ContactModal from "../classified-templates/common/modals/ContactModal";
import { rating } from "../classified-templates/CommanMethod";
import CartModel from "../retail/retail-cart/CartModel";
const { Text } = Typography;

class DetailCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      favoriteItem: [],
      is_favourite: false,
      visible: false,
      openCartModel: false,
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
    const { isLoggedIn, loggedInDetail, retail } = this.props;
    if (isLoggedIn) {
      if (data.wishlist === 1 || is_favourite) {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: data.classifiedid ? data.classifiedid : data.id,
        };
        this.props.enableLoading();
        if (retail) {
          this.props.removeToRetailWishlist(requestData, (res) => {
            this.props.disableLoading();
            if (res.status === STATUS_CODES.OK) {
              // toastr.success(langs.success, res.data.msg)
              toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
              // this.props.callNext()
              this.setState({ is_favourite: false });
            }
          });
        } else {
          this.props.removeToWishList(requestData, (res) => {
            this.props.disableLoading();
            if (res.status === STATUS_CODES.OK) {
              // toastr.success(langs.success, res.data.msg)
              toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
              // this.props.callNext()
              this.setState({ is_favourite: false });
            }
          });
        }
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: data.classifiedid ? data.classifiedid : data.id,
        };
        this.props.enableLoading();
        if (retail) {
          this.props.addToRetailWishList(requestData, (res) => {
            this.props.disableLoading();
            this.setState({ flag: !this.state.flag });
            if (res.status === STATUS_CODES.OK) {
              // toastr.success(langs.success, res.data.msg)
              toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS);
              // this.props.callNext()
              this.setState({ is_favourite: true });
            }
          });
        } else {
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
    let classifiedId = el.classifiedid;
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
   * @method contactModal
   * @description contact model
   */
  contactModal = (data) => {
    const { retail, isLoggedIn, loggedInDetail } = this.props;
    if (isLoggedIn) {
      if (retail) {
        if (data.quantity) {
          let requestData = {
            ship_cost: 0,
            available_qty: data.quantity,
            qty: 1,
            classified_id: data.classifiedid
              ? data.classifiedid
              : data.parent_categoryid,
            user_id: loggedInDetail.id,
          };
          this.props.addToCartAPI(requestData, (res) => {
            if (res.status === 200) {
              if (res.data.status === 1) {
                toastr.success(langs.success, MESSAGES.AD_TO_CART);
                this.setState({ openCartModel: true });
              } else {
                toastr.error(langs.error, res.data.msg);
              }
            }
          });
        } else {
          toastr.warning("This product is out of stock");
        }
      } else {
        this.setState({ visible: true });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { data, col, retail } = this.props;
    console.log("data: ", data);
    const { openCartModel, visible, redirect, is_favourite } = this.state;
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
    let image =
      templatename === TEMPLATE.JOB
        ? data.company_logo
        : data && data.imageurl !== undefined && data.imageurl !== null
        ? data.imageurl
        : DEFAULT_IMAGE_CARD;
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
    let extraTag = "",
      style = "";
    if (data.featured_classified === 1) {
      extraTag = "Featured";
      style = "feature-tag";
    } else if (data.is_premium === 1) {
      extraTag = "Premium";
      style = "premium-tag";
    }
    let minSal = 0;
    let maxSal = 0;
    if (templateName === "job") {
      if (data.spicification && Array.isArray(data.spicification)) {
        let sal1 = data.spicification.find(
          (obj) => obj.slug === "minimum_salary"
        );
        minSal = sal1 ? sal1.value : minSal;
        let sal2 = data.spicification.find(
          (obj) => obj.slug === "maximum_salary"
        );
        maxSal = sal2 ? sal2.value : maxSal;
      }
    }
    return (
      <Col className="gutter-row" md={6}>
        <Card
          bordered={false}
          className={"detail-card"}
          cover={
            <Link to={path}>
              {extraTag ? (
                <div className={`card-tag ${style}`}>
                  <strong>{extraTag}</strong>
                </div>
              ) : (
                ""
              )}
              <img
                src={image ? image : DEFAULT_IMAGE_CARD}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE_CARD;
                }}
                //onClick={() => this.selectTemplateRoute(data)}
                style={{ cursor: "pointer" }}
                alt={data && data.title !== undefined ? data.title : ""}
              />
            </Link>
          }
          actions={[
            // <Link to={path}>
            <Icon
              icon={
                templatename === TEMPLATE.GENERAL ||
                templatename === TEMPLATE.JOB ||
                templatename === TEMPLATE.REALESTATE
                  ? "email"
                  : "cart"
              }
              size="20"
              onClick={() => this.contactModal(data)}
              //onClick={() => this.selectTemplateRoute(data)}
            />,
            // </Link>
            <Icon
              icon={is_favourite ? "wishlist-fill" : "wishlist"}
              className={is_favourite ? "active" : ""}
              size="20"
              onClick={() => this.onSelection(data)}
            />,
            <Popover
              title={
                data && data.count !== undefined
                  ? `Total Views :  ${data.count ? data.count : "0"}`
                  : `Total Views : ${
                      data && data.views !== undefined ? data.views : "0"
                    }`
              }
            >
              <Icon icon="view" size="20" />
            </Popover>,
          ]}
        >
          <Link to={path}>
            <div
              className="price-box"
              align="middle"
              onClick={() => this.selectTemplateRoute(data)}
              style={{ cursor: "pointer" }}
            >
              {retail && (
                <div className="rate-section">
                  {rate ? this.renderRate(rate) : "No reviews yet"}
                </div>
              )}
              {/* {!retail && <div className="rate-section"></div>} */}
              <div className="price">
                {templateName === "job" ? (
                  `AU$${salaryNumberFormate(
                    parseInt(minSal)
                  )}-AU$${salaryNumberFormate(parseInt(maxSal))}`
                ) : !data.is_ad_free && !data.is_sold ? (
                  `AU$${salaryNumberFormate(parseInt(data.price))}`
                ) : (
                  <div className="no-price">Free</div>
                )}
                {data.is_ad_free ? "Free" : ""}
                {data.is_sold === 1 ? "Sold" : ""}
              </div>
            </div>
          </Link>
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
          <Link to={path}>
            <div
              className="category-box"
              //onClick={() => this.selectTemplateRoute(data)}
              style={{ cursor: "pointer" }}
            >
              <div className="category-name">
                {data && data.catname !== undefined ? data.catname : ""}
              </div>
              <div className="location-name">
                {data.cityname && data.cityname !== "N/A" && (
                  <Icon icon="location" size="15" className="mr-5" />
                )}
                {/* {data.cityname && data.cityname !== 'N/A' ? data.cityname : ''} */}
                {cityname}
              </div>
            </div>
          </Link>
          {data.tagIcon && (
            <div
              className="tag-icon"
              style={{ backgroundColor: `${data.tagIconColor}` }}
            >
              {data.tagIcon}
            </div>
          )}
        </Card>
        {/* {redirect && <Redirect push 
                    to={{
                        pathname: redirect,
                        target:"_blank"
                    }}
                />
                } */}
        {visible && (
          <ContactModal
            visible={visible}
            onCancel={() => this.setState({ visible: false })}
            classifiedDetail={data}
            receiverId={data.classified_users ? data.classified_users.id : ""}
            classifiedid={data.classifiedid}
          />
        )}
        {openCartModel && (
          <CartModel
            visible={openCartModel}
            onCancel={() => this.setState({ openCartModel: false })}
            title={data ? data.title : ""}
            price={data ? data.price : ""}
            image={
              data && data.imageurl !== undefined && data.imageurl !== null
                ? data.imageurl
                : DEFAULT_IMAGE_CARD
            }
          />
        )}
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
  addToCartAPI,
  removeToRetailWishlist,
  addToRetailWishList,
  enableLoading,
  disableLoading,
  openLoginModel,
  setFavoriteItemId,
  addToWishList,
  removeToWishList,
})(withRouter(DetailCard));
