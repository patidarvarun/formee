import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Typography,
    List,
    Rate,
    Avatar
} from 'antd';
import {displayDateTimeFormate, capitalizeFirstLetter, converInUpperCase, dateFormat4 } from '../../common';
import {LikeTwoTone, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { voteBookingReview, openLoginModel } from '../../../actions'
import ReportReview from './ReportBookingReview'
import UpdateReviewModel from './LeaveReviewModel'
const { Text, Title } = Typography;

class ReviewList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        seeMore: false,
        list:[],
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
            rating_id: item.id,
            is_like: item.no_of_votes && item.no_of_votes.length && item.no_of_votes[0].is_like  === 1 ? 0 : 1
        }
        this.props.voteBookingReview(reqData, () => {
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
      const {bookingDetail,isLoggedIn, loggedInDetail, userList } = this.props
      
      const {editReviewModel,reportReviewModel, seeMore,selectedReview} = this.state
        let temp = [];
        if (userList.length <= 4) {
            temp = userList.slice(0, userList.length);
        } else {
            let len = !this.state.seeMore ? 4 : userList.length;
            temp = userList.slice(0, len);
        }
        return (
            <div className="review-detail-block">
                {}
            <List
                itemLayout='vertical'
                dataSource={temp && temp}
                renderItem={item => (
                    <List.Item>
                        <Rate disabled value={item.rating} className='fs-16 mb-7' />
                        <List.Item.Meta
                            // avatar={<Avatar
                            //     src={item.rated_by &&
                            //         item.rated_by.image ?
                            //         item.rated_by.image :
                            //         'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                            //     }                                                                           
                            //     alt={''}
                            //     size={37}
                            // />}
                            title={
                                <Fragment>
                                    <a href='javascript:viod(0)'>
                                        by <u>{item.rated_by && converInUpperCase(item.rated_by.name)}</u>                                  
                                        <span className="date">{dateFormat4(item.created_at)}</span>
                                    </a>
                                    <a href='javascript:viod(0)' 
                                        className="blue-link"
                                        style={{cursor:'pointer'}} 
                                        onClick={() => this.handleReportReview(item)}
                                    >Report review</a>
                                </Fragment>
                                }
                            description={<div>
                                <div className="review-discrip-heading">
                                    {item.title}
                                    {/* {'Good quality, same as pic'}{' '} */}
                                    <img src={require('../../../assets/images/hand-img.png')} alt='' />
                                </div>
                                <div className="review-discrip-content">
                                    {item.review}
                                </div>
                                <div className="review-discrip-comment">
                                    {item.no_of_votes && item.no_of_votes.length && item.no_of_votes[0].is_like ? 
                                    <LikeTwoTone style={{ fontSize: '16px' }} onClick={() => {
                                        if (this.props.isLoggedIn) {
                                            this.likeReview(item)
                                        } else {
                                            this.props.openLoginModel()
                                        }
                                    }} /> : <LikeOutlined style={{ fontSize: '16px' }} onClick={() => {
                                        if (this.props.isLoggedIn) {
                                            this.likeReview(item)
                                        } else {
                                            this.props.openLoginModel()
                                        }
                                    }} />}
                                    <Text>{item.no_of_votes && item.no_of_votes.length}&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                    {isLoggedIn && item.customer_id === loggedInDetail.id && 
                                    <span className="blue-link" style={{cursor:'pointer'}} 
                                        onClick={() => this.updateReview(item)}
                                    >Edit</span>
                                    } 
                                </div>
                                {item.replies && Array.isArray(item.replies) && item.replies.length !==0 &&
                                        <div>
                                            <div className="review-discrip-heading">
                                                Response from seller 
                                            </div>
                                            <span>{item.replies[0] && displayDateTimeFormate(item.replies[0].created_at)}</span>
                                            <p className="review-discrip-content">
                                                hi<br/>
                                                {item.replies[0] && item.replies[0].reason ? item.replies[0].reason : 'Thank you for your feedback.'}
                                            </p>
                                            {/* {item.replies[0].is_feedback_like ? <LikeOutlined onClick={() => {
                                                // if (this.props.isLoggedIn) {
                                                //     this.likeReview(item.replies[0])
                                                // } else {
                                                //     this.props.openLoginModel()
                                                // }
                                            }} /> : <DislikeOutlined onClick={() => {
                                                // if (this.props.isLoggedIn) {
                                                //     this.likeReview(item.replies[0])
                                                // } else {
                                                //     this.props.openLoginModel()
                                                // }
                                            }} />} */}
                                               <span>{item.replies[0] && item.replies[0].no_of_votes_count}</span>
                                        </div>}
                            </div>}
                        />
                    </List.Item>
                )}
            />
            <div className='align-right'>
                {userList && userList.length > 4 && <a href="javascript:void(0)" className='blue-link'  onClick={() => this.setState({seeMore: true})}>{seeMore === false && <span>Show More</span>}</a>}
            </div>
            {reportReviewModel &&
                <ReportReview
                    visible={reportReviewModel}
                    onCancel={() => this.setState({reportReviewModel: false})}
                    selectedReview={selectedReview}
                />}
            {editReviewModel &&
                <UpdateReviewModel
                    visible={editReviewModel}
                    onCancel={() => this.setState({editReviewModel: false})}
                    selectedReview={selectedReview}
                    callNext={this.props.callNext}
                    bookingDetail={bookingDetail}
                    type={'restaurant'}
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
  
  export default connect(mapStateToProps, {voteBookingReview,openLoginModel})(ReviewList);