import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Button,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Upload,
} from "antd";
import {
  required,
  whiteSpace,
  maxLengthC,
} from "../../../../../config/FormValidation";
import {
  enableLoading,
  disableLoading,
  checkEventTypeSubcategory,
  getEventTypes,
  getUserPreviousQuoteList,
  getEventVenuesList,
} from "../../../../../actions";
import { PlusOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
const { TextArea } = Input;

class Step2 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    const { step2Data } = props.mergedStepsData;
    this.state = {
      selected: false,
      retailSelected: false,
      classifiedSelected: false,
      category: "",
      hasEventType: false,
      eventTypes: [],
      dietaries: [],
      permissions: {},
      fileList:
        step2Data.enquiry_images.length > 0 ? step2Data.enquiry_images : [],
      previousQuotesList: [],
      eventVenuesList: [],
    };
  }

  componentDidMount() {
    const { bookingDetail } = this.props;
    this.props.enableLoading();
    this.fetchCustomerPreviousQuotes();
    this.props.checkEventTypeSubcategory(
      bookingDetail.trader_profile.booking_cat_id,
      (res) => {
        //
        if (res.status === 200) {
          const subCategory = Array.isArray(res.data.data) ? res.data.data : [];
          const checkCategoryHasEventType = subCategory.filter(
            (el) => el.id === bookingDetail.trader_profile.booking_sub_cat_id
          );
          this.setState({
            hasEventType:
              checkCategoryHasEventType[0].has_event_types === 1 ? true : false,
          });
          //
          this.props.getEventTypes(
            {
              booking_category_id:
                bookingDetail.trader_profile.booking_sub_cat_id,
            },
            (res) => {
              //
              this.props.disableLoading();
              if (res.status === 200) {
                this.setState({
                  eventTypes: res.data.event_types,
                  dietaries: res.data.dietaries,
                  permissions: res.data.permissions,
                });
              }
            }
          );
        }
      }
    );
  }

  fetchCustomerPreviousQuotes = () => {
    let reqData = {
      customer_id: this.props.loggedInDetail.id,
    };
    this.props.enableLoading();

    this.props.getEventVenuesList((venueResposne) => {
      //
      this.props.disableLoading();
      if (venueResposne.status === 200) {
        this.setState({ eventVenuesList: venueResposne.data.data });
      }
    });

    this.props.getUserPreviousQuoteList(reqData, (resposne) => {
      //
      this.props.disableLoading();
      if (resposne.status === 200) {
        this.setState({ previousQuotesList: resposne.data.data });
      }
    });
  };

  /**
   * @method onClickNext
   * @description onClickNext
   */

  onFinish = (values) => {
    //
    if (this.onFinishFailed() !== undefined) {
      return true;
    } else {
      const { dietaries, permissions, eventTypes } = this.state;
      if (values !== undefined) {
        values.dietaries = dietaries;
        values.permissions = permissions;
        values.eventTypes = eventTypes;
        //values.eventReferenceImage = this.state.fileList
        this.props.nextStep(values, 2);
      }
    }
  };

  /**
   * @method onFinishFailed
   * @description handle form submission failed
   */
  onFinishFailed = (errorInfo) => {
    return errorInfo;
  };

  renderEventTypes = (eventTypes) => {
    if (eventTypes) {
      return eventTypes.map((el, i) => {
        return (
          <Select.Option key={`${i}_event_type`} value={el.id}>
            {el.name}
          </Select.Option>
        );
      });
    }
  };

  normFile = (e) => {
    //
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  renderEventVenues = (eventVenues) => {
    if (eventVenues) {
      return eventVenues.map((el, i) => {
        return (
          <Select.Option key={`${i}_event_venue`} value={el.venue_of_event}>
            {el.venue_of_event}
          </Select.Option>
        );
      });
    }
  };

  renderPreviousQuotes = (previousQuotes) => {
    if (previousQuotes && previousQuotes.length > 0) {
      return previousQuotes.map((el, i) => {
        return (
          <Select.Option key={`${i}_previous_quote`} value={el.title}>
            {el.title}
          </Select.Option>
        );
      });
    }
  };
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  /**
   * @method handleImageUpload
   * @description handle image upload
   */
  handleImageUpload = ({ file, fileList }) => {
    //
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG  & PNG file!");
      return false;
    } else if (!isLt2M) {
      message.error("Image must smaller than 4MB!");
      return false;
    } else {
      this.setState({ fileList });
    }
  };

  //   handlePreview = file => {
  //     this.setState({
  //       previewImage: file.url || file.thumbUrl,
  //       previewVisible: true,
  //     })
  //   }

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      fileList,
      hasEventType,
      eventTypes,
      eventVenuesList,
      previousQuotesList,
    } = this.state;
    const { step2Data } = this.props.mergedStepsData;
    //
    const {
      event_name,
      quote_value,
      event_type_id,
      additional_comments,
      other_address,
      venue_of_event,
      enquiry_images,
    } = step2Data;
    const { subCategoryName } = this.props;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload Photo</div>
      </div>
    );

    return (
      <Fragment>
        <div className="wrap fm-step-form fm-step-three step-second">
          <Form
            name="user-bookinginfo"
            initialValues={{
              event_name: event_name,
              quote_value: quote_value,
              event_type_id: event_type_id,
              venue_of_event: venue_of_event,
              other_address: other_address,
              additional_comments: additional_comments,
              enquiry_images,
            }}
            layout="horizontal"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            scrollToFirstError
            id="user-bookinginfo"
            ref={this.formRef}
          >
            <h4 className="fm-input-heading">Event Information</h4>
            {/* {subCategoryName !== 'Florists' &&  <Form.Item
              rules={[required(""), maxLengthC(100)]}
              label="Event Name"
              name="event_name"
            >
              <Input
                placeholder={"Enter Event Name"}
                className="shadow-input"
              />
            </Form.Item>} */}

            <Form.Item
              label="Choose from previous Quotes"
              name="quote_value"
              colon={false}
            >
              <Select
                placeholder="Select a Task"
                className="shadow-input"
                size="large"
                allowClear
                getPopupContainer={(trigger) => trigger.parentElement}
              >
                {this.renderPreviousQuotes(previousQuotesList)}
              </Select>
            </Form.Item>
            {hasEventType === true && (
              <Form.Item
                rules={[required("")]}
                label="Choose Event Type"
                name="event_type_id"
              >
                <Select
                  placeholder="Select a event"
                  className="shadow-input"
                  size="large"
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentElement}
                >
                  {this.renderEventTypes(eventTypes)}
                </Select>
              </Form.Item>
            )}
            <Form.Item label="Choose venue" name="venue_of_event">
              <Select
                placeholder="Select a venue"
                className="shadow-input"
                size="large"
                allowClear
                getPopupContainer={(trigger) => trigger.parentElement}
              >
                {this.renderEventVenues(eventVenuesList)}
              </Select>
            </Form.Item>
            <div className="specify-text">
              <Text>Or specify your venue</Text>
            </div>

            <Form.Item
              label="d"
              className="other-add"
              name="other_address"
              rules={[
                maxLengthC(300),
                whiteSpace("Venue"),
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!getFieldValue("venue_of_event") && !value) {
                      return Promise.reject("Please specify the address here");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input placeholder={"Type Address"} className="shadow-input" />
            </Form.Item>
            <Form.Item
              label="Additional Noted"
              name="additional_comments"
              className="additional-note"
              rules={[
                required(""),
                whiteSpace("Additional Note"),
                maxLengthC(300),
              ]}
            >
              <TextArea
                rows={4}
                placeholder={"Type here"}
                className="shadow-input"
              />
            </Form.Item>
            <Form.Item
              label="Add Pictures"
              name="enquiry_images"
              className="add-pic add-pic-uploader"
              getValueFromEvent={this.normFile}
              extra={""}
            >
              {/* <div className="uplod-txt">Upload some photos to help further explain your job (Optional)</div> */}
              <Upload
                name="enquiry_images"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={true}
                fileList={fileList}
                customRequest={this.dummyRequest}
                onChange={this.handleImageUpload}
                id="fileButton"
                onPreview={this.handlePreview}
              >
                <span className="label-upload">Browse Files</span>
                {fileList.length >= 8 ? null : uploadButton}
                <img
                  className="camera-icon"
                  src={require("../../../../../assets/images/icons/camera-small.svg")}
                  alt=""
                />
              </Upload>
            </Form.Item>
            <Form.Item>
              <div className="steps-action">
                <Button
                  onClick={() => {
                    this.props.preStep();
                  }}
                  type="primary"
                  size="middle"
                  className="btn-trans fm-btn"
                >
                  Back
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="middle"
                  className="btn-blue fm-btn"
                >
                  Next
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, {
  checkEventTypeSubcategory,
  getEventTypes,
  enableLoading,
  disableLoading,
  getUserPreviousQuoteList,
  getEventVenuesList,
})(Step2);
