import React, { Fragment } from 'react';
import moment from 'moment'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import { toastr } from 'react-redux-toastr'
import 'react-quill/dist/quill.snow.css';
// import AppSidebar from '../../../../dashboard-sidebar/DashboardSidebar';
import AppSidebar from '../../../../sidebar/HomeSideBarbar';
import history from '../../../../../common/History';
import { DASHBOARD_KEYS } from '../../../../../config/Constant'
import {InputNumber, Select, Layout, Typography, DatePicker, TimePicker, Row, Col, message, Upload, Form, Checkbox, Radio, Tabs, Button, Collapse, Input } from 'antd';
import Icon from '../../../../customIcons/customIcons';
import { langs } from '../../../../../config/localization';
import '../../../../auth/registration/style.less';
import { renderField } from '../../../../forminput'
import { required, validMobile, validNumber } from '../../../../../config/FormValidation'
import { getAddress, converInUpperCase } from '../../../../common'
import { enableLoading, disableLoading, getRetailCategoryDetail } from '../../../../../actions'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {getGSTPercentage,getAllBrandsAPI, deleteInspectionAPI, updateRetailClassified, getChildInput, getClassifiedDynamicInput, setAdPostData, getRetailPostAdDetail } from '../../../../../actions'
import { QUESTION_TYPES } from '../../../../../config/Config'
import PlacesAutocomplete from '../../../../common/LocationInput';
import Preview from './Preview'
import JobPreview from './PreviewJobModel'
import MembershipPlan from './Payment'
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select
const { Title, Paragraph } = Typography;
const rules = [required('')];
const uploadButton = (
  <div>
    <PlusOutlined />
    <div className='ant-upload-text'>Upload</div>
    <img src={require('../../../../../assets/images/icons/upload-small.svg')} alt='upload' />
  </div>
);

class Step3 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      attribute: [],
      label: false,
      otherAttribute: [],
      specification: '',
      fileList: [],
      Question1: false,
      Question2: false,
      Question3: false,
      questions: [],
      textInputs: [{
        question: ``,
        ans_type: QUESTION_TYPES.TEXT,
        options: [],
        ansInputs: []
      }],
      // ansInputs: []
      inspectiontime: [],
      initial: false, address: '',
      adPostDetail: '',
      byAppointment: false,
      weekly: false,
      singleDate: false,
      data: '', specification: '', inspectionPreview: [],
      classifiedDetail: '', jobModal: false, paymentScreen: false, formData: '',
      brandList:[],
      shipping: [],
      percentageAmount:'',
      shipmentVisible: false,
      comissionAmount:'',
      gstAmount:'',
      group_attribute: []
    };
  }

  /**
   * @method componentWillMount
   * @description called after render the component
   */
  componentWillMount() {
    this.props.enableLoading()
    this.getRetailPostAdDetails()
  }

   /**
   * @method getRetailPostAdDetails
   * @description get retail post an ad detail
   */
  getRetailPostAdDetails = () => {
    const { loggedInUser, userDetails } = this.props
    let catId = this.props.match.params.adId
    this.getBrandsList(catId)
    this.props.getGSTPercentage(res => {
      if(res.status === 200){
        let data = res.data && res.data.data
        this.setState({percentageAmount: data})
      }
    })
    let reqData = {
      id: catId,
      user_id: loggedInUser.id
    }
    this.props.getRetailPostAdDetail(reqData, res => {
      this.props.disableLoading()
      
      if (res.status === 200) {
        let data = res.data.data
        
        const atr = data && Array.isArray(data.classified_attribute) && data.classified_attribute.length ? data.classified_attribute : [];
        const mandate = atr.filter(el => el.validation === 1)
        const optional = atr.filter(el => el.validation === 0)
        let allAtt = [...mandate, ...optional]
        let temp =[]
        let group_attribute = data && data.inv_attribute_group && Array.isArray(data.inv_attribute_group) ? data.inv_attribute_group : []
        group_attribute && group_attribute.length && group_attribute.map((el,i) => {
          let childAtt = el && el.inv_attributes && Array.isArray(el.inv_attributes) && el.inv_attributes.length ? el.inv_attributes : []
          childAtt && childAtt.length && childAtt.map((el2,i) => {
            temp.push(el2)
          })
        })
        this.setState({ group_attribute: group_attribute, allgroupAtt:temp })
        this.getDefaultINVAttribute(allAtt)
        this.getInitialvalueofGroupAtt(temp)
        this.getAllInitialValue(data, mandate, optional)
        this.getClassifiedDetails(catId)
      }
    })
  }

  /**
   * @method getInitialvalueofGroupAtt
   * @description get initial value of group attributes
   */
  getInitialvalueofGroupAtt = (data) => {
    if (data && data.length) {
      
      data.map((el, i) => {
        
        this.formRef.current && this.formRef.current.setFieldsValue({
          [`${el.display_name}${el.id}${el.pivot.inv_group_id}`]: (el.selectedvalue)
        })
      })
    }
  }

  /**
   * @method getClassifiedDetails
   * @description get retail classifieds details
   */
  getClassifiedDetails = (catId) => {
    const { isLoggedIn, loggedInUser } = this.props
    let reqData = {
      id: catId,
      user_id: isLoggedIn ? loggedInUser.id : ''
    }
    this.props.getRetailCategoryDetail(reqData, (res) => {
      this.props.disableLoading()
      if (res.status === 200) {
        this.setState({ classifiedDetail: res.data })
      }
    })
  }

  /**
   * @method getBrandsList
   * @description render dynamic input
   */
  getBrandsList = (id) => {
    let reqData = {
      category_id:160,
      //category_id:id
    }
    this.props.getAllBrandsAPI(reqData, res => {
      if(res.status === 200){
        let data = res.data && res.data.data
        
        this.setState({brandList:data})
      }
    })
  }

  /**
   * @method getAllInitialValue
   * @description get all initial values
   */
  getAllInitialValue = (data, mandate, optional) => {
    let predefinedImages = [];
    data.classified_image && data.classified_image.map((el, index) => {
      predefinedImages.push({
        uid: `-${index}`,
        name: 'image.png',
        status: 'done',
        isPrevious: true,
        url: `${el.image_url}`,
        type: 'image/jpeg',
        size: '1024',
      })
    })
    const {
      contact_name,
      contact_email,
      title, fname, laname,
      price, description, contact_mobile, category_name, subcategory_name,sub_sub_category_name,
      hide_mob_number, location, brand,other_notes,features,condition,brand_name,
      commission_amount,gst_amount, shipping,ship_name_1,ship_name_2, ship_name_3,ship_amount_1,ship_amount_2,ship_amount_3
    } = data;
    
    let final_price = Number(commission_amount ? commission_amount : 0) + Number(gst_amount ? gst_amount : 0) + Number(price ? price : 0)
    this.formRef.current && this.formRef.current.setFieldsValue({
      fname: fname ? converInUpperCase(fname) : '',
      lname: laname ? converInUpperCase(laname) : '',
      contact_email,
      title, description,
      brand:brand,
      price: price ? parseInt(price) : '',
      final_price: parseInt(final_price) ,
      other_notes:other_notes,
      features:features,
      brand_name: brand_name,
      parent_categoryid: category_name,
      category_id: sub_sub_category_name ? sub_sub_category_name : subcategory_name,
      condition:condition,
      shipment: String(shipping),
      contact_mobile: contact_mobile && contact_mobile !== 'N/A' ? contact_mobile : '',
      hide_mob_number: hide_mob_number ? hide_mob_number : false,
      address: location,
      inspection_type: data.inspection_type,
      ship_name_1: ship_name_1, ship_amount_1:ship_amount_1,
      ship_name_2: ship_name_2, ship_amount_2:ship_amount_2,
      ship_name_3: ship_name_3, ship_amount_3:ship_amount_3,
    });
    
    this.setState({
      adPostDetail: data,
      address: data.location,
      attribute: mandate,
      otherAttribute: optional,
      fileList: predefinedImages,
      shipmentVisible: String(shipping) === '1' ? true : false 
    })
  }

  /**
   * @method getDefaultINVAttribute
   * @description get default inv attributes
   */
  getDefaultINVAttribute = (allAtt) => {
    if (allAtt && allAtt.length) {
      
      allAtt.map((el) => {
        
        if (el.attr_type_name === 'calendar') {
          let d = new Date(el.selectedvalue)
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.att_name]: moment(d)
          });
        } else if (el.attr_type_name === 'Drop-Down') {
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.att_name]: Number(el.selectedvalue)
          });
        } else if (el.attr_type_name === 'Radio-button') {
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.att_name]: Number(el.selectedvalue)
          });
        } else if (el.attr_type_name === 'Multi-Select') {
          
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.att_name]: el.selectedvalue ? (el.selectedvalue.split(',')) : ''
          });
        } else {
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.att_name]: (el.selectedvalue)
          });
        }
      })
    }
  }

  /**
   * @method renderItem
   * @description render dynamic input
   */
  renderItem = () => {
    const { attribute } = this.state;
    if (attribute && attribute.length) {
      return attribute.map((data, i) => {
        return (
          <div key={i}>
            {renderField(data, data.attr_type_name, data.value)}
          </div>
        )
      });
    }
  }

  /**
  * @method renderOtherItem
  * @description render dynamic input
  */
  renderOtherItem = () => {
    const { otherAttribute } = this.state;
    if (otherAttribute && otherAttribute.length) {
      return otherAttribute.map((data, i) => {
        return (
          <div key={i}>
            {renderField(data, data.attr_type_name, data.value, this.child)}
          </div>
        )
      });
    }
  }

  /**
   * @method onFinish
   * @description handle submit form 
   */
  onFinish = (value) => {
    this.getAttributes(value);
  };

  /**
   * @method handlePrice
   * @description handle price change
   */
  handlePrice = ({ target: { value } }) => {
    
    const { percentageAmount } = this.state
    if(percentageAmount){
      let gstAmount = (value * percentageAmount.GST_percentage)/100 
      let comissionAmount = (value * percentageAmount.Formee_commission_percentage)/100 
      let total = gstAmount + comissionAmount + Number(value)
      this.setState({gstAmount: gstAmount,comissionAmount: comissionAmount})
      
      this.formRef.current && this.formRef.current.setFieldsValue({
        final_price: parseInt(total)
      });
    }
  }


  /**
  * @method getAttributes
  * @description formate attributes value
  */
  getAttributes = (value) => {
    
    const {allgroupAtt,gstAmount,comissionAmount,percentageAmount, data, attribute, otherAttribute, fileList, textInputs, hide_mob_number, adPostDetail } = this.state;
    const { loggedInUser } = this.props
    let temp = {}, specification = [], price = '',groupAtt = {}
    let temp2 = []
    let allDynamicAttribute = [...otherAttribute, ...attribute]
    Object.keys(value).filter(function (key, index) {
      
      if (value[key] !== undefined) {
        allDynamicAttribute.map((el, index) => {
          if (el.att_name === key) {
            let att = allDynamicAttribute[index]
            
            if (el.att_name === 'Price') {
              price = value[key]
            }
            let dropDropwnValue, checkedValue;
            if (att.attr_type_name === 'Radio-button') {
              let selectedValueIndex = att.value.findIndex((el) => (el.id === value[key] || el.name === value[key]))
              checkedValue = att.value[selectedValueIndex]
              
            }
            if (att.attr_type_name === 'Drop-Down') {
              let selectedValueIndex = att.value.findIndex((el) => (el.id === value[key] || el.name === value[key]))
              
              
              dropDropwnValue = att.value[selectedValueIndex]
              
            }

            temp[att.att_id] = {
              // name: att.att_name,
              attr_type_id: att.attr_type,
              attr_value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue.id : (att.attr_type_name === 'calendar') ? moment(value[key]).format('YYYY') : (att.attr_type_name === 'Date') ? moment(value[key]).format('MMMM Do YYYY, h:mm:ss a') : att.attr_type_name === 'Radio-button' ? checkedValue.id : value[key],
              parent_value_id: 0,
              parent_attribute_id: (att.attr_type_name === 'Drop-Down') ? att.att_id : 0,
              attr_type_name: att.attr_type_name
            };
            
            specification.push({
              key: att.att_name,
              value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue.name : (att.attr_type_name === 'calendar') ? moment(value[key]).format('YYYY') : (att.attr_type_name === 'Date') ? moment(value[key]).format('MMMM Do YYYY, h:mm:ss a') : att.attr_type_name === 'Radio-button' ? checkedValue.name : value[key]
            })
            temp2.push({
              key: att.att_name,
              type: att.attr_type_name,
              value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue.name : (att.attr_type_name === 'calendar') ? value[key] : (att.attr_type_name === 'Date') ? value[key] : value[key]
            })
          }
        })
      }
    })
    let tempArray = [], tempArray2=[]
    
    Object.keys(value).filter(function (key, index) {
      allgroupAtt && allgroupAtt.length && allgroupAtt.map((el2,i) => {
        
        
        if (`${el2.display_name}${el2.id}${el2.pivot.inv_group_id}` == key) {
          
          //
          if(groupAtt[el2.pivot.inv_group_id] !== undefined){
            groupAtt[el2.pivot.inv_group_id] = [...groupAtt[el2.pivot.inv_group_id],{
              inv_attribute_id : el2.id,
              inv_attribute_value : value[key],
              //image: el2.have_image === 1  && this.state[`${el2.display_name}${el2.pivot.inv_group_id}`] ? this.state[`${el2.display_name}${el2.pivot.inv_group_id}`] : []
              image:[]
            }];
          }else {
            groupAtt[el2.pivot.inv_group_id] = [{
              inv_attribute_id : el2.id,
              inv_attribute_value : value[key],
              //image: el2.have_image === 1  && this.state[`${el2.display_name}${el2.pivot.inv_group_id}`] ? this.state[`${el2.display_name}${el2.pivot.inv_group_id}`] : [],
              image:[]
            }];
          }
          tempArray.push({
            key: key,
            value: value[key]
          })
        }
      })
    })
    const { adId } = this.props.match.params
    const reqData = {
      id: adId,
      parent_categoryid: adPostDetail.parent_categoryid,
      category_id: adPostDetail.category_id,
      child_category_id : adPostDetail.child_category_id,
      attributes: temp,
      inv_attribute_groups:groupAtt,
      user_id: loggedInUser.id,
      price: value.price ? value.price : '',
      contact_email: adPostDetail.contact_email,
      contact_name: adPostDetail.contact_name ? adPostDetail.contact_name : value.fname + '' + value.lname,
      contact_mobile: adPostDetail.contact_mobile ? adPostDetail.contact_mobile : value.contact_mobile,
      hide_mob_number: hide_mob_number ? 1 : 0,
      description: value.description,
      title: value.title,
      lng: data && data.lng ? data.lng : adPostDetail.lng ? adPostDetail.lng : 151.2092955,
      lat: data && data.lat ? data.lat : adPostDetail.lat ? adPostDetail.lat : -33.8688197,
      state_id: data && data.state_id ? data.state_id : adPostDetail.state_id ? adPostDetail.state_id : '',
      subregions_id: data && data.subregions_id ? data.subregions_id : adPostDetail.subregions_id ? adPostDetail.subregions_id : '',
      location: data && data.address ? data.address : adPostDetail.location ? adPostDetail.location : '',
      quantity: 1,
      fileList: fileList,
     
      brand_name : value.brand_name ? value.brand_name : adPostDetail.brand_name,
      other_notes: value.other_notes ? value.other_notes : adPostDetail.other_notes,
      features :value.features ? value.features : adPostDetail.features,
      condition : value.condition ? value.condition : adPostDetail.condition,
      brand : value.brand ? value.brand : adPostDetail.brand,
      shipping: value.shipment ? value.shipment : adPostDetail.shipping,

      GST_tax_percent :percentageAmount  && percentageAmount.GST_percentage ? percentageAmount.GST_percentage : adPostDetail.gst_percent ,
      formee_commision_tax_amount: comissionAmount ? comissionAmount : adPostDetail.commission_amount,
      GST_tax_amount : gstAmount ? gstAmount : adPostDetail.gst_amount,
      formee_commision_tax_percent :percentageAmount  && percentageAmount.Formee_commission_percentage ? percentageAmount.Formee_commission_percentage : adPostDetail.commission_percent,

      ship_name_1: value.ship_name_1 ? value.ship_name_1 : adPostDetail.ship_name_1, 
      ship_amount_1:value.ship_amount_1 ? value.ship_amount_1 : adPostDetail.ship_amount_1,
      ship_name_2: value.ship_name_2 ? value.ship_name_2 : adPostDetail.ship_name_2, 
      ship_amount_2: value.ship_amount_2 ? value.ship_amount_2 : adPostDetail.ship_amount_2,
      ship_name_3: value.ship_name_3 ? value.ship_name_3 : adPostDetail.ship_name_3, 
      ship_amount_3: value.ship_amount_3 ? value.ship_amount_3 :  adPostDetail.ship_amount_3,

      weight_unit:'grams',
      is_premium_parent_cat :0,
      pay_pal: 'on',
      weight :10.0,
      price_type :'amount',
      is_premium_sub_cat :0,
      has_weight :0,
      has_dimension :0,
      length_unit:'Inch',
      width:0.0,
    };
    
    const formData = new FormData()
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == 'object' && key !== 'fileList') {
        formData.append(key, JSON.stringify(reqData[key]))
      } else if (key === 'fileList') {
        let data = []
        reqData[key].length && reqData[key].map((e, i) => {
          
          
          formData.append(`image${i + 1}`, reqData[key][i].originFileObj);
        })
      } else {
        formData.append(key, reqData[key])
      }
    })
    this.setState({ specification: specification, inspectionPreview: '' })
    this.props.enableLoading()
    this.props.updateRetailClassified(formData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        toastr.success('success', 'Your post has been updated successfully')
        this.getRetailPostAdDetails()
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        this.props.history.push('/my-ads')
      }
    })
  }

 
  onChange = ({ file, fileList }) => {
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      this.setState({ fileList });
    }
  }

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  handleMobileNumber = (e) => {
    const { mobileNo, hide_mob_number } = this.state
    var IndNum = /^[0]?[0-9]+$/;
    if (e.target.value && IndNum.test(e.target.value) && (e.target.value.length >= 10 && e.target.value.length <= 12)) {
      this.setState({ mobileNo: e.target.value, isVisible: true })
    } else {
      this.setState({ isVisible: false })
    }
  }

  /**
  * @method renderRadio
  * @description render radio button
  */
  renderCheckBox = () => {
    const { adPostDetail } = this.state
    return (
      <div className='show-on-myad'>
        <Form.Item name='hide_mob_number' valuePropName='checked'>
          <Checkbox onChange={this.handleCheck}> {'Show on my ad'}</Checkbox>
        </Form.Item>
      </div>
    );
  };

  /**
   * @method handleCheck
   * @description handle mobile check uncheck
   */
  handleCheck = (e) => {
    const { mobileNo, hide_mob_number } = this.state
    this.setState({ hide_mob_number: e.target.checked })
  }

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
  };

   /**
   * @method renderBrandList
   * @description render branbds list options
   */
  renderBrandList = (brand) => {
    if(brand.length !== 0){
      return (
        brand.map((el, i) => {
          return (
            <Option key={i} value={el.name}>
              {el.name}
            </Option>
          );
        })
      );
    }
  };

  /**
   * @method renderDynamicAttOption
   * @description render dynamic attribute option
   */
  renderDynamicAttOption = (value) => {
    if(value && value.length !== 0){
      return (
        value.map((el, i) => {
          return (
            <Option key={i} value={el.value}>
              {el.value}
            </Option>
          );
        })
      );
    }
  }

  /**
   * @method renderProductImage
   * @description render product images
   */
  renderProductImage = (name, i) => {
    const uploadButton = (
      <div>
        <img src={require('../../../../../assets/images/icons/upload.svg')} alt='upload' />
      </div>
    );
    return (
      <div>
       <Form.Item
          label='Add Product Images'
          name={`${name}_image_${i}`}
          className='label-large'
        >
        <ul className='pl-0'>
          <li>Add upto 8 images or upgrade to include more</li>
          <li >Maximum File size 4MB</li>
        </ul>
        <Upload
          name='avatar'
          listType='picture-card'
          className='avatar-uploader'
          showUploadList={true}
          fileList={this.state[`${name}${i}`]}
          customRequest={this.dummyRequest}
          onChange={({ file, fileList }) => this.onChange(file, fileList, name, i)}
        >
          {this.state[`${name}${i}`] && this.state[`${name}${i}`].length >= 8 ? null : uploadButton}
          {/* {uploadButton} */}
        </Upload>
      </Form.Item>
    </div>
    )
  }

  /**
   * @method renderChildAttribute
   * @description render child attributes
   */
  renderChildAttribute = (item, index) => {
    
    let childAtt = item && item.inv_attributes && Array.isArray(item.inv_attributes) && item.inv_attributes.length ? item.inv_attributes : []
    if(childAtt && childAtt.length){
      return childAtt.map((el,i)=> {
        return (
          <div key={i}>
            {el.have_image === 1 && this.renderProductImage(el.display_name,item.id)}
            <div>
              <Form.Item
                label={el.display_name}
                name={`${`${el.display_name}${el.id}${item.id}`}`}
              >
                <Select
                  allowClear
                  size={'large'}
                  className='w-100'
                >
                  {this.renderDynamicAttOption(el.values)}
              </Select>
            </Form.Item>
          </div>
        </div>
        )
      })
    }
  }

  /**
   * @method render
   * @description render component
   */
  renderGroupAttribute = () => {
    const { group_attribute } = this.state;
    
    if(group_attribute && group_attribute.length){
      return group_attribute.map((el, i) => {
        let childAtt = el && el.inv_attributes && Array.isArray(el.inv_attributes) && el.inv_attributes.length ? el.inv_attributes : ''
        return (
          <div>
            <h3>{childAtt && el.name}</h3>
            {this.renderChildAttribute(el, i)}
          </div>
        )
      })
    }
  }

  renderShipMent = () => {
    return (
      <Form.List name="shipping">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                    <div key={field.key}>
                    <Row gutter={10}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Form.Item
                          label={[field.label, "Shipping Name"]}
                          name={[field.name, "ship_name"]}
                          fieldKey={[field.fieldKey, "ship_name"]}
                          rules={rules}
                        >
                          <Input placeholder="Shipping Name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <Form.Item
                          label={[field.label, "Price"]}
                          name={[field.name, "ship_amount"]}
                          fieldKey={[field.fieldKey, "ship_amount"]}
                          rules={[{ validator: validNumber }]}
                        >
                          {/* <Input placeholder="Price AUD" type='number' /> */}
                          <InputNumber
                                className="price-number"
                                placeholder="Price"
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                        {<MinusCircleOutlined
                        title={'Add More'}
                        onClick={() => remove(field.name)}
                      />}
                      </Col>
                    </Row>
                  </div>
                ))}
               <Form.Item className="mb-0 add-card-link-mb-0">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <div className="add-more-size">
                          <div onClick={() => add()}>
                            <img src={require('../../../../../assets/images/icons/plus-circle.svg')} alt='Add' />
                            <div>Add More</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Form.Item>
              </div>
            );
          }}
        </Form.List>
    )
  }

  renderShipmentElement = () => {
    let temp = [1,2,3];
      return (
        <div className="shipment-grid-block">
          <Row gutter={20}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className="shipname">
                <Form.Item
                  label='Shippling Name'
                  name={`ship_name_1`}
                  className='label-large'
                >
                  <Input/>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className="price">
                <Form.Item
                    label='Price'
                    name={`ship_amount_1`}
                    className='label-large'
                  >
                    <Input type='number'/>
                  </Form.Item>
              </div>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className="shipname">
                <Form.Item
                  label='Shippling Name'
                  name={`ship_name_2`}
                  className='label-large'
                >
                  <Input/>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className="price">
                <Form.Item
                    label='Price'
                    name={`ship_amount_2`}
                    className='label-large'
                  >
                    <Input type='number'/>
                  </Form.Item>
              </div>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className="shipname">
                <Form.Item
                  label='Shippling Name'
                  name={`ship_name_3`}
                  className='label-large'
                >
                  <Input/>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className="price">
                <Form.Item
                    label='Price'
                    name={`ship_amount_3`}
                    className='label-large'
                  >
                    <Input type='number'/>
                  </Form.Item>
              </div>
            </Col>
          </Row>
        </div>
      )
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const {shipmentVisible,shipping, brandList,formData, paymentScreen, jobModal, hide_mob_number, classifiedDetail, inspectionPreview, specification, visible, initial, inspectiontime, otherAttribute, fileList, textInputs, address, weekly, singleDate } = this.state
    const { loggedInUser, adPostDetail } = this.props
    return (
      <Fragment>
        {paymentScreen ? <MembershipPlan reqData={formData} /> :
          <Layout>
            <Layout>
              <AppSidebar activeTabKey={DASHBOARD_KEYS.MYADS} history={history} />
              <div className='wrap'>
                <div className='align-center mt-40 pb-30' style={{ position: 'relative' }}>
                  <Title level={2} className='text-blue'>Edit an Ad</Title>
                  {/* <Paragraph className='text-gray'>Select Ad category</Paragraph> */}
                </div>
                <div className='post-ad-box'>
                  <Form
                    layout='vertical'
                    onFinish={this.onFinish}
                    ref={this.formRef}
                    autoComplete="off"
                    initialValues={{
                      name:'shipping',
                      shipping:initial ? shipping : [{ ship_name: '', ship_amount: '' }] 
                    }}
                  >
                    <div className='card-container signup-tab'>
                      <Tabs type='card'>
                        <TabPane tab='Update Post Details' key='1'>
                          <Row gutter={12}>
                            <Col span={12}>
                              <Form.Item
                                label={'Category'}
                                name='parent_categoryid'
                                // rules={[required('Category')]}
                              >
                                <Input size='large' placeholder='Category' disabled />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label={'Sub Category'}
                                name='category_id'
                                // rules={[required('Subcategory')]}
                              >
                                <Input size='large' placeholder='Sub Category' disabled />
                              </Form.Item >
                            </Col>
                          </Row>
                          <div>
                            <Form.Item
                              label='Product Name'
                              name='title'
                              className='label-large'
                              rules={[required('')]}
                            >
                              <Input size='large' placeholder='Type here' />
                            </Form.Item>
                          </div>
                          <div>
                            <Form.Item
                              label='Description'
                              name='description'
                              className='label-large'
                              rules={[required('')]}
                            >
                              <TextArea
                                className='ant-input-lg'
                                rows='5'
                                placeholder='Type here'
                              />
                            </Form.Item>
                          </div>
                          <div>
                            <Form.Item
                              label='Features'
                              name='features'
                              className='label-large'
                              rules={[required('')]}
                            >
                              <TextArea
                                className='ant-input-lg'
                                rows='5'
                                placeholder='Type here'
                              />
                            </Form.Item>
                          </div>
                          <div>
                            <Form.Item
                              label='Other Notes (Optional)'
                              name='other_notes'
                              className='label-large'
                              rules={[required('')]}
                            >
                              <TextArea
                                className='ant-input-lg'
                                rows='5'
                                placeholder='Type here'
                              />
                            </Form.Item>
                          </div>
                          <div>
                            <Form.Item
                              label={'Brand Name'}
                              name={'brand_name'}
                            >
                              <Select
                                placeholder='Select Brand'
                                allowClear
                                size={'large'}
                                className='w-100'
                              >
                              {this.renderBrandList(brandList)}
                            </Select>
                            
                            </Form.Item>
                          </div>
                          {this.renderItem()}
                          <Form.Item
                            label='Add Pictures'
                            name='image'
                            className='label-large'
                          // rules={[required('')]}
                          >
                            <ul className='pl-0'>
                              <li>Add upto 8 images or upgrade to include more</li>
                              <li >Maximum File size 4MB</li>
                            </ul>
                            <Upload
                              name='avatar'
                              listType='picture-card'
                              className='avatar-uploader'
                              showUploadList={true}
                              fileList={fileList}
                              customRequest={this.dummyRequest}
                              onChange={this.onChange}
                            >
                              {fileList.length >= 8 ? null : uploadButton}

                            </Upload>
                          </Form.Item>
                          {this.renderGroupAttribute()}
                          <div className="con-brand-ship-parent-block">
                            <div className="condition-block">
                              <Form.Item label='Condition' name={'condition'}>
                                <Radio.Group>
                                  <Radio value={'New'}>New with tags</Radio><br/><br/>
                                  <Radio value={'Used'}>Used</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                            <div className="condition-block brand-block">
                              <Form.Item  label='Brand' name={'brand'}>
                                <Radio.Group>
                                  <Radio value={'Brand'}>Brand</Radio><br/><br/>
                                  <Radio value={'Non Brand'}>Non - Brand</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                            <div className="condition-block shipment-block">
                              <Form.Item  label='Shipment' name={'shipment'}>
                                <Radio.Group onChange={(e) => this.setState({shipmentVisible: e.target.value == '1' ? true : false})}>
                                  <Radio value={'0'}>Free</Radio><br/><br/>
                                  <Radio value={'1'}>Enter Shipping Amount</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                            {shipmentVisible && this.renderShipmentElement()}
                          </div>
                          <Row gutter={20}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item
                            label={'Price'}
                            name={'price'}
                            rules={[{ validator: validNumber }]}
                            onChange={this.handlePrice}
                          >
                            <Input type={'number'}/>
                          </Form.Item>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item
                            label={'Final Price'}
                            name={'final_price'}
                          >
                            <Input disabled />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                        </TabPane>
                      </Tabs>
                      {otherAttribute && otherAttribute.length !== 0 &&
                        <div className='card-container signup-tab mt-25'>
                          <Collapse>
                            <Panel header='Add more details (Optional)' key='1'>
                              <div>
                                {this.renderOtherItem()}
                              </div>
                            </Panel>
                          </Collapse>
                        </div>
                      }
                      <div className='card-container signup-tab mt-25'>
                        <Collapse>
                          <Panel header='Contact Details' key='1'>
                            <div>
                              <Row gutter={12}>
                                <Col span={12}>
                                  <Form.Item
                                    label='First Name'
                                    name='fname'
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
                              <Row gutter={28}>
                                <Col span={24}>
                                  <Form.Item
                                    label='Locate your address'
                                    name='address'
                                    className='label-large'
                                  // rules={(address === '' || address === undefined || address === 'N/A' || address === null) && [required('Address')]}
                                  >
                                    <PlacesAutocomplete
                                      name='address'
                                      handleAddress={this.handleAddress}
                                      addressValue={this.state.address}
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
                              {/* <div className='mb-15 mt-15'>
                          <Form.Item
                            name='classified_type'
                          // rules={[required('')]}
                          >
                            <Radio.Group onChange={this.handleRadioCheck} value={classified_type}>
                              {isFeatured && <Radio className='label-large' value={'featured'}>Featured</Radio>}
                              {parent_premium && <Radio className='label-large' value={'premium_parent'}>Parent Premium</Radio>}
                              {child_premium && <Radio className='label-large' value={'premium_child'}>Child Premium</Radio>}

                            
                            </Radio.Group>
                          </Form.Item>
                        </div> */}
                            </div>
                          </Panel>
                        </Collapse>
                      </div>
                    </div>
                    <div className='steps-action flex align-center mb-32'>
                      <Button htmlType='submit' type='primary' size='middle' className='btn-blue'>
                        SAVE
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Layout>
          </Layout>}
        {visible && <Preview
          visible={visible}
          onCancel={() => this.setState({ visible: false }, () => this.props.history.push('/my-ads'))}
          hide_mob_number={hide_mob_number}
          address={address}
          adPostDetail={adPostDetail}
          specification={specification}
          inspectionPreview={inspectionPreview}
          classifiedDetail={classifiedDetail}
          getDetails={this.getClassifiedDetails}
        />}
        {jobModal && <JobPreview
          visible={jobModal}
          onCancel={() => this.setState({ jobModal: false }, () => this.props.history.push('/my-ads'))}
          classifiedDetail={classifiedDetail && classifiedDetail.data}
          allData={classifiedDetail && classifiedDetail}
          getDetails={this.getClassifiedDetails}
        />}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, postAd, common } = store;
  const { step1 } = postAd;
  const { location } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    step1,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    lat: location ? location.lat : '',
    long: location ? location.long : ''
  };
};
export default connect(
  mapStateToProps,
  {getGSTPercentage,getAllBrandsAPI, deleteInspectionAPI, getRetailCategoryDetail, updateRetailClassified, getRetailPostAdDetail, getChildInput, getClassifiedDynamicInput, setAdPostData, enableLoading, disableLoading }
)(Step3);

