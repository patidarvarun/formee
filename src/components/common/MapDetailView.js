import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {getClassfiedCategoryDetail, enableLoading, disableLoading, getClassfiedCategoryListing, classifiedGeneralSearch, openLoginModel, getChildCategory, applyClassifiedFilterAttributes } from '../../actions';
import { Row, Col, Layout, Breadcrumb, Card, Form, Input, Button, Typography, Select } from 'antd'
import { Link } from 'react-router-dom'
import Icon from '../customIcons/customIcons';
import AppSidebar from '../sidebar';
import RetailAppSidebar from '../retail/Sidebar';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../config/localization';
import Map from './Map';
import MapFilters from './MapFilter';
import './mapView.less';
import SubDetailCard from './SubDetailCard';
import history from '../../common/History';
import { TEMPLATE } from '../../config/Config';
import {getRetailCatLandingRoutes,getRetailSubcategoryRoute, getClassifiedCatLandingRoute, getFilterRoute, getClassifiedSubcategoryRoute } from '../../common/getRoutes'
import NoContentFound from './NoContentFound'

const { Text } = Typography;
const { Option } = Select;

class MapComponent extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            classifiedList: [],
            isFilter: false,
            isProCard: true,
            selectedDistance: 0,
            searchKey: '',
            isSearch: false,
            filteredData: [],
            distanceOptions: [0, 5, 10, 15, 20],
            prizeOptions: [10, 20, 50, 100, 200, 300],
            isSearchResult: false,
            searchLatLng: '',
            selectedOption: ''
        };
    }

    /**
    * @method componentWillMount
    * @description called before render the component
    */
    componentWillMount() {
        let classified_id = this.props.match.params.classifiedId
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData = {
            id: classified_id,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.enableLoading()
        this.props.getClassfiedCategoryDetail(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                
                this.setState({ classifiedDetail: res.data.data, allData: res.data })
            }
        })
    }

    /**
     * @method toggleFilter
     * @description toggle the filter
     */
    toggleFilter() {
        this.setState({
            isFilter: true,
            isProCard: false
        })
    }

    /**
     * @method toggleProCard
     * @description toggeled the pro card
     */
    toggleProCard() {
        this.setState({
            isFilter: false,
            isProCard: true
        })
    }

    /**
     * @method handleFilters
     * @description handle filter
     */
    handleFilters = (value) => {
        this.setState({ classifiedList: value, isFilter: false, isProCard: true })
    }

    /**
    * @method renderCard
    * @description render card details
    */
    renderCard = (categoryData, parameter) => {
        if (categoryData) {
            let imageurl = categoryData && categoryData.classified_image && Array.isArray(categoryData.classified_image)  && categoryData.classified_image.length ? categoryData.classified_image[0].full_name : ''
            return (
                <Fragment>
                    <Row gutter={[38, 0]}>
                        <Col span={24}>
                            <SubDetailCard
                                data={{
                                    classifiedid:categoryData.id,
                                    title: categoryData.title,
                                    price: categoryData.price,
                                    catname: categoryData.subcategoriesname && categoryData.subcategoriesname.name,
                                    reviews:categoryData && categoryData.classified_hm_reviews,
                                    discription: '',
                                    imageurl: imageurl,
                                    template_slug: parameter.templateName
                                }}
                                pathData={parameter}
                            />
                        </Col>
                    </Row>
                </Fragment>
            )
        } else {
            return <NoContentFound />
        }
    }

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

    applyFilter = (value) => {
        
        const { selectedOption } = this.state;
        let isEmpty = Object.keys(selectedOption).length === 0
        if (isEmpty) {
            toastr.warning(langs.warning, langs.messages.mandate_filter)
        } else {
            let reqData = {
                cat_id: selectedOption.catid,
                distance: value.distance == undefined ? '' : value.distance,
                price_min: value.price_min == undefined ? '' : value.price_min,
                price_max: value.price_max == undefined ? '' : value.price_max,
                sortBy: value.sortBy == undefined ? '' : value.sortBy,
                name: selectedOption.title,
                userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : '',
            }
            
            // this.props.applyClassifiedFilterAttributes(reqData, res => {
            this.props.enableLoading()
            this.props.classifiedGeneralSearch(reqData, (res) => {
                this.props.disableLoading()
                
                if (res.status === 1) {
                    this.handleFilters(res.data)
                    this.setState({ classifiedList: res.data, isFilter: false })
                } else {
                    this.handleFilters([])
                }
            })
        }
    }

    /**   
    * @method renderDistanceOptions
    * @description render subcategory
    */
    renderDistanceOptions = () => {
        return this.state.distanceOptions.map((el, i) => {
            return (
                <Option key={i} value={el}>{el} KM</Option>
            );
        })
    }

    /** 
    * @method handleAddress
    * @description handle address change Event Called in Child loc Field 
    */
    handleAddress = (result, address, latLng) => {
        let state = '';
        let city = '';
        let p_code = '';
        result.address_components.map((el) => {

            if (el.types[0] === 'administrative_area_level_1') {
                state = el.long_name
            } else if (el.types[0] === 'administrative_area_level_2') {
                city = el.long_name
            } else if (el.types[0] === 'postal_code') {
                p_code = el.long_name
            }
        })

        this.setState({
            address: {
                full_add: address,
                latLng,
                state,
                city,
                p_code
            }
        })

    }

    /**
     * @method renderPrizeOptions
     * @description renderPrizeOptions component
     */
    renderPrizeOptions = () => {
        return this.state.prizeOptions.map((el, i) => {
            return (
                <Option key={i} value={el}>{el}$</Option>
            );
        })
    }

    /**
    * @method render
    * @description render component
    */
    render() {
        const {  isFilter, isProCard, classifiedDetail} = this.state;
        let cat_id = this.props.match.params.classified_id
        const { location } = this.props;
        let parameter = this.props.match.params;
        let parentName = parameter.categoryName;
        let pid = parameter.categoryId;
        let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName
        let subCategoryId = parameter.all === langs.key.all ? '' : parameter.subCategoryId
        let allData = parameter.all === langs.key.all ? true : false
        let templateName = parameter.templateName
        let gridUrl = '',categoryPagePath = '', landingpage = '', title= '';
        let isRetail = templateName === 'retail'
        if(isRetail){
            landingpage = '/retail'
            title = 'Retail'
             gridUrl =getRetailSubcategoryRoute(
                parameter.categoryName,
                parameter.categoryId,
                parameter.subCategoryName,
                parameter.subCategoryId
              )
             categoryPagePath = getRetailCatLandingRoutes(parameter.categoryId,parameter.categoryName)
        }else {
            landingpage = '/classifieds'
            title = 'Classified'
            gridUrl = getClassifiedSubcategoryRoute(templateName, parameter.categoryName, parameter.categoryId, subCategoryName, subCategoryId, allData)
            categoryPagePath = templateName === TEMPLATE.REALESTATE ? location.pathname : getClassifiedCatLandingRoute(templateName, parameter.categoryId, parameter.categoryName)
        }

        return (
            <Layout >
                <Layout>
                    {isRetail ? <RetailAppSidebar 
                        history={history} 
                        activeCategoryId={subCategoryId ? subCategoryId : pid} moddule={1}  
                        subCategoryPage={true}
                        cat_id={pid}
                        subCategoryId={subCategoryId}
                    />:<AppSidebar history={history} activeCategoryId={templateName === TEMPLATE.REALESTATE ? subCategoryId : pid} moddule={1} />}
                    <Layout>
                        <div className='wrap-inner'>
                            <Breadcrumb separator='|' className='pb-20'>
                                <Breadcrumb.Item>
                                    <Link to='/'>Home</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to={landingpage}>{title}</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to={categoryPagePath}>{parentName}</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>{subCategoryName}</Breadcrumb.Item>
                            </Breadcrumb>
                            <Card
                                title={subCategoryName}
                                bordered={false}
                                className={'panel-card map-wrap'}
                                extra={
                                    <ul className='panel-action'>
                                        <li  title={'List view'}><Link to={gridUrl}><Icon icon='grid' size='18' /></Link></li>
                                        <li  title={'Map view'} onClick={this.toggleProCard.bind(this)} className={!isFilter && 'active'}><Icon icon='map' size='18' /></li>
                                    </ul>
                                }
                            >
                                <Row>
                                    <Col span={17}>
                                        <div className='map-view'>
                                            {classifiedDetail && <Map list={[classifiedDetail]}/>}
                                        </div>
                                    </Col>
                                    <Col span={7}>
                                        <div className='map-right-section'>
                                            <Fragment>
                                                {isProCard ?
                                                     this.renderCard(classifiedDetail, parameter)
                                                    : <MapFilters isFilter={isFilter} handleFilters={this.handleFilters} />

                                                }
                                            </Fragment>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, common } = store;
    const { savedCategories, categoryData } = common;
    let classifiedList = [];
    let isEmpty = savedCategories.data.booking.length === 0 && savedCategories.data.retail.length === 0 && savedCategories.data.classified.length === 0 && (savedCategories.data.foodScanner === '' || (Array.isArray(savedCategories.data.foodScanner) && savedCategories.data.foodScanner.length === 0))
    if (auth.isLoggedIn) {
        if (!isEmpty) {
            isEmpty = false
            classifiedList = savedCategories.data.classified;
        } else {
            isEmpty = true
            classifiedList = categoryData && Array.isArray(categoryData.classified.newinsertcategories) ? categoryData.classified.newinsertcategories : []
        }
    } else {
        isEmpty = true
        classifiedList = categoryData && Array.isArray(categoryData.classified.newinsertcategories) ? categoryData.classified.newinsertcategories : []
    }

    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        iconUrl: common.categoryData.classified.iconurl,
        classifiedList,
        isEmpty
    };
};
export default connect(
    mapStateToProps,
    {getClassfiedCategoryDetail, enableLoading, disableLoading, getClassfiedCategoryListing, openLoginModel, classifiedGeneralSearch, getChildCategory, applyClassifiedFilterAttributes }
)(MapComponent);
