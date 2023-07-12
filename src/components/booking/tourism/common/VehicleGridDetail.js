import React, { Fragment } from "react";
import moment from 'moment'
import { Row, Col } from "antd";
import {blankValueCheck,getTimeDifference, capitalizeFirstLetter } from '../../../common';
import "@ant-design/icons";
import "./css/vehicle-grid-detail.less";

class VehicleGridDetail extends React.Component {

  
  getStopOverWait = (segmentList, el, i) => {
    let arrival_time = el.arrivalTime ? moment(el.arrivalTime, "Hmm").format("HH:mm") : ""
    let dep_time = segmentList[i+1] && segmentList[i+1].depTime ? moment(segmentList[i+1].depTime, "hmm").format("HH:mm") : ""
    let arrivalDate1 = moment(el.arrivalDate, "DDMMYY").format("DD-MMM-YYYY")
    let arrivalDate2 = segmentList[i+1] && segmentList[i+1].arrivalDate && moment(segmentList[i+1].arrivalDate, "DDMMYY").format("DD-MMM-YYYY")
    let date1 = `${arrivalDate1} ${arrival_time}`
    let date2 = `${arrivalDate2} ${dep_time}`
    let airport_wait = getTimeDifference(date1,date2)
    let stop_wait =  `${airport_wait.hours}h ${airport_wait.minutes}m`
    return {
      airport_wait,
      stop_wait
    }
  }
  
  render() {
    const { params, data } = this.props
    if (data && Array.isArray(data) && data.length) {
      return data.map((el, i) => {
        let item = this.getStopOverWait(data, el, i)
        let stop_wait = item && item.stop_wait
        return (
          <Fragment>
            <Row className="vhcl-detail-body">
              <Col md={1}>
                <div className="vhcl-logo">
                  <img
                    src={el ? el.logo : require('../../../../assets/images/airline-logo.jpg')}
                    alt="vhcl-logo"
                  />
                </div>
              </Col>
              <Col md={11}>
                <div className="vhcl-name-box">
                  <div className="vhcl-name">
                    <p>
                      {/* {el ? el.boardAirport : ''}&nbsp;&nbsp; */}
                      {/* {from_location ? from_location : ''} */}
                      {el && el.boardAirport ? el.boardAirport : (el.boardAirportDetail ? `${blankValueCheck(el.boardAirportDetail.cityName)} ${blankValueCheck(el.boardAirportDetail.airportName)}` : '')}
                      <span>
                        {el && el.depDate ? moment(el.depDate, "DDMMYY").format('ddd, Do MMM YYYY') : ''}
                        <span className="vhcl-inner-time">{el  && el.depTime ? moment(el.depTime, "hmm").format("hh:mm a") : ''}</span>
                      </span>
                    </p>
                  </div>
                  <div className="vhcl-name second-vhcl-name">
                    <p>
                      {/* {el ? blankValueCheck(el.offAirport) : ''}&nbsp;&nbsp; */}
                      {/* {to_location ? to_location : ''} */}
                      {el && el.offAirport ? blankValueCheck(el.offAirport) : (el.offAirportDetail ? `${blankValueCheck(el.offAirportDetail.cityName)} ${blankValueCheck(el.offAirportDetail.airportName)}` : '')}
                      <span>
                        {el && el.arrivalDate ? moment(el.arrivalDate, "DDMMYY").format('ddd, Do MMM YYYY') : ''}
                        <span className="vhcl-inner-time">{el && el.arrivalTime ? moment(el.arrivalTime, "hmm").format("hh:mm a") : ''}</span>
                      </span>
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="vhcl-type">
                  <p>
                    <span className="vhcl-dgt-name">{blankValueCheck(el.airline)}</span>{blankValueCheck(el.aircraft)}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="vhcl-type text-right">
                  <p>
                    <span className="vhcl-dgt-name-inner">
                    {el.duration && el.duration.hours ? `${blankValueCheck(el.duration.hours)}h` : ""}&nbsp;{el.duration && el.duration.minutes ? `${blankValueCheck(el.duration.minutes)}m` : ""}&nbsp;&nbsp;
                      {params && params.reqData ? capitalizeFirstLetter(params.reqData.cabin) : ''} class
                    </span>
                  </p>
                </div>
              </Col>
            </Row>
             {i < data.length - 1 && <div className='vchl-concern-box'>
              <div>
                <span className="concern-time">
                  {stop_wait}
                </span>
                Connect in airport
              </div>
              
            </div>}
          </Fragment>
        );
      })
    }
  }
}

export default VehicleGridDetail;
