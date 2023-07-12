import React from "react";
import { withRouter, Link } from "react-router-dom";
import Map from "../../../../common/Map";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../../config/localization";
import { SocialShare } from "../../../../common/social-share";
import {
  Layout,
  Row,
  Col,
  Typography,
  Collapse,
  Modal,
  Button,
  Input,
  Select,
  Rate,
  Tabs,
  InputNumber,
  DatePicker,
  Divider,
  Alert,
} from "antd";
import "@ant-design/icons";
import TopBackWithTitle from "../../common/TopBackWithTitle";
import HotelReview from "../hotel-review/HotelReview";
import {
  checkFavorite,
  markFavUnFavHotels,
  getHotelTotalViews,
  getHotelAverageRating,
  getHotelDescriptiveInfo,
  addHotelViews,
  enableLoading,
  disableLoading,
  openLoginModel,
} from "../../../../../actions";
import { DEFAULT_IMAGE_CARD } from "../../../../../config/Config";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/multi-city-flight.less";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
const { TextArea } = Input;
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { TabPane } = Tabs;
const dateFormat = "YYYY/MM/DD";

function callback(key) {
  console.log(key);
}
class HotelDetails extends React.Component {
  // Start: Room Reservation Modal
  scrollRef = React.createRef();
  state = {
    loading: false,
    visible: false,
    isFav: 0,
    hotelData: null,
    seeAllAmenities: false,
    activeTab: "rooms",
    sliderActive: null,
    hData:
      this.props.location.state && this.props.location.state.passedHotelData,
    showShare: false,
  };

  componentWillMount() {
    this.getAllDetailInfo();
  }

  showRoomReservationModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  /**
   * @method getAllDetailInfo
   * @description get all hotel detail api data
   */
  getAllDetailInfo = async () => {
    let { selectedHotel, loggedInDetail, location } = this.props;
    if (!selectedHotel) {
      if (location.state.passedHotelData) {
        selectedHotel = location.state.passedHotelData;
      }
    }
    if (!selectedHotel) {
      return;
    }
    let code =
      selectedHotel.basicPropertyInfo &&
      selectedHotel.basicPropertyInfo.hotelCode;
    let p1 = 0,
      p2,
      p3,
      p4;
    if (this.props.isLoggedIn) {
      p1 = await new Promise((resolve) => {
        this.props.checkFavorite(
          { hotel_id: code, user_id: loggedInDetail.id },
          (res) => {
            if (res.status === 200) {
              resolve({ isFav: res.data.data });
            }
          }
        );
      });
    }

    this.props.enableLoading();
    p2 = await new Promise((resolve) => {
      let formData = new FormData();
      formData.append("hotelCode", code);
      this.props.getHotelDescriptiveInfo({ hotelCode: code }, (res) => {
        this.props.disableLoading();
        if (res !== undefined && res.status === 200) {
          let hotelData = res.data.data.length && res.data.data[0];
          this.setState({
            hotelData,
          });
        }
      });

      this.props.getHotelAverageRating(formData, (res) => {
        this.props.disableLoading();
        if (res !== undefined && res.status === 200) {
          resolve({
            rating: res.data.data.length ? res.data.data[0].average_rating : 0,
          });
        }
      });
    });

    let info =
      selectedHotel.descriptiveInfo &&
      Array.isArray(selectedHotel.descriptiveInfo) &&
      selectedHotel.descriptiveInfo.length
        ? selectedHotel.descriptiveInfo[0]
        : "";
    let image =
      info && Array.isArray(info.hotelImages) && info.hotelImages.length
        ? info.hotelImages[0]
        : "";
    let reqData = {
      hotel_id: code,
      hotel_basic: {
        HotelName: info ? info.hotelName : "",
        HotelName: info ? info.hotelName : "",
        HotelImage: image,
      },
      hotel_details: selectedHotel,
      city: info ? info.cityName : "",
    };

    let formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == "object") {
        formData.append(key, JSON.stringify(reqData[key]));
      } else {
        formData.append(key, reqData[key]);
      }
    });
    p3 = await new Promise((resolve) => {
      this.props.addHotelViews(formData, (res) => {
        if (res !== undefined && res.status === 200) {
          resolve();
        }
      });
    });
    this.setState({ isFav: p1 && p1.isFav, rating: p2.rating });
  };

  /**
   * @method handleLikeUnlike
   * @description handle like unlike
   */
  handleLikeUnlike = (fav) => {
    const { selectedHotel, loggedInDetail, isLoggedIn } = this.props;
    let code =
      selectedHotel.basicPropertyInfo &&
      selectedHotel.basicPropertyInfo.hotelCode;
    let info =
      selectedHotel.descriptiveInfo &&
      Array.isArray(selectedHotel.descriptiveInfo) &&
      selectedHotel.descriptiveInfo.length
        ? selectedHotel.descriptiveInfo[0]
        : "";
    let image =
      info && Array.isArray(info.hotelImages) && info.hotelImages.length
        ? info.hotelImages[0]
        : "";
    let reqData = {
      userId: isLoggedIn ? loggedInDetail.id : "",
      hotel_id: code,
      HotelBasicJson: {
        HotelName: info ? info.hotelName : "",
        HotelName: info ? info.hotelName : "",
        HotelImage: image,
      },
      HotelDetailsJson: selectedHotel,
      isFavorite: fav,
    };

    let formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == "object") {
        formData.append(key, JSON.stringify(reqData[key]));
      } else {
        formData.append(key, reqData[key]);
      }
    });
    this.props.markFavUnFavHotels(formData, (res) => {
      if (res.status === 200) {
        toastr.success(
          langs.success,
          fav === 0
            ? "Hotel has been sucessfully marked as un favorite"
            : "Hotel has been sucessfully marked as favorite"
        );
        this.setState({ isFav: fav });
      }
    });
  };

  renderAmenities = (amenities, len) => {
    let html = [];
    for (
      let i = 0;
      i < (amenities.length > len ? len : amenities.length);
      i++
    ) {
      html.push(
        <Col lg={7} sm={7} md={7}>
          <div className="amenities-list">
            <div className="img-div">
              <span className="bullet"></span>
            </div>
            <p>{amenities[i] && amenities[i].name}</p>
          </div>

          {/* {amenities[i+1] ? <div className="amenities-list">
            <div className="img-div">
              <img
                src={require("../../../../../assets/images/icons/restaurant-1.svg")}
                alt="restaurant"
              />
            </div>
            <p>{amenities[i+1].name}</p>
          </div> : null} */}
        </Col>
      );
    }
    return html;
  };

  changeTab = (activeKey) => {
    this.setState({
      activeTab: activeKey,
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      visible,
      rating,
      hotelData,
      seeAllAmenities,
      activeTab,
      sliderActive,
      hData,
      showShare,
    } = this.state;
    const {
      selectedHotel,
      history: {
        location: { state },
      },
      image,
    } = this.props;
    let nearbydist = [];
    return (
      <Layout className="common-sub-category-landing  booking-tourism-checkout-box">
        <Layout className="yellow-theme common-left-right-padd booking-tourism-hotel-details">
          <TopBackWithTitle {...this.props} title={"Hotel"} />
          <Layout className="right-parent-block inner-content-wrap pb-0">
            <Content className="site-layout tourism-car-detail-box">
              <div className="hotel-information-card">
                <Row gutter={35}>
                  <Col md={8}>
                    <Row>
                      <Col md={24}>
                        <div className="slider-big-image">
                          <img
                            // src={require("../../../../../assets/images/poolside-1.svg")}
                            src={
                              // sliderActive ||
                              hotelData && hotelData.hotelImages.length
                                ? hotelData.hotelImages[0]
                                : state.image
                                ? state.image
                                : DEFAULT_IMAGE_CARD
                            }
                            alt=""
                            className="poolside-img"
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={24} lg={240} md={20}>
                        <OwlCarousel
                          className="owl-theme"
                          loop
                          margin={10}
                          items={5}
                          nav
                        >
                          {hotelData && hotelData.hotelImages.length
                            ? hotelData.hotelImages.map((image) => {
                                return (
                                  <div className="item">
                                    <img
                                      width="50"
                                      src={image}
                                      alt="poolside-1"
                                      onClick={() => {
                                        this.setState({
                                          sliderActive: image,
                                        });
                                      }}
                                    />
                                  </div>
                                );
                              })
                            : null}
                        </OwlCarousel>
                        {/* {hotelData && hotelData.hotelImages.length && hotelData.hotelImages.map((image) => {
                            return <img
                              src={image}
                              alt="poolside-1"
                              onClick={() => {
                                this.setState({
                                  sliderActive: image
                                })
                              }}
                            />
                            })
                          } */}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={16}>
                    <Row>
                      <Col md={18}>
                        <Row>
                          <Col>
                            <Title className="hotel-name">
                              {hotelData && hotelData.hotelName}
                            </Title>
                            <p className="hotel-rating">
                              <span>
                                {hotelData && hotelData.awards.length
                                  ? `${hotelData.awards[0].rating}.0`
                                  : ""}
                              </span>
                              <Rate
                                value={
                                  hotelData && hotelData.awards.length
                                    ? hotelData.awards[0].rating
                                    : 0
                                }
                              />
                              <span className="total-reviews">27 reviews</span>
                            </p>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={6} className="title-image-container">
                        {Number(this.state.isFav) === 1 ? (
                          <img
                            src={require("../../../../../assets/images/icons/heart-grey.svg")}
                            alt="heart"
                            onClick={() => {
                              this.handleLikeUnlike(
                                Number(this.state.isFav) === 1 ? 0 : 1
                              );
                            }}
                          />
                        ) : (
                          <img
                            src={require("../../../../../assets/images/icons/heart-orange.svg")}
                            alt="heart"
                            onClick={() => {
                              this.handleLikeUnlike(
                                Number(this.state.isFav) === 1 ? 0 : 1
                              );
                            }}
                          />
                        )}
                        <a href="tel:hotelnuber">
                          <img
                            src={require("../../../../../assets/images/icons/call-orange.svg")}
                            alt="call-orange"
                          />
                        </a>
                        <img
                          src={require("../../../../../assets/images/icons/share-orange.svg")}
                          alt="share-orange"
                          onClick={() =>
                            this.setState({ showShare: !showShare })
                          }
                        />
                        {showShare && <SocialShare {...this.props} />}
                      </Col>
                    </Row>

                    <Row>
                      <Col md={18}>
                        <p className="amenities-title">Popular amenities </p>
                        <div className="amenities">
                          <Row gutter={2}>
                            {hotelData && hotelData.hotelAmenities.length > 0
                              ? this.renderAmenities(
                                  hotelData.hotelAmenities,
                                  9
                                )
                              : null}
                            {/* {seeAllAmenities && hotelData && hotelData.allRoomsAmenities.length && this.renderAmenities(hotelData.allRoomsAmenities)} */}
                          </Row>
                          {/* <div>
                            <div className="amenities-list">
                              <div className="img-div">
                                <img
                                  src={require("../../../../../assets/images/icons/wifi-black.svg")}
                                  alt="wifi"
                                />
                              </div>
                              <p>Free Wifi</p>
                            </div>

                            <div className="amenities-list">
                              <div className="img-div">
                                <img
                                  src={require("../../../../../assets/images/icons/restaurant-1.svg")}
                                  alt="restaurant"
                                />
                              </div>
                              <p>Restaurant</p>
                            </div>
                          </div> */}

                          {/* <div>
                            <div className="amenities-list">
                              <div className="img-div">
                                <img
                                  src={require("../../../../../assets/images/icons/winter_is_coming.svg")}
                                  alt="winter_is_coming"
                                />
                              </div>
                              <p>Air conditioning</p>
                            </div>

                            <div className="amenities-list">
                              <div className="img-div">
                                <img
                                  src={require("../../../../../assets/images/icons/gym.svg")}
                                  alt="gym"
                                />
                              </div>
                              <p>Gym</p>
                            </div>
                          </div>

                          <div>
                            <div className="amenities-list">
                              <div className="img-div">
                                <img
                                  src={require("../../../../../assets/images/icons/laundry.svg")}
                                  alt="laundry"
                                />
                              </div>
                              <p>Laundry</p>
                            </div>
                            <div className="amenities-list">
                              <div className="img-div">
                                <img
                                  src={require("../../../../../assets/images/icons/coffee-black.svg")}
                                  alt="coffee-black"
                                />
                              </div>
                              <p>Breakfast Available</p>
                            </div>
                          </div> */}
                        </div>
                        <p>
                          {/* <Link className="see-all-link" to="#" onClick={() => this.setState({seeAllAmenities: !seeAllAmenities})}>
                            {!seeAllAmenities ? 'See all' : 'See less'}
                          </Link> */}
                          <Link
                            className="see-all-link"
                            to="#"
                            onClick={(e) => {
                              this.setState(
                                {
                                  activeTab: "amenities",
                                },
                                () => {
                                  // this.scrollRef.current.scrollIntoView()
                                  window.scrollTo(
                                    0,
                                    this.scrollRef.current.offsetTop
                                  );
                                }
                              );
                            }}
                          >
                            See all
                          </Link>
                        </p>
                      </Col>

                      <Col md={6} className="reserve-btn-col">
                        <Button
                          className="reserve-btn"
                          onClick={(e) => {
                            this.setState(
                              {
                                activeTab: "rooms",
                              },
                              () => {
                                this.scrollRef.current.scrollIntoView();
                                // window.scrollTo(0, this.scrollRef.current.offsetTop);
                              }
                            );
                          }}
                        >
                          {/* <Link  to="hotelTabs" spy={true} smooth={true}> */}
                          Reserve
                          {/* </Link> */}
                        </Button>
                      </Col>
                    </Row>
                    <div className="other-information">
                      <div className="other-information-heading">
                        <p>Check-in time:</p>
                        <p>Check-out time:</p>
                        <p>Rating:</p>
                        <p>Address:</p>
                      </div>

                      <div className="other-information-text">
                        <p>
                          From{" "}
                          {state && state.reqData
                            ? state.reqData.startDate
                            : null}
                        </p>
                        <p>
                          Until{" "}
                          {state && state.reqData
                            ? state.reqData.endDate
                            : null}
                        </p>
                        <p>
                          {hotelData &&
                            hotelData.awards.length &&
                            hotelData.awards[0].rating}{" "}
                          Stars
                        </p>
                        <p>
                          {state &&
                            state.basic_info &&
                            state.basic_info.address &&
                            `${state.basic_info.address.addressLine[0]}, ${state.basic_info.address.cityName}, ${state.basic_info.address.country.name}, ${state.basic_info.address.postalCode}`}
                        </p>
                      </div>
                    </div>
                    {/* <img
                      src={require("../../../../../assets/images/map-small.svg")}
                      alt="map-small"
                    /> */}
                    {hotelData && (
                      <div className="map-box">
                        <Map
                          list={[
                            {
                              lat: hotelData.latitude,
                              lng: hotelData.longitude,
                            },
                          ]}
                        />
                      </div>
                    )}
                    <div className="whats-nearby-collapse">
                      <Collapse defaultActiveKey={["1"]} onChange={callback}>
                        <Panel
                          header={
                            <p>
                              <img
                                src={require("../../../../../assets/images/icons/location-pin.svg")}
                                alt="location-pin"
                              />
                              What's nearby?
                            </p>
                          }
                          key="1"
                        >
                          <div className="whats-nearby-list">
                            <div>
                              {hotelData &&
                              hotelData.attractions &&
                              hotelData.attractions.length
                                ? hotelData.attractions.map((nearby, i) => {
                                    if (i <= 6) {
                                      nearbydist.push(<p>{nearby.distance}</p>);
                                      return <p>{nearby.name}</p>;
                                    } else {
                                      return null;
                                    }
                                  })
                                : null}
                              {hotelData &&
                              hotelData.attractions &&
                              hotelData.attractions.length ? (
                                <Link
                                  to="#"
                                  onClick={(e) => {
                                    this.setState(
                                      {
                                        activeTab: "location",
                                      },
                                      () => {
                                        this.scrollRef.current.scrollIntoView();
                                        // window.scrollTo(0, this.scrollRef.current.offsetTop);
                                      }
                                    );
                                  }}
                                >
                                  View more
                                </Link>
                              ) : null}
                            </div>
                            <div>{nearbydist}</div>
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  </Col>
                </Row>
              </div>

              <div id="hotelTabs" ref={this.scrollRef} className="hotel-tabs">
                <Tabs activeKey={activeTab} onChange={this.changeTab}>
                  <TabPane tab="Rooms" key="rooms" className="hotel-rooms-tab">
                    <Title className="choose-room-title">
                      Choose your room
                    </Title>
                    {/* <Row gutter={20} className="mb-25">
                      <Col lg={10}>
                        <div className="date-col">
                          <DatePicker
                            format={dateFormat}
                            className="date-formate1"
                          />
                          <DatePicker
                            format={dateFormat}
                            className="date-formate2"
                          />
                        </div>
                      </Col>
                      <Col lg={10}>
                        <div className="person-col">
                          <Input
                            size="large"
                            className="adult-box"
                            placeholder="adult"
                          />
                          <Input
                            size="large"
                            className="child-box"
                            placeholder="children"
                          />
                          <Select
                            defaultValue="1 room"
                            allowClear
                            className="room-box"
                          >
                            <Option value="1room">1 room</Option>
                            <Option value="1rooms">2 rooms</Option>
                          </Select>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <Button className="check-avail">
                          Check Availability
                        </Button>
                      </Col>
                    </Row>*/}
                    {hData && hData.rooms
                      ? hData.rooms.map((room) => {
                          return (
                            <div className="room-information-container">
                              <Row>
                                <Col md={8} className="room-information-left">
                                  <Row>
                                    <Col md={12} className="pr-15">
                                      <div className="img-div">
                                        <img
                                          src={require("../../../../../assets/images/hotel_room.svg")}
                                          alt="hotel-room"
                                        />
                                      </div>
                                    </Col>
                                    <Col md={12}>
                                      <Title level={3} className="room-title">
                                        {room &&
                                          room.roomType &&
                                          room.roomType.roomTypeCode &&
                                          room.roomType.roomTypeCode
                                            .roomTypeCategory}
                                      </Title>
                                      {/* <div className="img-span-block">
                                <span className="img-span">
                                  <img
                                    src={require("../../../../../assets/images/icons/profile_round.svg")}
                                    alt="profile-round"
                                  />
                                  <img
                                    src={require("../../../../../assets/images/icons/profile_round.svg")}
                                    alt="profile-round"
                                  />
                                </span>
                                Sleeps {state && state.reqData && state.reqData.rooms.length ?  (state.reqData.rooms[0].totalAdults + state.reqData.rooms[0].totalChildren) : 1}
                              </div> */}

                                      <p>
                                        {/* <Link to="#">More details</Link> */}
                                      </p>
                                    </Col>
                                  </Row>
                                </Col>

                                <Col
                                  md={13}
                                  offset={3}
                                  className="room-information-right"
                                >
                                  <Row>
                                    <Col md={14}>
                                      {/* <p>
                                        <strong>Option 1</strong>
                                      </p>
                                      <p className="highlight">
                                        Free Cancellation
                                      </p>
                                      <p className="small-text">
                                        Before Fri, 19 Feb
                                      </p> */}
                                    </Col>
                                    <Col md={10} className="right-section1">
                                      <Title level={3} className="price">
                                        AU${" "}
                                        {room &&
                                          room.roomRate &&
                                          room.roomRate.total &&
                                          room.roomRate.total.amountAfterTax}
                                      </Title>
                                      {/* <p className="small-text">Per night</p>
                                      <p className="highlight2">
                                        We have 5 left
                                      </p> */}
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col md={18} className="second-row">
                                      {hotelData &&
                                      hotelData.allRoomsAmenities.length
                                        ? hotelData.allRoomsAmenities.map(
                                            (amenities, i) => {
                                              if (i <= 2) {
                                                return (
                                                  <div className="facility-list">
                                                    <div className="img-div mr-15">
                                                      <img
                                                        src={require("../../../../../assets/images/icons/check-grey.svg")}
                                                        alt=""
                                                      />
                                                    </div>
                                                    <p>{amenities.name}</p>
                                                  </div>
                                                );
                                              } else {
                                                return null;
                                              }
                                            }
                                          )
                                        : null}
                                    </Col>

                                    <Col md={6}>
                                      <div className="right-section2">
                                        {/* <Button
                                  className="reserve-btn"
                                  onClick={this.showRoomReservationModal}
                                >
                                  Reserve
                                </Button> */}
                                        <Button
                                          className="reserve-btn"
                                          onClick={() => {
                                            if (this.props.isLoggedIn) {
                                              this.props.history.push({
                                                pathname:
                                                  "/booking-tourism-hotel-booking-form",
                                                state: {
                                                  room,
                                                  reqData:
                                                    state && state.reqData,
                                                  hotelData,
                                                  basic_info:
                                                    state && state.basic_info,
                                                  fullHotelData: hData,
                                                },
                                              });
                                            } else {
                                              this.props.openLoginModel();
                                            }
                                          }}
                                        >
                                          {/* <Link  to="hotelTabs" spy={true} smooth={true}> */}
                                          Reserve
                                          {/* </Link> */}
                                        </Button>
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>
                          );
                        })
                      : null}
                  </TabPane>
                  <TabPane tab="Overview" key="overview">
                    <div className="information-container">
                      <Row>
                        <Col md={4} className="information-left">
                          <Title className="left-title">Overview</Title>
                          <Title className="rating">4.0</Title>
                          <p className="rating-text">Excellent</p>
                          <Rate className="rate" />
                          <p className="small-text">From 7309 reviews</p>
                        </Col>
                        <Col md={15} offset={2} className="pl-15 hotel-data">
                          <div className="right-img">
                            <img
                              // src={require("../../../../../assets/images/poolside.svg")}
                              src={
                                hotelData && hotelData.hotelImages.length
                                  ? hotelData.hotelImages[0]
                                  : state.image
                              }
                              alt="poolside"
                            />
                          </div>
                          <div className="content-right">
                            <p>
                              <strong>
                                {hotelData && hotelData.hotelName}
                              </strong>
                            </p>

                            <Paragraph className="msg-hotel-overview">
                              {hotelData &&
                                hotelData.hotelDescription.length &&
                                hotelData.hotelDescription[0]}
                            </Paragraph>
                          </div>

                          {/* <Paragraph className="msg-hotel-overview">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sit quam eu malesuada ac velit. Sit cursus
                            adipiscing in interdum tortor facilisi facilisis
                            bibendum semper. Venenatis fermentum est dignissim
                            libero. Elit mattis non, quam in ut mi quis. dolor
                            sit amet, consectetur adipiscing elit. Sit quam eu
                            malesuada ac velit. Sit cursus adipiscing in
                            interdum tortor facilisi facilisis bibendum semper.
                          </Paragraph> */}
                        </Col>
                      </Row>
                    </div>
                  </TabPane>
                  <TabPane tab="Location" key="location">
                    <div className="information-container">
                      <Row>
                        <Col md={4} className="information-left">
                          <Title className="left-title">Location</Title>
                        </Col>

                        <Col md={15} offset={3}>
                          {/* <Row>
                            <Col> */}
                          {hotelData && (
                            <div className="map-box">
                              <Map
                                list={[
                                  {
                                    lat: hotelData.latitude,
                                    lng: hotelData.longitude,
                                  },
                                ]}
                              />
                            </div>
                          )}
                          {/* </Col>
                          </Row> */}

                          <Row gutter={48}>
                            <Col md={12}>
                              <div className="list-section">
                                <div className="img-div">
                                  <img
                                    src={require("../../../../../assets/images/icons/location-pin.svg")}
                                    alt="location-pin"
                                  />
                                </div>
                                <div>
                                  <p className="list-heading">What's nearby?</p>
                                  {hotelData &&
                                  hotelData.attractions &&
                                  hotelData.attractions.length
                                    ? hotelData.attractions.map((nearby) => {
                                        return (
                                          <p>
                                            {nearby.name} - {nearby.distance}
                                          </p>
                                        );
                                      })
                                    : null}
                                </div>
                              </div>
                            </Col>
                            {/* <Col md={12}>
                              <div className="list-section">
                                <div className="img-div">
                                  <img
                                    src={require("../../../../../assets/images/icons/taxi.svg")}
                                    alt="taxi"
                                  />
                                </div>
                                <div>
                                  <p className="list-heading">Getting around</p>
                                  <p>Melbourne Central Station - 4 min walk</p>
                                  <p>Spencer Street Station - 14 min walk</p>
                                  <p>
                                    Melbourne, VIC (MEL-Tullamarine) - 27 min
                                    drive
                                  </p>
                                </div>
                              </div>
                            </Col> */}
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </TabPane>
                  <TabPane tab="Amenities" key="amenities">
                    <div className="information-container room-amenities">
                      <Row>
                        <Col md={4} className="information-left">
                          <Title className="left-title">Room amenities</Title>
                        </Col>
                        <Col md={15} offset={3}>
                          <Row gutter={48}>
                            {hotelData && hotelData.allRoomsAmenities.length ? (
                              hotelData.allRoomsAmenities.map((amenities) => (
                                <Col md={12}>
                                  <div className="list-section">
                                    <div className="img-div">
                                      <span className="bullet"></span>
                                    </div>
                                    <div className="list-row">
                                      <p className="list-heading">
                                        {amenities.name}
                                      </p>
                                      <p>Available in all rooms: Free WiFi</p>
                                      {/* <p>
                                    Available in some public areas: Free WiFi
                                  </p> */}
                                    </div>
                                  </div>
                                </Col>
                              ))
                            ) : (
                              <div>No Room Amenities Found</div>
                            )}
                            {/* <Col md={12}>
                              <div className="list-section">
                                <div className="img-div">
                                  <img
                                    src={require("../../../../../assets/images/icons/p-circle-grey.svg")}
                                    alt="p-circle-grey"
                                  />
                                </div>

                                <div>
                                  <p className="list-heading">
                                    Parking and public transport
                                  </p>
                                  <p>Valet parking on site (AUD 50 per day)</p>
                                  <p>
                                    On-site parking is wheelchair accessible
                                  </p>
                                  <p>Return airport shuttle (surcharge)</p>
                                </div>
                              </div>

                              <div className="list-section">
                                <div className="img-div">
                                  <img
                                    src={require("../../../../../assets/images/icons/suitcase.svg")}
                                    alt="suitcase"
                                  />
                                </div>

                                <div>
                                  <p className="list-heading pt-20">
                                    Business services
                                  </p>
                                  <p>Valet parking on site (AUD 50 per day)</p>
                                  <p>
                                    On-site parking is wheelchair accessible
                                  </p>
                                  <p>Return airport shuttle (surcharge)</p>
                                </div>
                              </div>
                            </Col> */}
                          </Row>
                        </Col>
                      </Row>
                    </div>

                    <div className="information-container">
                      <Row>
                        <Col md={4} className="information-left">
                          <Title className="left-title">
                            Property amenities
                          </Title>
                        </Col>
                        <Col md={15} offset={3}>
                          <Row gutter={48}>
                            {hotelData && hotelData.hotelAmenities.length ? (
                              hotelData.hotelAmenities.map((amenities) => (
                                <Col md={12}>
                                  <div className="list-section">
                                    <div className="img-div">
                                      <span className="bullet"></span>
                                    </div>
                                    <div>
                                      <p className="list-heading">
                                        {amenities.name}
                                      </p>
                                      <p>Available in all rooms: Free WiFi</p>
                                      {/* <p>
                                    Available in some public areas: Free WiFi
                                  </p> */}
                                    </div>
                                  </div>
                                </Col>
                              ))
                            ) : (
                              <div>No Property Amenities Found</div>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </TabPane>

                  <TabPane tab="Policies" key="policies">
                    <div className="information-container">
                      <Row>
                        <Col md={4} className="information-left">
                          <Title className="left-title">Policies</Title>
                        </Col>
                        <Col md={18}>
                          <Col md={15} offset={3} className="mb-20">
                            <strong>Property policies</strong>
                          </Col>
                          {hotelData &&
                          hotelData.policies &&
                          hotelData.policies.length ? (
                            hotelData.policies.map((policy) => {
                              return (
                                <Col md={15} offset={3}>
                                  <span className="mb-10 d-ib">
                                    {policy.name}
                                  </span>
                                  {/* <Paragraph className="property-msg">
                              
                              </Paragraph> */}
                                  {policy.descriptions &&
                                  policy.descriptions.length
                                    ? policy.descriptions.map((descr) => {
                                        return <p>{descr}</p>;
                                      })
                                    : null}
                                  {/* <Paragraph className="property-msg">
                              </Paragraph> */}
                                </Col>
                              );
                            })
                          ) : (
                            <div>No Policies Found</div>
                          )}
                          {/* <Col md={15} offset={3}>
                          <p>
                            <strong>Property policies</strong>
                          </p>
                          <Paragraph className="property-msg">
                          
                          </Paragraph>
                          <p>PAYMENT SECURITY:</p>
                          <Paragraph className="property-msg">
                          </Paragraph>
                        </Col> */}
                        </Col>
                      </Row>
                    </div>
                  </TabPane>

                  <TabPane tab="Reviews" key="reviews">
                    <div className="alert-box">
                      <Alert
                        message="Reviews Information"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sit quam eu malesuada ac velit. Sit cursus
                            adipiscing in interdum tortor facilisi facilisis
                            bibendum semper."
                        type="info"
                        showIcon
                      />
                    </div>
                    <HotelReview
                      selectedHotel={selectedHotel}
                      getDetails={this.getAllDetailInfo}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </Content>
          </Layout>
          {/* START - Baggage and Policy Information box - 03/07/2021 */}
        </Layout>
        {/* START - Room Reservation Modal - 14-07-2021 */}
        <Modal
          visible={visible}
          title="Guests"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          className="custom-modal style1 room-reservation-modal"
        >
          <div className="modal-information-container">
            <div className="room-details">
              <p>
                <strong>Room 1</strong>
              </p>

              <div className="d-flex">
                <p>Adults</p>
                <div className="right-content">
                  <Button shape="circle">
                    <img
                      src={require("../../../../../assets/images/icons/minus-circle.svg")}
                      alt="minus"
                    />
                  </Button>
                  <span>2</span>
                  <Button shape="circle">
                    <img
                      src={require("../../../../../assets/images/icons/plus-circle-grey.svg")}
                      alt="plus"
                    />
                  </Button>
                </div>
              </div>

              <div className="d-flex">
                <p>Children (Age 2-11)</p>
                <div className="right-content">
                  <Button shape="circle">
                    <img
                      src={require("../../../../../assets/images/icons/minus-circle.svg")}
                      alt="minus"
                    />
                  </Button>
                  <span>0</span>
                  <Button shape="circle">
                    <img
                      src={require("../../../../../assets/images/icons/plus-circle-grey.svg")}
                      alt="plus"
                    />
                  </Button>
                </div>
              </div>
            </div>

            <div className="room-details">
              <p>
                <strong>Room 2</strong>
              </p>

              <div className="d-flex">
                <p>Adults</p>
                <div className="right-content">
                  <Button shape="circle">
                    <img
                      src={require("../../../../../assets/images/icons/minus-circle.svg")}
                      alt="minus"
                    />
                  </Button>
                  <span>2</span>
                  <Button shape="circle">
                    <img
                      src={require("../../../../../assets/images/icons/plus-circle-grey.svg")}
                      alt="plus"
                    />
                  </Button>
                </div>
              </div>

              <div className="d-flex">
                <p>Children (Age 2-11)</p>
                <div className="right-content">
                  <Button shape="circle">
                    <img
                      src={require("../../../../../assets/images/icons/minus-circle.svg")}
                      alt="minus"
                    />
                  </Button>
                  <span>0</span>
                  <Button shape="circle">
                    <img
                      src={require("../../../../../assets/images/icons/plus-circle-grey.svg")}
                      alt="plus"
                    />
                  </Button>
                </div>
              </div>

              <p className="remove-link">
                <Link to="#">Remove</Link>
              </p>
            </div>

            <p className="add-room-link">
              <Link to="#">Add another room</Link>
            </p>
            <div className="modal-footer">
              <p className="total-selection">1 room, 2 guests</p>
              <Button className="checkout-btn">Checkout</Button>
            </div>
          </div>
        </Modal>
        {/* END - Room Reservation Modal - 14-07-2021 */}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { selectedHotel } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedHotel: selectedHotel,
  };
};

export default connect(mapStateToProps, {
  addHotelViews,
  enableLoading,
  disableLoading,
  getHotelTotalViews,
  getHotelAverageRating,
  getHotelDescriptiveInfo,
  markFavUnFavHotels,
  checkFavorite,
  openLoginModel,
})(withRouter(HotelDetails));
