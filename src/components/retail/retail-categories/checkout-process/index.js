import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Steps, Layout } from "antd";
import StepFirst from "./RetailCheckout";
import StepSecond from "./CheckoutOrderSummary";
import StepThird from "../../../booking/checkout/index";
import StepFourth from "./PaymentComplete";
import {
  openLoginModel,
  enableLoading,
  disableLoading,
} from "../../../../actions";
import StepFifth from "../../../common/ViewInvoice";
const { Step } = Steps;

class RetailCheckoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      //  current: 4,
    };
  }

  /**
   * @method next
   * @description called to go next step
   */
  next(reqData, stepNo) {
    console.log('call next ', reqData)
    console.log('call next 1 ', stepNo)
    const current = stepNo;
    if (stepNo === 1) {
      this.setState({ current: stepNo, step1Data: reqData });
    } else if (stepNo === 2) {
      this.setState({ current: stepNo, step2Data: reqData });
    } else if (stepNo === 3) {
      this.setState({ current: stepNo, step3Data: reqData });
    } else if (stepNo === 4) {
      this.setState({ current: stepNo, step4Data: reqData });
    } else if (stepNo === 5) {
      this.setState({ current: stepNo, step5Data: reqData });
    } else {
      this.setState({ current: stepNo });
    }
  }

  /**
   * @method prevStep
   * @description handle previous steps
   */
  prevStep() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { current, step1Data, step2Data, step3Data, step4Data, step5Data } =
      this.state;
      console.log('step1Data',this.state, this.props)
    const steps = [
      {
        title: "Step First",
        content: (
          <StepFirst
            reqData={step1Data}
            nextStep={(reqData) => this.next(reqData, 1)}
            prevStep={() => this.prevStep()}
            {...this.props}
          />
        ),
      },
      {
        title: "Step Second",
        content: (
          <StepSecond
            step1Data={step1Data}
            step2Data={step2Data}
            nextStep={(reqData) => this.next(reqData, 2)}
            prevStep={() => this.prevStep()}
            {...this.props}
          />
        ),
      },
      {
        title: "Step Third",
        content: (
          <StepThird
            reqData={step2Data}
            nextStep={(reqData, step, orderInfo = {}) => {
              reqData = {
                ...reqData,
                ...orderInfo,
              };
              console.log('$reqData',reqData)
              this.next(reqData, 3);
              if (step === 4) {
                this.next(reqData, step);
              }
            }}
            prevStep={() => this.prevStep()}
            {...this.props}
          />
        ),
      },
      {
        title: "Step fourth",
        content: (
          <StepFourth
            reqData={step3Data}
            nextStep={(reqData) => this.next(reqData, 4)}
            prevStep={() => this.prevStep()}
            {...this.props}
          />
        ),
      },
      {
        title: "Step fifth",
        content: (
          <StepFifth
            reqData={step4Data}
            nextStep={(reqData) => this.next(reqData, 5)}
            prevStep={() => this.prevStep()}
            {...this.props}
          />
        ),
      },
    ];

    return (
      <Layout>
        <Layout>
          <Layout>
            <div className="wrap-old pb-40 ">
              <div className="steps-content clearfix">
                {steps[current].content}
                {console.log('steps[current].content = ',steps[current].content)}
                {console.log('steps[current].content = ',steps[current])}
                {console.log('steps[current].content = ',steps)}
              </div>
              {/* <Steps
                progressDot
                current={current}
                style={{ maxWidth: 374 }}
                onChange={(a, h) => { }}
              >
                {steps.map((item, index) => (
                  <Step
                    onClick={(e) => {
                      if (index < current && current !== 5) {
                        this.setState({ current: index });
                      }
                    }}
                    key={item.title}
                  />
                ))}
              </Steps> */}
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, retail } = store;

  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};

export default connect(mapStateToProps, {
  openLoginModel,
  enableLoading,
  disableLoading,
})(withRouter(RetailCheckoutPage));
