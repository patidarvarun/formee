import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Modal } from "antd";
const { Title } = Typography;

const RetailSuccessModel = (props) => {
  return (
    <Fragment>
      <Modal
        title={"Thanks for submitting your Ad!"}
        visible={props.visible}
        className={
          "custom-modal style1 modal-hide-cross ad-submit-thanks-modal-style1"
        }
        footer={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="align-center subtitle">
          <Title level={2}>
            Your ad is under review and will be posted shortly.
          </Title>
          <Link to={"/my-ads"}>
            <Button className="align-center" onClick={() => props.onCancel()}>
              Close
            </Button>
          </Link>
        </div>
      </Modal>
    </Fragment>
  );
};

export default RetailSuccessModel;
