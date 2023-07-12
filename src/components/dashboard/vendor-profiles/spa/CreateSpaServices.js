import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
  deleteServices,
  createServiceCategory,
  getServiceCategory,
  updateServiceCategory,
  removeServiceCategory,
  removeService,
  bulkActionWellbeing,
} from "../../../../actions";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../../config/Config";
import Icon from "../../../customIcons/customIcons";
import { convertHTMLToText } from "../../../common";
import { required, validNumber } from "../../../../config/FormValidation";
import {
  PlusOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "../../vendor-profiles/myprofilerestaurant.less";
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;
const rules = [required("")];
const { Panel } = Collapse;
const { TextArea } = Input;

class BeautyServices extends React.Component {
  formRef = React.createRef();
  editRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      subCategory: [],
      currentList: [],
      size: "large",
      showSettings: [],
      activeFlag: langs.key.all,
      ads_view_count: "",
      total_ads: "",
      services: [],
      BeautyService: "",
      isEditFlag: false,
      durationOption: [],
      item: "",
      itemInfo: "",
      serviceInfo: "",
      fileList: [],
      Id: "",
      activePanel: 1,
      addService: false,
      editCategorydetails: null,
      editCategory: null,
      editService: null,
      editServicedetails: null,
      activeServiceCategoryId: null,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { services, activeServiceCategoryId } = this.state;
    if (services.length > 0 && activeServiceCategoryId === null) {
      this.setState({
        activeServiceCategoryId: services[0].id,
      });
    }

    let temp = [];
    for (let i = 30; i <= 240; i = i + 30) {
      temp.push(i);
    }
    this.setState({ durationOption: temp });
    this.getServiceDetail();
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editService && this.state.editService) {
      // let currentValue =
      // this.editRef.current && this.editRef.current.getFieldsValue();
      // console.log("🚀 ~ file: CreateSpaServices.js ~ line 777 ~ BeautyServices ~ el.trader_services.map ~ currentValue", currentValue)

      // if (currentValue) {
      //   currentValue.name = this.state.editServicedetails.name;
      //   currentValue.duration = this.state.editServicedetails.duration;
      //   currentValue.price = this.state.editServicedetails.price;
      this.editRef.current &&
        this.editRef.current.setFieldsValue({
          name: this.state.editServicedetails.name,
          duration: this.state.editServicedetails.duration,
          price: this.state.editServicedetails.price,
        });
      // }
    }
  }
  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props;
    this.props.getServiceCategory(loggedInUser.trader_profile_id, (res) => {
      if (res.status === 200) {
        let data = res.data && res.data.data;
        console.log(
          "🚀 ~ file: CreateSpaServices.js ~ line 130 ~ BeautyServices ~ this.props.getSpaServices ~ data",
          data
        );
        let services = data && Array.isArray(data) && data.length ? data : [];
        this.setState({
          services: services,
        });
        let tmp = null;
        services.map((service) => {
          if (!tmp && service.status == 1) {
            this.setState({
              activeServiceCategoryId: service.id,
            });
          }
        });
      }
    });
  };

  // /**
  //  * @method getServiceDetail
  //  * @description get service details
  //  */
  // getServiceDetail = () => {
  //   const { loggedInUser } = this.props;
  //   this.props.getSpaServices(loggedInUser.trader_profile_id, (res) => {
  //     if (res.status === 200) {
  //       let data = res.data && res.data.data;
  //       let services =
  //         data &&
  //         Array.isArray(data.wellbeing_trader_service) &&
  //         data.wellbeing_trader_service.length
  //           ? data.wellbeing_trader_service
  //           : [];

  //       this.setState({ services: services });
  //     }
  //   });
  // };

  getItemDetail = (el) => {
    this.setState({
      serviceInfo: el,
      isEditFlag: true,
    });
    console.log("DFDGDDHGHFHFH", el);

    let currentValue =
      this.formRef.current && this.formRef.current.getFieldsValue();

    if (currentValue) {
      currentValue.services[0].more_info = el.more_info;
      currentValue.services[0].name = el.name;
      currentValue.services[0].duration = el.duration;
      currentValue.services[0].price = el.price;
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          currentValue,
        });
    }
  };

  /**
   * @method renderUserServices
   * @description render service details
   */
  renderUserServices = (item) => {
    if (item && item.length) {
      return (
        item &&
        Array.isArray(item) &&
        item
          .map((el, i) => {
            return (
              <tr key={i}>
                <td colspan="2">
                  <div className="title">
                    <Text>{el.name}</Text>
                  </div>
                  <div className="subtitle">{`${el.more_info}`}</div>
                </td>
                <td colspan="2">
                  <div className="amount">
                    <Text>{`$${el.price}`}</Text>{" "}
                    <div className="subtitle">{`${el.duration}`}</div>
                  </div>
                </td>
                <td colspan="2">
                  <div className="switch">
                    <Switch
                      defaultChecked={el.service_status === 1 ? true : false}
                      onChange={(checked) => {
                        let requestData = {
                          service_id: el.id ? el.id : "",
                          status: checked ? 1 : 0,
                        };
                        this.props.activateAndDeactivateService(
                          requestData,
                          (res) => {
                            if (res.status === 200) {
                              toastr.success(res.data && res.data.data);
                            }
                          }
                        );
                      }}
                    />
                  </div>
                  <div className="edit-delete">
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.getItemDetail(el)}
                    >
                      <img
                        src={require("../../../../assets/images/icons/edit-gray.svg")}
                        alt="edit"
                      />
                    </a>
                    <a
                      href="javascript:void(0)"
                      onClick={(e) => {
                        toastr.confirm(`${MESSAGES.CONFIRM_DELETE}`, {
                          onOk: () => this.deleteItem(el.id),
                          onCancel: () => {},
                        });
                      }}
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
          .reverse()
      );
    }
  };

  /**
   * @method deleteItem
   * @description remove service
   */
  deleteItem = (id) => {
    this.props.deleteServices(id, (res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.BEAUTY_SERVICE_DELETE);
        this.getServiceDetail();
      }
    });
  };

  resetField = () => {
    this.formRef.current && this.formRef.current.resetFields();
    this.setState({ fileList: [], serviceInfo: "", isEditflag: false });
  };

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (value) => {
    const { loggedInUser } = this.props;
    const { editCategory, editCategorydetails } = this.state;
    if (editCategory) {
      let reqData = {
        service_category_id: editCategorydetails.id,
        name: value.name,
        description: value.description,
      };
      this.props.updateServiceCategory(reqData, (res) => {
        if (res.status === 200) {
          toastr.success("service has been updated successfully.");
          this.getServiceDetail();
          this.setState({
            editCategory: null,
            editCategorydetails: null,
          });
        }
      });
    } else {
      let reqData = {
        module_type: loggedInUser.user_type,
        name: value.name,
        description: value.description,
        status: 1,
      };
      this.props.createServiceCategory(reqData, (res) => {
        if (res.status === 200) {
          toastr.success("Vendor service has been created successfully.");
          this.getServiceDetail();
          this.formRef.current.resetFields();
        }
      });
    }
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

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinishService = (value, categoryId) => {
    const { loggedInUser } = this.props;
    const { editService, editServicedetails } = this.state;
    if (editService) {
      let reqData = {
        wellbeing_service_id: editServicedetails.id,
        name: value.name,
        duration: value.duration,
        price: value.price,
        more_info: "No Info",
      };
      this.props.updateSpaServices(reqData, (res) => {
        if (res.status === 200) {
          toastr.success("service has been updated successfully.");
          this.setState({
            editService: null,
            editServicedetails: null,
            addService: null,
          });
          this.formRef.current.resetFields();
          this.getServiceDetail();
        }
      });
    } else {
      let reqData = {
        trader_profile_id: loggedInUser.trader_profile_id,
        services: [
          {
            name: value.name,
            duration: value.duration,
            price: value.price,
            more_info: "No Info",
            service_category_id: categoryId,
          },
        ],
      };
      this.props.createSpaServices(reqData, (res) => {
        if (res.status === 200) {
          toastr.success("Vendor service has been created successfully.");
          this.getServiceDetail();
          this.formRef.current.resetFields();
        }
      });
    }
  };

  /**
   * @method renderOptions
   * @description render duration options
   */
  renderOptions = () => {
    const { durationOption } = this.state;
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
   * @method dummyRequest
   * @description dummy image upload request
   */
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  createCategoryForm = () => {
    const { editCategory, editCategorydetails } = this.state;
    return (
      <Form
        onFinish={this.onFinish}
        className="my-form"
        layout="vertical"
        ref={this.formRef}
        id="spa-form"
        initialValues={{
          name: editCategorydetails ? editCategorydetails.name : "",
          description: editCategorydetails
            ? editCategorydetails.description
            : "",
        }}
      >
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form.Item label="New Category Name" name="name">
            <Input placeholder="..." />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form.Item label="Description" name="description">
            <TextArea placeholder="..." />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Form.Item
            style={{ paddingBottom: "30px" }}
            className="add-card-link-mb-0"
          >
            {editCategory ? (
              <Button
                size="middle"
                className="add-btn"
                type="primary"
                htmlType={"submit"}
              >
                Update
              </Button>
            ) : (
              <Button
                size="middle"
                className="add-btn"
                type="primary"
                htmlType={"submit"}
              >
                Add
              </Button>
            )}
          </Form.Item>
        </Col>
      </Form>
    );
  };

  deleteServiceCategory = (id) => {
    this.props.removeServiceCategory(id, (res) => {
      if (res.status === 200) {
        toastr.success("Service category has been removed successfully.");
        this.getServiceDetail();
      }
    });
  };

  deleteService = (id) => {
    this.props.removeService(id, (res) => {
      if (res.status === 200) {
        toastr.success("Service has been removed successfully.");
        this.getServiceDetail();
      }
    });
  };

  /**
   * @method createDynamicInput
   * @description create services
   */
  createDynamicInput = () => {
    const {
      isEditFlag,
      activePanel,
      services,
      addService,
      editCategory,
      editService,
      editServicedetails,
    } = this.state;
    const { isCreateService } = this.props;
    const menu = (
      <Menu className="bulk-action-menu" onClick={this.handleMenuClick}>
        <Menu.Item key="1">Activate All Items</Menu.Item>
        <Menu.Item key="2">Delete All Items</Menu.Item>
        <Menu.Item key="3">Delete Category</Menu.Item>
      </Menu>
    );

    return (
      <card>
        {services.length > 0 && (
          <Tabs
            onChange={(e) => {
              this.setState({
                activeServiceCategoryId: e,
              });
            }}
          >
            {services.map((el, i) => {
              return +el.status === 0 ? null : (
                <TabPane tab={el.name} key={el.id}>
                  <div className="tab-inner-item-container">
                    {editCategory === el.id ? (
                      <>
                        <div className="form-container add-service-form edit-category-form">
                          <div className="service-form-row">
                            <button
                              className="close-icon"
                              onClick={() =>
                                this.setState({
                                  editCategory: null,
                                  editCategorydetails: null,
                                })
                              }
                            >
                              {" "}
                              {/* X */}
                            </button>

                            <Row>
                              <Col md={24} lg={24} sm={24}>
                                <Row>
                                  <Col md={24} lg={24} sm={24}>
                                    {this.createCategoryForm()}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Row style={{ background: "#fff" }}>
                        <Col md={21}>
                          <TextArea
                            rows={4}
                            className="spa-service-msg"
                            defaultValue={el.description}
                            disabled={true}
                          />
                        </Col>
                        <Col md={3} className="text-right">
                          {/* <EditOutlined style={{cursor: 'pointer'}}/> */}
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              this.setState({
                                editCategory: el.id,
                                editCategorydetails: el,
                              });
                            }}
                            className="mr-2 edit-icon"
                          >
                            {" "}
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 9.29435V11.7398H2.5L9.87332 4.52735L7.37332 2.0819L0 9.29435ZM11.8066 2.6362C12.0666 2.38187 12.0666 1.97104 11.8066 1.71671L10.2467 0.190745C9.98665 -0.0635818 9.56665 -0.0635818 9.30665 0.190745L8.08665 1.38413L10.5866 3.82958L11.8066 2.6362Z"
                                fill="#90A8BE"
                              />
                            </svg>
                          </a>
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              this.deleteServiceCategory(el.id);
                            }}
                            className="delete-icon"
                          >
                            <svg
                              width="10"
                              height="12"
                              viewBox="0 0 10 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.666665 10.4359C0.666665 11.1532 1.26666 11.7401 2 11.7401H7.33332C8.06665 11.7401 8.66665 11.1532 8.66665 10.4359V2.61043H0.666665V10.4359ZM9.33331 0.654073H6.99998L6.33332 0.00195312H2.99999L2.33333 0.654073H0V1.95831H9.33331V0.654073Z"
                                fill="#90A8BE"
                              />
                            </svg>
                          </a>
                        </Col>
                      </Row>
                    )}
                    {addService && (
                      <Form
                        onFinish={(values) =>
                          this.onFinishService(values, el.id)
                        }
                        className="spa-form"
                        layout="vertical"
                        ref={this.editRef}
                        id="spa-form"
                        initialValues={{
                          name: editServicedetails
                            ? editServicedetails.name
                            : "",
                          price: editServicedetails
                            ? editServicedetails.price
                            : "",
                          duration: editServicedetails
                            ? editServicedetails.duration
                            : "",
                        }}
                      >
                        <div className="form-container add-service-form">
                          <div
                            className="service-form-row"
                            // style={{ display: "none" }}
                          >
                            <Row gutter={10}>
                              <button
                                className="close-icon"
                                onClick={() =>
                                  this.setState({
                                    addService: false,
                                    editService: null,
                                    editServicedetails: null,
                                  })
                                }
                              ></button>
                              <Col xs={24} sm={24} md={24} lg={12}>
                                <Form.Item
                                  label={"Item Name"}
                                  name={"name"}
                                  rules={rules}
                                >
                                  <Input placeholder="..." />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item
                                  label={"Duration (Mins)"}
                                  name={"duration"}
                                  placeholder="..."
                                  rules={rules}
                                >
                                  {/* <Input placeholder="Duration" type='number' /> */}
                                  <Select placeholder="Select" allowClear>
                                    {this.renderOptions()}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={6}>
                                <Form.Item
                                  label={"Price AUD"}
                                  name={"price"}
                                  rules={[{ validator: validNumber }]}
                                >
                                  {/* <Input placeholder="Price AUD" type='number' /> */}
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
                            </Row>
                            <div className="add-service-section">
                              {editService ? (
                                <Button
                                  size="middle"
                                  className="add-btn"
                                  type="primary"
                                  htmlType={"submit"}
                                >
                                  Update
                                </Button>
                              ) : (
                                <Button
                                  type="primary"
                                  className="add-service-btn"
                                  htmlType={"submit"}
                                >
                                  Save
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                    <div className="add-service-section">
                      {!addService && (
                        <Button
                          type="primary"
                          className="add-service-btn"
                          onClick={() => {
                            this.setState({
                              addService: true,
                            });
                          }}
                        >
                          <PlusCircleOutlined /> Add Service
                        </Button>
                      )}
                    </div>
                    {el.trader_services.length > 0 &&
                      el.trader_services.map((el2, j) => {
                        return el2.deleted_at ? null : (
                          <Row className="spa-item-description">
                            <Col md={15}>
                              <h6>{el2.name}</h6>
                              <span className="time">{el2.duration}</span>
                              {/* <p>Most popular couples option – two hours of complete pampering with two therapists Or book just for you, or for mother daughter day. Ripple can send a team of therapists for group bookings with this package</p> */}
                            </Col>

                            <Col md={3} className="text-center">
                              <h5 className="spa-price">{`AU $${el2.price}`}</h5>
                            </Col>
                            <Col md={3} className="text-right">
                              <Switch
                                defaultChecked={el2.service_status}
                                onChange={(e) => this.onChange(e, el2)}
                              />
                            </Col>
                            <Col md={3}>
                              <div className="spa-action">
                                {/* <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' className="pr-10"/>
                                <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete'/> */}
                                <a
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      editService: el2.id,
                                      editServicedetails: el2,
                                      addService: el.id,
                                    });
                                  }}
                                  className="mr-2 edit-icon"
                                >
                                  {" "}
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0 9.29435V11.7398H2.5L9.87332 4.52735L7.37332 2.0819L0 9.29435ZM11.8066 2.6362C12.0666 2.38187 12.0666 1.97104 11.8066 1.71671L10.2467 0.190745C9.98665 -0.0635818 9.56665 -0.0635818 9.30665 0.190745L8.08665 1.38413L10.5866 3.82958L11.8066 2.6362Z"
                                      fill="#90A8BE"
                                    />
                                  </svg>
                                </a>
                                <a
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.deleteService(el2.id);
                                  }}
                                  className="delete-icon"
                                >
                                  <svg
                                    width="10"
                                    height="12"
                                    viewBox="0 0 10 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0.666665 10.4359C0.666665 11.1532 1.26666 11.7401 2 11.7401H7.33332C8.06665 11.7401 8.66665 11.1532 8.66665 10.4359V2.61043H0.666665V10.4359ZM9.33331 0.654073H6.99998L6.33332 0.00195312H2.99999L2.33333 0.654073H0V1.95831H9.33331V0.654073Z"
                                      fill="#90A8BE"
                                    />
                                  </svg>
                                </a>
                              </div>
                            </Col>
                          </Row>
                        );
                      })}
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
                </TabPane>
              );
            })}
          </Tabs>
        )}
      </card>
    );
  };

  handleMenuClick = (e) => {
    const { trader_profile_id, id } = this.props.loggedInUser;
    const { activeServiceCategoryId } = this.state;

    let data = {};
    data.user_id = id;
    data.trader_user_profile_id = trader_profile_id;
    data.service_category_id = activeServiceCategoryId;
    if (e.key === "1") {
      data.user_id = id;
      data.trader_user_profile_id = trader_profile_id;
      data.service_category_id = this.state.services[0].id;
      data.status = "Activate"; //Deactivate
    } else if (e.key === "2") {
      data.user_id = id;
      data.trader_user_profile_id = trader_profile_id;
      data.service_category_id = activeServiceCategoryId;
    } else {
      data.user_id = id;
    }
    this.props.bulkActionWellbeing(e.key, data, (res) => {
      if (res.status === 200) {
        if (e.key === "1") {
          window.location.reload();
          this.getServiceDetail();
        } else {
          this.getServiceDetail();
        }
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isEditScrren, services } = this.state;
    const { isCreateService, hideStep } = this.props;
    return (
      <Layout className="create-membership-block profile-beauty-service">
        {isCreateService && (
          <div className="profile-setup-condition-block">
            <Row gutter={[38, 38]}>
              {/* {services && services.length !== 0 && hideStep === undefined &&
              <Link
                onClick={() => this.props.nextStep()}
                className='skip-link uppercase'
                style={{ marginTop: '100px', marginRight: '100px' }} >Skip</Link>
            } */}
              <Col className="gutter-row" xs={24} sm={24} md={21}>
                <div className="restaurant-content-block create-service-content-block mt-40">
                  <div className="restaurant-tab card">
                    <Row>
                      <div className="restaurant-content-block">
                        {this.createCategoryForm()}
                      </div>
                    </Row>
                    <Row>
                      <div className="restaurant-content-block add-service-tabs">
                        {this.createDynamicInput()}
                      </div>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            {/* {hideStep === undefined && <Divider className="mb-30" />} */}
            {hideStep === undefined && (
              <div className="step-button-block">
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
                  form="spa-form"
                  onClick={() => this.props.nextStep()}
                >
                  Next Step
                </Button>
              </div>
            )}
          </div>
        )}
      </Layout>
    );
  }
}

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
  getSpaServices,
  deleteServices,
  enableLoading,
  disableLoading,
  createServiceCategory,
  getServiceCategory,
  updateServiceCategory,
  removeServiceCategory,
  removeService,
  bulkActionWellbeing,
})(withRouter(BeautyServices));
