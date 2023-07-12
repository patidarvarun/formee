import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Form,
  Collapse,
  InputNumber,
  Select,
  Checkbox,
  Radio,
  Cascader,
} from "antd";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/booking-form.less";
import TopBackWithTitle from "../../common/TopBackWithTitle";
import TourismSteps from "../../common/TourismSteps";
import HotelCheckout from "./HotelCheckout";
import { createRandomAlphaString } from "../../../../../components/common";
import {
  validMobile9,
  required,
  whiteSpace,
} from "../../../../../config/FormValidation";
import {
  getSportsCountryList,
  hotelMonoSearch,
  disableLoading,
  enableLoading,
} from "../../../../../actions";
import "./hotel-checkout.less";
import moment from "moment";
const { Content } = Layout;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

function onChange(date, dateString) {
  console.log(date, dateString);
}
class HotelBookingForm extends React.Component {
  state = {
    current: 1,
    amount: 1264,
    formv: null,
    extra: 0,
    location: [],
    pickupdropoff: false,
    breakfast: false,
  };

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentWillMount() {
    this.props.getSportsCountryList((res) => {
      if (res.status === 200) {
        let item =
          res.data && res.data.data.all && res.data.data.all.data
            ? res.data.data.all.data.item
            : "";
        let data = item && Array.isArray(item) ? item : [];
        if (data.length) {
          this.getCountry(data);
        }
      }
    });
  }

  /**
   * @method getCountry
   * @description get country
   */
  getCountry = (country) => {
    let temp = [];
    country &&
      country.length !== 0 &&
      country.map((el, i) => {
        temp.push({ value: el.caption, label: el.caption });
      });
    this.setState({ location: temp });
    // this.props.setCountry(temp)
  };

  submitForm = (
    values,
    roomRate,
    nights,
    rooms,
    totalRate,
    taxation,
    state
  ) => {
    this.props.enableLoading();
    let extra = 0;
    if (values.add_breakfast) {
      extra =
        76 *
        +(
          state &&
          state.reqData &&
          state.reqData.rooms.length &&
          state.reqData.rooms[0].totalAdults
        ) *
        nights;
    }
    if (values.airport_pickup_dropoff) {
      extra = extra + 96;
    }
    let tmp = {
      hotel_code: state && state.basic_info.hotelCode,
      pnr_number: "6U36QJ",
      start_date: state && state.reqData.startDate,
      end_date: state && state.reqData.endDate,
      total_price: +totalRate + +taxation + extra,
      hotel_details: state && state.fullHotelData,
      roomDetail: state && state.room,
      add_breakfast: values.add_breakfast,
      airport_pickup_dropoff: values.airport_pickup_dropoff,
    };
    let tmp2 = {
      chainCode: state && state.fullHotelData.basicPropertyInfo.chainCode,
      token: createRandomAlphaString(),
      hotelCode: state && state.basic_info.hotelCode,
      hotelCityCode:
        state && state.fullHotelData.basicPropertyInfo.hotelCityCode,
      startDate: state && state.reqData.startDate,
      endDate: state && state.reqData.endDate,
      ratePlanCode: state && state.room.ratePlans[0].ratePlanCode,
      roomTypeCode: state && state.room.roomType.roomTypeCode.code,
      bookingCode: state && state.room.roomRate.bookingCode,
      phone: values && values.mobile_no,
      email: values && values.email,
      userInfo: [
        {
          firstName: values && values["guest-name"],
          lastName: "test",
        },
      ],
      rooms: state && state.reqData && state.reqData.rooms,
    };
    // let tmp2 = Object.assign({}, hdetail, values);
    this.props.hotelMonoSearch(tmp2, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        if (res.data.pnr) {
          tmp.pnr_number = res.data.pnr;
        }
        this.setState({
          formv: tmp,
          current: 2,
          extra: extra,
        });
      }
    });
  };

  render() {
    const {
      current,
      formv,
      amount,
      extra,
      location,
      pickupdropoff,
      breakfast,
    } = this.state;
    const {
      location: { state },
    } = this.props;
    console.log(
      "🚀 ~ file: HotelBookingForm.js ~ line 331 ~ HotelBookingForm ~ render ~ state",
      state
    );
    let start, end;
    if (state && state.reqData) {
      start = moment(state.reqData.startDate, "YYYY-MM-DD");
      end = moment(state.reqData.endDate, "YYYY-MM-DD");
    }
    let roomRate =
      state &&
      state.room &&
      state.room.roomRate &&
      state.room.roomRate.total.amountBeforeTax
        ? (+state.room.roomRate.total.amountBeforeTax).toFixed(2)
        : 0;
    if (isNaN(+roomRate)) {
      roomRate =
        state &&
        state.room &&
        state.room.roomRate &&
        state.room.roomRate.total.amountAfterTax
          ? state.room.roomRate.total.amountAfterTax
          : 0;
    }
    let nights = start && end ? moment.duration(start.diff(end)).asDays() : 0;
    nights = +nights < 0 ? +nights * -1 : +nights;
    console.log(
      "🚀 ~ file: HotelBookingForm.js ~ line 340 ~ HotelBookingForm ~ render ~ nights",
      nights
    );
    let rooms = state && state.reqData && state.reqData.rooms.length;
    let taxation = 0;
    let totalRate = (+roomRate * +rooms * +nights).toFixed(2);
    state &&
      state.room &&
      state.room.roomRate &&
      state.room.roomRate.total.taxes.map((tax) => {
        console.log(
          "🚀 ~ file: HotelBookingForm.js ~ line 163 ~ HotelBookingForm ~ state.room.roomRate.total.taxes.map ~ tax",
          tax
        );
        taxation = (+taxation + +tax.amount).toFixed(2);
      });
    let bp = 0;
    if (breakfast) {
      bp =
        76 *
        +(
          state &&
          state.reqData &&
          state.reqData.rooms.length &&
          state.reqData.rooms[0].totalAdults
        ) *
        nights;
    }
    if (pickupdropoff) {
      bp = bp + 96;
    }
    return (
      <>
        {current == 2 ? (
          <HotelCheckout
            current={current}
            formv={formv}
            amount={amount}
            roomRate={roomRate}
            nights={nights}
            rooms={rooms}
            totalRate={totalRate}
            taxation={taxation}
            Data={state}
            extra={extra}
          />
        ) : (
          <Layout className="common-sub-category-landing booking-sub-category-landing booking-tourism-checkout-box">
            <Layout className="yellow-theme common-left-right-padd">
              <TopBackWithTitle />
              <Layout className="right-parent-block inner-content-wrap">
                <Content className="site-layout tourism-booking-form-box tourism-hotel-detail-box">
                  <TourismSteps current />
                  <div className="booking-tourism-box ">
                    <div>
                      {/* START - Heading and Contact Information box - 12/07/2021 */}
                      <div className="page-heading-container">
                        <h2>Guest Details</h2>
                        <p>
                          <Text type="danger">* = mandatory fields</Text>
                        </p>
                      </div>
                      <Form
                        onFinish={(v) =>
                          this.submitForm(
                            v,
                            roomRate,
                            nights,
                            rooms,
                            totalRate,
                            taxation,
                            state
                          )
                        }
                      >
                        <Row gutter={16}>
                          <Col md={16}>
                            <div className="contact-information-container">
                              <div className="contact-information-heading">
                                <h2>
                                  <img
                                    src={require("../../../../../assets/images/icons/email-orange.svg")}
                                    alt="email-orange"
                                  />
                                  Guest Details
                                </h2>
                              </div>
                              <hr />

                              <div className="contact-information-form">
                                {/* <Form layout="vertical"> */}
                                <Row gutter={16}>
                                  <Col md={12}>
                                    <Form.Item
                                      label="Guest Name: "
                                      name="guest-name"
                                      rules={[{ required: true }]}
                                    >
                                      <Input placeholder="..." />
                                    </Form.Item>
                                  </Col>

                                  <Col md={12}>
                                    {/* <Form.Item
                                  label="Mobile Phone: "
                                  name="mobile phone"
                                  rules={[{ required: true }]}
                                >
                                  <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="+61 Aust..."
                                  />
                                </Form.Item>
                              </Col>

                              <Col md={8} className="label-height">
                                <Form.Item
                                  label="Mobile Phone: "
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Incase we need to reach you" />
                                </Form.Item> */}
                                    <Form.Item
                                      label={"Mobile Phone:*"}
                                      name={"mobile phone"}
                                    >
                                      <Select
                                        value={"+61"}
                                        className="phone-inner"
                                        onChange={(value) => {}}
                                      >
                                        <Option value="+91">+91</Option>
                                        <Option value="+61">+61</Option>
                                      </Select>
                                      <Form.Item
                                        name="mobile_no"
                                        className="phone"
                                        style={{ width: "calc(100% - 120px)" }}
                                        // rules={[required("Mobile Phone")] }
                                        rules={[{ validator: validMobile9 }]}
                                      >
                                        <Input
                                          className="pl-10"
                                          style={{ width: "calc(100% - 0px)" }}
                                          name="phone"
                                          onChange={this.handleBlur}
                                          // value={mobile_no}
                                        />
                                      </Form.Item>
                                    </Form.Item>
                                  </Col>
                                </Row>

                                <Row gutter={16}>
                                  <Col md={12}>
                                    <Form.Item
                                      label="Email: "
                                      name="email"
                                      rules={[{ required: true }]}
                                    >
                                      <Input placeholder="..." />
                                    </Form.Item>
                                  </Col>

                                  <Col md={12}>
                                    <Form.Item
                                      label="Country of residence: "
                                      name="country"
                                      rules={[{ required: true }]}
                                    >
                                      <Cascader
                                        placeholder="Country"
                                        options={location}
                                      />
                                      {/* <Input placeholder="..." /> */}
                                    </Form.Item>
                                  </Col>
                                </Row>

                                <Row>
                                  <Col md={24} className="checkbox-col">
                                    <Checkbox onChange={onChange}>
                                      I'm making this booking for someone else.
                                    </Checkbox>
                                  </Col>
                                </Row>
                                {/* </Form> */}
                              </div>
                            </div>

                            <div className="hotel-booking-form-box">
                              <Title className="booking-form-title">
                                More requests
                              </Title>
                              <div className="guest-booking-form">
                                {/* <Form layout="vertical"> */}
                                <Row gutter={16} className="input-row">
                                  <Col md={24} className="preference-form">
                                    <Form.Item
                                      label="Do you have a smoking preference?"
                                      name="smoking-preference"
                                    >
                                      <Radio.Group onChange={onChange}>
                                        <Radio value={1}>
                                          <img
                                            src={require("../../../../../assets/images/icons/non-smoking.svg")}
                                            alt="non-smoking"
                                          />{" "}
                                          Non-smoking room
                                        </Radio>
                                        <Radio value={2}>
                                          {" "}
                                          <img
                                            src={require("../../../../../assets/images/icons/smoking.svg")}
                                            alt="smoking"
                                          />{" "}
                                          Smoking room
                                        </Radio>
                                        <Radio value={3}>Any</Radio>
                                      </Radio.Group>
                                    </Form.Item>
                                  </Col>
                                </Row>

                                <Row gutter={16} className="input-row">
                                  <Col md={24} className="preference-form">
                                    <Form.Item
                                      label="What bed configuration do you prefer?"
                                      name="bed-preference"
                                    >
                                      <Radio.Group onChange={onChange}>
                                        <Radio value={1}>
                                          <img
                                            src={require("../../../../../assets/images/icons/bed.svg")}
                                            alt="bed"
                                          />{" "}
                                          Large bed
                                        </Radio>
                                        <Radio value={2}>
                                          {" "}
                                          <img
                                            src={require("../../../../../assets/images/icons/twin-bed.svg")}
                                            alt="twin-bed"
                                          />{" "}
                                          Twin beds
                                        </Radio>
                                        <Radio value={3}>Any</Radio>
                                      </Radio.Group>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                {/* </Form> */}

                                {/* <Form> */}
                                <div className="middle-section">
                                  <Row gutter={16} className="input-row">
                                    <Col md={18}>
                                      <Form.Item
                                        name="add_breakfast"
                                        valuePropName="checked"
                                      >
                                        <Checkbox
                                          value={1}
                                          onChange={(e) => {
                                            this.setState({
                                              breakfast: e.target.checked,
                                            });
                                          }}
                                        >
                                          <div className="radio-text-container">
                                            <Title
                                              level={4}
                                              className="radio-title"
                                            >
                                              Add Breakfast
                                            </Title>
                                            <p>
                                              Enjoy a convenient Breakfast at
                                              the property for AUD 6 per person,
                                              per night.
                                            </p>
                                          </div>
                                        </Checkbox>
                                      </Form.Item>
                                    </Col>
                                    <Col md={6}>
                                      <div className="radio-text-container">
                                        <Title
                                          level={4}
                                          className="radio-title"
                                        >
                                          AUD 76
                                        </Title>
                                        <p>
                                          {state &&
                                            state.reqData &&
                                            state.reqData.rooms.length &&
                                            state.reqData.rooms[0]
                                              .totalAdults}{" "}
                                          Adults,{" "}
                                          {state &&
                                            state.reqData &&
                                            state.reqData.rooms.length &&
                                            state.reqData.rooms[0]
                                              .totalChildren}{" "}
                                          Children {nights} nights
                                        </p>
                                      </div>
                                    </Col>
                                  </Row>

                                  <Row gutter={16} className="input-row">
                                    <Col md={18}>
                                      <Form.Item
                                        name="airport_pickup_dropoff"
                                        valuePropName="checked"
                                      >
                                        <Checkbox
                                          value={1}
                                          onChange={(e) => {
                                            this.setState({
                                              pickupdropoff: e.target.checked,
                                            });
                                          }}
                                        >
                                          <div className="radio-text-container">
                                            <Title
                                              level={4}
                                              className="radio-title"
                                            >
                                              Airport pick up and drop off
                                            </Title>
                                            <p>
                                              Enjoy a convenient Breakfast at
                                              the property for AUD 6 per person,
                                              per night.
                                            </p>
                                          </div>
                                        </Checkbox>
                                      </Form.Item>
                                    </Col>
                                    <Col md={6}>
                                      <div className="radio-text-container">
                                        <Title
                                          level={4}
                                          className="radio-title"
                                        >
                                          AUD 95
                                        </Title>
                                        <p>
                                          {state &&
                                            state.reqData &&
                                            state.reqData.rooms.length &&
                                            state.reqData.rooms[0]
                                              .totalAdults}{" "}
                                          Adults,{" "}
                                          {state &&
                                            state.reqData &&
                                            state.reqData.rooms.length &&
                                            state.reqData.rooms[0]
                                              .totalChildren}{" "}
                                          Children {nights} nights
                                        </p>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                                {/* </Form> */}

                                {/* <Form
                            labelCol={{ md: 6 }}
                            wrapperCol={{ md: 14 }}
                            className="last-form"
                          > */}
                                <Form.Item
                                  className="whenare"
                                  label={
                                    <Title level={4} className="input-title ">
                                      When are you coming
                                    </Title>
                                  }
                                  name="when_are_you_coming"
                                >
                                  <Select
                                    className="select-design"
                                    defaultValue="1"
                                    onChange={(value) => {}}
                                  >
                                    <Option value="1">I don't Know</Option>
                                    {Array.from(Array(24), (e, i) => {
                                      console.log(
                                        "🚀 ~ file: HotelBookingForm.js ~ line 693 ~ HotelBookingForm ~ {Array.from ~ e, i",
                                        e,
                                        i
                                      );
                                      return (
                                        <Option
                                          value={`${
                                            i < 10 ? "0" : ""
                                          }${i}:00 - ${i + 1 < 10 ? "0" : ""}${
                                            i + 1 == 24 ? "00" : i + 1
                                          }:00`}
                                        >{`${i < 10 ? "0" : ""}${i}:00 - ${
                                          i + 1 < 10 ? "0" : ""
                                        }${
                                          i + 1 == 24 ? "00" : i + 1
                                        }:00`}</Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  className="whenare"
                                  name="notes"
                                  label={
                                    <Title level={4} className="input-title ">
                                      Additional Note
                                    </Title>
                                  }
                                >
                                  <TextArea
                                    className="textarea-design"
                                    placeholder="Any personal requests? Let us know in English"
                                  ></TextArea>
                                </Form.Item>
                                {/* </Form> */}
                              </div>
                            </div>
                            {/* <div className="information-box promo-box">
                              <p>Do you have code promo?</p>
                              <div className="promo-box-right">
                                <Form.Item name="promocode">
                                  <Input placeholder="Enter promotion code" />
                                </Form.Item>
                                <Button className="apply-btn">Apply</Button>
                              </div>
                            </div> */}
                          </Col>
                          {/* START - Hotel Your Booking Right Sidebar - 12/07/2021 */}
                          <Col md={8}>
                            <div className="hotel-right-your-booking-box">
                              <Title level={1} className="sidebar-heading">
                                Your Booking
                              </Title>

                              <div className="information title-information">
                                <img
                                  src={
                                    state &&
                                    state.hotelData &&
                                    state.hotelData.hotelImages.length &&
                                    state.hotelData.hotelImages[0]
                                  }
                                  alt="hotel"
                                  width="100"
                                  height="100"
                                />

                                <div className="title-information-right">
                                  <Title level={3}>
                                    {state &&
                                      state.hotelData &&
                                      state.hotelData.hotelName}
                                  </Title>
                                  <Text>
                                    {state &&
                                      state.basic_info &&
                                      state.basic_info.address &&
                                      `${state.basic_info.address.addressLine[0]}, ${state.basic_info.address.cityName}, ${state.basic_info.address.country.name}, ${state.basic_info.address.postalCode}`}
                                  </Text>
                                </div>
                              </div>

                              <div className="date-information">
                                <Title level={2}>{`${
                                  state &&
                                  state.reqData &&
                                  moment(
                                    state.reqData.startDate,
                                    "YYYY-MM-DD"
                                  ).format("DD MMM YYYY")
                                } - ${
                                  state &&
                                  state.reqData &&
                                  moment(
                                    state.reqData.endDate,
                                    "YYYY-MM-DD"
                                  ).format("DD MMM YYYY")
                                }`}</Title>
                                <p>
                                  {nights}
                                  Nights
                                </p>
                                <p>
                                  {state &&
                                    state.room &&
                                    state.room.roomType &&
                                    state.room.roomType.roomTypeCode &&
                                    state.room.roomType.roomTypeCode
                                      .roomTypeCategory}
                                  <Link to="#">Change</Link>
                                </p>
                              </div>

                              <div className="guests-information">
                                <p>
                                  {rooms} rooms,{" "}
                                  {state &&
                                    state.reqData &&
                                    state.reqData.rooms.length &&
                                    state.reqData.rooms[0].totalAdults}{" "}
                                  adults{" "}
                                </p>
                                <p>
                                  Max{" "}
                                  {state &&
                                    state.reqData &&
                                    state.reqData.rooms.length &&
                                    state.reqData.rooms[0].totalAdults}{" "}
                                  adults,{" "}
                                  {state &&
                                    state.reqData &&
                                    state.reqData.rooms.length &&
                                    state.reqData.rooms[0].totalChildren}{" "}
                                  children (2-11 years)
                                </p>
                                {state &&
                                state.reqData &&
                                state.reqData.breakfast ? (
                                  <p>
                                    <img
                                      src={require("../../../../../assets/images/icons/green-tick.svg")}
                                      alt="green-tick"
                                    />

                                    <span>Breakfast</span>
                                  </p>
                                ) : null}
                              </div>

                              <div className="information price-information">
                                <p>
                                  Price (
                                  {state &&
                                    state.reqData &&
                                    state.reqData.rooms.length}{" "}
                                  rooms x {nights} night)
                                </p>
                                <p>${roomRate}</p>
                              </div>

                              <div className="information payment-information">
                                <div>
                                  <p>Subtotal</p>
                                  <p>Taxes and surcharges</p>
                                  <p className="highlight">Total</p>
                                  <p className="small-text">
                                    Incl. taxes & fees
                                  </p>
                                </div>

                                <div>
                                  <p>${totalRate}</p>
                                  <p>${taxation}</p>
                                  <p className="highlight">
                                    ${(+totalRate + +taxation + +bp).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                htmlType="submit"
                                className="checkout-btn"
                                block
                                onClick={() => {
                                  // this.nextStep();
                                  // this.props.history.push("/booking-tourism-hotel-checkout")
                                }}
                              >
                                Checkout
                              </Button>
                            </div>
                          </Col>
                          {/* END - Hotel Your Booking Sidebar - 12/07/2021 */}
                        </Row>
                      </Form>
                    </div>
                  </div>
                </Content>
              </Layout>
            </Layout>
            {/* START - Flight Confirmation Modal - 05/07/2021 */}
            <div
              class="confirmation-modal-container"
              style={{ display: "none" }}
            >
              <Title>Purchase Complete!</Title>
              <Title level={3}>
                Your Melbourne - Japan return flight is confirmed.
              </Title>

              <div className="information">
                <Paragraph>
                  Your booking ID is <Link to="#">12345678</Link> . Please use
                  this booking ID for any communication with us.
                </Paragraph>
                <Text>We will email your ticket shortly.</Text>
              </div>

              <div class="information payment-information">
                <Paragraph>
                  Your payment of $248.00 was processed on 05/12/2019. Here is a
                  link to Receipt <Link to="#">#8458.pdf</Link> for your records
                </Paragraph>
              </div>

              <div className="button-container">
                <Button className="continue-button">Continue Browsing</Button>
                <Button className="go-home-button">Go to My Bookings</Button>
              </div>
            </div>
            {/* END - Flight Confirmation Modal - 05/07/2021 */}
          </Layout>
        )}
      </>
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
  getSportsCountryList,
  hotelMonoSearch,
  disableLoading,
  enableLoading,
})(withRouter(HotelBookingForm));

// export default HotelBookingForm;
