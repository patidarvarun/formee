import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import moment from 'moment'
import { langs } from "../../../../config/localization";
import {
  Checkbox,
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
import AutoComplete from "../flight/FlightAutoComplete";
import { setHotelReqData, hotelSearchAPI, enableLoading, disableLoading } from '../../../../actions'
import { blankValueCheck } from '../../../common'
const { Option } = Select;

let dateFormat = 'DD/MM/YYYY'

class HotelSearch extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      from_location: '',
      number: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
    };
  }

  /**
   * @method componentWillMount
   * @description call before mounting the component
   */
  componentWillMount = () => {
    const {landingPage, params } = this.props;
    if (landingPage) {
      this.props.setHotelReqData("");
    }else if(params){
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
          children: params.values && params.values.children,
          rooms: params.values && params.values.rooms
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



  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = (values) => {
    const { from_location } = this.state
    let rooms = values.rooms ? values.rooms : 1
    let numberOfrooms = []
    for(let i=1; i<=rooms; i++){
      numberOfrooms.push({
        totalAdults: values.adults ? values.adults : 0,
        totalChildren: values.children ? values.children : 0,
        childrenAges: []
      })
    }
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
      rooms: numberOfrooms,
      maxPriceRange: 0
    }
    let default_value = {
      from_location,
      reqData,
      values
    }
    if (blankValueCheck(from_location) && blankValueCheck(reqData.startDate) && blankValueCheck(reqData.endDate) && blankValueCheck(values.adults)) {
      this.props.enableLoading()
      this.props.hotelSearchAPI(reqData, res => {
        this.props.disableLoading()
        if (res.status === 200) {
          this.props.setHotelReqData(default_value)
          this.props.handleSearchResponce(res.data, false, reqData);
        }
      })
    } else {
      toastr.warning(langs.warning, `All ${langs.messages.mandate_filter}`);
    }
  };

  setFloating = () => {
    this.setState({ isFloated: true });
  };


  /**
   * @method render
   * @description render component
   */
  render() {
    const {number, from_location } = this.state
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue();
    console.log("currentField", currentField);
    let adult = currentField && currentField["adults"] 
    let children =  currentField && currentField["children"]
    let room =  currentField && currentField["rooms"]
    let location = from_location ? `${from_location.city_name}, ${from_location.country_name}` : ''
    return (
      <div
        className={`location-search-wrap booking-location-search-wrap event-list-search booking-turism-filter booking-turism-hotel-filter`}
      >
        <Form
          ref={this.formRef}
          name="location-form"
          className="location-search"
          layout={"inline"}
          onFinish={this.handleSearch}
        >
          <Form.Item style={{ width: "calc(100% - 205px)" }}>
            <Input.Group compact className="venus-form">
              <Form.Item noStyle name="pick_up">
                <AutoComplete
                  className=""
                  handleSearchSelect={(option) => {
                    this.setState({ from_location: option });
                  }}
                  handleValueChange={(value) => { }}
                  placeHolder="Enter Your Destination"
                  defaultValue={location}
                  type={'hotel'}
                />
              </Form.Item>
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
            <Col md={6} className="mrg-top-space">
              <div
                className={
                  currentField && currentField["check_in_date"]
                    ? "floating-label"
                    : ""
                }
              >
                <Form.Item name="check_in_date" label="Check in Date">
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
            <Col md={6} className="mrg-top-space">
              <div
                className={
                  currentField && currentField["check_out_date"]
                    ? "floating-label"
                    : ""
                }
              >
                <Form.Item name="check_out_date" label="Check out Date">
                  <DatePicker
                    format={dateFormat}
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
            <Col md={6} className="mrg-top-space">
              <div className="input-grp-compact">
                <Row gutter={0}>
                  <Col md={12} className="hotel-adult-left">
                    <div
                      className={
                        currentField && currentField["adults"]
                          ? "floating-label"
                          : ""
                      }
                    >
                      <Form.Item name="adults" label={adult && adult > 1 ? 'Adults' : 'Adult'}>
                        <Select placeholder={adult && adult > 1 ? 'Adults' : 'Adult'} onChange={this.setFloating}>
                          {number && number.map(el => {
                            return  <Option value={el}>{el}</Option>
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col md={12} className="hotel-adult-right">
                    <div
                      className={
                        currentField && currentField["children"]
                          ? "floating-label"
                          : ""
                      }
                    >
                      <Form.Item name="children" label={children && children > 1 ? 'Children' : 'Child'}>
                        <Select placeholder={children && children > 1 ? 'Children' : 'Child'} onChange={this.setFloating}>
                          {number && number.map(el => {
                            return  <Option value={el}>{el}</Option>
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={6} className="mrg-top-space">
              <div
                className={
                  currentField && currentField["rooms"]
                    ? "floating-label"
                    : ""
                }
              >
                <Form.Item name="rooms" label={room && room > 1 ? 'Rooms' : 'Room'}>
                  <Select placeholder={room && room > 1 ? 'Rooms' : 'Room'} onChange={this.setFloating}>
                    {number && number.map(el => {
                      return  <Option value={el}>{el}</Option>
                    })}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="location-more-option">
            <div className="booking-checkbox-width-block">
              <Checkbox>
                Flexible on dates
              </Checkbox>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { hotelReqdata } = tourism
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    params: hotelReqdata
  };
};

export default HotelSearch = connect(mapStateToProps, {
  hotelSearchAPI,
  enableLoading,
  disableLoading,
  setHotelReqData
})(withRouter(HotelSearch));
