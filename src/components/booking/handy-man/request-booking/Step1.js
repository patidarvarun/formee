import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Typography, Row, Col, Form, Input, Button, Divider } from "antd";
import {
  getTraderMonthBooking,
  getTraderBookingSlots,
  enableLoading,
  disableLoading,
} from "../../../../actions";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import Icon from "../../../customIcons/customIcons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { convertTime12To24Hour, convertTime24To12Hour } from "../../../common";

const { Title, Text } = Typography;
let start_time = "00",
  end_time = "00";

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDate: moment(),
      selectedBookingDate: props.reqData.booking_date
        ? moment(props.reqData.booking_date)
        : "",
      bookingTimeSlot: props.reqData.bookingTimeSlot
        ? convertTime24To12Hour(props.reqData.bookingTimeSlot)
        : "",
      slotsArrayForDate: [],
      amTimeSlotArray: props.reqData.amTimeSlotArray
        ? props.reqData.amTimeSlotArray
        : [],
      pmTimeSlotArray: props.reqData.pmTimeSlotArray
        ? props.reqData.pmTimeSlotArray
        : [],
      selectedItem: props.reqData.selectedItem,
      hours: props.reqData.hours,
    };
  }

  componentDidMount() {
    let today = Date.now();
    this.onChangeBookingDates(today);
  }

  /**
   * @method onSubmit
   * @description onsubmit
   */
  onSubmit = () => {
    const {
      selectedItem,
      selectedBookingDate,
      bookingTimeSlot,
      selectedTimeIndex,
      amTimeSlotArray,
      pmTimeSlotArray,
    } = this.state;
    if (!selectedBookingDate) {
      toastr.warning("Please select booking date.");
    } else if (selectedItem.length === 0) {
      toastr.warning("Please select booking time.");
    } else {
      let bookingTimeFormated = convertTime12To24Hour(bookingTimeSlot);
      let reqData = {
        booking_date: selectedBookingDate,
        bookingTimeSlot: bookingTimeFormated,
        start_time: selectedTimeIndex,
        end_time: selectedTimeIndex,
        amTimeSlotArray,
        pmTimeSlotArray,
        selectedItem,
        hours: selectedItem.length - 1,
      };
      this.props.nextStep(reqData, 1);
    }
  };

  /**
   * @method onChangeBookingDates
   * @description handle booking dates change
   */
  onChangeBookingDates = (value) => {
    const { trader_profile, id } = this.props.bookingDetail;
    const selectedDate = moment(value).format("YYYY-MM-DD");
    this.setState(
      {
        initialDate: value,
        selectedBookingDate: selectedDate,
        bookingTimeSlot: "",
        selectedTimeIndex: "",
        amTimeSlotArray: "",
        pmTimeSlotArray: "",
      },
      () => {
        if (selectedDate) {
          const req = {
            user_id: id,
            date: selectedDate,
          };
          this.props.getTraderBookingSlots(
            req,
            this.setTraderTimeSlotAvailability
          );
        }
      }
    );
  };

  /**
   * @method setTraderTimeSlotAvailability
   * @description set trader time slot availability
   */
  setTraderTimeSlotAvailability = (response) => {
    //
    if (response.status === 200 && response.data) {
      const { month_slots } = response.data;
      const allowed = [this.state.selectedBookingDate];
      const selectedDateSlots = Object.keys(month_slots)
        .filter((key) => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = month_slots[key];
          return obj;
        }, {});

      const timeSlotArray =
        selectedDateSlots[this.state.selectedBookingDate].slots;
      let regex = /\./g;
      let formatedTimeSlotArray = timeSlotArray.map((dots) => {
        return {
          time: dots.time.replace(regex, ":"),
          occupied_by: dots.occupied_by,
        };
      });
      let amSlotArray = [];
      let pmSlotArray = [];

      formatedTimeSlotArray.map((value) => {
        if (value.time.indexOf("AM") > -1 || value.time.indexOf("am") > -1) {
          amSlotArray.push(value);
        } else if (
          value.time.indexOf("PM") > -1 ||
          value.time.indexOf("pm") > -1
        ) {
          pmSlotArray.push(value);
        }
      });
      this.setState({
        slotsArrayForDate: formatedTimeSlotArray,
        amTimeSlotArray: amSlotArray,
        pmTimeSlotArray: pmSlotArray,
      });
    }
  };

  convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}`;
  };

  /**
   * @method onTimeSlotSelect
   * @description on time slot select
   */
  onTimeSlotSelect = (selectedTimeIndex, selectedTime) => {
    const { selectedItem } = this.state;
    if (selectedItem.length && selectedItem.length !== 0) {
      start_time = convertTime12To24Hour(selectedItem[selectedItem.length - 1]);
      end_time = convertTime12To24Hour(selectedTime);
    } else {
      start_time = convertTime12To24Hour(selectedTime);
    }

    let isSelected =
      selectedItem &&
      selectedItem.length &&
      selectedItem.includes(selectedTime);
    if (!isSelected && selectedItem.length !== 0 && end_time < start_time) {
      toastr.warning("End time should be greater than start time.");
      return true;
    } else {
      if (isSelected) {
        this.setState({
          selectedItem: [...selectedItem.filter((e) => e !== selectedTime)],
        });
      } else {
        this.setState({
          selectedItem: [...selectedItem, selectedTime],
        });
      }
    }
  };

  checkIsTimeInPast = (selectedBookingDate, selectedTime) => {
    let bookingTimeFormated = convertTime12To24Hour(selectedTime);
    return moment(
      `${selectedBookingDate} ${bookingTimeFormated}`,
      "YYYY-MM-DD hh:mm:ss"
    ).isAfter(moment());
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedItem,
      selectedBookingDate,
      selectedTimeIndex,
      amTimeSlotArray,
      pmTimeSlotArray,
    } = this.state;
    const { selectedSpaService } = this.props;

    return (
      <Fragment>
        <div className="wrap fm-step-form rb-step-one">
          <Title> Please select a date and time </Title>
          {/* <Row className="mb-10 shadow-input pl-15 pr-15" align="middle">
            <Icon className=" pr-2 clock-icon" icon='clock' size='16' />
            <Col>
              <Text className="d-flex align-center">
                Request Booking   &nbsp;&nbsp;
                {selectedBookingDate && selectedItem && moment(selectedBookingDate).format("ddd, MMM Do YYYY")} &nbsp;&nbsp;
                {selectedItem.length !== 0 && `${selectedItem[0].toLowerCase()} - ${selectedItem[selectedItem.length - 1].toLowerCase()}`} &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                {selectedBookingDate && selectedItem.length !== 0 && `${selectedItem.length - 1} hours`}
            </Text>
            </Col>
          </Row> */}
          <Row className="shadow-input mt-30" gutter={[0]}>
            <Col span={8}>
              <Calendar
                onChange={this.onChangeBookingDates}
                value={
                  this.state.selectedBookingDate !== ""
                    ? new Date(this.state.selectedBookingDate)
                    : new Date()
                }
                minDate={new Date()}
                //view={'year'}
                showDoubleView={false}
                next2Label={null}
                prev2Label={null}
              />
            </Col>
            <Col span={16} className="bdr-left">
              <Text className="availability-text">
                Availability for{" "}
                {selectedBookingDate !== ""
                  ? moment(selectedBookingDate).format("dddd, Do MMM, YYYY")
                  : "-"}{" "}
              </Text>
              <Row>
                <Col md={12}>
                  <div className="calendar-right-content">
                    <Text className="w-100">
                      Please select the time
                    </Text>
                    <Text className="w-100 pm-am-text">AM</Text>
                    {amTimeSlotArray.length > 0 ? (
                      amTimeSlotArray.map((val, index) => {
                        let isTimeInPast = this.checkIsTimeInPast(
                          selectedBookingDate,
                          val.time
                        );
                        let isSelected = selectedItem.includes(val.time);
                        if (
                          val.occupied_by === "none" &&
                          isTimeInPast === true
                        ) {
                          return (
                            <Button
                              key={`am_active_date_${index}`}
                              size="small"
                              className="slot-btn"
                              style={{
                                color: isSelected ? "#67747D" : "#000000",
                                background: isSelected
                                  ? "#E3E9EF"
                                  : "transparent",
                                borderColor: isSelected ? "#E3E9EF" : "#d9d9d9",
                              }}
                              onClick={() =>
                                this.onTimeSlotSelect(`${index}`, val.time)
                              }
                            >
                              {val.time.toLowerCase()}
                            </Button>
                          );
                        } else {
                          return (
                            <Button
                              key={`am_inactive_date_${index}`}
                              size="small"
                              className="slot-btn"
                              disabled
                            >
                              {val.time.toLowerCase()}
                            </Button>
                          );
                        }
                      })
                    ) : (
                      <Text className="time-slot">
                        {" "}
                        No time slot available{" "}
                      </Text>
                    )}
                  </div>
                </Col>
                <Col md={12}>
                  <div className="calendar-right-content calendar-right-content-pm">
                    <br />
                    <Text className="w-100 pm-am-text">PM</Text>
                    {pmTimeSlotArray.length > 0 ? (
                      pmTimeSlotArray.map((val, index) => {
                        let isTimeInPast = this.checkIsTimeInPast(
                          selectedBookingDate,
                          val.time
                        );
                        if (
                          val.occupied_by === "none" &&
                          isTimeInPast === true
                        ) {
                          return (
                            <Button
                              key={`pm_active_date_${index}`}
                              size="small"
                              className="slot-btn"
                              style={{
                                color:
                                  selectedTimeIndex === `${index}_pm`
                                    ? "#67747D"
                                    : "#000000",
                                background:
                                  selectedTimeIndex === `${index}_pm`
                                    ? "#E3E9EF"
                                    : "transparent",
                                borderColor:
                                  selectedTimeIndex === `${index}_pm`
                                    ? "#E3E9EF"
                                    : "#d9d9d9",
                              }}
                              onClick={() =>
                                this.onTimeSlotSelect(`${index}_pm`, val.time)
                              }
                            >
                              {val.time.toLowerCase()}
                            </Button>
                          );
                        } else {
                          return (
                            <Button
                              key={`pm_inactive_date_${index}`}
                              size="small"
                              className="slot-btn"
                              disabled
                            >
                              {val.time.toLowerCase()}
                            </Button>
                          );
                        }
                      })
                    ) : (
                      <Text> No time slot available </Text>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <div className="steps-action w-100  mb-0">
              <Button
                htmlType="submit"
                type="primary"
                size="middle"
                className="btn-blue fm-btn"
                onClick={() => this.onSubmit()}
              >
                NEXT
              </Button>
            </div>
          </Row>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, {
  getTraderMonthBooking,
  getTraderBookingSlots,
  enableLoading,
  disableLoading,
})(Step1);
