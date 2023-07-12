import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Radio, Card, Button } from "antd";
import ChoosedItemSummary from "./ChoosedItemSummary";
import Map from "../../../common/Map";
import { GOOGLE_MAP_KEY } from '../../../../config/Config';
import { getUserAddress } from "../../../../actions";
import { salaryNumberFormate, splitDescription } from "../../../common";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { GoogleMap, Marker,withScriptjs,
  withGoogleMap, } from "react-google-maps";
import { compose, withProps } from "recompose";



class CheckoutOrderSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressModel: false,
      shipping_methods: [],
      value: "",
      shippingPrice: 0.00,
      selected_item: [],
      lat:"",
      lng:"",
    };
  }

  componentDidMount() {
    const { step2Data,userDetails } = this.props;
    console.log("step2Data", step2Data);
    if (step2Data) {
      this.setState({ selected_item: step2Data.selected_item_list });
    }
    this.setState({ lat: userDetails.lat, lng: userDetails.lng })
  }

  onSubmit = () => {
    const { selected_item } = this.state;
    const { step1Data } = this.props;
    const data = this.props.location.state;
    console.log("data: ", data);
    let new_data = "";
    let myItemList =
      Array.isArray(data.checkedCartItemList) && data.checkedCartItemList.length
        ? data.checkedCartItemList
        : [];
    if (selected_item.length) {
      var result = myItemList.filter(
        (o) => !selected_item.some((v) => v.id === o.id)
      );
      let temp = [];
      if (result && result.length) {
        result &&
          result.length &&
          result.map((el) => {
            temp.push({
              classified_id: el.classified_id,
              item_qty: el.qty,
              id: el.id,
              item_ship_name: "",
              item_ship_cost: "",
            });
          });
      }
      new_data = this.addElement(data, {
        selected_item_list: [...selected_item, ...temp],
      });
    } else {
      let temp = [];
      myItemList &&
        myItemList.length &&
        myItemList.map((el) => {
          temp.push({
            classified_id: el.classified_id,
            item_qty: el.qty,
            id: el.id,
            item_ship_name: "",
            item_ship_cost: "",
          });
        });
      new_data = this.addElement(data, {
        selected_item_list: temp,
        selectedAddress: step1Data,
      });
    }
    console.log("new_data", new_data);
    if (new_data) {
      this.props.nextStep(new_data, 2);
    }
  };

  /**
   * @method addElement
   * @description add element in object
   */
  addElement = (ElementList, element) => {
    let newList = Object.assign(ElementList, element);
    return newList;
  };

  isItemExist = (selected_item, id) => {
    if (selected_item && selected_item.length) {
      return selected_item.some(function (el) {
        return el.id === id;
      });
    }
  };

  /**
   * @method renderSelectedItemList
   * @description render selected item list
   */
  renderSelectedItemList = () => {
    const { selected_item } = this.state;
    const { step2Data } = this.props;
    const data = this.props.location.state;
    let new_list = "";
    if (data && data.checkedCartItemList) {
      let myItemList =
        Array.isArray(data.checkedCartItemList) &&
        data.checkedCartItemList.length
          ? data.checkedCartItemList
          : [];
      console.log("myItemList", myItemList);
      return (
        myItemList.length &&
        myItemList.map((el, i) => {
          let previousItem = {
            classified_id: el.classified_id,
            item_qty: el.qty,
          };
          return (
            <ChoosedItemSummary
              image={el.photo}
              productName={splitDescription(el.title)}
              productDes={splitDescription(el.description)}
              itemQty={el.qty}
              itemPrize={`$${salaryNumberFormate(el.price)}`}
              itemDeliveryDays="3-4"
              shippingMethodSelection={true}
              cartDetails={el}
              getDetails={(value, id, name, amount) => {
                new_list = this.addElement(previousItem, {
                  value: value,
                  id: id,
                  item_ship_name: name,
                  item_ship_cost: amount,
                });
                let item_exist = this.isItemExist(selected_item, id);
                if (item_exist) {
                  const index = selected_item.findIndex((el) => el.id === id);
                  selected_item[index] = new_list;
                  this.setState({ selected_item: selected_item });
                } else {
                  this.setState({
                    selected_item: [...selected_item, new_list],
                  });
                }
              }}
              selected_method={
                step2Data && step2Data.selected_item_list.length
                  ? step2Data.selected_item_list[i]
                  : ""
              }
            />
          );
        })
      );
    }
  };
  radioHandler = (e) => {
    this.setState({ value: e.target.value });
    console.log(e.target.value);
    if (e.target.value === 1) {
      this.setState({ shippingPrice: 0.00 });
    } else if (e.target.value === 8) {
      this.setState({ shippingPrice: 8.00 });
    } else {
      this.setState({ shippingPrice: 10.00 });
    }
  };

//  MyMapComponent = compose(
//   withProps({
//     /**
//      * Note: create and replace your own key in the Google console.
//      * https://console.developers.google.com/apis/dashboard
//      * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
//      */
//     googleMapURL:GOOGLE_MAP_KEY,
//     loadingElement: <div style={{ height: `100%` }} />,
//     containerElement: <div style={{ height: `400px` }} />,
//     mapElement: <div style={{ height: `100%` }} />
//   }),
//   withScriptjs,
//   withGoogleMap,
// )(props => (
//   <GoogleMap defaultZoom={8} defaultCenter={{ lat: 40.741895, lng: -73.989308 }}>
//       <Marker position={{ lat: this.state.lat, lng: this.state.lng }} />
//   </GoogleMap>
// ));

  render() {
    const { deliveryAddress, step1Data, userDetails } = this.props;
    const { selected_item, addressModel } = this.state;
    console.log("selected_item", selected_item);
    const cart_item = this.props.location.state;
    
    return (
      <div className="retail-product-detail-parent-block checkout-order-summary">
        <Fragment>
          <Layout className="retail-theme common-left-right-padd">
            <div className="checkout-address-detail">
              <div className="back" onClick={() => this.props.prevStep()}>
                <ArrowLeftOutlined />
                Back to Select Address
              </div>
              <Row className="top-check-section">
                <Col span={10}>
                  <h1>Checkout</h1>
                  <p>Order Summary</p>
                </Col>
                <Col span={12} className="text-left">
                  <div className="leave-door-msg">
                    <a href="Javascript:void(0)">
                      {deliveryAddress && deliveryAddress.shipping_message}
                    </a>
                    {/* <span>Please call on my phone after you leave at the door.</span> */}
                    <span>{deliveryAddress && deliveryAddress.comment}</span>
                  </div>
                </Col>
              </Row>
              <div className="shipping-info-container">
                <h4>Shipping Information</h4>
                <Row className="shipping-info-row">
                  <Col span={8} className="ship-info-left">
                    <div className="inner-view">
                      <h6>{step1Data && step1Data.city}</h6>
                      <p>{step1Data && step1Data.address_1} {step1Data && step1Data.country}, {step1Data && step1Data.postalcode} </p>
                      <div>
                        <a
                          href="Javascript:void(0)"
                          onClick={() => this.props.prevStep()}
                        >
                          Edit Address
                        </a>
                        <a
                          href="Javascript:void(0)"
                          onClick={() => this.props.prevStep()}
                        >
                          Add New Address
                        </a>
                      </div>
                    </div>
                  </Col>
                  <Col span={8} className="ship-info-mid">
                    <div className="inner-view">
                      <div className="check-contact-cont">
                        <div className="check-contact">
                          <label>Email: </label>
                          <a href="Javascript:void(0)">
                            &nbsp;
                            {step1Data && step1Data.fname}{" "}
                            {step1Data && step1Data.lname}
                          </a>
                        </div>
                        <div className="check-contact">
                          <label>Tel: </label>
                          <a href="Javascript:void(0)">
                            {" "}
                            {step1Data && step1Data.phone_number}
                          </a>
                        </div>
                      </div>
                      <div className="delivery-inst">
                        <a href="Javascript:void(0)">Delivery instructions</a>
                        <h6>
                          {deliveryAddress && deliveryAddress.shipping_message}
                        </h6>
                        <p>{deliveryAddress && deliveryAddress.comment}</p>
                        
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="ship-info-right">
                      <div>
                        <Map style={{height:"100%"}}
                          list={[
                            { lat: userDetails.lat, lng: userDetails.lng },
                          ]}
                        />
                      {/* {this.MyMapComponent(userDetails.lat,userDetails.lng)} */}
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="select-ship-container">
                  <h3>Choose your shipping method</h3>
                  <div className="delivery-opt">
                    <Radio.Group
                      onChange={this.radioHandler}
                      value={this.state.value}
                    >
                      <Radio value={1}>
                        <h5>Standard Delivery</h5>
                        <p>
                          Estimated 10-15 Days Shipping (Duties and taxes may be
                          due upon delivery)
                        </p>
                        <span>Free</span>
                      </Radio>
                      <Radio value={8}>
                        <h5>Express Delivery</h5>
                        <p>
                          Estimated 4-5 Days Shipping (Duties and taxes may be
                          due upon delivery)
                        </p>
                        <span>$8.00</span>
                      </Radio>
                      <Radio value={3}>
                        <h5>Premium Delivery</h5>
                        <p>
                          Estimated 1-2 Days Shipping (Duties and taxes may be
                          due upon delivery)
                        </p>
                        <span>$10.00</span>
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              {cart_item && (
                <div className="choosed-items-container">
                  <Card title="Your Items">
                    <div className="choosed-items-inner">
                      {this.renderSelectedItemList()}
                      <div className="total-billing-container">
                        <div className="d-flex">
                          <div className="billing-left">
                            <label>
                              Item{" "}
                              {`(${
                                cart_item.checkedCartItemList &&
                                cart_item.checkedCartItemList.length
                              })`}
                            </label>
                            <label>Fee</label>
                            <label>Shipping</label>
                            <label>Taxes</label>
                          </div>
                          <div className="billing-right text-right">
                            <label>{`$${salaryNumberFormate(
                              cart_item.subTotal
                            )}`}</label>
                            <label>$0.00</label>
                            <label>${this.state.shippingPrice}.00</label>
                            <label>{`$${salaryNumberFormate(
                              cart_item.commission_amount
                            )}`}</label>
                          </div>
                        </div>
                        <div className="total-bill">
                          <strong>Total</strong>
                          <strong className="text-right">
                            ${salaryNumberFormate(parseInt(cart_item.total+this.state.shippingPrice))}
                            <span>Taxes & fees included</span>
                          </strong>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
              <Button className="btn-orange" onClick={() => this.onSubmit()}>
                Proceed to Payment
              </Button>
            </div>
          </Layout>
        </Fragment>
      </div>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, retail, profile } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    deliveryAddress: retail && retail.deliveryAddress,
    userDetails: profile.userProfile !== null ? profile.userProfile : "",
  };
};

export default connect(mapStateToProps, { getUserAddress })(
  CheckoutOrderSummary
);
