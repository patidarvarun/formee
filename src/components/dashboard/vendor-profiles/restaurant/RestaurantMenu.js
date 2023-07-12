import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../config/localization";
import {
  Modal,
  message,
  Select,
  Input,
  Space,
  Form,
  Layout,
  Card,
  Typography,
  Button,
  Tabs,
  Row,
  Col,
  Menu,
  Dropdown,
} from "antd";
import AppSidebar from "../../../dashboard-sidebar/DashboardSidebar";
import history from "../../../../common/History";
import NoContentFound from "../../../common/NoContentFound";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import {
  AddMenuCategory,
  enableLoading,
  disableLoading,
  getRestaurantDetail,
} from "../../../../actions";
import { DownOutlined } from "@ant-design/icons";
import { required } from "../../../../config/FormValidation";
import ListExample from "../../../booking/common/List";
import "../../vendor-profiles/myprofilerestaurant.less";
import MenuListing from "./MenuListing";
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
class RestaurantMenu extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      restaurantDetail: [],
      fileList: [],
      itemId: "",
      selectedItem: [],
      Id: "",
      visible: false,
      menuId: "",
      menuItem: []
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    // this.props.enableLoading()
    // this.getServiceDetail()
  }

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props;
    this.props.getRestaurantDetail(loggedInUser.id, "", (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let data = res.data && res.data.data;
        const item = data && data.menu;
        const menuCategory =
        item &&
        item.menu_categories &&
        Array.isArray(item.menu_categories) &&
        item.menu_categories.length
        ? item.menu_categories[0]
        : [];
        let menuItem =
        menuCategory.menu_items &&
        Array.isArray(menuCategory.menu_items) &&
        menuCategory.menu_items.length
        ? menuCategory.menu_items
        : [];
        this.setState({ menuId: item.id, menuItem: menuItem, restaurantDetail: data }); 
      }
    });
  };

  /**
   * @method renderRestaurantDetail
   * @description render restaurant details
   */
  renderRestaurantDetail = (bookingDetail) => {
    const { isEditFlag } = this.state;
    const item =
      bookingDetail && bookingDetail.menu && bookingDetail.menu.menu_categories;

    if (item && item.length) {
      return (
        <Tabs onChange={() => this.setState({ selectedCategoryId: null })}>
          {Array.isArray(item) &&
            item.length &&
            item.map((el, i) => {
              return (
                <TabPane tab={el.menu_category_name} key={i}>
                  {/* <MenuListing categoryId={el.id}/>           */}
                  {/* <Title level={4} className="item">{'Menu items'}</Title> */}
                  <ListExample listItem={el.menu_items} invisible={true} />
                </TabPane>
              );
            })}
        </Tabs>
      );
    } else {
      return <NoContentFound />;
    }
  };

  /**
   * @method addCategory
   * @description add menu categoty
   */
  addCategory = (value) => {
    const { menuId } = this.state;
    let requestData = {
      // menu_id: menuId,
      menu_category_name: value.menu_category_name,
    };
    this.props.AddMenuCategory(requestData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MENU_CATEGORY_ADD_SUCCESS);
        this.setState({ visible: false });
        this.getServiceDetail();
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, isEditFlag, restaurantDetail, menuItem } = this.state;
    return (
      <Layout>
        <Layout className="create-membership-block restaurant-new-vendor">
          <AppSidebar history={history} />
          <Layout>
            <div className="my-profile-box" style={{ minHeight: 800 }}>
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>My Menu</Title>
                  </div>
                </div>
                <Card
                  bordered={false}
                  className="profile-content-box edit profile-content-edit-menu-box"
                  title={"All Menu"}
                  extra={
                    <Row gutter={[20, 0]} className="edit-add-right-btn">
                      <Col>
                        <Button
                          htmlType="button"
                          type="primary"
                          size="middle"
                          className="orange-outline-btn"
                          // style={{ backgroundColor: '#EE4929' }}
                          onClick={() => this.setState({ visible: true })}
                        >
                          Add Category
                        </Button>
                      </Col>
                      {/* <Col>
                        <Link to={'/edit-menu'}>
                          <Space
                            align={"center"}
                            className={"blue-link"}
                            style={{ cursor: "pointer" }}
                            size={9}
                            onClick={() => this.setState({ isEditFlag: true })}
                          >
                            Edit
                            <img
                              src={require("../../../../assets/images/icons/edit-pencil.svg")}
                              alt="delete"
                            />
                          </Space>
                        </Link>
                      </Col> */}
                      {/* <Col>
                        <Link to={'/add-menu'}><Button
                          htmlType="button"
                          type={'default'}
                          danger
                          className='text-white'
                          style={{ backgroundColor: '#EE4929' }}
                          // onClick={() => this.setState({ visible: true })}
                        >
                          Add Menu
                        </Button>
                        </Link>
                      </Col> */}
                    </Row>
                  }
                >
                  <MenuListing menuItem={menuItem}/>
                  {/* <Row gutter={[38, 38]}  >
                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Card
                        className='restaurant-tab test restaurant-tab-new-vendor'
                      >
                        <Title level={4}>{'Menu Category'}</Title>
                        {this.renderRestaurantDetail(restaurantDetail)}
                      </Card>
                    </Col>
                  </Row> */}
                </Card>
              </div>
            </div>
          </Layout>
        </Layout>
        {visible && (
          <Modal
            title="New Menu Category"
            visible={visible}
            layout="vertical"
            className={"custom-modal style1 edit-menu-category-popup"}
            footer={false}
            onCancel={() => this.setState({ visible: false })}
          >
            <div className="padding">
              <Form {...layout} onFinish={this.addCategory}>
                <Form.Item name="menu_category_name" rules={[required("")]}>
                  <Input
                    className="shadow-input "
                    placeholder="Enter Category Name"
                  />
                </Form.Item>
                <Form.Item className="custom-add-menu-type">
                  <Button
                    onClick={() => this.setState({ visible: false })}
                    className="clear-btn"
                  >
                    Cancel
                  </Button>
                  <Button htmlType="submit" className="orange-btn">
                    Add
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Modal>
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  AddMenuCategory,
  enableLoading,
  disableLoading,
  getRestaurantDetail,
})(RestaurantMenu);
