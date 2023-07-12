import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Icon from '../../../customIcons/customIcons';
import { getFilterRoute } from '../../../../common/getRoutes'
import { newInBookings, addCallForPopularSearch, enableLoading, disableLoading } from '../../../../actions';
import PlacesAutocomplete from './../../../common/LocationInput'
import AutoComplete from './CommonAutoComplete';
import { setIpInLocalStorage, getIpfromLocalStorage } from '../../../../common/Methods'
const publicIp = require('public-ip');
let ipAddress = getIpfromLocalStorage();
(async () => {
    ipAddress = await publicIp.v4(
        {
            fallbackUrls: [
                'https://ifconfig.co/ip'
            ],
            onlyHttps: false
        }
    )
    setIpInLocalStorage(ipAddress)
})();

const { Option } = Select;

class GeneralSearch extends React.Component {
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
            isMoreOption: false

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
        const { tabkey } = this.props
        const { selectedCity, selectedDistance, searchLatLng, selectedOption } = this.state;
        let isEmpty = Object.keys(selectedOption).length === 0
        if (isEmpty) {
            toastr.warning(langs.warning, langs.messages.mandate_filter)
        } else {
            let reqData = {
                keyword: selectedOption.title,
                cat_id: selectedOption.catid,
                location: searchLatLng,
                distance: selectedDistance,
                userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
                per_page: 12,
                page: 1,
                // filter: 'top-rated'
            }
            this.props.enableLoading()
            this.props.newInBookings(reqData, (res) => {
                let total_record = res.data && res.data.total
                this.props.disableLoading()
                if (res.status === 200) {
                    if (Array.isArray(res.data.data)) {
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
     * @method render
     * @description render component
     */
    render() {
        let parameter = this.props.match.params;
        return (
            <div className='location-search-wrap booking-location-search-wrap'>
                {/* <button class="search-top">Search fgfhhhfgh</button> */}
                <Form ref={this.formRef}
                    name='location-form'
                    className='location-search'
                    layout={'inline'}
                    onFinish={this.handleSearch}
                >

                    <Form.Item style={{ width: 'calc(100% - 150px)' }}>
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

export default GeneralSearch = connect(
    mapStateToProps,
    { newInBookings, addCallForPopularSearch, enableLoading, disableLoading }
)(withRouter(GeneralSearch));

