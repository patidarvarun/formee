import React, { Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import {Pagination, Card, Layout, Row, Col, Typography, Breadcrumb, Select } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { langs } from '../../../config/localization';
import { newInBookings, getEventTypes, getFitnessTypes, getBannerById, enableLoading, disableLoading } from '../../../actions/index';
import { openLoginModel } from '../../../actions';
import DetailCard from '../common/Card'
import history from '../../../common/History';
import WellBeingFitnessSearch from '../common/search-bar/WellbeingSearch'
import GeneralSearch from '../common/search-bar/GeneralSearch'
// import EventSearch from '../common/search-bar/EventSearch'
import EventSearch from '../common/search-bar/EventListSearch'
import { CarouselSlider } from '../../common/CarouselSlider'
import SubHeader from '../common/SubHeader'
import NoContentFound from '../../common/NoContentFound'
import { converInUpperCase } from '../../common'
import NewSidebar from '../NewSidebar';
import { getBookingCatLandingRoute, getBookingSubcategoryRoute, getBookingMapViewRoute } from '../../../common/getRoutes'
import { findAllByDisplayValue } from '@testing-library/react';
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

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

class SearchView extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            bookingList: [],
            subCategory: [],
            filteredData: [],
            isFilterPage: false,
            isSearchResult: false,
            catName: '',
            isOpen: false,
            searchLatLng: '',
            topRatedList: [],
            papularViewData: [],
            searchReqData: {},
            viewAll: false,
            mostPapular: [],
            bottomImages: [],
            eventTypes: [],
            dietaries: [],
            title: '',
            selectedItems: [],
            selectedItemsName: [],
            total_record: '',
            isSidebarOpen: false
        };
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props
    */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.categoryId
        let catIdNext = nextprops.match.params.categoryId
        let subCatIdInitial = this.props.match.params.subCategoryId
        let subCatIdNext = nextprops.match.params.subCategoryId
        let subCatNameNext = nextprops.match.params.subCategoryName

        if ((catIdInitial !== catIdNext) || (subCatIdInitial !== subCatIdNext)) {
            this.getMostRecentData(catIdNext, subCatIdNext)
            const id = nextprops.match.params.subCategoryId ? nextprops.match.params.subCategoryId : nextprops.match.params.categoryId
            this.getBannerData(id)
            if (subCatNameNext == langs.key.fitness) {
                this.props.getFitnessTypes((res) => { })
            } else if (subCatNameNext == langs.key.caterers || subCatNameNext == langs.key.venues || subCatNameNext == langs.key.entertainment) {
                this.props.getEventTypes({ booking_category_id: subCatIdNext }, (res) => {
                    if (res.status === 200) {
                        this.setState({ eventTypes: res.data.event_types, dietaries: res.data.dietaries })
                    }
                })
            }
        }
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        this.props.enableLoading()
        let parameter = this.props.match.params
        let sub_cat_name = this.props.match.params.subCategoryName;
        let sub_cat_id = this.props.match.params.subCategoryId
        let cat_id = this.props.match.params.categoryId
        let id = parameter.subCategoryId ? parameter.subCategoryId : parameter.categoryId
        this.getBannerData(id)
        this.getMostRecentData(cat_id, sub_cat_id)
        if (sub_cat_name == langs.key.fitness) {
            this.props.getFitnessTypes((res) => {})
        } else if (sub_cat_name == langs.key.caterers || sub_cat_name == langs.key.venues || sub_cat_name == langs.key.entertainment ) {
            this.props.getEventTypes({ booking_category_id: sub_cat_id }, (res) => {
                if (res.status === 200) {
                    this.setState({ eventTypes: res.data.event_types, dietaries: res.data.dietaries })
                }
            })
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
                const banner = data && data.filter(el => el.moduleId === 3 && el.bannerPosition === langs.key.top)
                let temp = [], image;
                    image = banner.length !== 0 && banner.filter(el => el.subcategoryId == categoryId)
                    temp = image
                    if (temp.length === 0) {
                        image = banner.length !== 0 && banner.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
                    }
                this.setState({ topImages: image })
                
            }
        })
    }

    /**
    * @method getMostRecentData
    * @description get most recent booking data
    */
    getMostRecentData = (cat_id, sub_cat_id) => {
        const { isLoggedIn, loggedInDetail, location } = this.props
        
        if (location.state !== undefined) {
            this.setState({
                bookingList: location.state.bookingList,
                // title: location.state.multipleChoices.toString().replace(',', ' '),
                // selectedItems: location.state.selectedItems,
                // selectedItemsName: location.state.multipleChoices,
                total_record: location.state.total_record,
                searchReqData: location.state.searchReqData
            })

        }
    }



    /**
    * @method onTabChange
    * @description manage tab change
    */
    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    };

    /** 
     * @method handleSearchCall
     * @description Call Action for Classified Search
     */
    handleSearchCall = () => {
        this.props.newInBookings(this.state.searchReqData, (res) => {
            if(res.status === 200){
                this.setState({ bookingList: res.data.data})
            }
        })
    }


    /** 
    * @method handleSearchResponce
    * @description Call Action for Classified Search
    */
    handleSearchResponce = (res, resetFlag, reqData, total_record) => {
        const {isLoggedIn, loggedInDetail } = this.props
        
        let cat_id = this.props.match.params.categoryId
        let sub_cat_id = this.props.match.params.subCategoryId
        let sub_cat_name = this.props.match.params.subCategoryName
        if (resetFlag) {
            this.setState({ isSearchResult: false });
            this.getMostRecentData(cat_id, sub_cat_id)
            // const requestData = {
            //     user_id: isLoggedIn ? loggedInDetail.id : '',
            //     page: 1,
            //     per_page: 12,
            //     cat_id,
            //     sub_cat_id,
            //     filter: 'top_rated'
            // }
            // this.props.newInBookings(requestData, (res) => {
            //     if(res.status === 200){
            //         this.setState({ bookingList: res.data.data})
            //     }
            // })
        } else {
            this.setState({
                bookingList: res,
                searchReqData: reqData,
                total_record: total_record,
                // title: sub_cat_name == langs.key.fitness ? reqData.selectedItemsName.toString().split(',').join(' ') : sub_cat_name
            })
        }
    }

    handlePageChange = (e) => {
        const { searchReqData } = this.state
        let reqData = {
            keyword: searchReqData.keyword,
            cat_id: searchReqData.cat_id,
            location: searchReqData.location,
            distance: searchReqData.distance,
            userid: searchReqData.userid,
            per_page: 12,
            page: e ? e : 1,
            fitness_type_ids:searchReqData.fitness_type_ids,
            filter: searchReqData.filter,
            price_min:searchReqData.price_min,
            price_max:searchReqData.price_max,
            from_date:searchReqData.from_date,
            to_date: searchReqData.to_date,
            sub_cat_id: searchReqData.sub_cat_id,
        }
        this.props.newInBookings(reqData, (res) => {
            if(res.status === 200){
                this.setState({ bookingList: res.data.data})
            }
        })
    }


    /**
    * @method renderCard
    * @description render card details
    */
    renderCard = (categoryData) => {
        let parameter = this.props.match.params
        let cat_id = parameter.categoryId
        let sub_cat_id = parameter.subCategoryId
        if (Array.isArray(categoryData) && categoryData.length) {
            let list = this.state.isSearchResult ? categoryData : categoryData.slice(0, 12)
            return (
                <Fragment>
                    <Row gutter={[38, 38]}>
                        {list.map((data, i) => {
                            return (
                                <DetailCard
                                    data={data} key={i} slug={parameter.categoryName}
                                />
                            )
                        })}

                    </Row>
                </Fragment>
            )
        } else {
            return <NoContentFound />
        }
    }

     /**
    * @method handleSort
    * @description handle sort
    */
    handleSort = (e) => {
        const { bookingList } = this.state;
        const { isLoggedIn, loggedInDetail } = this.props
        let parameter = this.props.match.params
        const { searchReqData } = this.state
        let reqData = {
            keyword: searchReqData.keyword,
            cat_id: searchReqData.cat_id,
            location: searchReqData.location,
            distance: searchReqData.distance,
            userid: searchReqData.userid,
            per_page: 12,
            page: e ? e : 1,
            sort: (e === 'price_high' || e === 'price_low') ? 'price' : e ? e : '',
            sort_order: e === 'price_high' ? 'DESC' : 'ASC',

            //extra parameter added 11/01/2021
            fitness_type_ids:searchReqData.fitness_type_ids,
            filter: searchReqData.filter,
            price_min:searchReqData.price_min,
            price_max:searchReqData.price_max,
            from_date:searchReqData.from_date,
            to_date: searchReqData.to_date,
            sub_cat_id: searchReqData.sub_cat_id,
        }
        if(e === 'distance'){
            reqData.lat = isLoggedIn ? loggedInDetail.lat : ''
            reqData.lng = isLoggedIn ? loggedInDetail.lng  : ''
        }
        this.props.newInBookings(reqData, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                this.setState({ bookingList: data })
            }
        })
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const {isSidebarOpen, total_record,data, title, eventTypes, dietaries, selectedItems, selectedItemsName, redirectTo, bookingList, topImages, subCategory, isSearchResult } = this.state;
        const parameter = this.props.match.params;
        
        let total_count = data && data.total
        let cat_id = parameter.categoryId;
        let cat_name = parameter.categoryName;
        let sub_cat_name = parameter.subCategoryName;
        let sub_cat_id = parameter.subCategoryId;
        let isvisible = selectedItemsName && selectedItemsName.length ? true : false

        let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName
        let categoryPagePath = getBookingCatLandingRoute(cat_name, cat_id, cat_name)
        let subCategoryPagePath = getBookingSubcategoryRoute(cat_name, cat_name, cat_id, sub_cat_name, sub_cat_id)
        let mapPath = getBookingMapViewRoute(cat_name, cat_name, cat_id, sub_cat_name, sub_cat_id)
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="yellow-theme common-left-right-padd">
                    {/* <AppSidebar 
                        history={history} 
                        // activeCategoryId={cat_id} 
                        activeCategoryId={sub_cat_id ? sub_cat_id : cat_id}
                        isSubcategoryPage={true} 
                        moddule={1} 
                    /> */}
                     <NewSidebar 
                        history={history} 
                        activeCategoryId={sub_cat_id ? sub_cat_id : cat_id}
                        isSubcategoryPage={true}  
                        moddule={1} 
                        showAll={false}
                        toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
                    />
                    <Layout className="right-parent-block">
                        <SubHeader
                            showAll={false}
                        />
                        <div className='inner-banner'>
                            <CarouselSlider bannerItem={topImages} pathName='/' />
                        </div>
                        {(cat_name === langs.key.wellbeing || cat_name === langs.key.beauty) ? <WellBeingFitnessSearch  isvisible={isvisible} ref='child' selectedItems={selectedItems} selectedItemsName={selectedItemsName} handleSearchResponce={this.handleSearchResponce} tabkey={'2'}/> :
                            (cat_name === langs.key.events) ? <EventSearch dietaries={dietaries} eventTypes={eventTypes} handleSearchResponce={this.handleSearchResponce} /> : <GeneralSearch ref='child' handleSearchResponce={this.handleSearchResponce} />}
                        <Content className='site-layout'>
                            <div className='wrap-inner full-width-wrap-inner'>
                                <Row className='mb-20 ' align="middle">
                                    <Col md={16}>
                                        <Breadcrumb separator='|' className='pt-20 pb-30'>
                                            <Breadcrumb.Item>
                                                <Link to='/'>Home</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to='/bookings'>Bookings</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to={categoryPagePath}>
                                                    {`${converInUpperCase(parameter.categoryName)}`}
                                                </Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to={subCategoryPagePath}>
                                                    {subCategoryName && `${converInUpperCase(subCategoryName)}`}
                                                </Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                Search
                                    </Breadcrumb.Item>
                                        </Breadcrumb>
                                    </Col>
                                    <Col md={8}>
                                        <div className='location-btn'>
                                            {'Melbourne, 3000'} <Icon icon='location' size='15' className='ml-20' />
                                        </div>
                                    </Col>
                                </Row>
                                <Card
                                    title={<span className={'nostyle'}>{subCategoryName && `${converInUpperCase(subCategoryName)}`}</span>}
                                    bordered={false}
                                    extra={
                                        <ul className='panel-action'>
                                            <li className={'active'}  title={'List view'}><Icon icon='grid' size='18' /></li>
                                            {cat_name !== 'events' && <li  title={'Map view'}
                                                onClick={() => this.props.history.push({
                                                    pathname: mapPath,
                                                    state: { selectedItemsName:selectedItemsName }
                                                  })}
                                            >
                                                <Icon icon='map' size='18' />
                                            </li>}
                                            <li>
                                                <label>{'Sort'}&nbsp;&nbsp;</label>
                                                <Select
                                                    defaultValue={'Recommended'}
                                                    onChange={this.handleSort}
                                                    dropdownMatchSelectWidth={false}
                                                >
                                                   <Option value='price_high'>Price (High-Low)</Option>
                                                    <Option value='price_low'>Price (Low-High)</Option>
                                                    <Option value='rating'>Rating</Option>
                                                    <Option value='most_viewed'>Most Reviewed</Option>
                                                    <Option value='name'>Name List A-Z</Option>
                                                    <Option value='distance'>Distance</Option>
                                                </Select>
                                            </li>
                                        </ul>
                                    }
                                    className={'home-product-list header-nospace'}
                                >
                                    {this.renderCard(bookingList)}
                                </Card>
                                {total_record > 12 ? <Pagination
                                    defaultCurrent={1}
                                    defaultPageSize={12} //default size of page
                                    onChange={this.handlePageChange}
                                    total={total_record} //total number of card data available
                                    itemRender={itemRender}
                                    className={'mb-20'}
                                /> : ''}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
                {redirectTo && <Redirect push to={{
                    pathname: redirectTo,
                }}
                />}

            </Layout>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, bookings } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],
    };
}

export default connect(
    mapStateToProps,
    { newInBookings, getEventTypes, getFitnessTypes, enableLoading, disableLoading, getBannerById, openLoginModel }
)(withRouter(SearchView));