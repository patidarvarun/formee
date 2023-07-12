import React from "react";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import { connect } from "react-redux";
import {
  getCustomLocalStorage,
  removeLocalStorage,
} from "../../../../common/Methods";
import {
  Steps,
  Layout,
  Typography,
  Card,
  Space,
  Spin,
  Row,
  Col,
  Button,
} from "antd";
import Icon from "../../../customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  updateRestaurantProfile,
  checkPaypalAccepted,
  getTraderProfile,
  saveTraderProfile,
  getUserProfile,
  changeUserName,
  changeMobNo,
} from "../../../../actions";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import StepFirst from "./BasicDetail";
import StepSecond from "./VenderDetails";
import AddPortfolio from "./AddPortfolio";
import PaymentScreen from "./PaymentScreen";
// import CreateFitnessClass from '../fitness/index'
import CreateBeautyService from "../beauty/CreateBeautyService";
import RestaurantProfile from "../restaurant/VendorDetails";
import CreateMenu from "../restaurant/CreateMenu";
import CreateMembership from "../fitness/manage-class/CreateMembership";
import CreateSpaServices from "../spa/CreateSpaServices";
// import CreateSpaServices from '../spa/create-service/CreateSpaServices'
import history from "../../../../common/History";
import { MESSAGES } from "../../../../config/Message";
import CreateClass from "../fitness/manage-class/CreateClass";

const { Title, Text } = Typography;

const { Step } = Steps;
const spinIcon = (
  <img
    src={require("./../../../../assets/images/loader1.gif")}
    alt=""
    style={{ width: "64px", height: "64px" }}
  />
);

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    let temp;
    if (
      props.loggedInUser.user_type === "wellbeing" ||
      props.loggedInUser.user_type === "beauty"
    ) {
      temp = [
        "Profile Information",
        " Business Information",
        "Create Services",
        "Upload Documents",
        "Payment Information",
      ];
    } else if (props.loggedInUser.user_type === "fitness") {
      temp = [
        "Profile Information",
        "Business Information",
        "Upload Gallery",
        "Create Classes",
        "Membership Plans",
        "Payment Information",
      ];
    } else if (props.loggedInUser.user_type === "restaurant") {
      temp = [
        "Profile Information",
        "Business Information",
        "Create Menu",
        "Payment Information",
      ];
    } else {
      temp = [
        "Profile Information",
        "Business Information",
        "Upload Documents",
        "Payment Information",
      ];
    }
    this.state = {
      submitFromOutside: false,
      current: 0,
      step1Data: {},
      step2Data: {},
      paymentData: {},
      stepProgress: temp,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { loggedInUser } = this.props;
    const { spaSteps, current } = this.state;
    const queryParams = new URLSearchParams(window.location.search);
    console.log(
      "🚀 ~ file: index.js ~ line 83 ~ EditProfile ~ componentDidMount ~ queryParams",
      queryParams
    );
    console.log("this.props.userDetails index.js 122 ", this.props.userDetails);
    const step = queryParams.get("step");
    const cid = queryParams.get("cid");

    const merchantId = queryParams.get("merchantId");
    if (merchantId != null) {
      let i = this.state.stepProgress.indexOf("Payment Information");
      this.setState({
        current: i,
      });
    } else if (cid != null) {
      let i = this.state.stepProgress.indexOf("Payment Information");
      this.setState({
        current: i,
      });
    } else if (step != null && step !== current) {
      this.setState({
        current: +step,
      });
    } else if (this.props.userDetails) {
      const { id } = this.props.userDetails;
      console.log(
        "this.props.userDetails index.js 143 ",
        this.props.userDetails
      );
      this.props.getTraderProfile({ user_id: id });
      
      let temp = spaSteps;
      if (
        loggedInUser.user_type === "wellbeing" ||
        loggedInUser.user_type === "beauty"
      ) {
        temp = [
          "Profile Information",
          " Business Information",
          "Create Services",
          "Upload Documents",
          "Payment Information",
        ];
      } else if (loggedInUser.user_type === "fitness") {
        temp = [
          "Profile Information",
          "Business Information",
          "Upload Gallery",
          "Create Classes",
          "Membership Plans",
          "Payment Information",
        ];
      } else if (loggedInUser.user_type === "restaurant") {
        temp = [
          "Profile Information",
          "Business Information",
          "Create Menu",
          "Payment Information",
        ];
      } else {
        temp = this.state.stepProgress;
      }
      this.setState({ stepProgress: temp });
    }
    console.log("this.props.userDetails index.js 176 ", this.props);
  }

  /**
   * @method next
   * @description called to go next step
   */
  next = async (reqData, step) => {
    const { loggedInUser } = this.props;
    const current = this.state.current + 1;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let paymentverification = await getCustomLocalStorage("paymentverified");
    if (paymentverification !== undefined) {
      let bd = await getCustomLocalStorage("basicdetail");
      let vd = await getCustomLocalStorage("vendordetails");
      console.log(vd, " xxxxx ")
      this.setState({
        step1Data: bd,
        step2Data: vd,
      });
    }
    if (step === 1) {
      this.setState({ current, step1Data: reqData });
    } else if (step === 2) {
      this.setState({ current });
    } else if (step === 3) {
      this.setState({ current });
    } else if (step === 4) {
      this.setState({ current });
    } else if (step === 5 && loggedInUser.user_type !== "fitness") {
      if (loggedInUser.user_type === "restaurant") {
        this.saveRestaurantProfile();
      } else {
        this.saveTraderProfile();
      }
    } else if (step === 5) {
      this.saveTraderProfile();
    }
  };

  /**
   * @method saveRestaurantProfile
   * @description save restaurant profile
   */
  saveRestaurantProfile = () => {
    const { step1Data, step2Data, paymentData } = this.state;
    console.log(step2Data,"step2dataa")
    const { loggedInUser, traderProfile } = this.props;
    const formData = new FormData();
    const { id } = this.props.userDetails;
    const {
      city,
      state,
      country_code,
      country,
      business_city_id,
      business_state_id,
      state_code,
      business_name,
      business_location,
      business_pincode,
      business_profile,
    } = traderProfile.user;
    let reqData = {
      business_profile_id: business_profile.id,
      email: step1Data.email,
      business_name: step1Data.bussiness_name
        ? step1Data.bussiness_name
        : business_name !== "undefined"
        ? business_name
        : "Restaurant",
      contact_name: step1Data.contact_name,
      user_id: id,

      contact_number: step1Data.mobile_no,
      address: step1Data.address ? step1Data.address : business_location,
      pincode: step1Data.pincode ? step1Data.pincode : business_pincode,
      country: step1Data.country ? step1Data.country : country,
      country_code: step1Data.country_code
        ? step1Data.country_code
        : country_code,
      state: step1Data.state ? step1Data.state : business_city_id,
      city: step1Data.city ? step1Data.city : business_state_id,
      state_code: step1Data.state_code ? step1Data.state_code : state_code,
      // working_hours: JSON.stringify(step2Data.working_hours),
      // rate_per_hour: step2Data.rate_per_hour,

      rate_per_hour: step2Data.rate_per_hour ? step2Data.rate_per_hour : 0,
      is_public_closed: step2Data.is_public_closed ? 1 : 0,
      bsb: paymentData.bsb ? paymentData.bsb : "",
      service_area: step2Data.service_area,
      account_name: paymentData.account_name ? paymentData.account_name : "",
      account_number: paymentData.account_number
        ? paymentData.account_number
        : "",
      service: JSON.stringify(step2Data.service),
      standard_eta: JSON.stringify(step2Data.standard_eta),
      description: step2Data.description,
      basic_quote: step2Data.basic_quote ? 1 : 0,
    };
    Object.keys(reqData).forEach((key) => {
      formData.append(key, reqData[key]);
    });
    Object.keys(step2Data).forEach((key) => {
      if (
        typeof step2Data[key] == "object" &&
        key !== "cover_photo" &&
        key !== "operating_hours" &&
        key !== "cusines" &&
        key !== "dietary"
      ) {
        formData.append(key, JSON.stringify(step2Data[key]));
      } else if (key === "cover_photo") {
        formData.append(
          key,
          step2Data[key] !== undefined ?  JSON.stringify(step2Data[key]) : []
        );
      } else if (key === "operating_hours") {
        step2Data[key].length &&
          step2Data[key].map((el, i) => {
            formData.append(
              `${"operating_hours"}[${i + 1}][start_time]`,
              el.start_time
            );
            formData.append(
              `${"operating_hours"}[${i + 1}][end_time]`,
              el.end_time
            );
            formData.append(`${"operating_hours"}[${i + 1}][day]`, el.day);
          });
      } else if (key === "cusines") {
        step2Data[key].length &&
          // step2Data[key].map((el, i) => {
         
            formData.append(`cusines`, step2Data.cusines);
          // });
      } else if (key === "dietary") {
        step2Data[key].length &&
          // step2Data[key].map((el, i) => {
            formData.append(`dietary`, step2Data.dietary);
          // });
      } else {
        formData.append(key, step2Data[key]);
      }
    });
    formData.append("bsb", paymentData.bsb ? paymentData.bsb : "");
    formData.append(
      "account_name",
      paymentData.account_name ? paymentData.account_name : ""
    );
    formData.append(
      "account_number",
      paymentData.account_number ? paymentData.account_number : ""
    );
    this.props.enableLoading();
    if (paymentData.ispayPalAccepted) {
      this.props.checkPaypalAccepted({ user_id: loggedInUser.id }, (res) => {
        if (res.status === 200) {
          formData.append("is_paypal_accepted", 1);
          this.saveRestaurantProfileData(formData);
        } else {
          formData.append("is_paypal_accepted ", 0);
          this.saveRestaurantProfileData(formData);
        }
      });
    } else {
      this.saveRestaurantProfileData(formData);
    }
  };

  /**
   * @method saveRestaurantProfileData
   * @description save restaurant vendor profile
   */
  saveRestaurantProfileData = (formData) => {
    console.log(formData,"saveRestaurant")
    const { loggedInUser } = this.props;

    this.props.updateRestaurantProfile(formData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.PROFILE_UPDATE_SUCCESS);
        // this.props.history.push('/vendor-profile')
        if (loggedInUser.profile_completed === 1) {
          this.props.history.push("/vendor-profile");
        } else {
          this.props.history.push('/vendor-profile')
          // window.location.assign("/vendor-profile");
        }
      }
    });
  };

  /**
   * @method saveTraderProfile
   * @description save vendor trader profile
   */
  saveTraderProfile = () => {
    const { loggedInUser, traderProfile } = this.props;
    const { id } = this.props.userDetails;
    const {
      city,
      state,
      country_code,
      country,
      business_city_id,
      business_state_id,
      state_code,
      business_name,
      business_location,
      business_pincode,
    } = traderProfile.user;
    const { step1Data, step2Data, paymentData } = this.state;
    let temp = [];
    step2Data &&
      Array.isArray(step2Data.service_images) &&
      step2Data.service_images.filter((el) => {
        if (el.originFileObj) {
          temp.push(el.originFileObj);
        } else {
          temp.push(el.url);
        }
      });
    console.log(temp, "step2Data.service_images: ", step2Data.service_images);

    let reqData = {
      business_name: step1Data.bussiness_name
        ? step1Data.bussiness_name
        : business_name !== "undefined"
        ? business_name
        : "Vendor",
      contact_name: step1Data.contact_name,
      user_id: id,
      capacity_info: step2Data.capacity_info,
      mobile_no_verified: 0,
      event_type_ids:
        step2Data && step2Data.event_type_ids === undefined
          ? ""
          : step2Data.event_type_ids,
      start_from_hr: 0,
      profile_dietary_ids:
        step2Data && step2Data.profile_dietary_ids === undefined
          ? ""
          : step2Data.profile_dietary_ids,
      basic_quote: step2Data.basic_quote ? 1 : 0,
      contact_number: step1Data.mobile_no,
      address: step1Data.address ? step1Data.address : business_location,
      pincode: step1Data.pincode ? step1Data.pincode : business_pincode,
      country: step1Data.country ? step1Data.country : country,
      country_code: step1Data.country_code
        ? step1Data.country_code
        : country_code,
      state: step1Data.state ? step1Data.state : business_city_id,
      city: step1Data.city ? step1Data.city : business_state_id,
      state_code: step1Data.state_code ? step1Data.state_code : state_code,
      service_and_facilities: step2Data.service_and_facilities,
      description: step2Data.description,
      working_hours: JSON.stringify(step2Data.working_hours),
      // rate_per_hour: step2Data.rate_per_hour,
      capacity: step2Data.capacity !== undefined ? step2Data.capacity : "",
      service_type: step2Data.service_type,
      rate_per_hour: step2Data.rate_per_hour ? step2Data.rate_per_hour : 0,
      is_public_closed: step2Data.is_public_closed ? 1 : 0,
      fitness_amenities_ids: step2Data.fitness_amenities_ids,
      ["service_images[]"]: temp,
      booking_cat_id: step2Data.booking_cat_id,
      booking_sub_cat_id: step2Data.booking_sub_cat_id,
      bsb: paymentData.bsb ? paymentData.bsb : "",
      service_area: step2Data.service_area,
      account_name: paymentData.account_name ? paymentData.account_name : "",
      account_number: paymentData.account_number
        ? paymentData.account_number
        : "",
      services: JSON.stringify(step2Data.Services),
      venues: step2Data.venues,
      features: step2Data.features,
    };
    // const formData = new FormData()
    if (loggedInUser.user_type !== "restaurant") {
      const formData = new FormData();
      for (var i = 0; i < temp.length; i++) {
        formData.append("service_images[]", temp[i]);
      }

      // for (var i = 0; i < step2Data.service_area.length; i++) {
      //   formData.append('service_area', step2Data.service_area[i]);
      //
      // }

      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key]);
      });
      if (paymentData.ispayPalAccepted) {
        this.props.checkPaypalAccepted({ user_id: loggedInUser.id }, (res) => {
          if (res.status === 200) {
            formData.append("is_paypal_accepted", 1);
            this.saveTraderProfileData(formData);
          } else {
            formData.append("is_paypal_accepted ", 0);
            this.saveTraderProfileData(formData);
          }
        });
      } else {
        this.saveTraderProfileData(formData);
      }
    }
  };

  /**
   * @method saveTraderProfileData
   * @description save  trader profile data
   */
  saveTraderProfileData = (formData) => {
    removeLocalStorage("paymentverified");
    removeLocalStorage("basicdetail");
    removeLocalStorage("vendordetails");
    const { id } = this.props.userDetails;
    const { loggedInUser } = this.props;
    this.props.enableLoading();
    this.props.saveTraderProfile(formData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.PROFILE_UPDATE_SUCCESS);
        this.props.getTraderProfile({ user_id: id });
        if (loggedInUser.profile_completed === 1) {
          this.props.history.push("/vendor-profile");
        } else {
          window.location.assign("/vendor-profile");
        }
        // this.setState({ current });
      }
    });
  };

  /**
   * @method renderSteps
   * @description manage steps progress
   */
  renderSteps = () => {
    const { current, stepProgress } = this.state;
    return stepProgress.map((el, i) => {
      return (
        <li
          className={
            i === current
              ? "active"
              : i < current
              ? `form-${i + 1}-visited`
              : ""
          }
          key={i}
          onClick={() => {
            if (i < current) {
              this.setState({ current: i });
            }
          }}
        >
          <Link to="">{`${i + 1}.   ${el}`}</Link>
        </li>
      );
    });
  };

  /**
   * @method previousStep
   * @description called to go previous step
   */
  previousStep = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  /**
   * @method getSubHeader
   * @description Evaluates dynamic subheader
   */
  getSubHeader = (userType, title) => {
    if (
      [
        "handyman",
        "events",
        "trader",
        "restaurant",
        "beauty",
        "wellbeing",
        "fitness",
      ].includes(userType)
    ) {
      switch (title) {
        case "Upload Documents":
          return "Optional";
        case "Payment Information":
          return "Please select how you would like to be paid";
        case "Create Menu":
          return "";
        case "Create Services":
          return "Atleast one service must be created to proceed";
        case "Upload Gallery":
          return "Optional";
        case "Create Classes":
          return "Atleast one class must be created to proceed";
        case "Membership Plans":
          return "Optional";
        default:
          return "All Fields Required";
      }
    } else {
      return "All Fields Required";
    }
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const { current, step1Data, stepProgress } = this.state;
    const { userDetails, loggedInUser } = this.props;
    console.log("index.js userDetails 590 ", this.props.userDetails);
    const fitnessSteps = [
      {
        title: "Step First",
        content: (
          <StepFirst
            userDetails={userDetails}
            nextStep={(reqData) => this.next(reqData, 1)}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Second",
        content: (
          <StepSecond
            submitFromOutside={this.state.submitFromOutside}
            resetOutsideForm={() => this.setState({ submitFromOutside: false })}
            nextStep={(reqData) => {
              this.setState({ step2Data: reqData }, (reqData) => {
                this.next(reqData, 2);
              });
            }}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Third",
        content: (
          <AddPortfolio
            userDetails={userDetails}
            nextStep={(reqData) => this.next(reqData, 3)}
            submitFromOutside={this.state.submitFromOutside}
            subimitEnd={()=>this.setState({submitFromOutside:false})}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Fourth",
        content: (
          <CreateClass
            nextStep={(reqData) => {
              const current = this.state.current + 1;
              this.setState({ current });
            }}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Fifth",
        content: (
          <CreateMembership
            userDetails={userDetails}
            nextStep={(reqData) => {
              const current = this.state.current + 1;
              this.setState({ current });
            }}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Sixth",
        content: (
          <PaymentScreen
            userDetails={userDetails}
            // nextStep={(reqData) => this.next(reqData, 5)}
            nextStep={(reqData) => {
              this.setState({ paymentData: reqData }, (reqData) => {
                this.next(reqData, 5);
              });
            }}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
    ];

    const steps = [
      {
        title: "Step First",
        content: (
          <StepFirst
            userDetails={userDetails}
            nextStep={(reqData) => this.next(reqData, 1)}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Second",
        content:
          loggedInUser.user_type === langs.key.restaurant ? (
            <RestaurantProfile
              nextStep={(reqData) => {
                this.setState({ step2Data: reqData }, (reqData) => {
                  this.next(reqData, 2);
                });
              }}
              step1Data={step1Data}
              submitFromOutside={this.state.submitFromOutside}
              previousStep={this.previousStep}
            />
          ) : (
            <StepSecond
              submitFromOutside={this.state.submitFromOutside}
              nextStep={(reqData) => {
                this.setState({ step2Data: reqData }, (reqData) => {
                  this.next(reqData, 2);
                });
              }}
              previousStep={this.previousStep}
            />
          ),
      },
      {
        title: "Step Third",
        content:
          loggedInUser.user_type === "wellbeing" ? (
            <CreateSpaServices
              isCreateService={true}
              nextStep={(reqData) => {
                this.next({}, 3);
              }}
              previousStep={this.previousStep}
            />
          ) : loggedInUser.user_type === "restaurant" ? (
            <CreateMenu
              nextStep={(reqData) =>
                this.setState({ step2Data: reqData }, (reqData) => {
                  this.next(reqData, 3);
                })
              }
              submitFromOutside={this.state.submitFromOutside}
              previousStep={this.previousStep}
            />
          ) : loggedInUser.user_type === "beauty" ? (
            <CreateSpaServices
              isCreateService={true}
              nextStep={(reqData) => {
                this.next({}, 3);
              }}
              previousStep={this.previousStep}
            />
          ) : (
            // <CreateBeautyService
            //   isCreateService={true}
            //   nextStep={() => this.next("", 3)}
            //   submitFromOutside={this.state.submitFromOutside}
            //   previousStep={this.previousStep}
            // />
            <AddPortfolio
              userDetails={userDetails}
              nextStep={(reqData) => this.next(reqData, 3)}
              submitFromOutside={this.state.submitFromOutside}
              previousStep={this.previousStep}
              subimitEnd={()=>this.setState({submitFromOutside:false})}
            />
          ),
      },
      {
        title: "Step Fourth",
        content: (
          <PaymentScreen
            userDetails={userDetails}
            nextStep={(reqData) => {
              this.setState({ paymentData: reqData }, (reqData) => {
                this.next(reqData, 5);
              });
            }}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
    ];

    const other_steps = [
      {
        title: "Step First",
        content: (
          <StepFirst
            userDetails={userDetails}
            nextStep={(reqData) => this.next(reqData, 1)}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Second",
        content: (
          <StepSecond
            submitFromOutside={this.state.submitFromOutside}
            nextStep={(reqData) => {
              this.setState({ step2Data: reqData }, (reqData) => {
                this.next(reqData, 2);
              });
            }}
            previousStep={this.previousStep}
          />
        ),
      },
      {
        title: "Step Third",
        content:
          loggedInUser.user_type === "wellbeing" ? (
            <CreateSpaServices
              isCreateService={true}
              nextStep={(reqData) => {
                this.next({}, 3);
              }}
              previousStep={this.previousStep}
            />
          ) : loggedInUser.user_type === "beauty" ? (
            <CreateSpaServices
              isCreateService={true}
              nextStep={(reqData) => {
                this.next({}, 3);
              }}
              previousStep={this.previousStep}
            />
          ) : (
            // <CreateBeautyService
            //   isCreateService={true}
            //   nextStep={() => this.next("", 3)}
            //   submitFromOutside={this.state.submitFromOutside}
            //   previousStep={this.previousStep}
            // />
            <AddPortfolio
              userDetails={userDetails}
              nextStep={(reqData) => this.next(reqData, 3)}
              submitFromOutside={this.state.submitFromOutside}
              previousStep={this.previousStep}
              subimitEnd={()=>this.setState({submitFromOutside:false})}
            />
          ),
      },
      {
        title: "Step Fourth",
        content: (loggedInUser.user_type === "wellbeing" ||
          loggedInUser.user_type === "beauty") && (
          <AddPortfolio
            userDetails={userDetails}
            nextStep={(reqData) => this.next(reqData, 4)}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
            subimitEnd={()=>this.setState({submitFromOutside:false})}
          />
        ),
      },
      {
        title: "Step Fifth",
        content: (
          <PaymentScreen
            userDetails={userDetails}
            nextStep={(reqData) => {
              this.setState({ paymentData: reqData }, (reqData) => {
                this.next(reqData, 5);
              });
            }}
            submitFromOutside={this.state.submitFromOutside}
            previousStep={this.previousStep}
          />
        ),
      },
    ];
    let profile_setup_steps =
      loggedInUser.user_type === "wellbeing" ||
      loggedInUser.user_type === "beauty"
        ? other_steps
        : steps;
    let title = stepProgress.filter((el, i) => i == current);
    console.log(
      "🚀 ~ file: index.js ~ line 699 ~ EditProfile ~ render ~ stepProgress",
      stepProgress
    );
    console.log(
      "🚀 ~ file: index.js ~ line 699 ~ EditProfile ~ render ~ title",
      title
    );
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout style={{ overflowX: "visible" }}>
            <div className="my-profile-box my-profile-setup my-profile-box-v2">
              <div className="card-container signup-tab">
                <div className="steps-content align-left mt-0">
                  {/* <div className="top-head-section">
                    <div className="left">
                      <Title level={2}>My Profile</Title>
                    </div>
                    <div className="right"></div>
                  </div> */}
                  <div className="sub-head-section">
                    <Text>All Fields Required</Text>
                  </div>
                  <Card
                    className="profile-content-box profile-content-box-v1"
                    // bordered={false}
                    // title='Profile Set Up'
                    // extra={<Link form={'form1'} onClick={() => this.setState({ submitFromOutside: true })} to='#'>
                    //   <Space align={'center'} size={9}>Clear All <Icon icon='delete2' size='12' /></Space>
                    //   </Link>}
                    extra={<ul>{this.renderSteps()}</ul>}
                  >
                    <Row
                      className={`step-with-info-box ${
                        current == 2 &&
                        ["wellbeing", "beauty"].includes(loggedInUser.user_type)
                          ? "rm-line"
                          : (title[0] == "Create Classes" ||
                              title[0] == "Membership Plans") &&
                            ["fitness"].includes(loggedInUser.user_type)
                          ? "rm-line"
                          : ""
                      }`}
                    >
                      <Col md={12} className="pl-0">
                        <span>
                          Step {`${current + 1} of ${stepProgress.length}`}
                        </span>
                        <h3>
                          {title.length
                            ? title[0] == "Membership Plans"
                              ? "Add Membership Plans"
                              : title[0]
                            : "Profile Information"}
                        </h3>
                        <p>
                          {this.getSubHeader(loggedInUser.user_type, title[0])}{" "}
                        </p>
                      </Col>
                      {![
                        "Profile Information",
                        "Payment Information",
                        "Create Menu",
                        "Create Services",
                        "Create Classes",
                        "Membership Plans",
                      ].includes(title[0]) && (
                        <Col
                          md={12}
                          className="clear-all-action"
                          onClick={() =>
                            this.setState({ submitFromOutside: true })
                          }
                        >
                          <span className="pr-5" >Clear All</span>
                          <img
                            src={require("./../../../../assets/images/icons/delete-blue.png")}
                            alt="delete-blue"
                          />
                        </Col>
                      )}
                    </Row>
                    {loggedInUser.user_type === "fitness"
                      ? fitnessSteps[current].content
                      : profile_setup_steps[current].content}
                    <Steps
                      current={current}
                      className="profile-vendors-steps-dot"
                    >
                      {loggedInUser.user_type === "fitness"
                        ? fitnessSteps.map((item, index) => (
                            <Step key={item.title} />
                          ))
                        : profile_setup_steps.map((item, index) => (
                            <Step key={item.title} />
                          ))}
                    </Steps>
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
    userDetails: profile.userProfile !== null ? profile.userProfile : null,
    traderProfile:
      profile.traderProfile !== null ? profile.traderProfile : null,
    restaurantDetail:
      bookings && bookings.restaurantDetail ? bookings.restaurantDetail : null,
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  updateRestaurantProfile,
  checkPaypalAccepted,
  getTraderProfile,
  saveTraderProfile,
  getUserProfile,
  changeUserName,
  changeMobNo,
})(EditProfile);
