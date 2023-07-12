import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './bookingcar.less';
import AppSidebar from '../../../../sidebar';
import PopularCarRental from '../../../../common/popularcareental/PopularCarRental'
import BookingCarDetail from '../../../../common/bookingCarDetail/BookingCarDetail';
import { Layout, Row, Col, Typography, Card, Tabs, Form, Input, Select, Button, Breadcrumb } from 'antd';

const { TabPane } = Tabs;
const { Content } = Layout;


class CarLandingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Layout className='car-landing' >
				<Layout  >
					<AppSidebar />
					<Layout>
						<Tabs defaultActiveKey='1' type='card' className={'tab-style2'} >
							<TabPane tab='Daily Deal' key='1'>
								<div className='wrap-inner bg-gray-linear'>
									<Row gutter={[38, 38]}>
										<Col className='gutter-row' md={8}>
											<BookingCarDetail />
										</Col>
										<Col className='gutter-row' md={8}>
											<BookingCarDetail />
										</Col>
										<Col className='gutter-row' md={8}>
											<BookingCarDetail />
										</Col>
									</Row>
									<div className='align-center pt-25 pb-25 '>
										<Button type='default' size={'middle'}>
											{'See All'}
										</Button>
									</div>
								</div>
							</TabPane>
							<TabPane tab='Top Rated' key='2'>
								Content of Tab Pane 2
            				</TabPane>
						</Tabs>

						<Row className='popular-car-rental'>
							<Col className='gutter-row' md={24}>
								<PopularCarRental />
							</Col>
						</Row>
						<Row className='populardetination'>
							<Col className='gutter-row' md={24}>
								<div>
									<h3>Popular Destination:</h3>
									<ul>
										<li>Japan</li>
										<li>New Zealand </li>
										<li>Italy</li>
										<li>New York</li>
										<li>Australia</li>
										<li>New Zealand</li>
										<li>Italy</li>
									</ul>
								</div>
							</Col>
						</Row>
					</Layout>

				</Layout>
			</Layout>
		)
	}
}

export default CarLandingPage;