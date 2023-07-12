import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import {Typography, Col, Layout, Card, Pagination, Row } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { getDailyDeals, newInBookings, openLoginModel, enableLoading, disableLoading } from '../../../actions';
import DetailCard from '../common/Card'
import history from '../../../common/History';
import SubHeader from '../common/SubHeader';
import NoContentFound from '../../common/NoContentFound'
import { TAB_FILTER } from '../../../config/Config'
import { langs } from '../../../config/localization';
import DailyDealsCard from '../common/DailyDealsCard';
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

    //Common see more page
    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            bookingList: [],
            page: 1,
            productListing: [],
            data: '',
            sub_cat_id: '', cat_id: '',
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
        let cat_id = this.props.match.params.categoryId
        let sub_cat_id = this.props.match.params.subCategoryId
        let filter = this.props.match.params.filter
        if (filter === langs.key.dailyDeals) {
            this.getDailyDealsRecord(cat_id, sub_cat_id, 1)
        } else {
            this.getDataList(cat_id, sub_cat_id, 1)
        }
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props from components
    */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.categoryId
        let catIdNext = nextprops.match.params.categoryId
        let subCatIdInitial = this.props.match.params.subCategoryId
        let subCatIdNext = nextprops.match.params.subCategoryId
        let filter = nextprops.match.params.filter
        if (subCatIdInitial !== subCatIdNext) {
            if (filter === langs.key.dailyDeals) {
                this.getDailyDealsRecord(catIdNext, subCatIdNext, 1)
            } else {
                this.getDataList(catIdNext, subCatIdNext, 1)
            }
        }
    }

    /**
      * @method getDailyDealsRecord
      * @description get daily deals records
      */
    getDailyDealsRecord = (id, sub_cat_id, page) => {
        this.setState({ cat_id: id, sub_cat_id: sub_cat_id })
        let requestData = {
            category_id: id,
            sub_category_id: sub_cat_id,
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
    * @method getDataList
    * @description get data list
    */
    getDataList = (cat_id, subcat_id, page) => {
        this.props.enableLoading()
        this.setState({ cat_id: cat_id, sub_cat_id: subcat_id })
        const { isLoggedIn, loggedInDetail } = this.props
        let filter = this.props.match.params.filter
        const requestData = {
            user_id: isLoggedIn ? loggedInDetail.id : '',
            page: page,
            per_page: 12,
            cat_id: cat_id,
            sub_cat_id: subcat_id,
            filter: filter == langs.key.dailyDeals ? '' : TAB_FILTER.TOP_RATED,
        }
        this.props.newInBookings(requestData, res => {
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
        const { cat_id, sub_cat_id } = this.state
        let filter = this.props.match.params.filter
        if (filter === langs.key.dailyDeals) {
            this.getDailyDealsRecord(cat_id, sub_cat_id, e)
        } else {
            this.getDataList(cat_id, sub_cat_id, e)
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
                                <Col className='gutter-row' md={6}>
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

    render() {
        let cat_id = this.props.match.params.categoryId
        let cat_name = this.props.match.params.categoryName
        const { bookingList, data, total_record, isSidebarOpen } = this.state
        let filter = this.props.match.params.filter
        let title = filter === langs.key.dailyDeals ? 'Daily Deals' : 'Top Rated'
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="yellow-theme common-left-right-padd">
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
                        {/* <SubHeader showAll={false} /> */}
                        <div>
                            <Title level={4} className='title main-heading-bookg'>{cat_name}<span className='sep'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><span className='child-sub-category'>{title}</span></Title>
                        </div>
                        <Content className='site-layout'>
                            <div className='wrap-inner full-width-wrap-inner'>
                                <Card
                                    // title={filter === langs.key.dailyDeals ? 'Daily Deals' : 'Top Rated'}
                                    bordered={false}
                                    className={'home-product-list'}
                                >
                                    {filter === langs.key.dailyDeals ? this.renderDailyDeals() : this.renderCard(bookingList)}
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
            </Layout>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default connect(
    mapStateToProps,
    { getDailyDeals, newInBookings, openLoginModel, enableLoading, disableLoading }
)(SeeMore);