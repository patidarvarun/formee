import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import {
    Typography,
    Row,
    Col,
    Button,
    Rate,
    Select,
    List
} from 'antd';
import { openLoginModel } from '../../../../../actions'
import LeaveReviewModel from './ReviewModel'
import {converInUpperCase, dateFormat4 } from '../../../../common'
import { renderRating, rating, } from '../../../../classified-templates/CommanMethod'
const { Text, Title } = Typography;
const { Option } = Select;

let hotel_rating = [
    {
        rating:3,
        review:'Nice',
        title:'Awesome',
        created_at: Date.now(),
        user_name: 'Developer'
    },
    {
        rating:4,
        review:'Nice',
        title:'Awesome',
        created_at: Date.now(),
        user_name: 'Developer'
    }
]

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
            value: 5,
            seeMore: false
        };
    }

//     /**
//      * @method componentWillReceiveProps
//      * @description receive props
//      */
//     componentWillReceiveProps(nextprops, prevProps) {
//         let updatedList = nextprops.classifiedDetail
//         this.handleRatingChange(updatedList)
//         this.checkReviewAdded()
//     }

//     /**
//    * @method componentWillMount
//    * @description get selected categorie details
//    */
//     componentWillMount() {
//         let data = this.props.classifiedDetail
//         if (data) {
//             this.setState({ reviewData: data.classified_hm_reviews })
//             this.checkReviewAdded()
//         }
//     }

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
        const { isLoggedIn } = this.props
        if (isLoggedIn) {
            this.setState({ reviewModel: true })
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
                // onChange={(e) => {
                //     this.props.getDetails(e)
                //     this.setState({ selectedLabel: e === 'most_recent' ? 'Most Recent' : 'Top Rated' })
                // }}
            >
                <Option value={'top_rated'}>Top Rated</Option>
                <Option value={'most_recent'}>Most Recent</Option>
            </Select>
        )
    }

     /**
    * @method renderReviewList
    * @description render review list
    */
    renderReviewList = (userList) => {
        const { seeMore } = this.state
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
                            <Rate disabled value={item.rating} className='fs-16 mb-7' />
                            <List.Item.Meta
                                title={
                                    <a href='javascript:viod(0)'>
                                        by <u>{item.user_name && converInUpperCase(item.user_name)}</u>                                  
                                        <span className='date'>{dateFormat4(item.created_at)}</span>
                                    </a>}
                                description={<div>
                                    <div className='review-discrip-heading'>{item.title} <img src={require('../../../../../assets/images/hand-img.png')} alt='' /></div>
                                    {item.review}
                                </div>}
                            />
                        </List.Item>
                    )}
                />
                <div className='align-right'>
                    {userList && userList.length > 4 && <div className='show-more-link'  onClick={() => this.setState({ seeMore: true })}>{seeMore === false && 'Show More'}</div>}
                </div>
            </div>
        )
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { reviewModel, selectedLabel, isUserExits, reviewData } = this.state;
        const { selectedHotel } = this.props
        let rate = rating(hotel_rating)
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
                                <div className='left-block'>
                                    {rate ?  <Text> {rate} </Text> : <Text className='no-review-text'>No Review Yet</Text>}
                                </div>
                                <div className='right-block'>
                         
                                {rate && <Rate disabled defaultValue={rate ? rate : ''} className='fs-20' style={{ position: 'relative' }} />}
                                <div className='rating-figure'>{rate ? `${rate} of 5.0 /` : ''}  {rateLabel !== '' && rateLabel}</div>
                                </div>
                            </div>
                            <div className='reviews-rating-status'>
                                {hotel_rating && renderRating(hotel_rating)}
                            </div>
                        </div>
                        <div className='reviews-rating-status-right'>
                            <Button
                                type='default'
                                className={isUserExits ? 'disabled' : 'w-100 leave-review-btn'}
                                onClick={this.leaveReview}
                            >
                                {'Leave a Review'}
                            </Button>
                        </div>
                    </Col>
                    <Col md={16} className='classified-all-review pl-75'>
                        <Row gutter={0} align='middle'>
                        <Col md={14}>
                        <Title level={3} className='mb-0'>
                            {`${selectedLabel} (${hotel_rating.length})`}
                        </Title>
                        </Col>
                        <Col md={3}></Col>
                        <Col md={7}>
                        {this.filterRating(hotel_rating)}
                        </Col>
                        </Row>
                        {this.renderReviewList(hotel_rating)}
                        {reviewModel &&
                            <LeaveReviewModel
                                visible={reviewModel}
                                onCancel={this.handleCancel}
                                selectedHotel={selectedHotel}
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

export default connect(mapStateToProps, { openLoginModel })(Review);

