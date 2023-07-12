import React from "react";
import {withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import { langs } from "../../../../../config/localization";
import { SocialShare } from "../../../../common/social-share";
import Map from "../../../../common/Map";
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
  Dropdown,
} from "antd";
import "@ant-design/icons";
import TopBackWithTitle from "../../common/TopBackWithTitle";
import HotelDetailTabView from './HotelDetailTabView'
import Carousel from "../../../../common/caraousal";
import {getHotelDescriptiveInfo,checkFavorite,markFavUnFavHotels,getHotelTotalViews,getHotelAverageRating, addHotelViews, enableLoading, disableLoading } from '../../../../../actions'
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/multi-city-flight.less";
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
  myDivToFocus = React.createRef();
  state = {
    loading: false,
    visible: false,
    isFav:0,
    hotelDetails: '',
    priorityTab: 0,
  };

  componentWillMount(){
    this.props.enableLoading()
    this.getAllDetailInfo()
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
    const { selectedHotel,loggedInDetail } = this.props;
    console.log('selectedCar: ', selectedHotel);
    if (!selectedHotel) {
      return
    }
    let code = selectedHotel.basicPropertyInfo && selectedHotel.basicPropertyInfo.hotelCode
    let p1 = 0, p2, p3, p4;
    if (this.props.isLoggedIn) {
      p1 = await new Promise(resolve => {
      this.props.checkFavorite({ hotel_id: code, user_id: loggedInDetail.id }, (res) => {
        if (res.status === 200) {
            resolve({ isFav: res.data.data })
          }
        })
      })
    }
            
    p2 = await new Promise(resolve => {
      let formData = new FormData();
      formData.append('hotelCode',code );
      this.props.getHotelAverageRating(formData, (res) => {
        if (res !== undefined && res.status === 200) {
          resolve({ rating:res.data.data.length ? res.data.data[0].average_rating : 0 })
        }
      })
    })

    let info = selectedHotel.descriptiveInfo && Array.isArray(selectedHotel.descriptiveInfo) && selectedHotel.descriptiveInfo.length ? selectedHotel.descriptiveInfo[0] : ''
    let image = info && Array.isArray(info.hotelImages) && info.hotelImages.length ? info.hotelImages[0] : ''
    let reqData = {
      hotel_id: code,
      hotel_basic: {
        HotelName: info ? info.hotelName : '',
        HotelName: info ? info.hotelName : '',
        HotelImage: image,
      },
      hotel_details: selectedHotel,
      city: info ? info.cityName : ''
    }

    let formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == "object") {
        formData.append(key, JSON.stringify(reqData[key]));
      } else {
        formData.append(key, reqData[key]);
      }
    });
    p3 = await new Promise(resolve => {
      this.props.addHotelViews(formData, (res) => {
        if (res !== undefined && res.status === 200) {
          resolve()
        }
      })
    })
    p4 = await new Promise(resolve => {
      this.props.getHotelDescriptiveInfo({hotelCode: code}, (res) => {
        this.props.disableLoading()
        if (res.status === 200) {
          let data = res.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data[0] : ''
          resolve({hotelDetails: data})
        }
      })
    })
    
    this.setState({ isFav: p1 && p1.isFav, rating: p2.rating, hotelDetails: p4.hotelDetails })
  }

  /**
   * @method handleLikeUnlike
   * @description handle like unlike
   */
  handleLikeUnlike = (fav) => {
    const { selectedHotel, loggedInDetail, isLoggedIn } = this.props;
    let code = selectedHotel.basicPropertyInfo && selectedHotel.basicPropertyInfo.hotelCode
    let info = selectedHotel.descriptiveInfo && Array.isArray(selectedHotel.descriptiveInfo) && selectedHotel.descriptiveInfo.length ? selectedHotel.descriptiveInfo[0] : ''
    let image = info && Array.isArray(info.hotelImages) && info.hotelImages.length ? info.hotelImages[0] : ''
    let reqData = {
      userId: isLoggedIn ? loggedInDetail.id : '',
      hotel_id: code,
      HotelBasicJson: {
        HotelName: info ? info.hotelName : '',
        HotelName: info ? info.hotelName : '',
        HotelImage: image,
      },
      HotelDetailsJson: selectedHotel,
      isFavorite: fav
    }

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
        toastr.success(langs.success, fav === 0 ? 'Hotel has been sucessfully marked as un favorite' : 'Hotel has been sucessfully marked as favorite');
        this.setState({ isFav: fav })
      }
    })
  }

  getHotelImages = () => {
    const { hotelDetails} = this.state;
    let temp = []
    if(hotelDetails && hotelDetails.hotelImages && Array.isArray(hotelDetails.hotelImages) && hotelDetails.hotelImages.length){
      hotelDetails.hotelImages.map(el => {
        console.log('')
        temp.push({full_name: el, crousal_type: 'image'})
      })
    }
    return temp
  }

  activeTab = (tabKey) => {
    this.setState({ priorityTab: tabKey });
    if (this.myDivToFocus.current) {
      window.scrollTo(0, this.myDivToFocus.current.offsetTop);
    }
    this.props.enableLoading();
    setTimeout(() => {
      this.setState({ priorityTab: 0 }, () => {
        this.props.disableLoading();
      });
    }, 500);
  };

  /**
   * @method setPriorityTab
   * @description manage tab change
   */
  setPriorityTab = () => {
    this.setState({ priorityTab: 0 });
  };

  /**
   * @method renderAnemities
   * @description render anemities
   */
  renderAnemities = (anemities) => {
    if(anemities && Array.isArray(anemities) && anemities.length){
      return anemities.slice(0,6).map((el,i) => {
        return (
          <div className="amenities-list" key={i}>
            <div className="img-div">
              <img
                src={require("../../../../../assets/images/icons/wifi-black.svg")}
                alt="wifi"
              />
            </div>
            <p>{el.name}</p>
          </div>
        )
      })
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const {priorityTab, visible, rating,hotelDetails} = this.state;
    console.log('hotelDetails', hotelDetails)
    const { selectedHotel } = this.props
    let number = hotelDetails && hotelDetails.phones && Array.isArray(hotelDetails.phones) && hotelDetails.phones.length ? hotelDetails.phones : ''
    let phoneNumber = (<div>
      {number && number.map(el => {
        return <Row>
          <span>{el.type && `${el.type.name}:  ${el.number}`}</span>
        </Row>
      })}
    </div>)
    const menu = <SocialShare {...this.props} />;
    let awards = hotelDetails && hotelDetails.awards && Array.isArray(hotelDetails.awards) && hotelDetails.awards.length ? hotelDetails.awards[0] : ''
    return (
      <Layout className="common-sub-category-landing  booking-tourism-checkout-box">
        <Layout className="yellow-theme common-left-right-padd booking-tourism-hotel-details">
          <TopBackWithTitle />
          <Layout className="right-parent-block inner-content-wrap pb-0">
            <Content className="site-layout tourism-car-detail-box">
              <div className="hotel-information-card">
                <Row>
                  <Col md={8}>
                    {hotelDetails &&<Carousel
                      className="mb-4"
                      slides={this.getHotelImages()}
                      type={'hotels'}
                    />}
                  </Col>
                  <Col md={16}>
                    <Row>
                      <Col md={18}>
                        <Row>
                          <Col>
                            <Title className="hotel-name">
                              {hotelDetails && hotelDetails.hotelName}
                            </Title>
                            <p className="hotel-rating">
                              <span>{rating ? `${rating}.0` : ''}</span>
                              <Rate value={rating ? rating : 0}/>
                              <span onClick={() => {this.activeTab('6')}}>27 reviews</span>
                            </p>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={6} className="title-image-container">
                        {Number(this.state.isFav) === 1 ? <img
                          src={require("../../../../../assets/images/icons/heart-grey.svg")}
                          alt="heart"
                          onClick={() => {
                            this.handleLikeUnlike(Number(this.state.isFav) === 1 ? 0 : 1)
                          }}
                        /> : <img
                          src={require("../../../../../assets/images/icons/heart-orange.svg")}
                          alt="heart"
                          onClick={() => {
                            this.handleLikeUnlike(Number(this.state.isFav) === 1 ? 0 : 1)
                          }}
                        />}
                        <Dropdown
                          overlay={phoneNumber}
                          trigger={["click"]}
                          overlayClassName="contact-social-detail share-ad"
                          placement="bottomCenter"
                          arrow
                        >
                          <img
                            src={require("../../../../../assets/images/icons/call-orange.svg")}
                            alt=""
                            onClick={(e) => e.preventDefault()}
                          />
                        </Dropdown>
                        <Dropdown
                          overlay={menu}
                          trigger={["click"]}
                          overlayClassName="contact-social-detail share-ad"
                          placement="bottomCenter"
                          arrow
                        >
                          <img
                            src={require("../../../../../assets/images/icons/share-orange.svg")}
                            alt=""
                            onClick={(e) => e.preventDefault()}
                          />
                        </Dropdown>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={18}>
                        <p className="amenities-title">Popular amenities </p>
                        <div className="amenities">
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
                          </div>

                          <div>
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
                          {hotelDetails && hotelDetails.hotelAmenities &&
                          this.renderAnemities(hotelDetails.hotelAmenities)}
                        </div>
                        <p>
                          <div className="see-all-link" 
                            onClick={() => {this.activeTab('4')}}
                          >
                            See all
                          </div>
                        </p>
                      </Col>

                      <Col md={6} className="reserve-btn-col">
                        <Button
                          className="reserve-btn"
                          // onClick={() => {
                          //   this.props.history.push(
                          //     "/booking-tourism-hotel-booking-form"
                          //   );
                          // }}
                          onClick={() => {this.activeTab('1')}}
                        >
                          Reserve
                        </Button>
                      </Col>
                    </Row>
                    <div className="other-information">
                      <div className="other-information-heading">
                        <p>Check-in time:</p>
                        <p>Check-out time:</p>
                        {awards && awards.rating &&
                        <p>Rating:</p>}
                        <p>Address:</p>
                      </div>

                      <div className="other-information-text">
                        <p>From 14:00</p>
                        <p>Until 11:00</p>
                        {awards && awards.rating && <p>{awards.rating} Stars</p>}
                        <p>
                          Jl. Arjuna ( Double Six Beach ) no 1, Seminyak, Bali
                        </p>
                      </div>
                    </div>
                    {/* <img
                      src={require("../../../../../assets/images/map-small.svg")}
                      alt="map-small"
                    /> */}
                    <div className="map-view">
                      {hotelDetails && (
                        <Map list={[hotelDetails]} />
                      )}
                    </div>

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
                              <p>Flinders Street Railway Station</p>
                              <p>Queen Victoria Market</p>
                              <p>Fed Square</p>
                              <p>National Gallery of Victoria</p>
                              <p>Royal Botanic Gardens</p>
                              <p>Flinders Street Railway</p>
                              <div onClick={() => {this.activeTab('3')}}>View more</div>
                            </div>
                            <div>
                              <p>10 mins walk</p>
                              <p>5 mins walk </p>
                              <p>20 mins walk</p>
                              <p>30 mins drive</p>
                              <p>40 mins drive</p>
                              <p>45 mins drive</p>
                            </div>
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="hotel-tabs" ref={this.myDivToFocus}>
                  <HotelDetailTabView
                    selectedHotel={selectedHotel}
                    getAllDetailInfo={this.getAllDetailInfo}
                    priorityTab={priorityTab}
                    setPriorityTab={this.setPriorityTab}
                  />
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
  const {selectedHotel } = tourism
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedHotel: selectedHotel,
  };
};

export default connect(mapStateToProps,{
  addHotelViews, 
  enableLoading, 
  disableLoading,
  getHotelTotalViews,
  getHotelAverageRating,
  markFavUnFavHotels,
  checkFavorite,
  getHotelDescriptiveInfo
})(withRouter(HotelDetails));