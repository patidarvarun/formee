
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Input, Radio, Layout, Avatar, Row, Typography, Button, Menu, Dropdown, Pagination, Card, Tabs, Form, Select, Rate, Alert, Modal, DatePicker, TimePicker } from 'antd';
import { enableLoading, disableLoading, rescheduleHanymanBooking } from '../../../../../actions'
import { toastr } from 'react-redux-toastr';
import { MESSAGES } from '../../../../../config/Message';
import { langs } from '../../../../../config/localization';
import { required, whiteSpace, maxLengthC } from '../../../../../config/FormValidation';
import './profile-vendor-handyman.less';
import { DISPUTE_REASON } from '../../../../../config/Helper';
import moment from 'moment';

const tailLayout = {
    wrapperCol: { span: 24 },
    className: 'align-center pt-20'
};

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
    labelAlign: 'left',
    colon: false,
};
const { TextArea } = Input;

class ReviewModal extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            bookingResponse: '',

        }
    }

    // /**
    //  * @method componentWillReceiveProps
    //  * @description receive props
    //  */
    // componentWillReceiveProps(nextprops, prevProps) {
    //     const { selectedBookingDetail } = this.props
    //     let catIdInitial = selectedBookingDetail.id
    //     let catIdNext = nextprops.selectedBookingDetail.id
    //     if (catIdInitial !== catIdNext) {
    //         
    //         this.formRef.current.setFieldsValue({
    //             date: moment(nextprops.selectedBookingDetail.date, 'YYYY-MM-DD'),
    //             to: moment(nextprops.selectedBookingDetail.to, 'HH:mm:ss'),
    //             from: moment(nextprops.selectedBookingDetail.from, 'HH:mm:ss')
    //         });

    //     }
    // }


    // /** 
    //  * @method getInitialValue
    //  * @description returns Initial Value to set on its Fields 
    //  */
    // getInitialValue = () => {
    //     const { selectedBookingDetail } = this.props;
    //     return {
    //         date: moment(selectedBookingDetail.date, 'YYYY-MM-DD'),
    //         // date: selectedBookingDetail.date,
    //         from: moment(selectedBookingDetail.from, 'HH:mm:ss'),
    //         to: moment(selectedBookingDetail.to, 'HH:mm:ss')
    //     }
    // }

    renderDisputeReason = () => {
        return (
            <Select
                placeholder='Select'
                className="shadow-input"
                size='large'
                onChange={(e) => {
                    if (e === 'Other') {
                        this.setState({ isOtherDisputeResaon: true });
                    } else {
                        this.setState({ isOtherDisputeResaon: false });
                    }
                }}
                allowClear
                getPopupContainer={trigger => trigger.parentElement}
            >
                {DISPUTE_REASON.map((val, i) => {
                    return (
                        <Select.Option key={`${i}_dispute_reason`} value={val.label}>{val.value}</Select.Option>
                    )
                })}
            </Select>
        )
    }

    render() {
        const { visibleReviewModal, valid_customer_rating } = this.props
        
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <Modal
                title='Leave a Review'
                visible={visibleReviewModal}
                className={'custom-modal style1'}
                footer={false}
                onCancel={() => this.props.handleClose()}
            >
                <div className='padding'>
                    <Form
                        {...layout}
                        name='basic'
                        onFinish={(values) => this.props.submitReview(values)}
                    >
                        <Form.Item
                            label='Select your rate'
                            name='rating'
                            rules={[required('')]}
                        >
                            <Radio.Group onChange={this.handleRatingChange} value={valid_customer_rating}>
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
                            label='Body of message (300) characters remaining'
                            name='review'
                            rules={[required(''), whiteSpace('Review'), maxLengthC(300)]}
                            className="custom-astrix"
                        >
                            <TextArea rows={4} placeholder={'Write your review here'} className='shadow-input' />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type='default' htmlType='submit'>Send</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>

        )
    }
}

const mapStateToProps = (store) => {
    const { auth, profile } = store;
    
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
        traderDetails: profile.traderProfile !== null ? profile.traderProfile : null

    };
};
export default connect(
    mapStateToProps,
    { enableLoading, disableLoading, rescheduleHanymanBooking }
)(ReviewModal);