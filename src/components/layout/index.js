import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Card } from "antd";
import Icon from "../../components/customIcons/customIcons";
import DetailCard from "../common/DetailCard";
import BookingDetailCard from "../booking/common/Card";
import CommonCard from "../common/Card";
import GlobalCard from "../common/GlobalSearchCard";
import {
  setCurrentLocation,
  enableLoading,
  disableLoading,
  setLatLong,
  getBannerById,
  getRetailList,
  getMostViewdData,
  newInClassified,
  newInBookings,
  closeLoginModel,
  openLoginModel,
} from "../../actions/index";
import { CarouselSlider } from "../../components/common/CarouselSlider";
import { langs } from "../../config/localization";
import GlobalSearch from "../common/GlobalSearch";
import ResetPasswordModal from "../auth/ResetPasswordModal";
import { getAddress } from "../common";
import NoContentFound from "../common/NoContentFound";
const { Content } = Layout;
class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      middleImages: [],
      middleone: [],
      bottomImages: [],
      allRetailId: [],
      newInRetail: [],
      mostView: [],
      newClassified: [],
      newBooking: [],
      tempArray: [],
      searchItem: "",
      token: "",
      isOpenResetModel: false,
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.retailList.length !== nextProps.retailList.length) {
      let retailId = [],
        classifiedId = [];
      if (nextProps.retailList) {
        retailId = nextProps.retailList.map((el) => el.id);
        this.newInRetailData(retailId);
      }
      if (nextProps.classifiedList) {
        classifiedId = nextProps.classifiedList.map((el) => el.id);
        this.newClassifiedData(classifiedId);
      }
    }
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getAllRecords();
    const mapObj = window.navigator;
    let lat, long;
    let me = this.props;
    if (mapObj.geolocation) {
      mapObj.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        const data = { lat: lat, long: long };
        me.setLatLong(data);
        console.log("$$$$data", data);
        getAddress(lat, long, (res) => {
          if (res) {
            me.setCurrentLocation(res);
          }
        });
      });
    }
  }

  /**
   * @method getAllRecords
   * @description get all records
   */
  getAllRecords = () => {
    const { retailList, classifiedList } = this.props;
    let promOfBookingData = this.newInBookingData();
    let retailId = retailList.map((el) => el.id);
    let promOfRetailData = this.newInRetailData(retailId);
    let classifiedId = classifiedList.map((el) => el.id);
    let promOfClassifiedData = this.newClassifiedData(classifiedId);
    let promOfBannerData = this.getBannerData();
    let promOfMostView = this.mostViewdList();

    //Forgot Password token
    const filter = this.props.match.params.token;
    if (filter !== undefined) {
      this.props.closeLoginModel();
    }
    const me = this;
    Promise.all([
      promOfClassifiedData,
      promOfRetailData,
      promOfBookingData,
      promOfBannerData,
      promOfMostView,
    ]).then(function (result) {
      console.log("+++", result);

      me.setState(
        {
          newClassified: result[0],
          newInRetail: result[1],
          newBooking: result[2],
          topImages: result[3] ? result[3].topImages : [],
          middleImages: result[3] ? result[3].middleImages : [],
          middleone: result[3] ? result[3].middleone : [],
          bottomImages: result[3] ? result[3].bottomImages : [],
          mostView: result[4],
          token: filter === undefined ? "" : filter,
          isOpenResetModel: filter === undefined ? false : true,
        },
        () => {
          me.props.disableLoading();
        }
      );
      return true; // return from here to go to the next promise down
    });
  };

  /**
   * @method newClassifiedData
   * @description get new retail list
   */
  newClassifiedData = (classifiedId) => {
    let filter = this.props.match.params.token;
    if (classifiedId && classifiedId.length) {
      let id = classifiedId.join(",");
      const { isLoggedIn, loggedInDetail } = this.props;
      const requestData = {
        id: id,
        user_id: isLoggedIn ? loggedInDetail.id : "",
      };

      return new Promise((resolve, reject) => {
        this.props.newInClassified(requestData, (res) => {
          // this.props.disableLoading()
          if (res.status === 200) {
            const classified =
              res.data && Array.isArray(res.data.data) ? res.data.data : [];
            const newClassified = classified.length
              ? classified.slice(0, 4)
              : [];
            console.log("newClassified: ", newClassified);
            // this.setState({ newClassified })
            // return newClassified
            resolve(newClassified);
          } else {
            resolve([]);
            // return []
          }
        });
      });
    }
  };

  /**
   * @method newInRetailData
   * @description get new retail list
   */
  newInRetailData = (retailList) => {
    const id = retailList && retailList.length !== 0 && retailList.join(",");
    const { isLoggedIn, loggedInDetail } = this.props;
    const requestData = {
      id: id,
      recent: "recent",
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    return new Promise((resolve, reject) => {
      this.props.getRetailList(requestData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          const retail = Array.isArray(res.data.data) ? res.data.data : [];
          const newInRetail = retail.length && retail.slice(0, 4);
          resolve(newInRetail);
          // this.setState({ newInRetail })
        } else {
          resolve([]);
        }
      });
    });
  };

  /**
   * @method newInBookingData
   * @description get new in booking data
   */
  newInBookingData = (retailList) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const requestData = {
      lat: "-37.840935",
      lng: "144.946457",
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    return new Promise((resolve, reject) => {
      this.props.newInBookings(requestData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          const booking = Array.isArray(res.data.data) ? res.data.data : [];
          const newInBooking = booking.length && booking.slice(0, 4);
          resolve(newInBooking);
          // this.setState({ newBooking: newInBooking })
        } else {
          resolve([]);
        }
      });
    });
  };

  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = () => {
    return new Promise((resolve, reject) => {
      this.props.getBannerById(1, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          const banners =
            res.data.data && Array.isArray(res.data.data.banners)
              ? res.data.data.banners
              : [];
          console.log("banners", banners);
          const top = banners.filter(
            (el) => el.bannerPosition === langs.key.top
          );
          const middle = banners.filter(
            (el) => el.bannerPosition === langs.key.middle_one
          );
          const middle1 = banners.filter(
            (el) => el.bannerPosition === langs.key.middle_two
          );
          const bottom = banners.filter(
            (el) => el.bannerPosition === langs.key.bottom
          );
          resolve({
            topImages: top,
            middleImages: middle,
            middleone: middle1,
            bottomImages: bottom,
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  /**
   * @method addElement
   * @description add element in object
   */
  addElement = (ElementList, element) => {
    let newList = Object.assign(ElementList, element);
    return newList;
  };

  /**
   * @method mostViewdList
   * @description most viewed list of retail, classified and booking
   */
  mostViewdList = () => {
    const { loggedInDetail, isLoggedIn } = this.props;
    let temp = [];
    return new Promise((resolve, reject) => {
      const requestData = {
        user_id: isLoggedIn ? loggedInDetail.id : "",
      };
      this.props.getMostViewdData(requestData, (res) => {
        console.log("res:  ", res);
        if (res.status === 200) {
          const data1 = res.data.data.classifiedMostViewed;
          const classifiedUp = data1.length && data1.slice(0, 4);
          const data2 = res.data.data.retailMostViewed;
          const retailUp = data2.length && data2.slice(0, 1);
          const data3 = res.data.data.bookingMostViewed;
          const bookingUp = data3.length && data3.slice(0, 2);
          // let mostViewClassified = classifiedUp && classifiedUp[0]
          //temprory code nned to  change
          let mostViewClassified = classifiedUp && classifiedUp;
          //
          console.log("mostViewClassified: %%", mostViewClassified);
          let mostViewRetail = retailUp && retailUp[0];
          console.log("mostViewRetail: %%", mostViewRetail);
          let mostViewBooking = bookingUp;
          console.log("mostViewBooking: %%", mostViewBooking);
          let retail, booking1, classified, booking2;
          if (mostViewRetail) {
            let icon1 = {
              tagIcon: <Icon icon="cart" size="30" />,
              tagIconColor: "#CA71B7",
              retail: "retail",
              template_slug: "retail",
            };
            retail = this.addElement(mostViewRetail, icon1);
          }
          if (mostViewClassified) {
            let icon2 = {
              tagIcon: <Icon icon="classifieds" size="30" />,
              tagIconColor: "#7EC5F7",
              template_slug: "general",
            };

            mostViewClassified &&
              mostViewClassified.length &&
              mostViewClassified.map((el) => {
                classified = this.addElement(el, icon2);
                temp.push(classified);
              });
            // classified = this.addElement(mostViewClassified, icon2)
          }
          if (mostViewBooking) {
            console.log("mostViewBooking", mostViewBooking);
            let icon2 = {
              tagIcon: <Icon icon="location-search" size="30" />,
              template_slug: "booking",
              tagIconColor: "#FFC468",
              price: mostViewBooking.rate_per_hour,
              booking: true,
            };
            mostViewBooking &&
              mostViewBooking.length &&
              mostViewBooking.map((el, i) => {
                if (i === 0) {
                  booking1 = this.addElement(el, icon2);
                } else {
                  booking2 = this.addElement(el, icon2);
                }
              });
            console.log("booking1", booking1, booking2);
          }
          // let mostView = []
          // if (mostViewRetail && mostViewClassified && mostViewBooking.length) {
          //   mostView = [retail, classified, booking1, booking2]
          // } else if (mostViewRetail && mostViewBooking.length) {
          //   mostView = [retail, booking1, booking2]
          // } else if (mostViewClassified && mostViewBooking.length) {
          //   mostView = [classified, booking1, booking2]
          // } else if (mostViewClassified && mostViewRetail) {
          //   mostView = [retail, classified]
          // }
          //temprory code nned to  change
          return resolve(temp);
        } else {
          resolve([]);
        }
      });
    });
  };

  /**
   * @method renderCard
   * @description render card details
   */
  renderCard = (categoryData) => {
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[25, 25]}>
            {categoryData &&
              categoryData.map((data, i) => {
                return <BookingDetailCard data={data} key={i} col={6} />;
              })}
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method renderCard
   * @description render card details
   */
  renderRetailCard = (categoryData) => {
    const { searchItem } = this.state;
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[25, 25]}>
            {categoryData &&
              categoryData.map((data, i) => {
                return (
                  <CommonCard
                    data={data}
                    key={i}
                    retail={true}
                    col={6}
                    searchItem={searchItem}
                  />
                );
              })}
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method renderClassifiedCard
   * @description render card details
   */
  renderClassifiedCard = (categoryData) => {
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[25, 25]}>
            {categoryData &&
              categoryData.map((data, i) => {
                return <CommonCard data={data} key={i} col={6} />;
              })}
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method renderCommonCard
   * @description render card details
   */
  renderCommonCard = (categoryData) => {
    const { searchReqData } = this.state;
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[25, 25]}>
            {categoryData &&
              categoryData.map((data, i) => {
                return (
                  <GlobalCard
                    data={data}
                    key={i}
                    col={6}
                    searchReqData={searchReqData}
                    handleSearchResponce={this.handleSearchResponce}
                  />
                );
              })}
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    if (resetFlag) {
      this.setState({ isSearchResult: false });
      this.getAllRecords();
    } else {
      this.setState({
        dataList: res,
        isSearchResult: true,
        searchReqData: reqData,
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      dataList,
      isSearchResult,
      topImages,
      isOpenResetModel,
      token,
      newInRetail,
      mostView,
      middleone,
      newClassified,
      newBooking,
    } = this.state;
    let hide = newClassified && newClassified.length === 0;

    return (
      <div className="App home-page-main-block">
        <Layout>
          <Layout>
            {/* <AppSidebarInner history={history} /> */}
            <Layout>
              <div className="main-banner">
                <div className="banner-inner-block">
                  <div class="sub-header-heading-block inner-page-title">
                    <div class="heading-block">Welcome To Formee</div>
                  </div>
                  {topImages && topImages.length ? (
                    <CarouselSlider bannerItem={topImages} pathName="/" />
                  ) : (
                    ""
                  )}
                  <GlobalSearch
                    handleSearchResponce={this.handleSearchResponce}
                  />
                </div>
              </div>
              {isSearchResult ? (
                <Content className="site-layout">
                  <div className="product-list-wrap">
                    <Card bordered={false} className={"home-product-list"}>
                      {this.renderCommonCard(dataList)}
                    </Card>
                  </div>
                </Content>
              ) : (
                <Content className="site-layout">
                  <div className="product-list-wrap">
                    <Card
                      title="Most Viewed"
                      // extra={<Link to='#'>See more <Icon icon='arrow-right' size='13' /></Link>}
                      bordered={false}
                      className={"home-product-list"}
                    >
                      <DetailCard
                        destructuredKey={{
                          catIdkey: "parent_categoryid",
                          subCatIdKey: "id",
                          catname: "parentCategoryName",
                        }}
                        flag={{ wishlist: "wishlist" }}
                        topData={mostView && mostView}
                        callNext={() => this.getAllRecords()}
                        booking={true}
                      />
                    </Card>
                  </div>
                  {/* <div className='offer-section1'>
                  <CarouselSlider bannerItem={middleImages} pathName='/' />
                </div> */}
                  <div className="product-list-wrap pt-0">
                    <Card
                      title={
                        <span style={{ color: "#CA71B7" }}>
                          {"New in Retail"}
                        </span>
                      }
                      extra={
                        <Link to="/retail">
                          See more{" "}
                          <Icon
                            icon="arrow-right"
                            size="13"
                            className="arrow-right"
                          />
                        </Link>
                      }
                      bordered={false}
                      className={"home-product-list new-in-retail"}
                    >
                      {this.renderRetailCard(newInRetail)}
                    </Card>
                  </div>
                  {/* <Row className='mb-10'>
                  <Col span={24}>
                    <CarouselSlider bannerItem={middleone} pathName='/' className='mid-banner' />
                  </Col>
                </Row> */}
                  <div className="product-list-wrap pt-0">
                    <Card
                      title={
                        <span
                          style={{ backgroundColor: "#fff", color: "#FFC468" }}
                        >
                          {"New in Bookings"}
                        </span>
                      }
                      extra={
                        <Link to="/bookings">
                          See more <Icon icon="arrow-right" size="13" />
                        </Link>
                      }
                      bordered={false}
                      className={"home-product-list new-in-booking"}
                    >
                      {newBooking && this.renderCard(newBooking)}
                    </Card>
                  </div>
                  {/* <div className='home-spacer' style={{ height: 38 }}>&nbsp;</div> */}
                  {/* <div className='ad-banner-bottom'>
                  <CarouselSlider bannerItem={bottomImages} pathName='/' className='ad-banner' />
                </div> */}
                  <div className="product-list-wrap pt-0">
                    <Card
                      title={
                        <span
                          style={{ backgroundColor: "#fff", color: "#7EC5F7" }}
                        >
                          New in Classifieds
                        </span>
                      }
                      extra={
                        hide !== 0 && (
                          <Link to="/classifieds">
                            See more <Icon icon="arrow-right" size="13" />
                          </Link>
                        )
                      }
                      bordered={false}
                      className={"home-product-list new-in-classifieds"}
                    >
                      {this.renderClassifiedCard(newClassified)}
                    </Card>
                  </div>
                </Content>
              )}
              {isOpenResetModel && (
                <ResetPasswordModal
                  visible={isOpenResetModel}
                  token={token}
                  onCancel={() => {
                    this.props.history.push("/");
                  }}
                  openLoginAction={() => {
                    this.setState({ isOpenResetModel: false });
                    this.props.openLoginModel();
                  }}
                />
              )}
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { categoryData, savedCategories } = common;
  let retailList = [], classifiedList = []
  console.log('savedCategories',savedCategories)
  let isEmpty = savedCategories && savedCategories.data.retail.length === 0
  if (auth.isLoggedIn) {
    if (!isEmpty) {
      const savedList = savedCategories.data && savedCategories.data
      retailList = savedList.retail
      classifiedList = savedList.classified && savedList.classified.filter(el => el.pid === 0);
    } else {
      classifiedList =
        categoryData && Array.isArray(categoryData.classified)
          ? categoryData.classified
          : [];
      retailList =
        categoryData && Array.isArray(categoryData.retail.data)
          ? categoryData.retail.data
          : [];
    }
  } else {
    retailList =
      categoryData && Array.isArray(categoryData.retail.data)
        ? categoryData.retail.data
        : [];
    classifiedList =
      categoryData && Array.isArray(categoryData.classified)
        ? categoryData.classified
        : [];
  }
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
    retailList,
    classifiedList,
  };
};
export default connect(mapStateToProps, {
  setCurrentLocation,
  enableLoading,
  disableLoading,
  getBannerById,
  getRetailList,
  getMostViewdData,
  newInClassified,
  newInBookings,
  setLatLong,
  closeLoginModel,
  openLoginModel,
})(WelcomePage);
