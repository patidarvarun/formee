import React, { Fragment } from 'react';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Col, Divider, Input, Layout, Avatar, Row, Typography, Button, Menu, Dropdown, Pagination, Card, Tabs, Form, Select, Rate, Alert, Modal } from 'antd';
import { PlusOutlined, UserOutlined, CaretDownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { enableLoading, disableLoading, listCustomerServiceBookings, listCustomerBookingsHistory, getCustomerMyBookingsCalender } from '../../../../../actions'
import AppSidebar from '../../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import './profile-vendor-restaurant.less';
import { displayDateTimeFormate, convertTime24To12Hour } from '../../../../../components/common';
import { STATUS_CODES } from '../../../../../config/StatusCode';
import Icon from '../../../../../components/customIcons/customIcons';
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from '../../../../../config/Config';
import { langs } from '../../../../../config/localization';
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

class ProfileVendorRestaurant extends React.Component {
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
                  <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <div className="odr-no"><h4>{value.status}</h4><span className="pickup">{value.service_sub_bookings[0].wellbeing_trader_service.name}</span></div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img alt="test" src={value.trader_user.image ? value.trader_user.image : require('../../../../../assets/images/avatar3.png')} />
                      </div>
                      <div className="profile-name">
                        {value.trader_user.business_name}
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8} className="align-right">
                    <div className="fm-waiting-time">
                      <span><img src={require('../../../../../assets/images/icons/waiting-red-icon.svg')} alt='waiting' /> 0:12</span>
                    </div>
                  </Col>
                  {/* <Link to={`/spa/customer-booking-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>

                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <div className="fm-total-price">
                      <span> Total $37.50</span>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8} className="align-right">
                    {this.displayReviewRatingSection(value)}
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
      return <span className="fm-btndeleteicon"><img src={require('../../../../../assets/images/icons/delete.svg')} alt='delete' /><Button type='default' className="pending-btn">Pending</Button></span>
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

  renderHistoryBooking = () => {
    if (this.state.customerBookingHistoryList && this.state.customerBookingHistoryList.length > 0) {
      return (
        <Fragment>
          {this.state.customerBookingHistoryList.map((value, i) => {
            return (
              <div className="my-new-order-block">
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <div className="odr-no"><h4>{value.status}</h4><span className="pickup">{value.service_sub_bookings[0].wellbeing_trader_service.name}</span></div>
                    <div className="order-profile">
                      <div className="profile-pic">
                        <img alt="test" src={value.trader_user.image ? value.trader_user.image : require('../../../../../assets/images/avatar3.png')} />
                      </div>
                      <div className="profile-name">
                        {value.trader_user.business_name}
                      </div>
                    </div>
                    <div>
                      <div className="orange-small"><span>{value.category_name ? value.category_name : 'N/A'}</span><span>{value.sub_category_name ? value.sub_category_name : 'N/A'}</span></div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={6} xl={6} className="align-right">
                    <div className="bokng-hsty-hour-price">
                      <div className="fm-day-ago">4 hours ago</div>
                      <div className="price">${value.total_amount}</div>
                      {this.displayDoneRatingSection(value)}
                    </div>
                  </Col>
                  {/* <Link to={`/spa/customer-booking-history-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
              </div>
            )
          })
          }
          <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleHistoryBookingPageChange}
            total={this.state.totalRecordCustomerSpaBookingHistory} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={'mb-20'}
          />
        </Fragment >
      )
    } else {
      return <div>
        <Alert message="No records found." type="error" />
      </div>
    }
  }

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
      <Layout className="event-booking-profile-wrap fm-restaurant-vendor-wrap">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box view-class-tab' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section manager-page'>
                  <div className='left'>
                    <Title level={2}>My Bookings</Title>
                  </div>
                  <div className="right"><Button className="orange-btn">My Dashboard</Button></div>
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
                        title=''
                      >
                        <Tabs onChange={this.onTabChange} defaultActiveKey="1">
                          <TabPane tab="New Orders" key="1">
                            <h3>You have {this.state.totalRecordCustomerServiceBooking} appointment in total</h3>
                            {this.renderUpcomingBooking()}
                          </TabPane>
                          <TabPane tab="On Going" key="2">
                            <h3>You have {this.state.totalRecordCustomerSpaBookingHistory} jobs done</h3>
                            {this.renderHistoryBooking()}
                          </TabPane>
                          <TabPane tab="Delivery" key="3">
                            <h3>You have {this.state.totalRecordCustomerSpaBookingHistory} jobs done</h3>
                            {this.renderHistoryBooking()}
                          </TabPane>
                          <TabPane tab="Past" key="4">
                            <h3>You have {this.state.totalRecordCustomerSpaBookingHistory} jobs done</h3>
                            {this.renderHistoryBooking()}
                          </TabPane>
                        </Tabs>
                        <div className="card-header-select"><label>Show:</label>
                          <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="This week">
                            <Option value="week">This week</Option>
                            <Option value="month">This month</Option>
                          </Select></div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <div className="your-order-block">
                        <h2>Your order</h2>
                        <div className="profile-name-pic-detail">
                          <div>From</div>
                          <div className="profile-pic">
                            <img alt="test" src={require('../../../../../assets/images/avatar3.png')} />

                          </div>
                          <div className="profile-name">
                            George Fields
                            </div>
                        </div>
                        <Divider />
                        <div className="order-list">
                          <div className="count">1</div>
                          <div className="order-name">Teriyaki Chicken</div>
                          <div className="order-proce">$12.50</div>
                        </div>
                        <div className="order-list">
                          <div className="count">2</div>
                          <div className="order-name">Chicken noodle</div>
                          <div className="order-proce">$10.50</div>
                        </div>
                        <div className="order-list">
                          <div className="count">1</div>
                          <div className="order-name">Steam Broccoli with Sesame Sauce</div>
                          <div className="order-proce">$9.50</div>
                        </div>
                        <Divider />
                        <div className="order-total">
                          <div className="item">Item (3)</div>
                          <div className="amount">$132.50</div>
                        </div>
                        <div className="order-total">
                          <div className="item">Fee</div>
                          <div className="amount">$5.50</div>
                        </div>
                        <div className="order-total">
                          <div className="item total">Total</div>
                          <div className="amount total-amount">
                            $5.50
                              <span>Taxes & fees included</span>
                          </div>
                        </div>
                        <div className="btn-block">
                          <Button
                            type='default'
                            className="purple "
                          >
                            Accept Order
                            </Button>
                          <Button
                            type='default'
                            className="lght-orange ml-10"
                          >
                            CANCEL ORDER
                            </Button>
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
)(ProfileVendorRestaurant);