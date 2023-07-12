import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr';
import { MESSAGES } from '../../config/Message';
import { connect } from 'react-redux';
import { Card, Row, Col, Typography, Button, Tabs, Select, Checkbox, Form, Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { subscriptionPlan, enableLoading, disableLoading, setAdPostData, bussinessUserPostAnAd } from '../../actions'
import { langs } from '../../config/localization';
import { postAnAd } from '../../actions/classifieds/PostAd'
import Success from './Success'
import { NavBar } from './CommanMethod'
import { objectToFormData } from 'object-to-formdata';
const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
class Step5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitted: false,
      free: false,
      firstPlan: false,
      secondPlan: false,
      planList: [],
      selectedItem: '',
      planSelect: false,
      planName: '', selectedPlan: '',
      skipped: false
    };
  }

  /**
   * @method componentDidMount
   * @description called after mounting the component
   */
  componentDidMount() {
    this.props.enableLoading()
    this.props.subscriptionPlan(res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = res.data && Array.isArray(res.data.result) ? res.data.result : []
        if (this.props.reqData) {
          const { reqData } = this.props;
          this.setState({ planList: data, selectedItem: reqData,planSelect: true  })
        } else {
          this.setState({ planList: data })
        }
      }
    })
  }

  /**
   * @method onFinish
   * @description handle onsubmit
   */
  onFinish = () => {
    const { step1, attributes, step3, allAttribute, allImages, loggedInDetail, inspection_time } = this.props;
    const { selectedItem, planSelect, planName, selectedPlan, skipped } = this.state
    if (planSelect) {
      this.props.nextStep(selectedPlan);
    }else {
      toastr.warning(langs.warning, 'Please select your plan.');
    }
  };

  /**
   * @method handleFreePlanSelect
   * @description handle free plan selection
   */
  handleFreePlanSelect = () => {
    this.setState({ free: !this.state.free, firstPlan: false, secondPlan: false })
  }

  /**
   * @method handleSelect
   * @description handle card select
   */
  handleSelect = (data) => {
    this.setState({ selectedItem: data.id, selectedPlan: data, planSelect: true, planName: data.package_slug })
  }

  /**
   * @method handleBasicPlanSelect
   * @description handle basic plan selection
   */
  renderCards = (planList) => {
    let custumstyle = { background: '#E3E9EF' }
    let className = ''
    console.log("data");
    console.log(planList);
    if (planList && planList !== undefined) {
      return planList.map((data, i) => {
        if (this.state.selectedItem === data.id) {
          custumstyle = {
            background: '#E3E9EF'
          }
          className = 'premium'
        }
        return (
          <Col span={8}>
            <div key={i} onClick={() => this.handleSelect(data)} className={`package-box package-item-${i + 1} ${className}`}>
              <Card title={data.package_name} bordered={false}
                // extra={data.package_name} 
                style={custumstyle} className={this.state.selectedItem === data.id ? 'selected' : ''}>
                <Title level={2} className='price'>{`$${data.package_price}`}</Title>
                <div className='align-center'>
                  <ul>
                    <li>Up to {data.number_image_upload} photos</li>
                    <li >{data.package_discription}</li>
                  </ul>
                </div>
                <Button type='default'>
                  {this.state.selectedItem === data.id &&
                    <CheckOutlined />
                  }
                  Select
                </Button>
              </Card>
            </div>
          </Col>
        )
      });
    }
  }

  handleSkip = () => {
    this.setState({ skipped: true }, () => this.onFinish())
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isSubmitted, planList } = this.state;
    const { step1 } = this.props
    if (isSubmitted) {
      return <Success visible={isSubmitted} />;
    } else {
      return (
        <Fragment>
          <div className='wrap'>
            <div className='post-ad-box'>
              <div className='' style={{ position: 'relative' }}>
                {NavBar(step1)}
              </div>
              <div className='card-container signup-tab post-add-step-5'>
                <Tabs type='card'>
                  <TabPane
                    tab='Ad Package'
                    key='1'
                  >
                    <Row gutter={16} className='pt-20 pl-10 pr-10 package-box-wrap'>
                      {planList && this.renderCards(planList)}
                    </Row>
                    <div className='align-center mt-40 pb-20'>
                      Your ad will be live for 45 days.<br /> *Based on average results on Cars, Vans category compared to Free ad
                  </div>
                  </TabPane>
                </Tabs>
              </div>
              <div className='box-pro-feature'>
          <p className='pick-text-wrap'>Pick the promotional features below and give your ad a boost.</p>
          <div className='box-pro-inner box-shadow-common'>
              <Row gutter={30}>
                    <Col xs={24} xl={24}>
                      <Card
                        className='dashboard-left-calnder-block'
                       >
                        <div className='keepbox-wrap'>
                        <div className='cardheader-keeps'>
                          <Row gutter={30}>
                            <Col xs={24} md={12} lg={12} xl={12}>
                              <Checkbox>Featured Ad</Checkbox>
                            </Col>
                            <Col xs={24} md={12} lg={12} xl={12} align='right'>
                              <Select defaultValue='$35 (7days)'>
                                <Option value='week'>$45 (15days)</Option>
                                <Option value='month'>$60 (30days)</Option>
                              </Select>
                            </Col>
                          </Row>
                        </div>
                        <Row>
                          <Col className='gutter-row btmkeep-text' md={24}>
                            <p>This keeps your ad at the top of its category. It will appear in a rotation above the search results for several days, helping your ad get noticed by a wider audience.</p>
                          </Col>                         
                        </Row>
                        </div>                        
                      </Card>
                    </Col>
                  </Row>
                  </div>
              </div>
              <div className='box-website-site box-shadow-common'>
              <Row gutter={30}>
                    <Col xs={24} xl={24}>
                      <Card className='dashboard-left-calnder-block'>
                        <div className='keepbox-wrap'>
                        <div className='cardheader-keeps'>
                          <Row gutter={30}>
                            <Col xs={24} md={12} lg={12} xl={12}>
                              <Checkbox>Link to your website for $5</Checkbox>
                            </Col>                            
                          </Row>
                        </div>
                        <Row>
                          <Col className='gutter-row btmkeep-text' md={24}>
                            <Form
                                layout='vertical'
                                onFinish={this.onFinish}
                                >
                                <Form.Item
                                    name='fname'
                                >
                                    <Input className='inputcstm' size='large' placeholder='http://www.' />
                                </Form.Item>
                            </Form>
                          </Col>                         
                        </Row>
                        </div>                        
                      </Card>
                    </Col>
                  </Row>
              </div><div className='steps-action flex align-center mb-32'>
                <Button type='primary' htmlType='submit' danger onClick={this.onFinish}>
                  LET'S GO!
            </Button>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
  }
}

const mapStateToProps = (store) => {
  const { auth, postAd } = store;
  const { step1, attributes, step3, step4, allImages, setAdPostData, step2 } = postAd;

  return {
    loggedInDetail: auth.loggedInUser,
    step1,
    attributes: attributes.attributevalue,
    allAttribute: attributes,
    step3,
    step4,
    allImages,
    inspection_time: attributes.inspection_time
  };
};

export default connect(mapStateToProps, { postAnAd, subscriptionPlan, enableLoading, disableLoading, setAdPostData, bussinessUserPostAnAd })(Step5);
