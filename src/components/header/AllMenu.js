import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Typography } from 'antd';
import { TEMPLATE } from '../../config/Config'
import { langs } from '../../config/localization';
import { getClassifiedCatLandingRoute, getBookingCatLandingRoute, getRetailCatLandingRoutes, getClassifiedSubcategoryRoute } from '../../common/getRoutes'
import {controlMenuDropdown, fetchMasterDataAPI, getUserMenuList, getClassfiedCategoryListing } from '../../actions/index';
import '../header/header.less';
import { withRouter } from 'react-router'

const { Title, } = Typography;

class AllMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingList: [],
            retailList: [],
            classifiedList: [],
            isEmpty: false,
            redirectTo: null
        };
    }

    /**
     * @method componentWillMount
     * @description called before render component
     */
    componentWillMount() {
        this.renderMenuList()
    }

    /**
    * @method renderMenuList
    * @description render menulist
    */
    renderMenuList = () => {
        this.props.fetchMasterDataAPI({ timeinterval: 0 }, res => { })
    }

    /**
    * @method selectTemplateRoute
    * @description decide template to navigate the logic
    */
    selectTemplateRoute = (el, key) => {
        if (key === langs.key.classified) {
            let templateName = el.template_slug
            let cat_id = el.id;
            let path = ''
            if (templateName === TEMPLATE.GENERAL) {
                path = getClassifiedCatLandingRoute(TEMPLATE.GENERAL, cat_id, el.name)
                this.props.history.push(path)
            } else if (templateName === TEMPLATE.JOB) {
                let route = getClassifiedCatLandingRoute(TEMPLATE.JOB, cat_id, el.name)
                this.props.history.push(route);
            } else if (templateName === 'all') {
                path = getClassifiedSubcategoryRoute(TEMPLATE.REALESTATE, TEMPLATE.REALESTATE, el.pid, el.name, el.id, false)
                this.props.history.push(path)
            }

        } else if (key === langs.key.booking) {
            // let slug = el.slug
            let slug = el.name
            console.log(' el: ', el);
            if (slug === TEMPLATE.HANDYMAN) {
                let path = getBookingCatLandingRoute(TEMPLATE.HANDYMAN, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.BEAUTY) {
                let path = getBookingCatLandingRoute(TEMPLATE.BEAUTY, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.EVENT) {
                let path = getBookingCatLandingRoute(TEMPLATE.EVENT, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.WELLBEING) {
                let path = getBookingCatLandingRoute(TEMPLATE.WELLBEING, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.RESTAURANT) {
                let path = getBookingCatLandingRoute(TEMPLATE.RESTAURANT, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.SPORTS) {
                let path = getBookingCatLandingRoute(TEMPLATE.SPORTS, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.PSERVICES || slug === 'Professional Services') {
                let path = getBookingCatLandingRoute(TEMPLATE.PSERVICES, el.id, el.name)
                this.props.history.push(path)
            }else if (slug === TEMPLATE.TURISM) {
                let path = getBookingCatLandingRoute(TEMPLATE.TURISM, el.id, el.name)
                this.props.history.push(path)
            }
        } else if (key === langs.key.retail) {
            let path = getRetailCatLandingRoutes(el.id, el.slug)
            this.props.history.push(path)
        }
    }

    /**
    * @method renderSubcategory
    * @description render subcategory based on category type
    */
    renderSubcategory = (categoryType, key) => {
        if (categoryType && categoryType !== undefined) {
            return categoryType.map((data, i) => {
                return (
                    <li key={i} onClick={() => {
                        if (key === langs.key.classified || key === langs.key.booking || key === langs.key.retail) {
                            this.selectTemplateRoute(data, key)
                        }
                    }}>{key === langs.key.retail ? data.text : data.name}
                    </li>
                )
            });
        }
    }

    /**
    * @method render
    * @description render component
    */
    render() {
        const { retailList, classifiedList, bookingList, isLoggedIn, isEmpty, foodScanner } = this.props;
        const { redirectTo } = this.state;
        let isBokkingVisible = bookingList && bookingList.length !== 0
        let isClassifiedVisible = classifiedList && classifiedList.length !== 0
        let isRetailVisible = retailList && retailList.length !== 0
        return (
            <div className='menu-wrap'>
                <div className='category-menu'>
                    {isRetailVisible && <div className='category-menu-item retail-menu'>
                        <Link to='/retail' onClick={this.props.controlMenuDropdown(false)}><Title level={4}>{'Retail'}</Title></Link>
                        <ul>
                            {this.renderSubcategory(retailList, langs.key.retail)}
                        </ul>
                    </div>}
                    {isBokkingVisible && <div className='category-menu-item bookings-menu'>
                        <Link to='/bookings' onClick={this.props.controlMenuDropdown(false)}> <Title level={4}>{'Bookings'}</Title></Link>
                        <ul>
                            {this.renderSubcategory(bookingList, langs.key.booking)}
                        </ul>
                    </div>}
                    {isClassifiedVisible && <div className='category-menu-item classifieds-menu'>
                        <Link to='/classifieds' onClick={this.props.controlMenuDropdown(false)}><Title level={4}>{'Classifieds'}</Title></Link>
                        <ul>
                            {this.renderSubcategory(classifiedList, langs.key.classified)}
                        </ul>
                    </div>}
                    {/* {isEmpty &&  */}
                    <div className='category-menu-item food-scanner-menu'>
                        <Link to='/food-scanner'><Title level={4}>{'Food Scanner'}</Title></Link>
                        <Link to='/food-scanner'> <ul> <li>Food Scanner</li> </ul></Link>
                    </div>
                    {/* } */}
                    {/* {isEmpty === false && foodScanner !== '' && 
                    <div className='category-menu-item food-scanner-menu'>
                        <Title level={4}>{'Food Scanner'}</Title>
                        <ul>
                            <li>Food Scanner</li>
                        </ul>
                    </div>
                    } */}
                </div>
                {redirectTo && <Redirect push to={{
                    pathname: redirectTo
                }}
                />}
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, common } = store;
    const { savedCategories, categoryData } = common;
    let classifiedList = [], bookingList = [], retailList = [], foodScanner = '';
  
    classifiedList = categoryData && Array.isArray(categoryData.classifiedFilteredCategory) ? categoryData.classifiedFilteredCategory : []
    bookingList = categoryData && Array.isArray(categoryData.booking.data) ? categoryData.booking.data : []
    retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []

    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        classifiedList, bookingList, retailList, foodScanner,
        //isEmpty
    };
};
export default connect(
    mapStateToProps,
    {controlMenuDropdown, fetchMasterDataAPI, getUserMenuList, getClassfiedCategoryListing }
)(withRouter(AllMenu));

