import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Typography, Tabs, Input, Select, Button, Table, Card, Dropdown, Menu } from 'antd';
import { enableLoading, disableLoading, getRestaurantCart, updateRestaurantCart } from '../../../../actions/index';
import { toastr } from 'react-redux-toastr';
import { withRouter } from 'react-router-dom'
import { DownOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

class CheckoutStep2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sub_total: '',
            restaurantCartItems: [],
            cart_discounted_grand_total: '',
            cart_grand_total: '',
            is_promo_applied: 0,
            gst_amount: 0,
            addressId: '',
            service_type: ''
        }
    }

    componentDidMount = () => {
        const { mergedStepsData } = this.props;
        
        const { step1Data, step2Data } = mergedStepsData;
        const { cart_grand_total, restaurantCartItems, service_type } = step1Data;
        const { address_id } = step2Data;
        this.setState({ addressId: address_id, cart_grand_total: cart_grand_total, restaurantCartItems: restaurantCartItems, service_type: service_type });
    }

    navigateToPay = () => {
        const { cart_grand_total, restaurantCartItems, addressId, service_type } = this.state;
        const { name, phone_number } = this.props.mergedStepsData.step2Data;
        var cartItemIds = restaurantCartItems.map(function (item, i) { return item.id; });
        const { user_id } = this.props.restaurantDetail;
        this.props.history.push({
            pathname: `/booking-checkout`,
            state: {
                cart_item_ids: cartItemIds.toString(),
                trader_user_id: user_id,
                address_id: addressId,
                amount: cart_grand_total,
                order_type: service_type,
                booking_type: 'restaurant',
                payment_type: 'firstpay',
                customer_name: name,
                mobile_no: phone_number,
            }
        });
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
                render: (text, record) => { return <span> {text} </span> }
            },
            {
                title: 'Amount',
                key: 'amount',
                dataIndex: 'amount',
                render: (amount, record) => <span>${amount}</span>
            },
        ];
        const { mergedStepsData } = this.props;
        const { step1Data, step2Data } = mergedStepsData;
        
        const { tableSourceArray, sub_total, cart_discounted_grand_total, gst_amount, cart_grand_total, is_promo_applied, service_type } = step1Data;
        const { name, phone_number, additional_note } = step2Data
        const menudropdown = (
            <Menu >
                <Menu.Item key="delivery">
                    <a href="">Delivery</a>
                </Menu.Item>
                <Menu.Item key="take_away">
                    <a href="#">Pickup</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <Fragment>
                <div className='wrap fm-step-form'>
                    <Row gutter={[38, 38]}>
                        <Col className='gutter-row' md={24}>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', paddingBottom: 30 }}>
                                <div className='site-card-wrapper w-100 '>
                                    <Row gutter={16}>
                                        <Col span={6} >
                                            <Select
                                                disabled
                                                value={service_type}
                                                placeholder='Delivery Types'
                                                className="delivery-types"
                                                style={{ width: "100%" }}
                                                defaultValue="Delivery"
                                            >
                                                <Option value='delivery'>Delivery</Option>
                                                <Option value='take_away'>Pickup </Option>
                                            </Select>
                                        </Col>
                                        <Col span={12}>
                                            <p className="boxwhite-shadow">
                                                Delivery to : <strong>99 Spencer, ST Doclands VIC 3008</strong>
                                            </p>
                                        </Col>
                                        <Col span={6}>
                                            {/* <Card>
                                                        When: ASAP
                                                </Card> */}
                                            <Dropdown overlay={menudropdown} trigger={['click']} className="boxwhite-shadow">
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <p className="grey-color mb-0">When: <strong> ASAP</strong></p>  <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        </Col>
                                    </Row>
                                </div>
                            </div>

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
                                                    ${sub_total.toFixed(2)}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell>Taxes and surcharges</Table.Summary.Cell>
                                                <Table.Summary.Cell />
                                                <Table.Summary.Cell />
                                                <Table.Summary.Cell>
                                                    ${gst_amount.toFixed(2)}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                            {is_promo_applied != 0 &&
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
                                                    ${cart_grand_total.toFixed(2)}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </>
                                    );
                                }}
                            />
                        </Col>
                    </Row>
                    <Card
                        className={'order-summary-card'}
                    >
                        <div className='boxContent'>
                            <div className={'order-summary-item'}>
                                <Text>Contact Name</Text>
                                <Text >{name}</Text>
                            </div>
                            <div className={'order-summary-item'}>
                                <Text>Phone Number: </Text>
                                <Text>{phone_number}</Text>
                            </div>
                            <div className={'order-summary-item'}>
                                <Text>Additional Noted:</Text>
                                <Text>{additional_note}</Text>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className='steps-action '>
                    <Button size='middle' className='text-white pay-button' style={{ backgroundColor: '#EE4929' }} onClick={() => this.navigateToPay()}>
                        Pay
                        </Button>
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

export default connect(
    mapStateToProps, { enableLoading, disableLoading, getRestaurantCart, updateRestaurantCart }
)(withRouter(CheckoutStep2));

