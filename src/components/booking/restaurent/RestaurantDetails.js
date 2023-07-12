import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Map from '../../common/Map';
import { toastr } from 'react-redux-toastr'
import { STATUS_CODES } from '../../../config/StatusCode';
import AppSidebar from '../NewSidebar';
import { SocialShare } from '../../common/social-share'
import { langs } from '../../../config/localization';
import { Dropdown, Rate, DatePicker, Layout, Row, Col, List, Typography, Carousel, Menu, Tabs, Form, Input, Select, Button, Card, Breadcrumb, Table, Tag, Space, Modal, Steps, Progress, Divider } from 'antd';
import Icon from '../../customIcons/customIcons';
import { DetailCard } from '../../common/DetailCard1'
import { removeRestaurantInFav, addRestaurantInFav, getBannerById, openLoginModel, getRestaurantDetail, enableLoading, disableLoading, saveToRestaurantCart, getRestaurantCart } from '../../../actions/index';
import history from '../../../common/History';
import NoContentFound from '../../common/NoContentFound'
import {  formateTime, getDaysName, getDaysFullName} from '../../common';
import './listing.less';
import ListExample from '../common/List';
import RestaurantDetailCard from '../common/RestaurantDetailCard';
import { DownOutlined } from '@ant-design/icons';
import AddToCartView from './AddToCartView';
import ViewRestaurantCart from './RestaurentCartChekoutProcess/ViewRestaurantCart';
import RestaurentCartChekoutProcess from './RestaurentCartChekoutProcess/';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;


class RestaurantDetails extends React.Component {
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
      selectedItem: [],
      displayCartModal: false,
      deliveryType: 'delivery',
      displayClearCart: false,
      clearCartData: '',
      restaurantCartItems: []
    }
  }

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    this.props.enableLoading()
    const { isLoggedIn } = this.props
    let parameter = this.props.match.params
    this.getDetails()
    let id = parameter.subCategoryId ? parameter.subCategoryId : parameter.categoryId
    this.getBannerData(id)
    if(isLoggedIn){
      this.getRestaurantCartItem();
    }
  }

  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = (categoryId) => {
    let parameter = this.props.match.params
    this.props.getBannerById(3, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : ''
        const banner = data && data.filter(el => el.moduleId === 3)
        const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
        let temp = [], image;
        image = top.length !== 0 && top.filter(el => el.subcategoryId == categoryId)
        temp = image
        if (temp.length === 0) {
          image = top.length !== 0 && top.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
        }
        this.setState({ topImages: image })
      }
    })
  }

  /**
  * @method getDetails
  * @description get all restaurant details
  */
  getDetails = (filter) => {
    let itemId = this.props.match.params.itemId
    this.props.getRestaurantDetail(itemId,filter, res => {
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
        <Tabs animated={false} className="resturant-tabs rs-listing-tab">
          {Array.isArray(item) && item.length && item.map((el, i) => {
            return (
              <TabPane tab={el.menu_category_name} key={i}>
                <RestaurantDetailCard displayAddToCartModal={(res) => this.displayAddToCartModal(res)} listItem={el.menu_items} />
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
      if (data.favourites === 1) {
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

  displayAddToCartModal = (res) => {
    const { restaurantDetail, restaurantCartItems } = this.state
    if (restaurantCartItems && restaurantCartItems.length > 0) {
      let isItemFromSameRestaurant = restaurantCartItems.every(val => val.business_profile_id == restaurantDetail.menu.business_profile_id)
      if (isItemFromSameRestaurant === false) {
        toastr.warning('You have already selected a item from different restaurant. To add this item you need to clear your cart or order your cart item');
      } else {
        this.setState({ displayAddToCartModal: true, selectedItem: res });
      }
    } else {
      this.setState({ displayAddToCartModal: true, selectedItem: res });
    }
  }

  hideAddToCartModal = (data, reqdata) => {
    
    if (data === true) {
      this.setState({ displayAddToCartModal: false }, () => {
        this.setState({ displayClearCart: true, clearCartData: reqdata });
      });
    } else {
      this.setState({ displayAddToCartModal: false });
    }

  }

  hideViewCartModal = () => {
    this.setState({ displayCartModal: false });
  }

  showViewCartModal = () => {
    this.setState({ displayCartModal: true });
  }

  handleMenuClick = (e) => {
    
  }


  handleClearCartOk = () => {
    let reqData = this.state.clearCartData;
    reqData.clear_cart = 1;
    this.props.enableLoading();
    this.props.saveToRestaurantCart(reqData, (response) => {
      this.props.disableLoading();
      if (response.status === 200) {
        toastr.success('Items has been removed from cart successfully');
        this.setState({ displayClearCart: false });
      }
    });
  }

  handleClearCartCancel = () => {
    this.setState({ displayClearCart: false, clearCartData: '' });
  }

  /**
   * @method render
   * @description render component
   */
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    
    this.setState({
      visible: false,
    });
  };

  getRestaurantCartItem = () => {
    this.props.enableLoading();
    this.props.getRestaurantCart((response) => {
      if (response.status === 200) {
        this.props.disableLoading();
        this.setState({ restaurantCartItems: response.data.data.cart_items });
      }
    });
  }

  renderOperatingHours = (list) => {
    var d = new Date();
    var day = d.getDay()
    if(list && Array.isArray(list) && list.length){
      return (
        list && list.map((el, i) =>
          <li key={i}>
            <Text className={day === el.day ? 'active-date' : ''}>{getDaysFullName(el.day)}</Text>
            {el.day === 7 ?
              <Text className='pull-right'>
                Closed
              </Text> :
              <Text className={day === el.day ? 'pull-right active-date uppercase' : 'pull-right uppercase'}>
                {`${formateTime(el.start_time)} - ${formateTime(el.end_time)}`}
              </Text>
            }
          </li>
        )
      )
    }
    
  }

  render() {
    const { restaurantDetail, topImages } = this.state
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let itemId = parameter.itemId
    let reviewList = restaurantDetail && Array.isArray(restaurantDetail.valid_trader_ratings) && restaurantDetail.valid_trader_ratings.length ? restaurantDetail.valid_trader_ratings : []
    let categoryName = parameter.categoryName;
    const menu = (
      <SocialShare {...this.props} />
    );
    const menudropdown = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="delivery">
          <a href='javascript:viod(0)'>ASAP</a>
        </Menu.Item>
        <Menu.Item key="take_away">
          <a href='javascript:viod(0)'>15mins</a>
        </Menu.Item>
        <Menu.Item key="take_away">
          <a href='javascript:viod(0)'>30mins</a>
        </Menu.Item>
        <Menu.Item key="take_away">
          <a href='javascript:viod(0)'>1hr</a>
        </Menu.Item>
        <Menu.Item key="take_away">
          <a href='javascript:viod(0)'>2hr</a>
        </Menu.Item>
        <Menu.Item key="take_away">
          <a href='javascript:viod(0)'>3hr</a>
        </Menu.Item>
      </Menu>
    );

    // 
    return (
      <div className="booking-product-detail-parent-block">
        <Layout className="common-sub-category-landing booking-sub-category-landing">
          <Layout className="yellow-theme common-left-right-padd">
            {/* <Layout className="booking-restaurant-milethree"> */}
            <Layout className="right-parent-block booking-restaurant-milethree">
              <div className='detail-page right-content-block'>
              <Row gutter={[0, 0]}>
                <Col span={24}>
                    <div className="category-name" onClick={()=> this.props.history.goBack()}>
                        <Button
                        type="ghost"
                        shape={"round"}
                        >
                          <Icon
                              icon="arrow-left"
                              size="20"
                              className="arrow-left-icon"
                          />
                          {categoryName}
                        </Button>
                    </div>
                </Col>
              </Row>
              <Row gutter={[40, 40]}>
                <Col md={24}>
                  <div className='inner-banner fm-details-banner resutrant-banner'>
                    {/* <img src={require('../../../assets/images/restaurant-banner.jpg')} alt='' /> */}
                    <img src={restaurantDetail && restaurantDetail.cover_photo ? restaurantDetail.cover_photo : require('../../../assets/images/restaurant-banner.jpg')} alt='' />
                    {/* <CarouselSlider bannerItem={topImages} pathName='/' /> */}
                  </div>
                  <div className='fm-card-box resto-detail-box' >
                    <Row>
                      <Col span='20'>
                        <h3>{restaurantDetail && restaurantDetail.business_name}</h3>
                      </Col>
                      <Col span='4'>
                        <ul className='fm-panel-action '>
                          <li className={restaurantDetail.favourites === 1 ? 'active' : ''}>
                            <span >
                              <Icon
                                icon={restaurantDetail.favourites === 1 ? 'wishlist-fill' : 'wishlist'}
                                size='18'
                                style={{ cursor: 'pointer' }}
                                onClick={() => this.onSelection(restaurantDetail)}
                              /></span>
                          </li>
                          <li>
                            <Dropdown overlay={menu} trigger={['click']} overlayClassName='contact-social-detail share-ad resto-social-before'>
                              <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                <Icon icon='share' size='18' />
                                {/* Need to add here */}
                              </div>
                            </Dropdown>
                          </li>
                        </ul>
                      </Col>
                      <Col span='20'>
                        <h4>{restaurantDetail && restaurantDetail.cusines_text}</h4>
                      </Col>
                      {restaurantDetail && <Col span='20' className="mt-10 mb-10">
                        <div className='rate-section'>
                          {restaurantDetail.avg_rating !== 0 ? 
                          (<Fragment>
                            <Text strong className="text-orange mr-7">{`${parseInt(restaurantDetail.avg_rating)}.0`}</Text>
                            <Rate disabled style={{fontSize:'15px'}} defaultValue={restaurantDetail.avg_rating ? `${parseInt(restaurantDetail.avg_rating)}.0` : 0.0} />
                            <Link className="more-info-orange ml-7" to={`/bookings-restaurant-reviews/${categoryName}/${cat_id}/${itemId}`}>{`${reviewList && reviewList.length} reviews`}</Link>
                          </Fragment>)
                           : <Link to={`/bookings-restaurant-reviews/${categoryName}/${cat_id}/${itemId}`}>No reviews yet</Link>
                          }
                        </div>
                      </Col>}
                      <Col className="adress-detail">
                        {restaurantDetail && restaurantDetail.user && <p>
                          <img src={require('../../../assets/images/location-icons.png')} alt='edit' />
                          <span className="addres-restaurant">{restaurantDetail.user.business_location? restaurantDetail.user.business_location : restaurantDetail.address}</span> </p>}
                        <Link className="more-info-orange" onClick={this.showModal}> More Info</Link>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>

              <Fragment>
                <div className='restaurant-wrap-inner'>
                  <Row gutter={[38, 38]}>
                    <Col className='gutter-row' md={24}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', paddingBottom: 3 }}>
                        <div className='site-card-wrapper w-100 site-card-wrapper-fm-milethree'>
                          <Row gutter={16} style={{  fontFamily: 'Poppins', fontWeight: 'bold'}}>
                            <Col span={5} >
                              <Select
                                onChange={(e) => {
                                  this.setState({ deliveryType: e });
                                }}
                                placeholder='Delivery Types'
                                style={{ width: "100%" }}
                                defaultValue="Delivery"
                              >
                                <Option value='delivery'>Delivery</Option>
                                <Option value='take_away'>Pickup</Option>
                              </Select>
                            </Col>
                            <Col span={14}>
                              <p className="boxwhite-shadow justify-content-left">
                                Delivery to:  <strong>{restaurantDetail.address}</strong>
                              </p>
                            </Col>
                            <Col span={5}>
                              <Dropdown overlay={menudropdown} trigger={['click']} className="boxwhite-shadow">
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                  <p className="grey-color mb-0">When: <strong> ASAP</strong></p>  <DownOutlined />
                                </a>
                              </Dropdown>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div className="restaurant-detail-tab restaurant-tab-cont">
                        {this.renderDetail(restaurantDetail)}
                      </div>
                      {/* <Card
                        className='payment-methods-card mb-60 payment-methods-card-fm-milethree'
                      >
                        {this.renderDetail(restaurantDetail)}
                      </Card> */}
                      {/* <Button onClick={() => this.showViewCartModal()} className="checkout-btn" danger>Checkout</Button> */}
                    </Col>
                    {/* Code comment as per API 18-11-2020
                    <Col className='gutter-row your-order' md={8}>
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
                            <Button onClick={() => this.showViewCartModal()} className="checkout-btn" danger>Checkout</Button>
                          </div><br />
                        </div>
                      </Card>
                    </Col> */}
                  </Row>
                </div>
              </Fragment>

              <Modal

                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={720}
                className="moredetail-restuarant"
              >
                <div className="">
                  <div className="viewdetail-share d-flex">
                    <ul className='fm-panel-action  mb-0'>
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
                        <Dropdown overlay={menu} trigger={['click']}>
                          <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                            <Icon icon='share' size='18' />
                          </div>
                        </Dropdown>
                      </li>
                    </ul>
                  </div>
                  <Title level={4} >{restaurantDetail && restaurantDetail.business_name}</Title>
                  <Text>{restaurantDetail && restaurantDetail.cusines_text}</Text>
                  <div className='rate-section'>
                    {restaurantDetail.avg_rating !== 0 ? 
                      (<Fragment>
                        <Text strong className="mr-7">{`${parseInt(restaurantDetail.avg_rating)}.0`}</Text>
                        <Rate disabled style={{fontSize:'15px'}} defaultValue={restaurantDetail.avg_rating ? `${parseInt(restaurantDetail.avg_rating)}.0` : 0.0} />
                        <Link className="more-info-orange ml-7" to={`/bookings-restaurant-reviews/${categoryName}/${cat_id}/${itemId}`}>See Reviews</Link>
                      </Fragment>)
                        : 'No reviews yet'
                      }
                  </div>
                  <Divider />
                  
                  <Row gutter={[60, 0]}>
                    <Col md={12} className="opening-hour">
                      <Text className=""><b>Opening Hours</b></Text>
                      <ul style={{ padding: 0 }}>
                        {this.renderOperatingHours(restaurantDetail.operating_hours)}
                      </ul>
                    </Col>
                    <Col md={12}>
                    {restaurantDetail && restaurantDetail.user &&<div className="adress-detail">
                        <p>
                          <img src={require('../../../assets/images/location-icons.png')} alt='edit' /> 
                          <span className="addres-restaurant">{restaurantDetail.user.business_location? restaurantDetail.user.business_location : restaurantDetail.address}</span>
                        </p>
                      </div>}
                      {/* <img className="pt-10" src={require('../../../assets/images/map-image.png')} ></img> */}
                      {restaurantDetail && <Map className="h-200" list={[restaurantDetail]} />}
                    </Col>
                  </Row>
                </div>
              </Modal>
              </div>
            </Layout>
          </Layout>
          <Modal
            title=''
            visible={this.state.displayAddToCartModal}
            className={'custom-modal style1 add-cart-milethree-modal'}
            footer={false}
            onCancel={() => this.hideAddToCartModal(false, '')}
            destroyOnClose={true}
          >
            <div className='padding'>
              <AddToCartView deliveryType={this.state.deliveryType} selectedItem={this.state.selectedItem} removeAddToCartModal={(message, reqData) => this.hideAddToCartModal(message, reqData)} restaurantDetail={restaurantDetail} />
            </div>
          </Modal>
          <Modal
            title='Your Order'
            visible={this.state.displayCartModal}
            className={'custom-modal order-checkout style1'}
            footer={false}
            onCancel={this.hideViewCartModal}
            destroyOnClose={true}
          >
            <div className='padding order-checkout-content-block'>
              <RestaurentCartChekoutProcess initialStep={0} restaurantDetail={restaurantDetail} />
            </div>
          </Modal>
          <Modal
            title=""
            visible={this.state.displayClearCart}
            onOk={this.handleClearCartOk}
            onCancel={this.handleClearCartCancel}
            className={'custom-modal style1 cancel-sml-modal'}
          >
            <div className='content-block'>
              <div className="discrip">
                There are {this.state.deliveryType === 'take_away' ? 'Delivery' : 'Pickup'} items in your cart. Please select the same service type to add an item to the cart. Or click OK to clear your cart.
              </div>
            </div>
          </Modal>
        </Layout>
      </div >
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
  mapStateToProps,
  { removeRestaurantInFav, addRestaurantInFav, getRestaurantDetail, getBannerById, openLoginModel, enableLoading, disableLoading, saveToRestaurantCart, getRestaurantCart }
)(RestaurantDetails);