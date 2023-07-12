import React from "react";
import { Redirect, withRouter, Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { Layout, Row, Col, Typography } from "antd";
import moment from "moment";
import Icon from "../../../../components/customIcons/customIcons";
import {
  getBannerById,
  getFlightSearchRecords,
  enableLoading,
  disableLoading,
  openLoginModel,
  getMostRecommendedTour,
  setTourismFlightSearchData,
  getFlightAutocompleteList,
} from "../../../../actions/index";
import history from "../../../../common/History";
import SubHeader from "../../common/SubHeader";
import "../../../common/bannerCard/bannerCard.less";
import { TEMPLATE } from "../../../../config/Config";
import NewSidebar from "../../NewSidebar";
import FlightSearch from "./FilightSearchFilter";
import AutoComplete from "./FlightAutoComplete";
import MostBookedFlights from "./MostBookedFlights";
import TourismBanner from "../TourismBanner";
import {
  capitalizeFirstLetter,
  createRandomString,
  getAddress,
} from "../../../common";
import "../tourism.less";
import "./flight.less";
import axios from "axios";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const popularDestinationImage = require("../../../../assets/images/munich.png");
const popularDestinationImage1 = require("../../../../assets/images/london.png");
const popularDestinationImage2 = require("../../../../assets/images/rotterdam.png");
const popularDestinationImage3 = require("../../../../assets/images/japan.png");
const popularDestinationImage4 = require("../../../../assets/images/bangkok.png");
const popularDestinationImage5 = require("../../../../assets/images/bali.png");

const findCheapFlightsData = [
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
    name: "Japan",
    code: "",
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

class FlightLandingPage extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      recommendedFlight: [],
      firstObj: "",
      secondObj: "",
      thirdObj: "",
      mostBook: [],
      mycity: "",
      mycountry: "",
    };
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getMostRecommendedFlights();
    let that_ = this;
    let mycountry, mycity;
    window.navigator.geolocation.getCurrentPosition(function (position) {
      getAddress(position.coords.latitude, position.coords.longitude, (res) => {
        // getAddress(22.695700, 75.887817, (res) => {
        if (res && res.address_components && res.address_components.length) {
          res.address_components.map((item) => {
            if (item.types[0] == "country") {
              mycountry = item.long_name;
            } else if (item.types[0] == "administrative_area_level_2") {
              mycity = item.long_name;
            }
          });
          if (mycity) {
            that_.setState({
              mycountry,
              mycity,
            });
          }
        }
      });
    });
  }

  // componentDidMount() {
  //   let that_ = this;
  //   let mycountry, mycity;
  //   window.navigator.geolocation.getCurrentPosition(function(position) {
  //     getAddress(position.coords.latitude, position.coords.longitude, (res) => {
  //       // getAddress(22.695700, 75.887817, (res) => {
  //       if(res && res.address_components && res.address_components.length){
  //         res.address_components.map((item) => {
  //           if(item.types[0] == "country"){
  //             mycountry = item.long_name
  //           }else if(item.types[0] == "administrative_area_level_2"){
  //             mycity = item.long_name
  //           }
  //         })
  //         if(mycountry || mycity){
  //           that_.setState({
  //             mycountry,
  //             mycity
  //           })
  //         }
  //       }
  //     })
  //   });
  //   if(!this.state.mycity){
  //   this.getData();
  //   this.getCity()
  //   }
  // }

  getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    this.setState({ ip: res.data.IPv4 });
  };
  getCity = async () => {
    const res = await axios.get(`http://ip-api.com/json`);
    // const res = await axios.get(`http://ip-api.com/json/116.206.151.194`)
    this.setState({ mycity: res.data.city });
    return res.data.city;
  };

  getAirport = async (item) => {
    this.props.enableLoading();
    let value;
    if (this.state.mycity) {
      value = this.state.mycity;
    }
    let source;
    if (!value) {
      value = await this.getCity();
    }
    this.props.getFlightAutocompleteList(value, (res) => {
      if (res.status === 200) {
        let data =
          res.data &&
          res.data.data &&
          res.data.data.body &&
          Array.isArray(res.data.data.body)
            ? res.data.data.body
            : [];
        if (data && data.length && data[0]) {
          source = {
            code: data[0].code,
            air_port_name: data[0].name,
            name: data[0].city_name,
          };
        }
      }
      if (!source) {
        source = {
          code: "MEL",
          air_port_name: "Tullamarine",
          name: "Melbourne",
        };
      }
      let from_location = {
        code: source.code,
        name: source.air_port_name,
        city_name: source.name,
      };
      let to_location = {
        code: item.code,
        name: item.air_port_name,
        city_name: item.name,
      };
      this.handleFlightSearch(
        from_location,
        to_location,
        from_location,
        to_location
      );
    });
  };

  /**
   * @method getMostRecommendedFlights
   * @description get most recommended flights
   */
  getMostRecommendedFlights = () => {
    this.props.getMostRecommendedTour({ module_type: "flight" }, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let recommendedFlight = res.data && res.data.data;
        this.setState({
          recommendedFlight: recommendedFlight,
        });
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
    let cat_name = prams.categoryName;
    let sub_cat_name = prams.subCategoryName;
    let sub_cat_id = prams.subCategoryId;
    if (resetFlag) {
      this.setState({ isSearchResult: false });
    } else {
      this.props.history.push({
        pathname: `/booking-tourism-flight-listpage/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`,
        state: reqData,
      });
    }
  };

  /**
   * @method handleFlightSearch
   * @description Call Action for Classified Search
   */
  handleFlightSearch = (origin, destination, from_location, to_location) => {
    if (destination && destination.code === undefined) {
      toastr.error("Error", "Please select valid city");
      return true;
    }
    let reqData = {
      token: createRandomString(),
      range_qualifier: true,
      passengersStr: "1 Passengers",
      cabin: "Economy",
      dates: {
        from: moment().add(1).format("YYYY-MM-DD"),
      },
      origin: origin.code,
      destination: destination.code,
      passenger: {
        child: 0,
        adult: 1,
        infant: 0,
      },
      type: 1,
    };
    reqData.dates = {
      from: moment().add(1).format("YYYY-MM-DD"),
    };
    // this.props.enableLoading();
    this.props.setTourismFlightSearchData({
      from_location,
      to_location,
      reqData,
    });
    this.props.getFlightSearchRecords(reqData, (res) => {
      this.props.disableLoading();
      if (res.data && res.data.code === 500) {
        let msg =
          Array.isArray(res.data.error) &&
          res.data.error.length &&
          Array.isArray(res.data.error[0].errorMessageText) &&
          res.data.error[0].errorMessageText.length &&
          Array.isArray(res.data.error[0].errorMessageText[0].description) &&
          res.data.error[0].errorMessageText[0].description.length
            ? res.data.error[0].errorMessageText[0].description[0].toLowerCase()
            : res.data.error;
        toastr.warning(msg);
      }
      if (res.status === 200) {
        this.handleSearchResponce(res.data, false, reqData);
      } else {
        this.handleSearchResponce([], false, reqData);
      }
    });
  };

  /**
   * @method renderFlightRecommended
   * @description render flight recommended details
   */
  renderFlightRecommended = () => {
    const { recommendedFlight } = this.state;
    const { current_origin } = this.props;
    if (recommendedFlight && recommendedFlight.length) {
      return recommendedFlight.slice(0, 4).map((el, i) => {
        return (
          <div className="ant-colum">
            <div
              className="tourism-flight-banner-card"
              onClick={() => {
                let source = {
                  code: el.sourceAirportCode && el.sourceAirportCode,
                  name: el.sourceAirportName && el.sourceAirportName,
                  city_name: el.sourceCity && el.sourceCity,
                };
                // let cityName = current_origin && current_origin.city_name ? current_origin.city_name : ''
                // let name = current_origin && current_origin.name ? current_origin.name : ''
                // let countryCode = current_origin && current_origin.code ? current_origin.code : ''
                // let source = {
                //   code: countryCode ? countryCode : '',
                //   name: name ? name :  '',
                //   city_name: cityName ? cityName : ''
                // }
                let destination = {
                  code: el.destinationAirportCode && el.destinationAirportCode,
                  name: el.destinationAirportName
                    ? el.destinationAirportName
                    : "",
                  city_name: el.destinationCity ? el.destinationCity : "",
                };
                this.handleFlightSearch(
                  source,
                  destination,
                  source,
                  destination
                );
              }}
            >
              <img
                src={
                  i <= 3
                    ? require(`../../../../assets/images/recomended_${i}.jpg`)
                    : el.image
                }
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = require("../../../../assets/images/netherlands-amsterdam.png");
                }}
              />
              <div className="tourism-flight-banner-card-content">
                <div className={`top-title`}>
                  {el.destinationCity ? el.destinationCity : ""}
                  {
                    <span>
                      {el.destinationCountry ? el.destinationCountry : ""}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      mostBook,
      isSidebarOpen,
      redirectTo,
      topImages,
      selected_location,
    } = this.state;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    const { current_origin } = this.props;
    return (
      <Layout className="common-sub-category-landing flight-main-landing">
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
              <FlightSearch
                handleSearchResponce={this.handleSearchResponce}
                handleFilterChange={(type) => {}}
                landingPage={true}
                listpage={false}
                resetFilters={() => {
                  this.setState({ isReset: false });
                }}
              />
            </div>
            <Content className="site-layout">
              <div className="wrap-inner full-width-wrap-inner pb-34">
                <div className="wrap-booking-child-box">
                  <Title level={2} className="pt-45 tourism-section-title">
                    {"Flights recommended for you"}
                  </Title>
                  <Text className="fs-17 tourism-section-subtitle">{`See the whole world at a glance with our flight price`}</Text>
                  <div gutter={[25, 25]} className="flights-recommended-tile">
                    <div className="rowed">
                      {this.renderFlightRecommended()}
                    </div>
                  </div>
                </div>
              </div>
              <MostBookedFlights
                cat_id={cat_id}
                ip={this.state.ip}
                mycity={this.state.mycity}
                className="most-booked-flights"
                {...this.props}
              />
              <div className="wrap-inner full-width-wrap-inner find-cheap-flights">
                <div className="wrap-booking-child-box">
                  <Title level={2} className="pt-50 tourism-section-title mb-5">
                    {"Find cheap flights"}
                  </Title>
                  {/* <div className="departing-from">
                    <Text className="fs-17 tourism-section-subtitle">{`Departing from `}</Text>
                    <AutoComplete
                      className=""
                      handleSearchSelect={(option) => {
                        console.log("option: ", option);
                        this.setState({ selected_location: option });
                      }}
                      handleValueChange={(value) => {}}
                      placeHolder="search here"
                      width="350"
                      defaultValue={current_origin ? current_origin.name : ""}
                    />
                  </div> */}

                  <Row gutter={[18, 18]} className="pt-50 pb-30">
                    {findCheapFlightsData.map((item, index) => (
                      <Col
                        md={8}
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          this.getAirport(item);
                        }}
                      >
                        <div className="fm-card-block mb-8">
                          <div className="ad-banner">
                            <img alt={item.name} src={item.image} />
                          </div>
                          <div className="fm-desc-stripe sports-fm-desc">
                            <Row align={"middle"}>
                              <Col span={12}>
                                <h2>{item.name}</h2>
                              </Col>
                              <Col span={12} className="text-right">
                                {/* <p className="ad-banner"> */}
                                <Link className="ad-banner">
                                  View All Price{" "}
                                  <Icon
                                    icon="arrow-right"
                                    size="13"
                                    className="ml-3 fm-color-yellow"
                                  />
                                </Link>
                                {/* </p> */}
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  {/* <div className="pb-20">
                    <Text className="booking-note-msg">
                      ²Offer ends 23:59 (AEST) Tuesday 31st December 2019.
                      Minimum spend of AU$250 applies. A limit of one flight
                      voucher per customer per day and a maximum of one voucher
                      per booking applies. Jetstar flight voucher valid for 6
                      months from date of issue. Your voucher will be delivered
                      by email to the address provided here up to 8 weeks after
                      your stay. Cookies must be enabled. Other conditions
                      apply, read the full terms and conditions.
                    </Text>
                  </div> */}
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
  const { auth, classifieds, tourism, common } = store;
  const { address } = common;
  const { flight_search_params, current_origin } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedClassifiedList: classifieds.classifiedsList,
    search_params: flight_search_params,
    currentAddress: address,
    current_origin,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  openLoginModel,
  getBannerById,
  getFlightSearchRecords,
  getMostRecommendedTour,
  setTourismFlightSearchData,
  getFlightAutocompleteList,
})(withRouter(FlightLandingPage));
