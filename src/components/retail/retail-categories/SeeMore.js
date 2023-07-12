import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AppSidebar from '../Sidebar';
import DailyDealsCard from './DailyDealsCard';
import { Button, Layout, Card, Pagination, Row, Typography, Col } from 'antd';
import Icon from '../../customIcons/customIcons';
import { retailPopularItems,getRetailList, enableLoading, disableLoading, retailDailyDeals } from '../../../actions';
import DetailCard from '../../common/Card'
import history from '../../../common/History';
import SubHeader from '../SubHeader';
import { TAB_FILTER } from '../../../config/Config'
import NoContentFound from '../../common/NoContentFound'
import PostAdPermission from '../../classified-templates/PostAdPermission'
import GeneralCard from '../../grid-view-card/GeneralCard'
import Sidebar from '../NewSidebar'
const { Content } = Layout;
const { Title, Paragraph } = Typography;

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

class SeeMorePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            retailList: [],
            page: 1,
            productListing: [],
            total: '',
            dailyDeals: [],
            total: '',
            displayType: this.props.match.params.display_type ? this.props.match.params.display_type : 'grid'
        };
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        let filter = this.props.match.params.filter
        let cat_id = this.props.match.params.categoryId
        this.props.enableLoading()
        if (filter === 'daily-deals') {
            this.getDailyDeals('')
        }else if (filter === 'popular-view'){
           this.getMostPopularData(cat_id)
        } else {
            this.getDataList()
        }
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props from components
    */
    componentWillReceiveProps(nextprops, prevProps) {
        let filter = nextprops.match.params.filter
        let catIdInitial = this.props.match.params.categoryId
        let catIdNext = nextprops.match.params.categoryId
        if (catIdInitial !== catIdNext) {
            if (filter === 'daily-deals') {
                this.getDailyDeals('')
            }else if (filter === 'popular-view'){
                this.getMostPopularData(catIdNext)
             }  else {
                this.getRetailListing(catIdNext, this.state.page)
                this.getDataList()
            }
        }
    }

    /**
    * @method getMostPopularData
    * @description get most papular data
    */
    getMostPopularData = (cat_id) => {
        let reqData = {
        category_id: cat_id
        }
        this.props.retailPopularItems(reqData,res => {
            this.props.disableLoading()
        if (res.status === 200) {
            const data = res.data.data && res.data.data.data
            let pupularList = Array.isArray(data) && data.length ? data.slice(0,12) : []
            this.setState({productListing: pupularList })
        }
    })
    }

    /**
     * @method getDailyDeals
     * @description get daily deals records
     */
    getDailyDeals = (id) => {
        let reqData = {
            category_id: id
        }
        this.props.retailDailyDeals(reqData, res => {
            this.props.disableLoading()

            if (res.status === 200) {
                let data = res.data.data && res.data.data.data

                this.setState({ dailyDeals: data, total: res.data.data.total })
            }
        })
    }

    /**
    * @method getDataList
    * @description get data list
    */
    getDataList = () => {
        let cat_id = this.props.match.params.categoryId
        if (cat_id === undefined) {
            const { retailList } = this.props;
            let classifiedId = retailList && retailList.length && retailList.map(el => el.id);
            if (classifiedId && classifiedId.length) {
                let id = classifiedId.join(',')
                this.setState({ allId: id })
                this.getRetailListing(id, this.state.page)
            }
        } else {
            this.getRetailListing(cat_id, this.state.page)
        }
    }

    /**
    * @method getRetailListing
    * @description get classified listing
    */
    getRetailListing = (id, page) => {
        let filter = this.props.match.params.filter
        let title = ''
        if (filter === 'top-rated') {
            title = 'top_rated'
        } else if (filter === 'best-sellers') {
            title = 'best_seller'
        } else if (filter === 'recently-viewed') {
            title = 'recently_viewed'
        } else if (filter === 'most-recent') {
            title = 'most_recent'
        }
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData = {
            id: id,
            page: page,
            page_size: 12,
            filter: title,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getRetailList(reqData, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                const retail = Array.isArray(res.data.data) ? res.data.data : []
                const newInRetail = retail.length ? retail : [];
                this.setState({ productListing: newInRetail, total: res.data.total_count })
            }
        })
    }

    /**
    * @method handlePageChange
    * @description handle page change
    */
    handlePageChange = (e) => {
        const { retailList } = this.props
        let cat_id = this.props.match.params.categoryId
        if (cat_id === undefined) {
            const { retailList } = this.props;
            let classifiedId = retailList && retailList.length && retailList.map(el => el.id);
            if (classifiedId && classifiedId.length) {
                let id = classifiedId.join(',')
                this.setState({ allId: id })
                this.getRetailListing(id, e)
            }
        } else {
            this.getRetailListing(cat_id, e)
        }
    }

     /**
     * @method renderCard
     * @description render card details
     */
    renderCard = (categoryData) => {
        const { displayType } = this.state
        console.log('displayType', displayType, this.props.match.params)
        if(displayType === 'grid'){
            return this.renderGridView(categoryData)
        }else {
            return this.renderListView(categoryData)
        }
    };

    /**
     * @method renderGridView
     * @description render grid view
     */
    renderGridView = (categoryData) => {
        if (categoryData && categoryData.length) {
        return (
            <Fragment>
            <Row gutter={[38,38]}>
                {categoryData &&
                categoryData.map((data, i) => {
                    return (
                    <DetailCard
                        data={data}
                        retail={true}
                        key={i}
                    />
                    );
                })}
            </Row>
            </Fragment>
        );
        } else {
        return <NoContentFound />;
        }
    }

    /**
     * @method renderListView
     * @description render list view
     */
    renderListView = (categoryData) => {
        const { tempSlug } = this.state
        if (categoryData && categoryData.length) {
            return (
            <Fragment>
                <Row gutter={[0,0]}>
                {categoryData &&
                    categoryData.map((data, i) => {
                    return (
                        <GeneralCard
                        data={data}
                        key={i}
                        retail={true}
                        />
                    );
                    })}
                </Row>
            </Fragment>
            );
        }else {
        return <NoContentFound />
        };
    }
    
    /**
    * @method renderDailyDeals
    * @description render massage daily deals
    */
    renderDailyDeals = () => {
        const { dailyDeals } = this.state
        if (dailyDeals && Array.isArray(dailyDeals) && dailyDeals.length) {
            return dailyDeals.map((el, i) => {
                return (
                    <Col className='gutter-row' md={8} key={i}>
                        <DailyDealsCard data={el} type={'retail'} />
                    </Col>
                )
            })
        }
    }


    render() {
        let parameter = this.props.match.params
        let cat_id = parameter.categoryId
        let catName = parameter.categoryName
        const {isSidebarOpen, productListing, total } = this.state

        let filter = parameter.filter
        let title = 'Most Recent'
        if (filter === 'top-rated') {
            title = 'Top Rated'
        } else if (filter === 'best-sellers') {
            title = 'Best Sellers'
        } else if (filter === 'daily-deals') {
            title = 'Daily Deals'
        } else if (filter === 'recently-viewed') {
            title = 'Recently Viewed'
        } else if (filter === 'most-recent') {
            title = 'Most Recent'
        }else if (filter === 'popular-view'){
            title = 'Most Popular'
        }
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="retail-theme common-left-right-padd">
                    {/* <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} /> */}
                    <Sidebar 
                        history={history} 
                        activeCategoryId={cat_id} 
                        moddule={1} 
                        subCategoryPage={true}
                        toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
                    />
                    <Layout className="right-parent-block see-more-result">
                        <div>
                            <Title level={4} className='title main-heading-bookg'>{catName} &nbsp;<span className='sep'>|</span><span className='child-sub-category'>&nbsp;&nbsp;{title}</span></Title>
                        </div>
                        {/* {cat_id ? <SubHeader
                            parameter={parameter}
                        /> : <div className='sub-header'>
                                <Title level={4} className='title'>{'Retail'}</Title>
                                <PostAdPermission  history={history} title={'Start selling'}/>
                            </div>} */}
                        <Content className='site-layout'>
                            <div className='wrap-inner full-width-wrap-inner'>
                                <Card
                                    // title={title}
                                    bordered={false}
                                    className={'seemore-product-list'}
                                >
                                    {filter === 'daily-deals' ? this.renderDailyDeals() : this.renderCard(productListing)}
                                </Card>
                                {total > 12 && <Pagination
                                    defaultCurrent={1}
                                    defaultPageSize={12} //default size of page
                                    onChange={this.handlePageChange}
                                    total={total} //total number of card data available
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
    const { auth, common } = store;
    const { categoryData } = common;
    let retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        retailList,
    };
}

export default connect(
    mapStateToProps,
    {retailPopularItems, getRetailList, enableLoading, disableLoading, retailDailyDeals }
)(SeeMorePage);