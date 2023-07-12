import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Layout,
  Calendar,
  Card,
  Typography,
  Button,
  Table,
  Avatar,
  Row,
  Col,
  Input,
  Select,
  Alert,
  Radio,
  Badge,
  Progress,
} from "antd";
import AppSidebar from "../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import Icon from "../../../../components/customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
  getCustomerDashBoardDetails,
} from "../../../../actions";
import "ant-design-pro/dist/ant-design-pro.css";
import { DEFAULT_IMAGE_TYPE, DASHBOARD_TYPES } from "../../../../config/Config";
import { langs } from "../../../../config/localization";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import {
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  displayCalenderDate,
  displayDate,
  dateFormate3,
  startTime,
  convertTime24To12Hour,
  convertHTMLToText,
} from "../../../common";
import "./userdetail.less";
import { DASHBOARD_LISTING } from "./static_data";
import LoadMore from "./LoadMore";
import { DeleteFilled } from "@ant-design/icons";
import MyCalenderWeeks from "./MyCalenderWeeks";
import MyCalendarMonthView from "./MyCalendarMonthView";
// import Dashboardtab from '../dashboard-tab';

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

class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    moment.updateLocale("en", {
      weekdaysMin: ["Sun", "M", "T", "W", "T", "F", "Sat"],
      week: {
        dow: 1, // First day of week is Monday
      },
    });

    this.state = {
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: moment().format("YYYY-MM-DD"),
      index: "",
      flag: "",
      calendarView: "week",
      currentMonth: parseInt(moment().format("MM")),
      currentYear: parseInt(moment().format("YYYY")),
      monthStart: moment().startOf("month").format("YYYY-MM-DD"),
      monthEnd: moment().endOf("month").format("YYYY-MM-DD"),
      weekStart: moment().startOf("week").format("YYYY-MM-DD"),
      weekEnd: moment().endOf("week").format("YYYY-MM-DD"),
      selectedDateForListingData: moment().format("YYYY-MM-DD"),
      selectedMyBookingsCalenderDate: new Date(),
      myCalenderView: "month",
      selectedBookingDate: new Date(),
      calenderBookingList: [],
      allDayCalenderBookingList: [],
      search_keyword: "",
      dashboardListing: [],
      filteredDashboardListing: [],
      monthData: [],
      totalRecords: 0,
      isMyCalenderToggle: false,
      myCalenderMode: "week",
      fromDate: moment().startOf("week").format("YYYY-MM-DD"), // for initial week view
      tillDate: moment().endOf("week").format("YYYY-MM-DD"), // for initial week view
      showMore: false,
      showLimit: 10,
      currentlyShowing: 10,
      totalShow: 0,
      isDataAvailable: false,
    };
  }

  componentDidMount() {
    const { loggedInUser } = this.props;
    if (loggedInUser) {
      this.getDashBoardListingData();
      // this.getDashBoardListingData(this.state.selectedDateForListingData);
      this.getBookingsForCalenderDate(
        this.state.selectedMyBookingsCalenderDate
      );
      this.getActivityInfo(this.state.selectedBookingDate);
    }
    this.createWeekCalender();
  }

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

  renderActivityIndicator = (date) => {
    const { dashboardListing } = this.state;
    let shouldRender = false;
    dashboardListing.forEach((activity) => {
      let transformedActivity = this.transformActivity(activity);
      if (
        transformedActivity.date &&
        moment(date).format("YYYY-MM-DD") ==
          moment(transformedActivity.date).format("YYYY-MM-DD")
      ) {
        shouldRender = true;
      }
    });
    if (shouldRender) {
      return <Badge status="success" className="activity-indicator" />;
    } else {
      return null;
    }
  };

  filterSelectedDate = (date) => {
    const { dashboardListing } = this.state;
    let filteredActivities = [];
    if (date) {
      dashboardListing.forEach((activity) => {
        let transformedActivity = this.transformActivity(activity);
        if (
          transformedActivity.date &&
          date == moment(transformedActivity.date).format("YYYY-MM-DD")
        ) {
          filteredActivities.push(activity);
        }
      });
    } else {
      filteredActivities = dashboardListing;
    }
    this.setState({
      filteredDashboardListing: filteredActivities,
      selectedDate: date,
      showMore: false,
    });
  };

  renderDates = () => {
    const { weekStart, selectedDateForListingData } = this.state;
    return (
      <>
        <li
          style={{ cursor: "pointer" }}
          onClick={() =>
            this.filterSelectedDate(moment(weekStart).format("YYYY-MM-DD"))
          }
        >
          <span
            className={
              selectedDateForListingData ==
              moment(weekStart).format("YYYY-MM-DD")
                ? "active"
                : ""
            }
          >
            {String(moment(weekStart).format("D"))}
          </span>
          {this.renderActivityIndicator(moment(weekStart).format("YYYY-MM-DD"))}
        </li>

        <li
          style={{ cursor: "pointer" }}
          onClick={() =>
            this.filterSelectedDate(
              moment(weekStart).add(1, "days").format("YYYY-MM-DD")
            )
          }
        >
          <span
            className={
              selectedDateForListingData ==
              moment(weekStart).add(1, "days").format("YYYY-MM-DD")
                ? "active"
                : ""
            }
          >
            {String(moment(weekStart).add(1, "days").format("D"))}
          </span>
          {this.renderActivityIndicator(
            moment(weekStart).add(1, "days").format("YYYY-MM-DD")
          )}
        </li>

        <li
          style={{ cursor: "pointer" }}
          onClick={() =>
            this.filterSelectedDate(
              moment(weekStart).add(2, "days").format("YYYY-MM-DD")
            )
          }
        >
          <span
            className={
              selectedDateForListingData ==
              moment(weekStart).add(2, "days").format("YYYY-MM-DD")
                ? "active"
                : ""
            }
          >
            {String(moment(weekStart).add(2, "days").format("D"))}
          </span>
          {this.renderActivityIndicator(
            moment(weekStart).add(2, "days").format("YYYY-MM-DD")
          )}
        </li>

        <li
          style={{ cursor: "pointer" }}
          onClick={() =>
            this.filterSelectedDate(
              moment(weekStart).add(3, "days").format("YYYY-MM-DD")
            )
          }
        >
          <span
            className={
              selectedDateForListingData ==
              moment(weekStart).add(3, "days").format("YYYY-MM-DD")
                ? "active"
                : ""
            }
          >
            {String(moment(weekStart).add(3, "days").format("D"))}
          </span>
          {this.renderActivityIndicator(
            moment(weekStart).add(3, "days").format("YYYY-MM-DD")
          )}
        </li>

        <li
          style={{ cursor: "pointer" }}
          onClick={() =>
            this.filterSelectedDate(
              moment(weekStart).add(4, "days").format("YYYY-MM-DD")
            )
          }
        >
          <span
            className={
              selectedDateForListingData ==
              moment(weekStart).add(4, "days").format("YYYY-MM-DD")
                ? "active"
                : ""
            }
          >
            {String(moment(weekStart).add(4, "days").format("D"))}
          </span>
          {this.renderActivityIndicator(
            moment(weekStart).add(4, "days").format("YYYY-MM-DD")
          )}
        </li>

        <li
          style={{ cursor: "pointer" }}
          onClick={() =>
            this.filterSelectedDate(
              moment(weekStart).add(5, "days").format("YYYY-MM-DD")
            )
          }
        >
          <span
            className={
              selectedDateForListingData ==
              moment(weekStart).add(5, "days").format("YYYY-MM-DD")
                ? "active"
                : ""
            }
          >
            {String(moment(weekStart).add(5, "days").format("D"))}
          </span>
          {this.renderActivityIndicator(
            moment(weekStart).add(5, "days").format("YYYY-MM-DD")
          )}
        </li>

        <li
          style={{ cursor: "pointer" }}
          onClick={() =>
            this.filterSelectedDate(
              moment(weekStart).add(6, "days").format("YYYY-MM-DD")
            )
          }
        >
          <span
            className={
              selectedDateForListingData ==
              moment(weekStart).add(6, "days").format("YYYY-MM-DD")
                ? "active"
                : ""
            }
          >
            {String(moment(weekStart).add(6, "days").format("D"))}
          </span>
          {this.renderActivityIndicator(
            moment(weekStart).add(6, "days").format("YYYY-MM-DD")
          )}
        </li>
      </>
    );
  };

  renderToday = () => {
    const { showMore } = this.state;
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var today = new Date();
    var dayName = days[today.getDay()];
    var monthName = monthNames[today.getMonth()];
    var date = today.getDate();
    var dateString = `${date} ${monthName}, ${dayName}`;
    return (
      <div
        className="today-date month ant-col-md-24 display-block"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <ul>
          <li>
            <span className="today-date">Today {dateString}</span>
          </li>
        </ul>
        {this.renderProgressBar()}
        <ul className="activities"> {this.renderActivities()} </ul>

        {showMore && (
          <div className="show-more">
            <div type="default" size={"middle"} onClick={this.loadMore}>
              {"Show More"}
            </div>
          </div>
        )}
      </div>
    );
  };

  renderCalender = () => {
    const { dates, selectedDateForListingData, showMore } = this.state;
    return (
      <div>
        <div className="month ant-col-md-24 display-block">
          <ul>
            <li>
              <span>
                <LeftOutlined /> {moment().startOf("week").format("D")} -{" "}
                {moment().endOf("week").format("D MMM")} <RightOutlined />
              </span>
            </li>
          </ul>
        </div>
        <div className="weekdays-outer">
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
          {this.renderProgressBar()}
          <ul className="activities">{this.renderActivities("week")}</ul>
        </div>

        {showMore && (
          <div className="show-more">
            <div type="default" size={"middle"} onClick={this.loadMore}>
              {"Show More"}
            </div>
          </div>
        )}
      </div>
    );
  };

  loadMore = () => {
    const { currentlyShowing, showMore, totalShow, showLimit } = this.state;

    if (totalShow <= currentlyShowing + showLimit && showMore) {
      this.setState({
        showMore: false,
        currentlyShowing: currentlyShowing + showLimit,
      });
    } else {
      this.setState({
        currentlyShowing: currentlyShowing + showLimit,
      });
    }
  };

  renderProgressBar = () => {
    const { dashboardListing } = this.state;
    let isNewActivities = false;
    let count = 0;
    dashboardListing.forEach((activity) => {
      if (
        (activity.created_at &&
          moment(activity.created_at).format("YYYY-MM-DD") ==
            moment().format("YYYY-MM-DD")) ||
        (activity.date &&
          moment(activity.date).format("YYYY-MM-DD") ==
            moment().format("YYYY-MM-DD")) ||
        (activity.booking_date &&
          moment(activity.booking_date).format("YYYY-MM-DD") ==
            moment().format("YYYY-MM-DD"))
      ) {
        isNewActivities = true;
        count++;
      }
    });
    if (count) {
      return (
        <div className="progessbar">
          You have new {count} activities from {dashboardListing.length}
          <Progress
            percent={(count * 100) / dashboardListing.length}
            showInfo={false}
          />
        </div>
      );
    } else {
      return <div className="progessbar">No activities</div>;
    }
  };

  transformActivity = (activity) => {
    switch (activity.activity_type) {
      case "Service Booked":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.date).format("YYYY-MM-DD h:mm:ss"),
          startTime: activity.start_time,
          endTime: activity.end_time,
          time: `${Math.abs(
            moment(activity.start_time, "h:mm:ss").diff(
              moment(activity.end_time, "h:mm:ss"),
              "m"
            )
          )} mins`,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.price ? activity.price : "",
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Event Enquiries":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
          startTime: activity.start_time,
          endTime: activity.end_time,
          time: `${Math.abs(
            moment(activity.start_time, "YYYY-MM-DD h:mm:ss").diff(
              moment(activity.end_time, "YYYY-MM-DD h:mm:ss"),
              "m"
            )
          )} mins`,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.price ? activity.price : "",
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Event Booked":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
          startTime: activity.start_time,
          endTime: activity.end_time,
          time: `${Math.abs(
            moment(activity.start_time, "hh:mm").diff(
              moment(activity.end_time, "hh:mm"),
              "m"
            )
          )} mins`,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.price ? activity.price : "",
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Trader Jobs":
        let today = moment().format("YYYY-MM-DD");
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.date).format("YYYY-MM-DD h:mm:ss"),
          startTime: moment(today + " " + activity.start_time).format(
            `YYYY-MM-DD h:mm:ss`
          ),
          endTime: moment(today + " " + activity.end_time).format(
            `YYYY-MM-DD h:mm:ss`
          ),
          time: `${Math.abs(
            moment(activity.start_time, "h:mm:ss").diff(
              moment(activity.end_time, "h:mm:ss"),
              "m"
            )
          )} mins`,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.price ? activity.price : "",
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Quote Request Sent":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.date).format("YYYY-MM-DD h:mm:ss"), // time not available
          startTime: null,
          endTime: null,
          time: null,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.price ? activity.price : "",
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Offer Sent":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
          startTime: activity.created_at,
          endTime: null, // end time not available
          time: null,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.offer_price,
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Restaurant Order":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
          startTime: moment(activity.created_at).format("h:mm:ss"),
          endTime: null, // end time not available
          time: null,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.offer_price,
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
        };
      case "Booked An Inspection":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.inspection_date).format("YYYY-MM-DD h:mm:ss"),
          startTime: moment(activity.inspection_time).format("h:mm:ss"),
          endTime: null, // end time not available
          time: null,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.offer_price,
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Applied Job":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.created_at).format("YYYY-MM-DD h:mm:ss"),
          startTime: moment(activity.created_at).format("h:mm:ss"),
          endTime: null, // end time not available
          time: null,
          title: activity.title,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.offer_price,
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Cancelled":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.booking_date).format("YYYY-MM-DD h:mm:ss"),
          startTime: activity.start_time,
          endTime: activity.end_time,
          time: `${Math.abs(
            moment(activity.start_time, "YYYY-MM-DD h:mm:ss").diff(
              moment(activity.end_time, "YYYY-MM-DD h:mm:ss"),
              "m"
            )
          )} mins`,
          title: activity.title ? activity.title : activity.event_types.name,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.price ? activity.price : "",
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Completed":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.booking_date).format("YYYY-MM-DD h:mm:ss"),
          startTime: activity.start_time,
          endTime: activity.end_time,
          time: `${Math.abs(
            moment(activity.start_time, "YYYY-MM-DD h:mm:ss").diff(
              moment(activity.end_time, "YYYY-MM-DD h:mm:ss"),
              "m"
            )
          )} mins`,
          title: activity.title ? activity.title : activity.event_types.name,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.price ? activity.price : "",
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      case "Accepted":
        return {
          activity_type: activity.activity_type,
          module_type: activity.module_type,
          date: moment(activity.booking_date).format("YYYY-MM-DD h:mm:ss"),
          startTime: activity.start_time,
          endTime: activity.end_time,
          time: `${Math.abs(
            moment(activity.start_time, "YYYY-MM-DD h:mm:ss").diff(
              moment(activity.end_time, "YYYY-MM-DD h:mm:ss"),
              "m"
            )
          )} mins`,
          title: activity.title || activity.event_type,
          description: activity.description ? activity.description : "",
          category: activity.category_name ? activity.category_name : "",
          subCategory: activity.sub_category_name
            ? ` | ${activity.sub_category_name}`
            : "",
          price: activity.price ? activity.price : "",
          businessName: activity.business_name ? activity.business_name : "",
          quantity: null,
          size: null,
          name: activity.name,
        };
      default:
        return activity;
    }
  };

  renderActivities = (mode) => {
    const {
      filteredDashboardListing,
      weekStart,
      weekEnd,
      currentlyShowing,
      showMore,
      totalShow,
    } = this.state;
    let showActivities = [];
    if (mode == "today") {
      filteredDashboardListing.forEach((activity) => {
        let transformedActivity = this.transformActivity(activity);
        if (
          transformedActivity.date &&
          moment(transformedActivity.date).format("YYYY-MM-DD") ==
            moment().format("YYYY-MM-DD")
        ) {
          showActivities.push(transformedActivity);
        }
      });
    } else {
      filteredDashboardListing.forEach((activity) => {
        let transformedActivity = this.transformActivity(activity);
        if (
          transformedActivity.date &&
          moment(weekStart).diff(moment(transformedActivity.date), "days") >=
            -6 &&
          moment(weekEnd).diff(moment(transformedActivity.date), "days") <= 6
        ) {
          showActivities.push(transformedActivity);
        }
      });
    }
    if (totalShow != showActivities.length) {
      this.setState({
        totalShow: showActivities.length,
      });
    }

    if (totalShow > currentlyShowing && !showMore) {
      this.setState({
        showMore: true,
      });
    }
    if (totalShow == currentlyShowing && showMore) {
      this.setState({
        showMore: false,
      });
    }

    showActivities.splice(currentlyShowing);

    return showActivities.map((activity) => {
      const classactivity = `activity ${activity.module_type}`;
      // let activity = this.transformActivity(activity);

      return (
        <li
          key={`${activity.id}_${activity.module_type}`}
          className={classactivity}
        >
          <div>
            <span className="icon-images"></span>
            <div
              className="activity-body"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="activity-details">
                <h2>{activity.title}</h2>
                <p>{convertHTMLToText(activity.description)}</p>
                <div className="left-side-cate">
                  <span>
                    {activity.category} {activity.subCategory}
                  </span>
                </div>
              </div>
              <div className="activity-actions">
                <div className="viewbutton">
                  <button>
                    <svg
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0)">
                        <path
                          d="M2.58398 11.2743V13.5623H4.77059L11.2196 6.81408L9.033 4.52602L2.58398 11.2743ZM12.9106 5.04465C13.138 4.80669 13.138 4.4223 12.9106 4.18434L11.5461 2.75659C11.3187 2.51864 10.9514 2.51864 10.724 2.75659L9.65691 3.87316L11.8435 6.16122L12.9106 5.04465Z"
                          fill="#C2CFE0"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect
                            width="13.9943"
                            height="14.6435"
                            fill="white"
                            transform="translate(0.834473 0.75)"
                          />
                        </clipPath>
                      </defs>
                    </svg>{" "}
                    View
                  </button>
                  <span>
                    {activity.businessName ? (
                      <span>{activity.businessName}</span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
                <div className="activity-action-group">
                  <div className="date-time-activity">
                    {activity.time && (
                      <div>
                        <strong>Time</strong> | <span>{activity.time}</span>
                      </div>
                    )}
                    {activity.date && (
                      <div>
                        <strong>Date</strong> |{" "}
                        <span>
                          {moment(activity.date).format("YYYY-MM-DD")}
                        </span>
                      </div>
                    )}
                    {activity.quantity && (
                      <div>
                        <strong>Qty</strong> | <span>{activity.quantity}</span>
                      </div>
                    )}
                    {activity.size && (
                      <div>
                        <strong>Size</strong> | <span>{activity.size}</span>
                      </div>
                    )}
                  </div>
                  <div className="activity-price">
                    {activity.price && (
                      <div>
                        <strong>AU${activity.price}</strong>
                      </div>
                    )}
                  </div>

                  <div className="button-activity-bottom">
                    {activity.module_type === "Retail" && (
                      <>
                        {activity.purchased && (
                          <button className="cancel">Cancel</button>
                        )}
                        {!activity.purchased && (
                          <button className="purchase">Purchase</button>
                        )}
                      </>
                    )}
                    {activity.module_type === "Booking" && (
                      <button className="cancel">Cancel</button>
                    )}
                    {activity.module_type === "Classified" && (
                      <button className="withdraw">Withdraw</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    });
  };

  /**
   * @method  get DashBoard Details
   * @description get classified
   */
  getDashBoardListingData = () => {
    const { fromDate, tillDate, monthStart, monthEnd } = this.state;
    this.setState(
      {
        // selectedDateForListingData: classDate,
        dashboardListing: [],
        totalRecords: 0,
      },
      () => {
        if (fromDate && tillDate) {
          this.props.enableLoading();
          const req = {
            from_date: fromDate,
            to_date: tillDate,
            search_keyword: this.state.search_keyword,
          };
          const monthReq = {
            from_date: monthStart,
            to_date: monthEnd,
            search_keyword: "",
          };
          this.props.getCustomerDashBoardDetails(req, (response) => {
            this.props.disableLoading();
            if (response.status === 200 && response.data.data.status) {
              let arrayOfAllKey = [
                ...response.data.data.data.booking,
                ...response.data.data.data.classified,
                ...response.data.data.data.retail,
              ];
              this.setState(
                {
                  dashboardListing: arrayOfAllKey,
                  totalRecords: response.data.data.data.total_records,
                },
                () => this.filterSelectedDate("")
              );
            }
          });
          this.props.getCustomerDashBoardDetails(monthReq, (response) => {
            if (response.status === 200 && response.data.data.status) {
              let arrayOfAllKey = [
                ...response.data.data.data.booking,
                ...response.data.data.data.classified,
                ...response.data.data.data.retail,
              ];
              this.setState({
                monthData: arrayOfAllKey,
              });
            }
          });
        }
      }
    );
  };

  getBookingsForCalenderDate = (date) => {
    const { id } = this.props.loggedInUser;
    const selectedDate = moment(date).format("YYYY-MM-DD");
    this.setState(
      {
        selectedMyBookingsCalenderDate: selectedDate,
      },
      () => {
        if (selectedDate) {
          const req = {
            user_id: id,
            date: selectedDate,
          };
          //this.props.getTraderMonthFitnessBooking(req, this.getVendorFitnessMonthBookingsCalenderCallback)
        }
      }
    );
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { selectedDate, flag } = this.state;
    this.getDashBoardListingData(selectedDate, flag, e, "");
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

  onChangeCalendarView = (view) => {
    const { weekStart, weekEnd } = this.state;
    if (view == "week") {
      this.setState(
        {
          calendarView: view,
          selectedDateForListingData: moment(new Date()).format("YYYY-MM-DD"),
          fromDate: weekStart,
          tillDate: weekEnd,
          showMore: false,
          currentlyShowing: 10,
          totalShow: 0,
          search_keyword: "",
        },
        () => {
          this.createWeekCalender();
          this.getDashBoardListingData();
        }
      );
    } else {
      this.setState(
        {
          calendarView: view,
          selectedDateForListingData: moment(new Date()).format("YYYY-MM-DD"),
          fromDate: moment(new Date()).format("YYYY-MM-DD"),
          tillDate: moment(new Date()).format("YYYY-MM-DD"),
          showMore: false,
          currentlyShowing: 10,
          totalShow: 0,
          search_keyword: "",
        },
        () => {
          // this.createWeekCalender();
          this.getDashBoardListingData();
        }
      );
    }
  };

  onChangeBookingDates = (value) => {
    this.getDashBoardListingData(value);
  };

  onChangeMyBookingCalenderView = (view) => {
    this.setState(
      {
        myCalenderView: view,
        selectedMyBookingsCalenderDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      () => {
        if (view == "week") {
          this.createWeekCalender();
        }
        this.getBookingsForCalenderDate(new Date());
      }
    );
  };

  onChangeMyBookingCalenderDates = (value) => {
    this.getBookingsForCalenderDate(value);
  };

  renderWeeklyCalender = () => {
    const { dates, selectedMyBookingsCalenderDate } = this.state;
    return (
      <div>
        <div className="month">
          <ul>
            <li>
              <span>
                {displayCalenderDate(
                  selectedMyBookingsCalenderDate
                    ? selectedMyBookingsCalenderDate
                    : Date.now()
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
        <ul className="days">
          {dates.length && this.renderWeeklyDates(dates)}
        </ul>
      </div>
    );
  };

  renderWeeklyDates = (dates) => {
    const { selectedMyBookingsCalenderDate, index } = this.state;
    return dates.map((el, i) => {
      let a = selectedMyBookingsCalenderDate;
      let b = moment(new Date(el)).format("YYYY-MM-DD");
      return (
        <li
          key={`${i}_weekly_date`}
          onClick={() => {
            this.setState({
              index: i,
              selectedMyBookingsCalenderDate: moment(new Date(el)).format(
                "YYYY-MM-DD"
              ),
            });
            this.getBookingsForCalenderDate(el);
          }}
          style={{ cursor: "pointer" }}
        >
          <span className={a == b ? "active" : ""}>{displayDate(el)}</span>
        </li>
      );
    });
  };

  renderCategoryIcon = (module_type) => {
    if (module_type == "Booking") {
      return (
        <img
          className="shopping-img"
          src={require("../../../../assets/images/shopping-image.png")}
        ></img>
      );
    } else if (module_type == "Retail") {
      return (
        <img
          className="shopping-img"
          src={require("../../../../assets/images/bulb-img.png")}
        ></img>
      );
    } else if (module_type == "Classified") {
      return (
        <img
          className="shopping-img"
          src={require("../../../../assets/images/sent-img.png")}
        ></img>
      );
    }
  };

  renderCategoryLabel = (module_type, category_name, sub_category_name) => {
    if (module_type == "Booking") {
      return (
        <div className="orange-text pt-40 ">
          {" "}
          {category_name && `${category_name}`}{" "}
          {sub_category_name && `|${sub_category_name}`}
        </div>
      );
    } else if (module_type == "Retail") {
      return (
        <div className="pink-text pt-40">
          {category_name && `${category_name}`}{" "}
          {sub_category_name && `|${sub_category_name}`}
        </div>
      );
    } else if (module_type == "Classified") {
      return (
        <div className="blue-text pt-40">
          {" "}
          {category_name && `${category_name}`}{" "}
          {sub_category_name && `|${sub_category_name}`}
        </div>
      );
    }
  };

  renderBookingTime = (value) => {
    if (value.module_type == "Booking") {
      return (
        <Col>
          {value.time && (
            <div className="" style={{ color: "#90A8BE" }}>
              {" "}
              <span className="qty-hrs">Time</span> |{" "}
              <span className="qty-hrs">
                {moment(value.time).format("hh:mm A")}
              </span>
            </div>
          )}
          <div className="" style={{ color: "#90A8BE" }}>
            {" "}
            <span className="qty-hrs">Date</span> |{" "}
            <span className="qty-hrs">
              {moment(value.booking_date).format("MMMM Do YYYY")}
            </span>
          </div>
        </Col>
      );
    }
  };

  onToggleMyCalender = () => {
    let weekStart = moment().startOf("week").format("YYYY-MM-DD");
    let weekEnd = moment().endOf("week").format("YYYY-MM-DD");
    this.setState(
      (prevState) => ({
        isMyCalenderToggle: !prevState.isMyCalenderToggle,
        search_keyword: "",
        fromDate: weekStart,
        tillDate: weekEnd,
        calendarView: "week",
        selectedDateForListingData: moment(new Date()).format("YYYY-MM-DD"),
        showMore: false,
        currentlyShowing: 10,
        totalShow: 0,
        search_keyword: "",
      }),
      this.getDashBoardListingData()
    );
  };

  onSwitchMyCalenderMode = (mode) => {
    const { weekStart, weekEnd, monthStart, monthEnd } = this.state;
    if (mode === "week") {
      this.setState(
        {
          fromDate: weekStart,
          tillDate: weekEnd,
          search_keyword: "",
        },
        () => this.getDashBoardListingData()
      );
    } else {
      this.setState(
        {
          fromDate: monthStart,
          tillDate: monthEnd,
          search_keyword: "",
        },
        () => this.getDashBoardListingData()
      );
    }
    this.setState({
      myCalenderMode: mode,
    });
  };

  updateCurrentMonth = (newValue) => {
    let monthStart = newValue.startOf("month").format("YYYY-MM-DD");
    let monthEnd = newValue.endOf("month").format("YYYY-MM-DD");

    this.setState(
      {
        currentMonth: newValue.format("MM"),
        currentYear: newValue.format("YYYY"),
        monthStart,
        monthEnd,
      },
      () => this.getDashBoardListingData()
    );
  };

  getListDataForDay = (day) => {
    const { monthData, monthStart } = this.state;
    let result = monthData.filter((activity) => {
      let transformedActivity = this.transformActivity(activity);
      if (transformedActivity) {
        let compareDate = moment(monthStart)
          .add(day, "days")
          .format("YYYY-MM-DD");
        let targetDate = moment(transformedActivity.date).format("YYYY-MM-DD");
        if (targetDate == compareDate) {
          return activity;
        }
      }
    });
    return result;
  };

  getListData = (value) => {
    let listData = [];
    switch (value.date()) {
      case 1:
        listData = this.getListDataForDay(0);
        break;
      case 2:
        listData = this.getListDataForDay(1);
        break;
      case 3:
        listData = this.getListDataForDay(2);
        break;
      case 4:
        listData = this.getListDataForDay(3);
        break;
      case 5:
        listData = this.getListDataForDay(4);
        break;
      case 6:
        listData = this.getListDataForDay(5);
        break;
      case 7:
        listData = this.getListDataForDay(6);
        break;
      case 8:
        listData = this.getListDataForDay(7);
        break;
      case 9:
        listData = this.getListDataForDay(8);
        break;
      case 10:
        listData = this.getListDataForDay(9);
        break;
      case 11:
        listData = this.getListDataForDay(10);
        break;
      case 12:
        listData = this.getListDataForDay(11);
        break;
      case 13:
        listData = this.getListDataForDay(12);
        break;
      case 14:
        listData = this.getListDataForDay(13);
        break;
      case 15:
        listData = this.getListDataForDay(14);
        break;
      case 16:
        listData = this.getListDataForDay(15);
        break;
      case 17:
        listData = this.getListDataForDay(16);
        break;
      case 18:
        listData = this.getListDataForDay(17);
        break;
      case 19:
        listData = this.getListDataForDay(18);
        break;
      case 20:
        listData = this.getListDataForDay(19);
        break;
      case 21:
        listData = this.getListDataForDay(20);
        break;
      case 22:
        listData = this.getListDataForDay(21);
        break;
      case 23:
        listData = this.getListDataForDay(22);
        break;
      case 24:
        listData = this.getListDataForDay(23);
        break;
      case 25:
        listData = this.getListDataForDay(24);
        break;
      case 26:
        listData = this.getListDataForDay(25);
        break;
      case 27:
        listData = this.getListDataForDay(26);
        break;
      case 28:
        listData = this.getListDataForDay(27);
        break;
      case 29:
        listData = this.getListDataForDay(28);
        break;
      case 30:
        listData = this.getListDataForDay(29);
        break;
      case 31:
        listData = this.getListDataForDay(30);
        break;
      default:
    }
    return listData || [];
  };

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <>
        {listData.length ? (
          <ul className="events">
            {listData[0]?.title && (
              <div
                className="my-calendar-activity"
                style={{
                  backgroundColor: "#ccc",
                  height: "2em",
                  width: "2em",
                  position: "relative",
                  top: "-0.9em",
                  left: "-3.8em",
                  borderRadius: "5px",
                  zIndex: 1000,
                }}
              >
                {value.date()}
              </div>
            )}
          </ul>
        ) : (
          <ul className="events empty-events">
            <div
              className="my-calendar-activity"
              style={{
                backgroundColor: "#fff",
                height: "2em",
                width: "2em",
                position: "relative",
                top: "-0.9em",
                left: "-3.8em",
                borderRadius: "5px",
                zIndex: 1000,
              }}
            >
              {value.date()}
            </div>
          </ul>
        )}
      </>
    );
  };

  disabledDate = (current) => {
    // debugger
    if (!current) {
      // allow empty select
      return false;
    }
    const date = moment();
    date.hour(0);
    date.minute(0);
    date.second(0);

    return current.valueOf() < 2736205384005; // can not select days before today
  };

  onSearch = (e) => {
    this.setState(
      {
        search_keyword: e.target.value,
      },
      this.getDashBoardListingData()
    );
  };

  onMyCalenderChangeWeek = (newWeekStart) => {
    this.setState(
      {
        fromDate: moment(newWeekStart).format("YYYY-MM-DD"),
        tillDate: moment(newWeekStart).add(6, "days").format("YYYY-MM-DD"),
      },
      () => this.getDashBoardListingData()
    );
  };

  onMyCalenderChangeMonth = (month, year) => {
    const monthStart = moment(`${year}-${month}`, "YYYY-MM")
      .startOf("month")
      .format("YYYY-MM-DD");
    const monthEnd = moment(`${year}-${month}`, "YYYY-MM")
      .endOf("month")
      .format("YYYY-MM-DD");
    this.setState(
      {
        fromDate: monthStart,
        tillDate: monthEnd,
      },
      () => this.getDashBoardListingData()
    );
  };

  /**
   * @method onDateClick
   * @description handle date click of a calendar
   */
  onDateClick = (value) => {
    this.getActivityInfo(value);
  };

  /**
   * @method getActivityInfo
   * @description get clicked date activity list
   */
  getActivityInfo = (date) => {
    const { id } = this.props.loggedInUser;
    const selectedDate = moment(date).format("YYYY-MM-DD");
    this.setState(
      {
        selectedBookingDate: selectedDate,
      },
      () => {
        if (selectedDate) {
          const req = {
            from_date: selectedDate,
            to_date: selectedDate,
            search_keyword: "",
          };
          this.props.getCustomerDashBoardDetails(req, (res) => {
            if (res.status === 200 && res.data) {
              this.setState({
                calenderBookingList:
                  res.data.data.data !== undefined ? res.data.data.data : [],
                isDataAvailable:
                  res.data.data.data !== undefined ? true : false,
              });
            }
          });
        }
      }
    );
  };

  /**
   * @method renderBokingCalenderItems
   * @description render the activity items of selected date and show below calendar
   */
  renderBokingCalenderItems = () => {
    const { calenderBookingList } = this.state;
    if (
      calenderBookingList.booking.length > 0 ||
      calenderBookingList.classified.length > 0
    ) {
      return (
        <>
          <ul className="flex-container wrap">
            {calenderBookingList.booking.map((value, i) => {
              return (
                <li key={`${i}_vendor_bookings`}>
                  <div className="appointments-label">{value.title}</div>
                  <div className="appointments-time">
                    {convertTime24To12Hour(value.date)}
                  </div>
                  <div className="delete">
                    <DeleteFilled className="deletefilled" size={50} />
                  </div>
                </li>
              );
            })}
          </ul>
          <ul className="flex-container wrap">
            {calenderBookingList.classified.map((value, i) => {
              return (
                <li key={`${i}_vendor_bookings`}>
                  <div className="appointments-label">{value.title}</div>
                  <div className="appointments-time">
                    {convertTime24To12Hour(value.created_at)}
                  </div>
                  <div className="delete">
                    <DeleteFilled className="deletefilled" size={50} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      );
    } else {
      return;
      // <div className="error-box">
      //   <Alert message="No Appointments" type="error" />
      // </div>
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      calendarView,
      myCalenderView,
      isMyCalenderToggle,
      myCalenderMode,
      dashboardListing,
      filteredDashboardListing,
      weekStart,
      currentMonth,
      currentYear,
      totalRecords,
      search_keyword,
      selectedBookingDate,
      calenderBookingList,
      isDataAvailable,
      monthStart,
    } = this.state;

    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box profileuser-dashborad-box"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  {/* <div className='left'>
                    <Title level={2}>My Dashboard</Title>
                  </div> */}
                  <div className="right">
                    <div className="right-content">
                      <div className="tabs-button">
                        {/* <Dashboardtab /> */}
                        <Button
                          onClick={() => {
                            this.props.history.push("/dashboard");
                          }}
                          className="tabview-btn bashboard-btn active"
                        >
                          My Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/retail-orders");
                          }}
                          className="tabview-btn retail-btn"
                        >
                          Retail
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/dashboard-classified");
                          }}
                          className="tabview-btn classifield-btn"
                        >
                          Classifieds
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/my-bookings");
                          }}
                          className="tabview-btn booking-btn"
                        >
                          Booking
                        </Button>
                        {/* <Button onClick={() => { this.props.history.push('/food-scanner') }} className="tabview-btn food-scanner">Food Scanner</Button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search Dashboard"
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                            onChange={this.onSearch}
                            value={search_keyword}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div
                  className={
                    isMyCalenderToggle
                      ? "profile-content-box my-calender-toggled"
                      : "profile-content-box"
                  }
                >
                  <Row gutter={30}>
                    <Col xs={24} md={16} lg={16} xl={14}>
                      {!isMyCalenderToggle && (
                        <Card
                          className="dashboard-left-calnder-block "
                          title="Latest Activity"
                          extra={
                            <div className="card-header-select">
                              <Select
                                onChange={(e) => {
                                  this.onChangeCalendarView(e);
                                }}
                                defaultValue="This week"
                              >
                                <Option value="today">Today</Option>
                                <Option value="week">This week</Option>
                              </Select>
                            </div>
                          }
                        >
                          <Row>
                            <Col className="gutter-row" md={24}>
                              {calendarView === "week"
                                ? this.renderCalender()
                                : this.renderToday()}
                            </Col>
                          </Row>
                        </Card>
                      )}
                      {isMyCalenderToggle && (
                        <div className="fullcalender">
                          {myCalenderMode === "week" ? (
                            <MyCalenderWeeks
                              weekStart={weekStart}
                              data={filteredDashboardListing}
                              totalRecords={totalRecords}
                              onSwitchMyCalenderMode={
                                this.onSwitchMyCalenderMode
                              }
                              search_keyword={search_keyword}
                              onMyCalenderChangeWeek={
                                this.onMyCalenderChangeWeek
                              }
                              onSearch={this.onSearch}
                              transformActivity={this.transformActivity}
                            />
                          ) : (
                            <MyCalendarMonthView
                              monthStart={monthStart}
                              data={filteredDashboardListing}
                              totalRecords={totalRecords}
                              onSelect={this.onChangeMyBookingCalenderDates}
                              onSwitchMyCalenderMode={
                                this.onSwitchMyCalenderMode
                              }
                              search_keyword={search_keyword}
                              onMyCalenderChangeMonth={
                                this.onMyCalenderChangeMonth
                              }
                              onSearch={this.onSearch}
                              transformActivity={this.transformActivity}
                            />
                          )}
                        </div>
                      )}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <div className="appointments-slot right-calender-view">
                        <div className="appointments-heading">
                          <div className="date-heading">My Calender</div>
                          <div className="card-header-select calender-icon-outer">
                            <img
                              className="calender-icon"
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEYSURBVHgBrVI7bsJAEJ2xV9QcYXOONCZR6iClibu4TxGfIEcwRXqcyjRR6CgQmIZzYG5AbT7DjKwFCxt7JXjSanfnzU8zD6NkogE6H1BFFvrPsTyiZCa8rrrksZJgRPyWgBLTlfPzt0y3ec40DS94gSbqgDLVvt6fHgwTJVMP0U3L3kT7IPRfFuY/GM1XcjtwI5StI3f0z1U3JZO2ShD6vYyHGEDtEJ3YqgOzjToUCRC6g9FseLLyH+jsxK2nlQ4QNrTbBQrc/RgO6pUt3oksghefb4/rKEk5kDxAGrP9PAPCPjhuH6EFkoB1sOI19i7XSES/ykaJTbBRYluColqbEq/hbkrURtvX0KBEJyY61MVkskZ5NCnxCEeteGFjbMicAAAAAElFTkSuQmCC"
                              alt=""
                              width="18"
                              onClick={this.onToggleMyCalender}
                            />
                          </div>
                        </div>
                        {myCalenderView === "week" ? (
                          this.renderWeeklyCalender()
                        ) : (
                          <Calendar
                            onSelect={this.onDateClick}
                            //disabledDate={this.disabledDate}
                            fullscreen={false}
                            dateCellRender={this.dateCellRender}
                            headerRender={({
                              value,
                              type,
                              onChange,
                              onTypeChange,
                            }) => {
                              const month = value.month();
                              const year = value.year();
                              return (
                                <div className="calender-month_name">
                                  <LeftOutlined
                                    onClick={() => {
                                      const newValue = value.clone();
                                      this.updateCurrentMonth(
                                        moment(newValue)
                                          .subtract(1, "M")
                                          .startOf("month")
                                      );
                                      onChange(newValue.subtract(1, "month"));
                                    }}
                                  />
                                  {moment(
                                    `${currentMonth} ${currentYear}`,
                                    "MM YYYY"
                                  ).format("MMMM YYYY")}
                                  <RightOutlined
                                    onClick={() => {
                                      const newValue = value.clone();
                                      this.updateCurrentMonth(
                                        moment(newValue)
                                          .add(1, "M")
                                          .startOf("month")
                                      );
                                      onChange(newValue.add(1, "month"));
                                    }}
                                  />
                                </div>
                              );
                            }}
                          />
                        )}
                      </div>
                      {/* <div className="appointments-slot mt-20">
                            <div className="appointments-heading">
                            <div className="date">{moment(selectedMyBookingsCalenderDate).format("MMM D YYYY")}</div>
                            <div className="appointments-count">{calenderBookingList.length && calenderBookingList[0].bookings.length > 0 ? calenderBookingList[0].bookings.length : 0} Activity today</div>
                            </div>
                            <div className="appointments-body">
                            {this.renderBokingCalenderItems()}
                            </div>
                        </div> */}

                      <div className="appointments-slot mt-20">
                        <div className="appointments-heading">
                          <div className="date">
                            {moment(selectedBookingDate).format("D MMM YYYY")}
                          </div>
                          <div className="appointments-count">
                            {/* {vendorBookingList &&
                                    vendorBookingList.length}{" "} */}
                            {this.renderBokingCalenderItems.length} Activities
                            today
                          </div>
                        </div>
                        <div className="appointments-body">
                          {isDataAvailable == true
                            ? this.renderBokingCalenderItems()
                            : ""}
                        </div>
                      </div>
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
  getCustomerDashBoardDetails,
})(UserDashboard);
