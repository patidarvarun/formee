import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { STATUS_CODES } from '../../../../config/StatusCode';
import { SocialShare } from '../../../common/social-share'
import { langs } from '../../../../config/localization';
import { Menu, Dropdown, Divider, Rate, Layout, Row, Col, List, Typography, Tabs, Form, Input, Select, Button, Card, Breadcrumb, Table, Tag, Space, Modal, Steps, Progress } from 'antd';
import Icon from '../../../customIcons/customIcons';
import { removeRestaurantInFav, addRestaurantInFav, getBannerById, openLoginModel, getRestaurantDetail, enableLoading, disableLoading } from '../../../../actions/index';
import NoContentFound from '../../../common/NoContentFound'
import { TEMPLATE, DEFAULT_ICON } from '../../../../config/Config'
import '../../../booking/restaurent/listing.less'
import ListExample from '../../../booking/common/List'
import { DownOutlined } from '@ant-design/icons';
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

class PreviewRestaurant extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            topImages: [],
            bottomImages: [],
            visible: false,
            current: 0,
            restaurantDetail: '',
            is_favourite: false
        }
    }

    /**
    * @method componentDidMount
    * @description called after render the component
    */
    componentDidMount() {
        this.props.enableLoading()
        const { loggedInDetail } = this.props
        let id = loggedInDetail.id
        this.getDetails(id)
        // this.getBannerData(id)
    }

    /**
     * @method getBannerData
     * @description get banner detail
     */
    getBannerData = (categoryId) => {
        // let parameter = this.props.match.params
        // this.props.getBannerById(3, res => {
        //     this.props.disableLoading()
        //     if (res.status === 200) {
        //         const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : ''
        //         const banner = data && data.filter(el => el.moduleId === 3)
        //         const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
        //         let temp = [], image;
        //         image = top.length !== 0 && top.filter(el => el.subcategoryId == categoryId)
        //         temp = image
        //         if (temp.length === 0) {
        //             image = top.length !== 0 && top.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
        //         }
        //         this.setState({ topImages: image })
        //     }
        // })
    }

    /**
    * @method getDetails
    * @description get all restaurant details
    */
    getDetails = (id) => {
        this.props.getRestaurantDetail(id,'', res => {
            this.props.disableLoading()
            if (res.status === 200) {
                let data = res.data && res.data.data
                
                this.setState({ restaurantDetail: data, is_favourite: data.favourites === 1 ? true : false })
            }
        })
    }

    /**
   * @method renderDetail
   * @description render restaurant details
   */
    renderDetail = (bookingDetail) => {
        const item = bookingDetail && bookingDetail.menu && bookingDetail.menu.menu_categories;
        
        if (item && item.length) {
            return (
                <Tabs className="resturant-tabs rs-listing-tab">
                    {Array.isArray(item) && item.length && item.map((el, i) => {
                        return (
                            <TabPane tab={el.menu_category_name} key={i}>
                                <ListExample listItem={el.menu_items} />
                            </TabPane>
                        )
                    })}
                </Tabs>
            )
        } else {
            return <NoContentFound />
        }
    }

    /**
     * @method onSelection
     * @description handle favorite unfavorite
     */
    onSelection = (data) => {
        const { isLoggedIn, loggedInDetail } = this.props;
        let parameter = this.props.match.params
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : ''

        if (isLoggedIn) {
            if (data.favourite === 1) {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_id: data.id,
                    item_type: 'restaurant',
                    category_id: cat_id
                }
                this.props.removeRestaurantInFav(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, res.data.message)
                        this.getDetails()
                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_id: data.id,
                    item_type: 'restaurant',
                    category_id: cat_id
                }
                this.props.addRestaurantInFav(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, res.data.message)
                        this.getDetails()
                    }
                })
            }
        } else {
            this.props.openLoginModel()
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { restaurantDetail, topImages } = this.state
        const menu = (
            <SocialShare {...this.props} />
        );
        const menudropdown = (
            <Menu>
                <Menu.Item key="0">
                    <a href="">This will be cover in next milestone</a>
                </Menu.Item>
                <Menu.Divider />
            </Menu>
        );
        return (
            <Modal
                visible={this.props.visible}
                className={'custom-modal prf-prevw-custom-modal'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <React.Fragment>
                    <Layout className="yellow-theme">
                        <div className='wrap-inner less-padding'>
                            <Layout>
                                <Row gutter={[40, 40]}>
                                    <Col md={24}>
                                        <div className='sub-header fm-details-header'>
                                            <Link to='/'>{'RESTAURANT'}</Link>
                                            {/* <Link className='fm-selected' to='/'>{'ASIAN'}</Link> */}
                                        </div>
                                        <div className='inner-banner fm-details-banner resutrant-banner'>
                                            <img src={restaurantDetail && restaurantDetail.cover_photo ? restaurantDetail.cover_photo : require('../../../../assets/images/restaurant-banner.jpg')} alt='' />
                                        </div>
                                        <div className='fm-card-box resto-detail-box'>
                                            <Row>
                                                <Col span='20'>
                                                    <h3>{restaurantDetail && restaurantDetail.business_name}</h3>
                                                </Col>
                                                <Col span='4'>
                                                    <ul className='fm-panel-action'>
                                                        <li>
                                                            <Icon
                                                                icon='wishlist'
                                                                size='18'
                                                                // className={'active'}
                                                                className={restaurantDetail.favourites === 1 ? 'active' : ''}
                                                                onClick={() => this.onSelection(restaurantDetail)}
                                                            />
                                                        </li>
                                                        <li>
                                                            <Icon icon='share' size='18' />
                                                        </li>
                                                    </ul>
                                                </Col>
                                                <Col span='20'>
                                                    <h4>{restaurantDetail && restaurantDetail.cusines_text}</h4>
                                                </Col>
                                                {restaurantDetail && <Col span='20' className="mt-10 mb-10">
                                                    <div className='rate-section'>
                                                        {}
                                                        {restaurantDetail.avg_rating != 0 ? `${parseInt(restaurantDetail.avg_rating)}.0  ` : 'No reviews yet'}
                                                        {restaurantDetail.avg_rating != 0 && <Rate disabled defaultValue={restaurantDetail.avg_rating ? `${parseInt(restaurantDetail.avg_rating)}.0` : 0.0} />}
                                                    </div>
                                                </Col>}
                                                <Col className="adress-detail">
                                                    <p>
                                                        <img src={require('../../../../assets/images/location-icons.png')} alt='edit' />
                                                        <span className="addres-restaurant">218 Moorabool St, Geelong, Victoria 3220</span> </p>
                                                    <Link className="more-info-orange"> More Info</Link>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                                <Fragment>
                                    <div className='wrap-inner'>
                                        <Row gutter={[38, 38]}>
                                            <Col className='gutter-row' md={16}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', paddingBottom: 30 }}>
                                                    <div className='site-card-wrapper w-100 '>
                                                        <Row gutter={16}>
                                                            <Col span={6} >

                                                                <Dropdown overlay={menudropdown} trigger={['click']} className="orange-button">
                                                                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                                        Delivery <DownOutlined />
                                                                    </a>
                                                                </Dropdown>
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

                                                <Card
                                                    className='payment-methods-card mb-60'
                                                >
                                                    {this.renderDetail(restaurantDetail)}
                                                </Card>
                                            </Col>
                                            <Col className='gutter-row' md={8}>
                                                <Card
                                                    className={'order-summary-card'}
                                                >
                                                    <div className='boxContent'>

                                                        <Title level={2}>Your Order</Title>
                                                        <div className={'order-summary-item'}>
                                                            <Text>From <span className="orange-text">Tempting Tases Asian</span></Text><br />
                                                        </div>
                                                        <Divider></Divider>
                                                        <div className={'order-summary-item'}>
                                                            <Text>Teriyaki Chicken</Text>
                                                            <Text >$00.00</Text>
                                                        </div>
                                                        <div className={'order-summary-item'}>
                                                            <Text>Chicken noodle </Text>
                                                            <Text >{'AU$00.00'}</Text>
                                                        </div>
                                                        <Divider />
                                                        <div className={'order-summary-total'}>
                                                            <Text>Item (3)</Text>
                                                            <Text className={'dstrong'}>$00.00</Text>
                                                        </div>
                                                        <div className={'order-summary-total'}>
                                                            <Text>Fee </Text>
                                                            <Text className={'dstrong'}>$00.00</Text>
                                                        </div>
                                                        <div className={'order-summary-total'}>
                                                            <Text className={'strong'}>Total </Text>
                                                            <Text className={'strong align-right'} style={{ lineHeight: '12px' }}>$00.00 <br />
                                                                <small> Taxes & fees include </small>
                                                            </Text>
                                                        </div>
                                                        <div className={'text-center'}>
                                                            <Button className="checkout-btn" danger>Checkout</Button>
                                                        </div><br />
                                                    </div>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                </Fragment>
                            </Layout>
                        </div>
                    </Layout>
                </React.Fragment>
            </Modal>
        )
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
    mapStateToProps,
    { removeRestaurantInFav, addRestaurantInFav, getRestaurantDetail, getBannerById, openLoginModel, enableLoading, disableLoading }
)(PreviewRestaurant);

