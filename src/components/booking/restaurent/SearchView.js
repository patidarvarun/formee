import React, { Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../NewSidebar';
import {Pagination, Card, Layout, Row, Col, Typography, Tabs, Button, Breadcrumb, Select } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { langs } from '../../../config/localization';
import {searchByRestaurent, newInBookings, getEventTypes, getFitnessTypes, mostPapularList, getMostViewdData, getBannerById, enableLoading, disableLoading } from '../../../actions/index';
import { papularSearch, getClassfiedCategoryListing, classifiedGeneralSearch, getClassfiedCategoryDetail, openLoginModel, getChildCategory } from '../../../actions';
import RestaurantDetailCard from '../restaurent/RestaurantCard'
import history from '../../../common/History';
import RestaurantSearch from '../common/search-bar/RestaurantSearch'
import GeneralSearch from '../common/search-bar/GeneralSearch'
import EventSearch from '../common/search-bar/EventSearch'

import { CarouselSlider } from '../../common/CarouselSlider'
import SubHeader from '../common/SubHeader'
import NoContentFound from '../../common/NoContentFound'
import { TAB_FILTER } from '../../../config/Config'
import { converInUpperCase } from '../../common'
import { papularView, renderBuyCards } from '../../classified-templates/CommanMethod'
import { renderMostPapularItem } from '../../common/ImageCard'
import { getBookingCatLandingRoute, getBookingSubcategoryRoute, getBookingMapViewRoute } from '../../../common/getRoutes'
const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
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
            mostRecentList: [],
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
            service:'delivery',
            total_records: ''
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
        if ((catIdInitial !== catIdNext) || (subCatIdInitial !== subCatIdNext)) {
            let id = subCatIdNext ? subCatIdNext : catIdNext
            this.getBannerData(id)
            this.getMostRecentData(catIdNext, subCatIdNext)
        }
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        this.props.enableLoading()
        let parameter = this.props.match.params
        let sub_cat_id = this.props.match.params.subCategoryId
        let cat_id = this.props.match.params.categoryId
        this.getMostRecentData(cat_id, sub_cat_id)
        let id = parameter.subCategoryId ? parameter.subCategoryId : parameter.categoryId
        this.getBannerData(id)
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
                const banner = data && data.filter(el => el.moduleId === 3)
                const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
                let temp = [], image;
                    image = top.length !== 0 && top.filter(el => el.subcategoryId == categoryId)
                    temp = image
                    if (temp.length === 0) {
                        image = top.length !== 0 && top.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
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
                title: location.state.multipleChoices ? location.state.multipleChoices.toString().replace(',', ' ') : '',
                selectedItems: location.state.selectedItems,
                selectedItemsName: location.state.multipleChoices,
                total_records: location.state.total_records,
                searchReqData: location.state.searchReqData,
                selectedOption: location.state.selectedOption ?  location.state.selectedOption : ''
            },()=>{
                // this.handlePageChange(1) 
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
    * @method handleSearchResponce
    * @description Call Action for Classified Search
    */
    handleSearchResponce = (res, resetFlag, reqData, total_records) => {
        let cat_id = this.props.match.params.categoryId
        let sub_cat_id = this.props.match.params.subCategoryId
        if (resetFlag) {
            this.setState({ isSearchResult: false });
            this.getMostRecentData(cat_id, sub_cat_id)
        } else {
            this.setState({searchReqData: reqData, bookingList: res, title: reqData.selectedItemsName && reqData.selectedItemsName.toString().split(',').join(' '), total_records: total_records  })
        }
    }

    handlePageChange = (e) => {
        this.props.enableLoading()
        let { searchReqData,title } = this.state
        let reqData = {
            cusines: searchReqData.cusines,
            name: searchReqData.name,
            location: searchReqData.location,
            open_now: searchReqData.open_now,
            userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
            service:searchReqData.service,
            page_size: 9,
            page: e
        }
        this.props.searchByRestaurent(reqData, (res) => {
            this.props.disableLoading()
            if (Array.isArray(res.data.data)) {
                let total_records = res.data && res.data.total
                this.setState({ bookingList: res.data.data, title: title, total_records: total_records  })
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
                                <RestaurantDetailCard
                                    data={data} key={i} slug={parameter.categoryName}
                                    callNext={() => {
                                       this.getMostRecentData(cat_id, sub_cat_id)
                                    }}
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
        this.setState({ sortBy: e })
        let filteredList = bookingList.sort(function (a, b) {
            if (e == 2) {
                if (a.business_name < b.business_name) { return -1; }
                if (a.business_name > b.business_name) { return 1; }
                return 0;
            } else if (e == 3) {
                if (a.business_name > b.business_name) { return -1; }
                if (a.business_name < b.business_name) { return 1; }
                return 0;
            } else if (e == 1) {
                if (a.price > b.price) { return -1; }
                if (a.price < b.price) { return 1; }
                return 0;
            } else {
                if (a.price < b.price) { return -1; }
                if (a.price > b.price) { return 1; }
                return 0;
            }
        })
            this.setState({ bookingList: filteredList })
        }

    /**
     * @method render
     * @description render component
     */
    render() {
        const {selectedOption,total_records, title, eventTypes, dietaries, selectedItems, selectedItemsName, mostRecentList, redirectTo, bookingList, topImages, subCategory, isSearchResult,service } = this.state;
        const parameter = this.props.match.params;
        let cat_id = parameter.categoryId;
        let cat_name = parameter.categoryName;
        let categoryPagePath = getBookingCatLandingRoute(cat_name, cat_id, cat_name)
        let mapPath = `/restaurant-map-view/${cat_name}/${cat_id}`
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                 <Layout className="yellow-theme common-left-right-padd">
                    <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} showDropdown={false}/>
                    <Layout className="right-parent-block">
                        <div className='sub-header fm-details-header'>
                            <Title level={4} className='title'>{'RESTAURANT'}</Title>
                        </div>
                        <div className='inner-banner'>
                            <CarouselSlider bannerItem={topImages} pathName='/' />
                        </div>
                        <Tabs type='card' className={'tab-style1 tab-yellow-style bookings-categories-serach'}>
                            <TabPane tab='Delivery' key='1'>
                                <RestaurantSearch service={service} ref='child' handleSearchResponce={this.handleSearchResponce} selectedOption={selectedOption}/>
                            </TabPane>
                        </Tabs>
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
                                    title={
                                        <span className={'nostyle'}>{converInUpperCase(title)}</span>}
                                    bordered={false}
                                    extra={
                                        <ul className='panel-action'>
                                            <li  title={'List view'} className={'active'}><Icon icon='grid' size='18' /></li>
                                            <li  title={'Map view'}
                                                onClick={() => this.props.history.push(mapPath)}
                                            >
                                                <Icon icon='map' size='18' />
                                            </li>
                                            <li>
                                                <label>{'Sort'}</label>
                                                <Select
                                                    defaultValue={'Recommended'}
                                                    onChange={this.handleSort}
                                                    dropdownMatchSelectWidth={false}
                                                >
                                                    <Option value='0'>Price: Low to High</Option>
                                                    <Option value='1'>Price: High to Low</Option>
                                                    <Option value='2'>Name: A to Z</Option>
                                                    <Option value='3'>Name: Z to A</Option>
                                                </Select>
                                            </li>
                                        </ul>
                                    }
                                    className={'home-product-list header-nospace'}
                                >
                                    {this.renderCard(bookingList)}
                                </Card>
                                { total_records > 12 ? 
                                <Pagination
                                    defaultCurrent={1}
                                    defaultPageSize={12} //default size of page
                                    onChange={this.handlePageChange}
                                    total={total_records} //total number of card data available
                                    itemRender={itemRender}
                                    className={'mb-20'}
                                /> 
                                : ''}
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
    const { auth, classifieds, bookings } = store;
    const { papularSearch } = classifieds
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],
        selectedClassifiedList: classifieds.classifiedsList,
    };
}

export default connect(
    mapStateToProps,
    {searchByRestaurent, newInBookings, getEventTypes, getFitnessTypes, mostPapularList, getClassfiedCategoryListing, enableLoading, disableLoading, classifiedGeneralSearch, getClassfiedCategoryDetail, getBannerById, openLoginModel, getChildCategory, papularSearch, getMostViewdData }
)(withRouter(SearchView));