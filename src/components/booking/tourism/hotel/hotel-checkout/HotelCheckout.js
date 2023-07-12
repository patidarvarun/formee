import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Typography,
  Input,
  Form,
  Modal,
  Button,
  Collapse,
  Radio,
} from "antd";
import {
  getCardList,
  enableLoading,
  disableLoading,
  placeSportsOrder,
  placePaypalSportsOrder,
  savedStripeCard,
  tourismHotelBookingPaypalAPI
} from "../../../../../actions/index";
import {
  salaryNumberFormate,
} from "../../../../common";
import BookingDetailBlock from "./bookingDetailsBlock";
import { toastr } from "react-redux-toastr";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import { MESSAGES } from "../../../../../config/Message";
import { langs } from "../../../../../config/localization";
import "../../common/css/booking-tourism-checkout.less";
// import "../../common/css/one-way-return.less";
import TopBackWithTitle from "../../common/TopBackWithTitle";
import TourismSteps from "../../common/TourismSteps";
import "./hotel-checkout.less";
import { Stripe_Public_key } from "../../../../../config/Config";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../../checkout/CheckoutForm";
import PaypalExpressBtn from "react-paypal-express-checkout";
import moment from "moment";
const stripePromise = loadStripe(Stripe_Public_key);
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}
class HotelCheckout extends React.Component {
  state = {
    loading: false,
    visible: false,
    selectedCard: null,
    cards: [],
    selectedPaymentMethod: null,
    paypalPayload: null,
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
  savedStripeCard = (token) => {
    const { id } = this.props.loggedInUser;
    let me = this;
    this.props.enableLoading();
    this.props.savedStripeCard(token, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.SAVE_PAYMENT_CARD);
        this.getTheCards()
        // this.props.getUserProfile({ user_id: id }, (res2) => {
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
  // console.log("🚀 ~ file: HotelCheckout.js ~ line 123 ~ HotelCheckout ~ payload", payload)
  // this.setState({paypalPayload: payload})
  // toastr.success("Success", "Click on pay to Complete");
  // this.props.paypalresponse(payload)
  // this.props.paypalPayment(payload)
  this.tourismFlightBooking(payload);
  }

  onPaypalPaymentCancel = (data) => {
    toastr.error("Error", "Payment Cancelled.");
  };

  onPaypalPaymentError = (err) => {
  toastr.error("Error", "Payment Failed.");
  };
  
  paymentMethodOptionChangeHandler = (event) => {
    this.setState({ 
      selectedPaymentMethod: event.target.value,
      selectedCard: null
    });
  };

  tourismFlightBooking = (paypalPayload) => {
    const { formv } = this.props;
    const { selectedPaymentMethod } = this.state;
    let tmp = Object.assign({}, formv)
    // if(selectedPaymentMethod == "paypal"){
      tmp = Object.assign({}, formv, paypalPayload)
      let form_data = new FormData();
      for ( var key in tmp ) {
          form_data.append(key, tmp[key]);
        }
      this.props.tourismHotelBookingPaypalAPI(tmp, (res) => {
        if (res.status === 200) {
          this.setState({ visible: true, booking_id: res.data.booking.original.id });
          toastr.success("Hotel has been booked sucessfully.");
        }
      });
    // }
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
    const { current, formv, amount, userDetails, taxation, totalRate, Data, nights, extra } = this.props
    const { visible, loading, cards, selectedCard, selectedPaymentMethod, paypalPayload, booking_id } = this.state;
    console.log("🚀 ~ file: HotelCheckout.js ~ line 189 ~ HotelCheckout ~ render ~ selectedPaymentMethod", selectedPaymentMethod)
    
    const client = {
      sandbox:
        "AREIlckrVOn91AOK1bYVlg1lsWgqAK49f6j-clybiFLQAe6F7-yovfTNlK7CyUAij5lxQZbteK0MvNdi",
      production:
        "EC3KB5dIv6Wv1ICrM7uuCBRTjXf7wQxKpIqRIT3B1rurf8lot-2_uY-GhecmZCiGPvVuV8GugAC-aljC",
    };
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing booking-tourism-checkout-box">
        <Layout className="yellow-theme common-left-right-padd">
          <TopBackWithTitle />
          <Layout className="right-parent-block inner-content-wrap">
            <Content className="site-layout tourism-booking-form-box tourism-hotel-detail-box">
              <TourismSteps curent={current}/>
              <div className="booking-tourism-box">
                <div>
                  {/* START - Heading and Contact Information box - 03/07/2021 */}
                  <div className="page-heading-container">
                    <h2>Checkout</h2>
                  </div>
                  <Row gutter={16}>
                <Col md={16}>
                  
                    <div className="payment-methods-box payment-first-box">
                      {/* <Radio
                        checked={selectedPaymentMethod === "stripe-card-list"}
                        value="stripe-card-list"
                        className="first-payment-choise"
                      > */}
                        <Row gutter={0} className="main-heading-cols">
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
                          // userDetails && (Array.isArray(userDetails.stripe_sources) &&
                          //   userDetails.stripe_sources.length) ?
                          //   userDetails.stripe_sources.
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
                                    total={salaryNumberFormate((+totalRate + +taxation + extra))}
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
                    selectedHotel={formv}
                    amount={amount}
                    selectedCard={selectedCard}
                    selectedPaymentMethod={selectedPaymentMethod}
                    paypalPayload={paypalPayload}
                    extra={extra}
                  />
                </Col>
                {/* END - YOUR BOOKING RIGHT SIDEBAR */}
              </Row>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>

        {/* START - Booking Confirmation Modal */}
        <Modal
          visible={visible}
          title="Purchase Complete!"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          className="custom-modal style1 booking-confirmation-modal"
          closable={false}
          maskClosable={false}
        >
          <div class="confirmation-modal-container">
            {/* <Title>Purchase Complete!</Title> */}
            <Title level={3}>
              Your Hotel Booking is confirmed.
            </Title>

            <div className="information">
              <Paragraph>
                Your booking ID is <Link to="#">{booking_id}</Link> and your PNR is {formv.pnr_number} Please use
                this booking ID for any communication with us.
              </Paragraph>
              <Text>We will email your ticket shortly.</Text>
            </div>

            <div class="information payment-information">
              <Paragraph>
                Your payment of ${+totalRate + +taxation + 40} was processed on {moment().format("DD-MM-YYYY")}. Here is a
                link to Receipt <Link to="#">#8458.pdf</Link> for your records
              </Paragraph>
            </div>

            <div className="button-container">
              <Button className="continue-button">Continue Browsing</Button>
              <Button className="go-home-button">Go to My Bookings</Button>
            </div>
          </div>
        </Modal>
        {/* END - Booking Confirmation Modal - 05/07/2021 */}
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
  getCardList,
  enableLoading,
  disableLoading,
  placeSportsOrder,
  savedStripeCard,
  placePaypalSportsOrder,
  tourismHotelBookingPaypalAPI,
})(HotelCheckout);