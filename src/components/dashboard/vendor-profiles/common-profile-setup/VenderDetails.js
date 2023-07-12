import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import validator from "validator";
import {
  Button,
  Upload,
  Radio,
  message,
  Avatar,
  form,
  Row,
  Typography,
  Divider,
  Checkbox,
  Space,
  TreeSelect,
} from "antd";
import {
  LoadingOutlined,
  UserOutlined,
  LockOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Form, Input, Col, Select } from "antd";
import { langs } from "../../../../config/localization";
import {
  getEventVenuesList,
  getUserProfile,
  getEventTypes,
  getClassfiedCategoryListing,
  getBookingSubcategory,
  saveTraderProfile,
  changeUserName,
  changeMobNo,
  logout,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
  getServiceAreaOptions,
  getFitnessTypes,
} from "../../../../actions";
import { required, validNumber } from "../../../../config/FormValidation";
import BraftEditor from "braft-editor";
import PlacesAutocomplete from "../../../common/MultipleLocationInput";
import {
  setCustomLocalStorage,
  getCustomLocalStorage,
} from "../../../../common/Methods";
import "braft-editor/dist/index.css";
import Paragraph from "antd/lib/skeleton/Paragraph";
import "../myprofilestep.less";
import moment from "moment";
import { BASE_URL } from "../../../../config/Config";
const { Title, Text } = Typography;
const { Option } = Select;
const { SHOW_PARENT, SHOW_CHILD } = TreeSelect;

class EventProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitBussinessForm: false,
      submitFromOutside: false,
      imageUrl: "",
      checked: true,
      key: 1,
      value: "",
      address: "",
      postal_code: "",
      number: "",
      firstName: "",
      lastName: "",
      mobileNo: "",
      category: [],
      eventTypes: [],
      dietaries: [],
      booking_cat_id: "",
      booking_sub_cat_id: "",
      fileList: [],
      editorState1: BraftEditor.createEditorState("<p><p>"),
      editorState2: BraftEditor.createEditorState("<p><p>"),
      otpModalVisible: false,
      isNumberVarify: false,
      isVisible: true,
      trader_working_hours: [],
      selectedAmenities: [],
      is_public_closed: false,
      selectedAddress: [],
      eventTypes: [],
      durationOption: [],
      eventVenuesList: [],
      calValue: false
    };
  }
  formRef = React.createRef();

  /**
   * @method componentWillMount
   * @description called after render the component
   */
  componentWillMount() {
    const { userDetails, bookingList, loggedInUser } = this.props;
    let tmp = getCustomLocalStorage("vendordetails");
    let tmp2 = tmp
      ? Object.assign({}, { ...userDetails.user.trader_profile }, { ...tmp })
      : userDetails.user.trader_profile;
    const {
      fitness_amenities,
      is_public_closed,
      trader_service_images,
      booking_cat_id,
      booking_sub_cat_id,
      description,
      service_and_facilities,
    } = tmp2;

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

    let amenitiesIds = "";
    if (loggedInUser.user_type === "fitness") {
      amenitiesIds = fitness_amenities.map((f) => f.id);
    }
    this.setState({
      booking_cat_id,
      booking_sub_cat_id,
      editorState1: BraftEditor.createEditorState(description),
      editorState2: BraftEditor.createEditorState(service_and_facilities),
      trader_working_hours: userDetails.user.trader_working_hours,
      selectedAmenities: amenitiesIds,
      fileList: predefinedImages,
      is_public_closed: is_public_closed === 0 ? false : true,
    });

    if (booking_cat_id) {
      if (loggedInUser.user_type === "events") {
        this.getAllEventTypes(booking_cat_id);
      }
      this.props.getBookingSubcategory(booking_cat_id, (res) => {
        if (res.status === 200) {
          const data = Array.isArray(res.data.data) && res.data.data;
          this.setState({ subCategory: data });
        }
      });
    }

    if (booking_sub_cat_id) {
      this.props.getEventTypes(
        { booking_category_id: booking_sub_cat_id },
        (res) => {
          if (res.status === 200) {
            this.setState({
              eventTypes: res.data.event_types,
              dietaries: res.data.dietaries,
            });
          }
        }
      );
    }
    this.props.getEventVenuesList((venueResposne) => {
      if (venueResposne.status === 200) {
        this.setState({ eventVenuesList: venueResposne.data.data });
      }
    });
  }

  /**
   * @method componentDidUpdate
   * @description called to submit form
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.submitFromOutside !== this.props.submitFromOutside && this.props.submitFromOutside) {
      this.setState({ address: "" });
      this.onClearAll();
    }
  }

  /**
   * @method componentDidMount
   * @description called to submit form
   */
  componentDidMount() {
    this.props.getFitnessTypes();
    this.props.getServiceAreaOptions((res) => {
      if (res.status === 200) {
        let treeData = [];
        Object.entries(res.data.data).map(([k, value]) =>
          treeData.push({
            title: k,
            value: k,
            key: k,
            children: value.map((cities) => {
              return {
                title: cities,
                value: cities,
                key: cities,
              };
            }),
          })
        );
        this.setState({ durationOption: treeData });
      } else {
        toastr.error("Something went wrong");
      }
    });
    const { userDetails } = this.props;
    let tmp = getCustomLocalStorage("vendordetails");
    let tmp2 = tmp
      ? Object.assign({}, { ...userDetails.user.trader_profile }, { ...tmp })
      : userDetails.user.trader_profile;
    const {
      service_images,
    } = tmp2;
    if(service_images !== undefined)
     this.setState({fileList: service_images})
    }

  /**
   * @method onClear All Event Cleares all screen
   * @description clear all fields
   */
  onClearAll = () => {
    this.formRef.current.resetFields()
    this.formRef.current.setFieldsValue({
      description: BraftEditor.createEditorState("<p><p>"),
      service_and_facilities: BraftEditor.createEditorState("<p><p>"),
      service_type: [],
      service_area: [],
      service_available: [],
      venues: [],
      profile_dietary_ids: [],
      capacity_info: "",
      event_type_ids: [],
      features: "",
      select_amenities: "",
      image: "",
      basic_quote: "",
      rate_per_hour: "",
      is_public_closed: "",
      trader_working_hours: [],
    });
    this.setState({
      editorState: BraftEditor.createEditorState("<p><p>"),
      editorState1: BraftEditor.createEditorState("<p><p>"),
      editorState2: BraftEditor.createEditorState("<p><p>"),
      selectedAmenities: [],
      fileList: [],
      calValue: true
    });
    this.props.resetOutsideForm();
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
   * @method parentCategory
   * @description render booking category list
   */
  parentCategory = (category) => {
    return (
      category.length !== 0 &&
      category.map((keyName, i) => {
        return (
          <Option key={i} value={JSON.stringify(keyName)}>
            {keyName.name}
          </Option>
        );
      })
    );
  };

  /**
   * @method defaultParentCategory
   * @description render booking category list
   */
  defaultParentCategory = (category) => {
    return Object.keys(category).map((keyName, i) => {
      return (
        <Option key={i} value={JSON.stringify(category[keyName])}>
          {category[keyName].name}
        </Option>
      );
    });
  };

  /**
   * @method childCategory
   * @description render booking category list
   */
  childCategory = (childCategory) => {
    return (
      childCategory.length !== 0 &&
      childCategory.map((keyName, i) => {
        return (
          <Option key={i} value={JSON.stringify(keyName)}>
            {keyName.name}
          </Option>
        );
      })
    );
  };

  /**
   * @method onCategoryChange
   * @description handle category change
   */
  onCategoryChange = (value) => {
    let templateName = "";
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        category_id: null,
      });
    this.props.getBookingSubcategory(value, (res) => {
      if (res.status === 200) {
        const data = Array.isArray(res.data.data) && res.data.data;

        this.setState({ subCategory: data });
      }
    });
  };
  onService = (item) => {
    console.log("SERVIce Type Changed", item);
  };

  renderOperatingHoursRow = (startTime, endTime, day, is_open) => {
    //
    //
    const { trader_working_hours } = this.state;
    const { userDetails } = this.props;
    let rowIndex = trader_working_hours.findIndex((k) => k.day == day);
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();

    // if(startTime === '12.00 AM' && endTime  === '12.00 AM'){
    //   startTime = undefined
    //   endTime =undefined
    //
    // }
    return (
      <div className="fr-op-hrs ">
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
            defaultValue={is_open === 1 && !this.state.calValue ? startTime : undefined}
            onChange={(e) => {
              let index = trader_working_hours.findIndex((k) => k.day == day);
              let temp = trader_working_hours;
              if (e !== undefined && index >= 0) {
                //If user Enters value
                var start = moment(e, ["HH:mm"]);
                // temp[index].start_time = `${e}:00`;
                temp[index].start_time = start.format("HH:mm:ss");
                temp[index].end_time = null;
                temp[index].is_open = 1;
                // currentField[`operating_start_hours${rowIndex}`] = `${e}:00`
                currentField[`operating_start_hours${rowIndex}`] =
                  start.format("hh:mm A");
                currentField[`operating_end_hours${rowIndex}`] = null;
                //this.formRef.current.setFieldsValue({ ...currentField });
              } else if (e === undefined && index >= 0) {
                //If user click on cross Icon
                var start = moment("00.00 AM", ["HH:mm"]);
                var end = moment("00.00 AM", ["HH:mm"]);
                temp[index].start_time = start.format("HH:mm:ss");
                temp[index].end_time = end.format("HH:mm:ss");
                temp[index].is_open = 0;
                currentField[`operating_start_hours${rowIndex}`] = undefined;
                currentField[`operating_end_hours${rowIndex}`] = undefined;
                //this.formRef.current.setFieldsValue({ ...currentField });
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
            placeholder="..."
            allowClear
            defaultValue={is_open === 1 && !this.state.calValue ? endTime : undefined}
            onChange={(e) => {
              let index = trader_working_hours.findIndex((k) => k.day == day);
              let temp = trader_working_hours;

              if (e !== undefined && index >= 0) {
                // temp[index].end_time = `${e}:00`;
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
              } else if (e === undefined && index >= 0) {
                //If user click on cross Icon
                var start = moment("00.00 AM", ["HH:mm"]);

                var end = moment("00.00 AM", ["HH:mm"]);
                temp[index].start_time = start.format("HH:mm:ss");
                temp[index].end_time = end.format("HH:mm:ss");
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
      //

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
        // <Row gutter={24}>
        <div className="operating-content-block">
          <Row gutter={30}>
            <Col xs={24} sm={5} md={5} lg={4} xl={3}>
              <Text className="operating-label-block">
                {userDetails.days[day]}
              </Text>
            </Col>
            <Col xs={24} sm={12} md={24} lg={15} xl={20}>
              {me.renderOperatingHoursRow(
                startTime,
                endTime,
                day,
                userDetails.user.trader_working_hours[index].is_open
              )}
            </Col>
            {/* <Checkbox checked={true}>Closed on public holiday</Checkbox> */}
          </Row>
        </div>
      );
    });
  };

  renderAmenities = () => {
    const { all_fitness_amenities } = this.props.userDetails;

    return (
      Array.isArray(all_fitness_amenities) &&
      all_fitness_amenities.map((el) => {
        let isSelected = this.state.selectedAmenities.includes(el.id);
        return (
          <Radio
            checked={isSelected}
            onClick={(e) => {
              let temp = this.state.selectedAmenities;
              if (!isSelected) {
                temp.push(el.id);

                this.setState({ selectedAmenities: temp });
              } else {
                temp = temp.filter((k) => k !== el.id);

                this.setState({ selectedAmenities: temp });
              }
            }}
          >
            {el.name}
          </Radio>
        );
      })
    );
  };

  /**
   * @method handleEditorChange
   * @description handle editor text value change
   */
  handleEditorChange = (editorState, i) => {
    if (i === 1) {
      this.setState({ editorState1: editorState });
    } else if (i === 2) {
      this.setState({ editorState2: editorState });
    }
  };

  /**
   * @method blankCheck
   * @description Blanck check of undefined & not null
   */
  blankCheck = (value) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "Invalid date" &&
      value !== "" &&
      value !== "null" &&
      value !== "undefined"
    ) {
      return value;
    } else {
      return "";
    }
  };

  /**
   * @method getEventTypes
   * @description get event types
   */
  getAllEventTypes = (cat_id) => {
    this.props.getEventTypes({ booking_category_id: cat_id }, (res) => {
      if (res.status === 200) {
        this.setState({ eventTypes: res.data.event_types });
      }
    });
  };

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    let tmp = getCustomLocalStorage("vendordetails");
    const { userDetails, bookingList } = this.props;
    let tmp2 = tmp
      ? Object.assign({}, { ...userDetails.user.trader_profile }, { ...tmp })
      : userDetails.user.trader_profile;
    const {
      features,
      venues,
      capacity_info,
      booking_cat_id,
      capacity,
      description,
      event_types,
      service_area,
      service_and_facilities,
      rate_per_hour,
      basic_quote,
      dietaries,
      service_type,
      booking_sub_cat_id,
      service_available,
    } = tmp2;

    // } = tmp.data !== "" ? userDetails.user.trader_profile : tmp.data;
    const { vendor_services } = userDetails.user;
    let die = [];
    let events = [];
    let venue = [];
    let enent_venues = venues && venues.split(",");
    Array.isArray(dietaries) && dietaries.filter((d) => die.push(d.id));
    Array.isArray(event_types) && event_types.filter((e) => events.push(e.id));
    Array.isArray(enent_venues) && enent_venues.filter((e) => venue.push(e));
    let temp = {
      booking_cat_id,
      booking_sub_cat_id,
      service_type:
        this.blankCheck(service_type) === ""
          ? []
          : Array.isArray(service_type)
          ? service_type
          : service_type.split(","),
      service_area:
        service_area === null || service_area === "" || service_area.length <= 0
          ? []
          : Array.isArray(service_area)
          ? service_area
          : service_area.split(","),
          service_available: service_available === null || service_available === "" || service_available == false
          ? []
          : service_available,
      
      profile_dietary_ids: die,
      event_type_ids: events,
      venues: venue,
      basic_quote: basic_quote ? 1 : 0,
      rate_per_hour,
      capacity: Array.isArray(capacity) ? capacity[0] : "",
      capacity_info: capacity_info,
      description: BraftEditor.createEditorState(description),
      service_and_facilities: BraftEditor.createEditorState(
        service_and_facilities
      ),
      features: features,
      vender_services:
        vendor_services.length > 0
          ? vendor_services.map((el) => {
              return {
                title: el.title,
                description: BraftEditor.createEditorState(el.description),
              };
            })
          : [{ id: 0 }],
    };
    return temp;
  };

  /**
   * @method on finish
   * @description varify number
   */
  onFinish = (value) => {
    value.capacity_info = value.capacity_info;
    value.mobile_no_verified = 0;
    value.capacity = value.capacity_info;
    value.event_type_ids = value.service_type;
    value.start_from_hr = false;
    value.profile_dietary_ids = value.profile_dietary_ids
      ? value.profile_dietary_ids.toString()
      : "";
    value.service_and_facilities = this.state.editorState2.toHTML();
    value.description = this.state.editorState1.toHTML();
    value.working_hours = this.state.trader_working_hours;
    value.service_images = this.state.fileList;
    value.fitness_amenities_ids = this.state.selectedAmenities.toString();
    value.booking_cat_id = value.booking_cat_id;
    value.booking_sub_cat_id = value.booking_sub_cat_id;
    value.is_public_closed = this.state.is_public_closed;
    value.venues = value.venues ? value.venues.toString() : "";
    value.features = value.features ? value.features : "";
    value.Services =
      Array.isArray(value.vender_services) && value.vender_services.length
        ? value.vender_services.map((el) => {
            return {
              title: el.title,
              description: el.description.toHTML(),
            };
          })
        : [];
    // value.service_area = this.state.selectedAddress
    // return
    setCustomLocalStorage("vendordetails", value);
    this.props.nextStep(value);

    // this.props.saveTraderProfile(value, (res) => {

    // })
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

  handleAddress = (selectedAddress) => {
    this.setState({ selectedAddress: [...selectedAddress] });
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const { userDetails, bookingList, loggedInUser } = this.props;
    const { sub_category_name, dietaries } = userDetails.user.trader_profile;
    const controls = ["bold", "italic", "underline", "separator"];
    const {
      eventVenuesList,
      fileList,
      is_public_closed,
      eventTypes,
      trader_working_hours,
      category,
      editorState1,
      subCategory,
      booking_cat_id,
      booking_sub_cat_id,
      durationOption,
      basic_quote,
      rate_per_hour,
    } = this.state;
    const tProps = {
      treeData: durationOption,
      treeCheckable: true,
      // treeCheckStrictly: false,
      // showCheckedStrategy: SHOW_CHILD,
      placeholder: "Location",
      style: {
        width: "100%",
      },
    };
    let beauty = loggedInUser.user_type === langs.userType.beauty;
    let fitness = loggedInUser.user_type === langs.userType.fitness;
    let wellbeing = loggedInUser.user_type === langs.userType.wellbeing;
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
        <div className="vender-detail-first vender-detail-first-v2">
          <Form
            ref={this.formRef}
            // id='form1'
            name="editProfile"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            scrollToFirstError
            initialValues={this.getInitialValue()}
            layout={"vertical"}
            // initialValues={{
            //   vender_services: [{ id: 0 }]
            // }}
          >
            {/* {loggedInUser.user_type !== 'fitness' && <Title level={4} className=''>Business Information:</Title>} */}
            {loggedInUser.user_type !== "fitness" && (
              <div className="add-portfolio fm-cr-outerbg">
                <div className="create-portfolio gray-box-reverse-top">
                  <Row gutter={28}>
                    {/* {true && <Row gutter={28}> */}
                    <Col span={12}>
                      <Form.Item
                        label="Select Categories"
                        name="booking_cat_id"
                        rules={[required("Category")]}
                      >
                        <Select
                          placeholder="Select"
                          disabled
                          size="large"
                          defaultValue={booking_cat_id}
                          onChange={(e) => {
                            this.onCategoryChange(e);
                          }}
                          allowClear
                        >
                          {/* {bookingList && this.parentCategory(bookingList)} */}

                          {bookingList &&
                            bookingList.map((keyName, i) => {
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
                        label="Select Sub Category"
                        name="booking_sub_cat_id"
                        rules={[required("Sub Category")]}
                      >
                        <Select
                          placeholder="Please Choose"
                          allowClear
                          disabled
                          // onChange={this.onCategoryChange}
                          size={"large"}
                          className="w-100"
                        >
                          {/* {subCategory && this.childCategory(subCategory)} */}
                          {subCategory &&
                            subCategory.map((keyName, i) => {
                              return (
                                <Option key={keyName.id} value={keyName.id}>
                                  {keyName.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
            <div className="step2-business-info-body">
              <Row gutter={28}>
                {/* <Col xs={24} sm={24} md={24} lg={24}>
                <Title level={4} className=''>Business Information</Title>
              </Col> */}

                <Col
                  span={
                    ["events", "beauty", "wellbeing", "fitness"].includes(
                      loggedInUser.user_type
                    )
                      ? 24
                      : 12
                  }
                >
                  {/* <Col md={12}> */}
                  {loggedInUser.user_type === "fitness" && (
                    <Row gutter={28} className="service-available-row">
                      <Col span={24}>
                      <label className="label">
                            Select Service Available (Service Type)
                          </label>
                          <label className="note-label">
                            *You can choose more than one
                          </label>
                          <Form.Item name="service_available"
                          rules={[required('Business Information')]}
                          >
                          <Select
                          onChange={(value) => {
                          }} 
                            placeholder="Please Choose"
                            mode="multiple"
                            allowClear
                          >
                            {this.props.fitnessPlan &&
                              this.props.fitnessPlan.map((keyName, i) => {
                                return (
                                  <Option
                                    key={keyName.id}
                                    value={keyName.name}
                                    onClick={() => {
                                      this.onService();
                                    }}
                                  >
                                    {keyName.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  {["wellbeing", "beauty", "fitness"].includes(
                    loggedInUser.user_type
                  ) && <h4 className="ant-typography">Business Information</h4>}

                  <Form.Item
                    name={`description`}
                    label="About us"
                    rules={[{ required: true, message: 'About us is required!' }]}
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
                {/* <Col md={12}>
                  <Form.Item
                    name={`services`}
                    label="Services"
                    // rules={[required('Business Information')]}
                  >
                    <BraftEditor
                      value={""}
                      controls={controls}
                      onChange={(e) => this.handleEditorChange(e, 1)}
                      contentStyle={{ height: 150 }}
                      className={"input-editor braft-editor"}
                      language="en"
                    />
                  </Form.Item>
                </Col> */}
                {["handyman"].includes(loggedInUser.user_type) && (
                  // loggedInUser.user_type !== "events" ||
                  // loggedInUser.user_type === "fitness" ||
                  // loggedInUser.user_type === "handyman"
                  <Col span={12}>
                    <Form.Item
                      label={
                        loggedInUser.user_type === "fitness"
                          ? "Features"
                          : "Services"
                      }
                      name={`service_and_facilities`}
                      rules={[required('Business Information')]}
                    >
                      <BraftEditor
                        value={this.state.editorState1}
                        controls={controls}
                        onChange={(e) => this.handleEditorChange(e, 2)}
                        contentStyle={{ height: 150 }}
                        className={"input-editor braft-editor"}
                        placeholder="Type here"
                      />
                    </Form.Item>
                  </Col>
                )}
                {/* {loggedInUser.user_type === 'fitness' && <Col span={12}>
                <Form.Item
                  label='Features'
                  name={`service_and_facilities`}
                // rules={[required('Business Information')]}
                >
                  <BraftEditor
                    value={this.state.editorState1}
                    controls={controls}
                    onChange={(e) => this.handleEditorChange(e, 2)}
                    contentStyle={{ height: 150 }}
                    className={'input-editor braft-editor'}
                  />
                </Form.Item>
              </Col>}
            */}
              </Row>
              {loggedInUser.user_type === "test" && (
                <Row gutter={28} style={{ marginTop: "-6px" }}>
                  {/* {loggedInUser.user_type !== 'wellbeing' &&  */}
                  <Col span={12}>
                    <Form.Item
                      label="Service Type"
                      name="service_type"
                      // rules={[required('AddrService Type')]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  {/* // } */}
                  <Col
                    span={12}
                    className="fitness-servide-area fitness-servide-area-event"
                  >
                    <Form.Item
                      label="Service Area"
                      name="service_area"
                      rules={[required('Service Area')]}
                    >
                      {/* <Select
                      placeholder="Select"
                      size="large"
                      // mode='multiple'
                      // onChange={this.onCategoryChange

                      allowClear
                    >
                      {durationOption &&
                        durationOption.map((option) => {
                          return (
                            <Option key={option.value} value={option.value}>
                              {option.lable}
                            </Option>
                          );
                        })}
                    </Select> */}
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {["handyman", "trader", "events", "fitness"].includes(
                loggedInUser.user_type
              ) && (
                <Row gutter={28} style={{ marginTop: "-6px" }}>
                  {loggedInUser.user_type === "events" &&
                    [
                      "Florists",
                      "Entertainment",
                      "Photographer",
                      "Makeup & Hair artist",
                      "Videographer",
                      "Caterers",
                      "Venues",
                    ].includes(sub_category_name) && (
                      <Col span={12}>
                        <Form.Item
                          label="Service Type"
                          name="service_type"
                          rules={[required('AddrService Type')]}
                        >
                          <Select
                            placeholder="Select"
                            mode="multiple"
                            // onChange={this.onCategoryChange
                            allowClear
                          >
                            {eventTypes &&
                              eventTypes.map((keyName, i) => {
                                return (
                                  <Option key={keyName.id} value={keyName.id}>
                                    {keyName.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                      </Col>
                    )}
                  {(["handyman", "trader", "fitness"].includes(
                    loggedInUser.user_type
                  ) ||
                    (loggedInUser.user_type === "events" &&
                      [
                        "Florists",
                        "Entertainment",
                        "Photographer",
                        "Makeup & Hair artist",
                        "Videographer",
                        "Caterers",
                        "Venues",
                      ].includes(sub_category_name))) && (
                    <Col
                      span={
                        ["fitness", "events"].includes(loggedInUser.user_type)
                          ? 12
                          : 24
                      }
                      className="fitness-service-area fitness-service-area-event"
                    >
                      <Form.Item
                        label="Service Area"
                        name="service_area"
                        rules={[required("Service Area")]}
                        rules={[required('Service Area')]}
                      >
                        <TreeSelect {...tProps} />
                      </Form.Item>
                    </Col>
                  )}
                  {sub_category_name === "Venues" && (
                    <Col span={12}>
                      <Form.Item
                        label="Venues"
                        name="venues"
                        className="custom-input-location custom-input-location-dietery"
                        rules={[required("")]}
                      >
                        <Select
                          placeholder="Please Choose"
                          allowClear
                          mode={"multiple"}
                          // className="w-100 multiple-select"
                        >
                          {eventVenuesList &&
                            eventVenuesList.map((el, i) => {
                              return (
                                <Option key={i} value={el.venue_of_event}>
                                  {el.venue_of_event}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              )}

              {/* {(loggedInUser.user_type === 'handyman' || loggedInUser.user_type === 'trader') && <Title level={4} className=''>Service Details</Title>}

            {(loggedInUser.user_type === 'handyman' || loggedInUser.user_type === 'trader') && <Form.List name="vender_services">
              {(fields, { add, remove }) => {
                return <div>
                  {fields.map((field, index) => {
                    return <Row gutter={28}>
                      <Col span={12}>
                        <Form.Item
                          label='Title'
                          name={[field.name, "title"]}
                          fieldKey={[field.fieldKey, "title"]}
                        >
                          <Input />
                        </Form.Item>

                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={'Description'}
                          name={[field.name, "description"]}
                          fieldKey={[field.fieldKey, "description"]}
                        >
                          <BraftEditor
                            value={this.state.editorState1}
                            controls={controls}
                            onChange={(e) => this.handleEditorChange(e, 2)}
                            contentStyle={{ height: 150 }}
                            className={'input-editor braft-editor'}
                            language='en'
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <MinusCircleOutlined
                          size="20"
                          className="dynamic-delete-button"
                          title={'Remove'}
                          onClick={() => { remove(field.name) }}
                        />
                      </Col>
                    </Row>
                  }
                  )
                  }
                  <Form.Item>
                    <Button
                      className='add-btn add-btn-trans'
                      onClick={() => {
                        add();
                      }}
                      block
                    >Add
                    </Button>
                  </Form.Item>
                </div>
              }} 
            </Form.List>}*/}
              {/* <PlacesAutocomplete
                    name="address"
                    handleAddress={this.handleAddress}
                    addressValue={this.state.address}
                  /> */}
              {(sub_category_name == "Venues" ||
                sub_category_name === "Caterers") &&
                loggedInUser.user_type !== "beauty" &&
                loggedInUser.user_type !== "wellbeing" && (
                  <Row gutter={28}>
                    <Col span={12}>
                      <Form.Item
                        label="Dietery"
                        name="profile_dietary_ids"
                        className="custom-input-location custom-input-location-dietery"
                        rules={[required('Dietery')]}
                        // onBlur={this.changeUserName}
                      >
                        <Select
                          placeholder="Please Choose"
                          allowClear
                          mode={"multiple"}
                          onChange={this.onCategoryChange}
                          className="w-100 multiple-select"
                        >
                          {this.state.dietaries &&
                            this.state.dietaries.map((keyName, i) => {
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
                        label="Capacity"
                        name="capacity_info"
                        className="capacity-block"
                        rules={[required("Capacity")]}
                        // onBlur={this.changeUserName}
                      >
                        {/* <Select
                      placeholder='Up to ...'
                      allowClear
                      // onChange={this.onCategoryChange}
                      size={'large'}
                      className='w-100'
                    >
                      {userDetails.capacities &&
                        userDetails.capacities.value.map((keyName, i) => {
                          return (
                            <Option key={keyName.value} value={keyName.value}>{keyName.name}</Option>
                          )
                        })}
                    </Select> */}
                        <Input placeholder="Up to.." />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

              {false && loggedInUser.user_type == "events" && (
                <Row gutter={28}>
                  <Col span={12}>
                    <Form.Item
                      label="Event Types"
                      name="event_type_ids"
                      className="custom-input-location custom-input-location-dietery"
                      rules={[required('Event Types')]}
                    >
                      <Select
                        placeholder="Please Choose"
                        allowClear
                        mode={"multiple"}
                        onChange={this.onCategoryChange}
                        className="w-100 multiple-select"
                      >
                        {eventTypes &&
                          eventTypes.map((keyName, i) => {
                            return (
                              <Option key={keyName.id} value={keyName.id}>
                                {keyName.name}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* {sub_category_name === "Venues" && (
                    <Col span={12}>
                      <Form.Item
                        label="Venues"
                        name="venues"
                        className="custom-input-location custom-input-location-dietery"
                        rules={[required("")]}
                      >
                        <Select
                          placeholder="Please Choose"
                          allowClear
                          mode={"multiple"}
                          className="w-100 multiple-select"
                        >
                          {eventVenuesList &&
                            eventVenuesList.map((el, i) => {
                              return (
                                <Option key={i} value={el.venue_of_event}>
                                  {el.venue_of_event}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  )} */}
                </Row>
              )}
              {loggedInUser.user_type == "events" && (
                <Row gutter={28}>
                  <Col span={12}>
                    <Form.Item
                      label="Features"
                      name="features"
                      className="custom-input-location custom-input-location-dietery"
                      rules={[required("")]}
                    >
                      <Input placeholder={"eg. Parking, Disabled Access"} />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {loggedInUser.user_type === "fitness" && (
                <div>
                  <Row gutter={28}>
                    <Col span={24}>
                      <Form.Item
                        label="Select Amenities"
                        name="select_amenities"
                        // rules={[required('AddrService Type')]}
                      >
                        <div className="amenities-block">
                          {" "}
                          {loggedInUser.user_type === "fitness" &&
                            this.renderAmenities()}
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={12}>&nbsp;</Col>
                  </Row>
                  {/* <Divider className="mb-30" /> */}
                </div>
              )}
              <Divider className="mt-20 mb-20" />
              <Row gutter={28} className="upload-cover-photo">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Title level={4} className="upload-cover-btm-margin">
                    Upload Cover Photos{" "}
                  </Title>
                  <div className="discription">
                    Add up to 8 images or upgrade to include more.
                    <br />
                    Hold and drag to reorder photos. Maximum file size 4MB.
                  </div>
                  <Form.Item name="image" className="label-large">
                    <ImgCrop>
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
                    </ImgCrop>

                    {fileList.length >= 8 ? null : (
                      <div className="ant-upload-text float-left pre-btn">
                        <Button danger clasName="mt-10">
                          <label
                            for="fileButton"
                            style={{ cursor: "pointer" }}
                            className="text-orange "
                          >
                            Add Pictures
                          </label>
                        </Button>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Divider className="mb-30" />
              <div className="charges-rates-row">
                <Row gutter={28}>
                  <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                    <Title level={4} className="fs-14 m-b0">
                      Charge rate (AUD)
                    </Title>
                    <div className="notification">
                      You can select both or one
                    </div>
                  </Col>
                </Row>
                <Row gutter={28}>
                  {!fitness && !beauty && !wellbeing && (
                    <Col span={10}>
                      <div className="basic-quote">
                        <Form.Item
                          label=""
                          name="basic_quote"
                          rules={[required("")]}
                        >
                          <Checkbox
                            onChange={(e) => {
                              this.setState({ basic_quote: e.target.checked });
                            }}
                            checked={basic_quote}
                          ></Checkbox>
                          {/* <img src={require('../../../../assets/images/icons/radio-gray.svg')} alt='upload' width="18" />  */}
                          {/* <Input />  */}
                          {/* <Select
                        placeholder='Select'
                        size='large'
                        mode='multiple'
                        onChange={this.onCategoryChange}
                        allowClear
                        >
                        <Option value={1}>Yes</Option>
                        <Option value={0}>No</Option>
                      </Select> */}
                        </Form.Item>
                        <span className="custom-block">Basic Quotes</span>
                      </div>
                    </Col>
                  )}
                  {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}> */}
                  <Col span={14}>
                    <div className="rates-per-hours">
                      {!fitness && !beauty && !wellbeing && (<Form.Item
                        label=""
                        name="rate_per_hour"
                        rules={[required("")]}
                      >
                        <Checkbox
                          onChange={(e) => {
                            this.setState({ rate_per_hour: e.target.checked });
                          }}
                          checked={rate_per_hour}
                        ></Checkbox>
                      </Form.Item>)}
                      <span className="custom-block">
                        {/* {" "}
                        <img
                          src={require("../../../../assets/images/icons/radio-gray.svg")}
                          alt="upload"
                          width="18"
                        />{" "} */}
                        Start from / hr
                      </span>
                      <Form.Item
                        label=""
                        name="rate_per_hour"
                        // rules={[required('Rates Per Hours')]}
                        rules={[{ validator: validNumber }]}
                      >
                        <Input placeholder="Type your rate here" />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <Divider className="mt-64 mb-30" />
              </div>
              {/* } */}
              <Row gutter={28} className="fitness-operating-hours">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Title
                    level={4}
                    className="mb-40"
                    style={{ textTransform: "inherit" }}
                  >
                    Operating hours
                  </Title>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <div className="fitness-operatinghours">
                    {this.renderOperatingHours()}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item name="is_public_closed" className="closed-label">
                    <Checkbox
                      onChange={(e) => {
                        this.setState({ is_public_closed: e.target.checked });
                      }}
                      checked={is_public_closed}
                    >
                      Closed on public holidays
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </div>

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
  const { savedCategories, categoryData } = common;
  let bookingList = [];
  // bookingList =
  //     categoryData && Array.isArray(categoryData.classified)
  //         ? categoryData.classified
  //         : [];
  bookingList =
    categoryData && Array.isArray(categoryData.booking.data)
      ? categoryData.booking.data
      : [];

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    bookingList,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    fitnessPlan: Array.isArray(bookings.fitnessPlan)
      ? bookings.fitnessPlan
      : [],
  };
};

export default connect(mapStateToProps, {
  getEventVenuesList,
  getUserProfile,
  getEventTypes,
  getClassfiedCategoryListing,
  getBookingSubcategory,
  saveTraderProfile,
  logout,
  changeUserName,
  changeMobNo,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
  getServiceAreaOptions,
  getFitnessTypes,
})(EventProfile);
