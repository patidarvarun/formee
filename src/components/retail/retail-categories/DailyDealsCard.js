import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import Icon from '../../../components/customIcons/customIcons';
import { DEFAULT_IMAGE_CARD } from '../../../config/Config'
import { getRetailDetailPageRoute } from '../../../common/getRoutes'
import { STATUS_CODES } from '../../../config/StatusCode';
import { langs } from '../../../config/localization';
import { Card, Row, Col, Rate, Typography } from 'antd';
import '../../common/bookingDetailCard/bookingDetailCard.less'
import { rating } from '../../classified-templates/CommanMethod'
import { openLoginModel, setFavoriteItemId, addToFavorite, removeToFavorite } from '../../../actions/index'
import { dateFormate, capitalizeFirstLetter } from '../../common';
const { Text, Paragraph } = Typography;

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
        let cat_id = el.category_id
        let catName = el.category_name
        let classifiedId = el.item_id;
        let path = getRetailDetailPageRoute(cat_id,catName,classifiedId  )
        this.setState({ redirect: path })
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
        const { data } = this.props
        const { redirect } = this.state
        let rate = data && data.item && data.item.avg_reviews && Array.isArray(data.item.avg_reviews) && data.item.avg_reviews.length ? data.item.avg_reviews[0].average_rating : ''
        return (
            <Fragment>
                <Card
                    bordered={false}
                    className={'booking-detail-card daily-deals booking-detail-card-custom '}
                    onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}
                    cover={
                        <img
                            src={data.item && data.item.imageurl ? data.item.imageurl : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            alt={''}
                        />
                    }
                    title={data.user && data.user.user && data.user.user.business_name ? data.user.user.business_name : ''}
                    actions={[
                        <div>
                            {/* {type === 'beauty' && <div className='date-info align-left'><strong>{duration}</strong></div>} */}
                            <div className='date-info align-left'>
                                {`${'valid'} ${dateFormate(data.start_date)} - ${dateFormate(data.end_date)}`}
                            </div>

                        </div>,
                        // <Icon icon='wishlist' size='20' onClick={() => this.onSelection(data)} />,
                    ]}
                >
                    {<div className='tag'>Save <br />{data.discount_percent ? `${data.discount_percent} %` : ''}</div>}
                    <Row>
                        <Col span={13}>
                            {/* {rate ? this.renderRate(rate) : 'No reviews yet'} */}
                            { <div className='rate-section'>
                                {rate ? `${parseInt(rate)}.0`: 'No reviews yet'}
                                {rate && <Rate disabled defaultValue={parseInt(rate)} /> }
                            </div>}
                            <div className='title' style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {data.item && data.item.title && capitalizeFirstLetter(data.item.title)}
                            </div>
                            <div className='category-box'>
                                <div className='category-name'>
                                    {data.subcategory_name ? data.subcategory_name : ''}
                                </div>
                            </div>
                        </Col>
                        <Col span={11}>
                            <div className='price-box'>
                                <div className='price'>
                                    {data.discounted_price ? `AU$${data.discounted_price}` : ''}
                                    <Paragraph className='sub-text'>{'stary from'}</Paragraph>
                                     <div>
                                        <Paragraph className='sub-text data-info'><Icon icon='location' size='15' className='mr-5' />
                                            {data.user && data.user.user && data.user.user.business_city_id ? data.user.user.business_city_id : ''}
                                        </Paragraph>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </Card>
                {redirect && <Redirect push
                    to={{
                        pathname: redirect
                    }}
                />}
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

