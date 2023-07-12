import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
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
  Tooltip,
} from "antd";
import {
  enableLoading,
  disableLoading,
  getUserProfile,
} from "../../../actions";
import { STATUS_CODES } from "../../../config/StatusCode";
import { QuestionCircleOutlined } from "@ant-design/icons";

class PaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      stripeSources: [],
      delete_model: false,
      selectedCardId: "",
      selectedRow: "",
      cvv: "",
      defaultCard: "",
    };
  }

  componentDidMount() {
    this.getAllSavedCards();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isSavedCardPayment != nextProps.isSavedCardPayment &&
      nextProps.isSavedCardPayment == false
    ) {
      this.setState({
        selectedRow: "",
        selectedRowKeys: [],
      });
    }

    if (
      this.props.reFetchCards != nextProps.reFetchCards &&
      nextProps.reFetchCards == true
    ) {
      this.getAllSavedCards();
    }
  }

  getAllSavedCards = () => {
    const { id } = this.props.loggedInUser;
    this.props.getUserProfile({ user_id: id }, (res) => {
      console.log(`getUserProfile `, res);
      const userDetails = res.data?.data;
      if (res.status === STATUS_CODES.OK) {
        if (userDetails && Array.isArray(userDetails.stripe_sources)) {
          const isDefault = userDetails.stripe_sources.find(
            (stripe_source) => stripe_source.is_default == 1
          );
          if (isDefault) {
            this.setState({
              stripeSources: userDetails.stripe_sources,
              selectedRowKeys: [isDefault.id],
              defaultCard: isDefault.id,
            });
            this.props.onSelectSavedCard(
              userDetails.stripe_sources.filter((el) => el.id == isDefault.id)
            );
          } else {
            this.setState({
              stripeSources: userDetails.stripe_sources,
            });
          }
        }
      }
    });
  };

  render() {
    const { delete_model, selectedCardId, selectedRowKeys, cvv } = this.state;

    const columns = [
      {
        key: "brand, last4",
        dataIndex: "brand, last4",
        render: (cell, row, index) => {
          return (
            <div>
              <div>
                <strong>{row.brand} </strong> ending in ***{row.last4}{" "}
                <span>
                  {row.brand === "Visa" ? (
                    <img
                      src={require("../../../assets/images/icons/visa.svg")}
                      alt="visa"
                      width="31"
                      height="19"
                    />
                  ) : row.brand === "MasterCard" ? (
                    <img
                      src={require("../../../assets/images/icons/mastero.svg")}
                      alt="mastero"
                      width="31"
                      height="19"
                    />
                  ) : (
                    ""
                  )}
                </span>
              </div>
              {selectedRowKeys.includes(row.id) && (
                <div className="entercvv">
                  <label>Enter CVV</label>
                  <input
                    type="text"
                    placeholder="***"
                    maxLength="3"
                    onChange={(e) => {
                      let regex = /^[0-9]+$/;
                      if (
                        // check if cvv is real number only
                        !e.target.value.match(regex) &&
                        !e.target.value == ""
                      ) {
                        return;
                      }
                      this.setState({
                        cvv: e.target.value,
                      });
                      this.props.onChangeCvv(e.target.value);
                    }}
                    value={cvv}
                  />
                  <Tooltip
                    title="Enter the CVC number"
                    className={"cvc-tooltip"}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.5 11C21.5 16.799 16.799 21.5 11 21.5C5.20101 21.5 0.5 16.799 0.5 11C0.5 5.20101 5.20101 0.5 11 0.5C16.799 0.5 21.5 5.20101 21.5 11Z"
                        stroke="#788995"
                      />
                      <path
                        d="M10.156 12.172C10.156 11.556 10.2493 11.066 10.436 10.702C10.632 10.338 10.9353 10.0347 11.346 9.792C11.5327 9.68 11.7333 9.56333 11.948 9.442C12.172 9.32067 12.3867 9.18067 12.592 9.022C12.7973 8.854 12.9653 8.65333 13.096 8.42C13.2267 8.18667 13.292 7.89733 13.292 7.552C13.292 7.15067 13.1987 6.81467 13.012 6.544C12.8347 6.27333 12.5967 6.07267 12.298 5.942C12.0087 5.802 11.7053 5.732 11.388 5.732C10.8933 5.732 10.4453 5.872 10.044 6.152C9.64267 6.42267 9.33933 6.75867 9.134 7.16L8.476 6.74C8.73733 6.16133 9.13867 5.718 9.68 5.41C10.2213 5.09267 10.7953 4.934 11.402 4.934C11.8593 4.934 12.298 5.032 12.718 5.228C13.138 5.424 13.4787 5.718 13.74 6.11C14.0013 6.502 14.132 7.00133 14.132 7.608C14.132 8.10267 14.0387 8.504 13.852 8.812C13.6747 9.11067 13.4413 9.358 13.152 9.554C12.8627 9.74067 12.5593 9.92267 12.242 10.1C12.018 10.2213 11.808 10.3567 11.612 10.506C11.4253 10.6553 11.2713 10.8607 11.15 11.122C11.0287 11.374 10.968 11.724 10.968 12.172H10.156ZM10.17 15V13.502H10.996V15H10.17Z"
                        fill="#788995"
                      />
                    </svg>
                  </Tooltip>
                </div>
              )}
              {row.id == this.state.defaultCard && (
                <p className="recommended">This card is recommended for you.</p>
              )}
            </div>
          );
        },
      },
      {
        title: "Name",
        key: "name",
        dataIndex: "name",
        render: (cell, row, index) => {
          return <div className="card-name">{row.name}</div>;
        },
      },
      {
        title: "Expires On",
        key: "expiry",
        dataIndex: "expiry",
        render: (cell, row, index) => {
          return (
            <div>
              {row.exp_month}/{row.exp_year}
            </div>
          );
        },
      },
    ];

    // const rowSelection = {
    //   selectedRowKeys: this.state.selectedRowKeys,
    //   onChange: this.updateDefaultCard,
    // };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRow: selectedRows,
          selectedRowKeys,
          cvv: "",
        });
        this.props.onChangeCvv("");
        this.props.onSelectSavedCard(selectedRows);
      },
      selectedRowKeys: this.state.selectedRowKeys,
    };
    return (
      <Layout>
        {this.state.stripeSources.length >= 1 ? (
          <Card
            bordered={false}
            className="payment-grid-view"
            // title='Orders Management'
          >
            <Row className="grid-block">
              <Col md={24}>
                <h4 className="your-saved">
                  Your saved credit and debit cards
                </h4>
                <Table
                  dataSource={this.state.stripeSources}
                  columns={columns}
                  rowSelection={{
                    type: "radio",
                    ...rowSelection,
                  }}
                  pagination={false}
                  rowKey="id"
                  className="payment-table"
                ></Table>
              </Col>
            </Row>
          </Card>
        ) : (
          <div className="add-another-payment no-add-card ">
            <h4>No saved payment methods</h4>
          </div>
        )}
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
  enableLoading,
  disableLoading,
  getUserProfile,
})(PaymentMethods);
