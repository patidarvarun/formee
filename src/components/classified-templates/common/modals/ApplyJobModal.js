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

class ApplyJobModal extends React.Component {
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
      answer: [],
      questions: [],
      disableSendBtn: false
    };
  }


  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  componentWillMount() {
    this.props.enableLoading()
    this.props.getResume((res) => {

      if (res.status === 200) {
        let resume = res.data !== '' ? res.data.data : ''
        this.getQuestions()
        this.setState({ resumeDetails: resume })
      } else {
        this.getQuestions()
      }
    })
  }

  /**
  * @method componentWillMount
  * @description called before mounting the component
  */
  getQuestions =

    () => {
      const { isLoggedIn, loggedInDetail } = this.props
      let classified_id = this.props.match.params.classified_id

      let reqData = {
        id: classified_id,
        user_id: isLoggedIn ? loggedInDetail.id : ''
      }
      this.props.getJobQuestions(reqData, (res) => {
        this.props.disableLoading()
        if (res.status === 200 && res.data.result) {
          let questions = Array.isArray(res.data.result.classified_hasmany_questions) ? res.data.result.classified_hasmany_questions : []
          let ans = []
          Array.isArray(questions) && questions.map((el) => {

            if (el.ans_type !== 'checkbox') {
              ans.push({
                qus_id: el.id,
                ans_value: ''
              })
            }
          })
          this.setState({ questions, answer: ans })
        } else {
          this.setState({ disableSendBtn: true })
          // toastr.warning(langs.warning, MESSAGES.ALREADY_APPLIED_ON_A_JOB)

        }
      })
    }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    this.props.enableLoading()
    const { classifiedDetail, userDetails, resumeDetails } = this.props;
    const { name, email, mobile_no } = userDetails;
    const { resumeFileList, coverLatterList } = this.state
    let appliedWithFormeeResume = this.props.location.state && this.props.location.state.isOpenResumeModel !== undefined ? true : false



    const requestData = {
      classified_id: classifiedDetail && classifiedDetail.id,
      customer_id: userDetails.id,
      fname: userDetails.fname,
      lname: userDetails.lname,
      mobile: mobile_no,
      applicant_email: userDetails.email,
      ans: JSON.stringify(this.state.answer),
      coverfile: coverLatterList ? coverLatterList : '',
      resumefile: resumeFileList ? resumeFileList : '',
      resume: !resumeFileList ? 0 : 1,
      cover_letter: !coverLatterList ? 0 : 1,
      formee_resume_id: appliedWithFormeeResume ? resumeDetails.id : ''
    }


    const formData = new FormData()
    Object.keys(requestData).forEach((key) => {
      formData.append(key, requestData[key])
    })
    this.props.applyForJobAPI(formData, res => {
      this.props.disableLoading()
      if (res.status === STATUS_CODES.OK) {
        // this.getQuestions()
        toastr.success(langs.success, MESSAGES.APPLICATION_JOB_SUCCESS)
        this.props.onJobCancel()
      }
    })
  }

  /**
* @method onFinish2
* @description handle on submit
*/
  onFinish2 = (values) => {
    const { coverLatterList } = this.state

    this.props.enableLoading()
    const { resumeDetails, classifiedDetail, userDetails } = this.props;
    // 
    // 
    // 
    const { mobile_no } = userDetails;
    const requestData = {
      classified_id: classifiedDetail && classifiedDetail.id,
      customer_id: userDetails.id,
      fname: userDetails.fname,
      lname: userDetails.lname,
      mobile: mobile_no,
      applicant_email: userDetails.email,
      ans: JSON.stringify(this.state.answer),
      coverfile: coverLatterList,
      formee_resume_id: resumeDetails.id
    }


    const formData = new FormData()
    Object.keys(requestData).forEach((key) => {
      formData.append(key, requestData[key])
    })
    this.props.applyForJobAPI(formData, res => {
      this.props.disableLoading()
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.APPLICATION_JOB_SUCCESS)
        this.props.onJobCancel()
      }
    })
  }

  /** 
   * @method handleResumeChange
   * @description handle resume change
   */
  handleResumeChange = e => {
    const { files, resumeList } = this.state
    let file = e.target.files[0];
    let validType = validFileType(file)
    let validSize = validFileSize(file)
    if (!validType) {
      message.error(MESSAGES.VALID_FILE_TYPE);
      toastr.warning(langs.warning, MESSAGES.VALID_FILE_TYPE)
      this.setState({ invalid: true })
    } else if (!validSize) {
      message.error(MESSAGES.VALID_FILE_SIZE);
      toastr.warning(langs.warning, MESSAGES.VALID_FILE_SIZE)
      this.setState({ invalid: true })
    }
    if (validType && validSize) {
      let resumeFile = resumeList;
      resumeFile.push(e.target.files[0]);
      this.setState({
        files: [...files, ...e.target.files],
        // resumeFileList: resumeFile,
        resumeFileList: e.target.files[0]
      });
    }
  };

  /** 
   * @method handleCoverLetterChange
   * @description handle cover letter change
   */
  handleCoverLetterChange = e => {
    const { files, coverLatter } = this.state
    let file = e.target.files[0];
    let validType = validFileType(file)

    let validSize = validFileSize(file)

    if (!validType) {

      toastr.warning(langs.warning, MESSAGES.VALID_FILE_TYPE)
      message.error(MESSAGES.VALID_FILE_TYPE);
      this.setState({ invalid: true })
    } else if (!validSize) {
      toastr.warning(langs.warning, MESSAGES.VALID_FILE_SIZE)
      message.error(MESSAGES.VALID_FILE_SIZE);
      this.setState({ invalid: true })
    }
    if (validType && validSize) {
      let cover_letter = coverLatter;
      cover_letter.push(e.target.files[0]);
      this.setState({
        // coverLatterList: cover_letter,
        coverLatterList: e.target.files[0]
      });
    }
  };

  /**
  * @method renderFiles
  * @description Used to render selected files
  */
  renderFiles = (file, key) => {
    let today = Date.now()
    if (file && file.name !== undefined) {
      let fileInKb = Math.round(file.size / (1024))
      return (
        <div className='resume-preview'>
          <div className='files-item'>
            <span>{file.name}{` ( ${fileInKb} KB )`}</span>
            <a className='blue-link remove pl-5'
              onClick={(e) => this.removeFile(key)}
            >Remove</a>
          </div>
        </div>
      );
    }
  };

  /**
  * @method removeFile
  * @description remove uploaded file
  */
  removeFile = (key) => {
    const { resumeFileList, coverLatterList } = this.state;
    const list1 = resumeFileList;
    const list2 = coverLatterList;
    if (key === 'resume') {
      this.setState({ resumeFileList: null });
    } else if (key === 'cover_letter') {
      this.setState({ coverLatterList: null });
    }
  }


  /** 
   * @method handleJobApplication
   * @description handle job application
   */
  handleJobApplication = () => {
    if (this.state.resumeDetails !== '') {

      this.setState({ jobApplication: true, hideFirstModal: true })
      // this.props.onJobCancel()
    } else {
      this.props.history.push({
        pathname: '/classifieds-jobs/resume-builder',
        state: {
          prevPagePath: this.props.location.pathname,
        }
      })
      // this.props.history.push('/classifieds-jobs/resume-builder')
    }
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
  * @method renderExperience
  * @description Used to render experience
  */
  renderExperience = (experience) => {
    return experience.length && experience.map((el) => (
      <Row>
        <Col span={17}>
          <p className='strong mb-5'>{el.job_title}</p>
          <p>{el.company} <br /></p>
          <p>{el.description && convertHTMLToText(el.description)}</p>
        </Col>
        <Col span={7} className='align-right'>
          <Text className='strong'>{`${this.blanckCheck(el.start_month)} ${this.blanckCheck(el.start_year)} 
          ${el.currently_working === 1 ? `- Present` : `${this.blanckCheck(el.complete_month, true)} ${this.blanckCheck(el.complete_year)}`
        }`
          }</Text>
        </Col>
      </Row>
    ))
  }

  /**
   * @method renderEducation
   * @description Used to render education
   */
  renderEducation = (education) => {
    return education.length && education.map((el) => (
      <Row>
        <Col span={17}>
          <p className='strong mb-5'>{el.institution}</p>
          <p>{el.level_of_qualification}</p>
          <p>{el.course}</p>
        </Col>
        <Col span={7} className='align-right'>
          <Text className='strong'>{`${this.blanckCheck(el.finished_from_month)} ${this.blanckCheck(el.finished_to_year)} ${this.blanckCheck(el.finished_to_month, true)} ${this.blanckCheck(el.finished_to_year)}`}</Text>
        </Col>
      </Row>
    ))
  }

  onJobApplicationCancel = () => {
    this.setState({ jobApplication: false, hideFirstModal: false }, () => {
      this.props.onJobCancel()
    })
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
    const { visible, classifiedDetail, loggedInDetail, userDetails, companyName } = this.props;
    const {questions, jobApplication, disableSendBtn, answer, resumeDetails, resumeFileList, coverLatterList, hideFirstModal } = this.state
    const { name, mobile_no, email } = userDetails;
    let appliedWithFormeeResume = this.props.location.state && this.props.location.state.isOpenResumeModel !== undefined ? this.props.location.state.isOpenResumeModel : false

    return (
      <div>
        {visible && !hideFirstModal && <Modal
          title='Job Application for'
          visible={visible}
          className={'custom-modal style1 job-application-style'}
          footer={false}
          onCancel={this.props.onJobCancel}
        >
          <div className='padding'>
            <Row className='mb-35'>
              <Col span={24} className='job-subtile'>
                <Text className='fs-18 strong'>{classifiedDetail.title}</Text>
                <Text className='fs-18'>
                  {companyName && `${companyName} - `}{classifiedDetail.location !== 'N/A' && classifiedDetail.location}
                </Text>
              </Col>
            </Row>
            <Form
              {...layout}
              onFinish={this.onFinish}
              className='job-application'
            >
              <Form.Item
                label='Name'
                name='name'
              >
                <Input disabled className='shadow-input' defaultValue={name} />
              </Form.Item>
              <Form.Item
                label='Email'
                name='email'
              >
                <Input disabled className='shadow-input' defaultValue={email} />
              </Form.Item>
              <Form.Item
                label='Phone Number'
                name='mobile'
              >
                <Input placeholder={'Enter your phone number'} disabled className='shadow-input' defaultValue={mobile_no} />
              </Form.Item>
              <Form.Item
                label={<span>Resume <span className='text-gray f-10'>Attaching a resume is optional</span></span>}
                name='resume'
              >
                {!appliedWithFormeeResume && <div className=''>
                  <input
                    type='file'
                    onChange={this.handleResumeChange}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    style={{ display: 'none' }}
                    id='resume'
                  />

                  <div className='ant-upload-text float-left ant-upload-butoon-custom'>
                    <Button danger for='resume'>
                      <label
                        for='resume'
                        style={{ cursor: 'pointer' }}
                      >
                        Upload Resume
                                            </label>
                    </Button>
                    <div className='info-msg'>
                      Accepted file types: doc, docx, pdf, txt and rtf. (2MB limit).<br />
                      Resume will be stored in your Formee profile
                      </div>
                  </div>
                  {/* </label> */}
                </div>}
                {!appliedWithFormeeResume && <Row>
                  <Col span={24}>{this.renderFiles(resumeFileList, 'resume')}</Col>
                </Row>}
                {appliedWithFormeeResume &&
                  <div className='resume-preview'>
                    <div className='files-item'>
                      <span>Formee Resume </span>
                    </div>
                  </div>}
                {!appliedWithFormeeResume && <div className='f-12 mt-10'>
                  Or  &nbsp;<a className='blue-link'
                    onClick={this.handleJobApplication}
                  >Apply with your formee Resume</a>
                </div>}
              </Form.Item>
              <Form.Item
                label='Cover Letter'
                name='cover_letter'
              >
                <div className=''>
                  <input
                    type='file'
                    onChange={this.handleCoverLetterChange}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    style={{ display: 'none' }}
                    id='cover_letter'
                  />
                  <div className='ant-upload-text float-left ant-upload-butoon-custom'>
                    <Button danger>
                      <label
                        for='cover_letter'
                        style={{ cursor: 'pointer' }}
                      >
                        Choose file
                      </label>
                    </Button>
                    <div className='info-msg'>
                      Accepted file types: doc, docx, pdf, txt and rtf. (2MB limit).<br />
                      Resume will be stored in your Formee profile
                      </div>
                  </div>
                </div>
                <Row>
                  <Col span={24}>{this.renderFiles(coverLatterList, 'cover_letter')}</Col>
                </Row>
              </Form.Item>
              <div className='ques-ans-block'>
              {questions && questions.length!==0 && <div className='ques-heading'>Additional Questions From Employer</div>}
              {this.renderQuestions()}
              </div>              
              <Form.Item className='text-center'>
                <Button disabled={disableSendBtn} type='default' htmlType='submit' className='apply-btn-space'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>}
        {jobApplication && <Modal
          title='Job Application for'
          visible={jobApplication}
          className={'custom-modal style1 job-application-style'}
          footer={false}
          onCancel={this.onJobApplicationCancel}
        >
          <div className='padding'>
            <Row className='mb-35'>
              <Col span={24}>
                <Text className='fs-18 strong'>{classifiedDetail.title}</Text><br />
                <Text className='fs-18'>
                  {companyName && `${companyName} - `}{classifiedDetail.location !== 'N/A' && classifiedDetail.location}
                </Text>
              </Col>
            </Row>
            <Form
              {...layout}
              onFinish={this.onFinish2}
              className='job-application'
            >
              <Form.Item
                label='Resume'
                name='resume'
              >
                <Card>
                  <Row>
                    <Col span={18}>
                      <Title level={2}>{resumeDetails && `${resumeDetails.first_name} ${resumeDetails.last_name}`}</Title>
                    </Col>
                    <Col span={6} className='align-right'>
                      <Text onClick={() => {
                        this.props.history.push({
                          pathname: '/classifieds-jobs/resume-builder',
                          state: {
                            prevPagePath: this.props.location.pathname,
                          }
                        })
                      }} className='blue-link pnt-curs'>Edit Resume</Text>
                    </Col>
                  </Row>
                  <p>
                    {resumeDetails && resumeDetails.email}<br />
                    {resumeDetails && resumeDetails.phone_number}<br />
                    {resumeDetails && resumeDetails.home_location}<br />
                  </p>
                  <Row>
                    <Col span={19}>
                      {resumeDetails && resumeDetails.skills && convertHTMLToText(resumeDetails.skills)}
                    </Col>
                  </Row>
                  <Title level={4} className='sub-heading'>{'Work Experience'}</Title>
                  {resumeDetails && this.renderExperience(resumeDetails.work_experience)}
                  <Title level={4} className='sub-heading'>{'Education'}</Title>
                  {resumeDetails && this.renderEducation(resumeDetails.education)}
                </Card>
              </Form.Item>
              <Form.Item
                label={<span>{''}<br /></span>}
              >
                <div className='pt-10 pb-10'>
                  Or  &nbsp;&nbsp;<a className='blue-link' onClick={() => this.setState({ jobApplication: false, hideFirstModal: false })}
                  >Apply with a different Resume</a>
                </div>
              </Form.Item>
              <Form.Item
                label='Phone Number'
                name='mobile'
              >
                <Input placeholder={'Enter your phone number'} defaultValue={mobile_no} disabled className='shadow-input' />
              </Form.Item>
              <Form.Item
                label='Cover Letter'
                name='cover_letter'
              >
                <div className=''>
                  <input
                    type='file'
                    onChange={this.handleCoverLetterChange}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    style={{ display: 'none' }}
                    id='cover_letter'
                  />
                  <div className='ant-upload-text float-left ant-upload-butoon-custom'>
                    <Button danger>
                      <label
                        for='cover_letter'
                        style={{ cursor: 'pointer' }}
                      >
                        Choose file
                                            </label>
                    </Button>
                    <div className='info-msg'>
                      Accepted file types: doc, docx, pdf, txt and rtf. (2MB limit).<br />
                      Resume will be stored in your Formee profile
                      </div>
                  </div>
                </div>
                <Row>
                  <Col span={24}>{this.renderFiles(coverLatterList, 'cover_letter')}</Col>
                </Row>
              </Form.Item>
              <div className='ques-ans-block'>
              {questions && questions.length !==0 &&<div className='ques-heading'>Additional Questions From Employer</div>}
              {this.renderQuestions()}
              </div>
              <Form.Item className='text-center'>
                <Button disabled={disableSendBtn} type='default' htmlType='submit'>
                  Submit
                        </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>}
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

export default connect(mapStateToProps, { getJobQuestions, applyForJobAPI, getResume, enableLoading, disableLoading })(ApplyJobModal);
