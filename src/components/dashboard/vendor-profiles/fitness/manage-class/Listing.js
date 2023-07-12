import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { langs } from "../../../../../config/localization";
import { toastr } from "react-redux-toastr";
import {
  Pagination,
  Select,
  Layout,
  Card,
  Typography,
  Button,
  Tabs,
  Row,
  Col,
  Switch,
  Modal,
  Form,
} from "antd";
import AppSidebar from "../../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
import {
  editServices,
  getFitnessMemberShipListing,
  getFitnessClassListing,
  getBeautyServices,
  deleteClass,
  deleteServiceCategory,
  changeStatusFitnessClass,
  changeStatusMemberShip,
  createClassCategory,
  createFitnessClass,
  enableLoading,
  disableLoading,
  editMembership,
  createMemberShipPlan,
} from "../../../../../actions";
import { MESSAGES } from "../../../../../config/Message";
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { API, PAGE_SIZE } from "../../../../../config/Config";
import Icon from "../../../../customIcons/customIcons";
import NoContentFound from "../../../../common/NoContentFound";
import { DASHBOARD_KEYS } from "../../../../../config/Constant";
import { EditClassForm } from "./EditClassForm";
import { EditClassForm2} from "./EditClassForm2"
import { EditMemberShipForm } from "./EditMembershipForm";
import { MemberShipForm } from "./Membership";
import axios from "axios";
import { createFalse } from "typescript";
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
// Pagination
function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return (
      <a>
        <Icon icon="arrow-left" size="14" className="icon" /> Back
      </a>
    );
  }
  if (type === "next") {
    return (
      <a>
        Next <Icon icon="arrow-right" size="14" className="icon" />
      </a>
    );
  }
  return originalElement;
}

class ManageClassesListing extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      selectedCategoryId: null,
      category: "",
      editMemberForm: false,
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
      deleteMember: false,
      fileList: [],
      classes: [],
      uniqueFitnessTabs: [],
      selectedFitnessType: [],
      editMemberValue: "",
      packages: [],
      packagesCounts: 0,
      classCategory: [],
      defaultPageSize: PAGE_SIZE.PAGE_SIZE_12,
      isInitialProfileSetup: true,
      selectedClassId: "",
      classList: [],
      membershipForm: false,
      isInitialProfileSetup: true,
      selectedMembershipId: "",
      packageList: [],
      hello: 0,
      deleteservice: false,
      deleteClasses: false,
      delClassesId: null,
      addService: false,
      editClassModal: false,
      visible: false,
      visibleDelCat: false,
      delCatId: null,
      delMemId: "",
      fitnestypeid: "",
      editClassData: {},
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.getFitnessClasses();
    this.getFitnessMemberShips();
    let temp = [];
    for (let i = 30; i <= 180; i++) {
      temp.push(i);
    }
    this.setState({ durationOption: temp });

    let tempc = this.state.classes.filter((c) => {
      if (
        c.wellbeing_fitness_type.name ==
        this.state.classes[0].wellbeing_fitness_type.name
      ) {
        return c;
      }
    });
    this.setState({
      selectedFitnessType: tempc,
      selectedCategoryId: tempc,
    });
  }

  /**
   * @method getFitnessMemberShips
   * @description get service details
   */
  getFitnessMemberShips = (page) => {
    const { userDetails } = this.props;
    const { defaultPageSize } = this.state;
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    let reqdata = {
      trader_user_profile_id: trader_user_profile_id,
      page_size: defaultPageSize,
      page: page !== undefined ? page : 1,
    };
    this.props.getFitnessMemberShipListing(reqdata, (res) => {
      if (res.status === 200) {
        let data = res.data;
        this.setState({
          packages: data.packages,
          classCategory: data.fitness_types,
          packagesCounts: data.packages_counts,
        });
      }
    });
  };

  createNewMemberShip = (tabIndex, reqData, images) => {
    const { userDetails } = this.props;
    let req = {
      trader_user_profile_id: this.props.userDetails.user.trader_profile.id,
      packages: JSON.stringify(reqData.membership),
    };
    const formData = new FormData();
    formData.append("trader_user_profile_id", req.trader_user_profile_id);
    formData.append("packages", req.packages);
    this.props.createMemberShipPlan(formData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MEMBERSHIP_CREATE_SUCCESS);
        this.setState({ membershipForm: false });
        this.getFitnessMemberShips();
      }
    });
  };
  onChange = (item, id) => {
    const { userDetails } = this.props;
    console.log("USERDETAILS", userDetails.user.service_category);
    console.log("ITEms", item);
    console.log("USERDETAILS", userDetails.user.trader_profile.active);
    this.setState({ status: userDetails.user.trader_profile.active });
    console.log("Status", this.state.status);
    console.log("ID", id);
    console.log("User_id", userDetails.user.id);
    console.log("SErvice Category", item.service_category_id);
    console.log("Trader_profile_id", item.trader_user_profile_id);
    let form = new FormData();
    form.append("user_id", userDetails.user.id);
    form.append("trader_user_profile_id", item.trader_user_profile_id);
    form.append("service_category_id", item.service_category_id);
    form.append("wellbeing_trader_service_id", id);
    if (this.state.status != 0) {
      let form = new FormData();
      form.append("user_id", userDetails.user.id);
      form.append("trader_user_profile_id", item.trader_user_profile_id);
      form.append("service_category_id", item.service_category_id);
      form.append("wellbeing_trader_service_id", id);
      form.append("status", "Activate");
      this.props.changeStatusFitnessClass(form);
    }

    form.append("status", "Deactivate");
    this.props.changeStatusFitnessClass(form);
  };
  /**
   * @method getFitnessClasses
   * @description get service details
   */
  getFitnessClasses = () => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    this.props.getFitnessClassListing(
      { id: trader_user_profile_id, page_size: 50 },
      (res) => {
        if (res.data.status == 200) {
          let data = res.data && res.data.data;

          let traderClasses =
            data.trader_classes &&
            Array.isArray(data.trader_classes) &&
            data.trader_classes.length
              ? data.trader_classes
              : [];

          const uniqueTabs = [
            ...new Set(
              traderClasses.map((item) =>
                item.wellbeing_fitness_type
                  ? item.wellbeing_fitness_type.name
                  : ""
              )
            ),
          ]; // [ 'A', 'B']

          const uniqueTabsMain = [
            ...new Set(
              traderClasses.map((item) =>
                item.wellbeing_fitness_type ? item.wellbeing_fitness_type : ""
              )
            ),
          ]; // [ 'A', 'B']

          // let selectedFitnessType = traderClasses.filter((c) => {

          //       // if (
          //       //   uniqueTabsMain.length &&
          //       //   c.wellbeing_fitness_type.name == uniqueTabsMain[0].name
          //       // ) {
          //       //   return c;
          //       // }
          //       if(uniqueTabsMain.length && c.wellbeing_fitness_type && c.wellbeing_fitness_type.name == uniqueTabsMain[0].name){
          //         return c;
          //       }
          //     });
          let selectedFitnessType = traderClasses.filter((c) => {
            return (
              c.wellbeing_fitness_type &&
              c.wellbeing_fitness_type.name == uniqueTabsMain[0].name
            );
          });

          this.setState({
            classes: traderClasses,
            uniqueFitnessTabs: uniqueTabsMain,
            selectedFitnessType,
            fitnestypeid: uniqueTabsMain[0]?.id,
          });
        }
        // if (res.data.status == 200) {
        //   console.log('getFitnessClassListing if',res)
        //   let data = res.data && res.data.data;

        //     let traderClasses =
        //       data.trader_classes &&
        //       Array.isArray(data.trader_classes) &&
        //       data.trader_classes.length
        //         ? data.trader_classes
        //         : [];

        //         const uniqueTabs = [
        //           ...new Set(
        //             traderClasses.map((item) => Array.isArray(item.wellbeing_fitness_type) ? item.wellbeing_fitness_type.name : '')
        //           ),
        //         ]; // [ 'A', 'B']

        //         const uniqueTabsMain = [
        //               ...new Set(
        //                 traderClasses.map((item) => item.wellbeing_fitness_type)
        //               ),
        //             ]; // [ 'A', 'B']

        //         let selectedFitnessType = traderClasses.filter((c) => {
        //               if (
        //                 uniqueTabs.length &&
        //                 c.wellbeing_fitness_type.name == uniqueTabs[0]
        //               ) {
        //                 return c;
        //               }
        //             });

        //     this.setState({
        //       classes: traderClasses,
        //       uniqueFitnessTabs: uniqueTabsMain,
        //       selectedFitnessType,
        //     });
        // } else {
        //   console.log('getFitnessClassListing else')
        // }
        // if (res.data.status == 200) {
        //
        //
        //
        //
        //
        // } else{
        //   console.log('in else getFitnessClassListing')
        // }
      }
    );
  };
  onChanged = (item, ite, value) => {
    const { packageList } = this.state;
    const { userDetails } = this.props;
    this.setState({ status: 1 });
    console.log("MEMBERSHIP STATUS", item);
    console.log("MEMBERSHIP STATUS", ite);
    console.log("Package List", packageList);

    if (value) {
      let form = new FormData();
      form.append("wellbeing_fitness_class_package_id", ite.id);
      form.append("status", 1);
      this.props.changeStatusMemberShip(form, (res) => {
        toastr.success(langs.success, "Classes Activated successfully");
      });
    } else {
      let form = new FormData();
      form.append("wellbeing_fitness_class_package_id", ite.id);
      form.append("status", 0);
      this.props.changeStatusMemberShip(form, (res) => {
        toastr.success(langs.success, "Classes Deactivated successfully");
      });
    }
  };

  /**
   * @method createNewClass
   * @description createNewClass  in Fitness
   */
  createNewClass = (tabIndex, reqData, images) => {
    const { userDetails } = this.props;
    let temp = [];
    images.filter((el) => {
      el.originFileObj && temp.push(el.originFileObj);
    });

    let req = {
      trader_user_profile_id: userDetails.user.trader_profile.id,
      classes: reqData,
    };
    const formData = new FormData();
    for (var i = 0; i < temp.length; i++) {
      formData.append("images[]", temp[i]);
    }
    Object.keys(req).forEach((key) => {
      if (typeof req[key] == "object" && key === "classes") {
        formData.append("classes", `${JSON.stringify(req[key])}`);
      } else {
        formData.append(key, req[key]);
      }
    });
    this.props.enableLoading();
    this.props.createFitnessClass(formData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.CLASS_CREATE_SUCCESS);
        this.props.nextStep();
      }
    });
  };
  // Create Class
  EditNewClass = (values) => {
    this.props.enableLoading();
    this.props.createFitnessClass(values, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.CLASS_CREATE_SUCCESS);
        this.setState({ editClassModal: false });
        this.setState({ addService: false });
        this.getFitnessClasses();
      }
    });
  };

  // Update class
  UpdateClass = (values) => {
    this.props.enableLoading();
    this.props.createFitnessClass(values, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.CLASS_CREATE_SUCCESS);
        this.setState({ editClassModal: false });
        this.setState({ addService: false });
        this.getFitnessClasses();
      }
    });
  };
  // add category
  addServiceCategory = (value) => {
    console.log("VAlues", value);
    let requestData = {
      module_type: "fitness",
      name: value.service_available,
      description: "No description",
      status: 1,
    };

    this.props.createClassCategory(requestData, (res) => {
      if (res.status === 200) {
        this.setState({ visible: false });
        toastr.success(langs.success, MESSAGES.MENU_CATEGORY_ADD_SUCCESS);
        this.myformRef.current &&
          this.myformRef.current.setFieldsValue({
            menu_category_name: null,
          });
        this.getFitnessMemberShips();
      }
    });
  };

  // Edit class
  editClassService = (value) => {
    console.log("VAlues", value);
    let requestData = {
      module_type: "fitness",
      name: value.service_available,
      description: "No description",
      status: 1,
    };

    this.props.createClassCategory(requestData, (res) => {
      if (res.status === 200) {
        this.setState({ visible: false });
        toastr.success(langs.success, MESSAGES.MENU_CATEGORY_ADD_SUCCESS);
        this.myformRef.current &&
          this.myformRef.current.setFieldsValue({
            menu_category_name: null,
          });
        this.getFitnessMemberShips();
      }
    });
  };
  handleEditMemberShipSubmit = (obj) => {
    this.props.editMembership(obj, (res) => {
      if (res.status === 200) {
        toastr.success("Success", "Succesfully updated");
        this.setState({ editMemberForm: false });
        this.getFitnessMemberShips();
      } else {
        toastr.error();
      }
    });
  };

  // Delete service category
  deleteServiceCategoryTab = (id) => {
    let obj = {
      wellbeing_fitness_type_id: id,
      // trader_user_profile_id: data.user_id
    };

    this.props.deleteServiceCategory(obj, (res) => {
      console.log("RES", res);
      if (res.status === 200) {
        toastr.success("Delete Successfully", res.data.message);
        this.setState({ deleteservice: false });
        this.setState({ visibleDelCat: false });
        this.setState({ delCatId: null });
        this.getFitnessClasses();
      } else {
        toastr.error("Something went wrong", "delete is Unsuccessfully");
      }
    });
  };
  // Delete classes
  deleteClassesAPI = (id) => {
    let obj = {
      id: id,
      // trader_user_profile_id: data.user_id
    };

    this.props.deleteClass(obj, (res) => {
      console.log("RES", res);
      if (res.status === 200) {
        toastr.success("Delete Successfully", res.data.message);
        this.setState({ deleteClasses: false });
        this.setState({ delClassesId: null });
        this.getFitnessClasses();
      } else {
        toastr.error("Something went wrong", "delete is Unsuccessfully");
      }
    });
  };
  /**
   * @method renderClasses
   * @description render service details
   */
  renderClasses = (service, item) => {
    const { selectedFitnessType, deleteservice } = this.state;

    if (selectedFitnessType && selectedFitnessType.length) {
      return (
        selectedFitnessType &&
        Array.isArray(selectedFitnessType) &&
        selectedFitnessType.map((el, i) => {
          return (
            <div className="menu-content" key={i}>
              <Row gutter={0} className="menu-cell">
                <Col
                  xs={8}
                  sm={8}
                  md={8}
                  lg={8}
                  xl={8}
                  className="item-name-col"
                >
                  <Text strong className="item-name">
                    {el.class_name}
                  </Text>
                  <br />
                  <Text className="item-details">{el.description}</Text>
                </Col>
                <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Text className="duration">
                    {el.class_time ? `${el.class_time}` : "0 mins"}
                  </Text>
                </Col>
                <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Text strong className="item-price">{`AU $${
                    el.price ? `$${el.price}` : ""
                  }`}</Text>
                </Col>
                <Col xs={4} sm={4} md={4} lg={4} xl={4} className="switch-col">
                  <Switch
                    size="medium"
                    defaultChecked={el.is_Active}
                    onChange={() => this.onChange(el, el.id)}
                  />
                </Col>

                <Col xs={4} sm={4} md={4} lg={4} xl={4} className="actions-col">
                  <Link
                    onClick={() => {
                      this.setState({ editClassModal: true,editClassData:el });
                    }}
                  >
                    <svg
                      className="edit-menu"
                      // onClick={() => editMenu(item)}
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
                  <Link>
                    <svg
                      className="delete-menu"
                      onClick={() => {
                        this.setState({ delClassesId: el.id });
                        this.setState({ deleteClasses: true });
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
                  </Link>
                </Col>
              </Row>
            </div>
            // <tr key={i}>
            //   <td className="thumb-block-custom-width">
            //     <div className="thumb">
            //       <img src={el.image} />
            //     </div>
            //   </td>
            //   <td>
            //     <div className="title">
            //       <Text className="strong">{el.class_name}</Text>
            //     </div>
            //     <div className="subtitle">{`${el.description}`}</div>
            //   </td>
            //   <td>
            //     <div className="amount">
            //       <Text className="strong">
            //         <b>{el.class_time ? `${el.class_time} mins` : "0 mins"}</b>
            //       </Text>
            //     </div>
            //   </td>
            //   <td>
            //     <div className="amount">
            //       <Text className="strong">
            //         <b>{el.price ? `$${el.price}` : ""}</b>
            //       </Text>
            //     </div>
            //   </td>
            //   <td>
            //     <div className="edit-link">
            //       <Link
            //         to={`/fitness-vendor-edit-classes/${el.wellbeing_fitness_type_id}/${el.id}`}
            //       >
            //         Edit
            //       </Link>
            //     </div>
            //   </td>
            // </tr>
          );
        })
      );
    }
  };

  /**
   * @method renderFitnessClassesTab
   * @description render service tab
   */
  renderFitnessClassesTab = () => {
    const {
      classes,
      uniqueFitnessTabs,
      selectedCategoryId,
      isInitialProfileSetup,
      selectedClassId,
      classList,
      visibleDelCat,
      deleteservice,
      addService,
    } = this.state;
    const { fitnessPlan } = this.props;
    // let uniqueFitnessTabs = [{
    //   class_name: "test",
    //   description: "asdfghjklqwertyui",
    //   class_time: new Date().getTime(),
    //   price: 50,
    //   is_active: true,
    //   name: "newtest",
    //   id: 12
    // }]
    function getUniqueListBy(arr, key) {
      return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    const uniqueFitnessTab = getUniqueListBy(uniqueFitnessTabs, "id");

    return (
      <Tabs
        className="inner-tabs"
        type="card"
        onTabClick={(e) => {
          let temp = classes.filter((c) => {
            if (
              c.wellbeing_fitness_type &&
              c.wellbeing_fitness_type.name == e
            ) {
              return c;
            }
          });
          this.setState({
            selectedFitnessType: temp,
            selectedCategoryId: temp,
          });
        }}
      >
        {console.log(
          "🚀 ~ file: Listing.js ~ line 234 ~ ManageClassesListing ~ uniqueFitnessTabs",
          uniqueFitnessTabs
        )}
        {Array.isArray(uniqueFitnessTabs) && uniqueFitnessTab.length ? (
          uniqueFitnessTab.map((el, i) => {
            console.log("EL VALUE", el);
            return (
              <TabPane
                tab={
                  <>
                    <span
                      className="category-name"
                      onClick={() => this.setState({ fitnestypeid: el.id })}
                    >
                      {el.name}
                    </span>
                    <span className="tab-actions">
                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("=======================>", el.i);
                          this.setState({ delCatId: el.id });
                          this.setState({ visibleDelCat: true });
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
                key={el.name}
              >
                <div className="reformer-grid-block">
                  {/* Add class form */}
                  <div className="add-class-form">
                    {addService && (
                      <>
                        <button
                          className="close-btn"
                          onClick={() =>
                            this.setState({
                              addService: false,
                              // editService: null,
                              // editServicedetails: null,
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
                          // selectedClassId={selectedClassId}
                          getFitnessClasses={this.getFitnessClasses}
                          classList={classList}
                          changeAllStatus={this.changeAllStatus}
                          EditNewClass={this.EditNewClass}
                          fitnessPlan={fitnessPlan}
                          deleteClass={this.deleteClass}
                          updateClassStatus={this.changeFitnessClassStatus}
                          ids={this.props.loggedInUser.trader_profile_id}
                          selectedClassId={this.state.fitnestypeid}
                        />
                      </>
                    )}
                  </div>

                  {/* Edit Class */}
                  <div className="add-class-form">
                    {this.state.editClassModal  && (
                      <>
                        <button
                          className="close-btn"
                          onClick={() =>
                            this.setState({
                              editClassModal : false,
                              // editService: null,
                              // editServicedetails: null,
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
                          selectedClassId={this.state.fitnestypeid}
                          getFitnessClasses={this.getFitnessClasses}
                          classList={this.state.classList}
                          changeAllStatus={this.changeAllStatus}
                          UpdateClass={this.UpdateClass}
                          fitnessPlan={fitnessPlan}
                          deleteClass={this.deleteClass}
                          updateClassStatus={this.changeFitnessClassStatus}
                          ids={this.props.loggedInUser.trader_profile_id}
                          editClassData={this.state.editClassData}
                        />
                      </>
                    )}
                  </div>

                  {/* <table> */}
                  {!addService && (
                    <div className="menu-header">
                      <Row gutter={0} className="menu-header-inner">
                        <Col
                          xs={8}
                          sm={8}
                          md={8}
                          lg={8}
                          xl={8}
                          className="item-col"
                        >
                          Classes
                        </Col>
                        <Col
                          xs={4}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          className="price-col"
                        >
                          Duration
                        </Col>
                        <Col
                          xs={9}
                          sm={9}
                          md={9}
                          lg={9}
                          xl={9}
                          className="price-col"
                        >
                          Price
                        </Col>
                        <Col
                          xs={3}
                          sm={3}
                          md={3}
                          lg={3}
                          xl={3}
                          className="btn-col"
                        >
                          <Button
                            className="add-btn"
                            type="primary"
                            onClick={() =>
                              this.setState({
                                // selectedCategoryId: el.id,
                                hello: 1,
                                addService: true,
                              })
                            }
                          >
                            <PlusCircleOutlined />
                            Add Class
                          </Button>
                        </Col>
                        {this.state.deleteClasses && (
                          <Modal
                            visible={this.state.deleteClasses}
                            layout="vertical"
                            className={"custom-modal style1 delete-menu-popup"}
                            footer={false}
                            onCancel={() => {
                              this.setState({ deleteClasses: false });
                              this.setState({ delClassesId: null });
                            }}
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
                                      deleteClasses: false,
                                    })
                                  }
                                >
                                  No, Cancel
                                </Button>
                                <Button
                                  className="orange-btn"
                                  onClick={() => {
                                    // this.setState({
                                    //   deleteservice: false,
                                    // });
                                    this.deleteClassesAPI(
                                      this.state.delClassesId
                                    );
                                  }}
                                >
                                  Yes, Delete
                                </Button>
                              </div>
                            </div>
                          </Modal>
                        )}
                      </Row>
                    </div>
                  )}

                  {selectedCategoryId && (
                    <>
                      {/* <div
                        onClick={() =>
                          this.setState({
                            selectedCategoryId: null,
                            // editingmenu: false,
                            // editMenuInitial: null,
                            // fileList: []
                          })
                        }
                        className="close-btn"
                      >
                        <img
                          src={require("../../../../../assets/images/icons/close-btn-menu.svg")}
                          alt=""
                        />
                      </div> */}
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
                      {this.renderClasses(el, el.trader_user_profile_services)}
                      <div></div>
                    </>
                  )}

                  {/* </table> */}
                </div>
              </TabPane>
            );
          })
        ) : (
          <NoContentFound />
        )}
      </Tabs>
    );
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    this.getFitnessMemberShips(e);
  };

  handleCLose = () => {
    this.setState({ editMemberForm: false });
  };

  handleEditMemberShip = (value) => {
    this.setState({ editMemberForm: true });
    this.setState({ editMemberValue: value });
  };
  deleteMemberShip = (value) => {
    axios.delete(`${API.createMembership}/${value}`).then((res) => {
      if (res.status == 200) {
        toastr.success("Success", "Deleted Successfully");
        this.setState({ delMemId: "" });
        this.setState({ deleteMember: false });
        this.getFitnessMemberShips();
      }
    });
  };

  handleDeleteMemberShip = (value) => {
    this.setState({ delMemId: value });
    this.setState({ deleteMember: true });
  };
  /**
   * @method renderFitnesspackagesTab
   * @description render service tab
   */
  renderFitnesspackagesTab = () => {
    const { packages } = this.state;
    return Array.isArray(packages) && packages.length ? (
      packages.map((el, i) => {
        return (
          <tr key={i}>
            <td className="thumb-block-memeber-custom-width">
              <div className="membership-plan-name">{el.name}</div>
              <div className="membership-plan-text">{`${el.detail} mins`}</div>
            </td>

            <td>
              <div className="duration">
                {/* <Text className="strong">{`${el.class_count} Times X ${el.duration} Weeks`}</Text> */}
                5 Times
              </div>
            </td>
            <td>
              <div className="per-week">4 Weeks</div>
            </td>
            <td>
              <div className="amount">{`$${el.price}`}</div>
            </td>
            <td>
              <div className="switch">
                <Switch
                  defaultChecked={el.is_active}
                  onChange={(e) => this.onChanged(el.is_active, el, e)}
                />
              </div>
              <div className="edit-delete">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    this.handleEditMemberShip(el);
                  }}
                >
                  <img
                    src={require("../../../../../assets/images/icons/edit-gray.svg")}
                    alt="edit"
                  />
                </a>
                <a href="javascript:void(0)">
                  <img
                    src={require("../../../../../assets/images/icons/delete.svg")}
                    alt="delete"
                    onClick={() => {
                      this.handleDeleteMemberShip(el.id);
                    }}
                  />
                </a>
              </div>
              {/* <div className="edit-block">
                <Text
                  className="edit-link"
                  onClick={(e) => {
                    this.props.history.push({
                      pathname: `/fitness-vendor-edit-membership/${el.id}`,
                      state: {
                        tabIndex: "2",
                      },
                    });
                  }}
                >
                  Edit
                </Text>
              </div> */}
            </td>
            <td></td>
          </tr>
        );
      })
    ) : (
      <NoContentFound />
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      packagesCounts,
      defaultPageSize,
      membershipForm,
      isInitialProfileSetup,
      selectedMembershipId,
      packageList,
      visibleDelCat,
      deleteservice,
      visible,
    } = this.state;

    const { TabPane } = Tabs;
    const { fitnessPlan } = this.props;
    return (
      <Layout className="create-membership-block">
        <Layout>
          <AppSidebar
            activeTabKey={DASHBOARD_KEYS.MANAGE_CLASSES}
            history={history}
          />
          <Layout>
            <div
              className="my-profile-box view-class-tab"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section manager-page ">
                  <div className="left">
                    <Title level={2}>Manage classes</Title>
                  </div>
                  {/* <div className="right"><Button className="orange-btn">My Bookings</Button></div> */}
                </div>
                <Card className="profile-content-box" bordered={false} title="">
                  <Row className="edit-add-right-btn">
                    <Col>
                      <Button
                        htmlType="button"
                        type="primary"
                        size="middle"
                        className="orange-outline-btn"
                        // style={{ backgroundColor: '#EE4929' }}
                        onClick={() => this.setState({ visible: true })}
                      >
                        Add Category
                      </Button>
                    </Col>

                    {this.state.visible && (
                      <Modal
                        title="Add Category"
                        visible={this.state.visible}
                        layout="vertical"
                        className={
                          "custom-modal style1 edit-menu-category-popup"
                        }
                        footer={false}
                        onCancel={() => this.setState({ visible: false })}
                      >
                        {/* <Title level={3}>Add category</Title> */}
                        <Form
                          onFinish={this.addServiceCategory}
                          layout={"vertical"}
                          ref={this.myformRef}
                          className="select-category-block mb-30"
                        >
                          <div className="padding">
                            <div className="popup-footer">
                              <Form.Item name="service_available">
                                <Select placeholder="Select service type">
                                  {this.state.classCategory &&
                                    this.state.classCategory.map(
                                      (keyName, i) => {
                                        return (
                                          <Option
                                            key={keyName.id}
                                            value={keyName.name}
                                            onClick={() => {
                                              this.onService();
                                            }}
                                          >
                                            {keyName.name}
                                          </Option>
                                        );
                                      }
                                    )}
                                </Select>
                              </Form.Item>
                              <Form.Item>
                                <Button
                                  className="clear-btn"
                                  onClick={() =>
                                    this.setState({
                                      visible: false,
                                    })
                                  }
                                >
                                  Cancel
                                </Button>

                                <Button
                                  className="orange-btn"
                                  htmlType="submit"
                                >
                                  Add
                                </Button>
                              </Form.Item>
                            </div>
                          </div>
                        </Form>
                      </Modal>
                    )}

                    {/* {this.state.editClassModal && (
                      <Modal
                        title="Edit Class"
                        visible={this.state.editClassModal}
                        layout="vertical"
                        className={
                          "custom-modal style1 edit-menu-category-popup"
                        }
                        footer={false}
                        onCancel={() =>
                          this.setState({ editClassModal: false })
                        }
                      >
                        <EditClassForm
                          nextStep={() => this.props.nextStep()}
                          isEditPage={false}
                          isInitialProfileSetup={isInitialProfileSetup}
                          selectedClassId={this.state.selectedClassId}
                          getFitnessClasses={this.getFitnessClasses}
                          classList={this.state.classList}
                          changeAllStatus={this.changeAllStatus}
                          EditNewClass={this.EditNewClass}
                          fitnessPlan={fitnessPlan}
                          deleteClass={this.deleteClass}
                          updateClassStatus={this.changeFitnessClassStatus}
                          ids={this.props.loggedInUser.trader_profile_id}
                        />
                      </Modal>
                    )} */}
                  </Row>
                  <Tabs
                    className="tabs-listing manage-classes-listing"
                    defaultActiveKey="1"
                  >
                    <TabPane tab="Classes" key="1">
                      <div className="profile-content-box box-profile">
                        {this.renderFitnessClassesTab()}
                      </div>
                    </TabPane>
                    <TabPane tab="Memberships" key="2">
                      {/* <Card
                        bordered={true}
                        title="Memberships"
                        className="profile-content-box box-profile view-member"
                      > */}
                      <div className="membership-plan-grid-block reformer-grid-block">
                        <table className="membership-grid">
                          {!membershipForm && (
                            <tr className="grid-head">
                              <td className="thumb-block-memeber-custom-width">
                                <div className="title">
                                  <Text className="strong">
                                    Membership plan
                                  </Text>
                                </div>
                              </td>

                              <td>
                                <div className="duration">
                                  <Text className="strong">Duration</Text>
                                </div>
                              </td>
                              <td>
                                <div className="duration">
                                  <Text className="strong">Per week</Text>
                                </div>
                              </td>
                              <td>
                                <div className="amount">
                                  <Text className="strong">Price</Text>
                                </div>
                              </td>
                              <td>
                                <div className="edit-block">
                                  <Button
                                    className="orange-btn"
                                    type="primary"
                                    onClick={() =>
                                      this.setState({ membershipForm: true })
                                    }
                                  >
                                    <PlusCircleOutlined />
                                    Add Membership Plan
                                  </Button>
                                </div>

                                {this.state.deleteMember && (
                                  <Modal
                                    visible={this.state.deleteMember}
                                    layout="vertical"
                                    className={
                                      "custom-modal style1 delete-menu-popup"
                                    }
                                    footer={false}
                                    onCancel={() => {
                                      this.setState({ deleteMember: false });
                                      this.setState({ delMemId: "" });
                                    }}
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
                                        Are you sure you want to delete this
                                        Membership?
                                      </Title>
                                      <div className="popup-footer">
                                        <Button
                                          className="clear-btn"
                                          onClick={() =>
                                            this.setState({
                                              deleteMember: false,
                                            })
                                          }
                                        >
                                          No, Cancel
                                        </Button>
                                        <Button
                                          className="orange-btn"
                                          onClick={() => {
                                            // this.setState({
                                            //   deleteservice: false,
                                            // });
                                            this.deleteMemberShip(
                                              this.state.delMemId
                                            );
                                          }}
                                        >
                                          Yes, Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </Modal>
                                )}
                              </td>
                              <td></td>
                            </tr>
                          )}

                          {membershipForm && (
                            <>
                              <tr className="add-membership-plan-block">
                                <td colspan="6">
                                  <div
                                    onClick={() =>
                                      this.setState({
                                        membershipForm: null,
                                      })
                                    }
                                    className="close-btn"
                                  >
                                    <img
                                      src={require("../../../../../assets/images/icons/close-btn-menu.svg")}
                                      alt=""
                                    />
                                  </div>
                                  <EditMemberShipForm
                                    isEditPage={false}
                                    nextStep={() => this.props.nextStep()}
                                    isInitialProfileSetup={
                                      isInitialProfileSetup
                                    }
                                    selectedMembershipId={selectedMembershipId}
                                    getFitnessMemberShip={
                                      this.getFitnessMemberShips
                                    }
                                    packageList={packageList}
                                    changeAllStatus={this.changeAllStatus}
                                    createClass={this.createNewMemberShip}
                                    fitnessPlan={fitnessPlan}
                                    deleteMemberShip={this.deleteClass}
                                    updateClassStatus={
                                      this.changeFitnessClassStatus
                                    }
                                  />
                                </td>
                              </tr>
                            </>
                          )}
                          {this.renderFitnesspackagesTab()}
                        </table>
                      </div>
                      {/* </Card> */}
                      {packagesCounts > defaultPageSize && (
                        <Pagination
                          defaultCurrent={1}
                          defaultPageSize={defaultPageSize} //default size of page
                          onChange={this.handlePageChange}
                          total={packagesCounts} //total number of card data available
                          itemRender={itemRender}
                          className={"mb-20"}
                        />
                      )}
                    </TabPane>
                  </Tabs>
                  <Modal
                    title="Edit MemberShip"
                    visible={this.state.editMemberForm}
                    className={"custom-modal style1"}
                    footer={false}
                    onCancel={() => this.setState({ editMemberForm: false })}
                    destroyOnClose={true}
                  >
                    <MemberShipForm
                      isEditPage={false}
                      nextStep={() => this.props.nextStep()}
                      isInitialProfileSetup={isInitialProfileSetup}
                      handleClose={this.handleCLose}
                      selectedMembershipId={selectedMembershipId}
                      userDetails={this.props.userDetails}
                      getFitnessMemberShip={this.getFitnessMemberShips}
                      packageList={packageList}
                      changeAllStatus={this.changeAllStatus}
                      editData={this.state.editMemberValue}
                      // createClass={this.createNewMemberShip}
                      fitnessPlan={fitnessPlan}
                      deleteMemberShip={this.deleteClass}
                      updateClassStatus={this.changeFitnessClassStatus}
                      onSubmit={this.handleEditMemberShipSubmit}
                    />
                  </Modal>
                  {visibleDelCat && (
                    <Modal
                      visible={visibleDelCat}
                      layout="vertical"
                      className={
                        "custom-modal style1 delete-menu-popup delete-category-popup"
                      }
                      footer={false}
                      onCancel={() => {
                        this.setState({ visibleDelCat: false });
                        this.setState({ delCatId: null });
                      }}
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
                              // this.deleteMenuCategory(visibleDelCat);
                              // this.setState({
                              //   visibleDelCat: false,
                              // });
                              this.deleteServiceCategoryTab(
                                this.state.delCatId
                              );
                            }}
                          >
                            Yes, Delete
                          </Button>
                        </div>
                      </div>
                    </Modal>
                  )}
                </Card>
              </div>
            </div>
          </Layout>
        </Layout>
        {/* {deleteservice && (
          <Modal
            visible={true}
            layout="vertical"
            className={"custom-modal style1 delete-menu-popup"}
            footer={false}
            onCancel={() => this.setState({ deleteservice: false })}
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
                      deleteservice: false,
                    })
                  }
                >
                  No, Cancel
                </Button>
                <Button
                  className="orange-btn"
                  onClick={() => {
                    // this.setState({
                    //   deleteservice: false,
                    // });
                    this.deleteServiceCategoryTab(this.state.delCatId)
                  }}
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </Modal>
        )} */}
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
  editServices,
  getFitnessMemberShipListing,
  getFitnessClassListing,
  getBeautyServices,
  deleteClass,
  deleteServiceCategory,
  changeStatusFitnessClass,
  changeStatusMemberShip,
  createClassCategory,
  createFitnessClass,
  editMembership,
  createMemberShipPlan,
})(ManageClassesListing);
