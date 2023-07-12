

import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import SubHeader from '../common/SubHeader';
import { STATUS_CODES } from '../../../config/StatusCode'
import { Layout, Row, Col, Typography, Card, Button, Space } from 'antd';
import { getBestPackagesAPI, getBookingPromoAPI, getDailyDeals, enableLoading, disableLoading, getBannerById } from '../../../actions/index';
import { getClassfiedCategoryListing, getBookingSubcategory, getClassfiedCategoryDetail } from '../../../actions';
import { getChildCategory } from '../../../actions'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider';
import { langs } from '../../../config/localization';
import { getBookingSubcategoryRoute } from '../../../common/getRoutes';
import BannerCard from '../../common/bannerCard/BannerCard'
import DailyDealsCard from '../common/DailyDealsCard';
import { TEMPLATE, DEFAULT_IMAGE_CARD } from '../../../config/Config';
import PopularSearchList from '../common/PopularSerach'
import NoContentFound from '../../common/NoContentFound'
import { displayDateTimeFormate, dateFormate, capitalizeFirstLetter } from '../../common';
import { getBookingDailyDealsDetailRoutes } from '../../../common/getRoutes'
import { Elements } from '@stripe/react-stripe-js';
const { Content } = Layout;
const { Title, Text } = Typography;

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
            classifiedList: [],
            subCategory: [],
            dailyDealsData: [],
            bookingPromoData: [],
            bestPackages: []
        };
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        this.props.enableLoading()
        let cat_id = this.props.match.params.categoryId
        this.getBannerData(cat_id)
        this.getDailyDealsRecord(cat_id)
        this.getBestBeautyPackages(cat_id)
        this.getPromoRecords(cat_id)
        let parameter = this.props.match.params
        this.props.getBookingSubcategory(parameter.categoryId, res => {
            if (res.status === STATUS_CODES.OK) {
                const subCategory = Array.isArray(res.data.data) ? res.data.data : []
                this.setState({ subCategory: subCategory })
            }
        })
    }

    /**
      * @method componentWillReceiveProps
      * @description receive props
      */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.cat_id
        let catIdNext = nextprops.match.params.cat_id
        if (catIdInitial !== catIdNext) {
            this.props.enableLoading()
            this.getDailyDealsRecord(catIdNext)
            this.getBannerData(catIdNext)
            this.getPromoRecords(catIdNext)
            this.getBestBeautyPackages(catIdNext)
        }
    }

    /**
     * @method getBestBeautyPackages
     * @description get best beauty packages
     */
    getBestBeautyPackages = (id) => {
        let requestData = {
            booking_category_id: id
        }
        this.props.getBestPackagesAPI(requestData, res => {
            if (res.status === 200) {
                let item = res.data && res.data.data
                let bestPackages = item && Array.isArray(item) && item.length ? item : []
                this.setState({ bestPackages: bestPackages })
            }
        })
    }

    /**
      * @method getDailyDealsRecord
      * @description get daily deals records
      */
    getDailyDealsRecord = (id) => {
        let requestData = {
            category_id: id
        }
        this.props.getDailyDeals(requestData, res => {
            if (res.status === 200) {
                let item = res.data && res.data.data
                let dailyDeals = item && item.data && Array.isArray(item.data) && item.data.length ? item.data : []
                this.setState({ dailyDealsData: dailyDeals, total: item.total })
                
            }
        })
    }

    /**
     * @method getPromoRecords
     * @description get make up promo records
     */
    getPromoRecords = (id) => {
        let requestData = {
            category_id: id
        }
        this.props.getBookingPromoAPI(requestData, res => {
            if (res.status === 200) {
                let item = res.data && res.data.data
                
                let promo = item && item.data && Array.isArray(item.data) && item.data.length ? item.data : []
                this.setState({ bookingPromoData: promo, total: item.total })
                
            }
        })
    }

    /**
     * @method getBannerData
     * @description get banner detail
     */
    getBannerData = (categoryId) => {
        this.props.getBannerById(3, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                const data = res.data.success && Array.isArray(res.data.success.banners) ? res.data.success.banners : ''
                const banner = data && data.filter(el => el.moduleId === 3)
                const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
                let image = top.length !== 0 && top.filter(el => el.categoryId == categoryId && el.subcategoryId === '')
                this.setState({ topImages: image })
            }
        })
    }

    /**
     * @method renderSubCategory
     * @description render subcategory
     */
    renderSubCategoryBtn = (childCategory) => {
        let parameter = this.props.match.params;
        return childCategory.length !== 0 && childCategory.map((el, i) => {
            let redirectUrl = getBookingSubcategoryRoute(TEMPLATE.BEAUTY, TEMPLATE.BEAUTY, parameter.categoryId, el.slug, el.id)
            return (
                <Button
                    type={'primary'}
                    size={'large'}
                    onClick={() => {
                        this.props.history.push(redirectUrl)
                    }}
                >
                    {el.name}
                </Button>
            );
        })
    }

    /**
     * @method selectTemplateRoute
     * @description navigate to detail Page
     */
    selectTemplateRoute = (el) => {
        const { handyman, type } = this.props
        let parameter = this.props.match.params
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : el.user && el.user.booking_cat_id
        let templateName = parameter.categoryName ? parameter.categoryName : el.category_name.toLowerCase()
        let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : el.subcategory_name.toLowerCase()
        let subCategoryId = parameter.subCategoryId ? parameter.subCategoryId : el.user && el.user.booking_sub_cat_id
        let classifiedId = el.user && el.user.user_id;
        let catName = ''
        let path = ''
        if (templateName === TEMPLATE.HANDYMAN || templateName.toLowerCase() === TEMPLATE.HANDYMAN) {
            path = getBookingDailyDealsDetailRoutes(templateName.toLowerCase(), cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.BEAUTY) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.EVENT) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.WELLBEING) {
            
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else if (type === TEMPLATE.PSERVICES) {
            path = getBookingDailyDealsDetailRoutes(TEMPLATE.PSERVICES, cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.PSERVICES) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        }
    }


    /**
     * @method renderPromoCards
     * @description render makeup promo cards
     */
    renderPromoCards = () => {
        const { bookingPromoData } = this.state
        if (Array.isArray(bookingPromoData) && bookingPromoData.length) {
            return bookingPromoData.slice(0, 6).map((el, i) => {
                let image = (el && el.service && el.service.image !== undefined && el.service !== null) ? el.service.image : DEFAULT_IMAGE_CARD
                return (
                    <Col className='gutter-row small-card-detail' md={8}>
                        <Card
                            bordered={false}
                            className={'detail-card horizontal'}
                            onClick={() => this.selectTemplateRoute(el)} style={{ cursor: 'pointer' }}
                            cover={
                                <img
                                    src={image}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = DEFAULT_IMAGE_CARD
                                    }}
                                    alt={''}
                                />
                            }
                        >
                            <div className='price-box beauty-price'>
                                <div className='manin-title'>
                                    {/* {'Fast Makeup'} */}
                                    {el.service ? capitalizeFirstLetter(el.service.name) : ''}
                                </div>
                                <div className='action-link mb-5'>
                                    <span className={'blue-link'}> {el.subcategory_name ? el.subcategory_name : ''}</span>
                                </div>
                                <div className="date-time">
                                    {`${dateFormate(el.start_date)} - ${dateFormate(el.end_date)}`}
                                </div>
                                <div className='price'>
                                    <small>from</small> {el.discounted_price ? `AU$${el.discounted_price}` : ''}
                                </div>
                            </div>
                        </Card>
                    </Col>
                )
            })
        }
    }

    /**
     * @method renderHairDeals
     * @description render hair deals products
     */
    renderHairDeals = () => {
        const { dailyDealsData } = this.state
        if (Array.isArray(dailyDealsData) && dailyDealsData.length) {
            return dailyDealsData.slice(0, 3).map((el, i) => {
                return (
                    <Col className='gutter-row' md={6}>
                        <DailyDealsCard data={el} type={'beauty'} />
                    </Col>
                )
            })
        }
    }

    /**
    * @method renderAccessories
    * @description render Accessories 
    */
    renderAccessories = () => {
        let list = [1, 2, 3, 4, 5, 6]
        if (Array.isArray(list) && list.length) {
            return list.slice(0, 3).map((el, i) => {
                return (
                    <Col md={8}>
                        <BannerCard
                            imgSrc={require('../../../assets/images/beauty-accessories-banner1.png')}
                            title={['Makeup Set', <br />, 'Full Collection']}
                            titlePosition={'bottom'}
                            priceLabel={'From'}
                            price={'AU$25'}
                        />
                    </Col>
                )
            })
        }
    }

    /**
     * @method renderBestPackages
     * @description render best beauty packages
     */
    renderBestPackages = () => {
        const { bestPackages } = this.state
        if (Array.isArray(bestPackages) && bestPackages.length) {
            return (
                <Row gutter={[20, 20]} className="pt-50">
                    {bestPackages.slice(0, 4).map((el, i) => {
                        let service = el.service_name ? el.service_name.replace(/,/g, ' + ') : ''
                        return (

                            <Col md={12}>
                                <BannerCard
                                    imgSrc={el.banner_image ? el.banner_image : require('../../../assets/images/beauty-accessories-banner5.png')}
                                    title={el.title ? capitalizeFirstLetter(el.title) : ''}
                                    titleSize={'25'}
                                    titlePosition={'bottom'}
                                    subTitle={service}
                                    priceLabel={'Start From'}
                                    price={el.discounted_price ? `${el.discounted_price}$` : ''}
                                    pricePosition={'bottom'}
                                />
                            </Col>

                        )
                    })}
                </Row>
            )
        } else {
            return <NoContentFound />
        }

    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { redirect, bestPackages, bookingPromoData, dailyDealsData, classifiedList, topImages, subCategory, redirectTo } = this.state;
        const { isLoggedIn } = this.props;
        let parameter = this.props.match.params
        let cat_id = this.props.match.params.categoryId
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="yellow-theme common-left-right-padd">
                    <AppSidebar history={history} activeCategoryId={cat_id} />
                    <Layout className="right-parent-block">
                        <SubHeader
                            categoryName={TEMPLATE.BEAUTY}
                            showAll={false}
                        />

                        <div className='inner-banner'>
                            <CarouselSlider bannerItem={topImages} pathName='/' />
                            {/* <img src={require('../../../assets/images/samuele-errico.png')} alt='' /> */}
                            <div className='main-banner-content'>
                                {/* <Title level={2} className='text-white'>Get ready for that big event</Title>
                                <Text className='text-white fs-18'>A full suite of beauty experiences await you</Text><br/> */}
                                {/* <Space className='mt-60 fm-btn-group'>
                                    {this.renderSubCategoryBtn(subCategory)}
                                </Space> */}
                            </div>
                        </div>
                        <Content className='site-layout'>
                            {bookingPromoData.length !== 0 && <div className='wrap-inner bg-gray-linear beauty-makeup'>
                                <Title level={2} className='pt-30'>{'Makeup promo'}</Title>
                                <Text className='fs-16 text-black'>{'Deals are limited, book now before places run out!'}</Text>
                                {bookingPromoData.length !== 0 ? <Row gutter={[38, 38]} className='pt-50'>
                                    {this.renderPromoCards()}
                                </Row> : <NoContentFound />}
                                {bookingPromoData.length > 6 && <div className='align-center pt-25 pb-25'>
                                    <Button
                                        type='default'
                                        className='fm-btn-orange'
                                        size={'middle'}
                                        onClick={() => {
                                            this.props.history.push(`/bookings-see-all/makeup-promo/${cat_id}`)
                                        }}
                                    >
                                        {'See All'}
                                    </Button>
                                </div>}
                            </div>}
                            {(dailyDealsData.length !== 0 &&
                                <div className='wrap-inner bg-gray-linear'>
                                    <Title level={2} className='pt-30'>{"Hair deals you don't want to miss"}</Title>
                                    <Text className='fs-16 text-black'>{'Update your do with these latest Hair promotions'}</Text>
                                    {dailyDealsData.length !== 0 ? <Row gutter={[38, 38]} className='pt-50'>
                                        {this.renderHairDeals()}
                                    </Row> : <NoContentFound />}
                                    {dailyDealsData.length > 3 && <div className='align-center pt-25 pb-25'>
                                        <Button type='default'
                                            className='fm-btn-orange'
                                            size={'middle'}
                                            onClick={() => {
                                                this.props.history.push(`/bookings-see-more/daily-deals/${TEMPLATE.BEAUTY}/${cat_id}`)
                                            }}
                                        >
                                            {'See All'}
                                        </Button>
                                    </div>}
                                </div>
                            )}
                            <div className='wrap-inner bg-gray-linear'>
                                <Title level={2} className='pt-30'>{'Accessories'}</Title>
                                <Text className='fs-16 text-black'>{'Find what you need at home'}</Text>
                                <Row gutter={[16, 16]} className='pt-50'>
                                    <Col md={8}>
                                        <BannerCard
                                            imgSrc={require('../../../assets/images/beauty-accessories-banner1.png')}
                                            title={['Makeup Set', <br />, 'Full Collection']}
                                            titlePosition={'bottom'}
                                            priceLabel={'From'}
                                            price={'AU$25'}
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <BannerCard
                                            imgSrc={require('../../../assets/images/beauty-accessories-banner2.png')}
                                            title={['Shaving', <br />, 'Moisturiser']}
                                            titlePosition={'bottom'}
                                            priceLabel={'From'}
                                            price={'AU$25'}
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <BannerCard
                                            imgSrc={require('../../../assets/images/beauty-accessories-banner3.png')}
                                            title={['Professional', <br />, 'Hairdresser Kit']}
                                            titlePosition={'bottom'}
                                            priceLabel={'From'}
                                            price={'AU$25'}
                                            textColor={'#363B40'}
                                        />
                                    </Col>
                                </Row>
                                <div className='align-center pt-25 pb-25'>
                                    <Button type='default' className='fm-btn-orange' size={'middle'}>
                                        {'See All'}
                                    </Button>
                                </div>
                            </div>
                            {bestPackages.length !== 0 && <div className='wrap-inner bg-gray-linear pb-60  beauty-col'>
                                <Title level={2} className='pt-30'>{'Best Beauty Packages'}</Title>
                                <Text className='fs-16 text-black'>{'Best Value deals on your beauty package'}</Text>
                                {this.renderBestPackages()}
                            </div>}
                            <PopularSearchList history={history} parameter={parameter} />
                        </Content>
                    </Layout>
                </Layout>
                {redirect && <Redirect push
                    to={{
                        pathname: redirect
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
    { getBestPackagesAPI, getBookingPromoAPI, getDailyDeals, enableLoading, disableLoading, getClassfiedCategoryListing, getBookingSubcategory, getClassfiedCategoryDetail, getBannerById, getChildCategory }
)(BookingBeautyLandingPage);