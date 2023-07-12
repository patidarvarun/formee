import React from 'react'
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr';
import { langs } from '../../config/localization';
import { Col, Row, Typography, Button } from 'antd';
import Icon from '../customIcons/customIcons';
import { openLoginModel } from '../../actions/index'
import { getClassifiedSubcategoryRoute } from '../../common/getRoutes';
import { TEMPLATE } from '../../config/Config';
import PostAdPermission from '../classified-templates/PostAdPermission'
const { Title } = Typography;
let childId = []


class SubHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
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
    renderSubCategory = (childCategory, prid, classifiedList) => {
        const { parentName, pid, template } = this.props;
        return childCategory.length !== 0 && childCategory.map((el, i) => {
            let redirectUrl = getClassifiedSubcategoryRoute(template, parentName, pid, el.name, el.id)
            return (
                <li onClick={() => {
                    this.setState({ redirectTo: redirectUrl, isOpen: false })
                }
                }>
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
        const {isSidebarOpen=false, classifiedList, template, parentName, childName, subCategory, isLoggedIn, pid, showBreadCrumb = true, showOnlySubCatName = false } = this.props
        const { isOpen, redirectTo } = this.state
        let allPageUrl = '';
        let columnCount = Array.isArray(subCategory) && Math.ceil((subCategory.length + 1) / 10)
        allPageUrl = `/classifieds/all/general/all-sub-categories/${parentName}/${pid}`
        if (template === 'job') {
            allPageUrl = `/classifieds-jobs/all/all-sub-categories/${parentName}/${pid}`
        }
        return (
            <div>
                <div className='sub-header child-sub-header'>
                    {/* {showBreadCrumb && <div className='hamburger-icon' onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
                        <Icon icon={isOpen ? 'close' : 'hamburger'} size='20' />
                    </div>} */}
                    {!isSidebarOpen && showOnlySubCatName ? <Title level={4} className='title main-heading-bookg'><span className='child-sub-category'>{childName}</span></Title> :
                        !isSidebarOpen && <Title level={4} className='title main-heading-bookg'>{parentName} {childName &&<span className='sep'>|</span>} {childName &&<span className='child-sub-category'>{childName}</span>}</Title>}
                    <PostAdPermission />
                </div>
                {isOpen && subCategory && subCategory.length !== 0 && <div className='sub-header-menu'>
                    <Row>
                        <Col md={24}>
                            <ul style={{ columnCount: columnCount }}>
                                <li onClick={() => this.setState({ redirectTo: allPageUrl, isOpen: false })}>
                                    All ({this.totalCount(subCategory)})
                                </li>
                                {subCategory && this.renderSubCategory(subCategory, pid, classifiedList)}
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
)(SubHeader);

