import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../customIcons/customIcons';
import {
  Layout,
  Typography,
  Tabs,
  Row,
  Col,
  Button,
  Modal,
  Menu,
  Avatar,
  Dropdown,
} from 'antd';
import {convertHTMLToText, convertISOToUtcDateformate, displayDateTimeFormate, converInUpperCase,salaryNumberFormate } from '../../common';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

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
    const {mobileNo,hide_mob_number, attributes, step1, userDetails, specification } = this.props;
    const {responsbility, salary, salary_type, company_name, about_job, opportunity, apply, about_you } = this.state;
    const location = userDetails.address ? userDetails.address : '';
    const today = Date.now()

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
    let company_logo = attributes.company_logo && attributes.company_logo.length ? attributes.company_logo[0].thumbUrl : ''
    let formateSalary = salary && salary !== '' && `$${salaryNumberFormate(salary)}`
    let totalSalary = formateSalary
    let temp = attributes.specification && Array.isArray(attributes.specification) && attributes.specification.length ? attributes.specification : []
    let salary1 = temp.length && temp.filter(el => el.key === 'Minimum Salary')
    let salary_min = salary1 && salary1.length ? salary1[0].value : ''
    let salary2 = temp.length && temp.filter(el => el.key === 'Maximum Salary')
    let salary_max = salary2 && salary2.length ? salary2[0].value : ''
    let salary_range = salary_min && salary_max && `AU$${salaryNumberFormate(salary_min)} - AU$${salaryNumberFormate(salary_max)}` 
    return (
      <Modal
        visible={this.props.visible}
        className={'custom-modal job-vendor-preview-model'}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <React.Fragment>
          <Layout className='job-vendor-preview-container'>
          <Row>
                <Col md={5}>
                  <div className='vendor-logo-container'>
                  <img
                    src={company_logo ? company_logo : require('../../../assets/images/Job-detail-vendor-logo-demo.png')}
                    alt='vendor-logo.png' />                  
                  </div>
                  <div className='report-ad'>
                    <div className='view-map testing-content change-log pt-0'>
                      <p className='blue-p'>
                        <ExclamationCircleOutlined /> Report this Ad
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={19}>
                  <div className='product-detail-right'>
                    <div className='product-title-block'>
                      <div className='left-block'>
                        <Title level={3}>
                            {attributes.title ? attributes.title : ''}
                          </Title>                          
                         </div>
                         <div className='right-block'>
                           <ul>
                             <li>
                              <div className='total-view'>
                                <Icon icon='view' size='15' />{' '}
                                <Text className='views-digit'>{'456'} Views</Text>                            
                              </div>
                             </li>
                             <li>
                             {hide_mob_number === true && <li>
                            <Dropdown overlay={number} trigger={['click']} overlayClassName='contact-social-detail' placement='bottomCenter' arrow>
                              <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                <Icon icon='call' size='20' onClick={e => e.preventDefault()} />
                              </div>
                            </Dropdown>
                          </li>}                               
                             </li>
                             <li>
                                <Icon icon='share' size='20' />
                             </li>
                           </ul>
                        </div>
                      </div>
                      <div className='product-map-price-block'>
                      <div className='left-block'>
                        <Row className='dtl-job-content-pre-box'>
                          <Col md={24}>
                            <Title level={2} className='price'>
                              {salary_range ? salary_range : totalSalary ? `AU$${salaryNumberFormate(totalSalary)}` : ''}
                              {salary_type && <Text className='text-grray'>&nbsp;<span className='dark-color'>{salary_type && salary_type}</span></Text>} 
                            </Title>
                          </Col>
                          <Col md={12}>
                            <div className='dtl-job-content'>
                              <label>Date Posted:</label>
                              <div className='text-detail'>{convertISOToUtcDateformate(today)}</div>
                            </div>
                            <div className='dtl-job-content'>
                              <label>Job Type:</label>
                              <div className='text-detail'>{about_job ? about_job : 'Full Time'}</div>
                            </div>
                          </Col>
                          <Col md={12}>
                          <div className='dtl-job-content'>
                            </div>
                            <div className='dtl-job-content'>
                              <label>Ad Details:</label>
                              <div className='text-detail'>
                                <Button type='default' className='ant-btn automotive-btn'><span>Job</span></Button>
                                <div class='ad-num'><div class='ant-typography text-gray mb-0'>AD No. 3142</div></div> 
                                </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className='right-block'>
                        <Button type='default' className='contact-btn'>
                        {'Contact'}
                        </Button>
                        <Button type='default' className='make-offer-btn'>
                        {'Apply for this job'}
                        </Button>
                        <Button type='default' className='add-wishlist-btn'>
                          <Icon icon='wishlist' size='20' className='active' />
                          Add to Wishlist
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            <div className='wrap-inner less-padding'>
              <Tabs type='card' className={'tab-style3 job-detail-content'}>
                <TabPane tab='Details' key='1' className='job-detail'>
                <Row gutter={[0, 0]}>
                  <Col md={20}>
                    <div className='content-detail-block'>
                        <Title level={4}>Job Description</Title>
                        {<Title level={4} className='sub-title mt-20'>Opportunity!</Title>}
                        <Paragraph className='description'>
                            {convertHTMLToText(attributes.description)}
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
                <TabPane tab='Advertiser' key='3'>
                  <Row className='reviews-content'>
                    <Col span={24}>
                      <div className='reviews-content-left' style={{ paddingRight: 0 }}>
                        <div className='reviews-content-avatar'>
                          <Avatar
                            src={require('../../../assets/images/avatar3.png')}
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
                          <div className='address'>
                            {location}
                          </div>
                        </div>
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
