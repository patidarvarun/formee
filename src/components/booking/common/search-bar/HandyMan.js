import React from 'react';
import { withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../config/localization';
import { connect } from 'react-redux';
import { DatePicker, Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Icon from '../../../customIcons/customIcons';
import { getBookingSearchAutocomplete, newInBookings, addCallForPopularSearch, enableLoading, disableLoading } from '../../../../actions';
import PlacesAutocomplete from './../../../common/LocationInput'
import AutoComplete from './CommonAutoComplete';
import { getIpfromLocalStorage } from '../../../../common/Methods'
import { getThisMonthDates, getThisWeek, currentDate } from '../../../common'
import { BOOKING_PRIZE_OPTIONS} from "../../../../config/Constant";
let ipAddress = getIpfromLocalStorage();
const { Option } = Select;
const { RangePicker } = DatePicker;

class HandyMan extends React.Component {
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
            isvisible: false, from_date: '', to_date: '',
            date: '',
            prizeOptions: BOOKING_PRIZE_OPTIONS,
        }
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.subCategoryId
        let catIdNext = nextprops.match.params.subCategoryId
        if (catIdInitial !== catIdNext) {
            this.setState({ isSearchResult: false, searchKey: '', searchLatLng: '', selectedDistance: 0, selectedOption: {} })
            this.formRef.current.resetFields();
        }
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
        this.setState({ isSearchResult: false, searchKey: '', searchLatLng: '', selectedDistance: 0, selectedOption: {} })
        this.formRef.current.resetFields();
        this.props.handleSearchResponce('', true, {})
    }

    /** 
    * @method handleSearch
    * @description Call Action for Classified Search
    */
    handleSearch = (values) => {
        const { tabKey } = this.props
        let parameter = this.props.match.params
        let categoryId = parameter.categoryId;
        let categoryName = parameter.categoryName
        let subCategoryId = parameter.subCategoryId
        let subCategoryName = parameter.subCategoryName
        const { date, selectedCity, selectedDistance, searchLatLng, selectedOption, from_date, to_date } = this.state;
        let isEmpty = Object.keys(selectedOption).length === 0
        if (isEmpty) {
            toastr.warning(langs.warning, langs.messages.mandate_filter)
        } else {
            let reqData = {
                // name: selectedOption.title,
                keyword: selectedOption.title,
                cat_id: selectedOption.catid,
                // cat_id: subCategoryId ? subCategoryId : categoryId,
                location: searchLatLng,
                distance: selectedDistance,
                price_max: values.price_max !== undefined ? values.price_max : '',
                price_min: values.price_min !== undefined ? values.price_min : '',
                userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
                sort: (values.sort === 'price_high' || values.sort === 'price_low') ? 'price' : values.sort ? values.sort : '',
                sort_order: values.sort === 'price_high' ? 'DESC' : 'ASC',
                filter: tabKey && tabKey === 2 ? 'top_rated' : '',
                from_date: date ? date[0] : from_date ? from_date : '',
                to_date: date ? date[1] : to_date ? to_date : ''
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
                            distance: selectedDistance ? selectedDistance : '',
                            latitude: searchLatLng ? searchLatLng.lat : '',
                            longitude: searchLatLng ? searchLatLng.lng : '',
                        }
                        
                        this.props.addCallForPopularSearch((reqData2), (res) => {
                            


                        })
                    }
                } else {
                    this.props.handleSearchResponce([], false, reqData)
                }
            })
        }
    }

    /**
     * @method handleListedDateSelection
     * @description render component
     */
    handleListedDateSelection = (value) => {
        
        const { date } = this.state
        if (value === 1) {
            
            let today = currentDate()
            this.setState({ isvisible: false, from_date: today, to_date: today, date: '' })
        } else if (value === 2) {
            let this_week = getThisWeek()
            
            this.setState({ isvisible: false, from_date: this_week.monday, to_date: this_week.sunday, date: '' })
        } else if (value === 3) {
            let this_month = getThisMonthDates()
            
            this.setState({ isvisible: false, from_date: this_month.fday, to_date: this_month.lday, date: '' })
        } else if (value === 4) {
            this.setState({ isvisible: true, from_date: '', to_date: '' })
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
     * @method render
     * @description render component
     */
    render() {
        const {isShowMore, selectedDistance, isvisible } = this.state;
        return (
            <div className='location-search-wrap booking-location-search-wrap'>
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
                                />


                            </Form.Item>
                            <Form.Item
                                name={'location'}
                                noStyle
                            >
                                <PlacesAutocomplete
                                    name='address'
                                    handleAddress={this.handleAddress}
                                    addressValue={this.state.address}
                                />
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
                        <Row gutter={[15, 10]} className='location-more-form'>
                            <Col md={12}>
                                <Form.Item
                                    noStyle
                                    name='price_min'
                                >
                                    <Select allowClear
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
                                    {/* <Input placeholder={'Price Max.(AU$)'} type={'number'} /> */}
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    noStyle
                                    name='price_max'
                                >
                                    <Select placeholder="Price Max." allowClear>
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
                                    {/* <Input placeholder={'Price Max.(AU$)'} type={'number'} /> */}
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    noStyle
                                    name='sort'
                                >
                                    <Select placeholder='Sort By' allowClear>
                                        <Option value='price_high'>Price (High-Low)</Option>
                                        <Option value='price_low'>Price (Low-High)</Option>
                                        <Option value='rating'>Rating</Option>
                                        <Option value='most_viewed'>Most Reviewed</Option>
                                        <Option value='name'>Name List A-Z</Option>
                                        <Option value='distance'>Distance</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            {/* <Col md={12}>
                                <Form.Item
                                    noStyle
                                    name='select_booking_date'
                                    className="w-100"
                                >
                                    <DatePicker placeholder="Select Booking Date" />
                                </Form.Item>
                            </Col> */}
                            <Col md={12}>
                                <Form.Item
                                    noStyle
                                    name='listed_date'
                                    className="w-100"
                                >
                                    <Select placeholder='Listed date' onChange={this.handleListedDateSelection} allowClear>
                                        <Option value={1}>24 Hrs</Option>
                                        <Option value={2}>Week</Option>
                                        <Option value={3}>Month</Option>
                                        <Option value={4}>Custom </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            {isvisible &&
                                <Col md={12}>
                                    <Form.Item
                                        noStyle
                                        name='custum'
                                    >
                                        <Space direction="vertical" size={12}>
                                            <RangePicker onChange={(date, dateString) => this.setState({ date: dateString })} />
                                        </Space>
                                    </Form.Item>
                                </Col>}
                        </Row>
                    }
                    <div className='location-more-option'>
                        <div className='booking-checkbox-width-block'>&nbsp;</div>
                        <div className='right'>
                            {isShowMore && <a onClick={this.resetSearch}>
                                {'Clear Filter'}
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
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default HandyMan = connect(
    mapStateToProps,
    { newInBookings, addCallForPopularSearch, enableLoading, disableLoading }
)(withRouter(HandyMan));

