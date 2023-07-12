import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Layout,
  Card,
  Table,
  Menu,
  Dropdown,
  Typography,
  Button,
  Tabs,
  Row,
  Col,
  Input,
  Select,
  Switch,
} from "antd";
import AppSidebar from "../dashboard-sidebar/DashboardSidebar";
import history from "../../common/History";
import { DASHBOARD_KEYS } from "../../config/Constant";
import { enableLoading, disableLoading } from "../../actions";
import {
  getAdManagementDetails,
  changeGeneralClassifiedStatus,
  deleteClassified,
  getVendorClassified,
  markAsSoldAPI,
  retailAdManagementAPI,
  deleteRetailAdsAPI,
  changeRetailStatusAPI,
} from "../../actions";
import "../dashboard/employer.less";
import { expireDate, dateFormate6 } from "../common";
import { DEFAULT_IMAGE_CARD } from "../../config/Config";
import { salaryNumberFormate } from "../common";
import GeneralPreview from "../classified-post-ad/update-post-ad/Preview";
import DeleteModel from "../common/DeleteModel";
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class MyAds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      subCategory: [],
      currentList: [],
      size: "large",
      showSettings: [],
      activeFlag: langs.key.all,
      ads_view_count: "",
      total_ads: "",
      tabs_count: {},
      activePage: 1,
      categoryList: [],
      flag_status: "",
      category_id: "",
      selectedCategory: "All Categories",
      search_key: "",
      filter: "recent",
      preview_model: false,
      classified_id: "",
      delete_model: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getApplicationList(1, this.state.activeFlag, "", "recent", "");
  }

  /**
   * @method  get Application List
   * @description get classified
   */
  getApplicationList = (page, flag_status, category_id, filter, search_key) => {
    const { loggedInUser, userDetails, privateUserDetails } = this.props;
    const id =
      userDetails && userDetails.user
        ? userDetails.user.id
        : privateUserDetails.id;
    let merchant = loggedInUser.role_slug === langs.key.merchant;
    let reqData = {
      user_id: id, //54
      page_size: 10,
      page: page !== undefined ? Number(page) : 1,
      flag_status,
      category_id: category_id ? category_id : "",
      filter: filter,
      search: search_key,
    };
    merchant
      ? this.getRetailAdManagementDetail(
          reqData,
          page,
          flag_status,
          category_id,
          filter,
          search_key
        )
      : this.getClassifiedAdManagementDetail(
          reqData,
          page,
          flag_status,
          category_id,
          filter,
          search_key
        );
  };

  /**
   * @method  getClassifiedAdManagementDetail
   * @description get classified ad list
   */
  getClassifiedAdManagementDetail = (
    reqData,
    page,
    flag_status,
    category_id,
    filter,
    search_key
  ) => {
    this.props.getAdManagementDetails(reqData, (res) => {
      this.props.disableLoading();
      this.setAdMangementData(
        res,
        page,
        flag_status,
        category_id,
        filter,
        search_key
      );
    });
  };

  /**
   * @method  getRetailAdManagementDetail
   * @description get retail ad list
   */
  getRetailAdManagementDetail = (
    reqData,
    page,
    flag_status,
    category_id,
    filter,
    search_key
  ) => {
    this.props.retailAdManagementAPI(reqData, (res) => {
      this.props.disableLoading();
      this.setAdMangementData(
        res.data,
        page,
        flag_status,
        category_id,
        filter,
        search_key
      );
    });
  };

  /**
   * @method  setAdMangementData
   * @description set ad management data
   */
  setAdMangementData = (
    res,
    page,
    flag_status,
    category_id,
    filter,
    search_key
  ) => {
    if (res && res.data && Array.isArray(res.data)) {
      console.log("res@@@", res);
      this.setState({
        currentList: res.data,
        total_ads: res.total_ads,
        tabs_count: res.tabs_count,
        ads_view_count: res.ads_view_count,
        total_ads: res.total_ads,
        page: page,
        flag_status: flag_status,
        category_id: category_id,
        filter: filter,
        search_key: search_key,
        categoryList: res.categories,
      });
    } else {
      this.setState({
        currentList: [],
        categoryList: [],
        page: page,
        flag_status: flag_status,
        category_id: category_id,
        filter: filter,
        search_key: search_key,
      });
    }
  };

  getVendorClassifiedList = () => {
    const { userDetails, privateUserDetails } = this.props;
    const id = userDetails ? userDetails.user.id : privateUserDetails.id;
    this.props.getVendorClassified({ user_id: id }, (res) => {
      if (res.status === 1) {
        let data = res.data;
        this.setState({ categoryList: data });
      }
    });
  };

  /**
   * @method change classified status
   * @description change classified status
   */
  changeStatus = (state, id) => {
    const { loggedInUser } = this.props;
    let merchant = loggedInUser.role_slug === langs.key.merchant;
    let reqdata = {
      id,
      state,
    };
    merchant
      ? this.changeRetailStatus(reqdata)
      : this.changeClassifiedStatus(reqdata);
  };

  /**
   * @method changeClassifiedStatus
   * @description change classified ads status
   */
  changeClassifiedStatus = (reqdata) => {
    this.props.changeGeneralClassifiedStatus(reqdata, (res) => {
      if (res.status === 200 || res.status === 1) {
        this.callNextAPI(langs.messages.change_status);
      }
    });
  };

  /**
   * @method changeRetailStatus
   * @description change retail ads status
   */
  changeRetailStatus = (reqdata) => {
    this.props.changeRetailStatusAPI(reqdata, (res) => {
      if (res.status === 200 || res.status === 1) {
        this.callNextAPI(langs.messages.change_status);
      }
    });
  };

  /**
   * @method delete classified
   * @description delete classified
   */
  deleteClassified = (id) => {
    const { loggedInUser } = this.props;
    let merchant = loggedInUser.role_slug === langs.key.merchant;
    let reqdata = {
      id,
    };
    merchant
      ? this.deleteRetailAds(reqdata)
      : this.deleteClassifiedAds(reqdata);
  };

  /**
   * @method deleteClassifiedAds
   * @description delete classified ads
   */
  deleteClassifiedAds = (reqdata) => {
    this.props.deleteClassified(reqdata, (res) => {
      console.log("res.status", res.status);
      if (res.status === 200 || res.status === 1) {
        this.callNextAPI(langs.messages.delete_classified_success);
      }
    });
  };

  /**
   * @method deleteRetailAds
   * @description delete retail ads
   */
  deleteRetailAds = (reqdata) => {
    this.props.deleteRetailAdsAPI(reqdata, (res) => {
      if (res.status === 200 || res.status === 1) {
        this.callNextAPI(langs.messages.delete_classified_success);
      }
    });
  };

  /**
   * @method callNextAPI
   * @description ad list api
   */
  callNextAPI = (message) => {
    const { activeFlag, activePage, category_id, filter, search_key } =
      this.state;
    this.getApplicationList(
      activePage,
      activeFlag,
      category_id,
      filter,
      search_key
    );
    toastr.success(langs.success, message);
  };

  /**
   * @method markAsSold
   * @description mark ad as sold
   */
  markAsSold = (id) => {
    const { loggedInUser } = this.props;
    let reqdata = {
      classified_id: id,
      user_id: loggedInUser.id,
    };
    this.props.markAsSoldAPI(reqdata, (res) => {
      if (res.status === 200 || res.status === 1) {
        this.callNextAPI(langs.messages.classified_mark_sold);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      category_id,
      currentList,
      tabs_count,
      total_ads,
      size,
      showSettings,
      activeFlag,
      filter,
      search_key,
      preview_model,
      classified_id,
      delete_model,
      categoryList,
    } = this.state;
    const { loggedInUser } = this.props;
    let merchant = loggedInUser.role_slug === langs.key.merchant;

    let finalArr = [...currentList];

    const columns = [
      {
        title: "",
        key: "classifiedid",
        dataIndex: "classifiedid",
        render: (cell, row, index) => {
          let status = "";
          if (row.status === 0 && row.is_expired === 1) {
            status = "Expired";
          } else if (row.status === 2 || row.status === 4) {
            status = "Pending";
          } else if (row.status === 3) {
            status = "Rejected";
          } else if (row.status === 1) {
            status = "Active";
          } else if (row.status === 5) {
            status = "Draft";
          } else {
            status = "Inactive";
          }
          console.log(row.status, " >>", status);
          return (
            <div className="switch">
              {(status === "Active" ||
                status === "Inactive" ||
                row.status === 3) && (
                <Switch
                  disabled={row.status === 3 ? true : false}
                  checked={row.status === 1 ? true : false}
                  onChange={(e) => {
                    console.log(row, "e: ", e);
                    if (status === "Pending") {
                      toastr.warning(
                        langs.warning,
                        langs.validation_messages.pendingAdValidation
                      );
                    } else if (status === "Expired") {
                      toastr.warning(
                        langs.warning,
                        langs.validation_messages.expiredAdValidation
                      );
                    } else if (row.status === 3) {
                      toastr.warning(
                        langs.warning,
                        langs.validation_messages.rejectedAdValidation
                      );
                    } else {
                      this.changeStatus(!row.status ? 1 : "2", cell);
                    }
                  }}
                />
              )}
              <p className="active-inactive">
                {row.status === 1 ? "Active" : "Inactive"}
              </p>
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "classifiedid",
        key: "name",
        render: (cell, row, index) => {
          let temp =
            row.spicification &&
            Array.isArray(row.spicification) &&
            row.spicification.length
              ? row.spicification
              : [];
          let temp2 = temp.filter((el) => el.slug === "company_name");
          let company_name = temp2 && temp2.length ? temp2[0].value : "";
          let temp3 = temp.filter((el) => el.slug === "rent");
          let residential_rent = temp3 && temp3.length ? temp3[0].value : "";
          return (
            <div className="ad-magment-title">
              {loggedInUser && loggedInUser.role_slug !== langs.key.job && (
                <div className="thumb-block-left">
                  <div className="thumb">
                    <div className="status-sold sold-label">
                      {row.is_sold === 1 ? <span>SOLD</span> : ""}
                    </div>
                    <img
                      src={
                        row &&
                        row.imageurl !== undefined &&
                        row.imageurl !== null
                          ? row.imageurl
                          : DEFAULT_IMAGE_CARD
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD;
                      }}
                      style={{ cursor: "pointer" }}
                      alt={""}
                    />
                  </div>
                </div>
              )}
              <div className="thumb-block-right-detail">
                <Title level={4} className="title">
                  {loggedInUser && loggedInUser.role_slug === langs.key.job ? (
                    <Link to={`/application-detail/${cell}`}>
                      <b style={{ fontSize: "14px" }}>{row.title}</b>
                    </Link>
                  ) : loggedInUser.role_slug === langs.key.real_estate ? (
                    <Link to={`/inspection-detail/${cell}`}>{row.title}</Link>
                  ) : loggedInUser.role_slug === langs.key.car_dealer ? (
                    <Link to={`/my-offer-details/${cell}`}>{row.title}</Link>
                  ) : (
                    row.title
                  )}
                </Title>

                {row.company_name && row.company_name !== "N/A" && (
                  <div className="company-name">{row.company_name}</div>
                )}
                <div className="location-name">{company_name}</div>
                {loggedInUser.role_slug !== langs.key.job && (
                  <div className="price">
                    <div className="price">
                      <b>{`AU$ ${salaryNumberFormate(parseInt(row.price))}`}</b>
                    </div>
                  </div>
                )}
                {row.catname && (
                  <div className="category-name blue-link">
                    {row.catname}
                    {residential_rent && `   |   ${residential_rent}`}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        title: "",
        key: "classifiedid",
        dataIndex: "classifiedid",
        render: (cell, row, index) => {
          return (
            <div className="ad-inspection-block">
              <div className="ad-block">
                <div className="title">Ad ID</div>
                <div className="num-detail">#{cell}</div>
              </div>
              <div className="ad-block">
                <div className="title">Last posted</div>
                <div className="num-detail">
                  {dateFormate6(row.posted_date)}
                </div>
              </div>
              {loggedInUser.role_slug === langs.key.real_estate && (
                <div className="ad-block">
                  <div className="title">Inspection</div>
                  <div className="num-detail">
                    {row.classified_inspections_count} Times
                  </div>
                </div>
              )}
              <div className="ad-block">
                <div className="title">Views</div>
                <div className="num-detail">{row.view_count}</div>
              </div>
              <div className="ad-block">
                <div className="title">Ad expires</div>
                <div className="num-detail"> {dateFormate6(row.end_date)}</div>
                <p className="day-left">
                  {expireDate(row.end_date) &&
                    `${expireDate(row.end_date)} days left`}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        title: "",
        key: "classifiedid",
        dataIndex: "classifiedid",
        render: (cell, row, index) => {
          let showIcons = showSettings.includes(cell);
          console.log("showIcons", showIcons);
          let status = "";
          if (row.status === 0 && row.is_expired === 1) {
            status = "Expired";
          } else if (row.status === 2 || row.status === 4) {
            status = "Pending";
          } else if (row.status === 3) {
            status = "Rejected";
          } else if (row.status === 1) {
            status = "Live";
          } else if (row.status === 5) {
            status = "Draft";
          } else {
            status = "Inactive";
          }
          const menu = (
            <Menu
              onClick={(e) => {
                if (e.key === "1") {
                  this.props.history.push(
                    `/edit-post-an-ad/${row.classifiedid}`
                  );
                } else if (e.key === "2") {
                  if (
                    loggedInUser &&
                    loggedInUser.role_slug === langs.key.job
                  ) {
                    this.props.history.push(`/application-detail/${cell}`);
                    console.log("hello1");
                  } else if (loggedInUser.role_slug === langs.key.real_estate) {
                    this.props.history.push(`/inspection-detail/${cell}`);
                    console.log("hello2");
                  } else if (loggedInUser.role_slug === langs.key.car_dealer) {
                    this.setState({ preview_model: true, classified_id: cell });
                    console.log("hello3");
                  }
                } else if (e.key === "3") {
                  this.setState({ delete_model: true, classified_id: cell });
                } else if (e.key === "4") {
                  this.props.history.push(
                    `/repost-ad/${langs.key.classified}/${cell}`
                  );
                } else if (e.key === "5") {
                  this.markAsSold(cell);
                }
              }}
            >
              <Menu.Item key={1}>
                <span className="action-icon">
                  <img
                    src={require("../../assets/images/icons/edit-action.svg")}
                    alt="edit"
                  />
                </span>
                Edit
              </Menu.Item>
              {!merchant && (
                <Menu.Item key={2}>
                  <span className="action-icon">
                    <img
                      src={require("../../assets/images/icons/view-action.svg")}
                      alt="View"
                    />
                  </span>
                  Overview
                </Menu.Item>
              )}
              <Menu.Item key={3}>
                <span className="action-icon">
                  <img
                    src={require("../../assets/images/icons/delete-action.svg")}
                    alt="delete"
                  />
                </span>
                Delete
              </Menu.Item>
              {/* {loggedInUser && loggedInUser.role_slug === langs.key.job && ( */}
              {/* <Menu.Item key={4}>
                <span className="action-icon">
                  <img
                    src={require("../../assets/images/icons/repost.svg")}
                    alt="repost"
                  />
                </span>
                Repost
              </Menu.Item> */}
              {/* )} */}
              {loggedInUser.role_slug === langs.key.car_dealer &&
              !row.is_sold ? (
                <Menu.Item key={5}>
                  <span>{"Mark As Sold"}</span>
                </Menu.Item>
              ) : null}
              {/* ) : (
                <Menu.Item key={5}>
                  Status:&nbsp;<span>{status}</span>
                </Menu.Item>
              )} */}
            </Menu>
          );

          if (row.status === "") {
            return "";
          }
          return (
            <div className="right-action">
              <Row>
                <Col span={22}>
                  {row.status === 1 ? (
                    <Button type="default" size={size}>
                      {status.toUpperCase()}
                    </Button>
                  ) : row.status === 2 ||
                    row.status === 4 ||
                    row.status === 5 ? (
                    <Button
                      type="default"
                      className={"ant-btn-pending"}
                      size={size}
                    >
                      {status.toUpperCase()}
                    </Button>
                  ) : (
                    <div className="expired-reject-label">
                      {status.toUpperCase()}
                    </div>
                  )}
                </Col>
                <Col span={2} className="edit-delete-dot">
                  {/* {row.is_sold !== 1 &&  */}
                  <Dropdown
                    overlay={menu}
                    placement="bottomCenter"
                    arrow="true"
                    overlayClassName="right-action-dropedown"
                  >
                    <MoreOutlined
                      size={30}
                      onClick={() => {
                        if (!showIcons) {
                          showSettings.push(cell);
                          this.setState({ showSettings });
                        } else {
                          let temp = showSettings.filter((l) => l !== cell);
                          this.setState({ showSettings: temp });
                        }
                      }}
                    />
                  </Dropdown>
                  {/* } */}
                </Col>
              </Row>
              {showIcons}
            </div>
          );
        },
      },
      {
        title: "",
        key: "classifiedid",
        dataIndex: "classifiedid",
        render: (cell, row, index) => {
          return merchant &&
            row.status !== 2 &&
            row.status !== 3 &&
            row.status !== 4 ? (
            <Link
              to={`/retail-review/${row.classifiedid}`}
              className="review-yellow-parent-block"
            >
              <div className="review-yellow-block">
                <div>
                  <img
                    src={require("../../assets/images/icons/revire-circle-star.svg")}
                    alt="review-circle"
                    width="20"
                  />
                  <Text className="revire-lable">Review</Text>
                </div>
              </div>
            </Link>
          ) : (
            <div className={"review-not-applicable"}></div>
          );
        },
      },
    ];
    let isRetailClassName = merchant
      ? "profile-vendor-retail-ad-managment"
      : "";
    return (
      <Layout>
        <Layout
          className={`retail-ven-ad-managment-common-block-v2 ad-managment-common-block-v2 ad-managment-common-block ${isRetailClassName}`}
        >
          <AppSidebar activeTabKey={DASHBOARD_KEYS.MYADS} history={history} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box ads"
              style={{ background: "#fff" }}
            >
              <div className="card-container signup-tab">
                <div className="profile-content-box mt-38">
                  <div className="heading-search-block">
                    <div className="">
                      <Row gutter={0}>
                        <Col xs={24} md={24} lg={24} xl={24}>
                          <h1>
                            <span>Ad Management</span>
                          </h1>
                          <div className="search-block">
                            <Input
                              placeholder="Search"
                              onChange={(e) =>
                                this.getApplicationList(
                                  1,
                                  activeFlag,
                                  category_id,
                                  filter,
                                  e.target.value
                                )
                              }
                              prefix={
                                <SearchOutlined className="site-form-item-icon" />
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <Card bordered={false} className="add-content-box">
                    <div className="card-header-select ">
                      <Row gutter={0}>
                        {merchant && (
                          <Col xs={24} md={24} lg={14} xl={14}>
                            <label>&nbsp;</label>
                            <Select
                              dropdownMatchSelectWidth={false}
                              defaultValue="All Categories"
                              onChange={(e) =>
                                this.getApplicationList(
                                  1,
                                  activeFlag,
                                  e,
                                  filter,
                                  search_key
                                )
                              }
                              className="card-header-categories"
                            >
                              <Option value="">All Categories</Option>
                              {categoryList &&
                                categoryList.map((el, i) => {
                                  return (
                                    <Option key={el.id} value={el.id}>
                                      {el.name}
                                    </Option>
                                  );
                                })}
                            </Select>
                          </Col>
                        )}
                        <Col xs={24} md={24} lg={10} xl={10}>
                          <label>Sort:&nbsp;</label>
                          <Select
                            dropdownMatchSelectWidth={false}
                            defaultValue="Latest posted"
                            onChange={(e) =>
                              this.getApplicationList(
                                1,
                                activeFlag,
                                category_id,
                                e,
                                search_key
                              )
                            }
                          >
                            <Option value="recent">Latest posted</Option>
                            <Option value="old">Old</Option>
                            <Option value="a">A to Z</Option>
                            <Option value="z">Z to A</Option>
                          </Select>
                        </Col>
                      </Row>
                    </div>
                    <Tabs
                      className={
                        merchant
                          ? "retail-ven-tab-myad-v2 genral-ven-tab-myad genral-ven-tab-myad-v2"
                          : "genral-ven-tab-myad genral-ven-tab-myad-v2"
                      }
                      onTabClick={(tab) => {
                        console.log("tab value", tab);
                        this.getApplicationList(
                          1,
                          tab,
                          category_id,
                          filter,
                          search_key
                        );
                        this.setState({
                          activeFlag: tab,
                          activePage: 1,
                          selectedCategory: "All Category",
                        });
                      }}
                      type="card"
                    >
                      <TabPane
                        tab={`All (${total_ads ? total_ads : 0})`}
                        key={langs.key.all}
                      >
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                              this.getApplicationList(
                                page,
                                this.state.activeFlag,
                                category_id,
                                filter,
                                search_key
                              );
                            },
                            pageSize: 10,
                            showSizeChanger: false,
                            total: total_ads,
                            hideOnSinglePage: true,
                          }}
                          dataSource={finalArr}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 ||
                            (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        ></Table>
                      </TabPane>
                      <TabPane
                        tab={`Active (${
                          tabs_count.active_ads ? tabs_count.active_ads : 0
                        })`}
                        key="1"
                      >
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                              this.getApplicationList(
                                page,
                                this.state.activeFlag,
                                category_id,
                                filter,
                                search_key
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.active_ads,
                            showPageSizeOptions: true,
                            hideOnSinglePage: true,
                          }}
                          dataSource={finalArr}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 ||
                            (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        />
                      </TabPane>
                      <TabPane
                        tab={`Inactive (${
                          tabs_count.inactive_ads ? tabs_count.inactive_ads : 0
                        })`}
                        key="2"
                      >
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                              this.getApplicationList(
                                page,
                                this.state.activeFlag,
                                category_id,
                                filter,
                                search_key
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.inactive_ads,
                            hideOnSinglePage: true,
                          }}
                          dataSource={finalArr}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 ||
                            (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        />
                      </TabPane>
                      <TabPane
                        tab={`Pending (${
                          tabs_count.pending_ads ? tabs_count.pending_ads : 0
                        })`}
                        key="4"
                      >
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                              this.getApplicationList(
                                page,
                                this.state.activeFlag,
                                category_id,
                                filter,
                                search_key
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.pending_ads,
                            hideOnSinglePage: true,
                          }}
                          dataSource={finalArr}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 ||
                            (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        />
                      </TabPane>
                      <TabPane
                        tab={`Expired (${
                          tabs_count.expired_ads ? tabs_count.expired_ads : 0
                        })`}
                        key="3"
                      >
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                              this.getApplicationList(
                                page,
                                this.state.activeFlag,
                                category_id,
                                filter,
                                search_key
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.expired_ads,
                            hideOnSinglePage: true,
                          }}
                          dataSource={finalArr}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 ||
                            (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        />
                      </TabPane>

                      <TabPane
                        tab={`Rejected (${
                          tabs_count.trashed_ads ? tabs_count.trashed_ads : 0
                        })`}
                        key="5"
                      >
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                              this.getApplicationList(
                                page,
                                this.state.activeFlag,
                                category_id,
                                filter,
                                search_key
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.trashed_ads,
                            hideOnSinglePage: true,
                          }}
                          dataSource={finalArr}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 ||
                            (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        />
                      </TabPane>

                      <TabPane
                        tab={`Draft (${
                          tabs_count.draft_ads ? tabs_count.draft_ads : 0
                        })`}
                        key="6"
                      >
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                              this.getApplicationList(
                                page,
                                "all",
                                category_id,
                                filter,
                                search_key
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.draft_ads,
                            hideOnSinglePage: true,
                          }}
                          dataSource={finalArr}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 ||
                            (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        />
                      </TabPane>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {preview_model && (
          <GeneralPreview
            visible={preview_model}
            onCancel={() => this.setState({ preview_model: false })}
            classified_id={classified_id}
          />
        )}
        {delete_model && (
          <DeleteModel
            visible={delete_model}
            onCancel={() => this.setState({ delete_model: false })}
            callDeleteAction={() => this.deleteClassified(classified_id)}
            label={"AD"}
          />
        )}
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
    privateUserDetails:
      profile.userProfile !== null ? profile.userProfile : null,
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getVendorClassified,
  getAdManagementDetails,
  changeGeneralClassifiedStatus,
  deleteClassified,
  markAsSoldAPI,
  retailAdManagementAPI,
  deleteRetailAdsAPI,
  changeRetailStatusAPI,
})(MyAds);
