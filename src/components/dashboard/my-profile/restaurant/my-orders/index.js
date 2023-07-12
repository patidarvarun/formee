import React, { Fragment } from 'react';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Col, Input, Layout, Row, Typography, Button, Pagination, Card, Tabs, Select, Alert, Rate, Divider, Modal,Form } from 'antd';
import { enableLoading, disableLoading, getUserRestaurantCurrentOrders, getUserRestaurantPastOrders, getOrderDetailsById, reOrderRestaurantItems,getCancelRestaurantOrder  } from '../../../../../actions'
import AppSidebar from '../../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import Icon from '../../../../../components/customIcons/customIcons';
import { PAGE_SIZE } from '../../../../../config/Config';
import { langs } from '../../../../../config/localization';
import moment from 'moment';
import "./mybooking.less";
import { CURRENT_ORDER, ORDER_DETAIL } from './static_response';
import { toastr } from 'react-redux-toastr';
import { getOrderTypeName, getOrderStatus, getStatusColor } from '../../../../../config/Helper';
import {
    required,
    whiteSpace,
    maxLengthC,
  } from "../../../../../config/FormValidation";
 

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
            defaultCurrent: 1,
            customerCalenderBookingList: [],
            totalRecordUserCurrentOrders: 0,
            totalRecordUserPastOrders: 0,
            orderDetails: '',
            selectedOrderId: '',
            isVisiableReOrder: false,
            confirmDeleteBooking:false,
            selOrderId:'',
            displayCancelOrderModal: false
        };
    }

    /**
      * @method componentDidMount
      * @description called after render the component
      */
    componentDidMount() {
        this.getUserCurrentRestaurantOrders(this.state.page);
    }

    onTabChange = (key, type) => {
        this.setState({ key: key, selectedOrderId: '', orderDetails: '' });
        if (key == '1') {
            this.getUserCurrentRestaurantOrders(1);
        } else {
            this.getUserPastOrders(1);
        }
    }

    getUserCurrentRestaurantOrders = (page) => {
         
        const { id } = this.props.loggedInUser;
        const reqData = {
            page: page,
            order: this.state.order,
            page_size: this.state.page_size,
            customer_id: id
        };
        this.props.enableLoading();
        this.props.getUserRestaurantCurrentOrders((res) => {
            this.props.disableLoading()
            
            if (res.status === 200) {
                this.setState({ 
                    userCurrentOrderList: res.data.data,
                    totalRecordUserCurrentOrders: res.data.data.total_records ? res.data.data.total_records : 0 
                })
            }
        })
    }

    handleUserCurrentOrderPageChange = (e) => {
        this.getUserCurrentRestaurantOrders(e)
    }

    getUserPastOrders = (page) => {
      
        const { id } = this.props.loggedInUser;
        const reqData = {
            page: page,
            page_size: this.state.page_size,
            customer_id: id
        };
        this.props.enableLoading();
        this.props.getUserRestaurantPastOrders((res) => {
            this.props.disableLoading()
            
            if (res.status === 200) {
                this.setState({ 
                    userPastOrdersList: res.data.data,
                    totalRecordUserPastOrders: res.data.data.total_records ? res.data.data.total_records : 0 })
                }
        });
    }

    handleUserPastOrderPageChange = (e) => {
        this.getUserPastOrders(e)
    }

    formateRating = (rate) => {
        return rate ? `${parseInt(rate)}.0` : 0
    }

    hideCancelOrderModal = () => {
        this.setState({ displayCancelOrderModal: false });
      };

    displayCancelOrderModal = () => {
        this.setState({ displayCancelOrderModal: true });
      };

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

    onSubmitCancelOrderForm = (values) => {
        let reqData = {
          order_id: this.state.selOrderId,
          reason: values.reason,
        };
        
        this.props.enableLoading();
        this.props.getCancelRestaurantOrder(reqData, (response) => {
          this.props.disableLoading();
          if (response.status === 200) {
            this.setState({ displayCancelOrderModal: false });
          } else {
            toastr.error("Error", "Something went wrong to cancel the order.");
          }
        });
      };

    renderOrderListItem = (value, activeTabKey) => {
        let StatusButtonLabel = getOrderStatus(value.current_status.status);
       let disPlaystatus =  StatusButtonLabel.length > 0 ? StatusButtonLabel[0].label : value.current_status.status;
       
    //    const time = moment(value.estimated_time).unix().format("HH:mm");
       const valueorder = value.order_type;
    //    console.log(time);
        // const resuqty = [value.menu_item_quantity.quantity];
        return (
            <div className="my-new-order-block"  style={{ borderColor: value.id === this.state.selectedOrderId ? '#ffc468' : '#fff', borderWidth: 1, borderStyle: 'solid' }} >
                <Row gutter={0}>
                    
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><div className="odr-no"><h4> {activeTabKey === '1' ? 'Order No.' : 'Past Order No.'} {value.order_no}</h4><span className={valueorder}>{getOrderTypeName(value.order_type)}</span></div>
                        {activeTabKey === '1' ? <button className="grey-without-border ant-btn-default" onClick={() => {
                                              this.displayCancelOrderModal();
                                              this.setState({
                                                selOrderId: value.id,
                                              
                                              });
                                            } }>Cancel Order</button> : ""}
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={5} xl={5} className="border-right">
                            <div className="order-profile profile-big">
                                <div className="profile-pic">
                                    <img alt="test" src={value.restaurant_image ? value.restaurant_image : require('../../../../../assets/images/avatar3.png')} />
                                </div>
                                <div className="profile-name">
                                    {value.restaurant_name}
                                    <div className="rating-box"><span>{value.rating }.0</span><Rate disabled defaultValue={this.formateRating(value.rating)} /></div>
                                </div>
                           </div>
                        </Col>   
                        <Col xs={24} sm={24} md={24} lg={6} xl={6} className="qty-res">
                          
                          {/* {console.log('value',value)}
                          {console.log('value',value.menu_item_quantity)} */}
                          <ul>
                            { value.menu_item_quantity ?
                                value.menu_item_quantity.map((miq, i) => { 
                                    return ( <li key={i}>
                                        <span className='Qtyres'>{miq.quantity}</span>
                                        <span> {miq.menu_item_name}</span>
                                        
                                    </li>)                   
                                    
                                }): ""}
                        </ul>
                             

                        </Col>
                    <Col xs={24} sm={24} md={24} lg={7} xl={7} className="align-right">
                        <div className="estimate-time-box"><span className="estimate-time"><b>ETA {value.estimated_time} </b></span> <span> {moment(value.created_at).format("HH:mm A")}</span></div>
                        <div>
                        
                        <span className="fm-btndeleteicon">
                            {/* <img src={require('../../../../../assets/images/icons/delete.svg')} alt='delete' /> */}
                            <Button type='default' className={getStatusColor(disPlaystatus)}>{StatusButtonLabel.length > 0 ? StatusButtonLabel[0].label : value.current_status.status}</Button></span>
                            <Link to={`/restaurant/customer-track-order/${value.id}`} > <Button type='default' className=" tracker btn-orange-fill  ant-btn-default pending-btn pending-btn-big">Track Order</Button></Link>
                        </div>
                        
                    </Col>

                   
                </Row>

                <Modal
                    title="Cancel Order"
                    visible={this.state.displayCancelOrderModal}
                    className={"custom-modal style1"}
                    footer={false}
                    onCancel={this.hideCancelOrderModal}
                    destroyOnClose={true}
                  >
                    <div className="padding">
                      <Form {...layout} onFinish={this.onSubmitCancelOrderForm}>
                        <Form.Item
                          label="Cancellation reason"
                          name="reason"
                          rules={[
                            required(""),
                            whiteSpace("Message"),
                            maxLengthC(100),
                          ]}
                        >
                          <TextArea
                            rows={4}
                            placeholder={"Write your message here"}
                            className="shadow-input"
                          />
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
   

    

    renderUserPastOrders = (activeTabKey) => {
        if (this.state.userPastOrdersList && this.state.userPastOrdersList.length > 0) {
            return (
                <Fragment>
                    {this.state.userPastOrdersList.map((value, i) => {
                        return this.renderOrderListItem(value, activeTabKey)
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
        console.log("renderOrderListItem");
        console.log(this.state);
        
        return (
            <Layout className="event-booking-profile-wrap fm-restaurant-vendor-wrap restaurant-vendor">
                <Layout>
                    <AppSidebar history={history} />
                    <Layout>
                        <div className='my-profile-box view-class-tab' style={{ minHeight: 800 }}>
                            <div className='card-container signup-tab resturant-vendor-box'>

                            <div className="top-head-section">
                                <div className="left">
                                    <Title level={2}>Restaurant</Title>
                                </div>
                                <div className="right">
                                    <div className="right-content">
                                    <div className="tabs-button">
                                        <Link to="/my-orders/retail">
                                        <Button className="tabview-btn retail-btn">
                                            Retail
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
                                <div className='sub-head-section'>
                                    <Text>&nbsp;</Text>
                                </div>
                                <div className="pf-vend-restau-myodr profile-content-box shadow-none pf-vend-spa-booking user-restaurents-order-block">
                                    <Row gutter={30}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            {/* <Select defaultValue="Restaurant" className="purpel-selct-list">
                                                <Option value="Restaurant">Restaurant</Option>
                                            </Select> */}
                                            <Card
                                                className='profile-content-shadow-box'
                                                bordered={false}
                                                title=''
                                            >  
                                                <Tabs onChange={this.onTabChange} defaultActiveKey="1">
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
                                title='Reorder'
                                visible={this.state.isVisiableReOrder}
                                className={'custom-modal style1'}
                                footer={false}
                                onCancel={this.hideReorderModal}
                                destroyOnClose={true}
                            >
                                <div className='padding'>
                                    <Title> Click Confirm Reorder to add your order item in the cart  </Title>
                                    <Form.Item {...tailLayout}>
                                        <Button type='default' onClick={this.makeReorderConfirm}>Confirm Reorder</Button>
                                    </Form.Item>
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
    { enableLoading, disableLoading, getUserRestaurantCurrentOrders, getUserRestaurantPastOrders, getOrderDetailsById , reOrderRestaurantItems,getCancelRestaurantOrder}
)(MyRestaurantOrders);