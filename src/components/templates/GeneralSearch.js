import React, { Fragment } from "react";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import { Form, Input, Select, Button, Row, Col, Space, DatePicker, Checkbox } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Icon from "../customIcons/customIcons";
import { getFilterRoute } from "../../common/getRoutes";
import {
  classifiedGeneralSearch,
  addCallForPopularSearch,
  enableLoading,
  disableLoading,
  getChildCategory,
  getClassifiedDynamicInput,
  applyClassifiedFilterAttributes,
  getChildInput
} from "../../actions/index";
import PlacesAutocomplete from "../common/LocationInput";
import AutoComplete from "../forminput/AutoComplete";
import {
  getPriceOption,
  PRIZE_OPTIONS_Classified,
   DISTANCE_OPTION, 
   PRIZE_OPTIONS,
   SALARY_OPTIONS_MIN, 
   SALARY_OPTIONS_MAX,
   COMMERTIAL_PRICE,
   RESIDENCIAL_PRICE,
   COMMERTIAL_BUY_SOLD,
   RESIDENCIAL_BUY_SOLD,
   SALARY_ANUALLY,
   SALARY_HOURLY
} from "../../config/Constant";
import { getIpfromLocalStorage } from "../../common/Methods";
import { renderField } from "../forminput";
import { getThisMonthDates, getThisWeek, currentDate } from '../common'
let ipAddress = getIpfromLocalStorage();
const { Option } = Select;
const { RangePicker } = DatePicker;
let attr_id = undefined;
let flag = false

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
      selectedOption: '',
      selectedCity: "",
      isMoreOption: false,
      attribute: [],
      prizeOptions: PRIZE_OPTIONS_Classified,
      selectedMinPrice: '',
      isInputVisible: false,
      is_register: false,
      topAttributes: [],
      catId: '',
      register: false,
      searchItem: '',
      checkAttributes: [],
      subCategoryId:'',
      address:'',
      salaryMax: SALARY_ANUALLY,
      salaryMin: SALARY_ANUALLY,
      isFloated:false,
      isClearAll: false,
      isAnimated: false,
      selectedMaxPrice: '',
      minYear: ''
    };
  }

  /**
   * @method componentDidMount
   * @description called before mounting the component
   */
  componentDidMount() {
    const { template, slug } = this.props;
    console.log('slug >>>>> ', slug)
    let parameter = this.props.match.params;
    let categoryName = parameter.categoryName
    let categoryId = parameter.categoryId;
    let subCategoryId = parameter.subCategoryId;
    this.props.enableLoading();
    let priceList = getPriceOption(categoryName, parameter.subCategoryName)
    this.setState({prizeOptions: priceList})
    if (parameter.all === langs.key.all) {
      this.setState({ isInputVisible: true })
    } else if (subCategoryId === undefined) {
      this.getInvDynamicAttributes(categoryId)
      if(categoryName === langs.key.commercial || categoryName === langs.key.residential || categoryName === 'Jobs'){
        this.setState({isInputVisible: false})
      }else{
        this.setState({ isInputVisible: true, catId: categoryId, subCategoryId:subCategoryId  })
      }
    } else {
      let subCategoryId = parameter.subCategoryId;
      this.getInvDynamicAttributes(subCategoryId)
      if(categoryName === 'Jobs'){
        this.setState({isInputVisible: false})
      }else{
        this.setState({ isInputVisible: false, catId: categoryId,subCategoryId:subCategoryId })
      }
    }
  }

  /**
    * @method componentWillReceiveProps
    * @description receive props
    */
  componentWillReceiveProps(nextprops, prevProps) {
    const { template } = this.props;
    let parameter = this.props.match.params
    let catId = parameter.categoryId
    let catIdNext = nextprops.match.params.categoryId
    let subCatIdInitial = parameter.subCategoryId
    let subCatIdNext = nextprops.match.params.subCategoryId
    let categoryName = nextprops.match.params.categoryName
    let priceList = getPriceOption(categoryName, nextprops.match.params.subCategoryName)
    this.setState({prizeOptions: priceList})
    console.log('catId >>>>>', catId, catIdNext, subCatIdNext, parameter.all,nextprops.match.params.all )
    if (subCatIdNext === undefined) {
      if (catId !== catIdNext) {
        console.log('case outer')
        if (parameter.all === langs.key.all) {
          this.setState({ isInputVisible: true})
          this.resetSearch()
        } else {
          this.getInvDynamicAttributes(catIdNext)
          console.log('case outer case 2')
          this.resetSearch()
          if(categoryName === langs.key.commercial || categoryName === langs.key.residential || categoryName === 'Jobs'){
            this.setState({isInputVisible: false})
          }else{
            this.setState({ isInputVisible: true, catId: catIdNext,subCategoryId:subCatIdNext })
          }
        }
      }
    }else if (subCatIdNext !== subCatIdInitial) {
        this.props.enableLoading();
        console.log('case inner case 2')
        this.getInvDynamicAttributes(subCatIdNext)
        this.resetSearch()
        if(categoryName === 'Jobs'){
          this.setState({isInputVisible: false})
        }else {
          this.setState({ isInputVisible: false, catId: catIdNext,subCategoryId:subCatIdNext})
        }
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
    let found = false
    this.props.getClassifiedDynamicInput(
      { categoryid: id, filter: 1 },
      (res) => {
        this.props.disableLoading()
        if (res.status === 200) {
          const atr = Array.isArray(res.data.attributes)
            ? res.data.attributes
            : [];
          let topAttributes = atr.filter(el => el.is_grey === 1)
          let otherAttributes = atr.filter(el => el.is_grey === 0 && el.att_name !== 'Exclude Under Offer' && el.slug !== 'vehcile_registration' && el.is_static == 1)
          if (atr.some(e => e.slug === 'vehcile_registration' || e.att_name === 'Exclude Under Offer')) {
            found = true
          }
          let checkAttributes = atr.filter(el => el.att_name === 'Exclude Under Offer' || el.slug === 'vehcile_registration' && el.is_static == 1)
          //let otherAttributes = atr.filter(el => el.is_grey === 0 && el.is_static)
          console.log('otherAttributes',otherAttributes)
          this.setState({ 
              attribute: otherAttributes, 
              allIds: id, topAttributes: topAttributes, 
              register: found,
              checkAttributes: checkAttributes 
            });
        }
      }
    );
  }

  /**
   * @method renderOptionItem
   * @descriptionhandle render option item
   */
  renderOptionItem = (attr_AllValues, data) => {
    let value = {}
    if (attr_AllValues && Array.isArray(attr_AllValues)) {
      if (data.have_children) {
          attr_id = data.att_id
          flag = data.have_children
      }
      return attr_AllValues.length !== 0 && attr_AllValues.map((keyName, i) => {
          value.child_data = keyName
          value.parent_data = data;
          return (
              <Option
                  key={i}
                  value={keyName.id}                   
              >{keyName.name}</Option>
          )
      })
    } 
  }

  /**
   * @method renderChildOption
   * @descriptionhandle render child option
   */
  renderChildOption = (attr_AllValues) => {
    if (attr_AllValues && Array.isArray(attr_AllValues)) {
      return attr_AllValues.length !== 0 && attr_AllValues.map((keyName, i) => {
          return (
              <Option
                  key={i}
                  value={keyName.id}                   
              >{keyName.name}</Option>
          )
      })
    } 
  }

  /**
   * @method handleDropdownchange
   * @descriptionhandle handle item change
   */
  handleDropdownchange = (value) => {
    console.log('value',value)
    if(value === 655){
      this.setState({salaryMin: SALARY_HOURLY})
    }else {
      this.setState({isFloated: true, salaryMin: SALARY_ANUALLY})
    }
    if (flag) {
        const requestData = {
            attributeValueid: value,
            attribute_id: attr_id
        }
        this.props.getChildInput(requestData, res => {
            if (res.status === 200) {
                const childData = res.data.data && Array.isArray(res.data.data.value) ? res.data.data.value : []
                this.setState({ subCategory: childData, data2: res.data.data, isVisible: true })
            }
        })
    }
  }

  /**
   * @method handleYearChange
   * @descriptionhandle handle year change
   */
  handleYearChange = (value, item) => {
    let temp = item && item.value.filter(el => el.id === value)
    console.log('[item.att_name]',item.att_name)
    this.setState({[item.att_name]: temp && temp.length ? temp[0].name : ''})
    console.log(temp,'value',value,this.state)
  }

  /**
   * @method renderSelect
   * @descriptionhandle render select
   */
  renderSelect = (data,label) => {
    const { minYear } = this.state
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    let value = label ? currentField[label] : currentField[data.att_name]
    let min = label === 'Minimum Year' || label === 'Min Year' || label === 'Odometer From'
    let max = label === 'Maximum Year' || label === 'Max Year' || label === 'Odometer To'
    console.log('min', min, label)
    return (
      <div className={value ? "floating-label" : ''}>
          <Form.Item
              label={label ? label : data.att_name}
              name={label ? label : data.att_name}
              className="w-100"
          >
              <Select 
              dropdownMatchSelectWidth={false}
                  placeholder={label ? label : data.att_name}
                  onChange={(e) => min ? this.handleYearChange(e, data) : this.handleDropdownchange(e)}
                  allowClear
              >
                  {max ? 
                    data.value.map((el, i) => {
                    let disable = false;
                    if (
                      this.state[data.att_name] &&
                      (this.state[data.att_name]) > (el.name)
                    ) {
                      disable = true;
                    }
                    return (
                      <Option disabled={disable} key={i} value={el.id}>
                        {`${el.name}`}
                      </Option>
                    );
                  }) : this.renderOptionItem(data.value, data)}
              </Select>
          </Form.Item>
      </div>
    )
  }

  /**
   * @method renderChildSelect
   * @descriptionhandle render child select
   */
  renderChildSelect = () => {
    const { subCategory, data2 } = this.state
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    let value = currentField[data2 ? data2.att_name : 'Model']
    console.log('value child',currentField, value)
    return (
      <div className={value ? "floating-label" : ''}>
          <Form.Item
              label={'Model'}
              name={data2 ? data2.att_name : 'Model'}
              className="w-100"
          >
              <Select
                  placeholder={'Model'}
                  dropdownMatchSelectWidth={false}
                  allowClear
                  onChange={() => this.setState({isFloated:true})}
                  disabled={subCategory === undefined ? true : false}
              >
                  {this.renderChildOption(subCategory)}
              </Select>
          </Form.Item>
      </div>
    )
  }

  renderMultiSelect = (data) => {
    const { isAnimated } = this.state
    const handleChange = (value) =>  {
      if(value && value.length){
        this.setState({isAnimated: true})
      }else {
        this.setState({isAnimated: false})
      }
  }
  const renderMultiSelectItem = () => {
      if (data.value && Array.isArray(data.value)) {
          return data.value.length !== 0 && data.value.map((keyName, i) => {
              return (
                  <Option key={i} value={keyName.name}>{keyName.name}</Option>
              )
          })
      } else {
          return data.value.length !== 0 && Object.keys(data.value).map((keyName, i) => {
              return (
                  <Option key={i} value={keyName.id}>{keyName.name}</Option>
              )
          })
      }
  }
    return (
      <div className={(isAnimated) ? "floating-label" : ''}>
          <Form.Item
              label={data.att_name}
              name={data.att_name}
              placeholder={data.att_name}
          >
            <Select
                mode='multiple'
                style={{ width: '100%' }}
                dropdownMatchSelectWidth={false}
                placeholder={data.att_name}
                onChange={handleChange}
                optionLabelProp='label'
                showArrow={true}
                allowClear
            >
                {renderMultiSelectItem()}
            </Select>
          </Form.Item>
      </div>
    )
  }

  /**
  * @method renderText
  * @description render text input field 
  */
  renderText = (data) => {
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    let value = currentField[data.att_name]
    console.log('value',value)
    let measure_unit = data.measure_unit && Array.isArray(data.measure_unit) ? data.measure_unit : (data.measure_unit).split(',')
    const selectAfter = (
        <Select defaultValue="Sqr Metre" className="select-after" dropdownMatchSelectWidth={false}>
            {measure_unit && measure_unit.length !== 0 && measure_unit.map((keyName, i) => {
                return (
                    <Option key={i} value={keyName}>{keyName}</Option>
                )
            })}
        </Select>
    );
    return (
        <div className={`area-size-block ${value ? 'floating-label' : ''}` }>
            <Form.Item
                label={data.att_name}
                name={data.att_name}
            >
              <Input 
                placeholder={data.att_name} 
                addonAfter={selectAfter}
                onChange={() => this.setState({isFloated: true})} 
              />
            </Form.Item>
        </div>
    )
  }


  renderDynamicField = (data, label) => {
    switch (data.attr_type_name) {
      case 'Drop-Down':
          return <div>  {this.renderSelect(data,label)}</div>
      case 'Multi-Select':
        return <div> {this.renderMultiSelect(data)}</div>
      case 'text':
        return <div> {this.renderText(data)}</div>
    }
  }

  /**
   * @method renderItem
   * @description render dynamic input
   */
  renderItem = () => {
    const { attribute,subCategory,isClaerAll} = this.state;
    let currentField = this.formRef.current 
    let parameter = this.props.match.params;
    let cat_name = parameter.categoryName
    //let flag = cat_name === 'Automotive'
    let flag = true
    if (attribute && attribute.length) {
      return attribute.map((data, i) => {
        if(data.have_children && data.attr_type_name === 'Drop-Down'){
          return (
            // <Col md={6}>
            // <div className="input-grp-compact">
            //   <Row gutter={0}>
            //     <Col md={12}>
            //       <div className="left-selct-list">{this.renderSelect(data, data.att_name)}</div>
            //     </Col>
            //     <Col md={12}>
            //       <div  className="right-selct-list">{this.renderChildSelect(subCategory)}</div>
            //     </Col>
            //   </Row>
            // </div>
            // </Col>
            <>
              <Col md={6}>
                {this.renderSelect(data)}
              </Col>
              <Col md={6}>
                {this.renderChildSelect(subCategory)}
              </Col>
            </>
          )
        }else if(data.slug === 'minimum_year' || data.slug === 'odometer_from' || data.slug === 'odometer_to'){
          return (
            // <Col md={6}>
            // <div className="input-grp-compact">
            //   <Row gutter={0}>
            //     <Col md={12}>
            //     <div className="left-selct-list">{this.renderDynamicField(data, data.combine_label_1)}</div>
            //     </Col>
            //     <Col md={12}>
            //     <div  className="right-selct-list">{this.renderDynamicField(data, data.combine_label_2)}</div>
            //     </Col>
            //   </Row>
            // </div>
            // </Col>
            <>
              <Col md={6}>
              {this.renderDynamicField(data, data.combine_label_1)}
              </Col>
              <Col md={6}>
                {this.renderDynamicField(data, data.combine_label_2)}
              </Col>
            </>

          )
        }else {
          return (
            <>
              {i % 2 == 0 ? <Col md={flag ? 6 :  12}>
                {this.renderDynamicField(data, data.att_name)}
              </Col> :
                <Col md={flag ? 6 : 12}>
                  {this.renderDynamicField(data, data.att_name)}
                </Col>}
            </>
          );
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
   * @method renderDistanceOptions
   * @description render subcategory
   */
  renderOptions = (value) => {
    console.log('option', value)
    if (value && value.length) {
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
      selectedCity:city
    });
  };

  /**
   * @method resetSearch
   * @description Use to reset Search bar
   */
  resetSearch = () => {
    this.formRef.current.resetFields();
    this.setState({
      isSearchResult: false,
      searchKey: "",
      searchLatLng: "",
      selectedDistance: 0,
      selectedOption: '',
      isFloated: false,
      isAnimated: false
    });
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    this.props.handleSearchResponce("", true, {});
    // this.props.history.push(this.props.location.pathname)
  };

  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = (value) => {
    console.log('value $$$$', value)
    let allFormValue = value
    let order = value.sort === 'price_lh' || value.sort === 'name_az' ? 'DESC' : value.sort === 'price_hl' || value.sort === 'name_za' ? 'ASC' : ''
    let order_by = value.sort === 'price_lh' || value.sort === 'price_hl' ? 'price' : value.sort === 'name_az' || value.sort === 'name_za' ? 'name' : ''
    const {
      selectedCity,
      selectedDistance,
      searchLatLng,
      selectedOption,
      attribute,address,
      is_register, catId, searchItem,topAttributes,checkAttributes
    } = this.state;
    let temp = {};
    const me = this.props
    let allAttributes = [...checkAttributes,...attribute, ...topAttributes]
    console.log('allAttributes',allAttributes)
    Object.keys(value).filter(function (key, index) {
      if (value[key] !== undefined && value[key]) {
        allAttributes.map((el, index) => {
          if (el.att_name == key) {
            let att = allAttributes[index];
            console.log('att',att)
            let dropDropwnValue;
            if (att.attr_type_name === "Drop-Down" && key !== 'Registered' && key !=='Exclude Under Offer') {
              let selectedValueIndex = att.value.findIndex(
                (el) => el.id == value[key]
              );
              dropDropwnValue = att.value[selectedValueIndex];
              //Child attribute logic

              if (att.have_children) {
                const requestData = {
                  attributeValueid: dropDropwnValue.id,
                  attribute_id: att.att_id
                }
                console.log('att.have_children', requestData)
                me.getChildInput(requestData, res => {
                  if (res.status === 200) {
                    let data = res.data.data
                    const childData = res.data.data && Array.isArray(res.data.data.value) ? res.data.data.value : []
                    Object.keys(value).filter(function (key, index) {
                      if (data.att_name === key) {
                        let selectedValueIndex = childData.findIndex((el) => (el.id == value[key]))
                        dropDropwnValue = childData[selectedValueIndex]
                        temp[data.att_id] = {
                          attr_type_id: data.attr_type,
                          attr_value: (data.attr_type_name === 'Drop-Down') ? dropDropwnValue.id : value[key],
                          parent_value_id: dropDropwnValue.attribute_value_id ? dropDropwnValue.attribute_value_id : 0,
                          parent_attribute_id: (data.attr_type_name === 'Drop-Down') ? dropDropwnValue.attribute_parent_id : 0,
                          attr_type_name: data.attr_type_name
                        };
                      }
                    })
                  }
                })
              }
            }
            temp[att.att_id] = {
              name: att.att_name,
              attr_type_id: att.attr_type,
              attr_value:
                att.attr_type_name === "Drop-Down" && key !== 'Registered' && key !=='Exclude Under Offer'
                  ? dropDropwnValue.id
                  : att.attr_type_name === "calendar"
                    ? moment(value[key]).format("MMMM Do YYYY, h:mm:ss a")
                    : value[key],
              parent_value_id: 0,
              parent_attribute_id:
                att.attr_type_name === "Drop-Down" ? att.att_id : 0,
              attr_type_name: att.attr_type_name,
            };
          }else if(el.combine_label_1 === key || el.combine_label_2 === key){
            console.log('allFormValue',allFormValue)
            let att = allAttributes[index];
            temp[att.att_id] = {
              name: att.att_name,
              attr_type_id: att.attr_type,
              attr_value: `${allFormValue[el.combine_label_1]},${allFormValue[el.combine_label_2]}`,
              parent_value_id: 0,
              parent_attribute_id:
              att.attr_type_name === "Drop-Down" ? att.att_id : 0,
              attr_type_name: att.attr_type_name,
            };
          }
          console.log('temp',temp)
        });
      }
    });
    let reqData = {
      user_id: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
      name: searchItem ? searchItem : '',
      categoryid : selectedOption && selectedOption.catid ? selectedOption.catid : catId,
      price_min: value.price_min == undefined ? "" : value.price_min,
      price_max: value.price_max == undefined ? "" : value.price_max,
      location: searchLatLng ? searchLatLng : '',
      distance: selectedDistance ? selectedDistance : '',
      attributes : temp ? temp : '',
      order: order ? order : '',
      order_by: order_by ? order_by : '',
      postwithin: value.listed_date ? value.listed_date : '',
      is_register: is_register ? is_register : ''
    };
    if (address) {
      reqData.address = address.full_add;
      reqData.lat = address.latLng.lat;
      reqData.lng = address.latLng.lng;
      reqData.usr_state = address.state;
      reqData.usr_city = address.city;
      reqData.usr_pcode = address.p_code;
    }
    if(reqData.name === '' && reqData.price_min === '' && reqData.price_max === '' && reqData.location === '' && reqData.distance === '' && Object.keys(reqData.attributes).length ===0 && reqData.order_by === '' && reqData.postwithin === ''){
      toastr.warning(langs.warning, langs.messages.mandate_filter);
      return true
    }
    console.log('reqData',reqData)
    const formData = new FormData()
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == 'object') {
        formData.append(key, JSON.stringify(reqData[key]))
      } else {
        formData.append(key, reqData[key])
      }
    })
    this.props.enableLoading();
    // this.props.classifiedGeneralSearch(reqData, (res) => {
    this.props.applyClassifiedFilterAttributes(formData, (res) => {
      console.log("reqData:%  >", reqData);
      this.props.disableLoading();
      if (Array.isArray(res.data)) {
        this.props.handleSearchResponce(res.data, false, reqData);
        let reqData2 = {
          module_type: 2,
          category_id: selectedOption && selectedOption.catid ? selectedOption.catid : catId,
          keyword: searchItem ? searchItem : selectedOption ? selectedOption.title : '',
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
    // }
  };

  /**
    * @method toggleMoreOption
    * @description toggle more options
    */
  toggleMoreOption = () => {
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    console.log('currentField>>>>', currentField)
    this.setState({
      isMoreOption: !this.state.isMoreOption,
    })
    console.log('isMoreOption', this.state.isMoreOption)
  }

  /**
   * @method renderPrizeOptions
   * @description renderPrizeOptions component
   */
  renderPrizeOptions = (prizeOptions) => {
    let parameter = this.props.match.params;
    let sub_cat_name = parameter.subCategoryName
    let label = sub_cat_name === 'Commercial Real Estate' ? 'p.a.' : sub_cat_name === 'Residential Real Estate' ? 'p.w.' : ''
    return prizeOptions.map((el, i) => {
      return (
        <Option key={i} value={el.value}>
          {`${el.label}`}
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
   * @method handleCheck
   * @description handle mobile check uncheck
   */
  handleValueChange = (value) => {
    const parameter = this.props.match.params
    let priceList = getPriceOption(parameter.categoryName, parameter.subCategoryName)
    console.log('value',value)
    if(Number(value) === Number(3284) || Number(value) === Number(3285)){
      this.setState({prizeOptions: COMMERTIAL_BUY_SOLD})
    }else if(Number(value) === Number(3041) || Number(value) === Number(3042)) {
      this.setState({prizeOptions: RESIDENCIAL_BUY_SOLD})
    }else {
      this.setState({prizeOptions: priceList})
    }
  }

  renderMinPrice = (key) => {
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    const { prizeOptions,selectedMaxPrice} = this.state
    return (
      <div className={currentField['price_min']  ? "floating-label" : ''}>
        <Form.Item
          //noStyle
          name='price_min'
          label="Price Min."
        >
          <Select allowClear 
          className={ key == "group" ? "left-selct-list" : "left-selct-listdd"}
            dropdownMatchSelectWidth={false}
            onChange={(el) => {

              this.setState({ selectedMinPrice: el });
              if(selectedMaxPrice){
                this.formRef.current.setFieldsValue({
                  price_max: "",
                });
              }
            }}
            placeholder="Price Min."
          >
            {this.renderPrizeOptions(prizeOptions)}
          </Select>
        </Form.Item>
      </div>
    )
  }

  renderMaxPrice = (key) => {
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    return (
      <div className={currentField['price_max']  ? "floating-label" : ''}>
      <Form.Item
        //noStyle
        name='price_max'
        label="Price Max."
      >
        {/* <Input placeholder={'Price Max.(AU$)'} type={'number'} /> */}
        <Select dropdownMatchSelectWidth={false} placeholder="Price Max." allowClear  className={ key == "group" ? "right-selct-list" : "right-selct-listdd"} onChange={(el) => this.setState({selectedMaxPrice:el})}>
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
                {`${el.label}`}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      </div>
    )
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedMaxPrice,prizeOptions,address,salaryMax, salaryMin,isMoreOption,
      isvisible, isInputVisible, is_register, topAttributes, register,subCategoryId
    } = this.state;
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    let parameter = this.props.match.params;
    console.log('isInputVisible',subCategoryId)
    let sub_cat_name = parameter.subCategoryName
    let temp = topAttributes && topAttributes.length ? topAttributes : ''
    let first = temp && temp[0];
    let second = temp && temp.length > 1 && temp[1]
    const { showMoreOption = false, landingPage, template,slug } = this.props;
    // console.log('slug', slug)
    let dynamicClass = first && second ? 'four' : first && !second ? 'three' : template == 'realestate' || template == 'job' ? 'two' : 'three'
    let visible = false
    let cat_name = parameter.categoryName
    console.log('cat_name', cat_name)
    if(slug === 'Books & Music' || slug === 'Pets' || slug === 'Community' || slug === 'Electronics' || slug === 'Home & Garden'){
      visible = true
    }else if(cat_name === 'Books & Music' || cat_name === 'Pets' || cat_name === 'Community' || cat_name === 'Electronics' || cat_name === 'Home & Garden'){
      visible = true
    }else {
      visible = false
    }
    //let flag = cat_name === 'Automotive'
    let flag = true
    return (
      <div
        //className="location-search-wrap real-state cl-location-search-wrap-four-field cl-subcategory-pages-search-wrap"
        className={`location-search-wrap real-state cl-location-search-wrap-${dynamicClass}-field cl-subcategory-pages-search-wrap`}
      >
        <Form
          ref={this.formRef}
          name="location-form"
          className="location-search"
          layout={"inline"}
          onFinish={this.handleSearch}
        >
          <Form.Item style={{ width: "calc(100% - 50px)", maxWidth: "757px", marginLeft: "0", borderRadius:"4px", overflow:"hidden" }} className="keyword-search">
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
                {/* <Input placeholder={'Enter Keyword Search'} /> */}
              </Form.Item>
              {first && <Form.Item noStyle name={first.att_name} >
                <Select allowClear
                  style={{ width: "22%", maxWidth: "160px"}}
                  placeholder={first.att_name}
                  className={template === 'job' ? 'job-bdr-right' : ''}
                  dropdownMatchSelectWidth={false}
                >
                  {this.renderOptions(first.value)}
                </Select>
              </Form.Item>}
              <Form.Item name={"location"} noStyle>
                <PlacesAutocomplete
                  name="address"
                  handleAddress={this.handleAddress}
                  addressValue={address && address.full_add}
                  clearAddress={(add) => {
                    this.setState({
                      address: '',searchLatLng: ''
                    })
                  }}
                  style={{ borderLeft:"2px solid #AAB1B6" }}
                />
              </Form.Item>
              {second && <Form.Item noStyle name={second.att_name}>
                <Select
                  style={{ width: "17%", maxWidth: "150px" }}
                  placeholder={second.att_name}
                  dropdownMatchSelectWidth={false}
                  onChange={this.handleValueChange}
                >
                  {this.renderOptions(second.value)}
                </Select>
              </Form.Item>}
              {(template == 'general' || landingPage) && <Form.Item name={"distance"} noStyle>
                <Select allowClear
                  dropdownMatchSelectWidth={false}
                  onChange={(e) => {
                    this.setState({ selectedDistance: e });
                  }}
                  //defaultValue={selectedDistance}
                  style={{ width: "18%", maxWidth: "150px", borderLeft: "1px solid #AAB1B6" }}
                  placeholder="0 KM"
                >
                  {this.renderDistanceOptions()}
                </Select>
              </Form.Item>}
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                shape={"circle"}
                htmlType={'submit'}
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
              {console.log('enter in show')}
              {isMoreOption &&
                <div >
                  {<Row gutter={[10, 0]} className='location-more-form'>
                  {template !== 'job' && 
                  // (slug === 'cars-vans' || slug === 'motorcycle' || slug === 'caravan-campers') ? <Col md={6}>
                  //     <div className="input-grp-compact">
                  //       <Row gutter={0}>
                  //         <Col md={12} >
                  //           {this.renderMinPrice("group")}
                  //         </Col>
                  //         <Col md={12} >
                  //           {this.renderMaxPrice("group")}
                  //         </Col>
                  //       </Row>
                  //     </div></Col>:
                      <>
                      {template !== 'job' &&<Col md={flag ? 6 : 12}>
                        {this.renderMinPrice()}
                      </Col>}
                      {template !== 'job' && <Col md={flag ? 6 : 12}>
                      {this.renderMaxPrice()}
                    </Col>}
                    </>}
                    {(isInputVisible || visible ) && <Col md={flag ? 6 : 12}>
                    <div className={currentField['sort']  ? "floating-label" : ''}>
                      <Form.Item
                        //noStyle
                        name='sort'
                        label='sort' 
                      >
                        <Select dropdownMatchSelectWidth={false} placeholder='Sort' allowClear onChange={() => this.setState({isFloated:true})}>
                          <Option value='price_lh'>Price: Low to High</Option>
                          <Option value='price_hl'>Price: High to Low</Option>
                          <Option value='name_az'>Name: A to Z</Option>
                          <Option value='name_za'>Name: Z to A</Option>
                        </Select>
                      </Form.Item>
                      </div>
                    </Col>}

                    {(((isInputVisible && subCategoryId === undefined) || parameter.all === langs.key.all) || visible)&& <Col md={flag ? 6 : 12}>
                    <div className={currentField['listed_date']  ? "floating-label" : ''}>
                      <Form.Item
                        //noStyle
                        name='listed_date'
                        className="w-100"
                        label='Listed'
                      >
                        <Select dropdownMatchSelectWidth={false} placeholder='Listed' allowClear  onChange={() => this.setState({isFloated:true})}>
                          <Option value={'1-10'}>1 - 10 Days</Option>
                          <Option value={'10-20'}>10 - 20 Days</Option>
                          <Option value={'20-30'}>20 - 30 Days</Option>
                        </Select>
                      </Form.Item>
                      </div>
                    </Col>}
                    {flag && this.renderItem()}
                    {template === 'job' &&<Col md={6} >
                      <div className="input-grp-compact">
                        <Row gutter={0}>
                        <Col md={12} >
                        <div className={currentField['price_min']  ? "floating-label" : ''}>
                      <Form.Item
                        //noStyle
                        name='price_min'
                        label="Min"
                      >
                        <Select dropdownMatchSelectWidth={false} className="left-selct-list" allowClear
                          onChange={(el) => {
                            
                            this.setState({ selectedMinPrice: el });
                            if(selectedMaxPrice){
                              this.formRef.current.setFieldsValue({
                                price_max: "",
                              });
                            }
                          }}
                          placeholder="Min"
                        >
                          {this.renderPrizeOptions(salaryMin)}
                        </Select>
                      </Form.Item>
                      </div>
                        </Col>
                        <Col md={12} >
                        <div className={currentField['price_max']  ? "floating-label" : ''}>
                      <Form.Item
                        //noStyle
                        name='price_max'
                        label="Max"
                      >
                        <Select dropdownMatchSelectWidth={false}  className="right-selct-list" placeholder="Max" allowClear onChange={(el) => this.setState({selectedMaxPrice:el})}>
                          {this.state.salaryMin.map((el, i) => {
                            let disable = false;
                            if (
                              this.state.selectedMinPrice &&
                              this.state.selectedMinPrice > el.value
                            ) {
                              disable = true;
                            }
                            return (
                              <Option disabled={disable} key={i} value={el.value}>
                                {el.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      </div>
                        </Col>
                        </Row>
                      </div>
                    </Col>}
                    {((subCategoryId !== undefined && template === 'realestate') || template === 'job') && <Col md={6}>
                    <div className={currentField['listed_date']  ? "floating-label" : ''}>
                      <Form.Item
                        //noStyle
                        name='listed_date'
                        className="w-100"
                        label='Listed'
                      >
                        <Select dropdownMatchSelectWidth={false} placeholder='Listed' allowClear onChange={() => this.setState({isFloated:true})}>
                          <Option value={'1-10 Days'}>1-10 Days</Option>
                          <Option value={'10-20 Days'}>10 -20 Days</Option>
                          <Option value={'20-30 Days'}>20-30 Days</Option>
                        </Select>
                      </Form.Item>
                      </div>
                    </Col>}
                  </Row>}
                </div>
              }
              <div className='location-more-option'>
                <a onClick={() => this.toggleMoreOption()} className={!isMoreOption && 'active'}>
                  {!isMoreOption ? 'More Options' : 'Less Options'}
                </a>
                {this.state.isMoreOption && <a onClick={this.resetSearch}>
                <CloseOutlined className="clr-filer-icon" />{'Clear Filter'}
                </a>}
               <div className='show-on-myad checkbox-width-block'>
               {register && isMoreOption && template === 'general' && <Form.Item name='Registered' valuePropName='checked'>
                    <Checkbox onChange={this.handleCheck}> {parameter.subCategoryName === 'Motorcycle' ? 'Registered' : 'Registered Cars Only'}</Checkbox>
                  </Form.Item>}
                  {register && isMoreOption && template === 'realestate' && <Form.Item name='Exclude Under Offer' valuePropName='checked'>
                    <Checkbox onChange={this.handleCheck}> {'Exclude Under Offer'}</Checkbox>
                  </Form.Item>}
                </div>
              </div>
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
  getClassifiedDynamicInput,
  applyClassifiedFilterAttributes,
  getChildInput
})(withRouter(GeneralClassifiedGeneral));
