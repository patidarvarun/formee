import React, { Fragment } from 'react';
import { Link,withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../../config/localization';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { InputNumber, Collapse, message, Upload, Select, Input, Space, Form, Switch, Divider, Layout, Card, Typography, Button, Tabs, Row, Col, Menu, Dropdown, } from 'antd';
import AppSidebar from '../../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import NoContentFound from '../../../../common/NoContentFound'
import { STATUS_CODES } from '../../../../../config/StatusCode'
import { MESSAGES } from '../../../../../config/Message'
import { createSpaServices, enableLoading, disableLoading, getTraderProfile, getBookingSubcategory, activateAndDeactivateService, updateSpaServices, getSpaServices, deleteServices } from '../../../../../actions'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../../../config/Config';
import Icon from '../../../../customIcons/customIcons';
import { convertHTMLToText } from '../../../../common';
import { required, validNumber } from '../../../../../config/FormValidation'
import { PlusOutlined, MinusCircleOutlined, DownOutlined } from '@ant-design/icons';
import '../../../vendor-profiles/myprofilerestaurant.less'
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select
const rules = [required('')];
const { Panel } = Collapse;
const { TextArea } = Input;
function onChange(checked) {
  console.log(`switch to ${checked}`);
}
function handleMenuClick(e) {
  message.info('Click on menu item.');
  console.log('click', e);
}
const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">
    Activate All Items
    </Menu.Item>
    <Menu.Item key="2">
    Delete All Items
    </Menu.Item>
    <Menu.Item key="3">
    Delete Category
    </Menu.Item>
  </Menu>
);

class BeautyServices extends React.Component {
    formRef = React.createRef();
    editRef = React.createRef();
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
        Id: '', subCategory: [], activePanel: 1,
        };
    }

    /**
     * @method componentDidMount
     * @description called after render the component
     */
    componentDidMount() {
        const { userDetails } = this.props
        const { id, user_type } = this.props.loggedInUser;
        let temp = []
        for (let i = 30; i <= 240; i = i + 30) {
        temp.push(i)
        }
        this.setState({ durationOption: temp })
        this.getServiceDetail()
    }

    /**
     * @method getServiceDetail
     * @description get service details
     */
    getServiceDetail = () => {
        const { loggedInUser } = this.props
        this.props.getSpaServices(loggedInUser.trader_profile_id, res => {
        if (res.status === 200) {
            
            let data = res.data && res.data.data
            let services = data && Array.isArray(data.wellbeing_trader_service) && data.wellbeing_trader_service.length ? data.wellbeing_trader_service : []
            
            this.setState({ services: services })
        }
        })
    }

    getItemDetail = (el) => {
        this.setState({
        serviceInfo: el,
        isEditFlag: true,
        })

        let currentValue = this.formRef.current && this.formRef.current.getFieldsValue()
        
        if (currentValue) {
        currentValue.services[0].more_info = el.more_info
        currentValue.services[0].name = el.name
        currentValue.services[0].duration = el.duration
        currentValue.services[0].price = el.price
        this.formRef.current && this.formRef.current.setFieldsValue({
            currentValue
        });
        }
    }

    /**
     * @method renderUserServices
     * @description render service details
     */
    renderUserServices = (item) => {
        if (item && item.length) {
        return item && Array.isArray(item) && item.map((el, i) => {
            return (
            <tr key={i}>
                <td colspan="2">
                <div className="title"><Text>{el.name}</Text></div>
                <div className="subtitle">{`${el.more_info}`}</div>
                </td>
                <td colspan="2">
                <div className="amount"><Text>{`$${el.price}`}</Text> <div className="subtitle">{`${el.duration}`}</div></div>

                </td>
                <td colspan="2">
                <div className="switch"><Switch defaultChecked={el.service_status === 1 ? true : false}
                    onChange={(checked) => {
                    let requestData = {
                        service_id: el.id ? el.id : '',
                        status: checked ? 1 : 0
                    }
                    this.props.activateAndDeactivateService(requestData, res => {
                        if (res.status === 200) {
                        toastr.success(res.data && res.data.data)
                        }
                    })
                    }}
                /></div>
                <div className="edit-delete">
                    <a href="javascript:void(0)" onClick={() => this.getItemDetail(el)}>

                    <img src={require('../../../../../assets/images/icons/edit-gray.svg')} alt='edit' />
                    </a>
                    <a href="javascript:void(0)" onClick={(e) => {
                    toastr.confirm(
                        `${MESSAGES.CONFIRM_DELETE}`,
                        {
                        onOk: () => this.deleteItem(el.id),
                        onCancel: () => {  }
                        })
                    }}
                    >
                    <img src={require('../../../../../assets/images/icons/delete.svg')} alt='delete' />
                    </a>
                </div>
                </td>
            </tr>
            )
        }).reverse();
        }
    }

    /**
     * @method deleteItem
     * @description remove service 
     */
    deleteItem = (id) => {
        this.props.deleteServices(id, res => {
        if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, MESSAGES.BEAUTY_SERVICE_DELETE)
            this.getServiceDetail()
        }
        })
    }

    resetField = () => {
        this.formRef.current && this.formRef.current.resetFields()
        this.setState({ fileList: [], serviceInfo: '', isEditflag: false })
    }

    /**
     * @method onFinish
     * @description handle on submit
     */
    onFinish = (value) => {
        const { isEditFlag } = this.state
        const { isCreateService,hideStep } = this.props
        if (value) {
        const { loggedInUser } = this.props
        const requestData = {
            trader_profile_id: loggedInUser.trader_profile_id,
            services: [{
                name: value.name,
                duration:value.duration,
                price:value.price,
                more_info: value.more_info
            }]
        }
        const formData = new FormData()
        if (typeof requestData.services == 'object') {
            formData.append('services', `${JSON.stringify(requestData.services)}`)
        }
        formData.append('trader_profile_id', loggedInUser.trader_profile_id)
        this.props.createSpaServices(formData, res => {
            if (res.status === 200) {
            toastr.success('Vendor service has been created successfully.')
            this.getServiceDetail()
            if(hideStep){
                this.props.history.push('/vendor-services')
            }
            this.resetField()
            if (isCreateService && hideStep === undefined) {
                this.props.nextStep()
            }
            }
        })
        }
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


    renderTab = () => {
        let temp = ['Haircuts', 'Treatment Services','Blow-Waves and Curls','Colours','Highlights']
        return (
            <card>
                <Tabs defaultActiveKey="Haircuts">
                    {temp.map((el, i)=> {
                        return (
                            <TabPane tab={el} key={el}>
                                <div className="tab-inner-item-container">
                                    <Row style={{background:'#fff', padding: '30px 25px 0px'}}>
                                        <Col md={11}>
                                            <TextArea rows={4} className="spa-service-msg" 
                                            defaultValue="Magna condimentum neque faucibus mi vel maecenas. At est semper habitant nullam suscipit id orci at. Ornare faucibus blandit suspendisse sit nunc. Facilisis mauris lacus non cursus cras sit ultricies imperdiet. Sit blandit hac aliquet vitae justo, sodales. Ultrices amet convallis aliquam."/>
                                        </Col>
                                        <Col md={13} className="text-right">
                                            <EditOutlined style={{cursor: 'pointer'}}/>
                                        </Col>
                                    </Row>
                                    {this.createDynamicInput()}
                                    {this.renderAddedServices()}
                                </div>
                            </TabPane>
                        )
                    })}
                </Tabs>
            </card>
        )
    }

    renderAddedServices = () => {
        let temp = [1,2]
        return (
            <>
                {temp.map((el,i) => {
                    return (
                        <Row className="spa-item-description">
                            <Col md={12}>
                                    <h6>Restore</h6>
                                    <p>Most popular couples option – two hours of complete pampering with two therapists Or book just for you, or for mother daughter day. Ripple can send a team of therapists for group bookings with this package</p>
                            </Col>
                            <Col md={6}></Col>
                            <Col md={3} className="text-center">
                                    <h5 className="spa-price">$200.00<br/><span>60 mins</span></h5>
                            </Col>
                            <Col md={3} className="text-right">
                                <Switch defaultChecked onChange={onChange} />
                                <div className="spa-action">
                                    <img src={require('../../../../../assets/images/icons/edit-gray.svg')} alt='edit' className="pr-10"/>
                                    <img src={require('../../../../../assets/images/icons/delete.svg')} alt='delete'/>
                                </div>
                            </Col>
                        </Row>
                    )
                })}
                <Row md={24}>
                    <Col md={21}></Col>
                    <Col md={3}>
                        <Dropdown overlay={menu} className="mt-25 mb-25 bulk-dropdown-action">
                        <Button>
                            Bulk Actions <DownOutlined />
                        </Button>
                        </Dropdown>
                    </Col>
                </Row> 
            </>
        )
    }

    /**
     * @method createDynamicInput
     * @description create services
     */
    createDynamicInput = () => {
        return (
            <Form
                onFinish={this.onFinish}
                className="my-form"
                layout='vertical'
                ref={this.formRef}
                id='spa-form'
            >       
                <div className="form-container">
                    <Row gutter={10}>
                    <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                        label={"Item Name"}
                        name={"name"}
                        rules={rules}
                        >
                        <Input placeholder="Item Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6}>
                        <Form.Item
                            label={"Duration (Mins)"}
                            name={"duration"}
                            rules={rules}
                        >
                        <Select
                            placeholder='Select'
                            allowClear
                        >
                            {this.renderOptions()}
                        </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6}>
                        <Form.Item
                            label={"Price AUD"}
                            name={"price"}
                            rules={[{ validator: validNumber }]}
                        >
                        <InputNumber
                            className="price-number"
                            placeholder="Price AUD"
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row gutter={10}>
                    <Col xs={24} sm={24} md={24}>
                    <Form.Item
                        label={"Description"}
                        name={"more_info"}
                        rules={rules}
                    >
                        <Input placeholder="Description" />
                    </Form.Item>
                    <Button
                        type='primary'
                        htmlType={'submit'}
                        block
                        className="add-btn"
                        >
                        Add
                    </Button>
                    </Col>                      
                </Row>
                </div>                                                          
            </Form>
        )
    }

    /**
     * @method render
     * @description render component  
     */
    render() {
        const { isEditScrren, services} = this.state;
        const { isCreateService,hideStep } = this.props
        return (
        <Layout className="create-membership-block profile-beauty-service">
            {isCreateService && <div className="profile-setup-condition-block">
            <Row gutter={[38, 38]} >
                {/* {services && services.length !== 0 && hideStep === undefined &&
                <Link
                    onClick={() => this.props.nextStep()}
                    className='skip-link uppercase'
                    style={{ marginTop: '100px', marginRight: '100px' }} >Skip</Link>
                } */}
                <Col className='gutter-row' xs={24} sm={24} md={21}>
                <div className="restaurant-content-block create-service-content-block mt-40 mb-40">
                    <div  
                    className='restaurant-tab card'
                    >
                    <Row>
                        <div className="restaurant-content-block">
                            {this.renderTab()}
                        </div>
                    </Row>
                    </div>
                </div>
                </Col>
            </Row>
            {hideStep === undefined && <Divider className="mb-30" />}
            {hideStep === undefined && <div className="step-button-block">
                <Button htmlType='submit' type='primary' size='middle' className='btn-blue' form='spa-form'
                // onClick={() => this.props.nextStep()}
                >NEXT</Button>
            </div>}
            </div>}
        </Layout>
        );
    }
}


const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {}
  };
};
export default connect(
  mapStateToProps,
  { createSpaServices, getTraderProfile, getBookingSubcategory, activateAndDeactivateService, updateSpaServices, getSpaServices, deleteServices, enableLoading, disableLoading }
)(withRouter(BeautyServices))