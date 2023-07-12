import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Layout, Row, Typography, Button, Card, Modal, Select } from 'antd';
import { enableLoading, disableLoading, getVendorWellBeingMonthBookingsCalender, vendorChangeSlotStatus } from '../../../../../../actions'
import AppSidebar from '../../../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../../../common/History';
import './mybooking.less';
import { convertTime12To24Hour, displayCalenderDate, displayDate } from '../../../../../common';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Calendar, Badge } from 'antd';
import { VENDOR_CALENDER_BOOKING } from './SampleAPIResponse';
import { DASHBOARD_KEYS } from '../../../../../../config/Constant';

import { toastr } from 'react-redux-toastr';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
const { Option } = Select;
const { Title, Text } = Typography;
class VendorSpaMyBookingCalender extends React.Component {
  calendarComponentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      vendorSpaBookingList: [],
      page: '1',
      order: 'desc',
      page_size: '10',
      customer_id: '',
      key: 1,
      vendorSpaBookingHistoryList: [],
      defaultCurrent: 1,
      selectedBookingDate: new Date(),
      vendorCalenderBookingList: [],
      totalRecordVendorSpaBooking: 0,
      totalRecordVendorSpaBookingHistory: 0,
      vendorAllDayCalenderBookingList: [],
      amTimeSlotArray: [],
      pmTimeSlotArray: [],
      selectedTimeIndex: '',
      bookingTimeSlot: '',
      slotStatus: '',
      fullCalenderData: [],
      weeklyDates: [],
      calenderView: 'month',
    };
  }

  /**
    * @method componentDidMount
    * @description called after render the component
    */
  componentDidMount() {
    this.props.enableLoading();
    this.getBookingsForCalenderDate(this.state.selectedBookingDate);
  }


  createWeekCalender = () => {
    let curr = new Date();
    let weekArray = []
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i
      let day = new Date(curr.setDate(first));
      weekArray.push(day)
    }
    let newWeekDatesArray = weekArray.map(d => d.toString());
    this.setState({
      weeklyDates: newWeekDatesArray
    });
  }


  renderCalender = () => {
    const { weeklyDates, selectedBookingDate } = this.state
    return (
      <div>
        <div className="month">
          <ul>
            <li><span>{displayCalenderDate(selectedBookingDate ? selectedBookingDate : Date.now())}</span></li>
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
          {weeklyDates.length && this.renderDates(weeklyDates)}
        </ul>
      </div>
    )
  }


  renderDates = (dates) => {
    const { selectedBookingDate, index } = this.state
    return dates.map((el, i) => {
      let selectedDate = selectedBookingDate;
      let clickedDate = moment(new Date(el)).format('YYYY-MM-DD');

      return (
        <li key={`${i}_weekly_date`} onClick={() => {
          this.setState({ index: i, selectedBookingDate: moment(new Date(el)).format('YYYY-MM-DD') }, () => {
            this.getBookingsForCalenderDate(el);
          });
        }} style={{ cursor: 'pointer' }}>
          <span className={selectedDate == clickedDate ? 'active' : ''}>{displayDate(el)}</span>
        </li>
      )
    })
  }


  getBookingsForCalenderDate = (date) => {
    const { id } = this.props.loggedInUser;
    const selectedDate = moment(date).format('YYYY-MM-DD');
    this.setState({
      selectedBookingDate: selectedDate,
      selectedTimeIndex: '',
      amTimeSlotArray: [],
      pmTimeSlotArray: []
    }, () => {
      if (selectedDate) {
        this.props.enableLoading();
        const req = {
          user_id: id,
          date: selectedDate,
        }
        this.props.getVendorWellBeingMonthBookingsCalender(req, this.getVendorWellBeingMonthBookingsCalenderCallback)
      }
    });
  }


  onChangeBookingDates = (value) => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate(moment(value).format('YYYY-MM-DD')); // call a method on the Calendar object
    this.getBookingsForCalenderDate(value);
  }

  getVendorWellBeingMonthBookingsCalenderCallback = (response) => {
    
    this.props.disableLoading();
    if (response.status === 200 && response.data) {
      const { month_slots } = response.data;
      const allowed = [this.state.selectedBookingDate];
      const selectedDateSlots = Object.keys(month_slots)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = month_slots[key];
          return obj;
        }, {});
      const timeSlotArray = selectedDateSlots[this.state.selectedBookingDate].slots;

      let regex = /\./g
      let formatedTimeSlotArray = timeSlotArray.map(dots => {
        return {
          time: dots.time.replace(regex, '\:'),
          occupied_by: dots.occupied_by
        }
      });
      let amSlotArray = [];
      let pmSlotArray = [];

      formatedTimeSlotArray.map(value => {
        if (value.time.indexOf("AM") > -1 || value.time.indexOf("am") > -1) {
          amSlotArray.push(value);
        } else if (value.time.indexOf("PM") > -1 || value.time.indexOf("pm") > -1) {
          pmSlotArray.push(value);
        }
      });
      //let bookingData = this.getCalenderBookingDataFilter(VENDOR_CALENDER_BOOKING.service_bookings, this.state.selectedBookingDate)
      let bookingData = this.getCalenderBookingDataFilter(response.data.service_bookings, this.state.selectedBookingDate);
      //
      let fullCalenderData = [];
      bookingData.selectedDateData.length > 0 && bookingData.selectedDateData[0].bookings.length > 0 && bookingData.selectedDateData[0].bookings.map(item => {
        fullCalenderData.push({ title: `Appointment with ${item.customer.name}`, description: 'asdasd', start: `${item.booking_date} ${item.start_time}`, end: `${item.booking_date} ${item.end_time}` });
      });
      this.setState({ amTimeSlotArray: amSlotArray, pmTimeSlotArray: pmSlotArray, vendorCalenderBookingList: bookingData.selectedDateData, vendorAllDayCalenderBookingList: bookingData.allDayData, fullCalenderData: fullCalenderData });
    }
  }

  getCalenderBookingDataFilter = (vendorCalenderBookingList, selectedBookingDate) => {
    let dataArray = [];
    let completArray = []
    for (let key in vendorCalenderBookingList) {
      if (moment(key).isSame(selectedBookingDate)) {
        dataArray.push({ date: key, bookings: vendorCalenderBookingList[key] });
      }
      completArray.push({ date: key, bookings: vendorCalenderBookingList[key] })
    }
    return { 'selectedDateData': dataArray, 'allDayData': completArray };
  }

  dateCellRender = (value) => {
    const listData = this.state.vendorAllDayCalenderBookingList;
    return (
      <span className="events">
        {listData.map(item => {
          let formatedCalanderDate = moment(value).format('YYYY-MM-DD');
          if (moment(item.date).isSame(formatedCalanderDate) && item.bookings.length > 0) {
            return <Badge status={'error'} />
          }
        })}
      </span>
    );
  }

  confirmReleaseSlot = (status, selectedTime) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want really release this time slot?',
      okText: 'OK',
      cancelText: 'CANCEL',
      onOk: () => this.confirmChangeSlotStatus(status, selectedTime),
    });
  }

  confirmChangeSlotStatus = (status, selectedTime) => {
    const { id } = this.props.loggedInUser;
    let formatedTimeSlot = convertTime12To24Hour(selectedTime);
    const req = {
      close_date: this.state.selectedBookingDate,
      user_id: id,
      slots: [formatedTimeSlot],
      status: status
    }
    //
    this.props.enableLoading();
    this.props.vendorChangeSlotStatus(req, this.vendorChangeSlotStatusCalback)
  }

  vendorChangeSlotStatusCalback = (response) => {
    //
    this.props.disableLoading();
    if (response.status === 200) {
      this.getBookingsForCalenderDate(this.state.selectedBookingDate);
      toastr.success('Success', 'Booking time slot status has been updated successfully.');
    } else {
      toastr.error('Error', 'Something went wrong to updat the time slot status.');
    }
  }

  onTimeSlotSelect = (selectedTimeIndex, selectedTime, status, isOccupied) => {
    this.setState({ slotStatus: status, bookingTimeSlot: selectedTime, selectedTimeIndex: selectedTimeIndex })
    if (isOccupied === 'service_booking') {
      this.confirmReleaseSlot(status, selectedTime);
    } else {
      this.confirmChangeSlotStatus(status, selectedTime);
    }
  }

  customEventRender = (info) => {
    return <div style={{ backgroundColor: 'green', borderRightColor: 'yellow' }}>{info.event.title}</div>;
  };

  onChangeCalenderView = (view) => {
    this.setState({ calenderView: view, selectedBookingDate: moment(new Date()).format('YYYY-MM-DD') }, () => {
      if (view == 'week') {
        this.createWeekCalender();
      }
      this.getBookingsForCalenderDate(new Date());
    });
  }


  /**
    * @method render
    * @description render component  
    */
  render() {
    const { selectedBookingDate, vendorCalenderBookingList, amTimeSlotArray, pmTimeSlotArray, fullCalenderData, calenderView } = this.state;
    return (
      <Layout>
        <Layout>
          <AppSidebar activeTabKey={DASHBOARD_KEYS.SPA_CALENDER} history={history} />
          <Layout>
            <div className='my-profile-box view-class-tab' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section manager-page '>
                  <div className='left'>
                    <Title level={2}>Calendar</Title>
                  </div>
                  <div className="right"></div>
                </div>
                {/**@Developer:-- pf-vend-spa-booking: please apply this class only booking */}
                <div className="pf-vend-restau-myodr profile-content-box pf-vend-spa-booking fm-calendar-booking">

                  <Row gutter={30}>
                    <Col xs={24} sm={24} md={24} lg={16} xl={16} className="fm-calendar-left">
                      <Card
                        className='profile-content-left'
                        bordered={false}
                        title='My Calender'
                      >
                        <div className="fm-vcalender-wrap">
                          <Row className="fm-top-title">
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}><h5> {moment(this.state.selectedBookingDate).format("Do MMM  YYYY")}</h5></Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12} align="right"><h3>You have {vendorCalenderBookingList.length > 0 && vendorCalenderBookingList[0].bookings ? vendorCalenderBookingList[0].bookings.length : 0} appointments today</h3></Col>
                          </Row>
                          <FullCalendar
                            dayHeaders={false}
                            //eventContent={this.customEventRender}
                            slotLabelFormat={{
                              hour: '2-digit', //2-digit, numeric
                              minute: '2-digit', //2-digit, numeric
                              hour12: false
                            }}
                            plugins={[timeGridPlugin]}
                            initialView="timeGridDay"
                            slotDuration={'00:30:00'}
                            ref={this.calendarComponentRef}
                            displayEventTime={false}
                            headerToolbar={{
                              left: '',
                              center: '',
                              right: ''
                            }}
                            slotEventOverlap={false}
                            allDaySlot={false}
                            events={fullCalenderData}
                          />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8} className="right-calender-view fm-calendar-right">
                      <div class="ant-card-head">
                        <div class="ant-card-head-wrapper">
                          <div class="ant-card-head-title">
                            <div className="fm-show-my">
                              <label>Show:</label>
                              <Select
                                onChange={(e) => { this.onChangeCalenderView(e) }}
                                defaultValue='Monthly'
                                size='large'
                              >
                                <Option value={'month'}>Monthly</Option>
                                <Option value={'week'}>Weekly</Option>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="fm-tp-calendar">
                        {calenderView === 'week' ? this.renderCalender() : <Calendar
                          onSelect={this.onChangeBookingDates}
                          fullscreen={false}
                          dateCellRender={this.dateCellRender}
                        />}
                      </div>
                      <div className="fm-tp-appointments">
                        <div className="appointments-heading fm-available-time">
                          <div className="date">Available time slot on {moment(selectedBookingDate).format("MMM D, YYYY")}</div>
                        </div>
                        <div className="appointments-body fm-ca-wrap">
                          <Row>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Text className="w-100 pm-am-text">AM</Text>
                              <div className="fmampm-body">
                                {amTimeSlotArray.length > 0 ? amTimeSlotArray.map((val, index) => {
                                  if (val.occupied_by === 'none') {
                                    return <Button key={`am_active_date_${index}`} size='small' className="slot-btn" style={{ color: '#000000', background: 'transparent', borderColor: '#1890ff' }} onClick={() => this.onTimeSlotSelect(`${index}_am`, val.time, 'close', val.occupied_by)} >
                                      {val.time.toLowerCase()}
                                    </Button>
                                  } else if (val.occupied_by === 'closed') {
                                    return <Button key={`am_closed_date_${index}`} size='small' className='slot-btn' style={{ color: '#FFFFFF', background: '#A5A6A8', borderColor: '#1890ff' }} onClick={() => this.onTimeSlotSelect(`${index}_am`, val.time, 'open', val.occupied_by)}>
                                      {val.time.toLowerCase()}
                                    </Button>
                                  } else if (val.occupied_by === 'service_booking') {
                                    return <Button key={`am_booked_date_${index}`} size='small' className='slot-btn' style={{ color: '#FFFFFF', background: '#1890ff', borderColor: '#d9d9d9' }} onClick={() => this.onTimeSlotSelect(`${index}_am`, val.time, 'open', val.occupied_by)} >
                                      {val.time.toLowerCase()}
                                    </Button>
                                  }
                                }) : <Text className="fm-no-slot">No time slot available</Text>}
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Text className="w-100 pm-am-text fm-pm-text">PM</Text>
                              <div className="fmampm-body">
                                {pmTimeSlotArray.length > 0 ? pmTimeSlotArray.map((val, index) => {
                                  if (val.occupied_by === 'none') {
                                    return <Button key={`pm_active_date_${index}`} size='small' className="slot-btn" style={{ color: '#000000', background: 'transparent', borderColor: '#1890ff' }} onClick={() => this.onTimeSlotSelect(`${index}_pm`, val.time, 'close', val.occupied_by)} >
                                      {val.time.toLowerCase()}
                                    </Button>
                                  } else if (val.occupied_by === 'closed') {
                                    return <Button key={`pm_closed_date_${index}`} size='small' className='slot-btn' style={{ color: '#FFFFFF', background: '#A5A6A8', borderColor: '#1890ff' }} onClick={() => this.onTimeSlotSelect(`${index}_am`, val.time, 'open', val.occupied_by)}>
                                      {val.time.toLowerCase()}
                                    </Button>
                                  } else if (val.occupied_by === 'service_booking') {
                                    return <Button key={`pm_booked_date_${index}`} size='small' className='slot-btn' style={{ color: '#FFFFFF', background: '#1890ff', borderColor: '#d9d9d9' }} onClick={() => this.onTimeSlotSelect(`${index}_am`, val.time, 'open', val.occupied_by)}>
                                      {val.time.toLowerCase()}
                                    </Button>
                                  }
                                }) : <Text className="fm-no-slot">No time slot available</Text>}
                              </div>
                            </Col>
                          </Row>
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
  { enableLoading, disableLoading, getVendorWellBeingMonthBookingsCalender, vendorChangeSlotStatus }
)(VendorSpaMyBookingCalender);