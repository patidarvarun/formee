import React, { Fragment, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Menu, Tooltip, Layout, Typography, Avatar, Tabs, Row, Col, Carousel, Breadcrumb, Form, Input, Select, Button, Rate, Collapse, Modal, Dropdown } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { UserOutlined } from '@ant-design/icons';
import { getClassfiedCategoryDetail } from '../../../actions/classifieds';
import { enableLoading, disableLoading, addToWishList, removeToWishList, openLoginModel } from '../../../actions/index'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../config/Config'
import { langs } from '../../../config/localization';
import AppSidebarInner from '../../sidebar/SidebarInner';
import { displayDateTimeFormate, convertHTMLToText, salaryNumberFormate } from '../../common';
import { STATUS_CODES } from '../../../config/StatusCode';
import { MESSAGES } from '../../../config/Message'
import { SocialShare } from '../../common/social-share'
import Magnifier from 'react-magnifier';
import history from '../../../common/History';
import LeaveReviewModel from '../LeaveReviewModel';
import ContactModal from '../ContactModal'
import { rating, } from '../CommanMethod'
import { getClassifiedCatLandingRoute, getClassifiedSubcategoryRoute, getMapDetailRoute } from '../../../common/getRoutes'
import Review from '../Review'
import MakeAnOffer from '../MakeAnOffer'
import { capitalizeFirstLetter } from '../../common'
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13, offset: 1 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { offset: 7, span: 13 },
    className: 'align-center pt-20'
};
const infoLayout = {
    wrapperCol: { offset: 7, span: 13 },
    className: 'align-center'
};


class DetailPage extends React.Component {
    formRef = React.createRef();

    myDivToFocus = React.createRef()
    constructor(props) {
        super(props);
        this.state = {
            classifiedDetail: [],
            allData: '',
            visible: false,
            makeOffer: false,
            reviewModel: false,
            filteredData: [],
            isFilter: false,
            label: 'All Star',
            reviewTab: false, activeTab: '1',
            carouselNav1: null,
            carouselNav2: null,
            showNumber: false,
            is_favourite: false
        };
    }

    /**
     * @method componentDidMount
     * @description called after render the component
     */
    componentDidMount() {
        this.setState({
            carouselNav1: this.slider1,
            carouselNav2: this.slider2
        });
    }

    /**
     * @method componentWillMount
     * @description get selected categorie details
     */
    componentWillMount() {
        this.props.enableLoading()
        this.getDetails()
    }

    /**
     * @method getDetails
     * @description get classified details
     */
    getDetails = () => {
        let classified_id = this.props.match.params.classified_id
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData = {
            id: classified_id,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getClassfiedCategoryDetail(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                let wishlist = res.data.data && res.data.data.wishlist === 1 ? true : false
                this.setState({ classifiedDetail: res.data.data, allData: res.data, is_favourite: wishlist })
            }
        })
    }

    /**
     * @method contactModal
     * @description contact model
     */
    contactModal = () => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                visible: true,
            });
        } else {
            this.props.openLoginModel()
        }
    };

    /**
     * @method makeOfferModal
     * @description handle make an offer model
     */
    makeOfferModal = () => {
        const { classifiedDetail } = this.state
        const { isLoggedIn } = this.props
        
        if(classifiedDetail && classifiedDetail.price === 0){ 
            toastr.warning(langs.warning, MESSAGES.NOT_ABLE_APPLY_OFFER)
            return true
        } else {
            if (isLoggedIn) {
                this.setState({
                    makeOffer: true,
                });
            } else {
                this.props.openLoginModel()
            }
        }
    };

    /**
    * @method contactModal
    * @description contact model
    */
    leaveReview = () => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            
            this.setState({
                reviewModel: true,
            });
            
        } else {
            this.props.openLoginModel()
        }
    };

    /**
     * @method handleCancel
     * @description handle cancel
     */
    handleCancel = e => {
        this.setState({
            visible: false,
            makeOffer: false,
            reviewModel: false
        });
    };

    /**
     * @method renderSpecification
     * @description render specification list
     */
    renderSpecification = (data) => {
        return data && Array.isArray(data) && data.map((el, i) => {
            let value = el.key === 'Price' ? `AU$${salaryNumberFormate(el.value)}` : el.value
            return (
                <Row className='pt-20' key={i}>
                    <Col span={8}><Text className='strong'>{el.key}</Text></Col>
                    <Col span={14}><Text>{value}</Text></Col>
                </Row>
            )
        })
    }

    /**
    * @method renderImages
    * @description render image list
    */
    renderImages = (item) => {
        if (item && item.length) {
            return item && Array.isArray(item) && item.map((el, i) => {
                return (
                    <div key={i}>
                        <Magnifier
                            src={el.full_name ? el.full_name : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            alt={''}
                        />
                    </div>
                )
            })
        } else {
            return (
                <div>
                    <img src={DEFAULT_IMAGE_CARD} alt='' />
                </div>
            )
        }
    }

    /**
   * @method renderThumbImages
   * @description render thumb images
   */
    renderThumbImages = (item) => {
        if (item && item.length) {
            return item && Array.isArray(item) && item.map((el, i) => {
                return (
                    <div key={i} className='slide-content'>
                        <img
                            src={el.full_name ? el.full_name : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            alt={''}
                        />
                    </div>
                )
            })
        } else {
            return (
                <div className='slide-content hide-cloned'>
                    <img src={DEFAULT_IMAGE_CARD} alt='' />
                </div>
            )
        }
    }

    /**
    * @method onSelection
    * @description handle favorite unfavorite
    */
    onSelection = (data, classifiedid) => {
        const { isLoggedIn, loggedInDetail } = this.props;
        const { is_favourite } = this.state
        if (isLoggedIn) {
            if (data.wishlist === 1 || is_favourite) {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: classifiedid,
                }
                this.props.enableLoading()
                this.props.removeToWishList(requestData, res => {
                    this.props.disableLoading()
                    if (res.status === STATUS_CODES.OK) {
                        // toastr.success(langs.success, res.data.msg)
                        toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
                        // this.getDetails()
                        this.setState({ is_favourite: false })
                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: classifiedid,
                }
                this.props.enableLoading()
                this.props.addToWishList(requestData, res => {
                    this.props.disableLoading()
                    this.setState({ flag: !this.state.flag })
                    if (res.status === STATUS_CODES.OK) {
                        // toastr.success(langs.success, res.data.msg)
                        toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
                        // this.getDetails()
                        this.setState({ is_favourite: true })
                    }
                })
            }
        } else {
            this.props.openLoginModel()
        }
    }

    activeTab = () => {
        this.setState({ activeTab: '3' })
        // this.setState({reviewTab: true})
        if (this.myDivToFocus.current) {
            
            window.scrollTo(0, this.myDivToFocus.current.offsetTop)
        }
    }

    /**
    * @method onTabChange
    * @description manage tab change
    */
    onTabChange = (key, type) => {
        this.setState({ activeTab: key, reviewTab: false });
    };

    /**
    * @method render
    * @description render component
    */
    render() {
        const { isLoggedIn, loggedInDetail } = this.props;
        let isUserExits = ''
        const { is_favourite, visible, makeOffer, showNumber, reviewTab, classifiedDetail, activeTab, allData, reviewModel } = this.state;
        let clasified_user_id = classifiedDetail && classifiedDetail.classified_users ? classifiedDetail.classified_users.id : ''
        let isButtonVisible = isLoggedIn && loggedInDetail.id === clasified_user_id ? false : true
        let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
        let parameter = this.props.match.params
        let cat_id = parameter.categoryId;
        let classified_id = parameter.classified_id;
        let categoryName = classifiedDetail.categoriesname ? classifiedDetail.categoriesname.name : ''
        let subCategoryName = classifiedDetail.categoriesname ? classifiedDetail.subcategoriesname.name : ''
        let subCategoryId = classifiedDetail.categoriesname ? classifiedDetail.subcategoriesname.id : ''
        let categoryPagePath = classifiedDetail.categoriesname ? getClassifiedCatLandingRoute(TEMPLATE.GENERAL, classifiedDetail.categoriesname.id, categoryName) : ''
        let subCategoryPagePath = classifiedDetail.categoriesname ? getClassifiedSubcategoryRoute(TEMPLATE.GENERAL, categoryName, classifiedDetail.categoriesname.id, subCategoryName, classifiedDetail.subcategoriesname.id) : ''
        let mapPagePath = classifiedDetail.categoriesname ? getMapDetailRoute(TEMPLATE.GENERAL, categoryName, cat_id, subCategoryName, subCategoryId, classified_id) : ''
        const catName = classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname
        let imgLength = Array.isArray(classifiedDetail.classified_image) ? classifiedDetail.classified_image.length : 1
        const carouselSettings = {
            dots: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        const carouselNavSettings = {
            speed: 500,
            slidesToShow: imgLength === 4 ? classifiedDetail.classified_image.length - 1 : imgLength === 3 ? classifiedDetail.classified_image.length + 2 : 4,
            slidesToScroll: 1,
            centerMode: false,
            focusOnSelect: true,
            dots: false,
            arrows: true,
            infinite: true,

        };
        const menu = (
            <SocialShare {...this.props} />
        )
        let crStyle = (imgLength === 3 || imgLength === 2 || imgLength === 1) ? 'product-gallery-nav hide-clone-slide' : 'product-gallery-nav '
        let contactNumber = classifiedDetail.contact_mobile && classifiedDetail.contact_mobile
        let formatedNumber = contactNumber && contactNumber.replace(/\d(?=\d{4})/g, '*')
        const number = (
            <Menu>
                <Menu.Item key='0'>
                    <span className='phone-icon-circle'><Icon icon='call' size='14' /></span>
                    <span>{isLoggedIn ? contactNumber : formatedNumber}</span>
                    {isLoggedIn ?
                        <span className='blue-link ml-16 fs-16' >
                            <Tooltip placement='bottomRight' title={classifiedDetail.contact_mobile ? classifiedDetail.contact_mobile :
                                'Number not found'}></Tooltip></span> :
                        <span className='blue-link ml-16 fs-16' onClick={() => this.props.openLoginModel()}>Show Number</span>}
                </Menu.Item>
            </Menu>
        )
        return (
            <div>
                <Fragment>
                    <Layout>
                        <Layout>
                            <AppSidebarInner history={history} activeCategoryId={cat_id} moddule={1} />
                            <Layout style={{ width: 'calc(100% - 200px)', overflowX: 'visible' }}>

                                <Breadcrumb separator='|' className='pt-20 pb-30' style={{ paddingLeft: 50 }}>
                                    <Breadcrumb.Item>
                                        <Link to='/'>Home</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to='/classifieds'>Classified</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to={categoryPagePath}>{categoryName}</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to={subCategoryPagePath}>
                                            {subCategoryName}
                                        </Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        AD No. {classified_id}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <Title level={2} className='inner-page-title'>
                                    <span>{classifiedDetail.categoriesname && classifiedDetail.categoriesname.name}</span>
                                </Title>
                                <Layout>
                                    <div className='wrap-inner detail-page'>
                                        <Paragraph className='text-gray'>AD No. {classified_id}</Paragraph>
                                        <Row gutter={[60, 16]}>
                                            <Col span={11}>
                                                <Icon icon='magnifying-glass' size='20' className={'product-gallery-zoom'} />
                                                <Carousel
                                                    {...carouselSettings}
                                                    asNavFor={this.state.carouselNav2}
                                                    ref={slider => (this.slider1 = slider)}
                                                    className={'product-gallery'}
                                                >
                                                    {classifiedDetail.classified_image ? this.renderImages(classifiedDetail.classified_image) : <img src={DEFAULT_IMAGE_CARD} alt='' />}
                                                </Carousel>
                                                <Carousel
                                                    {...carouselNavSettings}
                                                    asNavFor={this.state.carouselNav1}
                                                    ref={slider => (this.slider2 = slider)}
                                                    // className={'product-gallery-nav'}
                                                    className={crStyle}
                                                >
                                                    {classifiedDetail.classified_image ? this.renderThumbImages(classifiedDetail.classified_image) : <div className='slide-content hide-cloned'><img src={DEFAULT_IMAGE_CARD} alt='' /></div>}
                                                </Carousel>
                                            </Col>
                                            <Col span={13}>
                                                <div className='product-detail-right'>
                                                    <Title level={2} className='price'>
                                                        {'AU$'}{salaryNumberFormate(classifiedDetail.price)}
                                                    </Title>
                                                    <Title level={4}>{capitalizeFirstLetter(classifiedDetail.title)}</Title>
                                                    <div className='address mb-12'>

                                                        {classifiedDetail.location !== 'N/A' &&
                                                            <Text className='mr-7'>{classifiedDetail.location}</Text>}

                                                        {classifiedDetail.subcategoriesname &&
                                                            <Link to={mapPagePath} className='blue-link'>{'View map'}</Link>
                                                        }
                                                    </div>
                                                    <div className='product-ratting mb-15'>
                                                        <Text>{rate ? rate : 'No reviews yet'}</Text>
                                                        {rate && <Rate disabled defaultValue={rate ? rate : 'No reviews yet'} />}

                                                        {rate ? `${rate} of 5.0 ` : ''}
                                                        {classifiedDetail.classified_hm_reviews && classifiedDetail.classified_hm_reviews.length !== 0 &&<span className='blue-link' onClick={this.activeTab} style={{ cursor: 'pointer' }}>
                                                            {classifiedDetail.classified_hm_reviews && `${classifiedDetail.classified_hm_reviews.length}  reviews`}
                                                        </span>}
                                                    </div>
                                                    <div>
                                                        {catName &&
                                                            <Link
                                                                to={subCategoryPagePath}>
                                                                <Button
                                                                    type='ghost'
                                                                    shape={'round'}
                                                                    className={'mr-10'}
                                                                >
                                                                    {classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname.name}
                                                                </Button>
                                                            </Link>}
                                                        <Text>
                                                            {classifiedDetail.subcategoriesname && displayDateTimeFormate(classifiedDetail.subcategoriesname.updated_at)}
                                                        </Text>
                                                    </div>
                                                    <div className='action-card'>
                                                        <ul>
                                                            {/* <li>
                                                                <Icon icon='call' size='20' onClick={this.contactModal} />
                                                            </li> */}
                                                            {classifiedDetail && classifiedDetail.hide_mob_number === 1 && <li>
                                                                <Dropdown overlay={number} trigger={['click']} overlayClassName='show-phone-number'>
                                                                    <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                                                        <Icon icon='call' size='20' onClick={e => e.preventDefault()} />
                                                                    </div>
                                                                </Dropdown>
                                                            </li>}
                                                            {/* {classifiedDetail && classifiedDetail.hide_mob_number===1 &&<li>
                                                                {isLoggedIn ? <Tooltip placement='bottomRight' title={classifiedDetail.contact_mobile ? classifiedDetail.contact_mobile : 'Number not found'}><Icon icon='call' size='20'/></Tooltip>: <Icon icon='call' size='20' onClick={() => this.props.openLoginModel()}/>}
                                                            </li>} */}
                                                            <li>
                                                                {classifiedDetail && <Icon
                                                                    icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                                                                    size='20'
                                                                    // className={classifiedDetail.wishlist === 1 ? 'active' : ''}
                                                                    className={is_favourite ? 'active' : ''}
                                                                    onClick={() => this.onSelection(classifiedDetail, classified_id)}
                                                                />}
                                                            </li>
                                                            <li>
                                                                <Dropdown overlay={menu} trigger={['click']}>
                                                                    <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                                                        <Icon icon='share' size='20' />
                                                                    </div>
                                                                </Dropdown>
                                                            </li>
                                                            <li>
                                                                <div><Icon icon='view' size='20' /> <Text>{classifiedDetail.count}</Text></div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {isButtonVisible && <Row gutter={[20, 0]} className='action-btn'>
                                                        <Col>
                                                            <Button
                                                                type='default'
                                                                onClick={this.contactModal}
                                                            >
                                                                {'Contact'}
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                type='default'
                                                                onClick={this.makeOfferModal}
                                                            >
                                                                {'Make Offer'}
                                                            </Button>
                                                        </Col>
                                                    </Row>}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div ref={this.myDivToFocus}>
                                            <Tabs type='card' className={'tab-style3 product-tabs'}
                                                activeKey={activeTab}
                                                onChange={this.onTabChange}
                                            >
                                                {}
                                                <TabPane tab='Info' key='1'>
                                                    <Paragraph>
                                                        {classifiedDetail.description ? convertHTMLToText(classifiedDetail.description) : ''}
                                                    </Paragraph>
                                                    {allData && allData.spicification && this.renderSpecification(allData.spicification)}
                                                </TabPane>
                                                {/* <TabPane tab='Features' key='2'>
                                                    <Row>
                                                        <Col span={18}>
                                                            <Collapse
                                                                defaultActiveKey={['1']}
                                                                expandIconPosition={'right'}
                                                                className='custom-collapse'
                                                            >
                                                                <Panel header='Audio, Visual & Communication' key='1'>
                                                                    <Row>
                                                                        <Col span={6}>
                                                                            <Text className='strong'>Inputs</Text>
                                                                        </Col>
                                                                        <Col span={8}>
                                                                            <Text>Aux Input USB Socket</Text>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col span={6}>
                                                                            <Text className='strong'>Bluetooth</Text>
                                                                        </Col>
                                                                        <Col span={8}>
                                                                            <Text>Bluetooth</Text>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col span={6}>
                                                                            <Text className='strong'>Controls</Text>
                                                                        </Col>
                                                                        <Col span={8}>
                                                                            <Text>Multi-function Control Screen - Colour Speed Dependant Volume Stereo</Text>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col span={6}>
                                                                            <Text className='strong'>Speakers</Text>
                                                                        </Col>
                                                                        <Col span={8}>
                                                                            <Text>6 Speaker Stereo</Text>
                                                                        </Col>
                                                                    </Row>
                                                                </Panel>
                                                                <Panel header='Safety & Security' key='2'>
                                                                    <div>{'text'}</div>
                                                                </Panel>
                                                                <Panel header='Safety & Security' key='3'>
                                                                    <div>{'text'}</div>
                                                                </Panel>
                                                            </Collapse>
                                                        </Col>
                                                    </Row>
                                                </TabPane> */}
                                                <TabPane tab='Reviews' key='3' ref={this.formRef}>
                                                    <Row className='reviews-content'>
                                                        <Col md={5}>
                                                            <Avatar
                                                                src={classifiedDetail.classified_users &&
                                                                    classifiedDetail.classified_users.image_thumbnail ?
                                                                    classifiedDetail.classified_users.image_thumbnail :
                                                                    <Avatar size={54} icon={<UserOutlined />} />}
                                                                size={69}
                                                            />
                                                            <Title level={4} className='mt-10'>
                                                                {classifiedDetail.classified_users && classifiedDetail.classified_users.name}
                                                            </Title>
                                                            <Paragraph className='fs-10 text-gray'>
                                                                {classifiedDetail.classified_users &&
                                                                    `(Member since : ${classifiedDetail.classified_users.member_since})`}
                                                            </Paragraph>
                                                            {classifiedDetail &&  <div className='fs-10 underline' style={{ color: '#55636D' }}>
                                                                {isLoggedIn ? <Link to={`/user-ads/${'general'}/${cat_id}/${classified_id}`}>{`Found ${classifiedDetail.usercount} Ads`}</Link>:
                                                                <span onClick={() => this.props.openLoginModel()}>{`Found ${classifiedDetail.usercount} Ads`}</span>}
                                                            </div>}
                                                        </Col>
                                                        {classifiedDetail && <Review
                                                            classifiedDetail={classifiedDetail}
                                                            getDetails={this.getDetails}
                                                        />}
                                                    </Row>
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                    </div>
                                </Layout>
                            </Layout>
                        </Layout>
                    </Layout>

                    {reviewModel &&
                        <LeaveReviewModel
                            visible={reviewModel}
                            onCancel={this.handleCancel}
                            classifiedDetail={classifiedDetail && classifiedDetail}
                            callNext={this.getDetails}
                        />}
                    {visible &&
                        <ContactModal
                            visible={visible}
                            onCancel={this.handleCancel}
                            classifiedDetail={classifiedDetail && classifiedDetail}
                            receiverId={classifiedDetail.classified_users ? classifiedDetail.classified_users.id : ''}
                            classifiedid={classifiedDetail && classifiedDetail.id}
                        />}
                    {makeOffer &&
                        <MakeAnOffer
                            visible={makeOffer}
                            onCancel={this.handleCancel}
                            classifiedDetail={classifiedDetail && classifiedDetail}
                            receiverId={classifiedDetail.classified_users ? classifiedDetail.classified_users.id : ''}
                            classifiedid={classifiedDetail && classifiedDetail.id}
                        />}
                </Fragment>
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, classifieds } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedclassifiedDetail: classifieds.classifiedsList
    };
}

export default connect(
    mapStateToProps,
    { getClassfiedCategoryDetail, addToWishList, removeToWishList, openLoginModel, enableLoading, disableLoading, }
)(DetailPage);