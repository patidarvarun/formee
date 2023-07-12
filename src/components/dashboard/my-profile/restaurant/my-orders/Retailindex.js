import React, { Fragment } from 'react';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Col, Input, Layout, Row, Typography, Button, Pagination, Card, Tabs, Select,Radio, Alert, Rate, Divider, Modal,Form } from 'antd';
import { enableLoading, disableLoading, getUserRestaurantCurrentOrders, getUserRestaurantPastOrders,addReviewService, getOrderDetailsById, reOrderRestaurantItems, UserRetailOrderList  } from '../../../../../actions'
import AppSidebar from '../../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import Icon from '../../../../../components/customIcons/customIcons';
import { PAGE_SIZE } from '../../../../../config/Config';
import { langs } from '../../../../../config/localization';
import { required, whiteSpace, maxLengthC } from '../../../../../config/FormValidation'
import moment from 'moment';
import { CURRENT_ORDER, ORDER_DETAIL } from './static_response';
import { toastr } from 'react-redux-toastr';
import { getOrderTypeName, getOrderStatus, getStatusColor } from '../../../../../config/Helper';
 

import './profile-user-restaurant.less';
import Countdown from 'react-countdown';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select

let TotalCartItem = 0;
let cartTotalAmount = 0;



const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13, offset: 1 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { offset: 7, span: 13 },
    className: 'align-center pt-20'
};

class MyRestaurantOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            userCurrentOrderList: [], 
            page: '1',
            order: 'desc',
            page_size: '10',
            customer_id: '',
            key: '1',
            userPastOrdersList: [],
            Order_id:"",
            defaultCurrent: 1,
            customerCalenderBookingList: [],
            totalRecordUserCurrentOrders: 0,
            totalRecordUserPastOrders: 0,
            orderDetails: '',
            selectedOrderId: '',
            isVisiableReOrder: false,
            confirmDeleteBooking:false,
            ItemOpen: false,
            itemOpen_past:false,
            Order_id_past:"",
            openReviewModal: false,
            reviewValue: "",
            reviewDatabyId:{},
            customerRating:'',
        };
    }

    /**
      * @method componentDidMount
      * @description called after render the component
      */
    componentDidMount() {
        this.getUserCurrentOrders(this.state.page);
    }

    onTabChange = (key, type) => {
        this.setState({ key: key, selectedOrderId: '', orderDetails: '' });
        if (key == '1') {
            this.getUserCurrentOrders(1);
        } else {
            this.getUserPastOrders(1);
        }
    }

    getUserCurrentOrders = (page) => {
        const { id } = this.props.loggedInUser;
        this.props.UserRetailOrderList({user_id:id}, (response) => {
            this.props.disableLoading();
            if (response.status === 200) {
                this.setState({ 
                    userCurrentOrderList: response.data.data,
                })
                //this.setState({ orderDetails: ORDER_DETAIL });
                // this.setState({ orderDetails: response.data.data.order_detail });
            } else {
                toastr.error('Error', 'Something went wrong to get order details.');
            }
        });

    }

    handleUserCurrentOrderPageChange = (e) => {
        this.getUserCurrentOrders(e)
    }

    getUserPastOrders = (page) => {
      
        const { id } = this.props.loggedInUser;
        const reqData = {
            page: page,
            page_size: this.state.page_size,
            customer_id: id
        };

       const request = {user_id:id,is_past:true}
        this.props.UserRetailOrderList(request, (response) => {
            this.props.disableLoading();
            if (response.status === 200) {
                this.setState({ 
                    userPastOrdersList: response.data.data,
                })
                //this.setState({ orderDetails: ORDER_DETAIL });
                // this.setState({ orderDetails: response.data.data.order_detail });
            } else {
                toastr.error('Error', 'Something went wrong to get order details.');
            }
        });
       
    }

    handleUserPastOrderPageChange = (e) => {
        this.getUserPastOrders(e)
    }

    formateRating = (rate) => {
        return rate ? `${parseInt(rate)}.0` : 0
    }

    getDateFromHours = (bookingDate, startTime) => {
        startTime = startTime.split(':');
        let now = new Date(bookingDate);
        let dateTimeSting = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...startTime);
        return dateTimeSting;
    }

    timestampToString = (date, time, suffix) => {
        let dateString = this.getDateFromHours(date, time);
        let diffTime = (new Date().getTime() - (dateString || 0)) / 1000;
        if (diffTime < 60) {
            diffTime = 'Just now';
        } else if (diffTime > 60 && diffTime < 3600) {
            diffTime =
                Math.floor(diffTime / 60) +
                (Math.floor(diffTime / 60) > 1
                    ? suffix
                        ? ' minutes'
                        : 'm'
                    : suffix
                        ? ' minute'
                        : 'm') +
                (suffix ? ' ago' : '');
        } else if (diffTime > 3600 && diffTime / 3600 < 24) {
            diffTime =
                Math.floor(diffTime / 3600) +
                (Math.floor(diffTime / 3600) > 1
                    ? suffix
                        ? ' hours'
                        : 'h'
                    : suffix
                        ? ' hour'
                        : 'h') +
                (suffix ? ' ago' : '');
        } else if (diffTime > 86400 && diffTime / 86400 < 30) {
            diffTime =
                Math.floor(diffTime / 86400) +
                (Math.floor(diffTime / 86400) > 1
                    ? suffix
                        ? ' days'
                        : 'd'
                    : suffix
                        ? ' day'
                        : 'd') +
                (suffix ? ' ago' : '');
        } else {
            diffTime = moment(new Date(dateString || 0).toDateString()).format('DD/MM/YYYY');
        }
        return diffTime;
    };

    displayOrderDetails = (orderID) => {
        const { selectedOrderId } = this.state;
        TotalCartItem = 0;
        cartTotalAmount = 0;
        
        if (selectedOrderId === orderID) {
            this.setState({ selectedOrderId: '', orderDetails: '' });
        } else {
            this.props.enableLoading();
            this.setState({ selectedOrderId: orderID }, () => {
                this.props.getOrderDetailsById(orderID, (response) => {
                    this.props.disableLoading();
                    
                    if (response.status === 200) {
                        
                        //this.setState({ orderDetails: ORDER_DETAIL });
                        this.setState({ orderDetails: response.data.data.order_detail });
                    } else {
                        toastr.error('Error', 'Something went wrong to get order details.');
                    }
                });
            });
        }
    }
    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
          // Render a completed state
          return <span/>;
        } else {
          // Render a countdown
          return <span> <img src={require('../../../../../assets/images/icons/waiting-red-icon.svg')} alt='waiting' /> {hours}:{minutes}:{seconds}</span>;
        }
      };

    getMilliseconds = (m) => ((m*60)*1000);

    renderCountDownTimer = (value) =>{
        if(value.current_status && value.current_status.status === 'confirmed'){
            let currentTimeStamp = moment( moment().format('YYYY-MM-DD HH:mm:ss'))
            var orderCreatedTimeStamp =  moment(value.current_status.updated_at);
            // Calculate min difference in created time and current time 
            let calculatedTimeDiffInMinute = currentTimeStamp.diff(moment(orderCreatedTimeStamp), 'minutes');
            // get difference of estimated time and calculated time  in min 
            let remainingTimeInMin = value.estimated_time - calculatedTimeDiffInMinute
            if (remainingTimeInMin <= value.estimated_time) {
                let miliSecond = this.getMilliseconds(remainingTimeInMin);
                //
                return <div className="fm-waiting-time"> <Countdown date={Date.now() + miliSecond}  renderer={this.renderer}/></div>  
            }
        }   
    }

    renderOrderListItem = (value, activeTabKey) => {
        const {orders,order_detail_product, order_detail_seller} = value && value;
        const {classified_image_single} = order_detail_product && order_detail_product;
       const imgUrl = order_detail_product && order_detail_product.classified_image_single && order_detail_product.classified_image_single.image_url;
       console.log('ids',order_detail_product && order_detail_product.classified_image_single && order_detail_product.classified_image_single.image_url)
        return (
            <div className="my-new-order-block retail-main"  style={{ borderColor: value.id === this.state.selectedOrderId ? '#ffc468' : '#fff', borderWidth: 1, borderStyle: 'solid' }} >
                
                <Row gutter={0} className='retail-top-inner'> 
                        
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8' >
                       <h4 className='order-no'>Order No.  #{orders && orders.formee_order_number}</h4>
                       <Row>
                           <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8'>
                               <span>Order Placed</span>
                               <p>{orders && moment(orders.created_at).format("DD MMM YYYY")}</p>
                           </Col>
                           <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8'>
                               <span>Paid on</span>
                               <p>15 May 2021</p>
                           </Col>
                           <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8'>
                               <span>Total</span>
                               <p>$ {orders && orders.order_subtotal} </p>
                           </Col>
                       </Row>
                    </Col>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-16 ant-col-xl-16'>
                        <div className='button-section text-right'>
                            <div>
                                <Link to={`/my-orders/restaurant-order-detail?user_id=${orders && orders.user_id}&order_id=${value.order_id}`}><button className='ant-btn-default grey-bg-button'>View Order Details</button></Link>
                                <Link to={`/my-orders/restaurant-order-detail-invoice?user_id=${orders && orders.user_id}&order_id=${value.order_id}`}> <button className='ant-btn-default grey-wbg-button'>View Invoice</button></Link>
                            </div>
                            <span onClick={()=>
                                this.setState({itemOpen: !this.state.itemOpen, Order_id:value.order_id})} className='arrow-d'><img src={require('./icon/arrow_down-reatil.png')} alt='edit' className="pr-10"/></span>
                        </div>
                        
                        
                    </Col>
                </Row>
                {
                    this.state.Order_id == (value && value.order_id) ? 
                <Row gutter={0} className='retail-bottom-inner' style={{display: this.state.itemOpen ? 'flex' : 'none'}}>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-12 ant-col-xl-12'>
                       
                      <span className='avtar'>
                          <img src={order_detail_product && order_detail_product.classified_image_single && order_detail_product.classified_image_single.image_url} alt={order_detail_product && order_detail_product.classified_image_single && order_detail_product.classified_image_single.name} />
                       </span>   
                        
                        <div className='order-product-name'>
                            <h3>{value.item_name} </h3>
                             <span className='price'>AU${value.item_price}</span>
                            <div className='small-dec'>
                                <span><span>Sold By </span> {order_detail_seller && order_detail_seller.name} </span>
                                <span className='small-dec-b'>{value.category_name} {">"} {value.sub_category_name} </span>
                            </div>
                        </div>
                    </Col>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-4 ant-col-xl-4' >
                        <span className='retail-qty'>Qty {value.item_qty}</span>
                    </Col>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8 text-right'>
                          <h5>Estimated Delivery by {value.buyer_pick_date}</h5>
                          <span><img src={require('./icon/greenright.png')} alt='edit' className="pr-10"/> {value.order_status} </span>
                    </Col>
                </Row>
               
               :null
            }
            </div>
        )
    }
 
    renderUserCurrentOrders = (activeTabKey) => {
        if (this.state.userCurrentOrderList && this.state.userCurrentOrderList.length > 0) {
            return (
                <Fragment>
                    {this.state.userCurrentOrderList.map((value, i) => {
                        return this.renderOrderListItem(value, activeTabKey)
                         console.log("renderOrderListItem");
                    })}
                    
                </Fragment>
                
            )
        } else {
            return <div>
                <Alert message="No records found." type="error" />
            </div>
        }
      
    }

    renderOrderListItempast =   (value, activeTabKey) => {
        const {orders,order_detail_product, order_detail_seller} = value && value;
        const {classified_image_single} = order_detail_product && order_detail_product;
    

        return (
            <div className="my-new-order-block retail-main past-retail" style={{ borderColor: value.id === this.state.selectedOrderId ? '#ffc468' : '#fff', borderWidth: 1, borderStyle: 'solid' }} >
                
                <Row gutter={0} className='retail-top-inner'> 
                
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8' >
                       <h4 className='order-no'><img src={require('./icon/green-bo-right.png')} alt='edit' className="pr-10"/>Delivered on {value.delivery_date}
                         {/* #{orders && orders.formee_order_number} */}
                         </h4>
                       <Row>
                           <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8'>
                               <span>Order Placed</span>
                               <p>{orders && moment(orders.created_at).format("DD MMM YYYY")}</p>
                           </Col>
                           <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8'>
                               <span>Paid on</span>
                               <p>15 May 2021</p>
                           </Col>
                           <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8'>
                               <span>Total</span>
                               <p>$ {orders && orders.order_subtotal} </p>
                           </Col>
                       </Row>
                    </Col>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-16 ant-col-xl-16'>
                        <div className='button-section text-right'>
                            <div>
                            <Link to={`/my-orders/restaurant-PastOrder-detail?user_id=${orders && orders.user_id}&order_id=${value.order_id}`} >View Order Details</Link>
                                <Link to={`/my-orders/restaurant-order-detail-invoice?user_id=${orders && orders.user_id}&order_id=${value.order_id}`}  >View Invoice</Link>
                            </div>
                            <span onClick={(e)=>this.setState({itemOpen_past: !this.state.itemOpen_past, Order_id_past:value.order_id})} className='arrow-d'><img src={require('./icon/arrow_down-reatil.png')} alt='edit' className="pr-10"/></span>
                        </div>
                        
                    </Col>
                </Row>
                {
                this.state.itemOpen_past ?    
                this.state.Order_id_past == (value && value.order_id) ? 
                <Row gutter={0} className='retail-bottom-inner' >
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-12 ant-col-xl-12'>
                        <span className='avtar'>
                            <img src={classified_image_single && classified_image_single.image_url} alt={classified_image_single && classified_image_single.name} />
                        </span>
                        <div className='order-product-name'>
                            <h3>{value.item_name} </h3>
                             <span className='price'>AU${value.item_price}</span>
                            <div className='small-dec'>
                                <span><span>Sold By </span> {order_detail_seller && order_detail_seller.name} </span>
                                <span className='small-dec-b'>{value.category_name} {">"} {value.sub_category_name} </span>
                            </div>
                        </div>
                    </Col>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-8 ant-col-xl-8' >
                    

                    </Col>
                    <Col className='ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-4 ant-col-xl-4 '>
                    <button onClick={()=>this.setState({openReviewModal: !this.state.openReviewModal, reviewDatabyId:value})} className='ant-btn-default green-wbg-button'>Write product review </button>

                    </Col>
                </Row>
               : null
               
               :null
               } 
            </div>
        )
    }
   

    

    renderUserPastOrders = (activeTabKey) => {
        if (this.state.userPastOrdersList && this.state.userPastOrdersList.length > 0) {
            return (
                <Fragment>
                    {this.state.userPastOrdersList.map((value, i) => {
                        return this.renderOrderListItempast(value, activeTabKey)
                    })
                    }
                </Fragment>
            )
        } else {
            return <div>
                <Alert message="No records found." type="error" />
            </div>
        }
    }

    renderOrderCartItems = (orderDetails) => {
        TotalCartItem = 0;
        cartTotalAmount = 0;
        if (orderDetails.order_detail && orderDetails.order_detail.length > 0) {

            return (
                <Fragment>
                    {orderDetails.order_detail.map((orderCartItems, i) => {
                        return orderCartItems.cart_item.map((cartItems, idx) => {
                            TotalCartItem++
                            cartTotalAmount = parseFloat(cartTotalAmount) + parseFloat(cartItems.price)
                            return (
                                <div className="order-list">
                                    <div className="count">{cartItems.quantity}</div>
                                    <div className="order-name">{cartItems.menu_item_name}</div>
                                    <div className="order-proce">${cartItems.price}</div>
                                </div>
                            )
                        })
                    })
                    }
                </Fragment>
            )
        } else {
            return <div className="error-box">
                <Alert message="No Cart Item(s)" type="error" />
            </div>
        }
    }

    dispayReorderConfirmationModal = () =>{
       this.setState({ isVisiableReOrder: true }); 
    }

    hideReorderModal  =  () =>{
        this.setState({ isVisiableReOrder: false}); 
    }
    hideReviewModal  =  () =>{
        this.setState({ openReviewModal: false}); 
    }
    submitReview = (value) =>{
 
        let obj ={
            classified_id: this.state.reviewDatabyId.classified_id,
            rating:value.rating,
            review:value.comment,
            title:value.title,
            user_id:this.state.reviewDatabyId.orders.user_id,
            status:1
        }
       
        this.props.addReviewService(obj, (response) => {            
            if (response.status === 200) {
                toastr.success('Successfull', 'Submit Successfull');
                this.setState({openReviewModal:false})
            } else {
                toastr.error('Error', 'Something went wrong to get order details.');
            }
        });

    }
    handleRatingChange = e => {
        this.setState({
          customerRating: e.target.value,
        });
      };

    makeReorderConfirm =  () =>{
        let reqData = {
            order_id : this.state.selectedOrderId
        }
        this.props.enableLoading();
        this.props.reOrderRestaurantItems (reqData, (reponse)=>{
            
            this.props.disableLoading();
            if(reponse.status=== 200){
                toastr.success('Success', 'Items successfully added to cart for reorder.');
                this.setState({ isVisiableReOrder: false});
            }
        });
    }

    renderTotalAmount = (amount, ship_cost , order_gst_amount) => {
        let totalIncDeliveryFee =  parseFloat(amount) + parseFloat(ship_cost) + parseFloat(order_gst_amount);
        return totalIncDeliveryFee.toFixed(2);
    }

    /**
     * @method render
     * @description render component  
     */
    render() {
        const { orderDetails } = this.state
        
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
          const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 13, offset: 1 },
            labelAlign: 'left',
            colon: false,
          };
          const tailLayout = {
            wrapperCol: { offset: 7, span: 13 },
            className: 'align-center pt-20'
          };
          
        return (
          <Layout className="event-booking-profile-wrap fm-restaurant-vendor-wrap restaurant-vendor">
            <Layout>
              <AppSidebar history={history} />
              <Layout>
                <div
                  className="my-profile-box view-class-tab retail-order-top"
                  style={{ minHeight: 800 }}
                >
                  <div className="card-container signup-tab resturant-vendor-box">
                    <div className="top-head-section">
                      <div className="left">
                        <Title level={2}> Retail </Title>
                      </div>
                      <div className="right">
                        <div className="right-content">
                          <div className="tabs-button">
                            <Link to="/my-orders/restaurant">
                              <Button className="tabview-btn retail-btn">
                                Restaurant
                              </Button>
                            </Link>
                            {/* <Link to="/bookings">
                                        <Button className="tabview-btn booking-btn">
                                            BOOKING
                                        </Button>
                                        </Link>
                                        <Button className="tabview-btn food-scanner">
                                        FOOD SCANNER
                                        </Button> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sub-head-section">
                      <Text>&nbsp;</Text>
                    </div>
                    <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking user-restaurents-order-block">
                      <Row gutter={30}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          {/* <Select defaultValue="Restaurant" className="purpel-selct-list">
                                                <Option value="Restaurant">Restaurant</Option>
                                            </Select> */}
                          <Card
                            className="profile-content-shadow-box"
                            bordered={false}
                            title=""
                          >
                            <Tabs
                              onChange={this.onTabChange}
                              defaultActiveKey="1"
                              className="reatil-tab"
                            >
                              <TabPane tab="Current Order" key="1">
                                {/* <h3>You have {this.state.userCurrentOrderList.length} new order</h3> */}
                                {this.renderUserCurrentOrders(this.state.key)}
                              </TabPane>
                              <TabPane tab="Past Order" key="2">
                                {/* <h3>You have {this.state.totalRecordUserPastOrders} new order</h3> */}
                                {this.renderUserPastOrders(this.state.key)}
                              </TabPane>
                            </Tabs>
                          </Card>
                        </Col>
                        {/* {orderDetails !== '' &&
                                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                                <div className="your-order-block">
                                                    <h2>Your order  
                                                        <Button type='default' className={`${getStatusColor(orderDetails.order_current_status)} mt-0`} style={{ float: "right", backgroundColor: "transparent", border: "#FFB946 1px solid", color: "#FFB946" }}>{orderDetails.order_current_status}</Button> </h2>
                                                    <div className="profile-name-pic-detail">
                                                        <div>From</div>
                                                        <div className="profile-pic">
                                                            <img alt="test"  src={orderDetails.restaurant_image ? orderDetails.restaurant_image : require('../../../../../assets/images/avatar3.png')} />
                                                        </div>
                                                        <div className="profile-name">
                                                            {orderDetails.restaurant_name}
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                    {this.renderOrderCartItems(orderDetails)}
                                                    <Divider />
                                                    <div className="order-total">
                                                        <div className="item">Item ({TotalCartItem})</div>
                                                        <div className="amount">${cartTotalAmount}</div>
                                                    </div>
                                                    <div className="order-total">
                                                        <div className="item">Fee</div>
                                                        <div className="amount">${orderDetails.ship_cost}</div>
                                                    </div>
                                                    <div className="order-total">
                                                        <div className="item total">Total</div>
                                                        <div className="amount total-amount">
                                                            ${this.renderTotalAmount(cartTotalAmount , orderDetails.ship_cost , orderDetails.order_gst_amount)}
                                                            <span>Taxes & fees included</span>
                                                        </div>
                                                    </div>
                                                    <div className="btn-block">
                                                        {this.state.key === '1' ? <Link to={`/restaurant/customer-track-order/${orderDetails.id}`} > <Button type='default' className="pending-btn pending-btn-big">Track Order</Button></Link> :
                                                            <Button
                                                                type='default'
                                                                className="lght-orange ml-10 pending-btn-big"
                                                                onClick={this.makeReorderConfirm}
                                                            >
                                                                Reorder
                                                            </Button>
                                                        }
                                                    </div>
                                                </div>
                                            </Col>
                                        } */}
                      </Row>
                    </div>
                  </div>
                  <Modal
                    title="Reorder"
                    visible={this.state.isVisiableReOrder}
                    className={"custom-modal style1"}
                    footer={false}
                    onCancel={this.hideReorderModal}
                    destroyOnClose={true}
                  >
                    <div className="padding">
                      <Title>
                        {" "}
                        Click Confirm Reorder to add your order item in the cart{" "}
                      </Title>
                      <Form.Item {...tailLayout}>
                        <Button
                          type="default"
                          onClick={this.makeReorderConfirm}
                        >
                          Confirm Reorder
                        </Button>
                      </Form.Item>
                    </div>
                  </Modal>

                  {/* Modal for Write a review */}
                  <Modal
                    title="Leave a Review"
                    visible={this.state.openReviewModal}
                    className={"custom-modal style1"}
                    footer={false}
                    onCancel={this.hideReviewModal}
                    destroyOnClose={true}
                  >
                    {/* <div className='padding'>

                                 <textarea onChange={(e)=>this.setState({reviewValue:e.target.value})}>

                                 </textarea>
                                 <Radio.Group onChange={this.handleRatingChange} value={this.state.customerRating}>
                                    <Radio style={radioStyle} value={5}>
                                        <Rate disabled defaultValue={5} />  5 Excelent
                                                </Radio>
                                    <Radio style={radioStyle} value={4}>
                                        <Rate disabled defaultValue={4} />  4 Very Good
                                                </Radio>
                                    <Radio style={radioStyle} value={3}>
                                        <Rate disabled defaultValue={3} />  3 Average
                                                </Radio>
                                    <Radio style={radioStyle} value={2}>
                                        <Rate disabled defaultValue={2} />  2 Very Poor
                                                </Radio>
                                    <Radio style={radioStyle} value={1}>
                                        <Rate disabled defaultValue={1} />  1 Terrible
                                                </Radio>
                                    </Radio.Group>
                                <Button type='button' onClick={this.submitReview}>Submit</Button>
                                   
                                </div> */}
                    <div className="padding">
                      <Form
                        {...layout}
                        name="basic"
                        onFinish={this.submitReview}
                      >
                        <Form.Item
                          label="Title"
                          name="title"
                          className="custom-astrix"
                        >
                          <Input
                            name="title"
                            placeholder={""}
                            enterButton="Search"
                            className="shadow-input"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Comment"
                          name="comment"
                          className="custom-astrix"
                        >
                          <TextArea
                            rows={4}
                            placeholder={"Write your review here"}
                            className="shadow-input"
                          />
                        </Form.Item>

                        <Form.Item label="Select your rate" name="rating">
                          <Radio.Group
                            onChange={this.handleRatingChange}
                            value={this.state.customerRating}
                          >
                            <Radio style={radioStyle} value={5}>
                              <Rate disabled defaultValue={5} /> 5 Excelent
                            </Radio>
                            <Radio style={radioStyle} value={4}>
                              <Rate disabled defaultValue={4} /> 4 Very Good
                            </Radio>
                            <Radio style={radioStyle} value={3}>
                              <Rate disabled defaultValue={3} /> 3 Average
                            </Radio>
                            <Radio style={radioStyle} value={2}>
                              <Rate disabled defaultValue={2} /> 2 Very Poor
                            </Radio>
                            <Radio style={radioStyle} value={1}>
                              <Rate disabled defaultValue={1} /> 1 Terrible
                            </Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                          <Button type="default" htmlType="submit">
                            Send
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </Modal>
                </div>
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
        userDetails: profile.userProfile !== null ? profile.userProfile : {}
    };
};
export default connect(
    mapStateToProps,
    { enableLoading, disableLoading, getUserRestaurantCurrentOrders,addReviewService, getUserRestaurantPastOrders, getOrderDetailsById , reOrderRestaurantItems, UserRetailOrderList}
)(MyRestaurantOrders);