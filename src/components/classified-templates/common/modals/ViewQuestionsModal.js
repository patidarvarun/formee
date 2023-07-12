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
  Upload,
  message,
  Radio,
  Card,
  Checkbox
} from 'antd';
import { required } from '../../../../config/FormValidation'
import { enableLoading, getJobQuestions, disableLoading, applyForJobAPI, getResume } from '../../../../actions'
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message'
import { STATUS_CODES } from '../../../../config/StatusCode'
import '../../jobs/resume-builder/resume.less'
import { displayDateTimeFormate, validFileType, validFileSize } from '../../../common'
import { convertHTMLToText } from '../../../common'
import { QUESTION_TYPES } from '../../../../config/Config'

const { Text, Title } = Typography;
const { TextArea } = Input;
var fs = require('fs');

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15, offset: 1 },
  labelAlign: 'left',
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 15 },
  className: 'align-center pt-20'
};

class ViewQuestionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      resume: [],
      cover_letter: [],
      jobApplication: false,
      resumeDetails: '',
      resumeList: [],
      files: [],
      resumeFileList: null,
      coverLatter: [],
      coverLatterList: null,
      jobVisible: false,
      hideFirstModal: false,
      answer: this.props.answer,
      questions: this.props.questions,
      disableSendBtn: false
    };
  }


  /**
  * @method blanckCheck
  * @description Blanck check of undefined & not null
  */
  blanckCheck = (value, withDash = false) => {
    if (value !== undefined && value !== null && value !== 'Invalid date' && value !== '') {
      return withDash ? `- ${value}` : value
    } else {
      return ''
    }
  }


  /**
   * @method handleMultiChoiceQuestion
   * @description handleMultiChoiceQuestion component
   */
  handleMultiChoiceQuestion = (e, el) => {
    const { answer } = this.state;
    if (e.target.checked) {
      let temp = {
        qus_id: el.id,
        ans_value: e.target.value
      }
      this.setState({ answer: [...answer, temp] })
    } else {
      const temp = answer.filter((item) => item.ans_value !== e.target.value);
      this.setState({ answer: temp })
    }
  }


  /**
   * @method renderQuestions
   * @description renderQuestions component
   */
  renderQuestions() {
    const { questions } = this.state;
    const { answer } = this.state;

    return questions.map((el, i) => {
      return (<div className='custom-marg-btm'>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} offset={0} >
            <div className='question-tag'>{el.question}?</div>
            <div className='question-type  custon-question-type'>
              {el.ans_type === QUESTION_TYPES.TEXT &&
                <Form.Item
                  label=''
                  name={el.question}
                  rules={[required('Answer is ')]}
                >
                  <TextArea rows={7} className='shadow-input' onChange={(e) => {
                    let temp = e.target.value
                    let i = answer.findIndex((k) => k.qus_id == el.id)
                    this.setState(prevState => ({
                      answer: prevState.answer.map(
                        (obj, index) => {
                          if (index === i) {
                            return Object.assign(obj, { ans_value: temp })
                          } else {
                            return obj
                          }
                        }
                      )
                    }));
                  }} />
                </Form.Item>}
            </div>
            <div className='question-type-radio'>
              {el.ans_type === QUESTION_TYPES.RADIO &&
                <Row>
                  <Col span={24} onChange={(e) => {
                    answer[i].ans_value = e.target.value
                    this.setState({ answer })
                  }}>
                    <Form.Item
                      label=''
                      name={el.question}
                      rules={[required('Answer is ')]}
                    >
                      <Radio.Group>
                        <Radio value={el.question_hasmany_options[0].option_value}>{el.question_hasmany_options[0].option_value}</Radio>
                        <Radio value={el.question_hasmany_options[1].option_value}>{el.question_hasmany_options[1].option_value}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>}
            </div>
            <div className='question-type-checkbox'>
              {el.ans_type === QUESTION_TYPES.CHECKBOX && <Row>
                <Col span={24}>
                  <Form.Item
                    label=''
                    name={el.question}
                    rules={[required('Answer is ')]}
                  >
                    <Checkbox.Group >
                      {el.question_hasmany_options[0].option_value && <Checkbox value={el.question_hasmany_options[0].option_value} onChange={(e) => {
                        this.handleMultiChoiceQuestion(e, el)
                      }}>{el.question_hasmany_options[0].option_value}</Checkbox>}
                      {el.question_hasmany_options[1].option_value && <Checkbox onChange={(e) => {
                        this.handleMultiChoiceQuestion(e, el)
                      }} value={el.question_hasmany_options[1].option_value}>{el.question_hasmany_options[1].option_value}</Checkbox>}
                      {el.question_hasmany_options[2].option_value && <Checkbox onChange={(e) => {
                        this.handleMultiChoiceQuestion(e, el)
                      }} value={el.question_hasmany_options[2].option_value}>{el.question_hasmany_options[2].option_value}</Checkbox>}
                      {el.question_hasmany_options[3].option_value && <Checkbox onChange={(e) => {
                        this.handleMultiChoiceQuestion(e, el)
                      }} value={el.question_hasmany_options[3].option_value}>{el.question_hasmany_options[3].option_value}</Checkbox>}
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              </Row>}
            </div>
          </Col>
        </Row>

      </div >)
    })
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, questions } = this.props;

    return (
      <div>
        <Modal
          title='Job Application Questions'
          visible={visible}
          className={'custom-modal style1 job-application-style'}
          footer={false}
          onCancel={this.props.onCancel}
        >
          <div className='padding'>
            {/* <Row className='mb-35'>
              <Col span={24} className='job-subtile'>
                <Text className='fs-18 strong'>{classifiedDetail.title}</Text>
                <Text className='fs-18'>
                  {companyName && `${companyName} - `}{classifiedDetail.location !== 'N/A' && classifiedDetail.location}
                </Text>
              </Col>
            </Row> */}
            <div className='ques-ans-block'>
              {(questions && questions.length!==0) ? (
                <div className='ques-heading'>Additional Questions From Employer</div>
              ) : (
                <div className='ques-heading'>No Additional Questions From Employer</div>
              )}
              {this.renderQuestions()}
            </div>  
          </div>
        </Modal>
      </div>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, profile, classifieds } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    resumeDetails: classifieds.resumeDetails !== null ? classifieds.resumeDetails : ''
  };
};

export default connect(mapStateToProps, { getJobQuestions, applyForJobAPI, getResume, enableLoading, disableLoading })(ViewQuestionsModal);
