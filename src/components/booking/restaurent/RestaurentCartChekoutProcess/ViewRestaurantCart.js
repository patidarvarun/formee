import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Typography, Tabs, Input, Select, Button, Divider, Checkbox, Table, InputNumber } from 'antd';
import { enableLoading, disableLoading, getRestaurantCart, updateRestaurantCart } from '../../../../actions/index';
import { toastr } from 'react-redux-toastr';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

class ViewRestaurantCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantCartItems: [], 
            restaurantCartResponse: '' ,
            tableSourceArray: [] ,
            sub_total: '',
            cart_discounted_grand_total: '',
            cart_grand_total: '',
            is_promo_applied: 0,
            gst_amount: 0
        }
    }
 

  componentDidMount() {
    this.getRestaurantCartItem();
  }

    getRestaurantCartItem = () =>{
        this.props.enableLoading();
        this.props.getRestaurantCart((response)=>{
            if(response.status === 200){
                this.props.disableLoading();
                //
                const tableSourceArray =  [];
                response.data.data.cart_items.length > 0 && response.data.data.cart_items.map((el, i) => {
                    tableSourceArray.push({
                        key: i,
                        business_profile_id : el.business_profile_id ,
                        menu_id: el.menu_id,
                        menu_item_choice_of_preparation_id: el.menu_item_choice_of_preparation_id,
                        menu_item_id: el.menu_item_id,
                        menu_item_name: el.menu_item_name,
                        price: el.price / el.quantity,
                        restaurant_cart_id: el.restaurant_cart_id,
                        service_type: el.service_type,
                        quantity: el.quantity,
                        amount: parseInt(el.price),
                        cart_item_id: el.id
                    });
                });
                this.setState({  
                        tableSourceArray : tableSourceArray,
                        restaurantCartItems : response.data.data.cart_items, 
                        restaurantCartResponse : response.data.data,
                        sub_total: response.data.data.sub_total,
                        gst_amount: response.data.data.gst_amount,
                        cart_discounted_grand_total: response.data.data.cart_discounted_grand_total,
                        cart_grand_total: response.data.data.cart_grand_total,
                        is_promo_applied: response.data.data.is_promo_applied
                });
            }
           // 
        });
  }

  onChangeQuantity = (value, cart_item_id) => {
    let reqData = {
      cart_item_id: cart_item_id,
      quantity: value
    }
    this.props.updateRestaurantCart(reqData, (response) => {
      if (response.status === 200) {
        this.getRestaurantCartItem()
      }
    });
  }

  onClickNext = () => {
    let { tableSourceArray, restaurantCartItems, sub_total, gst_amount, cart_discounted_grand_total, cart_grand_total, is_promo_applied } = this.state;
    let reqData = {
      tableSourceArray : tableSourceArray,
      restaurantCartItems : restaurantCartItems , 
      sub_total: sub_total,
      gst_amount: gst_amount,
      cart_discounted_grand_total: cart_discounted_grand_total,
      cart_grand_total:cart_grand_total,
      is_promo_applied: is_promo_applied,
      service_type:  restaurantCartItems[0].service_type
  };
    this.props.nextStep(reqData, 1);
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const fixedColumns = [
      {
        title: 'Service',
        key: 'menu_item_name',
        dataIndex: 'menu_item_name',
      },
      {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
        render: (price, record) => <span>${price}</span>
      },
      {
        title: 'Quantity',
        key: 'quantity',
        dataIndex: 'quantity',
        render: (text, record) => { return <InputNumber onChange={(value) => this.onChangeQuantity(value, record.cart_item_id)} min={1} type="number" defaultValue={text} /> }
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        render: (amount, record) => <span>${amount}</span>
      },
    ];
    const { restaurantCartItems, tableSourceArray, sub_total, gst_amount, cart_discounted_grand_total, cart_grand_total, is_promo_applied } = this.state;
    return (
      <Fragment>
        <div className='wrap fm-step-form'>
          {tableSourceArray.length > 0 && <Fragment>
            <Row gutter={[38, 38]}>
              <Col className='gutter-row' md={24}>
                <Table
                  pagination={false}
                  dataSource={tableSourceArray}
                  columns={fixedColumns}
                  summary={pageData => {
                    return (
                      <>

                        <Table.Summary.Row>
                          <Table.Summary.Cell>Subtotal</Table.Summary.Cell>
                          <Table.Summary.Cell />
                          <Table.Summary.Cell />
                          <Table.Summary.Cell>
                            ${sub_total}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell>Taxes and surcharges</Table.Summary.Cell>
                          <Table.Summary.Cell />
                          <Table.Summary.Cell />
                          <Table.Summary.Cell>
                            ${gst_amount}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        {is_promo_applied !== 0 &&
                          <Table.Summary.Row>
                            <Table.Summary.Cell>Code Promo</Table.Summary.Cell>
                            <Table.Summary.Cell />
                            <Table.Summary.Cell />
                            <Table.Summary.Cell>
                              -${cart_discounted_grand_total}
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        }

                        <Table.Summary.Row>
                          <Table.Summary.Cell>Total</Table.Summary.Cell>
                          <Table.Summary.Cell />
                          <Table.Summary.Cell />
                          <Table.Summary.Cell>
                            ${cart_grand_total}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>

                      </>
                    );
                  }}
                />
              </Col>
            </Row>
            <div className='steps-action'>
              <Button type='primary' size='middle' className='btn-yellow fm-btn'> Back </Button>
              <Button type='primary' size='middle' className='btn-blue fm-btn' onClick={() => this.onClickNext()}> Checkout </Button>
            </div>
          </Fragment>}
        </div>
      </Fragment>
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
export default connect(mapStateToProps, { enableLoading, disableLoading, getRestaurantCart, updateRestaurantCart })(ViewRestaurantCart);