import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import csc from 'country-state-city'
import { MESSAGES } from '../../../../config/Message'
import {Modal, Layout, Row, Col, Typography, Tabs, Form, Input, Select, Button, Divider, Checkbox, Table, InputNumber, Card  } from 'antd';
import { enableLoading, disableLoading, saveUserAddress } from '../../../../actions';
import { required } from '../../../../config/FormValidation';
import PlacesAutocomplete from '../../../common/LocationInput'

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

class AddUserAddress extends React.Component {
    formRef = React.createRef();
    addressFormRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
           address: '',
           allCountries: csc.getAllCountries(),
           cityOfCountry: [],
           billingAddress: false,
           is_primary: false
        };
    }

    /**
    * @method componentDidMount
    * @description called after render the component
    */
    componentDidMount() {
        let data = this.props.selectedAddress
        this.setState({ address: data ? data.address_1 : '' })
    }


    /**
     * @method onFinishAddAddress
     * @description called on submit
     */
    onFinishAddAddress = (values) => {
        const {billingAddress, address,is_primary  } = this.state
        const {isEditMode, loggedInDetail,selectedAddress } = this.props;
        const { id } = loggedInDetail;
        values.user_id = id;
        values.address_1 = address
        values.address_2 = billingAddress ? address : ''
        values.is_primary = is_primary ? 1 : 0
        const reqData = {
            ...values,
        }
        if(isEditMode){
            reqData.address_id = selectedAddress.id
            this.postUserAddess(reqData,MESSAGES.ADDRESS_UPDATE_SUCCESS )
        }else {
            this.postUserAddess(reqData, MESSAGES.ADDRESS_ADD_SUCCESS)
        } 
    }

    /**
     * @method postUserAddess
     * @description post user address
     */
    postUserAddess = (reqData, message) => {
        this.props.saveUserAddress(reqData, (response) => {
            if (response.status === 200) {
                toastr.success('success', message)
                this.addressFormRef.current.resetFields();
                this.props.getAddress();
                this.props.onCancel()
            }
        }); 
    }

    /**
     * @method onFinishFailed
     * @description handle form submission failed 
     */
    onFinishFailed = errorInfo => {
        return errorInfo
    };

    /** 
    * @method handleAddress
    * @description handle address change Event Called in Child loc Field 
    */
    handleAddress = (result, address, latLng) => {
        let state = '';
        let city = '';
        let pincode = '';
        let country = ''

        result.address_components.map((el) => {

        if (el.types[0] === 'administrative_area_level_1') {
            state = el.long_name
        } else if (el.types[0] === 'administrative_area_level_2') {
            city = el.long_name
        } else if (el.types[0] === 'postal_code') {
            pincode = el.long_name
        } else if (el.types[0] === 'country') {
            country = el.long_name
        }
        })
        this.setState({ address, city, latLng, state, pincode, placeId: result.place_id, country })
        console.log('lat',latLng);
    }
    

    

    getInitialValue = () => {
        let data = this.props.selectedAddress
        if(data){
            let temp = {
                fname: data.fname,
                lname: data.lname,
                address_label: data.address_label ? data.address_label : '',
                address_1: data.address_1,
                country: data.country,
                city: data.city,
                postalcode: data.postalcode ? data.postalcode : '',
                phone_number: data.phone_number ? data.phone_number : ''
            }
            return temp;
        }
    }

    handleCountryChange = (value) => {
        console.log('country', value)
        const { allCountries } = this.state
        let country = allCountries.filter((c) => c.name === value)
        let city = []
        if (country && country.length) {
            city = csc.getCitiesOfCountry(country[0].isoCode)
        }
        this.setState({cityOfCountry: city})
        console.log('selectedStates',city)
    }
    
    /**
     * @method render
     * @description render component
     */
    render() {
        const {isEditMode, visible,selectedAddress } = this.props
        const {billingAddress,cityOfCountry,allCountries, address } = this.state
        return (
            <Fragment>
               <Modal
                title={isEditMode ? 'Update Address' : 'New Address'}
                visible={visible}
                className={'custom-modal style1 add-new-address'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                    <Form
                        ref={this.addressFormRef}
                        id='add_address'
                        name='add_address'
                        onFinish={this.onFinishAddAddress}
                        scrollToFirstError
                        layout={'vertical'}
                        initialValues={this.getInitialValue()}
                        autoComplete="off"
                    >
                        <Row gutter={18}>
                            <Col span={12}>
                                <Form.Item
                                    label='First Name'
                                    name='fname'
                                    rules={[required('First name')]}
                                >
                                    <Input className="shadow-input" placeholder={'...'}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='Last Name'
                                    name='lname'
                                    rules={[required('Last name')]}
                                >
                                    <Input className="shadow-input" placeholder={'...'}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={18}>
                            <Col span={12}>
                                <Form.Item
                                    label='Add Label'
                                    name='address_label'
                                    rules={[required('Address')]}
                                >
                                    <Select
                                        allowClear
                                        placeholder={'Home,Work,Bussiness...'}
                                        className="shadow-input"
                                        showArrow={false}
                                    >
                                        <Option value='Home'>Home</Option>
                                        <Option value='Work'>Work</Option>
                                        <Option value='Business'>Business</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='Address'
                                    name='address_1'
                                    // rules={[required('Address')]}
                                >
                                     <PlacesAutocomplete
                                        name='address'
                                        className='shadow-input'
                                        handleAddress={this.handleAddress}
                                        addressValue={address}
                                        placeholder={'address'}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={18}>
                            <Col span={12}>
                                <Form.Item
                                    label='Country'
                                    name='country'
                                    rules={[required()]}
                                >
                                    {/* <Input className="shadow-input" /> */}
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        onChange={this.handleCountryChange}
                                        allowClear
                                        placeholder={'Select your country'}
                                        className="shadow-input"
                                    >
                                        {allCountries && allCountries.map((el) => {
                                            return <Option value={el.name}>{el.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='City'
                                    name='city'
                                    rules={[required()]}
                                >
                                    {/* <Input className="shadow-input" /> */}
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        allowClear
                                        placeholder={'Select city'}
                                        className="shadow-input"
                                    >
                                        {cityOfCountry && cityOfCountry.map((el) => {
                                            return <Option value={el.name}>{el.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={18}>
                            <Col span={12}>
                                <Form.Item
                                    label='Postcode'
                                    name='postalcode'
                                    rules={[required('Pincode')]}
                                >
                                    <Input className="shadow-input" placeholder={'...'}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='Phone'
                                    name='phone_number'
                                    rules={[required('Phone Number')]}
                                >
                                    <Input className="shadow-input"  placeholder={'...'}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={18}>
                            <Col span={24}>
                                <Form.Item>
                                    {/* <Checkbox.Group className="billing-check"> */}
                                        <Row>
                                            <Col span={7}>
                                                <Checkbox checked={selectedAddress && selectedAddress.is_primary ? true : this.state.is_primary} onChange={(e) => this.setState({is_primary: e.target.checked})}>
                                                    Save as primary address
                                                </Checkbox>
                                            </Col>
                                            <Col span={12} className="bussines-check">
                                                <Checkbox defaultChecked={selectedAddress && selectedAddress.address_2 ? true : false}
                                                    onChange={(e) => {
                                                        this.setState({ billingAddress: e.target.checked })
                                                    }}
                                                >Billing address is same as shipping address</Checkbox>
                                            </Col>
                                        </Row>
                                    {/* </Checkbox.Group> */}
                                </Form.Item>
                            </Col>
                        </Row>                        
                            <Button htmlType="submit" size='large' className='btn-orange fm-btn'>Save</Button>                       
                    </Form>
                </Modal>
            </Fragment>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, common } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
};
export default connect(mapStateToProps, { enableLoading, disableLoading, saveUserAddress })(AddUserAddress);