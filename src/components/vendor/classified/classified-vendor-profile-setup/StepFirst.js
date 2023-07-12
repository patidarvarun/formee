import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import validator from "validator";
import {
  Button,
  Upload,
  message,
  Avatar,
  Spin,
  Row,
  Typography,
  Select,
  Form,
  Input,
  Col,
} from "antd";
import { LoadingOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { langs } from "../../../../config/localization";
import {
  getUserProfile,
  changeUserName,
  changeMobNo,
  logout,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
} from "../../../../actions/index";
import { DEFAULT_IMAGE_TYPE, TEMPLATE } from "../../../../config/Config";
import {
  required,
  email,
  validMobile,
} from "../../../../config/FormValidation";
import PlacesAutocomplete from "../../../common/LocationInput";
import { converInUpperCase, dateFormate5 } from "../../../common";
import SendOtpModal from "../../../common/SendOtpModal";
import UploadCompanyLogo from "./UploadCompanyLogo";

const spinIcon = (
  <img
    src={require("./../../../../assets/images/loader1.gif")}
    alt=""
    style={{ width: "64px", height: "64px" }}
  />
);
const { Title, Text } = Typography;

const { Option } = Select;

class StepFirst extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitBussinessForm: false,
      submitFromOutside: false,
      imageUrl: "",
      key: 1,
      value: "",
      postal_code: "",
      number: "",
      firstName: "",
      buisnessName: "",
      lastName: "",
      mobileNo: "",
      otpModalVisible: false,
      isNumberVarify: false,
      isVisible: true,
      isDisabled: false,

      address: "",
      latLng: "",
      state: "",
      city: "",
      pincode: "",
      country: "",
      country_code: "",
      state_code: "",

      phonecode: "+61",
      retryIn: 0,
    };
  }
  formRef = React.createRef();

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    if (this.props.userDetails) {
      const { userDetails } = this.props;

      //----Update changed Mobile no
      let currentNo = this.props.userDetails.mobile_no;
      let changedNo = nextprops.userDetails.mobile_no;
      if (currentNo !== changedNo) {
        this.setState({ savedMobile: changedNo });
      }
      //----------------------------
      let splitedName = [];
      let lastNameArray = [];
      let lname = "";
      if (userDetails.name !== undefined) {
        splitedName = userDetails.name.split(" ");
        splitedName.map((el, index) => {
          if (index > 0) {
            lastNameArray.push(splitedName[index]);
          }
        });
        lname = lastNameArray.toString().replace(",", " ");
      }
      let firstName =
        Array.isArray(splitedName) && splitedName.length ? splitedName[0] : "";
      let lastName =
        Array.isArray(splitedName) && splitedName.length > 1 ? lname : "";

      this.setState({
        address: userDetails.business_location,
        imageUrl:
          userDetails.image !== undefined
            ? userDetails.image
            : DEFAULT_IMAGE_TYPE,
        firstName: firstName,
        lastName: lastName,
        buisnessName: userDetails.business_name,
        isNumberVarify: userDetails.mobile_no_verified === 1 ? true : false,
        phonecode: userDetails.phonecode ? userDetails.phonecode : "+61",
      });
    }
    this.checkSubmitValidation();
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  // componentWillReceiveProps(nextprops, prevProps) {
  //   let catIdInitial = this.props.userDetails
  //   let catIdNext = nextprops.userDetails.address
  //   if (catIdInitial !== catIdNext) {
  //     this.setState({
  //       address: nextprops.userDetails.address
  //     })
  //
  //   }
  // }

  /**
   * @method componentDidMount
   * @description called to
   */
  componentDidMount() {
    if (this.props.userDetails) {
      const { userDetails } = this.props;
      this.setState({
        isNumberVarify: userDetails.mobile_no_verified === 1 ? true : false,
        phonecode: userDetails.phonecode ? userDetails.phonecode : "+61",
      });
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
          address
        });
      }
    });
    this.changeAddress(
      address,
      latLng,
      state,
      city,
      pincode,
      country,
      country_code,
      state_code
    );
  };

  onClearAddress = () => {
    this.formRef.current.setFieldsValue({ pincode: "" });
    this.setState({ isDisabled: true });
    return;
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
    this.setState({ address: "" });
    this.formRef.current.setFieldsValue({
      name: "",
      email: "",
      mobile_no: "",
      address: "",
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
   * @method getUserDetails
   * @description call to get user details by Id
   */
  getUserDetails = () => {
    const { id } = this.props.loggedInUser;
    this.props.getUserProfile({ user_id: id });
    // this.setState({ isDisabled: false });
  };

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
        if (res.status === 1) {
          toastr.success(
            langs.success,
            langs.messages.profile_image_update_success
          );
          this.getUserDetails();
          this.setState({
            imageUrl: res.data.image,
            loading: false,
          });
        }
      });
    }
  };

  /**
   * @method changeAddress
   * @description Split out Address city post code
   */
  changeAddress = (
    address,
    latLng,
    state,
    city,
    pincode,
    country,
    country_code,
    state_code
  ) => {
    const { id } = this.props.loggedInUser;
    if (country && state_code && city && pincode) {
      let reqBody = {
        user_id: id,
        location: address,
        latitude: latLng.lat,
        longitude: latLng.lng,
        pincode,
        state,
        city,
        country,
        country_code,
        state_code,
      };
      this.props.changeAddress(reqBody, (res) => {
        if (res.status === 1) {
          this.setState({
            address,
            latLng,
            state,
            city,
            pincode,
            country,
            country_code,
            state_code,
          });
          this.getUserDetails();
          toastr.success(langs.success, langs.messages.address_update_success);
        }
      });
    } else {
      toastr.warning("Please enter your full address");
    }
  };

  /**
   * @method changeUserName
   * @description calling on Blur Event on name
   */
  changeUserName = (e) => {
    const { id } = this.props.userDetails;
    const { lastName, firstName, buisnessName } = this.state;
    let target = e.target.id;
    let targetValue = e.target.value;

    if (!e.target.value.trim()) return;
    if (e.target.id == "fname" && e.target.value === firstName) return;
    if (e.target.id == "lname" && e.target.value === lastName) return;
    if (e.target.id == "business_name" && e.target.value === buisnessName)
      return;
    let reqData = {
      user_id: id,
      fname: e.target.id == "fname" ? e.target.value : firstName,
      lname: e.target.id == "lname" ? e.target.value : lastName,
      business_name:
        e.target.id == "business_name" ? e.target.value : buisnessName,
      name:
        e.target.id == "fname"
          ? `${e.target.value} ${this.state.lastName}`
          : e.target.id == "lname"
          ? `${this.state.firstName} ${e.target.value}`
          : "",
    };

    this.props.changeUserName(reqData, (res) => {
      if (res.status === 200) {
        this.getUserDetails();

        toastr.success(langs.success, langs.messages.username_update_success);
        if (target == "fname") {
          this.setState({
            firstName: targetValue,
            // isDisabled: false
          });
        } else if (target == "lname") {
          this.setState({
            lastName: targetValue,
            // isDisabled: false
          });
        } else if (target == "business_name") {
          this.setState({
            buisnessName: targetValue,
            // isDisabled: false
          });
        }
      }
    });
  };

  /**
   * @method changeMobile
   * @description handle mon no change
   */
  changeMobile = (e) => {
    const { id, mobile_no } = this.props.userDetails;
    const { isNumberVarify, isVisible } = this.state;

    this.setState({ mobileNo: e.target.value });

    if (!e.target.value.trim()) {
      // this.setState({isVisible: false})
      return;
    } else if (e.target.value === mobile_no) {
      // this.setState({isVisible: false})
      return;
    }
    
    var IndNum = /^[0]?[0-9]+$/;
    if (
      IndNum.test(e.target.value) &&
      e.target.value.length >= 10 &&
      e.target.value.length <= 12
    ) {
      // this.setState({isVisible: true})
      // if(this.state.isNumberVarify){
      this.props.changeMobNo(
        { user_id: id, phonecode: +61, mobileno: e.target.value },
        (res) => {
          if (res.status === 200) {
            this.getUserDetails();
            toastr.success(
              langs.success,
              langs.messages.mobile_number_update_success
            );
          }
        }
      );
    }
    // }
    // else {
    //   this.setState({isVisible: false})
    // }
  };

  /**
   * @method changeEmail
   * @description handle Email address change
   */
  changeEmail = (e) => {
    const { id, email } = this.props.loggedInUser;

    if (!e.target.value.trim()) return;
    if (e.target.value === email) return;
    this.props.changeEmail({ user_id: id, email: e.target.value }, (res) => {
      if (res.status === 200) {
        this.getUserDetails();
        this.props.logout();
        toastr.success(langs.success, res.data.msg);
      }
    });
  };

  /**
   * @method showVrifyContactOption
   * @description handle show/disable verify link of contact
   */
  showVrifyContactOption = () => {
    const { isNumberVarify, savedMobile } = this.state;
    const { mobile_no } = this.props.userDetails;

    if (!isNumberVarify) {
      return true;
    } else if (mobile_no !== this.formRef.current.getFieldsValue().mobile_no) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    if (this.props.userDetails) {
      const {
        name,
        image,
        business_location,
        address,
        mobile_no,
        email,
        pincode,
        fname,
        lname,
        business_name,
      } = this.props.userDetails;
      let splitedName = [];
      let lastNameArray = [];
      let laname = "";
      if (name !== undefined) {
        splitedName = name.split(" ");
        splitedName.map((el, index) => {
          if (index > 0) {
            lastNameArray.push(splitedName[index]);
          }
        });
        laname = lastNameArray.toString().replace(",", " ");
      }
      // const { firstName, lastName } = this.state;

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
        email,
        image,
        address: business_location,
        //   this.props.loggedInUser.user_type === 'private' ? address : business_location,
        mobile_no,
        pincode,
        fname: firstName,
        lname: lastName,
        business_name,
      };
      return temp;
    } else {
      return {};
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
   * @method onFinishFailed
   * @description handle on submit failed
   */
  onFinishFailed = (errorInfo) => {
    console.log("errorInfo", errorInfo);
    // this.setState({ isDisabled: true });
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

  onFinish = (value) => {
    const {
      address,
      latLng,
      state,
      city,
      pincode,
      country,
      country_code,
      state_code,
    } = this.state;
    let step1Data = value;
    step1Data.address = address;
    step1Data.latLng = latLng;
    step1Data.state = state;
    step1Data.city = city;
    step1Data.pincode = pincode;
    step1Data.country = country;
    step1Data.country_code = country_code;
    step1Data.state_code = state_code;
    //this.setState({ isDisabled: false }, () => {
    this.props.nextStep(step1Data, 1);
    //  });
  };

  checkSubmitValidation = (e) => {
    let currentValues = this.formRef.current.getFieldsValue();

    let emptyValues = Object.keys(currentValues).reduce(function (r, e) {
      if (!currentValues[e]) r[e] = currentValues[e];
      return r;
    }, {});

    let formRefErrorsCount = this.formRef.current
      .getFieldsError()
      .filter(({ errors }) => errors.length).length;
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      emptyValues &&
      Object.keys(emptyValues).length === 0 &&
      Object.getPrototypeOf(emptyValues) === Object.prototype &&
      !formRefErrorsCount > 0 &&
      currentValues.mobile_no.length > 9 &&
      currentValues.mobile_no.length < 13 &&
      emailPattern.test(String(currentValues.email).toLowerCase())
    ) {
      this.setState({
        isDisabled: false,
      });
    } else {
      this.setState({
        isDisabled: true,
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { userDetails, loggedInUser } = this.props;
    if (userDetails) {
      const { name, mobile_no, fname, lname, member_since, address } =
        this.props.userDetails;
      const {
        isDisabled,
        key,
        imageUrl,
        loading,
        mobileno,
        otpModalVisible,
        mobileNo,
        phonecode,
        retryIn,
        isNumberVarify,
      } = this.state;
      return (
        <Fragment className="stepfirst">
          <Row className="body-logo-pass-header">
            <Col md={16}>
              <div className="upload-profile--box upload-profile--box-v2 pt-35 pb-40">
                <div className="upload-profile-pic">
                  {imageUrl ? (
                    <Avatar size={91} src={imageUrl} />
                  ) : (
                    <Avatar size={91} icon={<UserOutlined />} />
                  )}
                </div>
                <div className="upload-profile-content">
                  <Title level={4}>{`${converInUpperCase(name)}`}</Title>

                  <Text className="fs-11">
                    {/* {this.props.userDetails.address} */}
                    (Member since {member_since && dateFormate5(member_since)})
                  </Text>
                  <div className="mt-20">
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
                          <Link to="#" className="text-orange upload-profile">
                            Upload profile photo
                          </Link>
                        </div>
                      </div>
                    </Upload>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={8} className="text-right">
              <Link to="/change-password" className="change-password">
                <svg
                  width="10"
                  height="13"
                  viewBox="0 0 10 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.21859 3.54167C3.21859 2.41984 4.12801 1.51042 5.24984 1.51042C6.37167 1.51042 7.28109 2.41984 7.28109 3.54167V4.89583H3.21859V3.54167ZM1.86442 4.89583L1.86442 3.54167C1.86442 1.67195 3.38012 0.15625 5.24984 0.15625C7.11955 0.15625 8.63525 1.67195 8.63525 3.54167L8.63525 4.89583C9.38314 4.89583 9.98942 5.50211 9.98942 6.25V10.9896C9.98942 11.7375 9.38314 12.3438 8.63525 12.3438H1.86442C1.11654 12.3438 0.510254 11.7375 0.510254 10.9896V6.25C0.510254 5.50211 1.11654 4.89583 1.86442 4.89583ZM1.86442 10.9896V6.25L8.63525 6.25V10.9896H1.86442Z"
                    fill="#2F80ED"
                  />
                </svg>
                Change Password
              </Link>
              {/* <Button className="btn-orange subscribe-btn">Subscription</Button> */}
            </Col>
          </Row>

          <div>
            {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Title level={4} className='mb-30'>Profile Information</Title>
              <Link to='/change-password'><LockOutlined /> Change Password</Link>
            </div> */}
            <Form
              ref={this.formRef}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              scrollToFirstError
              initialValues={this.getInitialValue()}
              layout={"vertical"}
              className="pr-55"
            >
              <Row gutter={28}>
                {/* <Col md={12}>
                  <Form.Item
                    label="Business Name"
                    name="business_name"
                    rules={[required("Bussiness name")]}
                    onBlur={this.changeUserName}
                  >
                    <Input />
                  </Form.Item>
                </Col> */}

                <Col md={12}>
                  <Form.Item
                    label="First Name"
                    name="fname"
                    rules={[required("Contact name")]}
                    onChange={this.checkSubmitValidation}
                    onBlur={this.changeUserName}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={12} className="contact-hidden-label">
                  <Form.Item
                    label="Last Name"
                    name="lname"
                    rules={[required("Contact name")]}
                    onChange={this.checkSubmitValidation}
                    onBlur={this.changeUserName}
                  >
                    <Input />
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
                          borderRight: "1px solid #E3E9EF",
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
                        onBlur={this.changeMobile}
                        onChange={(e) => {
                          this.setState({ isVisible: true });
                          this.checkSubmitValidation();
                        }}
                      >
                        <Input
                          className="pl-10"
                          style={{ width: "calc(100% - 0px)" }}
                          value={mobile_no}
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
                        {/* <span className="verfy-mob-no">
                          Verfiy Phone Number
                        </span> */}
                      </label>
                    </Col>
                  )}
                </Col>
                {/* <Col span={12}>
                  <Form.Item
                    label='Contact Number'
                    name='mobile_no'
                    rules={[{ validator: validMobile }]}
                    onBlur={this.changeMobile}
                  >
                    <Input type={'text'} />
                  </Form.Item>
                   {isVisible && <label  onClick={this.varifyNumber} className='blue-link'>Verify number</label>} 
                </Col> */}
                <Col md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[required("Email id"), email]}
                    onChange={this.checkSubmitValidation}
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
                    rules={[required("Address")]}
                  >
                    <PlacesAutocomplete
                      name="address"
                      handleAddress={this.handleAddress}
                      addressValue={this.getInitialValue().address}
                      // addressValue={address}
                      clearAddress={this.onClearAddress}
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

              {loggedInUser.role_slug === TEMPLATE.JOB && <UploadCompanyLogo />}

              <Form.Item className="submitbutton">
                {/* {loggedInUser.user_type !== 'private' && ( */}
                <div className="steps-action align-center">
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="middle"
                    className={isDisabled ? "btn-blue btn-disable" : "btn-blue"}
                    disabled={isDisabled}
                  >
                    Next Step
                  </Button>
                </div>
                {/* )} */}
              </Form.Item>
            </Form>
          </div>

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
        </Fragment>
      );
    } else {
      return <Spin tip="Loading..." indicator={spinIcon} spinning={true} />;
    }
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
  };
};
export default connect(mapStateToProps, {
  getUserProfile,
  logout,
  changeUserName,
  changeMobNo,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
})(StepFirst);
