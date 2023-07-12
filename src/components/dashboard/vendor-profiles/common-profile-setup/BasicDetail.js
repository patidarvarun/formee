import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import validator from "validator";
import {
  Button,
  Spin,
  Upload,
  message,
  Avatar,
  form,
  Row,
  Typography,
  Divider,
  Space,
  Select,
} from "antd";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Col } from "antd";
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
import {
  getCustomLocalStorage,
  setCustomLocalStorage,
} from "../../../../common/Methods";
import {
  converInUpperCase,
  dateFormate,
  getAddress,
  dateFormate5,
} from "../../../common";
import Icon from "../../../customIcons/customIcons";
const spinIcon = (
  <img
    src={require("./../../../../assets/images/loader1.gif")}
    alt=""
    style={{ width: "64px", height: "64px" }}
  />
);
const { Title, Text } = Typography;

const { Option } = Select;

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

class BasicDetail extends React.Component {
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
      country: "",
      country_code: "",
      state: "",
      state_code: "",
      pincode: "",
      city: "",
      formerror: {
        bussiness_name: false,
        fname: false,
        lname: false,
        mobile_no: false,
        address: false,
        email: false,
        pincode: false,
      },
    };
  }
  formRef = React.createRef();

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    if (this.props.userDetails) {
      const { userDetails, restaurantDetail, loggedInUser } = this.props;
      const { business_location, business_city, business_state } =
        userDetails.user;
      if (business_location !== undefined) {
        let loc = business_location ? business_location : "";
        let city = business_city ? business_city : "";
        let state = business_state ? business_state : "";
        let full_add = "";
        full_add = `${loc}`;
        this.formRef.current.setFieldsValue({
          address:
            loggedInUser.user_type === "restaurant"
              ? restaurantDetail.address
                ? restaurantDetail.address
                : restaurantDetail.user.business_location
              : full_add,
        });
        this.setState({
          address:
            loggedInUser.user_type === "restaurant"
              ? restaurantDetail.address
                ? restaurantDetail.address
                : restaurantDetail.user.business_location
              : full_add,
          imageUrl:
            userDetails.image !== undefined
              ? userDetails.image
              : DEFAULT_IMAGE_TYPE,
        });
      }
      // let temp = {...userDetails.user}
      // let tmp3 = {...this.state.formerror}
      // tmp3.bussiness_name =   temp.business_name ? false : true;
      // tmp3.fname =   temp.fname ? false : true;
      // tmp3.lname =   temp.lname ? false : true;
      // tmp3.mobile_no =   temp.mobile_no ? false : true;
      // // tmp3.address =   this.state.address ? false : true;
      // tmp3.email =   temp.email ? false : true;
      // tmp3.pincode =   temp.pincode ? false : true;
      // if(userDetails){this.setState({
      //   formerror: tmp3
      // })}
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
    this.setState((prevState) => {
      let formerror = Object.assign({}, prevState.formerror);
      formerror.address = false;
      return {
        formerror,
        pincode: pincode,
        address,
        state: state,
        country: country,
        country_code: country_code,
        state_code: state_code,
        city: city,
      };
    });
    // this.setState({
    //   pincode: pincode,
    //   address,
    //   state: state,
    //   country: country,
    //   country_code: country_code,
    //   state_code: state_code,
    //   city: city,
    // });
    // this.changeAddress(address, latLng, state, city, pincode)
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
   * @method handleImageChange
   * @description handle Image change
   */
  handleImageChange = (info) => {
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
    // this.props.changeAddress(reqBody, (res) => {
    //     if (res.status === 1) {
    //         this.setState({ address: add })
    //         this.getUserDetails()
    //         toastr.success(langs.success, langs.messages.address_update_success)
    //     }
    // })
  };
  handleChange = (e) => {
    let tmp = { ...this.state.formerror };
    tmp[e.target.name] = e.target.value ? false : true;
    this.setState({
      formerror: tmp,
    });
  };

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    let tmp = getCustomLocalStorage("basicdetail");
    const { userDetails, restaurantDetail, loggedInUser } = this.props;
    let tmp2 = tmp
      ? Object.assign({}, { ...userDetails }, { ...tmp })
      : userDetails;
    const {
      name,
      image,
      business_loc,
      mobile_no,
      email,
      pincode,
      fname,
      lname,
    } = tmp2;
    if (loggedInUser.user_type === "restaurant") {
      let Name =
        restaurantDetail && restaurantDetail.contact_name
          ? restaurantDetail.contact_name
          : restaurantDetail.user.name;
      // let Name = restaurantDetail.user.name
      let splitedName = [];
      let lastNameArray = [];
      let laname = "";
      if (Name !== undefined) {
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
        name: Name,
        bussiness_name: restaurantDetail.business_name
          ? restaurantDetail.business_name
          : restaurantDetail.user.name,
        email: restaurantDetail.email
          ? restaurantDetail.email
          : restaurantDetail.user.email,
        image,
        mobile_no: restaurantDetail.contact_number
          ? restaurantDetail.contact_number
          : userDetails.user.contact_number,
        pincode: userDetails.user.business_pincode,
        fname: firstName,
        lname: lastName,
      };
      return temp;
    } else {
      const { contact_name } = this.props.userDetails.user.trader_profile;

      let Name = contact_name;
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
        // address:'userDetails.user.business_location',
        mobile_no: userDetails.user.contact_number,
        pincode: userDetails.user.business_pincode,
        fname: firstName,
        lname: lastName,
      };
      return temp;
    }
  };

  /**
   * @method on finish
   * @description varify number
   */
  onFinish = (value) => {
    const { city, address, country, country_code, state, state_code, pincode,lname,mobile_no } =
      this.state;
      console.log('ids',this.state)
    if (country_code && state_code && city && pincode) {
      value.address = address;
      value.country = country;
      value.country_code = country_code;
      value.state = state;
      value.state_code = state_code;
      value.pincode = pincode;
      value.city = city;
      value.contact_name = `${value.fname} ${value.lname}`;
      setCustomLocalStorage("basicdetail", value);
      this.props.nextStep(value);
      // this.props.saveTraderProfile(value)
    
    } else {
      toastr.warning("Please enter your full address.");
    }
  };

  /**
   * @method getCurrentLocation
   * @description get current location
   */
  getCurrentLocation = () => {
    const { lat, long } = this.props;
    getAddress(lat, long, (res) => {
      let state = "";
      let city = "";
      let pincode = "";
      res.address_components.map((el) => {
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

      let address = {
        location: res.formatted_address,
        lat: lat,
        lng: long,
        state_id: state,
        subregions_id: city,
      };
      this.setState({ data: address, address: res.formatted_address });
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { loggedInUser } = this.props;
    let profileCheck =
      loggedInUser.user_type === langs.key.restaurant
        ? this.props.restaurantDetail && this.props.userDetails
        : this.props.userDetails;
    if (profileCheck) {
      const { userDetails, restaurantDetail } = this.props;
      let mobile_no =
        loggedInUser.user_type === "restaurant"
          ? restaurantDetail.contact_number
            ? restaurantDetail.contact_number
            : userDetails.user.contact_number
          : userDetails.user && userDetails.user.contact_number;
      const { trader_profile } = userDetails
        ? userDetails.user
        : { trader_profile: {} };
      const { loading, address } = this.state;
      const { business_location, business_city, business_state } =
        userDetails.user;
      let address1 =
        loggedInUser.user_type === "restaurant"
          ? restaurantDetail.address
            ? restaurantDetail.address
            : restaurantDetail.user.business_location
          : business_location
          ? business_location
          : "";
      let restaurant = loggedInUser.user_type === langs.key.restaurant;
      let beauty = loggedInUser.user_type === langs.userType.beauty;
      let wellbeing = loggedInUser.user_type === langs.userType.wellbeing;
      let eventUser = loggedInUser.user_type === langs.userType.events;
      let handyUser = loggedInUser.user_type === langs.userType.handyman;
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
                <div className="">
                  {!restaurant && (
                    <Title level={4}>{`${
                      trader_profile &&
                      trader_profile.contact_name &&
                      converInUpperCase(trader_profile.contact_name)
                    }`}</Title>
                  )}
                  {restaurant && restaurantDetail && (
                    <Title level={4}>
                      {restaurantDetail && restaurantDetail.contact_name
                        ? converInUpperCase(restaurantDetail.contact_name)
                        : restaurantDetail.user
                        ? converInUpperCase(restaurantDetail.user.name)
                        : ""}
                    </Title>
                  )}
                  <Text className="fs-11">
                    {/* {this.props.userDetails.address} */}
                    (Member since -
                    {restaurant
                      ? restaurantDetail &&
                        restaurantDetail.user &&
                        restaurantDetail.user.created_at
                        ? dateFormate5(restaurantDetail.user.created_at)
                        : trader_profile.created_at &&
                          dateFormate5(trader_profile.created_at)
                      : userDetails.user &&
                        userDetails.user.trader_profile &&
                        dateFormate(userDetails.user.trader_profile.created_at)}
                    )
                  </Text>
                  <div className="mt-10">
                    <Upload
                      name="avatar"
                      listType="picture"
                      className="ml-2"
                      showUploadList={false}
                      // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleImageChange}
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
                Change Password
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
              id="form1"
              name="editProfile"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              scrollToFirstError
              initialValues={this.getInitialValue()}
              layout={"vertical"}
              className="pt-10"
            >
              {/* {(eventUser || handyUser) ?  */}
              <Row gutter={28} className="fr-name-block">
                {/* {(!restaurant && !beauty && !wellbeing) && */}
                <Col span={12}>
                  <Form.Item
                    label="Business Name"
                    name="bussiness_name"
                    rules={[required("First name")]}
                    // onBlur={this.changeUserName}
                  >
                    <Input
                      name="bussiness_name"
                      onBlur={(e) => this.handleChange(e)}
                    />
                  </Form.Item>
                </Col>
                {/* } */}
                <Col md={6}>
                  <div class="ant-col ant-form-item-label">
                    <label className="ant-form-item-required">
                      Contact Name
                    </label>
                  </div>
                  <Form.Item
                    name="fname"
                    rules={[required("First name")]}
                    // onBlur={this.changeUserName}
                  >
                    <Input name="fname" onBlur={(e) => this.handleChange(e)} />
                  </Form.Item>
                </Col>
                <Col md={6} style={{ paddingLeft: 0 }}>
                  <div class="ant-col ant-form-item-label">
                    <label>&nbsp;</label>
                  </div>
                  <Form.Item
                    name="lname"
                    rules={[required("Last name")]}
                    // onBlur={this.changeUserName}
                  >
                    <Input name="lname" onBlur={(e) => this.handleChange(e)} />
                  </Form.Item>
                </Col>
              </Row>
              {/* : <Row gutter={28}>

                                    <Col span={12}>
                                        <Form.Item
                                            label='Bussiness Name'
                                            name='fname'
                                            rules={[required('First name')]}
                                        // onBlur={this.changeUserName}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label='First Name'
                                            name='fname'
                                            rules={[required('First name')]}
                                        // onBlur={this.changeUserName}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={!restaurant && !beauty && !wellbeing ? 6 : 12}>
                                        <Form.Item
                                            label='Last Name'
                                            name='lname'
                                            rules={[required('Last name')]}
                                        // onBlur={this.changeUserName}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                { </Row>} */}
              <Row gutter={28}>
                <Col span={12}>
                  <Form.Item label="Contact Number">
                    <div className="spa-contact-number">
                      <Select
                        defaultValue="+91"
                        style={{
                          width: 110,
                          borderRight: "1px solid #eeeeee",
                          zIndex: "9",
                          textAlign: "center",
                        }}
                      >
                        <Option value="+91">+91</Option>
                        <Option value="+1">Aus</Option>
                      </Select>
                      <Form.Item
                        name="mobile_no"
                        rules={[{ validator: validMobile }]}
                      >
                        <Input
                          className="pl-10"
                          style={{ width: "calc(100% - 0px)" }}
                          value={mobile_no}
                          name="mobile_no"
                          onBlur={(e) => this.handleChange(e)}
                        />
                      </Form.Item>
                    </div>
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
                    <Input name="email" onBlur={(e) => this.handleChange(e)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={28}>
                <Col span={12}>
                  <Form.Item
                    label="Address"
                    name="address"
                    // rules={(address === '' || address === undefined || address === 'N/A' || address === null) && [required('Address')]}
                  >
                    {console.log(
                      "🚀 ~ file: BasicDetail.js ~ line 783 ~ BasicDetail ~ render ~ address1",
                      address1
                    )}
                    {console.log(
                      "🚀 ~ file: BasicDetail.js ~ line 783 ~ BasicDetail ~ render ~ address",
                      address
                    )}
                    <PlacesAutocomplete
                      name="address"
                      handleAddress={this.handleAddress}
                      clearAddress={() => {
                        this.formRef.current.setFieldsValue({
                          address: "",
                        });
                        this.setState((prevState) => {
                          let formerror = Object.assign(
                            {},
                            prevState.formerror
                          );
                          formerror.address = true;
                          return {
                            formerror,
                            address: "",
                          };
                        });
                        // let tmp = {...this.state.formerror}
                        // tmp.address = true
                        // this.setState({
                        //     address: '',
                        //     formerror: tmp
                        // })
                      }}
                      addressValue={address ? address : address1}
                      user_type={loggedInUser.user_type}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Postcode"
                    name="pincode"
                    rules={[required("Pincode")]}
                  >
                    <Input
                      name="pincode"
                      disabled
                      onBlur={(e) => this.handleChange(e)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* <div
                                className='fs-14 text-blue use-current-location-text use-current-location-custom use-current-location-text'
                                onClick={this.getCurrentLocation}
                                style={{ cursor: 'pointer' }}
                            >
                                <Icon icon='location' size='13' />
                          Use my current location
                        </div> */}
              {/* <Divider /> */}
              <div className="step-button-block">
                <Button
                  htmlType="submit"
                  type="primary"
                  size="middle"
                  className="btn-blue"
                  disabled={
                    this.state.formerror.bussiness_name ||
                    this.state.formerror.fname ||
                    this.state.formerror.lname ||
                    this.state.formerror.mobile_no ||
                    this.state.formerror.address ||
                    this.state.formerror.email ||
                    this.state.formerror.pincode
                  }
                  // disabled={this.formRef.current && (!this.formRef.current.isFieldsTouched(true) ||
                  //   this.formRef.current.getFieldsError().filter(({ errors }) => errors.length)
                  //     .length > 0)}
                  //  onClick={() => this.props.nextStep()}
                >
                  Next Step
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
  const { auth, profile, bookings, common } = store;
  const { location } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    restaurantDetail:
      bookings && bookings.restaurantDetail ? bookings.restaurantDetail : "",
    lat: location ? location.lat : "",
    long: location ? location.long : "",
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
