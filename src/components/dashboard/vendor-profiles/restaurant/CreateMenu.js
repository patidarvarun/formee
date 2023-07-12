import React from "react";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm } from "redux-form";
import { Link, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
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
  Menu,
  Dropdown,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import NoContentFound from "../../../common/NoContentFound";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import {
  getRestaurantDetail,
  AddMenuCategory,
  createMenu,
  enableLoading,
  disableLoading,
  getAllMenucategories,
  renderRestaurantDetail
} from "../../../../actions";
import Icon from "../../../customIcons/customIcons";
import {
  required,
  validNumber,
  validNumberCheck,
} from "../../../../config/FormValidation";
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import ListExample from "../../../booking/common/List";
import "../../vendor-profiles/myprofilerestaurant.less";
import TextArea from "antd/lib/input/TextArea";
import MenuListing from "./MenuListing";
import MenuItem from "antd/lib/menu/MenuItem";
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;
const { Panel } = Collapse;
class CreateMenu extends React.Component {
  formRef = React.createRef();
  myformRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      restaurantDetail: [],
      fileList: [],
      itemId: "",
      menuCategory: [],
      categoryId: "",
      submitFromOutside: false,
      menuId: "",
      currentField: "",
      activePanel: 1,
      menuItem: [],
    };
  }

  /**
   * @method componentWillMount
   * @description called after render the component
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getServiceDetail();
  }

  /**
   * @method componentDidUpdate
   * @description called to submit form
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.submitFromOutside !== this.props.submitFromOutside) {
      this.resetField();
    }
  }

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => { 
    const { loggedInUser } = this.props;
    this.props.getRestaurantDetail(loggedInUser.id, "", (res) => {
      console.log(res,"eesssssss")
      this.props.disableLoading();
      if (res.status === 200) {
        let data = res.data && res.data.data;
        const item = data && data.menu;
        const menuCategory =
        item &&
        item.menu_categories &&
        Array.isArray(item.menu_categories) &&
        item.menu_categories.length
        ? item.menu_categories[0]
        : [];
        let menuItem =
        menuCategory.menu_items &&
        Array.isArray(menuCategory.menu_items) &&
        menuCategory.menu_items.length
        ? menuCategory.menu_items
        : [];
        console.log(menuItem,"menuItem %%%%")
        this.setState({ menuId: item.id, menuItem: menuItem });
        this.props.getAllMenucategories(item.id, (res) => {
          if (res.status === 200) {
            let data = res.data && res.data.data;
            let menuCategory =
            data && Array.isArray(data) && data.length ? data : [];
            this.setState({ menuCategory: menuCategory });
          }
        });
      }
    });
  };

  resetField = () => {
    this.formRef.current && this.formRef.current.resetFields();
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    const { categoryId } = this.state;
    const { isAddMenu } = this.props;
    let requestData = [];
    this.props.enableLoading();
    if (values.menu && values.menu.length) {
      values.menu.map((el, i) => {
        requestData.push({
          image: el.image ? el.image.file.originFileObj : "",
          menu_category_id: categoryId,
          name: el["name"],
          price: el["price"],
          details: el["details"],
          choice_of_preparation: el.choice_of_preparation
            ? [
                ...el.choice_of_preparation,
                {
                  name: el["preperation_name"],
                  price: el["preperation_price"],
                },
              ]
            : [
                {
                  name: el["preperation_name"],
                  price: el["preperation_price"],
                },
              ],
        });
      });
    }

    const formData = new FormData();
    requestData &&
      requestData.length &&
      requestData.map((el, i) => {
        Object.keys(el).forEach((key) => {
          if (key === "image") {
            formData.append(`menuitems[${i + 1}][image]`, el[key]);
          } else if (key === "details") {
            formData.append(`menuitems[${i + 1}][details]`, el[key]);
          } else if (key === "name") {
            formData.append(`menuitems[${i + 1}][name]`, el[key]);
          } else if (key === "price") {
            formData.append(`menuitems[${i + 1}][price]`, el[key]);
          } else if (key === "menu_category_id") {
            formData.append(`menuitems[menu_category_id]`, el[key]);
          } else if (key === "choice_of_preparation") {
            el.choice_of_preparation &&
              el.choice_of_preparation.length &&
              el.choice_of_preparation.map((item, index) => {
                Object.keys(item).forEach((itemKey) => {
                  if (itemKey === "name") {
                    formData.append(
                      `menuitems[${i + 1}][choice_of_preparation][${
                        index + 1
                      }][name]`,
                      item[itemKey]
                    );
                  } else if (itemKey === "price") {
                    formData.append(
                      `menuitems[${i + 1}][choice_of_preparation][${
                        index + 1
                      }][price]`,
                      item[itemKey]
                    );
                  }
                });
              });
          }
        });
      });

    this.props.createMenu(formData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MENU_CREATE_SUCCESS);
        if (isAddMenu) {
          this.props.history.push("/my-menu");
        } else {
          this.props.nextStep();
        }
        this.resetField();
      }
    });
  };

  /**
   * @method dummyRequest
   * @description dummy image upload request
   */
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  /**
   * @method handleImageChange
   * @description handle image change
   */
  handleImageChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG  & PNG file!");
      return false;
    } else if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    } else if (fileList.length > 1) {
      message.error("You can upload only one image");
      return false;
    } else {
      this.setState({ fileList });
    }
  };

  /**
   * @method CreateRestaurantMenu
   * @description update services
   */
  CreateRestaurantMenu = (categoryId) => {
    const { fileList, currentField, activePanel, selectedCategoryId } =
      this.state;
    const { isAddMenu } = this.props;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
        <img
          src={require("../../../../assets/images/icons/upload-small.svg")}
          alt="upload"
        />
      </div>
    );
    return (
      <></>
      // <MenuListing categoryId={categoryId}/>
      // <div className="restaurant-content-block">
      //   {!selectedCategoryId &&
      //     (
      //       <Row gutter={0}>
      //         <Col xs={12} sm={12} md={12} lg={12} xl={12}>
      //           Items
      //         </Col>
      //         <Col xs={4} sm={4} md={4} lg={4} xl={4}>
      //           Price
      //         </Col>
      //         <Col xs={8} sm={8} md={8} lg={8} xl={8}>
      //           <Button
      //             className="add-btn"
      //             type='primary'
      //             onClick={() => this.setState({ selectedCategoryId: categoryId })}
      //           ><PlusCircleOutlined />
      //             Add Menu
      //           </Button>
      //         </Col>
      //       </Row>
      //     )
      //   }
      //   { selectedCategoryId &&
      //     (<>
      //       <div onClick={() => this.setState({ selectedCategoryId: null })}><CloseOutlined /></div>
      //       <Form
      //         onFinish={this.onFinish}
      //         className="my-form"
      //         id='restaurant-form'
      //         ref={this.formRef}
      //         layout='vertical'
      //         initialValues={{
      //           name: 'menu',
      //           menu: [{ image: '', name: "", price: "", details: '', preperation_name: '', preperation_price: '' }],
      //           choice_of_preparation: [{ name: '', price: '' }]
      //         }}
      //       >
      //         <Form.List name="menu">
      //           {(fields, { add, remove }) => {
      //             let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
      //             return (
      //               // <div>
      //               <Collapse
      //                 // accordion
      //                 activeKey={activePanel}
      //                 onChange={(e) => {
      //                   if (e[e.length - 1] == undefined) {
      //                     this.setState({ activePanel: 1 })
      //                   } else {
      //                     this.setState({ activePanel: (e[e.length - 1]) })
      //                   }
      //                 }}
      //               >
      //                 {fields.map((field, index) => (
      //                   <Panel key={field.fieldKey + 1} header={currentField && currentField.menu && currentField.menu[field.key] && currentField.menu[field.key].name ? currentField.menu[field.key].name : ''}>
      //                     <div key={field.key}>
      //                       <Row gutter={30} >
      //                         <Col xs={24} sm={24} md={24} lg={3} xl={3}>
      //                           <Form.Item
      //                             name={[field.name, "image"]}
      //                             fieldKey={[field.fieldKey, "image"]}
      //                             rules={[required('')]}
      //                           >
      //                             <Upload
      //                               name='image'
      //                               listType='picture-card'
      //                               className='avatar-uploader'
      //                               showUploadList={true}
      //                               fileList={currentField && currentField.menu[field.key] && currentField.menu[field.key].image ? currentField.menu[field.key].image.fileList : []}
      //                               customRequest={this.dummyRequest}
      //                               onChange={({ file, fileList }) => {
      //                                 let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
      //                                 let image = currentField && currentField.menu[field.key] && currentField.menu[field.key].image ? currentField.menu[field.key].image.file : ''
      //                                 const isJpgOrPng = image && image.type === 'image/jpeg' || image && image.type === 'image/png' || file.type === 'image/jpg';
      //                                 const isLt2M = image && image.size / 1024 / 1024 < 2;
      //                                 if (!isJpgOrPng) {
      //                                   message.error('You can only upload JPG , JPEG  & PNG file!');
      //                                   return false
      //                                 } else if (!isLt2M) {
      //                                   message.error('Image must smaller than 2MB!');
      //                                   return false
      //                                 } else {
      //                                   this.setState({ currentField: currentField, categoryId: categoryId })
      //                                 }
      //                               }}
      //                             >
      //                               {currentField && currentField.menu[field.key] && currentField.menu[field.key].image && currentField.menu[field.key].image.fileList.length >= 1 ? null : uploadButton}

      //                             </Upload>
      //                             <label className="upload-label">Add Photo</label>
      //                           </Form.Item>
      //                         </Col>
      //                         <Col xs={24} sm={24} md={24} lg={21} xl={21}>
      //                           <Row gutter={10}>
      //                             <Col xs={24} sm={24} md={24} lg={16} xl={16}>
      //                               <Form.Item
      //                                 label={[field.label, "Item Name"]}
      //                                 name={[field.name, "name"]}
      //                                 fieldKey={[field.fieldKey, "name"]}
      //                                 rules={[required('')]}
      //                               >
      //                                 <Input placeholder="..." />
      //                               </Form.Item>
      //                             </Col>
      //                             <Col xs={24} sm={24} md={24} lg={8} xl={8}>
      //                               <Form.Item
      //                                 label={[field.label, "Price AUD"]}
      //                                 name={[field.name, "price"]}
      //                                 fieldKey={[field.fieldKey, "price"]}
      //                                 rules={[{ validator: validNumber }]}
      //                               >
      //                                 <Input placeholder="..." />
      //                               </Form.Item>
      //                             </Col>
      //                           </Row>
      //                           <Row gutter={10}>
      //                             <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      //                               <Form.Item
      //                                 label={[field.label, "Description"]}
      //                                 name={[field.name, "details"]}
      //                                 fieldKey={[field.fieldKey, "details"]}
      //                                 rules={[required('')]}
      //                               >
      //                                 <TextArea placeholder="..." />
      //                               </Form.Item>
      //                             </Col>
      //                           </Row>
      //                           <Divider className="marg-less" />
      //                           <Row gutter={10}>
      //                             <Col xs={24} sm={24} md={24} lg={16} xl={16}>
      //                               <Form.Item
      //                                 label={[field.label, "Choice of preparation"]}
      //                                 name={[field.name, "preperation_name"]}
      //                                 fieldKey={[field.fieldKey, "preperation_name"]}
      //                               // rules={[required('')]}
      //                               >
      //                                 <Input placeholder="..." />
      //                               </Form.Item>
      //                             </Col>
      //                             <Col xs={24} sm={24} md={24} lg={6} xl={6}>
      //                               <Form.Item
      //                                 label={[field.label, "Price AUD"]}
      //                                 name={[field.name, "preperation_price"]}
      //                                 fieldKey={[field.fieldKey, "preperation_name"]}
      //                                 rules={[{ validator: validNumberCheck }]}
      //                               >
      //                                 <InputNumber
      //                                   className="price-number"
      //                                   placeholder="..."
      //                                   formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      //                                   parser={value => value.replace(/\$\s?|(,*)/g, '')}
      //                                 />
      //                               </Form.Item>
      //                             </Col>
      //                             {/* <Col xs={24} sm={24} md={24} lg={2} xl={2}>
      //                               <Form.Item className="mb-0 add-card-link-mb-0">
      //                                 <div className='align-right add-card-link fr-addbtn-icon'>
      //                                   <Icon icon='add-circle' size='20' className='add-circ-conle'
      //                                     onClick={() => add()}
      //                                   />
      //                                 </div>
      //                               </Form.Item>
      //                             </Col> */}
      //                           </Row>
      //                           <Form.List name={[field.fieldKey, "choice_of_preparation"]}>
      //                           {(choice_of_preparation, { add, remove }) => {
      //                               return (
      //                                 <>
      //                                   {choice_of_preparation.map((prepration, index2) => (
      //                                     <Row gutter={10}>
      //                                       <Col xs={24} sm={24} md={24} lg={16} xl={16}>
      //                                         <Form.Item
      //                                           {...prepration}
      //                                           label={[prepration.label, "Choice of preparation"]}
      //                                           name={[prepration.name, "name"]}
      //                                           fieldKey={[prepration.fieldKey, "name"]}
      //                                           key={index2}
      //                                         // rules={[required('')]}
      //                                         >
      //                                           <Input placeholder="Choice of preparation" />
      //                                         </Form.Item>
      //                                       </Col>
      //                                       <Col xs={24} sm={24} md={24} lg={6} xl={6}>
      //                                         <Form.Item
      //                                           {...prepration}
      //                                           label={[prepration.label, "Price AUD"]}
      //                                           name={[prepration.name, "price"]}
      //                                           fieldKey={[prepration.fieldKey, "price"]}
      //                                           key={index2}
      //                                           rules={[{ validator: validNumberCheck }]}
      //                                         >
      //                                           <InputNumber
      //                                             className="price-number"
      //                                             placeholder="Price"
      //                                             formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      //                                             parser={value => value.replace(/\$\s?|(,*)/g, '')}
      //                                           />
      //                                         </Form.Item>
      //                                       </Col>
      //                                       <Col xs={40} sm={40} md={24} lg={2} xl={2}>
      //                                         <Form.Item
      //                                           label={"t"}
      //                                           className="blank-label"
      //                                         >
      //                                           <MinusCircleOutlined
      //                                             className="edit-menu-remove"
      //                                             onClick={() => {
      //                                               remove(prepration.name);
      //                                             }}
      //                                           />
      //                                         </Form.Item>
      //                                       </Col>
      //                                     </Row>
      //                                   ))}
      //                                   <Divider className="marg-less" />
      //                                   <Form.Item className="mb-0 add-card-link-mb-0">
      //                                     <div className='align-right add-card-link fr-addbtn-icon'>
      //                                       <Icon icon='add-circle' size='20' className='add-circ-conle'
      //                                         onClick={() => add()}
      //                                       />
      //                                     </div>
      //                                   </Form.Item>
      //                                 </>
      //                               );
      //                                 }}
      //                           </Form.List>
      //                           {field.key !== 0 && <Col flex="none">
      //                             <MinusCircleOutlined
      //                               className="dynamic-delete-button"
      //                               title={'Add More'}
      //                               onClick={() => { this.setState({ inputVisible: false }, () => remove(field.name)) }}
      //                             />
      //                           </Col>}
      //                         </Col>
      //                       </Row>
      //                     </div>
      //                   </Panel>
      //                 ))}

      //                 <Row gutter={0}>
      //                   <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ marginLeft: "20.83333333%" }}>

      //                     <Form.Item style={{ paddingBottom: "30px" }} className="add-card-link-mb-0">
      //                       <Button
      //                         size="middle"
      //                         type='primary'
      //                         className="add-btn"
      //                         onClick={() => {
      //                           let currentField = this.formRef.current.getFieldsValue()
      //                           this.setState({ activePanel: currentField.menu.length + 1 }, () => add())
      //                         }}
      //                       >
      //                       Add
      //                       </Button>
      //                       <Button
      //                         size="middle"
      //                         className="add-btn"
      //                         type='primary'
      //                         onClick={() => this.setState({ categoryId: categoryId })}
      //                         htmlType={'submit'}
      //                       >
      //                         SAVE
      //                       </Button>
      //                     </Form.Item>

      //                   </Col>
      //                 </Row>
      //               </Collapse>
      //             );
      //           }}
      //         </Form.List>

      //       </Form>
      //     </>)
      //   }
      // </div>
    );
  };

  /**
   * @method renderMenuCategory
   * @description render menu category list on tab
   */
  renderMenuCategory = (item) => {
    if (item && item.length) {
      return (
        <Tabs onChange={() => this.setState({ selectedCategoryId: null })}>
          {item.map((el, i) => {
            return (
              <TabPane
                tab={
                  <>
                    <span>{el.menu_category_name}</span>
                    <i
                      className="trash-icon"
                      onClick={() => {
                        console.log("menu ID ", el.menu_category_id);
                      }}
                    >
                      <svg
                        width="10"
                        height="13"
                        viewBox="0 0 10 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.666665 10.8089C0.666665 11.5263 1.26666 12.1132 2 12.1132H7.33332C8.06665 12.1132 8.66665 11.5263 8.66665 10.8089V2.98348H0.666665V10.8089ZM9.33331 1.02712H6.99998L6.33332 0.375H2.99999L2.33333 1.02712H0V2.33136H9.33331V1.02712Z"
                          fill="#C2CFE0"
                        />
                      </svg>
                    </i>
                  </>
                }
                key={i}
              >
                {this.CreateRestaurantMenu(el.menu_category_id)}
                {/* <ListExample listItem={el.menu_items} invisible={true} /> */}
              </TabPane>
            );
          })}
        </Tabs>
      );
    } else {
      return (
        <Card className="restaurant-tab test no-category">No Category add</Card>
      );
    }
  };



  /**
   * @method onClear All Event Cleares all screen
   * @description clear all fields
   */
  onClearAll = () => {
    this.formRef.current.setFieldsValue({
      menu_category_name: "",
      name: "",
      price: "",
      details: "",
      preperation_name: "",
      preperation_price: "",
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { menuCategory, menuItem } = this.state;
    console.log("🚀 ~ file: CreateMenu.js ~ line 660 ~ CreateMenu ~ render ~ menuItem", menuItem)
    console.log("🚀 ~ file: CreateMenu.js ~ line 660 ~ CreateMenu ~ render ~ menuCategory", menuCategory)
    const { isAddMenu } = this.props;
    return (
      <div className="create-menu profile-beauty-service">
        {/* <Paragraph>File can be upto 2 MB for file types .pdf .jpeg .png .bmp</Paragraph> */}
        
        {/* {this.renderMenuCategory(menuCategory)} */}
        <MenuListing menuItem={menuItem}/>
        {/* <div className="restaurent-profile-content-box">
          <Row gutter={[38, 38]} >
            {/* {isAddMenu === undefined && menuItem && menuItem.length !== 0 &&
              <Link
                onClick={() => this.props.nextStep()}
                className='skip-link uppercase'
                style={{ marginTop: '100px', marginRight: '100px' }} >Skip</Link>
            } 
            <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card
                className='restaurant-tab test'
              >
                {this.renderMenuCategory(menuCategory)}
              </Card>
            </Col>
          </Row>
          <Row gutter={[38, 38]} className="added-categories-block">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Row gutter={[38, 38]} className="added-categories-row">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Row>
                    <Col
                      xs={4}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      className="category-thumb"
                    >
                      <img
                        src="http://devformee.mangoitsol.com/formee/plugins/admin/dist/img/IMG_20200115_160859.JPG"
                        alt=""
                      />
                    </Col>
                    <Col
                      xs={20}
                      sm={20}
                      md={20}
                      lg={20}
                      xl={20}
                      className="category-item"
                    >
                      <h4>Takoyaki</h4>
                      <p>
                        Light egg dumplings with an octopus centre served with
                        dipping sauce
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  className="category-price"
                >
                  AU $40
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  className="category-switch"
                >
                  <Switch size="small" defaultChecked />
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  className="category-actions"
                >
                  <EditFilled />
                  <DeleteFilled />
                </Col>
              </Row>
            </Col>
            </Row>

        </div> */}
        {/* <Divider className="mb-30" /> */}
        <div className="step-button-block">
          <Button
            htmlType="submit"
            type="primary"
            size="middle"
            onClick={() => this.props.previousStep()}
          >
            Previous Step
          </Button>
          {isAddMenu ? (
            <Button
              htmlType="submit"
              type={"default"}
              danger
              size="large"
              className="text-white"
              form={"restaurant-form"}
              style={{ backgroundColor: "#EE4929" }}
            >
              Save
            </Button>
          ) : (
            <Button
              type="primary"
              size="middle"
              className="btn-blue"
              htmlType={"submit"}
              form={"restaurant-form"}
              // disabled={menuCategory.length <= 0 || menuItem.length <= 0 ? true : false}
              onClick={() => this.props.nextStep()}
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
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
  getRestaurantDetail,
  AddMenuCategory,
  createMenu,
  enableLoading,
  disableLoading,
  getAllMenucategories,
})(withRouter(CreateMenu));
