import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Card, Layout, Typography, Row, Col, Button, Divider, Anchor, Upload } from 'antd';
import { createRequestQuote, enableLoading, disableLoading } from '../../../../actions';
import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import { DEFAULT_IMAGE_CARD } from '../../../../config/Config';
import { convertTime24To12Hour,convertTime12To24Hour} from '../../../common';

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;
class Step4 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedCusine: '',
      selectedEventName: '',
      selectedDietary: [],
    }
  }


  /**
  * @method sendRequestQuote
  * @description send request quote
  */
  sendRequestQuote = () => {
    const { loggedInDetail,bookingDetail } = this.props
    const { step1Data, step2Data, step3Data } = this.props.mergedStepsData;
    let formData = new FormData();
    let enquiryImageArray = [];
    Array.isArray(step2Data.images) && step2Data.images.filter((el) => {
      el.originFileObj && enquiryImageArray.push(el.originFileObj)
    })
    let reqData = {
      contact_name: step1Data.name,
      location: step1Data.location,
      city:step1Data.city ? step1Data.city : 'indore',
      state:step1Data.state ? step1Data.state : 'indore',
      lng: step1Data.lng ? step1Data.lng : 151.2092955,
      lat: step1Data.lat ? step1Data.lat : -33.8688197, 
      pincode:step1Data.pincode,
      phone_number: step1Data.phone_number,
      title: step2Data.title,
      hours:step3Data.hours,
      need_job_done: step3Data.need_job_done,
      quote_value: step2Data.quote_value,
      description: step2Data.description,
      images: enquiryImageArray,
      date: moment(step3Data.date).format('YYYY-MM-DD'),
      from: convertTime12To24Hour(step3Data.from),
      to: convertTime12To24Hour(step3Data.to),
      customer_user_id: loggedInDetail.id,
      trader_user_id: bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.user_id,
      booking_cat_id: bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.booking_cat_id,
      booking_sub_cat_id: bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.booking_sub_cat_id 
    }

    Object.keys(reqData).forEach((key) => {
      formData.append(key, reqData[key])
    });
    this.props.enableLoading()
    this.props.createRequestQuote(formData, (res) => {
      this.props.disableLoading()
      
      if (res.status === 200) {
        toastr.success('Your request has been send successfully');
        this.props.onCancel();
      }
    })
  }

  /**
  * @method render
  * @description render component
  */
  render() {
    const { mergedStepsData, bookingDetail, subCategoryName } = this.props;
    const { step1Data, step2Data, step3Data } = mergedStepsData;
    let subcatName = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.trader_service && bookingDetail.trader_profile.trader_service.name
    return (
      <Layout>
        <Layout>
          <Layout className="step-fourth-block">
            <Row gutter={[20, 20]}>
              <Col span={24} className="mt-10" >
                <Title level={4}>Your job details</Title>
                <Card>
                  <div className="thumb-title-block">
                    <div className='slide-content'>
                      <img src={bookingDetail.image ? bookingDetail.image : DEFAULT_IMAGE_CARD} alt='' />
                    </div>
                    <div className='fm-user-details inner-fourth'>
                      <Title level={4}>{bookingDetail.business_name}</Title>
                      <Text className='category-type'>
                        {subcatName}
                      </Text>
                      <Text className='fm-location'>{bookingDetail && bookingDetail.business_location ? bookingDetail.business_location : 'N/A'}</Text>
                    </div>
                  </div>

                  <Divider />
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Contact Name:</div>
                        <div className="sub-title-detail">{step1Data.name}</div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">When do you need the job done ?</div>
                        <div className="sub-title-detail">{moment(step3Data.date, 'DD-MM-YYYY').format("dddd, MMMM Do YYYY")}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Address:</div>
                        <div className="sub-title-detail">{step1Data.location}</div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">What time are available for you ?</div>
                        <div className="sub-title-detail">{convertTime24To12Hour(step3Data.from)} - {convertTime24To12Hour(step3Data.to)}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Phone Number:</div>
                        <div className="sub-title-detail">{step1Data.phone_number}</div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Duration:</div>
                        <div className="sub-title-detail">{`${step3Data.hours} hours`}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Job Type:</div>
                        <div className="sub-title-detail">{subcatName}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Task Details:</div>
                        <div className="sub-title-detail">{step2Data.description}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={24}>
                      <div className="title-sub-title-detail">
                        <div className="title">Photos:</div>
                        <Upload
                          name='enquiry_images'
                          listType='picture-card'
                          className='avatar-uploader'
                          showUploadList={true}
                          fileList={step2Data.images}
                          customRequest={this.dummyRequest}
                          onChange={this.handleImageUpload}
                          id='fileButton'
                        />
                      </div>
                    </Col>
                  </Row>

                </Card>
              </Col>
              <div className='steps-action '>
                <Button onClick={() => { this.props.preStep() }} type='primary' size='middle' className='btn-trans fm-btn' >Back</Button>
                <Button onClick={() => { this.sendRequestQuote() }} type='primary' size='middle' className='btn-blue fm-btn' >Send</Button>
              </div>
            </Row>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser
  };
};

export default connect(
  mapStateToProps, { createRequestQuote, enableLoading, disableLoading }
)(withRouter(Step4));