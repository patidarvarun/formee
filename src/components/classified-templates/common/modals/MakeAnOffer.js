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
} from '../../../../actions';
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message';
import { salaryNumberFormate } from '../../../common';
import { STATUS_CODES } from '../../../../config/StatusCode';
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

class MakeAnOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
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

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, classifiedDetail, userDetails } = this.props;
    return (
      <Modal
        title='Make Offer'
        visible={visible}
        className={'custom-modal style1 make-offer-style'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className='padding'>
          <Row className='mb-35'>
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
          <Form {...layout} onFinish={this.onFinish}>
            <Form.Item label='Name' name='name'>
              <Input
                disabled
                className='shadow-input'
                defaultValue={userDetails.name}
              />
            </Form.Item>
            <Form.Item {...infoLayout}>
              <Text className='sub-title-text'>
                {`$${salaryNumberFormate(classifiedDetail.price)} ${
                  classifiedDetail.title
                }`}
              </Text>
            </Form.Item>
            <Form.Item
              label='Make your offer'
              name='offer_price'
              rules={[required('')]}
              className='fm-mk-offerinput '
            >
              <NumberFormat
                thousandSeparator={true}
                prefix={'$'}
                placeholder={'How much would you like to offer?'}
                className='shadow-input ant-input'
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <div className='btn-space'>
                <Button type='default' htmlType='submit'>
                  Send
                </Button>
              </div>
            </Form.Item>
          </Form>
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
})(MakeAnOffer);
