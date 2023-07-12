import React from "react";
import { connect } from "react-redux";
import moment from 'moment';
import {
  Col,
  Input,
  Layout,
  Row,
  Typography,
  Card,
  Tabs,
  Select,
  Button,
} from "antd";
import _ from "lodash";
import { Link } from "react-router-dom";
import "./userdetail.less";
import { getPaymentOrder } from "../../../actions/retail/index";
import PDFInvoiceModal from "../../common/PDFInvoiceModal";

const { Title, Text } = Typography;
const { Option } = Select;

class PaymentComplete extends React.Component {
  constructor(props) {
    console.log(props, "propssssssss");
    super(props);
    this.state = {
      // displayInnerPageName: "Wellbeing - Fitness",
      displayInnerPageName: "Select - category",
      filter: "",
      search: "",
      user_id:"",
      order_id:"",
      orderDetails: [],
      receiptModalEventBooking:false,
    };
  }

  componentDidMount() {
    const order_id = new URLSearchParams(this.props.location.search).get('order_id');
    const user_id = new URLSearchParams(this.props.location.search).get('user_id');
    this.setState({user_id:user_id,order_id:order_id})
    const obj = {
      user_id,
      order_id,
    };
    this.props.getPaymentOrder(obj, (res) => {
      if (res.status === 200) {
        this.setState({ orderDetails: res.data.data });
      } else {
      }
    });
  }
  /**
   * @method render
   * @description render component
   */

  render() {
    const { orderDetails } = this.state;

    return (
      <Layout className="paymentcomplete">
        <h1><img src={require('../../../assets/images/accept.png')} alt='edit' className="pr-10"/>Payment Complete</h1>
        <div className="paymentsumm">
        {orderDetails &&
            orderDetails.map((val, i) => {
              return (
                <div key={i}>
          <h4>
            Your payment of $ {val.item_total_amt} was processed on {moment(val.updated_at).format('DD/MM/YYYY')}.<br/> Here is a link
            <p onClick={()=>this.setState({receiptModalEventBooking:true})}>Reciept #{val.order_id}.pdf</p> for your records
          </h4>
          </div>
           );
          })}
         </div>
        <div>
          {orderDetails &&
            orderDetails.map((val, i) => {
              const {order_detail_product} = val;
              return (
                <Row key={i} className="order-item-box">
                  <div className="item-order-img ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-15 ant-col-xl-15">
                    <span className="avtar"><img src={order_detail_product && order_detail_product.classified_image_single && val.order_detail_product.classified_image_single.image_url} alt="" /></span>
                  <div>
                    <h2>{val.item_name} </h2>
                    <p>{val.child_category_name}</p>
                    <button> Retail </button>
                  </div>
                  </div>
                  <span className="qty ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-3 ant-col-xl-3 text-center">Qty {val.item_qty} </span>
                  <span className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 text-right"><h3>$ {val.item_total_amt}</h3><p>Taxes and fees included</p>
                  <p>Standard delivery in 3-5 days</p> </span>
                  
                </Row>
              );
            })}
        </div>
        <div className="text-center mt-50">
            <button className="ant-btn-default btn-orange-border mr-10">Return to Search Results</button>
            <button className="ant-btn-default btn-orange-fill ml-10">Go to my Orders</button>
        </div>

        {this.state.receiptModalEventBooking && (
          <PDFInvoiceModal
            visible={true}
            onClose={() => {
              this.setState({ receiptModalEventBooking: false });
            }}
            isViewInvoice={true}
            order_id={this.state.order_id}
            user_id={this.state.user_id}
            by="orderPage"
            booking_type="handymanBookingCheckout"

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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  getPaymentOrder,
})(PaymentComplete);
