import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import { Layout, Row, Col, Typography, Button, Collapse } from "antd";
import {blankValueCheck,getTimeDifference,hoursToMinutes, salaryNumberFormate } from "../../../../common";
import {
  enableLoading,
  disableLoading,
  checkFlightAvailable,
} from "../../../../../actions";
import VehicleGridDetail from "../../common/VehicleGridDetail";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/one-way-return.less";
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

class OneWayReturn extends React.Component {
  /**
   * @method handleFlightBooking
   * @description handle flight booking
   */
  handleFlightBooking = () => {
    const { selectedFlight, flight_search_params, random_token } = this.props;
    let reqData = {
      passenger: flight_search_params && flight_search_params.reqData.passenger,
      paxPreferences: selectedFlight && selectedFlight.paxReferences,
      segment: selectedFlight && selectedFlight.segments,
      type: flight_search_params && flight_search_params.reqData.type,
      token: random_token,
    };
    this.props.enableLoading();
    this.props.checkFlightAvailable(reqData, (res) => {
      this.props.disableLoading();
      console.log("res", res);
      if (res.status === 200) {
        this.props.changeNextStep(1, "");
      } else {
        toastr.warning("Flight not available");
      }
    });
  };

  /**
   * @method renderBookingDetails
   * @description render booking details
   */
  renderBookingDetails = () => {
    const { selectedFlight, flight_search_params } = this.props;
    let total_price =
      Number(selectedFlight.price) + Number(selectedFlight.tax_amount);
    return (
      <div>
        <div className="booking-summary-box">
          <Row className="summary-box">
            <Col md={9}>
              <div className="heading">
                <Title level={3}>Booking Summary</Title>
                <p>
                  Includes flights for{" "}
                  {flight_search_params ? flight_search_params.adult : ""}{" "}
                  adults and all applicable taxes, charges and fees Payment fees
                  may apply depending on your payment method.
                </p>
              </div>
            </Col>
            <Col md={9}></Col>
            <Col md={6}>
              <div className="detail-list-box">
                <ul>
                  <li>Charges to the airline $</li>
                  <li>
                    {selectedFlight &&
                      salaryNumberFormate(selectedFlight.price)}
                  </li>
                </ul>
              </div>
              <div className="detail-list-box">
                <ul>
                  <li>Taxes and surcharges $</li>
                  <li>
                    {selectedFlight &&
                      salaryNumberFormate(selectedFlight.tax_amount)}
                  </li>
                </ul>
              </div>
              <div className="detail-list-box">
                <ul className="total">
                  <li><strong>Total $ </strong></li>
                  <li><strong>{total_price && salaryNumberFormate(total_price)}</strong></li>
                </ul>
              </div>
            </Col>
          </Row>
          <Row className="summary-box summary-inner-bottom-box">
            <Col md={8}>
              <div className="heading">
                <Title level={2}>Payable Now</Title>
                <p>(in Australian Dollars)</p>
              </div>
            </Col>
            <Col md={10}></Col>
            <Col md={6}>
              <div className="detail-list-box">
                <ul className="total">
                  <li><strong>Total Booking Price $</strong></li>
                  <li>
                   <span> {selectedFlight && salaryNumberFormate(total_price)}</span>
                    {/* <span className="show-detail">Show Details</span> */}
                  </li>
                </ul>
              </div>
              <Button
                className="btn-book-now big-btn"
                onClick={this.handleFlightBooking}
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </div>
        <div className="policy-information-container">
          <Row
            style={{
              borderBottom: "1px solid #C4C4C4",
              paddingBottom: "20px",
            }}
          >
            <Col md={6}>
              <h3>Baggage</h3>
            </Col>

            <Col md={18}>
              <h4>
                <img
                  src={require("../../../../../assets/images/icons/caution.svg")}
                  alt="caution"
                />
                Dangerous Goods
              </h4>

              <Paragraph>
                Dangerous Goods or Hazardous Material (HAZMAT) are items or
                articles or substances which are capable of posing a risk to
                health, safety, property or the environment and classified as
                follows:
              </Paragraph>

              <div className="list-container">
                <ol>
                  <li>Explosives</li>
                  <li>Gases</li>
                  <li>Flammable Liquids</li>
                  <li>Flammable Solids</li>
                  <li>Oxidizing substances and Organic Peroxides</li>
                  <li>Toxic and Infectious Substances</li>
                  <li>Radioactive Material</li>
                  <li>Corrosives</li>
                  <li>
                    Miscellaneous Dangerous substances and articles, including
                    environmentally hazardous substances
                  </li>
                </ol>
              </div>
              <p className="safety-information">
                For your safety, Airline does not allow these dangerous goods in
                checked baggage, carry-on baggage and on one's person on all
                flights.
              </p>
              <p>
                <strong>Remark</strong>: limitations and restrictions are
                subject to local and airport regulations.
              </p>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={6}>
              <h3>Policies</h3>
            </Col>
            <Col md={18}>
              <h4>
                <img
                  src={require("../../../../../assets/images/icons/alert.svg")}
                  alt="alert"
                />
                Important Flight Information
              </h4>
              <Paragraph>
                Personal data given in this booking will be disclosed to the
                airline for the purpose of managing your flight booking. If
                there are any changes to the flight itinerary (whether initiated
                by the airline or by you with the airline direct), Expedia will
                not be notified by the airline. If the airline makes any changes
                to your flight itinerary, they will directly notify you, through
                your email address or phone number provided for this booking.
                Expedia is not responsible for the failure of the foregoing.
              </Paragraph>

              <p>
                We want you to know the airline you're travelling with has the
                following restrictions regarding your flight.
              </p>

              <div class="unodered-list-container">
                <ul>
                  <li>
                    Tickets are non-refundable and non transferable. Name
                    changes are not allowed.
                  </li>
                  <li>
                    Fare Rules and Restrictions:
                    <div className="fare-rules-div">
                      <p>
                        <img
                          src={require("../../../../../assets/images/icons/green-tick.svg")}
                          alt="alert"
                        />
                        Change your flight for free
                      </p>

                      <p className="airline-policy-p">
                        See <Link to="#">Airlines policy</Link> Opens in a new
                        tab.
                      </p>
                    </div>
                  </li>
                  <li>
                    There may be an additional fee based on your payment method.
                    Fee is not reflected in the ticket price.
                  </li>
                  <li>
                    {" "}
                    Airlines may change flight schedules and terminals at any
                    time.
                  </li>
                  <li>
                    Correct travel documents are required. It's your
                    responsibility to check your documents before you travel.
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
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
    }
    return hoursToMinutes(hours_total, minute_total);
  };

  /**
   * @method renderOnwayCard
   * @description render onway flight review card
   */
  renderOnwayCard = (first_obj_out, outBoundData) => {
    const { selectedFlight, flight_search_params } = this.props;
    return (
      <Collapse className="travel-item-collapse-box" defaultActiveKey={["1"]}>
        <Panel
          header={
            <Row className="one-way-collapse-header vhcl-detail-header">
              <Col md={14}>
                <Title level={3}>
                  Departing Flight{" "}
                  <span>
                    -{" "}
                    {selectedFlight && selectedFlight.departureDate 
                      ? moment(selectedFlight.departureDate, "DDMMYY").format(
                          "ddd, Do MMM YYYY"
                        )
                      : ""}
                  </span>
                </Title>
              </Col>
              <Col md={4}>
                <span className="vhcl-time">
                  {" "}
                  {this.getTotalHours(outBoundData)}
                </span>
                {outBoundData && outBoundData.length === 1 &&
                <span className="vhcl-stopage green">Non-stop</span>}
                {outBoundData && outBoundData.length > 1 &&
                <span className='vhcl-stopage blue'>{outBoundData.length - 1}-stop</span>}
              </Col>
              {this.changeFlight()}
            </Row>
          }
          key="1"
        >
          <div className="vehicle-item-all-detail-box">
            <VehicleGridDetail
              selectedFlight={selectedFlight}
              params={flight_search_params}
              data={outBoundData}
            />
          </div>
          <div className="collapse-footer">
            <img
              src={require("../../../../../assets/images/icons/grey-bag.svg")}
              alt="grey-bag"
            />
            <p>
              {first_obj_out && first_obj_out.baggage
                ? `${blankValueCheck(first_obj_out.baggage.freeAllowance)}${blankValueCheck(first_obj_out.baggage.allowanceType)} ${blankValueCheck(first_obj_out.baggage.message)}`
                : ""}
            </p>
          </div>
        </Panel>
      </Collapse>
    );
  };

  /**
   * @method renderReturnFlightCard
   * @description render return flight card details
   */
  renderReturnFlightCard = (first_obj_ret, returnData) => {
    const { selectedFlight, flight_search_params } = this.props;
    return (
      <Collapse className="travel-item-collapse-box" defaultActiveKey={["1"]}>
        <Panel
          header={
            <Row className="one-way-collapse-header vhcl-detail-header">
              <Col md={14}>
                <Title level={3}>
                  Return Flight{" "}
                  <span>
                    -{" "}
                    {selectedFlight && selectedFlight.arrivalDate ? moment(selectedFlight.arrivalDate, "DDMMYY").format("ddd, Do MMM YYYY") : ""}
                  </span>
                </Title>
              </Col>
              <Col md={4}>
                <span className="vhcl-time">
                  {/* {segment2 ? `${segment2.hours}h ${segment2.minutes} m` : ""} */}
                  {this.getTotalHours(returnData)}
                </span>
                {returnData && returnData.length === 1 &&
                <span className="vhcl-stopage green">Non-stop</span>}
                {returnData && returnData.length > 1 &&
                <span className='vhcl-stopage blue'>{returnData.length - 1}-stop</span>}
              </Col>
              {this.changeFlight()}
            </Row>
          }
          key="1"
        >
          <div className="vehicle-item-all-detail-box">
            <VehicleGridDetail
              selectedFlight={selectedFlight}
              params={flight_search_params}
              data={returnData}
            />
          </div>
          <div className="collapse-footer">
            <img
              src={require("../../../../../assets/images/icons/grey-bag.svg")}
              alt="grey-bag"
            />
            <p>
              {first_obj_ret && first_obj_ret.baggage
                ? `${blankValueCheck(first_obj_ret.baggage.freeAllowance)}${blankValueCheck(first_obj_ret.baggage.allowanceType)} ${blankValueCheck(first_obj_ret.baggage.message)}`
                : ""}
            </p>
          </div>
        </Panel>
      </Collapse>
    );
  };

  /**
   * @method renderMulticityFlightCard
   * @description render multi city flight details
   */
  renderMulticityFlightCard = () => {
    const { selectedFlight, flight_search_params, multi_city } = this.props;
    console.log("flight_search_params", multi_city);
    if (
      selectedFlight &&
      selectedFlight.segments &&
      selectedFlight.segments.length
    ) {
      return selectedFlight.segments.map((el, i) => {
        let segment = "",
          from_location = "",
          to_location = "",
          first_obj_out = "";
        if (multi_city && Array.isArray(multi_city) && multi_city.length) {
          from_location =
            multi_city[i] &&
            multi_city[i].from_location &&
            multi_city[i].from_location.name;
          to_location =
            multi_city[i] &&
            multi_city[i].to_location &&
            multi_city[i].to_location.name;
        }
        first_obj_out = el && Array.isArray(el) && el.length > 0 ? el[0] : "";
        return (
          <Collapse
            className="travel-item-collapse-box"
            defaultActiveKey={["1"]}
          >
            <Panel header={`Flight ${i + 1}`} key="1">
              <div className="vehicle-item-all-detail-box">
                <Row className="vhcl-detail-header">
                  <Col md={14}>
                    <Title level={3}>
                      Departing Flight{" "}
                      <span>
                        -{" "}
                        {first_obj_out && first_obj_out.depdate
                          ? moment(first_obj_out.depDate, "DDMMYY").format(
                              "ddd, Do MMM YYYY"
                            )
                          : ""}
                      </span>
                    </Title>
                  </Col>
                  <Col md={5}>
                    <span className="vhcl-time">
                      {/* {segment ? `${segment.hours}h ${segment.minutes} m` : ""} */}
                      {this.getTotalHours(el)}
                    </span>
                    {el && el.length === 1 && <span className="vhcl-stopage green">Non-stop</span>}
                    {el && el.length > 1 &&
                    <span className='vhcl-stopage blue'>{el.length - 1}-stop</span>}
                  </Col>
                  {this.changeFlight()}
                </Row>
                <VehicleGridDetail
                  selectedFlight={selectedFlight}
                  params={flight_search_params}
                  data={el}
                />
              </div>
              <div className="collapse-footer">
                <img
                  src={require("../../../../../assets/images/icons/grey-bag.svg")}
                  alt="grey-bag"
                />
                <p>
                  {first_obj_out && first_obj_out.baggage
                    ? `${blankValueCheck(first_obj_out.baggage.freeAllowance)}${blankValueCheck(first_obj_out.baggage.allowanceType)} ${blankValueCheck(first_obj_out.baggage.message)}`
                    : ""}
                </p>
              </div>
            </Panel>
          </Collapse>
        );
      });
    }
  };

  /**
   * @method changeFlight
   * @description change your  flight
   */
  changeFlight = () => {
    return (
      <Col md={5}>
        <div onClick={() => this.props.history.goBack()} className="change">
          Change
        </div>
      </Col>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { selectedFlight, flight_search_params } = this.props;
    console.log(selectedFlight, "selectedFlight");
    let segment1 = "",
      segment2 = "",
      outBoundData = "",
      returnData = "",
      first_obj_out = "",
      first_obj_ret = "";
    if (
      selectedFlight.segments &&
      Array.isArray(selectedFlight.segments) &&
      selectedFlight.segments.length
    ) {
      outBoundData = selectedFlight.segments[0];
      returnData =
        selectedFlight.segments.length > 1 ? selectedFlight.segments[1] : "";
      if (outBoundData) {
        first_obj_out =
          outBoundData && Array.isArray(outBoundData) && outBoundData.length > 0
            ? outBoundData[0]
            : "";
      }
      if (returnData) {
        first_obj_ret =
          returnData && Array.isArray(returnData) && returnData.length > 0
            ? returnData[0]
            : "";
      }
    }
    return (
      <Layout>
        {flight_search_params &&
          flight_search_params.reqData.type !== 3 &&
          this.renderOnwayCard(first_obj_out, outBoundData)}
        {flight_search_params &&
          flight_search_params.reqData.type === 2 &&
          this.renderReturnFlightCard(first_obj_ret, returnData)}
        {flight_search_params &&
          flight_search_params.reqData.type === 3 &&
          this.renderMulticityFlightCard()}
        {this.renderBookingDetails()}
      </Layout>
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
  checkFlightAvailable,
  enableLoading,
  disableLoading,
})(withRouter(OneWayReturn));
