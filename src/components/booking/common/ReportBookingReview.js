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
import { required, whiteSpace, maxLengthC } from '../../../config/FormValidation'
import { langs } from '../../../config/localization';
import {reportUserFeedback, reportUserReviewAPI,reportBookingReview } from '../../../actions'
import { STATUS_CODES } from '../../../config/StatusCode'
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

class ReportBookingReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            reportReviewModel: false
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
        const { selectedReview, loggedInDetail } = this.props
        if(selectedReview){
            const requestData = {
                rating_id: selectedReview && selectedReview.id,
                user_id: loggedInDetail.id,
                reason: values.reason,
                report_type: values.report_type
            }
            this.props.reportBookingReview(requestData, res => {
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
                title='Report Review'
                visible={visible}
                className={'custom-modal style1 report-this-ads'}
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
                                <Radio style={radioStyle} value={'This review is not relevant to this place'}>
                                    This review is not relevant to this place
                                </Radio>
                                <Radio style={radioStyle} value={'Conflict of intrest'}>
                                    Conflict of intrest
                                </Radio>
                                <Radio style={radioStyle} value={'Offensive and sexually explicit'}>
                                    Offensive and sexually explicit
                                </Radio>
                                <Radio style={radioStyle} value={'Privacy concern'}>
                                    Privacy concern
                                </Radio>
                                <Radio style={radioStyle} value={'Legal issue'}>
                                    Legal issue
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

export default connect(mapStateToProps, {reportUserFeedback, reportUserReviewAPI,reportBookingReview })(ReportBookingReview);
