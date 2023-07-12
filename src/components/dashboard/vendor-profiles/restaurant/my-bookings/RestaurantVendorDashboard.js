import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  Layout,
  Calendar,
  Card,
  Typography,
  Button,
  Row,
  Col,
  Input,
  Select,
  Alert,
  DatePicker,
  Form,
  Divider,
} from "antd";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import Icon from "../../../../../components/customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
  getRestaurantVendorOrderByMonth,
  getRestaurantVendorEarning,
} from "../../../../../actions";
import { displayCalenderDate, displayDate } from "../../../../common/";
import { Pie } from "ant-design-pro/lib/Charts";
import "ant-design-pro/dist/ant-design-pro.css";
import { langs } from "../../../../../config/localization";
import { DASHBOARD_KEYS } from "../../../../../config/Constant";
import {
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "../../../calender.less";
import "../../../employer.less";
import "../../../addportfolio.less";
import "./mybooking.less";
import { VENDOR_RESTAURANT_DASHBOARD_DATA } from "./staticrresponse";
import "./profile-vendor-restaurant.less";
import {
  getOrderTypeName,
  getOrderStatus,
  getStatusColor,
} from "../../../../../config/Helper";
import Countdown from "react-countdown";
import { required } from "../../../../../config/FormValidation";
const { Option } = Select;
const { Title, Text } = Typography;
let today = Date.now();

// Pagination
function itemRender(current, type, originalElement) {
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

class RestaurantVendorDashboard extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    let input = new Date();
    let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
    let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0);

    let first = input.getDate() - input.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6
    let firstday = new Date(input.setDate(first)).toUTCString();
    let lastday = new Date(input.setDate(last)).toUTCString();

    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: moment(new Date()).format("YYYY-MM-DD"),
      index: "",
      calendarView: "week",
      monthStart: moment(startOfMonth).format("YYYY-MM-DD"),
      monthEnd: moment(endOfMonth).format("YYYY-MM-DD"),
      weekStart: moment(firstday).format("YYYY-MM-DD"),
      weekEnd: moment(lastday).format("YYYY-MM-DD"),
      dropdown_label: "This Month",
      flag: "",
      selectedDateForOrders: new Date(),
      selectedDateOrdersList: [],
      restaurantEarnings: {
        completed: 0,
        earning: 0,
        not_completed: 0,
        pending: 0,
        total_orders: 0,
      },
      monthdata: [],
      orderPerformaceDurationFilter: "weekly",
    };
  }

  componentDidMount() {
    this.getRestaurantVendorOrderForSelectedDate(
      this.state.selectedDateForOrders
    );
    this.getRestaurantEarning();
    this.createWeekCalender();
  }

  getRestaurantEarning = () => {
    const {
      orderPerformaceDurationFilter,
      monthStart,
      monthEnd,
      weekStart,
      weekEnd,
    } = this.state;
    let fromDate, toDate;

    if (orderPerformaceDurationFilter === "weekly") {
      fromDate = weekStart;
      toDate = weekEnd;
    } else if (orderPerformaceDurationFilter === "monthly") {
      fromDate = monthStart;
      toDate = monthEnd;
    } else if (orderPerformaceDurationFilter === "today") {
      fromDate = moment().format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    }

    if (orderPerformaceDurationFilter !== "custom") {
      const reqData = {
        start_date: fromDate,
        end_date: toDate,
      };
      this.props.enableLoading();
      this.props.getRestaurantVendorEarning(reqData, (response) => {
        this.props.disableLoading();
        if (response.status === 200) {
          this.setState({
            restaurantEarnings: {
              ...this.state.restaurantEarnings,
              ...response.data.data,
            },
          });
        }
      });
    }
  };

  createWeekCalender = () => {
    let curr = new Date();
    let weekArray = [];
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first));
      weekArray.push(day);
    }
    let newWeekDatesArray = weekArray.map((d) => d.toString());
    this.setState({
      dates: newWeekDatesArray,
    });
  };

  renderDates = (dates) => {
    const { selectedDateForOrders, index } = this.state;
    return dates.map((el, i) => {
      let a = selectedDateForOrders;
      let b = moment(new Date(el)).format("YYYY-MM-DD");
      return (
        <li
          key={`${i}_weekly_date`}
          onClick={() => {
            this.setState({
              index: i,
              selectedDateForOrders: moment(new Date(el)).format("YYYY-MM-DD"),
            });
            this.getRestaurantVendorOrderForSelectedDate(el);
          }}
          style={{ cursor: "pointer" }}
        >
          <span className={a == b ? "active" : ""}>{displayDate(el)}</span>
        </li>
      );
    });
  };

  renderCalender = () => {
    const { dates, selectedDateForOrders } = this.state;
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span>
                {displayCalenderDate(
                  selectedDateForOrders ? selectedDateForOrders : Date.now()
                )}
              </span>
            </li>
          </ul>
        </div>
        <ul className="weekdays">
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <ul className="days">{dates.length && this.renderDates(dates)}</ul>
      </div>
    );
  };
  /**
   * @method Calculate max_of_three
   * @description max_of_three number
   */
  max_of_three = (x, y, z) => {
    let max_val = 0;
    if (x > y) {
      max_val = x;
    } else {
      max_val = y;
    }
    if (z > max_val) {
      max_val = z;
    }
    return max_val;
  };

  getRestaurantVendorOrderForSelectedDate = (date) => {
    console.log(date, "dateeeeee");
    const orderDate = moment(date).format("YYYY-MM-DD");
    this.setState(
      {
        selectedDateForOrders: orderDate,
      },
      () => {
        if (orderDate) {
          this.props.enableLoading();
          const req = {
            from_date: this.state.monthStart,
            to_date: this.state.monthEnd,
          };
          this.props.getRestaurantVendorOrderByMonth(req, (response) => {
            this.props.disableLoading();
            if (response.status === 200) {
              var as = JSON.stringify(response.data.data);
              var as1 = JSON.parse(as);

              if (as1) {
                let message = as1; // VENDOR_RESTAURANT_DASHBOARD_DATA;
                const allowed = [orderDate];
                console.log(message, "messageeeeeeees");
                const selectedDateSlots = Object.keys(message)
                  .filter((key) => allowed.includes(key))
                  .reduce((obj, key) => {
                    console.log(key, "keyyyy");
                    obj[key] = message[key];
                    return obj;
                  }, {});
                const ordersArray = selectedDateSlots[orderDate];
                console.log(ordersArray, "messagess");
                this.setState({ monthdata: message });
                this.setState({ selectedDateOrdersList: ordersArray });
              }
            }
          });
        }
      }
    );
  };

  onChangeBookingDates = (value) => {
    console.log(value, "value");
    this.getRestaurantVendorOrderForSelectedDate(value);
  };

  onChangeCalendarView = (view) => {
    console.log(view, "viewwwwwww");
    if (view == "week") {
      this.setState({ dropdown_label: "This Week" });
    } else if (view == "Today") {
      this.setState({ dropdown_label: "Today" });
    } else if (view == "month") {
      this.setState({ dropdown_label: "This Month" });
    }
    this.setState(
      {
        calendarView: view,
        selectedDateForOrders: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.createWeekCalender();
        }
        this.getRestaurantVendorOrderForSelectedDate(new Date());
      }
    );
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
      let currentTimeStamp = moment(moment().format("YYYY-MM-DD HH:mm:ss"));
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

  checkOrderStatusLabel = (orderStatusDisplayVendor) => {
    let statusButtonLabel = getOrderStatus(orderStatusDisplayVendor);
    return statusButtonLabel.length > 0
      ? statusButtonLabel[0].label
      : orderStatusDisplayVendor;
  };

  renderOrders = () => {
    if (
      this.state.selectedDateOrdersList &&
      this.state.selectedDateOrdersList.length > 0
    ) {
      return (
        <Fragment>
          {this.state.selectedDateOrdersList.map((value, i) => {
            let disPlaystatus = this.checkOrderStatusLabel(
              value.order_status_display_vendor
            );
            return (
              <div className="my-new-order-block">
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
                      <div className="profile-name">
                        {value.name}
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={8}
                    xl={8}
                    className="align-right"
                  >
                    {this.renderCountDownTimer(value)}
                  </Col>
                </Row>
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <div className="fm-total-price">
                      <span> Total ${value.order_grandtotal}</span>
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={8}
                    xl={8}
                    className="align-right"
                  >
                    <span className="fm-btndeleteicon">
                      <Button
                        type="default"
                        className={getStatusColor(disPlaystatus)}
                      >
                        {disPlaystatus}
                      </Button>
                    </span>
                  </Col>
                </Row>
              </div>
            );
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

  onChangeOrderPerformanceDurationFilter = (view) => {
    this.setState({ orderPerformaceDurationFilter: view }, () => {
      this.getRestaurantEarning();
    });
  };

  percentage = (totalValue, partialValue) => {
    let c = (parseFloat(totalValue) * parseFloat(partialValue)) / 100;
    return parseFloat(c);

    //return (100 * partialValue) / totalValue;
  };

  /**
   * @method onFinishFailed
   * @description handle form submission failed
   */
  onFinishFailed = (errorInfo) => {
    return errorInfo;
  };

  onSearchByDate = (values) => {
    const { orderPerformaceDurationFilter } = this.state;
    if (this.onFinishFailed() !== undefined) {
      return true;
    } else {
      if (orderPerformaceDurationFilter === "custom") {
        const reqData = {
          start_date: moment(values.from_date).format("YYYY-MM-DD"),
          end_date: moment(values.to_date).format("YYYY-MM-DD"),
        };
        this.props.enableLoading();
        this.props.getRestaurantVendorEarning(reqData, (response) => {
          this.props.disableLoading();
          if (response.status === 200) {
            this.setState({
              restaurantEarnings: {
                ...this.state.restaurantEarnings,
                ...response.data.data,
              },
            });
          }
        });
      }
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      dashboardDetails,
      calendarView,
      restaurantEarnings,
      selectedDateOrdersList,
      monthdata,
    } = this.state;
    console.log(monthdata, "monthdata");
    let { completed, not_completed, pending, total_orders } =
      restaurantEarnings;
    let completedOrderPercent = this.percentage(total_orders, completed);
    let pendingOrderPercent = this.percentage(total_orders, pending);
    let cancelOrderPercent = this.percentage(total_orders, not_completed);
    const config = {
      forceFit: false,
      title: {
        visible: true,
        text: "Ring chart-indicator card",
      },
      description: {
        visible: false,
        text: "The ring chart indicator card can replace tooltip\uFF0C to display detailed information of each category in the hollowed-out part of the ring chart\u3002",
      },
      radius: 0.1,
      padding: "auto",
      angleField: "value",
      colorField: "type",
      statistic: { visible: true },
    };

    const pieDataChart = [
      {
        x: "Completed",
        y: completed,
      },
      {
        x: "Pending",
        y: pending,
      },
      {
        x: "Cancelled",
        y: not_completed,
      },
    ];

    return (
      <Layout className="event-booking-profile-wrap fm-restaurant-vendor-wrap ">
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box restaurant-vendor-dashboard-parent-block"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="profile-content-box">
                  <Row>
                    <Col xs={24} md={24} lg={24} xl={24}>
                      <div className="heading-search-block">
                        <div className="header-serch-tab-block">
                          <div className="heading-text">
                            <Button className="orange-btn">My Dashboard</Button>
                          </div>
                          {/* <div className="right btn-right-block">
                            <Button
                              onClick={() =>
                                window.location.assign("/restaurant-my-orders")
                              }
                              className="orange-btn"
                            >
                              My Order
                            </Button>
                          </div> */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search Dashboard"
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                            onChange={(e) => {
                              const { selectedDateForOrders, flag } =
                                this.state;
                              //this.getDashBoardDetails(selectedDateForOrders, flag, 1, e.target.value)
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div> */}
                <div className="search-block">
                  <Input
                    placeholder="Search Dashboard"
                    prefix={<SearchOutlined className="site-form-item-icon" />}
                    onChange={this.handleBookingPageChange}
                  />
                </div>
                <div className="profile-content-box mb-0">
                  <Row gutter={30}>
                    <Col
                      xs={24}
                      md={24}
                      lg={16}
                      xl={16}
                      className="employer-left-block"
                    >
                      <Card
                        className="dashboard-left-calnder-block"
                        title="Latest Activity"
                        extra={
                          <div className="card-header-select">
                            <label>Sort:</label>
                            <Select
                              onChange={(e) => {
                                this.onChangeCalendarView(e);
                              }}
                              defaultValue="This week"
                              dropdownMatchSelectWidth={false}
                              dropdownClassName="filter-dropdown"
                            >
                              <Option value="today">Today</Option>
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                              {/* <Option value="This year">This year</Option> */}
                            </Select>
                          </div>
                        }
                      >
                        <Row>
                          <Col className="gutter-row" md={24}>
                            {calendarView === "week"
                              ? this.renderCalender()
                              : null}
                          </Col>
                        </Row>
                        <Divider className="m-0" />
                        <div className="restaurant-vendor-dashboard-order-listing">
                          <div className="notify-blue-text">
                            You have{" "}
                            {selectedDateOrdersList &&
                            selectedDateOrdersList.length
                              ? selectedDateOrdersList.length
                              : 0}{" "}
                            order on this day
                          </div>
                          <div className="pf-vend-restau-myodr shadow-none pf-vend-spa-booking">
                            <Card
                              className="profile-content-shadow-box"
                              bordered={false}
                              title=""
                            >
                              {this.renderOrders()}
                            </Card>
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col
                      xs={24}
                      md={24}
                      lg={8}
                      xl={8}
                      className="employer-right-block "
                    >
                      <Card
                        className="pie-chart"
                        title="Order Performance"
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              defaultValue="Weekly"
                              onChange={(e) =>
                                this.onChangeOrderPerformanceDurationFilter(e)
                              }
                            >
                              <Option value="monthly">Monthly</Option>
                              <Option value="weekly">Weekly</Option>
                              <Option value="today">Today</Option>
                              <Option value="custom">Custom</Option>
                            </Select>
                          </div>
                        }
                      >
                        <div>
                          <Row gutter={15}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              {this.state.orderPerformaceDurationFilter ===
                                "custom" && (
                                <div className="date-picker">
                                  <Form
                                    name="restaurant-vendor-dasboard"
                                    initialValues={{
                                      from_date: "",
                                      to_date: "",
                                    }}
                                    layout="horizontal"
                                    onFinish={this.onSearchByDate}
                                    onFinishFailed={this.onFinishFailed}
                                    scrollToFirstError
                                    id="restaurant-vendor-dasboard"
                                    ref={this.formRef}
                                  >
                                    <Form.Item
                                      label="From Date"
                                      name="from_date"
                                      rules={[required("")]}
                                    >
                                      <DatePicker
                                        getPopupContainer={(trigger) =>
                                          trigger.parentElement
                                        }
                                        format={"MM/DD/YYYY"}
                                        onChange={(e) => {
                                          let currentField =
                                            this.formRef.current &&
                                            this.formRef.current.getFieldsValue();
                                          currentField.to_date = "";
                                          this.formRef.current.setFieldsValue({
                                            ...currentField,
                                          });
                                        }}
                                        disabledDate={(current) => {
                                          var dateObj = new Date();
                                          dateObj.setDate(
                                            dateObj.getDate() - 1
                                          );
                                          return (
                                            current &&
                                            current.valueOf() < dateObj
                                          );
                                        }}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      label="To Date"
                                      name="to_date"
                                      rules={[required("")]}
                                    >
                                      <DatePicker
                                        getPopupContainer={(trigger) =>
                                          trigger.parentElement
                                        }
                                        format={"MM/DD/YYYY"}
                                        onChange={(e) => {}}
                                        disabledDate={(current) => {
                                          let currentField =
                                            this.formRef.current &&
                                            this.formRef.current.getFieldsValue();
                                          let startDate =
                                            currentField.from_date;
                                          return (
                                            current &&
                                            current.valueOf() < startDate
                                          );
                                        }}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      label="Search"
                                      className="label-search"
                                    >
                                      <Button
                                        htmlType="submit"
                                        type="primary"
                                        size="middle"
                                        className="fm-btn"
                                      >
                                        <SearchOutlined className="site-form-item-icon" />
                                      </Button>
                                    </Form.Item>
                                  </Form>
                                </div>
                              )}
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                              <Pie
                                {...config}
                                hasLegend={false}
                                title="Promotion"
                                subTitle=""
                                // total={() => {

                                //   let total = this.max_of_three(completedOrderPercent, pendingOrderPercent,  cancelOrderPercent )
                                //   return (
                                //     <span
                                //       dangerouslySetInnerHTML={{
                                //         __html: total !== undefined && total ? total + '%' : 0 + '%'
                                //         // yuan(salesPieData.reduce((pre, now) => now.y + pre, 0)),
                                //       }}
                                //     />
                                //   )
                                // }}
                                data={pieDataChart}
                                colors={["#00FF7F", "#4B0082", "#EE4928"]}
                                valueFormat={(val) => <div></div>}
                                height={215}
                              />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                              <ul className="pie-right-content">
                                <li className="green">{"Completed"}</li>
                                <li className="violate">{"Pending"}</li>
                                <li className="red">{"Cancelled"}</li>
                              </ul>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                      {/* comment by RY 27-11-2020
                      <div className="add-figure">
                        <div className='company-name active'>
                          <Text ><div className="value">{total_orders}</div><div className="text" style={{ marginTop: "5px" }}>All Orders</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{completed}</div><div className="text" style={{ marginTop: "5px" }}>Completed</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{pending}</div><div className="text">Pending</div></Text>
                        </div>
                        <div className='company-name'>
                          <Text ><div className="value">{not_completed}</div><div className="text" style={{ marginTop: "5px" }}>Cancelled</div></Text>
                        </div>
                      </div> */}

                      <Row gutter={[10, 20]} className="pt-20">
                        <Col md={12}>
                          <div className="dark-orange color-box">
                            <Title level="3">{total_orders}</Title>
                            <Text>All Orders</Text>
                          </div>
                        </Col>
                        <Col md={12} className="">
                          <div className="light-orange color-box">
                            <Title level="3">{completed}</Title>
                            <small>Completed</small>
                          </div>
                        </Col>
                        <Col md={12} className="">
                          <div className="light-yellow color-box">
                            <Title level="3">{pending}</Title>
                            <small>Pending</small>
                          </div>
                        </Col>
                        <Col md={12} className="">
                          <div className="dark-yellow color-box">
                            <Title level="3">{not_completed}</Title>
                            <small>Cancelled</small>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
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
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
  getRestaurantVendorOrderByMonth,
  getRestaurantVendorEarning,
})(RestaurantVendorDashboard);
