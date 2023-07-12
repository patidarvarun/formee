import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Steps, Layout } from 'antd';
import StepFirst from './Step1';
import StepSecond from './Step2';
import StepThird from './Step3';
import StepFourth from './Step4'
import StepFive from './Step5'
import Payment from '../vendor/classified/classified-vendor-profile-setup/StepSecond-Enhanced'
import './postAd.less';
import { langs } from '../../config/localization';
import { checkPermissionForPostAd, openLoginModel, enableLoading, disableLoading } from '../../actions/index';

const { Step } = Steps;

class PostAd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            categoyType: '',
            step1Data: {
                isClassified: false,
                isRetail: false
            },
            step2Data: '',
            step3Data: '',
            step4Data: '',
            step5Data: '',
            adPermissionData: undefined,
            have_questions: 0,selectedPlanData: ''
        };
    }

    /**
   * @method componentWillMount
   * @description calleded before render the component
   */
    componentWillMount() {
        const { isLoggedIn, loggedInDetail, location } = this.props;
        let pathName = (location.state !== undefined && location.state.pathname !== undefined) ? location.state.pathname : '/';
        
        if (!isLoggedIn) {
        } else {
            this.props.enableLoading()
            this.props.checkPermissionForPostAd({ user_id: loggedInDetail.id }, res => {
                this.props.disableLoading()
                if (res.status === 200) {
                    let data = res.data;
                    if (data.seller_type === langs.key.private) {
                        let limit = data.total_number_of_ads_allowed == data.total_number_of_ads_posted_this_month
                        if (limit) {
                            this.setState({ permission: false })
                            this.props.history.push(pathName)
                        } else {
                            this.setState({ permission: true })
                        }
                    } else if (data.seller_type === langs.key.business) {
                        
                        let isjobPost = data.package && Array.isArray(data.package) ? data.package[0].is_job_post : ''
                        if (isjobPost) {
                            
                            let limit = data.total_number_of_ads_posted === data.total_number_of_ads_allowed;
                            if (limit) {
                                this.setState({ permission: false, adPermissionData: data, have_questions: data.package[0].have_questions })
                                this.props.history.push(pathName)
                            } else {
                                this.setState({ permission: true, adPermissionData: data, have_questions: data.package[0].have_questions })
                            }
                        } else {
                            this.props.history.push(pathName)
                        }
                    }
                }
            })
        }
    }

    /**
   * @method componentDidMount
   * @description callede after render the component
   */
    componentDidMount() {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            this.props.history.push('/')
        }
    }

    /**
   * @method handleSubmit
   * @description handle post an ad submit
   */
    handleSubmit(res, planId, plan) {
        const { loggedInDetail } = this.props
        const current = this.state.current + 1;
        this.setState({ current })
        if (loggedInDetail.user_type === langs.key.private) {
            if (res.data && res.data.data && res.data.data.classified_id) {
                this.setState({ current, planId: planId,selectedPlanData:plan, classifiedId: res.data.data.classified_id, step5Data: planId });
            }
        } else {
            if (res.data && res.data.id) {
                this.setState({ current, planId: planId,selectedPlanData:plan, classifiedId: res.data.id, step5Data: planId });
            }
        }
    }

    /**
    * @method next
    * @description called to go next step
    */
    next(categoyType, reqData, stepNo) {
        const current = this.state.current + 1;
        if (stepNo === 1) {
            this.setState({ current, categoyType: categoyType, step1Data: reqData });
        } else if (stepNo === 2) {
            this.setState({ current: current, step2Data: reqData });
        } else if (stepNo === 3) {
            this.setState({ current, step3Data: reqData });
        } else if (stepNo === 4) {
            this.setState({ current, step4Data: reqData });
        } else if (stepNo === 5) {
            this.setState({ current, step5Data: reqData });
        } else {
            this.setState({ current });
        }
    }

     /**
   * @method getPlan
   * @description get selected plan
   */
    getPlan = (plan) => {
        const current = this.state.current + 1;
        this.setState({ current, planId: plan.id,selectedPlanData:plan, step5Data: plan.id });
    }

    /**
   * @method handleAdSubmit
   * @description handle submit
   */
    handleAdSubmit = (res) => {
        const { loggedInDetail } = this.props
        const current = this.state.current + 1;
        this.setState({ current })
        if (loggedInDetail.user_type === langs.key.private) {
            if (res.data && res.data.data && res.data.data.classified_id) {
                this.setState({ current, classifiedId: res.data.data.classified_id });
            }
        } else {
            if (res.data && res.data.id) {
                this.setState({ current, classifiedId: res.data.id});
                
            }
        }
    }

    /**
    * @method render
    * @description render component
    */
    render() {
        const {isLoggedIn, loggedInDetail } = this.props
        const {selectedPlanData, adPermissionData, have_questions, current, categoyType, planId, classifiedId, step1Data, step2Data, step3Data, step4Data, step5Data } = this.state;
        
        const customerSteps = [
            {
                title: 'Step First',
                content: <StepFirst reqData={step1Data} nextStep={(categoyType, reqData) => this.next(categoyType, reqData, 1)} {...this.props} />,
            },
            {
                title: 'Step Second',
                content:  <StepSecond 
                        reqData={step2Data} 
                        nextStep={(reqData) => this.next('', reqData, 2)} 
                        {...this.props} 
                        categoyType={langs.key.classified} 
                    />,
            },
             {
                title: 'Step Five',
                content: 
                <StepFive 
                    reqData={step5Data} 
                    nextStep={(res) => this.getPlan(res)} 
                    {...this.props} 
                    categoryType={langs.key.classified}
                    selectedPlan={selectedPlanData}
                />,
            },
            {
                title: 'Step Third',
                content:
                    <StepThird 
                        reqData={step3Data} 
                        have_questions={have_questions} 
                        nextStep={(reqData) => this.next('', reqData, 3)} 
                        {...this.props}
                        categoryType={langs.key.classified} 
                    />,
            },
            {
                title: 'Step Fourth',
                content: <StepFourth 
                reqData={step4Data} 
                nextStep={(res) => this.handleAdSubmit(res)} 
                {...this.props} 
                adPermissionData={adPermissionData && adPermissionData}
                categoryType={langs.key.classified}
                selectedPlan={selectedPlanData}  
            />,
            },
            {
                title: 'Step Six',
                content: <Payment 
                            nextStep={() => this.next('', '')}
                            postAnAd={true} 
                            planId={planId} 
                            planData={selectedPlanData} 
                            classifiedId={classifiedId} 
                            categoryType={langs.key.classified}
                        />,
            },
        ];

        const vendorSteps = [
            {
                title: 'Step Second',
                content:  <StepSecond 
                        reqData={step2Data} 
                        nextStep={(reqData) => this.next('', reqData, 2)} 
                        {...this.props} 
                        categoyType={langs.key.classified} 
                    />,
            },
             {
                title: 'Step Five',
                content: 
                <StepFive 
                    reqData={step5Data} 
                    nextStep={(res) => this.getPlan(res)} 
                    {...this.props} 
                    categoryType={langs.key.classified}
                    selectedPlan={selectedPlanData}
                />,
            },
            {
                title: 'Step Third',
                content:
                    <StepThird 
                        reqData={step3Data} 
                        have_questions={have_questions} 
                        nextStep={(reqData) => this.next('', reqData, 3)} 
                        {...this.props}
                        categoryType={langs.key.classified} 
                    />,
            },
            {
                title: 'Step Fourth',
                content: <StepFourth 
                reqData={step4Data} 
                nextStep={(res) => this.handleAdSubmit(res)} 
                {...this.props} 
                adPermissionData={adPermissionData && adPermissionData}
                categoryType={langs.key.classified}
                selectedPlan={selectedPlanData}  
            />,
            },
            {
                title: 'Step Six',
                content: <Payment 
                            nextStep={() => this.next('', '')}
                            postAnAd={true} 
                            planId={planId} 
                            planData={selectedPlanData} 
                            classifiedId={classifiedId} 
                            categoryType={langs.key.classified}
                        />,
            },
        ];

        let steps = isLoggedIn && loggedInDetail && loggedInDetail.user_type !== langs.key.private ? vendorSteps : customerSteps
       
        return (
            <Layout className='post-ad-step-new-view'>
                <Layout>
                    <Layout>
                        <div className='wrap-old pb-40 '>
                            <div className='steps-content clearfix'>
                                {steps[current].content}
                            </div>
                            <Steps progressDot current={current} style={{ maxWidth: 374 }}>
                                {steps.map((item, index) => (
                                    <Step onClick={(e) => {
                                        if (index < current && current !== 5) {
                                            
                                            this.setState({ current: index })
                                        }
                                    }} key={item.title} />
                                ))}
                            </Steps>
                        </div>
                    </Layout>
                </Layout>
            </Layout >
        )
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default connect(
    mapStateToProps,
    { checkPermissionForPostAd, openLoginModel, enableLoading, disableLoading }
)(withRouter(PostAd));
