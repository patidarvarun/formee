import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {
    Form,
    Input,
    Typography,
    Row,
    Col,
    Button,
    Modal,
    Checkbox
} from 'antd';
import { required, whiteSpace, maxLengthC } from '../../config/FormValidation'
import { enableLoading, disableLoading, contactAdSendMessageAPI } from '../../actions'
import { langs } from '../../config/localization';
import { MESSAGES } from '../../config/Message'
import { STATUS_CODES } from '../../config/StatusCode'
const { Text } = Typography;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13, offset: 1 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { span: 24 },
    className: 'align-center pt-20'
};

class ContactModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            inspection: 0,
            price: 0,
            sales: 0,
            property: 0,
            count: 1500
        };
    }

    /**
     * @method onFinish
     * @description handle on submit
     */
    onFinish = (values) => {
        
        this.props.enableLoading()
        const { loggedInDetail, receiverId, classifiedid, contactType } = this.props;
        const { sales, price, property, inspection } = this.state
        const requestData = {
            user_id: loggedInDetail.id,
            classifieduser_id: receiverId,
            classifiedid: classifiedid,
            massage: values.message,
        }
        if (contactType === 'realstate') {
            requestData.inspection_times = inspection ? 1 : 0
            requestData.price_guide = price ? 1 : 0
            requestData.contract_of_sale = sales ? 1 : 0
            requestData.similar_properties = property ? 1 : 0
        }
        
        this.props.contactAdSendMessageAPI(requestData, res => {
            this.props.disableLoading()
            if (res.status === STATUS_CODES.OK) {
                toastr.success(langs.success, MESSAGES.MESSAGE_SENT_SUCCESS)
                this.props.onCancel()
            }
        })
    }

    /**
     * @method handleInspection
     * @description handle inspection
     */
    handleInspection = (e) => {
        this.setState({ inspection: e.target.checked })
    }

    /**
     * @method handleProperty
     * @description handle property
     */
    handleProperty = (e) => {
        this.setState({ property: e.target.checked })
    }

    /**
     * @method handleSale
     * @description handle sale
     */
    handleSale = (e) => {
        this.setState({ sales: e.target.checked })
    }

    /**
     * @method handlePrice
     * @description handle price
     */
    handlePrice = (e) => {
        this.setState({ price: e.target.checked })
    }

    /**
     * @method handleTextAreaChange
     * @description handle text area change
     */
    handleTextAreaChange = ({ target: { value } }) => {
        let count = ''
        if (value.length <= 1500) {
            count = 1500 - value.length
        } else {
            count = 0
        }
        this.setState({ message: value, count: count });
    };

    /**
     * @method render
     * @description render component
     */
    render() {
        const { visible, classifiedDetail, userDetails, contactType } = this.props;
        const { count } = this.state
        return (
            <Modal
                title='Contact to advertiser'
                visible={visible}
                className={'custom-modal style1 custom-modal-contactmodal-style'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <div className='padding'>
                    <Row className='mb-35'>
                        <Col md={11}>
                            <Text className='fs-18'>To :  {classifiedDetail.classified_users && classifiedDetail.classified_users.name} </Text>
                        </Col>
                        <Col md={9} className='align-right'>
                            <Text className='text-gray'> {classifiedDetail.classified_users &&
                                `(Member since ${classifiedDetail.classified_users.member_since})`}</Text>
                        </Col>
                    </Row>
                    <Form
                        {...layout}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            label='Name'
                            name='name'
                        >
                            <Input disabled className='shadow-input' defaultValue={userDetails.name} />
                        </Form.Item>
                        {contactType !== undefined && contactType === 'realstate' && <Row>
                            <Col span={6}></Col>
                            <Col span={13} offset={1}>
                                <Text className='strong'>Please send me more informations</Text>
                                <Row gutter={[10, 10]} className='mt-6 mb-25'>

                                    <Col span={12}>
                                        <Checkbox onChange={this.handleInspection}>Inspection times</Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox onChange={this.handleSale}>Contract of sale</Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox onChange={this.handlePrice}>Price guide</Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox onChange={this.handleProperty}>Similar properties</Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>}
                        {/* <Row>
                            <Col xs={24} sm={24} md={6} lg={6} className="body-msg-label">
                                <label for="message" class="ant-form-item-no-colon">Body of Message (1500) characters remaining<span>*</span></label>
                            </Col>
                            <Col xs={24} sm={24} md={13} lg={13} offset={1}>
                                <TextArea rows={6} placeholder={'Write your message here'} className='shadow-input' />
                            </Col>
                        </Row> */}
                        <Form.Item
                            label={<label for="message" class="ant-form-item-no-colon">Body of message (max 1500) <span style={{ color: 'red' }}>{count}</span> characters remaining</label>}
                            name='message'
                            className="custom-astrix"
                            rules={[required(''), whiteSpace('Message'), maxLengthC(1500)]}
                        >
                            <TextArea
                                rows={4}
                                placeholder={'Write your message here'}
                                className='shadow-input'
                                onChange={this.handleTextAreaChange}
                            />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type='default' htmlType='submit'>
                                Send
                        </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth, profile } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {}
    };
};

export default connect(mapStateToProps, { contactAdSendMessageAPI, enableLoading, disableLoading })(ContactModal);
