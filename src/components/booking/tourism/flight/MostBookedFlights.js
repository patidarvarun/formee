import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { Button, Row, Typography } from "antd";
import {enableLoading, disableLoading,getFlightSearchRecords,setTourismFlightSearchData,getFlightAutocompleteList, getMostBookedFlightList } from "../../../../actions/index";
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
import { capitalizeFirstLetter, createRandomString, getAddress } from "../../../common";
import MostBookedCards from "../common/MostBookedCards";
import axios from 'axios';
const { Title, Text } = Typography;
class MostBookedFlights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mostBook: [],
      origin: '',
      mycity: "",
      ip: "",
    };
  }

  /**
   * @method componentDidMount
   * @description called after mounting the component
   */
  componentWillMount() {
    this.props.enableLoading()
    let that_ = this;
    let mycountry, mycity;
    window.navigator.geolocation.getCurrentPosition(function(position) {
      getAddress(position.coords.latitude, position.coords.longitude, (res) => {
        // getAddress(22.695700, 75.887817, (res) => {
        if(res && res.address_components && res.address_components.length){
          res.address_components.map((item) => {
            if(item.types[0] == "country"){
              mycountry = item.long_name
            }else if(item.types[0] == "administrative_area_level_2"){
              mycity = item.long_name
            }
          })
          if(mycity){
            that_.setState({
              mycountry,
              mycity
            })
          } else {
              this.getCity();
          }
        }
      })
    });
    if(!this.state.mycity){
    // this.getData();
    this.getCity();
    }
    const { currentAddress } = this.props
    let reqData = {
      city : currentAddress && currentAddress.city ? currentAddress.city : ''
    }
    const formData = new FormData();
    formData.append('city', reqData.city);
    this.props.getMostBookedFlightList(formData, (res) => {
      this.props.disableLoading()
      if (res.status === 200) {
        let mostBook = res.data && res.data.data;
        this.setState({ mostBook: mostBook });
      }
    });
  }

  getData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/')
    this.setState({ip: res.data.IPv4});
  }
  getCity = async () => {
    const res = await axios.get(`http://ip-api.com/json`)
    // const res = await axios.get(`http://ip-api.com/json/116.206.151.194`)
    this.setState({mycity: res.data.city});
  }

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
      if(sub_cat_id){
        this.props.history.push({
          pathname: `/booking-tourism-flight-listpage/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`,
          state: reqData,
        });
      }else {
        this.props.history.push({
          pathname: `/booking-tourism-flight-listpage/${'Tourism'}/${cat_id}`,
          state: reqData,
        });
      }
     
    }
  };

  getAirport = async (to_location) => {
    this.props.enableLoading();
    let value;
    if(this.state.mycity){
      value = this.state.mycity
    }
    let source;
    if(!value){
      value = await this.getCity()
    }
      this.props.getFlightAutocompleteList(value, res => {
        if (res.status === 200) {
            let data = res.data && res.data.data && res.data.data.body && Array.isArray(res.data.data.body) ? res.data.data.body : []
            if (data && data.length && data[0]) {
              source = {
                code: data[0].code,
                air_port_name: data[0].name,
                name: data[0].city_name
              }
            }
            if(!source){
              source = {
                code: 'MEL',
                air_port_name: "Tullamarine",
                name: "Melbourne"
              }
            }
            let from_location = {
              code: source.code,
              name: source.air_port_name,
              city_name: source.name,
            };
            this.handleFlightSearch(
              from_location,
              to_location,
              from_location,
              to_location
            );
        }
      })
  }

   /**
   * @method handleFlightSearch
   * @description Call Action for Classified Search
   */
    handleFlightSearch = (origin, destination,from_location,to_location ) => {
      console.log('origin',origin,destination)
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
      this.props.enableLoading();
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
   * @method render
   * @description render components
   */
  render() {
    const {origin, mostBook, mycity } = this.state;
    const { see_all,cat_id,currentAddress,current_origin } = this.props;
    let tmp = 0
    return (
      <div
        className="wrap-inner full-width-wrap-inner booked-flight-block"
        // style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="wrap-booking-child-box">
          {see_all === undefined && <Title level={2} className="pt-0 tourism-section-title">
            {"Most booked Flights"}
          </Title>}
          {see_all === undefined && <Text className="fs-17 tourism-section-subtitle">
            {`Seats are limited. Book now before they're all gone.`}
          </Text>}
          <Row gutter={[30, 30]} className="pt-50">
            {mostBook && mostBook.length !==0 && mostBook.map((item, index) => {
              let tmp2 = item.sourceCityCountryCode == item.destinationCityCountryCode ? null : (<MostBookedCards
                index={tmp}
                mycity={mycity}
                image={item.image ? item.image : DEFAULT_IMAGE_CARD}
                source={current_origin && current_origin.city_name ? current_origin.city_name : ''}
                destination={item.destinationCity}
                count={item.numberOfBooking}
                price={item.price}
                callNext={() => {
                  let source = {
                    code: item.sourceAirportCode ? item.sourceAirportCode : '',
                    name: item.sourceAirportName ? item.sourceAirportName :  '',
                    city_name: item.sourceCity ? item.sourceCity : ''
                  }
                  // let cityName = current_origin && current_origin.city_name ? current_origin.city_name : ''
                  // let name = current_origin && current_origin.name ? current_origin.name : ''
                  // let countryCode = current_origin && current_origin.code ? current_origin.code : ''
                  // let source = {
                  //   code: countryCode ? countryCode : '',
                  //   name: name ? name :  '',
                  //   city_name: cityName ? cityName : ''
                  // }
                  let destination = {
                    code: item.destinationAirportCode ? item.destinationAirportCode : '',
                    name: item.destinationAirportName ?  `${capitalizeFirstLetter(item.destinationAirportName)} ${item.destinationAirportCode && item.destinationAirportCode.toUpperCase()}` : '',
                    city_name: item.destinationCity ? item.destinationCity : ''
                  }
                  this.getAirport(destination)}
                }
              />
              )
              tmp2 = tmp <= 5 ? tmp2 : null;
              tmp = item.sourceCityCountryCode == item.destinationCityCountryCode ? tmp : tmp + 1; 
              return tmp2;
            })}
          </Row>
          {/* {mostBook.length > 6 && see_all === undefined &&  (
            <div className="align-center btn-block">
              <Link
                to={`/booking-tourism-see-all/${"most_booked_flights"}/${cat_id}`}
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
          )} */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth,common, tourism } = store;
   const { address } = common;
   const { current_origin } = tourism
   console.log('current_origin',current_origin)
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    currentAddress: address,
    current_origin
  };
};

export default connect(mapStateToProps, {enableLoading, disableLoading, getFlightSearchRecords,setTourismFlightSearchData,getFlightAutocompleteList, getMostBookedFlightList })(
  MostBookedFlights
);
