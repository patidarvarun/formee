import React from 'react';
import { connect } from 'react-redux';
import {
    Typography,
    Row,
    Col,
    Button,
    Rate,
    Select,
    Progress,
    List,
} from 'antd';
import { dateFormat4 } from '../common'
import { LikeOutlined, LikeTwoTone } from '@ant-design/icons';
const { Text, Title } = Typography;
const { Option } = Select;
let today = Date.now();

const temp = [{
    name: 'jain sang',
    created_at: today,
    rating: 5,
    review:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '
},
{
    name: 'Luis jan',
    created_at: today,
    rating: 4,
    review:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '
},
{
    name: 'Marry outh',
    created_at: today,
    rating: 3,
    review:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. '
},

]

class StaticReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    /**
    * @method filterRating
    * @description filter rating
    */
     filterRating = () => {
        return (
            <Select
                defaultValue='Top Rated'
                size='large'
                className='w-100 shadow-select-automotive'
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
        return (
            <Col md={24} >
                <Row>
                    <Col md={8}>
                        <div className='reviews-rating'>
                            <div className='product-ratting'>
                                <div className="left-block">
                                    {<Text> {'3'} </Text>}
                                </div>
                                <div className="right-block">
                                {<Rate disabled defaultValue={3} className='fs-20' style={{ position: 'relative' }} />}
                                <div className="rating-figure">{`3 of 5.0 /`}  Average</div>
                                </div>
                            </div>
                            <div className='reviews-rating-status'>
                            <div className='reviews-rating-status-left'>
                                <ul className='progress-status'>
                                    <li>
                                        <Text className='label'>5 Excellent</Text>
                                        <Progress percent={parseInt((1 * 100) / 10)} />
                                    </li>
                                    <li>
                                        <Text className='label'>4 Very good</Text>
                                        <Progress percent={parseInt((1 * 100) / 10)} />
                                    </li>
                                    <li>
                                        <Text className='label'>3 Average</Text>
                                        <Progress percent={parseInt((1 * 100) / 10)} />
                                    </li>
                                    <li>
                                        <Text className='label'>2 Poor</Text>
                                        <Progress percent={parseInt((0 * 100) / 10)} />
                                    </li>
                                    <li>
                                        <Text className='label'>1 Terrible</Text>
                                        <Progress percent={parseInt((0 * 100) / 10)} />
                                    </li>
                                </ul>
                            </div>
                            </div>
                        </div>
                        <div className='reviews-rating-status-right'>
                            <Button
                                type='default'
                                className={'w-100 leave-review-btn'}
                                disabled={true}
                            >
                                {'Leave a Review'}
                            </Button>
                        </div>
                    </Col>
                    <Col md={1}>&nbsp;</Col>
                    <Col md={14} className="classified-all-review pl-28">
                        <Row gutter={0} align="middle">
                        <Col md={14}>
                        <Title level={3} className='mb-0'>
                            All Reviews
                        </Title>
                        </Col>
                        <Col md={1}></Col>
                        <Col md={9}>
                        {this.filterRating()}
                        </Col>
                        </Row>
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
                            <Rate disabled defaultValue={item.rating} className='fs-16 mb-7' />
                            <List.Item.Meta
                                title={
                                    <a href='javascript:viod(0)'>
                                        by <u>{item.name}</u>                                  
                                        <span className="date">{dateFormat4(item.created_at)}</span>
                                        <span className="report-review" style={{cursor:'pointer'}} 
                                        >Report review</span>
                                    </a>}
                                description={<div>
                                    <div className="review-discrip-heading">{item.title} <img src={require('../../assets/images/hand-img.png')} alt='' /></div>
                                    {item.review}
                                    <div className="review-like-dislike">
                                     <LikeOutlined />
                                    <span>{item.count}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    </div>
                                </div>}
                            />
                        </List.Item>
                    )}
                />
               </div>
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

export default connect(mapStateToProps, null)(StaticReview);

