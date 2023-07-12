import React, { Fragment } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { Tabs, Typography, Button } from "antd";
import { langs } from "../../../config/localization";
import Icon from "../../customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  fetchMasterDataAPI,
  postCategory,
  menuSkip,
} from "../../../actions/index";
import { STATUS_CODES } from "../../../config/StatusCode";
import { MESSAGES } from "../../../config/Message";
import { DEFAULT_ICON } from "../../../config/Config";
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

class SubCategory extends React.Component {
  // Intermediate step second

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
      classifiedItem: "",
      bookingItem: "",
      retailItem: "",
      isRedirect: false,
      selected: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render component
   */
  componentDidMount() {
    const requestData = {
      timeinterval: 0,
    };
    this.props.fetchMasterDataAPI(requestData, (res) => {});
  }

  /**
   * @method onFinish
   * @description handle onsubmit
   */
  onFinish = () => {
    const { classifiedItem, bookingItem, retailItem, selected } = this.state;
    const requestData = {
      booking: bookingItem.length > 0 && bookingItem.join(","),
      classified: classifiedItem.length > 0 && classifiedItem.join(","),
      retail: retailItem.length > 0 && retailItem.join(","),
      foodScanner: selected ? "Food Scanner" : "",
    };
    this.props.postCategory(requestData, (res) => {
      this.props.nextStep();
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.MENU_SAVED_SUCCESS);
        this.props.menuSkip((res) => {});
        setTimeout(() => {
          window.location.assign("/");
        }, 5000);
      }
    });
  };

  /**
   * @method onSelection
   * @description handle select subcategory
   */
  onSelection = (item, key) => {
    const { classifiedItem, bookingItem, retailItem } = this.state;
    if (key === langs.key.classified) {
      let isSelected =
        classifiedItem.length !== 0 && classifiedItem.includes(item.id);
      if (isSelected) {
        this.setState({
          classifiedItem: [...classifiedItem.filter((e) => e !== item.id)],
        });
      } else {
        this.setState({
          classifiedItem: [...this.state.classifiedItem, item.id],
        });
      }
    } else if (key === langs.key.booking) {
      let isSelected =
        bookingItem.length !== 0 && bookingItem.includes(item.id);
      if (isSelected) {
        this.setState({
          bookingItem: [...bookingItem.filter((e) => e !== item.id)],
        });
      } else {
        this.setState({
          bookingItem: [...this.state.bookingItem, item.id],
        });
      }
    } else if (key === langs.key.retail) {
      let isSelected = retailItem.length !== 0 && retailItem.includes(item.id);
      if (isSelected) {
        this.setState({
          retailItem: [...retailItem.filter((e) => e !== item.id)],
        });
      } else {
        this.setState({
          retailItem: [...this.state.retailItem, item.id],
        });
      }
    }
  };

  /**
   * @method selectedCategory
   * @description get selected category handle category selection
   */
  selectedCategory = (key, data) => {
    const { classifiedItem, retailItem, bookingItem } = this.state;
    let isSelected = "";
    if (key === langs.key.classified) {
      isSelected = classifiedItem.includes(data.id);
    } else if (key === langs.key.retail) {
      isSelected = retailItem.includes(data.id);
    } else if (key === langs.key.booking) {
      isSelected = bookingItem.includes(data.id);
    }
    return isSelected;
  };

  /**
   * @method renderSubcategory
   * @description render subcategory based on category type
   */
  renderSubcategory = (categoryType, key) => {
    if (categoryType && categoryType !== undefined) {
      return categoryType.map((data, i) => {
        let iconUrl = "";
        if (key === langs.key.classified) {
          iconUrl = `${this.props.iconUrl}${data.id}/${data.icon}`;
        } else if (key === langs.key.booking) {
          iconUrl = data.selected_icon;
        } else if (key === langs.key.retail) {
          // iconUrl = data.mobileiconurl
          iconUrl = data.imageurl;
        }
        let isSelected = this.selectedCategory(key, data);
        return (
          <div key={i} onClick={() => this.onSelection(data, key)}>
            <li>
              <div className={isSelected ? "item active" : "item"}>
                {iconUrl ? (
                  <img
                    src={iconUrl ? iconUrl : DEFAULT_ICON}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_ICON;
                    }}
                    alt="Home"
                    width="30"
                    className={"stroke-color"}
                  />
                ) : (
                  <img
                    src={DEFAULT_ICON}
                    alt="Home"
                    width="30"
                    className={"stroke-color"}
                  />
                )}
                <Paragraph className="title">
                  {key === langs.key.retail ? data.text : data.name}
                </Paragraph>
              </div>
            </li>
          </div>
        );
      });
    }
  };

  /**
   * @method handleMenuSkip
   * @description handle menuskip action
   */
  handleMenuSkip = () => {
    this.props.menuSkip((res) => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.MENU_SKIPED_SUCCESS);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      retailSubcategory,
      classifiedSubcategory,
      bookingSubcategory,
    } = this.props;
    const { isRedirect } = this.state;
    if (isRedirect) {
      return (
        <Redirect
          push
          to={{
            pathname: "/",
          }}
        />
      );
    }

    return (
      <Fragment>
        <div className="mt-40" style={{ position: "relative" }}>
          <Link to="/" className="skip-link uppercase">
            Skip
          </Link>
          <Link
            to="/"
            onClick={() => this.handleMenuSkip()}
            className="not-interested-link"
          >
            Not Interested
          </Link>
          <div className="card-container category-tab">
            <Tabs type="card">
              <TabPane
                tab={<Icon icon="cart" size="30" />}
                key="1"
                style={{ backgroundColor: "#CA71B7" }}
              >
                <Title level={2} className="align-center text-white mt-15">
                  What are you most interested in?
                </Title>
                <ul className="circle-icon-list fm-retail-cions fm-cm-cions">
                  {this.renderSubcategory(retailSubcategory, langs.key.retail)}
                </ul>
              </TabPane>
              <TabPane
                tab={<Icon icon="classifieds" size="30" />}
                key="2"
                style={{ backgroundColor: "#7EC5F7" }}
              >
                <Title level={2} className="align-center text-white mt-15">
                  What are you most interested in?
                </Title>
                <ul className="circle-icon-list column-5 fm-classified-cions fm-cm-cions">
                  {this.renderSubcategory(
                    classifiedSubcategory,
                    langs.key.classified
                  )}
                </ul>
              </TabPane>
              <TabPane
                tab={<Icon icon="location-search" size="30" />}
                key="3"
                style={{ backgroundColor: "#FFC468" }}
              >
                <Title level={2} className="align-center text-white mt-15">
                  What are you most interested in?
                </Title>
                <ul className="circle-icon-list column-5 fm-booking-cions fm-cm-cions">
                  {this.renderSubcategory(
                    bookingSubcategory,
                    langs.key.booking
                  )}
                </ul>
              </TabPane>
              <TabPane
                tab={<Icon icon="food-scanner" size="30" />}
                key="4"
                style={{ backgroundColor: "#98CE31" }}
              >
                <Title level={2} className="align-center text-white mt-15">
                  What are you most interested in?
                </Title>
                <ul className="circle-icon-list column-5 fm-listing-cions fm-cm-cions">
                  <div>
                    <li
                      onClick={() =>
                        this.setState({ selected: !this.state.selected })
                      }
                    >
                      <div
                        className={this.state.selected ? "item active" : "item"}
                      >
                        <Icon
                          icon="list"
                          size="30"
                          className={"stroke-color"}
                        />
                        <Paragraph className="title">Listing</Paragraph>
                      </div>
                    </li>
                  </div>
                </ul>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className="steps-action align-center mb-32">
          <Button
            type="primary"
            htmlType="submit"
            danger
            onClick={this.onFinish}
          >
            LET'S GO!
          </Button>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { common, auth } = store;
  const { categoryData } = common;
  let classifiedSubcategory = [],
    retailSubcategory = [],
    bookingSubcategory = [];
  if (common && common.categoryData !== undefined) {
    const { booking, classifiedFilteredCategory, retail } = common.categoryData;
    classifiedSubcategory =
    classifiedFilteredCategory && Array.isArray(classifiedFilteredCategory) && classifiedFilteredCategory;
    bookingSubcategory = booking && Array.isArray(booking.data) && booking.data;
    retailSubcategory = retail && Array.isArray(retail.data) && retail.data;
  }
  return {
    classifiedSubcategory,
    bookingSubcategory,
    retailSubcategory,
    loggedInDetail: auth.loggedInUser,
    iconUrl:
      categoryData && categoryData.classifiedAll !== undefined
        ? common.categoryData.classifiedAll.iconurl
        : "",
    bookingUrl:
      categoryData && categoryData.booking ? categoryData.booking.iconurl : "",
  };
};
export default connect(mapStateToProps, {
  fetchMasterDataAPI,
  postCategory,
  menuSkip,
  enableLoading,
  disableLoading,
})(SubCategory);
