import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../../../sidebar/index';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { DatePicker, Layout, message, Row, Col, List, Typography, Carousel, Tabs, Form, Input, Select, Button, Card, Breadcrumb, Table, Tag, Space, Modal, Steps, Progress, Collapse } from 'antd';
import Icon from '../../../customIcons/customIcons';
import { DetailCard } from '../../../common/DetailCard1'
import DetailCardHome from '../../../common/DetailCard'
import { getClassfiedCategoryListing, getBannerById, openLoginModel } from '../../../../actions/index';
import history from '../../../../common/History';
import { CarouselSlider } from '../../../common/CarouselSlider'
import FlightListCard  from '../../../common/flightCard/FlightListCard'
import { TEMPLATE, DEFAULT_ICON } from '../../../../config/Config'
import './flight.less'
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

class FlightList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topImages: [],
            bottomImages: [],
            visible: false,
            current: 0,
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
        const { current } = this.state;
        const { isLoggedIn } = this.props;
        const { topImages, bottomImages } = this.state
        return (
            <div className='App'>
                <Layout>
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
                                    title={<div className='fm-btn-block'>Showing flights from Melbourne to Narita</div>}
                                    bordered={false}
                                    extra={ <ul className='panel-action fm-select-box'>
                                                <li>
                                                    <Text className='fm-label'>Sort</Text>
                                                    <Select defaultValue='Recommended' bordered={false}>
                                                        <Option value='Recommended'>Recommended</Option>
                                                        <Option value='Recommended'>Recommended</Option>
                                                        <Option value='Recommended'>Recommended</Option>
                                                    </Select>
                                                </li>
                                            </ul>                                        
                                    }
                                    className={'home-product-list header-nospace fm-listing-page fm-flight-head'}
                                >
                                    <Text>The price includes taxes and fees</Text>
                                </Card>
                                    <Row gutter={[40, 40]}>
                                            <Col span={5}>
                                                <h3 className='fm-sub-title'>Filters</h3>
                                                   <div className='fm-select-input'>                                                      
                                                        <Form.Item
                                                            label='Stops'
                                                        >
                                                           <Select defaultValue='Any' bordered={false}>
                                                            <Option value='Any'>Any</Option>
                                                            <Option value='One'>One</Option>
                                                        </Select>
                                                        </Form.Item><Form.Item
                                                            label='Duration'
                                                        >
                                                           <Select defaultValue='Any' bordered={false}>
                                                            <Option value='Any'>Any</Option>
                                                            <Option value='One'>One</Option>
                                                        </Select>
                                                        </Form.Item><Form.Item
                                                            label='Airlines'
                                                        >
                                                           <Select defaultValue='Any' bordered={false}>
                                                            <Option value='Any'>Any</Option>
                                                            <Option value='One'>One</Option>
                                                        </Select>
                                                        </Form.Item><Form.Item
                                                            label='Price'
                                                        >
                                                           <Select defaultValue='Any' bordered={false}>
                                                            <Option value='Any'>Any</Option>
                                                            <Option value='One'>One</Option>
                                                        </Select>
                                                        </Form.Item><Form.Item
                                                            label='Times'
                                                        >
                                                           <Select defaultValue='Any' bordered={false}>
                                                            <Option value='Any'>Any</Option>
                                                            <Option value='One'>One</Option>
                                                        </Select>
                                                        </Form.Item>
                                                   </div>
                                            </Col>
                                        <Col span={19} className='fm-list-table'>
                                           <Text className='fm-total-result'>942 results</Text>
                                           <FlightListCard />
                                           <FlightListCard />
                                           <FlightListCard />
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
)(FlightList);