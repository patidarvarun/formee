import React from "react";
import { Layout, Card, Typography, Table, Row, Col } from "antd";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import { connect } from "react-redux";
import Icon from "../../../customIcons/customIcons";
import { Stripe_Public_key } from "../../../../config/Config";
import {
  updateDefaultCard,
  enableLoading,
  disableLoading,
  deleteUserCard,
} from "../../../../actions";
import AddPayment from "../../../vendor/classified/classified-vendor-profile-setup/StepSecond-Enhanced";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
const { Title } = Typography;
const stripePromise = loadStripe(Stripe_Public_key);

class PaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      showLater:
        this.props.location.state?.showLater === false
          ? this.props.location.state.showLater
          : true,
    };
  }

  render() {
    const { userDetails } = this.props;
    return (
      <Layout>
        <Layout className="profile-vendor-retail-transaction-order add-an-edit-another-payment-methods">
          {/* <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          /> */}
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box add-new-cart-apyment"
              style={{ minHeight: 800 }}
            >
              <div className="">
                <div className="top-head-section">
                  <div className="left">
                    <Link to="/myProfile" className="backtoprofile">
                      <img src={require("./icon/left-arrow.svg")} /> Back to my
                      profile
                    </Link>
                    <Title level={2} className="pl-0">
                      Add Another Payment Methods
                    </Title>
                  </div>
                </div>
                <div className="profile-content-box ">
                  <Card
                    bordered={false}
                    className="add-content-box job-application"
                    // title='Orders Management'
                  >
                    <Row className="grid-block">
                      <Col md={24}>
                        <AddPayment
                          isAnotherPay={true}
                          showLater={this.state.showLater}
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
  };
};
export default connect(mapStateToProps, {
  updateDefaultCard,
  enableLoading,
  disableLoading,
  deleteUserCard,
})(PaymentMethods);
