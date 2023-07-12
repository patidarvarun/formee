import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import AppSidebar from "../common/Sidebar";
import {
  Layout,
  Row,
  Col,
  Typography,
  Tabs,
  Card,
  Button,
  Breadcrumb,
  Divider,
  Input,
  Form,
  Collapse,
  InputNumber,
  Select,
  DatePicker,
  Space,
  Checkbox,
  Radio,
} from "antd";
import {
  LeftOutlined,
  LockOutlined,
  CheckOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/booking-form.less";
import TopBackWithTitle from "../../common/TopBackWithTitle";
import TourismSteps from "../../common/TourismSteps";
const { Content } = Layout;
const { Option } = Select;

const { Title, Paragraph, Text } = Typography;

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

function onChange(date, dateString) {
  console.log(date, dateString);
}
class BookingForm extends React.Component {
  render() {
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing booking-tourism-checkout-box">
        <Layout className="yellow-theme common-left-right-padd">
          <TopBackWithTitle />
          <Layout className="right-parent-block inner-content-wrap">
            {/* <div className="inner-banner custom-inner-banner">
              <SubHeader categoryName={TEMPLATE.HANDYMAN} showAll={true} />
              <CarouselSlider bannerItem={topImages} pathName="/" />
            </div> */}
            <Content className="site-layout tourism-booking-form-box">
              <TourismSteps />
              <div className="booking-tourism-box">
                <div>
                  {/* START - Heading and Contact Information box - 03/07/2021 */}
                  <div className="page-heading-container">
                    <h2>Travellers</h2>
                    <p>
                      <Text type="danger">* = mandatory fields</Text>
                    </p>
                    <p>
                      Please ensure that names entered match passport and/or
                      photo identification or boarding maybe denied
                    </p>
                  </div>
                  <Row gutter={16}>
                    <Col md={16}>
                      <div className="contact-information-container">
                        <div className="contact-information-heading">
                          <h2>
                            <img
                              src={require("../../../../../assets/images/icons/email-orange.svg")}
                              alt="airline-logo"
                            />
                            Contact information for all passengers
                          </h2>
                        </div>
                        <div className="contact-information-form">
                          <Form layout="vertical">
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

                              <Col md={4}>
                                <Form.Item
                                  label="Mobile Phone: "
                                  name="mobile phone"
                                //  rules={[{ required: true }]}
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
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </div>
                      <div className="booking-form-box">
                        <Collapse
                          className="passenger-form-collapse"
                          defaultActiveKey={["1"]}
                          onChange={callback}
                        >
                          <Panel
                            header={
                              <div className="d-flex">
                                <img
                                  src={require("../../../../../assets/images/icons/user-default-preview.svg")}
                                  alt="user-default-preview"
                                />
                                <p>Adult 1</p>
                              </div>
                            }
                            key="2"
                          >
                            <div className="passenger-booking-form">
                              <Form layout="vertical">
                                <Row gutter={16}>
                                  <Col md={24}>
                                    <Form.Item
                                      label="Title:"
                                      name="title"
                                      rules={[{ required: true }]}
                                    >
                                      <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                          option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                          optionA.children
                                            .toLowerCase()
                                            .localeCompare(
                                              optionB.children.toLowerCase()
                                            )
                                        }
                                      >
                                        <Option value="1">
                                          Not Identified
                                        </Option>
                                        <Option value="2">Closed</Option>
                                        <Option value="3">Communicated</Option>
                                        <Option value="4">Identified</Option>
                                        <Option value="5">Resolved</Option>
                                        <Option value="6">Cancelled</Option>
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row gutter={16}>
                                  <Col md={8}>
                                    <Form.Item
                                      label="First / Given name: "
                                      name="firstname"
                                      rules={[{ required: true }]}
                                    >
                                      <Input placeholder="..." />
                                    </Form.Item>
                                  </Col>
                                  <Col md={8}>
                                    <Form.Item
                                      label="Middle name: "
                                      name="middlename"
                                      rules={[{ required: true }]}
                                    >
                                      <Input placeholder="..." />
                                    </Form.Item>
                                  </Col>
                                  <Col md={8}>
                                    <Form.Item
                                      label="Last name:"
                                      name="lastename"
                                      rules={[{ required: true }]}
                                    >
                                      <Input placeholder="..." />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row gutter={16}>
                                  {/* <Row gutter={16}> */}
                                  <Col md={7}>
                                    <Form.Item
                                      label="Nationality:"
                                      name="nationality"
                                      rules={[{ required: true }]}
                                    >
                                      <Select
                                        showSearch
                                        placeholder="..."
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                          option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                          optionA.children
                                            .toLowerCase()
                                            .localeCompare(
                                              optionB.children.toLowerCase()
                                            )
                                        }
                                      >
                                        <Option value="1">
                                          Not Identified
                                        </Option>
                                        <Option value="2">Closed</Option>
                                        <Option value="3">Communicated</Option>
                                        <Option value="4">Identified</Option>
                                        <Option value="5">Resolved</Option>
                                        <Option value="6">Cancelled</Option>
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col md={5}>
                                    <Form.Item
                                      label="Gender:"
                                      name="gender"
                                      rules={[{ required: true }]}
                                    >
                                      <Select
                                        showSearch
                                        placeholder="..."
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                          option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                          optionA.children
                                            .toLowerCase()
                                            .localeCompare(
                                              optionB.children.toLowerCase()
                                            )
                                        }
                                      >
                                        <Option value="1">
                                          Not Identified
                                        </Option>
                                        <Option value="2">Closed</Option>
                                        <Option value="3">Communicated</Option>
                                        <Option value="4">Identified</Option>
                                        <Option value="5">Resolved</Option>
                                        <Option value="6">Cancelled</Option>
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col md={12}>
                                    <Col md={24} style={{ paddingLeft: "0" }}>
                                      <lable style={{ fontFamily: "Poppins" }}>
                                        Date of birth:
                                        <span style={{ color: "red" }}>*</span>
                                      </lable>
                                    </Col>
                                    <Row className="date-month-year-box">
                                      <Col md={7}>
                                        <Form.Item
                                          // label="Date of birth"
                                          name="date-of-birth"
                                          className="date-of-birth"
                                          rules={[{ required: true }]}
                                        >
                                          <Input placeholder="DD" />
                                        </Form.Item>
                                      </Col>
                                      <Col md={10}>
                                        <Form.Item
                                          // label="Title:"
                                          name="title"
                                          className="month-of-birth"
                                          rules={[{ required: true }]}
                                        >
                                          <Select
                                            showSearch
                                            // style={{ width: 200 }}
                                            placeholder="Month"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                              0
                                            }
                                            filterSort={(optionA, optionB) =>
                                              optionA.children
                                                .toLowerCase()
                                                .localeCompare(
                                                  optionB.children.toLowerCase()
                                                )
                                            }
                                          >
                                            <Option value="1">
                                              Not Identified
                                            </Option>
                                            <Option value="2">Closed</Option>
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col md={7}>
                                        <Form.Item
                                          // label="Date of birth"
                                          name="date-of-birth"
                                          className="year-of-birth"
                                          rules={[{ required: true }]}
                                        >
                                          <Space direction="vertical">
                                            <DatePicker
                                              onChange={onChange}
                                              picker="year"
                                              placeholder="Year"
                                            />
                                          </Space>
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </Col>
                                  {/* </Row> */}
                                </Row>
                                <Row gutter={16}>
                                  <Col md={12}>
                                    <Form.Item
                                      label="Passport or ID number"
                                      name="Passport-id-no"
                                      rules={[{ required: true }]}
                                    >
                                      <Input placeholder="..." />
                                    </Form.Item>
                                  </Col>
                                  <Col md={12}>
                                    <Col md={24}>
                                      <Col md={24} style={{ paddingLeft: "0" }}>
                                        <lable
                                          style={{ fontFamily: "Poppins" }}
                                        >
                                          Date of birth:
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </lable>
                                      </Col>
                                      <Row className="date-month-year-box">
                                        <Col md={7}>
                                          <Form.Item
                                            // label="Date of birth"
                                            name="date-of-birth"
                                            className="date-of-birth"
                                            rules={[{ required: true }]}
                                          >
                                            <Input placeholder="DD" />
                                          </Form.Item>
                                        </Col>
                                        <Col md={10}>
                                          <Form.Item
                                            // label="Title:"
                                            name="title"
                                            className="month-of-birth"
                                            rules={[{ required: true }]}
                                          >
                                            <Select
                                              showSearch
                                              // style={{ width: 200 }}
                                              placeholder="Month"
                                              optionFilterProp="children"
                                              filterOption={(input, option) =>
                                                option.children
                                                  .toLowerCase()
                                                  .indexOf(
                                                    input.toLowerCase()
                                                  ) >= 0
                                              }
                                              filterSort={(optionA, optionB) =>
                                                optionA.children
                                                  .toLowerCase()
                                                  .localeCompare(
                                                    optionB.children.toLowerCase()
                                                  )
                                              }
                                            >
                                              <Option value="1">
                                                Not Identified
                                              </Option>
                                              <Option value="2">Closed</Option>
                                            </Select>
                                          </Form.Item>
                                        </Col>
                                        <Col md={7}>
                                          <Form.Item
                                            // label="Date of birth"
                                            name="date-of-birth"
                                            className="year-of-birth"
                                            rules={[{ required: true }]}
                                          >
                                            <Space direction="vertical">
                                              <DatePicker
                                                onChange={onChange}
                                                picker="year"
                                                placeholder="Year"
                                              />
                                            </Space>
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                      <Col
                                        md={24}
                                        style={{
                                          paddingLeft: "25px",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        <lable
                                          style={{ fontFamily: "Poppins" }}
                                        >
                                          No expiry
                                        </lable>
                                      </Col>
                                    </Col>
                                  </Col>
                                </Row>
                              </Form>
                            </div>
                            <div className="collapse-footer">
                              <Collapse
                                defaultActiveKey={["1"]}
                                onChange={callback}
                              >
                                <Panel
                                  header={
                                    <div className="d-flex">
                                      <img
                                        src={require("../../../../../assets/images/icons/blue-flight-star.svg")}
                                        alt="blue-flight-star"
                                      />
                                      <p>Add Frequent Flyer Number</p>
                                    </div>
                                  }
                                  key="2"
                                >
                                  <Form layout="vertical">
                                    <Row gutter={16}>
                                      <Col md={12} className="label-height">
                                        <Form.Item
                                          label="Card Type:"
                                          rules={[{ required: true }]}
                                        >
                                          <Select
                                            showSearch
                                            placeholder="Select card type"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                              0
                                            }
                                            filterSort={(optionA, optionB) =>
                                              optionA.children
                                                .toLowerCase()
                                                .localeCompare(
                                                  optionB.children.toLowerCase()
                                                )
                                            }
                                          >
                                            <Option value="1">
                                              Not Identified
                                            </Option>
                                            <Option value="2">Closed</Option>
                                            <Option value="3">
                                              Communicated
                                            </Option>
                                            <Option value="4">
                                              Identified
                                            </Option>
                                            <Option value="5">Resolved</Option>
                                            <Option value="6">Cancelled</Option>
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col md={11}>
                                        <Form.Item label="Card Number:">
                                          <Input placeholder="..." />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </Form>
                                </Panel>
                              </Collapse>
                            </div>
                          </Panel>
                        </Collapse>
                      </div>
                      <Title level={3} className="add-ons">
                        Add-ons
                      </Title>
                      <div className="card-container baggage-box">
                        <Title level={3}>Baggage</Title>
                        <Row className="card-information">
                          <Col md={4}>
                            <img
                              src={require("../../../../../assets/images/baggage.svg")}
                              alt="baggage"
                            />
                            <Link to="#" className="bggage-info">
                              Baggage info
                            </Link>
                          </Col>
                          <Col md={20} className="card-information-right">
                            <Row gutter={10}>
                              <Col lg={12}>
                                <Title level={4} className="top-col-heading">
                                  Flight included
                                </Title>
                                <div className="d-flex">
                                  <label>Departing</label>
                                  <div className="d-flex">
                                    <label className="bold">Melbourne</label>
                                    <img
                                      src={require("../../../../../assets/images/icons/arrow-right.svg")}
                                      alt="arrow-right"
                                      className="right-arrow"
                                    />
                                    <label className="bold">Narita</label>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <label>Departing</label>
                                  <div className="d-flex">
                                    <label className="bold">Melbourne</label>
                                    <img
                                      src={require("../../../../../assets/images/icons/arrow-right.svg")}
                                      alt="arrow-right"
                                      className="right-arrow"
                                    />
                                    <label className="bold">Narita</label>
                                  </div>
                                </div>
                              </Col>
                              <Col lg={6}>
                                <Title level={4} className="top-col-heading">
                                  Carry-On
                                </Title>
                                <p>7kg carry-on baggage All Passengers</p>
                                <p>7kg carry-on baggage All Passengers</p>
                              </Col>
                              <Col lg={6}>
                                <Title level={4} className="top-col-heading">
                                  Checked
                                </Title>
                                <p>30Kg checked All Passengers</p>
                                <p>30Kg checked All Passengers</p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <div className="item-weight-detail-box">
                          <Title level={4} className="heading">
                            On this trip you are allowed 30 kg
                          </Title>
                          <div className="d-flex pl-45">
                            <div className="item-weight-box">
                              <Radio.Group name="radiogroup">
                                <Radio value={1}>
                                  <div className="radio-inner-data">
                                    <div className="weight-an-price-box">
                                      <Title level={4}>+10 kg</Title>
                                      <span className="price-doller">+$76</span>
                                      <span clasName="person">per person</span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="adults">Adults</span>
                                      <div className="counter-box">
                                        <img
                                          src={require("../../../../../assets/images/icons/minus-icons-grey.svg")}
                                          alt="minus-icons-grey"
                                        />
                                        <span className="counter-digit">0</span>
                                        <img
                                          src={require("../../../../../assets/images/icons/plus-icons-grey.svg")}
                                          alt="plus-icons-grey"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Radio>
                                <Radio value={2}>
                                  <div className="radio-inner-data">
                                    <div className="weight-an-price-box">
                                      <Title level={4}>+15 kg</Title>
                                      <span className="price-doller">
                                        +$129
                                      </span>
                                      <span clasName="person">per person</span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="adults">Adults</span>
                                      <div className="counter-box">
                                        <img
                                          src={require("../../../../../assets/images/icons/minus-icons-grey.svg")}
                                          alt="minus-icons-grey"
                                        />
                                        <span className="counter-digit">0</span>
                                        <img
                                          src={require("../../../../../assets/images/icons/plus-icons-grey.svg")}
                                          alt="plus-icons-grey"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Radio>
                                <Radio value={3}>
                                  <div className="radio-inner-data">
                                    <div className="weight-an-price-box">
                                      <Title level={4}>+20 kg</Title>
                                      <span className="price-doller">
                                        +$129
                                      </span>
                                      <span clasName="person">per person</span>
                                    </div>
                                    <div className="d-flex">
                                      <span className="adults">Adults</span>
                                      <div className="counter-box">
                                        <img
                                          src={require("../../../../../assets/images/icons/minus-icons-grey.svg")}
                                          alt="minus-icons-grey"
                                        />
                                        <span className="counter-digit">0</span>
                                        <img
                                          src={require("../../../../../assets/images/icons/plus-icons-grey.svg")}
                                          alt="plus-icons-grey"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Radio>
                              </Radio.Group>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* START - Seat Selection, Food Drink, FLexible Flight, Confirmation, Apply Promo Boxes  - 05/07/2021 */}
                      <div className="card-container">
                        <Title level={3}>Seat Selection</Title>
                        <div className="card-information">
                          <img
                            src={require("../../../../../assets/images/seat-selection.svg")}
                            alt="seat with window"
                          />
                          <div className="card-information-right">
                            <Title level={4}>Free</Title>
                            <Paragraph>
                              Nice, this itinerary offers you a seat selection
                              for free! If you don't select a seat now, the
                              airline may randomly assign you a seat or allow
                              you to choose from remaining seats when you check
                              in.
                            </Paragraph>
                            <Button>Select Seats</Button>
                          </div>
                        </div>
                      </div>

                      <div className="card-container">
                        <Title level={3}>Food and Drink</Title>
                        <div className="card-information">
                          <img
                            src={require("../../../../../assets/images/seat-selection.svg")}
                            alt=""
                          />
                          <div className="card-information-right">
                            <Title level={4}>Flight included</Title>
                            <Paragraph>
                              Your bundle fare for this flight already includes
                              an in-flight meal deal to use on board, or a snack
                              or light meal. You can select meals in advance
                              here
                            </Paragraph>
                            <Button>Pre order</Button>
                          </div>
                        </div>
                      </div>

                      <div className="card-container travel-insurance-box">
                        <Title level={3}>
                          Travel Insurance
                          <span className="imp-tag">Important</span>
                        </Title>
                        <Row className="card-information">
                          <Col lg={3}>
                            <div className="travel-insurance-pic-box">
                              <img
                                src={require("../../../../../assets/images/travel-insurance.svg")}
                                alt="travel-insurance"
                                width="74"
                              />
                              <img
                                src={require("../../../../../assets/images/company-name.jpg")}
                                alt="company-name"
                                width="50"
                                style={{ paddingLeft: "6px" }}
                              />
                            </div>
                          </Col>

                          <Col lg={21}>
                            <div className="card-information-right">
                              <span level={4} className="buy-trip-heading">
                                Buy trip cancellation & luggage cover benefits
                                for your trip?
                              </span>
                              <div className="d-flex">
                                <div className="item-weight-box">
                                  <Radio.Group name="radiogroup">
                                    <Radio value={1}>
                                      <div className="radio-inner-data">
                                        <div className="weight-an-price-list">
                                          <div className="d-flex">
                                            <Title level={3}>
                                              Yes, I'd like to buy travel
                                              insurance
                                            </Title>
                                            <span className="price-doller">
                                              +$76
                                            </span>
                                          </div>
                                          <span className="list">
                                            <p>Insurance benefits include:</p>
                                            <ul>
                                              <li>
                                                <img
                                                  src={require("../../../../../assets/images/icons/green-check.svg")}
                                                  alt="green-check"
                                                />
                                                <span>
                                                  Lorem ipsum dolor sit amet,
                                                  consectetur adipiscing elit.
                                                </span>
                                              </li>
                                              <li>
                                                <img
                                                  src={require("../../../../../assets/images/icons/green-check.svg")}
                                                  alt="green-check"
                                                />
                                                <span>
                                                  {" "}
                                                  Purus, eu donec egestas orci.
                                                  Neque aenean eleifend euismod
                                                  felis.
                                                </span>
                                              </li>
                                              <li>
                                                <img
                                                  src={require("../../../../../assets/images/icons/green-check.svg")}
                                                  alt="green-check"
                                                />
                                                <span>
                                                  {" "}
                                                  Diam ut habitant sed fermentum
                                                  iaculis. Amet neque lacus in
                                                  duis.{" "}
                                                </span>
                                              </li>
                                            </ul>
                                          </span>
                                        </div>
                                        <div className="bottom-box">
                                          <div className="d-flex">
                                            <span className="adults">
                                              Adults
                                            </span>
                                            <div className="counter-box">
                                              <img
                                                src={require("../../../../../assets/images/icons/minus-icons-grey.svg")}
                                                alt="minus-icons-grey"
                                              />
                                              <span className="counter-digit">
                                                0
                                              </span>
                                              <img
                                                src={require("../../../../../assets/images/icons/plus-icons-grey.svg")}
                                                alt="plus-icons-grey"
                                              />
                                            </div>
                                          </div>
                                          <div className="d-flex">
                                            <span className="adults">
                                              Children (Age 2-11)
                                            </span>
                                            <div className="counter-box">
                                              <img
                                                src={require("../../../../../assets/images/icons/minus-icons-grey.svg")}
                                                alt="minus-icons-grey"
                                              />
                                              <span className="counter-digit">
                                                0
                                              </span>
                                              <img
                                                src={require("../../../../../assets/images/icons/plus-icons-grey.svg")}
                                                alt="plus-icons-grey"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Radio>
                                    <Radio
                                      value={2}
                                      className="bottom-radio-no-more-info"
                                    >
                                      <div className="radio-inner-data">
                                        <div className="weight-an-price-box">
                                          <Title level={4}>
                                            <span>No,</span> I don’t want to buy
                                            travel insurance.
                                          </Title>
                                        </div>
                                      </div>
                                    </Radio>
                                  </Radio.Group>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="card-container cancel-protect-box">
                        <Title level={3}>Cancellation Protection</Title>
                        <div className="card-information">
                          <img
                            src={require("../../../../../assets/images/cancel-protection.svg")}
                            alt="cancel-protection"
                          />
                          <div className="card-information-right">
                            <div className="cancel-protect-body">
                              <Row className="custom-row">
                                <Col md={20}>
                                  <p>
                                    Cancellation Protection is a money
                                    back-guarantee even if you cancel your trip
                                    up to two hours before departure.
                                    <br />
                                    <br />
                                    It guarantees you a refund if you cannot
                                    travel for any valid reason, including
                                    COVID-19
                                  </p>
                                </Col>
                                <Col md={4}>
                                  <span className="cancel-charge">
                                    +$76/leg
                                  </span>
                                </Col>
                              </Row>
                              <Radio.Group name="radiogroup">
                                <Radio value={2} className="deny">
                                  No
                                </Radio>
                                <Radio value={1}>Yes</Radio>
                              </Radio.Group>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card-container flexible-ticket-box">
                        <Title level={3}>Flexible Ticket</Title>
                        <div className="card-information">
                          <img
                            src={require("../../../../../assets/images/aeroplane-hand.svg")}
                            alt="aeroplan in hands"
                          />
                          <div className="inner-card">
                            <Paragraph>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Ut fringilla mauris cras sed. Velit,
                              malesuada curabitur vel adipiscing risus,
                              volutpat, lectus. In mi scelerisque facilisis
                              commodo eu pulvinar libero in. Suspendisse nunc
                              sollicitudin iaculis lectus nunc adipiscing netus.
                            </Paragraph>

                            <div className="selection-div">
                              <Select
                                placeholder="Choose"
                                className="combobox"
                              ></Select>
                              <p className="selection-div-right">
                                From
                                <Text className="highlight"> +6.95</Text>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="information-box confirmation-box">
                        <Title level={4}>Please confirm</Title>
                        <Checkbox>
                          I have checked to ensure that all names, including
                          titles, entered above are correct as per the passport
                          and/or photo identification for all passengers, and
                          have checked to ensure that dates, times, and flights
                          are correct.
                        </Checkbox>
                      </div>

                      <div className="information-box promo-box">
                        <p>Do you have code promo?</p>
                        <div className="promo-box-right">
                          <Input placeholder="Enter promotion code" />
                          <Button className="apply-btn">Apply</Button>
                        </div>
                      </div>
                      {/* END - Seat Selection, Food Drink, FLexible Flight, Confirmation, Apply Promo Boxes  - 05/07/2021 */}
                    </Col>
                    {/* START - YOUR BOOKING RIGHT SIDEBAR COMPONENT - 02/07/2021 */}
                    <Col md={8}>
                      <div className="tourism-right-your-booking-box">
                        <Title level={2}>Your Booking</Title>
                        <Divider />
                        <Title level={3}>
                          <img
                            src={require("../../../../../assets/images/icons/aeroplane-depart.svg")}
                            alt="airline-logo"
                          />
                          Departing
                        </Title>
                        <div className="departure-information">
                          <div className="airport-information">
                            <p className="highlight">MEL</p>
                            <p>Melbourne Airport</p>
                            <p>Terminal 1</p>
                            <p className="highlight">12:50 am</p>
                            <p>Wed, 29 Jan 2020</p>
                          </div>

                          <div className="arrow">
                            <img
                              src={require("../../../../../assets/images/icons/arrow-right.svg")}
                              alt="airline-logo"
                            />
                          </div>

                          <div className="airport-information">
                            <p className="highlight">NRT</p>
                            <p>Narita Airport</p>
                            <p>Terminal 3</p>
                            <p className="highlight">5:50 pm</p>
                            <p>Thu, 30 Jan 2020</p>
                          </div>
                        </div>

                        <div className="flight-information">
                          <div className="img-container">
                            <img
                              src={require("../../../../../assets/images/airline-logo.jpg")}
                              alt="airline-logo"
                            />
                          </div>
                          <div className="flight-info">
                            <p className="highlight">QT200</p>
                            <p>Qantas, Airbus A330-300</p>
                            <p>1 piece of checked baggage included</p>
                            <p>
                              Duration <span className="highlight">7h 10m</span>
                            </p>
                          </div>
                        </div>

                        <Divider />

                        <Title level={3}>
                          <img
                            src={require("../../../../../assets/images/icons/aeroplane-return.svg")}
                            alt="airline-logo"
                          />
                          Returning
                        </Title>

                        <div className="returning-information">
                          <div className="airport-information">
                            <p className="highlight">NRT</p>
                            <p>Narita Airport</p>
                            <p>Terminal 3</p>
                            <p className="highlight">5:50 pm</p>
                            <p>Thu, 30 Jan 2020</p>
                          </div>
                          <div className="arrow">
                            <img
                              src={require("../../../../../assets/images/icons/arrow-right.svg")}
                              alt="airline-logo"
                            />
                          </div>

                          <div className="airport-information">
                            <p className="highlight">MEL</p>
                            <p>Melbourne Airport</p>
                            <p>Terminal 1</p>
                            <p className="highlight">12:50 am</p>
                            <p>Wed, 29 Jan 2020</p>
                          </div>
                        </div>

                        <div className="flight-information">
                          <div className="img-container">
                            <img
                              src={require("../../../../../assets/images/airline-logo.jpg")}
                              alt="airline-logo"
                            />
                          </div>
                          <div className="flight-info">
                            <p className="highlight">QT200</p>
                            <p>Qantas, Airbus A330-300</p>
                            <p>1 piece of checked baggage included</p>
                            <p>
                              Duration <span className="highlight">7h 10m</span>
                            </p>
                          </div>
                        </div>

                        <Divider />
                        <div className="passenger-information">
                          <p>
                            <span className="highlight">2 Adults</span>Economy
                            class
                          </p>
                          <p>$1,278.66</p>
                        </div>

                        <Divider />
                        <div className="payment-information">
                          <div>
                            <p>Subtotal</p>
                            <p>Taxes and surcharges</p>
                            <p className="highlight">Total</p>
                            <p className="small-text">Incl. taxes & fees</p>
                          </div>

                          <div>
                            <p>$1,278.66</p>
                            <p>$25.00</p>
                            <p className="highlight">$1,264.86</p>
                          </div>
                        </div>
                        <Button type="primary" block>
                          Checkout
                        </Button>
                      </div>
                    </Col>
                    {/* END - YOUR BOOKING RIGHT SIDEBAR COMPONENT - 02/07/2021 */}
                  </Row>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default BookingForm;
