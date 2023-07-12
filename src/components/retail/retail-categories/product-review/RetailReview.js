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
import { openLoginModel } from '../../../../actions'
import LeaveReviewModel from './LeaveReviewModel'
import { renderRating, rating, } from '../../../classified-templates/CommanMethod'
import ReviewList from '../product-review/ReviewList'
import VendorReviews from '../../../dashboard/vendor-profiles/VendorReviews';
const { Text, Title } = Typography;
const { Option } = Select;

class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewModel: false,
            isFilter: false,
            filteredData: [],
            selectedLabel: 'All Reviews',
            isUserExits: false,
            allStarData: [],
            reviewData: [],
            value: 5
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
        this.checkReviewAdded()
    }

    /**
   * @method componentWillMount
   * @description get selected categorie details
   */
    componentWillMount() {
        let data = this.props.classifiedDetail
        if (data) {
            this.setState({ reviewData: data.classified_hm_reviews })
            this.checkReviewAdded()
        }
    }

    
    checkReviewAdded = () => {
        const {isLoggedIn, loggedInDetail, classifiedDetail } = this.props
        let hmReview = classifiedDetail && classifiedDetail.classified_hm_reviews && Array.isArray(classifiedDetail.classified_hm_reviews) && classifiedDetail.classified_hm_reviews.length ? classifiedDetail.classified_hm_reviews : []
        if (isLoggedIn && hmReview && hmReview.length) {
            hmReview.some((el) => {
                if (el.user_id === loggedInDetail.id) {
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
        let hmReview = classifiedDetail && classifiedDetail.classified_hm_reviews && Array.isArray(classifiedDetail.classified_hm_reviews) && classifiedDetail.classified_hm_reviews.length ? classifiedDetail.classified_hm_reviews : []
        if (isLoggedIn) {
            if(classifiedDetail.is_confirmed_purchase === 0){
                toastr.warning('warning', 'Please confirm your purchase before adding review.')
                this.setState({ isUserExits: true, reviewModel: false })
            }else if (hmReview && hmReview.length) {
                hmReview.some((el) => {
                    if (el.user_id === loggedInDetail.id) {
                        this.setState({ isUserExits: true, reviewModel: false })
                        toastr.warning('warning', 'You have already added your review.')
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
        const data = list.classified_hm_reviews ? list.classified_hm_reviews : [];
        this.setState({
            reviewData: data
        })
    }


    /**
    * @method likeReviewCallback
    * @description like this review
    */
    likeReviewCallback = () => {
        this.props.getDetails()
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
                className='w-100 shadow-select-automotive'
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
     * @method render
     * @description render component
     */
    render() {
        const { reviewModel, isFilter, selectedLabel, filteredData, isUserExits, allStarData, reviewData } = this.state;
        const {retail, classifiedDetail } = this.props;
        let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
        let totalUser = isFilter ? filteredData.length : allStarData && allStarData.length
        let rateLabel = '';
        if (rate === '5.0') {
            rateLabel = 'Excelent'
        } else if (rate === '4.0') {
            rateLabel = 'Good'
        } else if (rate === '3.0') {
            rateLabel = 'Average'
        } else if (rate === '2.0') {
            rateLabel = 'Poor'
        } else if (rate === '1.0') {
            rateLabel = 'Terrible'
        }
        return (
            <Col md={24} >
                <Row>
                    <Col md={8}>
                        <div className='reviews-rating'>
                            <div className='product-ratting'>
                                <div className="left-block">
                                    {rate ?  <Text> {rate} </Text> : <Text className="no-review-text">No Review Yet</Text>}
                                </div>
                                <div className="right-block">
                         
                                {rate && <Rate disabled defaultValue={rate ? rate : ''} className='fs-20' style={{ position: 'relative' }} />}
                                <div className="rating-figure">{rateLabel !== '' && rateLabel} {rate ? `${rate} of 5.0 from ` : ''} {classifiedDetail.classified_hm_reviews && `${classifiedDetail.classified_hm_reviews.length} reviews`}</div>
                                </div>
                            </div>
                            <div className='reviews-rating-status'>
                                {classifiedDetail && renderRating(classifiedDetail.classified_hm_reviews)}
                            </div>
                        </div>
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
                    </Col>
                    {/* <Col md={1}>&nbsp;</Col> */}
                    <Col md={16} className="classified-all-review pl-75">
                        <Row gutter={0} align="middle">
                        <Col md={14}>
                        <Title level={3} className='mb-0'>
                            {`${selectedLabel} (${reviewData && reviewData.length})`}
                        </Title>
                        </Col>
                        <Col md={3}></Col>
                        <Col md={7}>
                        {this.filterRating(classifiedDetail)}
                        </Col>
                        </Row>
                        <ReviewList 
                            userList={reviewData} 
                            likeReviewCallback={this.likeReviewCallback} 
                            callNext={this.props.getDetails}
                            classifiedDetail={classifiedDetail}
                        />

                        
                        {reviewModel &&
                            <LeaveReviewModel
                                visible={reviewModel}
                                onCancel={this.handleCancel}
                                classifiedDetail={classifiedDetail && classifiedDetail}
                                callNext={this.props.getDetails}
                                is_retail={retail}
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

export default connect(mapStateToProps, { openLoginModel })(Review);
