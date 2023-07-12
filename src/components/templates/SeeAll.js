import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AppSidebar from '../sidebar';
import {Row, Layout, Card, Pagination, Typography} from 'antd';
import Icon from '../../components/customIcons/customIcons';
import {getMostViewdData, getChildCategory, openLoginModel, enableLoading, disableLoading } from '../../actions';
import history from '../../common/History';
import DetailCard from '../common/DetailCard'
import PostAdPermission from './PostAdPermission'
import { langs } from '../../config/localization';
import GeneralCard from '../grid-view-card/GeneralCard'
import JobDetailCard from '../grid-view-card/JobDetailCard'
import NoContentFound from '../common/NoContentFound'
import SideBar from '../sidebar/ClassifiedSideBar'
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
            classifiedList: [],
            page: 1,
            productListing: [],
            permission: false,
            isSidebarOpen: false,
            total: 0,
            displayType: this.props.match.params.display_type ? this.props.match.params.display_type : 'grid'
        };
    }

    /**
     * @method componentWillMount
     * @description called before mount the component
     */
    componentWillMount() {
        this.props.enableLoading()
        this.getAllRecords()
    }

    /**
     * @method getAllRecords
     * @description get all records
     */
    getAllRecords = () => {
        const cat_id = this.props.match.params.categoryId
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

    /**
     * @method componentWillReceiveProps
     * @description receive props from component
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.categoryId
        let catIdNext = nextprops.match.params.categoryId
        if (catIdInitial !== catIdNext) {
            this.getClassifiedListing(catIdNext, this.state.page)
        }
    }

    /**
     * @method getClassifiedListing
     * @description render classified papuler item list
     */
    getClassifiedListing = (id, page) => {
        this.props.enableLoading()
        const { isLoggedIn,loggedInDetail } = this.props
        const requestData = {
            category_id: id,
            module_type:langs.key.classified,
            user_id:isLoggedIn ? loggedInDetail.id : '',
            page: page,
            page_size: 12,
          }
        this.props.getMostViewdData(requestData, res => {
            if (res.status === 200) {
                this.props.disableLoading()
                const data = res.data.data.classifiedMostViewed;
                this.setState({productListing: data, total: res.data.count})
            }
        })
    }

    handlePageChange = (e) => {
        let id = this.props.match.params.categoryId
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
    * @method renderCard
    * @description render card details
    */
    renderGridView = (categoryData) => {
        if (categoryData && categoryData.length) {
            const parameter = this.props.match.params
            const tempalteName = parameter.templateName
            return (
                <DetailCard 
                    destructuredKey={{
                        catIdkey: 'parent_categoryid',
                        subCatIdKey: 'id',
                        catname: 'parentCategoryName'
                    }}
                    flag={{wishlist:'wishlist'}}
                    topData={categoryData} 
                    callNext={() => this.getAllRecords()}
                />
            )
        } 
    }

    /**
     * @method renderListView
     * @description render list view
     */
    renderListView = (categoryData) => {
        const { tempSlug } = this.state
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


    /**
     * @method render
     * @description render components
     */
    render() {
        const {total,isSidebarOpen, productListing, subCategory } = this.state
        let categoryName = this.props.match.params.categoryName
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing category-sub-category-landing">
                <Layout className="common-left-right-padd">
                    {/* <AppSidebar history={history} activeCategoryId={cat_id}/> */}
                    <SideBar
                        history={history}
                        showAll={false}
                        toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
                    />
                    <Layout className="right-parent-block see-more-result">                       
                        <div>
                            {/* <Title level={4} className='title'>{categoryName}</Title> */}
                            <Title level={4} className='title main-heading-bookg'>{categoryName}<span className='sep'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><span className='child-sub-category'>{'Most Popular'}</span></Title>
                             {/* <PostAdPermission  history={history}/> */}
                        </div>
                        <Content className='site-layout'>
                            {/* <div className='wrap-inner'>    */}
                            <div className='wrap-inner full-width-wrap-inner'>
                                <Card
                                    // title={'Most Popular'}
                                    bordered={false}
                                    className={'home-product-list'}
                                >
                                    {this.renderCard(productListing)}
                                </Card>
                                {total && total > 12 && <Pagination
                                    defaultCurrent={1}
                                    defaultPageSize={12} //default size of page
                                    onChange={this.handlePageChange}
                                    total={50} //total number of card data available
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
    { getChildCategory, openLoginModel, enableLoading, disableLoading, getMostViewdData }
)(SeeMorePage);