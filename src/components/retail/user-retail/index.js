import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { MoreOutlined } from "@ant-design/icons";
import {
  Menu,
  Dropdown,
  Pagination,
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
import AppSidebar from "../../dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import Icon from "../../customIcons/customIcons";
import {
  UserRetailOrderList,
  enableLoading,
  disableLoading,
  updateOrderStatusAPI,
  retailRaiseDispute,
  retailReplyDispute,
  getRetailCategoryDetail,
  generateInvoice,
  deleteMyOfferAPI,
} from "../../../actions";
import { convertISOToUtcDateformate, salaryNumberFormate } from "../../common";
import "ant-design-pro/dist/ant-design-pro.css";
import { DEFAULT_IMAGE_TYPE, DASHBOARD_TYPES } from "../../../config/Config";
import { langs } from "../../../config/localization";
import { DASHBOARD_KEYS } from "../../../config/Constant";
import { SearchOutlined } from "@ant-design/icons";
import { STATUS_CODES } from "../../../config/StatusCode";
import "./userdetail.less";
import ReceivedModal from "../../vendor/retail/comman-modals/ReceiveModel";
import DisputeModal from "../../dashboard/vendor-profiles/common-modals/DisputeModal";
import ReplyDisputeModal from "../../dashboard/vendor-profiles/common-modals/ReplyDisputeModal";
import LeaveReviewModel from "../retail-categories/product-review/LeaveReviewModel";
import SendMessageModal from "../../classified-templates/common/modals/SendMessageModal";
import { ViewListingModal } from "../../classified-templates/common/modals/ViewListingModal";

const { Option } = Select;
const { Title, Text } = Typography;

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
class UserRetailDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      currentOrders: [],
      filteredCurrentOrders: [],
      pastOrders: [],
      filteredPastOrders: [],
      allOrders: [],
      filteredAllOrders: [],
      orderDetail: "",
      receiveModal: false,
      search_keyword: "",
      visibleDisputeModal: false,
      visibleReplyDisputeModal: false,
      selectedCategory: '',
      reviewModel: false,
      retailCategoryDetail: {},
      sendMessage: false,
      selectedOrder: {},
      search_keyword: '',
      viewListing: false,
      classified_id: '',
      categoryId: '',
    };
     
  }
 

  /**
   * @method  componentDidMount
   * @description called after mounting the component
   */
  componentDidMount() {
    this.getOrderList();
    // this.props.generateInvoice(res => {
    //   this.props.disableLoading()
    //   if(res.status === 200){
    //     let data = res.data && res.data.data
    //     let toUser = data.toUser ? data.toUser : ''
    //     let fromUser = data.fromUser ? data.fromUser : ''
    //     let messageData = data.messageData ? data.messageData : ''
        
        
        
    //     let subTotal = this.getTotal(messageData)
    //     this.setState({invoiceDetail: data,toUser: toUser,fromUser: fromUser,messageData: messageData,subTotal: subTotal})
        
    //   }
    // })
  }

  /**
   * @method  getOrderList
   * @description get order list
   */
  getOrderList = () => {
    const { loggedInUser } = this.props;
    const { search_keyword } = this.state;
    let reqData = {
      // user_id: '645',
      search_keyword,
      user_id: loggedInUser.id,
    };
    this.props.enableLoading();
    this.props.UserRetailOrderList(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let temp2 = [],
          temp1 = [];
        let data =
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length
            ? res.data.data
            : [];

        temp1 = data.filter(
          (el) =>
            el.order_status === "In Process" || el.order_status === "Pending"
        );
        temp2 = data.filter(
          (el) =>
            el.order_status === "Shipped" ||
            el.order_status === "Complete" ||
            el.order_status === "Done" ||
            el.order_status === "Delivered"
        );
        
        this.setState({
          allOrders: data,
          currentOrders: temp1,
          pastOrders: temp2,
        }, () => {
          this.filterOrdersByCategory('')
        });
      }
    });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { selectedDate, flag } = this.state;
    this.getDashBoardDetails(selectedDate, flag, e, "");
  };

  /**
   * @method change classified status
   * @description change classified status
   */
  changeStatus = (status, item) => {
    const { loggedInUser } = this.props;
    const { search_keyword } = this.state;
    let reqdata = {
      user_id: loggedInUser.id,
      order_detail_id: item.id,
      update_by: status === "Cancelled" ? "Buyer" : "Seller",
      order_status: status,
      reason: "other reason",
    };
    this.props.updateOrderStatusAPI(reqdata, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, langs.messages.change_status);
        this.getOrderList(search_keyword);
      }
    });
  };

  /**
   * @method deleteOrders
   * @description delete orders
   */
  deleteOrders = (id) => {};

  submitDispute = (values) => {
    const { loggedInUser } = this.props;
    const { orderDetail } = this.state;
    let reqData = {
      dispute_msg: values.other_reason,
      // dispute_status: 0,
      //             dispute_image;
      order_id: orderDetail.order_id,
      seller_id: orderDetail.seller_id,
      order_detail_id: orderDetail.id,
      user_id: loggedInUser.id,
      dispute_reason: values.other_reason ? values.other_reason : values.reason,
    };

    this.props.enableLoading();
    this.props.retailRaiseDispute(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, langs.messages.dispute_send_sucess);
        this.setState({ visibleDisputeModal: false });
      }
    });
  };

  submitDisputeReply = (values) => {
    const { loggedInUser } = this.props;
    const { orderDetail } = this.state;

    let reqData = {
      dispute_msg: values.other_reason,
      user_id: loggedInUser.id,
      dispute_reason: values.other_reason ? values.other_reason : values.reason,
      order_id: orderDetail.order_id,
      order_detail_id: orderDetail.id,
      dispute_msg: values.message,
      seller_id: orderDetail.seller_id,
      // seller_status
      // resolve_dispute
      user_id: loggedInUser.id,
    };
    this.props.enableLoading();
    this.props.retailReplyDispute(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, langs.messages.dispute_send_sucess);
        this.setState({ visibleReplyDisputeModal: false });
      }
    });
  };

  renderCategories = () => {
    const categories = this.props.retailCategories
    return categories.map(cat => {
      return (
        <Option key={cat.id} value={cat.text}>{cat.text}</Option>
      )
    })
    
  }

  onSelectCategory = (category) => {
    if(category) {
      this.setState({
        selectedCategory: category
      }, this.filterOrdersByCategory(category)
      )
    } else {
      this.filterOrdersByCategory('')
    }
  }

  filterOrdersByCategory = (category) => {
    let result1;
    let result2;
    let result3;
    if(category) {
      result1 = this.state.allOrders.filter(order => order.category_name === category);
      result2 = this.state.currentOrders.filter(order => order.category_name === category);
      result3 = this.state.pastOrders.filter(order => order.category_name === category);
    } else {
      result1 = this.state.allOrders;
      result2 = this.state.currentOrders;
      result3 = this.state.pastOrders;
    }
    this.setState({
      filteredAllOrders: result1,
      filteredCurrentOrders: result2,
      filteredPastOrders: result3
    })
  }

    /**
       * @method contactModal
       * @description contact model
       */
    leaveReview = (id) => {
        const { isLoggedIn } = this.props
        if (isLoggedIn) {
            this.getDetails(id)
            this.setState({ reviewModel: true })
        } else {
            this.props.openLoginModel()
        }
    };

  /**
   * @method getDetails
   * @description get classified details
   */
  getDetails = (id) => {
    if(!id) return
    this.props.enableLoading();
    const { isLoggedIn, loggedInUser } = this.props;
    let reqData = {
      id: id,
      user_id: isLoggedIn ? loggedInUser.id : "",
    };
    this.props.getRetailCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({
          retailCategoryDetail: res.data
        });
      }
    });
  };

  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = e => {
      this.setState({
          reviewModel: false,
          sendMessage: false
      });
  };

  /**
   * @method contactModal
   * @description contact model
   */
  contactModal = (order) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        selectedOrder: order,
        sendMessage: true,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method deleteClassifiedMyOffer
   * @description delete classified ads
   */
  deleteClassifiedMyOffer = (id) => {
    let reqdata = {
      offer_id: id,
    };
    this.props.deleteMyOfferAPI(reqdata, (res) => {
      if (res.status === 200 || res.status === 1) {
        this.getOrderList();
      }
    });
  };

  onSearch = (e) => {
    this.setState({
      search_keyword: e.target.value
    }, () => {
        this.getOrderList();
    })
  }

  onViewListing = (id, catId) => {
    this.setState({ 
      viewListing: true, 
      classified_id: id, 
      categoryId: catId,
    })
  }
   
  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      filteredAllOrders,
      filteredCurrentOrders,
      filteredPastOrders,
      receiveModal,
      orderDetail,
      visibleDisputeModal,
      visibleReplyDisputeModal,
      retailCategoryDetail,
      reviewModel,
      sendMessage,
      selectedOrder,
      search_keyword,
      viewListing,
      classified_id,
      categoryId,
    } = this.state;
    
    const { TabPane } = Tabs;

    const columns = [
      {
        title: "Item",
        
        dataIndex: "name",
        className :"order_item",
        // key: 'name'
        render: (cell, row, index) => {
          let image =
            row.order_detail_product &&
            row.order_detail_product.classified_imageSingle &&
            row.order_detail_product.classified_imageSingle.image_url;
          return (
            <>
              <div className="user-icon mr-13 d-flex userdetail-itemtable">
                <Avatar
                  src={
                    image && image !== undefined ? image : DEFAULT_IMAGE_TYPE
                  }
                />
                <div>
                  <div>{row.item_name}</div>
                  <div>
                    <b>{`AU$${salaryNumberFormate(row.item_total_amt)}`}</b>
                  </div>
                  <div className="pt-10 pink-text">
                    {" "}
                    {`${row.category_name} | ${row.sub_category_name}`}
                  </div>{" "}
                </div>
              </div>
            </>
          );
        },
      },
      {
        title: "order date",
        className:"order_date",
        dataIndex: "created_at",
        key: "created_at",
        render: (cell, row, index) => {
          return convertISOToUtcDateformate(row.created_at);
        },
      },
      {
        title: "order  id",
        className:"order_id",
        dataIndex: "order_id",
        key: "order_id",
      },
      {
        title: "status",
        className : "order_status",
        dataIndex: "order_status",
        render: (cell, row, index) => {
          let status = row.orders ? row.order_status : "Cancel";
          const menu = (
            <Menu
              onClick={(e) => {
                this.changeStatus(e.key, row);
              }}
            >
              {status !== "Complete" && status !== "Cancelled" && (
                <Menu.Item key={"Complete"}>Complete</Menu.Item>
              )}
              {status !== "Cancelled" && status !== "Complete" && (
                <Menu.Item key={"Cancelled"}>Cancelled</Menu.Item>
              )}
            </Menu>
          );
          const menuicon = (
            <Menu>
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      this.setState({ orderDetail: row, receiveModal: true })
                    }
                  >
                    view
                  </a>
                </div>
              </Menu.Item>
              <Menu.Item key="1">
                <span>
                  <img
                    src={require("../../../assets/images/icons/delete.svg")}
                    alt="delete"
                    onClick={() => this.deleteOrder(cell)}
                  />
                </span>
              </Menu.Item>
            </Menu>
          );
          if (status === "") {
            return "";
          }
          let btnClass = "retail-pending-btn";
          if (status === "Cancelled" || status === "Rejected") {
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
                  {status == "Rejected" ?
                  <Button type="primary" className={btnClass}>
                  <span className="color-dots"> </span> {status}
                </Button>:
                  <Dropdown overlay={menu} placement="bottomLeft" arrow>
                    <Button type="primary" className={btnClass}>
                      <span className="color-dots"> </span> {status}
                    </Button>
                  </Dropdown>}
                </Col>
              </Row>
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "order_status",
        className:"order_edit",
        render: (cell, row, index) => {
          const menuicon = (
            <Menu>
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      this.setState({ orderDetail: row, receiveModal: true })
                    }
                  >
                   <span className="edit-images"> <img src={require('./icons/view.svg')}/></span>{" "} <span>View Order</span>
                  </a>
                </div>
              </Menu.Item>
              {row.order_status == "Pending" && <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.onViewListing(row.id, row.category_id)}
                  >
                    <span className="edit-images"><img src={require('./icons/window.svg')}/></span> {" "}<span>View Listing</span>
                  </a>
                </div>
              </Menu.Item>}
              {(
                row.order_status == "Complete" 
                || row.order_status == "Delivered" 
                || row.order_status == "Shipped"
              ) && <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    // href="javascript:void(0)"
                    // onClick={() =>
                    //   this.setState({
                    //     orderDetail: row,
                    //     visibleDisputeModal: true,
                    //   })
                    // }
                  >
                   <span className="edit-images"> <img  src={require('./icons/windowequal.svg')}/></span>{" "} <span>View Invoice</span>
                  </a>
                </div>
              </Menu.Item>}
              {(
                row.order_status == "Complete" 
                || row.order_status == "Delivered" || 
                row.order_status == "Shipped"
              ) && <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.leaveReview(row.id)}
                  >
                   <span className="edit-images"> <img src={require('./icons/edit.svg')}/> </span> {" "}<span>Leave Review</span>
                  </a>
                </div>
              </Menu.Item>}
              <Menu.Item key="0">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.contactModal(row)}
                  >
                    <span className="edit-images"><img src={require('./icons/email.svg')}/> </span>{" "}<span>Send Message</span>
                  </a>
                </div>
              </Menu.Item>
              {(
                row.order_status == "Complete" 
                || row.order_status == "Delivered" 
                || row.order_status == "Shipped"  
                || row.order_status == "Cancelled"
              ) && <Menu.Item key="1">
                <div className="edit-delete-icons">
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.deleteClassifiedMyOffer(row.id)}
                  >
                   <span className="edit-images"> <img
                      src={require("../../../assets/images/icons/delete.svg")}
                      alt="delete"
                    /> </span>{" "}<span>Delete</span>
                  </a>
                </div>
              </Menu.Item>}
            </Menu>
          );

          return (
            <div className="edit-dropdown">
              <Row className="user-retail" style={{ float: "right" }}>
                <div className="edit-delete-dot">
                  <Dropdown
                    overlay={menuicon}
                    trigger={["click"]}
                    overlayClassName="show-phone-number  retail-dashboard"
                    placement="bottomRight"
                    arrow
                  >
                    <svg width="5" height="17" viewBox="0 0 5 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.71649 4.81189C3.79054 4.81189 4.66931 3.93312 4.66931 2.85907C4.66931 1.78502 3.79054 0.90625 2.71649 0.90625C1.64244 0.90625 0.763672 1.78502 0.763672 2.85907C0.763672 3.93312 1.64244 4.81189 2.71649 4.81189ZM2.71649 6.76471C1.64244 6.76471 0.763672 7.64348 0.763672 8.71753C0.763672 9.79158 1.64244 10.6704 2.71649 10.6704C3.79054 10.6704 4.66931 9.79158 4.66931 8.71753C4.66931 7.64348 3.79054 6.76471 2.71649 6.76471ZM2.71649 12.6232C1.64244 12.6232 0.763672 13.5019 0.763672 14.576C0.763672 15.65 1.64244 16.5288 2.71649 16.5288C3.79054 16.5288 4.66931 15.65 4.66931 14.576C4.66931 13.5019 3.79054 12.6232 2.71649 12.6232Z" fill="#C5C7CD"/>
</svg>
                  </Dropdown>
                </div>
              </Row>
            </div>
          );
        },
      },
    ];
    let count_table = filteredAllOrders.length;
    let count_table_current = filteredCurrentOrders.length;
    let count_table_past = filteredPastOrders.length;
    
    return (
      <Layout>
        <Layout>
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
                  {/* <div className="left">
                    <Title level={2}>Retail</Title>
                  </div> */}
                  <div className="right">
                    <div className="right-content">
                      <div className="tabs-button">
                        <Button
                          onClick={() => {
                            this.props.history.push("/dashboard");
                          }}
                          className="tabview-btn dashboard-btn"
                        >
                          My Dashboard
                        </Button>
                        <Button onClick={() => { this.props.history.push('/retail-orders') }} className="tabview-btn retail-btn active">Retail</Button>
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
                          className="tabview-btn booking-btn"
                        >
                          Booking
                        </Button>
                        {/* <Button
                          onClick={() => {
                            this.props.history.push("/food-scanner");
                          }}
                          className="tabview-btn food-scanner"
                        >
                          Food Scanner
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search Dashboard"
                            value={search_keyword}
                            prefix={
                              <SearchOutlined className="site-form-item-icon" />
                            }
                            onChange={this.onSearch}
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
                        
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="profile-content-box">
                  <Card bordered={false} className="add-content-box">
                    <div className="card-header-select">
                      <label></label>
                      <Select defaultValue="All Categories" onChange={this.onSelectCategory}>
                        <Option value="">All Categories</Option>
                        {this.renderCategories()}
                      </Select>
                    </div>
                  
                    
                   
                    <Tabs defaultActiveKey="1" type="card">
                      <TabPane
                        // tab={`All (${allOrders ? allOrders.length : 0})`}
                        tab={`All`}
                        key="1"
                      >
                         <div class="all-order-count">You have {count_table} Items</div>
                        <Table
                          className="retail-table"
                          dataSource={filteredAllOrders}
                          columns={columns}
                        ></Table>
                      </TabPane>
                      <TabPane
                        
                        // tab={`Current Order (${currentOrders.length})`}
                        tab={`Current Order`}
                        key="2">
                        <div class="all-order-count">You have {count_table_current} Items</div>
                        <Table className="retail-table" dataSource={filteredCurrentOrders} columns={columns} />
                      </TabPane>
                      <TabPane
                        // tab={`Past order (${pastOrders.length})`}
                        tab={`Past order`}
                        key="3"
                      >
                        <div class="all-order-count">You have {count_table_past} Items</div>
                        <Table className="retail-table" dataSource={filteredPastOrders} columns={columns} />
                      </TabPane>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        <DisputeModal
          submitDispute={this.submitDispute}
          handleClose={() => this.setState({ visibleDisputeModal: false })}
          visibleDisputeModal={visibleDisputeModal}
          selectedBookingId={orderDetail.id}
        />
        <ReplyDisputeModal
          submitDispute={this.submitDisputeReply}
          handleClose={() => this.setState({ visibleReplyDisputeModal: false })}
          visibleDisputeModal={visibleReplyDisputeModal}
          selectedBookingId={orderDetail.id}
        />

        {receiveModal && orderDetail && (
          <ReceivedModal
            visible={receiveModal}
            orderDetail={orderDetail}
            onCancel={() => this.setState({ receiveModal: false })}
            userRetail={true}
          />
        )}
        {reviewModel &&
            <LeaveReviewModel
                visible={reviewModel}
                onCancel={this.handleCancel}
                classifiedDetail={retailCategoryDetail && retailCategoryDetail}
                callNext={this.getDetails}
                is_retail={reviewModel}
            />
        }
        {viewListing && (
          <ViewListingModal
            visible={viewListing}
            onCancel={() => {
              this.setState({ 
                viewListing: false, 
              })
            }}
            classified_id={classified_id}
            categoryId={categoryId}
            type="offer"
          />
        )}
        {sendMessage && (
            <SendMessageModal
              visible={sendMessage}
              onCancel={this.handleCancel}
              classifiedDetail={selectedOrder && selectedOrder}
              receiverId={selectedOrder.seller_id
                  ? selectedOrder.seller_id
                  : ""
              }
              classifiedid={selectedOrder && selectedOrder.id}
            />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, common } = store;

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    retailCategories: common.categoryData.retail.data
  };
};
export default connect(mapStateToProps, {
  UserRetailOrderList,
  enableLoading,
  disableLoading,
  updateOrderStatusAPI,
  retailRaiseDispute,
  retailReplyDispute,
  getRetailCategoryDetail,
  generateInvoice,
  deleteMyOfferAPI,
})(UserRetailDashboard);
