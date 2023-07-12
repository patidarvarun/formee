import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { langs } from "./config/localization";

export default function (ComposedComponent) {
  class AuthMiddleware extends Component {
    constructor(props) {
      super(props);
      this.state = {
        redirectToLogin: false,
      };
    }

    /**
     * @method componentWillMount
     * @description called before mount the component
     */
    componentWillMount() {
      if (this.props.loggedInUser === false) {
        this.setState({ redirectToLogin: true });
        return false;
      }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
      if (this.state.redirectToLogin === true) {
        // alert(this.state.redirectToLogin);
        return (
          <Redirect
            to={{
              pathname: `/`,
            }}
          />
        );
      }
      //Render the component with all props
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (store) => {
    const { auth } = store;
    return {
      isLoggedIn: auth.isLoggedIn,
      authToken: auth.isLoggedIn ? auth.loggedInUser.token : "",
      loggedInUser: auth.isLoggedIn ? auth.loggedInUser : false,
      isPrivateUser: auth.isLoggedIn
        ? auth.loggedInUser.user_type === langs.key.private
        : false,
      menuSkiped: auth.isLoggedIn
        ? auth.loggedInUser.menu_skipped === 1
        : false,
    };
  };

  return connect(mapStateToProps)(AuthMiddleware);
}
