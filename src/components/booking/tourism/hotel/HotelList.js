import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Map from "../../../common/Map";
import {
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Button,
  Rate,
  Select,
  Pagination,
} from "antd";
import Icon from "../../../../components/customIcons/customIcons";
import {
  setSelectedHotelDetails,
  getHotelTotalViews,
  getHotelAverageRating,
  enableLoading,
  disableLoading,
} from "../../../../actions/index";
import history from "../../../../common/History";
import SubHeader from "../../common/SubHeader";
import "../../../common/bannerCard/bannerCard.less";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../../config/Config";
import NewSidebar from "../../NewSidebar";
import HotelSearchFilter from "./HotelSearchFilters";
import TourismBanner from "../TourismBanner";
import { salaryNumberFormate } from "../../../common";
import HotelMoreFilters from "./HotelMoreFilter";
import "../tourism.less";
import "./hotel.less";
const { Option } = Select;
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

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

class HotelSearchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: false,
      hotelList: [],
      currentPage: 1,
      postPerPage: 6,
      currentHotelList: [],
      hotelRecords: "",
      rateList: [],
      viewCount: [],
      reqData: null,
      minPrice: 0,
      maxPrice: 0,
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    const { hotelRecords, hotelSearchList } = nextprops;
    this.setCurrentList(hotelRecords, hotelSearchList, this.state.currentPage);
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    const { hotelRecords, hotelSearchList } = this.props;
    this.setCurrentList(hotelRecords, hotelSearchList, this.state.currentPage);
    this.getViewAndRating(this.state.currentPage, hotelSearchList);
  }

  /**
   * @method checkFavCheck
   * @description check car is fav or not
   */
  getViewAndRating = async (currentPage, hotelList) => {
    const { postPerPage } = this.state;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const list =
      hotelList && hotelList.slice(indexOfFirstPost, indexOfLastPost);
    var allRes = [];
    var allViewsCount = [];
    this.props.enableLoading();
    allRes = await Promise.all(
      list.map(async (el, i) => {
        let code = el.basicPropertyInfo && el.basicPropertyInfo.hotelCode;
        return new Promise((resolve) => {
          this.props.getHotelAverageRating({ hotelCode: code }, (res) => {
            if (res.status === 200) {
              resolve({ id: code, rating: res.data.data });
            }
          });
        });
      })
    );

    allViewsCount = await Promise.all(
      list.map(async (el, i) => {
        let code = el.basicPropertyInfo && el.basicPropertyInfo.hotelCode;
        return new Promise((resolve) => {
          let formData = new FormData();
          formData.append("hotelCode", code);
          this.props.getHotelTotalViews(formData, (res) => {
            if (res !== undefined && res.status === 200) {
              resolve({
                id: code,
                count: res.data.data.length ? res.data.data[0].total_views : 0,
              });
            } else {
              resolve({ id: code, count: 0 });
            }
          });
        });
      })
    );
    this.setState({ rateList: allRes, viewCount: allViewsCount }, () => {
      this.props.disableLoading();
    });
  };

  /**
   * @method setCurrentList
   * @description set current list
   */
  setCurrentList = (hotelRecords, hotelList, currentPage) => {
    const { maxPrice, minPrice } = this.state
    let min = 0, max = 0;
    if(maxPrice == 0 && minPrice == 0){
      hotelList.map((el, i) => {
      if(el.basicPropertyInfo && el.basicPropertyInfo.amount && el.basicPropertyInfo.amount.amountAfterTax){
        if(min > +el.basicPropertyInfo.amount.amountAfterTax || min == 0){
          min = +el.basicPropertyInfo.amount.amountAfterTax
        }
        if(max < +el.basicPropertyInfo.amount.amountAfterTax){
          max = +el.basicPropertyInfo.amount.amountAfterTax
        }
      }
    })
    }else{
      min = minPrice;
      max = maxPrice;
    }
    const { postPerPage } = this.state;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const list =
    hotelList && hotelList.slice(indexOfFirstPost, indexOfLastPost);
    this.setState({
      hotelRecords: hotelRecords,
      hotelList: hotelList,
      currentHotelList: list,
      maxPrice: max,
      minPrice: min,
    });
  };

  /**
   * @method handleSort
   * @description handle in appp sorting
   */
  handleSort = (e, currentList) => {
    const { hotelRecords, currentPage } = this.state;
    let filteredList = currentList.sort(function (a, b) {
      let first = a.basicPropertyInfo ? a.basicPropertyInfo : "";
      let second = b.basicPropertyInfo ? b.basicPropertyInfo : "";
      let obj1 =
        first.amount && first.amount.amountAfterTax
          ? first.amount.amountAfterTax
          : 0;
      let obj2 =
        second.amount && second.amount.amountAfterTax
          ? second.amount.amountAfterTax
          : 0;
      if (e === "1") {
        if (obj1 > obj2) return -1;
        if (obj1 < obj2) return 1;
        return 0;
      } else if (e === "0") {
        if (obj1 < obj2) return -1;
        if (obj1 > obj2) return 1;
        return 0;
      }
    });
    this.setCurrentList(hotelRecords, filteredList, 1);
  };

  /**
   * @method renderCarList
   * @description render car list
   */
  renderCarList = (carList, reqData) => {
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    const { rateList, viewCount } = this.state;
    if (carList && Array.isArray(carList) && carList.length) {
      return carList.map((el, i) => {
        let basic_info = el.basicPropertyInfo ? el.basicPropertyInfo : "";
        let info =
          el.descriptiveInfo &&
          Array.isArray(el.descriptiveInfo) &&
          el.descriptiveInfo.length
            ? el.descriptiveInfo[0]
            : "";
        let image =
          info && Array.isArray(info.hotelImages) && info.hotelImages.length
            ? info.hotelImages[0]
            : "";
        let price =
          basic_info.amount && basic_info.amount.amountAfterTax
            ? basic_info.amount.amountAfterTax
            : 0;
        let rateIndex =
          rateList.length !== 0 &&
          rateList.findIndex(
            (el) =>
              el.id === basic_info.hotelCode &&
              Array.isArray(el.rating) &&
              el.rating[0].average_rating !== null
          );
        let countIndex =
          viewCount.length !== 0 &&
          viewCount.findIndex(
            (el) => el.id === basic_info.hotelCode && el.count > 0
          );
        let count =
          countIndex >= 0 && viewCount.length ? viewCount[countIndex].count : 0;
        let rate =
          rateIndex >= 0 && rateList.length
            ? rateList[rateIndex].rating[0] &&
              rateList[rateIndex].rating[0].average_rating
            : 0;
        return (
          <div className="car-list-detail ">
            <Link
              className={"booking-detail-card booking-car-detail "}
              onClick={() => {
                this.props.setSelectedHotelDetails(el);
                // this.props.history.push(
                //   `/booking-tourism-hotel-detail/${cat_id}`
                // );
              }}
              to={{pathname: `/booking-tourism-hotel-detail/${cat_id}`,
                            state: {
                              reqData,
                              passedHotelData: el,
                              basic_info,
                              info,
                              image: image ? image : DEFAULT_IMAGE_CARD,
                              price,
                              rateIndex,
                              countIndex,
                              rate
                            }
                          }}
              style={{ cursor: "pointer" }}
            >
              <Row>
                <Col md={10}>
                  {/* <div className='tag'>Save 55%</div>
                  removed as per mapping */}
                  <img
                    alt={""}
                    src={image ? image : DEFAULT_IMAGE_CARD}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE_CARD;
                    }}
                    alt={""}
                  />
                </Col>
                <Col md={14} className="detail-card-body">
                  <div className="rate-section d-flex">
                    <span style={{ marginRight: "5px" }}>
                      {rate ? `${rate}.0` : ""}
                    </span>
                    <Rate allowHalf value={rate} />
                    <div className="views info">{count} Views</div>

                    <div className="place info">
                      <Icon icon="location" size="12" />
                      {info ? info.cityName : ""}
                    </div>
                    {/* <span className='info'>4 Star</span> */}
                    {/* removed as per the mapping */}
                  </div>
                  <div className="subcategory">Hotels</div>

                  <div className="d-flex title-div">
                    <div className="title">
                      <p>{info ? info.hotelName : ""}</p>
                    </div>

                    <div className="price-box">
                      <div className="price">
                        {price ? `$ ${salaryNumberFormate(price)} ` : "$0"}
                        <span>per day </span>
                        {/* <Paragraph className='sub-text'>
                          Per night
                        </Paragraph> */}
                      </div>
                    </div>
                  </div>

                  {/* <div className='d-flex btn-div'>
                    <div>
                      <p>Breakfast included</p>
                      <p>Free Cancellation</p>
                    </div>
                    <Button className='btn-enquiry'>
                      <img
                        alt={''}
                        src={require('../../../../assets/images/icons/email-grey.svg')}
                      />
                      <span>Send an Enquiry</span>
                    </Button>
                  </div> */}
                </Col>
              </Row>
            </Link>
          </div>
        );
      });
    } else {
      return (
        <div className="data-msg">
          {" "}
          <p>
            <span>Sorry!</span> No hotel available
          </p>
        </div>
      );
    }
  };

  filterData = (filterData) => {
    const {hotelRecords, currentPage} = this.state
//   let filterData = {
//     accomodation: values.accomodation,
//     amenities: values.amenities, // ["Parking"]
//     budget: values.budget, //[3000]
//     distance: values.distance, //[7]
//     meal: values.meal, //["free"]
//     rating: values.rating, //[5]
// }
    let budgetsort = this.sortbudget(filterData.budget)
    let distancesorted = this.sortdist(filterData.distance, budgetsort)
    let ratingsorted = this.sortrating(filterData.rating, distancesorted)
    let amenitiessorted = this.sortamenities(filterData.amenities, ratingsorted)
    let accomodationsorted = this.sortacc(filterData.accomodation, amenitiessorted)
    // let mealssorted = this.sortmeal(filterData.meal, accomodationsorted)
    this.setCurrentList(hotelRecords, accomodationsorted, currentPage)
    // this.setState({
    //   currentHotelList: accomodationsorted,
    // });
  }

  sortmeal = (meal, list) => {
    let tmp = meal && Array.isArray(meal) && meal.length > 0 ? [] : list;
    meal && Array.isArray(meal) && meal.length > 0 && list.map((l) => {
      if(l.basicPropertyInfo){
        tmp.push(l)
      }
    })
    return tmp
  }

  sortacc = (accomodation, list) => {
    let tmp = accomodation && Array.isArray(accomodation) && accomodation.length > 0 ? [] : list;
    accomodation && Array.isArray(accomodation) && accomodation.length > 0 && list.map((l) => {
      if(l.basicPropertyInfo && l.basicPropertyInfo.hotelSegmentCategory && l.basicPropertyInfo.hotelSegmentCategory.name && accomodation.includes(l.basicPropertyInfo.hotelSegmentCategory.name)){
        tmp.push(l)
      }
    })
    return tmp
  }

  sortamenities = (amenities, list) => {
    let tmp = amenities && Array.isArray(amenities) && amenities.length > 0 ? [] : list;
    amenities && Array.isArray(amenities) && amenities.length > 0 && list.map((l) => {
      l.descriptiveInfo && l.descriptiveInfo.hotelAmenities.length && l.descriptiveInfo.hotelAmenities.map((t) => {
        if(amenities.includes(t.name)){
          tmp.push(l)
        }
      })
    })
    return tmp
  }

  sortrating = (rating, list) => {
    let tmp = rating && Array.isArray(rating) && rating.length > 0 ? [] : list;
    rating && Array.isArray(rating) && rating.length > 0 && list.map((l) => {
      rating.map((r) => {
        switch(r){
          case 2:
            if(l.descriptiveInfo[0].awards && l.descriptiveInfo[0].awards.length > 0 && +l.descriptiveInfo[0].awards[0].rating < 2){
              tmp.push(l)
            }
            break;
          case 3:
            if(l.descriptiveInfo[0].awards && l.descriptiveInfo[0].awards.length > 0 && +l.descriptiveInfo[0].awards[0].rating < 3){
              tmp.push(l)
            }
            break;
          case 4:
            if(l.descriptiveInfo[0].awards && l.descriptiveInfo[0].awards.length > 0 && +l.descriptiveInfo[0].awards[0].rating < 4){
              tmp.push(l)
            }
            break;
          case 5:
            if(l.descriptiveInfo[0].awards && l.descriptiveInfo[0].awards.length > 0 && +l.descriptiveInfo[0].awards[0].rating < 5){
              tmp.push(l)
            }
            break;
          default:
              tmp.push(l)
            break;
        }
      })
    })
    return tmp
  }

  sortdist = (distance, list) => {
    let tmp = distance && Array.isArray(distance) && distance.length > 0 ? [] : list;
    distance && Array.isArray(distance) && distance.length > 0 && list.map((l) => {
      distance.map((d) => {
        switch(d){
          case 2:
            if(l.basicPropertyInfo.relativePosition && +l.basicPropertyInfo.relativePosition.distance <= 2){
              tmp.push(l)
            }
            break;
          case 5:
            if(l.basicPropertyInfo.relativePosition && +l.basicPropertyInfo.relativePosition.distance <= 5){
              tmp.push(l)
            }
            break;
          case 7:
            if(l.basicPropertyInfo.relativePosition && +l.basicPropertyInfo.relativePosition.distance <= 7){
              tmp.push(l)
            }
            break;
          case 10:
            if(l.basicPropertyInfo.relativePosition && +l.basicPropertyInfo.relativePosition.distance <= 10){
              tmp.push(l)
            }
            break;
          default:
              tmp.push(l)
            break;
        }
      })
    })
    return tmp
  }

  sortbudget = (budget) => {
    const { hotelSearchList } = this.props;
    const list = hotelSearchList
    // let tmp = budget && Array.isArray(budget) && budget.length > 0 ? [] : list;
    let tmp = [];
    budget && list.map((l) => {
    if(l.basicPropertyInfo.amount && +l.basicPropertyInfo.amount.amountAfterTax <= +budget){
      tmp.push(l)
    }
    // budget && Array.isArray(budget) && budget.length > 0 && list.map((l) => {
        // budget.map((b) => {
        // switch(b){
        //   case 1000:
        //     if(l.basicPropertyInfo.amount && +l.basicPropertyInfo.amount.amountAfterTax <= 1000){
        //       tmp.push(l)
        //     break;
        //     }
        //   case 3000:
        //     if(+l.basicPropertyInfo.amount.amountAfterTax <= 3000 && +l.basicPropertyInfo.amount.amountAfterTax > 1000){
        //       tmp.push(l)
        //     }
        //     break;
        //   case 5000:
        //     if(+l.basicPropertyInfo.amount.amountAfterTax <= 5000 && +l.basicPropertyInfo.amount.amountAfterTax > 3000){
        //       tmp.push(l)
        //     }
        //     break;
        //   case 10000:
        //     if(+l.basicPropertyInfo.amount.amountAfterTax <= 10000 && +l.basicPropertyInfo.amount.amountAfterTax > 5000){
        //       tmp.push(l)
        //     }
        //     break;
        //   default:
        //     if(+l.basicPropertyInfo.amount.amountAfterTax > 10000){
        //       tmp.push(l)
        //     }
        //     break;
        // }
      // })
    })
    return tmp
  }

  resetCarFilter = () => {
    this.setState(
      {
        currentHotelList: this.props.hotelSearchList
      }
    )
  }

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { hotelRecords, hotelList } = this.state;
    this.setState({ currentPage: e }, () => {
      this.setCurrentList(hotelRecords, hotelList, e);
      this.getViewAndRating(e, hotelList);
    });
  };

  handleSearchResponce = (res, resetFlag, reqData) => {
    const { hotelList } = this.state;
    this.getViewAndRating(1, hotelList);
    this.setState({
      reqData: reqData
    })
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      currentHotelList,
      isSidebarOpen,
      hotelList,
      viewCount,
      rateList,
      hotelRecords,
      minPrice,
      maxPrice,
    } = this.state;
    const { search_params, history: {location: {state}} } = this.props;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let cat_name = parameter.categoryName;
    let path = `/booking-tourism-hotel-map-view/${cat_name}/${cat_id}`;
    let location =
      search_params && search_params.from_location
        ? search_params.from_location
        : "";
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
              <HotelSearchFilter
                handleSearchResponce={(res, resetFlag, reqData) => this.handleSearchResponce(res, resetFlag, reqData)}
              />
            </div>
            <Content className="site-layout">
              <div className="wrap-inner full-width-wrap-inner bg-gray-linear">
                <Card
                  title={
                    <span className={"nostyle"}>
                      {location ? location.city_name : ""}
                    </span>
                  }
                  bordered={false}
                  extra={
                    <ul className="panel-action">
                      <li>
                        <div className="location">
                          <Icon icon="location" size="20" className="mr-12" />
                          {location ? location.city_name : ""}{" "}
                        </div>
                      </li>
                      <li title={"List view"} className={"active"}>
                        <Icon icon="grid" size="22" />
                      </li>
                      <li
                        title={"Map view"}
                        onClick={() => this.props.history.push(path)}
                      >
                        <Icon icon="map" size="21" />
                      </li>
                      <li>
                        <label>{"Sort"}&nbsp;&nbsp;</label>
                        <Select
                          // defaultValue={"Recommended"}
                          placeholder="Price"
                          onChange={(e) => this.handleSort(e, hotelList)}
                          dropdownMatchSelectWidth={false}
                        >
                          <Option value="1">Price (High-Low)</Option>
                          <Option value="0">Price (Low-High)</Option>
                        </Select>
                      </li>
                    </ul>
                  }
                  className={
                    "home-product-list header-nospace wrap-booking-child-box hotel-listing-page"
                  }
                >
                  <Row gutter={[40, 40]}>
                    <Col className="gutter-row" md={7}>
                      <div className="map-box">
                        <Map
                          list={[{ lat: location.lat, lng: location.lng }]}
                        />
                        <Button>
                          <img
                            src={require("../../../../assets/images/icons/map-view.svg")}
                            alt="Map"
                            onClick={() => {
                              this.props.history.push(path);
                            }}
                          />
                          <span>
                            View a map of {location ? location.city_name : ""}
                          </span>
                        </Button>
                      </div>
                      <HotelMoreFilters hotelRecords={hotelRecords} filterData={this.filterData} min={minPrice} max={maxPrice} resetCarFilter={this.resetCarFilter}/>
                    </Col>
                    <Col className="gutter-row" md={17}>
                      {this.renderCarList(currentHotelList, this.state.reqData ? this.state.reqData : state ? state.reqData : null )}
                    </Col>
                  </Row>
                  <div className="car-list-pagination">
                    {hotelList && hotelList.length > 6 && (
                      <Pagination
                        defaultCurrent={1}
                        defaultPageSize={6} //default size of page
                        onChange={this.handlePageChange}
                        total={hotelList.length} //total number of card data available
                        itemRender={itemRender}
                        className={"mb-20"}
                      />
                    )}
                  </div>
                </Card>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { selectedHotel, hotelReqdata, hotelSearchList } = tourism;
  let hotelList =
    hotelSearchList &&
    hotelSearchList.data &&
    Array.isArray(hotelSearchList.data.data) &&
    hotelSearchList.data.data.length
      ? hotelSearchList.data.data
      : [];
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    search_params: hotelReqdata,
    hotelRecords: hotelSearchList,
    hotelSearchList: hotelList,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getHotelAverageRating,
  getHotelTotalViews,
  setSelectedHotelDetails,
})(withRouter(HotelSearchList));
