import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import {
  Layout,
  Card,
  Typography,
  Button,
  Tabs,
  Table,
  Row,
  Col,
  Input,
  Select,
  Radio,
  Checkbox,
} from "antd";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import "../../vendor-profiles/bookingVendorCommon.less";
import {
  updateDefaultCard,
  enableLoading,
  disableLoading,
  deleteUserCard,
  getUserProfile,
  getTraderProfile,
} from "../../../../actions";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import DeleteModel from "../../../common/DeleteModel";

const { Title } = Typography;

class PaymentMethods extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      stripeSources: [],
      delete_model: false,
      selectedCardId: "",
      isPapPalVerified: false,
      isStripeVerified: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.loggedInUser;
    this.props.getTraderProfile({ user_id: id }, (res) => {
      const userDetails = res.data;
      console.log(res, "userDetails: ");
      if (res.status === STATUS_CODES.OK) {
        console.log("userDetails$$: ", userDetails);

        if (userDetails.accepted_payment_methods.paypal) {
          console.log(
            "userDetails.accepted_payment_methods.paypal",
            userDetails.accepted_payment_methods.paypal
          );
          this.setState({
            isPapPalVerified: true,
          });
        }
        if (userDetails.accepted_payment_methods.stripe) {
          console.log(
            "userDetails.accepted_payment_methods.paypal",
            userDetails.accepted_payment_methods.stripe
          );
          this.setState({
            isStripeVerified: true,
          });
        }
      }
    });

    // const { userDetails } = this.props;
  }

  updateDefaultCard = (selectedRowKeys) => {
    let data = {
      card_id: selectedRowKeys[0],
    };
    this.props.enableLoading();
    this.props.updateDefaultCard(data, (res) => {
      this.props.disableLoading();
      this.setState({ selectedRowKeys });
    });
  };

  deleteUserCard = (cardId) => {
    const { id } = this.props.userDetails;
    let data = {
      card_id: cardId,
    };
    this.props.enableLoading();
    this.props.deleteUserCard(data, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        this.props.getTraderProfile({ user_id: id }, (res) => {
          console.log("res: %%", res);
          if (res.status === STATUS_CODES.OK) {
            this.setState({ stripeSources: [...res.data.data.stripe_sources] });
          }
        });
        toastr.success(langs.success, MESSAGES.DELETE_PAYMENT_CARD);
      }
    });
  };
  render() {
    const { delete_model, selectedCardId } = this.state;
    console.log("this.state.isPapPalVerified", this.state);
    const columns = [
      {
        title: "Payment Information",
        key: "funding",
        dataIndex: "funding",
        render: (cell, row, index) => {
          return <div>Credit/Debit</div>;
        },
      },
      // {
      //   title: "Type",
      //   key: "brand",
      //   dataIndex: "brand",
      //   render: (cell, row, index) => {
      //     return <div>{row.brand}</div>;
      //   },
      // },
      // {
      //   title: "Card Number",
      //   key: "last4",
      //   dataIndex: "last4",
      //   render: (cell, row, index) => {
      //     return (
      //       <div>
      //         Ending in ***{row.last4}{" "}
      //         <span>
      //           {row.brand === "Visa" ? (
      //             <img
      //               src={require("../../../../assets/images/icons/visa.svg")}
      //               alt="visa"
      //               width="31"
      //               height="19"
      //             />
      //           ) : row.brand === "MasterCard" ? (
      //             <img
      //               src={require("../../../../assets/images/icons/mastero.svg")}
      //               alt="mastero"
      //               width="31"
      //               height="19"
      //             />
      //           ) : (
      //             ""
      //           )}
      //         </span>
      //       </div>
      //     );
      //   },
      // },
      // {
      //   title: "Name On Card",
      //   key: "name",
      //   dataIndex: "name",
      //   render: (cell, row, index) => {
      //     return <div className="card-name">{row.name}</div>;
      //   },
      // },
      // {
      //   title: "Expiration",
      //   key: "expiry",
      //   dataIndex: "expiry",
      //   render: (cell, row, index) => {
      //     return (
      //       <div>
      //         {row.exp_month}/{row.exp_year}
      //       </div>
      //     );
      //   },
      // },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render: (cell, row, index) => {
          return (
            <div className="verified">
              <Button
                className="verified-approve"
                type="primary"
                icon={<CheckOutlined />}
              >
                Verified
              </Button>
            </div>
          );
        },
      },
      // {
      //   render: (cell, row, index) => {
      //     return (
      //       <div className="action">
      //         <img
      //           src={require("../../../../assets/images/icons/edit-gray.svg")}
      //           alt="edit"
      //           onClick={() => {
      //             this.props.history.push(`/edit-payment-methods/${row.id}`);
      //           }}
      //         />
      //         <img
      //           src={require("../../../../assets/images/icons/delete.svg")}
      //           alt="delete"
      //           onClick={() => {
      //             this.setState({ delete_model: true, selectedCardId: row.id });
      //             // this.deleteUserCard(row.id);
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      // },
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.updateDefaultCard,
    };
    return (
      <Layout>
        <Layout className="profile-vendor-retail-transaction-order retail-ven-payment-method-v2">
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.PAYMENTS}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box payment-method-wrapper"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="profile-content-box mt-48">
                  <div className="heading-search-block">
                    <div className="">
                      <Row gutter={0}>
                        <Col xs={24} md={24} lg={24} xl={24}>
                          <h1
                            className="bdr-btm-none"
                            style={{ borderBottom: "1px solid transparent" }}
                          >
                            <span>Payment Methods</span>
                          </h1>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <Row className="grid-block">
                    <Col md={24}>
                      <h3>Your saved payment methods</h3>
                    </Col>
                    <Row className="grid-head">
                      <Col md={12}>
                        <h3>Payment Information</h3>
                      </Col>
                      <Col md={12}>
                        <h3>Status</h3>
                      </Col>
                    </Row>
                    {this.state.isPapPalVerified == true && (
                      <Row className="grid-row">
                        <Col md={12}>
                          <Row>
                            <Radio value="paypal">
                              {/* <label className="paypal-label">PayPal</label>
                              <p className="discription">
                                You will be redirected to PayPal website to
                                complete your purchase securely.
                              </p> */}
                            </Radio>
                            <div className="visa-card-icon">
                              <img
                                src={require("../../../../assets/images/paypal-transparent-icon.png")}
                                alt="paypal-icon"
                                className="paypal-icon"
                              />
                            </div>
                          </Row>
                        </Col>
                        <Col md={12}>
                          {this.state.isPapPalVerified == true ? (
                            <Button
                              type="primary"
                              htmlType="button"
                              // onClick={() => this.verify()}
                              disabled
                              className="btn-paypal-payment btn-paypal-verified"
                            >
                              <img
                                src={require("../../../../assets/images/check-verified.svg")}
                                alt=""
                              />
                              Verified
                            </Button>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                    )}
                    {this.state.isStripeVerified == true && (
                      <Row className="grid-row">
                        <Col md={12}>
                          <Row>
                            <Radio value="paypal">
                              {/* <label className="paypal-label">Stripe</label>
                              <p className="discription">
                                You will be redirected to the Stripe website to
                                complete your verification securely.
                              </p> */}
                            </Radio>
                            <div className="visa-card-icon">
                              <img
                                src={require("../../../../assets/images/stripe-transparent-icon.png")}
                                alt="paypal-icon"
                                className="paypal-icon"
                              />
                            </div>
                          </Row>
                        </Col>
                        <Col md={12}>
                          {this.state.isStripeVerified == true ? (
                            <Button
                              type="primary"
                              htmlType="button"
                              // onClick={() => this.verify()}
                              disabled
                              className="btn-paypal-payment btn-paypal-verified btn-stripe-verified"
                            >
                              <img
                                src={require("../../../../assets/images/check-verified.svg")}
                                alt=""
                              />
                              Verified
                            </Button>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                    )}
                  </Row>

                  {/* <div className="add-another-payment ">
                    <Link to="/add-payment-methods">
                      Add another payment method
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
            {/* {delete_model && (
              <DeleteModel
                visible={delete_model}
                onCancel={() => this.setState({ delete_model: false })}
                callDeleteAction={() => this.deleteUserCard(selectedCardId)}
                label={"payment methods"}
              />
            )} */}
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
  enableLoading,
  disableLoading,
  deleteUserCard,
  getUserProfile,
  getTraderProfile,
})(PaymentMethods);
