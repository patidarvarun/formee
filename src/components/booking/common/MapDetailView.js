import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  getBookingDetails,
  enableLoading,
  disableLoading,
} from "../../../actions";
import {
  Rate,
  Row,
  Col,
  Layout,
  Breadcrumb,
  Card,
  Typography,
  Select,
} from "antd";
import { Link, Redirect } from "react-router-dom";
import Icon from "../../customIcons/customIcons";
import AppSidebar from "../common/Sidebar";
import Map from "../../common/Map";
import "../../common/mapView.less";
import SubDetailCard from "./SubDetailCard";
import { langs } from "../../../config/localization";
import history from "../../../common/History";
import {
  getBookingSubcategoryRoute,
  getBookingCatLandingRoute,
  getBookingSubCatDetailRoute,
} from "../../../common/getRoutes";
import NoContentFound from "../../common/NoContentFound";
import { TEMPLATE, DEFAULT_IMAGE_CARD } from "../../../config/Config";
import { converInUpperCase } from "../../common";

const { Text } = Typography;
const { Option } = Select;

class MapDetailView extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      classifiedList: [],
      isFilter: false,
      isProCard: true,
      selectedDistance: 0,
      searchKey: "",
      isSearch: false,
      filteredData: [],
      distanceOptions: [0, 5, 10, 15, 20],
      prizeOptions: [10, 20, 50, 100, 200, 300],
      isSearchResult: false,
      searchLatLng: "",
      selectedOption: "",
    };
  }

  /**
   * @method componentWillMount
   * @description called before render the component
   */
  componentWillMount() {
    this.getDetails();
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let itemId = this.props.match.params.itemId;
    let reqData = {
      id: itemId,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getBookingDetails(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ bookingDetail: res.data.data, allData: res.data });
      }
    });
  };

  /**
   * @method toggleFilter
   * @description toggle the filter
   */
  toggleFilter() {
    this.setState({
      isFilter: true,
      isProCard: false,
    });
  }

  /**
   * @method toggleProCard
   * @description toggeled the pro card
   */
  toggleProCard() {
    this.setState({
      isFilter: false,
      isProCard: true,
    });
  }

  /**
   * @method handleFilters
   * @description handle filter
   */
  handleFilters = (value) => {
    this.setState({ classifiedList: value, isFilter: false, isProCard: true });
  };

  /**
   * @method renderCard
   * @description render card details
   */
  renderCard = (data, path, parameter) => {
    let detailPath = getBookingSubCatDetailRoute(
      parameter.categoryName,
      parameter.categoryId,
      parameter.subCategoryId,
      parameter.subCategoryName,
      parameter.itemId
    );
    let subcatName =
      data &&
      data.trader_profile &&
      data.trader_profile.trader_service &&
      data.trader_profile.trader_service.name;
    if (data) {
      return (
        <Fragment>
          <Row gutter={[38, 0]}>
            <Card
              bordered={false}
              className={"map-product-card"}
              cover={
                <img
                  alt={data.discription}
                  onClick={() => this.setState({ redirect: detailPath })}
                  src={data.image ? data.image : DEFAULT_IMAGE_CARD}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE_CARD;
                  }}
                  alt={data.trader_profile ? data.trader_profile.title : ""}
                />
              }
            >
              <div className="action-link">
                <Link to={path}>{subcatName ? subcatName : ""}</Link>
              </div>
              <div className="rate-section">
                <Text>
                  {data.reviews && data.reviews.length !== 0
                    ? data.reviews[0].average_rating
                    : 0.0}
                </Text>
                <Rate
                  disabled
                  defaultValue={parseInt(
                    data.reviews && data.reviews.length !== 0
                      ? data.reviews[0].average_rating
                      : 0.0
                  )}
                />
              </div>
              <div
                className="title"
                style={{ cursor: "pointer" }}
                onClick={() => this.setState({ redirect: detailPath })}
              >
                {data.trader_profile && data.trader_profile.title
                  ? data.trader_profile.title
                  : ""}
              </div>
              <div
                className="price-box pb-0"
                style={{ cursor: "pointer" }}
                onClick={() => this.setState({ redirect: detailPath })}
              >
                <div className="price">
                  {data.trader_profile && data.trader_profile.rate_per_hour
                    ? `${data.trader_profile.rate_per_hour}`
                    : ""}
                  <sup style={{ fontSize: "8px" }}> AUD</sup>
                </div>
                <div className="align-left" style={{ fontSize: "10px" }}>
                  Starting price
                </div>
              </div>
            </Card>
          </Row>
        </Fragment>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { bookingDetail, isFilter, isProCard, redirect } = this.state;
    let parameter = this.props.match.params;
    let title = "";
    let subcatId =
      bookingDetail &&
      bookingDetail.trader_profile &&
      bookingDetail.trader_profile.booking_sub_cat_id;
    let subcatName =
      bookingDetail &&
      bookingDetail.trader_profile &&
      bookingDetail.trader_profile.trader_service &&
      bookingDetail.trader_profile.trader_service.name;
    let parentName = parameter.categoryName;
    let subCategoryName =
      parameter.all === langs.key.all
        ? langs.key.All
        : parameter.subCategoryName
        ? parameter.subCategoryName
        : subcatName;
    if (subCategoryName === langs.key.fitness) {
      let selectedCategory =
        this.props.location.state !== undefined
          ? this.props.location.state.selectedItemsName
          : "";
      let selectedName = selectedCategory && selectedCategory.join(" ");
      title = selectedName && converInUpperCase(selectedName);
    } else {
      title = subCategoryName ? converInUpperCase(subCategoryName) : subcatName;
    }

    let subCategoryId =
      parameter.all === langs.key.all
        ? ""
        : parameter.subCategoryId
        ? parameter.subCategoryId
        : subcatId;
    let allData = parameter.all === langs.key.all ? true : false;
    let gridUrl = getBookingSubcategoryRoute(
      parameter.categoryName,
      parameter.categoryName,
      parameter.categoryId,
      subCategoryName,
      subCategoryId,
      allData
    );

    let categoryPagePath = getBookingCatLandingRoute(
      parameter.categoryName,
      parameter.categoryId,
      parameter.categoryName
    );

    return (
      <Layout className="yellow-theme">
        <Layout>
          <AppSidebar
            history={history}
            activeCategoryId={parameter.categoryId}
            moddule={1}
          />
          <Layout>
            <div className="wrap-inner">
              <Breadcrumb separator="|" className="pb-20 pt-20">
                <Breadcrumb.Item>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/bookings">Bookings</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={categoryPagePath}>
                    {converInUpperCase(parentName)}
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {parentName !== TEMPLATE.HANDYMAN &&
                  parentName !== TEMPLATE.PSERVICES ? (
                    <Link to={gridUrl}>
                      {subCategoryName
                        ? converInUpperCase(subCategoryName)
                        : subcatName}
                    </Link>
                  ) : subCategoryName ? (
                    converInUpperCase(subCategoryName)
                  ) : (
                    subcatName
                  )}
                </Breadcrumb.Item>
                {parentName !== TEMPLATE.HANDYMAN &&
                  parentName !== TEMPLATE.PSERVICES && (
                    <Breadcrumb.Item>{"Search"}</Breadcrumb.Item>
                  )}
              </Breadcrumb>
              <Card
                title={title && converInUpperCase(title)}
                bordered={false}
                className={"panel-card map-wrap mapsection-detail"}
                extra={
                  <ul className="panel-action">
                    <li title={"List view"}>
                      <Link to={gridUrl}>
                        <Icon icon="grid" size="18" />
                      </Link>
                    </li>
                    <li
                      title={"Map view"}
                      onClick={this.toggleProCard.bind(this)}
                      className={!isFilter && "active"}
                    >
                      <Icon icon="map" size="18" />
                    </li>
                  </ul>
                }
              >
                <Row gutter={15}>
                  <Col span={17}>
                    <div className="map-view">
                      {bookingDetail && <Map list={[bookingDetail]} />}
                    </div>
                  </Col>
                  <Col span={7}>
                    <div className="map-right-section pl-10">
                      {isProCard && (
                        <Fragment>
                          {this.renderCard(bookingDetail, gridUrl, parameter)}
                        </Fragment>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Layout>
        </Layout>
        {redirect && (
          <Redirect
            push
            to={{
              pathname: redirect,
            }}
          />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, {
  getBookingDetails,
  enableLoading,
  disableLoading,
})(MapDetailView);
