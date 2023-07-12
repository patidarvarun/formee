import React, { Component } from "react";
import Slider from "react-slick";
import { Row, Col } from "antd";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../config/Config";
import { SocialShare } from "../social-share";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { withRouter } from "react-router";

class PortfolioGallery extends Component {
  // State
  // =========================================== //
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      slides: [],
      currentSlide: 5,
    };
  }

  componentDidMount() {
    const {
      imageList,
      isBooking,
      activeIndex,
      test,
      slides,
      showCombineList,
    } = this.props;
    console.log("activeIndex: $$", showCombineList);
    // this.slider.slickGoTo(3);
    if (this.slider2) {
      this.slider2.slickGoTo(activeIndex);
    }
    if (showCombineList === true) {
      let slideList = slides.map((el) => {
        if (el.crousal_type === "image") {
          return {
            id: el.classified_id,
            full_image:
              el.full_image !== undefined
                ? el.full_image
                : el.full_name !== undefined
                ? el.full_name
                : el.path,
            crousal_type: "image",
          };
        } else {
          return el;
        }
      });
      this.setState({
        nav1: this.slider1,
        nav2: this.slider2,
        // slides: this.props.slides
        slides: slideList,
        currentSlide: activeIndex,
      });
    } else {
      let slideList = imageList.map((el) => {
        console.log(isBooking, "el: ", el);
        return {
          id: el.id,
          crousal_type: "image",
          full_image:
            el.full_image !== undefined
              ? el.full_image
              : el.full_name !== undefined
              ? el.full_name
              : el.full_image_url !== undefined
              ? el.full_image_url
              : el.path,
        };
      });
      console.log("slideList: ", slideList);
      this.setState({
        nav1: this.slider1,
        nav2: this.slider2,
        // slides: this.props.slides
        slides: slideList,
        currentSlide: activeIndex,
      });
    }
  }

  render() {
    const { slides, currentSlide } = this.state;
    // console.log('currentSlide: ', currentSlide);
    const { isBooking, imageList } = this.props;
    // console.log('imageList: ', imageList);
    const slickSettingsVerticalNav = {
      arrows: true,
      //vertical: true,
      infinite: true,
      slidesToShow: slides.length >= 6 ? 6 : slides.length,
      swipeToSlide: true,
      focusOnSelect: true,
      //verticalSwiping: true,
      asNavFor: this.state.nav2,
      ref: (slider) => (this.slider1 = slider),

      // adaptiveHeight: false
    };

    const slickSettingsVerticalMain = {
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      asNavFor: this.state.nav1,
      ref: (slider) => {
        return (this.slider2 = slider);
      },
      // adaptiveHeight: false
      nextArrow: <RightOutlined />,
      prevArrow: <LeftOutlined />,
      afterChange: (e) => {
        console.log("e: ", e);
        this.setState({ currentSlide: e + 1 });
      },
    };

    return (
      <div className="slider-content-block">
        <div className="vertical-slide-right-img">
          <Slider {...slickSettingsVerticalMain}>
            {slides && slides.length !== 0 ? (
              slides.map((slide, i) => (
                <div key={i} className="d-block parent-d-block">
                  {slide.crousal_type === "image" ? (
                    <img
                      src={
                        isBooking
                          ? slide.full_image
                          : slide.thumbUrl
                          ? slide.thumbUrl
                          : slide.full_name
                          ? slide.full_name
                          : DEFAULT_IMAGE_CARD
                      }
                      className="slide-main-div"
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD;
                      }}
                    />
                  ) : (
                    <video width={400} controls>
                      <source src={slide.full_url} />
                    </video>
                  )}
                </div>
              ))
            ) : (
              <div className="d-block parent-d-block">
                <img src={DEFAULT_IMAGE_CARD} className="slide-main" alt="" />
              </div>
            )}
          </Slider>
          <div className="social-share">
            <SocialShare {...this.props} showLabel={false} />
          </div>
        </div>
        <div className="horizental-thumb">
          <Slider {...slickSettingsVerticalNav}>
            {slides && slides.length !== 0 ? (
              slides.map((slide, i) => (
                <div className="d-block" key={i}>
                  {slide.crousal_type === "image" ? (
                    <img
                      src={
                        isBooking
                          ? slide.full_image
                          : slide.thumbUrl
                          ? slide.thumbUrl
                          : slide.full_name
                          ? slide.full_name
                          : DEFAULT_IMAGE_CARD
                      }
                      className="slide-nav"
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD;
                      }}
                    />
                  ) : (
                    <video width={400} paused={true} controls={false}>
                      <source src={slide.full_url} />
                    </video>
                  )}
                </div>
              ))
            ) : (
              <div className="d-block ">
                <img src={DEFAULT_IMAGE_CARD} className="slide-nav" alt="" />
              </div>
            )}
          </Slider>
        </div>
        <div className="slides-count">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    );
  }
}

export default withRouter(PortfolioGallery);
