import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import AppSidebar from "../common/Sidebar";
import { Layout, Row, Col, Typography, Collapse, Button } from "antd";
import {} from "@ant-design/icons";
import "./css/vehicle-collapse-detail.less";
import VehicleGridDetail from "../components/VehicleGridDetail";

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

function callback(key) {
  console.log(key);
}
class VehicleCollapseDetail extends React.Component {
  render() {
    return (
      <Fragment>
        <Collapse
          className="travel-item-collapse-box"
          defaultActiveKey={["1"]}
          onChange={callback}
        >
          <Panel header="Flight 1" key="1">
            <div className="vehicle-item-all-detail-box">
              <Row className="vhcl-detail-header">
                <Col md={14}>
                  <Title level={3}>
                    Departing Flight <span>- Wed 29 Jan</span>
                  </Title>
                </Col>
                <Col md={5}>
                  <span className="vhcl-time">7h 10m</span>
                  <span className="vhcl-stopage green">Non-stop</span>
                  <span className="vhcl-stopage blue">1-stop</span>
                </Col>
                <Col md={5}>
                  <Link to="" className="change">
                    Change
                  </Link>
                </Col>
              </Row>
              <VehicleGridDetail />
            </div>
            <div className="collapse-footer">
              <img
                src={require("../../../../assets/images/icons/grey-bag.svg")}
                alt="grey-bag"
              />
              <p>1 piece of checked baggage included</p>
            </div>
          </Panel>
        </Collapse>
      </Fragment>
    );
  }
}

export default VehicleCollapseDetail;
