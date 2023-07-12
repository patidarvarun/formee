import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Button } from "antd";
import CheckoutAdd from "./CheckoutAdd";
import {
  getUserAddress,
  enableLoading,
  disableLoading,
  retailCheckoutPay,
} from "../../../../actions";
import AddAddressModel from "./AddAddressModel";
import { toastr } from "react-redux-toastr";
import {useLocation} from "react-router-dom";

class RetailCheckout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddressesList: [],
      addressModel: false,
      selectedAddress: "",
      selectedFinalAdd: ""
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  
  componentDidMount() {
    this.props.enableLoading();
    this.getAddress();

 
    const address_id = new URLSearchParams(this.props.location.search).get("address_id");
    const cart_classified_ids = new URLSearchParams(this.props.location.search).get('cart_classified_ids');
    const order_id = new URLSearchParams(this.props.location.search).get('order_id');
    const user_id = new URLSearchParams(this.props.location.search).get('user_id');
    const token = new URLSearchParams(this.props.location.search).get('token');
    const PayerID = new URLSearchParams(this.props.location.search).get('PayerID');

    if(address_id !== null){
      const afterPayObject = {
        address_id,
        cart_classified_ids,
        order_id,
        user_id,
        token,
        PayerID,
      }
      this.props.retailCheckoutPay(afterPayObject,(res) => {
        this.props.disableLoading();
        console.log('ids',res)
        if (res.status === 200) {
          toastr.success("Success", "Payment Successfull !");
        }else{
          
        }
      });
    }
  
  }

  /**
   * @method getAddress
   * @description get address
   */
  getAddress = () => {
    this.props.getUserAddress((res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let addresslist = res.data.data;
        let firstAddress =
          addresslist && Array.isArray(addresslist) && addresslist.length
            ? addresslist
            : "";
        this.setState({
          userAddressesList: addresslist,
          selectedAddress: firstAddress && firstAddress[0],
        });
        console.log("userAddressesList", this.state.userAddressesList);
        
      }
      
    });
    
  };
  

  

  /**
   * @method onSubmit
   * @description onsubmit
   */
  onSubmit = (selectedAddress) => {
    if (selectedAddress) {
      this.props.nextStep(selectedAddress, 1);
    } else {
      toastr.warning("Please add and select your address");
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { selectedAddress, addressModel, userAddressesList } = this.state;
    console.log('selectedAddress render', selectedAddress);
    let address =
      userAddressesList &&
      Array.isArray(userAddressesList) &&
      userAddressesList.length
        ? userAddressesList
        : "";
    let savedaddress = address && address.filter((el) => el.id !== selectedAddress.id);
   
    
    return (
      <div className="retail-product-detail-parent-block cart-address-container ">
        <Fragment>
          <Layout className="retail-theme common-left-right-padd">
            <div className="checkout-address-detail">
              <Link to="/cart" className="back">
                <ArrowLeftOutlined />
                Return to Shopping
              </Link>
              <Row className="top-check-section">
                <Col span={12}>
                  <h1>Checkout</h1>
                  <p>Select a delivery address</p>
                </Col>
                <Col span={12} className="text-right">
                  <Button
                    className="retail-shipped-btn"
                    onClick={() => this.setState({ addressModel: true })}
                  >
                    Add a new address
                  </Button>
                </Col>
              </Row>
              <div className="frequent-use-add">
                <h4 className="frequent-use-add-heding">Most Recent</h4>
                {selectedAddress && (
                  <CheckoutAdd
                    addressIconForDelivery={
                      "../../../../assets/images/icons/home-add.svg"
                    }
                    addressName={selectedAddress.address_label}
                    addressForDelivery={selectedAddress.address_1}
                    itemDetail={selectedAddress}
                    getAddress={this.getAddress}
                    onNextSubmit={() => this.onSubmit(selectedAddress)}
                  />
                )}
              </div>
              <div className="all-address-container">
                <h3 className="text-left mt-80">Saved Addresses</h3>
                <Row>
                  {savedaddress &&
                    savedaddress.map((el, i) => {
                      return (
                        <Col
                          span="6"
                          key={i}
                          onClick={() => this.setState({ selectedFinalAdd: el })}
                        >
                          <CheckoutAdd
                            addressName={el.address_label}
                            addressForDelivery={el.address_1}
                            itemDetail={el}
                            getAddress={this.getAddress}
                            onNextSubmit={() => this.onSubmit(this.state.selectedFinalAdd)}
                          />
                        </Col>
                      );
                    })}
                </Row>
                <span className="custom-br"></span>
              </div>
            </div>
          </Layout>
          {addressModel && (
            <AddAddressModel
              visible={addressModel}
              onCancel={() => this.setState({ addressModel: false })}
              getAddress={this.getAddress}
            />
          )}
        </Fragment>
        <div className="steps-action flex align-center mb-45">
          {/* <Button
            htmlType="submit"
            type="primary"
            size="middle"
            className="btn-blue"
            onClick={() => this.onSubmit(selectedAddress)}
          >
            NEXT
          </Button> */}
        </div>
      </div>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getUserAddress,
  retailCheckoutPay,
})(RetailCheckout);
