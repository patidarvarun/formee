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

class GeneralClassifiedGeneral extends React.Component {
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

  getClassifiedListing = () => {
    this.props.getClassfiedCategoryListing({}, (res) => {
      if (res.status === 200) {
        this.setState({
          classifiedList: res.data.data,
          catName: res.data.data.length ? res.data.data[0].catname : "",
        });
      }
    });
  };

  /**
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field
   */
  handleAddress = (result, address, latLng) => {
    
    let city = "";

    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
      }
    });
    this.setState({ homelocation: latLng, selectedCity: city });
  };

  /**
   * @method resetSearch
   * @description Use to reset Search bar
   */
  resetSearch = () => {
    this.setState({
      isSearchResult: false,
      searchKey: "",
      searchLatLng: "",
      selectedDistance: 0,
      selectedOption: {},
    });
    this.formRef.current.resetFields();
    this.props.handleSearchResponce("", true, {});
    // this.props.history.push(this.props.location.pathname)
  };

  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = (e) => {
    const {
      selectedCity,
      selectedDistance,
      searchLatLng,
      selectedOption,
    } = this.state;
    let isEmpty = Object.keys(selectedOption).length === 0;
    if (isEmpty) {
      toastr.warning(langs.warning, langs.messages.mandate_filter);
    } else {
      let reqData = {
        name: selectedOption.title,
        cat_id: selectedOption.catid,
        location: searchLatLng,
        distance: selectedDistance,
        userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : "",
      };
      this.props.enableLoading();
      this.props.classifiedGeneralSearch(reqData, (res) => {
        
        this.props.disableLoading();
        if (Array.isArray(res.data)) {
          this.props.handleSearchResponce(res.data, false, reqData);
          let reqData2 = {
            module_type: 2,
            category_id: selectedOption.catid,
            keyword: selectedOption.title,
            ip_address: ipAddress,
            location: selectedCity,
            distance: selectedDistance ? selectedDistance : "",
            latitude: searchLatLng ? searchLatLng.lat : "",
            longitude: searchLatLng ? searchLatLng.lng : "",
          };
          
          this.props.addCallForPopularSearch(reqData2, (res) => {
            
          });
        } else {
          this.props.handleSearchResponce([], false, reqData);
        }
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      topImages,
      bottomImages,
      catName,
      mostRecentList,
      classifiedList,
      isSearchResult,
      topRatedList,
      selectedDistance,
    } = this.state;
    const { showMoreOption = false, landingPage } = this.props;
    
    let parameter = this.props.match.params;
    let allData = parameter.all === langs.key.all ? true : false;
    let redirectUrl = getFilterRoute(
      parameter.categoryName,
      parameter.categoryId,
      parameter.subCategoryName,
      parameter.subCategoryId,
      allData
    );
    // let redirectUrl = `/classifieds/filter/${parameter.categoryName}/${parameter.categoryId}/${parameter.subCategoryName}/${parameter.subCategoryId}`

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
                {/* <Input style={{ width: '40%' }}
                                    onChange={(e) => this.setState({ searchKey: e.target.value })}
                                    style={{ width: '40%' }} placeholder='I’m looking for...' /> */}
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
                  onChange={(e) => {
                    this.setState({ selectedDistance: e });
                  }}
                  defaultValue={selectedDistance}
                  style={{ width: "18%", maxWidth: "150px" }}
                  placeholder="0 KM"
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
              {/* <Button
                onClick={this.resetSearch}
                type="danger"
                shape={"circle"}
                title={"Reset Search"}
              >
                <SyncOutlined className="fs-22" />
              </Button> */}
            </Space>
          </Form.Item>
          {showMoreOption === true && (
            <Form.Item className="classifies-moreoptn" >
              <Row>
                <Col span={24} className="align-right">
                  <Link to={redirectUrl} className="blue-link">
                    {"More option"}
                  </Link>
                </Col>
              </Row>
            </Form.Item>
          )}
          {landingPage && <Form.Item className="classifies-moreoptn">
            <Row>
              <Col span={24} className="align-right">
                <Link to={''} className="blue-link">
                  {"More Options"}
                </Link>
              </Col>
            </Row>
          </Form.Item>}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, classifieds } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedClassifiedList: classifieds.classifiedsList,
  };
};

export default GeneralClassifiedGeneral = connect(mapStateToProps, {
  classifiedGeneralSearch,
  addCallForPopularSearch,
  enableLoading,
  disableLoading,
})(withRouter(GeneralClassifiedGeneral));
