import React from "react";
import {
  Layout,
  Card,
  Typography,
  Table,
  Row,
  Col,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import { connect } from "react-redux";
import { required } from "../../../../config/FormValidation";
import {
  getCardDetails,
  updateCardDetails,
  updateDefaultCard,
  enableLoading,
  disableLoading,
  deleteUserCard,
} from "../../../../actions";
import { toastr } from "react-redux-toastr";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import moment from "moment";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import {Stripe_Public_key} from "../../../../config/Config";
const { Title } = Typography;
const stripePromise = loadStripe(Stripe_Public_key);
const { Option } = Select;

class PaymentMethods extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      cardDetail: null,
    };
  }

  componentWillMount() {
    let cardId = this.props.match.params.id;
    this.props.getCardDetails({ card_id: cardId }, (res) => {
      console.log("res: ", res);
      if (res.status === STATUS_CODES.OK) {
        this.setState({ cardDetail: res.data.card });
      }
    });
  }

  /**
   * @method onFinish
   * @description called to submit form
   */
  onFinish = (values) => {
    const { cardDetail } = this.state;
    console.log("values: ", values);
    let reqData = {
      exp_year: moment(values.exp_year).format("yy"),
      exp_month: values.exp_month,
      name: values.name,
      card_id: cardDetail.id,
    };
    this.props.updateCardDetails(reqData, (res) => {
      console.log("res: ", res);
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.UPDATE_PAYMENT_CARD);
        this.setState({ cardDetail: res.data.card });
        this.props.history.push("/payment-methods");
      }
    });
  };

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    const { userDetails } = this.props;
    if (userDetails) {
      let cardId = this.props.match.params.id;
      let cardIndex = userDetails.stripe_sources.findIndex(
        (el) => el.id === Number(cardId)
      );
      return {
        card_no: `**** **** **** ${userDetails.stripe_sources[cardIndex].last4}`,
        name: userDetails.stripe_sources[cardIndex].name,
        exp_month: userDetails.stripe_sources[cardIndex].exp_month,
        exp_year: moment(
          userDetails.stripe_sources[cardIndex].exp_year,
          "YYYY-MM-DD"
        ),
      };
    }
  };

  render() {
    console.log(">>> ", this.getInitialValue());
    return (
      <Layout>
        <Layout className="profile-vendor-retail-transaction-order add-an-edit-another-payment-methods">
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800 }}
            >
              <div className="pt-20 pl-60">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Edit Payment Methods</Title>
                  </div>
                </div>
                <div className="profile-content-box">
                  <Card
                    bordered={false}
                    className="add-content-box job-application edit-payment-method-page"
                  // title='Orders Management'
                  >
                    <Form
                      // ref={this.formRef}
                      onFinish={this.onFinish}
                      // onFinishFailed={this.onFinishFailed}
                      // scrollToFirstError
                      initialValues={this.getInitialValue()}
                    // initialValues={cardDetail ? {
                    //   card_no: cardDetail.last4,
                    //   //"**** **** ****",
                    //   email: "dsahjfgdsjgfjhsg"
                    // } : {}}
                    // layout={"vertical"}
                    // className="pr-55"
                    >
                      <Row className="grid-block edit-payment-methods">
                        <Col md={12}>
                          <h3>Credit / Debit Card</h3>
                          <p className="subTitle">
                            Safe money transfer using your bank account. Visa,
                            Maestro, Discover...
                          </p>
                        </Col>
                        <Col md={12}>
                          {/* <div className="visa-card-icon">
                            <img
                              src={require("../../../../assets/images/icons/masterv-card2.svg")}
                              alt="card"
                              className="mr-9"
                            />
                            <img
                              src={require("../../../../assets/images/icons/visa-card-v2.svg")}
                              alt="card"
                            />
                          </div> */}
                        </Col>
                        <Col md={24}>
                          <Row gutter={28} className="card-custom-inner-row">
                            <Col md={24}>
                              <Form.Item label="Card Number" name="card_no">
                                <Input disabled />
                              </Form.Item>
                              <img
                                className="cart-payment-card-outline"
                                src={require("../../../../assets/images/icons/cart-payment-card-outline.jpg")}
                                alt="cart"
                              />
                              {/* <div className="check-uncheck-box">
                                <img
                                  className="input-status green-right"
                                  src={require("../../../../assets/images/icons/check-green-circle.svg")}
                                  alt="check-green-circle"
                                />
                                <img
                                  className="input-status red-cross"
                                  src={require("../../../../assets/images/icons/red-cross-circle.png")}
                                  alt="cross-red-circle"
                                />
                              </div> */}
                            </Col>
                          </Row>
                        </Col>
                        <Col md={24}>
                          <Row gutter={28} className="card-personal-box">
                            <Col md={12} className="name-on-card">
                              <Form.Item
                                label="Name"
                                name="name"
                              // rules={[required("Email id"), email]}
                              // onBlur={this.changeEmail}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col md={6} className="expiry-month">
                              <Form.Item
                                name="exp_month"
                                label="Expiry Month"
                                rules={[required("Expiry Month")]}
                              >
                                <Select
                                  placeholder="Select"
                                  onChange={this.onBusinessTypeChange}
                                  allowClear
                                >
                                  {[...Array(12).keys()].map((el, i) => {
                                    return (
                                      <Option key={el + 1} value={el + 1}>
                                        {el + 1}
                                      </Option>
                                    );
                                  })}
                                  {/* {businessType && this.bussinessCategory(businessType)} */}
                                </Select>
                              </Form.Item>
                              {/* <div className="check-uncheck-box">
                                <img
                                  className="input-status green-right"
                                  src={require("../../../../assets/images/icons/check-green-circle.svg")}
                                  alt="check-green-circle"
                                />
                                <img
                                  className="input-status red-cross"
                                  src={require("../../../../assets/images/icons/red-cross-circle.png")}
                                  alt="cross-red-circle"
                                />
                              </div> */}
                            </Col>
                            <Col md={6} className="expiry-year">
                              <Form.Item
                                name="exp_year"
                                label="Expiry Year"
                                rules={[required("Expiry Year")]}
                              >
                                <DatePicker
                                  // onChange={onChange}
                                  picker="year"
                                />
                              </Form.Item>
                              {/* <div className="check-uncheck-box">
                                <img
                                  className="input-status green-right"
                                  src={require("../../../../assets/images/icons/check-green-circle.svg")}
                                  alt="check-green-circle"
                                />
                                <img
                                  className="input-status red-cross"
                                  src={require("../../../../assets/images/icons/red-cross-circle.png")}
                                  alt="cross-red-circle"
                                />
                              </div> */}
                            </Col>
                          </Row>
                        </Col>
                        <div className="submit-step-action steps-action-to-step2">
                          <Button
                            type="default"
                            htmlType="button"
                            onClick={() => {
                              this.props.history.push("/payment-methods");
                            }}
                          >
                            Cancel
                          </Button>

                          <Button
                            type="default"
                            htmlType="submit"
                            form="submit-checkout-form"
                            className="btn-blue ml-20"
                          >
                            Update
                          </Button>
                        </div>
                      </Row>
                      {/* <div className='steps-action align-center mb-32'>
                        <Button htmlType='submit' type='primary' size='middle' className='btn-blue' >
                          Update
                        </Button>
                      </div> */}
                    </Form>
                  </Card>
                  {/* <div className="submit-step-action edit-payment-footer steps-action-to-step2">
                    <Button
                      type="default"
                      htmlType="button"
                      onClick={this.props.previousStep}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="default"
                      htmlType="submit"
                      onClick={this.saveTraderProfile}
                      form="submit-checkout-form"
                      className="btn-blue ml-20"
                    >
                      Update
                    </Button>
                  </div> */}
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
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
  };
};
export default connect(mapStateToProps, {
  updateDefaultCard,
  getCardDetails,
  updateCardDetails,
  enableLoading,
  disableLoading,
  deleteUserCard,
})(PaymentMethods);
