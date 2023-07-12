import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Button } from "antd";
import ChoosedItemSummary from "./ChoosedItemSummary";
import {
  salaryNumberFormate,
  dateFormate1,
  splitDescription,
} from "../../../common";

class PaymentComplete extends React.Component {
  /**
   * @method renderSelectedItemList
   * @description render selected item list
   */
  renderSelectedItemList = () => {
    const data = this.props.reqData;
    if (data && data.checkedCartItemList) {
      let myItemList =
        Array.isArray(data.checkedCartItemList) &&
        data.checkedCartItemList.length
          ? data.checkedCartItemList
          : [];
      return (
        myItemList.length &&
        myItemList.map((el, i) => {
          return (
            <ChoosedItemSummary
              image={el.photo}
              productName={splitDescription(el.title)}
              productDes={splitDescription(el.description)}
              itemQty={el.qty}
              itemPrize={`$${salaryNumberFormate(el.price)}`}
              itemDeliveryDays="3-4"
            />
          );
        })
      );
    }
  };

  render() {
    const { reqData } = this.props;
    let today = new Date();
    return (
      <div className="retail-product-detail-parent-block checkout-order-summary payment-complete-page">
        <Fragment>
          <Layout className="retail-theme common-left-right-padd">
            <div className="checkout-address-detail">
              <Row className="top-check-section">
                <Col span={10}>
                  <h1>Payment Complete</h1>
                </Col>
              </Row>
              <div className="">
                <div className="payment-msg">
                  <p>
                    Your payment of{" "}
                    {reqData &&
                      reqData.total &&
                      `$${salaryNumberFormate(reqData.total)}`}{" "}
                    was processed on {dateFormate1(today)}. 
                    <Button onClick={()=>{this.props.nextStep(this.props.reqData, 4);}}>Here is a link to
                    Receipt #8458.pdf</Button> for your records
                  </p>
                </div>
                {this.renderSelectedItemList()}
              </div>
              <div className="btn-action-order">
                <div className="act-order">
                  <Link to={"/retail"}>
                    <Button className="btn-orange return">
                      Return to Search Results
                    </Button>
                  </Link>
                  <Link to={"/retail-orders"}>
                    <Button className="btn-orange">Go to my Orders</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Layout>
        </Fragment>
      </div>
    );
  }
}

export default PaymentComplete;
