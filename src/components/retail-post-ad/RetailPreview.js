import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import Icon from "../customIcons/customIcons";
import {
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Input,
  Select,
  Layout,
  Typography,
  Tabs,
  Row,
  Col,
  Button,
  Rate,
  Modal,
  Collapse,
} from "antd";
import { convertHTMLToText } from "../common";
import CarouselCustom from "../common/CarouselCustom";
import StaticReview from "./StaticReview";
import SellerInformation from "./StaticSellerInfo";
import { retailAdManagementAPI } from "../../actions";
import SimilerListing from "./PreviewSimilarAds";
import "../common/caraousal/crousal.less";
import "../dashboard/vendor-profiles/myprofilestep.less";
import "../retail/retail.less";
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const temp = [
  {
    rating: "5",
    review: "Very nice",
    name: "Joy",
  },
  {
    rating: "5",
    review: "Good",
    name: "Bob",
  },
  {
    rating: "5",
    review: "Excellent",
    name: "Mark",
  },
  {
    rating: "5",
    review: "Very nice",
    name: "Calley",
  },
  {
    rating: "5",
    review: "Very nice",
    name: "Marry",
  },
];

class Preview extends React.Component {
  myDivToFocus = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      carouselNav1: null,
      carouselNav2: null,
      isOpen: false,
      isPostageOpen: false,
      activeTab: "1",
      groupAtt: [],
      children: [],
      inventory_images: "",
      default_color: "",
      specification: [],
      similerListing: [],
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const {
      preview_detail,
      allDynamicAttribute,
      parent_categoryid,
      category_id,
    } = this.props;
    let specification = this.getSpecification(
      allDynamicAttribute,
      preview_detail
    );
    this.getVendorAds(category_id);
    let children = [],
      image = "",
      default_color = "";
    let inventory = preview_detail.group_inventory_attribute;
    let groupAtt = inventory && inventory.length ? inventory : [];
    if (groupAtt && Array.isArray(groupAtt) && groupAtt.length) {
      default_color = groupAtt[0].inv_attribute_value1;
      children =
        groupAtt[0].children &&
        Array.isArray(groupAtt[0].children) &&
        groupAtt[0].children.length
          ? groupAtt[0].children
          : "";
      image =
        groupAtt[0].image &&
        Array.isArray(groupAtt[0].image) &&
        groupAtt[0].image.length
          ? groupAtt[0].image
          : "";
    }
    this.setState({
      carouselNav1: this.slider1,
      carouselNav2: this.slider2,
      groupAtt: inventory,
      children: children,
      inventory_images: image,
      default_color: default_color,
      specification: specification,
    });
  }

  /**
   * @method getVendorAds
   * @description get vendor ads
   */
  getVendorAds = (category_id) => {
    const { loggedInDetail } = this.props;
    let reqData = {
      user_id: loggedInDetail.id,
      page_size: 10,
      page: 1,
      flag_status: "all",
      category_id: category_id ? category_id : "",
      filter: "recent",
      search: "",
    };
    this.props.retailAdManagementAPI(reqData, (res) => {
      if (res && res.data && Array.isArray(res.data.data)) {
        this.setState({ similerListing: res.data.data });
      }
    });
  };

  /**
   * @method getSpecification
   * @description get specification
   */
  getSpecification = (allDynamicAttribute, value) => {
    let specification = [];
    Object.keys(value).filter(function (key, index) {
      if (value[key] !== undefined) {
        allDynamicAttribute.map((el, index) => {
          if (el.att_name === key) {
            let att = allDynamicAttribute[index];
            let dropDropwnValue;
            if (att.attr_type_name === "Drop-Down") {
              let selectedValueIndex = att.value.findIndex(
                (el) => el.id === value[key] || el.name === value[key]
              );
              dropDropwnValue = att.value[selectedValueIndex];
            }
            specification.push({
              key: att.att_name,
              value:
                att.attr_type_name === "Drop-Down"
                  ? dropDropwnValue.name
                  : att.attr_type_name === "calendar"
                  ? moment(value[key]).format("YYYY")
                  : att.attr_type_name === "Date"
                  ? moment(value[key]).format("MMMM Do YYYY, h:mm:ss a")
                  : value[key],
            });
          }
        });
      }
    });
    return specification;
  };

  /**
   * @method onItemSelection
   * @description handle product item selection
   */
  onItemSelection = (data) => {
    let obj = data && JSON.parse(data);
    let children = [];
    let quantity = 0;
    let temp =
      obj && Array.isArray(obj.children) && obj.children.length
        ? obj.children
        : [];
    console.log("temp", temp);
    if (temp && temp.length) {
      temp &&
        temp.length &&
        temp.map((el, i) => {
          children.push({ id: i, child_value: el.child_value });
          quantity = quantity + Number(el.quantity);
        });
    }
    console.log("children", children);
    this.setState({
      children: children,
      available_quantity: quantity ? quantity : obj.quantity ? obj.quantity : 0,
      inventory_images: obj.image,
    });
  };

  renderColorOption = (groupAtt) => {
    console.log("color", groupAtt);
    return (
      groupAtt &&
      groupAtt.length &&
      groupAtt.map((el, i) => {
        return (
          <Option key={i} value={JSON.stringify(el)}>
            {el.inv_attribute_value1}
          </Option>
        );
      })
    );
  };

  /**
   * @method renderSize
   * @description render size
   */
  renderSize = (size) => {
    console.log("size", size);
    if (size && size.length) {
      return size.map((el, i) => {
        return (
          <Option key={i} value={el.child_value}>
            {el.child_value}
          </Option>
        );
      });
    }
  };

  renderInventory = (inventory, inv_default_value) => {
    const { default_color, children } = this.state;
    if (
      inv_default_value &&
      inv_default_value.length &&
      inventory &&
      inventory.length
    ) {
      let first = inv_default_value[0];
      let second = inv_default_value.length > 1 ? inv_default_value[1] : "";
      return (
        <div>
          <Row gutter={[10]}>
            {first && (
              <Col span={24}>
                <div className="choose-colour custom-gray-select-list">
                  <label for="select-colour">Select {first.display_name}</label>
                  <Select
                    onChange={(e) => this.onItemSelection(e)}
                    value={default_color}
                  >
                    {this.renderColorOption(inventory)}
                  </Select>
                </div>
              </Col>
            )}
            {second && (
              <Col span={15}>
                <div className="choose-size custom-gray-select-list">
                  <label for="select-size">Select {second.display_name}</label>
                  <Select>
                    {children && children.length && this.renderSize(children)}
                  </Select>
                </div>
              </Col>
            )}

            <Col span={9}>
              <div className="quantity-size-block custom-gray-select-list">
                <div className="choose-quantity">
                  <label for="select-quantity">Select Quantity</label>
                  <div className="choose-quantity-input">
                    <MinusOutlined />
                    <Input placeholder="1" type="number" />
                    <PlusOutlined />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
  };

  /**
   * @method renderPaymentMethods
   * @description render payment mrthods
   */
  renderPaymentMethods = (is_visible) => {
    return (
      <div className="payment-selector">
        {is_visible && <label>Payments:</label>}
        <div className="payment-icons">
          <img
            src={require("../../assets/images/icons/paypal.svg")}
            alt="paypal"
          />
          <img
            src={require("../../assets/images/icons/mastero.svg")}
            alt="mastero"
          />
          <img src={require("../../assets/images/icons/visa.svg")} alt="visa" />
          <img src={require("../../assets/images/icons/gpay.svg")} alt="gpay" />
          <img
            src={require("../../assets/images/icons/apple-pay.svg")}
            alt="apple-pay"
            className="aferpay"
          />
          {!is_visible && <span className="custom-br"></span>}
          <img
            src={require("../../assets/images/icons/after-pay.svg")}
            alt="apple-pay"
            className="apple-pay-img"
          />
          {is_visible && (
            <span>
              maybe available{" "}
              <a
                href="Javasript:void(0)"
                onClick={() => this.activeTab("4", "3")}
              >
                Learn More
              </a>
            </span>
          )}
        </div>
      </div>
    );
  };

  activeTab = (tab, panel) => {
    this.setState({ activeTab: tab, activePanel: panel });
    if (this.myDivToFocus.current) {
      window.scrollTo(0, this.myDivToFocus.current.offsetTop);
    }
  };

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    this.setState({ activeTab: key, reviewTab: false });
  };

  /**
   * @method renderSpecification
   * @description render specification list
   */
  renderSpecification = (data) => {
    let temp =
      data && Array.isArray(data) && data.length
        ? data.filter((el) => el.key !== "Features" && el.key !== "Price")
        : [];
    let sorted_list =
      temp &&
      temp.sort((a, b) => {
        if (a.position < b.position) return -1;
        if (a.position > b.position) return 1;
        return 0;
      });
    return (
      sorted_list &&
      Array.isArray(sorted_list) &&
      sorted_list.map((el, i) => {
        return (
          <Fragment key={i}>
            <Col span={6}>
              <label className="strong">{el.key}:</label>
            </Col>
            <Col span={6}>
              <div className="font-normal">{el.value}</div>
            </Col>
          </Fragment>
        );
      })
    );
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      inv_default_value,
      cat_name,
      sub_cat_name,
      preview_detail,
      product_images,
      visible,
    } = this.props;
    const {
      similerListing,
      specification,
      inventory_images,
      groupAtt,
      activeTab,
      activePanel,
      isPostageOpen,
    } = this.state;
    let description = preview_detail.description
      ? preview_detail.description.toHTML()
      : "";
    let inventory_visible =
      preview_detail.is_inventory_added &&
      preview_detail.is_inventory_added === 1
        ? true
        : false;
    return (
      <Modal
        visible={visible}
        className={
          "custom-modal prf-prevw-custom-modal retail-vendor-prevw-custom-modal"
        }
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className="retail-product-detail-parent-block">
          <React.Fragment>
            <Layout className="retail-theme common-left-right-padd">
              <Layout className="right-parent-block">
                <Layout>
                  <Row gutter={[0, 0]}>
                    <Col flex="370px">
                      {/* <div className="category-name"> 
                  <Button
                    type='ghost'
                    shape={'round'}
                  >
                    <Icon
                      icon="arrow-left"
                      size="20"
                      className="arrow-left-icon"
                    />
                    {sub_cat_name}
                  </Button>    
                </div> */}
                      <CarouselCustom
                        allImages={
                          inventory_images ? inventory_images : product_images
                        }
                      />
                    </Col>
                    <Col className="parent-right-block">
                      <div className="retail-product-detail-right">
                        <Row gutter={[0, 0]}>
                          {/* Product text-detail container: Start */}
                          <Col md={15}>
                            <div className="product-selector">
                              <Title level={3} className="price dress-name">
                                {preview_detail.title
                                  ? preview_detail.title
                                  : ""}
                              </Title>

                              <div className="views-count">
                                <Icon icon="view" size="16" />{" "}
                                <Text>
                                  {"0"}
                                  <span> Views</span>
                                </Text>
                              </div>
                              <div className="selector-detail">
                                {inventory_visible &&
                                inv_default_value &&
                                groupAtt.length !== 0 ? (
                                  this.renderInventory(
                                    groupAtt,
                                    inv_default_value
                                  )
                                ) : (
                                  <div className="quantity-size-block custom-gray-select-list">
                                    <br />
                                    <div className="choose-quantity">
                                      <label for="select-quantity">
                                        Select Quantity
                                      </label>
                                      <div className="choose-quantity-input">
                                        <MinusOutlined />
                                        <Input placeholder="1" type="number" />
                                        <PlusOutlined />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="view-size-giude">
                                  <div href="Javasript:void(0)">
                                    View Size Guide
                                  </div>
                                </div>
                                <div
                                  className={
                                    isPostageOpen
                                      ? "toggle-open delivery-add-collapse"
                                      : `delivery-add-collapse`
                                  }
                                  onClick={() =>
                                    this.setState({
                                      isPostageOpen: !isPostageOpen,
                                    })
                                  }
                                >
                                  <DownOutlined />
                                  <h4>Postage, Delivery and Return </h4>
                                  {isPostageOpen && (
                                    <div className="add-collapse-wrapper">
                                      <div className="d-flex">
                                        <label>Postage:</label>
                                        <div className="collapse-inner-data">
                                          <p>
                                            <span className="bold">Free</span>{" "}
                                            Standard Postage{" "}
                                            <a
                                              href="Javasript:void(0)"
                                              onClick={() =>
                                                this.activeTab("4", "1")
                                              }
                                            >
                                              See details
                                            </a>
                                          </p>
                                        </div>
                                      </div>
                                      <div className="d-flex">
                                        <label>Delivery:</label>
                                        <div className="collapse-inner-data">
                                          <p>
                                            Estimated between{" "}
                                            <span className="bold">
                                              1-2 business days
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      <div className="d-flex">
                                        <label>Return:</label>
                                        <div className="collapse-inner-data">
                                          <p>
                                            30 day buyer pays return postage{" "}
                                            <br />
                                            <a
                                              href="Javasript:void(0)"
                                              onClick={() =>
                                                this.activeTab("4", "2")
                                              }
                                            >
                                              See details
                                            </a>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {this.renderPaymentMethods(true)}
                              </div>
                            </div>
                          </Col>
                          <Col md={9}>
                            <div className="product-text-detail-container">
                              <div>
                                <div className="price-detail">
                                  <div className="d-i-block">
                                    <Title level={2} className="price">
                                      {preview_detail.price
                                        ? `AU$${preview_detail.price}`
                                        : ""}
                                    </Title>

                                    <span>Select size and quantity</span>
                                  </div>
                                  <div className="ant-dropdown-link">
                                    <Icon icon="share" size="20" />
                                  </div>
                                </div>
                                <div className="site-card-wrapper">
                                  <Row gutter={[20, 0]} className="action-btn">
                                    <Col>
                                      <Button
                                        className="purle-buttn"
                                        type="primary"
                                      >
                                        {"Buy It Now"}
                                      </Button>
                                    </Col>
                                    <Col>
                                      <Button type="default">
                                        {"Add to Cart"}
                                      </Button>
                                    </Col>
                                    <Col>
                                      <Button className="grey-buttn">
                                        <Icon icon={"wishlist"} size="11" />
                                        <span>Add to Wishlist</span>{" "}
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md={24}>
                            <div className="product-detail-bottom">
                              <div className="d-flex reviews ">
                                <label>Reviews:</label>
                                <div className="product-ratting">
                                  <Text>{"3.0"}</Text>
                                  <Rate disabled defaultValue={3} />
                                  <br />
                                  <div className="retail-rating-container blue-link">
                                    {"3.0"}
                                    <span
                                      className="blue-link"
                                      onClick={() => this.activeTab("3", "1")}
                                      style={{ cursor: "pointer" }}
                                    >
                                      3 reviews
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex add-detail">
                                <label>Ad Details:</label>
                                <div>
                                  <Button
                                    type="ghost"
                                    shape={"round"}
                                    className={"light-gray"}
                                  >
                                    {sub_cat_name}
                                  </Button>
                                  <div className="ad-num">
                                    <Paragraph className="text-gray mb-0">
                                      AD No. 22908
                                    </Paragraph>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex report-add">
                                <label>
                                  <p className="blue-p">
                                    <ExclamationCircleOutlined /> Report this Ad
                                  </p>
                                </label>
                              </div>
                            </div>
                          </Col>
                          {/* Product button container: End */}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <Layout
                    style={{
                      width: "calc(100% - 0px)",
                      overflowX: "visible",
                      marginTop: "27px",
                    }}
                  >
                    <div className="detail-page right-content-block">
                      <div ref={this.myDivToFocus}>
                        <Tabs
                          type="card"
                          className={"tab-style3 product-tabs"}
                          activeKey={activeTab}
                          onChange={this.onTabChange}
                        >
                          <TabPane tab="Product Details" key="1">
                            <div className="product-details-container">
                              <Row gutter={[20, 0]}>
                                <Col span={18}>
                                  <h4 className="detail-head">Overview</h4>
                                  <Paragraph>
                                    {description
                                      ? convertHTMLToText(description)
                                      : ""}
                                  </Paragraph>
                                  <Row className="pro-list">
                                    <Col span={24}>
                                      <Row gutter={[0, 0]}>
                                        {preview_detail.condition && (
                                          <Col span={6}>
                                            {" "}
                                            <label className="strong">
                                              Condition:
                                            </label>
                                          </Col>
                                        )}
                                        {preview_detail.condition && (
                                          <Col span={6}>
                                            {" "}
                                            <span>
                                              {preview_detail.condition
                                                ? preview_detail.condition
                                                : "New"}
                                            </span>
                                          </Col>
                                        )}
                                        {preview_detail.brand_name && (
                                          <Col span={6}>
                                            <label className="strong">
                                              Brand:
                                            </label>
                                          </Col>
                                        )}
                                        {preview_detail.brand_name && (
                                          <Col span={6}>
                                            <span>
                                              {preview_detail.brand_name
                                                ? preview_detail.brand_name
                                                : ""}
                                            </span>
                                          </Col>
                                        )}
                                        <Col span={6}>
                                          {" "}
                                          <label className="strong">
                                            Department:
                                          </label>
                                        </Col>
                                        <Col span={6}>
                                          {" "}
                                          <span>{cat_name}</span>
                                        </Col>
                                        <Col span={6}>
                                          <label className="strong">
                                            Size:
                                          </label>
                                        </Col>
                                        <Col span={6}>
                                          <span>S M L </span>
                                        </Col>
                                        <Fragment>
                                          <Col span={6}>
                                            <label className="strong">
                                              Package Dimension (L*W*H):
                                            </label>
                                          </Col>
                                          <Col span={6}>
                                            <span>
                                              {preview_detail.length
                                                ? `${preview_detail.length}`
                                                : ""}
                                              {preview_detail.width
                                                ? `x${preview_detail.width}`
                                                : ""}
                                              {preview_detail.height
                                                ? `x${preview_detail.height}`
                                                : ""}
                                            </span>
                                          </Col>
                                        </Fragment>
                                        <Fragment>
                                          <Col span={6}>
                                            {" "}
                                            <label className="strong">
                                              Package weight:
                                            </label>
                                          </Col>
                                          <Col span={6}>
                                            <span>
                                              {preview_detail.weight
                                                ? `${preview_detail.weight}`
                                                : ""}
                                              {preview_detail.weight_unit
                                                ? `${preview_detail.weight_unit}`
                                                : ""}
                                            </span>
                                          </Col>
                                        </Fragment>
                                        {this.renderSpecification(
                                          specification
                                        )}
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={1}></Col>
                                <Col span={5}>
                                  {similerListing &&
                                    similerListing.length !== 0 && (
                                      <SimilerListing
                                        listItem={similerListing}
                                      />
                                    )}
                                </Col>
                              </Row>
                            </div>
                          </TabPane>
                          <TabPane
                            tab="Product Reviews"
                            key="3"
                            ref={this.formRef}
                          >
                            <Row className="reviews-content">
                              <StaticReview />
                            </Row>
                          </TabPane>
                          <TabPane tab="Postage And Payments" key="4">
                            <div className="postage-payment-acc-container">
                              <Row>
                                <Col span="24">
                                  <Collapse
                                    activeKey={[activePanel]}
                                    onChange={(e) => {
                                      if (e[e.length - 1] == undefined) {
                                        this.setState({ activePanel: 1 });
                                      } else {
                                        this.setState({
                                          activePanel: e[e.length - 1],
                                        });
                                      }
                                    }}
                                  >
                                    <Panel header="Postage" key="1">
                                      <div className="postage-inner-view">
                                        <Row>
                                          <Col span={4}>
                                            <label>Item location:</label>
                                          </Col>
                                          <Col span={20}>
                                            <span className="value">
                                              {"Australia"}
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col span={4}>
                                            <label>Posting to:</label>
                                          </Col>
                                          <Col span={20}>
                                            <span className="value">
                                              {"Australia, India"}
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col span={4}>
                                            <label>Exclusions:</label>
                                          </Col>
                                          <Col span={20}>
                                            <span className="value">
                                              {"Itly, Spain"}
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col span="24">
                                            <div className="select-shipto">
                                              <label className="choose-country shipto">
                                                Ship to
                                              </label>
                                              <Select
                                                style={{ width: 150 }}
                                                placeholder="Select Country"
                                                allowClear
                                              >
                                                <Option value={"Australia"}>
                                                  {"Australia"}
                                                </Option>
                                                <Option value={"India"}>
                                                  {"India"}
                                                </Option>
                                              </Select>
                                            </div>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col span={24}>
                                            <table>
                                              <tr className="heading-bg-light-grey">
                                                <th>Postage and handling</th>
                                                <th width="200">Carrier</th>
                                                <th width="200">Tracking</th>
                                                <th>Delivery</th>
                                              </tr>
                                              <tr>
                                                <td>AU $7.98</td>
                                                <td>DHL</td>
                                                <td>Yes</td>
                                                <td>
                                                  <span className="bold">
                                                    Estimated between Wed. 3 Feb
                                                    - Thu. 11 Feb
                                                  </span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td>AU $20.00</td>
                                                <td>FedEx</td>
                                                <td>Yes</td>
                                                <td>
                                                  <span className="bold">
                                                    Estimated between Wed. 3 Feb
                                                    - Thu. 4 Feb
                                                  </span>
                                                </td>
                                              </tr>
                                            </table>
                                            <span className="custom-br"></span>
                                          </Col>
                                        </Row>

                                        <p
                                          style={{
                                            color: "#363B40",
                                            fontFamily: "Arial",
                                            fontSize: "12px",
                                          }}
                                        >
                                          * Estimated delivery dates- opens in a
                                          new window or tab include seller's
                                          handling time, origin postcode,
                                          destination postcode and time of
                                          acceptance and will depend on postage
                                          service selected and receipt of
                                          cleared payment. Delivery times may
                                          vary, especially during peak periods.
                                        </p>
                                        <p
                                          className="pt-2"
                                          style={{
                                            color: "#363B40",
                                            fontFamily: "Arial",
                                            fontSize: "12px",
                                          }}
                                        >
                                          For Delivery to Pickup station,
                                          postage options may vary.
                                        </p>
                                        <h3 className="heading-bg-light-grey mt-25">
                                          Domestic handling time
                                        </h3>
                                        <p className="notes">
                                          Will usually post within 3 business
                                          days of receiving cleared payment.
                                        </p>
                                      </div>
                                    </Panel>
                                    <Panel
                                      header="Return Policy"
                                      key="2"
                                      className="return-policy-container"
                                    >
                                      <p
                                        style={{
                                          color: "#363B40",
                                          fontFamily: "Arial",
                                        }}
                                      >
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Risus sed cursus
                                        bibendum aenean faucibus a, ullamcorper.
                                        Tristique facilisi volutpat id lobortis
                                        adipiscing id tellus nunc. Interdum
                                        tempus, semper sed dui sed eget nunc,
                                        amet. Eros sed neque molestie
                                        pellentesque eros, vitae. Tristique
                                        facilisi volutpat id lobortis adipiscing
                                        id tellus nunc. Interdum tempus, semper
                                        sed dui sed eget nunc, amet. Eros sed
                                        neque molestie pellentesque eros, vitae.
                                      </p>
                                      <span className="custom-br"></span>
                                      <p
                                        style={{
                                          color: "#363B40",
                                          fontFamily: "Arial",
                                        }}
                                      >
                                        Please follow our{" "}
                                        <a
                                          href={"Javasript:void(0)"}
                                          style={{
                                            color: "#CA71B7",
                                            textDecoration: "underline",
                                          }}
                                        >
                                          Return Policy
                                        </a>{" "}
                                        to receive a full refund.
                                      </p>
                                    </Panel>
                                    <Panel
                                      header="Accepted Payments"
                                      key="3"
                                      className="payment-method-container"
                                    >
                                      <h3 className="heading-bg-light-grey">
                                        Payment methods
                                      </h3>
                                      {this.renderPaymentMethods(false)}
                                      <p className="mt-0">
                                        <strong>Buy It Now, pay later.</strong>
                                      </p>
                                      <p>
                                        <strong>
                                          Afterpay allows you to pay for your
                                          eBay order over four interest-free
                                          payments.
                                        </strong>
                                        <span>
                                          If you don't already have an Afterpay
                                          account, you'll be prompted to create
                                          one when you select Afterpay at
                                          checkout. You'll see full details of
                                          your payment
                                          <br /> plan before completing your
                                          purchase.
                                        </span>
                                      </p>
                                      <p>
                                        Subject to purchase eligibility and
                                        Afterpay approval. Afterpay may apply
                                        interest or other fees if instalments
                                        are not paid on time. See{" "}
                                        <a
                                          href="https://www.afterpaytouch.com/"
                                          target="_blank"
                                          style={{
                                            color: "#CA71B7",
                                            textDecoration: "underline",
                                          }}
                                        >
                                          Afterpay terms
                                        </a>
                                      </p>
                                      <p>
                                        Learn more about{" "}
                                        <a
                                          href="https://www.afterpaytouch.com/"
                                          target="_blank"
                                          style={{
                                            color: "#CA71B7",
                                            textDecoration: "underline",
                                          }}
                                        >
                                          Afterpay
                                        </a>
                                      </p>
                                    </Panel>
                                  </Collapse>
                                </Col>
                              </Row>
                            </div>
                          </TabPane>
                          <TabPane tab="Seller Information" key="5">
                            <SellerInformation />
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Layout>
                </Layout>
              </Layout>
            </Layout>
          </React.Fragment>
        </div>
      </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, postAd, profile } = store;
  const { step1, attributes, step3, allImages, preview } = postAd;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    step1,
    attributes: attributes,
    specification: attributes.specification,
    inspectionPreview: attributes.inspectionPreview,
    step3,
    allImages,
    preview,
  };
};

export default connect(mapStateToProps, { retailAdManagementAPI })(Preview);
