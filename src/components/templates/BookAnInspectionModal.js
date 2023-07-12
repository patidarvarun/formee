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
  Checkbox,
  Select
} from 'antd';
import { required, whiteSpace, maxLengthC, validMobile } from '../../config/FormValidation'
import { ClockCircleOutlined } from '@ant-design/icons';
import { enableLoading, disableLoading, bookAnInspectionAPI } from '../../actions'
import { langs } from '../../config/localization';
import { MESSAGES } from '../../config/Message'
import { STATUS_CODES } from '../../config/StatusCode'
import { formateTime, displayInspectionDate } from '../common'
const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14, offset: 1 },
  labelAlign: 'left',
  colon: false,
};
const tailLayout = {
  wrapperCol: { span: 24 },
  className: 'align-center pt-20'
};

class BookInspection extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      agent: 0,
      count: 1500,
      selectedTime:[],
      uniqueTime: []
    };
  }

  componentDidMount(){
    const { inspectionTime } = this.props
    if(inspectionTime && inspectionTime.length){
      const uniqueObjects = [...new Map(inspectionTime.map(item => [item.inspection_date, item])).values()]
      
      this.setState({uniqueTime: uniqueObjects})
    }
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    
    this.props.enableLoading()
    const { loggedInDetail, classifiedid, userDetails } = this.props;
    const { name, email, mobile_no } = userDetails;
    const { agent } = this.state
    const requestData = {
      user_id: loggedInDetail.id,
      name: name,
      email: email,
      mobile: mobile_no,
      message: values.message,
      looking_for_agent: agent,
      inspection_date: values.inspection_date,
      inspection_time: values.inspection_time,
      classified_id: classifiedid
    }
    this.props.bookAnInspectionAPI(requestData, res => {
      this.props.disableLoading()
      if (res.status === STATUS_CODES.CREATED) {
        toastr.success(langs.success, MESSAGES.BOOK_INSPECTION)
        this.props.onCancel()
        this.props.callNext()
      }
    })
  }

  /**
   * @method handleCheck
   * @description handle check
   */
  handleCheck = (e) => {
    this.setState({ agent: e.target.checked })
  }

  /**
     * @method handleTextAreaChange
     * @description handle text area change
     */
  handleTextAreaChange = ({ target: { value } }) => {
    let count = ''
    if (value.length <= 1500) {
      count = 1500 - value.length
    } else {
      count = 0
    }
    this.setState({ message: value, count: count });
  };

  /**
   * @method handleDateChange
   * @description handle date change
   */
  handleDateChange = (date) => {
    const { inspectionTime } = this.props
    
    if(inspectionTime){
      let selectedTime = inspectionTime.filter(el => el.inspection_date === date)
      
      this.formRef.current && this.formRef.current.setFieldsValue({
        inspection_time:''
      });
      this.setState({selectedTime: selectedTime})
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, classifiedDetail, loggedInDetail, contactType, inspectionTime, userDetails } = this.props;
    const { name, email, mobile_no } = userDetails;
    const {selectedTime, count ,uniqueTime} = this.state
    
    return (
      <Modal
        title='Book an Inspection'
        visible={visible}
        className={'custom-modal style1 book-inspection-style1'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className='padding'>
          {classifiedDetail && classifiedDetail.location && <Row className='mb-35'>
            <Col md={24}>
              <Text className='fs-18'>{classifiedDetail.location}</Text>
            </Col>
          </Row>}
          <Form
            {...layout}
            onFinish={this.onFinish}
            ref={this.formRef}
          >
            <Row gutter={0}>
              <Col span={6} className='a-s-c'>
                <Text className='strong'>Inspection times</Text>
              </Col>
              <Col span={14} offset={1}>
                <Form.Item className='mb-0'>
                  <Input.Group compact className='custom-compact'>
                    <div className="inspection-times-test">
                      <ClockCircleOutlined />
                      <Form.Item
                        name={'inspection_date'}
                        // noStyle
                        rules={[required('')]}
                        className="date mb-0"
                      >
                        <Select
                          size='large'
                          defaultValue={''}
                          className='w-100 '
                          onChange={this.handleDateChange}
                        >
                          {/* <Option value='12-09-2019'>Saturday 12 September 2019</Option>
                                            <Option value='10-05-2020'>Monday 10 May 2020</Option>
                                            <Option value='27-07-2020'>Tuesday 16 July 2020</Option>
                                            <Option value='08-08-2020'>Wednesday 8 August 2020</Option> */}
                          {uniqueTime && Array.isArray(uniqueTime) && uniqueTime.length &&
                            uniqueTime.map((el, i) => {
                              return (
                                <Option key={el.id} value={el.inspection_date}>{displayInspectionDate(new Date(el.inspection_date).toISOString())}</Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name={'inspection_time'}
                        // noStyle
                        rules={[required('')]}
                        className="date-time mb-0"
                      >

                        <Select
                          size='large'
                          defaultValue={'         '}
                          className='w-100'
                        >
                          {/* <Option value='14:30:00'>1:30 pm</Option>
                                            <Option value='10:30:00'>10:30 am</Option>
                                            <Option value='7:00:00'>07:00 am</Option>
                                            <Option value='11:30:00'>11:30 am</Option> */}
                          {selectedTime && Array.isArray(selectedTime) && selectedTime.length &&
                            selectedTime.map((el, i) => {
                              return (
                                <Option key={el.id} value={el.inspection_start_time}>{`${formateTime(el.inspection_start_time)} - ${formateTime(el.inspection_end_time)}`}</Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Input.Group>
                </Form.Item>

              </Col>
            </Row>
            {/* <Row>
              <Col span={6}>&nbsp;</Col>
              <Col span={14} offset={1}>
                <Row gutter={[10, 10]} className='mt-20 mb-25'>
                  <Col span={24}>
                    <Checkbox onChange={this.handleCheck}><span className="text-style">I can’t find a suitable day or time <br />One of our agents will get in touch to arrange another time</span></Checkbox>
                  </Col>
                </Row>
              </Col>
            </Row> */}
            <Paragraph className='strong mb-30'>Your personal details</Paragraph>
            <Form.Item
              label='Name'
              name='name'
              rules={name === '' && [required('')]}
            >
              <Input
                placeholder={'Enter your name'}
                className='shadow-input'
                defaultValue={name}
                disabled
              />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={email === '' && [required('')]}
            >
              <Input
                placeholder={'Enter your email'}
                className='shadow-input'
                defaultValue={email}
                disabled
              />
            </Form.Item>
            <Form.Item
              label='Contact Number'
              name='mobile'
            //   rules={[{ validator: validMobile }]}
            >
              <Input
                placeholder={'Enter your mobile'}
                className='shadow-input'
                defaultValue={mobile_no}
                disabled
              />
            </Form.Item>
            {/* <Form.Item
              label='Body of message (1500) characters remaining'
              name='message'
              rules={[required(''), whiteSpace('Message')]}
              className="custom-astrix-bookan"
            >
              <TextArea rows={4} placeholder={'Write your message here'} className='shadow-input' />
            </Form.Item> */}
            <Form.Item
              label={<label for="message" class="ant-form-item-no-colon">Body of message (max 1500) <span style={{ color: 'red' }}>{count}</span> characters remaining</label>}
              name='message'
              className="custom-astrix"
              rules={[required(''), whiteSpace('Message'), maxLengthC(1500)]}
            >
              <TextArea
                rows={4}
                placeholder={'Write your message here'}
                className='shadow-input'
                onChange={this.handleTextAreaChange}
              />
            </Form.Item>
            {/* <Row className='pb-20'>
              <Col span={13} offset={7}>
                <Text className='text-black'>Sign In To Send Your Message</Text><br />
                <Text className='mute'>By clicking on the 'Send Message' button you are agreeing to Formee's Terms and Conditions and Privacy Policy.</Text>
              </Col>
            </Row> */}

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
  const { auth, profile } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};

export default connect(mapStateToProps, { bookAnInspectionAPI, enableLoading, disableLoading })(BookInspection);
