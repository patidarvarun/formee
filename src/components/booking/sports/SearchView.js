import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../NewSidebar';
import { Pagination, Card, Layout, Row, Col, Typography, Tabs, Breadcrumb, Select, Button, Table } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { sportsEventSearch, getSportsList, getBannerById, enableLoading, disableLoading } from '../../../actions/index';
import DetailCard from '../common/Card'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import NoContentFound from '../../common/NoContentFound'
import SportsSearch from '../common/search-bar/SportsSearch'
import { getBookingCatLandingRoute } from '../../../common/getRoutes'
import { TEMPLATE } from '../../../config/Config'
import { getNextWeek, getThisWeek, getNextMonth, getThisWeekend, currentDate } from '../../common'
import BookTicketModal from './BookTicketModal'
import { capitalizeFirstLetter } from '../../common'
import moment from 'moment'
const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Pagination
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
    }
    if (type === 'next') {
        return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
    }
    return originalElement;
}

class SearchView extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            bookingList: [],
            subCategory: [],
            filteredData: [],
            isListViewPage: false,
            isSearchResult: false,
            isGridView: true,
            isListView: false,
            popularSports: [],
            visible: false,
            allData: '',
            page: 1
        };
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props
    */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.categoryId
        let catIdNext = nextprops.match.params.categoryId
        if ((catIdInitial !== catIdNext)) {
            this.getMostRecentData()
            const id = nextprops.match.params.categoryId
            this.getBannerData(id)
        }
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        this.props.enableLoading()
        let parameter = this.props.match.params
        let id = parameter.categoryId
        this.getBannerData(id)
        this.getMostRecentData()
        this.getPopularEvents(1000)// for now we passed sports id static need to change dynamically
    }

    /**
     * @method getBannerData
     * @description get banner detail
     */
    getBannerData = (categoryId) => {
        this.props.getBannerById(3, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : ''
                const banner = data && data.filter(el => el.moduleId === 3)
                let temp = [], image;
                image = banner.length !== 0 && banner.filter(el => el.categoryId == categoryId)
                this.setState({ topImages: image })
                
            }
        })
    }

    /**
     * @method getPopularEvents
     * @description get all popular events
     */
    getPopularEvents = (cat_id) => {
        this.props.getSportsList({ sporttypeid: cat_id }, res => {
            if (res.status === 200) {
                
                let data = res.data && res.data.data && res.data.data.all && res.data.data.all.data
                if (data) {
                    let sportsList = data && Array.isArray(data.item) && data.item.length ? data.item : []
                    this.setState({ popularSports: sportsList })
                }
            }
        })
    }

    /**
    * @method getMostRecentData
    * @description get most recent booking data
    */
    getMostRecentData = () => {
        const { location } = this.props
        if (location.state !== undefined) {
            this.setState({
                bookingList: location.state.bookingList,
                total_records: location.state.total_records,
                searchReqData: location.state.searchReqData,
                allData: location.state.allData
            })
        }
    }

    /** 
    * @method handleSearchResponce
    * @description Call Action for Classified Search
    */
    handleSearchResponce = (res, resetFlag, reqData, allData) => {
        let cat_id = this.props.match.params.categoryId
        if (resetFlag) {
            this.setState({ isSearchResult: false });
            this.getMostRecentData(cat_id)
        } else {
            
            this.setState({
                bookingList: res,
                searchReqData: reqData,
                total_records: allData.totalrecords,
                allData: allData
            })
        }
    }

    /**
    * @method renderCard
    * @description render card details
    */
    renderCard = (categoryData) => {
        
        const { allData } = this.state
        if (Array.isArray(categoryData) && categoryData.length) {
            let list = categoryData
            let cat_id = this.props.match.params.categoryId
            return (
                <Fragment>
                    <Row gutter={[40, 40]}>
                        {list.map((el, i) => {
                            return (
                                <Col span={8}>
                                    <Card
                                        bordered={false}
                                        className={'detail-card fm-booklist-card card-booklist'}
                                        cover={
                                            <img
                                                src={el.image ? el.image : require('../../../assets/images/fm-bottom-banner.png')}
                                                alt=''
                                                onClick={() => this.props.history.push({
                                                    pathname: `/bookings-sports-detail/${TEMPLATE.SPORTS}/${cat_id}/${el.tournamentid}`,
                                                    state: {
                                                        itemDetail: el,
                                                        allData: allData
                                                    }
                                                })}
                                            />
                                        }
                                        actions={[
                                            <div size='60' className='fm-date-info'>
                                                {/* 19 Mar - 26 Sep 2020 */}
                                                {(el.final_date === 0 && el.final_time === 0) ? el.dateTime_boundries : ''}
                                            </div>,
                                            <Icon icon='wishlist' size='20' />,
                                        ]}
                                    >
                                        <div className='fm-card-title'>
                                            <div className='title'>
                                                {el.caption ? capitalizeFirstLetter(el.caption) : ''}
                                            </div>
                                        </div>
                                        <div className='category-box'>
                                            <div className='category-name'>
                                                {el.sport ? el.sport : ''}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Fragment>
            )
        } else {
            return <NoContentFound />
        }
    }

    /**
     * @method toggleListView
     * @description toggle the filter
     */
    toggleListView() {
        this.setState({
            isListView: true,
            isGridView: false
        })
    }

    /**
     * @method toggleGridView
     * @description toggeled the pro card
     */
    toggleGridView() {
        this.setState({
            isListView: false,
            isGridView: true
        })
    }

    /**
     * @method renderSportsEvents
     * @description render sports events
     */
    renderSportsEvents = (popularSports) => {
        return popularSports && Array.isArray(popularSports) && popularSports.length && popularSports.slice(0, 4).map((el, i) => {
            return (
                <Row className="mb-20" key={i}>
                    <div className='fm-card-block'>
                        <div className='ad-banner'>
                            <img src={el.image ? el.image : require('../../../assets/images/australian-open.png')} alt='' />
                        </div>
                        <div className='fm-desc-stripe'>
                            <Row>
                                <Col span={12}>
                                    <h2>{capitalizeFirstLetter(el.caption)}</h2>
                                </Col>
                                <Col span={12} className='text-right'>
                                    <Link to='' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Row>
            )
        })
    }

    /**
     * @method getDataByDates
     * @description get data of sports by dates
     */
    getDataByDates = (date, key) => {
        this.props.enableLoading();
        const { searchReqData, page } = this.state;
    let reqData = {
        countryid: searchReqData.countryid,
        cityid: searchReqData.cityid,
        sporttypeid: searchReqData.sporttypeid,
        radius: searchReqData.radius,
        page: page
    }
    switch(key){
        case "this_week":
            reqData.from_date = date.monday;
            reqData.to_date = date.sunday; 
            break;
        case "this_weekend" :
            reqData.from_date = date;
            reqData.to_date = date; 
            break;
        case "next_week":
            let input = new Date();
            let fd = new Date(moment(input).subtract(+input.getDay(), "days"));
            let firstweek = new Date(moment(fd).add(7, "days"))
            let lastweek = new Date(moment(fd).add(13, "days"))
            reqData.from_date = moment(firstweek).format('DD/MM/YYYY');
            reqData.to_date = moment(lastweek).format('DD/MM/YYYY'); 
            break;
        case "next_month":
            let tmp = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            reqData.from_date = moment(date).format('DD/MM/YYYY');
            reqData.to_date = moment(tmp).format('DD/MM/YYYY'); 
            break;
        default:
            reqData.from_date = date;
            reqData.to_date = date; 
            break;
        }
    this.props.sportsEventSearch(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === 200) {
            let total = res.data && res.data.data && res.data.data.all && res.data.data.all.control && res.data.data.all.control.totalrecords
            let temp = res.data && res.data.data && res.data.data.all && res.data.data.all.data
            if (temp && Array.isArray(temp.item)) {
                this.setState({ bookingList: temp.item, total_records: total })
            }
        }
    })

    }

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
            this.props.openLoginModel()
        }
    };

    /**
     * @method handleCancel
     * @description handle cancel
     */
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    /**
   * @method handlePageChange
   * @description handle page change
   */
    handlePageChange = (e) => {
        const { searchReqData } = this.state;
        let reqData = {
            countryid: searchReqData.countryid,
            cityid: searchReqData.cityid,
            sporttypeid: searchReqData.sporttypeid,
            radius: searchReqData.radius,
            page: e
        }
        this.props.sportsEventSearch(reqData, (res) => {
            if (res.status === 200) {
                let total = res.data && res.data.data && res.data.data.all && res.data.data.all.control && res.data.data.all.control.totalrecords
                let temp = res.data && res.data.data && res.data.data.all && res.data.data.all.data
                if (temp && Array.isArray(temp.item)) {
                    this.setState({
                        bookingList: temp.item,
                        total_records: total,
                        page: e
                     })
                }
            }
        })

    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const { allData, total_records, visible, popularSports, bookingList, topImages, isGridView, isListView } = this.state;
        console.log("🚀 ~ file: SearchView.js ~ line 328 ~ SearchView ~ render ~ bookingList", bookingList)
        const parameter = this.props.match.params;
        let cat_id = parameter.categoryId;
        let categoryPagePath = getBookingCatLandingRoute(TEMPLATE.SPORTS, cat_id, TEMPLATE.SPORTS)
        const columns = [
            {

                title: 'Event',
                dataIndex: 'Event',
                key: 'Event',
                render: (cell, row, index) => {
                    return (
                        <img
                            src={row.image ? row.image : require('../../../assets/images/table-content.png')}
                            alt='Home' width='30' className={'stroke-color'}
                            onClick={() => this.props.history.push({
                                pathname: `/bookings-sports-detail/${TEMPLATE.SPORTS}/${cat_id}/${row.tournamentid}`,
                                state: {
                                    itemDetail: row,
                                    allData: allData
                                }
                            })}
                        />
                    )
                }
                // render: text => <a>{text}</a>,
            },
            {

                title: '',
                dataIndex: 'caption',
                key: 'caption',
                render: (cell, row, index) => {
                    return (
                        <a>{capitalizeFirstLetter(row.caption)} <br /> {`${row.home_team_caption} v ${row.away_team_caption} `} <br />{row.sport} </a>
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
                title: 'Get it!',
                key: 'tags',
                dataIndex: 'tags',
                render: (cell, row, index) => {
                console.log("🚀 ~ file: SearchView.js ~ line 443 ~ SearchView ~ render ~ row", row)
                    return (
                        <Link
                            to={{
                                pathname: `/booking-ticket-detail/${53}`,
                                state: {
                                tournament: row,
                                },
                            }}
                            >
                        <div className='yellow-btn' color={'volcano'} onClick={this.contactModal}>
                            TICKETS
                        </div>
                        </Link>
                    )
                }
            }
        ];

        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="yellow-theme common-left-right-padd">
                    <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} showDropdown={false}/>
                    <Layout className="right-parent-block">
                        <div className='sub-header fm-details-header'>
                            <Title level={4} className='title'>{'SPORT TICKETS'}</Title>
                        </div>
                        <div className='inner-banner'>
                            <CarouselSlider bannerItem={topImages} pathName='/' />
                        </div>
                        <Tabs type='card' className={'tab-style1 job-search-tab sport-searchsect bookings-categories-serach'}>
                            <TabPane tab=' Search' key='1'>
                                <SportsSearch handleSearchResponce={this.handleSearchResponce} />
                            </TabPane>
                        </Tabs>
                        <Content className='site-layout'>
                            <div className='wrap-inner fm-gradient-bg fm-cities-cards'>
                                <Row className='mb-20 ' align="middle">
                                    <Col md={16}>
                                        <Breadcrumb separator='|' className='pt-30 pb-30'>
                                            <Breadcrumb.Item>
                                                <Link to='/'>Home</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to='/bookings'>Bookings</Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link to={categoryPagePath}>
                                                    {`Sports Tickets`}
                                                </Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                {bookingList[0].city}
                                            </Breadcrumb.Item>
                                        </Breadcrumb>
                                    </Col>
                                    <Col md={8}>
                                        <div className='location-btn'>
                                            {bookingList.length ? bookingList[0].city : ""} <Icon icon='location' size='15' className='ml-20' />
                                        </div>
                                    </Col>
                                </Row>
                                <Card
                                    title={<ul className='panel-action sports-panel-list'>
                                        <li className="pr-20"> {bookingList[0].city}</li>
                                        <li>
                                            <Button size='18' onClick={() => this.getDataByDates(currentDate(), 'today')}>Today</Button>
                                        </li>
                                        <li>
                                            <Button size='18' onClick={() => this.getDataByDates(getThisWeek(), 'this_week')}>This Week</Button>
                                        </li>
                                        <li>
                                            <Button size='18' onClick={() => this.getDataByDates(getThisWeekend(), 'this_weekend')}>This Weekend</Button>
                                        </li>
                                        <li>
                                            <Button size='18' onClick={() => this.getDataByDates(getNextWeek(), 'next_week')}>Next Week</Button>
                                        </li>
                                        <li>
                                            <Button size='18' onClick={() => this.getDataByDates(getNextMonth(), 'next_month')}>Next Month</Button>
                                        </li>
                                    </ul>}
                                    bordered={false}
                                    extra={
                                        <ul className='panel-action'>
                                            <li title={'Grid view'} onClick={this.toggleGridView.bind(this)} className={!isListView && 'active'}><Icon icon='grid' size='18' /></li>
                                            <li className={'active'} onClick={this.toggleListView.bind(this)} className={isListView && 'active'}><Icon icon='grid-view' size='18' /></li>
                                        </ul>

                                    }
                                    className={'home-product-list header-nospace fm-listing-page'} >
                                </Card>
                                {isGridView && <div>
                                    {this.renderCard(bookingList)}
                                    {total_records > 10 && <Pagination
                                        defaultCurrent={1}
                                        defaultPageSize={10} //default size of page
                                        onChange={this.handlePageChange}
                                        total={total_records} //total number of card data available
                                        itemRender={itemRender}
                                        className={'mb-20'}
                                    />}
                                </div>
                                }
                                {isListView && <div>
                                    <Row gutter={[40, 40]}>
                                        <Col span='6'>
                                            <Title className="mb-30" level={4}>{'Popular Sports Events'}</Title>
                                            {this.renderSportsEvents(popularSports)}
                                        </Col>
                                        <Col span='18'>
                                            <Table className='detail-maintable' columns={columns} dataSource={bookingList} />
                                            {total_records > 10 && <Pagination
                                                defaultCurrent={1}
                                                defaultPageSize={10} //default size of page
                                                onChange={this.handlePageChange}
                                                total={total_records} //total number of card data available
                                                itemRender={itemRender}
                                                className={'mb-20'}
                                            />}
                                        </Col>
                                    </Row>
                                </div>}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
                {visible &&
                    <BookTicketModal
                        visible={visible}
                        onCancel={this.handleCancel}
                    />}
            </Layout>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, bookings } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default connect(
    mapStateToProps,
    { enableLoading, disableLoading, sportsEventSearch, getSportsList, enableLoading, disableLoading, getBannerById }
)(withRouter(SearchView));