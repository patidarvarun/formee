import React from "react";
import { connect } from "react-redux";
import { Layout, Typography } from "antd";
import history from "../../../common/History";
import NewSidebar from "../NewSidebar";
import { getMostBookedFlightList } from "../../../actions/index";
import { TEMPLATE } from "../../../config/Config";
import MostBookedFlights from "./flight/MostBookedFlights";
import CarRentalCompany from './car/TopRentalcards'
import TopRatedHotels from './hotel/TopRatedHotels'
const { Content } = Layout;
const { Title, Paragraph } = Typography;


class SeeMorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productListing: [],
    };
  }


  /**
   * @method render
   * @description render components
   */
  render() {
    const { isSidebarOpen } = this.state;
    let categoryId = this.props.match.params.categoryId;
    let filter = this.props.match.params.filter;
    let label = "";
    if (filter === "most_booked_flights") {
      label = "Most booked Flights";
    }else if(filter === 'top_rental_company'){
      label = "Top Rental Company";
    }else if(filter === 'top_rated_hotel'){
      label = "Top Rated Hotels";
    }
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme  common-left-right-padd">
          <NewSidebar
            history={history}
            activeCategoryId={categoryId}
            categoryName={TEMPLATE.TURISM}
            isSubcategoryPage={true}
            showAll={true}
            toggleSideBar={() =>
              this.setState({ isSidebarOpen: !isSidebarOpen })
            }
          />
          <Layout className="right-parent-block see-more-result">
            <div>
              <Title level={4} className="title main-heading-bookg">
                {"Tourism"}
                <span className="sep">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span className="child-sub-category">{label}</span>
              </Title>
            </div>
            {filter === "most_booked_flights" &&
            <MostBookedFlights see_all={true} {...this.props}/>}
            {filter === 'top_rental_company' && 
            <CarRentalCompany see_all={true} {...this.props}/>}
            {filter === 'top_rated_hotel' && 
            <TopRatedHotels see_all={true} {...this.props}/>}
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

export default connect(mapStateToProps, { getMostBookedFlightList })(
  SeeMorePage
);
