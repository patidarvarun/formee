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
    Rate,
    Modal,
    Avatar,
    Radio
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { required, whiteSpace, maxLengthC } from '../../config/FormValidation'
import { langs } from '../../config/localization';
import { addReveiw } from '../../actions'
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
    wrapperCol: { offset: 7, span: 13 },
    className: 'align-center pt-20'
};

class LeaveReviewModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }


    /**
     * @method handleRatingChange
     * @description handle rating selection
     */
    handleRatingChange = e => {
        
        this.setState({
            value: e.target.value,
        });
    };

    /**
     * @method onFinish
     * @description handle on submit
     */
    onFinish = (values) => {
        const { classifiedDetail, loggedInDetail } = this.props
        const requestData = {
            classified_id: classifiedDetail.id,
            user_id: loggedInDetail.id,
            review: values.review,
            rating: values.rating
        }
        
        this.props.addReveiw(requestData, res => {
            if (res.status === STATUS_CODES.CREATED) {
                this.props.callNext()
                toastr.success(langs.success, MESSAGES.REVIEW_ADD_SUCCESS)
                this.props.onCancel()
            }
        })
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const { visible, classifiedDetail } = this.props;
        const { value } = this.state
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <Modal
                title='Leave a Review'
                visible={visible}
                className={'custom-modal style1'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <div className='padding'>
                    <Row className='mb-35'>
                        <Col md={11}>
                            <Text className='fs-18'>To :
                    <Avatar
                                    src={classifiedDetail.classified_users &&
                                        classifiedDetail.classified_users.image_thumbnail ?
                                        classifiedDetail.classified_users.image_thumbnail :
                                        <Avatar size={36} icon={<UserOutlined />} />}
                                    size={30}
                                    className='ml-6 mr-6'
                                />

                                {classifiedDetail.classified_users && classifiedDetail.classified_users.name}
                            </Text>
                        </Col>
                        <Col md={9} className='align-right'>
                            <Text className='text-gray'>
                                {classifiedDetail.classified_users &&
                                    `(Member since : ${classifiedDetail.classified_users.member_since})`}
                            </Text>
                        </Col>
                    </Row>
                    <Form
                        {...layout}
                        name='basic'
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            label='Select your rate'
                            name='rating'
                            rules={[required('')]}
                        >
                            <Radio.Group onChange={this.handleRatingChange} value={value}>
                                <Radio style={radioStyle} value={5}>
                                    <Rate disabled defaultValue={5} />  5 Excelent
                                </Radio>
                                <Radio style={radioStyle} value={4}>
                                    <Rate disabled defaultValue={4} />  4 Very Good
                        </Radio>
                                <Radio style={radioStyle} value={3}>
                                    <Rate disabled defaultValue={3} />  3 Average
                        </Radio>
                                <Radio style={radioStyle} value={2}>
                                    <Rate disabled defaultValue={2} />  2 Very Poor
                        </Radio>
                                <Radio style={radioStyle} value={1}>
                                    <Rate disabled defaultValue={1} />  1 Terrible
                        </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            label='Body of message (1500) characters remaining'
                            name='review'
                            rules={[required(''), whiteSpace('Review'), maxLengthC(300)]}
                            className="custom-astrix"
                        >
                            <TextArea rows={4} placeholder={'Write your review here'} className='shadow-input' />
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
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
    };
};

export default connect(mapStateToProps, { addReveiw })(LeaveReviewModel);
