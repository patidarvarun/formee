import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Pagination, Layout, Calendar, Card, Typography, Button, Table, Avatar, Row, Col, Input, InputNumber, Select, Upload, Radio } from 'antd';
import AppSidebar from '../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../common/History';
import Icon from '../../../components/customIcons/customIcons';
import PostAdPermission from '../../templates/PostAdPermission'
import { enableLoading, disableLoading, getDashBoardDetails, getTraderProfile } from '../../../actions'
import { convertISOToUtcDateformate, dateFormate, displayDateTimeFormate } from '../../common';
import { Pie, yuan } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import { DEFAULT_IMAGE_TYPE, DASHBOARD_TYPES } from '../../../config/Config';
import { langs } from '../../../config/localization';
import { DASHBOARD_KEYS } from '../../../config/Constant'
import { SearchOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
// import '../calender.less'
// import '../employer.less'
// import '../addportfolio.less'
import './vendorretail.less'
import moment from 'moment'
import { displayCalenderDate, displayDate, dateFormate3, startTime } from '../../common'


const { Option } = Select;
const { Title, Text } = Typography;
let today = Date.now()
function onChange(value) {

}

function handleChange(value) {

}




// Pagination
function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
  }
  if (type === 'next') {
    return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
  }
  return originalElement;
}
class VendorPostAd extends React.Component {

  /*Vendor Retail Order Recived Pop up 10-11-2020*/
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {

    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {

    this.setState({
      visible: false,
    });
  };
  /*Vendor Retail Order Recived Pop up 10-11-2020*/
  /*Vendor Retail condition up 13-11-2020*/
  state = {
    value: 1,
  };

  onChange = e => {

    this.setState({
      value: e.target.value,
    });
  };
  /*Vendor Retail condition up 13-11-2020*/

  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: moment(new Date()).format('YYYY-MM-DD'),
      index: '',
      calendarView: 'week',
      monthStart: '',
      monthEnd: '',
      weekStart: '',
      weekEnd: '', flag: ''
    };
  }

  componentDidMount() {
    const { userDetails, loggedInUser } = this.props;

    if (loggedInUser) {
      this.props.getTraderProfile({ user_id: loggedInUser.id })
      this.getDashBoardDetails()
    }


    function days(current) {
      var week = new Array();
      // Starting Monday not Sunday 
      var first = ((current.getDate() - current.getDay()) + 1);
      for (var i = 0; i < 7; i++) {
        week.push(
          new Date(current.setDate(first++))
        );
      }
      return week;
    }

    var input = new Date();
    let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
    let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0)



    let first = input.getDate() - input.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6
    let firstday = new Date(input.setDate(first)).toUTCString();

    let lastday = new Date(input.setDate(last)).toUTCString();


    this.setState({ monthStart: moment(startOfMonth).format('YYYY-MM-DD'), monthEnd: moment(endOfMonth).format('YYYY-MM-DD'), weekStart: moment(firstday).format('YYYY-MM-DD'), weekEnd: moment(lastday).format('YYYY-MM-DD') })

    var result = days(input);
    let date = result.map(d => d.toString());
    this.setState({ dates: date })
  }

  /**
   * @method  get DashBoard Details
   * @description get classified   
   */
  getDashBoardDetails = (selectedDate, flag, page, search_keyword) => {
    this.setState({ selectedDate: selectedDate, flag: flag, page: page })
    // this.props.enableLoading()
    const { loggedInUser } = this.props;
    const { monthEnd, monthStart, weekStart, weekEnd } = this.state
    let reqData = {
      user_id: loggedInUser.id,
      // page_size: 10,
      // page: page,
      dashboard_type: loggedInUser.role_slug === langs.key.real_estate ? DASHBOARD_TYPES.REAL_ESTATE : loggedInUser.role_slug === langs.key.job ? DASHBOARD_TYPES.JOB : DASHBOARD_TYPES.GENERAL,
      created_date: selectedDate,
      from_date: flag === 'week' ? weekStart : flag === 'month' ? monthStart : '',  //This field used only when we need to pass date range, else this will be empty
      to_date: flag === 'week' ? weekEnd : flag === 'month' ? monthEnd : '',  //This field used only when we need to pass date range,
      search_keyword: search_keyword
    }
    this.props.getDashBoardDetails(reqData, (res) => {
      this.props.disableLoading()

      if (res.success && res.success.status == 1) {
        // 
        this.setState({ dashboardDetails: res.success.data, flag: flag })
      }
    })
  }

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { selectedDate, flag } = this.state
    this.getDashBoardDetails(selectedDate, flag, e, '')
  }

  renderDates = (dates) => {
    const { selectedDate, index } = this.state
    return dates.map((el, i) => {
      // let currentDate = displayDate(el) == displayDate(Date.now()) ? 'active' : ''
      let a = selectedDate
      let b = moment(new Date(el)).format('YYYY-MM-DD')


      return (
        <li key={i} onClick={() => {
          this.setState({ index: i, selectedDate: moment(new Date(el)).format('YYYY-MM-DD') })
          this.getDashBoardDetails(moment(el).format('YYYY-MM-DD'), '', 1, '')
        }} style={{ cursor: 'pointer' }}>
          <span className={a == b ? 'active' : ''}>{displayDate(el)}</span>
        </li>
      )
    })
  }

  renderCalender = () => {
    const { dates, selectedDate } = this.state
    return (
      <div>
        <div className="month">
          <ul>
            <li><span>{displayCalenderDate(selectedDate ? selectedDate : Date.now())}</span></li>
          </ul>
        </div>
        <ul className="weekdays">
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <ul className="days">
          {dates.length && this.renderDates(dates)}
        </ul>
      </div>
    )
  }
  /**
   * @method Calculate max_of_three
   * @description max_of_three number  
   */
  max_of_three = (x, y, z) => {
    let max_val = 0;
    if (x > y) {
      max_val = x;
    } else {
      max_val = y;
    }
    if (z > max_val) {
      max_val = z;
    }
    return max_val;
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { dashboardDetails, calendarView, monthStart, weekEnd, weekStart, monthEnd } = this.state

    const { loggedInUser } = this.props
    let label1 = 0, label2 = 0, label3 = 0, title1 = '', title2 = '', title3 = '', total = 0
    if (loggedInUser.role_slug === langs.key.job) {
      label1 = dashboardDetails.job_view_count
      label2 = dashboardDetails.job_apply_count
      label3 = dashboardDetails.job_interview_count
      title1 = 'Views'
      title2 = 'Application'
      title3 = 'Interviews'
      total = dashboardDetails.job_total_count
    } else if (loggedInUser.role_slug === langs.key.real_estate || loggedInUser.role_slug === langs.key.car_dealer) {
      label1 = dashboardDetails.total_view_count
      label2 = dashboardDetails.ads_reachout_count
      label3 = dashboardDetails.ads_sold_count
      title1 = 'Views'
      title2 = 'Reach outs'
      title3 = 'Sold'
      total = dashboardDetails.ads_total_count
    }
    const columns = [
      {
        title: '',
        dataIndex: 'name',
        // key: 'name'
        render: (cell, row, index) => {
          return (
            <span className='user-icon mr-13'>
              <Avatar src={(row.image !== undefined) ? row.image : DEFAULT_IMAGE_TYPE
              } />
              {row.name}
            </span>
          )
        }
      },
      {
        title: '',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '',
        dataIndex: 'application_status',
        // key: 'application_status'
        render: (cell, row, index) => {
          return (
            <div>
              <Button type="primary" >
                {row.application_status ? row.application_status : 'Pending'}
              </Button>

              <Text>{displayDateTimeFormate(row.created_at)}
              </Text>
            </div>
          )
        }
      }
    ]

    const real_state = [
      {
        title: '',
        dataIndex: 'name',
        // key: 'name'
        render: (cell, row, index) => {
          return (
            <div>
              {row.is_atended === 1 ?
                <span className='user-icon mr-13'>
                  <ClockCircleOutlined />
                  {dateFormate3(row.created_at)}
                </span> : <span className='user-icon mr-13'>
                  <Avatar src={(row.image !== undefined) ? row.image : DEFAULT_IMAGE_TYPE} />
                  {row.name}
                </span>}
            </div>
          )
        }
      },
      {
        title: '',
        dataIndex: 'location',
        key: 'location',
        render: (cell, row, index) => {
          return (
            <div>
              <Text>{(row.location)}</Text><br />
              <Text>{row.title}</Text>
            </div>
          )
        }
      },
      {
        title: '',
        dataIndex: 'application_status',
        // key: 'application_status'
        render: (cell, row, index) => {
          return (
            <div>
              {row.is_atended === 0 ? <Button onClick={(e) => this.changeStatus(0, cell)} type="primary" style={{ backgroundColor: '#8e60c0', borderColor: '#8e60c0' }} >
                {'Application'}
              </Button> :
                <Button onClick={(e) => this.changeStatus(0, cell)} type="primary" >
                  {'Inspection'}
                </Button>}
              {row.is_atended === 0 && <Text>{startTime(row.created_at)}</Text>}
            </div>
          )
        }
      }
    ]
    const generalUsercolumns = [
      {
        title: '',
        dataIndex: 'name',
        // key: 'name'
        render: (cell, row, index) => {
          return (
            <span className='user-icon mr-13'>
              <Avatar src={(row.image !== undefined) ? row.image : DEFAULT_IMAGE_TYPE
              } />
              {dateFormate(row.created_at)}
            </span>
          )
        }
      },
      {
        title: '',
        dataIndex: 'title',
        // key: 'title'
        render: (cell, row, index) => {
          return (
            <div>
              <Text>{row.location}</Text>
              <div>
                <div><Text>{row.title}</Text></div>
              </div>
            </div>
          )
        }
      },
      {
        title: '',
        dataIndex: 'application_status',
        render: (cell, row, index) => {
          return (
            <div>
              <Button onClick={(e) => this.changeStatus(0, cell)} type="primary" >
                {row.application_status ? row.application_status : 'Pending'}
              </Button>

              <Text>{displayDateTimeFormate(row.created_at)}
              </Text>
            </div>
          )
        }
      }
    ]
    const config = {
      forceFit: false,
      title: {
        visible: true,
        text: 'Ring chart-indicator card',
      },
      description: {
        visible: false,
        text: 'The ring chart indicator card can replace tooltip\uFF0C to display detailed information of each category in the hollowed-out part of the ring chart\u3002',
      },
      radius: 0.1,
      padding: 'auto',
      // data: salesPieData,
      angleField: 'value',
      colorField: 'type',
      statistic: { visible: true },
    };

    const pieDataChart = [
      {
        x: 'View',
        // y: 10 
        y: loggedInUser.role_slug === langs.key.job ? Number(dashboardDetails.job_view_count) : loggedInUser.role_slug === langs.key.real_estate ? Number(dashboardDetails.total_view_count) : Number(dashboardDetails.total_view_count),
      },
      {
        x: loggedInUser.role_slug === langs.key.real_estate ? 'Reachouts' : 'Applications',
        // y: 40
        y: loggedInUser.role_slug === langs.key.job ? Number(dashboardDetails.job_apply_count) : loggedInUser.role_slug === langs.key.real_estate ? Number(dashboardDetails.ads_reachout_count) : Number(dashboardDetails.ads_reachout_count),
        // y: dashboardDetails.job_apply_count,
      },
      {
        x: loggedInUser.role_slug === langs.key.real_estate ? 'Sold' : 'Interviews',
        // y: 30
        y: loggedInUser.role_slug === langs.key.job ? Number(dashboardDetails.job_interview_count) : loggedInUser.role_slug === langs.key.real_estate ? Number(dashboardDetails.ads_sold_count) : Number(dashboardDetails.ads_sold_count),
        // y: dashboardDetails.job_interview_count,
      },

    ];

    let columnType = loggedInUser.role_slug === langs.key.real_estate ? real_state : loggedInUser.role_slug === langs.key.car_dealer ? generalUsercolumns : columns

    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} activeTabKey={DASHBOARD_KEYS.DASH_BOARD} />
          <Layout>
            <div className='my-profile-box employee-dashborad-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>My Dashboard</Title>
                  </div>
                  <div className='right'>
                    <div className='right-content'>
                      <PostAdPermission title={loggedInUser.role_slug === 'job' ? 'Post a Job' : 'Post an Ad'} />
                    </div>
                  </div>
                </div>
                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search Dashboard"
                            prefix={<SearchOutlined className="site-form-item-icon" />}
                            onChange={(e) => {
                              const { selectedDate, flag } = this.state
                              this.getDashBoardDetails(selectedDate, flag, 1, e.target.value)
                            }}
                          />
                        </div>
                      </Col>
                      <Col xs={24} md={8} lg={8} xl={10} className="employer-right-block ">
                        <div className="right-view-text">
                          <span>{label1} Views</span><span className="sep">|</span><span>{total} Ads</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="profile-content-box">
                  <Row gutter={30}>
                    <Col xs={24} md={16} lg={16} xl={14}>
                      <Card
                        className='dashboard-left-calnder-block'
                        title='Latest Activity'
                        extra={<div className="card-header-select"><label>Show:</label>
                          <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="This week">
                            <Option value="week">This week</Option>
                            <Option value="month">This month</Option>
                            {/* <Option value="This year">This year</Option> */}
                          </Select></div>}
                      >
                        <Row>
                          <Col className='gutter-row' md={24}>
                            {calendarView === 'week' ? this.renderCalender() :
                              <Calendar
                                onSelect={(e) => {

                                  this.setState({ selectedDate: moment(new Date(e)).format('YYYY-MM-DD') })
                                  this.getDashBoardDetails(moment(e).format('YYYY-MM-DD'), '', 1, '')
                                }}
                              />}
                          </Col>
                          <Table dataSource={dashboardDetails.job_user_listing} columns={columnType} />
                          {/* {dashboardDetails && Array.isArray(dashboardDetails.job_user_listing) && dashboardDetails.job_user_listing.length > 5 &&<Pagination
                              defaultCurrent={1}
                              defaultPageSize={9} //default size of page
                              onChange={this.handlePageChange}
                              total={50} //total number of card data available
                              itemRender={itemRender}
                              className={'mb-20'}
                          />} */}
                        </Row>

                      </Card>
                      <br />
                      <br />

                      {/*Need to copy this content-12-11-2020*/}
                      <div className="profile-vendor-retail-orderdetail">
                        <div className="post-ad-box-invemtory">
                          <div className="tab-view-content">
                            <div className="heading">
                              <h2>Add Inventory Details</h2>
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
                                  >
                                    <img src={require('../../../assets/images/icons/upload.svg')} alt='upload' />

                                  </Upload>
                                </div>
                              </Col>
                            </Row>

                            <Row gutter={0}>
                              <Col xs={24} sm={24} md={6} lg={6}>
                                <label>Quantity</label>
                              </Col>
                              <Col xs={24} sm={24} md={18} lg={18}>
                                <label>Colour / Pattern Name</label>
                              </Col>
                              <Col xs={24} sm={24} md={6} lg={6}>
                                <Select defaultValue="lucy" onChange={handleChange}>
                                  <Option value="jack">Jack</Option>
                                  <Option value="lucy">Lucy</Option>
                                  <Option value="disabled" disabled>
                                    Disabled
      </Option>
                                  <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                              </Col>
                              <Col xs={24} sm={24} md={18} lg={18}>
                                <Input placeholder="Basic usage" />
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
                                    <Select defaultValue="Centimeters " onChange={handleChange} className="centimeters-select">
                                      <Option value="Centimeters ">Centimeters </Option>
                                      <Option value="Centimeters ">Centimeters </Option>
                                      <Option value="disabled" disabled>
                                        Centimeters
                                      </Option>
                                      <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                                  </div>

                                </Col>
                                {/* Repeat colum for developer */}
                                <div className="lwh-block-parent">
                                  <Row>
                                    <Col xs={24} sm={24} md={6} lg={6}>
                                      <Select defaultValue="Small" onChange={handleChange}>
                                        <Option value="Small">Small</Option>
                                        <Option value="Small">Small</Option>
                                        <Option value="Small"> Small</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                      </Select>
                                    </Col>
                                    <Col xs={24} sm={24} md={18} lg={18}>
                                      <div className="lwh-block">
                                        <Row gutter={20}>
                                          <Col xs={24} sm={24} md={8} lg={8}>
                                            <div className="flex-block">
                                              <label>Length :</label>
                                              <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                                            </div>

                                          </Col>
                                          <Col xs={24} sm={24} md={8} lg={8}>
                                            <div className="flex-block">
                                              <label>Width :</label>
                                              <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                                            </div>

                                          </Col>
                                          <Col xs={24} sm={24} md={8} lg={8}>
                                            <div className="flex-block">
                                              <label>Hight :</label>
                                              <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                                            </div>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col xs={24} sm={24} md={6} lg={6}>
                                      <Select defaultValue="Small" onChange={handleChange}>
                                        <Option value="Small">Small</Option>
                                        <Option value="Small">Small</Option>
                                        <Option value="Small"> Small</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                      </Select>
                                    </Col>
                                    <Col xs={24} sm={24} md={18} lg={18}>
                                      <div className="lwh-block">
                                        <Row gutter={20}>
                                          <Col xs={24} sm={24} md={8} lg={8}>
                                            <div className="flex-block">
                                              <label>Length :</label>
                                              <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                                            </div>

                                          </Col>
                                          <Col xs={24} sm={24} md={8} lg={8}>
                                            <div className="flex-block">
                                              <label>Width :</label>
                                              <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                                            </div>

                                          </Col>
                                          <Col xs={24} sm={24} md={8} lg={8}>
                                            <div className="flex-block">
                                              <label>Hight :</label>
                                              <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                                            </div>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                                {/* Repeat colum for developer */}
                              </Row>
                              <Row>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                  <div className="add-more-size">
                                    <div>
                                      <img src={require('../../../assets/images/icons/plus-circle.svg')} alt='Add' />
                                      <div>Add More Size</div>
                                    </div>

                                  </div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                  <Button type="submit" className="add-more-colour-btn">Add more colour</Button>
                                </Col>
                              </Row>
                            </div>
                            <div className="con-brand-ship-parent-block">
                              <div className="condition-block">
                                <h2>Condition</h2>
                                <Radio value={1}>New with tags</Radio>
                                <Radio>Used</Radio>
                              </div>

                              <div className="condition-block brand-block">
                                <h2>Brand</h2>
                                <Radio >Brand</Radio>
                                <Radio value={2}>Non - Brand</Radio>
                              </div>
                              <div className="condition-block shipment-block">
                                <h2>Shipment</h2>
                                <Radio >Free</Radio>
                                <Radio value={2}>Enter Shipping Amount</Radio>
                              </div>

                              <div className="shipment-grid-block">
                                <div className="shipname">Shipping Name</div>
                                <div className="price">Price</div>

                                <div className="shipname">Shipping Name</div>
                                <div className="price">Price</div>

                                <div className="shipname">Shipping Name</div>
                                <div className="price">Price</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/*Need to copy this content-11-11-2020*/}
                    </Col>
                    <Col xs={24} md={8} lg={8} xl={10} className="employer-right-block ">
                      {loggedInUser.role_slug === langs.key.job ? <div className="add-figure">
                        <div className='company-name active'>
                          <Text ><div className="value">{dashboardDetails.job_total_count}</div><div className="text" style={{ marginTop: "5px" }}>Ads</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{dashboardDetails.job_view_count}</div><div className="text" style={{ marginTop: "5px" }}>Views</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{dashboardDetails.job_apply_count}</div><div className="text">Job Application</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{dashboardDetails.job_interview_count}</div><div className="text" style={{ marginTop: "5px" }}>Interviews</div></Text>
                        </div>
                      </div> : ''}
                      {loggedInUser.role_slug === langs.key.real_estate ? <div className="add-figure">
                        <div className='company-name active'>
                          <Text ><div className="value">{dashboardDetails.ads_total_count}</div><div className="text" style={{ marginTop: "5px" }}>Ads</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{dashboardDetails.total_view_count}</div><div className="text" style={{ marginTop: "5px" }}>Views</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{dashboardDetails.ads_reachout_count}</div><div className="text">Reach outs</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{dashboardDetails.ads_sold_count}</div><div className="text" style={{ marginTop: "5px" }}>Sold</div></Text>
                        </div>
                      </div> : ''}

                      <Card
                        className='pie-chart'
                        title='Performance '
                        extra={<div className="card-header-select"><label>Show:</label>
                          <Select defaultValue="This week" onChange={(e) => {
                            this.getDashBoardDetails('', e, 1, '')

                          }} >
                            <Option value="month">Monthly</Option>
                            <Option value="week">Weekly</Option>
                          </Select></div>}
                      >
                        <div>
                          <Row gutter={15}>
                            <Col xs={24} sm={24} md={24} lg={18} xl={18} >
                              < Pie
                                {...config}
                                hasLegend={false}
                                title="Promotion"
                                subTitle=""
                                total={() => {
                                  let total = this.max_of_three(label1, label2, label3)
                                  return (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: total !== undefined && total ? total + '%' : 0 + '%'
                                        // yuan(salesPieData.reduce((pre, now) => now.y + pre, 0)),
                                      }}
                                    />
                                  )
                                }}
                                data={pieDataChart}
                                colors={['#00FF7F', '#4B0082', '#FFA500	']}
                                valueFormat={val => <div></div>
                                  // <span dangerouslySetInnerHTML={{ 
                                  //   __html: ''
                                  //   //  yuan(val)
                                  //    }}
                                  // />
                                }

                                height={215}
                              />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                              <ul className="pie-right-content">
                                <li className="green">{'View'}</li>
                                <li className="yellow">{loggedInUser.role_slug === langs.key.job ? 'Applications' : 'Reach outs'}</li>
                                <li className="violate">{loggedInUser.role_slug === langs.key.job ? 'Interviews' : 'Sold'}</li>
                              </ul>
                            </Col>
                          </Row>

                        </div>

                      </Card>
                      {loggedInUser.role_slug === langs.key.car_dealer &&
                        <Row gutter={[10, 20]} className="pt-20">
                          <Col md={12} >
                            <div className="dark-orange color-box">
                              <Title level="3">{dashboardDetails.ads_total_count}</Title>
                              <Text> Ads</Text>
                            </div>
                          </Col>
                          <Col md={12} className="">
                            <div className="light-orange color-box">
                              <Title level="3">{dashboardDetails.ads_reachout_count}</Title>
                              <small> Reach <br /> out</small>
                            </div>
                          </Col>
                          <Col md={12} className="">
                            <div className="light-yellow color-box">
                              <Title level="3">{dashboardDetails.total_view_count}</Title>
                              <small> View </small>
                            </div>
                          </Col>
                          <Col md={12} className="">
                            <div className="dark-yellow color-box">
                              <Title level="3">{dashboardDetails.ads_sold_count}</Title>
                              <small> Sold </small>
                            </div>
                          </Col>
                        </Row>}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout >
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null
  };
};
export default connect(
  mapStateToProps,
  { enableLoading, disableLoading, getDashBoardDetails, getTraderProfile }
)(VendorPostAd)