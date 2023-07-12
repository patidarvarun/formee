import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {
  Form,
  Tabs,
  Button,
  Input,
  Col,
  Row,
  Checkbox,
  Modal,
  Radio
} from 'antd';
import { langs } from '../../config/localization';
import { MESSAGES } from '../../config/Message';
import '../auth/registration/style.less';
import PlacesAutocomplete from '../common/LocationInput';
import { validMobile, required, minLength, whiteSpace, validatePhoneNumber, maxLength } from '../../config/FormValidation';
import { sendOtp } from '../../actions'
import { converInUpperCase, getAddress } from '../common'
import {postAnAd,bussinessUserPostAnAd, subscriptionPlan, enableLoading, disableLoading, setAdPostData, retailPostanAdAPI } from '../../actions'
import Icon from '../customIcons/customIcons';
import Preview from './Preview';
import JobModel from './PreviewJobModel'
import { NavBar,RetailNavBar } from './CommanMethod'
import SendOtpModal from '../common/SendOtpModal'
const { TabPane } = Tabs;

class Step4 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
      visible: false,
      hide_mob_number: false,
      visibleJob: false, mobileNo: '',
      isNumberVarify: false, otpModalVisible: false, isVisible: true,
      hide_mob_number: false,
      classified_type: ''
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { userDetails } = this.props;
    
    this.setState({ address: userDetails.address });
    if (this.props.reqData) {
      const { reqData } = this.props;
      
      this.setState({ address: reqData.location ? reqData.location : '' })
      this.formRef.current && this.formRef.current.setFieldsValue({
        contact_name: converInUpperCase(reqData.fname),
        contact_mobile: reqData.contact_mobile,
        lname: converInUpperCase(reqData.lname),
        address: reqData.location ? reqData.location : '',
        hide_mob_number: reqData.hide_mob_number ? reqData.hide_mob_number : false,
        url_link: reqData.url_link ? reqData.url_link : '',
        agreement: reqData.agreement ? reqData.agreement : false
      });
    } else {
      const {
        fname,
        lname,
        mobile_no,
        email,
      } = this.props.userDetails;
      
      this.formRef.current && this.formRef.current.setFieldsValue({
        contact_name: fname ? converInUpperCase(fname) : '',
        lname: lname ? converInUpperCase(lname) : '',
        email,
        contact_mobile: mobile_no && mobile_no !== 'N/A' ? mobile_no : '',
      });
    }
  }

  /**
   * @method onFinish
   * @description handle onsubmit
   */
  onFinish = (value) => {
    const { adPermissionData,categoryType } = this.props;
    let memberShipId = ''
    if (adPermissionData && adPermissionData !== undefined) {
      const packageData = adPermissionData && Array.isArray(adPermissionData.package) && adPermissionData.package.length ? adPermissionData.package[0] : ''
      memberShipId = packageData.id
    }
    const { data, address, hide_mob_number, mobile_no, isNumberVarify, classified_type } = this.state;
    // if(!isNumberVarify){
    //   toastr.warning('warning', 'Please verify your phone number.')
    // }else{
    const { lat, long, userDetails } = this.props
    const { id, email, name } = this.props.loggedInUser;
    const requestData = {
      user_id: id,
      contact_email: email,
      contact_name: value.contact_name + ' ' + value.lname,
      hide_mob_number: hide_mob_number === true ? 1 : 0,
      contact_mobile: value.contact_mobile ? value.contact_mobile : this.props.userDetails.mobile_no,
      location: data ? data.location : address,
      lat: data ? data.lat : lat,
      lng: data ? data.lng : long,
      state_id: data ? data.state_id : userDetails.state,
      subregions_id: data ? data.subregions_id : userDetails.city,
      url_link: value.url_link ? value.url_link : '',
      agreement: value.agreement ? value.agreement : false,
      classified_type: classified_type,
      membership_plan_user_id: memberShipId
    };
    this.props.setAdPostData(requestData, 3);
    requestData.fname = value.contact_name;
    requestData.lname = value.lname;

    if(categoryType === 'retail'){
      this.adPostRetail(value,memberShipId)
    }else {
      // this.props.nextStep(requestData);
      this.adpostClassified(value,memberShipId)
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    // }
  };


  adpostClassified = (value, memberShipId) => {
    const {lat, long, userDetails,selectedPlan, step1, attributes, allAttribute, allImages, loggedInDetail, inspection_time } = this.props;
    const { data, address, hide_mob_number, mobile_no, isNumberVarify, classified_type } = this.state;
    const { id, email, name } = this.props.loggedInUser;
    const requestData = {
      attributes,
      user_id: id,
      questions: JSON.stringify(allAttribute.questions),
      answers: JSON.stringify(allAttribute.answers),
      contact_email: email,
      contact_name: value.contact_name + ' ' + value.lname,
      hide_mob_number: hide_mob_number === true ? 1 : 0,
      contact_mobile: value.contact_mobile ? value.contact_mobile : this.props.userDetails.mobile_no,
      location: data ? data.location : address,
      lat: data ? data.lat : lat,
      lng: data ? data.lng : long,
      state_id: data ? data.state_id : userDetails.state,
      subregions_id: data ? data.subregions_id : userDetails.city,
      url_link: value.url_link ? value.url_link : '',
      agreement: value.agreement ? value.agreement : false,
      quantity: 1,
      description: allAttribute.description,
      title: allAttribute.title,
      inspection_type: allAttribute.inspection_type,
      parent_categoryid: step1.parent_categoryid,
      category_id: step1.category_id,
      package_id: selectedPlan.id,
      fileList: allImages.fileList,
      inpection_times: inspection_time ? inspection_time : [],
      price: allAttribute.price,
      floor_plan: allAttribute.floorPlan,
      company_logo: allAttribute.company_logo,
      is_ad_free: allAttribute.is_ad_free ? 1 : 0
    };
    requestData.fname = value.contact_name;
    requestData.lname = value.lname;
    if (loggedInDetail.user_type !== langs.key.private) {
      requestData.attr_value_video = allAttribute.videoList
      requestData.contact_title = value.contact_name + ' ' + value.lname
      requestData.classified_type = classified_type ? classified_type : ''
      requestData.membership_plan_user_id = memberShipId ? memberShipId : ''
    }
    console.log('requestData',requestData)
    const formData = new FormData()
    Object.keys(requestData).forEach((key) => {
      if (typeof requestData[key] == 'object' && key !== 'fileList' && key !== 'attr_value_video' && key !== 'floor_plan' && key !== 'company_logo') {
        formData.append(key, JSON.stringify(requestData[key]))
      } else if (key === 'fileList') {
        let data = []
        requestData[key].length && requestData[key].map((e, i) => {
          formData.append(`image${i + 1}`, requestData[key][i].originFileObj);
        })
      } else if (key === 'attr_value_video') {
        requestData[key].length && requestData[key].map((e, i) => {
          formData.append(`attr_value_video[]`, requestData[key][i].originFileObj);
        })     
      } else if (key === 'floor_plan') {
        requestData[key].length && requestData[key].map((e, i) => {
          formData.append(`floor_plan`, requestData[key][i].originFileObj);
        })     
      }else if (key === 'company_logo') {
        requestData[key].length && requestData[key].map((e, i) => {
          formData.append(`company_logo`, requestData[key][i].originFileObj);
        })     
      } else {
        formData.append(key, requestData[key])
      }
    })
      // this.props.enableLoading()
      if (loggedInDetail.user_type !== langs.key.private) {
        console.log('case business')
        this.props.bussinessUserPostAnAd(formData, (res) => {
          this.props.disableLoading()
          if (res.status === 200) {
            toastr.success(langs.success, MESSAGES.POST_ADD_SUCCESS);
            let data = {
              hide_mob_number: false,
            }
            this.props.setAdPostData(data, 'preview');
              if (selectedPlan.package_slug === 'Free') {
                this.setState({ isSubmitted: true });
              } else {
                this.props.nextStep(res);
              }
            } else {
              this.props.history.push('/dashboard')
            }
        });
      } else {
        console.log('case private')
        this.props.postAnAd(formData, (res) => {
          this.props.disableLoading()
          if (res.status === 201) {
            toastr.success(langs.success, MESSAGES.POST_ADD_SUCCESS);
            let data = {
              hide_mob_number: false,
            }
            this.props.setAdPostData(data, 'preview');
              if (selectedPlan.package_slug === 'Free') {
                this.setState({ isSubmitted: true });
              } else {
                this.props.nextStep(res);
              }
            } else {
              this.props.history.push('/')
            }
        });
      }
  }


  adPostRetail = (value,memberShipId) => {
    const {categoryType, lat, long, userDetails, step1, attributes,allAttribute,loggedInDetail } = this.props;
    const { data, address, hide_mob_number, mobile_no, isNumberVarify, classified_type } = this.state;
    const { id, email } = this.props.loggedInUser;
    let temp = []
    allAttribute.fileList && Array.isArray(allAttribute.fileList) && allAttribute.fileList.filter((el) => {
      el.originFileObj && temp.push(el.originFileObj)
    })
    
    const requestData = {
      attributes,
      inv_attribute_groups: allAttribute.inv_attribute_groups,
      user_id: id,
      contact_email: email,
      contact_name: value.contact_name + ' ' + value.lname,
      contact_mobile: value.contact_mobile ? value.contact_mobile : this.props.userDetails.mobile_no,
      hide_mob_number: hide_mob_number === true ? 1 : 0,
      lat: data ? data.lat : lat,
      lng: data ? data.lng : long,
      state_id: data ? data.state_id : userDetails.state,
      subregions_id: data ? data.subregions_id : userDetails.city,
      description: allAttribute.description,
      title: allAttribute.title,
      location: data ? data.location : address,
      parent_categoryid: step1.parent_categoryid,
      category_id: step1.category_id,
      child_category_id :step1.child_category_id ? step1.child_category_id : '',
      ['image[]']: temp,
      price:allAttribute.price,

      brand_name : allAttribute.brand_name,
      other_notes: allAttribute.other_notes,
      features :allAttribute.features,
      condition : allAttribute.condition,
      brand : allAttribute.brand,
      shipping: allAttribute.shipping ? allAttribute.shipping : 0,
      // inventory_attributes:allAttribute.inventory_attributes,
      shippingArray: allAttribute.shippingArray,
      GST_tax_percent :allAttribute.percentageAmount  && allAttribute.percentageAmount.GST_percentage ? allAttribute.percentageAmount.GST_percentage : 0 ,
      formee_commision_tax_amount: allAttribute.comissionAmount ? allAttribute.comissionAmount : 0,
      GST_tax_amount : allAttribute.gstAmount ? allAttribute.gstAmount : 0,
      formee_commision_tax_percent : allAttribute.percentageAmount  && allAttribute.percentageAmount.Formee_commission_percentage ? allAttribute.percentageAmount.Formee_commission_percentage : 0,
      images: temp,
      has_dimension : allAttribute.has_dimension,
      length_unit: allAttribute.length_unit,
      length: allAttribute.length,
      width: allAttribute.width,
      height: allAttribute.height,
      weight_unit: allAttribute.weight_unit,
      is_premium_parent_cat :0,
      pay_pal: 'on',
      weight : allAttribute.weight,
      price_type :'amount',
      is_premium_sub_cat :0,
      has_weight : allAttribute.has_weight,
      quantity: allAttribute.total_quantity ? allAttribute.total_quantity : 10,
      returns_accepted: allAttribute.returns_accepted,
      exclude_out_of_stock: allAttribute.exclude_out_of_stock
    };

    
    if (loggedInDetail.user_type !== langs.key.private) {
      requestData.contact_title = value.contact_name + ' ' + value.lname
      requestData.classified_type = classified_type ? classified_type : ''
      requestData.membership_plan_user_id = memberShipId ? memberShipId : ''
    }

    console.log('requestData', requestData)
    const formData = new FormData()
    for (var i = 0; i < temp.length; i++) {
      formData.append('image[]', temp[i]);
      
    }
    Object.keys(requestData).forEach((key) => {
      if (typeof requestData[key] == 'object' && key !== 'image[]' && key !== 'shippingArray') {
        formData.append(key, JSON.stringify(requestData[key]))
      }else if (key === 'shippingArray') {
        requestData[key].length && requestData[key].map((el, i) => {
          formData.append(`ship_name_${i + 1}`, el.ship_name);
          formData.append(`ship_amount_${i + 1}`, el.ship_amount);
          formData.append(`delivery_time_${i + 1}`, el.delivery_time);
        })
      } else {
        formData.append(key, requestData[key])
      }
    })
    
    
    if(categoryType === 'retail') {
      this.props.enableLoading()
        this.props.retailPostanAdAPI(formData, (res) => {
          // this.props.bussinessUserPostAnAd(formData, (res) => {
          this.props.disableLoading()
          if (res.status === 200) {
            toastr.success(langs.success, MESSAGES.POST_ADD_SUCCESS);
            let data = {
              hide_mob_number: false,
            }
            this.props.setAdPostData(data, 'preview');
            this.props.history.push('/')
          }
        });
    } 
  }

 

  /** 
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field 
   */
  handleAddress = (result, address, latLng) => {
    let state = '';
    let city = '';
    result.address_components.map((el) => {
      if (el.types[0] === 'administrative_area_level_1') {
        state = el.long_name
      } else if (el.types[0] === 'administrative_area_level_2') {
        city = el.long_name
      }
    })
    this.formRef.current.setFieldsValue({
      address: address
    });
    this.changeAddress(address, latLng, state, city)
  }

  /**
   * @method changeAddress
   * @description Split out Address city post code
   */
  changeAddress = (add, latLng, state, city) => {
    const { hide_mob_number, mobileNo } = this.state
    let address = {
      location: add,
      lat: latLng.lat,
      lng: latLng.lng,
      state_id: state,
      subregions_id: city,
    };
    this.setState({ data: address, address: add });
    // let data = {
    //   hide_mob_number: hide_mob_number,
    //   mobileNo: mobileNo ? mobileNo : this.props.userDetails.mobile_no,
    //   address: address ? address.location : this.props.userDetails.location
    // }
    // this.props.setAdPostData(data, 'preview');
  };

  /**
   * @method PreviewAd
   * @description contact model
   */
  PreviewAd = () => {
    const { step1 } = this.props;
    if (step1.templateName === 'job') {
      this.setState({
        visibleJob: true,
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = (e) => {
    this.setState({
      visible: false,
      visibleJob: false,
      otpModalVisible: false
    });
  };

  /**
   * @method handleCheck
   * @description handle mobile check uncheck
   */
  handleCheck = (e) => {
    const { mobileNo, hide_mob_number } = this.state
    this.setState({ hide_mob_number: e.target.checked })
    // let data = {
    //   hide_mob_number: e.target.checked,
    //   mobileNo: mobileNo ? mobileNo : this.props.userDetails.mobile_no
    // }
    // this.props.setAdPostData(data, 'preview');
  }

  /**
   * @method renderRadio
   * @description render radio button
   */
  renderCheckBox = () => {
    return (
      <div className='show-on-myad'>
        <Form.Item name='hide_mob_number' valuePropName='checked'>
          <Checkbox onChange={this.handleCheck}> {'Show on my ad'}</Checkbox>
        </Form.Item>
      </div>
    );
  };

  /**
  * @method varifyNumber
  * @description varify number
  */
  varifyNumber = () => {
    const { mobileNo } = this.state;
    let number = mobileNo ? mobileNo : this.props.userDetails.mobile_no
    this.props.sendOtp(number, res => {
      
      toastr.success('success', 'otp has been sent successfully')
      this.setState({ otpModalVisible: true })
      if (res.data && res.data.status === 'SUCCESS') {
      } else {
        toastr.error('error', res.data && res.data.message)
      }
    })
  }

  changeMobile = () => {
    const { mobileNo } = this.state
    const reqData = {
      user_id: this.props.userDetails.id,
      phonecode: +61,
      mobileno: mobileNo ? mobileNo : this.props.userDetails.mobile_no
    }
    this.props.changeMobNo(reqData, (res) => { })
  }

  handleMobileNumber = (e) => {
    const { mobileNo, hide_mob_number } = this.state
    var IndNum = /^[0]?[0-9]+$/;
    if (e.target.value && IndNum.test(e.target.value) && (e.target.value.length >= 10 && e.target.value.length <= 12)) {
      this.setState({ mobileNo: e.target.value, isVisible: true })
      // let data = {
      //   hide_mob_number: hide_mob_number,
      //   mobileNo: e.target.value ? e.target.value : this.props.userDetails.mobile_no
      // }
      // this.props.setAdPostData(data, 'preview');
    } else {
      this.setState({ isVisible: false })
    }
  }

  handleRadioCheck = e => {
    
    this.setState({
      classified_type: e.target.value,
    });
  };

  /**
  * @method getCurrentLocation
  * @description get current location
  */
  getCurrentLocation = () => {
    const { lat, long } = this.props
    getAddress(lat, long, res => {
      
      let state = '';
      let city = '';
      let pincode = ''
      res.address_components.map((el) => {
        if (el.types[0] === 'administrative_area_level_1') {
          state = el.long_name
        } else if (el.types[0] === 'administrative_area_level_2') {
          city = el.long_name
        } else if (el.types[0] === 'postal_code') {
          this.setState({ postal_code: el.long_name })
          pincode = el.long_name
          this.formRef.current.setFieldsValue({
            pincode: el.long_name
          });
        }
      })
      
      let address = {
        location: res.formatted_address,
        lat: lat,
        lng: long,
        state_id: state,
        subregions_id: city,
      };
      this.setState({ data: address, address: res.formatted_address });
    })
  }



  /**
   * @method render
   * @description render component
   */
  render() {
    const { name } = this.props.userDetails;
    const { hide_mob_number, classified_type, visible, address, visibleJob, otpModalVisible, mobileNo, isNumberVarify, isVisible } = this.state;
    const { step1, adPermissionData,categoryType } = this.props;
    let isFeatured = false, parent_premium = false, child_premium = false
    if (adPermissionData && adPermissionData !== undefined) {
      const packageData = adPermissionData && Array.isArray(adPermissionData.package) && adPermissionData.package.length ? adPermissionData.package[0] : ''
      isFeatured = packageData.is_featured_ads == 1 && (packageData.featured_credit <= packageData.featured_ads_count && packageData.featured_credit > 0)
      parent_premium = packageData.is_premium_parent_cat == 1 && (packageData.premium_parent_credit <= packageData.premium_parent_count && packageData.premium_parent_credit > 0)
      child_premium = packageData.is_premium_sub_cat == 1 && (packageData.premium_child_credit <= packageData.premium_child_count && packageData.premium_child_credit > 0)
      
      
      
    }

    return (
      <Fragment>
        <div className='wrap'>
          <div className='post-ad-box'>
            {categoryType === 'retail' ? RetailNavBar(step1) : NavBar(step1)}
            <Form
              layout='vertical'
              onFinish={this.onFinish}
              ref={this.formRef}
            // initialValues={this.getInitialValue()}
            >
              <div className='card-container signup-tab'>
                <Tabs type='card'>
                  <TabPane
                    tab='Yours Details'
                    key='1'
                  >
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item
                          label='First Name'
                          name='contact_name'
                          className='label-large'
                          rules={[required('First name')]}
                        >
                          <Input value={'hdgfhjdghj'} size='large' />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label='Last Name'
                          name='lname'
                          className='label-large'
                          rules={[required('Last name')]}
                        >
                          <Input size='large' />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={12}>
                      <Col span={24}>
                        <Form.Item
                          label='Contact Number'
                          name='contact_mobile'
                          className='label-large'
                          onChange={this.handleMobileNumber}
                          rules={[{ validator: validMobile }]}
                        >
                          <Input type={'text'} size='large' />
                        </Form.Item>
                        {/* {isNumberVarify && this.renderCheckBox()} */}
                        {this.renderCheckBox()}
                      </Col>
                    </Row>
                    {/* {isVisible && !isNumberVarify && <Row gutter={12}>
                      <Col span={24}><label onClick={this.varifyNumber} className='blue-link'>Varify number</label></Col>
                    </Row>} */}
                    <Row gutter={28}>
                      <Col span={24}>
                        <Form.Item
                          label='Locate your address'
                          name='address'
                          className='label-large'
                          rules={(address === '' || address === undefined || address === 'N/A' || address === null) && [required('Address')]}
                        >
                          <PlacesAutocomplete
                            name='address'
                            handleAddress={this.handleAddress}
                            addressValue={this.state.address}
                            clearAddress={(add) => {
                              this.formRef.current.setFieldsValue({
                                address: ''
                              });

                              this.setState({
                                address: ''
                              })
                            }}
                          />
                        </Form.Item>
                        <div
                          className='fs-14 text-blue use-current-location-text use-current-location-custom'
                          onClick={this.getCurrentLocation}
                          style={{ cursor: 'pointer' }}
                        >
                          <Icon icon='location' size='13' />
                          Use my current location
                        </div>
                        <div className='fs-12 pl-2'>Location is used in search results and appears on your ad.</div>
                      </Col>
                    </Row>
                    <div className='mb-15 mt-15'>
                      <Form.Item
                        name='classified_type'
                      // rules={[required('')]}
                      >
                        <Radio.Group onChange={this.handleRadioCheck} value={classified_type}>
                          {isFeatured && <Radio className='label-large' value={'featured'}>Featured</Radio>}
                          {parent_premium && <Radio className='label-large' value={'premium_parent'}>Parent Premium</Radio>}
                          {child_premium && <Radio className='label-large' value={'premium_child'}>Child Premium</Radio>}

                          {/* <Radio className='label-large' value={'featured'}>Featured</Radio>
                          <Radio className='label-large' value={'premium_parent'}>Parent Premium</Radio>
                          <Radio className='label-large' value={'premium_child'}>Child Premium</Radio> */}
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </TabPane>
                </Tabs>
                {/* <div className='inner-box'>
                  <div className='mb-15'>
                    <Form.Item name='agreement' valuePropName='checked' className='label-large' noStyle>
                      <Checkbox className='label-large'>Link to your website for $5</Checkbox>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item name='url_link' noStyle>
                      <Input size='large' className='add-on-before-url' addonBefore='http://www.' />
                    </Form.Item>
                  </div>
                </div> */}
              </div>
              <Row gutter={[40, 0]} className='mb-50 mt-50'>
                <Col span={12} className='align-right'>
                  <Button type='default' danger onClick={this.PreviewAd} className='text-black'>
                    {'Preview Ad'}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button htmlType='submit' type='primary' danger className='custom-btn'>
                    {'Post an Ad'}
                  </Button>
                </Col>
              </Row>
            </Form>

            {visible && <Preview
              visible={visible}
              onCancel={this.handleCancel}
              hide_mob_number={hide_mob_number}
              address={address}
              mobileNo={mobileNo ? mobileNo : this.props.userDetails.mobile_no}
            />}
            {visibleJob && <JobModel visible={visibleJob} onCancel={this.handleCancel} />}
            {otpModalVisible &&
              <SendOtpModal visible={otpModalVisible}
                onCancel={this.handleCancel}
                mobileNo={mobileNo ? mobileNo : this.props.userDetails.mobile_no}
                callNext={(varify) => this.setState({ isNumberVarify: varify })}
                editNumberAPI={this.changeMobile}
              />}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, postAd, common } = store;
  const {step1, attributes, step3, step4, allImages, setAdPostData, step2 } = postAd;
  const { location } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    step1,
    lat: location ? location.lat : '',
    long: location ? location.long : '',
    attributes: attributes.attributevalue,
    allAttribute: attributes,
    step3,
    step4,
    allImages,
    inspection_time: attributes.inspection_time
  };
};
export default connect(mapStateToProps, {postAnAd, bussinessUserPostAnAd, subscriptionPlan, enableLoading, disableLoading, setAdPostData, retailPostanAdAPI, sendOtp })(Step4);
