import React from "react";

import { Layout, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./css/booking-tourism-checkout.less";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

class TopBackWithTitle extends React.Component {
  render() {
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          <Layout
            className="right-parent-block booking-tourism-checkout-box"
            style={{ paddingRight: "0" }}
          >
            <Content className="site-layout tourism-booking-form-box">
              <div
                className="back-an-title-box"
                onClick={() => this.props.history.goBack()}
                style={{ cursor: "pointer" }}
              >
                <LeftOutlined />
                <span className="title">{this.props.title}</span>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default TopBackWithTitle;
