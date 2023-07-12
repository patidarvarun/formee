import React, { Component, Fragment, useRef } from "react";
import { connect } from "react-redux";
import "./style.css";
import {
  sendFormmeInvoice,
  generateInvoice,
  enableLoading,
  disableLoading,
  getBookingIdByEnquiryId,
} from "../../../actions";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
class ResDocs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      selectedPaymentMethod: "",
      stripePaymentGateWayResponse: "",
      invoiceDetails: "",
      orderInfo: {},
      promocodeValue: "",
      appliedPromoCode: "",
      promoCodeDiscount: "",
      isClicked: false,
      visible: false,
      resDetails: this.props.isViewInvoice
        ? this.props
        : this.props.checkoutData.state.enquiryBooking,
    };
  }

  render() {
    console.log("propssss", this.props);

    return (
      <TransformWrapper initialScale={1}>
        {({ zoomIn, zoomOut, ...rest }) => (
          <React.Fragment>
            <TransformComponent>
              <div id="rootClass" className="invoice-pdf">
                <span className="text-main">
                  <h3>Invoice</h3>
                  <h1>Your Booking</h1>
                </span>
                <div className="textleft">
                  <div className="heading">
                    <span>
                      <h5>Invoice No </h5>
                      <p>{
                          this.props.checkoutData.props.history.location.state
                            .cart_items[0].elements.id
                        }</p>
                    </span>
                    <span>
                      <h5>Order No </h5>
                      <p>{
                          this.props.checkoutData.props.history.location.state
                            .cart_items[0].elements.id
                        }</p>
                    </span>
                    <span>
                      <h5>Order Date </h5>
                      <p>
                        {" "}
                        {
                          this.props.checkoutData.props.history.location.state
                            .cart_items[0].elements.created_at
                        }
                      </p>
                    </span>
                    <span>
                      <h5>Customer Name </h5>

                      <p> {this.props.checkoutData.props.loggedInUser.name}</p>
                    </span>
                    <span>
                      <h5>Customer Email </h5>

                      <p>{this.props.checkoutData.props.loggedInUser.email}</p>
                    </span>
                    <span>
                      <h5>Customer Phone </h5>
                      <p>
                        {this.props.checkoutData.props.loggedInUser.mobile_no}
                      </p>
                    </span>
                    <span>
                      <h5>Billing Address </h5>
                      <p>{this.props.checkoutData.props.deliveryAddress}</p>
                    </span>
                  </div>
                </div>
                <br />

                <h4 className="subHeading">Order Details:</h4>
                <div className="textleft">
                  <span className="heading">
                    {this.props.checkoutData.props.history.location.state.cart_items.map(
                      (data) => {
                        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA", data);
                        let aaa = 0;
                        return (
                          <Fragment>
                            <span>
                              <h5>Price </h5><p>{data.elements.menu_items.price}</p>
                            </span>
                            <span>
                              <h5>
                                Choice Preparations</h5>
                                <p>{
                                  data.elements.menu_choice_of_preparations
                                    .price
                                }
                              </p>
                            </span>
                            <br />
                            <span>
                              <h5>Item Name</h5><p>{data.description}</p>
                            </span>
                            <br />
                            <span style={{borderBottom:"1px solid #eee", marginBottom:"10px",}}>
                              <h5>QTY</h5><p>{data.elements.quantity}</p>
                            </span>
                            <br />{" "}
                          </Fragment>
                        );
                      }
                    )}
                     <span>
                      <h5>
                        Payment Method</h5>
                        <p> {this.props.checkoutData.state.paymentMethodsKey}
                      </p>
                    </span>
                  </span>
                </div>
                <div className="netcharge">
                  <h3>Total</h3>
                  <p>
                    AU$
                    { this.props.checkoutData.props.history.location.state.amount}
                   {console.log( this.props.checkoutData.props.history.location.state.amount,"amonut",this.props)}
                  </p>
                </div>
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
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
  sendFormmeInvoice,
  generateInvoice,
  enableLoading,
  disableLoading,
  getBookingIdByEnquiryId,
})(ResDocs);