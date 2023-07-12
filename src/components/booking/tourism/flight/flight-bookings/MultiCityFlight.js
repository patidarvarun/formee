import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import AppSidebar from "../common/Sidebar";
import { Layout, Row, Col, Typography, Collapse, Modal, Button } from "antd";
import {} from "@ant-design/icons";
import TopBackWithTitle from "../../common/TopBackWithTitle";
import TourismSteps from "../../common/TourismSteps";
import VehicleGridDetail from "../../common/VehicleGridDetail";
// import Icon from "../../../components/customIcons/customIcons";
// import { langs } from "../../../config/localization";
// import {
//   mostPopularInHandyMan,
//   newInBookings,
//   mostPapularList,
//   getMostViewdData,
//   getBannerById,
//   enableLoading,
//   disableLoading,
// } from "../../../../../actions/index";
// import {
//   papularSearch,
//   getClassfiedCategoryListing,
//   classifiedGeneralSearch,
//   getClassfiedCategoryDetail,
//   openLoginModel,
//   getChildCategory,
// } from "../../../../../actions";
// import history from "../../../../../common/History";
// import "../../../common/bannerCard/bannerCard.less";
// import { TEMPLATE } from "../../../../../config/Config";
// import NewSidebar from "../../../NewSidebar";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/multi-city-flight.less";
// import "./TourismSteps";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}
class MultiCityFlight extends React.Component {
  state = {
    loading: false,
    visible: false,
  };

  showModal = () => {
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

  render() {
    const { visible, loading } = this.state;
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing booking-tourism-checkout-box">
        <Layout className="yellow-theme common-left-right-padd">
          <TopBackWithTitle />
          <Layout className="right-parent-block inner-content-wrap">
            {/* <div className="inner-banner custom-inner-banner">
              <SubHeader categoryName={TEMPLATE.HANDYMAN} showAll={true} />
              <CarouselSlider bannerItem={topImages} pathName="/" />
            </div> */}
            <Content className="site-layout tourism-multi-city-flight-box">
              <TourismSteps />
              <Collapse
                className="travel-item-collapse-box"
                defaultActiveKey={["1"]}
                onChange={callback}
              >
                <Panel header="Flight 1" key="1">
                  <div className="vehicle-item-all-detail-box">
                    <Row className="vhcl-detail-header">
                      <Col md={14}>
                        <Title level={3}>
                          Departing Flight <span>- Wed 29 Jan</span>
                        </Title>
                      </Col>
                      <Col md={5}>
                        <span className="vhcl-time">7h 10m</span>
                        <span className="vhcl-stopage green">Non-stop</span>
                        <span className="vhcl-stopage blue">1-stop</span>
                      </Col>
                      <Col md={5}>
                        <Link to="" className="change">
                          Change
                        </Link>
                      </Col>
                    </Row>
                    <VehicleGridDetail />
                  </div>
                  <div className="collapse-footer">
                    <img
                      src={require("../../../../../assets/images/icons/grey-bag.svg")}
                      alt="grey-bag"
                    />
                    <p>1 piece of checked baggage included</p>
                  </div>
                </Panel>
              </Collapse>
              <Collapse
                className="travel-item-collapse-box"
                defaultActiveKey={["1"]}
                onChange={callback}
              >
                <Panel header="Flight 2" key="2">
                  <div className="vehicle-item-all-detail-box">
                    <Row className="vhcl-detail-header">
                      <Col md={14}>
                        <Title level={3}>
                          Departing Flight <span>- Wed 29 Jan</span>
                        </Title>
                      </Col>
                      <Col md={5}>
                        <span className="vhcl-time">7h 10m</span>
                        <span className="vhcl-stopage green">Non-stop</span>
                        <span className="vhcl-stopage blue">1-stop</span>
                      </Col>
                      <Col md={5}>
                        <Link to="" className="change">
                          Change
                        </Link>
                      </Col>
                    </Row>
                    <VehicleGridDetail />
                  </div>
                  <div className="collapse-footer">
                    <img
                      src={require("../../../../../assets/images/icons/grey-bag.svg")}
                      alt="grey-bag"
                    />
                    <p>1 piece of checked baggage included</p>
                  </div>
                </Panel>
              </Collapse>

              <div className="booking-summary-box">
                <Row className="summary-box">
                  <Col md={9}>
                    <div className="heading">
                      <Title level={3}>Booking Summary</Title>
                      <p>
                        Includes flights for 2 adults and all applicable taxes,
                        charges and fees Payment fees may apply depending on
                        your payment method.
                      </p>
                    </div>
                  </Col>
                  <Col md={9}></Col>
                  <Col md={6}>
                    <div className="detail-list-box">
                      <ul>
                        <li>Charges to the airline $</li>
                        <li>1,278.00</li>
                      </ul>
                    </div>
                    <div className="detail-list-box">
                      <ul>
                        <li>Taxes and surcharges $</li>
                        <li>285.00</li>
                      </ul>
                    </div>
                    <div className="detail-list-box">
                      <ul className="total">
                        <li>Total $</li>
                        <li>1,264.86</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
                <Row className="summary-box summary-inner-bottom-box">
                  <Col md={8}>
                    <div className="heading">
                      <Title level={2}>Payable Now</Title>
                      <p>(in Australian Dollars)</p>
                    </div>
                  </Col>
                  <Col md={10}></Col>
                  <Col md={6}>
                    <div className="detail-list-box">
                      <ul className="total">
                        <li>Total Booking Price $</li>
                        <li>
                          1,564.86
                          <span
                            className="show-detail"
                            onClick={this.showModal}
                          >
                            Show Details
                          </span>
                        </li>
                      </ul>
                    </div>
                    <Button className="btn-book-now">Book Now</Button>
                  </Col>
                </Row>
              </div>
            </Content>
          </Layout>
          {/* START - Baggage and Policy Information box - 03/07/2021 */}
          <div className="policy-information-container">
            <Row
              style={{
                borderBottom: "1px solid #C4C4C4",
                paddingBottom: "20px",
              }}
            >
              <Col md={6}>
                <h3>Baggage</h3>
              </Col>

              <Col md={18}>
                <h4>
                  <img
                    src={require("../../../../../assets/images/icons/caution.svg")}
                    alt="caution"
                  />
                  Dangerous Goods
                </h4>

                <Paragraph>
                  Dangerous Goods or Hazardous Material (HAZMAT) are items or
                  articles or substances which are capable of posing a risk to
                  health, safety, property or the environment and classified as
                  follows:
                </Paragraph>

                <div className="list-container">
                  <ol>
                    <li>Explosives</li>
                    <li>Gases</li>
                    <li>Flammable Liquids</li>
                    <li>Flammable Solids</li>
                    <li>Oxidizing substances and Organic Peroxides</li>
                    <li>Toxic and Infectious Substances</li>
                    <li>Radioactive Material</li>
                    <li>Corrosives</li>
                    <li>
                      Miscellaneous Dangerous substances and articles, including
                      environmentally hazardous substances
                    </li>
                  </ol>
                </div>

                {/* <div className="list-container1">
                            <ol>
                              <li>Explosives</li>
                              <li>Toxic and Infectious Substances</li>                                   
                            </ol>
                          </div>
                          
                          <div className="list-container1">
                            <ol>
                              <li>Gases</li>
                              <li>Radioactive Material</li>                            
                            </ol>
                          </div>

                          <div className="list-container1">
                            <ol>
                              <li>Flammable Liquids</li>
                              <li>Corrosives</li>
                              
                            </ol>
                          </div>

                          <div className="list-container1">
                            <ol>
                              <li>Flammable Solids</li>
                              <li>Miscellaneous Dangerous substances and articles, including environmentally hazardous substances</li>                             
                            </ol>
                          </div>

                          <div className="list-container1">
                            <ol>
                              <li>Oxidizing substances and Organic Peroxides</li>
                            </ol>
                          </div> */}

                <p className="safety-information">
                  For your safety, Airline does not allow these dangerous goods
                  in checked baggage, carry-on baggage and on one's person on
                  all flights.
                </p>

                <p>
                  <strong>Remark</strong>: limitations and restrictions are
                  subject to local and airport regulations.
                </p>
              </Col>
            </Row>

            <hr />

            <Row>
              <Col md={6}>
                <h3>Policies</h3>
              </Col>

              <Col md={18}>
                <h4>
                  <img
                    src={require("../../../../../assets/images/icons/alert.svg")}
                    alt="alert"
                  />
                  Important Flight Information
                </h4>
                <Paragraph>
                  Personal data given in this booking will be disclosed to the
                  airline for the purpose of managing your flight booking. If
                  there are any changes to the flight itinerary (whether
                  initiated by the airline or by you with the airline direct),
                  Expedia will not be notified by the airline. If the airline
                  makes any changes to your flight itinerary, they will directly
                  notify you, through your email address or phone number
                  provided for this booking. Expedia is not responsible for the
                  failure of the foregoing.
                </Paragraph>

                <p>
                  We want you to know the airline you're travelling with has the
                  following restrictions regarding your flight.
                </p>

                <div class="unodered-list-container">
                  <ul>
                    <li>
                      Tickets are non-refundable and non transferable. Name
                      changes are not allowed.
                    </li>
                    <li>
                      Fare Rules and Restrictions:
                      <div className="fare-rules-div">
                        <p>
                          <img
                            src={require("../../../../../assets/images/icons/green-tick.svg")}
                            alt="alert"
                          />
                          Change your flight for free
                        </p>

                        <p className="airline-policy-p">
                          See <Link to="#">Airlines policy</Link> Opens in a new
                          tab.
                        </p>
                      </div>
                    </li>
                    <li>
                      There may be an additional fee based on your payment
                      method. Fee is not reflected in the ticket price.
                    </li>
                    <li>
                      {" "}
                      Airlines may change flight schedules and terminals at any
                      time.
                    </li>
                    <li>
                      Correct travel documents are required. It's your
                      responsibility to check your documents before you travel.
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Layout>
        {/* START - Price Breakdown Modal - 05/07/2021 */}
        <Modal
          visible={visible}
          title="Price Breakdown"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered={true}
          footer={null}
          className="custom-modal style1 price-breakdown-modal"
        >
          <div className="price-breakdown-container">
            {/* <Title level={3}>Price Breakdown</Title> */}

            <div className="payable-information">
              <Title level={4}>
                Payable Now <Text>(in Australian Dollars)</Text>
              </Title>

              <Title level={4}>$ 1,564.86</Title>
            </div>

            <div className="list-container">
              <ul className="list-items list-heading">
                <li>
                  Flights{"  "}
                  <span>
                    .............................................................................................................
                  </span>
                </li>
                <li className="item-price">$ 1,395.00</li>
              </ul>

              <ul className="list-items detail-listing">
                <li>
                  Qantas Airways from Sydney to Auckland airfare{"  "}
                  ........................................
                </li>
                <li className="item-price">$1,197.98</li>
              </ul>

              <ul className="list-items detail-listing">
                <li>
                  2 Adults Airfare(s){"  "}
                  .........................................................................................
                </li>
                <li className="item-price"> $1,006.82</li>
              </ul>

              <ul className="list-items list-heading">
                <li>Booking Price Guarantee</li>
                <li className="item-price">$ 14.95</li>
              </ul>

              <ul className="list-items list-heading">
                <li>Servicing Fee</li>
                <li className="item-price">$ 24.95</li>
              </ul>
            </div>
          </div>
        </Modal>
        {/* END - Price Breakdown Modal - 05/07/2021 */}
      </Layout>
    );
  }
}

export default MultiCityFlight;
