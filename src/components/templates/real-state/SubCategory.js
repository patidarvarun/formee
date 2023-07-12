import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../../sidebar';
import {Tabs,Button, Layout, Row, Col, Card, Select, Breadcrumb, Pagination } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { langs } from '../../../config/localization'
import { enableLoading, disableLoading, getBannerById, getChildCategory } from '../../../actions/index';
import {getClassfiedTabListing, getClassfiedCategoryListing, classifiedGeneralSearch, applyClassifiedFilterAttributes, getClassfiedCategoryDetail } from '../../../actions';
import DetailCard from '../../common/Card'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import ChildSubHeader from '../../common/ChildSubHeader'
import NoContentFound from '../../common/NoContentFound'
import { getMapViewRoute, getClassifiedCatLandingRoute } from '../../../common/getRoutes'
import GeneralSearch from '../GeneralSearch';
import { TEMPLATE,TAB_FILTER } from '../../../config/Config';

//New changes 
import { NewCarouselSlider } from '../../common/NewCrousalSlider'
import SideBar from '../../sidebar/ClassifiedSideBar'
import GeneralCard from '../../grid-view-card/GeneralCard'
import JobDetailCard from '../../grid-view-card/JobDetailCard'
const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;


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

class SimpleSubCategory extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            classifiedList: [],
            sortBy: 0,
            searchKey: '',
            isSearch: false,
            filteredData: [],
            isFilterPage: (this.props.location.state !== undefined && this.props.location.state.filterReqData !== undefined) ? true : false,
            distanceOptions: [0, 5, 10, 15, 20],
            selectedDistance: 0,
            isSearchResult: false,
            catName: '',
            searchLatLng: '',
            searchReqData: {},
            filterReqData: {},
            templateName: '',
            tempSlug: '',
            catId: '',
            subCatId: '',
            isSidebarOpen: false,
            displayType: 'grid',
            activTab: '1'
        };
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props
    */
    componentWillReceiveProps(nextprops, prevProps) {
        // this.props.enableLoading()
        let parameter = this.props.match.params
        let catId = parameter.categoryId
        let catIdInitial = parameter.subCategoryId
        let catIdNext = nextprops.match.params.subCategoryId
        if (catIdInitial !== catIdNext && nextprops.match.params.all === undefined) {
            this.props.enableLoading()
            this.getClassifiedListing(catIdNext, this.state.page)
            const id = nextprops.match.params.subCategoryId ? nextprops.match.params.subCategoryId : nextprops.match.params.categoryId
            this.getBannerData(id)
        }
        if ((nextprops.match.params.all === langs.key.all) && (parameter.all === undefined)) {
            this.props.enableLoading()
            this.getAllChildData(catId, this.state.page)
            this.getBannerData(nextprops.match.params.categoryId, nextprops.match.params.all)

        }
    }

    /**
    * @method componentWillMount
    * @description called before render the component
    */
    componentWillMount() {
        this.getAllData()
        let parameter = this.props.match.params;
        let parentId = parameter.categoryId;
        let id = parameter.subCategoryId ? parameter.subCategoryId : parameter.categoryId
        let categoryId = parameter.all === langs.key.all ? parameter.categoryId : id
        this.getChildCategory(parentId)
        this.getBannerData(categoryId, parameter.all)
    }

    /**
    * @method getBannerData
    * @description get banner details by id
    */
    getBannerData = (categoryId, allData) => {
        let parameter = this.props.match.params;
        this.props.enableLoading()
        this.props.getBannerById(3, res => {
            if (res.status === 200) {
                let top = ''
                const data = res.data.success && res.data.success.banners
                const banner = data.filter(el => el.moduleId === 1)
                if (allData === langs.key.all) {
                    top = banner.length !== 0 && banner.filter(el => el.categoryId == categoryId && el.subcategoryId !== '')

                    if (top.length === 0) {
                        top = banner.length !== 0 && banner.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
                    }
                } else {
                    let temp = [];
                    top = banner.length !== 0 && banner.filter(el => el.subcategoryId == categoryId)
                    temp = top
                    if (temp.length === 0) {
                        top = banner.length !== 0 && banner.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
                    }
                }
                this.setState({ topImages: top }, () => {
                    this.props.disableLoading()
                })
            }
            this.props.disableLoading()
        })
    }

    /**
     * @method getAllData
     * @description get all data
     */
    getAllData = () => {
        const { page, isFilterPage } = this.state;
        let parameter = this.props.match.params
        let catIdInitial = this.props.match.params.subCategoryId
        let catId = this.props.match.params.categoryId
        if (isFilterPage && this.props.location.state.filterReqData !== undefined) {
            this.props.applyClassifiedFilterAttributes(this.props.location.state.filterReqData, res => {
                if (res.status === 1) {
                    this.setState({ classifiedList: res.data, templateName: this.props.location.state.templateName, filterReqData: this.props.location.state.filterReqData })
                } else {
                    this.setState({ classifiedList: [], templateName: this.props.location.state.templateName, filterReqData: this.props.location.state.filterReqData })
                }
            })
        } else if (parameter.all === langs.key.all) {
            this.getAllChildData(catId, this.state.page)
        } else {
            this.getClassifiedListing(catIdInitial, page)
        }
    }

    /**
    * @method getAllChildData
    * @description get all child data
    */
    getAllChildData = (catIdInitial, page) => {
        this.props.getChildCategory({ pid: catIdInitial }, res1 => {
            if (res1.status === 200) {
                const data = Array.isArray(res1.data.newinsertcategories) && res1.data.newinsertcategories;
                let childCatId = data && data.length && data.map(el => el.id)
                if (childCatId && childCatId.length) {
                    let allId = childCatId.join(',')
                    this.getClassifiedListing(allId, page)
                }
            }
        })
    }

    /**
     * @method getChildCategory
     * @description get getChildCategory records
     */
    getChildCategory = (id) => {
        this.props.getChildCategory({ pid: id }, res1 => {
            if (res1.status === 200) {
                const data = Array.isArray(res1.data.newinsertcategories) && res1.data.newinsertcategories;
                this.setState({
                    subCategory: data,
                })
            }
        })
    }

    /**
     * @method getMostRecentData
     * @description get most recent records
     */
    getClassifiedListing = (id, page) => {
        const { isLoggedIn, loggedInDetail } = this.props;
        let reqData1 = {
        id: id,
        page: page,
        page_size: 12,
        filter: TAB_FILTER.MOST_RECENT,
        user_id: isLoggedIn ? loggedInDetail.id : "",
        };
        //deep copy
        let reqData2 = Object.assign({}, reqData1);
        reqData2.filter = TAB_FILTER.TOP_RATED

        this.props.getClassfiedTabListing(reqData1, reqData2, (res1, res2) => {
        let mostRecentList = []
        let topRatedList = []
        let tempSlug = '';
        let catName = ''
        let slug = ''
        if (res1.status === 200) {
            mostRecentList = res1.data.data
            tempSlug = res1.data.template_slug
            catName = res1.data.category_name
            slug= res1.data.slug
        }
        console.log('mostRecentList', mostRecentList, slug)
        if (res2.status === 200) {
            topRatedList = res2.data.data
        }
        this.setState({ mostRecentList, topRatedList, 
            tempSlug, catName,
            slug: slug,
            tempSlug: tempSlug,
            catName: catName,
            catId: res1.data.category_id,
            subCatId: res1.data.sub_category_id,
            isSidebarOpen:false
        })
        })
    };

    /**
     * @method onTabChange
     * @description manage tab change
     */
    onTabChange = (key, type) => {
        this.setState({ [type]: key, activTab: key });
    };

    /**
     * @method handlePageChange
     * @description handle page change
     */
    handlePageChange = (e) => {
        let id = this.props.match.params.subCategoryId
        this.getClassifiedListing(id, e)
        this.getAllChildData(id, e)

    }

    /**
     * @method handleSort
     * @description handle sort
     */
    handleSort = (e) => {
        const {isSearchResult, classifiedList, mostRecentList, topRatedList,activTab } = this.state;
        let data = mostRecentList
        if(isSearchResult){
            data = classifiedList
        }else if(activTab == '1'){
            data = mostRecentList
        }else if(activTab == '2'){
            data = topRatedList
        }
        this.setState({ sortBy: e })
        let filteredList = data.sort(function (a, b) {
            if (e == 2) {
                if (a.title < b.title) { return -1; }
                if (a.title > b.title) { return 1; }
                return 0;
            } else if (e == 3) {
                if (a.title > b.title) { return -1; }
                if (a.title < b.title) { return 1; }
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
        if(isSearchResult){
            this.setState({ classifiedList: filteredList })
        }else if(activTab == '1'){
            this.setState({ topRatedList: filteredList })
        }else if(activTab == '2'){
            this.setState({ mostRecentList: filteredList })
        }
    }


    /** 
     * @method handleSearchCall
     * @description Call Action for Classified Search
     */
    handleSearchCall = () => {
        this.props.classifiedGeneralSearch(this.state.searchReqData, (res) => {
            this.setState({ classifiedList: res.data })
        })
    }

    /**
    * @method renderCard
    * @description render cards details
    */
    renderCard = (classifiedList) => {
        const { displayType } = this.state
        if(displayType === 'grid'){
          return this.renderGridView(classifiedList)
        }else {
          return this.renderListView(classifiedList)
        }
    }

     /**
     * @method renderGridView
     * @description render grid view
     */
    renderGridView = (categoryData) => {
        const {slug} = this.state
        if (categoryData && categoryData.length) {
        return (
            <Fragment>
            <Row gutter={[38,38]}>
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
        const { tempSlug, slug } = this.state
        if (categoryData && categoryData.length) {
        if(tempSlug !== 'job'){
            return (
            <Fragment>
                <Row gutter={[0, 0]}>
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
                <Row gutter={[18, 32]}>
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

    /** 
    * @method handleSearchResponce
    * @description Call Action for Classified Search
    */
    handleSearchResponce = (res, resetFlag, reqData) => {
        let params = this.props.match.params
        let catIdInitial = this.props.match.params.subCategoryId
        const { isFilterPage } = this.state
        if (resetFlag === true) {
            this.setState({ isSearchResult: false });
            if (params.all === langs.key.all) {
                this.getAllChildData(params.categoryId, this.state.page)
            }
            this.getClassifiedListing(catIdInitial, this.state.page)
            if (isFilterPage) {
                if (history.location && history.location.state && history.location.state.filterReqData) {
                    const state = { ...history.location.state };
                    delete state.filterReqData;
                    history.replace({ ...history.location, state });
                }
            }
        } else {
            this.setState({ classifiedList: res, isSearchResult: true, searchReqData: reqData })
        }
    }

  
    /**
     * @method render
     * @description render component
     */
    render() {
        const { currentAddress } = this.props
        const {isSearchResult,mostRecentList, topRatedList, displayType,isSidebarOpen,slug, tempSlug, catName, catId, subCatId, classifiedList, topImages, subCategory, redirectTo, isFilterPage} = this.state;
        console.log('slug >>>',slug)
        let templateName = tempSlug
        let parameter = this.props.match.params;
        let parentName = catName
        const location = this.props.location
        let pid = catId
        let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName
        let subCategoryId = subCatId
        let allData = parameter.all === langs.key.all ? true : false
        let path = getMapViewRoute(templateName, parentName, pid, subCategoryName, subCategoryId, allData)
        let categoryPagePath = tempSlug === TEMPLATE.REALESTATE ? location.pathname : getClassifiedCatLandingRoute(templateName, pid, parentName)
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing category-sub-category-landing real-state-sub-category-landing">
                <Layout className="common-left-right-padd">
                    {tempSlug === TEMPLATE.REALESTATE ?
                        <SideBar 
                            history={history} 
                            showBreadCrumb={false}
                            toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
                        /> :
                        <SideBar 
                            history={history} 
                            activeCategoryId={subCategoryId ? subCategoryId : pid} 
                            moddule={1}
                            subCategory={subCategory}
                            toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
                        />
                    }
                    <Layout className="right-parent-block">
                        {/* Conditional Rendering of realestate header */}
                        <div className="inner-banner custom-inner-banner real-state-with-layer4-cat">   
                        {tempSlug === TEMPLATE.REALESTATE ? <ChildSubHeader
                            subCategory={subCategory}
                            classifiedList={classifiedList}
                            pid={pid}
                            parentName={parentName}
                            template={templateName}
                            showBreadCrumb={false}
                            showOnlySubCatName={true}
                            childName={subCategoryName}
                            isSidebarOpen={isSidebarOpen}
                        /> : <ChildSubHeader
                                subCategory={subCategory}
                                classifiedList={classifiedList}
                                pid={pid}
                                parentName={parentName}
                                template={templateName}
                                childName={subCategoryName}
                                isSidebarOpen={isSidebarOpen}
                            />}                     
                            <CarouselSlider bannerItem={topImages} pathName="/" />
                            <GeneralSearch 
                                handleSearchResponce={this.handleSearchResponce} 
                                showMoreOption={true} 
                                template={templateName} 
                                slug={slug}
                            />
                        </div>

                        <Content className='site-layout'>
                            <div className='wrap-inner full-width-wrap-inner pt-0'>
                                <Row className='mb-0'>
                                    <Col md={16}>
                                        <Breadcrumb separator='|'
                                            className='ant-breadcrumb-pad'
                                        >
                                            <Breadcrumb.Item>
                                                <Link to='/'>Home</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to='/classifieds'>Classified</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to={categoryPagePath}>{parentName}</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>{subCategoryName}</Breadcrumb.Item>
                                        </Breadcrumb>
                                    </Col>
                                    {/* {currentAddress ? <Col md={8}>
                                        <div className='location-btn' style={{ marginTop: 30 }}>
                                            {`${currentAddress.city}, ${currentAddress.pincode ? currentAddress.pincode : ''}`} <Icon icon='location' size='15' className='ml-20' />
                                        </div>
                                    </Col> : <Col md={8}> <div className='location-btn' style={{ marginTop: 30 }}>
                                        {'Melbourne, 3000'}  <Icon icon='location' size='15' className='ml-20' />
                                    </div> </Col>} */}
                                </Row>
                                 <div className='wrap-inner full-width-wrap-inner wrap-inner-position-relative pt-0'>
                                    <div className="card-tile-listing">
                                    <Card
                                        bordered={false}
                                        extra={
                                            <ul className='panel-action'>
                                            <li>
                                                <div className='location-name'>
                                                <Icon icon='location' size='20' className='mr-5' />
                                                     {currentAddress ? `${currentAddress.city}` : 'Melbourne City'}
                                                </div>
                                            </li>
                                            <li title={'List view'} className={displayType === 'list' ? 'active' : ''}>
                                                <img src={require('../../dashboard-sidebar/icons/list.png')}  alt='' width='18' onClick={() => this.setState({displayType: 'list'})}/>
                                            </li>
                                            <li title={'List view'} className={displayType === 'grid' ? 'active' : ''} onClick={() => this.setState({displayType: 'grid'})}>
                                                <Icon icon='grid' size='18' />
                                            </li>
                                            <li title={'Map view'} onClick={() => this.props.history.push(path)}>
                                                <Icon icon='map' size='18' />
                                            </li>
                                            <li>
                                                <label className={'mr-10'}>{'Sort'}</label>
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
                                        </Card>
                                    </div>
                                    {!isSearchResult ? (
                                    <Tabs
                                        type="card"
                                        className={"tab-style2"}
                                        onChange={this.onTabChange}
                                    >
                                        <TabPane tab="Most Recent" key="1">
                                        {this.renderCard(mostRecentList)}
                                        <div className="align-center see-all-wrap">
                                            {mostRecentList && mostRecentList.length !== 0 && (
                                            <Button
                                                type="default"
                                                size={"middle"}
                                                onClick={() => {
                                                this.props.history.push(
                                                    `/classifieds/see-more/most-recent/${displayType}/${subCategoryId}`
                                                );
                                                }}
                                            >
                                                {"See All"}
                                            </Button>
                                            )}
                                        </div>
                                        </TabPane>
                                        <TabPane tab="Top Rated" key="2">
                                        {this.renderCard(topRatedList)}
                                        <div className="align-center see-all-wrap">
                                            {topRatedList && topRatedList.length !== 0 && (
                                            <Button
                                                type="default"
                                                size={"middle"}
                                                onClick={() => {
                                                this.props.history.push(
                                                    `/classifieds/see-more/top-rated/${displayType}/${subCategoryId}`
                                                );
                                                }}
                                            >
                                                {"See All"}
                                            </Button>
                                            )}
                                        </div>
                                        </TabPane>
                                    </Tabs>
                                    ) :<div className="serch-list-view-result"> 
                                        {this.renderCard(classifiedList)}
                                    </div>}
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
                {redirectTo && <Redirect push to={{
                    pathname: redirectTo,
                }}
                />}
            </Layout >
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, classifieds, common } = store;
    const { address } = common
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedClassifiedList: classifieds.classifiedsList,
        currentAddress: address
    };
}

export default connect(
    mapStateToProps,
    {getClassfiedTabListing, enableLoading, disableLoading, getClassfiedCategoryListing, applyClassifiedFilterAttributes, getClassfiedCategoryDetail, getBannerById, classifiedGeneralSearch, getChildCategory }
)(SimpleSubCategory);