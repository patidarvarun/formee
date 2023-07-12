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
import { langs } from "../../../../../../config/localization";

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
    // const getBookingReqData = {
    //     service_booking_id: serviceBookingId
    // }

    // this.props.getServiceBooking(getBookingReqData, res => {
    //
    //     if (res.status === 200) {
    //         this.setState({ bookingResponse: res.data.data });
    //     } else {
    //         toastr.error('Something went wrong');
    //     }
    // })
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      mergedStepsData,
      selectedService,
      bookingDetail,
      selectedDate,
    } = this.props;

    const { step1Data, step2Data } = mergedStepsData;

    const {
      available_from,
      available_to,
      trader_user_profile_id,
    } = selectedService;
    const itemId = this.props.match.params.itemId;

    const { customerId, serviceBookingId } = step1Data;
    const { bookingResponse } = this.state;
    let date = moment(selectedDate, "dd,DD MMM")
      .add(1, "days")
      .format("dd,DD MMM YYYY");
    let time = moment(selectedService.start_time, "HH:mm:ss").format("hh:mm A");
    return (
      <Layout>
        <Layout>
          <Layout>
            <Row gutter={[20, 20]}>
              <Col span={12} className="mt-20">
                <Title level={4}>Your booking details</Title>
                <Card>
                  <Row gutter={[20, 20]}>
                    <Col md={10}>
                      <div className="slide-content">
                        <img
                          src={
                            bookingDetail.image
                              ? bookingDetail.image
                              : DEFAULT_IMAGE_CARD
                          }
                          alt=""
                        />
                      </div>
                    </Col>
                    <Col md={14}>
                      <div className="fm-user-details inner-fourth">
                        <Title level={4}>{bookingDetail.business_name}</Title>
                        <br></br>
                        <Text className="category-type">
                          {date} {time}
                        </Text>
                        <br></br>
                        <Text className="fm-location">
                          {bookingDetail && bookingDetail.business_location
                            ? bookingDetail.business_location
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
                        {moment(selectedDate).format("dddd, MMMM Do YYYY")}
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
                  <div>
                    <Row className="mt-10">
                      <Text>
                        <b>Time:</b> <br />{" "}
                        {convertTime24To12Hour(selectedService.start_time)}
                      </Text>
                    </Row>
                    <Row className="mt-10">
                      <Text>
                        <b>Duration:</b> <br />
                        {selectedService.duration}
                      </Text>
                    </Row>
                    <Divider />
                    <Row className="mt-10">
                      <Text>
                        {" "}
                        <b>Contact Name:</b> <br />
                        {step2Data.customer_name}
                      </Text>
                    </Row>
                    {/* <Row className="mt-10">
                                            <Text> <b>Email Address: </b>  <br /> {bookingDetail.customer.email}</Text>
                                        </Row> */}
                    <Row className="mt-10">
                      <Text>
                        {" "}
                        <b>Phone Number: </b> <br /> {step2Data.customer_phone}
                      </Text>
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col span={12} className="mt-20">
                <Title level={4}>Your price summary </Title>
                <Card className="price-summary">
                  <Row>
                    <Text>{bookingDetail.business_name}</Text>
                  </Row>
                  <Row className="pt-5">
                    <Col md={16}>{step1Data.quantity}</Col>
                    <Col md={16}>{selectedService.duration}</Col>
                    <Col md={8}> ${step1Data.amount}</Col>
                  </Row>
                  <Row className="pt-5">
                    <Col md={16}>Taxes and subcharges:</Col>
                    {/* <Col md={8}>${bookingResponse.tax_amount}</Col> */}
                  </Row>
                  {step1Data.appliedPromoCode &&
                    step1Data.appliedPromoCode != null && (
                      <Row className="pt-5">
                        <Col md={16}>
                          Code promo `${step1Data.appliedPromoCode}`
                        </Col>
                        <Col md={8}>-${step1Data.discount_amount}</Col>
                      </Row>
                    )}
                  <Divider />
                  <Row className="pt-5">
                    <Col md={16}>
                      <b>Total:</b>{" "}
                    </Col>
                    <Col md={8}>
                      <b>${step1Data.discountedPrice}</b>{" "}
                    </Col>
                  </Row>
                </Card>
                <Title level={4} className="mt-30">
                  Special Note
                </Title>
                <Card>
                  <Row>
                    <Text>
                      {step1Data.additionalComments
                        ? step1Data.additionalComments
                        : "N/A"}
                    </Text>
                  </Row>
                </Card>
              </Col>
              <Col md={24}>
                <div className="steps-action ">
                  <Button
                    htmlType="button"
                    onClick={() => this.props.moveBack()}
                    type="primary"
                    size="middle"
                    className="btn-blue fm-btn"
                  >
                    Back
                  </Button>
                  <Button
                    htmlType="submit"
                    onClick={() =>
                      this.props.history.push({
                        pathname: `/booking-checkout`,
                        state: {
                          amount: step1Data.amount,
                          trader_user_id: itemId,
                          package_id: selectedService.id,
                          customer_name: step2Data.contactName,
                          customer_phone: step2Data.phoneNumber,
                          booking_type: langs.key.fitness,
                          start_date: available_from,
                          //start_date: "15-11-2020",
                          phonecode: step2Data.phoneNumber,
                          booking_id: step2Data.booking_id,
                        },
                      })
                    }
                    type="primary"
                    size="middle"
                    className="btn-blue fm-btn"
                  >
                    Pay
                  </Button>
                </div>
              </Col>
            </Row>
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
