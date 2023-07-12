import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import { Form, Input, Button, Divider } from 'antd';
import { getTraderMonthWellbeingBooking, getSpaDietitianSpaBooking, updateSpaDietitianSpaBooking } from '../../../../actions';
import { required, whiteSpace } from '../../../../config/FormValidation';
import PlacesAutocomplete from '../../../common/LocationInput';

class Step1 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    const { step1Data } = props.mergedStepsData;
    const { location, lat, lng, city, state, pincode } = this.props.loggedInDetail
    this.state = {
      address: step1Data.location ? step1Data.location : location,
      isSubmit: false,
      city: step1Data.city ? step1Data.city : city,
      lat: step1Data.lat ? step1Data.lat : lat,
      lng: step1Data.lng ? step1Data.lng : lng,
      state: step1Data.state ? step1Data.state : state,
      pincode: step1Data.pincode ? step1Data.pincode : pincode,
    };
  }

  /**
   * @method componentDidMount
   * @description called before mounting the component
   */
  componentDidMount() {
    const { location, lat, lng } = this.props.loggedInDetail
    const { step1Data } = this.props.mergedStepsData
    if (step1Data) {
      this.setState({ address: step1Data.location })
    } else {
      this.setState({ address: location })
    }
  }

  /**
   * @method onFinish
   * @description called to submit form 
   */
  onFinish = (values) => {
    const { address, city, latLng, state, pincode } = this.state
    const { lat, lng } = this.props.loggedInDetail
    if (this.onFinishFailed() !== undefined) {
      return true
    } else if (address === '' || (state === '' || city === '' || pincode === '')) {
      toastr.warning('Please enter your full address.')
      return true
    } else {
      this.setState({ isSubmit: false })
      if (values !== undefined) {
        const reqData = {
          name: values.contactName,
          phone_number: values.phoneNumber !== null && values.phoneNumber !== '' ? `${this.props.loggedInDetail.phonecode} ${values.phoneNumber}` : '', //values.phoneNumber,  
          phone_code: this.props.loggedInDetail.phonecode,
          location: address,
          city: city,
          lat: latLng && latLng.lat ? latLng.lat : lat,
          lng: latLng && latLng.lng ? latLng.lng : lng,
          state: state,
          pincode: pincode
        }
        this.props.nextStep(reqData, 1)
      }
    }
  }

  /**
   * @method onFinishFailed
   * @description handle form submission failed 
   */
  onFinishFailed = errorInfo => {
    return errorInfo
  };

  /** 
 * @method handleAddress
 * @description handle address change Event Called in Child loc Field 
 */
  handleAddress = (result, address, latLng) => {
    let state = '';
    let city = '';
    let pincode = ''
    result.address_components.map((el) => {
      if (el.types[0] === 'administrative_area_level_1') {
        state = el.long_name
      } else if (el.types[0] === 'administrative_area_level_2') {
        city = el.long_name
      } else if (el.types[0] === 'postal_code') {
        this.setState({ postal_code: el.long_name })
        pincode = el.long_name
      }
    })
    this.setState({ address: address, city: city, latLng: latLng, state: state, pincode: pincode })
  }
  /**
  * @method render
  * @description render component
  */
  render() {
    const { loggedInDetail } = this.props;
    const { address, isSubmit, state, city, pincode } = this.state
    const { name, location, mobile_no } = loggedInDetail
    const { step1Data } = this.props.mergedStepsData
    return (
      <Fragment>
        <div className='wrap fm-step-form fm-step-three req-step-one'>
          <Form
            name='user-bookinginfo'
            initialValues={{ contactName: step1Data && step1Data.name ? step1Data.name : name, location: step1Data && step1Data.location ? step1Data.location : location, phoneNumber: step1Data && step1Data.phone_number ? step1Data.phone_number : mobile_no }}
            layout='horizontal'
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            scrollToFirstError
            id='user-bookinginfo'
            ref={this.formRef}
          >
            <h4 className='fm-input-heading'>Your Information</h4>
            <Form.Item label='Contact Name' name='contactName'>
              <Input rules={[required('Contact Name'), whiteSpace('Contact Name')]} placeholder={'Enter your first name and last name'} className='shadow-input' />
            </Form.Item>
            <Form.Item label='Address' name='location'>
              <PlacesAutocomplete
                name='address'
                handleAddress={this.handleAddress}
                addressValue={address}
                className='shadow-input'
              />
            </Form.Item>
            <Form.Item label='Phone Number' name='phoneNumber'>
              <Input placeholder={'Enter your phone number'} className='shadow-input' rules={[required('Phone Number'), whiteSpace('Phone Number')]} />
            </Form.Item>
            <Divider />
            <Form.Item label='Do you have code promo?' name='Doyouhavecodepromo'>
              <Input placeholder={'Code Promo'} className='shadow-input' />
            </Form.Item>
            <Form.Item >
              <div className='steps-action '>
                <Button htmlType="submit" onClick={() => this.setState({ isSubmit: true })} type='primary' size='middle' className='btn-blue fm-btn' >Next</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser
  };
};

export default connect(
  mapStateToProps, { getTraderMonthWellbeingBooking, getSpaDietitianSpaBooking, updateSpaDietitianSpaBooking }
)(Step1);