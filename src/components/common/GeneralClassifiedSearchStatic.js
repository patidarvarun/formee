import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import { Form, Input, Select, Button, Row, Col, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Icon from "../customIcons/customIcons";
import { getFilterRoute } from "../../common/getRoutes";
import {
  classifiedGeneralSearch,
  addCallForPopularSearch,
  enableLoading,
  disableLoading,
} from "../../actions/index";
import PlacesAutocomplete from "./LocationInput";
import AutoComplete from "../forminput/AutoComplete";
import { DISTANCE_OPTION } from "../../config/Constant";
import { getIpfromLocalStorage } from "../../common/Methods";
let ipAddress = getIpfromLocalStorage();


const { Option } = Select;

class GeneralClassifiedSearchStatic extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      selectedDistance: 0,
      searchKey: "",
      isSearch: false,
      filteredData: [],
      distanceOptions: DISTANCE_OPTION,
      isSearchResult: false,
      searchLatLng: "",
      selectedOption: {},
      selectedCity: "",
    };
  }

  /**
   * @method renderDistanceOptions
   * @description render subcategory
   */
  renderDistanceOptions = () => {
    return this.state.distanceOptions.map((el, i) => {
      return (
        <Option key={i} value={el}>
          {el} KM
        </Option>
      );
    });
  };

  render() {
    return (
      <div className="location-search-wrap real-state">
        <Form
          ref={this.formRef}
          name="location-form"
          className="location-search"
          layout={"inline"}
        >
          <Form.Item style={{ width: "calc(100% - 150px)" }}>
            <Input.Group compact>
              <Form.Item noStyle name="name">
                <AutoComplete
                  className="suraj"
                  handleSearchSelect={(option) => {
                    this.setState({ selectedOption: option });
                  }}
                  handleValueChange={(value) => {
                    this.setState({ searchItem: value });
                  }} 
                />
              </Form.Item>
              <Form.Item name={"location"} noStyle>
                <PlacesAutocomplete
                  name="address"
                  handleAddress={this.handleAddress}
                  addressValue={this.state.address}
                />
              </Form.Item>
              <Form.Item name={"distance"} noStyle>
                <Select
                  style={{ width: "18%", maxWidth: "150px", borderLeft:"1px solid #AAB1B6" }}
                  placeholder="0 km"
                >
                  {this.renderDistanceOptions()}
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                onClick={this.handleSearch}
                type="primary"
                shape={"circle"}
              >
                <Icon icon="search" size="20" />
              </Button>

            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default GeneralClassifiedSearchStatic;
