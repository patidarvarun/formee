import React from "react";
import { Link } from "react-router-dom";
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
  Select,
  Checkbox,
  Cascader,
} from "antd";
import CarBookingDetailBlock from "./CarBookingBlock";
import {
  postCarDriverDetails,
  getSportsCountryList,
  enableLoading,
  disableLoading,
} from "../../../../../actions";
import {
  validMobile9,
  required,
  email,
} from "../../../../../config/FormValidation";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/booking-form.less";
import "./car-checkout.less";
const { Content } = Layout;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

class CarBookingForm extends React.Component {
  formRef = React.createRef();
  state= {
    terms: undefined,
    location: [],
  }

componentWillMount = () => {
  this.props.getSportsCountryList(res => {
    if(res.status === 200){
        let item = res.data && res.data.data.all && res.data.data.all.data ? res.data.data.all.data.item : ''
        let data = item  && Array.isArray(item) ? item : []
        if(data.length){
            this.getCountry(data)
        }
    }
})
}

/**
    * @method getCountry
    * @description get country
    */
 getCountry = (country) => {
  let temp = []
  country && country.length !== 0 && country.map((el, i) => {
      temp.push({value: el.caption, label: el.caption})
  })
  this.setState({location: temp})
  // this.props.setCountry(temp)
}

  onFinish = (value) => {
    if(this.state.terms === undefined){
      this.setState({
        terms: false
      })
    }else if(this.state.terms === true){
    this.props.enableLoading();
    const {
      selectedCar,
      car_reqdata,
      carSearchRecords,
      step1Data,
    } = this.props;
    let search_data = car_reqdata && car_reqdata.reqData;
    let data = selectedCar && selectedCar.selected_car;
    let reqData = {
      cityCode: data && data.pickupLocation ? data.pickupLocation.state : "",
      startDate: search_data && search_data.startDate,
      endDate: search_data && search_data.endDate,
      pickupLocation: search_data && search_data.pick_up_location,
      dropoffLocation:
        search_data && search_data.drop_up_location
          ? search_data.drop_up_location
          : search_data.pick_up_location,
      isSamePickAndDrop: search_data && search_data.isSamePickAndDrop,
      pickupLocationLat: search_data && search_data.pickupLocationLat,
      pickupLocationLng: search_data && search_data.pickupLocationLng,
      dropoffLocationLat: search_data && search_data.dropoffLocationLat,
      dropoffLocationLng: search_data && search_data.dropoffLocationLng,
      param: data.param,
      sessionId: carSearchRecords && carSearchRecords.sessionId,
      age: value.age,
      firstName: value.firstname,
      lastName: value.lastename,
      phone: value.phone_number,
      email: value.email_address,
      country: value['country-of-residence'],
      specialEquipmnts: [],
    };
    this.props.postCarDriverDetails(reqData, (res) => {
      this.props.disableLoading();
      if(res.status == 200){
        this.props.changeNextStep(2, {pnr: res.data.pnrNumber, filledData: reqData})
      }
      // else{
      //   this.props.changeNextStep(2, {pnr: "1g6yth", filledData: reqData})
      // }
    });
    }
  };

  render() {
    const { selectedCar } = this.props;
    const { terms, location} = this.state;
    return (
      <div className="tourism-booking-form-box tourism-car-detail-box">
        <div className="booking-tourism-box">
          <div>
            {/* START - Heading and Contact Information box - 03/07/2021 */}
            <div className="page-heading-container">
              <h2>Travellers</h2>
              <p>
                <Text type="danger">* = mandatory fields</Text>
              </p>
              <p>
                Please ensure that names entered match passport and/or photo
                identification or boarding maybe denied
              </p>
            </div>
            <Form
              layout="vertical"
              onFinish={this.onFinish}
              id={"car-checkout-form"}
              ref={this.formRef}
            >
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
                      <Row gutter={16}>
                        <Col md={12}>
                          <Form.Item
                            label="Email: "
                            name="email"
                            rules={[required(""), email]}
                          >
                            <Input placeholder="..." />
                          </Form.Item>
                        </Col>

                        <Col md={4}>
                          <Form.Item
                            label="Mobile Phone: "
                            name="mobile phone"
                          //  rules={[required("")]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              placeholder="+61 Aust..."
                              value={'+61'}
                              disabled={true}
                            >
                              <Option value="61">61+</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col md={8} className="label-height">
                          <Form.Item
                            label="Mobile Phone: "
                            name={"number"}
                            rules={[{ validator: validMobile9 }]}
                          >
                            <Input placeholder="Incase we need to reach you" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="booking-form-box">
                    <Collapse
                      className="passenger-form-collapse"
                      defaultActiveKey={["1"]}
                    >
                      <Panel
                        header={
                          <div className="d-flex">
                            <img
                              src={require("../../../../../assets/images/icons/user-default-preview.svg")}
                              alt="user-default-preview"
                            />
                            <p>Driver Details</p>
                          </div>
                        }
                        key="1"
                      >
                        <div className="passenger-booking-form">
                          <Row gutter={16}>
                            <Col md={12}>
                              <Form.Item
                                label="Title:"
                                name="title"
                                rules={[[required("")]]}
                              >
                                <Select
                                  showSearch
                                  style={{ width: 200 }}
                                  placeholder="Select"
                                >
                                  <Option value="Ms">Ms</Option>
                                  <Option value="Miss">Miss</Option>
                                  <Option value="Mrs">Mrs</Option>
                                  <Option value="Mr">Mr</Option>
                                  <Option value="Dr">Dr</Option>
                                  <Option value="Prof">Prof</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col md={12}>
                              <Form.Item
                                label="Age:"
                                name="age"
                                rules={[required("")]}
                              >
                                <Select
                                  showSearch
                                  // style={{ width: 200 }}
                                  placeholder="Select"
                                >
                                  {[...Array.from({length: 52}, (_, i) => i + 18)].map((e, i) => 
                                  <Option key={i} value={e}>{e}</Option>
                                  )}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col md={12}>
                              <Form.Item
                                label="First Name: "
                                name="firstname"
                                rules={[required("")]}
                              >
                                <Input placeholder="..." />
                              </Form.Item>
                            </Col>
                            <Col md={12}>
                              <Form.Item
                                label="Last Name:"
                                name="lastename"
                                rules={[required("")]}
                              >
                                <Input placeholder="..." />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col md={12}>
                              <Form.Item
                                label="Email Address:"
                                name="email_address"
                                rules={[required(""), email]}
                              >
                                <Input placeholder={"..."} />
                              </Form.Item>
                            </Col>

                            <Col md={12}>
                              <Form.Item
                                label="Phone Number:"
                                name="phone_number"
                                rules={[{ validator: validMobile9 }]}
                              >
                                <Input placeholder="..." />
                              </Form.Item>
                            </Col>
                            {/* </Row> */}
                          </Row>
                          <Row gutter={16}>
                            <Col md={12}>
                              <Form.Item
                                label="Country of Residence "
                                name="country-of-residence"
                                rules={[required("")]}
                                className="mt-7"
                              >
                               <Cascader placeholder='Country' options={location}/>
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>

                  <div className="information-box confirmation-box">
                    <Title level={4}>Please confirm</Title>
                    <Checkbox defaultChecked={false} onChange={(e) => {
                      this.setState({
                        terms: e.target.checked
                      })
                    }}>
                      I have checked to ensure that all names, including titles,
                      entered above are correct as per the passport and/or photo
                      identification for all passengers, and have checked to
                      ensure that dates, times, and flights are correct.
                    </Checkbox>
                    { (terms === false) ?
                      <div style={{
                        "color": "#ff4d4f",
                        "fontSize": "12px"}}> You must agree to Terms and Conditions</div> : null
                    }
                  </div>

                  {/* <div className="information-box promo-box">
                    <p>Do you have code promo?</p>
                    <div className="promo-box-right">
                      <Input placeholder="Enter promotion code" />
                      <Button className="apply-btn">Apply</Button>
                    </div>
                  </div> */}
                  {/* END - Seat Selection, Food Drink, FLexible Flight, Confirmation, Apply Promo Boxes  - 05/07/2021 */}
                </Col>
                {/* START - Car Your Booking Right Sidebar-1 - 06/07/2021 */}
                <Col md={8}>
                  <CarBookingDetailBlock
                    isCheckout={true}
                    terms={terms}
                    {...this.props}
                    selectedCar={selectedCar}
                  />
                </Col>
                {/* END - Car Your Booking Sidebar-1 - 06/07/2021 */}
              </Row>
            </Form>
          </div>
        </div>
        {/* START - Flight Confirmation Modal - 05/07/2021 */}
        <div class="confirmation-modal-container" style={{ display: "none" }}>
          <Title>Purchase Complete!</Title>
          <Title level={3}>
            Your Melbourne - Japan return flight is confirmed.
          </Title>

          <div className="information">
            <Paragraph>
              Your booking ID is <Link to="#">12345678</Link> . Please use this
              booking ID for any communication with us.
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
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { carList, car_reqdata } = tourism;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    car_reqdata,
    carSearchRecords: carList,
  };
};
export default connect(mapStateToProps, { 
  postCarDriverDetails,
  getSportsCountryList,
  enableLoading,
  disableLoading
})(
  CarBookingForm
);
