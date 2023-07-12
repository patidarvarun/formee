import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Typography, Card, Button, Modal } from "antd";
import { openLoginModel } from '../../../actions/index'
const { Title } = Typography;

const SellingModel = (props) => {
  console.log('props', props.isLoggedIn)

  const handleOpenLoginModel = () => {
    props.onCancel()
    props.openLoginModel()
  }
  
  return (
    <Fragment>
      <Modal
        visible={props.visible}
        className={"custom-modal style1 retail-start-selling-modal"}
        footer={false}
        // cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={props.onCancel}
      >
        <div className="align-center">
          <Title level={2} className="text-gray pb-20">
            To sell here you'll need a <br /> business profile <br />
          </Title>
          {!props.isLoggedIn && <div onClick={() => handleOpenLoginModel()}>
            <Button className="align-center">Login</Button>
          </div>}<br/>
          <Link to="/signup">
            <Button className="align-center">Create an Account</Button>
          </Link>
        </div>
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = (store) => {
  const { auth,common } = store;
  const { isOpenLoginModel } = common;
  return {
      isLoggedIn: auth.isLoggedIn,
      isOpenLoginModel,
  };
}

export default connect(
  mapStateToProps, { openLoginModel }
)(withRouter(SellingModel));