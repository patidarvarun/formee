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
import { openLoginModel } from '../../../actions'
import LeaveReviewModel from './LeaveReviewModel'
import { renderRating } from './index'
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
       label:'Five Star',
       reviewData: [],
       selectedLabel: 'All Reviews',
       isUserExits: false
    };
}
    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
     componentWillReceiveProps(nextprops, prevProps) {
        let updatedList = nextprops.bookingDetail
        this.handleRatingChange(updatedList)
        this.checkReviewAdded()
    }

    /**
   * @method componentWillMount
   * @description get selected categorie details
   */
    componentWillMount() {
        let data = this.props.bookingDetail
        if (data) {
            this.setState({ reviewData: data.valid_trader_ratings })
            this.checkReviewAdded()
        }
    }

    checkReviewAdded = () => {
        const {isLoggedIn, loggedInDetail, bookingDetail } = this.props
        let hmReview = bookingDetail && bookingDetail.valid_trader_ratings && Array.isArray(bookingDetail.valid_trader_ratings) && bookingDetail.valid_trader_ratings.length ? bookingDetail.valid_trader_ratings : []
        if (isLoggedIn && hmReview && hmReview.length) {
            hmReview.some((el) => {
                if (el.customer_id === loggedInDetail.id) {
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
        const { bookingDetail, loggedInDetail, isLoggedIn } = this.props
        let hmReview = bookingDetail && bookingDetail.valid_trader_ratings && Array.isArray(bookingDetail.valid_trader_ratings) && bookingDetail.valid_trader_ratings.length ? bookingDetail.valid_trader_ratings : []
        if (isLoggedIn) {
            if (hmReview && hmReview.length) {
                hmReview.some((el) => {
                    if (el.customer_id === loggedInDetail.id) {
                        toastr.warning('warning', 'You have already added your review.')
                        this.setState({ isUserExits: true, reviewModel: false })
                    } else {
                        this.setState({ isUserExits: false, reviewModel: true })
                    }
                });
            } else if (hmReview.length === 0) {
                this.setState({ isUserExits: false, reviewModel: true })
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
    handleRatingChange = (list) => {
        const data = list.valid_trader_ratings ? list.valid_trader_ratings : [];
        this.setState({
            reviewData: data
        })
    }

    /**
    * @method filterRating
    * @description filter rating
    */
     filterRating = (list) => {
        return (
            <Select
                defaultValue='Top Rated'
                size='large'
                className='w-100 show-reviews-select mt-8'
                onChange={(e) => {
                    this.props.getDetails(e)
                    this.setState({ selectedLabel: e === 'most_recent' ? 'Most Recent' : 'Top Rated' })
                }}
            >
                <Option value={'top_rated'}>Top Rated</Option>
                <Option value={'most_recent'}>Most Recent</Option>
            </Select>
        )
    }

    /**
    * @method getAllStarData
    * @description render all star
    */
    getAllStarData = (data) => {
        let temp = data.valid_trader_ratings && data.valid_trader_ratings.length ? data.valid_trader_ratings : []
        if(temp && temp.length){
            const allStarData = temp && temp.filter(el => el.rating === 5)
            return allStarData
        } 
        else {
            return []
        }  
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const {isUserExits,selectedLabel,reviewData, reviewModel, isFilter, label, filteredData } = this.state;
        const {type, bookingDetail } = this.props;
        let rate = ''
        if(type === 'restaurant'){
            rate = bookingDetail && bookingDetail.avg_rating ? `${parseInt(bookingDetail.avg_rating)}.0` : 0
        }else {
            rate = bookingDetail && bookingDetail.average_rating ? `${parseInt(bookingDetail.average_rating)}.0` : 0
        }
        const allStarData = this.getAllStarData(bookingDetail && bookingDetail)
        let totalUser = isFilter ? filteredData.length : allStarData && allStarData.length
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
                <Row gutter={[86, 0]}>
                    <Col md={9}>
                        <div className='reviews-rating'>
                            <div className='product-ratting'>
                                <div className="left-block">
                                    {rate ?  <Text> {rate} </Text> : <Text className="no-review-text">No Review Yet</Text>}
                                </div>
                                <div className="right-block">
                                    <Rate disabled value={rate ? rate : '0'} className='fs-20' style={{ position: 'relative' }} />
                                    <div className="rating-figure">
                                        {rateLabel !== '' && rateLabel} {rate ? <b>{rate}</b> : '0'} of 5.0 from {label && `${totalUser}`} reviews
                                    </div>
                                </div>
                            </div>
                            <div className='reviews-rating-status'>
                                {bookingDetail && renderRating(bookingDetail)}
                            </div>
                        </div>
                        {type === 'restaurant' && 
                        <div className='reviews-rating-status-right'>
                            <Button
                                type='default'
                                className={isUserExits ? 'disabled' : 'w-100 leave-review-btn'}
                                onClick={this.leaveReview}
                                disabled={isUserExits ? true : false}
                            >
                                {'Leave a Review'}
                            </Button>
                        </div>
                    }
                    </Col>
                    <Col md={15} className="bookings-all-review">
                        <Row gutter={0}>
                            <Col md={14}>
                                <Title level={3} className='mb-0'>
                                    {`${selectedLabel} (${reviewData && reviewData.length})`}
                                </Title>
                            </Col>
                            <Col md={3}></Col>
                            <Col md={7}>
                                {this.filterRating()}
                            </Col>
                        </Row>
                        <ReviewList 
                            userList={reviewData} 
                            callNext={this.props.getDetails}
                            bookingDetail={bookingDetail}
                        />
                        {reviewModel && 
                            <LeaveReviewModel
                                visible={reviewModel}
                                onCancel={this.handleCancel}
                                bookingDetail={bookingDetail && bookingDetail}
                                callNext={this.props.getDetails}
                                type={type}
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
