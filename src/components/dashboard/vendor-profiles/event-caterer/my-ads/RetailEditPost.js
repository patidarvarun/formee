import React, { Fragment } from 'react';
import moment from 'moment'
import { connect } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import { toastr } from 'react-redux-toastr'
import 'react-quill/dist/quill.snow.css';
import AppSidebar from '../../../../sidebar/HomeSideBarbar';
import history from '../../../../../common/History';
import { DASHBOARD_KEYS } from '../../../../../config/Constant'
import { Divider, InputNumber, Select, Layout, Typography, Row, Col, message, Upload, Form, Checkbox, Radio, Tabs, Button, Collapse, Input } from 'antd';
import Icon from '../../../../customIcons/customIcons';
import '../../../../auth/registration/style.less';
import { renderField } from '../../../../forminput'
import { required, validMobile, validNumber } from '../../../../../config/FormValidation'
import { getAddress, converInUpperCase } from '../../../../common'
import { uploadRetailProductImage, enableLoading, disableLoading, getRetailCategoryDetail } from '../../../../../actions'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getGSTPercentage, getAllBrandsAPI, deleteInspectionAPI, updateRetailClassified, getChildInput, getClassifiedDynamicInput, setAdPostData, getRetailPostAdDetail } from '../../../../../actions'
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
      inv_attributes: [],
      initial: false, address: '',
      adPostDetail: '',
      byAppointment: false,
      weekly: false,
      singleDate: false,
      data: '', specification: '', inspectionPreview: [],
      classifiedDetail: '', jobModal: false, paymentScreen: false, formData: '',
      brandList: [],
      shipping: [],
      percentageAmount: '',
      shipmentVisible: false,
      comissionAmount: '',
      gstAmount: '',
      group_attribute: [],
      groupImage: [],
      uploadedUrl: '',
      inv_att: [],
      brandVisible: false,
      weightVisible: false, dimentionVisible: false
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
      if (res.status === 200) {
        let data = res.data && res.data.data
        this.setState({ percentageAmount: data })
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
        let temp = []

        let group_attribute = data && data.inv_attribute_group_new
        let inv_att = group_attribute && Array.isArray(group_attribute.inv_attributes) ? group_attribute.inv_attributes : []


        this.setState({ group_attribute: group_attribute, inv_att: inv_att })
        this.getDefaultINVAttribute(allAtt)
        this.getInitialvalueofGroupAtt(group_attribute, inv_att)
        this.getAllInitialValue(data, mandate, optional)
        this.getClassifiedDetails(catId)
      }
    })
  }

  /**
   * @method getInitialvalueofGroupAtt
   * @description get initial value of group attributes
   */
  getInitialvalueofGroupAtt = (group_attribute, inv_att) => {
    if (inv_att && inv_att.length) {

      this.setState({
        inv_attributes: inv_att,
        initial: true,
        groupImage: [{
          uid: `-1`,
          name: 'image.png',
          status: 'done',
          isPrevious: true,
          url: group_attribute.image_url,
          type: 'image/jpeg',
          size: '1024',
        }]
      })
      this.formRef.current && this.formRef.current.setFieldsValue({
        inv_attributes: inv_att
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
      category_id: 160,
      //category_id:id
    }
    this.props.getAllBrandsAPI(reqData, res => {
      if (res.status === 200) {
        let data = res.data && res.data.data

        this.setState({ brandList: data })
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
      title, fname, laname, product_price,
      price, description, contact_mobile, category_name, subcategory_name, sub_sub_category_name,
      hide_mob_number, location, brand, other_notes, features, condition, brand_name,
      commission_amount, gst_amount, shipping, ship_name_1, ship_name_2,
      ship_name_3, ship_amount_1, ship_amount_2, ship_amount_3,
      delivery_time_1, delivery_time_2, delivery_time_3, has_weight, has_dimension, length,
      width, height, weight, length_unit, weight_unit,returns_accepted,exclude_out_of_stock
    } = data;

    let final_price = Number(commission_amount ? commission_amount : 0) + Number(gst_amount ? gst_amount : 0) + Number(price ? price : 0)
    this.formRef.current && this.formRef.current.setFieldsValue({
      fname: fname ? converInUpperCase(fname) : '',
      lname: laname ? converInUpperCase(laname) : '',
      contact_email,
      title, description,
      brand: brand,
      price: product_price ? parseInt(product_price) : '',
      final_price: parseInt(price),
      other_notes: other_notes,
      features: features,
      brand_name: brand_name,
      parent_categoryid: category_name,
      category_id: sub_sub_category_name ? sub_sub_category_name : subcategory_name,
      condition: condition,
      shipment: String(shipping),
      contact_mobile: contact_mobile && contact_mobile !== 'N/A' ? contact_mobile : '',
      hide_mob_number: hide_mob_number ? hide_mob_number : false,
      address: location,
      inspection_type: data.inspection_type,
      ship_name_1: ship_name_1, ship_amount_1: ship_amount_1,
      ship_name_2: ship_name_2, ship_amount_2: ship_amount_2,
      ship_name_3: ship_name_3, ship_amount_3: ship_amount_3,
      delivery_time_1: delivery_time_1,
      delivery_time_2: delivery_time_2,
      delivery_time_3: delivery_time_3,
      has_weight, has_dimension, length, width, height, weight,
      length_unit: String(length_unit),
      weight_unit: String(weight_unit),
      returns_accepted: returns_accepted ? returns_accepted : false ,
      exclude_out_of_stock: exclude_out_of_stock ? exclude_out_of_stock : false
    });

    this.setState({
      adPostDetail: data,
      address: data.location,
      attribute: mandate,
      otherAttribute: optional,
      fileList: predefinedImages,
      shipmentVisible: String(shipping) === '1' ? true : false,
      brandVisible: brand === 'Brand' ? true : false,
      weightVisible: String(has_weight) === '1' ? true : false,
      dimentionVisible: String(has_dimension) === '1' ? true : false,
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
    if (percentageAmount) {
      let gstAmount = (value * percentageAmount.GST_percentage) / 100
      let comissionAmount = (value * percentageAmount.Formee_commission_percentage) / 100
      let total = gstAmount + comissionAmount + Number(value)
      this.setState({ gstAmount: gstAmount, comissionAmount: comissionAmount })

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

    const { uploadedUrl, group_attribute, gstAmount, comissionAmount, percentageAmount, data, attribute, otherAttribute, fileList, textInputs, hide_mob_number, adPostDetail } = this.state;
    const { loggedInUser } = this.props
    let temp = {}, specification = [], price = '', groupAtt = {}
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

    let groupAttr = value.inv_attributes, inv_attributes = []

    if (groupAttr && groupAttr.length) {
      let inv_attribute_id = groupAttr[0].inv_attribute_id

      groupAttr && groupAttr.length && groupAttr.map((el, i) => {
        let children = [], child_inv_attribute_id = ''
        if (el.children && el.children.length) {
          child_inv_attribute_id = el.children[0].inv_attribute_id
          el.children && el.children.length && el.children.map((el2, i) => {
            children.push({
              inv_attribute_id: child_inv_attribute_id,
              inv_attribute_value: el2.inv_attribute_value,
              quantity: el2.quantity,
            })
          })
          inv_attributes.push({
            inv_attribute_id: inv_attribute_id,
            inv_attribute_value: el.inv_attribute_value,
            quantity: el.quantity,
            children
          })
        }
      })
    }
    let groupAttData = {
      group_id: uploadedUrl && uploadedUrl.group_id ? uploadedUrl.group_id : group_attribute && group_attribute.id ? group_attribute.id : '',
      image_url: uploadedUrl && uploadedUrl.image_url ? uploadedUrl.image_url : group_attribute.image_url ? group_attribute.image_url : '',
      inv_attributes: inv_attributes
    }


    let imagetemp = []
    fileList && Array.isArray(fileList) && fileList.filter((el) => {
      el.originFileObj && imagetemp.push(el.originFileObj)
    })

    const { adId } = this.props.match.params
    const reqData = {
      id: adId,
      parent_categoryid: adPostDetail.parent_categoryid,
      category_id: adPostDetail.category_id,
      child_category_id: adPostDetail.child_category_id,
      attributes: temp,
      inv_attribute_groups: groupAttData,
      user_id: loggedInUser.id,
      price: value.price ? value.price : adPostDetail.product_price,
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
      ['image[]']: imagetemp,

      brand_name: value.brand_name ? value.brand_name : adPostDetail.brand_name,
      other_notes: value.other_notes ? value.other_notes : adPostDetail.other_notes,
      features: value.features ? value.features : adPostDetail.features,
      condition: value.condition ? value.condition : adPostDetail.condition,
      brand: value.brand ? value.brand : adPostDetail.brand,
      shipping: value.shipment ? value.shipment : adPostDetail.shipping,

      GST_tax_percent: percentageAmount && percentageAmount.GST_percentage ? percentageAmount.GST_percentage : adPostDetail.gst_percent,
      formee_commision_tax_amount: comissionAmount ? comissionAmount : adPostDetail.commission_amount,
      GST_tax_amount: gstAmount ? gstAmount : adPostDetail.gst_amount,
      formee_commision_tax_percent: percentageAmount && percentageAmount.Formee_commission_percentage ? percentageAmount.Formee_commission_percentage : adPostDetail.commission_percent,

      ship_name_1: value.ship_name_1 ? value.ship_name_1 : adPostDetail.ship_name_1,
      ship_amount_1: value.ship_amount_1 ? value.ship_amount_1 : adPostDetail.ship_amount_1,
      ship_name_2: value.ship_name_2 ? value.ship_name_2 : adPostDetail.ship_name_2,
      ship_amount_2: value.ship_amount_2 ? value.ship_amount_2 : adPostDetail.ship_amount_2,
      ship_name_3: value.ship_name_3 ? value.ship_name_3 : adPostDetail.ship_name_3,
      ship_amount_3: value.ship_amount_3 ? value.ship_amount_3 : adPostDetail.ship_amount_3,
      delivery_time_1: value.delivery_time_1 ? value.delivery_time_1 : adPostDetail.delivery_time_1,
      delivery_time_2: value.delivery_time_2 ? value.delivery_time_2 : adPostDetail.delivery_time_2,
      delivery_time_3: value.delivery_time_3 ? value.delivery_time_3 : adPostDetail.delivery_time_3,
      has_weight: value.has_weight ? value.has_weight : adPostDetail.has_weight,
      weight_unit: adPostDetail.weight_unit,
      weight: value.weight ? value.weight : adPostDetail.weight,
      width: adPostDetail.width,
      has_dimension: value.has_dimension ? value.has_dimension : adPostDetail.has_dimension,
      length_unit: value.length_unit ? value.length_unit : adPostDetail.length_unit,
      length: value.length ? value.length : adPostDetail.length,
      width: value.width ? value.width : adPostDetail.width,
      height: value.height ? value.height : adPostDetail.height,
      is_premium_sub_cat: 0,
      is_premium_parent_cat: 0,
      pay_pal: 'on',
      price_type: 'amount',
      returns_accepted: value.returns_accepted,
      exclude_out_of_stock: value.exclude_out_of_stock
    };




    const formData = new FormData()
    for (var i = 0; i < imagetemp.length; i++) {
      formData.append('image[]', imagetemp[i]);

    }
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == 'object' && key !== 'image[]') {
        formData.append(key, JSON.stringify(reqData[key]))
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
    if (brand.length !== 0) {
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
    if (value && value.length !== 0) {
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


  renderShipMent = () => {
    return (
      <Form.List name="shipping">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Row gutter={12}>
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
    let temp = [1, 2, 3];
    return (
      <div className="shipment-grid-block">
        <Row gutter={12}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="shipname">
              <Form.Item
                label='Shippling Name'
                name={`ship_name_1`}
                className='label-large'
              >
                <Input placeholder='Shippling Name' />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="price">
              <Form.Item
                label='Price'
                name={`ship_amount_1`}
                className='label-large'
              >
                <Input type='number' placeholder='Price' />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="price">
              <Form.Item
                label='Delivery Time'
                name={`delivery_time_1`}
                className='label-large'
              >
                <Input placeholder='Delivery Time' />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="shipname">
              <Form.Item
                label='Shippling Name'
                name={`ship_name_2`}
                className='label-large'
              >
                <Input placeholder='Shippling Name' />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="price">
              <Form.Item
                label='Price'
                name={`ship_amount_2`}
                className='label-large'
              >
                <Input type='number' placeholder='Price' />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="price">
              <Form.Item
                label='Delivery Time'
                name={`delivery_time_2`}
                className='label-large'
              >
                <Input placeholder='Delivery Time' />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="shipname">
              <Form.Item
                label='Shippling Name'
                name={`ship_name_3`}
                className='label-large'
              >
                <Input placeholder='Shippling Name' />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="price">
              <Form.Item
                label='Price'
                name={`ship_amount_3`}
                className='label-large'
              >
                <Input type='number' placeholder='Price' />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <div className="price">
              <Form.Item
                label='Delivery Time'
                name={`delivery_time_3`}
                className='label-large'
              >
                <Input placeholder='Delivery Time' />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  /**
  * @method duplicateEntry
  * @description duplicate entry
  */
  duplicateEntry = function (currentField, i, el) {

    let temp = currentField.inv_attributes[i] && currentField.inv_attributes[i].children && currentField.inv_attributes[i].children

    if (temp && temp.length) {
      return temp.map(function (value) {
        return value.inv_attribute_value
      }).some(function (value, index, temp) {
        return temp.indexOf(value) !== temp.lastIndexOf(value);
      })
    }
  }

  /**
  * @method renderDynamicAttOption
  * @description render dynamic attribute option
  */
  renderDynamicAttOption = (value) => {
    if (value && value.length !== 0) {
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
  renderProductImage = () => {
    const { groupImage, inv_att } = this.state
    if (inv_att && inv_att.length) {
      return (
        <div>
          <Form.Item
            label='Add Inventory Details'
            className='label-large'
          >
          <ImgCrop grid zoom={false} aspect={1/1}>
            <Upload
              name='avatar'
              listType='picture-card'
              className='avatar-uploader'
              showUploadList={true}
              fileList={groupImage}
              customRequest={this.dummyRequest}
              onChange={this.handleGroupImageChange}
            >
              {groupImage && groupImage.length >= 1 ? null : uploadButton}
            </Upload>
          </ImgCrop>
          </Form.Item>
        </div>
      )
    }
  }

  handleGroupImageChange = ({ file, fileList }) => {

    const { group_attribute } = this.state
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      this.setState({ groupImage: fileList });
      let reqData = {
        group_id: group_attribute.id,
        inv_attribute_id: 1,
        image: fileList && fileList.length && fileList[0].originFileObj ? fileList[0].originFileObj : []
      }
      let formData = new FormData();
      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key])
      });
      this.props.uploadRetailProductImage(formData, res => {
        if (res.status === 200) {

          this.setState({ uploadedUrl: res.data.data });
          toastr.success('Image has been uploaded successfully')
        }
      })
    }
  }

  /**
   * @method handleQuantityChange
   * @description handle quantity change
   */
  handleQuantityChange = (field) => {
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    let count = 0
    let data = currentField && currentField.inv_attributes[field.key] && currentField.inv_attributes[field.key].children
    if (data) {
      data && data.length && data.map((el, i) => {
        count = Number(count) + Number(el.quantity)
      })
      currentField.inv_attributes[field.key].quantity = Number(count)
      this.formRef.current && this.formRef.current.setFieldsValue({
        ...currentField
      })
    }
  }

  /**
  * @method duplicateEntry
  * @description duplicate entry
  */
  duplicateColorEntry = function (currentField) {

    let temp = currentField.inv_attributes

    if (temp && temp.length) {
      return temp.map(function (value) {
        return value.inv_attribute_value
      }).some(function (value, index, temp) {
        return temp.indexOf(value) !== temp.lastIndexOf(value);
      })
    }
  }


  /**
   * @method renderInventoryForm
   * @description render inventory form inputs 
   */
  renderInventoryForm = () => {
    return (
      <Form.List name="inv_attributes">
        {(fields, { add, remove }) => {

          let currentField = this.formRef.current && this.formRef.current.getFieldsValue()

          if (currentField) {
            let item = currentField.inv_attributes
            let have_children = item && item[0] && item[0].children && Array.isArray(item[0].children) && item[0].children.length ? true : false
            return (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    {field.key !== 0 &&
                      <Divider style={{ background: '#90A8BE', marginTop: '-5px', marginBottom: '18px' }} />
                    }
                    <Row gutter={0} className={'label-small'}>
                      <Col xs={24} sm={24} md={10} lg={8} className={'ant-form-item-label'}>
                        <label>Quantity</label>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={14} className={'ant-form-item-label'}>
                        {/* <label>Colour / Pattern Name</label> */}
                        <label>{item && item[0].display_name}</label>
                      </Col>
                      {field.key !== 0 &&
                      <Col xs={24} sm={24} md={2} lg={2} className={'align-right'}>
                          <MinusCircleOutlined
                            title={'Remove'}
                            className={'custom-remove-icon1'}
                            onClick={() => remove(field.name)}
                          />
                      </Col>
                      }
                    </Row>
                    <Row gutter={0} className={'custom-inline-fields'}>
                      <Col xs={24} sm={24} md={10} lg={8}>
                        <Form.Item
                          name={[field.name, 'quantity']}
                          fieldKey={[field.fieldKey, 'quantity']}
                          rules={[required('')]}
                        >
                          <Input type={'number'} disabled={item[field.key] && item[field.key].children && item[field.key].children.length !== 0 ? true : false} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={14} lg={16}>
                        <Form.Item
                          name={[field.name, 'inv_attribute_value']}
                          fieldKey={[field.fieldKey, 'inv_attribute_value']}
                          rules={[required('')]}
                        >
                          <Select
                            allowClear
                            size={'large'}
                            className='w-100'
                            onChange={() => {
                              let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                              let duplicate = this.duplicateColorEntry(currentField)
                              if (duplicate) {
                                toastr.warning('You have already use this value, please select other ')
                                currentField.inv_attributes[field.key].inv_attribute_value = ''
                                this.formRef.current && this.formRef.current.setFieldsValue({
                                  ...currentField
                                })
                              }
                            }}
                          >
                            {this.renderDynamicAttOption(item[0].values)}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className=" inventory-size">
                      <Row gutter={0}>
                        {have_children && item[field.key] && item[field.key].children && <Col xs={24} sm={24} md={10} lg={8}>
                          <label className="mb-0 ">{item[0] && item[0].children[0].display_name}</label>
                        </Col>}
                        {have_children && item[field.key] && item[field.key].children && <Col xs={24} sm={24} md={14} lg={16}>
                          <label className="mb-0 ">Quantity</label>
                        </Col>}
                        <Form.List name={[field.fieldKey, "children"]}>
                          {(children, { add, remove }) => {
                            let child = item[field.key] && item[field.key].children
                            let childValues = have_children ? item && item[0] && item[0].children && item[0].children[0].values : []
                            return (
                              <div className="w-100">
                                {children.map((el, index2) => (
                                  <Row gutter={0} className={'custom-inline-fields'}>
                                    <Col xs={24} sm={24} md={10} lg={8}>
                                      <Form.Item
                                        {...el}
                                        name={[el.name, 'inv_attribute_value']}
                                        fieldKey={[el.fieldKey, 'inv_attribute_value']}
                                        key={index2}
                                      >
                                        <Select onChange={() => {
                                          let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                          let duplicate = this.duplicateEntry(currentField, field.key, el.key)
                                          if (duplicate) {
                                            if (child && child[el.key] && child[el.key].inv_attribute_value) {
                                              toastr.warning('You have already use this value, please select other ')
                                              child[el.key].inv_attribute_value = ''
                                              this.formRef.current && this.formRef.current.setFieldsValue({
                                                ...currentField
                                              })
                                            }
                                          }
                                        }}>
                                          {this.renderDynamicAttOption(childValues)}
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={14} lg={el.key !== 0 ? 14 : 16}>
                                      <Form.Item
                                        {...el}
                                        name={[el.name, 'quantity']}
                                        fieldKey={[el.fieldKey, 'quantity']}
                                        key={index2}
                                      >
                                        <Input onChange={() => {
                                          this.handleQuantityChange(field)
                                        }} />
                                      </Form.Item>
                                    </Col>
                                    {el.key !== 0 && <Col xs={24} sm={24} md={2} lg={2} className="align-right">
                                      <MinusCircleOutlined
                                        className="edit-menu-remove custom-remove-icon"
                                        onClick={() => {
                                          remove(el.name);
                                          // this.handleQuantityChange(field)
                                        }}
                                      />
                                    </Col>}
                                  </Row>
                                ))}
                                {have_children && <Form.Item name={'children'}>
                                  <div className="add-more-btn-box">
                                    <div onClick={() => { add() }} className="inline-block cursur-pointer">
                                      <img src={require('../../../../../assets/images/icons/plus-circle.svg')} alt='Add' /> {`Add More ${item[0] && item[0].children ? item[0].children[0].display_name : ''}`}
                                      </div>
                                  </div>
                                </Form.Item>}
                              </div>
                            );
                          }}
                        </Form.List>
                      </Row>
                    </div>
                  </div>
                ))}
                {fields.length !== 0 && <Form.Item name={'parent'}>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Button type='default' danger className='text-black add-more-colour-btn' onClick={() => add()}>{` Add More ${item && item[0].display_name}`}</Button>
                    </Col>
                  </Row>
                </Form.Item>}
              </div>
            );
          }
        }}
      </Form.List>
    )
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const { weightVisible, dimentionVisible, brandVisible, shipmentVisible, shipping, brandList, formData, paymentScreen, jobModal, hide_mob_number, classifiedDetail, inspectionPreview, specification, visible, initial, inv_attributes, otherAttribute, fileList, address } = this.state
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
                      name: 'shipping',
                      shipping: initial ? shipping : [{ ship_name: '', ship_amount: '', delivery_time: '' }],
                      name: "inv_attributes",
                      inv_attributes: inv_attributes,
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
                            // rules={[required('')]}
                            >
                              <TextArea
                                className='ant-input-lg'
                                rows='5'
                                placeholder='Type here'
                              />
                            </Form.Item>
                          </div>
                          <div className="condition-block brand-block">
                            <Form.Item label='Brand' name={'brand'}>
                              <Radio.Group onChange={(e) => this.setState({ brandVisible: e.target.value == 'Brand' ? true : false })}>
                                <Radio value={'Brand'}>Brand</Radio><br /><br />
                                <Radio value={'Non Brand'}>Non - Brand</Radio>
                              </Radio.Group>
                            </Form.Item>
                          </div>
                          {brandVisible && <div>
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
                          </div>}
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
                            <ImgCrop grid zoom={false} aspect={1/1}>
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
                            </ImgCrop>
                          </Form.Item>
                          {/* {this.renderGroupAttribute()} */}
                          <Row>
                            <Col md={12} className="mt-10">
                              <Form.Item name={"returns_accepted"} noStyle  valuePropName='checked'>
                                <Checkbox>Returns Accepted</Checkbox>
                              </Form.Item>
                            </Col>
                            <Col md={12} className="mt-10">
                              <Form.Item name={"exclude_out_of_stock"} noStyle  valuePropName='checked'>
                                <Checkbox>Exclude Out of Stock</Checkbox>
                              </Form.Item>
                            </Col>
                          </Row>
                          <div className="condition-block brand-block">
                            <Form.Item name={'has_dimension'} valuePropName='checked'>
                              <Checkbox onChange={(e) => this.setState({ dimentionVisible: e.target.checked ? true : false })}> {'Show Dimensions'}</Checkbox>
                            </Form.Item>
                          </div>
                          {dimentionVisible && <Row gutter={[12, 12]}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                              <div className="width-parameter-block">
                                <Form.Item
                                  label={'length_unit'}
                                  name={'length_unit'}
                                >
                                  <Select className="centimeters-select">
                                    <Option value="Inches ">Inches </Option>
                                    <Option value="Centimeters ">Centimeters </Option>
                                    <Option value="Feet">Feet</Option>
                                  </Select>
                                </Form.Item>
                              </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                              <div>
                                <Form.Item
                                  label={'Length'}
                                  name={'length'}
                                >
                                  <Input type={'number'} />
                                </Form.Item>
                              </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                              <div>
                                <Form.Item
                                  label={'Width'}
                                  name={'width'}
                                >
                                  <Input type={'number'} />
                                </Form.Item>
                              </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                              <div>
                                <Form.Item
                                  label={'Height'}
                                  name={'height'}
                                >
                                  <Input type={'number'} />
                                </Form.Item>
                              </div>
                            </Col>
                          </Row>}
                          <div className="condition-block brand-block">
                            <Form.Item name={'has_weight'} valuePropName='checked'>
                              <Checkbox onChange={(e) => this.setState({ weightVisible: e.target.checked ? true : false })}> {'Show Weight'}</Checkbox>
                            </Form.Item>
                          </div>
                          {weightVisible && <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                              <div className="width-parameter-block">
                                <Form.Item
                                  label={'weight unit'}
                                  name={'weight_unit'}
                                  placeholder={'Select Unit'}
                                >
                                  <Select className="centimeters-select">
                                    <Option value="KG">KG</Option>
                                    <Option value="LB">LB </Option>
                                  </Select>
                                </Form.Item>
                              </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                              <div>
                                <Form.Item
                                  label={'Weight'}
                                  name={'weight'}
                                >
                                  <Input type={'number'} />
                                </Form.Item>
                              </div>
                            </Col>
                          </Row>}
                          <Divider style={{ background: '#90A8BE', margin: '18px 0 24px -4.5rem', width: 'calc(100% + 9rem)' }} />
                          {inv_attributes && this.renderProductImage()}
                          {this.renderInventoryForm()}
                          <Divider style={{ background: '#90A8BE', margin: '30px 0px 28px -4.5rem', width: 'calc(100% + 9rem)' }} />
                          <div className="con-brand-ship-parent-block">
                            <div className="condition-block">
                              <Form.Item label='Condition' name={'condition'}>
                                <Radio.Group>
                                  <Radio value={'New'}>New with tags</Radio><br /><br />
                                  <Radio value={'Used'}>Used</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                            <div className="condition-block shipment-block">
                              <Form.Item label='Shipment' name={'shipment'}>
                                <Radio.Group onChange={(e) => this.setState({ shipmentVisible: e.target.value == '1' ? true : false })}>
                                  <Radio value={'0'}>Free</Radio><br /><br />
                                  <Radio value={'1'}>Enter Shipping Amount</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                            {shipmentVisible && this.renderShipmentElement()}
                          </div>
                          <Row gutter={12}>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                              <div>
                                <Form.Item
                                  label={'Price'}
                                  name={'price'}
                                  rules={[{ validator: validNumber }]}
                                  onChange={this.handlePrice}
                                >
                                  <Input type={'number'} />
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
  { uploadRetailProductImage, getGSTPercentage, getAllBrandsAPI, deleteInspectionAPI, getRetailCategoryDetail, updateRetailClassified, getRetailPostAdDetail, getChildInput, getClassifiedDynamicInput, setAdPostData, enableLoading, disableLoading }
)(Step3);

