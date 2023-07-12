import React from "react";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { RightOutlined } from "@ant-design/icons";
import {
  Menu,
  Dropdown,
  Layout,
  Card,
  Typography,
  Button,
  Tabs,
  Table,
  Row,
  Col,
  Input,
  Select,
  Pagination,

} from "antd";
import AppSidebar from "../../dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import Icon from "../../customIcons/customIcons";
import {
  retailVendorOrderList,
  UserRetailOrderList,
  enableLoading,
  disableLoading,
  updateOrderStatusAPI,
  getOrderDetails,
} from "../../../actions";
import { salaryNumberFormate } from "../../common";
import "ant-design-pro/dist/ant-design-pro.css";
import { langs } from "../../../config/localization";
import { DASHBOARD_KEYS } from "../../../config/Constant";
import { SearchOutlined } from "@ant-design/icons";
import OrderDetailModel from "./comman-modals/OrderDetailModel";
import "../retail/";
const { Option } = Select;
const { Title } = Typography;

// Pagination
function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return (
      <a>
        <Icon icon="arrow-left" size="14" className="icon" /> Back
      </a>
    );
  }
  if (type === "next") {
    return (
      <a>
        Next <Icon icon="arrow-right" size="14" className="icon" />
      </a>
    );
  }
  return originalElement;
}
class ReceivedOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      currentOrders: [],
      pastOrders: [],
      allOrders: [],
      receiveModal: {
        visible: false,
        type: 'order'
      },
      orderDetail: "",
      search_keyword: "",
      totalOrders: 0,
      search_keyword: '',
      filter: '',
      order_subtotal: 0
    };
  }

  /**
   * @method  componentDidMount
   * @description called after mounting the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getOrderList('1', '', '', 'desc', 'order_id');
  }

  /**
   * @method  getOrderList
   * @description get order list
   */
  getOrderList = (page,search_keyword,filter, column_sort, column_name) => {
    const { loggedInUser } = this.props;
    let data = {
      user_id: loggedInUser.id,
      per_page: 10,
      page,
      search_keyword:search_keyword,
      order_status_filter: filter,
      column_sort: column_sort,
      column_name: column_name
    };
    // this.props.enableLoading();
    this.props.retailVendorOrderList(data, (res) => {
      console.log("res: ", res.data);
      this.props.disableLoading();
      if (res.status === 200) {
        let data =
          res.data &&
            res.data.data &&
            res.data.data.data &&
            Array.isArray(res.data.data.data) &&
            res.data.data.data.length
            ? res.data.data.data
            : [];
        
        this.setState({
          allOrders: data,
          totalOrders:
            res.data && res.data.data && res.data.data.total
              ? res.data.data.total
              : 0,
          search_keyword: search_keyword,
          filter: filter
        });
      }
    });
  };

  /**
   * @method  getOrderDetail
   * @description get order detail
   */
  getOrderDetails = (orderId, subUserId) => {
    const { loggedInUser, enableLoading, disableLoading, getOrderDetails } = this.props;
    console.log('loggedInUser: ', loggedInUser);
    let data = {
      user_id: loggedInUser.id,
      order_id: orderId,
    };
    if (subUserId) {
      data = {
        ...data,
        sub_order_id: subUserId
      }
    }
    enableLoading()
    getOrderDetails(data, (res) => {
      disableLoading()
      console.log("res: ", res);
      if (res.data) {
        this.setState({
          orderDetail: res.data.data,
          receiveModal: {
            visible: true,
            type: subUserId ? 'sub-order' : 'order'
          }
        });
      } else {

      }
    });
  };

  /**
   * @method change classified status
   * @description change classified status
   */
  changeStatus = (status, item) => {
    this.props.enableLoading();
    const { search_keyword, filter} = this.state;
    let reqdata = { 
      order_detail_id: item.id,
      update_by: status === "Cancelled" ? "Buyer" : "Seller",
      order_status: status,
    };
    this.props.updateOrderStatusAPI(reqdata, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        toastr.success(langs.success, langs.messages.change_status);
        this.getOrderList(1, search_keyword, filter, 'asc', '');
      }
    });
  };

  /**
   * @method handleTableChange
   * @description handle sort filter
   */
   handleTableChange = (params1, param2, param3) => {
    const { search_keyword, filter} = this.state;
    console.log('params', params1,param2,param3)
    let order = param3.order === 'descend' ? 'desc' : 'asc'
    this.getOrderList(1, search_keyword, filter,order, param3.field);
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { allOrders, receiveModal, orderDetail, search_keyword, filter } = this.state;
    const columns = [
      {
        // title: "Item Image",
        dataIndex: "image",
        render: (cell, row, index) => {
          let isIamgeUrl = row.order_detail_product &&
            row.order_detail_product.classified_image_single &&
            row.order_detail_product.classified_image_single.image_url
          return (
            <React.Fragment>
              <div className="item-Image-box">
                {
                  isIamgeUrl ? <img src={isIamgeUrl} /> : 'no image'
                }
              </div>
            </React.Fragment>
          );
        },
      },
      {
        title: "Order ID",
        dataIndex: "order_id",
        key: 'order_id',
        sorter: true,
        render: (cell, row, index) => {
          return (
            <div>
              <a
                className="order"
                clhref="javascript:void(0)"
                onClick={() => {
                  console.log("row: ", row);
                  this.getOrderDetails(row.order_id);
                }}
              >
              {/* {row.orders.formee_order_number==='365-270521-4' && <span className="OrderNewStatus">New</span>} */}
              {row.orders.formee_order_number}
              </a>
            </div>
          );
        },
      },
      {
        title: "Sub Order ID",
        dataIndex: "sub_order_id",
        sorter: true,
        key: 'sub_order_id',
        render: (cell, row, index) => {
          return (
            <div>
              {/* <a
                className="order"
                clhref="javascript:void(0)" */}
               {/* onClick={() => {
                //   console.log("row: ", row);
                //   this.getOrderDetails(row.order_id, row.id);
                // }}
              // > */}
                #
              {row.sub_order_id}
              {/* </a> */}


            </div>
          );
        },
      },
      {
        title: "Order Date",
        dataIndex: "created_at",
        sorter: true,
        key:'order_date',
        render: (cell, row, index) => {
          return (
            <React.Fragment>
              <div>
                <span>{moment(row.created_at).format("DD/MM/YYYY")}</span>
              </div>
            </React.Fragment>
          );
        },
      },
      {
        title: "Product Name",
        dataIndex: "item_name",
        key:'item_name',
        // sorter: true,
        render: (cell, row, index) => {
          return (
            <React.Fragment>
              <div>
                <div className="order-product-name">
                  <span>{row.item_name}</span>
                </div>
              </div>
            </React.Fragment>
          );
        },
      },
      {
        title: "Buyer Name",
        dataIndex: "buyer_name",
        key:'buyer_name',
        // sorter: true,
        render: (cell, row, index) => {
          return (
            <React.Fragment>
              <div className="user-icon d-flex userdetail-itemtable">
                <span>
                  {row.orders && `${row.orders.customer_fname} ${row.orders.customer_lname}`}
                </span>
              </div>
            </React.Fragment>
          );
        },
      },           
      {
        title: "Items",
        dataIndex: "qty",
        key:'qty',
        // sorter: true,
        render: (cell, row, index) => {
          return (
            <React.Fragment>
              <div className="text-center">
                <span>{row.item_qty}</span>
              </div>
            </React.Fragment>
          );
        },
      },
      {
        title: "Total Price",
        dataIndex: "item_total_amt",
        key: "total_price",
        sorter: true,
        render: (cell, row, index) => {
          return (
            <span className="price">
              AU${salaryNumberFormate(row.item_total_amt)}
            </span>
          );
        },
      },
      {
        title: "Destination",
        dataIndex: "customer_state",
        key:'customer_state',
        // sorter: true,
        render: (cell, row, index) => {
          return (
            <React.Fragment>
              <div>
                <span>{row.orders && row.orders.customer_state}</span>
              </div>
            </React.Fragment>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "order_status",
        render: (cell, row, index) => {
          let status = row.order_status ? row.order_status : "Cancelled";
          const menu = (
            <Menu
              onClick={(e) => {
                this.changeStatus(e.key, row);
              }}
              className=""
            // style={{border:'2px solid red'}}
            >
              {status !== "Shipped" && 
              <Menu.Item key={"Shipped"} className="status-shipped">Shipped</Menu.Item>}
              {status !== "Delivered" && 
              <Menu.Item key={"Delivered"} className="status-delivered">Delivered</Menu.Item>}
              {/* {status !== "Complete" && status !== "Cancelled" && (
                <Menu.Item key={"Complete"} className="status-complete">Complete</Menu.Item>
              )} */}
              {status !== "Complete" && status !== "Cancelled" && (
                <Menu.Item key={"Cancelled"} className="status-cancelled">Cancelled</Menu.Item>
              )}
              {status !== "Accepted" && 
              <Menu.Item key="Accepted" className="status-accepted">Accepted</Menu.Item>}
               {status !== "In Process" && 
              <Menu.Item key="In Process" className="status-in-process">In Process</Menu.Item>}
              {/* <Menu.Item key="Done" className="status-done">Done</Menu.Item> */}
              {status !== "Rejected" && 
              <Menu.Item key="Rejected" className="status-rejected">Rejected</Menu.Item>}
            </Menu>
          );
          if (status === "") {
            return "";
          }
          let btnClass = "retail-pending-btn";
          if (status === "Pending" || status === "In Process") {
            btnClass = "retail-pending-btn";
          } else if (status === "Cancelled" || status === "Rejected") {
            btnClass = "retail-cancel-btn";
          } else if (
            status === "Shipped" ||
            status === "Complete" ||
            status === "Done" ||
            status === "Delivered"
          ) {
            btnClass = "retail-shipped-btn";
          }
          return (
            <div className="right-action">
              <Row className="user-retail">
                <Col md={22}>
                  <Dropdown overlay={menu} placement="bottomLeft" arrow>
                    <Button type="primary" className={btnClass}>
                      {status}
                    </Button>
                  </Dropdown>
                </Col>
              </Row>
            </div>
          );
        },
      },
      {
        // title: "View Details",
        render: (cell, row, index) => {
          return (
            <div>
              {" "}
              <a
                className="order"
                clhref="javascript:void(0)"
                onClick={() => {
                  console.log("row: ", row);
                  // this.getOrderDetails(row.order_id, row.user_id);
                  this.getOrderDetails(row.order_id, row.id);
                }}
              >
                <RightOutlined />
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <Layout>
        <Layout className="profile-vendor-retail-receiv-order profile-vendor-retail-receiv-order-v2">
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>My Orders </Title>
                  </div>
                  {/* <div className="right">
                    <div className="right-content">&nbsp;</div>
                  </div> */}
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
                            onChange={(e) => {
                              this.getOrderList(1, e.target.value, filter, 'asc', '');
                            }}
                          />
                        </div>
                      </Col>
                      {/* <Col
                        xs={24}
                        md={8}
                        lg={8}
                        xl={10}
                        className="employer-right-block text-right"
                      >
                        <div className="right-view-text">
                          <span>
                            {" "}
                            <img
                              src={require("../../../assets/images/pin.png")}
                            />{" "}
                          </span>
                          <span
                            style={{
                              display: "inline-block",
                              paddingLeft: "15px",
                              paddingRight: "34px",
                            }}
                          >
                            {" "}
                            <img
                              src={require("../../../assets/images/menu_list.png")}
                            ></img>{" "}
                          </span>
                           <span>{'8'} Views</span><span className='sep'>|</span><span>{'9'} Ads</span> 
                        </div>
                      </Col> */}
                    </Row>
                  </div>
                </div>

                <div className="profile-content-box">
                  <Card
                    bordered={false}
                    className="add-content-box job-application"
                  // title='Orders Management'
                  >
                    <Row className="grid-block grid-block-v2">
                      <Row
                        style={{ height: "62px" }}
                        className="w-100"
                        align="middle"
                        justify="space-between"
                      >
                        <Col md={12}>
                          <h2 className="mb-0 pb-0">
                            Order Management
                            <span
                              style={{ marginLeft: "25px" }}
                            >{`You have ${this.state.totalOrders} orders`}</span>
                          </h2>
                        </Col>
                        <Col md={12}>
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              style={{ color: "#EE4928" }}
                              defaultValue="All"
                              onChange={(value) => {
                                this.getOrderList(1, search_keyword, value, 'asc', '');
                              }}
                            >
                              <Option value="">All</Option>
                              <Option value="Pending">Pending</Option>
                              <Option value="Accepted">Accepted</Option>
                              <Option value="In Process">In Process</Option>
                              <Option value="Shipped">Shipped</Option>
                              <Option value="Delivered">Delivered</Option>
                              <Option value="Cancelled">Cancelled</Option>
                              <Option value="Complete">Complete</Option>
                              <Option value="Rejected">Rejected</Option>
                            </Select>
                          </div>
                        </Col>
                      </Row>
                      <Col md={24}>
                        <Table
                          rowClassName={(row, index) => {
                            return row.orders.formee_order_number == "365-270521-4" ? "NewOrderStatusRow" : "";
                          }}
                          dataSource={allOrders}
                          columns={columns}
                          className="inspectiondetail-table retail-order-table"
                          pagination={false}
                          onChange={this.handleTableChange}
                          rowKey={record => record.order_id}
                        ></Table>
                        {this.state.totalOrders > 0 && (
                          <Pagination
                            pageSize={10}
                            total={this.state.totalOrders}
                            onChange={(page, pageSize) => {
                              this.getOrderList(page, search_keyword, filter, 'asc', '');
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {receiveModal.visible && orderDetail && (
          <OrderDetailModel
            visible={receiveModal.visible}
            type={receiveModal.type}
            orderDetail={orderDetail}
            onCancel={() => this.setState({ receiveModal: { ...receiveModal, visible: false } })}
            changeStatus={this.changeStatus}
            getOrderDetails={this.getOrderDetails}
          />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, common } = store;
  const { categoryData } = common;

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    retailList:
      categoryData && Array.isArray(categoryData.retail.data)
        ? categoryData.retail.data
        : [],
  };
};
export default connect(mapStateToProps, {
  retailVendorOrderList,
  UserRetailOrderList,
  enableLoading,
  disableLoading,
  updateOrderStatusAPI,
  getOrderDetails,
})(ReceivedOrder);
