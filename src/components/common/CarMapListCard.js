import React from "react";
import { connect } from "react-redux";
import { Card, Rate, Typography } from "antd";
import { DEFAULT_IMAGE_CARD } from "../../config/Config";
import {
  setSelectedCarData,
  getCarAvailabilityRates,
  enableLoading,
  disableLoading,
} from "../../actions";
import { capitalizeFirstLetter } from "../common";
const { Paragraph } = Typography;

class CarMapListCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      favoriteItem: [],
    };
  }

  /**
   * @method handleCardSelection
   * @description handle card selection
   */
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

  /**
   * @method render
   * @description render component
   */
  render() {
    const { data, index } = this.props;
    const { subCategoryName } = this.props.pathData;
    return (
      <Card
        bordered={false}
        className={"map-product-card"}
        style={{ cursor: "pointer" }}
        onClick={() => this.handleCardSelection(index, data)}
        cover={
          <img
            alt={data.discription}
            src={data.carImage ? data.carImage : DEFAULT_IMAGE_CARD}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_IMAGE_CARD;
            }}
            alt={data.carModel ? data.carModel : ""}
          />
        }
      >
        <div className="text-right price-box pb-0">
          <div className="price">
            {data &&
            data.tariffInfo &&
            data.tariffInfo.total &&
            data.tariffInfo.total.rateAmount
              ? `$${data.tariffInfo.total.rateAmount}`
              : ""}
            <sup style={{ fontSize: "8px" }}> AU</sup>
          </div>
        </div>
        <div className="rate-section">
          <Rate allowHalf defaultValue={3.0} />
        </div>
        <div className="product-name-price">
          <div className="title classified-detail">
            {capitalizeFirstLetter(data.carModel)}
          </div>
          <Paragraph className="similar-sub-text mb-2">or similar</Paragraph>
          <div className="d-flex">
            {" "}
            <div className="sub-cat">{subCategoryName}</div>
            <div className="ero-sub-box"></div>
            <div className="europcar">
              <img
                src={
                  data.companyLogo
                    ? data.companyLogo
                    : require("../../assets/images/euro.png")
                }
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common, tourism } = store;
  const { carList, car_reqdata } = tourism;
  const { isOpenLoginModel, favoriteId } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
    isOpenLoginModel,
    favoriteId,
    carSearchRecords: carList,
    car_reqdata,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  setSelectedCarData,
  getCarAvailabilityRates,
})(CarMapListCard);
