import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Typography, Layout, Col, Row } from 'antd';
import { DEFAULT_ICON } from '../../config/Config';
import Icon from '../customIcons/customIcons';
import { getRetailSubcategoryRoute, getRetailCatLandingRoutes } from '../../common/getRoutes';
import {setRetailSubCategories, openLoginModel } from '../../actions/index'
import StartSellingModel from './retail-categories/SellingModel'
const { Sider } = Layout;
const { Title } = Typography;
let childId = []

class SubHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            permission: false,
            subCategory: [],
            isChildOpen: false,
            subChildCategory: [],
            isModelVisible: false
        }
    }

    /**
    * @method componentWillMount
    * @description called before render the component
   */
    componentWillMount() {
        const { cat_id, subCategoryId } = this.props
        let parameter = this.props.match.params
        let subcatIdInitial = subCategoryId ? subCategoryId : parameter.subCategoryId
        let categoryId = cat_id ? cat_id : parameter.categoryId
        this.getChildCategory(categoryId, subcatIdInitial)
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
                this.getChildCategory(catIdNext, subCatIdNext)
            }else if(subcatIdInitial !== subCatIdNext){
                this.getChildCategory(catIdNext, subCatIdNext)
            }
        } else if (catIdInitial !== catIdNext) {
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
        if (subcategories && Array.isArray(subcategories) && subcategories.length) {
            this.setState({ subCategory: subcategories[0].category_childs, isOpen: false }, () => {
                this.getSubChildCategory(childId)
                this.props.setRetailSubCategories(subcategories[0].category_childs)
            })
        }
    }

    /**
     * @method getChildCategory
     * @description get child category
    */
    getSubChildCategory = (id) => {
        const { subCategory } = this.state
        const { listingPage } = this.props
        console.log(id,'listingPage',listingPage)
        let data = subCategory && Array.isArray(subCategory) && subCategory.length ? subCategory : []
        if (data) {
            let subcategories = data && data.filter(el => el.id == id)
            if (subcategories && Array.isArray(subcategories) && subcategories.length) {
                this.props.setRetailSubCategories(subcategories[0].category_childs)
                // console.log('listingPage',subcategories[0])
                // if(listingPage){
                //     this.setState({ subCategory: subcategories[0].category_childs, isOpen: false }) 
                // }else {
                // }
                this.setState({ subChildCategory: subcategories[0], isOpen: false })
            }
        }
    }

    /**
     * @method totalCount
     * @description get total count
     */
    totalCount = (subCategory) => {
        let count = 0
        subCategory.length && subCategory.map(el => {
            count = count + el.item_counts
        })
        return count
    }

    /**
     * @method selectTemplateRoute
     * @description select tempalte route dynamically
     */
    selectTemplateRoute = (el) => {
        const { subCategoryPage, cat_name } = this.props;
        let parameter = this.props.match.params
        let categoryName = parameter.categoryName ? parameter.categoryName : cat_name
        if (subCategoryPage) {
            let path = getRetailSubcategoryRoute(categoryName, el.pid, el.text, el.id)
            this.props.history.push(path)
        } else {
            let path = getRetailCatLandingRoutes(el.id, el.slug)
            this.props.history.push(path)
        }
    }

    /**
     * @method renderSubCategory
     * @description render subcategory
     */
    renderSubCategory = (data) => {
        console.log('data', data)
        const parameter = this.props.match.params
        if (data && data) {
            return data.length !== 0 && data.map((el, i) => {
                console.log('el', el, i)
                return (
                    <li key={i} className={el.id === Number(parameter.subCategoryId) ? 'active' : 'child-div'}
                        onClick={() => this.selectTemplateRoute(el)}>
                        <img
                            onClick={() => this.selectTemplateRoute(el)}

                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_ICON
                            }}
                            src={el.imageurl} alt='Home' width='20' className={'stroke-color'} />
                        {/* {`${el.text}`}{el.item_counts && `(${el.item_counts})`} */}
                        {el.text}
                    </li>
                );
            })
        }
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        let parameter = this.props.match.params;
        const { isModelVisible, isOpen, redirectTo, subCategory, isChildOpen, subChildCategory } = this.state
        const {isMenuOpen = false, retailList, mainPage } = this.props
        let listItem = subCategory.length ? subCategory : retailList
        
        const { isLoggedIn } = this.props
        let categoryName = parameter.categoryName
        let columnCount = subCategory && Array.isArray(subCategory) && Math.ceil((subCategory.length + 1) / 9)
        let columnCount1 = subChildCategory && Array.isArray(subChildCategory) && Math.ceil((subChildCategory.length + 1) / 6)
        console.log('listItem', listItem)
        return (
            <div>
                <Sider width={200} className='site-layout-background'>
                    <div className='menu-item-wrap menu-item-wrap-fix'>
                        <div className={!isMenuOpen && isOpen ? 'hamburger-icon-close' : 'hamburger-icon'} onClick={() => {
                            this.setState({ isOpen: !this.state.isOpen, isChildOpen: false })
                            this.props.toggleSideBar()
                        }}>
                            <Icon icon={isOpen ? 'close' : 'hamburger'} size='18' />
                        </div>
                        {!isMenuOpen && !isChildOpen && isOpen && listItem && <div className="child-category test">
                            {mainPage ? <Title level={4} className='title'>{'WELCOME TO RETAIL'}</Title> :
                                <Title level={4} className='title'>{categoryName}</Title>
                            }
                            <Row>
                                <Col md={24}>
                                    <ul style={{ columnCount: columnCount }}>
                                        {listItem && this.renderSubCategory(listItem)}
                                    </ul>
                                </Col>
                            </Row>
                        </div>}
                        {isChildOpen && !isOpen && subChildCategory && <div className="child-category test">
                            <Row>
                                <Col md={24}>
                                    <ul style={{ columnCount: columnCount1 }}>
                                        {subChildCategory && this.renderSubCategory(subChildCategory)}
                                    </ul>
                                </Col>
                            </Row>
                        </div>}
                    </div>
                </Sider>
                {redirectTo && <Redirect push to={{
                    pathname: redirectTo,
                    state: {
                        childCategoryId: childId.length ? childId : []
                    }
                }}
                />}

                {isModelVisible &&
                    <StartSellingModel
                        visible={isModelVisible}
                        onCancel={() => this.setState({ isModelVisible: false })}
                        isLoggedIn={isLoggedIn}
                    />}
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, common } = store;
    const {isMenuOpen, isOpenLoginModel, categoryData } = common;
    let retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser,
        isOpenLoginModel,
        retailList,
        isMenuOpen
    };
}

export default connect(
    mapStateToProps, { openLoginModel,setRetailSubCategories }
)(withRouter(SubHeader));

