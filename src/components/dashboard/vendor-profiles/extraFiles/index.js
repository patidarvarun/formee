import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../config/localization'
import { Layout, Card, Divider, Typography, Button, Tabs, Table, Avatar, Row, Col, Form, Select, Input } from 'antd';
import { enableLoading, disableLoading, getFitnessClassListing, getFitnessTypes, createFitnessClass, getTraderProfile } from '../../../../actions'
import 'ant-design-pro/dist/ant-design-pro.css';
import { EditClassForm } from './manage-class/EditClassForm'
import { MESSAGES } from '../../../../config/Message';

let today = Date.now()
class CreateClass extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      CreateClassDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: false,
      index: '',
      isInitialProfileSetup: false
    };
  }

  componentDidMount() {
    const { id } = this.props.userDetails
    this.props.getFitnessTypes()
    this.getFitnessClasses()
  }

  /**
  * @method getFitnessClasses
  * @description get service details
  */
  // getFitnessClasses = () => {
  //   let trader_user_profile_id = this.props.userDetails.user.trader_profile.id
  //   this.props.getFitnessClassListing({ id: trader_user_profile_id, page_size: 50 }, (res) => {
  //     
  //     // if (res.data.status === 200) {
  //     //   let data = res.data && res.data.data
  //     //   let traderClasses = data.trader_classes && Array.isArray(data.trader_classes) && data.trader_classes.length ? data.trader_classes : []
  //     //   this.setState({ isInitialProfileSetup: traderClasses.length >= 1 })
  //     // }
  //   })
  // }

  // /**
  // * @method createNewClass
  // * @description create a new class
  // */
  // createNewClass = (tabIndex, reqData) => {
  //   
  //   const { userDetails } = this.props;
  //   let req = {
  //     trader_user_profile_id: userDetails.user.trader_profile.id,
  //     classes: reqData,
  //     images: []
  //   }
  //   this.props.createFitnessClass(req, (res) => {
  //     if (res.status === 200) {
  //       this.props.nextStep(res)
  //       toastr.success(langs.success, MESSAGES.CLASS_CREATE_SUCCESS)
  //     }
  //   })
  // }

  createNewClass = (tabIndex, reqData, images) => {
    
    return
    const { userDetails } = this.props;
    let temp = []
    images.filter((el) => {
      el.originFileObj && temp.push(el.originFileObj)
    })

    let req = {
      trader_user_profile_id: userDetails.user.trader_profile.id,
      classes: reqData
    }
    const formData = new FormData()
    for (var i = 0; i < temp.length; i++) {
      formData.append('images[]', temp[i]);
    }
    Object.keys(req).forEach((key) => {
      if (typeof req[key] == 'object' && key === 'classes') {
        
        formData.append('classes', `${JSON.stringify(req[key])}`)
      }
      else {
        
        formData.append(key, req[key])
      }
    })
    // this.props.enableLoading()
    this.props.createFitnessClass(formData, (res) => {
      
      // this.props.disableLoading()
      if (res.status === 200) {
        // this.getFitnessClasses()
        // this.props.history.push('/fitness-vendor-manage-classes')
        toastr.success(langs.success, MESSAGES.CLASS_CREATE_SUCCESS)
      }
    })

  }


  /**
   * @method render
   * @description render component  
   */
  render() {
    const { fitnessPlan } = this.props;
    const { isInitialProfileSetup } = this.state;
    
    return (
      <Layout className="create-membership-block">
        <Layout className="createmembership">
          <h4 style={{ margin: "16px 0 20px 0" }}>
            <b>Create your class</b>
            <p className="subtitle">Files can be up to 2MB for file types .pdf .jpeg .png .bmp</p>
          </h4>
          <div className='my-profile-box createmembership manage-edit-memebership' style={{ minHeight: 800 }}>
            <EditClassForm isInitialProfileSetup={isInitialProfileSetup} fitnessPlan={fitnessPlan} createClass={this.createNewClass}  />
          </div>
          <Divider />
          {isInitialProfileSetup && <div className="step-button-block">
            <Button form='create_class' htmlType='submit' type='primary' size='middle' className='btn-blue'
              onClick={() => this.props.nextStep()}
            >
              NEXT
          </Button>
          </div>}
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
  { enableLoading, disableLoading, getFitnessClassListing, getFitnessTypes, getTraderProfile, createFitnessClass }
)(CreateClass)