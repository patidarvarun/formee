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
// const publicIp = require('public-ip');
// let ipAddress = '';
// (async () => {
//     
//     
//     ipAddress = await publicIp.v4(
//         {
//             fallbackUrls: [
//                 'https://ifconfig.co/ip'
//             ],
//             onlyHttps: false
//         }
//     )
// })();

const { Option } = Select;

class GeneralClassifiedSearchFoodStatic extends React.Component {
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
                <Input style={{ width: '50%' }} placeholder='Product Name' />
                {/* <AutoComplete
                  className="suraj"
                  handleSearchSelect={(option) => {
                    this.setState({ selectedOption: option });
                  }}
                /> */}

              </Form.Item>
              <Form.Item name={"location"} noStyle>
                {/* <PlacesAutocomplete
                  name="address"
                  handleAddress={this.handleAddress}
                  addressValue={this.state.address}
                /> */}
                <Input style={{ width: '50%',  }} placeholder='Barcode Number' />
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
          <div className='location-more-option'>
            <a className="active">More Options</a>
          </div>
        </Form>
      </div>
    );
  }
}

export default GeneralClassifiedSearchFoodStatic;
