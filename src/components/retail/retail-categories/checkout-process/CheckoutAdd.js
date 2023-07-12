import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  Form,
  Input,
  Modal,
  Radio,
  Button
} from "antd";
import AddAddressModel from './AddAddressModel'
import {setDeliveryAddressType, deleteUserAddress } from '../../../../actions'
import { required } from '../../../../config/FormValidation';

const { TextArea } = Input;

class CheckoutAdd extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        visible:false,
        addressModel: false,
    };
  }

    /**
     * @method deliverToAddress
     * @description open deliver address model 
     */
    deliverToAddress = () => {
      this.setState({
        visible: true,
      });
    };

    /**
     * @method onFinish
     * @description handle on submit 
     */
    onFinish = (values) => {
      console.log('values', values)
      this.props.setDeliveryAddressType(values)
      toastr.success('Success', 'Delivery option has been added successfully')
      this.setState({visible: false})
      this.props.onNextSubmit(values)
    }

    /**
     * @method updateAddress
     * @description handle update address model
     */
    updateAddress = () => {
      this.setState({addressModel: true})
    }

    /**
     * @method deleteAddress
     * @description handle delete address
     */
    deleteAddress = (id) => {
      this.props.deleteUserAddress({address_id:id }, res => {
        if(res.status === 200){
          toastr.success('success', 'Address has been deleted successfully')
          this.props.getAddress()
        }
      })
    }

    /**
     * @method getInitialValue
     * @description get delivery addess model initial values
     */
    getInitialValue = () => {
      const { deliveryAddress } = this.props;
      if(deliveryAddress){
        let temp = {
          // shipping_message: deliveryAddress.shipping_message,
          // comment: deliveryAddress.comment
          shipping_message:'',
          comment: ''
        }
        return temp
      }
    }

    /**
     * @method render
     * @description render component
     */
    render(){
      const { itemDetail } = this.props
      const { addressModel } = this.state

        return(
            <div className="checkout-address-container">
                <img src={require('../../../../assets/images/icons/home-add.svg')} alt="home-add"/>               
                <h6>{this.props.addressName}</h6>
                <p>{this.props.addressForDelivery}, {itemDetail.country},  {itemDetail.city} {itemDetail.postalcode}</p>
               
                <Button className="deliver-add-btn" onClick={this.deliverToAddress}>Deliver to this address</Button>
                <div className="address-edit-btns">
                    <Button className="address-btn" onClick={this.updateAddress}>Edit</Button> 
                    <Button 
                      className="address-btn"
                      onClick={(e) => {
                        toastr.confirm(`Are you sure you want to delete this address?`, {
                          onOk: () =>
                            this.deleteAddress(itemDetail && itemDetail.id),
                          onCancel: () => {},
                        });
                      }}
                    > Delete
                    </Button> 
                </div>
                <Modal
                    title="Select-your-delivery-option"
                    visible={this.state.visible}
                    footer={false}
                    onCancel={() => this.setState({visible: false})}
                    className="select-delivery-option"
                  >
                    <span className="required-field">* Required</span>
                    <Form
                        name='basic'
                        onFinish={this.onFinish}
                        initialValues={this.getInitialValue()}
                    >
                    <div>
                        <Form.Item
                            name='shipping_message'
                            className="custom-astrix"
                            rules={[required('')]}
                        >                    
                        <Radio.Group>
                          <Radio value={'Leave at door'}>Leave at door</Radio>
                          <Radio value={'Hand it to me'}>Hand it to Me</Radio>
                        </Radio.Group> 
                      </Form.Item>
                       <label>Add instructions</label>                   
                      <Form.Item
                        //label='Add instructions'
                        name='comment'
                        className="custom-astrix"
                      >   
                        <TextArea rows={5} placeholder="Type your delivery instructions " />
                       </Form.Item> 
                    </div>
                    <Button htmlType={'submit'} >Save</Button> 
                  </Form>
                </Modal> 
                {addressModel && 
                  <AddAddressModel
                      visible={addressModel}
                      onCancel={() => this.setState({addressModel: false})}
                      getAddress={this.props.getAddress}
                      selectedAddress={itemDetail}
                      isEditMode={true}
                  />}
            </div>
        )
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth, retail } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        deliveryAddress: retail && retail.deliveryAddress
    };
};

export default connect(mapStateToProps, {setDeliveryAddressType, deleteUserAddress })(CheckoutAdd);