import React, { Fragment } from 'react'
import { Collapse, Progress, Typography, Select, Input, Avatar, Tabs, Row, Col, Checkbox, Button, Rate, Modal, Dropdown, Divider } from 'antd';
import { convertHTMLToText } from '../../common';
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../config/Config'
import { CaretRightOutlined } from '@ant-design/icons';
import ShowMoreText from 'react-show-more-text';
import { Link } from 'react-router-dom';
import ShowMore from 'react-show-more';
import ShowDescription from '../../common/ShowDescription'
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;


/**
 * @method calculaterating
 * @description rating calculatios
 */
const calculaterating = (data, number) => {
    const count = data.filter(el => el === number).length
    return count
}

/**
 * @method renderRating
 * @description render ratings
 */
export const renderRating = (bookingDetail) => {
    const temp = bookingDetail && bookingDetail.valid_trader_ratings
    let data = temp && temp.length && temp.map(el => el.rating)
    let star1, star2, star3, star4, star5, total;
    if (data && data !== undefined) {
        star5 = calculaterating(data, 5);
        star4 = calculaterating(data, 4);
        star3 = calculaterating(data, 3);
        star2 = calculaterating(data, 2);
        star1 = calculaterating(data, 1);
        total = star5 + star4 + star3 + star2 + star1
    }
    return (
        <Col md={24}>
            <ul className='progress-status'>
                <li>
                    <Text className='label'>5 Excellent</Text>
                    <Progress percent={parseInt((star5 * 100) / total)} />
                </li>
                <li>
                    <Text className='label'>4 Very good</Text>
                    <Progress percent={parseInt((star4 * 100) / total)} />
                </li>
                <li>
                    <Text className='label'>3 Average</Text>
                    <Progress percent={parseInt((star3 * 100) / total)} />
                </li>
                <li>
                    <Text className='label'>2 Poor</Text>
                    <Progress percent={parseInt((star2 * 100) / total)} />
                </li>
                <li>
                    <Text className='label'>1 Terrible</Text>
                    <Progress percent={parseInt((star1 * 100) / total)} />
                </li>
            </ul>
        </Col>
    )
}

const splitDescription = (description) => {
    if (description && description.length > 500) {
        return description.substring(0, 500) + "..."
    } else {
        return description
    }
}

/**
* @method renderInfoTab
* @description render info tab
*/
export const renderInfoTab = (bookingDetail, infoTabName, slug, data, viewGalleryModal, subCategoryName, changeDescription, showMoreText) => {
    if (bookingDetail !== undefined) {
        //
    }
    const portfolio =
        bookingDetail !== undefined &&
            Array.isArray(bookingDetail.profile_portfolios) ?
            bookingDetail.profile_portfolios : []
    let label = '';
    if (slug === TEMPLATE.HANDYMAN) {
        label = 'Charge Rate(AUD)'
    } else {
        label = 'Price (AUD)'
    }
    let visible = slug === TEMPLATE.HANDYMAN || slug === TEMPLATE.PSERVICES || slug === TEMPLATE.EVENT
    let info = bookingDetail && bookingDetail.trader_profile
    let dietaries = info && Array.isArray(info.dietaries) && info.dietaries.length ? info.dietaries : []
    let dietaries_name = []
    dietaries && dietaries.length && dietaries.map(el => {
        dietaries_name.push(el.name)
    })
    // let description = bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.description && (bookingDetail.trader_profile.description)
    let htmlDes = []
    let plainString = []
    if (bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.description) {
        plainString = bookingDetail.trader_profile.description.replace(/<[^>]+>/g, '');

        //Html is less than 1000 char then its fully Rendered
        if (plainString.length < 1000 || showMoreText) {
            let arr = convertHTMLToText(bookingDetail.trader_profile.description)
            htmlDes = arr;
        } else if (bookingDetail && bookingDetail.trader_profile && bookingDetail.trader_profile.description) {
            let arr = convertHTMLToText(bookingDetail.trader_profile.description)

            //when arr returns Array type
            if (Array.isArray(arr)) {
                let childLength = arr.length / 2
                htmlDes.push(arr.splice(0, childLength))

                //when arr returns Object type     
            } else if (typeof arr === 'object') {

                //If chilerens are Array type
                if (Array.isArray(arr.props.children)) {
                    let childLength = arr.props.children.length / 2
                    htmlDes.push(arr.props.children.splice(0, childLength))
                } else {
                    let text = showMoreText ? arr.props.children : arr.props.children.substring(0, 500);
                    htmlDes = text
                }
            }

        }
    }


    return (
        <TabPane tab={infoTabName} key='1'>
            <Row gutter={[60, 10]} className="info-tab-content service-tab-content">
                <Col span={14}>
                    <Title level={3}>About Us</Title>
                    {bookingDetail && <Paragraph>
                        {/* <ShowMoreText
                            lines={12}
                            more={<div className="align-right pt-15">
                                <span className="blue-link">{'Read more'}</span>
                            </div>}
                            less={<div className="align-right pt-15">
                                <span className="blue-link">{'Read less'}</span>
                            </div>}
                            className='content-css'
                            anchorClass='my-anchor-css-class align-right pt-15'
                        > */}
                        {bookingDetail.trader_profile && bookingDetail.trader_profile.description && htmlDes}

                        {(showMoreText || plainString.length < 1000) && <div>
                            {info && subCategoryName === 'Fitness' && <div>
                                <Text strong>Amenities</Text>
                                <ul className="ul-list-amenities">
                                    {info.fitness_amenities.map((el, i) => {
                                        return <Col span={24} key={i}>
                                            <li>{el.name}</li>
                                        </Col>
                                    })}
                                </ul>
                            </div>}

                            {slug === TEMPLATE.EVENT && <div>
                                {info && info.features && <div>
                                    <Text strong>Features</Text>
                                    <ul>
                                        <span>{info && info.features}</span>
                                    </ul>
                                </div>}
                                {info && info.service_type && <div>
                                    <Text strong>Service type</Text>
                                    <ul>
                                        <span>{info && info.service_type}</span>
                                    </ul>
                                </div>}

                                {info && info.service_area && <div>
                                    <Text strong>Service area</Text>
                                    <ul>
                                        <span>{info.service_area}</span>
                                    </ul>
                                </div>}
                                {info && info.venues && (subCategoryName === 'Venues' || subCategoryName === 'Caterers') && <div>
                                    <Text strong>Venues</Text>
                                    <ul>
                                        <span>{info.venues}</span>
                                    </ul>
                                </div>}
                                {info && info.capacity_info && (subCategoryName === 'Venues' || subCategoryName === 'Caterers') && <div>
                                    <Text strong>Capacity</Text>
                                    <ul>
                                        <span>{info.capacity_info}</span>
                                    </ul>
                                </div>}
                                {dietaries_name && Array.isArray(dietaries_name) && dietaries_name.length !== 0 && (subCategoryName === 'Venues' || subCategoryName === 'Caterers') && <div>
                                    <Text strong>Dietary</Text>
                                    <ul>
                                        <span>{dietaries_name.join()}</span>
                                    </ul>
                                </div>}
                            </div>}
                        </div>}
                        {plainString.length > 1000 &&
                            <div className="align-right pt-15" onClick={() => changeDescription(!showMoreText)} >
                                <span className="blue-link">{showMoreText ? 'Read less' : 'Read more'}</span>
                            </div>
                        }


                        {/* </ShowMoreText> */}
                    </Paragraph>}
                    {/* {visible && <Row>
                        <Text className="fs-14 mb-10">
                            <b>{label}</b>
                        </Text>
                    </Row>}
                    {bookingDetail && visible && <Row gutter={[10, 10]}>
                        <Col span={6}>
                            {bookingDetail.trader_profile && bookingDetail.trader_profile.rate_per_hour &&
                                <Checkbox checked>{`Start from  $${bookingDetail.trader_profile.rate_per_hour} / hour`}</Checkbox>
                            }
                        </Col>
                    </Row>}
                    {bookingDetail && visible && <Row gutter={[10, 10]}>
                        <Col span={6}>
                            {bookingDetail.trader_profile && bookingDetail.trader_profile.basic_quote &&
                                <Checkbox checked>Basic Quote</Checkbox>
                            }
                        </Col>
                    </Row>} */}
                </Col>
                <Col span={10}>
                    {(portfolio && portfolio.length !== 0) ? <Title level={3}>View Gallery</Title> : ''}
                    {(subCategoryName === 'Fitness' && bookingDetail.service_images.length) ? <Title level={3}>View Gallery</Title> : ''}
                    <ul className="product-detail-view-gallery">
                        {subCategoryName === 'Fitness' ?
                            bookingDetail.service_images.slice(0, 6).map((item, index) => {
                                return (
                                    <li onClick={() => {
                                        // bookingDetail.service_images.length < 6 &&
                                         viewGalleryModal(bookingDetail.service_images, index)
                                    }}>
                                        <img src={item.full_image} alt='' />
                                    </li>
                                );
                            }) :
                            portfolio.slice(0, 6).map((item, index) => {
                                return (
                                    <li onClick={() => {
                                        // portfolio.length < 6 &&
                                         viewGalleryModal(portfolio, index)
                                    }} >
                                        <img src={item.path} alt='' />
                                    </li>
                                );
                            })}
                    </ul>
                    {portfolio.length > 6 && <div className="align-right">
                        <p style={{ cursor: 'pointer' }} onClick={() => viewGalleryModal(portfolio)} className="blue-link">{'View All'}</p>
                    </div>}
                    {info && bookingDetail.service_images.length > 6 && <div className="align-right">
                        <p style={{ cursor: 'pointer' }} onClick={() => viewGalleryModal(bookingDetail.service_images)} className="blue-link">{'View All'}</p>
                    </div>}
                </Col>
            </Row>
        </TabPane>
    )
}

const renderServices = (vendor_services) => {
    if (vendor_services && Array.isArray(vendor_services) && vendor_services.length) {
        return vendor_services.map((el, i) => {
            return (
                <Col span={12} key={i}>
                    <Text strong>{el.title}</Text>
                    <ul>
                        <li>{convertHTMLToText(el.description)}</li>
                    </ul>
                </Col>
            )
        })
    }
}

/**
* @method renderServiceTab
* @description render service tab
*/
export const renderServiceTab = (bookingDetail, slug) => {
    let vendor_services = bookingDetail && bookingDetail.vendor_services
    let discription = bookingDetail && bookingDetail.trader_profile && convertHTMLToText(bookingDetail.trader_profile.trader_service.description)
    return (
        <TabPane tab='Service' key='2'>
            <Row gutter={[60, 10]} className="service-tab-content service-tab-content-ul-data">
                <Col span={24}>
                    <Title level={3}>Services</Title>
                    <Row>
                        {renderServices(vendor_services)}
                        {/* <Col span={8}>
                            <Text strong>Repairs & installation of gates & doors</Text>
                            <ul>
                                <li>- Locks, door handles & closers</li>
                                <li>- Fencing repairs & painting</li>
                                <li>- Tiling repairs & replacement</li>
                                <li>- Decking & pergolas</li>
                                <li>- Plaster/paint work</li>
                                <li>- Privacy screens</li>
                                <li>- Stainless steel work</li>
                                <li>- Fixing & mounting</li>
                            </ul>
                            <Text strong>Commercial work experts</Text>
                            <ul>
                                <li>- Equipment ready</li>
                            </ul>
                        </Col>
                        <Col span={8}>
                            <Text strong>Insurance work</Text>
                            <ul>
                                <li>- TV sales service & repairs</li>
                                <li>- Installation of wall mounts & recessed plaster work</li>
                            </ul>

                            <Text strong>CCTV camera installation & service</Text>
                            <ul>
                                <li>- Alarm system installation & service</li>
                                <li>- Push bike repairs & service</li>
                            </ul>

                            <Text strong>Rubbish removal & vacate cleaning</Text>
                            <ul>
                                <li>- Access control</li>
                                <li>- Cabinets made & installed</li>
                            </ul>
                            <Text>All domestic & commercial maintenance & repairs.</Text>
                        </Col> */}
                    </Row>
                    {/* {bookingDetail && <Paragraph>
                        {bookingDetail.trader_profile && bookingDetail.trader_profile.trader_service && bookingDetail.trader_profile.trader_service.name}
                    </Paragraph>}
                    <Row>
                        <Col span={24}>
                            {discription}
                        </Col>
                    </Row> */}
                </Col>
            </Row>
        </TabPane>
    )
}



/**
* @method renderPortFolioTab
* @description render port folio tab
*/
export const renderPortFolioTab = (data, slug) => {
    const portfolio = data && Array.isArray(data.portfolio) && data.portfolio.length && data.portfolio[0].files ? data.portfolio[0].files : []
    return (
        <TabPane tab='Portfolio' key='3' className="tab-portfolio">
            <Title level={4}>{'Reference Files'}</Title>
            <Collapse defaultActiveKey={['1']} ghost>
                <Panel header="This is panel header 1" key="3">
                    <p>{'hjgfhj'}</p>
                </Panel>
                <Panel header="This is panel header 2" key="4">
                    <p>{'jhgfj'}</p>
                </Panel>
                <Panel header="This is panel header 3" key="5">
                    <p>{'hgfj'}</p>
                </Panel>
            </Collapse>
        </TabPane>
    )
}

/**
* @method renderMiddleBannerCard
* @description render middle banner cards
*/
export const renderMiddleBannerCard = (bannerItem) => {
    if (bannerItem && bannerItem.length) {
        return bannerItem && bannerItem.map((item, i) => {
            return (
                <Fragment>
                    <div className='banner-card'>
                        <a href={`http://${item.imageUrl}`} target='blank'>
                            <img
                                src={item.bannerImage ? item.bannerImage : require('../../../assets/images/default_image.jpg')}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = require('../../../assets/images/default_image.jpg')
                                }}
                                alt={item.bannerPosition}
                            />
                        </a>
                    </div>
                </Fragment>
            )
        })
    } else {
        return (
            <div className='no-img-slide'>
                <img src={require('../../../assets/images/default_image.jpg')} alt='' />
            </div>
        )
    }
}