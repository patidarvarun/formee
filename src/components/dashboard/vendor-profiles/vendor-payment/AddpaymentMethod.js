import React from "react";
import { Layout, Card, Typography, Table, Row, Col } from "antd";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import { Stripe_Public_key } from "../../../../config/Config";
import { connect } from "react-redux";
import {
  updateDefaultCard,
  enableLoading,
  disableLoading,
  deleteUserCard,
} from "../../../../actions";
import AddPayment from "../../../vendor/classified/classified-vendor-profile-setup/StepSecond-Enhanced";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const { Title } = Typography;
const stripePromise = loadStripe(Stripe_Public_key);

class PaymentMethods extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
    };
  }

  render() {
    const { userDetails } = this.props;
    return (
      <Layout>
        <Layout className="profile-vendor-retail-transaction-order add-an-edit-another-payment-methods">
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800 }}
            >
              <div className="pt-20 pl-60">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Add Another Payment Methods</Title>
                  </div>
                </div>
                <div className="profile-content-box">
                  <Card
                    bordered={false}
                    className="add-content-box job-application"
                    // title='Orders Management'
                  >
                    <Row className="grid-block">
                      <Col md={24}>
                        <AddPayment isAnotherPay={true} />
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
