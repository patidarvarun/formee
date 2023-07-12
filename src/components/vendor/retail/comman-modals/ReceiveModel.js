import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  Form,
  Input,
  Typography,
  Button,
  Modal,
  InputNumber,
  Select,
} from "antd";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../config/FormValidation";
import {
  enableLoading,
  disableLoading,
  updateOrderStatusAPI,
} from "../../../../actions";
import { langs } from "../../../../config/localization";
import { MESSAGES } from "../../../../config/Message";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { salaryNumberFormate } from "../../../common";
const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { span: 24 },
  className: "align-center pt-20",
};

class ReceiveModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      message: "",
    };
  }

  onFinish = (value) => {
    const { loggedInDetail, orderDetail } = this.props;
    const { status, message } = this.state;
    if (status && orderDetail) {
      let reqdata = {
        user_id: loggedInDetail.id,
        order_detail_id: orderDetail.id,
        update_by: status === "Cancelled" ? "Buyer" : "Seller",
        order_status: status,
        reason: message,
        message: message,
      };
      this.props.updateOrderStatusAPI(reqdata, (res) => {
        if (res.status === 200) {
          toastr.success(langs.success, langs.messages.change_status);
          this.props.callNext();
          this.props.onCancel();
        }
      });
    } else if (status === "") {
      toastr.warning("Please select the order status.");
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, orderDetail, userRetail } = this.props;
    let total = orderDetail
      ? Number(orderDetail.item_total_amt) + Number(orderDetail.order_gst_amount)
      : 0;
    let status = orderDetail && orderDetail.order_status;
    return (
      <Modal
        title="Order Received"
        visible={visible}
        className="custom-modal prf-vend-ordr-recive"
        onCancel={this.props.onCancel}
      >
        <div className="grid-block">
          <table>
            <tr>
              <th>Items</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
            <tr>
              <td>
                <div className="item">
                  {orderDetail && orderDetail.item_name}
                </div>
              </td>
              <td>
                <div className="price">
                  {orderDetail &&
                    `$${salaryNumberFormate(orderDetail.item_price)}`}
                </div>
              </td>
              <td>
                <div className="qua">
                  <InputNumber disabled defaultValue={orderDetail.item_qty} />
                </div>
              </td>
              <td>
                <div className="amt">
                  {orderDetail &&
                    `$${salaryNumberFormate(orderDetail.item_price * orderDetail.item_qty)}`}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="4">
                <table className="child-table">
                  <tr>
                    <td>
                      <div className="item">
                        <p>Subtotal</p>
                      </div>
                    </td>
                    <td>
                      <div className="amt">

                      {`$${salaryNumberFormate(
                       orderDetail.item_total_amt
                      )}`}

                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item">
                        <p>Taxes and surcharges</p>
                      </div>
                    </td>
                    <td>
                      <div className="amt">
                        {orderDetail &&
                          `$${salaryNumberFormate(
                            orderDetail.order_gst_amount
                          )}`}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item">
                        <p>Code promo FOR03</p>
                      </div>
                    </td>
                    <td>
                      <div className="amt">
                        {orderDetail &&
                        orderDetail.orders &&
                        orderDetail.orders.promo_code
                          ? `$${orderDetail.orders.promo_code}`
                          : "$0.00"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="item">
                        <p>Total</p>
                      </div>
                    </td>
                    <td>
                      <div className="amt">{`$${salaryNumberFormate (
                       parseFloat(orderDetail.item_total_amt) + parseFloat(orderDetail.order_gst_amount)
                      )}`}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        <div className="delivery-detail">
          <div className="left">
            <h3>Delivery Name :</h3>
            <p>
              {orderDetail &&
                orderDetail.orders &&
                `${orderDetail.orders.customer_fname}  ${orderDetail.orders.customer_lname}`}
            </p>

            <h3>Delivery Address :</h3>
            <p>
              {orderDetail &&
                orderDetail.orders &&
                `${orderDetail.orders.customer_address1}  ${orderDetail.orders.customer_postcode}`}
            </p>
          </div>

          <div className="right">
            <h3>Additional Noted :</h3>
            <p>{orderDetail && orderDetail.addtional_notes}</p>

            <h3>Payment :</h3>
            <p>
              {orderDetail &&
              orderDetail.orders &&
              orderDetail.orders.payment_method === "stripe"
                ? "Credit Card"
                : orderDetail.orders.payment_method}
            </p>
          </div>
        </div>
        <div className="status-detail">
          <h2>Status</h2>

          <div className="status-detail-body">
            <div className="form-item">
              <label>Change Order Status :</label>
              {userRetail ? (
                <Select
                  defaultValue={status}
                  onChange={(e) => {
                    this.setState({ status: e.target.value });
                  }}
                >
                  {status !== "Complete" && status !== "Cancelled" && (
                    <Option value="Cancelled">Cancelled</Option>
                  )}
                  {status !== "Complete" && status !== "Cancelled" && (
                    <Option value="Complete">Complete</Option>
                  )}
                </Select>
              ) : (
                <Select
                  onChange={(value) => {
                    this.setState({ status: value });
                  }}
                >
                  <Option value="Accepted">Accepted</Option>
                  <Option value="In Process">In Process</Option>
                  <Option value="Shipped">Shipped</Option>
                  <Option value="Delivered">Delivered</Option>
                  <Option value="Done">Done</Option>
                  {status !== "Complete" && status !== "Cancelled" && (
                    <Option value="Cancelled">Cancelled</Option>
                  )}
                  {status !== "Complete" && status !== "Cancelled" && (
                    <Option value="Rejected">Rejected</Option>
                  )}
                </Select>
              )}
            </div>
            <div className="form-item">
              <label>
                Send Message to User <i>(Optional)</i>
              </label>
              <TextArea
                rows={4}
                onChange={(e) => this.setState({ message: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="btn-block">
          <Button type="primary" className="btn-save" onClick={this.onFinish}>
            Save
          </Button>
          <Button type="primary" className="btn-send" htmlType="button">
            Send
          </Button>
        </div>
      </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};

export default connect(mapStateToProps, {
  updateOrderStatusAPI,
  enableLoading,
  disableLoading,
})(ReceiveModel);
