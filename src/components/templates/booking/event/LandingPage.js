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
import BookingEventCard from '../../../common/bookingEventCard/bookingEventCard';
import './event.less'
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


class BookingBeautyLandingPage extends React.Component {

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
        this.props.getChildCategory({ pid: cat_id }, res => {
            if (res.status === 200) {
                const data = Array.isArray(res.data.newinsertcategories) && res.data.newinsertcategories;
                this.setState({ subCategory: data })
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
    componentDidMount() {
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
                <li onClick={() => this.setState({ redirectTo: `/classifieds/subcategory/${el.id}` })}>
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
        const { classifiedList, topImages, subCategory, redirectTo } = this.state;
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
                            <Title level={4} className='title uppercase  main-heading-bookg'>{'Beauty'}</Title>
                        </div>
                        {subCategory && subCategory.length !== 0 && <div className='sub-header-menu'>
                            <Row>
                                <Col md={8}>
                                    <ul>
                                        <li onClick={() => this.setState({ redirectTo: `/classifieds/realestate/${cat_id}` })}>
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
                                <Title level={2} className='text-white'>Get ready for that big event</Title>
                                <Text className='text-white fs-18'>Receive no-obligation quotes from reviewed, rated & trusted in minutes.</Text>
                                <Space className='mt-60' className='fm-btn-group'>
                                    <Button
                                        type={'primary'}
                                        size={'large'}
                                    >
                                        {'Venues'}
                                    </Button>
                                    <Button
                                        type={'primary'}
                                        size={'large'}
                                    >
                                        {'Caterers'}
                                    </Button>
                                    <Button
                                        type={'primary'}
                                        size={'large'}
                                        className='fm-btn-photo'
                                    >
                                        {'Photographer & Videographer'}
                                    </Button>
                                    <Button
                                        type={'primary'}
                                        size={'large'}
                                    >
                                        {'Florists'}
                                    </Button>
                                    <Button
                                        type={'primary'}
                                        size={'large'}
                                        className='fm-btn-makup'
                                    >
                                        {'Makeup & Hair artists'}
                                    </Button>
                                </Space>
                            </div>
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
                                                <div className='fm-delivery'>
                                                    {'Free'}
                                                </div>
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
                                                <div className='fm-delivery'>
                                                    {'Free'}
                                                </div>
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
                                                <div className='fm-delivery'>
                                                    {'Free'}
                                                </div>
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
                                                <div className='fm-delivery'>
                                                    {'Free'}
                                                </div>
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
                                                <div className='fm-delivery'>
                                                    {'Free'}
                                                </div>
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
                                                <div className='fm-delivery'>
                                                    {'Free'}
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                                <div className='align-center pt-25 pb-25'>
                                    <Button type='default' className='fm-btn-orange' size={'middle'}>
                                        {'See All'}
                                    </Button>
                                </div>
                            </div>
                            <div className='wrap-inner bg-gray-linear'>
                                <Title level={2} className='pt-30'>{"Deals you don't want to miss"}</Title>
                                <Text className='fs-16 text-black'>{'Update your latest promotions'}</Text>
                                <Row gutter={[38, 38]} className='pt-50'>
                                    <Col className='gutter-row' md={8}>
                                        <BookingEventCard />
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <BookingEventCard />
                                    </Col>
                                    <Col className='gutter-row' md={8}>
                                        <BookingEventCard />
                                    </Col>
                                </Row>
                                <div className='align-center pt-25 pb-25'>
                                    <Button type='default' className='fm-btn-orange' size={'middle'}>
                                        {'See All'}
                                    </Button>
                                </div>
                            </div>
                            <div className='wrap-inner bg-gray-linear fm-gradient-bg fm-cities-cards'>
                                <Title level={1} className='fm-block-title'>
                                    {'Popular Events'}
                                </Title>
                                <h3 className='fm-sub-title'>{'Simple booking to your event'}</h3>
                                <Row gutter={[19, 19]}>
                                    <Col span={8}>
                                        <div className='fm-card-block'>
                                            <Link to='/' className='ad-banner'>
                                                <img src={require('../../../../assets/images/birthday-parties.png')} alt='' />
                                            </Link>
                                            <div className='fm-desc-stripe fm-cities-desc'>
                                                <Row className='ant-row-center'>
                                                    <Col>
                                                        <h2>Birthday Parties</h2>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className='fm-card-block'>
                                            <Link to='/' className='ad-banner'>
                                                <img src={require('../../../../assets/images/birthday-parties.png')} alt='' />
                                            </Link>
                                            <div className='fm-desc-stripe fm-cities-desc'>
                                                <Row className='ant-row-center'>
                                                    <Col>
                                                        <h2>Engagements</h2>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className='fm-card-block'>
                                            <Link to='/' className='ad-banner'>
                                                <img src={require('../../../../assets/images/birthday-parties.png')} alt='' />
                                            </Link>
                                            <div className='fm-desc-stripe fm-cities-desc'>
                                                <Row className='ant-row-center'>
                                                    <Col>
                                                        <h2>Christmas Parties</h2>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <div className='align-center pt-25 pb-25'>
                                    <Button type='default' className='fm-btn-orange' size={'middle'}>
                                        {'See All'}
                                    </Button>
                                </div>
                            </div>
                            <div className='wrap-inner bg-gray-linear fm-gradient-bg fm-cities-cards'>
                                <Title level={1} className='fm-block-title'>
                                    {'Popular Venue Types'}
                                </Title>
                                <h3 className='fm-sub-title'>{'Find your best venue'}</h3>
                                <Row gutter={[19, 19]}>
                                    <Col span={8}>
                                        <div className='fm-card-block'>
                                            <Link to='/' className='ad-banner'>
                                                <img src={require('../../../../assets/images/birthday-parties.png')} alt='' />
                                            </Link>
                                            <div className='fm-desc-stripe fm-cities-desc'>
                                                <Row className='ant-row-center'>
                                                    <Col>
                                                        <h2>Rooftops</h2>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className='fm-card-block'>
                                            <Link to='/' className='ad-banner'>
                                                <img src={require('../../../../assets/images/birthday-parties.png')} alt='' />
                                            </Link>
                                            <div className='fm-desc-stripe fm-cities-desc'>
                                                <Row className='ant-row-center'>
                                                    <Col>
                                                        <h2>Bar</h2>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className='fm-card-block'>
                                            <Link to='/' className='ad-banner'>
                                                <img src={require('../../../../assets/images/birthday-parties.png')} alt='' />
                                            </Link>
                                            <div className='fm-desc-stripe fm-cities-desc'>
                                                <Row className='ant-row-center'>
                                                    <Col>
                                                        <h2>Private Dining</h2>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className='align-center pt-25 pb-25'>
                                    <Button type='default' className='fm-btn-orange' size={'middle'}>
                                        {'See All'}
                                    </Button>
                                </div>
                            </div>
                            <div className={'search-tags mt-0 fm-customer-tag'}>
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
)(BookingBeautyLandingPage);