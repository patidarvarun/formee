import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Col, Input, Layout, Row, Typography, Button, Pagination, Card, Tabs, Select, Alert, Rate, Divider, Modal,Form } from 'antd';
import { Link, withRouter } from "react-router-dom";

class MyBookings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div>
         <Layout className="event-booking-profile-wrap sports-main-box">
            <div
                  className="my-profile-box view-class-tab shadow-none"
                  style={{ minHeight: 800 }}
                >
                  <div className="card-container signup-tab">
                      <div className="ant-card profile-content-shadow-box">
                        dxdf
                      </div>
                  </div>
            </div>         
         </Layout>
      </div>
    )
  }

}


const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
})(withRouter(MyBookings));
