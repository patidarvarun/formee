import React from "react";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import {
  Layout,
  Card,
  Typography,
  Button,
  Table,
  Avatar,
  Row,
  Col,
  Select,
  Radio,
  Divider,
  InputNumber,
  Modal,
} from "antd";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import {
  getRetailCartAPI,
  saveForLaterAPI,
  enableLoading,
  disableLoading,
  getRestaurantCart,
  updateRestaurantCart,
  getUserAddress,
  setRestaurantAddress,
  removeRestaurantCartAPI,
} from "../../../../actions";
import "ant-design-pro/dist/ant-design-pro.css";
import { langs } from "../../../../config/localization";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import TextArea from "antd/lib/input/TextArea";
import "../../../retail/user-retail/userdetail.less";

import RestaurentCartChekoutProcess from "../RestaurentCartChekoutProcess";
import AddUserAddress from "../RestaurentCartChekoutProcess/AddUserAddress";
import UpdateAddressModdel from "../restaurant-cart/EditAddressModel";
import { splitDescription } from "../../../common";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

class RestaurantCartDetail extends React.Component {
  constructor(props) {
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
      restaurantCartItems: [],
      restaurantCartResponse: "",
      tableSourceArray: [],
      sub_total: "",
      cart_discounted_grand_total: "",
      cart_grand_total: "",
      is_promo_applied: 0,
      gst_amount: 0,
      displayCartModal: false,
      displayAddressModal: false,
      restaurantDetail: "",
      defaultaddress: "",
      trader_user_id: "",
      cartResponse:"",
    };
 
  }

  /**
   * @method  componentWillMount
   * @description called after mounting the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getRestaurantCartItem();
    this.getUserAddedAddress();
  }

  /**
   * @method getUserAddedAddress
   * @description get user address list
   */
  getUserAddedAddress = () => {
    this.props.getUserAddress((response) => {
      if (response.status === 200) {
        let address =
          response.data.data &&
          Array.isArray(response.data.data) &&
          response.data.data.length
            ? response.data.data[0]
            : "";
        this.props.setRestaurantAddress(address);
      }
    });
  };

  getRestaurantCartItem = () => {
    this.props.enableLoading();
    this.props.getRestaurantCart((response) => {
     
      if (response.status === 200) {
        this.props.disableLoading();
        const tableSourceArray = [];
        response.data.data.cart_items &&
        response.data.data.cart_items.length > 0 &&
        response.data.data.cart_items.map((el, i) => {
          tableSourceArray.push({
            key: i,
            elements: el,
            business_profile_id: el.business_profile_id,
            menu_id: el.menu_id,
            menu_item_choice_of_preparation_id:
            el.menu_item_choice_of_preparation_id,
            menu_item_id: el.menu_item_id,
            menu_item_name: splitDescription(el.menu_item_name),
            price: Number(el.price),
            restaurant_cart_id: el.restaurant_cart_id,
            service_type: el.service_type,
            quantity: el.quantity,
            amount: parseInt(Number(el.price)),
            cart_item_id: el.id,
            image: el.menu_items && el.menu_items.image,
            description:
            el.menu_items && splitDescription(el.menu_items.details),
          });
        });

        let restaurantData = {
          cover_photo:
            response.data.data && response.data.data.restaurant_image
              ? response.data.data.restaurant_image
              : "",
          business_name:
            response.data.data && response.data.data.restaurant_name
              ? response.data.data.restaurant_name
              : "",
              address:
              response.data.data && response.data.data.restaurant_location
              ? response.data.data.restaurant_location
              : "",
              user_id:
              response.data.data && response.data.data.trader_user_id
              ? response.data.data.trader_user_id
              : "",
            };
            this.setState({
              tableSourceArray: tableSourceArray,
              restaurantCartItems: response.data.data.cart_items
              ? response.data.data.cart_items
              : [],
              restaurantCartResponse: response.data.data ? response.data.data : "",
              sub_total: response.data.data.sub_total
              ? response.data.data.sub_total
              : "00.00",
              gst_amount: response.data.data.gst_amount
              ? response.data.data.gst_amount
              : "00.00",
              cart_discounted_grand_total: response.data.data
              .cart_discounted_grand_total
              ? response.data.data.cart_discounted_grand_total
              : "00.00",
              cart_grand_total: response.data.data.cart_grand_total
              ? response.data.data.cart_grand_total
              : "00.00",
              is_promo_applied: response.data.data.is_promo_applied
              ? response.data.data.is_promo_applied
              : "",
              restaurantDetail: restaurantData,
              trader_user_id: restaurantData && restaurantData.user_id,
              cartResponse: response.data.data.cart_items[0],
            });
      }
    });
  };

  onChangeQuantity = (value, cart_item_id) => {
    let reqData = {
      cart_item_id: cart_item_id,
      quantity: value,
    };
    this.props.updateRestaurantCart(reqData, (response) => {
      if (response.status === 200) {
        this.getRestaurantCartItem();
      }
    });
  };

  hideViewCartModal = () => {
    this.setState({ displayCartModal: false });
  };
  showViewCartModal = () => {
    this.setState({ displayCartModal: true });
  };

  hideViewAddressModal = () => {
    this.setState({ displayAddressModal: false });
  };
  showViewAddressModal = () => {
    this.setState({ displayAddressModal: true });
  };

  /**
   * @method deletecartItem
   * @description delete cart item list
   */
  deletecartItem = (cart_item_id) => {
    let reqData = {
      restaurant_cart_item_id: cart_item_id,
    };
    this.props.removeRestaurantCartAPI(reqData, (res) => {
      if (res.status === 200) {
        toastr.success("Cart item has removed successfully.");
        this.getRestaurantCartItem();
      }
    });
  };

  /**
   * @method navigateToPay
   * @description navigate to checkout process
   */
  navigateToPay = () => {
    const { loggedInDetail, defaultaddress } = this.props;
    const { tableSourceArray, cart_grand_total, restaurantCartItems } =
      this.state;
    const { name, mobile_no } = loggedInDetail;
    var cartItemIds = restaurantCartItems.map(function (item, i) {
      return item.id;
    });
    const { user_id } = this.state.restaurantDetail;
    this.props.history.push({
      pathname: `/restaurent-checkout`,
      state: {
        cart_item_ids: cartItemIds.toString(),
        trader_user_id: user_id,
        address_id: defaultaddress && defaultaddress.id,
        amount: cart_grand_total,
        order_type:
          restaurantCartItems && restaurantCartItems.length
            ? restaurantCartItems[0].service_type
            : "delivery",
        booking_type: "restaurant",
        payment_type: "firstpay",
        customer_name: name,
        mobile_no: mobile_no,
        cart_items: tableSourceArray,
      },
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    
    const {
      restaurantCartItems,
      tableSourceArray,
      sub_total,
      gst_amount,
      cart_discounted_grand_total,
      cart_grand_total,
      is_promo_applied,
      totalamount,
      discountedAmt,
      commission_amount,
      cartDetail,
      restaurantDetail,
      displayAddressModal,
      trader_user_id,
      cartResponse,
    } = this.state;

    console.log(cartResponse,"restss")
   

    let step1Data = {
      tableSourceArray: tableSourceArray,
      restaurantCartItems: restaurantCartItems,
      sub_total: sub_total,
      gst_amount: gst_amount,
      cart_discounted_grand_total: cart_discounted_grand_total,
      cart_grand_total: cart_grand_total,
      is_promo_applied: is_promo_applied,
      service_type: restaurantCartItems.length
        ? restaurantCartItems[0].service_type
        : "",
    };
    const { defaultaddress } = this.props;
    const fixedColumns = [
      {
        title: "Your items",
        key: "elements",
        dataIndex: "elements",
        render: (item, record) => (
          <div className="restaurant-cart-table-item">
            <Avatar
              size={75}
              shape="square"
              src={
                record.image
                  ? record.image
                  : require("../../../../assets/images/restaurant-cart.jpg")
              }
            />
            <div className="content">
              <Title level={4} className="fs-16">
                {record.menu_item_name}
              </Title>
              <div className="qty-box">
                Qty:{" "}
                <InputNumber
                  onChange={(value) =>
                    this.onChangeQuantity(value, record.cart_item_id)
                  }
                  min={1}
                  type="number"
                  value={item.quantity}
                />
              </div>
              <Link
                className="remove-link"
                onClick={(e) => {
                  toastr.confirm(`Are you sure you want to delete this item?`, {
                    onOk: () => this.deletecartItem(record.cart_item_id),
                    onCancel: () => {},
                  });
                }}
              >
                {"Remove"}
              </Link>
            </div>
          </div>
        ),
      },
      {
        title: "Price",
        key: "price",
        dataIndex: "price",
        render: (price, record) => <Title level={4}>${price.toFixed(2)}</Title>,
      },
    ];

    let total = Number(totalamount) + Number(commission_amount);
    let path = trader_user_id
      ? `/bookings-restaurant-detail/Restaurant/39/${trader_user_id}`
      : "/bookings-restaurant/39";
    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box restaurant-cart-detail"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab cart-page ">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Restaurant</Title>
                  </div>
                  <div className="right">
                    <div className="right-content">
                      <div className="tabs-button">
                        <Link to="/cart">
                          <Button className="tabview-btn retail-btn">
                            Retail Cart
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
                {/* <div className='sub-head-section'>
                  <Text>All items in yours cart</Text>
                </div> */}
                <div className="profile-content-box mt-20 cart-content-box">
                  <Row gutter={[18, 0]}>
                    <Col md={24}>
                      <Card bordered={false} className="add-content-box">
                        <div className="add-content-box-top">
                          <Col
                            md={16}
                            className="box-shadow"
                            style={{ paddingLeft: "0", paddingRight: "0" }}
                          >
                            <div className="display-flex pr-25 pb-15">
                              {" "}
                              <div className="product-detail-left pl-10">
                                <Avatar
                                  size={45}
                                  shape="circle"
                                  src={
                                    restaurantDetail.cover_photo ? (
                                      restaurantDetail.cover_photo
                                    ) : (
                                      <Avatar
                                        size={45}
                                        shape="circle"
                                        icon={<UserOutlined />}
                                      />
                                    )
                                  }
                                  icon={<UserOutlined />}
                                />
                                <div className="content">
                                  <Title level={4} className="title">
                                    {restaurantDetail.business_name
                                      ? restaurantDetail.business_name
                                      : ""}
                                  </Title>
                                  <div className="address mb-5">
                                    <Text>
                                      {restaurantDetail &&
                                      restaurantDetail.address
                                        ? restaurantDetail.address
                                        : ""}
                                    </Text>
                                  </div>
                                </div>
                              </div>
                              <div className="product-detail-right">
                                <Link to={path} className="blue-link">
                                  {"Back to restaurant"}
                                </Link>
                              </div>
                            </div>
                            <Table
                              pagination={false}
                              dataSource={tableSourceArray}
                              columns={fixedColumns}
                              className="restaurant-cart-table"
                            />
                            <div className="add-content-box-bottom pt-5">
                              <Link to={path}>
                                <Button
                                  type="default"
                                  className="add-cart-item-btn"
                                >
                                  {" "}
                                  + Add items{" "}
                                </Button>
                              </Link>
                            </div>
                          </Col>
                          {tableSourceArray && tableSourceArray.length !== 0 && (
                            <Col md={8}>
                              <Card
                                bordered={false}
                                className="add-content-box"
                              >
                                <div className="checkout-box">
                                  <Title level={2}>{"Your Order"}</Title>
                                  <ul className="your-order-item">
                                    {tableSourceArray.map((item, i) => (
                                      <li key={i}>
                                        {console.log("gggggggg",item)}
                                        <div className="qty-box">
                                          <InputNumber
                                            onChange={(value) =>
                                              this.onChangeQuantity(
                                                value,
                                                item.cart_item_id
                                              )
                                            }
                                            min={1}
                                            type="number"
                                            value={item.quantity}
                                          />
                                        </div>
                                        <Text strong className="title">
                                          {item.menu_item_name}
                                        </Text>
                                        <Text className="price">
                                          ${item.price.toFixed(2)}
                                        </Text>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="your-order-address">
                                    <Row className="" justify="space-between">
                                      <Col md={8}>
                                        <Text strong>Type:</Text>
                                      </Col>
                                      <Col md={12} className="text-right" >
                                        <Text>{cartResponse.service_type === "take_away" ? "Pickup" : "Delivery"}</Text>
                                      </Col>
                                    </Row>
                                    <Row className="" justify="space-between">
                                      <Col md={5}>
                                        <Text strong>Delivery Address:</Text>
                                        <div className="pt-3">
                                          <a
                                            href="javascript:void(0)"
                                            onClick={() =>
                                              this.showViewAddressModal()
                                            }
                                            className="edit-address"
                                          >
                                            <img
                                              src={require("../../../../assets/images/icons/pencil-icon.svg")}
                                              alt=""
                                            />
                                          </a>
                                        </div>
                                      </Col>
                                      <Col md={12} className="text-right">
                                        <Text>
                                          {defaultaddress &&
                                            defaultaddress.address_1}
                                        </Text>
                                      </Col>
                                    </Row>
                                  </div>
                                  <Divider />
                                  <Row gutter={[0]} className="pt-6 pb-16">
                                    <Col span={24}>
                                      <Text>{"Any notes for Restaurant"}</Text>
                                      <TextArea maxLength={100} rows={2} />
                                    </Col>
                                  </Row>
                                  <Divider />
                                  <Row
                                    className="pt-13"
                                    justify="space-between"
                                  >
                                    {/* {`Item(${restaurantCartItems.length})`} */}
                                    Subtotal
                                    <span>{`$${sub_total}`}</span>
                                  </Row>
                                  <Row className="" justify="space-between">
                                    Delivery Fee <span> $00.00</span>
                                  </Row>
                                  <Row className="" justify="space-between">
                                    Taxes <span> {`$${gst_amount}`}</span>
                                  </Row>
                                  <Row className="" justify="space-between">
                                    <b className="total-big-font">Total</b>
                                    <Text className="text-right">
                                      <b className="total-big-font">{`${cart_grand_total}`}</b>
                                      {/* <div className="fs-10">
                                            Taxes & Fee schudele{" "}
                                          </div> */}
                                    </Text>
                                  </Row>
                                </div>

                                {restaurantCartItems.length > 0 && (
                                  <div className="checkout-box-action">
                                    <Button
                                      type="primary"
                                      className="w-100 checkou-btn"
                                      // onClick={() => this.showViewCartModal()}
                                      onClick={() => this.navigateToPay()}
                                    >
                                      {" "}
                                      Checkout{" "}
                                    </Button>
                                  </div>
                                )}
                              </Card>
                            </Col>
                          )}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <Modal
              title="Your Order"
              visible={this.state.displayCartModal}
              className={"custom-modal order-checkout style1"}
              footer={false}
              onCancel={this.hideViewCartModal}
              destroyOnClose={true}
            >
              <div className="padding order-checkout-content-block">
                <RestaurentCartChekoutProcess
                  initialStep={1}
                  step1Data={step1Data}
                  restaurantDetail={restaurantDetail}
                />
              </div>
            </Modal>
            {displayAddressModal && (
              <UpdateAddressModdel
                visible={displayAddressModal}
                onCancel={this.hideViewAddressModal}
                restaurantDetail={restaurantDetail}
                callNext={this.navigateToPay}
              />
            )}
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    defaultaddress: bookings && bookings.restaurantDefaultAddress,
  };
};
export default connect(mapStateToProps, {
  getRetailCartAPI,
  saveForLaterAPI,
  enableLoading,
  disableLoading,
  getRestaurantCart,
  updateRestaurantCart,
  getUserAddress,
  setRestaurantAddress,
  removeRestaurantCartAPI,
})(RestaurantCartDetail);