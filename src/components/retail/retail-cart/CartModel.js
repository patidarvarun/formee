import React from "react";
import { connect } from "react-redux";
import {Link, withRouter } from "react-router-dom";
import { Modal } from "antd";
import { DEFAULT_IMAGE_CARD } from '../../../config/Config'

const AddToCartModel = (props) => {
  
  return (
    <Modal  
        visible={props.visible}
        footer={false}
        onCancel={props.onCancel}
        className="add-to-cart-model cart-activity-model add-to-cart-model-des-dtl">
        <h2>1 Item added to cart</h2>
        <div className="added-item-container">
            <div className="added--cart-product-whl-dtl">
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
                <span>This item has been added in your cart</span>
                <div className="cart-more-dtl">
                  <div className="inner-dtl">
                    <label>Color:</label>
                    <span>Red</span>
                  </div>
                  <div className="inner-dtl">
                    <label>Size:</label>
                    <span>32</span>
                  </div>
                </div>              
              </div>
            </div>
            <div className="added-cart-price">
              <p>{`AU$${props.price}`}</p>              
            </div>
        </div>
        <div className="model-footer">
            <div className="redirect-shop-page">
            <a href="javascript:void(0)" onClick={() => props.onCancel()}>Continue shopping</a>
            </div>
            <div className="redirect-shop-page">
            <Link to={'/cart'}  onClick={props.onCancel}  className="text-black">Go to cart</Link>
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
)(withRouter(AddToCartModel));