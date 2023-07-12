import React from 'react'
import { connect } from 'react-redux';
import Icon from '../customIcons/customIcons';
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Layout, Col, Row, Typography } from 'antd';
import { TEMPLATE, DEFAULT_ICON } from '../../config/Config';
import { getClassifiedSubcategoryRoute, getClassifiedCatLandingRoute } from '../../common/getRoutes';
import { openLoginModel } from '../../actions/index'
const { Sider } = Layout;
const { Title } = Typography;
let childId = []

class classifiedSidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            permission: false
        }
    }

     /**
    * @method componentWillReceiveProps
    * @description receive props
    */
    componentWillReceiveProps(nextprops, prevProps) {
        const { cat_id, subCategoryId } = this.props
        let catIdInitial = cat_id ? cat_id : this.props.match.params.categoryId;
        let catIdNext = nextprops.cat_id ? nextprops.cat_id : nextprops.match.params.categoryId;
        let subcatIdInitial = subCategoryId ? subCategoryId : this.props.match.params.subCategoryId
        let subCatIdNext = nextprops.subCategoryId ? nextprops.subCategoryId : nextprops.match.params.subCategoryId;
        if (subCatIdNext) {
            if (catIdInitial !== catIdNext && subcatIdInitial !== subCatIdNext) {
               this.setState({isOpen:false})
            }else if(subcatIdInitial !== subCatIdNext){
                this.setState({isOpen:false})
            }
        } else if (catIdInitial !== catIdNext) {
            this.setState({isOpen:false})
        }
    }


    /**
     * @method totalCount
     * @description get total count
     */
    totalCount = (subCategory) => {
        let count = 0
        subCategory.length && subCategory.map(el => {
            count = count + el.classified_count
        })
        return count
    }

    /**
     * @method selectTemplateRoute
     * @description select tempalte route dynamically
     */
    selectTemplateRoute = (el) => {
        const { subCategory } = this.props;
        let parameter = this.props.match.params
        console.log('el', el)
        let parentName = el.parent_category_name ? el.parent_category_name : parameter.categoryName ? parameter.categoryName : ''
        let templateName = el.template_slug ? el.template_slug : 'general'
        let cat_id = el.id
        let path = ''
        if (subCategory) {
            if (templateName === TEMPLATE.GENERAL) {
                path = getClassifiedSubcategoryRoute(templateName, parentName, el.pid, el.name, el.id)
                this.props.history.push(path)
            } else if (templateName === TEMPLATE.JOB) {
                let route = getClassifiedSubcategoryRoute(templateName, parentName, el.pid, el.name, el.id)
                this.props.history.push(route);
            } else if (templateName === TEMPLATE.REALESTATE) {
                path = getClassifiedSubcategoryRoute(templateName, parentName, el.pid, el.name, el.id)
                this.props.history.push(path)
            }
        } else {
            if (templateName === TEMPLATE.GENERAL) {
                path = getClassifiedCatLandingRoute(TEMPLATE.GENERAL, cat_id, el.name)
                this.props.history.push(path)
            } else if (templateName === TEMPLATE.JOB) {
                let route = getClassifiedCatLandingRoute(TEMPLATE.JOB, cat_id, el.name)
                this.props.history.push(route);
            } else if (templateName === 'all') {
                path = getClassifiedSubcategoryRoute(TEMPLATE.REALESTATE, TEMPLATE.REALESTATE, el.pid, el.name, el.id)
                this.props.history.push(path)
            }
        }
    }

    /**
     * @method renderSubCategory
     * @description render subcategory
     */
    renderSubCategory = (childCategory, pid) => {
        const parameter = this.props.match.params
        return childCategory.length !== 0 && childCategory.map((el, i) => {
            let iconUrl = `${this.props.iconUrl}${el.id}/${el.icon}`
            console.log('check', Number(el.id), Number(parameter.subCategoryId))
            return (
                <li
                    className={Number(el.id) === Number(parameter.subCategoryId) ? 'active' : 'child-div'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.selectTemplateRoute(el)}
                >
                    <img
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_ICON
                        }}
                        src={iconUrl} alt='Home' width='20' className={'stroke-color'}
                    />
                    {/* {`${el.name} (${el.classified_count})`} */}
                    {`${el.name}`}
                </li>
            );
        })

    }


    /**
     * @method render
     * @description render component
     */
    render() {
        let parameter = this.props.match.params;
        const {isMenuOpen = false, showAll = true, showBreadCrumb = true, classifiedList, catName, template, subCategory, pid, classifiedCategoryList } = this.props
        let itemList = subCategory ? subCategory : classifiedCategoryList
        const { isOpen, redirectTo } = this.state
        let columnCount = Array.isArray(subCategory) && Math.ceil((subCategory.length + 1) / 10)
        let allPageUrl = '';
        if (Array.isArray(classifiedList) && classifiedList.length) {
            allPageUrl = `/classifieds/all/general/all-sub-categories/${catName}/${classifiedList[0].id}`
            if (template === 'job') {
                allPageUrl = `/classifieds-jobs/all/all-sub-categories/${catName}/${classifiedList[0].id}`
            }
        }
        let categoryName = parameter.categoryName
        console.log('isMenuOpen',isMenuOpen)
        return (
            <div>
                <Sider width={200} className='site-layout-background'>
                    <div className='menu-item-wrap menu-item-wrap-fix'>
                        {showBreadCrumb && <div className={!isMenuOpen && isOpen ? 'hamburger-icon-close' : 'hamburger-icon'} onClick={() => {
                            this.setState({ isOpen: !this.state.isOpen })
                            this.props.toggleSideBar()
                        }}>
                            <Icon icon={isOpen ? 'close' : 'hamburger'} size='18' />
                        </div>}
                        {!isMenuOpen && isOpen && itemList && itemList.length !== 0 &&
                            <div className="child-category test">
                                {showAll ?
                                    <Title
                                        level={4} className='title'
                                    >{categoryName === undefined ? catName : categoryName}</Title> :
                                    <Title level={4} className='title'>{'WELCOME TO CLASSIFIEDS'}</Title>
                                }

                                <Row>
                                    <Col md={24}>
                                        <ul style={{ columnCount: columnCount }}>
                                            {/* {showAll && <li className='child-div' style={{cursor:'pointer'}}
                                            onClick={() => this.setState({ redirectTo: allPageUrl })}>
                                            All 
                                            ({this.totalCount(itemList)}) * need to add icon with all
                                        </li>} */}
                                            {itemList && this.renderSubCategory(itemList, pid)}
                                        </ul>
                                    </Col>
                                </Row>
                            </div>
                        }
                    </div>
                </Sider>
                {redirectTo &&
                    <Redirect push to={{
                        pathname: redirectTo,
                        state: {
                            childCategoryId: childId.length ? childId : []
                        }
                    }}
                    />}
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, common } = store;
    const { isOpenLoginModel, categoryData,isMenuOpen } = common;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser,
        isOpenLoginModel,
        iconUrl: categoryData && categoryData.classifiedAll !== undefined ? common.categoryData.classifiedAll.iconurl : '',
        classifiedCategoryList: categoryData && Array.isArray(categoryData.classifiedFilteredCategory) ? categoryData.classifiedFilteredCategory : [],
        isMenuOpen
    };
}

export default connect(
    mapStateToProps, { openLoginModel }
)(withRouter(classifiedSidebar));

