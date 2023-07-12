import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Card, Row, Col, Rate, Typography } from "antd";
import Icon from "../../../components/customIcons/customIcons";
import {
  hotelSearchAPI,
  enableLoading,
  disableLoading,
} from "../../../actions";
import "./tourism-detail-card.less";
import moment from "moment";
const { Title, Text, Paragraph } = Typography;
class TourismDetailCard extends React.Component {
  /**
   * @method handleCardSelection
   * @description handle card selection
   */
  handleCardSelection = (el) => {
    if (el) {
      const parameter = this.props.match.params;
      let cat_id = parameter.categoryId;
      let cityCode = el.basicPropertyInfo.hotelCityCode;
      let hoteliCode = el.basicPropertyInfo.hotelCode;
      // this.props.setSelectedHotelDetails(el)
      // this.props.history.push(`/booking-tourism-hotel-detail/${cat_id}`);
      let reqData = {
        hotelCityCode: cityCode,
        radius: 300,
        hotelCode: hoteliCode,
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().add(7, "d").format("YYYY-MM-DD"),
        breakfast: false,
        maxRate: 50000,
        minRate: 50,
        rating: null,
        hotelAmenities: [],
        rooms: [{ totalAdults: 2, totalChildren: 1, childrenAges: [] }],
        maxPriceRange: 0,
      };
      this.props.enableLoading();
      // this.props.history.push({pathname: `/booking-tourism-hotel-detail/${cat_id}`,
      // state: {
      // reqData,
      // passedHotelData: el,
      // basic_info: el.basicPropertyInfo,
      // }
      // })
      this.props.hotelSearchAPI(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          console.log(
            "🚀 ~ file: TopRatedHotels.js ~ line 127 ~ TopRatedHotels ~ res",
            res
          );
          let hotels = res.data && res.data.data && res.data.data.data;
          let tmp;
          hotels.map((hotel) => {
            if (hotel.basicPropertyInfo.hotelCode == hoteliCode) {
              tmp = hotel;
            }
          });
          this.props.history.push({
            pathname: `/booking-tourism-hotel-detail/${cat_id}`,
            state: {
              reqData,
              passedHotelData: tmp ? tmp : hotels[0],
              basic_info: tmp
                ? tmp.basicPropertyInfo
                : hotels[0].basicPropertyInfo,
            },
          });
        }
      });
    }
  };

  render() {
    console.log(
      "===========================================================>",
      this.props
    );
    return (
      <Fragment>
        {/* <Link to={"/bookings-hotel-tourism/Tourism/55/Hotels/57"}> */}
        <Card
          bordered={false}
          className={"tourism-detail-card"}
          cover={
            <img
              //alt={tempData.discription}
              // src={props.image}
              src={require(`../../../assets/images/mbh/mbh${this.props.index}.jpg`)}
              onClick={() => this.handleCardSelection(this.props.hotel_details)}
            />
          }
          title={this.props.city}
        >
          {/* <div className="tag">Save 55%</div> */}
          <div className={"tourism-detail-card-top-section"}>
            <div className="left">
              <div className="rate-section">
                <Rate allowHalf defaultValue={3.0} />
              </div>
              <span className="total-views">{this.props.view} Views</span>
            </div>

            <div className={"right"}>
              <span>
                <Icon icon="location" size="10" className={"mr-6"} />
                {this.props.city}
              </span>
              <Icon
                icon={this.props.isFavorite ? "wishlist-fill" : "wishlist"}
                size="20"
                className={this.props.isFavorite ? "active" : ""}
                onClick={() => {
                  let fav = Number(this.props.isFavorite) === 1 ? 0 : 1;
                  this.props.handleLikeUnlike(this.props.hotel_details, fav);
                }}
              />
            </div>
          </div>
          <Row>
            <Col span={24}>
              <div className="category-box">
                <div className="category-name">
                  {this.props.hotel_details
                    ? this.props.hotel_details.basicPropertyInfo
                        .hotelSegmentCategory.hotelSegmentCategory
                    : ""}
                </div>
              </div>
              <div
                className="title"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {this.props.hotel_details
                  ? this.props.hotel_details.basicPropertyInfo.hotelName
                  : ""}
              </div>
              <div className="price-box">
                <div className="price">
                  {`$ ${
                    this.props.hotel_details
                      ? this.props.hotel_details.basicPropertyInfo.amount
                          .amountAfterTax
                      : 0
                  }`}
                  <sup className="sub-text">Per night</sup>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        {/* </Link> */}
        {/* <div className={"tourism-detail-card-bottom-section"}>
        <div className="date-info">
          <strong>2 Nights</strong> Sun, 19 Jan - Tue, 14 Jan
        </div>
      </div> */}
      </Fragment>
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
  enableLoading,
  disableLoading,
  hotelSearchAPI,
})(withRouter(TourismDetailCard));
// export default TourismDetailCard;
