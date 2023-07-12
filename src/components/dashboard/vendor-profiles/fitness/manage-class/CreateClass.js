import React from "react";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../../config/localization";
import { required } from "../../../../../config/FormValidation";
import { connect } from "react-redux";
import {
  Steps,
  Layout,
  Typography,
  Divider,
  Button,
  Select,
  Tabs,
  Card,
  Space,
  Input,
  Form,
  Row,
  Col,
  Menu,
  Switch,
  InputNumber,
  Dropdown,
  Modal,
} from "antd";
import {
  getFitnessClassListing,
  enableLoading,
  disableLoading,
  getTraderProfile,
  createMemberShipPlan,
  deleteFitnessMemberShip,
  changeStatusOfAllFitnessMembership,
  getFitnessMemberShipListing,
  changeStatusMemberShip,
  createFitnessClass,
  changeStatusFitnessClass,
  changeStatusOfAllFitnessClass,
  deleteFitnessClass,
  getFitnessTypes,
  saveTraderProfile,
  getUserProfile,
  createClassCategory,
  getServiceCategory,
  deleteServiceCategory,
  deleteClass,
} from "../../../../../actions";
import { EditClassForm } from "./EditClassForm";
import { EditClassForm2 } from "./EditClassForm2";
import { MESSAGES } from "../../../../../config/Message";
import {
  PlusCircleOutlined,
  DownOutlined,
  DeleteFilled,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
class CreateFitnessClass extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      submitFromOutside: false,
      current: 0,
      step1Data: {},
      step2Data: {},
      classList: [],
      packageList: [],
      selectedFitnessClassList: [],
      selectedClassId: "",
      selectedMembershipId: "",
      defaultActiveTab: "1",
      isInitialProfileSetup: true,
      id: "",
      services: [],
      visible: false,
      status: 0,
      fitnestypeid: "",
      Service_category_id: "",
    };
  }

  componentDidMount() {
    this.props.getFitnessTypes();
    this.getFitnessClasses();
    this.getServiceDetail();
    console.log("LoggedInUser", this.props.userDetails);
  }

  // Delete service category
  deleteServiceCategoryTab = (data) => {
    const { loggedInUser } = this.props;
    console.log(data.trader_services.id, "dataa");

    let obj = {
      service_category_id: data.id,
    };
    this.props.enableLoading();
    this.props.deleteServiceCategory(obj, (res) => {
      this.props.disableLoading();
      console.log("RES", res);
      if (res.status === 200) {
        toastr.success("Successfully Deleted", res.data.message);
        this.props.getServiceCategory(loggedInUser.trader_profile_id, (res) => {
          console.log("RES", res);

          let data = res.data && res.data.data;
          console.log(
            "🚀 ~ file: CreateSpaServices.js ~ line 130 ~ BeautyServices ~ this.props.getSpaServices ~ data",
            data
          );
          let services = data && Array.isArray(data) && data.length ? data : [];

          this.setState({
            services: services,
          });
        });
      } else {
        toastr.error("Something went wrong", "Unsuccessfully Deleted");
      }
    });
  };

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props;
    this.props.getServiceCategory(loggedInUser.trader_profile_id, (res) => {
      console.log("RES", res);
      if (res.status === 200) {
        let data = res.data && res.data.data;
        console.log(
          "🚀 ~ file: CreateSpaServices.js ~ line 130 ~ BeautyServices ~ this.props.getSpaServices ~ data",
          data
        );
        let services = data && Array.isArray(data) && data.length ? data : [];
        let tmp = null;
        services.map((service) => {
          if (service.status !== 0 && !tmp) {
            tmp = service.id;
          }
        });

        this.setState({
          services: services,
          activeServiceCategoryId: services[0].id,
          selectedClassId: tmp,
        });
      }
    });
  };

  /**
   * @method getFitnessClasses
   * @description to find it is Initial profile setup or second
   */
  getFitnessClasses = () => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    this.props.getFitnessClassListing(
      { id: trader_user_profile_id, page_size: 50 },
      (res) => {
        if (res.data.status === 200) {
          let data = res.data && res.data.data;
          let traderClasses =
            data.trader_classes &&
            Array.isArray(data.trader_classes) &&
            data.trader_classes.length
              ? data.trader_classes
              : [];
          this.setState({
            isInitialProfileSetup: traderClasses.length >= 1 ? false : true,
            // classList: traderClasses
          });
        }
      }
    );
  };

  /**
   * @method createNewClass
   * @description createNewClass  in Fitness
   */
  createNewClass = (values, images) => {
    // console.log(reqData, "reqDataaaa");
    // const { userDetails } = this.props;
    // let temp = [];
    // images.filter((el) => {
    //   el.originFileObj && temp.push(el.originFileObj);
    // });

    // let req = {
    //   trader_user_profile_id: userDetails.user.trader_profile.id,
    //   classes: reqData,
    // };
    // const formData = new FormData();
    // for (var i = 0; i < temp.length; i++) {
    //   formData.append("images[]", temp[i]);
    // }
    // Object.keys(req).forEach((key) => {
    //   if (typeof req[key] == "object" && key === "classes") {
    //     formData.append("classes", `${JSON.stringify(req[key])}`);
    //   } else {
    //     formData.append(key, req[key]);
    //   }
    // });
    this.props.enableLoading();
    this.props.createFitnessClass(values, (res) => {
      this.props.disableLoading();
      // console.log(res, "yashhhhhh");
      // console.log(formData, "formDataa");

      if (res.status === 200) {
        this.setState({
          addService: false,
        });
        toastr.success(langs.success, MESSAGES.CLASS_CREATE_SUCCESS);
        // this.props.nextStep();
        this.getServiceDetail();
      }
    });
  };
  // Update class
  UpdateClass = (values) => {
    this.props.enableLoading();
    this.props.createFitnessClass(values, (res) => {
      this.props.disableLoading();
      // console.log(res, "yashhhhhh");
      // console.log(formData, "formDataa");

      if (res.status === 200) {
        this.setState({
          editService: false,
        });
        toastr.success(langs.success, MESSAGES.CLASS_CREATE_SUCCESS);
        // this.props.nextStep();
        this.getServiceDetail();
      }
    });
  };

  addService = (value) => {
    console.log("jayVAlues", value);
    let requestData = {
      module_type: "fitness",
      name: value.service_type,
      description: "No description",
      status: 1,
    };
    this.props.createClassCategory(requestData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MENU_CATEGORY_ADD_SUCCESS);
        this.myformRef.current &&
          this.myformRef.current.setFieldsValue({
            menu_category_name: null,
          });
      }
    });
    this.getServiceDetail();
  };
  deleteService = (id) => {
    let obj = {
      id: id,
      // trader_user_profile_id: data.user_id
    };
    this.props.deleteClass(obj, (res) => {
      console.log("RES", res);
      if (res.status === 200) {
        toastr.success("Delete Successfully", res.data.message);
        this.getServiceDetail();
      } else {
        toastr.error("Something went wrong", "delete is Unsuccessfully");
      }
    });
  };
  onChange = (item, id, value) => {
    const { userDetails } = this.props;

    // console.log("USERDETAILS", userDetails.user.trader_profile.active);
    // console.log("ITEMS", item);
    // this.setState({ status: userDetails.user.trader_profile.active });
    // console.log("Status", this.state.status);
    // console.log("ID", id);
    // console.log("User_id", userDetails.user.id);
    // console.log("SErvice Category", item.service_category_id);
    // console.log("Trader_profile_id", item.trader_user_profile_id);
    // let form = new FormData();
    // form.append("user_id", userDetails.user.id);
    // form.append("trader_user_profile_id", item.trader_user_profile_id);
    // form.append("service_category_id", item.service_category_id);
    // form.append("wellbeing_trader_service_id", id);

    if (value) {
      let form = new FormData();
      form.append("user_id", userDetails.user.id);
      form.append("trader_user_profile_id", item.trader_user_profile_id);
      form.append("service_category_id", item.service_category_id);
      form.append("wellbeing_trader_service_id", id);
      form.append("status", "Activate");
      this.props.changeStatusFitnessClass(form);
    } else {
      let form = new FormData();
      form.append("user_id", userDetails.user.id);
      form.append("trader_user_profile_id", item.trader_user_profile_id);
      form.append("service_category_id", item.service_category_id);
      form.append("wellbeing_trader_service_id", id);
      form.append("status", "Deactivate");
      this.props.changeStatusFitnessClass(form);
    }
  };
  item = (el) => {
    console.log(el, "ellllllllllllllllll");
    this.props.getFitnessTypes((res) => {
      this.props.disableLoading();

      if (res.status === 200) {
        console.log(res.data.data, "yashhhhhh");
        res.data.data.map((item) => {
          if (item.name == el) {
            this.setState({ fitnestypeid: item.id });
          }
        });
      }
    });
    console.log(this.state.fitnestypeid, "fitnestypeid");
  };

  /**
   * @method createDynamicInput
   * @description create services
   */
  createDynamicInput = () => {
    const {
      services,
      addService,
      editCategory,
      classList,
      selectedClassId,
      isInitialProfileSetup,
    } = this.state;

    const { isCreateService, fitnessPlan, userDetails } = this.props;
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
          // onTabClick={(e) => this.setState({ selectedClassId: e })}
          >
            {services.map((el, i) => {
              return +el.status === 0 ? null : (
                <TabPane
                  tab={
                    <>
                      <span
                        className="category-name"
                        onClick={() => {
                          this.item(el.name);
                          this.setState({ selectedClassId: el.id });
                        }}
                      >
                        {el.name}
                      </span>
                      <span className="tab-actions">
                        <Link
                          onClick={() => {
                            this.deleteServiceCategoryTab(el);
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
                      </span>
                    </>
                  }
                  key={el.id}
                >
                  <div className="tab-inner-item-container">
                    <div className="add-class-form">
                      {addService && (
                        <>
                          <button
                            className="close-btn"
                            onClick={() =>
                              this.setState({
                                addService: false,
                              })
                            }
                          >
                            <img
                              src={require("../../../../../assets/images/icons/close-btn-menu.svg")}
                              alt=""
                            />
                          </button>
                          <EditClassForm
                            nextStep={() => this.props.nextStep()}
                            isEditPage={false}
                            isInitialProfileSetup={isInitialProfileSetup}
                            selectedClassId={selectedClassId}
                            getFitnessClasses={this.getFitnessClasses}
                            classList={classList}
                            changeAllStatus={this.changeAllStatus}
                            EditNewClass={this.createNewClass}
                            createFitnessClassAPI={
                              this.props.createFitnessClass
                            }
                            MESSAGES={MESSAGES}
                            langs={langs}
                            // userDetails={userDetails}
                            ids={this.props.loggedInUser.trader_profile_id}
                            fitnesstypeid={this.state.fitnestypeid}
                            fitnessPlan={fitnessPlan}
                            deleteClass={this.deleteClass}
                            updateClassStatus={this.changeFitnessClassStatus}
                          />
                        </>
                      )}
                      {this.state.editService && (
                        <>
                          <button
                            className="close-btn"
                            onClick={() =>
                              this.setState({
                                editService: false,
                              })
                            }
                          >
                            <img
                              src={require("../../../../../assets/images/icons/close-btn-menu.svg")}
                              alt=""
                            />
                          </button>
                          <EditClassForm2
                            nextStep={() => this.props.nextStep()}
                            isEditPage={false}
                            isInitialProfileSetup={isInitialProfileSetup}
                            selectedClassId={selectedClassId}
                            getFitnessClasses={this.getFitnessClasses}
                            classList={classList}
                            changeAllStatus={this.changeAllStatus}
                            UpdateClass={this.UpdateClass}
                            createFitnessClassAPI={
                              this.props.createFitnessClass
                            }
                            MESSAGES={MESSAGES}
                            langs={langs}
                            // userDetails={userDetails}
                            ids={this.props.loggedInUser.trader_profile_id}
                            fitnesstypeid={this.state.fitnestypeid}
                            fitnessPlan={fitnessPlan}
                            deleteClass={this.deleteClass}
                            updateClassStatus={this.changeFitnessClassStatus}
                            editClassData={this.state.editServicedetails}
                          />
                        </>
                      )}
                    </div>
                    <div className="add-service-section">
                      {!addService && (
                        <Row gutter={0} className="menu-header-inner">
                          <Col md={12} className="item-col">
                            Classes
                          </Col>
                          <Col md={3} className="price-col">
                            Duration
                          </Col>
                          <Col md={3} className="price-col">
                            Price
                          </Col>
                          <Col md={6} className="btn-col">
                            <Button
                              type="primary"
                              className="add-service-btn"
                              onClick={() => {
                                this.setState({
                                  addService: true,
                                });
                              }}
                            >
                              <PlusCircleOutlined /> Add Class
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </div>
                    {el.trader_classes.length > 0 &&
                      el.trader_classes.map((el2, j) => {
                        return (
                          <Row className="spa-item-description">
                            <Col md={12}>
                              <h6>{el2.class_name}</h6>
                              <span className="time">{el2.description}</span>
                              {/* <p>Most popular couples option – two hours of complete pampering with two therapists Or book just for you, or for mother daughter day. Ripple can send a team of therapists for group bookings with this package</p> */}
                            </Col>
                            <Col md={3} className="text-center">
                              <h5 className="duration">
                                {" "}
                                {el2.class_time
                                  ? `${el2.class_time}`
                                  : "0 mins"}
                              </h5>
                            </Col>
                            <Col md={3} className="text-center">
                              <h5 className="spa-price">{`AU $${
                                el2.price ? `$${el2.price}` : ""
                              }`}</h5>
                            </Col>
                            <Col md={3} className="text-right">
                              <Switch
                                defaultChecked={el2.is_Active}
                                onChange={(e) => this.onChange(el2, el2.id, e)}
                              />
                            </Col>
                            <Col md={3}>
                              <div className="spa-action">
                                {/* <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' className="pr-10"/>
                                <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete'/> */}
                                <p
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                      editService: true,
                                      editServicedetails: el2,
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
                                </p>
                                <p
                                  onClick={(e) => {
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
                                </p>
                              </div>
                            </Col>
                          </Row>
                        );
                      })}
                  </div>
                </TabPane>
              );
            })}
          </Tabs>
        )}
      </card>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { classList, selectedClassId, isInitialProfileSetup, visible } =
      this.state;
    const { fitnessPlan } = this.props;
    console.log(this.state.fitnestypeid, "fitnestypeid");
    return (
      <Layout>
        <Layout>
          <Layout style={{ overflowX: "visible" }}>
            <div className="my-profile-box my-profile-setup manage-edit-memebership">
              {/* <div className='card-container signup-tab'> */}
              <div className="steps-content align-left mt-0">
                {/* <Card
                                        className='profile-content-box'
                                        bordered={false}
                                        title=''
                                    > */}
                <Layout className="create-membership-block">
                  <Layout className="createmembership">
                    <div className="sub-head-section">
                      <Text>All Fields Required</Text>
                    </div>
                    {/* <h4>
                      <b>Create your class</b>
                      <p className="subtitle">
                        Files can be up to 2MB for file types .pdf .jpeg .png
                        .bmp
                      </p>
                    </h4> */}
                    <Row className="class-category-row">
                      <Form
                        onFinish={this.addService}
                        layout={"vertical"}
                        ref={this.myformRef}
                        className="select-category-block mb-30"
                      >
                        <Row gutter={10}>
                          <Title level={4}>Class Categories</Title>
                          <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                            <Form.Item
                              name="service_type"
                              rules={[required("category required")]}
                            >
                              <Select placeholder="Select service type">
                                {this.props.fitnessPlan &&
                                  this.props.fitnessPlan.map((keyName, i) => {
                                    return (
                                      <Option
                                        key={keyName.id}
                                        value={keyName.name}
                                      >
                                        {keyName.name}
                                      </Option>
                                    );
                                  })}
                              </Select>
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
                    <Row>
                      <div className="restaurant-content-block add-service-tabs">
                        {this.createDynamicInput()}
                      </div>
                    </Row>
                    <div
                      className="my-profile-box createmembership"
                      // style={{ minHeight: 800 }}
                    >
                      {/* <EditClassForm
                        nextStep={() => this.props.nextStep()}
                        isEditPage={false}
                        isInitialProfileSetup={isInitialProfileSetup}
                        selectedClassId={selectedClassId}
                        getFitnessClasses={this.getFitnessClasses}
                        classList={classList}
                        changeAllStatus={this.changeAllStatus}
                        createClass={this.createNewClass}
                        fitnessPlan={fitnessPlan}
                        deleteClass={this.deleteClass}
                        updateClassStatus={this.changeFitnessClassStatus}
                      /> */}
                    </div>
                  </Layout>
                </Layout>

                {/* </Card> */}
              </div>
              {/* <Divider /> */}
              {/* {!isInitialProfileSetup && ( */}
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
                  form="create_class"
                  htmlType="submit"
                  type="primary"
                  size="middle"
                  className="btn-blue"
                  onClick={() => this.props.nextStep()}
                >
                  Next Step
                </Button>
              </div>
              {/* )} */}

              {/* </div> */}
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    fitnessPlan: Array.isArray(bookings.fitnessPlan)
      ? bookings.fitnessPlan
      : [],
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getTraderProfile,
  createMemberShipPlan,
  changeStatusMemberShip,
  createFitnessClass,
  changeStatusOfAllFitnessClass,
  changeStatusFitnessClass,
  getFitnessClassListing,
  getFitnessMemberShipListing,
  changeStatusOfAllFitnessMembership,
  deleteFitnessClass,
  deleteFitnessMemberShip,
  getFitnessTypes,
  saveTraderProfile,
  getUserProfile,
  createClassCategory,
  getServiceCategory,
  deleteServiceCategory,
  deleteClass,
})(CreateFitnessClass);
