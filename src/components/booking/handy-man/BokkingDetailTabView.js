import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router'
import { Empty, Card, Typography, Tabs, Row, Col, Input, Select, Checkbox, Button, Modal, Divider } from "antd";
import {
    getFitnessClassListing,
    getPortFolioData,
    getBookingDetails,
    enableLoading,
    disableLoading,
    addToFavorite,
    removeToFavorite,
    openLoginModel,
    getClassfiedCategoryDetail,
} from "../../../actions/index";
import { TEMPLATE } from "../../../config/Config";
import { langs } from "../../../config/localization";
import { convertHTMLToText } from "../../common";
import Review from "../common/Review";
import { renderInfoTab, renderServiceTab } from "../common/index";
import "../../dashboard/vendor-profiles/myprofilestep.less";
import BookingPage from "../wellbeing/spa/booking";
import CaterersEnquiryModalContent from "../events/caterers/enquiry";
import BeautyBookingModalContent from "../beauty/booking";
import HandyManRequestQuote from "../handy-man/request-quote";
import HandyManRequestBooking from "../handy-man/request-booking";
import BuyClassModal from "../wellbeing/fitness/booking/buy-class";
import PortfolioGallery from "../../common/caraousal/PortfolioGallery";
import ReportAd from '../common/ReportAd'

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;

const PortfolioGallerySlide = [
    {
        "id": 1,
        "full_image": `${require('../../../assets/images/portfolio-gallery-slide.jpg')}`
    },
    {
        "id": 2,
        "full_image": `${require('../../../assets/images/portfolio-gallery-slide2.jpg')}`
    },
    {
        "id": 3,
        "full_image": `${require('../../../assets/images/portfolio-gallery-slide3.jpg')}`
    },
    {
        "id": 4,
        "full_image": "https://formee.com/formee/upload_images/services/1136/main/1602255601.jpg",
    },
    {
        "id": 5,
        "full_image": "https://formee.com/formee/upload_images/services/1136/main/1602255601.jpg",
    },
    {
        "id": 6,
        "full_image": "https://formee.com/formee/upload_images/services/1136/main/1602255601.jpg",
    }
]


class Details extends React.Component {
    myDivToFocus = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            allData: "",
            activeTab: "1",
            portfolio: [],
            classes: [],
            uniqueFitnessTabs: [],
            selectedFitnessType: [],
            displaySpaBookingModal: false,
            selectedSpaService: "",
            displayCaterersEnquireModal: false,
            selectedBeautyService: [],
            displayBeautyBookingModal: false,
            requestQuoteModel: false,
            handymanBooking: false,
            visibleClassBuyModal: false,
            viewGalleryModal: false,
            selectedClassSchedule: "",
            selectedClass: "",
            selectedBeautyServiceOption: '',
            selectedImage: [],
            reportAdModel: false,
            showMoreText: false,
            activeIndex: 0
        };
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let tab = nextprops.priorityTab
        if (tab === '4') {
            this.setState({ activeTab: '4' })
        } else if (tab === '2') {
            this.setState({ activeTab: '2' })
        }
    }

    /**
     * @method componentDidMount
     * @description called after render the component
     */
    componentDidMount() {
        this.getDetails()
    }

    /**
     * @method getDetails
     * @description get details
     */
    getDetails = (filter) => {
        const { isLoggedIn, loggedInDetail, parameter } = this.props;
        let itemId = parameter && parameter.itemId
        let reqData = {
            id: itemId,
            user_id: isLoggedIn ? loggedInDetail.id : "",
            filter: filter ? filter : 'top_rated',
            login_user_id: isLoggedIn ? loggedInDetail.id : "",
        };
        this.props.getBookingDetails(reqData, (res) => {
            this.props.disableLoading();
            this.props.getPortFolioData(itemId, (res) => {
                if (res.status === 200) {
                    let data = res.data;
                    this.setState({ portfolio: data });
                }
            });
            if (res.status === 200) {
                let trader_profile_id = res.data.data.trader_profile && res.data.data.trader_profile.id;
                this.props.getFitnessClassListing({ id: trader_profile_id, page_size: 50 }, (res) => {
                    if (res.data.status === 200) {
                        let data = res.data && res.data.data;
                        let traderClasses = data.trader_classes && Array.isArray(data.trader_classes) && data.trader_classes.length ? data.trader_classes : [];
                        const uniqueTabs = [...new Set(traderClasses.map((item) => item.wellbeing_fitness_type.name)),
                        ]; // [ 'A', 'B']
                        let selectedFitnessType = traderClasses.filter((c) => {
                            if (uniqueTabs.length && c.wellbeing_fitness_type.name == uniqueTabs[0]) {
                                return c;
                            }
                        });
                        this.setState({
                            classes: traderClasses,
                            uniqueFitnessTabs: uniqueTabs,
                            selectedFitnessType,
                            selectedClass: uniqueTabs[0],
                        });
                    }
                }
                );
                let initialBeautyService = Array.isArray(res.data.data.profile_services) && res.data.data.profile_services.length ? res.data.data.profile_services[0].id : ''
                this.setState({
                    bookingDetail: res.data.data,
                    allData: res.data,
                    selectedBeautyServiceOption: initialBeautyService
                });
            }
        });
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
            this.props.openLoginModel();
        }
    };

    /**
     * @method handleCancel
     * @description handle cancel
     */
    handleCancel = (e) => {
        this.setState({
            visible: false,
            handymanBooking: false,
        });
    };

    /**
     * @method renderService
     * @description render service  details
     */
    renderBeautyService = () => {
        const { bookingDetail } = this.state
        const item = bookingDetail && bookingDetail.profile_services;
        let index = item.findIndex((el) => el.id === this.state.selectedBeautyServiceOption)
        return (
            <>
                <div className="beauty-service-box">
                    {index >= 0 && this.renderUserBeautyServices(
                        item[index].trader_user_profile_services,
                        'Book'
                    )}
                </div>
                <div className="beauty-service-box-btn align-right">
                    {this.state.selectedBeautyService.length > 0 && (
                        <Button
                            className="yellow-btn"
                            onClick={() => {
                                this.displayBeautyBookingModal();
                            }}
                        >
                            Book
                        </Button>
                    )}
                </div>
            </>
        );
    };

    /**
     * @method renderUserBeautyServices
     * @description render beauty service details
     */
    renderUserBeautyServices = (item, buttonName) => {
        if (item && item.length) {
            return (item && Array.isArray(item) && item.map((el, i) => {
                let isSelected = this.state.selectedBeautyService.some((vendor) => vendor["id"] === el.id);
                return (
                    <div className="beauty-service">
                        <Row gutter={[30, 30]} key={i} align="top" className="mb-0">
                            <Col span={10}>
                                <Text className="strong">{el.name ? el.name : ""}</Text>
                                <br />
                                <Text>{`${el.duration ? el.duration : ""} minutes`}</Text>
                            </Col>
                            <Col span={9}>
                                <Text className="strong">
                                    {el.price ? `AU$${el.price}` : "Price not found"}
                                </Text>
                            </Col>
                            <Col span={5}>
                                <Checkbox
                                    key={`${i}_beauty_service_item`}
                                    checked={isSelected}
                                    onChange={(e) => {
                                        let temp = this.state.selectedBeautyService;
                                        if (!isSelected) {
                                            temp.push(el);
                                            this.setState({ selectedBeautyService: temp });
                                        } else {
                                            temp = temp.filter((k) => k.id !== el.id);
                                            this.setState({ selectedBeautyService: temp });
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        <Divider />
                    </div>
                );
            })
            );
        }
    };

    /**
     * @method renderFitnessClassesTab
     * @description render service tab
     */
    renderFitnessClassesTab = (
        bookingDetail,
        tabName,
        categoryName,
        subCategoryName
    ) => {
        const { classes, uniqueFitnessTabs } = this.state;
        return (
            <TabPane tab={tabName} key="2" className="inner-tab-detail classes-tab-detail">
                <Row justify="center">
                    <Col span={20}>
                        {Array.isArray(uniqueFitnessTabs) && uniqueFitnessTabs.length ? (
                            <Tabs
                                type="card"
                                onTabClick={(e) => {
                                    let temp = classes.filter((c) => {
                                        if (c.wellbeing_fitness_type.name == e) {
                                            return c;
                                        }
                                    });
                                    this.setState({ selectedFitnessType: temp, selectedClass: e });
                                }}
                            >
                                {Array.isArray(uniqueFitnessTabs) &&
                                    uniqueFitnessTabs.length &&
                                    uniqueFitnessTabs.map((el, i) => {
                                        return (
                                            <TabPane tab={el} key={el}>
                                                {this.renderFitnessServiceType(
                                                    el.trader_user_profile_services,
                                                    "View Schedule"
                                                )}
                                            </TabPane>
                                        );
                                    })}
                            </Tabs>
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </Col>
                </Row>
            </TabPane>
        );
    };

    /**
     * @method displayClassBuyModal
     * @description display Fitness membership
     */
    displayClassBuyModal = (selectedClassSchedule) => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                visibleClassBuyModal: true,
                selectedClassSchedule: selectedClassSchedule,
            });
        } else {
            this.props.openLoginModel();
        }
    };

    /**
     * @method renderFitnessServiceType
     * @description render fitness service type
     */
    renderFitnessServiceType = (item, buttonName) => {
        const { parameter } = this.props;
        const { bookingDetail, selectedFitnessType, selectedClass } = this.state
        let categoryName = parameter.categoryName;
        let pid = parameter.categoryId;
        let subcatName, subcatId;
        subcatId =
            bookingDetail &&
            bookingDetail.trader_profile &&
            bookingDetail.trader_profile.booking_sub_cat_id;
        subcatName =
            bookingDetail &&
            bookingDetail.trader_profile &&
            bookingDetail.trader_profile.trader_service &&
            bookingDetail.trader_profile.trader_service.name;

        if (bookingDetail && selectedFitnessType && selectedFitnessType.length) {
            return (selectedFitnessType && Array.isArray(selectedFitnessType) && selectedFitnessType.map((el, i) => {
                return (
                    <div className="beauty-service">
                        <Row key={i} align="top" className="mb-0">
                            <Col span={10}>
                                <Text className="strong fs-16">{el.class_name}</Text>
                                <br />
                                {`${el.description}`}
                            </Col>
                            <Col span={6} className="text-center">
                                <Text>{`${el.trader_classes_schedules_count} mins`}</Text>
                            </Col>
                            <Col span={4}>
                                <Text className="strong fs-16 price">
                                    {el.price ? `$${el.price}` : "Price not found"}
                                </Text>
                            </Col>
                            <Col span={4}>
                                <Button
                                    type={'default'}
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: `/view-schedule/${categoryName}/${pid}/${subcatName}/${subcatId}/${bookingDetail.id}/${bookingDetail.trader_profile.id}`,
                                            state: { selectedClass: el.class_name },
                                        });
                                    }}
                                    className="yellow-btn w-100"
                                >
                                    {buttonName}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                );
            })
            );
        }
    };

    /**
     * @method renderServiceTab
     * @description render beauty service tab details
     */
    renderServiceTab = (bookingDetail, tabName, categoryName, subCategoryName) => {
        const item = bookingDetail && bookingDetail.profile_services;
        return (
            <TabPane tab={tabName} key="2" className="inner-tab-detail">
                {categoryName === TEMPLATE.WELLBEING && subCategoryName === TEMPLATE.FITNESS ? (
                    this.renderFitnessClassesTab()
                ) : Array.isArray(item) && item.length ? (
                    <Fragment>
                        <Tabs type="card">
                            {Array.isArray(item) &&
                                item.length &&
                                item.map((el, i) => {
                                    return (
                                        <TabPane tab={el.name} key={i}>
                                            {categoryName === TEMPLATE.BEAUTY &&
                                                this.renderBeautyService(el, el.name, "Book")}
                                        </TabPane>
                                    );
                                })}
                        </Tabs>
                    </Fragment>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </TabPane>
        )
    };

    /**
     * @method renderBeautyServiceTab
     * @description render beauty service tab details
     */
    renderBeautyServiceTab = (bookingDetail, tabName, categoryName, subCategoryName) => {
        const item = bookingDetail && bookingDetail.profile_services;
        let selectedServiceIndex = item.findIndex((el) => el.id === this.state.selectedBeautyServiceOption)
        let selectedService = item[selectedServiceIndex]
        return (
            <TabPane tab={tabName} key="2" className="inner-tab-detail">
                {Array.isArray(item) && item.length ?
                    <Row gutter={[60, 10]} className="service-tab-content">
                        <Col span={10}>
                            <Select
                                placeholder="Select"
                                value={this.state.selectedBeautyServiceOption}
                                onChange={(e) => {
                                    this.setState({ selectedBeautyServiceOption: e })
                                }}
                                allowClear
                            >
                                {item.map((keyName, i) => {
                                    return (
                                        <Option key={i} value={keyName.id}>
                                            {keyName.name}
                                        </Option>
                                    );
                                }
                                )}
                            </Select>
                            <div>
                                <Title level={3} className="title">{selectedServiceIndex >= 0 ? selectedService.name : ''}</Title>
                                <Text>{selectedServiceIndex >= 0 ? convertHTMLToText(selectedService.description) : ''}</Text>
                            </div>
                        </Col>
                        <Col span={14}>
                            {this.renderBeautyService()}
                        </Col>
                    </Row>
                    : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
            </TabPane>
        );
    };

    /**
   * @method renderSpaService
   * @description render spa services
   */
    renderSpaService = (bookingDetail, tabName, categoryName, subCategoryName) => {
        let data = bookingDetail && bookingDetail.trader_profile ? bookingDetail.trader_profile.wellbeing_trader_service : [];
        return (
            <TabPane tab={tabName} key="2" className="inner-tab-detail">
                {data && data.length !== 0 ? (
                    <div>
                        <div>
                            {categoryName === TEMPLATE.WELLBEING &&
                                subCategoryName !== TEMPLATE.FITNESS && (
                                    <Row>
                                        <Col span={24}>
                                            {this.renderSpaServiceType(data, "Book")}
                                        </Col>
                                    </Row>
                                )}
                        </div>
                    </div>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </TabPane>
        );
    };

    /**
     * @method renderSpaServiceType
     * @description render spa service type
     */
    renderSpaServiceType = (item, buttonName) => {
        if (item && item.length) {
            return (item && Array.isArray(item) && item.map((el, i) => {
                console.log(el, 'el')
                return (
                    <div>
                        <Row key={i} align="middle">
                            <Col span={11}>
                                <Text className="strong">{el.name}</Text>
                                <br />
                                {`${el.more_info}`}
                            </Col>
                            <Col span={5} className="text-center">
                                <Text>{`${el.duration} minutes`}</Text>
                            </Col>
                            <Col span={4} className="text-center">
                                <Text className="strong">
                                    {el.price ? `AU$${el.price}` : "Price not found"}
                                </Text>
                            </Col>
                            <Col span={4} className="text-right">
                                <Button
                                    onClick={() => this.displaySpaBookingModal(el)}
                                    className="yellow-btn w-100"
                                >
                                    {buttonName}
                                </Button>
                            </Col>
                        </Row>
                        <Divider />
                    </div>
                );
            })
            );
        }
    };

    /**
     * @method renderDetails
     * @description render details
     */
    renderPortfolioDetails = (item) => {
        if (item && Array.isArray(item) && item.length) {
            return item.map((el, i) => {
                return (
                    <li key={i} className="thumb" xs={24} sm={24} md={24} lg={4} xl={4}>
                        <a href={el.path} target="blank">
                            <img src={el.path} alt="" />
                        </a>
                        <br />
                    </li>
                );
            });
        } else {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }
    };

    /**
     * @method renderPortFolioTab
     * @description render port folio tab
     */
    renderPortFolioTab = (data, slug) => {
        const portfolio = data && Array.isArray(data.portfolio) && data.portfolio.length && data.portfolio[0].files ? data.portfolio[0].files : [];
        const brochure = data && data.brochure && data.brochure.files ? data.brochure.files : [];
        const certification = data && data.certification && data.certification.files ? data.certification.files : [];
        return (
            <TabPane tab="Portfolio" key="3" className="tab-portfolio">
                <div className="portfolio-tab-content">
                    <ul>
                        <li
                            className={certification.length !== 0 ? '' : 'no-data'}
                            onClick={() =>
                                certification.length !== 0 && this.viewGalleryModal(certification)}
                        >
                            <img src={certification.length !== 0 ? certification[0].path : require('../../../assets/images/certifications-img.jpg')} alt="" />
                            <div className="content">
                                <span className="icon"><img src={require('../../../assets/images/icons/medal-icon.svg')} alt="" /></span>
                                <Title level={4}>
                                    {certification.length !== 0 ? 'View' : 'No'} {' Certifications'}
                                </Title>
                            </div>
                        </li>
                        <li
                            className={brochure.length !== 0 ? '' : 'no-data'}
                            onClick={() =>
                                brochure.length !== 0 && this.viewGalleryModal(brochure)
                            }
                        >
                            <img src={brochure.length !== 0 ? brochure[0].path : require('../../../assets/images/brochure-img.jpg')} alt="" />
                            <div className="content">
                                <span className="icon"><img src={require('../../../assets/images/icons/brochure-icon.svg')} alt="" /></span>
                                <Title level={4}>
                                    {brochure.length !== 0 ? 'View' : 'No'} {' Brochure'}
                                </Title>
                            </div>
                        </li>
                        <li
                            className={portfolio.length !== 0 ? '' : 'no-data'}
                            onClick={() => {
                                portfolio.length !== 0 && this.viewGalleryModal(portfolio);
                            }}
                        >
                            <img src={portfolio.length !== 0 ? portfolio[0].path : require('../../../assets/images/gallery-img.jpg')} alt="" />
                            <div className="content">
                                <span className="icon"><img src={require('../../../assets/images/icons/services-portfolio-icon.svg')} alt="" /></span>
                                <Title level={4}>
                                    {portfolio.length !== 0 ? 'View' : 'No'} {' Gallery'}
                                </Title>
                            </div>
                        </li>
                    </ul>
                </div>
            </TabPane>
        );
    };

    /**
     * @method activeTab
     * @description handle active tab
     */
    activeTab = (key) => {
        this.setState({ activeTab: key });
        if (this.myDivToFocus.current) {
            window.scrollTo(0, this.myDivToFocus.current.offsetTop);
        }
    };

    /**
     * @method onTabChange
     * @description manage tab change
     */
    onTabChange = (key, type) => {
        this.setState({ activeTab: key, reviewTab: false });
    };

    /**
     * @method displaySpaBookingModal
     * @description display spa booking model
     */
    displaySpaBookingModal = (selectedSpaService) => {
        console.log(selectedSpaService, 'selectedSpaService')
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                displaySpaBookingModal: true,
                selectedSpaService: selectedSpaService,
            });
        } else {
            this.props.openLoginModel();
        }
    };

    /**
    * @method hideSpaBookingModal
    * @description hide spa booking model
    */
    hideSpaBookingModal = (e) => {
        this.setState({
            displaySpaBookingModal: false,
        });
    };

    /**
     * @method hideBeautyBookingModal
     * @description hide beauty booking model
     */
    hideBeautyBookingModal = (e) => {
        this.setState({
            displayBeautyBookingModal: false,
        });
    };

    /**
     * @method displayBeautyBookingModal
     * @description open beauty booking model
     */
    displayBeautyBookingModal = () => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                displayBeautyBookingModal: true,
            });
        } else {
            this.props.openLoginModel();
        }
    };

    /**
     * @method hideViewGalleryModal
     * @description hide view galary model
     */
    hideViewGalleryModal = (e) => {
        this.setState({
            viewGalleryModal: false,
        });
    };

    /**
     * @method viewGalleryModal
     * @description open view galary model
     */
    viewGalleryModal = (images, activeIndex) => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                viewGalleryModal: true,
                selectedImage: images,
                activeIndex
            });
        } else {
            this.props.openLoginModel();
        }
    };

    /**
     * @method displayCaterersEnquireModal
     * @description open caterer model
     */
    displayCaterersEnquireModal = (selectedSpaService) => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                displayCaterersEnquireModal: true,
                //selectedSpaService: selectedSpaService
            });
        } else {
            this.props.openLoginModel();
        }
    };

    /**
     * @method hideCaterersEnquireModal
     * @description hide caterer enquiry  model
     */
    hideCaterersEnquireModal = (e) => {
        this.setState({
            displayCaterersEnquireModal: false,
        });
    };
    /**
      * @method changeDescription
      * @description hide/show description view
      */
    changeDescription = (more) => {
        this.setState({
            showMoreText: more,
        });
    };


    /**
     * @method handymanRequestQuote
     * @description open handyman request quote model
     */
    handymanRequestQuote = () => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                requestQuoteModel: true,
            });
        } else {
            this.props.openLoginModel();
        }
    };

    /**
     * @method render
     * @description render component
     */
    render() {
        const { setPriorityTab, parameter } = this.props
        const { bookingDetail, activeTab, portfolio, selectedFitnessType, selectedImage, showMoreText, activeIndex } = this.state
        let subcatId, subcatName;
        let categoryName = parameter.categoryName;
        let subCategoryId = parameter.subCategoryId;
        if (subCategoryId === undefined) {
            subcatId = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.booking_sub_cat_id;
            subcatName = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.trader_service && bookingDetail.trader_profile.trader_service.name;
        }
        let subCategoryName = parameter.all === langs.key.all ? langs.key.All : subcatName;
        let infoTabName = categoryName === TEMPLATE.HANDYMAN ? "About Us" : "Info";
        return (
            <div>
                <Tabs
                    type="card"
                    className={"tab-style3 product-tabs"}
                    activeKey={activeTab}
                    // onChange={this.onTabChange}
                    onChange={(e) => {
                        this.onTabChange(e)
                        setPriorityTab()
                    }}
                >
                    {renderInfoTab(bookingDetail, infoTabName, categoryName, portfolio, this.viewGalleryModal, subCategoryName, this.changeDescription, showMoreText)}
                    {(categoryName === TEMPLATE.HANDYMAN || categoryName === TEMPLATE.PSERVICES) &&
                        renderServiceTab(bookingDetail, categoryName)}
                    {categoryName === TEMPLATE.BEAUTY && bookingDetail &&
                        this.renderBeautyServiceTab(bookingDetail, "Service", categoryName, subCategoryName)}
                    {categoryName === TEMPLATE.WELLBEING && bookingDetail && subCategoryName !== TEMPLATE.FITNESS &&
                        this.renderSpaService(bookingDetail, "Service", categoryName, subCategoryName)}
                    {bookingDetail && categoryName === TEMPLATE.WELLBEING && subCategoryName === TEMPLATE.FITNESS &&
                        this.renderFitnessClassesTab(bookingDetail, "Classes", categoryName, subCategoryName)}
                    {subCategoryName !== TEMPLATE.FITNESS &&
                        this.renderPortFolioTab(portfolio, categoryName)
                    }
                    <TabPane tab="Reviews" key="4">
                        <Row className="reviews-content">
                            {bookingDetail && (
                                <Review
                                    bookingDetail={bookingDetail}
                                    getDetails={this.getDetails}
                                />
                            )}
                        </Row>
                    </TabPane>
                </Tabs>
                <Modal
                    title="Book Now"
                    visible={this.state.visibleClassBuyModal}
                    className={"custom-modal style1"}
                    footer={false}
                    onCancel={() => this.setState({ visibleClassBuyModal: false })}
                    destroyOnClose={true}
                >
                    <div className="padding">
                        <BuyClassModal
                            selectedClass={selectedFitnessType}
                            selectedService={this.state.selectedClassSchedule}
                            initialStep={0}
                            bookingDetail={bookingDetail}
                        />
                    </div>
                </Modal>
                <Modal
                    title="Book Now"
                    visible={this.state.displaySpaBookingModal}
                    className={
                        "custom-modal order-checkout-booking-welbeign-spa  style1 bookinghandyman-maintemplate-requestbooking boking-wellbeing-spa-modal"
                    }
                    footer={false}
                    onCancel={this.hideSpaBookingModal}
                    destroyOnClose={true}
                >
                    <div className="padding">
                        <BookingPage
                            selectedSpaService={this.state.selectedSpaService}
                            initialStep={0}
                            bookingDetail={bookingDetail}
                        />
                    </div>
                </Modal>
                <Modal
                    title="Book Now"
                    visible={this.state.displayBeautyBookingModal}
                    className={
                        "custom-modal style1 bookinghandyman-maintemplate-requestbooking boking-wellbeing-spa-modal beauty-booking-modal"
                    }
                    footer={false}
                    onCancel={this.hideBeautyBookingModal}
                    destroyOnClose={true}
                >
                    <div className="padding">
                        <BeautyBookingModalContent
                            selectedBeautyService={this.state.selectedBeautyService}
                            initialStep={0}
                            bookingDetail={bookingDetail}
                        />
                    </div>
                </Modal>
                <Modal
                    title="Enquire"
                    visible={this.state.displayCaterersEnquireModal}
                    className={
                        "custom-modal style1 bookinghandyman-maintemplate-enquire"
                    }
                    footer={false}
                    onCancel={this.hideCaterersEnquireModal}
                    destroyOnClose={true}
                >
                    <div className="padding">
                        <CaterersEnquiryModalContent
                            hideCaterersEnquireModal={this.hideCaterersEnquireModal}
                            initialStep={0}
                            bookingDetail={bookingDetail}
                            subCategoryName={subCategoryName}
                        />
                    </div>
                </Modal>
                <Modal
                    title="Request a Quote"
                    visible={this.state.requestQuoteModel}
                    className={
                        "custom-modal style1 bookinghandyman-maintemplate-requestmodel"
                    }
                    footer={false}
                    onCancel={() => this.setState({ requestQuoteModel: false })}
                    destroyOnClose={true}
                >
                    <div className="padding">
                        <HandyManRequestQuote
                            onCancel={() => this.setState({ requestQuoteModel: false })}
                            initialStep={0}
                            bookingDetail={bookingDetail}
                            subCategoryName={subCategoryName}
                        />
                    </div>
                </Modal>
                <Modal
                    title="Request Booking"
                    visible={this.state.handymanBooking}
                    className={
                        "custom-modal style1 bookinghandyman-maintemplate-requestbooking"
                    }
                    footer={false}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <div className="padding">
                        <HandyManRequestBooking
                            onCancel={this.handleCancel}
                            selectedSpaService={bookingDetail}
                            initialStep={0}
                            bookingDetail={bookingDetail}
                        />
                    </div>
                </Modal>

                <Modal
                    //title="View Gallery"
                    visible={this.state.viewGalleryModal}
                    className={"view-portfolio-gallery-modal"}
                    footer={false}
                    onCancel={this.hideViewGalleryModal}
                    destroyOnClose={true}
                >
                    <div className="view-portfolio-gallery-content">
                        <PortfolioGallery
                            className="mb-4"
                            isBooking={true}
                            slides={PortfolioGallerySlide}
                            imageList={selectedImage}
                            activeIndex={activeIndex}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, classifieds } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedclassifiedDetail: classifieds.classifiedsList,
    };
};

export default connect(mapStateToProps, {
    getFitnessClassListing,
    getPortFolioData,
    getBookingDetails,
    getClassfiedCategoryDetail,
    addToFavorite,
    removeToFavorite,
    openLoginModel,
    enableLoading,
    disableLoading,
})(React.memo(withRouter(Details)));
