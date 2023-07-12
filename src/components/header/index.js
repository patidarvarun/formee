import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  controlMenuDropdown,
  logout,
  getUserProfile,
  fetchMasterDataAPI,
  getUserMenuList,
  openLoginModel,
  closeForgotModel,
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
  getUserNotification,
  updateUserNotificationStatus,
} from "../../actions/index";
import { Layout, Menu, Dropdown, Typography, Avatar, Popover } from "antd";
import Icon from "../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_TYPE, BASE_URL } from "../../config/Config";
import "./header.less";
import Login from "../auth/login/index";
import YourMenu from "./YourMenu";
import AllMenuList from "./AllMenu";
import { converInUpperCase } from "../common";
import { langs } from "../../config/localization";
import { LockOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const cmenu = (
  <Menu className="all-menu">
    <Menu.Item>
      <AllMenuList />
    </Menu.Item>
  </Menu>
);

let path = ["/", "/classifieds", "/bookings", "/retail", "/food-scanner"];

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    let showSecure = false;
    let { pathname } = this.props.history.location;
    if (
      pathname == "/add-profile-payment-methods" ||
      pathname == "/booking-checkout"
    )
      showSecure = true;
    else showSecure = false;
    this.state = {
      visible: false,
      yourMenu: false,
      isRedirect: false,
      userProfile: null,
      isVisible: false,
      isMenuOpen: false,
      isNotificationOpen: true,
      istest: 0,
      showSecure: showSecure,
      getNotificationData: [],
    };
    console.log(`this.props`, this.props);
  }

  /**
   * @method componentWillMount
   * @description called before render the component
   */

  componentWillMount() {
    const { isLoggedIn, loggedInUser } = this.props;
    let pathName = this.props.location.pathname;
    if (isLoggedIn && loggedInUser.user_type === "private") {
      let isVisible = path.includes(pathName);

      this.setState({ isVisible: isVisible });
    }
    isLoggedIn &&
      this.props.getUserProfile({ user_id: loggedInUser.id }, (res) => {
        if (res.status === 200) {
          this.setState({ userProfile: res.data.data });
        }
      });
    //console.log("USERPROFILE", this.state.userProfile);
    this.props.fetchMasterDataAPI({ timeinterval: 0 }, (res) => { });
    isLoggedIn && this.props.getUserMenuList((res) => { });
  }

  // componentDidMount() {
  //   //this.showLimitedNotification();
  //   const { isLoggedIn } = this.props;
  //   isLoggedIn &&
  //     document.body.classList.add(
  //       "user_type_" + this.props.userProfile.seller_type
  //     );
  // }

  /**
   * @methodcomponentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    const { isLoggedIn, loggedInUser } = this.props;
    let pathName1 = nextprops.location.pathname;
    let { pathname } = this.props.history.location;
    if (
      pathname == "/add-profile-payment-methods" ||
      pathname == "/booking-checkout"
    )
      this.setState({ showSecure: true });
    else this.setState({ showSecure: false });
    if (pathName1 !== pathname) {
      if (isLoggedIn && loggedInUser.user_type === "private") {
        let isVisible = path.includes(pathName1);

        this.setState({ isVisible: isVisible });
      }
    }
  }

  /**
   * @method showModal
   * @description show model
   */
  showModal = () => {
    const { isLoggedIn } = this.props;
    !isLoggedIn && this.props.openLoginModel();
  };

  /**
   * @method showLimitedNotification
   * @description to genrate the popup for notification*/

  showLimitedNotification = () => {
    const { isLoggedIn, loggedInUser } = this.props;
    let isLimited = true;
    if (loggedInUser) {
      this.props.enableLoading();
      this.props.getUserNotification(loggedInUser.id, isLimited, (response) => {
        this.props.disableLoading();
        if (response.status === 200) {
          if (response.data.body.length > 0) {
            this.setState({ isNotificationOpen: false });
          }
          let temArray = [];
          let notificationData = response.data.body;
          notificationData.map((value, i) => {
            let objectArray = {
              key: i,
              id: value.id,
              sender_id: value.sender_id,
              receiver_id: value.receiver_id,
              subject: value.subject,
              devicename: value.devicename,
              massage: value.massage,
              deviceid: value.deviceid,
              classified_id: value.classified_id,
              offer_price: value.offer_price,
              created_at: value.created_at,
              updated_at: value.updated_at,
              notifiable_id: value.notifiable_id,
              notifiable_type: value.notifiable_type,
              destination_url: value.destination_url,
              user_id: value.user_id,
              limit: 5,
              name: value.name,
              is_sellable: value.is_sellable,
              is_visible: value.is_visible,
              user_image: value.user_image,
            };
            temArray.push(objectArray);
          });
          let resData = this.sortData(temArray, this.state.sortType);

          this.setState({ notificationListData: resData });
          this.setState({ getNotificationData: resData });
        }
      });
    }
  };

  updateNotificationStatus = (notificationId) => {
    const { loggedInUser } = this.props;
    console.warn(notificationId);
    if (loggedInUser) {
      const reqFormData = {
        notification_id: notificationId,
      };
      this.props.enableLoading();
      this.props.updateUserNotificationStatus(reqFormData, (response) => {
        this.props.disableLoading();

        if (response.status === 200) {
          this.showLimitedNotification();
        }
      });
    }
  };

  sortData = (data, sortOption) => {
    if (sortOption === "Newest") {
      //Newest
      data.sort(function (a, b) {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      return data;
    } else {
      //Oldest
      data.sort(function (a, b) {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      return data;
    }
  };

  /**
   * @method showYourMenu
   * @description show showYourMenu
   */
  showYourMenu = () => {
    this.setState({
      yourMenu: true,
    });
  };

  /**
   * @method navigateUser
   * @description nevigate user
   */
  navigateUser = () => {
    const { isPrivateUser, loggedInUser } = this.props;

    // loggedInUser.role_slug == 'private'
    if (!isPrivateUser) {
      if (
        loggedInUser.user_type === "business" &&
        loggedInUser.role_slug !== langs.key.merchant
      ) {
        window.location.assign("/business-profile");
      } else {
        window.location.assign("/vendor-profile");
      }
    } else {
      window.location.assign("/myProfile");
    }
  };

  /**
   * @method cartDetail
   * @description cart detail handle
   */
  cartDetail = () => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      window.location.assign("/cart");
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method handleCancel
   * @description close model
   */
  handleCancel = (e) => {
    this.setState({
      yourMenu: false,
    });
  };

  /**
   * @method Logout User
   * @description Logout the user & clear the Session
   */
  logout = async () => {
    this.props.logout();
    toastr.success(langs.success, langs.messages.logout_success);
    window.location.assign("/");
  };

  /**
   * @method handleMenuChange
   * @description handle menu change
   */
  handleMenuChange = (event) => {
    this.setState({ isMenuOpen: event });
    this.props.controlMenuDropdown(event);
  };

  handleClickOfNotification = (notificationId) => {
    console.log("thiis id=", notificationId);
    this.updateNotificationStatus(notificationId);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      yourMenu,
      isRedirect,
      isVisible,
      showSecure,
      notificationListData,
      getNotificationData,
    } = this.state;
    let filterNotification = this.state.getNotificationData.find((val) => {
      return val.is_visible != 1;
    });

    const {
      isLoggedIn,
      userProfile,
      loggedInUser,
      isOpenLoginModel,
      isPrivateUser,
    } = this.props;

    let loggedInAsPrivateuser = isLoggedIn && !isPrivateUser;
    let headerStyle =
      !isLoggedIn && path.includes(this.props.location.pathname)
        ? `header-wrap header-wrap-landing`
        : isLoggedIn &&
          isPrivateUser &&
          path.includes(this.props.location.pathname)
          ? "header-wrap header-wrap-landing"
          : `header-wrap`;
    let isDashBoardSelectedStyle =
      this.props.dashboardRoutes &&
        this.props.dashboardRoutes.includes(this.props.location.pathname)
        ? "user-link"
        : "user-link";
    if (isLoggedIn && this.state.istest == 0) {
      this.showLimitedNotification();
      this.setState({ istest: 1 });
    }
    if (isRedirect) {
      return (
        <Redirect
          push
          to={{
            pathname: "/myProfile",
          }}
        />
      );
    }

    const content = (
      <div>
        <p>
          <a href="javascript:void(0)" onClick={() => this.navigateUser}>
            View Account
          </a>
        </p>
        <p>
          <a href="javascript:void(0)" onClick={() => this.logout}>
            Logout
          </a>
        </p>
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a href="javascript:void(0)" onClick={() => this.navigateUser()}>
            View Account
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:void(0)" onClick={() => this.logout()}>
            Logout
          </a>
        </Menu.Item>
      </Menu>
    );

    const menuNotification = () => (
      <Menu className="notifocation-outer">
        {this.state.notificationListData.map((notificationData) => (
          <Menu.Item
            onClick={(event) =>
              notificationData.is_visible == false
                ? this.updateNotificationStatus(notificationData.id)
                : null
            }
            className={
              notificationData.is_visible == true
                ? "table-row-unbold "
                : "table-row-bold"
            }
          >
            <span className="notification-img">
              <img src={notificationData.user_image} />
            </span>
            <div class="notification-data">
              <h3>{notificationData.massage}</h3>
              <span>{notificationData.updated_at}</span>
            </div>
          </Menu.Item>
        ))}

        <span className="all-notification">
          <Link to="/notifications" title="Cart">
            View All Notification
          </Link>
        </span>
      </Menu>
    );

    return (
      <Header
        className={
          loggedInAsPrivateuser && isDashBoardSelectedStyle
            ? "profile-module-main-header"
            : "main-header"
        }
      >
        <div className={headerStyle}>
          <div className="header-left">
            <div className="logo">
              <Link to="/" title="Formee">
                <img
                  src={require("../../assets/images/formee-logo.png")}
                  alt="Formee"
                />
              </Link>
            </div>

            {!showSecure && !loggedInAsPrivateuser && (
              <Menu mode="inline">
                <Menu.Item key="1" title="Main Menu">
                  <Dropdown
                    overlay={cmenu}
                    overlayClassName="main-menu-dropdown"
                    onVisibleChange={this.handleMenuChange}
                  >
                    <Link
                      to="/"
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        src={require("../../assets/images/menu-icon.png")}
                        alt="Menu Icon"
                      />
                    </Link>
                  </Dropdown>
                </Menu.Item>
                {isLoggedIn && (
                  <Menu.Item key="2" onClick={this.showYourMenu}>
                    <span>
                      <span className="border-link">Your Menu</span>
                    </span>
                  </Menu.Item>
                )}
                {/* <Menu.Item key='3' title='Search'><Icon icon='search' size='20' /></Menu.Item> */}
              </Menu>
            )}
          </div>
          <div className="header-right header-profile-right">
            {!showSecure && (
              <Menu mode="inline">
                {!loggedInAsPrivateuser && (
                  <Menu.Item>
                    <Link to="/wishlist" title="Wishlist">
                      <Icon icon="wishlist" size="20" />
                    </Link>
                  </Menu.Item>
                )}
                {!loggedInAsPrivateuser && isLoggedIn && (
                  <Menu.Item>
                    <Link to="/my-bookings" title="Bookings">
                      <Icon icon="bookings-ticket" size="22" />
                    </Link>
                  </Menu.Item>
                )}
                {!loggedInAsPrivateuser && isLoggedIn ? (
                  <Menu.Item>
                    <Link to="/restaurant-cart" title="Cart">
                      <Icon icon="cart" size="20" />
                    </Link>
                  </Menu.Item>
                ) : (
                  <Menu.Item onClick={() => this.props.openLoginModel()}>
                    <Link title="Cart">
                      <Icon icon="cart" size="20" />
                    </Link>
                  </Menu.Item>
                )}
                {isLoggedIn && (
                  <Menu.Item>
                    <Dropdown
                      overlay={menuNotification}
                      disabled={this.state.isNotificationOpen}
                      trigger={["click"]}
                    >
                      <svg
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={filterNotification ? "notification-top" : ""}
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10.9307 18.8672H6.61816C6.61816 19.0923 6.65274 19.3096 6.71694 19.5141C6.85333 19.9483 7.12343 20.3241 7.47987 20.5922C7.83964 20.8627 8.28739 21.0234 8.77441 21.0234C9.25705 21.0234 9.70398 20.8627 10.0643 20.5922C10.4213 20.3241 10.6934 19.9483 10.8309 19.5141C10.8957 19.3096 10.9307 19.0923 10.9307 18.8672ZM17.3994 17.7891V16.7109L15.2432 14.5547V9.16406C15.2432 5.85422 13.475 3.08344 10.3916 2.35031V1.61719C10.3916 0.722344 9.66926 0 8.77441 0C7.87957 0 7.15723 0.722344 7.15723 1.61719V2.35031C4.06301 3.08344 2.30566 5.84344 2.30566 9.16406V14.5547L0.149414 16.7109V17.7891H17.3994ZM3.23581 16.0641H14.313L13.5182 15.2692V9.16406C13.5182 6.45733 12.123 4.53507 9.99259 4.02853L8.77654 3.7394L7.55493 4.02884C5.41605 4.53561 4.03066 6.44502 4.03066 9.16406V15.2692L3.23581 16.0641Z"
                          fill="#90A8BE"
                        />
                      </svg>
                    </Dropdown>
                   
                    {this.state.notificationListData && this.state.notificationListData.length>0 &&
                      this.state.notificationListData.map((val)=>{
                        if(val.is_visible === 0){
                          return(
                            <span id="dot-noti"></span>
                          )
                        }
                      })
                    }
                  </Menu.Item>
                )}
                {!loggedInAsPrivateuser && (
                  <Menu.Item>
                    <Link to="/post-an-ad" title="Post an Ad">
                      <svg
                        className="ad-svg"
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.75 0C0.335786 0 0 0.335786 0 0.75V17.75C0 18.1642 0.335786 18.5 0.75 18.5H13C13 18.5 12.6875 18.25 12.6875 17.75C12.6875 17.25 13 17 13 17H1.5V1.5H18V12C18 12 18.25 11.625 18.75 11.625C19.25 11.625 19.5 12 19.5 12V0.75C19.5 0.335786 19.1642 0 18.75 0H0.75ZM10.2144 12.751H8.79932L8.23682 11.2876H5.66162L5.12988 12.751H3.75L6.25928 6.30859H7.63477L10.2144 12.751ZM7.81934 10.2021L6.93164 7.81152L6.06152 10.2021H7.81934ZM15.1802 12.751H14.0332V12.0654C13.8428 12.332 13.6172 12.5312 13.3564 12.6631C13.0986 12.792 12.8379 12.8564 12.5742 12.8564C12.0381 12.8564 11.5781 12.6411 11.1943 12.2104C10.8135 11.7769 10.623 11.1733 10.623 10.3999C10.623 9.60889 10.8091 9.0083 11.1812 8.59814C11.5532 8.18506 12.0234 7.97852 12.5918 7.97852C13.1133 7.97852 13.5645 8.19531 13.9453 8.62891V6.30859H15.1802V12.751ZM11.8843 10.3164C11.8843 10.8145 11.9531 11.1748 12.0908 11.3975C12.29 11.7197 12.5684 11.8809 12.9258 11.8809C13.21 11.8809 13.4517 11.7607 13.6509 11.5205C13.8501 11.2773 13.9497 10.9155 13.9497 10.4351C13.9497 9.89893 13.853 9.51367 13.6597 9.2793C13.4663 9.04199 13.2188 8.92334 12.917 8.92334C12.624 8.92334 12.3779 9.04053 12.1787 9.2749C11.9824 9.50635 11.8843 9.85352 11.8843 10.3164ZM19.5 14.3281C19.5 13.9139 19.1642 13.5781 18.75 13.5781C18.3358 13.5781 18 13.9139 18 14.3281V17H15.75C15.3358 17 15 17.3358 15 17.75C15 18.1642 15.3358 18.5 15.75 18.5H18V20.7507C18 21.1649 18.3358 21.5007 18.75 21.5007C19.1642 21.5007 19.5 21.1649 19.5 20.7507V18.5H21.75C22.1642 18.5 22.5 18.1642 22.5 17.75C22.5 17.3358 22.1642 17 21.75 17H19.5V14.3281Z"
                          fill="#90A8BE"
                        />
                      </svg>
                    </Link>
                  </Menu.Item>
                )}

                {!isLoggedIn ? (
                  <Menu.Item
                    className="user-link"
                    onClick={() => {
                      this.props.openLoginModel();
                    }}
                  >
                    <span className="user-icon mr-13">
                      <Icon icon="user" size="10" />
                    </span>
                    {isLoggedIn === false && <Text>Log in</Text>}
                    { }
                  </Menu.Item>
                ) : isPrivateUser ? (
                  <Menu.Item
                    className={
                      !isPrivateUser
                        ? `${isDashBoardSelectedStyle} selected `
                        : isDashBoardSelectedStyle
                    }
                    onClick={() => {
                      // this.navigateUser()
                    }}
                  >
                    {/* <Popover placement="bottomRight" content={content} className="header-custom-ant-popover">
                    <span className='user-icon mr-13'>
                      <Avatar src={(userProfile !== null && userProfile.image !== undefined) ? userProfile.image : DEFAULT_IMAGE_TYPE
                      } />
                    </span>
                    {userProfile !== null && <Text>{`${converInUpperCase(userProfile.name)}`}</Text>}
                  </Popover> */}

                    <div
                      overlayClassName="header-custom-dropdown"
                      overlay={menu}
                      placement="bottomCenter"
                      arrow
                    >
                      <span className="user-icon mr-13">
                        <Avatar
                          src={
                            userProfile !== null &&
                              userProfile.image !== undefined
                              ? userProfile.image
                              : DEFAULT_IMAGE_TYPE
                          }
                        />
                      </span>
                    </div>
                    <Dropdown
                      overlayClassName="header-custom-dropdown"
                      overlay={menu}
                      placement="bottomCenter"
                      arrow
                    >
                      <Text>
                        {userProfile !== null &&
                          `${converInUpperCase(userProfile.name)}`}
                      </Text>
                    </Dropdown>
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    className={
                      !isPrivateUser
                        ? `${isDashBoardSelectedStyle} selected`
                        : isDashBoardSelectedStyle
                    }
                  >
                    <span className="user-icon mr-13">
                      <Avatar
                        src={
                          userProfile !== null &&
                            userProfile.image !== undefined
                            ? userProfile.image
                            : DEFAULT_IMAGE_TYPE
                        }
                      />
                    </span>
                    <Dropdown
                      overlayClassName="user-dropdown"
                      overlay={menu}
                      placement="bottomCenter"
                      arrow
                    >
                      <Text>
                        {userProfile !== null &&
                          `${converInUpperCase(userProfile.name)}`}
                      </Text>
                    </Dropdown>
                    {/* {userProfile !== null && <Text>{`${converInUpperCase(userProfile.name)}`}</Text>} */}
                  </Menu.Item>
                )}
                {/* <Menu.Item>
                <Link to='/' title='Settings'>
                  <Icon icon='settings' size='20' />
                </Link>
              </Menu.Item> */}
              </Menu>
            )}
            {showSecure && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LockOutlined />
                <span style={{ marginLeft: "10px" }}>
                  Safe and secure checkout
                </span>
              </div>
            )}
          </div>
        </div>
        {isOpenLoginModel && (
          <Login
            visible={isOpenLoginModel}
            onCancel={() => {
              this.props.closeForgotModel();
              this.props.openLoginModel();
            }}
            postAnAddRedirection={this.props.postAnAddRedirection}
          />
        )}
        {isOpenLoginModel && (
          <Login
            visible={isOpenLoginModel}
            onCancel={() => {
              this.props.closeForgotModel();
              this.props.openLoginModel();
            }}
          />
        )}
        {yourMenu && (
          <YourMenu visible={yourMenu} onCancel={this.handleCancel} />
        )}
      </Header>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, common } = store;
  const { categoryData, isOpenLoginModel, postAnAddRedirection } = common;

  return {
    isLoggedIn: auth.isLoggedIn,
    dashboardRoutes: auth.dashboardRoutes,
    loggedInUser: auth.loggedInUser,
    userProfile: profile.userProfile,
    categoryData,
    isOpenLoginModel,
    isPrivateUser: auth.isLoggedIn
      ? auth.loggedInUser.user_type === langs.key.private
      : false,
    postAnAddRedirection,
  };
};

export default connect(mapStateToProps, {
  controlMenuDropdown,
  logout,
  getUserProfile,
  fetchMasterDataAPI,
  getUserMenuList,
  openLoginModel,
  closeForgotModel,
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
  getUserNotification,
  updateUserNotificationStatus,
})(withRouter(AppHeader));
