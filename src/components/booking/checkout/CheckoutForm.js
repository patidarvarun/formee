import React, { useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../config/localization";
import { MESSAGES } from "../../../config/Message";
import { Button, Row, Col, Input, Typography, Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Icon from "../../customIcons/customIcons";
import { Checkbox } from "antd";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";

//import useResponsiveFontSize from "./FontSizes";
const { Title, Text } = Typography;

function onChange(e) {}
const useOptions = () => {
  const fontSize = 16;
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const {
    savedStripeCard,
    bookingType,
    userType,
    isClicked,
    selectedPaymentMethod,
  } = props;
  const elements = useElements();
  const options = useOptions();
  const [cardError, setCardError] = React.useState("");
  const [showCardTick, setShowCardTick] = React.useState(false);
  const [cardExpiryDateError, setcardExpiryDateError] = React.useState("");
  const [expiryCheckTick, setExpiryCheckTick] = React.useState(false);
  const [cardCvsError, setcardCvsError] = React.useState("");
  const [cvvCheckTick, setCvvCheckTick] = React.useState(false);
  const [nameOnCard, setNameOnCard] = React.useState("");
  const [nameCheckTick, setNameCheckTick] = React.useState(false);
  const buttonRef = useRef();

  useEffect(() => {
    if (isClicked == true && selectedPaymentMethod == "stripe") {
      buttonRef.current.click();
      props.afterClickHandler();
    }
  }, [isClicked]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // debugger;
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    if (bookingType === "retail" || bookingType === "retail_cart") {
      const payload = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: props.customer_name ? props.customer_name : "user",
        },
      });
      props.getCardtokenDetails(payload);
    } else if (bookingType === "classified" || bookingType === "tourism") {
      const card = elements.getElement(CardNumberElement);
      const result = await stripe.createToken(card, { name: nameOnCard });

      if (result.error) {
        // Display result.error.message in your UI.
        toastr.error(langs.error, result.error.message);
      } else {
        // The setup has succeeded. Display a success message and send
        // result.setupIntent.payment_method to your server to save the
        // card to a Customer
        const Token = result.token.id;
        // savedStripeCard(Token);
        savedStripeCard(Token, (res) => {
          if(res.stripe_customer_id){
            toastr.success(langs.success, "Card Saved");
          }
        })
        // props.getCardtokenDetails();
      }
    } else {
      const payload = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: props.customer_name ? props.customer_name : "user",
        },
      });
      // debugger;
      props.getCardtokenDetails(payload);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="stripe-box"
      id="submit-checkout-form"
    >
      <Row gutter={[20, 12]} className="card-number-box">
        <Col span={24}>
          <label>Card Number</label>
          <CardNumberElement
            options={options}
            required
            //prefix={<Avatar size={20} style={{ backgroundColor: '#E5EAEE' }}><span style={{ position: 'relative', top: -1 }}><Icon icon='user' size='11' /></span></Avatar>}
            onReady={(event) => {
              //
              //
            }}
            onChange={(event) => {
              if (event.error && event.error.type === "validation_error") {
                // We want to only show the errors in every field that's why we stop the
                setCardError(event.error.message);
                return;
              } else {
                setCardError("");
              }
              if (!event.error && event.complete) {
                setShowCardTick(true);
              } else {
                setShowCardTick(false);
              }
            }}
            onBlur={() => {
              //
            }}
            onFocus={() => {
              //
            }}
            onError={(err) => {
              //
            }}
          />
          <img
            className="cart-payment-card-outline"
            src={require("../../../assets/images/icons/cart-payment-card-outline.jpg")}
            alt=""
          />
          <div className="check-uncheck-box">
            {showCardTick && (
              <img
                className="input-status green-right"
                src={require("../../../assets/images/icons/check-green-circle.svg")}
                alt="check-green-circle"
              />
            )}
            {cardError && (
              <img
                className="input-status red-cross"
                src={require("../../../assets/images/icons/red-cross-circle.png")}
                alt="cross-red-circle"
              />
            )}
          </div>
          {props.selectedPaymentMethod === "stripe" && (
            <span className="error">{cardError}</span>
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={14} className="name-on-card-box">
          <label>Name on Card</label>
          <Input
            name="name"
            required
            size="large"
            className="stripeElement"
            placeholder="Name on card"
            onChange={(e) => {
              setNameOnCard(e.target.value);
              if (e.target.value) {
                setNameCheckTick(true);
              } else {
                setNameCheckTick(false);
              }
            }}
            //prefix={<Avatar size={20} style={{ backgroundColor: '#E5EAEE' }}><span style={{ position: 'relative', top: -1 }}><Icon icon='user' size='11' /></span></Avatar>}
          />
          {nameCheckTick && (
            <div className="check-uncheck-box">
              <img
                className="input-status green-right"
                src={require("../../../assets/images/icons/check-green-circle.svg")}
                alt="check-green-circle"
              />
              {/* <img
                className="input-status red-cross"
                src={require("../../../assets/images/icons/red-cross-circle.png")}
                alt="cross-red-circle"
              /> */}
            </div>
          )}
        </Col>
        <Col span={5} className="expiry-date-box">
          <label>Expiry Date </label>
          <CardExpiryElement
            options={options}
            onReady={() => {
              //
            }}
            onChange={(event) => {
              if (event.error && event.error.type === "validation_error") {
                setcardExpiryDateError(event.error.message);
                return;
              } else {
                setcardExpiryDateError("");
              }
              if (!event.error && event.complete) {
                setExpiryCheckTick(true);
              } else {
                setExpiryCheckTick(false);
              }
            }}
            onBlur={() => {
              //
            }}
            onFocus={() => {
              //
            }}
          />
          {props.selectedPaymentMethod === "stripe" && (
            <span className="error">{cardExpiryDateError}</span>
          )}
          <div className="check-uncheck-box">
            {expiryCheckTick && (
              <img
                className="input-status green-right"
                src={require("../../../assets/images/icons/check-green-circle.svg")}
                alt="check-green-circle"
              />
            )}
            {cardExpiryDateError && (
              <img
                className="input-status red-cross"
                src={require("../../../assets/images/icons/red-cross-circle.png")}
                alt="cross-red-circle"
              />
            )}
          </div>
        </Col>
        <Col span={5} className="cvc-input-box">
          <div>
            <label>CVV</label>
            <CardCvcElement
              options={options}
              onReady={() => {
                //
              }}
              onChange={(event) => {
                if (event.error && event.error.type === "validation_error") {
                  setcardCvsError(event.error.message);
                  return;
                } else {
                  setcardCvsError("");
                }
                if (!event.error && event.complete) {
                  setCvvCheckTick(true);
                } else {
                  setCvvCheckTick(false);
                }
              }}
              onBlur={() => {
                //
              }}
              onFocus={() => {
                //
              }}
            />
            <Tooltip title="Enter the CVC number" className={"cvc-tooltip"}>
              <img
                className="cart-payment-question-outline"
                src={require("../../../assets/images/icons/cart-payment-question-outline.jpg")}
                alt=""
              />
            </Tooltip>
          </div>
          {props.selectedPaymentMethod === "stripe" && (
            <span className="error">{cardCvsError}</span>
          )}
          <div className="check-uncheck-box">
            {cvvCheckTick && (
              <img
                className="input-status green-right"
                src={require("../../../assets/images/icons/check-green-circle.svg")}
                alt="check-green-circle"
              />
            )}
            {cardCvsError && (
              <img
                className="input-status red-cross"
                src={require("../../../assets/images/icons/red-cross-circle.png")}
                alt="cross-red-circle"
              />
            )}
          </div>
        </Col>
      </Row>

      {props.selectedPaymentMethod &&
        props.selectedPaymentMethod === "stripe" &&
        userType !== "handyman" && (
          <Row>
            <Col>
              {/* {(bookingType === "retail" || bookingType === "retail_cart") && ( */}
              <Button
                htmlType="submit"
                type={"default"}
                danger
                size="large"
                disabled={!stripe}
                className="text-white purpel-medium-btn"
                ref={buttonRef}
              >
                {!props.isAnotherPay
                  ? bookingType === "tourism"
                    ? "Add Card"
                    : "Pay"
                  : ""}
                {props.isAnotherPay && "Add Card"}
              </Button>
              {/* )} */}
              {/* <div className="pay-opt-remember">
                        <Checkbox onChange={onChange}>Remember for future purchases</Checkbox>
                    </div> */}
            </Col>
          </Row>
        )}
    </form>
  );
};

export default CheckoutForm;
