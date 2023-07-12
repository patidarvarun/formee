import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import { Layout, Card, Pagination, Typography, Row, Col } from 'antd';
import { langs } from '../../../config/localization';
import Icon from '../../../components/customIcons/customIcons';
import {getPopularVenues, getPopularFitnessTypes, getPopularRestaurant, mostPopularEvents, newInBookings, getEventTypes, openLoginModel, enableLoading, disableLoading } from '../../../actions';
import history from '../../../common/History';
import SubHeader from '../common/SubHeader';
import { TAB_FILTER, TEMPLATE } from '../../../config/Config'
import { converInUpperCase,capitalizeFirstLetter } from '../../common'
import NoContentFound from '../../common/NoContentFound'
import { getBookingCatLandingRoute, getBookingSearchRoute } from '../../../common/getRoutes'
const { Content } = Layout;
const { Text } = Typography;

// Pagination
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
    }
    if (type === 'next') {
        return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
    }
    return originalElement;
}

class PopularSeeAll extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            bookingList: [],
            page: 1,
            productListing: [],
            eventType: []
        };
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        const parameter = this.props.match.params;
        this.props.enableLoading()
        let filter = this.props.match.params.filter
        let subCategoryName = parameter.subCategoryName
        let sub_cat_id = parameter.subCategoryId
        if(filter === langs.key.popular_venue || filter === langs.key.featured_venue){ // get popular and featured event venu category 
            const { popularVenueList } = this.props
            this.props.disableLoading()
            this.props.getPopularVenues()
            this.setState({ eventTypes: popularVenueList })
        }else if (parameter.categoryName === TEMPLATE.RESTAURANT) { // get popular restaurant category 
            this.props.getPopularRestaurant()
        }else if (sub_cat_id === undefined) { // get popular events type by parent category id
            this.props.mostPopularEvents(res => {
                this.props.disableLoading()
                if (res.status === 200) {
                    let popularEvents = res.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []
                    this.setState({ eventTypes: popularEvents })
                }
            })
        }else if (subCategoryName === langs.key.fitness) { // get popular fitness category 
            this.props.getPopularFitnessTypes(res => {
                this.props.disableLoading()
                if (res.status === 200) {
                    let data = res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []
                    
                    this.setState({ eventTypes: data })
                }
            })
        }else {
            this.getEventType(sub_cat_id) // get popular and featured event sub category 
        }
    }

    /** 
   * @method getEventType
   * @description get event type details
   */
    getEventType = (id) => {
        this.props.getEventTypes({ booking_category_id: id }, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                this.setState({ eventTypes: res.data.event_types })
            }
        })
    }

    /**
    * @method handlePageChange
    * @description handle page change
    */
    handlePageChange = (e) => {
        let id = this.props.match.params.subCategoryId
        this.getEventType(id, e)
    }

    /** 
    * @method renderPopularEventType
    * @description render popular event
    */
    renderPopularEventType = (data) => {
        const { isLoggedIn, loggedInDetail } = this.props
        let cat_id = this.props.match.params.categoryId
        let cat_name = this.props.match.params.categoryName
        let sub_cat_id = this.props.match.params.subCategoryId
        let sub_cat_name = this.props.match.params.subCategoryName
        let searchPagePath = getBookingSearchRoute(cat_name, cat_name, cat_id, sub_cat_name, sub_cat_id)
        const requestData = {
            user_id: isLoggedIn ? loggedInDetail.id : '',
            page: 1,
            per_page: 12,
            event_type_id: data.id,
            sub_cat_id
        }
        this.props.newInBookings(requestData, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                this.props.history.push({
                    pathname: searchPagePath,
                    state: {
                        bookingList: data,
                        multipleChoices: sub_cat_name,
                        selectedItems: []
                    }
                })
            }
        })
    }



    /**
    * @method renderCard
    * @description render card details
    */
    renderCard = () => {
        const parameter = this.props.match.params;
        let subCategoryName = parameter.subCategoryName
        const { eventTypes } = this.state
        const { popularRestaurantsList,popularVenueList } = this.props
        if (parameter.filter === 'featured-venue') {
            return (
                <Row gutter={[38, 38]} className='pt-50'>
                    {popularVenueList.map((el) => {
                        return (
                            <Col className='gutter-row' md={8}>
                            <Card
                                bordered={false}
                                className={'detail-card horizontal'}
                                cover={
                                    <img
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = require('../../../assets/images/makeup.png')
                                        }}
                                        src={el.image ? el.image :
                                            require('../../../assets/images/makeup.png')}
                                        alt='' />
                                }
                            >
                                <div className='price-box'>
                                    <div className='price'>
                                        {capitalizeFirstLetter(el.name)}
                                    </div>
                                </div>
                                <div className='sub-title'>
                                    {capitalizeFirstLetter(el.name)}
                                </div>
                                <div className='action-link'>
                                    <div className='fm-delivery'>
                                        {'Free'}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        )
                    })}
                </Row>
            )

        }else
        if (parameter.categoryName === TEMPLATE.RESTAURANT) {
            return (
                <Row gutter={[19, 19]}>
                    {popularRestaurantsList.map((el) => {
                        return (
                            <Col span={8}>
                                <div className='fm-card-block'>
                                    <Text className='ad-banner'>
                                        <img
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = require('../../../assets/images/la-porchetta.png')
                                            }}
                                            src={el.cover_photo ? el.cover_photo :
                                                require('../../../assets/images/la-porchetta.png')} alt='' />
                                    </Text>
                                    <div className='fm-desc-stripe fm-cities-desc'>
                                        <Row className='ant-row-center'>
                                            <Col>
                                                <h2>{capitalizeFirstLetter(el.business_name)}</h2>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            )
        }
        else if (eventTypes && eventTypes.length) {
            return (
                <Fragment>
                    <Row gutter={[38, 38]}>
                        {eventTypes && eventTypes.map((data, i) => {
                            return (
                                <Col span={8} key={i}>
                                    <div className="fm-card-block" onClick={() => this.renderPopularEventType(data)} style={{ cursor: 'pointer' }}>
                                        <img
                                            src={(data && data.image !== undefined && data.image !== null) ? data.image : require("../../../assets/images/birthday-parties.png")}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = require("../../../assets/images/birthday-parties.png")
                                            }}
                                            alt={subCategoryName === langs.key.fitness ? '' : (data && data.title !== undefined) ? data.title : ''}
                                        />
                                        <div className="fm-desc-stripe fm-cities-desc">
                                            <Row className="ant-row-center">
                                                <Col>
                                                    <h2>{subCategoryName === langs.key.fitness ? capitalizeFirstLetter(data.class_name) : capitalizeFirstLetter(data.name)}</h2>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                </Fragment>
            )
        } else {
            return <NoContentFound />
        }
    }

    render() {
        const parameter = this.props.match.params;
        let cat_id = parameter.categoryId;
        let sub_cat_name = parameter.subCategoryName;
        let filter = this.props.match.params.filter
        let headLine = sub_cat_name ? `Popular Event Types` : 'Popular Events'
        if(filter === langs.key.popular_venue){
            headLine = 'Popular Venue Types'
        }else if(filter === langs.key.featured_venue){
            headLine = 'Featured Venue'
        }
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="yellow-theme common-left-right-padd">
                    <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} />
                    <Layout className="right-parent-block">
                        <SubHeader showAll={false} />
                        <Content className='site-layout'>
                            <div className='wrap-inner'>
                                <Card
                                    title={headLine}
                                    bordered={false}
                                    className={'home-product-list'}
                                >
                                    {this.renderCard()}
                                </Card>
                                {/* <Pagination
                                    defaultCurrent={1}
                                    defaultPageSize={10} //default size of page
                                    onChange={this.handlePageChange}
                                    total={50} //total number of card data available
                                    itemRender={itemRender}
                                    className={'mb-20'}
                                /> */}
                            </div>

                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, common, bookings } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        popularRestaurantsList: Array.isArray(bookings.popularRestaurantsList) ? bookings.popularRestaurantsList : [],
        popularVenueList: Array.isArray(bookings.popularVenueList) ? bookings.popularVenueList : [],
    };
}

export default connect(
    mapStateToProps,
    {getPopularVenues,getPopularFitnessTypes, getPopularRestaurant, mostPopularEvents, newInBookings, getEventTypes, openLoginModel, enableLoading, disableLoading }
)(PopularSeeAll);