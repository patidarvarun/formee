import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { required, whiteSpace } from "../../../../config/FormValidation";
import {
  Form,
  Input,
  Button,
  Progress
} from "antd";
import { toastr } from 'react-redux-toastr'
import PlacesAutocomplete from '../../../common/LocationInput'
import { applyPromocode, enableLoading, disableLoading } from '../../../../actions'
const { TextArea } = Input;

class StepFirst extends React.Component {

  constructor(props) {
    super(props);
    const { location, lat, lng, city, state, pincode } = this.props.loggedInDetail
    let data = this.props.stepOneData
    this.state = {
      address: data && data.address ? data.address : location,
      city: data && data.city ? data.city : city,
      lat: data && data.lat ? data.lat : lat,
      lng: data && data.lng ? data.lng : lng,
      state: data && data.state ? data.state : state,
      country: data && data.country ? data.country : '',
      pincode: data && data.pincode ? data.pincode : pincode,
      promocodeValue: '',
      appliedPromoCodeId: '',
      discountAmount: 0
    };
  }

  /**
    * @method componentDidMount
    * @description called after render the component
    */
  componentDidMount() {
    let data = this.props.stepOneData
    this.setState({ address: data ? data.address : '' })
  }

  /**
   * @method moveToPersonal
   * @description move to personal signup
   */
  onFinish = (value) => {
    const { address, state, city, pincode, placeId, appliedPromoCodeId, promoCodeDiscount, promocodeValue, country } = this.state;
    const { totalamount, classifiedDetail } = this.props


    if (address === '' || (state === '' || city === '' || pincode === '')) {
      toastr.warning('Please enter your full address.')
      return true
    } else {
      if (appliedPromoCodeId !== '') {
        let discountAmount = Number(classifiedDetail.price) * promoCodeDiscount / 100;
        value.promo_code_id = appliedPromoCodeId;
        value.discount_amount = discountAmount
        value.promo_code = promocodeValue
      }
      value.address = address
      value.state = state
      value.city = city
      value.country = country
      value.pincode = pincode
      value.placeId = placeId
      this.props.next(value);
    }
  };


  /** 
    * @method handleAddress
    * @description handle address change Event Called in Child loc Field 
    */
  handleAddress = (result, address, latLng) => {
    let state = '';
    let city = '';
    let pincode = '';
    let country = ''

    result.address_components.map((el) => {

      if (el.types[0] === 'administrative_area_level_1') {
        state = el.long_name
      } else if (el.types[0] === 'administrative_area_level_2') {
        city = el.long_name
      } else if (el.types[0] === 'postal_code') {
        pincode = el.long_name
      } else if (el.types[0] === 'country') {
        country = el.long_name
      }
    })
    this.setState({ address, city, latLng, state, pincode, placeId: result.place_id, country })
    // this.changeAddress(address, latLng, state, city, pincode)
  }

  onClickApplyPromocode = () => {
    const { loggedInDetail } = this.props;
    let parameter = this.props.match.params
    let cat_id = parameter.categoryId
    let reqData = {
      promo_code: this.state.promocodeValue,
      booking_category_id: parameter.categoryId,
      customer_id: loggedInDetail.id,
      category_type: 'retail'
    }
    this.props.enableLoading();
    this.props.applyPromocode(reqData, (response) => {
      this.props.disableLoading();
      if (response.status === 200) {
        toastr.success('Promocode appiled successfully.');
        this.setState({
          appliedPromoCodeId: response.data.data.id,
          appliedPromoCode: response.data.data.promo_code,
          promoCodeDiscount: response.data.data.discount_percent
        });
      }
    });
  }

  removeAppliedPromoCode = () => {
    this.setState({
      promocodeValue: '',
      appliedPromoCode: '',
      promoCodeDiscount: ''
    });
  }

  /**
     * @method getInitialValue
     * @description get initial values
     */
  getInitialValue = () => {
    const { userDetails } = this.props
    const { address } = this.state
    return {
      contact_name:userDetails.name,
      address
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { address } = this.state
    const { userDetails } = this.props
    return (
      <div className="fm-step-three retail-fm-step-first">
        <Form onFinish={this.onFinish}
          initialValues={this.getInitialValue()}
        >
          <h4 className="fm-input-heading">Delivery Information</h4>
          <Form.Item
            label="Contact Name"
            name="contact_name"
            rules={[required(""), whiteSpace("Contact Name")]}
          >
            <Input
              placeholder={"Enter your first name and last name"}
              className="shadow-input"
              disabled
            // value={userDetails.name}
            />
          </Form.Item>
          <Form.Item
            label="Delivery Address"
            name="address"
          // rules={(address == '' || address == null || address == undefined) && [required("")]}
          >
            <PlacesAutocomplete
              name='address'
              className='shadow-input'
              handleAddress={this.handleAddress}
              addressValue={address}
            />
          </Form.Item>
          {/* {address == '' || address == null || address == undefined && <div className="ant-form-item-explain form-item-split">
            {'This field is required'}
          </div>} */}
          <Form.Item label="Additional Notes" name="notes">
            <TextArea
              placeholder={"Type here.."}
              className="shadow-input"
              rows={4}
            />
          </Form.Item>
          <hr />

          <Form.Item className='fm-apply-label' label='Do you have code promo?'>
            <div className='fm-apply-input'>
              <Input value={this.state.promocodeValue} onChange={(e) => this.setState({ promocodeValue: e.target.value })} placeholder={'Enter promotion code'} enterButton='Search' className='shadow-input' />
              <Button type='primary' className='fm-apply-btn' onClick={this.onClickApplyPromocode}>Apply</Button>
            </div>
            <Link onClick={this.removeAppliedPromoCode} className='fm-clear-link'>Clear</Link>
          </Form.Item>
          <div className="steps-action" justify="end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="fm-btn fm-next-btn"
              >
                Next
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}


const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : null
  };
};

export default connect(
  mapStateToProps, { applyPromocode, enableLoading, disableLoading }
)(withRouter(StepFirst));
