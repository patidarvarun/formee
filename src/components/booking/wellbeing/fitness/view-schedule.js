import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Icon from '../../../customIcons/customIcons';
import { openLoginModel, getBookingDetails, enableLoading, disableLoading, getFitnessClassListing, getFitnessClassSchedule } from '../../../../actions'
import { Card, Layout, Typography, Avatar, Tabs, Row, Col, Menu, Breadcrumb, Form, Carousel, Table, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { getBookingMapDetailRoute, getBookingSubcategoryRoute, getBookingDetailPageRoute } from '../../../../common/getRoutes'
import { toastr } from 'react-redux-toastr'
import { MESSAGES } from '../../../../config/Message';
import { langs } from '../../../../config/localization';
import BuyClassModal from '../fitness/booking/buy-class';
import moment from 'moment'

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

class ViewSchedule extends React.Component {
    myDivToFocus = React.createRef()
    constructor(props) {
        super(props);
        this.state = {
            tournamentList: [],
            detail: null,
            classes: [],
            selectedDate: moment().add(1, 'days').format('ddd DD MMM'),
            selectedClass: '',
            selectedSchedule: [],
            instructorName: '',
            scheduleRoom: '',
            selected: ''
        };
    }

    componentWillMount() {
        this.getDetails()
        let traderProfileId = this.props.match.params.id

        this.props.enableLoading()
        this.props.getFitnessClassListing({ id: traderProfileId }, (res) => {
            this.props.disableLoading()
            if (res.data && res.data.status === 200) {
                let data = res.data && res.data.data
                let traderClasses = data.trader_classes && Array.isArray(data.trader_classes) && data.trader_classes.length ? data.trader_classes : []
                let classId = traderClasses.length ? traderClasses[0].id : ''
                let className = traderClasses.length ? traderClasses[0].class_name : ''

                this.setState({
                    classes: traderClasses,
                    selectedClass: this.props.location.state ? this.props.location.state.selectedClass : className,

                })
                let cId = ''
                if (this.props.location.state) {

                    let index = traderClasses.findIndex((el) => el.class_name === this.props.location.state.selectedClass)
                    cId = traderClasses[index].id
                } else {
                    cId = classId
                }

                if (cId) {
                    this.getScheduleData(cId)
                } else {
                    toastr.error('No classes are Schedule by this trader.');
                }

            }
        })
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
     * @method getScheduleData
     * @description get schedule data
     */
    getScheduleData = (e) => {
        const { classes, selectedDate } = this.state;
        let traderProfileId = this.props.match.params.id
        // let date = moment(selectedDate, 'ddd DD MMM').format('YYYY-MM-DD');
        let date_from = moment(selectedDate, 'ddd DD MMM').format('YYYY-MM-DD')
        let date_to = moment(selectedDate, "DD-MM-YYYY").add(2, 'days').format('YYYY-MM-DD')
        this.props.enableLoading()
        this.props.getFitnessClassSchedule({ trader_class_id: e, trader_profile_id: traderProfileId, date_from, date_to }, (res) => {
            this.props.disableLoading()
            if (res.status === 200 && res.data.data !== null) {
                let i = classes.findIndex((c) => c.id === e)
                if (i >= 0) {
                    let allData = []
                    res.data.data.map((el) => {
                        let classObj = el.trader_classes_schedules.map((cl) => {
                            cl.instructor_name = el.instructor_name
                            return cl
                        })
                        allData.push(...classObj)
                        // allData = [...allData, el.trader_classes_schedules]
                    })
                    this.setState({ selected: classes[i], selectedClass: classes[i].class_name, selectedSchedule: allData, instructorName: res.data.data.instructor_name, scheduleRoom: res.data.data.room })
                }
            }
        })
    }

    /**
     * @method renderClasses
     * @description render classes options
     */
    renderClasses = () => {
        const { classes } = this.state;
        return classes.map((el) => {
            return <Option key={el.id} value={el.id}>{el.class_name}</Option>
        })
    }

    /**
     * @method displayClasspBuyModal
     * @description display Fitness membership
     */
    displayClasspBuyModal = (selectedSpaService) => {

        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                displayClasspBuyModal: true,
                selectedSpaService: selectedSpaService
            });
        } else {
            this.props.openLoginModel()
        }
    }

    renderSchedule = (date) => {
        const { selectedSchedule, selectedClass, scheduleRoom, instructorName } = this.state;
        let day = moment(date, "YYYY-MM-DD").format('dddd')
        let index = selectedSchedule.findIndex((s) => s.day === String(day))
        if (index < 0) {
            return <Row gutter={[42, 0]} className="calender-detail-item"><Col md={24}><Text className="no-schedule">There are no classes scheduled today.</Text></Col></Row>
        } else {
            return selectedSchedule.map((el) => {
                if (el.day === String(day)) {
                    return (
                        <>
                            <Row gutter={[42, 0]} className="calender-detail-item">
                                <Col md={6}>
                                    <div className="pt-5">
                                        <Text>
                                            {moment(el.start_time, "HH:mm:ss").format("hh:mm A")} <br />
                                            <span className="pt-2 blue-text inline-block">{el.duration}</span>
                                        </Text>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="pt-5">
                                        <Text>
                                            {console.log(selectedClass, 'classssss')}
                                            <span className="table-detail-view-schu">{selectedClass}</span>  <br />
                                            <span className="pt-2 blue-text inline-block">{el.instructor_name} / Studio {scheduleRoom}</span>
                                        </Text>
                                    </div>
                                </Col>
                                <Col md={6} className="text-right">
                                    <Button className="yellow-btn" onClick={() => this.displayClasspBuyModal(el)}> Book</Button>
                                </Col>

                            </Row> <Divider />
                        </>
                    )
                }
            })
        }
    }

    /**
    * @method getFormatedDate
    * @description formate a date by today tommorow & genral format
    */
    getFormatedDate = (someDate) => {
        const today = moment().endOf('day').format("YYYY-MM-DD")
        const tomorrow = moment().add(1, 'day').endOf('day').format("YYYY-MM-DD")

        if (moment(someDate, "YYYY-MM-DD").isSame(today)) return moment(someDate).format('[Today], MMMM DD')
        else if (moment(someDate, "YYYY-MM-DD").isSame(tomorrow)) return moment(someDate).format('[Tommorow], MMMM DD')
        else return moment(someDate).format('MMMM DD')
    }

    render() {
        const { detail, selectedDate, selected, selectedClass, selectedSchedule, classes, instructorName, scheduleRoom } = this.state;
        console.log('selectedSchedule: ', selectedSchedule);

        let path = '', subCategoryPagePath, subcatId, subcatName
        let name = detail ? detail.business_name : '';
        let rate = detail && detail.average_rating ? `${parseInt(detail.average_rating)}.0` : ''
        let parameter = this.props.match.params
        let categoryId = parameter.categoryId;
        let categoryName = parameter.categoryName
        let bookingDetail = detail;
        let itemId = parameter.itemId;
        let templateName = parameter.categoryName;
        let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName
        let subCategoryId = parameter.subCategoryId
        let allData = parameter.all === langs.key.all ? true : false
        if (subCategoryId === undefined) {
            subcatId = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.booking_sub_cat_id
            subcatName = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.trader_service && bookingDetail.trader_profile.trader_service.name
            path = getBookingMapDetailRoute(templateName, categoryName, categoryId, subcatName, subcatId, itemId)
            subCategoryPagePath = getBookingSubcategoryRoute(templateName, categoryName, categoryId, subcatName, subcatId, allData)
        } else {
            path = getBookingMapDetailRoute(templateName, categoryName, categoryId, subCategoryName, subCategoryId, itemId)
            subCategoryPagePath = getBookingSubcategoryRoute(templateName, categoryName, categoryId, subCategoryName, subCategoryId, allData)
        }

        let detailPath = getBookingDetailPageRoute(categoryName, categoryId, categoryName, itemId)
        return (
            <Fragment>
                <div className="booking-product-detail-parent-block">
                    <Layout className="yellow-theme card-detailpage common-left-right-padd">
                        <Layout>
                            <Layout className="right-parent-block">
                                <Layout style={{ width: 'calc(100% - 0px)', overflowX: 'visible' }}>
                                    <div className='detail-page right-content-block'>
                                        <Row gutter={[0, 0]}>
                                            <Col span={8}>
                                                <div className="category-name">
                                                    <Link to={detailPath}>
                                                        <Button
                                                            type="ghost"
                                                            shape={"round"}
                                                        >
                                                            <Icon
                                                                icon="arrow-left"
                                                                size="20"
                                                                className="arrow-left-icon"
                                                            />
                                                            {subCategoryName ? subCategoryName : subcatName}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Layout>
                            </Layout>
                        </Layout>
                    </Layout>
                </div>
                <Layout className="yellow-theme schedule-view schedule-view bking-wellbeing-fitness-schedule-view">
                    <Layout className="right-parent-block">
                        {/* <SubHeader showAll={false} subCategoryName={subCategoryName}/>
                    <div className='wrap-inner mt-10'>
                        <div className="back-link" style={{cursor:'pointer'}}><Back {...this.props} /></div>
                    </div> */}
                        <Row className="mt-26">
                            <Col md={12}>
                                <Title level={4} className="orange-heading fs-25 mb-20">
                                    View Schedule
                            </Title>
                            </Col>
                            <Col md={12} className="align-right">
                                <Title className="mb-0 strong" level={3}>
                                    {name}
                                </Title>
                                <div className="product-ratting mb-50">
                                    {rate && <Rate className="mr-10" style={{ fontSize: 14 }} disabled defaultValue={rate ? rate : 0.0} />}
                                    <Text>{rate ? rate : "No review yet"}</Text>
                                    {/* <Text>
                                {detail && displayDateTimeFormate(detail.updated_at)}
                                </Text> */}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={24}>
                                <Title level={3} className="selected-class-title">
                                    {selectedClass}
                                </Title>
                                <div className="calendra-parent-block">
                                    <Card className="mt-10 calendra-withicons">
                                        <Icon onClick={() => {
                                            let day = moment(selectedDate, 'ddd DD MMM').format("YYYY-MM-DD")
                                            let todaysDate = moment().format("YYYY-MM-DD")
                                            if (moment(todaysDate).isBefore(moment(day))) {
                                                let nextDay = moment(selectedDate, 'ddd DD MMM').add(-1, 'days').format('ddd DD MMM');
                                                this.setState({ selectedDate: nextDay },
                                                    () => {
                                                        let i = classes.findIndex((c) => c.class_name === selectedClass)
                                                        if (i >= 0) {

                                                            this.getScheduleData(classes[i].id)
                                                        }
                                                    })
                                            } else {
                                                toastr.warning(langs.warning, MESSAGES.DATE_SELECTION_VALIDATION);
                                            }
                                        }} icon='arrow-left' size='16' className='' />
                                        <Text>{selectedDate}</Text>
                                        <Icon onClick={() => {
                                            let nextDay = moment(selectedDate, 'ddd DD MMM').add(1, 'days').format('ddd DD MMM');
                                            this.setState({ selectedDate: nextDay }, () => {
                                                let i = classes.findIndex((c) => c.class_name === selectedClass)
                                                if (i >= 0) {

                                                    this.getScheduleData(classes[i].id)
                                                }
                                            })
                                        }} icon='arrow-right' size='16' className='ml-12' />
                                    </Card>
                                    <div className="calender-detail mb-60">
                                        <Row>
                                            <Col md={24} className="blue-strip"> {this.getFormatedDate(moment(selectedDate, "DD-MM-YYYY").format('YYYY-MM-DD'))}</Col>
                                        </Row>
                                        <Card className="card-body-block">
                                            {this.renderSchedule(moment(selectedDate, "DD-MM-YYYY").format('YYYY-MM-DD'))}

                                            {/* {(Array.isArray(selectedSchedule) && selectedSchedule.length) ? selectedSchedule.map((el) => {
                                                console.log('el: ', el);
                                                return (
                                                    <>
                                                        <Row gutter={[42, 0]} className="calender-detail-item">
                                                            <Col md={6}>
                                                                <div className="pt-5">
                                                                    <Text>
                                                                        {moment(el.start_time, "HH:mm:ss").format("hh:mm A")} <br />
                                                                        <span className="pt-2 blue-text inline-block">{el.duration}</span>
                                                                    </Text>
                                                                </div>
                                                            </Col>
                                                            <Col md={12}>
                                                                <div className="pt-5">
                                                                    <Text>
                                                                        {console.log(selectedClass, 'classssss')}
                                                                        <span className="table-detail-view-schu">{selectedClass}</span>  <br />
                                                                        <span className="pt-2 blue-text inline-block">{instructorName} / Studio {scheduleRoom}</span>
                                                                    </Text>
                                                                </div>
                                                            </Col>
                                                            <Col md={6} className="text-right">
                                                                <Button className="yellow-btn" onClick={() => this.displayClasspBuyModal(el)}> Book</Button>
                                                            </Col>

                                                        </Row> <Divider />
                                                    </>
                                                )
                                            }) : <Row gutter={[42, 0]} className="calender-detail-item"><Col md={24}><Text className="no-schedule">There are no classes scheduled today.</Text></Col></Row>} */}
                                        </Card>
                                    </div>
                                    {/* //------------Second Date -------------- */}
                                    <div className="calender-detail mb-60">
                                        <Row>
                                            <Col md={24} className="blue-strip"> {
                                                this.getFormatedDate(moment(selectedDate, "DD-MM-YYYY").add(1, 'days').format('YYYY-MM-DD'))
                                                // moment(selectedDate, "DD-MM-YYYY").add(1, 'days').format('YYYY-MM-DD') 2021-04-16
                                            }</Col>
                                        </Row>
                                        <Card className="card-body-block">
                                            {this.renderSchedule(moment(selectedDate, "DD-MM-YYYY").add(1, 'days').format('YYYY-MM-DD'))}
                                        </Card>
                                    </div>

                                    {/* //------------Third Date -------------- */}
                                    <div className="calender-detail mb-60">
                                        <Row>
                                            <Col md={24} className="blue-strip"> {
                                                this.getFormatedDate(moment(selectedDate, "DD-MM-YYYY").add(2, 'days').format('YYYY-MM-DD'))
                                            }</Col>
                                        </Row>
                                        <Card className="card-body-block">
                                            {this.renderSchedule(moment(selectedDate, "DD-MM-YYYY").add(2, 'days').format('YYYY-MM-DD'))}
                                        </Card>
                                    </div>
                                </div>
                            </Col>
                            <Col >
                            </Col>
                        </Row>

                        <Modal
                            title='Book Now'
                            visible={this.state.displayClasspBuyModal}
                            className={'custom-modal style1'}
                            footer={false}
                            onCancel={() => this.setState({ displayClasspBuyModal: false })}
                            destroyOnClose={true}
                        >
                            <div className='padding'>
                                <BuyClassModal selected={selected} selectedClass={selectedClass} selectedDate={selectedDate} selectedService={this.state.selectedSpaService} initialStep={0} bookingDetail={detail} />
                            </div>
                        </Modal>
                    </Layout>
                </Layout>
            </Fragment>
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
        getBookingDetails, getFitnessClassListing, getFitnessClassSchedule,
        enableLoading, disableLoading, openLoginModel
    }
)(ViewSchedule);