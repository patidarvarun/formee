import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import moment from 'moment'
import { toastr } from 'react-redux-toastr'
import { Form, Input, Button, Divider, Row, Col, Typography } from 'antd';
import { getTraderMonthWellbeingBooking, getSpaDietitianSpaBooking, updateSpaDietitianSpaBooking } from '../../../../actions';
import { required, whiteSpace } from '../../../../config/FormValidation';
import PlacesAutocomplete from '../../../common/LocationInput';
import Icon from '../../../customIcons/customIcons';
const { Title, Text } = Typography;

class Step3 extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        const { step3Data } = props.mergedStepsData;
        const { location, lat, lng, city, state, pincode } = this.props.loggedInDetail
        console.log('this.props.loggedInDetail', this.props.loggedInDetail)
        this.state = {
            address: step3Data.location ? step3Data.location : location,
            isSubmit: false,
            city: step3Data.city ? step3Data.city : city,
            lat: step3Data.lat ? step3Data.lat : lat,
            lng: step3Data.lng ? step3Data.lng : lng,
            state: step3Data.state ? step3Data.state : state,
            pincode: step3Data.pincode ? step3Data.pincode : pincode,
        };
    }

    /**
     * @method componentDidMount
     * @description called before mounting the component
     */
    componentDidMount() {
        const { location } = this.props.loggedInDetail
        const { step3Data } = this.props.mergedStepsData

        if (step3Data) {
            this.setState({ address: step3Data.location })
        } else {
            this.setState({ address: location })
        }
    }

    /**
     * @method onFinish
     * @description called to submit form 
     */
    onFinish = (values) => {
        const { address, city, latLng, state, pincode } = this.state
        const { lat, lng } = this.props.loggedInDetail
        if (this.onFinishFailed() !== undefined) {
            return true
        } else if (address === '' || (state === '' || city === '' || pincode === '')) {
            toastr.warning('Please enter your full address.')
            return true
        } else {
            this.setState({ isSubmit: false })
            if (values !== undefined) {
                const reqData = {
                    name: values.contactName,
                    phone_number: values.phoneNumber !== null && values.phoneNumber !== '' ? `${this.props.loggedInDetail.phonecode} ${values.phoneNumber}` : '', //values.phoneNumber,  
                    phone_code: this.props.loggedInDetail.phonecode,
                    location: address,
                    city: city,
                    lat: latLng && latLng.lat ? latLng.lat : lat,
                    lng: latLng && latLng.lng ? latLng.lng : lng,
                    state: state,
                    pincode: pincode
                }
                this.props.nextStep(reqData, 3)
            }
        }
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
        let pincode = ''
        result.address_components.map((el) => {
            if (el.types[0] === 'administrative_area_level_1') {
                state = el.long_name
            } else if (el.types[0] === 'administrative_area_level_2') {
                city = el.long_name
            } else if (el.types[0] === 'postal_code') {
                this.setState({ postal_code: el.long_name })
                pincode = el.long_name
            }
        })
        this.setState({ address: address, city: city, latLng: latLng, state: state, pincode: pincode })
    }
    /**
    * @method render
    * @description render component
    */
    render() {
        const { loggedInDetail } = this.props;
        const { address, isSubmit, state, city, pincode } = this.state

        const { name, location, mobile_no } = loggedInDetail
        const { step3Data, step1Data } = this.props.mergedStepsData
        return (
            <Fragment>
                <div className='wrap fm-step-form fm-step-three rb-step-three'>
                    <Row className="request-booking-shadow-input shadow-input pl-15 pr-15" align="middle">
                        <Icon className="pr-2 clock-icon " icon='clock' size='16' />
                        <Col>
                            <Text className="d-flex align-center">
                                Request Booking   &nbsp;&nbsp;
                                {step1Data && step1Data.booking_date && step1Data.selectedItem && moment(step1Data.booking_date).format("ddd, MMM Do YYYY")} &nbsp;&nbsp;
                                {step1Data && step1Data.selectedItem.length !== 0 && `${step1Data.selectedItem[0].toLowerCase()} - ${step1Data.selectedItem[step1Data.selectedItem.length - 1].toLowerCase()}`} &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                                {step1Data && step1Data.booking_date && step1Data.selectedItem.length !== 0 && `${step1Data.selectedItem.length - 1} hours`}
                            </Text>
                        </Col>
                    </Row>
                    <Form
                        name='user-bookinginfo'
                        initialValues={{ contactName: step3Data && step3Data.name ? step3Data.name : name, location: step3Data && step3Data.location ? step3Data.location : location, phoneNumber: step3Data && step3Data.phone_number ? step3Data.phone_number : mobile_no }}
                        layout='horizontal'
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        scrollToFirstError
                        id='user-bookinginfo'
                        ref={this.formRef}
                    >
                        <h4 className='fm-input-heading'>Your Information</h4>
                        <Form.Item label='Contact Name' name='contactName'>
                            <Input rules={[required('Contact Name'), whiteSpace('Contact Name')]} placeholder={'Enter your first name and last name'} className='shadow-input' />
                        </Form.Item>
                        <Form.Item label='Address' name='location'>
                            <PlacesAutocomplete
                                name='address'
                                handleAddress={this.handleAddress}
                                addressValue={address}
                                className='shadow-input'
                            />
                        </Form.Item>
                        <Form.Item label='Phone Number' name='phoneNumber'>
                            <Input placeholder={'Enter your phone number'} className='shadow-input' rules={[required('Phone Number'), whiteSpace('Phone Number')]} />
                        </Form.Item>
                        <Divider />
                        <Form.Item className='fm-apply-label' label='Do you have code promo?'>
                            <div className='fm-apply-input'>
                                <Input placeholder={'Enter promotion code'} enterButton='Search' className='shadow-input' />
                                <Button type='primary' className='fm-apply-btn' >Apply</Button>
                            </div>
                            <Link className='fm-clear-link'>Clear</Link>
                        </Form.Item>
                        <Form.Item >
                            <div className='steps-action '>
                                <Button onClick={() => { this.props.preStep() }} type='primary' size='middle' className='btn-trans fm-btn' >Back</Button>
                                <Button htmlType="submit" onClick={() => this.setState({ isSubmit: true })} type='primary' size='middle' className='btn-blue fm-btn' >Next</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser
    };
};

export default connect(
    mapStateToProps, { getTraderMonthWellbeingBooking, getSpaDietitianSpaBooking, updateSpaDietitianSpaBooking }
)(Step3);