import React, { Component, Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReduxToastr from "react-redux-toastr";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import axios from "axios";
import AppHeader from "./components/header";
import AppFooter from "./components/footer";
import CustomeRoutes from "./router/Routes";
import { Layout, Spin } from "antd";
import { langs } from "./config/localization";
import { getLocalStorage } from "../src/common/Methods";
const spinIcon = (
  <img
    src={require("./assets/images/loader1.gif")}
    alt=""
    style={{ width: "64px", height: "64px" }}
  />
);
// const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  render() {
    const { loading, isLoggedIn, isPrivateUser, userProfile } = this.props;
    let authToken = getLocalStorage().authToken;
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    let loggedInAsPrivateuser = isLoggedIn && !isPrivateUser;
    //let isDashBoardSelectedStyle = this.props.dashboardRoutes && this.props.dashboardRoutes.includes(this.props.location.pathname) ? 'user-link selected' : 'user-link'
    return (
      <BrowserRouter>
      <div className={`user_type_${userProfile ? userProfile.seller_type : "" }`}>

      
        <Spin
          tip="Loading..."
          indicator={spinIcon}
          spinning={loading}
          style={{ backgroundColor: "white" }}
        >
          <Fragment>
            <Layout>
              <AppHeader />
              <Layout
                className={
                  loggedInAsPrivateuser
                    ? "profile-common-main-wrap main-wrap"
                    : "main-wrap profile-purple-main-wrap profile-purple-user-accont-v2"
                }
              >
                <CustomeRoutes />
                <AppFooter />
              </Layout>
            </Layout>
          </Fragment>
        </Spin>


        <ReduxToastr
          timeOut={50000}
          newestOnTop={false}
          preventDuplicates
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
        />
      </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (store) => {
  // const { auth, common } = store;
  const { auth, profile, common } = store
  return {

    userProfile: profile.userProfile,
    isLoggedIn: auth.isLoggedIn,
    authToken: auth.isLoggedIn ? auth.loggedInUser.token : "",
    loading: common.loading,
    isPrivateUser: auth.isLoggedIn
      ? auth.loggedInUser.user_type === langs.key.private
      : false,
  };
};
export default connect(mapStateToProps, null)(App);
