import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { Card, Row, Col, Rate, Typography } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import '../bookingDetailCard/bookingDetailCard.less'
import '../bookingCarDetail/bookingCarDetail.less';
import './carListDetail.less';
const { Title, Text, Paragraph } = Typography;

const LocationCarListDetail = () => {
	return (
		<div className='car-list-detail location-Car-list-detail' >
			<h2>Recommended for you in Bali</h2>
			<Fragment >
				<div className={'booking-detail-card booking-car-detail '}>
					<Row gutter={[20, 0]}>
						<Col md={8}>
							<div className='tag'>Save <br />25%</div>
							<img
								//alt={tempData.discription}
								src={require('../../../assets/images/left-car-thumb.png')}
							/>
						</Col>
						<Col md={16}>
							<div className='price-box'>
								<div className='price'>
									{'AU$75'}
									<Paragraph className='sub-text'>per day</Paragraph>
								</div>
							</div>
							<div className='rate-section'>
								{'3.0'}
								<Rate allowHalf defaultValue={3.0} />
							</div>
							<div className='title' style={{
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}}>
								{'Toyota Tarago'}
							</div>
							<Paragraph className='similar-sub-text'>or similar</Paragraph>
							<div className='category-box'>
								<div className='category-name'>
									{'Car'}
								</div>
							</div>
							<div className='europcar'  align='right'><img
										//alt={tempData.discription}
										src={require('../../../assets/images/euro.png')}
									/></div>
						</Col>
					</Row>
				</div>
				<div className={'booking-detail-card booking-car-detail '}>
					<Row gutter={[20, 0]}>
						<Col md={8}>
							<div className='tag'>Save <br />25%</div>
							<img
								//alt={tempData.discription}
								src={require('../../../assets/images/left-car-thumb.png')}
							/>
						</Col>
						<Col md={16}>
							<div className='price-box'>
								<div className='price'>
									{'AU$75'}
									<Paragraph className='sub-text'>per day</Paragraph>
								</div>
							</div>
							<div className='rate-section'>
								{'3.0'}
								<Rate allowHalf defaultValue={3.0} />
							</div>
							<div className='title' style={{
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}}>
								{'Toyota Tarago'}
							</div>
							<Paragraph className='similar-sub-text'>or similar</Paragraph>
							<div className='category-box'>
								<div className='category-name'>
									{'Car'}
								</div>
							</div>
							<div className='europcar'  align='right'><img
										//alt={tempData.discription}
										src={require('../../../assets/images/euro.png')}
									/></div>
						</Col>
					</Row>
				</div>
				<div className={'booking-detail-card booking-car-detail '}>
					<Row gutter={[20, 0]}>
						<Col md={8}>
							<div className='tag'>Save <br />25%</div>
							<img
								//alt={tempData.discription}
								src={require('../../../assets/images/left-car-thumb.png')}
							/>
						</Col>
						<Col md={16}>
							<div className='price-box'>
								<div className='price'>
									{'AU$75'}
									<Paragraph className='sub-text'>per day</Paragraph>
								</div>
							</div>
							<div className='rate-section'>
								{'3.0'}
								<Rate allowHalf defaultValue={3.0} />
							</div>
							<div className='title' style={{
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}}>
								{'Toyota Tarago'}
							</div>
							<Paragraph className='similar-sub-text'>or similar</Paragraph>
							<div className='category-box'>
								<div className='category-name'>
									{'Car'}
								</div>
							</div>
							<div className='europcar'  align='right'><img
										//alt={tempData.discription}
										src={require('../../../assets/images/euro.png')}
									/></div>
						</Col>
					</Row>
				</div>
			</Fragment>
		</div>
	)
}

export default LocationCarListDetail;