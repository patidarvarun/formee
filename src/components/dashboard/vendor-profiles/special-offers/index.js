import React from 'react';
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../config/localization'
import { connect } from 'react-redux';
import { Steps, Collapse, Select, Button, DatePicker, Input, Form, Row, Col, Layout, Typography, Tabs, Card, Divider } from 'antd';
import { createSpecialOffer, getEligibleOffer, disableLoading, enableLoading, getRestaurantDetail, getSpaServices, getBeautyServices, getDealFromAdmin, getFitnessClassListing, createDeals, getTraderProfile } from '../../../../actions';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import { required } from '../../../../config/FormValidation'
import { MESSAGES } from '../../../../config/Message';
import { dateFormate, dateFormate1 } from '../../../common';
import { DASHBOARD_KEYS } from '../../../../config/Constant'
import moment from 'moment';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

class CreateOffer extends React.Component {
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
    const { loggedInUser, userDetails } = this.props;
    let userType = loggedInUser.user_type
    let reqData = {}
    const { booking_category_id } = userDetails.user.business_profile
    reqData.category_id = booking_category_id
    this.props.getEligibleOffer(reqData)
    this.getRestaurantServiceDetail()
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
        this.setState({ services: serv })
      }
    })
  }

  onFinish = values => {
    
    const { loggedInUser, offersFromAdmin, restaurantDetail } = this.props;
    const { booking_category_id } = this.props.userDetails.user.business_profile
    let rangeLimit = offersFromAdmin.discount_range_end
    let reqData = {};
    let promo = {};
    let temp = []
    let errCase = false
    values.promo.map((el) => {
      // promo = el
      let disscount = Number(promo.discount_percent)
      if (rangeLimit < disscount) {
        toastr.error(langs.error, MESSAGES.DISSCOUNT_VALIDATION)
        errCase = true
        return true
      }
      promo.discount_percent = el.discount_percent
      promo.vendor_id = loggedInUser.id
      promo.is_free_delivery = restaurantDetail.service === 'delivery' ? 1 : 0
      promo.offer_id = offersFromAdmin.id
      promo.category_id = booking_category_id;
      promo.start_date = moment(el.start_date).format('DD-MM-YYYY');
      promo.end_date = moment(el.end_date).format('DD-MM-YYYY');
      temp.push(promo)
    })
    if (!errCase) {
      reqData.offers = temp;
      this.props.createSpecialOffer(reqData, (res) => {
        if (res.data && res.data.status === 1) {
          
          toastr.success(langs.success, MESSAGES.OFFER_CREATE_SUCCESS)
          this.props.history.push('/my-offers')
        }
      })
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

  /**
   * @method render
   * @description render component
   */
  render() {
    const { current, activePannel, step1Data, selectedMembershipId, packageList, services, selectedClassId, defaultActiveTab } = this.state;
    const { userDetails, loggedInUser, promoFromAdmin, offersFromAdmin } = this.props;
    let promo = offersFromAdmin
    
    // Array.isArray(promoFromAdmin) && promoFromAdmin.length ? promoFromAdmin[0] : ''
    let discountRange = this.rangeBetween(promo.discount_range_start, promo.discount_range_end)
    
    let userType = loggedInUser.user_type
    if (promo) {
      return (
        <Layout>
          <Layout>
            <AppSidebar activeTabKey={DASHBOARD_KEYS.SPECIAL_OFFER} history={history} />
            <Layout style={{ overflowX: 'visible' }}>
              <div className='my-profile-box my-profile-setup manage-edit-memebership'>
                <div className='card-container signup-tab'>
                  <div className='steps-content align-left mt-0'>
                    <div className='top-head-section'>
                      <div className='left'>
                        <Title level={2}>Special Offers</Title>
                      </div>
                      <div className='right'></div>
                    </div>
                    <div className='sub-head-section'>
                      <Text>All Fields Required</Text>
                    </div>
                    <Card
                      className='profile-content-box'
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
                            <TabPane tab='Create your Special Offer' key='1'>
                              <h4>
                                <b>Offer Information</b>
                              </h4>
                              <div className=' ml-40 my-profile-box createmembership' style={{ minHeight: 800 }}>
                                <div className='ml-5'>
                                  <Row gutter={[10, 10]}>
                                    <Col span={6}>
                                      <h5>
                                        <b>Offer Name</b>
                                      </h5>
                                    </Col>
                                    <Col span={6}>
                                      {promo && <Text>{promo.title}</Text>}
                                    </Col>
                                  </Row>
                                  <Row gutter={[10, 10]}>
                                    <Col span={6}>
                                      <h5>
                                        <b>Valid Date</b>
                                      </h5>
                                    </Col>
                                    <Col span={6}>
                                      {promo && <Text>{`${dateFormate(promo.start_date)} - ${dateFormate(promo.end_date)}`}</Text>}
                                    </Col>
                                  </Row>
                                  <Row gutter={[10, 10]}>
                                    <Col span={6}>
                                      <h5>
                                        <b>Discount Percent Limit</b>
                                      </h5>
                                    </Col>
                                    <Col span={6}>
                                      {promo && <Text>{`${promo.discount_range_start} % - ${promo.discount_range_end} %`}</Text>}
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
                                      promo: [{ offer_id: promo.id }],
                                    }}
                                  >

                                    <Form.List name='promo'>
                                      {(fields, { add, remove }) => {
                                        return (
                                          <div>
                                            <Card
                                              className='ml-0 profile-content-box special-offerlist '
                                              title=''
                                            >
                                              <Collapse activeKey={activePannel}
                                                onChange={(e) => {
                                                  
                                                  if (e[e.length - 1] == undefined) {
                                                    this.setState({ activePannel: 1 })
                                                  } else {
                                                    this.setState({ activePannel: e[e.length - 1] })
                                                  }
                                                }}>
                                                {fields.map(field => (
                                                  <Panel header={`Offer ${field.fieldKey + 1}`} key={field.fieldKey + 1}>
                                                    <div>
                                                      {/* <Row >
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
                                                                                                                            currentField.promo[field.key].actual_price = services[i].price

                                                                                                                            let actulaPrize = currentField.promo[field.key].actual_price
                                                                                                                            let disscount = currentField.promo[field.key].discount_percent
                                                                                                                            currentField.promo[field.key].discounted_price = ''
                                                                                                                            currentField.promo[field.key].discount_percent = ''
                                                                                                                            currentField.promo[field.key].start_date = ''
                                                                                                                            currentField.promo[field.key].end_date = ''
                                                                                                                            this.formRef.current.setFieldsValue({ ...currentField })
                                                                                                                        }}
                                                                                                                        allowClear
                                                                                                                    >
                                                                                                                        {services &&
                                                                                                                            services.map((keyName, i) => {
                                                                                                                                return (
                                                                                                                                    <Option key={keyName.id} value={keyName.id}>{keyName.name}</Option>
                                                                                                                                )
                                                                                                                            })}

                                                                                                                    </Select>
                                                                                                                </Form.Item>
                                                                                                            </Col>
                                                                                                        </Row>

                                                                                                        <Row >
                                                                                                            <Col span={24}>
                                                                                                                <Form.Item
                                                                                                                    label='Actual prize'
                                                                                                                    {...field}
                                                                                                                    name={[field.name, 'actual_price']}
                                                                                                                    fieldKey={[field.fieldKey, 'actual_price']}
                                                                                                                // rules={[required('Actual Prize')]}
                                                                                                                >
                                                                                                                    <Input disabled />
                                                                                                                </Form.Item>
                                                                                                            </Col>
                                                                                                        </Row>*/}

                                                      <Row >
                                                        <Col span={24}>
                                                          <Form.Item
                                                            label='Discount'
                                                            {...field}
                                                            rules={[required('Discount Price')]}
                                                            name={[field.name, 'discount_percent']}
                                                            fieldKey={[field.fieldKey, 'discount_percent']}
                                                            onChange={(e) => {
                                                              let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                              
                                                              let rangeLimitStart = promo.discount_range_start

                                                              
                                                              let rangeLimitEnd = promo.discount_range_end
                                                              
                                                              let disscount = Number(e.target.value)
                                                              if (rangeLimitStart > disscount || rangeLimitEnd < disscount) {
                                                                // currentField.promo[field.key].discount_percent = '';
                                                                
                                                                this.formRef.current.setFieldsValue({ ...currentField })
                                                                toastr.error(langs.error, MESSAGES.DISSCOUNT_VALIDATION)

                                                              } else {
                                                                let actulaPrize = currentField.promo[field.key].actual_price
                                                                
                                                                var percentAsDecimal = (disscount / 100);
                                                                
                                                                var percent = percentAsDecimal * actulaPrize;
                                                                
                                                                let dis = actulaPrize - percent
                                                                dis = dis.toFixed(2)
                                                                currentField.promo[field.key].discounted_price = isNaN(dis) ? 0 : dis
                                                                //  actulaPrize - percent !== NaN ? actulaPrize - percent : ''
                                                                this.formRef.current.setFieldsValue({ ...currentField })

                                                              }

                                                            }}
                                                          >
                                                            <Input type='number' />

                                                          </Form.Item>
                                                        </Col>
                                                      </Row>
                                                      {/* <Row >
                                                                                                            <Col span={24}>
                                                                                                                <Form.Item
                                                                                                                    label='Disccounted Prize'
                                                                                                                    {...field}
                                                                                                                    name={[field.name, 'discounted_price']}
                                                                                                                    fieldKey={[field.fieldKey, 'discounted_price']}
                                                                                                                // rules={[required('Category')]}
                                                                                                                >
                                                                                                                    <Input disabled />
                                                                                                                </Form.Item>
                                                                                                            </Col>
                                                                                                        </Row>        
                                                                                                                                                                                                        */}
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
                                                                currentField.promo[field.key].end_date = '';
                                                                this.formRef.current.setFieldsValue({ ...currentField })
                                                              }}
                                                              disabledDate={(current) => {
                                                                let startDate = moment(promo.start_date)
                                                                let endDate = moment(promo.end_date)
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
                                                                let selectedStartDate = currentField.promo[field.key].start_date
                                                                let startDate = selectedStartDate ? selectedStartDate : moment(promo.start_date)
                                                                let endDate = moment(promo.end_date)
                                                                return current && (current.valueOf() < startDate || current.valueOf() > endDate);
                                                              }} />
                                                          </Form.Item>
                                                        </Col>

                                                      </Row>

                                                    </div>
                                                  </Panel>))
                                                }
                                              </Collapse>                                                                                                                                                                           <Row>

                                                <Form.Item>
                                                  <Button
                                                    className='ml-40 add-btn'
                                                    htmlType='submit'
                                                    block
                                                  >Submit
              </Button>
                                                </Form.Item>
                                              </Row>
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
                          </Tabs>
                        </Layout>
                      </Layout>
                    </Card>
                  </div>
                  <div className='steps-action align-center mb-32'>
                  </div>

                </div>
              </div>
            </Layout>
          </Layout>
        </Layout>
      )
    } else {

      return <Layout>
        <AppSidebar history={history} />
        <Layout style={{ overflowX: 'visible' }}>
          <Text>No Promo Available</Text>
        </Layout>
      </Layout>
    }
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings, venderDetails } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    offersFromAdmin: venderDetails.offersFromAdmin ? venderDetails.offersFromAdmin : null,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    restaurantDetail: bookings && bookings.restaurantDetail ? bookings.restaurantDetail : ''

  };
};
export default connect(
  mapStateToProps,
  {
    createSpecialOffer, getEligibleOffer, disableLoading, enableLoading, getRestaurantDetail, getSpaServices, getBeautyServices, createDeals, getFitnessClassListing, getDealFromAdmin, getTraderProfile
  }
)(CreateOffer);