import React from "react";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import {
  Empty,
  Layout,
  Card,
  Typography,
  Button,
  Tabs,
  Row,
  Col,
  Select,
  Checkbox,
} from "antd";
import AppSidebar from "../../dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import Icon from "../../customIcons/customIcons";
import {
  changecartItemQuantityAPI,
  removeFromSaveForLaterAPI,
  removeFromCartItemAPI,
  addToCartAPI,
  getSaveCartList,
  getRetailCartAPI,
  saveForLaterAPI,
  enableLoading,
  disableLoading,
} from "../../../actions";
import { dateFormat4, salaryNumberFormate } from "../../common";
import { MESSAGES } from "../../../config/Message";
import "ant-design-pro/dist/ant-design-pro.css";
import { DEFAULT_IMAGE_CARD } from "../../../config/Config";
import { langs } from "../../../config/localization";
import { DASHBOARD_KEYS } from "../../../config/Constant";
import "../user-retail/userdetail.less";
import RemoveCartModel from "./RemoveCartModel";
import SaveForLaterModel from "./SaveForLaterModel";
import AdToCartModel from "./AddTocartModel";

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

class UserRetailCardDetail extends React.Component {
  constructor(props) {
    console.log(props,"propssssssssss")
    super(props);
    this.state = {
      dashboardDetails: {},
      currentOrders: [],
      pastOrders: [],
      cartDetail: [],
      cartId: "",
      totalamount: 0,
      discountedAmt: 0,
      commission_amount: 0,
      savedItemList: "",
      orderList: [],
      removecartModel: false,
      saveforlater: false,
      selectedItem: "",
      checkedCartItemList: [],
      removeSaveLaterModel: false,
      cart_model: false,
      otherItems: [],
      subTotal: 0,
      isChecked:false,
      isCheckedAll:false,
      checkedBoxes: []
    };
  }

  /**
   * @method  componentDidMount
   * @description called after mounting the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getRetailCartDetail();
    this.getSavedCartList();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, 'prevProps')
    console.log(prevState, 'prevState')
  }

  /**
   * @method  getRetailCartDetail
   * @description retail cart details
   */
  getRetailCartDetail = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    if (isLoggedIn) {
      this.props.getRetailCartAPI({ user_id: loggedInDetail.id }, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          this.setState({
            cartDetail: res.data.cartItems,
            orderList:
              Array.isArray(res.data.orderItems) && res.data.orderItems.length
                ? res.data.orderItems
                : [],
            otherItems:
              Array.isArray(res.data.otherItems) && res.data.otherItems.length
                ? res.data.otherItems
                : [],
          });
        }
      });
    }
  };

  /**
   * @method  getSavedCartList
   * @description get saved cart list
   */
  getSavedCartList = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    this.props.getSaveCartList(
      { user_id: loggedInDetail.id, classified_type: "cart" },
      (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          this.setState({ savedItemList: res.data.data });
        }
      }
    );
  };

  /**
   * @method getCartId
   * @description get all cart id's
   */
  getCartId = (cartDetail) => {
    let temp = [],
      totalamount = 0,
      discountedAmt = 0,
      commission_amount = 0;
    if (cartDetail && cartDetail.length) {
      cartDetail.map((el) => {
        console.log('el: card  ', el);
        temp.push(el.cart_classified_id);
        totalamount = totalamount + Number(el.price);
        discountedAmt = discountedAmt + Number(el.discount);
        commission_amount = commission_amount + Number(el.gst_amount);
      });

      this.setState({
        cartId: temp && temp.length ? temp.join() : "",
        totalamount: totalamount,
        discountedAmt: discountedAmt,
        commission_amount: commission_amount,
      });
    }
  };

  /**
   * @method paymentProcess
   * @description handle previous steps
   */
  paymentProcess = () => {
    const { loggedInDetail, userDetails } = this.props;
    const {
      checkedCartItemList,
      cartId,
      discountedAmt,
      commission_amount,
    } = this.state;
    let subTotal = this.getTotalPrice(checkedCartItemList);
    let total = Number(subTotal)
    //+ Number(commission_amount);
    console.log('total:^^^ ', total);
    let orderDetails = checkedCartItemList.map((el) => {
      return {
        classified_id: el.classified_id,
        item_qty: el.qty,
      };
    });

    let placeOrderReqData = {
      order: {
        user_id: loggedInDetail.id,
        order_subtotal: subTotal,
        order_discount: discountedAmt,
        order_grandtotal: Number(subTotal) + Number(commission_amount),
        promo_code: "",
        discount_percent: '',
        customer_fname: userDetails.fname,
        customer_lname: userDetails.lname,
        customer_address1: userDetails.location,
        customer_address2: "",
        customer_city: userDetails.city ? userDetails.city : "",
        customer_state: userDetails.state ? userDetails.state : "",
        customer_country: userDetails.country ? userDetails.country : "",
        customer_postcode: userDetails.pincode ? userDetails.pincode : "",

        order_shipping: "00", // ?
        paypal_response: "",
        paypal_paykey: "",
        paypal_MP_order_id: "",
        payment_method: "paypal",

        transaction_status: "Paid",
        order_status: "Pending",
        transaction_id: "",

        braintree_paykey: "",
        payer_id: "",

        stripe_charge_id: "",
        stripe_transaction_fee: "",

        stripe_charge_status: "",
        out_trade_no: "",
        trade_state: "",
        alipay_trans_status: "",
      },
    };
    placeOrderReqData.orderDetails = orderDetails;
    this.props.history.push({
      //pathname: `/booking-checkout`,
      pathname: `/retail-checkout`,
      state: {
        user_id: loggedInDetail.id,
        cart_classified_ids: cartId,
        payment_source_id: 21,
        address_id: 171,
        booking_type: "retail_cart",
        trader_user_id: loggedInDetail.id,
        amount: subTotal - discountedAmt,
        placeOrderReqData,
        checkedCartItemList,
        subTotal: subTotal,
        commission_amount: commission_amount,
        total: Number(subTotal) + Number(commission_amount),
      },
    });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { selectedDate, flag } = this.state;
    this.getDashBoardDetails(selectedDate, flag, e, "");
  };

  /**
   * @method saveToLater
   * @description save product to later
   */
  saveToLater = (el, key) => {
    console.log("el", el);
    const { loggedInDetail } = this.props;
    const reqData = {
      classifiedid: el.classified_id ? el.classified_id : el.id,
      user_id: loggedInDetail.id,
      classified_type: "cart",
    };
    this.props.enableLoading();
    this.props.saveForLaterAPI(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, "Successfilly added.");
        this.getRetailCartDetail();
        this.getSavedCartList();
        if (key === "my_cart" && key !== "order_item") {
          this.setState({ saveforlater: true, selectedItem: el });
        } else {
          this.setState({ cart_model: false, removeSaveLaterModel: false });
        }
      }
    });
  };

  /**
   * @method adToCart
   * @description ad to cart
   */
  adToCart = (el, key) => {
    const { loggedInDetail, isLoggedIn } = this.props;
    let requestData = {
      ship_cost: 0,
      available_qty:
        key === "order_list"
          ? el.order_detail_product && el.order_detail_product.quantity
          : el.quantity,
      qty: key === "order_list" ? el.item_qty : el.qty ? el.qty : 1,
      classified_id: el.classified_id ? el.classified_id : el.id,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.addToCartAPI(requestData, (res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          toastr.success(langs.success, MESSAGES.AD_TO_CART);
          this.getRetailCartDetail();
          this.getSavedCartList();
          if (key === "my_cart") {
            this.setState({
              cart_model: false,
              removecartModel: false,
              saveforlater: false,
              selectedItem: el,
            });
          } else if (key === "my_wishlist") {
            this.setState({ cart_model: true,selectedItem: el});
          } else {
            this.setState({
              cart_model: false,
              removecartModel: false,
              saveforlater: false,
            });
          }
        } else {
          toastr.error(langs.error, res.data.msg);
        }
      }
    });
  };

  /**
   * @method removeFromCart
   * @description removed from cart integration
   */
  removeFromCart = (item, key) => {
    console.log("item", item);
    let requestData = {
      id: item.id,
      cart_id: item.cart_id,
    };
    this.props.removeFromCartItemAPI(requestData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, res.data.msg);
        this.getRetailCartDetail();
        if (key !== "order_list") {
          this.setState({ removecartModel: true, selectedItem: item });
        }
      }
    });
  };

  /**
   * @method removeFromSaveFromLaterList
   * @description remove from save from later list
   */
  removeFromSaveFromLaterList = (item) => {
    const { loggedInDetail } = this.props;
    let requestData = {
      classifiedid: item.classified_id,
      // id: item.classified_id,
      user_id: loggedInDetail.id,
    };
    this.props.removeFromSaveForLaterAPI(requestData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, res.data.msg);
        this.getRetailCartDetail();
        this.getSavedCartList();
        this.setState({ removeSaveLaterModel: true, selectedItem: item });
      }
    });
  };

  /**
   * @method handleAdtoCartlist
   * @description handle cart item list
   */
  //   handleAdtoCartlist = (checked, item) => {
  //     const { checkedCartItemList } = this.state;
  //     this.getCartId(checkedCartItemList);
  //     if (checked) {
  //       this.setState({ checkedCartItemList: [...checkedCartItemList, item] });
  //     } else {
  //       this.setState({
  //         checkedCartItemList: [
  //           ...checkedCartItemList.filter((e) => e.id !== item.id),
  //         ],
  //       });
  //     }
  //   };
  //@supriya

  handleAdtoCartlist = (checked, item, name) => {
    const checkedBoxes = [...this.state.checkedBoxes];
   
    if(checked) {
      checkedBoxes.push(item)
    } else {
      const index = checkedBoxes[0].findIndex((ch) => ch.id === item.id);
      console.log(index,'index')
      checkedBoxes.splice(index, 1);
    }
    this.setState({checkedBoxes : checkedBoxes});
    // const{name} = item.target;
    const { checkedCartItemList } = this.state;
    let newCheckedCartItemList;
   
    if (checked) {
      this.setState({isCheckedAll:!this.state.isCheckedAll});
      newCheckedCartItemList = item;
     
    } else {
      this.setState({isCheckedAll:!this.state.isCheckedAll});
      newCheckedCartItemList = []
      
    }
    this.setState({
      checkedCartItemList: newCheckedCartItemList
    });
        console.log(checkedCartItemList,"aaaaaaaaaaaaaaa")

    this.getCartId(newCheckedCartItemList)
  
}
handleAdtoCartlistSingle = (checked, item) => {
   
  const { checkedCartItemList } = this.state;
  let mycheckboxes = [...this.state.checkedBoxes]
  let newCheckedCartItemList;
  if (checked) {
    
    this.setState({isChecked:!this.state.isChecked});
   if(checkedCartItemList.length<0){
    newCheckedCartItemList = [checkedCartItemList, item];
   }else{
    newCheckedCartItemList = [...checkedCartItemList, item];
   }
  } else {

    this.setState({isChecked:!this.state.isChecked});
    this.setState({isCheckedAll: false})
    newCheckedCartItemList = [
      ...checkedCartItemList.filter((e) => e.id !== item.id),
    ];
  }
  mycheckboxes[0]= newCheckedCartItemList
  this.setState({
    checkedCartItemList: newCheckedCartItemList
  });
  this.setState({checkedBoxes:mycheckboxes})

  this.getCartId(newCheckedCartItemList)

}
  /**
   * @method handleAdtoCartlist
   * @description handle quantity change
   */
  handleQuantityChange = (value, item) => {
    let requestData = {
      cart_classified_id: item.cart_classified_id,
      new_quantity: value,
    };
    this.props.changecartItemQuantityAPI(requestData, (res) => {
      toastr.success(langs.success, res.data.message);
      this.getRetailCartDetail();
    });
  };

  getAvailableQuantity = (el) => {
    let rows = [];
    for (let i = 1; i < el.quantity; i++) {
      rows.push(i);
    }
    return rows;
  };

  /**
   * @method renderCartItems
   * @description render cart items
   */
  renderCartItems = (cartDetail) => {
    if (cartDetail) {
      return cartDetail.map((el, i) => {
        let price = Number(el.qty) * Number(el.price);
        let qunatity = this.getAvailableQuantity(el);
        let selectedItem = el;
        return (
          <div className="cart-detail-box" key={i}>
            <Row className="p-5">
              <Col Col md={1}>
              <input
                  type="Checkbox"
                  onChange={(e) =>
                    this.handleAdtoCartlistSingle(e.target.checked, el)
                  }
                  checked={this.state.checkedCartItemList.find((ch) => ch.id === selectedItem.id)}
                  name="inputcheck"
                />
              </Col>
              <Col md={2}>
                <div className="cart-detail-mid1-box">
                  <img
                    src={
                      el.photo
                        ? el.photo
                        : require("../../../assets/images/bigcar.png")
                    }
                    alt="Product Image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE_CARD;
                    }}
                  />
                </div>
              </Col>
              <Col md={17}>
                <div className="cart-detail-mid2-box">
                  <p>{el.title}</p>
                  <div className="d-flex">
                    <div className="choose-qty-of-cart">
                      <span>Qty:</span>
                      <Select
                        value={el.qty}
                        onChange={(value) =>
                          this.handleQuantityChange(value, el)
                        }
                      >
                        {qunatity.map((qty, i) => {
                          return (
                            <Option value={qty} key={i}>
                              {qty}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                    <Link onClick={() => this.removeFromCart(el, "my_cart")}>
                      Remove
                    </Link>
                    <Link onClick={() => this.saveToLater(el, "my_cart")}>
                      Save for later
                    </Link>
                    <Link to={"retail/"+el.category_id+"/"+el.parent_categoryid}>See more like this</Link>
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-right">
                <strong className="cart-pro-prize">{`$${salaryNumberFormate(
                  parseInt(price)
                )}`}</strong>
              </Col>
            </Row>
          </div>
        );
      });
    }
  };

  /**
   * @method renderSaveForlaterItem
   * @description render save for later
   */
  renderSaveForlaterItem = (item) => {
    if (item && item.length) {
      return item.map((el, i) => {
        return (
          <div className="cart-detail-box">
            <Row className="p-5">
              <Col Col md={1}></Col>
              <Col md={2}>
                <div className="cart-detail-mid1-box">
                  <img
                    src={
                      el.imageurl
                        ? el.imageurl
                        : require("../../../assets/images/bigcar.png")
                    }
                    alt="Product Image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE_CARD;
                    }}
                  />
                </div>
              </Col>
              <Col md={17}>
                <div className="cart-detail-mid2-box">
                  <p>{el.title}</p>
                  <div className="d-flex">
                    {/* <div className="choose-qty-of-cart"> 
                                            <span>Qty:</span>
                                            <Select defaultValue="1">
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                            </Select>
                                        </div> */}
                    <Link
                      onClick={() =>
                        this.removeFromSaveFromLaterList(el, "my_wishlist")
                      }
                    >
                      Remove
                    </Link>
                    <Link onClick={() => this.adToCart(el, "my_wishlist")}>
                      Move to cart
                    </Link>
                    <Link to={"retail/"+el.category_id+"/"+el.parent_categoryid}>See more like this</Link>
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-right">
                <strong className="cart-pro-prize">{`$${salaryNumberFormate(
                  parseInt(el.price)
                )}`}</strong>
              </Col>
            </Row>
          </div>
        );
      });
    }
  };

  /**
   * @method renderSelectedItemList
   * @description render selected item
   */
  
  renderSelectedItemList = (item) => {
    
    if (item && item.length) {
      return item.map((el, i) => {
        let qunatity = this.getAvailableQuantity(el);
        let price = Number(el.qty) * Number(el.price);
        
        return (
          <div className="your-cart-product-box" key={i}>
            <Select
              value={el.qty}
              defaultValue={el.qty}
              onChange={(value) => this.handleQuantityChange(value, el)}
            >
              {qunatity.map((qty, i) => {
                return (
                  <Option value={qty} key={i}>
                    {qty}
                  </Option>
                );
              })}
            </Select>
            <p>{el.title}</p>
            <span>{`$${salaryNumberFormate(price)}`}</span>
          </div>
        );
      });
    }
  };

  /**
   * @method getTotalPrice
   * @description get total price
   */
  getTotalPrice = (item) => {
    let count = 0;
    if (item && item.length) {
      item.map((el, i) => {
        count = count + Number(el.price) * Number(el.qty);
      });
    }
    return count;
  };

  /**
   * @method renderCheckoutCard
   * @description render checkout card
   */
  renderCheckoutCard = (item) => {
    const { commission_amount } = this.state;
    let totalamount = this.getTotalPrice(item);
    let total = Number(totalamount)
    //+ Number(commission_amount);
    return (
      <div className="cart-total-box">
        <h1>Your Cart</h1>
        <div className="item-box">{this.renderSelectedItemList(item)}</div>
        <div className="cart-product-total">
          <ul>
            <li>Subtotal</li>
            <li>{`$${salaryNumberFormate(totalamount)}`}</li>
          </ul>
          <ul>
            <li>GST Amount</li>
            <li>{`$${commission_amount}`}</li>
          </ul>
          <ul className="cart-total">
            <li>Total (Inclusive GST)</li>
            <li>{total ? `$${salaryNumberFormate(total+commission_amount)}` : "$00.00"}</li>
          </ul>
          <Button onClick={() => this.paymentProcess()}>Checkout</Button>
        </div>
      </div>
    );
  };

  renderOderedItems = (orderDetail, key) => {
    console.log("data", orderDetail);
    if (orderDetail) {
      return orderDetail.map((el, i) => {
        let title = key === "ordered_item" ? el.item_name : el.title;
        let item_price = key === "ordered_item" ? el.item_price : el.price;
        let qty = key === "ordered_item" ? el.item_qty : el.quantity;
        let price = Number(qty ? qty : 1) * Number(item_price);
        let qunatity = this.getAvailableQuantity(
          key === "ordered_item" ? el.order_detail_product : el
        );
        let image =
          key === "ordered_item"
            ? el.order_detail_product && el.order_detail_product.photo
              ? el.order_detail_product.photo
              : ""
            : el.photo;
        return (
          <div className="cart-detail-box" key={i}>
            <Row className="p-5">
              <Col Col md={1}></Col>
              <Col md={5}>
                <div className="cart-detail-mid1-box">
                  <img
                    src={image ? image : DEFAULT_IMAGE_CARD}
                    alt="Product Image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE_CARD;
                    }}
                  />
                </div>
              </Col>
              <Col md={14}>
                <div className="cart-detail-mid2-box">
                  <p>{title}</p>
                  <div className="d-flex">
                    {/* <div className="choose-qty-of-cart"> 
                                            <span>Qty: {qty}</span>
                                            <Select value={qty} 
                                                onChange={(value) => this.handleQuantityChange(value, el)}
                                            >
                                                {qunatity.map((qty, i) => {
                                                    return (
                                                        <Option value={qty} key={i}>{qty}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </div> */}
                    {/* <Link onClick={() => this.removeFromCart(el, 'order_list')}>Remove</Link> */}
                    <Link onClick={() => this.adToCart(el, "order_list")}>
                      Move to cart
                    </Link>
                    <Link onClick={() => this.saveToLater(el, "order_item")}>
                      Move to wishlist
                    </Link>
                  </div>
                  <div className="d-flex">
                    <label>Order ID: {el.id} </label>&nbsp;&nbsp;
                    <label>
                      Last bought date: {dateFormat4(el.updated_at)}
                    </label>
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-right">
                <strong className="cart-pro-prize">{`$${salaryNumberFormate(
                  parseInt(price)
                )}`}</strong>
              </Col>
            </Row>
          </div>
        );
      });
    }
  };



  /**
   * @method render
   * @description render component
   */
  render() {

   
    

    const {
      otherItems,
      cart_model,
      removeSaveLaterModel,
      checkedCartItemList,
      saveforlater,
      selectedItem,
      removecartModel,
      orderList,
      cartDetail,
      savedItemList,
    } = this.state;
    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box retail-cart"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab cart-page">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Retail</Title>
                  </div>
                  <div className="right">
                    <div className="right-content">
                      <div className="tabs-button">
                        <Link to="/restaurant-cart">
                          <Button className="tabview-btn dashboard-btn">
                            RESTAURANT
                          </Button>
                        </Link>
                       
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-content-box cart-content-box">
                  <Card bordered={false} className="add-content-box">
                    <Row>
                      <Col md={16} className="">
                        <div className="cart-top shadow"> <div className="card-detail-box-title">
                          <div>
                            <h1>My cart</h1>
                            
                            <span><input type="checkbox" name="allSelect" checked={this.state.isCheckedAll} onChange={(e) =>this.handleAdtoCartlist(e.target.checked,cartDetail,e.target.name)}/> Select all items</span>
                          </div>
                          <div style={{ alignSelf: "flex-end" }}>
                            <span>Prize</span>
                          </div>
                        </div>
                        {cartDetail && cartDetail.length ? (
                          this.renderCartItems(cartDetail)
                        ) : (
                          <Empty />
                        )}</div>
                        <div md={24} className="shadow card-detail-tab ">
                          <div className="tab-title">
                            <h4>Your items</h4>
                            
                          </div>
                          <span className="price"><span>Prize</span></span>
                          <Tabs   
                            defaultActiveKey="1"
                            className="card-detail-tab-box"
                          >
                            <TabPane
                              tab={`Saved for later (${savedItemList && savedItemList.length
                                } items)`}
                              key="1"
                            >
                              {savedItemList && savedItemList.length !== 0 ? (
                                this.renderSaveForlaterItem(savedItemList)
                              ) : (
                                <Empty />
                              )}
                            </TabPane>
                            <TabPane tab="Buy it again" key="2">
                              {orderList && orderList.length !== 0 ? (
                                this.renderOderedItems(
                                  orderList,
                                  "ordered_item"
                                )
                              ) : otherItems && otherItems.length !== 0 ? (
                                this.renderOderedItems(otherItems, "other_item")
                              ) : (
                                <Empty />
                              )}
                            </TabPane>
                            {console.log('orderList',orderList)}
                            {console.log('otherItems',otherItems)}
                          </Tabs>
                        </div>
                      </Col>
                      
                      {checkedCartItemList && checkedCartItemList.length !== 0 && (
                        <Col md={6} className="checkout-box ">
                          <div className="shadow">{this.renderCheckoutCard(checkedCartItemList)}</div>
                        </Col>
                      )}
                    </Row>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {removecartModel && (
          <RemoveCartModel
            visible={removecartModel}
            onCancel={() => this.setState({ removecartModel: false })}
            image={selectedItem ? selectedItem.photo : ""}
            title={selectedItem ? selectedItem.title : ""}
            callNext={() => this.adToCart(selectedItem)}
            label={"cart"}
          />
        )}
        {saveforlater && (
          <SaveForLaterModel
            visible={saveforlater}
            onCancel={() => this.setState({ saveforlater: false })}
            image={selectedItem ? selectedItem.photo : ""}
            title={selectedItem ? selectedItem.title : ""}
            callNext={() => this.adToCart(selectedItem)}
          />
        )}
        {removeSaveLaterModel && (
          <RemoveCartModel
            visible={removeSaveLaterModel}
            onCancel={() => this.setState({ removeSaveLaterModel: false })}
            image={selectedItem ? selectedItem.imageurl : ""}
            title={selectedItem ? selectedItem.title : ""}
            callNext={() => this.saveToLater(selectedItem)}
            label={"wishlist"}
          />
        )}
        {cart_model && (
          <AdToCartModel
            visible={cart_model}
            onCancel={() => this.setState({ cart_model: false })}
            image={selectedItem ? selectedItem.imageurl : ""}
            title={selectedItem ? selectedItem.title : selectedItem.item_name}
            callNext={() => this.saveToLater(selectedItem)}
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
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};

// cartquantity = (props) => {
// const { userquantity } = props;
// console.log(userquantity);
// }

export default connect(mapStateToProps, {
  changecartItemQuantityAPI,
  removeFromSaveForLaterAPI,
  removeFromCartItemAPI,
  addToCartAPI,
  getSaveCartList,
  getRetailCartAPI,
  saveForLaterAPI,
  enableLoading,
  disableLoading,
  
  
})(UserRetailCardDetail);