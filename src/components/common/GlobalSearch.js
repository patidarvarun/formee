import React from "react";
import { connect } from "react-redux";
import { toastr } from 'react-redux-toastr'
import { Form, Input, Select, Button, Space } from "antd";
import Icon from "../customIcons/customIcons";
import { globalSearch, enableLoading, disableLoading } from "../../actions/index";
import PlacesAutocomplete from "./LocationInput";
import AutoComplete from "../forminput/AutoComplete";
import { DISTANCE_OPTION } from "../../config/Constant";
import { langs } from '../../config/localization';
const { Option } = Select;

class GlobalSearch extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      filteredData: [],
      distanceOptions: DISTANCE_OPTION,
      isSearchResult: false,
      selectedOption: {},
      selectedDistance:'0 KM',
      address: ''
    };
  }

  /**
   * @method resetSearch
   * @description Use to reset Search bar
   */
   resetSearch = () => {
    this.setState({isSearchResult: false, searchKey: ""});
    this.formRef.current.resetFields();
    this.props.handleSearchResponce("", true, {});
  };

  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = () => {
    const { loggedInDetail,isLoggedIn } = this.props
    const {searchItem,selectedDistance, address } = this.state;
    if(searchItem || selectedDistance || address){
      const reqData = {
        name: searchItem,
        user_id: isLoggedIn ? loggedInDetail.id : '',
        location: address,
        distance: selectedDistance
      }
      this.props.enableLoading();
      this.props.globalSearch(reqData, (res) => {
        this.props.disableLoading();
        if (res.data && Array.isArray(res.data.data)) {
          this.props.handleSearchResponce(res.data.data, false, reqData);
        } else {
          this.props.handleSearchResponce([], false, reqData);
        }
      });
    }else {
      toastr.warning(langs.warning, langs.messages.mandate_filter);
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
      let city = "";
      result.address_components.map((el) => {
        if (el.types[0] === "administrative_area_level_2") {
          city = el.long_name;
        }
      });
      this.setState({ homelocation: latLng, selectedCity: city, address:address  });
    };

  render() {
    const { selectedDistance } = this.state
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
                  onChange={(e) => {
                    this.setState({ selectedDistance: e });
                  }}
                  defaultValue={selectedDistance}
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

const mapStateToProps = (store) => {
  const { auth, classifieds } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};

export default connect(
  mapStateToProps, { enableLoading, disableLoading, globalSearch}
)(GlobalSearch);
