import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  Col,
  Input,
  Layout,
  Row,
  Typography,
  Button,
  Card,
  Tabs,
  Form,
  Select,
  Alert,
  Statistic,
  Divider,
  Timeline,
  Modal,
} from "antd";
import { ClockCircleOutlined, CheckCircleFilled } from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getUserRestaurantCurrentOrders,
  getUserRestaurantPastOrders,
  getOrderDetailsById,
  getCancelRestaurantOrder,
} from "../../../../../actions";
import AppSidebar from "../../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import "./mybooking.less";
import moment from "moment";
import { CURRENT_ORDER, ORDER_DETAIL } from "./static_response";
import { toastr } from "react-redux-toastr";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../../config/FormValidation";

const { Countdown } = Statistic;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: "align-center pt-20",
};

let TotalCartItem = 0;
let cartTotalAmount = 0;

class TrackUserRestaurantOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: "",
      orderID: "",
      displayCancelOrderModal: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const parameter = this.props.match.params;
    let orderId = parameter.orderId;
    this.displayOrderDetails(orderId);
  }

  displayOrderDetails = (orderID) => {
    
    TotalCartItem = 0;
    cartTotalAmount = 0;
    this.props.enableLoading();
    this.setState({ selectedOrderId: orderID }, () => {
      
      this.props.getOrderDetailsById(orderID, (response) => {
        this.props.disableLoading();

        if (response.status === 200) {
          //this.setState({ orderDetails:   ORDER_DETAIL });
          this.setState({ orderDetails: response.data.data.order_detail });
        } else {
          toastr.error("Error", "Something went wrong to get order details.");
        }
      });
    });
  };

  renderOrderCartItems = (orderDetails) => {
    TotalCartItem = 0;
    cartTotalAmount = 0;
    if (orderDetails.order_detail && orderDetails.order_detail.length > 0) {
      return (
        <div className="order-detail-list">
          <ul className="flex-container wrap">
            {orderDetails.order_detail.map((orderCartItems, i) => {
              return orderCartItems.cart_item.map((cartItems, idx) => {
                TotalCartItem++;
                cartTotalAmount =
                  parseFloat(cartTotalAmount) + parseFloat(cartItems.price);
                return (
                  <li>
                    <div className="appointments-label">
                      {cartItems.quantity}
                    </div>
                    <div className="appointments-label">
                      {cartItems.menu_item_name}
                    </div>
                    <div className="appointments-time">${cartItems.price}</div>
                  </li>
                );
              });
            })}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="error-box">
          <Alert message="No Cart Item(s)" type="error" />
        </div>
      );
    }
  };

  getStatusName = (orderStatus) => {
    switch (orderStatus) {
      case "order-received":
        return "Order Received";
      case "confirmed":
        return "Confirmed";
      case "in-the-kitchen":
        return "In The Kitchen";
      case "on-the-way":
        return "On The Way";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Order Received";
    }
  };

  hideCancelOrderModal = () => {
    this.setState({ displayCancelOrderModal: false });
  };

  displayCancelOrderModal = () => {
    this.setState({ displayCancelOrderModal: true });
  };

  onSubmitCancelOrderForm = (values) => {
    let reqData = {
      order_id: this.state.orderDetails.id,
      reason: values.reason,
    };

    this.props.enableLoading();
    this.props.getCancelRestaurantOrder(reqData, (response) => {
      this.props.disableLoading();
      if (response.status === 200) {
        this.setState({ displayCancelOrderModal: false });
      } else {
        toastr.error("Error", "Something went wrong to cancel the order.");
      }
    });
  };

  getMilliseconds = (m) => m * 60 * 1000;

  renderTimeCounter = (date) => {
    let currentTimeStamp = moment(moment().format("YYYY-MM-DD HH:mm:ss"));
    var orderCreatedTimeStamp = moment(date);
    // Calculate min difference in created time and current time
    let calculatedTimeDiffInMinute = currentTimeStamp.diff(
      moment(orderCreatedTimeStamp),
      "minutes"
    );
    let miliSecond = this.getMilliseconds(calculatedTimeDiffInMinute);
    return (
      <Fragment>
        {" "}
        <ClockCircleOutlined />{" "}
        <Countdown value={Date.now() + miliSecond} format="HH:mm:ss" />{" "}
      </Fragment>
    );
  };

  renderTimeLaps = (orderDetails, item) => {
    if (
      item.status === "order-received" &&
      item.changed_at !== null &&
      orderDetails.confirmed === "" &&
      orderDetails.delivered === "" &&
      orderDetails.cancelled === ""
    ) {
      return this.renderTimeCounter(item.changed_at);
    } else if (
      item.status === "confirmed" &&
      item.changed_at !== null &&
      orderDetails["in-the-kitchen"] === "" &&
      orderDetails.delivered === "" &&
      orderDetails.cancelled === ""
    ) {
      return this.renderTimeCounter(item.changed_at);
    } else if (
      item.status === "in-the-kitchen" &&
      item.changed_at !== null &&
      orderDetails["on-the-way"] === "" &&
      orderDetails.delivered === "" &&
      orderDetails.cancelled === ""
    ) {
      return this.renderTimeCounter(item.changed_at);
    } else if (
      item.status === "on-the-way" &&
      item.changed_at !== null &&
      orderDetails.delivered === "" &&
      orderDetails.cancelled === ""
    ) {
      return this.renderTimeCounter(item.changed_at);
    }
  };

  renderTotalAmount = (amount, ship_cost, order_gst_amount) => {
    let totalIncDeliveryFee =
      parseFloat(amount) + parseFloat(ship_cost) + parseFloat(order_gst_amount);
    return totalIncDeliveryFee.toFixed(2);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { orderDetails } = this.state;
    console.log(orderDetails,"orderDetail vendor")
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div    
              className="my-profile-box view-class-tab trackorder-page"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Track Order</Title>
                  </div>
                  <div className="right"></div>
                </div>
                <div className="sub-head-section">
                  <Text>&nbsp;</Text>
                </div>
                <div className="pf-vend-restau-myodr box-shdw-none  profile-content-box shadow-none pf-vend-spa-booking user-restaurents-order-block">
                  {orderDetails !== "" && (
                    <Row gutter={30}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Card
                          className="profile-content-shadow-box track-order-left-box"
                          bordered={false}
                          title=""
                        >
                          <div className="eta-track">
                            {" "}
                            <ClockCircleOutlined /> ETA:{" "}
                            {orderDetails.estimated_time
                              ? `${orderDetails.estimated_time} Min`
                              : "0:00"}{" "}
                          </div>
                          <div className="trakorder-timeline">
                            <Timeline>
                              {orderDetails !== "" &&
                                orderDetails.all_status.length > 0 &&
                                orderDetails.all_status.map((item, idx) => {
                                  console.log(item,"orderdetail item")
                                  return (
                                    <Timeline.Item
                                      color="green"
                                      dot={
                                        item.changed_at !== null ? (
                                          <CheckCircleFilled
                                            style={{ fontSize: 27 }}
                                          />
                                        ) : null
                                      }
                                    >
                                      <span>
                                        {this.getStatusName(item.status)}
                                      </span>
                                      {item.changed_at !== null && (
                                        <span>
                                          {" "}
                                          {moment(
                                            item.changed_at,
                                            "YYYY-MM-DD hh:mm:ss"
                                          ).format("hh:mm A")}{" "}
                                        </span>
                                      )}
                                      {item.status === "order-received" && (
                                        <span>
                                          {" "}
                                          <Button
                                            onClick={() => {
                                              this.displayCancelOrderModal();
                                            }}
                                            className="checkout-btn"
                                          >
                                            Cancel
                                          </Button>
                                        </span>
                                      )}
                                      <div className="eta-track">
                                        {" "}
                                        {this.renderTimeLaps(
                                          orderDetails,
                                          item
                                        )}
                                      </div>
                                    </Timeline.Item>
                                  );
                                })}
                            </Timeline>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div className="your-order-block">
                          <h2>Your order</h2>
                          <div className="profile-name-pic-detail">
                            <div>To</div>
                            <div className="profile-pic">
                              <img
                                alt="test"
                                src={
                                  orderDetails.restaurant_image
                                    ? orderDetails.restaurant_image
                                    : require("../../../../../assets/images/avatar3.png")
                                }
                              />
                            </div>
                            <div className="profile-name">
                              {orderDetails.restaurant_name}
                            </div>
                          </div>
                          <Divider />
                          {this.renderOrderCartItems(orderDetails)}
                          <Divider className="mb-15" />
                          <div className="order-total">
                            <div className="item">Item({TotalCartItem})</div>
                            <div className="amount">${cartTotalAmount}</div>
                          </div>
                          <div className="order-total">
                            <div className="item">Fee</div>
                            <div className="amount">
                              ${orderDetails.ship_cost}
                            </div>
                          </div>

                          <div className="order-total">
                            <div className="item">GST</div>
                            <div className="amount">
                              ${orderDetails.order_gst_amount}
                            </div>
                          </div>

                          
                          <div className="order-total">
                            <div className="item total">Total</div>
                            <div className="amount total-amount">
                              $
                              {this.renderTotalAmount(
                                cartTotalAmount,
                                orderDetails.ship_cost,
                                orderDetails.order_gst_amount
                              )}
                              <span>Taxes & fees included</span>
                            </div>
                          </div>
                        </div>

                        {/* <div className="appointments-slot">
                          <div className="appointments-heading">
                            <div className="date">Your Order</div>
                          </div>
                          <div className="order-profile">
                            <span> To </span>
                            <div className="profile-pic">
                              <img alt="test" src={orderDetails.restaurant_image ? orderDetails.restaurant_image : require('../../../../../assets/images/avatar3.png')} />
                            </div>
                            <div className="profile-name">
                              {orderDetails.restaurant_name}
                            </div>
                          </div>
                          <div className="appointments-body">
                            {this.renderOrderCartItems(orderDetails)}
                          </div>
                          <Divider />
                          <ul className="flex-container wrap">
                            <li>
                              item ${TotalCartItem}
                            </li>
                            <li>
                              Fee ${orderDetails.ship_cost}
                            </li>
                            <li>
                              Total ${cartTotalAmount + orderDetails.ship_cost}
                            </li>
                          </ul>
                        </div> */}
                        <div className="your-order-block delivery-details-block">
                          <h2>Delivery Details</h2>
                          <Divider />
                          <p>
                            Order has beed received. The restaurant’s rider will
                            be at your place around
                          </p>
                          <div className="hour-digit">
                            {orderDetails.time_of_delivery}
                            {console.log("orderDetails", orderDetails)}
                          </div>
                          <div className="profile-info">
                            <div className="title">Name</div>
                            <div className="detail">{orderDetails.name}</div>
                            <div className="title">Phone</div>
                            <div className="detail">
                              {orderDetails.phone_number}
                            </div>
                            <div className="title">Address</div>
                            <div className="detail">
                              {orderDetails.customer_address1}
                              {orderDetails.customer_address2
                                ? orderDetails.customer_address2
                                : ""}
                              , {orderDetails.customer_city} ,{" "}
                              {orderDetails.customer_state},{" "}
                              {orderDetails.customer_country}{" "}
                              {orderDetails.customer_postcode}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}
                  <Modal
                    title="Cancel Order"
                    visible={this.state.displayCancelOrderModal}
                    className={"custom-modal style1"}
                    footer={false}
                    onCancel={this.hideCancelOrderModal}
                    destroyOnClose={true}
                  >
                    <div className="padding">
                      <Form {...layout} onFinish={this.onSubmitCancelOrderForm}>
                        <Form.Item
                          label="Cancellation reason"
                          name="reason"
                          rules={[
                            required(""),
                            whiteSpace("Message"),
                            maxLengthC(100),
                          ]}
                        >
                          <TextArea
                            rows={4}
                            placeholder={"Write your message here"}
                            className="shadow-input"
                          />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                          <Button type="default" htmlType="submit">
                            Send
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
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
  enableLoading,
  disableLoading,
  getUserRestaurantCurrentOrders,
  getUserRestaurantPastOrders,
  getOrderDetailsById,
  getCancelRestaurantOrder,
})(TrackUserRestaurantOrders);
