import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Progress, Steps, Calendar, Card, Layout, Typography, Avatar, Tabs, Row, Col, Breadcrumb, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ViewRestaurantCart from './ViewRestaurantCart';
import CheckoutStep1 from './CheckoutStep1';
import CheckoutStep2 from './CheckoutStep2';
import history from '../../../../common/History';

const { Title, Text } = Typography


export default class RestaurentCartChekoutProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.initialStep,
      categoyType: '',
      step1Data: {
        tableSourceArray: props.step1Data ? props.step1Data.tableSourceArray : [],
        restaurantCartItems: props.step1Data ? props.step1Data.restaurantCartItems : [],
        sub_total: props.step1Data ? props.step1Data.sub_total : '',
        gst_amount: props.step1Data ? props.step1Data.gst_amount : '',
        cart_discounted_grand_total: props.step1Data ? props.step1Data.cart_discounted_grand_total : '',
        cart_grand_total: props.step1Data ? props.step1Data.cart_grand_total : '',
        is_promo_applied: props.step1Data ? props.step1Data.is_promo_applied : '',
        service_type: props.step1Data ? props.step1Data.service_type : ''
      },
      step2Data: {
        name: '',
        phone_number: '',
        additional_note: '',
        address_id: '',
        userAddressesList: []
      },
      step3Data: {
      },
    };
  }



  /**
  * @method next
  * @description called to go next step
  */
  next(reqData, stepNo) {
    const current = this.state.current + 1;
    if (stepNo === 1) {
      this.setState({ current, step1Data: reqData });
    } else if (stepNo === 2) {
      this.setState({ current: current, step2Data: reqData });
    } else if (stepNo === 3) {
      this.setState({ current: current, step3Data: reqData });
    }
  }


  render() {
    const { restaurantDetail } = this.props;
    const { current, step1Data, step2Data, step3Data, } = this.state;
    //
    const mergedStepsData = {
      step1Data, step2Data, step3Data,
    }
    const steps = [

      {
        title: 'Step First',
        content: <ViewRestaurantCart reqData={step1Data} nextStep={(reqData, next) => this.next(reqData, next)}  {...this.props} />,
      },
      {
        title: 'Step Second',
        content: <CheckoutStep1 mergedStepsData={mergedStepsData} reqData={step2Data} nextStep={(reqData, next) => this.next(reqData, next)}   {...this.props} />,
      },

      {
        title: 'Step Third',
        content: <CheckoutStep2 history={history} mergedStepsData={mergedStepsData} reqData={step3Data} nextStep={(reqData, next) => this.next(reqData, next)}   {...this.props} />,
      },
    ];
    const stepProgress = current + 1;

    return (
      <Layout>
        <Layout>
          <div className='wrap-old  book-now-popup'>
            <Row>
              {current !== 0 &&
                <Fragment>
                  <Col span={4} >
                    <div className='product-detail-left'>
                      <Avatar shape="square" src={restaurantDetail.cover_photo ? restaurantDetail.cover_photo : <Avatar size={54} icon={<UserOutlined />} />}
                        icon={<UserOutlined />} />
                    </div>
                  </Col>
                  <Col span={20} >
                    <div className='product-detail-right'>
                      <Title level={2} className='price'>
                        {restaurantDetail.business_name ? restaurantDetail.business_name : 'N/A'}
                      </Title>
                      <Text className="location-text">Location</Text>
                      <div className='address mb-5'>
                        <Text>{restaurantDetail && restaurantDetail.address ? restaurantDetail.address : ''}</Text>
                      </div>
                    </div>
                  </Col>
                </Fragment>
              }
              {current !== 0 && <Progress className="pt-30" size="small" height={12} strokeColor='#f4c482' percent={current !== 2 ? stepProgress * 20 : 100} showInfo={false} />}
            </Row>
            <div className='steps-content clearfix'>
              {steps[current].content}
            </div>
          </div>
        </Layout>
      </Layout>
    )
  }
}