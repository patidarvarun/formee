import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import {
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Tabs,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Breadcrumb,
  Pagination,
  Space,
  Carousel,
} from "antd";
import Icon from "../customIcons/customIcons";
import {
  classifiedGeneralSearch,
  applyClassifiedFilterAttributes,
  getChildCategory,
  getClassifiedDynamicInput,
  enableLoading,
  disableLoading,
} from "../../actions/index";
import { getFilterRoute } from "../../common/getRoutes";
import PlacesAutocomplete from "./LocationInput";
import AutoComplete from "../forminput/AutoComplete";
import { PRIZE_OPTIONS } from "../../config/Constant";
// const publicIp = require('public-ip');
// let ipAddress = '';
// (async () => {
//     
//     ipAddress = await publicIp.v4()
// })();
const { Option } = Select;
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const customCarouselSettings = {
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  swipeToSlide: true,
  focusOnSelect: true,
  dots: false,
  arrows: true,
  infinite: false,
};

class GeneralClassifiedGeneral extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      selectedDistance: 0,
      searchKey: "",
      isSearch: false,
      filteredData: [],
      distanceOptions: [0, 5, 10, 15, 20],
      isSearchResult: false,
      searchLatLng: "",
      selectedCity: "",
      selectedOption: {},
      attribute: [],
      selectedFilter: 0,
      prizeOptions: PRIZE_OPTIONS,
      selectedMinPrice: "",
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let parameter = this.props.match.params;
    let subCatIdInitial = parameter.subCategoryId;
    let subCatIdNext = nextprops.match.params.subCategoryId;
    if (
      parameter.all !== langs.key.all &&
      nextprops.match.params.all === langs.key.all
    ) {
      this.formRef.current.resetFields();
      this.getAllAttributes();
    } else if (subCatIdInitial !== subCatIdNext) {
      this.formRef.current.resetFields();
      let subCategoryId = parameter.subCategoryId;
      this.props.enableLoading();
      this.props.getClassifiedDynamicInput(
        { categoryid: subCatIdNext },
        (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            const atr = Array.isArray(res.data.attributes)
              ? res.data.attributes
              : [];
            this.setState({ attribute: atr });
          }
        }
      );
    }
  }
  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    if (parameter.all === langs.key.all) {
      this.getAllAttributes();
    } else {
      let subCategoryId = parameter.subCategoryId;
      this.props.enableLoading();
      this.props.getClassifiedDynamicInput(
        { categoryid: subCategoryId },
        (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            const atr = Array.isArray(res.data.attributes)
              ? res.data.attributes
              : [];
            this.setState({ attribute: atr });
          }
        }
      );
    }
  }

  getAllAttributes = () => {
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    this.props.enableLoading();
    this.props.getChildCategory({ pid: categoryId }, (res1) => {
      this.props.disableLoading();
      if (res1.status === 200) {
        const data =
          Array.isArray(res1.data.newinsertcategories) &&
          res1.data.newinsertcategories;
        let classifiedId = data && data.length && data.map((el) => el.id);
        if (classifiedId && classifiedId.length) {
          let id = classifiedId.join(",");
          // this.getClassifiedListing(id)
          this.props.getClassifiedDynamicInput({ categoryid: id }, (res) => {
            if (res.status === 200) {
              const atr = Array.isArray(res.data.attributes)
                ? res.data.attributes
                : [];
              this.setState({ attribute: atr });
            }
          });
        }
      }
    });
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
    this.setState({ searchLatLng: latLng, selectedCity: city });
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
    });
    this.formRef.current.resetFields();
    this.props.handleSearchResponce("", true, {});
  };

  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = (value) => {
    const { selectedCity, searchLatLng, selectedOption } = this.state;
    let isEmpty = Object.keys(selectedOption).length === 0;
    if (isEmpty) {
      toastr.warning(langs.warning, langs.messages.mandate_filter);
    } else {
      //if (searchLatLng || selectedDistance)
      let reqData = {
        name: selectedOption.title,
        cat_id: selectedOption.catid,
        location: searchLatLng,
        price_min: value.price_min == undefined ? "" : value.price_min,
        price_max: value.price_max == undefined ? "" : value.price_max,
        userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : "",
      };

      this.props.enableLoading();
      this.props.classifiedGeneralSearch(reqData, (res) => {
        this.props.disableLoading();
        if (Array.isArray(res.data)) {
          this.props.handleSearchResponce(res.data, false, reqData);
          // let reqData2 = {
          //     module_type: 2,
          //     category_id: selectedOption.catid,
          //     keyword: selectedOption.title,
          //     // ip_address: ipAddress,
          //     location: selectedCity,
          //     // distance: selectedDistance ? selectedDistance : '',
          //     latitude: searchLatLng ? searchLatLng.lat : '',
          //     longitude: searchLatLng ? searchLatLng.lng : '',
          // }
          // 
          // this.props.addCallForPopularSearch((reqData2), (res) => {
          //     
          // })
        } else {
          this.props.handleSearchResponce([], false, {});
        }
      });
    }
  };

  applyFilter = (value, selected) => {
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    let categoryName = parameter.categoryName;
    let subCategoryId = parameter.subCategoryId;
    let subCategoryName = parameter.subCategoryName;
    let allData = parameter.all === langs.key.all ? true : false;
    let temp = {};
    temp[value.att_id] = {
      name: value.att_name,
      attr_type_id: value.attr_type,
      attr_value: selected.id,
      parent_value_id: 0,
      parent_attribute_id: value.att_id,
      attr_type_name: value.attr_type_name,
    };
    let reqData = {
      user_id: this.props.isLoggedIn ? this.props.loggedInDetail.id : 0,
      userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : 0,
      category_id: categoryId,
      inv_attributes: temp,
    };
    this.props.enableLoading();
    this.props.applyClassifiedFilterAttributes(reqData, (res) => {

      this.props.disableLoading();
      if (res.status === 1) {
        this.props.handleSearchResponce(res.data, reqData);
      }
    });
  };

  /**
   * @method renderBosyTypeSearch
   * @description renderBosyTypeSearch component
   */
  renderBodyTypeSearch() {
    const { attribute, selectedFilter } = this.state;




    if (selectedFilter === 0) {
      if (Array.isArray(attribute) && attribute.length) {
        //555
        let index1 = attribute.findIndex((el) => el.att_name === "Body Type");
        if (
          index1 >= 0 &&
          Array.isArray(attribute[index1].value) &&
          attribute[index1].value.length
        ) {
          return attribute[index1].value.map((att) => {
            return (
              <div
                className="cursor-pointer"
                onClick={() => this.applyFilter(attribute[index1], att)}
              >
                <div className="img-box">
                  <img
                    src={
                      att.image
                        ? att.image
                        : require("../../assets/images/sedan.png")
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = require("../../assets/images/sedan.png");
                    }}
                    alt=""
                  />
                </div>
                <Paragraph className="pt-15 mb-0 text-gray">
                  {att.name}
                </Paragraph>
              </div>
            );
          });
        } else {
          return (
            <Paragraph className="mb-0 text-gray">No Result Found</Paragraph>
          );
        }
      }
    } else {
      if (Array.isArray(attribute) && attribute.length) {
        //464

        let index1 = attribute.findIndex((el) => el.att_name === "Make");
        if (
          index1 >= 0 &&
          Array.isArray(attribute[index1].value) &&
          attribute[index1].value.length
        ) {
          return attribute[index1].value.map((att) => {
            return (
              <div
                className="cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => this.applyFilter(attribute[index1], att)}
              >
                {/* <img src={require('../../assets/images/sedan.png')} alt='' /> */}
                <img
                  src={
                    att.image
                      ? att.image
                      : require("../../assets/images/sedan.png")
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = require("../../assets/images/sedan.png");
                  }}
                  alt=""
                />
                <Paragraph className="pt-15 mb-0 text-gray">
                  {att.name}
                </Paragraph>
              </div>
            );
          });
        } else {
          return (
            <Paragraph className="mb-0 text-gray">No Result Found</Paragraph>
          );
        }
      }
    }
  }

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

  /**
   * @method renderSearchOptions
   * @description renderSearchOptions component
   */
  renderSearchOptions = () => {
    let parameter = this.props.match.params;
    let allData = parameter.all === langs.key.all ? true : false;
    let redirectUrl = getFilterRoute(
      parameter.categoryName,
      parameter.categoryId,
      parameter.subCategoryName,
      parameter.subCategoryId,
      allData
    );
    const { selectedMinPrice } = this.state;


    return (
      <Form
        name="location-form"
        className="location-search-inner"
        layout={"vertical"}
        ref={this.formRef}
        onFinish={this.handleSearch}
      >
        <Form.Item name="location">
          {/* <Input placeholder='Enter Location' /> */}
          <PlacesAutocomplete
            name="address"
            handleAddress={this.handleAddress}
            addressValue={this.state.address}
          />
        </Form.Item>
        <Form.Item name="name">
          {/* <Input placeholder='Key Word' /> */}
          <AutoComplete
            handleSearchSelect={(option) => {
              this.setState({ selectedOption: option });
            }}
            handleValueChange={(value) => {
              this.setState({ searchItem: value });
            }} 
          />
        </Form.Item>
        <Form.Item>
          <Input.Group compact>
            <Form.Item name="price_min" noStyle>
              <Select
                onChange={(el) => {

                  this.setState({ selectedMinPrice: el });
                  this.formRef.current.setFieldsValue({
                    price_max: "",
                  });
                }}
                style={{ width: "50%" }}
                placeholder="Price Min."
              >
                {this.renderPrizeOptions("price_min")}
              </Select>
              {/* <Input placeholder='min prize' style={{ width: '50%' }} /> */}
            </Form.Item>
            <Form.Item name={["address", "province"]} noStyle name="price_max">
              <Select style={{ width: "50%" }} placeholder="Price Max.">
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
          </Input.Group>
        </Form.Item>
        <Form.Item>
          <Row align="middle">
            <Col span={12}>
              <Link to={redirectUrl} className="blue-link">
                {"More option"}
              </Link>
            </Col>
            <Col span={12} className="align-right">
              <Button type="default" htmlType="submit">
                {"Search"}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      attribute,
      selectedFilter,
      topImages,
      bottomImages,
      catName,
      mostRecentList,
      classifiedList,
      isSearchResult,
      topRatedList,
      selectedDistance,
    } = this.state;

    let parameter = this.props.match.params;
    let allData = parameter.all === langs.key.all ? true : false;
    let redirectUrl = getFilterRoute(
      parameter.categoryName,
      parameter.categoryId,
      parameter.subCategoryName,
      parameter.subCategoryId,
      allData
    );

    return (
      <Fragment>
        <div className="location-search-wrap11">
          <Tabs className="banner-tab">
            <TabPane tab="All" key="1">
              {this.renderSearchOptions()}
            </TabPane>
            <TabPane tab="New" key="2">
              {this.renderSearchOptions()}
            </TabPane>
            <TabPane tab="Used" key="3">
              {this.renderSearchOptions()}
            </TabPane>
          </Tabs>
        </div>
        <div className="searchby-box">
          <div className="wrap-inner">
            <div className="mb-25 align-center clearfix">
              <Space>
                <Text className="fs-25">Search By</Text>
                <Button
                  type={selectedFilter === 0 ? "primary" : "default"}
                  onClick={() => {
                    this.setState({ selectedFilter: 0 });
                  }}
                >
                  {"Body Type"}
                </Button>
                <Button
                  type={selectedFilter === 1 ? "primary" : "default"}
                  onClick={() => {
                    this.setState({ selectedFilter: 1 });
                  }}
                >
                  {"Brand"}
                </Button>
              </Space>
              <Link to={redirectUrl} className="blue-link pull-right mt-6">
                View All
              </Link>
            </div>
            <Row gutter={[20, 0]} className="align-center car-filter">
              <Col span={24}>
                <Carousel
                  {...customCarouselSettings}
                  className={"custom-carousel"}
                >
                  {this.renderBodyTypeSearch()}
                  {/* : this.renderBrandSearch()} */}
                </Carousel>
              </Col>
            </Row>
          </div>
        </div>
      </Fragment>
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
  applyClassifiedFilterAttributes,
  getClassifiedDynamicInput,
  getChildCategory,
  enableLoading,
  disableLoading,
})(withRouter(GeneralClassifiedGeneral));
