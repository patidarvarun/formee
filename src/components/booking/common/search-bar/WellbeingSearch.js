import React from 'react';
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../config/localization';
import { connect } from 'react-redux';
import { Form, Input, Select, Button, Space, Typography, Row, Col, DatePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Icon from '../../../customIcons/customIcons';
import { newInBookings, addCallForPopularSearch, enableLoading, disableLoading } from '../../../../actions';
import PlacesAutocomplete from './../../../common/LocationInput'
import { TEMPLATE, DEFAULT_ICON } from '../../../../config/Config'
import AutoComplete from './CommonAutoComplete';
import { getIpfromLocalStorage } from '../../../../common/Methods'
import { BOOKING_PRIZE_OPTIONS} from "../../../../config/Constant";
let ipAddress = getIpfromLocalStorage();
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

class WellBeingSearch extends React.Component {
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
            selectedItems: this.props.selectedItems === undefined ? [] : this.props.selectedItems,
            selectedItemsName: this.props.selectedItemsName === undefined ? [] : this.props.selectedItemsName,
            isShowMore: false,
            showmore: false,
            isvisible: false,
            searchItem:'',
            prizeOptions: BOOKING_PRIZE_OPTIONS,
            selectedMaxPrice:''
        }
    }

    /**   
   * @method componentDidMount
   * @description mount after render the component
   */
    componentDidMount() {
        if (this.props.isvisible) {
            this.setState({ isShowMore: true })
        }
        this.formRef.current && this.formRef.current.resetFields();
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
            isShowMore: !this.state.isShowMore,
        })
    }

    /** 
    * @method resetSearch
    * @description Use to reset Search bar
    */
    resetSearch = () => {
        this.setState({ isSearchResult: false, selectedItems: [], selectedItemsName: [], searchKey: '', searchLatLng: '', selectedDistance: 0, selectedOption: {} })
        this.formRef.current.resetFields();
        this.props.handleSearchResponce('', true, {})
    }

    /** 
    * @method handleSearch
    * @description Call Action for Classified Search
    */
    handleSearch = (values) => {
        const { tabKey } = this.props
        let parameter = this.props.match.params;
        let sub_cat_id = this.props.match.params.subCategoryId
        const {searchItem, selectedCity, selectedDistance, selectedItems, selectedItemsName, searchLatLng, selectedOption } = this.state;
            let reqData = {
                keyword: searchItem ? searchItem : '',
                cat_id: selectedOption ? selectedOption.catid : parameter.categoryId ,
                location: searchLatLng ? searchLatLng : '',
                lat:searchLatLng.lat ? searchLatLng.lat : '',
                lng:searchLatLng.lng ? searchLatLng.lng : '',
                distance: selectedDistance ? selectedDistance : '',
                userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
                fitness_type_ids:values.fitness_type_ids ? values.fitness_type_ids : '',
                filter: tabKey && tabKey === 2 ? 'top_rated' : '',
                //extra parameter added 11/01/2021
                price_min:values.price_min ? values.price_min : '',
                price_max:values.price_max ? values.price_max : '',
                sort: (values.sort === 'price_high' || values.sort === 'price_low') ? 'price' : values.sort ? values.sort : '',
                sort_order: values.sort ? (values.sort === 'price_high' ? 'desc' : 'asc') : '', 
                from_date: values.date ? moment(values.date).format('YYYY-MM-DD') : '',
                to_date: values.date ? moment(values.date).format('YYYY-MM-DD') : '',
                sub_cat_id: sub_cat_id,
                page:1,
                per_page:50
            }
            if(reqData.keyword === '' && reqData.price_min === '' && reqData.price_max === '' && reqData.location === '' && reqData.distance === '' && reqData.sort === '' && reqData.sort_order === '' && reqData.from_date === '' && reqData.fitness_type_ids === ''){
                toastr.warning(langs.warning, langs.messages.mandate_filter);
                return true
            }
            this.props.enableLoading()
            this.props.newInBookings(reqData, (res) => {
                this.props.disableLoading()
                if(res.status === 200){
                    if (res.data && Array.isArray(res.data.data)) {
                        // reqData.selectedItemsName = selectedItemsName.reverse()
                        // reqData.selectedItems = selectedItems
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
                    } else {
                        this.props.handleSearchResponce([], false, reqData)
                    }
                }
            })
        // }
    }

    /** 
    * @method renderFitnessTypes
    * @description render fitness Type
    */
    renderFitnessTypes(types) {
        const { selectedItems, selectedItemsName, isvisible } = this.state
        return types.map((el) => {
            return (
                <li
                    onClick={() => {
                        if (selectedItems.includes(el.id)) {
                            let temp = selectedItems.filter(function (item) {
                                return item !== el.id
                            })
                            let temp2 = selectedItemsName.filter(function (item) {
                                return item !== el.name
                            })
                            this.setState({ selectedItems: [...temp], selectedItemsName: temp2 })
                        } else {
                            this.setState({ selectedItems: [el.id, ...selectedItems], selectedItemsName: [el.name, ...selectedItemsName] })
                        }
                        // selectedItems.push(el.id)
                    }}>
                    <div
                        className={selectedItems.includes(el.id) ? 'icons-active ' : ''}
                    // style={{ backgroundColor: selectedItems.includes(el.id) ? '#FFC468 ' : '' }}                        
                    >
                        <img
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_ICON
                            }}
                            src={el.image} alt="" />
                    </div>
                    <Text>{el.name}</Text>
                </li>
            )
        })
    }

    /**
     * @method renderFitnessTypeOption
     * @description render fitness type options
     */
    renderFitnessTypeOption = (list) => {
        if(list && list.length){
            return list.map((el, i) => {
                return (
                    <Option key={i} value={el.id}>{el.name}</Option>
                );
            })
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

    setFloating = () => {
        this.setState({isFloated: true})
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { allBookingId,fitnessPlan } = this.props
        const parameter = this.props.match.params;
        let sub_cat_name = parameter.subCategoryName;
        const {selectedMaxPrice, isShowMore } = this.state
        let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
        return (
            <div className='location-search-wrap booking-location-search-wrap'>
                <Form ref={this.formRef}
                    name='location-form'
                    className='location-search '
                    layout={'inline'}
                    onFinish={this.handleSearch}
                >
                    <Form.Item style={{ width: 'calc(100% - 205px)' }}>
                        <Input.Group compact>
                            <Form.Item
                                noStyle
                                name='name'
                            >
                                <AutoComplete className='suraj' searchBy={TEMPLATE.WELLBEING} 
                                    handleSearchSelect={(option) => {
                                        this.setState({ selectedOption: option })
                                    }}
                                    handleValueChange={(value) => {
                                        this.setState({ searchItem: value });
                                    }} 
                                    allBookingId={allBookingId}
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
                                    clearAddress={(add) => {
                                        this.setState({
                                            address: '',searchLatLng: ''
                                        })
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name={'distance'}
                                noStyle
                            >
                                <Select allowClear onChange={(e) => {
                                    this.setState({ selectedDistance: e })
                                }} defaultValue={this.state.selectedDistance} style={{ width: '18%', maxWidth: '150px' }} placeholder='0 KM'>
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
                    {isShowMore &&
                        <Row gutter={[10, 0]} className='location-more-form'>
                            <Col md={6} className="mrg-top-space">
                            <div className={currentField['price_min']  ? "floating-label" : ''}>
                                <Form.Item
                                    // noStyle
                                    name='price_min'
                                    label="Price Min."
                                >
                                    <Select allowClear
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
                                        {this.renderPrizeOptions("price_min")}
                                    </Select>
                                    {/* <Input placeholder={'Price Min'} type={'number'} /> */}
                                </Form.Item>
                            </div>
                            </Col>
                            <Col md={6} className="mrg-top-space">
                            <div className={currentField['price_max']  ? "floating-label" : ''}>
                                <Form.Item
                                    //noStyle
                                    name='price_max'
                                    label="Price Max."
                                >
                                    <Select placeholder="Price Max." allowClear onChange={(el) => this.setState({selectedMaxPrice:el})}>
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
                                    {/* <Input placeholder={'Price Max'} type={'number'} /> */}
                                </Form.Item>
                                </div>
                            </Col>
                            <Col md={6} className="mrg-top-space">
                            <div className={currentField['sort']  ? "floating-label" : ''}>
                                <Form.Item
                                    // noStyle
                                    name='sort'
                                    label='Sort By'
                                >
                                    <Select placeholder='Sort By' allowClear onChange={this.setFloating}>
                                        <Option value='price_high'>Price (High-Low)</Option>
                                        <Option value='price_low'>Price (Low-High)</Option>
                                        <Option value='rating'>Rating</Option>
                                        <Option value='most_viewed'>Most Reviewed</Option>
                                        <Option value='name'>Name List A-Z</Option>
                                        <Option value='distance'>Distance</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            </Col>
                            {sub_cat_name === langs.key.fitness ? <Col md={6} className="mrg-top-space">
                            <div className={currentField['fitness_type_ids']  ? "floating-label" : ''}>
                                <Form.Item
                                    //noStyle
                                    name='fitness_type_ids'
                                    label='Fitness Type'
                                >
                                    <Select placeholder='Fitness Type' allowClear onChange={this.setFloating}>
                                        {this.renderFitnessTypeOption(fitnessPlan)}
                                    </Select>
                                </Form.Item>
                            </div>
                            </Col>:
                            <Col md={6} className="mrg-top-space">
                            <div className={currentField['date']  ? "floating-label" : ''}>
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
                        </Row>
                        // <div className="align-center fm-circle-wrap wellbg pb-25 pt-30" style={{ background: '#363b40' }}>
                        //     <div className="location-search">
                        //         <Title level={3}>
                        //             {'Fitness Types'}
                        //         </Title>
                        //         <ul className="circle-icon-list">
                        //             {this.renderFitnessTypes(this.props.fitnessPlan)}
                        //         </ul>
                        //     </div>
                        // </div>
                    }
                    <div className='location-more-option'>
                        <div className='booking-checkbox-width-block'>&nbsp;</div>
                        <div className='right'>
                            {isShowMore && <a onClick={this.resetSearch}>
                            <CloseOutlined className="clr-filer-icon" />{'Clear Filter'}
                            </a>}
                            <a onClick={this.toggleMoreOption.bind(this)} className={`ml-20 ${!this.state.isMoreOption && 'active'}`}>
                                {!isShowMore ? 'More Options' : 'Less Options'}
                            </a>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, classifieds, bookings } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],
    };
}

export default WellBeingSearch = connect(
    mapStateToProps,
    { newInBookings, addCallForPopularSearch, enableLoading, disableLoading }
)(withRouter(WellBeingSearch));

