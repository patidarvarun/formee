import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Typography, Form, Input, Button } from 'antd';
import { required, whiteSpace } from '../../../../../../config/FormValidation';
import { buyClass } from '../../../../../../actions';
import moment from 'moment'

class Step3 extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            retailSelected: false,
            classifiedSelected: false,
            category: '',
            subCategory: []
        };
    }

    /**
     * @method onFinish
     * @description called to submit form 
     */
    onFinish = (values) => {
        const { selectedService, selectedDate, selected, step1Data } = this.props;
        let date = moment(selectedDate, 'dd,DD MMM').format('YYYY-MM-DD');
        if (this.onFinishFailed() !== undefined) {
            return true
        } else {
            if (values !== undefined) {
                const reqData = {
                    trader_class_id: selected.id,
                    date,
                    start_time: selectedService.start_time,
                    booking_type: 'non-subscription-based',
                    quantity: step1Data.quantity,
                    customer_name: values.contactName,
                    special_note: this.props.step1Data.additionalComments,
                    // payment_method:'paypal',
                    // email: values.email,
                    customer_phone: values.phoneNumber,
                    // booking_id: '',
                    // phoneCode: this.props.loggedInDetail.phonecode
                }

                this.props.buyClass(reqData, (res) => {
                    if (res.status === 200) {
                        //console.log(res.data.booking_id);
                        const reqData1 = {
                            ...reqData,
                            booking_id: res.data.booking_id
                        };
                        this.props.nextStep(reqData1, 2)
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
    * @method render
    * @description render component
    */
    render() {
        const { loggedInDetail } = this.props;
        const { name, email, mobile_no } = loggedInDetail
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <Fragment>
                <div className='wrap fm-step-form fm-step-three'>
                    <Form
                        name='user-bookinginfo'
                        initialValues={{ contactName: name, email: email, phoneNumber: mobile_no }}
                        layout='horizontal'
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        scrollToFirstError
                        id='user-bookinginfo'
                        ref={this.formRef}
                        {...layout}
                    >
                        <h4 className='fm-input-heading'>Your Information</h4>
                        <Form.Item label='Contact Name' name='contactName'>
                            <Input disabled rules={[required('Contact Name'), whiteSpace('Contact Name')]} placeholder={'Enter your first name and last name'} className='shadow-input' />
                        </Form.Item>
                        <Form.Item label='Email Address' name='email'>
                            <Input disabled rules={[required('Email Address'), email]}
                                placeholder={'Enter your email address'} className='shadow-input'
                                onChange={({ target }) => {
                                    this.formRef.current.setFieldsValue({
                                        [target.id]: target.value.trim()
                                    });
                                }}
                            />
                        </Form.Item>
                        <Form.Item label='Phone Number' name='phoneNumber'>
                            <Input placeholder={'Enter your phone number'} className='shadow-input' disabled
                                rules={[required('Phone Number'), whiteSpace('Phone Number')]} />
                        </Form.Item>

                        <div className='steps-action '>
                            <Button htmlType='submit' type='primary' size='middle' className='btn-blue fm-btn' >NEXT</Button>
                        </div>

                        <div className='steps-action '>
                            <Button htmlType='button' onClick={() => this.props.moveBack()} type='primary' size='middle' className='btn-blue fm-btn' >Back</Button>
                        </div>

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
    mapStateToProps, { buyClass }
)(Step3);