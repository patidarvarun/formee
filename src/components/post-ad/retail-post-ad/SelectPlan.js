import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr';
import { MESSAGES } from '../../../config/Message';
import { connect } from 'react-redux';
import { Card, Row, Col, Typography, Button, Tabs } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import {bussinessUserPostAnAd, subscriptionPlan, enableLoading, disableLoading, setAdPostData, retailPostanAdAPI } from '../../../actions'
import { langs } from '../../../config/localization';
import { postAnAd } from '../../../actions/classifieds/PostAd'
import Success from '../Success'
import { RetailNavBar } from '../CommanMethod'
const { Title } = Typography;
const { TabPane } = Tabs;

class SelectPlan extends React.Component {
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
          this.setState({ planList: data, selectedItem: reqData })
          
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
    const { step1, attributes, step3, allAttribute, allImages, loggedInDetail,inspection_time } = this.props;
    const { selectedItem, planSelect, planName,selectedPlan,skipped } = this.state
    
    const requestData = {
      attributes,
      user_id: step3.user_id,
      contact_email: step3.contact_email,
      contact_name: step3.contact_name,
      hide_mob_number: step3.hide_mob_number ? step3.hide_mob_number : 0,
      state_id: step3.state_id ? step3.state_id : '',
      lng: step3.lng ? step3.lng : 151.2092955,
      lat: step3.lat ? step3.lat : -33.8688197,
      quantity: 1,
      description: allAttribute.description,
      title: allAttribute.title,
      location: step3.location ? step3.location : '',
      subregions_id: step3.subregions_id ? step3.subregions_id : '',
      parent_categoryid: step1.parent_categoryid,
      category_id: step1.category_id,
      child_category_id :step1.category_id,
      contact_mobile: step3.contact_mobile,
      package_id: selectedItem,
      fileList: allImages.fileList,
      price:allAttribute.price,

      brand_name : allAttribute.brand_name,
      other_notes: allAttribute.other_notes,
      features :allAttribute.features,
      condition : allAttribute.condition,
      brand : allAttribute.brand,
      shipping: allAttribute.shipping ? allAttribute.shipping : 0,
      inventory_attributes:allAttribute.inventory_attributes,

      weight_unit:'grams',
      GST_tax_percent :10.5,
      is_premium_parent_cat :0,
      formee_commision_tax_amount :0.0,
      pay_pal: 'on',
      weight :10.0,
      price_type :'amount',
      is_premium_sub_cat :0,
      GST_tax_amount :10,
      classified_type :'Normal',
      formee_commision_tax_percent :10.0,
      has_weight :0,
      has_dimension :0,
      length_unit:'Inch',
      width:0.0,
      // inventory_attributes:[{"quantity":10}],
      // user_id :482
    };
    
    if (loggedInDetail.user_type !== langs.key.private) {
      requestData.contact_title = step3.contact_name
      requestData.classified_type = step3.classified_type ? step3.classified_type : ''
      requestData.membership_plan_user_id = step3.membership_plan_user_id ? step3.membership_plan_user_id : ''
    }
    const formData = new FormData()
    Object.keys(requestData).forEach((key) => {
      if (typeof requestData[key] == 'object' && key !== 'fileList') {
        formData.append(key, JSON.stringify(requestData[key]))
      } else if (key === 'fileList') {
        let data = []
        requestData[key].length && requestData[key].map((e, i) => {
          
          
          formData.append(`image${i + 1}`, requestData[key][i].originFileObj);
        })
      } else {
        formData.append(key, requestData[key])
      }
    })

    

    if (planSelect || skipped) {
      this.props.enableLoading()
      if (loggedInDetail.user_type !== langs.key.private) {
        
        this.props.retailPostanAdAPI(formData, (res) => {
          // this.props.bussinessUserPostAnAd(formData, (res) => {
          this.props.disableLoading()
          if (res.status === 200) {
            toastr.success(langs.success, MESSAGES.POST_ADD_SUCCESS);
            let data = {
              hide_mob_number: false,
            }
            this.props.setAdPostData(data, 'preview');
            if(!skipped){
              if (planName === 'Free') {
                this.setState({ isSubmitted: true });
              } else {
                this.props.nextStep(res, selectedPlan);
              }
            }else {
              this.props.history.push('/')
            }
          }
        });
      } 
    } else if(!skipped){
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
    this.setState({skipped: true}, () => this.onFinish())
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
                {RetailNavBar(step1)}
                  <Link  className="skip-link uppercase" onClick={this.handleSkip}>
                    Skip
                  </Link>
              </div>
              <div className='card-container signup-tab'>
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
              <div className='steps-action flex align-center mb-32'>
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

export default connect(mapStateToProps, {bussinessUserPostAnAd, postAnAd, subscriptionPlan, enableLoading, disableLoading, setAdPostData, retailPostanAdAPI })(SelectPlan);
