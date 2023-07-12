import React from 'react'
import { connect } from 'react-redux';
import {Link, Redirect, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import {Dropdown, Card, Col, Rate, Popover } from 'antd';
import Icon from '../../customIcons/customIcons';
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../config/Config'
import { STATUS_CODES } from '../../../config/StatusCode';
import { langs } from '../../../config/localization';
import { SocialShare } from '../../common/social-share'
import { capitalizeFirstLetter } from '../../common'
import { openLoginModel, setFavoriteItemId, addRestaurantInFav, removeRestaurantInFav } from '../../../actions/index'
import { getBookingDetailPageRoute, getBookingSubCatDetailRoute } from '../../../common/getRoutes'

class RestautrantCard extends React.Component {

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
        this.setState({ is_favourite: data.favourites_count === 1 ? true : false })
    }

    onSelection = (data) => {
        
        const { isLoggedIn, loggedInDetail } = this.props;
        const { is_favourite } = this.state
        let parameter = this.props.match.params
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : ''
        
        if (isLoggedIn) {
            if (data.is_favourite === 1 || is_favourite) {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_id: data.id,
                    item_type: 'restaurant',
                    category_id:cat_id
                    // category_id: data.trader_profile.booking_cat_id,

                }
                this.props.removeRestaurantInFav(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, res.data.message)
                        // this.props.callNext()
                        this.setState({ is_favourite: false })

                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_type: 'restaurant',
                    item_id: data.id,
                    category_id:cat_id
                    // category_id: data.trader_profile.booking_cat_id,
                }
                this.props.addRestaurantInFav(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, res.data.message)
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
        const { handyman } = this.props
        let parameter = this.props.match.params
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : el.id
        let templateName = parameter.categoryName
        let subCategoryName = parameter.subCategoryName
        let subCategoryId = parameter.subCategoryId
        let classifiedId = el.user_id;
        let catName = ''
        let path = ''
            path = getBookingSubCatDetailRoute('Restaurant', cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
            // window.open(path, "_blank")
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { data, slug, col } = this.props;
        const { redirect, is_favourite } = this.state
        const menu = (
            <SocialShare {...this.props} />
        );
        let parameter = this.props.match.params
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : data.id
        let subCategoryName = parameter.subCategoryName
        let subCategoryId = parameter.subCategoryId
        let classifiedId = data.user_id;
        let path = getBookingSubCatDetailRoute('Restaurant', cat_id, subCategoryId, subCategoryName, classifiedId)
        return (
            <Col className='gutter-row restaurant-card' md={6} >
                <Card
                    bordered={false}
                    className={'detail-card'}
                    cover={
                        <Link to={path}><img
                            src={(data && data.cover_photo !== undefined && data.cover_photo !== null) ? data.cover_photo : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            //onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}
                            alt={(data && data.business_name !== undefined) ? data.business_name : ''}
                        /></Link>
                    }

                    actions={[
                        <Dropdown overlay={menu} trigger={['click']} overlayClassName='contact-social-detail share-ad resto-social-before'>
                            <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                <Icon icon='share' size='20' />
                            </div>
                        </Dropdown>,
                        <Icon
                            icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                            className={is_favourite ? 'active' : ''}
                            size='20' onClick={() => this.onSelection(data)}
                        />,
                        <Popover title={(data && data.user) ? (`Total Views :  ${data.user.views ? data.user.views : '0'}`) : 0}>
                            <Icon icon='view' size='20' />
                        </Popover>,
                    ]}
                >
                    <Link to={path}><div className='price-box' 
                        //onClick={() => this.selectTemplateRoute(data)} 
                        style={{ cursor: 'pointer' }}
                    >
                        <div className='rate-section'>
                            {data.avg_rating ? `${parseInt(data.avg_rating)}.0` : ''}
                            <Rate disabled value={data.avg_rating ? `${parseInt(data.avg_rating)}.0` : 0.0} />
                        </div>
                        <div className='category-name'>
                            {'Restaurant'}
                        </div>
                    </div></Link>
                    <Link to={path}><div className='title'
                        //onClick={() => this.selectTemplateRoute(data)}
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }}
                    >
                        {(data.business_name ? capitalizeFirstLetter(data.business_name) : '')}
                    </div></Link>
                    <Link to={path}>
                    <div className='category-box' 
                        //onClick={() => this.selectTemplateRoute(data)} 
                        style={{ cursor: 'pointer' }}
                    >
                        <div className='category-name'>
                            {(data && data.cusines_text !== undefined) ? `${data.cusines_text} ` : ''}{(data && data.dietary_text !== undefined) ? data.dietary_text : ''}
                        </div>
                        <div className='location-name'>
                            {data.price ? `AU$${data.price}` : ''}
                        </div>
                    </div></Link>
                </Card>
                {/* {redirect && <Redirect push
                    to={{
                        pathname: redirect
                    }}
                />
                } */}
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
    mapStateToProps, { openLoginModel, setFavoriteItemId, addRestaurantInFav, removeRestaurantInFav }
)(withRouter(RestautrantCard));

