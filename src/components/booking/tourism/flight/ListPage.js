import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {toastr } from 'react-redux-toastr'
import Icon from "../../../customIcons/customIcons";
import MoreFilter from "./MoreFilter";
import moment from 'moment'
import {
  Pagination,
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Form,
  Select,
  Collapse,
  Checkbox,
  Slider,
  Switch,
  Button
} from "antd";
import {
  getBannerById,
  enableLoading,
  disableLoading,
  openLoginModel,
} from "../../../../actions/index";
import history from "../../../../common/History";
import TourismBanner from "../TourismBanner";
import SubHeader from "../../common/SubHeader";
import "../../../common/bannerCard/bannerCard.less";
import { TEMPLATE } from "../../../../config/Config";
import FlightListCard from "../../../common/flightCard/FlightListCard";
import NewSidebar from "../../NewSidebar";
import FlightSearch from "./FilightSearchFilter";
import {removeNumberFromString,hoursToMinutes,getTimeDifference, blankValueCheck } from '../../../common'
import "../tourism.less";
import "./flight.less";
const { Option } = Select;
const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;


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

class FlightList extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      stopfilter: [],
      airLineFilter: [],
      durationFilter: [],
      currentPage: 1,
      postPerPage: 6,
      filterType: "return",
      timeFilter: [],
      priceFilter: [],
      search_params: '',
      unique_outbound_time: [],
      unique_return_time:[],
      currentFlights: [],
      isReset: false,
      maxDuration: 0
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    const { filterSection, recomendations, search_params } = nextprops
    this.getFilterValues(filterSection, recomendations, search_params)
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    const { filterSection, recomendations, search_params } = this.props;
    this.getFilterValues(filterSection, recomendations, search_params)
  }

  /**
   * @method getStopOverWait
   * @description get total duration 
   */
  getStopOverWait = (segmentList, el, i) => {
    let arrival_time = el.arrivalTime ? moment(el.arrivalTime, "Hmm").format("HH:mm") : "";
    let dep_time = segmentList[i + 1] && segmentList[i + 1].depTime ? moment(segmentList[i + 1].depTime, "hmm").format("HH:mm") : "";
    let arrivalDate1 = moment(el.arrivalDate, "DDMMYY").format("DD-MMM-YYYY");
    let arrivalDate2 = segmentList[i + 1] && segmentList[i + 1].arrivalDate && moment(segmentList[i + 1].arrivalDate, "DDMMYY").format("DD-MMM-YYYY");
    let date1 = `${arrivalDate1} ${arrival_time}`;
    console.log("🚀 ~ file: ListPage.js ~ line 116 ~ FlightList ~ date1", date1)
    let date2 = `${arrivalDate2} ${dep_time}`;
    console.log("🚀 ~ file: ListPage.js ~ line 118 ~ FlightList ~ date2", date2)
    let airport_wait = getTimeDifference(date1, date2);
    let stop_wait = `${airport_wait.hours}h ${airport_wait.minutes}m`;
    return {
      airport_wait,
      stop_wait,
    };
  };

  /**
   * @method getTotalHours
   * @description get total hours
   */
  getTotalHours = (segment) => {
    let hours_total = 0,minute_total = 0,stop_wait;
    let total_hours = 0,total_minutes = 0,hours = 0,minutes = 0,stop_hours = 0,stop_minutes = 0;
    if (segment && Array.isArray(segment) && segment.length) {
      segment.map((el2, index) => {
        hours = el2.duration && el2.duration.hours ? el2.duration.hours : 0;
        minutes = el2.duration && el2.duration.minutes ? el2.duration.minutes : 0;
        total_hours = total_hours + Number(hours);
        total_minutes = total_minutes + Number(minutes);
        stop_wait = this.getStopOverWait(segment, el2, index);
        console.log("🚀 ~ file: ListPage.js ~ line 141 ~ FlightList ~ segment.map ~ stop_wait", stop_wait)
        if (stop_wait && stop_wait.airport_wait && !Number.isNaN(stop_wait.airport_wait.hours) && !Number.isNaN(stop_wait.airport_wait.minutes)) {
          stop_hours = stop_hours + stop_wait.airport_wait.hours;
          stop_minutes = stop_minutes + stop_wait.airport_wait.minutes;
        }
      });
      console.log("🚀 ~ file: ListPage.js ~ line 144 ~ FlightList ~ segment.map ~ stop_hours", stop_hours)
      console.log("🚀 ~ file: ListPage.js ~ line 146 ~ FlightList ~ segment.map ~ stop_minutes", stop_minutes)
      hours_total = Number(total_hours) + Number(stop_hours);
      minute_total = Number(total_minutes) + Number(stop_minutes);
    }
    let hours1 = Math.trunc(minute_total/60);
    let minutes1 = minute_total % 60;
    let totalHours = Number(hours1) + Number(hours_total)
    if (totalHours !== undefined && totalHours !== null && minutes1 !== undefined && minutes1 !== null ) {
        return totalHours
    }else {
        return ''
    }
  };

  
  /**
   * @method getFilterValues
   * @description get filter values
   */
  getFilterValues = (filterSection, recomendations, search_params) => {
    const { currentPage, postPerPage } = this.state
    let stop = [],duration = [],airLine = [],price = [],outBoundTime = [], returnTime = [], time1, time2, maxDuration;
      recomendations && recomendations.map((el) => {
        price.push(el.price);
        el.segments.map((el2) => {
          if(el2 && Array.isArray(el2) && el2.length){
            let segment = el2.length === 1 ? el.segments[0] :  el2.length === 2 ? el.segments[1] : el2
            let key = el2.length === 1 ? 'one_way' : el2.length === 2 ? 'return' : 'multi_city'
            let temp =  this.getTotalHours(segment)
            if(!maxDuration || maxDuration < temp){
              maxDuration = temp
            }
            duration.push(temp);
            el2.map(s => {
              if(key === 'one_way' || key === 'multi_city' || key === 'return'){
                time1 = `${moment(s.depTime, "Hmm").format("HH:mm")}-${moment(s.arrivalTime, "Hmm").format("HH:mm")}`
                outBoundTime.push(time1)
              }else if(key === 'return'){
                time2 = `${moment(s.depTime, "Hmm").format("HH:mm")}-${moment(s.arrivalTime, "Hmm").format("HH:mm")}`
                returnTime.push(time2)
              }
              let string = removeNumberFromString(s.airline)
              airLine.push(string)
            })
          }
        });
      });
      let price_unique = price.filter((x, i, a) => a.indexOf(x) === i);
      let unique_duration = duration.filter((x, i, a) => a.indexOf(x) === i);
      // let unique_airline = Array.from(new Set(airLine));
      let unique_airline = filterSection[5] && filterSection[5].data
      let unique_outbound_time = outBoundTime.filter((x, i, a) => a.indexOf(x) === i);
      let unique_return_time = returnTime.filter((x, i, a) => a.indexOf(x) === i);
      const indexOfLastPost = currentPage * postPerPage;
      const indexOfFirstPost = indexOfLastPost - postPerPage;
      const currentFlights = recomendations && recomendations.slice(indexOfFirstPost, indexOfLastPost);
      this.setState({
        stopfilter: stop,
        durationFilter: unique_duration.length ? unique_duration : [],
        airLineFilter: unique_airline ? unique_airline : airLine,
        unique_outbound_time: unique_outbound_time,
        unique_return_time: unique_return_time,
        priceFilter: price_unique.length ? price_unique.sort() : [],
        recomendations: recomendations,
        search_params: search_params,
        currentFlights: currentFlights,
        maxDuration: maxDuration,
      });
  }

  /**
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    if (resetFlag) {
      this.setState({ isSearchResult: false });
    }
  };

  /**
   * @method renderFlightDetails
   * @description renderfilght details
   */
  renderFlightDetails = (data, search_params, from_location, to_location) => {
    if (data && data.length && data) {
      return data.map((el, i) => {
        return (
          <div key={i}>
            <FlightListCard
              item={el}
              filterType={this.state.filterType}
              {...this.props}
              openLoginModel={() => this.props.openLoginModel()}
              isLoggedIn={this.props.isLoggedIn}
              search_params={search_params}
              from_location={from_location}
              to_location={to_location}
              index={`isOpen${i}`}
            />
          </div>
        );
      });
    }else {
      return <div className="data-msg"> <p><span>Sorry!</span> No flights available</p></div>
    }
  };

  /**
   * @method setCurrentFlight
   * @description set current flight
   */
  setCurrentFlight = (allList, page) => {
    const { postPerPage } = this.state
    const indexOfLastPost = page * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    console.log(indexOfFirstPost,'indexOfLastPost',indexOfLastPost)
    const currentFlights = allList && allList.slice(indexOfFirstPost, indexOfLastPost);
    console.log('currentFlights',currentFlights)
    this.setState({currentFlights: currentFlights,recomendations: allList})
  }

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { recomendations } = this.state
    this.setState({ currentPage: e }, () => {
      this.setCurrentFlight(recomendations, e)
    });
  };


  handleSortBySegment = (e, currentFlights) => {
    const { currentPage } = this.state
    let me = this
    let obj1 = "",obj2 = "",hours1 = '', hours2 = '',out_bound_time1 = "",out_bound_time2 = "",return_time1 = "",return_time2 = "";
    let filteredList = currentFlights.sort(function (a, b) {
      if (a.segments && Array.isArray(a.segments) && a.segments.length) {
        let temp = [], temp2 = []
        let segment1 = a.segments[0]
        let segment2 = a.segments.length > 1 ? a.segments[1] :''
        out_bound_time1 = moment(segment1[0].depTime, "Hmm").format("HH:mm:ss")
        return_time1 = segment2 &&  moment(segment2[0].depTime, "Hmm").format("HH:mm:ss")
        a.segments.map((el, i) => {
          let h1 =  me.getTotalHours(el)
          temp.push(h1)
          hours1 = Math.min.apply(null, temp.map(item => item))
        });
      }
      if (b.segments && Array.isArray(b.segments) && b.segments.length) {
        let temp = []
        let segment1 = b.segments[0]
        let segment2 = b.segments.length > 1 ? b.segments[1] : ''
        out_bound_time2 = moment(segment1[0].depTime, "Hmm").format("HH:mm:ss")
        return_time2 = segment2 && moment(segment2[0].depTime, "Hmm").format("HH:mm:ss")
        b.segments.map((el, i) => {
          let h1 =  me.getTotalHours(el)
          temp.push(h1)
          hours2 = Math.min.apply(null, temp.map(item => item))
        });
      }
      if (e === '0') {
          return Number(a.price) - Number(b.price)
        }else if (e === "1") {
          return Number(hours1) - Number(hours2)
        }else if (e === "2") {
          const getNumberFromTime = (time) => +time.replace(/:/g, '')
          return getNumberFromTime(a.departureTime) - getNumberFromTime(b.departureTime)
        }else if (e === "3") {
          const getNumberFromTime = (time) => +time.replace(/:/g, '')
          return getNumberFromTime(return_time1) - getNumberFromTime(return_time2)
        }
    });
    // this.setState({ recomendations: filteredList });
    this.setCurrentFlight(filteredList,1)
  };

  checkblank = (value) => {
    console.log('$value', value)
    let time1 = value.out_bound_time && value.out_bound_time.min === '' && value.out_bound_time.max === ''
    let time2 = value.return_time && value.return_time.min === '' && value.return_time.max === ''
    let duration = value.duration && value.duration.min === '' && value.duration.max === ''
    if(value.stop === undefined && value.airport === undefined && time1 && time2 && duration){
      return 'empty'
    }else {
      return 'not_empty'
    }
  }

  inappOnBoundTimeFilter = (recomendations,out_bound) => {
    if(out_bound.min === '' && out_bound.max === ''){
      console.log('case1', recomendations)
      return recomendations
    }else {
      let filteredData = []
      recomendations && recomendations.length && recomendations.map((el) => {
        el.segments.map((el2) => {
          if(el2 && Array.isArray(el2) && el2.length){
            let flight1 = el.segments.length > 0 && el.segments[0] && el.segments[0][0]
            let flight2 = el.segments.length > 0 && el.segments[0] && el.segments[0][el2.length - 1]
            let depTime = flight1 && moment(flight1.depTime, "Hmm").format("HH:mm") 
            let arriveTime = flight2 && moment(flight2.arrivalTime, "Hmm").format("HH:mm")
            let format = 'HH:mm'
            let time1 = moment(depTime,format)
            let time2 = moment(arriveTime,format)
            let beforeTime = moment(out_bound.min, format)
            let afterTime = moment(out_bound.max, format)
            console.log("🚀 ~ file: ListPage.js ~ line 352 ~ FlightList ~ el.segments.map ~ afterTime",time1,time2,  beforeTime, afterTime)
            let onBoundFilter = time1.isBetween(beforeTime, afterTime, undefined, '[]') && time2.isBetween(beforeTime, afterTime, undefined, '[]')
            if(onBoundFilter){
              filteredData.push(el)
            }
          }
        })
      })
      let unique = filteredData.filter((x, i) =>filteredData.findIndex((a) => a.counter === x.counter) === i)
      console.log('filteredData', unique)
      return unique
    }
  }

  inappReturnTimeFilter = (recomendations,out_bound) => {
    console.log(recomendations,'$out_bound',out_bound)
    if(out_bound.min === '' && out_bound.max === ''){
      console.log('case1')
      return recomendations
    }else {
      let filteredData = []
      recomendations && recomendations.length && recomendations.map((el) => {
        el.segments.map((el2) => {
          if(el2 && Array.isArray(el2) && el2.length){
            let flight1 = el.segments.length > 1 && el.segments[1] && el.segments[1][0]
            let flight2 = el.segments.length > 1 && el.segments[1] && el.segments[1][el2.length - 1]
            let depTime = flight1 && moment(flight1.depTime, "Hmm").format("HH:mm") 
            let arriveTime = flight2 && moment(flight2.arrivalTime, "Hmm").format("HH:mm")
            let format = 'HH:mm'
            let time1 = moment(depTime,format)
            let time2 = moment(arriveTime,format)
            console.log('time1', time1, time2)
            let beforeTime = moment(out_bound.min, format)
            let afterTime = moment(out_bound.max, format)
            let returnFilter = time1.isBetween(beforeTime, afterTime) && time2.isBetween(beforeTime, afterTime)
            if(returnFilter){
              filteredData.push(el)
            }
          }
        })
      })
      let unique = filteredData.filter((x, i) =>filteredData.findIndex((a) => a.counter === x.counter) === i)
      console.log('filteredData', unique)
      return unique
    }
  }

  inAppDuration = (recomendations, duration) => {
    console.log('$duration',duration)
    if(duration.min === 0){
    // if(duration.min === 0 && duration.max === 0){
      console.log('case3')
      return recomendations
    }else {
      let filteredData = []
      recomendations && recomendations.length && recomendations.map((el) => {
        el.segments.map((el2) => {
          if(el2 && Array.isArray(el2) && el2.length){
            let hours =  this.getTotalHours(el2)
            // let durationFilter = hours >= Number(duration.min) && Number(hours <= duration.max)
            let durationFilter = hours >= Number(duration.min)
            console.log("🚀 ~ file: ListPage.js ~ line 418 ~ FlightList ~ el.segments.map ~ duration", duration)
            console.log('hours',hours)
            if(durationFilter){
              filteredData.push(el)
            }
          }
        })
      })
      let unique = filteredData.filter((x, i) =>filteredData.findIndex((a) => a.counter === x.counter) === i)
      console.log('filteredData', unique)
      return unique
    }
   
  }

  inappStopFilter = (recomendations,value) => {
    if(value.stops === undefined || value.stops.length === 0){
      console.log('case3')
      return recomendations
    }else {
      let filteredData = []
      recomendations && recomendations.length && recomendations.map((el) => {
        el.segments.map((el2) => {
          if(el2 && Array.isArray(el2) && el2.length){
            if(value.stops && value.stops.includes(el2.length - 1)){
              filteredData.push(el)
            }
          }
        })
      })
      let unique = filteredData.filter((x, i) =>filteredData.findIndex((a) => a.counter === x.counter) === i)
      console.log('filteredData', unique)
      return unique
    }
  }

  inappAirLineFilter = (recomendations,value) => {
    if(value.airport === undefined || value.airport.length === 0){
      console.log('case3')
      return recomendations
    }else {
      let filteredData = []
      recomendations && recomendations.length && recomendations.map((el) => {
        el.segments.map((el2) => {
          if(el2 && Array.isArray(el2) && el2.length){
            el2.map(s => {
              // let string = removeNumberFromString(s.airline)
              let string = s.marketCompany
              if(value.airport && value.airport.includes(string)){
                filteredData.push(el)
                console.log('airline', s.airline)
              }
              })
          }
        })
      })
      let unique = filteredData.filter((x, i) =>filteredData.findIndex((a) => a.counter === x.counter) === i)
      console.log('filteredData', unique)
      return unique
    }
  }


  /**
   * @method handleFilters
   * @description handle filters
   */
  handleFilters = (value) => {
    console.log('value', value)
    const { recomendations,currentPage } = this.state
    let isBlank = this.checkblank(value)
    console.log('isBlank',isBlank)
    if(isBlank === 'empty'){
      toastr.warning('Please select filter')
      this.setState({recomendations: recomendations})
    }else {
      let out_bound = value.out_bound_time
      let return_time = value.return_time
      let duration = value.duration
      let onBoundFiltered = this.inappOnBoundTimeFilter(this.props.recomendations,out_bound)
      let returnFiltered = this.inappReturnTimeFilter(onBoundFiltered,return_time)
      let durationFiltered = this.inAppDuration(returnFiltered,duration)
      let stopFiltered = this.inappStopFilter(durationFiltered, value)
      let airLineFilter = this.inappAirLineFilter(stopFiltered, value)
      this.setCurrentFlight(airLineFilter, 1)
      //this.setState({recomendations:airLineFilter})
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      priceFilter,
      timeFilter,
      currentPage,
      postPerPage,
      recomendations,
      isSidebarOpen,
      topImages,
      stopfilter,
      durationFilter,
      airLineFilter,
      filterType,
      search_params,
      currentFlights,
      maxDuration
    } = this.state;
    const { match } = this.props;
    const parameter = match.params;
    let cat_id = parameter.categoryId;
    let from_country = "", from_location = '', to_location = '', to_country = "";
    if (search_params) {
      from_country = search_params.from_location ? search_params.from_location.city_name : "";
      from_location = search_params.from_location ? search_params.from_location.name : "";
      to_country = search_params.to_location ? search_params.to_location.city_name : "";
      to_location = search_params.to_location ? search_params.to_location.name : "";
      if (search_params.reqData && search_params.reqData.multi_city) {
        let multi_city = search_params.reqData.multi_city;
        if (multi_city && Array.isArray(multi_city) && multi_city.length) {
          let last_i = multi_city.length - 1;
          from_country = multi_city[0] && multi_city[0].origin && multi_city[0].origin ? multi_city[0].origin : "";
          from_location = from_country
          to_country = multi_city[last_i] && multi_city[last_i].destination && multi_city[last_i].destination ? multi_city[last_i].destination : "";
          from_location = to_country
        }
      }
    }
    // const indexOfLastPost = currentPage * postPerPage;
    // const indexOfFirstPost = indexOfLastPost - postPerPage;
    // const currentFlights = recomendations && recomendations.slice(indexOfFirstPost, indexOfLastPost);
    console.log('currentFlights',currentFlights)
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          <NewSidebar
            history={history}
            activeCategoryId={cat_id}
            categoryName={TEMPLATE.TURISM}
            isSubcategoryPage={true}
            showAll={true}
            toggleSideBar={() =>
              this.setState({ isSidebarOpen: !isSidebarOpen })
            }
          />
          <Layout className="right-parent-block">
            <div className="inner-banner custom-inner-banner">
              <SubHeader categoryName={TEMPLATE.TURISM} showAll={true} />
              <TourismBanner {...this.props} />
              <FlightSearch
                handleFilterChange={(type) => {
                  this.setState({ filterType: type });
                }}
                filterType={filterType}
                handleSearchResponce={this.handleSearchResponce}
                listPage={true}
                resetFilters={() =>{this.setState({isReset: true})}
                }
              />
            </div>
            <Content className="site-layout flight-list-page">
              <div className="wrap-inner full-width-wrap-inner fm-cities-cards">
                <Card
                  title={
                    <div className="fm-btn-block">
                      {`Showing flights from ${blankValueCheck(from_country)} to ${blankValueCheck(to_country)}`}
                    </div>
                  }
                  bordered={false}
                  extra={
                    <ul className="panel-action fm-select-box">
                      <li>
                        <Text className="fm-label">Sort</Text>
                        <Select
                          defaultValue="Price"
                          dropdownMatchSelectWidth={false}
                          bordered={false}
                          onChange={(e) => {
                              this.handleSortBySegment(e, recomendations);
                          }}
                        >
                          <Option value="0">Cheapest First</Option>
                          <Option value="1">Fastest First</Option>
                          <Option value="2">Outbound: Departure time</Option>
                          <Option value="3">Return: Departure time</Option>
                        </Select>
                      </li>
                    </ul>
                  }
                  className={
                    "home-product-list header-nospace fm-listing-page fm-flight-head"
                  }
                ></Card>
                <div className="mt-30">
                  <Row gutter={[40, 40]}>
                    <Col lg={6}>
                      <div className="left-searching-box">
                        <MoreFilter 
                          maxDuration={maxDuration}
                          airLineFilter={airLineFilter}
                          handleFilter={(value) => this.handleFilters(value)}
                          isReset={this.state.isReset}
                          resetFlightSearch={() => 
                            this.setCurrentFlight(this.props.recomendations, 1)
                          }
                        />
                      </div>
                    </Col>
                    <Col lg={18} className="fm-list-table">
                      <div className="right-detail-box">
                        <Text className="fm-total-result">{`${recomendations && recomendations.length
                          } results`}</Text>
                          <Text className="prz-tax-msg">
                          The price includes taxes and fees
                      </Text>
                        {this.renderFlightDetails(currentFlights, search_params, from_location, to_location)}
                        {recomendations && recomendations.length > 6 && (
                          <Pagination
                            defaultCurrent={1}
                            defaultPageSize={6} //default size of page
                            showSizeChanger={false}
                            onChange={this.handlePageChange}
                            total={recomendations.length} //total number of card data available
                            itemRender={itemRender}
                            className={"mt-75 mb-20"}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, classifieds, tourism } = store;
  const { flightRecords, flight_search_params } = tourism;
  console.log("flightRecords", flightRecords);
  let filterSection =
    flightRecords && flightRecords.body ? flightRecords.body.filterSection : "";
  let recomendations =
    flightRecords && flightRecords.body
      ? flightRecords.body.recomendations
      : [];
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedClassifiedList: classifieds.classifiedsList,
    filterSection,
    recomendations,
    search_params: flight_search_params,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getBannerById,
  openLoginModel,
})(withRouter(FlightList));
