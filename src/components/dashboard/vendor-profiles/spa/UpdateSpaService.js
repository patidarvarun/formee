import React, { useRef, useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import TextArea from "antd/lib/input/TextArea";
import { EditOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons";
import {
  InputNumber,
  Collapse,
  message,
  Upload,
  Select,
  Input,
  Space,
  Form,
  Switch,
  Divider,
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
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import NoContentFound from "../../../common/NoContentFound";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import {
  createSpaServices,
  enableLoading,
  disableLoading,
  getTraderProfile,
  getBookingSubcategory,
  activateAndDeactivateService,
  updateSpaServices,
  getSpaServices,
  updateServiceCategory,
  deleteServices,
  getServiceCategory,
  removeService,
  bulkActionWellbeing,
} from "../../../../actions";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../../config/Config";
import Icon from "../../../customIcons/customIcons";
import { convertHTMLToText } from "../../../common";
import { required, validNumber } from "../../../../config/FormValidation";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import "../../vendor-profiles/myprofilerestaurant.less";
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;
const rules = [required("")];
const { Panel } = Collapse;

const SpaForm = (props) => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const editRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [activeFlag, setActiveFlag] = useState(langs.key.all);
  const [services, setServices] = useState([]);
  const [BeautyService, setBeautyServices] = useState([]);
  const [isEditFlag, setEditFlag] = useState(false);
  const [durationOption, setDuration] = useState([]);
  const [itemInfo, setItemInfo] = useState("");
  const [serviceInfo, setServiceInfo] = useState("");
  const [fileList, setFileList] = useState("");
  const [Id, setId] = useState("");
  const [activePanel, setActivePanel] = useState(1);
  const [editService, setEditService] = useState(null);
  const [editServicedetails, setEditServiceDetails] = useState(null);
  const [valuee, setValue] = useState("");
  const [activeServiceCategoryId, setActiveServiceCategoryId] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [editCategorydetails, setEditCategoryDeatils] = useState(null);
  // const [createDynamicInput, setcreateDynamicInput] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const { userDetails } = props;
    const { id, user_type } = props.loggedInUser;
    let temp = [];
    for (let i = 30; i <= 240; i = i + 30) {
      temp.push(i);
    }
    setDuration(temp);
    getServiceDetail();
  }, [props]);

  // function handleInputChange(event) {
  //   setInputValue(event.target.value);
  // }
  /**
   * @method getServiceDetail
   * @description get service details
   */
  const handleMenuClick = (e) => {
    const { trader_profile_id, id } = props.loggedInUser;
    let data = {};
    data.user_id = id;
    data.trader_user_profile_id = trader_profile_id;
    data.service_category_id = activeServiceCategoryId;
    if (e.key === "1") {
      data.user_id = id;
      data.trader_user_profile_id = trader_profile_id;
      data.service_category_id = activeServiceCategoryId;
      data.status = "Activate"; //Deactivate
    } else if (e.key === "2") {
      data.user_id = id;
      data.trader_user_profile_id = trader_profile_id;
      data.service_category_id = activeServiceCategoryId;
    } else {
      data.user_id = id;
    }
    props.bulkActionWellbeing(e.key, data, (res) => {
      if (res.status === 200) {
        // window.location.reload();
        if (props.loggedInUser.user_type === "beauty") {
          props.history.push("/services");
        } else {
          props.history.push("/vendor-services");
        }
        getServiceDetail();
      }
    });
  };
  const onClick = () => {
    setShowStatements(true);
    setHidden(true);
  };

  const main = () => {
    if (props.loggedInUser.user_type === "beauty") {
      props.history.push("/services");
    } else {
      props.history.push("/vendor-services");
    }
  };

  const getServiceDetail = () => {
    const { loggedInUser, isCreateService, getServiceCategory } = props;
    let id = props.match.params.id;
    // props.enableLoading()
    props.getServiceCategory(loggedInUser.trader_profile_id, (res) => {
      props.disableLoading();
      if (res.status === 200) {
        let data = res.data && res.data.data;
        let services = data ? data : [];
        // data &&
        // Array.isArray(data.wellbeing_trader_service) &&
        // data.wellbeing_trader_service.length
        //   ? data.wellbeing_trader_service
        //   : [];
        let tmp;
        services.map((service) => {
          if (service.status == 1 && !tmp) {
            tmp = service.id;
          }
        });
        setActiveServiceCategoryId(tmp);
        setServices(services);
        let selectedService = services.filter((el) => el.id == id);
        // getItemDetail(selectedService[0]);
      }
    });
  };

  const getItemDetail = (el) => {
    // this.State({ setServiceInfo: el });
    setServiceInfo(el);
    setEditService(el.id);
    let currentValue = formRef.current && formRef.current.getFieldsValue();

    if (currentValue) {
      currentValue.services[0].more_info = el.more_info;
      currentValue.services[0].name = el.name;
      currentValue.services[0].duration = el.duration;
      currentValue.services[0].price = el.price;
      formRef.current &&
        formRef.current.setFieldsValue({
          currentValue,
        });
    }
  };

  const onChange = (checked, value) => {
    console.log(`switch to ${checked}`);

    let reqData = {
      wellbeing_service_id: value.id,
      name: value.name,
      duration: value.duration,
      price: value.price,
      more_info: "No Info",
      service_status: checked ? 1 : 0,
    };
    props.updateSpaServices(reqData, (res) => {
      if (res.status === 200) {
        toastr.success("service has been updated successfully.");
        getServiceDetail();
      }
    });
  };

  const deleteService = (id) => {
    props.removeService(id, (res) => {
      if (res.status === 200) {
        console.log("Deletelelelel");
        toastr.success("Service has been removed successfully.");
        getServiceDetail();
      }
    });
  };

  /**
   * @method renderUserServices
   * @description render service details
   */
  const renderUserServices = (item) => {
    let service = [];

    // if (serviceInfo && serviceInfo.id) {
    service = item && Array.isArray(item) && item;
    // item.filter((el) => el.id !== serviceInfo.id);
    // } else {
    service = item;
    // }
    if (service && service.length) {
      return (
        service &&
        Array.isArray(service) &&
        service.map((el, i) => {
          return (
            <tr key={i}>
              <td colspan="2">
                <div className="title">
                  {/* <Text>{el.name}</Text> */}
                  <h4>{el.name}</h4>
                  <span>{el.duration} minutes</span>
                </div>
                {/* <div className="subtitle">{`${el.more_info}`}</div> */}
              </td>
              <td colspan="2">
                <div className="amount">
                  <Text>{`$${el.price}`}</Text>{" "}
                  {/* <div className="subtitle">{`${el.duration}`}</div> */}
                </div>
              </td>
              <td>
                <div className="switch">
                  <Switch
                    defaultChecked={el.service_status === 1 ? true : false}
                    onChange={(e) => onChange(e, el)}
                    // onChange={(checked) => {
                    //   let requestData = {
                    //     service_id: el.id ? el.id : "",
                    //     status: checked ? 1 : 0,
                    //   };
                    //   props.activateAndDeactivateService(requestData, (res) => {
                    //     if (res.status === 200) {
                    //       toastr.success(res.data && res.data.data);
                    //       getServiceDetail();
                    //     }
                    //   });
                    // }}
                  />
                </div>
              </td>
              <td>
                <div className="edit-delete">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      getItemDetail(el);
                    }}
                  >
                    <img
                      src={require("../../../../assets/images/icons/edit-gray.svg")}
                      alt="edit"
                    />
                  </a>
                  <a
                    href="javascript:void(0)"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteService(el.id);
                    }}
                    // onClick={(e) => {
                    //   toastr.confirm(`${MESSAGES.CONFIRM_DELETE}`, {
                    //     onOk: () => deleteItem(el.id),
                    //     onCancel: () => {},
                    //   });
                    // }}
                  >
                    <img
                      src={require("../../../../assets/images/icons/delete.svg")}
                      alt="delete"
                    />
                  </a>
                </div>
              </td>
            </tr>
          );
        })
      );
    }
  };

  /**
   * @method deleteItem
   * @description remove service
   */
  const deleteItem = (id) => {
    props.deleteServices(id, (res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.BEAUTY_SERVICE_DELETE);
        getServiceDetail();
      }
    });
  };

  const resetField = () => {
    let currentValue = formRef.current && formRef.current.getFieldsValue();

    if (currentValue) {
      currentValue.services[0].more_info = "";
      currentValue.services[0].name = "";
      currentValue.services[0].duration = "";
      currentValue.services[0].price = "";
      formRef.current &&
        formRef.current.setFieldsValue({
          currentValue,
        });
    }
    formRef.current && formRef.current.resetFields();
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  const onFinish = (value) => {
    const { isCreateService } = props;
    let requestData = {},
      requestData2 = [];
    if (value.services && editService) {
      value.services &&
        value.services.map((el, i) => {
          requestData = {
            wellbeing_service_id: serviceInfo.id,
            duration: el.duration,
            price: el.price,
            more_info: el.more_info,
            name: el.name,
          };
        });
      props.updateSpaServices(requestData, (res) => {
        if (res.status === 200) {
          toastr.success("Vendor service has been updated successfully.");
          getServiceDetail();
          //setServiceInfo('')
          // resetField()
          if (props.loggedInUser.user_type === "beauty") {
            props.history.push("/services");
          } else {
            props.history.push("/vendor-services");
          }
        }
      });
    } else if (value.services && !editService) {
      let el = value.services[0];
      let reqData = {
        trader_profile_id: props.loggedInUser.trader_profile_id,
        services: [
          {
            duration: el.duration,
            price: el.price,
            more_info: el.more_info,
            name: el.name,
            service_category_id: activeServiceCategoryId,
          },
        ],
      };
      props.createSpaServices(reqData, (res) => {
        if (res.status === 200) {
          toastr.success("Vendor service has been created successfully.");
          getServiceDetail();
          formRef.current.resetFields();
          if (props.loggedInUser.user_type === "beauty") {
            props.history.push("/services");
          } else {
            props.history.push("/vendor-services");
          }
        }
      });
    }
  };

  /**
   * @method renderOptions
   * @description render duration options
   */
  const renderOptions = () => {
    return (
      durationOption &&
      durationOption.length &&
      durationOption.map((el, i) => {
        return (
          <Option key={i} value={el}>
            {el}
          </Option>
        );
      })
    );
  };

  /**
   * @method createDynamicInput
   * @description create services
   */

  const createDynamicInput = () => {
    const { isCreateService } = props;
    // const menu = (
    //   <Menu>
    //     <Menu.Item>Activate All Items</Menu.Item>
    //     <Menu.Item>Delete All Items</Menu.Item>
    //     <Menu.Item>Delete Category</Menu.Item>
    //   </Menu>
    // );
    return (
      <Form
        onFinish={onFinish}
        className="spa-form service-form"
        layout="vertical"
        ref={formRef}
        id="spa-form"
        initialValues={{
          name: "services",
          services: [{ name: "", price: "", more_info: "", duration: "" }],
        }}
      >
        <Form.List name="services">
          {(fields, { add, remove }) => {
            return (
              // <Collapse
              //   // accordion
              //   activeKey={activePanel}
              //   onChange={(e) => {
              //     if (e[e.length - 1] == undefined) {
              //       setActivePanel(1)
              //     } else {
              //       setActivePanel((e[e.length - 1]))
              //     }
              //   }}
              // >
              <div className="spa-form-inner">
                {fields.map(
                  (field, index) => (
                    console.log("Field@@@@@@", field),
                    (
                      // <Panel header="Your Service" key={field.fieldKey + 1}>
                      <div key={field.key}>
                        <Row gutter={10}>
                          <Col xs={24} sm={24} md={24} lg={15} xl={15}>
                            <Form.Item
                              label={[field.label, "Item Name"]}
                              name={[field.name, "name"]}
                              fieldKey={[field.fieldKey, "name"]}
                              rules={rules}
                            >
                              <Input placeholder="..." />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                            <Form.Item
                              label={[field.label, "Duration (Mins)"]}
                              name={[field.name, "duration"]}
                              fieldKey={[field.fieldKey, "duration"]}
                              rules={rules}
                            >
                              {/* <Input placeholder="Duration" type='number' /> */}
                              <Select placeholder="..." allowClear>
                                {renderOptions()}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                            <Form.Item
                              label={[field.label, "Price AUD"]}
                              name={[field.name, "price"]}
                              fieldKey={[field.fieldKey, "price"]}
                              rules={[{ validator: validNumber }]}
                            >
                              {/* <Input placeholder="Price AUD" type='number' /> */}
                              <InputNumber
                                className="price-number"
                                placeholder="Price AUD"
                                formatter={(value) =>
                                  `$ ${value}`.replace(
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
                        </Row>
                        <Row gutter={10}>
                          {/* <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Form.Item
                          label={[field.label, "Description"]}
                          name={[field.name, "more_info"]}
                          fieldKey={[field.fieldKey, "more_info"]}
                          rules={rules}
                        >
                          <Input placeholder="Description" />
                        </Form.Item>
                      </Col> */}
                        </Row>

                        {field.key !== 0 && (
                          <Col flex="none">
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              title={"Add More"}
                              onClick={() => remove(field.name)}
                            />
                          </Col>
                        )}
                      </div>
                    )
                    // </Panel>
                  )
                )}

                {/* <Row gutter={0}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={18}
                    xl={18}
                    style={{ marginLeft: "20.83333333%" }}
                  >
                    <div>
                      <Form.Item>
                        <Button
                          className="add-btn"
                          type="primary"
                          htmlType="submit"
                        >
                          Update
                        </Button>
                      </Form.Item>
                    </div>
                  </Col>
                </Row> */}
                <Row gutter={0}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="btn-block">
                      {editService ? (
                        <>
                          {/* <Button
                            type="primary"
                            htmlType="cancel"
                            block
                            className="cancel-btn"
                          >
                            Cancel
                          </Button> */}
                          <button className="cancel-btn" onClick={() => main()}>
                            Cancel
                          </button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="add-btn"
                          >
                            Update
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          className="add-btn"
                        >
                          Save
                        </Button>
                      )}
                      {/* <Link to={"/add-services"}> */}
                      {/* </Link> */}
                    </div>
                  </Col>
                </Row>
                {/* </Collapse> */}
              </div>
            );
          }}
        </Form.List>
      </Form>
    );
  };
  // props.userDetails.user.service_categories.map((el) => {
  //   let valuee = el.id;
  //   setValue
  // });
  const onFinishFirst = (values, id) => {
    // console.log("idddd@@@@@@@@@@@@@", id);
    let reqData = {
      service_category_id: activeServiceCategoryId,
      //service_category_id: props.userDetails.user.service_categories[0].id,
      name: values.name,
      description: values.description,
    };
    if (activeServiceCategoryId) {
      props.updateServiceCategory(reqData, (res) => {
        //  console.log("reqData", reqData);
        if (res.status === 200) {
          toastr.success("service has been updated successfully.");
          getServiceDetail();
        }
      });
      if (props.loggedInUser.user_type === "beauty") {
        props.history.push("/services");
      } else {
        props.history.push("/vendor-services");
      }
    }
  };

  /**
   * @method renderServiceTab
   * @description render service tab
   */
  const renderServiceTab = (item) => {
    const menu = (
      <Menu className="bulk-action-menu" onClick={handleMenuClick}>
        <Menu.Item key="1">Activate All Items</Menu.Item>
        <Menu.Item key="2">Delete All Items</Menu.Item>
        <Menu.Item key="3">Delete Category</Menu.Item>
      </Menu>
    );
    if (item && item.length) {
      return (
        <Row>
          <div className="restaurant-content-block">
            {createDynamicInput()}
            <div className="reformer-grid-block">
              <table>{renderUserServices(item)}</table>
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
            </div>
          </div>
        </Row>
      );
    }
    // else {
    //   return <NoContentFound />
    // }
  };

  const asd = services.map((trader_services) => {
    return trader_services;
  });

  return (
    <Layout className="create-membership-block profile-beauty-service">
      <Layout className="create-membership-block profile-beauty-service profile-spa-service">
        <AppSidebar history={history} />
        <Layout>
          <div className="my-profile-box" style={{ minHeight: 800 }}>
            <div className="card-container signup-tab service-management-wrapper service-edit">
              <div className="top-head-section">
                <div className="left">
                  <Title level={2}>Service Management</Title>
                </div>
              </div>
              <Card
                bordered={false}
                className="profile-content-box edit"
                extra={
                  services &&
                  services.length !== 0 && (
                    <Space
                      align={"center"}
                      className={"blue-link"}
                      style={{ cursor: "pointer" }}
                      size={9}
                      onClick={() => {
                        editRef.current.click();
                      }}
                    >
                      Done
                    </Space>
                  )
                }
              >
                <Tabs
                  defaultActiveKey="1"
                  onChange={(e) =>
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$@#$@", e)
                  }
                >
                  {services.map((el, i) => {
                    return +el.status === 0 ? null : (
                      <TabPane tab={el.name} key={el.id}>
                        <Row>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <Card className="restaurant-tab test">
                              <Form
                                name="basic"
                                ref={formRef}
                                // initialValues={{
                                //   remember: true,
                                // }}
                                onFinish={onFinishFirst}
                                className="add-category-form"
                                layout="vertical"
                                id="add-category-form"
                                initialValues={{
                                  name: el.name,
                                  description: el.description,
                                }}
                              >
                                <Row gutter={10}>
                                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                      label={"New Category Name"}
                                      name={"name"}
                                    >
                                      {/* <label>New Category Name</label> */}
                                      <Input placeholder="..." />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                      label={"Description"}
                                      name={"description"}
                                    >
                                      {/* <label>Description</label> */}
                                      <TextArea placeholder="..." />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Form.Item style={{ display: "none" }}>
                                  <Button htmlType={"submit"} ref={editRef}>
                                    Done
                                  </Button>
                                </Form.Item>
                              </Form>
                              <div className="add-service-section">
                                {el.trader_services.length === 0
                                  ? !hidden && (
                                      <Button
                                        type="primary"
                                        className="add-service-btn "
                                        onClick={onClick}
                                      >
                                        Add Services
                                      </Button>
                                    )
                                  : ""}
                                {showStatements ? createDynamicInput() : null}
                              </div>
                              {renderServiceTab(el.trader_services)}
                            </Card>
                          </Col>
                        </Row>
                      </TabPane>
                    );
                  })}
                  {/* <TabPane tab="Haircuts" key="1">
                    <Row>
                      <Col
                        className="gutter-row"
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Card className="restaurant-tab test">
                          <Form
                            className="add-category-form"
                            layout="vertical"
                            id="add-category-form"
                          >
                            <Row gutter={10}>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item>
                                  <label>New Category Name</label>
                                  <Input placeholder="..." />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item>
                                  <label>Description</label>
                                  <TextArea placeholder="..." />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                          {renderServiceTab()}
                        </Card>
                      </Col>
                    </Row>
                  </TabPane> */}
                  {/* <TabPane tab="Treatment Services" key="2">
                    Content of Tab Pane 2
                  </TabPane>
                  <TabPane tab="Blow-Waves and Curls" key="3">
                    Content of Tab Pane 3
                  </TabPane>
                  <TabPane tab="Colours" key="4">
                    Content of Tab Pane 4
                  </TabPane>
                  <TabPane tab="Highlights" key="5">
                    Content of Tab Pane 5
                  </TabPane>
                  <TabPane tab="Lightening Services" key="6">
                    Content of Tab Pane 6
                  </TabPane> */}
                </Tabs>
              </Card>
            </div>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
  };
};
export default connect(mapStateToProps, {
  createSpaServices,
  getTraderProfile,
  getBookingSubcategory,
  activateAndDeactivateService,
  updateSpaServices,
  updateServiceCategory,
  getSpaServices,
  deleteServices,
  enableLoading,
  disableLoading,
  getServiceCategory,
  removeService,
  bulkActionWellbeing,
})(SpaForm);
