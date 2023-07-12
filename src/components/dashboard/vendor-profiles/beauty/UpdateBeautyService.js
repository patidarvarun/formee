import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { InputNumber, Collapse, message, Upload, Select, Input, Space, Form, Switch, Divider, Layout, Card, Typography, Button, Tabs, Row, Col } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import NoContentFound from '../../../common/NoContentFound'
import { STATUS_CODES } from '../../../../config/StatusCode'
import { MESSAGES } from '../../../../config/Message'
import { enableLoading, disableLoading, getTraderProfile, getBookingSubcategory, activateAndDeactivateService, editServices, getBeautyServices, deleteServices } from '../../../../actions'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../../config/Config';
import Icon from '../../../customIcons/customIcons';
import { convertHTMLToText } from '../../../common';
import { required, validNumber } from '../../../../config/FormValidation'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import '../../vendor-profiles/myprofilerestaurant.less'
import { BASE_URL } from '../../../../config/Config'
import BeautyServicesForm from './UpdateServiceForm'
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select
const rules = [required('')];
const { Panel } = Collapse;

class BeautyServices extends React.Component {
  formRef = React.createRef();
  editRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      subCategory: [],
      currentList: [],
      size: 'large',
      showSettings: [],
      activeFlag: langs.key.all,
      ads_view_count: '',
      total_ads: '',
      services: [],
      beautyService: '',
      isEditFlag: false,
      durationOption: [],
      item: '',
      itemInfo: '', serviceInfo: '',
      Id: '', subCategory: [], activePanel: 1, activePanel2: 1, activeKey: ''
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { userDetails } = this.props
    const { id, user_type } = this.props.loggedInUser;
    this.getServiceDetail()
    let temp = []
    for (let i = 30; i <= 240; i = i + 30) {
      temp.push(i)
    }
    this.setState({ durationOption: temp })
    const { booking_cat_id } = userDetails.user.trader_profile
    this.props.getTraderProfile({ user_id: id }, (res) => {
      this.props.getBookingSubcategory(booking_cat_id, res => {
        if (res.status === 200) {
          const data = Array.isArray(res.data.data) && res.data.data;
          
          this.setState({ subCategory: data })
        }
      })
    })
  }

  // /**
  // * @method componentDidUpdate
  // * @description called to submit form 
  // */
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.submitFromOutside !== this.props.submitFromOutside) {
  //     this.resetField()
  //   }
  // }

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props
    let activeTab = this.props.match.params.activeTab
    
    let id = this.props.match.params.id
    this.setState({ activeKey: activeTab })
    this.props.getBeautyServices(loggedInUser.trader_profile_id, res => {
      if (res.status === 200) {
        let data = res.data && res.data.data
        let services = data.services && Array.isArray(data.services) && data.services.length ? data.services : []
        
        this.setState({ beautyService: data, services: services })
      }
    })
  }

  resetField = () => {
    this.formRef.current && this.formRef.current.resetFields()
    this.setState({ fileList: [], serviceInfo: '', activePanel: 1 })
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (value) => {
    
    const { itemInfo, serviceInfo, isEditFlag } = this.state
    const { isCreateService } = this.props
    let requestData = [], cat_id = '', temp = [], imageList = []
    if (value.beauty_services !== undefined && Array.isArray(value.beauty_services) && value.beauty_services.length) {
      value.beauty_services.map((el, index) => {
        cat_id = el.booking_category_id ? el.booking_category_id : ''
        let services = [], images = []
        if (el.services !== '') {
          el.services && Array.isArray(el.services) && el.services.length && el.services.map((el2, index) => {
            services.push({
              name: el2.name,
              duration: el2.duration,
              price: el2.price,
              more_info: el2.description,
              service_image: "",
              service_image_thumb: "",
              is_image: el2.image !== undefined ? 1 : 0,
              service_status: 1
            })
            let obj = el2.image && el2.image.fileList ? el2.image.fileList[0] : {}
            images.push({ obj })
          })
        }
        let editable_data = {}, image = {}
        if (isEditFlag && index === 0) {
          editable_data = { id: serviceInfo.id, name: el['name'], duration: el['duration'], price: el['price'], more_info: el['description'], service_image: '', service_image_thumb: '', is_image: el.image !== '' ? 1 : 0, service_status: 1 }
          image = el.image && el.image.fileList && el.image.fileList[0] ? { obj: el.image.fileList[0] } : { obj: {} }
        } else {
          editable_data = { name: el['name'], duration: el['duration'], price: el['price'], more_info: el['description'], service_image: '', service_image_thumb: '', is_image: el.image !== '' ? 1 : 0, service_status: 1 }
          image = el.image && el.image.fileList && el.image.fileList[0] ? { obj: el.image.fileList[0] } : { obj: {} }
        }
        let service = services.length ?
          [editable_data, ...services,] :
          [editable_data]

        requestData.push({
          booking_category_id: cat_id,
          services: service
        })

        temp = images.length ? [image, ...images] : [image]
        
        imageList.push(temp)
      })

    }

    
    

    const formData = new FormData()
    let temp1 = []
    imageList && imageList.length && imageList.map(el => {
      let temp2 = []
      
      el && el.length && el.map((item, i) => {
        if (el[i].obj !== undefined) {
          formData.append('service_images[]', el[i].obj.originFileObj ? el[i].obj.originFileObj : el[i].obj ? el[i].obj : '[]');
          temp2.push(el[i].obj.originFileObj ? el[i].obj.originFileObj : el[i].obj ? el[i].obj : '[]')
        }
      })
      temp1.push(temp2)

    })
    
    if (typeof requestData == 'object') {
      formData.append('services', `${JSON.stringify(requestData)}`)
    }

    
    this.props.enableLoading()
    this.props.editServices(formData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.BEAUTY_SERVICE_CREATE)
        this.getServiceDetail()
        // isCreateService === undefined && this.resetField()
        this.setState({ activePanel: 1, currentField: '' })
        if (isCreateService) {
          this.props.nextStep()
        }
      }
    })
  }

  /**
  * @method renderOptions
  * @description render duration options
  */
  renderOptions = () => {
    const { durationOption } = this.state;
    return durationOption && durationOption.length && durationOption.map((el, i) => {
      return (
        <Option key={i} value={el}>{el}</Option>
      )
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
  * @method createDynamicInput
  * @description create services
  */
  createDynamicInput = () => {
    const { currentField, subCategory, currentField2, fileList, isEditFlag, activePanel, activePanel2 } = this.state
    const { isCreateService } = this.props
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className='ant-upload-text'>Upload</div>
        <img src={require('../../../../assets/images/icons/upload-small.svg')} alt='upload' />
      </div>
    );
    return (
      <Form
        onFinish={this.onFinish}
        className="my-form"
        layout='vertical'
        id='create-service'
        ref={this.formRef}
        initialValues={{
          name: 'beauty_services',
          beauty_services: [{ image: '', description: "", service: "", price: '' }]
        }}
      //booking_category_id: '', duration: '',
      >
        <Form.List name="beauty_services">
          {(fields, { add, remove }) => {
            let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
            return (
              <Collapse
                // accordion 
                activeKey={activePanel}
                onChange={(e) => {
                  if (e[e.length - 1] == undefined) {
                    this.setState({ activePanel: 1 })
                  } else {
                    this.setState({ activePanel: (e[e.length - 1]) })
                  }
                }}
              >
                {fields.map((field, index) => (
                  <Panel
                    header={currentField && currentField.beauty_services && currentField.beauty_services[field.key] && currentField.beauty_services[field.key].name ? currentField.beauty_services[field.key].name : 'Your Service'}
                    key={field.fieldKey + 1}
                  >
                    <div key={field.key}>

                      <Row gutter={0}>

                        <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                          <Form.Item
                            name={[field.name, "image"]}
                            fieldKey={[field.fieldKey, "image"]}
                          >
                            <Upload
                              name='avatar'
                              listType='picture-card'
                              className='avatar-uploader'
                              showUploadList={true}
                              fileList={currentField && currentField.beauty_services[field.key] && currentField.beauty_services[field.key].image ? currentField.beauty_services[field.key].image.fileList : []}
                              customRequest={this.dummyRequest}
                              // onChange={this.handleImageChange}
                              onChange={({ file, fileList }) => {
                                let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                let image = currentField && currentField.beauty_services[field.key] && currentField.beauty_services[field.key].image && currentField.beauty_services[field.key].image.file ? currentField.beauty_services[field.key].image.file : ''
                                const isJpgOrPng = image && image.type === 'image/jpeg' || image && image.type === 'image/png' || file.type === 'image/jpg';
                                const isLt2M = image && image.size / 1024 / 1024 < 2;
                                
                                if (!isJpgOrPng) {
                                  message.error('You can only upload JPG , JPEG  & PNG file!');
                                  return false
                                } else if (!isLt2M) {
                                  message.error('Image must smaller than 2MB!');
                                  return false
                                } else {
                                  this.setState({ currentField: currentField })
                                }
                              }}
                            >
                              {currentField && currentField.beauty_services[field.key] && currentField.beauty_services[field.key].image && currentField.beauty_services[field.key].image.fileList.length >= 1 ? null : uploadButton}

                            </Upload>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={19} xl={19}>

                          <Row gutter={28}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Form.Item
                                label={[field.label, "Subcategory"]}
                                name={[field.name, "booking_category_id"]}
                                fieldKey={[field.fieldKey, "booking_category_id"]}
                                rules={rules}
                                placeholder='Please Choose'
                              >
                                <Select
                                  placeholder='Please Choose'
                                  allowClear
                                  size={'large'}
                                  className='w-100'
                                >
                                  {subCategory &&
                                    subCategory.map((keyName, i) => {
                                      return (
                                        <Option key={keyName.id} value={keyName.id}>{keyName.name}</Option>
                                      )
                                    })}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Form.Item
                                label={[field.label, "Service"]}
                                name={[field.name, "name"]}
                                fieldKey={[field.fieldKey, "name"]}
                                rules={rules}
                              >
                                <Input placeholder="Service" />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={10}>
                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                              <Form.Item
                                label={[field.label, "Description"]}
                                name={[field.name, "description"]}
                                fieldKey={[field.fieldKey, "description"]}
                                rules={rules}
                              >
                                <Input placeholder="Description" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                              <Form.Item
                                label={[field.label, "Duration (Mins)"]}
                                name={[field.name, "duration"]}
                                fieldKey={[field.fieldKey, "duration"]}
                                rules={rules}
                                className="duration"
                                placeholder='Select'
                              >
                                <Select placeholder='Select'>
                                  {this.renderOptions()}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                              <Form.Item
                                label={[field.label, "Price"]}
                                name={[field.name, "price"]}
                                fieldKey={[field.fieldKey, "price"]}
                                rules={[{ validator: validNumber }]}
                              >
                                {/* <Input placeholder="Price" /> */}
                                <InputNumber
                                  className="price-number"
                                  placeholder="Price"
                                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Form.List name={[field.fieldKey, "services"]}>
                        {(services, { add, remove }) => {
                          return (
                            <Collapse
                              activeKey={activePanel2}
                              className="panel-next"
                              onChange={(e) => {
                                if (e[e.length - 1] == undefined) {
                                  this.setState({ activePanel2: 1 })
                                } else {
                                  this.setState({ activePanel2: (e[e.length - 1]) })
                                }
                              }}
                            >
                              {services.map((keyName, index2) => (
                                <Panel
                                  // header="Your Service " 
                                  header={currentField && currentField.beauty_services[field.key] && currentField.beauty_services[field.key].services && currentField.beauty_services[field.key].services[keyName.key] && currentField.beauty_services[field.key].services[keyName.key].name ? currentField.beauty_services[field.key].services[keyName.key].name : 'Your Service'}
                                  // key={keyName.key + 1}
                                  key={keyName.key + 1} extra={<MinusCircleOutlined
                                    onClick={() => {
                                      remove(keyName.name);
                                    }}
                                  />}
                                >
                                  {/* <Row gutter={28}> */}
                                  <Row gutter={28} style={{ position: "relative" }}>
                                    <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                                      <Form.Item
                                        {...keyName}
                                        name={[keyName.name, "image"]}
                                        fieldKey={[keyName.fieldKey, "image"]}
                                        key={index2}
                                      >
                                        <Upload
                                          name='avatar'
                                          listType='picture-card'
                                          className='avatar-uploader'
                                          showUploadList={true}
                                          fileList={currentField2 && currentField2.beauty_services[field.key] && currentField2.beauty_services[field.key].services && currentField2.beauty_services[field.key].services[keyName.key] && currentField2.beauty_services[field.key].services[keyName.key].image ? currentField2.beauty_services[field.key].services[keyName.key].image.fileList : []}
                                          customRequest={this.dummyRequest}
                                          onChange={({ file, fileList }) => {
                                            let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                            let image = currentField && currentField.beauty_services[field.key] && currentField.beauty_services[field.key].services && currentField.beauty_services[field.key].services[keyName.key] && currentField.beauty_services[field.key].services[keyName.key].image ? currentField.beauty_services[field.key].services[keyName.key].image.file : ''
                                            
                                            const isJpgOrPng = image && image.type === 'image/jpeg' || image && image.type === 'image/png';
                                            const isLt2M = image && image.size / 1024 / 1024 < 2;
                                            if (!isJpgOrPng) {
                                              message.error('You can only upload JPG , JPEG  & PNG file!');
                                              return false
                                            } else if (!isLt2M) {
                                              message.error('Image must smaller than 2MB!');
                                              return false
                                            } else {
                                              this.setState({ currentField2: currentField })
                                            }
                                          }}
                                        >
                                          {currentField2 && currentField2.beauty_services[field.key] && currentField2.beauty_services[field.key].services && currentField2.beauty_services[field.key].services[keyName.key] && currentField2.beauty_services[field.key].services[keyName.key].image && currentField2.beauty_services[field.key].services[keyName.key].image.fileList.length >= 1 ? null : uploadButton}

                                        </Upload>
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={19} xl={19}>
                                      <Row gutter={28}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                          <Form.Item
                                            {...keyName}
                                            label={[keyName.label, "Service"]}
                                            name={[keyName.name, "name"]}
                                            fieldKey={[keyName.fieldKey, "name"]}
                                            rules={rules}
                                            key={index2}
                                          >
                                            <Input placeholder="Service" />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                      <Row gutter={10}>
                                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                          <Form.Item
                                            {...keyName}
                                            label={[keyName.label, "Description"]}
                                            name={[keyName.name, "description"]}
                                            fieldKey={[keyName.fieldKey, "description"]}
                                            rules={rules}
                                            key={index2}
                                          >
                                            <Input placeholder="Description" />
                                          </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                          <Form.Item
                                            {...keyName}
                                            label={[keyName.label, "Duration"]}
                                            name={[keyName.name, "duration"]}
                                            fieldKey={[keyName.fieldKey, "duration"]}
                                            rules={rules}
                                            key={index2}
                                            className="duration"
                                            placeholder='Select'
                                          >
                                            <Select placeholder='Select'>
                                              {this.renderOptions()}
                                            </Select>
                                          </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                          <Form.Item
                                            {...keyName}
                                            label={[keyName.label, "Price"]}
                                            name={[keyName.name, "price"]}
                                            fieldKey={[keyName.fieldKey, "price"]}
                                            rules={rules}
                                            key={index2}
                                          >
                                            <InputNumber
                                              className="price-number"
                                              placeholder="Price"
                                              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    </Col>
                                    {/* <MinusCircleOutlined
                                      onClick={() => {
                                        remove(keyName.name);
                                      }}
                                    /> */}
                                  </Row>
                                  {/* </Row> */}
                                </Panel>
                              ))}
                              <Form.Item style={{ width: "100%", textAlign: "right", justifyContent: "flex-end", paddingRight: "70px" }}>
                                <div className='align-right fr-addbtn-icon add-card-link align-right'>
                                  <Icon icon='add-circle' size='20' className='add-circ-conle' onClick={() => {
                                    let currentField = this.formRef.current.getFieldsValue()
                                    
                                    // add();
                                    // if (currentField.beauty_services[field.key].services) {
                                    //   this.setState({ activePanel2: currentField.beauty_services[field.key].services.length + 1 })
                                    // }
                                    if (currentField.beauty_services[field.key].services) {
                                      let currentdata = currentField.beauty_services && currentField.beauty_services[field.key].services
                                      let isadded = currentdata.some(el => el.name !== undefined && el.price !== undefined && el.duration !== undefined && el.description !== undefined); // true
                                      if (isadded) {
                                        this.setState({ activePanel2: currentField.beauty_services[field.key].services.length + 1 })
                                        add()
                                      } else {
                                        toastr.warning(langs.warning, MESSAGES.MANDATE_FILDS)
                                      }
                                    } else {
                                      add()
                                    }
                                  }
                                  }
                                  />

                                </div>
                              </Form.Item>
                            </Collapse>
                          );
                        }}
                      </Form.List>

                      {field.key !== 0 && <Col flex="none">
                        <MinusCircleOutlined
                          size="20"
                          className="dynamic-delete-button"
                          title={'Add More'}
                          onClick={() => { this.setState({ inputVisible: false }, () => remove(field.name)) }}
                        />
                      </Col>}
                    </div>
                  </Panel>
                ))}
                <Row gutter={0}>

                  <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ marginLeft: "20.83333333%" }}>
                    <div>
                      <Form.Item >
                        <Button
                          type='primary'
                          onClick={() => {
                            let currentField = this.formRef.current.getFieldsValue()
                            
                            if (currentField && currentField.beauty_services) {
                              let isadded = currentField.beauty_services.some(el => (el.name === undefined || el.name === '') || (el.price === undefined || el.price === '') || (el.duration === undefined || el.duration === '') || (el.description === undefined || el.description === '') || (el.booking_category_id === undefined || el.booking_category_id === '')); // true
                              if (isadded) {
                                toastr.warning(langs.warning, MESSAGES.MANDATE_FILDS)
                              } else {
                                this.setState({ inputVisible: true, activePanel: currentField.beauty_services.length + 1 }, () => add())
                              }
                            }

                          }}
                          block
                          className="add-btn add-btn-trans"
                        >
                          Add
                        </Button>
                        {isCreateService === undefined && <Button
                          className="add-btn"
                          type="primary" htmlType="submit" >
                          Save
                        </Button>}
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Collapse>
            );
          }}
        </Form.List>
      </Form >
    )
  }

  /**
   * @method renderServiceTab
   * @description render service tab
   */
  renderServiceTab = () => {
    const { services, isEditScrren, isEditFlag, serviceInfo, activeKey } = this.state;
    const { isCreateService, isLoggedIn, loggedInUser } = this.props
    if (Array.isArray(services) && services.length) {
      // let defaultTab = (Array.isArray(services) && !activeKey) ? services[0].id : activeKey
      return (
        <Tabs activeKey={activeKey}
          onTabClick={(e) => {
            let temp = services.filter((el) => {
              if (el.id == e) {
                return el
              }
            })
            this.setState({ selectedTab: e, activeKey: e })
            
          }}
        >
          {services.map((el, i) => {
            return (
              <TabPane tab={el.name} key={el.id}>
                <Row>
                  <div className="restaurant-content-block restaurant-content-block-service">
                    {/* {isCreateService === undefined && this.createDynamicInput()}
                    <div className="reformer-grid-block">
                      <table>
                        {this.renderUserServices(el,el.trader_user_profile_services)}
                      </table>
                    </div> */}
                    <BeautyServicesForm
                      isCreateService={isCreateService}
                      selectedTabId={this.state.selectedTab ? this.state.selectedTab : el.id}
                      tabValue={el}
                      services={services}
                      traderServices={el.trader_user_profile_services}
                      getServiceDetail={() => this.getServiceDetail()}
                      isLoggedIn={isLoggedIn}
                      loggedInUser={loggedInUser}
                      parameter={this.props.match.params}
                    />
                  </div>
                </Row>
              </TabPane>
            )
          })}
        </Tabs>
      )
    }
    // else {
    //   return <NoContentFound />
    // }
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const { isEditScrren, isEditFlag, services } = this.state;
    const { isCreateService } = this.props
    return (
      <Layout className="create-membership-block profile-beauty-service profile-beauty-service-custom">
        {isCreateService === undefined && <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab' >
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>Manage Services</Title>
                  </div>
                </div>
                <Card
                  bordered={false}
                  className='profile-content-box edit'
                  title={'Edit Service'}
                >
                  <Row gutter={[38, 38]} >
                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={16} xl={16}>
                      <Card
                        className='restaurant-tab test'
                      >
                        {this.renderServiceTab()}
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
          </Layout>
        </Layout>}
        {isCreateService && <div className="profile-setup-condition-block">
          <Row gutter={[38, 38]} >
            {services.length !== 0 &&
              <Link
                onClick={() => this.props.nextStep()}
                className='skip-link uppercase'
                style={{ marginTop: '100px', marginRight: '100px' }} >Skip</Link>
            }
            <Col className='gutter-row' xs={24} sm={24} md={24} lg={16} xl={16}>
              <div className="restaurant-content-block">
                <Card
                  className='restaurant-tab test'
                >
                  {/* {this.renderServiceTab()} */}
                  {this.createDynamicInput()}
                </Card>
              </div>
            </Col>
          </Row>
          <Divider className="mb-30" />
          <div className="step-button-block">
            <Button htmlType='submit' type='primary' size='middle' className='btn-blue' form='create-service'
            >NEXT</Button>
          </div>
        </div>}
      </Layout>
    );
  }
}


const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {}
  };
};
export default connect(
  mapStateToProps,
  { getTraderProfile, getBookingSubcategory, activateAndDeactivateService, editServices, getBeautyServices, deleteServices, enableLoading, disableLoading }
)(BeautyServices)