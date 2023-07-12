import React from "react";
import { connect } from "react-redux";
import {
  Layout,
  Card,
  Typography,
  Button,
  Tabs,
  Table,
  Avatar,
  Row,
  Col,
  Input,
  Select,
} from "antd";
import AppSidebar from "../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import {
  enableLoading,
  disableLoading,
  getTraderProfile,
  getUserWishList,
  removeToWishList,
  removeToFavorite,
  removeToRetailWishlist,
  removeFoodScannerItemFromFavorite,
} from "../../../../actions";
import "ant-design-pro/dist/ant-design-pro.css";
import {
  DEFAULT_IMAGE_TYPE,
  TEMPLATE,
  DEFAULT_IMAGE_CARD,
} from "../../../../config/Config";
import { langs } from "../../../../config/localization";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import {
  SearchOutlined,
  DeleteOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import moment from "moment";
import { salaryNumberFormate } from "../../../common";
import "./userdetail.less";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { MESSAGES } from "../../../../config/Message";
import { addToCartAPI } from "../../../../actions/index";
import {
  getClassifiedDetailPageRoute,
  getRetailDetailPageRoute,
} from "../../../../common/getRoutes";
import CartModel from "../../../retail/retail-cart/CartModel";

const { Option } = Select;
const { Title, Text } = Typography;
class UserWishlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_keyword: "",
      wishListData: [],
      totalRecord: 0,
      sortType: "Newest",
      categoryType: "All",
      listData: [],
      openCartModel: false,
      quantities: {},
    };
  }

  componentDidMount() {
    const { loggedInUser } = this.props;
    if (loggedInUser) {
      this.getWishListListingData();
    }
  }

  getWishListListingData = () => {
    const { loggedInUser } = this.props;
    if (loggedInUser) {
      const reqData = {
        category_id: "",
        order_by: "DESC",
        order: "id",
        search_keyword: this.state.search_keyword,
      };
      this.props.enableLoading();
      this.props.getUserWishList(reqData, (response) => {
        this.props.disableLoading();
        if (response.status === 200) {
          let temArray = [];
          let wishlistData = response.data.data;
          wishlistData.map((value, i) => {
            let objectArray = {
              key: i,
              id: value.id,
              user_id: value.user_id,
              favouritable_id: value.favouritable_id,
              favouritable_type: value.favouritable_type,
              classifiedid: value.classifiedid,
              title:
                value.activity_name == "Booking" ? value.name : value.title,
              location: value.location,
              description: value.description,
              price:
                value.activity_name == "Booking"
                  ? value.rate_per_hour
                  : value.price,
              created_at: value.created_at,
              city_id: value.city_id,
              cityname: value.cityname,
              quantity: value.quantity,
              category_id: value.category_id,
              parent_categoryid: value.parent_categoryid,
              category_name: value.category_name,
              sub_category_name: value.sub_category_name,
              classified_image: value.classified_image,
              is_sellable: value.is_sellable,
              createdtime: value.createdtime,
              wishlist: value.wishlist,
              activity_name:
                value.is_sellable == 1 ? "Retail" : value.activity_name,
              imageurl: value.imageurl,
              food_product_id: value.food_product_id,
              foodproductsid: value.foodproductsid,
            };
            temArray.push(objectArray);
          });
          let resData = this.sortData(temArray, this.state.sortType);
          this.setState({
            wishListData: resData,
            listData: resData,
            totalRecord: response.data.total_records,
          });
        }
      });
    }
  };

  renderCategoryLabel = (activity_name, category_name, sub_category_name) => {
    if (activity_name === "Booking") {
      return (
        <div className="orange-text pt-40 fs-10">
          {" "}
          {category_name && `${category_name}`}{" "}
          {sub_category_name && `| ${sub_category_name}`}
        </div>
      );
    } else if (activity_name === "Retail") {
      return (
        <div className="pink-text pt-40 fs-10">
          {category_name && `${category_name}`}{" "}
          {sub_category_name && `| ${sub_category_name}`}
        </div>
      );
    } else if (activity_name === "Classified") {
      return (
        <div className="blue-text pt-40 fs-10">
          {" "}
          {category_name && `${category_name}`}{" "}
          {sub_category_name && `| ${sub_category_name}`}
        </div>
      );
    } else if (activity_name === "Food Scanner") {
      return <div className="green-text pt-40 fs-10"> {activity_name}</div>;
    }
  };

  renderCategoryButton = (activity_name) => {
    if (activity_name === "Booking") {
      return <Button className="booking-btn btn-sml">{activity_name}</Button>;
    } else if (activity_name === "Retail") {
      return <Button className="retail-btn btn-sml">{activity_name}</Button>;
    } else if (activity_name === "Classified") {
      return (
        <Button className="classifield-btn btn-sml">{activity_name}</Button>
      );
    } else if (activity_name === "Food Scanner") {
      return <Button className="food-scanner btn-sml">{activity_name}</Button>;
    }
  };

  removeWishlistItem = (data, activity_name) => {
    console.log("reqData@@", data);
    const { loggedInDetail } = this.props;
    let userId = loggedInDetail.id;

    if (activity_name === "Booking") {
      let reqData = {
        user_id: userId,
        item_id: data.favouritable_id,
      };
      this.props.removeToFavorite(reqData, (response) => {
        this.getWishListListingData();
      });
    } else if (activity_name === "Retail") {
      let reqData = {
        user_id: userId,
        classifiedid: data.classifiedid,
      };
      this.props.removeToRetailWishlist(reqData, (response) => {
        this.getWishListListingData();
      });
    } else if (activity_name === "Classified") {
      let reqData = {
        user_id: userId,
        classifiedid: data.classifiedid,
      };
      this.props.removeToWishList(reqData, (response) => {
        this.getWishListListingData();
      });
    } else if (activity_name === "Food Scanner") {
      let reqData = {
        user_id: userId,
        food_product_id: data.foodproductsid,
        is_favorite: 0,
      };
      this.props.removeFoodScannerItemFromFavorite(reqData, (response) => {
        this.getWishListListingData();
      });
    }
  };

  sortData = (data, sortOption) => {
    if (sortOption === "Newest") {
      //Newest
      data.sort(function (a, b) {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      return data;
    } else {
      //Oldest
      data.sort(function (a, b) {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      return data;
    }
  };

  sortWishlistByDate = (sortOption) => {
    this.setState({ sortType: sortOption }, () => {
      let resData = this.sortData(this.state.listData, sortOption);
      this.setState({ listData: [...resData] });
    });
  };

  filterBycategory = (categoryOption) => {
    this.setState({ categoryType: categoryOption }, () => {
      let { wishListData } = this.state;
      if (categoryOption === "All") {
        this.setState({
          listData: wishListData,
          totalRecord: wishListData.lenght,
        });
      } else {
        const filteredWishListData = wishListData.filter(
          (item) => item.activity_name === categoryOption
        );
        console.log("filteredWishListData ", filteredWishListData.length);
        this.setState({
          listData: filteredWishListData,
          totalRecord: filteredWishListData.length,
        });
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  contactModal = (data) => {
    console.log(JSON.stringify(data) + "<-----------------contactmodel");
    const { retail, isLoggedIn, loggedInDetail } = this.props;
    const { quantities } = this.state;
    if (isLoggedIn) {
      console.log(isLoggedIn);
      if (
        data.activity_name === "Retail" ||
        data.category_name === "restaurant"
      ) {
        console.log(retail + "<-----------------retail");
        if (data.quantity) {
          console.log(data.quantity);

          let requestData = {
            ship_cost: 0,
            available_qty: quantities[data.id]
              ? quantities[data.id]
              : data.quantity,
            qty: quantities[data.id] ? quantities[data.id] : data.quantity,
            classified_id: data.classifiedid
              ? data.classifiedid
              : data.parent_categoryid,
            user_id: loggedInDetail.id,
          };
          console.log(requestData);
          this.props.addToCartAPI(requestData, (res) => {
            if (res.status === 200) {
              console.log(res.status);
              if (res.data.status === 1) {
                console.log(res.data.status);
                toastr.success(langs.success, MESSAGES.AD_TO_CART);
                this.setState({ openCartModel: true });
                this.removeWishlistItem(data, data.activity_name);
              } else {
                toastr.error(langs.error, res.data.msg);
              }
            }
          });
        } else {
          toastr.warning("This product is out of stock");
        }
      } else {
        this.setState({ visible: true });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  onChangeQuantity = (e, id) => {
    console.log("select event:", e.target);
    let newQuantities = this.state.quantities;
    newQuantities[id] = e.target.value;
    this.setState({
      quantities: newQuantities,
    });
  };

  render() {
    const { data, col, retail } = this.props;
    const { openCartModel } = this.state;

    const columns = [
      {
        title: "Item",
        dataIndex: "name",
        // key: 'name'
        render: (cell, row, index) => {
          return (
            <>
              <div className="user-icon mr-13 d-flex ">
                <Avatar
                  src={
                    row.imageurl !== undefined && row.imageurl !== null
                      ? row.imageurl
                      : DEFAULT_IMAGE_TYPE
                  }
                />

                <div className="wishlish-head">
                  <div className="user-name">
                    {row.activity_name === "Retail" ? (
                      <React.Fragment>
                        <Link
                          to={
                            row.activity_name +
                            "/" +
                            row.category_name +
                            "/" +
                            row.id
                          }
                        >
                          {row.title}
                        </Link>
                      </React.Fragment>
                    ) : row.activity_name === "Classified" ? (
                      <React.Fragment>
                        <Link
                          to={
                            "classifieds-general/" +
                            row.category_name +
                            "/" +
                            row.parent_categoryid +
                            "/" +
                            row.id
                          }
                        >
                          {row.title}
                        </Link>
                      </React.Fragment>
                    ) : row.activity_name === "Booking" ? (
                      <React.Fragment>
                        <Link
                          to={
                            "bookings-detail/" +
                            (row.category_name == "Professionals"
                              ? "professional-services"
                              : row.category_name) +
                            "/" +
                            row.category_id +
                            "/" +
                            row.id
                          }
                        >
                          {row.title}
                        </Link>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                  </div>

                  <ul>
                    <li>
                      {/* {row.wishlist && ( */}
                      <div className="price">
                        {row.quantity !== null &&
                        (row.activity_name === "Retail" ||
                          row.activity_name === "Booking") ? (
                          <select
                            defaultValue={row.quantity}
                            onChange={(e) => this.onChangeQuantity(e, row.id)}
                          >
                            <option value="1">Qty: 1</option>
                            <option value="2">Qty: 2</option>
                            <option value="3">Qty: 3</option>
                            <option value="4">Qty: 4</option>
                            <option value="5">Qty: 5</option>
                          </select>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                    <li>
                      <>
                        <Row className="delete">
                          <Col md={22}>
                            <span
                              onClick={() =>
                                this.removeWishlistItem(row, row.activity_name)
                              }
                            >
                              {" "}
                              Remove{" "}
                            </span>
                          </Col>
                        </Row>
                      </>
                    </li>

                    <li>
                      {row.activity_name !== "Classified" &&
                      row.activity_name !== "Booking" ? (
                        <span
                          onClick={() => this.contactModal(row)}
                          style={{ cursor: "pointer" }}
                        >
                          Move to Cart{" "}
                        </span>
                      ) : (
                        ""
                      )}
                    </li>

                    <li>
                      {row.activity_name === "Retail" ? (
                        <React.Fragment>
                          <Link
                            to={
                              row.activity_name + "/" + row.category_name + "/"
                            }
                          >
                            See more Like This
                          </Link>
                        </React.Fragment>
                      ) : row.activity_name === "Classified" ? (
                        <React.Fragment>
                          <Link
                            to={
                              "classifieds-general/" +
                              row.category_name +
                              "/" +
                              row.parent_categoryid
                            }
                          >
                            See more Like This
                          </Link>
                        </React.Fragment>
                      ) : row.activity_name === "Booking" ? (
                        <React.Fragment>
                          <Link
                            to={
                              "bookings-" +
                              (row.category_name == "Professionals"
                                ? "professional-services"
                                : row.category_name) +
                              // row.category_name == "Handyman" ? "handyman" :
                              "/" +
                              row.category_id
                            }
                          >
                            See more Like This
                          </Link>
                        </React.Fragment>
                      ) : (
                        ""
                      )}
                    </li>
                  </ul>

                  {/* <div className="lightblue-text fs-14">update 1 day agao </div> */}
                  {/* {this.renderCategoryLabel(
                    row.activity_name,
                    row.category_name,
                    row.sub_category_name
                  )} */}
                  {/* <div className="orange-text pt-40 "> {row && `${row.category_name}`} {row.sub_category_name && `| ${row.sub_category_name}`}</div> */}
                </div>
              </div>
              {openCartModel && (
                <CartModel
                  visible={openCartModel}
                  onCancel={() => this.setState({ openCartModel: false })}
                  title={data ? data.title : ""}
                  price={data ? data.price : ""}
                  image={
                    data &&
                    data.imageurl !== undefined &&
                    data.imageurl !== null
                      ? data.imageurl
                      : DEFAULT_IMAGE_CARD
                  }
                />
              )}
            </>
          );
        },
      },

      {
        title: "Price",
        dataIndex: "orderdate",
        key: "title",
        render: (cell, row, index) => {
          return (
            <>
              {/* <div className="date">
                <div>{moment(row.created_at).format("DD/MM/YYYY")}</div>
              </div> */}
              <div className="price">
                {row && row.price !== undefined
                  ? row.activity_name == "Booking"
                    ? `AU$${salaryNumberFormate(parseFloat(row.price))}/hr`
                    : `AU$${salaryNumberFormate(parseFloat(row.price))}`
                  : ""}
              </div>
            </>
          );
        },
      },
      // {
      //   title: "",
      //   dataIndex: "application_status",
      //    key: 'application_status',
      //   render: (cell, row, index) => {
      //      return (
      //        <Row className="delete">
      //          <Col md={22}>
      //            <span
      //              onClick={() =>
      //                this.removeWishlistItem(row, row.activity_name)
      //              }
      //            >
      //              {" "}
      //              Delete <DeleteFilled
      //                className="deletefilled"
      //                size={50}
      //              />{" "}
      //            </span>
      //          </Col>
      //        </Row>
      //      );
      //   },
      // },
      {
        title: "Category",
        dataIndex: "application_status",
        // key: 'application_status'
        render: (cell, row, index) => {
          return (
            <Row className="tabs-button">
              <Col md={22}>{this.renderCategoryButton(row.activity_name)}</Col>
              {/* <Col md={2}><div className="edit-delete-dot"> <MoreOutlined size={50}  />
                            </div></Col> */}
            </Row>
          );
        },
      },
    ];
    console.log("---------------------wishlist-----------------------");
    console.log(this.state.listData.length);
    const wishlistlenght = this.state.listData.length;
    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.WISHLISTS}
          />
          <Layout className="user-wishlist">
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box wishlist-outer"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Wishlist</Title>
                  </div>
                </div>
                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search "
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                            onChange={(e) =>
                              this.setState(
                                { search_keyword: e.target.value },
                                () => this.getWishListListingData()
                              )
                            }
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="profile-content-box">
                  <Card
                    bordered={false}
                    title="Your Wishlist"
                    className="add-content-box"
                    extra={
                      <>
                        <div style={{ marginRight: "20px" }}>
                          <label>Show:</label>
                          <Select
                            defaultValue="All"
                            onChange={(e) => {
                              this.filterBycategory(e);
                            }}
                          >
                            <Option value="All">All Categories</Option>
                            <Option value="Booking">Bookings</Option>
                            <Option value="Classified">Classifieds</Option>
                            <Option value="Retail">Retail</Option>
                            <Option value="Food Scanner">Food Scanner</Option>
                          </Select>
                        </div>
                        <div>
                          <label>Sort:</label>
                          <Select
                            defaultValue="Newest"
                            onChange={(e) => {
                              this.sortWishlistByDate(e);
                            }}
                          >
                            <Option value="Newest">Newest</Option>
                            <Option value="Oldest">Oldest</Option>
                          </Select>
                        </div>
                      </>
                    }
                  >
                    <div className="all-order-count wishlist-length">
                      You have {wishlistlenght} items
                    </div>

                    <Table
                      dataSource={this.state.listData}
                      columns={columns}
                      pagination={{
                        total: this.state.totalRecord,
                        pageSize: 10,
                        hideOnSinglePage: true,
                      }}
                    />
                  </Card>
                </div>
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
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    loggedInDetail: auth.loggedInUser,
  };
};
export default connect(mapStateToProps, {
  addToCartAPI,
  enableLoading,
  disableLoading,
  getTraderProfile,
  getUserWishList,
  removeToWishList,
  removeToFavorite,
  removeFoodScannerItemFromFavorite,
  removeToRetailWishlist,
})(UserWishlist);
