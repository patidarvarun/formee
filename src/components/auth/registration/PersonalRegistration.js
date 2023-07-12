import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Redirect } from 'react-router-dom';
import { Form, Input, Space, Typography, Row, Col } from 'antd';
import Icon from '../../customIcons/customIcons';
import { registerUserAPI, registerSocialUserAPI, getProfileData, fetchMasterDataAPI, getUserMenuData } from '../../../actions/index';
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID, DEFAULT_DEVICE_ID, DEFAULT_DEVICE_TYPE, DEFAULT_MODEL } from '../../../config/Config';
import SocialButton from '../login/SocialLoginButton'
import { STATUS_CODES } from '../../../config/StatusCode'
import { setLocalStorage } from '../../../common/Methods'
import { langs } from '../../../config/localization';
import { required, email, password, confirmPassword, minLength, whiteSpace } from '../../../config/FormValidation'
const { Title, Text, Paragraph } = Typography;

class PersonalRegistration extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isRedirect: false,
            isSocialLogin: false,
            redirectToDashBoard: false,
            defaultRedirect: false
        }
    }

    /**
    * @method componentDidUpdate
    * @description update form submit from outside button
    */
    componentDidUpdate(prevProps, prevState) {
        if (this.props.submitFromOutside) {
            this.onFinish();
        }
    }

    /**
     * @method onFinish
     * @description called to submit form 
     */
    onFinish = (values) => {
        if (this.onFinishFailed() !== undefined) {
            return true
        } else {
            if (values !== undefined) {
                const requestData = {
                    fname: values.fName,
                    lname: values.lName,
                    email: values.email,
                    password: values.password,
                    password_confirmation: values.password_confirmation,
                    device_type: DEFAULT_DEVICE_TYPE,
                    device_id: DEFAULT_DEVICE_ID,
                    device_model: DEFAULT_MODEL,
                    network_provider: '',
                    os_version: '',
                    app_version_no: ''
                }
                this.props.registerUserAPI(requestData, res => {
                    if (res.status === STATUS_CODES.CREATED) {
                        toastr.success(langs.success, res.data.msg)
                        setTimeout(() => {
                            this.setState({ isRedirect: true })
                        }, 3000);
                    }
                })
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
     * @method handleSocialLogin
     * @description handle social login 
     */
    handleSocialLogin = (user) => {
        const { registerSocialUserAPI } = this.props;
        const { _provider, _profile } = user;
        const { name, email, id, profilePicURL } = _profile
        let reqBody = {
            name,
            email,
            social_id: id,
            avatar: profilePicURL,
            login_type: _provider,
            device_type: DEFAULT_DEVICE_TYPE,
            device_id: DEFAULT_DEVICE_ID,
            device_model: DEFAULT_MODEL,
            network_provider: '',
            os_version: '',
            app_version_no: '',
            password: ''
        }
        registerSocialUserAPI(reqBody, (res) => {
            if (res === undefined || res.status === undefined) return
            if (res.status === 200) {
                toastr.success(langs.success, langs.messages.login_success)
                setLocalStorage(res.data);
                const data = res.data && res.data.data
                this.props.getProfileData(data.token, { user_id: data.id }, (res) => { })
                if (data.user_type === langs.key.private && data.menu_skipped === 0) {
                    this.setState({ isSocialLogin: true, isRedirect: false })
                } else if (data.user_type !== langs.key.private) {
                    this.setState({ redirectToDashBoard: true, isRedirect: false })
                } else {
                    this.setState({ isRedirect: true })
                }
                setTimeout(() => {
                    this.props.fetchMasterDataAPI({ timeinterval: 0 }, res => { })
                    this.props.getProfileData(data.token, { user_id: data.id }, (res) => { })
                    this.props.getUserMenuData(data.token)
                }, 3000);
            }
        })
    }

    /**
    * @method handleSocialLoginFailure
    * @description handle social login failed 
    */
    handleSocialLoginFailure = (err) => {
        
    }

    /**
     * @method render
     * @description render component 
     */
    render() {
        const { isRedirect, isSocialLogin, redirectToDashBoard } = this.state;
        if (isRedirect) {
            return (
                <Redirect push
                    to={{
                        pathname: '/'
                    }}
                />
            );
        }
        if (isSocialLogin) {
            return (
                <Redirect push
                    to={{
                        pathname: '/intermediate'
                    }}
                />
            );
        } else if (redirectToDashBoard) {
            return (
                <Redirect push
                    to={{
                        pathname: '/dashboard'
                    }}
                />
            );
        }

        
        const trimInput = ({ target }) => {
            const { id, value } = target;
            
            this.formRef.current && this.formRef.current.setFieldsValue({
                [id]: value.trim()
            })
        }

        return (
            <Row>
                <Col span={12}>
                    <div className='signup-left-box'>
                        <Title level={1} className='uppercase'>Sign up</Title>
                        <div className='signup-left-box-bottom'>
                            <Paragraph className='pb-25'>or use facebook / google</Paragraph>
                            <Space size={'middle'}>
                                <SocialButton
                                    provider='facebook'
                                    appId={FACEBOOK_APP_ID}
                                    onLoginSuccess={this.handleSocialLogin}
                                    onLoginFailure={this.handleSocialLoginFailure}
                                    className='facebook-btn'
                                    size={'large'}
                                >
                                    <Icon icon='facebook' size='21' />
                                </SocialButton>
                                <SocialButton
                                    provider='google'
                                    clientid={GOOGLE_CLIENT_ID}
                                    onLoginSuccess={this.handleSocialLogin}
                                    onLoginFailure={this.handleSocialLoginFailure}
                                    className='google-btn'
                                    size={'large'}
                                >
                                    <Icon icon='google-plus' size='26' />
                                </SocialButton>
                            </Space>
                            <div className='align-center pt-40'>
                                <Text className='fs-10 inline-block'>By Signing up or logging in, you agree to our <br />terms & conditions and privacy policy.</Text>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <Form
                        layout='vertical'
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        scrollToFirstError
                        id='personal-form'
                        ref={this.formRef}
                    >
                        <Form.Item
                            label='First Name'
                            name='fName'
                            rules={[required('First name'), whiteSpace('First name')]}

                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Last Name'
                            name='lName'
                            rules={[required('Last name'), whiteSpace('Last name')]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Email'
                            name={'email'}
                            onChange={({ target }) => {
                                this.formRef.current.setFieldsValue({
                                    [target.id]: target.value.trim()
                                });
                            }}
                            rules={[required('Email id'), email]}
                        >
                                <Input />
                            </Form.Item>
                        <Form.Item
                            name='password'
                            label='Password'
                            rules={[password, minLength(8)]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label='Confirm Password'
                            name='password_confirmation'
                            dependencies={['password']}
                            hasFeedback
                            rules={[confirmPassword,
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(langs.validation_messages.passwordNotMatch);
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}


export default PersonalRegistration = connect(null, { registerUserAPI, registerSocialUserAPI, getProfileData, fetchMasterDataAPI, getUserMenuData })(PersonalRegistration)
