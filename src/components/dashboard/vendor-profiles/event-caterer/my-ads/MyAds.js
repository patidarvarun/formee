import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../../config/localization";
import {
  DownOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
} from "antd";
import AppSidebar from "../../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../../common/History";
// import NoContentFound from '../../common/NoContentFound'
// import DetailCard from '../../templates/jobs/DetailCard'
import { DASHBOARD_KEYS } from "../../../../../config/Constant";
import PostAdPermission from "../../../../templates/PostAdPermission";
import { enableLoading, disableLoading } from "../../../../../actions";
import {
  getAdManagementDetails,
  changeClassifiedStatus,
  deleteClassified,
  getVendorClassified,
} from "../../../../../actions/vender/MyAds";
import "../../../employer.less";
import { DEFAULT_IMAGE_CARD } from "../../../../../config/Config";
import { salaryNumberFormate } from "../../../../common";
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
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getApplicationList(1, this.state.activeFlag, "");
    this.getVendorClassifiedList();
  }

  /**
   * @method  get Application List
   * @description get classified
   */
  getApplicationList = (page, flag_status, category_id) => {
    this.setState({
      page: page,
      flag_status: flag_status,
      category_id: category_id,
    });
    const { userDetails, privateUserDetails } = this.props;
    const id = userDetails ? userDetails.user : privateUserDetails.id;
    let reqData = {
      user_id: id, //54
      page_size: 10,
      page: page !== undefined ? Number(page) : 1,
      flag_status,
      category_id: category_id ? category_id : "",
    };
    this.props.getAdManagementDetails(reqData, (res) => {
      this.props.disableLoading();

      if (Array.isArray(res.data)) {
        this.setState({
          currentList: res.data,
          total_ads: res.total_ads,
          tabs_count: res.tabs_count,
          ads_view_count: res.ads_view_count,
          total_ads: res.total_ads,
        });
      } else {
        this.setState({ currentList: [] });
      }
    });
  };

  getVendorClassifiedList = () => {
    const { userDetails, privateUserDetails } = this.props;
    const id = userDetails ? userDetails.user : privateUserDetails.id;
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
    const { activeFlag, activePage, category_id } = this.state;
    let reqdata = {
      id,
      state,
    };
    this.props.changeClassifiedStatus(reqdata, (res) => {
      this.getApplicationList(activePage, activeFlag, category_id);

      toastr.success(langs.success, langs.messages.change_status);
    });
  };

  /**
   * @method delete classified
   * @description delete classified
   */
  deleteClassified = (id) => {
    const { activeFlag, activePage, category_id } = this.state;
    let reqdata = {
      id,
    };
    this.props.deleteClassified(reqdata, (res) => {
      this.getApplicationList(activePage, activeFlag, category_id);
      toastr.success(langs.success, langs.messages.delete_classified_success);
    });
  };

  /**
   * @method onCategoryChange
   * @description on category change render records
   */
  onCategoryChange = (category_id) => {
    const { loggedInUser } = this.props;
    const { activeFlag, activePage } = this.state;

    this.getApplicationList(activePage, activeFlag, category_id);
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      selectedCategory,
      category_id,
      categoryList,
      currentList,
      tabs_count,
      ads_view_count,
      total_ads,
      size,
      showSettings,
    } = this.state;
    const { loggedInUser } = this.props;
    let merchant = loggedInUser.role_slug === langs.key.merchant;
    let temp = [
      {
        title: "",
        posted_date: "",
        classifiedid: "",
        view_count: "",
        status: "",
        isFirstRow: true,
        view_review: "",
      },
    ];
    let finalArr = [...temp, ...currentList];
    const columns = [
      {
        title: "Item",
        dataIndex: "classifiedid",
        key: "name",
        render: (cell, row, index) => {
          if (row.isFirstRow) {
            return (
              <div className="total-ads">You have total Ads {total_ads}</div>
            );
          }
          return (
            <Col md={20} className="ad-magment-title">
              {loggedInUser && loggedInUser.role_slug !== langs.key.job && (
                <div className="thumb-block-custom-width">
                  <div className="thumb">
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
              <Title level={4} className="title">
                {loggedInUser && loggedInUser.role_slug === langs.key.job ? (
                  <Link to={`/application-detail/${cell}`}>{row.title}</Link>
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
              {row.location && row.location !== "N/A" && (
                <div className="location-name">{row.location}</div>
              )}
              {merchant && (
                <div className="location-name">
                  <div className="location-name">
                    <b>{`AU$ ${salaryNumberFormate(parseInt(row.price))}`}</b>
                  </div>
                </div>
              )}
              {row.catname && (
                <div className="category-name blue-link">{row.catname}</div>
              )}
              {/* <span class="sep">|</span> */}
              {/* <div className='job-name blue-link'>
                {'Accounting'}
              </div> */}
            </Col>
          );
        },
      },
      {
        title: "Last Posted",
        dataIndex: "posted_date",
        key: "posted_date",
      },
      {
        title: "Ad ID",
        dataIndex: "classifiedid",
        key: "classifiedid",
      },
      {
        title: "Views",
        dataIndex: "view_count",
        key: "view_count",
      },
      {
        title: "",
        key: "classifiedid",
        dataIndex: "classifiedid",
        render: (cell, row, index) => {
          console.log("row.isFirstRow", row.isFirstRow);
          if (row.isFirstRow) {
            return <div></div>;
          } else {
            return (
              <Link to={`/retail-review/${row.classifiedid}`}>View review</Link>
            );
          }
        },
      },
      {
        title: "Status",
        key: "classifiedid",
        dataIndex: "classifiedid",
        render: (cell, row, index) => {
          //
          let showIcons = showSettings.includes(cell);
          const menu = (
            <Menu
              onClick={(e) => {
                this.changeStatus(e.key, cell);
              }}
            >
              {row.status !== 2 && row.status !== 1 && (
                <Menu.Item key={1}>Active</Menu.Item>
              )}
              {row.status !== 2 && row.status !== 0 && (
                <Menu.Item key={2}>Inactive</Menu.Item>
              )}
            </Menu>
          );

          if (row.status === "") {
            return "";
          }
          return (
            <div className="right-action">
              <Row>
                <Col span={22}>
                  <Dropdown overlay={menu} placement="bottomLeft" arrow>
                    {row.status === 1 ? (
                      <Button type="primary" size={size}>
                        Active
                      </Button>
                    ) : row.status === 2 ? (
                      <Button type="primary" size={size}>
                        Pending
                      </Button>
                    ) : (
                      <Button type="primary" danger size={size}>
                        Inactive
                      </Button>
                    )}
                  </Dropdown>
                </Col>
                <Col span={2} className="edit-delete-dot">
                  {" "}
                  <MoreOutlined
                    size={50}
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
                </Col>
              </Row>
              {showIcons ? (
                <div className="edit-delete-icons">
                  <Link to={`/edit-post-an-ad/${row.classifiedid}`}>
                    <img
                      src={require("../../../../../assets/images/icons/edit-gray.svg")}
                      alt="edit"
                    />
                  </Link>
                  <span>
                    <img
                      src={require("../../../../../assets/images/icons/delete.svg")}
                      alt="delete"
                      onClick={() => this.deleteClassified(cell)}
                    />
                  </span>{" "}
                </div>
              ) : (
                ""
              )}
            </div>
            // <MoreOutlined />
          );
        },
      },
    ];
    let isRetailClassName = merchant
      ? "profile-vendor-retail-ad-managment"
      : "";
    return (
      <Layout>
        <Layout className={`ad-managment-common-block ${isRetailClassName}`}>
          <AppSidebar activeTabKey={DASHBOARD_KEYS.MYADS} history={history} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    {/* <Title level={2}>My Ad's</Title>*/}
                    <Title level={2}>Ad Management</Title>
                  </div>
                  <div className="right">
                    <div className="right-content">
                      <PostAdPermission
                        title={merchant ? "Start selling" : "Post an Ad"}
                      />
                    </div>
                  </div>
                </div>
                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search"
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                          />
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        md={8}
                        lg={8}
                        xl={10}
                        className="employer-right-block "
                      >
                        <div className="right-view-text">
                          {/* <span>145 Views</span><span className="sep">|</span><span>7 Ads</span> */}
                          <Text>
                            <span>{ads_view_count}</span> views{" "}
                            <span className="sep">|</span>{" "}
                            <span>{total_ads} Ads</span>
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="profile-content-box">
                  <Card bordered={false} className="add-content-box">
                    <div className="card-header-select">
                      <label>Show:</label>
                      {/* <Select defaultValue="All Categories">
                        <Option value="All Categories">All Categories</Option>
                        <Option value="All Categories">All Categories</Option>

                      </Select> */}
                      <Select
                        defaultValue="All Categories"
                        onChange={(e) => {
                          this.onCategoryChange(e);
                        }}
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
                    </div>
                    <Tabs
                      className="genral-ven-tab-myad"
                      onTabClick={(tab) => {
                        this.getApplicationList(1, tab, category_id);
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
                                category_id
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: total_ads,
                          }}
                          dataSource={finalArr}
                          columns={columns}
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
                                category_id
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.active_ads,
                          }}
                          dataSource={finalArr}
                          columns={columns}
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
                                category_id
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.inactive_ads,
                          }}
                          dataSource={finalArr}
                          columns={columns}
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
                                category_id
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.expired_ads,
                          }}
                          dataSource={finalArr}
                          columns={columns}
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
                                category_id
                              );
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: tabs_count.pending_ads,
                          }}
                          dataSource={finalArr}
                          columns={columns}
                        />
                      </TabPane>
                      <TabPane tab={`Trash (0)`} key="5">
                        <Table dataSource={finalArr} columns={columns} />
                      </TabPane>
                    </Tabs>
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
    privateUserDetails:
      profile.userProfile !== null ? profile.userProfile : null,
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getVendorClassified,
  getAdManagementDetails,
  changeClassifiedStatus,
  deleteClassified,
})(MyAds);
