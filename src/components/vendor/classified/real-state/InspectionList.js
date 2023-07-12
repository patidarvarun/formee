import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import Icon from "../../../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
import {
  DownOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Pagination,
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
import AppSidebar from "../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import {
  salaryNumberFormate,
  dateFormate6,
} from "../../../common";
import {
  deleteAllInspectionAPI,
  getVendorAdListAPI,
  getAdManagementDetails,
  changeClassifiedStatus,
  deleteClassified,
  enableLoading,
  disableLoading,
} from "../../../../actions";
import DeleteModel from '../../../common/DeleteModel'
import "./inspection.less";
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class InspectionList extends React.Component {
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
      category: [],
      ad_type: 1,
      filter: "recent",
      upcomig_inspection_count: 0,
      past_inspection_count: 0,
      search_key: "",
      delete_model: false,
      classified_id: ''
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getVendorAdList(1, 1, "recent", "");
  }

  /**
   * @method getVendorAdList
   * @description called after render the component
   */
  getVendorAdList = (page, type, filter, search_key) => {
    const { loggedInUser } = this.props;
    let reqData = {
      vendor_id: loggedInUser.id,
      // page: page,
      // per_page: 12,
      // is_upcoming: type,
      // filter: filter,
      search: search_key,
    };
    this.getData(reqData, type, filter, search_key);
  };

  /**
   * @method getData
   * @description get ad list of inspection
   */
  getData = (reqData, type, filter, search_key) => {
    this.props.getVendorAdListAPI(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let item = res.data && res.data.data;
        let inspectionList =
          item && Array.isArray(item.data) && item.data.length ? item.data : [];
        let category =
          res.data &&
          res.data.sub_categories &&
          Array.isArray(res.data.sub_categories) &&
          res.data.sub_categories.length
            ? res.data.sub_categories
            : [];
        this.setState({
          currentList: inspectionList,
          total_ads: item.total,
          category: category,
          ad_type: type,
          filter: filter,
          search_key: search_key,
          upcomig_inspection_count: res.data.upcomig_inspection_count,
          past_inspection_count: res.data.past_inspection_count,
        });
      } else {
        this.setState({ currentList: [] });
      }
    });
  };

  /**
   * @method deleteClassifiedInspection classified
   * @description delete classified
   */
  deleteClassifiedInspection = (id) => {
    const { ad_type, filter, search_key } = this.state;
    let reqData = {
      classified_id: id,
    };
    this.props.deleteAllInspectionAPI(reqData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.INSPECTION_DELETE_SUCCESS);
        this.getVendorAdList(1, ad_type, filter, search_key);
      }
    });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { ad_type, filter, search_key } = this.state;
    this.getVendorAdList(e, ad_type, filter, search_key);
  };

  /**
   * @method onCategoryChange
   * @description on category change render records
   */
  onCategoryChange = (item, page) => {
    const { loggedInUser } = this.props;
    if (item !== "all") {
      let reqData = {
        vendor_id: loggedInUser.id,
        page: page,
        per_page: 12,
        category_id: item,
      };
      this.getData(reqData);
    } else {
      let reqData = {
        vendor_id: loggedInUser.id,
        page: page,
        per_page: 12,
      };
      this.getData(reqData);
    }
  };
  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      currentList,
      ad_type,
      total_ads,
      size,
      showSettings,
      filter,
      upcomig_inspection_count,
      past_inspection_count,
      search_key,
      delete_model,
      classified_id
    } = this.state;
    const columns = [
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
          let temp2 = temp.filter((el) => el.slug === "rent");
          let residential_rent = temp2 && temp2.length ? temp2[0].value : "";
          return (
            <div className="ad-magment-title">
              <div style={{ minWidth: "320px" }}>
                <div className="thumb-block-left">
                  <div className="thumb">
                    <div className="status-sold">
                      {row.is_sold === 1 ? "SOLD" : ""}
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

                <div className="thumb-block-right-detail">
                  <Title level={4} className="title">
                    <Link to={`/inspection-detail/${row.id}`}>{row.title}</Link>
                  </Title>
                  {row.location && row.location !== "N/A" && (
                    <div className="location-name">{row.location}</div>
                  )}
                  <div className="price">{`AU$${salaryNumberFormate(
                    row.price
                  )}`}</div>
                  <div class="category-name blue-link">
                    {row.category_name}
                    {residential_rent && `   |   ${residential_rent}`}
                  </div>
                </div>
              </div>

              <div className="booking-count">
                <div class="ad-block">
                  <div class="num-detail">{row.inspection_count}</div>
                  <div class="title">Bookings</div>
                </div>
              </div>
              <div className="booking-count">
                <div class="ad-block">
                  <div class="num-detail">{row.attended_count}</div>
                  <div class="title">Attended</div>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: "",
        key: "id",
        dataIndex: "id",
        render: (cell, row, index) => {
          return (
            <div className="ad-inspection-block">
              <div className="ad-block">
                <div className="title">Inspection Date</div>
                <div className="num-detail">
                  <b>{dateFormate6(row.inspection_date_time)}</b>
                </div>
              </div>
              <div className="ad-block">
                <div className="title">Inspection</div>
                <div className="num-detail">
                  {`${row.inspection_count} times`}{" "}
                </div>
              </div>
              <div className="ad-block">
                <div className="title">Views</div>
                <div className="num-detail">{row.view_count}</div>
              </div>
              <div className="ad-block">
                <div className="title">Ad ID</div>
                <div className="num-detail">#{cell}</div>
              </div>

              <div className="ad-block">
                <div className="title">Ad expires</div>
                <div className="num-detail">{dateFormate6(row.end_date)}</div>
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
          let status = "";
          if (row.status === 0 && row.is_expired === 1) {
            status = "Expired";
          } else if (row.status === 2 || row.status === 4) {
            status = "Pending";
          } else if (row.status === 3) {
            status = "Rejected";
          } else if (row.status === 1) {
            status = "Live";
          } else {
            status = "Inactive";
          }
          let showIcons = showSettings.includes(cell);
          const menu = (
            <Menu
              onClick={(e) => {
                if (e.key === "1") {
                  this.props.history.push(`/inspection-detail/${row.id}`);
                } else if (e.key === "2") {
                  this.setState({delete_model: true, classified_id: row.id})
                  // this.deleteClassifiedInspection(row.id);
                }
              }}
            >
              <Menu.Item key={1}>
                <span className="action-icon">
                  <img
                    src={require("../../../../assets/images/icons/view-action.svg")}
                    alt="View"
                  />
                </span>
                Overview
              </Menu.Item>
              {<Menu.Item key={2}>
                <span className="action-icon">
                  <img
                    src={require("../../../../assets/images/icons/delete-action.svg")}
                    alt="delete"
                  />
                </span>
                Delete
              </Menu.Item>}
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
                      {status}
                    </Button>
                  ) : row.status === 2 ? (
                    <Button type="default" size={size}>
                      {status}
                    </Button>
                  ) : (
                    <Button type="default" danger size={size}>
                      {status}
                    </Button>
                  )}
                </Col>
                <Col span={2} className="edit-delete-dot">
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
                </Col>
              </Row>
              {showIcons}
            </div>
          );
        },
      },
    ];
  
    return (
      <Layout>
        <Layout className={`inspection-list-v2 ad-managment-common-block`}>
          <AppSidebar history={history} />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800, background: "#fff" }}
            >
              <div className="card-container signup-tab">
                <div className="profile-content-box mt-38">
                  <div className="heading-search-block">
                    <div className="">
                      <Row gutter={0}>
                        <Col xs={24} md={24} lg={24} xl={24}>
                          <h1>
                            <span>Inspections</span>
                          </h1>
                          <div className="search-block">
                            <Input
                              placeholder="Search"
                              onChange={(e) =>
                                this.getVendorAdList(
                                  1,
                                  ad_type,
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
                  <Card
                    bordered={false}
                    className="add-content-box job-application"
                  >
                    <div className="card-header-select">
                      <label>Sort:&nbsp;</label>
                      <Select
                        dropdownMatchSelectWidth={false}
                        defaultValue="Most recent"
                        onChange={(e) =>
                          this.getVendorAdList(1, ad_type, e, search_key)
                        }
                      >
                        <Option value="recent">Most recent</Option>
                        <Option value="old">Old</Option>
                        <Option value="a">A to Z</Option>
                        <Option value="z">Z to A</Option>
                      </Select>
                    </div>
                    <Tabs
                      defaultActiveKey={1}
                      type="card"
                      className="genral-ven-tab-myad genral-ven-tab-myad-v2"
                      onTabClick={(tab) => {
                        this.getVendorAdList(1, tab, filter, search_key);
                      }}
                    >
                      <TabPane
                        tab={`Upcoming (${upcomig_inspection_count})`}
                        key={1}
                      >
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: total_ads,
                            hideOnSinglePage: true,
                          }}
                          dataSource={currentList}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 || (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        ></Table>
                      </TabPane>
                      <TabPane tab={`Past (${past_inspection_count})`} key={0}>
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: total_ads,
                            hideOnSinglePage: true,
                          }}
                          dataSource={currentList}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 || (record.status === 0 && record.is_expired === 1)
                              ? "ant-table-row-reject"
                              : ""
                          }
                        ></Table>
                      </TabPane>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {delete_model && 
        <DeleteModel
          visible={delete_model}
          onCancel={() => this.setState({delete_model: false})}
          callDeleteAction={() => this.deleteClassifiedInspection(classified_id)}
          label={'AD'}
        />
        }
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
export default connect(mapStateToProps, {
  deleteAllInspectionAPI,
  getVendorAdListAPI,
  getAdManagementDetails,
  changeClassifiedStatus,
  deleteClassified,
  enableLoading,
  disableLoading,
})(InspectionList);
