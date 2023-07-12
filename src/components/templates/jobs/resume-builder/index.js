import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../../../sidebar';
import { Layout, Typography, Tabs, Steps, Form, Input, Select, Button, Breadcrumb } from 'antd';
import { toastr } from 'react-redux-toastr';
import { createResume, getResume, disableLoading, enableLoading } from '../../../../actions';
import { MESSAGES } from '../../../../config/Message';
import { langs } from '../../../../config/localization';
import BasicInfo from './BasicInfo'
import WorkExperience from './WorkExperience'
import Education from './Education';
import Skills from './Skills';
import AddFiles from './AddFiles';
import Resume from './Resume';
import { objectToFormData } from 'object-to-formdata';
import './resume.less';

const { Step } = Steps;
const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class ResumeBuilder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            classifiedList: [],
            current: 0,
            basicInfo: {},
            experience: {},
            education: {},
            skills: {},
            addFiles: {},
            isOpenResumeModel: false,
        };
    }


    /**
     * @method onTabChange
     * @description manage tab change
     */
    onTabChange = (key, type) => {
        
        this.setState({ [type]: key });
    };

    /**
 * @method componentWillMount
 * @description called before mounting the component
 */
    componentWillMount() {

        this.props.getResume((res) => {
            
        })
    }
    /**
    * @method createResume
    * @description create resume
    */
    createResume = () => {
        const { basicInfo, education, experience, skills, addFiles } = this.state;
        let formData = new FormData();
        let reqData = basicInfo;
        reqData.documents = addFiles
        reqData.work_experience = experience;
        reqData.education = education
        reqData.skills = skills
        

        for (var i = 0; i < reqData.documents.length; i++) {
            formData.append('documents[]', reqData.documents[i]);
            
        }
        Object.keys(reqData).forEach((key) => {
            if (typeof reqData[key] == 'object' && key !== 'documents') {
                formData.append(key, JSON.stringify(reqData[key]))
            }
            // else if( key === 'documents'){
            //     let data = []
            //     for (var i = 0; i < temp.length; i++) {
            //         formData.append('service_images[]', temp[i]);
            //         
            //       }


            // reqData[key].map((e, i) => {
            //     
            //     
            //     formData.append(key,reqData[key][i] );
            // })
            // }
            else {
                formData.append(key, reqData[key])
            }
        })
        this.props.enableLoading()
        

        this.props.createResume(formData, (res) => {
            this.props.disableLoading()
            if (res.status == 200) {
                toastr.success(langs.success, MESSAGES.RESUME_UPDATE);
                // this.props.history.push('/classifieds-jobs/resume-builder')
                this.props.getResume((res) => {
                    if (res.status === 200) {
                        // this.props.location.state 
                        if (this.props.location.state && this.props.location.state.prevPagePath !== undefined) {
                            // window.location.assign(`${this.props.location.state.prevPagePath}`)
                            this.props.history.push({
                                pathname: `${this.props.location.state.prevPagePath}`,
                                state: {
                                    isOpenResumeModel: true
                                }
                            })

                        } else {
                            window.location.assign('/classifieds-jobs/resume-builder')
                        }
                    }
                })
            }
        })
    }


    /**
     * @method next
     * @description called to go next step
     */
    next(value, key) {
        
        const current = this.state.current + 1;
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
        if (key === 1) {
            this.setState({ current, basicInfo: value });
        } else if (key === 2) {
            this.setState({ experience: value, current: this.state.current + 1 });
        } else if (key === 3) {
            this.setState({ education: value, current: this.state.current + 1 });
        } else if (key === 4) {
            this.setState({ skills: value, current: this.state.current + 1 });
        } else if (key === 5) {
            
            this.setState({ addFiles: value });
        }

    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { isOpenResumeModel } = this.state;
        const { current, basicInfo, education, experience, skills, addFiles } = this.state;
        
        const steps = [
            {
                title: 'Basic Info',
                // content: <WorkExperience next={(value, key) => this.next(value, key)} bussiness={this.state.bussiness} />,
                content: <BasicInfo nextStep={(value, key) => this.next(value, key)} />
            },
            {
                title: 'Work Experience',
                content: <WorkExperience next={(value, key) => this.next(value, key)} bussiness={this.state.bussiness} />,
            },
            {
                title: 'Education',
                content: <Education next={(value, key) => this.next(value, key)} bussiness={this.state.bussiness} />,
            },
            {
                title: 'Skills',
                content: <Skills next={(value, key) => this.next(value, key)} bussiness={this.state.bussiness} />,
            },
            {
                title: 'Add Files',
                content: <AddFiles next={(value, key) => this.next(value, key)} createResume={() => {
                    this.createResume()
                }} openResumeModal={() => this.setState({ isOpenResumeModel: true })} />,
            },
        ];

        return (
            <Fragment>
                <Layout>
                    <Content className='site-layout'>
                        {/* <Tabs type='card' className={'tab-style2'}> */}
                        <div className='wrap resume-wrap'>
                            <Title level={2} className='text-blue'>{'Create formee Resume'}</Title>
                            <Text className='text-gray'>{'Create a resume for your profile'}</Text>
                            <div className='steps-content'>{steps[current].content}</div>
                            <Steps progressDot current={current}>
                                {steps.map((item, index) => {
                                    return <Step onClick={(e) => {
                                        if (index < current) {
                                            this.setState({ current: index })
                                        }
                                    }} key={item.title} />
                                })}
                            </Steps>
                        </div>
                        {/* </Tabs> */}
                    </Content>
                </Layout>
                {isOpenResumeModel &&
                    <Resume
                        visible={isOpenResumeModel}
                        basicInfo={basicInfo}
                        experience={experience}
                        education={education}
                        skills={skills}
                        addFiles={addFiles && addFiles}
                        onCancel={() => {
                            this.setState({ isOpenResumeModel: false })
                        }}
                    />
                }
            </Fragment >
        )
    }
}


const mapStateToProps = (store) => {
    const { auth, classifieds } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedClassifiedList: classifieds.classifiedsList,
        resumeDetails: classifieds.resumeDetails !== null ? classifieds.resumeDetails : ''
    };
}

export default connect(
    mapStateToProps, { createResume, getResume, enableLoading, disableLoading }
)(ResumeBuilder);