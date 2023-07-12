import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AppSidebar from '../../sidebar';
import {Select,Typography, Layout, Card, Pagination, Row } from 'antd';
import Icon from '../../customIcons/customIcons';
import { getChildCategory, getClassfiedCategoryListing, getClassfiedCategoryDetail, openLoginModel, enableLoading, disableLoading } from '../../../actions';
import DetailCard from '../../common/Card'
import history from '../../../common/History';
import SubHeader from '../../common/SubHeader';
import { TAB_FILTER } from '../../../config/Config'
import NoContentFound from '../../common/NoContentFound'
import GeneralCard from '../../grid-view-card/GeneralCard'
import JobDetailCard from '../../grid-view-card/JobDetailCard'
import PostAdPermission from '../../classified-templates/PostAdPermission'

import SideBar from '../../sidebar/ClassifiedSideBar'
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select

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
            classifiedList: [],
            page: 1,
            productListing: [],
            tempSlug: '',
            catName: '',
            displayType: this.props.match.params.display_type ? this.props.match.params.display_type : 'grid',
            isSidebarOpen: false,
            total: 0
        };
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        this.props.enableLoading()
        this.getDataList()
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props from components
    */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.classified_id
        let catIdNext = nextprops.match.params.classified_id
        let pidInitial = this.props.match.params.pid
        let pidNext = nextprops.match.params.pid
        if (catIdInitial !== catIdNext) {
            this.getClassifiedListing(catIdNext, this.state.page)
            this.getDataList()
        }
        if (pidInitial !== pidNext) {
            this.getClassifiedListing(pidNext, this.state.page)
        }
    }

    /**
    * @method getDataList
    * @description get data list
    */
    getDataList = () => {
        let cat_id = this.props.match.params.classified_id
        if (cat_id === undefined) {
            const { classifiedList } = this.props;
            let filter = this.props.match.params.filter
            let classifiedId = classifiedList && classifiedList.length && classifiedList.map(el => el.id);
            if (classifiedId && classifiedId.length) {
                let id = classifiedId.join(',')
                this.setState({ allId: id })
                this.getClassifiedListing(id, this.state.page)
            }
        } else {
            this.getClassifiedListing(cat_id, this.state.page)
            if (cat_id) {
                this.props.getChildCategory({ pid: cat_id }, res1 => {
                    if (res1.status === 200) {
                        const data = Array.isArray(res1.data.newinsertcategories) && res1.data.newinsertcategories;
                        this.setState({
                            subCategory: data,
                        })
                    }
                })
            }
        }
    }

    /**
    * @method getClassifiedListing
    * @description get classified listing
    */
    getClassifiedListing = (id, page) => {
        let filter = this.props.match.params.filter
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData = {
            id: id,
            page: page,
            page_size: 12,
            filter: filter == 'most-recent' ? TAB_FILTER.MOST_RECENT : TAB_FILTER.TOP_RATED,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getClassfiedCategoryListing(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                this.setState({
                    productListing: res.data.data,
                    tempSlug: res.data.template_slug,
                    catName: res.data.category_name,
                    slug: res.data.slug,
                    total: res.data.count
                })
            }
        })
    }

    /**
    * @method handlePageChange
    * @description handle page change
    */
    handlePageChange = (e) => {
        let id = this.props.match.params.classified_id
        let pid = this.props.match.params.pid
        if (pid) {
            this.getClassifiedListing(pid, e)
        } else {
            this.getClassifiedListing(id, e)
        }
    }

    /**
     * @method renderCard
     * @description render card details
     */
    renderCard = (categoryData) => {
        const { displayType } = this.state
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
        const { slug } = this.state
        if (categoryData && categoryData.length) {
        return (
            <Fragment>
            <Row gutter={[18, 32]}>
                {categoryData &&
                categoryData.map((data, i) => {
                    return (
                    <DetailCard
                        data={data}
                        key={i}
                        slug={slug}
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
        const { tempSlug, slug} = this.state
        if (categoryData && categoryData.length) {
        if(tempSlug !== 'job'){
            return (
            <Fragment>
                <Row gutter={[0,0]}>
                {categoryData &&
                    categoryData.map((data, i) => {
                    return (
                        <GeneralCard
                        data={data}
                        key={i}
                        tempSlug={tempSlug}
                        slug={slug}
                        />
                    );
                    })}
                </Row>
            </Fragment>
            );
        }else {
            return (
            <Fragment>
                <Row gutter={[0,0]}>
                {categoryData &&
                    categoryData.map((data, i) => {
                    return (
                        <JobDetailCard
                        data={data}
                        key={i}
                        tempSlug={tempSlug}
                        slug={slug}
                        />
                    );
                    })}
                </Row>
            </Fragment>
            );
        }
        } else {
        return <NoContentFound />;
        }
    }

    render() {
        const { isLoggedIn, classifiedList } = this.props;
        let cat_id = this.props.match.params.classified_id
        const {total,displayType, isSidebarOpen, productListing, subCategory, catName,tempSlug } = this.state
        let filter = this.props.match.params.filter
        let title = filter == 'most-recent' ? 'Most Recent' : 'Top Rated'
        return (
            <Layout className='common-sub-category-landing booking-sub-category-landing category-sub-category-landing'>
                <Layout className='common-left-right-padd'>
                    <SideBar
                        history={history}
                        showAll={false}
                        toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
                    />
                    <Layout className='right-parent-block see-more-result'>
                        <div>
                            <Title level={4} className='title main-heading-bookg'>{catName}<span className='sep'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><span className='child-sub-category'>{title}</span></Title>
                        </div>
                        <Content className='site-layout'>
                            <div className='wrap-inner full-width-wrap-inner'>
                                <Card
                                    bordered={false}
                                    className={'seemore-product-list'}
                                >
                                    {this.renderCard(productListing)}
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
    { getChildCategory, getClassfiedCategoryListing, getClassfiedCategoryDetail, openLoginModel, enableLoading, disableLoading }
)(SeeMorePage);