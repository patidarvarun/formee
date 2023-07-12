import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { Typography } from 'antd';
import './bannerCard.less';
const { Title, Text, Paragraph } = Typography;

const BannerCard = ({
    imgSrc = '',
    title = '',
    titleSize,
    subTitle = '',
    titlePosition,
    onClick,
    priceLabel = '',
    price,
    pricePosition,
    textColor,
}) => {
    return (
        <Fragment>
            <div className='banner-card'>
                <Link to='/'>
                    <img src={`${imgSrc}`} alt='' />
                    <div className='banner-card-content'>
                        <div className={`title ${titlePosition}`}>
                            <h2
                                className={`${titleSize ? `fs-${titleSize}` : 'fs-18'}`}
                                style={{color: `${textColor}`}}
                            >
                                {title}
                            </h2>
                            {subTitle &&
                                <h3 style={{color: `${textColor}`}}>{subTitle}</h3>
                            }
                        </div>
                        {price &&
                            <div className={`price ${pricePosition}`}>
                                <Text style={{color: `${textColor}`}}>{priceLabel}</Text>
                                <Paragraph style={{color: `${textColor}`}}>{price}</Paragraph>
                            </div>
                        }
                    </div>
                </Link>
            </div>
        </Fragment>
    )
}

export default BannerCard;