import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  Checkbox,
  Button,
  message,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Radio,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../../booking/checkout/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import "./style.less";
import {
  retailPaymentAPI,
  getPaypalUrl,
  getStripeUrl,
  verifyStripe,
  verifyPaypal,
  enableLoading,
  disableLoading,
  getPaypalLoginUrl,
  getTraderProfile,
} from "../../../../actions";
import "../myprofilestep.less";
import { required, validNumber } from "../../../../config/FormValidation";
import {
  setCustomLocalStorage,
  getCustomLocalStorage,
} from "../../../../common/Methods";
import { MESSAGES } from "../../../../config/Message";
import { Stripe_Public_key } from "../../../../config/Config";
import Preview from "./PaypalUrlModal";

import Title from "antd/lib/skeleton/Title";
const stripePromise = loadStripe(Stripe_Public_key);
const { Text } = Typography;

function onChange(checkedValues) {}

const options = [
  { label: "Credit Card", value: "Credit Card" },
  { label: "Apple Pay", value: "Apple Pay" },
  { label: "GPay", value: "GPay" },
];

class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitFromOutside: false,
      submitBussinessForm: false,
      imageUrl: "",
      key: 1,
      paymentMethodsKey: "cardPayment",
      opened: false,
      ispayPalAccepted: true,
      visible: false,
      paypalUrl: "",
      selectedPaymentMethod: "",
      accepted_payment_methods: {
        bank: 0,
        is_afterpay: 0,
        is_applepay: 0,
        is_gpay: 0,
        is_mastercard: 0,
        is_visa: 0,
        paypal: 0,
        stripe: 0,
      },
    };
    this.toggleBox = this.toggleBox.bind(this);
  }
  componentDidMount() {
    const { userDetails } = this.props;
    const queryParams = new URLSearchParams(window.location.search);
    const cid = queryParams.get("cid");

    const merchantId = queryParams.get("merchantId");
    const permissionsGranted = queryParams.get("permissionsGranted");
    const merchantIdInPayPal = queryParams.get("merchantIdInPayPal");
    const consentStatus = queryParams.get("consentStatus");
    const productIntentId = queryParams.get("productIntentId");
    const isEmailConfirmed = queryParams.get("isEmailConfirmed");
    const productIntentID = queryParams.get("productIntentID");
    if (merchantId != null) {
      let params = {
        merchantId: merchantId,
        permissionsGranted: permissionsGranted,
        merchantIdInPayPal: merchantIdInPayPal,
        consentStatus: consentStatus,
        productIntentId: productIntentId,
        productIntentID: productIntentID,
        isEmailConfirmed: isEmailConfirmed,
      };
      this.props.verifyPaypal({ data: params }, (res) => {
        if (res && res.status === 200) {
          toastr.success(langs.success, res.data.data.message);
          let tmp = res.data.data;
          tmp.paypal = 1;
          // this.setState({
          //   accepted_payment_methods: tmp,
          // });
          this.setState({
            selectedPaymentMethod: "paypal"  
          });
        }
      });
    }
    if (cid != null) {
      this.props.verifyStripe({ ca_id: cid }, (res) => {
        if (res && res.status === 200) {
          toastr.success(langs.success, res.data.data.message);
          let tmp = res.data.data;
          tmp.stripe = 1;
          // this.setState({
          //   accepted_payment_methods: tmp,
          // });
          this.setState({
            selectedPaymentMethod: "stripe"    
          });
        }
      });
    }

    this.props.getTraderProfile({ user_id: userDetails.id }, (res) => {
      
      if (res.data.success === true) { console.log('res paymentScreen,js 145',res)
        this.setState({ accepted_payment_methods : res.data.accepted_payment_methods});
      }
    });
    console.log('accepted_payment_methods paymentScreen,js 145',this.state.accepted_payment_methods)

    console.log("userDetails: line 142 ", userDetails);
    this.setState({
      accepted_payment_methods: {
        ...this.state.accepted_payment_methods,
        is_afterpay: userDetails.accepted_payment_methods.is_afterpay,
        is_applepay: userDetails.accepted_payment_methods.is_applepay,
        is_gpay: userDetails.accepted_payment_methods.is_gpay,
        is_mastercard: userDetails.accepted_payment_methods.is_mastercard,
        is_visa: userDetails.accepted_payment_methods.is_visa,
        paypal: this.state.selectedPaymentMethod === "paypal" ? 1 : 0,
        stripe: this.state.selectedPaymentMethod === "stripe" ? 1 : 0,
      },
    });
   
    // this.setState({
    //   selectedPaymentMethod:
    //     userDetails.accepted_payment_methods.paypal === 1 ? "paypal" : "stripe",
    // });
    // this.setState({
    //   selectedPaymentMethod:
    //     userDetails.accepted_payment_methods.stripe === 1 ? "stripe" : "paypal",
    // });
  }
  /**
   * @method toggleBox
   * @description handle toggleBox
   */
  toggleBox() {
    const { opened } = this.state;
    this.setState({
      opened: !opened,
    });
  }

  /**
   * @method onTabChange
   * @description handle ontabchange
   */
  onTabChange = () => {
    const { key } = this.state;
    if (key === 1) {
      this.setState({ key: 2 });
    } else if (key === 2) {
      this.setState({ key: 1 });
    }
  };

  paymentMethodsTab = (key, type) => {
    this.setState({ [type]: key });
  };

  /**
   * @method submitCustomForm
   * @description handle custum form
   */
  submitCustomForm = () => {
    this.setState({
      submitFromOutside: true,
      submitBussinessForm: true,
    });
  };

  verify = async () => {
    const { id } = this.props.loggedInUser;
    const { userDetails } = this.props;
    let tId =
      userDetails.user &&
      userDetails.user.trader_profile &&
      userDetails.user.trader_profile.id;
    this.props.enableLoading();
    await this.props.getPaypalUrl({ id: tId, user_id: id }, (res) => {
      if (res.status === 200) {
        this.props.disableLoading();
        window.location.assign(res.data.url);
        console.log("res.data.url: ", res.data.url);
        this.setState({ stripeUrl: res.data.url });
        // toastr.success(langs.success, MESSAGES.PAYPAL_VERIFIED_SUCCESS);
      }
    });
  };

  handlePaymentSelection = (e) => {
    this.setState({
      accepted_payment_methods: {
        ...this.state.accepted_payment_methods,
        [e.target.value]: e.target.checked ? 1 : 0,
      },
    });
  };

  /**
   * @method on finish
   * @description varify number
   */
  onFinish = (value) => {
    const {
      ispayPalAccepted,
      accepted_payment_methods,
      selectedPaymentMethod,
    } = this.state;
    const { merchant, loggedInUser } = this.props;

    value.ispayPalAccepted = ispayPalAccepted;
    value.selectedPaymentMethod = selectedPaymentMethod;
    value.is_mastercard = accepted_payment_methods.is_mastercard;
    value.is_visa = accepted_payment_methods.is_visa;
    value.is_applepay = accepted_payment_methods.is_applepay;
    value.is_afterpay = accepted_payment_methods.is_afterpay;
    value.is_gpay = accepted_payment_methods.is_gpay;
    value.is_paypal_accepted = this.state.selectedPaymentMethod === "paypal" ? 1 : 0;
    value.is_stripe_accepted = this.state.selectedPaymentMethod === "stripe" ? 1 : 0;
    value.bank = selectedPaymentMethod === "bank" ? 1 : 0;
    if (merchant) {
      let reqData = {
        user_id: loggedInUser.id,
        is_stripe_accepted: this.state.selectedPaymentMethod === "stripe" ? 1 : 0,
        is_paypal_accepted: this.state.selectedPaymentMethod === "paypal" ? 1 : 0,
        is_mastercard: accepted_payment_methods.is_mastercard,
        is_visa: accepted_payment_methods.is_visa,
        is_applepay: accepted_payment_methods.is_applepay,
        is_afterpay: accepted_payment_methods.is_afterpay,
        is_gpay: accepted_payment_methods.is_gpay,
      };
      this.props.retailPaymentAPI(reqData, (res) => {
        if (res.status === 200) {
          toastr.success("success", "Payment status has been updated.");
          this.props.history.push("/post-an-ad");
        }
      });
    } else {
      this.props.nextStep(value);
    }
  };

  handlePayPal = (e) => {
    console.log("e: ", e);
    this.setState({ ispayPalAccepted: e });
  };

  /**
   * @method render
   * @description render component
   */
  paymentMethodOptionChangeHandler = (event) => {
    this.setState({ selectedPaymentMethod: event.target.value });
  };

  /**
   * @method loginWithPaypal
   * @description API call for Paypal Connect
   */
  loginWithPaypal = () => {
    this.props.getPaypalLoginUrl((res) => {
      console.log("res: ", res);
      if (res.data.success === true) {
        res.data.login_url && window.location.assign(res.data.login_url);
      }
    });
  };

  /**
   * @method loginWithStripe
   * @description API call for Stripe Connect
   */
  loginWithStripe = async () => {
    const { id } = this.props.loggedInUser;
    const { userDetails } = this.props;
    console.log("userDetails+++", userDetails);
    let tId =
      userDetails.user &&
      userDetails.user.trader_profile &&
      userDetails.user.trader_profile.id;
    this.props.enableLoading();
    await this.props.getStripeUrl(
      {
        email: userDetails.user.email,
        account_number: "000123456",
        routing_number: "110000",
      },
      (res) => {
        if (res && res.status === 200) {
          // this.props.disableLoading();
          window.location.assign(res.data.data.account_links.url);
          console.log("res.data.url: ", res.data.url);
          this.setState({
            visibleStripe: true,
            stripeUrl: res.data.data.account_links.url,
          });
          toastr.success(langs.success, MESSAGES.STRIPE_VERIFIED_SUCCESS);
        }
      }
    );
  };

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    const { userDetails } = this.props;
    let temp =
      userDetails &&
      userDetails.user &&
      userDetails.user.trader_profile !== null
        ? userDetails.user.trader_profile
        : userDetails.user.business_profile
        ? userDetails.user.business_profile
        : "";

    let data = {
      bsb: temp ? temp.bsb : "",
      account_number: temp ? temp.account_number : "",
      account_name: temp ? temp.account_name : "",
      bank_name: temp ? temp.bank_name : "",
      is_afterpay: temp && temp.is_afterpay ? temp.is_afterpay : false,
      is_applepay: temp && temp.is_afterpay ? temp.is_applepay : false,
      is_gpay: temp && temp.is_afterpay ? temp.is_gpay : false,
      is_mastercard: temp && temp.is_afterpay ? temp.is_mastercard : false,
      is_visa: temp && temp.is_afterpay ? temp.is_visa : false,
      paypal: temp && temp.is_afterpay ? temp.is_paypal : false,
    };
    return data;
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const { userDetails, loggedInUser } = this.props;
    const { visible, paypalUrl, stripeUrl, accepted_payment_methods } =
      this.state;
    // this.props.restaurantDetail.is_paypal_accepted

    let payPalAccept =
      loggedInUser.user_type === langs.key.restaurant
        ? this.props.restaurantDetail.is_paypal_accepted
        : userDetails.user.trader_profile &&
          userDetails.user.trader_profile.is_paypal_accepted;

    const { ispayPalAccepted, selectedPaymentMethod } = this.state;
    //
    console.log('accepted_payment_methods',accepted_payment_methods)
    console.log('this.props', this.props)
    console.log('this.state', this.state)
    return (
      <Fragment className="retail-vendor-payment-setup-box-v1">
        <div className="retail-vendor-payment-setup-box">
          <Radio.Group
            onChange={this.paymentMethodOptionChangeHandler}
            value={selectedPaymentMethod}
          >
            <div className="profile-payment-setup checkout-payment-block">
              {/* <h2>Select to verify your merchant account</h2> */}
              <div
                className={
                  selectedPaymentMethod === "paypal"
                    ? "paypal-block paypal-block-inner-wrapper"
                    : "paypal-block"
                }
              >
                <Row>
                  <Radio
                    checked={selectedPaymentMethod === "paypal"}
                    value="paypal"
                  >
                    <label className="paypal-label">PayPal</label>
                    <p className="discription">
                      You will be redirected to PayPal website to complete your
                      purchase securely.
                    </p>
                  </Radio>
                  <div className="visa-card-icon">
                    <img
                      src={require("../../../../assets/images/paypal-transparent-icon.png")}
                      alt="paypal-icon"
                      className="paypal-icon"
                    />
                    {selectedPaymentMethod === "paypal" && (
                      <Button
                        type="primary"
                        htmlType="button"
                        // onClick={() => this.verify()}
                        disabled
                        className="btn-paypal-payment btn-paypal-verified"
                      >
                        <img
                          src={require("../../../../assets/images/check-verified.svg")}
                          alt=""
                        />
                       {accepted_payment_methods.paypal == 1 ? "Verified" : "Verify" }
                      </Button>
                    ) }
                    <Button
                      type="primary"
                      htmlType="button"
                      // onClick={() => this.loginWithPaypal()}
                      onClick={() => {
                        setCustomLocalStorage("paymentverified", true);
                        this.verify();
                      }}
                      disabled={selectedPaymentMethod !== "paypal"}
                      className="btn-paypal-payment mt-10"
                    >
                      Connect with Paypal
                    </Button>

                    {/* <Button
                      onClick={() => this.verify()}
                      type="primary"
                      icon={<CheckOutlined />}
                      className="btn-paypal-verified"
                    >
                      {payPalAccept === 1 ? "Verified" : "Verify"}
                    </Button> */}
                  </div>
                </Row>
              </div>
              <div
                className={
                  selectedPaymentMethod === "stripe"
                    ? "paypal-block paypal-block-inner-wrapper"
                    : "paypal-block"
                }
              >
                <Row>
                  <Radio
                    checked={selectedPaymentMethod === "stripe"}
                    value="stripe"
                  >
                    <label className="paypal-label">Stripe</label>
                    <p className="discription">
                      You will be redirected to the Stripe website to complete
                      your verification securely.
                    </p>
                  </Radio>
                  <div className="visa-card-icon">
                    <img
                      src={require("../../../../assets/images/stripe-transparent-icon.png")}
                      alt="paypal-icon"
                      className="paypal-icon"
                    />
                    {selectedPaymentMethod === "stripe" && (
                      <Button
                        type="primary"
                        htmlType="button"
                        // onClick={() => this.verify()}
                        disabled
                        className="btn-paypal-payment btn-paypal-verified"
                      >
                        <img
                          src={require("../../../../assets/images/check-verified.svg")}
                          alt=""
                        />
                       {accepted_payment_methods.stripe == 1 ? "Verified" : "Verify" }
                      </Button>
                    )}
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => {
                        setCustomLocalStorage("paymentverified", true);
                        this.loginWithStripe();
                      }}
                      className="btn-stripe-payment mt-10"
                      disabled={selectedPaymentMethod !== "stripe"}
                    >
                      Connect with Stripe
                    </Button>
                  </div>
                </Row>
              </div>
              <Form
                onFinish={this.onFinish}
                initialValues={this.getInitialValue()} 
              >
                {/* <div
                  className={
                    selectedPaymentMethod === "bank"
                      ? "paypal-block paypal-block-inner-wrapper fr-newpay-block"
                      : "paypal-block"
                  }
                >
                  <Row>
                    <Radio
                      checked={selectedPaymentMethod === "bank"}
                      value={"bank"}
                      onChange={this.handlePayPal}
                    >
                      <label className="paypal-label">Bank transfer</label>
                      <p className="discription">
                        HSafe money transfer using your bank account. Visa,
                        Maestro, Discover...
                      </p>
                    </Radio>

                    {selectedPaymentMethod === "bank" && (
                      <Row gutter={30} className="m-t30">
                        <Col xs={24} sm={24} md={24} lg={1} xl={6}>
                          <Form.Item
                            label="BSB Number"
                            name="bsb"
                            rules={ispayPalAccepted && [required("")]}
                          >
                            {ispayPalAccepted ? (
                              <Input />
                            ) : (
                              <Input disabled />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={1} xl={18}>
                          <Form.Item
                            label="Account Number "
                            name="account_number"
                            rules={ispayPalAccepted && [required("")]}
                          >
                            {ispayPalAccepted ? (
                              <Input />
                            ) : (
                              <Input disabled />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={20} xl={12}>
                          <Form.Item
                            label="Account Name "
                            name="account_name"
                            rules={ispayPalAccepted && [required("")]}
                          >
                            {ispayPalAccepted ? (
                              <Input />
                            ) : (
                              <Input disabled />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={20} xl={12}>
                          <Form.Item
                            label="Bank Name"
                            name="bank_name"
                            rules={ispayPalAccepted && [required("")]}
                          >
                            {ispayPalAccepted ? (
                              <Input />
                            ) : (
                              <Input disabled />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                    {selectedPaymentMethod === "bank" && (
                      <Row className="SelectPaymentBox">
                        <Col md={24}>
                          <span className="heading">
                            Select Accepted Payment Methods
                          </span>
                        </Col>
                        <Col md={24}>
                          <Row className="paymentIconsBox">
                            <Col md={12}>
                              <Checkbox
                                value={"is_mastercard"}
                                onChange={this.handlePaymentSelection}
                                checked={
                                  this.state.accepted_payment_methods
                                    .is_mastercard === 1
                                }
                              >
                                Credit Card
                              </Checkbox>
                            </Col>
                            <Col md={12} className="text-right">
                              <img
                                src={require("../../../../assets/images/icons/visa-and-card-icon.png")}
                                alt="visa-card-icon"
                              />
                            </Col>
                            <Col md={12}>
                              <Checkbox
                                value={"is_applepay"}
                                checked={
                                  this.state.accepted_payment_methods
                                    .is_applepay === 1
                                }
                                onChange={this.handlePaymentSelection}
                              >
                                Apple Pay
                              </Checkbox>
                            </Col>
                            <Col md={12} className="text-right">
                              <img
                                src={require("../../../../assets/images/icons/g-apple.png")}
                                alt="g-apple"
                                className="g-apple"
                              />
                            </Col>
                            <Col md={12}>
                              <Checkbox
                                value={"is_gpay"}
                                checked={
                                  this.state.accepted_payment_methods
                                    .is_gpay === 1
                                }
                                onChange={this.handlePaymentSelection}
                              >
                                GPay
                              </Checkbox>
                            </Col>
                            <Col md={12} className="text-right">
                              <img
                                src={require("../../../../assets/images/icons/g-pay-transparent-sm.png")}
                                alt="gpay"
                                className="g-pay"
                              />
                            </Col>
                            <Col md={12}>
                              <Checkbox
                                value={"is_afterpay"}
                                checked={
                                  this.state.accepted_payment_methods
                                    .is_afterpay === 1
                                }
                                onChange={this.handlePaymentSelection}
                              >
                                Afterpay
                              </Checkbox>
                            </Col>
                            <Col md={12} className="text-right">
                              <img
                                src={require("../../../../assets/images/icons/after-pay.png")}
                                alt="after-pay"
                                className="after-pay"
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )}
                  </Row>
                </div> */}
                <div className="fr-paypal-btn retail-payemt-footer">
                  <Button
                    htmlType="submit"
                    type="default"
                    size="middle"
                    className="previousStep mr-15"
                    onClick={() => this.props.previousStep()}
                  >
                    Previous Step
                  </Button>
                  <Form.Item>
                    <Button
                      type="default"
                      htmlType="submit"
                      danger
                      className="btn-blue mt-20"
                      disabled={
                        selectedPaymentMethod !== "" ? false : true
                      }
                    >
                      Next Step
                    </Button>
                  </Form.Item>
                  {visible && (
                    <Preview
                      paypalUrl={paypalUrl}
                      visible={visible}
                      onCancel={() => this.setState({ visible: !visible })}
                    />
                  )}
                </div>
              </Form>
            </div>
          </Radio.Group>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    restaurantDetail:
      bookings && bookings.restaurantDetail ? bookings.restaurantDetail : null,
  };
};
export default connect(mapStateToProps, {
  retailPaymentAPI,
  getPaypalLoginUrl,
  getPaypalUrl,
  verifyPaypal,
  getStripeUrl,
  verifyStripe,
  enableLoading,
  disableLoading,
  getTraderProfile,
})(withRouter(PaymentScreen));
// account_number: ["The account number field is required."]
// routing_number: ["The routing number field is required."]
