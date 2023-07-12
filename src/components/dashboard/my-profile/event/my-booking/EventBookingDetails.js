import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  Layout,
  Typography,
  Row,
  Col,
  Form,
  Carousel,
  Input,
  Select,
  Checkbox,
  Button,
  Rate,
  Modal,
  Dropdown,
  Divider,
  Descriptions,
  Anchor,
  Radio,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getBeautyServiceBooking,
  cancelBeautyServiceBooking,
  getTraderMonthWellbeingBooking,
  updateBeautyServiceBooking,
  showCustomerClass,
  getCustomerCatererEnquiryDetail,
  getCatererEnquiryDetail,
  postBookingsDetail,
  getEnquiryDetails,
  getHistoryDetails,
  getTraderDetails
} from "../../../../../actions";
import moment from "moment";
import { DEFAULT_IMAGE_CARD } from "../../../../../config/Config";
import AppSidebar from "../../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
// import "./mybooking.less";
import "../../../../booking/booking.less";
import { convertTime24To12Hour } from "../../../../../components/common";

import "react-calendar/dist/Calendar.css";
import { STATUS_CODES } from "../../../../../config/StatusCode";
import { toastr } from "react-redux-toastr";

const { Title, Text } = Typography;

class EventBookingDetails extends React.Component {
  constructor(props) {
    console.log("EventBookingDetails props@@", props);
    super(props);
    this.state = {
      bookingResponse: "",
      displayUpdateSpaBookingModal: false,
      displayCancelBookingModal: false,
      isOtherCancelResaon: false,

      selectedBookingDate: "",
      bookingTimeSlot: "",
      appliedPromoCode: "",
      promoCodeDiscount: "",
      additionalComments: "",
      slotsArrayForDate: [],
      selectedTimeIndex: "",
      amTimeSlotArray: [],
      pmTimeSlotArray: [],
      displayCancelBookingConfirmationModal: false,
      selectedReasonForCancel: "",
      classBookingId: "",
      selectedEnquiryDetail: "",
      selectedEnquiryDetailTrader: "",
      enquiryDetail: "",
      selectedEnquiry: "",
      hideCheckout: this.props.history.location.state?.hideCheckout
        ? true
        : false,
      booking_type: this.props.history.location.state?.booking_type ? "event" : "handyman",
    };
    console.log(`this.props,eventtt`, this.props);
    console.log(`booking_typestate`, this.state.booking_type);
    console.log(`bhis.props.history.location.state.real`, this.props.history.location.state);
    console.log(`bhis.props.history.location.state`, this.state.bookingResponse);
  }

  componentDidMount() {
    const { loggedInDetail } = this.props;
    const parameter = this.props.match.params;
    let eventBookingId = parameter.id;
    this.setState({
      eventBookingId: parseInt(eventBookingId),
      customerId: loggedInDetail.id,
      loggedInDetail,
    });
    switch (this.state.booking_type) {
      case "event":
        this.getCustomerCatererEnquiryDetail(eventBookingId);
        this.getCatererEnquiryDetail(eventBookingId);
        break;
      case "handyman":
        this.getHandymanDetails(eventBookingId);
        this.getTraderDetailsHandyman(eventBookingId);
        break;
      default:
        break;
    }
  }

  getCustomerCatererEnquiryDetail = (eventBookingId) => {
    this.props.getCustomerCatererEnquiryDetail(
      { id: eventBookingId },
      (res) => {
        if (res.status === STATUS_CODES.OK) {
          this.setState({
            selectedEnquiryDetail: res.data.data,
          });
        }
      }
    );
  };

  getCatererEnquiryDetail = (eventBookingId) => {
    this.props.getCatererEnquiryDetail({ id: eventBookingId }, (res) => {
      if (res.status === STATUS_CODES.OK) {
        this.setState({
          enquiryDetail: res.data.data,
        });
      }
    });
  };

  getHandymanDetails = (id) => {
    let reqData = {
      trader_quote_request_id: id,
      history_id: id,
      data_type: "job"
    };
    console.log(`reqData getHandymanDetails `, reqData);
    this.props.getHistoryDetails(reqData, (res) => {

      if (res.status === STATUS_CODES.OK) {
        const quote_amount = res.data.history.quote ? res.data.history.quote.amount : res.data.history.cost;

        this.setState({
          selectedEnquiryDetail: {
            ...res.data.history,

            quote: {
              price: quote_amount,
            },

            // trader_user_profile: {
            //   user: {
            //     image: res.data.quote_request.trader_user.image,
            //   },
            // },
          },
          enquiryDetail: res.data.history,
        });
      }
    });
  };

  getTraderDetailsHandyman = (id) => {
    let reqData = {
      filter: "top_rated",
      id: 1723,
      login_user_id: 1716,
      user_id: 1716,
    };
    console.log(`reqData getHandymanDetails `, reqData);
    this.props.getTraderDetails(reqData, (res) => {
      console.log(res, "rrrrrrrrrrrtrader")

      if (res.status === STATUS_CODES.OK) {
        this.setState({

          selectedEnquiryDetailTrader: res.data.data,

        });

      }
    });
  };


  bookingDetail = (detail) => {
    console.log(detail, "detailaaaaaaaaaa")
    const parameter = this.props.match.params;
    console.log(parameter.id);
    const reqData = {
      trader_user_id: detail.trader_user_profile.user_id,
      name: detail.name,
      phone_number: detail.phone_number,
      email: detail.email,
      booking_date: detail.booking_date,
      start_time: detail.start_time,
      end_time: detail.end_time,
      additional_comments: detail.additional_comments,
      no_of_people: detail.no_of_people,
      time: detail.time,
      venue_of_event: detail.venue_of_event,
      looking_for: detail.looking_for,
      dietary: detail.dietary,
      cusine: detail.cusines,
      event_type_id: detail.event_type_id,
      other_event_type: detail.other_event_type,
      price: detail.quote.price,
      enquiryId: parameter.id,
    };
    //this.props.postBookingsDetail(test);
    this.props.enableLoading();
    this.props.postBookingsDetail(reqData, (res) => {
      this.props.disableLoading();

      console.log("working postBookingsDetail API", res);
      if (
        res.status === STATUS_CODES.OK &&
        (res.data.success || res.data.data?.success)
      ) {
        const { selectedEnquiryDetail, loggedInDetail } = this.state;
        this.props.history.push({
          pathname: `/booking-checkout`,
          state: {
            amount: parseFloat(selectedEnquiryDetail.quote.price),
            trader_user_id: selectedEnquiryDetail.trader_user_profile.user_id,
            customerId: loggedInDetail.id,
            selectedEnquiryId: selectedEnquiryDetail.event_type_id,
            customer_name: loggedInDetail.name,
            payment_type: "firstpay",
            booking_type: this.state.booking_type,
            service_booking_id: selectedEnquiryDetail.id,
            enquiryId: parameter.id,
          },
        });
      } else {
        toastr.error("Error occured", res.data.message);
      }
    });
  };

  handymanDetails = (detail) => {
    console.log(detail, "handymanDetails")
    const parameter = this.props.match.params;

    console.log("working handymanDetails API");
    const { selectedEnquiryDetail, loggedInDetail } = this.state;
    this.props.history.push({
      pathname: `/booking-checkout`,
      state: {
        amount: parseFloat(selectedEnquiryDetail.price),
        trader_user_id: selectedEnquiryDetail.trader_user_profile.user_id,
        customerId: loggedInDetail.id,
        selectedEnquiryId: selectedEnquiryDetail.event_type_id,
        customer_name: loggedInDetail.name,
        payment_type: "firstpay",
        booking_type: this.state.booking_type,
        service_booking_id: selectedEnquiryDetail.id,
      },
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      bookingResponse,
      selectedEnquiryDetail,
      loggedInDetail,
      hideCheckout,
      selectedEnquiryDetailTrader,
    } = this.state;
    console.log(selectedEnquiryDetail, "selectedEnquiryDetail")
    console.log(loggedInDetail, "loggedInDetail")
    console.log(selectedEnquiryDetailTrader, "selectedEnquiryDetailTrader")
    console.log(bookingResponse, "bookingResponse")
    let to = selectedEnquiryDetail.to;
    let from = selectedEnquiryDetail.from;

    // const { customerId, classBookingId, slotsArrayForDate, selectedBookingDate, bookingTimeSlot, additionalComments, selectedTimeIndex, amTimeSlotArray, pmTimeSlotArray } = this.state;
    let amountToPay = 0;
    if (selectedEnquiryDetail !== null && selectedEnquiryDetail !== "") {
      amountToPay =
        parseFloat(
          selectedEnquiryDetail.quote.price
            ? selectedEnquiryDetail.quote.price
            : 0
        ) +
        parseFloat(
          selectedEnquiryDetail.gst_percentage ? selectedEnquiryDetail.gst_percentage : 0
        );

      console.log(amountToPay, "dddddddddd")
      // amountToPay =
      //   selectedEnquiryDetail.promo.promo_code &&
      //   selectedEnquiryDetail.promo.promo_code != null
      //     ? (
      //         parseFloat(amountToPay) -
      //         parseFloat(selectedEnquiryDetail.discount_amount)
      //       ).toFixed(2)
      //     : parseFloat(amountToPay);
    }

    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab spa-booking-history-detail customer-beauty-booking-detail"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>View Details</Title>
                  </div>
                  <div className="right"></div>
                </div>
                <div
                  className="sub-head-section"
                  style={{
                    display: "block",
                  }}
                >
                  <div className="back" onClick={this.props.history.goBack}>
                    <LeftOutlined /> <span>Back</span>
                  </div>
                </div>
                <div className="profile-content-box box-shdw-none book-now-popup mt-18">
                  {selectedEnquiryDetail != null &&
                    selectedEnquiryDetail !== "" && (
                      <>
                        <Row gutter={30}>
                          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                            <div className="left-parent-detail-block">
                              <Card>
                                <div className="your-booking">Your Booking</div>
                                <div
                                  className="booking-id"
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  Booking ID: #
                                  <strong>{selectedEnquiryDetail.id}</strong>
                                </div>
                                <Row gutter={0}>
                                  <Col md={24}>
                                    <div className="body-detail booking-user-detail-box">
                                      <div className="thumb-title-block">
                                        <div className="slide-content">
                                          <img
                                            src={

                                              selectedEnquiryDetail.start_date
                                                ? selectedEnquiryDetail
                                                  .trader_user_profile.user
                                                  .image
                                                : selectedEnquiryDetail.customer.image
                                            }
                                            alt=""
                                          />
                                        </div>
                                        <div className="fm-user-details inner-fourth">
                                          <Title level={4}>
                                            {

                                              selectedEnquiryDetail.event_type ? selectedEnquiryDetail.event_type.name : ""

                                            }
                                          </Title>
                                          <Text className="service_type">
                                            <ul>
                                              {/*{" "}
                                              {selectedEnquiryDetail.trader_user_profile.service_type.map(
                                                (number, i) => (
                                                  <li key={i}>{number}</li>
                                                )
                                              )}*/}
                                            </ul>
                                          </Text>

                                          <Text className="fm-location">
                                            {

                                              selectedEnquiryDetail.customer.location ? selectedEnquiryDetail.customer.location :
                                                selectedEnquiryDetail.trader_user_profile.user

                                                  .business_location
                                            }
                                          </Text>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>

                                <div className="body-detail">
                                  <Row>
                                    <Col className="ant-col ant-col-xs-12 ant-col-sm-12 ant-col-md-12 ant-col-lg-12 ant-col-xl-12">
                                      <Row gutter={15}>
                                        <Col md={12}>
                                          <div className="title-sub-title-detail">
                                            <div className="title">
                                              Service:
                                            </div>
                                            <div className="sub-title-detail">

                                              {
                                                selectedEnquiryDetail.trader_service ? selectedEnquiryDetail.trader_service.name :
                                                  selectedEnquiryDetail.trader_user_profile.trader_service.name
                                              }
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row gutter={15}>
                                        <Col md={12}>
                                          <div className="title-sub-title-detail">
                                            <div className="title">
                                              Date/Time:
                                            </div>
                                            <div className="sub-title-detail">
                                              {moment(
                                                selectedEnquiryDetail.date
                                              ).format("dddd, MMMM DD YYYY")}
                                              <br />
                                              {convertTime24To12Hour(
                                                selectedEnquiryDetail.start_time
                                              )}
                                              -
                                              {convertTime24To12Hour(
                                                selectedEnquiryDetail.end_time
                                              )}
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>

                                      <Row gutter={15}>
                                        <Col md={12}>
                                          <div className="title-sub-title-detail">
                                            <div className="title">
                                              Duration:
                                            </div>
                                            <div className="sub-title-detail">
                                              {selectedEnquiryDetail.to ? moment(
                                                to,
                                                "hh:mm:ss"
                                              ).diff(
                                                moment(
                                                  from,
                                                  "hh:mm:ss"
                                                ),
                                                "m"
                                              ) : moment(
                                                selectedEnquiryDetail.end_time,
                                                "hh:mm:ss"
                                              ).diff(
                                                moment(
                                                  selectedEnquiryDetail.start_time,
                                                  "hh:mm:ss"
                                                ),
                                                "m"
                                              )}{" "}
                                              mins
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col className="ant-col ant-col-xs-12 ant-col-sm-12 ant-col-md-12 ant-col-lg-12 ant-col-xl-12">
                                      <Row gutter={15}>
                                        <Col md={12}>
                                          <div className="title-sub-title-detail">
                                            <div className="title">
                                              Contact Name:
                                            </div>
                                            <div className="sub-title-detail">
                                              {
                                                selectedEnquiryDetail.customer
                                                  .name
                                              }
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row gutter={15}>
                                        <Col md={12}>
                                          <div className="title-sub-title-detail">
                                            <div className="title">
                                              Email Address:
                                            </div>
                                            <div className="sub-title-detail">
                                              {
                                                selectedEnquiryDetail.customer
                                                  .email
                                              }
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row gutter={15}>
                                        <Col md={12}>
                                          <div className="title-sub-title-detail">
                                            <div className="title">
                                              Phone Number:
                                            </div>
                                            <div className="sub-title-detail">
                                              {selectedEnquiryDetail.customer
                                                .mobile_no ? `${selectedEnquiryDetail.customer.mobile_no}`
                                                : selectedEnquiryDetail.phone_number}
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                            <div className="right-parent-block-detail payment-block-detail">
                              <div className="header-detail">
                                <h2>Payment Details</h2>
                              </div>
                              <div className="price-total-list">
                                <Row gutter={20} className="price-total-box">
                                  <Col xs={24} sm={24} md={18} lg={18}>
                                    <div>
                                      {
                                        selectedEnquiryDetail.to ? selectedEnquiryDetail.trader_service.name : selectedEnquiryDetail
                                          .trader_user_profile.trader_service
                                          .name
                                      }{" "}
                                      {selectedEnquiryDetail.to ? (moment(
                                        to,

                                        "hh:mm:ss"
                                      ).diff(
                                        moment(
                                          from,
                                          "hh:mm:ss"
                                        ),
                                        "m"
                                      )) :
                                        (moment(
                                          selectedEnquiryDetail.end_time,
                                          "hh:mm:ss"
                                        ).diff(
                                          moment(
                                            selectedEnquiryDetail.start_time,
                                            "hh:mm:ss"
                                          ),
                                          "m"
                                        ))}{" "}

                                      mins{" "}
                                      {selectedEnquiryDetail.event_type ? selectedEnquiryDetail.event_type.name : ""}
                                    </div>
                                  </Col>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={6}
                                    lg={6}
                                    className="price-text"
                                  >
                                    $
                                    {selectedEnquiryDetail.quote.price !== null
                                      ? selectedEnquiryDetail.quote.price.toFixed(
                                        2 
                                      )
                                      : "0.00"}
                                  </Col>
                                </Row>
                                <Row gutter={24}>
                                  <Col md={18}>Subtotal</Col>
                                  <Col md={6} className="text-right">
                                    $
                                    {selectedEnquiryDetail.quote.price !== null
                                      ? selectedEnquiryDetail.quote.price.toFixed(
                                        2
                                      )
                                      : "0.00"}
                                  </Col>
                                </Row>
                                <Row gutter={24}>
                                  <Col md={18}>Taxes and subcharges:</Col>
                                  <Col md={6} className="text-right">

                                    ${selectedEnquiryDetail.gst_percentage ? selectedEnquiryDetail.gst_percentage.toFixed(2) : '0.00'}

                                  </Col>
                                </Row>
                                <Row gutter={24}>
                                  <Col md={18}>
                                    <b>Total</b>
                                  </Col>
                                  <Col md={6} className="text-right">
                                    <div className="total-amount">
                                      <b>${amountToPay}</b>
                                    </div>
                                  </Col>
                                </Row>
                                {!hideCheckout && (
                                  <Row className="button-b">
                                    <button
                                      onClick={() => {
                                        // e.stopPropagation();
                                        this.bookingDetail(
                                          selectedEnquiryDetail
                                        );
                                      }}
                                    >
                                      Checkout
                                    </button>
                                  </Row>
                                )}
                              </div>
                            </div>
                             <div className="right-parent-block-detail special-notes">
                            <div className="header-detail">
                              <h2>Special Note</h2>
                            </div>
                            <div className="body-detail">
                              <p>
                                {selectedEnquiryDetail.additional_comments
                                  ? selectedEnquiryDetail.additional_comments
                                  : "N/A"}
                              </p>
                            </div>
                          </div> 
                          </Col>
                        </Row>
                      </>
                    )}
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
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getBeautyServiceBooking,
  cancelBeautyServiceBooking,
  getTraderMonthWellbeingBooking,
  updateBeautyServiceBooking,
  showCustomerClass,
  getCustomerCatererEnquiryDetail,
  getCatererEnquiryDetail,
  postBookingsDetail,
  getEnquiryDetails,
  getHistoryDetails,
  getTraderDetails
})(withRouter(EventBookingDetails));
