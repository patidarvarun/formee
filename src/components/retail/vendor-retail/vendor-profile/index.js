import React from 'react';
import { Link,withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../config/localization'
import { connect } from 'react-redux';
import { Steps, Layout, Typography, Card, Space } from 'antd';
import Icon from '../../../customIcons/customIcons';
import { enableLoading, disableLoading, updateRestaurantProfile, checkPaypalAccepted, getTraderProfile, saveTraderProfile, getUserProfile, changeUserName, changeMobNo } from '../../../../actions';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import StepFirst from './BasicDetail';
import PaymentScreen from '../../../dashboard/vendor-profiles/common-profile-setup/PaymentScreen'
import history from '../../../../common/History';
import { MESSAGES } from '../../../../config/Message';

const { Title, Text } = Typography;
const { Step } = Steps;

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      submitFromOutside: false,
      current: 0,
      step1Data: {},
      step2Data: {},
      paymentData: {}
    };
  }

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    if(this.props.userDetails){
      const { id } = this.props.userDetails
      this.props.getTraderProfile({ user_id: id })
    }
  }

  /**
   * @method next
   * @description called to go next step
   */
  next(reqData, step) {
    const { loggedInUser } = this.props
    const current = this.state.current + 1;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    if (step === 1) {
      this.setState({ current, step1Data: reqData });
    } else if (step === 2) {
      this.saveTraderProfile()
    }
  }

  /**
   * @method saveTraderProfile
   * @description save vendor trader profile
   */
  saveTraderProfile = () => {
    const { loggedInUser, traderProfile } = this.props
    
    const { id } = this.props.userDetails
    const { business_name } = traderProfile.user
    const { step1Data, paymentData } = this.state
    let temp = []
    step1Data && Array.isArray(step1Data.service_images) && step1Data.service_images.filter((el) => {
      el.originFileObj && temp.push(el.originFileObj)
    })

    let reqData = {
      user_id: id,
      business_name: step1Data.bussiness_name ? step1Data.bussiness_name : business_name !== 'undefined' ? business_name : 'Vendor',
      contact_name: step1Data.contact_name,
      address: step1Data.address,
      description: step1Data.description,
      contact_number: step1Data.mobile_no,
      bsb: paymentData.bsb ? paymentData.bsb : '',
      account_name: paymentData.account_name ? paymentData.account_name : '',
      account_number: paymentData.account_number ? paymentData.account_number : '',
      ['service_images[]']: temp,
      //unused requestdata
      capacity_info: '',
      mobile_no_verified: 0,
      event_type_ids: '0',
      start_from_hr: 0,
      profile_dietary_ids: '',
      basic_quote: 0,
      service_and_facilities: '',
      working_hours: '[]',
      capacity:  '',
      service_type: '',
      rate_per_hour:  0,
      is_public_closed: 0,
      fitness_amenities_ids: '',
      booking_cat_id: '',
      booking_sub_cat_id: '',
      

    }
    // const formData = new FormData()
    if (loggedInUser.user_type !== 'restaurant') {
      const formData = new FormData()
      for (var i = 0; i < temp.length; i++) {
        formData.append('service_images[]', temp[i]);
        
      }

      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key])
      })
      if (paymentData.ispayPalAccepted) {
        this.props.checkPaypalAccepted({ user_id: loggedInUser.id }, res => {
          if (res.status === 200) {
            formData.append('is_paypal_accepted', 1)
            this.saveTraderProfileData(formData)
          } else {
            formData.append('is_paypal_accepted ', 0);
            this.saveTraderProfileData(formData)
          }
        })
      } else {
        this.saveTraderProfileData(formData)
      }
    }
  }

  /**
   * @method saveTraderProfileData
   * @description save  trader profile data
   */
  saveTraderProfileData = (formData) => {
    const { id } = this.props.userDetails
    this.props.enableLoading()
    this.props.saveTraderProfile(formData, (res) => {
      this.props.disableLoading()
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.PROFILE_UPDATE_SUCCESS)
        this.props.getTraderProfile({ user_id: id })
        this.props.history.push('/vendor-profile')
        // this.setState({ current });
      }
    })
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const { current, step1Data } = this.state;
    const { userDetails, loggedInUser, traderProfile } = this.props;
    
    
    const steps = [
      {
        title: 'Step First',
        content: <StepFirst
         userDetails={traderProfile}
          nextStep={(reqData) => this.next(reqData, 1)}
          submitFromOutside={this.state.submitFromOutside}
        />,
      },
      {
        title: 'Step Fourth',
        content: <PaymentScreen 
        userDetails={traderProfile} 
        nextStep={(reqData) => {
          this.setState({ paymentData: reqData }, (reqData) => {
            this.next(reqData, 2)
          })
        }} submitFromOutside={this.state.submitFromOutside} />
      },

    ];

    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout style={{ overflowX: 'visible' }}>
            <div className='my-profile-box my-profile-setup'>
              <div className='card-container signup-tab'>
                <div className='steps-content align-left mt-0'>
                  <div className='top-head-section'>
                    <div className='left'>
                      <Title level={2}>My Profile</Title>
                    </div>
                    <div className='right'></div>
                  </div>
                  <div className='sub-head-section'>
                    <Text>All Fields Required</Text>
                  </div>
                  <Card
                    className='profile-content-box'
                    bordered={false}
                    title='Profile Setup'
                    extra={<Link form={'form1'} onClick={() => this.setState({ submitFromOutside: true })} to='#'><Space align={'center'} size={9}>Clear All <Icon icon='delete2' size='12' /></Space></Link>}
                  >
                    {steps[current].content}
                    <Steps progressDot current={current} className="profile-vendors-steps-dot">

                      {steps.map((item, index) => (
                          <Step
                            onClick={(e) => {
                              if (index < current && current !== 5) {
                                this.setState({ current: index })
                              }
                            }} 
                            key={item.title} />
                        ))}
                    </Steps>
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
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
    traderProfile: profile.traderProfile !== null ? profile.traderProfile : null
  };
};
export default connect(
  mapStateToProps,
  { enableLoading, disableLoading, updateRestaurantProfile, checkPaypalAccepted, getTraderProfile, saveTraderProfile, getUserProfile, changeUserName, changeMobNo }
)(withRouter(EditProfile));