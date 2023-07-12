import React from "react";
import {
  Layout,
  Button,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "./css/booking-tourism-checkout.less";
const { Content } = Layout;

class TourismSteps extends React.Component {
  
  render() {
    const { current, title1, title2, show= true } = this.props
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          <Layout className="right-parent-block booking-tourism-checkout-box">
            <Content className="site-layout tourism-booking-form-box">
              <div className="tourism-step-an-safeSecure-box">
                <div className="tourism-steps">
                  {/* <div className="trsm-step active">
                    <div className="step">
                      <span className="step-digit">1</span>
                      <CheckOutlined />
                    </div>
                    <div className="step-name">{title1}</div>
                    <img
                      src={require("../../../../assets/images/icons/right-black-arrow.svg")}
                      alt="right-black-arrow"
                    />
                  </div> */}
                  <div className={`trsm-step ${current === 1 ? 'active' : ''}`}>
                    <div className="step">
                      <span className="step-digit">1</span>
                      <CheckOutlined />
                    </div>
                    <div className="step-name">Checkout</div>
                    <img
                      src={require("../../../../assets/images/icons/right-black-arrow.svg")}
                      alt="right-black-arrow"
                    />
                  </div>
                  <div className={`trsm-step ${current === 2 ? 'active' : ''}`}>
                    <div className="step">
                      <span className="step-digit">2</span>
                      <CheckOutlined />
                    </div>
                    <div className="step-name">Pay</div>
                    {/* <img
                      src={require("../../../../assets/images/icons/right-black-arrow.svg")}
                      alt="right-black-arrow"
                    /> */}
                  </div>
                </div>
                {show && <div className="safe-secure-btn-box">
                  <Button>
                    <img
                      src={require("../../../../assets/images/icons/lock-dark-grey.svg")}
                      alt="lock-dark-grey"
                    />
                    <span>Safe and secure checkout</span>
                  </Button>
                </div>}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default TourismSteps;
