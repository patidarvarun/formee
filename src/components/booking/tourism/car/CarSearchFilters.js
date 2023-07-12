import React from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { langs } from "../../../../config/localization";
import { toastr } from "react-redux-toastr";
import {
  Checkbox,
  TimePicker,
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import Icon from "../../../customIcons/customIcons";
import PlacesAutocomplete from "../../../common/LocationInput";
import { HOURS, MINUTES, TIME_DURATION } from "../../../../config/Constant";
import {
  storeSearchDataAPI,
  enableLoading,
  disableLoading,
  carSearchAPI,
  setCarReqData,
} from "../../../../actions";
const { Option } = Select;

let dateFormat = 'DD/MM/YYYY'

class CarSearch extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      searchLatLng: "",
      isShowMore: false,
      pick_up_location: "",
      isDropOf: false,
      hours: HOURS,
      minutes: MINUTES,
      pick_up_latlng: "",
      drop_up_latlng: "",
      from_location: "",
      to_location: "",
      time_duration: TIME_DURATION,
      openStart: false,
      openEnd: false
    };
  }

  /**
   * @method componentDidMount
   * @description call after render the component
   */
  componentDidMount() {
    const { params, listingPage } = this.props;
    if (listingPage) {
      this.props.setCarReqData("");
    } else if (params) {
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          pick_up_date: params.values && params.values.pick_up_date ? moment(params.values.pick_up_date) : "",
          drop_of_date: params.values && params.values.drop_of_date ? moment(params.values.drop_of_date) : "",
          start_time: params.values ? params.values.start_time : "",
          end_time: params.values ? params.values.end_time : "",
          drive_age: params.values ? params.values.drive_age : "",
        });
      this.setState({
        isDropOf: params.isDropOf ? true : false,
        pick_up_latlng: params.pick_up_latlng ? params.pick_up_latlng : "",
        drop_up_latlng: params.drop_up_latlng ? params.drop_up_latlng : params.pick_up_latlng,
        pick_up_location: params.pick_up_location ? params.pick_up_location : "",
        drop_up_location: params.drop_up_location ? params.drop_up_location : "",
        from_location: params.from_location,
        to_location: params.to_location ? params.to_location : params.from_location,
      });
    }
  }

  /**
   * @method resetSearch
   * @description Use to reset Search bar
   */
  resetSearch = () => {
    this.setState({});
    this.formRef.current.resetFields();
    this.props.handleSearchResponce("", true, {});
  };

  setFloating = (key) => {
    if (key === 'start') {
      this.setState({ isFloated: true, openStart: true });
    } else if (key === 'end') {
      this.setState({ isFloated: true, openEnd: true });
    }
  };

  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = (values) => {
    const {
      isDropOf,
      pick_up_latlng,
      drop_up_latlng,
      pick_up_location,
      drop_up_location,
      from_location,
      to_location,
    } = this.state;
    const { isLoggedIn, loggedInDetail } = this.props;

    // let start_time = `${values.hours1}${values.minutes1}`
    // let start_date = values.pick_up_date ? `${moment(values.pick_up_date).format("YYYY-MM-DD")}%${String(start_time)}` : ""
    // let end_time = `${values.hours2}${values.minutes2}`
    // let end_date = values.drop_of_date ? `${moment(values.drop_of_date).format("YYYY-MM-DD")}%${String(end_time)}` : ""

    let start_time = `${values.hours1 ? values.hours1 : "12"}:${values.minutes1 ? values.minutes1 : "00"
      }`;
    let start_date = values.pick_up_date
      ? `${moment(values.pick_up_date).format("YYYY-MM-DD")} ${values.start_time ? values.start_time : '12:00'}`
      : "";
    let end_time = `${values.hours2 ? values.hours2 : "12"}:${values.minutes2 ? values.minutes2 : "00"
      }`;
    let end_date = values.drop_of_date
      ? `${moment(values.drop_of_date).format("YYYY-MM-DD")} ${values.end_time ? values.end_time : '12:00'}`
      : "";
    let reqData = {
      startDate: start_date ? start_date : "",
      endDate: end_date ? end_date : "",
      isSamePickAndDrop: isDropOf ? 0 : 1,
      pickupLocationLat: pick_up_latlng ? pick_up_latlng.lat : "",
      pickupLocationLng: pick_up_latlng ? pick_up_latlng.lng : "",
      dropoffLocationLat: drop_up_latlng
        ? drop_up_latlng.lat
        : pick_up_latlng
          ? pick_up_latlng.lat
          : "",
      dropoffLocationLng: drop_up_latlng
        ? drop_up_latlng.lng
        : pick_up_latlng
          ? pick_up_latlng.lng
          : "",
      userId: isLoggedIn ? loggedInDetail.id : "",
      rentalCodes: "ZE,ZI",
    };
    console.log("reqData", reqData);
    // let reqData = {
    //     startDate:'2021-12-11 22:30',
    //     endDate:'2021-12-14 22:30',
    //     isSamePickAndDrop: 1,
    //     pickupLocationLat: 25.7616798,
    //     pickupLocationLng: -80.1917902,
    //     dropoffLocationLat: 25.7616798,
    //     dropoffLocationLng: -80.1917902,
    //     userId: isLoggedIn ? loggedInDetail.id : '',
    //     rentalCodes: 'ZE,ZI'
    // }
    const default_values = {
      pick_up_location,
      drop_up_location: drop_up_location ? drop_up_location : pick_up_location,
      pick_up_latlng,
      drop_up_latlng,
      isDropOf,
      values: values,
      from_location,
      to_location,
      reqData,
    };
    console.log("reqData", reqData);
    if (
      reqData.startDate !== "" &&
      reqData.endDate !== "" &&
      reqData.pickupLocationLat !== "" &&
      reqData.pickupLocationLng !== "" &&
      reqData.dropoffLocationLat !== "" &&
      reqData.dropoffLocationLng !== ""
    ) {
      this.props.setCarReqData(default_values);
      this.props.enableLoading();
      this.props.carSearchAPI(reqData, (res) => {
        this.props.disableLoading();
        console.log("res", res);
        if (res.status === 200) {
          let data = res.data && res.data.data;
          this.props.handleSearchResponce(data, false, reqData);
          // let reqData = {
          //   module_type: "car",
          //   user_id: isLoggedIn && loggedInDetail ? loggedInDetail.id : "",
          //   source_city:from_location && from_location.city ? from_location.city : "",
          //   destination_city: to_location ? to_location.city : to_location.city ? to_location.city : from_location && from_location.city,
          //   source_country: from_location && from_location.country,
          //   destination_country: to_location ? to_location.country : from_location && from_location.country,
          //   source_country_code: from_location && from_location.country_code ? from_location.country_code : "",
          //   destination_country_code: to_location && to_location.country_code ? to_location.country_code : from_location && from_location.country_code,
          //   city_code: to_location && to_location.city_code ? to_location.city_code : from_location && from_location.city_code, 
          //   source_airport_code: from_location && from_location.city_code ? from_location.city_code : from_location && from_location.city_code,
          //   destination_airport_code:to_location && to_location.city_code ? to_location.city_code : from_location && from_location.city_code, 
          // };
          // this.props.storeSearchDataAPI(reqData);
        } else {
          this.props.handleSearchResponce([], false, {});
        }
      });
    } else {
      toastr.warning(langs.warning, `All ${langs.messages.mandate_filter}`);
    }
  };

  /**
   * @method handleDropofAddress
   * @description handle drop of address
   */
  handleDropofAddress = (result, address, latLng) => {
    let city = "",
      country = "",
      country_code = "",
      city_code = "";
    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
        city_code = el.short_name;
      } else if (el.types[0] === "country") {
        country = el.long_name;
        country_code = el.short_name;
      }
    });
    this.setState({
      drop_up_latlng: latLng,
      drop_up_location: address,
      to_location: {
        country, city, city_code,
        country_code
      },
    });
  };

  /**
   * @method handlePickupAddress
   * @description handle drop of address
   */
  handlePickupAddress = (result, address, latLng) => {
    let city = "",
      country = "",
      country_code = "",
      city_code = "";
    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
        city_code = el.short_name;
      } else if (el.types[0] === "country") {
        country = el.long_name;
        country_code = el.short_name;
      }
    });
    this.setState({
      pick_up_latlng: latLng,
      pick_up_location: address,
      from_location: { country, city, city_code, country_code },
      drop_up_location: address,
    });
  };

  // /**
  //  * @method renderTimePicker
  //  * @description render time picker
  //  */
  // renderTimePicker = (name1, name2) => {
  //   const { hours, minutes } = this.state;
  //   let currentField = this.formRef.current && this.formRef.current.getFieldsValue();
  //   return (
  //     <div className="input-grp-compact">
  //       <Row gutter={0}>
  //         <Col md={12}>
  //         <div className={currentField && currentField[name1] ? "floating-label" : ""}>
  //           <Form.Item name={name1} label="Time" className="time-selector">
  //             <Select
  //               onChange={this.setFloating}
  //               dropdownMatchSelectWidth={false}
  //               placeholder ="Time" 
  //             >
  //               {hours &&
  //                 hours.map((el) => {
  //                   return <Option value={el}>{el}</Option>;
  //                 })}
  //             </Select>
  //           </Form.Item>
  //         </div>
  //         </Col>
  //         <Col md={12}>
  //           <Form.Item name={name2} className="time-selector2">
  //             <Select
  //               onChange={this.setFloating}
  //               dropdownMatchSelectWidth={false}
  //               // placeholder ="Time" 
  //             >
  //               {minutes &&
  //                 minutes.map((el) => {
  //                   return <Option value={el}>{el}</Option>;
  //                 })}
  //             </Select>
  //           </Form.Item>
  //         </Col>
  //       </Row>
  //     </div>
  //   );
  // };


  /**
   * @method renderTimePicker
   * @description render time picker
   */
  renderTimePicker = (time, key) => {
    console.log('key: >>', key);
    const { time_duration } = this.state
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue();
    return (
      <div className={currentField && currentField[time] ? "floating-label" : ""}>
        <Form.Item name={time} label="Time" className="time-selector">
          <Select
            onClick={() => {
              console.log('>>>> click');
              if (key === 'start') {
                this.setState({ openStart: !this.state.openStart })
              } else {
                this.setState({ openEnd: !this.state.openEnd })
              }
            }}
            dropdownMatchSelectWidth={false}
            placeholder="Time"
            open={key === 'start' ? this.state.openStart : this.state.openEnd}
          >
            {time_duration && time_duration.map((el) => {
              return <Option value={el.value}>{el.key}</Option>
            })}
          </Select>
        </Form.Item>
      </div>
    );
  };


  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      pick_up_location,
      drop_up_location,
      isDropOf,
      drop_up_latlng,
    } = this.state;
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    console.log("currentField", currentField);
    const { car_reqdata } = this.props;
    return (
      <div
        className={`location-search-wrap booking-location-search-wrap event-list-search car-filter-layer4`}
      >
        <Form
          ref={this.formRef}
          name="location-form"
          className="location-search"
          layout={"inline"}
          onFinish={this.handleSearch}
        >
          <Form.Item style={{ width: "calc(100% - 205px)" }}>
            <Input.Group
              compact
              className={
                isDropOf ? "venus-form form-with-drop-location" : "venus-form form-with-drop-location"
              }
            >
              <Form.Item noStyle name="pick_up">
                <PlacesAutocomplete
                  name="address"
                  handleAddress={this.handlePickupAddress}
                  addressValue={pick_up_location}
                  clearAddress={(add) => {
                    this.setState({
                      pick_up_location: "",
                      searchLatLng: "",
                    });
                  }}
                  myPlaceholder={"Pick Up Location"}
                />
              </Form.Item>
              {/* {isDropOf && ( */}
              <Form.Item noStyle name="drop_of">
                <PlacesAutocomplete
                  name="address"
                  handleAddress={this.handleDropofAddress}
                  addressValue={drop_up_location ? drop_up_location : ''}
                  clearAddress={(add) => {
                    this.setState({
                      drop_up_location: "",
                    });
                  }}
                  myPlaceholder={"Drop Off Location"}
                />
              </Form.Item>
              {/* )} */}
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary" shape={"circle"}>
                <Icon icon="search" size="20" />
              </Button>
            </Space>
          </Form.Item>
          <Row gutter={[10, 0]} className="location-more-form">
            <Col md={8} className="mrg-top-space pl-10">
              <div className="input-grp-compact">
                <Row gutter={0}>
                  <Col md={12} className="pick-up-box">
                    <div
                      className={
                        currentField && currentField["pick_up_date"]
                          ? "floating-label"
                          : ""
                      }
                    >
                      <Form.Item name="pick_up_date" label="Pick Up Date">
                        <DatePicker
                          format={dateFormat}
                          placeholder="Pick Up Date"
                          // onChange={this.setFloating}
                          onChange={() => this.setFloating('start')}

                          disabledDate={(current) => {
                            var dateObj = new Date();
                            dateObj.setDate(dateObj.getDate() - 1);
                            return current && current.valueOf() < dateObj;
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col md={12} className="pick-up-box pick-up-time-box">
                    <div
                      className={
                        currentField && currentField['start_time']
                          ? "floating-label"
                          : ""
                      }
                    >
                      {this.renderTimePicker('start_time', 'start')}
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={8} className="mrg-top-space">
              <div className="input-grp-compact">
                <Row gutter={0}>
                  <Col md={12} className="pick-up-box">
                    <div
                      className={
                        currentField && currentField["drop_of_date"]
                          ? "floating-label"
                          : ""
                      }
                    >
                      <Form.Item name="drop_of_date" label="Drop off Date">
                        <DatePicker
                          format={dateFormat}
                          placeholder="Drop off Date"
                          onChange={() => this.setFloating('end')}
                          disabledDate={(current) => {
                            let currentField =
                              this.formRef.current &&
                              this.formRef.current.getFieldsValue();
                            let startDate = currentField.pick_up_date;
                            return current && current.valueOf() < startDate;
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col md={12} className="pick-up-box pick-up-time-box">
                    <div
                      className={
                        currentField && currentField['end_time']
                          ? "floating-label"
                          : ""
                      }
                    >
                      {this.renderTimePicker('end_time', 'end')}
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={8} className="mrg-top-space">
              <div
                className={
                  currentField && currentField["drive_age"]
                    ? "floating-label"
                    : ""
                }
              >
                <Form.Item name="drive_age" label="Driver's age">
                  <Select
                    placeholder={"Driver's age"}
                    onChange={this.setFloating}
                    dropdownMatchSelectWidth={false}
                  >

                    <Option value={"25"}>25+</Option>
                    <Option value={"21"}>21 - 24</Option>
                    <Option value={"18"}>18 - 20</Option>
                    {/* <Option value={"20"}>22</Option>
                    <Option value={"20"}>20</Option>
                    <Option value={"20"}>19</Option>
                    <Option value={"20"}>18</Option> */}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          {/* <div className="location-more-option">
            <div className="booking-checkbox-width-block">
              <Checkbox
                checked={isDropOf}
                onChange={(e) => {
                  this.setState({
                    isDropOf: e.target.checked,
                    drop_up_location: e.target.checked ? drop_up_location : "",
                    drop_up_latlng: e.target.checked ? drop_up_latlng : "",
                  });
                }}
              >
                Drop off at different location
              </Checkbox>
            </div>
          </div> */}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { carList, car_reqdata } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    params: car_reqdata,
  };
};

export default CarSearch = connect(mapStateToProps, {
  carSearchAPI,
  setCarReqData,
  enableLoading,
  disableLoading,
  storeSearchDataAPI,
})(withRouter(CarSearch));
