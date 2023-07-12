import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { Input, Typography, Row, Col, Modal } from 'antd';
import { getClassifiedDetailPageRoute } from '../../../common/getRoutes';
import { TEMPLATE, DEFAULT_IMAGE_CARD } from '../../../config/Config';
const { Text } = Typography;
const { TextArea } = Input;

class SemilarAdsBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  /**
   * @method handleTitle
   * @description If title is more that 24 char length then It should parse in substring
   */
  handleTitle = (title) => {
    if (title.length > 25) {
      return title.substring(0, 25) + '...';
    } else {
      return title;
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, listItem } = this.props;
    console.log('listItem: ', listItem);
    const similerlist = {
      dots: false,
      infinite: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2000,
      vertical: true,
      verticalSwiping: true,
      //adaptiveHeight: true,
    };
    return (
      <div
        className={
          listItem.length
            ? 'similer-listing-parent'
            : 'similer-no-listing-parent similer-listing-parent'
        }
      >
        <h2>Similar Listings</h2>
        <Slider {...similerlist}>
          {listItem.map((el) => {
            let detailPagePath = getClassifiedDetailPageRoute(
              TEMPLATE.GENERAL,
              el.category_id,
              '',
              el.classifiedid
            );
            return (
              <div className='similer-listing-tile'>
                <Link to={detailPagePath}>
                  <div className='thum-img-block'>
                    <img
                      src={el.imageurl ? el.imageurl : DEFAULT_IMAGE_CARD}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD;
                      }}
                      className={el.imageurl ? '' : 'similer-default-image'}
                    />
                  </div>
                  <div className='price-modal-detail'>
                    <div className='price'>
                      <b>AU${el.price}</b>
                    </div>
                    {/* <div className='modal-name'>{el.title}</div> */}
                    <div className='modal-name'>
                      {this.handleTitle(el.title)}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, null)(SemilarAdsBlock);
