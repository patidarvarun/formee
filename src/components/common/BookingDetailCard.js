import React from 'react'
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Card, Col, Rate, Popover } from 'antd';
import Icon from '../customIcons/customIcons';
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../config/Config'
import { STATUS_CODES } from '../../config/StatusCode';
import { langs } from '../../config/localization';
import { MESSAGES } from '../../config/Message'
import { openLoginModel, setFavoriteItemId, addToFavorite, removeToFavorite } from '../../actions'
// import { getBookingDetailPageRoute, getBookingSubCatDetailRoute } from '../common/getRoutes'

class BookingDetailCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            is_favourite: false
        }
    }


    /**
    * @method componentDidMount
    * @description called before mounting the component
    */
    componentDidMount() {
        const { data } = this.props;
        this.setState({ is_favourite: data.is_favourite === 1 ? true : false })
    }

    onSelection = (data) => {
        const { isLoggedIn, loggedInDetail } = this.props;
        const { is_favourite } = this.state
        if (isLoggedIn) {
            if (data.is_favourite === 1 || is_favourite) {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_id: data.id
                }
                this.props.removeToFavorite(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        // toastr.success(langs.success, res.data.message)
                        toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
                        // this.props.callNext()
                        this.setState({ is_favourite: false })

                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_type: 'trader',
                    item_id: data.id,
                    category_id: data.trader_profile.booking_cat_id,
                    sub_category_id: data.trader_profile.booking_sub_cat_id
                }
                this.props.addToFavorite(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        // toastr.success(langs.success, res.data.message)
                        toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
                        this.setState({ is_favourite: true })
                        // this.props.callNext()
                    }
                })
            }
        } else {
            this.props.openLoginModel()
        }
    }

    /***
     * @method selectTemplateRoute
     * @description navigate to detail Page
     */
    selectTemplateRoute = (el) => {
        // const { handyman } = this.props
        // let parameter = this.props.match.params
        // let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : el.id
        // let templateName = parameter.categoryName
        // let subCategoryName = parameter.subCategoryName
        // let subCategoryId = parameter.subCategoryId
        // let classifiedId = el.id;
        // let catName = ''
        // let path = ''
        // if (handyman && handyman === TEMPLATE.HANDYMAN) {
        //     path = getBookingDetailPageRoute(TEMPLATE.HANDYMAN, cat_id, catName, classifiedId)
        //     this.setState({ redirect: path })
        // }else
        // if (templateName === TEMPLATE.HANDYMAN) {
        //     //path = getBookingDetailPageRoute(templateName, cat_id, catName, classifiedId)
        //     path = getBookingSubCatDetailRoute(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
        //     this.setState({ redirect: path })
        // }else if (templateName === TEMPLATE.BEAUTY) {
        //     path = getBookingSubCatDetailRoute(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
        //     this.setState({ redirect: path })
        // }else if (templateName === TEMPLATE.EVENT) {
        //     path = getBookingSubCatDetailRoute(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
        //     this.setState({ redirect: path })
        // }else if (templateName === TEMPLATE.WELLBEING) {
        //     path = getBookingSubCatDetailRoute(templateName,cat_id,subCategoryId,subCategoryName,classifiedId )
        //     this.setState({ redirect: path })
        // }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { data, slug } = this.props;
        const { redirect, is_favourite } = this.state
        return (
            <Col className='gutter-row' md={8} >
                <Card
                    bordered={false}
                    className={'detail-card'}
                    cover={
                        <img
                            src={(data && data.image !== undefined && data.image !== null) ? data.image : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            // onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}
                            alt={(data && data.title !== undefined) ? data.title : ''}
                        />
                    }

                    actions={[
                        <Icon
                            icon={'cart'}
                            size='20'
                            onClick={() => this.selectTemplateRoute(data)}
                        />,
                        <Icon
                            icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                            className={is_favourite ? 'active' : ''}
                            size='20' onClick={() => this.onSelection(data)}
                        />,
                        <Popover title={(data && data.count !== undefined) ? (`Total Views :  ${data.count ? data.count : '0'}`) : `Total Views : ${(data && data.views !== undefined) ? data.views : '0'}`}>
                            <Icon icon='view' size='20' />
                        </Popover>,
                    ]}
                >
                    <div className='price-box' onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}>
                        <div className='rate-section'>
                            {data.average_rating  ? `${parseInt(data.average_rating)}.0` : 'No reviews yet'}
                            {data.average_rating && <Rate disabled defaultValue={data.average_rating  ? `${parseInt(data.average_rating)}.0` : 0.0} />}
                        </div>
                        <div className='price'>
                            {data.trader_profile.rate_per_hour ? `AU$${data.trader_profile.rate_per_hour}` : ''}
                        </div>
                    </div>
                    <div className='title'
                        onClick={() => this.selectTemplateRoute(data)}
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }}
                    >
                        {(data.trader_profile.title ? data.trader_profile.title : '')}
                    </div>
                    <div className='category-box' onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}>
                        <div className='category-name'>
                            {(data && data.catname !== undefined) ? data.catname : ''}
                        </div>
                        <div className='location-name'>
                            {/* {data.business_location && data.business_location !== 'N/A' && <Icon icon='location' size='15' className='mr-5' />}
                            {data.business_location && data.business_location !== 'N/A' ? data.business_location : ''} */}
                            {data.business_city_id && data.business_city_id !== 'N/A' && <Icon icon='location' size='15' className='mr-5' />}
                            {data.business_city_id && data.business_city_id !== 'N/A' ? data.business_city_id : ''}
                        </div>
                    </div>
                </Card>
                {redirect && <Redirect push
                    to={{
                        pathname: redirect
                    }}
                />
                }
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
    mapStateToProps, { openLoginModel, setFavoriteItemId, addToFavorite, removeToFavorite }
)(withRouter(BookingDetailCard));
