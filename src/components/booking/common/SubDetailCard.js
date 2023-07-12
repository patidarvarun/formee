import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { langs } from '../../../config/localization';
import { Redirect } from 'react-router-dom';
import { Card, Row, Col, Rate, Typography } from 'antd';
import { DEFAULT_IMAGE_CARD } from '../../../config/Config';
import { getBookingSubcategoryRoute } from '../../../common/getRoutes'
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
  renderCards = (topData, path, subCategoryName) => {
    return topData.map((data, i) => {
      return (
        <Link to={path}><Card
          bordered={false}
          className={'map-product-card '}
          cover={
            <img
              alt={data.discription}
              src={data.image ? data.image : DEFAULT_IMAGE_CARD}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE_CARD
              }}
              alt={data.trader_profile ? data.trader_profile.title : ''}
            />
          }
        >
          <div className='action-link'>
            <Link 
              to={path}
            >
               {(data && data.sub_cat_name !== undefined) ? data.sub_cat_name : ''}
            </Link>
          </div>
          <div className='rate-section'>
            {/* <Text>{data.reviews && data.reviews.length !== 0 ? data.reviews[0].average_rating : 0.0}</Text>
            <Rate disabled defaultValue={parseInt(data.reviews && data.reviews.length !== 0 ? data.reviews[0].average_rating : 0.00)} /> */}
             {data.average_rating  ? `${parseInt(data.average_rating)}.0` : 'No reviews yet'}
            {data.average_rating && <Rate disabled defaultValue={data.average_rating  ? `${parseInt(data.average_rating)}.0` : 0.0} />}
          </div>
          
          
          <div className='title'>{(data.trader_profile && data.trader_profile.title ? capitalizeFirstLetter(data.trader_profile.title) : '')}</div>
          <div className='price-box pb-0'>
            <div className='price align-left ' style={{fontSize:'18px'}}>{data.trader_profile && data.trader_profile.rate_per_hour ? `$${data.trader_profile.rate_per_hour} ` : ''} <sup 
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
    const { categoryId, subCategoryId, categoryName, subCategoryName, all } = this.props.pathData
    let subCatId = all === langs.key.all ? '' : subCategoryId;
    let allData = all === langs.key.all ? true : false
    let templateName = categoryName
    let path = getBookingSubcategoryRoute(templateName, categoryName, categoryId, subCategoryName, subCatId, allData)
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
