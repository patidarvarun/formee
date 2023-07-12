import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import Magnifier from 'react-magnifier';
import Icon from '../customIcons/customIcons';
import {Empty, Dropdown, Menu, Progress, Select, Avatar, Checkbox, List, Layout, Typography, Tabs, Row, Col, Carousel, Button, Rate, Modal, Divider, Collapse } from 'antd';
import { DEFAULT_IMAGE_CARD } from '../../config/Config'
import {convertHTMLToText,salaryNumberFormate, displayDateTimeFormate, converInUpperCase, displayInspectionDate, formateTime } from '../common';
import Map from '../common/Map';
import CarouselCustom from '../common/CarouselCustom';
import { SocialShare } from '../common/social-share'
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const temp = [
    {
        rating: '5',
        review: 'Very nice',
        name: 'Joy'
    },
    {
        rating: '5',
        review: 'Good',
        name: 'Bob'
    },
    {
        rating: '5',
        review: 'Excellent',
        name: 'Mark'
    },
    {
        rating: '5',
        review: 'Very nice',
        name: 'Calley'
    },
    {
        rating: '5',
        review: 'Very nice',
        name: 'Marry'
    }
]

class Preview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            carouselNav1: null,
            carouselNav2: null,
            isOpen: false
        };
    }

    /**
     * @method componentDidMount
     * @description called after render the component
     */
    componentDidMount() {
        this.setState({
            carouselNav1: this.slider1,
            carouselNav2: this.slider2
        });
    }

    /**
     * @method renderSpecification
     * @description render specification list
     */
    renderSpecification = (data) => {
        return data && data.map((el, i) => {
            let value = el.key === 'Price' ? `AU$${salaryNumberFormate(el.value)}` : el.value
            return (
                <Row className='pt-20' key={i}>
                    <Col span={8}><Text className='strong'>{el.key}</Text></Col>
                    <Col span={14}><Text>{value}</Text></Col>
                </Row>
            )
        })
    }

    /**
    * @method renderFeatures
    * @description render features
    */
    renderFeatures = () => {
        const { step1 } = this.props;
        const realState = step1.templateName === 'realestate' ? true : false
        if (realState) {
            return (
                <Row gutter={[10, 10]}>
                    <Col span={6}>
                        <Checkbox checked>Pets allowed</Checkbox>
                    </Col>
                    <Col span={18}>
                        <Checkbox checked>Balcony / deck</Checkbox>
                    </Col>
                    <Col span={6}>
                        <Checkbox checked>Built in wardrobes</Checkbox>
                    </Col>
                    <Col span={18}>
                        <Checkbox checked>Internal laundry</Checkbox>
                    </Col>
                    <Col span={6}>
                        <Checkbox checked>Gas</Checkbox>
                    </Col>
                    <Col span={18}>
                        <Checkbox checked>Study</Checkbox>
                    </Col>
                    <Col span={6}>
                        <Checkbox checked>Garden / courtyard</Checkbox>
                    </Col>
                    <Col span={18}>
                        <Checkbox checked>Air conditioning</Checkbox>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row>
                    <Col span={18}>
                        <Collapse
                            defaultActiveKey={['1']}
                            expandIconPosition={'right'}
                            className='custom-collapse'
                        >
                            <Panel header='Audio, Visual & Communication' key='1'>
                                <Row>
                                    <Col span={6}>
                                        <Text className='strong'>Inputs</Text>
                                    </Col>
                                    <Col span={8}>
                                        <Text>Aux Input USB Socket</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <Text className='strong'>Bluetooth</Text>
                                    </Col>
                                    <Col span={8}>
                                        <Text>Bluetooth</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <Text className='strong'>Controls</Text>
                                    </Col>
                                    <Col span={8}>
                                        <Text>Multi-function Control Screen - Colour Speed Dependant Volume Stereo</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <Text className='strong'>Speakers</Text>
                                    </Col>
                                    <Col span={8}>
                                        <Text>6 Speaker Stereo</Text>
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header='Safety & Security' key='2'>
                                <div>{'text'}</div>
                            </Panel>
                            <Panel header='Safety & Security' key='3'>
                                <div>{'text'}</div>
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            )
        }
    }

    /**
   * @method filterRating
   * @description filter rating
   */
    filterRating = () => {
        return (
            <Select
                defaultValue='All Star'
                size='large'
                className='w-100 mb-15 shadow-select'
                style={{ minWidth: 160 }}
            >
                <Option value={5}>All Star</Option>
                <Option value={4}>Four Star</Option>
                <Option value={3}>Three Star</Option>
                <Option value={2}>Two Star</Option>
                <Option value={1}>One Star</Option>
            </Select>
        )
    }

    renderReview = () => {
        const { userDetails } = this.props
        const location = userDetails.address ? userDetails.address : ''
        let today = Date.now()
        return (
            <Row className='reviews-content'>
                <Col md={8}>
                    <div className='reviews-content-left'>
                        <div className='reviews-content-avatar'>
                            <Avatar
                                src={require('../../assets/images/avatar3.png')}
                                size={69}
                            />
                        </div>
                        <div className='reviews-content-avatar-detail'>
                            <Title level={4} className='mt-0 mb-4'>
                                {userDetails && userDetails.name ? converInUpperCase(userDetails.name) : ''}
                            </Title>
                            <Paragraph className='fs-10 text-gray'>
                                {`Member since : ${displayDateTimeFormate(today)})`}
                            </Paragraph>
                            <div className='product-ratting mb-15'>
                                <Text className='text-gray'>3.0</Text>
                                <Rate disabled defaultValue={3} className='fs-15 ml-6 mr-6' style={{ position: 'relative', top: '-1px' }} />
                                <Text className='text-gray'>{`3.0 of 5.0`}</Text>
                            </div>
                            <div className='address text-gray mb-10'>{location}</div>
                            <a className='fs-10 underline'>
                                {`Found 0 Ads`}
                            </a>
                        </div>
                    </div>
                </Col>
                <Col md={14}>
                    <div className='reviews-rating'>
                        <div className='product-ratting mb-15'>
                            <Text>{'3.0'}</Text>
                            <Rate disabled defaultValue={3} className='fs-15 ml-6 mr-6' style={{ position: 'relative', top: '-1px' }} />
                            <Text>{`3.0 of 5.0 / Average`}</Text>
                        </div>
                        <Row gutter={[20, 0]}>
                            <Col md={16}>
                                <ul className='progress-status'>
                                    <li>
                                        <Text className='label'>5 Excellent</Text>
                                        <Progress percent={50} />
                                    </li>
                                    <li>
                                        <Text className='label'>4 Very good</Text>
                                        <Progress percent={40} />
                                    </li>
                                    <li>
                                        <Text className='label'>3 Average</Text>
                                        <Progress percent={30} />
                                    </li>
                                    <li>
                                        <Text className='label'>2 Poor</Text>
                                        <Progress percent={20} />
                                    </li>
                                    <li>
                                        <Text className='label'>1 Terrible</Text>
                                        <Progress percent={67} />
                                    </li>
                                </ul>
                            </Col>
                            <Col md={8}>
                                {this.filterRating()}
                                <Button
                                    type='default'
                                    className='w-100'
                                >
                                    {'Leave a Review'}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    <Title level={3} className='text-gray mb-3'>
                        {'All Star(5)'}
                    </Title>
                    <List
                        itemLayout='vertical'
                        dataSource={temp && temp}
                        renderItem={item => (
                            <List.Item>
                                {item.rating === 1 && <Rate disabled defaultValue={1} className='fs-16 mb-7' />}
                                {item.rating === 2 && <Rate disabled defaultValue={2} className='fs-16 mb-7' />}
                                {item.rating === 3 && <Rate disabled defaultValue={3} className='fs-16 mb-7' />}
                                {item.rating === 4 && <Rate disabled defaultValue={4} className='fs-16 mb-7' />}
                                {item.rating === 5 && <Rate disabled defaultValue={5} className='fs-16 mb-7' />}
                                <List.Item.Meta
                                    avatar={<Avatar
                                        src={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                                        alt={''}
                                        size={37}
                                    />}
                                    title={<a href='https://ant.design'>{item.name}</a>}
                                    description={item.review}
                                />
                            </List.Item>
                        )}
                    />

                </Col>
            </Row >
        )
    }

    renderInspection = (inspection_time) => {
        return (
            <Row gutter={[30, 22]} className={'mt-20 mb-30'} style={{ alignItems: 'center' }}>
                {this.renderInspectionTime(inspection_time)}
            </Row>

        )
    }

    /**
    * @method renderImages
    * @description render image list
    */
    renderImages = (item) => {
        
        if (item && item.length) {
            
            return item && Array.isArray(item) && item.map((el, i) => {
                
                return (
                    <div key={i}>
                        <Magnifier
                            src={el.thumbUrl ? el.thumbUrl : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            alt={''}
                        />
                    </div>
                )
            })
        } else {
            return (
                <div>
                    <img src={DEFAULT_IMAGE_CARD} alt='' />
                </div>
            )
        }
    }

    /**
     * @method renderThumbImages
     * @description render thumbnail images
     */
    renderThumbImages = (item) => {
        if (item && item.length) {
            return item && Array.isArray(item) && item.map((el, i) => {
                return (
                    <div key={i} className='slide-content'>
                        <img
                            src={el.thumbUrl ? el.thumbUrl : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            alt={''}
                        />
                    </div>
                )
            })
        } else {
            return (
                <div className='slide-content hide-cloned'>
                    <img src={DEFAULT_IMAGE_CARD} alt='' />
                </div>
            )
        }
    }

    /**
    * @method renderInspectionTime
    * @description render inspection time
    */
    renderInspectionTime = (item) => {
        
        return item && Array.isArray(item) && item.length && item.map((el, i) => {
            let date = moment(el.inspection_date).format('dddd DD MMMM, YYYY')
            let time1 = moment(el.inspection_start_time).format('h:mm a')
            let time2 = moment(el.inspection_end_time).format('h:mm a')
            
            return (
                // <div>
                <Col span={14}>
                    <div className='inspection-list'>
                        <Icon icon='clock' size='18' />
                        <Text className='ml-10'>
                            {date ? date : ''}
                        </Text>
                        <div className='right'>
                            <Text>
                                {`${(time1)} - ${(time2)}`}
                            </Text>
                        </div>
                    </div>
                </Col>
                // <Col span={10}>
                //     <img src={require('../../../assets/images/icons/add-booking.svg')} width='20' alt='' />
                //     <Text className='ml-15'>Book an Inspection Time</Text>
                // </Col>
                // </div>
            )
        })
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { inspectionPreview, step1, attributes, userDetails, specification, step3, allImages, preview, hide_mob_number, address, mobileNo } = this.props;
        const realState = step1.templateName === 'realestate' ? true : false
        const location = userDetails.address ? userDetails.address : ''
        let imgLength = allImages && Array.isArray(allImages.fileList) ? allImages.fileList.length : 1
        const { isOpen } = this.state
        const carouselSettings = {
            dots: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        const carouselNavSettings = {
            speed: 500,
            slidesToShow: imgLength === 4 ? allImages.fileList.length - 1 : imgLength === 3 ? allImages.fileList.length + 2 : 4,
            slidesToScroll: 1,
            centerMode: false,
            focusOnSelect: true,
            dots: false,
            arrows: true,
            infinite: true,
        };
        let crStyle = (imgLength === 2 || imgLength === 1 || imgLength === 3) ? 'product-gallery-nav hide-clone-slide' : 'product-gallery-nav '
        let today = Date.now()
        let inspectionData = inspectionPreview && Array.isArray(inspectionPreview) && inspectionPreview.length ? inspectionPreview[0] : ''
        let date = inspectionData.inspection_date ? moment(inspectionData.inspection_date).format('dddd DD MMMM, YYYY') : ''
        let time = inspectionData.inspection_date ? `${moment(inspectionData.inspection_start_time).format('h:mm a')} - ${moment(inspectionData.inspection_end_time).format('h:mm a')}` : ''
        const number = (
            <Menu>
                <Menu.Item key='0'>
                    <span className='phone-icon-circle'><Icon icon='call' size='14' /></span>
                    <span>{mobileNo}</span>
                </Menu.Item>
            </Menu>
        )
        let currentDate = moment(today).format('YYYY-MM-DD')
        const dateTime = (
            <ul className='c-dropdown-content'>
                {inspectionPreview && Array.isArray(inspectionPreview) && inspectionPreview.length && inspectionPreview.map((el, i) =>
                    <li key={i}  >
                    {}
                        <Text className={moment(el.inspection_date).format('YYYY-MM-DD') === currentDate ? 'active-date' : ''} >{moment(el.inspection_date).format('dddd DD MMMM, YYYY')}</Text>
                        <Text className={moment(el.inspection_date).format('YYYY-MM-DD') === currentDate ? 'pull-right active-date' : 'pull-right'} >{moment(el.inspection_start_time).format('h:mm a')} - {moment(el.inspection_end_time).format('h:mm a')}</Text>
                    </li>
                )}
            </ul>
        )
        return (
            <Modal
                visible={this.props.visible}
                className={'custom-modal prf-prevw-custom-modal'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <React.Fragment>
                    <Layout>
                        <div className='wrap-inner less-padding'>
                            <Paragraph className='text-gray'>{'AD No. CL-AD-6282567'}</Paragraph>
                            <Row gutter={[60, 16]}>
                                <Col span={11}>
                                    {/* <Icon icon='magnifying-glass' size='20' className={'product-gallery-zoom'} /> */}
                                    <CarouselCustom
                                        allImages={allImages}
                                    />

                                </Col>
                                <Col span={13}>
                                    <div className='product-detail-right'>
                                        <Title level={2} className='price'>
                                            {attributes.Price ? `'AU$'${salaryNumberFormate(attributes.Price)}` : ''}
                                        </Title>
                                        <Title level={4}>{attributes.title ? attributes.title : ''}</Title>
                                        {realState &&
                                            <ul className='info-list'>
                                                <li><img src={require('../../assets/images/icons/bedroom.svg')} alt='' /> <Text>{'2'}</Text></li>
                                                <li><img src={require('../../assets/images/icons/bathroom.svg')} alt='' /> <Text>{'2'}</Text></li>
                                                <li><img src={require('../../assets/images/icons/carpark.svg')} alt='' /> <Text>{'1'}</Text></li>
                                                <li><img src={require('../../assets/images/icons/land-size.svg')} alt='' /> <Text>{'658 m2'}</Text></li>
                                            </ul>}
                                        <div className='address mb-12'>
                                            <Text>{address ? address : location}&nbsp;&nbsp;</Text>
                                            <div className='blue-link'>{'View map'}</div>
                                        </div>
                                        <div className='product-ratting mb-15'>
                                            <Text>3.0</Text>
                                            <Rate allowHalf defaultValue={3.0} />
                                            <Text>3.0 of 5.0 </Text>
                                            <div className='blue-link'>
                                                {`0 reviews`}
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                                type='ghost'
                                                shape={'round'}
                                                className={'mr-10'}
                                            >
                                                {step1.subCategoryData.name}
                                            </Button>
                                        </div>
                                        {inspectionData && attributes.inspection_type !== 'By Appointment' && <Dropdown overlay={dateTime} 
                                            className={isOpen ? 'c-dropdown mt-20 head-active': 'c-dropdown mt-20 head'} 
                                            onVisibleChange={(e) => this.setState({isOpen: e})}>
                                            <Button >
                                                <Icon icon='clock' size='19' className='mr-10' />
                                                <Text className='strong mr-10'>Inspection</Text> <Text>{`${date} ${time}`}</Text>
                                                <Icon icon='arrow-down' size='16' className='ml-12' />
                                            </Button>
                                        </Dropdown>}
                                        <div className='action-card' style={{ marginTop: '6.5rem', marginBottom: '6.2rem' }}>
                                            <ul>
                                                {hide_mob_number === true && <li>
                                                    <Dropdown overlay={number} trigger={['click']} overlayClassName='show-phone-number'>
                                                        <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                                            <Icon icon='call' size='20' onClick={e => e.preventDefault()} />
                                                        </div>
                                                    </Dropdown>
                                                </li>}
                                                <li>
                                                    <Icon
                                                        icon='wishlist'
                                                        size='20'
                                                    />
                                                </li>
                                                <li><Icon icon='share' size='20' /></li>
                                                <li>
                                                    <div>
                                                        <Icon icon='view' size='20' /> <Text>{'456'}</Text>
                                                        <Text className='ml-15'>
                                                            {displayDateTimeFormate(today)}
                                                        </Text>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <Row gutter={[20, 0]} className='action-btn'>
                                            <Col>
                                                <Button type='default'>{'Contact'}</Button>
                                            </Col>
                                            <Col>
                                                <Button type='default'>
                                                    {realState ? 'Book For Inspection' : 'Make Offer'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Tabs type='card' className={'tab-style3 product-tabs'}>
                                <TabPane
                                    tab='Description'
                                    key='1'
                                // defaultActiveKey='1'
                                >
                                    <Paragraph>
                                        {attributes.description && convertHTMLToText(attributes.description)}
                                    </Paragraph>
                                    {specification && this.renderSpecification(specification)}
                                    {realState && <Row>
                                        <Col span={17}>
                                            <Divider />
                                            <div className='map-view'>
                                                {<Map list={[]} />}
                                            </div>
                                            <Divider />
                                        </Col>
                                    </Row>}
                                </TabPane>
                                {/* <TabPane tab='Features'
                                    // disabled key='2'
                                    key='2'
                                >
                                    {this.renderFeatures()}
                                </TabPane> */}
                                {realState &&
                                    <TabPane tab='Inspection'
                                        // disabled key='3'
                                        key='3'
                                    >
                                        {inspectionData && attributes.inspection_type !== 'By Appointment' && <div>
                                            <Title level={4}>{'Inspection times'}</Title>
                                            {this.renderInspection(inspectionPreview)}
                                        </div>}
                                        {inspectionData && attributes.inspection_type === 'By Appointment'&&  
                                            <Title level={4}>{'By Appointment'}</Title>}
                                            {inspectionData === '' && <Empty description={'No inspection time found'}/>}
                                    </TabPane>}
                                    <TabPane tab='Reviews'
                                        //  disabled key='4'
                                        key='4'
                                    >
                                        {this.renderReview()}
                                    </TabPane>
                            </Tabs>
                        </div>
                    </Layout>
                </React.Fragment>
            </Modal>
        )
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth, postAd, profile } = store;
    const { step1, attributes, step3, allImages, preview } = postAd;
    return {
        loggedInDetail: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
        step1,
        attributes: attributes,
        specification: attributes.specification,
        inspectionPreview: attributes.inspectionPreview,
        step3,
        allImages, preview
    };
};

export default connect(mapStateToProps, null)(Preview);

