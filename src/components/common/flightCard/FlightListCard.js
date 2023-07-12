import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Tabs, Row, Col, Typography, Button, Collapse, Tooltip } from "antd";
import {
  getTimeDifference,
  hoursToMinutes,
  salaryNumberFormate,
  createRandomString,
  capitalizeFirstLetter,
} from "../../common";
import { setFlightToken } from "../../../actions";
import { blankValueCheck } from "../../common";
import "./flight-list-card.less";
const { TabPane } = Tabs;
const { Text } = Typography;
const { Panel } = Collapse;
const text = <span>Flight Details</span>;

class FlightListCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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

  /**
   * @method renderFlightSegament
   * @description render flight segments
   */
  renderFlightSegament = (item) => {
    if (item.segments && Array.isArray(item.segments) && item.segments.length) {
      return item.segments.map((el, i) => {
        let first_obj = el && Array.isArray(el) && el.length > 0 ? el[0] : "";
        let second_obj =
          el && Array.isArray(el) && el.length > 1 ? el[el.length - 1] : "";
        let depTime = first_obj
          ? moment(first_obj.depTime, "Hmm").format("hh:mm a")
          : "";
        let arrivalTime = second_obj
          ? moment(second_obj.arrivalTime, "Hmm").format("hh:mm a")
          : first_obj
          ? moment(first_obj.arrivalTime, "Hmm").format("hh:mm a")
          : "";
        let hours_total = 0,
          minute_total = 0,
          stop_wait;
        let total_hours = 0,
          total_minutes = 0,
          hours = 0,
          minutes = 0,
          stop_hours = 0,
          stop_minutes = 0;
        let stops = [];
        if (el && Array.isArray(el) && el.length) {
          el.map((el2, index) => {
            hours = el2.duration && el2.duration.hours ? el2.duration.hours : 0;
            minutes =
              el2.duration && el2.duration.minutes ? el2.duration.minutes : 0;
            total_hours = total_hours + Number(hours);
            total_minutes = total_minutes + Number(minutes);
            stop_wait = this.getStopOverWait(el, el2, index);
            if (
              stop_wait &&
              stop_wait.airport_wait &&
              !Number.isNaN(stop_wait.airport_wait.hours) &&
              !Number.isNaN(stop_wait.airport_wait.minutes)
            ) {
              stop_hours = stop_hours + stop_wait.airport_wait.hours;
              stop_minutes = stop_minutes + stop_wait.airport_wait.minutes;
            }
            if (index !== 0) {
              stops.push(el2.boardAirport);
            }
          });
          hours_total = Number(total_hours) + Number(stop_hours);
          minute_total = Number(total_minutes) + Number(stop_minutes);
        }
        console.log("enter", stops);
        let obj1 = first_obj;
        let obj2 = second_obj;
        let airport1 = `${
          obj1.boardAirportDetail
            ? `${blankValueCheck(obj1.boardAirportDetail.cityName)}, ${
                obj1.boardAirportDetail.airportName
                  ? blankValueCheck(obj1.boardAirportDetail.airportName)
                  : ""
              }`
            : ""
        }`;
        let airport2 = obj2.offAirportDetail
          ? `${blankValueCheck(
              obj2.offAirportDetail.cityName
            )}, ${blankValueCheck(obj2.offAirportDetail.airportName)}`
          : obj1.offAirportDetail &&
            `${blankValueCheck(
              obj1.offAirportDetail.cityName
            )}, ${blankValueCheck(obj1.offAirportDetail.airportName)}`;
        return (
          <Row align="middle" className="fm-flight-ref" key={i}>
            <Col span={4} className="fm-airlogo-box">
              <img
                src={
                  first_obj
                    ? first_obj.logo
                    : require("../../../assets/images/airline-logo.jpg")
                }
                alt="airline-logo"
                // style={{ width: 40 }}
              />
              {/* <Text className="fm-airline-names">
                {first_obj ? blankValueCheck(first_obj.airline) : ""}
              </Text> */}
            </Col>
            <Col span={5}>
              <div className="fm-airline-status">
                <Text className="fm-airlinetime">{depTime}</Text>
                <Text className="fm-airportname">
                  <Tooltip
                    placement="bottom"
                    title={airport1}
                    overlayClassName="city-tool-tip"
                  >
                    {first_obj ? blankValueCheck(first_obj.boardAirport) : ""}
                  </Tooltip>
                </Text>
              </div>
            </Col>
            <Col span={9} align="center">
              <div className="fm-ailine-trip">
                <span className="fm-increment">
                  {el.length - 1 !== 0 ? `${el.length - 1}Stop` : "Non-stop"}{" "}
                  &nbsp;{stops.length !== 0 ? `(${stops.join(",")})` : ""}
                </span>
                <Text
                  className={
                    el.length > 1
                      ? "fm-aeroplane-lines"
                      : "fm-aeroplane-lines direct-flight"
                  }
                ></Text>
                <Text className="fm-timeduration">
                  {el.length > 1 ? "Nondirect" : "Direct"}&nbsp;&nbsp;
                  {hoursToMinutes(hours_total, minute_total)}
                </Text>
              </div>
            </Col>
            <Col span={5}>
              <div className="fm-airline-status">
                <Text className="fm-airlinetime">{arrivalTime}</Text>
                <Text className="fm-airportname">
                  <Tooltip
                    placement="bottom"
                    title={airport2}
                    overlayClassName="city-tool-tip"
                  >
                    {second_obj
                      ? blankValueCheck(second_obj.offAirport)
                      : first_obj
                      ? blankValueCheck(first_obj.offAirport)
                      : ""}{" "}
                  </Tooltip>
                </Text>
                <Text className="fm-airportname"></Text>
              </div>
            </Col>
          </Row>
        );
      });
    }
  };

  /**
   * @method renderFlightDetails
   * @description render flight return details
   */
  renderFlightDetails = (segmentList, segmenDetail) => {
    const { item, search_params, from_location, to_location } = this.props;
    let data = search_params;
    let from_country = "",
      to_country = "",
      cabinType = "";
    if (data) {
      from_country = from_location ? from_location : "";
      to_country = to_location ? data.to_location : "";
      cabinType = data.reqData ? data.reqData.cabin : "";
    }
    return (
      <Row className="fm-flight-outbox">
        {segmentList &&
          Array.isArray(segmentList) &&
          segmentList.map((el, i) => {
            let data = this.getStopOverWait(segmentList, el, i);
            let stop_wait = data && data.stop_wait;
            return (
              <>
                <Col span={4}>
                  <div className="fm-airline-status">
                    <Text className="fm-airlinetime">
                      {el.depTime
                        ? blankValueCheck(
                            moment(el.depTime, "hmm").format("hh:mm a")
                          )
                        : ""}
                    </Text>
                  </div>
                  <div className="fm-ailine-trip">
                    <Text className="fm-timeduration">
                      {/* {segmentList.length > 1 ? "Nondirect" : "Direct"} &nbsp;&nbsp; */}
                      {el.duration && el.duration.hours
                        ? `${blankValueCheck(el.duration.hours)}h`
                        : ""}{" "}
                      &nbsp;
                      {el.duration && el.duration.minutes
                        ? `${blankValueCheck(el.duration.minutes)}m`
                        : ""}
                    </Text>
                  </div>
                  <div className="fm-airline-status">
                    <Text className="fm-airlinetime">
                      {el.arrivalTime
                        ? blankValueCheck(
                            moment(el.arrivalTime, "hmm").format("hh:mm a")
                          )
                        : ""}
                      {/* <span className='fm-increment'>+1</span> */}
                    </Text>
                  </div>
                </Col>
                <Col span={1}>
                  <div className="fm-ailine-trip fm-vertical-trip">
                    <Text className="fm-aeroplane-lines"></Text>
                  </div>
                </Col>
                <Col span={18}>
                  <div className="fm-airline-status right-box">
                    <Text className="fm-airportname">
                      {el
                        ? `${blankValueCheck(el.boardAirport) ||
                            (el.boardAirportDetail &&
                            el.boardAirportDetail.cityName
                              ? `${blankValueCheck(
                                  el.boardAirportDetail.cityName
                                )}, ${
                                  el.boardAirportDetail.airportName
                                    ? blankValueCheck(
                                        el.boardAirportDetail.airportName
                                      )
                                    : ""
                                }`
                              : "")
                          }`
                        : ""}{" "}
                    </Text>
                    <div className="fm-airlogo-box">
                      <Row style={{ alignItems: "center" }}>
                        <Col span={6}>
                          <div className="fm-img-logo">
                            <img
                              src={
                                el
                                  ? el.logo
                                  : require("../../../assets/images/airline-logo.jpg")
                              }
                              alt=""
                              style={{ width: "30px", marginRight: "25px" }}
                            />
                          </div>
                        </Col>
                        <Col span={18}>
                          <div className="fm-moreairline-name">
                            {/* <Text className="fm-airline-names">
                          {el ? blankValueCheck(el.airline) : ""}
                        </Text> */}
                            <Text className="fm-airline-names">
                              {capitalizeFirstLetter(cabinType)},{" "}
                              {el ? `${blankValueCheck(el.aircraft)}` : ""}
                            </Text>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <Text className="fm-airportname">
                      {el
                        ? `${blankValueCheck(el.offAirport) ||
                            (el.offAirportDetail && el.offAirportDetail.cityName
                              ? `${blankValueCheck(
                                  el.offAirportDetail.cityName
                                )},  ${
                                  el.offAirportDetail.airportName
                                    ? blankValueCheck(
                                        el.offAirportDetail.airportName
                                      )
                                    : ""
                                }`
                              : "")
                          }`
                        : ""}
                    </Text>
                  </div>
                </Col>
                {i < segmentList.length - 1 && (
                  <Col span={24}>
                    <div className="fm-arrives-box">{`${stop_wait} Connect in airport`}</div>
                  </Col>
                )}
              </>
            );
          })}
        <Col span={24}>
          <div className="fm-arrives-box">
            Arrives:
            {segmenDetail && segmenDetail.arrivalDate
              ? moment(segmenDetail.arrivalDate, "DDMMYY").format(
                  "ddd, Do MMM YYYY"
                )
              : ""}
          </div>
        </Col>
      </Row>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isOpen } = this.state;
    const { index, item, search_params } = this.props;
    let outBoundData = "",
      returnData = "",
      segment1 = "",
      segment2 = "",
      oneWaySegment = "",
      returnSegment = "";
    if (item.segments && Array.isArray(item.segments) && item.segments.length) {
      outBoundData = item.segments[0];
      returnData = item.segments.length > 1 ? item.segments[1] : "";
      oneWaySegment =
        outBoundData && Array.isArray(outBoundData) && outBoundData.length
          ? outBoundData[0]
          : "";
      returnSegment =
        returnData && Array.isArray(returnData) && returnData.length
          ? returnData[0]
          : "";
    }
    if (
      item.segment_durations &&
      Array.isArray(item.segment_durations) &&
      item.segment_durations.length
    ) {
      segment1 = item.segment_durations[0];
      segment2 =
        item.segment_durations.length > 1 ? item.segment_durations[1] : "";
    }
    let type = search_params ? search_params.reqData.type : 1;
    let label = type === 1 ? "one_way" : type === 3 ? "multi_city" : "return";
    return (
      <div className={`fm-flight-wrap ${isOpen ? "fm-flight-wrap-brd" : ""}`}>
        <Row className="fm-airline-box">
          <Col lg={24} style={{ position: "relative" }}>
            <Text className="fm-fare-summary">
              {/* AU${salaryNumberFormate(item.total_price)} */}
              AU${salaryNumberFormate(Number(item.price) + Number(item.tax_amount))}
            </Text>
          </Col>
          <Col span={20}>{this.renderFlightSegament(item)}</Col>
          <Col span={4}>
            <div className="fm-fare-status">
              {/* <Text className="fm-fare-summary">
                AU${salaryNumberFormate(item.total_price)}
              </Text> */}
              <Text className="fm-trip-summary">
                {`${item.segments.length > 1 ? "Round trip" : "One Way"}`} price per <br />
                passenger
              </Text>
              <br />

              <Button
                className="fm-btn-select"
                onClick={() => {
                  if (this.props.isLoggedIn) {
                    let token = createRandomString();
                    this.props.setFlightToken(token);
                    this.props.history.push(
                      `/booking-tourism-flight/${label}/${item.counter}`
                    );
                  } else {
                    this.props.openLoginModel();
                  }
                }}
              >
                Select
              </Button>
            </div>
          </Col>
          <Col span={24}>
            <Collapse
              className="fm-more-details pt-0"
              ghost
              onChange={(e) => {
                console.log("collapes", e);
                if (e !== undefined && e.length !== 0) {
                  this.setState({ isOpen: true });
                } else {
                  this.setState({ isOpen: false });
                }
              }}
            >
              <Panel header="Flight details" key="1">
                <div className="fm-flight-collapse">
                  <Tabs defaultActiveKey={"1"}>
                    {type === 3 && (
                      <TabPane tab="Outbound" key="1">
                        {item.segments &&
                          Array.isArray(item.segments) &&
                          item.segments.length &&
                          item.segments.map((el, i) => {
                            return (
                              <Row>{this.renderFlightDetails(el, el[0])}</Row>
                            );
                          })}
                      </TabPane>
                    )}
                    {(type === 1 || type === 2) && (
                      <TabPane tab="Outbound" key="1">
                        {this.renderFlightDetails(outBoundData, oneWaySegment)}
                      </TabPane>
                    )}
                    {type === 2 && (
                      <TabPane tab="Return" key="2">
                        {this.renderFlightDetails(returnData, returnSegment)}
                      </TabPane>
                    )}
                  </Tabs>
                </div>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(null, {
  setFlightToken,
})(FlightListCard);
