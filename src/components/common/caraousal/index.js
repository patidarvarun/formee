import React, { Component } from "react";
import Slider from "react-slick";
import Magnifier from "react-magnifier";
import { Row, Col, Modal } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import Icon from "../../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../config/Config";
import PortfolioGallery from "../../common/caraousal/PortfolioGallery";

export default class Carousel extends Component {
  // State
  // =========================================== //
  state = {
    nav1: null,
    nav2: null,
    slides: [],
    viewGalleryModal: false,
    selectedImage: [],
    activeIndex: 0,
    showCombineList: false,
  };

  /**
   * @method componentWillReceiveProps
   * @description receive props from components
   */
  componentWillReceiveProps(nextprops, prevProps) {
    this.setState({ slides: nextprops.slides });
  }

  // Lifecycle
  // =========================================== //
  componentDidMount() {
    let videoArray = [],
      imageArray = [];
    imageArray = this.props.slides.map((v) => {
      v.crousal_type = "image";
      return v;
    });
    if (
      this.props.classifiedDetail !== undefined &&
      Array.isArray(this.props.classifiedDetail.videos)
    ) {
      videoArray = this.props.classifiedDetail.videos.map((v) => {
        v.crousal_type = "video";
        return v;
      });
    }
    let combineArray =
      this.props.classifiedDetail !== undefined &&
      Array.isArray(this.props.classifiedDetail.videos)
        ? [...imageArray, ...videoArray]
        : [...imageArray];

    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
      slides: this.props.slides,
      combineArray,
      showCombineList:
        this.props.classifiedDetail !== undefined &&
        Array.isArray(this.props.classifiedDetail.videos),
    });
  }

  hideViewGalleryModal = (e) => {
    this.setState({
      viewGalleryModal: false,
    });
  };

  viewGalleryModal = (images) => {
    const { combineArray, activeIndex } = this.state;
    // if (isLoggedIn) {
    // this.vid2Ref.current.pause();
    //this.pauseVideo()
    console.log(
      activeIndex,
      combineArray,
      "TTTT >>",
      combineArray[activeIndex].crousal_type
    );
    // if (combineArray[activeIndex].crousal_type === "image") {
    this.setState({
      viewGalleryModal: true,
      selectedImage: images,
    });
    //}
    // } else {
    //   this.props.openLoginModel();
    // }
  };
  getVideo = (elem) => {
    this.video = elem;
  };

  playVideo = () => {
    this.video.play();

    this.refs.vidRef2.getInternalPlayer().playVideo();
  };

  pauseVideo = () => {
    //  this.video.pause();
    this.refs.vidRef2.getInternalPlayer().pauseVideo();

    //   this.video.getInternalPlayer().playVideo()
  };

  render() {
    const {
      slides,
      selectedImage,
      combineArray,
      viewGalleryModal,
      activeIndex,
      showCombineList,
    } = this.state;
    const { isBooking, classifiedDetail } = this.props;
    const slickSettingsVerticalNav = {
      arrows: true,
      //vertical: true,
      infinite: false,
      //slidesToShow: slides.length >= 4 ? 4 : slides.length,
      slidesToShow: 3,
      swipeToSlide: false,
      focusOnSelect: true,
      nextArrow: <RightOutlined />,
      prevArrow: <LeftOutlined />,
      //verticalSwiping: true,
      asNavFor: this.state.nav2,
      ref: (slider) => (this.slider1 = slider),
      // adaptiveHeight: false
      slidesToScroll: 1,
      centerMode: false,
      centerPadding: "0",
      //variableWidth: true
    };

    const slickSettingsVerticalMain = {
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      asNavFor: this.state.nav1,
      ref: (slider) => (this.slider2 = slider),
      onClick: () => {
        this.viewGalleryModal(slides);
      },
      afterChange: (e) => {
        this.setState({ activeIndex: e });
      },
      // adaptiveHeight: false
    };
    let extraTag = "",
      style = "";
    if (classifiedDetail && classifiedDetail.featured_classified === 1) {
      extraTag = "Featured";
      style = "feature-tag";
    } else if (classifiedDetail && classifiedDetail.is_premium === 1) {
      extraTag = "Premium";
      style = "premium-tag";
    }
    return (
      <div className="slider-content-block" style={{ width: "370px" }}>
        <Row>
          <Col flex="370px">
            <div className="vertical-slide-right-img">
              <Icon
                icon="magnifying-glass"
                size="20"
                className={"product-gallery-zoom"}
              />
              <Slider {...slickSettingsVerticalMain}>
                {combineArray && combineArray.length !== 0 ? (
                  combineArray.map((slide, i) => (
                    <div
                      key={i}
                      className="d-block parent-d-block"
                      onClick={() => {
                        this.viewGalleryModal(slides);
                      }}
                    >
                      {extraTag ? (
                        <div className={`card-tag ${style}`}>
                          <strong>{extraTag}</strong>
                        </div>
                      ) : (
                        ""
                      )}
                      {slide.crousal_type === "image" ? (
                        <Magnifier
                          src={
                            isBooking
                              ? slide.full_image
                              : slide.thumbUrl
                              ? slide.thumbUrl
                              : slide.full_name
                              ? slide.full_name
                              : slide.url
                              ? slide.url
                              : slide.full_image_url
                              ? slide.full_image_url
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
                        // <div className="videoWrapperf">
                        //   <video controls height="360">
                        //     <source src={slide.full_url} />
                        //   </video>
                        // </div>
                        <div className="videoWrapper">
                          <video controls height="360">
                            <source src={slide.full_url} />
                          </video>
                          <div className="play-container">
                            <PlayCircleOutlined />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="d-block">
                    {extraTag ? (
                      <div className={`card-tag ${style}`}>
                        <strong>{extraTag}</strong>
                      </div>
                    ) : (
                      ""
                    )}
                    <img
                      src={DEFAULT_IMAGE_CARD}
                      className="slide-main"
                      alt=""
                    />
                  </div>
                )}
              </Slider>
            </div>
          </Col>
          <Col flex="370px">
            <div className="horizental-thumb">
              <Slider {...slickSettingsVerticalNav}>
                {combineArray && combineArray.length !== 0 ? (
                  combineArray.map((slide, i) => (
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
                              : slide.url
                              ? slide.url
                              : slide.full_image_url
                              ? slide.full_image_url
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
                        <video
                          ref="vidRef"
                          width={400}
                          paused={true}
                          controls={false}
                        >
                          <source src={slide.full_url} pause={true} />
                        </video>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="d-block">
                    <img
                      src={DEFAULT_IMAGE_CARD}
                      className="slide-nav"
                      alt=""
                    />
                  </div>
                )}
              </Slider>
            </div>
          </Col>
        </Row>
        {viewGalleryModal && (
          <Modal
            //title="View Gallery"
            visible={this.state.viewGalleryModal}
            className={"view-portfolio-gallery-modal"}
            footer={false}
            onCancel={this.hideViewGalleryModal}
            destroyOnClose={true}
          >
            <div className="view-portfolio-gallery-content view-portfolio-gallery-content-thumb">
              <PortfolioGallery
                className="mb-4"
                isBooking={true}
                slides={combineArray}
                showCombineList={showCombineList}
                imageList={selectedImage}
                activeIndex={activeIndex}
              />
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
