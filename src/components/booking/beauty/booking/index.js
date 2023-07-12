import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Progress, Steps, Calendar, Card, Layout, Typography, Avatar, Tabs, Row, Col, Breadcrumb, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import StepFirst from './Step1';
import StepSecond from './Step2';
import StepThird from './Step3';
import StepFourth from './Step4';
import history from '../../../../common/History';
import moment from 'moment';
import { convertTime24To12Hour } from '../../../common'
const { Title, Text } = Typography

export default class BeautyBookingModalContent extends React.Component {
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
        selectedTimeIndex: '',
        amTimeSlotArray: [],
        pmTimeSlotArray: [],
        appliedPromoCodeId: '',
        selectedServiceSumTotal: 0
      },
      step2Data: {
        serviceName: '',
        duration: '',
        price: '',
        amount: '',
        serviceBookingId: ''
      },
      step3Data: {
        contactName: '',
        email: '',
        phoneNumber: '',
        phoneCode: ''
      },
      step4Data: {

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
    } else if (stepNo === 4) {
      this.setState({ current: current, step4Data: reqData });
    }
  }

  renderSelectedDate = (current, step1Data) => {
    if (current === 1 || current === 2) {
      return <Fragment>
        <Text className="location-text">Selected Date</Text>
        <div className='address'>
          <Text>
            {step1Data && step1Data.bookingDate && step1Data.bookingTimeSlot && moment(step1Data.bookingDate).format("ddd, MMM Do YYYY")} {convertTime24To12Hour(step1Data.bookingTimeSlot)}
          </Text>
        </div>
      </Fragment>
    }
  }

  render() {
    const { bookingDetail } = this.props;
    const { current, step1Data, step2Data, step3Data, step4Data, } = this.state;
    const mergedStepsData = {
      step1Data, step2Data, step3Data,
    }
    const steps = [
      {
        title: 'Step First',
        content: <StepFirst reqData={step1Data} nextStep={(reqData, next) => this.next(reqData, next)}  {...this.props} />,
      },
      {
        title: 'Step Second',
        content: <StepSecond reqData={step2Data} mergedStepsData={mergedStepsData} nextStep={(reqData, next) => this.next(reqData, next)} moveBack={() => this.setState({ current: current - 1 })} {...this.props} />,
      },
      {
        title: 'Step Third',
        content: <StepThird reqData={step3Data} mergedStepsData={mergedStepsData} nextStep={(reqData, next) => this.next(reqData, next)} moveBack={() => this.setState({ current: current - 1 })} {...this.props} />,
      },
      {
        title: 'Step Fourth',
        content: <StepFourth history={history} mergedStepsData={mergedStepsData} onstepToOne={() => this.setState({ current: 0 })} reqData={step4Data} nextStep={(reqData, next) => this.next(reqData, next)} moveBack={() => this.setState({ current: current - 1 })} {...this.props} />,
      },

    ];
    const stepProgress = current + 1;
    return (
      <Layout>
        <Layout>
          <div className='wrap-old book-now-popup caterers-event'>
            <Row>
              <Col md={24}>
                {current !== 3 &&
                  <div className='user-detail-box'>
                    <div className='product-detail-left'>
                      <Avatar shape="square" src={bookingDetail.image ? bookingDetail.image : <Avatar size={54} icon={<UserOutlined />} />}
                        icon={<UserOutlined />} />
                    </div>
                    <div className='product-detail-right'>
                      <Title level={4} className='title'>
                        {bookingDetail.business_name}
                      </Title>
                      <Text className="location-text">Location</Text>
                      <div className='address'>
                        <Text>{bookingDetail && bookingDetail.business_location ? bookingDetail.business_location : ''}</Text>
                      </div>
                      {this.renderSelectedDate(current, step1Data)}
                    </div>
                  </div>
                }
                <Progress className={current !== 3 ? 'pt-30' : 'pt-0'} size="small" height={12} strokeColor='#f4c482' percent={current !== 3 ? stepProgress * 20 : 100} showInfo={false} />
              </Col>
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
