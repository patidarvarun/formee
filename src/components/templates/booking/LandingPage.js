import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../../sidebar/index';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../config/localization';
import { Layout, Row, Col, Typography, Carousel, Tabs, Form, Input, Select, Button } from 'antd';
import Icon from '../../customIcons/customIcons';
import { DetailCard } from '../../common/DetailCard1'
import { getClassfiedCategoryListing, getBannerById, openLoginModel } from '../../../actions/index';
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import { TEMPLATE, DEFAULT_ICON } from '../../../config/Config'
import './booking.less'
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
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
class BookingLandingPage extends React.Component {
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
                        <Layout>
                            <Content className='site-layout'>
                                <div className='wrap-inner fm-gradient-bg'>
                                    <Title level={1} className='fm-block-title'>
                                        {'Popular Sport Events'}
                                    </Title>
                                    <h3 className='fm-sub-title'>{'See most popular sport event here!'}</h3>
                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/australian-open.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe'>
                                                    <Row>
                                                        <Col span={12}>
                                                            <h2>Australian open</h2>
                                                        </Col>
                                                        <Col span={12} className='text-right'>
                                                            <Link to='/' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
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
                                <div className='wrap-inner fm-gradient-bg fm-cities-cards'>
                                    <Title level={1} className='fm-block-title'>
                                        {'Top Cities'}
                                    </Title>
                                    <h3 className='fm-sub-title'>{'We offer everyday deals.'}</h3>
                                    <Row gutter={[19, 19]}>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='fm-card-block'>
                                                <Link to='/' className='ad-banner'>
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                </Link>
                                                <div className='fm-desc-stripe fm-cities-desc'>
                                                    <Row className='ant-row-center'>
                                                        <Col>
                                                            <h2>Barcelona</h2>
                                                            <h4>Spain</h4>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <Row gutter={[19, 19]}></Row>
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
)(BookingLandingPage);