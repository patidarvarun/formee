import React from 'react';
import { connect } from 'react-redux';
import { Layout, Card, Typography, Button, Tabs, Table, Avatar, Row, Col, Form, Select, Input } from 'antd';
import AppSidebar from '../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import { getFitnessTypes, createMemberShipPlan, getTraderProfile } from '../../../../actions'
import { required } from '../../../../config/FormValidation'
import 'ant-design-pro/dist/ant-design-pro.css';
// import './calender.less'
import { CreateMemberShipForm } from './MembershipForm'
const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;

let today = Date.now()

class CreateMemberShip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: false, index: ''
    };
  }

  componentDidMount() {
    const { id } = this.props.userDetails
    this.props.getFitnessTypes()
  }
  onFinish = (value) => {
    
  }
  createNewFitness = (reqData) => {
    const { userDetails } = this.props;
    
    let req = {
      trader_user_profile_id: userDetails.user.trader_profile.id,
      packages: JSON.stringify(reqData.membership),
    }
    const formData = new FormData()
    formData.append('trader_user_profile_id', req.trader_user_profile_id);
    formData.append('packages', req.packages)
    this.props.createMemberShipPlan(formData, (res) => {
      
    })
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { fitnessPlan } = this.props;
    
    return (
      <Layout className="create-membership-block">
        <Layout>
          <h4 className="mb-20"><b>Create your class</b></h4>
          <div className='my-profile-box createmembership' style={{ minHeight: 800 }}>
            <CreateMemberShipForm fitnessPlan={fitnessPlan} createClass={this.createNewFitness} />
          </div>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],

  };
};
export default connect(
  mapStateToProps,
  { getFitnessTypes, getTraderProfile, createMemberShipPlan }
)(CreateMemberShip)