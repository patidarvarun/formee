import React, { Fragment } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import moment from "moment";
import {
  Checkbox,
  Button,
  Upload,
  message,
  Row,
  Typography,
  Divider,
  Input,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Col, Select } from "antd";
import { langs } from "../../../../config/localization";
import {
  enableLoading,
  disableLoading,
  getRestaurantDetail,
  updateRestaurantProfile,
  addRestaurantProfile,
  standardEats,
  getDiataries,
  getFoodTypes,
  getUserProfile,
  getBookingSubcategory,
  saveTraderProfile,
} from "../../../../actions";
import { required, validNumber } from "../../../../config/FormValidation";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css"; 
import "../myprofilestep.less";
import { formatedTime } from "../../../common";
import {
  setCustomLocalStorage,
  getCustomLocalStorage,
} from "../../../../common/Methods";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

class RestaurantDetailStep2 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      dietaries: [],
      editorState1: BraftEditor.createEditorState("<p><p>"),
      trader_working_hours: [
        { day: 1, end_time: null, start_time: null },
        { day: 2, end_time: null, start_time: null },
        { day: 3, end_time: null, start_time: null },
        { day: 4, end_time: null, start_time: null },
        { day: 5, end_time: null, start_time: null },
        { day: 6, end_time: null, start_time: null },
        { day: 7, end_time: null, start_time: null },
      ],
      newone: [],
      selectedAmenities: [],
      cusines: [],
      fileList: [],
      standardEats: [],
      is_public_closed: false,
      serviceType: [
        { key: "All", value: "all" },
        { key: "Delivery", value: "delivery" },
        { key: "Take Away", value: "take_away" },
      ],
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { userDetails, restaurantDetail } = this.props;
    const { trader_working_hours } = this.state;
    this.getRestaurantDetails();
    if (restaurantDetail.cover_photo) {
      this.setState({
        fileList: [
          {
            uid: `-1`,
            name: "image.png",
            status: "done",
            isPrevious: true,
            url: `${restaurantDetail.cover_photo}`,
            type: "image/jpeg",
            size: "1024",
          },
        ],
      });
    }
    let defaultHours = restaurantDetail.operating_hours;
    const results = trader_working_hours.filter(
      ({ day: id1 }) => !defaultHours.some(({ day: id2 }) => id2 === id1)
    );

    let hours = [...defaultHours, ...results];

    this.setState({
      // trader_working_hours: restaurantDetail.operating_hours,
      trader_working_hours: hours,
      is_public_closed:
        restaurantDetail.is_public_closed &&
        restaurantDetail.is_public_closed == 1
          ? true
          : false,
      editorState1: BraftEditor.createEditorState(restaurantDetail.description),
    });
    this.props.getFoodTypes((res) => {
      if (res.status === 200) {
        let cusines =
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length
            ? res.data.data
            : [];
        this.setState({ cusines: cusines });
      }
    });
    this.props.getDiataries((res) => {
      if (res.status === 200) {
        let dietaries =
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length
            ? res.data.data
            : [];
        this.setState({ dietaries: dietaries });
      }
    });
    this.props.standardEats((res) => {
      if (res.status === 200) {
        let standardEats =
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length
            ? res.data.data
            : [];
        this.setState({ standardEats: standardEats });
      }
    });
  }

  /**
   * @method componentDidUpdate
   * @description called to submit form
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.submitFromOutside !== this.props.submitFromOutside) {
      this.setState({ editorState1: BraftEditor.createEditorState("<p><p>") });
      this.onClearAll();
    }
  }

  /**
   * @method getRestaurantDetails
   * @description get restaurant details
   */
  getRestaurantDetails = () => {
    const { loggedInUser } = this.props;
    this.props.getRestaurantDetail(loggedInUser.id, "", (res) => {});
  };

  /**
   * @method onClear All Event Cleares all screen
   * @description clear all fields
   */
  onClearAll = () => {
    this.formRef.current.setFieldsValue({
      dietary: [],
      cusines: [],
      service: "",
      standard_eta: "",
      description: BraftEditor.createEditorState("<p><p>"),
      image: "",
      operating_hours: "",
    });
    this.setState({ trader_working_hours: [] });
  };

  /**
   * @method renderOperatingHoursRow
   * @description render operating hours input
   */
  renderOperatingHoursRow = (startTime, endTime, day) => {
    const { trader_working_hours } = this.state;
    const { userDetails } = this.props;
    let rowIndex = trader_working_hours.findIndex((k) => k.day == day);
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    return (
      <div className="fr-op-hrs">
        <Form.Item
          name={`operating_start_hours${rowIndex}`}
          value={startTime}
          rules={[
            {
              required:
                currentField &&
                currentField[`operating_end_hours${rowIndex}`] !== undefined,
              message: "This field is required.",
            },
          ]}
        >
          <Select
            placeholder="..."
            allowClear
            defaultValue={startTime}
            onChange={(e) => {
              let index = trader_working_hours.findIndex((k) => k.day == day);
              let temp = trader_working_hours;
              if (e !== undefined && index >= 0) {
                var start = moment(e, ["HH:mm"]);
                temp[index].start_time = start.format("HH:mm:ss");
                temp[index].end_time = null;
                temp[index].is_open = 1;
                currentField[`operating_start_hours${rowIndex}`] =
                  start.format("hh:mm A");
                currentField[`operating_end_hours${rowIndex}`] = null;
                this.formRef.current.setFieldsValue({ ...currentField });
              } else if (e === undefined) {
                temp.splice(index, 1);
              }
              this.setState({ trader_working_hours: temp });
            }}
          >
            {userDetails.time_slots &&
              Object.keys(userDetails.time_slots).map(function (
                keyName,
                index
              ) {
                return (
                  <Option value={keyName} key={userDetails.time_slots[keyName]}>
                    {userDetails.time_slots[keyName]}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required:
                currentField &&
                currentField[`operating_start_hours${rowIndex}`] !== undefined,
              message: "This field is required.",
            },
          ]}
          name={`operating_end_hours${rowIndex}`}
          className="hide-dash-bar"
        >
          <Select
            placeholder="..."
            allowClear
            defaultValue={endTime}
            // onChange={(e) => {
            //   let index = trader_working_hours.findIndex((k) => k.day == day)
            //   let temp = trader_working_hours
            //   if (index >= 0) {
            //     temp[index].end_time = `${e}:00`;
            //     //validations
            //     if (!temp[index].start_time) {
            //       toastr.warning(langs.warning, 'Please select start date first')
            //     }
            //
            //   }
            //   this.setState({ trader_working_hours: temp })
            // }}
            onChange={(e) => {
              let index = trader_working_hours.findIndex((k) => k.day == day);
              let temp = trader_working_hours;
              if (e !== undefined && index >= 0) {
                var end = moment(e, ["HH:mm"]);
                temp[index].end_time = end.format("HH:mm:ss");
                //validations

                if (!temp[index].start_time) {
                  toastr.warning(
                    langs.warning,
                    "Please select start date first"
                  );
                } else {
                  let startTime = moment(temp[index].start_time, [
                    "HH:mm",
                  ]).format("hh:mm A");
                  currentField[`operating_start_hours${rowIndex}`] = startTime;
                }
                currentField[`operating_end_hours${rowIndex}`] =
                  end.format("hh:mm A");
                this.formRef.current.setFieldsValue({ ...currentField });
              }
              this.setState({ trader_working_hours: temp });
            }}
          >
            {userDetails.time_slots &&
              Object.keys(userDetails.time_slots).map(function (
                keyName,
                index
              ) {
                let disabled = false;
                // let a=currentField.operating_start_hours
                if (currentField) {
                  let test = currentField[`operating_start_hours${rowIndex}`];
                  const stime = moment(String(startTime), ["HH.mm"]).format(
                    "hh:mm a"
                  );
                  const etime = moment(keyName, ["HH.mm"]).format("hh:mm a");
                  let check = true;
                  if (test !== undefined) {
                    var beginningTime = moment(test, "h:mma");
                    var endTime = moment(etime, "h:mma");
                    check = beginningTime.isBefore(endTime);
                  } else if (startTime) {
                    var beginningTime = moment(stime, "h:mma");
                    var endTime = moment(etime, "h:mma");
                    check = beginningTime.isBefore(endTime);
                  }
                  if (!check) {
                    disabled = true;
                  }
                }

                return (
                  <Option
                    disabled={disabled}
                    value={keyName}
                    key={userDetails.time_slots[keyName]}
                  >
                    {userDetails.time_slots[keyName]}
                  </Option> // <Option>{userDetails.time_slots[keyName]}</Option>
                );
              })}
          </Select>
        </Form.Item>
      </div>
    );
  };

  /**
   * @method renderOperatingHours
   * @description render operating hours
   */
  renderOperatingHours = () => {
    const { userDetails, restaurantDetail } = this.props;
    let me = this;
    return Object.keys(userDetails.days).map(function (day, index) {
      let startTime = "";
      if (
        restaurantDetail.operating_hours[index] &&
        restaurantDetail.operating_hours[index].start_time
      ) {
        startTime =
          restaurantDetail.operating_hours[index] &&
          restaurantDetail.operating_hours[index].start_time.substring(0, 5);
      }
      let endTime = "";
      if (
        restaurantDetail.operating_hours[index] &&
        restaurantDetail.operating_hours[index].end_time
      ) {
        endTime =
          restaurantDetail.operating_hours[index] &&
          restaurantDetail.operating_hours[index].end_time.substring(0, 5);
      }

      let sTime = startTime ? formatedTime(startTime) : "";
      let lTime = endTime ? formatedTime(endTime) : "";

      return (
        <div className="operating-content-block">
          <Row gutter={30}>
            <Col xs={24} sm={5} md={5} lg={4} xl={3}>
              <Text className="hr-label">{userDetails.days[day]}</Text>
            </Col>
            <Col xs={24} sm={12} md={24} lg={15} xl={20}>
              {me.renderOperatingHoursRow(sTime, lTime, day)}
            </Col>
            {/* <Checkbox checked={true}>Closed on public holiday</Checkbox> */}
          </Row>
        </div>
      );
    });
  };

  /**
   * @method handleEditorChange
   * @description handle editor text value change
   */
  handleEditorChange = (editorState, i) => {
    if (i === 1) {
      this.setState({ editorState1: editorState });
    }
  };

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    let tmp = getCustomLocalStorage("vendordetails");
    console.log(tmp, "tmpppppppppppp");
    const { restaurantDetail } = this.props;
    let tmp2 = tmp
      ? Object.assign({}, { ...restaurantDetail }, { ...tmp })
      : restaurantDetail;
    let dietaries = tmp2 && tmp2.profile_dieatry;
    let cusinesList = tmp2 && tmp2.profile_cusines;
    console.log(cusinesList, "cusinesList");
    let die = [],
      cusines = [];
    Array.isArray(dietaries) && dietaries.filter((d) => die.push(d.id));
    let mydata = cusinesList.filter((d) => cusines.push(d.id));
    console.log(mydata, "mydataaaa");
    console.log(cusines, "cusinesssss");

    let eta = tmp2 && tmp2.standard_eta;
    let eta_value = eta && Array.isArray(eta) && eta.length ? eta[0].id : "";
    let temp = {
      cusines: cusines,
      dietary: die,
      service: tmp2.service,
      standard_eta: eta_value ? eta_value : 1,
      rate_per_hour: tmp2 && tmp2.rate_per_hour ? tmp2.rate_per_hour : null,
      description: BraftEditor.createEditorState(tmp2.description),
    };

    return temp;
  };

  /**
   * @method on finish
   * @description varify number
   */
  onFinish = (value) => {
    console.log(value, "Valueeeeeeeeeeee");
    const { editorState1, fileList, trader_working_hours, is_public_closed } =
      this.state;
    const { restaurantDetail, step1Data, userDetails } = this.props;
   
    let workingHours = [];
    trader_working_hours &&
      trader_working_hours.length &&
      trader_working_hours.map((el) => {
        if (
          el.start_time !== "undefined:00" &&
          el.start_time !== null &&
          el.end_time !== "undefined:00" &&
          el.end_time !== null
        ) {
          workingHours.push({
            day: el.day,
            start_time: el.start_time,
            end_time: el.end_time,
          });
        }
      });

    let name =
      step1Data.fname || step1Data.lname
        ? step1Data.fname + " " + step1Data.lname
        : restaurantDetail.contact_name;
    if (restaurantDetail) {
      const formData = new FormData();
      formData.append("cover_photo", fileList[0].originFileObj);
      let requestData = {
        business_name: step1Data.bussiness_name
          ? step1Data.bussiness_name
          : restaurantDetail.business_name
          ? restaurantDetail.business_name
          : restaurantDetail.user.business_name,
        contact_name: name,
        contact_number: step1Data.mobile_no
          ? step1Data.mobile_no
          : restaurantDetail.contact_number,
        email: step1Data.email ? step1Data.email : restaurantDetail.email,
        latitude: restaurantDetail.latitude
          ? restaurantDetail.latitude
          : userDetails.user && userDetails.user.business_lat
          ? userDetails.user.business_lat
          : "",
        longitude: restaurantDetail.longitude
          ? restaurantDetail.longitude
          : userDetails.user && userDetails.user.business_lng
          ? userDetails.user.business_lng
          : "",
        cusines: value.cusines,
        dietary: value.dietary,
        standard_eta: value.standard_eta,
        service: value.service,
        rate_per_hour: value.rate_per_hour,
        description: editorState1.toHTML(),
        cover_photo:fileList ,
        operating_hours: workingHours,
        address: step1Data.address
          ? step1Data.address
          : restaurantDetail.address,
        business_profile_id:
          userDetails.user && userDetails.user.business_profile
            ? userDetails.user.business_profile.id
            : "",
        is_public_closed: is_public_closed,
      };
      setCustomLocalStorage("vendordetails", requestData);
      this.props.nextStep(requestData);
      console.log(requestData,"requestData")
      // this.props.nextStep(requestData, 2);
    }
  };

  /**
   * @method dummyRequest
   * @description dummy api for image request
   */
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
    //   formData.append("image", info.file.originFileObj);
    //   formData.append("user_id", id);
    //   this.props.changeProfileImage(formData, (res) => {
    //     this.setState({ loading: false });
    //     if (res.status === 1) {
    //       toastr.success(
    //         langs.success,
    //         langs.messages.profile_image_update_success
    //       );
    //       this.props.getUserProfile({ user_id: id });
    //       this.props.getTraderProfile({ user_id: id });
    //       this.setState({
    //         imageUrl: res.data.image,
    //         loading: false,
    //       });
    //     }
    //   });
    // }
    }

  };

   handleChange = (value) =>  {
    console.log(`selected ${value}`);
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { restaurantDetail } = this.props;

    const controls = ["bold", "italic", "underline", "separator"];
    const {
      fileList,
      editorState1,
      serviceType,
      dietaries,
      cusines,
      standardEats,
      is_public_closed,
    } = this.state;
  
    console.log(fileList,"filelist")
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
        <img
          src={require("../../../../assets/images/icons/upload.svg")}
          alt="upload"
        />
      </div>
    );
    
    return (
      <Fragment>
        <div className="vender-detail-first">
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            scrollToFirstError
            initialValues={this.getInitialValue()}
            layout={"vertical"}
          >
            <div className="vender-detail-first-gray">
              <Row gutter={28}>
                <Col span={12}>
                  {/* <Paragraph>*You can choose more than one</Paragraph> */}
                  <label className="grey-label">
                    Select Cuisines <span>You can choose more than one</span>
                  </label>
                  <Form.Item
                    // label="Select Cusines You can choose more than one"
                    name="cusines"
                    rules={[required("cusines")]}
                  >
                    <Select
                      placeholder="Select"
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      size="large"
                      onChange={this.handleChange}
                    >
                      {cusines &&
                        cusines.map((keyName, i) => {
                          console.log(keyName,"keynameee")
                          return (
                            <Option key={i} value={keyName.id}>
                              {keyName.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* <Paragraph>*You can choose more than one</Paragraph> */}
                  <label className="grey-label">
                    Select Dietary <span>You can choose more than one</span>
                  </label>
                  <Form.Item
                    // label="Select Dietery You can choose more than one"
                    name="dietary"
                    rules={[required("dietary")]}
                  >
                    <Select
                      placeholder="Select"
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      size="large"
                      onChange={this.handleChange}
                    >
                      {dietaries &&
                        dietaries.map((keyName, i) => {
                          return (
                            <Option key={i} value={keyName.id}>{keyName.name}</Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={28}>
                <Col span={12}>
                  <Form.Item
                    label="Standard ETA"
                    name="standard_eta"
                    rules={[required("standard_eta")]}
                    // defaultValue={"1"}
                  >
                    <Select
                      placeholder="Select"
                      allowClear
                      style={{ width: "100%" }}
                    >
                      {standardEats &&
                        standardEats.map((keyName, i) => {
                          return (
                            <Option key={keyName.id} value={keyName.id}>
                              {keyName.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Select your service"
                    name="service"
                    rules={[required("service")]}
                  >
                    <Select
                      placeholder="Select"
                      size={"large"}
                      className="w-100"
                      allowClear
                    >
                      {serviceType &&
                        serviceType.map((el, i) => {
                          return (
                            <Option key={el.key} value={el.value}>
                              {el.key}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Title level={4} className="business-label">
              Business Information
            </Title>
            <Row gutter={28}>
              <Col span={24} >
                <Form.Item
                  name={`description`}
                  label="Restaurant Information"
                  className="restaurant-editor-col"   
                  rules={[required("description")]}             
                >
                  <BraftEditor
                    value={editorState1}
                    controls={controls}
                    onChange={(e) => this.handleEditorChange(e, 1)}
                    contentStyle={{ height: 150 }}
                    className={"input-editor braft-editor"}
                    language="en"
                    placeholder="Type here"
                       
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={28} className="upload-cover-photo">
              <Col xs={24} sm={24} md={24} lg={24}>
                <Title level={4} className="">
                  Upload Cover Photos
                </Title>
                <div className="discription">
                  Add up to 8 images or upgrade to include more.
                  <br />
                  Hold and drag to reorder photos. Maximum file size 4MB.
                </div>
                <Form.Item name="image" className="label-large mb-0"  >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={true}
                    fileList={fileList}
                    customRequest={this.dummyRequest}
                    onChange={this.handleImageUpload}
                    id="fileButton"
                    
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  {fileList.length >= 8 ? null : (
                    <div className="ant-upload-text float-left pre-btn">
                      <Button danger>
                        <label for="fileButton" style={{ cursor: "pointer" }}>
                          Add Pictures
                        </label>
                      </Button>
                    </div>
                  )}
                  
                </Form.Item>
              </Col>
            </Row>
            <Divider className="mb-30" />
            {/* {!fitness && !beauty && !wellbeing && */}
            <div className="charges-rates-row">
              <Row gutter={28}>
                <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                  <Title level={4} className="fs-14 m-b0">
                    Charge rate (AUD)
                  </Title>
                  {/* <div className="notification">
                      You can select both or one
                    </div> */}
                </Col>
              </Row>
              <Row gutter={28}>
                <Col span={14}>
                  <div className="rates-per-hours">
                    <span className="custom-block">Start from / hr</span>
                    <Form.Item
                      label=""
                      name="rate_per_hour"
                      rules={[
                        { validator: validNumber },
                        required("rate_per_hour"),
                      ]}
                      // rules={[required("rate_per_hour")]}
                    >
                      <Input placeholder="Type your rate here" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
            {/* {this.renderOperatingHours()} */}
            <Divider className="mb-30" />
            <Row gutter={28} className="fitness-operating-hours">
              <Col xs={24} sm={24} md={24} lg={24}>
                <Title
                  level={4}
                  className=""
                  style={{ textTransform: "inherit" }}
                  rules={[required("Operating hours")]}
                >
                  Operating hours
                </Title>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className="fitness-operatinghours">
                  {this.renderOperatingHours()}
                </div>
              </Col>
            </Row>
            <Row className="closed-on-text">
              <Form.Item
                // label=''
                name="is_public_closed"
                className="closed-label"
                name="service"
                rules={[required("is_public_closed")]}
              >
                <Checkbox
                  onChange={(e) => {
                    this.setState({
                      is_public_closed: e.target.checked ? 1 : 0,
                    });
                  }}
                  checked={is_public_closed}
                >
                  Closed on public holidays
                </Checkbox>
              </Form.Item>
            </Row>
            {/* <Button htmlType='submit' type='primary' size='middle' className='btn-blue'>
                            NEXT
                        </Button> */}
            {/* <Divider className="mb-30" /> */}
            {/* <div className="button-grp ">
              <Button htmlType='submit' type='primary' size='middle' className='btn-blue'
              >NEXT
            </Button>
            </div> */}
            <div className="button-grp button-grp-pupl">
              <Button
                htmlType="submit"
                type="primary"
                size="middle"
                onClick={() => this.props.previousStep()}
              >
                Previous Step
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                size="middle"
                className="btn-blue"
                disabled={
                  this.formRef.current &&
                  this.formRef.current
                    .getFieldsError()
                    .filter(({ errors }) => errors.length).length > 0
                }
                // onClick={() => this.props.nextStep()}
              >
                Next Step
              </Button>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, common, bookings } = store;
  const { categoryData } = common;
  let bookingList = [];
  bookingList =
    categoryData && Array.isArray(categoryData.booking.data)
      ? categoryData.booking.data
      : [];

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    bookingList,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    restaurantDetail:
      bookings && bookings.restaurantDetail ? bookings.restaurantDetail : "",
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getRestaurantDetail,
  updateRestaurantProfile,
  addRestaurantProfile,
  standardEats,
  getDiataries,
  getFoodTypes,
  getUserProfile,
  getBookingSubcategory,
  saveTraderProfile,
})(RestaurantDetailStep2);
