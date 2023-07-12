import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Form,
  Radio,
  Modal,
} from "antd";
import {
  savedStripeCard,
  getUserProfile,
  enableLoading,
  disableLoading,
  getCardList,
} from "../../../../../actions";
import {
  salaryNumberFormate,
} from "../../../../common";
import BookingDetailBlock from "./BookingDetailsBlock";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../../checkout/CheckoutForm";
import GooglePay from "../../../checkout/GooglePayButton";
import PayPalExpressCheckOut from "../../../checkout/PayPalExpressCheckOut";
import { toastr } from "react-redux-toastr";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import { MESSAGES } from "../../../../../config/Message";
import { langs } from "../../../../../config/localization";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/booking-form.less";
import {Stripe_Public_key} from "../../../../../config/Config";
import PaypalExpressBtn from "react-paypal-express-checkout";

const stripePromise = loadStripe(Stripe_Public_key);
const { Title, Paragraph, Text } = Typography;

class FlightCheckout extends React.Component {
  state = {
    loading: false,
    visible: false,
    selectedPaymentMethod: "",
    selectedCard: "",
    cards: [],
  };

  componentWillMount = () => {
    this.getTheCards();
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  savedStripeCard = (token) => {
    const { id } = this.props.loggedInUser;
    let me = this;
    this.props.enableLoading();
    this.props.savedStripeCard(token, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        this.getTheCards()
        // this.props.getUserProfile({ user_id: id }, (res2) => {
          toastr.success(langs.success, MESSAGES.SAVE_PAYMENT_CARD);
          // if (res2.status === STATUS_CODES.OK && me.props.isAnotherPay) {
          //   this.props.history.push('/payment-methods')
          // } else if (res2.status === STATUS_CODES.OK) {
          //   this.props.history.push('/business-profile')
          // }
        // });
      }
    });
  };
  onPaypalPaymentSuccess = (value) => {
  console.log("🚀 ~ file: FlightCheckout.js ~ line 81 ~ FlightCheckout ~ value", value)
  let payload = {
    payment_method: "paypal",
    order_id: value.paymentID,
    payer_id: value.payerID,
    paypal_payment_status: "VERIFIED"
  }
  this.props.paypalresponse(payload)
  // this.props.paypalPayment(payload)
  }

  onPaypalPaymentCancel = (data) => {
    toastr.error("Error", "Payment Cancelled.");
  };

  onPaypalPaymentError = (err) => {
  toastr.error("Error", "Payment Failed.");
  };

  /**
   * @method render
   * @description render component
   */
  paymentMethodOptionChangeHandler = (event) => {
    this.setState({ 
      selectedPaymentMethod: event.target.value,
      selectedCard: null
    });
  };

  getTheCards = () => {
    this.props.getCardList((res) => {
      if (res.status === 200) {
        let data =
          res.data &&
          res.data.user &&
          res.data.user.stripe_sources &&
          res.data.user.stripe_sources.length > 0
            ? res.data.user.stripe_sources
            : [];
        this.setState({
          cards: data,
        });
      }
    });
  };

  render() {
    const { visible, selectedPaymentMethod, selectedCard, cards } = this.state;
    const { userDetails, pnrNumber, selectedFlight } = this.props;
    console.log("🚀 ~ file: FlightCheckout.js ~ line 92 ~ FlightCheckout ~ render ~ selectedFlight", selectedFlight)
    console.log("pnrNumber: ", pnrNumber);
    let total_price = Number(selectedFlight.price) + Number(selectedFlight.tax_amount);
    console.log("🚀 ~ file: FlightCheckout.js ~ line 100 ~ FlightCheckout ~ render ~ total_price", total_price)
    // const paypalClient = {
    //   sandbox:
    //     "AcJtYklAstA978I-nPyRHp7XcgAvZJUmAux_tPoTvLxqAVW3SwqxXqfpzUezgUqZecum0ThG7oFdErUh",
    //   production: "YOUR-PRODUCTION-APP-ID",
    // };
    const client = {
      sandbox:
        "AREIlckrVOn91AOK1bYVlg1lsWgqAK49f6j-clybiFLQAe6F7-yovfTNlK7CyUAij5lxQZbteK0MvNdi",
      production:
        "EC3KB5dIv6Wv1ICrM7uuCBRTjXf7wQxKpIqRIT3B1rurf8lot-2_uY-GhecmZCiGPvVuV8GugAC-aljC",
    };
    console.log("userDetails: ", userDetails);
    return (
      <Layout>
        <div className="tourism-booking-form-box tourism-booking-checkout-page">
          <div className="booking-tourism-box">
            <div>
              {/* START - Heading and Contact Information box - 03/07/2021 */}
              <div className="page-heading-container">
                <h2 className="checkout-heading">Checkout</h2>
              </div>
              <Row gutter={16}>
                <Col md={16}>
                    <div className="payment-methods-box payment-first-box">
                      {/* <Radio
                        checked={selectedPaymentMethod === "stripe-card-list"}
                        value="stripe-card-list"
                        className="first-payment-choise"
                      > */}
                        <Row className="main-heading-cols">
                          <Col lg={14}>
                            <Title level={4}>Your saved payment methods</Title>
                          </Col>
                          <Col lg={5}>
                            <label>Name On Card</label>
                          </Col>
                          <Col lg={5}>
                            <label>Expired on</label>
                          </Col>
                        </Row>
                        <Radio.Group
                          name="radiogroup"
                          value={selectedCard}
                          className="card-select-box"
                          onChange={(e) => {
                            this.setState({ 
                              selectedCard: e.target.value,
                              selectedPaymentMethod: "stripe-card-list"
                           });
                          }}
                        >
                          {
                          // (Array.isArray(userDetails.stripe_sources) &&
                          //   userDetails.stripe_sources.length) ?
                          //   userDetails.stripe_sources.map
                            cards.length > 0 ?
                            cards.map((el) => {
                              return (
                                <Radio
                                  value={el.source_id}
                                  // disabled={
                                  //   selectedPaymentMethod !== "stripe-card-list"
                                  // }
                                >
                                  <Row>
                                    <Col lg={14}>
                                      <p className="card-detail">
                                        <span className="card-type-name">
                                          {el.brand}
                                        </span>
                                        ending in `***{el.last4}`
                                      </p>
                                      <img
                                        src={require("../../../../../assets/images/icons/visa.svg")}
                                        alt="card-icon"
                                        className="card-icon"
                                      />
                                      {this.state.selectedCard === el.source_id ? <div className="cvv-no-input-box">
                                        <Form.Item
                                          name="cvv"
                                          label="Enter CVV:"
                                        >
                                          <Input placeholder="..." />
                                        </Form.Item>
                                        <span className="card-recom-msg">
                                          This card is recommended for you
                                        </span>
                                      </div> : ''}
                                    </Col>
                                    <Col md={5}>
                                      <label className="name">{el.name}</label>
                                    </Col>
                                    <Col lg={5}>
                                      <label className="date">{`${el.exp_year
                                        } - ${String(el.exp_month).length > 1
                                          ? el.exp_month
                                          : `0${el.exp_month}`
                                        }`}</label>
                                    </Col>
                                  </Row>
                                </Radio>
                              );
                            }) : 'No saved cards are available'}
                        </Radio.Group>
                      {/* </Radio> */}
                    </div>
                  <Radio.Group
                    onChange={this.paymentMethodOptionChangeHandler}
                    value={selectedPaymentMethod}
                  >
                    <div className="payment-methods-box">
                      <Row gutter={16}>
                        <Col md={24}>
                          <div className="payment-methods-box">
                            <Row className="main-heading-cols">
                              <Col lg={24}>
                                <Title level={4}>
                                  Add Another payment methods
                                </Title>
                              </Col>
                              <Row className="another-payment-block">
                                <Col lg={24}>
                                  <Radio
                                    checked={
                                      selectedPaymentMethod === "stripe"
                                    }
                                    value="stripe"
                                  >
                                    <label className="paypal-label">
                                      Credit / Debit Card
                                      <div className="visa-card-icon">
                                        <img
                                          src={require("../../../../../assets/images/icons/visa-and-card-icon.png")}
                                          alt=""
                                        />
                                      </div>
                                    </label>
                                  </Radio>
                                  <p className="discription">
                                    Safe money transfer using your bank account.
                                    Visa, Maestro, Discover...
                                  </p>
                                </Col>
                                <Col lg={24}>
                                  <Elements stripe={stripePromise}>
                                    <CheckoutForm
                                      // customer_name={customer_name}
                                      selectedPaymentMethod={
                                        selectedPaymentMethod
                                      }
                                      savedStripeCard={this.savedStripeCard}
                                      bookingType={"tourism"}
                                    // onSucessPayment={this.onSucessPayment}
                                    />
                                  </Elements>
                                </Col>
                              </Row>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="paypal-block">
                      <Row gutter={30}>
                        <Col xs={24} sm={24} md={24} lg={20}>
                          <Radio
                            checked={selectedPaymentMethod === "paypal"}
                            value="paypal"
                          >
                            <label className="paypal-label">PayPal</label>
                          </Radio>
                          <p className="discription">
                            You will be redirected to PayPal website to
                            <br /> complete your purchase securely.
                          </p>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          style={{ paddingRight: "0px" }}
                        >
                          <img
                            src={require("../../../../../assets/images/paypal-icon.jpg")}
                            alt="paypal"
                          />
                          {/* <Button type="primary" icon={<CheckOutlined />}>
                                                                Verified
                                                            </Button> */}
                          {selectedPaymentMethod !== "" && (
                            <Row gutter={[0]} className="pt-433">
                              <Col>
                                {selectedPaymentMethod === "paypal" && (
                                  <PaypalExpressBtn
                                    // env={"sandbox"}
                                    client={client}
                                    currency={'AUD'}
                                      // currency={"INR"}
                                    total={salaryNumberFormate(total_price)}
                                    // history={history}
                                    onError={this.onPaypalPaymentError}
                                    onSuccess={(success) => this.onPaypalPaymentSuccess(success)}
                                    onCancel={this.onPaypalPaymentCancel}
                                  />
                                )}

                                {/* <Button htmlType="submit" type={'default'} danger size='large' className='text-white' style={{ backgroundColor: '#EE4929' }}>
                                                        Pay
                                                    </Button> */}
                              </Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </div>

                    {/* <div className="paypal-block googlepay">
                      <Row gutter={30}>
                        <Col xs={24} sm={24} md={24} lg={20}>
                          <Radio
                            checked={selectedPaymentMethod === "gpay"}
                            value="gpay"
                          >
                            <label className="paypal-label">Gpay</label>
                          </Radio>
                          <p className="discription">
                            You will be redirected to Gpay website to
                            <br /> complete your purchase securely.
                          </p>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          style={{ paddingRight: "0px" }}
                        >
                          <img
                            src={require("../../../../../assets/images/icons/gpay-tran.svg")}
                            alt="Gpay"
                          />
                          <div className="gpay-third-party">
                            {selectedPaymentMethod === "gpay" && (
                              <GooglePay
                                env={"TEST"}
                                currency={"USD"}
                                countryCode={"US"}
                                // total={`${amount}`}
                                // onError={this.onGooglePaymentError}
                                // onSuccess={this.onGooglePaymentSuccess}
                                // onCancel={this.onGooglePaymentCancel}
                                paymentGateway={"stripe"}
                                paymentGatewayMerchantId={
                                  "pk_test_51H3J9jHhOHLOerXXaHfv1p47eSyBM2kQfOYjNyE2NXXUoFDdW8J2EJoYkBAaEqxdg2L0XxY4qKWvlWsyPt4Ojffm00BmSRbBZD"
                                }
                                merchantId={"BCR2DN6T6OZYP6C4"}
                                merchantName={"Sipl Test Store"}
                              />
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div> */}
                  </Radio.Group>
                </Col>
                <Col md={8}>
                  <BookingDetailBlock
                    isCheckout={true}
                    {...this.props}
                    selectedFlight={selectedFlight}
                    selectedCard={selectedCard}
                  />
                </Col>
                {/* END - YOUR BOOKING RIGHT SIDEBAR */}
              </Row>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { tourism, profile, auth } = store;
  const { flight_search_params } = tourism;
  return {
    flight_search_params,
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
    loggedInUser: auth.isLoggedIn ? auth.loggedInUser : false,
  };
};

export default connect(mapStateToProps, {
  savedStripeCard,
  getUserProfile,
  enableLoading,
  disableLoading,
  getCardList
})(withRouter(FlightCheckout));
