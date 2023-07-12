import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { required, whiteSpace } from '../../../../config/FormValidation';

class Step3 extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
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
                const reqData = {
                    contactName: values.contactName,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    phoneCode: this.props.loggedInDetail.phonecode
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
    * @method render
    * @description render component
    */
    render() {
        const { loggedInDetail} = this.props;
        const { name, email, mobile_no } = loggedInDetail;
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
                >
                <h4 className='fm-input-heading'>Your Information</h4>
                <Form.Item label='Contact Name' name='contactName'>
                    <Input  disabled rules={[required('Contact Name'), whiteSpace('Contact Name')]} placeholder={'Enter your first name and last name'} className='shadow-input' />
                </Form.Item>
                <Form.Item label='Email Address'  name='email'>
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
                    <Input placeholder={'Enter your phone number'} className='shadow-input' disabled rules={[required('Phone Number'), whiteSpace('Phone Number')]} />
                </Form.Item>
                <Form.Item >
                    <div className='steps-action'>
                        <Button
                            htmlType="button"
                            onClick={() => this.props.moveBack()}
                            type="primary"
                            size="middle"
                            className="btn-trans fm-btn"
                        >
                            Back
                        </Button>
                        <Button htmlType="submit" type='primary' size='middle' className='btn-blue fm-btn' >NEXT</Button>
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
    mapStateToProps, null
)(Step3);