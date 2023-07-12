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
  Rate,
  Modal,
  Avatar,
  Radio,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  required,
  whiteSpace,
  maxLengthC,
} from '../../../../config/FormValidation';
import { langs } from '../../../../config/localization';
import { reportRetailAds, reportThisAd } from '../../../../actions';
import { MESSAGES } from '../../../../config/Message';
import { STATUS_CODES } from '../../../../config/StatusCode';
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
  className: 'align-center pt-20',
};

class ReportAdModal extends React.Component {
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
  handleRatingChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    const { classifiedDetail, loggedInDetail, is_retail } = this.props;
    let requestData = {
      user_id: loggedInDetail.id,
      reason: values.reason,
      report_type: values.report_type,
    };
    if (is_retail) {
      requestData.retail_classified_id = classifiedDetail.id;
      this.props.reportRetailAds(requestData, (res) => {
        if (res.status === STATUS_CODES.OK) {
          toastr.success(langs.success, MESSAGES.REPORT_ADD_SUCCESS);
          this.props.onCancel();
        }
      });
    } else {
      requestData.classified_id = classifiedDetail.id;
      this.props.reportThisAd(requestData, (res) => {
        if (res.status === STATUS_CODES.OK) {
          this.props.callNext();
          toastr.success(langs.success, MESSAGES.REPORT_ADD_SUCCESS);
          this.props.onCancel();
        }
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, classifiedDetail } = this.props;
    const { value } = this.state;
    const radioStyle = {
      display: 'block',
      height: '26px',
      lineHeight: '26px',
    };

    return (
      <Modal
        title='Report this Ad'
        visible={visible}
        className={'custom-modal style1 report-this-ads'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className='padding'>
          <Form
            {...layout}
            onFinish={this.onFinish}
          >
            <label className='strong'>What's wrong with this Ad?</label>
            <Form.Item
              name='report_type'
              className='radio-inpt'
              rules={[required('')]}
            >
              <Radio.Group onChange={this.handleRatingChange} value={value}>
                <Radio style={radioStyle} value={'This is duplicate or spam'}>
                  This is duplicate or spam
                </Radio>
                <Radio style={radioStyle} value={'This is scam or fraud'}>
                  This is scam or fraud
                </Radio>
                <Radio
                  style={radioStyle}
                  value={'This ad is in wrong category'}
                >
                  This ad is in wrong category
                </Radio>
                <Radio
                  style={radioStyle}
                  value={'This item is no longer available'}
                >
                  This item is no longer available
                </Radio>
                <Radio style={radioStyle} value={'This item is incorrect'}>
                  This item is incorrect
                </Radio>
                <Radio style={radioStyle} value={'Other'}>
                  Other
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name='reason'
              rules={[required(''), whiteSpace('Reason'), maxLengthC(300)]}
              className='custom-astrix'
            >
              <TextArea
                rows={4}
                placeholder={'Write your comment here'}
                className='shadow-input'
              />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type='default' htmlType='submit'>
                Report Ad
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

export default connect(mapStateToProps, { reportRetailAds, reportThisAd })(
  ReportAdModal
);
