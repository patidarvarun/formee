
import React from 'react';
import { Link } from 'react-router-dom'
import moment from 'moment'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux';
import { MoreOutlined  } from '@ant-design/icons';
import { Menu,Dropdown,Pagination, Layout,Card, Typography, Button,Tabs, Table, Avatar, Row, Col, Input, Select, Divider } from 'antd';
import AppSidebar from '../../dashboard-sidebar/DashboardSidebar';
import history from '../../../common/History';
import Icon from '../../customIcons/customIcons';
import {addToCartAPI,getSaveCartList,getRetailCartAPI,saveForLaterAPI, enableLoading, disableLoading } from '../../../actions'
import { convertISOToUtcDateformate, salaryNumberFormate } from '../../common';
import { MESSAGES } from '../../../config/Message'
import 'ant-design-pro/dist/ant-design-pro.css';
import { DEFAULT_IMAGE_TYPE, DASHBOARD_TYPES } from '../../../config/Config';
import { langs } from '../../../config/localization';
import { DASHBOARD_KEYS } from '../../../config/Constant'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import './userdetail.less'
const { Option } = Select;
const { Title, Text } = Typography;

// Pagination
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
    }
    if (type === 'next') {
        return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
    }
    return originalElement;
}
class UserRetailCardDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dashboardDetails: {},
            currentOrders:[],
            pastOrders:[],
            cartDetail:[],
            cartId: '', 
            totalamount: 0, 
            discountedAmt: 0,
            commission_amount:0,
            savedItemList: ''
        };
    }

    /**
     * @method  componentDidMount
     * @description called after mounting the component 
     */
    componentDidMount() {
        this.props.enableLoading()
        this.getRetailCartDetail()
        this.getSavedCartList()
    }

    /**
     * @method  getRetailCartDetail
     * @description retail cart details 
     */
    getRetailCartDetail = () => {
        const {isLoggedIn, loggedInDetail } = this.props
        if(isLoggedIn){
            this.props.getRetailCartAPI({user_id:loggedInDetail.id}, res => {
                this.props.disableLoading()
                if(res.status === 200){
                    let cartId = this.getCartId(res.data.cartItems)
                    this.setState({cartDetail: res.data.cartItems})
                    
                }
            })
        }
    }

    /**
     * @method  getSavedCartList
     * @description get saved cart list
     */
    getSavedCartList = () => {
        const {isLoggedIn, loggedInDetail } = this.props
        this.props.getSaveCartList({user_id:loggedInDetail.id, classified_type:'cart'}, res => {
            this.props.disableLoading()
            if(res.status === 200){
                this.setState({savedItemList: res.data.data})
            }
        })
    }

     /**
    * @method getCartId
    * @description get all cart id's
    */
    getCartId = (cartDetail) => {
        let temp=[], totalamount = 0, discountedAmt =0,commission_amount=0
        if(cartDetail && cartDetail.length){
            cartDetail.map(el =>{
                
                temp.push(el.cart_classified_id)
                totalamount = totalamount + Number(el.price)
                discountedAmt = discountedAmt + Number(el.discount)
                commission_amount= commission_amount + Number(el.commission_amount)
            })
            
            this.setState({
                cartId: temp && temp.length ? temp.join() : '',
                totalamount:totalamount,
                discountedAmt:discountedAmt,
                commission_amount: commission_amount
            })
        }
        
    }

     /**
    * @method paymentProcess
    * @description handle previous steps
    */
    paymentProcess = () => {
        const {loggedInDetail,receiverId,userDetails} = this.props
        const { cartId,totalamount, discountedAmt,cartDetail,commission_amount } = this.state
        let total = Number(totalamount) + Number(commission_amount)
        let orderDetails = cartDetail.map((el) => {
            return {
                classified_id: el.classified_id,
                item_qty: el.qty,
            }
        })

        let placeOrderReqData = {
            order: {
                user_id: loggedInDetail.id,
                order_subtotal: totalamount,
                order_discount: discountedAmt,
                order_grandtotal: total,
                promo_code: "SIPL",
                customer_fname: userDetails.fname,
                customer_lname: userDetails.lname,
                customer_address1: userDetails.location,
                customer_address2: "",
                customer_city: userDetails.city ? userDetails.city : '',
                customer_state: userDetails.state ? userDetails.state : '',
                customer_country: userDetails.country ? userDetails.country : '',
                customer_postcode: userDetails.pincode ? userDetails.pincode : '',

                order_shipping: 10,  // ?
                paypal_response: "",
                paypal_paykey: "",
                paypal_MP_order_id: "",
                payment_method: "paypal",

                transaction_status: "Paid",
                order_status: "Pending",
                transaction_id: "rchbgkwf",

                braintree_paykey: "",
                payer_id: "",

                stripe_charge_id: "",
                stripe_transaction_fee: "",

                stripe_charge_status: "",
                out_trade_no: "",
                trade_state: "",
                alipay_trans_status: "",
            }
        }
        placeOrderReqData.orderDetails = orderDetails
        this.props.history.push({
            pathname: `/booking-checkout`,
            state: {
                user_id: loggedInDetail.id,
                cart_classified_ids: cartId,
                payment_source_id: 21,
                address_id:171,
                booking_type: 'retail',
                trader_user_id: loggedInDetail.id,
                amount: totalamount-discountedAmt,
                placeOrderReqData
            }
        })
    }

    /**
     * @method handlePageChange
     * @description handle page change
     */
    handlePageChange = (e) => {
        const { selectedDate, flag } = this.state
        this.getDashBoardDetails(selectedDate, flag, e, '')
    }

    /**
     * @method saveToLater
     * @description save product to later
     */
    saveToLater = (id) => {
        const { loggedInDetail } = this.props
        const reqData = {
            classifiedid:id,
            user_id:loggedInDetail.id,
            classified_type:'cart'
        }
        this.props.enableLoading()
        this.props.saveForLaterAPI(reqData, res => {
            this.props.disableLoading()
            if(res.status === 200){
                toastr.success(langs.success, 'Successfilly added.')
                // this.getRetailCartDetail()
                 this.getRetailCartDetail()
                this.getSavedCartList()
            }
        })
    }

    /**
     * @method adToCart
     * @description ad to cart
     */
    adToCart = (el) => {
        const { loggedInDetail, isLoggedIn } = this.props
        let requestData = {
            ship_cost: 0,
            available_qty: el.quantity,
            qty: el.quantity,
            classified_id: el.classifiedid,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.addToCartAPI(requestData, res => {
            if(res.status === 200){
                if(res.data.status == 1){
                    toastr.success(langs.success, MESSAGES.AD_TO_CART)
                    this.getRetailCartDetail()
                    this.getSavedCartList()
                }else {
                    toastr.error(langs.error, res.data.msg)
                }
            }
        })
    }

    /**
     * @method render
     * @description render component  
     */
    render() {
        const {totalamount,commission_amount,cartDetail,savedItemList} = this.state
       

      const columns = [
         {
            title: 'item',
            dataIndex: 'name',
            // key: 'name'
                render: (cell, row, index) => {
                   return (
                         <>
                         <div className='user-icon mr-13 d-flex userdetail-itemtable'>
                             <Avatar  src={row.photo}/>
                             <div>
                                <Text><b>{row.title}</b> </Text><br/>
                                <Text>{row.business_name ? row.business_name : ''}</Text><br/>
                                <Button className="outline-btn-rounded">Retail </Button> </div>
                           </div>
                        </>
                     )
                 }
             },
             {
                 title: 'Quantity',
                 dataIndex: 'qty',
                 key: 'qty',
             },
           
             {
                title: 'Total',
               dataIndex: 'price',
               className: 'text-right',
                render: (cell, row, index) => { 
                let price = parseInt(row.price)
                  return (
                    <Row className='user-retail'> 
                        <Col md={22}>
                            <Text>{row.price && `$${salaryNumberFormate(price)}`}</Text><br/>
                            <Text className="fs-10 taxes-info"> Taxes & fee includes <br/>
                                {row.delivery_time ? row.delivery_time : 'standard dilevery 3-4 days'} 
                            </Text><br/>
                            <Link className="save-later-link" onClick={() => this.saveToLater(row.classified_id)}>Save for later</Link>
                        </Col>
                        <Col md={2} className="pl-10" >
                           <CloseOutlined /> 
                         </Col>
                    </Row>
                  )
                 }
             }
         ];

         const columns2 = [
            {
               title: 'item',
               dataIndex: 'name',
               // key: 'name'
                   render: (cell, row, index) => {
                      return (
                            <>
                            <div className='user-icon mr-13 d-flex userdetail-itemtable'>
                                <Avatar  src={row.imageurl}/>
                                <div>
                                   <Text><b>{row.title}</b> </Text><br/>
                                   <Text>{row.business_name ? row.business_name : ''}</Text><br/>
                                   <Button className="outline-btn-rounded">Retail </Button> </div>
                              </div>
                           </>
                        )
                    }
                },
                {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    key: 'quantity',
                },
              
                {
                   title: 'Total',
                  dataIndex: 'price',
                  className: 'text-right',
                   render: (cell, row, index) => { 
                       let price = parseInt(row.price)
                     return (
                       <Row className='user-retail'> 
                           <Col md={22}>
                               <Text>{row.price && `$${salaryNumberFormate(price)}`}</Text><br/>
                               <Text className="fs-10 taxes-info"> Taxes & fee includes <br/>
                                   {row.delivery_time ? row.delivery_time : 'standard dilevery 3-4 days'} 
                               </Text><br/>
                               <Link className="save-later-link" onClick={() => this.adToCart(row)}>Ad to cart</Link>
                           </Col>
                           <Col md={2} className="pl-10" >
                              <CloseOutlined /> 
                            </Col>
                       </Row>
                     )
                    }
                }
            ];
         
         let total = Number(totalamount) + Number(commission_amount)
      
        return (
            <Layout>
                <Layout>
                    <AppSidebar history={history} activeTabKey={DASHBOARD_KEYS.DASH_BOARD} />
                    <Layout>
                        <div className='my-profile-box employee-dashborad-box employee-myad-box retail-cart' style={{ minHeight: 800 }}>
                            <div className='card-container signup-tab'>
                                <div className='top-head-section'>
                                    <div className='left'>
                                        <Title level={2}>Retail</Title>
                                    </div>
                                    <div className='right'>
                                        <div className='right-content'>
                                            <div className='tabs-button'>       
                                            <Link to='/restaurant-cart'><Button className='tabview-btn dashboard-btn'>RESTAURANT</Button></Link>
                                            <Link to='/bookings'><Button className='tabview-btn booking-btn'>BOOKING </Button></Link>
                                            {/* <Button className='tabview-btn food-scanner'> FOOD SCANNER </Button>  */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='profile-content-box'>
                                   <Text className="fs-14 "> All items in yours cart</Text>
                                   <Row className="pink-strip mt-20" justify="space-between">
                                       <Text className="" > RETAIL Cart</Text>  
                                        <Link> View / Request a receipt</Link>                              
                                    </Row>
                                    <Card
                                        bordered={false}
                                        className='add-content-box'
                                    >
                                    <Row gutter={[20, 20]}>
                                        <Col md={16}>
                                        
                                            <Table className="retail-carddetail" dataSource={cartDetail} columns={columns} />
                                        </Col>
                                        <Col md={8} className="checkout-box">
                                            <div className="pt-30 pb-20 fs-18"><b>Cart Total</b></div> 

                                            <Row className="pr-15" justify="space-between">
                                                {`item(${cartDetail.length})`}  
                                                    <span>{totalamount ? `$${parseInt(totalamount)}` : '$00.00'}</span>
                                            </Row> 
                                            <Row className="pr-15" justify="space-between">
                                                Fee 
                                                <span> $00.00</span>
                                            </Row>
                                            <Row className="pr-15" justify="space-between">
                                                Taxes 
                                                <span> {`$${commission_amount}`}</span>
                                            </Row>
                                            <Divider/>
                                            <Row className="pr-15" justify="space-between">
                                                <b>Total</b>  
                                                    <Text className="text-right price"><b>{total ? `$${parseInt(total)}` : '$00.00'}</b> <br/>
                                                <span className="fs-10"> Taxes & Fee schudele </span> </Text>
                                            </Row>
                                            {cartDetail.length > 0 && <div className="text-center">
                                                <Button 
                                                    type="danger" 
                                                    className="mt-20 mb-20 checkou-btn "
                                                    onClick={() => this.paymentProcess()}
                                                > Checkout </Button>
                                            </div>}
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Card
                                        bordered={false}
                                        className='add-content-box'
                                    >
                                        <Title level={4} className="purple-heading pl-15"> Save for later</Title>
                                            <Row gutter={[20, 20]}>
                                                <Col md={16}>
                                                    <Table className="retail-carddetail" dataSource={savedItemList} columns={columns2} />
                                                </Col>
                                            </Row>
                                    </Card>
                                </div>
                            </div>
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
        loggedInDetail: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {}
    };
};
export default connect(
    mapStateToProps,
    {addToCartAPI,getSaveCartList,getRetailCartAPI,saveForLaterAPI, enableLoading, disableLoading }
)(UserRetailCardDetail)