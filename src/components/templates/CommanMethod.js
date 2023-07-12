import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Row, Card, Avatar, List, Rate, Col, Progress, Typography } from 'antd';
import { DEFAULT_IMAGE_CARD, DEFAULT_THUMB_IMAGE } from '../../config/Config';
import Icon from '../customIcons/customIcons';
import { getClassifiedSubcategoryRoute, getClassifiedDetailPageRoute, getRetailDetailPageRoute,getRetailSubcategoryRoute } from '../../common/getRoutes'
import { salaryNumberFormate, capitalizeFirstLetter } from '../common';
const { Text, Title, Paragraph } = Typography
const list = []


/**
 * @method renderReview
 * @description render review list
 */
export const renderReview = (userList) => {
    

    return (
        <div>
            <List
                itemLayout='vertical'
                dataSource={userList && userList}
                renderItem={item => (
                    <List.Item>
                        <Rate disabled defaultValue={item.rating} className='fs-16 mb-7' />
                        <List.Item.Meta
                            avatar={<Avatar
                                src={item.reviews_bt_users &&
                                    item.reviews_bt_users.image_thumbnail ?
                                    item.reviews_bt_users.image_thumbnail :
                                    'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                }
                                alt={''}
                                size={37}
                            />}
                            title={<a href='https://ant.design'>{item.reviews_bt_users && item.reviews_bt_users.fname}</a>}
                            description={item.review}
                        />
                    </List.Item>
                )}
            />
            <div className='align-right'>
                {userList && userList.length > 5 && <div className='red-link'>{'Read more reviews'}</div>}
            </div>
        </div>
    )
}

/**
 * @method papularView
 * @description render papolar view data
 */
export const papularView = (papularData, parameter, templateName, history) => {
    let categoryName = parameter.categoryName;
    let categoryId = parameter.categoryId;
    return papularData && papularData.map((data, i) => {
        console.log('data', data)
        let path = '', detailPath = ''
        if(templateName === 'retail'){
            detailPath = getRetailDetailPageRoute(data.parent_categoryid,data.parentCategoryName,data.id)
            path = getRetailSubcategoryRoute(data.parentCategoryName, data.parent_categoryid, data.childCategoryName, data.child_category_id)
        }else {
            path = getClassifiedSubcategoryRoute(templateName, categoryName, categoryId, data.categoryName, data.category_id, false)
            detailPath = getClassifiedDetailPageRoute(templateName, categoryId, categoryName, data.id)
        }
        return (
            <Col className='gutter-row' md={8} key={i} >
                <Card
                    bordered={false}
                    className={'detail-card horizontal'}
                    cover={
                        <Link to={detailPath}> <img
                            alt={data.discription}
                            src={data.imageurl ? data.imageurl : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            alt={data.title ? data.title : ''}
                        /></Link>
                    }
                >
                    <div className='price-box'>
                        <div className='price'>
                            {data.price ? `AU$${salaryNumberFormate(parseInt(data.price))}` : ''}
                        </div>
                    </div>
                    <Link to={detailPath}><div className='sub-title'>
                        {data.title}
                    </div></Link>
                    <div className='action-link'>
                        <Link to={path}>{templateName == 'retail' ? data.parentCategoryName : data.categoryName}</Link>
                    </div>
                </Card>

                {/* {redirect && <Redirect push
                    to={{
                        pathname: redirect
                    }}
                />
                } */}
            </Col>
        )
    })

}

/**
 * @method papularView
 * @description render papolar view data
 */
export const renderBuyCards = () => {
    let arr = [1, 2, 3, 4, 5, 6]
    return arr && arr.map((data, i) => {
        return (
            <Col md={8}>
                <Card
                    bordered={false}
                    className={'detail-card horizontal'}
                >
                    <Title level={4} className='text-gray pt-10'>East</Title>
                    <div className='sub-title text-gray pt-4'>
                        <Icon icon='real-estate' size='19' className='mr-8' /> {'658 properties for sale'}
                    </div>
                    <div className='action-link underline pb-10'>
                        <Link to='/'>{'View properties'}</Link>
                    </div>
                </Card>
            </Col>
        )
    })
}

/**
 * @method calculaterating
 * @description rating calculatios
 */
const calculaterating = (data, number) => {
    const count = data.filter(el => el === number).length
    return count
}

/**
 * @method setPriority
 * @description set priority acc to keys
 */
export const setPriority = (res) => {
    
    if (Array.isArray(res) && res.length) {
        let priority1 = [];
        let priority2 = []
        let priority3 = []
        res.map((el) => {

            if (el.is_premium === 1) {
                priority1.push(el);
            } else if (el.featured_classified === 1) {
                priority2.push(el);
            } else {
                priority3.push(el);
            }
        })
        const filteredList = [...priority1, ...priority2, ...priority3];
        return filteredList
    } else {
        return []
    }
}

/**
 * @method getRatingCounts
 * @description get rating counts
 */
const getRatingCounts = (ratingCount) => {
    
    const temp = ratingCount
    let data = temp && temp.length && temp.map(el => el.rating)
    if (data && data !== undefined) {
        let star5 = calculaterating(data, 5);
        let star4 = calculaterating(data, 4);
        let star3 = calculaterating(data, 3);
        let star2 = calculaterating(data, 2);
        let star1 = calculaterating(data, 1);
        let total = star5 + star4 + star3 + star2 + star1
        let avg = (5 * star5 + 4 * star4 + 3 * star3 + 2 * star2 + 1 * star1) / (total)
        let rating = parseInt(avg) + '.' + '0'
        
        return rating
    }
}

/**
 * @method rating
 * @description handle ratings
 */
export const rating = (ratingCount) => {
    let totalRating = getRatingCounts(ratingCount)
    return totalRating
}

/**
 * @method renderRating
 * @description render ratings
 */
export const renderRating = (classifiedDetail) => {
    const temp = classifiedDetail
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
        <div className='reviews-rating-status-left'>
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
        </div>
    )
}

/**
 * @method ratingLabel
 * @description render rating label
 */
export const ratingLabel = (rate) => {
    let rateLabel = '';
    if (rate === '5.0') {
        rateLabel = 'Excelent'
    } else if (rate === '4.0') {
        rateLabel = 'Good'
    } else if (rate === '3.0') {
        rateLabel = 'Average'
    } else if (rate === '2.0') {
        rateLabel = 'Poor'
    } else if (rate === '1.0') {
        rateLabel = 'Terrible'
    }
    return rateLabel
}


/**
 * @method ratingLabel
 * @description render rating label
 */
export const renderMostPapularItem = (mostPapular) => {
    if (mostPapular && mostPapular.length) {
        return (
            <Row gutter={[20, 20]}>
                {mostPapular && mostPapular.slice(0, 6).map((el, i) => {
                    
                    let path = getRetailDetailPageRoute(el.parent_categoryid, el.parentCategoryName, el.id)
                    return (
                        <Col span={8}>
                            <div className={'imageCard'}>
                                <div className='ad-banner'>
                                    <Link to={path}><img
                                        src={el.imageurl ? el.imageurl : DEFAULT_THUMB_IMAGE}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = DEFAULT_THUMB_IMAGE
                                        }}
                                        alt=''
                                    />
                                    </Link>
                                </div>
                                <div className={'imageCardContent'}>
                                    <Title level={2} className='mb-5'>
                                        {capitalizeFirstLetter(el.title)}
                                    </Title>
                                    <Paragraph className='fs-18 mb-0' style={{ lineHeight: '22px' }}>
                                        {capitalizeFirstLetter(el.categoryName)}<br />
                                        {`${el.count}  Ads`}
                                        <Icon icon='arrow-right' size='15' className='ml-40' />
                                    </Paragraph>
                                </div>
                            </div>
                        </Col>
                    )
                })}
            </Row>
        )
    }
}


