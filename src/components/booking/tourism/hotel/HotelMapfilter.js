import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import moment from "moment";
import { langs } from "../../../../config/localization";
import {
  setHotelReqData, hotelSearchAPI, enableLoading, disableLoading
} from "../../../../actions";
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
import "../../../common/mapView.less";
import AutoComplete from "../flight/FlightAutoComplete";
import { blankValueCheck } from '../../../common'

const { Text } = Typography;
const { Option } = Select;

let dateFormat = 'DD/MM/YYYY'

class MapFilter extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      from_location: ''
    };
  }


  /**
   * @method componentWillMount
   * @description call before mounting the component
   */
  componentWillMount = () => {
    const { params } = this.props;
    if (params) {
      this.setState({
        from_location: params.from_location,
      });
    }
  }

  /**
   * @method componentDidMount
   * @description call after render the component
   */
  componentDidMount() {
    const { params, landingPage } = this.props;
    console.log('params', params)
    if (landingPage) {
      this.props.setHotelReqData("");
    } else if (params) {
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          check_in_date: params.values && params.values.check_in_date ? moment(params.values.check_in_date) : "",
          check_out_date: params.values && params.values.check_out_date ? moment(params.values.check_out_date) : "",
          adults: params.values && params.values.adults ? params.values.adults : '',
          children: params.values && params.values.children ? params.values.children : '',
          rooms: params.values && params.values.rooms ? params.values.rooms : 1,
          sort: params.values && params.values.sort,
        });
    }
  }

  /**
   * @method handleSort
   * @description handle in appp sorting
   */
  handleSort = (e, currentList) => {
    let filteredList = currentList.sort(function (a, b) {
      let first = a.basicPropertyInfo ? a.basicPropertyInfo : ''
      let second = b.basicPropertyInfo ? b.basicPropertyInfo : ''
      let obj1 = first.amount && first.amount.amountAfterTax ? first.amount.amountAfterTax : 0
      let obj2 = second.amount && second.amount.amountAfterTax ? second.amount.amountAfterTax : 0
      if (e === '1') {
        if (obj1 > obj2) return -1;
        if (obj1 < obj2) return 1;
        return 0;
      } else if (e === '0') {
        if (obj1 < obj2) return -1;
        if (obj1 > obj2) return 1;
        return 0;
      }
    })
    this.props.handleFilters(filteredList);
  }

  /**
   * @method applyFilter
   * @description apply map filters
   */
  applyFilter = (values) => {

    const { from_location } = this.state
    let reqData = {
      hotelCityCode: from_location ? from_location.code : '',
      radius: 300,
      startDate: values.check_in_date ? `${moment(values.check_in_date).format("YYYY-MM-DD")}` : '',
      endDate: values.check_out_date ? `${moment(values.check_out_date).format("YYYY-MM-DD")}` : '',
      breakfast: false,
      maxRate: 50000,
      minRate: 50,
      rating: null,
      hotelAmenities: [],
      rooms: [
        {
          totalAdults: values.adults ? values.adults : 0,
          totalChildren: values.children ? values.children : 0,
          childrenAges: []
        }
      ],
      maxPriceRange: 0
    }
    let default_value = {
      from_location,
      reqData,
      values
    }
    if (blankValueCheck(from_location) && blankValueCheck(reqData.startDate) && blankValueCheck(reqData.endDate) && blankValueCheck(values.adults) && blankValueCheck(values.children)) {
      this.props.enableLoading()
      this.props.hotelSearchAPI(reqData, res => {
        this.props.disableLoading()
        if (res.status === 200) {
          let hotelSearchList = res.data
          let hotelList = hotelSearchList && hotelSearchList.data && Array.isArray(hotelSearchList.data.data) && hotelSearchList.data.data.length ? hotelSearchList.data.data : []
          this.props.setHotelReqData(default_value)
          if (values.sort) {
            this.handleSort(values.sort, hotelList)
          } else {
            this.props.handleFilters(hotelList);
          }
        }
      })
    } else {
      toastr.warning(langs.warning, `All ${langs.messages.mandate_filter}`);
    }
  };


  setFloating = () => {
    this.setState({ isFloated: true });
  };

  render() {
    const { from_location } = this.state;
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue();
    if (!this.props.isFilter) {
      return true;
    }
    return (
      <Form
        layout="vertical"
        className="map-filter hotel-map-filter"
        onFinish={this.applyFilter}
        ref={this.formRef}
      >
        <Form.Item label="Destination" name="name" ref={this.formRef}>
          <Row className="">
            <Col lg={24}>
              <Form.Item name="pick_up" noStyle>
                <div className="map-location">
                  <AutoComplete
                    className=""
                    handleSearchSelect={(option) => {
                      this.setState({ from_location: option });
                    }}
                    handleValueChange={(value) => { }}
                    placeHolder="Enter Your Destination"
                    defaultValue={from_location ? from_location.name : ''}
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
                  currentField && currentField["check_in_date"]
                    ? "floating-label"
                    : ""
                }
              >
                <Form.Item name="check_in_date" label="Date">
                  <DatePicker
                    format={dateFormat}
                    placeholder="Check in Date"
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
                  currentField && currentField["check_out_date"] ? "floating-label" : ""
                }
              >
                <Form.Item name="check_out_date">
                  <DatePicker
                    format={dateFormat}
                    label={'         '}
                    placeholder="Check out Date"
                    onChange={this.setFloating}
                    disabledDate={(current) => {
                      let currentField = this.formRef.current && this.formRef.current.getFieldsValue();
                      let startDate = currentField.check_in_date;
                      return current && current.valueOf() < startDate;
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>
        <div className={currentField && currentField["rooms"] ? "floating-label" : ""}>
          <Form.Item name="rooms" label="Guests">
            <Select placeholder={"Rooms"} onChange={this.setFloating}>
              <Option value={"1"}>1</Option>
              <Option value={"2"}>2</Option>
              <Option value={"3"}>3</Option>
              <Option value={"4"}>4</Option>
            </Select>
          </Form.Item>
        </div>
        <div className={currentField && currentField["adults"] ? "floating-label" : ""}>
          <Form.Item name="adults" onChange={this.setFloating}>
            <Select placeholder={'Adults'}>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>
          </Form.Item>
        </div>
        <div className={currentField && currentField["children"] ? "floating-label" : ""}>
          <Form.Item name="children" onChange={this.setFloating}>
            <Select placeholder={'Children'}>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>
          </Form.Item>
        </div>
        <div className={currentField && currentField["sort"] ? "floating-label" : ""}>
          <Form.Item name="sort" label={'Sort'} onChange={this.setFloating}>
            <Select placeholder={'Sort'}>
              <Option value='1'>Price (High-Low)</Option>
              <Option value='0'>Price (Low-High)</Option>
            </Select>
          </Form.Item>
        </div>
        <Checkbox>
          Flexible Dates
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
  const { auth, tourism } = store;
  const { hotelReqdata } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    params: hotelReqdata
  };
};
export default connect(mapStateToProps, {
  setHotelReqData, hotelSearchAPI, enableLoading, disableLoading
})(withRouter(MapFilter));
