import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../../sidebar/index';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../config/localization';
import { Layout, Row, Col, Typography, Carousel, Tabs, Form, Input, Select, Button, Card, Breadcrumb } from 'antd';
import Icon from '../../customIcons/customIcons';
import { DetailCard } from '../../common/DetailCard1'
import DetailCardHome from '../../common/DetailCard'
import { getClassfiedCategoryListing, getBannerById, openLoginModel } from '../../../actions/index';
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import { TEMPLATE, DEFAULT_ICON } from '../../../config/Config'
import './listing.less'
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
                <Layout className=" yellow-theme">
                    <Layout>
                        <AppSidebar history={history} />
                        <Layout>
                            <Content className='site-layout'>                               
                                <div className='wrap-inner fm-gradient-bg fm-cities-cards'>
                                <Row className='mb-20'>
                                    <Col md={16}>
                                        <Breadcrumb separator='|' className='pb-30'>
                                            <Breadcrumb.Item>
                                                <Link to='/'>Home</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to='/classifieds'>Classified</Link>
                                            </Breadcrumb.Item>
                                          <Breadcrumb.Item>
                                                <Link to={`/classifieds/realestate/listingPage`}>Listing</Link>
                                            </Breadcrumb.Item>
                                           <Breadcrumb.Item>Listing</Breadcrumb.Item>
                                        </Breadcrumb>
                                    </Col>
                                    <Col md={8}>
                                        <div className='location-btn'>
                                        Melbourne <Icon icon='location' size='15' className='ml-20' />
                                        </div>
                                    </Col>
                                </Row>
                                <Card
                                    title='Melbourne'
                                    bordered={false}
                                    extra={
                                        <ul className='panel-action'>
                                            <li><Icon icon='grid' size='18' /></li>
                                            <li>
                                                <Icon icon='grid-view' size='18' />
                                            </li>
                                        </ul>
                                    }
                                    className={'home-product-list header-nospace fm-listing-page'} >                                    
                                </Card>
                                    <Row gutter={[40, 40]}>
                                        <Col span={8}>
                                            <Card
                                                bordered={false}
                                                className={'detail-card fm-booklist-card'}
                                                cover={
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                }
                                                actions={[
                                                    <div size='60' className='fm-date-info'>19 Mar - 26 Sep 2020</div>,
                                                    <Icon icon='wishlist' size='20' />,
                                                ]}
                                            >
                                                <div className='fm-card-title'>
                                                    <div className='title'>
                                                        National Basketball League 2019/20 Season
                                                    </div>
                                                </div>                                       
                                                <div className='category-box'>
                                                    <div className='category-name'>
                                                    Basketball
                                                </div>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                bordered={false}
                                                className={'detail-card fm-booklist-card'}
                                                cover={
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                }
                                                actions={[
                                                    <div size='60' className='fm-date-info'>19 Mar - 26 Sep 2020</div>,
                                                    <Icon icon='wishlist' size='20' />,
                                                ]}
                                            >
                                                <div className='fm-card-title'>
                                                    <div className='title'>
                                                        National Basketball League 2019/20 Season
                                                    </div>
                                                </div>                                       
                                                <div className='category-box'>
                                                    <div className='category-name'>
                                                    Basketball
                                                </div>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                bordered={false}
                                                className={'detail-card fm-booklist-card'}
                                                cover={
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                }
                                                actions={[
                                                    <div size='60' className='fm-date-info'>19 Mar - 26 Sep 2020</div>,
                                                    <Icon icon='wishlist' size='20' />,
                                                ]}
                                            >
                                                <div className='fm-card-title'>
                                                    <div className='title'>
                                                        National Basketball League 2019/20 Season
                                                    </div>
                                                </div>                                       
                                                <div className='category-box'>
                                                    <div className='category-name'>
                                                    Basketball
                                                </div>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                bordered={false}
                                                className={'detail-card fm-booklist-card'}
                                                cover={
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                }
                                                actions={[
                                                    <div size='60' className='fm-date-info'>19 Mar - 26 Sep 2020</div>,
                                                    <Icon icon='wishlist' size='20' />,
                                                ]}
                                            >
                                                <div className='fm-card-title'>
                                                    <div className='title'>
                                                        National Basketball League 2019/20 Season
                                                    </div>
                                                </div>                                       
                                                <div className='category-box'>
                                                    <div className='category-name'>
                                                    Basketball
                                                </div>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                bordered={false}
                                                className={'detail-card fm-booklist-card'}
                                                cover={
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                }
                                                actions={[
                                                    <div size='60' className='fm-date-info'>19 Mar - 26 Sep 2020</div>,
                                                    <Icon icon='wishlist' size='20' />,
                                                ]}
                                            >
                                                <div className='fm-card-title'>
                                                    <div className='title'>
                                                        National Basketball League 2019/20 Season
                                                    </div>
                                                </div>                                       
                                                <div className='category-box'>
                                                    <div className='category-name'>
                                                    Basketball
                                                </div>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                bordered={false}
                                                className={'detail-card fm-booklist-card'}
                                                cover={
                                                    <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' />
                                                }
                                                actions={[
                                                    <div size='60' className='fm-date-info'>19 Mar - 26 Sep 2020</div>,
                                                    <Icon icon='wishlist' size='20' />,
                                                ]}
                                            >
                                                <div className='fm-card-title'>
                                                    <div className='title'>
                                                        National Basketball League 2019/20 Season
                                                    </div>
                                                </div>                                       
                                                <div className='category-box'>
                                                    <div className='category-name'>
                                                    Basketball
                                                </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>                              
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
)(BookingLandingPage);