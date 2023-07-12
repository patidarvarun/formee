import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  enableLoading,
  disableLoading,
  getSportsEnquirylist,
} from "../../../../../../actions";
import {
  Col,
  Input,
  Layout,
  Avatar,
  Row,
  Typography,
  Button,
  Menu,
  Dropdown,
  Pagination,
  Card,
  Tabs,
  Form,
  Select,
  Rate,
  Alert,
  Modal,
  Radio,
} from "antd";
import history from "../../../../../../components/common/";
import {
  getStatusColor,
  checkBookingForFutureDate,
} from "../../../../../../config/Helper";
import {
  displayDateTimeFormate,
  convertTime24To12Hour,
  displayCalenderDate,
  displayDate,
} from "../../../../../../components/common";
import {
  PlusOutlined,
  UserOutlined,
  CaretDownOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  DeleteFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

class MyBookings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: [],
      confirmed: [],
      bookingListCalenderView: "week",
      serviceBookingIdForReview: "",
      selectedBookingId: "",
      activeTab: "1",
      historyView: "newest",
    };
  }
  
  /**
 * @method componentDidMount
 * @description called after render the component
 */
    componentDidMount() {
    this.props.enableLoading();
    this.props.getSportsEnquirylist((res) => {
      this.props.disableLoading();
      console.log("🚀 ~ file: AddSports.js ~ line 165 ~ MyBookings ~ this.getCustomerEnquiryList ~ res", res)
      if(res.status == 200){
        let data = res.data && res.data.data
        this.setState({
          pending: data.pending_bookings ? data.pending_bookings : [],
          confirmed: data.confirmed_bookings ? data.confirmed_bookings : []
        })
      }
    });
  }

  formateRating = (rate) => {
    return rate ? `${parseInt(rate)}.0` : 0;
  };

  renderUpcomingBooking = () => {
    const { selectedBookingId, showMoreUpcommingBookings, page } = this.state;
    const { name, email, mobile_no } = this.props.loggedInUser;

    if (
      this.state.confirmed &&
      this.state.confirmed.length > 0
    ) {
      return (
        <Fragment>
          {this.state.pending.map((value, i) => {
            console.log(value,"value@@@@@@@@@@@@@@")
            return (
              <div
                className="my-new-order-block booking-box-content"
                onClick={() => {
                  if (selectedBookingId === value.id) {
                    // this.setState({ selectedEnquiryId: "" });
                  } else {
                    this.setState({
                      selectedBookingId: value.id,
                      selectedHistoryBookingDetail: value,
                    });
                  }
                }}
              >
                <Row gutter={0}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={18}
                    xl={18}
                    className="booking-left"
                  >
                    <div className="odr-no">
                      <h4>Upcoming</h4>
                      <span className="pickup">
                        {
                          value.event_details.venue
                        }
                      </span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic">
                          <img
                            alt="test"
                            src={
                              value.event_details.venue_img
                            }
                          />
                        </div>
                        <div className="profile-name">
                          {value.lead_customer}
                        </div>
                      </div>
                      <div className="profile-name ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 pl-25">
                        <div className="pf-rating">
                          <Text>{this.formateRating(value.trader_rating)}</Text>
                          <Rate
                            disabled
                            defaultValue={this.formateRating(
                              value.trader_rating
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <div className="fm-eventb-date">
                          <h3>Issue Date:</h3>
                          <span className="fm-eventb-month">
                            {moment(value.created_at).format("MMM D, YYYY")}
                          </span>
                          <span className="fm-eventb-month">
                            {moment(value.created_at).format("hh:mm A")}
                          </span>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={18}
                        xl={17}
                        className="fm-desc-wrap pl-0"
                      >
                        <Row gutter={0}>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={16}
                            className="booking-request"
                          >
                            <div className="fm-eventb-desc">
                              <h3>Venue: </h3>
                              <span className="fm-eventb-content">
                                {value.event_details.venue}
                                
                              </span>

                              {value.id === selectedBookingId && (
                                <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                  <div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Selected Seat: </h3>
                                          <span className="fm-eventb-content">
                                            {""}
                                          </span>
                                        </Col>
                                        </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Ticket Type: </h3>
                                          <span className="fm-eventb-content">
                                            {value.ticket_details.Section}
                                          </span>
                                          <span>change ticket type</span>
                                        </Col>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Total: </h3>
                                          <span className="fm-eventb-content">
                                            {value.currency}${value.total_price}
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Delivery Method: </h3>
                                          <span className="fm-eventb-content">
                                           <Button>

                                           </Button>
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Contact Name: </h3>
                                          <span className="fm-eventb-content">
                                            {value.lead_customer}
                                          </span>
                                        </Col>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Email Address: </h3>
                                          <span className="fm-eventb-content">
                                            {value.email}
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Phone Number: </h3>
                                      <span className="fm-eventb-content">
                                        {value.phone_number}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Special Note: </h3>
                                      <span className="fm-eventb-content">
                                        {value.notes}
                                      </span>
                                    </div>
                                    {(value.status === "Cancelled" || value.status === "Rejected" || value.status === "Declined") && (
                                        <div className="fm-eventb-desc mt-20 rejected-block">
                                          <div className="rj-head">
                                            {/* <CloseCircleOutlined />*/}
                                            <span><CloseCircleOutlined />STATUS {value.status}</span>
                                          </div>
                                          <div className="rj-text">
                                            <h5>
                                              {value.cancel_reason !== null ? value.cancel_reason : ""}
                                            </h5>
                                           {/*} <h4>Message</h4>
                                            <p>
                                              {value.cancle_comment !== null ? value.cancle_comment : ""}
                                            </p>*/}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </Col>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={6}
                    xl={6}
                    className="align-right  booking-right-section"
                  >
                    <div className="bokng-time-date spa-date fs-13">
                      <span className="mb-0">
                        {moment(value.booking_date).format("MMM D, YYYY")}
                      </span>
                      <span>
                        {convertTime24To12Hour(value.start_time)} -{" "}
                        {convertTime24To12Hour(value.end_time)}
                      </span>
                    </div>
                    {/* <div className="bokng-hsty-hour-price">
                      <div className="hour">{this.timestampToString(value.booking_date, value.start_time, true)} </div>
                      <div className="price">${value.total_amount}</div>
                    </div> */}
                    <div className="orange-small">
                      <span>
                        {value.category_name ? value.category_name : "N/A"}
                      </span>
                      <span>
                        {value.sub_category_name
                          ? value.sub_category_name
                          : "N/A"}
                      </span>
                      <div className="edit-delete-dot ml-5">
                        {/* <Dropdown
                          overlay={menuicon}
                          trigger={["click"]}
                          overlayClassName="show-phone-number retail-dashboard"
                          placement="bottomRight"
                          arrow
                          // onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            width="5"
                            height="17"
                            viewBox="0 0 5 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.71649 4.81189C3.79054 4.81189 4.66931 3.93312 4.66931 2.85907C4.66931 1.78502 3.79054 0.90625 2.71649 0.90625C1.64244 0.90625 0.763672 1.78502 0.763672 2.85907C0.763672 3.93312 1.64244 4.81189 2.71649 4.81189ZM2.71649 6.76471C1.64244 6.76471 0.763672 7.64348 0.763672 8.71753C0.763672 9.79158 1.64244 10.6704 2.71649 10.6704C3.79054 10.6704 4.66931 9.79158 4.66931 8.71753C4.66931 7.64348 3.79054 6.76471 2.71649 6.76471ZM2.71649 12.6232C1.64244 12.6232 0.763672 13.5019 0.763672 14.576C0.763672 15.65 1.64244 16.5288 2.71649 16.5288C3.79054 16.5288 4.66931 15.65 4.66931 14.576C4.66931 13.5019 3.79054 12.6232 2.71649 12.6232Z"
                              fill="#C5C7CD"
                            />
                          </svg>
                        </Dropdown> */}
                      </div>
                    </div>
                    {/* {this.displayReviewRatingSection(value)} */}

                    {value.id === selectedBookingId && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <MinusCircleOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            this.setState({
                              selectedBookingId: "",
                              selectedHistoryBookingDetail: "",
                            });
                          }}
                        />
                      </div>
                    )}
                  </Col>
                  {/* <Link to={`/spa/customer-booking-history-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
              </div>
            );
          })}
          {/* <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleHistoryBookingPageChange}
            total={this.state.totalRecordCustomerSpaBookingHistory} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={"mb-20"}
          /> */}

          {showMoreUpcommingBookings && (
            <div className="show-more">
              <div
                type="default"
                size={"middle"}
                onClick={() => {
                  this.handleHistoryBookingPageChange(`${parseInt(page) + 1}`);
                }}
              >
                {"Show More"}
              </div>
            </div>
          )}
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };

  renderHistoryBooking = () => {
    const {
      showMoreHistoryBookings,
      page,
      selectedHistoryBookingId,
      selectedHistoryBookingDetail,
    } = this.state;

    if (
      this.state.pending &&
      this.state.pending.length > 0
    ) {
      const menuicon = (
        <Menu>
          <Menu.Item key="0">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  if (selectedHistoryBookingId) {
                    window.location.assign(
                      `/beauty/customer-booking-history-detail/${selectedHistoryBookingDetail.id}`
                    );
                  }
                }}
              >
                <span className="edit-images">
                  {" "}
                  {/* <img
                    src={require("../../../../../classified-templates/user-classified/icons/view.svg")}
                  /> */}
                </span>{" "}
                <span>View Details</span>
              </a>
            </div>
          </Menu.Item>
          <Menu.Item key="1">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.setState({ receiptModalEventBooking: true });
                }}
              >
                <span className="edit-images">
                  {" "}
                  {/* <img
                    src={require("../../../../../classified-templates/user-classified/icons/view.svg")}
                  /> */}
                </span>{" "}
                <span>View Invoice</span>
              </a>
            </div>
          </Menu.Item>
          <Menu.Item key="2">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.setState({ leaveReviewModal: true });
                }}
              >
                <span className="edit-images">
                  {/* <img
                    src={require("../../../../../classified-templates/user-classified/icons/edit.svg")}
                    alt=""
                  />{" "} */}
                </span>{" "}
                <span>Leave Review</span>
              </a>
            </div>
          </Menu.Item>
          <Menu.Item key="3">
            <div className="edit-delete-icons">
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.setState({ confirmDeleteBooking: true });
                }}
              >
                <span className="edit-images">
                  {/* <img
                    src={require("../../../../../assets/images/icons/delete.svg")}
                    alt=""
                  />{" "} */}
                </span>{" "}
                <span>Delete</span>
              </a>
            </div>
          </Menu.Item>
        </Menu>
      );
      return (
        <Fragment>
          {this.state.pending.map((value, i) => {
            console.log(value,"value@@@@@@@@@@@@@@")
            return (
              <div
                className="my-new-order-block booking-box-content"
                onClick={() => {
                  if (selectedHistoryBookingId === value.id) {
                    // this.setState({ selectedEnquiryId: "" });
                  } else {
                    this.setState({
                      selectedHistoryBookingId: value.id,
                      selectedHistoryBookingDetail: value,
                    });
                  }
                }}
              >
                <Row gutter={0}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={18}
                    xl={18}
                    className="booking-left"
                  >
                    <div className="odr-no">
                      <h4>Upcoming</h4>
                      <span className="pickup">
                        {
                          value.event_details.venue
                        }
                      </span>
                    </div>
                    <div className="order-profile booking-pro">
                      <div className="profile-head ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6">
                        <div className="profile-pic">
                          <img
                            alt="test"
                            src={
                              value.event_details.venue_img
                            }
                          />
                        </div>
                        <div className="profile-name">
                          {value.lead_customer}
                        </div>
                      </div>
                      <div className="profile-name ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 pl-25">
                        <div className="pf-rating">
                          <Text>{this.formateRating(value.trader_rating)}</Text>
                          <Rate
                            disabled
                            defaultValue={this.formateRating(
                              value.trader_rating
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <div className="fm-eventb-date">
                          <h3>Issue Date:</h3>
                          <span className="fm-eventb-month">
                            {moment(value.created_at).format("MMM D, YYYY")}
                          </span>
                          <span className="fm-eventb-month">
                            {moment(value.created_at).format("hh:mm A")}
                          </span>
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={18}
                        xl={17}
                        className="fm-desc-wrap pl-0"
                      >
                        <Row gutter={0}>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={16}
                            className="booking-request"
                          >
                            <div className="fm-eventb-desc">
                              <h3>Venue: </h3>
                              <span className="fm-eventb-content">
                                {value.event_details.venue}
                                
                              </span>

                              {value.id === selectedHistoryBookingId && (
                                <Col xs={24} sm={24} md={24} lg={8} xl={24}>
                                  <div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Selected Seat: </h3>
                                          <span className="fm-eventb-content">
                                            {""}
                                          </span>
                                        </Col>
                                        </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Ticket Type: </h3>
                                          <span className="fm-eventb-content">
                                            {value.ticket_details.Section}
                                          </span>
                                          <span>change ticket type</span>
                                        </Col>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Total: </h3>
                                          <span className="fm-eventb-content">
                                            {value.currency}${value.total_price}
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Delivery Method: </h3>
                                          <span className="fm-eventb-content">
                                           <Button>

                                           </Button>
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <Row>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Contact Name: </h3>
                                          <span className="fm-eventb-content">
                                            {value.lead_customer}
                                          </span>
                                        </Col>
                                        <Col className="ant-col-lg-12 ant-col-xl-12">
                                          <h3>Email Address: </h3>
                                          <span className="fm-eventb-content">
                                            {value.email}
                                          </span>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Phone Number: </h3>
                                      <span className="fm-eventb-content">
                                        {value.phone_number}
                                      </span>
                                    </div>
                                    <div className="fm-eventb-desc mt-20">
                                      <h3>Special Note: </h3>
                                      <span className="fm-eventb-content">
                                        {value.notes}
                                      </span>
                                    </div>
                                    {(value.status === "Cancelled" || value.status === "Rejected" || value.status === "Declined") && (
                                        <div className="fm-eventb-desc mt-20 rejected-block">
                                          <div className="rj-head">
                                            {/* <CloseCircleOutlined />*/}
                                            <span><CloseCircleOutlined />STATUS {value.status}</span>
                                          </div>
                                          <div className="rj-text">
                                            <h5>
                                              {value.cancel_reason !== null ? value.cancel_reason : ""}
                                            </h5>
                                           {/*} <h4>Message</h4>
                                            <p>
                                              {value.cancle_comment !== null ? value.cancle_comment : ""}
                                            </p>*/}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </Col>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={6}
                    xl={6}
                    className="align-right  booking-right-section"
                  >
                    <div className="bokng-time-date spa-date fs-13">
                      <span className="mb-0">
                        {moment(value.booking_date).format("MMM D, YYYY")}
                      </span>
                      <span>
                        {convertTime24To12Hour(value.start_time)} -{" "}
                        {convertTime24To12Hour(value.end_time)}
                      </span>
                    </div>
                    {/* <div className="bokng-hsty-hour-price">
                      <div className="hour">{this.timestampToString(value.booking_date, value.start_time, true)} </div>
                      <div className="price">${value.total_amount}</div>
                    </div> */}
                    <div className="orange-small">
                      <span>
                        {value.category_name ? value.category_name : "N/A"}
                      </span>
                      <span>
                        {value.sub_category_name
                          ? value.sub_category_name
                          : "N/A"}
                      </span>
                      <div className="edit-delete-dot ml-5">
                        {/* <Dropdown
                          overlay={menuicon}
                          trigger={["click"]}
                          overlayClassName="show-phone-number retail-dashboard"
                          placement="bottomRight"
                          arrow
                          // onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            width="5"
                            height="17"
                            viewBox="0 0 5 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.71649 4.81189C3.79054 4.81189 4.66931 3.93312 4.66931 2.85907C4.66931 1.78502 3.79054 0.90625 2.71649 0.90625C1.64244 0.90625 0.763672 1.78502 0.763672 2.85907C0.763672 3.93312 1.64244 4.81189 2.71649 4.81189ZM2.71649 6.76471C1.64244 6.76471 0.763672 7.64348 0.763672 8.71753C0.763672 9.79158 1.64244 10.6704 2.71649 10.6704C3.79054 10.6704 4.66931 9.79158 4.66931 8.71753C4.66931 7.64348 3.79054 6.76471 2.71649 6.76471ZM2.71649 12.6232C1.64244 12.6232 0.763672 13.5019 0.763672 14.576C0.763672 15.65 1.64244 16.5288 2.71649 16.5288C3.79054 16.5288 4.66931 15.65 4.66931 14.576C4.66931 13.5019 3.79054 12.6232 2.71649 12.6232Z"
                              fill="#C5C7CD"
                            />
                          </svg>
                        </Dropdown> */}
                      </div>
                    </div>
                    {/* {this.displayReviewRatingSection(value)} */}

                    {value.id === selectedHistoryBookingId && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <MinusCircleOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            this.setState({
                              selectedHistoryBookingId: "",
                              selectedHistoryBookingDetail: "",
                            });
                          }}
                        />
                      </div>
                    )}
                  </Col>
                  {/* <Link to={`/spa/customer-booking-history-detail/${value.id}`} className='blue-link'>Details</Link> */}
                </Row>
              </div>
            );
          })}
          {/* <Pagination
            defaultCurrent={this.state.defaultCurrent}
            defaultPageSize={this.state.page_size} //default size of page
            onChange={this.handleHistoryBookingPageChange}
            total={this.state.totalRecordCustomerSpaBookingHistory} //total number of card data available
            itemRender={paginationItemRenderHistory}
            className={"mb-20"}
          /> */}

          {showMoreHistoryBookings && (
            <div className="show-more">
              <div
                type="default"
                size={"middle"}
                onClick={() => {
                  this.handleHistoryBookingPageChange(`${parseInt(page) + 1}`);
                }}
              >
                {"Show More"}
              </div>
            </div>
          )}
        </Fragment>
      );
    } else {
      return (
        <div>
          <Alert message="No records found." type="error" />
        </div>
      );
    }
  };

  onChangeBookingListDurationFilter = (view) => {
    const { activeTab } = this.state;
    if (activeTab == 2) {
      this.setState(
        {
          historyView: view,
        },
        () => {
          this.getCustomerBookingHistory(1);
        }
      );
    } else {
      this.setState(
        {
          bookingListCalenderView: view,
          customerBookingList: [],
          totalRecordCustomerServiceBooking: 0,
        },
        () => {
          if (this.state.key == "1") {
            this.getCustomerServiceBooking(1);
          }
        }
      );
    }
  };

  render() {
    const {
      pending,
      confirmed,
      selectedBookingDate,
      customerCalenderBookingList,
      calenderView,
      activeTab,
      historyView,
      bookingListCalenderView,
      receiptModalEventBooking,
      selectedHistoryBookingDetail,
      customerRating,
      showReviewModal,
      leaveReviewModal,
      confirmDeleteBooking,
    } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    return (
      <Layout>
        <Layout>
          {/* <AppSidebar history={history} /> */}
          <Layout>
            <div
              className="my-profile-box view-class-tab shadow-none"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking mt-0">
                  <Row className="tab-full" gutter={30}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Card
                        className="profile-content-shadow-box"
                        bordered={false}
                        title=""
                      >
                        <Tabs
                          className="tab-box"
                          onChange={this.onTabChange}
                          defaultActiveKey="1"
                        >
                          <TabPane tab="Confirmed" key="1">
                            <h3 className="total-activity">
                              You have{" "}
                              {confirmed.length}{" "}
                              activities
                            </h3>
                            {this.renderUpcomingBooking()}
                          </TabPane>
                          <TabPane tab="Pending" key="2">
                            <h3 className="total-activity">
                              You have{" "}
                              {pending.length}{" "}
                              activities
                            </h3>
                            {this.renderHistoryBooking()}
                          </TabPane>
                        </Tabs>
                        <div className="card-header-select">
                          <label>Show:</label>
                          {/* <Select
                            onChange={(e) =>
                              this.onChangeBookingListDurationFilter(e)
                            }
                            defaultValue="This week"
                          >
                            <Option value="week">This week</Option>
                            <Option value="month">This month</Option>
                            <Option value="today">Today</Option>
                          </Select> */}
                          {activeTab == 2 ? (
                            <Select
                              onChange={(e) =>
                                this.onChangeBookingListDurationFilter(e)
                              }
                              value={historyView}
                            >
                              <Option value="newest">Newest</Option>
                              <Option value="oldest">Oldest</Option>
                            </Select>
                          ) : (
                            <Select
                              onChange={(e) =>
                                this.onChangeBookingListDurationFilter(e)
                              }
                              value={bookingListCalenderView}
                            >
                              <Option value="today">Today</Option>
                              <Option value="week">This week</Option>
                              <Option value="month">This month</Option>
                            </Select>
                          )}
                        </div>
                      </Card>
                    </Col>
                  </Row>
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
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  getSportsEnquirylist,
  enableLoading,
  disableLoading,
})(withRouter(MyBookings));
