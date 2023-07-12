import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../NewSidebar';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../config/localization';
import { Layout, Row, Col, Typography, Carousel, Tabs, Form, Input, Select, Button } from 'antd';
import Icon from '../../customIcons/customIcons';
import SportsSearch from '../common/search-bar/SportsSearch'
import { getCityList, getpopularteamLogos, getLogo, getPopularTeamsList, getBannerById, openLoginModel, enableLoading, disableLoading, getSportsList, getSportsEventList, getSportsCityList } from '../../../actions/index';
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import NoContentFound from '../../common/NoContentFound'
import { TEMPLATE } from '../../../config/Config'
import { capitalizeFirstLetter } from '../../common'
import { getBookingSportsSearchRoute } from '../../../common/getRoutes'
import PopularSearchList from '../common/PopularSerach'
import { BASE_URL } from "../../../config/Config"
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css'; 
import { TeamOutlined } from '@ant-design/icons';

import '../booking.less'
const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const tempData1 = [{
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    rate: '3.0',
    discription: 'Product Heading',
    price: 'AU$120',
    category: 'subcategory',
    location: 'Melbourne',
}, {
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    rate: '3.0',
    discription: 'Product Heading',
    price: 'AU$120',
    category: 'subcategory',
    location: 'Melbourne',
}, {
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    rate: '3.0',
    discription: 'Product Heading',
    price: 'AU$120',
    category: 'subcategory',
    location: 'Melbourne',
}
];

class SportsLandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topImages: [],
            bottomImages: [],
            popularSports: [], 
            imageURL: '',
            showAllEvents: false,
            cityList: [],
            popularTeams: [],
            newList: [],
            popularLogo: null,
            loading: false
        }
    }

    /**
 * @method componentWillMount
 * @description called before mounting the component
 */
    componentDidMount() {
        this.props.enableLoading()
        let cat_id = this.props.match.params.categoryId
        const { bookings } = this.props
        let cityData = bookings.topCityData
        this.getBannerData(cat_id)
        this.getAllEvents();
        this.getAllCities();
        this.getPopularTeams();
       // this.getPopularEvents(1000)// for now we passed sports id static need to change dynamically
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props from components
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.cat_id
        let catIdNext = nextprops.match.params.cat_id
        if (catIdInitial !== catIdNext) {
            this.props.enableLoading()
            this.getBannerData(catIdNext);
            this.getAllEvents();
        }
    }

    getPopularTeams = () => {
        this.props.getPopularTeamsList(res => {
        if (res.status === 200) {
             let item = res.data && res.data.all && res.data.all.data ? res.data.all.data : ""
             item = item  && Array.isArray(item) ? item : []
             this.props.getpopularteamLogos(item, res1 => {
                 if(res1.status == 200){
                     let obj = {}
                     res1.data.map((oblogo) => {
                         Object.assign(obj, oblogo)
                        })
                        let temp2=[]
                        item.length !== 0 && item.map((el2, i) => {
                            temp2.push({
                                image: require('./icon/fcb.png'), 
                                label: el2.caption,
                            })
                        })
                        console.log("🚀 ~ file: index.js ~ line 109 ~ SportsLandingPage ~ obj", obj)
                    this.setState({
                        popularTeams: temp2,
                        popularLogo: obj
                    })
                 }
             })
            //  let item = res.data.data && res.data.data.all && res.data.data.all.data ? res.data.data.all.data.item : ''
            // let city = item  && Array.isArray(item) ? item : []
            // this.setState({cityList: city})
        }
    })}

    getAllCities = () => {
        // this.props.getSportsCityList({ countryid: 1002}, res => {
        this.props.getCityList(res => {
        if (res.status === 200) {
             console.log("🚀 ~ file: index.js ~ line 136 ~ SportsLandingPage ~ res", res)
             let item = res.data && res.data.all && res.data.all.data ? res.data.all.data : ''
            let city = item  && Array.isArray(item) ? item : []
            this.setState({cityList: city})
        }
    })}

    /**
     * @method getPopularEvents
     * @description get all popular events
     */
     getAllEvents = (cat_id) => {
        this.props.getSportsEventList({ country:1002, city:1005 },async res => {
            if (res.status === 200) {
                let data = res.data && res.data.data && res.data.data.all && res.data.data.all.data
                let sportsList = data && Array.isArray(data.item) && data.item.length ? data.item : []
                if(sportsList.length !== 0){
                    this.gettheLogo(sportsList)
                }
                
            }
        })
    }
    gettheLogo = (sportsList) => {
        let tmp = []
        sportsList.map((el, i) => {
            this.props.getLogo({
                home_team_name: el.home_team_caption,
                away_team_name: el.away_team_caption,
                team_sport: el.sport.includes("Soccer") ? "Soccer" : el.sport
            }, res1 => {
                if (res1.status === 200) {
                    let home = res1.data && res1.data.home_team && res1.data.home_team.length > 0 ? res1.data.home_team[0].team_logo_small : null
                    let away = res1.data && res1.data.away_team && res1.data.away_team.length > 0 ? res1.data.away_team[0].team_logo_small : null
                    el.home_team = home;
                    el.away_team = away;
                    tmp.push(el)
                    this.setState({popularSports: tmp})
                }
                if(+sportsList.length === (+i + 1))
                {
                    this.props.disableLoading()
                }
            })
        }
        )
    }

    // gettheLogo = async (sportsList) => {
    //     let tmp =  await Promise.all(sportsList.map((el) => {
    //         this.props.getLogo({
    //             home_team_name: el.home_team_caption,
    //             away_team_name: el.away_team_caption,
    //             team_sport: el.sport.includes("Soccer") ? "Soccer" : el.sport
    //         }, res1 => {
    //             if (res1.status === 200) {
    //                 console.log("🚀 ~ file: index.js ~ line 153 ~ SportsLandingPage ~ tmp ~ res1", res1)
    //                 let home = res1.data && res1.data.home_team && res1.data.home_team.length > 0 ? res1.data.home_team[0].team_logo_small : null
    //                 let away = res1.data && res1.data.away_team && res1.data.away_team.length > 0 ? res1.data.away_team[0].team_logo_small : null
    //                 el.home_team = home;
    //                 el.away_team = away;
    //             }
    //         })
    //         return el;
    //     }))
    //     console.log("🚀 ~ file: index.js ~ line 164 ~ SportsLandingPage ~ tmp", tmp)
    //     // tmp.resolve((t) => 
    //     this.setState({popularSports: tmp})    
    //     // );
    // }

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
                    this.setState({ popularSports: sportsList, imageURL: data.image })
                }
            }
        })
    }

    /**
    * @method getBannerData
    * @description get banner detail
    */
    getBannerData = (categoryId) => {
        this.props.getBannerById(3, res => {
            if (res.status === 200) {
                const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : ''
                const banner = data && data.filter(el => el.moduleId === 3)
                const top = banner && banner.filter(el => el.bannerPosition === langs.key.top)
                let image = top.length !== 0 && top.filter(el => el.categoryId == categoryId && el.subcategoryId === '')
                this.setState({ topImages: image })
            }
        })
    }

    /** 
    * @method handleSearchResponce
    * @description Call Action for Classified Search
    */
    handleSearchResponce = (res, resetFlag, reqData, allData) => {
        let cat_id = this.props.match.params.categoryId
        if (resetFlag) {
            this.setState({ isSearchResult: false });
            this.getPopularEvents(1000)//sportstypeid need to confirm and placed dynamically
        } else {
            let searchPagePath = getBookingSportsSearchRoute(TEMPLATE.SPORTS, cat_id)
            this.setState({ bookingList: res, searchReqData: reqData })
            
            this.props.history.push({
                pathname: searchPagePath,
                state: {
                    bookingList: res,
                    total_records: allData.totalrecords,
                    searchReqData: reqData,
                    allData: allData
                }
            })
        }
    }

    /** 
    * @method renderPopularSportsEvents
    * @description render popular sports events
    */
    renderPopularSportsEvents = (popularSports) => {
        const { imageURL, showAllEvents } = this.state
        let tmp = popularSports && Array.isArray(popularSports) && popularSports.length && popularSports
        tmp = tmp.slice(0, 11)
        return tmp.map((el, i) => {
         
            // let image = `${el.image}`
            return (
                <Col span={6}>
                    <div className='fm-card-block'>
                    <div className="team-logo">
                            <span className="team1">{el.home_team ? (<img src={`${BASE_URL}/upload_images/teams/${el.home_team}`} alt=''/>) : null}</span>
                            <span className="vs">vs</span>
                            <span className="team2">{el.away_team ? (<img src={`${BASE_URL}/upload_images/teams/${el.away_team}`} alt=''/>) : null}</span>
                        </div>
                       
                        <div className='fm-desc-stripe sports-fm-desc'>
                            <Row align={"middle"}>
                            <Col span={24}>
                                   <div className="teamname">
                                       <span className="team1"><b>{el.home_team_caption}</b> </span>
                                       <span><b>vs</b></span>
                                       <span className="team2"><b>{el.away_team_caption}</b></span>
                                       <span className="place">{`${el.city}, ${el.date_of_event.split(",")[1]}`}</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row align={"middle"}>
                                <Col span={24} className='text-center'>
                                    <Link to={{pathname: `/booking-ticket-list/${el.id}`, 
                                        state: { tournamentId: el.tournamentid }
                                        }}   className='get-tickets'>Get tickets</Link>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            )
        })
    }

    /**
     * @method renderTopCities
     * @description render top cities
     */
    renderTopCities = (item) => {
        
        if (item && Array.isArray(item) && item.length) {
            return item.slice(0,9).map((el, i) => {
                // let city = el && el.children && Array.isArray(el.children) && el.children.length ? el.children[0].label : ''
                let imgurl = el.caption.split(",")[0];
                imgurl = imgurl.toLowerCase();
                imgurl =  imgurl.replaceAll(" ","_");
                return (
                    <Col span={8}>
                        <div className='fm-card-block'>
                            <Link className='ad-banner'>
                                {/* <img src={require('../../../assets/images/fm-bottom-banner.png')} alt='' /> */}
                                <img src={`${BASE_URL}/upload_images/topcities/${imgurl}.jpg`} alt=''/>
                            </Link>
                            <div className='fm-desc-stripe fm-cities-desc'>
                                <Row className='ant-row-center'>
                                    <Col>
                                        <h2>{capitalizeFirstLetter(el.caption)}</h2>
                                        {/* <h4>{'Spain'}</h4> */}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>

                    
                )
            })
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { isLoggedIn, bookings } = this.props;
        // let sportsCountryList = bookings.topCityData
        let sportsCountryList = this.state.cityList
        const parameter = this.props.match.params;
        let cat_id = this.props.match.params.categoryId
        const { topImages, popularSports, popularTeams, popularLogo } = this.state
        return (
            <div className='App'>
                <Layout className="common-sub-category-landing booking-sub-category-landing">
                    <Layout className="yellow-theme common-left-right-padd">
                        <AppSidebar history={history} activeCategoryId={cat_id} showDropdown={false}/>
                        <Layout className="right-parent-block">
                            <div className='sub-header fm-details-header'>
                                <Title level={4} className='title'>{'SPORT TICKETS'}</Title>
                            </div>
                            <div className='inner-banner well'>
                                {/* <Link to='/'><img src={require('../../../assets/images/restaurant-banner.jpg')} alt='' align='center' /></Link> */}
                                <CarouselSlider bannerItem={topImages} pathName='/' />
                            </div>
                            <Tabs type='card' className={'tab-style1 job-search-tab bookings-categories-serach'}>
                                <TabPane tab='Search' key='1'>
                                    <SportsSearch handleSearchResponce={this.handleSearchResponce} />
                                </TabPane>
                            </Tabs>
                            <Content className='site-layout'>
                                {popularSports.length !== 0 && <div className='wrap-inner fm-gradient-bg sports-main'>
                                    <Title level={1} className='fm-block-title'>
                                        {/* {'Popular Sport Events'} */}
                                        {'Popular Sport Events'}
                                    </Title>
                                    <h3 className='fm-sub-title'>{'See most popular sport event here!'}</h3>
                                    {popularSports && popularSports.length !== 0 ?
                                        <Row gutter={[16, 16]}>
                                            {this.renderPopularSportsEvents(popularSports)}
                                            <Col span={24} className='fm-button-wrap' align='center'>
                                                {/* <Link onClick={() => this.setState({showAllEvents: true})} className='btn fm-btn-white'>See All</Link> */}
                                                <Link to={{pathname: `/bookings-popular-sports-see-more/${cat_id}`,
                                                            state: {data: popularSports}}} className='btn fm-btn-white'>See All</Link>
                                            </Col>
                                        </Row> :
                                        <Fragment>
                                            <NoContentFound />
                                        </Fragment>
                                    }
                                </div>}
                                {popularTeams.length !== 0 &&
                                    <div className='wrap-inner  popular_team'>
                                        
                                        <Title level={1} className='fm-block-title'>
                                            {'Popular Teams'}
                                        </Title>
                                        
                                        <Row gutter={[19, 19]}>
                                        <OwlCarousel className='owl-theme' loop margin={10} items={5} nav>
                                          {popularTeams.map((team) => {
                                                    return (
                                                    <div className='item'>
                                                        <img src={popularLogo[`${team.label}`] ? `${BASE_URL}/upload_images/teams/${popularLogo[`${team.label}`]}` : team.image} alt='' width="100" height="100"/>
                                                        <span>{team.label}</span>
                                                    </div>)
                                                })}
                                            </OwlCarousel>
                                        </Row>
                                       
                                    </div>
                                }
                                {sportsCountryList.length !== 0 &&
                                    <div className='wrap-inner  fm-cities-cards sports-main'>
                                        
                                        <Title level={1} className='fm-block-title'>
                                            {'Top Cities'}
                                        </Title>
                                        <h3 className='fm-sub-title'>{'We offer everyday deals.'}</h3>
                                        <Row gutter={[19, 19]}>

                                        </Row>
                                        {sportsCountryList && sportsCountryList.length !== 0 ?
                                            <Row gutter={[19, 19]}>
                                                {this.renderTopCities(sportsCountryList)}
                                            </Row> : <NoContentFound />}
                                    </div>
                                }
                                {/* <PopularSearchList parameter={parameter} /> */}
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
        // topCities: bookings && bookings.sportsCountryList
        bookings
    };
};
export default connect(
    mapStateToProps,
    { getCityList, getpopularteamLogos, getLogo, getPopularTeamsList, getBannerById, openLoginModel, enableLoading, disableLoading, getSportsList, getSportsEventList, getSportsCityList }
)(SportsLandingPage);