import { LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import moment from 'moment';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { enableLoading, disableLoading, getDashBoardDetails, getTraderProfile, getCustomerDashBoardDetails } from '../../../../actions'

export class MyCalenderWeeks extends Component {

    constructor(props) {
        super(props);
        const date = moment();
        const dow = date.day(); // day of week
        this.state = {
            weekStart: this.props.weekStart,
            data: this.props.data,
            currentDay: moment().format('YYYY-MM-DD'),
            currentWeek: moment().week(),
            dow: dow,
            totalRecords: this.props.totalRecords,
            search_keyword: this.props.search_keyword
        }
    }
    
    shouldComponentUpdate(prevProps) {
      if(prevProps.data != this.state.data) {
        this.setState({
          data: this.props.data
        }, () => {
          return true
        })
      }
      return true
    }

    updateCurrentWeek = (direction) => {
      const { currentWeek } = this.state;
      let newCurrentWeek;
      let newWeekStart;
      
      if(!currentWeek) return;
      if(direction === 'decrement') {
          newCurrentWeek = currentWeek - 1;
      } else if(direction === 'increment') {
          newCurrentWeek = currentWeek + 1;
      }
      newWeekStart = moment(newCurrentWeek, 'w').startOf('week').format('YYYY-MM-DD');
      this.setState({
          currentWeek: newCurrentWeek,
          weekStart: newWeekStart,
      });
      this.props.onMyCalenderChangeWeek(newWeekStart);
    }

    onSelectDay = (dow) => {
      this.setState({
        dow
      })
    }

    renderWeekDays = () => {
      const { weekStart, dow } = this.state;
      return (
        <>
          <li onClick={() => this.onSelectDay(0)}>
            <span className={dow === 0 ? "active" : ""}>{String(moment(weekStart).format('ddd D MMM'))}</span>
          </li>
          <li onClick={() => this.onSelectDay(1)}>
            <span className={dow === 1 ? "active" : ""}>{String(moment(weekStart).add(1,'days').format('ddd D MMM'))}</span>
          </li>
          <li onClick={() => this.onSelectDay(2)}>
            <span className={dow === 2 ? "active" : ""}>{String(moment(weekStart).add(2,'days').format('ddd D MMM'))}</span>
          </li>
          <li onClick={() => this.onSelectDay(3)}>
            <span className={dow === 3 ? "active" : ""}>{String(moment(weekStart).add(3,'days').format('ddd D MMM'))}</span>
          </li>
          <li onClick={() => this.onSelectDay(4)}>
            <span className={dow === 4 ? "active" : ""}>{String(moment(weekStart).add(4,'days').format('ddd D MMM'))}</span>
          </li>
          <li onClick={() => this.onSelectDay(5)}>
            <span className={dow === 5 ? "active" : ""}>{String(moment(weekStart).add(5,'days').format('ddd D MMM'))}</span>
          </li>
          <li onClick={() => this.onSelectDay(6)}>
            <span className={dow === 6 ? "active" : ""}>{String(moment(weekStart).add(6,'days').format('ddd D MMM'))}</span>
          </li>
        </>      )
    }

    renderTodaysActivities = () => {
      const { data, dow, weekStart } = this.state;
      console.log("🚀 ~ file: MyCalenderWeeks.js ~ line 91 ~ MyCalenderWeeks ~ data", data)
      return data.map(activity => {
        let transformedActivity = this.props.transformActivity(activity);
        if(transformedActivity.date && moment(transformedActivity.date).format('YYYY-MM-DD') == moment(weekStart).add(dow, 'days').format('YYYY-MM-DD')) {
          return (
            <li style={{display: "inline-block", marginRight: '20px'}} className={activity.module_type}>{activity.name || activity.title}</li>
          );
        }
        return null;
      })
    }

    renderTodaysTimeline = () => {
        const { data, weekStart, dow } = this.state;
        let time = [
          {startTime:'12 am', activities: []}, 
          {startTime:'1 am', activities: []}, 
          {startTime:'2 am', activities: []}, 
          {startTime:'3 am', activities: []}, 
          {startTime:'4 am', activities: []}, 
          {startTime:'5 am', activities: []}, 
          {startTime:'6 am', activities: []}, 
          {startTime:'7 am', activities: []}, 
          {startTime:'8 am', activities: []}, 
          {startTime:'9 am', activities: []},
          {startTime:'10 am', activities: []},
          {startTime:'11 am', activities: []},
          {startTime:'12 pm', activities: []},
          {startTime:'1 pm', activities: []},
          {startTime:'2 pm', activities: []}, 
          {startTime:'3 pm', activities: []},
          {startTime:'4 pm', activities: []},
          {startTime:'5 pm', activities: []},
          {startTime:'6 pm', activities: []},
          {startTime:'7 pm', activities: []},
          {startTime:'8 pm', activities: []},
          {startTime:'9 pm', activities: []},
          {startTime:'10 pm', activities: []},
          {startTime:'11 pm', activities: []},
        ];
        let forChecking = [];
        let compareDate = moment(weekStart).add(dow, 'days').format('YYYY-MM-DD');
        console.log("🚀 ~ file: MyCalenderWeeks.js ~ line 145 ~ MyCalenderWeeks ~ time.forEach ~ time", time)
        time.forEach((t, i) => {
          data.forEach(activity => {
            let transformedActivity = this.props.transformActivity(activity);
            let activityDate = moment(transformedActivity.date).format('YYYY-MM-DD');
            let activityTime = moment(transformedActivity.date).format('h a');
            if(
              activityDate == compareDate 
              && activityTime == t.startTime
            ) {
              time[i].activities.push(transformedActivity)
            }
          })
        })

        let temp = [];
        let count = 0;
        time.forEach((t, i) => { // reduce empty slots
          if(t.activities.length) {
            /* if(count > 1) {
              if(time[i+1].activities.length) {
                if(time[i-1]) temp.push(time[i-1])
                temp.push(t)
              } else {
                if(time[i-1]) temp.push(time[i-1])
                temp.push(t)
                if(time[i+1]) temp.push(time[i+1])
              }
            } else {
              temp.push(t)
              if(time[i+1]) temp.push(time[i+1])
            }
            count = 0
          } else {
            count++;
          } */
        }
        temp.push(t)
      })

        return temp.map(t => {
          if(t.activities.length) {
              return (
                <div style={{display: 'flex'}}>
                  <ul className="activity-list-time">
                    <li>{t.startTime}</li>
                  </ul>
                  <ul className="handyman-activity-list-row"
                    style={{
                    display: 'flex',
                    borderLeft: '1px solid #ccc',
                    marginLeft: '20px',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                  }}>
                    {t.activities.map(activity => <li className={`activity-list-details ${activity.module_type}`}>{activity.title}</li>)}
                </ul>
              </div>
            )
          } else {
              return (
                <div style={{display: 'flex'}}>
                  <ul className="activity-list-time">
                    <li>{t.startTime ? t.startTime : ''}</li>
                  </ul>
                  <ul 
                    className={`activity-list-details`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderLeft: '1px solid #ccc',
                    marginLeft: '20px'
                  }}>
                    <li></li>
                  </ul>
                </div>
              )
          }
          return null;
        })
    }

  render() {
    const { weekStart } = this.state;
    const currentWeek = `${String(moment(weekStart).format('D'))} - ${String(moment(weekStart).add(6,'days').format('D MMM'))}`

    return (
      <div>
        <div className="month " style={{display: 'flex', justifyContent: "space-between"}}>
          <ul>
            <li className="active-tab" style={{display: "inline-block", marginRight: '20px'}} >
              <span>Week</span>
            </li>
            <li style={{display: "inline-block"}} onClick={() => this.props.onSwitchMyCalenderMode('month')}>
              <span>Month</span>
            </li>
          </ul>
          <div className="calender-month_name">
            <LeftOutlined onClick={() => this.updateCurrentWeek('decrement')} />
            {currentWeek}
            <RightOutlined onClick={() => this.updateCurrentWeek('increment')} />
          </div>
          <div className="search-block" style={{width: 175}}>
            {/* <Input
              style={{borderRadius: 20}}
              prefix={<SearchOutlined className="site-form-item-icon" />}
              value={this.props.search_keyword}
              onChange={this.props.onSearch}
            /> */}
          </div>
        </div>
        <div className="weekday-outer"><ul className="weekdays">
          {this.renderWeekDays()}
        </ul>
        <ul className="activity-type">
          <li style={{display: "inline-block", marginRight: '20px'}}>All Day</li>
          <li>
            <ul>
              {this.renderTodaysActivities()}
            </ul>
          </li>
          
        </ul>
        <div className="day-time" style={{display: 'flex', flexDirection: 'column'}}>
            {this.renderTodaysTimeline()}
        </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (store) => {
  return {};
};

export default connect(
  mapStateToProps,
  { enableLoading, disableLoading, getDashBoardDetails, getTraderProfile, getCustomerDashBoardDetails }
)(MyCalenderWeeks)