
import React from 'react';
import { Link } from 'react-router-dom'
import moment from 'moment'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux';
import { MoreOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Pagination, Layout, Card, Typography, Button, Tabs, Table, Avatar, Row, Col, Input, Select, Divider, InputNumber, Modal } from 'antd';
import AppSidebar from '../../dashboard-sidebar/DashboardSidebar';
import history from '../../../common/History';
import Icon from '../../customIcons/customIcons';
import { getRetailCartAPI, saveForLaterAPI, enableLoading, disableLoading, getRestaurantCart, updateRestaurantCart } from '../../../actions'
import { convertISOToUtcDateformate, salaryNumberFormate } from '../../common';
import 'ant-design-pro/dist/ant-design-pro.css';
import { DEFAULT_IMAGE_TYPE, DASHBOARD_TYPES } from '../../../config/Config';
import { langs } from '../../../config/localization';
import { DASHBOARD_KEYS } from '../../../config/Constant'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import './userdetail.less'

import RestaurentCartChekoutProcess from '../../booking/restaurent/RestaurentCartChekoutProcess';

const { Option } = Select;
const { Title, Text } = Typography;

class RestaurantCartDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      currentOrders: [],
      pastOrders: [],
      cartDetail: [],
      cartId: '',
      totalamount: 0,
      discountedAmt: 0,
      commission_amount: 0,
      restaurantCartItems: [],
      restaurantCartResponse: '',
      tableSourceArray: [],
      sub_total: '',
      cart_discounted_grand_total: '',
      cart_grand_total: '',
      is_promo_applied: 0,
      gst_amount: 0,
      displayCartModal: false,
      restaurantDetail: ''
    };
  }

  /**
   * @method  componentDidMount
   * @description called after mounting the component 
   */
  componentDidMount() {
    this.props.enableLoading()
    //this.getRetailCartDetail()
    this.getRestaurantCartItem();
  }

  getRestaurantCartItem = () => {
    this.props.enableLoading();
    this.props.getRestaurantCart((response) => {
      if (response.status === 200) {
        
        this.props.disableLoading();
        const tableSourceArray = [];
        response.data.data.cart_items && response.data.data.cart_items.length > 0 && response.data.data.cart_items.map((el, i) => {
          tableSourceArray.push({
            key: i,
            business_profile_id: el.business_profile_id,
            menu_id: el.menu_id,
            menu_item_choice_of_preparation_id: el.menu_item_choice_of_preparation_id,
            menu_item_id: el.menu_item_id,
            menu_item_name: el.menu_item_name,
            price: el.price / el.quantity,
            restaurant_cart_id: el.restaurant_cart_id,
            service_type: el.service_type,
            quantity: el.quantity,
            amount: parseInt(el.price),
            cart_item_id: el.id
          });
        });

        let restaurantData = {
          cover_photo: response.data.data && response.data.data.restaurant_image ? response.data.data.restaurant_image : '',
          business_name: response.data.data && response.data.data.restaurant_name ? response.data.data.restaurant_name : '',
          address: response.data.data && response.data.data.restaurant_location ? response.data.data.restaurant_location : '',
          user_id: response.data.data && response.data.data.trader_user_id ? response.data.data.trader_user_id : '',
        }
        this.setState({
          tableSourceArray: tableSourceArray,
          restaurantCartItems: response.data.data.cart_items ? response.data.data.cart_items : [],
          restaurantCartResponse: response.data.data ? response.data.data : '',
          sub_total: response.data.data.sub_total ? response.data.data.sub_total : '00.00',
          gst_amount: response.data.data.gst_amount ? response.data.data.gst_amount : '00.00',
          cart_discounted_grand_total: response.data.data.cart_discounted_grand_total ? response.data.data.cart_discounted_grand_total : '00.00',
          cart_grand_total: response.data.data.cart_grand_total ? response.data.data.cart_grand_total : '00.00',
          is_promo_applied: response.data.data.is_promo_applied ? response.data.data.is_promo_applied : '',
          restaurantDetail: restaurantData
        });
      }
    });
  }


  /**
   * @method  getRetailCartDetail
   * @description retail cart details 
   */
  getRetailCartDetail = () => {
    const { isLoggedIn, loggedInDetail } = this.props
    if (isLoggedIn) {
      this.props.getRetailCartAPI({ user_id: loggedInDetail.id }, res => {
        this.props.disableLoading()
        if (res.status === 200) {
          let cartId = this.getCartId(res.data.cartItems)
          this.setState({ cartDetail: res.data.cartItems })
          
        }
      })
    }
  }

  /**
 * @method getCartId
 * @description get all cart id's
 */
  getCartId = (cartDetail) => {
    let temp = [], totalamount = 0, discountedAmt = 0, commission_amount = 0
    if (cartDetail && cartDetail.length) {
      cartDetail.map(el => {
        
        temp.push(el.cart_classified_id)
        totalamount = totalamount + Number(el.price)
        discountedAmt = discountedAmt + Number(el.discount)
        commission_amount = commission_amount + Number(el.commission_amount)
      })
      
      this.setState({
        cartId: temp && temp.length ? temp.join() : '',
        totalamount: totalamount,
        discountedAmt: discountedAmt,
        commission_amount: commission_amount
      })
    }
    
  }

  /**
 * @method paymentProcess
 * @description handle previous steps
 */
  paymentProcess = () => {
    const { loggedInDetail, receiverId } = this.props
    const { cartId, totalamount, discountedAmt } = this.state
    this.props.history.push({
      pathname: `/booking-checkout`,
      state: {
        user_id: loggedInDetail.id,
        cart_classified_ids: cartId,
        payment_source_id: 21,
        address_id: 171,
        booking_type: 'retail',
        trader_user_id: loggedInDetail.id,
        amount: totalamount - discountedAmt
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
      classifiedid: id,
      user_id: loggedInDetail.id
    }
    this.props.enableLoading()
    this.props.saveForLaterAPI(reqData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        toastr.success(langs.success, 'Successfilly added.')
        this.getRetailCartDetail()
      }
    })
  }

  onChangeQuantity = (value, cart_item_id) => {
    let reqData = {
      cart_item_id: cart_item_id,
      quantity: value
    }
    this.props.updateRestaurantCart(reqData, (response) => {
      if (response.status === 200) {
        this.getRestaurantCartItem()
      }
    });
  }

  hideViewCartModal = () => {
    this.setState({ displayCartModal: false });
  }

  showViewCartModal = () => {
    this.setState({ displayCartModal: true });
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { totalamount, discountedAmt, commission_amount, cartDetail, restaurantDetail } = this.state
    const { restaurantCartItems, tableSourceArray, sub_total, gst_amount, cart_discounted_grand_total, cart_grand_total, is_promo_applied } = this.state;

    let step1Data = {
      tableSourceArray: tableSourceArray,
      restaurantCartItems: restaurantCartItems,
      sub_total: sub_total,
      gst_amount: gst_amount,
      cart_discounted_grand_total: cart_discounted_grand_total,
      cart_grand_total: cart_grand_total,
      is_promo_applied: is_promo_applied,
      service_type: restaurantCartItems.length ? restaurantCartItems[0].service_type : ''
    };

    const fixedColumns = [
      {
        title: 'Item',
        key: 'menu_item_name',
        dataIndex: 'menu_item_name',
      },
      {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
        render: (price, record) => <span>${price}</span>
      },
      {
        title: 'Quantity',
        key: 'quantity',
        dataIndex: 'quantity',
        render: (text, record) => { return <InputNumber onChange={(value) => this.onChangeQuantity(value, record.cart_item_id)} min={1} type="number" defaultValue={text} /> }
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        render: (amount, record) => <span>${amount}</span>
      },
    ];

    let total = Number(totalamount) + Number(commission_amount)

    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} activeTabKey={DASHBOARD_KEYS.DASH_BOARD} />
          <Layout>
            <div className='my-profile-box employee-dashborad-box employee-myad-box restaurant-cart-detail' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>

                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>Restaurant</Title>
                  </div> 
                  <div className='right'>
                    <div className='right-content'>
                      <div className='tabs-button'>
                        <Link to='/cart'><Button className='tabview-btn retail-btn'> RETAIL </Button></Link>
                        <Link to='/bookings'><Button className='tabview-btn booking-btn'>BOOKING </Button></Link>
                        <Button className='tabview-btn food-scanner'> FOOD SCANNER </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='sub-head-section'>
                  <Text>All items in yours cart</Text>
                </div>
                <div className='profile-content-box mt-20'>
                  <Card
                    bordered={false}
                    className='add-content-box'
                  >
                    <div className="block-heading">
                      <Row gutter={0}>
                        <Col xs={24} sm={24} md={16} lg={16} >
                          <h2>My Cart</h2>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} className="text-right">
                          <Link>View / Request a receipt</Link>
                        </Col>
                      </Row>
                    </div>
                    <Row gutter={[0]}>
                      <Col xs={24} sm={24} md={16} lg={16} className="bdr-right">
                        <Table
                          pagination={false}
                          dataSource={tableSourceArray}
                          columns={fixedColumns}
                        />
                      </Col>
                      <Col md={8} >
                        <div className="checkout-box">
                          <h2><b>Cart total</b></h2>
                          <Row className="" justify="space-between">
                            {`Item(${restaurantCartItems.length})`}
                            <span>{`$${sub_total}`}</span>
                          </Row>
                          <Row className="" justify="space-between">
                            Fee
                                                <span> $00.00</span>
                          </Row>
                          <Row className="" justify="space-between">
                            Taxes
                                                <span> {`$${gst_amount}`}</span>
                          </Row>
                          <Divider />
                          <Row className="" justify="space-between">
                            <b>Total</b>
                            <Text className="text-right"><b className="total-big-font">{`$${cart_grand_total}`}</b>
                              <div className="fs-10"> Taxes & Fee schudele </div> </Text>
                          </Row>
                          {restaurantCartItems.length > 0 && <div className="text-center">
                            <Button
                              type="danger"
                              className="mt-28 mb-20 checkou-btn"
                              onClick={() => this.showViewCartModal()}
                            > Checkout </Button>
                          </div>
                          }
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  {/* <Card
                                        bordered={false}
                                        className='add-content-box'
                                    >
                                        <Title level={4} className="purple-heading pl-15"> Save for later</Title>
                                        <Row gutter={[20, 20]}>
                                        <Col md={16}>
                                            <Table className="retail-carddetail" dataSource={cartDetail} columns={columns} />;
                                        </Col>
                                        </Row>
                                    </Card> */}
                </div>
              </div>
            </div>
            <Modal
              title='Your Order'
              visible={this.state.displayCartModal}
              className={'custom-modal order-checkout style1'}
              footer={false}
              onCancel={this.hideViewCartModal}
              destroyOnClose={true}
            >
              <div className='padding order-checkout-content-block'>
                <RestaurentCartChekoutProcess initialStep={1} step1Data={step1Data} restaurantDetail={restaurantDetail} />
              </div>
            </Modal>
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
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null
  };
};
export default connect(
  mapStateToProps,
  { getRetailCartAPI, saveForLaterAPI, enableLoading, disableLoading, getRestaurantCart, updateRestaurantCart }
)(RestaurantCartDetail)