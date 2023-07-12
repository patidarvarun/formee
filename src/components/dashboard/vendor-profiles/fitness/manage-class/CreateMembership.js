import React from "react";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../../config/localization";
import { connect } from "react-redux";
import {
  Layout,
  Button,
  Divider,
  Typography,
  Tabs,
  Card,
  Space,
  Row,
  Switch,
  Col,
  Modal
} from "antd";
import {
  getFitnessMemberShipListing,
  enableLoading,
  disableLoading,
  createMemberShipPlan,
  getFitnessTypes,
  deleteFitnessMemberShip,
  changeStatusMemberShip,
  editMembership
} from "../../../../../actions";
import { EditMemberShipForm } from "./EditMembershipForm";
import { MemberShipForm } from "./Membership";
import { MESSAGES } from "../../../../../config/Message";
import { PlusCircleOutlined, DownOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
const { TabPane } = Tabs;

class CreateMembership extends React.Component {
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
      status:null,
      editMemberForm:false,
    };
  }

  componentDidMount() {
    this.props.getFitnessTypes();
    this.getFitnessMemberShips();
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
        console.log(
          "res.data:------------------------------------------------------------> ",
          res.data
        );

        this.setState({
          packageList: res.data.packages,
          isInitialProfileSetup: data.packages.length >= 1 ? false : true,
        });
      }
    });
  };

  /**
   * @method createNewMemberShip
   * @description create new Membership
   */
  createNewMemberShip = (tabIndex, reqData, images) => {
    const { userDetails } = this.props;
    let req = {
      trader_user_profile_id: userDetails.user.trader_profile.id,
      packages: JSON.stringify(reqData.membership),
    };
    const formData = new FormData();
    formData.append("trader_user_profile_id", req.trader_user_profile_id);
    formData.append("packages", req.packages);
    this.props.createMemberShipPlan(formData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MEMBERSHIP_CREATE_SUCCESS);
        // this.props.nextStep();
        this.setState({addMembership: false})
        this.getFitnessMemberShips();
      }
    });
  };
  handleEditMemberShipSubmit = (obj) => {
    this.props.editMembership(obj, (res) => {
      if (res.status === 200) {
        toastr.success("Success", "Succesfully updated");
        this.setState({ editMemberForm: false })
        this.getFitnessMemberShips();
      } else {
        toastr.error();
      }
    });
  };
  deleteService = (item) => {
    let reqData = {
      id: item,
    };
    deleteFitnessMemberShip(reqData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.CLASS_DELETE_SUCCESS);
      }
    });
    console.log("delete membership", item);
    this.getFitnessMemberShips();
  };
  onChange = (item,ite) => {
    const {packageList}=this.state;
    const{userDetails}=this.props;
    this.setState({status:1})
    console.log("MEMBERSHIP STATUS", item);
    console.log("MEMBERSHIP STATUS", ite);
    console.log("Package List",packageList);
    console.log("State",this.state.status)
    
    if(this.state.status!=0){
      let form=new FormData();
      
form.append("wellbeing_fitness_class_package_id",ite.id)   
      form.append("status", 0);
    this.props.changeStatusMemberShip(form)
  };
    let form=new FormData();
    form.append("wellbeing_fitness_class_package_id",ite.id)
    form.append("status",1)
    this.props.changeStatusMemberShip(form)
  };
  /**
   * @method createDynamicInput
   * @description create services
   */
  createDynamicInput = () => {
    const {
      isInitialProfileSetup,
      selectedMembershipId,
      packageList,
      classList,
      selectedClassId,
      defaultActiveTab,
      addMembership,
    } = this.state;

    const { userDetails, loggedInUser, fitnessPlan } = this.props;
    return (
      <card>
        <div className="tab-inner-item-container">
          <div className="add-class-form">
            {addMembership && (
              <>
                <button
                  className="close-btn"
                  onClick={() =>
                    this.setState({
                      addMembership: false,
                      editService: null,
                      editServicedetails: null,
                    })
                  }
                >
                  <img
                    src={require("../../../../../assets/images/icons/close-btn-menu.svg")}
                    alt=""
                  />
                  <p>close</p>
                </button>
                <EditMemberShipForm
                  isEditPage={false}
                  nextStep={() => this.props.nextStep()}
                  isInitialProfileSetup={isInitialProfileSetup}
                  selectedMembershipId={selectedMembershipId}
                  getFitnessMemberShip={this.getFitnessMemberShips}
                  packageList={packageList}
                  changeAllStatus={this.changeAllStatus}
                  createClass={this.createNewMemberShip}
                  fitnessPlan={fitnessPlan}
                  deleteMemberShip={this.deleteClass}
                  updateClassStatus={this.changeFitnessClassStatus}
                />
              </>
            )}
          </div>
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
                      editData={this.state.editServicedetails}
                      // createClass={this.createNewMemberShip}
                      fitnessPlan={fitnessPlan}
                      deleteMemberShip={this.deleteClass}
                      updateClassStatus={this.changeFitnessClassStatus}
                      onSubmit={this.handleEditMemberShipSubmit}
                    />
                  </Modal>
          <div className="add-service-section">
            {!addMembership && (
              <Row gutter={0} className="menu-header-inner">
                <Col md={12} className="item-col">
                  Membership Plans
                </Col>
                <Col md={2} className="price-col">
                  Duration
                </Col>
                <Col md={2} className="price-col">
                  Per Week
                </Col>
                <Col md={2} className="price-col">
                  Price
                </Col>
                <Col md={6} className="btn-col">
                  <Button
                    type="primary"
                    className="add-service-btn"
                    onClick={() => {
                      this.setState({
                        addMembership: true,
                      });
                    }}
                  >
                    <PlusCircleOutlined /> Add Membership Plan
                  </Button>
                </Col>
              </Row>
            )}
          </div>
          {packageList.length > 0 &&
            packageList.map((el2, j) => {
              return el2.deleted_at ? null : (
                <Row className="spa-item-description">
                  <Col md={12}>
                    <h6>{el2.name}</h6>
                    <span className="time">{el2.detail}</span>
                    {/* <p>Most popular couples option – two hours of complete pampering with two therapists Or book just for you, or for mother daughter day. Ripple can send a team of therapists for group bookings with this package</p> */}
                  </Col>
                  <Col md={2} className="text-center">
                    <h5 className="duration">{`${el2.duration}`}</h5>
                  </Col>
                  <Col md={2}>
                    <h5 className="per-week">5 Times</h5>
                  </Col>
                  <Col md={2} className="text-center">
                    <h5 className="spa-price">{`AU $${el2.price}`}</h5>
                  </Col>
                  <Col md={3} className="text-right">
                    <Switch
                      defaultChecked={el2.is_active}
                      onChange={(e) => this.onChange(el2.is_active,el2)}
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
                            editMemberForm:true
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
                        onClick={() => {
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
        </div>
      </card>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      isInitialProfileSetup,
      selectedMembershipId,
      packageList,
      classList,
      selectedClassId,
      defaultActiveTab,
      
    } = this.state;

    const { userDetails, loggedInUser, fitnessPlan } = this.props;
    return (
      <Layout>
        <Layout style={{ overflowX: "visible" }}>
          <div className="my-profile-box my-profile-setup manage-edit-memebership">
            {/* <div className='card-container signup-tab'> */}
            <div className="steps-content align-left mt-0">
              {/* <Card
                                className='profile-content-box'
                                bordered={false}
                                title='Create Membership Plan'
                            > */}
              <Layout className="create-membership-block">
                <Layout className="createmembership">
                  <Row>
                    <div className="restaurant-content-block add-service-tabs">
                      {this.createDynamicInput()}
                    </div>
                  </Row>
                </Layout>
              </Layout>
              {/* </Card> */}
            </div>
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
            <div className="steps-action align-center mb-32"></div>
            {/* {isInitialProfileSetup && <div className="step-button-block">
                            <Button htmlType='button' type='primary' size='middle' className='btn-blue'
                                onClick={() => this.props.nextStep()}
                            >
                                NEXT
                        </Button>
                        </div>} */}
          </div>
          {/* </div> */}
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
  getFitnessMemberShipListing,
  enableLoading,
  disableLoading,
  createMemberShipPlan,
  getFitnessTypes,
  changeStatusMemberShip,
  editMembership
})(CreateMembership);
