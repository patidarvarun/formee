import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Layout, Col, Row, Typography } from 'antd';
import Icon from '../customIcons/customIcons'
import { STATUS_CODES } from '../../config/StatusCode'
import { TEMPLATE, BOOKING_SLUG, DEFAULT_ICON } from '../../config/Config';
import { getBookingSubcategoryRoute, getBookingCatLandingRoute } from '../../common/getRoutes';
import { openLoginModel, getBookingSubcategory } from '../../actions/index'
const { Title } = Typography;
let childId = []
const { Sider } = Layout;

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
        let subcatIdInitial = this.props.match.params.subCategoryId
        let subCatIdNext = nextprops.match.params.subCategoryId;
        if (subCatIdNext) {
            if(subcatIdInitial !== subCatIdNext){
                this.setState({isOpen: false})
            }
        }else if ((catIdInitial !== catIdNext)) {
            this.props.getBookingSubcategory(catIdNext, res => {
                if (res.status === STATUS_CODES.OK) {
                    const subCategory = Array.isArray(res.data.data) ? res.data.data : []
                    this.setState({ subCategory: subCategory, isOpen: false })
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
    * @method selectTemplateRoute
    * @description select tempalte route dynamically
    */
    selectTemplateRoute = (el) => {
        const { isSubcategoryPage } = this.props;
        const categoryName = el.parent_category_name ? el.parent_category_name : this.props.match.params.categoryName
        if (isSubcategoryPage) {
            let path = getBookingSubcategoryRoute(categoryName, categoryName, el.pid, el.name, el.id, false)
            this.props.history.push(path)
        } else {
            let path = getBookingCatLandingRoute(el.name, el.id, el.name)
            this.props.history.push(path)
        }
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
                    onClick={() => this.selectTemplateRoute(el)}>
                    <img
                        onClick={() => this.selectTemplateRoute(el)}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_ICON
                        }}
                        src={el.icon} alt='Home' className={'stroke-color'} width='20' />
                    {/* {(categoryName === TEMPLATE.HANDYMAN || categoryName === TEMPLATE.PSERVICES) ? `${el.name} (${el.item_count ? el.item_count : 0})` : `${el.name}`} */}
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
        const {isMenuOpen = false, showDropdown = true, classifiedList, pid, showAll = true, bookingList, isSubcategoryPage } = this.props
        const { isOpen, redirectTo, subCategory } = this.state
        let parameter = this.props.match.params;
        let listItem = subCategory ? subCategory : bookingList
        if (parameter.subCategoryName && parameter.subCategoryName === BOOKING_SLUG.MAKE_UP) {
            parameter.subCategoryName = 'Make up'
        }
        let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : this.props.subCategoryName
        let categoryName = parameter.categoryName === undefined ? this.props.categoryName : parameter.categoryName
        let columnCount = Array.isArray(subCategory) && Math.ceil((subCategory.length + 1) / 9)
        let allPageUrl = getBookingSubcategoryRoute(categoryName, categoryName, parameter.categoryId, '', '', true);
        return (
            <div>
                <Sider width={200} className='site-layout-background'>
                    <div className='menu-item-wrap menu-item-wrap-fix'>
                        {showDropdown && <div className={!isMenuOpen && isOpen ? 'hamburger-icon-close' : 'hamburger-icon'} onClick={() => {
                            this.setState({ isOpen: !this.state.isOpen })
                            this.props.toggleSideBar()
                        }}>
                            <Icon icon={isOpen ? 'close' : 'hamburger'} size='18' />
                        </div>}
                    </div>

                    {!isMenuOpen && isOpen && listItem && listItem.length !== 0 && <div className="child-category test">
                        {parameter.all === TEMPLATE.ALL ?
                            <Title level={4} className='title main-heading-bookg'>{categoryName && categoryName.replace('-', '')} <span className='sep'>|</span> <span className='text-blue'>All</span></Title> :
                            subCategoryName !== undefined ? <Title className='title' level={4}  >{categoryName && categoryName.replace('-', ' ')} <span className='sep'>|</span> <span className='child-sub-category'>{subCategoryName.replace('-', ' ')}</span></Title> :
                                isSubcategoryPage ? <Title level={4} className='title' style={{ textTransform: 'uppercase' }}>{parameter.categoryName !== undefined ? parameter.categoryName.replace('-', ' ') : this.props.categoryName && this.props.categoryName.replace('-', ' ')}</Title> :
                                    <Title level={4} className='title'>{'WELCOME TO BOOKINGS'}</Title>
                        }
                        <Row>
                            <Col md={24}>
                                <ul style={{ columnCount: columnCount }}>
                                    {/* {showAll === true && <li className='child-div'
                                    onClick={() => this.setState({ redirectTo: allPageUrl, isOpen: false })}>
                                    All ({this.totalCount(listItem)})
                                </li>} */}
                                    {listItem && this.renderSubCategory(listItem, pid, classifiedList)}
                                </ul>
                            </Col>
                        </Row>
                    </div>}
                </Sider>
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
    const {isMenuOpen, isOpenLoginModel, categoryData } = common;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser,
        isOpenLoginModel,
        bookingList: categoryData && Array.isArray(categoryData.booking.data) ? categoryData.booking.data : [],
        isMenuOpen
    };
}

export default connect(
    mapStateToProps, { openLoginModel, getBookingSubcategory }
)(withRouter(SubHeader));

