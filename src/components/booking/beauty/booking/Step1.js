import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Typography, Row, Col, Form, Input, Button, Divider } from "antd";
import {
  getTraderMonthWellbeingBooking,
  enableLoading,
  disableLoading,
  applyPromocode,
} from "../../../../actions";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import TextArea from "antd/lib/input/TextArea";
import Icon from "../../../customIcons/customIcons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { convertTime12To24Hour, convertTime24To12Hour } from "../../../common";
import { TRADER_MONTH_WELLBEAING_BOOKING } from "../../static_response";

const { Title, Text } = Typography;

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDate: moment(),
      selectedBookingDate: props.reqData.bookingDate
        ? moment(props.reqData.bookingDate)
        : "",
      bookingTimeSlot: props.reqData.bookingTimeSlot
        ? convertTime24To12Hour(props.reqData.bookingTimeSlot)
        : "",
      appliedPromoCode: "",
      promoCodeDiscount: "",
      additionalComments: props.reqData.additionalComments
        ? props.reqData.additionalComments
        : "",
      slotsArrayForDate: [],
      selectedTimeIndex: props.reqData.selectedTimeIndex
        ? props.reqData.selectedTimeIndex
        : "",
      amTimeSlotArray: props.reqData.amTimeSlotArray
        ? props.reqData.amTimeSlotArray
        : [],
      pmTimeSlotArray: props.reqData.pmTimeSlotArray
        ? props.reqData.pmTimeSlotArray
        : [],
      promocodeValue: "",
      appliedPromoCodeId: "",
    };
    //
  }

  componentDidMount() {
    let today = Date.now();
    this.onChangeBookingDates(today);
  }

  getSelectedServiceSumTotal = (arr) =>
    arr.reduce((sum, { price }) => sum + price, 0);

  getSelectedServiceDurationTotal = (arr) =>
    arr.reduce((sum, { duration }) => sum + parseInt(duration), 0);

  /**
   * @method onSubmit
   * @description onsubmit
   */
  onSubmit = () => {
    const {
      selectedBookingDate,
      bookingTimeSlot,
      appliedPromoCodeId,
      appliedPromoCode,
      promoCodeDiscount,
      additionalComments,
      selectedTimeIndex,
      amTimeSlotArray,
      pmTimeSlotArray,
    } = this.state;
    const { loggedInDetail, bookingDetail, selectedBeautyService } = this.props;

    if (!selectedBookingDate) {
      toastr.warning("Please select booking date.");
    } else if (!bookingTimeSlot) {
      toastr.warning("Please select booking time.");
    } else {
      // Convert time 12 hour to 24 hours formate
      let bookingTimeFormated = convertTime12To24Hour(bookingTimeSlot);

      let dayOfselectedDate = moment(selectedBookingDate).day();
      let getSelectedDayWorkingHours =
        bookingDetail.trader_working_hours.filter((item) => {
          return item.day === dayOfselectedDate;
        });

      const totalServiceDuration = this.getSelectedServiceDurationTotal(
        selectedBeautyService
      );

      if (
        getSelectedDayWorkingHours.length &&
        getSelectedDayWorkingHours[0].is_open === 1
      ) {
        let selectedSlotTime = moment(bookingTimeFormated, "HH:mm:ss");
        let vendorWorkingEndTime = moment(
          getSelectedDayWorkingHours[0].end_time,
          "HH:mm:ss"
        );

        let duration = moment.duration(
          vendorWorkingEndTime.diff(selectedSlotTime)
        );
        let minutesDiff = duration.asMinutes();

        if (totalServiceDuration > minutesDiff) {
          toastr.warning(
            "Booking can not be done because service time excced then business operting hours."
          );
        } else {
          var serviceIdsArray = selectedBeautyService.map(function (item) {
            return item["id"];
          });

          const selectedServiceSumTotal = this.getSelectedServiceSumTotal(
            selectedBeautyService
          );

          let reqData = {
            bookingDate: selectedBookingDate,
            bookingTimeSlot: bookingTimeFormated,
            appliedPromoCode,
            promoCodeDiscount,
            additionalComments,
            traderProfileId: bookingDetail.trader_profile.id,
            customerId: loggedInDetail.id,
            serviceIds: serviceIdsArray,
            serviceBookingId: 1001,
            selectedTimeIndex,
            amTimeSlotArray,
            pmTimeSlotArray,
            appliedPromoCodeId,
            selectedServiceSumTotal,
          };
          this.props.nextStep(reqData, 1);
        }
      }
    }
  };

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
          this.props.enableLoading();
          this.props.getTraderMonthWellbeingBooking(
            req,
            this.setTraderTimeSlotAvailability
          );
        }
      }
    );
  };

  setTraderTimeSlotAvailability = (response) => {
    //
    this.props.disableLoading();
    if (response.status === 200 && response.data) {
      const { month_slots } = response.data; //TRADER_MONTH_WELLBEAING_BOOKING
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

  onTimeSlotSelect = (selectedTimeIndex, selectedTime) => {
    this.setState({
      bookingTimeSlot: selectedTime,
      selectedTimeIndex: selectedTimeIndex,
    });
  };

  onClickApplyPromocode = () => {
    const { trader_profile } = this.props.bookingDetail;
    const { loggedInDetail } = this.props;
    let reqData = {
      promo_code: this.state.promocodeValue,
      booking_category_id: trader_profile.booking_cat_id,
      customer_id: loggedInDetail.id,
    };
    this.props.enableLoading();
    this.props.applyPromocode(reqData, (response) => {
      this.props.disableLoading();
      if (response.status === 200) {
        toastr.success("Promocode appiled successfully.");
        this.setState({
          appliedPromoCodeId: response.data.data.id,
          appliedPromoCode: response.data.data.promo_code,
          promoCodeDiscount: response.data.data.discount_percent,
        });
      }
    });
  };

  removeAppliedPromoCode = () => {
    this.setState({
      promocodeValue: "",
      appliedPromoCode: "",
      promoCodeDiscount: "",
    });
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
      selectedBookingDate,
      bookingTimeSlot,
      additionalComments,
      selectedTimeIndex,
      amTimeSlotArray,
      pmTimeSlotArray,
    } = this.state;
    return (
      <Fragment>
        <div className="wrap fm-step-form beauty-step-one wbn-step-one">
          <Title> Please select a date and time </Title>
          <Row className="mb-10 shadow-input pl-15 pr-15" align="middle">
            <Icon className="clock-icon pr-2" icon="clock" size="16" />
            <Col>
              {" "}
              <Text className="d-flex align-center">
                {" "}
                Your currently selected Date is:{" "}
                {selectedBookingDate &&
                  bookingTimeSlot &&
                  moment(selectedBookingDate).format("ddd, MMM Do YYYY")}{" "}
                {bookingTimeSlot.toLowerCase()}{" "}
              </Text>
            </Col>
          </Row>
          <Row className="shadow-input mt-30">
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
                    <Text className="w-100 pm-am-text">AM</Text>
                    {amTimeSlotArray.length > 0 ? (
                      amTimeSlotArray.map((val, index) => {
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
                              key={`am_active_date_${index}`}
                              size="small"
                              className="slot-btn"
                              style={{
                                color:
                                  selectedTimeIndex === `${index}_am`
                                    ? "#FFFFFF"
                                    : "#000000",
                                background:
                                  selectedTimeIndex === `${index}_am`
                                    ? "#109CF1"
                                    : "transparent",
                                borderColor:
                                  selectedTimeIndex === `${index}_am`
                                    ? "#109CF1"
                                    : "#d9d9d9",
                              }}
                              onClick={() =>
                                this.onTimeSlotSelect(`${index}_am`, val.time)
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
                      <Text className="time-slot"> No time slot available</Text>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider></Divider>
          <Row gutter={[0]}>
            <Col span={24}>
              <Form.Item label="Comment" className="custom-astrix">
                <TextArea
                  defaultValue={additionalComments}
                  maxLength={100}
                  onChange={(e) => {
                    this.setState({ additionalComments: e.target.value });
                  }}
                  rows={2}
                  placeholder={"Write your message here"}
                  className="shadow-input"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="fm-apply-label" label="Do you have code promo?">
            <div className="fm-apply-input">
              <Input
                value={this.state.promocodeValue}
                onChange={(e) =>
                  this.setState({ promocodeValue: e.target.value })
                }
                placeholder={"Enter promotion code"}
                enterButton="Search"
                className="shadow-input"
              />
              <Button
                onClick={this.onClickApplyPromocode}
                type="primary"
                className="fm-apply-btn"
              >
                Apply
              </Button>
            </div>
            <Link
              onClick={this.removeAppliedPromoCode}
              className="fm-clear-link"
            >
              Clear
            </Link>
          </Form.Item>
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
  enableLoading,
  disableLoading,
  getTraderMonthWellbeingBooking,
  applyPromocode,
})(Step1);
