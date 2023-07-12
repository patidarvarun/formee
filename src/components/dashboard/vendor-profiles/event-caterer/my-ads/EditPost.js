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
import {Switch, Select, Layout, Typography, DatePicker, TimePicker, Row, Col, message, Upload, Form, Checkbox, Radio, Tabs, Button, Collapse, Input } from 'antd';
import Icon from '../../../../customIcons/customIcons';
import { langs } from '../../../../../config/localization';
import '../../../../auth/registration/style.less';
import { renderField } from '../../../../forminput'
import { required, validMobile } from '../../../../../config/FormValidation'
import { getAddress, converInUpperCase } from '../../../../common'
import { enableLoading, disableLoading, getClassfiedCategoryDetail } from '../../../../../actions'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { deleteInspectionAPI, updatePostAdAPI, getChildInput, getClassifiedDynamicInput, setAdPostData, getPostAdDetail } from '../../../../../actions/classifieds/PostAd'
import { QUESTION_TYPES } from '../../../../../config/Config'
import PlacesAutocomplete from '../../../../common/LocationInput';
import Preview from './Preview'
import JobPreview from './PreviewJobModel'
import MembershipPlan from './Payment'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select
const {Text, Title, Paragraph } = Typography;
const timeList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

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
      videoList:[],
      floorPlan: [],
      companyLogo: [],
      editorState: BraftEditor.createEditorState(''),
      is_ad_free: false,
      isOpen: false,
      formmeTemplate: [],
      isShow: true,
      sale_via_exp: false
    };
  }

  /**
   * @method componentWillMount
   * @description called after render the component
   */
  componentWillMount() {
    this.props.enableLoading()
    this.getPostAdDetails()
  }

  getPostAdDetails = () => {
    const { loggedInUser, userDetails } = this.props
    let catId = this.props.match.params.adId
    let reqData = {
      id: catId,
      user_id: loggedInUser.id
    }
    this.props.getPostAdDetail(reqData, res => {
      this.props.disableLoading()
      
      if (res.status === 200) {
        let data = res.data.data
        
        const atr = data && Array.isArray(data.classified_attribute) && data.classified_attribute.length ? data.classified_attribute : [];
        const mandate = atr.filter(el => el.validation === 1)
        const optional = atr.filter(el => el.validation === 0)
        let negotiable = atr.filter(el => el.slug === 'is_price_negotiable?' || el.att_name === "Is price negotiable?")
        let formmeTemplate = atr.filter(el => el.slug === 'about_you:' || el.slug === 'key_responsibilities:' || el.slug === 'How_to_apply')
        let negotiable_data = negotiable && Array.isArray(negotiable) && negotiable.length ? negotiable[0] : ''
        console.log(negotiable,'negotiable_data',negotiable_data)
        let allAtt = [...mandate, ...optional]
        let inspectionTime = data.inspection_times
        this.getDefaultINVAttribute(allAtt)
        this.getInspectionType(inspectionTime)
        this.getAllInitialValue(data, mandate, optional)
        this.getClassifiedDetails(catId)
        this.setState({negotiable_data: negotiable_data,formmeTemplate: formmeTemplate})
      }
    })
  }

  getClassifiedDetails = (catId) => {
    const { isLoggedIn, loggedInUser } = this.props
    let reqData = {
      id: catId,
      user_id: isLoggedIn ? loggedInUser.id : ''
    }
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading()
      if (res.status === 200) {
        this.setState({ classifiedDetail: res.data })
      }
    })
  }

  /**
   * @method getAllInitialValue
   * @description get all initial values
   */
  getAllInitialValue = (data, mandate, optional) => {
    const { fname, lname } = this.props.userDetails
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
      title,
      price, description, contact_mobile, category_name, subcategory_name,
      hide_mob_number, location, sub_sub_category_name, is_ad_free, sale_via_exp
    } = data;
    this.formRef.current && this.formRef.current.setFieldsValue({
      fname: fname ? converInUpperCase(fname) : '',
      lname: lname ? converInUpperCase(lname) : '',
      contact_email,
      title, price, 
      description:BraftEditor.createEditorState(description),
      parent_categoryid: category_name,
      category_id: subcategory_name ? subcategory_name : sub_sub_category_name ? sub_sub_category_name : '',
      contact_mobile: contact_mobile && contact_mobile !== 'N/A' ? contact_mobile : '',
      hide_mob_number: hide_mob_number ? hide_mob_number : false,
      address: location,
      inspection_type: data.inspection_type,
    });
    if (data.inspection_type === 'Weekly Time') {
      this.setState({ weekly: true, singleDate: false, byAppointment: false })
    } else if (data.inspection_type === 'Single Date') {
      this.setState({ weekly: false, singleDate: true, byAppointment: false })
    }
    this.setState({
      adPostDetail: data,
      address: data.location,
      attribute: mandate,
      otherAttribute: optional,
      fileList: predefinedImages,
      floorPlan: data.floor_plan ? [{
        uid: `-${1}`,
        name: 'image.png',
        status: 'done',
        url: data.floor_plan ?  data.floor_plan : "",
        type: 'image/jpeg',
        size: '1024',
      }] : [],
      companyLogo:[{
        uid: `-${1}`,
        name: 'image.png',
        status: 'done',
        url: data.company_logo ?  data.company_logo : "",
        type: 'image/jpeg',
        size: '1024',
      }],
      is_ad_free: is_ad_free ? true : false,
      sale_via_exp: sale_via_exp ? true : false
    })
  }

  /**
   * @method getDefaultINVAttribute
   * @description get default inv attributes
   */
  getDefaultINVAttribute = (allAtt) => {
    if (allAtt && allAtt.length) {
      
      allAtt.map((el) => {
        
        if (el.attr_type_name === 'calendar' || el.attr_type_name === 'Date') {
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
        }else if (el.attr_type_name === 'textarea'){
          this.formRef.current && this.formRef.current.setFieldsValue({
            [el.att_name]: BraftEditor.createEditorState(el.selectedvalue)
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
   * @method formateTime
   * @descriptionget format default time
   */
  formateTime = (time) => {
    let time1 = new Date();
    let [hours, minutes, seconds] = time.split(':'); // Using ES6 destructuring
    time1.setHours(+hours); time1.setMinutes(minutes); time1.setSeconds(seconds);
    return time1
  }

  /**
   * @method getInspectionType
   * @descriptionget initial inspection list
   */
  getInspectionType = (inspectionTime) => {
    const { singleDate } = this.state
    let tempArray = [], temp2 = []
    if (inspectionTime) {
      inspectionTime && Array.isArray(inspectionTime) && inspectionTime.length && inspectionTime.map((el, i) => {
        
        let time1 = this.formateTime(el.inspection_start_time)
        let time2 = this.formateTime(el.inspection_end_time)
        tempArray.push({
          id: el.id ? el.id : '',
          inspection_date: moment(el.inspection_date),
          inspection_start_time: moment(time1),
          inspection_end_time: moment(time2)
        })
        temp2.push({
          inspection_date: moment(el.inspection_date).format('DD-MM-YYYY'),
          inspection_start_time: moment(time1).format('HH:mm:ss'),
          inspection_end_time: moment(time2).format('HH:mm:ss')
        })
      })
      this.setState({ inspectiontime: temp2, initial: true })
      this.formRef.current && this.formRef.current.setFieldsValue({
        inspection_time: tempArray
      });
    }
  }

  /*
  * @method renderSelect
  * @descriptionhandle render select
  */
  renderMinSalary = (data) => {
    return (
      <div>
          <Form.Item
              label={data.att_name}
              name={data.att_name}
              className="w-100"
              rules={data.validation === 1 && [required('')]}
          >
             <Input onChange={(e) => {this.setState({flag: true})}} type={'number'}/>
          </Form.Item>
      </div>
    )
  }

   /*
  * @method renderSelect
  * @descriptionhandle render select
  */
  renderMaxSalary = (data) => {
    const { min_salary } = this.state
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    let minimum_salary = currentField['Minimum Salary']
    console.log('minimum_salary', minimum_salary)
    return (
      <div>
          <Form.Item
              label={data.att_name}
              name={data.att_name}
              className="w-100"
              rules= {[
                {
                  validator: (rule, value, callback) => {
                    console.log(minimum_salary,'value$$', value, 'condition',value<minimum_salary)
                    if(value === '' || value === undefined || value === null){
                      callback('This field is required')
                      return
                    }else if(Number(value) < Number(minimum_salary)){
                      callback('Maximum salary must be greater than minimum salary.')
                      return
                    }else {
                      callback()
                      return 
                    }
                  }
                }
              ]}
          >
            <Input 
              disabled={min_salary || minimum_salary ? false : true} 
              type={'number'}
            />
          </Form.Item>
      </div>
    )
  }


  renderFeatures = (data,categoryName) => {
    const { loggedInUser } = this.props
    let realStateVendor = loggedInUser.user_type === langs.key.business && loggedInUser.role_slug === langs.key.real_estate
    return (
      <Form.Item
            label={categoryName !== 'Automotive' && data.att_name}
            name={data.att_name}
            rules={categoryName !== 'Automotive' && data.validation === 1 && [required('')]}
          >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              {data && data.value && data.value.map((el, i) => {
                return (
                  <Col span={realStateVendor ? 8 : 12} key={i}>
                    <Checkbox value={el.name}>{el.name}</Checkbox>
                  </Col>
                )
              })}
              </Row>
          </Checkbox.Group>
      </Form.Item>
    )
  }

  /**
   * @method renderMultiSelect
   * @description render Multiselect
   */
  renderMultiSelect = (data) => {
    const {adPostDetail, isShow } = this.state
    let categoryName = adPostDetail && adPostDetail.category_name
    return (
      categoryName === 'Automotive' ? <Collapse defaultActiveKey={['1']} onChange={() => this.setState({isShow : !isShow})}>
        <Panel header='Features' key="1" extra={
          <MinusCircleOutlined  title={isShow ? 'Hide Features' :'Show Features'}/>
        }>
          {this.renderFeatures(data,categoryName)}
        </Panel>
      </Collapse>: <> {this.renderFeatures(data,categoryName)}</>
    )
  }


 /**
   * @method renderItem
   * @description render dynamic input
   */
  renderItem = () => {
    const { attribute } = this.state;
    if (attribute && attribute.length) {
      return attribute.map((data, i) => {
         let min_salary = data.slug === 'minimum_salary' || data.att_name === 'Minimum Salary'
        let max_salary = data.slug === 'maximum_salary' || data.att_name === 'Maximum Salary'
        let specialAtt = (data.slug !== 'is_price_negotiable?' && data.att_name !== "Is price negotiable?")  && data.slug !== 'about_you:' && data.slug !== 'key_responsibilities:' && data.slug !== 'How_to_apply'
        if(data.attr_type_name  === 'Multi-Select' && (data.slug === 'features' || data.att_name === 'Features')){
          return (
            <div key={i}>
              {this.renderMultiSelect(data)}
            </div>
          )
        }else if(specialAtt){
          return (
            <div key={i}>
              {min_salary  ? this.renderMinSalary(data) : max_salary ? this.renderMaxSalary(data) :
              renderField(data, data.attr_type_name, data.value)}
            </div>
          )
        }
      });
    }
  }

   /**
   * @method renderFormeeTemplate
   * @description render formme template
   */
    renderFormeeTemplate = () => {
      const { formmeTemplate } = this.state;
      if (formmeTemplate && formmeTemplate.length) {
        return formmeTemplate.map((data, i) => {
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

  PastDate = (array) => {
    if (array.length) {
      return array.map(el => {
        var dateObj = new Date();  // subtract one day from current time  
        dateObj.setDate(dateObj.getDate() - 1);
        let value = moment(el.inspection_date).toString < dateObj
        
        
        return value
      })
    }
  }

  /**
  * @method getAttributes
  * @description formate attributes value
  */
  getAttributes = (value) => {
    const {sale_via_exp,is_ad_free,companyLogo,floorPlan,videoList, inspectiontime, data, attribute, otherAttribute, fileList, textInputs, hide_mob_number, adPostDetail } = this.state;
    const { step1, loggedInUser } = this.props
    let temp = {}, specification = [], price = '';
    let temp2 = []
    const me = this.props
    let allDynamicAttribute = [...otherAttribute, ...attribute]
    let answers = [], isReturn = false
    const job = loggedInUser.user_type === langs.key.business && loggedInUser.role_slug === langs.key.job
    let realState = loggedInUser.user_type === langs.key.business && loggedInUser.role_slug === langs.key.real_estate
    let tempArray = [], tempArray2 = []
    if (realState) {
      if (value.inspection_time) {
        let data = value.inspection_time
        data && Array.isArray(data) && data.length && data.map((el, i) => {
          tempArray.push({
            id: el.id ? el.id : '',
            inspection_date: moment(el.inspection_date).format('DD-MM-YYYY'),
            inspection_start_time: moment(el.inspection_start_time).format('HH:mm:ss'),
            inspection_end_time: moment(el.inspection_end_time).format('HH:mm:ss')
          })
          tempArray2.push({
            inspection_date: moment(el.inspection_date).format('DD-MM-YYYY'),
            inspection_start_time: moment(el.inspection_start_time).format('hh:mm a'),
            inspection_end_time: moment(el.inspection_end_time).format('hh:mm a')
          })
        })
        
      }
      let isDuplicate = this.hasDupsObjects(tempArray2)
      // let isPastDate = this.PastDate(tempArray2)
      // 
      // 
      // if(isPastDate){
      //   toastr.warning('Inpection date can not be past date')
      //   return true
      // }
      if (isDuplicate) {
        toastr.warning('Inpection time can not be duplicate')
        return true
      }
    }
    
    if (this.props.have_questions === 1) {
      //Question Answer reqBody Logic
      textInputs.map((el) => {
        
        let temp = []
        Array.isArray(el.ansInputs) && el.ansInputs.map((k) => {
          temp.push(`answerIs_${k + 1}`)
        })

        // Validations
        if (job && !el.question) {
          toastr.warning('Warining', 'All Questions are required')
          isReturn = true
          return true
        }

        if (job && el.ans_type === QUESTION_TYPES.RADIO || el.ans_type === QUESTION_TYPES.CHECKBOX) {
          let i = el.options.findIndex((o) => o == '')
          

          if (i > -1) {
            toastr.warning('Warining', 'Atleast two Options are Required')
            isReturn = true
            return true
          }
          

          if (el.ansInputs.length == 0) {
            toastr.warning('Warining', 'Atleast Answer is Required')
            isReturn = true
            return true
          }
        }

        if (job && el.ans_type === QUESTION_TYPES.RADIO) {
          answers.push({
            'options': temp
          })
        } else if (el.ans_type === QUESTION_TYPES.CHECKBOX) {
          
          answers.push({
            'options': temp

          })
        } else {
          answers.push({
            'options': []
          })
        }
      })
    }
    Object.keys(value).filter(function (key, index) {
      
      if (value[key] !== undefined) {
        allDynamicAttribute.map((el, index) => {

          if (el.att_name === key) {
            let att = allDynamicAttribute[index]
            
            // if (el.att_name === 'Price') {
            //   price = value[key]
            // }
            let dropDropwnValue, checkedValue;
            if (att.attr_type_name === 'Radio-button') {
              let selectedValueIndex = att.value.findIndex((el) => (el.id === value[key] || el.name === value[key]))
              checkedValue = att.value[selectedValueIndex]
              
            }
            if (att.attr_type_name === 'Drop-Down') {
              let selectedValueIndex = att.value.findIndex((el) => (el.id === value[key] || el.name === value[key]))
              
              
              dropDropwnValue = att.value[selectedValueIndex]
              
              if (att.have_children) {
                const requestData = {
                  attributeValueid: dropDropwnValue.id,
                  attribute_id: att.att_id
                }
                
                
                me.getChildInput(requestData, res => {
                  
                  if (res.status === 200) {
                    let data = res.data.data
                    
                    const childData = res.data.data && Array.isArray(res.data.data.value) ? res.data.data.value : []
                    Object.keys(value).filter(function (key, index) {
                      if (data.att_name === key) {
                        
                        let selectedValueIndex = childData.findIndex((el) => (el.id == value[key]))
                        
                        dropDropwnValue = childData[selectedValueIndex]
                        
                        temp[data.att_id] = {
                          // name: att.att_name,
                          attr_type_id: data.attr_type,
                          attr_value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue && dropDropwnValue.id : (att.attr_type_name === 'calendar') ? moment(value[key]).format('YYYY') : (att.attr_type_name === 'Date') ? moment(value[key]).format('MMMM Do YYYY, h:mm:ss a') : att.attr_type_name === 'Radio-button' ? checkedValue.id : att.attr_type_name === 'textarea' ? value[key].toHTML() : value[key],
                          // attr_value: (data.attr_type_name === 'Drop-Down') ? dropDropwnValue.id : value[key],
                          parent_value_id: dropDropwnValue && dropDropwnValue.attribute_value_id ? dropDropwnValue.attribute_value_id : 0,
                          parent_attribute_id: (data.attr_type_name === 'Drop-Down') ? dropDropwnValue && dropDropwnValue.attribute_parent_id : 0,
                          attr_type_name: data.attr_type_name
                        };
                        specification.push({
                          key: data.att_name,
                          slug:data.slug,
                          value: dropDropwnValue && dropDropwnValue.name
                        })
                        
                      }
                    })
                  }
                })
              }
            }

            temp[att.att_id] = {
              // name: att.att_name,
              attr_type_id: att.attr_type,
              attr_value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue && dropDropwnValue.id : (att.attr_type_name === 'calendar') ? moment(value[key]).format('YYYY') : (att.attr_type_name === 'Date') ? moment(value[key]).format('DD/MM/YYYY') : att.attr_type_name === 'Radio-button' ? checkedValue.id : att.attr_type_name === 'textarea' ? value[key].toHTML() : value[key],
              parent_value_id: 0,
              parent_attribute_id: (att.attr_type_name === 'Drop-Down') ? att.att_id : 0,
              attr_type_name: att.attr_type_name
            };
            
            specification.push({
              key: att.att_name,
              slug:att.slug,
              value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue && dropDropwnValue.name : (att.attr_type_name === 'calendar') ? moment(value[key]).format('YYYY') : (att.attr_type_name === 'Date') ? moment(value[key]).format('DD/MM/YYYY') : att.attr_type_name === 'Radio-button' ? checkedValue.name : att.attr_type_name === 'textarea' ? value[key].toHTML() : value[key]
            })
            temp2.push({
              key: att.att_name,
              type: att.attr_type_name,
              value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue && dropDropwnValue.name : (att.attr_type_name === 'calendar') ? value[key] : (att.attr_type_name === 'Date') ? value[key] : att.attr_type_name === 'textarea' ? value[key].toHTML() : value[key]
            })
            // 
          }
        })
      }
    })
    
    let secondArray = [{ key: 'title', value: value.title, type: 'text' },
    { key: 'description', value: value.description, type: 'text' },
    { key: 'fileList', value: fileList && fileList.length ? fileList : [], type: 'image' },
    { key: 'questions', value: textInputs, type: 'questions' }, { key: 'inspection_time', value: value.inspection_time, type: 'inspection_time' }]
    const { adId } = this.props.match.params
    const reqData = {
      parent_categoryid: adPostDetail.parent_categoryid,
      category_id: adPostDetail.category_id,
      attributes: temp,
      id: adId,
      user_id: loggedInUser.id,
      // price: price ? price : '',
      price: value.price ? value.price : '',
      contact_email: adPostDetail.contact_email,
      contact_name: adPostDetail.contact_name ? adPostDetail.contact_name : value.fname + '' + value.lname,
      contact_mobile: adPostDetail.contact_mobile ? adPostDetail.contact_mobile : value.contact_mobile,
      hide_mob_number: hide_mob_number ? 1 : 0,
      // description: value.description,
      description: value.description.toHTML(),
      title: value.title,
      lng: data && data.lng ? data.lng : adPostDetail.lng ? adPostDetail.lng : 151.2092955,
      lat: data && data.lat ? data.lat : adPostDetail.lat ? adPostDetail.lat : -33.8688197,
      state_id: data && data.state_id ? data.state_id : adPostDetail.state_id ? adPostDetail.state_id : '',
      subregions_id: data && data.subregions_id ? data.subregions_id : adPostDetail.subregions_id ? adPostDetail.subregions_id : '',
      location: data && data.address ? data.address : adPostDetail.location ? adPostDetail.location : '',
      quantity: 1,
      fileList: fileList,
      inspection_times: tempArray ? tempArray : inspectiontime ? inspectiontime : [],
      inspection_type: value.inspection_type ? value.inspection_type : adPostDetail.inspection_type,
      attr_value_video: videoList,
      floor_plan: floorPlan ? floorPlan : [],
      company_logo: companyLogo && companyLogo.length ? companyLogo : [],
      is_ad_free: is_ad_free ? 1 : 0,
      // sale_via_exp: sale_via_exp ? 1 : 0
    };
    
    const formData = new FormData()
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == 'object' && key !== 'fileList' && key !== 'floor_plan' && key !== 'company_logo') {
        formData.append(key, JSON.stringify(reqData[key]))
      } else if (key === 'fileList') {
        let data = []
        reqData[key].length && reqData[key].map((e, i) => {
          formData.append(`image${i + 1}`, reqData[key][i].originFileObj);
        })
      }else if (key === 'attr_value_video') {
        reqData[key].length && reqData[key].map((e, i) => {
          formData.append(`attr_value_video[]`, reqData[key][i].originFileObj);
        })     
      }else if (key === 'floor_plan') {
        reqData[key].length ? reqData[key].map((e, i) => {
          formData.append(`floor_plan`, reqData[key][i].originFileObj);
        }) : formData.append(`floor_plan`,adPostDetail.floor_plan );    
      }else if (key === 'company_logo') {
        reqData[key].length ? reqData[key].map((e, i) => {
          formData.append(`company_logo`, reqData[key][i].originFileObj);
        }) : formData.append(`company_logo`,adPostDetail.company_logo );    
      } else {
        formData.append(key, reqData[key])
      }
    })
    this.setState({ specification: specification, inspectionPreview: value.inspection_time })
    let have_plan = adPostDetail.membership_plan_user_id !== null && adPostDetail.membership_plan_user_id !== '' && adPostDetail.membership_plan_user_id !== undefined
    //let have_plan = adPostDetail.package_user_id !== null && adPostDetail.package_user_id !== '' && adPostDetail.package_user_id !== undefined
    if (!have_plan) {
      this.setState({ paymentScreen: true, formData: reqData })
    } else {
      
      this.props.enableLoading()
      this.props.updatePostAdAPI(formData, res => {
        this.props.disableLoading()
        if (res.status === 200) {
          toastr.success('success', 'Your post has been updated successfully')
          // this.props.history.push('/my-ads')
          this.getPostAdDetails()
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
          if (job && have_plan) {
            this.setState({ jobModal: true })
          } else if (have_plan) {
            this.setState({ visible: true })
          }
        }
      })
    }
  }

  /** 
  * @method beforeUpload
  * @description handle image Loading 
  */
  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    }
    return isJpgOrPng && isLt2M;
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

  onFloorPlanChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      this.setState({ floorPlan: fileList });
    }
  }

  uploadCompanyLogo = ({ file, fileList }) => {
    console.log('file', file, fileList)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
      return false
    } else {
      this.setState({ companyLogo: fileList });
    }
  }

  onVideoUploadChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'video/mp4' || file.type === 'video/webm';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload mp4 ,webm file!');
      return false
    } else if (!isLt2M) {
      message.error('Video must smaller than 2MB!');
      return false
    } else {
      this.setState({ videoList: fileList });
    }

  }


  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  appendInput() {
    // var newInput = `input-${this.state.textInputs.length}`;
    let newInput = {
      question: ``,
      ans_type: QUESTION_TYPES.TEXT,
      options: []
    }
    this.setState(prevState => ({ textInputs: prevState.textInputs.concat([newInput]) }));
  }
  /**
   * @method ChangeOption
   * @description render component  
   */
  ChangeOption = (e, questionNo, optionNo) => {
    const { textInputs } = this.state
    let st1 = e.target.value
    textInputs[questionNo].options[optionNo] = st1
    // update state
    this.setState({
      textInputs
    });
  }

  /**
  * @method ChangIseOption
  * @description render component  
  */
  ChangeIsOption = (e, questionNo, optionNo) => {
    const { textInputs } = this.state
    // let st1 = e.target.checked
    if (e == true) {
      textInputs[questionNo].ansInputs.push(optionNo)
    } else {
      let i = textInputs[questionNo].ansInputs.findIndex((l) => l == optionNo)
      if (i > -1) {
        textInputs[questionNo].ansInputs.splice(i, 1);
      }
      // textInputs[questionNo].ans.push(optionNo)

    }

    // update state
    this.setState({
      textInputs
    });
  }

  /**
    * @method ChangesIseOptionRadio
    * @description ChangesIseOptionRadio  
    */
  ChangeIsOptionRadio = (e, questionNo, optionNo) => {
    const { textInputs } = this.state
    if (!textInputs[questionNo].ansInputs.includes(optionNo)) {
      // textInputs[questionNo].ansInputs.push(optionNo)
      textInputs[questionNo].ansInputs[0] = optionNo
    }
    // update state
    this.setState({
      textInputs
    });
  }

  /**
   * @method renderQuestionbar
   * @description render component  
   */
  renderQuestionBar = () => {
    const { textInputs } = this.state
    return (
      <div id='dynamicInput'>
        {textInputs.map((input, i) => <span>
          <Form.Item
            label='Ask a Question'
          >
            <Input size='large' value={input.question} placeholder='Enter your Question' onChange={(e) => {
              let q = e.target.value
              this.setState(prevState => ({
                textInputs: prevState.textInputs.map(
                  (obj, index) => {
                    if (index === i) {
                      
                      return Object.assign(obj, { question: q })
                    } else {
                      return obj
                    }
                  }
                )
              }));
            }} />
            <Row gutter={24} className="fm-radio-grp">
              <Col gutter={12} span={24} className="ant-form-item fm-main-radiobtn">
                <Radio.Group onChange={(e) => {
                  let q_type = e.target.value
                  this.setState(prevState => ({
                    textInputs: prevState.textInputs.map(
                      (obj, index) => {
                        if (index === i) {
                          
                          return Object.assign(obj, { ans_type: q_type, options: [], ansInputs: [] })
                        } else {
                          return obj
                        }
                      }
                    ),
                    Question_type: e.target.value
                  }));
                  // this.setState({ Question_type: e.target.value })
                }} value={textInputs[i].ans_type}
                >
                  <Radio value={QUESTION_TYPES.TEXT}>Text</Radio>
                  <Radio value={QUESTION_TYPES.RADIO}>Single Choice</Radio>
                  <Radio value={QUESTION_TYPES.CHECKBOX}>Multi Choce</Radio>
                </Radio.Group>
              </Col>
            </Row>
            {textInputs[i].ans_type == QUESTION_TYPES.CHECKBOX ?
              <Row gutter={24} className="fm-radio-grp">
                <Col gutter={12} span={24} className="ant-form-item">
                  <Row gutter={24} align="middle">
                    <Col md={19}><Input value={textInputs[i].options[0]} onChange={(e) => this.ChangeOption(e, i, 0)}
                      size='large' placeholder='Enter your first Option' /></Col>
                    <Col md={5}>
                      {/* defaultChecked={textInputs[i].options[0].ans_type ? defaultCheck2 : !defaultCheck1} */}
                      <Checkbox defaultChecked={textInputs[i].ansInputs.includes(0)} onChange={(e) => {
                        this.ChangeIsOption(e.target.checked, i, 0)
                      }} > Is Answer</Checkbox>
                    </Col>
                  </Row>
                  <Row gutter={24} align="middle" className="fm-radio-grp">
                    <Col md={19}>
                      <Input value={textInputs[i].options[1]} onChange={(e) => this.ChangeOption(e, i, 1)} size='large' placeholder='Enter your second Option' />
                    </Col>
                    <Col md={5}>
                      <Checkbox defaultChecked={textInputs[i].ansInputs.includes(1)} onChange={(e) => {
                        this.ChangeIsOption(e.target.checked, i, 1)
                      }} > Is Answer</Checkbox>
                    </Col>
                  </Row>
                  <Row gutter={24} align="middle" className="fm-radio-grp">
                    <Col md={19}>
                      <Input value={textInputs[i].options[2]} onChange={(e) => this.ChangeOption(e, i, 2)} size='large' placeholder='Enter your third Option' />
                    </Col>
                    <Col md={5}>
                      <Checkbox defaultChecked={textInputs[i].ansInputs.includes(2)} onChange={(e) => {
                        this.ChangeIsOption(e.target.checked, i, 2)
                      }} > Is Answer</Checkbox>
                    </Col>
                  </Row>
                  <Row gutter={24} align="middle" className="fm-radio-grp">
                    <Col md={19}>
                      <Input value={textInputs[i].options[3]} onChange={(e) => this.ChangeOption(e, i, 3)}
                        size='large' placeholder='Enter your fourth Option' />
                    </Col>
                    <Col md={5}>
                      <Checkbox defaultChecked={textInputs[i].ansInputs.includes(3)} onChange={(e) => {
                        this.ChangeIsOption(e.target.checked, i, 3)
                      }} > Is Answer</Checkbox>
                    </Col>
                  </Row>
                </Col></Row> : this.state.textInputs[i].ans_type == 'radio' ? <Row gutter={24} >
                  <Col gutter={12} span={24} className="ant-form-item">
                    <Radio.Group onChange={(e) => {
                      
                      this.ChangeIsOptionRadio(true, i, e.target.value)
                    }} value={textInputs[i].ansInputs[0]}
                      className="w-100"
                    >

                      {/* <Radio  onChange={(e) => {
                  this.ChangeIsOption(e.target.checked, i, 0)
                }} > Is Answer</Radio> */}
                      <Row gutter={24} align="middle" className="fm-radio-grp">
                        <Col md={19}>
                          <Input value={textInputs[i].options[0]} onChange={(e) => this.ChangeOption(e, i, 0)} size='large' placeholder='Enter your first Option' />
                        </Col>
                        <Col md={5}>
                          <Radio value={0}>Is Answer</Radio>
                        </Col>
                      </Row>
                      <Row gutter={24} align="middle" className="fm-radio-grp">
                        <Col md={19}>
                          <Input value={textInputs[i].options[1]} onChange={(e) => this.ChangeOption(e, i, 1)} size='large' placeholder='Enter your second Option' />
                        </Col>
                        <Col md={5}>
                          <Radio value={1}>Is Answer</Radio>
                        </Col>
                      </Row>
                      {/* <Radio  onChange={(e) => {
                  this.ChangeIsOption(e.target.checked, i, 1)
                }} > Is Answer</Radio> */}
                    </Radio.Group>
                  </Col></Row> : ''}
            {/* defaultChecked={textInputs[i].ansInputs.includes(0)}
              defaultChecked={textInputs[i].ansInputs.includes(1)} */}
          </Form.Item>
        </span>)
        }
        <button className="ant-btn ant-btn-primary" type='button' onClick={() => this.appendInput()}>
          Add a Question
               </button>
      </div >
    )
  }

  /**
  * @method duplicateEntry
  * @description duplicate entry
  */
  duplicateEntry = function (array, i) {
    
    let time = array.inspection_time
    if (time && time.length) {
      return time.map(function (value) {
        
        return moment(value.inspection_date).format('DD-MM-YYYY') + moment(value.inspection_start_time).format('hh:m a') + moment(value.inspection_end_time).format('hh:m a')
      }).some(function (value, index, time) {
        return time.indexOf(value) !== time.lastIndexOf(value);
      })
    }
  }

  /**
   * @method renderQuestionbar
   * @description render component  
   */
  renderInspectionTimeInput = () => {
    const { weekly, singleDate } = this.state
    function disabledDate(current) {
      var dateObj = new Date();  // subtract one day from current time  
      dateObj.setDate(dateObj.getDate() - 1);
      return current && current.valueOf() < dateObj
    }
    return (
      <Form.List name="inspection_time">
        {(fields, { add, remove }) => {
          let time = singleDate ? fields.slice(0, 1) : fields
          return (
            <div>
              {time.map((field, index) => (
                <Row key={field.key}>
                  <Row gutter={24} >
                    <Col gutter={12}>
                      <Form.Item
                        label={[field.label, "Date"]}
                        name={[field.name, "inspection_date"]}
                        fieldKey={[field.fieldKey, "inspection_date"]}
                        rules={[required('')]}
                      >
                        <DatePicker format='MMMM Do YYYY'
                          disabledDate={disabledDate}
                          onChange={(date, dateString) => {
                            let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                            
                            if (currentField) {
                              currentField.inspection_time[field.key].inspection_start_time = ''
                              currentField.inspection_time[field.key].inspection_end_time = ''
                              this.formRef.current && this.formRef.current.setFieldsValue({
                                ...currentField
                              })
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col gutter={12}>
                      <Row gutter={24}>
                        <Col span={24}>
                          <Form.Item
                            label={[field.label, "From"]}
                            name={[field.name, "inspection_start_time"]}
                            fieldKey={[field.fieldKey, "inspection_start_time"]}
                            rules={[required('')]}
                          >
                            <TimePicker
                              use12Hours format="h:mm a"
                              minuteStep={30}
                              defaultOpenValue={moment('24:00', 'h:mm a')}
                              onChange={(e) => {
                                let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                
                                let today = Date.now()
                                let currentDate = moment(today).format('DD/MM/YYYY')
                                let currentTime = moment(today).format('HH:mm')
                                let selectedDate = currentField.inspection_time[field.key].inspection_date
                                if (currentDate === moment(selectedDate).format('DD/MM/YYYY')) {
                                  let selectedTime = currentField.inspection_time[field.key].inspection_start_time
                                  
                                  if (moment(selectedTime).format('HH:mm') < currentTime) {
                                    currentField.inspection_time[field.key].inspection_start_time = ''
                                    toastr.warning('warning', "Time can not be past time")
                                  }
                                }
                                let duplicate = this.duplicateEntry(currentField, field.key)
                                if (duplicate) {
                                  toastr.warning('You have already use this time, please select other time')
                                  currentField.inspection_time[field.key].inspection_start_time = ''
                                }
                                if (currentField) {
                                  currentField.inspection_time[field.key].inspection_end_time = ''
                                  // this.formRef.current && this.formRef.current.setFieldsValue({ currentField })
                                }
                                this.formRef.current && this.formRef.current.setFieldsValue({
                                  ...currentField
                                })
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            label={[field.label, "To"]}
                            name={[field.name, "inspection_end_time"]}
                            fieldKey={[field.fieldKey, "inspection_end_time"]}
                            rules={[required('')]}
                          >
                            <TimePicker
                              use12Hours
                              format="h:mm a"
                              // defaultValue={moment('12:00', 'h:mm a')}
                              minuteStep={30}
                              defaultOpenValue={moment('12:00', 'h:mm a')}
                              onChange={(e) => {
                                
                                let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                
                                let today = Date.now()
                                let currentDate = moment(today).format('DD/MM/YYYY')
                                let currentTime = moment(today).format('HH:mm')
                                let selectedDate = currentField.inspection_time[field.key].inspection_date
                                let selectedTime = currentField.inspection_time[field.key].inspection_end_time
                                let start = currentField && currentField.inspection_time[field.key].inspection_start_time
                                let startTime = moment(start).format('HH:mm')
                                let endTime = moment(selectedTime).format('HH:mm')
                                if (currentDate === moment(selectedDate).format('DD/MM/YYYY')) {
                                  
                                  if (moment(selectedTime).format('HH:mm') < currentTime) {
                                    currentField.inspection_time[field.key].inspection_end_time = ''
                                    toastr.warning('warning', "Time can not be past time")
                                  } else if (start) {
                                    
                                    if (endTime < startTime) {
                                      currentField.inspection_time[field.key].inspection_end_time = ''
                                      toastr.warning('warning', "End time should be greater than start time")
                                    } else if (endTime === startTime) {
                                      currentField.inspection_time[field.key].inspection_end_time = ''
                                      toastr.warning('warning', "Start time and end time can not be same")
                                    }
                                  }
                                } else if (start) {
                                  
                                  if (endTime < startTime) {
                                    currentField.inspection_time[field.key].inspection_end_time = ''
                                    toastr.warning('warning', "End time should be greater than start time")
                                  } else if (endTime === startTime) {
                                    currentField.inspection_time[field.key].inspection_end_time = ''
                                    toastr.warning('warning', "Start time and end time can not be same")
                                  }
                                }
                                let duplicate = this.duplicateEntry(currentField, field.key)
                                
                                if (duplicate) {
                                  currentField.inspection_time[field.key].inspection_start_time = ''
                                  currentField.inspection_time[field.key].inspection_end_time = ''
                                  this.formRef.current && this.formRef.current.setFieldsValue({
                                    ...currentField
                                  })
                                  toastr.warning('You have already use this time slot, please select other time')

                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    {field.key !== 0 && <Col flex="none">
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        title={'Add More'}
                        onClick={() => {
                          let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                          if (currentField) {
                            let inspection_time = currentField.inspection_time
                            let id = inspection_time[field.key] ? inspection_time[field.key].id : ''
                            if (id) {
                              this.props.deleteInspectionAPI({ id: id }, res => {
                                
                                if (res.status === 200) {
                                  remove(field.name)
                                }
                              })
                            } else {
                              remove(field.name)
                            }
                          }
                        }}
                      />
                    </Col>}
                  </Row>
                </Row>
              ))}
              {weekly && <Form.Item >
                <div className='align-right add-card-link'>
                  <Icon icon='add-circle' size='30' className='mr-7' onClick={() => add()} />
                </div>
              </Form.Item>}
            </div>
          );
        }}
      </Form.List>
    )
  }

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
   * @method handleEditorChange
   * @description handle editor text value change
   */
  handleEditorChange = (editorState) => {
    this.setState({ editorState: editorState })
  };


  /**
   * @method render
   * @description render component
   */
  render() {
    const {sale_via_exp,isOpen,is_ad_free,negotiable_data,adPostDetail, companyLogo,floorPlan,videoList, formData, paymentScreen, jobModal, hide_mob_number, classifiedDetail, inspectionPreview, specification, visible, initial, inspectiontime, otherAttribute, fileList, textInputs, address, weekly, singleDate } = this.state
    const { step1, have_questions, loggedInUser } = this.props
    let realStateVendor = loggedInUser.user_type === langs.key.business && loggedInUser.role_slug === langs.key.real_estate
    const job = loggedInUser.user_type === langs.key.business && loggedInUser.role_slug === langs.key.job
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className='ant-upload-text'>Upload</div>
        <img src={require('../../../../../assets/images/icons/upload-small.svg')} alt='upload' />
      </div>
    );
    const uploadButton2 = (
      <Button danger>
        <label
          style={{ cursor: 'pointer' }}
        >
          Add Pictures
        </label>
      </Button>
    )
    const controls = ['bold', 'italic', 'underline', 'separator']
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
                      name: 'inspection_time',
                      inspection_time: initial ? inspectiontime : [{ id: '', inspection_date: '', inspection_start_time: '', inspection_end_time: '' }]
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
                                rules={[required('Category')]}
                              >
                                <Input size='large' placeholder='Category' disabled />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label={'Sub Category'}
                                name='category_id'
                                rules={[required('Subcategory')]}
                              >
                                <Input size='large' placeholder='Sub Category' disabled />
                              </Form.Item >
                            </Col>
                          </Row>
                          <div>
                            <Form.Item
                              label='Ad Title'
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
                              {/* <TextArea
                                className='ant-input-lg'
                                rows='5'
                                placeholder='Type here'
                              /> */}
                              <BraftEditor
                                controls={controls}
                                contentStyle={{ height: 150 }}
                                className={'input-editor'}
                              />
                            </Form.Item>
                          </div>
                          {isOpen && job && this.renderFormeeTemplate()}
                          {job && 
                          <div onClick={() => this.setState({isOpen: !isOpen})}>
                            {isOpen ? 'Write a customize descrition' :'Use Formee template to write description'}
                          </div>}
                          {adPostDetail.category_name !== 'Automotive' && !job && !realStateVendor &&<div>
                            <Text>Is this ad free ?  <Switch checked={is_ad_free} onChange={(checked) => this.setState({is_ad_free: checked ? true : false})}/></Text>
                          </div>}
                          <br/>
                          {!is_ad_free && !job && !sale_via_exp && <Row gutter={12}>
                            <Col xs={24} sm={24} md={24} lg={negotiable_data ? 16 : 24} xl={negotiable_data ? 16 : 24}>
                              <div>
                                <Form.Item
                                  label={'Price'}
                                  name={'price'}
                                  rules={[required('')]}
                                >
                                  <Input type={'number'}/>
                                </Form.Item>
                              </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                              {negotiable_data && renderField(negotiable_data, negotiable_data.attr_type_name, negotiable_data.value)}
                            </Col>
                          </Row>}
                          {realStateVendor && <Checkbox checked={sale_via_exp} onChange={(e) => this.setState({sale_via_exp: e.target.checked ? true : false})}>Sale via expression of interest</Checkbox>}
                          {this.renderItem()}
                          {realStateVendor && <div>
                            <Form.Item
                              label='Inspection Type'
                              name='inspection_type'
                              className='label-large'
                              rules={[required('')]}
                            >
                              <Select
                                placeholder='Select Subcategory'
                                onChange={(e) => {
                                  
                                  if (e == 'By Appointment') {
                                    this.setState({ byAppointment: true, weekly: false, singleDate: false })
                                  } else if (e === 'Weekly Time') {
                                    this.setState({ byAppointment: false, weekly: true, singleDate: false })
                                  } else if (e === 'Single Date') {
                                    this.setState({ byAppointment: false, weekly: false, singleDate: true })
                                  }
                                }}
                                allowClear
                                size={'large'}
                                className='w-100'
                              // disabled
                              >
                                <Option value={'By Appointment'}>{'By Appointment'}</Option>
                                <Option value={'Weekly Time'}>{'Set Weekly Time'}</Option>
                                <Option value={'Single Date'}>{'Single Date'}</Option>
                              </Select>
                            </Form.Item>
                          </div>}
                          {realStateVendor && (weekly || singleDate) && this.renderInspectionTimeInput()}
                          {!job && <Form.Item
                            label='Add Pictures'
                            name='image'
                            className='label-large'
                          // rules={[required('')]}
                          >
                            <ul className='pl-0'>
                              <li>Add upto 8 images or upgrade to include more</li>
                              <li >Maximum File size 4MB</li>
                            </ul>
                            <ImgCrop grid>
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
                          </Form.Item>}
                          {/* {realStateVendor &&  */}
                          <Form.Item
                            label='Add Floor Plan'
                            name='image'
                            className='label-large'
                          >
                            <ul className='pl-0'>
                              <li>Add upto 4 images or upgrade to include more</li>
                              <li >Maximum File size 4MB</li>
                            </ul>
                            <ImgCrop grid>
                            <Upload
                              name='avatar'
                              listType='picture-card'
                              className='avatar-uploader'
                              showUploadList={true}
                              fileList={floorPlan ? floorPlan : []}
                              customRequest={this.dummyRequest}
                              onChange={this.onFloorPlanChange}
                            >
                              {floorPlan && floorPlan.length >= 1 ? null : uploadButton2}
                            </Upload>
                            </ImgCrop>
                          </Form.Item>
                          {/* } */}

                          {job && <Form.Item
                            label={'Add Company Logo'}
                            name='image'
                            className='label-large'
                          >
                            <ImgCrop grid>
                            <Upload
                              name='avatar'
                              listType='picture-card'
                              className='avatar-uploader'
                              showUploadList={true}
                              fileList={companyLogo}
                              customRequest={this.dummyRequest}
                              onChange={this.uploadCompanyLogo}
                              id='fileButton'
                            >
                              {companyLogo.length >=1 ? null : uploadButton}
                            </Upload>
                            </ImgCrop>
                          </Form.Item>}
                          {job &&<ul className='pl-0'>
                              <li>Image size 500x500 pixles Maximum file size 4MB</li>
                            </ul>}
                          {job && <Button danger>
                            <label  for='fileButton'
                              style={{ cursor: 'pointer' }}
                            >
                              Upload File
                            </label>
                          </Button>}
                          {!job && <Form.Item
                            label='Add Videos'
                            name='video'
                            className='label-large'
                          >
                            <ul className='pl-0'>
                              <li>Add upto 8 videos or upgrade to include more</li>
                              <li >Maximum File size 4MB</li>
                            </ul>
                            <Upload
                              name='avatar'
                              listType='picture-card'
                              className='avatar-uploader'
                              showUploadList={true}
                              fileList={videoList}
                              customRequest={this.dummyRequest}
                              onChange={this.onVideoUploadChange}
                            >
                              {videoList.length >= 8 ? null : uploadButton}

                            </Upload>
                          </Form.Item>}
                          {have_questions === 1 ?
                            this.renderQuestionBar() : ''}
                          {/* {realStateVendor && this.renderInspectionTimeInput()} */}
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
                        UPDATE
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
  { deleteInspectionAPI, getClassfiedCategoryDetail, updatePostAdAPI, getPostAdDetail, getChildInput, getClassifiedDynamicInput, setAdPostData, enableLoading, disableLoading }
)(Step3);

