import React, { Fragment } from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Col,
  Input,
  Layout,
  Avatar,
  Row,
  Typography,
  Button,
  Menu,
  Dropdown,
  Pagination,
  Card,
  Tabs,
  Form,
  Select,
  Rate,
  Alert,
  Calendar,
  Statistic,
  Divider,
  Modal,
} from "antd";
import { ClockCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getUserRestaurantCurrentOrders,
  getUserRestaurantPastOrders,
  getOrderDetailsById,
  getRestaurantOrdersForVendor,
  getCancelRestaurantOrder,
  acceptRestaurantOrder,
  updateRestaurantOrderStatus,
  getOrderDelete,
} from "../../../../../actions";
import AppSidebar from "../../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
//import './mybooking.less';
import Icon from "../../../../customIcons/customIcons";
import { PAGE_SIZE } from "../../../../../config/Config";
import { langs } from "../../../../../config/localization";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { RESTAURANT_ORDER_LIST } from "./staticrresponse";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../../config/FormValidation";
import {
  getOrderTypeName,
  getOrderStatus,
  getStatusColor,
} from "../../../../../config/Helper";

import "./profile-vendor-restaurant.less";

import Countdown from "react-countdown";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;
let TotalCartItem = 0;
let cartTotalAmount = 0;
// Pagination
function paginationItemRender(current, type, originalElement) {
  if (type === "prev") {
    return (
      <a>
        <Icon icon="arrow-left" size="14" className="icon" /> Back
      </a>
    );
  }
  if (type === "next") {
    return (
      <a>
        Next <Icon icon="arrow-right" size="14" className="icon" />
      </a>
    );
  }
  return originalElement;
}

function paginationItemRenderHistory(current, type, originalElement) {
  if (type === "prev") {
    return (
      <a>
        <Icon icon="arrow-left" size="14" className="icon" /> Back
      </a>
    );
  }
  if (type === "next") {
    return (
      <a>
        Next <Icon icon="arrow-right" size="14" className="icon" />
      </a>
    );
  }
  return originalElement;
}

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

const ORDER_TYPE_DELIVERY_STATUS = [
  { label: "Confirmed", value: "confirmed" },
  { label: "In the Kitchen", value: "in-the-kitchen" },
  { label: "On the way", value: "on-the-way" },
  { label: "Being Delivered", value: "delivered" },
];

const ORDER_TYPE_PICKUP_STATUS = [
  { label: "Confirmed", value: "confirmed" },
  { label: "In the Kitchen", value: "in-the-kitchen" },
  { label: "Ready for pickup", value: "food-is-ready-for-pickup" },
  // { label: "Complete", value: "complete" },
];

class RestaurantVendorOrdersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrdersList: [],
      onGoingOrdersList: [],
      deliveryOrdersList: [],
      pastOrdersList: [],
      orderType: "new_orders",
      page: "1",
      order: "desc",
      page_size: "10",
      customer_id: "",
      key: "1",
      defaultCurrent: 1,
      customerCalenderBookingList: [],
      totalRecordUserPastOrders: 0,
      orderDetails: "",
      selectedOrderId: "",
      isVisiableAcceptOrder: false,
      isVisiableCancelOrder: false,
      isVisiableUpdateOrderStatus: false,
      deliveryOption: "",
      filterdata: "",
      dropdown: false,
      orderType: false,
      selectedOrderUpdate: "",
      total:"",
      list:[],
      standard_ETA:"",
        };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    // this.getRestaurantOrders(this.state.orderType);
    this.getRestaurantOrders("new_orders");
  }

  onTabChange = (key, type) => {
    this.setState({ key: key, selectedOrderId: "", orderDetails: "" }, () => {
      if (key == "1") {
        this.getRestaurantOrders("new_orders");
      } else if (key == "2") {
        this.getRestaurantOrders("on_going");
      } else if (key == "3") {
        this.getRestaurantOrders("delivery");
      } else if (key == "4") {
        this.getRestaurantOrders("past_orders");
      }
    });
  };

  getRestaurantOrders = (orderType) => {
    this.props.enableLoading();
    this.props.getRestaurantOrdersForVendor(orderType, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders

        if (orderType == "new_orders") {
          this.setState({ newOrdersList: ordersArray,list:ordersArray,total:res.data.data.total_count,standard_ETA:res.data.data.standard_ETA });
        } else if (orderType == "on_going") {
          this.setState({ onGoingOrdersList: ordersArray,list:ordersArray, orderType: true ,total:res.data.data.total_count});
        } else if (orderType == "delivery") {
          this.setState({ deliveryOrdersList: ordersArray,list:ordersArray,total:res.data.data.total_count });
        } else if (orderType == "past_orders") {
          this.setState({ pastOrdersList: ordersArray,total:res.data.data.total_count });
        }
      }
    });
  };

  getDateFromHours = (bookingDate, startTime) => {
    startTime = startTime.split(":");
    let now = new Date(bookingDate);
    let dateTimeSting = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...startTime
    );
    return dateTimeSting;
  };

  timestampToString = (date, time, suffix) => {
    let dateString = this.getDateFromHours(date, time);
    let diffTime = (new Date().getTime() - (dateString || 0)) / 1000;
    if (diffTime < 60) {
      diffTime = "Just now";
    } else if (diffTime > 60 && diffTime < 3600) {
      diffTime =
        Math.floor(diffTime / 60) +
        (Math.floor(diffTime / 60) > 1
          ? suffix
            ? " minutes"
            : "m"
          : suffix
          ? " minute"
          : "m") +
        (suffix ? " ago" : "");
    } else if (diffTime > 3600 && diffTime / 3600 < 24) {
      diffTime =
        Math.floor(diffTime / 3600) +
        (Math.floor(diffTime / 3600) > 1
          ? suffix
            ? " hours"
            : "h"
          : suffix
          ? " hour"
          : "h") +
        (suffix ? " ago" : "");
    } else if (diffTime > 86400 && diffTime / 86400 < 30) {
      diffTime =
        Math.floor(diffTime / 86400) +
        (Math.floor(diffTime / 86400) > 1
          ? suffix
            ? " days"
            : "d"
          : suffix
          ? " day"
          : "d") +
        (suffix ? " ago" : "");
    } else {
      diffTime = moment(new Date(dateString || 0).toDateString()).format(
        "DD/MM/YYYY"
      );
    }
    return diffTime;
  };

  displayOrderDetails = (orderID) => {
    const { selectedOrderId } = this.state;
    console.log("SelectOrderId", selectedOrderId);
    console.log("orderId", orderID);
    TotalCartItem = 0;
    cartTotalAmount = 0;
    if (selectedOrderId === orderID) {
      this.setState({ selectedOrderId: "", orderDetails: "" });
    } else {
      this.props.enableLoading();
      this.setState({ selectedOrderId: orderID }, () => {
        this.props.getOrderDetailsById(orderID, (response) => {
          this.props.disableLoading();

          if (response.status === 200) {
            this.setState({ orderDetails: response.data.data.order_detail });
            console.log("Order Details", this.state.orderDetails);
          } else {
            toastr.error("Error", "Something went wrong to get order details.");
          }
        });
      });
    }
  };

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span />;
    } else {
      // Render a countdown
      return (
        <span>
          {" "}
          <img
            src={require("../../../../../assets/images/icons/waiting-red-icon.svg")}
            alt="waiting"
          />{" "}
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  getMilliseconds = (m) => m * 60 * 1000;

  renderCountDownTimer = (value) => {
   
    if (value.current_status && value.current_status.status === "confirmed") {
      let currentTimeStamp = moment(moment().utcOffset(0, true).format("YYYY-MM-DD HH:mm:ss"));
      var orderCreatedTimeStamp = moment(value.current_status.updated_at);
      // Calculate min difference in created time and current time
      let calculatedTimeDiffInMinute = currentTimeStamp.diff(
        moment(orderCreatedTimeStamp),
        "minutes"
      );
     
      // get difference of estimated time and calculated time  in min
      let remainingTimeInMin =
        value.estimated_time - calculatedTimeDiffInMinute;
      if (remainingTimeInMin <= value.estimated_time) {
        let miliSecond = this.getMilliseconds(remainingTimeInMin);
        //
        return (
          <div className="fm-waiting-time">
            {" "}
           
            <Countdown
              date={Date.now() + miliSecond}
              renderer={this.renderer}
            />
          </div>
        );
      }
    }
  };

  updateOrderStatus = (deliveryType, orderId) => {
    const { selectedOrderId } = this.state;
    
    TotalCartItem = 0;
    cartTotalAmount = 0;
    if (selectedOrderId === orderId) {
      this.setState({ selectedOrderId: "", orderDetails: "" });
    } else {
      this.setState(
        { selectedOrderId: orderId, selectedOrderUpdate: orderId },
        () => {
          this.props.getOrderDetailsById(orderId, (response) => {
            if (response.status === 200) {
              this.setState({
                selectedOrderId: "",
                orderDetails: response.data.data.order_detail,
              });
            } else {
              toastr.error(
                "Error",
                "Something went wrong to get order details."
              );
            }
          });
        }
      );
    }

    this.setState({
      isVisiableUpdateOrderStatus: true,
      deliveryOption: deliveryType,
      selectedOrderId: orderId,
    });
  };
  deleteItem = (id) => {
    this.props.enableLoading();
    this.props.getOrderDelete(id, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.getRestaurantOrders("past_orders");
        toastr.success("Success", "Order Deleted successfully.");
      }
    });
  };

  renderOrderItemTile = (value, idx, orderType) => {


    let StatusButtonLabel = getOrderStatus(value.order_status_display_vendor);

    let disPlaystatus =
      StatusButtonLabel != "pending"
        ? value.current_status.status
        : StatusButtonLabel;
    
    return (
      <div
        className="my-new-order-block"
        onClick={(e) => {
          e.stopPropagation();
          // this.displayOrderDetails(value.id);
          this.updateOrderStatus(value.order_type, value.id);
        }}
        key={`${idx}_orderType`}
        style={{
          borderColor:
            value.id === this.state.selectedOrderId ? "#ffc468" : "#fff",
          borderWidth: 1,
          borderStyle: "solid",
        }}
      >
        <Row gutter={0}>
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <div className="odr-no">
              <h4>Order No. {value.order_no}</h4>
              <span className="pickup">
                {getOrderTypeName(value.order_type)}
              </span>
            </div>
            <div className="order-profile">
              <div className="profile-pic">
                <img
                  alt="test"
                  src={
                    value.user && value.user.image
                      ? value.user.image
                      : require("../../../../../assets/images/avatar3.png")
                  }
                />
              </div>
              <div className="profile-name">{value.name}</div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8} className="align-right">
            <div class="time-info">
              {orderType === "new_order" ||
                orderType === "on_going" ||
                orderType === "delivery" ? (
                  this.renderCountDownTimer(value)
                ) : (
                  <div className="bokng-hsty-hour-price">
                    {" "}
                    <div className="hour">
                      {" "}
                      {this.timestampToString(
                        value.created_at,
                        moment().format("HH:mm"),
                        true
                      )}
                    </div>
                  </div>
                )}
            </div>
            
          </Col>
        </Row>
        <Row gutter={0}>
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <div className="fm-total-price">
              <span>
                {" "}
                Total $
                {parseFloat(value.order_subtotal) +
                  parseFloat(value.order_gst_amount)}
              </span>

              {/* $
                              {this.renderTotalAmount(
                                cartTotalAmount,
                                orderDetails.ship_cost,
                                orderDetails.order_gst_amount
                              )} */}
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8} className="align-right">
            <span className="fm-btndeleteicon">
              {orderType === "new_order" ? (
                <Button
                  type="default"
                  className={getStatusColor(disPlaystatus)}
                >
                  {value.order_status_display_vendor}
                </Button>
              ) : orderType === "on_going" ? (
                <Button
                  type="default"
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   this.updateOrderStatus(value.order_type, value.id);
                  // }}
                  className={getStatusColor(disPlaystatus)}
                >
                  {value.current_status.status == "in-the-kitchen" ? (
                    <p>In the kitchen</p>
                  ) : value.current_status.status == "confirmed" ? (
                    <p> Order Accepted</p>
                  ) : value.current_status.status == "on-the-way" ? (
                    <p>On the way</p>
                  ) : (
                    value.current_status.status
                  )}
                </Button>
              ) : orderType === "delivery" ? (
                <div className="order-block-btns">
                  {/* <Link
                    onClick={() => this.deleteItem(value.id)}
                    className="delete-btn"
                  >
                    <svg
                      width="10"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                        fill="#C2CFE0"
                      />
                    </svg>
                  </Link> */}

                  <Button
                    type="default"
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   this.updateOrderStatus(value.order_type, value.id);
                    // }}
                    className={getStatusColor(disPlaystatus)}
                  >
                    {value.current_status.status == "delivered" ? (
                      "Being Delivered"
                    ) : value.current_status.status ==
                      "food-is-ready-for-pickup" ? (
                      <span>Ready for Pickup </span>
                    ) : (
                      value.current_status.status
                    )}
                  </Button>
                </div>
              ) : orderType === "past_orders" ? (
                <div>
                  <Link
                    onClick={() => this.deleteItem(value.id)}
                    className="delete-btn"
                  >
                    <svg
                      width="10"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                        fill="#C2CFE0"
                      />
                    </svg>
                  </Link>
                  {"  "}
                  <Button
                    type="default"
                    className={getStatusColor(disPlaystatus)}
                  >
                    {value.current_status.status}
                  </Button>
                </div>
              ) : null}
            </span>
          </Col>
        </Row>
      </div>
    );
  };

  renderNewOrders = () => {
    const dataSearch = this.state.newOrdersList.filter((item) => {
      return (
        item.order_no
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });

    if (this.state.newOrdersList && dataSearch.length > 0) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            return this.renderOrderItemTile(value, i, "new_order");
          })}
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };

  rendeOnGoingOrders = () => {
    const dataSearch = this.state.onGoingOrdersList.filter((item) => {
      return (
        item.order_no
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });
    if (
      this.state.onGoingOrdersList &&
      dataSearch.length > 0
    ) {
      // this.setState({ dropdown: true });
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            return this.renderOrderItemTile(value, i, "on_going");
          })}
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };

  rendeDeliveryOrders = () => {
    const dataSearch = this.state.deliveryOrdersList.filter((item) => {
      return (
        item.order_no
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });
    if (
      this.state.deliveryOrdersList &&
      dataSearch.length > 0
    ) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            return this.renderOrderItemTile(value, i, "delivery");
          })}
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };

  renderPastOrders = () => {
    const dataSearch = this.state.pastOrdersList.filter((item) => {
      return (
        item.order_no
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });
    if (this.state.pastOrdersList && dataSearch.length > 0) {
      return (
        <Fragment>
          {dataSearch.map((value, i) => {
            return this.renderOrderItemTile(value, i, "past_orders");
          })}
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };

  renderOrderCartItems = (orderDetails) => {
    TotalCartItem = 0;
    cartTotalAmount = 0;
    if (orderDetails.order_detail && orderDetails.order_detail.length > 0) {
      return (
        <ul className="flex-container wrap">
          {orderDetails.order_detail.map((orderCartItems, i) => {
            return orderCartItems.cart_item.map((cartItems, idx) => {
              TotalCartItem++;
              cartTotalAmount =
                parseFloat(cartTotalAmount) + parseFloat(cartItems.price);
              return (
                <div className="order-list">
                  <div className="count">{cartItems.quantity}</div>
                  <div className="order-name">{cartItems.menu_item_name}</div>
                  <div className="order-proce">${cartItems.price}</div>
                </div>
              );
            });
          })}
        </ul>
      );
    } else {
      return (
        <div className="error-box">
          <Alert message="No Cart Item(s)" type="error" />
        </div>
      );
    }
  };

  hideCancelOrderModal = () => {
    this.setState({ isVisiableCancelOrder: false });
  };

  hideAcceptOrderModal = () => {
    this.setState({ isVisiableAcceptOrder: false });
  };

  // hideUpdateOrderStatusModal = () => {
  //   this.setState({ isVisiableUpdateOrderStatus: false });
  // };

  onFinish = (values) => {
    let reqData = {
      order_id: this.state.orderDetails.id,
      reason: values.reason,
    };

    this.props.enableLoading();
    this.props.getCancelRestaurantOrder(reqData, (response) => {
      this.props.disableLoading();
      if (response.status === 200) {
        this.setState({ isVisiableCancelOrder: false });
        toastr.success("Success", "Order Cancelled successfully.");
      } else {
        toastr.error("Error", "Something went wrong to cancel the order.");
      }
    });
  };

  onSubmitAcceptOrderForm = (values) => {
    console.log(values, "dfffffffff");
    let reqData = {
      order_id: this.state.orderDetails.id,
      estimated_time: values.estimated_time === undefined ? this.state.standard_ETA : values.estimated_time,
    };

    this.props.enableLoading();
    this.props.acceptRestaurantOrder(reqData, (response) => {
      this.props.disableLoading();
      if (response.status === 200) {
        this.setState({ isVisiableAcceptOrder: false });
        this.getRestaurantOrders("new_orders");
        toastr.success("Success", "Order accepted successfully.");
      } else {
        toastr.error("Error", "Something went wrong to accept this order.");
      }
    });
  };

  onSubmitUpdateOrderStatusForm = (values) => {
    console.log(values, "mydataaaaaaaaaaaaaaaaa");
    let reqData = {
      order_id: this.state.selectedOrderUpdate,
      status: (values === "complete" ? "food-is-ready-for-pickup" : values),
    };

    this.props.enableLoading();
    this.props.updateRestaurantOrderStatus(reqData, (response) => {
      this.props.disableLoading();
      if (response.status === 200) {
        toastr.success("Success", "Order status updated successfully.");
        this.getRestaurantOrders("on_going");
      } else {
        toastr.error("Error", "Something went wrong to update order status.");
      }
    });
  };

  renderStatusOptions = () => {
    let deliveryOptionArray = [];
    if (this.state.deliveryOption === "delivery") {
      deliveryOptionArray = ORDER_TYPE_DELIVERY_STATUS;
    } else if (this.state.deliveryOption === "take_away") {
      deliveryOptionArray = ORDER_TYPE_PICKUP_STATUS;
    }
    return (
      // <Select defaultValue="In the kitchen">
      //   {deliveryOptionArray &&
      //     deliveryOptionArray.map((val, i) => {
      //       return (
      //         <Select.Option key={`${i}_order_status`} value={val.value}>
      //           {val.label}
      //         </Select.Option>
      //       );
      //     })}
      // </Select>

      <Select
        placeholder="Select"
        size="large"
        onChange={this.onSubmitUpdateOrderStatusForm}
        type="submit"

        // allowClear
        // getPopupContainer={(trigger) => trigger.parentElement}
      >
        {deliveryOptionArray &&
          deliveryOptionArray.map((val, i) => {
            return (
              <Select.Option
                key={`${i}_order_status`}
                value={val.value}
                className="status-dropdown"
              >
                {val.label}
              </Select.Option>
            );
          })}
      </Select>
    );
  };
  sortlist = (e) => {
    console.log(e, "eeeeeeeeeeee");
    // const { monthStart, monthEnd, weekStart, weekEnd } = this.state;
    // let fromDate, toDate;
    let newDate = new Date();
    let todaydate = moment(newDate).format("YYYY-MM-DD");
    var first = newDate.getDate() - newDate.getDay();
    var last = first + 6;
    var firstday = moment().startOf('week');
    var lastday = moment().endOf('week');

    var firstDaymonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    var lastDaymonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    );
    // console.log(moment(firstDaymonth).format("YYYY-MM-DD"), "firstdaymonth");
    // console.log(moment(lastDaymonth).format("YYYY-MM-DD"), "lastdaymonth");

    console.log(moment(firstday).format("YYYY-MM-DD"), "firstday"); 
     console.log(moment(lastday).format("YYYY-MM-DD"), "lastday");
    console.log(newDate, "newday");

    var nextweek = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate() - 7
    );
    let week = moment(nextweek).format("YYYY-MM-DD");
    // console.log(week, "nextweek");

    const {
      newOrdersList,
      onGoingOrdersList,
      deliveryOrdersList,
      pastOrdersList,
      key,
      list,
      
    } = this.state;
    let tmp;
  
    if (key == "1") {
      tmp = newOrdersList;
      console.log(tmp, "activeTab 1");
    } else if (key == "2") {
      tmp = onGoingOrdersList;
      console.log(tmp, "activeTab 2");
    } else if (key == "3") {
      tmp = deliveryOrdersList;
      console.log(tmp, "activeTab 3");
    } else if (key == "4") {
      tmp = pastOrdersList;
      console.log(tmp, "activeTab 4");
    }
    let result;
    console.log(result,"resss",tmp,"temp",newOrdersList,"list",list,"listingg")
    switch (e) {
      case "Today":
        result = tmp.filter((list) =>  moment(list.created_at).format("YYYY-MM-DD") === todaydate);
        this.setState({total:result.length})
        
        // console.log(result, "resultttt today" );
        break;
        case "Week":
          tmp=list;
          result = tmp.filter(
            (list) =>
            moment(list.created_at).format("YYYY-MM-DD") >= moment(firstday).format("YYYY-MM-DD") &&
            moment(list.created_at).format("YYYY-MM-DD") <= moment(lastday).format("YYYY-MM-DD")
            );
            this.setState({total:result.length,result:tmp})
            console.log(result ,"]]]]]reeeeeeeeeeeeee")



        // console.log(result, "resultttt week");
        break;
      // case "month":
      //   result = tmp.filter(
      //     (list) =>
      //       list.date >= moment(firstDaymonth).format("YYYY-MM-DD") &&
      //       list.date <= moment(lastDaymonth).format("YYYY-MM-DD")
      //   );
      //   console.log(result, "resultttt");

      //   break;
     
      case "Newest":
        result = tmp.sort((a, b) => {
          if (moment(a.created_at).format("YYYY-MM-DD") > moment(b.created_at).format("YYYY-MM-DD")) {
            
            return -1;
          }
        });
        console.log(result, "resultttt newest ");

        break;
      case "Oldest":
        result = tmp.sort((a, b) => {
          if (moment(a.created_at).format("YYYY-MM-DD") < moment(b.created_at).format("YYYY-MM-DD")) {
            return -1;
          }
        });

        console.log(result, "resultttt oldest");
        break;

      default:
        result = tmp.sort(this.compare);
        console.log(result,"default")
        break;
    }
    if (key == "1") {
      this.setState({
        newOrdersList: result,
      });
    } else if (key == "2") {
      this.setState({
        onGoingOrdersList: result,
      });
    } else if (key == "3") {
      this.setState({
        deliveryOrdersList: result,
      });
    } else if (key == "4") {
      this.setState({
        pastOrdersList: result,
      });
    }
  };

  displaySelectOngoing = () => {
    const { key, isVisiableUpdateOrderStatus } = this.state;
    if (key === "2" && isVisiableUpdateOrderStatus) {
      return (
        <div className="change-status">
          <label>Change Status</label>

          {this.renderStatusOptions()}

          {/* <Button onClick={this.onSubmitUpdateOrderStatusForm}  type="submit" >
                  Update Status
                </Button> */}
          {/* </Form.Item> */}
          {/* </Form> */}
          {/* <Select defaultValue="In the kitchen">
              <Option Value="{In the kitchen}">
                In the kitchen
              </Option>
              <Option Value="{Being delivered}">
                Being delivered
              </Option>
            </Select> */}
        </div>
      );
    }
  };

  displayPickedup = () => {
    const { key, isVisiableUpdateOrderStatus } = this.state;
    if (key === "3" && isVisiableUpdateOrderStatus) {
      return (
        <div className="btn-block-right">
          <button
            className="orange-btn"
            onClick={() => this.onSubmitUpdateOrderStatusForm("completed")}
          >
            Picked Up
          </button>
        </div>
      );
    }
  };
  displayDelivered = () => {
    const { key, isVisiableUpdateOrderStatus } = this.state;
    if (key === "3" && isVisiableUpdateOrderStatus) {
      return (
        <div className="btn-block-right">
          <button
            className="green-btn"
            onClick={() => this.onSubmitUpdateOrderStatusForm("completed")}
          >
            Delivered
          </button>
        </div>
      );
    }
  };

  displayDelete = (id) => {
    const { key, isVisiableUpdateOrderStatus } = this.state;
    console.log(isVisiableUpdateOrderStatus,"rrrrrrrrrr")
    if (key === "4" && isVisiableUpdateOrderStatus) {
      return (
        <div className="btn-block-right">
          <Link className="delete-btn"  onClick={() => this.deleteItem(id)}>
            <svg
              width="16"
              height="21"
              viewBox="0 0 16 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.14286 17.8868C1.14286 19.1165 2.17143 20.1226 3.42857 20.1226H12.5714C13.8286 20.1226 14.8571 19.1165 14.8571 17.8868V4.47169H1.14286V17.8868ZM16 1.11792H12L10.8571 0H5.14286L4 1.11792H0V3.35377H16V1.11792Z"
                fill="#C2CFE0"
              />
            </svg>
          </Link>
        </div>
      );
    }
  };

  displayAction = () => {
    const { key, orderDetails } = this.state;
    if (key === "1") {
      return (
        <Fragment>
          <Button
            type="default"
            className="cancel-order-btn"
            onClick={() => this.setState({ isVisiableCancelOrder: true })}
          >
            CANCEL ORDER
          </Button>
          <Button
            onClick={() => this.setState({ isVisiableAcceptOrder: true })}
            type="default"
            className="accept-order-btn ml-10"
          >
            Accept Order
          </Button>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          {orderDetails !== "" && orderDetails.status && (
            <Button type="default" className="purple">
              {orderDetails.status}
            </Button>
          )}
        </Fragment>
      );
    }
  };
  handleBookingPageChange = (e) => {
    this.setState({ filterdata: e.target.value });
    console.log(this.state.filterdata, "eeeeeeeeeeeeeeeeeee");
  };
  renderTotalAmount = (amount, ship_cost, order_gst_amount) => {
    console.log("Amount", amount);
    console.log("ship cost", ship_cost);
    console.log("order Gst Amount", order_gst_amount);
    let totalIncDeliveryFee =
      parseFloat(amount) + parseFloat(ship_cost) + parseFloat(order_gst_amount);
    return totalIncDeliveryFee;

  };
  // onHandleChange = (value) => {
  //   console.log(value, "eeeeeeeeeeeee");
  //   let row = this.state.newOrdersList;
  //   console.log(row, "rowwwwwwwwwww");
  //   if (value === "Week") {
  //     let data = row.sort(
  //       (a, b) =>
  //         new Date(a.created_at.split("/").reverse()) -
  //         new Date(b.created_at.split("/").reverse())
  //     );
  // } else if (value === "month") {
  //   row.slice().sort((a, b) => {
  //     console.log(a, "aaaaaaaaaaaa");
  //     if (a.created_at - b.created_at) {
  //       return this.setState({ filterdata: row });
  //     }
  // });
  //     console.log(data, "dataaa");
  //     this.setState({ filterdata: data });
  //   }
  // };
  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      orderDetails,
      newOrdersList,
      onGoingOrdersList,
      deliveryOrdersList,
      pastOrdersList,
      orderType,
      key,
      total,
      list,
      standard_ETA,
    } = this.state;
    console.log(orderType, "orderType",list,"new");
    let StatusButtonLabel = getOrderStatus(orderDetails.order_current_status);

    let disPlaystatus =
      StatusButtonLabel != "pending"
        ? orderDetails.order_current_status
        : StatusButtonLabel;

    
    return (
      <Layout className="event-booking-profile-wrap fm-restaurant-vendor-wrap">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box restaurant-my-orders"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section manager-page">
                  <div className="left">
                    <Title level={2}>My orders</Title>
                  </div>
                  {/* <div className="right">
                    <Button
                      onClick={() => this.props.history.push("/dashboard")}
                      className="orange-btn"
                    >
                      My Dashboard
                    </Button>
                  </div> */}
                  <div className="search-block">
                    <Input
                      placeholder="Search by Order Id "
                      prefix={
                        <SearchOutlined className="site-form-item-icon" />
                      }
                      onChange={(e) => this.handleBookingPageChange(e)}
                    />
                  </div>
                </div>
                <div className="sub-head-section">
                  <Text>&nbsp;</Text>
                </div>
                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking">
                  <Row gutter={30}>
                    <Col xs={24} sm={24} md={24} lg={17} xl={17}>
                      <Card
                        className="profile-content-shadow-box"
                        bordered={false}
                        title=""
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            {this.state.key === "4" ? <Select
                              onChange={(e) => {
                                this.sortlist(e);
                              }}
                              defaultValue={"Newest"}
                              // dropdownMatchSelectWidth={false}
                              dropdownClassName="filter-dropdown my-order-dropdown"
                            >
                              
                              <Option value="Newest">Newest</Option>
                              <Option value="Oldest">Oldest</Option>
                            </Select> :  <Select
                              onChange={(e) => {
                                this.sortlist(e);
                              }}
                              defaultValue={"Week"}
                              // dropdownMatchSelectWidth={false}
                              dropdownClassName="filter-dropdown my-order-dropdown"
                            >
                              
                              <Option value="Today">Today</Option>
                              <Option value="Week">This Week</Option>
                            </Select>}
                          </div>
                        }
                      >
                        <Tabs onChange={this.onTabChange} defaultActiveKey="1">
                          <TabPane tab="New" key="1">
                            <h3>
                              You have{" "}
                              {total
                                ? total
                                : 0}{" "}
                              new orders
                            </h3>
                            {this.renderNewOrders()}
                          </TabPane>
                          <TabPane
                            tab="In Progress"
                            key="2"
                            className="in-progress-tab"
                          >
                            <h3>
                              You have{" "}
                              {total
                                ? total
                                : 0}{" "}
                              new orders
                            </h3>
                            {this.rendeOnGoingOrders()}
                          </TabPane>
                          <TabPane tab="Completed" key="3">
                            <h3>
                              You have{" "}
                              {total
                                ? total
                                : 0}{" "}
                              new orders
                            </h3>
                            {this.rendeDeliveryOrders()}
                          </TabPane>
                          <TabPane tab="Past" key="4">
                            <h3>
                              You have{" "}
                              {total
                                ? total
                                : 0}{" "}
                              new orders
                            </h3>
                            {this.renderPastOrders()}
                          </TabPane>
                        </Tabs>
                        {/* <div className="card-header-select"><label>Show:</label>
                                                <Select onChange={(e) => this.setState({ calendarView: e })} defaultValue="This week">
                                                    <Option value="week">This week</Option>
                                                    <Option value="month">This month</Option>
                                                </Select></div> */}
                      </Card>
                    </Col>
                    
                    {orderDetails !== "" && (
                      <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                        <div className="your-order-block">
                          <div className="your-order-block-head">
                            <div className="order-head-left">
                              <h2>Order no. {orderDetails.order_no}</h2>
                              <h5>
                                {orderDetails.order_type == "take_away"
                                  ? "Pickup"
                                  : orderDetails.order_type == "delivery"
                                  ? "Delivery"
                                  : orderDetails.order_type}
                              </h5>
                            </div>
                            <div className="order-head-right">
                              <Button
                                type="default"
                                // onClick={(e) => {
                                //   e.stopPropagation();
                                //   this.updateOrderStatus(value.order_type, value.id);
                                // }}
                                className={getStatusColor(disPlaystatus)}
                              >
                                {orderType == true ? (
                                  orderDetails.order_current_status ==
                                  "in-the-kitchen" ? (
                                    <p className="in-the-kitchen">
                                      In the kitchen
                                    </p>
                                  ) : orderDetails.order_current_status ==
                                    "confirmed" ? (
                                    <p className="order-accepted">
                                      {" "}
                                      Order Accepted
                                    </p>
                                  ) : orderDetails.order_current_status ==
                                    "on-the-way" ? (
                                    <p>On the way</p>
                                  ) : (
                                    orderDetails.order_current_status == "pending" ? "" : 
                                     orderDetails.order_current_status == "delivered" && key == "3" ? "Being Delivered" : orderDetails.order_current_status == "food-is-ready-for-pickup" ? "Ready for Pickup" : orderDetails.order_current_status
                                  )
                                ) : (
                                  ""
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="profile-name-pic-detail">
                            {/* <div>From</div> */}
                            <div className="profile-pic">
                              <img
                                alt="test"
                                src={
                                  orderDetails.user.image
                                    ? orderDetails.user.image
                                    : require("../../../../../assets/images/avatar3.png")
                                }
                              />
                            </div>
                            <div className="profile-name">
                              {/* {orderDetails.customer_fname}{" "}
                              {orderDetails.customer_lname} */}
                              {orderDetails.name}
                            </div>
                          </div>
                          <Divider />
                          {this.renderOrderCartItems(orderDetails)}
                          <Divider />
                          <div className="order-total">
                            <div className="item">Item ({TotalCartItem})</div>
                            <div className="amount">${cartTotalAmount}</div>
                          </div>
                          <div className="order-total">
                            <div className="item">Fee</div>
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
                              <span>Taxes & fees includ</span>
                            </div>
                          </div>
                          <div className="btn-block">
                            {this.displayAction()}
                          </div>
                          <div>{this.displaySelectOngoing()}</div>
                          <div>
                            {orderDetails.order_type === "take_away"
                              ? this.displayPickedup()
                              : ""}
                          </div>
                          <div>
                            {orderDetails.order_type === "delivery"
                              ? this.displayDelivered()
                              : ""}
                          </div>
                          <div>{this.displayDelete(orderDetails.id)}</div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
            </div>
            <Modal
              title="Cancel Order"
              visible={this.state.isVisiableCancelOrder}
              className={"custom-modal style1 cancel-order-popup"}
              footer={false}
              onCancel={this.hideCancelOrderModal}
              destroyOnClose={true}
            >
              <div className="padding">
                <Form {...layout} onFinish={this.onFinish}>
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
                    <Button
                      onClick={() =>
                        this.setState({ isVisiableCancelOrder: false })
                      }
                      type="default"
                      className="clear-btn"
                      htmlType="submit"
                    >
                      Cancel
                    </Button>
                    <Button
                      // onClick={this.onFinisg}
                      type="default"
                      className="orange-btn"
                      htmlType="submit"
                    >
                      Send
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Modal>
            <Modal
              title="Accept Order"
              visible={this.state.isVisiableAcceptOrder}
              className={"custom-modal style1 accept-order-popup"}
              footer={false}
              onCancel={this.hideAcceptOrderModal}
              destroyOnClose={true}
            >
              <div className="padding">
                <Form {...layout} onFinish={this.onSubmitAcceptOrderForm}>
                  <Form.Item
                    label="Estimated time (optional)"
                    name="estimated_time"
                    rules={[whiteSpace("estimated_time")]}
                  >
                    {/* <Input
                      type={"number"}
                      placeholder={"Enter estimated time in minute (optional)"}
                      className="shadow-input"
                    /> */}
                    <Select
                      type={"number"}
                      placeholder={"Select estimated time in minute (optional)"}
                      // defaultValue={standard_ETA}
                    >
                      <Option value="45">45 Mins</Option>
                      <Option value="60">60 Mins</Option>
                      <Option value="90">90 Mins</Option>
                      <Option value="120">120 Mins</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button
                      onClick={() =>
                        this.setState({ isVisiableAcceptOrder: false })
                      }
                      type="default"
                      className="clear-btn"
                      htmlType="submit"
                    >
                      Cancel
                    </Button>
                    <Button
                      // onClick={this.onSubmitAcceptOrderForm}
                      type="default"
                      className="orange-btn"
                      htmlType="submit"
                    >
                      Confirm
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Modal>
            <Modal
              title="Update Order Status"
              // visible={this.state.isVisiableUpdateOrderStatus}
              className={"custom-modal style1"}
              footer={false}
              onCancel={this.hideUpdateOrderStatusModal}
              destroyOnClose={true}
            >
              <div className="padding">
                <Form {...layout} onFinish={this.onSubmitUpdateOrderStatusForm}>
                  <Form.Item
                    label="Order Status:"
                    name="status"
                    rules={[required("")]}
                  >
                    {this.renderStatusOptions()}
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button type="default" htmlType="submit">
                      Update Statustt
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Modal>
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
  getRestaurantOrdersForVendor,
  getCancelRestaurantOrder,
  acceptRestaurantOrder,
  updateRestaurantOrderStatus,
  getOrderDelete,
})(RestaurantVendorOrdersList);
