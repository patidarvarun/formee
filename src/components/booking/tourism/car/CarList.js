import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CarListDetail from "../../../../components/common/carListingDetail/CarListDetail";
import Map from "../../../common/Map";
import {
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Select,
  Breadcrumb,
  Rate,
  Pagination,
  Button,
} from "antd";
import Icon from "../../../../components/customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  checkIsCarFavOrNot,
  getCarViewCount,
  carRecommendedForYou,
  getCarRating,
} from "../../../../actions/index";
import history from "../../../../common/History";
import SubHeader from "../../common/SubHeader";
import "../../../common/bannerCard/bannerCard.less";
import { TEMPLATE, DEFAULT_IMAGE_CARD } from "../../../../config/Config";
import NewSidebar from "../../NewSidebar";
import CarSearchFilter from "./CarSearchFilters";
import TourismBanner from "../TourismBanner";
import CarMoreFilter from "./CarMoreFilter";
import { getBookingMapViewRoute } from "../../../../common/getRoutes";
import NoContentFound from "../../../common/NoContentFound";
import "../tourism.less";
import "./car.less";
const { Option } = Select;
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const topRatedCarImage = require("../../../../assets/images/toyota-yaris.png");
const importCompanyLogo = require("../../../../assets/images/euro-logo.png");

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

class CarSearchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: false,
      carList: [],
      currentPage: 1,
      postPerPage: 6,
      currentCarList: [],
      savedReqData: {},
      favList: [],
      viewCount: [],
      mostRecommended: [],
      rateList: [],
      carSearchRecords: "",
      maxAmount: null,
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    const { currentPage, postPerPage, maxAmount} = this.state;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const { carSearchRecords, carListing } = nextprops;
    if(!maxAmount && carSearchRecords && carSearchRecords.rates){
      let tmp = 0
      carSearchRecords.rates.map((el) => {
        if(el.tariffInfo && el.tariffInfo.total && el.tariffInfo.total.rateAmount > tmp){
          tmp = Math.ceil(el.tariffInfo.total.rateAmount )
        }
      })
      this.setState({
        maxAmount: tmp
      })
    }
    const currentCarList =
      carListing && carListing.slice(indexOfFirstPost, indexOfLastPost);
    this.setState({
      carList: nextprops.carListing,
      currentCarList: currentCarList,
      carSearchRecords: carSearchRecords,
    });
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    const { carListing, carSearchRecords } = this.props;
    this.checkFavCheck(this.state.currentPage, carListing);
    //this.getCarRecommendedData()
    this.setState({
      carList: carListing,
      carSearchRecords: carSearchRecords,
    });
  }

  /**
   * @method getCarRecommendedData
   * @description get car recommended data
   */
  getCarRecommendedData = () => {
    const { carList } = this.state;
    const { car_reqdata } = this.props;
    let location = carList && carList.length ? carList[0] : "";
    let search_location = car_reqdata.from_location
      ? car_reqdata.from_location.city
      : "";
    let reqData = {
      city:
        location && location.pickupLocation
          ? location.pickupLocation.city
          : search_location
          ? search_location
          : "",
    };
    const formData = new FormData();
    formData.append("city", reqData.city);
    this.props.carRecommendedForYou(formData, (res) => {
      if (res.status === 200) {
        this.setState({ mostRecommended: res.data && res.data.data });
      }
    });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { carList } = this.state;
    this.setState({ currentPage: e }, () => {
      this.setCurrentList(carList, e);
    });
    // this.checkFavCheck(e, carList)
  };

  /**
   * @method setCurrentList
   * @description set current list
   */
  setCurrentList = (carList, currentPage) => {
    const { postPerPage } = this.state;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const list = carList && carList.slice(indexOfFirstPost, indexOfLastPost);
    this.setState({ carList: carList, currentCarList: list });
  };

  /**
   * @method handleSort
   * @description handle in appp sorting
   */
  handleSort = (e, currentCarList) => {
    const { currentPage } = this.state;
    let filteredList = currentCarList.sort(function (a, b) {
      let obj1 =
          a.tariffInfo && a.tariffInfo.total && a.tariffInfo.total.rateAmount,
        obj2 =
          b.tariffInfo && b.tariffInfo.total && b.tariffInfo.total.rateAmount;
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
    this.setCurrentList(filteredList, 1);
  };

  /**
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    const { carList } = this.state;
    this.checkFavCheck(this.state.currentPage, carList);
    //this.setState({ carListing: res })
    if (resetFlag) {
      this.setState({ isSearchResult: false, savedReqData: reqData });
    }
  };

  /**
   * @method checkFavCheck
   * @description check car is fav or not
   */
  checkFavCheck = async (currentPage, carList) => {
    const { postPerPage } = this.state;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentCarList =
      carList && carList.slice(indexOfFirstPost, indexOfLastPost);
    var allRes = [];
    var allViewsCount = [];
    // if (this.props.isLoggedIn) {
    this.props.enableLoading();
    allRes = await Promise.all(
      currentCarList.map(async (el, i) => {
        return new Promise((resolve) => {
          this.props.getCarRating(
            { car_id: el.param.rateIdentifier },
            (res) => {
              if (res.status === 200) {
                resolve({ id: el.param.rateIdentifier, rating: res.data.data });
              }
            }
          );
        });
      })
    );

    allViewsCount = await Promise.all(
      currentCarList.map(async (el, i) => {
        return new Promise((resolve) => {
          this.props.getCarViewCount(el.param.rateIdentifier, (res) => {
            if (res !== undefined && res.status === 200) {
              resolve({
                id: el.param.rateIdentifier,
                count: res.data.data.length ? res.data.data[0].total_views : 0,
              });
            } else {
              resolve({ id: el.param.rateIdentifier, count: 0 });
            }
          });
        });
      })
    );

    this.setState(
      { currentCarList, rateList: allRes, viewCount: allViewsCount, carList },
      () => {
        this.props.disableLoading();
      }
    );
  };

  /**
   * @method renderMostRecommendedCars
   * @description render most recommended
   */
  renderMostRecommendedCars = () => {
    const { mostRecommended } = this.state;
    if (mostRecommended && mostRecommended.length) {
      return mostRecommended.map((el, i) => {
        return (
          <Row gutter={[28, 0]} className="pt-42" key={i}>
            <Col className="gutter-row" md={24}>
              <Card
                bordered={false}
                className={"tourism-toprated-car-card"}
                cover={
                  <img
                    alt={""}
                    src={el.car_basic ? el.car_basic.carImage : ""}
                  />
                }
              >
                <Row className={"mb-10"}>
                  <Col span={16}>
                    <div className="rate-section">
                      <Rate disabled defaultValue={el.rating} />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="europcar" align="right">
                      <img
                        alt=""
                        src={el.car_details ? el.car_details.carImage : ""}
                      />
                    </div>
                  </Col>
                </Row>
                <div className="subcategory">{"Cars"}</div>
                <Title level={4} className="title">
                  {el.car_details ? el.car_details.carName : ""}
                </Title>
                <Text className="sub-title">{"or similer"}</Text>
                <div className="price-box">
                  <div className="price">
                    <Text className="from">From</Text>
                    <span>{"AU$124"}</span>
                    <Text className="per-day">Per day</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        );
      });
    }
  };

  /**
   * @method inappSupplierFilter
   * @description supplier filter
   */
  inappSupplierFilter = (carList, value) => {
    if (value.supplier === "") {
      return carList;
    } else {
      let filterData = [];
      carList.map((el) => {
        let companyname =
          el.param &&
          el.param.carCompanyData &&
          el.param.carCompanyData.companyName;
        if (value.supplier.includes(companyname)) {
          filterData.push(el);
        }
      });
      return filterData;
    }
  };

  /**
   * @method inappRatingFilter
   * @description in app rating filters
   */
  inappRatingFilter = (carList, value) => {
    const { rateList } = this.state;
    let rating_array = [];
    rateList.map((el) => {
      let rating = el.rating && el.rating[0] && el.rating[0].average_rating;
      if (value.rating.includes(Number(rating))) {
        rating_array.push(el.id);
      }
    });
    if (value.rating === "") {
      return carList;
    }
    let filterData = [];
    carList.map((el) => {
      let rateid = el.param && el.param.rateIdentifier;
      if (rating_array.includes(rateid)) {
        filterData.push(el);
      }
    });
    return filterData;
  };

  /**
   * @method inappSpecificationFilter
   * @description in app specification filters
   */
  inappSpecificationFilter = (carList, value) => {
    if (value.specification === "") {
      return carList;
    }
    let filterData = [];
    carList.map((el) => {
      let air_conditionner =
        el.carDetails && el.carDetails.ac === "A/C" ? "ac" : "";
      let transmission =
        el.carDetails && el.carDetails.transmission === "Manual drive"
          ? "manual"
          : "";
      let automatic =
        el.carDetails && el.carDetails.transmission === "Auto drive"
          ? "automatic"
          : "";
      let doors = el.numberOfDoors == 4 ? "4" : 0;
      let speci = [air_conditionner, transmission, automatic, doors];
      if (
        value.specification &&
        value.specification.every((r) => speci.includes(r))
      ) {
        filterData.push(el);
      }
    });
    return filterData;
  };

  /**
   * @method inappMialageFilter
   * @description in app mileage filters
   */
  inappMialageFilter = (carList, value) => {
    if (value.mileage === "") {
      return carList;
    }
    let filterData = [];
    carList.map((el) => {
      let mileage = el.unlimitedMilage && el.unlimitedMilage.amountQualifier ? el.unlimitedMilage.amountQualifier : "";
      if (value.mileage.includes(mileage)) {
        filterData.push(el);
      }
    });
    return filterData;
  };

  /**
   * @method handleFilters
   * @description render filters
   */
  handleFilters = (value) => {
    let supplierFiltered = this.inappSupplierFilter(
      this.props.carListing,
      value
    );
    let specificationFiltered = this.inappSpecificationFilter(
      supplierFiltered,
      value
    );
    let mialageFiltered = this.inappMialageFilter(specificationFiltered, value);
    // let ratingFiltered = this.inappRatingFilter(mialageFiltered, value);
    let priceFiltered =  this.inappPriceFilter(mialageFiltered, value);
    let transmissionFiltered = this.inappTransmissionFilter(priceFiltered, value);
    let passangersFiltered = this.inappPassangersFilter(transmissionFiltered, value);
    this.setCurrentList(passangersFiltered, 1);
  };
  inappPassangersFilter = (carList, value) => {
    if (value.passangers === "") {
      return carList;
    } else {
      let filterData = [];
      carList.map((el) => {
        if(el.seatingCapacity && value.passangers.includes(1) && el.seatingCapacity >= 1 && el.seatingCapacity <= 4 ){
          filterData.push(el)
        }
        if(el.seatingCapacity && value.passangers.includes(2) && [5, 6].includes(el.seatingCapacity)){
          filterData.push(el)
        }
        if(el.seatingCapacity && value.passangers.includes(3) && el.seatingCapacity >= 7){
          filterData.push(el)
        }
      });
      return filterData;
    }
  }
  inappTransmissionFilter = (carList, value) => {
    if (value.transmission === "") {
      return carList;
    } else {
      let filterData = [];
      carList.map((el) => {
      if (el.carDetails && 
        value.transmission.includes(el.carDetails.transmission)
      ) {
        filterData.push(el);
      }
      });
      return filterData;
    }
  }
  inappPriceFilter = (carList, value) => {
    if (value.price === "") {
      return carList;
    } else {
      let filterData = [];
      carList.map((el) => {
        let totalPrice =
          el.tariffInfo &&
          el.tariffInfo.total &&
          el.tariffInfo.total.rateAmount;
        if (value.price >= totalPrice) {
          filterData.push(el);
        }
      });
      return filterData;
    }
  }
  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      currentPage,
      carSearchRecords,
      isSidebarOpen,
      carList,
      viewCount,
      savedReqData,
      currentCarList,
      favList,
      rateList,
      maxAmount,
    } = this.state;
    const parameter = this.props.match.params;
    const { carListing, car_reqdata } = this.props;
    let cat_id = parameter.categoryId;
    let cat_name = parameter.categoryName;
    let sub_cat_id = parameter.subCategoryId;
    let sub_cat_name = parameter.subCategoryName;
    let path = `/booking-tourism-car-map-view/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`;

    let location = carList && carList.length ? carList[0] : "";
    let pick_lat =
      car_reqdata && car_reqdata.reqData
        ? car_reqdata.reqData.pickupLocationLat
        : "";
    let pick_lng =
      car_reqdata && car_reqdata.reqData
        ? car_reqdata.reqData.pickupLocationLng
        : "";
    let drop_lat =
      car_reqdata && car_reqdata.reqData
        ? car_reqdata.reqData.dropoffLocationLat
        : "";
    let drop_lng =
      car_reqdata && car_reqdata.reqData
        ? car_reqdata.reqData.dropoffLocationLng
        : "";
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing car-listing-page">
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
              <CarSearchFilter
                handleSearchResponce={this.handleSearchResponce}
              />
            </div>
            <Content className="site-layout">
              <div className="wrap-inner full-width-wrap-inner bg-gray-linear">
                <div className="wrap-booking-child-box">
                  <Card
                    title={
                      <span className={"nostyle"}>
                        {location &&
                          location.pickupLocation &&
                          location.pickupLocation.city}
                      </span>
                    }
                    bordered={false}
                    extra={
                      <ul className="panel-action">
                        <li title={"List view"} className={"active"}>
                          <Icon icon="grid" size="18" />
                        </li>
                        <li
                          title={"Map view"}
                          onClick={() => this.props.history.push(path)}
                        >
                          <Icon icon="map" size="18" />
                        </li>
                        <li>
                          <label>{"Sort"}&nbsp;&nbsp;</label>
                          <Select
                            defaultValue={"Recommended"}
                            onChange={(e) => this.handleSort(e, carList)}
                            dropdownMatchSelectWidth={false}
                          >
                            <Option value="1">Price (High-Low)</Option>
                            <Option value="0">Price (Low-High)</Option>
                          </Select>
                        </li>
                      </ul>
                    }
                    className={"home-product-list header-nospace"}
                  >
                    <Row gutter={[60, 28]}>
                      <Col className="gutter-row" md={8}>
                        <div className="map-box">
                          {/* <img
                          alt="Map"
                          src={require("../../../../assets/images/dummy-map.jpg")}
                        /> */}
                          <Map list={[{ lat: pick_lat, lng: pick_lng }]} />
                          <Button>
                            <img
                              src={require("../../../../assets/images/icons/map-view.svg")}
                              alt="Map"
                              onClick={() => {
                                this.props.history.push(path);
                              }}
                            />
                            <span>
                              View a map of{" "}
                              {location &&
                                location.pickupLocation &&
                                location.pickupLocation.city}
                            </span>
                          </Button>
                        </div>
                        {/* <Title
                        level={2}
                        className="sub-heading pt-20 mb-0 align-center"
                      >
                        {"Recommended for you in"} {location && location.pickupLocation && location.pickupLocation.city}
                      </Title> */}
                        <CarMoreFilter
                          carSearchRecords={carSearchRecords}
                          handleFilter={(value) => this.handleFilters(value)}
                          maxAmount={maxAmount}
                          resetCarFilter={() =>
                            this.setCurrentList(this.props.carListing, 1)
                          }
                        />

                        {/* {topRatedCarRentalData.map((item, index) => (
                        <Row gutter={[28, 0]} className="pt-42" key={index}>
                          <Col className="gutter-row" md={24}>
                            <Card
                              bordered={false}
                              className={"tourism-toprated-car-card"}
                              cover={<img alt={item.name} src={item.image} />}
                            >
                              <Row className={"mb-10"}>
                                <Col span={16}>
                                  <div className="rate-section">
                                    <Rate allowHalf defaultValue={3.0} />
                                  </div>
                                </Col>
                                <Col span={8}>
                                  <div className="europcar" align="right">
                                    <img alt="" src={item.companyLogo} />
                                  </div>
                                </Col>
                              </Row>
                              <div className="subcategory">
                                {item.subCategory}
                              </div>
                              <Title level={4} className="title">
                                {item.name}
                              </Title>
                              <Text className="sub-title">{item.similar}</Text>
                              <div className="price-box">
                                <div className="price">
                                  <Text className="from">From</Text>
                                  <span>{item.price}</span>
                                  <Text className="per-day">per day</Text>
                                </div>
                              </div>
                            </Card>
                          </Col>
                        </Row>
                      ))} */}
                        {/* {this.renderMostRecommendedCars()} */}
                      </Col>
                      <Col className="gutter-row" md={16}>
                        <Text className="fm-total-result">{`${
                          carList && carList.length
                        } results`}</Text>
                        {currentCarList.length ? (
                          <div className="mt-15">
                            {currentCarList.map((el, index) => (
                              <CarListDetail
                                data={el}
                                savedReqData={savedReqData}
                                favList={favList}
                                viewCount={viewCount}
                                rateList={rateList}
                                handleSearchResponce={this.handleSearchResponce}
                                {...this.props}
                                index={index + 1}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="data-msg">
                            {" "}
                            <p>
                              <span>Sorry!</span> No car service available
                            </p>
                          </div>
                        )}
                      </Col>
                    </Row>
                    <div className="car-list-pagination">
                      {carList && carList.length > 6 && (
                        <Pagination
                          defaultCurrent={1}
                          defaultPageSize={6} //default size of page
                          onChange={this.handlePageChange}
                          total={carList.length} //total number of card data available
                          itemRender={itemRender}
                          className={"mb-20"}
                        />
                      )}
                    </div>
                  </Card>
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
  const { auth, tourism } = store;
  const { carList, car_reqdata } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    carSearchRecords: carList,
    car_reqdata,
    carListing:
      carList &&
      carList.rates &&
      Array.isArray(carList.rates) &&
      carList.rates.length
        ? carList.rates
        : [],
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  checkIsCarFavOrNot,
  getCarViewCount,
  carRecommendedForYou,
  getCarRating,
})(withRouter(CarSearchList));
