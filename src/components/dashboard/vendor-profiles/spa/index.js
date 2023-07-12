import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {InputNumber, Collapse, message, Upload, Select, Input, Space, Form, Switch, Divider, Layout, Card, Typography, Button, Tabs, Row, Col } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import NoContentFound from '../../../common/NoContentFound'
import { STATUS_CODES } from '../../../../config/StatusCode'
import { MESSAGES } from '../../../../config/Message'
import { createSpaServices, enableLoading, disableLoading, getTraderProfile, getBookingSubcategory, activateAndDeactivateService, updateSpaServices, getSpaServices, deleteServices } from '../../../../actions'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../../config/Config';
import Icon from '../../../customIcons/customIcons';
import { convertHTMLToText } from '../../../common';
import { required,validNumber } from '../../../../config/FormValidation'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import '../../vendor-profiles/myprofilerestaurant.less'
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
      BeautyService: '',
      isEditFlag: false,
      durationOption: [],
      item: '',
      itemInfo: '', serviceInfo: '',
      fileList: [],
      Id: '', subCategory: [], activePanel: 1,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { userDetails } = this.props
    const { id, user_type } = this.props.loggedInUser;
     let temp = []
    for (let i = 30; i <= 240; i=i+30) {
      temp.push(i)
    }
    this.setState({ durationOption: temp })
    this.getServiceDetail()
  }

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props
    this.props.getSpaServices(loggedInUser.trader_profile_id, res => {
      if (res.status === 200) {
        
        let data = res.data && res.data.data
        let services = data && Array.isArray(data.wellbeing_trader_service) && data.wellbeing_trader_service.length ? data.wellbeing_trader_service : []
        
        this.getItemDetail(services[0])
        this.setState({ services: services })
      }
    })
  }

  getItemDetail = (el) => {
    this.setState({
      serviceInfo: el,
      isEditFlag: true,
    })

    let currentValue = this.formRef.current && this.formRef.current.getFieldsValue()
    
    if (currentValue) {
      currentValue.services[0].more_info = el.more_info
      currentValue.services[0].name = el.name
      currentValue.services[0].duration = el.duration
      currentValue.services[0].price = el.price
      this.formRef.current && this.formRef.current.setFieldsValue({
        currentValue
      });
    }
  }

  /**
 * @method renderUserServices
 * @description render service details
 */
  renderUserServices = (item) => {
    function onChange(checked) {
      
    }
    if (item && item.length) {
      return item && Array.isArray(item) && item.map((el, i) => {
        return (

          <tr key={i}>
            <td colspan="2">
              <div className="title"><Text>{el.name}</Text></div>
              <div className="subtitle">{`${el.more_info}`}</div>
            </td>
            <td colspan="2">
              <div className="amount"><Text>{`$${el.price}`}</Text> <div className="subtitle">{`${el.duration}`}</div></div>

            </td>
            <td colspan="2">
              <div className="switch"><Switch defaultChecked={el.service_status === 1 ? true : false}
                onChange={(checked) => {
                  let requestData = {
                    service_id: el.id ? el.id : '',
                    status: checked ? 1 : 0
                  }
                  this.props.activateAndDeactivateService(requestData, res => {
                    if (res.status === 200) {
                      toastr.success(res.data && res.data.data)
                    }
                  })
                }}
              /></div>
              <div className="edit-delete">
                <a href="javascript:void(0)" onClick={() => this.getItemDetail(el)}>

                  <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' />
                </a>
                <a href="javascript:void(0)" onClick={(e) => {
                  toastr.confirm(
                    `${MESSAGES.CONFIRM_DELETE}`,
                    {
                      onOk: () => this.deleteItem(el.id),
                      onCancel: () => {  }
                    })
                }}
                >
                  <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' />
                </a>
              </div>
            </td>
          </tr>

        )
      }).reverse();
    }
  }

  /**
   * @method deleteItem
   * @description remove service 
   */
  deleteItem = (id) => {
    
    this.props.deleteServices(id, res => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.BEAUTY_SERVICE_DELETE)
        this.getServiceDetail()
      }
    })
  }

  resetField = () => {
    this.formRef.current && this.formRef.current.resetFields()
    this.setState({ fileList: [], serviceInfo: '', isEditflag: false })
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (value) => {
    
    const { isEditFlag } = this.state
    const { isCreateService } = this.props
    let requestData = {}, requestData2 = []
    if (value.services) {
      value.services && value.services.map((el, i) => {
        const { serviceInfo } = this.state
        requestData = {
          wellbeing_service_id: serviceInfo.id,
          duration: el.duration,
          price: el.price,
          more_info: el.more_info,
          name: el.name
        }
      })
      if (isEditFlag) {
        this.props.updateSpaServices(requestData, res => {
          if (res.status === 200) {
            toastr.success('Vendor service has been updated successfully.')
            this.getServiceDetail()
            this.resetField()
            this.setState({ isEditFlag: false })
            if (isCreateService) {
              this.props.nextStep()
            }
          }
        })
      } else {
        const { loggedInUser } = this.props
        const requestData = {
          trader_profile_id: loggedInUser.trader_profile_id,
          services: value.services
        }
        const formData = new FormData()
        if (typeof requestData.services == 'object') {
          formData.append('services', `${JSON.stringify(requestData.services)}`)
        }
        formData.append('trader_profile_id', loggedInUser.trader_profile_id)
        this.props.createSpaServices(formData, res => {
          if (res.status === 200) {
            toastr.success('Vendor service has been created successfully.')
            this.getServiceDetail()
            this.resetField()
            if (isCreateService) {
              this.props.nextStep()
            }
          }
        })
      }

    }

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
    const { isEditFlag, activePanel } = this.state
    const { isCreateService } = this.props
    return (
      <Form
        onFinish={this.onFinish}
        className="my-form"
        layout='vertical'
        ref={this.formRef}
        id='spa-form'
        initialValues={{
          name: 'services',
          services: [{ name: '', price: '', more_info: "", duration: "" }]
        }}
      >
        <Form.List name="services">
          {(fields, { add, remove }) => {
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
                  <Panel header="Your Service" key={field.fieldKey + 1}>
                    {/* <div key={field.key}> */}

                    <Row gutter={10}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Form.Item
                          label={[field.label, "Item Name"]}
                          name={[field.name, "name"]}
                          fieldKey={[field.fieldKey, "name"]}
                          rules={rules}
                        >
                          <Input placeholder="Item Name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Form.Item
                          label={[field.label, "Price AUD"]}
                          name={[field.name, "price"]}
                          fieldKey={[field.fieldKey, "price"]}
                          rules={[{ validator: validNumber }]}
                        >
                          <Input placeholder="Price AUD" type='number' />
                          {/* <InputNumber
                                placeholder="Price AUD"
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            /> */}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={10}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Form.Item
                          label={[field.label, "Description"]}
                          name={[field.name, "more_info"]}
                          fieldKey={[field.fieldKey, "more_info"]}
                          rules={rules}
                        >
                          <Input placeholder="Description" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Form.Item
                          label={[field.label, "Duration (mins)"]}
                          name={[field.name, "duration"]}
                          fieldKey={[field.fieldKey, "duration"]}
                          rules={rules}
                        >
                          {/* <Input placeholder="Duration" type='number' /> */}
                          <Select
                            placeholder='Select'
                          >
                            {this.renderOptions()}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    {field.key !== 0 && <Col flex="none">
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        title={'Add More'}
                        onClick={() => { this.setState({ inputVisible: false }, () => remove(field.name)) }}
                      />
                    </Col>}
                    {/* </div> */}
                  </Panel>
                ))}
                {/* {isCreateService !== undefined && isCreateService && <Form.Item >
                  <Button
                    type='primary'

                    onClick={() => {
                      let currentField = this.formRef.current.getFieldsValue()
                      
                      this.setState({ activePanel: currentField && currentField.services.length + 1 }, () => add())
                    }}
                    size='large'
                    style={{ backgroundColor: '#febb42', borderColor: '#f3ac29' }}
                  >
                    Add
                  </Button>
                </Form.Item>} */}
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ marginLeft: "20.83333333%" }}>
                    <div>
                      <Form.Item >
                        {isCreateService !== undefined && isCreateService && <Button
                          type='primary'
                          htmlType={'button'}
                          onClick={() => {
                            let currentField = this.formRef.current.getFieldsValue()
                            
                            this.setState({ activePanel: currentField && currentField.services.length + 1 }, () => add())
                          }}
                          block
                          className="add-btn"
                        >
                          Add
                      </Button>}
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

      </Form>
    )
  }

  /**
   * @method renderServiceTab
   * @description render service tab
   */
  renderServiceTab = () => {
    const { isEditScrren, isEditFlag, services } = this.state;
    const { isCreateService } = this.props
    let temp = [
      { id: '1', name: 'Massage' }, { id: '2', name: 'Beauty Treatment' }, { id: '3', name: 'Delux' }, { id: '4', name: 'Ultimate' }, { id: '5', name: 'Promotion' }
    ]
    if (isCreateService === undefined && services && services.length) {
      return (
        // <Tabs>
        //   {Array.isArray(temp) && temp.length && temp.map((el, i) => {
        //     return (
        //       <TabPane tab={el.name} key={i}>
        //         <Row>
        //           <div className="restaurant-content-block">
        //             {isCreateService === undefined && (isEditFlag || isEditScrren) && this.createDynamicInput()}
        //             {isCreateService === undefined && <div className="reformer-grid-block">
        //               <table>
        //                 {this.renderUserServices(services)}
        //               </table>
        //             </div>}
        //           </div>
        //         </Row>
        //       </TabPane>
        //     )
        //   })}
        // </Tabs>
        <Row>
          <div className="restaurant-content-block">
            {isCreateService === undefined && (isEditFlag || isEditScrren) && this.createDynamicInput()}
            {isCreateService === undefined && <div className="reformer-grid-block">
              <table>
                {this.renderUserServices(services)}
              </table>
            </div>}
          </div>
        </Row>
      )
    } else if (isCreateService) {
      return (
        // <Tabs>
        //   {Array.isArray(temp) && temp.length && temp.map((el, i) => {
        //     return (
        //       <TabPane tab={el.name} key={i}>
        //         <Row>
        //           <div className="restaurant-content-block">
        //             {this.createDynamicInput()}
        //             {/* <table>
        //                 {this.renderUserServices(services)}
        //               </table> */}
        //           </div>
        //         </Row>
        //       </TabPane>
        //     )
        //   })}
        // </Tabs>
        <Row>
          <div className="restaurant-content-block">
            {this.createDynamicInput()}
          </div>
        </Row>
      )
    } else {
      return <NoContentFound />
    }
  }


  /**
   * @method render
   * @description render component  
   */
  render() {
    const { isEditScrren, services } = this.state;
    const { isCreateService } = this.props
    return (
      <Layout className="create-membership-block profile-beauty-service">
        {isCreateService === undefined && <Layout className="create-membership-block profile-beauty-service profile-spa-service">
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
                  title={'Your Service'}
                  extra={
                    !isEditScrren && <Space
                      align={'center'}
                      className={'blue-link'}
                      style={{ cursor: 'pointer' }}
                      size={9}
                      onClick={() => this.setState({ isEditScrren: true, fileList: [] })}
                    >Edit
                      <img src={require('../../../../assets/images/icons/edit-pencil.svg')} alt='delete' />
                    </Space>
                  }
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
            {services && services.length !== 0 &&
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
                  {this.renderServiceTab()}
                </Card>
              </div>
            </Col>
          </Row>
          <Divider className="mb-30" />
          <div className="step-button-block">
            <Button htmlType='submit' type='primary' size='middle' className='btn-blue' form='spa-form'
            // onClick={() => this.props.nextStep()}
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
  { createSpaServices, getTraderProfile, getBookingSubcategory, activateAndDeactivateService, updateSpaServices, getSpaServices, deleteServices, enableLoading, disableLoading }
)(BeautyServices)