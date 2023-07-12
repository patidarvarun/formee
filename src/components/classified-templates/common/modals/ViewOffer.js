import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import NumberFormat from 'react-number-format';
import {
  Form,
  Input,
  Typography,
  Row,
  Col,
  Button,
  Modal,
  InputNumber,
  Rate,
} from 'antd';
import { required, validNumber } from '../../../../config/FormValidation';
import {
  enableLoading,
  disableLoading,
  makeAnOfferAPI,
  changeGeneralOfferStatus,
  changeJobStatus
} from '../../../../actions';
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message';
import { salaryNumberFormate } from '../../../common';
import { STATUS_CODES } from '../../../../config/StatusCode';
import moment from 'moment';
import { GENERAL_APPICANT_STATUS } from '../../../../config/Config';
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
  className: 'align-center pt-20',
};

const infoLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: 'align-left mb-15',
};

class ViewOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  onAcceptOrDecline = (choice) => {
    const { classifiedDetail } = this.props;
    let status;
    if(choice == 'accept') {
      status = "Accepted"
    } else {
      status = "Cancelled"
    }

    let reqdata = {
      offer_id: classifiedDetail.msg_id,
      status: status
    }
    this.props.enableLoading()
    this.props.changeGeneralOfferStatus(reqdata, (res) => {

      this.props.disableLoading()
      // this.getDetails()
      toastr.success(langs.success, langs.messages.change_status)
      this.props.onCancel();
    })
    

    // this.props.changeJobStatus({ trader_job_id: classifiedDetail.msg_id, status }, (res) => {
    //   this.props.disableLoading()
    //   if (res.status === STATUS_CODES.OK) {
    //     toastr.success(langs.success, MESSAGES.CONFIRM_HANDYMAN_BOOKING);
    //     // this.handleCancel()
    //     this.props.onCancel();
    //   }

    // })
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    
    const { visible, classifiedDetail, userDetails } = this.props;
  
    const classifieldusername = classifiedDetail.classified_user_detail;
   
    
    return (
      
      <Modal
        title={`View Offer`}
        visible={visible}
        className={'custom-modal style1 make-offer-style view-offer'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className='padding'>
          <Row className='mb-35 view-offer-top w-100'>
            <Col md={13}>
                <Row>
                    <Text className='fs-18'>
                      <strong>  From:{' '}
                        {classifiedDetail.sender_name}{' '}
                      </strong>  
                    </Text>
                </Row>
                <Row>
                    <Text className='text-black-primary date-of-join'>
                        
                        (Member since {classifiedDetail.date_of_joing})
                    </Text>
                </Row>
                <Row className="rating">
                    {classifiedDetail.rating && (
                        <Rate
                            disabled
                            defaultValue={classifiedDetail.rating ? classifiedDetail.rating : "No review yet"}
                        />
                    )}
                </Row>
                <Row className="view-profile">
                    <Text className='text-black-primary'>
                        <a href="#" className="view-profile">View Profile</a>
                    </Text>
                </Row>
            </Col>
            <Col md={6} className='align-right' offset={1}>
                <Text>
                    {`Date: ${moment(classifiedDetail.created_at).format('MMMM YYYY')}`}
                </Text>
            </Col>
          </Row>

          <Row className="w-100 view-middle">
              <Col>
                <Row>
                   <div class="left-white-section">
                     <Col className="view-item">
                        <Row>
                            <Text className="title">
                                Item
                            </Text>
                        </Row>
                        <Row>
                            <Text>
                              <strong className="class-title">  {classifiedDetail.title}</strong>
                            </Text>
                        </Row>
                    </Col>
                    <Col className="advertising-amount">
                        <Row className="w-100 d-ib " >
                           <Text className="title">Advertising Amount</Text>
                        </Row>
                        <Row className="w-100 d-ib">
                          <span class="amount-adv">{classifiedDetail.advertising_amount}</span>
                        </Row>
                    </Col>
                  </div>  
                    <Col className="right-green-part">
                        <Row className="w-100 d-ib">
                            <Text className="title">
                                Offer Amount
                            </Text>
                        </Row>
                        <Row className="w-100 d-ib">
                            <Text>
                               <strong className="offered-amount"> {`AU$ ${classifiedDetail.offered_amount}`}</strong>
                            </Text>
                        </Row>
                    </Col>
                </Row>
              </Col>
              <Col></Col>
          </Row>

            <div className='btn-space classified-button mt-40 mb-10'>
                <Button type='default' htmlType='submit' onClick={() => this.onAcceptOrDecline('decline')} className="decline">
                    Decline Offer
                </Button>
                <Button type='default' htmlType='submit' onClick={() => this.onAcceptOrDecline('accept')} className="accept">
                    Accept Offer
                </Button>
            </div>
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};

export default connect(mapStateToProps, {
  makeAnOfferAPI,
  enableLoading,
  disableLoading,
  changeGeneralOfferStatus,
  changeJobStatus,
})(ViewOffer);
