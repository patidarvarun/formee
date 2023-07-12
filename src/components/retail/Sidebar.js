import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom'
import { Layout, Menu, Typography } from 'antd';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {getRetailSubcategoryRoute, getRetailCatLandingRoutes } from '../../common/getRoutes'
import { TEMPLATE, DEFAULT_ICON } from '../../config/Config'
import { logout } from '../../actions/index';
import { langs } from '../../config/localization';
import Icon from '../customIcons/customIcons';
import Back from '../common/Back'
import '../sidebar/sidebar.less';
const { Sider } = Layout;
const { Text } = Typography;

class SideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRedirect: false,
            redirectPath: '',
            subCategory: []
        }
    }

     /**
     * @method componentWillMount
     * @description called before render the component
    */
    componentWillMount(){
        const { cat_id, subCategoryId} = this.props
        console.log('cat_id', cat_id,subCategoryId)
        let parameter = this.props.match.params
        let subcatIdInitial = subCategoryId ? subCategoryId : parameter.subCategoryId
        let categoryId = cat_id ? cat_id : parameter.categoryId
        this.getChildCategory(categoryId,subcatIdInitial)
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props
    */
    componentWillReceiveProps(nextprops, prevProps) {
        const { cat_id, subCategoryId} = this.props
        let catIdInitial = cat_id ? cat_id : this.props.match.params.categoryId;
        let catIdNext = nextprops.cat_id ? nextprops.cat_id : nextprops.match.params.categoryId;
        let subcatIdInitial = subCategoryId ? subCategoryId : this.props.match.params.subCategoryId
        let subCatIdNext = nextprops.subCategoryId ? nextprops.subCategoryId : nextprops.match.params.subCategoryId;
        if(subCatIdNext){
            if (catIdInitial !== catIdNext && subcatIdInitial !== subCatIdNext) { 
                this.getChildCategory(catIdNext,subCatIdNext)
            }
        }else if(catIdInitial !== catIdNext){
            this.getChildCategory(catIdNext, subCatIdNext)
        }
    }

    /**
     * @method getChildCategory
     * @description get child category
    */
    getChildCategory = (id, childId) => {
        const { retailList } = this.props
        let subcategories = retailList && retailList.filter(el => el.id == id)
        if(subcategories && Array.isArray(subcategories) && subcategories.length){
            this.setState({subCategory: subcategories[0]}, () => {
                this.getSubChildCategory(childId)
            })
        }
    }

    /**
     * @method getChildCategory
     * @description get child category
    */
    getSubChildCategory = (id) => {
        const { subCategory } = this.state
        let data = subCategory && subCategory.category_childs && Array.isArray(subCategory.category_childs) && subCategory.category_childs.length ? subCategory.category_childs : []
        if(data){
            let subcategories = data && data.filter(el => el.id == id)
            if(subcategories && Array.isArray(subcategories) && subcategories.length){
                this.setState({subChildCategory: subcategories[0]})
            }
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
        const { subCategoryPage,cat_name} = this.props;
        let parameter = this.props.match.params
        let categoryName = parameter.categoryName ? parameter.categoryName : cat_name
        console.log('categoryName', categoryName)
        if(subCategoryPage){
            let path = getRetailSubcategoryRoute(categoryName, el.pid, el.text, el.id)
            this.props.history.push(path)
        }else {
            let path = getRetailCatLandingRoutes(el.id, el.slug)
            this.props.history.push(path)
        }
    }

    /**
     * @method Logout User
     * @description Logout the user & clear the Session 
     */
    renderIcons = () => {
        const { retailList, activeCategoryId,subCategoryPage} = this.props;
        const { subCategory,subChildCategory } = this.state
        let list = []
        if(subCategoryPage){
            let child = subCategory && Array.isArray(subCategory.category_childs) ? subCategory.category_childs : []
            let subChild = subChildCategory && Array.isArray(subCategory.category_childs) ? subCategory.category_childs : []
            list = subChild && subChild.length ? subChild : child && child.length ? child : retailList
        }else {
            list = retailList
        }
        if(list && list.length !== 0 ){
            return list.map((el) => {
                return (
                    <Menu.Item key={el.id} className={el.id == activeCategoryId ? 'menu-active' : ''} title={el.text}>
                        <img
                            onClick={() => this.selectTemplateRoute(el)}
                            
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_ICON
                            }}
                            src={el.imageurl} alt='Home'  className={'stroke-color'} />
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
        const { activeCategoryId } = this.props;
        const { isRedirect, redirectPath } = this.state;
        return (
            <Sider width={200} className='site-layout-background'>
                 <div className='menu-item-wrap-fix'>
                <Menu
                    className="side-menu"
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
    const {categoryData } = common;
    let retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []

    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        userProfile: profile.userProfile,
        retailList
    };
   
    };
export default connect(
    mapStateToProps,
    { logout }
)(withRouter(SideBar));
