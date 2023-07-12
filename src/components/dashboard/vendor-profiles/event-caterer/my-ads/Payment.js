import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import { Steps, Layout } from 'antd';
import StepFive from './Plan'
import Payment from '../../../edit-profile/StepSecond'
import '../../../../post-ad/postAd.less';
import { langs } from '../../../../../config/localization';
import { checkPermissionForPostAd, openLoginModel, enableLoading, disableLoading } from '../../../../../actions';
import AppSidebarInner from '../../../../sidebar/HomeSideBarbar';
import history from '../../../../../common/History';
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
     * @method handleSubmit
     * @description handle post an ad submit
     */
    handleSubmit(catId, planId, planData) {
        const { loggedInDetail } = this.props
        
        const current = this.state.current + 1;
        this.setState({ current, planId: planId,classifiedId: catId, selectedPlanData: planData});
        
    }

    /**
    * @method next
    * @description called to go next step
    */
    next(categoyType, reqData, stepNo) {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    /**
    * @method render
    * @description render component
    */
    render() {
        const {selectedPlanData, adPermissionData, have_questions, current, categoyType, planId, classifiedId, step1Data, step2Data, step3Data, step4Data, step5Data } = this.state;
        
        const steps = [
            {
                title: 'Step one',
                content: <StepFive reqData={step5Data} nextStep={(catId, planId, planData) => this.handleSubmit(catId,planId, planData)} {...this.props} editPost={true}/>,
            },
            {
                title: 'Step two',
                content: <Payment nextStep={() => this.next('', '')} postAnAd={true} planId={planId} planData={selectedPlanData} classifiedId={classifiedId} />,
            },
        ];
        return (
            <Layout>
                {}
                <Layout>
                    <AppSidebarInner history={history} />
                    <Layout>
                        <div className='wrap-old pb-40 '>
                            <div className='steps-content clearfix'>
                                {steps[current].content}
                            </div>
                            <Steps progressDot current={current} style={{ maxWidth: 374 }}>
                                {steps.map((item, index) => (
                                    <Step onClick={(e) => {
                                        if (index < current && current !== 2) {
                                            
                                            this.setState({ current: index })
                                        }
                                    }} 
                                    key={item.title} />
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