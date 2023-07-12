import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../../sidebar/index';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../config/localization';
import { DatePicker, Layout, message, Row, Col, List, Typography, Carousel, Tabs, Form, Input, Select, Button, Card, Breadcrumb, Table, Tag, Space, Modal, Steps, Progress } from 'antd';
import Icon from '../../customIcons/customIcons';
import { DetailCard } from '../../common/DetailCard1'
import DetailCardHome from '../../common/DetailCard'
import { getClassfiedCategoryListing, getBannerById, openLoginModel } from '../../../actions/index';
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import { TEMPLATE, DEFAULT_ICON } from '../../../config/Config'
import './listing.less'
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const { RangePicker } = DatePicker;
//   Step Form start
const { Step } = Steps;

const steps = [
    {
        content: <StepOne /> ,
    },
    {
        content: <StepTwo />,
    },
    {
        content: <StepThree />,
    },
    {
        content: <StepFour />,
    }
];

//   Step Form ends
const tempData1 = [{
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    rate: '3.0',
    discription: 'Product Heading',
    price: 'AU$120',
    category: 'subcategory',
    location: 'Melbourne',
}, {
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    rate: '3.0',
    discription: 'Product Heading',
    price: 'AU$120',
    category: 'subcategory',
    location: 'Melbourne',
}, {
    image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    rate: '3.0',
    discription: 'Product Heading',
    price: 'AU$120',
    category: 'subcategory',
    location: 'Melbourne',
}
];
const data = [
    {
        key: '1',       
        Event:  <img src={require('../../../assets/images/table-content.png')} alt='Home' width='30' className={'stroke-color'} />,
        decriptn: 'Australian Football League (AFL)Round 1 Richmond v Carlton',
        Date: '19 Mar 20208:00 PM',
        Location: 'Melbourne Cricket Ground, Melbourne, Australia',
        tags: ['Tickets'],
        
    },
    
];
const datedata = [
    {
        title:'Date :' ,
        desc: 'Sunday, August 14, 2020',
       },
    {
        
        desc: '1:30 PM',
        title: 'Time :',
        
    },
    {
        
        desc: 'Stalls R16, R17, R18, R19',
        title: 'Selected Seat :',
        
    },
    {
        
        desc: 'Club Members & Public Reserve 2 Adults, 2 Children ',
        title: 'Ticket Type:',
        
    },
    {
        
        desc: <Select placeholder='E-Ticket (emailed)' allowClear className='shadow-input'>
        <Option value='clubmembers'>E-Ticket (emailed)</Option>
        <Option value='clubmembers'>E-Ticket (emailed)</Option>
        <Option value='clubmembers'>E-Ticket (emailed)</Option>
    </Select>,
        title: 'Delivery Method :',
        
    },


];
const contactdata = [
    {
        title:'Contact Name :' ,
        desc: 'Sierra Ferguson',
       },
       {
        title:'Email Address :' ,
        desc: 'Sierra@gmail.com',
       },
       {
        title:'Phone Number:' ,
        desc: ' 0403 305 196',
       },
];
const columns = [
    {
        
        title: 'Event',
        dataIndex: 'Event',
        key: 'Event',
        render: text => <a>{text}</a>,
    },
    {
        
        title: '',
        dataIndex: 'decriptn',
        key: 'decriptn',
        // render: text => <a>{text} <br/> football </a>,
    },
    {
        title: 'Date',
        dataIndex: 'Date',
        key: 'Date',
    },
    {
        title: 'Location',
        dataIndex: 'Location',
        key: 'Location',
    },
    {
        title: 'Get it!',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <a href='' className='yellow-btn' color={color} key={tag}>
                            {tag.toUpperCase()}
                        </a>
                    );
                })}
            </>
        ),
    }
];
const dataPopup = [
    
        {
            Ticket:'Club Members & Public Reserve',
            Ticketdetail:'Adult',
            Price:'AU$59.00',
            Quantity:<Input type={'number'} defaultValue= '1'/>,
            Amount:'AU$59.00',
           
        },
        {
            Ticket:'',
            Ticketdetail:'Concession',
            Price:'AU$59.00',
            Quantity:<Input type={'number'} defaultValue= '1'/>,
            Amount:'AU$59.00',
           
        },
        {
            Ticket:'',
            Ticketdetail:'Children (6-14)',
            Price:'AU$59.00',
            Quantity:<Input type={'number'} defaultValue= '1'/>,
            Amount:'AU$59.00',
           
        },
        {
            Ticket:'',
            Ticketdetail:'Children (1-5)',
            Price:'AU$59.00',
            Quantity:<Input type={'number'} defaultValue= '1'/>,
            Amount:'AU$59.00',
           
        },
        


];
const datacolumns = [
    {
         title: 'Ticket type',
         dataIndex: 'Ticket',
         key: 'Ticket',
        },
    {
       
        title: '',  
        dataIndex: 'Ticketdetail',
         key: 'Ticketdetail', 
    },
    {
        title: 'Price',  
        dataIndex: 'Price',
         key: 'Price',
    },
    {
        title: 'Quantity',
        dataIndex: 'Quantity',
         key: 'Quantity',   
    },
    {
        title: 'Amount',
        className:' text-right',
        dataIndex: 'Amount',
         key: 'Amount',
       
        
    }
]

function onChange(value, dateString) {
    
    
}

function onOk(value) {
    
}

function StepOne(props) {
    return (<div className='fm-step-one'> <h4 className='fm-input-heading'>Please select a date and time</h4>
        <Form>
            <DatePicker suffixIcon={<Icon icon='clock' size='18' />} className='shadow-input' showTime onChange={onChange} onOk={onOk} placeholder='Your currently selected date is: Sat, 4 Feb 2020 1:30 pm' />
            <hr />
            <Form.Item className='fm-apply-label' label='Do you have code promo?'>
                <div className='fm-apply-input'>
                    <Input placeholder={'Enter promotion code'} enterButton='Search' className='shadow-input' />
                    <Button type='primary' className='fm-apply-btn'>Apply</Button>
                </div>
                <Link to='/' className='fm-clear-link'>Clear</Link>
            </Form.Item>
        </Form>
    </div>)
}
function StepTwo(props) {
    return (<div className='fm-step-two'> <h4 className='fm-input-heading'>Please select ticket type</h4>
        <Form layout='vertical'>
            <Row gutter={[7, 7]}>
                <Col md={18}>
                    <Form.Item name='tickettype' label='Ticket type'>
                        <Select
                            placeholder='E-Ticket (emailed)'
                            allowClear
                            className='shadow-input'
                        >
                            <Option value='clubmembers'>Club Members & Public Reserve  $60.00 - $165.00</Option>
                            <Option value='clubmembers'>Club Members & Public Reserve  $70.00 - $175.00</Option>
                            <Option value='clubmembers'>Club Members & Public Reserve  $80.00 - $185.00</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col md={6}>
                    <Form.Item name='quantity' label='Quantity'>
                        <Select
                            placeholder='4 Tickets'
                            allowClear
                            className='shadow-input'
                        >
                            <Option value='tickets'>1 Tickets</Option>
                            <Option value='tickets'>2 Tickets</Option>
                            <Option value='tickets'>3 Tickets</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <h4 className='fm-input-heading'>Please select seats</h4>

                    <img src={require('../../../assets/images/stage-graph.png')} alt='' />
                </Col>
            </Row>
        </Form>
    </div>)
}
function StepThree(props) {
    return (<div className='fm-step-three'> <h4 className='fm-input-heading'>A Reserve (R16, R17, R18, R19,)</h4>
       <div className='table-total'> 
       <Table className='reserve-table' columns={datacolumns} dataSource={dataPopup}/>
       <div className='total-tableview'>
           <Row className='pb-8'>
               <Col md={16}>Subtotal</Col>
               <Col md={8} className='text-right' >$158.00</Col>
           </Row>
           <Row className='pb-8'>
               <Col md={16}>Taxes and surcharges</Col>
               <Col md={8} className='text-right' >$10.00</Col>
           </Row>
           <Row className='pb-8'>
               <Col md={15}><b>Total</b></Col>
               <Col md={6} className='text-right' >2 Adults, 2 Children </Col>
               <Col md={3} className='text-right' ><b>$168.00</b>  </Col>
             
           </Row>
       </div>   
       </div>
        <Form>
            <Form.Item label='Delivery Method'>
                        <Select
                            placeholder='E-Ticket (emailed)'
                            allowClear
                            className='shadow-input'
                        >
                            <Option value='eticket'>E-Ticket</Option>
                            <Option value='eticket'>E-Ticket</Option>
                            <Option value='eticket'>E-Ticket</Option>
                        </Select>
            </Form.Item>
            <h4 className='fm-input-heading'>Your Information</h4>
            <Form.Item label='Contact Name'>
                <Input placeholder={'Enter your first name and last name'} className='shadow-input' />
            </Form.Item>
            <Form.Item label='Email Address'>
                <Input placeholder={'Enter your email address'} className='shadow-input' />
            </Form.Item>
            <Form.Item label='Phone Number'>
                <Input placeholder={'Enter your phone number'} className='shadow-input' />
            </Form.Item>
        </Form>
    </div>)
}
function StepFour(props) {
    return (
        <Row gutter={16}>
      <Col className='gutter-row' span={12}>
      
    <div className='fm-step-four'> <h4 className='fm-input-heading'>Your booking details</h4>
        <Card  bordered={false} >
        <Form layout='vertical'>
            {/* <DatePicker suffixIcon={<Icon icon='clock' size='18' />} className='shadow-input' showTime onChange={onChange} onOk={onOk} placeholder='Your currently selected date is: Sat, 4 Feb 2020 1:30 pm' />
            <hr />
            <Form.Item className='fm-apply-label' label='Do you have code promo?'>
                <div className='fm-apply-input'>
                    <Input placeholder={'Enter promotion code'} enterButton='Search' className='shadow-input' />
                    <Button type='primary' className='fm-apply-btn'>Apply</Button>
                </div>
                <Link to='/' className='fm-clear-link'>Clear</Link>
            </Form.Item> */}
            <Row className='border-bottom'>
                                        <Col md={24} className='fm-user-box'>
                                            <div className='fm-user-image'>
                                                <img src={require('../../../assets/images/afl-logo-image.jpg')} alt='' />
                                            </div>
                                            <div className='fm-user-details inner-fourth'>
                                                <Text>Australian Football League (AFL)</Text>
                                                <Text>Round 1, Richmond v Carlton</Text>
                                                <Text className='fm-location'>Location</Text>
                                                <Text className='fm-address'>Melbourne Cricket Ground, Melbourne, Australia</Text>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div>
                                    <List className='list-date-time' itemLayout='horizontal' dataSource={datedata}  renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                        title={<b>{item.title}</b>}
                                        description= {item.desc} 
                                        />
                                        </List.Item>
                                        )}
                                    />
                                    
                                    </div>
                                    <div className='contac-info'>
                                    <List className='list-date-time' itemLayout='horizontal' dataSource={contactdata}  renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                        title={<b>{item.title}</b>}
                                        description= {item.desc} 
                                        />
                                        </List.Item>
                                        )}
                                    />
                                    
                                    </div>
        </Form></Card>
    </div></Col>
    <Col className='gutter-row' span={12}><div className='fm-step-four'> <h4 className='fm-input-heading'>Your price summary</h4>
        <Card  bordered={false} >
         <h5 className='pb-5'>Club Members & Public Reserve</h5>
         <div className='price-section' >
         <Row className='pt-5'>
             <Col md={16} >1 Adult x $59.00</Col>
             <Col md={8} className='text-right'>$59.00</Col>
         </Row>
         <Row className='pt-5'>
             <Col md={16} >1 Concession x $27.00</Col>
             <Col md={8} className='text-right'>$27.00</Col>
         </Row>
         <Row className='pt-5'>
             <Col md={16} >2 Children (6-14) x $20.00</Col>
             <Col md={8} className='text-right'>$20.00</Col>
         </Row>
         <Row className='pt-5'>
             <Col md={16} >Taxes and surcharges</Col>
             <Col md={8} className='text-right'>$5.00</Col>
         </Row></div>
         <Row className=' total-section'>
             <Col md={16} ><b>Total</b></Col>
             <Col md={8} className='text-right'><h4><b>$240.50</b></h4></Col>
         </Row>
         </Card></div>
         <div className='special-note'> <h4 className='fm-input-heading'>Special note</h4></div>
         <Card  bordered={false} >
             <p>Please arrive before the gate open 45 minutes.</p>
         </Card>
         </Col>
    </Row>)
}




class BookingListDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topImages: [],
            bottomImages: [],
            visible: false,
            current: 0,
        }
    }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    /**
     * @method contactModal
     * @description contact model
     */
    contactModal = () => {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                visible: true,
            });
        } else {
            this.props.openLoginModel()
        }
    };
    /**
     * @method handleCancel
     * @description handle cancel
     */
    handleCancel = e => {
        this.setState({
            visible: false,
            makeOffer: false,
        });
    };

    /**
    * @method componentDidMount
    * @description called after render the component
    */
    componentDidMount() {
        this.props.getBannerById(2, res => {
            if (res.status === 200) {
                const banner = res.data.success && res.data.success.banners
                this.getBannerData(banner)
            }
        })
    }
    /**
   * @method getBannerData
   * @description get banner detail
   */
    getBannerData = (banners) => {
        const top = banners.filter(el => el.bannerPosition === langs.key.top)
        const bottom = banners.filter(el => el.bannerPosition === langs.key.bottom)
        this.setState({ topImages: top, bottomImages: bottom })
    }
    /**
     * @method selectTemplateRoute
     * @description select tempalte route dynamically
     */
    selectTemplateRoute = (el) => {
        let reqData = {
            id: el.id,
            page: 1,
            page_size: 10
        }
        this.props.getClassfiedCategoryListing(reqData, (res) => {
            if (Array.isArray(res.data.data) && res.data.data.length) {
                let templateName = res.data.data[0].template_slug
                let cat_id = res.data.data[0].id
                if (templateName === TEMPLATE.GENERAL) {
                    this.props.history.push(`/classifieds/${TEMPLATE.GENERAL}/${cat_id}`)
                } else if (templateName === TEMPLATE.JOB) {
                    this.props.history.push(`/classifieds/${TEMPLATE.JOB}/${cat_id}`)
                } else if (templateName === TEMPLATE.REALESTATE) {
                    this.props.history.push(`/classifieds/${TEMPLATE.REALESTATE}/${cat_id}`)
                }
            } else {
                toastr.warning(langs.warning, langs.messages.classified_list_not_found)
            }
        })
    }
    /**
    * @method renderCategoryList
    * @description render category list
    */
    renderCategoryList = () => {
        return this.props.classifiedList.map((el) => {
            let iconUrl = `${this.props.iconUrl}${el.id}/${el.icon}`
            return <li key={el.key} onClick={() => this.selectTemplateRoute(el)}>
                <div className={'item'}>
                    <img onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_ICON
                    }}
                        // alt={data.title ? data.title : ''}
                        src={iconUrl} alt='Home' width='30' className={'stroke-color'} />
                    <Paragraph className='title'>{el.name}</Paragraph>
                </div>
            </li>
        })
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { current } = this.state;
        const { isLoggedIn } = this.props;
        const { topImages, bottomImages } = this.state
        return (
            <div className='App'>
                <Layout>
                    <Layout>
                        <AppSidebar history={history} />
                        <Layout>
                            <Row gutter={[40, 40]}>
                                <Col>
                                    <div className='sub-header fm-details-header'>
                                        <Link to='/'>{'Sport Tickets'}</Link>
                                        <Link className='fm-selected' to='/'>{'Football'}</Link>
                                    </div>
                                    <div className='inner-banner fm-details-banner'>
                                        <img src={require('../../../assets/images/bookin-detail-banner.jpg')} alt='' />
                                    </div>
                                    <div className='fm-card-box'>
                                        <Row>
                                            <Col span='20'>
                                                <h3>2020 Toyota AFL Premiership Season</h3>
                                            </Col>
                                            <Col span='4'>
                                                <ul className='fm-panel-action'>
                                                    <li>
                                                        <Link to='/'><Icon icon='wishlist' size='18' /></Link>
                                                    </li>
                                                    <li>
                                                        <Link to='/'><Icon icon='share' size='18' /></Link>
                                                    </li>
                                                </ul>
                                            </Col>
                                            <Col span='20'>
                                                <h4>19 Mar - 26 Sep 2020</h4>
                                            </Col>
                                            <Col span='4'>
                                                <ul className='fm-panel-action'>
                                                    <li>
                                                        <Link to='/'>More info</Link>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Content className='site-layout'>
                                <div className='wrap-inner fm-gradient-bg fm-cities-cards'>
                                    <Row gutter={[40, 40]}>
                                        <Col span='18'>
                                            <Button
                                                type='default'
                                                onClick={this.contactModal}
                                            >
                                                {'TICKETS'}
                                            </Button>
                                            <Table className='detail-maintable' columns={columns} dataSource={data} />
                                        </Col>
                                    </Row>
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
                <Modal
                    title='Get Tickets'
                    visible={this.state.visible}
                    className={'custom-modal style1'}
                    footer={false}
                    onCancel={this.handleCancel}
                >
                    <div className='padding'>
                        <Row>
                            <Col md={22}>
                                <div className='fm-step-form'>
                                    {/* <Row>
                                        <Col md={24} className='fm-user-box'>
                                            <div className='fm-user-image'>
                                                <img src={require('../../../assets/images/afl-logo-image.jpg')} alt='' />
                                            </div>
                                            <div className='fm-user-details'>
                                                <Text>Australian Football League (AFL)</Text>
                                                <Text>Round 1, Richmond v Carlton</Text>
                                                <Text className='fm-location'>Location</Text>
                                                <Text className='fm-address'>Melbourne Cricket Ground, Melbourne, Australia</Text>
                                            </div>
                                        </Col>
                                    </Row> */}
                                    <Progress strokeColor={{ '0%': '#FFC468', '100%': '#FFC468' }} trailColor={{ '0%': '#E3E9EF', '100%': '#E3E9EF' }} percent={50} showInfo={false} />
                                    <div className='steps-content'>
                                    
                                        {steps[current].content}
                                        {/* {this.renderContent(current)} */}
                                        {/* {current === 0 ? <StepOne /> : <StepTwo/>} */}
                                    </div>
                                    <div className='steps-action' justify='end'>
                                        {current > 0 && (
                                            <Button style={{ margin: '0 8px' }} className='fm-btn fm-back-btn' onClick={() => this.prev()}>
                                                Back
                                            </Button>
                                        )}
                                        {current < steps.length - 1 && (
                                            <Button type='primary' className='fm-btn fm-next-btn' onClick={() => this.next()}>
                                                Next
                                            </Button>
                                        )}
                                        {current === steps.length - 1 && (
                                            <Button type='primary' className='fm-btn red-btn' onClick={() => message.success('Processing complete!')}>
                                                Pay
                                            </Button>
                                        )}
                                    </div>
                                    
                                </div>
                                
                                
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, common } = store;
    const { savedCategories, categoryData } = common;
    let classifiedList = []
    let isEmpty = savedCategories.success.booking.length === 0 && savedCategories.success.retail.length === 0 && savedCategories.success.classified.length === 0 && (savedCategories.success.foodScanner === '' || (Array.isArray(savedCategories.success.foodScanner) && savedCategories.success.foodScanner.length === 0))
    if (auth.isLoggedIn) {
        if (!isEmpty) {
            isEmpty = false
            classifiedList = savedCategories.success.classified && savedCategories.success.classified.filter(el => el.pid === 0);
        } else {
            isEmpty = true
            classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
        }
    } else {
        isEmpty = true
        classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
    }
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        iconUrl: categoryData.classifiedAll !== undefined ? common.categoryData.classifiedAll.iconurl : '',
        classifiedList,
        isEmpty
    };
};
export default connect(
    mapStateToProps,
    { getClassfiedCategoryListing, getBannerById, openLoginModel }
)(BookingListDetails);