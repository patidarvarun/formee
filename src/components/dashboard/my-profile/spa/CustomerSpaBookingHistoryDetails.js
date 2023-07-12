import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  Layout,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  Divider,
  Anchor,
  Select,
} from "antd";
import {
  enableLoading,
  disableLoading,
  getServiceBooking,
  customerServiceBookingResponse,
  customerBookingDispute,
} from "../../../../actions";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { LeftOutlined } from "@ant-design/icons";
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import "./mybooking.less";
import "../../../booking/booking.less";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../config/FormValidation";
import { convertTime24To12Hour, convertMinToHours } from "../../../common";
import { DISPUTE_REASON } from "../../../../config/Helper";
import { getStatusColor } from "../../../../config/Helper";

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;
const { TextArea } = Input;
const tailLayout = {
  wrapperCol: { span: 24 },
  className: "align-center pt-20",
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  labelAlign: "left",
  colon: false,
};

class CustomerSpaBookingHistoryDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingResponse: "",
      displayReportToAdminModal: false,
      serviceBookingId: "",
      isOtherDisputeResaon: false,
    };
  }

  componentDidMount() {
    const { loggedInDetail } = this.props;
    const parameter = this.props.match.params;
    let serviceBookingId = parameter.serviceBookingId;
    this.setState({
      serviceBookingId: serviceBookingId,
      customerId: loggedInDetail.id,
    });
    this.getBookingDetails(serviceBookingId);
  }

  getBookingDetails = (serviceBookingId) => {
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
  };

  hideReportToAdminModal = (e) => {
    this.setState({
      displayReportToAdminModal: false,
    });
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onSubmitReportToAdminForm = (values) => {
    const reqData = {
      service_booking_id: this.state.serviceBookingId,
      reason:
        values.cancelreason === "Other"
          ? values.other_reason
          : values.cancelreason,
    };
    this.props.enableLoading();

    this.props.customerBookingDispute(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success("Success", "Dispute has been reported successfully.");
        this.setState({
          displayReportToAdminModal: false,
        });
        this.props.history.push("/my-booking/spa");
      } else {
        toastr.success("Error", "Something went wrong to post this dispute.");
      }
    });
  };

  renderDisputeReason = () => {
    return (
      <Select
        placeholder="Select"
        className="shadow-input"
        size="large"
        onChange={(e) => {
          if (e === "Other") {
            this.setState({ isOtherDisputeResaon: true });
          } else {
            this.setState({ isOtherDisputeResaon: false });
          }
        }}
        allowClear
        getPopupContainer={(trigger) => trigger.parentElement}
      >
        {DISPUTE_REASON.map((val, i) => {
          return (
            <Select.Option key={`${i}_dispute_reason`} value={val.label}>
              {val.value}
            </Select.Option>
          );
        })}
      </Select>
    );
  };

  renderTotalAmount = (total_amount, tax_amount) => {
    let totalAmountIncTax = parseFloat(total_amount) + parseFloat(tax_amount);
    return totalAmountIncTax.toFixed(2);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { bookingResponse } = this.state;

    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab spa-booking-history-detail"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>View Details</Title>
                  </div>
                  <div className="right"></div>
                </div>
                <div className="sub-head-section block-display">
                  <div className="back" onClick={this.props.history.goBack}>
                    <LeftOutlined /> <span>Back</span>
                  </div>
                </div>
                <div className="profile-content-box box-shdw-none book-now-popup mt-18">
                  {bookingResponse !== "" && (
                    <Row gutter={30}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <div className="left-parent-detail-block">
                          <Card>
                            <Row gutter={0}>
                              <Col md={24}>
                                <div
                                  className="header-detail"
                                  style={{
                                    paddingLeft: "0",
                                    paddingRight: "0",
                                    paddingTop: "11px",
                                  }}
                                >
                                  <div className="title-respone">
                                    Your Booking
                                  </div>
                                  <Button
                                    type="default"
                                    className={bookingResponse.status}
                                  >
                                    {bookingResponse.status}
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                          <Card>
                            <Row gutter={0}>
                              <Col md={24}>
                                <div className="header-left-detail">
                                  <h2 className="booking-id mt-20">
                                    Booking ID:{" "}
                                    <strong>{bookingResponse.id}</strong>
                                  </h2>
                                </div>
                                <div className="body-detail">
                                  <div className="thumb-title-block">
                                    <div className="slide-content">
                                      {/* <img src={bookingResponse.service_sub_bookings[0].wellbeing_trader_service.service_image ? bookingResponse.service_sub_bookings[0].wellbeing_trader_service.service_image : DEFAULT_IMAGE_CARD} alt='' /> */}
                                    </div>

                                    <div className="fm-user-details inner-fourth">
                                      <Title level={4}>
                                        {
                                          bookingResponse
                                            .service_sub_bookings[0]
                                            .wellbeing_trader_service.name
                                        }
                                      </Title>
                                      <Text className="category-type">
                                        {bookingResponse.sub_category_name}
                                      </Text>
                                      <Text> </Text>
                                      <Text className="fm-location mt-10">
                                        {bookingResponse.trader_user
                                          .business_location
                                          ? bookingResponse.trader_user
                                              .business_location
                                          : ""}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            <div className="body-detail">
                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Date:</div>
                                    <div className="sub-title-detail">
                                      {moment(
                                        bookingResponse.booking_date
                                      ).format("D MMM YYYY")}
                                    </div>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="title-sub-title-detail mb-0">
                                    <div className="title">Duration:</div>
                                    <div className="sub-title-detail">
                                      {convertMinToHours(
                                        bookingResponse.duration
                                      )}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <Row gutter={15}>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    <div className="title">Time:</div>
                                    <div className="sub-title-detail">
                                      {convertTime24To12Hour(
                                        bookingResponse.start_time
                                      )}
                                    </div>
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="title-sub-title-detail">
                                    &nbsp;
                                  </div>
                                </Col>
                              </Row>
                              <div className="special-note-detail">
                                <Row gutter={15}>
                                  <Col md={12}>
                                    <div className="title-sub-title-detail">
                                      <div className="title">Special Note</div>
                                      <div className="sub-title-detail">
                                        <p>
                                          {bookingResponse.additional_comments
                                            ? bookingResponse.additional_comments
                                            : "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </Col>
                                  <Col md={12}>
                                    <div className="title-sub-title-detail">
                                      <div className="title">Payment</div>
                                      <div className="sub-title-detail">
                                        ${bookingResponse.total_amount}
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                                {/* <Button onClick={() => this.setState({ displayReportToAdminModal: true })} type='primary' size='middle' className='btn-sml purpel'>
                                Report to admin </Button> */}
                              </div>
                            </div>

                            {/* <Divider />
                          <div className="price-summary">
                            <Row className='pt-5'>
                              <Col md={16}>{bookingResponse.service_sub_bookings[0].wellbeing_trader_service.name}</Col>
                              <Col md={8}>${bookingResponse.total_amount}</Col>
                            </Row>
                            <Row className='pt-5'>
                              <Col md={16}>Subtotal:</Col>
                              <Col md={8}>${bookingResponse.total_amount}</Col>
                            </Row>
                            <Row className='pt-5'>
                              <Col md={16}>Taxes fee:</Col>
                              <Col md={8}>${bookingResponse.tax_amount}</Col>
                            </Row>
                            <Divider />
                            <Row className='pt-5'>
                              <Col md={16}><b>Total</b></Col>
                              <Col md={8}><b>${bookingResponse.total_amount + bookingResponse.tax_amount}</b> </Col>
                            </Row>
                          </div> */}
                          </Card>
                        </div>
                      </Col>

                      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div className="right-parent-block-detail payment-block-detail">
                          <div className="header-detail">
                            <h2>Payment Details</h2>
                          </div>
                          <div className="price-summary-list">
                            <div className="title">
                              <Row gutter={20}>
                                <Col xs={24} sm={24} md={3} lg={3}>
                                  1
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={16}>
                                  {/* {bookingResponse.service_sub_bookings[0].wellbeing_trader_service.name} */}
                                </Col>
                                <Col
                                  xs={24}
                                  sm={24}
                                  md={5}
                                  lg={5}
                                  className="text-right"
                                >
                                  ${bookingResponse.total_amount.toFixed(2)}
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div className="price-total-list">
                            <Row gutter={20}>
                              <Col md={14}>Item (1)</Col>
                              <Col md={10} className="text-right">
                                ${bookingResponse.total_amount.toFixed(2)}
                              </Col>
                              <Col md={14}>Fee</Col>
                              <Col md={10} className="text-right">
                                ${bookingResponse.tax_amount.toFixed(2)}
                              </Col>
                              <Col md={14}>
                                <b>Total</b>
                              </Col>
                              <Col md={10} className="text-right">
                                <div className="total-amount">
                                  <b>
                                    $
                                    {this.renderTotalAmount(
                                      bookingResponse.total_amount,
                                      bookingResponse.tax_amount
                                    )}
                                  </b>
                                  <span>Taxes & fees included</span>
                                </div>{" "}
                              </Col>
                            </Row>
                          </div>
                        </div>
                        <div className="right-parent-block-detail special-notes" >
                          <div className="header-detail">
                            <h2>Special note</h2>
                          </div>
                          <div className="body-detail">
                            <p>{bookingResponse.additional_comments ? bookingResponse.additional_comments : 'N/A'}</p>
                          </div>
                        </div> 
                      </Col>
                    </Row>
                  )}
                  <Modal
                    title="Raise Dispute to Admin"
                    visible={this.state.displayReportToAdminModal}
                    className={"custom-modal dispute-modal style1"}
                    footer={false}
                    onCancel={this.hideReportToAdminModal}
                    destroyOnClose={true}
                  >
                    <div>
                      <Form
                        {...layout}
                        onFinish={this.onSubmitReportToAdminForm}
                      >
                        <Form.Item
                          label="Select the issue"
                          name="cancelreason"
                          rules={[required("")]}
                          name="cancelreason"
                        >
                          {this.renderDisputeReason(bookingResponse)}
                        </Form.Item>
                        {this.state.isOtherDisputeResaon && (
                          <Form.Item
                            label="Type your issue in detail"
                            name="other_reason"
                            rules={[
                              required(""),
                              whiteSpace("Message"),
                              maxLengthC(100),
                            ]}
                          >
                            <TextArea
                              rows={4}
                              placeholder={"Type here"}
                              className="shadow-input"
                            />
                          </Form.Item>
                        )}
                        <Form.Item {...tailLayout}>
                          <Button type="default" htmlType="submit">
                            Send
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </Modal>
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
  getServiceBooking,
  customerServiceBookingResponse,
  customerBookingDispute,
})(withRouter(CustomerSpaBookingHistoryDetails));
