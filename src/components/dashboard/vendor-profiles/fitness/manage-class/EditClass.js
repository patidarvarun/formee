import React from "react";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../../config/localization";
import { connect } from "react-redux";
import { Steps, Layout, Typography, Tabs, Card, Space } from "antd";
import Icon from "../../../../customIcons/customIcons";
import {
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
  getFitnessClassListing,
  deleteFitnessClass,
  getFitnessTypes,
  removeFitnessClassTime,
} from "../../../../../actions";
import AppSidebar from "../../../../dashboard-sidebar/DashboardSidebar";
import { EditClassForm } from "./EditClassForm";
import { EditMemberShipForm } from "./EditMembershipForm";
import { DEFAULT_IMAGE_CARD, PAGE_SIZE } from "../../../../../config/Config";
import history from "../../../../../common/History";
import { MESSAGES } from "../../../../../config/Message";

const { Title, Text } = Typography;

const { Step } = Steps;
const { TabPane } = Tabs;

class EditFitnessClass extends React.Component {
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
      uniqueFitnessTabs: [],
      selectedFitnessType: [],
      activeKey: "",
    };
  }

  componentDidMount() {
    const { id } = this.props.userDetails;
    let state = this.props.history && this.props.history.location.state;
    if (state && state.tabIndex !== undefined) {
      this.setState({ defaultActiveTab: state.tabIndex });
    }

    this.props.getFitnessTypes();
    this.getFitnessClasses();
    this.getFitnessMemberShips();
  }

  /**
   * @method getFitnessMemberShips
   * @description get service details
   */
  getFitnessMemberShips = (page) => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    let reqdata = {
      trader_user_profile_id: trader_user_profile_id,
      page_size: PAGE_SIZE.PAGE_SIZE_12,
      page: page !== undefined ? page : 1,
    };
    this.props.getFitnessMemberShipListing(reqdata, (res) => {
      if (res.status === 200) {
        let data = res.data;

        let id = this.props.match.params.packageId;

        this.setState({
          packageList: data.packages,
          selectedMembershipId: id,
          packagesCounts: data.packages_counts,
        });
      }
    });
  };

  /**
   * @method getFitnessClasses
   * @description get service details
   */
  getFitnessClasses = () => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id;
    this.props.enableLoading();
    this.props.getFitnessClassListing({ id: trader_user_profile_id }, (res) => {
      if (res.data && res.data.status === 200) {
        let data = res.data && res.data.data;
        let traderClasses =
          data.trader_classes &&
          Array.isArray(data.trader_classes) &&
          data.trader_classes.length
            ? data.trader_classes
            : [];
        const uniqueTabs = [
          ...new Set(
            traderClasses.map((item) => item.wellbeing_fitness_type.name)
          ),
        ]; // [ 'A', 'B']
        let selectedFitnessType = traderClasses.filter((c) => {
          if (
            uniqueTabs.length &&
            c.wellbeing_fitness_type.name == uniqueTabs[0]
          ) {
            return c;
          }
        });

        let id = this.props.match.params.id;
        let classId = this.props.match.params.classId;

        if (id !== undefined) {
          let selectedFitnessClassList = traderClasses.filter((c) => {
            if (c.wellbeing_fitness_type.id == id) {
              return c;
            }
          });
          let filteredData =
            selectedFitnessClassList &&
            selectedFitnessClassList.filter(
              (e) => Number(e.id) === Number(classId)
            );
          let activeTab =
            Array.isArray(filteredData) && filteredData.length
              ? filteredData[0].wellbeing_fitness_type.name
              : "";
          this.setState({
            classes: traderClasses,
            activeKey: activeTab,
            selectedFitnessType,
            uniqueFitnessTabs: uniqueTabs,
            selectedClassId: classId,
            classList: selectedFitnessClassList,
            selectedFitnessClassList,
          });
          //
        } else {
          let selectedFitnessClassList = traderClasses.filter((c) => {
            if (
              c.wellbeing_fitness_type.id ==
              traderClasses[0].wellbeing_fitness_type.id
            ) {
              return c;
            }
          });
          let filteredData =
            selectedFitnessClassList &&
            selectedFitnessClassList.filter(
              (e) => Number(e.id) === Number(classId)
            );
          let activeTab =
            Array.isArray(filteredData) && filteredData.length
              ? filteredData[0].wellbeing_fitness_type.name
              : "";
          this.setState({
            activeKey: activeTab,
            classes: traderClasses,
            selectedFitnessType,
            uniqueFitnessTabs: uniqueTabs,
            selectedClassId:
              Array.isArray(traderClasses) && traderClasses.length
                ? traderClasses[0].id
                : "",
            classList: selectedFitnessClassList,
            selectedFitnessClassList,
          });
        }
      }
      this.props.disableLoading();
    });
  };

  /**
   * @method createNewClass
   * @description create New Class
   */
  createNewClass = (tabIndex, reqData, images) => {
    const { userDetails } = this.props;
    if (tabIndex === 1) {
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
      //
      // return
      // this.props.enableLoading()
      this.props.createFitnessClass(formData, (res) => {
        // this.props.disableLoading()
        if (res.status === 200) {
          this.getFitnessClasses();
          this.props.history.push("/fitness-vendor-manage-classes");
          toastr.success(langs.success, MESSAGES.CLASS_UPDATE_SUCCESS);
        }
      });
    } else {
      let req = {
        trader_user_profile_id: userDetails.user.trader_profile.id,
        packages: JSON.stringify(reqData.membership),
      };

      const formData = new FormData();
      formData.append("trader_user_profile_id", req.trader_user_profile_id);
      formData.append("packages", req.packages);
      this.props.enableLoading();
      this.props.createMemberShipPlan(formData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
          this.getFitnessMemberShips();
          this.props.history.push("/fitness-vendor-manage-classes");
          toastr.success(langs.success, MESSAGES.MEMBERSHIP_UPDATE_SUCCESS);
        }
      });
    }
  };

  /**
   * @method changeFitnessClassStatus
   * @description change Fitness Class Status single
   */
  changeFitnessClassStatus = (tabIndex, status, el) => {
    if (tabIndex === 1) {
      let reqData = {
        status: status === true ? 1 : 0,
        trader_class_id: el.id,
      };
      this.props.changeStatusFitnessClass(reqData, (res) => {
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.CLASS_CHANGE_STATUS_SUCCESS);
          this.getFitnessClasses();
        }
      });
    } else {
      let reqData = {
        status: status === true ? 1 : 0,
        wellbeing_fitness_class_package_id: el.id,
      };
      this.props.changeStatusMemberShip(reqData, (res) => {
        if (res.status === 200) {
          toastr.success(
            langs.success,
            MESSAGES.MEMBERSHIP_CHANGE_STATUS_SUCCESS
          );
          this.getFitnessMemberShips();
        }
      });
    }
  };

  /**
   * @method changeAllStatus
   * @description change All classes Status
   */
  changeAllStatus = (tabIndex, status, el) => {
    const { trader_profile } = this.props.userDetails.user;
    if (tabIndex === 1) {
      let reqData = {
        status: status,
        trader_user_profile_id: trader_profile.id,
      };
      this.props.changeStatusOfAllFitnessClass(reqData, (res) => {
        if (res.status === 200) {
          toastr.success(
            langs.success,
            MESSAGES.ALL_CLASS_CHANGE_STATUS_SUCCESS
          );
          this.getFitnessClasses();
        }
      });
    } else {
      let reqData = {
        status: status,
        trader_user_profile_id: trader_profile.id,
      };
      this.props.changeStatusOfAllFitnessMembership(reqData, (res) => {
        if (res.status === 200) {
          toastr.success(
            langs.success,
            MESSAGES.ALL_MEMBERSHIP_CHANGE_STATUS_SUCCESS
          );
          this.getFitnessMemberShips();
        }
      });
    }
  };

  /**
   * @method deleteClass
   * @description deleteClass class
   */
  deleteClass = (tabIndex, el) => {
    if (tabIndex === 1) {
      let reqData = {
        trader_class_id: el.id,
      };
      console.log("REQuest Data", reqData);
      this.props.deleteFitnessClass(reqData, (res) => {
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.CLASS_DELETE_SUCCESS);
          this.getFitnessClasses();
        }
      });
    } else {
      let reqData = {
        id: el.id,
      };
      this.props.deleteFitnessMemberShip(reqData, (res) => {
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.CLASS_DELETE_SUCCESS);
          this.getFitnessMemberShips();
        }
      });
    }
  };

  /**
   * @method deleteClassTime
   * @description delete class Time
   */
  deleteClassTime = (el, callback) => {
    let reqData = {
      trader_classes_schedule_id: el,
      status: 0,
    };
    this.props.enableLoading();
    this.props.removeFitnessClassTime(reqData, (res) => {
      this.props.disableLoading();
      callback(res);
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.CLASS_SHEDULE_DELETE_SUCCESS);
        this.getFitnessMemberShips();
      }
    });
  };

  /**
   * @method renderFitnessClassesTab
   * @description render service tab
   */
  renderFitnessClassesTab = () => {
    const {
      classList,
      activeKey,
      selectedClassId,
      classes,
      uniqueFitnessTabs,
      selectedFitnessType,
    } = this.state;
    const { fitnessPlan } = this.props;
    let defaultTab =
      Array.isArray(classes) && !activeKey
        ? classes[0].wellbeing_fitness_type.name
        : String(activeKey);
    return (
      <Tabs
        activeKey={defaultTab}
        className="inner-tabs"
        type="card"
        onTabClick={(e) => {
          let temp = classes.filter((c) => {
            if (c.wellbeing_fitness_type.name == e) {
              return c;
            }
          });
          this.setState({
            activeKey: e,
            classList: temp,
            selectedClassId: temp.length && temp[0].id,
          });
        }}
      >
        {uniqueFitnessTabs.map((el, i) => {
          return (
            <TabPane tab={el} key={el}>
              <div
                className="my-profile-box createmembership"
                style={{ minHeight: 800 }}
              >
                <EditClassForm
                  isEditPage={true}
                  showOptionList={true}
                  selectedClassId={selectedClassId}
                  removeClassTime={this.deleteClassTime}
                  getFitnessClasses={this.getFitnessClasses}
                  classList={classList}
                  changeAllStatus={this.changeAllStatus}
                  createClass={this.createNewClass}
                  fitnessPlan={fitnessPlan}
                  deleteClass={this.deleteClass}
                  updateClassStatus={this.changeFitnessClassStatus}
                />
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedMembershipId,
      packageList,
      classList,
      selectedClassId,
      defaultActiveTab,
    } = this.state;
    const { fitnessPlan } = this.props;
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout style={{ overflowX: "visible" }}>
            <div className="my-profile-box my-profile-setup manage-edit-memebership">
              <div className="card-container signup-tab">
                <div className="steps-content align-left mt-0">
                  <div className="top-head-section">
                    <div className="left">
                      <Title level={2}>Manage Class</Title>
                    </div>
                    <div className="right"></div>
                  </div>
                  <div className="sub-head-section">
                    <Text>All Fields Required</Text>
                  </div>
                  <Card
                    className="profile-content-box"
                    bordered={false}
                    title=""
                  >
                    <Layout className="create-membership-block">
                      <Layout className="createmembership">
                        <Tabs
                          className="tabs-listing"
                          onTabClick={(e) =>
                            this.setState({ defaultActiveTab: e })
                          }
                          activeKey={defaultActiveTab}
                          //  defaultActiveKey={defaultActiveTab}
                        >
                          <TabPane tab="Edit Class" key="1">
                            <h4 className="mb-10">
                              <b>Create your class</b>
                              <p className="subtitle">
                                Files can be up to 2MB for file types .pdf .jpeg
                                .png .bmp
                              </p>
                            </h4>
                            {this.renderFitnessClassesTab()}
                            {/* <div className='my-profile-box createmembership' style={{ minHeight: 800 }}>
                              <EditClassForm isEditPage={true} showOptionList={true} selectedClassId={selectedClassId} getFitnessClasses={this.getFitnessClasses} classList={classList} changeAllStatus={this.changeAllStatus} createClass={this.createNewClass} fitnessPlan={fitnessPlan} deleteClass={this.deleteClass} updateClassStatus={this.changeFitnessClassStatus} />
                            </div> */}
                          </TabPane>
                          <TabPane tab="Edit Membership" key={"2"}>
                            <div
                              className="my-profile-box createmembership"
                              style={{ minHeight: 800 }}
                            >
                              <EditMemberShipForm
                                isEditPage={true}
                                showOptionList={true}
                                selectedMembershipId={selectedMembershipId}
                                getFitnessMemberShip={
                                  this.getFitnessMemberShips
                                }
                                packageList={packageList}
                                changeAllStatus={this.changeAllStatus}
                                createClass={this.createNewClass}
                                fitnessPlan={fitnessPlan}
                                deleteMemberShip={this.deleteClass}
                                updateClassStatus={
                                  this.changeFitnessClassStatus
                                }
                              />
                            </div>
                          </TabPane>
                        </Tabs>
                      </Layout>
                    </Layout>
                  </Card>
                </div>
                <div className="steps-action align-center mb-32"></div>
              </div>
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
    // userDetails: profile.userProfile !== null ? profile.userProfile : {}
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
  removeFitnessClassTime,
  deleteFitnessMemberShip,
  getFitnessTypes,
})(EditFitnessClass);
