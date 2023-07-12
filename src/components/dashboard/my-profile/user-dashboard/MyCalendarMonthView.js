import { LeftOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Calendar, Col, Input, Radio, Row } from "antd";
import moment from "moment";
import React, { Component } from "react";

export class MyCalendarMonthView extends Component {
  constructor(props) {
    console.log("%%%%%%%%%%%%%%%%%%", props);
    super(props);
    const currentMonth = moment().format("MMM YYYY");
    const date = moment();
    const dow = date.day(); // day of week
    this.state = {
      currentMonthForHeader: currentMonth,
      monthStart: this.props.monthStart,
      data: this.props.data,
      currentDay: moment().format("YYYY-MM-DD"),
      currentMonth: moment().month(),
      currentYear: moment().year(),
      dow: dow,
    };
  }

  updateCurrentMonth = (month, year) => {
    this.setState(
      {
        currentMonth: month,
        currentYear: year,
        monthStart: moment(`${month} ${year}`, "MM YYYY")
          .startOf("month")
          .format("YYYY-MM-DD"),
      },
      () => this.props.onMyCalenderChangeMonth(month + 1, year)
    ); // months starts with 0
  };

  getListDataForDay = (day) => {
    const { data, monthStart } = this.state;
    let result = [];
    this.props.data.forEach((activity) => {
      let transformedActivity = this.props.transformActivity(activity);
      let targetDate = moment(transformedActivity.date).format("YYYY-MM-DD");
      let compareDate = moment(monthStart)
        .add(day, "days")
        .format("YYYY-MM-DD");
      if (transformedActivity.date && targetDate == compareDate) {
        result.push(transformedActivity);
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
    console.log(value, "valueee");
    const listData = this.getListData(value);
    return (
      <>
        <div className="custom-date">{value.date()}</div>
        {console.log("*********************", value.date())}
        <ul className="events">
          {listData.map((item) => (
            <li
              key={`${item.id}_${item.module_type}`}
              className={item.module_type}
            >
              {console.log(item, "itemmmmm")}
              <Badge status={item.module_type} text={item.activity_type} />
            </li>
          ))}
        </ul>
      </>
    );
  };

  render() {
    const { currentMonth, currentYear } = this.state;
    return (
      <Calendar
        onSelect={this.props.onChangeMyBookingCalenderDates}
        fullscreen={true}
        dateCellRender={this.dateCellRender}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const month = value.month();
          const year = value.year();
          return (
            <div className="fullcalender-inner">
              <Row
                gutter={8}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div className="month ">
                  <ul>
                    <li
                      style={{ display: "inline-block", marginRight: "20px" }}
                      onClick={() => this.props.onSwitchMyCalenderMode("week")}
                    >
                      <span>Week</span>
                    </li>
                    <li
                      className="active-tab"
                      style={{ display: "inline-block" }}
                    >
                      <span>Month</span>
                    </li>
                  </ul>
                  <Col>
                    <div className="calender-month_name">
                      <LeftOutlined
                        onClick={() => {
                          const newValue = value.clone();
                          if (month == 1) {
                            newValue.month(parseInt(11, 10));
                            newValue.year(parseInt(year - 1, 10));
                            this.updateCurrentMonth(11, year - 1);
                          } else {
                            newValue.month(parseInt(month - 1, 10));
                            this.updateCurrentMonth(month - 1, year);
                          }
                          onChange(newValue);
                        }}
                      />
                      {moment(
                        `${currentMonth + 1} ${currentYear}`,
                        "MM YYYY"
                      ).format("MMM YYYY")}
                      <RightOutlined
                        onClick={() => {
                          const newValue = value.clone();
                          if (month == 11) {
                            newValue.month(parseInt(0, 10));
                            newValue.year(parseInt(year + 1, 10));
                            this.updateCurrentMonth(0, year + 1);
                          } else {
                            newValue.month(parseInt(month + 1, 10));
                            this.updateCurrentMonth(month + 1, year);
                          }
                          onChange(newValue);
                        }}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="search-block" style={{ width: 175 }}>
                      {/* <Input
                                style={{borderRadius: 20}}
                                prefix={<SearchOutlined className="site-form-item-icon" />}
                                value={this.props.search_keyword}
                                onChange={this.props.onSearch}
                            /> */}
                    </div>
                  </Col>
                </div>
              </Row>
            </div>
          );
        }}
      />
    );
  }
}

export default MyCalendarMonthView;
