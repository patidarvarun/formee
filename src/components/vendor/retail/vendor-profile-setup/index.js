import React from "react";
import { Link, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import { connect } from "react-redux";
import { Steps, Layout, Typography, Card, Row, Col, Space } from "antd";
import Icon from "../../../customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  checkPaypalAccepted,
  getTraderProfile,
  saveTraderProfile,
  getUserProfile,
  changeUserName,
  changeMobNo,
} from "../../../../actions";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import StepFirst from "./BasicDetail";
import StepSecond from "./PostageDetail";
import PaymentScreen from "../../../dashboard/vendor-profiles/common-profile-setup/PaymentScreen";
import history from "../../../../common/History";
import { MESSAGES } from "../../../../config/Message";

const { Title, Text } = Typography;
const { Step } = Steps;

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      submitFromOutside: false,
      current: 0,
      step1Data: {},
      step2Data: {},
      paymentData: {},
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    if (this.props.userDetails) {
      const { id } = this.props.userDetails;
      this.props.getTraderProfile({ user_id: id });
    }
  }

  /**
   * @method next
   * @description called to go next step
   */
  next(reqData, step) {
    const { loggedInUser } = this.props;
    const current = this.state.current + 1;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (step === 1) {
      this.setState({ current, step1Data: reqData });
    } else if (step === 2) {
      this.setState({ current, step2Data: reqData });
    } else if (step === 3) {
      this.saveTraderProfile(reqData);
    }
  }

  /**
   * @method previousStep
   * @description called to go previous step
   */
  previousStep = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  /**
   * @method saveTraderProfile
   * @description save vendor trader profile
   */
  saveTraderProfile = (data) => {
    const { loggedInUser, traderProfile } = this.props;

    const { id } = this.props.userDetails;
    const {
      city,
      state,
      business_name,
      business_pincode,
      country,
      country_code,
      business_city,
      business_state,
      state_code,
    } = traderProfile.user;
    const { step1Data, step2Data, paymentData } = this.state;

    let temp = [];
    step1Data &&
      Array.isArray(step1Data.service_images) &&
      step1Data.service_images.filter((el) => {
        el.originFileObj && temp.push(el.originFileObj);
      });

    let reqData = {
      user_id: id,
      business_name: step1Data.bussiness_name
        ? step1Data.bussiness_name
        : business_name !== "undefined"
        ? business_name
        : "Vendor",
      pincode: step1Data.pincode
        ? step1Data.pincode
        : business_pincode !== "undefined"
        ? business_pincode
        : "",
      city: step1Data.city ? step1Data.city : business_city,
      country: step1Data.country ? step1Data.country : country,
      country_code: step1Data.country_code
        ? step1Data.country_code
        : country_code,
      state: step1Data.state ? step1Data.state : business_state,
      state_code: step1Data.state_code ? step1Data.state_code : state_code,
      contact_name: step1Data.contact_name,
      address: step1Data.address,
      description: step1Data.description,
      contact_number: step1Data.mobile_no,
      bsb: paymentData.bsb ? paymentData.bsb : "",
      account_name: paymentData.account_name ? paymentData.account_name : "",
      bank_name: paymentData.bank_name ? paymentData.bank_name : "",
      account_number: paymentData.account_number
        ? paymentData.account_number
        : "",
      ["service_images[]"]: temp,
      //unused requestdata
      capacity_info: "",
      mobile_no_verified: 0,
      event_type_ids: "0",
      start_from_hr: 0,
      profile_dietary_ids: "",
      basic_quote: 0,
      service_and_facilities: "",
      working_hours: "[]",
      capacity: "",
      service_type: "",
      rate_per_hour: 0,
      is_public_closed: 0,
      fitness_amenities_ids: "",
      booking_cat_id: "",
      booking_sub_cat_id: "",
    };
    reqData = { ...reqData, ...step2Data };
    if (paymentData.selectedPaymentMethod === "bank") {
      reqData = {
        ...reqData,
        is_mastercard: paymentData.is_mastercard,
        is_visa: paymentData.is_visa,
        is_applepay: paymentData.is_applepay,
        is_afterpay: paymentData.is_afterpay,
        is_gpay: paymentData.is_gpay,
      };
    }
    reqData = {
      ...reqData,
      is_paypal_accepted: paymentData.is_paypal_accepted,
      bank: paymentData.bank,
    };
    // const formData = new FormData()
    if (loggedInUser.user_type !== "restaurant") {
      const formData = new FormData();
      for (var i = 0; i < temp.length; i++) {
        formData.append("service_images[]", temp[i]);
      }

      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key]);
      });
      // if (paymentData.ispayPalAccepted) {
      if (paymentData.selectedPaymentMethod === "paypal") {
        this.props.checkPaypalAccepted({ user_id: loggedInUser.id }, (res) => {
          if (res.status === 200) {
            formData.append("is_paypal_accepted", 1);
            this.saveTraderProfileData(formData);
          } else {
            formData.append("is_paypal_accepted ", 0);
            this.saveTraderProfileData(formData);
          }
        });
      } else {
        this.saveTraderProfileData(formData);
      }
    }
  };

  /**
   * @method saveTraderProfileData
   * @description save  trader profile data
   */
  saveTraderProfileData = (formData) => {
    const { id } = this.props.userDetails;
    this.props.enableLoading();
    this.props.saveTraderProfile(formData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.PROFILE_UPDATE_SUCCESS);
        this.props.getTraderProfile({ user_id: id });
        this.props.history.push("/vendor-profile");
        // this.setState({ current });
      }
    });
  };

  renderTabProgress = (steps) => {
    const { current } = this.state;
    return (
      <ul>
        {steps.map((step, index) => (
          <li
            className={
              index === current
                ? "active"
                : index < current
                ? `form-${index + 1}-visited`
                : ""
            }
            onClick={() => {
              if (current > index) {
                this.setState({ current: index });
              }
            }}
          >
            <p>
              {index + 1}. {step.label}
            </p>
          </li>
        ))}
      </ul>
    );
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const { current, step1Data } = this.state;
    const { userDetails, loggedInUser, traderProfile } = this.props;

    const steps = [
      {
        title: "Step First",
        label: "Profile Information",
        content: (
          <StepFirst
            // content: <StepSecond
            userDetails={traderProfile}
            nextStep={(reqData) => this.next(reqData, 1)}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Second",
        label: "Business Information",
        content: (
          <StepSecond
            userDetails={traderProfile}
            nextStep={(reqData) => this.next(reqData, 2)}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Third",
        label: "Payment Information",
        content: (
          <PaymentScreen
            userDetails={traderProfile}
            nextStep={(reqData) => {
              this.setState({ paymentData: reqData }, () => {
                this.next(reqData, 3);
              });
            }}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
    ];

    let title = steps && steps.filter((el, i) => i == current);

    return (
      <Layout className="retail-vendor-layer-five">
        <Layout>
          <AppSidebar history={history} />
          <Layout style={{ overflowX: "visible" }}>
            <div className="my-profile-box my-profile-setup my-profile-box-v2 retail-vendor-profile-box-v2">
              <div className="card-container signup-tab">
                <div className="steps-content align-left mt-0">
                  {/* <div className="top-head-section">
                    <div className="left">
                      <Title level={2}>My Profile </Title>
                    </div>
                    <div className="right"></div>
                  </div> */}
                  <div className="sub-head-section">
                    <Text>All Fields Required</Text>
                  </div>
                  <Card
                    className="profile-content-box profile-content-box-v1"
                    extra={this.renderTabProgress(steps)}
                  >
                    <Row className="step-with-info-box">
                      <Col md={8} className="pl-0">
                        <span>Step {current + 1} of 3</span>
                        <h3>
                          {title && title.length
                            ? title[0].label
                            : "Profile Information"}
                        </h3>
                        <p className="all-fileld-required">Required</p>
                      </Col>
                      {/* <Col md={20} className="clear-all-action">
                        <span
                          className="pr-5"
                          onClick={() =>
                            this.setState({ submitFromOutside: true })
                          }
                        >
                          {" "}
                          Clear all
                        </span>
                        <img
                          src={require("./../../../../assets/images/icons/delete-blue.png")}
                          alt="delete-blue"
                        />
                      </Col> */}
                    </Row>
                    {steps[current].content}
                    {/* <Steps
                      //progressDot
                      current={current}
                      className="profile-vendors-steps-dot"
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
    traderProfile:
      profile.traderProfile !== null ? profile.traderProfile : null,
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  checkPaypalAccepted,
  getTraderProfile,
  saveTraderProfile,
  getUserProfile,
  changeUserName,
  changeMobNo,
})(withRouter(EditProfile));
