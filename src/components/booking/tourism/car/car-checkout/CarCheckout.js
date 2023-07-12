import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
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
  savedStripeCard,
  getUserProfile,
  tourismCarPaypalAPI,
  enableLoading,
  disableLoading,
  getCardList,
} from "../../../../../actions";
import {
  salaryNumberFormate,
} from "../../../../common";
import  CarBookingDetailBlock from './CarBookingBlock'
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/one-way-return.less";
import "./car-checkout.less";
import { toastr } from "react-redux-toastr";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import { MESSAGES } from "../../../../../config/Message";
import { langs } from "../../../../../config/localization";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {Stripe_Public_key} from "../../../../../config/Config";
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
class CarCheckout extends React.Component {
  state = {
    loading: false,
    visible: false,
    booking_id: null,
    cards: [],
  };

  componentWillMount = () => {
    this.getTheCards();
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

  onPaypalPaymentSuccess = (value) => {
    console.log("🚀 ~ file: FlightCheckout.js ~ line 81 ~ FlightCheckout ~ value", value)
    let payload = {
      payment_method: "paypal",
      order_id: value.paymentID,
      payer_id: value.payerID,
      paypal_payment_status: "VERIFIED"
    }
    const { pnrNumber, selectedCar, selectedCard, car_reqdata } = this.props;
    console.log("🚀 ~ file: CarBookingBlock.js ~ line 23 ~ CarBookingDetailBlock ~ this.props", this.props)
    let reqData = {
      car_details: selectedCar && selectedCar.selected_car,
      pnr_number: pnrNumber,
      start_date: car_reqdata.reqData.startDate,
      end_date: car_reqdata.reqData.endDate,
      total_price: selectedCar && selectedCar.selected_car && selectedCar.selected_car.tariffInfo && selectedCar.selected_car.tariffInfo.total &&  Number(selectedCar.selected_car.tariffInfo.total.rateAmount),
      is_prepay: 1,
      ...payload
    };
    console.log("reqData", reqData);
    // const formData = new FormData();
    // Object.keys(reqData).forEach((key) => {
    //   if (typeof reqData[key] == "object") {
    //     formData.append(key, JSON.stringify(reqData[key]));
    //   } else {
    //     formData.append(key, reqData[key]);
    //   }
    // });
    this.props.tourismCarPaypalAPI(reqData, (res) => {
      console.log("checkout res", res);
      if (res.status === 200) {
        this.setState({visible: true, booking_id: res.data.original.id});
        toastr.success("Car has been booked sucessfully.");
      }
    });
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
    const { visible, selectedPaymentMethod, selectedCard, booking_id, cards } = this.state;
    const { userDetails, pnrNumber, selectedCar, step1Data } = this.props;
    console.log("🚀 ~ file: CarCheckout.js ~ line 122 ~ CarCheckout ~ render ~ this.props", this.props)
    let total = selectedCar && selectedCar.selected_car && selectedCar.selected_car.tariffInfo && selectedCar.selected_car.tariffInfo.total &&  Number(selectedCar.selected_car.tariffInfo.total.rateAmount);
    // if(step1Data && step1Data.addedtotal){
    //   total += +step1Data.addedtotal
    // }
    const client = {
      sandbox:
        "AREIlckrVOn91AOK1bYVlg1lsWgqAK49f6j-clybiFLQAe6F7-yovfTNlK7CyUAij5lxQZbteK0MvNdi",
      production:
        "EC3KB5dIv6Wv1ICrM7uuCBRTjXf7wQxKpIqRIT3B1rurf8lot-2_uY-GhecmZCiGPvVuV8GugAC-aljC",
    };
    return (
      <div>
        <div className="booking-tourism-box tourism-booking-form-box tourism-car-detail-box">
                <div>
                  {/* START - Heading and Contact Information box - 03/07/2021 */}
                  <div className="page-heading-container">
                    <h2 className="checkout-heading">Checkout</h2>
                  </div>
                  <Row gutter={16}>
                    <Col md={16}>
                      {/* <div className="payment-methods-box">
                        <Row className="main-heading-cols">
                          <Col lg={14}>
                            <Title level={4}>Your saved payment methods</Title>
                          </Col>
                          <Col lg={5}>
                            <label>Name On Card</label>
                          </Col>
                          <Col lg={5}>
                            <label>Name On Card</label>
                          </Col>
                        </Row>
                        <Radio.Group
                          name="radiogroup"
                          defaultValue={1}
                          className="card-select-box"
                        >
                          <Radio value={1}>
                            <Row>
                              <Col lg={14}>
                                <p className="card-detail">
                                  <span className="card-type-name">Visa</span>
                                  ending in ***4512
                                </p>
                                <img
                                  src={require("../../../../../assets/images/icons/visa.svg")}
                                  alt="card-icon"
                                  className="card-icon"
                                />
                                <div className="cvv-no-input-box">
                                  <Form.Item name="cvv" label="Enter CVV:">
                                    <Input placeholder="..." />
                                  </Form.Item>
                                  <span className="card-recom-msg">
                                    This card is recommended for you
                                  </span>
                                </div>
                              </Col>
                              <Col md={5}>
                                <label className="name">John Smith</label>
                              </Col>
                              <Col lg={5}>
                                <label className="date">11/20/25</label>
                              </Col>
                            </Row>
                          </Radio>
                          <Radio value={2}>
                            <Row>
                              <Col lg={14}>
                                <p className="card-detail">
                                  <span className="card-type-name">
                                    Master card
                                  </span>
                                  ending in ***4512
                                </p>
                                <img
                                  src={require("../../../../../assets/images/icons/masterv-card2.svg")}
                                  alt="card-icon"
                                  className="card-icon"
                                />
                              </Col>
                              <Col md={5}>
                                <label className="name">John Smith</label>
                              </Col>
                              <Col lg={5}>
                                <label className="date">11/20/25</label>
                              </Col>
                            </Row>
                          </Radio>
                          <Radio value={3}>
                            <Row>
                              <Col lg={14}>
                                <p className="card-detail">
                                  <span className="card-type-name">
                                    Master card
                                  </span>
                                  ending in ***4512
                                </p>
                                <img
                                  src={require("../../../../../assets/images/icons/masterv-card2.svg")}
                                  alt="card-icon"
                                  className="card-icon"
                                />
                              </Col>
                              <Col md={5}>
                                <label className="name">John Smith</label>
                              </Col>
                              <Col lg={5}>
                                <label className="date">11/20/25</label>
                              </Col>
                            </Row>
                          </Radio>
                        </Radio.Group>
                      </div> */}
                      {/* <Radio.Group
                    onChange={this.paymentMethodOptionChangeHandler}
                    value={selectedPaymentMethod}
                  > */}
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
                          // userDetails && (Array.isArray(userDetails.stripe_sources) &&
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
                                    total={salaryNumberFormate(total)}
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
                  </Radio.Group>
                    </Col>

                    {/* START - Car Your Booking Right Sidebar-2 - 06/07/2021 */}
                    <Col md={8}>
                      <CarBookingDetailBlock 
                      {...this.props}
                      selectedCar={selectedCar}
                      selectedCard={selectedCard}
                      showSuccessBooking={(show, id) => 
                        this.setState({
                          visible: show,
                          booking_id: id
                        })
                      }
                      />
                    </Col>
                    {/* END - Car Your Booking Sidebar-2 - 06/07/2021 */}
                  </Row>
                </div>
              </div>
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
            Your Reservation is Confirmed.
            </Title>

            <div className="information">
              <Paragraph>
                Your booking ID is <Link to="#">{booking_id}</Link> . Please use
                this booking ID for any communication with us.
              </Paragraph>
              <Text>We will email your ticket shortly.</Text>
            </div>

            <div class="information payment-information">
              <Paragraph>
                Your payment of ${total} was processed on {moment().format("DD/MM/YYYY")}. Here is a
                link to Receipt <Link to="#">#8458.pdf</Link> for your records
              </Paragraph>
            </div>

            <div className="button-container">
            <Button
                className="continue-button"
                onClick={() => {
                  this.props.history.push(
                    "/bookings-car-tourism/Tourism/55/Cars/58"
                  );
                  this.setState({ visible: false });
                }}
              >
                Continue Browsing
              </Button>
              <Button
                className="go-home-button"
                onClick={() => {
                  this.props.history.push(
                    "/dashboard"
                  );
                  this.setState({ visible: false });
                }}
              >
                Go to My Bookings
              </Button>
            </div>
          </div>
        </Modal>
        {/* END - Booking Confirmation Modal - 05/07/2021 */}
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  const { profile, auth, tourism} = store;
  const { car_reqdata } = tourism;
  return {
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
    loggedInUser: auth.isLoggedIn ? auth.loggedInUser : false,
    car_reqdata,
  };
};

export default connect(mapStateToProps, {
  savedStripeCard,
  getUserProfile,
  tourismCarPaypalAPI,
  enableLoading,
  disableLoading,
  getCardList,
})(withRouter(CarCheckout));
// export default CarCheckout;
