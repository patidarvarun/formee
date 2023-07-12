import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { langs } from '../../config/localization';
import { Redirect } from 'react-router-dom';
import { Card, Row, Col, Rate, Typography } from 'antd';
import { DEFAULT_IMAGE_CARD } from '../../config/Config';
import { getClassifiedSubcategoryRoute,getClassifiedDetailPageRoute } from '../../common/getRoutes'
import NoContentFound from '../common/NoContentFound'
import {  rating } from '../templates/CommanMethod'
import { capitalizeFirstLetter } from '../common'
const { Text } = Typography;

class SubDetailCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      favoriteItem: [],
    };
  }

  renderRate = (rating) => {
    return (
      <div className='rate-section'>
          <Text>{rating ? rating : ''}</Text>
          {rating && rating === '1.0' && <Rate disabled defaultValue={1}  />}
          {rating && rating === '2.0' && <Rate disabled defaultValue={2}  />}
          {rating && rating === '3.0' && <Rate disabled defaultValue={3}  />}
          {rating && rating === '4.0' && <Rate disabled defaultValue={4} />}
          {rating && rating === '5.0' && <Rate disabled defaultValue={5} />}
      </div>
    )
  }

 
  /**
   * @method render
   * @description render component
   */
  render() {
    const { data } = this.props;
    
    const { redirect } = this.state;
    const { categoryId, subCategoryId, categoryName, subCategoryName, all,classifiedId } = this.props.pathData
    let subCatId = all === langs.key.all ? '' : subCategoryId;
    let allData = all === langs.key.all ? true : false
    let templateName = data &&  data.template_slug
    let rate = data && data.reviews && rating(data.reviews)
   let path= getClassifiedDetailPageRoute(templateName,categoryId,categoryName,data.classifiedid)

    let subCategoryPath = getClassifiedSubcategoryRoute(templateName,categoryName,categoryId, subCategoryName,subCatId, allData)
    
    return (
      <Card
          bordered={false}
          className={'map-product-card '}
          cover={
            <Link to={path}><img
              alt={data.discription}
              src={data.imageurl ? data.imageurl : DEFAULT_IMAGE_CARD}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE_CARD
              }}
              alt={data.title ? data.title : ''}
            /></Link>
          }
        >
           <div className='action-link'>
            <Link 
              to={subCategoryPath}
            >
              {capitalizeFirstLetter(data.catname)}
            </Link>
          </div>
          
          {/* <div className='rate-section'>
            <Text>{rate ? rate : ''}</Text>
            {<Rate disabled defaultValue={rate && rate ? rate : 0} />}
          </div> */}
          {rate ? this.renderRate(rate) : 
            'No reviews yet'}
            <Link to={path}><div className='title classified-detail'>{capitalizeFirstLetter(data.title)}</div></Link>
         <div className='price-box pb-0'>
            <div className='price'>{data.price ? `$${data.price}` : ''} <sup 
            style={{fontSize:'8px'}}> AU</sup></div>
          </div>
        </Card>
        // </Link>
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
