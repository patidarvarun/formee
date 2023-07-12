import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../../config/localization';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { message, Upload, Select, Input, Space, Form, Switch, Divider, Layout, Card, Typography, Button, Tabs, Row, Col } from 'antd';
import AppSidebar from '../../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
// import NoContentFound from '../../../common/NoContentFound'
import { STATUS_CODES } from '../../../../../config/StatusCode'
import { MESSAGES } from '../../../../../config/Message'
import { editServices, getFitnessClassListing, deleteServices } from '../../../../../actions'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../../../config/Config';
import Icon from '../../../../customIcons/customIcons';
import { convertHTMLToText } from '../../../../common';
import { required } from '../../../../../config/FormValidation'
import { PlusOutlined } from '@ant-design/icons';
// import { Image } from 'antd';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select

class ClassListing extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            subCategory: [],
            currentList: [],
            size: 'large',
            showSettings: [],
            activeFlag: langs.key.all,
            ads_view_count: '',
            total_ads: '',
            services: [],
            BeautyService: '',
            isEditFlag: false,
            durationOption: [],
            item: '',
            itemInfo: '', serviceInfo: '',
            fileList: [],
            classes: [],
            uniqueFitnessTabs: [],
            selectedFitnessType: []
        };
    }

    /**
     * @method componentDidMount
     * @description called after render the component
     */
    componentDidMount() {

        this.getFitnessClasses()

        let temp = []
        for (let i = 30; i <= 180; i++) {
            temp.push(i)
        }
        this.setState({ durationOption: temp })
    }

    /**
     * @method getFitnessClasses
     * @description get service details
     */
    getFitnessClasses = () => {
        const { userDetails } = this.props;
        let trader_user_profile_id = this.props.userDetails.user.trader_profile.id
        this.props.getFitnessClassListing({ id: trader_user_profile_id }, (res) => {
            
            if (res.data.status === 200) {
                let data = res.data && res.data.data
                let traderClasses = data.trader_classes && Array.isArray(data.trader_classes) && data.trader_classes.length ? data.trader_classes : []
                
                const uniqueTabs = [...new Set(traderClasses.map(item => item.wellbeing_fitness_type.name))]; // [ 'A', 'B']



                let selectedFitnessType = traderClasses.filter((c) => {
                    
                    if (uniqueTabs.length && c.wellbeing_fitness_type.name == uniqueTabs[0]) {
                        return c
                    }
                })
                
                this.setState({ classes: traderClasses, uniqueFitnessTabs: uniqueTabs, selectedFitnessType })


            }
        })
    }

    /**
   * @method renderUserServices
   * @description render service details
   */
    renderUserServices = (service, item) => {
        const { selectedFitnessType } = this.state
        if (selectedFitnessType && selectedFitnessType.length) {
            return selectedFitnessType && Array.isArray(selectedFitnessType) && selectedFitnessType.map((el, i) => {
                
                return (
                    <Row className='pt-20' key={i}>
                        <Col span={4}>
                            <img
                                width={200}
                                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            />
                        </Col>
                        <Col span={8}>
                            <Text className='strong'>{el.class_name}</Text>
                            <br />{`${el.description} mins`}
                        </Col>
                        <Col span={4}><Text className='strong'>{`$${el.price}`}</Text></Col>
                    </Row>
                )
            })
        }
    }

    /**
     * @method deleteItem
     * @description remove service 
     */
    deleteItem = (id) => {
        
        this.props.deleteServices(id, res => {
            if (res.status === STATUS_CODES.Ok) {
                toastr.success(langs.success, MESSAGES.BEAUTY_SERVICE_DELETE)
                this.getFitnessClasses()
            }
        })
    }

    /**
     * @method onFinish
     * @description handle on submit
     */
    onFinish = (values) => {
        const { itemInfo, serviceInfo } = this.state
        
        let requestData = {
            booking_category_id: serviceInfo.booking_category_id,
            services: JSON.stringify([{
                id: serviceInfo.id,
                name: values.service,
                duration: values.duration,
                price: values.price,
                more_info: values.description
            }])
        }

        
        this.props.editServices(requestData, res => {
            // toastr.success(langs.success, MESSAGES.BEAUTY_SERVICE_UPDATE)
        })
    }

    /**
    * @method renderOptions
    * @description render duration options
    */
    renderOptions = () => {
        const { durationOption } = this.state;
        return durationOption && durationOption.length && durationOption.map((el, i) => {
            return (
                <Option key={i} value={el}>{el}</Option>
            )
        })
    }

    /**
    * @method dummyRequest
    * @description dummy image upload request
    */
    dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };

    /**
     * @method handleImageChange
     * @description handle image change
     */
    handleImageChange = ({ file, fileList }) => {
        
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJpgOrPng) {
            message.error('You can only upload JPG , JPEG  & PNG file!');
            return false
        } else if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false
        } else {
            this.setState({ fileList });
        }

    }

    /**
     * @method updateService
     * @description update services
     */
    updateService = () => {
        const { fileList, isEditFlag } = this.state
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className='ant-upload-text'>Upload</div>
            </div>
        );
        return (
            <Row>
                <Form
                    onFinish={this.onFinish}
                    layout={'vertical'}
                    ref={this.formRef}
                >
                    <Row gutter={24} >
                        <Col gutter={12}>
                            <Form.Item
                                name='image'
                            >
                                <Upload
                                    name='avatar'
                                    listType='picture-card'
                                    className='avatar-uploader'
                                    showUploadList={true}
                                    fileList={fileList}
                                    customRequest={this.dummyRequest}
                                    onChange={this.handleImageChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col gutter={12}>
                            <Row gutter={28}>
                                <Col span={24}>
                                    <Form.Item
                                        label='Description'
                                        name={`${'description'}`}
                                        rules={[required('')]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={28}>
                                <Col span={12}>
                                    <Form.Item
                                        label='Service'
                                        name={`${'service'}`}
                                        rules={[required('')]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label='Duration'
                                        name={`${'duration'}`}
                                        rules={[required('')]}
                                    >
                                        <Select
                                            placeholder='Select'
                                        >
                                            {this.renderOptions()}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label='Price'
                                        name={`${'price'}`}
                                        rules={[required('')]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={28}>
                        <Form.Item className='align-center mt-20'>
                            <Button type='primary' danger htmlType='submit' >
                                {isEditFlag ? 'Update' : 'Add'}
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </Row>
        )
    }

    /**
     * @method renderFitnessClassesTab
     * @description render service tab
     */
    renderFitnessClassesTab = () => {
        const { selectedFitnessType, isEditFlag, classes, uniqueFitnessTabs } = this.state;
        const { fitnessPlan } = this.props;
        return (
            <Tabs type='card' onTabClick={(e) => {
                let temp = classes.filter((c) => {
                    if (c.wellbeing_fitness_type.name == e) {
                        return c
                    }
                })
                this.setState({ selectedFitnessType: temp })
            }}
            //  onChange={() => this.setState({ isEditFlag: false })}
            >
                {Array.isArray(uniqueFitnessTabs) && uniqueFitnessTabs.length && uniqueFitnessTabs.map((el, i) => {
                    // let description = convertHTMLToText(el.description)
                    return (
                        <TabPane tab={el} key={el}>
                            <Row >
                                <Col span={8}>
                                    {this.renderUserServices(el, el.trader_user_profile_services)}
                                </Col>
                                <Divider />
                            </Row>
                        </TabPane>
                    )
                })}
            </Tabs>
        )
    }


    /**
     * @method render
     * @description render component  
     */
    render() {
        const { isEditFlag } = this.state;
        return (
            <Layout>
                <Layout>
                    <AppSidebar history={history} />
                    <Layout>
                        <div className='my-profile-box' style={{ minHeight: 800 }}>
                            <div className='card-container signup-tab'>
                                <div className='top-head-section'>
                                    <div className='left'>
                                        <Title level={2}>Manage Services</Title>
                                    </div>
                                </div>
                                <Card
                                    bordered={false}
                                    className='profile-content-box'
                                    title='Your Service'
                                    extra={
                                        !isEditFlag && <Space
                                            align={'center'}
                                            className={'blue-link'}
                                            style={{ cursor: 'pointer' }}
                                            size={9}
                                            onClick={() => this.setState({ isEditFlag: true })}
                                        >Edit
                                            <Icon icon='edit' size='12' />
                                        </Space>
                                    }
                                >
                                    {this.renderFitnessClassesTab()}
                                </Card>
                            </div>
                        </div>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, profile, bookings } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
        fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],
    };
};
export default connect(
    mapStateToProps,
    { editServices, getFitnessClassListing, deleteServices }
)(ClassListing)