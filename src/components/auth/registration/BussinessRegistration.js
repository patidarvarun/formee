import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Redirect } from "react-router-dom";
import { Form, Input, Typography, Row, Col, Select } from "antd";
import {
  getOccupationType,
  registerBussinessUserAPI,
  getBookingCategory,
  getBookingSubcategory,
  fetchMasterDataAPI,
} from "../../../actions/index";
import { STATUS_CODES } from "../../../config/StatusCode";
import {
  DEFAULT_DEVICE_ID,
  DEFAULT_DEVICE_TYPE,
  DEFAULT_MODEL,
  SIZE,
} from "../../../config/Config";
import Icon from "../../../components/customIcons/customIcons";
import PlacesAutocomplete from '../../common/LocationInput'
import "./style.less";
import {
  validMobile,
  required,
  email,
  password,
  confirmPassword,
  minLength,
  whiteSpace,
  maxLength,
  validatePhoneNumber,
  validPhone,
} from "../../../config/FormValidation";
import { langs } from "../../../config/localization";
import { OCCUPATION_TYPE } from "../../../config/Constant";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

class BussinessRegistration extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      certificate: [],
      abnFile: [],
      docFile: [],
      subCategory: [],
      serviceType: "",
      occupationType: "",
      isEmpty: true,
      isRedirect: false,
      businessType: OCCUPATION_TYPE,
      category: [],
      retail: false,
      cat_id: "",
      address: '', state: '', city: '', pincode: '', latLng: ''
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentWillMount() {
    this.props.getBookingCategory((res) => { });
    this.getClassifiedType();
    this.getRetailType();
  }

  /**
   * @method getClassifiedType
   * @description get classified type
   */
  getClassifiedType = () => {
    const requestData = {
      business_type: "classified",
    };
    this.props.getOccupationType(requestData, (res) => {
      if (res.status === 200) {
        
        this.setState({ classifiedList: res.data });
      }
    });
  };

  /**
   * @method getRetailType
   * @description get retail type
   */
  getRetailType = () => {
    const requestData = {
      business_type: "retail",
    };
    this.props.getOccupationType(requestData, (res) => {
      if (res.status === 200) {
        
        this.setState({ retailList: res.data });
      }
    });
  };

  /**
   * @method componentDidUpdate
   * @description called to submit form
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.props.submitBussinessForm) {
      this.onFinish();
    }
  }

  /**
   * @method onFinishFailed
   * @description called to submit form
   */
  onFinishFailed = (errorInfo) => {
    return errorInfo;
  };

  /**
   * @method onFinish
   * @description called to submit form
   */
  onFinish = (values) => {
    const { lat, long, submitBussinessForm } = this.props;
    const {
      certificate,
      abnFile,
      docFile,
      occupationType,
      serviceType,
      size1,
      size2,
      size3, address, state, city, pincode, latLng, country, country_code, state_code
    } = this.state;
    const isEmpty =
      (certificate && certificate.length === 0) ||
      (docFile && abnFile.length === 0) ||
      (docFile && docFile.length === 0);
    let fileSize =
      (size1 && size1 > SIZE) ||
      (size2 && size2 > SIZE) ||
      (size3 && size3 > SIZE);
    let file1 = "",
      file2 = "",
      file3 = "";
    file1 =
      (certificate && certificate.type === "image/png") || (certificate && certificate.type === 'application/pdf') ||
      (certificate && certificate.type === "image/jpeg");
    file2 =
      (abnFile && abnFile.type === "image/png") || (abnFile && abnFile.type === 'application/pdf') ||
      (abnFile && abnFile.type === "image/jpeg");
    file3 =
      (docFile && docFile.type === "image/png") || (docFile && docFile.type === 'application/pdf') ||
      (docFile && docFile.type === "image/jpeg");

    
    if (this.onFinishFailed() !== undefined) {
      return true;
    } else if (isEmpty) {
      return true;
    } else if (fileSize) {
      return true;
    } else if (!file1 || !file2 || !file3) {
      return true;
    } else if ((address == '' || state == '' || city == '' || pincode == '')) {
      return true
    } else {
      window.scrollTo(0, 0);
      if (values !== undefined && (address !== '' && state !== '' && city !== '' && pincode !== '')) {
        values.device_type = DEFAULT_DEVICE_TYPE;
        values.device_id = DEFAULT_DEVICE_ID;
        values.device_model = DEFAULT_MODEL;
        values.network_provider = "jio";
        values.os_version = "8.3";
        values.app_version_no = "S7";
        values.trade_certificate = certificate;
        values.abn_acn_registration = abnFile;
        values.id_doc_image = docFile;
        values.id_doc_2_image = docFile;
        values.address = address;
        values.business_location = address;
        values.location = address;
        values.app_version_no = 1;
        values.business_city = city;
        values.business_lat = latLng.lat ? latLng.lat : lat ? lat : 12.1;
        values.business_lng = latLng.lng ? latLng.lng : long ? long : 12.5;
        values.business_pincode = pincode;
        values.business_state = state;
        values.occupation_type = occupationType;
        values.user_type = langs.key.business;
        values.service_type = serviceType;
        values.country = country
        values.country_code = country_code
        values.state_code = state_code

        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });
        this.props.registerBussinessUserAPI(formData, (res) => {
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, res.data.msg);
            setTimeout(() => {
              this.setState({ isRedirect: true });
            }, 3000);
          }
        });
      }
      // else if(submitBussinessForm){
      //   toastr.warning('Please enter valid address')
      // }
    }
  };

  /**
   * @method SelectTradeCertificate
   * @description handle certificate selection
   */
  SelectTradeCertificate = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let size = file.size;
    this.setState({ certificate: file, isEmpty: false, size1: size });
  };

  /**
   * @method SelectAbnFile
   * @description handle abn-acn file selection
   */
  SelectAbnFile = (e) => {
    let file = e.target.files[0];
    let size = file.size;
    this.setState({ abnFile: file, isEmpty: false, size2: size });
  };

  /**
   * @method SelectDocImage
   * @description handle doc file selection
   */
  SelectDocImage = (e) => {
    let file = e.target.files[0];
    let size = file.size;
    this.setState({ docFile: file, isEmpty: false, size3: size });
  };

  /**
   * @method removeFile
   * @description remove uploaded files
   */
  removeFile = (elId) => {
    if (elId === "file") {
      this.setState({ certificate: [], isEmpty: true });
    } else if (elId === "abn") {
      this.setState({ abnFile: [], isEmpty: true });
    } else if (elId === "id_doc") {
      this.setState({ docFile: [], isEmpty: true });
    }
  };

  /**
   * @method renderUploadField
   * @description render upload input field
   */
  renderUploadField = (fileName, elId) => {
    const { submitBussinessForm } = this.props;
    
    let oversizedImage =
      fileName && fileName.length !== 0 && fileName.size > SIZE;
    let fileType = fileName && fileName.length !== 0 && fileName.type;
    let validType = fileType === "image/png" || fileType === "image/jpeg" || fileType === 'application/pdf';
    return (
      <div>
        <div className="form-control custom-file-upload">
          {fileName && fileName.length !== 0 ? (
            <div className="upload-file-name">
              <span>{fileName.name}</span>
              <Icon
                icon="delete"
                size="20"
                onClick={(e) => this.removeFile(elId)}
              />
            </div>
          ) : (
              <label htmlFor={elId}>
                {"Choose file to upload"}
                <Icon icon="upload" size="20" />
              </label>
            )}
        </div>
        {submitBussinessForm && fileName && fileName.length === 0 && (
          <div className="ant-form-item-explain form-item-split">
            {langs.validation_messages.imgRequired}
          </div>
        )}
        {fileName && fileName.length !== 0 && oversizedImage && validType && (
          <div className="ant-form-item-explain form-item-split">
            {langs.validation_messages.imgSize}
          </div>
        )}
        {fileName && fileName.length !== 0 && !validType && (
          <div className="ant-form-item-explain form-item-split">
            {langs.validation_messages.imgType}
          </div>
        )}
      </div>
    );
  };

  /**
   * @method onBusinessTypeChange
   * @description handle business type change
   */
  onBusinessTypeChange = (value) => {
    this.setState({ type: value });
    const { bookingCategory } = this.props;
    const { classifiedList, retailList } = this.state;
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        occupation_type: null,
        service_type: null,
      });
    
    if (value === langs.key.booking) {
      this.setState({ category: bookingCategory });
    } else if (value === langs.key.classified) {
      this.setState({ category: classifiedList, isVisible: false });
    } else if (value === langs.key.retail) {
      this.setState({ category: retailList, retail: true, isVisible: false });
    }
  };

  /**
   * @method onCategoryChange
   * @description handle category change
   */
  onCategoryChange = (value) => {
    
    this.setState({ cat_id: value });
    if (this.state.type === langs.key.booking) {
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          service_type: null,
        });
      this.props.getBookingSubcategory(value, (res) => {
        if (res.status === STATUS_CODES.OK) {
          const subCategory = Array.isArray(res.data.data) ? res.data.data : [];
          this.setState({
            isVisible: true,
            occupationType: value,
            subCategory: subCategory,
            serviceType: "",
          });
        } else {
          this.setState({ isVisible: false });
        }
      });
    } else {
      this.setState({ occupationType: value });
    }
  };

  /**
   * @method onSubCategoryChange
   * @description handle sub category change
   */
  onSubCategoryChange = (value) => {
    this.setState({ serviceType: value });
  };

  /**
   * @method bussinessCategory
   * @description render bussiness type list
   */
  bussinessCategory = (businessType) => {
    return (
      businessType.length !== 0 &&
      businessType.map((keyName, i) => {
        return (
          <Option key={i} value={keyName.value}>
            {keyName.name}
          </Option>
        );
      })
    );
  };

  /**
   * @method occupationType
   * @description render booking category list
   */
  occupationType = (occupationType) => {
    const { retail } = this.state;
    return (
      occupationType.length !== 0 &&
      occupationType.map((keyName, i) => {
        return (
          <Option key={i} value={keyName.id}>
            {retail ? keyName.text : keyName.name}
          </Option>
        );
      })
    );
  };

  /**
   * @method bookingCategory
   * @description render booking category list
   */
  bookingCategory = (bookingCategory) => {
    if (this.state.type === langs.key.booking) {
      return (
        bookingCategory.length !== 0 &&
        bookingCategory.map((keyName, i) => {
          return (
            <Option key={i} value={keyName.id}>
              {keyName.name}
            </Option>
          );
        })
      );
    } else {
      return Object.keys(bookingCategory).map((keyName, i) => (
        <Option value={bookingCategory[keyName]} key={i}>
          {keyName}
        </Option>
      ));
    }
  };

  /**
   * @method bookingSubCategory
   * @description render booking sub  category list
   */
  bookingSubCategory = (subCategory) => {
    return (
      subCategory.length !== 0 &&
      subCategory.map((keyName, i) => {
        return (
          <Option key={i} value={keyName.id}>
            {keyName.name}
          </Option>
        );
      })
    );
  };

  /** 
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field 
   */
  handleAddress = (result, address, latLng) => {
    let state = '';
    let city = '';
    let pincode = ''
    let state_code = ''
    let country_code = ''
    let country = ''

    result.address_components.map((el) => {
      if (el.types[0] === 'administrative_area_level_1') {
        state = el.long_name
        state_code = el.short_name
      } else if (el.types[0] === 'administrative_area_level_2') {
        city = el.long_name
      }else if (el.types[0] === 'country') {
        country = el.long_name
        country_code = el.short_name
      } else if (el.types[0] === 'postal_code') {
        this.setState({ postal_code: el.long_name })
        pincode = el.long_name
        this.formRef.current.setFieldsValue({
          pincode: el.long_name
        });
      }
    })
    
    this.setState({ 
      address: address, 
      latLng: latLng, 
      state: state, 
      city: city, 
      pincode: pincode,
      country: country, 
      country_code: 
      country_code, 
      state_code: state_code
     })
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      cat_id,
      category,
      certificate,
      abnFile,
      docFile,
      isVisible,
      subCategory,
      isRedirect,
      businessType,
      address, state, city, pincode
    } = this.state;
    const { bookingCategory, submitBussinessForm } = this.props;
    if (isRedirect) {
      return (
        <Redirect
          push
          to={{
            pathname: "/",
          }}
        />
      );
    }
    return (
      <Row>
        <Col span={12}>
          <div className="signup-left-box">
            <Title level={1} className="uppercase">
              Sign up
            </Title>
            <Paragraph>All Fields Required</Paragraph>
            <div className="align-center pt-30">
              <Text className="fs-10 inline-block">
                By Signing up or logging in, you agree to our <br />
                terms & conditions and privacy policy.
              </Text>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <Form
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            scrollToFirstError
            id="bussiness-form"
            ref={this.formRef}
          >
            <Title level={4} className="text-blue fs-18">
              Personal Contact Details
            </Title>
            <Form.Item
              label="First Name"
              name="fname"
              rules={[required("First name"), whiteSpace("First name")]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lname"
              rules={[required("Last name"), whiteSpace("Last name")]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              onChange={({ target }) => {
                this.formRef.current.setFieldsValue({
                  [target.id]: target.value.trim(),
                });
              }}
              rules={[required("Email id"), email]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Contact Number"
              name="mobile"
              rules={[{ validator: validMobile }]}
            >
              <Input type={"text"} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[password, minLength(8)]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="password_confirmation"
              dependencies={["password"]}
              hasFeedback
              rules={[
                confirmPassword,
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      langs.validation_messages.passwordNotMatch
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Title level={4} className="text-blue fs-18">
              Business Contact Details
            </Title>
            <Form.Item
              label="Business Name"
              name="business_name"
              rules={[required("Business name"), whiteSpace("Business name")]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Business Location"
              name="business_location"
              className="signup-location"
              rules={[
                (address === '' || address === undefined || address === 'N/A' || address === null) && [required('Business location')],
                // whiteSpace("Business location"),
              ]}
            >
              <PlacesAutocomplete
                // name='address'
                handleAddress={this.handleAddress}
                addressValue={this.state.address}
              />
            </Form.Item>
            {submitBussinessForm && address !== '' && (state === '' || city === '' || pincode === '') && (
              <div className="ant-form-item-explain form-item-split">
                {'Please enter valid address'}
              </div>
            )}
            {submitBussinessForm && (address === '') && (
              <div className="ant-form-item-explain form-item-split">
                {'Business location is required'}
              </div>
            )}
            <Form.Item
              label="Business Phone Number"
              name="business_phone_number"
              rules={[{ validator: validPhone }]}
            >
              <Input type={"text"} />
            </Form.Item>
            <Form.Item
              name="business_type"
              label="Business Category"
              rules={[required("Business category")]}
            >
              <Select
                placeholder="Select"
                onChange={this.onBusinessTypeChange}
                allowClear
              >
                {businessType && this.bussinessCategory(businessType)}
              </Select>
            </Form.Item>
            <Form.Item
              name="occupation_type"
              label="Occupation Type"
              rules={[required("Occupation type")]}
            >
              <Select
                placeholder="Select"
                onChange={this.onCategoryChange}
                allowClear
              >
                {category && this.bookingCategory(category)}
              </Select>
            </Form.Item>

            {cat_id !== 39 && isVisible && (
              <Form.Item
                label="Service Type"
                name="service_type"
                rules={cat_id === 39 ? "" : [required("Service type")]}
              >
                <Select
                  placeholder="Service Type"
                  onChange={this.onSubCategoryChange}
                  allowClear
                >
                  {subCategory && this.bookingSubCategory(subCategory)}
                </Select>
              </Form.Item>
            )}

            <Title level={4} className="text-blue fs-18">
              How would you like to be paid?
            </Title>
            <Form.Item
              label="BSB"
              name="bsb"
              rules={[required("BSB"), whiteSpace("BSB")]}
            >
              <Input type={"number"} />
            </Form.Item>
            <Form.Item
              label="Account Name"
              name="account_name"
              rules={[required("Account name"), whiteSpace("Account name")]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Account Number"
              name="account_number"
              rules={[required("Account number"), whiteSpace("Account number")]}
            >
              <Input type={"number"} />
            </Form.Item>
            <Form.Item
              label="ABN/ACN"
              name="abn_acn_number"
              rules={[required("ABN/ACN"), whiteSpace("ABN/ACN")]}
            >
              <Input type={"number"} />
            </Form.Item>

            <Title level={4} className="text-blue fs-18 fm-upload-title">
              Upload
            </Title>
            <Text className="fs-10 fm-photo-text">
              Photos can be up to 4MB for the types .png  .jpeg  .pdf format
            </Text>
            <Form.Item
              name="trade_certificate"
              label="Trade Certificate"
              id="file"
            >
              <input
                className="col-md-4"
                type="file"
                id="file"
                onChange={this.SelectTradeCertificate}
                style={{ display: "none" }}
                // accept={".jpeg, .png"}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
              {this.renderUploadField(certificate, "file")}
            </Form.Item>
            <Form.Item
              name="abn_acn_registration"
              label="ABN / ACN Registration"
            >
              <input
                className="col-md-4"
                type="file"
                id="abn"
                onChange={this.SelectAbnFile}
                style={{ display: "none" }}
                // accept={".jpeg, .png,"}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
              {this.renderUploadField(abnFile, "abn")}
            </Form.Item>
            <Form.Item name="id_doc_image" label="ID Front / Back">
              <input
                className="col-md-4"
                type="file"
                id="id_doc"
                onChange={this.SelectDocImage}
                style={{ display: "none" }}
                // accept={".jpeg, .png,"}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
              {this.renderUploadField(docFile, "id_doc")}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (store) => {
  const { common } = store;
  const { bookingCategoty, location } = common;
  let bookingCategory = [];
  if (common) {
    bookingCategory =
      bookingCategoty &&
      Array.isArray(bookingCategoty.data) &&
      bookingCategoty.data;
  }
  return {
    bookingCategory,
    lat: location && location.lat,
    long: location && location.long,
  };
};
export default connect(mapStateToProps, {
  registerBussinessUserAPI,
  getBookingCategory,
  getBookingSubcategory,
  getOccupationType,
})(BussinessRegistration);
