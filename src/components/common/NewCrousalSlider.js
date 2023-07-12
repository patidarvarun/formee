import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Carousel } from 'antd';

/* multiple image slider component  */
export class NewCarouselSlider extends Component {

    /**
     * @method renderImages
     * @description render images
     */
    renderImages = (bannerItem, pathName, className) => {
        if (bannerItem && bannerItem.length) {
            return bannerItem && bannerItem.map((item, i) => {
                let sectionStyle = {
                    width: "100%",
                    height: "400px",
                    backgroundImage: `url(${item.bannerImage ? item.bannerImage : require('../../assets/images/default_image.jpg')})`,
                    backgroundColor:'transparent'
                };
                return (
                    <div>
                        <div key={i} style={sectionStyle}>
                            {this.props.child1}
                            {this.props.child2}
                        </div>
                    </div>

                )
            })
        } else {
            return (
                <div className='no-img-slide'>
                    <Link to={pathName} className={className}>
                        <img src={require('../../assets/images/default_image.jpg')} alt='' align='center' />
                    </Link>
                </div>
            )
        }
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { bannerItem, pathName, className } = this.props;
        return (
            <Carousel autoplay>
                {this.renderImages(bannerItem, pathName, className)}
            </Carousel>
        )
    }
}