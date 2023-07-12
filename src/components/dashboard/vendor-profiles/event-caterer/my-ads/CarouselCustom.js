import React from 'react';
import Magnifier from 'react-magnifier';
import { DEFAULT_IMAGE_CARD } from '../../../../../config/Config'
import Carousel from '../../../../common/caraousal';


class CarouselCustom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            carouselNav1: null,
            carouselNav2: null,
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
    * @method renderImages
    * @description render image list
    */
   renderImages = (item) => {
    
    if (item && item.length) {
        
        return item && Array.isArray(item) && item.map((el, i) => {
            
            return (
                <div key={i}>
                    <Magnifier
                        src={el.full_name ? el.full_name : DEFAULT_IMAGE_CARD}
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
                        src={el.full_name ? el.full_name : DEFAULT_IMAGE_CARD}
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
     * @method render
     * @description render component
     */
    render() {
        const {allImages} = this.props;

        let imgLength = allImages && Array.isArray(allImages) ? allImages.length : 1
        const carouselSettings = {
            dots: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        const carouselNavSettings = {
            speed: 500,
            slidesToShow: imgLength === 4 ? allImages.length - 1 : imgLength === 3 ? allImages.length + 2 : 4,
            slidesToScroll: 1,
            swipeToSlide: true,
            focusOnSelect: true,
            dots: false,
            arrows: true,
            infinite: true,
        };
        let crStyle = (imgLength === 2 || imgLength === 1 || imgLength === 3) ? 'product-gallery-nav hide-clone-slide' : 'product-gallery-nav '

        return (
            <React.Fragment>
                {/* <Carousel
                    {...carouselSettings}
                    asNavFor={this.state.carouselNav2}
                    ref={slider => (this.slider1 = slider)}
                    className={'product-gallery'}
                >
                    {allImages &&
                        this.renderImages(allImages)
                    }
                </Carousel>
                <Carousel
                    {...carouselNavSettings}
                    asNavFor={this.state.carouselNav1}
                    ref={slider => (this.slider2 = slider)}
                    className={crStyle}
                >
                    {allImages ? this.renderThumbImages(allImages) : <div className='slide-content hide-cloned'><img src={DEFAULT_IMAGE_CARD} alt='' /></div>}
                </Carousel> */}
                 {allImages.fileList && <Carousel className="mb-4" 
                    slides={allImages}
                />}
            </React.Fragment>
        )
    }
}

export default CarouselCustom;

