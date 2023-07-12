import React, { Fragment } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Row, Col, Rate, Typography } from "antd";
import { DEFAULT_IMAGE_CARD } from "../../../config/Config";
import Icon from "../../../components/customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  markCarAsFav,
  carSearchAPI,
  openLoginModel,
  setSelectedCarData,
  getCarAvailabilityRates,
} from "../../../actions/index";
import { HeartOutlined } from "@ant-design/icons";
import { langs } from "../../../config/localization";
import LeaveReviewModel from "./LeaveReviewModal";
import { salaryNumberFormate } from "../../common";
import "../bookingDetailCard/bookingDetailCard.less";
import "../bookingCarDetail/bookingCarDetail.less";
import "./carListDetail.less";
// import { Button } from "bootstrap";

const { Paragraph } = Typography;

class CarListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewModel: false,
    };
  }

  /**
   * @method refereshSearch
   * @description Call Action for Classified Search
   */
  refereshSearch = () => {
    console.log("refresh >>&&*", this.props.car_reqdata);
    this.props.enableLoading();
    this.props.carSearchAPI(this.props.car_reqdata.reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let data = res.data && res.data.data;
        this.props.handleSearchResponce(data, false, this.props.car_reqdata);
      } else {
        this.props.handleSearchResponce([], false, {});
      }
    });
  };

  handleCardSelection = (i, data) => {
    const { car_reqdata, carSearchRecords } = this.props;
    console.log(data, "car_reqdata");
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
      sessionId: carSearchRecords && carSearchRecords.sessionId,
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
      console.log("res", res);
      this.props.history.push(`/booking-tourism-car-detail/${i}`);
    });
  };

  render() {
    const { data, favList, index, viewCount, rateList } = this.props;
    const { reviewModel } = this.state;
    let rateIndex = rateList.findIndex(
      (el) =>
        el.id === data.param.rateIdentifier &&
        Array.isArray(el.rating) &&
        el.rating[0].average_rating !== null
    );
    let countIndex = viewCount.findIndex(
      (el) => el.id === data.param.rateIdentifier && el.count > 0
    );
    let count = countIndex >= 0 ? viewCount[countIndex].count : 0;
    let rate =
      rateIndex >= 0 ? rateList[rateIndex].rating[0].average_rating : 0;

    console.log("count: &&*", rate);
    let n = data.pickupLocation.city
      .replace(/[\[\]?.,\/#!$%\^&\*;:{}=\\|_~()]/g, "")
      .split(" ");
    let cityNum = n[n.length - 1];
    let city = data.pickupLocation.city.replace(cityNum, "");
    return (
      <div className="car-list-detail">
        <Fragment>
          <div
            className={"booking-detail-card booking-car-detail "}
            onClick={() => this.handleCardSelection(index, data)}
            style={{ cursor: "pointer" }}
          >
            <Row>
              <Col lg={9}>
                <div className="car-preview-pic">
                  {/* <div className="tag">
                    Save
                    55%
                  </div> */}
                  <img
                    // src={data && data.carImage ? data.carImage : require("../../../assets/images/bigcar.png")}
                    src={
                      data && data.carImage
                        ? data.carImage
                        : require("../../../assets/images/bigcar.png")
                    }
                    // src={require("../../../assets/images/bigcar.svg")}
                    alt="car"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = require("../../../assets/images/bigcar.png");
                    }}
                  />
                </div>
              </Col>
              <Col lg={10}>
                <div className="rating-view-location-box">
                  <div
                    className="rate-section"
                    // onClick={() => {
                    //   this.setState({ reviewModel: true });
                    //   // this.handleCardSelection(index)
                    // }}
                  >
                    {/* {`${rate}.0`} */}
                    <Rate allowHalf value={`${rate}.0`} />
                  </div>
                  <Paragraph className="similar-sub-text">
                    {count} views
                  </Paragraph>
                  <div className="location">
                    <Icon icon="location" size="14" /> {city}
                    {/* {data && data.pickupLocation && data.pickupLocation.city} */}
                  </div>
                </div>
                <div className="category-box">
                  <div className="category-name">{"Car"}</div>
                </div>
                <div
                  className="title"
                  // style={{
                  //   whiteSpace: "nowrap",
                  //   overflow: "hidden",
                  //   textOverflow: "ellipsis",
                  // }}
                >
                  {data && data.carModel}
                </div>
                <Paragraph className="similar-sub-text">or similar</Paragraph>
                {/* <Paragraph className="similar-sub-text">{count} views</Paragraph>

                <div className="category-box">
                  <div className="category-name">{"Car"}</div>
                </div> */}
                {/* <div className="car-info align-left">
                  <strong>4 Seats I 4 Doors</strong> <br />
                  Intermediate
                  <strong>{data && data.carDetails ? `${data.seatingCapacity} seats ${data.carDetails.ac} ${data.carDetails.doors} ${data.carDetails.size}` : ''}</strong> <br />
                  {data && data.carDetails && data.carDetails.transmission}
                </div> */}
              </Col>
              <Col lg={5} className="text-right">
                <div className="ero-sub-box">
                  <Paragraph className="sp-sub-text">
                    Service provided <br /> by partner
                  </Paragraph>
                  <div className="europcar">
                    <img
                      src={
                        data.companyLogo
                          ? data.companyLogo
                          : require("../../../assets/images/euro.png")
                      }
                    />
                  </div>
                </div>
                <div className="price-box">
                  <div className="price">
                    $
                    {data &&
                      data.tariffInfo &&
                      data.tariffInfo.total &&
                      salaryNumberFormate(data.tariffInfo.total.rateAmount)}
                    <Paragraph className="sub-text">per day</Paragraph>
                    {/* <div className="europcar">
                      <img
                        src={data.companyLogo ? data.companyLogo : require("../../../assets/images/euro.png")}
                      />
                    </div> */}
                    {/* <Paragraph className="sp-sub-text">
                      Service provided by partner
                    </Paragraph> */}
                    {/* <div className="location">
                      <Icon icon="location" size="14" /> {data && data.pickupLocation && data.pickupLocation.city}
                    </div> */}
                  </div>
                </div>
              </Col>
              {/* <Col span={12}>&nbsp;</Col>
              <Col span={4} align="center">
                <Icon icon="email" size="20" />
              </Col>
              <Col span={4} align="center" onClick={() => this.markFavCar(data, isFavorite)}>
                {isFavorite >= 0 ? <HeartOutlined className={isFavorite >= 0 ? 'active' : ''} />
                  : <Icon icon="wishlist" size="20" />}
              </Col>
              <Col span={4} align="center">
                <Icon icon="view" size="20" />
              </Col> */}
            </Row>
          </div>
          {reviewModel && (
            <LeaveReviewModel
              visible={reviewModel}
              onCancel={() => this.setState({ reviewModel: false })}
              //bookingDetail={bookingDetail && bookingDetail}
              //callNext={this.props.getDetails}
              // type={type}
            />
          )}
        </Fragment>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { carList, car_reqdata } = tourism;
  console.log(car_reqdata, "carList", carList);
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    carSearchRecords: carList,
    car_reqdata,
    // carListing: carList && carList.rates && Array.isArray(carList.rates) && carList.rates.length ? carList.rates : []
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  markCarAsFav,
  carSearchAPI,
  openLoginModel,
  setSelectedCarData,
  getCarAvailabilityRates,
})(CarListDetail);
