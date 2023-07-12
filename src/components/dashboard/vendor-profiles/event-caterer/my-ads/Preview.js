import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import Magnifier from 'react-magnifier';
import Icon from '../../../../customIcons/customIcons';
import {Empty, Dropdown, Menu, Progress, Select, Avatar, Checkbox, List, Layout, Typography, Tabs, Row, Col, Carousel, Button, Rate, Modal, Divider, Collapse } from 'antd';
import { DEFAULT_IMAGE_CARD } from '../../../../../config/Config'
import { langs } from '../../../../../config/localization';
import {convertHTMLToText,capitalizeFirstLetter,salaryNumberFormate, displayDateTimeFormate, converInUpperCase, displayInspectionDate, formateTime } from '../../../../common';
import Map from '../../../../common/Map';
import { UserOutlined } from '@ant-design/icons';
import CarouselCustom from './CarouselCustom';
import { SocialShare } from '../../../../common/social-share'
import Review from '../../../../templates/Review'
import { rating } from '../../../../templates/CommanMethod'
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
        const { loggedInUser } = this.props;
        let realState = loggedInUser.user_type === langs.key.business && loggedInUser.role_slug === langs.key.real_estate
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

    renderReview = (classifiedDetail) => {
        const { userDetails } = this.props
        let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
        return (
            <Row className='reviews-content'>
            <Col md={8}>
                <div className='reviews-content-left'>
                    <div className='reviews-content-avatar'>
                        <Avatar
                            src={classifiedDetail.classified_users &&
                                classifiedDetail.classified_users.image_thumbnail ?
                                classifiedDetail.classified_users.image_thumbnail :
                                <Avatar size={54} icon={<UserOutlined />} />}
                            size={69}
                        />
                    </div>
                    <div className='reviews-content-avatar-detail'>
                        <Title level={4} className='mt-0 mb-4'>
                            {classifiedDetail.classified_users && classifiedDetail.classified_users.name}
                        </Title>
                        <Paragraph className='fs-10 text-gray'>
                            {classifiedDetail.classified_users &&
                                `(Member since : ${classifiedDetail.classified_users.member_since})`}
                        </Paragraph>
                        <div className='product-ratting mb-15'>
                            <Text className='text-gray'>{rate ? rate : 'No reviews yet'}</Text>
                            {rate && <Rate disabled defaultValue={rate} className='fs-15 ml-6 mr-6' style={{ position: 'relative', top: '-1px' }} />}
                            <Text className='text-gray'>{rate ? `${rate} of 5.0` : ''}</Text>
                        </div>
                        <div className='address text-gray mb-10'>{classifiedDetail.location}</div>
                        <a className='fs-10 underline'>
                            {`Found ${classifiedDetail.usercount} Ads`}
                        </a>
                    </div>
                </div>
            </Col>
            {classifiedDetail && <Review
                classifiedDetail={classifiedDetail}
                getDetails={this.props.getDetails}
            />}
        </Row>
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
            )
        })
    }

    /**
    * @method renderIcon
    * @description render icons
    */
    renderIcon = (data) => {
        const iconData = data.filter(el => el.key === 'Bedrooms' || el.key === 'Shower' || el.key === 'Parking' || el.key === 'Property Type')
        return iconData && Array.isArray(iconData) && iconData.map((el, i) => {
            return (
                <li>
                    {el.key === 'Bedrooms' && <img src={require('../../../../../assets/images/icons/bedroom.svg')} alt='' />}
                    {el.key === 'Bedrooms' && <Text>{el.value}</Text>}
                    {el.key === 'Shower' && <img src={require('../../../../../assets/images/icons/bathroom.svg')} alt='' />}
                    {el.key === 'Shower' && <Text>{el.value}</Text>}
                    {el.key === 'Parking' && <img src={require('../../../../../assets/images/icons/carpark.svg')} alt='' />}
                    {el.key === 'Parking' && <Text>{el.value}</Text>}
                    {el.key === 'Property Type' && <img src={require('../../../../../assets/images/icons/land-size.svg')} alt='' />}
                    {el.key === 'Property Type' && <Text>{el.value}</Text>}
                </li>
            )
        })
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const {classifiedDetail,loggedInUser,adPostDetail, inspectionPreview, step1, attributes, userDetails, specification, step3, allImages, preview, hide_mob_number, address, mobileNo } = this.props;
        let realState = loggedInUser.user_type === langs.key.business && loggedInUser.role_slug === langs.key.real_estate
        const location = userDetails.address ? userDetails.address : ''
        let rate = classifiedDetail && classifiedDetail.data && classifiedDetail.data.classified_hm_reviews && rating(classifiedDetail.data.classified_hm_reviews)
        let imgLength = adPostDetail && adPostDetail.classified_image && Array.isArray(adPostDetail.classified_image) ? adPostDetail.classified_image.length : 1
        const { isOpen } = this.state
        let today = Date.now()
        let inspectionData = inspectionPreview && Array.isArray(inspectionPreview) && inspectionPreview.length ? inspectionPreview[0] : ''
        let date = inspectionData.inspection_date ? moment(inspectionData.inspection_date).format('dddd DD MMMM, YYYY') : ''
        let time = inspectionData.inspection_date ? `${moment(inspectionData.inspection_start_time).format('h:mm a')} - ${moment(inspectionData.inspection_end_time).format('h:mm a')}` : ''
        let adDetails = classifiedDetail && classifiedDetail.data
        let contactNumber = adDetails && adDetails.contact_mobile && adDetails.contact_mobile
        let formatedNumber = contactNumber && contactNumber.replace(/\d(?=\d{4})/g, '*')
        const number = (
            <Menu>
                <Menu.Item key='0'>
                    <span className='phone-icon-circle'><Icon icon='call' size='14' /></span>
                    <span>{`${contactNumber}`}</span>
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
                            <Paragraph className='text-gray'>{`AD No. ${adDetails && adDetails.id}`}</Paragraph>
                            <Row gutter={[60, 16]}>
                                <Col span={11}>
                                    <Icon icon='magnifying-glass' size='20' className={'product-gallery-zoom'} />
                                    {adDetails &&<CarouselCustom
                                        // allImages={adPostDetail && adPostDetail.classified_image}
                                        allImages={adDetails.classified_image}
                                    />}

                                </Col>
                                <Col span={13}>
                                    <div className='product-detail-right'>
                                        <Title level={2} className='price'>
                                            {adDetails && adDetails.price ? `AU$${salaryNumberFormate(adDetails.price)}` : ''}
                                            {adDetails.is_ad_free ? 'Free' : ''}
                                        </Title>
                                        <Title level={4}>{adDetails && adDetails.title ? capitalizeFirstLetter(adDetails.title) : ''}</Title>
                                        {realState && classifiedDetail && classifiedDetail.spicification.length !==0 &&
                                        <ul className='info-list'>
                                            {classifiedDetail && classifiedDetail.spicification && this.renderIcon(classifiedDetail.spicification)}
                                        </ul>}
                                        <div className='address mb-12'>
                                            <Text>{address ? address : adDetails && adDetails.location}&nbsp;&nbsp;</Text>
                                            <div className='blue-link'>{'View map'}</div>
                                        </div>
                                        <div className='product-ratting mb-15'>
                                            <Text>{rate ? rate : 'No reviews yet '}</Text>
                                                {rate && <Rate disabled defaultValue={rate ? rate : 0} />}
                                            <Text>
                                                {classifiedDetail.data && classifiedDetail.data.subcategoriesname && displayDateTimeFormate(classifiedDetail.data.subcategoriesname.updated_at)}
                                            </Text>
                                        </div>
                                        <div>
                                            <Button
                                                type='ghost'
                                                shape={'round'}
                                                className={'mr-10'}
                                            >
                                                {classifiedDetail.data && classifiedDetail.data.subcategoriesname && classifiedDetail.data.subcategoriesname.name}
                                            </Button>
                                        </div>
                                        {inspectionData && adDetails && adDetails.inspection_type !== 'By Appointment' && <Dropdown overlay={dateTime} 
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
                                            {adDetails && adDetails.hide_mob_number === 1 && <li>
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
                                                        <Icon icon='view' size='20' /> <Text>{adDetails && adDetails.count}</Text>
                                                        {/* <Text className='ml-15'>
                                                            {displayDateTimeFormate(today)}
                                                        </Text> */}
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <Row gutter={[20, 0]} className='action-btn'>
                                            <Col>
                                                <Button type='default'>{'Contact'}</Button>
                                            </Col>
                                            {realState && inspectionData && adDetails && adDetails.inspection_type !== 'By Appointment' &&
                                            <Col>
                                                <Button type='default'>
                                                    Book For Inspection
                                                </Button>
                                            </Col>} 
                                            {!realState && <Col>
                                                <Button type='default'>
                                                    {'Make Offer'}
                                                </Button>
                                            </Col>}
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
                                        {adDetails && convertHTMLToText(adDetails.description)}
                                    </Paragraph>
                                    {specification && this.renderSpecification(specification)}
                                    {realState && <Row>
                                        <Col span={17}>
                                            <Divider />
                                            <div className='map-view'>
                                                {classifiedDetail && <Map list={[classifiedDetail.data]} />}
                                            </div>
                                            <Divider />
                                        </Col>
                                    </Row>}
                                </TabPane>
                                <TabPane tab='Features'
                                    // disabled key='2'
                                    key='2'
                                >
                                    {this.renderFeatures()}
                                </TabPane>
                                {realState &&
                                    <TabPane tab='Inspection'
                                        // disabled key='3'
                                        key='3'
                                    >
                                        {inspectionData && adDetails && adDetails.inspection_type !== 'By Appointment' && <div>
                                            <Title level={4}>{'Inspection times'}</Title>
                                            {this.renderInspection(inspectionPreview)}
                                        </div>}
                                        {inspectionData && adDetails && adDetails.inspection_type === 'By Appointment'&&  
                                            <Title level={4}>{'By Appointment'}</Title>}
                                            {inspectionData === '' && <Empty description={'No inspection time found'}/>}
                                    </TabPane>}
                                    <TabPane tab='Reviews'
                                        //  disabled key='4'
                                        key='4'
                                    >
                                        {classifiedDetail && classifiedDetail.data && this.renderReview(classifiedDetail.data)}
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
    const { auth, profile } = store;
    return {
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
    };
};

export default connect(mapStateToProps, null)(Preview);

