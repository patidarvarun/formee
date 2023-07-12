import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import {Typography, Col, Layout, Card, Pagination, Row } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { getDailyDeals, getChildCategory, newInBookings, getClassfiedCategoryDetail, openLoginModel, enableLoading, disableLoading } from '../../../actions';
import DetailCard from '../common/Card'
import history from '../../../common/History';
import SubHeader from '../common/SubHeader';
import { TAB_FILTER } from '../../../config/Config'
import NoContentFound from '../../common/NoContentFound'
import DailyDealsCard from '../common/DailyDealsCard';
import { langs } from '../../../config/localization';
import NewSidebar from '../NewSidebar';
import ChildSubHeader from '../common/SubHeader'
const { Content } = Layout;
const { Title } = Typography

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

class SeeMore extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            bookingList: [],
            page: 1,
            productListing: [],
            data: '',
            dailyDealsData: [],
            total_record: 10,
            isSidebarOpen: false
        };
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        let catIdInitial = this.props.match.params.categoryId
        let filter = this.props.match.params.filter
        if (filter === langs.key.dailyDeals) {
            this.getDailyDealsRecord(catIdInitial, 1)
        } else {
            this.getBookingListing(catIdInitial, this.state.page)
        }
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props from components
    */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.categoryId
        let catIdNext = nextprops.match.params.categoryId
        let filter = nextprops.match.params.filter
        if (catIdInitial !== catIdNext) {
            if (filter === langs.key.dailyDeals) {
                this.getDailyDealsRecord(catIdNext, 1)
            } else {
                this.getBookingListing(catIdNext, this.state.page)
                this.getDataList()
            }
        }
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
        this.props.enableLoading()
        this.props.getDailyDeals(requestData, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                let item = res.data && res.data.data

                let dailyDeals = item && item.data && Array.isArray(item.data) && item.data.length ? item.data : []
                this.setState({ dailyDealsData: dailyDeals, total_record: item.total })
            }
        })
    }


    /**
    * @method getBookingListing
    * @description get classified listing
    */
    getBookingListing = (id, page) => {
        this.props.enableLoading()
        let filter = this.props.match.params.filter
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData = {
            cat_id: id,
            page: page,
            per_page: 12,
            filter: filter == 'most-recent' ? TAB_FILTER.MOST_RECENT : filter == 'most-popular' ? 'most_popular' : TAB_FILTER.TOP_RATED,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.newInBookings(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                this.setState({ bookingList: data, total_record: res.data.total })
            }
        })
    }

    /**
    * @method handlePageChange
    * @description handle page change
    */
    handlePageChange = (e) => {
        let id = this.props.match.params.categoryId
        let filter = this.props.match.params.filter
        if (filter === langs.key.dailyDeals) {
            this.getDailyDealsRecord(id, e)
        } else {
            this.getBookingListing(id, e)
        }
    }

    /**
    * @method renderCard
    * @description render card details
    */
    renderCard = (categoryData) => {
        if (categoryData && categoryData.length) {
            return (
                <Fragment>
                    <Row gutter={[38, 38]}>
                        {categoryData && categoryData.map((data, i) => {
                            return (
                                <DetailCard
                                    data={data} key={i}
                                    handyman={'handyman'}
                                    callNext={() => this.getDataList()}
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
    * @method renderDailyDeals
    * @description render massage daily deals
    */
    renderDailyDeals = () => {
        const { dailyDealsData } = this.state
        if (Array.isArray(dailyDealsData) && dailyDealsData.length) {
            return (
                <Fragment>
                    <Row gutter={[38, 38]}>
                        {dailyDealsData && dailyDealsData.map((data, i) => {
                            return (
                                <Col className='gutter-row' md={8}>
                                    <DailyDealsCard data={data} />
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

    /**
    * @method render
    * @description render the component
    */
    render() {
        let cat_id = this.props.match.params.categoryId
        let cat_name = this.props.match.params.categoryName
        const { bookingList, subCategory, data, total_record, isSidebarOpen } = this.state
        let title = '';
        let filter = this.props.match.params.filter
        if (filter === 'most-popular') {
            title = 'Most Popular'
        } else if (filter === langs.key.dailyDeals) {
            title = 'Daily Deals'
        } else if (filter == 'most-recent') {
            title = 'Most Recent'
        } else {
            title = 'Top Rated'
        }
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="yellow-theme">
                    <Layout>
                        {/* <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} /> */}
                        <NewSidebar
                            history={history}
                            activeCategoryId={cat_id}
                            categoryName={cat_name}
                            isSubcategoryPage={true}
                            // showAll={true}
                            toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
                        />
                        <Layout className="right-parent-block see-more-result test">
                            {/* <SubHeader
                                subCategory={subCategory}
                                showAll={filter === langs.key.dailyDeals ? false : true}
                            /> */}
                            <div>
                                <Title level={4} className='title main-heading-bookg'>{cat_name}<span className='sep'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><span className='child-sub-category'>{title}</span></Title>
                            </div>
                            <Content className='site-layout'>
                                <div className='wrap-inner full-width-wrap-inner'>
                                    <Card
                                        // title={title}
                                        bordered={false}
                                        className={'home-product-list'}
                                    >
                                        {filter === langs.key.dailyDeals ? this.renderDailyDeals() : this.renderCard(bookingList)}
                                    </Card>
                                    {total_record && total_record > 12 &&
                                        <Pagination
                                            defaultCurrent={1}
                                            defaultPageSize={12} //default size of page
                                            onChange={this.handlePageChange}
                                            total={total_record && total_record} //total number of card data available
                                            itemRender={itemRender}
                                            className={'mb-20'}
                                        />
                                    }
                                </div>

                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, classifieds, common } = store;
    const { savedCategories, categoryData } = common;
    let classifiedList = []
    let isEmpty = savedCategories.data.booking.length === 0 && savedCategories.data.retail.length === 0 && savedCategories.data.classified.length === 0 && (savedCategories.data.foodScanner === '' || (Array.isArray(savedCategories.data.foodScanner) && savedCategories.data.foodScanner.length === 0))
    if (auth.isLoggedIn) {
        if (!isEmpty) {
            isEmpty = false
            classifiedList = savedCategories.data.classified && savedCategories.data.classified.filter(el => el.pid === 0);
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
        selectedClassifiedList: classifieds.classifiedsList,
        classifiedList,
        isEmpty

    };
}

export default connect(
    mapStateToProps,
    { getDailyDeals, getChildCategory, newInBookings, getClassfiedCategoryDetail, openLoginModel, enableLoading, disableLoading }
)(SeeMore);