import React from 'react'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../config/localization';
import { Link, withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Col, Row, Typography, Button } from 'antd';
import Icon from '../customIcons/customIcons';
import { TEMPLATE } from '../../config/Config';
import { getRetailSubcategoryRoute } from '../../common/getRoutes';
import { openLoginModel } from '../../actions/index'
import PostAdPermission from '../classified-templates/PostAdPermission'
import StartSellingModel from './retail-categories/SellingModel'
const { Title } = Typography;
let childId = []

class SubHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            permission: false,
            subCategory: [],
            isChildOpen:false,
            subChildCategory:[],
            isModelVisible: false
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
     * @method renderSubCategory
     * @description render subcategory
     */
    renderSubCategory = (data) => {
        const parameter = this.props.match.params
        if(data && data.category_childs){
            return data.category_childs.length !== 0 && data.category_childs.map((el, i) => {
                return (
                    <li className={el.id === Number(parameter.subCategoryId) ? 'active' : 'child-div'}
                        onClick={() => {
                            let redirectUrl = getRetailSubcategoryRoute(parameter.categoryName
                                ,el.pid, el.text, el.id)                   
                            this.setState({ redirectTo: redirectUrl, isOpen: false })
                        }}>
                        {`${el.text}(${el.item_counts})`}
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
        const {isModelVisible,isOpen, redirectTo,subCategory,isChildOpen,subChildCategory} = this.state
        let parameter = this.props.match.params;
        const {isLoggedIn, categoryName, subCategoryName } = this.props
        let columnCount = subCategory && Array.isArray(subCategory.category_childs) && Math.ceil((subCategory.category_childs.length + 1) / 5)
        let columnCount1 = subChildCategory && Array.isArray(subChildCategory.category_childs) && Math.ceil((subChildCategory.category_childs.length + 1) / 5)
        let isVisible = subChildCategory && Array.isArray(subChildCategory.category_childs) && subChildCategory.category_childs.length !==0  ? true : false
    
        return (
            <div>
                <div className='sub-header  child-sub-header'>
                    {/* {showDropdown && <div className='hamburger-icon' onClick={() => this.setState({ isOpen: !this.state.isOpen,isChildOpen: false })}>
                        <Icon icon={isOpen ? 'close' : 'hamburger'} size='18' />
                    </div>} */}
                    {!isVisible &&<Title level={4} className='title' style={{cursor:'pointer'}} >
                        {categoryName ? categoryName : parameter.categoryName} {subCategoryName ? `| ${subCategoryName}` : parameter.subCategoryName && `| ${parameter.subCategoryName}` }
                    </Title>}
                    {isVisible && <Title level={4} className='title' style={{cursor:'pointer'}} 
                    // onClick={() => this.setState({ isChildOpen: !this.state.isChildOpen,isOpen:false  })}
                    >
                        {categoryName ? categoryName : parameter.categoryName} {subCategoryName ? `| ${subCategoryName}` : parameter.subCategoryName && `| ${parameter.subCategoryName}` }
                    </Title>}
                    <div className='action' >
                        <Button
                            type='primary'
                            className='btn-blue'
                            size={'large'}
                            onClick={() => this.setState({isModelVisible: true})}
                        >
                            {'Start selling'}
                        </Button>
                    </div>
                </div>
                {!isChildOpen && isOpen && subCategory && <div className='sub-header-menu'>
                    <Row>
                        <Col md={24}>
                            <ul style={{columnCount: columnCount}}>
                                {/* <li className='child-div'
                                    onClick={() => this.setState({ redirectTo: allPageUrl, isOpen: false })}>
                                    All ({this.totalCount(subCategory)})
                                </li> */}
                                {subCategory && this.renderSubCategory(subCategory)}
                            </ul>
                        </Col>
                    </Row>
                </div>}
                {isChildOpen && !isOpen && subChildCategory && <div className='sub-header-menu'>
                    <Row>
                        <Col md={24}>
                            <ul style={{columnCount: columnCount1}}>
                                {/* <li className='child-div'
                                    onClick={() => this.setState({ redirectTo: allPageUrl, isOpen: false })}>
                                    All ({this.totalCount(subCategory)})
                                </li> */}
                                {subChildCategory && this.renderSubCategory(subChildCategory)}
                            </ul>
                        </Col>
                    </Row>
                </div>}
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
                    onCancel={() => this.setState({isModelVisible: false})}
                    isLoggedIn={isLoggedIn}
                /> }
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, common } = store;
    const { isOpenLoginModel,categoryData } = common;
    let retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser,
        isOpenLoginModel,
        retailList,
    };
}

export default connect(
    mapStateToProps, { openLoginModel }
)(withRouter(SubHeader));

