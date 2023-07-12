import React from 'react';
import { connect } from 'react-redux';
import { Typography,List,Avatar,Row,Col,Button,Rate,Select } from 'antd';
import { LikeOutlined, UserOutlined,HeartOutlined,MailOutlined} from "@ant-design/icons";
import {dateFormat4,dateFormate5 } from "../common";
const { Text, Title } = Typography;
const { Option } = Select;

class StaticSellerInformation extends React.Component {
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
            >
                <Option value={'recent'}>New - Old</Option>
                <Option value={'old'}>Old - New</Option>
            </Select>
        )
    } 
    

    /**
     * @method renderFeedbacks
     * @description render feedback
     */
    renderFeedbacks = (feedback) => {
        const { seeMore } = this.state
        let today = Date.now();
        return (
          <div className="review-detail-block">
                <List
                    itemLayout='vertical'
                    dataSource={feedback && feedback}
                    renderItem={el => (
                        <List.Item>
                            <Rate disabled value={0} className='fs-16 mb-7' />
                            <List.Item.Meta
                                title={
                                    <a href='javascript:viod(0)'>
                                        by <u>{'Jams sang'}</u><br/> 
                                        <span  className="report-review blue-link" >Report review</span>                                 
                                    </a>}
                                description={
                                <div>
                                <div className="review-discrip-heading">{'Good'} <img src={require('../../assets/images/hand-img.png')} alt='' /></div>
                                <p className="review-discrip-content">{'Nice i want to buy it'}</p>
                                    <div className="retail-review-like-dis-parent-block">
                                        <div className="review-like-dislike mt-0">
                                            <LikeOutlined/>
                                            <span>{1}</span>
                                        </div>
                                        <div className="review-date-detail">                                                        
                                            <span className="date">{`${0} Comment`}</span>
                                        </div>
                                        <div className="review-date-detail">             
                                            <h5>Published on</h5>
                                            <span className="date">{dateFormat4(today)}</span>
                                        </div>
                                        <div className="review-date-detail">                                                        
                                            <h5>Ad No.</h5>
                                            <span className="date">{'AD-No-67576'}</span>
                                        </div>
                                        <br/>
                                    </div>   
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
     * @method render
     * @description render component
     */
    render() {
        const {selectedLabel,reviewData } = this.state;
        const {userDetails } = this.props;        
        return (
            <div>
            <Row>
                <Col span={12}>
                    <div className="reviews-content-left">
                        <div className="reviews-content-left">
                        <div className="reviews-content-avatar">
                            <Avatar
                                src={userDetails.image !== undefined ? userDetails.image :
                                <Avatar size={54} icon={<UserOutlined />} />}
                                size={71}
                            />
                            </div>
                            <div class="reviews-content-avatar-detail">
                            <h4>{userDetails.name}</h4>
                            {<p>{`Member since  ${dateFormate5(userDetails.created_at)} Based in ${userDetails.state}`}</p>}
                            <a className="underline"><span >{0} listings from this seller</span></a>
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
                                    <Rate allowHalf  disabled value={0.0} />                                          
                                <p>No Feedback <strong>{0}</strong> of 5.0 from {'0'} reviews</p>
                                <span className="custom-br"></span>
                                <div className="pro-ratting-label">
                                    <ul>
                                        <li>
                                        <label>Accurate description</label>
                                            <div className="rate-for-pro">
                                                <Rate allowHalf disabled value={0} /> 
                                                <span className="rating-digit">{0}</span>
                                            </div>
                                        </li>
                                        <li>
                                            <label>Reasonable postage costs</label>
                                            <div className="rate-for-pro">
                                                <Rate allowHalf disabled value={0} />
                                                <span className="rating-digit">{ 0}</span>
                                            </div>
                                        </li>
                                        <li>
                                        <label>Postage speed</label>
                                        <div className="rate-for-pro">
                                            <Rate allowHalf disabled value={0} /> 
                                                <span className="rating-digit">{0}</span>
                                            </div>
                                        </li>
                                        <li>
                                        <label>Communication</label>
                                        <div className="rate-for-pro">
                                            <Rate allowHalf disabled value={0} />
                                                <span className="rating-digit">{0}</span>
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
                    
                </Row>
            </div>
        );
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth,profile } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        userDetails: profile.userProfile !== null ? profile.userProfile : null
    };
};

export default connect(mapStateToProps, null)(StaticSellerInformation);
