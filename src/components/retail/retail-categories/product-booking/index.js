import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../../common/History";
import { withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import {
  Avatar,
  DatePicker,
  Layout,
  message,
  Row,
  Col,
  List,
  Typography,
  Carousel,
  Tabs,
  Menu,
  Form,
  Input,
  Select,
  Button,
  Card,
  Breadcrumb,
  Table,
  Tag,
  Space,
  Modal,
  Steps,
  Progress,
  Dropdown,
} from "antd";
import Icon from "../../../customIcons/customIcons";
import {
  getRetailCartAPI,
  enableLoading,
  disableLoading,
  openLoginModel,
} from "../../../../actions/index";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { dateFormate, salaryNumberFormate } from "../../../common";
import StepFirst from "./StepFirst";
const { Title, Paragraph, Text } = Typography;



const datacolumns = [
  {
    title: "Service",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "",
    dataIndex: "",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (cell, row, index) => {
      return `$${row.price}`;
    },
  },
  {
    title: "Quantity",
    dataIndex: "Quantity",
    key: "qty",
    render: (cell, row, index) => {
      return <Input type={"number"} disabled defaultValue={row.qty} />;
    },
  },
  {
    title: "Amount",
    className: " text-right",
    dataIndex: "product_price",
    key: "price",
    render: (cell, row, index) => {
      return `$${Number(row.qty) * Number(row.price)}`;
    },
  },
];

function StepTwo(props) {
  let data = props.stepOneData;
  console.log('data: ', data);
  let classifiedDetail = props.classifiedDetail;
  let cartDetail = props.cartDetail;
  let productDetail = [
    {
      title: classifiedDetail.title,
      price: classifiedDetail.price,
      qty: props.quantity ? props.quantity : 1
    }
  ]
  let discount = data.discount_amount ? (Number(data.discount_amount) * Number(props.quantity)) : 0;
  // let total = props.totalamount
  //   ? Number(props.totalamount) + Number(props.commission_amount) - discount
  //   : classifiedDetail && classifiedDetail.price;
  let total = classifiedDetail.price
    ? (Number(classifiedDetail.price) * Number(props.quantity))  - discount
    : classifiedDetail && classifiedDetail.price;
  return (
    <div className="fm-step-three retail-fm-step-two">
      <div className="table-total">
        <Table
          className="reserve-table retail-order-table"
          columns={datacolumns}
          dataSource={productDetail}
        />
        <div className="total-tableview">
          <Row className="pb-8">
            <Col md={16}>Subtotal</Col>
            {/* <Col md={8} className="text-right">{`$${props.totalamount}`}</Col> */}
            <Col md={8} className="text-right">{`$${salaryNumberFormate(classifiedDetail.price * props.quantity)}`}</Col>
          </Row>
          <Row className="pb-8">
            <Col md={16}>GST Amount</Col>
            <Col
              md={8}
              className="text-right"
            >{`$${salaryNumberFormate(classifiedDetail.gst_amount)}`}</Col>
          </Row>
          {data.promo_code_id && <Row className="pb-8">
            <Col md={16}>Code Promo {data.promo_code}</Col>
            <Col md={8} className="text-right">
              {data.discount_amount && `-$${data.discount_amount * props.quantity}`}
            </Col>
          </Row>}
          <Row className="pb-8">
            <Col md={16}>
              <b>Total (Inclusive GST)</b>
            </Col>
            <Col md={8} className="text-right">
              <b>{`$${salaryNumberFormate(total)}`}</b>{" "}
            </Col>
          </Row>
        </div>
      </div>
      <div className="table-total delivery-detail-block">
        <div className="total-tableview">
          <Row className="pb-8">
            <Col md={12}>
              <Title level={4} className="mb-2">
                Delivery Name:
              </Title>
              <Text>{data.contact_name}</Text>
            </Col>
            <Col md={12} className="text-left">
              <Title level={4} className="mb-2">
                Additional Noted:
              </Title>
              <Text>{data.notes}</Text>
            </Col>
          </Row>
          <Row className="pb-8 mt-20">
            <Col md={16} className="text-left">
              <Title level={4}>Delivery Address:</Title>
              <Text>{data.address}</Text>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

class BookTicketModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      visible: false,
      current: 0,
      tournamentList: [],
      stepOneData: "",
      cartDetail: "",
      cartId: "",
      totalamount: 0,
      discountedAmt: 0,
      commission_amount: 0,
    };
  }

  componentDidMount() {
    const { isLoggedIn, loggedInDetail } = this.props;
    if (isLoggedIn) {
      this.props.getRetailCartAPI({ user_id: loggedInDetail.id }, (res) => {
        if (res.status === 200) {
          let cartId = this.getCartId(res.data.cartItems);
          this.setState({ cartDetail: res.data.cartItems });
        }
      });
    }
  }

  /**
   * @method next
   * @description handle next steps
   */
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  /**
   * @method prev
   * @description handle previous steps
   */
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  /**
   * @method paymentProcess
   * @description handle previous steps
   */
  paymentProcess = (cartDetail) => {
    this.props.onCancel();
    const { loggedInDetail, receiverId, classifiedDetail, quantity } = this.props;
    const {
      cartId,
      totalamount,
      discountedAmt,
      stepOneData,
      commission_amount,
    } = this.state;

    let discount = stepOneData.discount_amount
      ? Number(stepOneData.discount_amount) * Number(quantity)
      : 0;

    let total = classifiedDetail.price
      ? (Number(classifiedDetail.price) * Number(quantity)) - discount
      : classifiedDetail && classifiedDetail.price;
    let subtotal = Number(classifiedDetail.price) * Number(quantity)
    // let total = totalamount
    //   ? Number(totalamount) + Number(commission_amount) - discount
    //   : classifiedDetail && classifiedDetail.price;

    //

    let orderDetails = cartDetail && cartDetail.length && cartDetail.map((el) => {
      return {
        classified_id: el.classified_id,
        item_qty: el.qty,
      };
    });

    let placeOrderReqData = {
      order: {
        user_id: loggedInDetail.id,
        order_subtotal: subtotal,
        order_discount: discount,
        order_grandtotal: total,
        promo_code: stepOneData.promo_code,
        customer_fname: stepOneData.contact_name,
        customer_lname: "",
        customer_address1: stepOneData.address,
        customer_address2: "",
        customer_city: stepOneData.city ? stepOneData.city : "",
        customer_state: stepOneData.state ? stepOneData.state : "",
        customer_country: stepOneData.country ? stepOneData.country : "",
        customer_postcode: stepOneData.pincode ? stepOneData.pincode : "",

        order_shipping: 0, // ?
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
        shipping_message: 'hand at to me'
      },
    };
    // if(cartDetail && cartDetail.length){
    //   placeOrderReqData.orderDetails = orderDetails;
    // }else {
    //   placeOrderReqData.orderDetails = [{
    //     classified_id: classifiedDetail.id,
    //     item_qty: quantity ? quantity : 1,
    //   }];
    // }

    placeOrderReqData.orderDetails = [{
      classified_id: classifiedDetail.id,
      item_qty: quantity ? quantity : 1,
    }];
   let checkedCartItemList = [{
    title:classifiedDetail.title,
    description:classifiedDetail.description,
    qty:quantity,
    price:subtotal + Number(classifiedDetail.commission_amount),
    classified_id:classifiedDetail.id,
    photo:classifiedDetail.classified_image[0].full_name
   }]
 console.log('ids',classifiedDetail)
    this.props.history.push({
      pathname: `/retail-checkout`,
      state: {
        user_id: loggedInDetail.id,
        cart_classified_ids: cartId,
        payment_source_id: "",
        address_id:
          stepOneData && stepOneData.placeId ? stepOneData.placeId : "",
        booking_type: "retail",
        trader_user_id: receiverId,
        amount: totalamount - discountedAmt,
        checkedCartItemList,
        placeOrderReqData,
        subTotal:  classifiedDetail.price,
        commission_amount: classifiedDetail.commission_amount,
        total: subtotal + Number(classifiedDetail.commission_amount),
      },
    });
    this.props.addToCarProps();
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
    const { classifiedDetail } = this.props;
    if (cartDetail && cartDetail.length) {
      cartDetail.map((el) => {
        temp.push(el.cart_classified_id);
        //  totalamount = totalamount + Number(el.price);
        discountedAmt = discountedAmt + Number(el.discount);
        // commission_amount = commission_amount + Number(el.commission_amount);
      });
      commission_amount = classifiedDetail.gst_amount
      totalamount = classifiedDetail.price
      this.setState({
        cartId: temp && temp.length ? temp.join() : "",
        totalamount: totalamount
          ? totalamount
          : classifiedDetail && classifiedDetail.price,
        discountedAmt: discountedAmt,
        commission_amount: classifiedDetail.gst_amount,
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      current,
      stepOneData,
      cartDetail,
      totalamount,
      discountedAmt,
      commission_amount,
    } = this.state;

    //
    const { quantity, classifiedDetail } = this.props;

    const steps = [
      {
        content: (
          <StepFirst
            next={(res) => this.next(this.setState({ stepOneData: res }))}
            stepOneData={stepOneData}
            totalamount={totalamount}
            classifiedDetail={classifiedDetail}
          />
        ),
      },
      {
        content: (
          <StepTwo
            stepOneData={stepOneData}
            cartDetail={cartDetail}
            totalamount={totalamount}
            discountedAmt={discountedAmt}
            commission_amount={commission_amount}
            classifiedDetail={classifiedDetail}
            quantity={quantity}
          />
        ),
      },
    ];
    return (
      <Modal
        title="Your Order"
        visible={this.props.visible}
        className={"custom-modal style1 retail-theme"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className="padding">
          <Row>
            <Col md={22}>
              <div className="fm-step-form">
                <Row>
                  <Col md={24} className="fm-user-box">
                    <Avatar
                      src={
                        classifiedDetail.classified_users &&
                          classifiedDetail.classified_users.image_thumbnail ? (
                          classifiedDetail.classified_users.image_thumbnail
                        ) : (
                          <Avatar size={54} icon={<UserOutlined />} />
                        )
                      }
                      size={69}
                    />
                    <div className="fm-user-details">
                      <Title level={4} className="mt-10">
                        {classifiedDetail.classified_users &&
                          classifiedDetail.classified_users.name}
                      </Title>
                      <Paragraph className="fs-10 text-gray">
                        {classifiedDetail.classified_users &&
                          `(Member since : ${classifiedDetail.classified_users.member_since})`}
                      </Paragraph>
                      {classifiedDetail && (
                        <div
                          className="fs-10 underline"
                          style={{ color: "#55636D" }}
                        >
                          {`Found ${classifiedDetail.usercount} Ads`}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <Progress
                  strokeColor={{ "0%": "#CA71B7", "100%": "#CA71B7" }}
                  trailColor={{ "0%": "#E3E9EF", "100%": "#E3E9EF" }}
                  percent={current === steps.length - 1 ? 100 : 50}
                  showInfo={false}
                />
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action" justify="end">
                  {current > 0 && (
                    <Button
                      style={{ margin: "0 8px" }}
                      className="fm-btn fm-back-btn"
                      onClick={() => this.prev()}
                      htmlType="button"
                    >
                      Back
                    </Button>
                  )}

                  {current === steps.length - 1 && (
                    <Button
                      type="primary"
                      className="fm-btn fm-next-btn"
                      onClick={() => this.paymentProcess(cartDetail)}
                    >
                      Pay
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, {
  getRetailCartAPI,
  enableLoading,
  disableLoading,
  openLoginModel,
})(withRouter(BookTicketModel));
