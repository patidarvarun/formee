import React, { Fragment } from 'react';
import { required, email, minLength, whiteSpace, validPhone } from '../../../../config/FormValidation'
import { Button, Row, Tabs, Typography, Divider } from 'antd';
import { Form, Input, Col } from 'antd';
import { langs } from '../../../../config/localization';
import { connect } from 'react-redux';
import PlacesAutocomplete from '../../../common/LocationInput'

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

class BasicInfo extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            submitBussinessForm: false,
            submitFromOutside: false,
            imageUrl: '',
            key: 1,
            value: '',
            address: this.props.resumeDetails ? this.props.resumeDetails.home_location : '',
            // address: '',
            postal_code: '',
            isOpenResumeModel: false,
            values: {}
        };
    }

    /** 
     * @method getUserDetails
     * @description call to get user details by Id 
     */
    getUserDetails = () => {
        const { id } = this.props.loggedInUser
        this.props.getUserProfile({ user_id: id }, (res) => { })
    }

    /**
     * @method onFinish
     * @description called to submit form 
     */
    onFinish = (values) => {
        
        values.home_location = this.state.address;
        this.props.nextStep(values, 1)
    }

    /**
     * @method blanckCheck
     * @description Blanck check of undefined & not null
     */
    blanckCheck = (value, withDash = false) => {
        if (value !== undefined && value !== null && value !== 'Invalid date' && value !== '', value !=='undefined') {
            
            return withDash ? `- ${value}` : value
        } else {
            return ''
        }
    }
    /** 
     * @method getInitialValue
     * @description returns Initial Value to set on its Fields 
     */
    getInitialValue = () => {
        
        if (this.props.resumeDetails) {           
            const { first_name, last_name, home_location, phone_number, headline, email } = this.props.resumeDetails;
            let temp = {
                first_name: this.blanckCheck(first_name),
                last_name: this.blanckCheck(last_name),
                home_location,
                phone_number: this.blanckCheck(phone_number),
                headline: this.blanckCheck(headline),
                email: this.blanckCheck(email)
            }
            // this.setState({ address: home_location })
            return temp;
        }
    }

    /** 
      * @method handleAddress
      * @description handle address change Event Called in Child loc Field 
      */
    handleAddress = (result, address, latLng) => {
        
        this.setState({ address: result.formatted_address })
        this.formRef.current.setFieldsValue({
            home_location: address
        });
    }

    /**
     * @method render
     * @description render component  
     */
    render() {
        const { name } = this.props.userDetails;
        const { key, imageUrl, loading, isOpenResumeModel, values, address } = this.state;
        return (
            <div className='card-container'>
                <Tabs type='card'>
                    <TabPane tab='Basic Info' key='1'>
                        <Form
                            onFinish={this.onFinish}
                            initialValues={this.getInitialValue()}
                            layout={'vertical'}
                            ref={this.formRef}
                        >
                            <div className='inner-content'>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            label='First Name'
                                            name='first_name'
                                            rules={[required('First name'), whiteSpace('First name')]}
                                        >
                                            <Input placeholder="Enter Your First Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label='Last Name'
                                            name='last_name'
                                            rules={[required('Last name'), whiteSpace('Last name')]}
                                        >
                                            <Input placeholder="Enter Your last Name" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={28}>
                                    <Col span={24}>
                                        <Form.Item
                                            label='Email'
                                            name='email'
                                            rules={[required('Email id'), email]}
                                        >
                                            <Input placeholder="Enter Your Email" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={28}>
                                    <Col span={24}>
                                        <Form.Item
                                            label='Phone Number'
                                            name='phone_number'
                                            rules={[{ validator: validPhone }]}
                                        >
                                            <Input type={'number'} placeholder="Enter Your Phone Number" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={28}>
                                    <Col span={24}>
                                        <div className='ant-form-item-label pb-4'>
                                            <label className='ant-form-item'>Headline (optional)</label>
                                        </div>
                                        <Paragraph className='fs-14'>Occupation or Job Title you want to be known for.</Paragraph>
                                        <Form.Item
                                            name='headline'
                                        // rules={[required('Headline')]}
                                        >
                                            <Input placeholder="Enter Your Job Title" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={28}>
                                    <Col span={24}>
                                        <div className='ant-form-item-label pb-4'>
                                            <label className='ant-form-item-required'>Home location</label>
                                        </div>
                                        <Paragraph className='fs-14'>Providing a specific location helps formee connect you with the right job.</Paragraph>
                                        <Form.Item
                                            name='home_location'
                                            rules={[required('Home location'), whiteSpace('Home location')]}
                                        >
                                            <PlacesAutocomplete
                                                handleAddress={this.handleAddress}
                                                myPlaceholder={"Enter Your Location"}
                                                addressValue={address}
                                                clearAddress={(add) => {
                                                    this.formRef.current.setFieldsValue({
                                                        home_location: ''
                                                    });

                                                    this.setState({
                                                        address: ''
                                                    })
                                                }}
                                            />
                                            {/* <input /> */}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <div className='steps-action align-center mb-32'>
                                <Button htmlType='submit' type='primary' size='middle'
                                    className='btn-blue'
                                >NEXT</Button>
                            </div>
                        </Form>
                    </TabPane>
                </Tabs>
            </div >
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, profile, classifieds } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
        resumeDetails: classifieds.resumeDetails !== null ? classifieds.resumeDetails : ''
    };
};
export default connect(
    mapStateToProps, null
)(BasicInfo);