import React from "react";
import { connect } from "react-redux";
import {
  Col,
  Input,
  Layout,
  Row,
  Typography,
  Card,
  Tabs,
  Select,
  Button,
} from "antd";
import _ from "lodash";
import AppSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import FitnessMyBookings from "./fitness/my-bookings";
import MySpaBookings from "./spa";
import { SearchOutlined } from "@ant-design/icons";
import MyBeautyBookings from "./beauty/my-booking";
import MyEventBookings from "./event/my-booking";
import MyHandymanBookings from "./handyman";
import AddSports from "../vendor-profiles/event-caterer/dashboard/sports/AddSports";
import { Link } from "react-router-dom";
import "./userdetail.less";

const { Title, Text } = Typography;
const { Option } = Select;

class MyBookings extends React.Component {
  constructor(props) {
    console.log(props,"propssssssss")
    super(props);
    this.state = {
      // displayInnerPageName: "Wellbeing - Fitness",
      displayInnerPageName: "Select - category",
      filter: "",
      search: "",
    };
  }

  changeInnerComponent = (value) => {
    this.setState({ displayInnerPageName: value, filter: "" });
  };

  searchText = (booking) => {
    console.log(booking,"booking")
    this.setState({ filter: booking.target.value });
    this.performSearch();
    console.log(this.state.filter,"filter");
  };

  performSearch = _.debounce(() => {
    const { filter } = this.state;
    console.log(filter)
    this.setState({ search: filter });
  }, 500);

  clearSearch = () => {
    this.setState({
      filter: "",
    });
  };

  renderInnerComponent = () => {
    const { search } = this.state;
    switch (this.state.displayInnerPageName) {
      case "Wellbeing - Fitness":
        return (
          <FitnessMyBookings
            history={history}
            searchKeyword={search}
            onClearSearch={this.clearSearch}
          />
        );
      case "Wellbeing - Spa":
        return (
          <MySpaBookings
            history={history}
            searchKeyword={search}
            onClearSearch={this.clearSearch}
          />
        );
      case "Beauty - Nails, Hair, Make Up":
        return (
          <MyBeautyBookings
            history={history}
            searchKeyword={search}
            onClearSearch={this.clearSearch}
          />
        );
      case "Event":
        return (
          <MyEventBookings
            history={history}
            searchKeyword={search}
            onClearSearch={this.clearSearch}
          />
        );
      case "handyman":
        return (
          <MyHandymanBookings
            history={history}
            searchKeyword={search}
            onClearSearch={this.clearSearch}
          />
        );
      case "sports":
        return (
          <AddSports
            history={history}
            searchKeyword={search}
            onClearSearch={this.clearSearch}
          />
        );
      // case 'proffesionals':
      //   return <MyHandymanBookings history={history} />
      default:
        return (
          // <MySpaBookings
          //   history={history}
          //   searchKeyword={search}
          //   onClearSearch={this.clearSearch}
          // />
          ""
        );
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box view-class-tab booking-box "
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab mybooking">
                <div className="top-head-section">
                  <div className="right">
                    <div className="right-content">
                      <div className="tabs-button">
                        {/* <Dashboardtab /> */}
                        <Button
                          onClick={() => {
                            this.props.history.push("/dashboard");
                          }}
                          className="tabview-btn bashboard-btn "
                        >
                          My Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/retail-orders");
                          }}
                          className="tabview-btn retail-btn"
                        >
                          Retail
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/dashboard-classified");
                          }}
                          className="tabview-btn classifield-btn"
                        >
                          Classifieds
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.history.push("/my-bookings");
                          }}
                          className="tabview-btn booking-btn active"
                        >
                          Booking
                        </Button>
                        {/* <Button onClick={() => { this.props.history.push('/food-scanner') }} className="tabview-btn food-scanner">Food Scanner</Button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sub-head-section">
                  <Text>&nbsp;</Text>
                </div>
                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search"
                            prefix={
                              <SearchOutlined className="site-form-item-icon booking-icon" />
                            }
                            value={this.state.filter}
                            onChange={this.searchText}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="custom-select-list">
                  <Select
                    defaultValue="Select - category"
                    className="purpel-selct-list"
                    onChange={this.changeInnerComponent}
                  >
                    <Option value="Select - category">Select Category</Option>

                    <Option value="Wellbeing - Fitness">Wellbeing - Fitness</Option>

                    <Option value="Wellbeing - Spa">Wellbeing - Spa, Dietition, Nutritionist, Massage</Option>

                    <Option value="Beauty - Nails, Hair, Make Up">Beauty - Nails, Hair, Make Up </Option>

                    <Option value="Event">Event</Option>

                    <Option value="handyman">Handyman & Proffesionals </Option>

                    <Option value="sports">Sports </Option>

                    {/* <Option value="proffesionals">Proffesionals</Option> */}
                  </Select>
                </div>

                {this.renderInnerComponent()}
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, null)(MyBookings);
