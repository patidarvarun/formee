import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './bookingcar.less';
import AppSidebar from '../../../../sidebar';
import PopularCarRental from '../../../../common/popularcareental/PopularCarRental'
import CarListDetail from '../../../../common/carListingDetail/CarListDetail';
import LocationCarListDetail from '../../../../common/carListingDetail/LocationCarListDetail';
import { Layout, Row, Col, Typography, Card, Tabs, Form, Input, Select, Button, Breadcrumb } from 'antd';

const { TabPane } = Tabs;
const { Content } = Layout;


class CarList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Layout className='car-landing car-list' >
				<Layout  >
					<AppSidebar />
					<Layout>
						<div className='wrap-inner bg-gray-linear'>
							<Row gutter={[28, 28]}>
								<Col className='gutter-row' md={7} >
									<img
										alt='Map'
										src={require('../../../../../assets/images/dummy-map.jpg')}
									/>
									<LocationCarListDetail />
								</Col>
								<Col className='gutter-row' md={17}>
									<CarListDetail />
								</Col>

							</Row>
							{/* <div className='align-center pt-25 pb-25 '>
								<Button type='default' size={'middle'}>
									{'See All'}
								</Button>
							</div> */}
						</div>
					</Layout>

				</Layout>
			</Layout>
		)
	}
}

export default CarList;