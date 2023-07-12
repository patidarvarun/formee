import React from 'react';
import { connect } from 'react-redux';
import {Card,  Typography, Avatar, Tabs, Row, Col, Breadcrumb, Form, Carousel, Input, Select, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card

class BeautyServiceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    /**
    * @method render
    * @description render component
    */
    render() {
        const { bookingDetail } = this.props;
        return (
            <TabPane tab='Service' key='3'>
                <Tabs >
                    <TabPane tab='Cutting Services' key='1'>
                    Content of Tab Pane 1
                    </TabPane>
                    <TabPane tab='Styling Services' key='2'>
                    Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab='Treatment Services' key='3'>
                        <Row gutter={[30, 22]} className={'mt-20 mb-30'} style={{ alignItems: 'center' }}>
                            <Col span={14}>
                            <Row className='pt-24'>
                                <Col span={8}><Text className='strong'>gjhgjhg</Text></Col>
                                <Col span={8}><Text>hghjghj</Text></Col>
                                <Col span={8}><Button >Book</Button></Col>
                            </Row>
                            </Col>
                            <Col span={10}>
                                <Card
                                    style={{ width: 240 }}
                                    cover={<img alt='example' src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' />}
                                >
                                    <Meta title='Treatment Services' description='hdgfjdhfdhjdfhgjhfkjghkfjhgkjfhgkjhfdkjghjkfhgkjfhgfkjhgjk' />
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab='Colouring Services' key='4'>
                    Content of Tab Pane 3
                    </TabPane>
                    <TabPane tab='Lightening Services' key='5'>
                    Content of Tab Pane 3
                    </TabPane>
                    <TabPane tab='Piercing' key='6'>
                    Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </TabPane>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default connect(
    mapStateToProps,null
)(BeautyServiceDetail);