import React from 'react';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../config/localization'
import { connect } from 'react-redux';
import { Steps, Collapse, Select, Button, DatePicker, Input, Form, Row, Col, Layout, Typography, Tabs, Card, Divider } from 'antd';
import Icon from '../../../customIcons/customIcons';
import { disableLoading, enableLoading, getRestaurantDetail, getSpaServices, getBeautyServices, getDealFromAdmin, getFitnessClassListing, createDeals, getTraderProfile } from '../../../../actions';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from '../../../../config/Config';
import history from '../../../../common/History';
import { required } from '../../../../config/FormValidation'
import { MESSAGES } from '../../../../config/Message';
import { dateFormate1, dateFormate } from '../../../common';
import { MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

class CreateDeals extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      services: [],
      defaultActiveTab: '1',
      activePannel: 1
    };
  }

  componentDidMount() {
    const { loggedInUser } = this.props;
    let userType = loggedInUser.user_type
    this.getEligibleDeal()
    if (userType === langs.userType.fitness) {
      this.getFitnessServiceDetail()
    } else if (userType === langs.userType.beauty) {
      this.getBeautyServiceDetail()
    } else if (userType === langs.userType.wellbeing) {
      this.getSpaServiceDetail()
    }
  }

  /**
   * @method getEligibleDeal
   * @description get Eligible promo details
   */
  getEligibleDeal = () => {
    const { loggedInUser } = this.props;
    let userType = loggedInUser.user_type;
    let reqData = {}
    if (userType !== langs.key.restaurant) {
      const { booking_cat_id, booking_sub_cat_id } = this.props.userDetails.user.trader_profile
      reqData.category_id = booking_cat_id
      reqData.sub_category_id = booking_sub_cat_id
    }
    this.props.getDealFromAdmin(reqData)
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
        this.setState({ services: serv })
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
        let traderClasses = data.trader_classes && Array.isArray(data.trader_classes) && data.trader_classes.length ? data.trader_classes : []
        this.setState({ services: traderClasses })
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
        this.setState({ services: services })
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

        let temp = []
        services && services.length && services.map((el, i) => {
          Array.isArray(el.trader_user_profile_services) && el.trader_user_profile_services.length && el.trader_user_profile_services.map(el2 => {
            temp.push(el2)
          })
        })
        this.setState({ services: temp })
      }
    })
  }

  onFinish = values => {
    const { loggedInUser } = this.props;
    const { booking_cat_id, booking_sub_cat_id, id } = this.props.userDetails.user.trader_profile
    let userType = loggedInUser.user_type
    let reqData = {};
    let temp = []
    let deal = {}
    values.deals.map((el) => {
      deal.deal_id = values.deals[0].deal_id
      deal.item_id = el.item_id
      deal.actual_price = el.actual_price
      deal.discount_percent = el.discount_percent
      deal.discounted_price = el.discounted_price
      deal.vendor_id = id
      deal.category_id = booking_cat_id;
      deal.sub_category_id = booking_sub_cat_id;
      deal.service_type = userType === langs.key.restaurant ? langs.key.restaurant : userType === langs.userType.beauty ? langs.userType.beauty : userType === langs.userType.wellbeing ? langs.userType.wellbeing : userType === langs.userType.fitness ? langs.userType.fitness : '';
      deal.start_date = moment(el.start_date).format('DD-MM-YYYY');
      deal.end_date = moment(el.end_date).format('DD-MM-YYYY');
      temp.push(deal)
    })
    reqData.deals = temp;
    this.props.createDeals(reqData, (res) => {
      if (res.data && res.data.status === 1) {

        toastr.success(langs.success, MESSAGES.DEAL_CREATE_SUCCESS)
        this.props.history.push('/my-deals')
      }
    })
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

  /**
   * @method render
   * @description render component
   */
  render() {
    const { current, activePannel, step1Data, selectedMembershipId, packageList, services, selectedClassId, defaultActiveTab } = this.state;
    // console.log('activePannel: $$$', activePannel);
    const { userDetails, loggedInUser, dealFromAdmin } = this.props;
    let deal = Array.isArray(dealFromAdmin) && dealFromAdmin.length ? dealFromAdmin[0] : ''
    let discountRange = this.rangeBetween(deal.discount_range_start, deal.discount_range_end)
    let userType = loggedInUser.user_type
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
                      <Title level={2}>Daily Deals</Title>
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
                          <TabPane tab='Create your Deals' key='1'>
                            <h4>
                              <b>Deal Information</b>
                            </h4>
                            <div className='my-profile-box createmembership' style={{ minHeight: 800 }}>
                              <div className='ml-5 daily-deals-detail'>
                                <Row>
                                  <Col span={4}>
                                    <h5>
                                      <b>Daily Deals Name</b>
                                    </h5>
                                  </Col>
                                  <Col span={4}>
                                    {deal && <Text>{dealFromAdmin[0].title}</Text>}
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={4}>
                                    <h5>
                                      <b>Valid Date</b>
                                    </h5>
                                  </Col>
                                  <Col span={4}>
                                    {deal && <Text>{`${dateFormate(dealFromAdmin[0].start_date)}-${dateFormate(dealFromAdmin[0].end_date)}`}</Text>}
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={4}>
                                    <h5>
                                      <b>Discount Percent Limit</b>
                                    </h5>
                                  </Col>
                                  <Col span={4}>
                                    {deal && <Text>{`${dealFromAdmin[0].discount_range_start} %  -  ${dealFromAdmin[0].discount_range_end} %`}</Text>}
                                  </Col>
                                </Row>
                              </div>
                              <div>
                                <Form
                                  layout='vertical'
                                  name='members'
                                  onFinish={this.onFinish}
                                  ref={this.formRef}
                                  autoComplete='off'
                                  initialValues={{
                                    name: 'user 1',
                                    deals: [{ deal_id: deal.id }],
                                  }}
                                >

                                  <Form.List name='deals'>
                                    {(fields, { add, remove }) => {
                                      return (
                                        <div>
                                          {/* {console.log(fields, 'fields: $$$$', fields.length)} */}
                                          <Card
                                            className='profile-content-box'
                                            title=''
                                          >
                                            <Collapse activeKey={activePannel}
                                              destroyInactivePanel={true}
                                            // onChange={(e) => {
                                            //   let lastIndex = e[e.length - 1]
                                            //   // console.log('e: $$$$', e);
                                            //   //  console.log(fields.length, 'lastIndex: $$$$ ', Number(lastIndex));
                                            //   // console.log('fields: $$$$ ', fields);
                                            //   //|| fields.length <= Number(e[e.length - 1])
                                            //   if (Number(lastIndex) > fields.length) {
                                            //     this.setState({ activePannel: 1 })
                                            //   } else {
                                            //     let test = lastIndex - 1
                                            //     // console.log('$$$$ else', Number(lastIndex));
                                            //     // if (fields[lastIndex]  === undefined) {
                                            //     //   this.setState({ activePannel: 1 })
                                            //     // } else {
                                            //     this.setState({ activePannel: lastIndex })
                                            //     // }
                                            //   }
                                            // }}
                                            >
                                              {fields.map((field, index) => (
                                                <Panel
                                                  header={<div onClick={(e) => {
                                                    let currentPanel = fields[index];
                                                    this.setState({ activePannel: currentPanel.name + 1 })
                                                    console.log(currentPanel.name, 'e: $$$$');
                                                  }} style={{ width: '75%' }}>{`Deal ${field.name + 1}`}</div>}
                                                  key={field.name + 1}
                                                  extra={field.key !== 0 && <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => {
                                                      let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                      this.setState({
                                                        activePannel: 1
                                                      }, () => remove(field.name))
                                                      console.log('currentField.deals: ', currentField);
                                                    }}
                                                  />}
                                                >
                                                  <div>
                                                    <Row >
                                                      <Col span={24}>
                                                        <Form.Item
                                                          label='Select Services'
                                                          // name='class_name1'
                                                          {...field}
                                                          rules={[required('Services')]}
                                                          name={[field.name, 'item_id']}
                                                          fieldKey={[field.fieldKey, 'item_id']}
                                                        >
                                                          <Select
                                                            placeholder='Select'
                                                            size='large'
                                                            onChange={(e) => {
                                                              let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                              let i = services.findIndex((c) => c.id === e)
                                                              currentField.deals[field.key].actual_price = services[i].price

                                                              let actulaPrize = currentField.deals[field.key].actual_price
                                                              let disscount = currentField.deals[field.key].discount_percent
                                                              currentField.deals[field.key].discounted_price = ''
                                                              currentField.deals[field.key].discount_percent = ''
                                                              currentField.deals[field.key].start_date = ''
                                                              currentField.deals[field.key].end_date = ''
                                                              this.formRef.current.setFieldsValue({ ...currentField })
                                                            }}
                                                            allowClear
                                                          >
                                                            {services &&
                                                              services.map((keyName, i) => {
                                                                return (
                                                                  <Option key={keyName.id} value={keyName.id}>{userType === langs.key.restaurant ? keyName.menu_category_name : (userType === langs.userType.wellbeing || userType === langs.userType.beauty) ? keyName.name : keyName.class_name}</Option>
                                                                )
                                                              })}

                                                          </Select>
                                                        </Form.Item>
                                                      </Col>
                                                    </Row>

                                                    <Row >
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
                                                    </Row>

                                                    <Row >
                                                      <Col span={24}>
                                                        <Form.Item
                                                          label='Discount Percentage'
                                                          {...field}
                                                          rules={[required('Discount Percentange')]}
                                                          name={[field.name, 'discount_percent']}
                                                          fieldKey={[field.fieldKey, 'discount_percent']}
                                                          onChange={(e) => {
                                                            let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                            let rangeLimitStart = dealFromAdmin[0].discount_range_start
                                                            let rangeLimitEnd = dealFromAdmin[0].discount_range_end

                                                            let disscount = Number(e.target.value)
                                                            // 

                                                            if (rangeLimitStart > disscount || rangeLimitEnd < disscount) {
                                                              toastr.warning(langs.warning, MESSAGES.DISSCOUNT_VALIDATION)
                                                              currentField.deals[field.key].discounted_price = '';
                                                              this.formRef.current.setFieldsValue({ ...currentField })
                                                              return
                                                            }
                                                            let actulaPrize = currentField.deals[field.key].actual_price

                                                            let percentAsDecimal = (disscount / 100);

                                                            let percent = percentAsDecimal * actulaPrize;

                                                            let dis = actulaPrize - percent
                                                            dis = dis.toFixed(2)
                                                            currentField.deals[field.key].discounted_price = isNaN(dis) ? 0 : dis
                                                            this.formRef.current.setFieldsValue({ ...currentField })

                                                          }}
                                                        >
                                                          <Input type='number'
                                                          />
                                                          {/* <Select
                                                                                                                        placeholder='Select'
                                                                                                                        size='large'
                                                                                                                        onChange={(e) => {
                                                                                                                            
                                                                                                                            let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                                                                                            let actulaPrize = currentField.deals[field.key].actual_price
                                                                                                                            var percentAsDecimal = (e / 100);
                                                                                                                            var percent = percentAsDecimal * actulaPrize;
                                                                                                                            

                                                                                                                            currentField.deals[field.key].discounted_price = actulaPrize - percent
                                                                                                                            this.formRef.current.setFieldsValue({ ...currentField })

                                                                                                                        }}
                                                                                                                        allowClear
                                                                                                                    >
                                                                                                                        {discountRange &&
                                                                                                                            discountRange.map((keyName, i) => {
                                                                                                                                return (
                                                                                                                                    <Option key={keyName} value={keyName}>{keyName}</Option>
                                                                                                                                )
                                                                                                                            })}

                                                                                                                    </Select>
                                                                                                                */}
                                                        </Form.Item>
                                                      </Col>
                                                    </Row>
                                                    <Row >
                                                      <Col span={24}>
                                                        <Form.Item
                                                          label='Discounted Price'
                                                          {...field}
                                                          name={[field.name, 'discounted_price']}
                                                          fieldKey={[field.fieldKey, 'discounted_price']}
                                                        // rules={[required('Category')]}
                                                        >
                                                          <Input disabled />
                                                        </Form.Item>
                                                      </Col>
                                                    </Row>
                                                    <Divider style={{ margin: "13px 0 15px 0" }} />
                                                    <Row gutter={0} className="date-picker">
                                                      <Col xs={24} sm={24} md={24} lg={12} xl={12} className="start-date">
                                                        <Form.Item
                                                          label='Duration'
                                                          {...field}
                                                          name={[field.name, 'start_date']}
                                                          fieldKey={[field.fieldKey, 'start_date']}
                                                          rules={[required('Start Date')]}
                                                        >
                                                          <DatePicker
                                                            onChange={(e) => {
                                                              let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                              currentField.deals[field.key].end_date = '';
                                                              this.formRef.current.setFieldsValue({ ...currentField })
                                                            }}
                                                            disabledDate={(current) => {
                                                              let startDate = moment(deal.start_date)
                                                              let endDate = moment(deal.end_date)
                                                              return current && (current.valueOf() < startDate || current.valueOf() > endDate);
                                                            }}

                                                          />
                                                        </Form.Item>
                                                      </Col>
                                                      <Col xs={24} sm={24} md={24} lg={12} xl={12} className="end-date">
                                                        <Form.Item
                                                          label=''
                                                          {...field}
                                                          name={[field.name, 'end_date']}
                                                          fieldKey={[field.fieldKey, 'end_date']}
                                                          rules={[required('End date')]}
                                                        >
                                                          <DatePicker
                                                            disabledDate={(current) => {
                                                              let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                              let selectedStartDate = currentField.deals[field.key].start_date
                                                              let startDate = selectedStartDate ? selectedStartDate : moment(deal.start_date)
                                                              let endDate = moment(deal.end_date)
                                                              return current && (current.valueOf() < startDate || current.valueOf() > endDate);
                                                            }} />
                                                        </Form.Item>
                                                      </Col>

                                                    </Row>

                                                  </div>
                                                </Panel>))
                                              }
                                            </Collapse>                                                                                                        <div className="btn-block">
                                              <Form.Item>
                                                <Button
                                                  className='add-btn add-btn-trans'
                                                  onClick={() => {
                                                    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()

                                                    this.setState({ activePannel: this.state.activePannel + 1 })
                                                    if (Array.isArray(currentField.deals) && currentField.deals.length === 5) {
                                                      toastr.warning(langs.warning, 'You can not create more than 5 deals at a time')
                                                    } else {
                                                      add();
                                                    }
                                                  }}
                                                  block
                                                >Add
                                                      </Button>
                                                <Button
                                                  className='add-btn'
                                                  htmlType='submit'
                                                  block
                                                >Submit
                                                    </Button>
                                              </Form.Item>


                                            </div>
                                          </Card>
                                        </div>
                                      )
                                    }
                                    }
                                  </Form.List>
                                </Form>
                              </div>
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
    dealFromAdmin: Array.isArray(venderDetails.dealFromAdmin) ? venderDetails.dealFromAdmin : [],
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
  };
};
export default connect(
  mapStateToProps,
  {
    disableLoading, enableLoading, getRestaurantDetail, getSpaServices, getBeautyServices, createDeals, getFitnessClassListing, getDealFromAdmin, getTraderProfile
  }
)(CreateDeals);