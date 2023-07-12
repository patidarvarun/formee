import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal } from "antd";
import { DEFAULT_IMAGE_CARD } from '../../../config/Config'

const SaveForLaterModel = (props) => {
  
  return (
    <Modal  
        visible={props.visible}
        footer={false}
        onCancel={props.onCancel}
        className="add-to-cart-model cart-activity-model">
        <h2>Saved for later</h2>
        <div className="added-item-container">
            <div className="added-product-img">
            <img 
                src={props.image ? props.image : DEFAULT_IMAGE_CARD} 
                alt="Your Added Product"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE_CARD
                }}
            />
            </div>
            <div className="added-product-detail">
            <p>{props.title}</p>
            <span>This item has been saved for later</span>
            </div>
        </div>
        <div className="model-footer">
            <div className="redirect-shop-page">
            <a href="javascript:void(0)" onClick={() => props.callNext()}>Undo</a>
            </div>
            <div className="redirect-shop-page">
            <a href="javascript:void(0)" onClick={props.onCancel}  className="text-black">Close</a>
            </div>
        </div>
    </Modal>
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
  mapStateToProps, null
)(withRouter(SaveForLaterModel));