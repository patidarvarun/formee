import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { Col, Card, Rate, Button, Row, Typography } from "antd";
import {
  getCarAvailabilityRates,
  setSelectedCarData,
  carSearchAPI,
  setCarReqData,
  getTopRentalCompany,
} from "../../../../actions/index";
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
const { Title, Text } = Typography;

class TopRentalCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topRentalComapny: [],
    };
  }

  /**
   * @method componentDidMount
   * @description called after mounting the component
   */
  componentWillMount() {
    this.props.getTopRentalCompany((res) => {
      if (res.status === 200) {
        let mostBook = res.data && res.data.data;
        this.setState({ topRentalComapny: mostBook });
      }
    });
  }

  /**
   * @method handleSelection
   * @description handle card selection
   */
  handleSelection = (item, index) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let prams = this.props.match.params;
    let cat_id = prams.categoryId;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let hours1 =
      item.pickupLocation &&
      item.pickupLocation.pickupWorkingTime &&
      item.pickupLocation.pickupWorkingTime.beginDateTime
        ? item.pickupLocation.pickupWorkingTime.beginDateTime.hour
        : "";
    let minutes1 =
      item.pickupLocation &&
      item.pickupLocation.pickupWorkingTime &&
      item.pickupLocation.pickupWorkingTime.beginDateTime
        ? item.pickupLocation.pickupWorkingTime.beginDateTime.minutes
        : "";
    let hours2 =
      item.dropoffLocation &&
      item.dropoffLocation.dropoffWorkingTime &&
      item.dropoffLocation.dropoffWorkingTime.beginDateTime
        ? item.dropoffLocation.dropoffWorkingTime.endDateTime.hour
        : "";
    let minutes2 =
      item.dropoffLocation &&
      item.dropoffLocation.dropoffWorkingTime &&
      item.dropoffLocation.dropoffWorkingTime.beginDateTime
        ? item.dropoffLocation.dropoffWorkingTime.endDateTime.minutes
        : "";

    let pick_up_latlng = {
      lat:
        item.pickupLocation && item.pickupLocation.geoLocation
          ? item.pickupLocation.geoLocation.latitude
          : "",
      lng:
        item.pickupLocation && item.pickupLocation.geoLocation
          ? item.pickupLocation.geoLocation.longitude
          : "",
    };
    let drop_up_latlng = {
      lat:
        item.dropoffLocation && item.dropoffLocation.geoLocation
          ? item.dropoffLocation.geoLocation.latitude
          : "",
      lng:
        item.dropoffLocation && item.dropoffLocation.geoLocation
          ? item.dropoffLocation.geoLocation.longitude
          : "",
    };
    let values = {
      pick_up_date: moment().add(1,"days").format("YYYY-MM-DD"), //moment(today).format("YYYY-MM-DD"),
      drop_of_date: moment().add(2,"days").format("YYYY-MM-DD"), //moment(tomorrow).format("YYYY-MM-DD"),
      hours1: "12", //hours1 >= 10 ? hours1 : `0${hours1}`,
      hours2: "12", //hours2 >= 10 ? hours2 : `0${hours2}`,
      minutes1: "00", //minutes1 >= 10 ? minutes1 : `0${minutes1}`,
      minutes2: "00" //minutes2 >= 10 ? minutes2 : `0${minutes2}`,
    };

    // let start_time = `${values.hours1 ? values.hours1 : "12"}:${
    //   values.minutes1 ? values.minutes1 : "00"
    // }`;
    // let start_date = values.pick_up_date
    //   ? `${moment(values.pick_up_date).format("YYYY-MM-DD")} ${start_time}`
    //   : "";
    // let end_time = `${values.hours2 ? values.hours2 : "12"}:${
    //   values.minutes2 ? values.minutes2 : "00"
    // }`;
    // let end_date = values.drop_of_date
    //   ? `${moment(values.drop_of_date).format("YYYY-MM-DD")} ${end_time}`
    //   : "";
    let start_time = "12:00";
    let start_date = `${moment().add(1,"days").format("YYYY-MM-DD")} ${start_time}`;
    let end_date = `${moment().add(2,"days").format("YYYY-MM-DD")} ${start_time}`;
    let reqData = {
      startDate: start_date ? start_date : "",
      endDate: end_date ? end_date : "",
      isSamePickAndDrop: 1,
      pickupLocationLat: pick_up_latlng ? pick_up_latlng.lat : "",
      pickupLocationLng: pick_up_latlng ? pick_up_latlng.lng : "",
      dropoffLocationLat: drop_up_latlng ? drop_up_latlng.lat : "",
      dropoffLocationLng: drop_up_latlng ? drop_up_latlng.lng : "",
      userId: isLoggedIn ? loggedInDetail.id : "",
      rentalCodes: "ZE,ZI",
    };
    const default_values = {
      pick_up_location: item.pickupLocation
        ? item.pickupLocation.addressLine1
        : "",
      drop_up_location: item.dropoffLocation
        ? item.dropoffLocation.addressLine1
        : "",
      pick_up_latlng: pick_up_latlng,
      drop_up_latlng: drop_up_latlng,
      isDropOf: 1,
      values: values,
      reqData,
    };
    console.log("🚀 ~ file: TopRentalcards.js ~ line 141 ~ TopRentalCompany ~ default_values", default_values)
    this.props.setCarReqData(default_values);
    this.props.enableLoading();
    this.props.carSearchAPI(reqData, (res) => {
      this.props.disableLoading();
      console.log("res", res);
      if (res.status === 200) {
        // let sessionId = res.data && res.data.sessionId;
        // let car_reqdata = {
        //   reqData,
        // };
        // let err = res.data && res.data.err ? true : false;
        // if (!err) {
        //   this.callRateAvalabilityRate(car_reqdata, item, index, sessionId);
        // }
        let prams = this.props.match.params;
        let cat_id = prams.categoryId;
        let cat_name = prams.categoryName;
        let sub_cat_name = prams.subCategoryName;
        let sub_cat_id = prams.subCategoryId;
        this.props.history.push(`/booking-tourism-car-carlist/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`);
        this.props.disableLoading()
      }
    });
  };

  /**
   * @method callRateAvalabilityRate
   * @description call car availability rates
   */
  callRateAvalabilityRate = (car_reqdata, data, index, sessionId) => {
    console.log("sessionId", sessionId);
    let search_data = car_reqdata.reqData;
    let reqData = {
      startDate: search_data && search_data.startDate,
      endDate: search_data && search_data.endDate,
      isSamePickAndDrop: search_data && search_data.isSamePickAndDrop,
      pickupLocationLat: search_data && search_data.pickupLocationLat,
      pickupLocationLng: search_data && search_data.pickupLocationLng,
      dropoffLocationLat: search_data && search_data.dropoffLocationLat,
      dropoffLocationLng: search_data && search_data.dropoffLocationLng,
      param: data.param,
      sessionId: sessionId && sessionId,
    };

    let selected_data = {
      selected_car: data,
      carRate: "",
    };
    this.props.setSelectedCarData(selected_data);
    this.props.getCarAvailabilityRates(reqData, (res) => {
      if (res.status === 200) {
        let carRate = res.data && res.data.carRate;
        let selected_data = {
          selected_car: data,
          carRate: carRate,
        };
        this.props.setSelectedCarData(selected_data);
      }
      this.props.history.push(`/booking-tourism-car-detail/${index}`);
    });
  };

  renderCarCompany = () => {
    const { topRentalComapny } = this.state;
    if (topRentalComapny && topRentalComapny.length) {
      return topRentalComapny.slice(0, 9).map((el, i) => {
        let item = el.car_details;
        if (item) {
          return (
            <Col
              className="gutter-row"
              md={8}
              key={i}
              onClick={() => this.handleSelection(item, i)}
              style={{ cursor: "pointer" }}
            >
              <Card
                bordered={false}
                className={"tourism-toprated-car-card"}
                cover={
                  <img
                    alt={""}
                    src={item.carImage ? item.carImage : DEFAULT_IMAGE_CARD}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE_CARD;
                    }}
                  />
                }
              >
                <Row className={"mb-10"}>
                  <Col span={16}>
                    <div className="rate-section">
                      <Rate allowHalf defaultValue={el.rating} />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="europcar" align="right">
                      <img
                        alt=""
                        src={item.companyLogo ? item.companyLogo : ""}
                      />
                    </div>
                  </Col>
                </Row>
                {/* <div className="tag">{item.offer}</div> */}
                <div className="subcategory">{"Cars"}</div>
                <Text className="sub-title">{item.carModel}</Text>
                <div className="price-box">
                  <div className="price">
                    <Text className="from">From</Text>$
                    {item.tariffInfo &&
                    item.tariffInfo.rate &&
                    item.tariffInfo.rate.rateAmount
                      ? item.tariffInfo.rate.rateAmount
                      : ""}
                    <Text className="per-day">Per day</Text>
                  </div>
                </div>
              </Card>
            </Col>
          );
        }
      });
    }
  };

  /**
   * @method render
   * @description render components
   */
  render() {
    const { topRentalComapny } = this.state;
    const { see_all } = this.props;
    let prams = this.props.match.params;
    let cat_id = prams.categoryId;
    return (
      <>
        <Row gutter={[28, 60]} className="pt-50">
          {this.renderCarCompany()}
        </Row>
        {topRentalComapny &&
          topRentalComapny.length > 9 &&
          see_all === undefined && (
            <div className="align-center pb-40">
              <Link
                to={`/booking-tourism-see-all/${"top_rental_company"}/${cat_id}`}
              >
                <Button
                  type="default"
                  size={"middle"}
                  className="fm-btn-orange"
                >
                  {"See All"}
                </Button>
              </Link>
            </div>
          )}
      </>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};

export default connect(mapStateToProps, {
  getCarAvailabilityRates,
  setSelectedCarData,
  carSearchAPI,
  setCarReqData,
  getTopRentalCompany,
})(TopRentalCompany);
