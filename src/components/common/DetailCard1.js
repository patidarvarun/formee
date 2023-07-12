import React, { Fragment } from 'react'
import { Card, Col, Row, Rate } from 'antd';
import Icon from '../../components/customIcons/customIcons';

const renderCards = (topData) => {
    return topData.map((data, i) => {
        return (
            <Col className='gutter-row' md={8}>
                <Card
                    //style={{ width: 350 }}
                    bordered={false}
                    className={'detail-card'}
                    cover={
                        <img
                            alt={data.discription}
                            src={data.image}
                        />
                    }
                    actions={[
                        <Icon icon='cart' size='20' />,
                        <Icon icon='wishlist' size='20' />,
                        <Icon icon='view' size='20' />,
                    ]}
                >
                    <div className='price-box'>
                        <div className='rate-section'>
                            {data.rate} <Rate allowHalf defaultValue={data.rate} />
                        </div>
                        <div className='price'>
                            {data.price}
                        </div>
                    </div>
                    <div className='title'>
                        {data.discription}
                    </div>
                    <div className='category-box'>
                        <div className='category-name'>
                            {data.category}
                        </div>
                        <div className='location-name'>
                            <Icon icon='location' size='15' className='mr-5' /> {data.location}
                        </div>
                    </div>
                    {data.tagIcon &&
                        <div className='tag-icon' style={{ backgroundColor: `${data.tagIconColor}` }}>
                            {data.tagIcon}
                        </div>
                    }
                </Card>
            </Col>
        )
    });
}

export const DetailCard = (props) => {
    const { topData } = props
    return (
        <Fragment>
            <Row gutter={[38, 38]}> {renderCards(topData)}</Row>
        </Fragment>
    )
}
