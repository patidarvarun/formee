import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import ImgCrop from "antd-img-crop";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import { toastr } from "react-redux-toastr";
import "react-quill/dist/quill.snow.css";
import { langs } from "../../config/localization";
import { MESSAGES } from "../../config/Message";
import {
  Empty,
  Card,
  Modal,
  InputNumber,
  Select,
  Typography,
  Row,
  Col,
  message,
  Upload,
  Form,
  Checkbox,
  Radio,
  Tabs,
  Button,
  Collapse,
  Input,
} from "antd";
import Icon from "../customIcons/customIcons";
import "../auth/registration/style.less";
import { renderField } from "../forminput";
import {
  required,
  validMobile,
  validNumber,
} from "../../config/FormValidation";
import { getAddress, converInUpperCase } from "../common";
import {
  uploadRetailProductImage,
  enableLoading,
  disableLoading,
  getRetailCategoryDetail,
} from "../../actions";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  deleteUploadedImagesOfPostAD,
  getGSTPercentage,
  getAllBrandsAPI,
  deleteInspectionAPI,
  updateRetailClassified,
  getChildInput,
  getClassifiedDynamicInput,
  setAdPostData,
  getRetailPostAdDetail,
} from "../../actions";
import { QUESTION_TYPES } from "../../config/Config";
import PlacesAutocomplete from "../common/LocationInput";
import ImagePreview from "./ImagePreviewModel";
import RetailPreview from "./RetailPreview";
import RetailSuccessModel from "./SuccessModel";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;
const rules = [required("")];
const uploadButton = (
  <div>
    <PlusOutlined />
    <div className="ant-upload-text">Upload</div>
    <img
      src={require("../../assets/images/icons/upload-small.svg")}
      alt="upload"
    />
  </div>
);

class Step3 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      attribute: [],
      label: false,
      otherAttribute: [],
      specification: "",
      fileList: [],
      Question1: false,
      Question2: false,
      Question3: false,
      questions: [],
      textInputs: [
        {
          question: ``,
          ans_type: QUESTION_TYPES.TEXT,
          options: [],
          ansInputs: [],
        },
      ],
      // ansInputs: []
      inv_attributes: [],
      initial: false,
      address: "",
      adPostDetail: "",
      byAppointment: false,
      weekly: false,
      singleDate: false,
      data: "",
      specification: "",
      inspectionPreview: [],
      classifiedDetail: "",
      jobModal: false,
      paymentScreen: false,
      formData: "",
      brandList: [],
      shipping: [],
      percentageAmount: "",
      shipmentVisible: false,
      comissionAmount: "",
      gstAmount: "",
      group_attribute: [],
      groupImage: [],
      uploadedUrl: "",
      inv_att: [],
      brandVisible: false,
      weightVisible: false,
      dimentionVisible: false,
      inv_default_value: [
        {
          index: 0,
          quantity: 0,
          image: "",
          children: [{ index: 0 }],
        },
      ],
      editorState: BraftEditor.createEditorState(""),
      dynamicInventory: false,
      quantityBlock: false,
      selected_attribute: [],
      inv_table_visible: false,
      previewVisible: false,
      is_inventory_edit: false,
      imagePreviewModel: false,
      selectedIndex: 0,
      formListObj: "",
      selected_group: false,
      success_model: false,
      allGroup: "",
      selected_value: "",
      initial_attribute: "",
      group_id: "",
      is_more_detail: true,
      is_inventory_added: false,
      all_attribute: [],
    };
  }

  /**
   * @method componentWillMount
   * @description called after render the component
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getRetailPostAdDetails();
  }

  /**
   * @method getRetailPostAdDetails
   * @description get retail post an ad detail
   */
  getRetailPostAdDetails = () => {
    const { loggedInUser, userDetails } = this.props;
    let catId = this.props.match.params.adId;

    this.props.getGSTPercentage((res) => {
      if (res.status === 200) {
        let data = res.data && res.data.data;
        this.setState({ percentageAmount: data });
      }
    });
    let reqData = {
      id: catId,
      user_id: loggedInUser.id,
    };
    this.props.getRetailPostAdDetail(reqData, (res) => {
      this.props.disableLoading();

      if (res.status === 200) {
        let data = res.data.data;
        let category_id = data.category_id;
        this.getBrandsList(category_id);
        const atr =
          data &&
          Array.isArray(data.classified_attribute) &&
          data.classified_attribute.length
            ? data.classified_attribute
            : [];
        const mandate = atr.filter((el) => el.validation === 1);
        const optional = atr.filter((el) => el.validation === 0);
        let allAtt = [...mandate, ...optional];
        let temp = [];
        let group_attribute = data && data.inv_attribute_group_new;
        let allGroup =
          data &&
          data.inv_attribute_group &&
          Array.isArray(data.inv_attribute_group) &&
          data.inv_attribute_group.length
            ? data.inv_attribute_group
            : [];
        let inv_att =
          group_attribute && Array.isArray(group_attribute.inv_attributes)
            ? group_attribute.inv_attributes
            : [];
        this.setState({
          group_attribute: group_attribute,
          inv_att: inv_att,
          allGroup: allGroup,
          all_attribute: atr,
        });
        this.getDefaultINVAttribute(allAtt);
        this.getInitialvalueofGroupAtt(group_attribute, inv_att);
        this.getAllInitialValue(data, mandate, optional);
        this.getClassifiedDetails(catId);
      }
    });
  };

  /**
   * @method getInitialvalueofGroupAtt
   * @description get initial value of group attributes
   */
  getInitialvalueofGroupAtt = (group_attribute, inv_att) => {
    if (inv_att && inv_att.length) {
      let first = [],
        second = [];
      first = inv_att[0] ? inv_att[0] : "";
      second =
        inv_att[0] && inv_att[0].children && inv_att[0].children.length
          ? inv_att[0].children[0]
          : "";
      let additional = second ? { is_parent: 1 } : { is_parent: 0 };
      let combine_data1 = first ? this.addElement(first, additional) : "";
      let combine_data2 = second
        ? this.addElement(second, { is_parent: 0 })
        : "";
      let initial =
        combine_data1 && combine_data2
          ? [combine_data1, combine_data2]
          : [combine_data1];
      let selected = second
        ? [first.display_name, second.display_name]
        : [first.display_name];
      this.setState({
        inv_default_value: inv_att,
        initial: true,
        initial_attribute: initial,
        inv_table_visible: true,
        dynamicInventory: false,
        selected_value: selected,
        group_id: group_attribute ? group_attribute.id : "",
        selected_group: group_attribute && group_attribute.id ? true : false,
      });
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          group_inventory_attribute: inv_att,
          group: group_attribute ? group_attribute.id : "",
        });
      inv_att.map((el, i) => {
        let predefinedImages = [];
        if (el.images.length) {
          el.images.map((el2, index) => {
            predefinedImages.push({
              uid: `${el2.id}`,
              name: "image.png",
              status: "done",
              isPrevious: true,
              url: `${el2.full_image_url}`,
              type: "image/jpeg",
              size: "1024",
              image_url: `${el2.image_url}`,
            });
          });
          let currentField =
            this.formRef.current && this.formRef.current.getFieldsValue();
          if (currentField.group_inventory_attribute) {
            currentField.group_inventory_attribute[i].image = [
              ...predefinedImages,
            ];
            this.formRef.current &&
              this.formRef.current.setFieldsValue({
                ...currentField,
              });
            this.setState({ currentField2: currentField });
          }
        }
      });
    }
  };

  /**
   * @method getClassifiedDetails
   * @description get retail classifieds details
   */
  getClassifiedDetails = (catId) => {
    const { isLoggedIn, loggedInUser } = this.props;
    let reqData = {
      id: catId,
      user_id: isLoggedIn ? loggedInUser.id : "",
    };
    this.props.getRetailCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ classifiedDetail: res.data });
      }
    });
  };

  /**
   * @method getBrandsList
   * @description render dynamic input
   */
  getBrandsList = (id) => {
    let reqData = {
      category_id: id,
    };
    this.props.getAllBrandsAPI(reqData, (res) => {
      if (res.status === 200) {
        let data = res.data && res.data.data;

        this.setState({ brandList: data });
      }
    });
  };

  /**
   * @method getAllInitialValue
   * @description get all initial values
   */
  getAllInitialValue = (data, mandate, optional) => {
    let predefinedImages = [];
    data.classified_image &&
      data.classified_image.map((el, index) => {
        if(index < 5){
          predefinedImages.push({
            uid: `${el.id}`,
            name: "image.png",
            status: "done",
            isPrevious: true,
            url: `${el.image_url}`,
            type: "image/jpeg",
            size: "1024",
          });
        }
      });
    const {
      contact_name,
      contact_email,
      title,
      fname,
      laname,
      product_price,
      price,
      description,
      contact_mobile,
      category_name,
      subcategory_name,
      sub_sub_category_name,
      hide_mob_number,
      location,
      brand,
      other_notes,
      features,
      condition,
      brand_name,
      commission_amount,
      gst_amount,
      shipping,
      ship_name_1,
      ship_name_2,
      ship_name_3,
      ship_amount_1,
      ship_amount_2,
      ship_amount_3,
      delivery_time_1,
      delivery_time_2,
      delivery_time_3,
      has_weight,
      has_dimension,
      length,
      quantity,
      width,
      height,
      weight,
      length_unit,
      weight_unit,
      returns_accepted,
      exclude_out_of_stock,
      is_inventory_added,
    } = data;

    let final_price =
      Number(commission_amount ? commission_amount : 0) +
      Number(gst_amount ? gst_amount : 0) +
      Number(price ? price : 0);
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        fname: fname ? converInUpperCase(fname) : "",
        lname: laname ? converInUpperCase(laname) : "",
        contact_email,
        title: title,
        description: BraftEditor.createEditorState(description),
        quantity,
        brand: brand,
        price: product_price ? parseInt(product_price) : "",
        final_price: parseInt(price),
        other_notes: other_notes,
        features: features,
        brand_name: brand_name,
        parent_categoryid: category_name,
        category_id: sub_sub_category_name
          ? sub_sub_category_name
          : subcategory_name,
        condition: condition,
        shipment: String(shipping),
        contact_mobile:
          contact_mobile && contact_mobile !== "N/A" ? contact_mobile : "",
        hide_mob_number: hide_mob_number ? hide_mob_number : false,
        address: location,
        inspection_type: data.inspection_type,
        ship_name_1: ship_name_1,
        ship_amount_1: ship_amount_1,
        ship_name_2: ship_name_2,
        ship_amount_2: ship_amount_2,
        ship_name_3: ship_name_3,
        ship_amount_3: ship_amount_3,
        delivery_time_1: delivery_time_1,
        delivery_time_2: delivery_time_2,
        delivery_time_3: delivery_time_3,
        has_weight,
        has_dimension,
        length,
        width,
        height,
        weight,
        length_unit: String(length_unit),
        weight_unit: String(weight_unit),
        returns_accepted: returns_accepted ? returns_accepted : false,
        exclude_out_of_stock: exclude_out_of_stock
          ? exclude_out_of_stock
          : false,
        is_inventory_added: is_inventory_added,
      });

    this.setState({
      adPostDetail: data,
      address: data.location,
      attribute: mandate,
      otherAttribute: optional,
      fileList: is_inventory_added === 1 ? [] : predefinedImages,
      shipmentVisible: String(shipping) === "1" ? true : false,
      brandVisible: brand === "Brand" ? true : false,
      weightVisible: String(has_weight) === "1" ? true : false,
      dimentionVisible: String(has_dimension) === "1" ? true : false,
      inv_table_visible: is_inventory_added === 1 ? true : false,
      is_inventory_added: is_inventory_added ? true : false,
      quantityBlock: is_inventory_added === 0 ? true : false,
      category_name: category_name,
      subcategory_name: sub_sub_category_name
        ? sub_sub_category_name
        : subcategory_name,
    });
  };

  /**
   * @method getDefaultINVAttribute
   * @description get default inv attributes
   */
  getDefaultINVAttribute = (allAtt) => {
    if (allAtt && allAtt.length) {
      allAtt.map((el) => {
        if (el.attr_type_name === "calendar") {
          let d = new Date(el.selectedvalue);
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: moment(d),
            });
        } else if (el.attr_type_name === "Drop-Down") {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: Number(el.selectedvalue),
            });
        } else if (el.attr_type_name === "Radio-button") {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: Number(el.selectedvalue),
            });
        } else if (el.attr_type_name === "Multi-Select") {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: el.selectedvalue
                ? el.selectedvalue.split(",")
                : "",
            });
        } else {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: el.selectedvalue,
            });
        }
      });
    }
  };

  /**
   * @method renderItem
   * @description render dynamic input
   */
  renderItem = (attribute) => {
    if (attribute && attribute.length) {
      let sorted_list =
        attribute &&
        attribute.sort((a, b) => {
          if (a.position < b.position) return -1;
          if (a.position > b.position) return 1;
          return 0;
        });
      return sorted_list.map((data, i) => {
        let last_index = sorted_list.length - 1;
        let division = i === last_index && last_index % 2 === 0 ? 24 : 12;
        return (
          <>
            {i % 2 == 0 ? (
              <Col
                xs={division}
                sm={division}
                md={division}
                lg={division}
                xl={division}
              >
                <div key={i}>
                  {renderField(data, data.attr_type_name, data.value)}
                </div>
              </Col>
            ) : (
              <Col
                xs={division}
                sm={division}
                md={division}
                lg={division}
                xl={division}
              >
                <div key={i}>
                  {renderField(data, data.attr_type_name, data.value)}
                </div>
              </Col>
            )}
          </>
        );
      });
    }
  };

  /**
   * @method onFinish
   * @description handle submit form
   */
  onFinish = (value) => {
    this.getAttributes(value);
  };

   /**
   * @method handlePrice
   * @description handle price change
   */
  handlePrice = ({ target: { value } }) => {
    let price = value.replace('AU$','').replace(/[^a-zA-Z 0-9]+/g,'');
    const { percentageAmount } = this.state;
    let actual_price = Number(price)
    if (percentageAmount) {
      let gstAmount = (actual_price * percentageAmount.GST_percentage) / 100;
      let comissionAmount =
        (actual_price * percentageAmount.Formee_commission_percentage) / 100;
      let total = gstAmount + comissionAmount + actual_price;
      this.setState({ gstAmount: gstAmount, comissionAmount: comissionAmount });

      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          final_price: parseInt(total),
        });
    }
  };

  /**
   * @method handleImageUpload
   * @description handle image upload change
   */
  handleImageUpload = (fileList) => {
    const { group_attribute, initial_attribute } = this.state;
    let imageURL = [];
    if (fileList && fileList.length) {
      let att_id =
        initial_attribute && initial_attribute.length
          ? initial_attribute[0].id
          : "";
      let reqData = {
        group_id: group_attribute && group_attribute.id,
        inv_attribute_id: att_id,
        image: fileList,
      };
      let formData = new FormData();
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].originFileObj) {
          formData.append("image[]", fileList[i].originFileObj);
        }
      }
      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key]);
      });
      return new Promise((resolve, reject) => {
        this.props.uploadRetailProductImage(formData, (res) => {
          if (res.status === 200) {
            imageURL = res.data.data;
            resolve(imageURL);
          } else {
            resolve(imageURL);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(imageURL);
      });
    }
  };

  /**
   * @method getAttributes
   * @description formate attributes value
   */
  getAttributes = async (value) => {
    const {
      initial_attribute,
      group_id,
      gstAmount,
      comissionAmount,
      percentageAmount,
      data,
      attribute,
      otherAttribute,
      fileList,
      textInputs,
      hide_mob_number,
      adPostDetail,
    } = this.state;
    const { loggedInUser } = this.props;
    let temp = {},
      specification = [],
      price = "",
      groupAtt = {};
    let temp2 = [];
    let allDynamicAttribute = [...otherAttribute, ...attribute];
    Object.keys(value).filter(function (key, index) {
      if (value[key] !== undefined) {
        allDynamicAttribute.map((el, index) => {
          if (el.att_name === key) {
            let att = allDynamicAttribute[index];
            if (el.att_name === "Price") {
              price = value[key];
            }
            let dropDropwnValue, checkedValue;
            if (att.attr_type_name === "Radio-button") {
              let selectedValueIndex = att.value.findIndex(
                (el) => el.id === value[key] || el.name === value[key]
              );
              checkedValue = att.value[selectedValueIndex];
            }
            if (att.attr_type_name === "Drop-Down") {
              let selectedValueIndex = att.value.findIndex(
                (el) => el.id === value[key] || el.name === value[key]
              );
              dropDropwnValue = att.value[selectedValueIndex];
            }
            temp[att.att_id] = {
              attr_type_id: att.attr_type,
              attr_value:
                att.attr_type_name === "Drop-Down"
                  ? dropDropwnValue.id
                  : att.attr_type_name === "calendar"
                  ? moment(value[key]).format("YYYY")
                  : att.attr_type_name === "Date"
                  ? moment(value[key]).format("MMMM Do YYYY, h:mm:ss a")
                  : att.attr_type_name === "Radio-button"
                  ? checkedValue.id
                  : value[key],
              parent_value_id: 0,
              parent_attribute_id:
                att.attr_type_name === "Drop-Down" ? att.att_id : 0,
              attr_type_name: att.attr_type_name,
            };

            specification.push({
              key: att.att_name,
              value:
                att.attr_type_name === "Drop-Down"
                  ? dropDropwnValue.name
                  : att.attr_type_name === "calendar"
                  ? moment(value[key]).format("YYYY")
                  : att.attr_type_name === "Date"
                  ? moment(value[key]).format("MMMM Do YYYY, h:mm:ss a")
                  : att.attr_type_name === "Radio-button"
                  ? checkedValue.name
                  : value[key],
            });
            temp2.push({
              key: att.att_name,
              type: att.attr_type_name,
              value:
                att.attr_type_name === "Drop-Down"
                  ? dropDropwnValue.name
                  : att.attr_type_name === "calendar"
                  ? value[key]
                  : att.attr_type_name === "Date"
                  ? value[key]
                  : value[key],
            });
          }
        });
      }
    });

    let groupAttr = value.group_inventory_attribute,
      inv_attributes = [],
      final_product_images = [],
      groupAttData = {},
      total_quantity = 0;

    if (groupAttr && groupAttr.length) {
      let inv_attribute_id = groupAttr[0].inv_attribute_id;
      let first =
        initial_attribute &&
        initial_attribute.filter((el) => el.is_parent === 1);
      let second =
        initial_attribute &&
        initial_attribute.filter((el) => el.is_parent === 0);
      let parent_id = first && first.length ? first[0].id : "";
      let child_id = second && second.length ? second[0].id : "";

      let alldata = await Promise.all(
        groupAttr.map(async (el, i) => {
          let child_quantity = 0,
            children = [],
            child_inv_attribute_id = "",
            promises = [],
            product_images = [],
            previous_image_array = [],
            merged_images = [];
          let current_image =
            el.image && el.image.filter((el) => el.isPrevious === undefined);
          let previous_image =
            el.image && el.image.filter((el) => el.isPrevious === true);
          previous_image &&
            previous_image.length &&
            previous_image.map((img) => {
              previous_image_array.push({
                group_id: group_id,
                image_url: img.image_url,
              });
            });
          let image_promise = await this.handleImageUpload(current_image);
          promises.push(image_promise);
          let uploaded_images = promises && promises.length ? promises[0] : [];
          merged_images = [...previous_image_array, ...uploaded_images];
          product_images.push(current_image);
          console.log("product_images", product_images);
          product_images.length &&
            product_images[0] &&
            product_images[0].map((el) => {
              el.originFileObj && final_product_images.push(el.originFileObj);
            });
          if (
            el.children &&
            el.children.length &&
            initial_attribute &&
            initial_attribute.length > 1
          ) {
            child_inv_attribute_id = el.children[0].inv_attribute_id;
            el.children &&
              el.children.length &&
              el.children.map((el2, i) => {
                children.push({
                  inv_attribute_id: child_inv_attribute_id
                    ? child_inv_attribute_id
                    : child_id,
                  inv_attribute_value: el2.inv_attribute_value,
                  quantity: el2.quantity,
                });
                child_quantity = Number(child_quantity) + Number(el2.quantity);
              });
            inv_attributes.push({
              inv_attribute_id: inv_attribute_id ? inv_attribute_id : parent_id,
              inv_attribute_value: el.inv_attribute_value,
              quantity: el.quantity,
              images: merged_images,
              children,
            });
            total_quantity = Number(total_quantity) + Number(child_quantity);
          } else {
            inv_attributes.push({
              inv_attribute_id: inv_attribute_id ? inv_attribute_id : parent_id,
              inv_attribute_value: el.inv_attribute_value,
              quantity: el.quantity,
              images: merged_images,
              children: [],
            });
            total_quantity = Number(total_quantity) + Number(el.quantity);
          }
          return inv_attributes;
        })
      );
      groupAttData = {
        group_id: group_id,
        inv_attributes: alldata && alldata.length && alldata[0],
      };
    }
    let imagetemp = [];
    let product_quantity = value.is_inventory_added
      ? total_quantity
      : value.quantity
      ? value.quantity
      : adPostDetail.quantity;
    const { adId } = this.props.match.params;
    fileList &&
      Array.isArray(fileList) &&
      fileList.filter((el) => {
        el.originFileObj && imagetemp.push(el.originFileObj);
      });
    console.log("final_product_images", final_product_images);
    const reqData = {
      id: adId,
      user_id: loggedInUser.id,
      parent_categoryid: adPostDetail.parent_categoryid,
      category_id: adPostDetail.category_id,
      child_category_id: adPostDetail.child_category_id,
      attributes: temp,
      inv_attribute_groups: value.is_inventory_added ? groupAttData : {},
      price: value.price ? value.price : adPostDetail.product_price,
      contact_email: adPostDetail.contact_email,
      contact_name: adPostDetail.contact_name
        ? adPostDetail.contact_name
        : value.fname + "" + value.lname,
      contact_mobile: adPostDetail.contact_mobile
        ? adPostDetail.contact_mobile
        : value.contact_mobile,
      hide_mob_number: hide_mob_number ? 1 : 0,
      description: value.description.toHTML(),
      title: value.title,
      lng:
        data && data.lng
          ? data.lng
          : adPostDetail.lng
          ? adPostDetail.lng
          : 151.2092955,
      lat:
        data && data.lat
          ? data.lat
          : adPostDetail.lat
          ? adPostDetail.lat
          : -33.8688197,
      state_id:
        data && data.state_id
          ? data.state_id
          : adPostDetail.state_id
          ? adPostDetail.state_id
          : "",
      subregions_id:
        data && data.subregions_id
          ? data.subregions_id
          : adPostDetail.subregions_id
          ? adPostDetail.subregions_id
          : "",
      location:
        data && data.address
          ? data.address
          : adPostDetail.location
          ? adPostDetail.location
          : "",
      quantity: product_quantity,
      total_quantity: product_quantity,
      ["image[]"]: final_product_images.length
        ? final_product_images
        : imagetemp,

      brand_name: value.brand_name ? value.brand_name : adPostDetail.brand_name,
      other_notes: value.other_notes
        ? value.other_notes
        : adPostDetail.other_notes,
      features: value.features ? value.features : adPostDetail.features,
      condition: value.condition ? value.condition : adPostDetail.condition,
      brand: value.brand ? value.brand : adPostDetail.brand,
      shipping: value.shipment ? value.shipment : adPostDetail.shipping,

      GST_tax_percent:
        percentageAmount && percentageAmount.GST_percentage
          ? percentageAmount.GST_percentage
          : adPostDetail.gst_percent,
      formee_commision_tax_amount: comissionAmount
        ? comissionAmount
        : adPostDetail.commission_amount,
      GST_tax_amount: gstAmount ? gstAmount : adPostDetail.gst_amount,
      formee_commision_tax_percent:
        percentageAmount && percentageAmount.Formee_commission_percentage
          ? percentageAmount.Formee_commission_percentage
          : adPostDetail.commission_percent,

      ship_name_1: value.ship_name_1
        ? value.ship_name_1
        : adPostDetail.ship_name_1,
      ship_amount_1: value.ship_amount_1
        ? value.ship_amount_1
        : adPostDetail.ship_amount_1,
      ship_name_2: value.ship_name_2
        ? value.ship_name_2
        : adPostDetail.ship_name_2,
      ship_amount_2: value.ship_amount_2
        ? value.ship_amount_2
        : adPostDetail.ship_amount_2,
      ship_name_3: value.ship_name_3
        ? value.ship_name_3
        : adPostDetail.ship_name_3,
      ship_amount_3: value.ship_amount_3
        ? value.ship_amount_3
        : adPostDetail.ship_amount_3,
      delivery_time_1: value.delivery_time_1
        ? value.delivery_time_1
        : adPostDetail.delivery_time_1,
      delivery_time_2: value.delivery_time_2
        ? value.delivery_time_2
        : adPostDetail.delivery_time_2,
      delivery_time_3: value.delivery_time_3
        ? value.delivery_time_3
        : adPostDetail.delivery_time_3,
      has_weight: value.has_weight ? value.has_weight : adPostDetail.has_weight,
      weight_unit: value.weight_unit
        ? value.weight_unit
        : adPostDetail.weight_unit,
      weight: value.weight ? value.weight : adPostDetail.weight,
      width: adPostDetail.width,
      has_dimension: value.has_dimension
        ? value.has_dimension
        : adPostDetail.has_dimension,
      length_unit: value.length_unit
        ? value.length_unit
        : adPostDetail.length_unit,
      length: value.length ? value.length : adPostDetail.length,
      width: value.width ? value.width : adPostDetail.width,
      height: value.height ? value.height : adPostDetail.height,
      is_premium_sub_cat: 0,
      is_premium_parent_cat: 0,
      pay_pal: "on",
      price_type: "amount",
      returns_accepted: value.returns_accepted,
      exclude_out_of_stock: value.exclude_out_of_stock,
      is_inventory_added: value.is_inventory_added,
    };
    let images_array = final_product_images.length
      ? final_product_images
      : imagetemp;
    const formData = new FormData();
    for (var i = 0; i < images_array.length; i++) {
      formData.append("image[]", images_array[i]);
    }
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == "object" && key !== "image[]") {
        formData.append(key, JSON.stringify(reqData[key]));
      } else {
        formData.append(key, reqData[key]);
      }
    });
    this.setState({ specification: specification, inspectionPreview: "" });
    this.props.enableLoading();
    this.props.updateRetailClassified(formData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success("success", "Your post has been updated successfully");
        this.getRetailPostAdDetails();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        this.props.history.push('/my-ads')
      }
    });
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
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
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field
   */
  handleAddress = (result, address, latLng) => {
    let state = "";
    let city = "";
    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_1") {
        state = el.long_name;
      } else if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
      }
    });
    this.formRef.current.setFieldsValue({
      address: address,
    });
    this.changeAddress(address, latLng, state, city);
  };

  /**
   * @method changeAddress
   * @description Split out Address city post code
   */
  changeAddress = (add, latLng, state, city) => {
    const { hide_mob_number, mobileNo } = this.state;
    let address = {
      location: add,
      lat: latLng.lat,
      lng: latLng.lng,
      state_id: state,
      subregions_id: city,
    };
    this.setState({ data: address, address: add });
  };

  /**
   * @method renderBrandList
   * @description render branbds list options
   */
  renderBrandList = (brand) => {
    if (brand.length !== 0) {
      return brand.map((el, i) => {
        return (
          <Option key={i} value={el.name}>
            {el.name}
          </Option>
        );
      });
    }
  };

  /**
   * @method renderDynamicAttOption
   * @description render dynamic attribute option
   */
  renderDynamicAttOption = (value) => {
    if (value && value.length !== 0) {
      return value.map((el, i) => {
        return (
          <Option key={i} value={el.value}>
            {el.value}
          </Option>
        );
      });
    }
  };

  handleProductImageChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG  & PNG file!");
      return false;
    } else if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    } else {
      this.setState({ fileList });
    }
  };

  /**
   * @method removeProductImages
   * @description remove product image
   */
  removeProductImages = (item) => {
    console.log("item", item);
    if (item && item.isPrevious) {
      this.props.deleteUploadedImagesOfPostAD({ id: item.uid }, (res) => {});
    }
  };

  /**
   * @method renderQuantitySelectionBox
   * @description render product item quantity selection block
   */
  renderQuantitySelectionBox = () => {
    const { fileList } = this.state;
    const uploadButton = (
      <div>
        <img
          src={require("../../assets/images/icons/plus_circle-orange.svg")}
          alt="Add"
        />
        {fileList.length === 0 && (
          <div style={{ fontSize: "9px", paddingTop: "5px", color: "#55636D" }}>
            Add upto 5 images
          </div>
        )}
      </div>
    );
    return (
      <table className={"inventory-table"}>
        <thead>
          <tr>
            <th className={"table-heading"}>Quantity</th>
            <th className={"table-heading"}>Pictures</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={"table-cell"}>
              <Form.Item name="quantity" rules={[{ validator: validNumber }]}>
                <InputNumber min={1} />
              </Form.Item>
            </td>
            <td className={"table-cell"}>
              <Row gutter={0}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <div
                    className={
                      fileList.length
                        ? "file-uploader itemList-box"
                        : "file-uploader"
                    }
                  >
                    <ImgCrop>
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={true}
                        fileList={fileList}
                        onRemove={(e) => this.removeProductImages(e)}
                        customRequest={this.dummyRequest}
                        onChange={this.handleProductImageChange}
                      >
                        {fileList.length >= 5 ? null : uploadButton}
                      </Upload>
                    </ImgCrop>
                  </div>
                </Col>
              </Row>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  /**
   * @method handleAttributeSubmit
   * @description handle attribute submit
   */
  handleAttributeSubmit = (isgroup, item) => {
    const { initial_attribute } = this.state;
    if (isgroup) {
      if (item && item.length) {
        if (item.length > 2) {
          toastr.warning(
            "Inventory creation will applicable  for only two attribute"
          );
        } else {
          let is_parent =
            initial_attribute &&
            initial_attribute.some((e) => e.is_parent === 1);
          console.log(item, "is_parent", is_parent);
          if (item.length === 2) {
            if (is_parent) {
              this.setState({
                inv_table_visible: true,
                dynamicInventory: false,
              });
            } else {
              toastr.warning("Pairing must contain one parent attribute");
            }
          } else {
            this.setState({ inv_table_visible: true, dynamicInventory: false });
          }
        }
      } else {
        toastr.warning("Please select atleast one attribute");
      }
    } else {
      toastr.warning("Please select inventory group");
    }
  };

  /**
   * @method renderDynamicInventoryBlock
   * @description render dynamic inventory group attribute block
   */
  renderDynamicInventoryBlock = () => {
    const { selected_group, allGroup, selected_value, group_id } = this.state;
    if (allGroup && allGroup.length > 1) {
      return (
        <div className="create-inventory-parent-inner-box">
          <h4 className="heading">Select attribute you want to use?</h4>
          <div className="create-inventory-inner-box">
            <Card>
              <Form.Item name={"group"} rules={[required("")]}>
                <Radio.Group
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    this.setState({
                      group_id: e.target.value,
                      selected_group: true,
                      selected_value: "",
                    });
                  }}
                >
                  {allGroup.map((el, i) => {
                    return (
                      <div className="checkbox-an-radio-box">
                        <Row guttor={0}>
                          <Col md={2}>
                            <Radio value={el.id}></Radio>
                          </Col>
                          <Col md={22}>
                            <Card>{this.singleInvGroup(el)}</Card>
                          </Col>
                        </Row>
                        <br />
                      </div>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
              <Button
                htmlType={"button"}
                danger
                onClick={() =>
                  this.handleAttributeSubmit(selected_group, selected_value)
                }
              >
                Done
              </Button>
            </Card>
          </div>
        </div>
      );
    } else {
      let temp = allGroup.length ? allGroup[0] : "";
      if (temp) {
        return (
          <div className="create-inventory-parent-inner-box">
            <div className="create-inventory-inner-box">
              <Card>
                {this.singleInvGroup(temp,true)}
                <Button
                  htmlType={"button"}
                  danger
                  onClick={() =>
                    this.handleAttributeSubmit(true, selected_value)
                  }
                >
                  Done
                </Button>
              </Card>
            </div>
          </div>
        );
      } else {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
      }
    }
  };

  /**
   * @method addElement
   * @description add element in object
   */
  addElement = (ElementList, element) => {
    let newList = Object.assign(ElementList, element);
    return newList;
  };

  /**
   * @method singleInvGroup
   * @description render inv group
   */
  singleInvGroup = (el,single) => {
    const { is_inventory_edit, selected_value, group_id} = this.state;
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        inv_attribute: selected_value,
      });
    let inventory_attribute =
      el &&
      el.inv_attributes &&
      Array.isArray(el.inv_attributes) &&
      el.inv_attributes.length
        ? el.inv_attributes
        : [];
    let inv_group_id = inventory_attribute.length && inventory_attribute[0].pivot && inventory_attribute[0].pivot.retail_inv_group_id 
    return (
      <div>
        {inventory_attribute && inventory_attribute.length !== 0 && (
          <Form.Item name={"inv_attribute"} rules={[required("")]}>
            <Checkbox.Group
              style={{ width: "100%" }}
              disabled={single ? false : group_id === inv_group_id ? false : true}
              onChange={(value) => {
                var result = inventory_attribute.filter((o) =>
                  value.some((v) => v === o.display_name)
                );
                let children = [{ quantity: "", inv_attribute_value: "" }];
                let child = { children };
                let combine_data = this.addElement(result, child);
                this.setState({
                  selected_value: value,
                  initial_attribute: combine_data,
                  currentField2: "",
                  group_id: inv_group_id
                });
                if (is_inventory_edit) {
                  this.formRef.current &&
                    this.formRef.current.setFieldsValue({
                      group_inventory_attribute: [
                        {
                          index: 0,
                          quantity: "",
                          image: [],
                          imgaeUrl: [],
                          children: [{ index: 0 }],
                        },
                      ],
                    });
                } else {
                  this.formRef.current &&
                    this.formRef.current.setFieldsValue({
                      group_inventory_attribute: [{ ...combine_data }],
                    });
                }
              }}
            >
              <Row>
                {inventory_attribute.map((att, i) => {
                  return (
                    <Col className="name-features-box pb-20" md={12} key={i}>
                      <Checkbox value={att.display_name}>
                        {att.display_name}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        )}
      </div>
    );
  };

  /**
   * @method renderAttributeTable
   * @description render inv attribute table
   */
  renderAttributeTable = () => {
    const { inv_table_visible } = this.state;
    return (
      <div className="create-inventory-parent-inner-box">
        {inv_table_visible && (
          <Row gutter={12}>
            <Col md={21}>
              <h4 className="heading">Inventory Details</h4>
            </Col>
            <Col md={3}>
              <label
                onClick={() =>
                  this.setState({
                    dynamicInventory: true,
                    inv_table_visible: false,
                    is_inventory_edit: true,
                  })
                }
                className="edit"
              >
                {" "}
                Edit
              </label>
            </Col>
          </Row>
        )}
        {this.renderDynamicInventoryForm()}
      </div>
    );
  };

  /**
   * @method duplicateEntry
   * @description duplicate entry
   */
  duplicateEntry = function (currentField, type) {
    let temp = currentField.group_inventory_attribute;
    if (temp && temp.length) {
      return temp
        .map(function (value) {
          return value[type];
        })
        .some(function (value, index, temp) {
          return temp.indexOf(value) !== temp.lastIndexOf(value);
        });
    }
  };

  /**
   * @method duplicateChildEntry
   * @description duplicate entry
   */
  duplicateChildEntry = function (currentField, i, el) {
    let temp =
      currentField.group_inventory_attribute[i] &&
      currentField.group_inventory_attribute[i].children &&
      currentField.group_inventory_attribute[i].children;
    if (temp && temp.length) {
      return temp
        .map(function (value) {
          return value.inv_attribute_value;
        })
        .some(function (value, index, temp) {
          return temp.indexOf(value) !== temp.lastIndexOf(value);
        });
    }
  };

  /**
   * @method renderChildAttributes
   * @description render child attributes
   */
  renderChildAttributes = (item, field, is_parent) => {
    return (
      <Form.List name={[field.fieldKey, "children"]} layout="inline">
        {(children, { add, remove }) => {
          let childValues =
            item &&
            item[0] &&
            item[0].children &&
            Array.isArray(item[0].children) &&
            item[0].children.length
              ? item[0].children[0].values
              : item.length > 1
              ? item[1].values
              : [];
          if (is_parent) {
            return (
              <div className="w-100">
                <Row gutter={0}>
                  <Col md={22}>
                    {children.map((el, index2) => (
                      <Row gutter={12} className={"custom-inline-fields"}>
                        <Col md={9}>
                          <Form.Item
                            {...el}
                            name={[el.name, "inv_attribute_value"]}
                            fieldKey={[el.fieldKey, "inv_attribute_value"]}
                            key={index2}
                            rules={[required("")]}
                          >
                            <Select
                              onChange={() => {
                                let currentField =
                                  this.formRef.current &&
                                  this.formRef.current.getFieldsValue();
                                let temp =
                                  currentField.group_inventory_attribute &&
                                  currentField.group_inventory_attribute[
                                    field.key
                                  ] &&
                                  currentField.group_inventory_attribute[
                                    field.key
                                  ].children &&
                                  currentField.group_inventory_attribute[
                                    field.key
                                  ].children;
                                let duplicate = this.duplicateChildEntry(
                                  currentField,
                                  field.key,
                                  el.key
                                );
                                if (duplicate) {
                                  if (
                                    temp &&
                                    temp[el.key] &&
                                    temp[el.key].inv_attribute_value
                                  ) {
                                    toastr.warning(
                                      "You have already use this value, please select other "
                                    );
                                    temp[el.key].inv_attribute_value = "";
                                    this.formRef.current &&
                                      this.formRef.current.setFieldsValue({
                                        ...currentField,
                                      });
                                  }
                                }
                              }}
                            >
                              {this.renderDynamicAttOption(childValues)}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col md={9}>
                          <Form.Item
                            {...el}
                            name={[el.name, "quantity"]}
                            fieldKey={[el.fieldKey, "quantity"]}
                            key={index2}
                            rules={[{ validator: validNumber }]}
                          >
                            <InputNumber min={1} />
                          </Form.Item>
                        </Col>
                        {el.key !== 0 && (
                          <Col md={6} className="align-left">
                            <MinusCircleOutlined
                              className="edit-menu-remove custom-remove-icon"
                              onClick={() => {
                                remove(el.name);
                              }}
                            />
                          </Col>
                        )}
                      </Row>
                    ))}
                  </Col>
                  <Col md={2} style={{ alignSelf: "flex-end" }}>
                    <Form.Item name={"children"}>
                      <div className="add-more-btn-box">
                        <div
                          onClick={() => {
                            let currentField =
                              this.formRef.current &&
                              this.formRef.current.getFieldsValue();
                            let temp =
                              currentField.group_inventory_attribute &&
                              currentField.group_inventory_attribute[
                                field.key
                              ] &&
                              currentField.group_inventory_attribute[field.key]
                                .children &&
                              currentField.group_inventory_attribute[field.key]
                                .children;
                            if (temp && temp.length) {
                              let isEmpty = temp.some(
                                (el) =>
                                  el.inv_attribute_value == undefined ||
                                  el.inv_attribute_value == "" ||
                                  el.quantity === undefined ||
                                  el.quantity === ""
                              ); // true
                              if (isEmpty) {
                                toastr.warning(
                                  langs.warning,
                                  MESSAGES.MANDATE_FILDS
                                );
                              } else {
                                add();
                              }
                            } else {
                              add();
                            }
                          }}
                          className="inline-block cursur-pointer"
                        >
                          <img
                            src={require("../../assets/images/icons/plus_circle-orange.svg")}
                            alt="Add"
                          />
                        </div>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            );
          }
        }}
      </Form.List>
    );
  };

  renderImageUpload = (field) => {
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    const uploadButton = (
      <div>
        <img
          src={require("../../assets/images/icons/plus-circle.svg")}
          alt="Add"
        />
        <div style={{ fontSize: "10px" }}>Add upto 5 images</div>
      </div>
    );
    let fileList =
      currentField &&
      currentField.group_inventory_attribute &&
      currentField.group_inventory_attribute[field.key] &&
      currentField.group_inventory_attribute[field.key].image
        ? currentField.group_inventory_attribute[field.key].image[0]
        : [];
    let image = [];
    if (fileList && fileList.length) {
      image = [fileList];
    }
    const { currentField2 } = this.state;
    return (
      <Form.Item
        name={[field.name, "image"]}
        fieldKey={[field.fieldKey, "image"]}
      >
        <div className="file-uploader">
          <ImgCrop>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={true}
              customRequest={this.dummyRequest}
              fileList={
                currentField &&
                currentField.group_inventory_attribute &&
                currentField.group_inventory_attribute[field.key] &&
                currentField.group_inventory_attribute[field.key].image &&
                currentField.group_inventory_attribute[field.key].image.length
                  ? [currentField.group_inventory_attribute[field.key].image[0]]
                  : []
              }
              onPreview={() => {
                this.setState({
                  imagePreviewModel: true,
                  formListObj: currentField2,
                  selectedIndex: field.key,
                });
              }}
              onChange={({ file, fileList }) => {
                let currentField =
                  this.formRef.current && this.formRef.current.getFieldsValue();
                if (currentField.group_inventory_attribute) {
                  currentField.group_inventory_attribute[field.key].image = [
                    ...fileList,
                  ];
                  this.formRef.current &&
                    this.formRef.current.setFieldsValue({
                      ...currentField,
                    });
                  this.setState({ currentField2: currentField });
                }
                const isJpgOrPng =
                  (file && file.type === "image/jpeg") ||
                  (file && file.type === "image/png") ||
                  file.type === "image/jpg";
                const isLt2M = file && file.size / 1024 / 1024 < 2;
                if (!isJpgOrPng) {
                  message.error("You can only upload JPG , JPEG  & PNG file!");
                  return false;
                } else if (!isLt2M) {
                  message.error("Image must smaller than 2MB!");
                  return false;
                }
              }}
            >
              {currentField2 &&
              currentField2.group_inventory_attribute &&
              currentField2.group_inventory_attribute[field.key] &&
              currentField2.group_inventory_attribute[field.key].image &&
              currentField2.group_inventory_attribute[field.key].image.length >=
                1
                ? null
                : uploadButton}
            </Upload>
          </ImgCrop>
        </div>
      </Form.Item>
    );
  };

  /**
   * @method renderDynamicInventoryForm
   * @description render dynamic inventory input
   */
  renderDynamicInventoryForm = () => {
    const { initial_attribute, inv_table_visible } = this.state;
    let is_parent =
      initial_attribute && initial_attribute.some((e) => e.is_parent === 1);
    let attributes = initial_attribute ? initial_attribute : "";
    return (
      <Form.List name="group_inventory_attribute">
        {(fields, { add, remove }) => {
          if (attributes && inv_table_visible) {
            let item = attributes;
            return (
              <div>
                <table className={"inventory-table inventory-detail-table"}>
                  {fields.map((field, index) => (
                    <>
                      {field.key == 0 && (
                        <thead>
                          <tr key={index}>
                            <th className={"table-heading"}>
                              {item && item[0].display_name}
                            </th>
                            <th className={"table-heading"}>{"Pictures"}</th>
                            {item && item.length > 1 ? (
                              <th className={"table-heading"}>
                                {item && item[1].display_name
                                  ? `${item[1].display_name}/Quantity`
                                  : "Quantity"}
                              </th>
                            ) : (
                              <th className={"table-heading"}>{"Quantity"}</th>
                            )}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        <tr>
                          <td className={"table-cell"}>
                            <Form.Item
                              name={[field.name, "inv_attribute_value"]}
                              fieldKey={[field.fieldKey, "inv_attribute_value"]}
                              rules={[required("")]}
                            >
                              <Select
                                onChange={() => {
                                  let currentField =
                                    this.formRef.current &&
                                    this.formRef.current.getFieldsValue();
                                  let duplicate = this.duplicateEntry(
                                    currentField,
                                    "inv_attribute_value"
                                  );
                                  if (duplicate) {
                                    toastr.warning(
                                      "You have already use this value, please select other "
                                    );
                                    currentField.group_inventory_attribute[
                                      field.key
                                    ].inv_attribute_value1 = "";
                                    this.formRef.current &&
                                      this.formRef.current.setFieldsValue({
                                        ...currentField,
                                      });
                                  }
                                }}
                                allowClear
                              >
                                {item &&
                                  this.renderDynamicAttOption(item[0].values)}
                              </Select>
                              {/* delete-invet.svg */}
                            </Form.Item>
                            {field.key !== 0 && (
                              // <MinusCircleOutlined
                              //   title={"Remove"}
                              //   className={"custom-remove-icon1"}
                              //   onClick={() => remove(field.name)}
                              // />
                              <img
                                src={require("../../assets/images/icons/delete-invet.svg")}
                                alt="delete"
                                title={"Remove"}
                                className={"custom-remove-icon1"}
                                onClick={() => remove(field.name)}
                              />
                            )}
                          </td>
                          <td className={"table-cell"}>
                            {this.renderImageUpload(field)}
                          </td>
                          {is_parent && item && item.length > 1 && (
                            <td className={"table-cell"}>
                              {this.renderChildAttributes(item, field, true)}
                            </td>
                          )}
                          {item && item.length === 1 && (
                            <td>
                              <Form.Item
                                name={[field.name, "quantity"]}
                                fieldKey={[field.fieldKey, "quantity"]}
                                rules={[{ validator: validNumber }]}
                              >
                                <InputNumber min={1} />
                              </Form.Item>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </>
                  ))}
                </table>
                {fields.length !== 0 && (
                  <Form.Item name={"parent"}>
                    {/* <Row>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          className={"align-right"}
                        > */}
                    <Button
                      type="default"
                      danger
                      className="text-black add-more-colour-btn"
                      onClick={() => {
                        let currentField =
                          this.formRef.current &&
                          this.formRef.current.getFieldsValue();
                        if (
                          currentField &&
                          currentField.group_inventory_attribute
                        ) {
                          let temp = currentField.group_inventory_attribute;
                          let children =
                            temp &&
                            temp[fields.length] &&
                            temp[fields.length].children &&
                            temp[fields.length].children.length
                              ? temp[fields.length].children[0]
                              : "";
                          console.log(
                            "children",
                            temp,
                            fields.length,
                            temp &&
                              temp[fields.length] &&
                              temp[fields.length].children
                          );
                          let children_value =
                            children &&
                            (children.inv_attribute_value == undefined ||
                              children.inv_attribute_value == "" ||
                              children.quantity == undefined ||
                              children.quantity == "");
                          let isEmpty = temp.some(
                            (el) =>
                              el.inv_attribute_value == undefined ||
                              el.inv_attribute_value == ""
                          ); // true
                          if (isEmpty) {
                            toastr.warning(
                              langs.warning,
                              MESSAGES.MANDATE_FILDS
                            );
                          } else {
                            let children = [
                              { inv_attribute_value: "", quantity: "" },
                            ];
                            currentField.group_inventory_attribute[
                              fields.length
                            ] = {
                              children,
                            };
                            add();
                            this.formRef.current &&
                              this.formRef.current.setFieldsValue({
                                ...currentField,
                              });
                          }
                        }
                      }}
                    >
                      {"Add More"}
                    </Button>
                    {/* </Col>
                      </Row> */}
                  </Form.Item>
                )}
              </div>
            );
          }
        }}
      </Form.List>
    );
  };

  /**
   * @method resetForm
   * @description Use to resetForm
   */
  resetForm = () => {
    this.setState({
      fileList: [],
      dynamicInventory: false,
      quantityBlock: false,
    });
    this.formRef.current.resetFields();
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      is_inventory_added,
      adPostDetail,
      initial_attribute,
      fileList,
      is_more_detail,
      subcategory_name,
      category_name,
      success_model,
      imagePreviewModel,
      formListObj,
      selectedIndex,
      previewVisible,
      quantityBlock,
      dynamicInventory,
      address,
      brandList,
      otherAttribute,
      attribute,
      all_attribute,
    } = this.state;
    const controls = ["bold", "italic", "underline", "separator"];
    let allDynamicAttribute = all_attribute;
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    let parent_categoryid = adPostDetail.parent_categoryid;
    let category_id = adPostDetail.category_id;
    return (
      <Fragment>
        <div className="wrap retail-post-an-ad-create-nd-edit retail-post-edit">
          <div
            className="align-left mt-30 pb-30"
            style={{ position: "relative" }}
          >
            <Title
              level={2}
              className="text-orange mt-20 mb-10 pl-100 ml-80 main-title"
            >
              {"My Ad Post"}
            </Title>
          </div>
          <div className="post-ad-box">
            <Form
              layout="vertical"
              onFinish={this.onFinish}
              ref={this.formRef}
              id={"retail-post-an-ad"}
              autoComplete="off"
              initialValues={{
                name: "group_inventory_attribute",
                group_inventory_attribute: this.state.inv_default_value,
              }}
            >
              <div className="card-container signup-tab">
                <Tabs type="card">
                  <TabPane key="1">
                    <Row justify="end" align="middle">
                      <Col>
                        <span className="clr-link" onClick={this.resetForm}>
                          Clear All{" "}
                          <img
                            src={require("../../assets/images/icons/delete-blue.svg")}
                            alt="delete"
                            style={{ top: "-1px" }}
                          />
                        </span>
                      </Col>
                    </Row>
                    <Row gutter={12}>
                      <Col md={24}>
                        <Form.Item
                          className="mb-0 select-category-box"
                          label={"Select a Category"}
                        >
                          <Input.Group compact className="custom-compact">
                            <Form.Item
                              name="parent_categoryid"
                              className="cat-left-input"
                            >
                              <Input
                                disabled={true}
                                defaultValue={category_name}
                              />
                            </Form.Item>
                            <Form.Item
                              name="category_id"
                              className="cat-right-input"
                            >
                              <Input
                                disabled={true}
                                defaultValue={subcategory_name}
                              />
                            </Form.Item>
                          </Input.Group>
                        </Form.Item>
                      </Col>
                    </Row>
                    <div>
                      <Form.Item
                        label="Product Name"
                        name="title"
                        className="label-large"
                        rules={[required("")]}
                      >
                        <Input size="large" placeholder="Type here" />
                      </Form.Item>
                    </div>
                    <Row gutter={12}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item label="Condition" name={"condition"}>
                            <Select
                              placeholder="Select"
                              allowClear
                              size={"large"}
                              className="w-100"
                            >
                              <Option value={"New"}>New</Option>
                              <Option value={"Used"}>Used</Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item label={"Brand Name"} name={"brand_name"}>
                            <Select
                              placeholder="Select"
                              allowClear
                              size={"large"}
                              className="w-100"
                            >
                              {this.renderBrandList(brandList)}
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={12}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item
                            label={"Price"}
                            name={"price"}
                            rules={[{ validator: validNumber }]}
                            onChange={this.handlePrice}
                            required
                            className="price-input-num"
                          >
                            {/* <Input type={"number"} /> */}
                            <InputNumber
                                formatter={(value) =>
                                  `AU$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace('AU$', "").replace(/\$\s?|(,*)/g, "").trim()
                                }
                              />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item label={"Final Price"} name={"final_price"} className="price-input-num">
                            {/* <Input disabled /> */}
                            <InputNumber
                                formatter={(value) =>
                                  `AU$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                                disabled
                              />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <div>
                      <Form.Item
                        label="Description"
                        name="description"
                        className="label-large"
                        rules={[required("")]}
                      >
                        <BraftEditor
                          controls={controls}
                          contentStyle={{ height: 150 }}
                          className={"input-editor"}
                          language="en"
                        />
                      </Form.Item>
                    </div>
                    <div className="con-brand-ship-parent-block">
                      <div className="condition-block">
                        <Form.Item
                          label="Inventory"
                          name={"is_inventory_added"}
                        >
                          <Radio.Group
                            onChange={(e) => {
                              if (e.target.value === 1) {
                                if (is_inventory_added) {
                                  this.formRef.current &&
                                    this.formRef.current.setFieldsValue({
                                      quantity: "",
                                    });
                                }
                                this.setState({
                                  dynamicInventory: true,
                                  quantityBlock: false,
                                });
                              } else {
                                this.setState({
                                  dynamicInventory: false,
                                  quantityBlock: true,
                                  inv_table_visible: false,
                                });
                              }
                            }}
                          >
                            <Radio value={0}>Type Quantity</Radio>
                            {quantityBlock && this.renderQuantitySelectionBox()}
                            <Radio value={1}>Create Inventory</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                      {/* {quantityBlock && this.renderQuantitySelectionBox()} */}
                      {dynamicInventory && this.renderDynamicInventoryBlock()}
                      {this.renderAttributeTable()}
                    </div>
                  </TabPane>
                </Tabs>
                {
                  <div className="card-container signup-tab mt-25">
                    <Collapse
                      defaultActiveKey={["1"]}
                      onChange={(e) => {
                        console.log("collapes", e);
                        if (e && e.length !== 0) {
                          this.setState({ is_more_detail: true });
                        } else {
                          this.setState({ is_more_detail: false });
                        }
                      }}
                    >
                      <Panel
                        header="More details"
                        key="1"
                        extra={
                          <div className="">
                            <span>{is_more_detail ? "Hide" : "Show"}</span>
                            {is_more_detail ? (
                              <img
                                src={require("../../assets/images/icons/up-circle.svg")}
                                alt="down-circle"
                              />
                            ) : (
                              <img
                                src={require("../../assets/images/icons/down-circle.svg")}
                                alt="down-circle"
                              />
                            )}
                          </div>
                        }
                      >
                        <Row gutter={12}>
                          {this.renderItem(allDynamicAttribute)}
                        </Row>
                        <Row className="item-detail-box">
                          <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item className="mb-0" label={"Item Weight"}>
                              <Input.Group
                                compact
                                className="custom-compact item-weight"
                              >
                                <Form.Item name={"weight"}>
                                  <Input type={"number"} />
                                </Form.Item>
                                <Form.Item
                                  name={"weight_unit"}
                                  placeholder={"Select Unit"}
                                >
                                  <Select>
                                    <Option value="KG">KG</Option>
                                    <Option value="LB">LB </Option>
                                  </Select>
                                </Form.Item>
                              </Input.Group>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label={"Item Dimension (L*W*H)"}>
                              <Input.Group
                                compact
                                className="custom-compact l-w-h"
                              >
                                <Form.Item
                                  name={"length"}
                                  placeholder={"Length"}
                                  rules={[{ validator: validNumber }]}
                                >
                                  <InputNumber
                                    size="large"
                                    min={1}
                                    placeholder="L"
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={"width"}
                                  placeholder={"Width"}
                                  rules={[{ validator: validNumber }]}
                                >
                                  <InputNumber
                                    size="large"
                                    min={1}
                                    placeholder="w"
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={"height"}
                                  placeholder={"Height"}
                                  rules={[{ validator: validNumber }]}
                                >
                                  <InputNumber
                                    size="large"
                                    min={1}
                                    placeholder="H"
                                  />
                                </Form.Item>
                                <Form.Item name={"length_unit"}>
                                  <Select
                                    className="centimeters-select"
                                    defaultValue="Inches"
                                  >
                                    <Option value="Inches ">Inches </Option>
                                    <Option value="Centimeters ">C.M.</Option>
                                    <Option value="Feet">Feet</Option>
                                  </Select>
                                </Form.Item>
                              </Input.Group>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Panel>
                    </Collapse>
                  </div>
                }
                <div className="card-container signup-tab mt-25 dispatch-location-box">
                  <Card>
                    <h3>Dispatch Location</h3>
                    <Row gutter={28}>
                      <Col span={24}>
                        <Form.Item
                          // label="Locate your address"
                          name="address"
                          className="label-large"
                          rules={
                            (address === "" ||
                              address === undefined ||
                              address === "N/A" ||
                              address === null) && [required("Address")]
                          }
                        >
                          <PlacesAutocomplete
                            name="address"
                            handleAddress={this.handleAddress}
                            addressValue={this.state.address}
                            clearAddress={(add) => {
                              this.formRef.current.setFieldsValue({
                                address: "",
                              });

                              this.setState({
                                address: "",
                              });
                            }}
                          />
                        </Form.Item>
                        <div
                          className="fs-14 text-blue use-current-location-text use-current-location-custom"
                          onClick={this.getCurrentLocation}
                          style={{ cursor: "pointer" }}
                        >
                          <Icon icon="location" size="13" />
                          Use my current location
                        </div>
                        <div className="fs-12 pl-2 location-msg">
                          Location is used in search results and appears on your
                          ad.
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
              <Row
                gutter={[40, 0]}
                className="retail-post-an-edit-footer step2"
              >
                <Col span={12} className="align-right">
                  <Link to={"/my-ads"}>
                    <Button
                      type="default"
                      htmlType="button"
                      className="previousStep text-black"
                      onClick={() => this.setState({ previewVisible: true })}
                    >
                      {"Cancel"}
                      {/* {'Preview'} */}
                    </Button>
                  </Link>
                </Col>
                <Col span={12}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    danger
                    className="custom-btn btn-blue"
                  >
                    {"Update"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          {imagePreviewModel && (
            <Modal
              visible={imagePreviewModel}
              className={"view-portfolio-gallery-modal"}
              footer={false}
              onCancel={() => this.setState({ imagePreviewModel: false })}
              destroyOnClose={true}
            >
              <div className="view-portfolio-gallery-content">
                <ImagePreview
                  className="mb-4"
                  currentField={formListObj}
                  index={selectedIndex}
                  ref={this.formRef.current}
                  setImages={(images) => {
                    let currentField =
                      this.formRef.current &&
                      this.formRef.current.getFieldsValue();
                    if (formListObj && formListObj.group_inventory_attribute) {
                      formListObj.group_inventory_attribute[
                        selectedIndex
                      ].image = images;
                      currentField.group_inventory_attribute[
                        selectedIndex
                      ].image = images;
                      this.formRef.current &&
                        this.formRef.current.setFieldsValue({
                          ...currentField,
                        });
                    }
                  }}
                />
              </div>
            </Modal>
          )}
          {previewVisible && (
            <RetailPreview
              visible={previewVisible}
              onCancel={() => this.setState({ previewVisible: false })}
              preview_detail={currentField}
              product_images={fileList}
              cat_name={category_name}
              sub_cat_name={subcategory_name}
              inv_default_value={initial_attribute}
              allDynamicAttribute={[...otherAttribute, ...attribute]}
              parent_categoryid={parent_categoryid}
              category_id={category_id}
            />
          )}
          {success_model && (
            <RetailSuccessModel
              visible={success_model}
              onCancel={() => this.setState({ success_model: false })}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, postAd, common } = store;
  const { step1 } = postAd;
  const { location } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    step1,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    lat: location ? location.lat : "",
    long: location ? location.long : "",
  };
};
export default connect(mapStateToProps, {
  deleteUploadedImagesOfPostAD,
  uploadRetailProductImage,
  getGSTPercentage,
  getAllBrandsAPI,
  deleteInspectionAPI,
  getRetailCategoryDetail,
  updateRetailClassified,
  getRetailPostAdDetail,
  getChildInput,
  getClassifiedDynamicInput,
  setAdPostData,
  enableLoading,
  disableLoading,
})(Step3);
