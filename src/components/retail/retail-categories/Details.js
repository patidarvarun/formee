import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import csc from "country-state-city";
import { toastr } from "react-redux-toastr";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  InputNumber,
  Menu,
  Tooltip,
  Layout,
  Typography,
  Tabs,
  Row,
  Col,
  Input,
  Select,
  Button,
  Rate,
  Collapse,
  Modal,
  Dropdown,
  List,
} from "antd";
import Icon from "../../../components/customIcons/customIcons";
import { DownOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import {
  fedexAPI,
  removeToRetailWishlist,
  addToRetailWishList,
  addToCartAPI,
  getRetailCategoryDetail,
  enableLoading,
  disableLoading,
  addToWishList,
  removeToWishList,
  openLoginModel,
} from "../../../actions/index";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../config/Config";
import { langs } from "../../../config/localization";
import moment from "moment";
import {
  convertHTMLToText,
  salaryNumberFormate,
  getAddress,
  converInUpperCase,
  dateFormat4,
} from "../../common";
import { STATUS_CODES } from "../../../config/StatusCode";
import { MESSAGES } from "../../../config/Message";
import { SocialShare } from "../../common/social-share";
import history from "../../../common/History";
import { rating } from "../../classified-templates/CommanMethod";
import {
  getRetailCatLandingRoutes,
  getRetailSubcategoryRoute,
  getMapDetailRoute,
} from "../../../common/getRoutes";
import Review from "./product-review/RetailReview";
import BookProduct from "../retail-categories/product-booking";
import { capitalizeFirstLetter } from "../../common";
import Carousel from "../../common/caraousal";
import SimilarAdBlock from "../../retail/retail-categories/SimilarAds";
//import LeaveFeedBackModel from './LeaveFeedbackModel'
import ViewSizeGuide from "../../vendor/retail/comman-modals/ViewSizeGuide";
import ReportAd from "../../classified-templates/common/modals/ReportAdModal";
import SellerInformation from "./SellerInformation";
import { useRef } from "react";
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: "align-center pt-20",
};
const infoLayout = {
  wrapperCol: { offset: 7, span: 13 },
  className: "align-center",
};

class DetailPage extends React.Component {
  formRef = React.createRef();

  myDivToFocus = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      classifiedDetail: [],
      allData: "",
      visible: false,
      bookProduct: false,
      reviewModel: false,
      filteredData: [],
      isFilter: false,
      label: "All Feedback",
      reviewTab: false,
      activeTab: "1",
      carouselNav1: null,
      carouselNav2: null,
      showNumber: false,
      is_favourite: false,
      colorArray: [],
      sizeArray: [],
      groupAtt: [],
      available_quantity: 0,
      selectedQuantity: 0,
      invAttData: "",
      children: [],
      leaveFeedback: false,
      seeMore: false,
      sizeGuideModel: false,
      reportAdModel: false,
      isPostageOpen: false,
      label_1: "",
      label_2: "",
      exclusion: "",
      posting_to: "",
      activePanel: "1",
      number: "",
      postage_delivery: [],
      postingCountryList: [],
      allCountries: csc.getAllCountries(),
      postage_section: "",
      geoLocation: "",
      product_image: "",
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props from components
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial = this.props.match.params.classified_id;
    let catIdNext = nextprops.match.params.classified_id;
    if (catIdInitial !== catIdNext) {
      this.getDetails(catIdNext);
    }
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getDetails();
    this.getCurrentLocation();
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.setState({
      carouselNav1: this.slider1,
      carouselNav2: this.slider2,
    });
  }

  /**
   * @method getDetails
   * @description get classified details
   */
  getDetails = (filterKey) => {
    let classified_id = this.props.match.params.classified_id;
    const { isLoggedIn, loggedInDetail } = this.props;
    const { allCountries } = this.state;
    let child = [];
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInDetail.id : "",
      filter: filterKey ? filterKey : "top_rated",
      feedback_sort: filterKey ? filterKey : "recent",
    };
    this.props.getRetailCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let wishlist =
          res.data && res.data.data && res.data.data.wishlist === 1
            ? true
            : false;
        let similarAd = res.data.similaradd;
        console.log("similarAd", similarAd);
        let invAttData = res.data && res.data.inv_attribute_group_new,
          defaultColor = "",
          product_image = "",
          inv_title1 = "",
          inv_title2 = "";
        let groupAtt =
          res.data &&
          res.data.inv_attribute_group_new &&
          res.data.inv_attribute_group_new.inv_attributes &&
          Array.isArray(res.data.inv_attribute_group_new.inv_attributes) &&
          res.data.inv_attribute_group_new.inv_attributes.length
            ? res.data.inv_attribute_group_new.inv_attributes
            : [];
        if (groupAtt && Array.isArray(groupAtt) && groupAtt.length) {
          defaultColor = groupAtt[0];
          inv_title1 = groupAtt[0].display_name;
          product_image = groupAtt[0].images;
          child =
            groupAtt[0].children &&
            Array.isArray(groupAtt[0].children) &&
            groupAtt[0].children.length
              ? groupAtt[0].children
              : "";
          inv_title2 = child && child[0].display_name;
        }
        let postage_details =
          res.data && res.data.data ? res.data.data.classified_users : "";
        let exclusion =
          postage_details &&
          postage_details.postages &&
          Array.isArray(postage_details.postages) &&
          postage_details.postages.length
            ? postage_details.postages
            : "";
        let temp = [],
          temp2 = [],
          result = [];
        if (exclusion) {
          result = allCountries.filter(
            (o) => !exclusion.some((v) => v.name === o.name)
          );
          exclusion &&
            exclusion.map((el) => {
              temp.push(el.country);
            });
        }
        result &&
          result.length &&
          result.map((el) => {
            temp2.push(el.name);
          });

        console.log("temp2", temp2);
        this.setState(
          {
            classifiedDetail: res.data && res.data.data,
            allData: res.data,
            is_favourite: wishlist,
            groupAtt: groupAtt,
            invAttData: invAttData,
            available_quantity: res.data && res.data.data.quantity,
            similarAd: similarAd,
            children: child,
            selectedColor: defaultColor && defaultColor.id,
            label_1: defaultColor && defaultColor.display_name,
            label_2:
              child && Array.isArray(child) && child.length
                ? child[0].display_name
                : "",
            selectedColorName: defaultColor && defaultColor.inv_attribute_value,
            exclusion: temp && temp.length ? temp.join() : "",
            posting_to: temp2 && temp2.length ? temp2.join() : "",
            postingCountryList: result ? result : [],
            inv_title1: inv_title1 ? inv_title1 : "",
            inv_title2: inv_title2 ? inv_title2 : "",
            product_image: res.data && res.data.data.is_inventory_added === 1 
              ? product_image
              : res.data && res.data.data.classified_image,
          },
          () => {
            this.getFedexResponse("");
          }
        );
      }
    });
  };

  getCurrentLocation = () => {
    const { lat, long } = this.props;
    getAddress(lat, long, (res) => {
      let state = "",
        city = "",
        pincode = "",
        state_code = "",
        country_code = "",
        country = "";
      res.address_components &&
        res.address_components.map((el) => {
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
          }
        });
      let geoLocation = {
        location: res.formatted_address,
        lat: lat,
        lng: long,
        country: country,
        country_code: country_code.substring(0, 2),
        state: state,
        state_code: state_code.substring(0, 2),
        city: city,
        pincode: pincode,
      };
      this.setState({ geoLocation: geoLocation });
    });
  };

  /**
   * @method getFedexAPI
   * @description fetch shipping details
   */
  getFedexAPI = (reqData) => {
    const formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == "object") {
        formData.append(key, JSON.stringify(reqData[key]));
      } else {
        formData.append(key, reqData[key]);
      }
    });
    this.props.fedexAPI(formData, (res) => {
      if (res.status === STATUS_CODES.OK) {
        console.log("res", res.data.data);
        let temp =
          Array.isArray(res.data.data) && res.data.data.length
            ? res.data.data[0]
            : "";
        this.setState({
          postage_delivery: res.data ? res.data.data : [],
          postage_section: temp,
        });
      }
    });
  };

  /**
   * @method getFedexResponsebyCountryCode
   * @description get selected country details
   */
  getFedexResponsebyCountryCode = (selected_country_code) => {
    const { classifiedDetail } = this.state;
    let shipper = classifiedDetail && classifiedDetail.classified_users;
    let data = classifiedDetail ? classifiedDetail : "";
    const reqData = {
      StreetLines_Shipper: shipper ? shipper.business_location : "",
      City_Shipper: shipper ? shipper.city : "",
      StateOrProvinceCode_Shipper:
        shipper && shipper.state_code ? shipper.state_code.substring(0, 2) : "",
      PostalCode_Shipper: shipper ? shipper.business_pincode : "",
      CountryCode_Shipper:
        shipper && shipper.country_code
          ? shipper.country_code.substring(0, 2)
          : "",
      CountryCode_Recipient: selected_country_code
        ? selected_country_code.substring(0, 2)
        : "",
      packages: [
        {
          Weight: data && data.weight,
          Length: data && data.length,
          Width: data && data.width,
          Height: data && data.height,
          GroupPackageCount: "1",
        },
      ],
    };
    this.getFedexAPI(reqData);
  };

  /**
   * @method getFedexResponse
   * @description get fedex shipping details
   */
  getFedexResponse = (selected_country_code) => {
    const { geoLocation, classifiedDetail } = this.state;
    const { isLoggedIn, userDetails } = this.props;
    let shipper = classifiedDetail && classifiedDetail.classified_users;
    let data = classifiedDetail ? classifiedDetail : "";
    // if(isLoggedIn){
    //   const reqData = {
    //     StreetLines_Shipper: shipper ? shipper.business_location : '',
    //     City_Shipper:shipper ? shipper.city : '',
    //     StateOrProvinceCode_Shipper: shipper && shipper.state_code ? (shipper.state_code).substring(0, 2): '',
    //     PostalCode_Shipper: shipper ? shipper.business_pincode : '',
    //     CountryCode_Shipper: shipper && shipper.country_code ? (shipper.country_code).substring(0, 2) : '',
    //     StreetLines_Recipient: userDetails.address,
    //     City_Recipient: userDetails.city ? userDetails.city : '',
    //     StateOrProvinceCode_Recipient: userDetails.state_code ? (userDetails.state_code).substring(0, 2) : '',
    //     PostalCode_Recipient:userDetails.pincode ? userDetails.pincode : '',
    //     CountryCode_Recipient: selected_country_code ? (selected_country_code).substring(0, 2) : userDetails.country_code ? (userDetails.country_code).substring(0, 2) : '',
    //     packages:[{ "Weight": data && data.weight, "Length": data && data.length, "Width": data && data.width, "Height": data && data.height, "GroupPackageCount": "1" }],
    //   }
    //   this.getFedexAPI(reqData)
    // }else {
    console.log("geolocation", geoLocation);
    const reqData = {
      StreetLines_Shipper: shipper ? shipper.business_location : "",
      City_Shipper: shipper ? shipper.city : "",
      StateOrProvinceCode_Shipper:
        shipper && shipper.state_code ? shipper.state_code.substring(0, 2) : "",
      PostalCode_Shipper: shipper ? shipper.business_pincode : "",
      CountryCode_Shipper:
        shipper && shipper.country_code
          ? shipper.country_code.substring(0, 2)
          : "",
      StreetLines_Recipient: geoLocation
        ? geoLocation.location
        : "13450 Farmcrest Ct",
      City_Recipient: geoLocation ? geoLocation.city : "Herndon",
      StateOrProvinceCode_Recipient: geoLocation
        ? geoLocation.state_code
        : "VA",
      PostalCode_Recipient: geoLocation ? geoLocation.pincode : "20171",
      CountryCode_Recipient: geoLocation ? geoLocation.country_code : "US",
      packages: [
        {
          Weight: data && data.weight,
          Length: data && data.length,
          Width: data && data.width,
          Height: data && data.height,
          GroupPackageCount: "1",
        },
      ],
    };
    this.getFedexAPI(reqData);
    // }
  };

  /**
   * @method handleAdTocart
   * @description handle add to cart
   */
  handleAdTocart = (requestData) => {
    this.props.addToCartAPI(requestData, (res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          toastr.success(langs.success, MESSAGES.AD_TO_CART);
          this.setState({ visible: true });
        } else {
          toastr.error(langs.error, res.data.msg);
        }
      }
    });
  };

  /**
   * @method addToCart
   * @description add to cart
   */
  addToCart = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const {
      classifiedDetail,
      available_quantity,
      invAttData,
      selectedQuantity,
      selectedColor,
    } = this.state;
    let classified_id = this.props.match.params.classified_id;
    if (isLoggedIn) {
      let requestData = {
        ship_cost: 0,
        classifiedInvAttr_group_id: selectedColor ? selectedColor : 0,
        available_qty: available_quantity,
        qty: selectedQuantity ? selectedQuantity : 1,
        classified_id: classified_id,
        user_id: loggedInDetail.id,
      };
      if (selectedColor) {
        if (selectedQuantity) {
          this.handleAdTocart(requestData);
        } else {
          toastr.warning("Please enter product quantity");
        }
      } else {
        // toastr.warning("Please Select product item");
        this.handleAdTocart(requestData);
      }
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method bookProductModal
   * @description handle make an offer model
   */
  bookProductModal = () => {
    const { selectedQuantity, classifiedDetail } = this.state;
    const { isLoggedIn } = this.props;
    if (classifiedDetail && classifiedDetail.price === 0) {
      toastr.warning(langs.warning, MESSAGES.NOT_ABLE_APPLY_OFFER);
      return true;
    } else {
      if (isLoggedIn) {
        if (selectedQuantity) {
          this.setState({
            bookProduct: true,
          });
        } else {
          toastr.warning("Please enter product quantity");
        }
      } else {
        this.props.openLoginModel();
      }
    }
  };

  /**
   * @method contactModal
   * @description contact model
   */
  leaveReview = () => {
    const { classifiedDetail, loggedInDetail, isLoggedIn } = this.props;
    let feedback =
      classifiedDetail &&
      classifiedDetail.feedback &&
      Array.isArray(classifiedDetail.feedback) &&
      classifiedDetail.feedback.length
        ? classifiedDetail.feedback
        : [];
    if (isLoggedIn) {
      if (feedback && feedback.length) {
        feedback.some((el) => {
          if (el.user_id === loggedInDetail.id) {
            toastr.warning("warning", "You have already added your review.");
            this.setState({ isUserExits: true, leaveFeedback: false });
          } else {
            this.setState({ isUserExits: false, leaveFeedback: true });
          }
        });
      } else if (feedback.length === 0) {
        this.setState({ isUserExits: false, leaveFeedback: true });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = (e) => {
    this.setState({
      visible: false,
      bookProduct: false,
      reviewModel: false,
      leaveFeedback: false,
    });
  };

  /**
   * @method renderSpecification
   * @description render specification list
   */
  renderSpecification = (data) => {
    let temp =
      data && Array.isArray(data) && data.length
        ? data.filter((el) => el.key !== "Features" && el.key !== "Price")
        : [];
    let sorted_list =
      temp &&
      temp.sort((a, b) => {
        if (a.position < b.position) return -1;
        if (a.position > b.position) return 1;
        return 0;
      });
    console.log("sorted_list", sorted_list);
    return (
      sorted_list &&
      Array.isArray(sorted_list) &&
      sorted_list.map((el, i) => {
        let value =
          el.key === "Price" ? `AU$${salaryNumberFormate(el.value)}` : el.value;
        return (
          <Fragment key={i}>
            <Col span={6}>
              <label className="strong">{el.key}:</label>
            </Col>
            <Col span={6}>
              <div className="font-normal">{value}</div>
            </Col>
          </Fragment>
        );
      })
    );
  };

  /**
   * @method onSelection
   * @description handle favorite unfavorite
   */
  onSelection = (data, classifiedid) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const { is_favourite } = this.state;
    if (isLoggedIn) {
      if (data.wishlist === 1 || is_favourite) {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: classifiedid,
        };
        this.props.enableLoading();
        this.props.removeToRetailWishlist(requestData, (res) => {
          this.props.disableLoading();
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
            this.setState({ is_favourite: false });
          }
        });
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: classifiedid,
        };
        this.props.enableLoading();
        this.props.addToRetailWishList(requestData, (res) => {
          this.props.disableLoading();
          this.setState({ flag: !this.state.flag });
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS);
            this.setState({ is_favourite: true });
          }
        });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  activeTab = (tab, panel) => {
    this.setState({ activeTab: tab, activePanel: panel });
    if (this.myDivToFocus.current) {
      window.scrollTo(0, this.myDivToFocus.current.offsetTop);
    }
  };

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    this.setState({ activeTab: key, reviewTab: false });
  };

  /**
   * @method renderSize
   * @description render size
   */
  renderSize = (size) => {
    console.log("size", size);
    if (size && size.length) {
      return size.map((el, i) => {
        return (
          <Option key={i} value={el.inv_attribute_value}>
            {el.inv_attribute_value}
          </Option>
        );
      });
    }
  };

  /**
   * @method handleQuantityChange
   * @description handle quantity change
   */
  handleQuantityChange = (e) => {
    console.log("e", e);
    const { available_quantity, number } = this.state;
    if (e > available_quantity) {
      toastr.warning("Selected quantity are not available for this product");
    } else {
      this.setState({ selectedQuantity: e });
    }
  };

  /**
   * @method onItemSelection
   * @description handle product item selection
   */
  onItemSelection = (data) => {
    let obj = data && JSON.parse(data);
    console.log(obj.children, "data");
    let children = [];
    const { groupAtt } = this.state;
    let quantity = 0;
    let temp =
      obj && Array.isArray(obj.children) && obj.children.length
        ? obj.children
        : [];

    console.log("temp", temp);
    if (temp && temp.length) {
      temp &&
        temp.length &&
        temp.map((el, i) => {
          children.push({ id: i, inv_attribute_value: el.inv_attribute_value });
          quantity = quantity + Number(el.quantity);
        });
    }
    console.log("children", children);
    this.setState({
      selectedColor: obj.id,
      children: children,
      selectedColorName: obj.inv_attribute_value,
      product_image: obj.images,
      available_quantity: quantity ? quantity : obj.quantity ? obj.quantity : 0,
    });
  };

  renderColorOption = (groupAtt) => {
    console.log("color", groupAtt);
    return (
      groupAtt &&
      groupAtt.length &&
      groupAtt.map((el, i) => {
        return (
          <Option key={i} value={JSON.stringify(el)}>
            {el.inv_attribute_value}
          </Option>
        );
      })
    );
  };

  handleNumberChange = (key) => {
    const { number } = this.state;
    let temp = number;
    if (key === "increament" || temp === 0) {
      temp++;
      this.handleQuantityChange(temp);
    } else if (key === "decrement") {
      --temp;
      this.handleQuantityChange(temp);
    }
    this.setState({ number: temp });
  };

  /**
   * @method renderInvAttSection
   * @description render inv att section
   */
  renderInvAttSection = () => {
    const {
      number,
      groupAtt,
      children,
      available_quantity,
      selectedColorName,
    } = this.state;
    let quantity = [];
    for (let i = 1; i < available_quantity; i++) {
      quantity.push({ key: i, value: i });
    }
    console.log("groupAtt", groupAtt);
    if (groupAtt && groupAtt.length) {
      let title1 = groupAtt[0].display_name
        ? groupAtt[0].display_name
        : "Product Description";
      let child =
        groupAtt[0].children &&
        Array.isArray(groupAtt[0].children) &&
        groupAtt[0].children.length
          ? groupAtt[0].children[0]
          : "";
      let title2 = child ? child.display_name : "Select";
      console.log(title1, "enter", title2, child);
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <div className="choose-colour custom-gray-select-list">
                <label for="select-colour">Select {title1}</label>
                <Select
                  value={selectedColorName}
                  onChange={(e) => this.onItemSelection(e)}
                >
                  {/* <option hidden >...</option> */}
                  {this.renderColorOption(groupAtt)}
                </Select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="choose-size custom-gray-select-list">
                <label for="select-size">Select {title2}</label>
                <Select onChange={(e) => this.setState({ selectedSize: e })}>
                  <Option hidden>...</Option>
                  {children && children.length && this.renderSize(children)}
                </Select>
              </div>
            </div>
          </div>
          <div className="quantity-size-block custom-gray-select-list">
            <div className="choose-quantity">
              <label for="select-quantity">Select Quantity</label>
              {/* <Select onChange={this.handleQuantityChange}>
                    <Option hidden >...</Option>
                   {quantity && quantity.length && quantity.map((el,i) => {
                     return <Option value={el.value}>{el.key}</Option>
                   })}
                  </Select> */}
              {/* <InputNumber
                    onChange={(value) =>
                      this.handleQuantityChange(value)
                    }
                    min={1}
                    type="number"
                  /> */}
              <div className="choose-quantity-input">
                <MinusOutlined
                  onClick={() => this.handleNumberChange("decrement")}
                />
                <Input
                  placeholder="1"
                  type="number"
                  value={number}
                  onChange={(e) => this.handleQuantityChange(number)}
                />
                <PlusOutlined
                  onClick={() => this.handleNumberChange("increament")}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  /**
   * @method renderPaymentMethods
   * @description render payment mrthods
   */
  renderPaymentMethods = (trader_detail, is_visible) => {
    return (
      trader_detail && (
        <div className="payment-selector">
          {is_visible && <label>Payments:</label>}
          <div className="payment-icons">
            {trader_detail.is_paypal_accepted && (
              <img
                src={require("../../../assets/images/icons/paypal.svg")}
                alt="paypal"
              />
            )}
            {trader_detail.is_mastercard && (
              <img
                src={require("../../../assets/images/icons/mastero.svg")}
                alt="mastero"
              />
            )}
            {trader_detail.is_visa && (
              <img
                src={require("../../../assets/images/icons/visa.svg")}
                alt="visa"
              />
            )}
            {trader_detail.is_gpay && (
              <img
                src={require("../../../assets/images/icons/gpay.svg")}
                alt="gpay"
              />
            )}
            {trader_detail.is_applepay && (
              <img
                src={require("../../../assets/images/icons/apple-pay.svg")}
                alt="apple-pay"
                className="aferpay"
              />
            )}
            {!is_visible && <span className="custom-br"></span>}
            {trader_detail.is_afterpay && (
              <img
                src={require("../../../assets/images/icons/after-pay.svg")}
                alt="apple-pay"
                className="apple-pay-img"
              />
            )}
            {is_visible && (
              <span>
                maybe available{" "}
                <a
                  href="Javasript:void(0)"
                  onClick={() => this.activeTab("4", "3")}
                >
                  Learn More
                </a>
              </span>
            )}
          </div>
        </div>
      )
    );
  };

  renderPostageDelivery = (data) => {
    if (data && data.length) {
      return data.map((el, i) => {
        let temp =
          el.RateTypes && Array.isArray(el.RateTypes) && el.RateTypes.length
            ? el.RateTypes[0].split(":")
            : "";
        console.log("price", price);
        let price =
          temp && Array.isArray(temp) && temp.length > 1 ? temp[1] : "";
        return (
          <tr key={i}>
            <td>{price && `AU $${price}`}</td>
            <td>{el.ServiceType}</td>
            <td>Yes</td>
            {/* <td><span className="bold">Estimated between Wed. 3 Feb - Thu. 11 Feb</span></td> */}
            <td>
              <span className="bold">{`Estimated between ${
                el.DeliveryDayOfWeek
              }  ${moment(el.DeliveryTimestamp).format("Do MMM")}`}</span>
            </td>
          </tr>
        );
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isLoggedIn, loggedInDetail } = this.props;
    const {
      inv_title1,
      inv_title2,
      product_image,
      postage_section,
      postingCountryList,
      postage_delivery,
      available_quantity,
      groupAtt,
      activePanel,
      posting_to,
      exclusion,
      label_1,
      label_2,
      children,
      selectedColorName,
      selectedSize,
      selectedQuantity,
      isPostageOpen,
      reportAdModel,
      sizeGuideModel,
      label,
      is_favourite,
      bookProduct,
      classifiedDetail,
      activeTab,
      allData,
      number,
      colorArray,
      sizeArray,
      similarAd,
      reviewModel,
      leaveFeedback,
    } = this.state;
    let clasified_user_id =
      classifiedDetail && classifiedDetail.classified_users
        ? classifiedDetail.classified_users.id
        : "";
    let isButtonVisible =
      isLoggedIn && loggedInDetail.id === clasified_user_id ? false : true;
    let rate =
      classifiedDetail &&
      classifiedDetail.classified_hm_reviews &&
      rating(classifiedDetail.classified_hm_reviews);
    let parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let classified_id = parameter.classified_id;
    let categoryName = classifiedDetail.categoriesname
      ? classifiedDetail.categoriesname.name
      : "";
    let subCategoryName = classifiedDetail.mid_level_category
      ? classifiedDetail.mid_level_category.name
      : classifiedDetail.subcategoriesname
      ? classifiedDetail.subcategoriesname.name
      : "";
    let subCategoryId = classifiedDetail.mid_level_category
      ? classifiedDetail.mid_level_category.id
      : classifiedDetail.subcategoriesname
      ? classifiedDetail.subcategoriesname.id
      : "";
    let categoryPagePath = classifiedDetail.categoriesname
      ? getRetailCatLandingRoutes(
          classifiedDetail.categoriesname.id,
          categoryName
        )
      : "";
    let subCategoryPagePath = classifiedDetail.categoriesname
      ? getRetailSubcategoryRoute(
          categoryName,
          classifiedDetail.categoriesname.id,
          subCategoryName,
          subCategoryId
        )
      : "";
    let mapPagePath = classifiedDetail.categoriesname
      ? getMapDetailRoute(
          TEMPLATE.GENERAL,
          categoryName,
          cat_id,
          subCategoryName,
          subCategoryId,
          classified_id
        )
      : "";
    const catName =
      classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname;
    let productImage = Array.isArray(classifiedDetail.classified_image)
      ? classifiedDetail.classified_image[0]
      : "";
    console.log("available_quantity", available_quantity);
    let avl_qty = available_quantity ? available_quantity : 10;
    let quantity = [];
    for (let i = 1; i < avl_qty; i++) {
      quantity.push({ key: i, value: i });
    }
    const menu = <SocialShare {...this.props} />;
    let contactNumber =
      classifiedDetail.contact_mobile && classifiedDetail.contact_mobile;
    let formatedNumber =
      contactNumber && contactNumber.replace(/\d(?=\d{4})/g, "*");
    console.log("group", groupAtt && groupAtt.length);

    let temp =
      postage_section &&
      postage_section.RateTypes &&
      Array.isArray(postage_section.RateTypes) &&
      postage_section.RateTypes.length
        ? postage_section.RateTypes[0].split(":")
        : "";
    let poatage_price =
      temp && Array.isArray(temp) && temp.length > 1 ? temp[1] : "";
    // const number = (
    //   <Menu>
    //     <Menu.Item key="0">
    //       <span className="phone-icon-circle">
    //         <Icon icon="call" size="14" />
    //       </span>
    //       <span>{isLoggedIn ? contactNumber : formatedNumber}</span>
    //       {isLoggedIn ? (
    //         <span className="blue-link ml-16 fs-16">
    //           <Tooltip
    //             placement="bottomRight"
    //             title={
    //               classifiedDetail.contact_mobile
    //                 ? classifiedDetail.contact_mobile
    //                 : "Number not found"
    //             }
    //           ></Tooltip>
    //         </span>
    //       ) : (
    //         <span
    //           className="blue-link ml-16 fs-16"
    //           onClick={() => this.props.openLoginModel()}
    //         >
    //           Show Number
    //         </span>
    //       )}
    //     </Menu.Item>
    //   </Menu>
    // );
    console.log("subCategoryId", subCategoryId);
    let totalAmount =
      classifiedDetail &&
      Number(classifiedDetail.price ? classifiedDetail.price : 0) -
        Number(classifiedDetail.discount ? classifiedDetail.discount : 0);
    let postage_details = classifiedDetail && classifiedDetail.classified_users;
    let trader_detail =
      postage_details && postage_details.trader_profile
        ? postage_details.trader_profile
        : "";
    let mid_level_cat =
      classifiedDetail && classifiedDetail.subcategoriesname
        ? classifiedDetail.subcategoriesname.name
        : "";
    let sizevisible =
      categoryName === "Women" ||
      categoryName === "Men" ||
      categoryName === "Children" ||
      mid_level_cat === "Babywear" ||
      mid_level_cat === "Sleep";
    return (
      <div className="retail-product-detail-parent-block">
        <Fragment>
          <Layout className="retail-theme common-left-right-padd">
            <Layout className="right-parent-block">
              <Layout>
                <Row>
                  {/* Left slick slider container:Start */}
                  <Col flex="370px">
                    <div className="category-name">
                      <Link to={categoryPagePath}>
                        <Button type="ghost" shape={"round"}>
                          <Icon
                            icon="arrow-left"
                            size="20"
                            className="arrow-left-icon"
                          />
                          {subCategoryName}
                        </Button>
                      </Link>
                    </div>
                    {product_image && (
                      <Carousel
                        className="mb-4"
                        classifiedDetail={classifiedDetail}
                        slides={product_image}
                      />
                    )}
                  </Col>
                  {/* Left slick slider container:End */}
                  {/* Right Product detail container: Start */}
                  <Col className="parent-right-block">
                    <div className="retail-product-detail-right">
                      <Row gutter={[0, 0]}>
                        {/* Product text-detail container: Start */}
                        <Col md={15}>
                          <div className="product-selector">
                            {classifiedDetail && classifiedDetail.title && (
                              <Title level={3} className="price dress-name">
                                {capitalizeFirstLetter(classifiedDetail.title)}
                              </Title>
                            )}
                            <br />
                            <div className="views-count">
                              <Icon icon="view" size="20" />{" "}
                              <Text>
                                {classifiedDetail.count}
                                <span> Views</span>
                              </Text>
                            </div>
                            <div className="selector-detail">
                              {sizevisible &&
                              groupAtt &&
                              groupAtt.length !== 0  && classifiedDetail.is_inventory_added ? (
                                this.renderInvAttSection()
                              ) : (
                                <div className="quantity-size-block custom-gray-select-list">
                                  <br />
                                  <div className="choose-quantity">
                                    <label for="select-quantity">
                                      Select Quantity
                                    </label>
                                    {/* <Select onChange={this.handleQuantityChange} style={{width:'60%'}}>
                                        {quantity && quantity.length && quantity.map((el,i) => {
                                          return <Option value={el.value}>{el.key}</Option>
                                        })}
                                      </Select> */}
                                    <div className="choose-quantity-input">
                                      <MinusOutlined
                                        onClick={() =>
                                          this.handleNumberChange("decrement")
                                        }
                                      />
                                      <Input
                                        placeholder="1"
                                        type="number"
                                        value={number}
                                        onChange={(e) =>
                                          this.handleQuantityChange(number)
                                        }
                                      />
                                      <PlusOutlined
                                        onClick={() =>
                                          this.handleNumberChange("increament")
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {sizevisible &&
                                groupAtt &&
                                groupAtt.length !== 0 && (
                                  <div className="view-size-giude">
                                    <div
                                      href="Javasript:void(0)"
                                      onClick={() =>
                                        this.setState({ sizeGuideModel: true })
                                      }
                                    >
                                      View Size Guide
                                    </div>
                                  </div>
                                )}
                              <div
                                className={
                                  isPostageOpen
                                    ? "toggle-open delivery-add-collapse"
                                    : `delivery-add-collapse`
                                }
                                onClick={() =>
                                  this.setState({
                                    isPostageOpen: !isPostageOpen,
                                  })
                                }
                              >
                                <DownOutlined />
                                <h4>Postage, Delivery and Return </h4>
                                {isPostageOpen && (
                                  <div className="add-collapse-wrapper">
                                    <div className="d-flex">
                                      <label>Postage:</label>
                                      <div className="collapse-inner-data">
                                        <p>
                                          <span className="bold">
                                            {poatage_price
                                              ? poatage_price
                                              : "Free"}
                                          </span>{" "}
                                          {postage_section &&
                                            postage_section.ServiceType}{" "}
                                          <a
                                            href="Javasript:void(0)"
                                            onClick={() =>
                                              this.activeTab("4", "1")
                                            }
                                          >
                                            See details
                                          </a>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="d-flex">
                                      <label>Delivery:</label>
                                      <div className="collapse-inner-data">
                                        <p>
                                          Estimated between{" "}
                                          <span className="bold">{`${
                                            postage_section.DeliveryDayOfWeek
                                              ? postage_section.DeliveryDayOfWeek
                                              : ""
                                          }  ${
                                            postage_section.DeliveryTimestamp
                                              ? moment(
                                                  postage_section.DeliveryTimestamp
                                                ).format("Do MMM")
                                              : ""
                                          }`}</span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="d-flex">
                                      <label>Return:</label>
                                      <div className="collapse-inner-data">
                                        <p>
                                          {trader_detail &&
                                            trader_detail.return_policy_title}
                                          <br />
                                          <a
                                            href="Javasript:void(0)"
                                            onClick={() =>
                                              this.activeTab("4", "2")
                                            }
                                          >
                                            See details
                                          </a>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {this.renderPaymentMethods(trader_detail, true)}
                            </div>
                          </div>
                        </Col>
                        {/* Product text-detail container: End */}
                        {/* Product button container: Start */}
                        <Col md={9}>
                          <div className="product-text-detail-container">
                            <div>
                              <div className="price-detail">
                                <div className="d-i-block">
                                  {classifiedDetail && (
                                    <Title level={2} className="price">
                                      {"AU$"}
                                      {salaryNumberFormate(
                                        parseInt(classifiedDetail.price)
                                      )}
                                    </Title>
                                  )}
                                  <br />
                                  <span>Select size and quantity</span>
                                </div>
                                <Dropdown
                                  overlay={menu}
                                  trigger={["click"]}
                                  overlayClassName="contact-social-detail share-ad"
                                  placement="bottomCenter"
                                  arrow
                                >
                                  <div
                                    className="ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <Icon icon="share" size="27" />
                                  </div>
                                </Dropdown>
                              </div>
                              {isButtonVisible && (
                                <div className="site-card-wrapper">
                                  <Row gutter={[20, 0]} className="action-btn">
                                    <Col>
                                      <Button
                                        className="purle-buttn"
                                        type="primary"
                                        onClick={this.bookProductModal}
                                      >
                                        {"Buy It Now"}
                                      </Button>
                                    </Col>
                                    <Col>
                                      <Button
                                        type="default"
                                        onClick={this.addToCart}
                                      >
                                        {"Add to Cart"}
                                      </Button>
                                    </Col>
                                    {/* <Col>
                                    <Button
                                      type="default"
                                      onClick={this.SaveForLater}
                                    >
                                      {"Save For Later"}
                                    </Button>
                                  </Col>   */}
                                    <Col>
                                      <Button className="grey-buttn">
                                        {classifiedDetail && (
                                          <Icon
                                            icon={
                                              is_favourite
                                                ? "wishlist-fill"
                                                : "wishlist"
                                            }
                                            size="20"
                                            className={
                                              is_favourite ? "active" : ""
                                            }
                                            onClick={() =>
                                              this.onSelection(
                                                classifiedDetail,
                                                classified_id
                                              )
                                            }
                                          />
                                        )}
                                        <span>Add to Wishlist</span>
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={24}>
                          <div className="product-detail-bottom">
                            <div className="d-flex reviews ">
                              <label>Reviews:</label>
                              <div className="product-ratting">
                                <Text>{rate ? rate : "No review yet"}</Text>
                                {rate && (
                                  <Rate
                                    disabled
                                    defaultValue={rate ? rate : "No review yet"}
                                  />
                                )}
                                <br />

                                <div className="retail-rating-container blue-link">
                                  {rate ? `${rate} ` : ""}
                                  {classifiedDetail.classified_hm_reviews &&
                                    classifiedDetail.classified_hm_reviews
                                      .length !== 0 && (
                                      <span
                                        className="blue-link"
                                        onClick={() => this.activeTab("3", "1")}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {classifiedDetail.classified_hm_reviews &&
                                          `${classifiedDetail.classified_hm_reviews.length}  reviews`}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex add-detail">
                              <label>Ad Details:</label>
                              <div>
                                {catName && (
                                  <Link to={subCategoryPagePath}>
                                    <Button
                                      type="ghost"
                                      shape={"round"}
                                      className={"light-gray"}
                                    >
                                      {subCategoryName}
                                    </Button>
                                  </Link>
                                )}

                                <div className="ad-num">
                                  <Paragraph className="text-gray mb-0">
                                    AD No. {classified_id}
                                  </Paragraph>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex report-add">
                              <label>
                                {classifiedDetail.subcategoriesname && (
                                  <p
                                    onClick={() => {
                                      if (classifiedDetail.is_reported === 1) {
                                        toastr.warning(
                                          langs.warning,
                                          MESSAGES.REPORT_ADD_WARNING
                                        );
                                      } else {
                                        if (isLoggedIn) {
                                          this.setState({
                                            reportAdModel: true,
                                          });
                                        } else {
                                          this.props.openLoginModel();
                                        }
                                      }
                                    }}
                                    className="blue-p"
                                  >
                                    <ExclamationCircleOutlined /> Report this Ad
                                  </p>
                                )}
                              </label>
                            </div>
                          </div>
                        </Col>
                        {/* Product button container: End */}
                      </Row>
                    </div>
                  </Col>
                  {/* Right Product detail container: End */}
                </Row>
              </Layout>
              <Layout>
                {/* New UI for product detail: End */}
                <Layout
                  style={{
                    width: "calc(100% - 0px)",
                    overflowX: "visible",
                    marginTop: "45px",
                  }}
                >
                  <div className="detail-page right-content-block">
                    <div ref={this.myDivToFocus} className="mb-30">
                      <Tabs
                        type="card"
                        className={"tab-style3 product-tabs"}
                        activeKey={activeTab}
                        onChange={this.onTabChange}
                      >
                        <TabPane tab="Product Details" key="1">
                          <div className="product-details-container">
                            <Row gutter={[20, 0]}>
                              <Col span={18}>
                                <h4 className="detail-head">Overview</h4>
                                <Paragraph>
                                  {classifiedDetail.description
                                    ? convertHTMLToText(
                                        classifiedDetail.description
                                      )
                                    : ""}
                                </Paragraph>
                                <Row className="pro-list">
                                  <Col span={24}>
                                    <Row gutter={[0, 0]}>
                                      {classifiedDetail.condition && (
                                        <Col span={6}>
                                          {" "}
                                          <label className="strong">
                                            Condition:
                                          </label>
                                        </Col>
                                      )}
                                      {classifiedDetail.condition && (
                                        <Col span={6}>
                                          {" "}
                                          <span>
                                            {classifiedDetail.condition}
                                          </span>
                                        </Col>
                                      )}
                                      {classifiedDetail.brand_name && (
                                        <Col span={6}>
                                          <label className="strong">
                                            Brand:
                                          </label>
                                        </Col>
                                      )}
                                      {classifiedDetail.brand_name && (
                                        <Col span={6}>
                                          <span>
                                            {classifiedDetail.brand_name}
                                          </span>
                                        </Col>
                                      )}
                                      <Col span={6}>
                                        {" "}
                                        <label className="strong">
                                          Department:
                                        </label>
                                      </Col>
                                      <Col span={6}>
                                        {" "}
                                        <span>{categoryName}</span>
                                      </Col>
                                      <Col span={6}>
                                        {" "}
                                        <label className="strong">
                                          Category:
                                        </label>
                                      </Col>
                                      <Col span={6}>
                                        {" "}
                                        <span>{subCategoryName}</span>
                                      </Col>
                                      {selectedColorName && inv_title1 && (
                                        <Col span={6}>
                                          <label className="strong">
                                            {inv_title1}:
                                          </label>
                                        </Col>
                                      )}
                                      {selectedColorName && (
                                        <Col span={6}>
                                          <span>{selectedColorName}</span>
                                        </Col>
                                      )}
                                      <Col span={6}>
                                        <label className="strong">Size:</label>
                                      </Col>
                                      <Col span={6}>
                                        <span>S M L </span>
                                      </Col>
                                      {classifiedDetail.has_dimension && (
                                        <Fragment>
                                          <Col span={6}>
                                            <label className="strong">
                                              Package Dimension (L*W*H):
                                            </label>
                                          </Col>
                                          <Col span={6}>
                                            <span>{`${classifiedDetail.length} x ${classifiedDetail.width} x ${classifiedDetail.height}`}</span>
                                          </Col>
                                        </Fragment>
                                      )}
                                      {classifiedDetail.has_weight && (
                                        <Fragment>
                                          <Col span={6}>
                                            {" "}
                                            <label className="strong">
                                              Package weight:
                                            </label>
                                          </Col>
                                          <Col span={6}>
                                            <span>{`${classifiedDetail.weight} ${classifiedDetail.weight_unit}`}</span>
                                          </Col>
                                        </Fragment>
                                      )}
                                    </Row>
                                  </Col>

                                  {allData &&
                                    allData.spicification &&
                                    this.renderSpecification(
                                      allData.spicification
                                    )}
                                </Row>
                              </Col>
                              <Col span={1}></Col>
                              <Col span={5}>
                                {similarAd && (
                                  <SimilarAdBlock
                                    listItem={similarAd}
                                    cat_id={cat_id}
                                    catName={catName}
                                  />
                                )}
                              </Col>
                            </Row>
                          </div>
                        </TabPane>
                        <TabPane
                          tab="Product Reviews"
                          key="3"
                          ref={this.formRef}
                        >
                          <Row className="reviews-content">
                            {classifiedDetail && (
                              <Review
                                classifiedDetail={classifiedDetail}
                                getDetails={this.getDetails}
                                retail={true}
                              />
                            )}
                          </Row>
                        </TabPane>
                        <TabPane tab="Postage And Payments" key="4">
                          <div className="postage-payment-acc-container">
                            <Row>
                              <Col span="24">
                                <Collapse
                                  activeKey={[activePanel]}
                                  onChange={(e) => {
                                    if (e[e.length - 1] == undefined) {
                                      this.setState({ activePanel: 1 });
                                    } else {
                                      this.setState({
                                        activePanel: e[e.length - 1],
                                      });
                                    }
                                  }}
                                >
                                  <Panel header="Postage" key="1">
                                    <div className="postage-inner-view">
                                      <Row>
                                        <Col span={4}>
                                          <label>Item location:</label>
                                        </Col>
                                        <Col span={20}>
                                          <span className="value">
                                            {postage_details &&
                                              postage_details.city}
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col span={4}>
                                          <label>Posting to:</label>
                                        </Col>
                                        <Col span={20}>
                                          <span className="value">
                                            {posting_to}
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col span={4}>
                                          <label>Exclusions:</label>
                                        </Col>
                                        <Col span={20}>
                                          <span className="value">
                                            {exclusion}
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col span="24">
                                          <div className="select-shipto">
                                            <label className="choose-country shipto">
                                              Ship to
                                            </label>
                                            <Select
                                              style={{ width: 150 }}
                                              placeholder="Select Country"
                                              allowClear
                                              showSearch
                                              onChange={
                                                this
                                                  .getFedexResponsebyCountryCode
                                              }
                                              optionFilterProp="children"
                                              filterOption={(input, option) =>
                                                option.children
                                                  .toLowerCase()
                                                  .indexOf(
                                                    input.toLowerCase()
                                                  ) >= 0
                                              }
                                              filterSort={(optionA, optionB) =>
                                                optionA.children
                                                  .toLowerCase()
                                                  .localeCompare(
                                                    optionB.children.toLowerCase()
                                                  )
                                              }
                                            >
                                              {postingCountryList &&
                                                postingCountryList.map((el) => {
                                                  return (
                                                    <Option value={el.isoCode}>
                                                      {el.name}
                                                    </Option>
                                                  );
                                                })}
                                            </Select>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col span={24}>
                                          <table>
                                            <tr className="heading-bg-light-grey">
                                              <th>Postage and handling</th>
                                              <th width="200">Carrier</th>
                                              <th width="200">Tracking</th>
                                              <th>Delivery</th>
                                            </tr>
                                            {this.renderPostageDelivery(
                                              postage_delivery
                                            )}
                                            <tr>
                                              <td>AU $7.98</td>
                                              <td>DHL</td>
                                              <td>Yes</td>
                                              <td>
                                                <span className="bold">
                                                  Estimated between Wed. 3 Feb -
                                                  Thu. 11 Feb
                                                </span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>AU $20.00</td>
                                              <td>FedEx</td>
                                              <td>Yes</td>
                                              <td>
                                                <span className="bold">
                                                  Estimated between Wed. 3 Feb -
                                                  Thu. 4 Feb
                                                </span>
                                              </td>
                                            </tr>
                                          </table>
                                          <span className="custom-br"></span>
                                        </Col>
                                      </Row>

                                      <p
                                        style={{
                                          color: "#363B40",
                                          fontFamily: "Arial",
                                          fontSize: "12px",
                                        }}
                                      >
                                        * Estimated delivery dates- opens in a
                                        new window or tab include seller's
                                        handling time, origin postcode,
                                        destination postcode and time of
                                        acceptance and will depend on postage
                                        service selected and receipt of cleared
                                        payment. Delivery times may vary,
                                        especially during peak periods.
                                      </p>
                                      <p
                                        className="pt-2"
                                        style={{
                                          color: "#363B40",
                                          fontFamily: "Arial",
                                          fontSize: "12px",
                                        }}
                                      >
                                        For Delivery to Pickup station, postage
                                        options may vary.
                                      </p>
                                      <h3 className="heading-bg-light-grey mt-25">
                                        Domestic handling time
                                      </h3>
                                      <p className="notes">
                                        Will usually post within 3 business days
                                        of receiving cleared payment.
                                      </p>
                                    </div>
                                  </Panel>
                                  <Panel
                                    header="Return Policy"
                                    key="2"
                                    className="return-policy-container"
                                  >
                                    <p
                                      style={{
                                        color: "#363B40",
                                        fontFamily: "Arial",
                                      }}
                                    >
                                      {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus sed cursus bibendum aenean faucibus a, ullamcorper. Tristique facilisi volutpat id lobortis adipiscing id tellus nunc. Interdum tempus, semper sed dui sed eget nunc, amet. Eros sed neque molestie pellentesque eros, vitae. Tristique facilisi volutpat id lobortis adipiscing id tellus nunc. Interdum tempus, semper sed dui sed eget nunc, amet. Eros sed neque molestie pellentesque eros, vitae. */}
                                      {trader_detail &&
                                        convertHTMLToText(
                                          trader_detail.return_policy
                                        )}
                                    </p>
                                    <span className="custom-br"></span>
                                    <p
                                      style={{
                                        color: "#363B40",
                                        fontFamily: "Arial",
                                      }}
                                    >
                                      Please follow our{" "}
                                      <a
                                        href={trader_detail.return_policy_file}
                                        target="_blank"
                                        style={{
                                          color: "#CA71B7",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        Return Policy
                                      </a>{" "}
                                      to receive a full refund.
                                    </p>
                                  </Panel>
                                  <Panel
                                    header="Accepted Payments"
                                    key="3"
                                    className="payment-method-container"
                                  >
                                    <h3 className="heading-bg-light-grey">
                                      Payment methods
                                    </h3>
                                    {this.renderPaymentMethods(
                                      trader_detail,
                                      false
                                    )}
                                    <p className="mt-0">
                                      <strong>Buy It Now, pay later.</strong>
                                    </p>
                                    <p>
                                      <strong>
                                        Afterpay allows you to pay for your eBay
                                        order over four interest-free payments.
                                      </strong>
                                      <span>
                                        If you don't already have an Afterpay
                                        account, you'll be prompted to create
                                        one when you select Afterpay at
                                        checkout. You'll see full details of
                                        your payment
                                        <br /> plan before completing your
                                        purchase.
                                      </span>
                                    </p>
                                    <p>
                                      Subject to purchase eligibility and
                                      Afterpay approval. Afterpay may apply
                                      interest or other fees if instalments are
                                      not paid on time. See{" "}
                                      <a
                                        href="https://www.afterpaytouch.com/"
                                        target="_blank"
                                        style={{
                                          color: "#CA71B7",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        Afterpay terms
                                      </a>
                                    </p>
                                    <p>
                                      Learn more about{" "}
                                      <a
                                        href="https://www.afterpaytouch.com/"
                                        target="_blank"
                                        style={{
                                          color: "#CA71B7",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        Afterpay
                                      </a>
                                    </p>
                                  </Panel>
                                </Collapse>
                              </Col>
                            </Row>
                          </div>
                        </TabPane>
                        <TabPane tab="Seller Information" key="5">
                          {classifiedDetail && (
                            <SellerInformation
                              classifiedDetail={classifiedDetail}
                              getDetails={this.getDetails}
                              cat_id={cat_id}
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </Layout>
              </Layout>
            </Layout>
          </Layout>
          {bookProduct && (
            <BookProduct
              visible={bookProduct}
              onCancel={this.handleCancel}
              classifiedDetail={classifiedDetail && classifiedDetail}
              receiverId={
                classifiedDetail.classified_users
                  ? classifiedDetail.classified_users.id
                  : ""
              }
              classifiedid={classifiedDetail && classifiedDetail.id}
              history={history}
              quantity={selectedQuantity}
              addToCarProps={this.addToCart}
            />
          )}
          {sizeGuideModel && (
            <ViewSizeGuide
              visible={sizeGuideModel}
              onCancel={() => this.setState({ sizeGuideModel: false })}
              size_guide_image={trader_detail && trader_detail.size_guide_image}
            />
          )}
          {reportAdModel && (
            <ReportAd
              visible={reportAdModel}
              onCancel={() => this.setState({ reportAdModel: false })}
              classifiedDetail={classifiedDetail}
              is_retail={true}
            />
          )}
          <Modal
            visible={this.state.visible}
            footer={false}
            onCancel={() => this.setState({ visible: false })}
            className="add-to-cart-model"
          >
            <h2>1 item added to cart</h2>
            <div className="added-item-container">
              <div className="added-product-img">
                <img
                  src={
                    productImage ? productImage.full_name : DEFAULT_IMAGE_CARD
                  }
                  alt="Your Added Product"
                />
              </div>
              <div className="added-product-detail">
                <p>{classifiedDetail.title}</p>
                <span>
                  {label_1 && `${label_1}:`}{" "}
                  <sapn className="value">{selectedColorName}</sapn>
                </span>
                <span>
                  {label_2 && `${label_2}:`}
                  <sapn className="value">
                    {selectedSize ? selectedSize : "Medium"}
                  </sapn>
                </span>
              </div>
              <div className="prize">
                <h5>{`AU$${salaryNumberFormate(classifiedDetail.price)}`}</h5>
              </div>
            </div>
            <div className="model-footer">
              <div className="redirect-shop-page">
                <a
                  href="javascript:void(0)"
                  onClick={() => this.setState({ visible: false })}
                >
                  Continue Shopping
                </a>
              </div>
              <div className="redirect-shop-page">
                <Link to={"/cart"} className="text-black">
                  Go to cart
                </Link>
              </div>
            </div>
          </Modal>
        </Fragment>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, classifieds, profile, common } = store;
  const { location } = common;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedclassifiedDetail: classifieds.classifiedsList,
    userDetails: profile.userProfile !== null ? profile.userProfile : "",
    lat: location ? location.lat : "",
    long: location ? location.long : "",
  };
};

export default connect(mapStateToProps, {
  addToCartAPI,
  getRetailCategoryDetail,
  addToWishList,
  removeToWishList,
  openLoginModel,
  enableLoading,
  disableLoading,
  removeToRetailWishlist,
  addToRetailWishList,
  fedexAPI,
})(DetailPage);
