import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { langs } from '../../../config/localization';
import { Redirect } from 'react-router-dom';
import { Card, Row, Col, Rate, Typography } from 'antd';
import { DEFAULT_IMAGE_CARD } from '../../../config/Config';
import { getBookingSubCatDetailRoute } from '../../../common/getRoutes'
import NoContentFound from '../../common/NoContentFound'
import { capitalizeFirstLetter } from '../../common'
const { Text } = Typography;

class SubDetailCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      favoriteItem: [],
    };
  }

  /**
   * @method renderCards
   * @description render cards detail
   */
  renderCards = (topData, path) => {
    return topData.map((data, i) => {
      let path = `/bookings-restaurant-detail/${'restaurant'}/${data.id}/${data.user_id}`
      return (
        <Link to={path}><Card
          bordered={false}
          className={'map-product-card '}
          cover={
            <img
              src={(data && data.cover_photo !== undefined && data.cover_photo !== null) ? data.cover_photo : DEFAULT_IMAGE_CARD}
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE_CARD
              }}
              alt={(data && data.business_name !== undefined) ? data.business_name : ''}
            />
          }
        >
          <div className='action-link'>
            <Link 
              to={path}
            >
              {'Restaurant'}
            </Link>
          </div>
          <div className='rate-section'>
            {data.avg_rating ? `${parseInt(data.avg_rating)}.0` : ''}
            <Rate disabled defaultValue={data.avg_rating ? `${parseInt(data.avg_rating)}.0` : 0.0} />
          </div>
          <div className='title'> {(data.business_name ? capitalizeFirstLetter(data.business_name) : '')}</div>
          <div className='price-box pb-0'>
            <div className='price align-left ' style={{fontSize:'18px'}}>{data.price ? `AU$${data.price}` : ''} <sup 
            style={{fontSize:'8px'}}> AUD</sup></div>
            <div className='align-left' style={{fontSize:'10px'}}>Starting price</div>
          </div>
        </Card>
        </Link>
      );
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { topData } = this.props;
    const { redirect } = this.state;
    const { categoryId, subCategoryId, subCategoryName } = this.props.pathData
    let classifiedId = topData.user_id;
    let path = getBookingSubCatDetailRoute('Restaurant', categoryId, subCategoryId, subCategoryName, classifiedId)
    return (
      <Fragment>
        { topData && topData.length !== 0 ?
          <Row gutter={[38, 0]}><Col span={24}> {this.renderCards(topData, path, subCategoryName)}</Col></Row>:
          <NoContentFound/>}
        {redirect && (
          <Redirect
            push
            to={{
              pathname: redirect,
            }}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { isOpenLoginModel, favoriteId } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
    isOpenLoginModel,
    favoriteId,
  };
};

export default connect(mapStateToProps, null)(SubDetailCard);
