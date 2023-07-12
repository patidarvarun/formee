import React from 'react'
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Col, Row, Typography, Button } from 'antd';
import Icon from '../../customIcons/customIcons';
import { STATUS_CODES } from '../../../config/StatusCode'
import { TEMPLATE, BOOKING_SLUG } from '../../../config/Config';
import { getBookingSubcategoryRoute } from '../../../common/getRoutes';
import { openLoginModel, getBookingSubcategory } from '../../../actions/index'
const { Title } = Typography;
let childId = []

class SubHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
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
     * @method totalCount
     * @description get total count
     */
    totalCount = (subCategory) => {
        let count = 0
        subCategory.length && subCategory.map(el => {
            count = count + el.item_count
        })
        return count
    }

    /**
     * @method renderSubCategory
     * @description render subcategory
     */
    renderSubCategory = (childCategory, pid, classifiedList) => {
        const parameter = this.props.match.params;
        return childCategory.length !== 0 && childCategory.map((el, i) => {
            let categoryName = parameter.categoryName === undefined ? this.props.categoryName : parameter.categoryName
            categoryName = (categoryName === 'EVENT') ? TEMPLATE.EVENT : categoryName
            return (
                <li className={el.id === Number(parameter.subCategoryId) ? 'active' : 'child-div'}
                    onClick={() => {
                        let redirectUrl = getBookingSubcategoryRoute(categoryName, categoryName, parameter.categoryId, el.name, el.id)
                        this.setState({ redirectTo: redirectUrl, isOpen: false })
                    }}>
                    {(categoryName === TEMPLATE.HANDYMAN || categoryName === TEMPLATE.PSERVICES) ? `${el.name} (${el.item_count ? el.item_count : 0})` : `${el.name}`}
                </li>
            );
        })

    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { classifiedList, template, isSubCategory, isLoggedIn, pid, showAll = true } = this.props
        const { isOpen, redirectTo, subCategory } = this.state
        let parameter = this.props.match.params;
        if (parameter.subCategoryName && parameter.subCategoryName === BOOKING_SLUG.MAKE_UP) {
            parameter.subCategoryName = 'Make up'
        }
        if (parameter.categoryName) {
            
        }
        let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : this.props.subCategoryName
        let categoryName = parameter.categoryName === undefined ? this.props.categoryName : parameter.categoryName
        let columnCount = Array.isArray(subCategory) && Math.ceil((subCategory.length + 1) / 10)
        let allPageUrl = getBookingSubcategoryRoute(categoryName, categoryName, parameter.categoryId, '', '', true);
        return (
            <div>
                <div className='sub-header fm-bg-yellow'>
                    {/* <div className='hamburger-icon' onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
                        <Icon icon={isOpen ? 'close' : 'hamburger'} size='20' />
                    </div> */}
                    {parameter.all === TEMPLATE.ALL ?
                        <Title level={4} className='title main-heading-bookg'>{categoryName.replace('-', '')} <span className='sep'>|</span> <span className='text-blue'>All</span></Title> :
                        subCategoryName !== undefined ? <Title className='title' level={4}  >{parameter.categoryName.replace('-', ' ')} <span className='sep'>|</span> <span className='child-sub-category'>{subCategoryName.replace('-', ' ')}</span></Title> :
                            <Title level={4} className='title' style={{ textTransform: 'uppercase' }}>{parameter.categoryName !== undefined ? parameter.categoryName.replace('-', ' ') : this.props.categoryName.replace('-', ' ')}</Title>}
                    </div>

                {/* {isOpen && subCategory && subCategory.length !== 0 && <div className='sub-header-menu'>
                    <Row>
                        <Col md={24}>
                            <ul style={{ columnCount: columnCount }}>
                                {showAll === true && <li className='child-div'
                                    onClick={() => this.setState({ redirectTo: allPageUrl, isOpen: false })}>
                                    All ({this.totalCount(subCategory)})
                                </li>}
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
    mapStateToProps, { openLoginModel, getBookingSubcategory }
)(withRouter(SubHeader));

