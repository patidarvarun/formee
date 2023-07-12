import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { Typography, Button } from "antd";
import {
  salaryNumberFormate,
  formateTime,
  displayInspectionDate,
  dateFormate7,
  dateFormat4,
} from "../../../../common";
import {
  tourismCarBookingAPI,
  enableLoading,
  disableLoading,
  tourismCarPaypalAPI
} from "../../../../../actions";
import { DEFAULT_IMAGE_CARD } from "../../../../../config/Config";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/booking-form.less";
const { Title, Text } = Typography;

class CarBookingDetailBlock extends React.Component {


  tourismCarBooking = () => {
    const { pnrNumber, selectedCar, selectedCard, car_reqdata, step1Data } = this.props;
    let reqData = {
      car_details: selectedCar && selectedCar.selected_car,
      pnr_number: pnrNumber,
      start_date: car_reqdata.reqData.startDate,
      end_date: car_reqdata.reqData.endDate,
      total_price: selectedCar && selectedCar.selected_car && selectedCar.selected_car.tariffInfo && selectedCar.selected_car.tariffInfo.total &&  Number(selectedCar.selected_car.tariffInfo.total.rateAmount),
      payment_method: "stripe",
      payment_source_id: selectedCard,
      is_prepay: 1
    };
    // if(step1Data && step1Data.addedtotal){
    //   reqData.total_price += +step1Data.addedtotal
    //   reqData = +reqData.toFixed(2);
    // }
    // const formData = new FormData();
    // Object.keys(reqData).forEach((key) => {
    //   if (typeof reqData[key] == "object") {
    //     formData.append(key, JSON.stringify(reqData[key]));
    //   } else {
    //     formData.append(key, reqData[key]);
    //   }
    // });
    this.props.tourismCarBookingAPI(reqData, (res) => {
      if (res.status === 200) {
        this.props.showSuccessBooking(true, res.data.intent.metadata.car_booking_id);
        toastr.success("Car has been booked sucessfully.");
      }
    });
  }
  /**
   * @method render
   * @description render the component
   */
  render() {
    const {step1Data, step2Data, selectedCar, car_reqdata, isCheckout, selectedCard, terms } = this.props;
    let tmperr = Object.keys(step1Data.specialequip)
    console.log("🚀 ~ file: CarBookingBlock.js ~ line 63 ~ CarBookingDetailBlock ~ render ~ this.props", this.props)
    console.log(car_reqdata, "@selectedCar", selectedCar);
    let data = selectedCar && selectedCar.selected_car;
    let values =
      Object.keys(car_reqdata.values).length !== 0 ? car_reqdata.values : "";
    let date1 = values && new Date(dateFormat4(values.pick_up_date)),
      date2 = values && new Date(dateFormat4(values.drop_of_date));
    var Days = Math.floor(
      (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
    );
    let start_time =
      values &&
      `${values.hours1 ? values.hours1 : "00"}:${
        values.minutes1 ? values.minutes1 : "00"
      }`;
    let end_time =
      values &&
      `${values.hours2 ? values.hours2 : "00"}:${
        values.minutes2 ? values.minutes2 : "00"
      }`;
    return (
      <Fragment>
        <div className="car-right-your-booking-box-1">
          <Title level={1} className="sidebar-heading">
            Your Booking
          </Title>

          <div className="information title-information">
            <img
              src={data && data.carImage ? data.carImage : DEFAULT_IMAGE_CARD}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE_CARD;
              }}
            />

            <div className="title-information-right">
              <Title level={3}>{data && data.carModel}</Title>
              <Text>
                {data && data.carDetails && data.carDetails.transmission}
              </Text>
              <img
                src={
                  data.companyLogo
                    ? data.companyLogo
                    : require("../../../../../assets/images/euro.png")
                }
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = require("../../../../../assets/images/euro.png");
                }}
              />
            </div>
          </div>

          {isCheckout ? (
          <>
          <div className="date-information">
            <Title level={2}>
              {values && dateFormate7(values.pick_up_date)} -{" "}
              {values && dateFormate7(values.drop_of_date)}
            </Title>
            <div>{Days && Math.abs(Days)} day/s</div>
            <div className="chng-txt">
              {data
                ? `${data.seatingCapacity} Seats | ${data.numberOfDoors} Doors`
                : ""}
              <span onClick={() => this.props.history.goBack()}>Change</span>
            </div>
          </div>

          <div className="information place-information-container">
            <div className="place-infromation-div">
              <p className="highlight">Pick-up</p>
              <p>{data.pickupLocation && data.pickupLocation.addressLine1}</p>
              <p>{data.pickupLocation && data.pickupLocation.country}</p>
              <p className="highlight">
                {values && displayInspectionDate(values.pick_up_date)}
              </p>
              <p>{start_time && formateTime(start_time)}</p>
            </div>

            <div className="place-infromation-div">
              <p className="highlight">Drop-off</p>
              <p>{data.dropoffLocation && data.dropoffLocation.addressLine1}</p>
              <p>{data.dropoffLocation && data.dropoffLocation.country}</p>
              <p className="highlight">
                {values && displayInspectionDate(values.drop_of_date)}
              </p>
              <p>{end_time && formateTime(end_time)}</p>
            </div>
          </div>
          </>
          ) : 
          (
          <>
            <div className="date-information">
              <Title level={2}>
                Pick-Up :
              </Title>
              <div>{data.pickupLocation && data.pickupLocation.addressLine1}{data.pickupLocation && data.pickupLocation.country}</div>
              <div>
                {values && displayInspectionDate(values.pick_up_date)}
              </div>
            </div>
            <div className="date-information">
              <Title level={2}>
                Drop-Off :
              </Title>
              <div>{data.dropoffLocation && data.dropoffLocation.addressLine1}{data.dropoffLocation && data.dropoffLocation.country}</div>
              <div>
                {values && displayInspectionDate(values.drop_of_date)}
              </div>
            </div>
            <div className="date-information">
              <Title level={2}>
                Total Days :
              </Title>
              <div>{Days && Math.abs(Days)} day/s</div>
            </div>
            <div className="date-information">
              <Title level={2}>
                Add more options :
              </Title>
              {step1Data.selected_assistance.map((e) => {
                return <div>{e.name}</div>
              })}
              {step1Data.selected_coverage.map((e) => {
                return <div>{e.name}</div>
              })}
              {tmperr.map((e) => {
                if(step1Data.specialequip[e]){
                  return <div>{e}</div>
                }
              })}
              {/* <div>Full Coverage</div> */}
            </div>

            <div className="date-information drivername">
              <Title level={2}>
                Driver Name :
              </Title>
              <div>{`${step2Data.firstName} ${step2Data.lastName}`}</div>
            </div>
            <div className="date-information">
              <Title level={2}>
                Driver Ages :
              </Title>
              <div>{step2Data.age}</div>
            </div>
            <div className="date-information">
              <Title level={2}>
                Email Address :
              </Title>
              <div>{step2Data.email}</div>
            </div>
            <div className="date-information">
              <Title level={2}>
                Phone Number :
              </Title>
              <div>{step2Data.phone}</div>
            </div>
            <div className="date-information">
              <Title level={2}>
                Country of Residence :
              </Title>
              <div>{step2Data.country}</div>
            </div>
          </>
          )
          }

          {/*<div className="information price-information">
             <p>Price (2 rooms x 1 night)</p>
            <p>$89.20</p> 
          </div>*/}

          <div className="information payment-information subtotal-title">
            <div>
              <p>Subtotal</p>
              <p>Taxes and surcharges</p>
              <p className="highlight">Total</p>
              <p className="small-text">Incl. taxes & fees</p>
            </div>

            <div>
              <p>
                ${step1Data && salaryNumberFormate(step1Data.total_amount)}
              </p>
              {/* <p>${(+step1Data.addedtotal).toFixed(2)}</p> */}
              <p>${"00.00"}</p>
              <p className="highlight">
                ${step1Data && salaryNumberFormate(step1Data.total_amount)}
              </p>
            </div>
          </div>
          {isCheckout ? (
            <Button
              className="checkout-btn"
              block
              //onClick={this.props.changeNextStep}
              form={"car-checkout-form"}
              htmlType="submit"
              // disabled={!terms}
            >
              Checkout
            </Button>
          ) : (
            <Button
              className="checkout-btn"
              block
              htmlType="button"
              type="primary"
              onClick={this.tourismCarBooking}
              disabled={selectedCard === "" || selectedCard === undefined}
            >
              Pay
            </Button>
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { tourism } = store;
  const { car_reqdata } = tourism;
  return {
    car_reqdata,
  };
};

export default connect(
  mapStateToProps,
  {
    tourismCarBookingAPI,
    enableLoading,
    disableLoading,
    tourismCarPaypalAPI
  }
)(withRouter(CarBookingDetailBlock));
