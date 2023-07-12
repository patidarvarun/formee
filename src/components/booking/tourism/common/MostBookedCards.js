import React from 'react';
import {Col, Card, Typography } from 'antd';
import { DEFAULT_IMAGE_CARD } from "../../../../config/Config";
import { salaryNumberFormate } from '../../../common';
import '../tourismFlightBannerCard.less';
const { Title,Text } = Typography;

const MostBookedCards = (props) => {
    let { index, image, source,price,count, destination, mycity } = props
    return (
        <Col className="gutter-row" md={8}>
            <Card
                bordered={false}
                onClick={() => props.callNext()}
                className={"tourism-card horizontal"}
                style={{cursor:'pointer'}}
                cover={
                <img alt={''} 
                    src={require(`../../../../assets/images/mbf/mbf${index}.jpg`)}
                    onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE_CARD
                }}
                />}
            >
                <div className="title">
                <Title level={4}>{`${mycity ? mycity : ''} ${mycity ? 'to' : ''} ${destination}`}</Title>
                </div>
                {+count > 0 ? 
                <Text className="sub-title">
                {count} bookings in last 24 hours
                </Text> : null}
                <div className="price-box">
                <div className="price">AU${salaryNumberFormate(price)}</div>
                </div>
            </Card>
        </Col>
    )
}

export default MostBookedCards;