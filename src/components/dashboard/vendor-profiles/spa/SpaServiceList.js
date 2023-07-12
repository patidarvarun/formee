import React, { Fragment } from "react";
import { Link } from "react-router-dom";
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
  createServiceCategory,
  getSpaServices,
  deleteServices,
  getServiceCategory,
} from "../../../../actions";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../../config/Config";
import Icon from "../../../customIcons/customIcons";
import { convertHTMLToText } from "../../../common";
import { required, validNumber } from "../../../../config/FormValidation";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import "../../vendor-profiles/myprofilerestaurant.less";
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;
const rules = [required("")];
const { Panel } = Collapse;
const { TextArea } = Input;

class SpaServiceList extends React.Component {
  formRef = React.createRef();
  editRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      services: [],
      editCategorydetails: null,
      editCategory: null,
      createCategoryForm: false,
      editt: [],
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.getServiceDetail();
  }

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props;
    this.props.enableLoading();
    this.props.getServiceCategory(loggedInUser.trader_profile_id, (res) => {
      console.log(
        "🚀 ~ file: SpaServiceList.js ~ line 80 ~ SpaServiceList ~ this.props.getServiceCategory ~ res",
        res
      );
      this.props.disableLoading();
      if (res.status === 200) {
        let data = res.data && res.data.data;
        let services = data ? data : [];
        // let editt = res.data.data.find((status) => {
        //   return status;
        // });
        // &&
        // Array.isArray(data.wellbeing_trader_service) &&
        // data.wellbeing_trader_service.length
        //   ? data.wellbeing_trader_service
        // : [];
        // this.setState({ editt: editt });

        this.setState({ services: services });
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

  /**
   * @method renderUserServices
   * @description render service details
   */
  renderUserServices = (item) => {
    // function onChange(checked) {}
    if (item && item.length) {
      return (
        item &&
        Array.isArray(item) &&
        item.map((el, i) => {
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
              <td colspan="2">
                <div className="switch">
                  <Switch
                    defaultChecked={el.service_status === 1 ? true : false}
                    // onChange={(checked) => {
                    //   let requestData = {
                    //     service_id: el.id ? el.id : "",
                    //     status: checked ? 1 : 0,
                    //   };
                    //   this.props.activateAndDeactivateService(
                    //     requestData,
                    //     (res) => {
                    //       if (res.status === 200) {
                    //         toastr.success(res.data && res.data.data);
                    //         this.getServiceDetail();
                    //       }
                    //     }
                    //   );
                    // }}
                    onChange={(e) => this.onChange(e, el)}
                  />
                </div>
                {/* <div className="edit-delete">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      this.props.history.push(`/edit-spa-service/${el.id}`)
                    }
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
                </div> */}
              </td>
            </tr>
          );
        })
      );
    } else {
      return <NoContentFound />;
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
    // this.setState({ fileList: [], serviceInfo: "", isEditflag: false });
  };

  onFinish = (value) => {
    console.log("$$$$$$$$$$$$$$$", value);
    const { loggedInUser } = this.props;
    const { editCategory, editCategorydetails } = this.state;

    let reqData = {
      module_type: loggedInUser.user_type,
      name: value.name,
      description: value.description,
      status: 1,
    };

    this.props.createServiceCategory(reqData, (res) => {
      if (res.status === 200) {
        toastr.success("Vendor service has been created successfully.");
        if (this.props.loggedInUser.user_type === "beauty") {
          window.location = "/services";
        } else {
          window.location = "/vendor-services";
        }
        this.formRef.current.resetFields();
        this.getServiceDetail();
      }
    });
  };

  handleCancel = () => {
    if (this.props.loggedInUser.user_type === "beauty") {
      window.location = "/services";
    } else {
      window.location = "/vendor-services";
    }
  };

  createCategoryForm = (e) => {
    const { editCategory } = this.state;
    return (
      <Form
        onFinish={this.onFinish}
        className="my-form"
        layout="vertical"
        ref={this.formRef}
        id="spa-form"
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
          <Form.Item className="btn-block">
            <Button
              size="middle"
              className="clear-btn"
              htmlType={"button"}
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="middle"
              className="add-btn"
              type="primary"
              htmlType={"submit"}
            >
              Add
            </Button>
          </Form.Item>
        </Col>
      </Form>
    );
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    // const { editt } = this.state;
    // console.log("$$$$$$$$$$$$$$$$$$$", editt.status);
    const { services } = this.state;
    let id = services && services.length ? services[0].id : "";
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%", id);
    return (
      <Layout className="create-membership-block profile-beauty-service">
        <Layout className="create-membership-block profile-beauty-service profile-spa-service">
          <AppSidebar history={history} />
          <Layout>
            <div className="my-profile-box" style={{ minHeight: 800 }}>
              <div className="card-container signup-tab service-management-wrapper">
                <div className="top-head-section">
                  <Row>
                    <Col md={12}>
                      <div className="left">
                        <Title level={2}>Service Management</Title>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="head-right">
                        <button
                          className="orange-btn"
                          onClick={() =>
                            this.setState({ createCategoryForm: true })
                          }
                        >
                          Add Category
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div
                  className="add-service-category-form"
                  // onClick={() =>
                  //   this.setState({ createCategoryForm: true })
                  // }
                >
                  {/* Add Category */}
                  {this.state.createCategoryForm
                    ? this.createCategoryForm()
                    : null}
                </div>
                <Card
                  bordered={false}
                  className="profile-content-box edit"
                  extra={
                    services && services.length !== 0 ? (
                      <Fragment>
                        <Space
                          align={"center"}
                          className={"blue-link"}
                          style={{ cursor: "pointer" }}
                          size={9}
                          onClick={() =>
                            this.props.history.push(`/edit-spa-service/${id}`)
                          }
                        >
                          Edit
                          <img
                            src={require("../../../../assets/images/icons/edit-pencil.svg")}
                            alt="delete"
                          />
                        </Space>
                      </Fragment>
                    ) : (
                      ""
                      // <Space
                      //   align={"center"}
                      //   className={"blue-link"}
                      //   style={{ cursor: "pointer" }}
                      //   size={9}
                      //   onClick={() =>
                      //     this.setState({ createCategoryForm: true })
                      //   }
                      // >
                      //   Add Category
                      //   <div className="profile-setup-condition-block">
                      //     <Row gutter={[38, 38]}>
                      //       <Col className="gutter-row" xs={24} sm={24} md={21}>
                      //         <div className="restaurant-content-block create-service-content-block mt-40">
                      //           <div className="restaurant-tab card">
                      //             <Row>
                      //               <div className="restaurant-content-block">
                      //                 {this.state.createCategoryForm
                      //                   ? this.createCategoryForm()
                      //                   : null}
                      //               </div>
                      //             </Row>
                      //           </div>
                      //         </div>
                      //       </Col>
                      //     </Row>
                      //   </div>
                      //   {/* {this.state.createCategoryForm
                      //     ? this.createCategoryForm()
                      //     : null} */}
                      // </Space>
                    )
                  }
                >
                  {services.length !== 0 ? (
                    <Tabs defaultActiveKey="1">
                      {services.map((el, i) => {
                        return +el.status === 0 ? null : (
                          <TabPane tab={el.name} key={el.id}>
                            <Row gutter={[38, 38]}>
                              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                <h3>{el.name}</h3>
                                <p>{el.description}</p>
                              </Col>
                              <Col
                                className="gutter-row"
                                xs={24}
                                sm={24}
                                md={24}
                                lg={16}
                                xl={16}
                              >
                                <Card className="restaurant-tab test">
                                  <Row>
                                    <div className="restaurant-content-block">
                                      <div className="reformer-grid-block">
                                        <table>
                                          {this.renderUserServices(
                                            el.trader_services
                                          )}
                                        </table>
                                      </div>
                                    </div>
                                  </Row>
                                </Card>
                              </Col>
                            </Row>
                          </TabPane>
                        );
                      })}
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
                  ) : (
                    <div className="no-records">
                      <h3>No Records Found</h3>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </Layout>
        </Layout>
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
  createServiceCategory,
  getSpaServices,
  deleteServices,
  enableLoading,
  disableLoading,
  getServiceCategory,
})(SpaServiceList);
