import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Card, Layout, Typography, Row, Col, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider, Descriptions, Anchor, Radio } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { enableLoading, disableLoading, getBeautyServiceBooking, cancelFitnessServiceBooking, cancelBeautyServiceBooking, getTraderMonthWellbeingBooking, updateBeautyServiceBooking,updateBeautyServiceBookingFitness, showCustomerClass } from '../../../../../actions';
import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import { DEFAULT_IMAGE_CARD } from '../../../../../config/Config';
import { Link } from "react-router-dom";
import { getPaymentOrder } from "../../../../../actions/retail/index";
import './mybooking.less';
import '../../../../booking/booking.less';
import '../../userdetail.less';
const { Title } = Typography;

class Resorderdetail extends React.Component {

    constructor(props) {
        console.log(props, "propssssssss");
        super(props);
        this.state = {
          orderDetails: [],
        };
      }
    
  componentDidMount() {

    const order_id = new URLSearchParams(this.props.location.search).get('order_id');
    const user_id = new URLSearchParams(this.props.location.search).get('user_id');

    if(order_id !== null){
      const obj = {
        order_id,
        user_id,
      }
      this.props.getPaymentOrder(obj, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          this.setState({ orderDetails: res.data.data });
        } else {
        }
      });
    }

  
  }

    render() { 
        const { orderDetails } = this.state;
        const {orders,order_detail_product, order_detail_seller} = orderDetails.length && orderDetails[0];
    
        return <div className='my-new-order-block orderdetail'>
                <div className="top-head-section">
                  <div className="left">
                    <Link to="/myProfile" className="backtoprofile">
                      Back to my
                      profile
                    </Link>
                    <Title level={2} className="pl-0">
                          Order Details 
                    </Title>
                    <h4>Order No.  #{orders && orders.formee_order_number}</h4>
                    <div>
                        <ul>
                            <li>Order Placed on {orders && moment(orders.created_at).format("DD MMM YYYY")}</li>
                            <li>Paid on {orders && moment(orders.updated_at).format("DD MMM YYYY")}  </li>
                        </ul>
                        <Link className='ant-btn-default grey-wbg-button' to={`/my-orders/restaurant-order-detail-invoice?user_id=${orders && orders.user_id}&order_id=${orderDetails.length && orderDetails[0].order_id}`}>View Invoice</Link>
                    </div>
                  </div>
                </div>
                <Row className='order-data'>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-18 ant-col-xl-18 '> 
                      
                      {
                          orderDetails &&
                          orderDetails.map((val, i) => {
                       
                              return(
                                <div className='order-data-left-top mb-10'>
                          <div>
                            
                              <div className='order-data-white-box'>
                              <h3>Delivered on {val.delivery_date} </h3>
                                  <Row>
                                      <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-13 ant-col-xl-13'>
                                          <div className='order-data-img '></div>
                                          <div className='content-detail'>
                                              <h3> {val.item_name} </h3>
                                              <span className='price'>AU$ {val.item_total_amt} </span>
                                              <div className='small-dec'>
                                                  <span className=''>
                                                      <span>Sold By</span>
                                                      {val.order_detail_seller && val.order_detail_seller.name}
                                                  </span>
                                                  <span className='small-dec-b '>{val.category_name} {val.child_category_name} </span>
                                              </div>

                                          </div>
                                      </Col>
                                      <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-3 ant-col-xl-3 qty text-center retail-qty'>Qty {val.item_qty}</Col>
                                      <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8 text-right'>
                                      <div>
                                        <Link to="" className='ant-btn-default grey-wbg-button'>BUT IT AGAIN</Link>
                                            <Link to="" className='ant-btn-default grey-wbg-button'>Write a review</Link>
                                        </div>
                                      </Col>
                                  </Row>

                              </div>
                          </div>    
                       </div>
                              )
                          })
                      }
                       
                       <div className='order-data-left-top left-bottom'>
                          <div className='shipping-in'>
                              <h3>Shiping Information</h3>
                              <span>
                                  Sent <br/><br/> 
                                  {orders && orders.customer_city} <br/>  {orders && orders.item_total_amt}
                              </span>
                          </div>
                          <div className='payment'>
                              <h3>Payment</h3>
                              <span>
                                 <p> {orders && orders.payment_method} </p>
                              </span>
                          </div>
                       </div>
                    </Col>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-6 ant-col-xl-6 pl-15'>
                        <div className='ordersumm'>
                            <div className='ordersumm-top'>
                                <h4>Order Summery</h4>
                                <span>AUD</span>
                            </div>
                            <div className='ordersumm-bottom'>
                                <div> <span>Item(s) Subtotal</span><span>${orderDetails.length && orders.order_grandtotal} </span> </div>
                                <div> <span>Shipping</span><span>${orderDetails.length && orders.order_shipping}</span> </div>
                                <div> <span>Taxes</span><span>$5.00</span> </div>
                                <div className='ordertotal'>
                                    <span>Total</span>
                                    <span>${orderDetails.length && (orders.order_grandtotal + orders.order_shipping)}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

        </div>;
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
    enableLoading,
    disableLoading,
  })(Resorderdetail);