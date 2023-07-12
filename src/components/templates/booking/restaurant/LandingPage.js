import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../../../sidebar/index';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { Layout, Row, Col, Typography, Carousel, Tabs, Form, Input, Select, Button, Checkbox, Card, Rate } from 'antd';
import Icon from '../../../customIcons/customIcons';
import { DetailCard } from '../../../common/DetailCard1'
import { getClassfiedCategoryListing, getBannerById, openLoginModel } from '../../../../actions/index';
import history from '../../../../common/History';
import { CarouselSlider } from '../../../common/CarouselSlider'
import { TEMPLATE, DEFAULT_ICON } from '../../../../config/Config'
import './restaurant.less'
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
function onChange(e) {
  
}
const tempData1 = [{
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3.0',
  discription: 'Product Heading',
  price: 'AU$120',
  category: 'subcategory',
  location: 'Melbourne',
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3.0',
  discription: 'Product Heading',
  price: 'AU$120',
  category: 'subcategory',
  location: 'Melbourne',
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3.0',
  discription: 'Product Heading',
  price: 'AU$120',
  category: 'subcategory',
  location: 'Melbourne',
}
];
const tempData = [{
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '30,000',
  category: 'subcategory',
  location: 'indore'
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '20,000',
  category: 'subcategory',
  location: 'indore'
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '5000',
  category: 'subcategory',
  location: 'indore'
}
]

class RestaurantLandingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: []
    }
  }

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    this.props.getBannerById(2, res => {
      if (res.status === 200) {
        const banner = res.data.success && res.data.success.banners
        this.getBannerData(banner)
      }
    })
  }

  /**
 * @method getBannerData
 * @description get banner detail
 */
  getBannerData = (banners) => {
    const top = banners.filter(el => el.bannerPosition === langs.key.top)
    const bottom = banners.filter(el => el.bannerPosition === langs.key.bottom)
    this.setState({ topImages: top, bottomImages: bottom })
  }

  /**
   * @method selectTemplateRoute
   * @description select tempalte route dynamically
   */
  selectTemplateRoute = (el) => {
    let reqData = {
      id: el.id,
      page: 1,
      page_size: 10
    }
    this.props.getClassfiedCategoryListing(reqData, (res) => {
      if (Array.isArray(res.data.data) && res.data.data.length) {
        let templateName = res.data.data[0].template_slug
        let cat_id = res.data.data[0].id

        if (templateName === TEMPLATE.GENERAL) {
          this.props.history.push(`/classifieds/${TEMPLATE.GENERAL}/${cat_id}`)
        } else if (templateName === TEMPLATE.JOB) {
          this.props.history.push(`/classifieds/${TEMPLATE.JOB}/${cat_id}`)
        } else if (templateName === TEMPLATE.REALESTATE) {
          this.props.history.push(`/classifieds/${TEMPLATE.REALESTATE}/${cat_id}`)
        }
      } else {
        toastr.warning(langs.warning, langs.messages.classified_list_not_found)
      }
    })
  }

  /**
  * @method renderCategoryList
  * @description render category list
  */
  renderCategoryList = () => {
    return this.props.classifiedList.map((el) => {
      let iconUrl = `${this.props.iconUrl}${el.id}/${el.icon}`
      return <li key={el.key} onClick={() => this.selectTemplateRoute(el)}>
        <div className={'item'}>
          <img onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_ICON
          }}
            // alt={data.title ? data.title : ''}
            src={iconUrl} alt='Home' width='30' className={'stroke-color'} />
          <Paragraph className='title'>{el.name}</Paragraph>
        </div>
      </li>

    })
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isLoggedIn } = this.props;
    const { topImages, bottomImages } = this.state
    return (
      <div className='App'>
        <Layout>
          <Layout>
            <AppSidebar history={history} />
            <Layout className='fm-restaurant-wrap'>
              <div className='sub-header fm-details-header'>
                <Title level={4} className='title'>{'RESTAURANT'}</Title>
              </div>
              <div className='main-banner'>
                <Link to='/'><img src={require('../../../../assets/images/restaurant-banner.jpg')} alt='' align='center' /></Link>
              </div>
              <Tabs type='card' className={'tab-style1 tab-yellow-style '}>
                <TabPane tab='Delivery' key='1'>
                  <Form name='location-form' className='location-search' layout={'inline'}>
                    <Form.Item style={{ width: 'calc(100% - 88px)' }}>
                      <Input.Group compact>
                        <Form.Item
                          noStyle
                        >
                          <Input style={{ width: '50%' }} placeholder='Any cuisine' />
                        </Form.Item>
                        <Form.Item
                          name={['address', 'street']}
                          noStyle
                        >
                          <Input style={{ width: '50%' }} placeholder='Enter your postal code or address' suffix={<Icon icon='location' size='15' />} />
                        </Form.Item>
                      </Input.Group>
                      <div className='fm-moreoption-wrap'>
                        <Row justify='space-between'>
                          <Col><Checkbox onChange={onChange}>Open Now</Checkbox></Col>
                          <Col><Link to='/'>More option</Link></Col>
                        </Row>
                      </div>
                    </Form.Item>
                    <Form.Item>
                      <Button type='primary' shape={'circle'} htmlType='submit'>
                        <Icon icon='search' size='20' />
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>

                <TabPane tab='Pick Up' key='3'>
                  Used
                            </TabPane>
              </Tabs>
              <Content className='site-layout'>
                <div className='align-center fm-circle-wrap  pb-25' style={{ background: '#363b40' }}>
                  <div className='location-search'>
                    <Title level={3}>
                      {'Popular Cuisines'}
                    </Title>
                    <ul className='circle-icon-list'>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>See All</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>American</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Asian</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Burgers</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Cafe</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Chinese</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Pizza</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Indian</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Japanese</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Italian</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Mexican</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Dessert</Text>
                        </Link>
                      </li>
                      <li>
                        <Link to='/'>
                          <div>
                            <img src={require('../../../../assets/images/rr-all-icon.svg')} alt='' />
                          </div>
                          <Text>Vegetarian</Text>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className='wrap-inner fm-gradient-bg '>
                    <Title level={1} className='fm-block-title'>
                      {'Popular Restaurant'}
                    </Title>
                    <h3 className='fm-sub-title'>{'See our most popular Restaurant here!'}</h3>
                    <Row gutter={[19, 19]}>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>La Porchetta</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>Hog's Australia's Steakhouse</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>Hog's Australia's Steakhouse</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>Hog's Australia's Steakhouse</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>Hog's Australia's Steakhouse</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>Hog's Australia's Steakhouse</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>Hog's Australia's Steakhouse</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>Hog's Australia's Steakhouse</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className='fm-card-block'>
                          <Link to='/' className='ad-banner'>
                            <img src={require('../../../../assets/images/la-porchetta.png')} alt='' />
                          </Link>
                          <div className='fm-desc-stripe fm-cities-desc'>
                            <Row className='ant-row-center'>
                              <Col>
                                <h2>Hog's Australia's Steakhouse</h2>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col span={24} className='fm-button-wrap' align='center'>
                        <a href='#' className='btn fm-btn-white'>See All</a>
                      </Col>
                    </Row>
                  </div>

                  <div className='wrap-inner fm-gradient-bg makeup-pro'>
                    <Title level={2} className='pt-30'>{'Special Offer'}</Title>
                    {/* <Text className='fs-16 text-black'>{'Deals are limited, book now before places run out!'}</Text> */}
                    <Text className='fs-16 text-black'>{'We offer everyday deals'}</Text>
                    <Row gutter={[18, 18]} className='pt-50'>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col className='gutter-row' md={8}>
                        <Card
                          bordered={false}
                          className={'detail-card horizontal fm-res-card'}
                          cover={
                            <img
                              alt={tempData.discription}
                              src={require('../../../../assets/images/blue-lotus-restaurant.jpg')}
                            />
                          }
                        >
                          <div className='price-box'>
                            <div className='price'>
                              {'Blue Lotus Restaurant'}
                            </div>
                          </div>
                          <div className='sub-title'>
                            {'Asian'}
                          </div>
                          <div className='action-link'>
                            <div className='fm-delivery'>
                              {'Free'}
                            </div>
                            <div className='fm-delivery-status'>
                              {'Delivery'}
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                    <div className='align-center pt-25 pb-25'>
                      <Button className='fm-btn-orange' type='default' size={'middle'}>
                        {'See All'}
                      </Button>
                    </div>
                  </div>
                  <div className='wrap-inner fm-gradient-bg customer-service-sect' >
                    <Title level={2} className='pt-30'>{'Our customer reviews'}</Title>
                    <Row gutter={[18, 18]} className='pt-50'>
                      <Col className='gutter-row' md={12}>
                        <Card bordered={false} className={'detail-card horizontal fm-res-card fm-customer-card'}>
                          <div className='fm-customer-top'>
                            <div className='fm-img'><img src={require('../../../../assets/images/portofino-pizza.jpg')} alt='' /></div>
                            <div className='fm-description'>“Great food and fantastic customer service”</div>
                          </div>
                          <div className='fm-footer-description'>
                            <Row>
                              <Col span={13}>
                                <div className='rate-section'>
                                  {'3.0'} <Rate allowHalf defaultValue={3.0} />
                                </div>
                                <div className='fm-title'>
                                  {'Portofino Pizza'}
                                </div>
                                <div className='fm-address'>
                                  {'884 Glen Huntly Road, Caulfield, 3162'}
                                </div>
                              </Col>
                              <Col span={11} className='fm-mt-auto'>
                                <div className='fm-date-box'>
                                  Michael - 15/12/2019
                                                            </div>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      </Col><Col className='gutter-row' md={12}>
                        <Card bordered={false} className={'detail-card horizontal fm-res-card fm-customer-card'}>
                          <div className='fm-customer-top'>
                            <div className='fm-img'><img src={require('../../../../assets/images/portofino-pizza.jpg')} alt='' /></div>
                            <div className='fm-description'>“Great food and fantastic customer service”</div>
                          </div>
                          <div className='fm-footer-description'>
                            <Row>
                              <Col span={13}>
                                <div className='rate-section'>
                                  {'3.0'} <Rate allowHalf defaultValue={3.0} />
                                </div>
                                <div className='fm-title'>
                                  {'Portofino Pizza'}
                                </div>
                                <div className='fm-address'>
                                  {'884 Glen Huntly Road, Caulfield, 3162'}
                                </div>
                              </Col>
                              <Col span={11} className='fm-mt-auto'>
                                <div className='fm-date-box'>
                                  Michael - 15/12/2019
                                                            </div>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      </Col><Col className='gutter-row' md={12}>
                        <Card bordered={false} className={'detail-card horizontal fm-res-card fm-customer-card'}>
                          <div className='fm-customer-top'>
                            <div className='fm-img'><img src={require('../../../../assets/images/portofino-pizza.jpg')} alt='' /></div>
                            <div className='fm-description'>“Great food and fantastic customer service”</div>
                          </div>
                          <div className='fm-footer-description'>
                            <Row>
                              <Col span={13}>
                                <div className='rate-section'>
                                  {'3.0'} <Rate allowHalf defaultValue={3.0} />
                                </div>
                                <div className='fm-title'>
                                  {'Portofino Pizza'}
                                </div>
                                <div className='fm-address'>
                                  {'884 Glen Huntly Road, Caulfield, 3162'}
                                </div>
                              </Col>
                              <Col span={11} className='fm-mt-auto'>
                                <div className='fm-date-box'>
                                  Michael - 15/12/2019
                                                            </div>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      </Col><Col className='gutter-row' md={12}>
                        <Card bordered={false} className={'detail-card horizontal fm-res-card fm-customer-card'}>
                          <div className='fm-customer-top'>
                            <div className='fm-img'><img src={require('../../../../assets/images/portofino-pizza.jpg')} alt='' /></div>
                            <div className='fm-description'>“Great food and fantastic customer service”</div>
                          </div>
                          <div className='fm-footer-description'>
                            <Row>
                              <Col span={13}>
                                <div className='rate-section'>
                                  {'3.0'} <Rate allowHalf defaultValue={3.0} />
                                </div>
                                <div className='fm-title'>
                                  {'Portofino Pizza'}
                                </div>
                                <div className='fm-address'>
                                  {'884 Glen Huntly Road, Caulfield, 3162'}
                                </div>
                              </Col>
                              <Col span={11} className='fm-mt-auto'>
                                <div className='fm-date-box'>
                                  Michael - 15/12/2019
                                                            </div>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                </div>
                <div className={'search-tags fm-customer-tag'}>
                  <ul>
                    <li>Popular Search :</li>
                    <li><Link to='/'>Asian</Link></li>
                    <li><Link to='/'>Pizza</Link></li>
                    <li><Link to='/'>Maxican</Link></li>
                    <li><Link to='/'>Asian</Link></li>
                    <li><Link to='/'>Pizza</Link></li>
                    <li><Link to='/'>Maxican</Link></li>
                    <li><Link to='/'>Asian</Link></li>
                    <li><Link to='/'>Pizza</Link></li>
                    <li><Link to='/'>Maxican</Link></li>
                  </ul>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { savedCategories, categoryData } = common;
  let classifiedList = []
  let isEmpty = savedCategories.success.booking.length === 0 && savedCategories.success.retail.length === 0 && savedCategories.success.classified.length === 0 && (savedCategories.success.foodScanner === '' || (Array.isArray(savedCategories.success.foodScanner) && savedCategories.success.foodScanner.length === 0))
  if (auth.isLoggedIn) {
    if (!isEmpty) {
      isEmpty = false
      classifiedList = savedCategories.success.classified && savedCategories.success.classified.filter(el => el.pid === 0);
    } else {
      isEmpty = true
      classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
    }
  } else {
    isEmpty = true
    classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
  }

  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    iconUrl: categoryData.classifiedAll !== undefined ? common.categoryData.classifiedAll.iconurl : '',
    classifiedList,
    isEmpty
  };
};
export default connect(
  mapStateToProps,
  { getClassfiedCategoryListing, getBannerById, openLoginModel }
)(RestaurantLandingPage);