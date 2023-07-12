import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Typography, Tabs, Form, Input, Select, Button, Divider, Checkbox, Table, InputNumber, Card } from 'antd';
import { enableLoading, disableLoading, saveUserAddress } from '../../../../actions/index';
import { toastr } from 'react-redux-toastr';
import { required } from '../../../../config/FormValidation';
import { MESSAGES } from "../../../../config/Message";

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
        this.state ={
            address: '',
        }
    }


    /**
     * @method componentWillReceiveProps
     * @description receive props from component
     */
     componentWillReceiveProps(nextprops, prevProps) {
        let data = nextprops.selectedAddress
            this.setState({address: data})
            if(data && nextprops.isEdit){
                this.addressFormRef.current &&  this.addressFormRef.current.setFieldsValue({
                    fname: data.fname,
                    lname: data.lname,
                    address_1: data.address_1,
                    address_2: data.address_2,
                    country: data.country,
                    city: data.city,
                    state: data.state,
                    postalcode: data.postalcode ? data.postalcode : '',
                    phone_number: data.phone_number ? data.phone_number : '' 
                });
            }  
        // }
    }

    /**
     * @method onFinishAddAddress
     * @description save address
     */
    onFinishAddAddress = (values) => {
        const { address } = this.state
        const { isEdit } = this.props
        if (this.onFinishFailed() !== undefined) {
            return true
        } else {
            if (values !== undefined) {
                const { loggedInDetail } = this.props;
                const { id } = loggedInDetail;
                values.user_id = id;
                const reqData = {
                    ...values
                }
                if(isEdit){
                    reqData.address_id = address.id
                    this.saveUserAddress(reqData,MESSAGES.ADDRESS_UPDATE_SUCCESS)
                }else {
                    this.saveUserAddress(reqData,MESSAGES.ADDRESS_ADD_SUCCESS)
                }
            }
        }
    }

    /**
     * @method saveUserAddress
     * @description handle save address api call
     */
    saveUserAddress = (reqData, message) => {
        const { isEdit } = this.props
        this.props.saveUserAddress(reqData, (response) => {
            if (response.status === 200) {
                this.addressFormRef.current.resetFields();
                this.props.callNext()
                toastr.success(message)
                this.props.callBackResponse(response);
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
     * @method render
     * @description render component
     */
    render() {
        const { isEdit } = this.props
        return (
            <Fragment>
                <Card>
                    <Form
                        ref={this.addressFormRef}
                        onFinish={this.onFinishAddAddress}
                        onFinishFailed={this.onFinishFailed}
                        // initialValues={this.getInitialValue()}
                        scrollToFirstError
                        layout={'vertical'}
                    >
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label='First Name'
                                    name='fname'
                                    rules={[required('First name')]}
                                >
                                    <Input className="shadow-input" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='Last Name'
                                    name='lname'
                                    rules={[required('Last name')]}
                                >
                                    <Input className="shadow-input" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label='Address Line 1'
                                    name='address_1'
                                    rules={[required('Address')]}
                                >
                                    <Input className="shadow-input" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='Address Line 2'
                                    name='address_2'
                                    rules={[required('Address')]}
                                >
                                    <Input className="shadow-input" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label='City'
                                    name='city'
                                    rules={[required()]}
                                >
                                    <Input className="shadow-input" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='State'
                                    name='state'
                                    rules={[required()]}
                                >
                                    <Input className="shadow-input" />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label='Country'
                                    name='country'
                                    rules={[required()]}
                                >
                                    <Input className="shadow-input" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='Postcode'
                                    name='postalcode'
                                    rules={[required('Pincode')]}
                                >
                                    <Input className="shadow-input" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <div className='steps-action'>
                                <Button 
                                    htmlType="submit" 
                                    type='primary' 
                                    size='middle' 
                                    className='btn-blue fm-btn'
                                >{isEdit ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
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