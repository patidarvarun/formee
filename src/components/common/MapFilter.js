import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  getClassfiedCategoryListing,
  classifiedGeneralSearch,
  enableLoading,
  disableLoading,
  openLoginModel,
  getChildCategory,
  applyClassifiedFilterAttributes,
} from "../../actions";
import { Typography, Form, Input, Select, Button } from "antd";
import { Link } from "react-router-dom";
import { langs } from "../../config/localization";
import Icon from "../../components/customIcons/customIcons";
import AppSidebar from "../sidebar";
import Map from "./Map";
import "./mapView.less";
import SubDetailCard from "./SubDetailCard";
import history from "../../common/History";
import { toastr } from "react-redux-toastr";
import {
  getClassifiedSubcategoryRoute,
  getFilterRoute,
} from "../../common/getRoutes";
import PlacesAutocomplete from "../common/LocationInput";
import { withRouter } from "react-router";
import AutoComplete from "../forminput/AutoComplete";
import { PRIZE_OPTIONS, DISTANCE_OPTION } from "../../config/Constant";

const { Text } = Typography;
const { Option } = Select;

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
      distanceOptions: DISTANCE_OPTION,
      prizeOptions: PRIZE_OPTIONS,
      isSearchResult: false,
      searchLatLng: "",
      selectedOption: "",
    };
  }
  /**
   * @method toggleFilter
   * @description toggle the filter
   */
  toggleFilter() {
    this.setState({
      // isFilter: false,
      // isProCard: false,
      isFilter: true,
    });
  }

  /**
   * @method toggleProCard
   * @description toggeled the pro card
   */
  toggleProCard() {
    this.setState({
      // isFilter: true,
      // isProCard: true,
      isFilter: false,
    });
  }
  applyFilter = (value) => {
    
    const { selectedOption } = this.state;
    let isEmpty = Object.keys(selectedOption).length === 0;
    if (isEmpty) {
      toastr.warning(langs.warning, langs.messages.mandate_filter);
    } else {
      let reqData = {
        cat_id: selectedOption.catid,
        distance: value.distance == undefined ? "" : value.distance,
        price_min: value.price_min == undefined ? "" : value.price_min,
        price_max: value.price_max == undefined ? "" : value.price_max,
        sortBy: value.sortBy == undefined ? "" : value.sortBy,
        name: selectedOption.title,
        userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : "",
      };
      
      // this.props.applyClassifiedFilterAttributes(reqData, res => {
      this.props.enableLoading();
      this.props.classifiedGeneralSearch(reqData, (res) => {
        this.props.disableLoading();
        
        if (res.status === 1) {
          this.props.handleFilters(res.data);
          this.setState({ classifiedList: res.data, isFilter: false });
        } else {
          this.props.handleFilters([]);
        }
      });
    }
  };

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

  /**
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field
   */
  handleAddress = (result, address, latLng) => {
    let state = "";
    let city = "";
    let p_code = "";
    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_1") {
        state = el.long_name;
      } else if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
      } else if (el.types[0] === "postal_code") {
        p_code = el.long_name;
        // this.formRef.current.setFieldsValue({
        //     postal_code: el.long_name
        // });
      }
    });

    this.setState({
      address: {
        full_add: address,
        latLng,
        state,
        city,
        p_code,
      },
    });
  };

  /**
   * @method renderPrizeOptions
   * @description renderPrizeOptions component
   */
  renderPrizeOptions = () => {
    return this.state.prizeOptions.map((el, i) => {
      return (
        <Option key={i} value={el.value}>
          AU${el.label}
        </Option>
      );
    });
  };

  // /**
  //  * @method getInitialValue
  //  * @description returns Initial Value to set on its Fields
  //  */
  // getInitialValue = () => {
  //     return { name: this.state.selectedOption.title };
  // }

  render() {
    const { selectedOption, selectedDistance, isProCard } = this.state;
    let parameter = this.props.match.params;
    let allData = parameter.all === langs.key.all ? true : false;
    let redirectUrl = getFilterRoute(
      parameter.categoryName,
      parameter.categoryId,
      parameter.subCategoryName,
      parameter.subCategoryId,
      allData
    );
    //let redirectUrl = `/classifieds/filter/${parameter.categoryName}/${parameter.categoryId}/${parameter.subCategoryName}/${parameter.subCategoryId}`

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
        <Form.Item label="Keyword" name="name" ref={this.formRef}>
          <AutoComplete
            defaultOption={selectedOption.title}
            handleSearchSelect={(option) => {
              this.setState({ selectedOption: option });
            }}
            handleValueChange={(value) => {
              this.setState({ searchItem: value });
            }} 
          />
        </Form.Item>
        <Form.Item label="Location">
          <Input.Group compact>
            <Form.Item name="address" noStyle>
              <div
                style={{ width: "calc(100% - 81px)" }}
                className="map-location"
              >
                <PlacesAutocomplete
                  name="address"
                  handleAddress={this.handleAddress}
                />
              </div>
            </Form.Item>
            <Form.Item noStyle name="distance">
              <Select
                onChange={(e) => {
                  this.setState({ selectedDistance: e });
                }}
                defaultValue={selectedDistance}
                className={"distance-selectbox"}
                style={{ width: "36%", maxWidth: "150px" }}
                placeholder="0 KM"
              >
                {this.renderDistanceOptions()}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item name="price_min" label="Price">
          <Select
            onChange={(el) => {
              this.setState({ selectedMinPrice: el });
              this.formRef.current &&
                this.formRef.current.setFieldsValue({
                  price_max: "",
                });
            }}
            placeholder="Price Min."
          >
            {this.renderPrizeOptions()}
          </Select>
        </Form.Item>
        <Form.Item name="price_max">
          <Select placeholder="Price Max.">
            {this.state.prizeOptions.map((el, i) => {
              let disable = false;
              if (
                this.state.selectedMinPrice &&
                this.state.selectedMinPrice > el.value
              ) {
                disable = true;
              }
              return (
                <Option disabled={disable} key={i} value={el.value}>
                  AU${el.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="listedDate" label="Listed date">
          <Input placeholder="Listed date" />
        </Form.Item>
        <Form.Item>
          <Link to={redirectUrl} className="blue-link">
            {"More Option"}
          </Link>
        </Form.Item>
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
  const { auth, common } = store;
  const { savedCategories, categoryData } = common;
  let classifiedList = [];
  let isEmpty =
    savedCategories.data.booking.length === 0 &&
    savedCategories.data.retail.length === 0 &&
    savedCategories.data.classified.length === 0 &&
    (savedCategories.data.foodScanner === "" ||
      (Array.isArray(savedCategories.data.foodScanner) &&
        savedCategories.data.foodScanner.length === 0));
  if (auth.isLoggedIn) {
    if (!isEmpty) {
      isEmpty = false;
      classifiedList = savedCategories.data.classified;
    } else {
      isEmpty = true;
      classifiedList =
        categoryData &&
          Array.isArray(categoryData.classified.newinsertcategories)
          ? categoryData.classified.newinsertcategories
          : [];
    }
  } else {
    isEmpty = true;
    classifiedList =
      categoryData && Array.isArray(categoryData.classified.newinsertcategories)
        ? categoryData.classified.newinsertcategories
        : [];
  }

  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    iconUrl: common.categoryData.classified.iconurl,
    classifiedList,
    isEmpty,
  };
};
export default connect(mapStateToProps, {
  getClassfiedCategoryListing,
  openLoginModel,
  enableLoading,
  disableLoading,
  classifiedGeneralSearch,
  getChildCategory,
  applyClassifiedFilterAttributes,
})(withRouter(MapFilter));
