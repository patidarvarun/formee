import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Layout,
  Row,
  Col,
  Typography,
  Card,
  Button,
  Rate,
  Select,
} from "antd";
import { enableLoading, disableLoading, getMostBookedHotels } from "../../../../actions/index";
import history from "../../../../common/History";
import SubHeader from "../../common/SubHeader";
import "../../../common/bannerCard/bannerCard.less";
import { TEMPLATE } from "../../../../config/Config";
import NewSidebar from "../../NewSidebar";
import HotelSearch from "./HotelSearchFilters";
import TourismBanner from "../TourismBanner";
import TopRatedHotels from './TopRatedHotels'
import TourismDetailCard from "../../../booking/tourism/TourismDetailCard";
import "../tourism.less";
import "./hotel.less";
const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
{
  /* Start: popular hotel destination data */
}
const popularHotelDestinationImage = require("../../../../assets/images/london.png");
const popularHotelDestinationData = [
  {
    image: popularHotelDestinationImage,
    name: "Product Heading",
    offer: "Save 55%",
    subCategory: "Subcategory",
    destination: "Destination",
    price: "250",
  },
  {
    image: popularHotelDestinationImage,
    name: "Product Heading",
    offer: "Save 55%",
    subCategory: "Subcategory",
    destination: "Destination",
    price: "250",
  },
  {
    image: popularHotelDestinationImage,
    name: "Product Heading",
    offer: "Save 55%",
    subCategory: "Subcategory",
    destination: "Destination",
    price: "250",
  },
  {
    image: popularHotelDestinationImage,
    name: "Product Heading",
    offer: "Save 55%",
    subCategory: "Subcategory",
    destination: "Destination",
    price: "250",
  },
  {
    image: popularHotelDestinationImage,
    name: "Product Heading",
    offer: "Save 55%",
    subCategory: "Subcategory",
    destination: "Destination",
    price: "250",
  },
  {
    image: popularHotelDestinationImage,
    name: "Product Heading",
    offer: "Save 55%",
    subCategory: "Subcategory",
    destination: "Destination",
    price: "250",
  },
];

{
  /* Start: popular hotel destination data */
}

class HotelLandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: false,
      mostBookedHotels: []
    };
  }

  componentWillMount = () => {
    this.props.getMostBookedHotels(res=> {
      if(res.status === 200){
      let data = res && res.data && res.data.data && Array.isArray(res.data.data) ? res.data.data : []
      this.setState({
        mostBookedHotels: data
      })
      }
    })
  }

  /**
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    let prams = this.props.match.params;
    let cat_id = prams.categoryId;
    let cat_name = prams.categoryName;
    if (resetFlag) {
      this.setState({ isSearchResult: false });
    } else {
      this.props.history.push(
        { 
          pathname: `/booking-tourism-hotel-list/${cat_name}/${cat_id}`,
          state: {
            reqData
          }
         }
      );
    }
  };

  /**
   * @method render
   * @description render component
   */

  render() {
    const { isSidebarOpen, mostBookedHotels } = this.state;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let tmp = 0;
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme common-left-right-padd">
          <NewSidebar
            history={history}
            activeCategoryId={cat_id}
            categoryName={TEMPLATE.TURISM}
            isSubcategoryPage={true}
            showAll={true}
            toggleSideBar={() =>
              this.setState({ isSidebarOpen: !isSidebarOpen })
            }
          />
          <Layout className="right-parent-block">
            <div className="inner-banner custom-inner-banner">
              <SubHeader categoryName={TEMPLATE.TURISM} showAll={true} />
              <TourismBanner {...this.props} />
              <HotelSearch
                handleSearchResponce={(res, resetFlag, reqData) => this.handleSearchResponce(res, resetFlag, reqData)}
                landingPage={true}
                listpage={false}
              />
            </div>
            <Content className="site-layout">
              <div className="wrap-inner full-width-wrap-inner">
                <TopRatedHotels {...this.props}/>
              </div>
              <div className="wrap-inner full-width-wrap-inner bg-gray">
                <div className="wrap-booking-child-box">
                  <Title
                    level={2}
                    className="pt-70 tourism-section-title align-center"
                  >
                    {"Popular destinations"}
                  </Title>
                  <Row gutter={[28, 60]} className="pt-50">
                    {mostBookedHotels.map((hotels, index) => {
                      let tmp2 = hotels.city && index <= 8 ? (<Col className="gutter-row" md={6}>
                      <TourismDetailCard {...hotels} index={tmp}/>
                      </Col>) : null
                      tmp2 = tmp <= 7 ? tmp2 : null;
                      tmp = hotels.city ? tmp + 1 : tmp;
                      return tmp2
                      })
                    }
                    {/* {popularHotelDestinationData.map((item, index) => (
                      <Col className="gutter-row" md={8} key={index}>
                        <Card
                          bordered={false}
                          className={"tourism-popular-destinations-hotel-card"}
                          cover={<img alt={item.name} src={item.image} />}
                        >
                          <Row className={"mb-28"}>
                            <Col span={16}>
                              <div className="rate-section">
                                <Rate allowHalf defaultValue={3.0} />
                                <div className="subcategory">
                                  {item.subCategory}
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div className="destination" align="right">
                                <p>{item.destination}</p>
                              </div>
                            </Col>
                          </Row>
                          <div className="tag">{item.offer}</div>

                          <Title level={4} className="title">
                            {item.name}
                          </Title>
                          <div className="price-box">
                            <div className="price">
                              ${item.price}
                              <Text className="per-day">Per night</Text>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))} */}
                  </Row>
                  {mostBookedHotels.length > 8 &&
                  <div className="align-center pb-30">
                    {/* <Button
                      type="default"
                      size={"middle"}
                      className="fm-btn-orange btn-with-hover"
                    >
                      {"See All"}
                    </Button> */}
                    <Link to={{pathname: `/most-booked-hotels`,  state: {data: mostBookedHotels}}}>
                      <Button
                        type="default"
                        size={"middle"}
                        className="fm-btn-orange"
                      >
                        {"See All"}
                      </Button>
                    </Link>
                  </div>}
                </div>
              </div>
              {/* End: Hotel Landing Page */}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getMostBookedHotels,
})(withRouter(HotelLandingPage));
