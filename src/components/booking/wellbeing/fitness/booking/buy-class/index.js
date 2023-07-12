import React, { Fragment } from 'react';
import { Progress, Steps, Calendar, Card, Layout, Typography, Avatar, Tabs, Row, Col, Breadcrumb, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import StepFirst from './Step1';
import StepSecond from './Step2';
import StepThird from './Step3';
const { Title, Text } = Typography
//import StepFirst from './Step1';
//import './postAd.less';

export default class BookingModalContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: this.props.initialStep,
            categoyType: '',
            step1Data: {
                quantity: 1,
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
            },
            step2Data: {
                serviceName: '',
                duration: '',
                price: '',
                amount: ''
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
            this.setState({ current:1, step1Data: reqData });
            console.log('current: 1', current);
        } else if (stepNo === 2) {
            this.setState({ current: 2, step2Data: reqData });
            console.log('current: 2', current);
        } else if (stepNo === 3) {
            this.setState({ step3Data: reqData });
            console.log('current: 3', current);
        }

        // else if (stepNo === 4) {
        //     this.setState({ current: current, step4Data: reqData });
        // }
    }


    render() {
        const { bookingDetail, selectedService, selectedDate } = this.props;
        const { current, step1Data, step2Data, step3Data, step4Data, } = this.state;
        let date = moment(selectedDate, 'dd,DD MMM').add(1, 'days').format('dd,DD MMM YYYY');
        let time = moment(selectedService.start_time, "HH:mm:ss").format("hh:mm A")

        // 
        // 
        // 
        // 
        const mergedStepsData = {
            step1Data, step2Data, step3Data,
        }
        const steps = [
            {
                title: 'Step First',
                content: <StepFirst reqData={step1Data} mergedStepsData={mergedStepsData} nextStep={(reqData, next) => this.next(reqData, next)}  {...this.props} />,
            },
            {
                title: 'Step Second',
                content: <StepSecond step1Data={step1Data} moveBack={() => this.setState({ current: current - 1 })} reqData={step2Data} nextStep={(reqData, next) => this.next(reqData, next)}   {...this.props} />,
            },
            {
                title: 'Step Third',
                content: <StepThird moveBack={() => this.setState({ current: current - 1 })} reqData={step3Data} onstepToOne={() => this.setState({ current: 0 })} mergedStepsData={mergedStepsData} nextStep={(reqData, next) => this.next(reqData, next)}   {...this.props} />,
            },
            // {
            //     title: 'Step Fourth',
            //     content: <StepFourth history={history} mergedStepsData={mergedStepsData} onstepToOne={() => this.setState({ current: 0 })} reqData={step4Data} nextStep={(reqData, next) => this.next(reqData, next)}   {...this.props} />,
            // },

        ];
        const stepProgress = current + 1;
        console.log(current, 'steps[current]: ', steps[current]);
        return (

            <Layout>
                <Layout>
                    <div className='wrap-old  book-now-popup '>

                        <Row>
                            {current !== 2 &&
                                <Fragment>
                                    <Col span={3} >
                                        <div className='product-detail-left'>
                                            <Avatar shape="square" src={bookingDetail.image ? bookingDetail.image : <Avatar size={54} icon={<UserOutlined />} />}
                                                icon={<UserOutlined />} />
                                        </div>
                                    </Col>
                                    <Col span={21} >
                                        <div className='product-detail-right'>
                                            <Title level={2} className='price'>
                                                {bookingDetail.business_name}
                                            </Title>
                                            <Text className="location-text">Location</Text>
                                            <div className='address mb-5'>

                                                <Text>
                                                    {
                                                        bookingDetail && bookingDetail.business_location ? bookingDetail.business_location : ''
                                                    }
                                                </Text>
                                            </div>
                                            <div className='address mb-5'>
                                                <Text>
                                                    {date}  {time}
                                                </Text>
                                            </div>
                                        </div>
                                    </Col>
                                </Fragment>
                            }
                            <Progress size="small" height={12} strokeColor='#f4c482' percent={current !== 3 ? stepProgress * 20 : 100} showInfo={false} />
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