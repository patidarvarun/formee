import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Button, Card, Row, Radio, Layout } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  savedStripeCard,
  saveTraderProfile,
  getUserProfile,
  enableLoading,
  disableLoading,
  getPaypalLoginUrl,
} from "../../../../actions";
import CheckoutForm from "../../../booking/checkout/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./style.less";
import { toastr } from "react-redux-toastr";
import "../../../dashboard/vendor-profiles/myprofilestep.less";
import { CheckOutlined } from "@ant-design/icons";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import { Stripe_Public_key } from "../../../../config/Config";
const stripePromise = loadStripe(Stripe_Public_key);
// import CheckoutForm from '../../../booking/checkout/CheckoutForm'

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

// const stripePromise = loadStripe('pk_test_51H3J9jHhOHLOerXXaHfv1p47eSyBM2kQfOYjNyE2NXXUoFDdW8J2EJoYkBAaEqxdg2L0XxY4qKWvlWsyPt4Ojffm00BmSRbBZD');

class StepSecond extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitFromOutside: false,
      submitBussinessForm: false,
      imageUrl: "",
      key: 1,
      paymentMethodsKey: "cardPayment",
      opened: false,
      selectedPaymentMethod: "",
    };
    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  savedStripeCard = (token) => {
    const { id } = this.props.loggedInUser;
    let me = this;
    this.props.enableLoading();
    this.props.savedStripeCard(token, (res) => {
      this.props.disableLoading();
      console.log("res: ", res);
      if (res.status === STATUS_CODES.OK) {
        console.log("res: ", res);
        toastr.success(langs.success, MESSAGES.SAVE_PAYMENT_CARD);
        this.props.getUserProfile({ user_id: id }, (res2) => {
          if (res2.status === STATUS_CODES.OK && me.props.isAnotherPay) {
            this.props.history.push("/myProfile");
          } else if (res2.status === STATUS_CODES.OK) {
            this.props.history.push("/business-profile");
          }
        });
      }
    });
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
      // console.log('res: ', res);
      if (res.data.success === true) {
        res.data.login_url && window.location.assign(res.data.login_url);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { selectedPaymentMethod } = this.state;
    return (
      <Fragment>
        <Layout style={{ overflowX: "visible" }}>
          <div className="my-profile-box my-profile-box-v2 my-profile-setup checkout-payment-block">
            <div className="card-container signup-tab addpayment">
              <div className="steps-content align-left mt-0">
                <Card
                  className="profile-content-box "
                  bordered={false}
                  title=""
                >
                  <Fragment>
                    <Radio.Group
                      onChange={this.paymentMethodOptionChangeHandler}
                      value={selectedPaymentMethod}
                    >
                      <div className="profile-payment-setup">
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
                              <label className="paypal-label">
                                Credit / Debit Card
                              </label>
                              <p className="discription">
                                Safe money transfer using your bank account.
                                Visa, Maestro, Discover...
                              </p>
                            </Radio>
                            <div class="payment-icon">
                              <div className="visa-card-icon">
                                <img
                                  src={require("../../../../assets/images/icons/masterv-card2.svg")}
                                  alt="card"
                                  className="mr-9"
                                />
                                <img
                                  src={require("../../../../assets/images/icons/visa-card-v2.svg")}
                                  alt="card"
                                />
                              </div>
                            </div>
                          </Row>
                          {selectedPaymentMethod === "stripe" && (
                            <Elements stripe={stripePromise}>
                              <CheckoutForm
                                savedStripeCard={this.savedStripeCard}
                                selectedPaymentMethod={selectedPaymentMethod}
                                bookingType={"classified"}
                                isAnotherPay={this.props.isAnotherPay}
                              />
                            </Elements>
                          )}
                        </div>
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
                              <label className="paypal-label">Paypal</label>
                              <p className="discription">
                                You will be redirected to the PayPal website to
                                complete your purchase securely.
                              </p>
                            </Radio>
                            <div className="visa-card-icon">
                              <img
                                src={require("../../../../assets/images/paypal-transparent-icon.png")}
                                alt="paypal-icon"
                                className="paypal-icon"
                              />
                              <Button
                                type="primary"
                                htmlType="button"
                                onClick={this.loginWithPaypal}
                                className="btn-paypal-payment"
                              >
                                Connect with Paypal
                              </Button>
                              <Button
                                type="primary"
                                htmlType="button"
                                onClick={this.props.previousStep}
                                className="btn-paypal-verified"
                              >
                                <CheckOutlined />
                                Verified
                              </Button>
                            </div>
                          </Row>
                        </div>
                        {/* <span
                          className='mt-33 mb-33'
                          style={{
                            borderTop: '1px solid #55636D',
                            display: 'block',
                          }}
                        ></span> */}
                      </div>

                      {this.props.showLater && (
                        <div className="Payment-do-later">
                          <Row>
                            <Radio
                              checked={selectedPaymentMethod === "dolater"}
                              value="dolater"
                            >
                              <label className="dolater-label">
                                I will set it up later.
                              </label>
                            </Radio>
                          </Row>
                        </div>
                      )}
                    </Radio.Group>
                  </Fragment>
                </Card>
              </div>
            </div>
          </div>
        </Layout>
        <div className="submit-step-action steps-action-to-step2 submitbutton">
          {this.props.isAnotherPay ? (
            <Button
              type="default"
              htmlType="button"
              className="blue-blank"
              onClick={() => {
                this.props.history.push("/myProfile");
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="default"
              htmlType="button"
              onClick={this.props.previousStep}
            >
              Previous Step
            </Button>
          )}
          <Button
            type="default"
            htmlType="submit"
            onClick={this.props.onProfileComplete}
            form="submit-checkout-form"
            className="btn-blue ml-20"
          >
            Next
          </Button>
        </div>
      </Fragment>
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
  savedStripeCard,
  saveTraderProfile,
  getUserProfile,
  enableLoading,
  disableLoading,
  getPaypalLoginUrl,
})(withRouter(StepSecond));
