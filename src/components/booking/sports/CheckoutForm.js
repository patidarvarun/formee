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

const CheckoutForm =  React.forwardRef((props) => {
  const stripe = useStripe();
  const {
    savedStripeCard,
    buttonRef,
    bookingType,
    userType,
    isClicked,
    selectedPaymentMethod,
    makePayment,
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
  const [ savecard, setSaveCard] = React.useState(false);
  // const buttonRef = useRef();

  useEffect(() => {
    if (isClicked == true && selectedPaymentMethod == "stripe") {
      buttonRef.current.click();
      props.afterClickHandler();
    }
  }, [isClicked]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    // if (!savecard) {
    //   const payload = await stripe.createPaymentMethod({
    //     type: "card",
    //     card: elements.getElement(CardNumberElement),
    //     billing_details: {
    //       name: props.customer_name ? props.customer_name : "user",
    //     },
    //   });
    //   props.getCardtokenDetails(payload);
    // } else if (bookingType === "classified" || bookingType === "tourism") {
    //   const card = elements.getElement(CardNumberElement);
    //   const result = await stripe.createToken(card, { name: nameOnCard });

    //   if (result.error) {
    //   } else {
    //     const Token = result.token.id;
    //     savedStripeCard(Token);
    //   }
    // } else {
      const payload = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: props.customer_name ? props.customer_name : "user",
        },
      });
      props.getCardtokenDetails(payload);
      
      const card = elements.getElement(CardNumberElement);
      const result = await stripe.createToken(card, { name: nameOnCard });
      if (result.error) {
        toastr.error("Error", result.error.message);
      } else {
        const Token = result.token.id;
        let card_id = result.token.card.id
        if(savecard){
          makePayment(Token, card_id);
          let result2 = await stripe.createToken(card, { name: nameOnCard });
          if (result.error) {
            toastr.error("Error", result.error.message);
          } else {
            const Token2 = result2.token.id;
            let card_id2 = result2.token.card.id
            savedStripeCard(Token2, card_id2);
          }
        }else{
          makePayment(Token, card_id)
        }
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
        props.selectedPaymentMethod === "stripe" && (
          <Row>
            <Col>
            <Button
                htmlType="submit"
                type={"ghost"}
                danger
                size="large"
                disabled={!stripe}
                // className="text-white purpel-medium-btn"
                style={{display: "none"}}
                ref={buttonRef}
              >
                {!props.isAnotherPay
                  ? bookingType === "tourism"
                    ? "Add Card"
                    : "Pay"
                  : ""}
                {props.isAnotherPay && "Add Card"}
              </Button>
            <Checkbox onChange={() => setSaveCard(!savecard)}>Remember for future purchases</Checkbox>
            </Col>
          </Row>
        )}
    </form>
  );
});

export default CheckoutForm;
