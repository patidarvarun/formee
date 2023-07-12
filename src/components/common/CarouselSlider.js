import React, { Component } from "react";
import { Carousel } from "antd";

/* multiple image slider component  */
export class CarouselSlider extends Component {
  /**
   * @method renderImages
   * @description render images
   */
  renderImages = (bannerItem, pathName, className) => {
    if (bannerItem && bannerItem.length) {
      return (
        bannerItem &&
        bannerItem.map((item, i) => {
          return (
            <div key={i}>
              {/* <a href={`http://${item.imageUrl}`} target='blank' className={className} align='center'> */}
              <a href="javascript:void(0)" className={className} align="center">
                <img
                  src={
                    item.bannerImage
                      ? item.bannerImage
                      : require("../../assets/images/default_image.jpg")
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = require("../../assets/images/default_image.jpg");
                  }}
                  alt={item.bannerPosition}
                />
              </a>
            </div>
          );
        })
      );
    }
  };

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
    );
  }
}
