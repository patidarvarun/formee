import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Pagination, Layout, Calendar, Card, Typography, Button, Table, Avatar, Row, Col, Input, InputNumber, Select, Modal, Divider } from 'antd';
import AppSidebar from '../../dashboard-sidebar/DashboardSidebar';
import history from '../../../common/History';
import Icon from '../../customIcons/customIcons';
import PostAdPermission from '../../classified-templates/PostAdPermission'
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
class VendorRetailInvoice extends React.Component {

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
                    <Col xs={24} md={16} lg={24} xl={24}>
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

                        {/*Need to copy this content-11-11-2020*/}
                        <div className="profile-vendor-retail-orderdetail">

                          <div
                            style={{
                              width: "100%",
                              maxWidth: "600px",
                              fontStyle: "normal",
                              fontWeight: "normal",
                              fontSize: "10px",
                              color: "#828691",
                              margin: "0 auto",
                              padding: "45px 58px 1px",
                              fontSize: "10px",
                              lineHeight: "1.5715",
                              wordWrap: "break-word",
                              filter: "none",
                              borderRadius: "0",
                              paddingTop: "1rem",
                            }}>
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24}>
                                <Row>
                                  <Col xs={24} sm={24} md={12} lg={12}>
                                    <div>
                                      <img src={require('../../../assets/images/formee-logo.png')} alt='Formee' />
                                    </div>
                                  </Col>
                                  <Col xs={24} sm={24} md={12} lg={12}>
                                    <div style={{ textAlign: "right" }}>
                                      <div>
                                        <p style={{ margin: "0" }}>YOUR COMPANY</p>
                                        <p style={{ margin: "0" }}>1331 Hart Ridge Road</p>
                                        <p style={{ margin: "0" }}>48436 Gaines, MI</p>
                                        <p style={{ margin: "0" }}>VAT no.: 987654321</p>
                                      </div>
                                      <div style={{ marginTop: "12px" }}>
                                        <p style={{ margin: "0" }}><span style={{ color: "#EE4928", marginRight: "10px" }}>@</span><a href="mailto:your.mail@gmail.com" style={{ color: "#828691" }}>your.mail@gmail.com</a></p>
                                        <p style={{ margin: "0" }}><span style={{ color: "#EE4928", marginRight: "10px" }}>m</span><a href="tel:+386 989 271 3115" style={{ color: "#828691" }}>+386 989 271 3115</a></p>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                                <div style={{
                                  marginTop: "30px",
                                  marginBottom: "36px",
                                }}>
                                  <Row>
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                      <div>
                                        <b style={{
                                          color: "#000",
                                          marginBottom: "12px",
                                          display: "block",
                                        }}>RECIPIENT</b>
                                        <p style={{ margin: "0" }}>JOHN SMITH</p>
                                        <p style={{ margin: "0" }}>4304 Liberty Avenue</p>
                                        <p style={{ margin: "0" }}>92680 Tustin, CA</p>
                                        <p style={{ margin: "0" }}>VAT no.: 12345678</p>

                                        <div style={{ marginTop: "12px", }}>
                                          <p style={{ margin: "0" }}><span style={{ color: "#50B9FB", marginRight: "10px", }}>@</span><a href="mailto:your.mail@gmail.com" style={{ color: "#828691" }}>your.mail@gmail.com</a></p>
                                          <p style={{ margin: "0" }}><span style={{ color: "#50B9FB", marginRight: "10px", }}>m</span><a href="tel:+386 989 271 3115" style={{ color: "#828691" }}>+386 989 271 3115</a></p>
                                        </div>
                                      </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                      <div style={{ textAlign: "right" }}>
                                        <div>
                                          <h2 style={{
                                            marginTop: "0",
                                            lineHeight: "22px",
                                            marginBottom: "16px",
                                            color: "#000",
                                          }}>Invoice</h2>
                                          <div>
                                            <p style={{
                                              color: "#000",
                                              textTransform: "uppercase",
                                              marginTop: "11px",
                                            }}>invoice no.</p>
                                            <p>001/2018</p>
                                          </div>
                                          <div>
                                            <p style={{
                                              color: "#000",
                                              textTransform: "uppercase",
                                              marginTop: "11px",
                                            }}>invoice o.</p>
                                            <p>001/2018</p>
                                          </div>
                                        </div>
                                      </div>
                                    </Col>

                                  </Row>
                                </div>

                              </Col>
                            </Row>
                            <div
                              style={{
                                background: "#fff",
                                marginLeft: "-58px",
                                marginRight: "-58px",
                                paddingLeft: "58px",
                                paddingRight: "58px",
                                paddingTop: "18px",
                              }}
                            >
                              <Row>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                  <div style={{
                                    borderColor: "transparent",
                                    padding: "0",
                                    marginBottom: "0",
                                    border: "none",
                                    boxShadow: "none",
                                  }}>

                                    <div style={{
                                      padding: "15px 0 0 0",
                                    }}>
                                      <div style={{ minHeight: "0.1%", overflowX: "auto" }}>
                                        <table style={{
                                          width: "100%",
                                          maxWidth: "100%",
                                          marginBottom: "20px",
                                        }}>
                                          <thead>
                                            <tr>
                                              <td style={{ color: "#9DA8BB", paddingBottom: "17px", borderBottom: "none", }}><strong>TASK DESCRIPTION</strong></td>
                                              <td style={{ color: "#9DA8BB", paddingBottom: "17px", borderBottom: "none", textAlign: "left" }} ><strong>Price</strong></td>
                                              <td style={{ color: "#9DA8BB", paddingBottom: "17px", borderBottom: "none", textAlign: "left" }} ><strong>Quantity</strong></td>
                                              <td style={{ color: "#9DA8BB", paddingBottom: "17px", borderBottom: "none", textAlign: "right" }} ><strong>Totals</strong></td>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr style={{ color: " #1F2229", }}>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left" }}>BS-200</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left", color: "rgb(31, 34, 41)" }}>$10.99</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left" }}>1</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "Right" }}>$10.99</td>
                                            </tr>
                                            <tr style={{ color: " #1F2229", }}>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left" }}>BS-200</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left", color: "rgb(31, 34, 41)" }}>$10.99</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left" }}>1</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "Right" }}>$10.99</td>
                                            </tr>
                                            <tr style={{ color: " #1F2229", }}>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left" }}>BS-200</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left", color: "rgb(31, 34, 41)" }}>$10.99</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "left" }}>1</td>
                                              <td style={{ padding: "8px", lineHeight: "1.42857143", verticalAlign: "top", borderTop: "1px solid #ddd", textAlign: "Right" }}>$10.99</td>
                                            </tr>
                                            <tr>
                                              <td style={{ borderTop: " 1px solid #E7E8EC", }}></td>
                                              <td style={{ borderTop: " 1px solid #E7E8EC", }}></td>
                                              <td
                                                className="thick-line text-center gray top-bdr"
                                                style={{
                                                  borderBottom: "none", textAlign: "center", color: "#9DA8BB",
                                                  fontWeight: "600",
                                                  borderTop: " 1px solid #E7E8EC",
                                                  padding: "5px",
                                                }}
                                              ><strong>Subtotal</strong></td>
                                              <td
                                                style={{
                                                  borderBottom: "none",
                                                  textAlign: "right",
                                                  color: "#1F2229",
                                                  padding: "7px 5px",
                                                  fontWeight: "300",
                                                  borderTop: " 1px solid #E7E8EC",
                                                }}
                                              >$670.99</td>
                                            </tr>
                                            <tr>
                                              <td style={{ borderBottom: "none", }}></td>
                                              <td style={{ borderBottom: "none", }}></td>
                                              <td className="no-line text-center gray top-bdr" style={{
                                                borderBottom: "none", textAlign: "center", color: "#9DA8BB",
                                                fontWeight: "600",
                                                borderTop: " 1px solid #E7E8EC",
                                                padding: "5px",
                                              }}><strong>DISCOUNT 5%</strong></td>
                                              <td
                                                style={{
                                                  borderBottom: "none", textAlign: "right",
                                                  color: "#1F2229",
                                                  padding: "7px 5px",
                                                  fontWeight: "300",
                                                  borderTop: " 1px solid #E7E8EC",
                                                  padding: "5px",
                                                }}

                                              > $15</td>
                                            </tr>
                                            <tr>
                                              <td style={{ borderBottom: "none", }}></td>
                                              <td style={{ borderBottom: "none", }}></td>
                                              <td

                                                style={{
                                                  borderBottom: "none", textAlign: "center",
                                                  fontWeight: "600",
                                                  borderTop: " 1px solid #E7E8EC",
                                                  color: "#1F2229",
                                                  padding: "5px"
                                                }}

                                              ><strong>Total</strong></td>
                                              <td
                                                style={{
                                                  borderBottom: "none", textAlign: "right",
                                                  fontWeight: "600",
                                                  borderTop: " 1px solid #E7E8EC",
                                                  color: "#EE4928",
                                                }}

                                              >$685.99</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      color: "#828691",
                                      textAlign: "right",
                                      marginTop: "15px",

                                    }}
                                  >
                                    <p style={{
                                      marginTop: "0",
                                      marginBottom: "1em",
                                    }}>Transfer the amount to the business account below. Please include invoice number on your check.</p>
                                    <div style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}>
                                      <div style={{
                                        color: "#9DA8BB",
                                        fontWeight: "600",
                                        paddingLeft: "29px",
                                      }}>BANK: <span style={{ color: "#1F2229", }}>FTSBUS33</span></div>
                                      <div style={{
                                        width: "32px",

                                        textAlign: "center"
                                      }}>
                                        <div
                                          style={{
                                            width: "3px",
                                            height: "3px",
                                            background: "#EE4928",
                                            borderRadius: "100px",
                                            margin: "7px auto"

                                          }}
                                        ></div>


                                      </div>

                                      <div

                                        style={{
                                          color: "#9DA8BB",
                                          fontWeight: "600",
                                          paddingLeft: "0",
                                          position: "relative",
                                        }}
                                      >IBAN: <span style={{ color: "#1F2229", }}>GB82-1111-2222-3333</span></div>
                                    </div>

                                  </div>
                                  <div style={{ marginTop: "30px", }}>
                                    <h2 style={{
                                      fontWeight: "600",
                                      color: "#1F2229",
                                      margin: "0",
                                      padding: "0",
                                      marginBottom: "19px",
                                      fontSize: "8px",
                                    }}>NOTES</h2>
                                    <p style={{ margin: "0", marginBottom: "12px", }}>All amounts are in dollars. Please make the payment within 15 days from the issue of date of this invoice. Tax is not charged on the basis of paragraph 1 of Article 94 of the Value Added Tax Act (I am not liable for VAT).</p>
                                    <p style={{ margin: "0", }}>Thank you for you confidence in my work.<br />
                              Signiture</p>

                                    <div style={{
                                      display: "flex",
                                      marginTop: "44px",
                                      borderTop: "1px solid #E7E8EC",
                                      padding: "17px 0 15px 0",
                                    }}>
                                      <div className="name" style={{
                                        marginBottom: "3px",
                                      }}>
                                        <p style={{
                                          marginBottom: "3px",
                                        }}>YOUR COMPANY</p>
                                        <p style={{
                                          marginBottom: "3px",
                                        }}>1331 Hart Ridge Road, 48436 Gaines, MI</p>
                                      </div>
                                      <div className="email" style={{
                                        padding: "0 20px",
                                      }}>
                                        <div >
                                          <p><span style={{ color: " #EE4928", marginRight: "10px", }}>@</span><a href="mailto:your.mail@gmail.com" style={{ color: "#828691" }}>your.mail@gmail.com</a></p>
                                          <p><span style={{ color: " #EE4928", marginRight: "10px", }}>m</span><a href="tel:+386 989 271 3115" style={{ color: "#828691" }}>+386 989 271 3115</a></p>
                                        </div>
                                      </div>
                                      <div className="address">
                                        <p>The company is registered in the business register under no. 87650000</p>

                                      </div>
                                    </div>

                                  </div>
                                </Col>
                              </Row>
                            </div>


                            <div
                              style={{
                                padding: "30px 0",
                                /* text-align: right, */
                                background: "transparent",
                                marginTop: "15px",
                                borderRadius: "0 0 2px 2px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: " #fff",
                              }}
                            >
                              <div

                                style={{
                                  fontSize: "14px",
                                  color: " #55636D",
                                  width: "100%",
                                  textAlign: "left",

                                }}
                              >Send Invoice to Admin</div>
                              <button
                                type="button" class="ant-btn sned-btn ant-btn-primary"
                                style={{
                                  fontFamily: "'Poppins', sans- serif",
                                  fontSize: "13px",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  boxShadow: "0 0 12px 1px rgba(144, 168, 190, 0.23)",
                                  fontWeight: "300",
                                  minWidth: "auto",
                                  height: "auto",
                                  width: "162px",
                                  background: "#EE4928",
                                  display: "inline-block",
                                  verticalAlign: "middle",
                                  padding: "8px 0",
                                  border: "#EE4928 2px solid",
                                  marginLeft: "15px",
                                }}
                              ><span>Send</span></button></div>

                          </div>
                          <Modal
                            title=""
                            visible={this.state.visible}
                            className="custom-modal prf-vend-view-invoice"
                            style={{ display: "none" }}
                            footer={[
                              <div className="invoice-text">Send Invoice to Admin</div>,
                              <Button key="3" type="primary" className="sned-btn">
                                Send
                              </Button>
                            ]}

                          >
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24}>
                                <Row>
                                  <Col xs={24} sm={24} md={12} lg={12}>
                                    <div>
                                      <img src={require('../../../assets/images/formee-logo.png')} alt='Formee' />
                                    </div>
                                  </Col>
                                  <Col xs={24} sm={24} md={12} lg={12}>
                                    <div className="text-right">
                                      <div>
                                        <p>YOUR COMPANY</p>
                                        <p>1331 Hart Ridge Road</p>
                                        <p>48436 Gaines, MI</p>
                                        <p>VAT no.: 987654321</p>
                                      </div>
                                      <div className="mail-mobile-detail">
                                        <p><span>@</span><a href="mailto:your.mail@gmail.com" style={{ color: "#828691" }}>your.mail@gmail.com</a></p>
                                        <p><span>m</span><a href="tel:+386 989 271 3115" style={{ color: "#828691" }}>+386 989 271 3115</a></p>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                                <div className="invoice-block">
                                  <Row>
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                      <div className="left-block">
                                        <b>RECIPIENT</b>
                                        <p>JOHN SMITH</p>
                                        <p>4304 Liberty Avenue</p>
                                        <p>92680 Tustin, CA</p>
                                        <p>VAT no.: 12345678</p>

                                        <div className="mail-mobile-detail">
                                          <p><span>@</span><a href="mailto:your.mail@gmail.com" style={{ color: "#828691" }}>your.mail@gmail.com</a></p>
                                          <p><span>m</span><a href="tel:+386 989 271 3115" style={{ color: "#828691" }}>+386 989 271 3115</a></p>
                                        </div>
                                      </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                      <div className="right-block text-right">
                                        <div>
                                          <h2>Invoice</h2>
                                          <div className="inv-detail">
                                            <p className="bold">invoice no.</p>
                                            <p>001/2018</p>
                                          </div>
                                          <div className="inv-detail">
                                            <p className="bold">invoice no.</p>
                                            <p>001/2018</p>
                                          </div>
                                        </div>
                                      </div>
                                    </Col>

                                  </Row>
                                </div>

                              </Col>
                            </Row>
                            <div className="summary-block">
                              <Row>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                  <div className="panel panel-default">

                                    <div className="panel-body">
                                      <div className="table-responsive">
                                        <table className="table table-condensed">
                                          <thead>
                                            <tr>
                                              <td><strong>TASK DESCRIPTION</strong></td>
                                              <td className="text-center"><strong>Price</strong></td>
                                              <td className="text-center"><strong>Quantity</strong></td>
                                              <td className="text-right"><strong>Totals</strong></td>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>BS-200</td>
                                              <td className="text-center">$10.99</td>
                                              <td className="text-center">1</td>
                                              <td className="text-right">$10.99</td>
                                            </tr>
                                            <tr>
                                              <td>BS-400</td>
                                              <td className="text-center">$20.00</td>
                                              <td className="text-center">3</td>
                                              <td className="text-right">$60.00</td>
                                            </tr>
                                            <tr>
                                              <td>BS-1000</td>
                                              <td className="text-center">$600.00</td>
                                              <td className="text-center">1</td>
                                              <td className="text-right">$600.00</td>
                                            </tr>
                                            <tr>
                                              <td className="thick-line"></td>
                                              <td className="thick-line"></td>
                                              <td className="thick-line text-center gray top-bdr"><strong>Subtotal</strong></td>
                                              <td className="thick-line text-right top-bdr">$670.99</td>
                                            </tr>
                                            <tr>
                                              <td className="no-line"></td>
                                              <td className="no-line"></td>
                                              <td className="no-line text-center gray top-bdr"><strong>DISCOUNT 5%</strong></td>
                                              <td className="no-line text-right top-bdr">$15</td>
                                            </tr>
                                            <tr>
                                              <td className="no-line"></td>
                                              <td className="no-line"></td>
                                              <td className="no-line text-center total top-bdr"><strong>Total</strong></td>
                                              <td className="no-line text-right price top-bdr">$685.99</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bank-ibn-detail">
                                    <p>Transfer the amount to the business account below. Please include invoice number on your check.</p>
                                    <div className="bank-ibn-detail-flex">
                                      <div>BANK: <span>FTSBUS33</span></div>
                                      <div className="ibn">IBAN: <span>GB82-1111-2222-3333</span></div>
                                    </div>

                                  </div>
                                  <div className="notes">
                                    <h2>NOTES</h2>
                                    <p>All amounts are in dollars. Please make the payment within 15 days from the issue of date of this invoice. Tax is not charged on the basis of paragraph 1 of Article 94 of the Value Added Tax Act (I am not liable for VAT).</p>
                                    <p>Thank you for you confidence in my work.<br />
                              Signiture</p>

                                    <div className="company-block">
                                      <div className="name">
                                        <p>YOUR COMPANY</p>
                                        <p>1331 Hart Ridge Road, 48436 Gaines, MI</p>
                                      </div>
                                      <div className="email">
                                        <div className="mail-mobile-detail mt-0">
                                          <p><span>@</span><a href="mailto:your.mail@gmail.com">your.mail@gmail.com</a></p>
                                          <p><span>m</span><a href="tel:+386 989 271 3115">+386 989 271 3115</a></p>
                                        </div>
                                      </div>
                                      <div className="address">
                                        <p>The company is registered in the business register under no. 87650000</p>

                                      </div>
                                    </div>

                                  </div>
                                </Col>
                              </Row>
                            </div>


                          </Modal>

                        </div>

                        {/*Need to copy this content-11-11-2020*/}

                      </Card>


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
)(VendorRetailInvoice)