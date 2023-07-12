import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Input, Select, Button, Row, Col, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import Icon from "../../../customIcons/customIcons";
import {
  newInBookings,
  addCallForPopularSearch,
  enableLoading,
  disableLoading,
} from "../../../../actions";
import AutoComplete from './CommonAutoComplete';
import PlacesAutocomplete from "./../../../common/LocationInput";
import { getIpfromLocalStorage } from '../../../../common/Methods'
let ipAddress = getIpfromLocalStorage();
const { Option } = Select;

class EventSearch extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      selectedDistance: 0,
      searchKey: '',
      isSearch: false,
      filteredData: [],
      distanceOptions: [0, 5, 10, 15, 20],
      isSearchResult: false,
      searchLatLng: '',
      selectedOption: {},
      selectedCity: '',
      isMoreOption: false,
      selectedEvent: '',
      selectedDietery: '',
      isShowMore: false

    }
  }

  /**
    * @method componentWillReceiveProps
    * @description receive props
    */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial = this.props.match.params.categoryId
    let catIdNext = nextprops.match.params.categoryId
    let catNameNext = nextprops.match.params.categoryName
    let subCatIdInitial = this.props.match.params.subCategoryId
    let subCatIdNext = nextprops.match.params.subCategoryId
    let subCatNameNext = nextprops.match.params.subCategoryName
    if ((catIdInitial !== catIdNext) || (subCatIdInitial !== subCatIdNext)) {
      this.setState({ sub_cat_name: subCatNameNext, isShowMore: false })
    }
  }

  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    this.props.enableLoading()
    let parameter = this.props.match.params
    let sub_cat_name = this.props.match.params.subCategoryName;
    this.setState({ sub_cat_name: sub_cat_name })
  }

  /**   
  * @method renderDistanceOptions
  * @description render subcategory
  */
  renderDistanceOptions = () => {
    return this.state.distanceOptions.map((el, i) => {
      return (
        <Option key={i} value={el}>{el} KM</Option>
      );
    })
  }

  /**   
  * @method renderEventTypes
  * @description render event type
  */
  renderEventTypes = (eventTypes) => {
    if (eventTypes) {
      return eventTypes.map((el, i) => {
        return (
          <Option key={i} value={el.id}>{el.name}</Option>
        );
      })
    }
  }

  /**   
 * @method renderEventDietary
 * @description render event dietary
 */
  renderEventDietary = (eventTypes) => {
    if (eventTypes) {
      return eventTypes.map((el, i) => {
        return (
          <Option key={i} value={el.id}>{el.name}</Option>
        );
      })
    }
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
   * @method toggleMoreOption
   * @description toggle more options
   */
  toggleMoreOption() {
    this.setState({
      isShowMore: !this.state.isShowMore,
    });
  }

  /**
   * @method resetSearch
   * @description Use to reset Search bar
   */
  resetSearch = () => {
    this.setState({
      isSearchResult: false,
      selectedItems: [],
      searchKey: "",
      searchLatLng: "",
      selectedDistance: 0,
      selectedOption: {},
    });
    this.formRef.current.resetFields();
    this.props.handleSearchResponce("", true, {});
  };

  /** 
  * @method handleSearch
  * @description Call Action for Classified Search
  */
  handleSearch = (values) => {
    const { tabkey } = this.props
    const { selectedEvent, selectedCity, selectedDistance, selectedDietery, searchLatLng, selectedOption } = this.state;
    let sub_cat_id = this.props.match.params.subCategoryId
    let isEmpty = Object.keys(selectedOption).length === 0
    if (isEmpty) {
      toastr.warning(langs.warning, langs.messages.mandate_filter)
    } else {
      let reqData = {
        keyword: selectedOption.title,
        location: searchLatLng,
        distance: selectedDistance,
        event_type_id: selectedEvent ? selectedEvent.id : '',
        dietary_id: selectedDietery ? selectedDietery.id : '',
        userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
        number_of_people: values.number_of_people !== undefined ? values.number_of_people : '',
        sub_cat_id: sub_cat_id,
        filter: 'top-rated'
      }
      this.props.enableLoading()
      this.props.newInBookings(reqData, (res) => {
        this.props.disableLoading()
        if (res.status === 200) {
          if (Array.isArray(res.data.data)) {

            let total_record = res.data && res.data.total
            this.props.handleSearchResponce(res.data.data, false, reqData, total_record)
            let reqData2 = {
              module_type: 1,
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
          }
        }
        else {
          this.props.handleSearchResponce([], false, reqData);
        }
      })
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    let parameter = this.props.match.params;
    const { isShowMore, sub_cat_name } = this.state;
    const { eventTypes, dietaries } = this.props

    return (
      <div className='location-search-wrap booking-location-search-wrap'>
        {/* <button className="search-top">Search</button> */}
        <Form
          ref={this.formRef}
          name="location-form"
          className="location-search"
          layout={"inline"}
          onFinish={this.handleSearch}
        >
          {(sub_cat_name === langs.key.caterers || sub_cat_name === langs.key.venues || sub_cat_name === langs.key.entertainment) && <Form.Item style={{ width: "calc(100% - 150px)" }}>
            <Input.Group compact className="venus-form">
              <Form.Item
                noStyle
                name='name'
              >
                <AutoComplete className='suraj' 
                  handleSearchSelect={(option) => {
                    this.setState({ selectedOption: option })
                  }}
                  handleValueChange={(value) => {
                    this.setState({ searchItem: value });
                  }}  
                  placeHolder='What are you planning ?' 
                />
              </Form.Item>
              <Form.Item name={"location"} noStyle>
                <PlacesAutocomplete
                  name="address"
                  handleAddress={this.handleAddress}
                  addressValue={this.state.address}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>}
          {sub_cat_name !== langs.key.caterers && sub_cat_name !== langs.key.venues && sub_cat_name !== langs.key.entertainment &&
            <Form.Item style={{ width: "calc(100% - 150px)" }}>
              <Input.Group compact className="venus-form">
                {/* <Form.Item  name="name" className='suraj' >
              <Input  placeholder={'What are you planning ?'}/>
            </Form.Item> */}
                <Form.Item
                  noStyle
                  name='name'
                >
                  <AutoComplete className='suraj' 
                    handleSearchSelect={(option) => {
                    this.setState({ selectedOption: option })
                    }} placeHolder="Enter Keyword Search" 
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
                <Form.Item noStyle name="eventTypes_ids" >
                  <Select
                    onChange={(e) => {
                      this.setState({ selectedEvent: e });
                    }}
                    placeholder='Event Types'
                    style={{ width: '24%', maxWidth: '200px' }}
                  >
                    {this.renderEventTypes(eventTypes)}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={'distance'}
                  noStyle
                >
                  <Select onChange={(e) => {
                    this.setState({ selectedDistance: e })
                  }} defaultValue={this.state.selectedDistance} style={{ width: '15%', maxWidth: '110px' }} placeholder='0 KM'>
                    {this.renderDistanceOptions()}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>}
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary" shape={"circle"}>
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
          {isShowMore && (
            <Row gutter={[15, 10]} className="venu-less">
              <Col md={24}>
                <Form.Item noStyle name="eventTypes_ids" >
                  <Select
                    onChange={(e) => {
                      this.setState({ selectedEvent: e });
                    }}
                    placeholder='Event Types'
                    style={{ width: "100%" }}
                  >
                    {this.renderEventTypes(eventTypes)}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item noStyle name="dietery_ids">
                  <Select
                    onChange={(e) => {
                      this.setState({ selectedDietery: e });
                    }}
                    placeholder='Do you have any dietary requirements?'
                    style={{ width: "100%" }}
                  >
                    {this.renderEventDietary(dietaries)}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item noStyle name="number_of_people">
                  <Input placeholder='How many attendees' />
                </Form.Item>
              </Col>
            </Row>
          )}
          {(sub_cat_name === langs.key.entertainment || sub_cat_name === langs.key.caterers || sub_cat_name === langs.key.venues) &&
            <div className="location-more-option">
              <a
                onClick={this.toggleMoreOption.bind(this)}
                className={!this.state.isMoreOption && "active"}
              >
                {!isShowMore ? "More Options" : "Less Options"}
              </a>
            </div>
          }
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, bookings } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],
  };
}

export default EventSearch = connect(
  mapStateToProps,
  { newInBookings, addCallForPopularSearch, enableLoading, disableLoading }
)(withRouter(EventSearch));


