import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../../sidebar';
import { Layout, Typography, Row, Col, Tabs, Form, Select, Button, Breadcrumb, Dropdown, Menu, Divider } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Icon from '../../../components/customIcons/customIcons';
import { enableLoading, disableLoading, classifiedGeneralSearch, getPopularSearchByCity, getPopularSearchCitiesOptions, getBannerById, papularSearch, getChildCategory, getClassfiedCategoryListing, getClassfiedCategoryDetail, getClassfiedTabListing } from '../../../actions/index';
import DetailCard from './DetailCard'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import NoContentFound from '../../common/NoContentFound'
import { TAB_FILTER } from '../../../config/Config'
import SubHeader from '../../common/SubHeader';
import GeneralSearch from '../GeneralSearch';
import { langs } from '../../../config/localization'
import { capitalizeFirstLetter } from '../../common'

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class SimpleLandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            classifiedList: [],
            isMoreOption: true,
            isOpen: false,
            mostRecent: [],
            topRated: [],
            subCategory: [],
            isSearchResult: false,
            popularCities: [],
            popularSearches: [],
            searchReqData: {},
            viewAll: false,
            selectedCity: { cityName: 'Melbourne' },
            tempSlug: '',
            catName: ''
        };
    }

    /**
     * @method componentWillMount
     * @description called before mounting the component
     */
    componentWillMount() {
        this.getAllData()
        const mapObj = window.navigator;
        if (mapObj.geolocation) {
            mapObj.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                
            })
        } else {
            
        }
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props
    */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.categoryId
        let catIdNext = nextprops.match.params.categoryId
        if (catIdInitial !== catIdNext) {
            // this.getTopRatedData(catIdNext)
            this.getMostRecentData(catIdNext)
        }
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
     * @method getAllData
     * @description get all api data
     */
    getAllData = () => {
        let cat_id = this.props.match.params.categoryId
        let categoryName = this.props.match.params.categoryName
        this.props.enableLoading()
        this.props.papularSearch({ module_type: langs.key.classified, category_id: cat_id }, res => {

            if (res.status === 200) {
                if (Array.isArray(res.data.data.data)) {
                    this.setState({ popularSearches: res.data.data.data })
                }
            }
        })
        this.getMostRecentData(cat_id)
        this.getPopularSearchCities()
        this.props.getChildCategory({ pid: cat_id }, res1 => {
            if (res1.status === 200) {
                const data = Array.isArray(res1.data.newinsertcategories) && res1.data.newinsertcategories;
                this.setState({
                    subCategory: data,
                })
            }
        })
        let reqData = {
            id: cat_id,
            page: 1,
            page_size: 9,
        }
        this.props.getClassfiedCategoryListing(reqData, (res1) => {
            if (res1.status === 200) {
                this.props.getBannerById(3, res => {
                    const catId = res1.data && res1.data.data.length ? res1.data.data[0].id : ''
                    if (res.status === 200) {
                        this.props.disableLoading()
                        const data = res.data.data && res.data.data.banners;
                        const banner = data.filter(el => el.moduleId === 1)
                        const top = banner.filter(el => el.categoryId == catId && el.subcategoryId == '')
                        
                        this.setState({ topImages: top })
                    }
                })
                this.setState({ classifiedList: res1.data.data })
            }
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
    * @method getMostRecentData
    * @description get most recent category data
    */
    getPopularSearchCities = () => {
        let reqData = {
            'module_type': langs.key.classified
        }
        this.props.getPopularSearchCitiesOptions(reqData, (res) => {
            if (res.status === 200) {
                
                this.setState({ popularCities: [{ cityName: 'Melbourne' }, ...res.data.data.cities] })
            }
        })
    }

    /**
    * @method getMostRecentData
    * @description get most recent category data
    */
    getMostRecentData = (id) => {
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData1 = {
            id: id,
            page: 1,
            page_size: 12,
            filter: TAB_FILTER.MOST_RECENT,
            user_id: isLoggedIn ? loggedInDetail.id : '',
        };
        //deep copy
        let reqData2 = Object.assign({}, reqData1);
        reqData2.filter = TAB_FILTER.TOP_RATED
        this.props.enableLoading()
       
        this.props.getClassfiedTabListing(reqData1, reqData2, (res1, res2) => {
            let mostRecent = []
            let topRated = []
            let tempSlug = '';
            let catName = ''
            if (res1.status === 200) {
                mostRecent = res1.data.data
                tempSlug = res1.data.template_slug
                catName = res1.data.category_name
            }
            if (res2.status === 200) {
                topRated = res2.data.data
            }
            this.setState({ mostRecent, topRated, tempSlug, catName })
        })
    }

    /**
     * @method getTopRatedData
     * @description get top rated category data
     */
    getTopRatedData = (id) => {
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData = {
            id: id,
            page: 1,
            page_size: 9,
            filter: TAB_FILTER.TOP_RATED,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getClassfiedCategoryListing(reqData, (res) => {
            if (res.status === 200) {
                this.setState({ topRated: res.data.data })
            }
        })
    }

    /**
     * @method renderSubCategory
     * @description render subcategory
     */
    renderSubCategory = (childCategory) => {
        const { classifiedList } = this.state
        const parentName = classifiedList && classifiedList.length !== 0 && classifiedList[0].catname;
        let pid = this.props.match.params.categoryId
        return childCategory.length !== 0 && childCategory.map((el, i) => {
            return (
                <li onClick={() => this.setState({ redirectTo: `/classifieds/sub-category/${parentName}/pid/${pid}/cat-id/${el.id}` })}>
                    {`${el.name}(${el.classified_count})`}
                </li>
            );
        })
    }

    /**
    * @method renderPapularSearch
    * @description render papular search list
    */
    renderPapularSearch = (data) => {
        return data.length && data.map((el, i) => {
            return (
                <Col md={8} key={i}>
                    <div className='psearch-list'>
                        <Text>{capitalizeFirstLetter(el.keyword)}</Text>
                        <Icon icon='search' size='20' />
                    </div>
                </Col>
            )
        })

    }
    /**
     * @method renderPapularSearchCitities
     * @description render citiesOption
     */
    renderPapularSearchCitities = () => {
        const { popularCities, selectedCity } = this.state

        //Filtered city list
        let filteredCityList = popularCities.filter((el) => el.cityName !== selectedCity.cityName)
        return (
            <Menu>
                {filteredCityList.map((city, index) =>
                    <Menu.Item key={index} onClick={() => this.props.getPopularSearchByCity({
                        module_type: langs.key.classified,
                        city_name: city.cityName
                    }, (res) => {
                        if (res.status === 200 && Array.isArray(res.data.data.searches)) {
                            
                            this.setState({ popularSearches: res.data.data.searches, selectedCity: city })
                        }
                    })}>
                        {city.cityName}
                    </Menu.Item>
                )}
            </Menu>
        )
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
            let cat_id = this.props.match.params.categoryId
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
                                        } else {
                                            this.getMostRecentData(cat_id)
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
        let cat_id = this.props.match.params.categoryId
        if (resetFlag) {
            this.setState({ isSearchResult: false });
            this.getMostRecentData(cat_id)
        } else {
            this.setState({ classifiedList: res, isSearchResult: true, searchReqData: reqData })
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { tempSlug, catName, viewAll, redirectTo, classifiedList, selectedCity, popularSearches, popularCities, topImages, subCategory, isSearchResult, isOpen, mostRecent, topRated } = this.state;
        const { isLoggedIn, papularSearchData } = this.props;
        const parameter = this.props.match.params
        const menu = this.renderPapularSearchCitities();
        let cat_id = parameter.categoryId;
        let popularSearchesData = popularSearches && popularSearches.length > 6 ? popularSearches.slice(0, 6) : popularSearches
        return (
            <Layout>
                <Layout>
                    <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} />
                    <Layout>
                        <SubHeader
                            subCategory={subCategory}
                            classifiedList={mostRecent.length ? mostRecent : topRated}
                            pid={cat_id && cat_id}
                            parameter={parameter}
                            template={tempSlug}
                            catName={catName}

                        />
                        <div className='inner-banner'>
                            <CarouselSlider bannerItem={topImages} pathName='/' />
                        </div>
                        <Tabs type='card' className={'tab-style1 job-search-tab'}>
                            <TabPane tab='Job Search' key='1'>
                                <Form name='location-form' className='location-search' layout={'inline'}>
                                    <GeneralSearch handleSearchResponce={this.handleSearchResponce} showMoreOption={true}  template={tempSlug}/>
                                    <div className='location-more-option' >
                                        <Link style={{ textDecoration: 'underline' }} to={`/classifieds/filter/${langs.key.all}/${parameter.categoryName}/${parameter.categoryId}`}>More option</Link>
                                    </div>
                                </Form>
                            </TabPane>
                        </Tabs>
                        <Content className='site-layout'>
                            <div className='wrap-inner' style={{ background: '#F5F7F9' }}>
                                <Breadcrumb separator='|' className='pt-20 pb-30'>
                                    <Breadcrumb.Item>
                                        <Link to='/'>Home</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to='/classifieds'>Classified</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>{parameter.categoryName}</Breadcrumb.Item>

                                </Breadcrumb>
                                <div className='heading-bar'>
                                    <Title level={2}>
                                        {'Popular searches in'}
                                        <Dropdown overlay={menu} trigger={['click']} className='ml-30' onClick={e => {
                                            
                                        }}>
                                            <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                                <span className='text'>{selectedCity.cityName}</span> <DownOutlined />
                                            </a>
                                        </Dropdown>
                                    </Title>
                                    <Divider style={{ marginTop: 0, backgroundColor: '#E3E9EF' }} />
                                </div>
                                <Row gutter={[40, 14]} className='pt-10 pb-10'>
                                    {popularSearchesData && this.renderPapularSearch(popularSearchesData)}
                                </Row>
                                {popularSearches.length > 6 ?
                                    <div className='align-right'>
                                        <div className='category-name ant-btn btn-see-all' onClick={() => this.setState({
                                            viewAll: true,
                                        })}>See All</div></div> :
                                    ''}
                            </div>
                            <div className='wrap-inner bg-linear'>
                                {!isSearchResult ? <Tabs type='card' className={'tab-style2 pt-10'}>
                                    <TabPane tab='Most Recent' key='1'>
                                        {this.renderCard(mostRecent)}
                                        <div className='align-center pt-25 pb-25'>
                                            {(mostRecent && mostRecent.length !== 0 &&
                                                <Button type='default' size={'middle'}
                                                    onClick={() => {
                                                        this.props.history.push(`/classified-jobs/see-more/most-recent/${cat_id}`)
                                                    }}
                                                >
                                                    {'See All'}
                                                </Button>
                                            )}
                                        </div>
                                    </TabPane>
                                    <TabPane tab='Top Rated' key='2'>
                                        {this.renderCard(topRated)}
                                        <div className='align-center pt-25 pb-25'>
                                            {(topRated && topRated.length !== 0 &&
                                                <Button onClick={() => {
                                                    this.props.history.push(`/classified-jobs/see-more/top-rated/${cat_id}`)
                                                }}
                                                    type='default' size={'middle'}>
                                                    {'See All'}
                                                </Button>
                                            )}
                                        </div>
                                    </TabPane>
                                </Tabs> :
                                    this.renderCard(classifiedList)
                                }
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
    const { auth, classifieds } = store;
    const { papularSearch } = classifieds
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedClassifiedList: classifieds.classifiedsList,
        papularSearchData: papularSearch && papularSearch.success && papularSearch.success.data
    };
}

export default connect(
    mapStateToProps,
    { getClassfiedCategoryListing, classifiedGeneralSearch, getPopularSearchByCity, getClassfiedCategoryDetail, enableLoading, disableLoading, getPopularSearchCitiesOptions, getBannerById, papularSearch, getChildCategory, getClassfiedTabListing }
)(SimpleLandingPage);