import React from 'react';
import Carousel from './caraousal';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

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
     * @method render
     * @description render component
     */
    render() {
        const {allImages} = this.props;

        let imgLength = allImages && Array.isArray(allImages.fileList) ? allImages.fileList.length : 1
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
            swipeToSlide: true,
            focusOnSelect: true,
            dots: false,
            arrows: true,
            infinite: true,
            nextArrow: <RightOutlined />,
            prevArrow: <LeftOutlined />,
        };
        let crStyle = (imgLength === 2 || imgLength === 1 || imgLength === 3) ? 'product-gallery-nav hide-clone-slide' : 'product-gallery-nav '

        return (
            <React.Fragment>
                <Carousel className="mb-4" 
                    slides={allImages}
                />
            </React.Fragment>
        )
    }
}

export default CarouselCustom;

