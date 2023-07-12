import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {
    Form,
    Input,
    Typography,
    Button,
    Modal,
    Radio
} from 'antd';
import { required, whiteSpace, maxLengthC } from '../../../../config/FormValidation'
import { langs } from '../../../../config/localization';
import {reportUserFeedback, reportVendorReview } from '../../../../actions'
import { STATUS_CODES } from '../../../../config/StatusCode'
const { Text } = Typography;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 23 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { span: 23 },
    className: 'align-center pt-20'
};

class ReportReview extends React.Component {
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
        const { selectedReview, loggedInDetail,is_user } = this.props
        if(is_user){
            const requestData = {
                retail_feedback_id: selectedReview.id,
                user_id: loggedInDetail.id,
                reason: values.reason,
                report_type: values.report_type
            }
            this.props.reportUserFeedback(requestData, res => {
                console.log(res.status, 'res: ', res);
                if (res.status === STATUS_CODES.OK) {
                    toastr.success(langs.success, res.data.msg)
                    this.props.onCancel()
                }
            })
        }else {
            const requestData = {
                retail_review_id: selectedReview.id,
                user_id: loggedInDetail.id,
                reason: values.reason,
                report_type: values.report_type
            }
            this.props.reportVendorReview(requestData, res => {
                console.log(res.status, 'res: ', res);
                if (res.status === STATUS_CODES.OK) {
                    toastr.success(langs.success, res.data.msg)
                    this.props.onCancel()
                }
            })
        }
        
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
            height: '26px',
            lineHeight: '26px',
        };

        return (
            <Modal
                title='Report this Review'
                visible={visible}
                className={'custom-modal style1 report-this-ads report-review-style1'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <div className='padding'>

                    <Form
                        {...layout}
                        name='basic'
                        onFinish={this.onFinish}
                    >
                        <label className="strong">What's wrong with this review?</label>
                        <Form.Item
                            name='report_type'
                            className='radio-inpt'    
                            rules={[required('')]}
                        >
                            <Radio.Group onChange={this.handleRatingChange} value={value}>
                                <Radio style={radioStyle} value={'This is a inappropriate'}>
                                    This is a inappropriate
                                </Radio>
                                <Radio style={radioStyle} value={'This is a abuse'}>
                                    This is a abuse
                                </Radio>
                                <Radio style={radioStyle} value={'This is spam'}>
                                    This is spam
                                </Radio>
                                <Radio style={radioStyle} value={'Other'}>
                                    Other
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name='reason'
                            rules={[required(''), whiteSpace('Reason'), maxLengthC(300)]}
                            className="custom-astrix"
                        >
                            <TextArea rows={4} placeholder={'Write your comment here'} className='shadow-input' />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type='default' htmlType='submit'>
                                Report Review
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

export default connect(mapStateToProps, {reportUserFeedback, reportVendorReview })(ReportReview);
