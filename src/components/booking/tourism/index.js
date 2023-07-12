import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import moment from "moment";
import { Layout, Row, Col, Typography, Tabs, Card, Button } from "antd";
import Icon from "../../../components/customIcons/customIcons";

import { langs } from "../../../config/localization";
import {
  setCurrentOrigin,
  enableLoading,
  disableLoading,
  getFlightAutocompleteList,
  getMostBookedHotels,
  setTourismFlightSearchData,
  getFlightSearchRecords,
  setHotelReqData,
  hotelSearchAPI,
  markFavUnFavHotels,
  openLoginModel,
} from "../../../actions/index";
import DetailCard from "../common/Card";
import history from "../../../common/History";
import {
  getAddress,
  createRandomString,
  blankValueCheck,
} from "../../../components/common";
import { CarouselSlider } from "../../common/CarouselSlider";
import SubHeader from "../common/SubHeader";
import NoContentFound from "../../common/NoContentFound";
import "../../common/bannerCard/bannerCard.less";
import { TEMPLATE, DEFAULT_ICON } from "../../../config/Config";
import { DEFAULT_THUMB_IMAGE } from "../../../config/Config";
import TourismBannerCard from "../../../components/booking/tourism/TourismBannerCard";
import TourismDetailCard from "../../../components/booking/tourism/TourismDetailCard";
import NewSidebar from "../NewSidebar";
import { getBookingSubcategoryRoute } from "../../../common/getRoutes";
import MostBookedFlights from "./flight/MostBookedFlights";
import TourismBanner from "./TourismBanner";
import "./tourism.less";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const bookedFlightImage = require("../../../assets/images/most-booked-flight.png");
const importCompanyLogo = require("../../../assets/images/flight-logo.png");
const popularDestinationImage = require("../../../assets/images/munich.png");
const popularDestinationImage1 = require("../../../assets/images/london.png");
const popularDestinationImage2 = require("../../../assets/images/rotterdam.png");
const popularDestinationImage3 = require("../../../assets/images/japan.png");
const popularDestinationImage4 = require("../../../assets/images/bangkok.png");
const popularDestinationImage5 = require("../../../assets/images/bali.png");

const popularDestinationData = [
  {
    image: popularDestinationImage,
    name: "Munich",
    code: "MUC",
    air_port_name: "Munich Franz Josef Strauss DE",
  },
  {
    image: popularDestinationImage1,
    name: "London",
    code: "LON",
    air_port_name: "London London City Airport GB",
  },
  {
    image: popularDestinationImage2,
    name: "Rotterdam",
    code: "RTM",
    air_port_name: "Rotterdam Rotterdam Zestienhoven NL",
  },
  {
    image: popularDestinationImage3,
    name: "Tokyo",
    code: "TYO",
    air_port_name: "Japan",
  },
  {
    image: popularDestinationImage4,
    name: "Bangkok",
    code: "BKK",
    air_port_name: "Bangkok Suvarnabhumi International TH",
  },
  {
    image: popularDestinationImage5,
    name: "Bali",
    code: "BAJ",
    air_port_name: "Bali Bali PG",
  },
];
class TourismLandingPage extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      mostBookedHotels: [],
      from_location: "",
    };
  }

  componentWillMount = () => {
    const { params } = this.props;
    this.getMostBookedHotels()
    this.props.setHotelReqData("");
    if (params) {
      this.setState({
        from_location: params.from_location,
      });
    }
  };

  getMostBookedHotels = () => {
    this.props.getMostBookedHotels((res) => {
      if (res.status === 200) {
        let data =
          res && res.data && res.data.data && Array.isArray(res.data.data)
            ? res.data.data
            : [];
        this.setState({
          mostBookedHotels: data,
        });
      }
    });
  }

  componentDidMount() {
    const { currentAddress } = this.props;
    if (currentAddress && currentAddress.city) {
      this.props.getFlightAutocompleteList(currentAddress.city, (res) => {
        if (res.status === 200) {
          let data =
            res.data &&
            res.data.data &&
            res.data.data.body &&
            Array.isArray(res.data.data.body)
              ? res.data.data.body
              : [];
          if (data && data.length) {
            this.props.setCurrentOrigin(data[0]);
          } else {
            this.props.setCurrentOrigin(data[0]);
          }
        }
      });
    }
  }

  renderBookingSubCategory = (bookingSubCategory) => {
    if (bookingSubCategory && bookingSubCategory.length) {
      return bookingSubCategory.map((el, i) => {
        let path = getBookingSubcategoryRoute(
          el.parent_category_name,
          el.parent_category_name,
          el.pid,
          el.name,
          el.id,
          false
        );
        return (
          <Link to={path}>
            <div className={`fm-tab-names ${el.name}`}>
              {/* <img
                src={el.icon ? el.icon : DEFAULT_ICON}
                alt="flight"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_ICON;
                }}
              /> */}
              <span>{el.name}</span>
            </div>
          </Link>
        );
      });
    }
  };

  getAirport = (item) => {
    let _that = this;
    let from_location;
    this.props.enableLoading();
    this.props.getFlightAutocompleteList(item.name, (res) => {
      if (res.status === 200) {
        let data =
          res.data &&
          res.data.data &&
          res.data.data.body &&
          Array.isArray(res.data.data.body)
            ? res.data.data.body
            : [];
        if (data && data.length) {
          from_location = data[0];
          let values = {
            adults: 2,
            check_in_date: moment().format("YYYY-MM-DD"),
            check_out_date: moment().add(3, "days").format("YYYY-MM-DD"),
            children: undefined,
            pick_up: undefined,
            rooms: 1,
          };
          let numberOfrooms = [
            {
              totalAdults: 2,
              totalChildren: 0,
              childrenAges: [],
            },
          ];

          let reqData = {
            hotelCityCode: from_location ? from_location.code : "",
            radius: 300,
            startDate: `${moment().format("YYYY-MM-DD")}`,
            endDate: `${moment().add(7, "days").format("YYYY-MM-DD")}`,
            breakfast: false,
            maxRate: 50000,
            minRate: 50,
            rating: null,
            hotelAmenities: [],
            rooms: numberOfrooms,
            maxPriceRange: 0,
          };
          let default_value = {
            from_location,
            reqData,
            values,
          };
          if (
            blankValueCheck(from_location) &&
            blankValueCheck(reqData.startDate) &&
            blankValueCheck(reqData.endDate) &&
            blankValueCheck(values.adults)
          ) {
            this.props.enableLoading();
            this.props.hotelSearchAPI(reqData, (res) => {
              this.props.disableLoading();
              if (res.status === 200) {
                this.props.setHotelReqData(default_value);
                _that.handleSearchResponce(res.data, false, reqData);
              }
            });
          } else {
            toastr.warning(
              langs.warning,
              `All ${langs.messages.mandate_filter}`
            );
          }
        }
      }
    });
  };

  /**
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    let prams = this.props.match.params;
    let cat_id = prams.categoryId;
    let cat_name = "Tourism";
    this.props.history.push({
      pathname: `/booking-tourism-hotel-list/${cat_name}/${cat_id}`,
      state: {
        reqData,
      },
    });
  };

  handleLikeUnlike = (selectedHotel, fav) => {
    const { loggedInDetail, isLoggedIn } = this.props;
    if (isLoggedIn) {
        let code = selectedHotel.basicPropertyInfo && selectedHotel.basicPropertyInfo.hotelCode
        let info = selectedHotel.descriptiveInfo && Array.isArray(selectedHotel.descriptiveInfo) && selectedHotel.descriptiveInfo.length ? selectedHotel.descriptiveInfo[0] : ''
        let image = info && Array.isArray(info.hotelImages) && info.hotelImages.length ? info.hotelImages[0] : ''
        let reqData = {
            userId: isLoggedIn ? loggedInDetail.id : '',
            hotel_id: code,
            HotelBasicJson: {
                HotelName: info ? info.hotelName : '',
                HotelName: info ? info.hotelName : '',
                HotelImage: image,
            },
            HotelDetailsJson: selectedHotel,
            isFavorite: fav
        }

        let formData = new FormData();
        Object.keys(reqData).forEach((key) => {
            if (typeof reqData[key] == "object") {
                formData.append(key, JSON.stringify(reqData[key]));
            } else {
                formData.append(key, reqData[key]);
            }
        });
        this.props.enableLoading()
        this.props.markFavUnFavHotels(formData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                toastr.success(langs.success, fav === 0 ? 'Hotel has been sucessfully marked as un favorite' : 'Hotel has been sucessfully marked as favorite');
                this.setState({ isFav: fav })
                this.getMostBookedHotels()
            }
        })
    } else {
        this.props.openLoginModel()
    }
}

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isSidebarOpen, redirectTo, topImages, mostBookedHotels } =
      this.state;
    const { bookingSubCategory } = this.props;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let tmp = 0;
    return (
      <Layout className="common-sub-category-landing tourism-main-landing">
        <Layout className="yellow-theme common-left-right-padd">
          <NewSidebar
            history={history}
            activeCategoryId={cat_id}
            categoryName={TEMPLATE.TURISM}
            isSubcategoryPage={true}
            showAll={true}
            toggleSideBar={() =>
              this.setState({ isSidebarOpen: !isSidebarOpen })
            }
          />
          <Layout className="right-parent-block">
            <div className="inner-banner custom-inner-banner">
              <SubHeader categoryName={TEMPLATE.TURISM} showAll={true} />
              <TourismBanner {...this.props} />
              <div className="tourism-main-banner">
                <div className="tourism-main-banner-content">
                  <Title level={2} className="heading">
                    Plan your dream trip
                  </Title>
                  <Text className="fs-17 sub-heading">
                    Get the best prices on 2,000,000+ properties, worldwide
                  </Text>
                  <div className="banner-btn-box">
                    {this.renderBookingSubCategory(bookingSubCategory)}
                  </div>
                </div>
              </div>
            </div>
            <Content className="site-layout">
              <MostBookedFlights cat_id={cat_id} {...this.props} />
              <div className="wrap-inner full-width-wrap-inner bg-gray">
                <div className="wrap-booking-child-box">
                  <Title level={2} className="pt-45 tourism-section-title">
                    {"Most Booked Hotels"}
                  </Title>
                  <Text className="fs-17 tourism-section-subtitle">
                    {"Over 550,000 accommodation worldwide"}
                  </Text>
                  <Row gutter={[28, 28]} className="pt-35">
                    {mostBookedHotels.map((hotels, index) => {
                      let tmp2 =
                        hotels.city ? (
                          <Col className="gutter-row" md={6}>
                            <TourismDetailCard {...hotels} handleLikeUnlike={this.handleLikeUnlike} index={tmp} />
                          </Col>
                        ) : null;
                      tmp2 = tmp <= 7 ? tmp2 : null;
                      tmp = hotels.city ? tmp + 1 : tmp;
                      return tmp2;
                    })}
                    {/* <Col className="gutter-row" md={6}>
                      <TourismDetailCard />
                    </Col>
                    <Col className="gutter-row" md={6}>
                      <TourismDetailCard />
                    </Col>
                    <Col className="gutter-row" md={6}>
                      <TourismDetailCard />
                    </Col> */}
                  </Row>
                  {mostBookedHotels.length > 8 && <div className="align-center pt-33 pb-36">
                    <Link
                      to={{
                        pathname: `/most-booked-hotels`,
                        state: { data: mostBookedHotels },
                      }}
                    >
                      <Button
                        type="default"
                        size={"middle"}
                        className="fm-btn-orange"
                      >
                        {"See All"}
                      </Button>
                    </Link>
                  </div>}
                </div>
              </div>
              {/* <div
                className="wrap-inner full-width-wrap-inner pb-60"
                style={{ backgroundColor: "#F7FAFC" }}
              >
                <div className="wrap-booking-child-box">
                  <Title level={2} className="pt-31 pb-7 tourism-section-title">
                    {"Recommendations for you"}
                  </Title>
                  <Text className="fs-17 tourism-section-subtitle">
                    {"Best Value deals on your holiday"}
                  </Text>
                  <Row gutter={[16, 16]} className="pt-50">
                    <Col md={12}>
                      <TourismBannerCard
                        imgSrc={require("../../../assets/images/tourism-phuket.png")}
                        topTitle={"Phuket"}
                        title={"Karon Beach Resort and Spa"}
                        titleSize={"25"}
                        titlePosition={"bottom"}
                        subTitle={"7 nights + Breakfast"}
                        priceLabel={"Start From"}
                        price={"AU$725"}
                        pricePosition={"bottom"}
                        textColor={"#363B40"}
                        type={"hotel"}
                      />
                      <TourismBannerCard
                        imgSrc={require("../../../assets/images/tourism-japan.png")}
                        topTitle={"Japan"}
                        title={"Osaka Hotel"}
                        titleSize={"25"}
                        titlePosition={"bottom"}
                        subTitle={"5 nights + Breakfast"}
                        priceLabel={"Start From"}
                        price={"AU$725"}
                        pricePosition={"bottom"}
                      />
                    </Col>
                    <Col md={12}>
                      <TourismBannerCard
                        imgSrc={require("../../../assets/images/tourism-italy.png")}
                        topTitle={"Italy"}
                        title={"Rome de palazo"}
                        titleSize={"25"}
                        titlePosition={"bottom"}
                        subTitle={"8 nights + Breakfast"}
                        priceLabel={"Start From"}
                        price={"AU$725"}
                        pricePosition={"bottom"}
                      />
                    </Col>
                  </Row>
                </div>
              </div> */}
              <div className="wrap-inner full-width-wrap-inner bg-gray">
                <div className="wrap-booking-child-box">
                  <Title level={2} className="pt-41 tourism-section-title">
                    {"Popular Hotel Destinations"}
                  </Title>
                  <Row gutter={[16, 16]} className="pt-35 pb-30">
                    {popularDestinationData.map((item, index) => (
                      <Col md={8} key={index}>
                        <div className="fm-card-block mb-8">
                          <div className="ad-banner">
                            <img alt={item.name} src={item.image} />
                          </div>
                          <div className="fm-desc-stripe sports-fm-desc">
                            <Row align={"middle"}>
                              <Col span={12}>
                                <h2>{item.name}</h2>
                              </Col>
                              <Col
                                span={12}
                                className="text-right"
                                onClick={() => {
                                  this.getAirport(item);
                                }}
                              >
                                <Link className="ad-banner">
                                  View All Price{" "}
                                  <Icon
                                    icon="arrow-right"
                                    size="13"
                                    className="ml-3 fm-color-yellow"
                                  />
                                </Link>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
        {redirectTo && (
          <Redirect
            push
            to={{
              pathname: redirectTo,
            }}
          />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common, tourism } = store;
  const { bookingSubCategory, address } = common;
  const { hotelReqdata } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    currentAddress: address,
    params: hotelReqdata,
    bookingSubCategory:
      bookingSubCategory.data &&
      Array.isArray(bookingSubCategory.data) &&
      bookingSubCategory.data.length
        ? bookingSubCategory.data
        : [],
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  setCurrentOrigin,
  getFlightAutocompleteList,
  getMostBookedHotels,
  setTourismFlightSearchData,
  getFlightSearchRecords,
  setHotelReqData,
  hotelSearchAPI,
  markFavUnFavHotels,
  openLoginModel,
})(withRouter(TourismLandingPage));
