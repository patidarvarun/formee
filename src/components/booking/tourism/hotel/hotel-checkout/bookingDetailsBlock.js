import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import moment from "moment";
import { Typography, Button, Divider, Modal } from "antd";
import {
  blankValueCheck,
  getTimeDifference,
  hoursToMinutes,
  salaryNumberFormate,
} from "../../../../common";
import { enableLoading, disableLoading,tourismHotelBookingAPI, tourismHotelBookingPaypalAPI } from "../../../../../actions";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/booking-form.less";
const { Title, Paragraph, Text } = Typography;

class BookingDetailBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_params: "",
      visible: false,
      booking_id: null,
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    const { flight_search_params } = nextprops;
    this.setState({ search_params: flight_search_params });
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    const { flight_search_params } = this.props;
    this.setState({ search_params: flight_search_params });
  }

  /**
   * @method addElement
   * @description add element in object
   */
  addElement = (ElementList, element) => {
    let newList = Object.assign(ElementList, element);
    return newList;
  };

  tourismFlightBooking = () => {
    const { selectedHotel, selectedPaymentMethod, paypalPayload, selectedCard } = this.props;
    this.props.enableLoading();
    let tmp = Object.assign({}, selectedHotel)
    // if(selectedPaymentMethod == "paypal"){
    //   tmp = Object.assign({}, selectedHotel, paypalPayload)
    //   let form_data = new FormData();
    //   for ( var key in tmp ) {
    //       form_data.append(key, tmp[key]);
    //     }
    //   this.props.tourismHotelBookingPaypalAPI(tmp, (res) => {
    //     console.log("checkout res", res);
    //     if (res.status === 200) {
    //       this.setState({ visible: true, booking_id: res.data.booking.original.id });
    //       toastr.success("Flight has been booked sucessfully.");
    //     }
    //   });
    // }else{
      tmp = Object.assign({}, selectedHotel, {payment_method: "stripe", payment_source_id: selectedCard})
      let form_data = new FormData();
      for ( var key in tmp ) {
          form_data.append(key, tmp[key]);
        }
      this.props.tourismHotelBookingAPI(tmp, (res) => {
        console.log("checkout res", res);
        this.props.disableLoading();
        if (res.status === 200) {
          this.setState({ visible: true, booking_id: res.data.booking.original.hotel_booking.id});
          toastr.success("Hotel has been booked sucessfully.");
        }
      });
    // }
  };

  getStopOverWait = (segmentList, el, i) => {
    let arrival_time = el.arrivalTime
      ? moment(el.arrivalTime, "Hmm").format("HH:mm")
      : "";
    let dep_time =
      segmentList[i + 1] && segmentList[i + 1].depTime
        ? moment(segmentList[i + 1].depTime, "hmm").format("HH:mm")
        : "";
    let arrivalDate1 = moment(el.arrivalDate, "DDMMYY").format("DD-MMM-YYYY");
    let arrivalDate2 =
      segmentList[i + 1] &&
      segmentList[i + 1].arrivalDate &&
      moment(segmentList[i + 1].arrivalDate, "DDMMYY").format("DD-MMM-YYYY");
    let date1 = `${arrivalDate1} ${arrival_time}`;
    let date2 = `${arrivalDate2} ${dep_time}`;
    let airport_wait = getTimeDifference(date1, date2);
    let stop_wait = `${airport_wait.hours}h ${airport_wait.minutes}m`;
    return {
      airport_wait,
      stop_wait,
    };
  };

  getTotalHours = (segment) => {
    let hours_total = 0,
      minute_total = 0,
      stop_wait;
    let total_hours = 0,
      total_minutes = 0,
      hours = 0,
      minutes = 0,
      stop_hours = 0,
      stop_minutes = 0;
    if (segment && Array.isArray(segment) && segment.length) {
      segment.map((el2, index) => {
        hours = el2.duration && el2.duration.hours ? el2.duration.hours : 0;
        minutes =
          el2.duration && el2.duration.minutes ? el2.duration.minutes : 0;
        total_hours = total_hours + Number(hours);
        total_minutes = total_minutes + Number(minutes);
        stop_wait = this.getStopOverWait(segment, el2, index);
        if (
          stop_wait &&
          stop_wait.airport_wait &&
          !Number.isNaN(stop_wait.airport_wait.hours) &&
          !Number.isNaN(stop_wait.airport_wait.minutes)
        ) {
          stop_hours = stop_hours + stop_wait.airport_wait.hours;
          stop_minutes = stop_minutes + stop_wait.airport_wait.minutes;
        }
      });
      console.log(stop_hours, stop_minutes, "stop_wait", stop_wait);
      hours_total = Number(total_hours) + Number(stop_hours);
      minute_total = Number(total_minutes) + Number(stop_minutes);
      console.log(
        hours_total,
        minute_total,
        "@hours_total",
        stop_hours,
        stop_minutes
      );
    }
    return hoursToMinutes(hours_total, minute_total);
  };

  /**
   * @method renderReturnFlightData
   * @description handle return flight data
   */
  renderReturnFlightData = (first_obj_ret, second_obj_ret, segmentList) => {
    return (
      <div>
        <Divider />
        <Title level={3}>
          <img
            src={require("../../../../../assets/images/icons/aeroplane-return.svg")}
            alt="airline-logo"
          />
          Returning
        </Title>

        <div className="returning-information">
          <div className="airport-information">
            <p className="highlight">
              {first_obj_ret ? blankValueCheck(first_obj_ret.boardAirport) : ""}
            </p>
            <p>
              {first_obj_ret && first_obj_ret.boardAirportDetail
                ? `${blankValueCheck(
                    first_obj_ret.boardAirportDetail.airportName
                  )}`
                : ""}
            </p>
            <p>Terminal 3</p>
            <p className="highlight">
              {first_obj_ret && first_obj_ret.depTime
                ? moment(first_obj_ret.depTime, "hmm").format("hh:mm a")
                : ""}
            </p>
            <p>
              {first_obj_ret && first_obj_ret.depDate
                ? moment(first_obj_ret.depDate, "DDMMYY").format(
                    "ddd, Do MMM YYYY"
                  )
                : ""}
            </p>
          </div>
          <div className="arrow">
            <img
              src={require("../../../../../assets/images/icons/arrow-right.svg")}
              alt="airline-logo"
            />
          </div>

          <div className="airport-information">
            <p className="highlight">
              {second_obj_ret ? blankValueCheck(second_obj_ret.offAirport) : ""}
            </p>
            <p>
              {second_obj_ret && second_obj_ret.offAirportDetail
                ? `${second_obj_ret.offAirportDetail.airportName}`
                : ""}
            </p>
            <p>Terminal 1</p>
            <p className="highlight">
              {second_obj_ret && second_obj_ret.arrivalTime
                ? moment(second_obj_ret.arrivalTime, "hmm").format("hh:mm a")
                : ""}
            </p>
            <p>
              {second_obj_ret && second_obj_ret.arrivalDate
                ? moment(second_obj_ret.arrivalDate, "DDMMYY").format(
                    "ddd, Do MMM YYYY"
                  )
                : ""}
            </p>
          </div>
        </div>

        <div className="flight-information">
          <div className="img-container">
            <img
              src={
                first_obj_ret
                  ? first_obj_ret.logo
                  : require("../../../../../assets/images/airline-logo.jpg")
              }
              alt="airline-logo"
              style={{ width: 50 }}
            />
          </div>
          <div className="flight-info">
            <p className="highlight">
              {first_obj_ret ? `${blankValueCheck(first_obj_ret.airline)}` : ""}
            </p>
            <p>
              {first_obj_ret
                ? `${blankValueCheck(first_obj_ret.aircraft)}`
                : ""}
            </p>
            <p>
              {first_obj_ret && first_obj_ret.baggage
                ? `${blankValueCheck(
                    first_obj_ret.baggage.freeAllowance
                  )}${blankValueCheck(
                    first_obj_ret.baggage.allowanceType
                  )} ${blankValueCheck(first_obj_ret.baggage.message)}`
                : ""}
            </p>
            <p>
              Duration{" "}
              <span className="highlight">
                {this.getTotalHours(segmentList)}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method renderOnewayFlightDetails
   * @description handle onway flight details
   */
  renderOnewayFlightDetails = (first_obj_out, second_obj_out, segmentList) => {
    return (
      <div>
        <div className="departure-information">
          <div className="airport-information">
            <p className="highlight">
              {first_obj_out ? blankValueCheck(first_obj_out.boardAirport) : ""}
            </p>
            <p>
              {first_obj_out && first_obj_out.boardAirportDetail
                ? `${blankValueCheck(
                    first_obj_out.boardAirportDetail.airportName
                  )}`
                : ""}
            </p>
            <p>Terminal 1</p>
            <p className="highlight">
              {" "}
              {first_obj_out && first_obj_out.depTime
                ? moment(first_obj_out.depTime, "hmm").format("hh:mm a")
                : ""}
            </p>
            <p>
              {first_obj_out && first_obj_out.depDate
                ? moment(first_obj_out.depDate, "DDMMYY").format(
                    "ddd, Do MMM YYYY"
                  )
                : ""}
            </p>
          </div>

          <div className="arrow">
            <img
              src={require("../../../../../assets/images/icons/arrow-right.svg")}
              alt="airline-logo"
            />
          </div>

          <div className="airport-information">
            <p className="highlight">
              {second_obj_out ? second_obj_out.offAirport : ""}
            </p>
            <p>
              {second_obj_out && second_obj_out.offAirportDetail
                ? `${blankValueCheck(
                    second_obj_out.offAirportDetail.airportName
                  )}`
                : ""}
            </p>
            <p>Terminal 3</p>
            <p className="highlight">
              {second_obj_out && second_obj_out.arrivalTime
                ? moment(second_obj_out.arrivalTime, "hmm").format("hh:mm a")
                : ""}
            </p>
            <p>
              {second_obj_out && second_obj_out.arrivalDate
                ? moment(second_obj_out.arrivalDate, "DDMMYY").format(
                    "ddd, Do MMM YYYY"
                  )
                : ""}
            </p>
          </div>
        </div>

        <div className="flight-information">
          <div className="img-container">
            <img
              src={
                first_obj_out
                  ? first_obj_out.logo
                  : require("../../../../../assets/images/airline-logo.jpg")
              }
              alt="airline-logo"
              style={{ width: 50 }}
            />
          </div>
          <div className="flight-info">
            <p className="highlight">
              {first_obj_out ? `${blankValueCheck(first_obj_out.airline)}` : ""}
            </p>
            <p>
              {first_obj_out
                ? `${blankValueCheck(first_obj_out.aircraft)}`
                : ""}
            </p>
            <p>
              {first_obj_out && first_obj_out.baggage
                ? `${blankValueCheck(
                    first_obj_out.baggage.freeAllowance
                  )}${blankValueCheck(
                    first_obj_out.baggage.allowanceType
                  )} ${blankValueCheck(first_obj_out.baggage.message)}`
                : ""}
            </p>
            <p>
              Duration{" "}
              <span className="highlight">
                {this.getTotalHours(segmentList)}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method renderMulticityFlightData
   * @description render multi city flight data
   */
  renderMulticityFlightData = () => {
    const { selectedFlight } = this.props;
    if (
      selectedFlight &&
      selectedFlight.segments &&
      selectedFlight.segments.length
    ) {
      return selectedFlight.segments.map((el, i) => {
        let first_obj_out =
          el && Array.isArray(el) && el.length > 0 ? el[0] : "";
        let second_obj_out =
          el && Array.isArray(el) && el.length > 1
            ? el[1]
            : first_obj_out
            ? first_obj_out
            : "";
        return (
          <div>
            {this.renderOnewayFlightDetails(first_obj_out, second_obj_out, el)}
          </div>
        );
      });
    }
  };

  /**
   * @method renderPassengerInformation
   * @description render passenger information
   */
  renderPassengerInformation = () => {
    const { selectedFlight } = this.props;
    const { search_params } = this.state
    let total_price = Number(selectedFlight.price) + Number(selectedFlight.tax_amount);
    let temp1, temp2, temp3
    if(search_params && search_params.reqData && search_params.reqData.passenger){
      temp1 = search_params.reqData.passenger.adult > 1 ? 'Adults' : 'Adult'
      temp2 = search_params.reqData.passenger.child > 1 ? 'Children' : 'Child'
      temp3 = search_params.reqData.passenger.infant > 1 ? 'Infants' : 'Infant'
    }
    return (
      <div>
        <div className="passenger-information">
          <p>
            <span className="highlight">
              {search_params &&
              search_params.reqData &&
              search_params.reqData.passenger &&
              search_params.reqData.passenger.adult
                ? `${search_params.reqData.passenger.adult} ${temp1}`
                : ""}{" "}
              <br />
              {search_params.reqData.passenger.child
                ? `${search_params.reqData.passenger.child} ${temp2}`
                : ""}{" "}
              <br />
              {search_params.reqData.passenger.infant
                ? `${search_params.reqData.passenger.infant} ${temp3}`
                : ""}{" "}
              <br />
            </span>
          </p>
          <p>
            {search_params &&
              search_params.reqData &&
              search_params.reqData.cabin}
          </p>
          <p>${selectedFlight && salaryNumberFormate(selectedFlight.price)}</p>
        </div>
        <Divider />
        <div className="payment-information">
          <div>
            <p>Subtotal</p>
            <p>Taxes and surcharges</p>
            <p className="highlight">Total</p>
            <p className="small-text">Incl. taxes & fees</p>
          </div>
          <div>
            <p>
              ${selectedFlight && salaryNumberFormate(selectedFlight.price)}
            </p>
            <p>
              $
              {selectedFlight && salaryNumberFormate(selectedFlight.tax_amount)}
            </p>
            <p className="highlight">${salaryNumberFormate(total_price)}</p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method render
   * @description render the component
   */
  render() {
    const { selectedHotel, formv, isCheckout, selectedCard, amount, userDetails, Data, nights, rooms, totalRate, taxation, extra } = this.props;
    const { search_params, visible } = this.state;

    let type = search_params && search_params.reqData.type;
    return (
      <Fragment>
        <div className="hotel-right-your-booking-box-2">
            <Title level={1} className="sidebar-heading">
              Your Booking
            </Title>

            <div className="information title-information">
              <img
                src={Data && Data.hotelData && Data.hotelData.hotelImages.length && Data.hotelData.hotelImages[0]}
                alt="hotel"
                width="100"
                height="100"
              />

              <div className="title-information-right">
                <Title level={3}>
                {Data && Data.hotelData && Data.hotelData.hotelName}
                </Title>
                <Text>
                {Data && Data.basic_info && Data.basic_info.address &&
                            `${Data.basic_info.address.addressLine[0]}, ${Data.basic_info.address.cityName}, ${Data.basic_info.address.country.name}, ${Data.basic_info.address.postalCode}`}
                </Text>
              </div>
            </div>

            <div className="subinformation">
              <p className="highlight">Check-in:</p>
              <p> {Data && Data.reqData && moment(Data.reqData.startDate, "YYYY-MM-DD").format('dddd, MMMM DD, YYYY')} from 2:00 PM</p>
            </div>

            <div className="subinformation">
              <p className="highlight"> Check-out:</p>
              <p> {Data && Data.reqData && moment(Data.reqData.endDate, "YYYY-MM-DD").format('dddd, MMMM DD, YYYY')} until 12:00 PM</p>
            </div>

            <div className="subinformation">
              <p className="highlight">Total length of stay:</p>
              <p>{nights} Nights</p>
            </div>

            <div className="subinformation">
              <p className="highlight"> Room:</p>
              <p>
               {Data && Data.room && Data.room.roomType && Data.room.roomType.roomTypeCode && Data.room.roomType.roomTypeCode.roomTypeCategory} {rooms} room, {Data && Data.reqData && Data.reqData.rooms.length && Data.reqData.rooms[0].totalAdults} Adults, {Data && Data.reqData && Data.reqData.rooms.length && Data.reqData.rooms[0].totalChildren} Children
              </p>
            </div>

            <div className="subinformation subinformation-last-div">
              <p className="highlight">More requests:</p>
              <p>Standard Double or Twin Room Smoking balcony</p>
            </div>

            <div className="subinformation">
              <p className="highlight">Contact Name:</p>
              <p>{userDetails && userDetails.name}</p>
            </div>

            <div className="subinformation">
              <p className="highlight">Email Address:</p>
              <p> {userDetails && userDetails.email}</p>
            </div>

            <div className="subinformation">
              <p className="highlight">Phone Number :</p>
              <p>{userDetails && userDetails.mobile_no}</p>
            </div>

            <div className="information price-information">
              <div>
                <p className="price-information1">
                  Price ({rooms} rooms x {nights} night)
                </p>
                <p>Breakfast ({Data && Data.reqData && Data.reqData.rooms.length && Data.reqData.rooms[0].totalAdults} adults x {nights} night)</p>
              </div>

              <div>
                <p className="price-information1">${totalRate}</p>
                <p>${extra}</p>
              </div>
            </div>

            <div className="information payment-information">
              <div>
                <p>Subtotal</p>
                <p>Taxes and surcharges</p>
                <p className="highlight">Total</p>
                <p className="small-text">Incl. taxes & fees</p>
              </div>

              <div>
                <p>${+totalRate + 40}</p>
                <p>${+taxation}</p>
                <p className="highlight">${+totalRate + +taxation + extra}</p>
              </div>
            </div>
            {isCheckout ? (
            <Button
              block
              htmlType="button"
              className="btn-pay"
              type="primary"
              onClick={this.tourismFlightBooking}
              disabled={selectedCard === "" || selectedCard === undefined}
            >
              Pay
            </Button>
          ) : (
            <Button
              block
              form={"add-passenger"}
              htmlType="submit"
              type="primary"
              // onClick={this.props.changeNextStep}
            >
              Checkout
            </Button>
          )}
          </div>

        {/* START - Booking Confirmation Modal */}
        <Modal
          visible={visible}
          title="Purchase Complete!"
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
          className="custom-modal style1 booking-confirmation-modal"
          closable={false}
          maskClosable={false}
        >
          <div class="confirmation-modal-container">
            {/* <Title>Purchase Complete!</Title> */}
            <Title level={3}>
              Your{" "}
              Hotel booking is confirmed.
            </Title>

            <div className="information">
              <Paragraph>
                Your booking ID is <Link to="#">{this.state.booking_id}</Link>  and your PNR is {formv.pnr_number}. Please use
                this booking ID for any communication with us.
              </Paragraph>
              <Text>We will email your ticket shortly.</Text>
            </div>

            <div class="information payment-information">
              <Paragraph>
                Your payment of ${+totalRate + +taxation + extra} was processed on{" "}
                {moment().format("DD/MM/YYYY")}. Here is a link to Receipt{" "}
                <Link to="#">#8458.pdf</Link> for your records
              </Paragraph>
            </div>

            <div className="button-container">
              <Button
                className="continue-button"
                onClick={() => {
                  this.props.history.push(
                    "/bookings-tourism/55"
                  );
                  this.setState({ visible: false });
                }}
              >
                Continue Browsing
              </Button>
              <Button
                className="go-home-button"
                onClick={() => {
                  this.props.history.push(
                    "/dashboard"
                  );
                  this.setState({ visible: false });
                }}
              >
                Go to My Bookings
              </Button>
            </div>
          </div>
        </Modal>
        {/* END - Booking Confirmation Modal - 05/07/2021 */}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { tourism } = store;
  const { flight_search_params, multi_city_Initial } = tourism;
  return {
    flight_search_params,
    multi_city: multi_city_Initial,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  tourismHotelBookingAPI,
  tourismHotelBookingPaypalAPI })(
  withRouter(BookingDetailBlock)
);
