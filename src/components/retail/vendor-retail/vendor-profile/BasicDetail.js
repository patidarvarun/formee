import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import validator from "validator";
import moment from "moment";
import {
  Button,
  Upload,
  message,
  Avatar,
  form,
  Row,
  Typography,
  Divider,
  Space,
  Spin,
} from "antd";
import {
  LoadingOutlined,
  UserOutlined,
  LockOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Checkbox, Select, Form, Input, Col } from "antd";
import { langs } from "../../../../config/localization";
import {
  getTraderProfile,
  disableLoading,
  enableLoading,
  getUserProfile,
  saveTraderProfile,
  changeUserName,
  changeMobNo,
  logout,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
} from "../../../../actions/index";
import { DEFAULT_IMAGE_TYPE } from "../../../../config/Config";
import {
  required,
  email,
  minLength,
  maxLength,
  validatePhoneNumber,
  validMobile,
} from "../../../../config/FormValidation";
import PlacesAutocomplete from "../../../common/LocationInput";
import { converInUpperCase, dateFormate } from "../../../common";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import "../../../dashboard/vendor-profiles/myprofilestep.less";
import { BASE_URL } from "../../../../config/Config";
const spinIcon = (
  <img
    src={require("./../../../../assets/images/loader1.gif")}
    alt=""
    style={{ width: "64px", height: "64px" }}
  />
);

const { Title, Text } = Typography;
const { Option } = Select;

class BasicDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitBussinessForm: false,
      submitFromOutside: false,
      is_public_closed: false,
      trader_working_hours: [],
      fileList: [],
      imageUrl: "",
      key: 1,
      value: "",
      address: "",
      postal_code: "",
      number: "",
      firstName: "",
      lastName: "",
      mobileNo: "",
      otpModalVisible: false,
      isNumberVarify: false,
      isVisible: true,
      editorState1: BraftEditor.createEditorState("<p><p>"),
    };
  }
  formRef = React.createRef();

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { userDetails, loggedInUser } = this.props;
    if (userDetails) {
      const { business_location } = userDetails.user;
      const { trader_profile } = userDetails.user;
      if (business_location !== undefined) {
        let loc = business_location ? business_location : "";
        let full_add = "";
        full_add = `${loc}`;
        this.setState({
          address: full_add,
        });
      }
      let predefinedImages = [];
      userDetails.user.trader_service_images &&
        userDetails.user.trader_service_images.map((el, index) => {
          predefinedImages.push({
            uid: `-${index}`,
            name: "image.png",
            status: "done",
            isPrevious: true,
            url: `${BASE_URL}/${el.full_image}`,
            type: "image/jpeg",
            size: "1024",
            // 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          });
        });

      this.setState({
        fileList: predefinedImages,
        editorState1:
          trader_profile &&
          trader_profile.description &&
          BraftEditor.createEditorState(trader_profile.description),
        imageUrl:
          userDetails.image !== undefined
            ? userDetails.image
            : DEFAULT_IMAGE_TYPE,
        trader_working_hours: userDetails.user.trader_working_hours,
        is_public_closed:
          trader_profile && trader_profile.is_public_closed === 0
            ? false
            : true,
      });
    }
  }

  /**
   * @method componentDidUpdate
   * @description called to submit form
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.submitFromOutside !== this.props.submitFromOutside) {
      this.setState({ address: "" });
      this.onClearAll();
    }
  }

  /**
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field
   */
  handleAddress = (result, address, latLng) => {
    let state = "";
    let city = "";
    let pincode = "";

    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_1") {
        state = el.long_name;
      } else if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
      } else if (el.types[0] === "postal_code") {
        this.setState({ postal_code: el.long_name });
        pincode = el.long_name;
        this.formRef.current.setFieldsValue({
          pincode: el.long_name,
        });
      }
    });
    this.formRef.current.setFieldsValue({
      address: address,
    });
    this.setState({ address });
  };

  /**
   * @method onTabChange
   * @description handle ontabchange
   */
  onTabChange = () => {
    const { key } = this.state;
    if (key === 1) {
      this.setState({ key: 2 });
    } else if (key === 2) {
      this.setState({ key: 1 });
    }
  };

  /**
   * @method onClear All Event Cleares all screen
   * @description clear all fields
   */
  onClearAll = () => {
    this.formRef.current.setFieldsValue({
      name: "",
      email: "",
      mobile_no: "",
      address: "",
      bussiness_name: "",
      fname: "",
      lname: "",
      pincode: "",
    });
  };

  /**
   * @method beforeUpload
   * @description handle image Loading
   */
  beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG  & PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  /**
   * @method handleChange
   * @description handle Image change
   */
  handleChange = (info) => {
    const { id } = this.props.loggedInUser;
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    const isCorrectFormat =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    const isCorrectSize = info.file.size / 1024 / 1024 < 2;

    if (isCorrectSize && isCorrectFormat) {
      const formData = new FormData();
      formData.append("image", info.file.originFileObj);
      formData.append("user_id", id);
      this.props.changeProfileImage(formData, (res) => {
        this.setState({ loading: false });
        if (res.status === 1) {
          toastr.success(
            langs.success,
            langs.messages.profile_image_update_success
          );
          this.props.getUserProfile({ user_id: id });
          this.props.getTraderProfile({ user_id: id });
          this.setState({
            imageUrl: res.data.image,
            loading: false,
          });
        }
      });
    }
  };

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    const { name, image } = this.props.userDetails;
    const { userDetails } = this.props;
    const { trader_profile } = this.props.userDetails.user;
    let Name = trader_profile && trader_profile.contact_name;
    let splitedName = [];
    let lastNameArray = [];
    let laname = "";
    let bussiness_loc = "";
    if (Name && Name !== undefined) {
      splitedName = Name.split(" ");
      splitedName.map((el, index) => {
        if (index > 0) {
          lastNameArray.push(splitedName[index]);
        }
      });
      laname = lastNameArray.toString().replace(",", " ");
    }

    let firstName =
      Array.isArray(splitedName) && splitedName.length
        ? converInUpperCase(splitedName[0])
        : "";
    let lastName =
      Array.isArray(splitedName) && splitedName.length > 1
        ? converInUpperCase(laname)
        : "";
    let temp = {
      name,
      bussiness_name: userDetails.user.business_name,
      email: userDetails.user.email,
      image,
      mobile_no: userDetails.user.contact_number,
      pincode: userDetails.user.business_pincode,
      fname: firstName,
      lname: lastName,
    };
    return temp;
  };

  /**
   * @method on finish
   * @description varify number
   */
  onFinish = (value) => {
    const { address } = this.state;
    value.address = address;
    value.contact_name = `${value.fname} ${value.lname}`;
    value.description = this.state.editorState1.toHTML();
    value.service_images = this.state.fileList;
    value.is_public_closed = this.state.is_public_closed;
    this.props.nextStep(value);
  };

  /**
   * @method handleEditorChange
   * @description handle editor text value change
   */
  handleEditorChange = (editorState, i) => {
    this.setState({ editorState1: editorState });
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

  renderOperatingHoursRow = (startTime, endTime, day, is_open) => {
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
            placeholder="Please Choose"
            allowClear
            defaultValue={is_open === 1 ? startTime : undefined}
            onChange={(e) => {
              let index = trader_working_hours.findIndex((k) => k.day == day);
              let temp = trader_working_hours;
              if (e !== undefined && index >= 0) {
                //If user Enters value
                var start = moment(e, ["HH:mm"]);
                // temp[index].start_time = `${e}:00`;
                temp[index].start_time = start.format("hh:mm A");
                temp[index].end_time = null;
                temp[index].is_open = 1;
                // currentField[`operating_start_hours${rowIndex}`] = `${e}:00`
                currentField[`operating_start_hours${rowIndex}`] =
                  start.format("hh:mm A");
                currentField[`operating_end_hours${rowIndex}`] = null;
                this.formRef.current.setFieldsValue({ ...currentField });
              } else if (e === undefined && index >= 0) {
                //If user click on cross Icon
                var start = moment("00.00 AM", ["HH:mm"]);
                var end = moment("00.00 AM", ["HH:mm"]);
                temp[index].start_time = start.format("hh:mm A");
                temp[index].end_time = end.format("hh:mm A");
                temp[index].is_open = 0;
                currentField[`operating_start_hours${rowIndex}`] = undefined;
                currentField[`operating_end_hours${rowIndex}`] = undefined;
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
                //
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
            placeholder="Please Choose"
            allowClear
            defaultValue={is_open === 1 ? endTime : undefined}
            onChange={(e) => {
              let index = trader_working_hours.findIndex((k) => k.day == day);
              let temp = trader_working_hours;
              if (e !== undefined && index >= 0) {
                // temp[index].end_time = `${e}:00`;
                var end = moment(e, ["HH:mm"]);
                temp[index].end_time = end.format("hh:mm A");
                //validations
                if (!temp[index].start_time) {
                  toastr.warning(
                    langs.warning,
                    "Please select start date first"
                  );
                }
                currentField[`operating_end_hours${rowIndex}`] =
                  end.format("hh:mm A");
                this.formRef.current.setFieldsValue({ ...currentField });
              } else if (e === undefined && index >= 0) {
                //If user click on cross Icon
                var start = moment("00.00 AM", ["HH:mm"]);
                var end = moment("00.00 AM", ["HH:mm"]);
                temp[index].start_time = start.format("hh:mm A");
                temp[index].end_time = end.format("hh:mm A");
                temp[index].is_open = 0;
                currentField[`operating_start_hours${rowIndex}`] = undefined;
                currentField[`operating_end_hours${rowIndex}`] = undefined;
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

  renderOperatingHours = () => {
    const { itemList } = this.state;
    const { userDetails } = this.props;
    let me = this;
    return Object.keys(userDetails.days).map(function (day, index) {
      let startTime = "";
      if (
        userDetails.user.trader_working_hours[index] &&
        userDetails.user.trader_working_hours[index].start_time
      ) {
        startTime =
          userDetails.user.trader_working_hours[index] &&
          userDetails.time_slots[
            userDetails.user.trader_working_hours[index].start_time.substring(
              0,
              5
            )
          ];
      }
      let endTime = "";
      if (
        userDetails.user.trader_working_hours[index] &&
        userDetails.user.trader_working_hours[index].end_time
      ) {
        endTime =
          userDetails.user.trader_working_hours[index] &&
          userDetails.time_slots[
            userDetails.user.trader_working_hours[index].end_time.substring(
              0,
              5
            )
          ];
      }

      return (
        <div className="operating-content-block">
          <Row gutter={30}>
            <Col xs={24} sm={5} md={5} lg={4} xl={3}>
              <Text>{userDetails.days[day]}</Text>
            </Col>
            <Col xs={24} sm={12} md={24} lg={15} xl={20}>
              {me.renderOperatingHoursRow(
                startTime,
                endTime,
                day,
                userDetails.user.trader_working_hours[index].is_open
              )}
            </Col>
          </Row>
        </div>
      );
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { userDetails, loggedInUser } = this.props;
    if (userDetails) {
      const { trader_profile } = userDetails.user;
      const { loading, editorState1, fileList, address, is_public_closed } =
        this.state;
      const controls = ["bold", "italic", "underline", "separator"];
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
          <div className="upload-profile--box">
            <div className="upload-profile-pic">
              {userDetails.user.image ? (
                <Avatar size={91} src={userDetails.user.image} />
              ) : (
                <Avatar size={91} icon={<UserOutlined />} />
              )}
            </div>
            <div className="upload-profile-content">
              {
                <Title level={4}>
                  {trader_profile &&
                    `${
                      trader_profile.contact_name &&
                      converInUpperCase(trader_profile.contact_name)
                    }`}
                </Title>
              }
              <Text className="fs-11">
                {/* {this.props.userDetails.address} */}
                (Member since -
                {trader_profile &&
                  trader_profile.created_at &&
                  dateFormate(trader_profile.created_at)}
                )
              </Text>
              <div className="mt-10">
                <Upload
                  name="avatar"
                  listType="picture"
                  className="ml-2"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                >
                  <div>
                    {loading && <LoadingOutlined />}
                    <div className="ant-upload-text float-left">
                      <Link to="#">Upload Photo</Link>
                    </div>
                  </div>
                </Upload>
              </div>
            </div>
          </div>
          <div>
            <Form
              ref={this.formRef}
              name="updateProfile"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              scrollToFirstError
              initialValues={this.getInitialValue()}
              layout={"vertical"}
            >
              <Row gutter={28} className="fr-name-block">
                <Col span={12}>
                  <Form.Item
                    label="Business Name"
                    name="bussiness_name"
                    rules={[required("First name")]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col
                  span={6}
                  className="fr-name-leftblock"
                  style={{ paddingRight: 0 }}
                >
                  <div class="ant-col ant-form-item-label">
                    <label className="ant-form-item-required">
                      Contact Name
                    </label>
                  </div>
                  <Form.Item name="fname" rules={[required("First name")]}>
                    <Input placeholder="Name" />
                  </Form.Item>
                </Col>
                <Col
                  className="fr-name-rightblock"
                  style={{ paddingLeft: 0 }}
                  span={6}
                >
                  <div class="ant-col ant-form-item-label">
                    <label>&nbsp;</label>
                  </div>
                  <Form.Item name="lname" rules={[required("Last name")]}>
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={28}>
                <Col span={12}>
                  <Form.Item label="Contact Number" name="mobile_no">
                    <Input type={"text"} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[required("Email id"), email]}
                    onBlur={this.changeEmail}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={28}>
                <Col span={12}>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={
                      (address === "" ||
                        address == undefined ||
                        address === null) && [required("Address")]
                    }
                  >
                    <PlacesAutocomplete
                      name="address"
                      handleAddress={this.handleAddress}
                      addressValue={this.state.address}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Postcode"
                    name="pincode"
                    rules={[required("Pincode")]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={28}>
                <Col xs={24} sm={12} md={12} lg={24}>
                  <Title level={4} className="">
                    Business Information
                  </Title>

                  <Form.Item
                    name={`description`}
                    // label='Business Information'
                    // rules={[required('Business Information')]}
                  >
                    <BraftEditor
                      value={editorState1}
                      controls={controls}
                      onChange={(e) => this.handleEditorChange(e, 1)}
                      contentStyle={{ height: 150 }}
                      // className={'input-editor braft-editor'}
                    />
                  </Form.Item>
                </Col>

                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={12}
                  className="upload-cover-photo"
                >
                  <Title level={4} className="">
                    Upload Cover Photos{" "}
                  </Title>
                  <div className="discription">
                    Add up to 8 images or upgrade to include more.
                    <br />
                    Hold and drag to reorder photos. Maximum file size 4MB.
                  </div>
                  <Form.Item name="image" className="label-large mt-10">
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
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row gutter={28} className="fitness-operating-hours">
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Title level={4} className='' style={{ textTransform: "inherit" }}>Operating hours</Title>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <div className="fitness-operatinghours">
                                {this.renderOperatingHours()}
                                </div>

                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Form.Item
                                // label=''
                                name='is_public_closed'
                                className="closed-label"
                                >
                                <Checkbox onChange={(e) => {
                                    
                                    this.setState({ is_public_closed: e.target.checked })
                                }} checked={is_public_closed}>Closed on public holidays</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row> */}
              <Divider />
              <div className="step-button-block">
                <Button
                  htmlType="submit"
                  type="primary"
                  size="middle"
                  className="btn-blue"
                >
                  NEXT
                </Button>
              </div>
            </Form>
          </div>
        </Fragment>
      );
    } else {
      return <Spin tip="Loading..." indicator={spinIcon} spinning={true} />;
    }
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    //userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
  };
};
export default connect(mapStateToProps, {
  getTraderProfile,
  disableLoading,
  getUserProfile,
  saveTraderProfile,
  logout,
  changeUserName,
  changeMobNo,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
})(BasicDetail);
