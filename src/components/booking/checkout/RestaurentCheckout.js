import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Input, Button, Modal, Row, Col, Radio, Layout, Card } from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./style.less";
import "../../dashboard/vendor-profiles/myprofilestep.less";
import CheckoutForm from "./CheckoutForm";
import {
  getTraderDetails,
  getServiceBookingCheckout,
  getSpaServiceRepay,
  placeRestaurantOrder,
  beautyServiceBookingCheckout,
  getFitnessServiceBookingCheckout,
  checkoutTraderClassBooking,
  beautyServiceBookingRepay,
  enableLoading,
  disableLoading,
  placeOrderAPI,
  eventEnquiryCheckout,
  checkoutHandymanCustomerBooking,
  listBookingSavedCards,
  applyPromocode,
  addCheckoutData,
  removeCheckoutData,
  eventjobCheckoutSuccess,
  getBookingIdByEnquiryId,
  getTraderjobIdByQuoteId,
  placeRestaurantoOrderSuccess,
  savedStripeCard,
  listCustomerHandymanBookingsDetail,
} from "../../../actions";

import PayPalExpressCheckOut from "./PayPalExpressCheckOut";
import history from "../../../common/History";
import GooglePay from "./GooglePayButton";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../config/localization";
import moment from "moment";
import { dateFormate1 } from "../../common";
import PaymentMethods from "./PaymentMethods";
import { Document, Page, pdfjs } from "react-pdf";
import PDFInvoiceModal from "../../common/PDFInvoiceModal";
import { Stripe_Public_key } from "../../../config/Config";
import { STATUS_CODES } from "../../../config/StatusCode";
import { MESSAGES } from "../../../config/Message";
import PDFInvoiceModal2 from "../../common/PDFInvoiceModal2";

const stripePromise = loadStripe(Stripe_Public_key);
// const stripePromise = loadStripe('pk_test_51H3J9jHhOHLOerXXaHfv1p47eSyBM2kQfOYjNyE2NXXUoFDdW8J2EJoYkBAaEqxdg2L0XxY4qKWvlWsyPt4Ojffm00BmSRbBZD');

class RestaurentCheckout extends React.Component {
  constructor(props) {
    console.log("props RestaurentCheckout ", props);
    super(props);
    //const { hideCheckout, booking_type, isBooking } = this.props.history.location.state;
    this.paypalButtonRef = React.createRef();
    this.state = {
      opened: false,
      selectedPaymentMethod: "",
      paymentMethodsKey: "cardPayment",
      traderDetailsResponse: "",
      stripePaymentGateWayResponse: "",
      invoiceDetails: "",
      orderInfo: {},
      promocodeValue: "",
      appliedPromoCode: "",
      promoCodeDiscount: "",
      isClicked: false,
      redirectFromPapal: false,
      isSavedCardPayment: false,
      selectedSavedCard: "",
      selectedCardCvv: "",
      enquiryBooking: [],
      visible: false,
      refetchCards: false,
      // isBooking: isBooking ? true : false,
      isBooking: false,
    };

    if (!this.props.location.state) {
      if (this.props.checkoutData) {
        this.props.location.state =
          this.props.checkoutData.props.location.state;
      }
    }
  }

  componentDidMount() {
    const { booking_type, isBooking } = this.props.location.state;

    this.setState({ isBooking: isBooking });

    if (this.props.checkoutData && this.props.location.search) {
      console.log("this.props.checkoutData", this.props.checkoutData);
      console.log("this.props.location", this.props.location);
      let query_temp = new URLSearchParams(this.props.location.search);
      if (this.props.checkoutData && !query_temp.get("order_ids")) {
        let query = new URLSearchParams(this.props.location.search);
        this.setState({
          ...this.props.checkoutData.state,
          redirectFromPapal: true,
          paypal_job_id: query.get("job_id"),
          paypal_type: query.get("type"),
          paypal_token: query.get("token"),
          paypal_PayerID: query.get("PayerID"),
          eventBookingPurchaseSuccessful: true,
        });
        this.props.eventjobCheckoutSuccess(
          {
            job_id: query.get("job_id"),
            type: query.get("type"),
            token: query.get("token"),
            PayerID: query.get("PayerID"),
          },
          (res) => {
            console.log("eventjobCheckoutSuccess");
          }
        );
      }
      if (this.props.checkoutData) {
        let query = new URLSearchParams(this.props.location.search);
        if (query.get("order_ids")) {
          this.setState({
            ...this.props.checkoutData.state,
            redirectFromPapal: true,
            order_id: query.get("order_ids"),
            paypal_token: query.get("token"),
            paypal_PayerID: query.get("PayerID"),
            restaurentPurchaseSuccessful: true,
          });
          this.props.placeRestaurantoOrderSuccess(
            {
              order_id: query.get("order_ids"),
            },
            (res) => {
              toastr.success(langs.success, "Your order has been placed");
              this.setState({ visible: true });

              setTimeout(() => {
                this.props.history.push({
                  pathname: `/payment-complete`,
                  state: {
                    cart_items: this.props.location.state.cart_items,
                    total: this.props.location.state.amount,
                  },
                });
              }, 10000);
            }
          );
        }
      }
    }
    const { loggedInUser } = this.props;
    const { amount, trader_user_id, customerId, payment_type } =
      this.props.location.state;
    const getTraderReqData = {
      id: trader_user_id ? trader_user_id : loggedInUser.id,
    };
    this.props.enableLoading();
    this.props.listBookingSavedCards((res) => {
      //
    });
    // http://10.10.1.8/formee/api/get-all-user-cards
    this.props.getTraderDetails(getTraderReqData, (res) => {
      console.log("getTraderReqData", getTraderReqData);
      this.props.disableLoading();

      if (res.status === 200) {
        this.setState({ traderDetailsResponse: res.data.data });

        console.log("res.data.data", res.data.data);
      } else {
        toastr.error(langs.error, langs.messages.get_service_booking_error);
      }
    });
    console.log("this.props.location.state@@@@@", this.props.location.state);
    const reqData = {
      enquiry_id: this.props.location.state.enquiryId,
    };

    if (booking_type == "event") {
      const reqData = {
        enquiry_id: this.props.location.state.enquiryId,
      };
      this.props.getBookingIdByEnquiryId(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          console.log(
            "getBookingIdByEnquiryId response -----",
            res.data.data[0]
          );
          this.setState({ enquiryBooking: res.data.data[0] });
        } else {
          toastr.error(langs.error, langs.messages.get_service_booking_error);
        }
      });
    } else if (booking_type == "handyman") {
      const reqData = {
        quote_id: this.props.location.state.enquiryId,
      };
      //const { isBooking } = this.state;
      const { enquiryId, isBooking } = this.props.location.state;

      console.log(
        "this.props.location.state.enquiryId",
        this.props.location.state
      );
      console.log("isBooking checkout page ", isBooking);
      console.log("enquiryId ==== ", enquiryId);
      if (isBooking != true) {
        console.log("handyman in if is booking ", isBooking);
        this.props.getTraderjobIdByQuoteId(reqData, (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            console.log(
              "getBookingIdByEnquiryId response -----",
              res.data.data[0]
            );
            this.setState({ enquiryBooking: res.data.data[0] });
          } else {
            toastr.error(langs.error, langs.messages.get_service_booking_error);
          }
        });
      } else {
        console.log("listCustomerHandymanBookingsDetail in else - ", isBooking);
        this.props.listCustomerHandymanBookingsDetail(
          { trader_job_id: enquiryId },
          (res) => {
            if (res.status === 200) {
              console.log(
                "getBookingIdByEnquiryId response -----",
                res.data.job
              );
              this.setState({ enquiryBooking: res.data.job });
            } else {
              toastr.error(
                langs.error,
                langs.messages.get_service_booking_error
              );
            }
          }
        );
      }
    }
  }

  paymentMethodOptionChangeHandler = (event) => {
    this.setState({
      selectedPaymentMethod: event.target.value,
      isSavedCardPayment: false,
      selectedSavedCard: "",
      selectedCardCvv: "",
    });
  };

  getCardTokenFromStripe = (response) => {
    if (response.error !== undefined) {
    } else if (response.paymentMethod !== undefined) {
      this.setState(
        {
          stripePaymentGateWayResponse: response.paymentMethod,
        },
        () => {
          this.onSucessPayment();
        }
      );
    }
  };

  onPaypalPaymentSuccess = (payment) => {
    if (payment.paid === true) {
      this.onSucessPayment();
    }
  };

  onPaypalPaymentCancel = (data) => {
    // User pressed "cancel" or close Paypal's popup!
    // this.mebershipFitnessCheckout()
    // this.onSucessPayment();
  };

  onPaypalPaymentError = (err) => {
    // The main Paypal's script cannot be loaded or somethings block the loading of that script!
    // Since the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
  };

  onGooglePaymentSuccess = (payment) => {
    this.onSucessPayment();
  };

  onGooglePaymentCancel = (data) => {};

  onGooglePaymentError = (err) => {};

  onSucessPayment = () => {
    const { booking_type } = this.props.location.state;
    console.log("booking_type", booking_type);
    if (booking_type === "spa") {
      this.onSpaBookingPaymentSuccess();
    } else if (booking_type === "restaurant") {
      this.onRestaurentOrderPaymentSuccess();
    } else if (booking_type === "beauty") {
      this.onBeautyServiceBookingPaymentSuccess();
    } else if (booking_type === langs.key.fitness) {
      this.membershipFitnessCheckout();
    } else if (booking_type === "retail") {
      this.retailProductCheckout();
    } else if (booking_type === "event") {
      this.eventCheckout();
    } else if (booking_type === "handyman") {
      this.handymanAcceptBooking();
    } else if (booking_type === "retail_cart") {
      this.handleRetailCartCheckout();
    }
  };

  addCardSuccess = () => {
    alert("cardAdded");
  };

  handymanAcceptBooking = () => {
    const { service_booking_id } = this.props.location.state;
    const { visible } = this.state.visible;
    const { enquiryBooking } = this.state.enquiryBooking;
    const reqData = {
      job_id: this.state.enquiryBooking.id,
      payment_method: this.state.selectedPaymentMethod
        ? this.state.selectedPaymentMethod
        : "stripe",
    };
    if (
      this.state.selectedPaymentMethod === "stripe" &&
      this.state.stripePaymentGateWayResponse !== ""
    ) {
      reqData.payment_source_id = this.state.stripePaymentGateWayResponse.id;
    }

    if (this.state.selectedPaymentMethod === "saved card") {
      reqData.payment_source_id = this.state.selectedSavedCard[0].source_id;
      reqData.payment_method = "stripe";
    }

    this.props.checkoutHandymanCustomerBooking(reqData, (res) => {
      if (res.status === 200 && res.data.success == true) {
        console.log("checkoutHandymanCustomerBooking@@@@@", res);

        //  toastr.success(langs.success, langs.messages.event_booking_success);
        // this.props.history.push({
        //   pathname: `/`,
        // });
        if (
          this.state.selectedPaymentMethod === "stripe" ||
          this.state.selectedPaymentMethod === "saved card"
        ) {
          toastr.success(langs.success, langs.messages.event_booking_success);
          this.setState({ eventBookingPurchaseSuccessful: true });
          // this.props.history.push({
          //   pathname: `/`,
          // });
        } else {
          window.location.href = res.data.url;
        }
      } else {
        toastr.error(
          langs.error,
          langs.messages.service_booking_checkout_error
        );
      }
    });
  };

  eventCheckout = () => {
    this.props.enableLoading();
    const { selectedEnquiryId } = this.props.location.state;
    // const { enquiryBooking } = this.state.enquiryBooking;
    console.log("enquiryBooking@@", this.state.enquiryBooking);
    console.log("this.props.location.state@@", this.props.location.state);

    const reqData = {
      event_booking_id: this.state.enquiryBooking.id,
      payment_method: this.state.selectedPaymentMethod
        ? this.state.selectedPaymentMethod
        : "stripe",
    };
    if (
      this.state.selectedPaymentMethod === "stripe" &&
      this.state.stripePaymentGateWayResponse !== ""
    ) {
      reqData.payment_source_id = this.state.stripePaymentGateWayResponse.id;
    }

    if (this.state.selectedPaymentMethod === "saved card") {
      reqData.payment_source_id = this.state.selectedSavedCard[0].source_id;
      reqData.payment_method = "stripe";
    }

    this.props.eventEnquiryCheckout(reqData, (res) => {
      this.props.disableLoading();
      console.log(`event payment response`, res);
      if (res.status === 200 && res.data.success == true) {
        console.log(
          "this.state.selectedPaymentMethod@@@@@",
          this.state.selectedPaymentMethod
        );
        if (
          this.state.selectedPaymentMethod === "stripe" ||
          this.state.selectedPaymentMethod === "saved card"
        ) {
          toastr.success(langs.success, langs.messages.event_booking_success);
          this.setState({ eventBookingPurchaseSuccessful: true });

          // this.props.history.push({
          //   pathname: `/`,
          // });
        } else {
          window.location.href = res.data.url;
        }
      } else {
        toastr.error(
          langs.error,
          langs.messages.service_booking_checkout_error
        );
      }
    });
  };

  retailProductCheckout = () => {
    const { selectedPaymentMethod, stripePaymentGateWayResponse } = this.state;
    const { placeOrderReqData } = this.props.location.state;

    if (
      selectedPaymentMethod === "stripe" &&
      stripePaymentGateWayResponse !== ""
    ) {
      placeOrderReqData.order.stripe_charge_id =
        stripePaymentGateWayResponse.id;
    }
    placeOrderReqData.order.paymentMethod = this.state.selectedPaymentMethod
      ? this.state.selectedPaymentMethod
      : "stripe";
    placeOrderReqData.orderDetails.map((el) => {
      el.transaction_status = "Paid";
      el.order_status = "Pending";
      el.buyer_msg = "";
      el.payment_status = "Accepted-Paid";
      el.transaction_id =
        selectedPaymentMethod === "stripe"
          ? placeOrderReqData.order.stripe_charge_id
          : "";
      return el;
    });
    if (this.state.selectedPaymentMethod === "saved card") {
      placeOrderReqData.order.payment_source_id =
        this.state.selectedSavedCard[0].source_id;
      placeOrderReqData.order.payment_method = "stripe";
    }
    this.props.placeOrderAPI(placeOrderReqData, (res) => {
      if (res.status === 200 && res.data.status == true) {
        toastr.success(langs.success, res.data.message);
        this.props.history.push({
          pathname: `/retail-orders`,
        });
      } else {
        toastr.error(
          langs.error,
          langs.messages.service_booking_checkout_error
        );
      }
    });
  };

  membershipFitnessCheckout = () => {
    console.log("membershipFitnessCheckout", this.props.location.state);
    const {
      booking_id,
      package_id,
      start_date,
      customer_name,
      customer_phone,
      phonecode,
    } = this.props.location.state;
    const serviceBookingCheckoutReqData = {
      package_id,
      class_booking_id: booking_id,
      start_date: moment(start_date, "DD-MM-YYYY").format("YYYY-MM-DD"),
      // start_date: '2020-11-27',
      customer_name,
      customer_phone:
        customer_phone !== null && customer_phone !== "N/A"
          ? `${phonecode}${customer_phone}`
          : "",
      payment_method: this.state.selectedPaymentMethod,
    };
    if (
      this.state.selectedPaymentMethod === "stripe" &&
      this.state.stripePaymentGateWayResponse !== ""
    ) {
      serviceBookingCheckoutReqData.payment_source_id =
        this.state.stripePaymentGateWayResponse.id;
    }

    if (this.state.selectedPaymentMethod === "saved card") {
      serviceBookingCheckoutReqData.payment_source_id =
        this.state.selectedSavedCard[0].source_id;
      serviceBookingCheckoutReqData.payment_method = "stripe";
    }
    this.props.checkoutTraderClassBooking(
      serviceBookingCheckoutReqData,
      (res) => {
        if (res.status === 200) {
          toastr.success(
            langs.success,
            langs.messages.service_booking_checkout_success
          );
          this.props.history.push({
            pathname: `/dashboard`,
          });
        } else {
          toastr.error(
            langs.error,
            langs.messages.service_booking_checkout_error
          );
        }
      }
    );
  };

  onBeautyServiceBookingPaymentSuccess = () => {
    const {
      customer_name,
      mobile_no,
      phonecode,
      service_booking_id,
      payment_type,
    } = this.props.location.state;
    if (payment_type === "repay") {
      const beautyServiceBookingCheckoutReqData = {
        service_booking_id: service_booking_id,
        name: customer_name,
        phone_number: mobile_no !== null ? `${phonecode}${mobile_no}` : "",
        payment_method: this.state.selectedPaymentMethod,
      };
      if (
        this.state.selectedPaymentMethod === "stripe" &&
        this.state.stripePaymentGateWayResponse !== ""
      ) {
        beautyServiceBookingCheckoutReqData.payment_source_id =
          this.state.stripePaymentGateWayResponse.id;
      }
      this.props.enableLoading();
      this.props.beautyServiceBookingRepay(
        beautyServiceBookingCheckoutReqData,
        (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            toastr.success(
              langs.success,
              langs.messages.service_booking_checkout_success
            );
            this.props.history.push({
              pathname: `/my-bookings`,
            });
          } else {
            toastr.error(
              langs.error,
              langs.messages.service_booking_checkout_error
            );
          }
        }
      );
    } else {
      const beautyServiceBookingCheckoutReqData = {
        service_booking_id: service_booking_id,
        name: customer_name,
        phone_number: mobile_no !== null ? `${phonecode}${mobile_no}` : "",
        payment_method: this.state.selectedPaymentMethod,
      };
      if (
        this.state.selectedPaymentMethod === "stripe" &&
        this.state.stripePaymentGateWayResponse !== ""
      ) {
        beautyServiceBookingCheckoutReqData.payment_source_id =
          this.state.stripePaymentGateWayResponse.id;
      }

      if (this.state.selectedPaymentMethod === "saved card") {
        beautyServiceBookingCheckoutReqData.payment_source_id =
          this.state.selectedSavedCard[0].source_id;
        beautyServiceBookingCheckoutReqData.payment_method = "stripe";
      }

      this.props.enableLoading();
      this.props.beautyServiceBookingCheckout(
        beautyServiceBookingCheckoutReqData,
        (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            toastr.success(
              langs.success,
              langs.messages.service_booking_checkout_success
            );
            this.props.history.push({
              pathname: `/my-bookings`,
            });
          } else {
            toastr.error(
              langs.error,
              langs.messages.service_booking_checkout_error
            );
          }
        }
      );
    }
  };

  onSpaBookingPaymentSuccess = () => {
    const {
      customer_name,
      mobile_no,
      phonecode,
      service_booking_id,
      payment_type,
    } = this.props.location.state;
    if (payment_type === "repay") {
      const serviceBookingCheckoutReqData = {
        service_booking_id: service_booking_id,
        name: customer_name,
        phone_number: mobile_no !== null ? `${phonecode}${mobile_no}` : "",
        payment_method: this.state.selectedPaymentMethod,
      };

      if (
        this.state.selectedPaymentMethod === "stripe" &&
        this.state.stripePaymentGateWayResponse !== ""
      ) {
        serviceBookingCheckoutReqData.payment_source_id =
          this.state.stripePaymentGateWayResponse.id;
      }

      if (this.state.selectedPaymentMethod == "saved card") {
        serviceBookingCheckoutReqData.payment_source_id =
          this.state.selectedSavedCard[0].source_id;
        serviceBookingCheckoutReqData.payment_method = "stripe";
      }

      this.props.enableLoading();
      this.props.getSpaServiceRepay(serviceBookingCheckoutReqData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          toastr.success(
            langs.success,
            langs.messages.service_booking_repay_success
          );
          this.props.history.push({
            pathname: `/my-bookings`,
          });
        } else {
          toastr.error(langs.error, langs.messages.service_booking_repay_error);
        }
      });
    } else {
      const serviceBookingCheckoutReqData = {
        service_booking_id: service_booking_id,
        name: customer_name,
        phone_number: mobile_no !== null ? `${phonecode}${mobile_no}` : "",
        payment_method: this.state.selectedPaymentMethod,
      };

      if (
        this.state.selectedPaymentMethod === "stripe" &&
        this.state.stripePaymentGateWayResponse !== ""
      ) {
        serviceBookingCheckoutReqData.payment_source_id =
          this.state.stripePaymentGateWayResponse.id;
      }
      if (this.state.selectedPaymentMethod == "saved card") {
        serviceBookingCheckoutReqData.payment_source_id =
          this.state.selectedSavedCard[0].source_id;
        serviceBookingCheckoutReqData.payment_method = "stripe";
      }
      this.props.enableLoading();
      this.props.getServiceBookingCheckout(
        serviceBookingCheckoutReqData,
        (res) => {
          this.props.disableLoading();

          if (res.status === 200 && res.data.success) {
            // toastr.success(
            //   langs.success,
            //   langs.messages.service_booking_checkout_success
            // );
            // this.props.history.push({
            //   pathname: `/my-bookings`,
            // });
            if (
              this.state.selectedPaymentMethod === "stripe" ||
              this.state.selectedPaymentMethod === "saved card"
            ) {
              toastr.success(
                langs.success,
                langs.messages.event_booking_success
              );
              this.setState({ visible: true });

              this.props.history.push({
                pathname: `/my-bookings`,
              });
            } else {
              window.location.href = res.data.url;
            }
          } else {
            toastr.error(
              langs.error,
              res.data?.message
                ? res.data.message
                : langs.messages.service_booking_checkout_error
            );
          }
        }
      );
    }
  };

  onRestaurentOrderPaymentSuccess = () => {
    const {
      amount,
      cart_items,
      booking_type,
      order_type,
      address_id,
      cart_item_ids,
      payment_type,
    } = this.props.location.state;
    if (payment_type === "firstpay") {
      let reqData = {
        cart_item_ids: cart_item_ids,
        order_type: order_type,
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        address_id: address_id,
        payment_method: this.state.selectedPaymentMethod,
      };

      if (
        this.state.selectedPaymentMethod === "stripe" &&
        this.state.stripePaymentGateWayResponse !== ""
      ) {
        reqData.payment_source_id = 6868676868;
        //reqData.payment_source_id = this.state.stripePaymentGateWayResponse.id;
      }

      if (this.state.selectedPaymentMethod == "saved card") {
        reqData.payment_source_id = this.state.selectedSavedCard[0].source_id;
        reqData.payment_method = "stripe";
      }
      this.props.enableLoading();
      this.props.placeRestaurantOrder(reqData, (response) => {
        this.props.disableLoading();
        if (response.status === 200) {
          // toastr.success(langs.success, "Your order has been placed");
          // this.setState({ visible: true });

          // setTimeout(() => {
          //   this.props.history.push({
          //     pathname: `/payment-complete`,
          //     state: {
          //       cart_items: cart_items,
          //       total: amount,
          //     },
          //   });
          // }, 10000);
          if (
            this.state.selectedPaymentMethod === "stripe" ||
            this.state.selectedPaymentMethod === "saved card"
          ) {
            toastr.success(langs.success, langs.messages.event_booking_success);
            this.setState({ visible: true });
            // setTimeout(() => {
            //   this.props.history.push({
            //     pathname: `/payment-complete`,
            //     state: {
            //       cart_items: cart_items,
            //       total: amount,
            //     },
            //   });
            // }, 10000);
            // this.props.history.push({
            //   pathname: `/`,
            // });
          } else {
            window.location.href = response.data.url;
          }
        } else {
          toastr.error(langs.error, "Something went wrong in place this order");
        }
      });
    }
  };

  handleRetailCartCheckout = () => {
    const {
      selectedPaymentMethod,
      stripePaymentGateWayResponse,
      appliedPromoCode,
      promoCodeDiscount,
      selectedSavedCard,
    } = this.state;
    const {
      placeOrderReqData,
      selected_item_list,
      subTotal,
      total,
      selectedAddress,
      user_id,
      cart_classified_ids,
      cart_classified_id,
      payment_source_id,
      payment_method,
      address_id,
    } = this.props.reqData;

    console.log(this.props.reqData, "req data");
    const { deliveryAddress } = this.props;
    let discountAmount =
      (Number(placeOrderReqData.order.order_grandtotal) * promoCodeDiscount) /
      100;
    if (
      selectedPaymentMethod === "stripe" &&
      stripePaymentGateWayResponse !== ""
    ) {
      placeOrderReqData.order.stripe_charge_id =
        stripePaymentGateWayResponse.id;
    }

    if (this.state.selectedPaymentMethod == "saved card") {
      placeOrderReqData.order.payment_source_id =
        this.state.selectedSavedCard[0].source_id;
      placeOrderReqData.order.payment_method = "stripe";
    }

    placeOrderReqData.order.paymentMethod = this.state.selectedPaymentMethod
      ? this.state.selectedPaymentMethod
      : "stripe";
    placeOrderReqData.orderDetails = selected_item_list.map((el) => {
      el.item_ship_name = el.item_ship_name;
      el.item_ship_cost = el.item_ship_cost;
      el.transaction_status = "Paid";
      el.order_status = "Pending";
      el.buyer_msg = "";
      el.payment_status = "Accepted-Paid";
      el.transaction_id =
        selectedPaymentMethod === "stripe"
          ? placeOrderReqData.order.stripe_charge_id
          : "";
      return el;
    });
    placeOrderReqData.order.customer_fname = selectedAddress.fname;
    placeOrderReqData.order.customer_lname = selectedAddress.lname;
    placeOrderReqData.order.customer_address1 = selectedAddress.address_1;
    placeOrderReqData.order.customer_city = selectedAddress.city
      ? selectedAddress.city
      : "";
    placeOrderReqData.order.customer_state = selectedAddress.state
      ? selectedAddress.state
      : "";

    placeOrderReqData.cart_classified_ids = cart_classified_ids;
    placeOrderReqData.payment_source_id = payment_source_id;
    placeOrderReqData.address_id = address_id;
    placeOrderReqData.user_id = user_id;
    placeOrderReqData.cart_classified_id = cart_classified_ids;
    // placeOrderReqData.payment_method= "stripe";

    placeOrderReqData.order.customer_country = selectedAddress.country
      ? selectedAddress.country
      : "";
    placeOrderReqData.order.customer_postcode = selectedAddress.postalcode
      ? selectedAddress.postalcode
      : "";
    placeOrderReqData.order.order_discount = discountAmount;
    placeOrderReqData.order.order_subtotal =
      Number(subTotal) - Number(discountAmount);
    placeOrderReqData.order.order_grandtotal =
      Number(total) - Number(discountAmount);
    placeOrderReqData.order.shipping_message = deliveryAddress
      ? deliveryAddress.shipping_message
      : "";
    placeOrderReqData.order.promo_code = appliedPromoCode;
    placeOrderReqData.order.discount_percent = promoCodeDiscount;

    this.props.placeOrderAPI(placeOrderReqData, (res) => {
      if (res.status === 200 && res.data.status == true) {
        toastr.success(langs.success, res.data.message);
        this.setState({ visible: true, orderInfo: res.data.orderInfo });
      } else {
        toastr.error(
          langs.error,
          langs.messages.service_booking_checkout_error
        );
      }
    });
  };

  changeStep = (step) => {
    this.setState({ visible: false });
    // this.props.nextStep(this.props.reqData, step, this.state.orderInfo);
  };

  onClickApplyPromocode = () => {
    const { loggedInDetail } = this.props;
    const { selected_item_list } = this.props.reqData;
    let cat_id = "";
    if (selected_item_list && selected_item_list.length) {
      cat_id = selected_item_list[0].classified_id;
    }
    let reqData = {
      promo_code: this.state.promocodeValue,
      booking_category_id: "",
      customer_id: loggedInDetail.id,
      category_type: "retail",
    };
    this.props.applyPromocode(reqData, (response) => {
      if (response.status === 200) {
        toastr.success("Promocode appiled successfully.");
        this.setState({
          appliedPromoCodeId: response.data.data.id,
          appliedPromoCode: response.data.data.promo_code,
          promoCodeDiscount: response.data.data.discount_percent,
        });
      }
    });
  };

  removeAppliedPromoCode = () => {
    this.setState({
      promocodeValue: "",
      appliedPromoCode: "",
      promoCodeDiscount: "",
    });
  };

  onSelectSavedCard = (card) => {
    this.setState({
      selectedPaymentMethod: "saved card",
      selectedCardCvv: "",
      isSavedCardPayment: true,
      selectedSavedCard: card,
    });
  };

  onChangeCvv = (value) => {
    this.setState({
      selectedCardCvv: value,
    });
  };

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
        this.setState({
          refetchCards: true,
        });
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      visible,
      traderDetailsResponse,
      opened,
      selectedPaymentMethod,
      eventBookingPurchaseSuccessful,
      receiptModalEventBooking,
      isSavedCardPayment,
      refetchCards,
    } = this.state;
    const { amount, customer_name, booking_type } = this.props.location.state;
    const { reqData } = this.props;
    let today = new Date();
    const paypalClient = {
      sandbox:
        "AcJtYklAstA978I-nPyRHp7XcgAvZJUmAux_tPoTvLxqAVW3SwqxXqfpzUezgUqZecum0ThG7oFdErUh",
      production: "YOUR-PRODUCTION-APP-ID",
    };

    return (
      <Layout style={{ overflowX: "visible", background: "#fff" }}>
        <div className="my-profile-box my-profile-setup checkout-payment-block">
          <div className="card-container signup-tab">
            <div className="steps-content align-left mt-0">
              {(reqData && reqData.booking_type === "retail_cart") ||
              booking_type === "event" ? (
                <div
                  className="return-shopping"
                  onClick={
                    booking_type === "event"
                      ? () => {
                          this.props.removeCheckoutData();
                          this.props.history.goBack();
                        }
                      : () => this.props.prevStep()
                  }
                >
                  <ArrowLeftOutlined />
                  Back to Order Summary
                </div>
              ) : (
                <div
                  className="return-shopping"
                  onClick={() => this.props.history.goBack()}
                >
                  {" "}
                  <ArrowLeftOutlined /> Return to Shopping
                </div>
              )}
              <h2>Checkout</h2>
              <h5>Payment Method</h5>
              <Card
                className="profile-content-box"
                bordered={false}
                // title="Payment Selection"
              >
                {traderDetailsResponse !== "" && (
                  <Fragment>
                    <PaymentMethods
                      isSavedCardPayment={isSavedCardPayment}
                      onSelectSavedCard={this.onSelectSavedCard}
                      onChangeCvv={this.onChangeCvv}
                      history={this.props.history}
                      reFetchCards={refetchCards}
                      onRefetchSuccess={() => {
                        this.setState({
                          refetchCards: false,
                        });
                      }}
                    />
                    <div className="another-payment">
                      <h4>Another Payment Method</h4>
                      <Radio.Group
                        onChange={this.paymentMethodOptionChangeHandler}
                        value={selectedPaymentMethod}
                      >
                        <div className="profile-payment-setup">
                          {/* {this.state.traderDetailsResponse.trader_profile.bank && this.state.traderDetailsResponse.trader_profile.bank === 1 &&  */}
                          <div className="paypal-block creditcard">
                            <Row gutter={30}>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Radio
                                  checked={selectedPaymentMethod === "stripe"}
                                  value="stripe"
                                >
                                  <label className="paypal-label">
                                    Credit Card
                                    <span>
                                      <img
                                        src={require("../../../assets/images/icons/visa.svg")}
                                        alt="visa"
                                        width="31"
                                        height="19"
                                      />

                                      <img
                                        src={require("../../../assets/images/icons/mastero.svg")}
                                        alt="mastero"
                                        width="31"
                                        height="19"
                                      />
                                    </span>
                                    <p className="discription">
                                      Safe money transfer using your bank
                                      account. Visa, Maestro, Discover...
                                    </p>
                                  </label>
                                </Radio>

                                <div className="visa-card-icon">
                                  <img
                                    src={require("../../../assets/images/icons/visa-card-icon.jpg")}
                                    alt=""
                                  />
                                </div>
                              </Col>
                            </Row>
                            {selectedPaymentMethod === "stripe" && (
                              <Elements stripe={stripePromise}>
                                <CheckoutForm
                                  customer_name={customer_name}
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
                                />
                              </Elements>
                            )}
                          </div>

                          {/* // } */}
                          {/* {this.state.traderDetailsResponse.accepted_payment_methods.paypal === 1 && */}
                          <div className="paypal-block pr-0 creditcard">
                            <Row gutter={30}>
                              <Col xs={24} sm={24} md={24} lg={23} xl={23}>
                                <Radio
                                  checked={selectedPaymentMethod === "paypal"}
                                  value="paypal"
                                >
                                  <label className="paypal-label">
                                    PayPal{" "}
                                    <p className="discription">
                                      You will be redirected to PayPal website
                                      to complete your purchase securely.
                                    </p>
                                  </label>
                                </Radio>
                                <img
                                  style={{ float: "right" }}
                                  src={require("../../../assets/images/paypal-transparent-icon.png")}
                                  alt="paypal-icon"
                                  className="paypal-icon"
                                />
                              </Col>
                              {/* <Col
                              xs={24}
                              sm={24}
                              md={24}
                              lg={20}
                              xl={4}
                              style={{ paddingRight: "0px" }}
                            > */}
                              {/* <img src={require('../../../assets/images/paypal-icon.jpg')} alt='Fitness' /> */}
                              {/* <Button type="primary" icon={<CheckOutlined />}>
                                                                Verified
                                                            </Button> */}
                              {/* {selectedPaymentMethod !== "" && (
                                <Row
                                  gutter={[0]}
                                  className="pt-433"
                                  // style={{ display: "hidden" }}
                                >
                                  <Col>
                                    {selectedPaymentMethod === "paypal" && (
                                      <PayPalExpressCheckOut
                                        ref={this.paypalButtonRef}
                                        env={"sandbox"}
                                        client={paypalClient}
                                        currency={"INR"}
                                        total={amount}
                                        history={history}
                                        onError={this.onPaypalPaymentError}
                                        onSuccess={this.onPaypalPaymentSuccess}
                                        onCancel={this.onPaypalPaymentCancel}
                                      />
                                    )} */}

                              {/* <Button htmlType="submit" type={'default'} danger size='large' className='text-white' style={{ backgroundColor: '#EE4929' }}>
                                                        Pay
                                                    </Button> */}
                              {/* </Col>
                                </Row>
                              )}
                            </Col> */}
                            </Row>
                          </div>
                          {/* } */}
                          {traderDetailsResponse.trader_profile &&
                            traderDetailsResponse.trader_profile.bank &&
                            traderDetailsResponse.trader_profile.bank === 1 && (
                              <div className="paypal-block googlepay">
                                <Row gutter={30}>
                                  <Col xs={24} sm={24} md={24} lg={20} xl={18}>
                                    <Radio
                                      checked={selectedPaymentMethod === "gpay"}
                                      value="gpay"
                                    >
                                      <label className="paypal-label">
                                        Gpay
                                      </label>
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
                                    lg={20}
                                    xl={6}
                                    style={{ paddingRight: "0px" }}
                                  >
                                    {selectedPaymentMethod === "gpay" && (
                                      <GooglePay
                                        env={"TEST"}
                                        currency={"USD"}
                                        countryCode={"US"}
                                        total={`${amount}`}
                                        onError={this.onGooglePaymentError}
                                        onSuccess={this.onGooglePaymentSuccess}
                                        onCancel={this.onGooglePaymentCancel}
                                        paymentGateway={"stripe"}
                                        paymentGatewayMerchantId={
                                          "pk_test_51H3J9jHhOHLOerXXaHfv1p47eSyBM2kQfOYjNyE2NXXUoFDdW8J2EJoYkBAaEqxdg2L0XxY4qKWvlWsyPt4Ojffm00BmSRbBZD"
                                        }
                                        merchantId={"BCR2DN6T6OZYP6C4"}
                                        merchantName={"Sipl Test Store"}
                                      />
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            )}
                        </div>
                      </Radio.Group>
                    </div>
                    {reqData && reqData.booking_type === "retail_cart" && (
                      <div>
                        <div className="fm-apply-input">
                          <Input
                            onChange={(e) =>
                              this.setState({ promocodeValue: e.target.value })
                            }
                            placeholder={"Enter promotion code"}
                            enterButton="Search"
                            className="shadow-input"
                          />
                          <Button
                            type="primary"
                            className="fm-apply-btn"
                            onClick={this.onClickApplyPromocode}
                          >
                            Apply
                          </Button>
                        </div>
                        {/* <Link onClick={this.removeAppliedPromoCode} className='fm-clear-link'>Clear</Link> */}
                      </div>
                    )}
                  </Fragment>
                )}
                <div>
                  <Button
                    className="button_center ant-btn btn-blue ml-20 ant-btn-default"
                    type="submit"
                    onClick={() => {
                      if (selectedPaymentMethod == "stripe")
                        this.setState({ isClicked: true });
                      this.props.addCheckoutData({
                        state: this.state,
                        props: this.props,
                      });
                      this.onSucessPayment();
                    }}
                  >
                    Pay
                  </Button>
                </div>
              </Card>
            </div>

            <div className="steps-action align-center mb-32"></div>
          </div>
        </div>

        {/* payment complete model for retail */}
        <Modal
          title="Purchase Complete"
          visible={visible}
          footer={false}
          onCancel={() => {
            // this.changeStep(3);
          }}
          className="select-delivery-option payment-status-model"
        >
          <p>
            Your payment of {this.props.history.location.state.amount} was
            processed on {dateFormate1(today)}
            <br />
            Here is a link to &nbsp;
            <a
              style={{
                textDecoration: "underline",
              }}
              onClick={(e) => {
                e.preventDefault();
                //this.changeStep(3);
                this.setState({ receiptModalEventBooking: true });
              }}
            >
              Receipt
            </a>
            &nbsp;for your records
          </p>
          <Button
            className="btn-close"
            onClick={() => {
              this.props.history.push({
                pathname: `/payment-complete`,
                state: {
                  cart_items: this.props.location.state.cart_items,
                  total: amount,
                },
              });
            }}
          >
            Close
          </Button>
        </Modal>

        {/* payment complete model for event booking */}

        {/* receipt model for event booking */}
        {receiptModalEventBooking && (
          <PDFInvoiceModal2
            visible={receiptModalEventBooking}
            onClose={() => {
              this.setState({ receiptModalEventBooking: false });
            }}
          />
        )}

        {/*{this.state.invoiceModel && (
          <ViewReceiptModel
            visible={this.state.invoiceModel}
            invoiceDetails={this.state.invoiceDetails}
            onCancel={() => this.setState({ invoiceModel: false })}
          />
        )}*/}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, retail, common } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : "",
    deliveryAddress: retail && retail.deliveryAddress,
    checkoutData: common.checkoutData,
  };
};
export default connect(mapStateToProps, {
  getTraderDetails,
  getServiceBookingCheckout,
  getSpaServiceRepay,
  placeRestaurantOrder,
  getFitnessServiceBookingCheckout,
  checkoutTraderClassBooking,
  beautyServiceBookingCheckout,
  beautyServiceBookingRepay,
  enableLoading,
  disableLoading,
  placeOrderAPI,
  eventEnquiryCheckout,
  checkoutHandymanCustomerBooking,
  listBookingSavedCards,
  applyPromocode,
  addCheckoutData,
  removeCheckoutData,
  eventjobCheckoutSuccess,
  getBookingIdByEnquiryId,
  getTraderjobIdByQuoteId,
  placeRestaurantoOrderSuccess,
  savedStripeCard,
  listCustomerHandymanBookingsDetail,
})(withRouter(RestaurentCheckout));