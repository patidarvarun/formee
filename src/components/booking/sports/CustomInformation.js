import React from "react";
import { connect } from "react-redux";
import {
  enableLoading,
  disableLoading,
  submitBookingTicketForm,
  getSportsCityList,
} from "../../../actions/index";
import { toastr } from "react-redux-toastr";
import {
  Layout,
  Row,
  Col,
  Typography,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Steps,
  Cascader,
  InputNumber,
  DatePicker,
} from "antd";
import history from "../../../common/History";
import "../booking.less";
import moment from "moment";
import { required, whiteSpace } from '../../../config/FormValidation';
const { Step } = Steps;
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

class CustomInformation extends React.Component {
  formRef = React.createRef();
  // formRef2 = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      email: null,
      phone: null,
      Country: null,
      ph: null,
      delivery: false,
      notes: null,
      agree: false,
      atendeecity: [],
    };
  }

  submitForm = () => {
    let _that = this;
    const { fullName, email, Country, phone, ph, delivery, notes, agree } =
      this.state;
    const { tournament, ticketData, qty } = this.props;
    console.log(
      "🚀 ~ file: CustomInformation.js ~ line 57 ~ CustomInformation ~ ticketData",
      ticketData
    );
    let deliveryCost =
      ticketData.shipping_methods &&
      ticketData.shipping_methods.ShippingType &&
      ticketData.shipping_methods.ShippingType.shipping_cost
        ? ticketData.shipping_methods.ShippingType.shipping_cost
        : 0;
    let attendeedetails = [];
    for (let i = 1; i <= qty; i++) {
      attendeedetails.push({
        nationality_country_id: this.state[`attendee${i}country`],
        city_of_birth: this.state[`attendee${i}city`]
          ? this.state[`attendee${i}city`]
          : "",
        passport_number: this.state[`attendee${i}passport`],
        birth_date: this.state[`attendee${i}birth_date`],
        full_name: this.state[`attendee${i}name`],
      });
    }
    // let reqData ={
    //   event_id: tournament.id,
    //   ciid: ticketData.ItemID,
    //   provshipid: ticketData.shipping_methods.ShippingType.provshipid,
    //   areaid: ticketData.shipping_methods.ShippingType.provship_cost.Rateslistshippingareas.areaid,
    //   fullName,
    //   email,
    //   phone,
    //   currency: ticketData.Currency || "AUD",
    //   totalPrice: (+qty * +ticketData.grossPrice.Price) + +ticketData.grossPrice.ServiceFee,
    //   qty: qty,
    //   delivery_cost: delivery ? 9 : 0,
    //   notes: notes || '',
    //   lead_customer: "Formee API",
    //   source: "FORMEE",
    //   Country: "Australlia"
    // };
    let reqData = {
      event_id: tournament.id,
      category_id: ticketData.ItemID,
      provshipid: ticketData.shipping_methods.ShippingType.provshipid,
      areaid:
        ticketData.shipping_methods.ShippingType.provship_cost
          .Rateslistshippingareas.areaid,
      fullName: "Formee Test",
      email: "ammar.rana@scei.edu.au",
      phone: "4564545646",
      currency: "AUD",
      totalPrice: +qty * +ticketData.Price + +deliveryCost,
      qty: qty,
      delivery_cost: delivery ? +deliveryCost : 0,
      notes: "Test Booking for Formee",
      lead_customer: "Formee API",
      source: "FORMEE",
      Country: Country || "Australia",
      attendees_details: attendeedetails,
    };
    console.log(
      "🚀 ~ file: CustomInformation.js ~ line 108 ~ CustomInformation ~ reqData",
      reqData
    );
    if (ticketData.immediate_confirmation == 1) {
      toastr.error("Error", "This Ticket can't be Booked at the moment");
    } else if (!agree) {
      toastr.error("Error", "You must agree to the Terms and Conditions.");
    } else if (!delivery) {
      toastr.error("Error", "You must add Delivery Charges.");
    } else {
      let res = {
        status: 200,
        data: {
          data: {
            APIOrdersResponse: {
              response: {
                result: 0,
                message: "Success",
              },
              purchaseDetails: {
                source: "FORMEE",
                orderid: 209794,
                w: 5278,
                eventid: 307259,
                eventName: "CSKA Moscow vs Unics Kazan",
                catalogid: 2873116,
                catalogName: "Behind the basket | 1st Ring",
                provshipid: 1006,
                provshipName: "E-Ticket",
                areaid: 0,
                areaName: "",
                delivery_cost: 8,
                shippingAddress: "",
                qty: 1,
                currency: "AUD",
                totalPrice: 80,
                totalPriceEntered: 80,
                immediate_confirmation: 0,
              },
              customerDetails: {
                fullName: "FORMEE API TEST",
                notes: "Test Booking for formee",
                email: "ammar.rana@scei.edu.au",
                phoneNumber: 4564545646,
                DateOfBirth: "",
                country: "Australlia",
                lead_customer: "Formee API",
              },
            },
          },
        },
      };
      // this.props.submitBookingTicketForm(reqData, (res) => {
        if (res.status == 200) {
          let customerDetails =
            res.data.data &&
            res.data.data.APIOrdersResponse &&
            res.data.data.APIOrdersResponse.customerDetails;
          let purchaseDetails =
            res.data.data &&
            res.data.data.APIOrdersResponse &&
            res.data.data.APIOrdersResponse.purchaseDetails;
          let response =
            res.data.data &&
            res.data.data.APIOrdersResponse &&
            res.data.data.APIOrdersResponse.response;
          _that.props.updateResponse(customerDetails, purchaseDetails);
          toastr.success("Success", response.message);
        }
      // })
    }
  };

  handleBlur = (e) => {
    this.setState({
      [`${e.target.name}`]: e.target.value,
    });
  };

  /**
   * @method selectedLocation
   * @description get selected location
   */
  selectedLocation = (value, i) => {
    if (value && value.length) {
      let country_id = value[0] ? value[0] : "";
      this.setState({ [`attendee${i + 1}country`]: value[0] });
      this.props.getSportsCityList({ countryid: country_id }, (res) => {
        if (res.status === 200) {
          let item =
            res.data.data && res.data.data.all && res.data.data.all.data
              ? res.data.data.all.data.item
              : "";
          let city = item && Array.isArray(item) ? item : [];
          let temp2 = [];
          city.length !== 0 &&
            city.map((el2, i) => {
              temp2.push({ value: el2.caption, label: el2.caption });
            });
          this.setState({
            atendeecity: temp2,
          });
        }
      });
    }
  };

  render() {
    const { tournament, ticketData, qty, location, atendeeCountry } =
      this.props;
    console.log(
      "🚀 ~ file: CustomInformation.js ~ line 158 ~ CustomInformation ~ render ~ tournament",
      tournament
    );
    const {
      fullName,
      email,
      Country,
      phone,
      ph,
      delivery,
      notes,
      agree,
      atendeecity,
    } = this.state;
    return (
      <>
        <Row>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            className="sportbooking-top"
          >
            <div className="thumb">
              <img src={tournament.image} alt="" />
            </div>
            <div className="sportbooking-content-top">
              <h3>{`${tournament.tournament}, ${tournament.caption}`}</h3>
              <div className="location">
                <span>Location</span>
                {`${tournament.venue}, ${tournament.city}, ${tournament.country}`}
              </div>
              <div className="date">
                <span>Date</span>
                {`${tournament.date}, ${moment(
                  new Date("1979-01-01 " + tournament.time_of_event)
                ).format("LT")}`}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={18}
            xl={18}
            className="sportbooking-left"
          >
            <Row className="">
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="Delivery-contact-outer"
              >
                <Title level={4} className="seat-arrangement">
                  Delivery and Contact Details
                </Title>
                <Form
                  ref={this.formRef}
                  name="deliver-contact"
                  className="ldeliver-contact"
                  layout={"inline"}
                  onFinish={(value) => {
                    console.log("🚀 ~ file: CustomInformation.js ~ line 302 ~ CustomInformation ~ render ~ value", value)
                    this.submitForm()
                  }}
                >
                  <div className="formtop">
                    <Row>
                      <Col>
                        <Form.Item
                          label={"Full name (in English)*"}
                          name={"name"}
                          rules={[required("Name")]}
                        >
                          <Input
                            name="fullName"
                            defaultValue={fullName}
                            onChange={this.handleBlur}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item label={"Email Adress*"} name={"email"} rules={[required("email")]}>
                          <Input
                            name="email"
                            defaultValue={email}
                            onChange={this.handleBlur}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="phoneno">
                        <Form.Item label={"Phone Number*"} name={"phonenumber"}>
                          <Select value={"+61"} className="phone-inner">
                            <Option value="+91">+91</Option>
                            <Option value="+61">+61</Option>
                          </Select>
                          <Form.Item name="mobile_no" className="phone"  rules={[required("Phone Number")]}>
                            <Input
                              className="pl-10"
                              style={{ width: "calc(100% - 0px)" }}
                              name="phone"
                              defaultValue={phone}
                              onChange={this.handleBlur}
                              // value={mobile_no}
                            />
                          </Form.Item>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="phoneno">
                        <Form.Item
                          label={"Phone number during trip?"}
                          name={"ph"}
                        >
                          <Select value={"+61"}>
                            <Option value="+91">+91</Option>
                            <Option value="+61">+61</Option>
                          </Select>
                          <Form.Item name="mobile" className="ph" rules={[required("Phone Number during trip")]}>
                            <Input
                              className="pl-10"
                              style={{ width: "calc(100% - 0px)" }}
                              name="ph"
                              defaultValue={ph}
                              onChange={this.handleBlur}
                              // value={mobile_no}
                            />
                          </Form.Item>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item label={"Country"} name={"country"} rules={[required("Country")]}>
                          <Cascader
                            name="Country"
                            defaultValue={Country}
                            options={location}
                            onChange={(value) =>
                              this.setState({
                                Country: value[0],
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <p>
                    Due to the League Association requirement, please provide
                    the following information for each person who will attend
                    the event. The order will not be completed should you fail
                    to provide it.
                  </p>
                  {Array.from(Array(qty), (e, i) => {
                    return (
                      <Row key={i + 1}>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          className="Delivery-contact-outer"
                        >
                          <Title level={4} className="seat-arrangement">
                            Attendee #{i + 1}
                          </Title>
                          <div
                            ref={this.formRef}
                            name="deliver-contact"
                            className="ldeliver-contact"
                            layout={"inline"}
                            onFinish={this.handleSearch}
                          >
                            <div className="formtop">
                              <Row>
                                <Col>
                                  <Form.Item
                                    label={"Full name (in English)*"}
                                    name={`attendee${i + 1}name`}
                                    rules={[required(`Attendee #${i + 1} Name`)]}
                                  >
                                    <Input
                                      name={`attendee${i + 1}name`}
                                      onChange={this.handleBlur}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Row>
                                <Col>
                                  <Form.Item
                                    label={"Passport"}
                                    name={`attendee${i + 1}passport`}
                                    rules={[required(`Attendee #${i + 1} Passport`)]}
                                  >
                                    <Input
                                      name={`attendee${i + 1}passport`}
                                      onChange={this.handleBlur}
                                      maxLength={9}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Row>
                                <Col>
                                  <Form.Item
                                    label={"Nationality"}
                                    name={`attendee${i + 1}country`}
                                    rules={[required(`Attendee #${i + 1} Country`)]}
                                  >
                                    <Cascader
                                      name={`attendee${i + 1}country`}
                                      options={atendeeCountry}
                                      onChange={(value) =>
                                        this.selectedLocation(value, i)
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Row>
                                <Col>
                                  <Form.Item
                                    label={"City of Birth"}
                                    name={`attendee${i + 1}city`}
                                  >
                                    <Cascader
                                      name={`attendee${i + 1}city`}
                                      options={atendeecity}
                                      onChange={(value) =>
                                        this.setState({
                                          [`attendee${i + 1}city`]: value[0],
                                        })
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Row>
                                <Col>
                                  <Form.Item
                                    label={"Birth Date"}
                                    name={`attendee${i + 1}birth_date`}
                                    rules={[required(`Attendee #${i + 1} Birth_date`)]}
                                  >
                                    <DatePicker
                                      name={`attendee${i + 1}birth_date`}
                                      format={"DD/MM/YYYY"}
                                      onChange={(date, dateString) => {
                                        console.log(
                                          "🚀 ~ file: CustomInformation.js ~ line 363 ~ CustomInformation ~ {Array.from ~ dateString",
                                          dateString
                                        );
                                        this.setState({
                                          [`attendee${i + 1}birth_date`]:
                                            dateString,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      className="border-bottom select-delivery"
                    >
                      <h3>Please select a delivery option</h3>
                      <span>
                        <input
                          type="checkbox"
                          name="delivery"
                          defaultChecked={delivery}
                          onChange={(e) =>
                            this.setState({ delivery: e.target.checked })
                          }
                        />
                        <label>
                          E-Ticket AUD $
                          {ticketData.shipping_methods &&
                          ticketData.shipping_methods.ShippingType &&
                          ticketData.shipping_methods.ShippingType.shipping_cost
                            ? ticketData.shipping_methods.ShippingType
                                .shipping_cost
                            : 0}
                        </label>
                      </span>
                      <span>
                        <div
                          ref={this.formRef}
                          name="deliver-contact"
                          className="message-option"
                          layout={"inline"}
                          onFinish={this.handleSearch}
                        >
                          <Row>
                            <Col>
                              <Form.Item
                                label={
                                  "Would you like to add a note ? ( optional )"
                                }
                                name={"message"}
                              >
                                <TextArea
                                  rows={4}
                                  name="notes"
                                  className="textrea-b"
                                  defaultValue={notes}
                                  onChange={this.handleBlur}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      </span>
                    </Col>
                  </Row>
                  <span class="agree">
                    <input
                      type="checkbox"
                      name="agree"
                      defaultChecked={agree}
                      onChange={(e) =>
                        this.setState({ agree: e.target.checked })
                      }
                    />
                    <label>
                      I agree to the Terms & Conditions and understand that my
                      information will be treated as described in this site
                      Privacy & Cookies Policy
                    </label>
                  </span>
                  <div className="button-box">
                    <Row>
                      <Col>
                        <Form.Item
                          style={{ textAlign: "center", marginTop: "45px" }}
                        >
                          <Button
                            size={"middle"}
                            className={"ticket-borderyellow"}
                          >
                            Cancel
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          style={{ textAlign: "center", marginTop: "45px" }}
                        >
                          <Button
                            htmlType="submit"
                            size={"middle"}
                            className={"ticket-largeyellow"}
                            // onClick={(e) => this.submitForm()}
                          >
                            Continue
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={6}
            xl={6}
            className="sportbooking-right pl-15"
          >
            <div className="sidebar">
              <h2 className="bottom-bottom">Your Booking</h2>
              <div className="ticket-category">
                <h4>Ticket Category</h4>
                <Row className="border-bottom">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={20}
                    xl={20}
                    className=" select-delivery"
                  >
                    {" "}
                    {ticketData.Section}{" "}
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={4}
                    xl={4}
                    className=" select-delivery"
                  >
                    {" "}
                    ${ticketData.grossPrice.Price}
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={20}
                    xl={20}
                    className=" select-delivery"
                  >
                    {" "}
                    <InputNumber
                      min={1}
                      max={ticketData.max_qty}
                      defaultValue={qty}
                      onChange={this.props.qtyOnChange}
                    />{" "}
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={4}
                    xl={4}
                    className=" select-delivery"
                  >
                    {" "}
                    ${+qty * +ticketData.grossPrice.Price}
                  </Col>
                </Row>

                <Row className="border-bottom">
                  <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                    {" "}
                    <b>Subtotal</b>{" "}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    {" "}
                    <b>${+qty * +ticketData.grossPrice.Price}</b>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                    {" "}
                    Service fee{" "}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    {" "}
                    ${ticketData.grossPrice.ServiceFee}
                  </Col>

                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={20}
                    xl={20}
                    className=" Total mt-10"
                  >
                    {" "}
                    <b>Total</b> <br /> Incl. taxes & fees{" "}
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={4}
                    xl={4}
                    className=" select-delivery mt-10"
                  >
                    {" "}
                    <b>
                      $
                      {+qty * +ticketData.grossPrice.Price +
                        +ticketData.grossPrice.ServiceFee}
                    </b>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {" "}
                    <span>
                      {" "}
                      Immediate Confirmation tickets are automatically confirmed
                      once completing the order unless you have a special
                      request.{" "}
                    </span>{" "}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {" "}
                    <span> Orders are final and cannot be canceled.</span>{" "}
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth, bookings } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  submitBookingTicketForm,
  getSportsCityList,
})(CustomInformation);
