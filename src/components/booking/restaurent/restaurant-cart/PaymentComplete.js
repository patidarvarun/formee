import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Button } from "antd";
import { salaryNumberFormate, dateFormate1 } from "../../../common";
import PDFInvoiceModal from "../../../common/PDFInvoiceModal";
import PDFInvoiceModal2 from "../../../common/PDFInvoiceModal2";
import ResDocs from "../../../common/pdf/ResDocs";
class PaymentComplete extends React.Component {
  constructor(props) {
    super(props);
    const { resData } = this.props;
    console.log("!!!!!!!!!!!!!!!", this.props);
    let input = new Date();
    let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
    let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0);

    let first = input.getDate() - input.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6
    let firstday = new Date(input.setDate(first)).toUTCString();
    let lastday = new Date(input.setDate(last)).toUTCString();

    this.state = {
      receiptModalEventBooking: false,
    }
  }
  /**
  /**
   * @method renderSelectedItemList
   * @description render selected item list
   */
  renderSelectedItemList = () => {
    const data = this.props.location.state;
    if (data && data.cart_items) {
      let myItemList =
        Array.isArray(data.cart_items) && data.cart_items.length
          ? data.cart_items
          : [];
      return (
        myItemList.length &&
        myItemList.map((el, i) => {
          console.log("elll", el)
          return (
            <Row className="product-summary" key={i}>
              <Col span={12} className="d-flex">
                <div className="product-img">
                  <img
                    src={
                      el.image
                        ? el.image
                        : require("../../../../assets/images/restaurant-cart.jpg")
                    }
                    alt="Your Choosed Item"
                  />
                </div>
                <div className="pro-text-detail">
                  <h4>{el.menu_item_name}</h4>
                  <p>{el.description}</p>
                  <Button className="booking-address-btn">Restaurant</Button>
                </div>
              </Col>
              <Col span={4}></Col>
              <Col span={8} className="qty-details d-flex">
                <div className="qty-dtl">
                  <p>
                    Items: <span>{el.quantity}</span>
                  </p>
                </div>
                <div className="text-right">
                  <h4>${el.price.toFixed(2)}</h4>
                  <p>Taxes & fees included </p>
                </div>
              </Col>
            </Row>
          );
        })
      );
    }
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const data = this.props.location.state;
    const { receiptModalEventBooking } = this.state;
    let today = new Date();
    return (
      <div className="retail-product-detail-parent-block checkout-order-summary payment-complete-page">
        <Fragment>
          <Layout className="yellow-theme common-left-right-padd">
            <div className="checkout-address-detail">
              <Row className="top-check-section">
                <Col span={10}>
                  <h1> <span className="mr-10" style={{display:"inline-block", verticalAlign:"middle",}}><svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.6243 36.9116L11.1054 27.3926L10.9993 27.2866L10.8933 27.3926L7.68495 30.601L7.57888 30.707L7.68495 30.8131L20.5183 43.6464L20.6243 43.7525L20.7304 43.6464L48.2304 16.1464L48.3365 16.0404L48.2304 15.9343L45.0221 12.726L44.916 12.6199L44.81 12.726L20.6243 36.9116Z" fill="#5D3F96" stroke="#5D3F96" stroke-width="0.3"/>
</svg></span> Payment Complete</h1>
                </Col>
              </Row>
              <div className="">
                <div className="payment-msg">
                  <p>
                    Your payment of{" "}
                    {data &&
                      data.total &&
                      `$${salaryNumberFormate(data.total)}`}{" "}
                    was processed on {dateFormate1(today)}
                    <br />
                    Here is a link to &nbsp;
                    <a
                      style={{
                        textDecoration: "underline",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        //this.changeStep(3);
                        this.setState({ receiptModalEventBooking: true });
                      }}
                    >
                      Receipt
                    </a>
                    &nbsp; for your records
                  </p>
                </div>
                <div className="pl-25 pr-25">{this.renderSelectedItemList()}</div>
              </div>
              <div className="btn-action-order">
                <div className="act-order">
                  <Link to={"/bookings-restaurant/39"}>
                    <Button className="btn-orange return">
                      Return to Search Results
                    </Button>
                  </Link>
                  <Link to={"/my-orders/restaurant"}>
                    <Button className="btn-orange">Go to my Orders</Button>
                  </Link>
                </div>
              </div>
            </div>{" "}
            {receiptModalEventBooking && (
              <PDFInvoiceModal2
                visible={receiptModalEventBooking}
                resDetails={this.props.resDetails}
                onClose={() => {
                  this.setState({ receiptModalEventBooking: false });
                }}
              />
            )}
          </Layout>
        </Fragment>
      </div>
    );
  }
}
export default PaymentComplete;