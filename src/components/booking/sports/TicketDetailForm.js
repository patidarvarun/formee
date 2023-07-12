import React from "react";
import AppSidebar from "../NewSidebar";
import { CarouselSlider } from "../../common/CarouselSlider";
import { connect } from "react-redux";
import { langs } from "../../../config/localization";
import {
  Card,
  Cascader,
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
  Divider,
} from "antd";
import {
  getBannerById,
  getTournamentTicketList,
  enableLoading,
  disableLoading,
} from "../../../actions/index";
import { ShareAltOutlined } from "@ant-design/icons";
import history from "../../../common/History";
import "../booking.less";
import moment from "moment";
const { TextArea } = Input;
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
class TicketDetailForm extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    const { tournament } = props.location.state;
    this.state = {
      tournament: tournament,
      tickets:
        tournament.ticketdata &&
        tournament.ticketdata.ticketdataitem &&
        tournament.ticketdata.ticketdataitem.length
          ? tournament.ticketdata.ticketdataitem
          : [],
    };
  }
  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    let cat_id = this.props.match.params.id;
    this.getBannerData(53);
  }
  /**
   * @method getBannerData
   * @description get banner detail
   */
  getBannerData = (categoryId) => {
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

  renderTicketList = () => {
    const { tickets } = this.state;
    return (
      <Card className="ticketdetail-box">
        <Title level={4} className="seat-arrangement">
          {"We're out of tickets but we may get some!  If you're interested please let us know!"}
        </Title>
        <Form
          ref={this.formRef}
          name="location-form"
          className="location-search"
          layout={"inline"}
          onFinish={this.handleSearch}
        >
          <Row >
            <Col >
              <Form.Item label={"Full Name*"} name={"name"}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col >
              <Form.Item label={"Email Address*"} name={"email"}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col  className="phoneno">
              <Form.Item label={"Phone Number*"} name={"phonenumber"}>
                <Select value={"+61"}>
                  <Option value="+91">+91</Option>
                  <Option value="+61">+61</Option>
                </Select>
                <Form.Item name="mobile_no">
                  <Input
                    className="pl-10"
                    style={{ width: "calc(100% - 0px)" }}
                    // value={mobile_no}
                  />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col>
              <Form.Item label={"Country"} name={"country"}>
              <Cascader />
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col >
              <Form.Item label={"Add Message*"} name={"message"}>
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col>
              <Form.Item style={{textAlign:"center", marginTop:"45px", }}>
                  <Button htmlType='submit' size={"middle"} className={"ticket-largeyellow"}>
                    Send
                  </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };
  render() {
    const { topImages, tickets, tournament } = this.state;
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
              <div className="inner-banner well detail">
                <CarouselSlider bannerItem={topImages} pathName="/" />
                <Card className="ticket-detail-card" bordered={false}>
                  <Row gutter={0}>
                    <Col span={20}>
                      <Title level={2}>{tournament.tournament}</Title>
                    </Col>
                    <Col span={4} className="share-icon">
                      <ShareAltOutlined style={{ fontSize: "25px" }} />
                    </Col>
                  </Row>
                  <p className="ticket-card-date">{`${
                    tournament.date
                  }, ${moment(
                    new Date("1979-01-01 " + tournament.time_of_event)
                  ).format("LT")}`}</p>
                  <p className="ticket-card-venue">
                  <i style={{paddingRight: "5px"}}>
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 12.6C3.69857 12.6 1.42857 7.70632 1.42857 4.90002C1.42857 2.97012 3.03072 1.40002 5 1.40002C6.96929 1.40002 8.57143 2.97012 8.57143 4.90002C8.57143 7.70632 6.30143 12.6 5 12.6ZM5 0C2.23857 0 0 2.1938 0 4.9C0 7.6062 2.23857 14 5 14C7.76143 14 10 7.6062 10 4.9C10 2.1938 7.76143 0 5 0ZM4.99999 6.04453C4.60642 6.04453 4.28571 5.73093 4.28571 5.34453C4.28571 4.95883 4.60642 4.64453 4.99999 4.64453C5.39356 4.64453 5.71428 4.95883 5.71428 5.34453C5.71428 5.73093 5.39356 6.04453 4.99999 6.04453ZM5 3.24451C3.81643 3.24451 2.85715 4.18531 2.85715 5.34451C2.85715 6.50441 3.81643 7.44451 5 7.44451C6.18358 7.44451 7.14286 6.50441 7.14286 5.34451C7.14286 4.18531 6.18358 3.24451 5 3.24451Z" fill="#90A8BE"/>
                  </svg>
                  </i>
                    {`${tournament.venue}, ${tournament.city}, ${tournament.country}`}</p>
                </Card>
              </div>
              <Content className="ticket-detail-layout">
                <div className="wrap-inner  fm-gradient-bg sports-main ticketdetail">
                  <Row gutter={20}>
                    <Col span={14}>{this.renderTicketList()}</Col>
                    <Col span={10} >
                      <Card className="ticket-side-box" style={{padding:"20px 0", border:"none",}}>
                        <Title level={4} className="seat-arrangement">
                          {tournament.venue}
                        </Title>
                        <div>
                          <img src={tournament.venue_img} alt="" />
                        </div>
                      </Card>
                    </Col>
                  </Row>
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
  enableLoading,
  disableLoading,
})(TicketDetailForm);
