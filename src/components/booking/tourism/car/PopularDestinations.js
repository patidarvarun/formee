import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { Row, Typography, Col } from "antd";
import { getMostBookedFlightList, setCarReqData, carSearchAPI, enableLoading, disableLoading } from "../../../../actions/index";
import Icon from "../../../../components/customIcons/customIcons";

const { Title, Text } = Typography;

class PopularDestinations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  /**
   * @method handleSearch
   * @description Call Action for Classified Search
   */
  handleSearch = (values) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let reqData = {
      startDate: `${moment().add(1, 'day').format('YYYY-MM-DD')} 12:00`,
      endDate: `${moment().add(2, 'day').format('YYYY-MM-DD')} 12:00`,
      isSamePickAndDrop: 1,
      pickupLocationLat: values.latitude,
      pickupLocationLng: values.longitude,
      dropoffLocationLat: values.latitude,
      dropoffLocationLng: values.longitude,
      userId: isLoggedIn ? loggedInDetail.id : '',
      rentalCodes: 'ZE,ZI'
    }
    const default_values = {
      pick_up_location: values.sourceAddressLine1,
      drop_up_location: values.destinationAddressLine1,
      pick_up_latlng: { lat: values.latitude, lng: values.longitude },
      drop_up_latlng: { lat: values.latitude, lng: values.longitude },
      isDropOf: values.destinationAddressLine1 ? 1 : 0,
      values: {
        pick_up_date: reqData.startDate,
        drop_of_date: reqData.endDate,
        start_time: moment().add(1, 'day').format('HH:00'),
        end_time: moment().add(1, 'day').format('HH:00'),
        // minutes1: moment().minutes(),
        // minutes2: moment().minutes(),
      },
      reqData,
    };
    console.log("reqData", default_values);
    this.props.setCarReqData(default_values);
    this.props.enableLoading()
    this.props.carSearchAPI(reqData, (res) => {
      console.log("res", res);
      if (res.status === 200) {
        let prams = this.props.match.params;
        let cat_id = prams.categoryId;
        let cat_name = prams.categoryName;
        let sub_cat_name = prams.subCategoryName;
        let sub_cat_id = prams.subCategoryId;
        this.props.history.push(`/booking-tourism-car-carlist/${cat_name}/${cat_id}/${sub_cat_name}/${sub_cat_id}`);
        this.props.disableLoading()
      } 
    });

  };


  /**
   * @method render
   * @description render components
   */
  render() {
    const { data } = this.props;
    let popular_car = data && Array.isArray(data) && data.length ? data : "";
    return (
      <div
        className="wrap-inner full-width-wrap-inner"
        style={{ backgroundColor: "#F7FAFC" }}
      >
        {popular_car && (
          <div className="wrap-booking-child-box">
            <Title level={2} className="pt-50 pb-40 tourism-section-title">
              {"Popular car hire destinations"}
            </Title>
            <Row gutter={[18, 18]}>
              {popular_car &&
                data.map((item, index) => {
                  return index >= 9 ? null : (<Col md={8} key={index} style={{cursor:'pointer'}}>
                    <div className="fm-card-block mb-8">
                      <div className="ad-banner" onClick={() => this.handleSearch(item)}>
                        <img alt={item.name} src={require(`../../../../assets/images/pch/pch${index}.jpg`)} />
                      </div>
                      <div className="fm-desc-stripe sports-fm-desc">
                        <Row align={"middle"}>
                          <Col span={16}>
                            <h2>{item.destinationCity}</h2>
                          </Col>
                          <Col span={8} className="text-right" onClick={() => this.handleSearch(item)} >
                              <span className={"fs-10"}>From</span> $
                              {item.price}{" "}
                              <Icon
                                icon="arrow-right"
                                size="13"
                                className="ml-3 fm-color-yellow"
                              />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>)
                })}
            </Row>
            <div className="pb-20 pt-15">
              <Text>
                *This is an estimated price to help you choose from a large
                number of options. Today's price is based on the average of the
                lowest prices for each of the past 15 days.
              </Text>
            </div>
          </div>
        )}
      </div>
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

export default connect(mapStateToProps, { getMostBookedFlightList, setCarReqData, carSearchAPI, enableLoading, disableLoading })(
  withRouter(PopularDestinations)
);
