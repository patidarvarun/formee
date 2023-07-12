import React from 'react'
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Card, Row, Col, Rate, Popover, Typography } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../config/Config'
import { STATUS_CODES } from '../../../config/StatusCode';
import { MESSAGES } from '../../../config/Message'
import { langs } from '../../../config/localization';
import { enableLoading, disableLoading, openLoginModel, setFavoriteItemId, addToWishList, removeToWishList } from '../../../actions/index'
import { getClassifiedDetailPageRoute, getRetailDetailPageRoute } from '../../../common/getRoutes'
import { salaryNumberFormate, capitalizeFirstLetter } from '../../common'
import { rating } from '../CommanMethod'
const { Text } = Typography;

class DetailCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            favoriteItem: [],
            is_favourite: false
        }
    }

    /**
   * @method componentDidMount
   * @description called before mounting the component
       */
    componentDidMount() {
        const { data } = this.props;
        this.setState({ is_favourite: data.wishlist === 1 ? true : false })
    }

    onSelection = (data) => {
        const { favoriteItem, is_favourite } = this.state;
        const { isLoggedIn, loggedInDetail } = this.props;
        if (isLoggedIn) {
            if (data.wishlist === 1 || is_favourite) {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: data.classifiedid ? data.classifiedid : data.id,
                }
                this.props.enableLoading()
                this.props.removeToWishList(requestData, res => {
                    this.props.disableLoading()
                    if (res.status === STATUS_CODES.OK) {
                        // toastr.success(langs.success, res.data.msg)
                        toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
                        // this.props.callNext()
                        this.setState({ is_favourite: false })
                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: data.classifiedid ? data.classifiedid : data.id,
                }
                this.props.enableLoading()
                this.props.addToWishList(requestData, res => {
                    this.props.disableLoading()
                    this.setState({ flag: !this.state.flag })
                    if (res.status === STATUS_CODES.OK) {
                        // toastr.success(langs.success, res.data.msg)
                        toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
                        // this.props.callNext()
                        this.setState({ is_favourite: true })
                    }
                })
            }
        } else {
            this.props.openLoginModel()
        }
    }

    /**
     * @method selectTemplateRoute
     * @description navigate to detail Page
     */
    selectTemplateRoute = (el) => {
        let cat_id = (this.props.match.params.categoryId !== undefined) ? (this.props.match.params.categoryId) : (el.parent_categoryid !== undefined) ? (el.parent_categoryid) : el.id

        const { retail } = this.props
        let catName = el.catname
        let classifiedId = el.classifiedid;
        let templateName = el.template_slug;
        let path = ''
        if (retail) {
            path = getRetailDetailPageRoute(cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        } if (templateName === TEMPLATE.GENERAL) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.JOB) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.REALESTATE) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        }
        // window.open(path, "_blank")
    }

    renderRate = (rating) => {
        return (
            <div className='rate-section'>
                <Text>{rating ? rating : ''}</Text>
                {rating && rating === '1.0' && <Rate disabled defaultValue={1} />}
                {rating && rating === '2.0' && <Rate disabled defaultValue={2} />}
                {rating && rating === '3.0' && <Rate disabled defaultValue={3} />}
                {rating && rating === '4.0' && <Rate disabled defaultValue={4} />}
                {rating && rating === '5.0' && <Rate disabled defaultValue={5} />}
            </div>
        )
    }
    /**
     * @method render
     * @description render component
     */
    render() {
        const { data, col } = this.props;
        const { redirect, is_favourite } = this.state
        let rate = data && data.avg_rating ? `${parseInt(data.avg_rating)}.0` : data.reviews && rating(data.reviews)
        let templatename = (data && data.template_slug !== undefined) ? data.template_slug : ''
        let cityname = ''
        if (data.cityname) {
            cityname = data.cityname
        } else if (data.city_data) {
            cityname = data.city_data.City
        }
        return (
        <Col className='gutter-row' md={24} >
            <div className="listing-view">
                <Row gutter={30}>
                    <Col md={5} >
                    <img
                        src={(data && data.imageurl !== undefined && data.imageurl !== null) ? data.imageurl : DEFAULT_IMAGE_CARD}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_IMAGE_CARD
                        }}
                        onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}
                        alt={(data && data.title !== undefined) ? data.title : ''}
                    />
                    </Col>
                    <Col md={13} style={{borderRight:"1px solid #DADADA"}}>
                    <div className="rate-section mt-10 rating-parent ">{rate ? this.renderRate(rate) : 'No reviews yet'}</div>
                        <div className='title'
                            onClick={() => this.selectTemplateRoute(data)}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer'
                            }}
                        >
                            {(data && data.title !== undefined) ? capitalizeFirstLetter(data.title) : ''}
                        </div>
                        <div className='price-box' align="middle" onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}>
                            <div className='price'>
                                {(data && data.price !== undefined) ? `AU$${salaryNumberFormate(parseInt(data.price))}` : ''}
                            </div>
                        </div>
                        <div className='listing-category-box' onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}>
                            <div className='listing-category-name'>
                                {(data && data.catname !== undefined) ? data.catname : ''}
                            </div>
                            {data.tagIcon &&
                            <div className='listing-tag-icon' style={{ backgroundColor: `${data.tagIconColor}` }}>
                                {data.tagIcon}
                            </div>
                        }
                        <ul className="listing-icon">
                            <li>
                                <img
                                    src={require("../../../assets/images/icons/unit-squre-first.svg")}
                                    alt="List"
                                />
                                    <span className="unit-digit">613 m<sup>2</sup></span>
                            </li>
                            <li>
                                <img
                                    src={require("../../../assets/images/icons/unit-squre-second.svg")}
                                    alt="List"
                                />
                                <span className="unit-digit">613 m<sup>2</sup></span>
                            </li>
                        </ul>
                    </div> 
                    </Col>
                    <Col md={6} >
                        <div className="right-detail-block">
                        <ul className="wish-view-like-icon">
                            <li>
                                <Icon
                                icon={templatename === (TEMPLATE.GENERAL) || (templatename === TEMPLATE.JOB) || (templatename === TEMPLATE.REALESTATE)
                                    ? 'email' : 'cart'}
                                size='20'
                                onClick={() => this.selectTemplateRoute(data)}
                                />
                            </li>
                            <li>
                                <Icon
                                icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                                className={is_favourite ? 'active' : ''}
                                size='20' onClick={() => this.onSelection(data)}
                                />
                            </li>
                            <li>
                                <Popover title={(data && data.count !== undefined) ? (`Total Views :  ${data.count ? data.count : '0'}`) : `Total Views : ${(data && data.views !== undefined) ? data.views : '0'}`}>
                                <Icon icon='view' size='20' />
                            </Popover>
                            </li>
                        </ul>
                        <div className="location-discription">
                            <div className='location-name'>
                                {data.cityname && data.cityname !== 'N/A' && <Icon icon='location' size='20' className='mr-5' />}
                                {cityname}
                            </div>
                            <p>Warehouse,</p>
                            <p>Factory & Industrial</p>
                            </div>
                        </div>       
                    </Col>
                </Row>
                    {redirect && <Redirect push
                        to={{
                            pathname: redirect
                        }}
                    />
                    }
            </div> 
            </Col>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, common } = store;
    const { isOpenLoginModel, favoriteId } = common;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser,
        isOpenLoginModel, favoriteId
    };
}

export default connect(
    mapStateToProps, { enableLoading, disableLoading, openLoginModel, setFavoriteItemId, addToWishList, removeToWishList }
)(withRouter(DetailCard));

