import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { Typography } from 'antd';
import Icon from '../../customIcons/customIcons';
import './tourismFlightBannerCard.less';
const { Text, Paragraph } = Typography;

const TourismBannerCard = (props) => {
    const {
        imgSrc = '',
        topTitle = '',
        topTitleColor,
        subTitle = '',
        titlePosition,
        defaultImage,
        callNext
    } = props
    return (
        <Fragment>
            <div className='tourism-flight-banner-card' onClick={props.callNext}>
                <img 
                    src={`${imgSrc}`} 
                    alt='' 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage
                    }}
                />
                <div className='tourism-flight-banner-card-content'>
                    <div className={`top-title ${titlePosition}`} style={{color: `${topTitleColor}`}}>
                        {topTitle}
                        {subTitle && <span style={{color: `${topTitleColor}`}}>{subTitle}</span>}
                    </div>
                    {/* <div className={'bottom-content'}>
                        <div className={'left'}>
                            {price &&
                                <div className={`price`}>
                                    <Text style={{color: `${textColor}`}}>{priceLabel}</Text>
                                    <Paragraph style={{color: `${textColor}`}}>{price}</Paragraph>
                                </div>
                            }
                        </div>
                        <div className={'right'}>
                            <Link to={onClick}>{linkText} <Icon icon='arrow-right' size='13' className='ml-3 fm-color-yellow' /></Link>
                        </div>
                    </div> */}
                </div>
            </div>
        </Fragment>
    )
}

export default TourismBannerCard;