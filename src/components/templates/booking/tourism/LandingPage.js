import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../../../sidebar';
import { Layout, Row, Col, Rate, Typography, Card, Tabs, Form, Input, Select, Checkbox, Button, Breadcrumb, Space } from 'antd';
import Icon from '../../../../components/customIcons/customIcons';
import { getBannerById } from '../../../../actions/index';
import { getClassfiedCategoryListing, getClassfiedCategoryDetail } from '../../../../actions/classifieds';
import { getChildCategory } from '../../../../actions'
import DetailCard from '../../../common/DetailCard'
import history from '../../../../common/History';
import { CarouselSlider } from '../../../common/CarouselSlider';
import BannerCard from '../../../common/bannerCard/BannerCard'
import BookingDetailCard from '../../../common/bookingDetailCard/BookingDetailCard';
import './tourism.less'
const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

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
const differentLocation = ['Drop off at a different location'];
const plainOptions = ['Flexible Dates'];
const openNow = ['Open Now'];

function onChange(checkedValues) {
  
}

class BookingTourismLandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            classifiedList: []
        };
    }

     /**
     * @method componentWillMount
     * @description called before mounting the component
     */
    componentWillMount() {
        let cat_id = this.props.match.params.cat_id
        this.getClassifiedListing(cat_id)
        this.props.getChildCategory({pid: cat_id}, res => {
            if(res.status === 200){
                const data = Array.isArray(res.data.newinsertcategories) && res.data.newinsertcategories;
                this.setState({subCategory: data})
              }
        })
    }

    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.cat_id
        let catIdNext = nextprops.match.params.cat_id
        if (catIdInitial !== catIdNext) {
            this.getClassifiedListing(catIdNext)
        }
    }

    getClassifiedListing = (id) => {
        let reqData = {
            id: id,
            page: 1,
            page_size: 9
        }
        this.props.getClassfiedCategoryListing(reqData, (res) => {
            if (res.status === 200) {
                this.setState({ classifiedList: res.data.data })
            }
        })
    }


     /**
     * @method componentDidMount
     * @description called after render the component
     */
    componentDidMount(){
        this.props.getBannerById(3, res => {
            if (res.status === 200) {
                const banner = res.data.success && res.data.success.banners
                const top = banner.filter(el => el.categoryName === 'Property & Real Estate')
                this.setState({ topImages: top })
            }
        })
    }

    /**
     * @method onTabChange
     * @description manage tab change
     */
    onTabChange = (key, type) => {
        
        this.setState({ [type]: key });
    };

    
    /**
     * @method renderSubCategory
     * @description render subcategory
     */
    renderSubCategory = (childCategory) => {
        return childCategory.length !== 0 && childCategory.map((el, i) => {
            return (
            <li onClick ={ () => this.setState({ redirectTo: `/classifieds/subcategory/${el.id}` })}>
                {/* <Link to={`/classifieds/realestate/${el.id}`}> */}
                    {`${el.name}(${el.classified_count})`}
                {/* </Link> */}
            </li>
            );
        })
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { classifiedList, topImages, subCategory,redirectTo } = this.state;
        const { isLoggedIn } = this.props;
        let cat_id = this.props.match.params.cat_id
        return (
            <Layout>
                <Layout>
                    <AppSidebar history={history} />
                    <Layout>
                        <div className='sub-header fm-bg-yellow'>
                            <div className='hamburger-icon'>
                                <Icon icon={'hamburger'} size='20' />
                            </div>
                            <Title level={4} className='title uppercase'>{'TOURISM'}</Title>
                        </div>
                        { subCategory && subCategory.length !==0 && <div className='sub-header-menu'>
                            <Row>
                                <Col md={8}>
                                    <ul>
                                        <li onClick ={ () => this.setState({ redirectTo: `/classifieds/realestate/${cat_id}`})}>
                                            All({subCategory[0].parent_classified_count})
                                        </li>
                                        {subCategory && this.renderSubCategory(subCategory)}
                                    </ul>
                                </Col>
                            </Row>
                        </div>}
                        <div className='main-banner'>
                            <img src={require('../../../../assets/images/samuele-errico.png')} alt='' />
                            <div className='main-banner-content'>
                                <Title level={2} className='text-white'>Plan your dream trip</Title>
                                <Text className='text-white fs-18'>Get the best prices on 2,000,000+ properties, worldwide</Text>
                            </div>
                            <Tabs type='card' className={'tab-style1 tab-yellow-style'}>
                                <TabPane tab={<div className='fm-tab-names'><img src={require('../../../../assets/images/flight-icon.svg')} /><span>Flight</span></div>} key='1'>
                                    <div className='fm-tab-content'>
                                        <div className='fm-tab-links'>
                                            <Link to='/' className='fm-active-link'>Return</Link>
                                            <Link to='/'>One-way</Link>
                                            <Link to='/'>Multi-city</Link>
                                        </div>
                                        <Form name='location-form' className='location-search' layout={'inline'}>
                                            <Form.Item style={{ width: 'calc(100% - 88px)' }}>
                                                <Input.Group compact>
                                                    <Form.Item
                                                        noStyle
                                                    >
                                                        <Input prefix={<Icon icon='location' size='15' />} style={{ width: '50%' }} placeholder='From' />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={['address', 'street']}
                                                        noStyle
                                                    >
                                                        <Input style={{ width: '50%', borderLeft:'0'}} placeholder='To where?' prefix={<img src={require('../../../../assets/images/both-way-icon.svg')} />} />
                                                    </Form.Item>
                                                </Input.Group>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type='primary' shape={'circle'} htmlType='submit'>
                                                    <Icon icon='search' size='20' />
                                                </Button>
                                            </Form.Item>
                                            <Form.Item style={{ width: 'calc(100% - 88px)'}}>
                                                <div className='fm-multi-inputs'>
                                                        <Form.Item className='fm-input-half'>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                <Input prefix={<Icon icon='location' size='15' />} style={{ width: '50%' }} placeholder='Depart'  prefix={<img src={require('../../../../assets/images/date-icon.svg')} />} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={['address', 'street']}
                                                                noStyle
                                                            >
                                                                <Input style={{ width: '50%', verticalAlign:'top', borderLeft:'0'}} placeholder='Return' />
                                                            </Form.Item>
                                                        </Form.Item>
                                                        <Form.Item className='fm-input-half'>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                <Input  prefix={<img src={require('../../../../assets/images/user-icon.svg')} />} style={{ width: '50%' }} placeholder='2 adults' />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={['address', 'street']}
                                                                noStyle                                                        
                                                            >                                                                
                                                                <Select
                                                                    style={{ width: '50%', verticalAlign:'top', borderLeft:'0'}}
                                                                    placeholder='Economy'
                                                                    allowClear
                                                                >
                                                                    <Option value='clubmembers'>Economy</Option>
                                                                    <Option value='clubmembers'>Economy 1</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Form.Item>
                                                </div>
                                            </Form.Item>
                                        </Form>
                                        <div className='fm-form-checkbox'>
                                            <Checkbox.Group options={plainOptions} defaultValue={['Flexible Dates']} onChange={onChange} />
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab={<div className='fm-tab-names'><img src={require('../../../../assets/images/hotel-icon.svg')} /><span>Hotel</span></div>} key='2'>
                                <div className='fm-tab-content'>
                                        <Form name='location-form' className='location-search' layout={'inline'}>
                                            <Form.Item style={{ width: 'calc(100% - 88px)' }}>
                                                <Input.Group compact>
                                                    <Form.Item
                                                        noStyle
                                                    >
                                                        <Input prefix={<Icon icon='location' size='15' />} placeholder='Enter your destination' />
                                                    </Form.Item>
                                                </Input.Group>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type='primary' shape={'circle'} htmlType='submit'>
                                                    <Icon icon='search' size='20' />
                                                </Button>
                                            </Form.Item>
                                            <Form.Item style={{ width: 'calc(100% - 88px)'}}>
                                                <div className='fm-multi-inputs'>
                                                        <Form.Item className='fm-input-half'>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                <Input prefix={<Icon icon='location' size='15' />} style={{ width: '50%' }} placeholder='Check - in'  prefix={<img src={require('../../../../assets/images/date-icon.svg')} />} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={['address', 'street']}
                                                                noStyle
                                                            >
                                                                <Input style={{ width: '50%', verticalAlign:'top', borderLeft:'0'}} placeholder='Check - out' />
                                                            </Form.Item>
                                                        </Form.Item>
                                                        <Form.Item className='fm-input-half'>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                <Input  prefix={<img src={require('../../../../assets/images/user-icon.svg')} />} style={{ width: '33.3333%' }} placeholder='2 adults' />
                                                            </Form.Item>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                <Input style={{ width: '33.3333%' }} placeholder='0 children' />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={['address', 'street']}
                                                                noStyle                                                        
                                                            >                                                                
                                                                <Select
                                                                    style={{ width: '33.3333%', verticalAlign:'top', borderLeft:'0'}}
                                                                    placeholder='1 room'
                                                                    allowClear
                                                                >
                                                                    <Option value='2 room'>2 room</Option>
                                                                    <Option value='3 room'>3 room </Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Form.Item>
                                                </div>
                                            </Form.Item>
                                        </Form>
                                        <div className='fm-form-checkbox'>
                                            <Checkbox.Group options={plainOptions} defaultValue={['Flexible Dates']} onChange={onChange} />
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab={<div className='fm-tab-names'><img src={require('../../../../assets/images/packages-icon.svg')} /><span>Packages</span></div>} key='3'>
                                <div className='fm-tab-content'>
                                        <div className='fm-tab-links'>
                                            <Link to='/' className='fm-active-link'>Return</Link>
                                            <Link to='/'>One-way</Link>
                                            <Link to='/'>Multi-city</Link>
                                        </div>
                                        <Form name='location-form' className='location-search' layout={'inline'}>
                                            <Form.Item style={{ width: 'calc(100% - 88px)' }}>
                                                <Input.Group compact>
                                                    <Form.Item
                                                        noStyle
                                                    >
                                                        <Input prefix={<Icon icon='location' size='15' />} style={{ width: '50%' }} placeholder='From' />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={['address', 'street']}
                                                        noStyle
                                                    >
                                                        <Input style={{ width: '50%', borderLeft:'0'}} placeholder='To where?' prefix={<img src={require('../../../../assets/images/both-way-icon.svg')} />} />
                                                    </Form.Item>
                                                </Input.Group>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type='primary' shape={'circle'} htmlType='submit'>
                                                    <Icon icon='search' size='20' />
                                                </Button>
                                            </Form.Item>
                                            <Form.Item style={{ width: 'calc(100% - 88px)'}}>
                                                <div className='fm-multi-inputs'>
                                                        <Form.Item className='fm-input-half'>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                <Input prefix={<Icon icon='location' size='15' />} style={{ width: '50%' }} placeholder='Depart'  prefix={<img src={require('../../../../assets/images/date-icon.svg')} />} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={['address', 'street']}
                                                                noStyle
                                                            >
                                                                <Input style={{ width: '50%', verticalAlign:'top', borderLeft:'0'}} placeholder='Return' />
                                                            </Form.Item>
                                                        </Form.Item>
                                                        <Form.Item className='fm-input-half'>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                <Input  prefix={<img src={require('../../../../assets/images/user-icon.svg')} />} style={{ width: '50%' }} placeholder='2 adults' />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={['address', 'street']}
                                                                noStyle                                                        
                                                            >                                                                
                                                                <Select
                                                                    style={{ width: '50%', verticalAlign:'top', borderLeft:'0'}}
                                                                    placeholder='Economy'
                                                                    allowClear
                                                                >
                                                                    <Option value='clubmembers'>Economy</Option>
                                                                    <Option value='clubmembers'>Economy 1</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Form.Item>
                                                </div>
                                            </Form.Item>
                                        </Form>
                                        <div className='fm-form-checkbox'>
                                            <Checkbox.Group options={plainOptions} defaultValue={['Flexible Dates']} onChange={onChange} />
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab={<div className='fm-tab-names fm-tab-names-car'><img src={require('../../../../assets/images/car-icon.svg')} /><span>Car</span></div>} key='4'>
                                <div className='fm-tab-content'>
                                        <div className='fm-tab-links'>
                                            <Link to='/' className='fm-active-link'>Airport transfers</Link>
                                            <Link to='/'>Car hire</Link>
                                        </div>
                                        <Form name='location-form' className='location-search' layout={'inline'}>
                                            <Form.Item style={{ width: 'calc(100% - 88px)' }}>
                                                <Input.Group compact>
                                                    <Form.Item
                                                        noStyle                                                       
                                                    >
                                                        <Input className='fm-pickup-point' prefix={<Icon icon='location' size='15' />} style={{ width: '50%' }} placeholder='Pick-up Point' />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={['address', 'street']}
                                                        noStyle
                                                    >
                                                        <Input className='fm-drop-point' style={{ width: '50%', borderLeft:'0'}} placeholder='Drop-off Point' />
                                                    </Form.Item>
                                                </Input.Group>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type='primary' shape={'circle'} htmlType='submit'>
                                                    <Icon icon='search' size='20' />
                                                </Button>
                                            </Form.Item>
                                            <Form.Item style={{ width: 'calc(100% - 88px)'}}>
                                                <div className='fm-multi-inputs'>
                                                        <Form.Item className='fm-input-half'>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                <Input prefix={<Icon icon='location' size='15' />} style={{ width: '50%' }} placeholder='Pick-up Date'  prefix={<img src={require('../../../../assets/images/date-icon.svg')} />} />
                                                            </Form.Item>
                                                            <Form.Item                                                               
                                                                noStyle
                                                            >
                                                                <Input style={{ width: '50%', verticalAlign:'top', borderLeft:'0'}} placeholder='Time' />
                                                            </Form.Item>
                                                        </Form.Item>
                                                        <Form.Item className='fm-input-half'>
                                                            <Form.Item
                                                                noStyle
                                                            >
                                                                 <Input prefix={<Icon icon='location' size='15' />} style={{ width: '50%'}} placeholder='Drop-off Date'  prefix={<img src={require('../../../../assets/images/date-icon.svg')} />} />
                                                            </Form.Item>
                                                            <Form.Item                                                               
                                                                noStyle                                                        
                                                            >                                                                
                                                                <Input style={{ width: '50%', verticalAlign:'top', borderLeft:'0'}} placeholder='Time' />
                                                            </Form.Item>
                                                        </Form.Item>
                                                </div>
                                            </Form.Item>
                                        </Form>
                                        <div className='fm-form-checkbox' style={{width: 'calc(100% - 88px)'}}>
                                            <Checkbox.Group options={differentLocation} defaultValue={['Drop off at a different location']} onChange={onChange} />
                                            <Link className='fm-more-option' to='/'>More option</Link>
                                        </div>
                                    </div>                                
                                </TabPane>
                                <TabPane tab={<div className='fm-tab-names'><img src={require('../../../../assets/images/tours-attractions-icon.svg')} /><span className='fm-big-title'>Tours & Attractions</span></div>} key='5'>
                                <div className='fm-tab-content'>
                                        <Form name='location-form' className='location-search' layout={'inline'}>
                                            <Form.Item style={{ width: 'calc(100% - 88px)' }}>
                                                <Input.Group compact>
                                                    <Form.Item
                                                        noStyle
                                                    >
                                                        <Input prefix={<Icon icon='location' size='15' />} style={{ width: '50%' }} placeholder='Enter your destination' />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={['address', 'street']}
                                                        noStyle
                                                    >
                                                       <Select
                                                                    style={{ width: '50%', verticalAlign:'top', borderLeft:'0'}}
                                                                    placeholder='Thing to do'
                                                                    className='fm-drop-point'
                                                                    allowClear
                                                                >
                                                                    <Option value='Thing to do'>Thing to do</Option>
                                                                    <Option value='Thing to do 1'>Thing to do 1</Option>
                                                                </Select>
                                                    </Form.Item>
                                                </Input.Group>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type='primary' shape={'circle'} htmlType='submit'>
                                                    <Icon icon='search' size='20' />
                                                </Button>
                                            </Form.Item>                                         
                                        </Form>
                                        <div className='fm-form-checkbox'>
                                            <Checkbox.Group options={openNow} defaultValue={['Open Now']} onChange={onChange} />
                                        </div>
                                    </div>
                               
                                </TabPane>                                
                            </Tabs>
                        </div>
                        <Content className='site-layout'>
                            <div className='wrap-inner bg-gray-linear'>
                                <Title level={2} className='pt-30'>{'Makeup promo'}</Title>
                                <Text className='fs-16 text-black'>{'Deals are limited, book now before places run out!'}</Text>
                                <Row gutter={[38, 38]} className='pt-50'>
                                    <Col className='gutter-row' md={8}>
                                        <Card
                                            bordered={false}
                                            className={'detail-card horizontal'}
                                            cover={
                                                <img
                                                    alt={tempData.discription}
                                                    src={require('../../../../assets/images/makeup.png')}
                                                />
                                            }
                                        >
                                            <div className='price-box'>
                                                <div className='price'>
                                                    {'AU$4,000'}
                                                </div>
                                            </div>
                                            <div className='sub-title'>
                                                {'Suzuki Grand Vitara 2002'}
                                            </div>
                                            <div className='action-link'>
                                                <Link to='/'>{'Cars & Vans'}</Link>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <Card
                                            bordered={false}
                                            className={'detail-card horizontal'}
                                            cover={
                                                <img
                                                    alt={tempData.discription}
                                                    src={require('../../../../assets/images/makeup.png')}
                                                />
                                            }
                                        >
                                            <div className='price-box'>
                                                <div className='price'>
                                                    {'AU$4,000'}
                                                </div>
                                            </div>
                                            <div className='sub-title'>
                                                {'Suzuki Grand Vitara 2002'}
                                            </div>
                                            <div className='action-link'>
                                                <Link to='/'>{'Cars & Vans'}</Link>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <Card
                                            bordered={false}
                                            className={'detail-card horizontal'}
                                            cover={
                                                <img
                                                    alt={tempData.discription}
                                                    src={require('../../../../assets/images/makeup.png')}
                                                />
                                            }
                                        >
                                            <div className='price-box'>
                                                <div className='price'>
                                                    {'AU$4,000'}
                                                </div>
                                            </div>
                                            <div className='sub-title'>
                                                {'Suzuki Grand Vitara 2002'}
                                            </div>
                                            <div className='action-link'>
                                                <Link to='/'>{'Cars & Vans'}</Link>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <Card
                                            bordered={false}
                                            className={'detail-card horizontal'}
                                            cover={
                                                <img
                                                    alt={tempData.discription}
                                                    src={require('../../../../assets/images/makeup.png')}
                                                />
                                            }
                                        >
                                            <div className='price-box'>
                                                <div className='price'>
                                                    {'AU$4,000'}
                                                </div>
                                            </div>
                                            <div className='sub-title'>
                                                {'Suzuki Grand Vitara 2002'}
                                            </div>
                                            <div className='action-link'>
                                                <Link to='/'>{'Cars & Vans'}</Link>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <Card
                                            bordered={false}
                                            className={'detail-card horizontal'}
                                            cover={
                                                <img
                                                    alt={tempData.discription}
                                                    src={require('../../../../assets/images/makeup.png')}
                                                />
                                            }
                                        >
                                            <div className='price-box'>
                                                <div className='price'>
                                                    {'AU$4,000'}
                                                </div>
                                            </div>
                                            <div className='sub-title'>
                                                {'Suzuki Grand Vitara 2002'}
                                            </div>
                                            <div className='action-link'>
                                                <Link to='/'>{'Cars & Vans'}</Link>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <Card
                                            bordered={false}
                                            className={'detail-card horizontal'}
                                            cover={
                                                <img
                                                    alt={tempData.discription}
                                                    src={require('../../../../assets/images/makeup.png')}
                                                />
                                            }
                                        >
                                            <div className='price-box'>
                                                <div className='price'>
                                                    {'AU$4,000'}
                                                </div>
                                            </div>
                                            <div className='sub-title'>
                                                {'Suzuki Grand Vitara 2002'}
                                            </div>
                                            <div className='action-link'>
                                                <Link to='/'>{'Cars & Vans'}</Link>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                                <div className='align-center pt-25 pb-25'>
                                    <Button type='default' size={'middle'} className='fm-btn-orange'>
                                        {'See All'}
                                    </Button>
                                </div>
                            </div>
                            <div className='wrap-inner bg-gray-linear'>
                                <Title level={2} className='pt-30'>{"Hair deals you don't want to miss"}</Title>
                                <Text className='fs-16 text-black'>{'Update your do with these latest Hair promotions'}</Text>
                                <Row gutter={[38, 38]} className='pt-50'>
                                    <Col className='gutter-row' md={8}>
                                        <BookingDetailCard />
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <BookingDetailCard />
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <BookingDetailCard />
                                    </Col>
                                </Row>
                                <div className='align-center pt-25 pb-25'>
                                    <Button type='default' size={'middle'} className='fm-btn-orange'>
                                        {'See All'}
                                    </Button>
                                </div>
                            </div>
                            <div className='wrap-inner bg-gray-linear'>
                                <Title level={2} className='pt-30'>{'Accessories'}</Title>
                                <Text className='fs-16 text-black'>{'Find what you need at home'}</Text>
                                <Row gutter={[16, 16]} className='pt-50'>
                                    <Col md={8}>
                                        <BannerCard
                                            imgSrc={require('../../../../assets/images/beauty-accessories-banner1.png')}
                                            title={['Makeup Set', <br/>, 'Full Collection']}
                                            titlePosition={'bottom'}
                                            priceLabel={'From'}
                                            price={'AU$25'}
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <BannerCard
                                            imgSrc={require('../../../../assets/images/beauty-accessories-banner2.png')}
                                            title={['Shaving', <br/>, 'Moisturiser']}
                                            titlePosition={'bottom'}
                                            priceLabel={'From'}
                                            price={'AU$25'}
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <BannerCard
                                            imgSrc={require('../../../../assets/images/beauty-accessories-banner3.png')}
                                            title={['Professional', <br/>, 'Hairdresser Kit']}
                                            titlePosition={'bottom'}
                                            priceLabel={'From'}
                                            price={'AU$25'}
                                            textColor={'#363B40'}
                                        />
                                    </Col>
                                </Row>
                                <div className='align-center pt-25 pb-25'>
                                    <Button type='default' size={'middle'} className='fm-btn-orange'>
                                        {'See All'}
                                    </Button>
                                </div>
                            </div>
                            <div className='wrap-inner bg-gray-linear pb-60'>
                                <Title level={2} className='pt-30'>{'Best Beauty Packages'}</Title>
                                <Text className='fs-16 text-black'>{'Best Value deals on your beauty package'}</Text>
                                <Row gutter={[16, 16]} className='pt-50'>
                                    <Col md={12}>
                                        <BannerCard
                                            imgSrc={require('../../../../assets/images/beauty-accessories-banner4.png')}
                                            title={'Beach Hut Hair'}
                                            titleSize={'25'}
                                            titlePosition={'bottom'}
                                            subTitle={'Hair + Brows + Manicure'}
                                            priceLabel={'Start From'}
                                            price={'AU$25'}
                                            pricePosition={'bottom'}
                                        />
                                        <BannerCard
                                            imgSrc={require('../../../../assets/images/beauty-accessories-banner5.png')}
                                            title={'Beauty + Brows'}
                                            titleSize={'25'}
                                            titlePosition={'bottom'}
                                            subTitle={'Brows + Makeup'}
                                            priceLabel={'Start From'}
                                            price={'AU$725'}
                                            pricePosition={'bottom'}
                                        />
                                    </Col>
                                    <Col md={12}>
                                        <BannerCard
                                            imgSrc={require('../../../../assets/images/beauty-accessories-banner6.png')}
                                            title={'Manicure Cat'}
                                            titleSize={'25'}
                                            titlePosition={'bottom'}
                                            subTitle={'Manicure + Pedicure  + Haircut'}
                                            priceLabel={'Start From'}
                                            price={'AU$725'}
                                            pricePosition={'bottom'}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div className={'search-tags mt-0'}>
                                <ul>
                                    <li>Popular Destination:</li>
                                    <li><Link to='/'>Bangkok</Link></li>
                                    <li><Link to='/'>Japan</Link></li>
                                    <li><Link to='/'>New Zealand</Link></li>
                                    <li><Link to='/'>Italy</Link></li>
                                    <li><Link to='/'>New York</Link></li>
                                    <li><Link to='/'>Australia</Link></li>
                                </ul>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
                {redirectTo && <Redirect push to={{
                    pathname: redirectTo,
                    state: {
                        parentCategory: classifiedList.length && classifiedList[0].catname,
                        cat_id: cat_id
                    }                  
                    }}
                />}
            </Layout>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, classifieds } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedClassifiedList: classifieds.classifiedsList,
    };
}

export default connect(
    mapStateToProps,
    { getClassfiedCategoryListing, getClassfiedCategoryDetail, getBannerById, getChildCategory }
)(BookingTourismLandingPage);