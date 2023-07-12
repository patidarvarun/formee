import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from '../../customIcons/customIcons';
import {
  Tooltip,
  Empty,
  Checkbox,
  Collapse,
  Dropdown,
  Menu,
  Select,
  Avatar,
  Layout,
  Typography,
  Tabs,
  Row,
  Col,
  Button,
  Modal,
} from 'antd';
import {
  enableLoading,
  disableLoading,
  getClassfiedCategoryDetail,
} from '../../../actions';
import { langs } from '../../../config/localization';
import {
  convertISOToUtcDateformate,
  convertHTMLToText,
  capitalizeFirstLetter,
  salaryNumberFormate,
  displayDateTimeFormate,
  converInUpperCase,
  displayInspectionDate,
  formateTime,
} from '../../common';
import Map from '../../common/Map';
import {
  ExclamationCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import Carousel from '../../common/caraousal';
import { SocialShare } from '../../common/social-share';
import { rating } from '../../classified-templates/CommanMethod';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const temp = [
  {
    rating: '5',
    review: 'Very nice',
    name: 'Joy',
  },
  {
    rating: '5',
    review: 'Good',
    name: 'Bob',
  },
  {
    rating: '5',
    review: 'Excellent',
    name: 'Mark',
  },
  {
    rating: '5',
    review: 'Very nice',
    name: 'Calley',
  },
  {
    rating: '5',
    review: 'Very nice',
    name: 'Marry',
  },
];

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carouselNav1: null,
      carouselNav2: null,
      isOpen: false,
      activeTab: '1',
      classifiedDetail: '',
      allData: '',
    };
  }

  /**
   * @method componentWillMount
   * @description called before calling the component
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getClassifiedDetails();
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

  getClassifiedDetails = () => {
    const { isLoggedIn, loggedInUser, classified_id } = this.props;
    let id = classified_id ? classified_id : this.props.match.params.id;
    let reqData = {
      id: id,
      user_id: isLoggedIn ? loggedInUser.id : '',
    };
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ classifiedDetail: res.data.data, allData: res.data });
      }
    });
  };

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
            <Col span={4} style={{ marginBottom: '13px' }}>
              <Text className='strong'>{el.key}</Text>
            </Col>
            <Col span={8} style={{ marginBottom: '13px' }}>
              <Text>{value}</Text>
            </Col>
          </Fragment>
        );
      })
    );
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
   * @method renderInspectionTime
   * @description render inspections
   */
  renderInspectionTime = (item, visible) => {
    return (
      item &&
      Array.isArray(item) &&
      item.length &&
      item.map((el, i) => {
        return (
          <Row gutter={15}>
            <Col span={21}>
              <div className='inspection-list'>
                <Icon icon='clock' size='22' />
                <Text className='ml-15'>
                  {displayInspectionDate(
                    new Date(el.inspection_date).toISOString()
                  )}
                </Text>
                <div className='right'>
                  <Text>
                    {/* {formateTime(el.inspection_start_time)} - {formateTime(el.inspection_end_time)} */}
                    {formateTime(el.inspection_start_time)}
                  </Text>
                </div>
              </div>
            </Col>
            {visible && (
              <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  htmlType={'button'}
                  type='primary'
                  onClick={() => this.makeOfferModal(el)}
                >
                  <img
                    src={require('../../../assets/images/icons/add-booking.svg')}
                    width='16'
                    alt=''
                  />
                  Book
                </Button>
              </Col>
            )}
          </Row>
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
    let features =
      temp && temp.length ? temp[0].value && temp[0].value.split(',') : [];
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
   * @method renderIcon
   * @description render icons
   */
  renderIcon = (data) => {
    const iconData = data.filter(
      (el) =>
        el.key === 'Bedrooms' ||
        el.key === 'Bathrooms' ||
        el.key === 'Parking Type' ||
        el.key === 'Shower' ||
        el.key === 'Parking' ||
        el.key === 'Property Type'
    );
    return (
      iconData &&
      Array.isArray(iconData) &&
      iconData.map((el, i) => {
        return (
          <li>
            {
              <img
                src={require('../../../assets/images/icons/bedroom.svg')}
                alt=''
              />
            }
            {<Text>{el.value}</Text>}
            {(el.key === 'Shower' || el.key === 'Bathrooms') && (
              <img
                src={require('../../../assets/images/icons/bathroom.svg')}
                alt=''
              />
            )}
            {(el.key === 'Shower' || el.key === 'Bathrooms') && (
              <Text>{el.value}</Text>
            )}
            {(el.key === 'Parking' || el.key === 'Parking Type') && (
              <img
                src={require('../../../assets/images/icons/carpark.svg')}
                alt=''
              />
            )}
            {(el.key === 'Parking' || el.key === 'Parking Type') && (
              <Text>{el.value}</Text>
            )}
            {el.key === 'Property Type' && (
              <img
                src={require('../../../assets/images/icons/land-size.svg')}
                alt=''
              />
            )}
            {el.key === 'Property Type' && <Text>{el.value}</Text>}
          </li>
        );
      })
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { loggedInUser, isLoggedIn } = this.props;
    const { activeTab, classifiedDetail, allData } = this.state;
    let realState =
      loggedInUser.user_type === langs.key.business &&
      loggedInUser.role_slug === langs.key.real_estate;
    let rate =
      classifiedDetail &&
      classifiedDetail.data &&
      classifiedDetail.data.classified_hm_reviews &&
      rating(classifiedDetail.data.classified_hm_reviews);
    let today = Date.now();
    let inspectionTime = allData && allData.inspections_times;
    let inspectionData =
      inspectionTime && Array.isArray(inspectionTime) && inspectionTime.length
        ? inspectionTime[0]
        : '';
    let date = inspectionData.inspection_date
      ? moment(inspectionData.inspection_date).format('dddd DD MMMM, YYYY')
      : '';
    let time = inspectionData.inspection_date
      ? `${moment(inspectionData.inspection_start_time).format(
          'h:mm a'
        )} - ${moment(inspectionData.inspection_end_time).format('h:mm a')}`
      : '';
    const menu = <SocialShare {...this.props} />;
    const number = (
      <Menu>
        <Menu.Item key='0'>
          <span className=''>
            {classifiedDetail.classified_users && (
              <Tooltip placement='bottomRight'>
                <div>
                  <b>
                    <span>
                      {' '}
                      Contact {classifiedDetail.classified_users.name}
                    </span>
                  </b>
                  <span>
                    {' '}
                    {classifiedDetail.contact_mobile
                      ? classifiedDetail.contact_mobile
                      : 'Number not found'}{' '}
                  </span>
                </div>
              </Tooltip>
            )}
          </span>
        </Menu.Item>
      </Menu>
    );
    let currentDate = moment(today).format('YYYY-MM-DD');
    let isButtonVisible =
      isLoggedIn && loggedInUser.id === classifiedDetail.id ? false : true;
    let cat_name =
      classifiedDetail && classifiedDetail.categoriesname
        ? classifiedDetail.categoriesname.name
        : '';
    let specification =
      allData &&
      allData.spicification &&
      Array.isArray(allData.spicification) &&
      allData.spicification.length
        ? allData.spicification.filter(
            (el) => el.slug === 'is_price_negotiable?'
          )
        : [];
    let is_negotiable =
      specification && Array.isArray(specification) && specification.length
        ? specification[0].value
        : '';
    let conditionlabel =
      cat_name === 'Automotive' ||
      cat_name === 'Electronics' ||
      cat_name === 'Books & Music'
        ? 'Condition'
        : 'Category';
    let conditionValue =
      cat_name === 'Automotive' ||
      cat_name === 'Electronics' ||
      cat_name === 'Books & Music'
        ? classifiedDetail.ad_type
          ? classifiedDetail.ad_type
          : 'New'
        : classifiedDetail &&
          classifiedDetail.subcategoriesname &&
          classifiedDetail.subcategoriesname.name;
    return (
      <Modal
        visible={this.props.visible}
        className={'custom-modal prf-prevw-custom-modal prf-prevw-style1'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <React.Fragment>
          <div className='product-detail-parent-block'>
            <Layout className='common-left-right-padd'>
              <Layout>
                <Layout className='right-parent-block'>
                  <Layout
                    style={{ width: 'calc(100% - 0px)', overflowX: 'visible' }}
                  >
                    <Layout>
                      <div className='detail-page right-content-block'>
                        <Row gutter={[0, 0]}>
                          <Col flex='370px'>
                            {classifiedDetail.classified_image && (
                              <Carousel
                                className='mb-4'
                                classifiedDetail={classifiedDetail}
                                slides={classifiedDetail.classified_image}
                              />
                            )}
                          </Col>
                          <Col className='parent-right-block'>
                            <div className='product-detail-right'>
                              <div className='product-title-block'>
                                <div className='left-block'>
                                  <Title level={4}>
                                    {capitalizeFirstLetter(
                                      classifiedDetail.title
                                    )}
                                  </Title>
                                  <div className='total-view'>
                                    <Icon icon='view' size='16' />{' '}
                                    <Text>{classifiedDetail.count} Views</Text>
                                  </div>
                                </div>
                                <div className='right-block'>
                                  <ul>
                                    {classifiedDetail &&
                                      classifiedDetail.hide_mob_number ===
                                        1 && (
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
                                              onClick={(e) =>
                                                e.preventDefault()
                                              }
                                            >
                                              <Icon
                                                icon='call'
                                                size='20'
                                                onClick={(e) =>
                                                  e.preventDefault()
                                                }
                                              />
                                            </div>
                                          </Dropdown>
                                        </li>
                                      )}
                                    <li>
                                      <Icon icon='share' size='20' />
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className='product-map-price-block'>
                                <div className='left-block'>
                                  <table style={{ width: '100%' }}>
                                    <tr>
                                      <td>
                                        <span>Price:</span>
                                      </td>
                                      <td>
                                        <Title level={2} className='price'>
                                          {classifiedDetail.price
                                            ? `AU$${salaryNumberFormate(
                                                classifiedDetail.price
                                              )}`
                                            : 'Free'}
                                          {classifiedDetail.is_ad_free
                                            ? 'Free'
                                            : ''}
                                        </Title>
                                        {is_negotiable && (
                                          <Text className='mr-7 price-subtitle'>
                                            {is_negotiable ? 'Negotiable' : ''}
                                          </Text>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colspan='2' className='space-block'>
                                        &nbsp;
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <span>Date Listed:</span>
                                      </td>
                                      <td className='text-detail'>
                                        {convertISOToUtcDateformate(
                                          classifiedDetail.created_at
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <span>{conditionlabel}:</span>
                                      </td>
                                      <td className='text-detail'>
                                        {conditionValue}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <span>Location:</span>
                                      </td>
                                      <td className='text-detail'>
                                        {classifiedDetail.location}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan='2'>
                                        <div className='map-view'>
                                          {classifiedDetail && (
                                            <Map list={[classifiedDetail]} />
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                                <div className='right-block'>
                                  {isButtonVisible && (
                                    <div className='action-btn-block'>
                                      <Button
                                        type='default'
                                        className='contact-btn'
                                      >
                                        {'Contact'}
                                      </Button>
                                      {classifiedDetail.price !== 0 &&
                                        classifiedDetail.is_ad_free !== 1 && (
                                          <Button
                                            type='default'
                                            className='make-offer-btn'
                                          >
                                            {'Make an Offer'}
                                          </Button>
                                        )}
                                    </div>
                                  )}
                                  <Button
                                    type='default'
                                    className='add-wishlist-btn'
                                  >
                                    {classifiedDetail && (
                                      <Icon
                                        icon={
                                          classifiedDetail.wishlist
                                            ? 'wishlist-fill'
                                            : 'wishlist'
                                        }
                                        size='11'
                                        className={
                                          classifiedDetail.wishlist
                                            ? 'active'
                                            : ''
                                        }
                                      />
                                    )}{' '}
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
                                      <Button
                                        type='default'
                                        className='light-gray'
                                      >
                                        {classifiedDetail.categoriesname
                                          ? classifiedDetail.categoriesname.name
                                          : ''}
                                      </Button>
                                      <div className='ad-num'>
                                        <Paragraph className='text-gray mb-0'>
                                          AD No. {classifiedDetail.id}
                                        </Paragraph>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='report-ad'>
                                  <div className='view-map testing-content change-log pt-0'>
                                    {classifiedDetail.subcategoriesname && (
                                      <p>
                                        <ExclamationCircleOutlined /> Report
                                        this Ad
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <div>
                          <Tabs
                            type='card'
                            className={'tab-style3 product-tabs'}
                          >
                            <TabPane tab='Details' key='1'>
                              <Row gutter={[0, 0]}>
                                <Col md={24}>
                                  <div className='content-detail-block'>
                                    <Title level={4}>Overview</Title>
                                    <Paragraph className='text-discription-block'>
                                      {classifiedDetail.description
                                        ? convertHTMLToText(
                                            classifiedDetail.description
                                          )
                                        : ''}
                                    </Paragraph>
                                    <Row className='pt-5'>
                                      {allData &&
                                        allData.spicification &&
                                        this.renderSpecification(
                                          allData.spicification
                                        )}
                                    </Row>
                                  </div>
                                </Col>
                                <Col md={1}>&nbsp;</Col>
                              </Row>
                            </TabPane>
                            {cat_name === 'Automotive' && (
                              <TabPane tab='Features' key='2'>
                                <div className='feture-listing'>
                                  <h2>Standard Features</h2>
                                  <Row gutter={[0, 0]}>
                                    {allData &&
                                      allData.spicification &&
                                      this.renderFeatures(
                                        allData.spicification
                                      )}
                                  </Row>
                                </div>
                              </TabPane>
                            )}
                            <TabPane tab='Advertiser Information' key='4'>
                              <Row className='reviews-content'>
                                <Col md={8}>
                                  <div className='reviews-content-left'>
                                    <div className='reviews-content-avatar'>
                                      <Avatar
                                        src={
                                          classifiedDetail.classified_users &&
                                          classifiedDetail.classified_users
                                            .image_thumbnail ? (
                                            classifiedDetail.classified_users
                                              .image_thumbnail
                                          ) : (
                                            <Avatar
                                              size={60}
                                              icon={<UserOutlined />}
                                            />
                                          )
                                        }
                                        size={60}
                                      />
                                    </div>
                                    <div className='reviews-content-avatar-detail'>
                                      <Title level={4} className='mt-0 '>
                                        {classifiedDetail.classified_users &&
                                          classifiedDetail.classified_users
                                            .name}
                                      </Title>
                                      <Paragraph className='fs-10 mb-0'>
                                        {classifiedDetail.classified_users &&
                                          `Member since : ${classifiedDetail.classified_users.member_since}`}
                                      </Paragraph>
                                      <a className='fs-10 underline'>
                                        <span>{`Found ${classifiedDetail.usercount} Ads`}</span>
                                      </a>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </TabPane>
                          </Tabs>
                        </div>
                      </div>
                    </Layout>
                  </Layout>
                </Layout>
              </Layout>
            </Layout>
          </div>
        </React.Fragment>
      </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};

export default connect(mapStateToProps, {
  disableLoading,
  enableLoading,
  getClassfiedCategoryDetail,
})(Preview);
