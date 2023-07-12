import React, { Fragment } from 'react';
import moment from 'moment'
import { connect } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import { toastr } from 'react-redux-toastr'
import 'react-quill/dist/quill.snow.css';
import { Divider, InputNumber, Select, DatePicker, TimePicker, Row, Col, message, Upload, Form, Checkbox, Radio, Tabs, Button, Collapse, Input } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import '../../auth/registration/style.less';
import { renderField } from '../../forminput'
import { required, validNumber } from '../../../config/FormValidation'
import { uploadRetailProductImage, getGSTPercentage, getAllBrandsAPI, getRetailDynamicAttribute, enableLoading, disableLoading } from '../../../actions'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { setAdPostData } from '../../../actions/classifieds/PostAd'
import { RetailNavBar } from '../CommanMethod'
import { Link } from 'react-router-dom';
import { QUESTION_TYPES } from '../../../config/Config'
import '../../retail/vendor-retail/vendorretail.less'


const { TabPane } = Tabs;
const { Panel } = Collapse
const { TextArea } = Input;
const { Option } = Select
const timeList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const rules = [required('')];
let imagetemp = []
const uploadButton = (
  <div>
    <img src={require('../../../assets/images/icons/upload.svg')} alt='upload' />
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
      inv_att: [],
      initial: false,
      brandList: [],
      shipping: [],
      percentageAmount: '',
      shipmentVisible: false,
      comissionAmount: '',
      gstAmount: '',
      group_attribute: [],
      dynamicImageArray: [],
      uploadedUrl: [],
      brandVisible: false,
      allgroupAtt: [],
      dimentionVisible: false,
      group_id: '',
      weightVisible: false,
      invInitialTest: [{
        index: 0,
      }]
    };
  }

  /**
   * @method componentWillMount
   * @description mount before render the component
   */
  componentWillMount() {
    this.props.enableLoading()
    const { step1 } = this.props;
    let catId = step1.child_category_id ? step1.child_category_id : step1.category_id
    this.getSettingData()
    this.getInvAttributes(catId)
    this.getBrandsList(catId)
    this.seIntitialValues(this.props.reqData)
    if (this.props.reqData) {
      const { reqData } = this.props;
      reqData.map((el) => {
        if (el.type === 'inventory_attributes') {
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.inventory_attributes]: el.value
          });
          this.setState({ inventory_attributes: el.value, initial: true })
        } else if (el.type === 'shipping') {
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.shipping]: el.value
          });
          this.setState({ shipping: el.value, initial: true })
        }
      })
    }
  }

  // /**
  //  * @method componentDidMount
  //  * @description called after render the component
  //  */
  // componentDidMount() {

  // }



  /**
   * @method getSettingData
   * @description get setting data gst percentage and commission percentage
   */
  getSettingData = () => {
    this.props.getGSTPercentage(res => {
      if (res.status === 200) {
        let data = res.data && res.data.data

        this.setState({ percentageAmount: data })
      }
    })
  }

  /**
   * @method getInvAttributes
   * @description get inv attributes
   */
  getInvAttributes = (catId) => {
    this.props.getRetailDynamicAttribute({ categoryid: catId, category_level:3 }, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        let temp = [], imageTemp = []
        let group_attribute = res.data.inv_attribute_group && Array.isArray(res.data.inv_attribute_group) ? res.data.inv_attribute_group : []
        console.log('group_attribute',group_attribute)
        const atr = Array.isArray(res.data.attributes) ? res.data.attributes : [];
        const mandate = atr.filter(el => el.validation === 1)
        const optinal = atr.filter(el => el.validation === 0)
        group_attribute && group_attribute.length && group_attribute.slice(0, 1).map((el, i) => {
          this.setState({ group_id: el.id })
          let childAtt = el && el.inv_attributes && Array.isArray(el.inv_attributes) && el.inv_attributes.length ? el.inv_attributes : []
          childAtt && childAtt.length && childAtt.map((el2, i) => {
            temp.push(el2)
          })
        })
        this.setDynamicState(temp)
        this.getInitialGroupattributes(temp)

        this.setState({ attribute: mandate, otherAttribute: optinal, group_attribute: group_attribute, allgroupAtt: temp })
      }
    })
  }

  /**
  * @method addElement
  * @description add element in object
  */
  addElement = (ElementList, element) => {
    let newList = Object.assign(ElementList, element)
    return newList
  }

  getInitialGroupattributes = (att) => {
    let children = [], parent = '', parentData = '', childObj = '', isparent = false, final = ''
    att && att.length && att.map((el, i) => {
      if (el.is_parent === 1) {
        parent = el
        let quantity = { quantity: '', inv_attribute_value: '' }
        parentData = this.addElement(el, quantity);
        isparent = true
      } else if (el.is_parent === 0) {
        let quantity = { quantity: '', inv_attribute_value: '' }
        let childData = this.addElement(el, quantity);
        children.push(childData)
        childObj = childData
      }
    })
    if (isparent) {
      let child = { children }
      final = this.addElement(parentData, child);
      this.setState({ inv_att: [final], initial_att: final, children: childObj, invInitialTest: [final] })
    } else {
      final = children;
      this.setState({ invInitialTest: final })
    }

    if (this.formRef.current) {
      let currentField = this.formRef.current.getFieldsValue()
      currentField = [{ ...final }]

      this.formRef.current && this.formRef.current.setFieldsValue({
        inventory_attributes: [...currentField]
      })
    }
  }

  /**
   * @method seIntitialValues
   * @description set initialvalues
   */
  seIntitialValues = (reqData) => {
    if (reqData) {

      reqData.map((el) => {
        if (el.type === 'calendar') {
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.key]: moment(el.value)
          });
        } else if (el.type === 'fileList') {

          this.setState({ fileList: el.value })
        } else if (el.type === 'image') {
          let dynamicImageArray = el.value
          dynamicImageArray && dynamicImageArray.length && dynamicImageArray.map((el, i) => {
            this.setState({ [`${el.display_name}${el.group_id}`]: el.fileList ? el.fileList : [] })
          })
        } else if (el.key === 'uploadedUrl') {
          this.setState({ uploadedUrl: el.value })
        } else if (el.key === 'shipment') {
          this.setState({ shipmentVisible: el.value === '1' ? true : false })
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.key]: el.value
          });
        } else if (el.key === 'brand') {
          this.setState({ brandVisible: el.value === 'Brand' ? true : false })
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.key]: el.value
          });
        } else if (el.key === 'has_dimension') {
          this.setState({ dimentionVisible: el.value === '1' ? true : false })
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.key]: el.value
          });
        } else {

          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.key]: el.value
          });
        }
      })
    }
  }

  /**
   * @method setDynamicState
   * @description set dynamic state
   */
  setDynamicState = (allgroupAtt) => {
    let imageTemp = []
    allgroupAtt && allgroupAtt.length && allgroupAtt.map((el, i) => {
      if (el.have_image == 1) {
        imageTemp.push({ group_id: el.pivot.inv_group_id, inv_attribute_id: el.id, display_name: el.display_name })
      }
    })

    this.setState({ dynamicImageArray: imageTemp })
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  };

  /**
  * @method hasDupsObjects
  * @description check duplicate inspection time
  */
  hasDupsObjects = function (array) {

    return array.map(function (value) {
      return value.inspection_start_time + value.inspection_end_time + value.inspection_date
    }).some(function (value, index, array) {
      return array.indexOf(value) !== array.lastIndexOf(value);
    })
  }

  /**
  * @method getAttributes
  * @description formate attributes value
  */
  getAttributes = (value) => {

    // moment(value[key]).format('MMMM Do YYYY, h:mm:ss a')
    const { group_id, uploadedUrl, dynamicImageArray, attribute, otherAttribute, fileList, percentageAmount, gstAmount, comissionAmount, group_attribute, allgroupAtt } = this.state;


    const { step1 } = this.props
    let temp = {}, specification = [], price = '';
    let temp2 = [], groupAtt = {}
    let allDynamicAttribute = [...otherAttribute, ...attribute]

    Object.keys(value).filter(function (key, index) {
      if (value[key] !== undefined) {
        allDynamicAttribute.map((el, index) => {
          if (el.att_name === key) {
            let att = allDynamicAttribute[index]

            if (el.att_name === 'Price') {
              price = value[key]
            }
            let dropDropwnValue;
            if (att.attr_type_name === 'Drop-Down') {
              let selectedValueIndex = att.value.findIndex((el) => (el.id === value[key] || el.name === value[key]))


              dropDropwnValue = att.value[selectedValueIndex]

            }

            temp[att.att_id] = {
              // name: att.att_name,
              attr_type_id: att.attr_type,
              attr_value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue.id : (att.attr_type_name === 'calendar') ? moment(value[key]).format('YYYY') : (att.attr_type_name === 'Date') ? moment(value[key]).format('MMMM Do YYYY, h:mm:ss a') : value[key],
              parent_value_id: 0,
              parent_attribute_id: (att.attr_type_name === 'Drop-Down') ? att.att_id : 0,
              attr_type_name: att.attr_type_name
            };

            specification.push({
              key: att.att_name,
              value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue.name : (att.attr_type_name === 'calendar') ? moment(value[key]).format('YYYY') : (att.attr_type_name === 'Date') ? moment(value[key]).format('MMMM Do YYYY, h:mm:ss a') : value[key]
            })
            temp2.push({
              key: att.att_name,
              type: att.attr_type_name,
              value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue.name : (att.attr_type_name === 'calendar') ? value[key] : (att.attr_type_name === 'Date') ? value[key] : value[key]
            })
            // 
          }
        })
      }
    })
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    let groupAttr = currentField && currentField.inventory_attributes, inv_attributes = [], total_quantity = 0


    groupAttr && groupAttr.length && groupAttr.map((el, i) => {
      let children = []
      if (el.children && el.children.length) {
        el.children && el.children.length && el.children.map((el2, i) => {
          children.push({
            inv_attribute_id: el2.id,
            inv_attribute_value: el2.inv_attribute_value,
            quantity: el2.quantity,
          })
        })
        inv_attributes.push({
          inv_attribute_id: el.id,
          inv_attribute_value: el.inv_attribute_value,
          quantity: el.quantity,
          children
        })
        total_quantity = Number(total_quantity) + Number(el.quantity)
      }
    })
    let groupAttData = {
      group_id: uploadedUrl && uploadedUrl.group_id ? uploadedUrl.group_id : group_id,
      image_url: uploadedUrl && uploadedUrl.image_url ? uploadedUrl.image_url : '',
      inv_attributes
    }



    let secondArray = [{ key: 'title', value: value.title, type: 'text' }, { key: 'features', value: value.features, type: 'text' }, { key: 'other_notes', value: value.other_notes, type: 'text' },
    { key: 'description', value: value.description, type: 'text' }, { key: 'brand_name', value: value.brand_name },
    { key: 'image', value: dynamicImageArray && dynamicImageArray.length ? dynamicImageArray : [], type: 'image' },
    { key: 'inventory_attributes', value: value.inventory_attributes, type: 'inventory_attributes' },
    { key: 'shipping', value: value.shipping, type: 'shipping' },
    { key: 'inventory_attributes', value: value.inventory_attributes, type: 'inventory_attributes' },
    { key: 'condition', value: value.condition }, { key: 'brand', value: value.brand },
    { key: 'shipment', value: value.shipment },
    { key: 'price', value: value.price }, { key: 'final_price', value: value.final_price },
    { key: 'uploadedUrl', value: uploadedUrl },
    { key: 'fileList', value: fileList && fileList.length ? fileList : [], type: 'fileList' },
    { key: 'length', value: value.length },
    { key: 'height', value: value.height },
    { key: 'width', value: value.width }, { key: 'length_unit', value: value.length_unit },
    { key: 'has_dimension', value: value.has_dimension },
    { key: 'has_weight', value: value.has_weight },
    { key: 'weight', value: value.weight },
    { key: 'returns_accepted', value: value.returns_accepted },
    { key: 'exclude_out_of_stock', value: value.exclude_out_of_stock },
    ]

    let finalArray = temp2.concat(secondArray)
    const requestData = {
      attributevalue: temp,
      inv_attribute_groups: groupAttData,
      description: value.description,
      features: value.features,
      other_notes: value.other_notes,
      price: value.price ? value.price : '',
      title: value.title,
      brand_name: value.brand_name,
      condition: value.condition ? value.condition : '',
      brand: value.brand ? value.brand : 'Non Brand',
      shipping: value.shipment ? value.shipment : 0,
      specification: specification,
      inventory_attributes: value.inventory_attributes,
      inspectionPreview: value.inspection_time,
      shippingArray: value.shipping ? value.shipping : [],
      percentageAmount: percentageAmount,
      gstAmount: gstAmount,
      comissionAmount: comissionAmount,
      fileList: fileList,
      has_weight: value.has_weight ? 1 : 0,
      weight_unit: value.weight_unit ? value.weight_unit : 0,
      weight: value.weight ? value.weight : 0,
      has_dimension: value.has_dimension ? 1 : 0,
      length: value.length ? value.length : 0,
      width: value.width ? value.width : 0,
      height: value.height ? value.height : 0,
      length_unit: value.length_unit ? value.length_unit : 0,
      total_quantity: total_quantity,
      returns_accepted: value.returns_accepted ? value.returns_accepted : false,
      exclude_out_of_stock: value.exclude_out_of_stock ? value.exclude_out_of_stock : false
    }

    this.props.setAdPostData(requestData, 2)
    this.props.setAdPostData({ fileList: fileList && fileList.length ? fileList : [] }, 'fillist')
    // this.props.nextStep(finalArray)
    this.props.nextStep(finalArray)
  }

  onChange = (file, fileList, name, i, att) => {

    const { dynamicImageArray, uploadedUrl } = this.state
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      this.setState(prevState => ({
        dynamicImageArray: prevState.dynamicImageArray.map(item => (
          i === item.group_id ? { ...item, fileList } : item
        ))
      }))
      this.setState({ [`${name}${i}`]: fileList });

      let reqData = {
        group_id: i,
        inv_attribute_id: att.id,
        //image: imageObj,
        image: fileList && fileList.length ? fileList[0].originFileObj : fileList[0].originFileObj
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

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  /**
  * @method duplicateEntry
  * @description duplicate entry
  */
  duplicateEntry = function (currentField, i, el) {

    let temp = currentField.inventory_attributes[i] && currentField.inventory_attributes[i].children && currentField.inventory_attributes[i].children

    if (temp && temp.length) {
      return temp.map(function (value) {
        return value.inv_attribute_value
      }).some(function (value, index, temp) {

        return temp.indexOf(value) !== temp.lastIndexOf(value);
      })
    }
  }

  /**
   * @method handleQuantityChange
   * @description handle quantity change
   */
  handleQuantityChange = (field, childKey) => {
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    let count = 0
    let data = currentField && currentField.inventory_attributes[field.key] && currentField.inventory_attributes[field.key].children
    if (data) {
      data && data.length && data.map((el, i) => {
        count = count + Number(el.quantity)
      })
      currentField.inventory_attributes[field.key].quantity = count
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

    let temp = currentField.inventory_attributes

    if (temp && temp.length) {
      return temp.map(function (value) {
        return value.inv_attribute_value
      }).some(function (value, index, temp) {
        return temp.indexOf(value) !== temp.lastIndexOf(value);
      })
    }
  }

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

  renderShipMent = () => {
    return (
      <Form.List name="shipping">
        {(fields, { add, remove }) => {
          let currentField = this.formRef.current && this.formRef.current.getFieldsValue()

          return (
            <div>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Row gutter={12}>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <Form.Item
                        label={field.key !== 0 ? '' : [field.label, "Shipping Name"]}
                        name={[field.name, "ship_name"]}
                        fieldKey={[field.fieldKey, "ship_name"]}
                        rules={rules}
                      >
                        <Input placeholder="Shipping Name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                      <Form.Item
                        label={field.key !== 0 ? '' : [field.label, "Price"]}
                        name={[field.name, "ship_amount"]}
                        fieldKey={[field.fieldKey, "ship_amount"]}
                        rules={[{ validator: validNumber }]}
                      >
                        <Input placeholder="Price" />
                        {/* <InputNumber
                                className="price-number"
                                placeholder="Price"
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            /> */}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={field.key !== 0 ? 8 : 10} xl={field.key !== 0 ? 8 : 10}>
                      <Form.Item
                        label={field.key !== 0 ? '' : [field.label, "Delivery Time"]}
                        name={[field.name, "delivery_time"]}
                        fieldKey={[field.fieldKey, "delivery_time"]}
                        rules={rules}
                      >
                        <Input placeholder="Delivery Time" />
                      </Form.Item>
                    </Col>
                    {field.key !== 0 &&
                      <Col xs={24} sm={24} md={24} lg={2} xl={2} className={'align-right'}>
                        <MinusCircleOutlined
                          title={'Remove'}
                          className={'custom-remove-icon'}
                          onClick={() => remove(field.name)}
                        />
                      </Col>
                    }
                  </Row>
                </div>
              ))}
              {fields.length < 3 &&
                <Form.Item>
                  <div className="add-more-btn-box">
                    <div onClick={() => add()} className="inline-block cursur-pointer">
                      <img src={require('../../../assets/images/icons/plus-circle.svg')} alt='Add' /> Add More
                    </div>
                  </div>
                </Form.Item>
              }
            </div>
          );
        }}
      </Form.List>
    )
  }

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
  renderProductImage = (name, i, item) => {
    const { dynamicImageArray } = this.state
    return (
      <div>
        <Form.Item
          // label='Add Inventory Details'
          name={`${name}_image_${i}`}
        >
          <ImgCrop grid zoom={false} aspect={1/1}>
            <Upload
              name='avatar'
              listType='picture-card'
              className='avatar-uploader'
              showUploadList={true}
              fileList={this.state[`${name}${i}`]}
              customRequest={this.dummyRequest}
              onChange={({ file, fileList }) => this.onChange(file, fileList, name, i, item)}
            >
              {this.state[`${name}${i}`] && this.state[`${name}${i}`].length >= 1 ? null : uploadButton}
              {/* {uploadButton} */}
            </Upload>
          </ImgCrop>
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
    if (childAtt && childAtt.length) {
      return childAtt.map((el, i) => {
        return (
          <div key={i}>
            {el.have_image === 1 && this.renderProductImage(el.display_name, item.id, el)}

            {/* <div>
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
          </div> */}
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
    const { group_attribute, dimentionVisible, weightVisible } = this.state;
    if (group_attribute && group_attribute.length) {
      return group_attribute.slice(0, 1).map((el, i) => {
        return (
          <div>
            <div className="heading">
              <Form.Item
                label={'Add Inventory Details'}
                name={'add_inventory_details'}
                className={'mb-0'}
              >
                {this.renderChildAttribute(el, i)}
              </Form.Item>
            </div>
          </div>
        )
      })
    }
  }

  handleProductImageChange = ({ file, fileList }) => {

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



  /**
   * @method renderDynamicInventoryForm
   * @description render dynamic inventory input 
   */
  renderDynamicInventoryForm = () => {
    return (
      <Form.List name="inventory_attributes">
        {(fields, { add, remove }) => {
          let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
          if (currentField) {
            let item = currentField.inventory_attributes ? currentField.inventory_attributes : ''
            console.log('item',item)
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
                        <label className={'ant-form-item-required'}>Quantity</label>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={14} className={'ant-form-item-label'}>
                        <label className={'ant-form-item-required'}>{item && item[0].display_name}</label>
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
                          //rules={[required('')]}
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
                                currentField.inventory_attributes[field.key].inv_attribute_value = ''
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

                                            let temp = currentField.inventory_attributes[field.key] && currentField.inventory_attributes[field.key].children && currentField.inventory_attributes[field.key].children

                                            if (temp && temp[el.key] && temp[el.key].inv_attribute_value) {
                                              toastr.warning('You have already use this value, please select other ')
                                              temp[el.key].inv_attribute_value = ''
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
                                      <img src={require('../../../assets/images/icons/plus-circle.svg')} alt='Add' /> {`Add More ${item[0] && item[0].children ? item[0].children[0].display_name : ''}`}
                                      </div>
                                  </div>
                                </Form.Item>
                                }
                              </div>
                            );
                          }}
                        </Form.List>
                      </Row>
                    </div>
                  </div>
                ))}
                {fields.length !== 0 && item && item[0].display_name && <Form.Item name={'parent'}>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Button type='default' danger className='text-black add-more-colour-btn' onClick={() => add()}>{item && item[0].display_name && ` Add More ${item && item[0].display_name}`}</Button>
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

  // appendInput() {
  //   const { initial_att } = this.state
  //   this.setState(prevState => ({ inv_att: prevState.inv_att.concat([initial_att]) }));
  // }

  // appendChildInput = (index) =>  {
  //   const { children,inv_att } = this.state
  //   
  //   if(inv_att && inv_att[index].children && inv_att[index].children.length){
  //       this.setState(prevState => ({ inv_att: prevState.inv_att[index].children.concat([children])}));
  //       
  //   }
  // }

  // removeClick = (i) => {
  //   let values = [...this.state.inv_att];
  //   values.splice(i,1);
  //   this.setState({inv_att:values });
  // }

  // renderChildInput = (children,index) => {
  //   if(children && children.length){
  //     return (
  //       <div>
  //         {children.map((el, i) => <span>
  //           <Row gutter={0}>
  //           <Col xs={24} sm={24} md={12} lg={12}>
  //             <label>{el.display_name}</label>
  //           </Col>
  //           <Col xs={24} sm={24} md={6} lg={6}>
  //             <label>Quantity</label>
  //           </Col>
  //           <Col xs={24} sm={24} md={6} lg={6}>
  //             {i !== 0 &&
  //               <MinusCircleOutlined
  //                 title={'Add More'}
  //                 onClick={() => this.removeClick(i)}
  //               />
  //             }
  //           </Col>
  //           <Col xs={24} sm={24} md={18} lg={18}>
  //               <Select
  //                 allowClear
  //                 size={'large'}
  //                 className='w-100'
  //               >
  //                 {this.renderDynamicAttOption(el.values)}
  //             </Select>
  //           </Col>
  //           <Col xs={24} sm={24} md={6} lg={6}>
  //             <Input type={'number'} />
  //           </Col>
  //         </Row>

  //         </span>)
  //         }
  //         <div onClick={() => this.appendChildInput(index)} 
  //         style={{cursur:'pointer'}}>
  //           <img src={require('../../../assets/images/icons/plus-circle.svg')} alt='Add' /> Add More
  //         </div>
  //       </div>
  //     )
  //   }

  // }

  // /**
  //  * @method renderCustumDynamicInput
  //  * @description render component  
  //  */
  //  renderCustumDynamicInput = () => {
  //   const { inv_att } = this.state
  //   if(inv_att && inv_att.length){
  //   return (
  //     <div id='dynamicInput'>
  //       {inv_att.map((el, i) => <span>
  //         <Row gutter={0}>
  //         <Col xs={24} sm={24} md={6} lg={6}>
  //           <label>Quantity</label>
  //         </Col>
  //         <Col xs={24} sm={24} md={12} lg={12}>
  //           <label>{el.display_name}</label>
  //         </Col>
  //         <Col xs={24} sm={24} md={6} lg={6}>
  //           {i !== 0 &&
  //             <MinusCircleOutlined
  //               title={'Add More'}
  //               onClick={() => this.removeClick(i)}
  //             />
  //           }
  //         </Col>
  //         <Col xs={24} sm={24} md={6} lg={6}>
  //           <Input type={'number'} />
  //         </Col>
  //         <Col xs={24} sm={24} md={18} lg={18}>
  //             <Select
  //               allowClear
  //               size={'large'}
  //               className='w-100'
  //             >
  //               {this.renderDynamicAttOption(el.values)}
  //           </Select>
  //         </Col>
  //       </Row>
  //       <Row>
  //         {this.renderChildInput(el.children, i)}
  //       </Row>
  //       <Divider />
  //       </span>)
  //       }
  //       <Row>
  //         <Col xs={24} sm={24} md={24} lg={24}>
  //           <Button type="button" className="add-more-colour-btn" onClick={() => this.appendInput()}>Add more </Button>
  //         </Col>
  //       </Row>
  //     </div >
  //   )
  //   }
  // }


  /**
   * @method render
   * @description render component
   */
  render() {
    const {initial_att, invInitialTest, inv_att, dimentionVisible, weightVisible, inventory_attributes, brandVisible, shipmentVisible, initial, inspectiontime, otherAttribute, fileList, textInputs, brandList, shipping } = this.state
    const { step1, have_questions } = this.props
    console.log('initial_att',invInitialTest)

    return (
      <Fragment>
        <div className='wrap'>
          <div className='post-ad-box'>
            {RetailNavBar(step1)}
            <Form
              layout='vertical'
              onFinish={this.onFinish}
              ref={this.formRef}
              autoComplete="off"
              initialValues={{
                name: 'shipping',
                shipping: initial ? shipping : [{ ship_name: '', ship_amount: '', delivery_time: '' }],
                name: "inventory_attributes",
                // inventory_attributes: inv_att && inv_att.length ? inv_att :  [{ quantity: '', color: '', children: [{ size: '', length:'', width:'', height: '', quantity: ''}] }],
                inventory_attributes: this.state.invInitialTest,
              }}
            >
              <div className='card-container signup-tab'>
                <Tabs type='card'>
                  <TabPane tab='Post Details' key='1'>
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
                          <Radio value={'Non-Brand'}>Non - Brand</Radio>
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
                    <div className="heading">
                      <Form.Item
                        label={'Upload Product Image'}
                        name={'upload_product_image'}
                      >
                        <p>Add up to 8 images or upgrade to include more.<br />
                          Hold and drag to reorder photos. Maximum file size 4MB.</p>
                      </Form.Item>
                    </div>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <div className="file-uploader">
                        <ImgCrop grid zoom={false} aspect={1/1}>
                          <Upload
                            name='avatar'
                            listType='picture-card'
                            className='avatar-uploader'
                            showUploadList={true}
                            fileList={fileList}
                            customRequest={this.dummyRequest}
                            onChange={this.handleProductImageChange}
                          >
                            {fileList.length >= 8 ? null : uploadButton}
                          </Upload>
                          </ImgCrop>
                        </div>
                      </Col>
                    </Row>

                    {this.renderItem()}
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
                    {dimentionVisible && <Row gutter={12}>
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
                    {this.renderGroupAttribute()}


                    {/* {this.renderInventoryForm()} */}
                    {/* {inv_att && inv_att.length && this.renderCustumDynamicInput()} */}
                    { this.renderDynamicInventoryForm()}

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
                      {shipmentVisible && this.renderShipMent()}
                    </div>
                    <Row gutter={12}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item
                            label={'Price'}
                            name={'price'}
                            rules={[{ validator: validNumber }]}
                            onChange={this.handlePrice}
                            required
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
              </div>
              <div className='steps-action flex align-center mb-32'>
                <Button htmlType='submit' type='primary' size='middle' className='btn-blue'>
                  NEXT
              </Button>
              </div>
            </Form>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, postAd } = store;
  const { step1 } = postAd;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    step1,
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};
export default connect(
  mapStateToProps,
  { uploadRetailProductImage, getGSTPercentage, getAllBrandsAPI, getRetailDynamicAttribute, setAdPostData, enableLoading, disableLoading }
)(Step3);

