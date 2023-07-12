import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AppSidebar from "../NewSidebar";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../config/localization";
import {
  Pagination,
  DatePicker,
  Layout,
  message,
  Row,
  Col,
  List,
  Typography,
  Carousel,
  Tabs,
  Menu,
  Form,
  Input,
  Select,
  Button,
  Card,
  Breadcrumb,
  Table,
  Tag,
  Space,
  Modal,
  Divider,
  Steps,
  Progress,
  Dropdown,
} from "antd";
import Icon from "../../customIcons/customIcons";
import {
  getSportsDetailAPI,
  enableLoading,
  disableLoading,
  getBannerById,
  openLoginModel,
} from "../../../actions/index";
import history from "../../../common/History";
import { CarouselSlider } from "../../common/CarouselSlider";
import { TEMPLATE, DEFAULT_ICON } from "../../../config/Config";
import { DownOutlined } from "@ant-design/icons";
import "../restaurent/listing.less";
import { dateFormate } from "../../common";
import BookTicketModal from "./BookTicketModal";
import { SocialShare } from "../../common/social-share";
import { capitalizeFirstLetter } from "../../common";
import moment from "moment";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const { RangePicker } = DatePicker;

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

class SportsDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      visible: false,
      moreInfo: false,
      current: 0,
      tournamentList: [],
      basicDetail: "",
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    let parameter = this.props.match.params;
    let id = parameter.itemId,
      dateFrom = "",
      dateTo = "";
    const { location } = this.props;
    if (location.state !== undefined) {
      dateFrom = location.state.allData.datefrom;
      dateTo = location.state.allData.dateto;
    }
    let reqData = {
      tournament_id: id,
      from: dateFrom ? dateFrom : "01/10/2000",
      to: dateTo ? dateTo : "01/10/2021",
      page: 1,
    };
    this.getSportsDetail(reqData);
    this.getBannerData(id);
  }

  getSportsDetail = (reqData) => {
    this.props.getSportsDetailAPI(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let temp = res.data && res.data.data && res.data.data.all;

        let list =
          temp &&
          temp.data &&
          temp.data.item &&
          Array.isArray(temp.data.item) &&
          temp.data.item.length
            ? temp.data.item
            : [];
        this.setState({ tournamentList: list, basicDetail: temp.control });
      }
    });
  };

  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = (categoryId) => {
    let parameter = this.props.match.params;
    this.props.getBannerById(3, (res) => {
      if (res.status === 200) {
        const data =
          res.data.data && Array.isArray(res.data.data.banners)
            ? res.data.data.banners
            : "";
        const banner = data && data.filter((el) => el.moduleId === 3);
        const top =
          banner && banner.filter((el) => el.bannerPosition === langs.key.top);
        let temp = [],
          image;
        image =
          top.length !== 0 && top.filter((el) => el.categoryId == categoryId);
        this.setState({ topImages: image });
      }
    });
  };

  /**
   * @method contactModal
   * @description contact model
   */
  contactModal = () => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        visible: true,
      });
    } else {
      this.props.openLoginModel();
    }
  };
  moreInfoModal = () => {
    this.setState({
      moreInfo: true,
    });
  };
  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = (e) => {
    this.setState({
      visible: false,
      makeOffer: false,
      moreInfo: false,
    });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    let parameter = this.props.match.params;
    let id = parameter.itemId,
      dateFrom = "",
      dateTo = "";
    const { location } = this.props;
    if (location.state !== undefined) {
      dateFrom = location.state.allData.datefrom;
      dateTo = location.state.allData.dateto;
    }
    let reqData = {
      tournament_id: id,
      from: dateFrom ? dateFrom : "01/10/2000",
      to: dateTo ? dateTo : moment(new Date).format("DD/MM/YYYY"),
      page: e,
    };
    this.getSportsDetail(reqData);
  };

  showDateForCard = (basicDetail) => {
    if (basicDetail) {
      let tmp = basicDetail.datefrom.split("/");
      let tmp2 = basicDetail.dateto.split("/");
      let r = `${tmp[1]}/${tmp[0]}/${tmp[2]}`;
      let r2 = `${tmp2[1]}/${tmp2[0]}/${tmp2[2]}`;

      // basicDetail && basicDetail.datefrom
      r = dateFormate(r);
      r2 = dateFormate(r2);
      return `${r} - ${r2}`;
      //     : ""}{" "}
      // -{" "}
      // {basicDetail && basicDetail.dateto
      //     ? dateFormate(basicDetail.dateto)
      //     : ""
    } else {
      return "";
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      visible,
      moreInfo,
      current,
      tournamentList,
      basicDetail,
      currentPage,
      postPerPage,
    } = this.state;
    const { isLoggedIn } = this.props;
    const { topImages, bottomImages } = this.state;
    let cat_id = this.props.match.params.categoryId;
    const menu = <SocialShare {...this.props} />;
    const columns = [
      {
        title: "Event",
        dataIndex: "Event",
        key: "Event",
        render: (cell, row, index) => {
          return (
            <img
              src={row.image}
              alt="Home"
              width="30"
              className={"stroke-color"}
            />
          );
        },
      },
      {
        title: "",
        dataIndex: "caption",
        className:"caption",
        key: "caption",
        render: (cell, row, index) => {
          return (
            <div>
              {capitalizeFirstLetter(row.caption)} <br />{" "}
              {/* {`${row.home_team_caption} v ${row.away_team_caption} `} <br /> */}
              <Text className="inline-block text-yellow pt-28">
                {row.sport}
              </Text>
            </div>
          );
        },
      },
      {
        title: "Date",
        dataIndex: "date_of_event",
        className:"date",
        key: "date_of_event",
        render: (cell, row, index) => {
          return (
            <div>
              {moment(row.date_of_event).format("YYYY-MM-DD")} <br />
              {row.time_of_event}{" "}
            </div>
          );
        },
      },
      {
        title: "Location",
        dataIndex: "Location",
        key: "Location",
        render: (cell, row, index) => {
          return (
            <div>
              {row.venue},{row.city}, {row.country}
            </div>
          );
        },
      },
      {
        title: "Price",
        dataIndex: "Price",
        className:"price-full",
        key: "Price",
        render: (cell, row, index) => {
          let price = 0;
          row.ticketdata &&
            row.ticketdata.ticketdataitem.length > 0 &&
            row.ticketdata.ticketdataitem.map((item) => {
              if (price === 0) {
                price = +item.Price;
              } else if (price < +item.Price) {
                price = +item.Price;
              }
            });
          return <div>from <br/><span className="ticket-price"> AUD ${price}</span></div>;
        },
      },
      {
        title: "Get it!",
        key: "tags",
        className:"getit",
        dataIndex: "tags",
        render: (cell, row, index) => {
          console.log(
            "🚀 ~ file: SportsDetailsPage.js ~ line 223 ~ SportsDetailPage ~ render ~ row",
            row
          );
          return (
            <>
              {row.ticketdata &&
              row.ticketdata.ticketdataitem &&
              row.ticketdata.ticketdataitem.length > 0 ? (
                <Link
                  to={{
                    pathname: `/booking-ticket-detail/${53}`,
                    state: {
                      tournament: row,
                    },
                  }}
                >
                  <div
                    className="yellow-btn"
                    color={"volcano"}
                    // onClick={this.contactModal}
                  >
                    Tickets
                  </div>
                </Link>
              ) : (
                "No Tickets Available"
              )}
            </>
          );
        },
      },
    ];

    const menudropdown = (
      <Menu>
        <Menu.Item key="0">
          <a href="">1st menu item</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="#">2nd menu item</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">3rd menu item</Menu.Item>
      </Menu>
    );
    return (
      <div className="App">
        <Layout className="common-sub-category-landing booking-sub-category-landing">
          <Layout className="yellow-theme common-left-right-padd">
            <AppSidebar
              history={history}
              activeCategoryId={cat_id}
              moddule={1}
              showDropdown={false}
            />
            <Layout className="right-parent-block">
              <Row gutter={[40, 40]}> 
                <Col>
                  <div className="sub-header fm-details-header">
                    <Link>{"Sport Tickets"}</Link>
                    {/* <Link className='fm-selected'>{'Football'}</Link> */}
                  </div>
                  <div className="inner-banner fm-details-banner">
                    <img
                      src={require("../../../assets/images/bookin-detail-banner.jpg")}
                      alt=""
                    />
                  </div>
                  <div className="fm-card-box">
                    <Row>
                      <Col span="20">
                        <h3>
                          {basicDetail && basicDetail.title
                            ? basicDetail.title
                            : ""}
                        </h3>
                      </Col>
                      <Col span="4">
                        <ul className="fm-panel-action">
                          <li>
                            <Icon icon="wishlist" size="18" />
                          </li>
                          <li>
                            <Dropdown overlay={menu} trigger={["click"]}>
                              <div
                                className="ant-dropdown-link"
                                onClick={(e) => e.preventDefault()}
                              >
                                <Icon icon="share" size="18" />
                              </div>
                            </Dropdown>
                          </li>
                        </ul>
                      </Col>
                      <Col span="20" className="mb-10">
                        {console.log(
                          "🚀 ~ file: SportsDetailsPage.js ~ line 270 ~ SportsDetailPage ~ render ~ basicDetail",
                          basicDetail
                        )}
                        <h4>{this.showDateForCard(basicDetail)}</h4>
                      </Col>
                      <Col span="4">
                        <ul className="fm-panel-action">
                          <li>
                            <a
                              href="javascript:void(0)"
                              onClick={this.moreInfoModal}
                            >
                              More info
                            </a>
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Content className="site-layout">
                <div className="sports-wrap-inner">
                  <Row gutter={[40, 40]}>
                    <Col span="24">
                      <Row gutter={[8, 8]} className="mb-20 sport-detail">
                        <Col md={8}>
                          <Dropdown
                            overlay={menudropdown}
                            trigger={["click"]}
                            className="boxwhite-shadow"
                          >
                            <a
                              className="ant-dropdown-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              <p className="grey-color mb-0">
                                Round: <strong>All</strong>{" "}
                              </p>{" "}
                              <DownOutlined />
                            </a>
                          </Dropdown>
                        </Col>
                        <Col md={8}>
                          <Dropdown
                            overlay={menudropdown}
                            trigger={["click"]}
                            className="boxwhite-shadow"
                          >
                            <a
                              className="ant-dropdown-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              <p className="grey-color mb-0">
                                Venue: <strong>All</strong>{" "}
                              </p>{" "}
                              <DownOutlined />
                            </a>
                          </Dropdown>
                        </Col>
                        <Col md={8}>
                          <Dropdown
                            overlay={menudropdown}
                            trigger={["click"]}
                            className="boxwhite-shadow"
                          >
                            <a
                              className="ant-dropdown-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              <p className="grey-color mb-0">
                                Team: <strong>All</strong>{" "}
                              </p>{" "}
                              <DownOutlined />
                            </a>
                          </Dropdown>
                        </Col>
                      </Row>
                      <Table
                        className="detail-maintable"
                        columns={columns}
                        dataSource={tournamentList}
                      />
                      {basicDetail && basicDetail.totalrecords > 10 && (
                        <Pagination
                          defaultCurrent={1}
                          defaultPageSize={10} //default size of page
                          onChange={this.handlePageChange}
                          total={basicDetail && basicDetail.totalrecords} //total number of card data available
                          itemRender={itemRender}
                          className={"mt-20"}
                          showSizeChanger={false}
                        />
                      )}
                    </Col>
                  </Row>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
        {visible && (
          <BookTicketModal visible={visible} onCancel={this.handleCancel} />
        )}
        <Modal
          title={"2020 Toyota AFL Premiership Season"}
          visible={moreInfo}
          className={"custom-modal sports-more-info-modal"}
          footer={false}
          onCancel={this.handleCancel}
        >
          <div className="content-block">
            <Paragraph strong>A-League 2020/21 Season is here</Paragraph>
            <Paragraph>
              The fixtures for the A-League 2020/21 Season have been released
              and Glory Members and fans certainly have plenty to look forward
              to, including back-to-back home games in the opening two rounds of
              the new campaign and a run of four consecutive fixtures at HBF
              Park in May. And there is further good news for those of a purple
              persuasion, with all of our summer games having evening kick-off
              times, ensuring that spectator comfort is not compromised by the
              heat.
            </Paragraph>
            <Title level={4}>Fees & Charges:</Title>
            <Paragraph>
              A Handling Fee from $6.25 per transaction applies.
              <br />
              In addition a delivery fee may apply depending on the mode of
              delivery selected.
            </Paragraph>
            <Title level={4}>Event Info</Title>
            <Paragraph>
              IMPORTANT DELIVERY INFORMATION:
              <br />
              This is a digital only event. All tickets are Mobile Ticket Only.
              Tickets can only be purchased via the Ticketmaster website or
              Ticketmaster App*
              <br />
              *Accessible ticket options excluded and are still available via
              Accessible Seating Line.
            </Paragraph>
            <Paragraph>
              Mobile delivery is the easiest and safest way to access tickets to
              your events. When you select Mobile delivery at checkout - your
              mobile phone is your ticket! You can access your tickets inside
              either the Ticketmaster or Brisbane Lions app, or via
              ticketmaster.com.au. Your tickets will not be available for print
              or emailed to you.
            </Paragraph>
            <Title level={4}>COVID-19 Update</Title>
            <Paragraph>
              THE GABBA IS OPERATING UNDER AN APPROVED VENUE-SPECIFIC COVID SAFE
              PLAN FROM QUEENSLAND HEALTH. <br />
              There are changes to the event experience that you need to be
              aware of, whether you are new to The Gabba or a regular visitor.
            </Paragraph>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, {
  getSportsDetailAPI,
  enableLoading,
  disableLoading,
  getBannerById,
  openLoginModel,
})(SportsDetailPage);
