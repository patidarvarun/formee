import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Row, Col, Typography, Card, Button, Rate } from "antd";
import {
  enableLoading,
  disableLoading,
  getPopularDestinations,
} from "../../../../actions/index";
import history from "../../../../common/History";
import SubHeader from "../../common/SubHeader";
import "../../../common/bannerCard/bannerCard.less";
import { TEMPLATE } from "../../../../config/Config";
import NewSidebar from "../../NewSidebar";
import CarSearchFilter from "./CarSearchFilters";
import TourismBanner from "../TourismBanner";
import PopularDestinations from "./PopularDestinations";
import TopRentalCompany from "./TopRentalcards";
import "../tourism.less";
import "./car.less";
const { Content } = Layout;
const { Title, Text } = Typography;
const importCompanyLogo = require("../../../../assets/images/flight-logo.png");
const popularDestinationImage = require("../../../../assets/images/munich.png");
const topRatedCarImage = require("../../../../assets/images/toyota-yaris.png");

const popularDestinationData = [
  {
    image: popularDestinationImage,
    name: "Munich",
  },
  {
    image: popularDestinationImage,
    name: "London",
  },
  {
    image: popularDestinationImage,
    name: "Rotterdam",
  },
  {
    image: popularDestinationImage,
    name: "Japan",
  },
  {
    image: popularDestinationImage,
    name: "Bangkok",
  },
  {
    image: popularDestinationImage,
    name: "Bali",
  },
];

const topRatedCarRentalData = [
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "120",
    companyLogo: importCompanyLogo,
  },
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "120",
    companyLogo: importCompanyLogo,
  },
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "120",
    companyLogo: importCompanyLogo,
  },
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "120",
    companyLogo: importCompanyLogo,
  },
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "120",
    companyLogo: importCompanyLogo,
  },
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "12,000",
    companyLogo: importCompanyLogo,
  },
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "120",
    companyLogo: importCompanyLogo,
  },
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "120",
    companyLogo: importCompanyLogo,
  },
  {
    image: topRatedCarImage,
    name: "Kuala lumpur",
    offer: "Save 55%",
    subCategory: "Subcategory",
    similar: "or similar",
    price: "12,000",
    companyLogo: importCompanyLogo,
  },
];

class CarLandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: false,
      popularDestinations: [],
    };
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getPopularDestni();
  }

  /**
   * @method getPopularDestni
   * @description get most recommended flights
   */
  getPopularDestni = () => {
    this.props.getPopularDestinations((res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        console.log("res: Desti", res.data.success);
        this.setState({
          popularDestinations: res.data.data,
        });
      }
    });
  };

  /**
   * @method handleSearchResponce
   * @description Call Action for Classified Search
   */
  handleSearchResponce = (res, resetFlag, reqData) => {
    let prams = this.props.match.params;
    let cat_id = prams.categoryId;
    let cat_name = prams.categoryName;
    let sub_cat_name = prams.subCategoryName;
    let sub_cat_id = prams.subCategoryId;
    if (resetFlag) {
      this.setState({ isSearchResult: false });
    } else {
      this.props.history.push(
        `/booking-tourism-car-carlist/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`
      );
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isSidebarOpen, popularDestinations } = this.state;
    const parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing car-landing-page">
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
              <CarSearchFilter
                handleSearchResponce={this.handleSearchResponce}
                listingPage={true}
              />
            </div>
            <Content className="site-layout">
              <PopularDestinations data={popularDestinations} />

              <div className="wrap-inner full-width-wrap-inner bg-gray">
                <div className="wrap-booking-child-box">
                  <Title
                    level={2}
                    className="pt-40 tourism-section-title align-center"
                  >
                    {"Top rated car rental company"}
                  </Title>
                  <TopRentalCompany {...this.props}/>
                </div>
              </div>
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
  getPopularDestinations,
})(withRouter(CarLandingPage));
