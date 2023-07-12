import React from 'react';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../config/localization'
import { connect } from 'react-redux';
import { Steps, Upload, Collapse, message, Select, Button, DatePicker, Input, Form, Row, Col, Layout, Typography, Tabs, Card, Space, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { disableLoading, enableLoading, getRestaurantDetail, getSpaServices, getBeautyServices, getPackagesFromAdmin, getFitnessClassListing, createBestPackage, getTraderProfile } from '../../../../actions';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from '../../../../config/Config';
import history from '../../../../common/History';
import { required } from '../../../../config/FormValidation'
import { MESSAGES } from '../../../../config/Message';
import { dateFormate1 } from '../../../common';
import moment from 'moment';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

class CreateBestPackage extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      services: [],
      defaultActiveTab: '1',
      activePannel: 1,
      selectedPackage: '',
      currentField2: '',
      selectedService: []
    };
  }

  componentDidMount() {
    const { loggedInUser } = this.props;
    let userType = loggedInUser.user_type
    this.getEligiblePackages()
    if (userType === langs.key.restaurant) {
      this.getRestaurantServiceDetail()
    } else
      if (userType === langs.userType.beauty) {
        this.getBeautyServiceDetail()
      } else if (userType === langs.userType.wellbeing) {
        this.getSpaServiceDetail()
      }
  }

  /**
   * @method getEligiblePackages
   * @description get Eligible packages details
   */
  getEligiblePackages = () => {
    const { loggedInUser } = this.props;
    let userType = loggedInUser.user_type;
    let reqData = {}
    if (userType !== langs.key.restaurant) {
      const { booking_cat_id, booking_sub_cat_id } = this.props.userDetails.user.trader_profile
      reqData.category_id = booking_cat_id
      reqData.sub_category_id = booking_sub_cat_id
    } else {
      const { booking_category_id } = this.props.userDetails.user.business_profile
      reqData.category_id = booking_category_id
    }
    this.props.getPackagesFromAdmin(reqData)
  }


  /**
  * @method getRestaurantServiceDetail
  * @description get all restaurant services details
  */
  getRestaurantServiceDetail = () => {
    const { id } = this.props.loggedInUser
    this.props.getRestaurantDetail(id,'', res => {
      this.props.disableLoading()
      if (res.status === 200) {
        let data = res.data && res.data.data
        let serv = []
        data.menu.menu_categories.map((el) => {
          serv = [...serv, ...el.menu_items]
        })
        this.setState({ services: serv, service_type: langs.key.restaurant })
        
      }
    })
  }

  /**
  * @method getBeautyServiceDetail
  * @description get beauty service details
  */
  getBeautyServiceDetail = () => {
    const { loggedInUser } = this.props
    this.props.getBeautyServices(loggedInUser.trader_profile_id, res => {
      if (res.status === 200) {
        let data = res.data && res.data.data
        let services = data.services && Array.isArray(data.services) && data.services.length ? data.services : []
        
        let serv = []
        data.services.map((el) => {
          serv = [...serv, ...el.trader_user_profile_services]
        })
        this.setState({ services: serv, service_type: langs.userType.beauty })
      }
    })
  }

  /**
   * @method getFitnessServiceDetail
   * @description get service details
   */
  getFitnessServiceDetail = () => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id
    this.props.getFitnessClassListing({ id: trader_user_profile_id }, (res) => {
      
      if (res.data && res.data.status === 200) {
        let data = res.data && res.data.data
        let traderdeals = data.trader_deals && Array.isArray(data.trader_deals) && data.trader_deals.length ? data.trader_deals : []
        this.setState({ services: traderdeals, service_type: langs.userType.wellbeing })
      }
    })
  }

  /**
   * @method getSpaServiceDetail
   * @description get spa service details
   */
  getSpaServiceDetail = () => {
    const { loggedInUser } = this.props
    this.props.getSpaServices(loggedInUser.trader_profile_id, res => {
      if (res.status === 200) {
        let data = res.data && res.data.data
        let services = data && Array.isArray(data.wellbeing_trader_service) && data.wellbeing_trader_service.length ? data.wellbeing_trader_service : []
        this.setState({ services: services, service_type: langs.userType.spa })
      }
    })
  }


  /**
  * @method dummyRequest
  * @description dummy image upload request
  */
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  /**
  * @method getBeautyServiceDetail
  * @description get beauty service details
  */
  getBeautyServiceDetail = () => {
    const { loggedInUser } = this.props
    this.props.getBeautyServices(loggedInUser.trader_profile_id, res => {
      if (res.status === 200) {
        let data = res.data && res.data.data
        let services = data.services && Array.isArray(data.services) && data.services.length ? data.services : []
        
        this.setState({ services: data.services[0].trader_user_profile_services, service_type: langs.userType.beauty })
      }
    })
  }


  onFinish = values => {
    
    const { loggedInUser, userDetails } = this.props;
    const { selectedPackage } = this.state;
    // const { booking_cat_id, booking_sub_cat_id, id } = this.props.userDetails.user.trader_profile
    let userType = loggedInUser.user_type
    let reqData = {};
    let rangeLimitEnd = selectedPackage.discount_end_range
    let rangeLimitStart = selectedPackage.discount_start_range
    let disscount = Number(values.discount_percent)

    let errCase = false
    if (values.deals.length > 4) {
      
      toastr.warning(langs.warning, MESSAGES.SERVICE_LENGTH_VALIDATION)
      return true
    } else if (selectedPackage.discount_type === "range" && (rangeLimitStart > disscount || rangeLimitEnd < disscount)) {
      
      toastr.error(langs.error, MESSAGES.DISSCOUNT_VALIDATION)
      errCase = true
      return true
    } else {

      reqData.vendor_id = userType === langs.key.restaurant ? userDetails.user.business_profile.id : userDetails.user.trader_profile.id
      reqData.services = values.deals
      reqData.booking_category_id = userType === langs.key.restaurant ? userDetails.user.business_profile.booking_category_id : userDetails.user.trader_profile.booking_cat_id;
      reqData.booking_sub_category_id = userType === langs.key.restaurant ? userDetails.user.business_profile.booking_sub_cat_id : userDetails.user.trader_profile.booking_sub_cat_id;
      reqData.best_beauty_package_id = selectedPackage.id
      reqData.actual_price = values.actual_price
      reqData.discount_percent = values.discount_percent
      reqData.discounted_price = values.discounted_price
      reqData.start_date = moment(values.start_date).format('DD-MM-YYYY');
      reqData.end_date = moment(values.end_date).format('DD-MM-YYYY');
      

      if (!errCase) {
        const formData = new FormData()
        if (values.deals[0].image && values.deals[0].image.file) {
          formData.append('banner_images', values.deals[0].image.file.originFileObj);
        }
        Object.keys(reqData).forEach((key) => {
          if (key === 'services') {
            formData.append(key, JSON.stringify(reqData[key]))

          } else {
            formData.append(key, reqData[key])
          }
        })
        this.props.createBestPackage(formData, (res) => {
          if (res.data && res.data.status === 1) {
            
            this.props.history.push('/my-packages')
            toastr.success(langs.success, MESSAGES.PACKAGE_CREATE_SUCCESS)
          }else {
            toastr.error(langs.success, res.data.msg)
          }
        })
      }
    }
  }

  rangeBetween = (start, end) => {
    // 
    if (start && end) {
      var arro = new Array(end - start + 1);
      for (var j = 0; j < arro.length; j++, start++) {
        arro[j] = String(start);
      }
      // 
      return arro;
    }
  }

  calculateDisscount = (value) => {
    const { selectedPackage } = this.state;
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    
    let rangeLimitEnd = selectedPackage.discount_end_range
    let rangeLimitStart = selectedPackage.discount_start_range
    let disscount = Number(value)
    if (selectedPackage.discount_type === "range" && (rangeLimitStart > disscount || rangeLimitEnd < disscount)) {
      toastr.warning(langs.warning, MESSAGES.DISSCOUNT_VALIDATION)
      currentField.discount_percent = 0;
      this.formRef.current.setFieldsValue({ ...currentField })
      return
    }
    let actulaPrize = currentField.actual_price
    
    // currentField.deals.map((el) => {
    //   actulaPrize = el.actual_price
    // })

    var percentAsDecimal = (disscount / 100);
    
    var percent = percentAsDecimal * actulaPrize;
    
    var dis = actulaPrize - percent
    dis = dis.toFixed(2)
    
    currentField.discounted_price = isNaN(dis) ? 0 : dis
    
    this.formRef.current.setFieldsValue({ ...currentField })
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { service_type, selectedService, selectedPackage, currentField2, activePannel, step1Data, selectedMembershipId, packageList, services, selectedClassId, defaultActiveTab } = this.state;
    const { userDetails, loggedInUser, packagesFromAdmin } = this.props;
    let deal = selectedPackage
    // Array.isArray(packagesFromAdmin) && packagesFromAdmin.length ? packagesFromAdmin[0] : ''
    let userType = loggedInUser.user_type
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className='ant-upload-text'>Upload</div>
        <img src={require('../../../../assets/images/icons/upload-small.svg')} alt='upload' />
      </div>
    );
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout style={{ overflowX: 'visible' }}>
            <div className='my-profile-box my-profile-setup manage-edit-memebership'>
              <div className='card-container signup-tab'>
                <div className='steps-content align-left mt-0'>
                  <div className='top-head-section'>
                    <div className='left'>
                      <Title level={2}>Package</Title>
                    </div>
                    <div className='right'></div>
                  </div>
                  <div className='sub-head-section'>
                    <Text>All Fields Required</Text>
                  </div>
                  <Card
                    className='profile-content-box daily-deals-form-detail'
                    bordered={false}
                    title=''
                  >
                    <Layout className='create-membership-block'>
                      <Layout className='createmembership'>
                        <Tabs className='tabs-listing'
                          onTabClick={(e) => this.setState({ defaultActiveTab: e })}
                          activeKey={defaultActiveTab}
                        //  defaultActiveKey={defaultActiveTab}
                        >
                          <TabPane tab='Create Packages' key='1'>
                            <h4 className="mb-20">
                              <b>Select Service</b>
                            </h4>
                            <div className='my-profile-box createmembership' >
                              <div className='ml-3 daily-deals-detail'>
                                <Row>
                                  <Col span={10}>
                                    <Select
                                      placeholder='Select'
                                      size='large'
                                      className="w-100"
                                      onChange={(e) => {
                                        let i = packagesFromAdmin.findIndex((p) => p.id === e)
                                        if (i >= 0) {
                                          this.setState({ selectedPackage: packagesFromAdmin[i] })
                                        }
                                      }}
                                      allowClear
                                    >
                                      {packagesFromAdmin &&
                                        packagesFromAdmin.map((keyName, i) => {
                                          return (
                                            <Option key={keyName.id} value={keyName.id}>{keyName.title}</Option>
                                          )
                                        })}
                                    </Select>
                                  </Col>
                                </Row>

                                {selectedPackage && <div className="pt-30">
                                  <Row>
                                    <Col span={6}>
                                      <h5>
                                        <b>Pacakge Name</b>
                                      </h5>
                                    </Col>
                                    <Col span={4}>
                                      <Text>{selectedPackage.title}</Text>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col span={6}>
                                      <h5>
                                        <b>Discount Percent Limit</b>
                                      </h5>
                                    </Col>
                                    <Col span={4}>
                                      <Text>{selectedPackage.discount_type === 'range' ? `${selectedPackage.discount_start_range} % - ${selectedPackage.discount_end_range} %` : `${selectedPackage.discount} %`} </Text>
                                    </Col>
                                  </Row>
                                </div>}
                              </div>
                              {selectedPackage && <div>
                                <Card
                                  className='profile-content-box'
                                  title=''
                                >
                                  <Form
                                    layout='vertical'
                                    name='members'
                                    onFinish={this.onFinish}
                                    ref={this.formRef}
                                    autoComplete='off'
                                    initialValues={{
                                      name: 'user 1',
                                      actual_price: 0,
                                      deals: [{ service_type: service_type }],
                                    }}
                                  >

                                    <Form.List name='deals'>
                                      {(fields, { add, remove }) => {
                                        return (
                                          <div>
                                            {/* <Card
                                            className='profile-content-box'
                                            title=''
                                          > */}
                                            <Collapse activeKey={activePannel}
                                              onChange={(e) => {
                                                
                                                if (e[e.length - 1] == undefined) {
                                                  this.setState({ activePannel: 1 })
                                                } else {
                                                  this.setState({ activePannel: e[e.length - 1] })
                                                }
                                              }}>
                                              <Panel key={1} header="Packages">
                                                <Row gutter={24}>
                                                  <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                                                    <Form.Item
                                                    // name={"image"}
                                                    // fieldKey={[field.fieldKey, "image"]}
                                                    >
                                                      <Upload
                                                        name='avatar'
                                                        listType='picture-card'
                                                        className='avatar-uploader'
                                                        showUploadList={true}
                                                        // fileList={currentField2 && currentField2.deals[field.key] && currentField2.deals[field.key].image ? currentField2.deals[field.key].image.fileList : []}
                                                        customRequest={this.dummyRequest}
                                                      // onChange={({ file, fileList }) => {
                                                      //   let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                      //   let image = currentField && currentField.deals[field.key].image.file
                                                      //   
                                                      //   const isJpgOrPng = image && image.type === 'image/jpeg' || image && image.type === 'image/png';
                                                      //   const isLt2M = image && image.size / 1024 / 1024 < 2;
                                                      //   if (!isJpgOrPng) {
                                                      //     message.error('You can only upload JPG , JPEG  & PNG file!');
                                                      //     return false
                                                      //   } else if (!isLt2M) {
                                                      //     message.error('Image must smaller than 2MB!');
                                                      //     return false
                                                      //   } else {
                                                      //     this.setState({ currentField2: currentField })
                                                      //   }
                                                      // }}                       
                                                      >
                                                        {/* {currentField2 && currentField2.deals[field.key] && currentField2.deals[field.key].image && currentField2.deals[field.key].image.fileList.length >= 1 ? null : uploadButton} */}
                                                        {/* {} */}
                                                        {/* <img src={require('../../../../assets/images/icons/upload.svg')} alt='upload' /> */}
                                                      </Upload>
                                                    </Form.Item>
                                                  </Col>

                                                  <Col xs={24} sm={24} md={24} lg={19} xl={19}>

                                                    {fields.map(field => (
                                                      <Row gutter={24}>
                                                        <Col span={24}>
                                                          <Form.Item
                                                            label='Select Services'
                                                            // name='class_name1'
                                                            {...field}
                                                            rules={[required('Services')]}
                                                            name={[field.name, 'service_id']}
                                                            fieldKey={[field.fieldKey, 'service_id']}
                                                          >
                                                            <Select
                                                              placeholder='Select'
                                                              size='large'
                                                              onChange={(e) => {
                                                                let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                                
                                                                

                                                                let check = selectedService.includes(e)
                                                                // 
                                                                if (check) {
                                                                  toastr.warning(langs.warning, 'You can not select Same Service again.')
                                                                  if (currentField.deals[field.name]) {
                                                                    currentField.deals[field.name].service_id = null;
                                                                    currentField.deals[field.name].actual_price = null;

                                                                    this.formRef.current.setFieldsValue({ ...currentField })
                                                                  }
                                                                  return
                                                                } else {
                                                                  let items = services.filter((c) => c.id === e)
                                                                  let totalPrize = 0
                                                                  items.filter((i) => totalPrize = totalPrize + Number(i.price))
                                                                  if (currentField.deals[field.name]) {
                                                                    currentField.deals[field.name].actual_price = totalPrize
                                                                  }
                                                                  let packagePrice = currentField.actual_price
                                                                  let temp = 0
                                                                  currentField.deals.map((i) => temp = temp + i.actual_price)
                                                                  currentField.actual_price = temp
                                                                  
                                                                  let serv = this.state.selectedService
                                                                  
                                                                  serv[field.name] = e

                                                                  
                                                                  
                                                                  this.setState({ selectedService: [...serv] })

                                                                  if (selectedPackage.discount_type === "normal") {
                                                                    currentField.discount_percent = selectedPackage.discount

                                                                    //--------Calculate discount per cent -----
                                                                    var percentAsDecimal = (currentField.discount_percent / 100);
                                                                    var percent = percentAsDecimal * temp;
                                                                    
                                                                    var dis = temp - percent
                                                                    dis = dis.toFixed(2)
                                                                    
                                                                    currentField.discounted_price = isNaN(dis) ? 0 : dis
                                                                    //---------------


                                                                    this.formRef.current.setFieldsValue({ ...currentField })
                                                                  } else {
                                                                    

                                                                    //---make Increase disscounted price
                                                                    if (currentField.discounted_price) {
                                                                      // currentField.discount_percent = selectedPackage.discount

                                                                      //--------Calculate discount per cent -----
                                                                      var percentAsDecimal = (Number(currentField.discount_percent) / 100);
                                                                      
                                                                      
                                                                      var percent = percentAsDecimal * temp;
                                                                      
                                                                      var dis = temp - percent
                                                                      dis = dis.toFixed(2)
                                                                      
                                                                      currentField.discounted_price = isNaN(dis) ? 0 : dis

                                                                    }

                                                                    this.formRef.current.setFieldsValue({ ...currentField })
                                                                  }
                                                                }
                                                              }}
                                                              allowClear
                                                            >
                                                              {services &&
                                                                services.map((keyName, i) => {
                                                                  return (
                                                                    <Option key={keyName.id} value={keyName.id}>{userType === langs.key.restaurant ? keyName.name : (userType === langs.userType.wellbeing || userType === langs.userType.beauty) ? keyName.name : keyName.class_name}</Option>
                                                                  )
                                                                })}

                                                            </Select>
                                                          </Form.Item>
                                                        </Col>

                                                        <Col span={24}>
                                                          <Form.Item
                                                            label='Actual price'
                                                            {...field}
                                                            name={[field.name, 'actual_price']}
                                                            fieldKey={[field.fieldKey, 'actual_price']}
                                                          // rules={[required('Actual Prize')]}
                                                          >
                                                            <Input disabled />
                                                          </Form.Item>
                                                        </Col>
                                                        <Col span={24}>
                                                          {field.name !== 0 && <MinusCircleOutlined
                                                            onClick={() => {
                                                              let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                              let serviceId = currentField.deals[field.name] && currentField.deals[field.name].service_id
                                                              
                                                              if (serviceId !== undefined) {
                                                                
                                                                let index = currentField.deals.findIndex((el) => el.service_id === serviceId)
                                                                
                                                                if (index >= 0) {
                                                                  let price = currentField.deals[index].actual_price;
                                                                  currentField.actual_price = currentField.actual_price - price
                                                                  //------Calculate dicount percent-------
                                                                  var percentAsDecimal = (currentField.discount_percent / 100);
                                                                  var percent = percentAsDecimal * currentField.actual_price;
                                                                  var dis = currentField.actual_price - percent
                                                                  dis = dis.toFixed(2)
                                                                  
                                                                  currentField.discounted_price = isNaN(dis) ? 0 : dis
                                                                  var sIndex = selectedService.indexOf(serviceId);
                                                                  
                                                                  if (sIndex !== -1) {
                                                                    selectedService.splice(sIndex, 1);
                                                                    
                                                                    this.setState({ ...selectedService })
                                                                  }

                                                                  //---------------
                                                                  this.formRef.current.setFieldsValue({ ...currentField })
                                                                  this.calculateDisscount(currentField.discount_percent)

                                                                  
                                                                }
                                                              }
                                                              

                                                              remove(field.name);
                                                              // this.calculateDisscount(e.target.value)

                                                              // let items = services.filter((c) => c.id === e)

                                                            }}
                                                            className="red-minuicons"
                                                            style={{ float: "right", fontSize: "17px" }}
                                                          />}
                                                        </Col>

                                                      </Row>
                                                    ))
                                                    }

                                                    <Button
                                                      className='add-btn add-btn-trans mt-10 mb-20'
                                                      onClick={() => {
                                                        // let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                        // 
                                                        // this.setState({ activePannel: this.state.activePannel + 1 })
                                                        // if (Array.isArray(currentField.deals) && currentField.deals.length === 5) {
                                                        //   toastr.warning(langs.warning, 'You can not create more than 5 deals at a time')
                                                        // } else {
                                                        add();
                                                        // }
                                                      }}
                                                      block
                                                    >Add
                                                      </Button>
                                                    <Divider />
                                                  </Col>

                                                </Row>
                                              </Panel>
                                            </Collapse>                                                                                                        <div className="btn-block">
                                            </div>
                                            {/* </Card> */}
                                          </div>
                                        )
                                      }
                                      }
                                    </Form.List>
                                    <Col xs={24} sm={24} md={24} lg={19} xl={19} offset={5}>

                                      <div
                                        className='bestpack-profile-content-box'
                                        title=''
                                      >

                                        <Row>
                                          <Col span={24}>
                                            <Form.Item
                                              label='Total Package Price'
                                              rules={[required('Total Package Price')]}
                                              name='actual_price'
                                              onBlur={(e) => {
                                                this.calculateDisscount(e.target.value)
                                              }}
                                            >
                                              <Input type='number' />
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                        <Row >
                                          <Col span={24}>
                                            <Form.Item
                                              label='Discount Percentage'
                                              // {...field}
                                              rules={[required('Discount Percentage')]}
                                              name='discount_percent'
                                              // fieldKey={[field.fieldKey, 'discount_percent']}
                                              onBlur={(e) => {
                                                // let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                this.calculateDisscount(e.target.value)
                                              }}
                                            >
                                              <Input type='number' disabled={selectedPackage.discount_type === "normal"} />
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                        <Row >
                                          <Col span={24}>
                                            <Form.Item
                                              label='Discounted Price'
                                              name='discounted_price'
                                            >
                                              <Input disabled />
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                        <Divider />
                                        <Row gutter={0} className="date-picker">
                                          <Col xs={24} sm={24} md={24} lg={12} xl={12} className="start-date">
                                            <Form.Item
                                              label='Duration'
                                              name='start_date'
                                            // name={[field.name, 'start_date']}
                                            // fieldKey={[field.fieldKey, 'start_date']}
                                            // rules={[required('Start Date')]}
                                            >
                                              <DatePicker
                                                onChange={(e) => {
                                                  let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                  currentField.end_date = '';
                                                  this.formRef.current.setFieldsValue({ ...currentField })
                                                }}
                                                disabledDate={(current) => {
                                                  // create a date object using Date constructor 
                                                  var dateObj = new Date();
                                                  // subtract one day from current time                           
                                                  dateObj.setDate(dateObj.getDate() - 1);

                                                  return current && current.valueOf() < dateObj
                                                }}

                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col xs={24} sm={24} md={24} lg={12} xl={12} className="end-date">
                                            <Form.Item
                                              label=''
                                              name={'end_date'}
                                            // {...field}
                                            // name={[field.name, 'end_date']}
                                            // fieldKey={[field.fieldKey, 'end_date']}
                                            // rules={[required('End date')]}
                                            >
                                              <DatePicker
                                                disabledDate={(current) => {
                                                  let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                  let selectedStartDate = currentField.start_date
                                                  let startDate = selectedStartDate
                                                  // //  ? selectedStartDate : moment(deal.start_date)
                                                  // // let endDate = moment(deal.end_date)
                                                  return current && (current.valueOf() < startDate);
                                                }} />
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                        <Form.Item>
                                          <Button
                                            className='add-btn mt-10'
                                            htmlType='submit'
                                            block
                                          >Submit
      </Button>
                                        </Form.Item>
                                      </div>
                                    </Col>

                                  </Form>
                                </Card>
                              </div>
                              }
                            </div>
                          </TabPane>
                        </Tabs >
                      </Layout >
                    </Layout >
                  </Card >
                </div >
                <div className='steps-action align-center mb-32'>
                </div>

              </div >
            </div >
          </Layout >
        </Layout >
      </Layout >
    )
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, venderDetails } = store;
  
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    packagesFromAdmin: Array.isArray(venderDetails.packagesFromAdmin) ? venderDetails.packagesFromAdmin : [],
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
  };
};
export default connect(
  mapStateToProps,
  {
    disableLoading, enableLoading, getRestaurantDetail, getSpaServices, getBeautyServices, createBestPackage, getFitnessClassListing, getPackagesFromAdmin, getTraderProfile
  }
)(CreateBestPackage);