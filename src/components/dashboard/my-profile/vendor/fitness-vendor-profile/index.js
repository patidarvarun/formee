import React, { Fragment } from 'react';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Col, Input, Layout, Avatar, Row, Typography, Button, Menu, Dropdown, Pagination, Card, Tabs, Form, Select, Rate, Alert, Modal, Checkbox } from 'antd';
import { PlusOutlined, UserOutlined, CaretDownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { enableLoading, disableLoading, listCustomerServiceBookings, listCustomerBookingsHistory, getCustomerMyBookingsCalender } from '../../../../../actions'
import AppSidebar from '../../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import './fitness-vendor-profile.less';
import { displayDateTimeFormate, convertTime24To12Hour } from '../../../../../components/common';
import Icon from '../../../../../components/customIcons/customIcons';
import moment from 'moment';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

import { Calendar, Badge } from 'antd';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

const total_count = 20;
function onChange(e) {
  

}
// Pagination
function paginationItemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
  }
  if (type === 'next') {
    return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
  }
  return originalElement;
}

function paginationItemRenderHistory(current, type, originalElement) {
  if (type === 'prev') {
    return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
  }
  if (type === 'next') {
    return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
  }
  return originalElement;
}

class ProfileVendorFitness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      customerBookingList: [],
      page: '1',
      order: 'desc',
      page_size: '10',
      customer_id: '',
      key: 1,
      checked: true,
      customerBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      customerCalenderBookingList: [],
      totalRecordCustomerServiceBooking: 0,
      totalRecordCustomerSpaBookingHistory: 0,
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = e => {
    
    this.setState({
      visible: false,
    });
  };

  /**
    * @method componentDidMount
    * @description called after render the component
    */
  componentDidMount() {
    this.props.enableLoading()
    this.getCustomerServiceBooking(this.state.page);
    this.getBookingsForCalenderDate(this.state.selectedBookingDate);
  }

  onTabChange = (key, type) => {
    if (key == '1') {
      this.getCustomerServiceBooking(1);
    } else {
      this.getCustomerBookingHistory(1);
    }
  }

  getCustomerServiceBooking = (page) => {
    const { id } = this.props.loggedInUser;
    const reqData = {
      page: page,
      order: this.state.order,
      page_size: this.state.page_size,
      customer_id: id
    };

    this.props.listCustomerServiceBookings(reqData, (res) => {
      this.props.disableLoading()
      
      if (res.status === 200) {
        this.setState({ customerBookingList: res.data.data.customer_service_bookings, totalRecordCustomerServiceBooking: res.data.data.total_records ? res.data.data.total_records : 0 })
      }
    })
  }

  handleBookingPageChange = (e) => {
    this.getCustomerServiceBooking(e)
  }

  getCustomerBookingHistory = (page) => {
    const { id } = this.props.loggedInUser;
    const reqData = {
      page: page,
      page_size: this.state.page_size,
      customer_id: id
    };
    this.props.listCustomerBookingsHistory(reqData, (res) => {
      this.props.disableLoading()
      //
      if (res.status === 200) {
        this.setState({ customerBookingHistoryList: res.data.data.customer_service_bookings, totalRecordCustomerSpaBookingHistory: res.data.data.total_records ? res.data.data.total_records : 0 })
        // this.setState({customerBookingHistoryList : []});
      }
    })
  }

  handleHistoryBookingPageChange = (e) => {
    this.getCustomerBookingHistory(e)
  }

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0
  }
  renderUpcomingBooking = () => {
    if (this.state.customerBookingList && this.state.customerBookingList.length > 0) {
      return (
        <Fragment>
          {this.state.customerBookingList.map((value, i) => {
            return (
              <div className="my-new-order-block">
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="fr-tbl-fit-wrap">
                      <table className="fr-fitness-tbl">
                        <tr>
                          <th>Class</th>
                          <th>Room</th>
                          <th>Instructor</th>
                          <th>Capacity</th>
                          <th>Duration</th>
                          <th>Time</th>
                        </tr>
                        <tr>
                          <td>
                            <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="Reformer Pilates">
                              <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                              <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                            </Select>
                          </td>
                          <td>Studio 1</td>
                          <td>Shannon</td>
                          <td>8/30</td>
                          <td>
                            <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="60 mins">
                              <Option value="60mins">60 mins</Option>
                              <Option value="60mins">60 mins</Option>
                            </Select>
                          </td>
                          <td>
                            <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="6:00 pm - 7:00 pm">
                              <Option value="ampm">6:00 pm - 7:00 pm</Option>
                              <Option value="ampm">6:00 pm - 7:00 pm</Option>
                            </Select>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </Col>
                </Row>
              </div>
            )
          })}
          <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleBookingPageChange}
            total={this.state.totalRecordCustomerServiceBooking} //total number of card data available
            itemRender={paginationItemRender}
            className={'mb-20'}
          />
        </Fragment>
      )
    } else {
      return <div>
        <Alert message="No records found." type="error" />
      </div>
    }
  }

  displayReviewRatingSection = (data) => {
    if (data.status == 'Completed' && data.valid_trader_rating != null) {
      return <Rate defaultValue={0.0} />
    } else {
      return <span className="fm-btndeleteicon"><img src={require('../../../../../assets/images/icons/delete.svg')} alt='delete' /><Button type='default' className="success-btn">Upcoming</Button></span>
    }
  }
  displayDoneRatingSection = (data) => {
    if (data.status == 'Completed' && data.valid_trader_rating != null) {
      return <Rate defaultValue={0.0} />
    } else {
      return <span className="fm-btndeleteicon"><img src={require('../../../../../assets/images/icons/delete.svg')} alt='delete' /><Button type='default' className="gray-btn">Done</Button></span>
    }
  }
  getDateFromHours = (bookingDate, startTime) => {
    startTime = startTime.split(':');
    let now = new Date(bookingDate);
    let dateTimeSting = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...startTime);
    return dateTimeSting;
  }

  timestampToString = (date, time, suffix) => {
    let dateString = this.getDateFromHours(date, time);
    let diffTime = (new Date().getTime() - (dateString || 0)) / 1000;
    if (diffTime < 60) {
      diffTime = 'Just now';
    } else if (diffTime > 60 && diffTime < 3600) {
      diffTime =
        Math.floor(diffTime / 60) +
        (Math.floor(diffTime / 60) > 1
          ? suffix
            ? ' minutes'
            : 'm'
          : suffix
            ? ' minute'
            : 'm') +
        (suffix ? ' ago' : '');
    } else if (diffTime > 3600 && diffTime / 3600 < 24) {
      diffTime =
        Math.floor(diffTime / 3600) +
        (Math.floor(diffTime / 3600) > 1
          ? suffix
            ? ' hours'
            : 'h'
          : suffix
            ? ' hour'
            : 'h') +
        (suffix ? ' ago' : '');
    } else if (diffTime > 86400 && diffTime / 86400 < 30) {
      diffTime =
        Math.floor(diffTime / 86400) +
        (Math.floor(diffTime / 86400) > 1
          ? suffix
            ? ' days'
            : 'd'
          : suffix
            ? ' day'
            : 'd') +
        (suffix ? ' ago' : '');
    } else {
      diffTime = new Date(dateString || 0).toDateString();
    }
    return diffTime;
  };
  getBookingsForCalenderDate = (date) => {
    const { id } = this.props.loggedInUser;
    const selectedDate = moment(date).format('YYYY-MM-DD');
    this.setState({
      selectedBookingDate: selectedDate,
    }, () => {
      if (selectedDate) {
        const req = {
          customer_id: id,
          from_date: selectedDate,
          to_date: selectedDate
        }
        this.props.getCustomerMyBookingsCalender(req, this.getCustomerMyBookingsCalenderCallback)
      }
    });
  }

  onChangeBookingDates = (value) => {
    this.getBookingsForCalenderDate(value);
  }

  getCustomerMyBookingsCalenderCallback = (response) => {
    if (response.status === 200 && response.data) {
      this.setState({ customerCalenderBookingList: response.data.data.customer_service_bookings });
    }
  }

  renderBokingCalenderItems = () => {
    const { customerCalenderBookingList } = this.state;

    if (customerCalenderBookingList && customerCalenderBookingList.length > 0) {
      return (
        <ul className="flex-container wrap">
          {customerCalenderBookingList.map((value, i) => {
            return (
              <li>
                <div className="appointments-label">{value.service_sub_bookings[0].wellbeing_trader_service.name}</div>
                {/* <div class="appointments-label">{value.service_sub_bookings[0].wellbeing_trader_service.name}</div> */}
                {/* <div className="appointments-time">{value.start_time}<span><img src={require('../../../assets/images/icons/delete.svg')} alt='delete' /></span></div> */}
                <div className="appointments-time">{convertTime24To12Hour(value.start_time)}</div>
              </li>
            )
          })
          }
        </ul>
      )
    } else {
      return <div className="error-box">
        <Alert message="No Appointments" type="error" />
      </div>

    }
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { selectedBookingDate, customerCalenderBookingList } = this.state

    return (
      <Layout className="event-booking-profile-wrap fm-fitness-vendor-wrap">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box view-class-tab' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section manager-page'>
                  <div className='left'>
                    <Title level={2}>My Bookings</Title>
                  </div>
                  <div className="right"></div>
                </div>
                <div className='sub-head-section'>
                  <Text>&nbsp;</Text>
                </div>
                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking">
                  <Row gutter={30}>
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                      <Card
                        className='profile-content-shadow-box'
                        bordered={false}
                        title='Manage your class calendar'
                      >
                        <div className="fm-vcalender-wrap">
                          <Row className="fm-top-title" align="middle">
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}><h5>14 March 2018</h5></Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12} align="right">
                              <div className="fm-list-icons">
                                <span className="fm-cl-icon"><img src={require('../../../../../assets/images/icons/calendar-icon.svg')} alt='Calendar' /></span>
                                <span className="fm-list-icon"><img src={require('../../../../../assets/images/icons/list-icon.svg')} alt='List' /></span>
                              </div>
                            </Col>
                          </Row>
                          <div className="my-new-order-block">
                            <Row gutter={0}>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="fr-tbl-fit-wrap">
                                  <table className="fr-fitness-tbl">
                                    <tr>
                                      <th>Class</th>
                                      <th>Room</th>
                                      <th>Instructor</th>
                                      <th>Capacity</th>
                                      <th>Duration</th>
                                      <th>Time</th>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="Reformer Pilates">
                                          <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                                          <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                                        </Select>
                                      </td>
                                      <td>Studio 1</td>
                                      <td>Shannon</td>
                                      <td>8/30</td>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="60 mins">
                                          <Option value="60mins">60 mins</Option>
                                          <Option value="60mins">60 mins</Option>
                                        </Select>
                                      </td>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="6:00 pm - 7:00 pm">
                                          <Option value="ampm">6:00 pm - 7:00 pm</Option>
                                          <Option value="ampm">6:00 pm - 7:00 pm</Option>
                                        </Select>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="Reformer Pilates">
                                          <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                                          <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                                        </Select>
                                      </td>
                                      <td>Studio 1</td>
                                      <td>Shannon</td>
                                      <td>8/30</td>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="60 mins">
                                          <Option value="60mins">60 mins</Option>
                                          <Option value="60mins">60 mins</Option>
                                        </Select>
                                      </td>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="6:00 pm - 7:00 pm">
                                          <Option value="ampm">6:00 pm - 7:00 pm</Option>
                                          <Option value="ampm">6:00 pm - 7:00 pm</Option>
                                        </Select>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="Reformer Pilates">
                                          <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                                          <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                                        </Select>
                                      </td>
                                      <td>Studio 1</td>
                                      <td>Shannon</td>
                                      <td>8/30</td>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="60 mins">
                                          <Option value="60mins">60 mins</Option>
                                          <Option value="60mins">60 mins</Option>
                                        </Select>
                                      </td>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="6:00 pm - 7:00 pm">
                                          <Option value="ampm">6:00 pm - 7:00 pm</Option>
                                          <Option value="ampm">6:00 pm - 7:00 pm</Option>
                                        </Select>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="Reformer Pilates">
                                          <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                                          <Option value="reformerPilates">Reformer Pilates - INTRO</Option>
                                        </Select>
                                      </td>
                                      <td>Studio 1</td>
                                      <td>Shannon</td>
                                      <td>8/30</td>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="60 mins">
                                          <Option value="60mins">60 mins</Option>
                                          <Option value="60mins">60 mins</Option>
                                        </Select>
                                      </td>
                                      <td>
                                        <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="6:00 pm - 7:00 pm">
                                          <Option value="ampm">6:00 pm - 7:00 pm</Option>
                                          <Option value="ampm">6:00 pm - 7:00 pm</Option>
                                        </Select>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <div className="fm-repeat-checkbox">
                            <Checkbox onChange={onChange}>Repeat</Checkbox>
                            <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="This week">
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                            </Select>
                          </div>
                          {/* My booking tbl Start */}
                          <div className="fm-mybooking-tbl">
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <h2 className="fm-tdy-heading">Today, December 18</h2>
                              </Col>
                            </Row>
                            <Row className="fm-content-box fm-selected">
                              <Col xs={24} sm={24} md={9} lg={10} xl={10}>
                                <div className="fm-time-box">
                                  6:00 pm - 7:00 pm
                                <span>60 min</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                                <div className="fm-intro-box">
                                  Reformer Pilates - INTRO
                                <span>Shannon / Studio 1</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={5} lg={4} xl={4} align="middle">
                                <div className="fm-rating-box">
                                  <span className="fm-suser-icon"><img src={require('../../../../../assets/images/icons/fm-user-icon.svg')} alt='List' /></span>
                                  <span>2 / 20</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <ul className="fm-field-repeat">
                                  <li><span>1</span> George Fields</li>
                                  <li><span>2</span> George Fields</li>
                                  <li><span>3</span> George Fields</li>
                                  <li><span>4</span> George Fields</li>
                                </ul>
                              </Col>
                            </Row>
                            <Row className="fm-content-box">
                              <Col xs={24} sm={24} md={9} lg={10} xl={10}>
                                <div className="fm-time-box">
                                  6:00 pm - 7:00 pm
                                <span>60 min</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                                <div className="fm-intro-box">
                                  Reformer Pilates - INTRO
                                <span>Shannon / Studio 1</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={5} lg={4} xl={4} align="middle">
                                <div className="fm-rating-box">
                                  <span className="fm-suser-icon"><img src={require('../../../../../assets/images/icons/fm-user-icon.svg')} alt='List' /></span>
                                  <span>2 / 20</span>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          
                          <div className="fm-mybooking-tbl">
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <h2 className="fm-tdy-heading">Today, December 18</h2>
                              </Col>
                            </Row>
                            <Row className="fm-content-box">
                              <Col xs={24} sm={24} md={9} lg={10} xl={10}>
                                <div className="fm-time-box">
                                  6:00 pm - 7:00 pm
                                <span>60 min</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                                <div className="fm-intro-box">
                                  Reformer Pilates - INTRO
                                <span>Shannon / Studio 1</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={5} lg={4} xl={4} align="middle">
                                <div className="fm-rating-box">
                                  <span className="fm-suser-icon"><img src={require('../../../../../assets/images/icons/fm-user-icon.svg')} alt='List' /></span>
                                  <span>2 / 20</span>
                                </div>
                              </Col>
                            </Row>
                            <Row className="fm-content-box">
                              <Col xs={24} sm={24} md={9} lg={10} xl={10}>
                                <div className="fm-time-box">
                                  6:00 pm - 7:00 pm
                                <span>60 min</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                                <div className="fm-intro-box">
                                  Reformer Pilates - INTRO
                                <span>Shannon / Studio 1</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={5} lg={4} xl={4} align="middle">
                                <div className="fm-rating-box">
                                  <span className="fm-suser-icon"><img src={require('../../../../../assets/images/icons/fm-user-icon.svg')} alt='List' /></span>
                                  <span>2 / 20</span>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <div className="fm-mybooking-tbl">
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <h2 className="fm-tdy-heading">Today, December 18</h2>
                              </Col>
                            </Row>
                            <Row className="fm-content-box">
                              <Col xs={24} sm={24} md={9} lg={10} xl={10}>
                                <div className="fm-time-box">
                                  6:00 pm - 7:00 pm
                                <span>60 min</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                                <div className="fm-intro-box">
                                  Reformer Pilates - INTRO
                                <span>Shannon / Studio 1</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={5} lg={4} xl={4} align="middle">
                                <div className="fm-rating-box">
                                  <span className="fm-suser-icon"><img src={require('../../../../../assets/images/icons/fm-user-icon.svg')} alt='List' /></span>
                                  <span>2 / 20</span>
                                </div>
                              </Col>
                            </Row>
                            <Row className="fm-content-box">
                              <Col xs={24} sm={24} md={9} lg={10} xl={10}>
                                <div className="fm-time-box">
                                  6:00 pm - 7:00 pm
                                <span>60 min</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                                <div className="fm-intro-box">
                                  Reformer Pilates - INTRO
                                <span>Shannon / Studio 1</span>
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={5} lg={4} xl={4} align="middle">
                                <div className="fm-rating-box">
                                  <span className="fm-suser-icon"><img src={require('../../../../../assets/images/icons/fm-user-icon.svg')} alt='List' /></span>
                                  <span>2 / 20</span>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          {/* My booking tbl ends */}
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <div className="appointments-slot right-calender-view">
                        <div className="appointments-heading">
                          <div className="date-heading">My Calender</div>
                          <div className="card-header-select"><label>Show:</label>
                            <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="This week">
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                            </Select></div>
                        </div>
                        <Calendar
                          onSelect={this.onChangeBookingDates}
                          fullscreen={false}
                          dateCellRender={this.dateCellRender}
                        />
                      </div>
                      <div className="appointments-slot mt-20">
                        <div className="appointments-heading">
                          <div className="date">{moment(selectedBookingDate).format("MMM D YYYY")}</div>
                          <div className="appointments-count">{customerCalenderBookingList.length} Appointments today</div>
                        </div>
                        <div className="appointments-body">
                          {this.renderBokingCalenderItems()}
                        </div>
                      </div>
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};
export default connect(
  mapStateToProps,
  { listCustomerServiceBookings, listCustomerBookingsHistory, enableLoading, disableLoading, getCustomerMyBookingsCalender }
)(ProfileVendorFitness);