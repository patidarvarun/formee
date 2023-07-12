import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import { Checkbox, Form, Input, Select, Button, Row, Col, Space } from "antd";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import Icon from "../customIcons/customIcons";
import {
  getAllRetailSearchByName,
  addCallForPopularSearch,
  enableLoading,
  disableLoading,
  classifiedGeneralSearch,
  getRetailDynamicAttribute,
  getAllBrandsAPI,
  applyRetailFilter,
} from "../../actions/index";
import AutoComplete from "./AutoComplete";
import { DISTANCE_OPTION, PRIZE_OPTIONS } from "../../config/Constant";
import { getIpfromLocalStorage } from "../../common/Methods";
import "./retailSearch.less";
import { renderField } from "../forminput";
// import WidgetTree from './TreeSelect'
let ipAddress = getIpfromLocalStorage();
const { Option, OptGroup } = Select;

class GeneralRetailSearch extends React.Component {
  formRef = React.createRef();
  multiselectRef = React.createRef();
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
      condition: "",
      searchItem: "",
      address: "",
      isMoreOption: false,
      prizeOptions: PRIZE_OPTIONS,
      brandList: [],
      inv_attributes: [],
      allCategories: [],
      allSelected: [],
      parent_id: [],
    };
  }

  /**
   * @method componentWillMount
   * @description mount before render the component
   */
  componentWillMount() {
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    let subCategoryId = parameter.subCategoryId;
    const { subcategoryPage, listingPage, landingPage } = this.props;
    if (listingPage || subcategoryPage) {
      let allCategories = this.getCategories();
      if (subCategoryId === undefined) {
        this.getInvAttributes(categoryId);
        this.setState({ catId: categoryId, allCategories: allCategories });
      } else {
        this.getInvAttributes(subCategoryId);
        this.getBrandsList(subCategoryId);
        this.setState({ catId: subCategoryId, allCategories: allCategories });
      }
    }
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    const { subcategoryPage, listingPage, landingPage } = this.props;
    if (listingPage || subcategoryPage) {
      let parameter = this.props.match.params;
      let catId = parameter.categoryId;
      let catIdNext = nextprops.match.params.categoryId;
      let subCatIdInitial = parameter.subCategoryId;
      let subCatIdNext = nextprops.match.params.subCategoryId;
      let allCategories = this.getCategories();
      if (subCatIdNext === undefined) {
        this.getInvAttributes(catIdNext);
        // this.formRef.current && this.formRef.current.resetFields();
        this.setState({ catId: catIdNext, allCategories: allCategories });
      } else if (subCatIdNext !== subCatIdInitial) {
        this.getInvAttributes(subCatIdNext);
        this.formRef.current && this.formRef.current.resetFields();
        this.setState({ catId: subCatIdNext, allCategories: allCategories });
      }
    }
  }

  getCategories = () => {
    const { sub_category } = this.props;
    let selectOptions = [];
    sub_category.map((el) => {
      // let parentCat = {
      //   label: el.text,
      //   value: el.id,
      //   pid: 0,
      //   className: 'hideMe',
      //   expanded: true,
      //   tagLabel:1,
      //   disabled: true
      // };
      // let childCat = el.category_childs.map((c) => {
      //   return {
      //     label: c.text,
      //     value: c.id,
      //     pid: c.pid,
      //   };
      // });
      // let expandIndex = childCat.findIndex((i) => i.checked === true);
      // // parentCat.expanded = expandIndex >= 0 ? true : false;
      // parentCat.children = childCat;
      // selectOptions.push(parentCat);
      let all = {
        text: "all",
        value: el.text,
        id: el.id,
      };
      let temp = [all, ...el.category_childs];
      temp.map((c) => {
        selectOptions.push({
          label: c.text,
          value: el.text,
          id: c.id,
        });
      });
    });
    console.log("selectOptions", selectOptions);

    return selectOptions;
  };

  /**
   * @method getInvAttributes
   * @description get inv attributes
   */
  getInvAttributes = (catId) => {
    this.props.getRetailDynamicAttribute(
      { categoryid: catId, filter: 1, category_level: 3 },
      (res) => {
        if (res.status === 200) {
          const atr = Array.isArray(res.data.attributes)
            ? res.data.attributes
            : [];
          let group_attribute =
            res.data.inv_attribute_group &&
            Array.isArray(res.data.inv_attribute_group) &&
            res.data.inv_attribute_group.length
              ? res.data.inv_attribute_group[0]
              : [];
          let inv_attributes =
            group_attribute &&
            Array.isArray(group_attribute.inv_attributes) &&
            group_attribute.inv_attributes.length
              ? group_attribute.inv_attributes
              : [];
          let searchableRecord = inv_attributes.filter(
            (el) => el.is_static === 1
          );
          let othersearchableRecord = atr.filter((el) => el.is_static === 1);
          console.log("searchableRecord", searchableRecord);
          this.setState({
            group_attribute: searchableRecord,
            inv_attributes: searchableRecord,
            attribute: othersearchableRecord,
          });
        }
      }
    );
  };

  /**
   * @method getBrandsList
   * @description render dynamic input
   */
  getBrandsList = (id) => {
    let reqData = {
      //category_id: 160,
      category_id: id,
    };
    this.props.getAllBrandsAPI(reqData, (res) => {
      if (res.status === 200) {
        let data = res.data && res.data.data;
        this.setState({ brandList: data });
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
      searchLatLng: latLng,
      selectedCity: city,
    });
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
      allSelected: [],
    });
    this.formRef.current.resetFields();
    this.props.handleSearchResponce("", true, {});
    // this.props.history.push(this.props.location.pathname)
  };

  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = (value) => {
    console.log("value", value);
    const {
      selectedCity,
      selectedDistance,
      searchLatLng,
      selectedOption,
      condition,
      searchItem,
      address,
      catId,
      inv_attributes,
      attribute,
      allSelected,
    } = this.state;
    let temp2 = [];
    const { subcategoryPage, listingPage, landingPage } = this.props;
    let selectedNodes = allSelected ? allSelected.join(",") : "";
    let isEmpty =
      searchLatLng === "" && selectedDistance == 0 && searchItem === "";
    if (isEmpty && !subcategoryPage && !listingPage) {
      toastr.warning(langs.warning, langs.messages.mandate_filter);
    } else {
      let reqData = {
        name: searchItem ? searchItem : "",
        location: searchLatLng ? searchLatLng : "",
        distance: selectedDistance ? selectedDistance : "",
        userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : "",
      };
      if (address) {
        reqData.address = address.full_add;
        reqData.lat = address.latLng.lat;
        reqData.lng = address.latLng.lng;
        reqData.usr_state = address.state;
        reqData.usr_city = address.city;
        reqData.usr_pcode = address.p_code;
      }

      if (subcategoryPage || listingPage) {
        let temp = {};
        Object.keys(value).filter(function (key, index) {
          if (value[key] !== undefined && value[key]) {
            inv_attributes.map((el, index) => {
              if (el.display_name == key) {
                let att = inv_attributes[index];
                temp2.push({
                  inv_attribute_id: att.id,
                  inv_attribute_value_id: value[key],
                });
              }
            });
          }
        });
        Object.keys(value).filter(function (key, index) {
          if (value[key] !== undefined && value[key]) {
            if (attribute && attribute.length) {
              attribute.map((el, index) => {
                if (el.att_name == key) {
                  let att = attribute[index];
                  console.log("att", att);
                  let dropDropwnValue;
                  if (att.attr_type_name === "Drop-Down") {
                    let selectedValueIndex = att.value.findIndex(
                      (el) => el.id == value[key]
                    );
                    dropDropwnValue = att.value[selectedValueIndex];
                  }

                  temp[att.att_id] = {
                    name: att.att_name,
                    attr_type_id: att.attr_type,
                    attr_value:
                      att.attr_type_name === "Drop-Down"
                        ? dropDropwnValue.id
                        : att.attr_type_name === "calendar"
                        ? moment(value[key]).format("MMMM Do YYYY, h:mm:ss a")
                        : value[key],
                    parent_value_id: 0,
                    parent_attribute_id:
                      att.attr_type_name === "Drop-Down" ? att.att_id : 0,
                    attr_type_name: att.attr_type_name,
                  };
                }
                console.log("temp", temp);
              });
            }
          }
        });
        //additional parameters
        reqData.attributes = temp ? temp : "";
        reqData.categoryid =
          selectedOption && selectedOption.catid ? selectedOption.catid : catId;
        reqData.price_min = value.price_min ? value.price_min : "";
        reqData.price_max = value.price_max ? value.price_max : "";
        reqData.postwithin = value.postwithin ? value.postwithin : "";
        reqData.condition = value.condition ? value.condition : condition;
        reqData.brand = value.brand ? value.brand : "";
        reqData.returns_accepted = value.returns_accepted
          ? value.returns_accepted
          : false;
        reqData.exclude_out_of_stock = value.exclude_out_of_stock
          ? value.exclude_out_of_stock
          : false;
        reqData.inv_attributes = temp2 ? temp2 : "";
        reqData.subcategoryid = selectedNodes;
        if (
          reqData.postwithin === "" &&
          Object.keys(reqData.inv_attributes).length === 0 &&
          reqData.exclude_out_of_stock === false &&
          reqData.returns_accepted === false &&
          reqData.brand === "" &&
          reqData.name === "" &&
          reqData.price_min === "" &&
          reqData.price_max === "" &&
          reqData.location === "" &&
          reqData.distance === "" &&
          reqData.condition === "" &&
          selectedNodes.length === 0
        ) {
          toastr.warning(langs.warning, langs.messages.mandate_filter);
          return true;
        }
      }
      console.log("reqData", reqData);

      this.props.enableLoading();
      if (subcategoryPage || listingPage) {
        this.props.applyRetailFilter(reqData, (res) => {
          this.props.disableLoading();
          if (Array.isArray(res.data)) {
            this.props.handleSearchResponce(res.data, false, reqData);
          } else {
            this.props.handleSearchResponce([], false, reqData);
          }
        });
      } else {
        this.props.getAllRetailSearchByName(reqData, (res) => {
          console.log("res.data", res.data);
          this.props.disableLoading();
          if (res.data && Array.isArray(res.data.data)) {
            this.props.handleSearchResponce(res.data.data, false, reqData);
          } else {
            this.props.handleSearchResponce([], false, reqData);
          }
        });
      }
    }
  };

  /**
   * @method toggleMoreOption
   * @description toggle more options
   */
  toggleMoreOption() {
    this.setState({
      isMoreOption: !this.state.isMoreOption,
    });
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
   * @method renderOption
   * @description render options
   */
  renderOption = (item) => {
    if (item && item.length !== 0) {
      return item.map((el, i) => {
        return (
          <Option key={i} value={el.value}>
            {el.name}
          </Option>
        );
      });
    }
  };

  /**
   * @method renderOption
   * @description render options
   */
  renderDynamicOption = (item) => {
    if (item && item.length !== 0) {
      return item.map((el, i) => {
        return (
          <Option key={i} value={el.value}>
            {el.value}
          </Option>
        );
      });
    }
  };

  /**
   * @method renderItem
   * @description render dynamic attribute input
   */
  renderItem = () => {
    const { attribute } = this.state;
    console.log("attribute", attribute);
    if (attribute && attribute.length) {
      return attribute.map((data, i) => {
        return (
          <>
            {i % 2 == 0 ? (
              <Col md={12}>
                {renderField(
                  data,
                  data.attr_type_name,
                  data.value,
                  true,
                  false
                )}
              </Col>
            ) : (
              <Col md={12}>
                {renderField(
                  data,
                  data.attr_type_name,
                  data.value,
                  true,
                  false
                )}
              </Col>
            )}
          </>
        );
      });
    }
  };

  /**
   * @method renderOtherAttItem
   * @description render dynamic inv group attribute
   */
  renderGroupAttItem = () => {
    const { inv_attributes } = this.state;
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    console.log("attribute", inv_attributes);
    if (inv_attributes && inv_attributes.length) {
      return inv_attributes.map((el, i) => {
        return (
          <>
            {i % 2 == 0 ? (
              <Col md={6} className="mrg-top-space">
                <div
                  className={
                    currentField[el.display_name] ? "floating-label" : ""
                  }
                >
                  <Form.Item
                    name={el.display_name}
                    label={el.display_name}
                    className="w-100"
                  >
                    <Select
                      placeholder={el.display_name}
                      allowClear
                      onChange={() => this.setState({ flag: true })}
                    >
                      {this.renderDynamicOption(el.values)}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            ) : (
              <Col md={6} className="mrg-top-space">
                <div
                  className={
                    currentField[el.display_name] ? "floating-label" : ""
                  }
                >
                  <Form.Item
                    name={el.display_name}
                    label={el.display_name}
                    className="w-100"
                  >
                    <Select
                      placeholder={el.display_name}
                      allowClear
                      onChange={() => this.setState({ flag: true })}
                    >
                      {this.renderDynamicOption(el.values)}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            )}
          </>
        );
      });
    }
  };

  /**
   * @method onSelectChange
   * @description on select change
   */
  onSelectChange = (currentNode, selectedNodes) => {
    let temp = selectedNodes.map((el) => {
      return el.value ? el.value : el.pid;
    });
    console.log("temp: ", temp);
    this.setState({ selectedNodes: temp.length && temp.join(",") });
  };

  onSelect = (selectedList, selectedItem) => {
    const { allCategories } = this.state;
    console.log("selectedList", selectedList, selectedItem);
    let selectedValue =
      selectedItem.label === "all"
        ? allCategories.filter((el) => el.value === selectedItem.value)
        : [];
    let temp = selectedList.map((el) => {
      return el.id;
    });
    this.setState({
      selectedNodes: temp.length && temp.join(","),
      selectedValue: selectedValue,
    });
  };

  handleCheckUncheck = (e, sub_category) => {
    let allSelected = this.state.allSelected;
    sub_category.map((el) => {
      if (e.target.value == el.id) {
        if (e.target.checked) {
          let temp = [{ id: el.id, text: "all" }, ...el.category_childs];
          temp.map((c) => {
            allSelected.push(c.id);
          });
        } else {
          el.category_childs.map((c) => {
            const index = allSelected.indexOf(c.id);
            if (index > -1) {
              allSelected.splice(index, 1);
            }
          });
        }
      } else if (e.target.checked) {
        allSelected.push(e.target.value);
      } else if (!e.target.checked) {
        const index = allSelected.indexOf(e.target.value);
        if (index > -1) {
          allSelected.splice(index, 1);
        }
      }
      var unique = allSelected.filter((v, i, a) => a.indexOf(v) === i);
      this.setState({ allSelected: unique });
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          subcategoryid: unique,
        });
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { allSelected, isMoreOption, brandList, catId } = this.state;
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    console.log("subCategoryId", catId);
    const {
      showMoreOption = false,
      landingPage,
      subcategoryPage = false,
      listingPage = false,
    } = this.props;
    let parameter = this.props.match.params;
    let fieldNumber =
      !isMoreOption && (subcategoryPage || listingPage)
        ? "four"
        : isMoreOption
        ? "one"
        : "three";
    let defaultClass = landingPage
      ? `genralretail-location-search-wrap re-location-search-wrap-${fieldNumber}-field`
      : subcategoryPage || listingPage
      ? `re-location-search-wrap-${fieldNumber}-field genralretail-location-search-wrap`
      : "";
    const { sub_category } = this.props;
    let subCatId = currentField && currentField["subcategoryid"];
    let retail_categories = listingPage
      ? sub_category.filter((el) => el.id == catId)
      : sub_category;
    console.log(allSelected, "retail_categories");
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        subcategoryid: allSelected,
      });
    let me = this;
    return (
      <div className={`location-search-wrap ${defaultClass}`}>
        <Form
          ref={this.formRef}
          name="location-form"
          className="location-search"
          layout={"inline"}
          onFinish={this.handleSearch}
        >
          <Form.Item style={{ width: "calc(100% - 205px)" }}>
            <Input.Group compact>
              <Form.Item noStyle name="name">
                <AutoComplete
                  className="custom-auto-complete"
                  handleSearchSelect={(option) => {
                    this.setState({ selectedOption: option });
                  }}
                  handleValueChange={(value) => {
                    this.setState({ searchItem: value });
                  }}
                />
              </Form.Item>
              {(subcategoryPage || listingPage) && (
                <>
                  <Form.Item noStyle name={"subcategoryid"}>
                    <Select
                      placeholder="Select sub categories"
                      style={{ width: 378 }}
                      mode={"multiple"}
                      maxTagCount={1}
                      // allowClear
                      menuItemSelectedIcon={
                        <Icon type="check-square" theme="filled" />
                      }
                      onDeselect={(value) => {
                        const index = allSelected.indexOf(value);
                        if (index > -1) {
                          allSelected.splice(index, 1);
                        }
                        this.setState({ allSelected: allSelected });
                      }}
                      className={"any-classification-multiselect"}
                      dropdownMatchSelectWidth={false}
                    >
                      {retail_categories.map((el) => {
                        return (
                          <OptGroup label={<strong>{el.text}</strong>}>
                            {[
                              { id: el.id, text: "all" },
                              ...el.category_childs,
                            ].map((c) => {
                              return (
                                <Option value={c.id}>
                                  <Checkbox
                                    value={c.id}
                                    onChange={(e) =>
                                      this.handleCheckUncheck(
                                        e,
                                        retail_categories
                                      )
                                    }
                                    checked={
                                      subCatId && subCatId.includes(c.id)
                                        ? true
                                        : false
                                    }
                                  >
                                    {c.text}
                                  </Checkbox>
                                </Option>
                              );
                            })}
                          </OptGroup>
                        );
                      })}
                      {/* <WidgetTree/> */}
                    </Select>
                  </Form.Item>

                  {allSelected && allSelected.length !== 0 && (
                    <img
                      alt="pin"
                      src={require("../../assets/images/icons/cancel-black-bg.svg")}
                      width="18"
                      height="12"
                      onClick={() => {
                        this.setState({ allSelected: [] });
                        this.formRef.current &&
                          this.formRef.current.setFieldsValue({
                            subcategoryid: [],
                          });
                      }}
                      style={{
                        position: "absolute",
                        right: "-360px",
                        top: "21px",
                        zIndex: "9",
                        cursor: "pointer",
                        }}
                    />
                  )}
                </>
              )}
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary" shape={"circle"}>
                <Icon icon="search" size="20" />
              </Button>
            </Space>
          </Form.Item>
          {isMoreOption && (subcategoryPage || listingPage) && (
            <Row gutter={[10, 0]} className="location-more-form ">
              <Col md={6} className="mrg-top-space">
                <div
                  className={currentField["price_min"] ? "floating-label" : ""}
                >
                  <Form.Item
                    //noStyle
                    name="price_min"
                    label="Price Min."
                  >
                    <Select
                      allowClear
                      dropdownMatchSelectWidth={false}
                      onChange={(el) => {
                        this.setState({ selectedMinPrice: el });
                        this.formRef.current.setFieldsValue({
                          price_max: "",
                        });
                      }}
                      placeholder="Price Min."
                    >
                      {this.renderPrizeOptions("price_min")}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col md={6} className="mrg-top-space">
                <div
                  className={currentField["price_max"] ? "floating-label" : ""}
                >
                  <Form.Item
                    //noStyle
                    name="price_max"
                    label="Price Max."
                  >
                    <Select
                      placeholder="Price Max."
                      allowClear
                      onChange={() => this.setState({ flag: true })}
                    >
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
                </div>
              </Col>
              {subcategoryPage && (
                <Col md={6} className="mrg-top-space">
                  <div
                    className={
                      currentField["price_max"] ? "floating-label" : ""
                    }
                  >
                    <Form.Item
                      //noStyle
                      name="postwithin"
                      label="Posted Within"
                    >
                      <Select
                        placeholder="Posted Within"
                        allowClear
                        onChange={() => this.setState({ flag: true })}
                      >
                        <Option value={"1-10"}>1 - 10 Days</Option>
                        <Option value={"10-20"}>10 - 20 Days</Option>
                        <Option value={"20-30"}>20 - 30 Days</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              )}
              {listingPage && this.renderGroupAttItem()}
              {listingPage && this.renderItem()}
              {listingPage && (
                <Col md={6} className="mrg-top-space">
                  <div
                    className={
                      currentField["price_max"] ? "floating-label" : ""
                    }
                  >
                    <Form.Item name={"brand"} label="Brand" className="w-100">
                      <Select
                        placeholder="Brand"
                        allowClear
                        onChange={() => this.setState({ flag: true })}
                      >
                        {this.renderOption(brandList)}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              )}
              {(subcategoryPage || listingPage) && (
                <Col md={6} className="mrg-top-space">
                  <div
                    className={
                      currentField["price_max"] ? "floating-label" : ""
                    }
                  >
                    <Form.Item
                      name={"condition"}
                      label="Condition"
                      className="w-100"
                    >
                      <Select
                        onChange={(e) => {
                          this.setState({ condition: e });
                        }}
                        placeholder="Condition"
                      >
                        <Option value={"all"}>{"All"}</Option>
                        <Option value={"new"}>{"New"}</Option>
                        <Option value={"used"}>{"Used"}</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              )}
            </Row>
          )}
          {isMoreOption && (subcategoryPage || listingPage) && (
            <Row gutter={[10, 0]} className="location-more-form ">
              {listingPage && (
                <Col md={7} className="mrg-top-space">
                  <Form.Item
                    name={"returns_accepted"}
                    noStyle
                    valuePropName="checked"
                  >
                    <Checkbox>Returns Accepted</Checkbox>
                  </Form.Item>
                </Col>
              )}
              {listingPage && (
                <Col md={6} className="mrg-top-space">
                  <Form.Item
                    name={"exclude_out_of_stock"}
                    noStyle
                    valuePropName="checked"
                  >
                    <Checkbox>Exclude Out of Stock</Checkbox>
                  </Form.Item>
                </Col>
              )}
            </Row>
          )}
          {!landingPage && (
            <div className="location-more-option">
              <div className="retail-checkbox-width-block">&nbsp;</div>
              {this.state.isMoreOption && (
                <a onClick={this.resetSearch}>
                  <CloseOutlined className="clr-filer-icon" />
                  {"Clear Filter"}
                </a>
              )}
              <a
                onClick={this.toggleMoreOption.bind(this)}
                className={!this.state.isMoreOption && "active"}
              >
                {!this.state.isMoreOption ? "More Options" : "Less Options"}
              </a>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, classifieds, retail, common } = store;
  console.log("retail", retail);
  const { categoryData } = common;
  let retailList =
    categoryData && Array.isArray(categoryData.retail.data)
      ? categoryData.retail.data
      : [];
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedClassifiedList: classifieds.classifiedsList,
    sub_category:
      retail &&
      Array.isArray(retail.retail_sub_categories) &&
      retail.retail_sub_categories.length
        ? retail.retail_sub_categories
        : [],
    retailList,
  };
};

export default GeneralRetailSearch = connect(mapStateToProps, {
  getAllRetailSearchByName,
  addCallForPopularSearch,
  enableLoading,
  disableLoading,
  classifiedGeneralSearch,
  getRetailDynamicAttribute,
  getAllBrandsAPI,
  applyRetailFilter,
})(withRouter(GeneralRetailSearch));
