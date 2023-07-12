import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Divider, Rate, Typography, Pagination, Layout, Card, Button, Avatar, Row, Col } from 'antd'
import { enableLoading, disableLoading, foundUserAdsAPI, getClassfiedCategoryDetail } from '../../actions'
import 'ant-design-pro/dist/ant-design-pro.css';
import { UserOutlined } from '@ant-design/icons';
import DetailCard from '../common/Card'
import NoContentFound from '../common/NoContentFound'
import { rating } from './CommanMethod'
import AppSidebarInner from '../sidebar/SidebarInner';
import history from '../../common/History';
import ContactModal from './common/modals/ContactModal'
import { capitalizeFirstLetter } from '../common'
const { Title, Paragraph, Text } = Typography;

class FoundAds extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userAdsDetails: '',
            adsList: [],
            classifiedDetail: '',
            seeAll: false,
            visible: false
        };
    }

    /**
     * @method componentDidMount
     * @description caller after render the component  
     */
    componentDidMount() {
        this.props.enableLoading()
        this.getDetails()
    }

    /**
     * @method getDetails
     * @description get classified details
     */
    getDetails = () => {
        let classified_id = this.props.match.params.item_id
        const { isLoggedIn, loggedInUser } = this.props
        let reqData = {
            id: classified_id,
            user_id: isLoggedIn ? loggedInUser.id : ''
        }

        this.props.getClassfiedCategoryDetail(reqData, (res) => {
            if (res.status === 200) {
                let wishlist = res.data.data && res.data.data.wishlist === 1 ? true : false
                const { loggedInUser } = this.props;
                let reqData = {
                    user_id: res.data.data.classified_users.id,
                    id: loggedInUser.id
                }

                this.props.foundUserAdsAPI(reqData, res => {
                    this.props.disableLoading()
                    if (res.status === 200) {
                        let data = res.data
                        this.setState({ userAdsDetails: data.classified_users, adsList: data.data })
                    }
                })
                this.setState({ classifiedDetail: res.data.data, allData: res.data, is_favourite: wishlist })
            }
        })
    }

    /**
    * @method renderCard
    * @description render card details
    */
    renderCard = (categoryData) => {
        const { seeAll } = this.state
        let filter = this.props.match.params.filter
        if (categoryData && categoryData.length) {
            let data = seeAll ? categoryData : categoryData.slice(0,12)
            return (
                <Fragment>
                    <Row gutter={[38, 38]}>
                        {data && data.map((data, i) => {
                            return (
                                <DetailCard
                                    data={data} key={i}
                                    retail={filter === 'retail' ? true : false}
                                />
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
     * @method render
     * @description render component  
     */
    render() {
        let cat_id = this.props.match.params.categoryId
        let cat_name = this.props.match.params.categoryName
        const { userAdsDetails, adsList, classifiedDetail, seeAll, visible } = this.state
        const total = adsList && adsList.length ? adsList.slice(0, 9).length : 0
        let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
        return (
            <Layout>
                {/* <AppSidebarInner history={history} activeCategoryId={cat_id} moddule={1} /> */}
                <Layout className="wrap-inner">
                    <Card className="profile-ads-card mb-20">
                        <Row gutter={[20, 20]}>
                            <Col md={5}>
                                <Avatar
                                    src={userAdsDetails &&
                                        userAdsDetails.userimage ?
                                        userAdsDetails.userimage :
                                        <Avatar size={54} icon={<UserOutlined />} />}
                                    size={64}
                                />
                            </Col>
                            <Col md={13}>
                                <div className="sub-tiitle blue-text pb-0">
                                    <Text className="fs-20 blue-text">Advertisor </Text>
                                    {/* {classifiedDetail && capitalizeFirstLetter(classifiedDetail.title)} */}
                                </div>
                                <Text>{rate ? rate : 'No reviews yet'}</Text>
                                {rate && <Rate disabled defaultValue={rate ? rate : ''} />}
                                {/* 3.0 <img className="pl-3" src={require('../../assets/images/star-review.png')}/> */}
                                <Title level={4} className="mb-0">{userAdsDetails && userAdsDetails.name}</Title>
                                <div className="fs-10" style={{ color: '#90A8BE' }}>{`(Member since : ${classifiedDetail && classifiedDetail.classified_users.member_since})`}</div>
                            </Col>
                            <Col md={6} style={{ textAlign: '-webkit-right' }}>
                                <Button type="primary" className="" onClick={() => this.setState({ visible: true })}> Contact</Button>
                            </Col>
                        </Row>
                    </Card><br />
                    <Row className="grid-block">
                        <Col md={12}> <Title level={4} className="mb-0 light-blue">{`${adsList.length} Ads Found`}</Title></Col>
                        <Col md={12} className="text-right"> <Text className="mb-0 light-blue">{`Showing ${total} of ${adsList.length}`}</Text></Col>
                    </Row>
                    <Divider className="mt-3" />
                    {this.renderCard(adsList)}
                    <div className="see-all-wrap">
                        {adsList && adsList.length > 9 && (
                            <Button
                                type="default"
                                size={"middle"}
                                // onClick={() => {
                                //   this.props.history.push(
                                //     `/see-more-user-ads/${cat_id}`
                                //   );
                                // }}
                                onClick={() => this.setState({ seeAll: !this.state.seeAll })}
                            >
                                {seeAll ? "Show Less" : 'Show More'}
                            </Button>
                        )}
                    </div>
                </Layout>
                {visible &&
                    <ContactModal
                        visible={visible}
                        onCancel={() => this.setState({ visible: false })}
                        contactType={cat_name === 'realstate' ? 'realstate' : ''}
                        classifiedDetail={classifiedDetail && classifiedDetail}
                        receiverId={classifiedDetail.classified_users ? classifiedDetail.classified_users.id : ''}
                        classifiedid={classifiedDetail && classifiedDetail.id}
                    />}
            </Layout>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, profile } = store;

    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
    };
};
export default connect(
    mapStateToProps,
    { enableLoading, disableLoading, foundUserAdsAPI, getClassfiedCategoryDetail }
)(FoundAds)
