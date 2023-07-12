import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Modal } from "antd";
import Title from "antd/lib/skeleton/Title";
class Resume extends React.Component {
  render() {
    return (
      <Modal
        visible={this.props.visible}
        className={"custom-modal resume-view"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className="modal-header">
          <Row>
            <Col md={12} className="text-left">
              <Title level={3}>Resume</Title>
            </Col>
            <Col md={12} className="text-right">
              <Link to="#">
                <img
                  src={require("../../../../../assets/images/icons/download-v2.svg")}
                  alt="download"
                />
                Download Resumé
              </Link>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}
export default Resume;
