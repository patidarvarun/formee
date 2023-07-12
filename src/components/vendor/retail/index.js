import React from "react";
import { connect } from "react-redux";
import {
  Empty,
  Divider,
  Layout,
  Card,
  Typography,
  Button,
  Dropdown,
  Row,
  Col,
  Input,
  Menu,
  Select,
} from "antd";
import AppSidebar from "../../dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import PostAdPermission from "../../classified-templates/PostAdPermission";
import {
  getRetailDashboardAPI,
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
} from "../../../actions";
import { Pie } from "ant-design-pro/lib/Charts";
import "ant-design-pro/dist/ant-design-pro.css";
import { langs } from "../../../config/localization";
import { DASHBOARD_KEYS } from "../../../config/Constant";
import {
  SearchOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  displayCalenderDate,
  displayDate,
  dateFormate4
} from "../../common";
import { getStatusColor } from "../../../config/Helper";
import StylingCalendar from "../../dashboard/Common-Calendar";
import { salaryNumberFormate } from '../../common'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../config/Config";
const { Option } = Select;
const { Title, Text } = Typography;
let today = Date.now();
const { TextArea } = Input;

class VendorRetailDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: moment(today).format("YYYY-MM-DD"),
      index: "",
      calendarView: "week",
      monthStart: "",
      monthEnd: "",
      weekStart: "",
      weekEnd: "",
      flag: "",
      selectedMode: "month",
      startDate: "",
      endDate: "",
      search_keyword: "",
      dropdown_label: 'This month',
      compare_visible: false,
      activityFilter: {
        start: '',
        end: ''
      },
      graphFilter: {
        start: '',
        end: '',
        lastStart: '',
        lastEnd: ''
      },
      currentEarning: 0,
      lastEarning: 0
    };
  }

  /**
   * @method  componentDidMount
   * @description component did mount 
   */
  componentDidMount() {
    const { loggedInUser } = this.props;

    if (loggedInUser) {
      this.getDates()
      // this.props.getTraderProfile({ user_id: loggedInUser.id });
      // this.getDashBoardDetails(selectedDate, flag, page, "");
    }

    // var input = new Date();

    // var result = days();
    // let date = result.map((d) => d.toString());
    // this.setState({ dates: date, ...getStartEndDate(input) }, () => {
    //   console.log('activityFilter: ', activityFilter);
    //   if (loggedInUser) {
    //     this.props.getTraderProfile({ user_id: loggedInUser.id });
    //     this.getDashBoardDetailsByCalendarView(
    //       graphFilter.start,
    //       graphFilter.end,
    //       '',
    //       1,
    //       '',
    //       activityFilter.start,
    //       activityFilter.end
    //     );
    //   }
    // });

  }

  /**
  * @method  get DashBoard Details used By calendar view
  * @description get detail
  */
  getDashBoardDetailsByCalendarView = (
    start,
    end,
    flag,
    page,
    search_keyword,
    start_act,
    end_act,
    mode,
    lastStartDate,
    lastEndDate
  ) => {
    // this.setState({ selectedDate: selectedDate, flag: flag, page: page })
    const { loggedInUser } = this.props;
    const { activityFilter, graphFilter } = this.state;
    console.log(graphFilter, 'activity: $$$');
    let reqData = {
      user_id: loggedInUser.id,
      created_date: mode === 'date' ? start_act : '',
      from_date: start ? start : graphFilter.start, //This field used only when we need to pass date range, else this will be empty
      to_date: end ? end : graphFilter.end, //This field used only when we need to pass date range,
      last_from_date: lastStartDate ? lastStartDate : graphFilter.lastStart, //This field used only when we need to pass date range, else this will be empty
      last_to_date: lastEndDate ? lastEndDate : graphFilter.lastEnd, //This field used only when we need to pass date range,

      activity_from_date: mode === 'date' ? '' : start_act ? start_act : activityFilter.start,
      activity_to_date: mode === 'date' ? '' : end_act ? end_act : activityFilter.end,
    };
    console.log('reqData: $$$ ', reqData);
    this.props.enableLoading()
    this.props.getRetailDashboardAPI(reqData, (res) => {
      console.log('res: &&*', res);
      this.props.disableLoading();

      if (res.data.success && res.data.success.status == 1) {
        this.setState({
          dashboardDetails: res.data.success.data,
          currentEarning: res.data.success.data.this_month_sum,
          lastEarning: res.data.success.data.last_month_sum,
          flag: flag,
          activityFilter: (start_act && end_act) ? { start: start_act, end: end_act } : activityFilter,
          graphFilter: (start && end) ? { start, end, ...graphFilter } : graphFilter,

        });
      }
    });
  };


  /**
  * @method  getDates
  * @description get dates
  */
  getDates = () => {
    const { activityFilter, graphFilter } = this.state;
    const { loggedInUser } = this.props;

    function days() {
      let curr = new Date
      let week = []
      for (let i = 0; i < 7; i++) {
        let first = curr.getDate() - curr.getDay() + i
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        week.push(day)
      }
      return week;
    }
    var input = new Date();
    var result = days(input);
    let date = result.map((d) => d.toString());


    let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
    let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0);
    let lastMonthFirstDay = new Date(input.getFullYear(), input.getMonth() - 1, 1);
    var lastMonthLastDay = new Date(input.getFullYear(), input.getMonth(), 0);
    console.log(moment(lastMonthFirstDay).format("YYYY-MM-DD"), 'lastMonthLastDay: ', lastMonthLastDay);

    // let first = input.getDate() - input.getDay(); // First day is the day of the month - the day of the week
    // let last = first + 6; // last day is the first day + 6

    // let firstday = new Date(input.setDate(first)).toUTCString();
    // let lastday = new Date(input.setDate(last)).toUTCString();

    this.setState({
      monthStart: moment(startOfMonth).format("YYYY-MM-DD"),
      monthEnd: moment(endOfMonth).format("YYYY-MM-DD"),
      lastMonthStartDate: moment(lastMonthFirstDay).format("YYYY-MM-DD"),
      lastMonthStartDate: moment(lastMonthLastDay).format("YYYY-MM-DD"),
      weekStart: moment().startOf('week').format("YYYY-MM-DD"),
      weekEnd: moment().endOf('week').format("YYYY-MM-DD"),
      dates: date,
      activityFilter: { start: moment().startOf('week').format("YYYY-MM-DD"), end: moment().endOf('week').format("YYYY-MM-DD") },
      graphFilter: {
        start: moment(startOfMonth).format("YYYY-MM-DD"),
        end: moment(endOfMonth).format("YYYY-MM-DD"),
        lastStart: moment(lastMonthFirstDay).format("YYYY-MM-DD"),
        lastEnd: moment(lastMonthLastDay).format("YYYY-MM-DD")
      },

    }, () => {
      if (loggedInUser) {

        console.log(this.state.graphFilter, ' $$$ 1 activityFilter: ');
        this.props.getTraderProfile({ user_id: loggedInUser.id });
        this.getDashBoardDetailsByCalendarView(
          this.state.graphFilter.start,
          this.state.graphFilter.end,
          '',
          1,
          '',
          this.state.activityFilter.start,
          this.state.activityFilter.end,
          '',
          this.state.graphFilter.lastStart,
          this.state.graphFilter.lastEnd,
        );
      }
    });
  }

  /**
   * @method  get DashBoard Details
   * @description get classified
   */
  getDashBoardDetails = (selectedDate, flag, page, search_keyword) => {
    this.setState({ selectedDate: selectedDate, flag: flag, page: page, search_keyword: search_keyword });
    const { loggedInUser } = this.props;
    const { monthEnd, monthStart, weekStart, weekEnd } = this.state;
    let reqData = {
      user_id: loggedInUser.id,
      activity_from_date: flag === "week" ? weekStart : flag === "month" ? monthStart : selectedDate, //This field used only when we need to pass date range, else this will be empty
      activity_to_date: flag === "week" ? weekEnd : flag === "month" ? monthEnd : selectedDate,
      from_date: flag === "week" ? weekStart : flag === "month" ? monthStart : selectedDate, //This field used only when we need to pass date range, else this will be empty
      to_date: flag === "week" ? weekEnd : flag === "month" ? monthEnd : selectedDate,//This field used only when we need to pass date range,
      search_keyword: search_keyword ? search_keyword : this.state.search_keyword,
      activity_per_page: 10,
      page: page
    };
    this.getDetails(reqData, flag)
  };

  /**
   * @method  get DashBoard Details used By calendar view
   * @description get detail
   */
  // getDashBoardDetailsByCalendarView = (start,end,flag,page,search_keyword) => {
  //   const { loggedInUser } = this.props;
  //   const { selectedDate } = this.state;
  //   let reqData = {
  //     user_id: loggedInUser.id,
  //     created_date: "",
  //     from_date: start ? start : selectedDate, //This field used only when we need to pass date range, else this will be empty
  //     to_date: end ? end : selectedDate, 
  //     activity_from_date: start ? start : selectedDate, //This field used only when we need to pass date range, else this will be empty
  //     activity_to_date: end ? end : selectedDate,//This field used only when we need to pass date range,
  //     search_keyword: search_keyword
  //     ? search_keyword
  //     : this.state.search_keyword,
  //     activity_per_page:10,
  //     page:page
  //   };
  //   this.setState({monthStart: start,monthEnd: end,search_keyword: search_keyword});
  //   this.getDetails(reqData, flag)
  // };

  /**
   * @method  get getDetails
   * @description get retail dashboard api details
   */
  getDetails = (reqData, flag) => {
    this.props.enableLoading();
    this.props.getRetailDashboardAPI(reqData, (res) => {
      this.props.disableLoading();
      if (res.data && res.data.success && res.data.success.data) {
        this.setState({ dashboardDetails: res.data.success.data, flag: flag });
      }
    });
  }

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { selectedDate, flag } = this.state;
    this.getDashBoardDetails(selectedDate, flag, e, "");
  };

  /**
   * @method  renderDates
   * @description get retail dashboard api details
   */
  renderDates = (dates) => {
    const { selectedDate } = this.state;
    return dates.map((el, i) => {
      let a = selectedDate;
      let b = moment(new Date(el)).format("YYYY-MM-DD");
      return (
        <li key={i}
          onClick={() => {
            this.setState({ index: i, selectedDate: moment(new Date(el)).format("YYYY-MM-DD") });
            this.getDashBoardDetails(moment(el).format("YYYY-MM-DD"), "", 1, "");
          }}
          style={{ cursor: "pointer" }}
        >
          <span className={a == b ? "active" : ""}>{displayDate(el)}</span>
        </li>
      );
    });
  };

  /**
   * @method  renderCalender
   * @description render custum week calender
   */
  renderCalender = () => {
    const { dates, selectedDate } = this.state;
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span>
                {displayCalenderDate(selectedDate ? selectedDate : Date.now())}
              </span>
            </li>
          </ul>
        </div>
        <ul className="weekdays">
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
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

  /**
   * @method renderTotalEarning
   * @description render total earning block
   */
  renderTotalEarning = (price, percentage) => {
    const { currentEarning, lastEarning } = this.state
    let increaseRate = 100
    let decreaseRate = 100
    let cEarn = 100
    // Number(currentEarning);
    let lEarn = 90
    Number(lastEarning)
    console.log(lEarn, 'lEarn:  **', cEarn);

    if (cEarn > lEarn && lEarn !== 0) {
      // The percentage increase from 30 to 40 is:  
      // (40-30)/30 * 100 = 33%  

      increaseRate = (cEarn - lEarn) / lEarn * 100
    } else if (cEarn < lEarn && cEarn !== 0) {
      // The percentage decrease from 40 to 30 is:
      // (40-30)/40 * 100 = 25%. 
      console.log(cEarn, 'lEarn: &&8', lEarn - cEarn);

      decreaseRate = (lEarn - cEarn) / cEarn * 100
    }
    //console.log(decreaseRate, 'increaseRate: &&8', increaseRate);
    return (
      <Title level={2}>
        <span className="dark-text">
          {salaryNumberFormate(price)}
          <span className="pecentage-value">
            {" "}
            {cEarn > lEarn ? <CaretUpOutlined /> : <CaretDownOutlined />} {lEarn === 0 ? '0 earning in last month' : cEarn === 0 ? `${lEarn}00%` : cEarn > lEarn ? `${increaseRate.toFixed(2)}%` : `${decreaseRate.toFixed(2)}%`}
          </span>
        </span>
      </Title>
    )
  }

  /**
  * @method renderEarningDetail
  * @description render earning details
  */
  renderEarningDetail = () => {
    const { dropdown_label, compare_visible, weekStart, weekEnd } = this.state
    const menu = (
      <Menu onClick={(e) => {
        let label = e.key === 'year' ? 'This Year' : 'This Month'
        if (e.key === 'year') {
          const currentYear = new Date().getFullYear();
          const previousYear = currentYear - 1;

          let currentYearStartDate = moment(new Date(currentYear, 0, 1)).format("YYYY-MM-DD");
          let currentYearEndDate = moment(new Date(currentYear, 11, 31)).format("YYYY-MM-DD");
          let lastYearStartDate = moment(new Date(previousYear, 0, 1)).format("YYYY-MM-DD");
          let lastYearEndDate = moment(new Date(previousYear, 11, 31)).format("YYYY-MM-DD");

          console.log(currentYearStartDate, 'this.year: ', currentYearEndDate);
          console.log(lastYearStartDate, 'last.year: ', lastYearEndDate);

          this.getDashBoardDetailsByCalendarView(
            currentYearStartDate,
            currentYearEndDate,
            '',
            1,
            '',
            '',
            '',
            '',
            lastYearStartDate,
            lastYearEndDate
          );
        } else if (e.key === 'month') {
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth();

          let currentMonthStartDate = moment(new Date(currentYear, currentMonth, 1)).format("YYYY-MM-DD");
          let currentMonthEndDate = moment(new Date(currentYear, currentMonth + 1, 0)).format("YYYY-MM-DD");

          let lastMonthStartDate = moment(new Date(currentYear, currentMonth - 1, 1)).format("YYYY-MM-DD");
          let lastMonthEndDate = moment(new Date(currentYear, (currentMonth - 1) + 1, 0)).format("YYYY-MM-DD");

          console.log(lastMonthEndDate, 'this.month: ', lastMonthStartDate);
          this.getDashBoardDetailsByCalendarView(
            currentMonthStartDate,
            currentMonthEndDate,
            '',
            1,
            '',
            '',
            '',
            '',
            lastMonthStartDate,
            lastMonthEndDate
          );

        }
        this.setState({ dropdown_label: label })
      }}>
        <Menu.Item key="month">This Month</Menu.Item>
        <Menu.Item key="year">This Year</Menu.Item>
      </Menu>
    );
    console.log('dropdown_label', dropdown_label)
    return (
      <Card className="pie-chart mb-20">
        <div className="heading-block">
          <div>
            <Dropdown overlay={menu}>
              <Button>
                {dropdown_label}
                <CaretDownOutlined
                  style={{ fontSize: "11px", color: "#363B40" }}
                />
              </Button>
            </Dropdown>
          </div>
          <div className="currancy">{"AUD"}</div>
        </div>
        <div className="total-earnings-detail-block">
          <Title level={4}>Total earnings</Title>
          {!compare_visible && this.renderTotalEarning(this.state.currentEarning, '34')}
          {/* {compare_visible && <Row>
            <Col md={12}>
              Last month
              {this.renderTotalEarning('4556', '34')}
            </Col>
            <Col md={12}>
              This month
              {this.renderTotalEarning('3456', '34')}
            </Col>
          </Row>}
         */}
          {<Text
            className="subtitle-txt"
          // onClick={() => {
          //   this.setState({ compare_visible: !this.state.compare_visible })
          // }}
          >
            Compared to last month
          </Text>}
        </div>
      </Card>
    );
  };

  /**
   * @method calculatePercentage
   * @description calclu
   */
  calculatePercentage = (value, total) => {
    if (value && total) {
      console.log('value', value, total)

      let per = (Number(value) / Number(total)) * 100
      console.log('per', per)
      return per.toFixed(0)
    } else {
      return 0
    }
  }

  /**
   * @method renderChart
   * @description render pie chart
   */
  renderChart = (chartName, item) => {
    let label1 = item && item.pending_count ? Number(item.pending_count) : 0;
    let label2 = item && item.shipped_count ? Number(item.shipped_count) : 0;
    let label3 =
      item && item.completed_count ? Number(item.completed_count) : 0;
    let label4 = item && item.cancel_count ? Number(item.cancel_count) : 0;
    let total_count = label1 + label2 + label3 + label4
    const pieDataChart = [
      {
        x: "Pending",
        y: item && item.pending_count ? Number(item.pending_count) : 0,
      },
      {
        x: "Shipped",
        y: item && item.shipped_count ? Number(item.shipped_count) : 0,
      },
      {
        x: "Completed",
        y: item && item.completed_count ? Number(item.completed_count) : 0,
      },
      {
        x: "Cancel",
        y: item && item.cancel_count ? Number(item.cancel_count) : 0,
      },
    ];
    const config = {
      forceFit: false,
      title: {
        visible: true,
        text: "Ring chart-indicator card",
      },
      description: {
        visible: false,
        text:
          "The ring chart indicator card can replace tooltip\uFF0C to display detailed information of each category in the hollowed-out part of the ring chart\u3002",
      },
      radius: 0.1,
      padding: "auto",
      // data: salesPieData,
      angleField: "value",
      colorField: "type",
      statistic: { visible: true },
    };

    return (
      <Card
        className="pie-chart"
        title={chartName}
      >
        <div>
          <Row gutter={15}>
            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
              <Pie
                {...config}
                hasLegend={false}
                title="Shipment"
                subTitle=""
                total={() => {
                  let total = this.max_of_three(label1, label2, label3);
                  return (
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          total !== undefined && total ? total + "%" : 0 + "%",
                      }}
                    />
                  );
                }}
                data={pieDataChart}
                colors={["#00FF7F", "#4B0082", "#FFA500	", "#ee4928"]}
                valueFormat={(val) => <div></div>}
                height={215}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
              <ul className="pie-right-content">
                <li className="yellow">{`${this.calculatePercentage(label1, total_count)}% Pending`}</li>
                <li className="violate">{`${this.calculatePercentage(label2, total_count)}% Shipped`}</li>
                <li className="green">{`${this.calculatePercentage(label3, total_count)}% Completed`}</li>
                <li className="red">{`${this.calculatePercentage(label4, total_count)}% Cancelled`}</li>
              </ul>
            </Col>
          </Row>
        </div>
      </Card>
    );
  };

  /**
   * @method renderItemListing
   * @description render product item listing
   */
  renderItemListing = (dashboardDetails) => {
    console.log('dashboardDetails: &&* ', dashboardDetails);
    if (
      dashboardDetails &&
      dashboardDetails.latest_activity_new &&
      Array.isArray(dashboardDetails.latest_activity_new.data) &&
      dashboardDetails.latest_activity_new.data.length
    ) {
      return dashboardDetails.latest_activity_new.data.map((el, i) => {
        console.log('el: &&*', el);
        return (
          <div className="my-new-order-block" key={i}>
            <Row gutter={0}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={8}
                xl={8}
                style={{ borderRight: "1px solid #E3E9EF" }}
              >
                <div className="order-profile-detail">
                  <div className="odr-no">
                    <h2>{el.activity_name}</h2>
                  </div>
                  <div className="order-profile">
                    <div className="profile-pic">
                      <img
                        alt="test"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE_CARD;
                        }}
                        src={el.vendor.image_thumbnail ? el.vendor.image_thumbnail : DEFAULT_IMAGE_CARD}
                      />
                    </div>
                    <div className="profile-name">{el.vendor.name}</div>
                  </div>
                  <div class="pink-small">
                    {el.retail_detail && <span>{el.retail_detail.categoriesname.name}</span>}
                    {el.retail_detail && <span>{el.retail_detail.subcategoriesname.name}</span>}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                <div className="order-middle-block">
                  {el.suborder && <h2>{el.suborder.item_name}</h2>}
                  {el.suborder && <div className="qty-size">
                    <div className="qty-size-label">Qty</div>
                    <div className="qty-size-val">{el.suborder.item_qty}</div>
                  </div>}
                  {el.suborder && <div className="qty-size">
                    <div className="qty-size-label">Size</div>
                    <div className="qty-size-val">32</div>
                  </div>}
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={5}
                xl={5}
                className="align-right"
              >
                <div className="amt-status-detail">
                  {el.suborder && <div className="amt-big-txt">{`AU$${parseInt(
                    el.suborder.item_total_amt
                  )}`}</div>}
                  {el.suborder && <Button
                    type="default"
                    className={getStatusColor(el.order_status)}
                  >
                    <span class="dot-color"></span>
                    {el.suborder.order_status}
                  </Button>}
                  <div className="date">{el.suborder ? dateFormate4(el.suborder.created_at) : dateFormate4(el.created_at)}</div>
                </div>
              </Col>
            </Row>
          </div>
        );
      });
    } else {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
  };

  /**
   * @method renderStatisticsCards
   * @description render statistics
   */
  renderStatisticsCards = (item) => {
    return (
      <Row gutter={[10, 20]} className="pt-20">
        <Col md={12}>
          <div className="dark-orange color-box">
            <Title level="3">{item.all_order_count}</Title>
            <Text>{"All Orders"}</Text>
          </div>
        </Col>
        <Col md={12} className="">
          <div className="light-orange color-box">
            <Title level="3">{item.shipped_count}</Title>
            <small> {"Shipped"}</small>
          </div>
        </Col>
        <Col md={12} className="">
          <div className="light-yellow color-box">
            <Title level="3">{item.delivered_package_count}</Title>
            <small> {"Delivered"} </small>
          </div>
        </Col>
        <Col md={12} className="">
          <div className="dark-yellow color-box">
            <Title level="3">{item.exception_count}</Title>
            <small> {"Exceptions"} </small>
          </div>
        </Col>
      </Row>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      dashboardDetails,
      calendarView,
      selectedMode,
      monthStart,
      weekEnd,
      weekStart,
      monthEnd,
      search_keyword,
    } = this.state;

    const { loggedInUser } = this.props;
    let merchant = loggedInUser.role_slug === langs.key.merchant;
    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box dasbaord-only employee-dashborad-box-v2 retail-vendor-dashborad-box-v2"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="profile-content-box">
                  <div className="heading-search-block">
                    <div className="">
                      <Row gutter={0}>
                        <Col xs={24} md={20} lg={20} xl={20}>
                          <h1>
                            <span>My Dashboard</span>
                          </h1>
                          {/* <div className="search-block">
                            <Input
                              placeholder="Search Dashboard"
                              prefix={
                                <SearchOutlined className="site-form-item-icon" />
                              }
                              onChange={(e) => {
                                const { selectedDate, flag } = this.state;
                                this.getDashBoardDetails(
                                  selectedDate,
                                  flag,
                                  1,
                                  e.target.value
                                );
                              }}
                            />
                          </div> */}
                        </Col>
                        <Col xs={24} md={4} lg={4} xl={4}>
                          <PostAdPermission title={"Post Ad"} />
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <Row gutter={30}>
                    <Col xs={24} md={16} lg={16} xl={14}>
                      <Card
                        className="dashboard-left-calnder-block"
                        title="Latest Activity"
                        extra={
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              dropdownMatchSelectWidth={false}
                              onChange={(e) => {
                                this.setState({
                                  calendarView: e,
                                  selectedDate: moment(today).format(
                                    "YYYY-MM-DD"
                                  ),
                                });
                                if (e === "week") {
                                  let startDate = moment(today)
                                    .startOf("week")
                                    .format("YYYY-MM-DD");
                                  let endDate = moment(today)
                                    .endOf("week")
                                    .format("YYYY-MM-DD");
                                  this.getDashBoardDetailsByCalendarView(
                                    '',
                                    '',
                                    '',
                                    1,
                                    search_keyword,
                                    startDate,
                                    endDate,
                                    '',
                                    '',
                                    ''
                                  );
                                } else if (e === "month") {
                                  let startDate = moment(today)
                                    .startOf("month")
                                    .format("YYYY-MM-DD");
                                  let endDate = moment(today)
                                    .endOf("month")
                                    .format("YYYY-MM-DD");
                                  this.getDashBoardDetailsByCalendarView(
                                    '',
                                    '',
                                    '',
                                    1,
                                    search_keyword,
                                    startDate,
                                    endDate,
                                    '',
                                    '',
                                    ''
                                  );
                                }
                              }}
                              defaultValue="This week"
                            >
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                            </Select>
                          </div>
                        }
                      >
                        <Row>
                          <Col className="gutter-row" md={24}>
                            {calendarView === "week" ? (
                              this.renderCalender()
                            ) : (
                              <div className="common-year-calendar">
                                <StylingCalendar
                                  // events={dashboardDetails.job_user_listing_new.data}
                                  onPanelChange={(month, mode) => {
                                    console.log(month, 'mode: $$$  ', mode);
                                    if (mode === 'month') {
                                      console.log(mode, ' case 1enter in single', month)
                                      let startDate = moment(month)
                                        .startOf("month")
                                        .format("YYYY-MM-DD");
                                      let endDate = moment(month)
                                        .endOf("month")
                                        .format("YYYY-MM-DD");
                                      console.log(endDate, 'startDate: ', startDate);
                                      this.getDashBoardDetailsByCalendarView('', '', '', 1, search_keyword, startDate, endDate, '', '', '');
                                    } else {
                                      let date = moment(month).format("YYYY-MM-DD");
                                      console.log('case 2 enter in single', date)
                                      console.log('slectedDate: ', date);
                                      this.getDashBoardDetailsByCalendarView('', '', '', 1, search_keyword, date, '', 'date', '', '');
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </Col>
                        </Row>
                        <Divider />
                        <div className="profile-vendor-retail-orderdetail">
                          {this.renderItemListing(dashboardDetails)}
                        </div>
                      </Card>
                    </Col>
                    <Col
                      xs={24}
                      md={8}
                      lg={8}
                      xl={10}
                      className="employer-right-block employer-performance-right-block"
                    >
                      {this.renderEarningDetail(dashboardDetails)}
                      {this.renderChart("Orders Performance", dashboardDetails)}
                      {dashboardDetails &&
                        this.renderStatisticsCards(dashboardDetails)}
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
  getRetailDashboardAPI,
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
})(VendorRetailDashboard);
