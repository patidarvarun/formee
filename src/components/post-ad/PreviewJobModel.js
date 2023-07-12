import React from 'react';
import { connect } from 'react-redux';
import Icon from '../customIcons/customIcons';
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
  Avatar,
} from 'antd';
import {convertHTMLToText, convertISOToUtcDateformate, displayDateTimeFormate, converInUpperCase,salaryNumberFormate } from '../common';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const temp = [
  {
    rating: '5',
    review: 'Very nice',
    name: 'Joy'
  },
  {
    rating: '4',
    review: 'Good',
    name: 'Bob'
  },
  {
    rating: '5',
    review: 'Excellent',
    name: 'Mark'
  },
  {
    rating: '3',
    review: 'Good',
    name: 'Calley'
  },
  {
    rating: '2',
    review: 'Average',
    name: 'Marry'
  }
]


class PreviewJobModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salary: '', salary_type: '', company_name: '', about_job: '', opportunity: '',
      apply: '',
      about_you: ''
    };

  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { specification } = this.props;
    specification && this.renderDetail(specification)
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
   * @method render
   * @description render component
   */
  render() {
    const { attributes, step1, userDetails, specification } = this.props;
    const { responsbility, salary, salary_type, company_name, about_job, opportunity, apply, about_you } = this.state;
    const location = userDetails.address ? userDetails.address : '';
    const today = Date.now()
    let formateSalary = salary && salary !== '' && `$${salaryNumberFormate(salary)}`
    let totalSalary = formateSalary
    return (
      <Modal
        visible={this.props.visible}
        className={'custom-modal'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <React.Fragment>
          <Layout>
            <div className='wrap-inner less-padding'>
              <Tabs type='card' className={'tab-style3 job-detail-content'}>
                <TabPane tab='Details' key='1'>
                  <Row>
                    <Col md={20}>
                      <Row>
                        <Col md={12}>
                          <Text className='text-gray'>
                            {'AD No. CL-AD-6282567'}
                          </Text>
                          <Title level={2} className='title'>
                            {attributes.title ? attributes.title : ''}
                          </Title>
                          <div className='company-name'>{company_name && company_name}</div>
                          <div className='location-name'>
                            {location}
                          </div>
                          <div className='rate-section'>
                            {'3.0'}
                            <Rate allowHalf defaultValue={3.0} />
                          </div>
                          <div className='price-box'>
                            <div className='price'>
                              {totalSalary ? `AU$${salaryNumberFormate(totalSalary)}` : ''}
                            </div>
                          </div>
                          <div className='info'>
                            <Text className='text-gray'>Date Posted</Text> - &nbsp;&nbsp;
                            {convertISOToUtcDateformate(today)}
                            <br />
                            <Text className='text-gray'>Category</Text> - &nbsp;&nbsp;
                            {step1.subCategoryData.name}
                            <br />
                            <Text className='text-gray'>Job Type</Text> - &nbsp;&nbsp;{about_job ? about_job : 'Full Time'}
                            <br />
                            <Text className='text-gray'>Salary Type</Text> - &nbsp;&nbsp;
                              {salary_type ? salary_type : ' Monthly'}
                          </div>
                          <ul className='ant-card-actions'>
                            <li>
                              <Icon icon='wishlist' size='20' />
                            </li>
                            <li>
                              <Icon icon='share' size='20' />
                            </li>
                            <li>
                              <Icon icon='view' size='20' /> <Text>455</Text>
                            </li>
                          </ul>
                        </Col>
                        <div className='right-content'>
                          <Row gutter={[20, 0]} className='action-btn'>
                            <Col>
                              <Button type='default'>{'Contact'}</Button>
                            </Col>
                            <Col>
                              <Button type='default'>
                                {'Apply for this job'}
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Row>
                      <Divider />
                      <div className="content-detail-block">
                          <Title level={4}>Job Description</Title>
                          {attributes.description && <Title level={4} className="sub-title mt-20">Rare Opportunity!</Title>}
                          <Paragraph className='description'>
                              {convertHTMLToText(attributes.description)}
                          </Paragraph>
                          
                          {responsbility && <Title level={4} className="sub-title mt-20">Key Responsbilities are but not limited to:</Title>}
                          {responsbility && <Paragraph className='description'>
                              {responsbility && convertHTMLToText(responsbility)}
                          </Paragraph>}
                          {about_you && <Title level={4} className="sub-title mt-20">About you:</Title>}
                          {about_you && <Paragraph className='description'>
                              {about_you && convertHTMLToText(about_you)}
                          </Paragraph>}
                          
                          {apply && <Title level={4} className="sub-title mt-20">How do I apply?</Title>}
                          {apply && <Paragraph className='description'>
                              {apply && convertHTMLToText(apply)}
                          </Paragraph>}
                      </div>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tab='Advertiser' key='2'>
                  <Row className='reviews-content'>
                    <Col span={24}>
                      <div className='reviews-content-left' style={{ paddingRight: 0 }}>
                        <div className='reviews-content-avatar'>
                          <Avatar
                            src={require('../../assets/images/avatar3.png')}
                            size={69}
                          />
                        </div>
                        <div className='reviews-content-avatar-detail'>
                          <div className='clearfix'>
                            <Title level={4} className='mt-10'>
                              {userDetails && userDetails.name ? converInUpperCase(userDetails.name) : ''}
                              <span className='pull-right fs-10 text-gray'>
                                {`Found 0 Ads`}
                              </span>
                            </Title>
                          </div>
                          <Paragraph className='fs-10 text-gray'>
                            {`(Member since : ${displayDateTimeFormate(today)})`}
                          </Paragraph>
                          <div className='reviews-rating'>
                            <div className='product-ratting mb-15'>
                              <Text>{'3.0'}</Text>
                              {<Rate allowHalf defaultValue={3} className='fs-15 ml-6 mr-6' style={{ position: 'relative', top: '-1px' }} />}
                              <Text>{`3.0 of 5.0 / Average`}</Text>
                            </div>
                          </div>
                          <div className='address'>
                            {location}
                          </div>
                        </div>
                      </div>

                      <Title level={3} className='text-gray mt-30'>
                        {`Reviews (5)`}
                      </Title>
                      <Divider style={{ marginTop: 0, backgroundColor: '#90A8BE' }} />
                      <List
                        itemLayout='vertical'
                        dataSource={temp && temp}
                        renderItem={item => (
                          <List.Item>
                            <Rate allowHalf defaultValue={item.rating} className='fs-16 mb-7' />
                            <List.Item.Meta
                              avatar={<Avatar
                                src={
                                  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                }
                                alt={''}
                                size={37}
                              />}
                              title={<a href='https://ant.design'>{item.name}</a>}
                              description={item.review}
                            />
                          </List.Item>
                        )}
                      />
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
