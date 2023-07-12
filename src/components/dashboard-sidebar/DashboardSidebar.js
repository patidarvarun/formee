import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Layout, Menu, Typography, Avatar, Badge } from "antd";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { getClassifiedCatLandingRoute } from "../../common/getRoutes";
import { DEFAULT_IMAGE_TYPE } from "../../config/Config";
import { TEMPLATE, DEFAULT_ICON } from "../../config/Config";
import { DASHBOARD_KEYS } from "../../config/Constant";
import { logout, getClassfiedCategoryListing } from "../../actions/index";
import { langs } from "../../config/localization";
import { RightOutlined } from "@ant-design/icons";
import Icon from "../../components/customIcons/customIcons";
import Back from "../common/Back";
import { converInUpperCase } from "../common";
const { Sider } = Layout;
const { Text, Paragraph } = Typography;
const { SubMenu } = Menu;
class DashboardSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false,
      redirectPath: "",
    };
  }

  /**
   * @method Logout User
   * @description Logout the user & clear the Session
   */
  logout = () => {
    this.props.logout();
    toastr.success(langs.success, langs.messages.logout_success);
    window.location.assign("/");
  };

  /**
   * @method selectTemplateRoute
   * @description select tempalte route dynamically
   */
  selectTemplateRoute = (el) => {
    let reqData = {
      id: el.id,
      page: 1,
      page_size: 10,
    };
    this.props.getClassfiedCategoryListing(reqData, (res) => {
      if (Array.isArray(res.data.data) && res.data.data.length) {
        let templateName = res.data.data[0].template_slug;
        let cat_id = res.data.data[0].id;

        if (templateName === TEMPLATE.GENERAL) {
          this.setState({
            isRedirect: true,
            redirectPath: `/classifieds/${TEMPLATE.GENERAL}/${el.name}/${cat_id}`,
          });
        } else if (templateName === TEMPLATE.JOB) {
          let route = getClassifiedCatLandingRoute(
            TEMPLATE.JOB,
            cat_id,
            el.name
          );
          this.setState({ isRedirect: true, redirectPath: route });
        } else if (templateName === TEMPLATE.REALESTATE) {
          this.setState({
            isRedirect: true,
            redirectPath: `/classifieds/${TEMPLATE.REALESTATE}/${cat_id}`,
          });
        }
      } else {
        toastr.warning(langs.warning, langs.messages.classified_list_not_found);
      }
    });
  };

  /**
   * @method Logout User
   * @description Logout the user & clear the Session
   */
  renderIcons = () => {
    const { isLoggedIn, classifiedCategoryList, activeCategoryId } = this.props;
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAA", isLoggedIn);
    return classifiedCategoryList.map((el) => {
      let iconUrl = `${this.props.iconUrl}${el.id}/${el.icon}`;
      return (
        <Menu.Item
          key={el.id}
          className={el.id == activeCategoryId ? "menu-active" : ""}
        >
          <img
            onClick={() => this.selectTemplateRoute(el)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_ICON;
            }}
            src={iconUrl}
            alt="Home"
            width="30"
            className={"stroke-color"}
          />
        </Menu.Item>
      );
    });
  };

  /**
   * @method Logout User
   * @description Logout the user & clear the Session
   */
  navigateUser = () => {
    const { isPrivateUser, loggedInUser } = this.props;
    let tmp = "/myProfile";
    // loggedInUser.role_slug == 'private'
    if (!isPrivateUser) {
      if (
        loggedInUser.user_type === "business" &&
        loggedInUser.role_slug !== langs.key.merchant
      ) {
        tmp = "/business-profile";
      } else {
        tmp = "/vendor-profile";
      }
    } else {
      tmp = "/myProfile";
    }
    return tmp;
  };

  /**
   * @method getMyStyle
   * @description getMyStyle
   */
  getMyStyle = (key) => {
    console.log(key,"key")
    const { activeTabKey = "" } = this.props;
    console.log(activeTabKey,"active key")
    return activeTabKey === key ? "menu-active" : "";
  };

  /**
   * @method getSidebarTheme
   * @description getSidebarTheme
   */
  getSidebarTheme = (key) => {
    return [
      "trader",
      "handyman",
      "events",
      "restaurant",
      "beauty",
      "wellbeing",
      "fitness",
    ].includes(key)
      ? " vendor-user-sidebar"
      : " normal-user-sidebar";
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      activeTabKey = DASHBOARD_KEYS.DASH_BOARD,
      isPrivateUser,
      isLoggedIn,
      activeCategoryId,
      userProfile,
      loggedInUser,
    } = this.props;
    const { isRedirect, redirectPath } = this.state;
    let loggedInAsPrivateuser = isLoggedIn && !isPrivateUser;
    let realStateVendor =
      loggedInUser.user_type === langs.key.business &&
      loggedInUser.role_slug === langs.key.real_estate;
    let showDeals =
      loggedInUser.user_type === langs.userType.fitness ||
      loggedInUser.user_type === langs.userType.beauty ||
      loggedInUser.user_type === langs.userType.wellbeing;
    let showPackages =
      loggedInUser.user_type === langs.userType.wellbeing ||
      loggedInUser.user_type === langs.userType.beauty;
    let restaurant = loggedInUser.user_type === langs.key.restaurant;
    let merchant = loggedInUser.role_slug === langs.key.merchant;
    let is_classified =
      loggedInUser.role_slug === langs.key.real_estate ||
      loggedInUser.role_slug === langs.key.job ||
      loggedInUser.role_slug === langs.key.car_dealer;
    return (
      <Sider
        width={260}
        className={"site-layout-background dashboard-sidebar".concat(
          this.getSidebarTheme(loggedInUser.user_type)
        )}
      >
        <div className="dashboard-sidebar-menu-hover dashboard-sidebar-menu-hover-profile pt-140 pb-50">
          <div className="menu-top-item">
            {/* <div
              className="avatar-box"
              onClick={() => {
                this.navigateUser();
              }}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                size={46}
                src={
                  userProfile !== null && userProfile.image
                    ? userProfile.image
                    : DEFAULT_IMAGE_TYPE
                }
              />
              <Paragraph className="text-blue text-orange fs-13 mt-5">
                {userProfile && converInUpperCase(userProfile.name)}
              </Paragraph>
            </div> */}

            <Menu
              mode="inline"
              // defaultOpenKeys={['sub1']}
              defaultOpenKeys={
                activeTabKey == DASHBOARD_KEYS.PAYMENTS ? ["payment"] : []
              }
              selectedKeys={[activeCategoryId]}
              //  defaultSelectedKeys={['g1']}
            >
              {/* {this.renderIcons()} */}
              <Menu.Item
                key={DASHBOARD_KEYS.MY_PROFILE}
                title="Dashboard"
                className={this.getMyStyle(DASHBOARD_KEYS.MY_PROFILE)}
                icon={
                  <span className="icon-span">
                    <img
                      src={require("./icons/profile.svg")}
                      alt=""
                      width="18"
                    />
                  </span>
                }
              >
                <Link to={this.navigateUser()}>
                  <span className={"menu-item-text myprofile"}>My Profile</span>
                </Link>
              </Menu.Item>

              <Menu.Item
                key={DASHBOARD_KEYS.DASH_BOARD}
                title="Dashboard"
                className={this.getMyStyle(DASHBOARD_KEYS.DASH_BOARD)}
                icon={
                  <img
                    src={require("./icons/dashboard.png")}
                    alt=""
                    width="18"
                  />
                }
              >
                <Link to="/dashboard">
                  <span className={"menu-item-text"}>Dashboard</span>
                </Link>
              </Menu.Item>
              {/* {!loggedInAsPrivateuser && !restaurant && ( */}
              <Menu.Item
                key={DASHBOARD_KEYS.NOTIFICATIONS}
                className={this.getMyStyle(DASHBOARD_KEYS.NOTIFICATIONS)}
                title="Notification"
                icon={
                  <Badge dot>
                    <img
                      src={require("./icons/notification.svg")}
                      alt=""
                      width="16"
                    />
                  </Badge>
                }
              >
                <Link to="/notifications">
                  {/* <Link to="#"> */}{" "}
                  <span className={"menu-item-text"}>Notification</span>
                </Link>
              </Menu.Item>
              {/* )} */}
              <Menu.Item
                key={DASHBOARD_KEYS.MESSAGES}
                title="Message"
                className={this.getMyStyle(DASHBOARD_KEYS.MESSAGES)}
                icon={
                  <Link to="/message">
                    <img
                      src={require("./icons/message.png")}
                      alt=""
                      width="16"
                    />
                  </Link>
                }
              >
                <Link to="/message">
                  <span className={"menu-item-text"}>Messages</span>
                </Link>
              </Menu.Item>

              {!is_classified && (
                <Menu.Item
                  key={DASHBOARD_KEYS.REVIEWS}
                  title="Reviews"
                  className={this.getMyStyle(DASHBOARD_KEYS.REVIEWS)}
                  icon={
                    <Link to="/reviews">
                      <img
                        src={require("./icons/review.svg")}
                        alt=""
                        width="18"
                      />
                    </Link>
                  }
                >
                  <Link to="/reviews">
                    <span className={"menu-item-text"}>Reviews</span>
                  </Link>
                </Menu.Item>
              )}

              {loggedInUser &&
                (loggedInUser.user_type === langs.key.business ||
                  merchant ||
                  !loggedInAsPrivateuser) && (
                  <Menu.Item
                    key={DASHBOARD_KEYS.MYADS}
                    title="Ad Management"
                    className={this.getMyStyle(DASHBOARD_KEYS.MYADS)}
                    icon={
                      <img
                        src={require("./icons/list.png")}
                        alt=""
                        width="16"
                      />
                    }
                  >
                    <Link to="/my-ads">
                      {" "}
                      <span className={"menu-item-text"}>Ad Management</span>
                    </Link>
                  </Menu.Item>
                )}

              {loggedInUser &&
                (loggedInUser.user_type === langs.key.business || merchant) && (
                  // <Menu.Item
                  //   key={DASHBOARD_KEYS.PAYMENTS}
                  //   title="Payments"
                  //   icon={
                  //     <img
                  //       src={require("./icons/payment.svg")}
                  //       alt=""
                  //       width="18"
                  //     />
                  //   }
                  // >
                  //   <Link to="/payment-methods">
                  //     {" "}
                  //     <span className={"menu-item-text"}>Payments</span>
                  //   </Link>
                  // </Menu.Item>
                  <SubMenu
                    key={DASHBOARD_KEYS.PAYMENTS}
                    key="payment"
                    title="Payment"
                    className={"menu-item-text"}
                    icon={
                      <img
                        src={require("./icons/payment.svg")}
                        alt=""
                        width="18"
                      />
                    }
                  >
                    <Menu.ItemGroup key="g1">
                      <Menu.Item
                        key={"g1"}
                        className={this.getMyStyle(DASHBOARD_KEYS.PAYMENTS)}
                      >
                        {" "}
                        <Link to="/payment-methods">
                          {" "}
                          <span className={"menu-item-text"}>
                            <RightOutlined /> Payment Methods
                          </span>
                        </Link>
                      </Menu.Item>
                      <Menu.Item key="2">
                        {" "}
                        <Link to="/payment-methods">
                          {" "}
                          <span className={"menu-item-text"}>
                            <RightOutlined /> Transactions
                          </span>
                        </Link>
                      </Menu.Item>
                    </Menu.ItemGroup>
                  </SubMenu>
                )}

              {/* {loggedInUser &&
                loggedInUser.user_type === langs.userType.wellbeing && (
                  <Menu.Item
                    key={DASHBOARD_KEYS.SPA_CALENDER}
                    className={this.getMyStyle(DASHBOARD_KEYS.SPA_CALENDER)}
                    title="Calender"
                    icon={
                      <img
                        src={require("./icons/calendar-small.svg")}
                        alt=""
                        width="18"
                      />
                    }
                  >
                    <Link to="/spa-my-bookings-calender">
                      {" "}
                      <span className={"menu-item-text"}>Calender</span>
                    </Link>
                  </Menu.Item>
                )}
              {loggedInUser &&
                loggedInUser.user_type === langs.userType.beauty && (
                  <Menu.Item
                    key={DASHBOARD_KEYS.BEAUTY_CALENDER}
                    className={this.getMyStyle(DASHBOARD_KEYS.BEAUTY_CALENDER)}
                    title="Calender"
                    icon={
                      <img
                        src={require("./icons/calendar-small.svg")}
                        alt=""
                        width="18"
                      />
                    }
                  >
                    <Link to="/beauty-my-bookings-calender">
                      {" "}
                      <span className={"menu-item-text"}>Calender</span>
                    </Link>
                  </Menu.Item>
                )} */}
              {/* {loggedInUser &&
                loggedInUser.user_type === langs.userType.fitness && (
                  <Menu.Item
                    key={DASHBOARD_KEYS.FITNESS}
                    className={this.getMyStyle(DASHBOARD_KEYS.FITNESS)}
                    title="Calender"
                    icon={
                      <img
                        src={require("./icons/calendar-small.svg")}
                        alt=""
                        width="18"
                      />
                    }
                  >
                    <Link to="/fitness-vendor-mycalendar">
                      {" "}
                      <span className={"menu-item-text"}>Calender</span>
                    </Link>
                  </Menu.Item>
                  )}*/}
              {/* {restaurant && ( 
                <Menu.Item
                  key={4}
                  title="Calender"
                  icon={
                    <Link to="/">
                      <img
                        src={require("./icons/calendar-small.svg")}
                        alt=""
                        width="18"
                      />
                    </Link>
                  }
                >
                  <Link to="/">
                    <span className={"menu-item-text"}>Calender</span>
                  </Link>
                </Menu.Item>
              )} */}
              {!loggedInAsPrivateuser && !restaurant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.WISHLISTS}
                  className={this.getMyStyle(DASHBOARD_KEYS.WISHLISTS)}
                  title="Wishlist"
                  icon={
                    <img
                      src={require("./icons/wishlist.png")}
                      alt=""
                      width="18"
                    />
                  }
                >
                  <Link to="/wishlist">
                    {" "}
                    <span className={"menu-item-text"}>Wishlist</span>
                  </Link>
                </Menu.Item>
              )}
              <Menu.Divider />
              {loggedInUser && loggedInUser.role_slug === langs.key.job && (
                <Menu.Item
                  key={DASHBOARD_KEYS.JOB_APPLICATION}
                  title="Ad Management"
                  className={this.getMyStyle(DASHBOARD_KEYS.JOB_APPLICATION)}
                  icon={
                    <img
                      src={require("./icons/job-applcations.svg")}
                      alt=""
                      width="16"
                    />
                  }
                >
                  <Link to="/job-applications">
                    {" "}
                    <span className={"menu-item-text"}>job Applications</span>
                  </Link>
                </Menu.Item>
              )}
              {!loggedInAsPrivateuser && !restaurant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.CART}
                  title="Cart"
                  icon={
                    <img src={require("./icons/cart.png")} alt="" width="18" />
                  }
                >
                  <Link to="/cart">
                    <span className={"menu-item-text"}>Cart</span>
                  </Link>
                </Menu.Item>
              )}
              {!loggedInAsPrivateuser && !restaurant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.BOOKINGS}
                  title="Bookings"
                  icon={
                    <img src={require("./icons/cart.svg")} alt="" width="18" />
                  }
                >
                  <Link to="/my-bookings">
                    <span className={"menu-item-text"}>Bookings</span>
                  </Link>
                </Menu.Item>
              )}
              {!loggedInAsPrivateuser && !restaurant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.ORDERS}
                  title="Orders"
                  icon={
                    <img
                      src={require("./icons/calendar1.svg")}
                      alt=""
                      width="18"
                    />
                  }
                >
                  <Link to="/my-orders/restaurant">
                    <span className={"menu-item-text"}>Orders</span>
                  </Link>
                </Menu.Item>
              )}
              {realStateVendor && (
                <Menu.Item
                  key={DASHBOARD_KEYS.INSPECTION}
                  title="Inspections"
                  icon={
                    <img
                      src={require("./icons/inspections.svg")}
                      alt="inspections"
                      width="16"
                    />
                  }
                >
                  <Link to="/inspection">
                    <span className={"menu-item-text"}>Inspections</span>{" "}
                  </Link>
                </Menu.Item>
              )}

              {loggedInUser.user_type === langs.userType.beauty && (
                <Menu.Item
                  key={DASHBOARD_KEYS.BEAUTY_SERVICES}
                  title="Services"
                  icon={
                    <img src={require("./icons/list.png")} alt="" width="18" />
                  }
                >
                  <Link to="/services">
                    <span className={"menu-item-text"}>My Services</span>
                  </Link>
                </Menu.Item>
              )}

              {/* retail received orders */}
              {loggedInUser.role_slug === langs.key.merchant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.RETAIL_ORDERS}
                  title="Orders"
                  icon={
                    <img
                      src={require("./icons/calendar1.svg")}
                      alt=""
                      width="18"
                    />
                  }
                >
                  <Link to="/received-orders">
                    <span className={"menu-item-text"}>My Orders</span>
                  </Link>
                </Menu.Item>
              )}
              {loggedInUser.role_slug === langs.key.merchant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.RETAIL_TRANSACTION}
                  title="Orders"
                  icon={
                    <img
                      src={require("./icons/transaction-inactive.png")}
                      alt=""
                      width="20"
                    />
                  }
                >
                  <Link to="/transaction">
                    <span className={"menu-item-text"}>Transaction</span>
                  </Link>
                </Menu.Item>
              )}

              {loggedInUser.user_type === langs.userType.wellbeing && (
                <Menu.Item
                  key={DASHBOARD_KEYS.SPA_SERVICES}
                  title="Services"
                  icon={
                    <img src={require("./icons/list.png")} alt="" width="18" />
                  }
                >
                  <Link to="/vendor-services">
                    <span className={"menu-item-text"}>Services</span>
                  </Link>
                </Menu.Item>
              )}
              {loggedInUser.user_type === langs.key.restaurant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.RESTAURANT_ORDERS}
                  title="My Orders"
                  icon={
                    <img
                      src={require("./icons/myorder.svg")}
                      alt=""
                      width="18"
                    />
                  }
                >
                  <Link to="/restaurant-my-orders">
                    <span className={"menu-item-text"}>My Orders</span>
                  </Link>
                </Menu.Item>
              )}
              {loggedInUser.user_type === langs.key.restaurant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.RESTAURANT_ORDERS}
                  title="My Orders"
                  icon={
                    <img
                      src={require("./icons/ordertracker.svg")}
                      alt=""
                      width="14"
                    />
                  }
                >
                  <Link to="/order-tracking">
                    <span className={"menu-item-text"}>Order Tracker</span>
                  </Link>
                </Menu.Item>
              )}
              {/* <Menu.Divider /> */}
              {loggedInUser.user_type === langs.key.restaurant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.RESTAURANT_MENUES}
                  title="My Menues"
                  icon={
                    <img src={require("./icons/list.png")} alt="" width="18" />
                  }
                >
                  <Link to="/my-menu">
                    <span className={"menu-item-text"}>My Menu</span>
                  </Link>
                </Menu.Item>
              )}
              {loggedInUser.user_type === langs.userType.fitness && (
                <Menu.Item
                  key={DASHBOARD_KEYS.MANAGE_CLASSES}
                  className={this.getMyStyle(DASHBOARD_KEYS.MANAGE_CLASSES)}
                  title="Services"
                  icon={
                    <img src={require("./icons/list.png")} alt="" width="18" />
                  }
                >
                  <Link to="/fitness-vendor-manage-classes">
                    <span className={"menu-item-text"}>Classes</span>
                  </Link>
                </Menu.Item>
              )}
              {/* {merchant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.DAILY_DEALS}
                  className={this.getMyStyle(DASHBOARD_KEYS.DAILY_DEALS)}
                  title="Services"
                  icon={
                    <img
                      src={require("./icons/dailydeals.svg")}
                      alt=""
                      width="18"
                    />
                  }
                >
                  <Link to="/my-deals">
                    <span className={"menu-item-text"}>Daily Deals</span>
                  </Link>
                </Menu.Item>
              )} */}
              {(showDeals ||
                loggedInUser.user_type === langs.key.restaurant) && (
                <Menu.Item
                  key={DASHBOARD_KEYS.DAILY_DEALS}
                  className={this.getMyStyle(DASHBOARD_KEYS.DAILY_DEALS)}
                  title="Services"
                  icon={
                    <img src={require("./icons/deals.svg")} alt="" width="20" />
                  }
                >
                  <Link to="/my-deals">
                    <span className={"menu-item-text"}>
                      {loggedInUser.user_type === langs.key.restaurant
                        ? "Deals"
                        : "Deals"}
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {(showDeals ||
                loggedInUser.user_type === langs.key.restaurant) && (
                <Menu.Item
                  key={7}
                  title="Services"
                  key={DASHBOARD_KEYS.PROMOTIONS}
                  className={this.getMyStyle(DASHBOARD_KEYS.PROMOTIONS)}
                  icon={
                    <img
                      src={require("./icons/pramotion.svg")}
                      alt=""
                      width="18"
                    />
                  }
                >
                  <Link to="/my-promotions">
                    <span className={"menu-item-text"}>Promotions</span>
                  </Link>
                </Menu.Item>
              )}
              {/* {loggedInUser.user_type === langs.key.restaurant && (
                <Menu.Item
                  key={DASHBOARD_KEYS.SPECIAL_OFFER}
                  className={this.getMyStyle(DASHBOARD_KEYS.SPECIAL_OFFER)}
                  title="Services"
                  icon={
                    <img src={require("./icons/deal.png")} alt="" width="18" />
                  }
                >
                  <Link to="/my-offers">
                    <span className={"menu-item-text"}>Special Offers</span>
                  </Link>
                </Menu.Item>
              )} */}
              {loggedInUser.role_slug === langs.key.car_dealer && (
                <Menu.Item
                  key={DASHBOARD_KEYS.MY_OFFERS}
                  title="Services"
                  icon={
                    <img src={require("./icons/offer.svg")} alt="" width="18" />
                  }
                >
                  <Link to="/my-offer">
                    <span className={"menu-item-text"}>Offer</span>
                  </Link>
                </Menu.Item>
              )}
              {(showPackages ||
                loggedInUser.user_type === langs.key.restaurant) && (
                <Menu.Item
                  key={DASHBOARD_KEYS.BEST_PACKAGES}
                  title="Services"
                  className={this.getMyStyle(DASHBOARD_KEYS.BEST_PACKAGES)}
                  icon={
                    <img
                      src={require("./icons/packages.png")}
                      alt=""
                      width="20"
                    />
                  }
                >
                  <Link to="/my-packages">
                    <span className={"menu-item-text"}>
                      {loggedInUser.user_type === langs.key.restaurant
                        ? "Packages"
                        : "Packages"}
                    </span>
                  </Link>
                </Menu.Item>
              )}
            </Menu>
          </div>
          <div className="menu-bottom-item">
            {isLoggedIn && (
              <div className="mt-50 mb-5">
                <Link
                  to="/"
                  onClick={() => this.logout()}
                  className="logout-link"
                >
                  <Text>Logout</Text>
                </Link>
              </div>
            )}
            <div className="about-sidebar-link mb-5">
              <Link to="/" className="border-link">
                <Text>About</Text>
              </Link>
            </div>
            <Link to="/">
              <Text className="fs-11">Need help?</Text>
            </Link>
            {isRedirect && (
              <Redirect
                push
                to={{
                  pathname: redirectPath,
                }}
              />
            )}
          </div>
        </div>
      </Sider>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, common } = store;

  const { savedCategories, categoryData } = common;
  let classifiedCategoryList = [];
  let isEmpty =
    savedCategories.data.booking.length === 0 &&
    savedCategories.data.retail.length === 0 &&
    savedCategories.data.classified.length === 0 &&
    (savedCategories.data.foodScanner === "" ||
      (Array.isArray(savedCategories.data.foodScanner) &&
        savedCategories.data.foodScanner.length === 0));
  if (auth.isLoggedIn) {
    if (!isEmpty) {
      isEmpty = false;
      classifiedCategoryList =
        savedCategories.data.classified &&
        savedCategories.data.classified.filter((el) => el.pid === 0);
    } else {
      isEmpty = true;
      classifiedCategoryList =
        categoryData && Array.isArray(categoryData.classified)
          ? categoryData.classified
          : [];
    }
  } else {
    isEmpty = true;
    classifiedCategoryList =
      categoryData && Array.isArray(categoryData.classified)
        ? categoryData.classified
        : [];
  }
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userProfile: profile.userProfile,
    isPrivateUser: auth.isLoggedIn
      ? auth.loggedInUser.user_type === langs.key.private
      : false,
    iconUrl:
      categoryData && categoryData.classifiedAll !== undefined
        ? common.categoryData.classifiedAll.iconurl
        : "",
    classifiedCategoryList,
  };
};
export default connect(mapStateToProps, {
  logout,
  getClassfiedCategoryListing,
})(DashboardSidebar);
