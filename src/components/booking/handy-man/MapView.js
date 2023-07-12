import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { enableLoading, disableLoading, classifiedGeneralSearch, openLoginModel, newInBookings, getChildCategory, applyClassifiedFilterAttributes } from '../../../actions';
import { converInUpperCase } from '../../common'
import { langs } from '../../../config/localization';
import { Row, Col, Layout, Breadcrumb, Card, Rate, Typography, Form, Input, Select, Button } from 'antd'
import { Link } from 'react-router-dom'
import Icon from '../../../components/customIcons/customIcons';
import AppSidebar from '../common/Sidebar';
import MapFilters from './MapFilter';
import Map from '../../common/Map';
import '../../common/mapView.less';
import SubDetailCard from '../common/SubDetailCard';
import history from '../../../common/History';
import { getBookingSubcategoryRoute, getBookingCatLandingRoute } from '../../../common/getRoutes'
import PlacesAutocomplete from '../../common/LocationInput'
import { TEMPLATE } from '../../../config/Config';

const { Text } = Typography;
const { Option } = Select;

class MapView extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            bookingList: [],
            isFilter: false,
            isProCard: true,
            selectedDistance: 0,
            searchKey: '',
            isSearch: false,
            filteredData: [],
            distanceOptions: [0, 5, 10, 15, 20],
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
        this.props.enableLoading()
        let parameter = this.props.match.params
        let cat_id = parameter.categoryId
        let sub_cat_id = parameter.subCategoryId
        if(sub_cat_id === undefined){
            this.getCategoryData(cat_id)
        }else {
            this.getAllData(cat_id, sub_cat_id)
        }
    }

      /**
    * @method getTopRatedData
    * @description get top rated records
    */
    getCategoryData = (cat_id) => {
        const { isLoggedIn, loggedInDetail } = this.props
        const requestData = {
            user_id: isLoggedIn ? loggedInDetail.id : '',
            page: 1,
            per_page: 12,
            cat_id
        }
        this.getBookingData(requestData)
    }

     /**
    * @method getBookingData
    * @description get bboking list
    */
    getBookingData = (requestData) => {
        this.props.newInBookings(requestData, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                this.setState({ bookingList: data })
            }
        })
    }

   /**
   * @method getAllData
   * @description get all data
   */
    getAllData = (cat_id, sub_cat_id) => {
        const { isLoggedIn, loggedInDetail } = this.props
        const requestData = {
            user_id: isLoggedIn ? loggedInDetail.id : '',
            page: 1,
            per_page: 12,
            cat_id,
            sub_cat_id
        }
        this.getBookingData(requestData)
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
     * @description handle filters
     */
    handleFilters = (value) => {
        this.setState({ bookingList: value, isFilter: false, isProCard: true })
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const { bookingList, selectedDistance, isFilter, isProCard } = this.state;
        let parameter = this.props.match.params;
        let title = ''
        let parentName = parameter.categoryName;
        let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName  ? parameter.subCategoryName : bookingList && Array.isArray(bookingList) && bookingList.length ? bookingList[0].sub_cat_name : ''
        if(subCategoryName === langs.key.fitness){
            let selectedCategory = this.props.location.state !== undefined ? this.props.location.state.selectedItemsName : ''
            let selectedName = selectedCategory && selectedCategory.join(' ')
            title = selectedName && converInUpperCase(selectedName) 
        }else{
            title = subCategoryName ? converInUpperCase(subCategoryName) : bookingList && Array.isArray(bookingList) && bookingList.length ? bookingList[0].sub_cat_name : ''
        }
        
        let subCategoryId = parameter.all === langs.key.all ? '' : parameter.subCategoryId
        let allData = parameter.all === langs.key.all ? true : false       
        let gridUrl = getBookingSubcategoryRoute(parameter.categoryName, parameter.categoryName, parameter.categoryId, subCategoryName, subCategoryId, allData)

        let categoryPagePath = getBookingCatLandingRoute(parameter.categoryName, parameter.categoryId, parameter.categoryName)

        return (
            <Layout className="yellow-theme">
                <Layout>
                    <AppSidebar history={history} activeCategoryId={parameter.categoryId} moddule={1} />
                    <Layout>
                        <div className='wrap-inner'>
                            <Breadcrumb separator='|' className='pb-20 pt-20'>
                                <Breadcrumb.Item>
                                    <Link to='/'>Home</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to='/bookings'>Bookings</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to={categoryPagePath}>{converInUpperCase(parentName)}</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                {parentName !== TEMPLATE.HANDYMAN && parentName !== TEMPLATE.PSERVICES ? 
                                    <Link to={gridUrl}>{subCategoryName && converInUpperCase(subCategoryName)}</Link>:
                                    subCategoryName && converInUpperCase(subCategoryName)
                                    }
                                </Breadcrumb.Item>
                                {parentName !== TEMPLATE.HANDYMAN && parentName !== TEMPLATE.PSERVICES && <Breadcrumb.Item>{'Search'}</Breadcrumb.Item>}
                            </Breadcrumb>
                            <Card
                                title={title && (converInUpperCase(title))}
                                bordered={false}
                                className={'panel-card map-wrap   kkk'}
                                extra={
                                    <ul className='panel-action'>
                                        <li><Link to={gridUrl}><Icon icon='grid' size='18' /></Link></li>
                                        <li onClick={this.toggleProCard.bind(this)} className={!isFilter && 'active'}><Icon icon='map' size='18' /></li>
                                        <li onClick={this.toggleFilter.bind(this)} className={isFilter && 'active'}><Icon icon='filter' size='18' /> <span>Filter</span></li>
                                    </ul>
                                }
                            >
                                <Row>
                                    <Col span={17}>
                                        <div className='map-view'>
                                            <Map list={this.state.bookingList} />
                                        </div>
                                    </Col>
                                    <Col span={7}>
                                        {/* <PlacesAutocomplete
                                            name='address'
                                            handleAddress={this.handleAddress}
                                            addressValue={this.state.address}
                                        /> */}
                                        <div className='map-right-section'>
                                            {isProCard && <Fragment>
                                                <SubDetailCard topData={bookingList} pathData={parameter} />
                                            </Fragment>}
                                            <MapFilters isFilter={isFilter} handleFilters={this.handleFilters} />
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
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
};
export default connect(
    mapStateToProps,
    { enableLoading, disableLoading, newInBookings, openLoginModel, classifiedGeneralSearch, getChildCategory, applyClassifiedFilterAttributes }
)(MapView);
