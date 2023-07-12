import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Steps, Layout, Typography, Card } from "antd";
import {
  getUserProfile,
  changeUserName,
  changeMobNo,
  saveTraderProfile,
} from "../../../../actions/index";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import StepFirst from "./StepFirst";
import StepSecond from "./StepSecond-Enhanced";
import history from "../../../../common/History";
import "../classified-vendor-profile-setup/userAccount.less";

const spinIcon = (
  <img
    src={require("./../../../../assets/images/loader1.gif")}
    alt=""
    style={{ width: "64px", height: "64px" }}
  />
);
const { Title, Text } = Typography;
const { Step } = Steps;
class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      submitFromOutside: false,
      current: 0,
      stepProgress: ["Profile Information", "Payment Information"],
      isAnotherPay: true
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    if (this.props.userDetails) {
      const { id } = this.props.userDetails;
      this.props.getUserProfile({ user_id: id });
    }
  }

  /**
   * @method next
   * @description called to go next step
   */
  next(reqData, stepNo) {
    const current = this.state.current + 1;
    if (stepNo === 1) {
      this.setState({ current, step1Data: reqData });
    } else {
      this.setState({ current });
    }
  }

  /**
   * @method next
   * @description called to go next step
   */
  previousStep = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  /**
   * @method renderSteps
   * @description manage steps progress
   */
  renderSteps = (steps) => {
    const { current } = this.state;
    return steps.map((el, i) => {
      return (
        <li
          className={
            i === current
              ? "active"
              : i < current
              ? `form-${i + 1}-visited`
              : ""
          }
          key={i}
          onClick={() => {
            if (i < current) {
              this.setState({ current: i });
            }
          }}
        >
          <Link to="/edit-business-Profile">{`${i + 1}.   ${el.label}`}</Link>
        </li>
      );
    });
  };

  onProfileComplete = () => {
    this.props.history.push('/myProfile')
  }
  /**
   * @method render
   * @description render component
   */
  render() {
    const { current, step1Data } = this.state;
    const { userDetails } = this.props;
    const steps = [
      {
        title: "Step First",
        label: "Profile Information",
        content: (
          <StepFirst
            userDetails={userDetails}
            nextStep={(reqData, stepNo) => this.next(reqData, 1)}
            submitFromOutside={this.state.submitFromOutside}
          />
        ),
      },
      {
        title: "Step Second",
        label: "Payment Information",
        content: (
          <StepSecond
            step1Data={step1Data}
            next={() => this.setState({ current: this.state.current + 1 })}
            previousStep={this.previousStep}
            onProfileComplete={this.onProfileComplete}
            isAnotherPay={this.state.isAnotherPay}
            showLater={true}
          />
        ),
      },
    ];
    let title = steps.filter((el, i) => i == current);
   
   
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout style={{ overflowX: "visible" }}>
            <div className="my-profile-box my-profile-box-v2 emp-profile-box-v2">
              <div className="card-container signup-tab">
                <div className="steps-content align-left mt-0">
                  <div className="sub-head-section">
                    <Text>All Fields Required</Text>
                  </div>
                  <Card
                    className="profile-content-box profile-content-box-v1 classfied-user-profile"
                    bordered={false}
                    title="Profile Set Up"
                    extra={<ul>{this.renderSteps(steps)}</ul>}
                  >
                    <Row className="step-with-info-box">
                      <Col md={8} className="pl-0">
                        <span>Step {`${current + 1} of 2`}</span>
                        <h3>
                          {title.length
                            ? title[0].label
                            : "Profile Information"}
                        </h3>
                        <p></p>
                        <p>
                          {current == 0 ? 'All Fields Required' : 'Please select your payment method'}</p>
                      </Col>
                    </Row>
                    {userDetails && steps[current].content}
                  </Card>
                </div>
                <div className="steps-action align-center mb-32"></div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
  };
};
export default connect(mapStateToProps, {
  getUserProfile,
  changeUserName,
  changeMobNo,
  saveTraderProfile,
})(EditProfile);
