import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../../sidebar';
import { Layout, Typography, Card, Tabs, Button, Pagination, Row } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { getChildCategory, getClassfiedCategoryListing, getClassfiedCategoryDetail, openLoginModel, enableLoading, disableLoading } from '../../../actions';
import DetailCard from './DetailCard'
import history from '../../../common/History';
import SubHeader from '../../common/SubHeader';
import NoContentFound from '../../common/NoContentFound'
import { TAB_FILTER } from '../../../config/Config'
const { Content } = Layout;
const { Title } = Typography;

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
            productListing: []
        };
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.classified_id
        let catIdNext = nextprops.match.params.classified_id
        let pidInitial = this.props.match.params.pid
        let pidNext = nextprops.match.params.pid
        if (catIdInitial !== catIdNext) {
            this.getClassifiedListing(catIdNext, this.state.page)
        }
        if (pidInitial !== pidNext) {
            this.getClassifiedListing(pidNext, this.state.page)
        }
    }

    /**
     * @method componentWillMount
     * @description called before render component
     */
    componentWillMount() {
        let cat_id = this.props.match.params.classified_id
        if (cat_id === undefined) {
            const { classifiedList } = this.props;
            let filter = this.props.match.params.filter
            let classifiedId = classifiedList && classifiedList.length && classifiedList.map(el => el.id);
            if (classifiedId && classifiedId.length) {
                let id = classifiedId.join(',')
                this.getClassifiedListing(id, this.state.page)
            }
        } else {
            this.getClassifiedListing(cat_id, this.state.page)
            let pid = this.props.match.params.pid
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
        let reqData = {
            id: id,
            page: page,
            page_size: 12,
            filter: filter == 'most-recent' ? TAB_FILTER.MOST_RECENT : TAB_FILTER.TOP_RATED
        }
        this.props.enableLoading()
        this.props.getClassfiedCategoryListing(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                this.setState({ productListing: res.data.data })
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
        if (categoryData && categoryData.length) {
            return (
                <Fragment>
                    <Row gutter={[38, 38]}>
                        {categoryData && categoryData.map((data, i) => {
                            return (
                                <DetailCard data={data} key={i} />
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
    * @description render component
    */
    render() {
        const { isLoggedIn, classifiedList } = this.props;
        let cat_id = this.props.match.params.classified_id
        const { productListing, subCategory } = this.state
        let filter = this.props.match.params.filter
        return (
            <Layout>
                <Layout>
                    <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} />
                    <Layout>
                        <SubHeader
                            subCategory={subCategory}
                            classifiedList={productListing}
                            pid={cat_id}
                        />
                        <Content className='site-layout'>
                            <div className='wrap-inner'>
                                <Card
                                    title={filter == 'most-recent' ? 'Most Recent' : 'Top Rated'}
                                    bordered={false}
                                    className={'seemore-product-list'}
                                >
                                    {this.renderCard(productListing)}
                                </Card>
                                <Pagination
                                    defaultCurrent={1}
                                    defaultPageSize={10} //default size of page
                                    onChange={this.handlePageChange}
                                    total={50} //total number of card data available
                                    itemRender={itemRender}
                                    className={'mb-20'}
                                />
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