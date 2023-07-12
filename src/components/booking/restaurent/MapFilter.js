import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchByRestaurent, enableLoading, disableLoading } from '../../../actions';
import { DatePicker, Form, Input, Select, Button } from 'antd'
import '../../common/mapView.less';
import { getFilterRoute } from '../../../common/getRoutes'
import PlacesAutocomplete from '../../common/LocationInput'
import { withRouter } from 'react-router'
import AutoComplete from '../common/search-bar/RestaurantAutoComplete';
import { langs } from '../../../config/localization';
import { getThisMonthDates, getThisWeek, currentDate } from '../../common'
const { Option } = Select;
const { RangePicker } = DatePicker

class MapFilter extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            classifiedList: [],
            searchItem:'',
            isFilter: true,
            isProCard: true,
            selectedDistance: 0,
            searchKey: '',
            isSearch: false,
            filteredData: [],
            distanceOptions: [0, 5, 10, 15, 20],
            isSearchResult: false,
            searchLatLng: '',
            selectedOption: '',
            isvisible: false,from_date: '', to_date: '',
            date: ''
        };
    }
    /**
     * @method toggleFilter
     * @description toggle the filter
     */
    toggleFilter() {
        this.setState({
            isFilter: true
        })
    }

    /**
     * @method toggleProCard
     * @description toggeled the pro card
     */
    toggleProCard() {
        this.setState({
            isFilter: false
        })
    }

    /**
     * @method applyFilter
     * @description apply filter
     */
    applyFilter = (values) => {
        const { searchItem,searchLatLng } = this.state
        let reqData = {
            userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
            cusines: Array.isArray(values.cusines) && values.cusines.length ? values.cusines.toString() : '',
            dietry: Array.isArray(values.dietry) && values.dietry.length ? values.dietry.toString() : '',
            item_name:  searchItem ? searchItem : '' ,
            latitude: searchLatLng ? searchLatLng.lat : '' ,
            longitude: searchLatLng ? searchLatLng.lng : '',
            open_now: false,
            kilometer: values.distance ? values.distance : '',
            service: values.order_type ? values.order_type : '',
            location: searchLatLng ? searchLatLng : '',
            page_size: 9,
            page: 1
        }
        this.props.enableLoading()
        this.props.searchByRestaurent(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                if (Array.isArray(res.data.data)) {
                    this.props.handleFilters(res.data.data)
                    this.setState({ bookingList: res.data.data })
                }
            } else {
                this.props.handleFilters([])
            }
        })
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
    * @method handleAddress
    * @description handle address change Event Called in Child loc Field 
    */
    handleAddress = (result, address, latLng) => {
        let state = '';
        let city = '';
        let p_code = '';
        result.address_components.map((el) => {

            if (el.types[0] === 'administrative_area_level_1') {
                state = el.long_name
            } else if (el.types[0] === 'administrative_area_level_2') {
                city = el.long_name
            } else if (el.types[0] === 'postal_code') {
                p_code = el.long_name
            }
        })

        this.setState({
            searchLatLng:latLng,
            address: {
                full_add: address,
                latLng,
                state,
                city,
                p_code
            }
        })
    }

    
    /** 
    * @method render
    * @description render component 
    */
    render() {
        const { classifiedList, selectedDistance, isProCard, isvisible } = this.state;
        const { foodTypes, dietaries } = this.props
        let parameter = this.props.match.params;
        let categoryName = parameter.categoryName
        let subCategoryName = parameter.subCategoryName
        let allData = parameter.all === langs.key.all ? true : false
        let redirectUrl = getFilterRoute(parameter.categoryName, parameter.categoryId, parameter.subCategoryName, parameter.subCategoryId, allData)
        //let redirectUrl = `/classifieds/filter/${parameter.categoryName}/${parameter.categoryId}/${parameter.subCategoryName}/${parameter.subCategoryId}`
       
        if(!this.props.isFilter){
            return true
        }
        return (
            <Form
                layout='vertical'
                className='map-filter'
                ref={this.formRef}
                onFinish={this.applyFilter}
            >
                <Form.Item label='Keyword' name='name' >
                    <AutoComplete 
                        handleSearchSelect={(option) => {
                            this.setState({ selectedOption: option })
                        }}
                        handleValueChange={(value) => {
                            this.setState({ searchItem: value });
                        }}
                    />
                </Form.Item>
                <Form.Item name='order_type' label='Service Type'>
                    <Select  placeholder='Delivery' allowClear>
                        <Option value="delivery">Delivery</Option>
                        <Option value="take_away">Pick Up</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name='address'
                    label={'Location'}
                >
                    <div className="map-location">
                        <PlacesAutocomplete
                            name='address'
                            handleAddress={this.handleAddress}
                            addressValue={this.state.address}
                            clearAddress={(add) => {
                                this.setState({
                                    address: '',searchLatLng: ''
                                })
                            }}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    name='distance'
                    label={'Distance'}
                >
                    <Select onChange={(e) => {
                        this.setState({ selectedDistance: e })
                    }} defaultValue={selectedDistance} placeholder='0 KM'>
                        {this.renderDistanceOptions()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name='cusines'
                    label='Service Type'
                >
                    <Select placeholder='Cuisine' allowClear>
                        {foodTypes && foodTypes.length &&
                            foodTypes.map((el, i) => {
                            return (
                                <Option key={i} value={el.id}>{el.name}</Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name='dietry'
                    label='Service Type'
                >
                    <Select placeholder='Dietry Requirements'  allowClear >
                        {dietaries && dietaries.length &&
                            dietaries.map((keyName, i) => {
                            return (
                                <Option key={keyName.id} value={keyName.id}>{keyName.name}</Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item className='align-center' >
                    <Button type='default' htmlType='submit'>
                        Search
                    </Button>
                </Form.Item>
            </Form >
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, common,bookings } = store;
    const { location } = common;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        lat: location ? location.lat : '',
        long: location ? location.long : '',
        foodTypes: Array.isArray(bookings.foodTypes) ? bookings.foodTypes : [],
        dietaries: bookings.dietary && Array.isArray(bookings.dietary.data) ? bookings.dietary.data : [],
    };
};
export default connect(
    mapStateToProps,
    {searchByRestaurent, enableLoading, disableLoading }
)(withRouter(MapFilter));
