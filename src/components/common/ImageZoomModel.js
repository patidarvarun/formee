import React from 'react';
import {
  Modal
} from 'antd';
import ReactPanZoom from "react-image-pan-zoom-rotate";
import '../../components/booking/booking.less'

class ImageZoomModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: 0,
    };
  }
  
  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, image} = this.props; 
    return (
      <div className="slider-content-block">
        <Modal
            visible={visible}
            //className={"view-portfolio-gallery-modal"}
            className={'view-portfolio-gallery-modal'}
            footer={false}
            onCancel={this.props.onCancel}
            destroyOnClose={true}
      >
          <div className="view-portfolio-gallery-content">
            <div className="slider-content-block">
                <div className="vertical-slide-right-img floor-plan-image">
                  <img src={image ? image : ''}/>
                   {/* <ReactPanZoom
                      alt="cool image"
                      image={image ? image : ''}
                      style={{display: 'none'}}
                    /> */}
                </div>
            </div>
          </div>
      </Modal>
    </div>
    );
  }
}

export default ImageZoomModel
