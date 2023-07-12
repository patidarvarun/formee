import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Row, Col, Typography, Tabs} from "antd";
import {
  enableLoading,
  disableLoading,
  getMostBookedHotels,
} from "../../../../actions/index";
// import history from "../../../../common/History";
import SubHeader from "../../common/SubHeader";
import "../../../common/bannerCard/bannerCard.less";
import { TEMPLATE, DEFAULT_ICON } from "../../../../config/Config";
import TourismDetailCard from "../../../../components/booking/tourism/TourismDetailCard";
// import NewSidebar from "../NewSidebar";
import TourismBanner from "../TourismBanner";
import "../tourism.less";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

class MostBooked extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mostBookedHotels: []
    };
  }

  componentWillMount = () => {
    const { location } = this.props;
    let data = location && location.state && location.state.data  || []
    if(data.length == 0){
      this.props.getMostBookedHotels((res) => {
      if (res.status === 200) {
        let data =
          res && res.data && res.data.data && Array.isArray(res.data.data)
            ? res.data.data
            : [];
        this.setState({
          mostBookedHotels: data,
        });
      }
    });}
    
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { isSidebarOpen, redirectTo, topImages, mostBookedHotels } = this.state;
    const { location } = this.props;
    console.log("🚀 ~ file: MostBooked.js ~ line 35 ~ MostBooked ~ render ~ this.props", this.props)
    let data = location && location.state && location.state.data  || mostBookedHotels
    let tmp = 0;
    return (
      <Layout className="common-sub-category-landing tourism-main-landing">
        <Layout className="yellow-theme common-left-right-padd">
          <Layout className="right-parent-block">
            <div className="inner-banner custom-inner-banner">
              <SubHeader categoryName={TEMPLATE.TURISM} showAll={true} />
              <TourismBanner {...this.props} />
            </div>
            <Content className="site-layout">
              <div className="wrap-inner full-width-wrap-inner bg-gray">
                <div className="wrap-booking-child-box">
                  <Title level={2} className="pt-45 tourism-section-title">
                    {"Most Booked Hotels"}
                  </Title>
                  <Text className="fs-17 tourism-section-subtitle">
                    {"Over 550,000 accommodation worldwide"}
                  </Text>
                  <Row gutter={[28, 28]} className="pt-35">
                    {data.map((hotels, index) => {
                      let tmp2 = hotels.city ? (<Col className="gutter-row" md={6}>
                      <TourismDetailCard {...hotels} index={tmp}/>
                      </Col>) : null
                      tmp = hotels.city ? tmp + 1 : tmp;
                      tmp = tmp == 9 ? 0 : tmp; 
                      return tmp2
                      })
                    }
                  </Row>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
        {redirectTo && (
          <Redirect
            push
            to={{
              pathname: redirectTo,
            }}
          />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { bookingSubCategory, address } = common;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    currentAddress: address,
    bookingSubCategory:bookingSubCategory.data && Array.isArray(bookingSubCategory.data) && bookingSubCategory.data.length ? bookingSubCategory.data : [],
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getMostBookedHotels,
})(withRouter(MostBooked));
