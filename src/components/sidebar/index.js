import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom'
import { Layout, Menu, Typography } from 'antd';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {getClassifiedSubcategoryRoute, getClassifiedCatLandingRoute } from '../../common/getRoutes'
import { TEMPLATE, DEFAULT_ICON } from '../../config/Config'
import { logout, getClassfiedCategoryListing } from '../../actions/index';
import { langs } from '../../config/localization';
import Icon from '../../components/customIcons/customIcons';
import Back from '../common/Back'
import './sidebar.less';
const { Sider } = Layout;
const { Text } = Typography;

class AppSidebar extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isRedirect: false,
            redirectPath: ''
        }
    }

    /**
    * @method Logout User
    * @description Logout the user & clear the Session 
    */
    logout = () => {
        this.props.logout()
        toastr.success(langs.success, langs.messages.logout_success)
        window.location.assign('/');
    };

    /**
     * @method selectTemplateRoute
     * @description select tempalte route dynamically
     */
    selectTemplateRoute = (el) => {
        const { subCategory } = this.props;
        let parameter = this.props.match.params
        console.log('el', el)  
        let parentName =  el.parent_category_name ? el.parent_category_name : parameter.categoryName ? parameter.categoryName  : ''  
        let templateName = el.template_slug ? el.template_slug : 'general'
        let cat_id = el.id
        let path = ''
        if(subCategory) {
            if (templateName === TEMPLATE.GENERAL) {
                path = getClassifiedSubcategoryRoute(templateName, parentName, el.pid, el.name, el.id)
                this.props.history.push(path)
            } else if (templateName === TEMPLATE.JOB) {
                let route =  getClassifiedSubcategoryRoute(templateName, parentName, el.pid, el.name, el.id)
                this.props.history.push(route);
            } else if (templateName === TEMPLATE.REALESTATE) {
                path =  getClassifiedSubcategoryRoute(templateName, parentName, el.pid, el.name, el.id)
                this.props.history.push(path)
            }
        }else {
            if (templateName === TEMPLATE.GENERAL) {
                path = getClassifiedCatLandingRoute(TEMPLATE.GENERAL, cat_id, el.name)
                this.props.history.push(path)
            } else if (templateName === TEMPLATE.JOB) {
                let route = getClassifiedCatLandingRoute(TEMPLATE.JOB, cat_id, el.name)
                this.props.history.push(route);
            } else if (templateName === 'all') {
                path =  getClassifiedSubcategoryRoute(TEMPLATE.REALESTATE, TEMPLATE.REALESTATE, el.pid, el.name, el.id)
                // path = getClassifiedCatLandingRoute(TEMPLATE.REALESTATE, cat_id, el.name)
                this.props.history.push(path)
            }
        }
    }

    /**
     * @method Logout User
     * @description Logout the user & clear the Session 
     */
    renderIcons = () => {
        const { isLoggedIn, classifiedCategoryList, activeCategoryId,subCategory } = this.props;
        let item = subCategory ? subCategory : classifiedCategoryList
        if(item && item.length){
            return item.map((el) => {
                let iconUrl = `${this.props.iconUrl}${el.id}/${el.icon}`
                return (
                    <Menu.Item key={el.id} className={el.id == activeCategoryId ? 'menu-active' : ''}  title={el.name}>
                        <img
                            onClick={() => this.selectTemplateRoute(el)}
                           
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_ICON
                            }}
                            src={iconUrl} alt='Home' width='30' className={'stroke-color'} />
                    </Menu.Item>
                )
            })
        }
    };

    /**
     * @method render
     * @description render component
     */
    render() {
        const { isLoggedIn, activeCategoryId } = this.props;
        
        const { isRedirect, redirectPath } = this.state;
        return (
            <Sider width={200} className='site-layout-background'>
                <div className='menu-item-wrap menu-item-wrap-fix'>
                    <Menu
                        mode='vertical'
                        selectedKeys={[activeCategoryId]}
                    >
                        {this.renderIcons()}
                    </Menu>
                </div>
                {isRedirect && <Redirect push
                    to={{
                        pathname: redirectPath
                    }}
                />}
            </Sider>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, profile, common } = store
    const { savedCategories, categoryData } = common;
    let classifiedCategoryList = []
    classifiedCategoryList = categoryData && Array.isArray(categoryData.classifiedFilteredCategory) ? categoryData.classifiedFilteredCategory : []
    return {
        isLoggedIn: auth.isLoggedIn,
        userProfile: profile.userProfile,
        iconUrl: categoryData && categoryData.classifiedAll !== undefined ? common.categoryData.classifiedAll.iconurl : '',
        classifiedCategoryList
    };
};
export default connect(
    mapStateToProps,
    { logout, getClassfiedCategoryListing }
)(withRouter(AppSidebar));
