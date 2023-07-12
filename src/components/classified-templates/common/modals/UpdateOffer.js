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
} from 'antd';
import { required, validNumber } from '../../../../config/FormValidation';
import {
  enableLoading,
  disableLoading,
  makeAnOfferAPI,
  updateSentOffers,
} from '../../../../actions';
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message';
import { salaryNumberFormate } from '../../../common';
import { STATUS_CODES } from '../../../../config/StatusCode';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../../config/Config';
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

class UpdateOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      newOffer: 0,
      newOfferError: ''
    };
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    const {
      loggedInDetail,
      receiverId,
      classifiedid,
      classifiedDetail,
      userDetails,
    } = this.props;
    const { name, email, mobile_no } = userDetails;
    let price = values.offer_price.replace('$', '');
    let new_price = price.replace(',', '');
    let fix_price = new_price.replace(' ', '');
    if (new_price <= classifiedDetail.price) {
      const requestData = {
        classifieduser_id: receiverId,
        user_id: loggedInDetail.id,
        classifiedid: classifiedid,
        offer_price: fix_price,
        loginusername: name ? name : loggedInDetail.name,
        loginemail: email ? email : loggedInDetail.email,
      };
      this.props.enableLoading();
      this.props.makeAnOfferAPI(requestData, (res) => {
          this.props.onFinish();
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, MESSAGES.OFFER_ADD_SUCCESS);
          this.props.onCancel();
        }
      });
    } else {
      toastr.warning(langs.warning, MESSAGES.MAKE_AN_OFFER);
    }
  };

  onUpdate = () => {
    // need to implement update offer api
    if(!this.state.newOffer) {
      this.setState({
        newOfferError: 'Please make your offer.'
      })
      return;
    }
    const { userDetails, classifiedDetail } = this.props;
    // console.log(`this.props.userDetails`, this.props.userDetails)
    // console.log(`classifiedDetail`, classifiedDetail)
    let newOffer = this.state.newOffer;
    newOffer = parseInt(newOffer.replace('$',''), 10)
    let req = {
        user_id: userDetails.id,
        classifieduser_id: classifiedDetail.classified_users.id,
        classifiedid: classifiedDetail.id,
        offer_price: classifiedDetail.price,
        loginemail: userDetails.email,
        loginusername: userDetails.name,
        new_offer_price: newOffer,
    }
    this.props.updateSentOffers(req, (res) => {
        // console.log("🚀 ~ file: ConfirmCancelOfferModal.js ~ line 133 ~ ConfirmCancelOfferModal ~ this.props.cancelSentOffers ~ res", res)
        if (res.status === 200 && res.data.data) {
            this.props.onUpdateSuccessful();
            this.props.onCancel();
        }
    })
  }

  onCancelOffer = () => {
    this.props.onCancelOffer()
    this.props.onCancel()
  }
  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, classifiedDetail, userDetails } = this.props;
    const { newOfferError } = this.state;
    return (
      <Modal
        title='Update Offer'
        visible={visible}
        className={'custom-modal style1 make-offer-style update-offer'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className='padding'>
          <Row className='mb-35 update-view-top'>
            <Col md={13}>
              <Text className='fs-18'>
                To:{' '}
                {classifiedDetail.classified_users &&
                  classifiedDetail.classified_users.name}{' '}
              </Text>
            </Col>
            <Col md={6} className='align-right' offset={1}>
              <Text className='text-black-primary'>
                {classifiedDetail.classified_users &&
                  `(Member since ${classifiedDetail.classified_users.member_since})`}
              </Text>
            </Col>
          </Row>
          <Row className="update-image-title">
            <Col>
              <img src={`${BASE_URL}${classifiedDetail.image}`} height="100px" width="100px" alt="" />
            </Col>
            <Col className="upadte-title">
              <Row>
                <Text>{classifiedDetail.title}</Text>
              </Row>
              <Row><Text>{`${classifiedDetail.category_name} ${classifiedDetail.subcategory_name ? ` | ${classifiedDetail.subcategory_name}` : ''}`}</Text></Row>
            </Col>
          </Row>
          <Row>
            <div className="white-bg"><Col className="left">
              <Row class="up-title ">
                <Text>Item</Text>
              </Row>
              <Row className="class-detail"><Text>{classifiedDetail.title}</Text></Row>
            </Col>
            <Col className="right">
              <Row class="up-title">
                <Text>Advertising Amount</Text>
              </Row>
              <Row className="ad-amount"><Text>{classifiedDetail.advertising_amount}</Text></Row>
            </Col>
            </div>
            <Col className="price-box">

              <Form.Item
                label='Make your offer'
                name='offer_price'
                rules={[required('')]}
                className='fm-mk-offerinput '
                value={this.state.newOffer}
                onChange={(e) => {
                  if(e.target.value) {
                    this.setState({
                      newOffer: e.target.value,
                      newOfferError: ''
                    })
                  } else {
                    this.setState({
                      newOffer: e.target.value,
                      newOfferError: 'Please make your offer.'
                    })

                  }
                }}
              >
                <NumberFormat
                  thousandSeparator={true}
                  prefix={'$'}
                  placeholder={''}
                  className='shadow-input ant-input'
                />
              </Form.Item>
              {newOfferError && (
                <span className="new-offer-error" style={{color: 'red'}}>{newOfferError}</span>
              )}
            </Col>
          </Row>
          <Row>
          <Col className="button-box  ">  
          <div className='btn-space cancel'>
            <Button type='default' htmlType='submit' onClick={this.props.onCancel}>
              Cancel
            </Button>
          </div>
          <div className='btn-space update' >
            <Button type='default' htmlType='submit' onClick={this.onUpdate}>
              Update Offer
            </Button>
          </div></Col></Row>
          <div class="link-a"><Link to='#' onClick={this.onCancelOffer}>I want to cancel my offer</Link></div>
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
  updateSentOffers,
})(UpdateOffer);
