import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Empty, Card, Layout, Typography, Avatar, Tabs, Row, Col, Breadcrumb, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { UserOutlined } from '@ant-design/icons';
import { getFitnessClassListing, getPortFolioData, getBookingDetails, enableLoading, disableLoading, addToFavorite, removeToFavorite, openLoginModel, getClassfiedCategoryDetail } from '../../../actions/index'
import { getBookingCatLandingRoute, getBookingMapDetailRoute, getBookingSubcategoryRoute } from '../../../common/getRoutes'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../config/Config';
import { langs } from '../../../config/localization';
import AppSidebarInner from '../../sidebar/SidebarInner';
import { salaryNumberFormate, displayDateTimeFormate, convertHTMLToText, converInUpperCase, formateTime, getDaysName } from '../../common';
import { STATUS_CODES } from '../../../config/StatusCode';
import { SocialShare } from '../../common/social-share'
import Magnifier from 'react-magnifier';
import history from '../../../common/History';
import Review from '../common/Review'
import { renderInfoTab, renderPortFolioTab, renderServiceTab } from '../common/index'
import { BASE_URL } from '../../../config/Config'
import BeautyServiceDetail from '../common/BeautyServiceDetail'
import '../../dashboard/vendor-profiles/myprofilestep.less'
import BookingPage from '../wellbeing/spa/booking';
import CaterersEnquiryModalContent from '../events/caterers/enquiry';
import BeautyBookingModalContent from '../beauty/booking'
import HandyManRequestQuote from '../handy-man/request-quote'
import HandyManRequestBooking from '../handy-man/request-booking'
import RequestQuote from '../handy-man/request-quote/RequestQuoteModel'
import BuyClassModal from '../wellbeing/fitness/booking/buy-class';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card

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

class Details extends React.Component {
    myDivToFocus = React.createRef()
    constructor(props) {
        super(props);
        this.state = {
            // bookingDetail: [],
            allData: '',
            visible: false,
            makeOffer: false,
            carouselNav1: null,
            carouselNav2: null,
            reviewModel: false,
            activeTab: '1',
            portfolio: [],
            isBrochure: false,
            isPortfolio: false,
            isCertificate: false,
            classes: [],
            uniqueFitnessTabs: [],
            selectedFitnessType: [],
            is_favourite: false,
            displaySpaBookingModal: false,
            selectedSpaService: '',
            displayCaterersEnquireModal: false,
            selectedBeautyService: [],
            displayBeautyBookingModal: false,
            requestQuoteModel: false,
            handymanBooking: false,
            visibleClassBuyModal: false,
            selectedClassSchedule: '',
            selectedClass: ''
        };
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
   * @method componentDidMount
   * @description called after render the component
   */
    componentDidMount() {
        let filter = this.props.match.params.filter
        if (filter && filter === 'daily-deals') {
            this.setState({ activeTab: '2' })
            if (this.myDivToFocus.current) {
                window.scrollTo(0, this.myDivToFocus.current.offsetTop)
            }
        }
        this.setState({
            carouselNav1: this.slider1,
            carouselNav2: this.slider2
        });
    }

    /**
     * @method getDetails
     * @description get details
     */
    getDetails = () => {
        const { isLoggedIn, loggedInDetail } = this.props
        let itemId = this.props.match.params.itemId
        let reqData = {
            id: itemId,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getBookingDetails(reqData, (res) => {
            this.props.disableLoading()
            this.props.getPortFolioData(itemId, res => {
                
                if (res.status === 200) {
                    let data = res.data
                    this.setState({ portfolio: data })
                }
            })
            if (res.status === 200) {
                
                let trader_profile_id = res.data.data.trader_profile && res.data.data.trader_profile.id
                this.props.getFitnessClassListing({ id: trader_profile_id, page_size: 50 }, (res) => {
                    if (res.data.status === 200) {
                        let data = res.data && res.data.data
                        let traderClasses = data.trader_classes && Array.isArray(data.trader_classes) && data.trader_classes.length ? data.trader_classes : []
                        const uniqueTabs = [...new Set(traderClasses.map(item => item.wellbeing_fitness_type.name))]; // [ 'A', 'B']
                        let selectedFitnessType = traderClasses.filter((c) => {
                            if (uniqueTabs.length && c.wellbeing_fitness_type.name == uniqueTabs[0]) {
                                return c
                            }
                        })
                        this.setState({ classes: traderClasses, uniqueFitnessTabs: uniqueTabs, selectedFitnessType, selectedClass: uniqueTabs[0] })
                        
                    }
                })
                let is_favourite = res.data.data && res.data.data.is_favourite === 1 ? true : false
                this.setState({ bookingDetail: res.data.data, allData: res.data, is_favourite: is_favourite })
                
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
     * @method handymanBookingModel
     * @description handle booking model
     */
    handymanBookingModel = () => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                handymanBooking: true,
            });
        } else {
            this.props.openLoginModel()
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
            reviewModel: false,
            handymanBooking: false
        });
    };

    /**
     * @method renderSpecification
     * @description render specification list
     */
    renderSpecification = (data) => {
        return data && Array.isArray(data) && data.map((el, i) => {
            return (
                <Row className='pt-20' key={i}>
                    <Col span={8}><Text className='strong'>{el.key}</Text></Col>
                    <Col span={14}><Text>{el.value}</Text></Col>
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
                            src={el.full_image ? el.full_image : DEFAULT_IMAGE_CARD}
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
     * @description render thumbnail images
     */
    renderThumbImages = (item) => {
        if (item && item.length) {
            return item && Array.isArray(item) && item.map((el, i) => {
                return (
                    <div key={i} className='slide-content'>
                        <img
                            src={el.full_image ? el.full_image : DEFAULT_IMAGE_CARD}
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
                        // this.getDetails()
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
                this.props.enableLoading()
                this.props.addToFavorite(requestData, res => {
                    this.props.disableLoading()
                    if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, res.data.message)
                        // this.getDetails()
                        this.setState({ is_favourite: true })
                    }
                })
            }
        } else {
            this.props.openLoginModel()
        }
    }




    /**
    * @method renderService
    * @description render service  details
    */
    renderBeautyService = (item, serviceType, buttonName) => {
        return (
            <>
                {this.renderUserBeautyServices(item.trader_user_profile_services, buttonName)}
                { this.state.selectedBeautyService.length > 0 &&
                    <Button className="yellow-btn w-100" onClick={() => {
                        
                        this.displayBeautyBookingModal();
                    }}>{buttonName}</Button>}
            </>
        )
    }

    /**
    * @method renderUserBeautyServices
    * @description render beauty service details
    */
    renderUserBeautyServices = (item, buttonName) => {
        if (item && item.length) {
            return item && Array.isArray(item) && item.map((el, i) => {
                let isSelected = this.state.selectedBeautyService.some(vendor => vendor['id'] === el.id)
                return (
                    <div className="beauty-service">
                        <Row gutter={[30, 30]} key={i} align="middle" className="mb-0">
                            <Col span={5}>
                                <div className="thumb"> <img
                                    src={el.service_image ? `${BASE_URL}/${el.service_image}` : DEFAULT_IMAGE_CARD}
                                    alt=''
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = DEFAULT_IMAGE_CARD
                                    }}
                                /></div>
                                <div className="subtitle pt-10"><Text className='strong'>{`${el.more_info ? el.more_info : ''}`}</Text></div>
                            </Col>
                            <Col span={10}>
                                <Text className='strong'>{el.name ? el.name : ''}</Text>
                                <br />{`${el.duration ? el.duration : ''} minutes`}
                            </Col>
                            <Col span={4}><Text className='strong'>{el.price ? `AU$${el.price}` : 'Price not found'}</Text></Col>
                            <Col span={5}>
                                <Checkbox key={`${i}_beauty_service_item`}
                                    checked={isSelected}
                                    onChange={(e) => {
                                        let temp = this.state.selectedBeautyService;
                                        //temp.length = 0;
                                        if (!isSelected) {
                                            temp.push(el);
                                            this.setState({ selectedBeautyService: temp });
                                        } else {
                                            temp = temp.filter((k) => k.id !== el.id);
                                            this.setState({ selectedBeautyService: temp });
                                        }
                                    }} />

                            </Col>
                        </Row>
                        <Divider />
                        {/* <Button className="yellow-btn w-100">{buttonName}</Button> */}
                    </div>
                )
            })
        }
    }




    /**
   * @method renderFitnessClassesTab
   * @description render service tab
   */
    renderFitnessClassesTab = (bookingDetail, tabName, categoryName, subCategoryName) => {
        const { classes, uniqueFitnessTabs } = this.state;
        return (
            <TabPane tab={tabName} key='2' className="inner-tab-detail" >
                {Array.isArray(uniqueFitnessTabs) && uniqueFitnessTabs.length ? <Tabs type='card' onTabClick={(e) => {
                    
                    let temp = classes.filter((c) => {
                        if (c.wellbeing_fitness_type.name == e) {
                            return c
                        }
                    })
                    this.setState({ selectedFitnessType: temp, selectedClass: e })
                    
                }}>
                    {(Array.isArray(uniqueFitnessTabs) && uniqueFitnessTabs.length) && uniqueFitnessTabs.map((el, i) => {
                        return (
                            <TabPane tab={el} key={el}>
                                {this.renderFitnessServiceType(el.trader_user_profile_services, 'Buy this class')}
                            </TabPane>
                        )
                    })}
                </Tabs> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </TabPane>
        )
    }

    /**
     * @method displayClassBuyModal
     * @description display Fitness membership
     */
    displayClassBuyModal = (selectedClassSchedule) => {
        
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                visibleClassBuyModal: true,
                selectedClassSchedule: selectedClassSchedule
            });
        } else {
            this.props.openLoginModel()
        }
    }

    /**
    * @method renderFitnessServiceType
    * @description render fitness service type
    */
    renderFitnessServiceType = (item, buttonName) => {
        const { selectedFitnessType, bookingDetail, selectedClass } = this.state;
        let parameter = this.props.match.params
        let categoryName = parameter.categoryName
        let pid = parameter.categoryId
        let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName
        let subCategoryId = parameter.subCategoryId;
        if (selectedFitnessType && selectedFitnessType.length) {
            return selectedFitnessType && Array.isArray(selectedFitnessType) && selectedFitnessType.map((el, i) => {
                // 
                return (
                    <div className="beauty-service">
                        <Row gutter={[30, 30]} key={i} align="middle" className="mb-0">
                            <Col span={5}>
                                <div className="thumb"> <img
                                    src={el.image ? `${el.image}` : DEFAULT_IMAGE_CARD}
                                    alt=''
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = DEFAULT_IMAGE_CARD
                                    }}
                                /></div>
                            </Col>
                            <Col span={5}>
                                <Text className='strong'>{el.class_name}</Text>
                                <br />{`${el.description}`}
                            </Col>
                            <Col span={5}><Text className='strong'>{`${el.trader_classes_schedules_count} mins`}</Text></Col>
                            <Col span={4}><Text className='strong'>{el.price ? `$${el.price}` : 'Price not found'}</Text></Col>
                            <Col span={4}><Button onClick={() => {
                                this.props.history.push({
                                    pathname: `/view-schedule/${categoryName}/${pid}/${subCategoryName}/${subCategoryId}/${bookingDetail.id}/${bookingDetail.trader_profile.id}`,
                                    state: { selectedClass: el.class_name }
                                })
                            }} className="yellow-btn w-100">{buttonName}</Button></Col>
                        </Row>
                    </div>
                )
            })
        }
    }


    /**
    * @method renderServiceTab
    * @description render beauty service tab details
    */
    renderServiceTab = (bookingDetail, tabName, categoryName, subCategoryName) => {
        
        const item = bookingDetail && bookingDetail.profile_services;
        
        // if (item && item.length) {
        return (
            <TabPane tab={tabName} key='2' className="inner-tab-detail">
                {categoryName === TEMPLATE.WELLBEING && subCategoryName === TEMPLATE.FITNESS ? this.renderFitnessClassesTab() :
                    Array.isArray(item) && item.length ? <Tabs type='card' >
                        {Array.isArray(item) && item.length && item.map((el, i) => {
                            return (
                                <TabPane tab={el.name} key={i}>
                                    {categoryName === TEMPLATE.BEAUTY && this.renderBeautyService(el, el.name, 'Book')}
                                </TabPane>
                            )
                        })}
                    </Tabs> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </TabPane>
        )
        // } 
    }

    renderSpaService = (bookingDetail, tabName, categoryName, subCategoryName) => {
        let data = bookingDetail && bookingDetail.trader_profile ? bookingDetail.trader_profile.wellbeing_trader_service : []
        let temp = [
            { id: '1', name: 'Massage' }, { id: '2', name: 'Beauty Treatment' }, { id: '3', name: 'Delux' }, { id: '4', name: 'Ultimate' }, { id: '5', name: 'Promotion' }
        ]
        return (
            <TabPane tab={tabName} key='2' className="inner-tab-detail">
                {data && data.length !== 0 ? <div>
                    {/* <Tabs type='card' > */}
                    {/* {Array.isArray(temp) && temp.length && temp.map((el, i) => {
                        return ( */}
                    <div>
                        {/* <TabPane tab={el.name} key={i}> */}
                        {categoryName === TEMPLATE.WELLBEING && subCategoryName !== TEMPLATE.FITNESS &&
                            <Row >
                                <Col span={24}>
                                    {this.renderSpaServiceType(data, 'Book')}
                                </Col>
                            </Row>
                        }
                        {/* </TabPane> */}
                    </div>
                    {/* )
                    })} */}
                    {/* </Tabs>  */}
                </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </TabPane>

        )
    }

    /**
   * @method renderSpaServiceType
   * @description render spa service type
   */
    renderSpaServiceType = (item, buttonName) => {
        if (item && item.length) {
            return item && Array.isArray(item) && item.map((el, i) => {
                return (
                    <div>
                        <Row key={i} align="middle">
                            <Col span={11}>
                                <Text className='strong'>{el.name}</Text>
                                <br />{`${el.more_info}`}
                            </Col>
                            <Col span={5} className="text-center"><Text >{`${el.duration} minutes`}</Text></Col>
                            <Col span={4} className="text-center"><Text className='strong'>{el.price ? `AU$${el.price}` : 'Price not found'}</Text></Col>
                            <Col span={4} className="text-right"><Button onClick={() => this.displaySpaBookingModal(el)} className="yellow-btn w-100" >{buttonName}</Button></Col>
                        </Row>
                        <Divider />
                    </div>
                )
            })
        }
    }

    /**
    * @method renderDetails
    * @description render details
    */
    renderPortfolioDetails = (item) => {
        if (item && Array.isArray(item) && item.length) {
            return item.map((el, i) => {
                return (
                    <li className="thumb" xs={24} sm={24} md={24} lg={4} xl={4}>
                        <a href={el.path} target='blank'><img src={el.path} alt='' /></a><br />
                    </li>
                )
            })
        } else {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
    }

    /**
    * @method renderPortFolioTab
    * @description render port folio tab
    */
    renderPortFolioTab = (data, slug) => {
        const { isBrochure, isCertificate, isPortfolio } = this.state
        const portfolio = data && Array.isArray(data.portfolio) && data.portfolio.length && data.portfolio[0].files ? data.portfolio[0].files : []
        const brochure = data && data.brochure && data.brochure.files ? data.brochure.files : []
        const certification = data && data.certification && data.certification.files ? data.certification.files : []
        let isVisible = portfolio.length === 0 && brochure.length === 0 && certification.length === 0 ? false : true
        return (
            <TabPane tab='Portfolio' key='3' className="tab-portfolio">
                {isVisible && <Title level={4}>{'Reference Files'}</Title>}
                {brochure.length !== 0 && <Row>
                    <div className='address mb-12'>
                        <Text level={4} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isBrochure: !this.state.isBrochure })}>
                            {'View Brochure'}
                        </Text>
                    </div>
                    <ul className='thumb-block'>
                        {isBrochure && this.renderPortfolioDetails(brochure)}
                    </ul>
                </Row>}
                {certification.length !== 0 && <Row>
                    <div className='address mb-12'>
                        <Text level={4} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isCertificate: !this.state.isCertificate })}>
                            {'View Certifications'}
                        </Text>
                    </div>
                    <ul className='thumb-block'>
                        {isCertificate && this.renderPortfolioDetails(certification)}
                    </ul>
                </Row>}
                {portfolio.length !== 0 && <Row>
                    <div className='address mb-12'>
                        <Text level={4} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isPortfolio: !this.state.isPortfolio })}>
                            {'View Portfolio'}
                        </Text>
                    </div>
                    <ul className='thumb-block'>
                        {isPortfolio && this.renderPortfolioDetails(portfolio)}
                    </ul>
                </Row>}
                {!isVisible && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </TabPane>
        )
    }

    /**
    * @method activeTab
    * @description handle active tab 
    */
    activeTab = () => {
        this.setState({ activeTab: '4' })
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

    displaySpaBookingModal = (selectedSpaService) => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                displaySpaBookingModal: true,
                selectedSpaService: selectedSpaService
            });
        } else {
            this.props.openLoginModel()
        }
    }

    hideSpaBookingModal = e => {
        this.setState({
            displaySpaBookingModal: false,
            makeOffer: false,
            reviewModel: false
        });
    };


    hideBeautyBookingModal = e => {
        this.setState({
            displayBeautyBookingModal: false,
            makeOffer: false,
            reviewModel: false
        });
    };

    displayBeautyBookingModal = () => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                displayBeautyBookingModal: true,
            });
        } else {
            this.props.openLoginModel()
        }
    }

    displayCaterersEnquireModal = (selectedSpaService) => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                displayCaterersEnquireModal: true,
                //selectedSpaService: selectedSpaService
            });
        } else {
            this.props.openLoginModel()
        }
    }

    hideCaterersEnquireModal = e => {
        this.setState({
            displayCaterersEnquireModal: false,
            makeOffer: false,
            reviewModel: false
        });
    };

    handymanRequestQuote = () => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                requestQuoteModel: true
            });
        } else {
            this.props.openLoginModel()
        }
    }


    /**
    * @method render
    * @description render component
    */
    render() {
        const { bookingDetail, activeTab, portfolio, is_favourite, handymanBooking, selectedFitnessType } = this.state;
        //
        let path = '', subCategoryPagePath, subcatId, subcatName
        let parameter = this.props.match.params
        let categoryId = parameter.categoryId;
        let categoryName = parameter.categoryName
        let itemId = parameter.itemId;
        let pid = parameter.categoryId
        let templateName = parameter.categoryName;
        let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName
        let subCategoryId = parameter.subCategoryId
        let allData = parameter.all === langs.key.all ? true : false
        if (subCategoryId === undefined) {
            subcatId = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.booking_sub_cat_id
            subcatName = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.trader_service && bookingDetail.trader_profile.trader_service.name
            path = getBookingMapDetailRoute(templateName, categoryName, categoryId, subcatName, subcatId, itemId)
            subCategoryPagePath = getBookingSubcategoryRoute(templateName, categoryName, categoryId, subcatName, subcatId, allData)
        } else {
            path = getBookingMapDetailRoute(templateName, categoryName, categoryId, subCategoryName, subCategoryId, itemId)
            subCategoryPagePath = getBookingSubcategoryRoute(templateName, categoryName, categoryId, subCategoryName, subCategoryId, allData)
        }
        let rate = bookingDetail && bookingDetail.average_rating ? `${parseInt(bookingDetail.average_rating)}.0` : ''
        let categoryPagePath = getBookingCatLandingRoute(categoryName, categoryId, categoryName)
        let infoTabName = categoryName === TEMPLATE.HANDYMAN ? 'About Us' : 'Info';
        let workigHours = bookingDetail && bookingDetail.trader_working_hours.length && bookingDetail.trader_working_hours
        let imgLength = bookingDetail && bookingDetail.service_images && Array.isArray(bookingDetail.service_images) ? bookingDetail.service_images.length : 1
        const carouselSettings = {
            dots: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        const carouselNavSettings = {
            speed: 500,
            slidesToShow: imgLength === 4 ? bookingDetail.service_images.length - 1 : imgLength === 3 ? bookingDetail.service_images.length + 2 : 4,
            slidesToScroll: 1,
            centerMode: false,
            focusOnSelect: true,
            dots: false,
            arrows: true,
            infinite: true,

        };
        let crStyle = (imgLength === 3 || imgLength === 2 || imgLength === 1) ? 'product-gallery-nav hide-clone-slide' : 'product-gallery-nav '
        const menu = (
            <SocialShare {...this.props} />
        );
        var d = new Date();
        var day = d.getDay()
        const dateTime = (
            <ul className='c-dropdown-content'>
                {bookingDetail && bookingDetail.trader_working_hours.map((el, i) =>
                    <li key={i}>
                        <Text className={day === el.day ? 'active-date' : ''}>{getDaysName(el.day)}</Text>
                        {el.day === 7 ?
                            <Text className='pull-right'>
                                Closed
                            </Text> :
                            <Text className={day === el.day ? 'pull-right active-date' : 'pull-right'}>
                                {`${formateTime(el.start_time)} - ${formateTime(el.end_time)}`}
                            </Text>
                        }
                    </li>
                )}
                <li>
                    <Divider />
                    <Text>Public holidays closed</Text>
                    <Divider />
                </li>
            </ul>
        )
        return (
            <div>
                <Fragment>
                    <Layout className="yellow-theme card-detailpage">
                        <Layout>
                            <AppSidebarInner history={history} />
                            <Layout style={{ width: 'calc(100% - 200px)', overflowX: 'visible' }}>
                                <Breadcrumb separator='|' className='pt-20 pb-30' style={{ paddingLeft: 50 }}>
                                    <Breadcrumb.Item>
                                        <Link to='/'>Home</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to='/bookings'>Bookings</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to={categoryPagePath}>{converInUpperCase(categoryName)}</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to={subCategoryPagePath}>
                                            {subCategoryName ? subCategoryName : subcatName}
                                        </Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        {(categoryName === TEMPLATE.HANDYMAN ? `AD No. ${itemId}` :
                                            bookingDetail && bookingDetail.business_name && bookingDetail.business_name
                                        )}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                {bookingDetail && <Title level={2} className='inner-page-title'>
                                    <span>{converInUpperCase(categoryName)}</span>
                                </Title>}
                                <Layout>
                                    <div className='wrap-inner'>
                                        {/* <Paragraph className='text-gray'>
                                            AD No. {itemId}
                                        </Paragraph> */}
                                        <Row gutter={[60, 16]}>
                                            <Col span={11} className="mt-45">
                                                <Icon icon='magnifying-glass' size='20' className={'product-gallery-zoom'} />
                                                <Carousel
                                                    {...carouselSettings}
                                                    asNavFor={this.state.carouselNav2}
                                                    ref={slider => (this.slider1 = slider)}
                                                    className={'product-gallery'}
                                                >
                                                    {bookingDetail && bookingDetail.service_images &&
                                                        this.renderImages(bookingDetail.service_images)
                                                    }
                                                    {/* <div>
                                                        <img src={DEFAULT_IMAGE_CARD} alt='' />
                                                    </div> */}
                                                </Carousel>
                                                <Carousel
                                                    {...carouselNavSettings}
                                                    asNavFor={this.state.carouselNav1}
                                                    ref={slider => (this.slider2 = slider)}
                                                    // className={'product-gallery-nav'}
                                                    className={crStyle}
                                                >
                                                    {bookingDetail && bookingDetail.service_images &&
                                                        this.renderThumbImages(bookingDetail.service_images)
                                                    }
                                                    {/* <div className='slide-content hide-cloned'>
                                                        <img src={DEFAULT_IMAGE_CARD} alt='' />
                                                    </div> */}
                                                </Carousel>
                                            </Col>
                                            {bookingDetail && <Col span={13} className="mt-45">
                                                <div className='product-detail-right'>
                                                    {bookingDetail.business_name && <Title level={2} className='price'>
                                                        {bookingDetail.business_name && bookingDetail.business_name}
                                                    </Title>}
                                                    {bookingDetail.name && <Title level={4}>
                                                        {bookingDetail.name && bookingDetail.name}
                                                    </Title>}
                                                    {bookingDetail && bookingDetail.business_location && <div className='address mb-5'>
                                                        <Text>
                                                            {/* {'318 boundry road north melbourn '} */}
                                                            {bookingDetail && bookingDetail.business_location ? bookingDetail.business_location : ''}
                                                            &nbsp;&nbsp;</Text>&nbsp;&nbsp;
                                                        <Link to={path} className='blue-link'>{'View map'}</Link>
                                                    </div>}
                                                    {bookingDetail.trader_profile && bookingDetail.trader_profile.abn_acn_number && <div className='address mb-5'>
                                                        <Text> ABN - {bookingDetail.trader_profile.abn_acn_number && bookingDetail.trader_profile.abn_acn_number}</Text>
                                                    </div>}
                                                    <div className='product-ratting mb-15'>
                                                        <Text>{rate ? rate : 'No reviews yet'}</Text>
                                                        {rate && <Rate disabled defaultValue={rate ? rate : 0.0} />}
                                                        <Text>{rate ? `${rate} of 5.0  ` : ''}</Text>
                                                        {/* <span className='blue-link'>
                                                            {bookingDetail.valid_trader_ratings && `${bookingDetail.valid_trader_ratings.length}  reviews`}
                                                        </span> */}
                                                        {rate && <span className='blue-link' onClick={this.activeTab} style={{ cursor: 'pointer' }}>
                                                            {bookingDetail.valid_trader_ratings && `${bookingDetail.valid_trader_ratings.length}  reviews`}
                                                        </span>}

                                                    </div>

                                                    {bookingDetail && <div>
                                                        <Link
                                                            to={subCategoryPagePath}>
                                                            <Button
                                                                type='ghost'
                                                                shape={'round'}
                                                                className={'mr-10'}
                                                                style={{ borderWidth: 1 }}
                                                            >
                                                                {subCategoryName ? subCategoryName : subcatName}
                                                            </Button>
                                                        </Link>
                                                    </div>}
                                                    {workigHours && <Dropdown overlay={dateTime} className='c-dropdown mt-20 head-active'>
                                                        <Button>
                                                            <Icon icon='clock' size='19' className='mr-10' />
                                                            <Text className='strong mr-10'>Open today</Text> <Text>{`${formateTime(workigHours[0].start_time)} - ${formateTime(workigHours[0].end_time)}`}</Text>
                                                            <Icon icon='arrow-down' size='16' className='ml-12' />
                                                        </Button>
                                                    </Dropdown>}
                                                    <div className='action-card mt-25'>
                                                        <ul>
                                                            <li>
                                                                <Icon icon='call' size='20' onClick={this.contactModal} />
                                                            </li>
                                                            <li>
                                                                <Icon
                                                                    icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                                                                    size='20'
                                                                    className={is_favourite ? 'active' : ''}
                                                                    onClick={() => this.onSelection(bookingDetail)}
                                                                />
                                                            </li>
                                                            <li>
                                                                <Dropdown overlay={menu} trigger={['click']}>
                                                                    <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                                                        <Icon icon='share' size='20' />
                                                                    </div>
                                                                </Dropdown>
                                                            </li>
                                                            <li>
                                                                <div><Icon icon='view' size='20' /> <Text>{bookingDetail.views}</Text></div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {(categoryName === TEMPLATE.HANDYMAN || categoryName === TEMPLATE.PSERVICES) &&
                                                        <Row gutter={[20, 0]} className='action-btn'>
                                                            {categoryName !== TEMPLATE.PSERVICES && <Col>
                                                                <Button
                                                                    type='default'
                                                                    onClick={this.handymanRequestQuote}
                                                                >
                                                                    {'Request a Quote'}
                                                                </Button>
                                                            </Col>}
                                                            <Col >
                                                                <Button
                                                                    type='default'
                                                                    onClick={this.handymanBookingModel}
                                                                >
                                                                    {'Request Booking'}
                                                                </Button>
                                                            </Col>
                                                        </Row>}
                                                    {categoryName === TEMPLATE.EVENT &&
                                                        <Row gutter={[20, 0]} className='action-btn'>
                                                            {/* <Col>
                                                                <Button
                                                                    type='default'
                                                                // onClick={this.contactModal}
                                                                >
                                                                    {'Enquire'}
                                                                </Button>
                                                            </Col> */}
                                                            {subCategoryName === langs.key.caterers &&

                                                                <Col>
                                                                    <Button
                                                                        type='default'
                                                                        onClick={this.displayCaterersEnquireModal}
                                                                    >
                                                                        {'Enquire'}
                                                                    </Button>
                                                                </Col>}
                                                        </Row>}

                                                    {subCategoryName === TEMPLATE.FITNESS &&
                                                        <Row gutter={[20, 0]} className='action-btn'>
                                                            <Col>
                                                                <Button
                                                                    type='default'
                                                                    onClick={() => this.props.history.push(`/view-schedule/${categoryName}/${pid}/${subCategoryName}/${subCategoryId}/${bookingDetail.id}/${bookingDetail.trader_profile.id}`)}
                                                                >
                                                                    {'View Schedule'}
                                                                </Button>
                                                            </Col>
                                                            <Col>
                                                                <Button
                                                                    type='default'
                                                                    onClick={() => this.props.history.push(`/memberships/${categoryName}/${pid}/${subCategoryName}/${subCategoryId}/${bookingDetail.id}/${bookingDetail.trader_profile.id}`)}
                                                                >
                                                                    {'View Membership'}
                                                                </Button>
                                                            </Col>
                                                        </Row>}

                                                </div>
                                            </Col>}
                                        </Row>
                                        <div ref={this.myDivToFocus}>
                                            <Tabs
                                                type='card'
                                                className={'tab-style3 product-tabs'}
                                                activeKey={activeTab}
                                                onChange={this.onTabChange}
                                            >
                                                {renderInfoTab(bookingDetail, infoTabName, categoryName)}
                                                {(categoryName === TEMPLATE.HANDYMAN &&
                                                    renderServiceTab(bookingDetail, categoryName)
                                                )}
                                                {(categoryName === TEMPLATE.BEAUTY && bookingDetail &&
                                                    this.renderServiceTab(bookingDetail, 'Service', categoryName, subCategoryName)
                                                )}
                                                {(categoryName === TEMPLATE.WELLBEING && bookingDetail && subCategoryName !== TEMPLATE.FITNESS &&
                                                    this.renderSpaService(bookingDetail, 'Service', categoryName, subCategoryName)
                                                )}
                                                {(bookingDetail && categoryName === TEMPLATE.WELLBEING && subCategoryName === TEMPLATE.FITNESS &&
                                                    this.renderFitnessClassesTab(bookingDetail, 'Class', categoryName, subCategoryName)
                                                )}
                                                {(categoryName !== TEMPLATE.WELLBEING &&
                                                    this.renderPortFolioTab(portfolio, categoryName)
                                                )}
                                                <TabPane tab='Reviews' key='4'>
                                                    <Row className='reviews-content'>
                                                        {bookingDetail && <Col md={5}>
                                                            <Avatar
                                                                src={bookingDetail.image ? bookingDetail.image : <Avatar size={54} icon={<UserOutlined />} />}
                                                                size={69}
                                                            />
                                                            <Title level={4} className='mt-10'>
                                                                {bookingDetail.business_name && bookingDetail.business_name}
                                                            </Title>
                                                            <Paragraph className='fs-10'>
                                                                {bookingDetail.trader_profile &&
                                                                    `(Member since : ${displayDateTimeFormate(bookingDetail.trader_profile.created_at)})`}
                                                            </Paragraph>
                                                        </Col>}
                                                        {bookingDetail && <Review
                                                            bookingDetail={bookingDetail}
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
                    <Modal
                        title='Book Now'
                        visible={this.state.visibleClassBuyModal}
                        className={'custom-modal style1'}
                        footer={false}
                        onCancel={() => this.setState({ visibleClassBuyModal: false })}
                        destroyOnClose={true}
                    >
                        <div className='padding'>
                            <BuyClassModal
                                selectedClass={selectedFitnessType}
                                // selectedDate={selectedDate}
                                selectedService={this.state.selectedClassSchedule}
                                initialStep={0}
                                bookingDetail={bookingDetail}
                            />
                        </div>
                    </Modal>
                    <Modal
                        title='Contact to advertiser'
                        visible={this.state.visible}
                        className={'custom-modal style1'}
                        footer={false}
                        onCancel={this.handleCancel}
                    >
                        <div className='padding'>
                            <Row className='mb-35'>
                                <Col md={11}>
                                    <Text className='fs-18'>To : Harris Jarell </Text>
                                </Col>
                                <Col md={9} className='align-right'>
                                    <Text className='text-gray'>(Member since April 2018)</Text>
                                </Col>
                            </Row>
                            <Form
                                {...layout}
                                name='basic'
                                initialValues={{ remember: true }}
                            >
                                <Form.Item
                                    label='Name'
                                    name='name'
                                >
                                    <Input placeholder={'Enter your name'} className='shadow-input' />
                                </Form.Item>
                                <Row>
                                    <Col span={6}></Col>
                                    <Col span={13} offset={1}>
                                        <Text className='strong'>Please send me more informations</Text>
                                        <Row gutter={[10, 10]} className='mt-6 mb-25'>
                                            <Col span={12}>
                                                <Checkbox>Inspection times</Checkbox>
                                            </Col>
                                            <Col span={12}>
                                                <Checkbox>Contract of sale</Checkbox>
                                            </Col>
                                            <Col span={12}>
                                                <Checkbox>Price guide</Checkbox>
                                            </Col>
                                            <Col span={12}>
                                                <Checkbox>Similar properties</Checkbox>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label='Body of message (1500) characters remaining'
                                >
                                    <TextArea rows={4} placeholder={'Write your message here'} className='shadow-input' />
                                </Form.Item>

                                <Form.Item {...tailLayout}>
                                    <Button type='default' htmlType='submit'>
                                        Send
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Modal>
                    <Modal
                        title='Book Now'
                        visible={this.state.displaySpaBookingModal}
                        className={'custom-modal style1 bookinghandyman-maintemplate-requestbooking boking-wellbeing-spa-modal'}
                        footer={false}
                        onCancel={this.hideSpaBookingModal}
                        destroyOnClose={true}
                    >
                        <div className='padding'>
                            <BookingPage selectedSpaService={this.state.selectedSpaService} initialStep={0} bookingDetail={bookingDetail} />
                        </div>
                    </Modal>
                    <Modal
                        title='Book Now'
                        visible={this.state.displayBeautyBookingModal}
                        className={'custom-modal style1 bookinghandyman-maintemplate-requestbooking boking-wellbeing-spa-modal beauty-booking-modal'}
                        footer={false}
                        onCancel={this.hideBeautyBookingModal}
                        destroyOnClose={true}
                    >
                        <div className='padding'>
                            <BeautyBookingModalContent selectedBeautyService={this.state.selectedBeautyService} initialStep={0} bookingDetail={bookingDetail} />
                        </div>
                    </Modal>
                    <Modal
                        title='Enquire'
                        visible={this.state.displayCaterersEnquireModal}
                        className={'custom-modal style1'}
                        footer={false}
                        onCancel={this.hideCaterersEnquireModal}
                        destroyOnClose={true}
                    >
                        <div className='padding'>
                            <CaterersEnquiryModalContent hideCaterersEnquireModal={this.hideCaterersEnquireModal} initialStep={0} bookingDetail={bookingDetail} subCategoryName={subCategoryName} />
                        </div>
                    </Modal>
                    <Modal
                        title='Request a Quote'
                        visible={this.state.requestQuoteModel}
                        className={'custom-modal style1 bookinghandyman-maintemplate-requestmodel'}
                        footer={false}
                        onCancel={() => this.setState({ requestQuoteModel: false })}
                        destroyOnClose={true}
                    >
                        <div className='padding'>
                            <HandyManRequestQuote onCancel={() => this.setState({ requestQuoteModel: false })} initialStep={0} bookingDetail={bookingDetail} subCategoryName={subCategoryName} />
                        </div>
                    </Modal>
                    {/* {reviewModel &&
                        <LeaveReviewModel
                            visible={reviewModel}
                            onCancel={this.handleCancel}
                            classifiedDetail={bookingDetail && bookingDetail}
                            callNext={this.getDetails}
                        />} */}
                    {/* {handymanBooking &&
                        <RequestQuote
                            visible={handymanBooking}
                            onCancel={this.handleCancel}
                            classifiedDetail={bookingDetail && bookingDetail}
                            callNext={this.getDetails}
                        />} */}
                    <Modal
                        title='Request Booking'
                        visible={this.state.handymanBooking}
                        className={'custom-modal style1 bookinghandyman-maintemplate-requestbooking'}
                        footer={false}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                    >
                        <div className='padding'>
                            <HandyManRequestBooking onCancel={this.handleCancel} selectedSpaService={bookingDetail} initialStep={0} bookingDetail={bookingDetail} />
                        </div>
                    </Modal>
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
    { getFitnessClassListing, getPortFolioData, getBookingDetails, getClassfiedCategoryDetail, addToFavorite, removeToFavorite, openLoginModel, enableLoading, disableLoading }
)(Details);