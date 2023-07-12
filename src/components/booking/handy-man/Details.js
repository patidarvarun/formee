import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import {
  Empty,
  Card,
  Layout,
  Typography,
  Avatar,
  Tabs,
  Row,
  Col,
  Breadcrumb,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Rate,
  Modal,
  Dropdown,
  Divider,
  Tag,
  Carousel,
  Menu, Tooltip,
} from "antd";
import Icon from "../../../components/customIcons/customIcons";
import { ExclamationCircleOutlined } from '@ant-design/icons';
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
import {
  getBookingCatLandingRoute,
  getBookingMapDetailRoute,
  getBookingSubcategoryRoute,
} from "../../../common/getRoutes";
import { DEFAULT_IMAGE_CARD, TEMPLATE, CATNAME } from "../../../config/Config";
import { langs } from "../../../config/localization";
import {
  salaryNumberFormate,
  displayDateTimeFormate,
  convertHTMLToText,
  converInUpperCase,
  formateTime,
  getDaysName,
  capitalizeFirstLetter,
} from "../../common";
import { STATUS_CODES } from "../../../config/StatusCode";
import { SocialShare } from "../../common/social-share";
import Magnifier from "react-magnifier";
import history from "../../../common/History";
import Review from "../common/Review";
import Map from '../../common/Map';
import {
  renderInfoTab,
  renderPortFolioTab,
  renderServiceTab,
} from "../common/index";
import { BASE_URL } from "../../../config/Config";
import BeautyServiceDetail from "../common/BeautyServiceDetail";
import "../../dashboard/vendor-profiles/myprofilestep.less";
import BookingPage from "../wellbeing/spa/booking";
import CaterersEnquiryModalContent from "../events/caterers/enquiry";
import SubHeader from "../common/SubHeader";
import BeautyBookingModalContent from "../beauty/booking";
import HandyManRequestQuote from "../handy-man/request-quote";
import HandyManRequestBooking from "../handy-man/request-booking";
import RequestQuote from "../handy-man/request-quote/RequestQuoteModel";
import BuyClassModal from "../wellbeing/fitness/booking/buy-class";
import AppSidebar from "../common/Sidebar";
import DetailCarousel from "../../common/caraousal";
import PortfolioGallery from "../../common/caraousal/PortfolioGallery";
import ReportAd from '../common/ReportAd'
import { MESSAGES } from "../../../config/Message";
import BookingDetailTabView from './BokkingDetailTabView'

const { Title, Paragraph, Text } = Typography;
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
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: "align-center pt-20",
};

class Details extends React.PureComponent {
  myDivToFocus = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      // bookingDetail: [],
      allData: "",
      visible: false,
      makeOffer: false,
      carouselNav1: null,
      carouselNav2: null,
      reviewModel: false,
      activeTab: "1",
      portfolio: [],
      isBrochure: false,
      isPortfolio: false,
      isCertificate: false,
      classes: [],
      uniqueFitnessTabs: [],
      selectedFitnessType: [],
      is_favourite: false,
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
      priorityTab: 0,

    };
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getDetails();
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    let filter = this.props.match.params.filter;
    if (filter && filter === "daily-deals") {
      this.setState({ activeTab: "2" });
      if (this.myDivToFocus.current) {
        window.scrollTo(0, this.myDivToFocus.current.offsetTop);
      }
    }
    this.setState({
      carouselNav1: this.slider1,
      carouselNav2: this.slider2,
    });
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = (filter) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let itemId = this.props.match.params.itemId;
    let reqData = {
      id: itemId,
      user_id: isLoggedIn ? loggedInDetail.id : "",
      filter: filter ? filter : 'top_rated',
      login_user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getBookingDetails(reqData, (res) => {
      this.props.disableLoading();
      // this.props.getPortFolioData(itemId, (res) => {
      //   if (res.status === 200) {
      //     let data = res.data;
      //     this.setState({ portfolio: data });
      //   }
      // });
      if (res.status === 200) {
        let trader_profile_id =
          res.data.data.trader_profile && res.data.data.trader_profile.id;
        // this.props.getFitnessClassListing(
        //   { id: trader_profile_id, page_size: 50 },
        //   (res) => {
        //     if (res.data.status === 200) {
        //       let data = res.data && res.data.data;
        //       let traderClasses =
        //         data.trader_classes &&
        //           Array.isArray(data.trader_classes) &&
        //           data.trader_classes.length
        //           ? data.trader_classes
        //           : [];
        //       const uniqueTabs = [
        //         ...new Set(
        //           traderClasses.map((item) => item.wellbeing_fitness_type.name)
        //         ),
        //       ]; // [ 'A', 'B']
        //       let selectedFitnessType = traderClasses.filter((c) => {
        //         if (
        //           uniqueTabs.length &&
        //           c.wellbeing_fitness_type.name == uniqueTabs[0]
        //         ) {
        //           return c;
        //         }
        //       });
        //       this.setState({
        //         classes: traderClasses,
        //         uniqueFitnessTabs: uniqueTabs,
        //         selectedFitnessType,
        //         selectedClass: uniqueTabs[0],
        //       });
        //     }
        //   }
        // );
        let is_favourite =
          res.data.data && res.data.data.is_favourite === 1 ? true : false;
        let initialBeautyService = Array.isArray(res.data.data.profile_services) && res.data.data.profile_services.length ? res.data.data.profile_services[0].id : ''
        this.setState({
          bookingDetail: res.data.data,
          allData: res.data,
          is_favourite: is_favourite,
          selectedBeautyServiceOption: initialBeautyService
        });
      }
    });
  };

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
      this.props.openLoginModel();
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
      this.props.openLoginModel();
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
      makeOffer: false,
      reviewModel: false,
      handymanBooking: false,
    });
  };

  /**
   * @method renderSpecification
   * @description render specification list
   */
  renderSpecification = (data) => {
    return (
      data &&
      Array.isArray(data) &&
      data.map((el, i) => {
        return (
          <Row className="pt-5" key={i}>
            <Col span={5}>
              <Text className="strong">{el.key}</Text>
            </Col>
            <Col span={14}>
              <Text>{el.value}</Text>
            </Col>
          </Row>
        );
      })
    );
  };

  /**
   * @method renderImages
   * @description render image list
   */
  renderImages = (item) => {
    if (item && item.length) {
      return (
        item &&
        Array.isArray(item) &&
        item.map((el, i) => {
          return (
            <div key={i}>
              <Magnifier
                src={el.full_image ? el.full_image : DEFAULT_IMAGE_CARD}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE_CARD;
                }}
                alt={""}
              />
            </div>
          );
        })
      );
    } else {
      return (
        <div>
          <img src={DEFAULT_IMAGE_CARD} alt="" />
        </div>
      );
    }
  };

  /**
   * @method renderThumbImages
   * @description render thumbnail images
   */
  renderThumbImages = (item) => {
    if (item && item.length) {
      return (
        item &&
        Array.isArray(item) &&
        item.map((el, i) => {
          return (
            <div key={i} className="slide-content">
              <img
                src={el.full_image ? el.full_image : DEFAULT_IMAGE_CARD}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE_CARD;
                }}
                alt={""}
              />
            </div>
          );
        })
      );
    } else {
      return (
        <div className="slide-content hide-cloned">
          <img src={DEFAULT_IMAGE_CARD} alt="" />
        </div>
      );
    }
  };

  /**
   * @method onSelection
   * @description handle favorite unfavorite
   */
  onSelection = (data) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const { is_favourite } = this.state;
    if (isLoggedIn) {
      if (data.is_favourite === 1 || is_favourite) {
        const requestData = {
          user_id: loggedInDetail.id,
          item_id: data.id,
        };
        this.props.enableLoading();
        this.props.removeToFavorite(requestData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, res.data.message);
            // this.getDetails()
            this.setState({ is_favourite: false });
          }
        });
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          item_type: "trader",
          item_id: data.id,
          category_id: data.trader_profile.booking_cat_id,
          sub_category_id: data.trader_profile.booking_sub_cat_id,
        };
        this.props.enableLoading();
        this.props.addToFavorite(requestData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, res.data.message);
            // this.getDetails()
            this.setState({ is_favourite: true });
          }
        });
      }
    } else {
      this.props.openLoginModel();
    }
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
      return (
        item &&
        Array.isArray(item) &&
        item.map((el, i) => {
          let isSelected = this.state.selectedBeautyService.some(
            (vendor) => vendor["id"] === el.id
          );
          return (
            <div className="beauty-service">
              <Row gutter={[30, 30]} key={i} align="top" className="mb-0">
                {/* <Col span={5}>
                  <div className="thumb">
                    {" "}
                    <img
                      src={
                        el.service_image
                          ? `${BASE_URL}/${el.service_image}`
                          : DEFAULT_IMAGE_CARD
                      }
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD;
                      }}
                    />
                  </div>

                  <div className="subtitle pt-10"><Text className='strong'>{`${el.more_info ? el.more_info : ''}`}</Text></div>
                </Col> */}
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
                      //temp.length = 0;
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
              {/* <Button className="yellow-btn w-100">{buttonName}</Button> */}
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
    const { selectedFitnessType, bookingDetail, selectedClass } = this.state;
    let parameter = this.props.match.params;
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

    if (selectedFitnessType && selectedFitnessType.length) {
      return (
        selectedFitnessType &&
        Array.isArray(selectedFitnessType) &&
        selectedFitnessType.map((el, i) => {
          //
          return (
            <div className="beauty-service">
              <Row key={i} align="top" className="mb-0">
                {/* <Col span={5}>
                  <div className="thumb">
                    {" "}
                    <img
                      src={el.image ? `${el.image}` : DEFAULT_IMAGE_CARD}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD;
                      }}
                    />
                  </div>
                </Col> */}
                <Col span={10}>
                  <Text className="strong fs-16">{el.class_name}</Text>
                  <br />
                  {`${el.description}`}
                </Col>
                <Col span={6}>
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
  renderServiceTab = (
    bookingDetail,
    tabName,
    categoryName,
    subCategoryName
  ) => {
    const item = bookingDetail && bookingDetail.profile_services;
    return (
      <TabPane tab={tabName} key="2" className="inner-tab-detail">
        {categoryName === TEMPLATE.WELLBEING &&
          subCategoryName === TEMPLATE.FITNESS ? (
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
  renderBeautyServiceTab = (
    bookingDetail,
    tabName,
    categoryName,
    subCategoryName
  ) => {
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

  renderSpaService = (
    bookingDetail,
    tabName,
    categoryName,
    subCategoryName
  ) => {
    let data =
      bookingDetail && bookingDetail.trader_profile
        ? bookingDetail.trader_profile.wellbeing_trader_service
        : [];
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
      return (
        item &&
        Array.isArray(item) &&
        item.map((el, i) => {
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
          <li className="thumb" xs={24} sm={24} md={24} lg={4} xl={4}>
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
    const { isBrochure, isCertificate, isPortfolio } = this.state;
    const portfolio =
      data &&
        Array.isArray(data.portfolio) &&
        data.portfolio.length &&
        data.portfolio[0].files
        ? data.portfolio[0].files
        : [];
    const brochure =
      data && data.brochure && data.brochure.files ? data.brochure.files : [];
    const certification =
      data && data.certification && data.certification.files
        ? data.certification.files
        : [];
    let isVisible =
      portfolio.length === 0 &&
        brochure.length === 0 &&
        certification.length === 0
        ? false
        : true;
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
    // this.setState({ activeTab: key });
    // if (this.myDivToFocus.current) {
    //   window.scrollTo(0, this.myDivToFocus.current.offsetTop);
    // }
    this.setState({ priorityTab: key })
    if (this.myDivToFocus.current) {
      window.scrollTo(0, this.myDivToFocus.current.offsetTop)
    }
    this.props.enableLoading()
    setTimeout(() => {
      this.setState({ priorityTab: 0 }, () => {
        this.props.disableLoading()
      })
    }, 500)
  };

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
        selectedSpaService: selectedSpaService,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  hideSpaBookingModal = (e) => {
    this.setState({
      displaySpaBookingModal: false,
      makeOffer: false,
      reviewModel: false,
    });
  };

  hideBeautyBookingModal = (e) => {
    this.setState({
      displayBeautyBookingModal: false,
      makeOffer: false,
      reviewModel: false,
    });
  };

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

  hideViewGalleryModal = (e) => {
    this.setState({
      viewGalleryModal: false,
    });
  };

  viewGalleryModal = (images) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        viewGalleryModal: true,
        selectedImage: images
      });
    } else {
      this.props.openLoginModel();
    }
  };

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

  hideCaterersEnquireModal = (e) => {
    this.setState({
      displayCaterersEnquireModal: false,
      makeOffer: false,
      reviewModel: false,
    });
  };

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
   * @method setPriorityTab
   * @description manage tab change
   */
  setPriorityTab = () => {
    this.setState({ priorityTab: 0 });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      bookingDetail,
      activeTab,
      portfolio,
      is_favourite,
      handymanBooking,
      selectedFitnessType,
      selectedImage,
      reportAdModel,
      classes,
      uniqueFitnessTabs,
      priorityTab
    } = this.state;
    const { isLoggedIn } = this.props;
    let path = "",
      subCategoryPagePath,
      subcatId,
      subcatName;
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    let categoryName = parameter.categoryName;
    let itemId = parameter.itemId;
    let pid = parameter.categoryId;
    let templateName = parameter.categoryName;
    let subCategoryId = parameter.subCategoryId;
    let allData = parameter.all === langs.key.all ? true : false;
    if (subCategoryId === undefined) {
      subcatId =
        bookingDetail &&
        bookingDetail.trader_profile &&
        bookingDetail.trader_profile.booking_sub_cat_id;
      subcatName =
        bookingDetail &&
        bookingDetail.trader_profile &&
        bookingDetail.trader_profile.trader_service &&
        bookingDetail.trader_profile.trader_service.name;
      path = getBookingMapDetailRoute(
        templateName,
        categoryName,
        categoryId,
        subcatName,
        subcatId,
        itemId
      );
      subCategoryPagePath = getBookingSubcategoryRoute(
        templateName,
        categoryName,
        categoryId,
        subcatName,
        subcatId,
        allData
      );
    } else {
      path = getBookingMapDetailRoute(
        templateName,
        categoryName,
        categoryId,
        subCategoryName,
        subCategoryId,
        itemId
      );
      subCategoryPagePath = getBookingSubcategoryRoute(
        templateName,
        categoryName,
        categoryId,
        subCategoryName,
        subCategoryId,
        allData
      );
    }
    let subCategoryName =
      parameter.all === langs.key.all ? langs.key.All : subcatName;
    let rate =
      bookingDetail && bookingDetail.average_rating
        ? `${parseInt(bookingDetail.average_rating)}.0`
        : "";
    let categoryPagePath = getBookingCatLandingRoute(
      categoryName,
      categoryId,
      categoryName
    );
    let infoTabName = categoryName === TEMPLATE.HANDYMAN ? "About Us" : "Info";
    var d = new Date();
    var day = d.getDay();
    let workigHours =
      bookingDetail &&
      bookingDetail.trader_working_hours.length &&
      bookingDetail.trader_working_hours;
    let temp = workigHours && workigHours.filter(el => el.day === day)
    let open_today = temp && temp.length ? temp : workigHours
    let imgLength =
      bookingDetail &&
        bookingDetail.service_images &&
        Array.isArray(bookingDetail.service_images)
        ? bookingDetail.service_images.length
        : 1;
    const carouselSettings = {
      dots: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    const carouselNavSettings = {
      speed: 500,
      slidesToShow:
        imgLength === 4
          ? bookingDetail.service_images.length - 1
          : imgLength === 3
            ? bookingDetail.service_images.length + 2
            : 4,
      slidesToScroll: 1,
      centerMode: false,
      focusOnSelect: true,
      dots: false,
      arrows: true,
      infinite: true,
    };
    let crStyle =
      imgLength === 3 || imgLength === 2 || imgLength === 1
        ? "product-gallery-nav hide-clone-slide"
        : "product-gallery-nav ";
    const menu = <SocialShare {...this.props} />;

    const dateTime = (
      <ul className="c-dropdown-content">
        {bookingDetail &&
          bookingDetail.trader_working_hours.map((el, i) => (
            <li key={i}>
              <Text className={day === el.day ? "active-date" : ""}>
                {getDaysName(el.day)}
              </Text>
              {el.is_open === 0 ? (
                <Text className="pull-right">Closed</Text>
              ) : (
                <Text
                  className={
                    day === el.day ? "pull-right active-date" : "pull-right"
                  }
                >
                  {`${formateTime(el.start_time)} - ${formateTime(
                    el.end_time
                  )}`}
                </Text>
              )}
            </li>
          ))}
        <li>
          <Divider />
          <Text>Public holidays closed</Text>
          <Divider />
        </li>
      </ul>
    );
    let contactNumber = bookingDetail && bookingDetail.mobile_no && bookingDetail.mobile_no
    let formatedNumber = contactNumber && contactNumber.replace(/\d{7}(?=\d{3})/g, '0 XXXX XXX ')
    const number = (
      <Menu>
        <Menu.Item key='0'>
          {isLoggedIn ?
            <span>
              {bookingDetail && bookingDetail.mobile_no && <Tooltip placement='bottomRight' >
                <div><b><span>Contact {bookingDetail.name} </span></b>
                  <span> {bookingDetail.mobile_no ? bookingDetail.mobile_no :
                    'Number not found'} </span>
                </div>
              </Tooltip>}
            </span> :
            <span>
              <span><b>Contact Seller</b></span>
              <span>{formatedNumber}</span>
              <div>Please <b className='blue-link mb-0' onClick={() => this.props.openLoginModel()} >Login</b><br />to view number </div>
            </span>}
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="booking-product-detail-parent-block">
        <Layout className="yellow-theme card-detailpage common-left-right-padd">
          <Layout>
            <Layout className="right-parent-block">
              <Layout style={{ width: 'calc(100% - 0px)', overflowX: 'visible' }}>
                <Layout>
                  <div className='detail-page right-content-block'>
                    <Row gutter={[0, 0]}>
                      <Col span={8}>
                        <div className="category-name">
                          {bookingDetail && (
                            <Link to={subCategoryPagePath}>
                              <Button
                                type="ghost"
                                shape={"round"}
                              >
                                <Icon
                                  icon="arrow-left"
                                  size="20"
                                  className="arrow-left-icon"
                                />
                                {subCategoryName ? subCategoryName : subcatName}
                              </Button>
                            </Link>
                          )}
                        </div>
                        {bookingDetail && (
                          <DetailCarousel
                            className="mb-4"
                            isBooking={true}
                            classifiedDetail={bookingDetail}
                            slides={bookingDetail.service_images}
                          />
                        )}
                      </Col>
                      {bookingDetail && (
                        <Col span={16}>
                          <div className="product-detail-right">
                            <div className="product-title-block">
                              <div className="left-block">
                                <Title level={4}>
                                  {bookingDetail.business_name && capitalizeFirstLetter(bookingDetail.business_name)}
                                </Title>
                                <div className="product-ratting mb-15">
                                  {rate ? <Text>{rate}</Text> : <Text type="secondary">{"No reviews yet"}</Text>}
                                  {rate && (
                                    <Rate
                                      disabled
                                      defaultValue={rate ? rate : 0.0}
                                    />
                                  )}
                                  <Text>
                                    {rate && (
                                      <span
                                        className="blue-link"
                                        onClick={() => this.activeTab('4')}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {bookingDetail.valid_trader_ratings &&
                                          `${bookingDetail.valid_trader_ratings.length}  reviews`}
                                      </span>
                                    )}
                                  </Text>
                                </div>
                              </div>
                              <div className="right-block">
                                <ul>
                                  <li>
                                    <Icon
                                      icon={
                                        is_favourite
                                          ? "wishlist-fill"
                                          : "wishlist"
                                      }
                                      size="24"
                                      className={is_favourite ? "active" : ""}
                                      onClick={() =>
                                        this.onSelection(bookingDetail)
                                      }
                                    />
                                  </li>
                                  <li>
                                    <Dropdown overlay={number} trigger={['click']} overlayClassName='contact-social-detail' placement="bottomCenter" arrow>
                                      <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                        <Icon icon='call' size='27' onClick={e => e.preventDefault()} />
                                      </div>
                                    </Dropdown>
                                  </li>
                                  <li>
                                    <Dropdown overlay={menu} trigger={["click"]} overlayClassName='contact-social-detail share-ad' placement="bottomCenter" arrow>
                                      <div
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                      >
                                        <Icon icon="share" size="24" />
                                      </div>
                                    </Dropdown>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="product-map-price-block">
                              <div className="left-block">
                                {workigHours && (
                                  <Dropdown
                                    overlay={dateTime}
                                    className="c-dropdown head-active"
                                  >
                                    <Button>
                                      <div>
                                        <Text className="open-today-text">
                                          Open today
                                        </Text>
                                      </div>
                                      <div>
                                        <Text>
                                          {open_today && open_today.length !== 0 && `${formateTime(open_today[0].start_time)} - ${formateTime(open_today[0].end_time)}`}
                                        </Text>
                                        <Icon
                                          icon="arrow-down"
                                          size="12"
                                          className="ml-12"
                                        />
                                      </div>
                                    </Button>
                                  </Dropdown>
                                )}
                                <table style={{ width: "100%" }}>
                                  {bookingDetail.trader_profile && bookingDetail.trader_profile.service_type !== undefined ? <tr>
                                    <td><label>Service type:</label></td>
                                    <td className="text-detail"><div style={{ position: "relative" }}><div className="mtach-height">{bookingDetail.trader_profile.service_type}</div></div></td>
                                  </tr> : ''}
                                  {subCategoryName !== 'Florists' && subCategoryName !== 'Photographer' && subCategoryName !== 'Videographer' && subCategoryName !== 'Makeup & Hair artist' &&
                                    bookingDetail.trader_profile && bookingDetail.trader_profile.service_area ?
                                    <tr>
                                      <td><label>Service area:</label></td>
                                      <td className="text-detail">{bookingDetail.trader_profile.service_area}</td>
                                    </tr> : ''}
                                  {bookingDetail.trader_profile && bookingDetail.trader_profile.rate_per_hour ? <tr>
                                    <td><label>Price:</label></td>
                                    <td className="text-detail"> ${bookingDetail.trader_profile.rate_per_hour} </td>
                                  </tr> : ''}
                                  {categoryName === TEMPLATE.HANDYMAN || categoryName === TEMPLATE.PSERVICES &&
                                    bookingDetail.trader_profile && bookingDetail.trader_profile.basic_quote ? <tr>
                                    <td><label>Basic Quote:</label></td>
                                    <td className="text-detail"> {'Provided'} </td>
                                  </tr> : ''}
                                  {bookingDetail && bookingDetail.business_location ? <tr>
                                    <td><label>Address:</label></td>
                                    <td className="text-detail"> {bookingDetail.business_location}</td>
                                  </tr> : ''}
                                  <tr>
                                    <td colSpan="2">
                                      <div className='map-view'>
                                        {bookingDetail &&
                                          <Map list={[bookingDetail]} />
                                        }
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <div className="right-block">
                                {(categoryName === TEMPLATE.BEAUTY) && (
                                  <Row gutter={[20, 18]} className="action-btn">
                                    <Col span={24}>
                                      <Button
                                        type="default"
                                        className="btn-orange w-100"
                                        onClick={() => {
                                          //this.displayBeautyBookingModal();
                                          this.activeTab('2')
                                        }}
                                      >
                                        {"Book Now"}
                                      </Button>
                                    </Col>
                                  </Row>
                                )}

                                {(categoryName === TEMPLATE.HANDYMAN ||
                                  categoryName === TEMPLATE.PSERVICES) && (
                                    <Row gutter={[20, 18]} className="action-btn">
                                      <Col span={24}>
                                        <Button
                                          type="default"
                                          className="btn-orange w-100"
                                          onClick={this.handymanBookingModel}
                                        >
                                          {"Book Now"}
                                        </Button>
                                      </Col>
                                      {(categoryName === TEMPLATE.HANDYMAN /*||
                                        categoryName === TEMPLATE.PSERVICES*/) && (
                                          <Col span={24}>
                                            <Button
                                              type="ghost"
                                              className="w-100"
                                              onClick={this.handymanRequestQuote}
                                            >
                                              {"Request A Quote"}
                                            </Button>
                                          </Col>
                                        )}
                                    </Row>
                                  )}
                                {categoryName === TEMPLATE.EVENT && (
                                  <Row gutter={[20, 18]} className="action-btn">
                                    {categoryName === TEMPLATE.EVENT && (
                                      <Col span={24}>
                                        <Button
                                          type='default'
                                          className="btn-orange w-100"
                                          onClick={this.displayCaterersEnquireModal}
                                        >
                                          {"Enquire Now"}
                                        </Button>
                                      </Col>
                                    )}
                                  </Row>
                                )}
                                {subcatName === TEMPLATE.FITNESS && (
                                  <Row gutter={[20, 18]} className="action-btn">
                                    <Col span={24}>
                                      <Button
                                        type="default"
                                        className="btn-orange w-100"
                                        onClick={() =>
                                          this.props.history.push(
                                            `/view-classes/${categoryName}/${pid}/${subCategoryName}/${subcatId}/${bookingDetail.id}/${bookingDetail.trader_profile.id}`
                                          )
                                        }
                                      >
                                        {"View Classes"}
                                      </Button>
                                    </Col>
                                    <Col span={24}>
                                      <Button
                                        type="ghost"
                                        className="w-100"
                                        onClick={() =>
                                          this.props.history.push(
                                            `/memberships/${categoryName}/${pid}/${subCategoryName}/${subcatId}/${bookingDetail.id}/${bookingDetail.trader_profile.id}`
                                          )
                                        }
                                      >
                                        {"View Membership"}
                                      </Button>
                                    </Col>
                                  </Row>
                                )}
                              </div>
                            </div>
                            <div className="product-detail-bottom-block">
                              <div className="column column1">
                                {bookingDetail.trader_profile &&
                                  bookingDetail.trader_profile.abn_acn_number && (
                                    <Fragment>
                                      <Text className="label">
                                        ABN:
                                      </Text>
                                      <Text className="value">
                                        {bookingDetail.trader_profile
                                          .abn_acn_number &&
                                          bookingDetail.trader_profile
                                            .abn_acn_number}
                                      </Text>
                                    </Fragment>
                                  )}
                              </div>
                              <div className="column column2">
                                <Text className="label">Ad Details:</Text>
                                <Text className="value">
                                  <Tag><Link to={categoryPagePath}>{categoryName}</Link></Tag>
                                  <Text type="secondary">AD No. {bookingDetail.id}</Text>
                                </Text>
                              </div>
                              <div className="column">
                                {bookingDetail &&
                                  <Text className="label" style={{ cursor: 'pointer' }} onClick={() => {
                                    if (bookingDetail.is_reported === 1) {
                                      toastr.warning(langs.warning, MESSAGES.REPORT_ADD_WARNING)
                                    } else {
                                      if (isLoggedIn) {
                                        this.setState({ reportAdModel: true, });
                                      } else {
                                        this.props.openLoginModel()
                                      }
                                    }
                                  }}
                                    className='blue-p'><ExclamationCircleOutlined /> Report this Ad</Text>
                                }
                              </div>
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                    {/* <div ref={this.myDivToFocus}>
                      <Tabs
                        type="card"
                        className={"tab-style3 product-tabs"}
                        activeKey={activeTab}
                        onChange={this.onTabChange}
                      >
                        {renderInfoTab(
                          bookingDetail,
                          infoTabName,
                          categoryName,
                          portfolio,
                          this.viewGalleryModal,
                          subCategoryName
                        )}
                        {(categoryName === TEMPLATE.HANDYMAN  || categoryName === TEMPLATE.PSERVICES) &&
                          renderServiceTab(bookingDetail, categoryName)}
                        {categoryName === TEMPLATE.BEAUTY &&
                          bookingDetail &&
                          this.renderBeautyServiceTab(
                            bookingDetail,
                            "Service",
                            categoryName,
                            subCategoryName
                          )}
                        {categoryName === TEMPLATE.WELLBEING &&
                          bookingDetail &&
                          subCategoryName !== TEMPLATE.FITNESS &&
                          this.renderSpaService(
                            bookingDetail,
                            "Service",
                            categoryName,
                            subCategoryName
                          )}
                        {bookingDetail &&
                          categoryName === TEMPLATE.WELLBEING &&
                          subCategoryName === TEMPLATE.FITNESS &&
                          this.renderFitnessClassesTab(
                            bookingDetail,
                            "Classes",
                            categoryName,
                            subCategoryName
                          )}
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
                    </div> */}
                    <div ref={this.myDivToFocus}>
                      <BookingDetailTabView
                        setPriorityTab={this.setPriorityTab}
                        priorityTab={priorityTab}
                        filter={parameter.filter}
                        parameter={parameter}
                        bookingDetail={bookingDetail}
                        history={history}
                      />
                    </div>
                  </div>
                </Layout>
              </Layout>
            </Layout>
          </Layout>
        </Layout>
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
              // selectedDate={selectedDate}
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
            />
          </div>
        </Modal>
        {reportAdModel &&
          <ReportAd
            visible={reportAdModel}
            onCancel={() => this.setState({ reportAdModel: false })}
            bookingDetail={bookingDetail}
            callNext={this.getDetails}
          />}
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
})(Details);
