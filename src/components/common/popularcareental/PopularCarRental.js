import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { Card, Row, Col, Rate, Typography, Button } from 'antd';
import './popularcarrental.less';

const { Title, Text, Paragraph } = Typography;


const tempData = [{
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '30,000',
  category: 'subcategory',
  location: 'indore'
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '20,000',
  category: 'subcategory',
  location: 'indore'
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3',
  discription: 'Product Heading',
  price: '5000',
  category: 'subcategory',
  location: 'indore'
}
]

class PopularCarRental extends React.Component {

  render() {
    return (
      <div className='wrap-inner bg-gray-linear '>
        <Title level={2} className='pt-30'>{'popular Car Rental'}</Title>
        <Row gutter={[38, 38]} className='pt-50'>
          <Col className='gutter-row' md={8}>
            <Card
              bordered={false}
              className={'detail-card horizontal'}
              cover={
                <img
                  alt={tempData[0].discription}
                  src={require('../../../assets/images/car-rental-thumb.png')}
                />
              }
            >
              <h2 className='heading'>{'Alamo'}</h2>
              <div className='sub-title'>
                {'Suzuki Grand Vitara 2002'}
              </div>
              <Row className='price-priceoff'>
                <Col span={16}>
                  <div className='price'>
                    <h3><span>from</span> <b>{'AU$20'}</b></h3>
                    <Paragraph className='sub-text'>per day</Paragraph>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='priceoff'>
                    <h3>35%</h3>
                    <Paragraph className='sub-text'>off</Paragraph>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col className='gutter-row' md={8}>
            <Card
              bordered={false}
              className={'detail-card horizontal'}
              cover={
                <img
                  alt={tempData[0].discription}
                  src={require('../../../assets/images/car-rental-thumb.png')}
                />
              }
            >
              <h2 className='heading'>{'Alamo'}</h2>
              <div className='sub-title'>
                {'Suzuki Grand Vitara 2002'}
              </div>
              <Row className='price-priceoff'>
                <Col span={16}>
                  <div className='price'>
                    <h3><span>from</span> <b>{'AU$20'}</b></h3>
                    <Paragraph className='sub-text'>per day</Paragraph>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='priceoff'>
                    <h3>35%</h3>
                    <Paragraph className='sub-text'>off</Paragraph>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col className='gutter-row' md={8}>
            <Card
              bordered={false}
              className={'detail-card horizontal'}
              cover={
                <img
                  alt={tempData[0].discription}
                  src={require('../../../assets/images/car-rental-thumb.png')}
                />
              }
            >
              <h2 className='heading'>{'Alamo'}</h2>
              <div className='sub-title'>
                {'Suzuki Grand Vitara 2002'}
              </div>
              <Row className='price-priceoff'>
                <Col span={16}>
                  <div className='price'>
                    <h3><span>from</span> <b>{'AU$20'}</b></h3>
                    <Paragraph className='sub-text'>per day</Paragraph>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='priceoff'>
                    <h3>35%</h3>
                    <Paragraph className='sub-text'>off</Paragraph>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col className='gutter-row' md={8}>
            <Card
              bordered={false}
              className={'detail-card horizontal'}
              cover={
                <img
                  alt={tempData[0].discription}
                  src={require('../../../assets/images/car-rental-thumb.png')}
                />
              }
            >
              <h2 className='heading'>{'Alamo'}</h2>
              <div className='sub-title'>
                {'Suzuki Grand Vitara 2002'}
              </div>
              <Row className='price-priceoff'>
                <Col span={16}>
                  <div className='price'>
                    <h3><span>from</span> <b>{'AU$20'}</b></h3>
                    <Paragraph className='sub-text'>per day</Paragraph>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='priceoff'>
                    <h3>35%</h3>
                    <Paragraph className='sub-text'>off</Paragraph>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col className='gutter-row' md={8}>
            <Card
              bordered={false}
              className={'detail-card horizontal'}
              cover={
                <img
                  alt={tempData[0].discription}
                  src={require('../../../assets/images/car-rental-thumb.png')}
                />
              }
            >
              <h2 className='heading'>{'Alamo'}</h2>
              <div className='sub-title'>
                {'Suzuki Grand Vitara 2002'}
              </div>
              <Row className='price-priceoff'>
                <Col span={16}>
                  <div className='price'>
                    <h3><span>from</span> <b>{'AU$20'}</b></h3>
                    <Paragraph className='sub-text'>per day</Paragraph>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='priceoff'>
                    <h3>35%</h3>
                    <Paragraph className='sub-text'>off</Paragraph>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col className='gutter-row' md={8}>
            <Card
              bordered={false}
              className={'detail-card horizontal'}
              cover={
                <img
                  alt={tempData[0].discription}
                  src={require('../../../assets/images/car-rental-thumb.png')}
                />
              }
            >
              <h2 className='heading'>{'Alamo'}</h2>
              <div className='sub-title'>
                {'Suzuki Grand Vitara 2002'}
              </div>
              <Row className='price-priceoff'>
                <Col span={16}>
                  <div className='price'>
                    <h3><span>from</span> <b>{'AU$20'}</b></h3>
                    <Paragraph className='sub-text'>per day</Paragraph>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='priceoff'>
                    <h3>35%</h3>
                    <Paragraph className='sub-text'>off</Paragraph>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

        </Row>
        <div className='align-center pt-25 pb-25'>
          <Button type='default' size={'middle'}>
            {'See All'}
          </Button>
        </div>
      </div>
    )
  }
}
export default PopularCarRental;