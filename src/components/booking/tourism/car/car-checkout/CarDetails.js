import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Typography,
  Collapse,
  Modal,
  Button,
  Input,
  Select,
  Rate,
  InputNumber,
  Dropdown,
} from "antd";
import { DEFAULT_IMAGE_CARD } from "../../../../../config/Config";
import { langs } from "../../../../../config/localization";
import { toastr } from "react-redux-toastr";
import {
  enableLoading,
  disableLoading,
  checkIsCarFavOrNot,
  getCarViewCount,
  addCarViews,
  getCarRating,
  markCarAsFav,
  openLoginModel,
} from "../../../../../actions/index";
import {
  salaryNumberFormate,
  formateTime,
  displayInspectionDate,
} from "../../../../common";
import "@ant-design/icons";
import LeaveReviewModel from "../../../../common/carListingDetail/LeaveReviewModal";
import { SocialShare } from "../../../../common/social-share";
import Icon from "../../../../customIcons/customIcons";
import { HeartOutlined, CloseCircleFilled } from "@ant-design/icons";

const { TextArea } = Input;
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

class CarDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roadSideModel: false,
      coverage_model: false,
      selected_description: "",
      coverage_data: [],
      selected_coverage: [],
      selected_assistance: [],
      isFav: 0,
      viewCount: 0,
      reviewModel: false,
      rating: 0,
      equipmentAmount: {},
      spceqp: {},
    };
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    this.checkFav();
  }

  checkFav = async () => {
    const { selectedCar } = this.props;
    console.log("selectedCar: ", selectedCar);
    if (!selectedCar) {
      return;
    }
    let RI = selectedCar.selected_car.param.rateIdentifier;
    console.log("selectedCar: ", selectedCar.selected_car.param.rateIdentifier);
    let p1 = 0,
      p2,
      p3,
      p4;
    if (this.props.isLoggedIn) {
      p1 = await new Promise((resolve) => {
        this.props.checkIsCarFavOrNot(
          { id: RI, user_id: this.props.loggedInUser.id },
          (res) => {
            if (res.status === 200) {
              // console.log('res: check', res.data.data);
              //  this.setState({ isFav: res.data.data })
              resolve({ isFav: res.data.data });
            }
          }
        );
      });
    }

    p2 = await new Promise((resolve) => {
      this.props.getCarViewCount(RI, (res) => {
        if (res !== undefined && res.status === 200) {
          console.log(
            "res: view count  check",
            res.data.data.length ? res.data.data[0].total_views : 0
          );
          // this.setState({ viewCount: res.data.data.length ? res.data.data[0].total_views : 0 })
          // console.log(el.param.rateIdentifier, 'res:  >>>', res);
          resolve({
            count: res.data.data.length ? res.data.data[0].total_views : 0,
          });
        }
      });
    });

    let reqData = {
      car_id: RI,
      car_basic: {
        carImage: selectedCar.selected_car.carImage,
        carModel: selectedCar.selected_car.carModel,
        companyLogo: selectedCar.selected_car.companyLogo,
      },
      car_details: selectedCar.selected_car,
    };

    let formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == "object") {
        formData.append(key, JSON.stringify(reqData[key]));
      } else {
        formData.append(key, reqData[key]);
      }
    });

    p3 = await new Promise((resolve) => {
      this.props.addCarViews(formData, (res) => {
        if (res !== undefined && res.status === 200) {
          console.log("res: view check", res);
          resolve();
          // resolve({ count: res.data.data.length ? res.data.data[0].total_views : 0 })
        }
      });
    });
    this.props.enableLoading();

    p4 = await new Promise((resolve) => {
      const formDataNew = new FormData();
      formDataNew.append("car_id", RI);
      console.log("formDataNew: ", ...formDataNew);

      this.props.getCarRating({ car_id: RI }, (res) => {
        this.props.disableLoading();
        if (res !== undefined && res.status === 200) {
          console.log("res: car Ratings", res);
          // resolve()
          resolve({
            rating: res.data.data.length ? res.data.data[0].average_rating : 0,
          });
        }
      });
    });
    this.setState({ isFav: p1.isFav, viewCount: p2.count, rating: p4.rating });

    console.log("res: >>>>> ", p4);

    //  await Promise.all([p1, p2]).then(res => {

    //   })
  };

  /**
   * @method markFavCar
   * @description mark car is fav or unFav
   */
  markFavCar = (data, fav) => {
    console.log("fav: &&*", fav);
    const { loggedInUser, isLoggedIn } = this.props;
    // console.log('isLoggedIn: &&*', isLoggedIn);

    if (!isLoggedIn) {
      this.props.openLoginModel();
      return;
    }
    let reqData = {
      userId: loggedInUser.id,
      car_id: data.param.rateIdentifier,
      carBasicJson: {
        carImage: data.carImage,
        carModel: data.carModel,
        companyLogo: data.companyLogo,
      },
      carDetailsJson: data,
      isFavorite: fav,
    };
    const formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      if (typeof reqData[key] == "object") {
        formData.append(key, JSON.stringify(reqData[key]));
      } else {
        formData.append(key, reqData[key]);
      }
    });
    this.props.markCarAsFav(formData, (res) => {
      //   this.setState({ currentCarList })
      console.log("res: check", res);
      if (res && res.status === 200) {
        toastr.success(
          langs.success,
          fav === 0
            ? "Car service has been sucessfully marked as un favorite"
            : "Car service has been sucessfully marked as favorite"
        );

        this.setState({ isFav: fav });
        //  this.refereshSearch();
      } else if (res.status === 422) {
        toastr.error(langs.error, res.data.error);
      }
    });
  };

  showRoadsideAssistanceModal = (item) => {
    console.log("road item", item);
    this.setState({
      roadSideModel: true,
      selected_description: item && item.description,
    });
  };

  handleCancel = () => {
    this.setState({ roadSideModel: false, coverage_model: false });
  };

  showCoverageModal = (item) => {
    this.setState({
      coverage_model: true,
      coverage_data: item,
    });
  };

  /**
   * @method renderCarDetailsBlock
   * @description render car detail block
   */
  renderCarDetailsBlock = (data) => {
    const menu = <SocialShare {...this.props} />;
    const { selectedCar } = this.props;
    const { isFav, viewCount, rating } = this.state;
    console.log("viewCount: ", rating);
    let number =
      selectedCar && selectedCar.carRate && selectedCar.carRate.phones
        ? selectedCar.carRate.phones
        : "";
    let phoneNumber = (
      <div>
        {number && number.pickupPhone && "Pickup Number: "}
        <span>{number ? number.pickupPhone : ""}</span>
        <br />
        {number && number.dropoffPhone && "Drop of Number : "}{" "}
        <span>{number ? number.dropoffPhone : ""}</span>
      </div>
    );
    return (
      <div>
        <h2 className="car-details-heading">Car Details</h2>
        <div className="car-details-card">
          <div className="left-div">
            <img
              src={data && data.carImage ? data.carImage : DEFAULT_IMAGE_CARD}
              className="car-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE_CARD;
              }}
            />
            <img
              src={
                data.companyLogo
                  ? data.companyLogo
                  : require("../../../../../assets/images/euro.png")
              }
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = require("../../../../../assets/images/euro.png");
              }}
            />
            <p>Service provided by partner</p>
          </div>
          <div className="right-div">
            <Title className="card-title">
              {data && data.carModel}
              <span>
                {Number(this.state.isFav) === 1 ? (
                  <img
                    src={require("../../../../../assets/images/icons/heart-grey.svg")}
                    alt="heart"
                    onClick={() => {
                      this.markFavCar(
                        data,
                        Number(this.state.isFav) === 1 ? 0 : 1
                      );
                    }}
                  />
                ) : (
                  <img
                    src={require("../../../../../assets/images/icons/heart-orange.svg")}
                    alt="heart"
                    onClick={() => {
                      this.markFavCar(
                        data,
                        Number(this.state.isFav) === 1 ? 0 : 1
                      );
                    }}
                  />
                )}
                {/* <img
                  src={require("../../../../../assets/images/icons/call-orange.svg")}
                  alt=""
                />  */}
                <Dropdown
                  overlay={phoneNumber}
                  trigger={["click"]}
                  overlayClassName="contact-social-detail share-ad"
                  placement="bottomCenter"
                  arrow
                >
                  <img
                    src={require("../../../../../assets/images/icons/call-orange.svg")}
                    alt=""
                    onClick={(e) => e.preventDefault()}
                  />
                </Dropdown>
                <Dropdown
                  overlay={menu}
                  trigger={["click"]}
                  overlayClassName="contact-social-detail share-ad"
                  placement="bottomCenter"
                  arrow
                >
                  <img
                    src={require("../../../../../assets/images/icons/share-orange.svg")}
                    alt=""
                    onClick={(e) => e.preventDefault()}
                  />
                </Dropdown>
              </span>
            </Title>
            <Title level={4} className="card-subtitle">
              {data && data.carDetails && data.carDetails.transmission}
            </Title>
            <p>
              {data
                ? `${data.seatingCapacity} Seats | ${data.numberOfDoors} Doors`
                : ""}
            </p>
            <p
              className="rating"
              onClick={() => this.setState({ reviewModel: true })}
            >
              {`${rating ? rating : 0}`}.0
              <Rate value={rating ? rating : 0} />
              <Link to="#">{viewCount} reviews</Link>
            </p>

            {/* <Select
            defaultValue="option1"
            bordered={false}
            className="time-selection"
          >
            <Option value="option1">
              Open today <strong>09:30 - 18:00</strong>{" "}
            </Option>
          </Select> */}
            {/* this section is removed as per the mapping */}

            <Title className="price-title">
              AU$
              {data &&
                data.tariffInfo &&
                data.tariffInfo.total &&
                data.tariffInfo.total.rateAmount}
              <span>&nbsp;Per day</span>
              {/* <CloseCircleFilled
                style={{ fontSize: "12px", color: "#363B40" }}
              /> */}
            </Title>

            <div className="feature-list">
              <div className="inner-div">
                <ul>
                  <li>
                    <span>
                      <img
                        src={require("../../../../../assets/images/icons/passenger-grey.svg")}
                        alt=""
                        className="ml-5"
                      />
                    </span>
                    <p>5 Passengers</p>
                  </li>
                  {data && data.carDetails && data.carDetails.transmission && (
                    <li>
                      <span>
                        <img
                          src={require("../../../../../assets/images/icons/a-circle-grey.svg")}
                          alt=""
                        />
                      </span>
                      <p>
                        {data &&
                          data.carDetails &&
                          data.carDetails.transmission}
                      </p>
                    </li>
                  )}
                  {data && data.carDetails && data.carDetails.ac && (
                    <li>
                      <span>
                        <img
                          src={require("../../../../../assets/images/icons/snow-flake-grey.svg")}
                          alt=""
                        />
                      </span>
                      <p>{data && data.carDetails && data.carDetails.ac}</p>
                    </li>
                  )}
                </ul>
              </div>

              <div className="inner-div">
                <ul>
                  <li>
                    <span>
                      <img
                        src={require("../../../../../assets/images/icons/suitcase-grey.svg")}
                        alt=""
                      />
                    </span>
                    <p>1 Large Suitcase, 1 Small Suitcase</p>
                  </li>

                  {data &&
                    data.unlimitedMilage &&
                    data.unlimitedMilage.amountQualifie && (
                      <li>
                        <span>
                          <img
                            src={require("../../../../../assets/images/icons/speed-guage-grey.svg")}
                            alt=""
                          />
                        </span>

                        <p>
                          {data &&
                            data.unlimitedMilage &&
                            data.unlimitedMilage.amountQualifier}
                        </p>
                      </li>
                    )}

                  {/* <li>
                  <img
                    src={require("../../../../../assets/images/icons/fuel-pump-grey.svg")}
                    alt=""
                  />
                  <p>{data && data.unlimitedMilage && data.unlimitedMilage.chargeType}</p>
                </li> */}
                  {/* Remove as per the mapping */}
                </ul>
              </div>
            </div>

            {/* <div className="inner-card">
            <Title level={4}>We give you the following for FREE</Title>
            <div className="inner-div">
              <ul>
                <li>Basic rental fee</li>
                <li>Amendments</li>
              </ul>
              <ul>
                <li>Theft Protection</li>
                <li>Collision Damage Waiver</li>
              </ul>
            </div>.
          </div> */}
            {/* this block is removed as per the mapping  */}
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method renderLocationBlock
   * @description render location block
   */
  renderLocationBlock = (data) => {
    const { car_reqdata } = this.props;
    console.log("car_reqdata", car_reqdata);
    let values =
      car_reqdata &&
      car_reqdata.values &&
      Object.keys(car_reqdata.values).length !== 0
        ? car_reqdata.values
        : "";
    let start_time =
      values &&
      `${values.hours1 ? values.hours1 : "00"}:${
        values.minutes1 ? values.minutes1 : "00"
      }`;
    let end_time =
      values &&
      `${values.hours2 ? values.hours2 : "00"}:${
        values.minutes2 ? values.minutes2 : "00"
      }`;
    return (
      <div className="location-information-container">
        <div className="flex-container location-title">
          <Title level={4}>Pick-up Location</Title>
          <Title level={4} className="right-content">
            Drop-off Location
          </Title>
        </div>

        <div className="flex-container location-information">
          <div>
            <p className="highlight">
              {car_reqdata && car_reqdata.pick_up_location}
            </p>
            <p>
              {values && displayInspectionDate(values.pick_up_date)}&nbsp;
              <span className="highlight">
                {start_time && formateTime(start_time)}
              </span>
            </p>
          </div>

          <div className="right-content">
            <p className="highlight">
              {car_reqdata && car_reqdata.drop_up_location}
            </p>
            <p>
              {values && displayInspectionDate(values.drop_of_date)}&nbsp;&nbsp;
              <span className="highlight">
                {end_time && formateTime(end_time)}
              </span>
            </p>
          </div>
        </div>

        <hr />

        <div className="flex-container location-information">
          <div>
            <p className="highlight">
              <img
                src={
                  data.companyLogo
                    ? data.companyLogo
                    : require("../../../../../assets/images/euro.png")
                }
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = require("../../../../../assets/images/euro.png");
                }}
              />
              {car_reqdata && car_reqdata.pick_up_location}
            </p>

            <p>
              {data.pickupLocation &&
                `${data.pickupLocation.addressLine1} ${
                  data.pickupLocation.addressLine2
                    ? data.pickupLocation.addressLine2
                    : ""
                } ${data.pickupLocation.city} ${data.pickupLocation.state} ${
                  data.pickupLocation.country
                } ${data.pickupLocation.state}`}
            </p>
          </div>

          <div className="right-content">
            <p className="highlight">
              <img
                src={
                  data.companyLogo
                    ? data.companyLogo
                    : require("../../../../../assets/images/euro.png")
                }
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = require("../../../../../assets/images/euro.png");
                }}
              />
              {car_reqdata && car_reqdata.drop_up_location}
            </p>
            <p>
              {data.dropoffLocation &&
                `${data.dropoffLocation.addressLine1} ${
                  data.dropoffLocation.addressLine2
                    ? data.dropoffLocation.addressLine2
                    : ""
                } ${data.dropoffLocation.city} ${data.dropoffLocation.state} ${
                  data.dropoffLocation.country
                } ${data.dropoffLocation.state}`}
            </p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method renderSpecialEquipment
   * @description render special equipment
   */
  renderSpecialEquipment = (item) => {
    const {equipmentAmount, spceqp} = this.state;
    if (item && Array.isArray(item) && item.length) {
      return item.map((el, i) => {
        let qty = this.state[`equipment${i + 1}`]
          ? this.state[`equipment${i + 1}`]
          : 0;
        let total = Number(el.amount) * Number(qty);
        return (
          <Row className="option">
            <Col md={14}>
              <p className="highlight">{el.name}</p>
              <p>{el.description}</p>
            </Col>

            <Col md={4}>
              <InputNumber
                defaultValue={0}
                min={0}
                onChange={(value) =>
                  this.setState({ 
                    [`equipment${i + 1}`]: value,
                    spceqp: Object.assign(spceqp, {[el.name]: value >= 1 ? true : false}),
                    equipmentAmount: Object.assign(equipmentAmount, {[el.code]: (+el.amount * +value)})
                  })
                }
              />
            </Col>

            <Col md={3}>
              <p className="option-cost">${el.amount}</p>
              <p>each per day</p>
            </Col>

            <Col md={3}>
              <p className="highlight total-cost">${total}</p>
            </Col>
          </Row>
        );
      });
    }
  };

  /**
   * @method renderReadSideAssistance
   * @description render roadside assistance
   */
  renderReadSideAssistance = (item) => {
    const { selected_assistance } = this.state;
    if (item && Array.isArray(item) && item.length) {
      return item.map((el, i) => {
        let isSelected = selected_assistance.includes(el, 0);
        return (
          <Row className="option" key={i}>
            <Col md={18}>
              <p className="highlight">
                {el.name}
                <Button
                  onClick={() => this.showRoadsideAssistanceModal(el)}
                  shape="circle"
                >
                  <img
                    src={require("../../../../../assets/images/icons/info-blue.svg")}
                    alt="info-blue"
                  />
                </Button>
              </p>
            </Col>
            <Col md={3}>
              <p className="option-cost">${el.amount}</p>
              <p>each per day</p>
            </Col>
            <Col md={3} className="total-cost">
              <Button
                className={`add-btn ${isSelected ? "remove-btn" : ""}`}
                onClick={() => {
                  let isSelected =
                    selected_assistance.length !== 0 &&
                    selected_assistance.includes(el, 0);
                  if (isSelected) {
                    console.log(
                      selected_assistance,
                      "isSelected case3",
                      isSelected
                    );
                    this.setState({
                      selected_assistance: [
                        ...selected_assistance.filter(
                          (e) => e.name !== el.name
                        ),
                      ],
                    });
                  } else {
                    console.log(
                      selected_assistance,
                      "isSelected case2",
                      isSelected,"======",
                      el
                    );
                    this.setState({
                      selected_assistance: [
                        ...this.state.selected_assistance,
                        el,
                      ],
                    });
                  }
                }}
              >
                {isSelected ? "Remove" : "Add"}
              </Button>
            </Col>
          </Row>
        );
      });
    }
  };

  /**
   * @method renderCoverage
   * @description render roadside assistance
   */
  renderCoverage = (item) => {
    const { selected_coverage } = this.state;
    if (item && Array.isArray(item) && item.length) {
      return item.map((el, i) => {
        let isSelected = selected_coverage.includes(el, 0);
        return (
          <Row className="option" key={i}>
            <Col md={18}>
              <p className="highlight">{el.name}</p>
            </Col>
            <Col md={3}>
              <p className="option-cost">${el.amount}</p>
              <p>each per day</p>
            </Col>
            <Col md={3} className="total-cost">
              <Button
                className={`add-btn ${isSelected ? "remove-btn" : ""}`}
                onClick={() => {
                  let isSelected =
                    selected_coverage.length !== 0 &&
                    selected_coverage.includes(el, 0);
                  if (isSelected) {
                    console.log(
                      selected_coverage,
                      "isSelected case3",
                      isSelected
                    );
                    this.setState({
                      selected_coverage: [
                        ...selected_coverage.filter((e) => e.name !== el.name),
                      ],
                    });
                  } else {
                    console.log(
                      selected_coverage,
                      "isSelected case2",
                      isSelected, "==========>", el
                    );
                    this.setState({
                      selected_coverage: [...this.state.selected_coverage, el],
                    });
                  }
                }}
              >
                {isSelected ? "Remove" : "Add"}
              </Button>
            </Col>
          </Row>
        );
      });
    }
  };

  /**
   * @method renderMoreDEtailBlock
   * @description render booking block
   */
  renderMoreDEtailBlock = (data) => {
    console.log("data", data);
    return (
      <div className="add-more-options-box">
        <Collapse
          className="add-more-options-collapse"
          defaultActiveKey={["1"]}
        >
          <Panel header={<p>Add More Options</p>} key="2">
            <div className="initial-information">
              <p>
                <strong>Payable on collection</strong>
              </p>
              <p>
                If you reserve any of these extras, you'll pay for them at the
                counter.
              </p>
            </div>

            <div className="inner-div option-container">
              {this.renderSpecialEquipment(data.specialEquipments)}
              {this.renderReadSideAssistance(data.surcharges)}
              {data.coverages && data.coverages.length && (
                <Row className="option">
                  <Col md={18}>
                    <p className="highlight">
                      Full Coverage{" "}
                      <Button
                        onClick={() => this.showCoverageModal(data.coverages)}
                        shape="circle"
                      >
                        <img
                          src={require("../../../../../assets/images/icons/info-blue.svg")}
                          alt=""
                        />
                      </Button>
                    </p>
                  </Col>
                  <Col md={3}></Col>
                  <Col md={3} className="total-cost"></Col>
                </Row>
              )}
              {this.renderCoverage(data.coverages)}
            </div>
            <div className="inner-div footer-container">
              <Row>
                <Col md={10}>
                  <p className="highlight">Additional Notes</p>
                  <p>Leave any further requests in English</p>
                </Col>

                <Col md={14}>
                  <TextArea rows={5} placeholder="Type here..." />
                </Col>
              </Row>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  };

  getTotalAmount = () => {
    let total = 0;
    const { selected_assistance, selected_coverage } = this.state;
    if (selected_assistance && selected_assistance.length) {
      selected_assistance.map((el) => {
        total = total + Number(el.amount);
      });
    }
    if (selected_coverage && selected_coverage.length) {
      selected_coverage.map((el) => {
        total = total + Number(el.amount);
      });
    }

    return total;
  };

  /**
   * @method renderBookingBlock
   * @description render booking block
   */
  renderBookingBlock = (data) => {
    const { isLoggedIn } = this.props;
    const { equipmentAmount, spceqp } = this.state
    console.log("🚀 ~ file: CarDetails.js ~ line 884 ~ CarDetails ~ equipmentAmount", equipmentAmount)
    let total = this.getTotalAmount();
    let rate_amount =
      data &&
      data.tariffInfo &&
      data.tariffInfo.total &&
      data.tariffInfo.total.rateAmount
        ? data.tariffInfo.total.rateAmount
        : 0;
    let total_amount = total + Number(rate_amount);
    // let total_amount = Number(rate_amount);
    const { selected_coverage, selected_assistance } = this.state;
    let keys = Object.keys(equipmentAmount)
    keys.map((key) => {
      total_amount += equipmentAmount[key]
    })
    let stepData1 = {
      selected_coverage,
      selected_assistance,
      total_amount: total_amount,
      specialequip: spceqp
      // addedtotal:  total,
    };
    return (
      <div className="booking-summary-box">
        {/* <Row className="summary-box">
          <Col md={8}>
            <div className="heading">
              <Title level={3}>Booking Summary</Title>
              <p>
                Includes flights for 2 adults and all applicable taxes, charges
                and fees Payment fees may apply depending on your payment
                method.
              </p>
            </div>
          </Col>
          <Col md={10}></Col>
          <Col md={6}>
            <div className="detail-list-box">
              <ul>
                <li>Charges to the airline $</li>
                <li>1,278.00</li>
              </ul>
            </div>
            <div className="detail-list-box">
              <ul>
                <li>Taxes and surcharges $</li>
                <li>285.00</li>
              </ul>
            </div>
            <div className="detail-list-box">
              <ul className="total">
                <li>Total $</li>
                <li>1,264.86</li>
              </ul>
            </div>
          </Col> 

        </Row> */}
        <Row className="summary-box summary-inner-bottom-box">
          <Col md={8}>
            <div className="heading">
              <Title level={2}>Payable Now</Title>
              <p>
                (in{" "}
                {data &&
                  data.tariffInfo &&
                  data.tariffInfo.total &&
                  data.tariffInfo.total.rateCurrency}{" "}
                Dollars)
              </p>
            </div>
          </Col>
          <Col md={6}></Col>
          <Col md={10}>
            <div className="detail-list-box">
              <ul className="total">
                <li>Total Booking Price $</li>
                <li className="price-total">
                  {/* AU$ */}
                  {/* {data &&
                    data.tariffInfo &&
                    data.tariffInfo.total &&
                    salaryNumberFormate(data.tariffInfo.total.rateAmount)} */}
                  {total_amount && salaryNumberFormate(total_amount)}
                  {/* <span className="show-detail" onClick={this.showModal}>
                    Show Detals
                  </span> */}
                </li>
              </ul>
              <Button
                className="btn-book-now"
                onClick={() => {
                  if (isLoggedIn) {
                    this.props.changeNextStep(1, stepData1);
                  } else {
                    this.props.openLoginModel();
                  }
                }}
              >
                Reserve
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      coverage_data,
      coverage_model,
      roadSideModel,
      selected_description,
      reviewModel,
      isFav,
    } = this.state;
    console.log("isFav", isFav);
    const { selectedCar } = this.props;
    return (
      <div className="tourism-car-detail-box">
        {this.renderCarDetailsBlock(selectedCar && selectedCar.selected_car)}
        {this.renderLocationBlock(selectedCar && selectedCar.selected_car)}
        {this.renderMoreDEtailBlock(selectedCar && selectedCar.carRate)}
        {this.renderBookingBlock(selectedCar && selectedCar.selected_car)}
        <Modal
          visible={roadSideModel}
          title="Roadside Assistance"
          onCancel={this.handleCancel}
          footer={null}
          className="custom-modal style1 roadside-assistance-modal"
        >
          <div className="roadside-assistance-box">{selected_description}</div>
        </Modal>
        <Modal
          visible={coverage_model}
          title="Full Coverage"
          onCancel={this.handleCancel}
          footer={null}
          className="custom-modal style1 roadside-assistance-modal"
        >
          <div className="roadside-assistance-box">
            <ul>
              {coverage_data &&
                coverage_data.map((el) => {
                  return (
                    <li>
                      <strong>{el.name}</strong>
                      <br />
                      <Text>{el.description}</Text>
                    </li>
                  );
                })}
            </ul>
          </div>
        </Modal>

        {reviewModel && (
          <LeaveReviewModel
            visible={reviewModel}
            data={selectedCar.selected_car}
            onCancel={() => this.setState({ reviewModel: false })}
            checkFav={this.checkFav}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { random_token, car_reqdata } = tourism;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    car_reqdata,
  };
};
export default connect(mapStateToProps, {
  checkIsCarFavOrNot,
  getCarViewCount,
  addCarViews,
  markCarAsFav,
  openLoginModel,
  getCarRating,
  enableLoading,
  disableLoading,
})(CarDetails);
