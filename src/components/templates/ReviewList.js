import React from 'react';
import {
  List,
  Rate,
  Col,
  Avatar,
  Typography
} from 'antd';
import { connect } from 'react-redux';
import { likeThisReview, getClassfiedCategoryDetail, openLoginModel } from '../../actions/index'
import { converInUpperCase, dateFormat4 } from '../common'
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';
const { Text, Title } = Typography;

class ReviewList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seeMore: false,
            list: []
        };
    }

    /**
     * @method likeReview
     * @description like this review
     */
    likeReview = (id) => {
        let reqData = {
            user_id: "1129",
            review_id: id,
            is_like: 0
        }
        this.props.likeThisReview(reqData, () => {

        })
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { userList } = this.props

        const { seeMore } = this.state
        let temp = [];
        if (userList.length <= 4) {
            temp = userList.slice(0, userList.length);
        } else {
            let len = !this.state.seeMore ? 4 : userList.length;
            temp = userList.slice(0, len);
        }
        return (
            <div className="review-detail-block">
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
                            // avatar={<Avatar
                            //     src={item.reviews_bt_users &&
                            //         item.reviews_bt_users.image_thumbnail ?
                            //         item.reviews_bt_users.image_thumbnail :
                            //         'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                            //     }                                                                           
                            //     alt={''}
                            //     size={37}
                            // />}
                            // title={<a href='https://ant.design'>{item.reviews_bt_users && converInUpperCase(item.reviews_bt_users.name)}</a>}
                            // description={item.review}
                            title={
                                <a href='javascript:viod(0)'>
                                    by <u>{item.reviews_bt_users && converInUpperCase(item.reviews_bt_users.name)}</u>                                  
                                    {/* <span className="date">{dateFormat4(item.created_at)}</span> */}
                                </a>}
                            description={<div>
                                <div className="review-discrip-heading">{item.title} <img src={require('../../assets/images/hand-img.png')} alt='' /></div>
                                <p className="review-discrip-content">{item.review}</p>
                                {/* {item.is_review_like ? <LikeOutlined onClick={() => {
                                    if (this.props.isLoggedIn) {
                                        this.likeReview(item)
                                    } else {
                                        this.props.openLoginModel()
                                    }
                                }} /> : <DislikeOutlined onClick={() => {
                                    if (this.props.isLoggedIn) {
                                        this.likeReview(item)
                                    } else {
                                        this.props.openLoginModel()
                                    }
                                }} />} */}
                                <p>{item.no_of_votes_count}</p>
                            </div>}
                        />
                    </List.Item>
                )}
            />
            <div className='align-right'>
                {userList && userList.length > 4 && <div className='red-link' style={{cursor:'pointer'}} onClick={() => this.setState({seeMore: true})}>{seeMore === false && 'Show More'}</div>}
            </div>
            <div className="review-date-detail">
                <div className="">icons <span>0</span></div>                
                <div className="d-flex">
                <h4>Confirmed purchase<span className="date">11 Sep 2010</span></h4>
                    <h4>Confirmed purchase<span className="date">11 Sep 2010</span></h4>
                </div>
            </div>
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
export default connect(mapStateToProps, { likeThisReview })(ReviewList);



