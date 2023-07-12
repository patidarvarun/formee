import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  enableLoading,
  disableLoading,
  getClassfiedCategoryListing,
  classifiedGeneralSearch,
  openLoginModel,
  getChildCategory,
  applyClassifiedFilterAttributes,
} from "../../../../actions";
import { Row, Col, Layout, Breadcrumb, Card, Typography, Select } from "antd";
import { Link } from "react-router-dom";
import Icon from "../../../../components/customIcons/customIcons";
import Map from "../../../../components/common/Map";
import CarMapFilters from "../../../../components/common/CarMapFilter";
import "../../../../components/common/mapView.less";
import CarMapListCard from "../../../../components/common/CarMapListCard";
import NoContentFound from "../../../../components/common/NoContentFound";

const { Text } = Typography;
const { Option } = Select;

class MapComponent extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isFilter: false,
      isProCard: true,
      carList: [],
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    this.setState({ carList: nextprops.carListing });
  }

  componentDidMount() {
    const { carListing } = this.props;
    this.setState({ carList: carListing });
  }

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
    console.log('value: ', value);
    this.setState({ carList: value, isFilter: false, isProCard: true });
  };

  /**
   * @method renderCard
   * @description render card details
   */
  renderCard = (categoryData, parameter) => {
    console.log("categoryData: ", categoryData);
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[38, 0]}>
            {categoryData &&
              categoryData.map((data, i) => {
                return (
                  <Col span={24}>
                    <CarMapListCard
                      data={data}
                      pathData={parameter}
                      index={i}
                      {...this.props}
                    />
                  </Col>
                );
              })}
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
    const { carListing } = this.props;
    const { isFilter, isProCard, carList } = this.state;
    console.log("carList", carList);
    let location = carListing && carListing.length ? carListing[0] : "";
    let parameter = this.props.match.params;
    let path = `/booking-tourism-car-carlist/${parameter.categoryName}/${parameter.categoryId}/${parameter.subCategoryName}/${parameter.subCategoryId}`;
    console.log("path: ", path);
    return (
      <Layout>
        <Layout>
          <Layout>
            <div className="wrap-inner pt-15 booking-tuorism-map-page">
              <Breadcrumb separator="|" className="pb-15"></Breadcrumb>
              <Card
                title={
                  location &&
                  location.pickupLocation &&
                  location.pickupLocation.city
                }
                bordered={false}
                className={"panel-card map-wrap"}
                extra={
                  <ul className="panel-action">
                    <li title={"List view"}>
                      <Link to={path}>
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
                    <li
                      title={"Filter"}
                      onClick={this.toggleFilter.bind(this)}
                      className={isFilter && "active"}
                    >
                      <Icon icon="filter" size="18" /> <span>Filter</span>
                    </li>
                  </ul>
                }
              >
                <Row>
                  <Col span={17}>
                    <div className="map-view">
                      <Map list={carList} />
                    </div>
                  </Col>
                  <Col span={7}>
                    <div
                      className={
                        isProCard
                          ? "map-right-section"
                          : "map-right-section map-right-filter-section"
                      }
                    >
                      <div className="map-right-section-inner">
                        <Fragment>
                          {isProCard ? (
                            this.renderCard(carList, parameter)
                          ) : (
                            <CarMapFilters
                              isFilter={isFilter}
                              handleFilters={(data) => this.handleFilters(data)}
                            />
                          )}
                        </Fragment>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, tourism } = store;
  const { carList, car_reqdata } = tourism;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    carListing:
      carList &&
      carList.rates &&
      Array.isArray(carList.rates) &&
      carList.rates.length
        ? carList.rates
        : [],
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getClassfiedCategoryListing,
  openLoginModel,
  classifiedGeneralSearch,
  getChildCategory,
  applyClassifiedFilterAttributes,
})(MapComponent);
