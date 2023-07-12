import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getClassfiedCategoryListing, newInBookings, enableLoading, disableLoading, openLoginModel, getChildCategory, applyClassifiedFilterAttributes } from '../../../actions';
import { Col, Space,DatePicker, Typography, Form, Input, Select, Button } from 'antd'
import '../../common/mapView.less';
import { getFilterRoute } from '../../../common/getRoutes'
import PlacesAutocomplete from '../../common/LocationInput'
import { withRouter } from 'react-router'
import AutoComplete from '../common/search-bar/CommonAutoComplete'
import { TEMPLATE } from '../../../config/Config'
import { langs } from '../../../config/localization';
import { getThisMonthDates, getThisWeek, currentDate } from '../../common'
const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker

class MapFilter extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            classifiedList: [],
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
            // isFilter: false,
            // isProCard: false,
            isFilter: true
        })
    }

    /**
     * @method toggleProCard
     * @description toggeled the pro card
     */
    toggleProCard() {
        this.setState({
            // isFilter: true,
            // isProCard: true,
            isFilter: false
        })
    }

    /**
     * @method applyFilter
     * @description apply filter
     */
    applyFilter = (value) => {
        
        const { loggedInDetail, isLoggedIn, lat, long } = this.props
        const { selectedOption,  from_date, to_date, date } = this.state
        let reqData = {
            cat_id: selectedOption.catid,
            distance: value.distance == undefined ? '' : value.distance,
            minimumPrice: value.minimumPrice == undefined ? '' : value.minimumPrice,
            maximumPrice: value.maximumPrice == undefined ? '' : value.maximumPrice,
            sort: value.sortBy == undefined ? '' : (value.sort === 'price_high' || value.sort === 'price_low') ? 'price' : value.sort ? value.sort : '',
            sort_order: value.sortBy == undefined ? '' : value.sort === 'price_high' ? 'DESC' : 'ASC',
            keyword: selectedOption.title,
            userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
            from_date: date ? date[0] : from_date ? from_date : '',
            to_date: date ? date[1] : to_date ? to_date : ''
        }
        if( value.sortBy === 'distance'){
            reqData.lat =  lat ? lat : isLoggedIn ? loggedInDetail.lat : ''
            reqData.lng = long ? long : isLoggedIn ? loggedInDetail.lng  : ''
        }
        
        this.props.enableLoading()
        this.props.newInBookings(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                this.props.handleFilters(data)
                this.setState({ bookingList: data })
            }else{
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
                // this.formRef.current.setFieldsValue({
                //     postal_code: el.long_name
                // });
            }
        })

        this.setState({
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
     * @method handleListedDateSelection
     * @description render component
     */
    handleListedDateSelection = (value) => {
        
        const { date } = this.state 
         if(value === 1){
            
            let today = currentDate()
            this.setState({isvisible: false, from_date:today,to_date: today, date: ''})
        }else if(value === 2){
            let this_week = getThisWeek()
            
            this.setState({isvisible: false, from_date:this_week.monday,to_date: this_week.sunday, date:'' })
        }else if(value === 3){
            let this_month = getThisMonthDates()
            
            this.setState({isvisible: false, from_date:this_month.fday,to_date: this_month.lday, date: ''})
        }else if(value === 4){
            this.setState({isvisible: true,from_date: '',to_date: '' }) 
        }

    }
    
    /** 
    * @method render
    * @description render component 
    */
    render() {
        const { classifiedList, selectedDistance, isProCard, isvisible } = this.state;
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
                onFinish={this.applyFilter}

            >
                
                <Form.Item label='Keyword' name='name' ref={this.formRef}>
                    {/* <Input placeholder='Enter keyword' /> */}
                    <AutoComplete 
                        handleSearchSelect={(option) => {
                            this.setState({ selectedOption: option })
                        }}
                        handleValueChange={(value) => {
                            this.setState({ searchItem: value });
                        }} 
                    />
                </Form.Item>
                {subCategoryName === langs.key.fitness && 
                    <Form.Item name='fitness_type' label='Fitness Type'>
                        <Select placeholder=''>
                            <Option value='Any'>Any</Option>
                            <Option value='Any'>Any</Option>
                        </Select>
                    </Form.Item>}
                <Form.Item label='Location'>
                    <Input.Group compact>
                        <Form.Item
                            name='address'
                            noStyle
                        // rules={[{ required: true, message: 'Street is required' }]}
                        >
                            <div style={{ width: 'calc(100% - 81px)' }} className="map-location">
                                <PlacesAutocomplete
                                    name='address'
                                    handleAddress={this.handleAddress}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item
                            noStyle
                            name='distance'
                        >
                            <Select onChange={(e) => {
                                this.setState({ selectedDistance: e })
                            }} defaultValue={selectedDistance} style={{ width: '36%', minWidth: '85px', maxWidth: '150px' }} placeholder='0 KM'>
                                {this.renderDistanceOptions()}
                            </Select>
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                

                {(categoryName !== TEMPLATE.WELLBEING && categoryName !== TEMPLATE.BEAUTY ) && 
                    <Form.Item name='minimumPrice' label='Price'>
                        <Input placeholder='Price Min. (AU$)' type='number' />
                </Form.Item>}
                {(categoryName !== TEMPLATE.WELLBEING && categoryName !== TEMPLATE.BEAUTY) && 
                    <Form.Item name='maximumPrice'>
                        <Input placeholder='Price Max. (AU$)' type={'number'}/>
                    </Form.Item>}
                <Form.Item name='sortBy' type='number' label='Sort'>
                    <Select allowClear>
                    <Option value='price_high'>Price (High-Low)</Option>
                    <Option value='price_low'>Price (Low-High)</Option>
                    <Option value='rating'>Rating</Option>
                    <Option value='most_viewed'>Most Reviewed</Option>
                    <Option value='name'>Name List A-Z</Option>
                    <Option value='distance'>Distance</Option>
                    </Select>
                </Form.Item>
                {(categoryName !== TEMPLATE.WELLBEING && categoryName !== TEMPLATE.BEAUTY) &&
                    <Form.Item name='listedDate' label='Listed date'>
                       <Select placeholder='Listed date' onChange ={this.handleListedDateSelection} allowClear>
                            <Option value={1}>24 Hrs</Option>
                            <Option value={2}>Week</Option>
                            <Option value={3}>Month</Option>
                            <Option value={4}>Custom </Option>
                        </Select>
                    </Form.Item>}
                    {isvisible &&
                            <Col md={12}>
                                <Form.Item
                                    noStyle
                                    name='custum'
                                >
                                    <Space direction="vertical" size={12}>
                                        <RangePicker  onChange={(date, dateString) => this.setState({date:dateString }) }/>
                                    </Space>
                                </Form.Item>
                            </Col>}
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
    const { auth, common } = store;
    const { location } = common;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        lat: location ? location.lat : '',
        long: location ? location.long : ''
    };
};
export default connect(
    mapStateToProps,
    { getClassfiedCategoryListing, openLoginModel, enableLoading, disableLoading, newInBookings, getChildCategory, applyClassifiedFilterAttributes }
)(withRouter(MapFilter));
