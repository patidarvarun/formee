import React from 'react';
import { connect } from 'react-redux';
import { Layout, Card, Typography, Select, Tabs } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import CreateMenu from './CreateMenu'
import '../../vendor-profiles/myprofilerestaurant.less'
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select

class AddRestaurantMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, isEditFlag, restaurantDetail } = this.state;
    return (
      <Layout>
        <Layout className="create-membership-block">
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab add-menu' >
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>My Menu</Title>
                  </div>
                </div>
                <Card
                  className='profile-content-box'
                  bordered={false}
                  title='Add Menu'
                >
                  <CreateMenu isAddMenu={true} />
                </Card>
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};
export default connect(
  mapStateToProps,
  {}
)(AddRestaurantMenu)