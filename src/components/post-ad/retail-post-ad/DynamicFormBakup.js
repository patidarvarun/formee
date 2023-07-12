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
import { required, validNumber} from '../../../config/FormValidation'
import {uploadRetailProductImage,getGSTPercentage,getAllBrandsAPI,getRetailDynamicAttribute, enableLoading, disableLoading } from '../../../actions'
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
      initial: false,
      brandList:[],
      shipping: [],
      percentageAmount:'',
      shipmentVisible: false,
      comissionAmount:'',
      gstAmount:'',
      group_attribute: [],
      dynamicImageArray: [],
      uploadedUrl: []
    };
  }

  /**
   * @method componentWillMount
   * @description mount before render the component
   */
  componentWillMount() {
    if (this.props.reqData) {
      const { reqData } = this.props;
      reqData.map((el) => {
        // if (el.type === 'inventory_attributes') {
        //   this.formRef.current && this.formRef.current.setFieldsValue({
        //     [el.inventory_attributes]: el.value
        //   });
        //   this.setState({ inspectiontime: el.value, initial: true })
        // }
        if (el.type === 'shipping') {
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.shipping]: el.value
          });
          this.setState({ shipping: el.value, initial: true })
        }
      })
    }
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading()
    const { step1 } = this.props;
    // let catId = step1.parent_categoryid
    let catId = step1.category_id
    this.getBrandsList(catId)
    this.props.getGSTPercentage(res => {
      if(res.status === 200){
        let data = res.data && res.data.data
        this.setState({percentageAmount: data})
      }
    })
    this.props.getRetailDynamicAttribute({ categoryid: catId }, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        let temp = [],imageTemp = []
        let group_attribute = res.data.inv_attribute_group && Array.isArray(res.data.inv_attribute_group) ? res.data.inv_attribute_group : []
        const atr = Array.isArray(res.data.attributes) ? res.data.attributes : [];
        const mandate = atr.filter(el => el.validation === 1)
        const optinal = atr.filter(el => el.validation === 0)
        group_attribute && group_attribute.length && group_attribute.map((el,i) => {
          let childAtt = el && el.inv_attributes && Array.isArray(el.inv_attributes) && el.inv_attributes.length ? el.inv_attributes : []
          childAtt && childAtt.length && childAtt.map((el2,i) => {
            temp.push(el2)
          })
        })
        this.setDynamicState(temp)
        
        this.setState({attribute: mandate, otherAttribute: optinal,group_attribute: group_attribute, allgroupAtt:temp })
      }
    })

    if (this.props.reqData) {
      const { reqData } = this.props;
      
      reqData.map((el) => {
        if (el.type === 'calendar') {
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.key]: moment(el.value)
          });
        } else if (el.type === 'fileList') {
          this.setState({ FileList: el.value })
        } else if (el.type === 'image') {
          let dynamicImageArray = el.value
          dynamicImageArray && dynamicImageArray.length && dynamicImageArray.map((el,i) => {
            this.setState({[`${el.display_name}${el.group_id}`] : el.fileList ? el.fileList : []})
          })
        }else if(el.key === 'uploadedUrl'){
          this.setState({uploadedUrl: el.value})
        }else if(el.key === 'shipment'){
          this.setState({ shipmentVisible: el.value === '1' ? true : false })
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
    allgroupAtt && allgroupAtt.length && allgroupAtt.map((el,i) => {
      if(el.have_image == 1){
        imageTemp.push({group_id: el.pivot.inv_group_id, inv_attribute_id: el.id, display_name: el.display_name})
      }
    })
    
    this.setState({dynamicImageArray: imageTemp})
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
    const {uploadedUrl,dynamicImageArray, attribute, otherAttribute, fileList,percentageAmount, gstAmount, comissionAmount,group_attribute,allgroupAtt } = this.state;
    
    
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
    // let imageArray = [], uploadedUrl = []
    // if(dynamicImageArray && dynamicImageArray.length){
    //   dynamicImageArray.map(el => {
    //     let imageObj = []
    //     el.fileList && Array.isArray(el.fileList) && el.fileList.filter((el) => {
    //       el.originFileObj && imageObj.push(el.originFileObj)
    //     })
    //     imageArray.push({
    //       group_id: el.group_id,
    //       inv_attribute_id:el.inv_attribute_id,
    //       //image: imageObj,
    //       image: el.fileList && el.fileList.length ? el.fileList[0].originFileObj : el.fileList[0].originFileObj 
    //     })
    //   })
    //   
    //   imageArray && imageArray.length && imageArray.map(el => {
    //     let formData = new FormData();
    //     Object.keys(el).forEach((key) => {
    //       formData.append(key, el[key])
    //     });
    //     this.props.uploadRetailProductImage(formData, res => {
    //       if(res.status === 200){
    //         
    //         uploadedUrl.push(res.data.data)
    //         toastr.success('Image has been uploaded successfully')
    //       }
    //     })
    //   })
    // }
   
    let tempArray = [], tempArray2=[]
    
    Object.keys(value).filter(function (key, index) {
      allgroupAtt && allgroupAtt.length && allgroupAtt.map((el2,i) => {
        if (`${el2.display_name}${el2.id}${el2.pivot.inv_group_id}` == key) {
          let imageUrl = '',imageData= ''
          if(groupAtt[el2.pivot.inv_group_id] !== undefined){
            if(uploadedUrl && uploadedUrl.length){
              imageData = uploadedUrl.filter(el => el.group_id == el2.pivot.inv_group_id)
            }
            
            groupAtt[el2.pivot.inv_group_id] = [...groupAtt[el2.pivot.inv_group_id],{
              inv_attribute_id : el2.id,
              inv_attribute_value : value[key],
              image_url: imageData && imageData.length &&  imageData[0].image_url ? imageData[0].image_url : ''
            }];
          }else {
            groupAtt[el2.pivot.inv_group_id] = [{
              inv_attribute_id : el2.id,
              inv_attribute_value : value[key],
              image_url: imageData && imageData.image_url ? imageData.image_url : ''
            }];
          }
          tempArray.push({
            key: key,
            value: value[key]
          })
        }
      })
    })
    
    let secondArray = [{ key: 'title', value: value.title, type: 'text' }, { key: 'features', value: value.features, type: 'text' }, { key: 'other_notes', value: value.other_notes, type: 'text' },
    { key: 'description', value: value.description, type: 'text' },{key:'brand_name', value: value.brand_name},
    { key: 'image', value: dynamicImageArray && dynamicImageArray.length ? dynamicImageArray : [], type: 'image' },
    { key: 'inventory_attributes', value: value.inventory_attributes, type: 'inventory_attributes' },
    { key: 'shipping', value: value.shipping, type: 'shipping' },
    { key: 'condition', value: value.condition }, { key: 'brand', value: value.brand },
    { key: 'shipment', value: value.shipment },
    { key: 'price', value: value.price },{ key: 'final_price', value: value.final_price },
    {key: 'uploadedUrl', value:uploadedUrl},
    { key: 'fileList', value: fileList && fileList.length ? fileList : [], type: 'fileList' },
  ]
   
    let finalArray = temp2.concat(secondArray)
    let thirdArray = tempArray.concat(finalArray)
    
    const requestData = {
      attributevalue: temp,
      inv_attribute_groups:groupAtt,
      description: value.description,
      features: value.features,
      other_notes: value.other_notes,
      price: value.price ? value.price : '',
      title: value.title,
      brand_name:value.brand_name,
      condition:value.condition ? value.condition : '',
      brand: value.brand ? value.brand : 'Non Brand',
      shipping:value.shipment ? value.shipment : 0,
      specification: specification,
      inventory_attributes: value.inventory_attributes,
      inspectionPreview: value.inspection_time,
      shippingArray:value.shipping ? value.shipping : [],
      percentageAmount: percentageAmount,
      gstAmount:gstAmount,
      comissionAmount:comissionAmount,
      fileList: fileList
    }
    
    this.props.setAdPostData(requestData, 2)
    this.props.setAdPostData({ fileList: fileList && fileList.length ? fileList : [] }, 'fillist')
    // this.props.nextStep(finalArray)
    this.props.nextStep(thirdArray)
  }

  onChange = (file, fileList, name, i,att) => {
    
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
      this.setState({ [`${name}${i}`]:fileList });
      
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
        if(res.status === 200){
          
          this.setState({uploadedUrl:[...this.state.uploadedUrl, res.data.data] });
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
   * @method renderInventoryForm
   * @description render inventory form inputs 
   */
  renderInventoryForm = () => {
    return (
      <Form.List name="inventory_attributes">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <Row key={field.key}>
                  <Row gutter={24} >
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={6} lg={6}>
                        <label>Quantity</label>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <label>Colour / Pattern Name</label>
                      </Col>
                      <Col xs={24} sm={24} md={6} lg={6}>
                        {field.key !== 0 &&
                          <MinusCircleOutlined
                            // className="dynamic-delete-button"
                            title={'Add More'}
                            onClick={() => remove(field.name)}
                          />
                        }
                      </Col>
                      <Col xs={24} sm={24} md={6} lg={6}>
                        <Form.Item
                          name={[field.name, "quantity"]}
                          fieldKey={[field.fieldKey, "quantity"]}
                          rules={[required('')]}
                        >
                          {/* <Select>
                            <Option value="KG">KG</Option>
                            <Option value="LB">LB</Option>
                          </Select> */}
                          <Input type={'number'} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={18} lg={18}>
                        <Form.Item
                          name={[field.name, "color"]}
                          fieldKey={[field.fieldKey, "color"]}
                          rules={[required('')]}
                        >
                          <Input placeholder="Basic usage" type='color'/>
                        </Form.Item>
                      </Col>
                     
                    </Row>
                    <div className=" inventory-size">
                      <Row gutter={0}>
                        <Col xs={24} sm={24} md={6} lg={6}>
                          <label className="mb-0 ">Size</label>
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={18}>
                          <div className="width-parameter-block">
                            <label>Product Dimensions</label>
                            <Select defaultValue="Centimeters " className="centimeters-select">
                              <Option value="Inches ">Inches </Option>
                              <Option value="Centimeters ">Centimeters </Option>
                              <Option value="Feet">Feet</Option>
                            </Select>
                          </div>
                        </Col>
                        <Form.List name={[field.fieldKey, "inventory_size"]}>
                          {(inventory_size, { add, remove }) => {
                            return (
                              <div >
                                <div className="lwh-block-parent">
                                {inventory_size.map((el, index2) => (
                                  <Row>
                                    <Col xs={24} sm={24} md={6} lg={6}>
                                      <Form.Item
                                        {...el}
                                        name={[el.name, "size"]}
                                        fieldKey={[el.fieldKey, "size"]}
                                        key={index2}
                                      >
                                        <Select>
                                          <Option value="Small">Small (S)</Option>
                                          <Option value="Medium">Medium (M)</Option>
                                          <Option value="Large">Large (L)</Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={18} lg={18}>
                                      <div className="lwh-block">
                                        <Row gutter={20}>
                                          <Col xs={24} sm={24} md={8} lg={8}>
                                            <div className="flex-block">
                                              <Form.Item
                                                {...el}
                                                label={[el.label, "Length :"]}
                                                name={[el.name, "length"]}
                                                fieldKey={[el.fieldKey, "length"]}
                                                key={index2}
                                              // rules={[required('')]}
                                              >
                                                <InputNumber defaultValue={0} />
                                              </Form.Item>
                                            </div>
                                          </Col>
                                          <Col xs={24} sm={24} md={8} lg={8}>
                                            <div className="flex-block">
                                              <Form.Item
                                                {...el}
                                                label={[el.label, "Width :"]}
                                                name={[el.name, "width"]}
                                                fieldKey={[el.fieldKey, "width"]}
                                                key={index2}
                                              // rules={[required('')]}
                                              >
                                                <InputNumber defaultValue={0} />
                                              </Form.Item>
                                            </div>
                                          </Col>
                                          <Col xs={24} sm={24} md={6} lg={6}>
                                            <div className="flex-block">
                                              <Form.Item
                                                {...el}
                                                label={[el.label, "Hight :"]}
                                                name={[el.name, "hight"]}
                                                fieldKey={[el.fieldKey, "hight"]}
                                                key={index2}
                                              // rules={[required('')]}
                                              >
                                                <InputNumber defaultValue={0} />
                                              </Form.Item>
                                            </div>
                                          </Col>
                                          <Col xs={24} sm={24} md={2} lg={2}>
                                            <div className="flex-block">
                                              <MinusCircleOutlined
                                                className="edit-menu-remove"
                                                onClick={() => {
                                                  remove(el.name);
                                                }}
                                              />
                                            </div>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Col>
                                  </Row>
                                ))}
                                {/* <Divider className="marg-less" /> */}
                                </div>
                                <Form.Item className="mb-0 add-card-link-mb-0">
                                  <Row>
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                      <div className="add-more-size">
                                        <div onClick={() => add()}>
                                          <img src={require('../../../assets/images/icons/plus-circle.svg')} alt='Add' />
                                          <div>Add More Size</div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </Form.Item>
                              </div>
                            );
                          }}
                        </Form.List>
                      </Row>
                    </div>
                  </Row>
                </Row>
              ))}
              {/* <Form.Item > */}
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Button type="button" className="add-more-colour-btn" onClick={() => add()}>Add more colour</Button>
                  </Col>
                </Row>
              {/* </Form.Item> */}
            </div>
          );
        }}
      </Form.List>
    )
  }

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

  renderShipmentElement = () => {
    let temp = [1,2,3];
      return (
        <div className="shipment-grid-block">
          <div className="shipname">
            <Form.Item
              label='Shippling Name'
              name={`ship_name_1`}
              className='label-large'
            >
              <Input/>
            </Form.Item>
          </div>
          <div className="price">
            <Form.Item
                label='Price'
                name={`ship_amount_1`}
                className='label-large'
              >
                <Input type='number'/>
              </Form.Item>
          </div>
          <div className="shipname">
            <Form.Item
              label='Shippling Name'
              name={`ship_name_2`}
              className='label-large'
            >
              <Input/>
            </Form.Item>
          </div>
          <div className="price">
            <Form.Item
                label='Price'
                name={`ship_amount_2`}
                className='label-large'
              >
                <Input type='number'/>
              </Form.Item>
          </div>
          <div className="shipname">
            <Form.Item
              label='Shippling Name'
              name={`ship_name_3`}
              className='label-large'
            >
              <Input/>
            </Form.Item>
          </div>
          <div className="price">
            <Form.Item
                label='Price'
                name={`ship_amount_3`}
                className='label-large'
              >
                <Input type='number'/>
              </Form.Item>
          </div>
          
        </div>
      )
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
                            <img src={require('../../../assets/images/icons/plus-circle.svg')} alt='Add' />
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
  renderProductImage = (name, i,item) => {
    const { dynamicImageArray } = this.state
    return (
      <div>
       <Form.Item
          label='Add Inventory Image'
          name={`${name}_image_${i}`}
          className='label-large'
        >
        {/* <ul className='pl-0'>
          <li>Add upto 8 images or upgrade to include more</li>
          <li >Maximum File size 4MB</li>
        </ul> */}
        <Upload
          name='avatar'
          listType='picture-card'
          className='avatar-uploader'
          showUploadList={true}
          fileList={this.state[`${name}${i}`]}
          customRequest={this.dummyRequest}
          onChange={({ file, fileList }) => this.onChange(file, fileList, name, i,item)}
        >
          {this.state[`${name}${i}`] && this.state[`${name}${i}`].length >= 1 ? null : uploadButton}
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
            {el.have_image === 1 && this.renderProductImage(el.display_name,item.id, el)}
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
        return (
          <div>
            <h3>{el.name}</h3>
            {this.renderChildAttribute(el, i)}
          </div>
        )
      })
    }
  }

  handleProductImageChange = ({file, fileList}) => {
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      this.setState({ fileList:fileList });
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { shipmentVisible,initial, inspectiontime, otherAttribute, fileList, textInputs,brandList,shipping } = this.state
    const { step1, have_questions } = this.props
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
                name:'shipping',
                shipping:initial ? shipping : [{ ship_name: '', ship_amount: '' }, { ship_name: '', ship_amount: '' }, { ship_name: '', ship_amount: '' }] 
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
                    {this.renderGroupAttribute()}

                    {/* <div className="profile-vendor-retail-orderdetail">
                      <div className="post-ad-box-invemtory">
                        <div className="tab-view-content"> */}
                          <div className="heading">
                            <h2>Upload Product Image</h2>
                            <p>Add up to 8 images or upgrade to include more.<br />
                                Hold and drag to reorder photos. Maximum file size 4MB.</p>
                          </div>
                          <Row gutter={0}>
                            <Col xs={24} sm={24} md={24} lg={24}>
                              <div className="file-uploader">
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
                              </div>
                            </Col>
                          </Row>
                         
                          {/* {this.renderInventoryForm()} */}

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
                                  <Radio value={'Non-Brand'}>Non - Brand</Radio>
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

                            {/* <div className="shipment-grid-block">
                              <div className="shipname">Shipping Name </div>
                              <div className="price">Price</div>

                              <div className="shipname">Shipping Name</div>
                              <div className="price">Price</div>

                              <div className="shipname">Shipping Name</div>
                              <div className="price">Price</div>
                             
                            </div> */}
                            {/* {this.renderShipmentElement()} */}
                            {shipmentVisible && this.renderShipMent()}
                          </div>
                        {/* </div>
                      </div>
                    </div> */}
                    <Row gutter={20}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item
                            label={'Price'}
                            name={'price'}
                            rules={[{ validator: validNumber }]}
                            onChange={this.handlePrice}
                          >
                            {/* <InputNumber
                              className="price-number"
                              placeholder="Price"
                              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            /> */}
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
  {uploadRetailProductImage,getGSTPercentage,getAllBrandsAPI, getRetailDynamicAttribute, setAdPostData, enableLoading, disableLoading }
)(Step3);

