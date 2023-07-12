import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Card, Layout, Typography, Row, Col, Button, Divider, Anchor, Upload } from 'antd';
import { sendEventEnquiry } from '../../../../../actions';
import moment from 'moment';
import { toastr } from 'react-redux-toastr'
import { DEFAULT_IMAGE_CARD } from '../../../../../config/Config';
import { convertTime24To12Hour } from '../../../../common';

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

  componentDidMount() {
    const { mergedStepsData } = this.props;
    const { step2Data, step3Data } = mergedStepsData;
    let matchedEventName = step2Data.eventTypes.filter(el => el.id === step2Data.event_type_id);
    let selectedEventName = matchedEventName.length > 0 ? matchedEventName[0].name : 'N/A';

    let matchedCusine = step3Data.cusinesArray.filter(el => el.id === step3Data.cusine);
    let selectedCusine = matchedCusine.length > 0 ? matchedCusine[0].name : 'N/A';

    let nameOfDietary = step2Data.dietaries.filter(g => step3Data.dietary.includes(g.id)).map(g => g.name);
    this.setState({ selectedCusine: selectedCusine, selectedEventName: selectedEventName, selectedDietary: nameOfDietary })
  }

  sendEnquiry = () => {
    const { selectedCusine, selectedDietary } = this.state;
    const { step1Data, step2Data, step3Data } = this.props.mergedStepsData;
    let formData = new FormData();
    let enquiryImageArray = [];
    const { subCategoryName } = this.props
    Array.isArray(step2Data.enquiry_images) && step2Data.enquiry_images.filter((el) => {
      el.originFileObj && enquiryImageArray.push(el.originFileObj)
    })
    let reqData = {
      name: step1Data.name,
      email: step1Data.email,
      phone_number: step1Data.phone_number,
      event_name: step2Data.event_name,
      quote_value: step2Data.quote_value,
      event_type_id: step2Data.event_type_id,
      venue_of_event: step2Data.venue_of_event && step2Data.venue_of_event !== '' ? step2Data.venue_of_event : step2Data.other_address,
      additional_comments: step2Data.additional_comments,
      enquiry_images: enquiryImageArray,
      booking_date: moment(step3Data.booking_date, 'DD-MM-YYYY').format('DD/MM/YYYY'),
      start_time: subCategoryName !== 'Venues' && subCategoryName !== 'Caterers' ? step3Data.time : step3Data.start_time,
      end_time: subCategoryName !== 'Venues' && subCategoryName !=='Caterers' ? moment(step3Data.time, 'HH:mm:ss').add('120', 'minutes').format('HH:mm') : step3Data.end_time ,
      time: step3Data.time,
      no_of_people: step3Data.no_of_people,
      dietary: selectedDietary,
      cusine: selectedCusine,
      trader_user_id: this.props.bookingDetail.trader_profile.user_id,
      looking_for: subCategoryName
    }

    Object.keys(reqData).forEach((key) => {
      formData.append(key, reqData[key])
    });
    this.props.sendEventEnquiry(formData, (res) => {
      if (res.status === 200) {
        toastr.success('Enquiry has been posted successfully');
        this.props.hideCaterersEnquireModal();
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
    const { selectedEventName, selectedCusine, selectedDietary } = this.state;
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
                        {subCategoryName}
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
                        <div className="title">{subCategoryName !== 'Venues' && subCategoryName !== 'Caterers' ? 'Date:' : 'Requesting Date:'}</div>
                        <div className="sub-title-detail">{moment(step3Data.booking_date, 'DD-MM-YYYY').format("dddd, MMMM Do YYYY")}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Email Address:</div>
                        <div className="sub-title-detail">{step1Data.email}</div>
                      </div>
                    </Col>
                    {(subCategoryName === 'Venues' || subCategoryName === 'Caterers') && <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Requesting Time:</div>
                        <div className="sub-title-detail">{convertTime24To12Hour(step3Data.start_time)} - {convertTime24To12Hour(step3Data.end_time)}</div>
                      </div>
                    </Col>}
                    {subCategoryName !== 'Venues' && subCategoryName !== 'Caterers' && <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Time to be ready:</div>
                        <div className="sub-title-detail">{convertTime24To12Hour(step3Data.time)}</div>
                      </div>
                    </Col>}
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Phone Number:</div>
                        <div className="sub-title-detail">{step1Data.phone_number}</div>
                      </div>
                    </Col>
                    {(subCategoryName === 'Venues' || subCategoryName === 'Caterers') && <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">No of Guests:</div>
                        <div className="sub-title-detail">{step3Data.no_of_people}</div>
                      </div>
                    </Col>}
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Event Type:</div>
                        <div className="sub-title-detail">{selectedEventName}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">{subCategoryName !== 'Venues' && subCategoryName !=='Caterers' ? 'Venues:' : 'Preferred Venue'}</div>
                        <div className="sub-title-detail">{step2Data.venue_of_event && step2Data.venue_of_event !== '' ? step2Data.venue_of_event : step2Data.other_address}</div>
                      </div>
                    </Col>
                    {/* <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Dietary required:</div>
                        <div className="sub-title-detail">{selectedDietary.toString()}</div>
                      </div>
                    </Col> */}
                  </Row>
                  <Row gutter={15}>
                    <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">{subCategoryName !== 'Venues' && subCategoryName !== 'Caterers' ? 'Task Details:' : 'Enquiry Details'}</div>
                        <div className="sub-title-detail"> {step2Data.additional_comments}</div>
                      </div>
                    </Col>
                    {/* <Col md={12}>
                      <div className="title-sub-title-detail">
                        <div className="title">Preferred Cusine:</div>
                        <div className="sub-title-detail">{selectedCusine}</div>
                      </div>
                    </Col> */}
                  </Row>

                  <Row gutter={15}>
                    <Col md={24}>
                      <Text><b>Upload Photos:</b></Text>
                      <Upload
                        
                        name='enquiry_images'
                        listType='picture-card'
                        className='avatar-uploader mt-10'
                        showUploadList={true}
                        fileList={step2Data.enquiry_images}
                        customRequest={this.dummyRequest}
                        onChange={this.handleImageUpload}
                        id='fileButton'
                      />
                    </Col>
                  </Row>

                </Card>
              </Col>
              <div className='steps-action '>
                <Button onClick={() => { this.props.preStep() }} type='primary' size='middle' className='btn-trans fm-btn' >Back</Button>
                <Button onClick={() => { this.sendEnquiry() }} type='primary' size='middle' className='btn-blue fm-btn' >Send</Button>
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
  mapStateToProps, { sendEventEnquiry }
)(withRouter(Step4));