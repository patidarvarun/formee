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
import { DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import { required, whiteSpace, maxLengthC } from '../../../../config/FormValidation'
import { enableLoading, disableLoading, contactAdSendMessageAPI, cancelSentOffers, } from '../../../../actions'
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message'
import { STATUS_CODES } from '../../../../config/StatusCode'
import { dateFormat4 } from '../../../common/index'
const { Text } = Typography;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13, offset: 1 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { span: 18, offset: 3 },
    className: 'align-center pt-20'
};

class ConfirmCancelOfferModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onCancel = () => {
        let req = {
            offer_id:this.props.classifiedDetail.id,
            user_id:1412
        }
        this.props.cancelSentOffers(req, (res) => {
            console.log("🚀 ~ file: ConfirmCancelOfferModal.js ~ line 133 ~ ConfirmCancelOfferModal ~ this.props.cancelSentOffers ~ res", res)
            if (res.status === 200 && res.data.data) {
                this.props.onCancelSuccessful();
                this.props.onCancel();
            }
        })

    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const {flag,visible, classifiedDetail, userDetails, contactType } = this.props;
        const {inspection, count } = this.state
        console.log(`this.props.classifiedDetail`, this.props.classifiedDetail)
        console.log(`this.props.userId`, this.props.userId)
        return (
            <Modal
                title={''}
                visible={visible}
                className={'custom-modal style1 custom-modal-contactmodal-style cancel-popup'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <div className='padding'>
                    <Row className=' delete-cancel-icon color-grey'>
                         <DeleteFilled />
                    </Row>
                    <Row className='wi-100 t-center'>
                        <Text className='fs-18 color-orange wi-100 mb-10 mt-5' style={{textAlign:'center'}}>You are about to cancel your offer </Text>
                        <Text className='fs-12' style={{textAlign:'center'}}>This cannot be undone, are you sure? </Text>
                    </Row>
                    <Row className='mb-15 wi-100 buttons-div ' style={{textAlign:'center'}}>
                    <div className='btn-space cancel mr-15'>
                        <Button type='default' htmlType='submit' onClick={this.props.onCancel}>
                            No, Go Back
                        </Button>
                    </div>
                    <div className='btn-space update orange-button1' >
                        <Button type='default' htmlType='submit' onClick={this.onCancel}>
                            Yes Cancel
                        </Button>
                    </div>    
                    </Row>
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

export default connect(mapStateToProps, { contactAdSendMessageAPI, enableLoading, disableLoading, cancelSentOffers, })(ConfirmCancelOfferModal);
