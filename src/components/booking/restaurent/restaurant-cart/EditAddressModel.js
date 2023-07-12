import React from "react";
import { connect } from "react-redux";
import { toastr } from 'react-redux-toastr'
import {
  Input,
  Typography,
  Row,
  Col,
  Button,
  Modal,
  Radio,
} from "antd";
import {setRestaurantAddress,deleteUserAddress,getUserAddress, enableLoading, disableLoading } from "../../../../actions";
import AddUserAddress from "../RestaurentCartChekoutProcess/AddUserAddress";
const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;


class UpdateRestaurantAddressModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      userAddressesList: [],
      selectedAddress:'',
      isEdit: false
    };
  }

  /**
   * @method componentDidMount
   * @description call after render the component
   */
    componentDidMount(){
        this.props.enableLoading()
        this.getUserAddedAddress()
    }

    /**
     * @method getUserAddedAddress
     * @description get user address list
     */
    getUserAddedAddress = () => {
        this.props.getUserAddress((response) => {
            this.props.disableLoading()
            if (response.status === 200) {
                let address = response.data.data && Array.isArray(response.data.data) && response.data.data.length ? response.data.data : ''
                this.setState({ userAddressesList: response.data.data, selectedAddress: address && address[0]});
            }
        });
    }

    /**
     * @method deleteAddress
     * @description handle delete address
     */
     deleteAddress = (id) => {
        this.props.deleteUserAddress({address_id:id }, res => {
          if(res.status === 200){
            toastr.success('success', 'Address has been deleted successfully')
            this.getUserAddedAddress()
          }
        })
      }

    /**
     * @method handleAddressSelection
     * @description handle address selection
     */
    handleAddressSelection = (item) => {
        const { userAddressesList } = this.state
        let address = userAddressesList && userAddressesList.filter(el => el.id === item)
        if(address && address.length){
            this.props.setRestaurantAddress(address[0])
        }
    }

    updateAddress = (item) => {
        this.setState({selectedAddress: item, isEdit: true})
        this.props.setRestaurantAddress(item)
    }

    /**
     * @method renderAddressList
     * @description render user address list
     */
    renderAddressList = (address) => {
        if(address && address.length){
            return address.map((el, i) => {
                console.log(el,"eelll")
                return (
                    <div className="select-address-box" key={i}>
                        <Row>
                            <Col span={16} >
                                <Radio value={el.id}>Select Address</Radio>
                                <Paragraph>
                                    {el.address_1}{" "}{el.address_2}{" "}{el.city},{" "}{el.state},{" "}{el.country},{" "}{el.postalcode}
                                </Paragraph>
                            </Col>
                            <Col span={8} className="text-right">
                                <a 
                                    href="javascript:void(0)" 
                                    title="Edit" className="pr-5"
                                    onClick={() => this.updateAddress(el)}
                                ><img src={require("../../../../assets/images/icons/pencil-icon.svg")} alt="" /></a>
                                <a 
                                    href="javascript:void(0)" 
                                    title="Delete"
                                    onClick={(e) => {
                                      toastr.confirm(`Are you sure you want to delete this address?`, {
                                        onOk: () =>
                                          this.deleteAddress(el.id),
                                        onCancel: () => {},
                                      });
                                    }}
                                >
                                    <img src={require("../../../../assets/images/icons/trash-icon.svg")} alt="" /></a>
                            </Col>
                        </Row>
                    </div>
                )
            })
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const {defaultaddress, visible } = this.props
        const {selectedAddress, userAddressesList,isEdit } = this.state
        return (
            <Modal
                visible={visible}
                className={"custom-modal address-modal"}
                footer={false}
                onCancel={this.props.onCancel}
                destroyOnClose={true}
            >
            <div className="address-modal-content">
            {userAddressesList && userAddressesList.length !== 0 && 
            <Title level={4} className="pb-16">{'Delivery Address'}</Title>}
            <Radio.Group onChange={(e) => this.handleAddressSelection(e.target.value)} value={defaultaddress && defaultaddress.id}>
                {this.renderAddressList(userAddressesList)}
            </Radio.Group>
            {userAddressesList && userAddressesList.length !== 0 && 
            <div className='steps-action pb-40'>
                <Button 
                    htmlType="button" 
                    type='primary' 
                    size='middle' 
                    className='btn-blue fm-btn'
                    onClick={this.props.callNext}
                >NEXT</Button>
            </div>}
            <Title level={4} className="pt-35 pb-25">{isEdit ? 'Update Address' : 'Add New Address'}</Title>
                <AddUserAddress 
                    callBackResponse={(res) => this.getUserAddedAddress(res)} 
                    selectedAddress={defaultaddress} 
                    onCancel={this.props.onCancel} 
                    isEdit={isEdit}
                    callNext={() => this.setState({isEdit: false})}
                />
            </div>
        </Modal>
        );
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth,bookings } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    defaultaddress: bookings && bookings.restaurantDefaultAddress
  };
};

export default connect(mapStateToProps, {setRestaurantAddress,deleteUserAddress,getUserAddress, enableLoading, disableLoading})(UpdateRestaurantAddressModel);
