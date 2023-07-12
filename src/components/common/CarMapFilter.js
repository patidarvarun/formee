import React, { Component } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import moment from "moment";
import {
  setCarReqData,
  enableLoading,
  disableLoading,
  carSearchAPI,
} from "../../actions";
import {
  Typography,
  Form,
  Select,
  Button,
  DatePicker,
  Row,
  Col,
  Checkbox,
} from "antd";
import { langs } from "../../config/localization";
import "./mapView.less";
import PlacesAutocomplete from "../common/LocationInput";
import { withRouter } from "react-router";
import { HOURS, MINUTES } from "../../config/Constant";

const { Text } = Typography;
const { Option } = Select;

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
class MapFilter extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      classifiedList: [],
      isFilter: true,
      isProCard: true,
      selectedDistance: 0,
      searchKey: "",
      isSearch: false,
      filteredData: [],
      hours: HOURS,
      minutes: MINUTES,
      isSearchResult: false,
      searchLatLng: "",
      selectedOption: "",
      isFloated: false,
      pick_up_date: "",
      pick_up_latlng: "",
      pick_up_location: "",
      isDropOf: false,
    };
  }


  /**
   * @method componentDidMount
   * @description call after render the component
   */
   componentDidMount() {
    const { params, listingPage } = this.props;
    console.log("params", params);
    if (listingPage) {
      this.props.setCarReqData("");
    } else if (params) {
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          pick_up_date:
            params.values && params.values.pick_up_date
              ? moment(params.values.pick_up_date)
              : "",
          drop_of_date:
            params.values && params.values.drop_of_date
              ? moment(params.values.drop_of_date)
              : "",
          hours1: params.values ? params.values.hours1 : "",
          minutes1: params.values ? params.values.minutes1 : "",
          hours2: params.values ? params.values.hours1 : "",
          minutes2: params.values ? params.values.minutes1 : "",
          drive_age: params.values ? params.values.drive_age : "",
        });
      this.setState({
        isDropOf: params.isDropOf ? true : false,
        pick_up_latlng: params.pick_up_latlng ? params.pick_up_latlng : "",
        drop_up_latlng: params.drop_up_latlng
          ? params.drop_up_latlng
          : params.pick_up_latlng,
        pick_up_location: params.pick_up_location
          ? params.pick_up_location
          : "",
        drop_up_location: params.drop_up_location
          ? params.drop_up_location
          : "",
        from_location: params.from_location,
        to_location: params.to_location
          ? params.to_location
          : params.from_location,
      });
    }
  }


  applyFilter = (values) => {
    console.log("value: ", values);
    const {
      isDropOf,
      pick_up_latlng,
      drop_up_latlng,
      pick_up_location,
      drop_up_location,
    } = this.state;
    const { isLoggedIn, loggedInDetail } = this.props;
    let start_time = `${values.hours1 ? values.hours1 : "12"}:${
      values.minutes1 ? values.minutes1 : "00"
    }`;
    let start_date = values.pick_up_date
      ? `${moment(values.pick_up_date).format("YYYY-MM-DD")} ${start_time}`
      : "";
    let end_time = `${values.hours2 ? values.hours2 : "12"}:${
      values.minutes2 ? values.minutes2 : "00"
    }`;
    let end_date = values.drop_of_date
      ? `${moment(values.drop_of_date).format("YYYY-MM-DD")} ${end_time}`
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
    const default_values = {
      pick_up_location,
      drop_up_location,
      pick_up_latlng,
      drop_up_latlng,
      isDropOf,
      values: values,
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
          let data = res.data;
          let carListing =
            data && data.rates && Array.isArray(data.rates) && data.rates.length
              ? data.rates
              : [];
          this.props.handleFilters(carListing);
        } else {
          this.props.handleFilters([]);
        }
      });
    } else {
      toastr.warning(langs.warning, `All ${langs.messages.mandate_filter}`);
    }
  };

  /**
   * @method renderTimePicker
   * @description render time picker
   */
  renderTimePicker = (name1, name2) => {
    const { hours, minutes } = this.state;
    return (
      <div className="input-grp-compact">
        <Row gutter={0}>
          <Col md={12}>
            <Form.Item name={name1} className="time-selector">
              <Select onChange={this.setFloating} placeholder="Time">
                {hours &&
                  hours.map((el) => {
                    return <Option value={el}>{el}</Option>;
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item name={name2}>
              <Select onChange={this.setFloating}>
                {minutes &&
                  minutes.map((el) => {
                    return <Option value={el}>{el}</Option>;
                  })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  };

  /**
   * @method handlePickupAddress
   * @description handle drop of address
   */
  handlePickupAddress = (result, address, latLng) => {
    let city = "";
    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
      }
    });
    this.setState({ pick_up_latlng: latLng, pick_up_location: address });
  };

  /**
   * @method handleDropofAddress
   * @description handle drop of address
   */
  handleDropofAddress = (result, address, latLng) => {
    let city = "";
    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
      }
    });
    this.setState({ drop_up_latlng: latLng, drop_up_location: address });
  };

  setFloating = () => {
    this.setState({ isFloated: true });
  };

  render() {
    const {
      isDropOf,
      pick_up_location,
      drop_up_location,
      drop_up_latlng,
    } = this.state;
    console.log('isDropOf: ', isDropOf);
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    if (!this.props.isFilter) {
      return true;
    }
    return (
      <Form
        layout="vertical"
        className="map-filter"
        onFinish={this.applyFilter}
        ref={this.formRef}
      >
        <Form.Item label="Pick - up" name="name" ref={this.formRef}>
          <Row className="">
            <Col lg={24}>
              <Form.Item name="pick_up" noStyle>
                <div className="map-location">
                  <PlacesAutocomplete
                    name="address"
                    handleAddress={this.handlePickupAddress}
                    addressValue={pick_up_location}
                    clearAddress={(add) => {
                      this.setState({
                        pick_up_location: "",
                        pick_up_latlng: "",
                      });
                    }}
                    myPlaceholder={"Pick-up point"}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
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
                <Form.Item name="pick_up_date">
                  <DatePicker
                    placeholder="Date"
                    onChange={this.setFloating}
                    disabledDate={(current) => {
                      var dateObj = new Date();
                      dateObj.setDate(dateObj.getDate() - 1);
                      return current && current.valueOf() < dateObj;
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col md={12} className="pick-up-box time-box">
              <div
                className={
                  currentField && currentField["hours1"] ? "floating-label" : ""
                }
              >
                {this.renderTimePicker("hours1", "minutes1")}
              </div>
            </Col>
          </Row>
        </div>

       {isDropOf && <Form.Item label="Drop - off" name="name" ref={this.formRef}>
          <Form.Item name="drop_of" noStyle>
            <div className="map-location">
              <PlacesAutocomplete
                name="address"
                handleAddress={this.handleDropofAddress}
                addressValue={drop_up_location}
                clearAddress={(add) => {
                  this.setState({
                    drop_up_location: "",
                    drop_up_latlng: "",
                  });
                }}
                myPlaceholder={"Drop of point"}
              />
            </div>
          </Form.Item>
        </Form.Item>}
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
                <Form.Item name="drop_of_date">
                  <DatePicker
                    placeholder="Date"
                    onChange={this.setFloating}
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
            <Col md={12} className="pick-up-box time-box">
              <div
                className={
                  currentField && currentField["hours2"] ? "floating-label" : ""
                }
              >
                {this.renderTimePicker("hours2", "minutes2")}
              </div>
            </Col>
          </Row>
        </div>

        {/* <div className="short-box">
          <label>Short</label>
          <Select defaultValue="test">
            <Option value="test">Test</Option>
          </Select>
        </div> */}
        {/* <div className="more-option">More option</div> */}
        <Checkbox
          onChange={onChange}
          className="check-diff-location"
          checked={isDropOf}
          onChange={(e) => {
            console.log('e: ', e);
            this.setState({
              isDropOf: e.target.checked,
              drop_up_location: e.target.checked ? drop_up_location : "",
              drop_up_latlng: e.target.checked ? drop_up_latlng : "",
            });
          }}
        >
          Drop off at a different location
        </Checkbox>
        <Form.Item className="align-center">
          <Button type="default" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth ,tourism} = store;
  const { carList, car_reqdata } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    params:car_reqdata
  };
};
export default connect(mapStateToProps, {
  setCarReqData,
  enableLoading,
  disableLoading,
  carSearchAPI,
})(withRouter(MapFilter));
