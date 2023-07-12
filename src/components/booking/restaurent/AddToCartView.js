import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Typography, Tabs, Input, Select, Button, Divider, Checkbox, Modal } from 'antd';
import { enableLoading, disableLoading, saveToRestaurantCart } from '../../../actions/index';
import { toastr } from 'react-redux-toastr';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

class AddToCartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      visible: false,
      current: 0,
      restaurantDetail: '',
      is_favourite: false,
      displayAddToCartModal: false,
      menuItemsChoiceOfPreparations: this.props.selectedItem.menu_items_choice_of_preparations,
      selectedMenuItemsChoiceOfPreparations: [],
      quantity: 1,
      specialNote: '',
    }
  }

  renderMenuItemsChoice = () => {
    const { menuItemsChoiceOfPreparations } = this.state;
    return Array.isArray(menuItemsChoiceOfPreparations) && menuItemsChoiceOfPreparations.map((el, i) => {
      let isSelected = this.state.selectedMenuItemsChoiceOfPreparations.includes(el.id);
      return <div className="order-summary-checkbox-price">
        <div className="order-summary-checkbox">
          <Checkbox key={`${i}_menu_item`} checked={isSelected} onChange={(e) => {
            let temp = this.state.selectedMenuItemsChoiceOfPreparations;
            temp.length = 0;
            if (!isSelected) {
              temp.push(el.id);
              this.setState({ selectedMenuItemsChoiceOfPreparations: temp });
            } else {
              temp = temp.filter((k) => k !== el.id);
              this.setState({ selectedMenuItemsChoiceOfPreparations: temp });
            }
          }}>{el.name} </Checkbox>
        </div>
        <div className="price"><Text>${el.price}</Text></div></div>

    });
  }

  onClickAddToCart = () => {
    const { quantity, menuItemsChoiceOfPreparations, selectedMenuItemsChoiceOfPreparations, specialNote } = this.state;
    if (selectedMenuItemsChoiceOfPreparations.length > 0) {
      const { restaurantDetail, selectedItem, deliveryType } = this.props;
      let choiceOfPreprationItem = menuItemsChoiceOfPreparations.filter(g => selectedMenuItemsChoiceOfPreparations.includes(g.id)).map(g => g);
      let totalAmount = parseInt(selectedItem.price) + parseInt(choiceOfPreprationItem[0].price);
      let reqData = {
        menu_item_id: choiceOfPreprationItem[0].menu_item_id,
        menu_category_id: selectedItem.menu_category_id,
        service_type: deliveryType,
        clear_cart: 0,
        menu_id: restaurantDetail.menu.id,
        business_profile_id: restaurantDetail.menu.business_profile_id,
        special_request: specialNote,
        quantity: quantity,
        price: totalAmount,
        menu_item_choice_of_preparation_id: choiceOfPreprationItem[0].id
      }
      
      this.props.saveToRestaurantCart(reqData, (response) => {
        
        if (response.status === 200) {
          toastr.success('Item added to cart successfully');
          this.props.removeAddToCartModal(false, '');
        } else {
          if (response.data.message == 'You can not select other service type item.') {
            this.props.removeAddToCartModal(true, reqData);
          }
        }
      });
    } else {
      toastr.error('Please select minimum one choice of prepration');
    }
  }

  decreaseQuantity = () => {
    const { quantity } = this.state;
    if (quantity <= 1) {
    } else {
      this.setState({ quantity: quantity - 1 });
    }
  }

  increaseQuantity = () => {
    const { quantity } = this.state;
    this.setState({ quantity: quantity + 1 });
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const { selectedItem } = this.props;
    const { quantity } = this.state;

    return (
      <div className='App'>
        <Layout className="yellow-theme">
          <Fragment>
            <div className='wrap-inner'>
              <Row gutter={[0, 0]}>
                <Col className='gutter-row' xs={24} sm={24} md={24} lg={24}>
                  <div className='boxContent'>
                    <div className={'order-block-detail'}>
                      <div className={'order-summary-item'}>
                        <Text className={'strong'}>{selectedItem.name}</Text>
                        <Text className="location-text">{selectedItem.details}</Text>
                      </div>
                      <div className={'order-summary-item price'}>
                        <Text>${selectedItem.price}</Text>
                      </div>
                    </div>
                    <Divider></Divider>
                    <div className={'order-chioce-detail'}>
                      <h3>Choice of preparation (required)</h3>
                      {this.renderMenuItemsChoice()}
                    </div>
                    <Divider />
                    <div className="special-request">
                      <Text>Special Request (Optional)</Text>
                      <TextArea onChange={(e) => this.setState({ specialNote: e.target.value })} rows={4} placeholder={'Write your message here'} className='shadow-input' />
                    </div>
                    <div className="btn-block">
                      <div className="qty-box">
                        <button className="minus" onClick={() => { this.decreaseQuantity() }}>
                          <img width='8' src={require('../../../assets/images/remove-minus.png')} ></img>
                        </button>
                        <span className="quantity">{quantity}</span>
                        <button className="plus" onClick={() => { this.increaseQuantity() }}>
                          <img width='8' src={require('../../../assets/images/icons/plus-icon.svg')} ></img>
                        </button>
                      </div>
                      <div className={'text-center'}>
                        <Button onClick={() => this.onClickAddToCart()} type='default' danger>ADD TO CART</Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Fragment>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, { enableLoading, disableLoading, saveToRestaurantCart })(AddToCartView);