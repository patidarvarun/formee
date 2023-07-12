import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './bookingcar.less';
import AppSidebar from '../../../../sidebar';
import CarDetailContent from '../../../../common/carListingDetail/CarDetailContent';

import { Layout, Row, Col, Typography, Card, Tabs, Form, Input, Select, Button, Breadcrumb } from 'antd';

const { TabPane } = Tabs;
const { Content } = Layout;


class CarDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Layout className='car-landing car-list car-deti'>
				<Layout  >
					<AppSidebar />
					<Layout>
						<div className='wrap-inner bg-gray-linear'>
							<Row gutter={[28, 28]}>
								<Col className='gutter-row' md={15}>
									<CarDetailContent />
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

export default CarDetail;