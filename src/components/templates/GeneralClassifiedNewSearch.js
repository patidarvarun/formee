import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import { Form, Input, Select, Button, Row, Col, Space,DatePicker,Checkbox } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Icon from "../customIcons/customIcons";
import { getFilterRoute } from "../../common/getRoutes";
import {
  classifiedGeneralSearch,
  addCallForPopularSearch,
  enableLoading,
  disableLoading,
  getChildCategory,
  getClassifiedDynamicInput
} from "../../actions/index";
import PlacesAutocomplete from "../common/LocationInput";
import AutoComplete from "../forminput/AutoComplete";
import { DISTANCE_OPTION,PRIZE_OPTIONS } from "../../config/Constant";
import { getIpfromLocalStorage } from "../../common/Methods";
import { renderField } from "../forminput";
import { getThisMonthDates, getThisWeek, currentDate } from '../common'
let ipAddress = getIpfromLocalStorage();
const { Option } = Select;
const { RangePicker } = DatePicker;

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
      isMoreOption: false,
      attribute: [],
      prizeOptions: PRIZE_OPTIONS,
      selectedMinPrice:'',
      isInputVisible: false,
      is_register: false,
      topAttributes: []
    };
  }

  /**
   * @method componentDidMount
   * @description called before mounting the component
   */
  componentDidMount() {
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    let subCategoryId = parameter.subCategoryId; 
    this.props.enableLoading();
    if (parameter.all === langs.key.all) {
      this.getChildCategory(categoryId)
    }else if(subCategoryId === undefined){
      this.getInvDynamicAttributes(categoryId)
      this.setState({isInputVisible: true})
    } else {
      let subCategoryId = parameter.subCategoryId;
      this.getInvDynamicAttributes(subCategoryId)
      this.setState({isInputVisible: false})
    }
  }

  /**
    * @method componentWillReceiveProps
    * @description receive props
    */
    componentWillReceiveProps(nextprops, prevProps) {
      console.log('nextprops >>>>',nextprops)
      let parameter = this.props.match.params
      let catId = parameter.categoryId
      let catIdNext = nextprops.match.params.categoryId
      let subCatIdInitial = parameter.subCategoryId
      let subCatIdNext = nextprops.match.params.subCategoryId
      console.log('catId >>>>>',catId,catIdNext, subCatIdNext,parameter.all)
      if(subCatIdNext === undefined){
        if(catId !== catIdNext){
          if (parameter.all === langs.key.all) {
            this.getChildCategory(catIdNext)
          }else {
            this.getInvDynamicAttributes(catIdNext)
            this.setState({isInputVisible: true})
          }
        }
      }else if(subCatIdNext !== subCatIdInitial) {
        this.props.enableLoading();
        this.getInvDynamicAttributes(subCatIdNext)
        this.setState({isInputVisible: false})
      }
  }

  /**
  * @method getChildCategory
  * @description get child category 
  */
  getChildCategory = (categoryId) => {
    this.props.getChildCategory({ pid: categoryId }, (res1) => {
      this.props.disableLoading();
      if (res1.status === 200) {
        const data =
        Array.isArray(res1.data.newinsertcategories) &&
        res1.data.newinsertcategories;
        let classifiedId = data && data.length && data.map((el) => el.id);
        if (classifiedId && classifiedId.length) {
          let id = classifiedId.join(",");
          this.getInvDynamicAttributes(id)
        }
      }
    });
  }

  /**
   * @method getInvDynamicAttributes
   * @description get inv dynamic input 
   */
  getInvDynamicAttributes = (id) => {
    this.props.getClassifiedDynamicInput(
      { categoryid: id, filter: 1 },
      (res) => {
        this.props.disableLoading()
        if (res.status === 200) {
          const atr = Array.isArray(res.data.attributes)
            ? res.data.attributes
            : [];
        let topAttributes = atr.filter(el => el.is_grey === 1)
        let otherAttributes = atr.filter(el => el.is_grey === 0)
          this.setState({ attribute: otherAttributes, allIds: id, topAttributes: topAttributes });
        }
      }
    );
  }

  /**
   * @method renderItem
   * @description render dynamic input
   */
  renderItem = () => {
    const { attribute } = this.state;
    console.log('attribute',attribute)
    if (attribute && attribute.length) {
      return attribute.map((data, i) => {
        return (
          <Row gutter={[14, 0]} className='location-more-form'>
            {i % 2 == 0 ? <Col md={24}>
                  {renderField(data, data.attr_type_name, data.value, true, false)}
            </Col> : 
            <Col md={24}>
                {renderField(data, data.attr_type_name, data.value, true, false)}
            </Col>}
          </Row>
        );
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
          {el} km
        </Option>
      );
    });
  };

  /**
   * @method renderDistanceOptions
   * @description render subcategory
   */
  renderOptions = (value) => {
    console.log('option', value)
    if(value && value.length){
      return value.map((el, i) => {
        return (
          <Option key={i} value={el.id}>
            {el.name}
          </Option>
        );
      });
    }
  };


  /**
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field
   */
  handleAddress = (result, address, latLng) => {
    console.log("result: ", result);
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
  handleSearch = (value) => {
    const {
      selectedCity,
      selectedDistance,
      searchLatLng,
      selectedOption,
      selectedMinPrice,
      is_register
    } = this.state;
    let isEmpty = Object.keys(selectedOption).length === 0;
    if (isEmpty) {
      toastr.warning(langs.warning, langs.messages.mandate_filter);
    } else {
      let reqData = {
        // name: selectedOption.title,
        // cat_id: selectedOption.catid,
        name: value.name,
        location: searchLatLng,
        distance: selectedDistance,
        userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : "",
      };
      this.props.enableLoading();
      this.props.classifiedGeneralSearch(reqData, (res) => {
        console.log("reqData:%  >", reqData);
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
          console.log("reqData2: ", reqData2);
          this.props.addCallForPopularSearch(reqData2, (res) => {
            console.log("res:2 ", res);
          });
        } else {
          this.props.handleSearchResponce([], false, reqData);
        }
      });
    }
  };

  /**
    * @method toggleMoreOption
    * @description toggle more options
    */
   toggleMoreOption() {
    this.setState({
        isMoreOption: !this.state.isMoreOption,
    })
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
   * @method handleCheck
   * @description handle mobile check uncheck
   */
  handleCheck = (e) => {
    this.setState({ is_register: e.target.checked })
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedDistance,
      isvisible,isInputVisible,is_register,topAttributes
    } = this.state;
    let temp = topAttributes && topAttributes.length ? topAttributes : ''
    let first = temp && temp[0];
    let second = temp && temp.length > 1 && temp[1]
    const { showMoreOption = false, landingPage,template } = this.props;
    console.log('first',first && first.value)
    console.log("showMoreOption: ", showMoreOption);
    let parameter = this.props.match.params;
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
                {/* <AutoComplete
                  className="suraj"
                  handleSearchSelect={(option) => {
                    this.setState({ selectedOption: option });
                  }}
                /> */}
                <Input placeholder={'Enter Keyword Search'}  style={{ width: "100%", maxWidth: "300px" }}/>
              </Form.Item>
              {first && <Form.Item noStyle name={first.att_name}>
                <Select
                    style={{ width: "20%", maxWidth: "200px" }}
                    placeholder={first.att_name}
                  >
                   {this.renderOptions(first.value)}
                  </Select>
              </Form.Item>}
              <Form.Item name={"location"} noStyle>
                <PlacesAutocomplete
                  name="address"
                  handleAddress={this.handleAddress}
                  addressValue={this.state.address}
                />
              </Form.Item>
              {second && <Form.Item noStyle name={second.att_name}>
                <Select
                    style={{ width: "18%", maxWidth: "150px" }}
                    placeholder={second.att_name}
                  >
                    {this.renderOptions(second.value)}
                  </Select>
              </Form.Item>}
              {(template == 'general' || landingPage) && <Form.Item name={"distance"} noStyle>
                <Select
                  onChange={(e) => {
                    this.setState({ selectedDistance: e });
                  }}
                  defaultValue={selectedDistance}
                  style={{ width: "18%", maxWidth: "150px" }}
                  placeholder="0 km"
                >
                  {this.renderDistanceOptions()}
                </Select>
              </Form.Item>}
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
              {this.state.isMoreOption &&
                <div>
                   {template !== 'job' && <Row gutter={[8, 8]} className='location-more-form'>
                    <Col md={12}>
                        <Form.Item
                            noStyle
                            name='price_min'
                        >
                            {/* <Input placeholder={'Price Min.(AU$)'} type={'number'} /> */}
                            <Select
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
                    </Col>
                    <Col md={12}>
                        <Form.Item
                            noStyle
                            name='price_max'
                        >
                            {/* <Input placeholder={'Price Max.(AU$)'} type={'number'} /> */}
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
                    </Col>
                    {isInputVisible &&<Col md={12}>
                        <Form.Item
                            noStyle
                            name='sort'
                        >
                            <Select placeholder='Sort' allowClear>
                                <Option value='price_high'>Price (High-Low)</Option>
                                <Option value='price_low'>Price (Low-High)</Option>
                                <Option value='rating'>Rating</Option>
                                <Option value='most_viewed'>Most Reviewed</Option>
                                <Option value='name'>Name List A-Z</Option>
                                <Option value='distance'>Distance</Option>
                            </Select>
                        </Form.Item>
                    </Col>}

                    {isInputVisible &&<Col md={12}>
                        <Form.Item
                            noStyle
                            name='listed_date'
                            className="w-100"
                        >
                            <Select placeholder='Listed'  allowClear>
                                <Option value={1-10}>1-10 Days</Option>
                                <Option value={10-20}>10 -20 Days</Option>
                                <Option value={20-30}>20-30 Days</Option>
                            </Select>
                        </Form.Item>
                    </Col>}
                </Row>}
                <Row gutter={[8, 8]} className='location-more-form'>
                    {this.renderItem()}
                </Row>
                </div>
              }
              <div className='location-more-option'>
                  <a onClick={this.toggleMoreOption.bind(this)} className={!this.state.isMoreOption && 'active'}>
                      {!this.state.isMoreOption ? 'More option' : 'Less option'}
                  </a>
              </div>
              {template === 'general' && <div className='show-on-myad'>
                    <Form.Item name='is_register' valuePropName='checked'>
                      <Checkbox onChange={this.handleCheck}> {'Registered Cars Only'}</Checkbox>
                    </Form.Item>
                  </div>}
            </Form.Item>
          )}
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
  getChildCategory,
  getClassifiedDynamicInput
})(withRouter(GeneralClassifiedGeneral));
