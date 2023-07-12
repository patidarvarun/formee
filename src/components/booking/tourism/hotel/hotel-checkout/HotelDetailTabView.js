import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
import {
    Layout,
    Row,
    Col,
    Typography,
    Collapse,
    Button,
    Input,
    Select,
    Rate,
    Tabs,
    DatePicker,
    Divider,
} from "antd";
import "@ant-design/icons";
import HotelReview from '../hotel-review/HotelReview'
import { openLoginModel, enableLoading, disableLoading } from '../../../../../actions'
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/multi-city-flight.less";
const { TextArea } = Input;
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { TabPane } = Tabs;
const dateFormat = "YYYY/MM/DD";

class HotelDetailTabView extends React.Component {
    myDivToFocus = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1'
        };
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let tab = nextprops.priorityTab
        if (tab === '1') {
            this.setState({ activeTab: '1' })
        } else if (tab === '2') {
            this.setState({ activeTab: '2' })
        }else if (tab === '3') {
            this.setState({ activeTab: '3' })
        } else if (tab === '4') {
            this.setState({ activeTab: '4' })
        }else if (tab === '5') {
            this.setState({ activeTab: '5' })
        }else if (tab === '6') {
            this.setState({ activeTab: '6' })
        }
    }

    /**
     * @method activeTab
     * @description handle active tab
     */
    activeTab = (key) => {
        this.setState({ activeTab: key });
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
    * @method renderRoomList
    * @description room list
    */
    renderRoomList = (roomList) => {
        if (roomList && Array.isArray(roomList) && roomList.length) {
            return roomList.map((el, i) => {
                return (
                    <div className="room-information-container">
                        <Row>
                            <Col md={10} className="room-information-left">
                                <Row>
                                    <Col md={17}>
                                        <div className="img-div">
                                            <img
                                                src={require("../../../../../assets/images/hotel_room.svg")}
                                                alt="hotel-room"
                                            />
                                        </div>
                                    </Col>
                                    <Col md={7}>
                                        <Title level={3} className="room-title">
                                            Deluxe Room (Executive)
                                        </Title>
                                        <div className="img-span-block">
                                            <span className="img-span">
                                                <img
                                                    src={require("../../../../../assets/images/icons/profile_round.svg")}
                                                    alt="profile-round"
                                                />
                                                <img
                                                    src={require("../../../../../assets/images/icons/profile_round.svg")}
                                                    alt="profile-round"
                                                />
                                            </span>
                                            Sleeps 2
                                        </div>

                                        <p>
                                            <Link to="#">More details</Link>
                                        </p>
                                    </Col>
                                </Row>
                            </Col>

                            <Col
                                md={11}
                                offset={3}
                                className="room-information-right"
                            >
                                <Row>
                                    <Col md={18}>
                                        <p>
                                            <strong>Option 1</strong>
                                        </p>
                                        <p className="highlight">Free Cancellation</p>
                                        <p className="small-text">Before Fri, 19 Feb</p>
                                    </Col>
                                    <Col md={6} className="right-section1">
                                        <Title level={3} className="price">
                                            AU$75
                                        </Title>
                                        <p className="small-text">Per night</p>
                                        <p className="highlight2">We have 5 left</p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={18} className="second-row">
                                        <div className="facility-list">
                                            <div className="img-div">
                                                <img
                                                    src={require("../../../../../assets/images/icons/check-grey.svg")}
                                                    alt=""
                                                />
                                            </div>
                                            <p>Reserve now, pay later</p>
                                        </div>

                                        <div className="facility-list">
                                            <div className="img-div">
                                                <img
                                                    src={require("../../../../../assets/images/icons/wifi.svg")}
                                                    alt=""
                                                />
                                            </div>
                                            <p>Free WiFi</p>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="right-section2">
                                            <Button
                                                className="reserve-btn"
                                                onClick={this.showRoomReservationModal}
                                            >
                                                Reserve
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>

                                <Divider />

                                <Row>
                                    <Col md={18}>
                                        <p>
                                            <strong>Option 2</strong>
                                        </p>
                                        <p className="highlight">Free Cancellation</p>
                                        <p className="small-text">Before Fri, 19 Feb</p>
                                    </Col>
                                    <Col md={6} className="right-section1">
                                        <Title level={3} className="price">
                                            AU$75
                                        </Title>
                                        <p className="small-text right">Per night</p>
                                        <p className="highlight2">We have 5 left</p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={18}>
                                        <div className="facility-list">
                                            <div className="img-div">
                                                <img
                                                    src={require("../../../../../assets/images/icons/check-grey.svg")}
                                                    alt=""
                                                />
                                            </div>
                                            <p>Reserve now, pay later</p>
                                        </div>

                                        <div className="facility-list">
                                            <div className="img-div">
                                                <img
                                                    src={require("../../../../../assets/images/icons/wifi.svg")}
                                                    alt=""
                                                />
                                            </div>
                                            <p>Free WiFi</p>
                                        </div>

                                        <div className="facility-list">
                                            <div className="img-div">
                                                <img
                                                    src={require("../../../../../assets/images/icons/coffee.svg")}
                                                    alt=""
                                                />
                                            </div>
                                            <p>Breakfast for 2</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="right-section2">
                                            <Button
                                                className="reserve-btn"
                                                onClick={this.showRoomReservationModal}
                                            >
                                                Reserve
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                )
            })
        }
    }

    /**
     * @method renderRoomInformation
     * @description render room information
     */
    renderRoomInformation = (info) => {
        return (
            <TabPane tab="Rooms" key="1" className="hotel-rooms-tab">
                <Title className="choose-room-title">
                    Choose your room
                </Title>
                <Row gutter={20} className="mb-25">
                    <Col lg={10}>
                        <div className="date-col">
                            <DatePicker
                                format={dateFormat}
                                className="date-formate1"
                            />
                            <DatePicker
                                format={dateFormat}
                                className="date-formate2"
                            />
                        </div>
                    </Col>
                    <Col lg={10}>
                        <div className="person-col">
                            <Input
                                size="large"
                                className="adult-box"
                                placeholder="adult"
                            />
                            <Input
                                size="large"
                                className="child-box"
                                placeholder="children"
                            />
                            <Select
                                defaultValue="1 room"
                                allowClear
                                className="room-box"
                            >
                                <Option value="1room">1 room</Option>
                                <Option value="1rooms">2 rooms</Option>
                            </Select>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <Button className="check-avail">
                            Check Availability
                        </Button>
                    </Col>
                </Row>
                {info && this.renderRoomList(info.rooms)}
            </TabPane>
        )
    }

    renderOverView = () => {
        return (
            <TabPane tab="Overview" key="2">
                <div className="information-container">
                    <Row>
                        <Col md={4} className="information-left">
                            <Title className="left-title">Overview</Title>
                            <Title className="rating">4.0</Title>
                            <p className="rating-text">Excellent</p>
                            <Rate className="rate" />
                            <p className="small-text">From 7309 reviews</p>
                        </Col>
                        <Col md={15} offset={2} className="pl-15">
                            <div className="right-img">
                                <img
                                    src={require("../../../../../assets/images/poolside.svg")}
                                    alt="poolside"
                                />
                            </div>

                            <p>
                                <strong>Great Southern Hotel Melbourne</strong>
                            </p>

                            <Paragraph className="msg-hotel-overview">
                                Lorem ipsum dolor sit amet, consectetur adipiscing
                                elit. Sit quam eu malesuada ac velit. Sit cursus
                                adipiscing in interdum tortor facilisi facilisis
                                bibendum semper. Venenatis fermentum est dignissim
                                libero. Elit mattis non, quam in ut mi quis. Lorem
                                ipsum dolor sit amet, consectetur adipiscing elit.
                                Sit quam eu malesuada ac velit. Sit cursus
                                adipiscing in interdum tortor facilisi facilisis
                                bibendum semper. Venenatis fermentum est dignissim
                                libero. Elit mattis non, quam in ut mi quis.
                            </Paragraph>

                            <Paragraph className="msg-hotel-overview">
                                Lorem ipsum dolor sit amet, consectetur adipiscing
                                elit. Sit quam eu malesuada ac velit. Sit cursus
                                adipiscing in interdum tortor facilisi facilisis
                                bibendum semper. Venenatis fermentum est dignissim
                                libero. Elit mattis non, quam in ut mi quis. dolor
                                sit amet, consectetur adipiscing elit. Sit quam eu
                                malesuada ac velit. Sit cursus adipiscing in
                                interdum tortor facilisi facilisis bibendum semper.
                            </Paragraph>
                        </Col>
                    </Row>
                </div>
            </TabPane>
        )
    }

    renderLocation = () => {
        return (
            <TabPane tab="Location" key="3">
                <div className="information-container">
                    <Row>
                        <Col md={4} className="information-left">
                            <Title className="left-title">Location</Title>
                        </Col>

                        <Col md={15} offset={3}>
                            <Row>
                                <Col>
                                    <div className="right-img">
                                        <img
                                            src={require("../../../../../assets/images/location.svg")}
                                            alt="location"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row gutter={48}>
                                <Col md={12}>
                                    <div className="list-section">
                                        <div className="img-div">
                                            <img
                                                src={require("../../../../../assets/images/icons/location-pin.svg")}
                                                alt="location-pin"
                                            />
                                        </div>
                                        <div>
                                            <p className="list-heading">What's nearby?</p>
                                            <p>Melbourne Central - 3 min walk</p>
                                            <p>State Library of Victoria - 6 min walk</p>
                                            <p>Bourke Street Mall - 8 min walk</p>
                                            <p>Queen Victoria Market - 9 min walk</p>
                                            <p>Old Melbourne Gaol - 11 min walk</p>
                                            <p>Melbourne Central Station - 4 min walk</p>
                                            <p>Spencer Street Station - 14 min walk</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="list-section">
                                        <div className="img-div">
                                            <img
                                                src={require("../../../../../assets/images/icons/taxi.svg")}
                                                alt="taxi"
                                            />
                                        </div>
                                        <div>
                                            <p className="list-heading">Getting around</p>
                                            <p>Melbourne Central Station - 4 min walk</p>
                                            <p>Spencer Street Station - 14 min walk</p>
                                            <p>
                                                Melbourne, VIC (MEL-Tullamarine) - 27 min
                                                drive
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </TabPane>
        )
    }

    renderAmenities = () => {
        return (
            <TabPane tab="Amenities" key="4">
            <div className="information-container room-amenities">
                <Row>
                    <Col md={4} className="information-left">
                        <Title className="left-title">Room amenities</Title>
                    </Col>
                    <Col md={15} offset={3}>
                        <Row gutter={48}>
                            <Col md={12}>
                                <div className="list-section">
                                    <div className="img-div">
                                        <img
                                            src={require("../../../../../assets/images/icons/wifi-grey.svg")}
                                            alt="wifi"
                                        />
                                    </div>
                                    <div>
                                        <p className="list-heading">Internet</p>
                                        <p>Available in all rooms: Free WiFi</p>
                                        <p>
                                            Available in some public areas: Free WiFi
                                        </p>
                                    </div>
                                </div>

                                <div className="list-section">
                                    <div className="img-div">
                                        <img
                                            src={require("../../../../../assets/images/icons/restaurant.svg")}
                                            alt="restaurant"
                                        />
                                    </div>

                                    <div>
                                        <p className="list-heading pt-20">
                                            Food and drink
                                        </p>
                                        <p>
                                            Continental breakfast available for a fee
                                            daily 6:30 AM–10:30 AM: AUD 36.00 for adults
                                            and AUD 36 for children
                                        </p>
                                        <p>1 restaurant and 1 coffee shop/cafe</p>
                                        <p>1 bar</p>
                                        <p>24-hour room service</p>
                                    </div>
                                </div>
                            </Col>

                            <Col md={12}>
                                <div className="list-section">
                                    <div className="img-div">
                                        <img
                                            src={require("../../../../../assets/images/icons/p-circle-grey.svg")}
                                            alt="p-circle-grey"
                                        />
                                    </div>

                                    <div>
                                        <p className="list-heading">
                                            Parking and public transport
                                        </p>
                                        <p>Valet parking on site (AUD 50 per day)</p>
                                        <p>
                                            On-site parking is wheelchair accessible
                                        </p>
                                        <p>Return airport shuttle (surcharge)</p>
                                    </div>
                                </div>

                                <div className="list-section">
                                    <div className="img-div">
                                        <img
                                            src={require("../../../../../assets/images/icons/suitcase.svg")}
                                            alt="suitcase"
                                        />
                                    </div>

                                    <div>
                                        <p className="list-heading pt-20">
                                            Business services
                                        </p>
                                        <p>Valet parking on site (AUD 50 per day)</p>
                                        <p>
                                            On-site parking is wheelchair accessible
                                        </p>
                                        <p>Return airport shuttle (surcharge)</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <div className="information-container">
                <Row>
                    <Col md={4} className="information-left">
                        <Title className="left-title">
                            Property amenities
                        </Title>
                    </Col>
                    <Col md={15} offset={3}>
                        <Row gutter={48}>
                            <Col md={12}>
                                <div className="list-section">
                                    <div className="img-div">
                                        <img
                                            src={require("../../../../../assets/images/icons/wifi-grey.svg")}
                                            alt="wifi"
                                        />
                                    </div>
                                    <div>
                                        <p className="list-heading">Internet</p>
                                        <p>Available in all rooms: Free WiFi</p>
                                        <p>
                                            Available in some public areas: Free WiFi
                                        </p>
                                    </div>
                                </div>

                                <div className="list-section">
                                    <div className="img-div">
                                        <img
                                            src={require("../../../../../assets/images/icons/restaurant.svg")}
                                            alt="restaurant"
                                        />
                                    </div>

                                    <div>
                                        <p className="list-heading pt-20">
                                            Food and drink
                                        </p>
                                        <p>
                                            Continental breakfast available for a fee
                                            daily 6:30 AM–10:30 AM: AUD 36.00 for adults
                                            and AUD 36 for children
                                        </p>
                                        <p>1 restaurant and 1 coffee shop/cafe</p>
                                        <p>1 bar</p>
                                        <p>24-hour room service</p>
                                    </div>
                                </div>
                            </Col>

                            <Col md={12}>
                                <div className="list-section">
                                    <div className="img-div">
                                        <img
                                            src={require("../../../../../assets/images/icons/p-circle-grey.svg")}
                                            alt="p-circle-grey"
                                        />
                                    </div>

                                    <div>
                                        <p className="list-heading">
                                            Parking and public transport
                                        </p>
                                        <p>Valet parking on site (AUD 50 per day)</p>
                                        <p>
                                            On-site parking is wheelchair accessible
                                        </p>
                                        <p>Return airport shuttle (surcharge)</p>
                                    </div>
                                </div>

                                <div className="list-section">
                                    <div className="img-div">
                                        <img
                                            src={require("../../../../../assets/images/icons/suitcase.svg")}
                                            alt="suitcase"
                                        />
                                    </div>

                                    <div>
                                        <p className="list-heading pt-20">
                                            Business services
                                        </p>
                                        <p>Valet parking on site (AUD 50 per day)</p>
                                        <p>
                                            On-site parking is wheelchair accessible
                                        </p>
                                        <p>Return airport shuttle (surcharge)</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </TabPane>
        )
    }


    renderPolicies = () => {
        return (
            <TabPane tab="Policies" key="5">
            <div className="information-container">
                <Row>
                    <Col md={4} className="information-left">
                        <Title className="left-title">Policies</Title>
                    </Col>
                    <Col md={15} offset={3}>
                        <p>
                            <strong>Property policies</strong>
                        </p>
                        <Paragraph className="property-msg">
                            Hotel registration and check in is available only to
                            guests who are not prohibited from entering the
                            hotel, are 18 years of age or over, and are recorded
                            on the reservation at the time of booking. A valid
                            form of photo identification acceptable to Crown
                            must be supplied in order to process your check-in,
                            which will be recorded by Crown.
                        </Paragraph>
                        <p>PAYMENT SECURITY:</p>
                        <Paragraph className="property-msg">
                            For guests providing a credit card, upon check-in a
                            pre-authorisation is required to guarantee the
                            accommodation in full (if not prepaid in advance).
                            If staying in a premium room type, an additional
                            credit card pre-authorisation of $500 per night, not
                            exceeding $2,000 for bookings of more than four
                            nights is required as security for any incidental
                            costs, including damage associated with the room. In
                            all other room types, an additional credit card
                            pre-authorisation of $100 per night is required as
                            security for any incidental costs, including damage
                            associated with the room. For guests paying with
                            cash, EFTPOS or debit card, upon check-in a payment
                            for accommodation is required in full (if not
                            prepaid in advance), plus an additional $200 per
                            night is required as security for any incidental
                            costs, including damage associated with the room.
                            Purchases made throughout the stay must be paid for
                            when ordered.
                        </Paragraph>
                    </Col>
                </Row>
            </div>
        </TabPane>
        )
    }

    renderReviews = () => {
        const { selectedHotel } = this.props
        return(
            <TabPane tab="Reviews" key="6">
                <HotelReview
                    selectedHotel={selectedHotel}
                    getDetails={this.props.getAllDetailInfo}
                />
            </TabPane>
        )
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const {selectedHotel, setPriorityTab } = this.props
        const { activeTab } = this.state
        return (
            <div>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    activeKey={activeTab}
                    onChange={(e) => {
                        this.onTabChange(e)
                        setPriorityTab()
                    }}
                >
                    {this.renderRoomInformation(selectedHotel)}
                    {this.renderOverView()}
                    {this.renderLocation()}
                    {this.renderAmenities()}
                    {this.renderPolicies()}
                    {this.renderReviews()}                   
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, classifieds } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedclassifiedDetail: classifieds.classifiedsList,
    };
};

export default connect(mapStateToProps, {
    openLoginModel,
    enableLoading,
    disableLoading,
})(React.memo(withRouter(HotelDetailTabView)));
