
import React from 'react';
import {
    List,
    Rate,
    Row,
    Col,
    Avatar,
    Link,
    Typography
} from 'antd';
import { connect } from 'react-redux';
import { likeThisReview, getClassfiedCategoryDetail, openLoginModel } from '../../../actions/index'
import { converInUpperCase, dateFormat4 } from '../../common'
import { LikeOutlined, LikeTwoTone } from '@ant-design/icons';
import { withRouter } from 'react-router';
import ReportReview from './modals/ReportReview'
import UpdateReviewModel from './modals/LeaveReviewModel'
const { Text, Title } = Typography;


class ReviewList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seeMore: false,
            list: [],
            classifiedDetail: '',
            reportReviewModel:false,
            selectedReview: '',
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
            is_like: Number(item.is_review_like) === 1 ? 0 : 1
        }
        this.props.likeThisReview(reqData, () => {
            this.props.likeReviewCallback()
        })
    }

    /**
     * @method getDetails
     * @description get classified details
     */
    getDetails = () => {
        let classified_id = this.props.match.params.classified_id
        const { isLoggedIn, loggedInDetail } = this.props
        let reqData = {
            id: classified_id,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getClassfiedCategoryDetail(reqData, (res) => {
            this.setState({ classifiedDetail: res.data.data, })
        })
    }

     /**
     * @method handleReportReview
     * @description handle report review
     */
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
        const {isLoggedIn, loggedInDetail, userList, classifiedDetail } = this.props
        console.log('userList: ### ', userList);
        const {editReviewModel,selectedReview,reportReviewModel, seeMore } = this.state
        let temp = [];
        if (userList.length <= 4) {
            temp = userList.slice(0, userList.length);
        } else {
            let len = !this.state.seeMore ? 4 : userList.length;
            temp = userList.slice(0, len);
        }
        return (
            <div className='review-detail-block'>
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
                            {item.rating === 1 && <Rate disabled defaultValue={1} className='fs-16 mb-7' />}
                            {item.rating === 2 && <Rate disabled defaultValue={2} className='fs-16 mb-7' />}
                            {item.rating === 3 && <Rate disabled defaultValue={3} className='fs-16 mb-7' />}
                            {item.rating === 4 && <Rate disabled defaultValue={4} className='fs-16 mb-7' />}
                            {item.rating === 5 && <Rate disabled defaultValue={5} className='fs-16 mb-7' />}
                            <List.Item.Meta
                                title={
                                    <a href='javascript:viod(0)'>
                                        by <u>{item.reviews_bt_users && converInUpperCase(item.reviews_bt_users.name)}</u>                                  
                                        <span className='date'>{dateFormat4(item.created_at)}</span>
                                        <span className='report-review' style={{cursor:'pointer'}} 
                                            onClick={() => this.handleReportReview(item)}
                                        >Report review</span>
                                    </a>}
                                description={<div>
                                    <div className='review-discrip-heading'>{item.title} <img src={require('../../../assets/images/hand-img.png')} alt='' /></div>
                                    {item.review}
                                    <div className='review-like-dislike'>
                                    {item.is_review_like ? <LikeTwoTone onClick={() => {
                                        if (this.props.isLoggedIn) {
                                            this.likeReview(item)
                                        } else {
                                            this.props.openLoginModel()
                                        }
                                    }} /> : <LikeOutlined  onClick={() => {
                                        if (this.props.isLoggedIn) {
                                            this.likeReview(item)
                                        } else {
                                            this.props.openLoginModel()
                                        }
                                    }} />}
                                    <span>{item.no_of_votes_count}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    {isLoggedIn && item.user_id === loggedInDetail.id && <span className='blue-link' style={{cursor:'pointer'}} 
                                        onClick={() => this.updateReview(item)}
                                    >Edit</span>}
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
                        classifiedDetail={classifiedDetail && classifiedDetail}
                        selectedReview={selectedReview}
                />}
                {editReviewModel &&
                    <UpdateReviewModel
                        visible={editReviewModel}
                        onCancel={() => this.setState({editReviewModel: false})}
                        classifiedDetail={classifiedDetail && classifiedDetail}
                        selectedReview={selectedReview}
                        callNext={this.props.likeReviewCallback}
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
export default connect(mapStateToProps, { likeThisReview, getClassfiedCategoryDetail, openLoginModel })(withRouter(ReviewList));



