import React, { Fragment } from "react";
import moment from "moment";
import { connect } from "react-redux";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import ImgCrop from "antd-img-crop";
import { toastr } from "react-redux-toastr";
import "react-quill/dist/quill.snow.css";
import PlacesAutocomplete from "../common/LocationInput";
import {
  Empty,
  InputNumber,
  Card,
  Modal,
  Select,
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
  Cascader,
  Breadcrumb,
  Typography,
} from "antd";
import { renderField } from "../forminput";
import { required, validNumber } from "../../config/FormValidation";
import {
  retailPostanAdAPI,
  uploadRetailProductImage,
  getGSTPercentage,
  getAllBrandsAPI,
  getRetailDynamicAttribute,
  enableLoading,
  disableLoading,
} from "../../actions";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { setAdPostData } from "../../actions/classifieds/PostAd";
import { RetailNavBar } from "../classified-post-ad/CommanMethod";
import "../vendor/retail/vendorretail.less";
import { getAddress } from "../common";
import Icon from "../../components/customIcons/customIcons";
import { langs } from "../../config/localization";
import { MESSAGES } from "../../config/Message";
import RetailPreview from "./RetailPreview";
import ImagePreview from "./ImagePreviewModel";
import RetailSuccessModel from "./SuccessModel";
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

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
      inv_att: [],
      initial: false,
      brandList: [],
      shipping: [],
      percentageAmount: "",
      shipmentVisible: false,
      comissionAmount: "",
      gstAmount: "",
      group_attribute: [],
      dynamicImageArray: [],
      uploadedUrl: [],
      brandVisible: false,
      allgroupAtt: [],
      dimentionVisible: false,
      group_id: "",
      weightVisible: false,
      inv_default_value: [
        {
          index: 0,
          quantity: 0,
          image: "",
          imageUrl: [],
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
      is_more_detail: true,
      all_attribute: [],
      parent_categoryid: "",
      sub_category_id: "",
      child_category_id: "",
      subCategory: [],
      parent_category_name: "",
      sub_category_name: "",
      child_category_name: "",
    };
  }

  /**
   * @method componentWillMount
   * @description mount before render the component
   */
  componentWillMount() {
    this.props.enableLoading();
    const { step1 } = this.props;
    let catId = step1.child_category_id
      ? step1.child_category_id
      : step1.category_id;
    let sub_category_id = step1.sub_category_id;
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        parent_categoryid: step1.categoryData.text,
      });
    this.getSubCategoryData(step1.parent_categoryid);
    this.getSettingData();
    this.getInvAttributes(catId);
    this.getBrandsList(sub_category_id);
    this.seIntitialValues(this.props.reqData);
    if (this.props.reqData) {
      const { reqData } = this.props;
      reqData.map((el) => {
        if (el.type === "group_inventory_attribute") {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.group_inventory_attribute]: el.value,
            });
          this.setState({ group_inventory_attribute: el.value, initial: true });
        } else if (el.type === "shipping") {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.shipping]: el.value,
            });
          this.setState({ shipping: el.value, initial: true });
        } else if (el.key === "description") {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: BraftEditor.createEditorState(el.value),
            });
        }
      });
    }
  }

  /**
   * @method getSettingData
   * @description get setting data gst percentage and commission percentage
   */
  getSettingData = () => {
    this.props.getGSTPercentage((res) => {
      if (res.status === 200) {
        let data = res.data && res.data.data;

        this.setState({ percentageAmount: data });
      }
    });
  };

  /**
   * @method getInvAttributes
   * @description get inv attributes
   */
  getInvAttributes = (catId) => {
    this.props.getRetailDynamicAttribute(
      { categoryid: catId, category_level: 3 },
      (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          let temp = [],
            imageTemp = [];
          let group_attribute =
            res.data.inv_attribute_group &&
            Array.isArray(res.data.inv_attribute_group)
              ? res.data.inv_attribute_group
              : [];
          const atr = Array.isArray(res.data.attributes)
            ? res.data.attributes
            : [];
          const mandate = atr.filter((el) => el.validation === 1);
          const optinal = atr.filter((el) => el.validation === 0);
          group_attribute &&
            group_attribute.length &&
            group_attribute.slice(0, 1).map((el, i) => {
              // this.setState({ group_id: el.id });
              let childAtt =
                el &&
                el.inv_attributes &&
                Array.isArray(el.inv_attributes) &&
                el.inv_attributes.length
                  ? el.inv_attributes
                  : [];
              childAtt &&
                childAtt.length &&
                childAtt.map((el2, i) => {
                  temp.push(el2);
                });
            });
          // this.setDynamicState(temp);
          this.getInitialGroupattributes(temp);

          this.setState({
            attribute: mandate,
            otherAttribute: optinal,
            group_attribute: group_attribute,
            allgroupAtt: temp,
            all_attribute: atr,
          });
        }
      }
    );
  };

  /**
   * @method addElement
   * @description add element in object
   */
  addElement = (ElementList, element) => {
    let newList = Object.assign(ElementList, element);
    return newList;
  };

  getInitialGroupattributes = (att) => {
    this.setState({ inv_default_value: [...att] });
  };

  /**
   * @method seIntitialValues
   * @description set initialvalues
   */
  seIntitialValues = (reqData) => {
    if (reqData) {
      reqData.map((el) => {
        if (el.type === "calendar") {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: moment(el.value),
            });
        } else if (el.type === "fileList") {
          this.setState({ fileList: el.value });
        } else if (el.type === "image") {
          let dynamicImageArray = el.value;
          dynamicImageArray &&
            dynamicImageArray.length &&
            dynamicImageArray.map((el, i) => {
              this.setState({
                [`${el.display_name}${el.group_id}`]: el.fileList
                  ? el.fileList
                  : [],
              });
            });
        } else if (el.key === "uploadedUrl") {
          this.setState({ uploadedUrl: el.value });
        } else if (el.key === "shipment") {
          this.setState({ shipmentVisible: el.value === "1" ? true : false });
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: el.value,
            });
        } else if (el.key === "brand") {
          this.setState({ brandVisible: el.value === "Brand" ? true : false });
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: el.value,
            });
        } else if (el.key === "has_dimension") {
          this.setState({ dimentionVisible: el.value === "1" ? true : false });
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: el.value,
            });
        } else {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: el.value,
            });
        }
      });
    }
  };

  /**
   * @method setDynamicState
   * @description set dynamic state
   */
  setDynamicState = (allgroupAtt) => {
    let imageTemp = [];
    allgroupAtt &&
      allgroupAtt.length &&
      allgroupAtt.map((el, i) => {
        if (el.have_image == 1) {
          imageTemp.push({
            group_id: el.pivot.inv_group_id,
            inv_attribute_id: el.id,
            display_name: el.display_name,
          });
        }
      });

    this.setState({ dynamicImageArray: imageTemp });
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * @method hasDupsObjects
   * @description check duplicate inspection time
   */
  hasDupsObjects = function (array) {
    return array
      .map(function (value) {
        return (
          value.inspection_start_time +
          value.inspection_end_time +
          value.inspection_date
        );
      })
      .some(function (value, index, array) {
        return array.indexOf(value) !== array.lastIndexOf(value);
      });
  };

  /**
   * @method getAttributes
   * @description formate attributes value
   */
  getAttributes = (value) => {
    console.log('value',value)
    const {
      inv_table_visible,
      dynamicInventory,
      inv_default_value,
      uploadedUrl,
      dynamicImageArray,
      attribute,
      otherAttribute,
      fileList,
      percentageAmount,
      gstAmount,
      comissionAmount,
    } = this.state;
    let temp = {},
      specification = [],
      price = "";
    let temp2 = [],
      groupAtt = {};
    let allDynamicAttribute = [...otherAttribute, ...attribute];
    if (dynamicInventory && !inv_table_visible) {
      toastr.warning("Please fill your inventory details");
      return true;
    }
    Object.keys(value).filter(function (key, index) {
      if (value[key] !== undefined) {
        allDynamicAttribute.map((el, index) => {
          if (el.att_name === key) {
            let att = allDynamicAttribute[index];
            let dropDropwnValue;
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

    let secondArray = [
      { key: "title", value: value.title, type: "text" },
      { key: "features", value: value.features, type: "text" },
      { key: "other_notes", value: value.other_notes, type: "text" },
      { key: "description", value: value.description, type: "text" },
      { key: "brand_name", value: value.brand_name },
      {
        key: "image",
        value:
          dynamicImageArray && dynamicImageArray.length
            ? dynamicImageArray
            : [],
        type: "image",
      },
      {
        key: "group_inventory_attribute",
        value: value.group_inventory_attribute,
        type: "group_inventory_attribute",
      },
      { key: "shipping", value: value.shipping, type: "shipping" },
      {
        key: "group_inventory_attribute",
        value: value.group_inventory_attribute,
        type: "group_inventory_attribute",
      },
      { key: "condition", value: value.condition },
      { key: "brand", value: value.brand },
      { key: "shipment", value: value.shipment },
      { key: "price", value: value.price },
      { key: "final_price", value: value.final_price },
      { key: "uploadedUrl", value: uploadedUrl },
      {
        key: "fileList",
        value: fileList && fileList.length ? fileList : [],
        type: "fileList",
      },
      { key: "length", value: value.length },
      { key: "height", value: value.height },
      { key: "width", value: value.width },
      { key: "length_unit", value: value.length_unit },
      { key: "has_dimension", value: value.has_dimension },
      { key: "has_weight", value: value.has_weight },
      { key: "weight", value: value.weight },
      { key: "returns_accepted", value: value.returns_accepted },
      { key: "exclude_out_of_stock", value: value.exclude_out_of_stock },
    ];

    let finalArray = temp2.concat(secondArray);
    const requestData = {
      attributevalue: temp,
      description: value.description.toHTML(),
      features: value.features,
      other_notes: value.other_notes,
      price: value.price ? value.price : "",
      title: value.title,
      brand_name: value.brand_name,
      condition: value.condition ? value.condition : "",
      brand: value.brand ? value.brand : "Non Brand",
      shipping: value.shipment ? value.shipment : 0,
      specification: specification,
      group_inventory_attribute: value.group_inventory_attribute,
      inspectionPreview: value.inspection_time,
      shippingArray: value.shipping ? value.shipping : [],
      percentageAmount: percentageAmount,
      gstAmount: gstAmount,
      comissionAmount: comissionAmount,
      fileList: fileList,
      has_weight: value.has_weight ? 1 : 0,
      weight_unit: value.weight_unit ? value.weight_unit : 0,
      weight: value.weight ? value.weight : 0,
      has_dimension: value.has_dimension ? 1 : 0,
      length: value.length ? value.length : 0,
      width: value.width ? value.width : 0,
      height: value.height ? value.height : 0,
      length_unit: value.length_unit ? value.length_unit : 0,
      returns_accepted: value.returns_accepted ? value.returns_accepted : false,
      exclude_out_of_stock: value.exclude_out_of_stock
        ? value.exclude_out_of_stock
        : false,
      quantity: value.quantity,
      is_inventory_added: value.is_inventory_added,
    };

    this.props.setAdPostData(requestData, 2);
    this.props.setAdPostData(
      { fileList: fileList && fileList.length ? fileList : [] },
      "fillist"
    );
    // this.props.nextStep(finalArray)
    this.adPostRetail(requestData);
  };

  /**
   * @method adPostRetail
   * @description ad retail post an ad
   */
  adPostRetail = async (allAttribute) => {
    console.log("allAttribute", allAttribute);
    const {
      adPermissionData,
      lat,
      long,
      userDetails,
      step1,
      loggedInDetail,
    } = this.props;
    const {
      inv_default_value,
      data,
      address,
      classified_type,
      parent_categoryid,
      sub_category_id,
      child_category_id,
    } = this.state;
    const { id, email, name, mobile_no } = userDetails;
    let memberShipId = "";
    let temp = [];
    if (adPermissionData && adPermissionData !== undefined) {
      const packageData =
        adPermissionData &&
        Array.isArray(adPermissionData.package) &&
        adPermissionData.package.length
          ? adPermissionData.package[0]
          : "";
      memberShipId = packageData.id;
    }
    allAttribute.fileList &&
      Array.isArray(allAttribute.fileList) &&
      allAttribute.fileList.filter((el) => {
        el.originFileObj && temp.push(el.originFileObj);
      });

    const requestData = {
      user_id: id,
      contact_name: name,
      contact_email: email,
      contact_mobile: mobile_no,
      lat: data ? data.lat : lat,
      lng: data ? data.lng : long,
      state_id: data ? data.state_id : userDetails.state,
      subregions_id: data ? data.subregions_id : userDetails.city,
      location: data ? data.location : address,
      hide_mob_number: 0,

      parent_categoryid: parent_categoryid
        ? parent_categoryid
        : step1.parent_categoryid,
      category_id: sub_category_id ? sub_category_id : step1.category_id,
      child_category_id: child_category_id
        ? child_category_id
        : step1.child_category_id
        ? step1.child_category_id
        : "",

      title: allAttribute.title,
      description: allAttribute.description,

      price: allAttribute.price,
      GST_tax_percent:
        allAttribute.percentageAmount &&
        allAttribute.percentageAmount.GST_percentage
          ? allAttribute.percentageAmount.GST_percentage
          : 0,
      formee_commision_tax_amount: allAttribute.comissionAmount
        ? allAttribute.comissionAmount
        : 0,
      GST_tax_amount: allAttribute.gstAmount ? allAttribute.gstAmount : 0,
      formee_commision_tax_percent:
        allAttribute.percentageAmount &&
        allAttribute.percentageAmount.Formee_commission_percentage
          ? allAttribute.percentageAmount.Formee_commission_percentage
          : 0,

      brand: allAttribute.brand,
      brand_name: allAttribute.brand_name,
      condition: allAttribute.condition,

      attributes: allAttribute.attributevalue,
      // inv_attribute_groups: allAttribute.inv_attribute_groups,
      quantity: allAttribute.quantity,
      ["image[]"]: temp,
      images: temp,

      shipping: allAttribute.shipping ? allAttribute.shipping : 0,
      shippingArray: allAttribute.shippingArray,

      has_dimension: allAttribute.has_dimension
        ? allAttribute.has_dimension
        : 1,
      length_unit: allAttribute.length_unit,
      length: allAttribute.length,
      width: allAttribute.width,
      height: allAttribute.height,

      has_weight: allAttribute.has_weight ? allAttribute.has_weight : 1,
      weight_unit: allAttribute.weight_unit,
      weight: allAttribute.weight,

      is_premium_parent_cat: 0,
      pay_pal: "on",
      price_type: "amount",
      is_premium_sub_cat: 0,

      returns_accepted: allAttribute.returns_accepted,
      exclude_out_of_stock: allAttribute.exclude_out_of_stock,
      is_inventory_added: allAttribute.is_inventory_added,
    };

    if (loggedInDetail.user_type !== langs.key.private) {
      requestData.contact_title = name;
      requestData.classified_type = classified_type ? classified_type : "";
      requestData.membership_plan_user_id = memberShipId ? memberShipId : "";
    }

    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    let groupAttr = currentField && currentField.group_inventory_attribute,
      inv_attributes = [],
      final_product_images = [],
      total_quantity = 0;
    let first =
      inv_default_value && inv_default_value.filter((el) => el.is_parent === 1);
    let second =
      inv_default_value && inv_default_value.filter((el) => el.is_parent === 0);
    let parent_id = first && first.length ? first[0].id : "";
    let child_id = second && second.length ? second[0].id : "";
    let group_id =
      first && first.length
        ? first[0].pivot.retail_inv_group_id
        : second && second.length
        ? second[0].pivot.retail_inv_group_id
        : "";
    let alldata = await Promise.all(
      groupAttr.map(async (el, i) => {
        let children = [],
          child_quantity = 0;
        let promises = [],
          product_images = [];
        let image_promise = await this.handleImageUpload(el.image);
        promises.push(image_promise);
        product_images.push(el.image);
        console.log("product_images", product_images);
        product_images.length &&
          product_images[0] &&
          product_images[0].map((el) => {
            el.originFileObj && final_product_images.push(el.originFileObj);
          });
        console.log("final_product_images", final_product_images);
        if (parent_id && child_id && el.children && el.children.length) {
          el.children &&
            el.children.length &&
            el.children.map((el2, i) => {
              children.push({
                inv_attribute_id: child_id,
                inv_attribute_value: el2.child_value,
                quantity: el2.child_quantity,
              });
              child_quantity =
                Number(child_quantity) + Number(el2.child_quantity);
            });
          inv_attributes.push({
            inv_attribute_id: parent_id,
            inv_attribute_value: el.inv_attribute_value1,
            quantity: child_quantity,
            images: promises && promises.length ? promises[0] : [],
            children,
          });
          total_quantity = Number(total_quantity) + Number(child_quantity);
          let groupAttData = {
            group_id: group_id,
            inv_attributes: inv_attributes,
          };
          requestData.inv_attribute_groups = groupAttData;
          requestData.quantity = total_quantity;
          requestData.images = final_product_images.length
            ? final_product_images
            : temp;
          return requestData;
        } else {
          inv_attributes.push({
            inv_attribute_id: parent_id,
            inv_attribute_value: el.inv_attribute_value1,
            quantity: child_quantity,
            images: promises && promises.length ? promises[0] : [],
            children,
          });
          total_quantity = Number(total_quantity) + Number(child_quantity);
          let groupAttData = {
            group_id: group_id,
            inv_attributes: inv_attributes,
          };
          requestData.inv_attribute_groups = groupAttData;
          requestData.quantity = total_quantity ? total_quantity : allAttribute.quantity;
          requestData.total_quantity  = total_quantity ? total_quantity : allAttribute.quantity;
          requestData.images = final_product_images.length
            ? final_product_images
            : temp;
          return requestData;
        }
      })
    );
    if (alldata && alldata.length && alldata[0]) {
      console.log("alldata", alldata[0]);
      this.convertInFormData(alldata[0]);
    }
  };

  convertInFormData = (requestData) => {
    let formData = new FormData();
    for (var i = 0; i < requestData.images.length; i++) {
      formData.append("image[]", requestData.images[i]);
    }
    Object.keys(requestData).forEach((key) => {
      if (
        typeof requestData[key] == "object" &&
        key !== "image[]" &&
        key !== "shippingArray"
      ) {
        formData.append(key, JSON.stringify(requestData[key]));
      } else if (key === "shippingArray") {
        requestData[key].length &&
          requestData[key].map((el, i) => {
            formData.append(`ship_name_${i + 1}`, el.ship_name);
            formData.append(`ship_amount_${i + 1}`, el.ship_amount);
            formData.append(`delivery_time_${i + 1}`, el.delivery_time);
          });
      } else {
        formData.append(key, requestData[key]);
      }
    });
    // this.setState({ success_model: true });
    this.props.enableLoading();
    this.props.retailPostanAdAPI(formData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.POST_ADD_SUCCESS);
        this.setState({ success_model: true });
      }
    });
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
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
   * @method handlePrice
   * @description handle price change
   */
  handlePrice = ({ target: { value } }) => {
    let price = value.replace("AU$", "").replace(/[^a-zA-Z 0-9]+/g, "");
    console.log("value", price, Number(price));
    const { percentageAmount } = this.state;
    let actual_price = Number(price);
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
    let full_address = {
      location: address,
      lat: latLng.lat,
      lng: latLng.lng,
      state_id: state,
      subregions_id: city,
    };
    this.setState({ data: full_address, address: address });
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
                <InputNumber placeholder="..." min={1} />
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
    const { inv_default_value } = this.state;
    if (isgroup) {
      if (item && item.length) {
        if (item.length > 2) {
          toastr.warning(
            "Inventory creation will applicable  for only two attribute"
          );
        } else {
          let is_parent =
            inv_default_value &&
            inv_default_value.some((e) => e.is_parent === 1);
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
    const { selected_group, group_attribute, selected_value } = this.state;
    console.log("group_attribute", group_attribute);
    if (group_attribute && group_attribute.length > 1) {
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
                  {group_attribute.map((el, i) => {
                    return (
                      <div>
                        <Row guttor={0} className="checkbox-an-radio-box">
                          <Col md={2}>
                            <Radio value={el.id}></Radio>
                          </Col>
                          <Col md={22}>
                            <Card>{this.singleInvGroup(el)}</Card>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
              <Button
                htmlType={"button"}
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
      let temp = group_attribute.length ? group_attribute[0] : "";
      console.log("temp", temp);
      if (temp) {
        return (
          <div className="create-inventory-parent-inner-box">
            <div className="create-inventory-inner-box">
              <Card>
                {this.singleInvGroup(temp, true)}
                <Button
                  htmlType={"button"}
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

  singleInvGroup = (el, single) => {
    const {
      is_inventory_edit,
      group_attribute,
      selected_value,
      group_id,
    } = this.state;
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
    let inv_group_id =
      inventory_attribute.length &&
      inventory_attribute[0].pivot &&
      inventory_attribute[0].pivot.retail_inv_group_id;
    console.log(inv_group_id, "inventory_attribute", group_id);
    return (
      <div>
        {inventory_attribute && inventory_attribute.length !== 0 && (
          <Form.Item name={"inv_attribute"} rules={[required("")]}>
            <Checkbox.Group
              style={{ width: "100%" }}
              disabled={
                single ? false : group_id === inv_group_id ? false : true
              }
              onChange={(value) => {
                let currentField =
                  this.formRef.current && this.formRef.current.getFieldsValue();
                var result = inventory_attribute.filter((o) =>
                  value.some((v) => v === o.display_name)
                );
                let children = [{ child_quantity: "", child_value: "" }];
                let child = { children };
                let combine_data = this.addElement(result, child);
                this.setState({
                  selected_value: value,
                  inv_default_value: combine_data,
                  currentField2: "",
                  group_id: inv_group_id,
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

  renderAttributeTable = () => {
    const { fileList, inv_table_visible } = this.state;
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
          return value.child_value;
        })
        .some(function (value, index, temp) {
          return temp.indexOf(value) !== temp.lastIndexOf(value);
        });
    }
  };

  renderChildAttributes = (item, field, is_parent) => {
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    return (
      <Form.List name={[field.fieldKey, "children"]} layout="inline">
        {(children, { add, remove }) => {
          let childValues = item.length > 1 && item[1].values;
          if (is_parent && item && item.length > 1) {
            return (
              <div className="w-100">
                <Row gutter={0}>
                  <Col md={22}>
                    {children.map((el, index2) => (
                      <Row
                        gutter={12}
                        className={"custom-inline-fields sdfsdf"}
                      >
                        <Col md={9}>
                          <Form.Item
                            {...el}
                            name={[el.name, "child_value"]}
                            fieldKey={[el.fieldKey, "child_value"]}
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
                                    temp[el.key].child_value
                                  ) {
                                    toastr.warning(
                                      "You have already use this value, please select other "
                                    );
                                    temp[el.key].child_value = "";
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
                            name={[el.name, "child_quantity"]}
                            fieldKey={[el.fieldKey, "child_quantity"]}
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
                                  el.child_value == undefined ||
                                  el.child_value == "" ||
                                  el.child_quantity === undefined ||
                                  el.child_quantity === ""
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

  handleImageUpload = (fileList, callback) => {
    const { group_id, inv_default_value } = this.state;
    let imageURL = [];
    if (fileList && fileList.length) {
      let att_id =
        inv_default_value && inv_default_value.length
          ? inv_default_value[0].id
          : "";
      let reqData = {
        group_id: group_id,
        inv_attribute_id: att_id,
        image: fileList,
      };
      let formData = new FormData();
      for (var i = 0; i < fileList.length; i++) {
        formData.append("image[]", fileList[i].originFileObj);
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

  renderImageUpload = (field) => {
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    const uploadButton = (
      <div>
        <img
          src={require("../../assets/images/icons/plus_circle-orange.svg")}
          alt="Add"
        />
        <div style={{ fontSize: "9px", paddingTop: "5px", color: "#55636D" }}>
          Add upto 5 images
        </div>
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
    const {
      fileList,
      inv_default_value,
      inv_table_visible,
      currentField2,
    } = this.state;

    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    let is_parent =
      inv_default_value && inv_default_value.some((e) => e.is_parent === 1);

    return (
      <Form.List name="group_inventory_attribute">
        {(fields, { add, remove }) => {
          if (currentField && inv_table_visible && inv_default_value) {
            // let item = currentField.group_inventory_attribute ? currentField.group_inventory_attribute : ''
            let item = inv_default_value;
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
                              name={[field.name, "inv_attribute_value1"]}
                              fieldKey={[
                                field.fieldKey,
                                "inv_attribute_value1",
                              ]}
                              rules={[required("")]}
                            >
                              <Select
                                onChange={() => {
                                  let currentField =
                                    this.formRef.current &&
                                    this.formRef.current.getFieldsValue();
                                  let duplicate = this.duplicateEntry(
                                    currentField,
                                    "inv_attribute_value1"
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
                            </Form.Item>
                            {field.key !== 0 && (
                              // <MinusCircleOutlined
                              //   title={"Remove"}
                              //   className={"custom-remove-icon1"}
                              //   onClick={() => remove(field.name)}
                              // />
                              <img
                                src={require("../../assets/images/icons/delete-invet.svg")}
                                alt="Remove"
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
                              {this.renderChildAttributes(
                                item,
                                field,
                                is_parent
                              )}
                            </td>
                          )}
                          {!is_parent && item && item.length > 1 && (
                            <td className={"table-cell"}>
                              <Form.Item
                                name={[field.name, "inv_attribute_value2"]}
                                fieldKey={[
                                  field.fieldKey,
                                  "inv_attribute_value2",
                                ]}
                                rules={[required("")]}
                              >
                                <Select
                                  onChange={() => {
                                    let currentField =
                                      this.formRef.current &&
                                      this.formRef.current.getFieldsValue();
                                    let duplicate = this.duplicateEntry(
                                      currentField,
                                      "inv_attribute_value2"
                                    );
                                    if (duplicate) {
                                      toastr.warning(
                                        "You have already use this value, please select other "
                                      );
                                      currentField.group_inventory_attribute[
                                        field.key
                                      ].inv_attribute_value2 = "";
                                      this.formRef.current &&
                                        this.formRef.current.setFieldsValue({
                                          ...currentField,
                                        });
                                    }
                                  }}
                                  allowClear
                                >
                                  {item &&
                                    this.renderDynamicAttOption(item[1].values)}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "quantity"]}
                                fieldKey={[field.fieldKey, "quantity"]}
                                rules={[{ validator: validNumber }]}
                              >
                                <InputNumber min={1} />
                              </Form.Item>
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
                      danger
                      className="add-more-colour-btn"
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
                            temp.children && temp.children.length
                              ? temp.children[fields.length - 1]
                              : "";
                          let isEmpty = temp.some(
                            (el) =>
                              el.inv_attribute_value1 == undefined ||
                              el.inv_attribute_value1 == ""
                          ); // true
                          if (isEmpty) {
                            toastr.warning(
                              langs.warning,
                              MESSAGES.MANDATE_FILDS
                            );
                          } else {
                            let children = [
                              { child_value: "", child_quantity: "" },
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
   * @method getSubCategoryData
   * @description get subcategory data
   */
  getSubCategoryData = (id) => {
    const { retailList } = this.props;
    let subcategories = retailList && retailList.filter((el) => el.id == id);
    if (subcategories && Array.isArray(subcategories) && subcategories.length) {
      let subCategory = subcategories[0].category_childs;
      let temp = [];
      subCategory &&
        subCategory.length !== 0 &&
        subCategory.map((el, i) => {
          let item =
            el.category_childs &&
            Array.isArray(el.category_childs) &&
            el.category_childs.length
              ? el.category_childs
              : [];
          let temp2 = [];
          item.length !== 0 &&
            item.map((el2, i) => {
              temp2.push({ value: el2.id, label: el2.text });
            });
          temp.push({
            value: el.id,
            label: el.text,
            children: temp2,
          });
        });
      this.setState({ subCategory: temp });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      otherAttribute,
      attribute,
      success_model,
      group_id,
      imagePreviewModel,
      formListObj,
      selectedIndex,
      fileList,
      previewVisible,
      quantityBlock,
      dynamicInventory,
      address,
      inv_default_value,
      brandList,
      is_more_detail,
      all_attribute,
      subCategory,
      parent_category_name,
      sub_category_name,
      child_category_name,
    } = this.state;
    const { step1, retailList } = this.props;
    let categoryName = parent_category_name
      ? parent_category_name
      : step1.categoryData.text
      ? step1.categoryData.text
      : step1.categoryData.name;
    let subCategoryName = sub_category_name
      ? sub_category_name
      : step1.subCategoryData.text
      ? step1.subCategoryData.text
      : step1.subCategoryData.name;
    let sub_category_id = step1.category_id;
    let child_category_id = step1.child_category_id;
    let sub_sub_category_name = child_category_name
      ? child_category_name
      : step1.sub_sub_category_name;
    const controls = ["bold", "italic", "underline", "separator"];
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    let allDynamicAttribute = all_attribute;
    return (
      <Fragment>
        <div className="wrap retail-post-an-ad-create-nd-edit">
          <div className="post-ad-box">
            {/* {RetailNavBar(step1)} */}
            <div>
              <Title level={2} className="text-blue mt-20 mb-10">
                Post an Ad
              </Title>
              <Breadcrumb separator="|" className="pb-30">
                <Breadcrumb.Item>Retail</Breadcrumb.Item>
                <Breadcrumb.Item>{categoryName}</Breadcrumb.Item>
                <Breadcrumb.Item>{subCategoryName}</Breadcrumb.Item>
                {sub_sub_category_name && (
                  <Breadcrumb.Item>{sub_sub_category_name}</Breadcrumb.Item>
                )}
              </Breadcrumb>
            </div>
            <Form
              layout="vertical"
              onFinish={this.onFinish}
              ref={this.formRef}
              id={"retail-post-an-ad"}
              autoComplete="off"
              initialValues={{
                name: "group_inventory_attribute",
                group_inventory_attribute: this.state.inv_default_value,
                parent_categoryid: categoryName,
                category_id: [sub_category_id, child_category_id],
              }}
            >
              <div className="card-container signup-tab">
                <Tabs type="card">
                  <TabPane tab="Post Details" key="1">
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
                              {/* <Input
                                disabled={true}
                                defaultValue={categoryName}
                              /> */}
                              <Select
                                placeholder="Select Category"
                                onChange={(value) => {
                                  let obj = JSON.parse(value);
                                  this.formRef.current &&
                                    this.formRef.current.setFieldsValue({
                                      category_id: null,
                                    });
                                  this.setState({
                                    parent_categoryid: obj.id,
                                    parent_category_name: obj.text,
                                  });
                                  this.getSubCategoryData(obj.id);
                                }}
                                allowClear
                                size={"large"}
                                className="w-100"
                              >
                                {retailList &&
                                  retailList.length !== 0 &&
                                  retailList.map((el, i) => {
                                    return (
                                      <Option
                                        key={i}
                                        value={JSON.stringify(el)}
                                      >
                                        {el.text}
                                      </Option>
                                    );
                                  })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              name="category_id"
                              className="cat-right-input"
                            >
                              {/* <Input
                                disabled={true}
                                defaultValue={subCategoryName}
                              /> */}
                              <Cascader
                                defaultValue={[
                                  sub_category_id,
                                  child_category_id,
                                ]}
                                placeholder="Select Subcategory"
                                onChange={(value) => {
                                  let obj1 = "",
                                    obj2 = "";
                                  value.map((el, i) => {
                                    subCategory.map((el2) => {
                                      let item =
                                        el2.children &&
                                        Array.isArray(el2.children) &&
                                        el2.children.length
                                          ? el2.children
                                          : [];
                                      if (i === 0 && el2.value === el) {
                                        obj1 = el2;
                                      }
                                      item.map((c) => {
                                        if (i === 1 && c.value === el) {
                                          obj2 = c;
                                        }
                                      });
                                    });
                                  });
                                  let id = obj2
                                    ? obj2.value
                                    : obj1
                                    ? obj1.value
                                    : "";
                                  console.log(id, "obj", obj1, obj2);
                                  this.setState(
                                    {
                                      sub_category_id: obj1 ? obj1.value : "",
                                      child_category_id: obj2 ? obj2.value : "",
                                      sub_category_name: obj1 ? obj1.label : "",
                                      child_category_name: obj2
                                        ? obj2.label
                                        : "",
                                    },
                                    () => this.getInvAttributes(id)
                                  );
                                }}
                                allowClear
                                displayRender={(label) => label.join("/")}
                                size={"large"}
                                className="w-100 retail-child-sub-category"
                                options={subCategory}
                                // changeOnSelect
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
                                value
                                  .replace("AU$", "")
                                  .replace(/\$\s?|(,*)/g, "")
                                  .trim()
                              }
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          <Form.Item
                            label={"Final Price"}
                            name={"final_price"}
                            className="price-input-num"
                          >
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
                          rules={[required("")]}
                        >
                          <Radio.Group
                            onChange={(e) => {
                              if (e.target.value === 1) {
                                this.formRef.current &&
                                  this.formRef.current.setFieldsValue({
                                    quantity: "",
                                  });
                                this.setState({
                                  dynamicInventory: true,
                                  quantityBlock: false,
                                  fileList: [],
                                });
                              } else {
                                this.formRef.current &&
                                  this.formRef.current.setFieldsValue({
                                    group: "",
                                  });
                                this.setState({
                                  selected_group: false,
                                  selected_value: "",
                                  dynamicInventory: false,
                                  quantityBlock: true,
                                  inv_table_visible: false,
                                  inv_default_value: "",
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
                      {/* {inv_table_visible && this.renderAttributeTable()} */}
                      {this.renderAttributeTable()}

                      {/* <div className="condition-block shipment-block">
                        <Form.Item label='Shipment' name={'shipment'}>
                          <Radio.Group onChange={(e) => this.setState({ shipmentVisible: e.target.value == '1' ? true : false })}>
                            <Radio value={'0'}>Free</Radio><br /><br />
                            <Radio value={'1'}>Enter Shipping Amount</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                      {shipmentVisible && this.renderShipMent()} */}
                    </div>
                  </TabPane>
                </Tabs>
                {
                  <div className="card-container signup-tab mt-25">
                    <Collapse
                      activeKey={[is_more_detail ? "1" : "0"]}
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
                                  <InputNumber size="large" placeholder="W" />
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
                                    <Option value="Inches">Inches </Option>
                                    <Option value="Centimeters">
                                      Centimeters{" "}
                                    </Option>
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
                  <Button
                    type="default"
                    htmlType="button"
                    className="previousStep text-black"
                    onClick={() => this.setState({ previewVisible: true })}
                  >
                    {"Preview Ad"}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    htmlType="submit"
                    danger
                    className="custom-btn btn-blue"
                  >
                    {"Post an Ad"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        {previewVisible && (
          <RetailPreview
            visible={previewVisible}
            onCancel={() => this.setState({ previewVisible: false })}
            preview_detail={currentField}
            product_images={fileList}
            cat_name={categoryName}
            sub_cat_name={subCategoryName}
            inv_default_value={inv_default_value}
            allDynamicAttribute={[...otherAttribute, ...attribute]}
            parent_categoryid={step1.parent_categoryid}
            category_id={step1.category_id}
          />
        )}
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
                group_id={group_id}
                inv_default_value={inv_default_value}
                setImages={(images, imageURL) => {
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
                    // currentField.group_inventory_attribute[selectedIndex].imageURL = [...imageURL]
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
        {success_model && (
          <RetailSuccessModel
            visible={success_model}
            onCancel={() => this.setState({ success_model: false })}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, postAd, common } = store;
  const { step1 } = postAd;
  const { location, categoryData } = common;
  let retailList =
    categoryData && Array.isArray(categoryData.retail.data)
      ? categoryData.retail.data
      : [];
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    step1,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    lat: location ? location.lat : "",
    long: location ? location.long : "",
    retailList,
  };
};
export default connect(mapStateToProps, {
  retailPostanAdAPI,
  uploadRetailProductImage,
  getGSTPercentage,
  getAllBrandsAPI,
  getRetailDynamicAttribute,
  setAdPostData,
  enableLoading,
  disableLoading,
})(Step3);
