import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { Card, Row, Col, Rate, Typography } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import './bookingEventCard.less';
const { Title, Text, Paragraph } = Typography;

const BookingEventCard = ({
    imgSrc = '',
    title = '',
    titleSize,
    subTitle = '',
    titlePosition,
    onClick,
    priceLabel = '',
    price,
    pricePosition,
    textColor,
}) => {
    return (
        <Fragment>
            <Card
                bordered={false}
                className={'booking-detail-card'}
                cover={
                    <img
                        //alt={tempData.discription}
                        src={require('../../../assets/images/makeup.png')}
                    />
                }
                title={'10% off'}
                actions={[
                    <div className='date-info align-left'>Sun, 19 Jan - Tue, 14 Jan</div>,
                    <Icon icon='wishlist' size='20' />,
                ]}
            >
                <Row>
                    <Col span={13}>
                        <div className='rate-section'>
                            {'3.0'}
                            <Rate allowHalf defaultValue={3.0} />
                        </div>
                        <div className='title' style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {'Remedial Brows'}
                        </div>
                        <div className='category-box'>
                            <div className='category-name'>
                                {'Beauty'}
                            </div>
                        </div>
                    </Col>
                    <Col span={11}>
                        <div className='price-box'>
                            <div className='price'>
                                {'AU$75'}
                                <Paragraph className='sub-text'>per Adult</Paragraph>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Fragment>
    )
}

export default BookingEventCard;