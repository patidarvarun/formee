import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AppSidebar from '../NewSidebar';
import { Link, Redirect} from 'react-router-dom'
import { Layout, Card, Pagination, Typography, Row, Col } from 'antd';
import { langs } from '../../../config/localization';
import Icon from '../../customIcons/customIcons';
import {searchByRestaurent,popularSpaWellness,getRestaurantSpecialOffer,getDailyDeals,getBookingPromoAPI,openLoginModel, enableLoading, disableLoading } from '../../../actions';
import history from '../../../common/History';
import SubHeader from './SubHeader';
import { TAB_FILTER, TEMPLATE, DEFAULT_IMAGE_CARD } from '../../../config/Config'
import { converInUpperCase,capitalizeFirstLetter } from '../../common'
import NoContentFound from '../../common/NoContentFound'
import {getBookingDailyDealsDetailRoutes, getBookingSubCatDetailRoute } from '../../../common/getRoutes'
import RestaurantDetailCard from '../restaurent/RestaurantCard'
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
            eventType: [],
            total_records: '', popularSpa: [],
            topRatedList: []
        };
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        this.props.enableLoading()
        let cat_id = this.props.match.params.categoryId
        let filter = this.props.match.params.filter
        if(filter === 'restaurant-top-rated'){
            this.getRestaurantTopRatedData()
        }else if(filter === langs.key.fitness_promo || filter === langs.key.makeup_promo){
            this.getPromoRecords(cat_id, 1)
        }else if(filter === langs.key.nutritionists || filter === langs.key.dietitians){
            this.getDailyDealsRecord(cat_id, 1)
        }else if(filter === langs.key.special_offer){
            this.specialOffer(cat_id, 1)
        }else if(filter === langs.key.spa_wellness){
            this.getPopularSpa()
        }
    }

     /** 
     * @method getRestaurantTopRatedData
     * @description get restaurant top rated data
     */
    getRestaurantTopRatedData = () => {
        let reqData = {
            item_name:  '' ,
            latitude: '' ,
            longitude: '',
            kilometer:  '',
            page_size: 9,
            page: 1
        }
        this.props.searchByRestaurent(reqData, (res) => {
        this.props.disableLoading()
            if (res.status === 200) {
                let total_records = res.data && res.data.total
                let toprated =  res.data.data && Array.isArray(res.data.data) ? res.data.data : []
                this.setState({total_records: total_records, topRatedList: toprated})
            }
        })
    }

    /**
      * @method getPopularSpa
      * @description get popular spa wellness
      */
     getPopularSpa = () => {
        this.props.popularSpaWellness(res => {
            this.props.disableLoading()
            if(res.status === 200){
                let data = res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : [] 
                
                this.setState({productListing:data, total_record: 0 }) 
            }
        })
    }


     /**
     * @method specialOffer
     * @description get special offer records
     */
    specialOffer = (cat_id, page) => {
        let requestData = {
            category_id: cat_id,
            page: page,
            per_page: 12
        }
        this.props.getRestaurantSpecialOffer(requestData, res => {
            this.props.disableLoading()
            if(res.status === 200){
                let item = res.data && res.data.data
                
                let specialOffer = item && item.data && Array.isArray(item.data) && item.data.length  ? item.data : []
                this.setState({productListing: specialOffer,total_record: item.total })
            }
        })
    }

    /**
      * @method getDailyDealsRecord
      * @description get daily deals records
      */
    getDailyDealsRecord = (id, page) => {
        let requestData = {
            category_id: id,
            page: page,
            per_page: 12
        }
        this.props.getDailyDeals(requestData, res => {
            this.props.disableLoading()
            if(res.status === 200){
                let item = res.data && res.data.data
                
                let filter = this.props.match.params.filter
                let dailyDeals = item && item.data && Array.isArray(item.data) && item.data.length ? item.data : []
                let nutrition = dailyDeals.length && dailyDeals.filter(el => el.service_type === "nutrition")
                let dietation = dailyDeals.length && dailyDeals.filter(el => el.service_type === "dietation")
                if(filter === langs.key.nutritionists){
                   this.setState({productListing: nutrition, total_record: item.total})
                }else if(filter === langs.key.dietitians){
                    this.setState({productListing: dietation, total_record: item.total})
                }
            }
        })
    }

    /**
     * @method getPromoRecords
     * @description get make up promo records
     */
    getPromoRecords = (id, page) => {
        let requestData = {
            category_id: id,
            page: page,
            per_page: 12
        }
        this.props.getBookingPromoAPI(requestData, res => {
            this.props.disableLoading()
            if(res.status === 200){
                let item = res.data && res.data.data
                
                let promo = item && item.data && Array.isArray(item.data) && item.data.length ? item.data : []
                this.setState({productListing: promo, total_record: item.total })
            }
        })
    }


    /**
    * @method handlePageChange
    * @description handle page change
    */
    handlePageChange = (e) => {
        let filter = this.props.match.params.filter
        let cat_id = this.props.match.params.categoryId
        if(filter === langs.key.fitness_promo || filter === langs.key.makeup_promo){
            this.getPromoRecords(cat_id, e)
        }else if(filter === langs.key.nutritionists || filter === langs.key.dietitians){
            this.getDailyDealsRecord(cat_id, e)
        }else if(filter === langs.key.special_offer){
            this.specialOffer(cat_id, e)
        }
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
        let subCategoryName = parameter.subCategoryName  ? parameter.subCategoryName : el.subcategory_name.toLowerCase()
        let subCategoryId = parameter.subCategoryId ? parameter.subCategoryId : el.user && el.user.booking_sub_cat_id
        let classifiedId = el.user && el.user.user_id;
        let catName = ''
        let path = ''
        if (templateName === TEMPLATE.HANDYMAN || templateName.toLowerCase() === TEMPLATE.HANDYMAN) {
            path = getBookingDailyDealsDetailRoutes(templateName.toLowerCase(),cat_id,subCategoryId,subCategoryName,classifiedId )
            this.setState({ redirect: path })
        }else if (templateName === TEMPLATE.BEAUTY) {
            path = getBookingDailyDealsDetailRoutes(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
            this.setState({ redirect: path })
        }else if (templateName === TEMPLATE.EVENT) {
            path = getBookingDailyDealsDetailRoutes(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
            this.setState({ redirect: path })
        }else if (templateName === TEMPLATE.WELLBEING) {
            
            path = getBookingDailyDealsDetailRoutes(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
            this.setState({ redirect: path })
        }else if (type === TEMPLATE.PSERVICES) {
            path = getBookingDailyDealsDetailRoutes(TEMPLATE.PSERVICES,cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        }else if (templateName === TEMPLATE.PSERVICES) {
            path = getBookingDailyDealsDetailRoutes(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
            this.setState({ redirect: path })
        }
    }

   

    /**
    * @method renderCard
    * @description render card details
    */
    renderCard = (data) => {
        const parameter = this.props.match.params;
        const { topRatedList } = this.state
        let title = '', image= ''
        if(parameter.filter === 'restaurant-top-rated'){
            if (Array.isArray(topRatedList) && topRatedList.length) {
                return (
                    <Fragment>
                        <Row gutter={[38, 38]}>
                            {topRatedList.map((data, i) => {
                                return (
                                    <RestaurantDetailCard
                                        data={data} key={i} slug={parameter.categoryName}
                                        col={6}
                                    />
                                )
                            })}
                        </Row>
                    </Fragment>
                )
            } 
        }else if (parameter.filter === langs.key.fitness_promo || parameter.filter === langs.key.makeup_promo) {
            if(Array.isArray(data) && data.length){
                return data.map((el, i) => {
                    image=(el && el.service && el.service.image !== undefined && el.service !== null) ? el.service.image : DEFAULT_IMAGE_CARD
                    return (
                        <Col className='gutter-row' md={8} key={i}>
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
                                <div className='price-box'>
                                    <div className='price'>
                                        {el.service ? capitalizeFirstLetter(el.service.class_name) : ''}
                                    </div>
                                </div>
                                <div className='sub-title'>
                                    {el.subcategory_name ? capitalizeFirstLetter(el.subcategory_name) : ''}
                                </div>
                                <div className='action-link'>
                                    {el.discount_percent ? `${el.discount_percent} % off` : ''}
                                </div>
                            </Card>
                        </Col>
                    )
                })
            }
        }else
        if (parameter.filter === langs.key.nutritionists || parameter.filter === langs.key.dietitians) {
            if(Array.isArray(data) && data.length){
                return data.map((el, i) => {
                    title = el.service && el.service.class_name ? el.service.class_name : el.service.name ? el.service.name : ''
                    image=(data && data.service && data.service.image !== undefined && data.service !== null) ? data.service.image : require('../../../assets/images/birthday-parties.png')
                    return (
                        <Col span={8} key={i}>
                            <div className='fm-card-block' onClick={() => this.selectTemplateRoute(el)} style={{ cursor: 'pointer' }}>
                                <Link  className='ad-banner'>
                                    <img src={image} alt='' />
                                </Link>
                                <div className='fm-desc-stripe fm-cities-desc'>
                                    <Row className='ant-row-center'>
                                        <Col>
                                            <h2>{title}</h2>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    )
                })
            }
        }else if(parameter.filter === langs.key.special_offer){
            if(Array.isArray(data) && data.length){
                return data.map((el, i) => {
                    let image=(el && el.image !== undefined) ? el.image : DEFAULT_IMAGE_CARD
                    return (
                        <Col className='gutter-row' md={8}>
                            <Card
                                bordered={false}
                                className={'detail-card horizontal fm-res-card'}
                                cover={
                                    <img
                                        alt={''}
                                        src={require('../../../assets/images/blue-lotus-restaurant.jpg')}
                                    />
                                }
                            >
                                <div className='price-box'>
                                    <div className='price'>
                                        { `${el.title ? el.title : ''} ${el.category_name ? el.category_name : ''}`}
                                    </div>
                                </div>
                                <div className='sub-title'>
                                    {'Asian'}
                                </div>
                                <div className='action-link'>
                                    <div className='fm-delivery'>
                                        {/* {'Free'} */}
                                        {el.discount_percent ? `${el.discount_percent} % off` : 'Free Delivery'}
                                    </div>
                                    <div className='fm-delivery-status'>
                                        {/* {'Delivery'} */}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    )
                })
            }
        }else if(parameter.filter === langs.key.spa_wellness){
            // this.renderPopularSpaWellNess(data)
            if(data && data.length){
                return data && data.map((el, i)=> {
                    return (
                    <Col md={8}>
                        <Card
                           onClick={() => this.wellbeingSpaRoutes(el)} style={{ cursor: 'pointer' }}
                           bordered={false}
                           className={'detail-card horizontal'}
                           cover={
                               <img
                                   src={el.cover_photo ? el.cover_photo : require('../../../assets/images/card-img.png')}
                                   alt={''}
                               />
                           }
                       >
                           <div className='price-box'>
                               <div className='price'>
                                  {el.title ? el.title : ''}
                               </div>
                           </div>
                           <div className='sub-title align-left'>
                                Bookings Available
                           </div>
                           <div className='mt-10 price-box'>
                           <div className="">
                                from <b>{`AU$${el.total_amount}`}</b> <br/> per adult
                               </div> 
                               {/* <div className="discount-sect">
                                   <Title className="mb-0" level={3}> 35%</Title>off
                               </div> */}
                           </div>
                       </Card>
                    </Col>
                    )
                })
            }
        }
        else {
            return <NoContentFound />
        }
    }

    /**
    * @method renderCard
    * @description render card details
    */
    renderRestaurantCard = (categoryData) => {
        let parameter = this.props.match.params
        
    }

    /***
     * @method wellbeingSpaRoutes
     * @description navigate to detail Page
     */
    wellbeingSpaRoutes = (el) => {
        let cat_id = el.booking_cat_id
        let templateName = el.category_name
        let subCategoryName = el.sub_category_name
        let subCategoryId = el.booking_sub_cat_id
        let classifiedId = el.user_id;
        let path = ''
         if (templateName === TEMPLATE.WELLBEING) {
            path = getBookingSubCatDetailRoute(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
            this.setState({ redirect: path })
        }
    }

    render() {
        const parameter = this.props.match.params;
        let cat_id = parameter.categoryId;
        let sub_cat_name = parameter.subCategoryName;
        let filter = this.props.match.params.filter
        const { productListing, total_record,redirect } = this.state
        let headLine = ''
        if(filter === langs.key.fitness_promo){
            headLine = 'Fitness Promo'
        }else if(filter === langs.key.nutritionists){
            headLine = 'Looking for Nutritionists?'
        }else if(filter === langs.key.dietitians){
            headLine = 'Find Dietitians near you'
        }else if(filter === langs.key.special_offer){
            headLine = 'Special Offer'
        }else if(filter === langs.key.spa_wellness){
            headLine = 'Popular Spa & Wellness'
        }else if(filter === 'restaurant-top-rated'){
            headLine = 'Top Rated'
        }
        let showDropDown = filter === 'restaurant-top-rated' || filter === langs.key.special_offer  ? false : true
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="yellow-theme common-left-right-padd">
                    <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} showDropdown={showDropDown} />
                    <Layout className="right-parent-block">
                        {/* <SubHeader showAll={false} /> */}
                        <Content className='site-layout'>
                            <div className='wrap-inner full-width-wrap-inner'>
                                <Card
                                    title={headLine}
                                    bordered={false}
                                    className={'home-product-list'}
                                >
                                    <Row gutter={[20, 20]} className='pt-50 fitness-promo'>
                                        {this.renderCard(productListing)}
                                    </Row>
                                </Card>
                                {total_record > 12 && <Pagination
                                    defaultCurrent={1}
                                    defaultPageSize={12} //default size of page
                                    onChange={this.handlePageChange}
                                    total={total_record} //total number of card data available
                                    itemRender={itemRender}
                                    className={'mb-20'}
                                />}
                            </div>
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
    const { auth, common, bookings } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default connect(
    mapStateToProps,
    {searchByRestaurent,popularSpaWellness,getRestaurantSpecialOffer,getDailyDeals,getBookingPromoAPI,openLoginModel, enableLoading, disableLoading}
)(PopularSeeAll);