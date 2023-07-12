import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  Input,
  Button,
  Modal,
  InputNumber,
  Select,
  Dropdown,
  Menu,
  Avatar,
  Typography,
  List,
  Col,
  Row,
  Divider,
} from "antd";
import {
  enableLoading,
  disableLoading,
  updateOrderStatusAPI,
} from "../../../../actions";
import { langs } from "../../../../config/localization";
import { salaryNumberFormate } from "../../../common";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const { Option } = Select;

class OrderDetailModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: props.orderDetail ? props.orderDetail.order_status : "",
      message: "",
      statusArray: [],
      order_sub_total: 0
    };
  }

  /**
    * @method componentDidMount
    * @description called after render component
    */
  componentDidMount() {
    const { orderDetail, loggedInDetail } = this.props
    console.log(loggedInDetail.id, 'orderDetail: ');
    orderDetail.order_detail.map((el) => {
      if (loggedInDetail.id === el.order_detail_seller.id) {
        console.log(' el.order_detail_seller.id: ', el);
      }
    })
  }


  onFinish = (value) => {
    const { loggedInDetail, orderDetail } = this.props;
    const { status, message, statusArray } = this.state;
    if (status && orderDetail) {
    } else if (status === "") {
      toastr.warning("Please select the order status.");
    }
  };

  /**
    * @method change classified status
    * @description change classified status
    */
  changeStatus = (status, item) => {
    console.log('item: ', item);
    this.props.enableLoading();
    // const { loggedInUser } = this.props;
    // const { search_keyword } = this.state;
    let reqdata = {
      order_detail_id: item.id,
      update_by: status === "Cancelled" ? "Buyer" : "Seller",
      order_status: status,
    };
    this.props.updateOrderStatusAPI(reqdata, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, langs.messages.change_status);
        this.props.getOrderDetails(item.order_id, item.id);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, orderDetail, userRetail, type } = this.props;
    let total = orderDetail
      ? Number(orderDetail.item_price) + Number(orderDetail.order_gst_amount)
      : 0;
    let status = orderDetail && orderDetail.order_status;
    let totalGst = 0, order_sub_total = 0
    Array.isArray(orderDetail.order_detail) && orderDetail.order_detail.map((el) => {
      totalGst = totalGst + Number(el.order_gst_amount)
      order_sub_total = order_sub_total + Number(el.item_total_amt)
    })
    let promo_code_discount = (Number(order_sub_total)) * Number(orderDetail.discount_percent)/100
    let grand_total = Number(totalGst) + Number(order_sub_total) - Number(promo_code_discount)
    let subOrder = (Array.isArray(orderDetail.order_detail) && orderDetail.order_detail.length) ? orderDetail.order_detail[0] : null
    return (
      <Modal
        visible={visible}
        className="custom-modal OrderDetailModal"
        closable={false}
      >
        <ArrowLeftOutlined onClick={this.props.onCancel} />
        <div className="header">
          <Row>
            <Col md={12}>
              <div>
                <h2>
                  {type === 'order' ? `Order #${orderDetail.formee_order_number}` : `Order #${subOrder.sub_order_id}`}
                  <br />
                  <span className="CustomerName">
                    {orderDetail.customer_fname} {orderDetail.customer_lname}
                  </span>
                </h2>
                <p className="CustomerAddress">
                  {orderDetail.customer_address1}
                </p>
              </div>
            </Col>
            <Col md={12}>
              <div className="modal-header-right-box text-right">
                {status === "Complete" ? (
                  <p>Order Status: {status}</p>
                ) : (
                  <React.Fragment>
                   
                  </React.Fragment>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <List
          className="orderDetailBox"
          itemLayout="horizontal"
          dataSource={orderDetail.order_detail}
          renderItem={(item) => {
            return (
              <div> 
              <div className="status-btn">
                  <Select
                    value={item.order_status}
                    disableLoading={true}
                  ></Select>
              </div>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        item.order_detail_product.classified_imageSingle.image_url
                      }
                    />
                  }
                  title={<p>{item.item_name}</p>}
                  description={
                    <div className="descriptionBox">
                      <div className="d-flex">
                        <div className="mr-30 d-flex">
                          <label className="label">Price:</label>
                          <div className="value">${item.item_price}</div>
                        </div>
                        <div className="d-flex">
                          <label className="label">Quantity:</label>
                          <div className="value">{item.item_qty}</div>
                        </div>
                      </div>
                        <div className="d-flex total-box">
                          <label className="label">Total:$</label>
                          <div className="value">{item.item_total_amt}</div>
                        </div>                     
                    </div>
                  }
                />
              </List.Item>
              </div>
            )
          }}
        />
        <div className="order-footer">
          <Row style={{ alignItems: "flex-end" }}>
            <Col md={12} className="order-footer-left-box">
              <div className="inner-left-block">
                <label className="label">Payment</label>
                <div className="value">{orderDetail.payment_method}</div>
              </div>
              <div className="inner-left-block ml-80">
                <label className="label">Additional Notes</label>
                <div className="value">Notes</div>
              </div>
            </Col>
            <Col md={5}></Col>
            <Col md={7} className="text-right order-footer-right-box">
              <div className="d-flex">
                <label className="label">Subtotal</label>
                {type == 'order' ? <div className="value">${order_sub_total}</div> :
                  <div className="value">${subOrder.item_total_amt}</div>
                }
              </div>
              <div className="d-flex">
                <label className="label">GST amount:</label>
                {type === 'order' ? <div className="value">${totalGst} </div> :
                  <div className="value">${subOrder.order_gst_amount}</div>}
              </div>
              {orderDetail.promo_code && (
                <div className="d-flex">
                  <label className="label">
                    Code promo {orderDetail.promo_code}
                  </label>
                  <div className="value">- ${promo_code_discount}</div>
                </div>
              )}
              <div className="d-flex total-box">
                <label className="label">Total (Including GST)</label>
                {type == 'order' ? <div className="value"> ${grand_total}</div> :
                  <div className="value">${grand_total}</div>}
              </div>
            </Col>
          </Row>
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
})(OrderDetailModel);
