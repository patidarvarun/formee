import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import { Typography, Row, Col, Button, Modal } from 'antd';
import { fetchMasterDataAPI, getUserMenuList, postCategory, enableLoading, disableLoading, getClassfiedCategoryListing, menuSkip } from '../../actions/index';
import { STATUS_CODES } from '../../config/StatusCode';
import { langs } from '../../config/localization';
import { MESSAGES } from '../../config/Message';
import { TEMPLATE } from '../../config/Config'
import { getClassifiedCatLandingRoute, getBookingCatLandingRoute, getRetailCatLandingRoutes, getClassifiedSubcategoryRoute } from '../../common/getRoutes'
import '../header/header.less';
const { Title, } = Typography;

class YourMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingList: [],
            retailList: [],
            classifiedList: [],
            editable: undefined,
            isEmpty: false,
            selectedItem: '',
            classifiedItem: '',
            bookingItem: '',
            retailItem: '',
            selected: false,
            selected1: [], selected2: [], selected3: [], foodScanner: ''
        };
    }

    /**
     * @method componentWillMount
     * @description called before render component
     */
    componentWillMount() {
        this.getUserMenu()
    }

    /**
     * @method getUserMenu
     * @description get all selected user menu list
     */
    getUserMenu = () => {
        this.props.enableLoading()
        this.props.getUserMenuList(res => {
            if (res.status === STATUS_CODES.OK) {
                const data = res.data && res.data.data
                const isEmpty = data.booking.length === 0 && data.retail.length === 0 && data.classified.length === 0 && data.foodScanner.length === 0;
                if (isEmpty) {
                    this.getAllCategory()
                } else {
                    // const classified = data.classified && data.classified.filter(el => el.pid === 0)
                    console.log('data.classified: ', data.classified);
                    this.setState({ bookingList: data.booking, retailList: data.retail, classifiedList: data.classified, editable: true, selected1: data.booking, selected2: data.retail, selected3: data.classified, foodScanner: data.foodScanner })
                    this.props.disableLoading()
                }
            }
        })
    }

    /**
    * @method getAllCategory
    * @description get all category list
    */
    getAllCategory = () => {
        this.props.enableLoading()
        this.setState({ editable: false })
        const requestData = {
            timeinterval: 0
        }
        this.props.fetchMasterDataAPI(requestData, res => {
            const classifiedSubcategory = res && res.classified && Array.isArray(res.classifiedFilteredCategory) ? res.classifiedFilteredCategory : []
            // const classified = classifiedSubcategory && classifiedSubcategory.filter(el => el.pid === 0)
            const bookingSubcategory = res && res.booking && Array.isArray(res.booking.data) ? res.booking.data : []
            const retailSubcategory = res && res.retail && Array.isArray(res.retail.data) ? res.retail.data : []
            this.setState({ bookingList: bookingSubcategory, retailList: retailSubcategory, classifiedList: classifiedSubcategory, editable: false, isEmpty: true }, () => {
                if (this.state.editable === false) {
                    this.getSelectedCategoty()
                    this.props.disableLoading()
                }
            })
        })

    }

    /**
     * @method onFinish
     * @description handle onsubmit
     */
    onFinish = () => {
        const { classifiedItem, bookingItem, retailItem, selected } = this.state;
        const { onCancel, menuSkiped, history } = this.props
        const requestData = {
            booking: bookingItem.length > 0 && bookingItem.join(','),
            classified: classifiedItem.length > 0 && classifiedItem.join(','),
            retail: retailItem.length > 0 && retailItem.join(','),
            foodScanner: selected ? 'Food Scanner' : ''
        }
        this.props.postCategory(requestData, res => {
            if (res.status === STATUS_CODES.OK) {
                toastr.success(langs.success, MESSAGES.MENU_SAVED_SUCCESS)
                onCancel();
                if (menuSkiped) {

                    this.props.menuSkip(res => { })
                    const pathName = history && history.location ? history.location.pathname : '/'
                    if (pathName === '/intermediate') {
                        this.props.history.push('/')
                    } else {
                        this.props.history.push(pathName)
                    }
                }
            }
        })
    }

    /**
   * @method renderSubcategory
   * @description render subcategory based on category type
   */
    renderSubcategory = (categoryType, key) => {
        const { editable } = this.state;
        if (categoryType && categoryType !== undefined) {
            return categoryType.length !== 0 && categoryType.map((data, i) => {
                let isSelected = this.selectedCategory(key, data)
                return (
                    <li key={i} onClick={() => this.onSelection(data, key)} className={isSelected && 'active'}>
                        <span>{key === langs.key.retail && !editable ? data.text : data.name}</span>
                    </li>
                )
            });
        }
    }

    /**
     * @method getSelectedCategoty
     * @description get all pre selected categories
     */
    getSelectedCategoty = () => {
        const { selected1, selected2, selected3, foodScanner } = this.state;
        const notSelected = selected1 && selected1.length === 0 && selected2 && selected2.length === 0 && selected3 && selected3.length === 0 && foodScanner && foodScanner.length === 0;
        if (!notSelected) {
            let temp1 = selected1 && selected1.map((el) => el.id);
            let temp2 = selected2 && selected2.map((el) => el.id);
            let temp3 = selected3 && selected3.map((el) => el.id);
            this.setState({
                bookingItem: temp1,
                retailItem: temp2,
                classifiedItem: temp3,
                selected: foodScanner !== '' ? true : false
            });
        }
    }

    /**
       * @method selectTemplateRoute
       * @description decide template to navigate the logic
       */
    selectTemplateRoute = (el, key) => {
        if (key === langs.key.classified) {
            let reqData = {
                id: el.id,
                page: 1,
                page_size: 10
            }
            this.props.onCancel()
            let templateName = el.template_slug
            let cat_id = el.id
            let path = ''
            if (templateName === TEMPLATE.GENERAL) {
                path = getClassifiedCatLandingRoute(TEMPLATE.GENERAL, cat_id, el.name)
                this.props.history.push(path)
            } else if (templateName === TEMPLATE.JOB) {
                let route = getClassifiedCatLandingRoute(TEMPLATE.JOB, cat_id, el.name)
                this.props.history.push(route);
            } else if (templateName === 'all') {
                path = getClassifiedSubcategoryRoute(TEMPLATE.REALESTATE, TEMPLATE.REALESTATE, el.pid, el.name, el.id, false)
                this.props.history.push(path)
            }

        } else if (key === langs.key.booking) {
            // let slug = el.slug
            let slug = el.name
            if (slug === TEMPLATE.HANDYMAN) {
                let path = getBookingCatLandingRoute(TEMPLATE.HANDYMAN, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.BEAUTY) {
                let path = getBookingCatLandingRoute(TEMPLATE.BEAUTY, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.EVENT) {
                let path = getBookingCatLandingRoute(TEMPLATE.EVENT, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.WELLBEING) {
                let path = getBookingCatLandingRoute(TEMPLATE.WELLBEING, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.RESTAURANT) {
                let path = getBookingCatLandingRoute(TEMPLATE.RESTAURANT, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.PSERVICES || slug === 'Professional Services') {
                let path = getBookingCatLandingRoute(TEMPLATE.PSERVICES, el.id, el.name)
                this.props.history.push(path)
            } else if (slug === TEMPLATE.SPORTS) {
                let path = getBookingCatLandingRoute(TEMPLATE.SPORTS, el.id, el.name)
                this.props.history.push(path)
            }else if (slug === TEMPLATE.TURISM) {
                let path = getBookingCatLandingRoute(TEMPLATE.TURISM, el.id, el.name)
                this.props.history.push(path)
            }
            this.props.onCancel()
        } else if (key === langs.key.retail) {
            let path = getRetailCatLandingRoutes(el.id, el.name)
            this.props.history.push(path)
            this.props.onCancel()
        }
    }


    /**
     * @method onSelection
     * @description handle select subcategory
     */
    onSelection = (item, key) => {
        const { classifiedItem, bookingItem, retailItem, editable, isEmpty } = this.state;
        if (!editable && isEmpty) {
            if (key === langs.key.classified) {
                let isSelected = classifiedItem.length !== 0 && classifiedItem.includes(item.id);
                if (isSelected) {
                    this.setState({
                        classifiedItem: [...classifiedItem.filter((e) => e !== item.id)],
                    })
                } else {
                    this.setState({
                        classifiedItem: [...this.state.classifiedItem, item.id],
                    });
                }
            } else if (key === langs.key.booking) {
                let isSelected = bookingItem.length !== 0 && bookingItem.includes(item.id);
                if (isSelected) {
                    this.setState({
                        bookingItem: [...bookingItem.filter((e) => e !== item.id)],
                    })
                } else {
                    this.setState({
                        bookingItem: [...this.state.bookingItem, item.id],
                    });
                }
            } else if (key === langs.key.retail) {
                let isSelected = retailItem.length !== 0 && retailItem.includes(item.id);
                if (isSelected) {
                    this.setState({
                        retailItem: [...retailItem.filter((e) => e !== item.id)],
                    })
                } else {
                    this.setState({
                        retailItem: [...this.state.retailItem, item.id],
                    });
                }
            }
        }
        if (editable) {
            if (key === langs.key.classified || key === langs.key.booking || key === langs.key.retail) {
                this.selectTemplateRoute(item, key)
            }
        }
    }

    /**
     * @method selectedCategory
     * @description get selected categories
     */
    selectedCategory = (key, data) => {
        const { classifiedItem, retailItem, bookingItem } = this.state;
        let isSelected = ''
        if (key === langs.key.classified) {
            isSelected = classifiedItem.includes(data.id);
        } else if (key === langs.key.retail) {
            isSelected = retailItem.includes(data.id);
        } else if (key === langs.key.booking) {
            isSelected = bookingItem.includes(data.id);
        }
        return isSelected
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const { bookingList, retailList, classifiedList, editable, isEmpty, selected, foodScanner } = this.state;
        let isBokkingVisible = bookingList && bookingList.length !== 0
        let isClassifiedVisible = classifiedList && classifiedList.length !== 0
        let isRetailVisible = retailList && retailList.length !== 0

        return (
            <Modal
                title={editable !== undefined && (editable ? 'Your Menu' : 'Select your customised menu')}
                visible={this.props.visible}
                className={'custom-modal your-menu-modal'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <div className='menu-wrap'>
                    <Row gutter={[26, 0]} className={`category-menu ${editable !== undefined && (editable ? 'not-editable-menu' : 'editable-menu')}`}>
                        {isRetailVisible && <Col lg={5} className='retail-menu'>
                            <Link to='/retail' onClick={() => this.props.onCancel()}> <Title level={4}>{'Retail'}</Title></Link>
                            <ul>
                                {this.renderSubcategory(retailList, langs.key.retail)}
                            </ul>
                        </Col>}
                        {isBokkingVisible && <Col lg={6} className='bookings-menu'>
                            <Link to='/bookings'><Title level={4} onClick={() => this.props.onCancel()}>{'Bookings'}</Title></Link>
                            <ul>
                                {this.renderSubcategory(bookingList, langs.key.booking)}
                            </ul>
                        </Col>}
                        {isClassifiedVisible && <Col lg={7} className='classifieds-menu'>
                            <Link to='/classifieds'><Title level={4} onClick={() => this.props.onCancel()}>{'Classifieds'}</Title></Link>
                            <ul>
                                {this.renderSubcategory(classifiedList, langs.key.classified)}
                            </ul>
                        </Col>}
                        {isEmpty && <Col lg={5} className='food-scanner-menu'>
                            <Title level={4}>{'Food Scanner'}</Title>
                            <ul onClick={() => this.setState({ selected: !this.state.selected })}>
                                <li className={selected && 'active'} >Food Scanner</li>
                            </ul>
                        </Col>}
                        {!isEmpty && foodScanner !== '' && <Col lg={5} className='food-scanner-menu'>
                            <Link to='/food-scanner' onClick={() => this.props.onCancel()}><Title level={4}>{'Food Scanner'}</Title></Link>
                            <ul onClick={() => this.setState({ selected: !this.state.selected })}>
                                <Link to='/food-scanner' onClick={() => this.props.onCancel()}><li className={selected && 'active'} >Food Scanner</li></Link>
                            </ul>
                        </Col>}
                    </Row>
                </div>
                { editable !== undefined && <div className='align-right clearfix'>
                    {editable ? <Button
                        type='ghost'
                        shape='round'
                        onClick={this.getAllCategory}
                        className='pull-right mr-80'
                    >
                        {'Edit Your Menu'}
                    </Button> :
                        <Button
                            type='primary'
                            shape='round'
                            className='btn-blue pull-right mr-80'
                            htmlType='submit'
                            onClick={this.onFinish}
                        >
                            {'SAVE'}
                        </Button>}
                </div>}
            </Modal>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        menuSkiped: auth.isLoggedIn ? auth.loggedInUser.menu_skipped === 0 : false
    };
};

export default connect(mapStateToProps,
    { menuSkip, fetchMasterDataAPI, getUserMenuList, postCategory, enableLoading, disableLoading, getClassfiedCategoryListing }
)(withRouter(YourMenu));
