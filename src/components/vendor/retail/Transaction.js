import React from "react";
import { connect } from "react-redux";
import {
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
} from "antd";
import AppSidebar from "../../dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import { langs } from "../../../config/localization";
import Icon from "../../customIcons/customIcons";
import {
  getAllTransactionList,
  enableLoading,
  disableLoading,
} from "../../../actions";
import { salaryNumberFormate } from "../../common";
import { DASHBOARD_KEYS } from "../../../config/Constant";
import { SearchOutlined } from "@ant-design/icons";
import ViewInvoiceModel from "./comman-modals/ViewInvoiceModel";
import PostAdPermission from "../../classified-templates/PostAdPermission";
import "../../retail/user-retail/userdetail.less";
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

class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransaction: [],
      invoiceModel: false,
      invoiceDetails: "",
      saerch_keyword: "",
      catId: "",
    };
  }

  /**
   * @method  componentDidMount
   * @description called after mounting the component
   */
  componentDidMount() {
    this.getTransactionList("", "");
  }

  /**
   * @method  getTransactionList
   * @description get order list
   */
  getTransactionList = (search_keyword, cat_id) => {
    this.setState({ search_keyword: search_keyword, catId: cat_id });
    let reqData = {
      search_keyword: search_keyword,
      category_id: cat_id,
    };
    this.props.enableLoading();
    this.props.getAllTransactionList(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let data =
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length
            ? res.data.data
            : [];

        this.setState({ allTransaction: data });
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
   * @method deleteOrders
   * @description delete orders
   */
  deleteOrders = (id) => {};

  /**
   * @method getCategory
   * @description get retail category
   */
  getCategory = (item) => {
    return (
      item.length !== 0 &&
      item.map((el, i) => {
        return (
          <Option key={i} value={el.id}>
            {el.text}
          </Option>
        );
      })
    );
  };

  handleCategoryChange = (value) => {
    const { search_keyword } = this.state;
    this.getTransactionList(search_keyword, value);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      allTransaction,
      invoiceModel,
      invoiceDetails,
      search_keyword,
      catId,
    } = this.state;
    const { TabPane } = Tabs;
    const { retailList, loggedInUser } = this.props;
    let merchant = loggedInUser.role_slug === langs.key.merchant;
    const columns = [
      {
        title: "Invoice Id",
        dataIndex: "order_id",
        key: "order_id",
        render: (cell, row, index) => {
          return `${row.order_id} - ${row.classified_id} - ${row.seller_id}`;
        },
      },
      {
        title: "Order Id",
        dataIndex: "order_id",
        key: "order_id",
      },
      {
        title: "Category",
        dataIndex: "name",
        // key: 'name'
        render: (cell, row, index) => {
          return (
            <>
              <div className="user-icon mr-13 d-flex userdetail-itemtable">
                <div>
                  {row.category_name ? row.category_name : ""} <br />
                  {row.sub_category_name ? row.sub_category_name : ""}
                </div>
              </div>
            </>
          );
        },
      },
      {
        title: "Items Name",
        dataIndex: "item_name",
        key: "item_name",
        render: (cell, row, index) => {
          return <div className="item-name">{row.item_name}</div>;
        },
      },
      {
        title: "Price",
        dataIndex: "Price",
        key: "Price",
        render: (cell, row, index) => {
          return (
            <div className="price">
              {" "}
              AU$${salaryNumberFormate(row.item_price)}
            </div>
          );
        },
      },
      {
        title: "Type",
        dataIndex: "payment_method",
        key: "payment_method",
        render: (cell, row, index) => {
          return row.orders ? row.orders.payment_method : "";
        },
      },
      {
        title: "Status",
        dataIndex: "order_status",
        render: (cell, row, index) => {
          let status =
            row.order_status === "Delivered" ||
            row.order_status === "Shipped" ||
            row.order_status === "delivered" ||
            row.order_status === "shipped"
              ? "Paid"
              : "Unpaid";
          return (
            <div className="right-action">
              <Row className="user-retail">
                <Col md={22}>
                  <Button
                    className={status === "Paid" ? "success-btn" : "cancel-btn"}
                  >
                    {status}
                  </Button>
                </Col>
              </Row>
            </div>
          );
        },
      },
      {
        title: "Views",
        render: (cell, row, index) => {
          return (
            <div>
              {" "}
              <a
                className="order"
                clhref="javascript:void(0)"
                onClick={() =>
                  this.setState({ invoiceDetails: row, invoiceModel: true })
                }
              >
                View
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <Layout>
        <Layout className="profile-vendor-retail-transaction-order">
          <AppSidebar
            history={history}
            activeTabKey={DASHBOARD_KEYS.DASH_BOARD}
          />
          <Layout>
            <div
              className="my-profile-box employee-dashborad-box employee-myad-box vendor-transactions"
              style={{ minHeight: 800 }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Transactions</Title>
                  </div>
                  {/* <div className="right">
                    <div className="right-content">
                      <PostAdPermission
                        title={merchant ? "Start selling" : "Post Ad"}
                      />
                    </div>
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
                              this.getTransactionList(e.target.value, catId);
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        md={8}
                        lg={8}
                        xl={10}
                        className="employer-right-block text-right"
                      >
                        {/* <div className="right-view-text">
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
                        </div> */}
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="profile-content-box">
                  <Card
                    bordered={false}
                    className="add-content-box job-application"
                    // title='Orders Management'
                  >
                    <Row className="grid-block">
                      <Row
                        style={{ height: "56px" }}
                        className="w-100"
                        align="middle"
                        justify="space-between"
                      >
                        <Col md={12}>
                          <h2 className="mb-0 pb-0">
                            Transaction Management
                            <span
                              style={{ marginLeft: "25px" }}
                            >{`(You have ${allTransaction.length} orders)`}</span>
                          </h2>
                        </Col>
                        <Col md={12}>
                          <div className="card-header-select">
                            <label>Show:</label>
                            <Select
                              style={{ color: "#EE4928" }}
                              defaultValue="All Categories"
                              onChange={this.handleCategoryChange}
                            >
                              <Option value={""}>All Categories</Option>
                              {this.getCategory(retailList)}
                            </Select>
                          </div>
                        </Col>
                      </Row>
                      <Col md={24}>
                        <Table
                          dataSource={allTransaction}
                          columns={columns}
                          className="inspectiondetail-table retail-order-table"
                        ></Table>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {invoiceModel && invoiceDetails && (
          <ViewInvoiceModel
            visible={invoiceModel}
            invoiceDetails={invoiceDetails}
            onCancel={() => this.setState({ invoiceModel: false })}
            callNext={() => this.getTransactionList()}
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
  getAllTransactionList,
  enableLoading,
  disableLoading,
})(Transaction);
