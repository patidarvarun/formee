import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom'
import {
    Form,
    Input,
    Typography,
    Row,
    Col,
    Button,
    Modal,
    Card
} from 'antd';
import { validMobile } from '../../../config/FormValidation'
import { enableLoading, disableLoading, applyForJobAPI, getResume } from '../../../actions'
import { convertHTMLToText } from '../../common'
import { langs } from '../../../config/localization';
import { MESSAGES } from '../../../config/Message'
import { STATUS_CODES } from '../../../config/StatusCode'
const { Text, Title } = Typography;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13, offset: 1 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { offset: 7, span: 13 },
    className: 'align-center pt-20'
};

class JobApplicationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            resume: [],
            cover_letter: [],
        };
    }


    /**
   * @method onFinish
   * @description handle on submit
   */
    onFinish = (values) => {
        this.props.enableLoading()
        const { resumeDetails } = this.props;
        
        // const { name, email, mobile_no } = userDetails;
        // const { resumeFileList, coverLatterList } = this.state
        const requestData = {
            //   classified_id: classifiedDetail && classifiedDetail.id,
            //   customer_id: userDetails.id,
            //   fname: userDetails.fname,
            //   lname: userDetails.lname,
            //   mobile: mobile_no,
            //   applicant_email: userDetails.email,
            //   ans: JSON.stringify(this.state.answer),

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
     * @method renderExperience
     * @description Used to render experience
     */
    renderExperience = (experience) => {
        console.log('experience',experience)
        return experience.length && experience.map((el) => (
            <Row>
                <Col span={19}>
                    <p className='strong mb-5'>{el.job_title}</p>
                    <p>{el.company} <br /></p>
                    <p>{convertHTMLToText(el.description)}</p>
                </Col>
                <Col span={5} className='align-right'>
                    <Text className='strong'>{`${el.start_month} ${el.start_year} - ${el.complete_month} ${el.complete_year}`}</Text>
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
                <Col span={19}>
                    <p className='strong mb-5'>{el.institution}</p>
                    <p>{el.level_of_qualification}</p>
                    <p>{el.course}</p>
                </Col>
                <Col span={5} className='align-right'>
                    <Text className='strong'>{`${el.finished_from_month} - ${el.finished_to_month} ${el.finished_to_year}`}</Text>
                </Col>
            </Row>
        ))
    }



    /**
     * @method render
     * @description render component
     */
    render() {
        const { jobVisible, classifiedDetail, companyName, resumeDetails } = this.props;
        
        const styles = {
            card: {
                maxHeight: '100%'
            },
            cardBody: {
                maxHeight: '10%',
                overflow: 'auto'
            }
        };
        return (
            <Modal
                title='Job Application for'
                visible={jobVisible}
                className={'custom-modal style1 job-application-style'}
                footer={false}
                onCancel={this.props.onJobCancel}
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
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            label='Resume'
                            name='resume'
                        >
                            {/* <TextArea rows={6}
                                className='shadow-input'
                                defaultValue={
                                   
                                    // 'A variety of software today can generate semi-random text which looks like jumbled Latin. Apple Pages and Keynote software employs such jumbled text as sample screenplay layout. Lorem ipsum is also featured on Joomla!, Google Docs, Google Slides, and WordPress web content managers. Microsoft Word[6][7] and BBEdit have a Lorem ipsum generation feature. Several LaTeX packages produce Lorem ipsum–style text.'
                                }
                            /> */}
                            <Card style={styles.cardBody}>
                                <Row>
                                    <Col span={19}>
                                        <Title level={2}>{resumeDetails && `${resumeDetails.first_name} ${resumeDetails.last_name}`}</Title>
                                    </Col>
                                    <Col span={5} className='align-right'>
                                        <Link to='/classifieds-jobs/resume-builder' className='blue-link'>edit resume</Link>
                                    </Col>
                                </Row>
                                <p>
                                    {resumeDetails && resumeDetails.email}<br />
                                    {resumeDetails && resumeDetails.phone_number}<br />
                                    {resumeDetails && resumeDetails.home_location}<br />
                                </p>
                                <Row>
                                    <Col span={19}>
                                        {resumeDetails && convertHTMLToText(resumeDetails.skills)}
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
                            <div className='pt-20'>
                                or  <a className='blue-link'>Apply with a different Resume</a>
                            </div>
                        </Form.Item>
                        <Form.Item
                            label='Contact Number'
                            name='mobile'
                            rules={[{ validator: validMobile }]}
                        >
                            <Input placeholder={'Enter your phone numberrrrrr'} className='shadow-input' />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button onClick={(e) => {
                                

                            }} type='default' htmlType='submit'>
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
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
    };
};

export default connect(mapStateToProps, { applyForJobAPI, getResume, enableLoading, disableLoading })(JobApplicationModal);
