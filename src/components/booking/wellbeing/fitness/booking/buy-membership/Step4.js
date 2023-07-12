import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Steps,
  Calendar,
  Card,
  Layout,
  Progress,
  Typography,
  Avatar,
  Tabs,
  Row,
  Col,
  Breadcrumb,
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
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getServiceBooking } from "../../../../../../actions";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { DEFAULT_IMAGE_CARD } from "../../../../../../config/Config";
import {
  convertMinToHours,
  convertTime24To12Hour,
} from "../../../../../common";

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
    const { step1Data } = this.props.mergedStepsData;
    const { serviceBookingId } = step1Data;
    const getBookingReqData = {
      service_booking_id: serviceBookingId,
    };

    this.props.getServiceBooking(getBookingReqData, (res) => {
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
    const { step1Data } = mergedStepsData;
    const { customerId, serviceBookingId } = step1Data;
    const { bookingResponse } = this.state;
    return (
      <Layout>
        <Layout>
          <Layout>
            {bookingResponse !== "" && (
              <Row gutter={[20, 20]}>
                <Col span={12} className="mt-20">
                  <Title level={4}>Your booking details</Title>
                  <Card>
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
                          <Title level={4}>
                            {
                              bookingResponse.service_sub_bookings[0]
                                .wellbeing_trader_service.name
                            }
                          </Title>
                          <br></br>
                          <Text className="category-type">
                            {bookingResponse.sub_category_name}
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
                  <Title level={4}>Your price summary </Title>
                  <Card className="price-summary">
                    <Row>
                      <Text>
                        {
                          bookingResponse.service_sub_bookings[0]
                            .wellbeing_trader_service.name
                        }
                      </Text>
                    </Row>
                    <Row className="pt-5">
                      <Col md={16}>1</Col>
                      <Col md={8}> ${bookingResponse.total_amount}</Col>
                    </Row>
                    <Row className="pt-5">
                      <Col md={16}>Taxes and subcharges:</Col>
                      <Col md={8}>${bookingResponse.tax_amount}</Col>
                    </Row>
                    {bookingResponse.promo_code &&
                      bookingResponse.promo_code != null && (
                        <Row className="pt-5">
                          <Col md={16}>
                            Code promo `${bookingResponse.promo_code}`
                          </Col>
                          <Col md={8}>-${bookingResponse.discount_amount}</Col>
                        </Row>
                      )}
                    <Divider />
                    <Row className="pt-5">
                      <Col md={16}>
                        <b>Total:</b>{" "}
                      </Col>
                      <Col md={8}>
                        <b>${bookingResponse.total_amount}</b>{" "}
                      </Col>
                    </Row>
                  </Card>
                  <Title level={4} className="mt-30">
                    Special Note
                  </Title>
                  <Card>
                    <Row>
                      <Text>
                        {bookingResponse.additional_comments
                          ? bookingResponse.additional_comments
                          : "N/A"}
                      </Text>
                    </Row>
                  </Card>
                </Col>
                <div className="steps-action ">
                  <Button
                    onClick={() =>
                      this.props.history.push({
                        pathname: `/booking-checkout`,
                        state: {
                          amount: bookingResponse.total_amount,
                          trader_user_id: bookingResponse.trader_user_id,
                          customerId,
                          service_booking_id: serviceBookingId,
                          customer_name: bookingResponse.customer.name,
                          mobile_no: bookingResponse.customer.mobile_no,
                          phonecode: bookingResponse.customer.phonecode,
                          payment_type: "firstpay",
                        },
                      })
                    }
                    size="middle"
                    className="text-white"
                    style={{ backgroundColor: "#EE4929" }}
                  >
                    Pay
                  </Button>
                </div>
              </Row>
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

export default connect(mapStateToProps, { getServiceBooking })(
  withRouter(Step4)
);
