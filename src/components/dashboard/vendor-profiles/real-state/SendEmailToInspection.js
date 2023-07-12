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
import { required, whiteSpace, maxLengthC} from '../../../../config/FormValidation'
import {enableLoading, disableLoading, sendEmailToBookInspection } from '../../../../actions'
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message'
import { STATUS_CODES } from '../../../../config/StatusCode'
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

class SendEmailToInspection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: 0,
        inspection: 0,
        price: 0,
        sales: 0,
        property:0
    };
  }

    /**
     * @method onFinish
     * @description handle on submit
     */
    onFinish = (values) => {
        
        this.props.enableLoading()
        const { loggedInDetail,inspectionDetail} = this.props;
        if(inspectionDetail){
            const requestData = {
                // user_id: loggedInDetail.id,
                inspection_id : inspectionDetail.id,
                message: values.message,
            }
            this.props.sendEmailToBookInspection(requestData, res => {
                this.props.disableLoading()
                if(res.status === STATUS_CODES.OK){
                    toastr.success(langs.success,'Email has been sent successfully')
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
        const { visible, inspectionDetail, loggedInDetail} = this.props; 
        return (
            <Modal
                // title='Contact to advertiser'
                visible={visible}
                className={'custom-modal style1'}
                footer={false}
                onCancel={this.props.onCancel}
            >
            <div className='padding'>
                <Row className='mb-35'>
                    <Col md={11}>
                        <Text className='fs-18'>To :  {inspectionDetail && inspectionDetail.email} </Text>
                    </Col>
                </Row>
                <Row className='mb-35'>
                    <Col md={11}>
                        <Text className='fs-18'>From :  {loggedInDetail && loggedInDetail.email} </Text>
                    </Col>
                </Row>
                <Form
                    {...layout}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        label='Message'
                        name='message'
                        rules={[required(''), whiteSpace('Message')]}
                    >
                        <TextArea rows={4} placeholder={'Write your message here'} className='shadow-input' />
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

export default connect(mapStateToProps, {sendEmailToBookInspection, enableLoading, disableLoading })(SendEmailToInspection);
