import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Card, Layout, Typography, Row, Col, Button, Divider, Anchor, Upload } from 'antd';
import { requestTraderBooking, enableLoading, disableLoading } from '../../../../actions';
import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import { DEFAULT_IMAGE_CARD } from '../../../../config/Config';
import { convertTime12To24Hour, convertTime24To12Hour } from '../../../common'

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
      contact_name: step3Data.name,
      location: step3Data.location,
      city:step3Data.city ? step3Data.city : 'indore',
      state:step3Data.state ? step3Data.state : 'indore',
      lng: step3Data.lng ? step3Data.lng : 151.2092955,
      lat: step3Data.lat ? step3Data.lat : -33.8688197, 
      pincode:step3Data.pincode,
      phone_number: step3Data.phone_number,
      title: step2Data.title,
      hours:step2Data.hours,
      quote_value: step2Data.quote_value,
      description: step2Data.description,
      images: enquiryImageArray,
      date: moment(step1Data.booking_date).format('YYYY-MM-DD'),
      from: step1Data && step1Data.selectedItem.length !== 0 && convertTime12To24Hour(step1Data.selectedItem[0]),
      to: step1Data && step1Data.selectedItem.length !== 0 && convertTime12To24Hour(step1Data.selectedItem[step1Data.selectedItem.length-1]),
      customer_user_id: loggedInDetail.id,
      trader_user_id: bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.user_id,
      booking_cat_id: bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.booking_cat_id,
      booking_sub_cat_id: bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.booking_sub_cat_id,
      payment_method:'paypal',
      suburb:'Gulberg',
      discount_amount:0
    }

    Object.keys(reqData).forEach((key) => {
      formData.append(key, reqData[key])
    });
    this.props.requestTraderBooking(formData, (res) => {
      
      if (res.status === 200 && res.data.success) {
        toastr.success('Your request has been send successfully');
        this.props.onCancel();
      }else if(res.data){
        toastr.error(res.data.message)
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
    let price = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.rate_per_hour ? bookingDetail.trader_profile.rate_per_hour : 0
    let total = Number(price)*Number(step2Data.hours)
    let subcatName = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.trader_service && bookingDetail.trader_profile.trader_service.name
    return (
      <Layout>
        <Layout>
          <Layout className="step-fourth-block">
            <Row gutter={[20, 20]}>
              <Col span={14} className="mt-10" >
                <Title level={4}>Your booking details</Title>
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
                        <div className="title">Date:</div>
                        <div className="sub-title-detail">{moment(step1Data.booking_date, 'DD-MM-YYYY').format("dddd, MMMM Do YYYY")}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Time:</div>
                        <div className="sub-title-detail"> {step1Data && step1Data.selectedItem.length !== 0 && `${step1Data.selectedItem[0].toLowerCase()} - ${step1Data.selectedItem[step1Data.selectedItem.length-1].toLowerCase()}` }</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Request Booking:</div>
                        <div className="sub-title-detail">{`${step1Data.hours} hours`}</div>
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
                      <Text><b>Upload Photos:</b></Text>
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
                    </Col>
                  </Row>
                  <Divider/>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Contact Name:</div>
                        <div className="sub-title-detail">{step3Data.name}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Address:</div>
                        <div className="sub-title-detail">{step3Data.location}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Phone Number:</div>
                        <div className="sub-title-detail">{step3Data.phone_number}</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={10} className="mt-10" >
                <Title level={4}>Your Price Summary</Title>
                <Card>
                  <Row gutter={15}>
                    <Col md={18}>
                      <div className="title-sub-title-detail">
                        <div className="sub-title-detail">Service {step2Data.hours} hrs x ${bookingDetail.trader_profile && bookingDetail.trader_profile.rate_per_hour ? bookingDetail.trader_profile.rate_per_hour : ''} </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="title-sub-title-detail">
                        <div className="sub-title-detail">{total ? total : `$${total}`}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={18}>
                      <div className="title-sub-title-detail">
                        <div className="sub-title-detail">Taxes and surcharges</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="title-sub-title-detail">
                        <div className="sub-title-detail">$0.00</div>
                      </div>
                    </Col>
                  </Row>
                  <Divider/>
                  <Row gutter={15}>
                    <Col md={18}>
                      <div className="title-sub-title-detail">
                        <div className="title">Total</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="title-sub-title-detail">
                        <div className="sub-title-detail">{total ? `$${total}` : `$0.00`}</div>
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
  mapStateToProps, { requestTraderBooking, enableLoading, disableLoading }
)(withRouter(Step4));