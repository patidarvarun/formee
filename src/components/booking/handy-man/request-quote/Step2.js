import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Select, message, Upload } from 'antd';
import { required, whiteSpace, maxLengthC } from '../../../../config/FormValidation';
import { getPreviousQuote, enableLoading, disableLoading } from '../../../../actions';
import { PlusOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Option } = Select;

class Step2 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    const { step2Data } = props.mergedStepsData;
    this.state = {
      fileList: step2Data && step2Data.images && step2Data.images.length > 0 ? step2Data.images : [],
      previousQuotesList: [],
      quote: ''
    };
  }

  /**
   * @method componentDidMount
   * @description call after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    const { step2Data } = this.props.mergedStepsData
    this.formRef.current && this.formRef.current.setFieldsValue({
      quote_value: step2Data && step2Data.quote_value ? step2Data.quote_value : '',
    });
    this.fetchCustomerPreviousQuotes()
  }

  /**
   * @method fetchCustomerPreviousQuotes
   * @description fetch customer quotes
   */
  fetchCustomerPreviousQuotes = () => {
    const { loggedInDetail, bookingDetail } = this.props
    let reqData = {
      // user_id: loggedInDetail.id,
      user_id: 705,
      // user_id: bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.user_id,
    }
    this.props.getPreviousQuote(reqData, res => {
      this.props.disableLoading()
      
      if (res.status === 200) {
        this.setState({ previousQuotesList: res.data.data })
      }
    })
  }

  /**
   * @method onClickNext
   * @description onClickNext
   */
  onFinish = (values) => {
    
    if (this.onFinishFailed() !== undefined) {
      return true
    } else {
      const { quote } = this.state;
      if (values !== undefined) {
        values.quote_value = quote;
        this.props.nextStep(values, 2)
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

  normFile = e => {
    //
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  /**
   * @method renderPreviousQuotes
   * @description render previous quote values
   */
  renderPreviousQuotes = (previousQuotes) => {
    if (previousQuotes && previousQuotes.length > 0) {
      return previousQuotes.map((el, i) => {
        return (
          <Select.Option key={`${i}_previous_quote`} value={JSON.stringify(el)}>{el.title}</Select.Option>
        );
      })
    }
  }

  /**
   * @method dummyRequest
   * @description dummy request for images
   */
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  /**
   * @method handleImageUpload
   * @description handle image upload
   */
  handleImageUpload = ({ file, fileList }) => {
    //
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
      return false
    } else {
      this.setState({ fileList });
    }
  }

  /**
   * @method handleQuote
   * @description handle quote change
   */
  handleQuote = (value) => {
    let obj = JSON.parse(value);
    this.setState({ quote: obj.title });
    this.formRef.current && this.formRef.current.setFieldsValue({
      title: obj.title,
      description: obj.description
    });
  }


  /**
  * @method render
  * @description render component
  */
  render() {
    const { fileList, previousQuotesList } = this.state;
    const { step2Data } = this.props.mergedStepsData;
    const { title, quote_value, description, images } = step2Data;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className='ant-upload-text'>Upload Photo</div>
        <img className="camera-icon" src={require('../../../../assets/images/icons/camera-small.svg')} alt='' />
      </div>
    );

    return (
      <Fragment>
        <div className='wrap fm-step-form fm-step-three step-second req-step-two'>
          <Form
            name='user-bookinginfo'
            initialValues={{ title: title, quote_value: quote_value, description: description, images }}
            layout='horizontal'
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            scrollToFirstError
            id='user-bookinginfo'
            ref={this.formRef}
          >
            <h4 className='fm-input-heading'>Job Information</h4>
            {/* <Form.Item rules={[required(''), maxLengthC(100)]} label='Title' name='title'>
              <Input placeholder={'Title'} className='shadow-input' />
            </Form.Item> */}

            <Form.Item label='Choose from previous Quotes' name='quote_value' colon={false}>
              <Select
                placeholder='Select a Task'
                className='shadow-input'
                size='large'
                allowClear
                getPopupContainer={trigger => trigger.parentElement}
                onChange={this.handleQuote}
              >
                {this.renderPreviousQuotes(previousQuotesList)}
              </Select>
            </Form.Item>

            <Form.Item label='Select Job Type' name='job_type' colon={false}>
              <Select
                placeholder='Select a Task'
                className='shadow-input'
                size='large'
                allowClear
                // getPopupContainer={trigger => trigger.parentElement}
                // onChange={this.handleQuote}
              >
                <Option value="Plumbers">Plumbers</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label='Task Details'
              name='description'
              className="additional-note"
              rules={[required(''), whiteSpace('Additional Note'), maxLengthC(300)]}
            >
              <TextArea rows={6} placeholder={'Description the task in further details.'} className='shadow-input' />
            </Form.Item>
            <Form.Item
              label='Add Pictures'
              name='images'
              className="add-pic add-pic-uploader"
              getValueFromEvent={this.normFile}
            >
              <Upload
                name='images'
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={true}
                fileList={fileList}
                customRequest={this.dummyRequest}
                onChange={this.handleImageUpload}
                onPreview={this.handlePreview}
              >
                <span className="label-upload">Browse Files</span>
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item >
              <div className='steps-action mt-15'>
                <Button onClick={() => { this.props.preStep() }} type='primary' size='middle' className='btn-trans fm-btn' >Back</Button>
                <Button htmlType="submit" type='primary' size='middle' className='btn-blue fm-btn' >Next</Button>
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
  mapStateToProps, { getPreviousQuote, enableLoading, disableLoading }
)(Step2);