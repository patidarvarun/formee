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

import history from "../../../../common/History";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import {
  updateDefaultCard,
  enableLoading,
  disableLoading,
  deleteUserCard,
  getUserProfile,
} from "../../../../actions";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import DeleteModel from "../../../common/DeleteModel";
// import EditPaymentMethods from "./EditPaymentMethods";
// import AddpaymentMethods from "./AddpaymentMethod";

const { Title } = Typography;

class PaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      stripeSources: [],
      delete_model: false,
      selectedCardId: "",
    };
  }

  componentDidMount() {
    const { id } = this.props.loggedInUser;
    const { userDetails } = this.props;
    console.log("userDetails = " + JSON.stringify(userDetails));
    this.props.getUserProfile({ user_id: id }, (res) => {
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
            });
          } else {
            this.setState({
              stripeSources: userDetails.stripe_sources,
            });
          }
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
        this.props.getUserProfile({ user_id: id }, (res) => {
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
    const { userDetails, loggedInUser } = this.props;
    const columns = [
      {
        key: "brand, last4",
        dataIndex: "brand, last4",
        render: (cell, row, index) => {
          return (
            
            <div>
              
              <strong>{row.brand} </strong> ending in ***{row.last4}{" "}
              <span>
                {row.brand === "Visa" ? (
                  <img
                    src={require("../../../../assets/images/icons/visa.svg")}
                    alt="visa"
                    width="31"
                    height="19"
                  />
                ) : row.brand === "MasterCard" ? (
                  <img
                    src={require("../../../../assets/images/icons/mastero.svg")}
                    alt="mastero"
                    width="31"
                    height="19"
                  />
                ) : (
                  ""
                )}
              </span>
            </div>
          );
        },
      },
      {
        title: "Name On Card",
        key: "name",
        dataIndex: "name",
        render: (cell, row, index) => {
          return <div className="card-name">{row.name}</div>;
        },
      },
      {
        title: "Expiration",
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

      {
        render: (cell, row, index) => {
          return (
            <div className="action">
              <img
                className="edit-table"
                src={require("./icon/edit.svg")}
                alt="edit"
                onClick={() => {
                  // this.props.history.push('/profile-payment-methods');
                  this.props.history.push(
                    "/edit-profile-payment-methods/" + `${row.id}`
                  );
                }}
              />
              <img
                className="delete-table"
                src={require("./icon/delete.svg")}
                alt="delete"
                onClick={() => {
                  this.setState({ delete_model: true, selectedCardId: row.id });
                  // this.deleteUserCard(row.id);
                }}
              />
            </div>
          );
        },
      },
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.updateDefaultCard,
    };
    return (
      <Layout className="card-detail background-none">
        {this.state.stripeSources.length >= 1 ? (
          
          
          <Card
            bordered={false}
            className="payment-grid-view"
            // title='Orders Management'
          >
           
            <Row className="grid-block">
              <Col md={24}>
                <h2 className="your-saved">Your saved payment methods</h2>
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
            <div className={userDetails.is_paypal_verified == 1 && userDetails.paypal_verification_code != null ? 'paypal-box is-shown' : 'is-hidden'}>
                     <div class="paypal-box-inner">
                     <span><img src={require('./icon/paypal.svg')} alt='edit' className="pr-10"/></span>
                       <span>
                         <svg width="108" height="30" viewBox="0 0 108 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="1" width="106" height="28" rx="3" fill="white" stroke="#4A90E2" stroke-width="2"/>
<path d="M44.7997 10.624L41.7277 19H39.6877L36.6157 10.624H38.4157L40.7197 17.284L43.0117 10.624H44.7997ZM52.107 15.532C52.107 15.772 52.091 15.988 52.059 16.18H47.199C47.239 16.66 47.407 17.036 47.703 17.308C47.999 17.58 48.363 17.716 48.795 17.716C49.419 17.716 49.863 17.448 50.127 16.912H51.939C51.747 17.552 51.379 18.08 50.835 18.496C50.291 18.904 49.623 19.108 48.831 19.108C48.191 19.108 47.615 18.968 47.103 18.688C46.599 18.4 46.203 17.996 45.915 17.476C45.635 16.956 45.495 16.356 45.495 15.676C45.495 14.988 45.635 14.384 45.915 13.864C46.195 13.344 46.587 12.944 47.091 12.664C47.595 12.384 48.175 12.244 48.831 12.244C49.463 12.244 50.027 12.38 50.523 12.652C51.027 12.924 51.415 13.312 51.687 13.816C51.967 14.312 52.107 14.884 52.107 15.532ZM50.367 15.052C50.359 14.62 50.203 14.276 49.899 14.02C49.595 13.756 49.223 13.624 48.783 13.624C48.367 13.624 48.015 13.752 47.727 14.008C47.447 14.256 47.275 14.604 47.211 15.052H50.367ZM55.1332 13.384C55.3492 13.032 55.6292 12.756 55.9732 12.556C56.3252 12.356 56.7252 12.256 57.1732 12.256V14.02H56.7292C56.2012 14.02 55.8012 14.144 55.5292 14.392C55.2652 14.64 55.1332 15.072 55.1332 15.688V19H53.4532V12.352H55.1332V13.384ZM59.2768 11.56C58.9808 11.56 58.7328 11.468 58.5328 11.284C58.3408 11.092 58.2448 10.856 58.2448 10.576C58.2448 10.296 58.3408 10.064 58.5328 9.88C58.7328 9.688 58.9808 9.592 59.2768 9.592C59.5728 9.592 59.8168 9.688 60.0088 9.88C60.2088 10.064 60.3088 10.296 60.3088 10.576C60.3088 10.856 60.2088 11.092 60.0088 11.284C59.8168 11.468 59.5728 11.56 59.2768 11.56ZM60.1048 12.352V19H58.4248V12.352H60.1048ZM64.9326 13.732H63.7686V19H62.0646V13.732H61.3086V12.352H62.0646V12.016C62.0646 11.2 62.2966 10.6 62.7606 10.216C63.2246 9.832 63.9246 9.652 64.8606 9.676V11.092C64.4526 11.084 64.1686 11.152 64.0086 11.296C63.8486 11.44 63.7686 11.7 63.7686 12.076V12.352H64.9326V13.732ZM66.9934 11.56C66.6974 11.56 66.4494 11.468 66.2494 11.284C66.0574 11.092 65.9614 10.856 65.9614 10.576C65.9614 10.296 66.0574 10.064 66.2494 9.88C66.4494 9.688 66.6974 9.592 66.9934 9.592C67.2894 9.592 67.5334 9.688 67.7254 9.88C67.9254 10.064 68.0254 10.296 68.0254 10.576C68.0254 10.856 67.9254 11.092 67.7254 11.284C67.5334 11.468 67.2894 11.56 66.9934 11.56ZM67.8214 12.352V19H66.1414V12.352H67.8214ZM75.7812 15.532C75.7812 15.772 75.7652 15.988 75.7332 16.18H70.8732C70.9132 16.66 71.0812 17.036 71.3772 17.308C71.6732 17.58 72.0372 17.716 72.4692 17.716C73.0932 17.716 73.5372 17.448 73.8012 16.912H75.6132C75.4212 17.552 75.0532 18.08 74.5092 18.496C73.9652 18.904 73.2972 19.108 72.5052 19.108C71.8652 19.108 71.2892 18.968 70.7772 18.688C70.2732 18.4 69.8772 17.996 69.5892 17.476C69.3092 16.956 69.1692 16.356 69.1692 15.676C69.1692 14.988 69.3092 14.384 69.5892 13.864C69.8692 13.344 70.2612 12.944 70.7652 12.664C71.2692 12.384 71.8492 12.244 72.5052 12.244C73.1372 12.244 73.7012 12.38 74.1972 12.652C74.7012 12.924 75.0892 13.312 75.3612 13.816C75.6412 14.312 75.7812 14.884 75.7812 15.532ZM74.0412 15.052C74.0332 14.62 73.8772 14.276 73.5732 14.02C73.2692 13.756 72.8972 13.624 72.4572 13.624C72.0412 13.624 71.6892 13.752 71.4012 14.008C71.1212 14.256 70.9492 14.604 70.8852 15.052H74.0412ZM76.6955 15.652C76.6955 14.98 76.8275 14.384 77.0915 13.864C77.3635 13.344 77.7315 12.944 78.1955 12.664C78.6595 12.384 79.1755 12.244 79.7435 12.244C80.1755 12.244 80.5875 12.34 80.9795 12.532C81.3715 12.716 81.6835 12.964 81.9155 13.276V10.12H83.6195V19H81.9155V18.016C81.7075 18.344 81.4155 18.608 81.0395 18.808C80.6635 19.008 80.2275 19.108 79.7315 19.108C79.1715 19.108 78.6595 18.964 78.1955 18.676C77.7315 18.388 77.3635 17.984 77.0915 17.464C76.8275 16.936 76.6955 16.332 76.6955 15.652ZM81.9275 15.676C81.9275 15.268 81.8475 14.92 81.6875 14.632C81.5275 14.336 81.3115 14.112 81.0395 13.96C80.7675 13.8 80.4755 13.72 80.1635 13.72C79.8515 13.72 79.5635 13.796 79.2995 13.948C79.0355 14.1 78.8195 14.324 78.6515 14.62C78.4915 14.908 78.4115 15.252 78.4115 15.652C78.4115 16.052 78.4915 16.404 78.6515 16.708C78.8195 17.004 79.0355 17.232 79.2995 17.392C79.5715 17.552 79.8595 17.632 80.1635 17.632C80.4755 17.632 80.7675 17.556 81.0395 17.404C81.3115 17.244 81.5275 17.02 81.6875 16.732C81.8475 16.436 81.9275 16.084 81.9275 15.676Z" fill="#4A90E2"/>
<path d="M19.658 17.0473L17.1242 14.4945L17.0178 14.3873L16.9113 14.4945L16.0312 15.3812L15.9264 15.4869L16.0312 15.5925L19.5515 19.1392L19.658 19.2465L19.7645 19.1392L27.308 11.5392L27.4129 11.4335L27.308 11.3279L26.4279 10.4412L26.3214 10.3339L26.215 10.4412L19.658 17.0473Z" fill="#4A90E2" stroke="#4A90E2" stroke-width="0.3"/>
</svg></span>
                     </div>
                  </div>
            <div className="add-another-payment ">
              <Link
                to={{
                  pathname: "/add-profile-payment-methods",
                  state: { showLater: false },
                }}
              >
                Add another payment method
              </Link>
            </div>
            
          </Card>
        ) : (
          <div className="add-another-payment no-add-card ">
            <h4>No saved payment methods</h4>
            <Link
              to={{
                pathname: "/add-profile-payment-methods",
                state: { showLater: false },
              }}
            >
              Add another payment method
            </Link>
          </div>
        )}
        
        {delete_model && (
          <DeleteModel
            visible={delete_model}
            onCancel={() => this.setState({ delete_model: false })}
            callDeleteAction={() => this.deleteUserCard(selectedCardId)}
            label={"payment method"}
          />
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
  updateDefaultCard,
  enableLoading,
  disableLoading,
  deleteUserCard,
  getUserProfile,
})(PaymentMethods);
