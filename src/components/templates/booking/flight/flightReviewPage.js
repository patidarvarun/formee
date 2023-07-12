import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../../../sidebar/index';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { DatePicker, Layout, message, Row, Col, List, Typography, Carousel, Tabs, Form, Input, Select, Button, Card, Breadcrumb, Table, Tag, Space, Modal, Steps, Progress, Collapse } from 'antd';
import Icon from '../../../customIcons/customIcons';
import { DetailCard } from '../../../common/DetailCard1'
import DetailCardHome from '../../../common/DetailCard'
import { getClassfiedCategoryListing, getBannerById, openLoginModel } from '../../../../actions/index';
import history from '../../../../common/History';
import { CarouselSlider } from '../../../common/CarouselSlider'
import FlightListCard from '../../../common/flightCard/FlightListCard'
import { TEMPLATE, DEFAULT_ICON } from '../../../../config/Config'
import './flight.less'
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const { RangePicker } = DatePicker;

const steps = [
    {
        content: <StepOne />,
    },
    {
        content: <StepTwo />,
    }
];

//   Step Form ends
const datedata = [
    {
        title: 'Date :',
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
        title: 'Contact Name :',
        desc: 'Sierra Ferguson',
    },
    {
        title: 'Email Address :',
        desc: 'Sierra@gmail.com',
    },
    {
        title: 'Phone Number:',
        desc: ' 0403 305 196',
    },
];
const dataPopup = [

    {
        Ticket: 'Club Members & Public Reserve',
        Ticketdetail: 'Adult',
        Price: 'AU$59.00',
        Quantity: <Input type={'number'} defaultValue='1' />,
        Amount: 'AU$59.00',

    },
    {
        Ticket: '',
        Ticketdetail: 'Concession',
        Price: 'AU$59.00',
        Quantity: <Input type={'number'} defaultValue='1' />,
        Amount: 'AU$59.00',

    },
    {
        Ticket: '',
        Ticketdetail: 'Children (6-14)',
        Price: 'AU$59.00',
        Quantity: <Input type={'number'} defaultValue='1' />,
        Amount: 'AU$59.00',

    },
    {
        Ticket: '',
        Ticketdetail: 'Children (1-5)',
        Price: 'AU$59.00',
        Quantity: <Input type={'number'} defaultValue='1' />,
        Amount: 'AU$59.00',

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
        className: ' text-right',
        dataIndex: 'Amount',
        key: 'Amount',

    }
]

function onChange(value, dateString) {
    
    
}

function onOk(value) {
    
}

function StepOne(props) {
    return (<div className='fm-step-one'>
        <Row className='fm-airline-box'>
            <Col span={24}>
                <Row align='middle' className='fm-flight-ref'>
                    <Col span={5} className='fm-airlogo-box'>
                        <img src={require('../../../../assets/images/airline-logo.jpg')} alt='' />
                        <Text className='fm-airline-names'>Qantas</Text>
                    </Col>
                    <Col span={4}>
                        <div className='fm-airline-status'>
                            <Text className='fm-airlinetime'>9:10 am</Text>
                            <Text className='fm-airportname'>MEL</Text>
                        </div>
                    </Col>
                    <Col span={9} align='center'>
                        <div className='fm-ailine-trip'>
                            <Text className='fm-aeroplane-lines'></Text>
                            <Text className='fm-timeduration'>Direct 10h 25 m</Text>
                        </div>
                    </Col>
                    <Col span={4}>
                        <div className='fm-airline-status'>
                            <Text className='fm-airlinetime'>6:35 pm <span className='fm-increment'>+1</span></Text>
                            <Text className='fm-airportname'>NRT</Text>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row className='fm-airline-box'>
            <Col span={24}>
                <Row align='middle' className='fm-flight-ref'>
                    <Col span={5} className='fm-airlogo-box'>
                        <img src={require('../../../../assets/images/airline-logo.jpg')} alt='' />
                        <Text className='fm-airline-names'>Qantas</Text>
                    </Col>
                    <Col span={4}>
                        <div className='fm-airline-status'>
                            <Text className='fm-airlinetime'>9:10 am</Text>
                            <Text className='fm-airportname'>MEL</Text>
                        </div>
                    </Col>
                    <Col span={9} align='center'>
                        <div className='fm-ailine-trip'>
                            <Text className='fm-aeroplane-lines'></Text>
                            <Text className='fm-timeduration'>Direct 10h 25 m</Text>
                        </div>
                    </Col>
                    <Col span={4}>
                        <div className='fm-airline-status'>
                            <Text className='fm-airlinetime'>6:35 pm <span className='fm-increment'>+1</span></Text>
                            <Text className='fm-airportname'>NRT</Text>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Progress strokeColor={{ '0%': '#FFC468', '100%': '#FFC468' }} trailColor={{ '0%': '#E3E9EF', '100%': '#E3E9EF' }} percent={50} showInfo={false} />
        <Form>
            <h4 className='fm-input-heading'>Passenger information</h4>
            <div>
                <Text className='fm-md-image'><img src={require('../../../../assets/images/info-icon.svg')} alt='' /></Text>
                <div className='fm-md-content'>
                    <Text>* = mandatory fields</Text>
                    Passenger name must be filled as shown on passport (valid for minimum 6 months prior to departure date on international travel) or identity card to avoid any delays and inconveniences at the airport. Once your booking is completed, name change is not allowed.
                </div>
            </div>
            <Collapse
                defaultActiveKey={['1']}
                className='fm-more-details'
            >
                <Panel header={<div className='fm-clps-img'><img src={require('../../../../assets/images/uesr-circle-icon.svg')} alt='' /> <Text className='fm-gender'>Adult</Text></div>} key='1' extra={<Text>Passenger 1</Text>}>
                    <div className='fm-review-form'>
                        <Form layout='vertical'>
                            <h5 className='fm-form-heading'>Personal information</h5>
                            <Row gutter={[7, 7]}>
                                <Col md={6}>
                                    <Form.Item>
                                        <Select
                                            placeholder='...'
                                            allowClear
                                            className='shadow-input'
                                        >
                                            <Option value='clubmembers'>Club Members $150.00</Option>
                                            <Option value='clubmembers'>Club Members $175.00</Option>
                                            <Option value='clubmembers'>Club Members $185.00</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col md={24}>
                                    <Row gutter={[35]}>
                                        <Col span={12}>
                                            <Form.Item label='First / Given name & Middle name: *'>
                                                <Input placeholder={'Enter your first name'} className='shadow-input' />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label='Last name: *'>
                                                <Input placeholder={'Enter your last name'} className='shadow-input' />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <Row gutter={[7, 7]}>
                                <Col md={24}>
                                    <Row gutter={[35]}>
                                        <Col span={12}>
                                            <h5 className='fm-form-heading'>Email address</h5>
                                            <Form.Item label='Email: *'>
                                                <Input placeholder={'Please enter your Email'} className='shadow-input' />
                                            </Form.Item>
                                            <Form.Item label='Confirm Email: *'>
                                                <Input placeholder={'Please confirm your Email'} className='shadow-input' />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <h5 className='fm-form-heading'>Phone</h5>
                                            <Row gutter={[10]}>
                                                <Col span={24}>
                                                    <Form.Item label='Mobile Phone: *' className='fm-single-row'>
                                                        <Input className='shadow-input fm-country-code' />
                                                        <Input placeholder={'Enter your Mobile phone'} className='shadow-input fm-big-input' />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <hr />
                                </Col>
                            </Row>
                            <Row gutter={[7, 7]}>
                                <Col md={24}>
                                    <Row gutter={[35]}>
                                        <Col span={12}>
                                            <h5 className='fm-form-heading'>Emergency contact</h5>
                                            <Form.Item label='Emergency contact name: *'>
                                                <Input placeholder={'Enter an emergency name'} className='shadow-input' />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <h5 className='fm-form-heading'>Emergency contact Phone</h5>
                                            <Row gutter={[10]}>
                                                <Col span={24}>
                                                    <Form.Item label='Emergency Phone: *' className='fm-single-row'>
                                                        <Input className='shadow-input fm-country-code' />
                                                        <Input placeholder={'Enter an emergency phone'} className='shadow-input fm-big-input' />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <hr />
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Panel>
            </Collapse>
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
    return (<div className='fm-step-two'>
        <Progress strokeColor={{ '0%': '#FFC468', '100%': '#FFC468' }} trailColor={{ '0%': '#E3E9EF', '100%': '#E3E9EF' }} percent={50} showInfo={false} />
        <h4 className='fm-input-heading'>Your price summary</h4>
        <div className='fm-price-summery'>
            <Row gutter={[20, 20]} align='middle'>
                <Col span={12}>
                    <Row className='fm-total-box'>
                        <Col span={12}><Text className='fm-sum-ttl'>Total</Text></Col>
                        <Col span={12} className='fm-text-right'><Text className='fm-ttl-amnt'>$891.06</Text></Col>
                    </Row>
                    <Text className='fm-tax-text'>Round trip price for all travellers (including taxes and fees)</Text>
                </Col>
                <Col span={12} className='fm-brdr-right'>
                    <Row>
                        <Col span={12}><Text className='fm-sum-ttl'>PRICE DETAILS</Text></Col>
                        <Col span={12} className='fm-text-right fm-sum-ttl'><Text className='fm-price-details'>$891.06</Text></Col>
                        <Col span={12}><Text><img src={require('../../../../assets/images/arrow-right-icon.svg')} alt='' /> 1 Adult</Text></Col>
                        <Col span={12} className='fm-text-right'><Text className='fm-price-details'>$891.06</Text></Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={12}>
                    <p>Air Transportation Charges</p>
                    <p>Taxes, Fees And Charges</p>
                </Col>
                <Col span={12} className='fm-text-right'>
                    <p>$730.00</p>
                    <p>$160.00</p>
                </Col>
            </Row>
        </div>
        <h2 className='sub-heading-main'>Itinerary</h2>
        <div className='fm-flight-departing'>
            <div className='fm-review-table'>
                <Row className='fm-tbl-header' gutter={[10, 10]}>
                    <Col span={24}>
                        <Row gutter={[40, 0]}>
                            <Col span={10}>Departing</Col>
                            <Col span={10}>Arriving</Col>
                            <Col span={4}>Flight</Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='fm-tbl-body fm-airline-box' gutter={[20, 20]}>
                    <Col span={24}>
                        <h3>Flight 1</h3>
                        <Row gutter={[40, 10]}>
                            <Col span='20'>
                                <Row className='fm-up-box'>
                                    <Col span={12}>
                                        <h5>MEL Melbourne, Tullamarine</h5>
                                        <p>Wednesday, 29 Jan 2020 <b>12:50 am</b></p>
                                    </Col>
                                    <Col span={12}>
                                        <h5>NRT Tokyo, Narita</h5>
                                        <p>Thursday, 30 Jan 2020 <b>5:50 pm</b></p>
                                    </Col>
                                </Row>
                                <Row gutter={[10, 10]}>
                                    <Col span={12}>
                                        <h5>Add-ons (Passenger 1)</h5>
                                        <p>7kg Standard carry-on baggage</p>
                                        <div className='shadow-input fm-addons-box'>
                                            <Row>
                                                <Col span={1} className='fm-v-center'><img src={require('../../../../assets/images/suitcase-icon.svg')} alt='' /></Col>
                                                <Col span={23}>
                                                    <Form.Item>
                                                        <Select
                                                            placeholder='0kg checked baggage ($0.00)'
                                                            allowClear
                                                            prefix={'hi'}
                                                        >
                                                            <Option value='clubmembers'>Club Members $150.00</Option>
                                                            <Option value='clubmembers'>Club Members $175.00</Option>
                                                            <Option value='clubmembers'>Club Members $185.00</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <h5>Add-ons (Passenger 1)</h5>
                                        <p>7kg Standard carry-on baggage</p>
                                        <div className='shadow-input fm-addons-box'>
                                            <Row>
                                                <Col span={1} className='fm-v-center'><img src={require('../../../../assets/images/suitcase-icon.svg')} alt='' /></Col>
                                                <Col span={23}>
                                                    <Form.Item>
                                                        <Select
                                                            placeholder='0kg checked baggage ($0.00)'
                                                            allowClear
                                                            prefix={'hi'}
                                                        >
                                                            <Option value='clubmembers'>Club Members $150.00</Option>
                                                            <Option value='clubmembers'>Club Members $175.00</Option>
                                                            <Option value='clubmembers'>Club Members $185.00</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span='4'>
                                <img src={require('../../../../assets/images/airline-logo.jpg')} alt='' />
                                <h5>QT200</h5>
                                <p>Qantas, Airbus A330-300 Economy class</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Row className='fm-tbl-body fm-airline-box' gutter={[20, 20]}>
                    <Col span={24}>
                        <h3>Flight 2</h3>
                        <Row gutter={[10, 10]}>
                            <Col span='20'>
                                <Row className='fm-up-box'>
                                    <Col span={12}>
                                        <h5>MEL Melbourne, Tullamarine</h5>
                                        <p>Wednesday, 29 Jan 2020 <b>12:50 am</b></p>
                                    </Col>
                                    <Col span={12}>
                                        <h5>NRT Tokyo, Narita</h5>
                                        <p>Thursday, 30 Jan 2020 <b>5:50 pm</b></p>
                                    </Col>
                                </Row>
                                <Row gutter={[10, 10]}>
                                    <Col span={12}>
                                        <h5>Add-ons (Passenger 1)</h5>
                                        <p>7kg Standard carry-on baggage</p>
                                        <div className='shadow-input fm-addons-box'>
                                            <Row>
                                                <Col span={1} className='fm-v-center'><img src={require('../../../../assets/images/suitcase-icon.svg')} alt='' /></Col>
                                                <Col span={23}>
                                                    <Form.Item>
                                                        <Select
                                                            placeholder='0kg checked baggage ($0.00)'
                                                            allowClear
                                                            prefix={'hi'}
                                                        >
                                                            <Option value='clubmembers'>Club Members $150.00</Option>
                                                            <Option value='clubmembers'>Club Members $175.00</Option>
                                                            <Option value='clubmembers'>Club Members $185.00</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <h5>Add-ons (Passenger 1)</h5>
                                        <p>7kg Standard carry-on baggage</p>
                                        <div className='shadow-input fm-addons-box'>
                                            <Row>
                                                <Col span={1} className='fm-v-center'><img src={require('../../../../assets/images/suitcase-icon.svg')} alt='' /></Col>
                                                <Col span={23}>
                                                    <Form.Item>
                                                        <Select
                                                            placeholder='0kg checked baggage ($0.00)'
                                                            allowClear
                                                            prefix={'hi'}
                                                        >
                                                            <Option value='clubmembers'>Club Members $150.00</Option>
                                                            <Option value='clubmembers'>Club Members $175.00</Option>
                                                            <Option value='clubmembers'>Club Members $185.00</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span='4'>
                                <img src={require('../../../../assets/images/airline-logo.jpg')} alt='' />
                                <h5>QT200</h5>
                                <p>Qantas, Airbus A330-300 Economy class</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <div className='fm-electronic-ticket'>
                    <Text>Method of delivery : <b>Electronic ticket</b></Text>
                    <p>It is the time-saving, paperless way to travel.</p>
                    <p>You will receive the electronic ticket reference by e-mail.</p>
                </div>
            </div>
        </div>
        <h2 className='sub-heading-main'>Passenger information</h2>
        <div className='fm-price-summery fm-passenger-info'>
            <Row className='fm-tbl-body fm-airline-box'>
                <h3 className='fm-gray-heading'>Adult 1</h3>
                <Col span={24}>
                    <Row className='fm-up-box'>
                        <Col span={12}>
                            <h5>Name :</h5>
                            <p>Ms. Sierra Ferguson</p>
                        </Col>
                        <Col span={12}>
                            <div className='fm-email-box'>
                                <h5>Email Address :</h5>
                                <p>Sierra@gmail.com</p>
                            </div>
                            <h5>Phone Number :</h5>
                            <p>+61 403 305 196</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
        <h2 className='sub-heading-main'>Baggages</h2>
        <div className='fm-price-summery fm-baggages-info'>
            <Row>
                <h3 className='fm-gray-heading'>Dangerous goods</h3>
                <Col span={24}>
                    <p>Dangerous Goods or Hazardous Material (HAZMAT) are items or articles or substances which are capable of posing a risk to health, safety, property or the environment and classified as follows:</p>
                    <ul>
                        <li>1. Explosives</li>
                        <li>2. Gases</li>
                        <li>3. Flammable Liquids</li>
                        <li>4. Flammable Solids</li>
                        <li>5. Oxidizing substances and Organic Peroxides</li>
                        <li>6. Toxic and Infectious Substances</li>
                        <li>7. Radioactive Material</li>
                        <li>8. Corrosives</li>
                        <li>9. Miscellaneous Dangerous substances and articles, including environmentally hazardous substances</li>
                    </ul>
                    <p>For your safety, Airline does not allow these dangerous goods in checked baggage, carry-on baggage and on one's person on all flights.</p>

                    <p><b>Remark :</b> limitations and restrictions are subject to local and airport regulations.</p>
                </Col>
            </Row>
        </div>
    </div>)
}




class FlightReview extends React.Component {
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
                            <Content className='site-layout'>
                                <div className='wrap-inner fm-gradient-bg fm-cities-cards'>
                                    <Row className='mb-20'>
                                        <Col md={16}>
                                            <Breadcrumb separator='|' className='pb-30'>
                                                <Breadcrumb.Item>
                                                    <Link to='/'>Home</Link>
                                                </Breadcrumb.Item>
                                                <Breadcrumb.Item>
                                                    <Link to='/classifieds'>Classified</Link>
                                                </Breadcrumb.Item>
                                                <Breadcrumb.Item>
                                                    <Link to={`/classifieds/realestate/listingPage`}>Listing</Link>
                                                </Breadcrumb.Item>
                                                <Breadcrumb.Item>Listing</Breadcrumb.Item>
                                            </Breadcrumb>
                                        </Col>
                                        <Col md={8}>
                                            <div className='location-btn'>
                                                Melbourne <Icon icon='location' size='15' className='ml-20' />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Card
                                        title={<div className='fm-btn-block'>Flight Review</div>}
                                        bordered={false}
                                        className={'home-product-list header-nospace fm-listing-page fm-flight-head'}
                                    >
                                    </Card>
                                    <div className='fm-flight-wrap'>
                                        <div className='fm-review-table'>
                                            <Row className='fm-tbl-header' gutter={[16, 16]}>
                                                <Col span={1}></Col>
                                                <Col span={23}>
                                                    <Row>
                                                        <Col span={8}>Departing</Col>
                                                        <Col span={15}>Arriving</Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='fm-tbl-body fm-airline-box' gutter={[16, 16]}>
                                                <Col span={1} className='fm-airlogo-box'>
                                                    <img src={require('../../../../assets/images/airline-logo.jpg')} alt='' />
                                                </Col>
                                                <Col span={23}>
                                                    <h3>Flight 1</h3>
                                                    <Row>
                                                        <Col span={8}>
                                                            <h5>MEL Melbourne, Tullamarine</h5>
                                                            <p>Wedzznesday, 29 Jan 2020 <b>12:50 am</b></p>
                                                        </Col>
                                                        <Col span={7}>
                                                            <h5>MEL Melbourne, Tullamarine</h5>
                                                            <p>Wedzznesday, 29 Jan 2020 <b>12:50 am</b></p>
                                                        </Col>
                                                        <Col span={7}>
                                                            <h5>MEL Melbourne, Tullamarine</h5>
                                                            <p>Wedzznesday, 29 Jan 2020 <b>12:50 am</b></p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='fm-tbl-body fm-airline-box'>
                                                <Col span={1} className='fm-airlogo-box'></Col>
                                                <Col span={23}>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={8}>
                                                            <h5>Add-ons (Passenger 1)</h5>
                                                            <p>7kg Standard carry-on baggage</p>
                                                            <div className='shadow-input fm-addons-box'>
                                                                <Row>
                                                                    <Col span={1} className='fm-v-center'><img src={require('../../../../assets/images/suitcase-icon.svg')} alt='' /></Col>
                                                                    <Col span={23}>
                                                                        <Form.Item>
                                                                            <Select
                                                                                placeholder='0kg checked baggage ($0.00)'
                                                                                allowClear
                                                                                prefix={'hi'}
                                                                            >
                                                                                <Option value='clubmembers'>Club Members $150.00</Option>
                                                                                <Option value='clubmembers'>Club Members $175.00</Option>
                                                                                <Option value='clubmembers'>Club Members $185.00</Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                        <Col span={7}>
                                                            <h5>Add-ons (Passenger 1)</h5>
                                                            <p>7kg Standard carry-on baggage</p>
                                                            <div className='shadow-input fm-addons-box'>
                                                                <Row>
                                                                    <Col span={1} className='fm-v-center'><img src={require('../../../../assets/images/suitcase-icon.svg')} alt='' /></Col>
                                                                    <Col span={23}>
                                                                        <Form.Item>
                                                                            <Select
                                                                                placeholder='0kg checked baggage ($0.00)'
                                                                                allowClear
                                                                                prefix={'hi'}
                                                                            >
                                                                                <Option value='clubmembers'>Club Members $150.00</Option>
                                                                                <Option value='clubmembers'>Club Members $175.00</Option>
                                                                                <Option value='clubmembers'>Club Members $185.00</Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row className='fm-tbl-body fm-airline-box' gutter={[16, 16]}>
                                                <Col span={1} className='fm-airlogo-box'>
                                                    <img src={require('../../../../assets/images/airline-logo.jpg')} alt='' />
                                                </Col>
                                                <Col span={23}>
                                                    <h3>Flight 1</h3>
                                                    <Row>
                                                        <Col span={8}>
                                                            <h5>MEL Melbourne, Tullamarine</h5>
                                                            <p>Wedzznesday, 29 Jan 2020 <b>12:50 am</b></p>
                                                        </Col>
                                                        <Col span={7}>
                                                            <h5>MEL Melbourne, Tullamarine</h5>
                                                            <p>Wedzznesday, 29 Jan 2020 <b>12:50 am</b></p>
                                                        </Col>
                                                        <Col span={7}>
                                                            <h5>MEL Melbourne, Tullamarine</h5>
                                                            <p>Wedzznesday, 29 Jan 2020 <b>12:50 am</b></p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='fm-tbl-body fm-airline-box'>
                                                <Col span={1} className='fm-airlogo-box'></Col>
                                                <Col span={23}>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={8}>
                                                            <h5>Add-ons (Passenger 1)</h5>
                                                            <p>7kg Standard carry-on baggage</p>
                                                        </Col>
                                                        <Col span={7}>
                                                            <h5>Add-ons (Passenger 1)</h5>
                                                            <p>7kg Standard carry-on baggage</p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </div>
                                    </div>
                                    <div className='car-list-detail car-detail-content'>
                                        <div className={'booking-detail-card booking-car-detail payable-summary'}>
                                            <table>
                                                <tr>
                                                    <td width='60%'>
                                                        <h3>Booking Summery</h3>
                                                        <p>Includes flights for 2 adults and all applicable taxes, charges and fees Payment fees may apply depending on your payment method.</p>
                                                    </td>
                                                    <td className='text-right' colSpan='2'>
                                                        <div className='price-block-left-detail'>
                                                            <table>
                                                                <tr>
                                                                    <td><p>Original Booking Price  $</p></td>
                                                                    <td><p> 1,278.66</p></td>
                                                                </tr>
                                                                <tr>
                                                                    <td> <p className='red'>Your Savings  $</p></td>
                                                                    <td> <p className='red'>84.88</p></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><p>Total Booking Price  $</p></td>
                                                                    <td><p>1,264.86</p></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><p className='total'><b>Total Booking Price  $</b></p></td>
                                                                    <td><p className='total'><b>1,264.86</b></p></td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan='3' >
                                                        <div className='sep'>&nbsp;</div>
                                                    </td>
                                                </tr>
                                                <tr className='payable-detail'>
                                                    <td>
                                                        <h3>Payable Now <span>(in Australian Dollars)</span></h3>
                                                    </td>
                                                    <td>
                                                        <div className='price-block-left-detail'>
                                                            <table>
                                                                <tr>
                                                                    <td><p className='total'><b>Total Price  $</b></p></td>
                                                                    <td><p className='total'><b>225.00</b></p></td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Button type='default' onClick={this.contactModal}>{'Book Now'}</Button>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
                <Modal
                    title='Book'
                    visible={this.state.visible}
                    className={'custom-modal style1 fm-flight-modal'}
                    footer={false}
                    onCancel={this.handleCancel}
                >
                    <div className='padding'>
                        <Row>
                            <Col md={22}>
                                <div className='fm-step-form'>
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
)(FlightReview);