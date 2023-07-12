import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Icon from "../../../customIcons/customIcons";
import {
  getFitnessMemberShipListing,
  getMyFitnessClassSchedule,
  openLoginModel,
  getBookingDetails,
  enableLoading,
  disableLoading,
} from "../../../../actions";
import {
  Card,
  Layout,
  Typography,
  Avatar,
  Tabs,
  Row,
  Col,
  Menu,
  Breadcrumb,
  Form,
  Carousel,
  Table,
  Input,
  Select,
  Checkbox,
  Button,
  Rate,
  Modal,
  Dropdown,
  Divider,
} from "antd";
import {
  getBookingCatLandingRoute,
  getBookingMapDetailRoute,
  getBookingSubcategoryRoute,
  getBookingDetailPageRoute,
} from "../../../../common/getRoutes";
import ViewMembershipModal from "./booking/ViewMembership";
import BuyMemberShipModal from "../fitness/booking/buy-membership";
import { langs } from "../../../../config/localization";
import { dateFormat4 } from "../../../common";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;

class MembershipList extends React.Component {
  myDivToFocus = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      detail: null,
      displayMembershipBuyModal: false,
      myPackages: [],
      activeKey: "0",
      displayViewModal: false,
      selectedMembership: null,
    };
  }

  componentDidMount() {
    const { isLoggedIn, loggedInUser } = this.props;
    this.getFitnessMemberShips();
    isLoggedIn && this.getMyFitnessMemberShips();
    this.getDetails();
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = () => {
    const { isLoggedIn, loggedInUser } = this.props;

    let itemId = this.props.match.params.itemId;
    let reqData = {
      id: itemId,
      user_id: isLoggedIn ? loggedInUser.id : "",
    };
    this.props.getBookingDetails(reqData, (res) => {
      // console.log('res: v', res.status === 200);
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ detail: res.data.data });
        // console.log('res.data.data: ', res.data.data);
      }
    });
  };

  /**
   * @method getFitnessMemberShips
   * @description get service details
   */
  getFitnessMemberShips = () => {
    let trader_user_profile_id = this.props.match.params.id;
    let reqdata = {
      trader_user_profile_id: trader_user_profile_id,
    };
    this.props.getFitnessMemberShipListing(reqdata, (res) => {
      if (res.status === 200) {
        let data = res.data;
        this.setState({
          packages: data.packages,
        });
      }
    });
  };

  /**
   * @method getMyFitnessMemberShips
   * @description get service details
   */
  getMyFitnessMemberShips = () => {
    this.props.getMyFitnessClassSchedule((res) => {
      if (res.status === 200) {
        let data = res.data.data;
        console.log("data: ", data);
        this.setState({
          myPackages: data,
        });
      }
    });
  };

  /**
   * @method displayMembershipBuyModal
   * @description display Fitness membership
   */
  displayMembershipBuyModal = (selectedSpaService) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        displayMembershipBuyModal: true,
        selectedSpaService: selectedSpaService,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method renderMyPacakgeList
   * @description render Package list
   */
  renderMyPacakgeList = (list) => {
    return (
      Array.isArray(list) &&
      list.map((item) => {
        let el = item.trader_class_package;
        return (
          <div
            onClick={(i) => {
              this.setState({ selectedMembership: item });
            }}
          >
            {" "}
            <Row gutter={[42, 0]} className="calender-detail-item">
              <Col md={24}>
                <div className="ele-name">{el.name}</div>
              </Col>
              <Col md={10}>
                <div className="pt-10">
                  <Text>
                    <span className=" blue-text">{el.detail}</span>
                  </Text>
                </div>
              </Col>
              <Col md={2}>
                <div className="pt-10">
                  <Text>{el.class_count} Times</Text>
                </div>
              </Col>
              <Col md={2}>
                <div className="pt-10">
                  <Text>
                    {el.duration}
                    {/* Weeks */}
                  </Text>
                </div>
              </Col>
              <Col md={2}>
                <div className="pt-10">
                  <Text>
                    <b>${el.price}.00 </b>
                  </Text>
                </div>
              </Col>
              <Col md={3}>
                <div className="pt-10">
                  <Text>
                    <b>
                      {this.state.activeKey === "1"
                        ? "Unavailable"
                        : dateFormat4(item.end_date.date)}{" "}
                    </b>
                  </Text>
                </div>
              </Col>
              <Col md={5} className="text-right">
                <Button
                  className="yellow-btn"
                  onClick={() => this.setState({ displayViewModal: true })}
                >
                  {" "}
                  View
                </Button>
              </Col>
            </Row>
            <Divider />
          </div>
        );
      })
    );
  };

  /**
   * @method renderPacakgeList
   * @description render Package list
   */
  renderPacakgeList = (list) => {
    console.log("list: ", list);
    return (
      Array.isArray(list) &&
      list.map((el) => {
        return (
          <>
            {" "}
            <Row gutter={[42, 0]} className="calender-detail-item">
              <Col md={24}>
                <div className="ele-name">{el.name}</div>
              </Col>
              <Col md={10}>
                <div className="pt-10">
                  <Text>
                    <span className=" blue-text">{el.detail}</span>
                  </Text>
                </div>
              </Col>
              <Col md={6}>
                <div className="pt-10">
                  <Text>
                    {el.class_count} Times X {el.duration} Weeks
                  </Text>
                </div>
              </Col>
              <Col md={3}>
                <div className="pt-10">
                  <Text>
                    <b>${el.price}.00 </b>
                  </Text>
                </div>
              </Col>
              <Col md={5} className="text-right">
                <Button
                  className="yellow-btn"
                  onClick={() => this.displayMembershipBuyModal(el)}
                >
                  {" "}
                  Buy
                </Button>
              </Col>
            </Row>
            <Divider />
          </>
        );
      })
    );
  };

  render() {
    const {
      bookingDetail,
      detail,
      myPackages,
      activeKey,
      packages,
      displayViewModal,
      selectedMembership,
    } = this.state;
    console.log("detail: ", detail);
    let rate =
      detail && detail.average_rating
        ? `${parseInt(detail.average_rating)}.0`
        : "";
    let name = detail ? detail.business_name : "";
    let path = "",
      subCategoryPagePath,
      subcatId,
      subcatName;
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    let categoryName = parameter.categoryName;
    let itemId = parameter.itemId;
    let pid = parameter.categoryId;
    let templateName = parameter.categoryName;
    let subCategoryName =
      parameter.all === langs.key.all
        ? langs.key.All
        : parameter.subCategoryName;
    let subCategoryId = parameter.subCategoryId;
    let categoryPagePath = getBookingCatLandingRoute(
      categoryName,
      categoryId,
      categoryName
    );
    let allData = parameter.all === langs.key.all ? true : false;
    if (subCategoryId === undefined) {
      subcatId =
        bookingDetail &&
        bookingDetail.trader_profile &&
        bookingDetail.trader_profile.booking_sub_cat_id;
      subcatName =
        bookingDetail &&
        bookingDetail.trader_profile &&
        bookingDetail.trader_profile.trader_service &&
        bookingDetail.trader_profile.trader_service.name;
      path = getBookingMapDetailRoute(
        templateName,
        categoryName,
        categoryId,
        subcatName,
        subcatId,
        itemId
      );
      subCategoryPagePath = getBookingSubcategoryRoute(
        templateName,
        categoryName,
        categoryId,
        subcatName,
        subcatId,
        allData
      );
    } else {
      path = getBookingMapDetailRoute(
        templateName,
        categoryName,
        categoryId,
        subCategoryName,
        subCategoryId,
        itemId
      );
      subCategoryPagePath = getBookingSubcategoryRoute(
        templateName,
        categoryName,
        categoryId,
        subCategoryName,
        subCategoryId,
        allData
      );
    }
    let detailPath = getBookingDetailPageRoute(
      categoryName,
      categoryId,
      categoryName,
      itemId
    );

    return (
      <Fragment>
        <div className="booking-product-detail-parent-block">
          <Layout className="yellow-theme card-detailpage common-left-right-padd">
            <Layout>
              <Layout className="right-parent-block">
                <Layout
                  style={{ width: "calc(100% - 0px)", overflowX: "visible" }}
                >
                  <div className="detail-page right-content-block">
                    <Row gutter={[0, 0]}>
                      <Col span={8}>
                        <div className="category-name">
                          <Link to={detailPath}>
                            <Button type="ghost" shape={"round"}>
                              <Icon
                                icon="arrow-left"
                                size="20"
                                className="arrow-left-icon"
                              />
                              {subCategoryName ? subCategoryName : subcatName}
                            </Button>
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Layout>
              </Layout>
            </Layout>
          </Layout>
        </div>

        <Layout className="yellow-theme schedule-view bking-wellbeing-fitness-memebership-view ">
          <Layout className="right-parent-block">
            {/* <SubHeader showAll={false} subCategoryName={subCategoryName}/> */}
            {/* <div className='wrap-inner mt-10'>
              <div className="back-link" style={{cursor:'pointer'}}><Back {...this.props} /></div>
            </div> */}
            <Row className="mt-26">
              <Col md={12}>
                <Title level={4} className="orange-heading fs-25 mb-20">
                  View Membership
                </Title>
              </Col>
              <Col md={12} className="align-right">
                <Title className="mb-0 strong" level={3}>
                  {name}
                </Title>
                <div className="product-ratting mb-50">
                  {rate && (
                    <Rate
                      className="mr-10"
                      style={{ fontSize: 14 }}
                      disabled
                      defaultValue={rate ? rate : 0.0}
                    />
                  )}
                  <Text>{rate ? rate : "No review yet"}</Text>
                  {/* <Text>
                    {detail && displayDateTimeFormate(detail.updated_at)}
                  </Text> */}
                </div>
                {/* <img src={require('../../../../assets/images/star-rating.png')} alt='' /> */}
                {/* <Text> 27 review</Text> */}
              </Col>
            </Row>
            {myPackages.length ? (
              <Row>
                <Col md={24}>
                  <div className="calendra-parent-block">
                    <div className="calender-detail">
                      <Row>
                        <Col md={24} className="blue-strip blue-strip-heading">
                          {"My Membership Plan"}
                        </Col>
                      </Row>
                      <Tabs
                        type="card"
                        className="inner-tab-detail"
                        activeKey={activeKey}
                        onChange={(key, type) => {
                          this.setState({ activeKey: key });
                        }}
                      >
                        <TabPane
                          tab={"Current"}
                          key="0"
                          style={{ backgroundColor: "#CA71B7" }}
                        >
                          <Card className="mb-60 card-body-block">
                            {this.renderMyPacakgeList(myPackages.current)}
                          </Card>
                        </TabPane>
                        <TabPane
                          tab={"Expired"}
                          key="1"
                          style={{ backgroundColor: "#CA71B7" }}
                        >
                          <Card className="mb-60 card-body-block">
                            {this.renderMyPacakgeList(myPackages.expire)}
                          </Card>
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <Row>
              <Col md={24}>
                <div className="calendra-parent-block">
                  <div className="calender-detail">
                    <Row>
                      <Col md={24} className="blue-strip blue-strip-heading">
                        {"Membership Plan"}
                      </Col>
                    </Row>
                    <Card className="mb-60 card-body-block">
                      {this.renderPacakgeList(packages)}
                    </Card>
                  </div>
                </div>
              </Col>
            </Row>
            {detail !== null && selectedMembership !== null && (
              <ViewMembershipModal
                visible={displayViewModal}
                onCancel={() => this.setState({ displayViewModal: false })}
                bookingDetail={detail}
                selectedMembership={selectedMembership}
              />
            )}
            <Modal
              title="Buy Membership"
              visible={this.state.displayMembershipBuyModal}
              className={"custom-modal style1 booking-buy-membership-modal"}
              footer={false}
              onCancel={() =>
                this.setState({ displayMembershipBuyModal: false })
              }
              destroyOnClose={true}
            >
              <div className="padding">
                <BuyMemberShipModal
                  selectedService={this.state.selectedSpaService}
                  initialStep={0}
                  bookingDetail={detail}
                />
              </div>
            </Modal>
          </Layout>
        </Layout>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, bookings } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    // userDetails: profile.userProfile !== null ? profile.userProfile : { }
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    fitnessPlan: Array.isArray(bookings.fitnessPlan)
      ? bookings.fitnessPlan
      : [],
  };
};
export default connect(mapStateToProps, {
  getFitnessMemberShipListing,
  getMyFitnessClassSchedule,
  getBookingDetails,
  enableLoading,
  disableLoading,
  openLoginModel,
})(MembershipList);
