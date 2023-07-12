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
import { required, whiteSpace, maxLengthC, validMobile } from '../../../../config/FormValidation'
import { ClockCircleOutlined } from '@ant-design/icons';
import { enableLoading, disableLoading, bookAnInspectionAPI } from '../../../../actions'
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message'
import { STATUS_CODES } from '../../../../config/StatusCode'
import { formateTime, displayInspectionDate } from '../../../common'
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
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields 
   */
  getInitialValue = () => {
    const { selectedInspection } = this.props;
    const { uniqueTime } = this.state;
    let temp = ''
    let initial_time = uniqueTime && Array.isArray(uniqueTime) && uniqueTime.length ? uniqueTime[0] : ''
    if(selectedInspection){
      let temp = { 
        inspection_date: selectedInspection && displayInspectionDate(new Date(selectedInspection.inspection_date).toISOString()), 
        inspection_time: selectedInspection &&  `${formateTime(selectedInspection.inspection_start_time)} - ${formateTime(selectedInspection.inspection_end_time)}`
      }
      return temp
    }else if(initial_time){
      temp = { 
        inspection_date: initial_time && displayInspectionDate(new Date(initial_time.inspection_date).toISOString()), 
        inspection_time: initial_time && `${formateTime(initial_time.inspection_start_time)} - ${formateTime(initial_time.inspection_end_time)}`
      }
      return temp
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const {selectedInspection, visible, classifiedDetail, loggedInDetail, contactType, inspectionTime, userDetails } = this.props;
    const { name, email, mobile_no } = userDetails;
    const {selectedTime, count ,uniqueTime} = this.state
    
    return (
      <Modal
        title='Book an Inspection'
        visible={visible}
        centered={true}
        className={'custom-modal style1 book-inspection-style1'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className='padding classi-loc'>
          {classifiedDetail && classifiedDetail.location && <Row className='mb-35'>
            <Col md={24}>
              <Text className='fs-18' style={{color: '#363B40'}}>{classifiedDetail.location}</Text>
            </Col>
          </Row>}
          <Form
            {...layout}
            onFinish={this.onFinish}
            ref={this.formRef}
            initialValues={this.getInitialValue()}
          >
            <Row gutter={0}>
              <Col span={6} className='a-s-c'>
                <Text className='strong'>Inspection times</Text>
              </Col>
              <Col span={14} offset={1}>
                <Form.Item className='mb-0'>
                  <Input.Group compact className='custom-compact'>
                    <div className='inspection-times-test'>
                      <ClockCircleOutlined />
                      <Form.Item
                        name={'inspection_date'}
                        rules={[required('')]}
                        className='date mb-0'
                      >
                        <Select
                          size='large'
                          defaultValue={''}
                          className='w-100 '
                          onChange={this.handleDateChange}
                        >
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
                        rules={[required('')]}
                        className='date-time mb-0'
                      >
                        <Select
                          size='large'
                          defaultValue={'         '}
                          className='w-100'
                        >
                          {selectedTime && Array.isArray(selectedTime) && selectedTime.length &&
                            selectedTime.map((el, i) => {
                              return (
                                <Option key={el.id} value={el.inspection_start_time}>
                                  {`${formateTime(el.inspection_start_time)} - ${formateTime(el.inspection_end_time)}`}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </div>
                  </Input.Group>                  
                </Form.Item>                
              </Col>              
            </Row>
            <Paragraph className='strong mb-20 mt-25'>Personal Details </Paragraph>
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
              label='Mobile'
              name='mobile'
            >
              <Input
                placeholder={'Enter your mobile'}
                className='shadow-input'
                defaultValue={mobile_no}
                disabled
              />
            </Form.Item>
            <Form.Item
              label={<label for='message' class='ant-form-item-no-colon'>Body of message (1500)<br/><span className='less-count-red'>{count}</span> characters remaining</label>}
              name='message'
              className='custom-astrix'
              rules={[required(''), whiteSpace('Message'), maxLengthC(1500)]}
            >
              <TextArea
                rows={5}
                placeholder={'Write your message here'}
                className='shadow-input'
                onChange={this.handleTextAreaChange}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type='default' htmlType='submit'>
                Confirm
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
