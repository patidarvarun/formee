import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { Form, Input, Select, Button, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Icon from '../../../customIcons/customIcons';
import { bookinglandingPageSearch, enableLoading, disableLoading } from '../../../../actions';
import PlacesAutocomplete from './../../../common/LocationInput'
import AutoComplete from './CommonAutoComplete';
const { Option } = Select;

class BookingLandingPageSearch extends React.Component {
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
            searchItem:''
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
    handleSearch = () => {
        const { searchItem, selectedDistance, searchLatLng, selectedOption } = this.state;
        let isEmpty = Object.keys(selectedOption).length === 0 && searchItem === '' && searchLatLng === '' && selectedDistance == 0
        if (isEmpty) {
            toastr.warning(langs.warning, langs.messages.mandate_filter)
        } else {
            let reqData = {
                name: searchItem ? searchItem : '',
                // cat_id: selectedOption.catid,
                lat: searchLatLng.lat,
                lng: searchLatLng.lng,
                km: selectedDistance,
                // userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
                per_page: 12,
                page: 1,
            }
            this.props.enableLoading()
            this.props.bookinglandingPageSearch(reqData, (res) => {
                let total_record = res.data && res.data.total
                this.props.disableLoading()
                if (res.status == 200) {
                    let data = res.data.data && res.data.data.data && Array.isArray(res.data.data.data) && res.data.data.data.length ? res.data.data.data : []
                    if (data && data.length) {
                        this.props.handleSearchResponce(data, false, reqData, total_record)
                    }else {
                        this.props.handleSearchResponce([], false, reqData)
                    }
                }else {
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
        return (
            <div className='location-search-wrap'>
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
                                    isLandingpage={true}
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
                                }} defaultValue={this.state.selectedDistance} style={{ width: '18%', maxWidth: '150px', borderLeft:"1px solid #AAB1B6" }} placeholder='0 KM'>
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

export default BookingLandingPageSearch = connect(
    mapStateToProps,
    { bookinglandingPageSearch, enableLoading, disableLoading }
)(withRouter(BookingLandingPageSearch));

