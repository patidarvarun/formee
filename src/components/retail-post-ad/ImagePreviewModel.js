import React, { Component } from "react";
import { connect } from "react-redux";
import ImgCrop from "antd-img-crop";
import Slider from "react-slick";
import { Button, message, Upload } from "antd";
import { DEFAULT_IMAGE_CARD } from "../../config/Config";
import { LeftOutlined, RightOutlined, CheckOutlined } from "@ant-design/icons";
import { withRouter } from "react-router";
import { uploadRetailProductImage } from "../../actions";

class ImagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      slides: [],
      currentSlide: 1,
      currentField2: [],
      fileList: [],
      set_as_cover_photo: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called before render the component
   */
  componentDidMount() {
    const { currentField, index } = this.props;
    const { currentSlide } = this.state;
    let imageList =
      currentField.group_inventory_attribute &&
      currentField.group_inventory_attribute[index] &&
      currentField.group_inventory_attribute[index].image;
    console.log("imageList", imageList);
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
      slides: imageList.length ? imageList : "",
      fileList: imageList,
      currentSlide: currentSlide,
    });
  }

  /**
   * @method dummyRequest
   * @description dummy image upload
   */
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  /**
   * @method renderImageUpload
   * @description render image upload
   */
  renderImageUpload = () => {
    const { fileList } = this.state;
    const uploadButton = (
      <div>
        <img
          src={require("../../assets/images/icons/plus-circle-red.svg")}
          alt="Add"
          width="36"
          height="36"
        />
      </div>
    );

    return (
      <div className="file-uploader">
        <ImgCrop>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={true}
            fileList={fileList}
            customRequest={this.dummyRequest}
            onPreview={(file) =>
                this.handleSliderImage(file)
            }
            onChange={({ file, fileList }) => {
              const isJpgOrPng =
                (file && file.type === "image/jpeg") ||
                (file && file.type === "image/png") ||
                file.type === "image/jpg";
              const isLt2M = file && file.size / 1024 / 1024 < 2;
              if (!isJpgOrPng) {
                message.error("You can only upload JPG , JPEG  & PNG file!");
                return false;
              } else if (!isLt2M) {
                message.error("Image must smaller than 2MB!");
                return false;
              } else {
                this.setState({ fileList });
                this.props.setImages(fileList);
              }
            }}
          >
            {fileList.length >= 5 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      </div>
    );
  };

  /**
   * @method handleSetAsCoverPhoto
   * @description set as cover photo
   */
  handleSetAsCoverPhoto = (slides) => {
    const { fileList } = this.state;
    let list = fileList.filter((el) => el.uid !== slides.uid);
    let finalList = [slides, ...list];
    this.setState({ fileList: finalList,slides:finalList,set_as_cover_photo: true}, () => {
      this.props.setImages(finalList);
    });
  };

  /**
   * @method handleSliderImage
   * @description handle slider image
   */
  handleSliderImage = (slides) => {
    const { fileList } = this.state;
    let list = fileList.filter((el) => el.uid !== slides.uid);
    let finalList = [slides, ...list];
    // if (this.slider2) {
    //   this.slider2.slickGoTo(slides.uid);
    // }
    this.setState({ fileList: finalList,slides: finalList,set_as_cover_photo: false}, () => {
      this.props.setImages(finalList);
    });
  };

  /**
   * @method handledelete
   * @description handle delete image
   */
  handledelete = (slides) => {
    const { fileList } = this.state;
    let list = fileList.filter((el) => el.uid !== slides.uid);
    this.setState({ fileList: list }, () => {
      this.props.setImages(list);
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { slides, currentSlide, fileList, set_as_cover_photo } = this.state;
    console.log("slides", slides);
    let current_image = slides.length ? slides[0] : fileList.length ? fileList[0] : ''
    const slickSettingsVerticalNav = {
      arrows: true,
      infinite: true,
      // slidesToShow: slides.length >= 6 ? 6 : slides.length,
      swipeToSlide: true,
      focusOnSelect: true,
      asNavFor: this.state.nav2,
      ref: (slider) => (this.slider1 = slider),
    };

    const slickSettingsVerticalMain = {
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      asNavFor: this.state.nav1,
      ref: (slider) => {
        return (this.slider2 = slider);
      },
      nextArrow: <RightOutlined />,
      prevArrow: <LeftOutlined />,
      afterChange: (e) => {
        this.setState({ currentSlide: e + 1 });
      },
    };
    return (
      <div className="retail-post-ad-img-prev">
        <div className="slider-content-block ">
          <div className="vertical-slide-right-img">
            <Slider {...slickSettingsVerticalMain}>
              {fileList && fileList.length !== 0 ? (
                fileList.map((slide, i) => (
                  <div className="d-block parent-d-block">
                    <div
                      onClick={() => this.handledelete(slide)}
                      className="delete-large-thumb"
                    >
                      <img
                        src={require("../../assets/images/icons/gallery-delete-icon.svg")}
                        alt="Delete"
                      />
                    </div>
                    <img
                      src={
                        slide && slide.thumbUrl
                          ? slide.thumbUrl
                          : slide.url
                          ? slide.url
                          : DEFAULT_IMAGE_CARD
                      }
                      className="slide-main-div"
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD;
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="d-block parent-d-block">
                  <img src={DEFAULT_IMAGE_CARD} className="slide-main" alt="" />
                </div>
              )}
            </Slider>

            {fileList && fileList.length !== 0 && (
              <div className="btn-block">
                <Button
                  onClick={() => this.handleSetAsCoverPhoto(current_image)}
                  className={
                    set_as_cover_photo ? "cover-photo" : "set-cover-photo"
                  }
                  icon={<CheckOutlined />}
                >
                  Set as cover photo
                </Button>
              </div>
            )}
          </div>
          <div className="horizental-thumb">
            <div className="d-block">{this.renderImageUpload()}</div>
          </div>
          <div className="slides-count">
            {currentSlide} / {fileList.length}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, { uploadRetailProductImage })(
  withRouter(ImagePreview)
);
