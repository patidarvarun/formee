import React from 'react'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../config/localization'; 
import { Link, withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Col, Row, Typography, Button } from 'antd';
import Icon from '../customIcons/customIcons';
import { TEMPLATE } from '../../config/Config';
import { getClassifiedSubcategoryRoute } from '../../common/getRoutes';
import { openLoginModel } from '../../actions/index'
import PostAdPermission from '../classified-templates/PostAdPermission'
const { Title } = Typography;
let childId = []

class SubHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            permission: false
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
     * @method renderSubCategory
     * @description render subcategory
     */
    renderSubCategory = (childCategory, pid, classifiedList) => {
        const { template, catName } = this.props;
        const parentName = catName
        let templateName = template
        return childCategory.length !== 0 && childCategory.map((el, i) => {
            let path = getClassifiedSubcategoryRoute(templateName, parentName, pid, el.name, el.id, false)
            return (
                <li className='child-div'
                    onClick={() => {
                        let redirectUrl = getClassifiedSubcategoryRoute(templateName, parentName, pid, el.name, el.id)
                        this.setState({ redirectTo: redirectUrl, isOpen: false })                    
                    }}>
                    {`${el.name} (${el.classified_count})`}
                </li>
            );
        })

    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const {isSidebarOpen = false, classifiedList, catName, template, parentName, isSubCategory, subCategory, isLoggedIn, pid } = this.props
        console.log('isSidebarOpen',isSidebarOpen)
        const { isOpen, redirectTo } = this.state
        let parameter = this.props.match.params;
        let templateName = template
        let columnCount = Array.isArray(subCategory) && Math.ceil((subCategory.length + 1) / 10)
        let path = getClassifiedSubcategoryRoute(templateName, catName, pid, '', '', true)
        let allPageUrl = '';
        if (Array.isArray(classifiedList) && classifiedList.length) {
            allPageUrl = `/classifieds/all/general/all-sub-categories/${catName}/${classifiedList[0].id}`
            if (template === 'job') {
                allPageUrl = `/classifieds-jobs/all/all-sub-categories/${catName}/${classifiedList[0].id}`
            }
        }
        let categoryName = parameter.categoryName
        let isVisible = categoryName === langs.key.residential || categoryName === langs.key.commercial ? false : true
        return (
            <div>
                <div className='sub-header child-sub-header'>
                    {/* {pid !== undefined && isVisible && <div className='hamburger-icon' onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
                        <Icon icon={isOpen ? 'close' : 'hamburger'} size='20' />
                    </div>} */}
                    {!isSidebarOpen && <Title level={4} className='title'>{categoryName === undefined ? catName : categoryName}</Title>}
                    <PostAdPermission />
                </div>
                {/* {isOpen && subCategory && subCategory.length !== 0 && <div className='sub-header-menu'>
                    <Row>
                        <Col md={24}>
                            <ul style={{ columnCount: columnCount }}>
                                <li className='child-div'
                                    onClick={() => this.setState({ redirectTo: allPageUrl, isOpen: false })}>
                                    All ({this.totalCount(subCategory)})
                                </li>
                                {subCategory && this.renderSubCategory(subCategory, pid, classifiedList)}
                            </ul>
                        </Col>
                    </Row>
                </div>} */}
                {redirectTo && <Redirect push to={{
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
    const { isOpenLoginModel } = common;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser,
        isOpenLoginModel
    };
}

export default connect(
    mapStateToProps, { openLoginModel }
)(withRouter(SubHeader));

