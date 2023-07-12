import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  SearchOutlined,
  CloseCircleOutlined,
  WindowsFilled,
  MinusCircleOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  OrderedListOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Select,
  Button,
  Input,
  Steps,
  Popover,
} from "antd";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import "../../vendor-profiles/myprofilerestaurant.less";
import {
  enableLoading,
  disableLoading,
  getUserRestaurantCurrentOrders,
  getUserRestaurantPastOrders,
  getOrderDetailsById,
  getUserRestaurantTrakingOrders,
  getRestaurantOrdersForVendor,
  getUserRestaurantTrakingOrdersStatus,
  getCancelRestaurantOrder,
  acceptRestaurantOrder,
  updateRestaurantOrderStatus,
} from "../../../../actions";
import moment from "moment";
import {
  getOrderTypeName,
  getOrderStatus,
  getStatusColor,
} from "../../../../config/Helper";
import Countdown from "react-countdown";

const { Title } = Typography;
const { Option } = Select;

const { Step } = Steps;
class OrderTracking extends React.Component {
  state = {
    OrdersTracking: [],
    filterdata: [],
    Orders: [],
    disable: false,
    oorders: [],
    current_status: [],
    status: [],
    mydata: 0,
    stat: "",
    time: "",
    times: "",
    times2: "",
    ilterdata: "",
    filterdata: "",
    sortstatus: "",
    page: 1,
    page_size: 10,
    orderDetailList: "",
    orderList: "",
    total: "",
    checkEmpty: "",
    totalTracking: "",
    trackingList: "",
  };
  componentDidMount() {
    this.getRestroTrakingOrders(this.state.page);
  }

  sortlist = (e) => {
    const { OrdersTracking, page } = this.state;

    if (e === "confirmed") {
      let status = e;
      this.props.getUserRestaurantTrakingOrdersStatus(status, (res) => {
        if (res.status === 200) {
         
          let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
          let total = res.data.data.total_count;
          this.setState({
            OrdersTracking: ordersArray,
            total: total,
            checkEmpty: res.data.data.orders.orders,
          });
        }
      });
    } else if (e === "onTheWay") {
      let status = e;
      this.props.getUserRestaurantTrakingOrdersStatus(status, (res) => {
        if (res.status === 200) {
          let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
          let total = res.data.data.total_count;
          this.setState({
            OrdersTracking: ordersArray,
            total: total,
            checkEmpty: res.data.data.orders.orders,
          });
        }
      });
    } else if (e === "Cancelled") {
      let status = e;
      this.props.getUserRestaurantTrakingOrdersStatus(status, (res) => {
        if (res.status === 200) {
          let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
          let total = res.data.data.total_count;
          this.setState({
            OrdersTracking: ordersArray,
            total: total,
            checkEmpty: res.data.data.orders.orders,
          });
        }
      });
    } else if (e === "newest") {
      let status = e;
      // const reqData = {
      //   page: page,
      //   page_size:page_size,
      // }
      // this.props.getUserRestaurantTrakingOrders(reqData,(res) => {
      //   if (res.status === 200) {
      //     let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
      //     this.setState({ OrdersTracking: ordersArray });
      //   }
      // });
      this.getRestroTrakingOrders(page);
    } else if (e === "inTheKitchen") {
      let status = e;
      this.props.getUserRestaurantTrakingOrdersStatus(status, (res) => {
        if (res.status === 200) {
          let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
          let total = res.data.data.total_count;
          this.setState({
            OrdersTracking: ordersArray,
            total: total,
            checkEmpty: res.data.data.orders.orders,
          });
        }
      });
    }
    // let result;
    // switch (e) {
    //   case "Cancelled":
    //     result = OrdersTracking.filter(
    //       (list) => list.current_status.status === "cancelled"
    //     );

    //     this.setState({ OrdersTracking: result });
    //     this.props.getUserRestaurantTrakingOrders((res) => {
    //       this.props.disableLoading();
    //       if (res.status === 200) {
    //         let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
    //         this.setState({ OrdersTracking: ordersArray });
    //       }
    //     });
    //     break;

    //   case "confirmed":
    //     result = OrdersTracking.filter(
    //       (list) => list.current_status.status === "confirmed"
    //     );
    //     this.setState({ OrdersTracking: result });
    //     this.props.getUserRestaurantTrakingOrders((res) => {
    //       this.props.disableLoading();
    //       if (res.status === 200) {
    //         let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
    //         this.setState({ OrdersTracking: ordersArray });
    //       }
    //     });
    //     break;
    //   case "onTheway":
    //     result = OrdersTracking.filter(
    //       (list) => list.current_status.status === "on-the-way"
    //     );
    //     this.setState({ OrdersTracking: result });
    //     this.props.getUserRestaurantTrakingOrders((res) => {
    //       this.props.disableLoading();
    //       if (res.status === 200) {
    //         let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
    //         this.setState({ OrdersTracking: ordersArray });
    //       }
    //     });
    //     break;
    // }
  };

  getRestroTrakingOrders = (page) => {
    const { page_size, orderList, OrdersTracking, orderDetailList } =
      this.state;
    const reqData = {
      page: page,
      page_size: page_size,
    };

    this.props.enableLoading();
    this.props.getUserRestaurantTrakingOrders(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200 && res.data.data.orders.orders.length !== 0) {
        let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
        let current_status = res.data.data.orders.orders;
        let total = res.data.data.total_count;

        this.setState({
          sortstatus: current_status,
          OrdersTracking: [...OrdersTracking, ...ordersArray],
          //  trackingList: [...this.state.trackingList, ...ordersArray],
          totalTracking: res.data.data.orders.orders
            ? res.data.data.orders.orders
            : 0,
          checkEmpty: res.data.data.orders.orders,
          orderDetailList: res.data.data.orders.orders,
          page: page,
          total: total,
        });
      }
      
    });
  };
  searchText = (e) => {
    this.setState({ filterdata: e.target.value });
  };

  handleBookingPageChange = (e) => {
    const { page } = this.state;
    
    this.getRestroTrakingOrders(+page + 1);
  };

  getOrderDetails = (orderId) => {
    const { status, mydata } = this.state;
    this.props.enableLoading();
 
    this.props.getOrderDetailsById(orderId, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        // let ordersArray = res.data.data.orders.orders; //RESTAURANT_ORDER_LIST.data.orders; // res.data.orders
      
        this.setState({ Orders: res.data.data.order_detail });
        this.setState({ status: res.data.data.order_detail.all_status });

        this.setState({ disable: true });
        this.setState({
          oorders: res.data.data.items,
        });
        this.Steps();
      }
    });
  };

  Steps = () => {
    const { status, mydata } = this.state;
   
    let filteredValues = status.filter((val) => {
   
      
      if (
        val.order_status_display_vendor === "order-received" &&
        val.changed_at !== null
      ) {
        return val;
      }
    });
   
    if (filteredValues.length) {
     
      var date = moment()
        .utcOffset(filteredValues[0].changed_at)
        .format("hh:mm:ss a");
      this.setState({ stat: 0 });
      this.setState({ time: date });
      this.setState({ times2: "" });
      this.setState({ times3: "" });
      this.setState({ times4: "" });
      this.setState({ times5: "" });
    }
    let filteredValues1 = status.filter((val) => {
      if (
        val.order_status_display_vendor === "confirmed" &&
        val.changed_at !== null
      ) {
        return val;
      }
    });
    if (filteredValues1.length) {
      var date = moment()
        .utcOffset(filteredValues1[0].changed_at)
        .format("hh:mm:ss a");
      this.setState({ stat: 1 });

      this.setState({ times2: date });
    }

    let filteredValues2 = status.filter((val) => {
      if (
        val.order_status_display_vendor === "in-the-kitchen" &&
        val.changed_at !== null
      ) {
        return val;
      }
    });
    if (filteredValues2.length) {
      var date = moment()
        .utcOffset(filteredValues2[0].changed_at)
        .format("hh:mm:ss a");
      this.setState({ stat: 2 });
      this.setState({ times3: date });
    }
    let filteredValues3 = status.filter((val) => {
      if (
        val.order_status_display_vendor === "on-the-way" &&
        val.changed_at !== null
      ) {
        return val;
      }
    });
    if (filteredValues3.length) {
      var date = moment()
        .utcOffset(filteredValues3[0].changed_at)
        .format("hh:mm:ss a");
      this.setState({ stat: 3 });
      this.setState({ times4: date });
      this.setState({ times5: "" });
    }
    let filteredValues4 = status.filter((val) => {
      if (
        val.order_status_display_vendor === "delivered" &&
        val.changed_at !== null
      ) {
        return val;
      }
    });
    if (filteredValues4.length) {
      var date = moment()
        .utcOffset(filteredValues4[0].changed_at)
        .format("hh:mm:ss a");
      this.setState({ stat: 4 });
      this.setState({ times5: date });
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
            src={require("../../../../assets/images/icons/waiting-red-icon.svg")}
            alt="waiting"
          />{" "}
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  getMilliseconds = (m) => m * 60 * 1000;

  renderCountDownTimer = (value) => {
   
    if (value.current_status && value.current_status.status === "food-is-ready-for-pickup" || "order-received" || "confirmed") {
      let currentTimeStamp = moment(moment().utcOffset(0, true).format("YYYY-MM-DD HH:mm:ss"));
      var orderCreatedTimeStamp = moment(value.current_status.updated_at);
      // Calculate min difference in created time and current time
      let calculatedTimeDiffInMinute = currentTimeStamp.diff(
        moment(orderCreatedTimeStamp),
        "minutes"
      );
     
     
      // get difference of estimated time and calculated time  in min
      let remainingTimeInMin =
        (value.estimated_time ) - calculatedTimeDiffInMinute;
      if (remainingTimeInMin <= value.estimated_time) {
        let miliSecond = this.getMilliseconds(remainingTimeInMin);
        
     
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

  render() {
    const { OrdersTracking, oorders, total } = this.state;
    
    const dataSearch = this.state.OrdersTracking.filter((item) => {
      return (
        item.order_no
          .toString()
          .toLowerCase()
          .indexOf(this.state.filterdata.toString().toLowerCase()) > -1
      );
    });

    return (
      <Layout className="event-booking-profile-wrap fm-event-vendor-wrap">
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box view-class-tab booking-common-employee-dashborad-box-v2 order-tracking"
              style={{ minHeight: 800 }}
            >
              <div className="heading-search-block booking-box title-head">
                <Title level={2}>Order Tracker</Title>
              </div>

              <div className="card-container signup-tab">
                <div className="profile-content-box">
                  <div className="pf-vend-restau-myodr  pf-vend-spa-booking pf-vendor-handyman-dasboard pf-vend-order-traker">
                    <Row gutter={30}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Card className="profile-content-shadow-box dashboard-left-calnder-block">
                          <div className="custom-card-header">
                            <div className="order-count">
                              You have {total ? total : "0"} orders
                            </div>
                            <div className="card-header-select">
                              <label>Sort:</label>
                              <Select
                                onChange={this.sortlist}
                                defaultValue={"newest"}
                                dropdownMatchSelectWidth={false}
                                dropdownClassName="filter-dropdown"
                              >
                                <Option value={"newest"}>Newest</Option>
                                <Option value={"confirmed"}>Confirmed</Option>
                                <Option value={"onTheWay"}>On The Way</Option>
                                <Option value={"inTheKitchen"}>
                                  In The kitchen
                                </Option>
                                <Option value={"Cancelled"}>Cancelled</Option>
                              </Select>
                            </div>
                          </div>

                          <div className="search-block">
                            <Input
                              placeholder="Search Order No."
                              onChange={(e) => this.searchText(e)}
                            />
                            <Button type="Submit" className="search-btn">
                              Search
                            </Button>
                          </div>
                          <Fragment>
                            {dataSearch.length > 0 &&
                              dataSearch.map((item) => {
                                  let StatusButtonLabel = getOrderStatus(
                                  item.current_status.status
                                );

                                let disPlaystatus =
                                  StatusButtonLabel != "pending"
                                    ? item.current_status.status
                                    : StatusButtonLabel;
                                return (
                                  <div
                                    onClick={() => {
                                      // this.mydata();
                                      this.getOrderDetails(item.id);
                                    }}
                                    className="my-new-order-block"
                                  >
                                    {" "}
                                   
                                    {/* <h1>{item.order_no}</h1> */}
                                    <Row gutter={0}>
                                      <Col
                                        className="order-block-left"
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={18}
                                        xl={18}
                                      >
                                        <Row gutter={0}>
                                          <Col
                                            xs={24}
                                            sm={24}
                                            md={24}
                                            lg={18}
                                            xl={18}
                                          >
                                            <div className="odr-no">
                                              <h4>Order no. {item.order_no}</h4>
                                              <span className="pickup">
                                                {item.order_type == "take_away"
                                                  ? "Pickup"
                                                  : item.order_type}
                                              </span>
                                            </div>

                                            <div className="order-profile">
                                              <div className="profile-pic">
                                                <img
                                                  alt="test"
                                                  src={require("../../../../assets/images/avatar3.png")}
                                                />
                                              </div>
                                              <div className="profile-sec">
                                                <div className="profile-name">
                                                  {item.name}
                                                </div>
                                                <div className="total">
                                                  Total ${item.order_grandtotal}
                                                </div>
                                              </div>
                                            </div>
                                          </Col>
                                        </Row>
                                        <Row gutter={0}>
                                          <Col
                                            xs={24}
                                            sm={24}
                                            md={24}
                                            lg={24}
                                            xl={24}
                                          ></Col>
                                        </Row>
                                      </Col>
                                      <Col
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={6}
                                        xl={6}
                                        className="order-block-right"
                                      >
                                        <Row className="order-col" gutter={0}>
                                          <div class="time-info">
                                          {item.order_type === "take_away" ||
                                            item.order_type === "delivery" ? (
                                              this.renderCountDownTimer(item)
                                            ) : (
                                              <div className="bokng-hsty-hour-price">
                                                {" "}
                                                <div className="hour">
                                                  {" "}
                                                  {this.timestampToString(
                                                    item.created_at,
                                                    moment().format("HH:mm"),
                                                    true
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          <Button
                                            className={getStatusColor(
                                              disPlaystatus
                                            )}
                                            type="default"
                                          >
                                            {item.current_status.status ==
                                            "on-the-way"
                                              ? "On the way"
                                              : item.current_status.status ==
                                                "delivered"
                                              ? "Delivered"
                                              : item.current_status.status ==
                                                "food-is-ready-for-pickup"
                                              ? "Ready for Pickup"
                                              : item.current_status.status ==
                                                "confirmed"
                                              ? "Confirmed"
                                              : item.current_status.status ==
                                                "order-received"
                                              ? "Order Received"
                                              : item.current_status.status ==
                                                "in-the-kitchen"
                                              ? "In the Kitchen"
                                              : item.current_status.status}
                                          </Button>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </div>
                                );
                              })}
                            {/* {this.state.checkEmpty.length >= 10 ? (
                              <div className="btn-show-block">
                                <a
                                  className="show-more"
                                  onClick={(e) =>
                                    this.handleBookingPageChange(e)
                                  }
                                >
                                  Show More
                                </a>
                              </div>
                            ) : (
                              ""
                            )} */}   
                          </Fragment>
                        </Card>
                      </Col>
                      <Col
                        className="order-traker-right"
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        xl={8}
                      >
                        {this.state.disable ? (
                          <Card>
                            <div class="order-content">
                              <div class="order-right-info">
                                <h1>Order no. {this.state.Orders.order_no}</h1>
                                <h3>
                                  {this.state.Orders.order_type == "take_away"
                                    ? "Pickup"
                                    : this.state.Orders.order_type}
                                </h3>

                                <div className="order-profile">
                                  <div className="profile-pic">
                                    <img
                                      alt="test"
                                      src={require("../../../../assets/images/avatar3.png")}
                                    />
                                  </div>
                                  <div className="profile-sec">
                                    <div className="profile-name">
                                      {this.state.Orders.name}
                                    </div>
                                  </div>
                                </div>
                                {oorders.map((item) => {
                                  // return <span>{item.name}</span>;
                                  return (
                                    <ul class="order-items">
                                      <li>
                                        <span>{item.quantity}</span>
                                        <span>{item.name}</span>
                                        <span>{item.price}</span>
                                      </li>
                                    </ul>
                                  );
                                })}
                                <div class="items">
                                  <ul class="order-items">
                                    <li>
                                      <span>Item ({oorders.length})</span>
                                      <span>
                                        {this.state.Orders.order_subtotal}
                                      </span>
                                    </li>
                                    <li>
                                      <span>Fee</span>
                                      <span>
                                        ${this.state.Orders.order_gst_amount}
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                                <div class="item-total">
                                  <ul class="order-items">
                                    <li>
                                      <span>Total</span>
                                      <span>
                                        ${this.state.Orders.order_grandtotal}
                                      </span>
                                    </li>
                                    <li>
                                      <small>Taxes & fees included</small>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="step-head">
                              {" "}
                              <img
                                alt="test"
                                src={require("../../../../assets/images/clock-white.png")}
                              />{" "}
                              ETA :{" "}
                              {this.state.Orders.estimated_time
                                ? this.state.Orders.estimated_time
                                : "0"}{" "}
                              min
                            </div>

                            <Steps
                              progressDot
                              current={this.state.stat}
                              direction="vertical"
                            >
                              <Step
                                title="Order recieved"
                                description={this.state.time}
                              />
                              <Step
                                title="Confirmed"
                                description={this.state.times2}
                              />
                              <Step
                                title="In the kitchen"
                                description={this.state.times3}
                              />
                              <Step
                                title="On the way"
                                description={this.state.times4}
                              />
                              <Step
                                title="Ready for pickup"
                                description={this.state.times5}
                              />
                            </Steps>
                          </Card>
                        ) : null}
                        {/* // ); // }) // : null} */}
                      </Col>
                    </Row>
                  </div>
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
    traderDetails:
      profile.traderProfile !== null ? profile.traderProfile : null,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getUserRestaurantCurrentOrders,
  getUserRestaurantPastOrders,
  getOrderDetailsById,
  getUserRestaurantTrakingOrders,
  getUserRestaurantTrakingOrdersStatus,
  getRestaurantOrdersForVendor,
  getCancelRestaurantOrder,
  acceptRestaurantOrder,
  updateRestaurantOrderStatus,
})(OrderTracking);
