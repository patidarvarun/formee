import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Steps, Layout } from "antd";
import RetailFirstStep from "./Step1";
import RetailSecondStep from "./Step2";
import StepThird from "../classified-post-ad/Step4";
import "../classified-post-ad/postAd.less";
import { langs } from "../../config/localization";
import {
  checkPermissionForPostAd,
  openLoginModel,
  enableLoading,
  disableLoading,
} from "../../actions/index";
const { Step } = Steps;

class PostAd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      categoyType: "",
      step1Data: {
        isClassified: false,
        isRetail: false,
      },
      step2Data: "",
      step3Data: "",
      step4Data: "",
      step5Data: "",
      adPermissionData: undefined,
      have_questions: 0,
      selectedPlanData: "",
    };
  }

  componentWillMount() {
    const { isLoggedIn, loggedInDetail, location } = this.props;
    let pathName =
      location.state !== undefined && location.state.pathname !== undefined
        ? location.state.pathname
        : "/";
    if (!isLoggedIn) {
    } else {
      this.props.enableLoading();

      this.props.checkPermissionForPostAd(
        { user_id: loggedInDetail.id },
        (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            let data = res.data;
            if (data.seller_type === langs.key.private) {
              let limit =
                data.total_number_of_ads_allowed ==
                data.total_number_of_ads_posted_this_month;
              if (limit) {
                this.setState({ permission: false });
                this.props.history.push(pathName);
              } else {
                this.setState({ permission: true });
              }
            } else if (data.seller_type === langs.key.business) {
              let isjobPost =
                data.package && Array.isArray(data.package)
                  ? data.package[0].is_job_post
                  : "";
              if (isjobPost) {
                let limit =
                  data.total_number_of_ads_posted ===
                  data.total_number_of_ads_allowed;
                if (limit) {
                  this.setState({
                    permission: false,
                    adPermissionData: data,
                    have_questions: data.package[0].have_questions,
                  });
                  // toastr.warning(langs.warning,MESSAGES.POST_LIMIT)
                  this.props.history.push(pathName);
                } else {
                  this.setState({
                    permission: true,
                    adPermissionData: data,
                    have_questions: data.package[0].have_questions,
                  });
                }
              } else {
                // toastr.warning(langs.warning,MESSAGES.PERMISSION_ERROR)
                this.props.history.push(pathName);
              }
            }
          }
        }
      );
    }
  }

  componentDidMount() {
    const { isLoggedIn, loggedInDetail, location } = this.props;
    // let pathName = (location.state !== undefined && location.state.pathname !== undefined) ? location.state.pathname : '/';
    //

    if (!isLoggedIn) {
      // this.props.openLoginModel(true)
      this.props.history.push("/");
    }
  }

  /**
   * @method handleSubmit
   * @description handle post an ad submit
   */
  handleSubmit(res, planId, plan) {
    const { loggedInDetail } = this.props;

    const current = this.state.current + 1;
    this.setState({ current });
    if (loggedInDetail.user_type === langs.key.private) {
      if (res.data && res.data.data && res.data.data.classified_id) {
        this.setState({
          current,
          planId: planId,
          selectedPlanData: plan,
          classifiedId: res.data.data.classified_id,
          step5Data: planId,
        });
      }
    } else {
      if (res.data && res.data.id) {
        this.setState({
          current,
          planId: planId,
          selectedPlanData: plan,
          classifiedId: res.data.id,
          step5Data: planId,
        });
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

  getPlan = (plan) => {
    console.log("plan", plan);
    const current = this.state.current + 1;
    this.setState({
      current,
      planId: plan.id,
      selectedPlanData: plan,
      step5Data: plan.id,
    });
  };

  handleAdSubmit = (res) => {
    const { loggedInDetail } = this.props;
    const current = this.state.current + 1;
    this.setState({ current });
    if (loggedInDetail.user_type === langs.key.private) {
      if (res.data && res.data.data && res.data.data.classified_id) {
        this.setState({ current, classifiedId: res.data.data.classified_id });
      }
    } else {
      if (res.data && res.data.id) {
        this.setState({ current, classifiedId: res.data.id });
      }
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { loggedInDetail } = this.props;
    const {
      selectedPlanData,
      adPermissionData,
      have_questions,
      current,
      categoyType,
      planId,
      classifiedId,
      step1Data,
      step2Data,
      step3Data,
      step4Data,
      step5Data,
    } = this.state;
    console.log("enter in retail post ad");
    const retailSteps = [
      {
        title: "Step Second",
        content: (
          <RetailFirstStep
            reqData={step2Data}
            nextStep={(reqData) => this.next("", reqData, 2)}
            {...this.props}
            categoyType={"retail"}
          />
        ),
      },
      {
        title: "Step Third",
        content: (
          <RetailSecondStep
            reqData={step3Data}
            have_questions={have_questions}
            nextStep={(reqData) => this.next("", reqData, 3)}
            {...this.props}
            categoryType={"retail"}
          />
        ),
      },
      {
        title: "Step Fourth",
        content: (
          <StepThird
            reqData={step4Data}
            nextStep={(res) => this.handleAdSubmit(res)}
            {...this.props}
            adPermissionData={adPermissionData && adPermissionData}
            categoryType={"retail"}
            selectedPlan={selectedPlanData}
          />
        ),
      },
    ];
    return (
      <Layout className="post-ad-step-new-view retail-post-ad-edit-v1">
        <Layout>
          <Layout>
            <div className="wrap-old pb-40 ">
              <div className="steps-content clearfix">
                {retailSteps[current].content}
              </div>
              <Steps progressDot current={current} style={{ maxWidth: 374 }}>
                {retailSteps.map((item, index) => (
                  <Step
                    onClick={(e) => {
                      if (index < current && current !== 5) {
                        this.setState({ current: index });
                      }
                    }}
                    key={item.title}
                  />
                ))}
              </Steps>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};

export default connect(mapStateToProps, {
  checkPermissionForPostAd,
  openLoginModel,
  enableLoading,
  disableLoading,
})(withRouter(PostAd));
