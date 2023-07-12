import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Pagination,
  Layout,
  Calendar,
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
  Progress,
} from "antd";
import AppSidebar from "../../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import Icon from "../../../../components/customIcons/customIcons";
import {
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
  getUserNotification,
  deleteUserNotification,
  updateUserNotificationStatus,
} from "../../../../actions";
import { Pie, yuan } from "ant-design-pro/lib/Charts";
import "ant-design-pro/dist/ant-design-pro.css";
import { DEFAULT_IMAGE_TYPE } from "../../../../config/Config";
import { langs } from "../../../../config/localization";
import { DASHBOARD_KEYS } from "../../../../config/Constant";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { MoreOutlined } from "@ant-design/icons";
import "./userdetail.less";
import { isPrivateIdentifier } from "typescript";

const { Option } = Select;
const { Title, Text } = Typography;
let today = Date.now();

class UserNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationListData: [],
      dashboardDetails: {},
      dates: [],
      currentDate: today,
      selectedDate: moment(new Date()).format("YYYY-MM-DD"),
      index: "",
      calendarView: "week",
      monthStart: "",
      monthEnd: "",
      weekStart: "",
      weekEnd: "",
      flag: "",
      sortType: "Newest",
      paginationPerPage: [],
      isNotificationDeleted: false,
    };
  }

  componentDidMount() {
    const { loggedInUser } = this.props;
    if (loggedInUser) {
      this.getNotificationListingData();
    }
    let temp = [];
    for (let i = 1; i <= 20; i++) {
      temp.push(`${i}`);
    }
    this.setState({ paginationPerPage: temp });
  }

  getNotificationListingData = () => {
    const { loggedInUser } = this.props;
    let isLimited = false;
    if (loggedInUser) {
      this.props.enableLoading();
      this.props.getUserNotification(loggedInUser.id, isLimited, (response) => {
        this.props.disableLoading();
        console.log(
          "response*******************************************===>",
          response
        );
        if (response.status === 200) {
          let temArray = [];
          let notificationData = response.data.body;
          notificationData.map((value, i) => {
            let objectArray = {
              key: i,
              id: value.id,
              sender_id: value.sender_id,
              receiver_id: value.receiver_id,
              subject: value.subject,
              devicename: value.devicename,
              massage: value.massage,
              deviceid: value.deviceid,
              classified_id: value.classified_id,
              offer_price: value.offer_price,
              created_at: value.created_at,
              updated_at: value.updated_at,
              notifiable_id: value.notifiable_id,
              notifiable_type: value.notifiable_type,
              destination_url: value.destination_url,
              user_id: value.user_id,
              name: value.name,
              is_sellable: value.is_sellable,
              user_image: value.user_image,
              is_visible: value.is_visible,
            };
            temArray.push(objectArray);
          });
          let resData = this.sortData(temArray, this.state.sortType);
          this.setState({ notificationListData: resData });
        }
      });
    }
  };

  renderCategoryButton = (row) => {
    if (row.notifiable_type != null) {
      return <Button className="booking-btn">Bookings</Button>;
    } else if (row.classified_id != null && row.is_sellable === 1) {
      return <Button className="retail-btn">Retail</Button>;
    } else if (row.classified_id != null && row.is_sellable === 0) {
      return <Button className="classifield-btn">Classified</Button>;
    } else {
      return <Button className="food-scanner">Food Scanner</Button>;
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

  sortNotificationByDate = (sortOption) => {
    this.setState({ sortType: sortOption }, () => {
      let resData = this.sortData(this.state.notificationListData, sortOption);
      this.setState({ notificationListData: [...resData] });
    });
  };

  deleteNotification = (notificationId) => {
    const { loggedInUser } = this.props;
    console.warn(notificationId);
    if (loggedInUser) {
      this.props.enableLoading();
      this.props.deleteUserNotification(notificationId, (response) => {
        this.props.disableLoading();
        console.log(
          "response*******************************************===>",
          response
        );
        if (response.status === 200) {
          const arrayCopy = this.state.notificationListData.filter(
            (row) => row.id !== notificationId
          );
          this.setState({ notificationListData: arrayCopy });
          // this.getNotificationListingData();
        }
      });
    }
  };

  updateNotificationStatus = (notificationId) => {
    const { loggedInUser } = this.props;
    console.warn(notificationId);
    if (loggedInUser) {
      const reqFormData = {
        notification_id: notificationId,
      };
      this.props.enableLoading();
      this.props.updateUserNotificationStatus(reqFormData, (response) => {
        this.props.disableLoading();
        console.log(
          "response*******************************************===>",
          response
        );
        if (response.status === 200) {
          console.log(response);
          //  const arrayCopy = this.state.notificationListData;
          //  this.setState({notificationListData: arrayCopy});
          this.getNotificationListingData();
        }
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    console.warn("render working");
    const { notificationListData, paginationPerPage } = this.state;
    const columns = [
      {
        title: "Contact Name",
        dataIndex: "name",
        render: (cell, row, index) => {
          return (
            <>
              <div className="user-icon mr-13 d-flex ">
                <Avatar
                  src={
                    row.user_image != null ? row.user_image : DEFAULT_IMAGE_TYPE
                  }
                />
                <div>
                  <div className="user-name">{row.name}</div>
                  {
                    <div className="lightblue-text fs-14">
                      Updated 1 day ago
                    </div>
                  }
                </div>
              </div>
            </>
          );
        },
      },
      {
        title: "Categories",
        dataIndex: "subject",
        render: (cell, row, index) => {
          return (
            <>
              <div className="user-icon mr-13">
                <div className="date">{row.subject}</div>
                <div className="lightblue-text fs-14">on 24.05.2019</div>
              </div>
            </>
          );
        },
      },
      {
        title: "Date",
        dataIndex: "created_at",
        render: (cell, row, index) => {
          return (
            <>
              <div className="user-icon mr-13 ">
                <div className="date">
                  {moment(row.created_at).format("DD/MM/YYYY")}
                </div>
                <div className="lightblue-text fs-14">
                  {moment(row.created_at).format("HH:mm A")}
                </div>
              </div>
            </>
          );
        },
      },
      {
        title: "",
        dataIndex: "booking_type",
        render: (cell, row, index) => {
          return (
            <div className="last-action-block">
              {/* 
                ***********Comment By UI memeber RY as per new figma at 02-06-2021****************
                <div className="edit-delete-dot">
                  {" "}
                  <MoreOutlined size={50} />
                </div> 
                ***********Comment By UI memeber RY as per new figma at 02-06-2021****************
                */}
              <div className="btn-blockd">{this.renderCategoryButton(row)}</div>
              {/* <div className="delete-icon-block">
                <span>Delete</span>
                <img
                  src={require("../../../../assets/images/icons/delete-blue.svg")}
                  alt=""
                />
              </div> */}
            </div>
          );
        },
      },

      {
        title: "",
        key: "action",
        render: (cell, row, index) => (
          <div className="delete-icon-block">
            <a
              href="javascript:void(0)"
              onClick={() => {
                this.deleteNotification(row.id);
              }}
            >
              Delete{" "}
              <img
                src={require("../../../../assets/images/icons/delete-blue.svg")}
                alt=""
              />
            </a>
          </div>
        ),
      },
    ];

    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.NOTIFICATIONS}
          />
          <Layout className="user-notifications">
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box notification-outer"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                {/* 
                ***********Comment By UI memeber RY as per new figma at 02-06-2021****************
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Notifications rahul</Title>
                  </div>
                </div> */}
                {/* <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="searonRow={(record, rowIndex) => {
    return {
      onClick: event => {}, // click row
      onDoubleClick: event => {}, // double click row
      onContextMenu: event => {}, // right button click row
      onMouseEnter: event => {}, // mouse enter row
      onMouseLeave: event => {}, // mouse leave row
    };
  }}ch-block">
                          <Input
                            placeholder="Search"
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                            =+=+=+=+=+=+Below code is already comented +=+=+=+=+
                            onChange={(e) => {
                                const { selectedDate, flag } = this.state
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div> 
                ***********Comment By UI memeber RY as per new figma at 02-06-2021****************
                */}
                <div className="profile-content-box mt-50">
                  <div className="heading-search-block">
                    <div className="">
                      <Row gutter={0}>
                        <Col xs={24} md={24} lg={24} xl={24}>
                          <h1>
                            <span>Notifications</span>
                          </h1>
                          <div className="search-block">
                            <Input
                              placeholder="Search"
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
                    title="All Notifications"
                    className="add-content-box"
                    extra={
                      <div className="card-header-select">
                        <label>Sort by:</label>
                        <Select
                          defaultValue="Newest"
                          onChange={(e) => {
                            this.sortNotificationByDate(e);
                          }}
                          // dropdownClassName="filter-dropdown"
                        >
                          <Option value="Newest">Newest</Option>
                          <Option value="Oldest">Oldest</Option>
                        </Select>
                      </div>
                    }
                  >
                    <Table
                      rowClassName={(record, index) =>
                        record.is_visible == true
                          ? "table-row-bold"
                          : "table-row-unbold"
                      }
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            if (record.is_visible == false) {
                              console.log("record", record);
                              this.updateNotificationStatus(record.id);
                            } else {
                              event.stopPropagation();
                            }
                          },
                        };
                      }}
                      dataSource={notificationListData}
                      columns={columns}
                      pagination={{
                        defaultPageSize: 7,
                        showSizeChanger: true,
                        pageSizeOptions: paginationPerPage,
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
  };
};

export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  getDashBoardDetails,
  getTraderProfile,
  getUserNotification,
  deleteUserNotification,
  updateUserNotificationStatus,
})(UserNotification);
