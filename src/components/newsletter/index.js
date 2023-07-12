import React, { Fragment } from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import './newsletter.less';
const { Title, Text } = Typography;

const Newsletter = () => {
    return (
        <Fragment>
            <Row className='newsletter-box'>
                <Col span={8}>
                    <Title level={4} className='text-normal mb-10'>Newsletter</Title>
                    <Text className='text-white'>Stay up to date with our latest news releases.</Text></Col>
                <Col span={2}></Col>
                <Col span={14} className="">
                <Form
                    layout='inline'
                    className='mt-30 mb-25'
                >
                    <Form.Item>
                        <Input placeholder='Enter your email' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary'>Subscribe</Button>
                    </Form.Item>
                </Form></Col>
            </Row>
        </Fragment>
    )
}

export default Newsletter;