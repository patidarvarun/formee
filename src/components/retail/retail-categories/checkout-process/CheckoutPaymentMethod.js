import React, { Fragment } from "react";
import {
  Layout,
  Row,
  Col,
  Button
} from "antd";

class CheckoutPaymentMethod extends React.Component {  

    onSubmit = () => {
        this.props.nextStep('', 3)
    }

    render(){
        return( 
           <div className="retail-product-detail-parent-block checkout-order-summary">
               <Fragment>  
                   <Layout className="retail-theme common-left-right-padd">
                   <div className="checkout-address-detail">
                        <a href="Javascript:void(0)"  onClick={() => this.props.prevStep()} classNamme="back">Return to Shopping</a>
                        <Row className="top-check-section">
                            <Col span={10}>
                                <h1>Checkout</h1>
                                <p>Select a delivery address</p>
                            </Col>
                            <Col span={12} className="text-left">
                                <div className="leave-door-msg">
                                  <a href="Javascript:void(0)">Leave at door</a>
                                  <span>Please call on my phone after you leave at the door.</span>
                                </div>
                            </Col>
                        </Row>

                        Payemt Section comming
                    </div>       
                   </Layout>
                   </Fragment> 
                   <div className='steps-action flex align-center mb-45'>
                        <Button htmlType='submit' type='primary' size='middle' className='btn-blue' onClick={() => this.onSubmit('')}>
                            NEXT
                        </Button>
                    </div>
            </div>   
        );
    }
} 

export default CheckoutPaymentMethod;