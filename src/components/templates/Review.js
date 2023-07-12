import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import {
  Typography,
  Row,
  Col,
  Button,
  Rate,
  Select
} from 'antd';
import { openLoginModel } from '../../actions/index'
import LeaveReviewModel from './common/modals/LeaveReviewModel'
import { renderRating, rating, } from './CommanMethod'
import ReviewList from './ReviewList'
const { Text, Title } = Typography;
const { Option } = Select;

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       reviewModel: false,
       isFilter: false,
       filteredData: [],
       label:'Top Reviews', isUserExits: false
    };
  }

//   componentDidMount = () => {
//       const { classifiedDetail,loggedInDetail, isLoggedIn} = this.props
//         let hmReview = classifiedDetail && classifiedDetail.classified_hm_reviews && Array.isArray(classifiedDetail.classified_hm_reviews) && classifiedDetail.classified_hm_reviews.length ? classifiedDetail.classified_hm_reviews : []
//         if(isLoggedIn){
//             this.userExists(hmReview,loggedInDetail.id)
//         }
//     }

  /**
     * @method contactModal
     * @description contact model
     */
    leaveReview = () => {
        const { classifiedDetail,loggedInDetail, isLoggedIn} = this.props
        let hmReview = classifiedDetail && classifiedDetail.classified_hm_reviews && Array.isArray(classifiedDetail.classified_hm_reviews) && classifiedDetail.classified_hm_reviews.length ? classifiedDetail.classified_hm_reviews : []
        if (isLoggedIn) {
            if(hmReview && hmReview.length){
                hmReview.some((el) => {
                    if(el.user_id === loggedInDetail.id){
                        toastr.warning('warning', 'You have already added your review.')
                        this.setState({isUserExits: true,reviewModel: false})
                    }else {
                        this.setState({isUserExits: false, reviewModel: true})
                    }
                });
            }else if(hmReview.length === 0){
                this.setState({isUserExits: false, reviewModel: true})
            }
            
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
            reviewModel: false,
        });
    };


  /**
    * @method handleRatingChange
    * @description handle rating change
    */
    handleRatingChange = (value) => {
        const {classifiedDetail} = this.props;
        let label = 'Five Star'
        if(classifiedDetail){
            const data = classifiedDetail.classified_hm_reviews ? classifiedDetail.classified_hm_reviews : [];
            let filteredData = data && data.length !== 0 && data.filter(el => el.rating == value)
            if(value === 5){
                label = 'Five Star'
            }else if(value === 4){
                label = 'Four Star'
            }else if(value === 3){
                label = 'Three Star'
            }else if(value === 2){
                label = 'Two Star'
            }else if(value === 1){
                label = 'One Star'
            }
            this.setState({filteredData : filteredData, isFilter: true, label: label})
        }
    }

    /**
    * @method filterRating
    * @description filter rating
    */
    filterRating = () => {
        return (
            <Select
                defaultValue='Five Star'
                size='large'
                className='w-100 mb-15 shadow-select'
                style={{minWidth: 160}}
                onChange={this.handleRatingChange}
            >
                <Option value={5}>Five Star</Option>
                <Option value={4}>Four Star</Option>
                <Option value={3}>Three Star</Option>
                <Option value={2}>Two Star</Option>
                <Option value={1}>One Star</Option>
            </Select>
        )
    }

    /**
    * @method getAllStarData
    * @description render all star
    */
    getAllStarData = (data) => {
        let temp = data.classified_hm_reviews && data.classified_hm_reviews.length && data.classified_hm_reviews
        if(temp && temp.length){
            const allStarData = temp && temp.filter(el => el.rating === 5)
            return allStarData
        } 
        else {
            return []
        }  
    }

    userExists = (hmReview,id) =>  {
        if(hmReview && hmReview.length){
            hmReview.some((el) => {
                if(el.user_id === id){
                    this.setState({isUserExits: true})
                }else {
                    this.setState({isUserExits: false})
                }
            });
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { reviewModel, isFilter, label, filteredData,isUserExits } = this.state;
        const { classifiedDetail, retail } = this.props;
        let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
        const allStarData = this.getAllStarData(classifiedDetail && classifiedDetail)
        let totalUser = isFilter ? filteredData.length : allStarData ? allStarData.length : 0
        
        let rateLabel = '';
            if(rate === '5.0'){
                rateLabel = 'Excelent'
            }else if(rate === '4.0'){
                rateLabel = 'Good'
            }else if(rate === '3.0'){
                rateLabel = 'Average'
            }else if(rate === '2.0'){
                rateLabel = 'Poor'
            }else if(rate === '1.0'){
                rateLabel = 'Terrible'
            }
        return (
            <Col md={24}>
                 <Row>
                 <Col md={9}>                 
                <div className="reviews-rating">
                    <div className="product-ratting">
                    <div className="left-block">
                        {/* <Text>{rate ? rate : 'No reviews yet'}</Text> */}
                        {rate ?  <Text> {rate} </Text> : <Text className="no-review-text">No Review Yet</Text>}
                    </div> 
                    <div className="right-block">   
                        {rate && <Rate disabled defaultValue={rate ? rate : ''} className='fs-15 ml-6 mr-6' style={{ position: 'relative', top: '-1px', display: 'block' }} />}
                        <Text>Average {rate ? `${rate} of 5.0 / from 27 reviews` : ''} </Text>
                        {/* <Text>Average {rate ? `${rate} of 5.0 /` : ''}  {rateLabel !== '' && rateLabel}</Text> */}
                     </div>   
                    </div>
                    <div className='reviews-rating-status'>
                        {classifiedDetail && renderRating(classifiedDetail.classified_hm_reviews)}
                    </div>
                    </div>
                        <div className='reviews-rating-status-right'>                    
                            <Button
                                type='default'
                                className='w-100 leave-review-btn'
                                onClick={this.leaveReview}
                                disabled={isUserExits ? true : false}
                            >
                                {'Leave feedback'}
                            </Button>
                        </div>
                                          
                    {/* <Row gutter={[20, 0]}>
                        {classifiedDetail && renderRating(classifiedDetail)}
                        <Col md={8}>
                            {this.filterRating()}
                            <Button
                                type='default'
                                className='w-100'
                                onClick={this.leaveReview}
                            >
                                {'Leave a Review'}
                            </Button>
                        </Col>
                    </Row> */}
                </Col>
                <Col md={1}>&nbsp;</Col>
                <Col md={14} className="classified-all-review">
                        <Row gutter={0} >
                        <Col md={14}>
                <Title level={3} className='text-gray mb-3 total-revies'>
                    {label && `${label} (${totalUser})`}
                </Title>
                </Col>
                <Col md={1}></Col>
                <Col md={9} className="filterRatingSelect">
                     {this.filterRating()}
                </Col>
                </Row>
                {isFilter ? filteredData && <ReviewList userList={filteredData}/> :  allStarData && <ReviewList userList={allStarData}/>}
                {reviewModel && 
                    <LeaveReviewModel
                        visible={reviewModel}
                        onCancel={this.handleCancel}
                        classifiedDetail={classifiedDetail && classifiedDetail}
                        callNext={this.props.getDetails}
                />}
                 </Col>
                </Row>
            </Col>
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

export default connect(mapStateToProps, {openLoginModel})(Review);

