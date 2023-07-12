import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  enableLoading,
  disableLoading,
  setSelectedHotelDetails,
  getHotelTotalViews, getHotelAverageRating
} from "../../../../actions";
import {Rate, Row, Col, Layout, Breadcrumb, Card, Typography, Select } from "antd";
import { Link } from "react-router-dom";
import Icon from "../../../../components/customIcons/customIcons";
import Map from "../../../../components/common/Map";
import HotelMapfilter from "./HotelMapfilter";
import { salaryNumberFormate, capitalizeFirstLetter } from '../../../common'
import NoContentFound from "../../../../components/common/NoContentFound";
import { DEFAULT_IMAGE_CARD } from '../../../../config/Config'
import "../../../../components/common/mapView.less";

const { Text, Paragraph } = Typography;
const { Option } = Select;

class MapComponent extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isFilter: false,
      isProCard: true,
      hotelList: [],
      rateList: [],
    };
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    this.setState({ hotelList: nextprops.hotelSearchList });
  }

  componentDidMount() {
    const { hotelSearchList } = this.props;
    this.setState({ hotelList: hotelSearchList });
    this.getViewAndRating(hotelSearchList)
  }

  
  /**
   * @method checkFavCheck
   * @description check car is fav or not
   */
   getViewAndRating = async (hotelList) => {
    var allRes = []
    var allViewsCount = []
    this.props.enableLoading()
    allRes = await Promise.all(
      hotelList.map(async (el, i) => {
        let code = el.basicPropertyInfo && el.basicPropertyInfo.hotelCode
        return new Promise(resolve => {
          this.props.getHotelAverageRating({ hotelCode: code }, (res) => {
            if (res.status === 200) {
              console.log('res: check', res.data.data);
              resolve({ id: code, rating: res.data.data })
            }
          })
        })
      })
    );
    this.setState({rateList: allRes}, () => {
      this.props.disableLoading()
    })
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
    this.setState({ hotelList: value, isFilter: false, isProCard: true });
  };

  /**
   * @method renderCard
   * @description render card details
   */
  renderCard = (categoryData) => {
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    const { rateList,viewCount } = this.state
    if (categoryData && categoryData.length) {
      return (
        <Fragment>
          <Row gutter={[38, 0]}>
            {categoryData &&
              categoryData.map((data, i) => {
                let basic_info = data.basicPropertyInfo ? data.basicPropertyInfo : ''
                let info = data.descriptiveInfo && Array.isArray(data.descriptiveInfo) && data.descriptiveInfo.length ? data.descriptiveInfo[0] : ''
                let image = info && Array.isArray(info.hotelImages) && info.hotelImages.length ? info.hotelImages[0] : ''
                let price = basic_info.amount && basic_info.amount.amountAfterTax ? basic_info.amount.amountAfterTax : 0
                let rateIndex = rateList.length !==0 && rateList.findIndex(
                  (el) => el.id === basic_info.hotelCode && Array.isArray(el.rating) && el.rating[0].average_rating !== null 
                );
                let rate = rateIndex >= 0 && rateList.length ? rateList[rateIndex].rating[0] && rateList[rateIndex].rating[0].average_rating : 0;
                return (
                  <Col span={24}>
                    <Card
                      bordered={false}
                      className={"map-product-card"}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.props.setSelectedHotelDetails(data)
                        this.props.history.push(
                          `/booking-tourism-hotel-detail/${cat_id}`
                        );
                      }}
                      cover={
                        <img
                          alt={''}
                          src={image ? image : DEFAULT_IMAGE_CARD}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_IMAGE_CARD;
                          }}
                          alt={""}
                        />
                      }
                    >
                      <div className="text-right price-box pb-0">
                        <div className="price">
                          AU${salaryNumberFormate(price)}
                        </div>
                      </div>
                      <div className="rate-section">
                      {rate ? `${rate}.0` : ''}&nbsp;&nbsp;<Rate disabled value={rate} />
                      </div>
                      <div className="product-name-price">
                        <div className="title classified-detail">
                          {capitalizeFirstLetter(info ? info.hotelName : '')}
                        </div>
                        <div className="sub-cat">{'Hotels'}</div>
                      </div>
                    </Card>
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
    const { search_params } = this.props;
    const { isFilter, isProCard, hotelList } = this.state;
    let location = search_params && search_params.from_location ? search_params.from_location : ''
    let parameter = this.props.match.params;
    let path = `/booking-tourism-hotel-list/${parameter.categoryName}/${parameter.categoryId}`;
    return (
      <Layout>
        <Layout>
          <Layout>
            <div className="wrap-inner pt-15 booking-tuorism-map-page">
              <Breadcrumb separator="|" className="pb-15"></Breadcrumb>
              <Card
                title={location && location.city_name}
                bordered={false}
                className={"panel-card map-wrap"}
                extra={
                  <ul className="panel-action">
                    <li>
                      <div className='location'>
                        <Icon icon='location' size='20' className='mr-12' />
                        {location ? location.city_name : ''}{' '}
                      </div>
                    </li>
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
                      {console.log("================================================", hotelList)}
                      <Map list={hotelList} />
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
                            this.renderCard(hotelList)
                          ) : (
                            <HotelMapfilter
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
  const { hotelReqdata, hotelSearchList } = tourism;
  let hotelList = hotelSearchList && hotelSearchList.data && Array.isArray(hotelSearchList.data.data) && hotelSearchList.data.data.length ? hotelSearchList.data.data : []
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    search_params: hotelReqdata,
    hotelSearchList: hotelList
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  setSelectedHotelDetails,
  getHotelTotalViews,
  getHotelAverageRating
})(MapComponent);
