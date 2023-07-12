import React from "react";
import {
  Row,
  Col,
  Button,
  Modal, 
  Radio,
} from "antd";
import { DEFAULT_IMAGE_CARD } from '../../../../config/Config'

class ChoosedItemSummary extends React.Component {  
  state = { visible: false };

  purchaseBillStatus = () => {
    this.setState({
      visible: true,
      shipping_methods: []
    });
  };

  handleSelecton = (e) => {
    console.log('value', e.target.value)
    const { cartDetails } = this.props
    if(e.target.value === 1){
      this.props.getDetails(e.target.value,cartDetails.id, cartDetails.ship_name_1,cartDetails.ship_amount_1)
    }else if(e.target.value === 2){
      this.props.getDetails(e.target.value,cartDetails.id,cartDetails.ship_name_2,cartDetails.ship_amount_2)
    }else if(e.target.value === 3){
      this.props.getDetails(e.target.value,cartDetails.id,cartDetails.ship_name_3,cartDetails.ship_amount_3)
    }
  }

  renderShippingMethods = (method1, amt1, tym1, method2, amt2, tym2, method3, amt3, tym3) => {
    const { selected_method } = this.props
    console.log('selected_method', selected_method)
    return (
      <div className="delivery-opt">
        {selected_method ? <Radio.Group onChange={(e) => this.handleSelecton(e)} value={selected_method ? selected_method.value : ''}>
        {method1 && <Radio value={1}>
            <h5>{method1}</h5> 
            <p>{tym1}</p>
            <span>{amt1 ? `$${amt1}` : 'Free'}</span> 
          </Radio>}
          {method2 &&<Radio value={2}>
            <h5>{method2}</h5> 
            <p>{tym2}</p>
            <span>{amt2 ? `$${amt2}` : 'Free'}</span> 
          </Radio>}
          {method3 && <Radio value={3}>
            <h5>{method3}</h5> 
            <p>{tym3}</p>
            <span>{amt3 ? `$${amt3}` : 'Free'}</span> 
          </Radio>}
        </Radio.Group>:
        <Radio.Group onChange={(e) => this.handleSelecton(e)}>
          {method1 && <Radio value={1}>
            <h5>{method1}</h5> 
            <p>{tym1}</p>
            <span>{amt1 ? `$${amt1}` : 'Free'}</span> 
          </Radio>}
          {method2 &&<Radio value={2}>
            <h5>{method2}</h5> 
            <p>{tym2}</p>
            <span>{amt2 ? `$${amt2}` : 'Free'}</span> 
          </Radio>}
          {method3 && <Radio value={3}>
            <h5>{method3}</h5> 
            <p>{tym3}</p>
            <span>{amt3 ? `$${amt3}` : 'Free'}</span> 
          </Radio>}
        </Radio.Group>}
      </div>
    )
  }

  render(){
    const {cartDetails,shippingMethodSelection, productDes, productName, image, itemPrize, itemQty, itemDeliveryDays } = this.props
    return( 
      <>
        <Row className="product-summary">
            <Col span={12} className="d-flex">
                <div className="product-img">
                    <img src={image ? image : DEFAULT_IMAGE_CARD} alt="Your Choosed Item"/>               
                </div>
                <div className="pro-text-detail">
                    <h4>{productName}</h4>
                    <p>{productDes}</p>
                    <Button className="address-btn">Retail</Button> 
                </div>
            </Col>
            <Col span={4}></Col>                
            <Col span={8} className="qty-details d-flex">
                <div className="qty-dtl">
                    <p>QTY: <span>{itemQty}</span></p>
                </div>
                <div className="text-right">
                    <h4>{itemPrize}</h4>
                    <p>Taxes & fees included </p>
                    <p>Standard delivery {itemDeliveryDays} days</p>
                </div>
            </Col>
            <br/> 
            <br/>
            {/* {shippingMethodSelection && cartDetails && (cartDetails.ship_name_1 || cartDetails.ship_name_2 ||cartDetails.ship_name_3) && 
            <div className="inner-select-ship-container select-ship-container ">
              <h3>Choose your shipping method 2</h3>                        
                  {this.renderShippingMethods(cartDetails.ship_name_1, cartDetails.ship_amount_1, cartDetails.delivery_time_1,cartDetails.ship_name_2, cartDetails.ship_amount_2, cartDetails.delivery_time_2, cartDetails.ship_name_3, cartDetails.ship_amount_3, cartDetails.delivery_time_3)}
            </div>}                           */}
            
        </Row> 
        </>         
      );
  }
}  
export default ChoosedItemSummary;