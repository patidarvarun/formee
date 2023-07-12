import React from 'react';
import { withRouter } from 'react-router';
import {
    List,
    Rate,
    Row,
    Col,
    Typography
} from 'antd';
import { connect } from 'react-redux';
import { likeUnlikeReview, getRetailCategoryDetail, openLoginModel } from '../../../../actions/index'
import { converInUpperCase, dateFormat4 } from '../../../common'
import { LikeOutlined, LikeTwoTone } from '@ant-design/icons';
import ReportReview from '../../../classified-templates/common/modals/ReportReview'
import UpdateReviewModel from './LeaveReviewModel'
const { Text, Title } = Typography;


class ReviewList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seeMore: false,
            list: [],
            classifiedDetail: '',
            selectedReview:'',
            reportReviewModel: false,
            editReviewModel: false
        };
    }
    
    /**
     * @method likeReview
     * @description like this review
     */
    likeReview = (item) => {
        const { loggedInDetail } = this.props;
        let reqData = {
            user_id: loggedInDetail.id,
            review_id: item.id,
            is_like: item.no_of_votes && item.no_of_votes.length && item.no_of_votes[0].is_like  === 1 ? 0 : 1
        }
        this.props.likeUnlikeReview(reqData, () => {
            this.props.callNext()
        })
    }

    
    handleReportReview = (item) => {
        const { isLoggedIn } = this.props
        if (isLoggedIn) {
            this.setState({reportReviewModel: true, selectedReview: item})
        } else {
            this.props.openLoginModel()
        }
    }
    
    /**
     * @method updateReview
     * @description update review
     */
     updateReview = (item) => {
        const { isLoggedIn } = this.props
        if (isLoggedIn) {
            this.setState({editReviewModel: true, selectedReview: item})
        } else {
            this.props.openLoginModel()
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const {classifiedDetail, userList, isLoggedIn, loggedInDetail } = this.props
        const {editReviewModel,selectedReview,reportReviewModel, seeMore } = this.state
        console.log(userList,'userList: ### ', selectedReview);
        let temp = [];
        if(userList && Array.isArray(userList)){
            if (userList && userList.length <= 4) {
                temp = userList.slice(0, userList.length);
            } else {
                let len = !this.state.seeMore ? 4 : userList.length;
                temp = userList && userList.slice(0, len);
            }
        }
        return (
            <div className="review-detail-block">
                <Row gutter={0}>
                <Col md={3}></Col>
                <Col md={1}></Col>
                <Col md={20}></Col>
                </Row>
                <List
                    itemLayout='vertical'
                    dataSource={temp && temp}
                    renderItem={item => (
                        <List.Item>
                            {}
                            <Rate disabled value={Number(item.rating)} className='fs-16 mb-7' />
                            <List.Item.Meta
                                title={
                                    <a href='javascript:viod(0)'>
                                        by <u>{item.reviews_bt_users && converInUpperCase(item.reviews_bt_users.name)}</u>                                  
                                        <span className="date">{dateFormat4(item.created_at)}</span>
                                        <span className="report-review" style={{cursor:'pointer'}} 
                                            onClick={() => this.handleReportReview(item)}
                                        >Report review</span>
                                    </a>}
                                    description={<div>
                                    <div className="review-discrip-heading">{item.title} <img src={require('../../../../assets/images/hand-img.png')} alt='' /></div>
                                    {item.review}
                                    <div className="retail-review-like-dis-parent-block">
                                    <div className="review-like-dislike mt-0">
                                    {item.no_of_votes && item.no_of_votes.length && item.no_of_votes[0].is_like ? 
                                    <LikeTwoTone onClick={() => {
                                        if (this.props.isLoggedIn) {
                                            this.likeReview(item)
                                        } else {
                                            this.props.openLoginModel()
                                        }
                                    }} /> : <LikeOutlined onClick={() => {
                                        if (this.props.isLoggedIn) {
                                            this.likeReview(item)
                                        } else {
                                            this.props.openLoginModel()
                                        }
                                    }} />}
                                    <span>{item.no_of_votes_count}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                     {isLoggedIn && item.reviews_bt_users && item.reviews_bt_users.id === loggedInDetail.id && 
                                     <span className="blue-link" style={{cursor:'pointer'}} 
                                        onClick={() => this.updateReview(item)}
                                    >Edit</span>}
                                    </div>
                                    {item.confirmed_purchase && <div className="review-date-detail">             
                                        <h5>Confirmed purchase</h5>
                                        <span className="date">
                                            {dateFormat4(item.confirmed_purchase.date)}
                                        </span>
                                    </div>}
                                     <div className="review-date-detail">                                                        
                                        <h5>Published on</h5>
                                        <span className="date">{dateFormat4(item.created_at)}</span>
                                    </div>
                                    </div>
                                </div>}
                            />
                        </List.Item>
                    )}
                />
                <div className='align-right'>
                    {userList && userList.length > 4 && <div className='show-more-link'  onClick={() => this.setState({ seeMore: true })}>{seeMore === false && 'Show More'}</div>}
                </div>
                {reportReviewModel &&
                    <ReportReview
                    visible={reportReviewModel}
                    onCancel={() => this.setState({reportReviewModel: false})}
                    selectedReview={selectedReview}
                    is_retail={true}
                />}
                 {editReviewModel &&
                    <UpdateReviewModel
                        visible={editReviewModel}
                        onCancel={() => this.setState({editReviewModel: false})}
                        classifiedDetail={classifiedDetail && classifiedDetail}
                        selectedReview={selectedReview}
                        callNext={this.props.callNext}
                />}
            </div>
        );
    }
}
//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
};
export default connect(mapStateToProps, { likeUnlikeReview, getRetailCategoryDetail, openLoginModel })(withRouter(ReviewList));