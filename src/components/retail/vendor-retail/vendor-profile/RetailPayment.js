import React from 'react';
import { connect } from 'react-redux';
import history from '../../../../common/History';
import { Layout, Card } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import PaymentScreen from '../../../dashboard/vendor-profiles/common-profile-setup/PaymentScreen'

class RetailPayment extends React.Component {
  
  /**
   * @method render
   * @description render component
   */
  render() {
    const { merchant } = this.props
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout style={{ overflowX: 'visible' }}>
            <div className='my-profile-box my-profile-setup'>
              <div className='card-container signup-tab'>
                <div className='steps-content align-left mt-0'>
                  <div className='top-head-section'>
                  </div>
                  <Card
                    className='profile-content-box'
                    bordered={false}
                    title='Payment Set Up'
                  >
                   <PaymentScreen merchant={true} history={history}/>
                  </Card>
                </div>
                <div className='steps-action align-center mb-32'>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings } = store;
  
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
    traderProfile: profile.traderProfile !== null ? profile.traderProfile : null,
    restaurantDetail: bookings && bookings.restaurantDetail ? bookings.restaurantDetail : null,
  };
};
export default connect(
  mapStateToProps,null
)(RetailPayment);