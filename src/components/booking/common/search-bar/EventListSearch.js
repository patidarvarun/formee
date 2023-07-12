import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Input, Select, Button, Row, Col, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
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
            selectedOption: '',
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
            this.formRef.current && this.formRef.current.resetFields();
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
     * @method resetSearch
     * @description Use to reset Search bar
     */
    renderNumberOfAttendees = () => {
        let temp = []
        for(let i=1; i<=200; i++){
            temp.push(i)
        }
        return temp.map((el, i) => {
            return (
                <Option key={i} value={el}>{el}</Option>
            )
        })
    }

    /** 
    * @method handleSearch
    * @description Call Action for Classified Search
    */
    handleSearch = (values) => {
        const { tabkey } = this.props
        let parameter = this.props.match.params;
        const {searchItem, selectedEvent, selectedCity, selectedDistance, selectedDietery, searchLatLng, selectedOption } = this.state;
        let sub_cat_id = this.props.match.params.subCategoryId
        let reqData = {
            keyword: searchItem ? searchItem : '',
            cat_id: selectedOption ? selectedOption.catid : parameter.categoryId ,
            location: searchLatLng ? searchLatLng : '',
            lat:searchLatLng.lat ? searchLatLng.lat : '',
            lng:searchLatLng.lng ? searchLatLng.lng : '',
            distance: selectedDistance ? selectedDistance : '',
            event_type_id: selectedEvent ? selectedEvent.id : '',
            dietary_ids: values.dietary_ids ? values.dietary_ids : '',
            userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
            number_of_people: values.number_of_people ? values.number_of_people : '',
            sub_cat_id: sub_cat_id,
            filter: 'top_rated',
            entertainment_id: values.entertainment_id ? values.entertainment_id : '',
            sort: (values.sort === 'price_high' || values.sort === 'price_low') ? 'price' : values.sort ? values.sort : '',
            sort_order: values.sort ? (values.sort === 'price_high' ? 'desc' : 'asc') : '', 
        }
        if(reqData.keyword === '' && reqData.location === '' && reqData.distance === '' && reqData.event_type_id === '' && reqData.dietary_ids === '' && reqData.number_of_people === '' && reqData.sort === ''){
            toastr.warning(langs.warning, langs.messages.mandate_filter);
            return true
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
                    this.props.addCallForPopularSearch(reqData2, (res) => {});
                }
            }
            else {
                this.props.handleSearchResponce([], false, reqData);
            }
        })
    }

    setFloating = () => {
        this.setState({isFloated: true})
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        let parameter = this.props.match.params;
        let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
        const { isShowMore, sub_cat_name } = this.state;
        const { eventTypes, dietaries,landingPage} = this.props
        let dynamicClass = landingPage === undefined ? 'event-list-search' : ''
        let isVisible = false
        if(sub_cat_name === 'Entertainment' && !isShowMore){
            isVisible = true
        }else if(sub_cat_name === langs.key.caterers || sub_cat_name === langs.key.venues ){
            isVisible = true
        }else {
            isVisible = false
        }
        let isOtherEvents = sub_cat_name !== 'Entertainment' && sub_cat_name !== langs.key.caterers && sub_cat_name !== langs.key.venues 
        return (
            <div className={`location-search-wrap booking-location-search-wrap ${dynamicClass}`}>
                <Form
                    ref={this.formRef}
                    name="location-form"
                    className="location-search"
                    layout={"inline"}
                    onFinish={this.handleSearch}
                >
                    <Form.Item style={{ width: "calc(100% - 205px)" }}>
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
                                    placeHolder="Enter Keyword Search" 
                                />
                            </Form.Item>
                            <Form.Item name={"location"} noStyle>
                                <PlacesAutocomplete
                                    name="address"
                                    handleAddress={this.handleAddress}
                                    addressValue={this.state.address}
                                    clearAddress={(add) => {
                                        this.setState({
                                            address: '',searchLatLng: ''
                                        })
                                    }}
                                />
                            </Form.Item>
                            {/* {(isVisible || landingPage)  && <Form.Item noStyle name="eventTypes_ids" >
                                <Select allowClear
                                    onChange={(e) => {
                                        this.setState({ selectedEvent: e });
                                    }}
                                    className="event-type-filter"
                                    placeholder='Event Types'
                                    style={{ width: '24%', maxWidth: '200px' }}
                                >
                                    {this.renderEventTypes(eventTypes)}
                                </Select>
                            </Form.Item>} */}
                            <Form.Item
                                name={'distance'}
                                noStyle
                            >
                                <Select allowClear onChange={(e) => {
                                    this.setState({ selectedDistance: e })
                                }} defaultValue={this.state.selectedDistance} style={{ width: '19%', maxWidth: '150px' }} placeholder='0 KM'>
                                    {this.renderDistanceOptions()}
                                </Select>
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
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
                        <Row gutter={[10, 0]} className='location-more-form'>
                            {((!isOtherEvents && sub_cat_name !== 'Entertainment') || landingPage)  &&
                            <Col md={12} className="mrg-top-space">
                            <div className={currentField['number_of_people']  ? "floating-label" : ''}>
                                <Form.Item 
                                    //noStyle 
                                    name="number_of_people"
                                    label='Number of attendees'
                                >
                                    <Select allowClear  onChange={this.setFloating}
                                        placeholder='Number of attendees'
                                        style={{ width: "100%" }}
                                    >
                                        {this.renderNumberOfAttendees()}
                                    </Select>
                                </Form.Item>
                            </div>
                            </Col>}
                            {(landingPage || sub_cat_name === langs.key.caterers || sub_cat_name === langs.key.venues) && <Col md={12} className="mrg-top-space">
                                <div className={currentField['dietary_ids']  ? "floating-label" : ''}>
                                <Form.Item 
                                    //noStyle 
                                    name="dietary_ids"
                                    label='Dietary requirements'
                                >
                                    <Select allowClear
                                        onChange={(e) => {
                                            this.setState({ selectedDietery: e });
                                        }}
                                        placeholder='Dietary requirements'
                                        style={{ width: "100%" }}
                                    >
                                        {this.renderEventDietary(dietaries)}
                                    </Select>
                                </Form.Item>
                                </div>
                            </Col>}
                            {(sub_cat_name === 'Entertainment' || (isOtherEvents && landingPage === undefined)) && <Col md={12} className="mrg-top-space">
                            <div className={currentField['eventTypes_ids']  ? "floating-label" : ''}>
                                <Form.Item 
                                    //noStyle 
                                    name="eventTypes_ids" 
                                    label='Event Types'
                                >
                                    <Select allowClear
                                        onChange={(e) => {
                                            this.setState({ selectedEvent: e });
                                        }}
                                        className="event-type-filter"
                                        placeholder='Event Types'
                                        style={{ width: "100%" }}
                                    >
                                        {this.renderEventTypes(eventTypes)}
                                    </Select>
                                </Form.Item>
                            </div>
                            </Col>}
                            {isOtherEvents && landingPage === undefined && 
                            <Col md={12} className="mrg-top-space">
                            <div className={currentField['sort']  ? "floating-label" : ''}>
                                <Form.Item
                                    //noStyle
                                    name='sort'
                                    label='Sort By'
                                >
                                    <Select placeholder='Sort By' allowClear  onChange={this.setFloating}>
                                        <Option value='price_high'>Price (High-Low)</Option>
                                        <Option value='price_low'>Price (Low-High)</Option>
                                        <Option value='rating'>Rating</Option>
                                        <Option value='most_viewed'>Most Reviewed</Option>
                                        <Option value='name'>Name List A-Z</Option>
                                        <Option value='distance'>Distance</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            </Col>}
                            {sub_cat_name === 'Entertainment' && 
                            <Col md={12} className="mrg-top-space">
                            <div className={currentField['type_of_Entertainment_ids']  ? "floating-label" : ''}>
                                <Form.Item 
                                    //noStyle 
                                    name="type_of_Entertainment_ids"
                                    label='Type of Entertainment'
                                >
                                    <Select allowClear  onChange={this.setFloating}
                                        placeholder='Type of Entertainment'
                                        style={{ width: "100%" }}
                                    >
                                        <Option value="Theatre">Theatre</Option>
                                        <Option value="Cinema and film">Cinema and film</Option>
                                        <Option value="Dance">Dance</Option>
                                        <Option value="Magic">Magic</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            </Col>}
                        </Row>
                    )}
                    {(isVisible || landingPage || isOtherEvents || sub_cat_name === 'Entertainment') &&<div className="location-more-option">
                        <div className='booking-checkbox-width-block'>&nbsp;</div>
                        <div className='right'>
                            {isShowMore && <a onClick={this.resetSearch}>
                            <CloseOutlined className="clr-filer-icon" />{'Clear Filter'}
                            </a>}
                            <a
                                onClick={this.toggleMoreOption.bind(this)}
                                className={`ml-20 ${!this.state.isMoreOption && "active"}`}
                            >
                                {!isShowMore ? "More Options" : "Less Options"}
                            </a>
                        </div>
                    </div>}
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


