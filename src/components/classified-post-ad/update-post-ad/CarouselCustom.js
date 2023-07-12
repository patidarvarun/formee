import React from 'react';
import Carousel from '../../common/caraousal';

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
        return (
            <React.Fragment>
                 {allImages && <Carousel className='mb-4' 
                    slides={allImages}
                />}
            </React.Fragment>
        )
    }
}

export default CarouselCustom;

