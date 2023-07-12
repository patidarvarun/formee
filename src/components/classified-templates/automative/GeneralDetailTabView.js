import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Empty,
  Checkbox,
  Typography,
  Avatar,
  Tabs,
  Row,
  Col,
  Collapse,
} from 'antd';
import { convertHTMLToText, salaryNumberFormate } from '../../common';
import {
  getClassfiedCategoryDetail,
  enableLoading,
  disableLoading,
  openLoginModel,
} from '../../../actions/index';
import { UserOutlined } from '@ant-design/icons';
import Review from '../common/ClassifiedReview';
import SimilarAdBlock from '../common/SimilarAds';
import { Fragment } from 'react';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

class GeneralDetailTabView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      makeReviewtabOpen: false,
      priorityTab: 0,
      classifiedDetail: '',
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdNext = nextprops.priorityTab;
    if (catIdNext === 3) {
      this.setState({ activeTab: '3' });
    }
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    let parameter = this.props.match.params;
    let parentId = parameter.categoryId;
    this.getDetails();
  }

  /**
   * @method getDetails
   * @description get classified details
   */
  getDetails = (filterKey) => {
    this.setState({ classifiedDetail: this.props.classifiedDetail });
  };

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    this.setState({
      activeTab: key,
      reviewTab: false,
      makeReviewtabOpen: false,
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

  render() {
    const {
      classifiedDetail,
      tempSlug,
      setPriorityTab,
      allData,
      classified_id,
      cat_id,
      similarAd,
      isLoggedIn,
      makeReviewtabOpen,
    } = this.props;
    const { activeTab } = this.state;

    let cat_name =
      classifiedDetail &&
      classifiedDetail.categoriesname &&
      classifiedDetail.categoriesname.name;
    return (
      <Tabs
        type='card'
        className={'tab-style3 product-tabs'}
        activeKey={activeTab}
        onChange={(e) => {
          this.onTabChange(e);
          setPriorityTab();
        }}
      >
        <TabPane tab='Details' key='1'>
          <Row gutter={[0, 0]}>
            <Col md={18}>
              <div className='content-detail-block'>
                <Title level={4}>Overview</Title>
                <Paragraph className='text-discription-block'>
                  {classifiedDetail.description
                    ? convertHTMLToText(classifiedDetail.description)
                    : ''}
                </Paragraph>
                <Row className='pt-5'>
                  {allData &&
                    allData.spicification &&
                    this.renderSpecification(allData.spicification)}
                </Row>
              </div>
            </Col>
            <Col md={1}>&nbsp;</Col>
            <Col md={5}>
              <SimilarAdBlock listItem={similarAd} />
            </Col>
          </Row>
        </TabPane>
        {cat_name === 'Automotive' && (
          <TabPane tab='Features' key='2'>
            <div className='feture-listing'>
              <h2>Standard Features</h2>
              <Row gutter={[0, 0]}>
                {allData &&
                  allData.spicification &&
                  this.renderFeatures(allData.spicification)}
              </Row>
            </div>
          </TabPane>
        )}
        <TabPane tab='Advertiser Information' key='5'>
          <Row className='reviews-content'>
            <Col md={8}>
              <div className='reviews-content-left'>
                <div className='reviews-content-avatar'>
                  <Avatar
                    src={
                      classifiedDetail.classified_users &&
                      classifiedDetail.classified_users.image_thumbnail ? (
                        classifiedDetail.classified_users.image_thumbnail
                      ) : (
                        <Avatar size={71} icon={<UserOutlined />} />
                      )
                    }
                    size={71}
                  />
                </div>
                <div className='reviews-content-avatar-detail'>
                  <Title level={4} className='mt-0 '>
                    {classifiedDetail.classified_users &&
                      classifiedDetail.classified_users.name}
                  </Title>
                  <Paragraph className='fs-10 mb-0'>
                    {classifiedDetail.classified_users &&
                      `Member since : ${classifiedDetail.classified_users.member_since}`}
                  </Paragraph>
                  <a className='fs-10 underline'>
                    {isLoggedIn ? (
                      <Link
                        to={`/user-ads/${tempSlug}/${cat_id}/${classified_id}`}
                      >{`Found ${classifiedDetail.usercount} Ads`}</Link>
                    ) : (
                      <span
                        onClick={() => this.props.openLoginModel()}
                      >{`Found ${classifiedDetail.usercount} Ads`}</span>
                    )}
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};

export default connect(mapStateToProps, {
  getClassfiedCategoryDetail,
  openLoginModel,
  enableLoading,
  disableLoading,
})(React.memo(withRouter(GeneralDetailTabView)));
