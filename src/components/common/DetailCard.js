import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { Card, Col, Row, Rate, Popover } from "antd";
import Icon from "../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../config/Config";
import { STATUS_CODES } from "../../config/StatusCode";
import {
  addToCartAPI,
  addToFavorite,
  removeToFavorite,
  addToWishList,
  removeToWishList,
  openLoginModel,
  setFavoriteItemId,
} from "../../actions/index";
import NoContentFound from "../common/NoContentFound";
import {
  getClassifiedDetailPageRoute,
  getRetailDetailPageRoute,
} from "../../common/getRoutes";
import { langs } from "../../config/localization";
import { rating } from "../classified-templates/CommanMethod";
import { MESSAGES } from "../../config/Message";
import { capitalizeFirstLetter, salaryNumberFormate } from "../common";
import ContactModal from "../classified-templates/common/modals/ContactModal";
import CartModel from "../retail/retail-cart/CartModel";

class DetailCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      openCartModel: false,
    };
  }

  /**
   * @method onSelection
   * @description mark favorite and unfavorite
   */
  onSelection = (data) => {
    const {
      booking,
      isLoggedIn,
      loggedInDetail,
      newInBooking,
      flag,
    } = this.props;
    const wishlist =
      newInBooking === undefined
        ? data[flag.wishlist]
        : data[newInBooking.is_favourite];
    if (isLoggedIn) {
      if (wishlist === 1) {
        let requestData = {};
        if (newInBooking !== undefined || booking) {
          requestData = {
            user_id: loggedInDetail.id,
            item_id: data.id,
          };
          this.props.removeToFavorite(requestData, (res) => {
            if (res.status === STATUS_CODES.OK) {
              // toastr.success('Success',res.data.message)
              toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
              this.props.callNext();
            }
          });
        } else {
          requestData = {
            user_id: loggedInDetail.id,
            classifiedid: data.classifiedid ? data.classifiedid : data.id,
          };
          this.props.removeToWishList(requestData, (res) => {
            if (res.status === STATUS_CODES.OK) {
              // toastr.success('Success',res.data.msg)
              toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
              this.props.callNext();
            }
          });
        }
      } else if (wishlist === 0) {
        let requestData = {};
        if (newInBooking !== undefined || booking) {
          requestData = {
            user_id: loggedInDetail.id,
            item_type: "trader",
            item_id:
              newInBooking && data[newInBooking.id]
                ? data[newInBooking.id]
                : data.id,
            category_id:
              data.trader_profile && data.trader_profile.booking_cat_id
                ? data.trader_profile.booking_cat_id
                : data.booking_cat_id,
            sub_category_id:
              data.trader_profile && data.trader_profile.booking_sub_cat_id
                ? data.trader_profile.booking_sub_cat_id
                : data.booking_sub_cat_id,
          };

          this.props.addToFavorite(requestData, (res) => {
            this.setState({ flag: !this.state.flag });
            if (res.status === STATUS_CODES.OK) {
              // toastr.success('Success',res.data.message)
              toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS);
              this.props.callNext();
            }
          });
        } else {
          requestData = {
            user_id: loggedInDetail.id,
            classifiedid: data.classifiedid ? data.classifiedid : data.id,
          };
          this.props.addToWishList(requestData, (res) => {
            this.setState({ flag: !this.state.flag });
            if (res.status === STATUS_CODES.OK) {
              // toastr.success('Success',res.data.msg)
              toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS);
              this.props.callNext();
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
    const { retail } = this.props;
    let cat_id = el.id;
    let catName = el.catname;
    let classifiedId = el.classifiedid ? el.classifiedid : el.parent_categoryid;
    let templateName = el.template_slug;
    if (this.props.destructuredKey !== undefined) {
      cat_id = el[this.props.destructuredKey.catIdkey];
      classifiedId = el[this.props.destructuredKey.subCatIdKey];
    }
    let path = "";
    if (el.retail === "retail" || retail) {
      console.log("retail2", retail);
      path = getRetailDetailPageRoute(cat_id, catName, classifiedId);
      this.setState({ redirect: path });
    } else {
      console.log("retail1", retail);
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
    }
    // window.open(path, "_blank")
  };

  /**
   * @method renderCards
   * @description render cards detail
   */
  renderCards = (topData) => {
    const { visible } = this.state;
    const {
      newInBooking,
      flag,
      destructuredKey,
      isClassified,
      isBooking,
    } = this.props;
    if (topData && topData.length) {
      return topData.map((data, i) => {
        const wishlist =
          newInBooking === undefined
            ? data && data[flag.wishlist]
            : data && data[newInBooking.is_favourite];
        let templatename =
          data && data.template_slug ? data && data.template_slug : "";
        let rate = data && data.reviews && rating(data.reviews);
        let image =
          templatename === TEMPLATE.JOB
            ? data.company_logo
            : data && data.imageurl !== undefined && data.imageurl !== null
            ? data.imageurl
            : DEFAULT_IMAGE_CARD;
        if (data) {
          const { retail } = this.props;
          let cat_id = data.id;
          let catName = data.catname;
          let classifiedId = data.classifiedid
            ? data.classifiedid
            : data.parent_categoryid;
          let templateName = data.template_slug;
          if (this.props.destructuredKey !== undefined) {
            cat_id = data[this.props.destructuredKey.catIdkey];
            classifiedId = data[this.props.destructuredKey.subCatIdKey];
          }
          let path = "";
          if (data.retail === "retail" || retail) {
            console.log("retail2", retail);
            path = getRetailDetailPageRoute(cat_id, catName, classifiedId);
          } else {
            console.log("retail1", retail);
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
            } else if (templateName === "booking") {
              path = `/bookings-detail/${catName}/${data.booking_cat_id}/${data.user_id}`;
            }
          }
          let average_rating = "";
          // rating
          // if (isClassified !== undefined) {
          //   average_rating = rate;
          // } else
          if (data.booking) {
            let temp =
              data.average_rating &&
              Array.isArray(data.average_rating) &&
              data.average_rating.length
                ? data.average_rating[0].rating
                : "";
            average_rating = temp;
          } else if (isClassified === undefined && isBooking === undefined) {
            average_rating =
              data.reviews_avg && data.reviews_avg.average_rating;
          } else if (isBooking !== undefined && isBooking) {
            average_rating = data.average_rating;
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
                  newInBooking === undefined ? (
                    <Link to={path}>
                      {extraTag ? (
                        <div className={`card-tag mt-30 ${style}`}>
                          <strong>{extraTag}</strong>
                        </div>
                      ) : (
                        ""
                      )}
                      <img
                        //onClick={() => this.selectTemplateRoute(data)}
                        style={{ cursor: "pointer" }}
                        // src={data.imageurl ? data.imageurl : DEFAULT_IMAGE_CARD}
                        src={image ? image : DEFAULT_IMAGE_CARD}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE_CARD;
                        }}
                        alt={data.title ? data.title : ""}
                      />
                    </Link>
                  ) : (
                    <Link to={path}>
                      <img
                        src={
                          data[newInBooking.image]
                            ? data[newInBooking.image]
                            : DEFAULT_IMAGE_CARD
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE_CARD;
                        }}
                        alt={data.title ? data.title : ""}
                      />
                    </Link>
                  )
                }
                actions={[
                  // <Link to={path}>
                  <Icon
                    icon={
                      data.retail === undefined &&
                      (templatename === TEMPLATE.GENERAL ||
                        templatename === TEMPLATE.JOB ||
                        templatename === TEMPLATE.REALESTATE)
                        ? "email"
                        : "cart"
                    }
                    size="20"
                    onClick={() => this.contactModal(data)}
                    //onClick={() => this.selectTemplateRoute(data)}
                  />,
                  // </Link>
                  <Icon
                    icon="wishlist"
                    className={wishlist === 1 ? "active" : ""}
                    //className='active'
                    size="20"
                    onClick={() => this.onSelection(data)}
                  />,
                  <Popover
                    title={
                      data.count
                        ? `Total Views :  ${data.count ? data.count : "0"}`
                        : `Total Views : ${data.views ? data.views : "0"}`
                    }
                  >
                    <Icon icon="view" size="20" />
                  </Popover>,
                ]}
              >
                <Link to={path}>
                  <div
                    className="price-box"
                    //onClick={() => this.selectTemplateRoute(data)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* <div className="rate-section">
                      {average_rating 
                        ? `${parseInt(average_rating)}.0`
                        : "No review yet"}
                      {average_rating && (
                        <Rate
                          disabled
                          defaultValue={
                            average_rating ? parseInt(average_rating) : ""
                          }
                        />
                      )}
                    </div> */}
                    {newInBooking !== undefined ? (
                      <div className="price">
                        {data.trader_profile[newInBooking.rate_per_hour] ? (
                          `AU$${salaryNumberFormate(
                            data.trader_profile[newInBooking.rate_per_hour]
                          )}`
                        ) : (
                          <div className="no-price">Free</div>
                        )}
                      </div>
                    ) : (
                      <div className="price">
                        {templateName === "job" ? (
                          `AU$${salaryNumberFormate(
                            parseInt(minSal)
                          )}-AU$${salaryNumberFormate(parseInt(maxSal))}`
                        ) : !data.is_sold && data.price ? (
                          `AU$${salaryNumberFormate(parseInt(data.price))}`
                        ) : !data.is_sold && data.rate_per_hour ? (
                          `AU$${salaryNumberFormate(data.rate_per_hour)}`
                        ) : (
                          <div className="no-price">Free</div>
                        )}
                        {/*{!data.is_sold && data.price
                          ? `AU$${salaryNumberFormate(data.price)}`
                          : !data.is_sold && data.rate_per_hour
                          ? `AU$${salaryNumberFormate(data.rate_per_hour)}`
                        : ""}*/}
                        {data.is_sold === 1 ? "Sold" : ""}
                      </div>
                    )}
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
                    {newInBooking === undefined
                      ? data.title
                        ? capitalizeFirstLetter(data.title)
                        : ""
                      : data.trader_profile.title
                      ? capitalizeFirstLetter(data.trader_profile.title)
                      : ""}
                  </div>
                </Link>
                <Link to={path}>
                  <div
                    className="category-box"
                    //onClick={() => this.selectTemplateRoute(data)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="category-name"
                      style={{ color: `${data.tagIconColor}` }}
                    >
                      {destructuredKey !== undefined
                        ? data[destructuredKey.catname]
                        : ""}
                      {data.catname
                        ? capitalizeFirstLetter(data.catname)
                        : data.categoryName
                        ? capitalizeFirstLetter(data.categoryName)
                        : ""}
                    </div>
                    {newInBooking === undefined ? (
                      <div className="location-name">
                        {data.cityname && data.cityname !== "N/A" && (
                          <Icon icon="location" size="15" className="mr-5" />
                        )}
                        {data.cityname && data.cityname !== "N/A"
                          ? data.cityname
                          : ""}
                      </div>
                    ) : (
                      <div className="location-name">
                        {data[newInBooking.business_location] !== "N/A" && (
                          <Icon icon="location" size="15" className="mr-5" />
                        )}
                        {data[newInBooking.business_location] !== "N/A"
                          ? data[newInBooking.business_location]
                          : ""}
                      </div>
                    )}
                  </div>
                </Link>
                {data.tagIcon && (
                  <Link to={path}>
                    <div
                      className="tag-icon"
                      style={{ backgroundColor: `${data.tagIconColor}` }}
                    >
                      {data.tagIcon}
                    </div>
                  </Link>
                )}
              </Card>
            </Col>
          );
        }
      });
    }
  };

  /**
   * @method contactModal
   * @description contact model
   */
  contactModal = (data) => {
    const { retail, loggedInDetail, isLoggedIn } = this.props;
    if (isLoggedIn) {
      if (data.retail === "retail" || retail) {
        console.log(data.quantity);
        if (data.quantity) {
          let requestData = {
            ship_cost: 0,
            available_qty: data.quantity,
            qty: 1,
            classified_id: data.id,
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
      } else if (data.booking) {
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
    const { topData } = this.props;
    const { redirect, visible, openCartModel } = this.state;
    let temp =
      topData &&
      topData.length &&
      topData.filter((el) => el.template_slug === "general");
    let classified_detail = temp && temp.length ? temp[0] : "";

    let temp2 =
      topData &&
      topData.length &&
      topData.filter((el) => el.template_slug === "retail");
    let retail_detail = temp2 && temp2.length ? temp2[0] : "";

    return (
      <div>
        {topData && topData.length ? (
          <Fragment>
            <Row gutter={[25, 25]}> {this.renderCards(topData)}</Row>
            {/* {redirect && <Redirect push
            to={{
              pathname: redirect
            }}
          />
          } */}
            {visible && classified_detail && (
              <ContactModal
                visible={visible}
                onCancel={() => this.setState({ visible: false })}
                classifiedDetail={classified_detail}
                receiverId={
                  classified_detail.classified_users
                    ? classified_detail.classified_users.id
                    : ""
                }
                classifiedid={classified_detail.id}
              />
            )}
            {openCartModel && retail_detail && (
              <CartModel
                visible={openCartModel}
                onCancel={() => this.setState({ openCartModel: false })}
                title={retail_detail ? retail_detail.title : ""}
                price={retail_detail ? retail_detail.price : ""}
                image={
                  retail_detail &&
                  retail_detail.imageurl !== undefined &&
                  retail_detail.imageurl !== null
                    ? retail_detail.imageurl
                    : DEFAULT_IMAGE_CARD
                }
              />
            )}
          </Fragment>
        ) : (
          <NoContentFound />
        )}
      </div>
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
  addToWishList,
  removeToWishList,
  openLoginModel,
  setFavoriteItemId,
  removeToFavorite,
  addToFavorite,
})(DetailCard);
