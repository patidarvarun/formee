import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
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
  Table,
  InputNumber
} from "antd";
import {
  LoadingOutlined,
  MinusCircleOutlined,
  LockOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Form, Input, Col, Select } from "antd";
import SizeGuideModal from "./SizeGuideModal";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import {
  getUserProfile,
  getTraderProfile,
  getEventTypes,
  getClassfiedCategoryListing,
  getBookingSubcategory,
  saveTraderProfile,
  deleteSizeGuide,
  enableLoading,
  disableLoading,
} from "../../../../actions";
import { required, validNumber } from "../../../../config/FormValidation";
import BraftEditor from "braft-editor";
import csc from "country-state-city";
import UpdateSizeGuide from "./UpdateSizeGuide";
const { Title, Text } = Typography;
const { Option } = Select;
const DOMESTIC_FLAG = "Domestic";
const INTERNATIONAL_FLAG = "international";
const DOMESTIC_DELIVERY_FLAG = "Domestic Delivery";
const INTERNATIONAL_DELIVERY_FLAG = "international Delivery";
const SHIPPING_TYPE1 = "Integrated Logistic API";
const SHIPPING_TYPE2 = "Standard Shipping Rates";

class EventProfile extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isInternational: false,
      isDomestic: false,
      domesticDeliveryBy: 0,
      internationalDelivery: false,
      allCountries: csc.getAllCountries(),
      selectedStates: [],
      domesticState: csc.getStatesOfCountry("AU"),
      is_paypal_accepted: false,
      is_mastercard: false,
      is_visa: false,
      is_applepay: false,
      is_afterpay: false,
      gpay: false,
      openSizeGuideModal: false,
      openUpdateSizeGuideModal: false,
      selectedNodes: [],
      guideList: null,
      editableGuide: null,
      fileList: "",
      selectedCat: [],
      editorState1: BraftEditor.createEditorState("<p><p>"),
    };
  }
  formRef = React.createRef();

  /**
   * @method componentWillMount
   * @description called after render the component
   */
  componentWillMount() {
    const { userDetails, loggedInUser } = this.props;
    const { postages, deliveries, size_guide_images } = userDetails.user;
    console.log("size_guide_images: ", size_guide_images);
    const { accepted_payment_methods } = userDetails;
    let domesticIndex = postages.findIndex(
      (el) => el.postage_type === DOMESTIC_FLAG
    );
    let internationalIndex = postages.findIndex(
      (el) => el.postage_type === INTERNATIONAL_FLAG
    );
    let standardIndex = deliveries.findIndex(
      (el) => el.shipping_type === SHIPPING_TYPE2
    );
    let logisticIndexDomestic = deliveries.findIndex(
      (el) =>
        el.shipping_type === SHIPPING_TYPE1 &&
        el.delivery_type === INTERNATIONAL_DELIVERY_FLAG
    );
    let logisticIndexInternational = deliveries.findIndex(
      (el) =>
        el.shipping_type === SHIPPING_TYPE1 &&
        el.delivery_type === DOMESTIC_DELIVERY_FLAG
    );

    console.log('logisticIndexInternational: ', logisticIndexInternational);
    let states = [];
    postages.map((el) => {
      if (el.postage_type === INTERNATIONAL_FLAG) {
        let selectedStates = csc.getStatesOfCountry(el.country_code);
        states = [...states, selectedStates];
      }
    });

    // console.log('isDomestic: **', isDomestic);
    this.setState({
      isDomestic: domesticIndex >= 0 ? true : false,
      isInternational: internationalIndex >= 0 ? true : false,
      domesticDeliveryBy:
        standardIndex >= 0 ? 0 : logisticIndexDomestic >= 0 ? 1 : 0,
      internationalDelivery: logisticIndexInternational >= 0 ? 1 : 0,
      selectedStates: states,
      is_paypal_accepted: accepted_payment_methods.paypal === 1 ? true : false,
      is_mastercard:
        accepted_payment_methods.is_mastercard === 1 ? true : false,
      is_visa: accepted_payment_methods.is_visa === 1 ? true : false,
      is_applepay: accepted_payment_methods.is_applepay === 1 ? true : false,
      is_afterpay: accepted_payment_methods.is_afterpay === 1 ? true : false,
      gpay: accepted_payment_methods.is_gpay === 1 ? true : false,
      selectedCat: size_guide_images,
    });
  }

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
   * @method on finish
   * @description varify number
   */
  onFinish = (value) => {
    console.log("value: ^^^^", value);
    let currentField = this.formRef.current.getFieldsValue()
    const {
      isDomestic,
      isInternational,
      domesticDeliveryBy,
      internationalDelivery,
      is_paypal_accepted,
      is_mastercard,
      is_visa,
      is_applepay,
      gpay,
      is_afterpay,
      allCountries,
      selectedNodes,
      guideList,
      fileList,
    } = this.state;
    console.log('isDomestic: ', isDomestic);
    let postages = [];
    let deliveries = new Array();
    let domesticObj = {};
    if (isDomestic) {
      domesticObj.postage_type = "Domestic";
      domesticObj.country = "Australia";
      domesticObj.excludes_states = value.domesticState.toString();
      postages.push(domesticObj);
    }
    // if (isInternational && domesticDeliveryBy) {
    if (isInternational) {
      value.international.map((el) => {
        let cont = allCountries.filter((c) => c.name === el.country);
        console.log("cont: ", cont);
        let obj = {
          postage_type: "international",
          country: cont[0] !== undefined ? cont[0].name : "",
          country_code: cont[0] !== undefined ? cont[0].isoCode : "",
          // country: JSON.parse(el.country).name,
          excludes_states: el.excludes_states,
          // excludes_states: JSON.parse(el.excludes_states).name
        };
        postages.push(obj);
      });
    }
    if (domesticDeliveryBy) {
      deliveries.push({
        delivery_type: "Domestic Delivery",
        shipping_type: "Integrated Logistic API",
      });
    } else {
      value.domestic.map((el) => {
        let obj = {
          delivery_type: "Domestic Delivery",
          shipping_type: "Standard Shipping Rates",
          name: el.name,
          price: el.price,
          time: el.time,
          delivery_in_days: el.time,
        };
        deliveries.push(obj);
      });
    }

    isInternational &&
      internationalDelivery &&
      deliveries.push({
        delivery_type: "international Delivery",
        shipping_type: "Integrated Logistic API",
      });

    let reqData = {
      postages: JSON.stringify(postages),
      deliveries: JSON.stringify(deliveries),
      is_paypal_accepted: is_paypal_accepted ? 1 : 0,
      is_mastercard: is_mastercard ? 1 : 0,
      is_visa: is_visa ? 1 : 0,
      is_applepay: is_applepay ? 1 : 0,
      is_afterpay: is_afterpay ? 1 : 0,
      is_gpay: gpay ? 1 : 0,
      return_policy: value.return_policy.toHTML(),
      size_guide_categories: JSON.stringify(selectedNodes),
      size_guide_image: guideList ? guideList.originFileObj : "",
      return_policy_file: fileList ? fileList.originFileObj : "",
      return_policy_title: value.return_policy_title,
      shipping_api_key: currentField.shipping_api_key !== undefined ? currentField.shipping_api_key : '',
      shipping_sender_id: currentField.shipping_sender_id !== undefined ? currentField.shipping_sender_id : '',
    };
    console.log(postages, "reqData: ", deliveries);
    this.props.nextStep(reqData);
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
    console.log("fileList: ", fileList);
    console.log("file: ", file);

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
      this.setState({ fileList: fileList[0] });
    }
  };

  handleAddress = (selectedAddress) => {
    this.setState({ selectedAddress: [...selectedAddress] });
  };

  /**
   * @method handleSizeGuideUpload
   * @description handle image upload
   */
  handleSizeGuideUpload = ({ file, fileList }) => {
    console.log("fileList: ", fileList);
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
      this.setState({ guideList: fileList[0] });
    }
  };

  /**
   * @method onChange
   * @description change in tree select
   */
  onChange = (currentNode, selectedNodes) => {
    let temp = selectedNodes.map((el) => {
      return {
        category_id: el.value,
        pid: el.pid,
      };
    });
    console.log("temp: ", temp);
    this.setState({ selectedNodes: temp });
  };
  /**
   * @method getTraderProfile
   * @description get Trader profile
   */
  getTraderProfile = (cat) => {
    console.log("Hello >>");
    const { id } = this.props.loggedInUser;
    this.props.enableLoading();
    this.props.getTraderProfile({ user_id: id }, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        this.setState({ selectedCat: res.data.user.size_guide_images });
      }
    });
  };

  /**
   * @method renderInternationalFormList
   * @description form list for International
   */
  renderInternationalFormList = () => {
    const { allCountries, selectedStates } = this.state;
    return (
      <Form.List name="international">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              // <Space key={field.key} align="baseline">
              <Row gutter={20} key={field.key}>
                <Col span={12}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.area !== curValues.area ||
                      prevValues.sights !== curValues.sights
                    }
                  >
                    {() => (
                      <Form.Item
                        {...field}
                        label="Posting to"
                        name={[field.name, "country"]}
                        fieldKey={[field.fieldKey, "country"]}
                        rules={[
                          { required: true, message: "country is required" },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Select Country"
                          optionFilterProp="children"
                          // autoComplete='select-country'
                          autoComplete='nope'
                          onChange={(value) => {
                            // let parsedObj = JSON.parse(value)
                            // let selectedStates = csc.getStatesOfCountry(parsedObj.isoCode)
                            // console.log('parsedObj.isoCode: ', parsedObj.isoCode);
                            // this.setState({ selectedStates: selectedStates })
                            let currentField = this.formRef.current.getFieldsValue();

                            // Findout Slected country by value
                            let cont = allCountries.filter(
                              (c) => c.name === value
                            );

                            //Get All States of selected country
                            let selectedStates = [];
                            if (cont.length) {
                              selectedStates = csc.getStatesOfCountry(
                                cont[0].isoCode
                              );
                            }

                            if (currentField.international[field.fieldKey] !== undefined) {
                              //Remove states
                              currentField.international[
                                field.fieldKey
                              ].excludes_states = "";
                              // currentField.international.splice(field.fieldKey, 1);
                              // this.formRef.current.setFieldsValue(...currentField);
                              console.log('If >>');
                              //get new state & push into array
                              let state = this.state.selectedStates;
                              state[field.fieldKey] = selectedStates;
                              console.log('state: ', state);

                              this.setState({ selectedStates: state });

                              // console.log(
                              //   field.fieldKey,
                              //   "currentField: ",
                              //   currentField.international[field.fieldKey]
                              // );
                            } else {
                              // console.log(
                              //   this.state.selectedStates,
                              //   "selectedStates: ",
                              //   selectedStates
                              // );
                              console.log('Else >>');

                              this.setState({
                                selectedStates: [
                                  ...this.state.selectedStates,
                                  selectedStates,
                                ],
                              });
                            }
                          }}

                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {allCountries.map((el) => {
                            // return <Option value={JSON.stringify(el)}>{el.name}</Option>
                            return <Option value={el.name}>{el.name}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                    )}
                  </Form.Item>
                </Col>
                <Col md={11} className="pr-0">
                  <Form.Item
                    {...field}
                    label="Excludes"
                    name={[field.name, "excludes_states"]}
                    fieldKey={[field.fieldKey, "excludes_states"]}
                    rules={[
                      {
                        required: true,
                        message: "excludes_states is Required",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select state"
                      optionFilterProp="children"
                      autoComplete="select-state"
                      onChange={(value) => {
                        console.log("value: ", value);
                        // let parsedObj = JSON.parse(value)
                        // let selectedStates = csc.getStatesOfCountry(parsedObj.isoCode)
                        // this.setState({ selectedStates: selectedStates })
                      }}
                      autoComplete="state-name"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {/* {(Array.isArray(selectedStates) && selectedStates.length) && selectedStates[field.fieldKey].map((el) => { */}
                      {selectedStates[field.fieldKey] !== undefined &&
                        selectedStates[field.fieldKey].map((el) => {
                          return <Option value={el.name}>{el.name}</Option>;
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  md={1}
                  className="pr-0"
                  style={{
                    alignSelf: "center",
                    paddingTop: "20px",
                    paddingLeft: "30px",
                  }}
                >
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Col>
              </Row>
              // </Space>
            ))}
            <Row>
              <Col md={24} className="text-right add-more-countrie">
                <Form.Item>
                  <Button onClick={() => add()} block icon={<PlusOutlined />}>
                    Add more countries
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form.List>
    );
  };

  /**
   * @method renderDomesticDeliveryFormList
   * @description form list for domestic delivery
   */
  renderDomesticDeliveryFormList = () => {
    return (
      <Form.List name="domestic">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              // <Space key={field.key} align="baseline">
              <Row gutter={20} key={field.key} className="mb-10">
                <Col md={8}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.area !== curValues.area ||
                      prevValues.sights !== curValues.sights
                    }
                  >
                    {() => (
                      <Form.Item
                        {...field}
                        label={field.key === 0 ? 'Name' : ''}
                        name={[field.name, "name"]}
                        fieldKey={[field.fieldKey, "name"]}
                        rules={field.key === 0 && [
                          { required: true, message: "name is required" },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    )}
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    {...field}
                    label={field.key === 0 ? 'Price' : ''}
                    name={[field.name, "price"]}
                    fieldKey={[field.fieldKey, "price"]}
                    // rules={field.key === 0 && [{ required: true, message: "price is Required" }]}
                    rules={field.key === 0 && [{ validator: validNumber }]}
                    className="price-input-num"
                  >
                    {/* <Input /> */}
                    <InputNumber
                      formatter={(value) =>
                        `AUD ${value}`.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )
                      }
                      parser={(value) =>
                        value.replace('AUD', "").replace(/\$\s?|(,*)/g, "").trim()
                      }
                    />
                  </Form.Item>
                </Col>
                <Col md={7} className="pr-0 estimatedDeliveryTime">
                  {field.key === 0 && <label>Estimated Delivery Time</label>}
                  <Row>
                    <Col md={12}>
                      <Form.Item
                        {...field}
                        // label="Estimated Delivery Time"
                        name={[field.name, "time"]}
                        fieldKey={[field.fieldKey, "time"]}
                        rules={field.key === 0 && [
                          { required: true, message: "time is Required" },
                        ]}
                        className="br-r-0"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "delivery_in_days"]}
                        // label="Estimated Delivery Time"
                        fieldKey={[field.fieldKey, "delivery_in_days"]}
                        rules={field.key === 0 && [
                          { required: true, message: "days is Required" },
                        ]}
                        className="label-none br-l-0"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col
                  md={1}
                  style={{
                    alignSelf: "flex-end",
                    paddingBottom: "15px",
                    paddingLeft: "25px",
                    paddingRight: "0",
                  }}
                >
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Col>
              </Row>
              // </Space>
            ))}
            <Row gutter={20}>
              <Col md={24} className="text-right add-more-countrie ">
                <Form.Item>
                  <Button
                    className="mt-0"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add More Shipping Types
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form.List>
    );
  };

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    const { userDetails } = this.props;
    const { isInternational } = this.state;
    const { postages, deliveries, trader_profile } = userDetails.user;
    const { accepted_payment_methods } = userDetails;
    let domesticIndex = postages.findIndex(
      (el) => el.postage_type === DOMESTIC_FLAG
    );
    let internationalIndex = postages.findIndex(
      (el) => el.postage_type === INTERNATIONAL_FLAG
    );
    let standardIndex = deliveries.findIndex(
      (el) => el.shipping_type === SHIPPING_TYPE2
    );
    console.log('@@ >>', this.state.isInternational);

    let intN = [];
    let states = [];
    postages.map((el) => {
      if (el.postage_type === INTERNATIONAL_FLAG) {
        console.log("el: ***", el);
        let selectedStates = csc.getStatesOfCountry(el.country_code);
        states = [...states, selectedStates];
        intN.push({
          excludes_states: el.excludes_states,
          country: el.country,
          country_code: el.country_code,
        });
      }
      //  else {
      //   intN.push({
      //     id: 0
      //   })
      // }
    });
    let domDelivery = [];
    if (standardIndex >= 0) {
      deliveries.map((el) => {
        if (
          el.delivery_type === DOMESTIC_DELIVERY_FLAG &&
          el.shipping_type === SHIPPING_TYPE2
        ) {
          domDelivery.push({
            delivery_in_days: el.delivery_in_days,
            delivery_type: el.delivery_type,
            name: el.name,
            price: el.price,
            time: el.time,
            shipping_type: "Standard Shipping Rates",
          });
        }
      });
    } else {
      domDelivery.push({
        id: 0,
      });
    }
    // International 
    let international = [];
    if (intN.length) {
      international = intN
    } else if (isInternational && intN.length <= 0) {
      let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
      currentField.international = [{
        id: 0
      }]
      this.formRef.current && this.formRef.current.setFieldsValue({ ...currentField })
      international = [{ id: 0 }]
    } else if (!isInternational) {
      international = []
    }
    let temp = {
      domesticState:
        domesticIndex >= 0 ? String(postages[domesticIndex].excludes_states).split(',') : [],
      name: "postage",
      international,
      domestic: domDelivery,
      return_policy_title: trader_profile && trader_profile.return_policy_title,
      return_policy:
        trader_profile &&
        BraftEditor.createEditorState(trader_profile.return_policy),
      shipping_api_key: trader_profile.shipping_api_key,
      shipping_sender_id: trader_profile.shipping_sender_id
    };
    console.log(domesticIndex, 'temp: ', temp);
    return temp;
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { userDetails } = this.props;
    const { trader_profile } = userDetails.user;
    const {
      isInternational,
      isDomestic,
      domesticDeliveryBy,
      internationalDelivery,
      allCountries,
      is_paypal_accepted,
      guideList,
      selectedNodes,
      is_mastercard,
      is_visa,
      is_applepay,
      is_afterpay,
      gpay,
      openSizeGuideModal,
      fileList,
      selectedCat,
      openUpdateSizeGuideModal,
      editableGuide,
    } = this.state;
    console.log("selectedCat: ", selectedCat);
    const controls = ["bold", "italic", "underline", "separator"];
    const fileProps = {
      name: "file",
      customRequest: this.dummyRequest,
      onChange: this.handleImageUpload,
      multiple: false,
    };
    let tableData = selectedCat.map((el) => {
      return {
        id: el.id,
        imageName: el.name,
        applicableTo: el.size_guide_categories,
      };
    });
    // let tableData = [{
    //     imageName: trader_profile && trader_profile.size_guide_image,
    //     // applicableTo: selectedCat.map((el) => el.category.name)
    //     applicableTo: []

    // }]

    const columns = [
      {
        title: "Name",
        render: (text) => {
          return <p>{text.imageName}</p>;
        },
      },
      {
        title: "Applicable To",
        render: (text) => {
          let catName = [];
          text.applicableTo.map((el) => {
            catName.push(el.category.name);
          });
          return <p>{catName.join(', ')}</p>;
        },
      },
      {
        title: "",
        render: (text) => {
          console.log("text: $$ss ", text);
          return (
            <Row className="table-actions">
              <Col>
                <a
                  onClick={() => {
                    this.setState({
                      openUpdateSizeGuideModal: true,
                      editableGuide: text,
                    });
                  }}
                >
                  <img
                    src={require("./../../../../assets/images/icons/edit-pencil-v2.svg")}
                    alt="pencil"
                  />
                </a>
              </Col>
              <Col>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.props.deleteSizeGuide(
                      { size_guide_image_id: text.id },
                      (res) => {
                        if (res.status === 200) {
                          toastr.success(
                            langs.success,
                            MESSAGES.DELETE_SIZE_GUIDE
                          );
                          this.getTraderProfile();
                        }
                      }
                    );
                  }}
                >
                  <img
                    src={require("./../../../../assets/images/icons/trash.svg")}
                    alt="trash"
                  />
                </p>
              </Col>
            </Row>
          );
        },
      },
    ];
    return (
      <Fragment>
        <div className="vender-detail-first vender-detail-first-v3 bussines-form">
          <Form
            ref={this.formRef}
            // id='form1'
            name="editProfile"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            scrollToFirstError
            initialValues={this.getInitialValue()}
            layout={"vertical"}
            autoComplete="off"
          >
            {" "}
            <div className="form-block">
              <h2 className="orange-heading">Postage</h2>
              <Row gutter={20}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item name="domestic">
                    <Checkbox
                      onChange={(e) => {
                        this.setState({ isDomestic: e.target.checked });
                      }}
                      checked={isDomestic}
                    >
                      <Title level={4} className="">
                        Domestic
                      </Title>
                    </Checkbox>
                  </Form.Item>
                </Col>
                {isDomestic && (
                  <Col span={12}>
                    <Form.Item
                      name="domesticCountry"
                      defaultValue="Australia"
                      label="Excludes"
                      className="label-none"
                    >
                      <Input defaultValue="Australia" disabled />
                    </Form.Item>
                  </Col>
                )}
                {isDomestic && (
                  <Col md={11} className="pr-0">
                    <Form.Item
                      label="Excludes"
                      name="domesticState"
                      rules={[required("Exclude")]}
                    >
                      <Select
                        showSearch
                        placeholder="Select state"
                        optionFilterProp="children"
                        autoComplete="state-name"
                        //  filterOption={false}
                        mode="multiple"
                        maxTagCount={1}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.domesticState.map((el) => {
                          return <Option value={el.name}>{el.name}</Option>;
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
              </Row>
              {/* </div>
                        </div> */}
            </div>
            <div className="delivery-block">
              <Row className="international-top-box-v1">
                <Col span={12}>
                  <Form.Item name="international">
                    <Checkbox
                      checked={isInternational}
                      onChange={(e) => {
                        this.setState({ isInternational: e.target.checked });
                      }}
                    >
                      <Title level={4} className="">
                        International
                      </Title>
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              {isInternational && this.renderInternationalFormList()}
              {isInternational && <Divider />}
            </div>
            {(isDomestic || isInternational) && (
              <div className="pt-25">
                <h2 className="orange-heading">Delivery</h2>
                <Row gutter={20} className="domesticDeliveryBox">
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Title level={4} className="pb-25">
                      Domestic Delivery
                    </Title>
                  </Col>
                  <Col md={24}>
                    <Radio.Group
                      disabled={!isDomestic}
                      onChange={(e) =>
                        this.setState({ domesticDeliveryBy: e.target.value })
                      }
                      value={domesticDeliveryBy}
                      style={{ width: "100%" }}
                    >
                      {/* <Row gutter={20}>
                        <Col md={24}>
                          <Radio value={0}>Standard Shipping Rates</Radio>
                          {!domesticDeliveryBy &&
                            this.renderDomesticDeliveryFormList()}
                        </Col>
                      </Row> */}
                      <Row gutter={20}>
                        <Col md={12}>
                          <Radio value={1}>Integrated Logistic API</Radio>
                          {domesticDeliveryBy === 1 && (
                            <div
                              className="intra-msg"
                              style={{ background: "#DBF1FF" }}
                            >
                              <p>
                                <span>
                                  Shipping price and delivery time will be
                                  calculated at checkout.
                                </span>{" "}
                                Current available shipping options are DHL,
                                Australia Post, and FedEx.
                              </p>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Radio.Group>
                  </Col>
                </Row>
              </div>
            )}
            {(isInternational || isDomestic) && (
              <Row gutter={20} className="pt-15 pb-15">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Title level={4} className="pb-25">
                    International Delivery
                  </Title>
                </Col>
                <Col span={12}>

                  <Radio.Group
                    disabled={!isInternational}
                    onChange={(e) =>
                      this.setState({
                        internationalDelivery: e.target.value,
                      })
                    }
                    value={internationalDelivery}
                    style={{ width: "100%" }}
                  >
                    <Row gutter={20}>
                      <Col span={12}>
                        <Radio value={1}>Integrated Logistic API</Radio>

                        {/* <Checkbox
                        checked={internationalDelivery}
                        disabled={!isInternational}
                        onChange={(e) => {
                          this.setState({
                            internationalDelivery: e.target.checked,
                          });
                        }}
                        className="mb-25"
                      >
                        Integrated Logistic API
                      </Checkbox> */}
                        <div
                          className="intra-msg"
                          style={{ background: "#F2F2F2" }}
                        >
                          <p>
                            <span>
                              Shipping price and delivery time will be calculated
                              at checkout.
                            </span>{" "}
                            Current available shipping options are DHL, Australia
                            Post, and FedEx.
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Col>
              </Row>
            )}
            <Divider className="mb-30" />
            <div className="pt-25 return-policy-box">
              <Row gutter={20}>
                <Col md={12}>
                  <h2 className="orange-heading">Return Policy</h2>
                  <span className="rp-sub-title">
                    Type your returns policy and/or upload a file
                  </span>
                  <div className="mb-30">
                    {/* <Form.Item label="Headline" >
                    <Input />
                  </Form.Item> */}
                    <Form.Item
                      name={"return_policy_title"}
                      label="Headline"
                      style={{ width: "430px" }}
                    >
                      <Input
                        placeholder={"Headline"}
                        sytle={{ background: "#fff" }}
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col md={12} className="text-right">
                  <Upload
                    {...fileProps}
                    multiple={false}
                    showUploadList={false}
                  >
                    <Button className="dark-blue-btn">
                      {fileList ? fileList.name : "Upload File"}
                    </Button>
                  </Upload>
                </Col>
              </Row>
              <Row gutter={20} className="pb-15">
                <Col span={24}>
                  <Form.Item
                    name={`return_policy`}
                    label=""
                  // rules={[required('Business Information')]}
                  >
                    <BraftEditor
                      // value={editorState1}
                      controls={controls}
                      onChange={(e) => this.handleEditorChange(e, 1)}
                      contentStyle={{ height: 150 }}
                      className={"input-editor braft-editor"}
                      language="en"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Divider className="mb-30 mt-50" />
            {/* <Row gutter={28}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Title level={4}>Accepted Payment Methods</Title>
              </Col>
            </Row>
            <Row gutter={28}>
              <Col span={12}>
                <Checkbox
                  checked={is_paypal_accepted}
                  onChange={(e) => {
                    this.setState({ is_paypal_accepted: e.target.checked });
                  }}
                >
                  Paypal
                </Checkbox>
              </Col>
            </Row> */}
            {/* <Row gutter={28}>
              <Col span={12}>
                <Checkbox
                  checked={is_mastercard}
                  onChange={(e) => {
                    this.setState({ is_mastercard: e.target.checked });
                  }}
                >
                  Mastercard
                </Checkbox>
              </Col>
            </Row>
            <Row gutter={28}>
              <Col span={12}>
                <Checkbox
                  checked={is_visa}
                  onChange={(e) => {
                    this.setState({ is_visa: e.target.checked });
                  }}
                >
                  Visa
                </Checkbox>
              </Col>
            </Row>
            <Row gutter={28}>
              <Col span={12}>
                <Checkbox
                  checked={is_applepay}
                  onChange={(e) => {
                    this.setState({ is_applepay: e.target.checked });
                  }}
                >
                  ApplePay
                </Checkbox>
              </Col>
            </Row>
            <Row gutter={28}>
              <Col span={12}>
                <Checkbox
                  checked={gpay}
                  onChange={(e) => {
                    this.setState({ gpay: e.target.checked });
                  }}
                >
                  GPay
                </Checkbox>
              </Col>
            </Row>
            <Row gutter={28}>
              <Col span={12}>
                <Checkbox
                  checked={is_afterpay}
                  onChange={(e) => {
                    this.setState({ is_afterpay: e.target.checked });
                  }}
                >
                  AfterPay
                </Checkbox>
              </Col>
            </Row> */}
            <Row className="pt-15" style={{ alignItems: "center" }}>
              <Col md={12} className="text-left">
                {/* <Title level={4}>Size Guide</Title> */}
                <h2 className="orange-heading mb-0">Size Guide</h2>
              </Col>
              <Col md={12} className="text-right">
                {/* <Upload {...fileProps} multiple={false} showUploadList={false}>
                  <Button>{fileList ? fileList.name : "Upload File"}</Button>
                </Upload> */}
                <Button
                  size="middle"
                  className="dark-blue-btn"
                  onClick={() => this.setState({ openSizeGuideModal: true })}
                >
                  Upload Size Guide
                </Button>
              </Col>
            </Row>
            <Row gutter={0}>
              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={tableData}
                  className="size-guide-grid"
                />
              </Col>
            </Row>
            <Row className="pt-15" style={{ alignItems: "center" }}>
              <Col md={12} className="text-left">
                <h2 className="orange-heading mb-0">Shipping API</h2>
              </Col>
            </Row>
            <Row gutter={0}>
              <Col span={12}>
                <Form.Item
                  name="shipping_api_key"
                  label="API Key"
                  className="label-none"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="shipping_sender_id"
                  label="Sandle ID"
                  className="label-none"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row className="mr-0">
              <Col md={23} className="add-more-countrie">
                <Form.Item>
                  <Button
                    block
                    icon={<PlusOutlined />}
                    style={{ textAlign: "left", paddingLeft: "0" }}
                  >
                    Add more countries
                  </Button>
                </Form.Item>
              </Col>
            </Row> */}
            <div className="fr-paypal-btn retail-vendor-pro-footer step2">
              <Button
                htmlType="button"
                type="default"
                size="middle"
                className="previousStep mr-15"
                onClick={() => this.props.previousStep()}
              >
                Previous Step
              </Button>

              <Button
                htmlType="submit"
                type="primary"
                size="middle"
                className="btn-blue"
              >
                Next step
              </Button>
            </div>
          </Form>
          {/* <Divider /> */}
        </div>

        {openSizeGuideModal && (
          <SizeGuideModal
            visible={openSizeGuideModal}
            handleImageUpload={this.handleSizeGuideUpload}
            onSelectChange={this.onChange}
            fileList={guideList}
            selectedNodes={selectedNodes}
            selectedCat={selectedCat}
            onCancel={() => this.setState({ openSizeGuideModal: false })}
            recallTrader={() => this.getTraderProfile()}
          />
        )}

        {openUpdateSizeGuideModal && (
          <UpdateSizeGuide
            visible={openUpdateSizeGuideModal}
            selectedCat={selectedCat}
            editableGuide={editableGuide}
            onCancel={() => this.setState({ openUpdateSizeGuideModal: false })}
            recallTrader={() => this.getTraderProfile()}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, common } = store;
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
  };
};

export default connect(mapStateToProps, {
  getUserProfile,
  getTraderProfile,
  getEventTypes,
  getClassfiedCategoryListing,
  getBookingSubcategory,
  saveTraderProfile,
  deleteSizeGuide,
  enableLoading,
  disableLoading,
})(EventProfile);
