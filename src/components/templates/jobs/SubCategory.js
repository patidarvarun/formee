import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../../sidebar';
import { Layout, Typography, Row, Col, Tabs, Form, Select, Breadcrumb, Card, Pagination } from 'antd';
import Icon from '../../customIcons/customIcons';
import { getBannerById, classifiedGeneralSearch, applyClassifiedFilterAttributes, getChildCategory, enableLoading, disableLoading, getClassfiedCategoryListing, getClassfiedCategoryDetail } from '../../../actions/index';
import DetailCard from './DetailCard'
import { langs } from '../../../config/localization'
import history from '../../../common/History';
import { getClassifiedCatLandingRoute, getFilterRoute } from '../../../common/getRoutes'
import { CarouselSlider } from '../../common/CarouselSlider'
import NoContentFound from '../../common/NoContentFound';
import SubHeader from '../../common/ChildSubHeader'
//import GeneralSearch from '../../common/GeneralClassifiedSearch';
import GeneralSearch from '../GeneralSearch';

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

class SubCategory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMoreOption: true,
            key: 'tab1',
            noTitleKey: 'app',
            classifiedList: [],
            sortBy: 0,
            subCategory: [],
            searchKey: '',
            isSearch: false,
            filteredData: [],
            isFilterPage: (this.props.location.state === undefined) ? false : true,
            distanceOptions: [0, 5, 10, 15, 20],
            selectedDistance: 0,
            isSearchResult: false,
            catName: '',
            searchLatLng: '',
            isSearchResult: false,
            searchReqData: {},
            filterReqData: {},
            templateName: '',
            tempSlug: '',
            catId: '',
            subCatName: '',

        };
    }

    /**
      * @method componentWillReceiveProps
      * @description receive props
      */
    componentWillReceiveProps(nextprops, prevProps) {
        let parameter = this.props.match.params
        let catId = this.props.match.params.categoryId
        let catIdInitial = this.props.match.params.subCategoryId
        let catIdNext = nextprops.match.params.subCategoryId
        if (catIdInitial !== catIdNext && nextprops.match.params.all === undefined) {
            this.props.enableLoading()
            this.getClassifiedListing(catIdNext, this.state.page)
            const id = nextprops.match.params.subCategoryId ? nextprops.match.params.subCategoryId : nextprops.match.params.categoryId
            this.getBannerData(id)
        }
        if ((nextprops.match.params.all === langs.key.all) && (this.props.match.params.all === undefined)) {
            this.props.enableLoading()
            this.getAllChildData(catId, this.state.page)
            this.getBannerData(nextprops.match.params.categoryId, nextprops.match.params.all)
        }
    }

    /**
     * @method componentWillMount
     * @description called before mounting the component
     */
    componentWillMount() {
        this.props.enableLoading()
        let parameter = this.props.match.params;
        let id = parameter.subCategoryId ? parameter.subCategoryId : parameter.categoryId
        let categoryId = parameter.all === langs.key.all ? parameter.categoryId : id
        this.getBannerData(categoryId, parameter.all)
        this.getAllData()

    }

    /**
    * @method getBannerData
    * @description get banner details
    */
    getBannerData = (categoryId, allData) => {
        let parameter = this.props.match.params;
        this.props.getBannerById(3, res => {
            if (res.status === 200) {
                this.props.disableLoading()
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
                this.setState({ topImages: top })
            }
        })
    }

    /**
    * @method getAllData
    * @description get all data
    */
    getAllData = () => {
        const { isLoggedIn, loggedInDetail } = this.props
        const { isFilterPage } = this.state;
        let params = this.props.match.params
        let cat_id = params.subCategoryId
        let categoryName = this.props.match.params.categoryName
        this.getChildCategory(params.categoryId)

        if (isFilterPage && this.props.location.state.filterReqData !== undefined) {
            // this.setState({ classifiedList: this.props.location.state.classifiedList, filterReqData: this.props.location.state.filterReqdata })
            this.props.applyClassifiedFilterAttributes(this.props.location.state.filterReqData, res => {
                if (res.status === 1) {
                    this.setState({
                        classifiedList: res.data,
                        templateName: this.props.location.state.templateName,
                        filterReqData: this.props.location.state.filterReqData
                    })
                } else {
                    this.setState({
                        classifiedList: [],
                        templateName: this.props.location.state.templateName,
                        filterReqData: this.props.location.state.filterReqData
                    })

                }
            })
        } else if (params.all === langs.key.all) {
            
            this.getAllChildData(params.categoryId, this.state.page)
        } else {
            let reqData = {
                id: cat_id,
                page: 1,
                page_size: 9,
                user_id: isLoggedIn ? loggedInDetail.id : ''
            }
            this.props.getClassfiedCategoryListing(reqData, (res1) => {
                
                if (res1.status === 200) {
                    // this.setState({ classifiedList: res1.data.data })
                    this.setState({
                        classifiedList: res1.data.data,
                        tempSlug: res1.data.template_slug,
                        catName: res1.data.category_name,
                        catId: res1.data.category_id,
                        subCatName: res1.data.sub_category_name,
                        // templateName: templateName
                    })
                }
            })
        }
    }

    /**
    * @method getAllChildData
    * @description get child data
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
     * @method getClassifiedListing
     * @description get classified listing
     */
    getClassifiedListing = (id, page) => {
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData = {
            id: id,
            page: page,
            page_size: 12,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getClassfiedCategoryListing(reqData, (res) => {
            
            // if (res.status === 200) {
            let templateName = Array.isArray(res.data.data) && res.data.data.length && res.data.data[0].template_slug
            // this.setState({ classifiedList: res.data.data, templateName: templateName })
            
            this.setState({
                classifiedList: res.data.data,
                tempSlug: res.data.template_slug,
                catName: res.data.category_name,
                catId: res.data.category_id,
                subCatName: res.data.sub_category_name,
                templateName: templateName
            })
            // }
        })
    }


    /**
     * @method getChildCategory
     * @description get getChildCategory records
     */
    getChildCategory = (id) => {
        let isFilterPage = this.props.location.state === undefined ? false : true

        this.props.getChildCategory({ pid: id }, res1 => {
            if (res1.status === 200) {
                const data = Array.isArray(res1.data.newinsertcategories) && res1.data.newinsertcategories;
                this.setState({
                    subCategory: data,
                    isFilterPage: isFilterPage,
                })
            }

        })
    }

    /**
    * @method toggleMoreOption
    * @description toggle more options
    */
    toggleMoreOption() {
        this.setState({
            isMoreOption: !this.state.isMoreOption,
        })
    }

    /**
     * @method onTabChange
     * @description manage tab change
     */
    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    };

    /**
       * @method handleSort
       * @description handle sort
       */
    handleSort = (e) => {
        const { classifiedList } = this.state;
        this.setState({ sortBy: e })
        let filteredList = classifiedList.sort(function (a, b) {
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
        this.setState({ classifiedList: filteredList })

    }
    /** 
     * @method handleSearchCall
     * @description Call Action for Classified Search
     */
    handleSearchCall = () => {
        // this.props.enableLoading()
        this.props.classifiedGeneralSearch(this.state.searchReqData, (res) => {
            // this.props.disableLoading()
            this.setState({ classifiedList: res.data })
        })
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
                                    callNext={() => {
                                        if (this.state.isSearchResult) {
                                            this.handleSearchCall()
                                        } else if (this.state.isFilterPage && this.props.location.state.filterReqData !== undefined) {
                                            this.props.applyClassifiedFilterAttributes(this.state.filterReqData, res => {
                                                if (res.status === 1) {
                                                    this.setState({ classifiedList: res.data })
                                                }
                                            })
                                        } else {
                                            let subCategoryId = this.props.match.params.subCategoryId
                                            this.getClassifiedListing(subCategoryId, this.state.page)
                                        }
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
     * @method handleSearchResponce
     * @description Call Action for Classified Search
     */
    handleSearchResponce = (res, resetFlag, reqData) => {
        let catIdInitial = this.props.match.params.subCategoryId
        let params = this.props.match.params
        const { isFilterPage } = this.state
        if (resetFlag) {
            this.setState({ isSearchResult: false });
            if (params.all === langs.key.all) {
                this.getAllChildData(params.categoryId, this.state.page)
            } else {
                this.getClassifiedListing(catIdInitial, this.state.page)
            }
            if (isFilterPage) {
                // this.props.history.push(this.props.location.pathname)
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
        const { subCatName, classifiedList, topImages, subCategory } = this.state;
        
        let parameter = this.props.match.params;
        let parentName = parameter.categoryName;
        let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : langs.key.All;
        let pid = parameter.categoryId
        let allData = parameter.all === langs.key.all ? true : false
        // let redirectUrl = getFilterRoute(parameter.categoryName, parameter.categoryId, parameter.subCategoryName, parameter.subCategoryId, allData)
        return (
            <Layout>
                <Layout>
                    <AppSidebar history={history} activeCategoryId={pid} moddule={1} />
                    <Layout>
                        <SubHeader
                            subCategory={subCategory}
                            classifiedList={classifiedList}
                            pid={pid}
                            parentName={parentName}
                            childName={subCategoryName}
                            template='job'
                        />
                        <div className='inner-banner'>
                            <CarouselSlider bannerItem={topImages} pathName='/' />
                        </div>
                        <Tabs type='card' className={'tab-style1 job-search-tab'}>
                            <TabPane tab='Job Search' key='1'>
                                <Form name='location-form' className='location-search classified' layout={'inline'}>
                                    <GeneralSearch showMoreOption={true} handleSearchResponce={this.handleSearchResponce}  template={'job'}/>
                                </Form>
                            </TabPane>
                        </Tabs>
                        <Content className='site-layout'>
                            <div className='wrap-inner mt-17' style={{ background: '#F5F7F9' }}>
                                <Row className='mb-20'>
                                    <Col md={16}>
                                        <Breadcrumb separator='|' className='pt-20 pb-30'>
                                            <Breadcrumb.Item>
                                                <Link to='/'>Home</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to='/classifieds'>Classified</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to={getClassifiedCatLandingRoute('job', pid, parentName)
                                                }>{parentName}</Link>
                                            </Breadcrumb.Item>
                                            {/* {classifiedList.length !== 0 && */}
                                            <Breadcrumb.Item>{parameter.all === langs.key.all ? langs.key.All : subCatName}</Breadcrumb.Item>
                                            {/* } */}
                                        </Breadcrumb>
                                    </Col>
                                    <Col md={8}>
                                        <div className='location-btn' style={{ marginTop: -5 }}>
                                            {'Melbourne, 3000'} <Icon icon='location' size='15' className='ml-20' />
                                        </div>
                                    </Col>
                                </Row>
                                <Card
                                    title={parameter.all === langs.key.all ? langs.key.All : subCategoryName}
                                    bordered={false}
                                    extra={
                                        <ul className='panel-action'>
                                            <li className={'active'}><a><Icon icon='grid-view' size='18' /></a></li>
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
                                    <Row>
                                        <Col span={20}>
                                            {this.renderCard(classifiedList)}
                                        </Col>
                                    </Row>
                                </Card>
                                {(classifiedList && classifiedList.length > 9 &&
                                    <Row>
                                        <Col span={20}>
                                            <Pagination
                                                defaultCurrent={1}
                                                defaultPageSize={10} //default size of page
                                                onChange={this.handlePageChange}
                                                total={50} //total number of card data available
                                                itemRender={itemRender}
                                                className={'mb-20'}
                                            />
                                        </Col>
                                    </Row>
                                )}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, classifieds } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedClassifiedList: classifieds.classifiedsList,
    };
}

export default connect(
    mapStateToProps,
    { getClassfiedCategoryListing, classifiedGeneralSearch, applyClassifiedFilterAttributes, getChildCategory, enableLoading, disableLoading, getClassfiedCategoryDetail, getBannerById }
)(SubCategory);