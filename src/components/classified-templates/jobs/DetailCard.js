import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import { Card, Col, Row, Rate, Popover, Empty } from 'antd';
import Icon from '../../customIcons/customIcons';
import { TEMPLATE } from '../../../config/Config';
import { langs } from '../../../config/localization';
import { MESSAGES } from '../../../config/Message'
import { getClassifiedDetailPageRoute } from '../../../common/getRoutes'
import { STATUS_CODES } from '../../../config/StatusCode';
import { withRouter } from 'react-router'
import { addToWishList, removeToWishList, openLoginModel, setFavoriteItemId } from '../../../actions/index';
import './detailCard.less';
import { displayDateTimeFormate,capitalizeFirstLetter } from '../../common';
import { rating } from '../CommanMethod'

class DetailCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            favoriteItem: []
        }
    }

    onSelection = (data) => {
        const { isLoggedIn, loggedInDetail } = this.props;
        if (isLoggedIn) {
            if (data.wishlist === 1) {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: data.classifiedid,
                }
                this.props.removeToWishList(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
                        // toastr.success(langs.success,res.data.msg)
                        this.props.callNext()
                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: data.classifiedid,
                }
                this.props.addToWishList(requestData, res => {
                    this.setState({ flag: !this.state.flag })
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
                        // toastr.success(langs.success,res.data.msg)
                        this.props.callNext()
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
        let cat_id = this.props.match.params.categoryId !== undefined ? this.props.match.params.categoryId : el.id
        let classifiedId = el.classifiedid;
        let templateName = el.template_slug;
        let catName = el.catname;
        let path = ''
        if (templateName === TEMPLATE.GENERAL) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.JOB) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        } else if (templateName === TEMPLATE.REALESTATE) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
            this.setState({ redirect: path })
        }
    }

    /**
     * @method renderCards
     * @description render cards detail
     */
    renderCards = (data) => {
        let rate = data && data.reviews && rating(data.reviews)
        return (
            <Card
                bordered={false}
                className={'job-detail-card'}
            >
                <Row onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}>
                    <Col md={20}>
                        {data.title &&
                            <div className='title' style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {data.title && capitalizeFirstLetter(data.title)}
                            </div>
                        }
                        {data.company_name && data.company_name !== 'N/A' &&
                            <div className='company-name'>
                                {data.company_name}
                            </div>
                        }
                        {data.location && data.location !== 'N/A' &&
                            <div className='location-name'>
                                {data.location}
                            </div>
                        }
                        <div className='price-box'>
                            <div className='price'>$60,000 - $80,000 a year</div>
                        </div>
                        {data.description &&
                            <div className='description'>
                                {data.description}
                            </div>
                        }
                        <div className='category-box'>
                            {data.catname &&
                                <div className='category-name'>
                                    {data.catname}
                                </div>
                            }
                            <div className='job-name'>
                                {'Accounting'}
                            </div>
                        </div>
                    </Col>
                    <Col md={4} className='align-right'>
                        {data.classified_created_date && displayDateTimeFormate(data.classified_created_date)}
                    </Col>
                </Row>
                <Row>
                    <Col md={20}>
                        <ul className='ant-card-actions'>
                        <li>
                            <Icon
                                icon='mouse-pointer'
                                size='20'
                                onClick={() => this.selectTemplateRoute(data)}
                            />
                        </li>
                        <li>
                            <Icon
                                icon='wishlist'
                                className={data.wishlist === 1 ? 'active' : ''}
                                size='20' onClick={() => this.onSelection(data)}
                            />
                        </li>
                        <li>
                            <Popover title={`Total Views : ${data.views ? data.views : '0'}`}>
                                <Icon icon='view' size='20' />
                            </Popover>
                        </li>
                        </ul>
                    </Col>
                </Row>
            </Card >
        )
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { data } = this.props;
        const { redirect } = this.state
        return (
            <Col className='gutter-row' md={24}>
                {this.renderCards(data)}
                {(redirect && <Redirect push
                    to={{
                        pathname: redirect
                    }}
                />
                )}
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
    mapStateToProps, { addToWishList, removeToWishList, openLoginModel, setFavoriteItemId }
)(withRouter(DetailCard));

