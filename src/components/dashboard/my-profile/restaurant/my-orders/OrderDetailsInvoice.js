import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  Layout,
  Typography,
  Row,
  Col,
  Form,
  Carousel,
  Input,
  Select,
  Checkbox,
  Button,
  Rate,
  Modal,
  Dropdown,
  Divider,
  Descriptions,
  Anchor,
  Radio,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getBeautyServiceBooking,
  cancelFitnessServiceBooking,
  cancelBeautyServiceBooking,
  getTraderMonthWellbeingBooking,
  updateBeautyServiceBooking,
  updateBeautyServiceBookingFitness,
  showCustomerClass,
} from "../../../../../actions";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { DEFAULT_IMAGE_CARD } from "../../../../../config/Config";
import { Link } from "react-router-dom";
import { getPaymentOrder } from "../../../../../actions/retail/index";
import "./mybooking.less";
import "../../../../booking/booking.less";
import "../../userdetail.less";
const { Title } = Typography;

class OrderDetailsInvoice extends React.Component {
  constructor(props) {
    console.log(props, "propssssssss");
    super(props);
    this.state = {
      orderDetails: [],
    };
  }

  componentDidMount() {
    this.props.enableLoading();
    const order_id = new URLSearchParams(this.props.location.search).get(
      "order_id"
    );
    const user_id = new URLSearchParams(this.props.location.search).get(
      "user_id"
    );

    if (order_id !== null) {
      const obj = {
        order_id,
        user_id,
      };
      this.props.getPaymentOrder(obj, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          this.setState({ orderDetails: res.data.data });
        } else {
        }
      });
    }
  }

  render() {
    const { orderDetails } = this.state;
    const { orders, order_detail_product, order_detail_seller } =
      orderDetails.length && orderDetails[0];
    console.log("ids", orderDetails);
    return (
      <div>
        <span className="invoice-back">
          <span className="back-center">
            <Link
              to={`/my-orders/restaurant-order-detail?user_id=${
                orders && orders.user_id
              }&order_id=${orderDetails.length && orderDetails[0].order_id}`}
              className="backtoprofile"
            >
              <img
                src={require("./icon/back-arrow.png")}
                alt="edit"
                className="pr-10"
              />{" "}
              Back
            </Link>
          </span>
        </span>
        <div className="invoice-box">
          <div className="my-new-order-block orderdetail">
            <div className="top-head-section">
              <div className="left">
                <Title level={2} className="pl-0">
                  INVOICE
                </Title>
                <div className="print-share">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                  >
                    <img src={require("./icon/printer.png")} alt="edit" />
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                  >
                    <img src={require("./icon/download.png")} alt="edit" />
                  </button>
                </div>
              </div>
            </div>
            <Row className="order-data">
              <div className="invoice-order-detail">
                <ul>
                  <li>
                    <strong>Fromee Order No.:</strong> #
                    {orders && orders.formee_order_number}
                  </li>
                  <li>
                    <strong>Order Placed</strong>{" "}
                    {orders && moment(orders.created_at).format("DD MMM YYYY")}
                  </li>
                  <li>
                    <strong>Order Total</strong>{" "}
                    {orderDetails.length &&
                      parseFloat(orders.order_grandtotal) +
                        parseFloat(orders.order_shipping)}{" "}
                  </li>
                </ul>
                <div>
                  <h2> Invoice</h2>
                  <h3> {orders && orders.invoice_number} </h3>
                </div>
              </div>
              <Col className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24 ">
                <div className="delivery-date">
                  <h3>
                    Delivered on{" "}
                    {orders &&
                      moment(orders.delivery_date).format("DD MMM YYYY")}
                  </h3>
                </div>
                <table className="delivered-table">
                  <thead>
                    <tr>
                      <td>Item (s)</td>
                      <td className="qty-c">Quanity</td>
                      <td className="qty-c">Unit Price</td>
                      <td>
                        <strong>Amount AUD</strong>
                      </td>
                    </tr>
                  </thead>
                  {orderDetails &&
                    orderDetails.map((val, i) => {
                      return (
                        <tbody className="">
                          <tr>
                            <td>
                              <div className="">
                                <div className="content-detail">
                                  <h3> {val.item_name} </h3>

                                  <div className="small-dec">
                                    <span className="">
                                      <span>Sold By</span>
                                      {val.order_detail_seller &&
                                        val.order_detail_seller.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="qty-c">{val.item_qty}</td>
                            <td className="qty-c">{val.item_price}</td>
                            <td>{val.item_total_amt}</td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>

                <Col className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24 pl-24">
                  <div className="ordersumm">
                    <div className="ordersumm-bottom">
                      <div>
                        {" "}
                        <span>Item(s) Subtotal</span>
                        <span>
                          {orderDetails.length && orders.order_grandtotal}{" "}
                        </span>{" "}
                      </div>
                      <div>
                        {" "}
                        <span>Shipping</span>
                        <span>
                          {orderDetails.length && orders.order_shipping}
                        </span>{" "}
                      </div>
                      <div>
                        {" "}
                        <span>Taxes</span>
                        <span>5.00</span>{" "}
                      </div>
                      <div className="ordertotal">
                        <span>Amount Due</span>
                        <span>
                          {orderDetails.length &&
                            parseFloat(orders.order_grandtotal) +
                              parseFloat(orders.order_shipping)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>

                <div className="order-data-left-top left-bottom">
                  <div className="shipping-in">
                    <h3>Shiping Information</h3>
                    <span>
                      {orders && orders.customer_fname}{" "}
                      {orders && orders.customer_lname} <br />{" "}
                      {orders && orders.customer_address1}
                    </span>
                  </div>
                  <div className="payment">
                    <h3>Payment Method </h3>
                    <span>
                      <p> {orders && orders.payment_method} </p>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  getPaymentOrder,
  enableLoading,
  disableLoading,
})(OrderDetailsInvoice);
