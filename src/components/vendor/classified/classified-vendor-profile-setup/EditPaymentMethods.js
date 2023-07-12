import React, { useState } from "react";
import {
  Layout,
  Card,
  Typography,
  Row,
  Col,
  Button,
  Form,
  Input,
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
import moment from "moment";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import { usePaymentInputs } from 'react-payment-inputs';
const { Title } = Typography;

const ExpiryInput = (props) => {
  const { getExpiryDateProps } = usePaymentInputs();
  const [expiryDate, setExpiryDate] = useState(props.value);
  const handleChangeExpiryDate = (e) => {
    setExpiryDate(e.target.value)
    props.onExpiryChange(e.target.value)
  } 
  return ( 
      <input className="ant-input "
        {...getExpiryDateProps({ 
          onChange: handleChangeExpiryDate,
          // onBlur: () => props.onExpiryChange(expiryDate)
        })} 
        value={expiryDate} 
      />
  )
}

class PaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      cardDetail: null,
      exp_date: null,
      name: null,
      cvv: null,
      expiryError: '',
      expiryCheckTick: true,
      nameCheckTick: true,
      cvvCheckTick: true, 

    };
  }

  componentWillMount() {
    const { userDetails } = this.props;
    let cardId = this.props.match.params.id;
    if (userDetails) {
      let cardIndex = userDetails.stripe_sources.findIndex(
        (el) => el.id === Number(cardId)
      );
      let exp_date = moment(
        `${userDetails.stripe_sources[cardIndex].exp_month}/${userDetails.stripe_sources[cardIndex].exp_year}`,
        "MM/YYYY"
      ).format('MM/YY')
      this.setState({
        exp_date,
      });
    }
    this.props.enableLoading()
    this.props.getCardDetails({ card_id: cardId }, (res) => {
      this.props.disableLoading()
      if (res.status === STATUS_CODES.OK) {
        let exp_date = moment(`${res.data.card.exp_month}/${res.data.card.exp_year}`, "MM/YYYY").format('MM/YY');
        this.setState({ 
          cardDetail: res.data.card,
          exp_date,
          name: res.data.card.name,
          cvv: '***'
        });
      }
    });
  }

  /**
   * @method onFinish
   * @description called to submit form
   */
  onFinish = (values) => {
    const { cardDetail, exp_date, name } = this.state;
    let splitValue = exp_date.split('/');
    let month = splitValue[0].trim();
    let year = splitValue[1].trim();

    let reqData = {
      exp_year: year,
      exp_month: month,
      name,
      card_id: cardDetail.id,
    };
    this.props.updateCardDetails(reqData, (res) => {
      console.log("res: ", res);
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.UPDATE_PAYMENT_CARD);
        this.setState({ cardDetail: res.data.card });
        this.props.history.push("/myProfile");
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
      let exp_date = moment(
        `${userDetails.stripe_sources[cardIndex].exp_month}/${userDetails.stripe_sources[cardIndex].exp_year}`,
        "MM/YYYY"
      ).format('MM/YY')
      return {
        card_no: `**** **** **** ${userDetails.stripe_sources[cardIndex].last4}`,
        name: userDetails.stripe_sources[cardIndex].name,
        exp_date,
        cvv: '***',
      };
    }
  };

  onExpiryChange = (value) => {
    console.clear();
    console.log('value: ', value)
    value = value.replace(' ', '')
    let splitValue = value.split('/')
    if(splitValue.length == 2) {
      let month = splitValue[0].trim();
      let year = splitValue[1].trim();
      if(month > 0 && month <= 12 && month.length == 2 && year.length == 2) {
        let target = moment(`${month}/${year}`, 'MM/YY');
        let compare = moment();
        let diff = moment(target).diff(compare, 'months')
        if(diff < 0) {
          this.setState({
            expiryError: 'Please enter future expiry date.',
            expiryCheckTick: false
          })
        } else {
          this.setState({
            expiryError: '',
            expiryCheckTick: true
          })
        }
      } else {
        this.setState({
          expiryError: 'Enter vaid date',
          expiryCheckTick: false
        })
      }
    } else {
      this.setState({
        expiryError: 'Enter vaid date',
        expiryCheckTick: false
      })
    }

    this.setState({
      exp_date: value
    })
  }

  render() {
    return (
      <Layout>
        <Layout className="profile-vendor-retail-transaction-order add-an-edit-another-payment-methods">
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box edit-payment"
              style={{ minHeight: 800 }}
            >
              <div className="pt-20 pl-60">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Edit Payment Methods</Title>
                  </div>
                </div>
                <div className="profile-content-box edit-vbox">
                  <Card
                    bordered={false}
                    className="add-content-box job-application edit-payment-method-page"
                  >
                    <Form
                      onFinish={this.onFinish}
                      initialValues={this.getInitialValue()}
                    >
                      <Row className="grid-block edit-payment-methods">
                        <div class="edit-box-top">
                        <Col md={24}>
                          <h3>Credit / Debit Card</h3>
                          <p className="subTitle">
                            Safe money transfer using your bank account. Visa,
                            Maestro, Discover...
                          </p>
                          <div className="visa-card-icon">
                            <img
                              src={require("../../../../assets/images/icons/masterv-card2.svg")}
                              alt="card"
                              className="mr-9"
                            />
                            <img
                              src={require("../../../../assets/images/icons/visa-card-v2.svg")}
                              alt="card"
                            />
                          </div>
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
                              <div className="check-uncheck-box">
                                <img
                                  className="input-status green-right"
                                  src={require("../../../../assets/images/icons/check-green-circle.svg")}
                                  alt="check-green-circle"
                                />
                              </div>
                            </Col>
                          </Row>
                        </Col>
     
                        <Col md={24}>
                          <Row gutter={28} className="card-personal-box">
                            <Col md={12} className="name-on-card">
                              <Form.Item
                                label="Name"
                                name="name"
                                rules={[required("Name")]}
                                onChange={(e) => {
                                  if(e.target.value) {
                                    this.setState({
                                      name: e.target.value,
                                      nameCheckTick: true
                                    })
                                  } else {
                                    this.setState({
                                      name: '',
                                      nameCheckTick: false
                                    })
                                  }
                                }}
                              >
                                <Input />
                                <div className="check-uncheck-box boxname">
                                {this.state.nameCheckTick && (
                                  <img
                                    className="input-status green-right"
                                    src={require("../../../../assets/images/icons/check-green-circle.svg")}
                                    alt="check-green-circle"
                                  />
                                )}
                                {!(this.state.name == null) && !this.state.name && <img
                                  className="input-status red-cross"
                                  src={require("../../../../assets/images/icons/red-cross-circle.png")}
                                  alt="cross-red-circle"
                                />}
                              </div>
                              </Form.Item>
                             
                            </Col>
                     
                            <Col md={6} className="expiry-month edit-expiry-month">
                              <Form.Item
                                name="exp_date"
                                label="Expiry Date"
                                rules={[required("Expiry Date")]}
                                onChange={this.onExpiryChange}
                              >
                                <ExpiryInput 
                                  value={this.state.exp_date ?? ''} 
                                  onExpiryChange={this.onExpiryChange} 
                                />
                                {this.state.expiryError && (<span>{this.state.expiryError}</span>)}
                                <div className="check-uncheck-box">
                                {this.state.expiryCheckTick && (
                                  <img
                                    className="input-status green-right"
                                    src={require("../../../../assets/images/icons/check-green-circle.svg")}
                                    alt="check-green-circle"
                                  />
                                )}
                                {this.state.expiryError && (
                                  <img
                                    className="input-status red-cross"
                                    src={require("../../../../assets/images/icons/red-cross-circle.png")}
                                    alt="cross-red-circle"
                                  />
                                )}
                              </div>
                              </Form.Item>
                              
                            </Col>
           
                            <Col md={6} className="expiry-year">
                              <Form.Item
                                name="cvv"
                                label="CVV"
                                rules={[required("CVV")]}
                                onChange={(e) => {
                                  if(e.target.value.length == 3) {
                                    this.setState({
                                      cvvCheckTick: true
                                    })
                                  } else {
                                    this.setState({
                                      cvvCheckTick: false
                                    })
                                  }
                                }} 
                              >
                                <Input maxLength="3" className="cvv" />
                                <div className="check-uncheck-box">
                                {this.state.cvvCheckTick && (
                                  <img
                                    className="input-status green-right"
                                    src={require("../../../../assets/images/icons/check-green-circle.svg")}
                                    alt="check-green-circle"
                                  />
                                )}
                                {/* <img
                                  className="input-status red-cross"
                                  src={require("../../../../assets/images/icons/red-cross-circle.png")}
                                  alt="cross-red-circle"
                                /> */}
                              </div>
                              </Form.Item>
                             
                            </Col>
                          </Row>
                        </Col></div>
                        <div className="submit-step-action steps-action-to-step2">
                          <Button
                            type="default"
                            htmlType="button" className="blue-blank"
                            onClick={() => {
                              this.props.history.push("/myProfile");
                            }}
                          >
                            Cancel
                          </Button>

                          <Button
                            type="default"
                            htmlType="submit"
                            form="submit-checkout-form"
                            className="btn-blue ml-20"
                            onClick={this.onFinish}
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
