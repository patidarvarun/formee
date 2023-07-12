import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import Icon from '../../../customIcons/customIcons';
import { getFitnessMemberShipListing, openLoginModel, getBookingDetails, enableLoading, disableLoading } from '../../../../actions'
import { Card, Layout, Typography, Avatar, Tabs, Row, Col, Menu, Breadcrumb, Form, Carousel, Table, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { displayDateTimeFormate, convertHTMLToText, converInUpperCase, formateTime, getDaysName } from '../../../common';
import AppSidebarInner from '../../../sidebar/SidebarInner';
import BuyClassModal from '../fitness/booking/buy-class';
import history from '../../../../common/History';


const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card

class MembershipList extends React.Component {
    myDivToFocus = React.createRef()
    constructor(props) {
        super(props);
        this.state = {
            packages: [],
            detail: null,
            displayMembershipBuyModal: false,

        };
    }

    componentDidMount() {
        this.getFitnessMemberShips()
        this.getDetails()
    }


    /**
    * @method getDetails
    * @description get details
    */
    getDetails = () => {
        const { isLoggedIn, loggedInUser } = this.props
        
        let itemId = this.props.match.params.itemId
        let reqData = {
            id: itemId,
            user_id: isLoggedIn ? loggedInUser.id : ''
        }
        this.props.getBookingDetails(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                this.setState({ detail: res.data.data })
                
            }
        })
    }

    /**
     * @method getFitnessMemberShips
     * @description get service details
     */
    getFitnessMemberShips = () => {
        let trader_user_profile_id = this.props.match.params.id
        let reqdata = {
            trader_user_profile_id: trader_user_profile_id
        }
        this.props.getFitnessMemberShipListing(reqdata, (res) => {
            if (res.status === 200) {
                let data = res.data
                this.setState({
                    packages: data.packages,
                })
            }
        })
    }

    /**
    * @method displayMembershipBuyModal
    * @description display Fitness membership
    */
    displayMembershipBuyModal = (selectedSpaService) => {
        
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                displayMembershipBuyModal: true,
                selectedSpaService: selectedSpaService
            });
        } else {
            this.props.openLoginModel()
        }
    }

    /**
        * @method renderPacakgeList
        * @description render Package list
        */
    renderPacakgeList = () => {
        return (this.state.packages.map((el) => {
            return <Row className="pt-10 ">
                <Col md={6}>
                    <Text>
                        {el.name}<br />
                        <span className=" blue-text">{el.detail}</span>

                    </Text>
                </Col>
                <Col md={6}>
                    <Text>
                        {el.class_count} Times X {el.duration} Weeks <br />
                    </Text>
                </Col>
                <Col md={6}>
                    <Text>
                        ${el.price}.00 <br />
                    </Text>
                </Col>
                <Col md={6}>
                    <Button className="yellow-btn" onClick={() => this.displayMembershipBuyModal(el)}> Book</Button>
                </Col>
            </Row>
        })
        )
    }
    render() {
        const { bookingDetail, activeTab, portfolio, detail } = this.state;
        const { visible, current, tournamentList, basicDetail, currentPage, postPerPage } = this.state;

        const columns = [
            {
                title: 'Event',
                dataIndex: 'Event',
                key: 'Event',
                render: (cell, row, index) => {
                    return (
                        <img src={require('../../../../assets/images/table-content.png')} alt='Home' width='30' className={'stroke-color'} />
                    )
                }
            },
            {
                title: '',
                dataIndex: 'caption',
                key: 'caption',
                render: (cell, row, index) => {
                    return (
                        <a>{row.caption} <br /> {`${row.home_team_caption} v ${row.away_team_caption} `} <br />{row.sport} </a>
                    )
                }
            },
            {
                title: 'Date',
                dataIndex: 'date_of_event',
                key: 'date_of_event',
                render: (cell, row, index) => {
                    return (
                        <a>{row.date_of_event} <br />{row.time_of_event} </a>
                    )
                }
            },
            {
                title: 'Location',
                dataIndex: 'Location',
                key: 'Location',
                render: (cell, row, index) => {
                    return (
                        <a>{row.venue} <br />{row.city} <br /> {row.country} </a>
                    )
                }
            },
            {
                title: 'Get it!',
                key: 'tags',
                dataIndex: 'tags',
                render: (cell, row, index) => {
                    return (
                        <div className='yellow-btn' color={'volcano'} onClick={this.contactModal}>
                            TICKETS
                        </div>
                    )
                }
            }
        ];
        const dropmenu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                        1st menu item
                </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                        2nd menu item
                </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                        3rd menu item
                </a>
                </Menu.Item>
                <Menu.Item danger>a danger item</Menu.Item>
            </Menu>
        );

        let rate = detail && detail.average_rating ? `${parseInt(detail.average_rating)}.0` : ''
        
        return (

            <Layout className="yellow-theme schedule-view">
                <Layout>
                    <AppSidebarInner history={history} />
                    <Layout style={{ width: 'calc(100% - 200px)', overflowX: 'visible' }}>
                        <Breadcrumb separator='|' className='pt-20 pb-30' style={{ paddingLeft: 64 }}>
                            <Breadcrumb.Item>
                                <Link to='/'>Home</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link >Bookings</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link ></Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link >

                                </Link>
                            </Breadcrumb.Item>
                            {/* <Breadcrumb.Item>
                            {(categoryName === TEMPLATE.HANDYMAN ? `AD No. ${itemId}` :
                                bookingDetail && bookingDetail.business_name && bookingDetail.business_name
                            )}
                        </Breadcrumb.Item> */}
                        </Breadcrumb>
                        <Title level={2} className='inner-page-title'>
                            <span>Wellbeing</span>
                        </Title>

                        <Row className="pl-20 ">


                            <Col md={16}>
                                {bookingDetail && <Title className="mt-50 " level={2}> {detail.name & detail.name}</Title>}
                                <div className='product-ratting mb-50'>
                                    <Text>{rate ? rate : 'No review yet'}</Text>
                                    {rate && <Rate disabled defaultValue={rate ? rate : 0.0} />}
                                    <Text>
                                        {detail && displayDateTimeFormate(detail.updated_at)}
                                    </Text>                                    {/* <img src={require('../../../../assets/images/star-rating.png')} alt='' /> */}
                                    <Text> 27 review</Text></div>

                                <Title level={4} className="orange-heading font-25 mb-20"> View Membership</Title>
                                {/* <Table className='detail-maintable' columns={columns} dataSource={tournamentList} /> */}




                                <div className="calender-detail">
                                    <Row>
                                        <Col md={24} className="blue-strip"> Membership Plan</Col>
                                    </Row>
                                    <Card className="mb-20">
                                        {this.renderPacakgeList()}
                                        <Divider />
                                    </Card>

                                </div>
                            </Col>
                            <Col >
                            </Col>
                        </Row>
                        <Modal
                            title='Book Now'
                            visible={this.state.displayMembershipBuyModal}
                            className={'custom-modal style1'}
                            footer={false}
                            onCancel={() => this.setState({ displayMembershipBuyModal: false })}
                            destroyOnClose={true}
                        >
                            <div className='padding'>
                                <BuyClassModal selectedService={this.state.selectedSpaService} initialStep={0} bookingDetail={detail} />
                            </div>
                        </Modal>
                    </Layout>
                </Layout>
            </Layout>

        )
    }
}

const mapStateToProps = (store) => {
    const { auth, profile, bookings } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        // userDetails: profile.userProfile !== null ? profile.userProfile : {}
        userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
        fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],
    };
};
export default connect(
    mapStateToProps,
    {
        getFitnessMemberShipListing, getBookingDetails,
        enableLoading, disableLoading, openLoginModel
    }
)(MembershipList);