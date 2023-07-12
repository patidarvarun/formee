import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Progress, Steps, Calendar, Card, Layout, Typography, Avatar, Tabs, Row, Col, Breadcrumb, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import StepFirst from './Step1';
import StepSecond from './Step2';
import StepThird from './Step3';
import StepFourth from './Step4';
import history from '../../../../common/History';

const { Title, Text } = Typography

export default class RequestQuote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.initialStep,
      categoyType: '',
      step1Data: {
        bookingDate: '',
        bookingTimeSlot: '',
        appliedPromoCode: '',
        promoCodeDiscount: '',
        additionalComments: '',
        traderProfileId: '',
        customerId: '',
        serviceIds: '',
        serviceBookingId: '',
        selectedTimeIndex: '',
        amTimeSlotArray: [],
        pmTimeSlotArray: [],
        appliedPromoCodeId: '',
        discountAmount: '',
        selectedItem:[],
        hours:''
    },
      step2Data: {
        event_name: '',
        quote_value: '',
        enquiry_images: [],
      },
      step3Data: {
        date: '',
        from: '',
        to: '',
        hours:''
      },
      step4Data: {},
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
    } else if (stepNo === 4) {
      this.setState({ current: current, step4Data: reqData });
    }
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }


  render() {
    const { bookingDetail } = this.props;
    const { current, step1Data, step2Data, step3Data, step4Data, } = this.state;
    // 
    //
    // 

    const mergedStepsData = {
      step1Data, step2Data, step3Data,
    }

    const steps = [

      {
        title: 'Step First',
        content: <StepFirst reqData={step1Data}  mergedStepsData={mergedStepsData} nextStep={(reqData, next) => this.next(reqData, next)}  {...this.props} />,
      },
      {
        title: 'Step Second',
        content: <StepSecond preStep={() => this.prev()} mergedStepsData={mergedStepsData} reqData={step2Data} nextStep={(reqData, next) => this.next(reqData, next)}   {...this.props} />,
      },

      {
        title: 'Step Third',
        content: <StepThird preStep={() => this.prev()} mergedStepsData={mergedStepsData} reqData={step3Data} nextStep={(reqData, next) => this.next(reqData, next)}   {...this.props} />,
      },
      {
        title: 'Step Fourth',
        content: <StepFourth preStep={() => this.prev()} history={history} mergedStepsData={mergedStepsData} onstepToOne={() => this.setState({ current: 0 })} reqData={step4Data} nextStep={(reqData, next) => this.next(reqData, next)}   {...this.props} />,
      }

    ];

    const stepProgress = current + 1;
    return (
      <Layout>
        <Layout>
          <div className='wrap-old book-now-popup boo caterers-event-enquires-m3'>
            <Row>
              {current !== 3 &&
                <Fragment>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Text className="sub-heading"> This request will be sent to:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={15} lg={15}>
                    <div className='product-detail-left'>
                      <Avatar shape="square" src={bookingDetail.image ? bookingDetail.image : <Avatar size={54} icon={<UserOutlined />} />}
                        icon={<UserOutlined />} />
                      <Title level={2} className='price'>
                        {bookingDetail.business_name}
                      </Title>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={9} lg={9}>
                    <div className='product-detail-right'>
                      <Text> (Member since {moment(bookingDetail.trader_profile.created_at).format("MMMM YYYY")} ) </Text>
                    </div>
                  </Col>
                </Fragment>
              }
              <Progress className="pt-30" size="small" height={12} strokeColor='#f4c482' percent={current !== 3 ? stepProgress * 20 : 100} showInfo={false} />
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