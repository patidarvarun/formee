import React from 'react'
import { connect } from "react-redux";
import AppSidebar from "../NewSidebar";
import { Link } from "react-router-dom";
import { langs } from "../../../config/localization";
import {
  getBannerById,
  enableLoading,
  disableLoading,
  getSportsCountryList
} from "../../../actions/index";
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
  Divider,
  Steps,
  Cascader,
  Radio,
  Modal
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import { CheckCircleFilled } from '@ant-design/icons';
import history from "../../../common/History";
import "../booking.less";
import moment from "moment";
import CustomInformation from './CustomInformation';
import Pay from './Pay';
const { Step } = Steps;
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

class TicketBooking extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    const { ticketData, tournament } = props.location.state;
    this.state = {
      ticketData,
      tournament,
      current: 0,
      qty: 1,
      location: [],
      atendeeCountry: [],
      customerDetails: null,
      purchaseDetails: null,
      isModalVisible: false,
      booking_id: "",
    };
  }

componentDidMount = () =>  {
    this.props.getSportsCountryList(res => {
    if(res.status === 200){
        let item = res.data && res.data.data.all && res.data.data.all.data ? res.data.data.all.data.item : ''
        let data = item  && Array.isArray(item) ? item : []
        if(data.length){
          let temp = []
          let temp2 = [];
          data && data.length !== 0 && data.map((el, i) => {
            if(!["USA", "Canada"].includes(el.caption))
              {
                temp.push({value: el.caption, label: el.caption})
                temp2.push({value: el.id, label: el.caption})
              }
          })
          this.setState({location: temp, atendeeCountry: temp2})
        }
    }
})
}

  next = () => {
    let { current } = this.state
    this.setState({current: current + 1});
  };

  prev = () => {
    this.setState({current: 0});
  };

  qtyOnChange = (value) => {
    this.setState({
      qty: value,
    });
  };
  
  updateResponse = (cd, pd) => {
    this.setState({
      customerDetails: cd,
      purchaseDetails: pd,
      current: 1
    })
  }

  render(){
    const { current, ticketData, tournament, qty, location, customerDetails, purchaseDetails, atendeeCountry, isModalVisible, booking_id } = this.state
    const steps = [
      {
        title: 'Customer Information',
        content: (<div>First</div>), // CODE FOR CUSTOMER INFORMATION
      },
      {
        title: 'Pay',
        content: (<div>Second</div>), // CODE FOR PAY PAGE
      },
    ];
    return (
      <div className="App">
        <Layout className="common-sub-category-landing booking-sub-category-landing">
          <Layout className="yellow-theme common-left-right-padd sport-booking-main">
            <AppSidebar history={history} showDropdown={false} />
            <div className=" fm-details-header sport-back">
                <span className="sports-ticket-back">
                   <img src={require('./icon/CaretUp.png')} alt='arrow' />{"SPORT TICKETS"}
                </span>
              </div>
     
            <Layout className="right-parent-block">
              
              <div><Steps current={current}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className="safe-secure">
                 <LockOutlined />
                <span style={{ marginLeft: "10px" }}>
                  Safe and secure checkout
                </span>
              </div>
              </div>
              
              <div className="steps-content sportbooking-content ">
                {
                  steps[current].title === 'Customer Information' ? 
                  <CustomInformation 
                    next={this.next}
                    tournament={tournament}
                    ticketData={ticketData}
                    qty={qty}
                    location={location}
                    atendeeCountry={atendeeCountry}
                    qtyOnChange={this.qtyOnChange}
                    updateResponse={this.updateResponse}
                  /> : (steps[current].title === 'Pay' ?
                  <Pay
                    next={this.next}
                    tournament={tournament}
                    ticketData={ticketData}
                    customerDetails={customerDetails}
                    purchaseDetails={purchaseDetails}
                    qty={qty}
                    location={location}
                    openPopUp={(booking_id) => this.setState({
                      isModalVisible: true,
                      booking_id: booking_id
                    })}
                  /> : steps[current].content)
                }
              </div>
             
              {/* <div className="steps-action">
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={() => this.next()}>
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button type="primary">
                    Done
                  </Button>
                )}
                {current > 0 && (
                  <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                    Previous
                  </Button>
                )}
              </div> */}
            </Layout>
            ----
          </Layout>
        </Layout>
        <Modal 
          title="Tickets Purchased!" 
          visible={isModalVisible}
          closable={false}
          maskClosable={false}
          footer={null}
          className="ticketspurchased"
        >
        <p><CheckCircleFilled />Your Reservation is Confirmed</p>
        <p>Your booking ID is {`${booking_id}`} . Please use this booking ID for any communication with us.<br/>
We will email to you shortly.</p>
        <p className="greybg">Your payment of $248.00 was processed on 05/12/2019. 
Here is a link to Receipt #8458.pdf for your records</p>
          <div className="align-center payment-button"><Button className="ant-btn-default yellow-with-border"  onClick={() => this.setState({
            isModalVisible: false
          })}>
             <Link to="/bookings-sports-tickets/53" >
              Continue Browsing
              </Link>
          </Button>
          <Button className="ant-btn-default yellow-bg"   onClick={() => this.setState({
            isModalVisible: false
          })}>
            <Link to="/dashboard" >
              View My Bookings
            </Link>
          </Button></div>
      </Modal>
      </div>
    )
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
  getSportsCountryList,
})(TicketBooking);
