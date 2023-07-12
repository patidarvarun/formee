import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import { MESSAGES } from "../../../../config/Message";
import history from "../../../../common/History";
import TextArea from "antd/lib/input/TextArea";
import { DownOutlined } from "@ant-design/icons";
import {
  Switch,
  InputNumber,
  Collapse,
  Divider,
  Avatar,
  message,
  Upload,
  Select,
  Input,
  Space,
  Form,
  Layout,
  Card,
  Typography,
  Button,
  Tabs,
  Row,
  Col,
  Modal,
  Menu,
  Dropdown,
} from "antd";
import Icon from "../../../customIcons/customIcons";
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  EditFilled,
  DeleteFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  required,
  validNumber,
  validNumberCheck,
} from "../../../../config/FormValidation";
import {
  enableLoading,
  createMenu,
  disableLoading,
  getRestaurantDetail,
  deleteRestaurantCategory,
  deleteRestaurantMenu,
  updateMenuCategory,
  updateMenu,
  bulkActionRestaurant,
  AddMenuCategory,
  deleteExtraChoiceOfPreparation,
  
} from "../../../../actions";
import NoContentFound from "../../../common/NoContentFound";
import ListExample from "../../../booking/common/List";
import { Link } from "react-router-dom";
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
class MenuListing extends React.Component {
  formRef = React.createRef();
  myformRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      restaurantDetail: [],
      selectedCategoryId: null,
      currentField: "",
      visibleEditCat: false,
      eitCatName: null,
      toggleMenu: null,
      visibleDelCat: null,
      activeMenuCategoryId: null,
      activeMenuID: null,
      fileList: null,
      editingmenu: false,
      editMenuInitial: null,
      visibleDelMenu: false,
    };
  }

  handleMenuClick = (e) => {
    const { business_profile_id } = this.props.loggedInUser;
    const { restaurantDetail, activeMenuCategoryId, activeMenuID } = this.state;
    let data = {};
    if (e.key === "1") {
      data.menu_cat_id = activeMenuCategoryId
        ? activeMenuCategoryId
        : restaurantDetail.menu.menu_categories[0].id;
      data.status = 1;
    } else if (e.key === "2") {
      data.business_profile_id = business_profile_id;
      data.menu_cat_id = activeMenuCategoryId
        ? activeMenuCategoryId
        : restaurantDetail.menu.menu_categories[0].id;
    } else {
      data.business_profile_id = business_profile_id;
      data.menu_id = activeMenuID
        ? activeMenuID
        : restaurantDetail.menu.menu_categories[0].menu_id;
      }
     
    this.props.bulkActionRestaurant(e.key, data, (res) => {
        
      if (res.status === 200) {
        if(e.key === "1"){
          
        this.props.enableLoading();
        // this.getServiceDetail(e.key);
        this.renderRestaurantDetail(restaurantDetail)
        }
        else{
            this.props.enableLoading();
          this.getServiceDetail();

        }
      }
    });
  };

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { restaurantDetail, activeMenuCategoryId } = this.state;
    if (
      restaurantDetail &&
      restaurantDetail.menu &&
      restaurantDetail.menu.menu_categories.length > 0 &&
      activeMenuCategoryId === null
    ) {
      this.setState({
        activeMenuCategoryId: restaurantDetail.menu.menu_categories[0].id,
      });
    }
    this.props.enableLoading();
    this.getServiceDetail();
    
  }

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = (val) => {
    const { loggedInUser } = this.props;
    const { restaurantDetail,menuId } = this.state;
    this.props.getRestaurantDetail(loggedInUser.id, "", (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let data = res.data && res.data.data;
        const item = data && data.menu;
        this.setState({ menuId: item.id });
        this.setState({ restaurantDetail: data, activeMenuCategoryId: data.menu.menu_categories[0].id });
      }
    });
  //   if(val == 1){
  //     const item =
  //     restaurantDetail && restaurantDetail.menu && restaurantDetail.menu.menu_categories;
  //     item.map((el) => {
  //       console.log(el,"el",el.menu_items,"menuoyeeee")
  //       el.menu_items.map((ele) => {
  //         this.toggleSwitch(restaurantDetail.is_active == 1 ? 1 : 0,ele.id)
  //       })
  //     })
  // }
  
  };

  /**
   * @method deleteMenuCategory
   * @description get service details
   */
  deleteMenuCategory = (categoryId) => {
    this.props.deleteRestaurantCategory(categoryId, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, res.data.message);
        this.props.enableLoading();
        this.getServiceDetail();
      }
    });
  };

  /**
   * @method deleteMenuItem
   * @description get service details
   */
  deleteMenuItem = (menuId) => {
    console.log("DElete Menu ITEM", menuId);
    this.props.deleteRestaurantMenu(menuId, (res) => {
      console.log(
        "🚀 ~ file: MenuListing.js ~ line 98 ~ MenuListing ~ this.props.deleteRestaurantCategory ~ res",
        res
      );
      if (res.status === 200) {
        toastr.success(langs.success, res.data.message);
        this.props.enableLoading();
        this.getServiceDetail();
      }
    });
  };

  // deleteExtra = (value) => {
  //   console.log(value,"%%%%")
  //   value.map((item)=> {
  //     console.log(item,"item%%%%")

  //   })
  //   // this.props.deleteExtraChoiceOfPreparation(id,(res) => {
  //   //   console.log(res,"deleteExtra")
  //   //   if (res.status === 200) {
  //   //     toastr.success(langs.success, res.data.message);
  //   //     this.props.enableLoading();
  //   //   }
  //   // })

  // }

  /**
   * @method updateMenuCategory
   * @description add menu categoty
   */
  updateMenuCategory = (value) => {
    const { visibleEditCat } = this.state;
    let requestData = {
      menu_cat_id: visibleEditCat,
      menu_category_name: value.menu_category_name,
    };
    this.props.updateMenuCategory(requestData, (res) => {
      console.log(
        "🚀 ~ file: MenuListing.js ~ line 143 ~ MenuListing ~ res",
        res
      );
      if (res.status === 200) {
        toastr.success(langs.success, res.data.message);
        this.setState({
          visibleEditCat: false,
          eitCatName: null,
        });
        this.props.enableLoading();
        this.getServiceDetail();
      }
    });
  };

  /**
   * @method updateMenu
   * @description add menu categoty
   */
  updateMenu = (value) => {
    console.log(value, "Valuesssssssss");
    const { toggleMenu } = this.state;
    let requestData = {
      menu_item_id: 320,
      name: "Veg Kebabs 333",
      details: 1212333,
      price: 333,
      is_active: 1,
      choice_of_preparation_ids: 317,
    };
    this.props.updateMenu(requestData, (res) => {
      console.log(
        "🚀 ~ file: MenuListing.js ~ line 143 ~ MenuListing ~ res",
        res
      );
      if (res.status === 200) {
        toastr.success(langs.success, res.data.message);
        this.getServiceDetail();
      }
    });
  };
  onChange = (checked, value) => {
    console.log(`switch to ${checked}`);
    let reqData = {
      wellbeing_service_id: value.id,
      name: value.name,
      duration: value.duration,
      price: value.price,
      more_info: "No Info",
      service_status: checked ? 1 : 0,
    };
    this.props.updateSpaServices(reqData, (res) => {
      if (res.status === 200) {
        toastr.success("service has been updated successfully.");
        this.getServiceDetail();
      }
    });
  };
  toggleSwitch = (updateMenu, checked) => {
    console.log(updateMenu, "updatedMenu");
    console.log(checked, "Checked");

    let requestData = {
      menu_item_id: checked,
      name: updateMenu.name,
      details: updateMenu.details,
      price: updateMenu.price,
      is_active: updateMenu === true ? 1 : 0,
      menu_items_choice_of_preparations:
        updateMenu.menu_items_choice_of_preparations,
    };
    this.props.updateMenu(requestData, (res) => {
      console.log(
        "🚀 ~ file: MenuListing.js ~ line 143 ~ MenuListing ~ res",
        res
      );
      if (res.status === 200) {
        toastr.success(langs.success, res.data.message);
        this.getServiceDetail();
      }
    });
  };

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  /**
   * @method beforeUpload
   * @description handle image Loading
   */
  beforeUpload(file) {
    console.log(file,"update,insert")
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG  & PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  handleRemoveImage = (file) => {
    this.setState({fileList:file});
    console.log("bck to initial state")
    // this.CreateRestaurantMenu();
  }

  /**
   * @method handleImageChange
   * @description handle Image change
   */
  handleImageChange = (info) => {
    const { id } = this.props.loggedInUser;
    console.log(info,"infooo")
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
      // formData.append("user_id", id);
      this.setState({
        fileList: info.file.originFileObj,
        
      });
      // this.props.createMenu(formData, (res) => {
      //   this.setState({ loading: false });
      //   if (res.status === 1) {
      //     toastr.success(
      //       langs.success,
      //       langs.messages.profile_image_update_success
      //     );
      //     // this.props.getUserProfile({ user_id: id });
      //     // this.props.getTraderProfile({ user_id: id });
      //     this.setState({
      //       imageUrl: res.data.image,
      //       loading: false,
      //     });
      //   }
      // });
    }
    
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    const { loggedInUser } = this.props;
    console.log("Values@@@@***********************", this.state.visibleEditCat);
    const { activeMenuCategoryId, restaurantDetail, fileList } = this.state;
    
    console.log(activeMenuCategoryId, "activeMenuId",fileList,"chhhh");
    let fmData = new FormData();
    values.choice_of_preparation.map((prepration, index2) => {
      console.log("Preparation", prepration);
      console.log("Index2", index2);
      //fmData.append(`choice_of_preparation[${index2 + 1}]`, prepration);
      fmData.append(
        `choice_of_preparation[${index2 + 1}]`,
        JSON.stringify(prepration)
      );
      console.log(
        "🚀 ~ file: MenuListing.js ~ line 341 ~ MenuListing ~ values.choice_of_preparation.map ~ prepration",
        prepration
      );
    });
 
    fmData.append("details", values.details);
    fmData.append("name", values.name);
    fmData.append("image", fileList);
    fmData.append("price", values.price);
    fmData.append(
      "menu_category_id",
      activeMenuCategoryId ? activeMenuCategoryId : null
    );

    this.props.enableLoading();
    this.props.createMenu(fmData, (res) => {
      if (res.status === 200) {

        fmData = new FormData();
        toastr.success(langs.success, MESSAGES.MENU_CREATE_SUCCESS);
        this.resetField();
        this.props.enableLoading();
        this.getServiceDetail();
        window.location.reload();
      }
    });
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  /**
   * @method onFinishEdit
   * @description handle on submit
   */

  onFinishEdit = (values) => {
    console.log(values, "valueeeeeeeeeessssssss");
    const { loggedInUser } = this.props;
    const { activeMenuCategoryId, restaurantDetail, fileList } = this.state;
    let fmData = new FormData();
    values.choice_of_preparation.map((prepration, index2) => {
      fmData.append(
        `choice_of_preparation[${index2 + 1}]`,
        JSON.stringify(prepration)
      );
    });
    fmData.append("menu_item_id", this.state.editMenuInitial.id);
    fmData.append("details", values.details);
    fmData.append("name", values.name);
    fmData.append("image", fileList);
    fmData.append("price", +values.price);
    fmData.append(
      "menu_category_id",
      activeMenuCategoryId
        ? activeMenuCategoryId
        : restaurantDetail.menu.menu_categories[0].id
    );
    this.props.updateMenu(fmData, (res) => {
      toastr.success(langs.success, res.data.message);
      if (res.status === 200) {
        toastr.success(langs.success, res.data.message);

        this.props.enableLoading();
        this.getServiceDetail();

        this.setState({
          editingmenu: false,
          editMenuInitial: null,
          fileList: [],
          selectedCategoryId: null,
        });
      }
    });
  };

  resetField = () => {
    this.formRef.current && this.formRef.current.resetFields();
  };

  editMenu = (menuItem) => {
    console.log(menuItem, "menuitemmm");
    let fileList = [
      {
        uid: "upload",
        name: "image.png",
        status: "done",
        isPrevious: true,
        url: `${menuItem.image}`,
        type: "image/jpeg",
        size: "1024",
      },
    ];
    this.setState({
      editingmenu: true,
      editMenuInitial: menuItem,
      selectedCategoryId: "edit",
      fileList,
    });
  };

  /**
   * @method CreateRestaurantMenu
   * @description update services
   */
  CreateRestaurantMenu = (categoryId) => {
    console.log(categoryId, "categoryyyiddddd");
    const {
      fileList,
      currentField,
      activePanel,
      selectedCategoryId,
      editingmenu,
      editMenuInitial,
      loading
    } = this.state;

    const { isAddMenu } = this.props;
    const uploadButton = (
      <div>
         {loading ? <LoadingOutlined /> : <PlusOutlined />}
        {/* <PlusOutlined /> */}
        <div className="ant-upload-text">Upload</div>
        <img
          src={require("../../../../assets/images/icons/upload-small.svg")}
          alt="upload"
        />
      </div>
    );
    console.log(
      "🚀 ~ file: MenuListing.js ~ line 398 ~ MenuListing ~ this.props.menuItem",
      this.props.menuItem
    );
    return (
      <>
        {!selectedCategoryId && (
          <div className="menu-header">
            <Row gutter={0} className="menu-header-inner">
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="item-col">
                {this.props.menuItem.length <= 0 ? "" : "Items"}
              </Col>
              <Col xs={9} sm={9} md={9} lg={9} xl={9} className="price-col">
                {this.props.menuItem.length <= 0 ? "" : "Price"}
              </Col>
              <Col xs={3} sm={3} md={3} lg={3} xl={3} className="btn-col">
                <Button
                  className="add-btn"
                  type="primary"
                  onClick={() =>
                    this.setState({ selectedCategoryId: categoryId })
                  }
                >
                  <PlusCircleOutlined />
                  Add Menu
                </Button>
              </Col>
            </Row>
          </div>
        )}
        {selectedCategoryId && (
          <Row gutter={0} className="add-menu-section">
            <div
              onClick={() =>
                this.setState({
                  selectedCategoryId: null,
                  editingmenu: false,
                  editMenuInitial: null,
                  fileList: [],
                })
              }
              className="close-btn"
            >
              <img
                src={require("../../../../assets/images/icons/close-btn-menu.svg")}
                alt=""
              />
            </div>
            {editingmenu ? (
              <Form
                onFinish={this.onFinishEdit}
                className="my-form"
                ref={this.formRef}
                id="restaurant-form"
                layout="vertical"
                initialValues={{
                  image: [],
                  name: editMenuInitial.name,
                  price: editMenuInitial.price,
                  details: editMenuInitial.details,
                  choice_of_preparation:
                    editMenuInitial.menu_items_choice_of_preparations,
                }}
              >
                <div className="restaurant-form-inner">
                  <Row gutter={0}>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                      <Form.Item name="image">
                        {fileList.length <= 0 ? (
                          <>
                            <Upload
                              name="image"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={true}
                              beforeUpload={this.beforeUpload}
                              onChange={this.handleImageChange}
                            >
                              {fileList ? null : uploadButton}
                            </Upload>

                            <label className="upload-label" >Add Photo</label>
                          </>
                        ) : (
                          <>
                            <img
                              src={fileList[0].url}
                              width="75px"
                              height="75px"
                              className="uploaded-thumb"
                            />
                            <div className="thumb-delete">
                              {/* <span>{el.original_name}</span> */}
                              <a
                                className="blue-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // this.beforeUpload();
                                  this.setState({ fileList: [] });
                                  
                                }}
                              >
                                
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.13788 13.3275C10.7087 13.3275 13.6034 10.4328 13.6034 6.862C13.6034 3.29119 10.7087 0.396484 7.13788 0.396484C3.56707 0.396484 0.672363 3.29119 0.672363 6.862C0.672363 10.4328 3.56707 13.3275 7.13788 13.3275ZM9.53472 5.37953C9.78721 5.12703 9.78721 4.71766 9.53472 4.46517C9.28222 4.21267 8.87285 4.21267 8.62035 4.46517L7.13788 5.94764L5.65541 4.46517C5.40291 4.21267 4.99354 4.21267 4.74104 4.46517C4.48855 4.71766 4.48855 5.12703 4.74104 5.37953L6.22352 6.862L4.74104 8.34448C4.48855 8.59697 4.48855 9.00634 4.74104 9.25884C4.99354 9.51133 5.40291 9.51133 5.65541 9.25884L7.13788 7.77636L8.62036 9.25884C8.87285 9.51133 9.28222 9.51133 9.53472 9.25884C9.78721 9.00634 9.78721 8.59697 9.53472 8.34448L8.05224 6.862L9.53472 5.37953Z"
                                    fill="black"
                                  />
                                </svg>
                              </a>
                            </div>
                          </>
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                      <Row gutter={10}>
                        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                          <Form.Item
                            label={"Item Name"}
                            name={"name"}
                            rules={[required("")]}
                          >
                            <Input placeholder="..." />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                          <Form.Item
                            label={"Price AUD"}
                            name={"price"}
                            rules={[{ validator: validNumber }]}
                          >
                            <Input placeholder="..." />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={0}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <Form.Item
                            label={"Description"}
                            name={"details"}
                            rules={[required("")]}
                          >
                            <TextArea placeholder="..." />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider className="marg-less" />
                      <Form.List name="choice_of_preparation">
                        {(choice_of_preparation, { add, remove }) => {
                          return (
                            <>
                              {choice_of_preparation.map(
                                (prepration, index2) => (
                                  <Row gutter={10}>
                                    <Col
                                      xs={24}
                                      sm={24}
                                      md={24}
                                      lg={16}
                                      xl={16}
                                      >
                                      {console.log(prepration,"dddddd##",index2,"index2")}
                                      <Form.Item
                                        {...prepration}
                                        label={
                                          index2 == 0
                                            ? [
                                                prepration.label,
                                                "Choice of preparation",
                                              ]
                                            : ""  
                                        }
                                        name={[prepration.name, "name"]}
                                        fieldKey={[prepration.fieldKey, "name"]}
                                        key={index2}
                                      >
                                        <Input placeholder="..." />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                      <Form.Item
                                        {...prepration}
                                        label={
                                          index2 == 0
                                            ? [prepration.label, "Price AUD"]
                                            : ""
                                        }
                                        name={[prepration.name, "price"]}
                                        fieldKey={[
                                          prepration.fieldKey,
                                          "price",
                                        ]}
                                        key={index2}
                                        rules={[
                                          { validator: validNumberCheck },
                                        ]}
                                      >
                                        <InputNumber
                                          className="price-number"
                                          placeholder="..."
                                          formatter={(value) =>
                                            `${value}`.replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ","
                                            )
                                          }
                                          parser={(value) =>
                                            value.replace(/\$\s?|(,*)/g, "")
                                          }
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                                      {index2 === 0 ? (
                                        <Form.Item className="mb-0 add-card-link-mb-0">
                                          <div className="align-right add-card-link fr-addbtn-icon">
                                            <Icon
                                              icon="add-circle"
                                              size="20"
                                              className="add-circ-conle"
                                              onClick={() => add()}
                                            />
                                          </div>
                                        </Form.Item>
                                      ) : (
                                        <Form.Item
                                          label={"t"}
                                          className="blank-label"
                                        >
                                          <MinusCircleOutlined
                                            className="edit-menu-remove"
                                            onClick={() => {
                                              remove(prepration.name); 
                                              // this.deleteExtra(this.props.menuItem)
                                            }}
                                          />
                                        </Form.Item>
                                      )}
                                    </Col>
                                  </Row>
                                )
                              )}
                            </>
                          );
                        }}
                      </Form.List>
                      <Divider className="marg-less" />
                      <div gutter={0} className="form-footer">
                        <div>
                          <Form.Item
                            style={{ paddingBottom: "30px" }}
                            className="add-card-link-mb-0"
                          >
                            <Button
                              size="middle"
                              type="primary"
                              className="clear-btn"
                              onClick={() => {
                                this.setState({
                                  editingmenu: false,
                                  editMenuInitial: null,
                                  fileList: [],
                                  selectedCategoryId: null,
                                });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="middle"
                              className="add-btn"
                              type="primary"
                              htmlType={"submit"}
                            >
                              Update
                            </Button>
                          </Form.Item>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Form>
            ) : (
              <Form
                onFinish={this.onFinish}
                className="my-form"
                ref={this.formRef}
                id="restaurant-form"
                layout="vertical"
                initialValues={{
                  image: [],
                  name: "",
                  price: "",
                  details: "",
                  choice_of_preparation: [{ name: "", price: "" }],
                }}
              >
                <div className="restaurant-form-inner">
                  <Row gutter={0}>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                      
                   <Form.Item name="image">
                        {console.log(
                          "🚀 ~ file: MenuListing.js ~ line 706 ~ MenuListing ~ fileList",
                          fileList
                        )}
                        
                        <Upload
                          name="image"
                          listType="picture-card"
                          className="avatar-uploader"
                          // fileList={fileList}
                          showUploadList={true}
                          beforeUpload={this.beforeUpload}
                          onChange={this.handleImageChange}
                          handleRemove={() => this.handleRemoveImage(fileList)}
                          // handleRemove={() => this.handleRemoveImage()}
                         
                        >

                         {fileList ? null : uploadButton}
                        </Upload>
                        {/* {this.state.image && <img src={this.state.url} />}
                        <input type="file" onChange={(event) => {
                            if (event.target.files && event.target.files[0]) {
                              let img = event.target.files[0];
                              console.log("🚀 ~ file: MenuListing.js ~ line 744 ~ MenuListing ~ img", img)
                              this.setState({
                                image: img,
                                // url: URL.createObjectURL(img)
                              });
                            }
                          }} /> */}
                        <label className="upload-label">Add Photo</label>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                      <Row gutter={10}>
                        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                          <Form.Item
                            label={"Item Name"}
                            name={"name"}
                            fieldKey={"name"}
                            rules={[required("")]}
                          >
                            <Input placeholder="..." />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                          <Form.Item
                            label={"Price AUD"}
                            name={"price"}
                            fieldKey={"price"}
                            rules={[{ validator: validNumber }]}
                          >
                            <Input placeholder="..." />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={0}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <Form.Item
                            label={"Description"}
                            name={"details"}
                            fieldKey={"details"}
                            rules={[required("")]}
                          >
                            <TextArea placeholder="..." />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider className="marg-less" />
                      <Form.List name="choice_of_preparation">
                        {(choice_of_preparation, { add, remove }) => {
                          return (
                            <>
                              {choice_of_preparation.map(
                                (prepration, index2) => (
                                  <Row gutter={10}>
                                    <Col
                                      xs={24}
                                      sm={24}
                                      md={24}
                                      lg={16}
                                      xl={16}
                                      className="custom-field"
                                    >
                                      <Form.Item
                                        {...prepration}
                                        label={
                                          index2 == 0
                                            ? [
                                                prepration.label,
                                                "Choice of preparation",
                                              ]
                                            : ""
                                        }
                                        name={[prepration.name, "name"]}
                                        fieldKey={[prepration.fieldKey, "name"]}
                                        key={index2}
                                      >
                                        <Input placeholder="..." />
                                      </Form.Item>
                                    </Col>
                                    <Col
                                      xs={24}
                                      sm={24}
                                      md={24}
                                      lg={6}
                                      xl={6}
                                      className="custom-field"
                                    >
                                      <Form.Item
                                        {...prepration}
                                        label={
                                          index2 == 0
                                            ? [prepration.label, "Price AUD"]
                                            : ""
                                        }
                                        name={[prepration.name, "price"]}
                                        fieldKey={[
                                          prepration.fieldKey,
                                          "price",
                                        ]}
                                        key={index2}
                                        rules={[
                                          { validator: validNumberCheck },
                                        ]}
                                      >
                                        <InputNumber
                                          className="price-number"
                                          placeholder="..."
                                          formatter={(value) =>
                                            `${value}`.replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ","
                                            )
                                          }
                                          parser={(value) =>
                                            value.replace(/\$\s?|(,*)/g, "")
                                          }
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                                      {index2 === 0 ? (
                                        <Form.Item className="mb-0 add-card-link-mb-0">
                                          <div className="align-right add-card-link fr-addbtn-icon">
                                            <Icon
                                              icon="add-circle"
                                              size="20"
                                              className="add-circ-conle"
                                              onClick={() => add()}
                                            />
                                          </div>
                                        </Form.Item>
                                      ) : (
                                        <Form.Item
                                          label={"t"}
                                          className="blank-label"
                                        >
                                          <MinusCircleOutlined
                                            className="edit-menu-remove"
                                            onClick={() => {
                                              remove(prepration.name);
                                            }}
                                          />
                                        </Form.Item>
                                      )}
                                    </Col>
                                  </Row>
                                )
                              )}
                            </>
                          );
                        }}
                      </Form.List>
                      <Divider className="marg-less" />
                      <div gutter={0} className="form-footer">
                        <div>
                          <Form.Item
                            style={{ paddingBottom: "30px" }}
                            className="add-card-link-mb-0"
                          >
                            <Button
                              size="middle"
                              type="primary"
                              className="clear-btn"
                              onClick={() => {
                                this.formRef.current.resetFields();
                              }}
                            >
                              Clear All
                            </Button>
                            <Button
                              size="middle"
                              className="add-btn"
                              type="primary"
                              htmlType={"submit"}
                            >
                              Add Menu
                            </Button>
                          </Form.Item>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Form>
            )}
          </Row>
        )}
      </>
    );
  };

  /**
   * @method addCategory
   * @description add menu categoty
   */
  addCategory = (value) => {
    console.log("VALUES", value);
    const { menuId } = this.state;
    let requestData = {
      menu_id: menuId,
      menu_category_name: value.menu_category_name,
    };
    this.props.AddMenuCategory(requestData, (res) => {
      if (res.status === 200) {
        
        toastr.success(langs.success, MESSAGES.MENU_CATEGORY_ADD_SUCCESS);
        this.myformRef.current &&
          this.myformRef.current.setFieldsValue({
            menu_category_name: null,
          });
        this.props.enableLoading();
        this.getServiceDetail();
      }
    });
  };

  /**
   * @method renderRestaurantDetail
   * @description render restaurant details
   */
  renderRestaurantDetail = (bookingDetail) => {
    console.log(bookingDetail, "bookingDetails");
    const { isEditFlag, visibleDelMenu } = this.state;
    const item =
      bookingDetail && bookingDetail.menu && bookingDetail.menu.menu_categories;
    let itemfinal;
    if (item && item.length) {
      itemfinal = item.filter((el, i) => {
        return +el.is_deleted === 0 ? null : el;
      });
    }
    if (item && item.length) {
      console.log(
        "🚀 ~ file: MenuListing.js ~ line 147 ~ MenuListing ~ item",
        item
      );
      return (
        <Tabs
          onChange={(e) => {
            console.log("eeee", e);

            this.setState({
              selectedCategoryId: null,
              activeMenuID: e,
              activeMenuCategoryId: e,
            });
          }}
        >
          {item.map((el, i) => {
            if (+el.is_deleted === 1) {
              return null;
            } else {
              
              return (
                <TabPane
                  tab={
                    <>
                      <span className="category-name">
                        {el.menu_category_name}
                      </span>
                      <span className="tab-actions">
                        {window.location.pathname === "/my-menu" && (
                          <Link
                         
                            className="tab-edit-icon"
                            onClick={() => {

                              this.setState({
                                visibleEditCat: el.id,
                                eitCatName: el.menu_category_name,
                              });
                            }}
                          >
                            <svg
                              width="12"
                              height="13"
                              viewBox="0 0 12 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 10.2924V12.7379H2.5L9.87332 5.5254L7.37332 3.07994L0 10.2924ZM11.8066 3.63425C12.0666 3.37992 12.0666 2.96908 11.8066 2.71476L10.2467 1.18879C9.98665 0.934465 9.56665 0.934465 9.30665 1.18879L8.08665 2.38217L10.5866 4.82763L11.8066 3.63425Z"
                                fill="#90A8BE"
                              />
                            </svg>
                          </Link>
                        )}
                        {/* <EditFilled
                          onClick={() => {
                            console.log("=================>", el);
                            this.setState({
                              visibleEditCat: el.id,
                              eitCatName: el.menu_category_name,
                            });
                          }}
                        /> */}
                        <Link
                          className="tab-delete-icon"
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("=======================>", el.id);
                            this.setState({
                              visibleDelCat: el.id,
                            });
                          }}
                        >
                          <svg
                            width="10"
                            height="12"
                            viewBox="0 0 10 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                              fill="#90A8BE"
                            />
                          </svg>
                        </Link>
                        {/* <DeleteFilled
                          onClick={() => {
                            this.deleteMenuCategory(el.id);
                          }}
                        /> */}
                      </span>
                    </>
                  }
                  key={el.id}
                >
                  {this.CreateRestaurantMenu(el.id)}
                  {/* <ListExample
                    listItem={el.menu_items}
                    updateMenu={(menu) => this.toggleSwitch(menu)}
                    editMenu={(menu) => this.editMenu(menu)}
                    deleteMenuItem={(id) => this.deleteMenuItem(id)}
                    invisible={true}
                  /> */}

                  <div className="menu-content">
                    {el.menu_items.map((item) => (
                      <Row gutter={0} className="menu-cell">
                        {console.log(el.menu_item,"dddddddd",el,"yyyyyyyyyyy",item,"uuuuuuuuuuu")}
                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                          <Avatar
                            shape="square"
                            src={item.image}
                            className="menu-thumb"
                          />
                        </Col>
                        <Col
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                          xl={10}
                          className="item-name-col"
                        >
                          <Text strong className="item-name">
                            {item.name}
                          </Text>
                          <br />
                          <Text className="item-details">{item.details}</Text>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                          <Text
                            strong
                            className="item-price"
                          >{`AU $${item.price}`}</Text>
                        </Col>
                        <Col
                          xs={4}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          className="switch-col"
                        >
                          <Switch
                            size="medium"
                            defaultChecked={item.is_active == 1 ? 1 : 0}
                            onChange={(menu) => this.toggleSwitch(menu,item.id)
                            }
                          />
                        </Col>
                        {/* <Col xs={2} sm={2} md={2} lg={2} xl={2}>
              <EditFilled />
            </Col> */}
                        <Col
                          xs={4}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          className="actions-col"
                        >
                          {/* <DeleteFilled
                onClick={() => {
                  console.log("============================>", item.id);
                  deleteMenuItem(item.id);
                }}
              /> */}
                          <svg
                            className="edit-menu"
                            onClick={() => this.editMenu(item)}
                            width="12"
                            height="13"
                            viewBox="0 0 12 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 10.2924V12.7379H2.5L9.87332 5.5254L7.37332 3.07994L0 10.2924ZM11.8066 3.63425C12.0666 3.37992 12.0666 2.96908 11.8066 2.71476L10.2467 1.18879C9.98665 0.934465 9.56665 0.934465 9.30665 1.18879L8.08665 2.38217L10.5866 4.82763L11.8066 3.63425Z"
                              fill="#90A8BE"
                            />
                          </svg>
                          <svg
                            className="delete-menu"
                            onClick={() => {
                              this.setState({ visibleDelMenu: item.id });
                            }}
                            width="10"
                            height="12"
                            viewBox="0 0 10 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                              fill="#90A8BE"
                            />
                          </svg>
                        </Col>
                        {/* <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                          <DeleteFilled
                            onClick={() => {
                              this.setState({
                                visibleDelMenu: item.id,
                              });
                            }}
                          />
                        </Col> */}
                      </Row>
                    ))}
                    {this.state.visibleDelMenu && (
                      <Modal
                        visible={this.state.visibleDelMenu}
                        layout="vertical"
                        className={"custom-modal style1 delete-menu-popup"}
                        footer={false}
                        onCancel={() =>
                          this.setState({ visibleDelMenu: false })
                        }
                      >
                        <div className="padding">
                          <svg
                            className="delete-icon"
                            width="21"
                            height="26"
                            viewBox="0 0 21 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.5 23.1111C1.5 24.7 2.85 26 4.5 26H16.5C18.15 26 19.5 24.7 19.5 23.1111V5.77778H1.5V23.1111ZM21 1.44444H15.75L14.25 0H6.75L5.25 1.44444H0V4.33333H21V1.44444Z"
                              fill="#E3E9EF"
                            />
                          </svg>
                          <Title level={3}>
                            Are you sure you want to delete this Menu?
                          </Title>
                          <div className="popup-footer">
                            <Button
                              className="clear-btn"
                              onClick={() =>
                                this.setState({
                                  visibleDelMenu: false,
                                })
                              }
                            >
                              No, Cancel
                            </Button>
                            <Button
                              className="orange-btn"
                              onClick={() => {
                                this.deleteMenuItem(visibleDelMenu);
                                this.setState({
                                  visibleDelMenu: false,
                                });
                              }}
                            >
                              Yes, Delete
                            </Button>
                          </div>
                        </div>
                      </Modal>
                    )}
                    {/* <List
          dataSource={currentPosts}
          renderItem={item => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  <Avatar src={item.image} />
                }
                title={<strong>{item.name}</strong>}
                description={item.details}
              />
              <div className="last-block"><strong>{`$${item.price}`}</strong>
                {invisible === undefined &&
                  <React.Fragment>
                    <button onClick={() => this.handleOnClick(item)}>
                      <img width='15px' src={require('../../../assets/images/add-color.png')} ></img>
                    </button>
                  </React.Fragment>
                }
              </div>
            </List.Item>
          )}
        > 
        </List>*/}
                    {/* <Pagination postPerPage={postPerPage} totalPost={data.length} paginate={(number) => this.setState({currentPage: number})} /> */}
                    {/* {data.length > 12 && <Pagination
          defaultCurrent={1}
          defaultPageSize={12} //default size of page
          onChange={this.handlePageChange}
          total={data.length} //total number of card data available
          itemRender={itemRender}
          className={'mb-20'}
        />} */}
                  </div>
                </TabPane>
              );
            }
          })}
        </Tabs>
      );
    } else {
      return (
        <Card className="restaurant-tab test no-category">No Category add</Card>
      );
    }
  };

  render() {
    const {
      visible,
      visibleEditCat,
      eitCatName,
      isEditFlag,
      restaurantDetail,
      visibleDelCat,
    } = this.state;

    console.log(restaurantDetail, "restaurantDetail");
    const menu = (
      <Menu className="bulk-action-menu" onClick={this.handleMenuClick}>
        <Menu.Item key="1">Activate All Items</Menu.Item>
        <Menu.Item key="2">Delete All Items</Menu.Item>
        <Menu.Item key="3">Delete All Category</Menu.Item>
      </Menu>
    );

    return (
      <>
        <Row>
          <Form
            onFinish={this.addCategory}
            layout={"vertical"}
            ref={this.myformRef}
            className="select-category-block mb-30"
          >
            <Row gutter={10}>
              <Title level={4}>Menu Categories</Title>
              <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                <Form.Item name="menu_category_name" rules={[required("")]}>
                  <Input placeholder="Enter Category Name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item>
                  <Button
                    className="add-btn-md"
                    type="primary"
                    htmlType="submit"
                    size="large"
                  >
                    Add Category
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Row>
        <Row gutter={[38, 38]}>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Card className="restaurant-tab">
              {this.renderRestaurantDetail(restaurantDetail)}
            </Card>
          </Col>
        </Row>
        <Row md={24}>
          <Col md={21}></Col>
          <Col md={3}>
            <Dropdown
              overlay={menu}
              className="mt-25 mb-25 bulk-dropdown-action"
            >
              <Button>
                Bulk Actions <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        {visibleEditCat && (
          <Modal
            title="Edit Menu Category"
            visible={visibleEditCat}
            layout="vertical"
            className={"custom-modal style1 edit-menu-category-popup"}
            footer={false}
            onCancel={() =>
              this.setState({ visibleEditCat: false, eitCatName: null })
            }
          >
            <div className="padding">
              <Form {...layout} onFinish={this.updateMenuCategory}>
                <Form.Item
                  label=""
                  name="menu_category_name"
                  rules={[required("")]}
                >
                  <Input className="shadow-input " defaultValue={eitCatName} />
                </Form.Item>
                <Form.Item className="custom-add-menu-type">
                  <Button
                    className="clear-btn"
                    onClick={() =>
                      this.setState({
                        visibleEditCat: false,
                        eitCatName: null,
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button htmlType="submit" className="orange-btn">
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        )}
        {visibleDelCat && (
          <Modal
            visible={visibleDelCat}
            layout="vertical"
            className={
              "custom-modal style1 delete-menu-popup delete-category-popup"
            }
            footer={false}
            onCancel={() => this.setState({ visibleDelCat: false })}
          >
            <div className="padding">
              <svg
                className="delete-icon"
                width="21"
                height="26"
                viewBox="0 0 21 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 23.1111C1.5 24.7 2.85 26 4.5 26H16.5C18.15 26 19.5 24.7 19.5 23.1111V5.77778H1.5V23.1111ZM21 1.44444H15.75L14.25 0H6.75L5.25 1.44444H0V4.33333H21V1.44444Z"
                  fill="#E3E9EF"
                />
              </svg>
              <Title level={3}>
                Are you sure you want to delete this category?
              </Title>
              <Title level={4}>
                Any menu in this category will also be deleted
              </Title>
              <div className="popup-footer">
                <Button
                  className="clear-btn"
                  onClick={() =>
                    this.setState({
                      visibleDelCat: false,
                    })
                  }
                >
                  No, Cancel
                </Button>
                <Button
                  className="orange-btn"
                  onClick={() => {
                    this.deleteMenuCategory(visibleDelCat);
                    this.setState({
                      visibleDelCat: false,
                    });
                  }}
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  createMenu,
  enableLoading,
  disableLoading,
  getRestaurantDetail,
  deleteRestaurantCategory,
  deleteRestaurantMenu,
  updateMenuCategory,
  updateMenu,
  bulkActionRestaurant,
  AddMenuCategory,
  deleteExtraChoiceOfPreparation,
})(MenuListing);

