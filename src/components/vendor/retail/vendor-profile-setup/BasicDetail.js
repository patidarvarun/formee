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
import SendOtpModal from "../../../common/SendOtpModal";
import {
  required,
  email,
  minLength,
  maxLength,
  validatePhoneNumber,
  validMobile,
} from "../../../../config/FormValidation";
import PlacesAutocomplete from "../../../common/LocationInput";
import { converInUpperCase, dateFormate, dateFormate5 } from "../../../common";
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
      country: "",
      country_code: "",
      state: "",
      state_code: "",
      pincode: "",
      city: "",
      phonecode: "+61",
      retryIn: 0,
    };
  }
  formRef = React.createRef();

  componentWillReceiveProps(nextProps, prevProps) {
    const { userDetails, loggedInUserDetails } = nextProps;
    if (userDetails) {
      const { business_location } = userDetails.user;
      const { trader_profile, business_pincode, country_code, state_code } =
        userDetails.user;
      if (business_location !== undefined) {
        let loc = business_location ? business_location : "";
        let full_add = "";
        full_add = `${loc}`;
        this.setState({
          address: full_add,
          pincode: business_pincode,
          country_code,
          state_code,
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
        isNumberVarify:
          loggedInUserDetails.mobile_no_verified === 1 ? true : false,
        phonecode: loggedInUserDetails.phonecode
          ? loggedInUserDetails.phonecode
          : "+61",
      });
    }
  }
  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { userDetails, loggedInUserDetails } = this.props;
    if (userDetails) {
      const { business_pincode, country_code, state_code, business_location } =
        userDetails.user;
      if (business_location !== undefined) {
        let loc = business_location ? business_location : "";
        let full_add = "";
        full_add = `${loc}`;
        this.setState({
          address: full_add,
          pincode: business_pincode,
          country_code,
          state_code,
          isNumberVarify:
            loggedInUserDetails.mobile_no_verified === 1 ? true : false,
          phonecode: loggedInUserDetails.phonecode
            ? loggedInUserDetails.phonecode
            : "+61",
        });
      }
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
    let state_code = "";
    let country_code = "";
    let country = "";

    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_1") {
        state = el.long_name;
        state_code = el.short_name;
      } else if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
      } else if (el.types[0] === "country") {
        country = el.long_name;
        country_code = el.short_name;
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
    this.setState({
      city: city,
      pincode: pincode,
      address,
      state: state,
      country: country,
      country_code: country_code,
      state_code: state_code,
    });
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
   * @method getUserDetails
   * @description call to get user details by Id
   */
  getUserDetails = () => {
    const { id } = this.props.loggedInUser;
    this.props.getUserProfile({ user_id: id });
    this.setState({ isDisabled: false });
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
    const { userDetails, loggedInUserDetails } = this.props;
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
      business_location: userDetails.user.business_location,
      mobile_no: loggedInUserDetails.mobile_no,
      pincode: userDetails.user.business_pincode,
      fname: firstName,
      lname: lastName,
      description:
        trader_profile &&
        BraftEditor.createEditorState(trader_profile.description),
    };
    return temp;
  };

  /**
   * @method on finish
   * @description varify number
   */
  onFinish = (value) => {
    const {
      country,
      country_code,
      state,
      state_code,
      city,
      pincode,
      address,
      editorState1,
      is_public_closed,
      fileList,
    } = this.state;
    if (country_code && state_code && pincode) {
      value.address = address;
      value.country = country;
      value.country_code = country_code;
      value.state = state;
      value.state_code = state_code;
      value.pincode = pincode;
      value.city = city;
      value.contact_name = `${value.fname} ${value.lname}`;
      value.description = editorState1 && editorState1.toHTML();
      value.service_images = fileList;
      value.is_public_closed = is_public_closed;
      this.props.nextStep(value);
    } else {
      toastr.warning("Please enter your full address.");
    }
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

  /**
   * @method varifyNumber
   * @description varify number
   */
  varifyNumber = () => {
    const { phonecode } = this.state;
    let currentField = this.formRef.current.getFieldsValue();
    if (currentField.mobile_no) {
      this.props.sendOtp(
        { phone: currentField.mobile_no, countryCode: phonecode },
        (res) => {
          if (res.data !== undefined && res.data.status === 1) {
            console.log(" res.data: ", res.data);
            toastr.success("success", "Otp has been sent successfully");
            this.setState({
              otpModalVisible: true,
              retryIn: Number(res.data.data.retry_in),
            });
          }
        }
      );
    }
  };

  /**
   * @method validatePhone
   * @description validate phone on Link click
   */
  validatePhone = (mob) => {
    if (mob) {
      var IndNum = /^[0]?[0-9]+$/;
      if (!IndNum.test(mob)) {
        toastr.warning(langs.warning, "Please enter valid mobile number.");
      } else if (mob.length > 12) {
        toastr.warning(langs.warning, "Max length must be 12 digits.");
      } else if (mob.length < 10) {
        toastr.warning(langs.warning, "Min length must be 10 digits.");
      } else {
        this.varifyNumber();
      }
    } else {
      toastr.warning(langs.warning, "Contact number is Required.");
    }
  };

  /**
   * @method showVrifyContactOption
   * @description handle show/disable verify link of contact
   */
  showVrifyContactOption = () => {
    const { isNumberVarify, savedMobile } = this.state;
    const { mobile_no } = this.props.loggedInUserDetails;
    if (this.formRef.current) {
      console.log(
        this.formRef.current.getFieldsValue().mobile_no,
        "isNumberVarify: ",
        mobile_no
      );
    }
    if (!isNumberVarify) {
      return true;
    } else if (mobile_no !== this.formRef.current.getFieldsValue().mobile_no) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { userDetails, loggedInUser } = this.props;
    if (userDetails) {
      const { trader_profile } = userDetails.user;
      const {
        loading,
        editorState1,
        phonecode,
        address,
        otpModalVisible,
        retryIn,
      } = this.state;
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
      let business_location = address
        ? address
        : this.getInitialValue().business_location;
      console.log("address", business_location);
      return (
        <Fragment>
          <Row className="upload-profile--box upload-profile--box-v2 pt-35 pb-40">
            <Col sm={{ span: 10 }} md={{ span: 12 }}>
              <Row className="upload-profile-content">
                <div className="upload-profile-pic">
                  {userDetails.user.image ? (
                    <Avatar size={91} src={userDetails.user.image} />
                  ) : (
                    <Avatar size={91} icon={<UserOutlined />} />
                  )}
                </div>
                <div>
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
                      dateFormate5(trader_profile.created_at)}
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
                          <Link to="#" className="text-orange">
                            Upload Photo
                          </Link>
                        </div>
                      </div>
                    </Upload>
                  </div>
                </div>
              </Row>
            </Col>
            <Col md={{ span: 12 }} className="text-right">
              <Link to="/change-password" className="changePassword">
                <LockOutlined className="pr-5" />
                Change Password
              </Link>
              <Button className="btn-orange">Subscription</Button>
            </Col>
          </Row>
          <div className="basic-form-info">
            {/* <h2>Profile Information</h2> */}
            <Form
              ref={this.formRef}
              name="updateProfile"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              scrollToFirstError
              initialValues={this.getInitialValue()}
              layout={"vertical"}
            >
              <Row gutter={14} className="fr-name-block">
                <Col span={12}>
                  <Form.Item
                    label="Business Name"
                    name="bussiness_name"
                    rules={[required("Business name")]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6} className="fr-name-leftblock">
                  <div class="ant-col ant-form-item-label">
                    <label className="ant-form-item-required">
                      Contact Name
                    </label>
                  </div>
                  <Form.Item name="fname" rules={[required("First name")]}>
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col className="fr-name-rightblock" span={6}>
                  <div class="ant-col ant-form-item-label">
                    <label>&nbsp;</label>
                  </div>
                  <Form.Item
                    name="lname"
                    className="last-name"
                    rules={[required("Last name")]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={28}>
                <Col md={12}>
                  <Form.Item label="Contact Number">
                    <div className="spa-contact-number">
                      <Select
                        value={phonecode}
                        style={{
                          width: 110,
                          borderRight: "1px solid #90A8BE",
                          zIndex: "9",
                          textAlign: "center",
                        }}
                        onChange={(phonecode) => {
                          this.setState({ phonecode });
                        }}
                      >
                        <Option value="+91">+91</Option>
                        <Option value="+61">+61</Option>
                      </Select>
                      <Form.Item
                        name="mobile_no"
                        rules={[{ validator: validMobile }]}
                        // onBlur={this.changeMobile}
                        onChange={(e) => {
                          console.log("e: ", e.target.value);
                          this.setState({ mob: e.target.value });
                        }}
                      >
                        <Input
                          className="pl-10"
                          style={{ width: "calc(100% - 0px)" }}
                          // value={mobile_no}
                        />
                      </Form.Item>
                    </div>
                  </Form.Item>
                  {this.showVrifyContactOption() && (
                    <Col span={24}>
                      <label
                        onClick={() => {
                          let currentField =
                            this.formRef.current.getFieldsValue();
                          this.validatePhone(currentField.mobile_no);
                        }}
                      >
                        <span className="verfy-mob-no">
                          Verfiy Phone Number
                        </span>
                      </label>
                    </Col>
                  )}
                  {/* <Form.Item label="Contact Number">
                    <div className="spa-contact-number">
                      <Select
                        value="+91"
                        style={{
                          width: 110,
                          borderRight: "1px solid #55636D",
                          zIndex: "9",
                          textAlign: "center",
                        }}
                      >
                        <Option value="+91">+91</Option>
                        <Option value="+1">Aussdf</Option>
                      </Select>
                      <Form.Item
                        // name="mobile_no"
                        rules={[{ validator: validMobile }]}
                      >
                        <Input
                          className="pl-10"
                          style={{ width: "calc(100% - 5px)" }}
                          //   value={mobile_no}
                        />
                      </Form.Item>
                    </div>
                  </Form.Item>
                 */}
                  {/* <Col span={12}>
                  <Form.Item label="Contact Number" name="mobile_no">
                    <Input type={"text"} />
                  </Form.Item>
                </Col> */}
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
                      (business_location === "" ||
                        business_location == undefined ||
                        business_location === null) && [required("Address")]
                    }
                  >
                    <PlacesAutocomplete
                      name="address"
                      handleAddress={this.handleAddress}
                      addressValue={business_location}
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
              {/* <Row gutter={28}>
                            <Col xs={24} sm={12} md={12} lg={24}>
                                <Title level={4} className=''>Business Information</Title>
                            
                                <Form.Item
                                name={`description`}
                                label='Business Information'
                                rules={[required('Business Information')]}
                                >

                                <BraftEditor
                                    value={editorState1}
                                    controls={controls}
                                    onChange={(e) => this.handleEditorChange(e, 1)}
                                    contentStyle={{ height: 150 }}
                                className={'input-editor braft-editor'}
                                />

                                </Form.Item>
                            </Col>
                        
                        
                            <Col xs={24} sm={12} md={12} lg={12} className="upload-cover-photo">
                            <Title level={4} className=''>Upload Cover Photos </Title>
                            <div className="discription">Add up to 8 images or upgrade to include more.<br />
                            Hold and drag to reorder photos. Maximum file size 4MB.</div>
                            <Form.Item
                            name='image'
                            className='label-large mt-10'
                            >

                            <Upload
                                name='avatar'
                                listType='picture-card'
                                className='avatar-uploader'
                                showUploadList={true}
                                fileList={fileList}
                                customRequest={this.dummyRequest}
                                onChange={this.handleImageUpload}
                                id='fileButton'
                            >
                                {fileList.length >= 8 ? null : uploadButton}

                            </Upload>
                            </Form.Item>
                        </Col>
                        </Row> */}
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
              {/* <Divider /> */}
              <Form.Item shouldUpdate className="submit">
                {() => (
                  <div className="step-button-block retail-vendor-pro-footer">
                    <Button
                      type="primary"
                      htmlType="submit"
                      // disabled={
                      //   !this.props.form.isFieldsTouched(true) ||
                      //   this.props.form.getFieldsError().filter(({ errors }) => errors.length)
                      //   .length > 0
                      // }
                      // disabled={
                        // this.formRef.current &&
                        // this.formRef.current
                        //   .getFieldsError()
                        //   .filter(({ errors }) => errors.length).length > 0
                      // }
                    >
                      Next Step
                    </Button>
                  </div>
                )}
              </Form.Item>
              {/*<div className="step-button-block retail-vendor-pro-footer">
                <Button
                  htmlType="submit"
                  type="primary"
                  size="middle"
                  className="btn-blue"
                >
                  Next Step
                </Button>
                    </div>*/}
            </Form>
            {otpModalVisible && (
              <SendOtpModal
                visible={otpModalVisible}
                onCancel={() => this.setState({ otpModalVisible: false })}
                // mobileNo={mobileNo}
                mobileNo={this.formRef.current.getFieldsValue().mobile_no}
                callNext={(varify) => this.setState({ isNumberVarify: varify })}
                editNumberAPI={this.changeMobile}
                phonecode={phonecode}
                currentField={this.formRef.current.getFieldsValue()}
                getUserDetails={this.getUserDetails}
                retryIn={retryIn}
                resendOtp={() => this.varifyNumber()}
              />
            )}
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
    loggedInUserDetails:
      profile.userProfile !== null ? profile.userProfile : null,

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
