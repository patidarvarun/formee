import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Magnifier from 'react-magnifier';
import Icon from '../../customIcons/customIcons';
import {
  ClockCircleOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Empty,
  Dropdown,
  Menu,
  Select,
  Avatar,
  Checkbox,
  Layout,
  Typography,
  Tabs,
  Row,
  Col,
  Button,
  Rate,
  Modal,
  Collapse,
} from 'antd';
import { DEFAULT_IMAGE_CARD } from '../../../config/Config';
import {
  convertHTMLToText,
  salaryNumberFormate,
  displayDateTimeFormate,
  converInUpperCase,
  dateFormat4,
} from '../../common';
import CarouselCustom from '../../common/CarouselCustom';
import { SocialShare } from '../../common/social-share';
import '../../common/caraousal/crousal.less';
import '../../dashboard/vendor-profiles/myprofilestep.less';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carouselNav1: null,
      carouselNav2: null,
      isOpen: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.setState({
      carouselNav1: this.slider1,
      carouselNav2: this.slider2,
    });
  }

  /**
   * @method renderSpecification
   * @description render specification list
   */
  renderSpecification = (data) => {
    let temp =
      data && Array.isArray(data) && data.length
        ? data.filter(
            (el) =>
              el.key !== 'Features' &&
              el.key !== 'Price' &&
              el.slug !== 'is_price_negotiable?' &&
              el.att_name !== 'is_price_negotiable?' &&
              el.slug !== 'textArea'
          )
        : [];
    let sorted_list =
      temp &&
      temp.sort((a, b) => {
        if (a.position < b.position) return -1;
        if (a.position > b.position) return 1;
        return 0;
      });
    return (
      sorted_list &&
      Array.isArray(sorted_list) &&
      sorted_list.map((el, i) => {
        let value =
          el.key === 'Price' ? `AU$${salaryNumberFormate(el.value)}` : el.value;
        return (
          <Fragment key={i}>
            <Col span={4} style={{ marginBottom: '8px' }}>
              <Text className='strong'>{el.key}</Text>
            </Col>
            <Col span={8} style={{ marginBottom: '8px' }}>
              <Text>{value}</Text>
            </Col>
          </Fragment>
        );
      })
    );
  };

  /**
   * @method renderFeatures
   * @description render features
   */
  renderFeatures = (data) => {
    let temp =
      data &&
      Array.isArray(data) &&
      data.length &&
      data.filter((el) => el.key === 'Features');
    let features = temp && temp.length ? temp[0].value : [];
    if (features && Array.isArray(features) && features.length) {
      return (
        features &&
        features.map((el, i) => {
          return (
            <Col span={6} key={i}>
              <Checkbox checked>{el}</Checkbox>
            </Col>
          );
        })
      );
    } else {
      return (
        <div className='data-error'>
          <Empty description={'No Features Found for this ad'} />
        </div>
      );
    }
  };

  /**
   * @method filterRating
   * @description filter rating
   */
  filterRating = () => {
    return (
      <Select
        defaultValue='All Star'
        size='large'
        className='w-100 mb-15 shadow-select'
        style={{ minWidth: 160 }}
      >
        <Option value={5}>All Star</Option>
        <Option value={4}>Four Star</Option>
        <Option value={3}>Three Star</Option>
        <Option value={2}>Two Star</Option>
        <Option value={1}>One Star</Option>
      </Select>
    );
  };

  /**
 * @method renderAdvertiserInfo
 * @description render advertisor info
 */
  renderAdvertiserInfo = () => {
    const { userDetails } = this.props;
    const location = userDetails.address ? userDetails.address : '';
    let today = Date.now();
    return (
      <Row className='reviews-content'>
        <Col md={8}>
          <div className='reviews-content-left'>
            <div className='reviews-content-avatar'>
              <Avatar
                src={require('../../../assets/images/avatar3.png')}
                size={69}
              />
            </div>
            <div className='reviews-content-avatar-detail'>
              <Title level={4} className='mt-0 mb-4'>
                {userDetails && userDetails.name
                  ? converInUpperCase(userDetails.name)
                  : ''}
              </Title>
              <Paragraph className='fs-10 text-gray'>
                {`Member since : ${displayDateTimeFormate(today)})`}
              </Paragraph>
              <div className='product-ratting mb-15'>
                <Text className='text-gray'>3.0</Text>
                <Rate
                  disabled
                  defaultValue={3}
                  className='fs-15 ml-6 mr-6'
                  style={{ position: 'relative', top: '-1px' }}
                />
                <Text className='text-gray'>{`3.0 of 5.0`}</Text>
              </div>
              <div className='address text-gray mb-10'>{location}</div>
              <a className='fs-10 underline'>{`Found 0 Ads`}</a>
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  /**
 * @method renderInspection
 * @description render inspection
 */
  renderInspection = (inspection_time) => {
    return (
      inspection_time &&
      Array.isArray(inspection_time) &&
      inspection_time.length &&
      inspection_time.map((el, i) => {
        let date = moment(el.inspection_date).format('dddd DD MMMM, YYYY');
        let time1 = moment(el.inspection_start_time).format('h:mm a');
        return (
          <Row gutter={15}>
            <Col span={21}>
              <div className='inspection-list'>
                <Icon icon='clock' size='18' />
                <Text className='ml-15'>{date}</Text>
                <div className='right'>
                  <Text>{time1}</Text>
                </div>
              </div>
            </Col>
            <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
              <Button htmlType={'button'} type='primary'>
                <img
                  src={require('../../../assets/images/icons/add-booking.svg')}
                  width='16'
                  alt=''
                />
                Book
              </Button>
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
                src={el.thumbUrl ? el.thumbUrl : DEFAULT_IMAGE_CARD}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE_CARD;
                }}
                alt={''}
              />
            </div>
          );
        })
      );
    } else {
      return (
        <div>
          <img src={DEFAULT_IMAGE_CARD} alt='' />
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
            <div key={i} className='slide-content'>
              <img
                src={el.thumbUrl ? el.thumbUrl : DEFAULT_IMAGE_CARD}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE_CARD;
                }}
                alt={''}
              />
            </div>
          );
        })
      );
    } else {
      return (
        <div className='slide-content hide-cloned'>
          <img src={DEFAULT_IMAGE_CARD} alt='' />
        </div>
      );
    }
  };

  /**
   * @method renderPropertyFeatures
   * @description render features
   */
  renderPropertyFeatures = (features) => {
    if (features && Array.isArray(features) && features.length) {
      return (
        features &&
        features.map((el, i) => {
          return (
            <Col span={6} key={i}>
              {/* <Checkbox checked></Checkbox> */}
              <CheckOutlined className='check-tick' /> {el}
            </Col>
          );
        })
      );
    }
  };

  /**
   * @method renderRealestateFloorPlan
   * @description render icons
   */
  renderRealestateFloorPlan = (data) => {
    const iconData = data.filter(
      (el) =>
        el.slug === 'bedroom' ||
        el.slug === 'type-bathroom' ||
        el.slug === 'Parking Type' ||
        el.slug === 'Shower' ||
        el.slug === 'Parking' ||
        el.slug === 'Property Type' ||
        el.slug === 'car_spaces' ||
        el.slug === 'Area Size' ||
        el.slug === 'type_of_parking' ||
        el.slug === 'Land Size' ||
        el.slug === 'Floor Size' ||
        el.slug === 'tenture_type' ||
        el.slug === 'furnished' ||
        el.slug === 'available_from'
    );
    return (
      iconData &&
      Array.isArray(iconData) &&
      iconData.map((el, i) => {
        return (
          <Row key={i}>
            <Col span={15}>
              <Text className='strong'>{el.key}</Text>
            </Col>
            <Col span={9}>
              <Text>{el.value}</Text>
            </Col>
          </Row>
        );
      })
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      inspectionPreview,
      step1,
      attributes,
      userDetails,
      specification,
      allImages,
      hide_mob_number,
      address,
      mobileNo,
    } = this.props;
    const realState = step1.templateName === 'realestate' ? true : false;
    let cat_name = step1.categoryData.name;
    const location = userDetails.address ? userDetails.address : '';
    let imgLength = allImages && Array.isArray(allImages.fileList) ? allImages.fileList.length : 1;
    let today = Date.now();
    let inspectionData =
      inspectionPreview &&
      Array.isArray(inspectionPreview) &&
      inspectionPreview.length
        ? inspectionPreview[0]
        : '';
    let date = inspectionData.inspection_date
      ? moment(inspectionData.inspection_date).format('dddd DD MMMM, YYYY')
      : '';
    let time = inspectionData.inspection_date
      ? `${moment(inspectionData.inspection_start_time).format(
          'h:mm a'
        )} - ${moment(inspectionData.inspection_end_time).format('h:mm a')}`
      : '';
    const number = (
      <Menu>
        <Menu.Item key='0'>
          <span className='phone-icon-circle'>
            <Icon icon='call' size='14' />
          </span>
          <span>{mobileNo}</span>
        </Menu.Item>
      </Menu>
    );
    let currentDate = moment(today).format('YYYY-MM-DD');
   
    let temp =
      specification &&
      Array.isArray(specification) &&
      specification.length &&
      specification.filter((el) => el.key === 'Features');
    let features = temp && temp.length ? temp[0].value && temp[0].value : [];
    return (
      <Modal
        visible={this.props.visible}
        className={'custom-modal prf-prevw-custom-modal'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <React.Fragment>
          <Layout>
            <div className='wrap-inner less-padding post-add-preview-model-container'>
              <Paragraph className='text-gray'>
                {'AD No. CL-AD-6282567'}
              </Paragraph>
              <Row gutter={[0]}>
                <Col flex='370px'>
                  <CarouselCustom
                    allImages={allImages ? allImages.fileList : []}
                  />
                </Col>
                <Col className='parent-right-block'>
                  <div className='product-detail-right'>
                    <div className='product-title-block'>
                      <div className='left-block'>
                        <Title level={3}>
                          {attributes.title ? attributes.title : ''}
                        </Title>
                        <div className='auto-view-digit'>
                          <Icon icon='view' size='14' />{' '}
                          <Text className='views-digit'>{'456'} Views</Text>
                          <Text className='ml-15'>
                            {displayDateTimeFormate(today)}
                          </Text>
                        </div>
                      </div>
                      <div className='right-block'>
                        <ul>
                          {hide_mob_number === true && (
                            <li>
                              <Dropdown
                                overlay={number}
                                trigger={['click']}
                                overlayClassName='contact-social-detail'
                                placement='bottomCenter'
                                arrow
                              >
                                <div
                                  className='ant-dropdown-link'
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <Icon
                                    icon='call'
                                    size='20'
                                    onClick={(e) => e.preventDefault()}
                                  />
                                </div>
                              </Dropdown>
                            </li>
                          )}
                          <li>
                            <div
                              className='ant-dropdown-link'
                              onClick={(e) => e.preventDefault()}
                            >
                              <Icon icon='share' size='20' />
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/*01: Start:*/}
                    <div className='product-map-price-block'>
                      <div className='left-block'>
                        <table style={{ width: '100%' }}>
                          <tr>
                            <td>
                              <label>Price:</label>
                            </td>
                            <td>
                              <Title level={2} className='price'>
                                {attributes.Price
                                  ? `'AU$'${salaryNumberFormate(
                                      attributes.price
                                    )}`
                                  : ''}
                              </Title>
                            </td>
                          </tr>
                          <tr>
                            <td colspan='2' className='space-block'>
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Date Listed:</label>
                            </td>
                            <td className='text-detail'>
                              {dateFormat4(today)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <label>Condition:</label>
                            </td>
                            <td className='text-detail'>New</td>
                          </tr>
                          <tr>
                            <td>
                              <label>Location:</label>
                            </td>
                            <td className='text-detail'>
                              <Text>
                                {address ? address : location}&nbsp;&nbsp;
                              </Text>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='2'>
                              <div className='map-view mt-12 mb-10'>
                                <img
                                  src={require('../../../assets/images/map-demo.png')}
                                  alt='map'
                                />
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div className='right-block'>
                        <Button type='default' className='contact-btn'>
                          Contact
                        </Button>
                        <Button type='default' className='make-offer-btn'>
                          {realState ? 'Send Enquiry' : 'Make an Offer'}
                        </Button>
                        <Button type='default' className='add-wishlist-btn'>
                          <Icon icon='wishlist' size='20' className='active' />
                          Add to Wishlist
                        </Button>
                      </div>
                    </div>

                    <div className='add-review-block'>
                      <div className='ad-no-block'>
                        <div className='left-block'>
                          <div className='label'>Ad Details:</div>
                        </div>
                        <div className='right-block'>
                          <div className='add-no-right'>
                            <Link to='/classifieds-general/Automotive/30'>
                              <Button type='default' className='light-gray'>
                                {cat_name}
                              </Button>
                            </Link>
                            <div className='ad-num'>
                              <Paragraph className='text-gray mb-0'>
                                AD No. 3141
                              </Paragraph>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='report-ad'>
                        <div className='view-map testing-content change-log pt-0'>
                          <p className='blue-p'>
                            <ExclamationCircleOutlined /> Report this Ad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Tabs type='card' className={'tab-style3 product-tabs'}>
                <TabPane tab='Details' key='1'>
                  <Row gutter={[0, 0]}>
                    <Col md={18}>
                      <div className='content-detail-block'>
                        <Title level={4}>
                          {realState ? 'Property Description' : 'Overview'}
                        </Title>
                        <Paragraph className='text-discription-block'>
                          {attributes.description &&
                            convertHTMLToText(attributes.description)}
                          <Row className='pt-5'>
                            {cat_name === 'Automotive' &&
                              specification &&
                              this.renderSpecification(specification)}
                          </Row>
                        </Paragraph>
                        {realState && features && features.length !== 0 && (
                          <Title level={4} className='block-heading-two'>
                            Property Features
                          </Title>
                        )}
                        {realState && (
                          <div className='feture-listing'>
                            <Row gutter={[0, 0]}>
                              {features &&
                                features.length !== 0 &&
                                this.renderPropertyFeatures(features)}
                            </Row>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={1}>&nbsp;</Col>
                    {realState && (
                      <Col md={5}>
                        <div className='similer-listing-parent view-floor-plan'>
                          <h2>View Floor Plan</h2>
                          <div
                            className='floor-plan-img'
                            title='Click to view floor plan'
                          >
                            {
                              <img
                                alt='example'
                                src={require('../../../assets/images/floor-plan.jpg')}
                              />
                            }
                          </div>
                          <div className='floor-detail'>
                            {specification &&
                              this.renderRealestateFloorPlan(specification)}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </TabPane>
                {cat_name === 'Automotive' && (
                  <TabPane tab='Features' key='2'>
                    <div className='feture-listing'>
                      <h4>Standard Features</h4>
                      <Row gutter={[0, 0]}>
                        {specification && this.renderFeatures(specification)}
                      </Row>
                    </div>
                  </TabPane>
                )}
                {realState && (
                  <TabPane tab='Inspection' key='2' className='book-inspection'>
                    {inspectionData &&
                      attributes.inspection_type !== 'By Appointment' && (
                        <div className='book-app-box'>
                          <Title level={4}>{'Book an Inspection Time'}</Title>
                          <div className={'mt-20 mb-30'}>
                            {this.renderInspection(inspectionPreview)}
                          </div>
                        </div>
                      )}
                    {inspectionData === '' && (
                      <div className='inspection-no-data'>
                        <ClockCircleOutlined className='clock' />
                        <div className='empty-discrip'>
                          The agent has not scheduled any inspections for this
                          property
                        </div>
                        <Button type='default'>{'Send Enquiry'}</Button>
                      </div>
                    )}
                  </TabPane>
                )}
                <TabPane
                  tab='Advertiser Information'
                  key='4'
                >
                  {this.renderAdvertiserInfo()}
                </TabPane>
              </Tabs>
            </div>
          </Layout>
        </React.Fragment>
      </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, postAd, profile } = store;
  const { step1, attributes, step3, allImages, preview } = postAd;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    step1,
    attributes: attributes,
    specification: attributes.specification,
    inspectionPreview: attributes.inspectionPreview,
    step3,
    allImages,
    preview,
  };
};

export default connect(mapStateToProps, null)(Preview);
