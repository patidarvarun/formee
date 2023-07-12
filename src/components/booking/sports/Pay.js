import React from "react";
import { connect } from "react-redux";
import AppSidebar from "../NewSidebar";
import { Link } from "react-router-dom";
import { langs } from "../../../config/localization";
import { toastr } from "react-redux-toastr";
import {
  getCardList,
  enableLoading,
  disableLoading,
  placeSportsOrder,
  savedStripeCard,
  placePaypalSportsOrder,
} from "../../../actions/index";
import {
  Card,
  Layout,
  Row,
  Col,
  Typography,
  Carousel,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Pagination,
  Divider,
  Steps,
  Cascader,
  Radio,
  InputNumber,
  Tooltip,
} from "antd";
import history from "../../../common/History";
import "../booking.less";
import moment from "moment";
import { WindowsFilled } from "@ant-design/icons";
import { Stripe_Public_key } from "../../../config/Config";
import { STATUS_CODES } from "../../../config/StatusCode";
import { MESSAGES } from "../../../config/Message";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// import "./style.less";
// import "../../dashboard/vendor-profiles/myprofilestep.less";
import CheckoutForm from "./CheckoutForm";
import PaypalExpressBtn from "react-paypal-express-checkout";
const stripePromise = loadStripe(Stripe_Public_key);
const { Step } = Steps;
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

class Pay extends React.Component {
  // formRef = React.createRef();
  buttonRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      selectedCard: null,
      selectedPaymentMethod: null,
      source_id: "",
      token_id: "",
    };
  }

  componentWillMount = () => {
    this.getTheCards();
  };

  showError = () => {
    const {selectedPaymentMethod} = this.state;
    selectedPaymentMethod == "paypal" ?
    toastr.error("Error", "Click on paypal checkout button to complete payment")
    :
    toastr.error("Error", "Select Payment method First")
  }

  submitForm = () => {
    let _that = this;
    const { cards, selectedCard, source_id, selectedPaymentMethod, token_id } =
      this.state;
    const { tournament, ticketData, qty, customerDetails, purchaseDetails } =
      this.props;
    let eventData = Object.assign({}, tournament);
    delete eventData["ticketdata"];
    let reqData = {
      sports365_order_data: {
        event_id: purchaseDetails.eventid,
        category_id: purchaseDetails.catalogid,
        provshipid: purchaseDetails.provshipid,
        areaid: purchaseDetails.areaid,
        fullName: customerDetails.fullName,
        email: customerDetails.email,
        phone: customerDetails.phoneNumber,
        currency: purchaseDetails.currency,
        totalPrice: purchaseDetails.totalPrice,
        commission: ticketData.Commission ? ticketData.Commission : 0,
        qty: qty,
        delivery_cost: purchaseDetails.delivery_cost,
        ciid: purchaseDetails.catalogid,
        shippingAddress: purchaseDetails.shippingAddress,
        notes: customerDetails.notes,
        lead_customer: customerDetails.lead_customer,
        orderid: purchaseDetails.orderid
      },
      event_details: eventData,
      payment_method: "stripe",
      payment_source_id: selectedCard,
      // stripeToken: "tok_1FFev1Ecekv8Ig7dK0JGSU1q",
      ticket_details: ticketData,
    };
    if (source_id && token_id) {
      reqData.payment_source_id = source_id;
      reqData.stripeToken = token_id;
    }
    
    if (!selectedCard && !selectedPaymentMethod && !source_id) {
      toastr.error("Error", "Select a Card First");
    } else {
      this.props.placeSportsOrder(reqData, (res) => {
        if (res.status == 200) {
          this.setState({
            source_id: "",
            token_id: "",
          });
          toastr.success("Success", "Payment Successfull.");
          this.props.openPopUp(res.data.data.id);
          // window.location.href = "/bookings-sports-tickets/53"
        }
      });
    }
  };

  submitpaypal = () => {
    const { cards, selectedCard, source_id, selectedPaymentMethod, token_id, paypalPayment } =
      this.state;
    const { tournament, ticketData, qty, customerDetails, purchaseDetails } =
      this.props;
    let eventData = Object.assign({}, tournament);
    delete eventData["ticketdata"];
    let reqData = {
      sports365_order_data: {
        event_id: purchaseDetails.eventid,
        category_id: purchaseDetails.catalogid,
        provshipid: purchaseDetails.provshipid,
        areaid: purchaseDetails.areaid,
        fullName: customerDetails.fullName,
        email: customerDetails.email,
        phone: customerDetails.phoneNumber,
        currency: purchaseDetails.currency,
        totalPrice: purchaseDetails.totalPrice,
        commission: ticketData.Commission ? ticketData.Commission : 0,
        qty: qty,
        delivery_cost: purchaseDetails.delivery_cost,
        ciid: purchaseDetails.catalogid,
        shippingAddress: purchaseDetails.shippingAddress,
        notes: customerDetails.notes,
        lead_customer: customerDetails.lead_customer,
      },
      event_details: eventData,
      payment_method: "paypal",
      ticket_details: ticketData,
      order_id: paypalPayment.paymentID,
      payer_id: paypalPayment.payerID,
      paypal_payment_status: "VERIFIED"
    };
    if (source_id && token_id) {
      reqData.payment_source_id = source_id;
      reqData.stripeToken = token_id;
    }
      this.props.placePaypalSportsOrder(reqData, (res) => {
        if (res.status == 200) {
          this.setState({
            paypalPayment: "",
            selectedPaymentMethod: ""
          });
          toastr.success("Success", "Payment Successfull.");
          this.props.openPopUp(res.data.id);
        }
      });
  };

  onSuccess = (payment) => {
    console.log("The payment was succeeded!", payment);
    this.setState({paypalPayment: payment})
    this.submitpaypal();
  };

  onCancel = (data) => {
    toastr.error("Error", "Payment Cancelled.");
    console.log("The payment was cancelled!", data);
  };

  onError = (err) => {
  toastr.error("Error", "Payment Failed.");
  };

  savedStripeCard = (token, id) => {
    console.log("🚀 ~ file: Pay.js ~ line 119 ~ Pay ~ token", token);
    // const { id } = this.props.loggedInUser;
    // let me = this;
    // this.setState(
    //   {
    //     refetchCards: true,
    //     source_id: id,
    //     token_id: token,
    //   },
    //   () => {
    //     this.submitForm();
    //   })
    this.props.enableLoading();
    this.props.savedStripeCard(token, (res) => {
      this.props.disableLoading();
      console.log("res: ", res);
      if (res.status === STATUS_CODES.OK) {
        console.log("res: ", res);
        toastr.success(langs.success, MESSAGES.SAVE_PAYMENT_CARD);
        // this.setState(
        //   {
        //     refetchCards: true,
        //     source_id: id,
        //     token_id: token,
        //   },
        //   () => {
            this.getTheCards();
            // this.submitForm();
        //   }
        // );
      }
    });
  };

  makePayment = (token, id) => {
    this.setState(
      {
        source_id: id,
        token_id: token,
      },
      () => {
        this.submitForm();
      }
    );
  };

  getCardTokenFromStripe = (response) => {
    console.log("🚀 ~ file: Pay.js ~ line 119 ~ Pay ~ response", response);
    if (response.error !== undefined) {
    } else if (response.paymentMethod !== undefined) {
      this.setState(
        {
          stripePaymentGateWayResponse: response.paymentMethod,
        },
        () => {
          // this.onSucessPayment();
        }
      );
    }
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
    const { qty, ticketData, customerDetails, purchaseDetails } = this.props;
    const { cards, selectedCard, selectedPaymentMethod, booking_id, source_id, token_id } = this.state;
    const client = {
      sandbox:
        "AREIlckrVOn91AOK1bYVlg1lsWgqAK49f6j-clybiFLQAe6F7-yovfTNlK7CyUAij5lxQZbteK0MvNdi",
      production:
        "EC3KB5dIv6Wv1ICrM7uuCBRTjXf7wQxKpIqRIT3B1rurf8lot-2_uY-GhecmZCiGPvVuV8GugAC-aljC",
    };
    return (
      <>
        <div className="steps-content sportbooking-content ">
          {/* {steps[current].content} */}
          <Row>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={18}
              xl={18}
              className="sportbooking-left"
            >
              <div className="checkout-wrapper">
                <h2>Checkout</h2>
                <Radio.Group
                  onChange={(e) => {
                    this.setState({
                      selectedCard: e.target.value,
                    });
                  }}
                  style={{ display: "unset" }}
                  value={selectedCard}
                >
                  <Row className="checkout-head ">
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <h3>Your saved payment methods</h3>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <label className="card-name">Name On Card</label>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                      <label>Expires on</label>
                    </Col>
                  </Row>
                  <Row className="checkout-white-box">
                    <div className="checkout-row-wrapper">
                      {cards.map((card) => {
                        return (
                          <Row className="checkout-row">
                            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                              <Radio value={card.source_id}>
                                <label className="visa-label">
                                  {card.brand}
                                </label>
                                <p className="description">
                                  ending in ***{card.last4}
                                </p>
                              </Radio>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                              {card.name}
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                              {card.exp_month}/{card.exp_year}
                            </Col>
                            {selectedCard === card.last4 && (
                              <Col>
                                <div className="entercvv">
                                  <label>Enter CVV</label>
                                  <input
                                    type="text"
                                    placeholder="***"
                                    maxLength="3"
                                  />
                                  <Tooltip
                                    title="Enter the CVC number"
                                    className={"cvc-tooltip"}
                                  >
                                    <svg
                                      width="22"
                                      height="22"
                                      viewBox="0 0 22 22"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M21.5 11C21.5 16.799 16.799 21.5 11 21.5C5.20101 21.5 0.5 16.799 0.5 11C0.5 5.20101 5.20101 0.5 11 0.5C16.799 0.5 21.5 5.20101 21.5 11Z"
                                        stroke="#788995"
                                      />
                                      <path
                                        d="M10.156 12.172C10.156 11.556 10.2493 11.066 10.436 10.702C10.632 10.338 10.9353 10.0347 11.346 9.792C11.5327 9.68 11.7333 9.56333 11.948 9.442C12.172 9.32067 12.3867 9.18067 12.592 9.022C12.7973 8.854 12.9653 8.65333 13.096 8.42C13.2267 8.18667 13.292 7.89733 13.292 7.552C13.292 7.15067 13.1987 6.81467 13.012 6.544C12.8347 6.27333 12.5967 6.07267 12.298 5.942C12.0087 5.802 11.7053 5.732 11.388 5.732C10.8933 5.732 10.4453 5.872 10.044 6.152C9.64267 6.42267 9.33933 6.75867 9.134 7.16L8.476 6.74C8.73733 6.16133 9.13867 5.718 9.68 5.41C10.2213 5.09267 10.7953 4.934 11.402 4.934C11.8593 4.934 12.298 5.032 12.718 5.228C13.138 5.424 13.4787 5.718 13.74 6.11C14.0013 6.502 14.132 7.00133 14.132 7.608C14.132 8.10267 14.0387 8.504 13.852 8.812C13.6747 9.11067 13.4413 9.358 13.152 9.554C12.8627 9.74067 12.5593 9.92267 12.242 10.1C12.018 10.2213 11.808 10.3567 11.612 10.506C11.4253 10.6553 11.2713 10.8607 11.15 11.122C11.0287 11.374 10.968 11.724 10.968 12.172H10.156ZM10.17 15V13.502H10.996V15H10.17Z"
                                        fill="#788995"
                                      />
                                    </svg>
                                  </Tooltip>
                                </div>
                              </Col>
                            )}
                          </Row>
                        );
                      })}
                    </div>
                  </Row>
                </Radio.Group>

                <Row className="payment-method-row">
                  <Row className="checkout-head sportbooking-big-box">
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <h3>Another payment method</h3>
                    </Col>
                  </Row>
                  <Radio.Group
                    onChange={(e) => {
                      this.setState({
                        selectedPaymentMethod: e.target.value,
                        selectedCard: null
                      });
                    }}
                    // onChange={this.paymentMethodOptionChangeHandler}
                    value={selectedPaymentMethod}
                  >
                    <Row className="w-100">
                      <Row className="checkout-white-box">
                        <div className="checkout-row-wrapper">
                          <Row className="checkout-row">
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Radio value={"stripe"}>
                                <label className="visa-label">
                                  Credit / Debit Card
                                </label>
                                <div className="sm-text">
                                  Safe money transfer using your bank account.
                                  Visa, Maestro, Discover...
                                </div>
                              </Radio>
                            </Col>
                            {selectedPaymentMethod === "stripe" && (
                              <Elements stripe={stripePromise}>
                                <CheckoutForm
                                  buttonRef={this.buttonRef}
                                  customer_name={
                                    "lokesh" || customerDetails.fullName
                                  }
                                  selectedPaymentMethod={selectedPaymentMethod}
                                  getCardtokenDetails={
                                    this.getCardTokenFromStripe
                                  }
                                  // bookingType={booking_type}
                                  onSucessPayment={this.addCardSuccess}
                                  isClicked={this.state.isClicked}
                                  afterClickHandler={() =>
                                    this.setState({ isClicked: false })
                                  }
                                  isAnotherPay={true}
                                  bookingType={"classified"}
                                  savedStripeCard={this.savedStripeCard}
                                  makePayment={this.makePayment}
                                />
                              </Elements>
                            )}
                          </Row>
                        </div>
                      </Row>
                    </Row>
                    <Row className="w-100">
                      <Row className="checkout-white-box">
                        <div className="checkout-row-wrapper">
                          <Row className="checkout-row">
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Radio value={"paypal"}>
                                <label className="visa-label">Paypal</label>
                                <div className="sm-text">
                                  You will be redirected to the PayPal website
                                  to complete your purchase securely.
                                </div>
                              </Radio>
                              <img
                                style={{ float: "right" }}
                                src={require("../../../assets/images/paypal-transparent-icon.png")}
                                alt="paypal-icon"
                                className="paypal-icon"
                              />
                            </Col>
                            {selectedPaymentMethod === "paypal" && (
                              <PaypalExpressBtn
                                client={client}
                                currency={purchaseDetails.currency}
                                total={purchaseDetails.totalPrice}
                                onError={this.onError}
                                onSuccess={this.onSuccess}
                                onCancel={this.onCancel}
                              />
                            )}
                          </Row>
                        </div>
                      </Row>
                    </Row>
                  </Radio.Group>
                </Row>
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={6}
              xl={6}
              className="sportbooking-right pl-15"
            >
              <div className="sidebar">
                <h2 className="bottom-bottom">Your Booking</h2>
                <div className="ticket-category">
                  <h4>Ticket Category</h4>
                  <Row className="border-bottom">
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={20}
                      xl={20}
                      className=" select-delivery"
                    >
                      {" "}
                      {ticketData.Section}{" "}
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={4}
                      xl={4}
                      className=" select-delivery"
                    >
                      Qty {qty}
                    </Col>
                  </Row>

                  <Row className="border-bottom">
                    <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                      {" "}
                      <b>Subtotal</b>{" "}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                      {" "}
                      <b>${+qty * +ticketData.grossPrice.Price}</b>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                      {" "}
                      Service fee{" "}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                      {" "}
                      ${ticketData.grossPrice.ServiceFee}
                    </Col>

                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={20}
                      xl={20}
                      className=" Total mt-10"
                    >
                      {" "}
                      <b>Total</b> <br /> Incl. taxes & fees{" "}
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={4}
                      xl={4}
                      className=" select-delivery mt-10"
                    >
                      {" "}
                      <b>
                        $
                        {+qty * +ticketData.grossPrice.Price +
                          +ticketData.grossPrice.ServiceFee}
                      </b>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      {" "}
                      <span>
                        {" "}
                        Immediate Confirmation tickets are automatically
                        confirmed once completing the order unless you have a
                        special request.{" "}
                      </span>{" "}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      {" "}
                      <span>
                        {" "}
                        Orders are final and cannot be canceled.
                      </span>{" "}
                    </Col>
                  </Row>
                </div>
                <Button size={"large"} block onClick={() => {
                  selectedCard ?
                  this.submitForm() :
                  ((selectedPaymentMethod  == "stripe") ?
                  this.buttonRef.current.click()
                  :
                  this.showError()
                  )
                }}>
                  Pay
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </>
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
  getCardList,
  enableLoading,
  disableLoading,
  placeSportsOrder,
  savedStripeCard,
  placePaypalSportsOrder,
})(Pay);
