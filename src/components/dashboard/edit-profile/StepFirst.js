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
  form,
  Row,
  Typography,
  Divider,
  Space,
} from "antd";
import { LoadingOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Col } from "antd";
import { langs } from "../../../config/localization";
import {
  getUserProfile,
  changeUserName,
  changeMobNo,
  logout,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
} from "../../../actions/index";
import { DEFAULT_IMAGE_TYPE } from "../../../config/Config";
import {
  required,
  email,
  minLength,
  maxLength,
  validatePhoneNumber,
  validMobile,
} from "../../../config/FormValidation";
import PlacesAutocomplete from "../../common/LocationInput";
import { converInUpperCase } from "../../common";
import SendOtpModal from "../../common/SendOtpModal";
const spinIcon = (
  <img
    src={require("./../../../assets/images/loader1.gif")}
    alt=""
    style={{ width: "64px", height: "64px" }}
  />
);
const { Title, Text } = Typography;

class StepFirst extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitBussinessForm: false,
      submitFromOutside: false,
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
    };
  }
  formRef = React.createRef();

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentWillMount() {
    if (this.props.userDetails) {
      const { userDetails } = this.props;
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
        address: userDetails.address,
        imageUrl:
          userDetails.image !== undefined
            ? userDetails.image
            : DEFAULT_IMAGE_TYPE,
        firstName: firstName,
        lastName: lastName,
      });
    }
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
   * @method componentDidUpdate
   * @description called to submit form
   */
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.submitFromOutside !== this.props.submitFromOutside) {
  //     this.setState({ address: '' })
  //     this.onClearAll();
  //   }
  // }

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
    this.changeAddress(address, latLng, state, city, pincode);
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
  changeAddress = (add, latLng, state, city, pincode) => {
    const { id } = this.props.loggedInUser;
    let reqBody = {
      user_id: id,
      location: add,
      latitude: latLng.lat,
      longitude: latLng.lng,
      pincode,
      state,
      city,
    };
    this.props.changeAddress(reqBody, (res) => {
      if (res.status === 1) {
        this.setState({ address: add });
        this.getUserDetails();
        toastr.success(langs.success, langs.messages.address_update_success);
      }
    });
  };

  /**
   * @method changeUserName
   * @description calling on Blur Event on name
   */
  changeUserName = (e) => {
    const { id } = this.props.userDetails;
    const { lastName, firstName } = this.state;
    let target = e.target.id;
    let targetValue = e.target.value;

    if (!e.target.value.trim()) return;
    if (e.target.id == "editProfile_fname" && e.target.value === firstName)
      return;
    if (e.target.id == "editProfile_lname" && e.target.value === lastName)
      return;
    let reqData = {
      user_id: id,
      fname: e.target.id == "editProfile_fname" ? e.target.value : firstName,
      lname: e.target.id == "editProfile_lname" ? e.target.value : lastName,
      name:
        e.target.id == "editProfile_fname"
          ? `${e.target.value} ${this.state.lastName}`
          : e.target.id == "editProfile_lname"
          ? `${this.state.firstName} ${e.target.value}`
          : "",
    };

    this.props.changeUserName(reqData, (res) => {
      if (res.status === 200) {
        this.getUserDetails();

        toastr.success(langs.success, langs.messages.username_update_success);
        if (target == "editProfile_fname") {
          this.setState({ firstName: targetValue });
        } else if (target == "editProfile_lname") {
          this.setState({ lastName: targetValue });
        }
      }
    });
  };

  /**
   * @method changeMobile
   * @description handle mon no change
   */
  changeMobile = (e) => {
    this.setState({ mobileNo: e.target.value });
    const { id, mobile_no } = this.props.userDetails;
    if (!e.target.value.trim()) {
      // this.setState({isVisible: false})
      return;
    }
    if (e.target.value === mobile_no) {
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
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    if (this.props.userDetails) {
      const {
        name,
        image,
        business_loc,
        address,
        mobile_no,
        email,
        pincode,
        fname,
        lname,
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
        // business_loc,
        mobile_no,
        pincode,
        fname: firstName,
        lname: lastName,
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
    const { mobileNo } = this.state;
    this.props.sendOtp(mobileNo, (res) => {
      // toastr.success('success', 'otp has been sent successfully')
      this.setState({ otpModalVisible: true });
      if (res.data.status === "SUCCESS") {
      } else {
        toastr.error("error", res.data.message);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    if (this.props.userDetails) {
      const { name, mobile_no, fname, lname, member_since, address } =
        this.props.userDetails;
      const {
        key,
        imageUrl,
        loading,
        mobileno,
        otpModalVisible,
        mobileNo,
        isVisible,
      } = this.state;

      return (
        <Fragment>
          <div className="upload-profile--box">
            <div className="upload-profile-pic">
              {imageUrl ? (
                <Avatar size={91} src={imageUrl} />
              ) : (
                <Avatar size={91} icon={<UserOutlined />} />
              )}
            </div>
            <div className="upload-profile-content">
              <Title level={4} className="mb-10">{`${converInUpperCase(
                name
              )}`}</Title>

              <Text className="fs-11">
                {/* {this.props.userDetails.address} */}
                (Member since {member_since})
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Title level={4} className="mb-30">
                Profile Information
              </Title>
              <Link to="/change-password">
                <LockOutlined /> Change Password
              </Link>
            </div>
            <Form
              ref={this.formRef}
              id="form1"
              name="editProfile"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              scrollToFirstError
              initialValues={this.getInitialValue()}
              layout={"vertical"}
            >
              <Row gutter={28}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name="fname"
                    rules={[required("First name")]}
                    onBlur={this.changeUserName}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    name="lname"
                    rules={[required("Last name")]}
                    onBlur={this.changeUserName}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={28}>
                <Col span={12}>
                  <Form.Item
                    label="Contact Number"
                    name="mobile_no"
                    rules={[{ validator: validMobile }]}
                    // onChange={(e) => this.setState({mobileNo: e.target.value})}
                    //, minLength(10), maxLength(12)
                    // rules= {[ { required: true,  type: 'regexp', pattern: new RegExp('^[0-9]*$'), message: 'Wrong format!' } ]}
                    onBlur={this.changeMobile}
                    // onChange={this.changeMobile}
                  >
                    <Input type={"text"} />
                  </Form.Item>
                  {/* {isVisible && <label  onClick={this.varifyNumber} className='blue-link'>Verify number</label>} */}
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
                    // rules={[required('Address')]}
                  >
                    <PlacesAutocomplete
                      name="address"
                      handleAddress={this.handleAddress}
                      addressValue={address}
                      // addressValue={address}
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
            </Form>
            {/* <Divider /> */}
          </div>
          {/* <div className='steps-action align-center mt-50 pt-20 mb-32'>

          {key === 1 && <Button disabled htmlType='submit' type='primary' form='personal-form' size='middle' className='btn-blue' onClick={() => this.props.nextStep()}>
            NEXT
        </Button>}
          {key === 2 && <Button disabled htmlType='submit' type='primary' form='bussiness-form' size='middle' className='btn-blue' onClick={() => this.props.nextStep()}>
            NEXT
        </Button>}
        </div> */}
          {otpModalVisible && (
            <SendOtpModal
              visible={otpModalVisible}
              onCancel={() => this.setState({ otpModalVisible: false })}
              mobileNo={mobileNo}
              callNext={(varify) => this.setState({ isNumberVarify: varify })}
              editNumberAPI={this.changeMobile}
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
