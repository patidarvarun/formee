import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AppSidebar from '../../sidebar';
import { Layout, Card, Pagination, Row } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { getChildCategory, getClassfiedCategoryListing, getClassfiedCategoryDetail, openLoginModel, enableLoading, disableLoading } from '../../../actions';
import DetailCard from '../../common/Card'
import history from '../../../common/History';
import SubHeader from '../../common/SubHeader';
import { TAB_FILTER } from '../../../config/Config'
import NoContentFound from '../../common/NoContentFound'
const { Content } = Layout;

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

class SeeAllUserAd extends React.Component {

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
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        this.props.enableLoading()
        this.getDataList()
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
            user_id: isLoggedIn ? loggedInDetail.id : ''
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
                                    defaultPageSize={12} //default size of page
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
        selectedClassifiedList: classifieds.classifiedsList,
        classifiedList,
        isEmpty

    };
}

export default connect(
    mapStateToProps,
    { getChildCategory, getClassfiedCategoryListing, getClassfiedCategoryDetail, openLoginModel, enableLoading, disableLoading }
)(SeeAllUserAd);