import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import { Link } from 'react-router-dom'
import { Typography,List,Avatar,Row,Col,Button,Rate,Select } from 'antd';
import {voteRetailFeedback, openLoginModel } from '../../../actions'
import { LikeOutlined, DislikeOutlined, UserOutlined,HeartOutlined,MailOutlined, LikeTwoTone} from "@ant-design/icons";
import LeaveFeedbackModel from '../retail-categories/product-review/LeaveFeedbackModel'
import {displayDateTimeFormate, dateFormat4,dateFormate5,roundToTwo } from "../../common";
import ReportFeedback from '../../vendor/retail/vendor-reviews/ReportReview'
const { Text, Title } = Typography;
const { Option } = Select;

class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackModel: false,
            isFilter: false,
            filteredData: [],
            selectedLabel: 'All Feedback',
            isUserExits: false,
            allStarData: [],
            reviewData: [],
            value: 5,
            report_review: false,
            selectedFeedback: ''
        };
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let updatedList = nextprops.classifiedDetail
        console.log('updatedList: ', updatedList);
        this.handleRatingChange(updatedList)

    }

    /**
   * @method componentWillMount
   * @description get selected categorie details
   */
    componentDidMount() {
        const { classifiedDetail } = this.props
        console.log('data', classifiedDetail)
        this.setState({ reviewData: classifiedDetail && classifiedDetail.feedbacks })
        this.checkReviewAdded()
    }

    checkReviewAdded = () => {
        const {isLoggedIn, loggedInDetail, classifiedDetail } = this.props
        let hmReview = classifiedDetail && classifiedDetail.feedbacks && Array.isArray(classifiedDetail.feedbacks) && classifiedDetail.feedbacks.length ? classifiedDetail.feedbacks : []
        if (isLoggedIn && hmReview && hmReview.length) {
            hmReview.some((el) => {
                if (el.feedback_user && el.feedback_user.id === loggedInDetail.id) {
                    this.setState({ isUserExits: true, reviewModel: false })
                }
            });
        }
    }

    /**
       * @method contactModal
       * @description contact model
       */
    leaveReview = () => {
        const { classifiedDetail, loggedInDetail, isLoggedIn } = this.props
        let hmReview = classifiedDetail && classifiedDetail.feedbacks && Array.isArray(classifiedDetail.feedbacks) && classifiedDetail.feedbacks.length ? classifiedDetail.feedbacks : []
        if (isLoggedIn) {
            if (hmReview && hmReview.length) {
                hmReview.some((el) => {
                    if (el.feedback_user && el.feedback_user.id === loggedInDetail.id) {
                        toastr.warning('warning', 'You have already added your feedback.')
                        this.setState({ isUserExits: true, feedbackModel: false })
                    } else {
                        this.setState({ isUserExits: false, feedbackModel: true })
                    }
                });
            } else if (hmReview.length === 0) {
                this.setState({ isUserExits: false, feedbackModel: true })
            }

        } else {
            this.props.openLoginModel()
        }
    };

    /**
     * @method contactModal
     * @description contact model
     */
    handleReportReview = (item) => {
        const {isLoggedIn } = this.props
        if (isLoggedIn) {
            this.setState({report_review: true, selectedFeedback: item})
        } else {
            this.props.openLoginModel()
        }
    };

    /**
     * @method handleCancel
     * @description handle cancel
     */
    handleCancel = () => {
        this.setState({
            feedbackModel: false,
            report_review: false
        });
    };


    /**
      * @method handleRatingChange
      * @description handle rating change
      */
    handleRatingChange = (list) => {
        const data = list.feedbacks ? list.feedbacks : [];
        this.setState({
            reviewData: data
        })
    }

     /**
    * @method filterRating
    * @description filter rating
    */
    filterRating = () => {
        return (
            <Select
                defaultValue='New - Old'
                size='large'
                className='w-100 mb-15 shadow-select'
                style={{minWidth: 160}}
                onChange={(e) => {
                    this.props.getDetails(e)
                    this.setState({ selectedLabel: e === 'recent' ? 'New - Old' : 'Old - New' })
                }}
            >
                <Option value={'recent'}>New - Old</Option>
                <Option value={'old'}>Old - New</Option>
            </Select>
        )
    } 
    
    /**
     * @method likeReview
     * @description like this review
     */
     likeReview = (item) => {
        const { loggedInDetail } = this.props;
        let reqData = {
            user_id: loggedInDetail.id,
            feedback_id: item.id,
            is_like: item.is_feedback_like === 1 ? 0 : 1
        }
        this.props.voteRetailFeedback(reqData, () => {
            this.props.getDetails()
        })
    }

    /**
     * @method renderFeedbacks
     * @description render feedback
     */
    renderFeedbacks = (feedback) => {
        const { seeMore } = this.state
        console.log('feedback', feedback)
        return (
          <div className="review-detail-block">
                <List
                    itemLayout='vertical'
                    dataSource={feedback && feedback}
                    renderItem={el => (
                        <List.Item>
                            <Rate disabled value={(Number(el.accurate_description) + Number(el.communication) + Number(el.postage_speed) + Number(el.reasonable_postage_costs))/4} className='fs-16 mb-7' />
                            <List.Item.Meta
                                title={
                                    <a href='javascript:viod(0)'>
                                        by <u>{el.feedback_user ? el.feedback_user.name : ''}</u><br/> 
                                        <span 
                                            className="report-review blue-link" 
                                            onClick={()=> this.handleReportReview(el)}
                                        >Report review</span>                                 
                                    </a>}
                                description={
                                <div>
                                    <div className="review-discrip-heading">{el.title} <img src={require('../../../assets/images/hand-img.png')} alt='' /></div>
                                    <p className="review-discrip-content">{el.comment}</p>
                                        <div className="retail-review-like-dis-parent-block">
                                            <div className="review-like-dislike mt-0">
                                                {el.is_feedback_like ? <LikeOutlined onClick={() => {
                                                    if (this.props.isLoggedIn) {
                                                        this.likeReview(el)
                                                    } else {
                                                        this.props.openLoginModel()
                                                    }
                                                }} /> : <LikeOutlined onClick={() => {
                                                    if (this.props.isLoggedIn) {
                                                        this.likeReview(el)
                                                    } else {
                                                        this.props.openLoginModel()
                                                    }
                                                }} />}
                                                <span>{el.no_of_votes_count}</span>
                                            </div>
                                            <div className="review-date-detail">                                                        
                                                <span className="date">{`${el.replies_count} Comment`}</span>
                                            </div>
                                            <div className="review-date-detail">             
                                                <h5>Published on</h5>
                                                <span className="date">{dateFormat4(el.published_on)}</span>
                                            </div>
                                            <div className="review-date-detail">                                                        
                                                <h5>Ad No.</h5>
                                                <span className="date">{el.retail_ad ? `Ad-${el.retail_ad.id}` : ''}</span>
                                            </div>
                                            <br/>
                                        </div>
                                        {el.replies && Array.isArray(el.replies) && el.replies.length !==0 &&
                                        <div className="response-from-seller-container">
                                            <div className="review-discrip-heading">
                                                Response from seller 
                                            </div>
                                            <span>{el.replies[0] && displayDateTimeFormate(el.replies[0].created_at)}</span>
                                            <p className="review-discrip-content">
                                                hi {el.feedback_user ? el.feedback_user.name : ''}<br/>
                                                {el.replies[0] && el.replies[0].reason ? el.replies[0].reason : 'Thank you for your feedback.'}
                                            </p>
                                            {el.replies[0].is_feedback_like ? <LikeOutlined onClick={() => {
                                                // if (this.props.isLoggedIn) {
                                                //     this.likeReview(el.replies[0])
                                                // } else {
                                                //     this.props.openLoginModel()
                                                // }
                                            }} /> : <DislikeOutlined onClick={() => {
                                                // if (this.props.isLoggedIn) {
                                                //     this.likeReview(el.replies[0])
                                                // } else {
                                                //     this.props.openLoginModel()
                                                // }
                                            }} />}
                                               <span>{el.replies[0] && el.replies[0].no_of_votes_count}</span>
                                        </div>}
                                    </div>}
                                />
                        </List.Item>
                    )}
                />
                <div className='align-right'>
                    {feedback && feedback.length > 4 && <div className='red-link' style={{cursor:'pointer'}} onClick={() => this.setState({seeMore: true})}>{seeMore === false && 'Show More'}</div>}
                </div>
            </div>        
        )
    }

    /**
     * @method getAverageFeedback
     * @description get average feedback
     */
    getAverageFeedback = (key) => {
        const { classifiedDetail } = this.props
        let accurate_description = 0, communication = 0, reasonable_postage_costs = 0,postage_speed = 0, total = 0; 
        let feedback = classifiedDetail && classifiedDetail.feedbacks && Array.isArray(classifiedDetail.feedbacks) && classifiedDetail.feedbacks.length ? classifiedDetail.feedbacks : ''
        if(feedback){
          feedback.map(el => {
            accurate_description = accurate_description + el.accurate_description
            communication = communication + el.communication
            reasonable_postage_costs = reasonable_postage_costs + el.reasonable_postage_costs
            postage_speed = postage_speed + el.postage_speed
          })
        }
        let sum = Number(accurate_description) + Number(communication) + Number(reasonable_postage_costs) + Number(postage_speed)
        if(key === 'accurate_description'){
          return accurate_description/5
        }else if(key === 'communication'){
          return communication/5
        }else if(key === 'reasonable_postage_costs'){
          return reasonable_postage_costs/5
        }else if(key === 'postage_speed'){
          return postage_speed/5
        }else if(key === 'total_average'){
          return total = (sum)/5
        }
    }
 

    /**
     * @method render
     * @description render component
     */
    render() {
        const {selectedFeedback, report_review,isUserExits, feedbackModel, selectedLabel,reviewData } = this.state;
        const {cat_id, isLoggedIn, classifiedDetail } = this.props;
        let avg = classifiedDetail && classifiedDetail.feedbacks_avg_reviews
               
        return (
            <div>
            <Row>
                <Col span={12}>
                    <div className="reviews-content-left">
                        <div className="reviews-content-left">
                        <div className="reviews-content-avatar">
                            <Avatar
                                src={classifiedDetail.classified_users &&
                                classifiedDetail.classified_users.image_thumbnail ?
                                classifiedDetail.classified_users.image_thumbnail :
                                <Avatar size={54} icon={<UserOutlined />} />}
                                size={71}
                            />
                            </div>
                            <div class="reviews-content-avatar-detail">
                            <h4>{classifiedDetail.classified_users && classifiedDetail.classified_users.name}</h4>
                            {classifiedDetail.classified_users && <p>{`Member since  ${dateFormate5(classifiedDetail.classified_users.created_at)} Based in ${classifiedDetail.classified_users.business_state_id ? classifiedDetail.classified_users.business_state_id : ''}`}</p>}
                            {classifiedDetail &&  <a className="underline">
                            {isLoggedIn ? <Link to={`/user-ads-retail/${'retail'}/${cat_id}/${classifiedDetail.id}`}>{`${classifiedDetail.usercount} listings from this seller`}</Link> :
                                <span onClick={() => this.props.openLoginModel()}>{`${classifiedDetail.usercount} listings from this seller`}</span>}
                            </a>}
                            <div className="d-flex">
                                <HeartOutlined />
                                <MailOutlined />
                            </div>
                            </div>
                        </div>
                    </div>
                </Col>
                </Row>
                <Row className="reviews-content seller-info-inner-left-content">
                    {/* inner content:Start */}
                    <Col md={24}>
                    <Row>
                        <Col md={9}> 
                            <div className="product-ratting">
                                <h4 className="no-review-text">Feedback Rating for this seller</h4>                                            
                                    <Rate allowHalf  disabled value={avg ? roundToTwo(avg.overall_average) : 0} />                                          
                                <p>Average Feedback <strong>{avg ? roundToTwo(avg.overall_average) : 0}</strong> of 5.0 from {classifiedDetail && classifiedDetail.feedbacks ? classifiedDetail.feedbacks.length : '0'} reviews</p>
                                <span className="custom-br"></span>
                                <div className="pro-ratting-label">
                                    <ul>
                                        <li>
                                        <label>Accurate description</label>
                                            <div className="rate-for-pro">
                                                <Rate allowHalf disabled value={avg ? roundToTwo(avg.accurate_description_avg) : 0} /> 
                                                <span className="rating-digit">{avg ? roundToTwo(avg.accurate_description_avg) : 0}</span>
                                            </div>
                                        </li>
                                        <li>
                                            <label>Reasonable postage costs</label>
                                            <div className="rate-for-pro">
                                                <Rate allowHalf disabled value={avg ? roundToTwo(avg.reasonable_postage_costs_avg) : 0} />
                                                <span className="rating-digit">{avg ? roundToTwo(avg.reasonable_postage_costs_avg) : 0}</span>
                                            </div>
                                        </li>
                                        <li>
                                        <label>Postage speed</label>
                                        <div className="rate-for-pro">
                                            <Rate allowHalf disabled value={avg ? roundToTwo(avg.postage_speed_avg) : 0} /> 
                                                <span className="rating-digit">{avg ? roundToTwo(avg.postage_speed_avg) : 0}</span>
                                            </div>
                                        </li>
                                        <li>
                                        <label>Communication</label>
                                        <div className="rate-for-pro">
                                            <Rate allowHalf disabled value={avg ? roundToTwo(avg.communication_avg) : 0} />
                                                <span className="rating-digit">{avg ? roundToTwo(avg.communication_avg) : 0}</span>
                                        </div> 
                                        </li>                                                       
                                    </ul>
                                </div>                                          
                                <span className="custom-br"></span>                                           
                                </div>                              
                                <div className='reviews-rating-status-right'>                    
                                    <Button
                                        type='default'
                                        htmlType={'button'}
                                        className='w-100 leave-review-btn'
                                        onClick={this.leaveReview}
                                        disabled={isUserExits ? true : false}
                                    >
                                        {'Leave feedback'}
                                    </Button>
                                </div>
                            </Col>
                        <Col md={1}>&nbsp;</Col>
                        <Col md={14} className="classified-all-review">
                         <Row gutter={0} align="middle">
                            <Col md={14}>
                
                            <Title level={3} className='text-gray mb-3 total-revies'>
                                {selectedLabel && `${selectedLabel} (${reviewData ? reviewData.length : '0'})`}
                            </Title>
                            </Col>
                            <Col md={1}></Col>
                            <Col md={9} className="filterRatingSelect">
                                {this.filterRating()}
                            </Col>
                        </Row>
                            {reviewData && this.renderFeedbacks(reviewData)}
                        </Col>
                    </Row>
                    </Col>
                    {feedbackModel && <LeaveFeedbackModel
                        classifiedDetail={classifiedDetail}
                        visible={feedbackModel}
                        onCancel={this.handleCancel}
                        callNext={this.props.getDetails}
                    />}
                    {report_review && 
                        <ReportFeedback
                            classifiedDetail={classifiedDetail}
                            visible={report_review}
                            onCancel={this.handleCancel}
                            callNext={this.props.getDetails}
                            is_user={true}
                            selectedReview={selectedFeedback}
                        />
                    }
                </Row>
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

export default connect(mapStateToProps, {voteRetailFeedback, openLoginModel })(Review);
