import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom'
import { Layout, Menu, Typography } from 'antd';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { STATUS_CODES } from '../../../config/StatusCode'
import {getBookingSubcategoryRoute, getBookingCatLandingRoute } from '../../../common/getRoutes'
import { TEMPLATE, DEFAULT_ICON } from '../../../config/Config'
import { logout,getBookingSubcategory } from '../../../actions/index';
import { langs } from '../../../config/localization';
import Icon from '../../customIcons/customIcons';
import Back from '../../common/Back'
import '../../sidebar/sidebar.less';
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
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.categoryId
        let catIdNext = nextprops.match.params.categoryId
        if ((catIdInitial !== catIdNext)) {
            this.props.getBookingSubcategory(catIdNext, res => {
                if (res.status === STATUS_CODES.OK) {
                    const subCategory = Array.isArray(res.data.data) ? res.data.data : []
                    this.setState({ subCategory: subCategory })
                }
            })
        }
    }


    /**
    * @method componentWillMount
    * @description called before render the component
    */
    componentWillMount() {
        let parameter = this.props.match.params
        this.props.getBookingSubcategory(parameter.categoryId, res => {
            if (res.status === STATUS_CODES.OK) {
                const subCategory = Array.isArray(res.data.data) ? res.data.data : []
                this.setState({ subCategory: subCategory })
            }
        })
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
        const { isSubcategoryPage} = this.props;
        const categoryName = el.parent_category_name ? el.parent_category_name : this.props.match.params.categoryName
        let slug = el.slug
        if(isSubcategoryPage){
            let path = getBookingSubcategoryRoute(categoryName, categoryName, el.pid, el.name, el.id, false)
            this.props.history.push(path)
        }else {
            let path = getBookingCatLandingRoute(el.name, el.id, el.name)
            this.props.history.push(path)
        }
    }

    /**
     * @method Logout User
     * @description Logout the user & clear the Session 
     */
    renderIcons = () => {
        const { isSubcategoryPage, bookingList, activeCategoryId } = this.props;
        const { subCategory } = this.state
        let list = isSubcategoryPage ? subCategory : bookingList
        //let list = bookingList
        return list.map((el) => {
            return (
                <Menu.Item key={el.id} className={el.id == activeCategoryId ? 'menu-active' : ''}   title={el.name}>
                    <img
                        onClick={() => this.selectTemplateRoute(el)}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_ICON
                        }}
                        src={el.icon} alt='Home'  className={'stroke-color'} />
                </Menu.Item>
            )
        })
    };

    /**
     * @method render
     * @description render component
     */
    render() {
        const { isLoggedIn, activeCategoryId,bookingList } = this.props;
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
    const { savedCategories, categoryData } = common;
    let bookingList = []
    bookingList = categoryData && Array.isArray(categoryData.booking.data) ? categoryData.booking.data : []
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        userProfile: profile.userProfile,
        iconUrl: categoryData.classifiedAll !== undefined ? common.categoryData.classifiedAll.iconurl : '',
        bookingList,
    };
   
    };
export default connect(
    mapStateToProps,
    { logout,getBookingSubcategory,getBookingSubcategoryRoute}
)(withRouter(SideBar));
