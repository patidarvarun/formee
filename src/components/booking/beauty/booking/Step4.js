import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  Layout,
  Typography,
  Row,
  Col,
  Button,
  Divider,
  Anchor,
} from "antd";
import { getBeautyServiceBooking } from "../../../../actions";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
import { convertMinToHours, convertTime24To12Hour } from "../../../common";

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;
class Step4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingResponse: "",
    };
  }

  componentDidMount() {
    const { step1Data, step2Data } = this.props.mergedStepsData;
    const { serviceBookingId } = step2Data;
    const getBookingReqData = {
      service_booking_id: serviceBookingId,
    };
    this.props.getBeautyServiceBooking(getBookingReqData, (res) => {
      if (res.status === 200) {
        this.setState({ bookingResponse: res.data.data });
      } else {
        toastr.error("Something went wrong");
      }
    });
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { mergedStepsData } = this.props;
    const { step1Data, step2Data } = mergedStepsData;
    const { customerId } = step1Data;
    const { serviceBookingId } = step2Data;
    const { bookingResponse } = this.state;
    let amountToPay = 0;
    amountToPay =
      parseFloat(bookingResponse.total_amount) +
      parseFloat(bookingResponse.tax_amount);
    amountToPay =
      bookingResponse.promo_code && bookingResponse.promo_code != null
        ? (
            parseFloat(amountToPay) -
            parseFloat(bookingResponse.discount_amount)
          ).toFixed(2)
        : parseFloat(amountToPay);
    return (
      <Layout>
        <Layout>
          <Layout>
            {bookingResponse !== "" && (
              <Fragment>
              <Row gutter={[20, 20]}>
                <Col span={12} className="mt-20">
                  <Title level={4} className="block-title">Your booking details</Title>
                  <Card className="shadow2">
                    <Row gutter={[20, 20]}>
                      <Col md={10}>
                        <div className="slide-content">
                          <img
                            src={
                              bookingResponse.service_sub_bookings[0]
                                .wellbeing_trader_service.service_image
                                ? bookingResponse.service_sub_bookings[0]
                                    .wellbeing_trader_service.service_image
                                : DEFAULT_IMAGE_CARD
                            }
                            alt=""
                          />
                        </div>
                      </Col>
                      <Col md={14}>
                        <div className="fm-user-details inner-fourth">
                          <Title level={4} className="mb-0">
                            {
                              bookingResponse.service_sub_bookings[0]
                                .wellbeing_trader_service.name
                            }
                          </Title>
                          <Text className="category-type">
                            {bookingResponse.category_name}
                          </Text>
                          <br></br>
                          <Text className="fm-location">
                            {bookingResponse.trader_user.business_location
                              ? bookingResponse.trader_user.business_location
                              : ""}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                    <Divider />
                    <Row>
                      <Col md={17}>
                        <Text>
                          <b>Date:</b> <br></br>
                          {moment(bookingResponse.booking_date).format(
                            "dddd, MMMM Do YYYY"
                          )}
                        </Text>
                      </Col>
                      <Col md={7}>
                        <Button
                          htmlType="submit"
                          type="primary"
                          size="middle"
                          className="btn-withoutline"
                          onClick={() => this.props.onstepToOne()}
                        >
                          Change Booking
                        </Button>
                      </Col>
                    </Row>
                    <Row className="mt-10">
                      <Text>
                        <b>Time:</b> <br />{" "}
                        {convertTime24To12Hour(bookingResponse.start_time)}
                      </Text>
                    </Row>
                    <Row className="mt-10">
                      <Text>
                        <b>Duration:</b> <br />
                        {convertMinToHours(bookingResponse.duration)}
                      </Text>
                    </Row>
                    <Divider />
                    <Row className="mt-10">
                      <Text>
                        {" "}
                        <b>Contact Name:</b> <br />
                        {bookingResponse.customer.name}
                      </Text>
                    </Row>
                    <Row className="mt-10">
                      <Text>
                        {" "}
                        <b>Email Address: </b> <br />{" "}
                        {bookingResponse.customer.email}
                      </Text>
                    </Row>
                    <Row className="mt-10">
                      <Text>
                        {" "}
                        <b>Phone Number: </b> <br />{" "}
                        {bookingResponse.customer.mobile_no !== null &&
                        bookingResponse.customer.mobile_no !== ""
                          ? `${bookingResponse.customer.phonecode} ${bookingResponse.customer.mobile_no}`
                          : "N/A"}
                      </Text>
                    </Row>
                  </Card>
                </Col>
                <Col span={12} className="mt-20">
                  <Title level={4} className="block-title">Your price summary </Title>
                  <Card className="price-summary shadow2">
                    {
                      bookingResponse.service_sub_bookings.map(function(item, idx) {
                        return (
                          <Fragment>
                            <Row>
                              <Col md={16}>
                                <div>{item.wellbeing_trader_service.name}</div>
                              </Col>
                              <Col md={8} className="text-right">${item.wellbeing_trader_service.price}</Col>
                            </Row>
                            <Divider />
                          </Fragment>
                        )
                      })
                    }
                    <Row>
                      <Col md={16}>Total</Col>
                      <Col md={8} className="text-right">${bookingResponse.total_amount}</Col>
                    </Row>
                    <Row className="pt-5">
                      <Col md={16}>Taxes and subcharges:</Col>
                      <Col md={8} className="text-right">${bookingResponse.tax_amount}</Col>
                    </Row>
                    {bookingResponse.promo_code &&
                      bookingResponse.promo_code != null && (
                        <Row className="pt-5">
                          <Col md={16}>
                            Code promo {bookingResponse.promo_code}
                          </Col>
                          <Col md={8} className="text-right">- ${bookingResponse.discount_amount}</Col>
                        </Row>
                      )}
                    <Divider />
                    <Row className="pt-5">
                      <Col md={16}>
                        <b>Total:</b>{" "}
                      </Col>
                      <Col md={8} className="text-right">
                        <b className="fs-18">${amountToPay}</b>{" "}
                      </Col>
                    </Row>
                  </Card>
                  <Title level={4} className="mt-30 block-title">
                    Special Note
                  </Title>
                  <Card className="shadow2">
                    <Row>
                      <Text>
                        {bookingResponse.additional_comments
                          ? bookingResponse.additional_comments
                          : "N/A"}
                      </Text>
                    </Row>
                  </Card>
                </Col>
              </Row>
                <div className="steps-action">
                  <Button
                    htmlType="button"
                    onClick={() => this.props.moveBack()}
                    type="primary"
                    size="middle"
                    className="btn-trans fm-btn"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() =>
                      this.props.history.push({
                        pathname: `/booking-checkout`,
                        state: {
                          amount: amountToPay,
                          trader_user_id: bookingResponse.trader_user_id,
                          customerId,
                          service_booking_id: serviceBookingId,
                          customer_name: bookingResponse.customer.name,
                          mobile_no: bookingResponse.customer.mobile_no,
                          phonecode: bookingResponse.customer.phonecode,
                          payment_type: "firstpay",
                          booking_type: "beauty",
                        },
                      })
                    }
                    size="middle"
                    className="btn-blue fm-btn"
                  >
                    Pay
                  </Button>
                </div>
              </Fragment>
            )}
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

export default connect(mapStateToProps, { getBeautyServiceBooking })(
  withRouter(Step4)
);
