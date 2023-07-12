import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {
    Input,
    Typography,
    Row,
    Button,
    Modal,
} from 'antd';
import { enableLoading, disableLoading, contactAdSendMessageAPI } from '../../../../actions'
const { Text } = Typography;

class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                className={'custom-modal style1 custom-modal-contactmodal-style confirm-modal'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <div className=''>
                    <Row className='w-100 d-ib mb-30'>
                        {this.props.headerIcon()}

                    </Row>
                    <Row className='mb-25 w-100 d-ib'>
                        <Text className='fs-18'>{this.props.message}</Text>
                    </Row>
                    {this.props.warning && (
                        <Row className='mb-25 w-100 d-ib'>
                            <Text className='fs-12 warning'>{this.props.warning}</Text>
                        </Row>
                    )}

                    <Row className='mb-35 w-100 d-ib bt'>
                        <Button className="grey-without-border mr-10" type='default' htmlType='submit' onClick={this.props.onCancel}>
                            {this.props.cancelText}
                        </Button>
                        <Button className="btn-orange-fill" type='default' htmlType='submit' onClick={this.props.onAction}>
                            {this.props.actionText}
                        </Button>
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

export default connect(mapStateToProps, { contactAdSendMessageAPI, enableLoading, disableLoading })(ConfirmModal);
