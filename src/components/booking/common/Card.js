import React from 'react'
import { connect } from 'react-redux';
import {Link, Redirect, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Card, Col, Rate, Popover } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../config/Config'
import { STATUS_CODES } from '../../../config/StatusCode';
import { langs } from '../../../config/localization';
import { enableLoading, disableLoading, openLoginModel, setFavoriteItemId, addToFavorite, removeToFavorite } from '../../../actions/index'
import { getBookingDetailPageRoute, getBookingSubCatDetailRoute } from '../../../common/getRoutes'
import { capitalizeFirstLetter } from '../../common'

class DetailCard extends React.Component {

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

    /**
    * @method onSelection
    * @description mark favorite unfavorite
    */
    onSelection = (data) => {
        const { isLoggedIn, loggedInDetail } = this.props;
        const { is_favourite } = this.state
        if (isLoggedIn) {
            if (data.is_favourite === 1 || is_favourite) {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_id: data.id
                }
                this.props.enableLoading()
                this.props.removeToFavorite(requestData, res => {
                    this.props.disableLoading()
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, res.data.message)
                        // this.props.callNext()
                        this.setState({ is_favourite: false })

                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_type: 'trader',
                    item_id: data.id,
                    category_id: data.trader_profile.booking_cat_id ? data.trader_profile.booking_cat_id : 0,
                    sub_category_id: data.trader_profile.booking_sub_cat_id ?  data.trader_profile.booking_sub_cat_id : 0 
                }
                this.props.enableLoading()
                this.props.addToFavorite(requestData, res => {
                    this.props.disableLoading()
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
        let parameter = this.props.match.params
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : el.trader_profile && el.trader_profile.booking_cat_id
        let templateName = parameter.categoryName ? parameter.categoryName : el.catname 
        let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : el.sub_cat_name
        let subCategoryId = parameter.subCategoryId ? parameter.subCategoryId : el.trader_profile && el.trader_profile.booking_sub_cat_id
        let classifiedId = el.id;
        let path = ''
        if(templateName === TEMPLATE.RESTAURANT){
            path = getBookingSubCatDetailRoute('Restaurant', cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        }else if (templateName === TEMPLATE.HANDYMAN) {
            path = getBookingDetailPageRoute(el.catname, cat_id, el.catname, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.HANDYMAN || templateName && templateName.toLowerCase() === TEMPLATE.HANDYMAN) {
            path = getBookingSubCatDetailRoute(templateName && templateName.toLowerCase(), cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else {
            path = `/bookings-detail/${el.catname}/${cat_id}/${classifiedId}`
            this.setState({ redirect: path })
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { data, slug, col } = this.props;
        const { redirect, is_favourite } = this.state
        let parameter = this.props.match.params
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : data.trader_profile && data.trader_profile.booking_cat_id
        let templateName = parameter.categoryName ? parameter.categoryName : data.catname 
        let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : data.sub_cat_name
        let subCategoryId = parameter.subCategoryId ? parameter.subCategoryId : data.trader_profile && data.trader_profile.booking_sub_cat_id
        let classifiedId = data.id;
        let path = ''
        if(templateName === TEMPLATE.RESTAURANT){
            path = getBookingSubCatDetailRoute('Restaurant', cat_id, subCategoryId, subCategoryName, classifiedId)
        }else if (templateName === TEMPLATE.HANDYMAN) {
            path = getBookingDetailPageRoute(data.catname, cat_id, data.catname, classifiedId)
        } else if (templateName === TEMPLATE.HANDYMAN || templateName && templateName.toLowerCase() === TEMPLATE.HANDYMAN) {
            path = getBookingSubCatDetailRoute(templateName && templateName.toLowerCase(), cat_id, subCategoryId, subCategoryName, classifiedId)
        } else {
            path = `/bookings-detail/${data.catname}/${cat_id}/${classifiedId}`
        }
        return (
            <Col className='gutter-row' md={6} >
                <Card
                    bordered={false}
                    className={'detail-card main-allcard'}
                    cover={
                        <Link to={path}><img
                            src={(data && data.image !== undefined && data.image !== null) ? data.image : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            //onClick={() => this.selectTemplateRoute(data)} 
                            style={{ cursor: 'pointer' }}
                            alt={(data && data.title !== undefined) ? data.title : ''}
                        /></Link>
                    }

                    actions={[
                        <Link to={path}><Icon
                            icon={'email'}
                            size='20'
                            //onClick={() => this.selectTemplateRoute(data)}
                        /></Link>,
                        <Icon
                            // icon='wishlist'
                            icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                            className={is_favourite ? 'active' : ''}
                            size='20' onClick={() => this.onSelection(data)}
                        />,
                        <Popover title={(data && data.count !== undefined) ? (`Total Views :  ${data.count ? data.count : '0'}`) : `Total Views : ${(data && data.views !== undefined) ? data.views : '0'}`}>
                            <Icon icon='view' size='20' />
                        </Popover>,
                    ]}
                >
                    <Link to={path}><div className='price-box' 
                        //onClick={() => this.selectTemplateRoute(data)} 
                        style={{ cursor: 'pointer' }}
                    >
                        <div className='rate-section'>
                            {data.average_rating ? `${parseInt(data.average_rating)}.0` : 'No reviews yet'}
                            {data.average_rating && <Rate disabled defaultValue={data.average_rating ? `${parseInt(data.average_rating)}.0` : 0.0} />}
                        </div>
                        {data.sub_cat_name !== langs.key.spa &&<div className='price'>
                            {data.trader_profile && data.trader_profile.rate_per_hour ? `AU$${data.trader_profile.rate_per_hour}` : ''}
                        </div>}
                    </div></Link>
                    <Link to={path}><div className='title'
                        //onClick={() => this.selectTemplateRoute(data)}
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                            marginTop: '5px'
                        }}
                    >
                        {(data.trader_profile && data.trader_profile.title ? capitalizeFirstLetter(data.trader_profile.title) : '')}
                    </div></Link>
                    <Link to={path}>
                    <div className='category-box' 
                        //onClick={() => this.selectTemplateRoute(data)} 
                        style={{ cursor: 'pointer' }}
                    >
                        <div className='category-name'>
                            {data && data.sub_cat_name ? data.sub_cat_name : ''}
                        </div>
                        <div className='location-name'>
                            {data.business_city_id && data.business_city_id !== 'N/A' && <Icon icon='location' size='15' className='mr-5' />}
                            {data.business_city_id && data.business_city_id !== 'N/A' ? data.business_city_id : ''}
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
    mapStateToProps, { enableLoading, disableLoading, openLoginModel, setFavoriteItemId, addToFavorite, removeToFavorite }
)(withRouter(DetailCard));

