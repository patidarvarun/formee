import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import {Link, Redirect, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import Icon from '../../../components/customIcons/customIcons';
import { DEFAULT_IMAGE_CARD, TEMPLATE, BASE_URL } from '../../../config/Config'
import { STATUS_CODES } from '../../../config/StatusCode';
import { langs } from '../../../config/localization';
import { Card, Row, Col, Rate, Typography } from 'antd';
import '../../common/bookingDetailCard/bookingDetailCard.less'
import { openLoginModel, setFavoriteItemId, addToFavorite, removeToFavorite } from '../../../actions/index'
import { getBookingDailyDealsDetailRoutes } from '../../../common/getRoutes'
import { displayDateTimeFormate, dateFormate, dateFormate2,capitalizeFirstLetter } from '../../common';
const { Title, Text, Paragraph } = Typography;

class DailyDealsCard extends React.Component {

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
        if (data) {
            this.setState({ is_favourite: data.is_favourite === 1 ? true : false })
        }
    }

    /**
    * @method onSelection
    * @description favorite unfavorite
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
                this.props.removeToFavorite(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, res.data.message)
                        this.setState({ is_favourite: false })

                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    item_type: 'trader',
                    item_id: data.id,
                    category_id: data.user.booking_cat_id,
                    sub_category_id: data.user.booking_sub_cat_id
                }
                this.props.addToFavorite(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, res.data.message)
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
        const { handyman, type } = this.props
        let parameter = this.props.match.params
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : el.user && el.user.booking_cat_id
        let templateName = parameter.categoryName ? parameter.categoryName : el.category_name
        let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : el.subcategory_name
        let subCategoryId = parameter.subCategoryId ? parameter.subCategoryId : el.user && el.user.booking_sub_cat_id
        let classifiedId = el.user && el.user.user_id;
        let catName = ''
        let path = ''
        if (templateName === TEMPLATE.HANDYMAN || templateName === TEMPLATE.HANDYMAN) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.BEAUTY) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.EVENT) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.WELLBEING) {
            
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        } else if (type === TEMPLATE.PSERVICES) {
            path = getBookingDailyDealsDetailRoutes(TEMPLATE.PSERVICES, cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.PSERVICES) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
            this.setState({ redirect: path })
        }
        // window.open(path, "_blank")
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { data, type } = this.props;
        const { is_favourite, redirect } = this.state
        let parameter = this.props.match.params
        let subCategoryName = parameter.subCategoryName ? parameter.subCategoryName : data.subcategory_name
        let templateName = parameter.categoryName ? parameter.categoryName : data.category_name
        let categoryId = parameter.categoryId;
        let subCategoryId = parameter.subCategoryId ? parameter.subCategoryId : data.user && data.user.booking_sub_cat_id

        let label = '', duration = '', title = '', start_from = '', image = DEFAULT_IMAGE_CARD
        let cat_name = data.category_name, location = '', valid = type !== 'beauty' ? 'Valid' : ''
        let heading = data.user && data.user.user && data.user.user.business_name && data.user.user.business_name !== 'undefined' ? data.user.user.business_name : ''
        let businessName = `${data.discount_percent}% off`
        if (subCategoryId !== undefined) {
            cat_name = data.subcategory_name ? data.subcategory_name : ''
            location = data.user && data.user.user && data.user.user.business_city_id
            valid = 'Valid'
            start_from = 'start from'
        }
        if (data.category_name && data.category_name === TEMPLATE.BEAUTY) {
            businessName = data.discount_percent ? `${data.discount_percent}% off ${heading}` : ''
            title = data.service ? data.service.name : ''
            duration = data.service && data.service.duration ? `${data.service.duration} hours` : ''
            image = (data && data.service && data.service.service_image !== undefined && data.service_image !== null) ? `${data.service.service_image}` : DEFAULT_IMAGE_CARD

        } else if (data.category_name && data.category_name === TEMPLATE.WELLBEING) {
            start_from = subCategoryId === undefined ? (data.actual_price ? `from $${data.actual_price}` : '') : 'start from'
            cat_name = data.subcategory_name
            duration = data.service && data.service.capacity ? data.service.capacity : ''
            title = data.service && data.service.class_name ? data.service.class_name : data.service.name ? data.service.name : ''
            image = (data && data.service && data.service.image !== undefined && data.service.image !== null) ? data.service.image : DEFAULT_IMAGE_CARD
            if (data && data.service) {
                image = cat_name.toLowerCase() === 'fitness' ? (data.service.image !== undefined && data.service.image !== null ? data.service.image : DEFAULT_IMAGE_CARD) : (data.service.service_image !== undefined && data.service.service_image !== null) ? data.service.service_image : DEFAULT_IMAGE_CARD
            }
        }

        //Routing management
        let cat_id = (parameter.categoryId !== undefined) ? (parameter.categoryId) : data.user && data.user.booking_cat_id
        let classifiedId = data.user && data.user.user_id;
        let catName = ''
        let path = ''
        if (templateName === TEMPLATE.HANDYMAN || templateName === TEMPLATE.HANDYMAN) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
        } else if (templateName === TEMPLATE.BEAUTY) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
        } else if (templateName === TEMPLATE.EVENT) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
        } else if (templateName === TEMPLATE.WELLBEING) {
            
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
        } else if (type === TEMPLATE.PSERVICES) {
            path = getBookingDailyDealsDetailRoutes(TEMPLATE.PSERVICES, cat_id, catName, classifiedId)
        } else if (templateName === TEMPLATE.PSERVICES) {
            path = getBookingDailyDealsDetailRoutes(templateName, cat_id, subCategoryId, subCategoryName, classifiedId)
        }
        return (
            <Fragment>
                <Link to={path}><Card
                    bordered={false}
                    className={'booking-detail-card daily-deals booking-detail-card-custom '}
                    //onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}
                    cover={
                        <img
                            src={image}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            alt={''}
                        />
                    }
                    title={businessName}
                    // {'Beauty + Brows'}
                    actions={[
                        <div>
                            {type === 'beauty' && <div className='date-info align-left'><strong>{duration}</strong></div>}
                            <div className='date-info align-left'>
                                {type === 'beauty' ?
                                    `${valid} ${dateFormate(data.start_date)} - ${dateFormate(data.end_date)}`
                                    : `${valid} ${dateFormate2(data.start_date)} - ${dateFormate2(data.end_date)}`
                                }
                            </div>

                        </div>,
                        // <Icon icon='wishlist' size='20' onClick={() => this.onSelection(data)} />,
                    ]}
                >
                    {type === 'beauty' && <div className='tag'>Save <br />{data.discount_percent ? `${data.discount_percent} %` : ''}</div>}
                    <Row>
                        <Col span={13}>
                            <div className='rate-section'>
                                {'3.0'}
                                <Rate allowHalf defaultValue={3.0} />
                            </div>
                            <div className='title' style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {title && capitalizeFirstLetter(title)}
                            </div>
                            <div className='category-box'>
                                <div className='category-name'>
                                    {data.subcategory_name}
                                </div>
                            </div>
                        </Col>
                        <Col span={11}>
                            <div className='price-box'>
                                <div className='price'>
                                    {data.discounted_price ? `AU$${data.discounted_price}` : ''}
                                    {type === 'beauty' && <Paragraph className='sub-text'>per Adult</Paragraph>}
                                    <Paragraph className='sub-text'>{start_from}</Paragraph>
                                    {subCategoryId !== undefined && data.category_name && data.category_name.toLowerCase() === TEMPLATE.BEAUTY && location && <div>

                                        <Paragraph className='sub-text data-info'><Icon icon='location' size='15' className='mr-5' />{location}</Paragraph>

                                    </div>}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card></Link>
                {/* {redirect && <Redirect push
                    to={{
                        pathname: redirect
                    }}
                />} */}
            </Fragment>
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
)(withRouter(DailyDealsCard));

