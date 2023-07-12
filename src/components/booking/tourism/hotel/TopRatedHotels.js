import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import Icon from "../../../customIcons/customIcons";
import { Card, Layout, Row, Col, Typography, Button, Rate } from "antd";
import {
  hotelSearchAPI,
  openLoginModel,
  setSelectedHotelDetails,
  markFavUnFavHotels,
  getTopRatedHotels,
  enableLoading,
  disableLoading,
  restaurantAutocompleteNew,
} from "../../../../actions";
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
import { salaryNumberFormate } from "../../../common";
import "../../../common/bannerCard/bannerCard.less";
import "../tourism.less";
import "./hotel.less";
import moment from "moment";
const { Content } = Layout;
const { Title, Text } = Typography;

class TopRatedHotels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: false,
      topRatedHotelList: [],
    };
  }

  /**
   * @method componentDidMount
   * @description called after mounting the component
   */
  componentDidMount() {
    this.getTopRatedHotelsDetails();
  }

  /**
   * @method getTopRatedHotelsDetails
   * @description get top rated hotels details
   */
  getTopRatedHotelsDetails = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData = {
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getTopRatedHotels(reqData, (res) => {
      if (res.status == 200) {
        let data = res.data && res.data.data;
        this.setState({ topRatedHotelList: data });
      }
    });
  };

  /**
   * @method handleLikeUnlike
   * @description handle like unlike
   */
  handleLikeUnlike = (selectedHotel, fav) => {
    const { loggedInDetail, isLoggedIn } = this.props;
    if (isLoggedIn) {
      let code =
        selectedHotel.basicPropertyInfo &&
        selectedHotel.basicPropertyInfo.hotelCode;
      let info =
        selectedHotel.descriptiveInfo &&
        Array.isArray(selectedHotel.descriptiveInfo) &&
        selectedHotel.descriptiveInfo.length
          ? selectedHotel.descriptiveInfo[0]
          : "";
      let image =
        info && Array.isArray(info.hotelImages) && info.hotelImages.length
          ? info.hotelImages[0]
          : "";
      let reqData = {
        userId: isLoggedIn ? loggedInDetail.id : "",
        hotel_id: code,
        HotelBasicJson: {
          HotelName: info ? info.hotelName : "",
          HotelName: info ? info.hotelName : "",
          HotelImage: image,
        },
        HotelDetailsJson: selectedHotel,
        isFavorite: fav,
      };

      let formData = new FormData();
      Object.keys(reqData).forEach((key) => {
        if (typeof reqData[key] == "object") {
          formData.append(key, JSON.stringify(reqData[key]));
        } else {
          formData.append(key, reqData[key]);
        }
      });
      this.props.enableLoading();
      this.props.markFavUnFavHotels(formData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          toastr.success(
            langs.success,
            fav === 0
              ? "Hotel has been sucessfully marked as un favorite"
              : "Hotel has been sucessfully marked as favorite"
          );
          this.setState({ isFav: fav });
          this.getTopRatedHotelsDetails();
        }
      });
    } else {
      this.props.openLoginModel();
    }
  };

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
      this.props.hotelSearchAPI(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
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

  /**
   * @method renderTopRatedCards
   * @description render top rated cards
   */
  renderTopRatedCards = () => {
    const { topRatedHotelList } = this.state;
    if (
      topRatedHotelList &&
      Array.isArray(topRatedHotelList) &&
      topRatedHotelList.length
    ) {
      return topRatedHotelList.map((el, i) => {
        let basic_info =
          el.hotel_details && el.hotel_details.basicPropertyInfo
            ? el.hotel_details.basicPropertyInfo
            : "";
        let info =
          el.hotel_details &&
          el.hotel_details.descriptiveInfo &&
          Array.isArray(el.hotel_details.descriptiveInfo) &&
          el.hotel_details.descriptiveInfo.length
          ? el.hotel_details.descriptiveInfo[0]
          : "";
          let image =
          info && Array.isArray(info.hotelImages) && info.hotelImages.length
            ? info.hotelImages[0]
            : "";
        let price =
          basic_info.amount && basic_info.amount.amountAfterTax
            ? basic_info.amount.amountAfterTax
            : 0;
        return i > 15 ? null : (
          <Col className="gutter-row" md={6}>
            <Fragment>
              <Card
                bordered={false}
                className={"tourism-detail-card top-rated-hotel"}
                cover={
                  <img
                    alt={""}
                    src={image ? image : DEFAULT_IMAGE_CARD}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE_CARD;
                    }}
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleCardSelection(el.hotel_details)}
                  />
                }
                title={info ? info.cityName : ""}
              >
                {/* <div className="tag">Save 55%</div> */}
                <div className={"tourism-detail-card-top-section"}>
                  <div className="left">
                    <div className="rate-section">
                      <Rate disabled defaultValue={el.rating} />
                    </div>
                    <span className="total-views">{el.total_views} Views</span>
                  </div>

                  <div className={"right"}>
                    <span>
                      <Icon icon="location" size="10" className={"mr-6"} />
                      {info ? info.cityName : ""}
                    </span>
                    <Icon
                      icon={el.is_favorite ? "wishlist-fill" : "wishlist"}
                      size="20"
                      className={el.is_favorite ? "active" : ""}
                      onClick={() => {
                        let fav = Number(el.is_favorite) === 1 ? 0 : 1;
                        this.handleLikeUnlike(el.hotel_details, fav);
                      }}
                    />
                  </div>
                </div>
                <Row
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleCardSelection(el.hotel_details)}
                >
                  <Col span={24}>
                    <div className="category-box">
                      <div className="category-name">{"Tourism"}</div>
                    </div>
                    <div
                      className="title"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {info ? info.hotelName : ""}
                    </div>
                    <div className="price-box">
                      <div className="price">
                        {price ? `AU$ ${salaryNumberFormate(price)}` : "AU$0"}
                        <sup className="sub-text">Per night</sup>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
              {/* <div className={"tourism-detail-card-bottom-section"}>
                                <div className="date-info">
                                    <strong>2 Nights</strong> Sun, 19 Jan - Tue, 14 Jan
                                </div>
                            </div> */}
            </Fragment>
          </Col>
        );
      });
    }
  };

  /**
   * @method render
   * @description render component
   */

  render() {
    const { topRatedHotelList } = this.state;
    const { see_all } = this.props;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    return (
      <div className="wrap-booking-child-box">
        {see_all === undefined && (
          <Title level={2} className="pt-45 tourism-section-title">
            {"Top Rated Hotels"}
          </Title>
        )}
        <Row gutter={[28, 28]} className="pt-35">
          {this.renderTopRatedCards()}
        </Row>
        {see_all === undefined &&
          topRatedHotelList &&
          topRatedHotelList.length > 6 && (
            <Link
              to={`/booking-tourism-see-all/${"top_rated_hotel"}/${cat_id}`}
            >
              <div className="align-center pt-33 pb-36">
                <Button
                  type="default"
                  size={"middle"}
                  className="fm-btn-orange"
                >
                  {"See All"}
                </Button>
              </div>
            </Link>
          )}
      </div>
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
  getTopRatedHotels,
  markFavUnFavHotels,
  setSelectedHotelDetails,
  openLoginModel,
  hotelSearchAPI,
})(withRouter(TopRatedHotels));
