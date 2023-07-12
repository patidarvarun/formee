import React, { Fragment } from 'react';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { Card, Row, Col, Typography, Button, Tabs } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import {updatePostAdAPI, subscriptionPlan, enableLoading, disableLoading, setAdPostData, bussinessUserPostAnAd } from '../../../actions';
import '../postAd.less';
import { postAnAd } from '../../../actions/classifieds/PostAd'

const { Title } = Typography;
const { TabPane } = Tabs;

class MemberShipPlan extends React.Component {
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
    const { reqData } = this.props
    let catId = this.props.match.params.adId
    const { selectedItem,selectedPlan } = this.state
    const formData = new FormData()
    Object.keys(reqData).forEach((key) => {
        if (typeof reqData[key] == 'object' && key !== 'fileList') {
            formData.append(key, JSON.stringify(reqData[key]))
        } else if (key === 'fileList') {
            let data = []
            reqData[key].length && reqData[key].map((e, i) => {
            
            
            formData.append(`image${i + 1}`, reqData[key][i].originFileObj);
            })
        } else {
            formData.append(key, reqData[key])
        }
    })
    formData.append('package_user_id',selectedItem )
    this.props.enableLoading()
    this.props.updatePostAdAPI(formData, res => {
        this.props.disableLoading()
        if(res.status === 200){
            toastr.success('success', 'Your post has been updated successfully')
            this.props.nextStep(catId,selectedItem,selectedPlan);
        }
    })
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
    
      return (
        <Fragment>
          <div className='wrap'>
            <div className='post-ad-box'>
              {/* <div className='' style={{ position: 'relative' }}>
                  <Link  className='skip-link uppercase' onClick={this.handleSkip}>
                    Skip
                  </Link>
              </div> */}
              <div className='card-container signup-tab'>
                <Tabs type='card'>
                  <TabPane
                    tab='Ad Package'
                    key='1'
                  >
                    <Row gutter={16} className='pt-20 pl-10 pr-10 -wrap'>
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

const mapStateToProps = (store) => {
  const { auth, postAd } = store;
  return {
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, {updatePostAdAPI, postAnAd, subscriptionPlan, enableLoading, disableLoading, setAdPostData, bussinessUserPostAnAd })(MemberShipPlan);
