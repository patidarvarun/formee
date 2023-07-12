import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../common/Sidebar';
import { Layout, Card, Row, Col,Typography } from 'antd';
import Icon from '../../customIcons/customIcons';
import {getSportsList, openLoginModel, enableLoading, disableLoading, getSportsEventList } from '../../../actions';
import history from '../../../common/History';
import NoContentFound from '../../common/NoContentFound'
import { capitalizeFirstLetter } from '../../common'
import { BASE_URL } from "../../../config/Config"
import '../booking.less'
const { Content } = Layout;
const { Title } = Typography;

class PopularSportsSeeAll extends React.Component {

    constructor(props) {
        super(props);
        const { data } = props.location.state;
        this.state = {
            key: 'tab1',
            page: 1,
            popularSports: data
        };
    }

    /**
    * @method componentWillMount
    * @description called before mounting the component
    */
    componentWillMount() {
        const parameter = this.props.match.params;
        this.props.enableLoading()
        let cat_id = this.props.match.params.categoryId
        //this.getPopularEvents(1000)// for now we passed sports id static need to change dynamically
        this.getAllEvents();
    }

    /**
     * @method getPopularEvents
     * @description get all popular events
     */
     getAllEvents = (cat_id) => {
        this.props.getSportsEventList({ country:1002, city:1005 }, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                let data = res.data && res.data.data && res.data.data.all && res.data.data.all.data
               if (data) {
                    let sportsList = data && Array.isArray(data.item) && data.item.length ? data.item : []
                    if(sportsList.length !== 0){
                        this.gettheLogo(sportsList)
                    }
               }
            }
        })
    }

    gettheLogo = (sportsList) => {
        let tmp = []
        sportsList.map((el) => {
            this.props.getLogo({
                home_team_name: el.home_team_caption,
                away_team_name: el.away_team_caption,
                team_sport: el.sport.includes("Soccer") ? "Soccer" : el.sport
            }, res1 => {
                if (res1.status === 200) {
                    console.log("🚀 ~ file: index.js ~ line 153 ~ SportsLandingPage ~ tmp ~ res1", res1)
                    let home = res1.data && res1.data.home_team && res1.data.home_team.length > 0 ? res1.data.home_team[0].team_logo_small : null
                    let away = res1.data && res1.data.away_team && res1.data.away_team.length > 0 ? res1.data.away_team[0].team_logo_small : null
                    el.home_team = home;
                    el.away_team = away;
                    tmp.push(el)
                    this.setState({popularSports: tmp})
                }
            })
        }
        )
    }

     /**
     * @method getPopularEvents
     * @description get all popular events
     */
    getPopularEvents = (cat_id) => {
        this.props.getSportsList({sporttypeid:cat_id }, res => {
            this.props.disableLoading()
            if(res.status === 200){
                
                let data = res.data && res.data.data && res.data.data.all && res.data.data.all.data
                if(data){
                    let sportsList = data && Array.isArray(data.item) && data.item.length ? data.item : []
                    this.setState({popularSports: sportsList})
                }
            }
        })
    }

     /** 
    * @method renderPopularSportsEvents
    * @description render popular sports events
    */
    renderPopularSportsEvents = (popularSports) => {
        return popularSports && popularSports.map((el, i) => {
            let tmp2 = el.vname.split("-vs-")
            let t1 = tmp2[0].replaceAll("-", "_")
            let t2 = tmp2[1].replaceAll("-", "_")
            let image = `${el.image}`
            return (
                // <Col span={6}>
                //     <div className='fm-card-block'>
                //         <div className='ad-banner'>
                //             <img src={require('../../../assets/images/australian-open.png')} alt='' />
                //         </div>
                //         <div className='fm-desc-stripe'>
                //             <Row>
                //                 <Col span={12}>
                //                     <h2>{capitalizeFirstLetter(el.caption)}</h2>
                //                 </Col>
                //                 <Col span={12} className='text-right'>
                //                     <Link to='' className='ad-banner'>Get ticket <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                //                 </Col>
                //             </Row>
                //         </div>
                //     </div>
                // </Col>
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
                                        }} className='get-tickets'>Get tickets</Link>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            )
        })
    }

    /**
    * @method render
    * @description render components
    */
    render() {
        const parameter = this.props.match.params;
        let cat_id = parameter.categoryId;
        const { popularSports } = this.state
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing">
                <Layout className="yellow-theme common-left-right-padd">
                    <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} showDropdown={false}/>
                    <Layout className="right-parent-block">
                        <div className='sub-header fm-details-header'>
                            <Title level={4} className='title'>{'SPORT TICKETS'}</Title>
                        </div>
                        <Content className='site-layout'>
                            <div className='wrap-inner'>
                                <Card
                                    // title={`Popular Sports Events`}
                                    bordered={false}
                                    className={'home-product-list'}
                                >
                                    {popularSports && popularSports.length !==0 ? (
                                        <div className='wrap-inner fm-gradient-bg sports-main'>
                                        <Title level={1} className='fm-block-title'>
                                            {'Popular Sport Events'}
                                        </Title>
                                        <br />
                                            <Row gutter={[16, 16]}>
                                                {this.renderPopularSportsEvents(popularSports)}
                                            </Row>
                                    </div>
                                    ) :
                                    (<Fragment><NoContentFound/></Fragment>)
                                        // <Row gutter={[16, 16]}>
                                        //     {this.renderPopularSportsEvents(popularSports)}
                                        // </Row>:
                                    }
                                </Card>
                            </div>

                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, common } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default connect(
    mapStateToProps,
    {getSportsList,openLoginModel, enableLoading, disableLoading , getSportsEventList}
)(PopularSportsSeeAll);