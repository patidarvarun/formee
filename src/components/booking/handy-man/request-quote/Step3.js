import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Typography, Button, Form, Input, Select, DatePicker, TimePicker, Radio, Card, Row, Col } from 'antd';
import { toastr } from 'react-redux-toastr'
import { required } from '../../../../config/FormValidation';
import { getFoodTypes } from '../../../../actions';
import moment from 'moment';
import { convertTime24To12Hour, convertTime12To24Hour } from '../../../common';

const { Title, Text } = Typography;
const { TextArea } = Input;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

class Step3 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      dateSelection: 1,
    }
  }

  timeAvailabilityCheck = (values) => {
    let { bookingDetail } = this.props;
    let selectedDate = moment(values.date).format('YYYY-MM-DD')
    let dayOfselectedDate = moment(selectedDate).day();
    let getSelectedDayWorkingHours = bookingDetail.trader_working_hours.filter((item) => {
      return item.day === dayOfselectedDate
    });
    let selectedEndTime = moment(values.to);

    if (getSelectedDayWorkingHours.length) {
      let vendorWorkingEndTime = moment(getSelectedDayWorkingHours[0].end_time, "hh:mm:ss");
      if (getSelectedDayWorkingHours[0].is_open === 1 && moment(`${selectedEndTime}`).isAfter(moment(vendorWorkingEndTime)) === false) {

      } else {
        this.formRef.current && this.formRef.current.setFieldsValue({
          to: '',
          from: ''
        });
        toastr.warning('Booking can not be done because service time not in the business operting hours.');
      }
    }
  }

  /**
   * @method onClickNext
   * @description onClickNext
   */
  onFinish = (values) => {
    if (this.onFinishFailed() !== undefined) {
      return true
    } else {
      if (values !== undefined) {
        let { bookingDetail } = this.props;
        let selectedDate = moment(values.date).format('YYYY-MM-DD')
        let dayOfselectedDate = moment(selectedDate).day();
        let getSelectedDayWorkingHours = bookingDetail.trader_working_hours.filter((item) => {
          return item.day === dayOfselectedDate
        });
        let selectedEndTime = moment(values.to);

        if (getSelectedDayWorkingHours.length) {
          let vendorWorkingEndTime = moment(getSelectedDayWorkingHours[0].end_time, "hh:mm:ss");
          if (getSelectedDayWorkingHours[0].is_open === 1 && moment(`${selectedEndTime}`).isAfter(moment(vendorWorkingEndTime)) === false) {
            let req = {
              need_job_done: values.need_job_done,
              date: moment(values.date).format('YYYY-MM-DD'),
              from: moment(values.from).format("HH:mm a"),
              to: moment(values.to).format("HH:mm a"),
              hours: values.hours,
            }
            this.props.nextStep(req, 3);
          } else {
            toastr.warning('Booking can not be done because service time not in the business operting hours.');
          }
        }
      }
    }
  }

  checkIsTimeInPast = (selectedBookingDate, selectedTime) => {
    let bookingTimeFormated = convertTime12To24Hour(selectedTime);
    return moment(`${selectedBookingDate} ${bookingTimeFormated}`, 'YYYY-MM-DD hh:mm:ss').isAfter(moment());
  }
  /**
   * @method onFinishFailed
   * @description handle form submission failed 
   */
  onFinishFailed = errorInfo => {
    return errorInfo
  };


  onChangeStartTime = (time, timeString) => {
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    if (!currentField.date) {
      this.formRef.current && this.formRef.current.setFieldsValue({
        to: '',
        from: ''
      });
      toastr.warning('Please Select date of booking first to get operting hours.');
    }else{
      this.formRef.current && this.formRef.current.setFieldsValue({
        to: ''      
      });
    }
  }

  onChangeEndTime = (time, timeString) => {    
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    if (!currentField.date) {
      this.formRef.current && this.formRef.current.setFieldsValue({
        to: '',
        from: ''
      });
      toastr.warning('Please select date of booking first to get operting hours.');
    }else if(!currentField.from){
      this.formRef.current && this.formRef.current.setFieldsValue({
        to: '',
        from: ''
      });
      toastr.warning('Please select start time first to get operting hours.');
    
    }
    this.timeAvailabilityCheck(currentField)

  }

  /**
  * @method renderHours
  * @description render request hours
  */
  renderHours = () => {
    let time = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    if (time) {
      return time.map((el, i) => {
        return (
          <Select.Option key={i} value={el}>{`${el} hour`}</Select.Option>
        );
      })
    }
  }

  /**
  * @method render
  * @description render component
  */
  render() {
    const { mergedStepsData, bookingDetail } = this.props;
    const { step3Data } = mergedStepsData;
    const { dateSelection } = this.state
    const { date, hours, to, from, request_name } = step3Data;
    let formatedBookingDate = date && date !== '' ? moment(date, 'YYYY-MM-DD') : '';
    let startTime = from && from != '' ? moment(from, 'HH:mm a') : '';
    let endTime = to && to != '' ? moment(to, 'HH:mm a') : '';
    function dayCheck(start, end, current) {
      var currentDay = moment(current).isoWeekday()
      if (current.valueOf() < start || current.valueOf() > end) {
        return true
      } else {
        let index = bookingDetail.trader_working_hours.findIndex((item) => item.day === currentDay)
        return bookingDetail.trader_working_hours[index].is_open === 1 ? false : true
      }
    }
    function disabledDate(current) {
      if (Number(dateSelection) === 2) {
        var startOfWeek = moment().startOf('week').toDate();
        var endOfWeek = moment().add(30, 'days').endOf('week').toDate();
        return dayCheck(startOfWeek, endOfWeek, current)
      } else if (Number(dateSelection) === 3) {
        var startOfWeek = moment().toDate();
        var endOfWeek = moment().add(1, 'days').toDate();
        return dayCheck(startOfWeek, endOfWeek, current)
      } else {
        var startOfWeek = moment().startOf('week').toDate();
        var endOfWeek = moment().endOf('week').toDate();
        return dayCheck(startOfWeek, endOfWeek, current)
      }
    }
    return (
      <Fragment>
        <div className='wrap fm-step-form fm-step-three step-third-block req-step-three'>
          <Form
            name='user-bookinginfo'
            initialValues={{ request_name: request_name, date: formatedBookingDate, from: startTime, to: endTime, hours: `${hours}` }}
            layout='horizontal'
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            scrollToFirstError
            id='user-bookinginfo'
            ref={this.formRef}
          >
            <h4 className='fm-input-heading'>Requesting Date &amp; Time</h4>
            <Form.Item onChange={(e) => {
              let hours = bookingDetail.trader_working_hours
              this.setState({ dateSelection: e.target.value })

            }} label='When do you need the job done?' name='need_job_done' className="additional-note">
              <Radio.Group defaultValue={1}>
                <Radio style={radioStyle} value={1}>This week</Radio>
                <Radio style={radioStyle} value={2}>Next couple of weeks</Radio>
                <Radio style={radioStyle} value={3}>Urgently</Radio>
                <Radio style={radioStyle} value={4}><b>On a Particular Date</b></Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label='Date    '
              name='date'
              rules={[required('')]}
            >
              <DatePicker
                getPopupContainer={trigger => trigger.parentElement}
                format={'YYYY-MM-DD'}
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item label="What time are available for you ?" style={{ marginBottom: 0 }}>
              <div className="time-date-pick">
                <div className="time-date-pick-left">
                  <label className="start-end-time-label">From</label>
                  <Form.Item
                    name="from"
                    rules={[required('')]}
                    style={{ display: 'inline-block', width: 'calc(97% - 8px)' }}
                  >
                    <TimePicker minuteStep={30}
                      format="HH:mm a"
                      placeholder='Select Start Time'
                      getPopupContainer={trigger => trigger.parentElement}
                      // disabledHours={() => [1, 2, 3]}
                      use12Hours onChange={this.onChangeStartTime} />
                  </Form.Item>
                </div>
                <div className="time-date-pick-right">
                  <label className="start-end-time-label">To</label>
                  <Form.Item
                    name="to"
                    rules={[required('')]}
                    style={{ display: 'inline-block', width: 'calc(100% - 1px)' }}
                  >
                    <TimePicker
                      minuteStep={30}
                      format="HH:mm a"
                      placeholder='Select End Time'
                      getPopupContainer={trigger => trigger.parentElement}
                      use12Hours
                      onChange={this.onChangeEndTime} />
                  </Form.Item>
                </div>
              </div>
            </Form.Item>
            <Form.Item
              rules={[required('')]}
              label='Request Booking'
              name='hours'
              className="preferred-cusine">
              <Select
                placeholder='Select'
                size='large'
                allowClear
                getPopupContainer={trigger => trigger.parentElement}
              >
                {this.renderHours()}
              </Select>
            </Form.Item>
            <Form.Item>
              <div className='steps-action'>
                <Button onClick={() => { this.props.preStep() }} type='primary' size='middle' className='btn-trans fm-btn' >Back</Button>
                <Button htmlType="submit" type='primary' size='middle' className='btn-blue fm-btn' >Next</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser
  };
};

export default connect(
  mapStateToProps, { getFoodTypes }
)(Step3);