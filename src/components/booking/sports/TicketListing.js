import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Icon from "../../customIcons/customIcons";
import { langs } from "../../../config/localization";
import {
  Card,
  Layout,
  Row,
  Col,
  Typography,
  Carousel,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Pagination,
} from "antd";
import { FlagFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import NoContentFound from "../../common/NoContentFound";
import AppSidebar from "../NewSidebar";
import { CarouselSlider } from "../../common/CarouselSlider";
import SportsSearch from "../common/search-bar/SportsSearch";
import {
  getBannerById,
  getTournamentTicketList,
  enableLoading,
  disableLoading,
} from "../../../actions/index";
import history from "../../../common/History";
import "../booking.less";
import moment from "moment";
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class TicketListing extends React.Component {
  constructor(props) {
    super(props);
    const { tournamentId } = props.location.state;
    let input = new Date();
    let startOfMonth = new Date(input.getFullYear(), input.getMonth(), 1);
    let endOfMonth = new Date(input.getFullYear(), input.getMonth() + 1, 0);
    let firstweek = new Date(moment(input).subtract(+input.getDay(), "days"));
    let lastweek = new Date(moment(firstweek).add(6, "days"))
    this.state = {
      topImages: [],
      ticketList: [],
      page: 1,
      totalrecords: 0,
      tournamentId: tournamentId,
      startOfMonth,
      endOfMonth,
      firstweek,
      lastweek,
      startDate: startOfMonth,
      endDate: endOfMonth,
      defaultsort: "month",
    };
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    let cat_id = this.props.match.params.id;
    this.props.enableLoading()
    this.getTournamentTickets();
    this.getBannerData(cat_id);
  }

  // /**
  //  * @method componentDidMount
  //  * @description called before mounting the component
  //  */
  // componentDidMount() {
  //   let cat_id = this.props.match.params.id;
  //   this.props.enableLoading()
  //   this.getTournamentTickets();
  // }

  getTournamentTickets = () => {
    let reqData = {
      tournament_id: this.state.tournamentId,
      from: moment(this.state.startDate).format("DD/MM/YYYY"),
      to: moment(this.state.endDate).format("DD/MM/YYYY"),
      page: this.state.page,
    };
    this.props.getTournamentTicketList(reqData, (res) => {
      if (res.status === 200) {
        let data =
          res.data &&
          res.data.data &&
          res.data.data.all &&
          res.data.data.all.data &&
          res.data.data.all.data.item;
        let control =
          res.data &&
          res.data.data &&
          res.data.data.all &&
          res.data.data.all.control;
        this.setState({
          ticketList: data,
          page: control.page,
          totalrecords: control.totalrecords,
        });
      }
    });
  };

  /**
   * @method componentWillReceiveProps
   * @description receive props from components
   */
  componentWillReceiveProps(nextprops, prevProps) {
    let catIdInitial = this.props.match.params.id;
    let catIdNext = nextprops.match.params.id;
    if (catIdInitial !== catIdNext) {
      this.props.enableLoading();
      this.getTournamentTickets();
      this.getBannerData(catIdNext);
    }
  }

  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = (categoryId) => {
    categoryId = 53
    this.props.getBannerById(3, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        const data =
          res.data.data && Array.isArray(res.data.data.banners)
            ? res.data.data.banners
            : "";
        const banner = data && data.filter((el) => el.moduleId === 3);
        const top =
          banner && banner.filter((el) => el.bannerPosition === langs.key.top);
        let image =
          top.length !== 0 &&
          top.filter(
            (el) => el.categoryId == categoryId && el.subcategoryId === ""
          );
        this.setState({ topImages: image });
      }
    });
  };

  onHandleChange = (e) => {
  if(e === "month"){
    this.setState({
      startDate: this.state.startOfMonth,
      endDate: this.state.endOfMonth,
    }, () => 
    this.getTournamentTickets()
    )
  }else if(e == "week"){
    this.setState({
      startDate: this.state.firstweek,
      endDate: this.state.lastweek,
    }, () => 
    this.getTournamentTickets()
    )
  }
  };

  onChangePage = (e) => {
    this.setState({page: e}, () => {
      this.getTournamentTickets()
    })
  };

  itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return (
        <a>
          <LeftOutlined /> Back
        </a>
      );
    }
    if (type === "next") {
      return (
        <a>
          Next <RightOutlined />
        </a>
      );
    }
    return originalElement;
  };

  /**
   * @method renderTicketListing
   * @description render popular sports events
   */
  renderTicketListing = (ticketList) => {
    return (
      <Col span={24}>
        <Row gutter={0} className={"ticket-list-header"}>
          <Col span={11}>Event</Col>
          <Col span={3}>Date</Col>
          <Col span={4}>Location</Col>
          <Col span={3}>Price</Col>
          <Col span={3}>Get it!</Col>
        </Row>
        <div className="ticket-list-middle">
        {ticketList &&
          ticketList.map((el, i) => {
            let currency =
              el.ticketdata &&
              el.ticketdata.ticketdataitem &&
              el.ticketdata.ticketdataitem.length > 0  && 
              el.ticketdata.ticketdataitem[0].Currency ? el.ticketdata.ticketdataitem[0].Currency : 'AUD';
            let price = 0;
            let nonPlastic = 0
            let immideateConf = 0
            el.ticketdata && el.ticketdata.ticketdataitem.length > 0 &&
              el.ticketdata.ticketdataitem.map((item) => {
                if(+item.Tags.non_plastic == 1){
                  nonPlastic = 1
                }
                if(+el.immediate_confirmation == 1){
                  immideateConf = 1
                }
                if (price === 0) {
                  price = +item.Price;
                } else if (price < +item.Price) {
                  price = +item.Price;
                }
              });
            return (
              <Row gutter={0}>
                <Col span={11} className={"ticket-list-body"}>
                  <Row gutter={0}>
                    <Col span={10}>
                      <img src={el.image} alt="" width="200" height="140" />
                    </Col>
                    <Col span={14}>
                      <div className={"ticket-list-text"}>{el.caption}</div>
                      <div className={"ticket-list-text"}>{el.tournament}</div>
                      <div className={"ticket-sport"}>{el.sport}</div>
                      <div>
                        {nonPlastic == 1 && (<Button size={"small"} className={"ticket-smallyellow"}>
                          Non plastic
                        </Button>)}
                        {immideateConf == 1 && (<Button size={"small"} className={"ticket-smallgreen"}>
                          Immediate Confirmation{" "}
                        </Button>)}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={3} className={"ticket-list-body"}>
                  <div className={"ticket-list-text"}>{el.date}</div>
                  <div className={"ticket-list-text"}>
                    {moment(new Date("1979-01-01 " + el.time_of_event)).format(
                      "LT"
                    )}
                  </div>
                  <div>
                    {el.final_date == 0 && (<Button className={"ticket-smallpink"}>
                      <FlagFilled /> Not Final
                    </Button>)}
                  </div>
                </Col>
                <Col span={4} className={"ticket-list-body"}>
                  <div className={"ticket-list-text"}>{el.venue},</div>
                  <div
                    className={"ticket-list-text"}
                  >{`${el.city}, ${el.country}`}</div>
                </Col>
                <Col span={3} className={"ticket-list-body"}>
                  <div className={"ticket-list-text"}>from</div>
                  <div
                    className={"ticket-price"}
                  >{`${currency} $${price}`}</div>
                </Col>
                <Col span={3} className={"ticket-list-body"}>
                  <div>
                      {(el.ticketdata &&
                        el.ticketdata.ticketdataitem &&
                        el.ticketdata.ticketdataitem.length > 0)
                        ?
                        (<Button size="large" className={"ticket-largeyellow"}>
                            <Link to={{pathname: `/booking-ticket-detail/${53}`,
                            state: {
                              tournament: el
                            }
                          }}>
                            Tickets
                          </Link>
                        </Button>) :
                        ("No Tickets Available")
                      }
                  </div>
                </Col>
              </Row>
            );
          })}
          </div>
      </Col>
    );
  };

  render() {
    const { topImages, ticketList, defaultsort } = this.state;
    return (
      <div className="App">
        <Layout className="common-sub-category-landing booking-sub-category-landing">
          <Layout className="yellow-theme common-left-right-padd">
            <AppSidebar history={history} showDropdown={false} />
            <Layout className="right-parent-block">
              <div className="sub-header fm-details-header">
                <Title level={4} className="title">
                  {"SPORT TICKETS"}
                </Title>
              </div>
              <div className="inner-banner well">
                <CarouselSlider bannerItem={topImages} pathName="/" />
              </div>
              <Tabs
                type="card"
                className={
                  "tab-style1 job-search-tab bookings-categories-serach"
                }
              >
                <TabPane tab="Search" key="1">
                  <SportsSearch
                    handleSearchResponce={this.handleSearchResponce}
                  />
                </TabPane>
              </Tabs>
              <Content className="site-layout">
                <div className="wrap-inner  fm-gradient-bg sports-main">
                  <Card
                    title={`Event tickets in ${ticketList.length ? ticketList[0].city : ""}`}
                    bordered={false}
                    className={"home-product-list"}
                    extra={
                      <div className="card-header-select">
                        <label>Sort:</label>
                        <Select
                          onChange={(e) => {
                            this.onHandleChange(e);
                          }}
                          defaultValue={defaultsort}
                          dropdownMatchSelectWidth={false}
                        >
                          <Option value="month">This Month</Option>
                          <Option value="week">This Week</Option>
                        </Select>
                      </div>
                    }
                  >
                    <Row gutter={[16, 16]}>
                      {this.renderTicketListing(ticketList)}
                    </Row>
                    {this.state.totalrecords ? <Pagination
                      defaultCurrent={this.state.page}
                      onChange={(e) => this.onChangePage(e)}
                      itemRender={this.itemRender}
                      total={this.state.totalrecords || 0}
                      showSizeChanger={false}
                    /> : null}
                  </Card>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth, bookings } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, {
  getBannerById,
  getTournamentTicketList,
  enableLoading,
  disableLoading,
})(TicketListing);
