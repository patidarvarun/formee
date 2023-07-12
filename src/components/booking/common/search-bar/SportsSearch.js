import React, { Fragment } from 'react';
import moment from 'moment'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { Form, Input, Select, Button, Row, Col, Space, Cascader, Checkbox, DatePicker} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Icon from '../../../customIcons/customIcons';
import { getFilterRoute } from '../../../../common/getRoutes'
import {setCountry,getSportsCountryList,getSportsCityList,getBookingSubcategory, sportsEventSearch, addCallForPopularSearch, enableLoading, disableLoading,getBookingCategory } from '../../../../actions';
import PlacesAutocomplete from './../../../common/LocationInput'
import AutoComplete from './CommonAutoComplete';
import {  getIpfromLocalStorage } from '../../../../common/Methods'
let ipAddress = getIpfromLocalStorage();
const { Option } = Select;

class SportsSearch extends React.Component {
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
            location: [],
            cities: [],
            country_id: null,
            city_id: null,
            isVisible: false,
        }
    }

     /**   
    * @method componentDidMount
    * @description called after render the component
    */
    componentDidMount(){
         this.props.getSportsCountryList(res => {
             if(res.status === 200){
                 let item = res.data && res.data.data.all && res.data.data.all.data ? res.data.data.all.data.item : ''
                 let data = item  && Array.isArray(item) ? item : []
                 if(data.length){
                     this.getCountry(data)
                    //  this.props.setCountry(data)
                 }
             }
         })
    }

    /**   
    * @method getCountry
    * @description get country
    */
    getCountry = (country) => {
        const { bookingCategory } = this.props
        let temp = []
        country && country.length !== 0 && country.map((el, i) => {
            // this.props.getSportsCityList({ countryid:el.id}, res => {
            //     if (res.status === 200) {
            //          let item = res.data.data && res.data.data.all && res.data.data.all.data ? res.data.data.all.data.item : ''
            //         let city = item  && Array.isArray(item) ? item : []
            //         let temp2=[]
            //         city.length !== 0 && city.map((el2, i) => {
            //             temp2.push({value: el2.id, label: el2.caption})
            //         })
                    // temp.push({value: el.sports_country_id, label: el.name, children:temp2 })
                    // temp.push({value: el.id, label: el.caption, children:temp2 })
            temp.push({value: el.id, label: el.caption})
                // }
            // })
        })
        this.setState({location: temp})
        // this.props.setCountry(temp)
    }

    /**   
    * @method renderDistanceOptions
    * @description render subcategory
    */
    renderDistanceOptions = () => {
        return this.state.distanceOptions.map((el, i) => {
            return (
                <Option key={i} value={el}>{el} km</Option>
            );
        })
    }

    /** 
    * @method handleAddress
    * @description handle address change Event Called in Child loc Field 
    */
    handleAddress = (result, address, latLng) => {
        
        let city = '';

        result.address_components.map((el) => {
            if (el.types[0] === 'administrative_area_level_2') {
                city = el.long_name
            }
        })
        this.setState({ searchLatLng: latLng, selectedCity: city })

    }
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
    * @method resetSearch
    * @description Use to reset Search bar
    */
    resetSearch = () => {
        this.setState({ isSearchResult: false, searchKey: '', searchLatLng: '', selectedDistance: 0, selectedOption: {}, country_id: '', city_id:'' })
        this.formRef.current.resetFields();
        this.props.handleSearchResponce('', true, {})
    }

    /** 
    * @method handleSearch
    * @description Call Action for Classified Search
    */
    handleSearch = (values) => {
        const {country_id, city_id, selectedCity, selectedDistance, searchLatLng, selectedOption } = this.state;
        let cat_id = this.props.match.params.categoryId
        let isEmpty = Object.keys(selectedOption).length === 0
        if (isEmpty) {
            toastr.warning(langs.warning, langs.messages.mandate_filter)
        }else if(country_id === '' && city_id === ''){
            toastr.warning(langs.warning, 'Please select country and city')
        }else {
        // let reqData = {
        //     countryid: country_id,
        //     cityid:city_id,
        //     sporttypeid: selectedOption.id,
        //     radius: selectedDistance,
        //     page: 1
        // }
        // let reqData = {
        //     countryid: 1062,
        //     cityid: 1486,
        //     sporttypeid: 1019,
        //     radius: 100,
        //     page: 1
        // }
        let reqData = {
            countryid: 1002,
            cityid: 1005,
            sporttypeid: 1000,
            radius: 75,
            page: 1
        }
            this.props.enableLoading()
            this.props.sportsEventSearch(reqData, (res) => {
                
                this.props.disableLoading()
                if(res.status === 200){
                    let allData = res.data && res.data.data && res.data.data.all && res.data.data.all.control && res.data.data.all.control
                    
                    let temp = res.data && res.data.data && res.data.data.all && res.data.data.all.data
                    
                    if (temp && Array.isArray(temp.item)) {
                        this.props.handleSearchResponce(temp.item, false, reqData, allData)
                        let reqData2 = {
                        module_type: 1,
                        category_id: cat_id,
                        keyword: selectedOption.caption,
                        ip_address: ipAddress,
                        location: country_id,
                        distance: selectedDistance ? selectedDistance : '',
                        latitude: searchLatLng ? searchLatLng.lat : '',
                        longitude: searchLatLng ? searchLatLng.lng : '',
                    }
                    
                    this.props.addCallForPopularSearch((reqData2), (res) => {
                        
                })
                    } else {
                        this.props.handleSearchResponce([], false, reqData)
                    }
                }
            })
        }
    }

     /** 
    * @method selectedLocation
    * @description get selected location
    */
    selectedLocation = (value) => {
    // console.log("🚀 ~ file: SportsSearch.js ~ line 214 ~ SportsSearch ~ value", value)
        
        if(value && value.length){
            let country_id = value[0] ?  value[0] : ''
            // let city_id = value[1] ? value[1] : ''
            // this.setState({country_id: country_id,city_id: city_id })
            this.setState({country_id: country_id })
            this.props.getSportsCityList({ countryid: country_id}, res => {
                if (res.status === 200) {
                    let item = res.data.data && res.data.data.all && res.data.data.all.data ? res.data.data.all.data.item : ''
                    let city = item  && Array.isArray(item) ? item : []
                    let temp2=[]
                    city.length !== 0 && city.map((el2, i) => {
                        temp2.push({value: el2.id, label: el2.caption})
                    })
                    this.setState({
                        cities: temp2
                    })
                }
            })
        }
    }
     /** 
    * @method selectedLCity
    * @description get selected location
    */
      selectedCity = (value) => {
        // console.log("🚀 ~ file: SportsSearch.js ~ line 214 ~ SportsSearch ~ value", value)
            
            if(value && value.length){
                // let country_id = value[0] ?  value[0] : ''
                let city_id = value[0] ? value[0] : ''
                this.setState({city_id: city_id })
            }
        }
    

    setFloating = () => {
        this.setState({isFloated: true})
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const {isMoreOption,isVisible,location,selectedDistance, country_id, selectedOption, city_id, cities } = this.state;
        const { bookingCategory } = this.props
        let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
        return (
            <div className='location-search-wrap booking-location-search-wrap sports-booking-location-search-wrap'>
                <Form ref={this.formRef}
                    name='location-form'
                    className='location-search'
                    layout={'inline'}
                    onFinish={this.handleSearch}
                >
                    <Form.Item style={{ width: 'calc(100% - 205px)' }}>
                        <Input.Group compact>
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
                                    isSports={true} defaultOption={selectedOption.caption}
                                />
                            </Form.Item>
                            {/* <Form.Item
                                name={'location'}
                                noStyle
                            >
                                <PlacesAutocomplete
                                    name='address'
                                    handleAddress={this.handleAddress}
                                    addressValue={this.state.address}
                                />
                            </Form.Item> */}
                            <Form.Item
                                name={'country'}
                                noStyle
                            >
                                <Cascader placeholder='Country'  defaultValue={[country_id]} options={location} onChange={this.selectedLocation}/>
                            </Form.Item>
                            <Form.Item
                                name={'location'}
                                noStyle
                            >
                                 <Cascader placeholder='City'  defaultValue={[city_id]} options={cities} onChange={this.selectedCity}/>
                            </Form.Item>
                            
                            <Form.Item
                                name={'distance'}
                                noStyle
                            >
                                <Select onChange={(e) => {
                                    this.setState({ selectedDistance: e })
                                }} defaultValue={selectedDistance} style={{ width: '18%', maxWidth: '150px' }} placeholder='0 KM'>
                                    {this.renderDistanceOptions()}
                                </Select>
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button htmlType='submit' type='primary' shape={'circle'} >
                                <Icon icon='search' size='20' />
                            </Button>
                            {/* <Button onClick={this.resetSearch} type='danger' shape={'circle'} title={'Reset Search'}>
                                <SyncOutlined className='fs-22' />
                            </Button> */}
                        </Space>
                    </Form.Item>
                    {this.state.isMoreOption &&
                        <Row gutter={[10, 0]} className='location-more-form'>
                            <Col md={6} className="mrg-top-space">
                            <div className={currentField['event']  ? "floating-label" : ''}>
                                <Form.Item
                                    // noStyle
                                    name='event'
                                    label={'Team/Match/Event'}
                                >
                                    <Input placeholder={'Team/Match/Event'} onChange={this.setFloating}/>
                                </Form.Item>
                            </div>
                            </Col>
                            <Col md={6} className="mrg-top-space">
                            <div className={currentField['country']  ? "floating-label" : ''}>
                                <Form.Item
                                    // noStyle
                                    name='country'
                                    label={'Venue/City/Country'}
                                >
                                    <Input placeholder={'Venue/City/Country'} onChange={this.setFloating}/>
                                </Form.Item>
                            </div>
                            </Col>
                            <Col md={6} className="mrg-top-space">
                            <div className={currentField['sports_type']  ? "floating-label" : ''}>
                                <Form.Item
                                    // noStyle
                                    name='sports_type'
                                    label={'Sports Types'}
                                >
                                    <Input placeholder={'Sports Types'} onChange={this.setFloating}/>
                                </Form.Item>
                            </div>
                            </Col>
                            {!isVisible && <Col md={6} className="mrg-top-space">
                            <div className={currentField['date']  ? "floating-label" : ''}>
                                {/* <Form.Item
                                    // noStyle
                                    name='from'
                                    label={'From'} 
                                >
                                    <Input placeholder={'From'} onChange={this.setFloating}/>
                                </Form.Item> */}
                                <Form.Item
                                    //noStyle
                                    name='date'
                                    className="w-100 select-booking-date"
                                    label="Select Booking Date"
                                >
                                    <DatePicker
                                        format={'MM/DD/YYYY'}
                                        placeholder="Select Booking Date"
                                        onChange={this.setFloating}
                                        disabledDate={(current) => {
                                        return moment().add(-1, 'days') >= current;
                                        }}
                                    />
                                </Form.Item>
                            </div>
                            </Col>}
                            {/* {!isVisible && <Col md={12} className="mrg-top-space">
                            <div className={currentField['to']  ? "floating-label" : ''}>
                                <Form.Item
                                    // noStyle
                                    name='to'
                                    label={'Until'}
                                >
                                    <Input placeholder={'Until'} onChange={this.setFloating}/>
                                </Form.Item>
                            </div>
                            </Col>} */}
                        </Row>
                    }
                    <div className='location-more-option sport-location-more-option'>
                        <div className='booking-checkbox-width-block'>
                            <Checkbox onChange={(e) => {
                                    this.setState({ isVisible: e.target.checked })
                            }}>Happening now</Checkbox>
                        </div>
                        <div className='right'>
                            {isMoreOption && <a onClick={this.resetSearch}>
                            <CloseOutlined className="clr-filer-icon" />{'Clear Filter'}
                            </a>}
                            <a onClick={this.toggleMoreOption.bind(this)} className={`ml-20 ${!this.state.isMoreOption && 'active'}`}>
                                {!this.state.isMoreOption ? 'More Options' : 'Less Options'}
                            </a>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, classifieds, common } = store;
    const { bookingCategoty, location } = common;
    let bookingCategory = [];
    if (common) {
        bookingCategory = bookingCategoty && Array.isArray(bookingCategoty.data) && bookingCategoty.data
    }
    return {
        bookingCategory,
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedClassifiedList: classifieds.classifiedsList,
    };
}

export default SportsSearch = connect(
    mapStateToProps,
    {setCountry,getSportsCountryList,getSportsCityList,getBookingSubcategory, sportsEventSearch, addCallForPopularSearch, enableLoading, disableLoading, getBookingCategory }
)(withRouter(SportsSearch));

