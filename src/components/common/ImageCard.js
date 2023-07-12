import React from 'react';
import { Row, Col , Carousel, Typography} from 'antd'
import { DEFAULT_THUMB_IMAGE } from '../../config/Config'
import Icon from '../customIcons/customIcons';
import { capitalizeFirstLetter } from '../common'
import './imageCard.less'
const { Title, Text, Paragraph } = Typography


export const renderMostPapularItem = (mostPapular, imageUrl) => {
    if(mostPapular && mostPapular.length){
        return (
            <Row gutter={[20, 20]}>
                {mostPapular && mostPapular.slice(0,5).map((el, i) => {
                    let image = `${imageUrl}${el.id}/${el.image}`
                    let a = el.description
                    let discription = document.createElement('div');
                    discription.innerHTML = a;
                    return (
                    <Col span={i== 0 || i== 1 ? 12 : 8}>
                            <div className={'imageCard'}>
                                <div className='ad-banner'>
                                    <img 
                                        src={image ? image : DEFAULT_THUMB_IMAGE } 
                                         onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = DEFAULT_THUMB_IMAGE
                                        }}
                                        alt=''
                                    />
                                </div>
                                <div className={'imageCardContent'}>
                                    <Title level={2} className='mb-5'>
                                        {capitalizeFirstLetter(discription.innerText)}
                                    </Title>
                                    <Paragraph className='fs-18 mb-0' style={{lineHeight: '22px'}}>
                                        {capitalizeFirstLetter(el.name)}<br/>
                                        {`${el.parent_category_classifieds_count}  Ads`}
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
