import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Empty, Divider, Progress, Pagination, Layout, Calendar, Card, Typography, Button, Table, Avatar, Row, Col, Input, InputNumber, Select, Modal } from 'antd';
import AppSidebar from '../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../common/History';
import Icon from '../../../components/customIcons/customIcons';
import PostAdPermission from '../../templates/PostAdPermission'
import { getRetailDashboardAPI, enableLoading, disableLoading, getDashBoardDetails, getTraderProfile, } from '../../../actions'
import { convertISOToUtcDateformate, dateFormate, displayDateTimeFormate } from '../../common';
import { Pie, yuan } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import { DEFAULT_IMAGE_TYPE, DASHBOARD_TYPES } from '../../../config/Config';
import { langs } from '../../../config/localization';
import { DASHBOARD_KEYS } from '../../../config/Constant'
import { SearchOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './vendorretail.less'
import moment from 'moment'
import { displayCalenderDate, displayDate, dateFormate3, startTime } from '../../common'
import { getStatusColor } from '../../../config/Helper'


const { Option } = Select;
const { Title, Text } = Typography;
let today = Date.now()
function onChange(value) {

}
/*Vendor Retail Order Recived Pop up 10-11-2020*/
function handleChange(value) {

}

const { TextArea } = Input;
/*Vendor Retail Order Recived Pop up 10-11-2020*/



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
class VendorRetailDashboard extends React.Component {

  /*Vendor Retail Order Recived Pop up 10-11-2020*/
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: moment(today).format('YYYY-MM-DD'),
      index: '',
      calendarView: 'week',
      monthStart: '',
      monthEnd: '',
      weekStart: '',
      weekEnd: '', flag: '',
      selectedMode: 'month',
      startDate: '', endDate: '', search_keyword: ''
    };
  }

  componentDidMount() {
    const { userDetails, loggedInUser } = this.props;
    const { selectedDate, flag, page } = this.state

    if (loggedInUser) {
      this.props.getTraderProfile({ user_id: loggedInUser.id })
      this.getDashBoardDetails(selectedDate, flag, page, '')
    }


    function days(current) {
      var week = new Array();
      // Starting Monday not Sunday 
      var first = ((current.getDate() - current.getDay()));

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
    this.setState({
      selectedDate: selectedDate,
      flag: flag, page: page,
      search_keyword: search_keyword
    })
    const { loggedInUser } = this.props;
    const { monthEnd, monthStart, weekStart, weekEnd } = this.state
    let reqData = {
      user_id: loggedInUser.id,
      from_date: flag === 'week' ? weekStart : flag === 'month' ? monthStart : monthStart ? monthStart : selectedDate,  //This field used only when we need to pass date range, else this will be empty
      to_date: flag === 'week' ? weekEnd : flag === 'month' ? monthEnd : monthEnd ? monthEnd : selectedDate,  //This field used only when we need to pass date range,
      search_keyword: search_keyword ? search_keyword : this.state.search_keyword
    }
    // let reqData = {
    //   "user_id": "449",
    //   "from_date": "2018-09-10",
    //   "to_date": "2020-12-31",
    //   "search_keyword": search_keyword
    // }
    this.props.enableLoading()
    this.props.getRetailDashboardAPI(reqData, (res) => {
      this.props.disableLoading()

      if (res.data && res.data.success && res.data.success.data) {
        this.setState({ dashboardDetails: res.data.success.data, flag: flag })
      }
    })
  }

  /**
 * @method  get DashBoard Details used By calendar view
 * @description get detail   
 */
  getDashBoardDetailsByCalendarView = (start, end, flag, page, search_keyword) => {
    this.setState({ monthStart: start, monthEnd: end, search_keyword: search_keyword })
    const { loggedInUser } = this.props;
    const { selectedDate } = this.state
    let reqData = {
      user_id: loggedInUser.id,
      created_date: '',
      from_date: start ? start : selectedDate,  //This field used only when we need to pass date range, else this will be empty
      to_date: end ? end : selectedDate,  //This field used only when we need to pass date range,
      search_keyword: search_keyword ? search_keyword : this.state.search_keyword
    }
    // let reqData = {
    //   user_id: 449,
    //   from_date: "2018-09-10",
    //   to_date: "2020-12-31",
    //   search_keyword: ""
    // }
    this.props.getRetailDashboardAPI(reqData, (res) => {
      this.props.disableLoading()

      if (res.data && res.data.success && res.data.success.data) {
        this.setState({ dashboardDetails: res.data.success.data, flag: flag })
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
        <div className='month'>
          <ul>
            <li><span>{displayCalenderDate(selectedDate ? selectedDate : Date.now())}</span></li>
          </ul>
        </div>
        <ul className='weekdays'>
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className='days'>
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
   * @method renderChart
   * @description render pie chart
   */
  renderChart = (chartName, item) => {
    let label1 = item && item.pending_count ? Number(item.pending_count) : 0
    let label2 = item && item.shipped_count ? Number(item.shipped_count) : 0
    let label3 = item && item.completed_count ? Number(item.completed_count) : 0
    let label4 = item && item.cancel_count ? Number(item.cancel_count) : 0
    const pieDataChart = [
      {
        x: 'Pending',
        y: item && item.pending_count ? Number(item.pending_count) : 0
      },
      {
        x: 'Shipped',
        y: item && item.shipped_count ? Number(item.shipped_count) : 0
      },
      {
        x: 'Completed',
        y: item && item.completed_count ? Number(item.completed_count) : 0
      },
      {
        x: 'Cancel',
        y: item && item.cancel_count ? Number(item.cancel_count) : 0
      }
    ];
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

    return (
      <Card
        className='pie-chart'
        title={chartName}
        extra={<div className='card-header-select'><label>Show:</label>
          <Select defaultValue='This week' onChange={(e) => {
            this.getDashBoardDetails('', e, 1, '')

          }} >
            <Option value='month'>Monthly</Option>
            <Option value='week'>Weekly</Option>
          </Select></div>}
      >
        <div>
          <Row gutter={15}>
            <Col xs={24} sm={24} md={24} lg={18} xl={18} >
              < Pie
                {...config}
                hasLegend={false}
                title='Shipment'
                subTitle=''
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
                colors={['#00FF7F', '#4B0082', '#FFA500	', '#ee4928']}
                valueFormat={val => <div></div>
                }

                height={215}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
              <ul className='pie-right-content'>
                <li className='yellow'>{'Pending'}</li>
                <li className='violate'>{'Shipped'}</li>
                <li className='green'>{'Completed'}</li>
                <li className='red'>{'Cancel'}</li>
              </ul>
            </Col>
          </Row>

        </div>
      </Card>
    )
  }

  /**
   * @method renderItemListing
   * @description render product item listing 
   */
  renderItemListing = (dashboardDetails) => {
    let temp = [1, 2, 3, 4, 5, 6]
    if (dashboardDetails && dashboardDetails.latest_activity && Array.isArray(dashboardDetails.latest_activity) && dashboardDetails.latest_activity.length) {
      return dashboardDetails.latest_activity.map((el, i) => {
        return (
          <div className='my-new-order-block' key={i}>
            <Row gutter={0}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{ borderRight: '1px solid #E3E9EF' }}>
                <div className='order-profile-detail'>
                  <div className='odr-no'><h2>Orders {el.order_status}</h2></div>
                  <div className='order-profile'>
                    <div className='profile-pic'>
                      <img alt='test' src={el.image ? el.image : 'http://staging.formee.co/formee/upload_images/users/913/14237.jpg'} />
                    </div>
                    <div className='profile-name'>
                      {el.name}
                    </div>
                  </div>
                  <div class='pink-small'><span>{el.category_name}</span><span>{el.sub_category_name}</span></div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                <div className='order-middle-block'>
                  <h2>{el.item_name}</h2>
                  <div className='qty-size'>
                    <div className='qty-size-label'>Qty</div>
                    <div className='qty-size-val'>{el.item_qty}</div>
                  </div>
                  <div className='qty-size'>
                    <div className='qty-size-label'>Size</div>
                    <div className='qty-size-val'>32</div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={5} xl={5} className='align-right'>
                <div className='amt-status-detail'>
                  <div className='amt-big-txt'>{`AU$${parseInt(el.item_price)}`}</div>
                  <Button type='default' className={getStatusColor(el.order_status)}>{el.order_status}</Button>
                  <div className='date'>
                    {el.order_placed_date}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )
      })
    } else {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
  }

  /**
   * @method renderStatisticsCards
   * @description render statistics
   */
  renderStatisticsCards = (item) => {
    return (
      <Row gutter={[10, 20]} className="pt-20">
        <Col md={12} >
          <div className="dark-orange color-box">
            <Title level="3">{item.all_order_count}</Title>
            <Text>{'All Orders'}</Text>
          </div>
        </Col>
        <Col md={12} className="">
          <div className="light-orange color-box">
            <Title level="3">{item.shipped_count}</Title>
            <small> {'Shipped'}</small>
          </div>
        </Col>
        <Col md={12} className="">
          <div className="light-yellow color-box">
            <Title level="3">{item.delivered_package_count}</Title>
            <small> {'Delivered Packages'} </small>
          </div>
        </Col>
        <Col md={12} className="">
          <div className="dark-yellow color-box">
            <Title level="3">{item.exception_count}</Title>
            <small> {'Exception'} </small>
          </div>
        </Col>
      </Row>
    )
  }


  /**
   * @method render
   * @description render component  
   */
  render() {
    const { dashboardDetails, calendarView, selectedMode, monthStart, weekEnd, weekStart, monthEnd, search_keyword } = this.state

    const { loggedInUser } = this.props
    let merchant = loggedInUser.role_slug === langs.key.merchant
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
                      <PostAdPermission title={'Start selling'} />
                    </div>
                  </div>
                </div>
                <div className='employsearch-block'>
                  <div className='employsearch-right-pad'>
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className='search-block'>
                          <Input
                            placeholder='Search Dashboard'
                            prefix={<SearchOutlined className='site-form-item-icon' />}
                            onChange={(e) => {
                              const { selectedDate, flag } = this.state
                              this.getDashBoardDetails(selectedDate, flag, 1, e.target.value)
                            }}
                          />
                        </div>
                      </Col>
                      <Col xs={24} md={8} lg={8} xl={10} className='employer-right-block '>
                        <div className='right-view-text'>
                          <span>{'6'} Views</span><span className='sep'>|</span><span>{dashboardDetails && dashboardDetails.all_order_count} Ads</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className='profile-content-box'>
                  <Row gutter={30}>
                    <Col xs={24} md={16} lg={16} xl={14}>
                      <Card
                        className='dashboard-left-calnder-block'
                        title='Latest Activity'
                        extra={<div className='card-header-select'><label></label>
                          <Select
                            onChange={(e) => {
                              this.setState({ calendarView: e, selectedDate: moment(today).format('YYYY-MM-DD') })
                              if (e === 'week') {
                                let startDate = moment(today).startOf('week').format('YYYY-MM-DD')
                                let endDate = moment(today).endOf('week').format('YYYY-MM-DD')
                                this.getDashBoardDetailsByCalendarView(startDate, endDate, '', 1, search_keyword)
                              } else if (e === 'month') {
                                let startDate = moment(today).startOf('month').format('YYYY-MM-DD')
                                let endDate = moment(today).endOf('month').format('YYYY-MM-DD')
                                this.getDashBoardDetailsByCalendarView(startDate, endDate, '', 1, search_keyword)
                              }
                            }}
                            defaultValue='This week'
                          >
                            <Option value='week'>This week</Option>
                            <Option value='month'>This month</Option>
                          </Select></div>}
                      >
                        <Row>
                          <Col className='gutter-row' md={24}>
                            {calendarView === 'week' ? this.renderCalender() :
                              <Calendar
                                onPanelChange={(e, mode) => {

                                  this.setState({ selectedMode: mode })
                                  let startDate = moment(e).startOf('month').format('YYYY-MM-DD')
                                  let endDate = moment(e).endOf('month').format('YYYY-MM-DD')

                                  this.getDashBoardDetailsByCalendarView(startDate, endDate, '', 1, search_keyword)
                                }}
                                onChange={(e) => {

                                  if (selectedMode === 'month') {

                                    this.setState({ monthEnd: '', monthStart: '', selectedDate: moment(e).format('YYYY-MM-DD') }, () => {
                                      this.getDashBoardDetails(moment(e).format('YYYY-MM-DD'), '', 1, search_keyword)
                                    })

                                  } else {
                                    let startDate = moment(e).startOf('month').format('YYYY-MM-DD')
                                    let endDate = moment(e).endOf('month').format('YYYY-MM-DD')



                                    this.getDashBoardDetailsByCalendarView(startDate, endDate, '', 1, search_keyword)
                                  }
                                }}
                              />}
                          </Col>
                        </Row><Divider /><br />
                        <div className='profile-vendor-retail-orderdetail'>
                          {/* <Col className='gutter-row' md={24}>
                            <div className='odr-no'><h3>8 task completed out of 10</h3></div>
                            <Progress strokeColor={{ '0%': 'rgb(80 234 135)', '100%': 'rgb(80 234 135)' }} trailColor={{ '0%': 'rgb(80 234 135)', '100%': 'rgb(80 234 135)' }} percent={80} showInfo={false} />
                          </Col> */}
                          <br />
                          {this.renderItemListing(dashboardDetails)}
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} md={8} lg={8} xl={10} className='employer-right-block '>
                      {/* <div className='add-figure'>
                        <div className='company-name active'>
                          <Text ><div className='value'>{dashboardDetails && dashboardDetails.all_order_count}</div><div className='text' style={{ marginTop: '5px' }}>All Orders</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className='value'>{dashboardDetails && dashboardDetails.shipped_count}</div><div className='text' style={{ marginTop: '5px' }}>Shipped</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className='value'>{dashboardDetails && dashboardDetails.delivered_package_count}</div><div className='text'>Delivered Packages</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className='value'>{dashboardDetails && dashboardDetails.exception_count}</div><div className='text' style={{ marginTop: '5px' }}>Exception</div></Text>
                        </div>
                      </div> */}
                      {/* {this.renderChart('Shipment', dashboardDetails)}<br/> */}
                      {this.renderChart('Orders Performance', dashboardDetails)}
                      {dashboardDetails && this.renderStatisticsCards(dashboardDetails)}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
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
  { getRetailDashboardAPI, enableLoading, disableLoading, getDashBoardDetails, getTraderProfile }
)(VendorRetailDashboard)