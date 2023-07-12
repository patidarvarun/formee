import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../customIcons/customIcons';
import { Link } from 'react-router-dom'
import {
  Layout,
  Typography,
  Tabs,
  Row,
  Col,
  Button,
  Rate,
  Modal,
  Divider,
  List,
  Avatar,Popover, Space,
} from 'antd';
import { SocialShare } from '../../common/social-share'
import { capitalizeFirstLetter,convertHTMLToText ,convertISOToUtcDateformate,salaryNumberFormate} from '../../common'
import { rating, ratingLabel } from '../../classified-templates/CommanMethod'
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

class PreviewJobModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salary: '', salary_type: '', company_name: '', about_job: '', opportunity: '',
      apply: '',
      about_you: '',
      responsbility: '',
      is_favourite: false,
      btnDisable: false
    };

  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { allData } = this.props;
    allData && this.renderDetail(allData.spicification)
  }

  /**
   * @method renderDetail
   * @description render specification list
   */
  renderDetail = (data) => {
    let temp1 = '', temp2 = '', temp3 = '', temp4 = '', temp5 = '', temp6 = '', temp7 = '', temp8 = ''
    data && data.length && data.map((el, i) => {
    if (el.key === 'Salary Range') {
        temp1 = el.value
        } else if (el.slug === 'salary_type') {
            temp2 = el.value
        } else if (el.slug === 'company_name') {
            temp3 = el.value
        } else if (el.slug === 'job_type') {
            temp4 = el.value
        } else if (el.key === 'Opportunity' || el.key === 'About the job role' || el.key === 'The benefit you will get') {
            temp5 = el.value
        } else if (el.slug === 'How_to_apply') {
            temp6 = el.value
        } else if (el.slug === 'about_you:') {
            temp7 = el.value
        } else if (el.slug === 'key_responsibilities:') {
            temp8 = el.value
        }
    })
    this.setState({
      salary: temp1 ? temp1 : '',
      salary_type: temp2 ? temp2 : '',
      company_name: temp3 ? temp3 : '',
      about_job: temp4 ? temp4 : '',
      opportunity: temp5 ? temp5 : '',
      apply: temp6 ? temp6 : '',
      about_you: temp7 ? temp7 : '',
      responsbility: temp8 ? temp8 : ''
    })
  }

   /**
    * @method renderSpecification
    * @description render specification
    */
   renderSpecification = (data) => {
    let temp1 = '', temp2 = '', temp3 = '', temp4 = '', temp5 = '', temp6 = '', temp7 = '', temp8 = ''
    data && data.map((el, i) => {
        if (el.key === 'Salary Range') {
            temp1 = el.value
        } else if (el.slug === 'salary_type') {
            temp2 = el.value
        } else if (el.slug === 'company_name') {
            temp3 = el.value
        } else if (el.slug === 'job_type') {
            temp4 = el.value
        } else if (el.key === 'Opportunity' || el.key === 'About the job role' || el.key === 'The benefit you will get') {
            temp5 = el.value
        } else if (el.slug === 'How_to_apply') {
            temp6 = el.value
        } else if (el.slug === 'about_you:') {
            temp7 = el.value
        } else if (el.slug === 'key_responsibilities:') {
            temp8 = el.value
        }
    })
    this.setState({
        salary: temp1 ? temp1 : '',
        salary_type: temp2 ? temp2 : '',
        company_name: temp3 ? temp3 : '',
        about_job: temp4 ? temp4 : '',
        opportunity: temp5 ? temp5 : '',
        apply: temp6 ? temp6 : '',
        about_you: temp7 ? temp7 : '',
        responsbility: temp8 ? temp8 : ''
    })
}


  /**
   * @method render
   * @description render component
   */
  render() {
    const { loggedInDetail, isLoggedIn,classifiedDetail, allData } = this.props
    const { is_favourite, responsbility, salary, salary_type, company_name, about_job, opportunity, apply, about_you, btnDisable } = this.state;
    
    let clasified_user_id = classifiedDetail && classifiedDetail.classified_users ? classifiedDetail.classified_users.id : ''
    let isButtonVisible = isLoggedIn && loggedInDetail.id === clasified_user_id ? false : true
    let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
    let formateSalary = salary && salary !== '' && salary.split(';')
    let range1 = formateSalary && formateSalary[0]
    let range2 = formateSalary && formateSalary[1]
    let totalSalary = range1 && range2 ? `${range1} - ${range2} ${salary_type}` : range1 && `${range1} ${salary_type}`
    const menu = (
        <SocialShare {...this.props} />
    )
    return (
      <Modal
        visible={this.props.visible}
        className={'custom-modal prf-prevw-custom-modal'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <React.Fragment>
          <Layout>
              <div className='wrap-inner mb-35'>
                  <Tabs type='card' className={'tab-style3 job-detail-content'}>
                      <TabPane tab={(<span className='border-line'>Details</span>)} key='1'>
                          <Row>
                              <Col md={20}>
                                  <Row>
                                      <Col xl={10}>
                                          <Text className='text-gray'>{`AD No. ${classifiedDetail.id}`}</Text>
                                          <Title level={2} className='title'>{classifiedDetail.title && capitalizeFirstLetter(classifiedDetail.title)}</Title>
                                          <div className='location-name'>
                                              {classifiedDetail.location !== 'N/A' && classifiedDetail.location}
                                          </div>
                                          <div className='price-box'>
                                              <div className='price'>{totalSalary ? `AU$${salaryNumberFormate(totalSalary)}` : ''} </div>
                                          </div>
                                          <div className='info'>
                                              {classifiedDetail.created_at && <Text className='text-gray'>Date Posted - &nbsp;&nbsp;{classifiedDetail && convertISOToUtcDateformate(classifiedDetail.created_at)}<br /></Text>}
                                              {classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname.name && <Text className='text-gray'>Category - &nbsp;&nbsp;{classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname.name}<br /></Text>}
                                              {about_job && <Text className='text-gray'>Job Type - &nbsp;&nbsp;{about_job}<br /></Text>}
                                              {salary_type && <Text className='text-gray'>Salary Type - &nbsp;&nbsp;{salary_type && salary_type}</Text>}
                                          </div>
                                          <ul className='ant-card-actions'>
                                              <li>
                                                  <Icon
                                                      icon='wishlist'
                                                      size='20'
                                                      className={classifiedDetail.wishlist ? 'active' : ''}
                                                  />
                                              </li>
                                              <li>
                                                  <Icon icon='share' size='20' />
                                              </li>
                                              <li>
                                                  <Popover title={`Total Views : ${classifiedDetail.count}`}>
                                                      <Icon icon='view' size='20' /> <Text>{classifiedDetail.count}</Text>
                                                  </Popover>
                                              </li>
                                          </ul>
                                      </Col>
                                      {isButtonVisible && <Col xl={14}>
                                          <div className='right-content'>
                                              <Space className='action-btn'>
                                                  <Button
                                                      type='default'
                                                  >
                                                      {'Contact'}
                                                  </Button>

                                                  <Button
                                                      type='default'
                                                      disabled={btnDisable}
                                                  >
                                                      {'Apply for this job'}
                                                  </Button>
                                              </Space>
                                          </div>
                                      </Col>}
                                  </Row>

                                  <Divider />
                                  <div className='content-detail-block'>
                                    <Title level={4}>Job Description</Title>
                                    {opportunity && <Title level={4} className='sub-title mt-20'>Rare Opportunity!</Title>}
                                    <Paragraph className='description'>
                                        {convertHTMLToText(classifiedDetail.description)}
                                    </Paragraph>
                                    
                                    {responsbility && <Title level={4} className='sub-title mt-20'>Key Responsbilities are but not limited to:</Title>}
                                    {responsbility && <Paragraph className='description'>
                                        {responsbility && convertHTMLToText(responsbility)}
                                    </Paragraph>}
                                    {about_you && <Title level={4} className='sub-title mt-20'>About you:</Title>}
                                    {about_you && <Paragraph className='description'>
                                        {about_you && convertHTMLToText(about_you)}
                                    </Paragraph>}
                                    
                                    {apply && <Title level={4} className='sub-title mt-20'>How do I apply?</Title>}
                                    {apply && <Paragraph className='description'>
                                        {apply && convertHTMLToText(apply)}
                                    </Paragraph>}
                                </div>
                              </Col>
                          </Row>
                      </TabPane>

                      <TabPane tab={(<span className='border-line'>Advertiser</span>)} key='4'>
                          <Row className='reviews-content'>
                              <Col md={14}>
                                  <div className='reviews-content-left'>
                                      <div className='reviews-content-avatar'>
                                          <Avatar
                                              src={classifiedDetail.classified_users &&
                                                  classifiedDetail.classified_users.image_thumbnail ?
                                                  classifiedDetail.classified_users.image_thumbnail :
                                                  require('../../../assets/images/avatar3.png')}
                                              size={69}
                                          />
                                      </div>
                                      <div className='reviews-content-avatar-detail'>
                                          <div className='clearfix'>
                                              <Title level={4} className='mt-10'>
                                                  {classifiedDetail.classified_users && classifiedDetail.classified_users.name}
                                                  <Link className='pull-right fs-10 text-gray'>
                                                      {`Found ${classifiedDetail.usercount} Ads`}
                                                  </Link>
                                              </Title>
                                          </div>
                                          <Paragraph className='fs-10 text-gray'>
                                              {classifiedDetail.classified_users &&
                                                  `(Member since : ${classifiedDetail.classified_users.member_since})`}
                                          </Paragraph>
                                          <div className='reviews-rating'>
                                              <div className='product-ratting mb-15'>
                                                  <Text>{rate ? rate : 'No reviews yet'}</Text>
                                                  {rate && <Rate allowHalf defaultValue={rate && rate ? rate : 0} className='fs-15 ml-6 mr-6' style={{ position: 'relative', top: '-1px' }} />}
                                                  <Text>{rate ? `${rate} of 5.0 /` : ''}  {ratingLabel(rate)}</Text>
                                              </div>
                                          </div>
                                          <div className='address'>
                                              {classifiedDetail.location}
                                          </div>
                                      </div>
                                  </div>

                                  <Title level={3} className='text-gray mt-30'>
                                      {`Reviews (${classifiedDetail.classified_hm_reviews && classifiedDetail.classified_hm_reviews.length})`}
                                  </Title>
                                  <Divider style={{ marginTop: 0, backgroundColor: '#90A8BE' }} />
                                  <List
                                      itemLayout='vertical'
                                      dataSource={classifiedDetail.classified_hm_reviews && classifiedDetail.classified_hm_reviews}
                                      renderItem={item => (
                                          <List.Item>
                                              <Rate allowHalf defaultValue={item.rating} className='fs-16 mb-7' />
                                              <List.Item.Meta
                                                  avatar={<Avatar
                                                      src={item.reviews_bt_users &&
                                                          item.reviews_bt_users.image_thumbnail ?
                                                          item.reviews_bt_users.image_thumbnail :
                                                          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                                      }
                                                      alt={''}
                                                      size={37}
                                                  />}
                                                  title={<a href='https://ant.design'>{item.reviews_bt_users && item.reviews_bt_users.fname}</a>}
                                                  description={item.review}
                                              />
                                          </List.Item>
                                      )}
                                  />
                                  <div className='align-right'>
                                      {classifiedDetail.classified_hm_reviews && classifiedDetail.classified_hm_reviews.length > 5 && <div className='red-link'>{'Read more reviews'}</div>}
                                  </div>
                              </Col>
                          </Row>
                      </TabPane>
                  </Tabs>
              </div>
          </Layout>
        </React.Fragment>
      </Modal >
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, postAd, profile } = store;
  const { step1, attributes, step3 } = postAd;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    step1,
    attributes: attributes,
    specification: attributes.specification,
  };
};

export default connect(mapStateToProps, null)(PreviewJobModel);
