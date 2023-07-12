import React from "react";
import { Button, Col, Divider, Row, Table, Typography } from "antd";
import { getOrderDetails, enableLoading, disableLoading } from "../../actions";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import PdfContainer from "../../common/PdfContainer";
import Doc from "../../common/DocService";
import ViewInvoiceModel from "../vendor/retail/comman-modals/ViewInvoiceModel";
import Title from "antd/lib/skeleton/Title";

// const { Title } = Typography;

// import 'antd/dist/antd.css';
class ViewInvoice extends React.Component {
  constructor() {
    super();
    this.state = {
      orderDetails: null,
      invoiceModel: false,
    };
  }
  componentDidMount() {
    this.getOrderDetails();
  }
  /**
   * @method  getOrderDetail
   * @description get order detail
   */
  getOrderDetails = () => {
    const { loggedInUser } = this.props;
    this.props.enableLoading();
    let data = {
      user_id: loggedInUser.id,
      // order_id: this.props.reqData ? this.props.reqData.order_id : "", //72
      order_id: 72, //72
    };
    this.props.getOrderDetails(data, (res) => {
      this.setState({ orderDetails: res.data.data });
      this.props.disableLoading();
    });
  };
  createPdf = (html) => Doc.createPdf(html);
  render() {
    const { orderDetails } = this.state;
    const columns = [
      {
        title: "Item(s)",
        dataIndex: "Event",
        key: "Event",
        render: (cell, row, index) => {
          return (
            <div>
              <p>{row.item_name}</p>
              <p className="seller-name">
                <h5>Sold by:</h5>
                {row.order_detail_seller.name}
              </p>
            </div>
          );
        },
        // render: text => <a>{text}</a>,
      },
      {
        title: "Quantity",
        dataIndex: "caption",
        key: "caption",
        render: (cell, row, index) => {
          return <p className="qty-digit">{row.item_qty}</p>;
        },
      },
      {
        title: "Unit Price",
        dataIndex: "Location",
        key: "Location",
        render: (cell, row, index) => {
          return <p>{row.item_price} </p>;
        },
      },
      {
        title: "Amount AUD",
        key: "tags",
        dataIndex: "tags",
        render: (cell, row, index) => {
          return <p>{row.item_total_amt}</p>;
        },
      },
    ];
    return (
      <div className="view-invoice-box">
        <div className="return-shopping" onClick={() => this.props.prevStep()}>
          <ArrowLeftOutlined />
          <span className="back-text">Back</span>
        </div>
        {this.state.orderDetails && (
          <React.Fragment>
            <PdfContainer createPdf={this.createPdf}>
              <Row className="view-invoice-head">
                <Col md={12}>
                  <h3>Invoice</h3>
                </Col>
                <Col md={12} className="text-right">
                  {/* <PrinterOutlined /> */}
                  <img
                    src={require("../../assets/images/icons/printer.svg")}
                    alt="printer"
                  />
                </Col>
              </Row>
              <div className="view-invoice-body">
                <Row gutter={24}>
                  <Col md={12}>
                    <div className="invoice-dtl-head-left">
                      <div className="d-flex">
                        <label className="label">Formee Order No:</label>
                        <span className="value">
                          #{orderDetails.formee_order_number}
                        </span>
                      </div>
                      <div className="d-flex">
                        <label className="label">Order Placed:</label>
                        <span className="value">
                          {moment(orderDetails.created_at).format("d MMM YYYY")}
                        </span>
                      </div>
                      <div className="d-flex">
                        <label className="label">Order Total:</label>
                        <span className="value">
                          ${orderDetails.order_grandtotal}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="invoice-dtl-head-right">
                      <h3>Invoice</h3>
                      <span className="order-detail-id">
                        #{orderDetails.id}
                      </span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <h2 className="delivered-date">Delivered on 5 Jun 2021</h2>
                </Row>
                <Table
                  dataSource={orderDetails.order_detail}
                  columns={columns}
                  pagination={false}
                  className="order-detail-table"
                ></Table>
                <Row>
                  <Col md={19}></Col>
                  <Col md={5} className="text-right">
                    <div className="sub-total-box">
                      <div className="d-flex">
                        <label className="label">Sub Total </label>
                        <span className="value">
                          {orderDetails.order_subtotal}
                        </span>
                      </div>
                      <div className="d-flex">
                        <label className="label">Shippping</label>
                        <span className="value">
                          {orderDetails.order_shipping}
                        </span>
                      </div>
                      <div className="d-flex">
                        <label className="label">Taxes</label>
                        <span className="value">Rs. 95.94</span>
                      </div>
                      <div className="d-flex total-amt-bottm-box">
                        <label className="label">Amount Due</label>
                        <span className="value">
                          {orderDetails.order_grandtotal}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="invoice-ship-info-box">
                  <Col md={8}>
                    <h4>Shipping Information</h4>
                    <p>
                      {orderDetails.customer_fname}{" "}
                      {orderDetails.customer_lname}
                    </p>
                    <p>
                      {orderDetails.customer_address1}{" "}
                      {orderDetails.customer_address2}{" "}
                      {orderDetails.customer_city}
                      {orderDetails.customer_state}
                      {orderDetails.customer_country}
                      {orderDetails.customer_postcode}
                    </p>
                  </Col>
                  <Col md={8}>
                    <h4>Payment Method</h4>
                    <p>{orderDetails.payment_method}</p>
                    <p>ending in ***6634</p>
                  </Col>
                </Row>
              </div>
            </PdfContainer>
            {/* <Button
              onClick={() => {
                this.setState({
                  invoiceModel: true,
                });
              }}
            >
              open modal
            </Button> */}
            <ViewInvoiceModel
              visible={this.state.invoiceModel}
              invoiceDetails={this.state.orderDetails}
              onCancel={() => this.setState({ invoiceModel: false })}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth, retail } = store;

  return {
    loggedInUser: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, {
  getOrderDetails,
  enableLoading,
  disableLoading,
})(withRouter(ViewInvoice));
