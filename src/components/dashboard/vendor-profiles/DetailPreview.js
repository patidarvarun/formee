import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Empty, Card, Layout, Typography, Spin, Avatar, Tabs, Row, Col, Breadcrumb, Input, Select, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { UserOutlined } from '@ant-design/icons';
import { getFitnessClassListing, getPortFolioData, getBookingDetails, enableLoading, disableLoading, addToFavorite, removeToFavorite, openLoginModel, getClassfiedCategoryDetail } from '../../../actions/index'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../config/Config';
import { langs } from '../../../config/localization';
import { displayDateTimeFormate, converInUpperCase, formateTime, getDaysName } from '../../common';
import { STATUS_CODES } from '../../../config/StatusCode';
import { SocialShare } from '../../common/social-share'
import Magnifier from 'react-magnifier';
import Review from '../../booking/common/Review'
import { renderInfoTab, renderServiceTab } from '../../booking/common/index'
import CarouselCustom from './CarouselCustom'
import Carousel from "../../common/caraousal";
import { BASE_URL } from '../../../config/Config'
const spinIcon = <img src={require('./../../../assets/images/loader1.gif')} alt='' style={{ width: '64px', height: '64px' }} />;
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

const temp = [
  {
    rating: '5',
    review: 'Very nice',
    name: 'Joy'
  },
  {
    rating: '5',
    review: 'Good',
    name: 'Bob'
  },
  {
    rating: '5',
    review: 'Excellent',
    name: 'Mark'
  },
  {
    rating: '5',
    review: 'Very nice',
    name: 'Calley'
  },
  {
    rating: '5',
    review: 'Very nice',
    name: 'Marry'
  }
]

class DetailPreview extends React.Component {

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
      isCertificate: false
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
    let reqData = {
      id: loggedInDetail.id,
      user_id: isLoggedIn ? loggedInDetail.id : ''
    }
    this.props.getBookingDetails(reqData, (res) => {
      this.props.disableLoading()
      this.props.getPortFolioData(loggedInDetail.id, res => {
        
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
            this.setState({ classes: traderClasses, uniqueFitnessTabs: uniqueTabs, selectedFitnessType })
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
   * @method makeOfferModal
   * @description handle make an offer model
   */
  makeOfferModal = () => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        makeOffer: true,
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
      reviewModel: false
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
              <Col span={5}><Button className="yellow-btn w-100">{buttonName}</Button></Col>
            </Row>
            <Divider />
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
          this.setState({ selectedFitnessType: temp })
          
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
 * @method renderFitnessServiceType
 * @description render fitness service type
 */
  renderFitnessServiceType = (item, buttonName) => {
    const { selectedFitnessType } = this.state
    if (selectedFitnessType && selectedFitnessType.length) {
      return selectedFitnessType && Array.isArray(selectedFitnessType) && selectedFitnessType.map((el, i) => {
        
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
              <Col span={4}><Button className="yellow-btn w-100">{buttonName}</Button></Col>
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
              <Col span={4} className="text-right"><Button className="yellow-btn w-100" >{buttonName}</Button></Col>
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

  /**
   * @method render
   * @description render component
   */
  render() {
    const { bookingDetail, activeTab, portfolio } = this.state;
    const { loggedInDetail } = this.props
    
    let rate = bookingDetail && bookingDetail.average_rating ? `${parseInt(bookingDetail.average_rating)}.0` : 0
    let categoryName = loggedInDetail.user_type
    let subCategoryName = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.trader_service && bookingDetail.trader_profile.trader_service.name
    let workigHours = bookingDetail && bookingDetail.trader_working_hours.length && bookingDetail.trader_working_hours
    let infoTabName = categoryName === TEMPLATE.HANDYMAN ? 'About Us' : 'Info';
    const menu = (
      <SocialShare {...this.props} />
    );
    var d = new Date();
    var day = d.getDay()
    const dateTime = (
      <ul className='c-dropdown-content'>
        {workigHours && workigHours.map((el, i) =>
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
    if (bookingDetail !== undefined && bookingDetail) {
      return (
        <Modal
          visible={this.props.visible}
          className={'custom-modal prf-prevw-custom-modal'}
          footer={false}
          onCancel={this.props.onCancel}
        >
          <React.Fragment>
            <Layout className="yellow-theme">
              <div className='wrap-inner less-padding'>
                <Breadcrumb separator='|' className='pt-20 pb-30' style={{ paddingLeft: 50 }}>
                  <Breadcrumb.Item>
                    Home
                        </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    Bookings
                        </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    {converInUpperCase(categoryName)}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    {subCategoryName}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    {(bookingDetail && categoryName === TEMPLATE.HANDYMAN ? `AD No. ${bookingDetail.id}` :
                      bookingDetail && bookingDetail.business_name && bookingDetail.business_name
                    )}
                  </Breadcrumb.Item>
                </Breadcrumb>
                {bookingDetail && <Title level={2} className='inner-page-title'>
                  <span>{converInUpperCase(categoryName)}</span>
                </Title>}
                <Layout>
                  <div className='wrap-inner'>
                    {bookingDetail && <Paragraph className='text-gray'>
                      AD No. {bookingDetail.id}
                    </Paragraph>}
                    <Row gutter={[60, 16]}>
                      <Col span={11}>
                        {/* <Icon icon='magnifying-glass' size='20' className={'product-gallery-zoom'} />
                        <CarouselCustom
                          allImages={bookingDetail && bookingDetail.service_images}
                        /> */}
                        {bookingDetail && (
                          <Carousel
                            className="mb-4"
                            isBooking={true}
                            classifiedDetail={bookingDetail}
                            slides={bookingDetail.service_images}
                          />
                        )}
                      </Col>
                      {bookingDetail && <Col span={13}>
                        <div className='product-detail-right'>
                          <Title level={2} className='price'>
                            {bookingDetail.business_name && bookingDetail.business_name}
                          </Title>
                          <Title level={4}>
                            {bookingDetail.name && bookingDetail.name}
                          </Title>
                          <div className='address mb-12'>
                            <Text>
                              {/* {'318 boundry road north melbourn '} */}
                              {bookingDetail && bookingDetail.business_location !== 'undefined' && bookingDetail.business_location ? bookingDetail.business_location : ''}
                                &nbsp;&nbsp;</Text>&nbsp;&nbsp;
                              <Link className='blue-link'>{'View map'}</Link>
                          </div>
                          <div className='address mb-12'>
                            <Text>{bookingDetail.abn_acn_number && bookingDetail.abn_acn_number}</Text>
                          </div>
                          <div className='product-ratting mb-15'>
                            <Text>{rate ? rate : ''}</Text>
                            <Rate disabled defaultValue={rate ? rate : 0.0} />
                            <Text>{rate ? `${rate} of 5.0  ` : ''}</Text>

                            <span className='blue-link' onClick={this.activeTab} style={{ cursor: 'pointer' }}>
                              {bookingDetail.valid_trader_ratings && `${bookingDetail.valid_trader_ratings.length}  reviews`}
                            </span>
                          </div>
                          {bookingDetail && <div>
                            <Link
                            >
                              <Button
                                type='ghost'
                                shape={'round'}
                                className={'mr-10'}
                                style={{ borderWidth: 1 }}
                              >

                                {subCategoryName}
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
                                <Icon icon='call' size='20' />
                              </li>
                              <li>
                                <Icon
                                  icon='wishlist'
                                  size='20'
                                  className={bookingDetail.is_favourite === 1 ? 'active' : ''}
                                  onClick={() => this.onSelection(bookingDetail)}
                                />
                              </li>
                              <li>
                                {/* <Dropdown overlay={menu} trigger={['click']}> */}
                                {/* <div className='ant-dropdown-link' onClick={e => e.preventDefault()}> */}
                                <Icon icon='share' size='20' />
                                {/* </div> */}
                                {/* </Dropdown> */}
                              </li>
                              <li>
                                <Icon icon='view' size='20' /> <Text className='ml-10'>{bookingDetail.views}</Text>
                              </li>
                            </ul>
                          </div>
                          {(categoryName === TEMPLATE.HANDYMAN || categoryName === TEMPLATE.PSERVICES) &&
                            <Row gutter={[20, 0]} className='action-btn'>
                              <Col>
                                {categoryName !== TEMPLATE.PSERVICES && <Button
                                  type='default'
                                // onClick={this.contactModal}
                                >
                                  {'Request a Quote'}
                                </Button>}
                              </Col>
                              <Col>
                                <Button
                                  type='default'
                                // onClick={this.makeOfferModal}
                                >
                                  {'Request Booking'}
                                </Button>
                              </Col>
                            </Row>}

                          {categoryName === TEMPLATE.EVENT &&
                            <Row gutter={[20, 0]} className='action-btn'>
                              <Col>
                                <Button
                                  type='default'
                                // onClick={this.contactModal}
                                >
                                  {'Enquire'}
                                </Button>
                              </Col>
                            </Row>}

                          {subCategoryName === TEMPLATE.FITNESS &&
                            <Row gutter={[20, 0]} className='action-btn'>
                              <Col>
                                <Button
                                  type='default'
                                // onClick={this.contactModal}
                                >
                                  {'View Schedule'}
                                </Button>
                              </Col>
                              <Col>
                                <Button
                                  type='default'
                                // onClick={this.contactModal}
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
                        type='card' className={'tab-style3 product-tabs'}
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
                        {(categoryName === TEMPLATE.WELLBEING &&
                          this.renderSpaService(bookingDetail, 'Service', categoryName, subCategoryName)
                        )}
                        {(bookingDetail && categoryName === TEMPLATE.FITNESS &&
                          this.renderFitnessClassesTab(bookingDetail, 'Class', categoryName, subCategoryName)
                        )}
                        {(categoryName !== TEMPLATE.WELLBEING && categoryName !== TEMPLATE.FITNESS &&
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
              </div>
            </Layout>
          </React.Fragment>
        </Modal>
      )
    } else {
      return <div></div>
      // <Spin tip='Loading...' indicator={spinIcon} spinning={true} />
    }
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, postAd, profile } = store;
  const { step1, attributes, step3, allImages, preview } = postAd;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    step1,
    attributes: attributes,
    specification: attributes.specification,
    inspection_time: attributes.inspection_time,
    step3,
    allImages, preview
  };
};

export default connect(
  mapStateToProps,
  { getFitnessClassListing, getPortFolioData, getBookingDetails, getClassfiedCategoryDetail, addToFavorite, removeToFavorite, openLoginModel, enableLoading, disableLoading }
)(DetailPreview);