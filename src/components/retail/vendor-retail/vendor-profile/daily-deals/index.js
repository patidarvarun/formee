import React from 'react';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../../config/localization'
import { connect } from 'react-redux';
import { Steps, Collapse, Select, Button, DatePicker, Input, Form, Row, Col, Layout, Typography, Tabs, Card, Divider } from 'antd';
import { disableLoading, enableLoading, getRestaurantDetail, getSpaServices, getBeautyServices, getRetailDealFromAdmin, getFitnessClassListing, createRetailDeals, getTraderProfile, getAdManagementDetails } from '../../../../../actions';
import AppSidebar from '../../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import { required } from '../../../../../config/FormValidation'
import { MESSAGES } from '../../../../../config/Message';
import { dateFormate1, dateFormate } from '../../../../common';
import { MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

class CreateRetailDeals extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      services: [],
      defaultActiveTab: '1',
      activePannel: 1,
      subCategory: [],
      categoryType: '',
      selectedSubCategory: '',
      dealFromAdmin: '',
      selectedBookingItem: ''
    };
  }

  /**
   * @method getEligibleDeal
   * @description get Eligible promo details
   */
  getEligibleDeal = (catId, subCatId) => {
    const { loggedInUser } = this.props;
    let userType = loggedInUser.user_type;
    let reqData = {}
    reqData.category_id = catId
    reqData.sub_category_id = subCatId
    this.props.getRetailDealFromAdmin(reqData, (res) => {
      if (res.status === 200) {
        let deals = Array.isArray(res.data.data) && res.data.data.length ? res.data.data[0] : ''
        this.getItemList(subCatId, deals)

        
      } else {
        this.setState({ dealFromAdmin: '' })
        toastr.warning(langs.warning, 'No Deal Available for this Subcategory.')
      }
    })
  }

  /**
   * @method  get Retail Item List
   * @description get rtail Items   
   */
  getItemList = (category_id, deals) => {
    // this.setState({ page: page, flag_status: flag_status, category_id: category_id })
    const { id } = this.props.userDetails.user;
    let reqData = {
      user_id: id,//54
      page_size: 10,
      page: 1,
      flag_status: 'all',
      category_id: category_id
    }
    this.props.getAdManagementDetails(reqData, (res) => {
      this.props.disableLoading()
      
      if (Array.isArray(res.data)) {
        this.setState({ currentList: res.data, dealFromAdmin: deals })
      } else {
        this.setState({ currentList: [], dealFromAdmin: deals })
      }
    })
  }


  /**
  * @method onCategoryChange
  * @description handle category change
  */
  onCategoryChange = (value) => {
    
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    
    // let obj = JSON.parse(value);
    if (currentField) {
      currentField.deals = [{ deal_id: '' }]
      currentField.subCategory = ''
      this.formRef.current && this.formRef.current.setFieldsValue({
        ...currentField
      });
    }
    this.setState({ categoryType: value, categoryData: value, selectedSubCategory: '' });
    this.getSubCategoryData(value)
  };

  /**
  * @method childCategory
  * @description render booking category list
  */
  childCategory = (childCategory) => {
    if (childCategory.length !== 0) {
      return (
        childCategory.map((keyName, i) => {
          
          // 
          return (
            <Option key={i} value={JSON.parse(keyName.value).id}>
              {/* <Option key={i} value={keyName.value.id}> */}
              {keyName.label}
            </Option>
          );
        })
      );
    }
  };

  /**
   * @method getSubCategoryData
   * @description get subcategory data
   */
  getSubCategoryData = (id) => {
    
    const { retailList } = this.props
    let subcategories = retailList && retailList.filter(el => el.id == id)
    
    if (subcategories && Array.isArray(subcategories) && subcategories.length) {
      let subCategory = subcategories[0].category_childs
      let temp = []
      subCategory && subCategory.length !== 0 && subCategory.map((el, i) => {
        let item = el.category_childs && Array.isArray(el.category_childs) && el.category_childs.length ? el.category_childs : []
        let temp2 = []
        item.length !== 0 && item.map((el2, i) => {
          temp2.push({ value: JSON.stringify(el2), label: el2.text })
        })
        temp.push({ value: JSON.stringify(el), label: el.text, children: temp2 })
      })
      

      this.setState({ subCategory: temp })
    }
  }


  onFinish = values => {
    const { loggedInUser } = this.props;
    const { id } = this.props.userDetails.user.trader_profile
    let userType = loggedInUser.user_type
    let reqData = {};
    let temp = []
    let deal = {}
    values.deals.map((el) => {
      deal.deal_id = this.state.dealFromAdmin.id
      deal.item_id = el.item_id
      deal.actual_price = el.actual_price
      deal.discount_percent = el.discount_percent
      deal.discounted_price = el.discounted_price
      deal.vendor_id = id
      // deal.category_id = booking_cat_id;
      // deal.sub_category_id = booking_sub_cat_id;
      deal.start_date = moment(el.start_date).format('DD-MM-YYYY');
      deal.end_date = moment(el.end_date).format('DD-MM-YYYY');
      temp.push(deal)
    })
    reqData.deals = temp;
    
    this.props.createRetailDeals(reqData, (res) => {
      if (res.data && res.data.status === 1) {
        
        toastr.success(langs.success, MESSAGES.DEAL_CREATE_SUCCESS)
        this.props.history.push('/my-deals')
      }
    })
  }


  /**
   * @method parentCategory
   * @description render booking category list
   */
  parentCategory = (category) => {
    
    return (
      category.length !== 0 &&
      category.map((keyName, i) => {
        return (
          // <Option key={i} value={JSON.stringify(keyName)}>
          <Option key={i} value={keyName.id}>
            {keyName.text}
          </Option>
        );
      })
    );
  };

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
    const { dealFromAdmin, currentList, categoryType, subCategory, activePannel, step1Data, selectedMembershipId, packageList, services, selectedClassId, defaultActiveTab } = this.state;
    const { retailList } = this.props;
    // let deal = dealFromAdmin
    return (
      <Layout className="vendor-retail-daily-deals">
        <Layout>
          <AppSidebar history={history} />
          <Layout style={{ overflowX: 'visible' }}>
            <div className='my-profile-box my-profile-setup manage-edit-memebership '>
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
                            <h4 className="pb-20 test">
                              <b>Deal Information</b>
                            </h4>
                            <div className='my-profile-box createmembership' style={{ minHeight: 800 }}>
                              <Form
                                layout='vertical'
                                name='members'
                                onFinish={this.onFinish}
                                ref={this.formRef}
                                autoComplete='off'
                                initialValues={{
                                  name: 'user 1',
                                  deals: [{ deal_id: dealFromAdmin.id }],
                                }}
                              >

                                <div className="ml-3 daily-deals-detail">
                                  <Row >
                                    <Col span={10}>
                                      <Form.Item
                                        label='Select Category'
                                        name='category'
                                        rules={[required('Category')]}
                                      >
                                        <Select
                                          placeholder='Select Category'
                                          onChange={this.onCategoryChange}
                                          allowClear
                                          size={'large'}
                                          className='w-100'
                                        >
                                          {retailList && this.parentCategory(retailList)}
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <Row >
                                    <Col span={10}>
                                      <Form.Item
                                        label='Select Subcategory'
                                        name='subCategory'
                                        rules={[required('Subcategory')]}
                                      >
                                        <Select
                                          placeholder='Select Subcategory'
                                          onChange={(e) => {
                                            
                                            let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                            if (currentField) {
                                              currentField.deals = [{ deal_id: this.state.dealFromAdmin.id }]
                                              this.formRef.current && this.formRef.current.setFieldsValue({
                                                ...currentField
                                              });
                                            }
                                            this.getEligibleDeal(categoryType, e)
                                          }}
                                          allowClear
                                          size={'large'}
                                          className='w-100'
                                        >
                                          {subCategory && this.childCategory(subCategory)}
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </div>
                                {dealFromAdmin && <div className='ml-5 daily-deals-detail'>
                                  <Row>
                                    <Col span={4}>
                                      <h5>
                                        <b>Daily Deals Name</b>
                                      </h5>
                                    </Col>
                                    <Col span={4}>
                                      <Text>{dealFromAdmin.title}</Text>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>
                                      <h5>
                                        <b>Valid Date</b>
                                      </h5>
                                    </Col>
                                    <Col span={4}>
                                      <Text>{`${dateFormate(dealFromAdmin.start_date)}-${dateFormate(dealFromAdmin.end_date)}`}</Text>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>
                                      <h5>
                                        <b>Discount Percent Limit</b>
                                      </h5>
                                    </Col>
                                    <Col span={4}>
                                      <Text>{`${dealFromAdmin.discount_range_start} %  -  ${dealFromAdmin.discount_range_end} %`}</Text>
                                    </Col>
                                  </Row>
                                </div>}

                                {dealFromAdmin && <div>
                                  {/* <Form
                                  layout='vertical'
                                  name='members'
                                  onFinish={this.onFinish}
                                  ref={this.formRef}
                                  autoComplete='off'
                                  initialValues={{
                                    name: 'user 1',
                                    deals: [{ deal_id: dealFromAdmin.id }],
                                  }}
                                > */}

                                  <Form.List name='deals'>
                                    {(fields, { add, remove }) => {
                                      return (
                                        <div>
                                          <Card
                                            className='profile-content-box'
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
                                                <Panel
                                                  header={`Deal ${field.fieldKey + 1}`}
                                                  key={field.fieldKey + 1}
                                                  extra={field.key !== 0 && <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    title={'Add More'}
                                                    onClick={() => {
                                                      let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
                                                      
                                                      this.setState({ activePannel: currentField && currentField.deals.length - 1 }, () => remove(field.name))
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

                                                              
                                                              let i = currentList.findIndex((c) => c.classifiedid === e)
                                                              currentField.deals[field.key].actual_price = currentList[i].price

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
                                                            {currentList &&
                                                              currentList.map((keyName, i) => {
                                                                return (
                                                                  <Option key={keyName.classifiedid} value={keyName.classifiedid}>{keyName.title}</Option>
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
                                                            let rangeLimitStart = dealFromAdmin.discount_range_start
                                                            let rangeLimitEnd = dealFromAdmin.discount_range_end

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
                                                              let startDate = moment(dealFromAdmin.start_date)
                                                              let endDate = moment(dealFromAdmin.end_date)
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
                                                              let startDate = selectedStartDate ? selectedStartDate : moment(dealFromAdmin.start_date)
                                                              let endDate = moment(dealFromAdmin.end_date)
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

                                  {/* </Form> */}
                                </div>
                                }
                              </Form>
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
  const { auth, profile, venderDetails, common } = store;
  const { categoryData } = common;
  let retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
  

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    dealFromAdmin: Array.isArray(venderDetails.dealFromAdmin) ? venderDetails.dealFromAdmin : [],
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    retailList
  };
};
export default connect(
  mapStateToProps,
  {
    disableLoading, enableLoading, getRestaurantDetail, getSpaServices, getBeautyServices, createRetailDeals, getFitnessClassListing, getRetailDealFromAdmin, getTraderProfile, getAdManagementDetails
  }
)(CreateRetailDeals);