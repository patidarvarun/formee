import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  Progress,
  Steps,
  Calendar,
  Card,
  Layout,
  Typography,
  Avatar,
  Tabs,
  Row,
  Col,
  Breadcrumb,
  Form,
  Carousel,
  Input,
  Select,
  Checkbox,
  Button,
  Rate,
  Modal,
  Dropdown,
  Divider,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import StepFirst from "./Step1";
import StepSecond from "./Step2";
import StepThird from "./Step3";
import StepFourth from "./Step4";
import history from "../../../../../common/History";

const { Title, Text } = Typography;

//import StepFirst from './Step1';
//import './postAd.less';

export default class BookingModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.initialStep,
      categoyType: "",
      step1Data: {
        bookingDate: "",
        bookingTimeSlot: "",
        appliedPromoCode: "",
        promoCodeDiscount: "",
        additionalComments: "",
        traderProfileId: "",
        customerId: "",
        serviceIds: "",
        serviceBookingId: "",
        selectedTimeIndex: "",
        amTimeSlotArray: [],
        pmTimeSlotArray: [],
        appliedPromoCodeId: "",
        discountAmount: 0,
      },
      step2Data: {
        serviceName: "",
        duration: "",
        price: "",
        amount: "",
      },
      step3Data: {
        contactName: "",
        email: "",
        phoneNumber: "",
        phoneCode: "",
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

  render() {
    const { bookingDetail, selectedSpaService } = this.props;
    const { current, step1Data, step2Data, step3Data, step4Data } = this.state;
    //
    //
    //
    //
    const mergedStepsData = {
      step1Data,
      step2Data,
      step3Data,
    };
    const steps = [
      {
        title: "Step First",
        content: (
          <StepFirst
            reqData={step1Data}
            nextStep={(reqData, next) => this.next(reqData, next)}
            {...this.props}
          />
        ),
      },
      {
        title: "Step Second",
        content: (
          <StepSecond
            reqData={step2Data}
            mergedStepsData={mergedStepsData}
            nextStep={(reqData, next) => this.next(reqData, next)}
            {...this.props}
          />
        ),
      },
      {
        title: "Step Third",
        content: (
          <StepThird
            reqData={step3Data}
            nextStep={(reqData, next) => this.next(reqData, next)}
            {...this.props}
          />
        ),
      },
      {
        title: "Step Fourth",
        content: (
          <StepFourth
            history={history}
            mergedStepsData={mergedStepsData}
            onstepToOne={() => this.setState({ current: 0 })}
            reqData={step4Data}
            nextStep={(reqData, next) => this.next(reqData, next)}
            {...this.props}
          />
        ),
      },
    ];
    const stepProgress = current + 1;

    return (
      <Layout>
        <Layout>
          <div className="wrap-old  book-now-popup caterers-event">
            <Row>
              {current !== 3 && (
                <Fragment>
                  <Col span={4} className="custom-width">
                    <div className="product-detail-left">
                      <Avatar
                        shape="square"
                        src={
                          bookingDetail.image ? (
                            bookingDetail.image
                          ) : (
                            <Avatar size={54} icon={<UserOutlined />} />
                          )
                        }
                        icon={<UserOutlined />}
                      />
                    </div>
                  </Col>
                  <Col span={20}>
                    <div className="product-detail-right">
                      <Title level={2} className="price">
                        {bookingDetail.business_name}
                      </Title>
                      <Text className="location-text">Location</Text>
                      <div className="address mb-5">
                        <Text>
                          {bookingDetail && bookingDetail.business_location
                            ? bookingDetail.business_location
                            : ""}
                        </Text>
                      </div>
                    </div>
                  </Col>
                </Fragment>
              )}
              <Progress
                className="pt-30"
                size="small"
                height={12}
                strokeColor="#f4c482"
                percent={current !== 3 ? stepProgress * 20 : 100}
                showInfo={false}
              />
            </Row>

            <div className="steps-content clearfix">
              {steps[current].content}
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}
