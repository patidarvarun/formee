import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {Col, Button, Row, Typography } from "antd";
import {enableLoading, disableLoading, getMostRecommendedTour } from "../../../../actions/index";
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
import TourismFlightBannerCard from "../TourismFlightBannerCard";
const { Title, Text } = Typography;

class MostRecommendedFlights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendedFlight: [],
    };
  }

  /**
   * @method componentDidMount
   * @description called after mounting the component
   */
  componentDidMount() {
    const { type } = this.props;
    this.props.enableLoading()
   this.getMostRecommendedFlights(type)
  }

  /**
   * @method getMostRecommendedFlights
   * @description get most recommended flights
   */
  getMostRecommendedFlights = (type) => {
    this.props.getMostRecommendedTour({ module_type: type }, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let recommendedFlight = res.data && res.data.data;
        if (recommendedFlight.length) {
          this.setState({
            recommendedFlight: recommendedFlight,
          });
        }
      }
    });
  };

   /**
   * @method renderFlightRecommended
   * @description render flight recommended details
   */
    renderFlightRecommended = () => {
        const { recommendedFlight } = this.state;
        if (recommendedFlight && recommendedFlight.length) {
        return recommendedFlight.map((el, i) => {
            return (
            <Col md={12}>
                <TourismFlightBannerCard
                imgSrc={
                    el.image
                    ? el.image
                    : require("../../../../assets/images/netherlands-amsterdam.png")
                }
                topTitle={el.city ? el.city : ""}
                subTitle={el.sourceCountry ? el.sourceCountry : ""}
                priceLabel={"from"}
                price={"$725"}
                linkText={"Get flight price"}
                onClick={"/"}
                defaultImage={require("../../../../assets/images/netherlands-amsterdam.png")}
                />
            </Col>
            );
        });
        }
    };


  /**
   * @method render
   * @description render components
   */
  render() {
    return (
      <>
       {this.renderFlightRecommended()}
      </>
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

export default connect(mapStateToProps, {enableLoading, disableLoading, getMostRecommendedTour })(
  MostRecommendedFlights
);
