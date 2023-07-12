import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {Link, Redirect } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import { Card, Col, Row, Rate, Popover, Empty, Button } from 'antd';
import Icon from '../customIcons/customIcons';
import { TEMPLATE } from '../../config/Config';
import { langs } from '../../config/localization';
import { MESSAGES } from '../../config/Message'
import { getClassifiedDetailPageRoute } from '../../common/getRoutes'
import { STATUS_CODES } from '../../config/StatusCode';
import { withRouter } from 'react-router'
import {enableLoading, disableLoading, addToWishList, removeToWishList, openLoginModel, setFavoriteItemId } from '../../actions/index';
import '../classified-templates/jobs/detailCard.less';
import {convertHTMLToText,salaryNumberFormate, displayDateTimeFormate,capitalizeFirstLetter } from '../common';
import { rating } from '../classified-templates/CommanMethod';
import { HeartOutlined } from "@ant-design/icons";

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
        const { is_favourite } = this.state;
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
                        toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
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
                        toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
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
        let cat_id = this.props.match.params.categoryId !== undefined ? this.props.match.params.categoryId : el.id
        let classifiedId = el.classifiedid ? el.classifiedid : el.id;
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
        // window.open(path, "_blank")
    }

    /**
     * @method renderCards
     * @description render cards detail
     */
    renderCards = (data) => {
        const {is_favourite} = this.state
        let rate = data && data.reviews && rating(data.reviews)
        let temp = data.spicification && Array.isArray(data.spicification) && data.spicification.length ? data.spicification : []
        let salary1 = temp.length && temp.filter(el => el.slug === 'minimum_salary')
        let salary_min = salary1 && salary1.length ? salary1[0].value : ''
        let salary2 = temp.length && temp.filter(el => el.slug === 'maximum_salary')
        let salary_max = salary2 && salary2.length ? salary2[0].value : ''
        let salary_range = salary_min && salary_max && `$${salaryNumberFormate(salary_min)} - $${salaryNumberFormate(salary_max)}`
        
        let cat_id = this.props.match.params.categoryId !== undefined ? this.props.match.params.categoryId : data.id
        let classifiedId = data.classifiedid ? data.classifiedid : data.id;
        let templateName = data.template_slug;
        let catName = data.catname;
        let path = ''
        if (templateName === TEMPLATE.GENERAL) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
        } else if (templateName === TEMPLATE.JOB) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
        } else if (templateName === TEMPLATE.REALESTATE) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
        }
        return (
            <Card
                bordered={false}
                className={'job-detail-card'}
            >
                {/* New cart with Buttun 15-02-2021:Start */}
                    <Row className="job-provider-container">
                        {/* <Link to={path}><Col md={12} lg={17} 
                            //onClick={() => this.selectTemplateRoute(data)} 
                            style={{ cursor: 'pointer' }}>
                            <div className="job-provider-left-container">
                                <h1>{data.title && capitalizeFirstLetter(data.title)}</h1>
                                {salary_range && <span>{salary_range ? salary_range : ''}</span>}
                                {data.company_name && <small>{data.company_name}</small>}
                            </div>
                            {convertHTMLToText(data.description)}
                        </Col></Link> */}
                        <Col md={12} lg={17}><Link to={path} style={{ cursor: 'pointer' }}>
                            <div className="job-provider-left-container">
                                <h1>{data.title && capitalizeFirstLetter(data.title)}</h1>
                                {salary_range && <span>{salary_range ? salary_range : ''}</span>}
                                {data.company_name && <small>{data.company_name}</small>}
                            </div>
                            {convertHTMLToText(data.description)}
                        </Link></Col>
                        <Col md={12} lg={7}>
                            <div className="job-provider-right-container">
                                    <ul>
                                        <Link to={path}>
                                        <li 
                                            //onClick={() => this.selectTemplateRoute(data)} 
                                            style={{ cursor: 'pointer' }}
                                        >{data.views ? data.views : '0'} 
                                            Views
                                        </li>
                                        </Link>
                                        <Link to={path}>
                                        <li 
                                            //onClick={() => this.selectTemplateRoute(data)} 
                                            style={{ cursor: 'pointer' }}
                                        > 
                                            {data.classified_created_date && displayDateTimeFormate(data.classified_created_date)}
                                        </li>
                                        </Link>
                                        {/* <HeartOutlined/> */}
                                        <span><Icon
                                            icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                                            className={is_favourite ? 'active' : ''}
                                            onClick={() => this.onSelection(data)}
                                        /></span>
                                    </ul>
                                    <div className="floating-position">
                                {/* <img src={data.company_logo ? data.company_logo : require('../../assets/images/brand-logo.png')} alt='Brand Logo' className="brand" onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}/> */}
                                {/* <img src={require('../../assets/images/brand-logo.png')} alt='Brand Logo' className="brand" onClick={() => this.selectTemplateRoute(data)} style={{ cursor: 'pointer' }}/>                                 */}
                                {data.company_name}
                                <Link to={path}>
                                    <span className="clearfix"></span>
                                    <Button className="btn-apply" 
                                    //onClick={() => this.selectTemplateRoute(data)} 
                                    style={{ cursor: 'pointer' }}>
                                        <img src={require('../../assets/images/pointer.svg')} alt='Brand Logo'/>
                                        Apply
                                    </Button>
                                </Link>  
                                </div>
                            </div>
                        </Col>
                    </Row>
                {/* New cart with Buttun 15-02-2021:End */}
            </Card >
        )
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { data } = this.props;
        console.log('data', data)
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
    const {isOpenLoginModel, favoriteId } = common;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser,
        isOpenLoginModel, favoriteId
    };
}

export default connect(
    mapStateToProps, {enableLoading, disableLoading, addToWishList, removeToWishList, openLoginModel, setFavoriteItemId }
)(withRouter(DetailCard));

