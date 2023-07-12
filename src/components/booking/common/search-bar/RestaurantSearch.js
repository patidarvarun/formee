import React from 'react';
import { withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux';
import { langs } from '../../../../config/localization';
import { Form, Input, Select, Button, Row, Col, Space, Typography, Checkbox } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Icon from '../../../customIcons/customIcons';
import { getFilterRoute } from '../../../../common/getRoutes'
import { getDiataries, newInBookings, addCallForPopularSearch, searchByRestaurent, enableLoading, disableLoading } from '../../../../actions';
import PlacesAutocomplete from './../../../common/LocationInput'
import { TEMPLATE, DEFAULT_ICON } from '../../../../config/Config'
import AutoComplete from './RestaurantAutoComplete';
import { getIpfromLocalStorage } from '../../../../common/Methods'
let ipAddress = getIpfromLocalStorage();
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

class RestaurantSearch extends React.Component {
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
            selectedItems: [],
            selectedItemsName: [],
            isShowMore: false,
            isOpen: false,
            dietaries: [],
            searchItem: '',
            cusinsFloated: false, 
            dietryFloated: false

        }
    }

    /**   
    * @method componentDidMount
    * @description mount after render the component
    */
    componentWillMount() {
        let location = this.props.location.state
        if (location !== undefined) {
            this.setState({
                selectedItems: location.selectedItems,
                selectedItemsName: location.multipleChoices
            })
            if (location.selectedItems && location.selectedItems.length) {
                this.setState({ isShowMore: true })
            }
        }

        //New enhancement changes /04/01/2021
        this.props.getDiataries(res => {
            if (res.status === 200) {
                let dietaries = res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []
                this.setState({ dietaries: dietaries })
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
        const { searchItem, selectedCity, selectedDistance, selectedItems, selectedItemsName, isOpen, searchLatLng, selectedOption } = this.state;
        let cat_id = this.props.match.params.categoryId
        let reqData = {
            userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
            cusines: Array.isArray(values.cusines) && values.cusines.length ? values.cusines.toString() : '',
            dietry: Array.isArray(values.dietry) && values.dietry.length ? values.dietry.toString() : '',
            item_name: searchItem ? searchItem : '',
            latitude: searchLatLng.lat,
            longitude: searchLatLng.lng,
            open_now: isOpen,
            kilometer: values.distance ? values.distance : '',
            service: values.order_type ? values.order_type : '',
            location: searchLatLng ? searchLatLng : '',
            page_size: 9,
            page: 1
            //cusines: Array.isArray(selectedItems) && selectedItems.toString(),
            // keyword: selectedOption ? selectedOption.name : searchItem ? searchItem : '' ,
            // distance: selectedDistance,
            //service: this.props.service,
        }
        if (reqData.cusines == '' && reqData.dietry == '' && reqData.item_name == '' && reqData.kilometer == 0 && reqData.service == '' && reqData.location == '') {
            toastr.warning(langs.warning, langs.messages.mandate_filter)
        } else {
            this.props.enableLoading()
            this.props.searchByRestaurent(reqData, (res) => {
                this.props.disableLoading()
                if (res.status === 200) {
                    if (Array.isArray(res.data.data)) {
                        let total_records = res.data && res.data.total
                        reqData.selectedItemsName = selectedItemsName && selectedItemsName.reverse()
                        reqData.selectedItems = selectedItems
                        this.props.handleSearchResponce(res.data.data, false, reqData, total_records, selectedOption)
                        let reqData2 = {
                            module_type: 1,
                            category_id: cat_id,
                            keyword: selectedOption ? selectedOption.name : searchItem ? searchItem : '',
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
    * @method renderBubblesTypes
    * @description render cuisines items
    */
    renderBubblesTypes(types) {
        const { selectedItems, selectedItemsName } = this.state
        return types.map((el) => {
            return (
                <li className={selectedItems.includes(el.id) ? 'icons-active' : ''}
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
                    }}>
                    <div
                    // style={{ backgroundColor: selectedItems.includes(el.id) ? 'yellow' : '' }}
                    >
                        <img
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_ICON
                            }}
                            src={el.image ? el.image : DEFAULT_ICON} alt="" />
                    </div>
                    <Text>{el.name}</Text>
                </li>
            )
        })
    }

    setCusinesFloating = (value) => {
        if(value && value.length){
            this.setState({cusinsFloated: true})
        }else {
        this.setState({cusinsFloated: false})
        }
    }

    setdietryFloating = (value) => {
        if(value && value.length){
            this.setState({dietryFloated: true})
        }else {
        this.setState({dietryFloated: false})
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        let parameter = this.props.match.params;
        const { isShowMore, dietaries, cusinsFloated, dietryFloated } = this.state
        const { selectedOption, foodTypes } = this.props
        let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
        return (
            <div className='location-search-wrap resturant-search'>
                <Form ref={this.formRef}
                    name='location-form'
                    className='location-search'
                    layout={'inline'}
                    onFinish={this.handleSearch}
                >
                    <Form.Item style={{ width: 'calc(100% - 95px)' }}>
                        <Input.Group compact>
                            <Form.Item
                                noStyle
                                name='name'
                            >
                                <AutoComplete className='suraj' searchBy={TEMPLATE.RESTAURANT}
                                    handleSearchSelect={(option) => {
                                        this.setState({ selectedOption: option })
                                    }}
                                    handleValueChange={(value) => {
                                        this.setState({ searchItem: value });
                                    }}
                                    defaultValue={selectedOption ? selectedOption.name : ''}
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
                                            address: '', searchLatLng: ''
                                        })
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name={'order_type'}
                                noStyle
                            >
                                <Select className="restourent-type-filter" style={{ width: '18%', maxWidth: '150px' }} placeholder='Delivery' allowClear>
                                    <Option value="delivery">Delivery</Option>
                                    <Option value="take_away">Pick Up</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'distance'}
                                noStyle
                            >
                                <Select allowClear onChange={(e) => {
                                    this.setState({ selectedDistance: e })
                                }} defaultValue={this.state.selectedDistance} style={{ width: '19%', maxWidth: '135px' }} placeholder='0 KM'>
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
                        // <div className="align-center fm-circle-wrap restaurant-circle " style={{ background: '#363b40' }}>
                        //     <div className="location-search">
                        //         <Title level={3}>
                        //             {'Popular Cuisines'}
                        //         </Title>
                        //         <ul className="circle-icon-list">
                        //             {this.renderBubblesTypes(this.props.foodTypes)}
                        //         </ul>
                        //     </div>
                        // </div>
                        <Row gutter={[10, 0]} className='location-more-form'>
                            <Col md={12} className="mrg-top-space">
                            <div className={cusinsFloated  ? "floating-label" : ''}>
                                <Form.Item
                                    //noStyle
                                    name='cusines'
                                    label='Cuisine'
                                >
                                    <Select 
                                        placeholder='Cuisine' 
                                        mode={'multiple'} 
                                        showArrow={true} 
                                        allowClear
                                        onChange={this.setCusinesFloating}
                                    >
                                        {foodTypes && foodTypes.length &&
                                            foodTypes.map((el, i) => {
                                                return (
                                                    <Option key={i} value={el.id}>{el.name}</Option>
                                                )
                                            })}
                                    </Select>
                                </Form.Item>
                            </div>
                            </Col>
                            <Col md={12} className="mrg-top-space">
                                <div className={dietryFloated ? "floating-label" : ''}>
                                <Form.Item
                                    //noStyle
                                    name='dietry'
                                    label='Dietary requirements'
                                >
                                    <Select 
                                        placeholder='Dietary requirements' 
                                        mode={'multiple'} 
                                        allowClear 
                                        showArrow={true}
                                        onChange={this.setdietryFloating}
                                    >
                                        {dietaries && dietaries.length &&
                                            dietaries.map((keyName, i) => {
                                                return (
                                                    <Option key={keyName.id} value={keyName.id}>{keyName.name}</Option>
                                                )
                                            })}
                                    </Select>
                                </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    }
                    <div className='location-more-option'>
                        <div className='booking-checkbox-width-block'>
                            <Checkbox
                                onChange={(e) => {
                                    this.setState({ isOpen: e.target.checked })
                                }}>Open Now</Checkbox>
                        </div>
                        <div className='right' style={{marginTop:"-1px"}}>
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
    const { auth, bookings } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        foodTypes: Array.isArray(bookings.foodTypes) ? bookings.foodTypes : [],
        popularVenueList: bookings.popularVenueList && Array.isArray(bookings.popularVenueList) ? bookings.popularVenueList : [],
    };
}

export default RestaurantSearch = connect(
    mapStateToProps,
    { getDiataries, newInBookings, addCallForPopularSearch, searchByRestaurent, enableLoading, disableLoading }
)(withRouter(RestaurantSearch));

