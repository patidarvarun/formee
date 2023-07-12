import React from 'react'
import { connect } from 'react-redux';
import {Link, Redirect, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Card, Col, Rate, Popover, Typography } from 'antd';
import Icon from '../../components/customIcons/customIcons';
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../config/Config'
import { STATUS_CODES } from '../../config/StatusCode';
import { MESSAGES } from '../../config/Message'
import { langs } from '../../config/localization';
import { addToFavoriteFoodScanner } from '../../actions/food-scanner/FoodScanner'
import { enableLoading, disableLoading, openLoginModel, setFavoriteItemId, addToWishList, removeToWishList } from '../../actions/index'
import { getClassifiedDetailPageRoute, getRetailDetailPageRoute } from '../../common/getRoutes'
import { salaryNumberFormate, capitalizeFirstLetter } from '../common'
import { rating } from '../classified-templates/CommanMethod'
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { reactLocalStorage } from 'reactjs-localstorage';

const { Text } = Typography;

class FoodProductDetailCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      favoriteItem: [],
      is_favourite: false,
      isItemSelected: false
    }
  }

  /**
 * @method componentDidMount
 * @description called before mounting the component
     */
  componentDidMount() {
    const { data } = this.props;
    this.setState({ is_favourite: data.is_favorite ? true : false })
  }

  handleAddToFavorite = () => {
    const { data } = this.props;
    const { is_favourite } = this.state;
    const { isLoggedIn, loggedInDetail } = this.props;
    if (isLoggedIn) {
      const requestData = {
        food_product_id: data.id,
        user_id: loggedInDetail.id,
        is_favorite: is_favourite ? 0 : 1
      }
      this.props.addToFavoriteFoodScanner(requestData, res => {
        if (res.status === STATUS_CODES.OK) {

          toastr.success(langs.success, res.data.msg)
          this.setState({ is_favourite: is_favourite ? 0 : 1 })
        }
      })
    } else {
      this.props.openLoginModel()
    }
  }

  handleSelectCompare = () => {
    const { selectedCompareItem, setSelectedItem, data } = this.props;
    let itemArray = selectedCompareItem
    if (this.state.isItemSelected) {
      this.setState({ isItemSelected: false });
      const modifiedArray = itemArray.filter((val) => val.id === data.id);
      itemArray = modifiedArray
      setSelectedItem(itemArray)
    } else {
      if (itemArray && itemArray.length < 2) {
        this.setState({ isItemSelected: true });
        itemArray.push(data)
        setSelectedItem(itemArray)
      } else {
        toastr.warning('Warning', 'Only two items can be compared at once.')
      }
    }
    reactLocalStorage.setObject('compareProductData', { data: itemArray })
  }

  handleRedirection = (data) => {
    reactLocalStorage.setObject('productDetails', data);
    let path = `/food-product-detail/${data.id}`
    this.props.history.push(`/food-product-detail/${data.id}`)
    // window.open(path, "_blank")
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { data, col } = this.props;
    const { redirect, is_favourite, isItemSelected } = this.state
    reactLocalStorage.setObject('productDetails', data);
    let path = `/food-product-detail/${data.id}`
    return (
      <Col className='gutter-row pad-btm-27 foodscanner-block-tile' md={col ? col : 8}>
        <Card
          bordered={false}
          className={'detail-card'}
          cover={
            <Link to={path}><img
              src={(data && data.image) ? data.image : DEFAULT_IMAGE_CARD}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE_CARD
              }}
              alt={(data && data.brand) ? data.brand : ''}
              //onClick={() => this.handleRedirection(data)}
            /></Link>
          }

        actions={[
          <Link to={path}><Icon
              icon={'email'}
              size='20'
              //onClick={() => this.handleRedirection(data)}
          /></Link>,
            <Icon
                icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                className={is_favourite ? 'active' : ''}
                size='20' onClick={() => this.onSelection(data)}
                onClick={() => this.handleAddToFavorite()}
            />,
            <Popover title={(data && data.total_views) ? (`Total Views :  ${data.total_views}`) : 'Total Views : 0'}>
                <Icon icon='view' size='20' />
            </Popover>
        ]}
        >
        <Link to={path}><div className='price-box' 
          //onClick={() => this.handleRedirection(data)}
        >
          <div className='rate-section'>
              {'3.0'}
              {<Rate disabled defaultValue={3} />}
          </div>
          <div className='price'>
              {data.price ? `AU$${data.price}` : ''}
          </div>
        </div></Link>
          <div className="like-view-summary">
            <div className="subcategory"> </div>
            {/* <div className="like-view">
              <div className="total-views">
                {(data && data.total_views) ? (`Total Views :  ${data.total_views}`) : 'Views 0'}
              </div>
              <Icon
                icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                className={is_favourite ? 'active' : ''}
                size='20' onClick={() => this.onSelection(data)}
                onClick={() => this.handleAddToFavorite()}

              />
            </div> */}
          </div>
          <Link to={path}><div 
            //onClick={() => this.handleRedirection(data)}
            className='price-box' align="middle" style={{ cursor: 'pointer' }}>
            <h2>{data.name ? data.name : ''}</h2>
          </div></Link>
          {/* <div className="quantity">
            {(data && data.serving_size) ? data.serving_size : ''}
          </div> */}

        </Card>
        <div className="add-compare-block">
          {!isItemSelected ? <PlusCircleOutlined onClick={() => this.handleSelectCompare()} />
            :
            <CloseCircleOutlined onClick={() => this.handleSelectCompare()} />}
          <span>Add to Compare</span>
        </div>
        {redirect && <Redirect push
          to={{
            pathname: redirect
          }}
        />
        }
      </Col>
    )
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { isOpenLoginModel, favoriteId } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
    isOpenLoginModel, favoriteId
  };
}

export default connect(
  mapStateToProps, { enableLoading, disableLoading, openLoginModel, addToFavoriteFoodScanner }
)(withRouter(FoodProductDetailCard));

