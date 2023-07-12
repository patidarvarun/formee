import React from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { langs } from "../../../../config/localization";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import {
  Tag,
  Dropdown,
  Tabs,
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
  AutoComplete,
} from "antd";
import Icon from "../../../customIcons/customIcons";
import MulticityAutoComplete from "./FlightAutoComplete";
import {
  setTourismFlightSearchData,
  multiCityInitialValues,
  enableLoading,
  disableLoading,
  getFlightSearchRecords,
  storeSearchDataAPI,
  getFlightAutocompleteList,
} from "../../../../actions";
import {
  PlusOutlined,
  MinusOutlined,
  SwapRightOutlined,
  SwapLeftOutlined,
} from "@ant-design/icons";
import {
  blankValueCheck,
  createRandomString,
  capitalizeFirstLetter,
} from "../../../common";
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

let dateFormat = "DD/MM/YYYY";

class FlightSearch extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      searchLatLng: "",
      isShowMore: false,
      from_location: "",
      to_location: "",
      searchItem1: "",
      searchItem2: "",
      activeKey: "1",
      adult: 0,
      child: 0,
      infant: 0,
      visible: false,
      flightArray: [],
      result: [],
    };
  }

  /**
   * @method componentWillMount
   * @description called before render the component
   */
  componentWillMount() {
    let data = this.props.location.state;
    let params = this.props.search_params;
    console.log("params", params);
    const { multi_city_Initial, landingPage } = this.props;
    if (landingPage) {
      this.props.multiCityInitialValues([]);
    } else if (data && params) {
      let tempArray = [];
      multi_city_Initial &&
        Array.isArray(multi_city_Initial) &&
        multi_city_Initial.length &&
        multi_city_Initial.map((el, i) => {
          tempArray.push({
            from_location:
              el.from_location && el.from_location.name
                ? this.setDefaultValue(el.from_location)
                : el.from_location,
            to_location:
              el.to_location && el.to_location.name
                ? this.setDefaultValue(el.to_location)
                : el.to_location,
            depart: el.depart ? moment(el.depart) : "",
          });
        });
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          flights: tempArray,
          from_location: params.from_location
            ? this.setDefaultValue(params.from_location)
            : "",
          to_location: params.to_location
            ? this.setDefaultValue(params.to_location)
            : "",
        });
      this.formRef.current &&
        console.log(this.formRef.current.getFieldsValue(), " <<< Hello");
      this.setState({
        from_location: params.from_location,
        to_location: params.to_location,
        adult: params.reqData.passenger ? params.reqData.passenger.adult : 0,
        child: params.reqData.passenger ? params.reqData.passenger.child : 0,
        infant: params.reqData.passenger ? params.reqData.passenger.infant : 0,
        flightArray: tempArray,
      });
    }
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { landingPage } = this.props;
    let data = this.props.search_params;
    if (landingPage) {
      this.props.setTourismFlightSearchData("");
      this.setState({ from_location: "", to_location: "" });
    } else if (data && data.reqData) {
      let type = data.reqData.type;
      let depart =
        data.reqData.dates && data.reqData.dates.from
          ? moment(data.reqData.dates.from)
          : "";
      let return_date =
        data.reqData.dates && data.reqData.dates.return
          ? moment(data.reqData.dates.return)
          : "";
      let depart_date = type === 2 ? [depart, return_date] : depart;
      console.log(type, "depart_date", depart_date);
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          depart: depart_date,
          class: data.reqData.cabin,
          from_location: data.from_location
            ? this.setDefaultValue(data.from_location)
            : "",
          to_location: data.to_location
            ? this.setDefaultValue(data.to_location)
            : "",
        });
      // this.formRef.current &&
      //   this.formRef.current.setFieldsValue({
      //     depart:data.reqData.dates && data.reqData.dates.from ? moment(data.reqData.dates.from) : "",
      //     return: data.reqData.dates && data.reqData.dates.return ? moment(data.reqData.dates.return) : "",
      //     class: data.reqData.cabin,
      //   });
      this.setState({
        initial: true,
        activeKey:
          data.reqData.type === 3 ? "3" : data.reqData.type === 1 ? "2" : "1",
      });
    }
  }

  /**
   * @method handleAutoCompleteSearch
   * @descriptionhandle handle search
   */
  handleAutoCompleteSearch = (value, type) => {
    if (value) {
      this.props.getFlightAutocompleteList(value, (res) => {
        if (res.status === 200) {
          console.log("res", res.data);
          let data =
            res.data &&
            res.data.data &&
            res.data.data.body &&
            Array.isArray(res.data.data.body)
              ? res.data.data.body
              : [];
          if (data && data.length) {
            this.setState({ result: !value ? [] : [...data] });
          } else {
            this.setState({ result: [] });
          }
        }
      });
    } else {
      if (type === 1) this.setState({ from_location: value });
      else this.setState({ to_location: value });
    }
  };

  /**
   * @method resetSearch
   * @description Use to reset Search bar
   */
  resetSearch = () => {
    this.setState({
      from_location: "",
      to_location: "",
      adult: 0,
      child: 0,
      infant: 0,
      flightArray: [],
    });
    this.props.multiCityInitialValues([]);
    this.formRef.current.resetFields();
    this.props.handleSearchResponce("", true, {});
  };

  /**
   * @method handleOneWayFilter
   * @description handle one way filter
   */
  handleOneWayFilter = (values) => {
    const {
      adult,
      child,
      infant,
      activeKey,
      from_location,
      to_location,
    } = this.state;
    let from = "",
      return_date = "";
    console.log("#", activeKey);
    if (activeKey === "1") {
      if (
        values.depart &&
        Array.isArray(values.depart) &&
        values.depart.length
      ) {
        console.log(
          values.depart,
          "values.depart",
          values.depart[0],
          values.depart[1]
        );
        from = values.depart[0]
          ? moment(values.depart[0]).format("YYYY-MM-DD")
          : "";
        return_date = values.depart[1]
          ? moment(values.depart[1]).format("YYYY-MM-DD")
          : "";
        console.log("#from", from, return_date);
      }
    } else {
      from = values.depart ? moment(values.depart).format("YYYY-MM-DD") : "";
      return_date = values.return
        ? moment(values.return).format("YYYY-MM-DD")
        : "";
    }
    let reqData = {
      token: createRandomString(),
      range_qualifier: true,
      passengersStr: adult + child + infant,
      cabin: values.class,
      dates: {
        from: from,
      },
      origin: from_location.code,
      destination: to_location.code,
      passenger: {
        child: child,
        adult: adult,
        infant: infant,
      },
      type: 1,
    };
    if (activeKey === "1") {
      reqData.dates = {
        from: from,
        return: return_date,
      };
      reqData.type = 2;
    }

    return reqData;
  };

  /**
   * @method handleMulticityFilter
   * @description handle multicity filter
   */
  handleMulticityFilter = (values) => {
    const { search_params, multi_city_Initial } = this.props;
    console.log("values", values);
    let temp = [];
    const { adult, child, infant } = this.state;
    console.log(multi_city_Initial, "multi_city_Initial", search_params);
    if (values.flights && values.flights.length) {
      values.flights.map((el, i) => {
        temp.push({
          date: el.depart ? moment(el.depart).format("YYYY-MM-DD") : "",
          origin:
            el.from_location && el.from_location.code
              ? el.from_location.code
              : search_params &&
                search_params.reqData &&
                search_params.reqData.multi_city &&
                search_params.reqData.multi_city[i]
              ? search_params.reqData.multi_city[i].origin
              : "",
          destination:
            el.to_location && el.to_location.code
              ? el.to_location.code
              : search_params &&
                search_params.reqData &&
                search_params.reqData.multi_city &&
                search_params.reqData.multi_city[i]
              ? search_params.reqData.multi_city[i].destination
              : "",
        });
      });
    }
    return {
      token: createRandomString(),
      range_qualifier: true,
      passengersStr: adult + child + infant,
      cabin: values.class,
      passenger: {
        child: child,
        adult: adult,
        infant: infant,
      },
      type: 3,
      multi_city: temp,
    };
  };

  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = (values) => {
    console.log("values", values);
    const { isLoggedIn, loggedInDetail } = this.props;
    console.log("multi_city_initial values", values.flights);
    const {
      adult,
      child,
      infant,
      activeKey,
      from_location,
      to_location,
    } = this.state;
    let from = "",
      return_date = "";
    console.log("#", activeKey);
    if (activeKey === "1") {
      if (
        values.depart &&
        Array.isArray(values.depart) &&
        values.depart.length
      ) {
        console.log(
          values.depart,
          "values.depart",
          values.depart[0],
          values.depart[1]
        );
        from = values.depart[0]
          ? moment(values.depart[0]).format("YYYY-MM-DD")
          : "";
        return_date = values.depart[1]
          ? moment(values.depart[1]).format("YYYY-MM-DD")
          : "";
        console.log("#from", from, return_date);
      }
    } else {
      from = values.depart ? moment(values.depart).format("YYYY-MM-DD") : "";
      return_date = values.return
        ? moment(values.return).format("YYYY-MM-DD")
        : "";
    }
    let defaultData = {
      from_location,
      to_location,
      depart: from ? from : "",
      return: return_date ? return_date : "",
      class: values.class,
      adult: adult,
      child: child,
      infant: infant,
      activeKey,
    };
    this.props.multiCityInitialValues(values.flights);
    let reqData =
      activeKey === "3"
        ? this.handleMulticityFilter(values)
        : this.handleOneWayFilter(values);
    let isEmpty = values.flights.some(
      (el) =>
        el.from_location == undefined ||
        el.from_location == "" ||
        el.to_location == undefined ||
        el.to_location == "" ||
        el.depart == undefined ||
        el.depart == ""
    );
    console.log("reqData", reqData);
    //check multi city isempty check
    if (
      activeKey !== "1" &&
      activeKey !== "2" &&
      (isEmpty || adult === 0 || values.class === undefined)
    ) {
      toastr.warning(langs.warning, `All ${langs.messages.mandate_filter}`);
      console.log("case1");
    } //check onway or return isempty check
    else if (
      activeKey === "2" &&
      (blankValueCheck(from_location) == "" ||
        blankValueCheck(to_location) == "" ||
        blankValueCheck(from) === "" ||
        blankValueCheck(values.class) === "" ||
        (adult === 0 && child === 0 && infant === 0))
    ) {
      toastr.warning(langs.warning, `All ${langs.messages.mandate_filter}`);
      console.log("case2");
    } else if (
      activeKey === "1" &&
      (blankValueCheck(from_location) == "" ||
        blankValueCheck(to_location) == "" ||
        blankValueCheck(from) === "" ||
        blankValueCheck(return_date) === "" ||
        blankValueCheck(values.class) === "" ||
        (adult === 0 && child === 0 && infant === 0))
    ) {
      toastr.warning(langs.warning, `All ${langs.messages.mandate_filter}`);
      console.log("case2");
    } else {
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

        this.props.resetFilters();
        if (res.status === 200) {
          console.log("from_location", from_location, to_location);
          let recomendations = res.data && res.data.body ? res.data.body.recomendations : [];
          if(recomendations && recomendations.length){
            let reqData = {
              module_type: "flight",
              user_id: isLoggedIn && loggedInDetail ? loggedInDetail.id : "",
              source_city: from_location && from_location.city_name,
              destination_city: to_location && to_location.city_name,
              source_country: from_location && from_location.country_name,
              destination_country: to_location && to_location.country_name,
              source_country_code:
                from_location && from_location.country_code
                  ? from_location.country_code
                  : "",
              destination_country_code:
                to_location && to_location.country_code
                  ? to_location.country_code
                  : "",
              city_code:
                to_location && to_location.city_code ? to_location.city_code : "",
              source_airport_code:
                from_location && from_location.city_code
                  ? from_location.city_code
                  : "",
              destination_airport_code:
                to_location && to_location.city_code ? to_location.city_code : "",
              source_airport_name:
                from_location && from_location.name ? from_location.name : "",
              destination_airport_name:
                to_location && to_location.name ? to_location.name : "",
            };
            this.props.storeSearchDataAPI(reqData);
          }
          this.props.handleSearchResponce(res.data, false, defaultData);
        } else {
          this.props.handleSearchResponce([], false, defaultData);
        }
      });
    }
  };

  /**
   * @method setFloating
   * @description set floated label
   */
  setFloating = () => {
    let currentField = this.formRef.current.getFieldsValue();
    console.log("currentValue: step1", this.formRef.current.getFieldsValue());

    this.setState({ isFloated: true });
  };

  /**
   * @method renderadultValues
   * @description render passenger values
   */
  renderadultValues = (name, key, label) => {
    return (
      <Row>
        <Col md={24}>
          <b className="fs-11">
            {name} {/*{key}{" "} */}
          </b>
        </Col>
        <Col md={24}>
          <div className="incre-decreme-val">
            <div>
              {" "}
              <span
                className="minus-outlined"
                onClick={() => {
                  if (key !== 0) {
                    this.setState({ [label]: key - 1 });
                  }
                }}
              >
                <MinusOutlined />
              </span>
            </div>
            <div className="value">{[key]}</div>
            <div>
              <span
                className="plus-outlined"
                onClick={() => {
                  this.setState({ [label]: key + 1 });
                }}
              >
                <PlusOutlined />
              </span>
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  handleDropdownVisibility = (val) => {
    this.setState({
      visible: val,
    });
  };

  /**
   * @method renderPassengerDrodown
   * @description render passenger dropdown
   */
  renderPassengerDrodown = () => {
    const { adult, child, infant } = this.state;
    let temp1 = adult > 1 ? "Adults" : "Adult";
    let temp2 = child > 1 ? "Children" : "Child";
    let temp3 = infant > 1 ? "Infants" : "Infant";
    const getMenu = () => (
      <div className="dropdown-container">
        {this.renderadultValues(temp1, adult, "adult")}
        {this.renderadultValues(temp2, child, "child")}
        {this.renderadultValues(temp3, infant, "infant")}
      </div>
    );
    return (
      <Dropdown
        overlay={getMenu()}
        trigger={["click"]}
        visible={this.state.visible}
        onVisibleChange={(val) => this.handleDropdownVisibility(val)}
      >
        <Tag color="default" style={{ padding: 7, cursor: "pointer" }}>
          {temp1} &nbsp; &nbsp;{adult}&nbsp; &nbsp; {temp2} &nbsp; &nbsp;{child}
          &nbsp; &nbsp;{temp3} &nbsp;{infant}&nbsp; &nbsp; &nbsp; &nbsp;
        </Tag>
      </Dropdown>
    );
  };

  /**
   * @method renderClass
   * @description render class
   */
  renderClass = () => {
    return (
      <Form.Item name="class" label="Class">
        <Select placeholder={"Class"} onChange={this.setFloating}>
          <Option value={"Economy"}>Economy</Option>
          <Option value={"Premium Economy"}>Premium Economy</Option>
          <Option value={"Business"}>Business class</Option>
          <Option value={"First"}>First class</Option>
        </Select>
      </Form.Item>
    );
  };

  /**
   * @method setDefaultValue
   * @description set default value
   */
  setDefaultValue = (el) => {
    let cityName = el.city_name ? el.city_name : "";
    let name = el.name ? el.name : "";
    let countryCode = el.code ? el.code : "";
    let airport = `${capitalizeFirstLetter(cityName)} ${capitalizeFirstLetter(
      name
    )} (${countryCode.toUpperCase()})`;
    return airport;
  };

  /**
   * @method renderOptions
   * @descriptionhandle render options
   */
  renderOptions = (type) => {
    return this.state.result.map((el, i) => {
      console.log("el:>> ", el);
      let cityName = el.city_name ? el.city_name : "";
      let name = el.name ? el.name : "";
      let countryName = el.country_name ? el.country_name : "";
      let countryCode = el.country_code ? el.country_code : "";
      let airport = `${capitalizeFirstLetter(cityName)}, ${capitalizeFirstLetter(
        name
      )}, ${countryCode}`;
      return (
        <Option key={i} value={airport}>
          <div
            onClick={() => {
              if (type === 1) this.setState({ from_location: el });
              else this.setState({ to_location: el });
            }}
          >
            <strong style={{ display: "block", fontWeight: "normal" }}>
              {airport}
            </strong>
            <p>{countryName}</p>
          </div>
        </Option>
      );
    });
  };

  renderRangePicker = (currentField) => {
    return (
      <Col md={8} className="mrg-top-space depart-date r1">
        <div
          className={
            currentField && currentField["depart"] ? "floating-label" : ""
          }
        >
          <Form.Item name="depart" label="Depart ~ Return">
            <RangePicker
              format={dateFormat}
              //placeholder="Depart ~ Return"
              renderExtraFooter={() => "extra footer"}
              onCalendarChange={(dates) => {
                if (dates && Array.isArray(dates) && dates.length) {
                  let depart_date = dates[0] ? dates[0] : "";
                  let return_date = dates[1] ? dates[1] : "";
                  this.setState({
                    depart_date: depart_date,
                    return_date: return_date,
                  });
                }
              }}
              disabledDate={(current) => {
                var dateObj = new Date();
                dateObj.setDate(dateObj.getDate() - 1);
                return current && current.valueOf() < dateObj;
              }}
            />
          </Form.Item>
        </div>
      </Col>
    );
  };

  renderDepartTime = (currentField) => {
    return (
      <Col md={8} className="mrg-top-space depart-date r2">
        <div
          className={
            currentField && currentField["depart"] ? "floating-label" : ""
          }
        >
          <Form.Item name="depart" label="Depart">
            <DatePicker
              format={dateFormat}
              placeholder="Depart"
              onChange={(dates) => {
                this.setState({ isfloated: true });
              }}
              disabledDate={(current) => {
                var dateObj = new Date();
                dateObj.setDate(dateObj.getDate() - 1);
                return current && current.valueOf() < dateObj;
              }}
            />
          </Form.Item>
        </div>
      </Col>
    );
  };

  renderDatePicker = (currentField, column, activeKey) => {
    return (
      <>
        <Col md={column} className="mrg-top-space depart-date r3">
          <div
            className={
              currentField && currentField["depart"] ? "floating-label" : ""
            }
          >
            <Form.Item name="depart" label="Depart">
              <DatePicker
                format={dateFormat}
                placeholder="Depart"
                onChange={(dates) => {
                  console.log("dates", dates);
                  this.formRef.current &&
                    this.formRef.current.setFieldsValue({
                      return: dates,
                    });
                  this.setState({ isfloated: true });
                }}
                disabledDate={(current) => {
                  var dateObj = new Date();
                  dateObj.setDate(dateObj.getDate() - 1);
                  return current && current.valueOf() < dateObj;
                }}
              />
            </Form.Item>
          </div>
        </Col>
        {activeKey === "1" && (
          <Col md={column} className="mrg-top-space depart-date adult-date r4">
            <div
              className={
                currentField && currentField["return"] ? "floating-label" : ""
              }
            >
              <Form.Item name="return" label="Return">
                <DatePicker
                  format={dateFormat}
                  placeholder="Return"
                  onChange={this.setFloating}
                  disabledDate={(current) => {
                    let currentField =
                      this.formRef.current &&
                      this.formRef.current.getFieldsValue();
                    let startDate = currentField.depart;
                    return current && current.valueOf() < startDate;
                  }}
                />
              </Form.Item>
            </div>
          </Col>
        )}
      </>
    );
  };

  /**
   * @method renderOnWayReturnFilter
   * @description render on way or return filter
   */
  renderOnWayReturnFilter = () => {
    const {
      to_location,
      from_location,
      activeKey,
      searchItem1,
      searchItem2,
    } = this.state;
    const { listPage } = this.props;
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    let column = activeKey === "1" ? 6 : 8;
    return (
      <>
        <Form.Item style={{ width: "calc(100% - 205px)" }}>
          <Input.Group compact className="venus-form">
            <Form.Item
              noStyle
              name="from_location"
              className="filter-left-input2"
            >
              <AutoComplete
                allowClear
                defaultActiveFirstOption={false}
                style={{ minWidth: 200 }}
                className="dark-bdr-right"
                onSearch={(v) => this.handleAutoCompleteSearch(v, 1)}
                placeholder={"From"}
                optionLabelProp="title"
              >
                {this.renderOptions(1)}
              </AutoComplete>
            </Form.Item>
            <div
              class="swap-left-right"
              onClick={() => {
                let currentField = this.formRef.current.getFieldsValue();
                console.log(
                  "currentValue: step1",
                  this.formRef.current.getFieldsValue()
                );
                currentField.from_location = currentField.to_location;
                currentField.to_location = this.formRef.current.getFieldsValue().from_location;
                console.log("currentValue: step2", currentField);

                this.formRef.current &&
                  this.formRef.current.setFieldsValue({
                    from_location: currentField.from_location,
                    to_location: currentField.to_location,
                    // ...currentField,
                  });
                console.log(
                  currentField.from_location,
                  "this.state.from_location: *** ",
                  this.state.from_location
                );
                console.log(
                  currentField.to_location,
                  "this.state.to_location: *** ",
                  this.state.to_location
                );

                this.setState({
                  from_location: this.state.to_location,
                  to_location: this.state.from_location,
                });
              }}
            >
              <SwapRightOutlined />
              <SwapLeftOutlined
                onClick={() => {
                  console.log("Hello >>");
                }}
              />
            </div>
            <Form.Item
              noStyle
              name="to_location"
              className="filter-left-input2"
            >
              <AutoComplete
                allowClear
                defaultActiveFirstOption={false}
                style={{ minWidth: 200 }}
                className="dark-bdr-right"
                onSearch={(v) => this.handleAutoCompleteSearch(v, 2)}
                placeholder={"To"}
                optionLabelProp="title"
              >
                {this.renderOptions(2)}
              </AutoComplete>
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
          {/* {this.renderDatePicker(currentField, column,activeKey)} */}
          {activeKey === "1"
            ? this.renderRangePicker(currentField)
            : this.renderDepartTime(currentField)}
          <Col md={8} className="mrg-top-space person-status">
            <div
              className={
                currentField && currentField["adult"] ? "floating-label" : ""
              }
            >
              {this.renderPassengerDrodown()}
            </div>
          </Col>
          <Col md={8} className="mrg-top-space">
            <div
              className={
                currentField && currentField["class"] ? "floating-label" : ""
              }
            >
              {this.renderClass()}
            </div>
          </Col>
        </Row>
      </>
    );
  };

  /**
   * @method renderMultiCityFilters
   * @description render multicity filters
   */
  renderMultiCityFilters = () => {
    const { flightArray, activeKey } = this.state;
    console.log("🚀 ~ file: FilightSearchFilter.js ~ line 916 ~ FlightSearch ~ flightArray", flightArray)
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    return (
      <div className="multy-city-filter-box">
        <Form.List name="flights">
          {(fields, { add, remove }) =>
            activeKey === "3" && (
              <div>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item style={{ width: "calc(100% - 0px)" }}>
                      <Input.Group compact className="venus-form">
                        <Form.Item
                          {...restField}
                          noStyle
                          name={[name, "from_location"]}
                          fieldKey={[fieldKey, "from_location"]}
                          className="filter-left-input"
                        >
                          <MulticityAutoComplete
                            className=""
                            handleSearchSelect={(option) => {
                              let currentField =
                                this.formRef.current &&
                                this.formRef.current.getFieldsValue();
                              currentField.flights[key].from_location = option;
                              this.setState({ from_location: option });
                              this.formRef.current &&
                                this.formRef.current.setFieldsValue({
                                  ...currentField,
                                });
                            }}
                            handleValueChange={(value) => {}}
                            placeHolder="From"
                            defaultValue={
                              flightArray.length !== 0 &&
                              flightArray[key] &&
                              flightArray[key].from_location
                                ? flightArray[key].from_location
                                : ""
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          noStyle
                          name={[name, "to_location"]}
                          fieldKey={[fieldKey, "to_location"]}
                        >
                          <MulticityAutoComplete
                            className="suraj"
                            handleSearchSelect={(option) => {
                              this.setState({ to_location: option });
                              let currentField =
                                this.formRef.current &&
                                this.formRef.current.getFieldsValue();
                              currentField.flights[key].to_location = option;
                              this.formRef.current &&
                                this.formRef.current.setFieldsValue({
                                  ...currentField,
                                });
                            }}
                            handleValueChange={(value) => {}}
                            placeHolder="To Where ?"
                            defaultValue={
                              flightArray.length !== 0 &&
                              flightArray[key] &&
                              flightArray[key].to_location
                                ? flightArray[key].to_location
                                : ""
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          noStyle
                          name={[name, "depart"]}
                          fieldKey={[fieldKey, "depart"]}
                        >
                          <DatePicker
                            format={dateFormat}
                            placeholder="Depart"
                            onChange={this.setFloating}
                            disabledDate={(current) => {
                              var dateObj = new Date();
                              dateObj.setDate(dateObj.getDate() - 1);
                              return current && current.valueOf() < dateObj;
                            }}
                          />
                        </Form.Item>
                        {key !== 0 && key !== 1 && (
                          <PlusOutlined onClick={() => remove(name)} />
                          // <MinusCircleOutlined />
                        )}
                      </Input.Group>
                    </Form.Item>
                  </div>
                ))}
                {fields && fields.length < 4 && (
                  <Form.Item>
                    <div className="add-another-flight" onClick={() => add()}>
                      {/* <PlusCircleOutlined /> */}
                      {/* plus-white-icon.svg */}
                      <img
                        src={require("../../../../assets/images/icons/plus-white-icon.svg")}
                        alt="plus-white-icon"
                      />
                      <span className="form-sub-heading">
                        Add another flight
                      </span>
                    </div>
                  </Form.Item>
                )}
              </div>
            )
          }
        </Form.List>

        {activeKey === "3" && (
          <Row gutter={[10, 0]} className="location-more-form">
            <Col md={8} className="mrg-top-space pl-0">
              <div
                className={
                  currentField && currentField["adult"] ? "floating-label" : ""
                }
              >
                {this.renderPassengerDrodown()}
              </div>
            </Col>
            <Col md={8} className="mrg-top-space">
              <div
                className={
                  currentField && currentField["class"] ? "floating-label" : ""
                }
              >
                {this.renderClass()}
              </div>
            </Col>
            <Col lg={8} className="search-btn">
              <Button htmlType="submit" type="primary" shape={"circle"}>
                <Icon icon="search" size="20" />
              </Button>
            </Col>
          </Row>
        )}

        {/* {activeKey === "3" && (
          <Form.Item className="search-btn">
            <Space>
              <Button htmlType="submit" type="primary" shape={"circle"}>
                <Icon icon="search" size="20" />
              </Button>
            </Space>
          </Form.Item>
        )} */}
      </div>
    );
  };

  /**
   * @method getInitialValue
   * @description get initial values
   */
  getInitialValue = () => {
    const { activeKey, flightArray } = this.state;
    // let params = this.props.search_params;

    // if (params) {
    //   this.formRef.current &&
    //     this.formRef.current.setFieldsValue({
    //       from_location: this.state.from_location ? this.setDefaultValue(this.state.from_location) : '',
    //       to_location: this.state.to_location ? this.setDefaultValue(this.state.to_location) : ''
    //     });
    // }
    return {
      name: "flights",
      flights: flightArray.length
        ? flightArray
        : [
            { from_location: "", to_location: "", depart: "" },
            { from_location: "", to_location: "", depart: "" },
          ],
    };
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const { activeKey, flightArray } = this.state;
    console.log("flightArray", flightArray);
    return (
      <div
        className={`location-search-wrap booking-location-search-wrap event-list-search booking-turism-filter`}
      >
        <Tabs
          defaultActiveKey="1"
          centered
          onChange={(e) => {
            this.setState({ activeKey: e });
            this.props.handleFilterChange(
              e === "3" ? "multi-city" : e === "2" ? "one-way" : "return"
            );
            this.resetSearch();
          }}
          activeKey={activeKey}
        >
          <TabPane tab="Return" key="1"></TabPane>
          <TabPane tab="One-way" key="2"></TabPane>
          <TabPane tab="Multi City" key="3"></TabPane>
        </Tabs>
        <Form
          ref={this.formRef}
          name="location-form"
          className="location-search"
          layout={"inline"}
          onFinish={this.handleSearch}
          initialValues={this.getInitialValue()}
          // {{
          //   name: "flights",
          //   flights: flightArray.length
          //     ? flightArray
          //     : [{ from_location: "", to_location: "", depart: "" }, { from_location: "", to_location: "", depart: "" }],
          // }}
        >
          {activeKey !== "3" && this.renderOnWayReturnFilter()}
          {this.renderMultiCityFilters()}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { multi_city_Initial, flight_search_params } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    multi_city_Initial,
    search_params: flight_search_params,
  };
};

export default FlightSearch = connect(mapStateToProps, {
  setTourismFlightSearchData,
  multiCityInitialValues,
  enableLoading,
  disableLoading,
  getFlightSearchRecords,
  storeSearchDataAPI,
  getFlightAutocompleteList,
})(withRouter(FlightSearch));
