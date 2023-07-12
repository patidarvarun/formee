import React from 'react'
import { connect } from 'react-redux';
import {Link, Redirect, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Card, Col, Rate, Popover, Typography } from 'antd';
import Icon from '../customIcons/customIcons';
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../config/Config'
import { STATUS_CODES } from '../../config/StatusCode';
import { MESSAGES } from '../../config/Message'
import { langs } from '../../config/localization';
import {addToFavoriteFoodScanner,globalSearch,addToFavorite, removeToFavorite,addToCartAPI, removeToRetailWishlist,addToRetailWishList,  enableLoading, disableLoading, openLoginModel, setFavoriteItemId, addToWishList, removeToWishList } from '../../actions/index'
import {getClassifiedDetailPageRoute, getRetailDetailPageRoute } from '../../common/getRoutes'
import { salaryNumberFormate, capitalizeFirstLetter } from '.'
import ContactModal from '../classified-templates/common/modals/ContactModal'
import { rating } from '../classified-templates/CommanMethod'
import CartModel from '../retail/retail-cart/CartModel'
import { reactLocalStorage } from 'reactjs-localstorage';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { Text } = Typography;

class DetailCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            favoriteItem: [],
            is_favourite: false,
            visible: false,
            openCartModel: false,
            isItemSelected: false
        }
    }

    /**
   * @method componentDidMount
   * @description called before mounting the component
       */
    componentDidMount() {
        const { data } = this.props;
        this.setState({ is_favourite: data.wishlist === 1 ? true : false })
    }

    getGlobalResponse = () => {
        const { searchReqData } = this.props
        this.props.globalSearch(searchReqData, (res) => {
            // if (res.data && Array.isArray(res.data.data)) {
            //     this.props.handleSearchResponce(res.data.data, false, searchReqData);
            //   } else {
            //     this.props.handleSearchResponce([], false, searchReqData);
            //   }
        })
    }

    onSelection = (data) => {
        const { favoriteItem, is_favourite } = this.state;
        const { isLoggedIn, loggedInDetail, retail } = this.props;
        console.log('data',data)
        if (isLoggedIn) {
            // mark favorite for retail
            if(data.model_type === 'Retail'){
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: data.classifiedid ? data.classifiedid : data.id,
                }
                this.props.enableLoading()
                if (data.wishlist === 1 || is_favourite) {
                    // mark favorite for retail
                    this.props.removeToRetailWishlist(requestData, res => {
                        this.props.disableLoading()
                        if (res.status === STATUS_CODES.OK) {
                            toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
                            this.setState({ is_favourite: false })
                            this.getGlobalResponse()
                        }
                    })
                }else {
                    // unfavorite for retail
                    this.props.addToRetailWishList(requestData, res => {
                        this.props.disableLoading()
                        this.setState({ flag: !this.state.flag })
                        if (res.status === STATUS_CODES.OK) {
                            toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
                            this.setState({ is_favourite: true })
                            this.getGlobalResponse()
                        }
                    })
                }
            }else if(data.model_type === 'Food'){
                const requestData = {
                    food_product_id: data.product_id,
                    user_id: loggedInDetail.id,
                    is_favorite: is_favourite ? 0 : 1
                  }
                  this.props.addToFavoriteFoodScanner(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
            
                      toastr.success(langs.success, res.data.msg)
                      this.setState({ is_favourite: is_favourite ? 0 : 1 })
                    }
                  })
            }else if (data.model_type === 'Booking') {
                let requestData = {}
                if (data.wishlist === 0) {
                    // mark favorite for booking
                requestData = {
                    user_id: loggedInDetail.id,
                    item_type: 'trader',
                    item_id: data.user_id,
                    category_id: data.category_id,
                    sub_category_id: data.sub_cat_id
                }
                
                this.props.addToFavorite(requestData, res => {
                    this.setState({ flag: !this.state.flag })
                    if (res.status === STATUS_CODES.OK) {
                    toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
                    this.setState({ is_favourite: true })
                    this.getGlobalResponse()
                    }
                })
                } else {
                    // unfavorite for booking
                    requestData = {
                        user_id: loggedInDetail.id,
                        item_id: data.user_id
                    }
                    this.props.removeToFavorite(requestData, res => {
                        if (res.status === STATUS_CODES.OK) {
                        toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
                        this.setState({ is_favourite: false })
                        this.getGlobalResponse()
                        }
                    })
                }
            }else if (data.model_type === 'Classifieds') {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: data.classifiedid ? data.classifiedid : data.id,
                }
                this.props.enableLoading()
                if (data.wishlist === 1 || is_favourite) {
                    this.props.removeToWishList(requestData, res => {
                        this.props.disableLoading()
                        if (res.status === STATUS_CODES.OK) {
                            toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
                            this.setState({ is_favourite: false })
                            this.getGlobalResponse()
                        }
                    })
                }else {
                    this.props.addToWishList(requestData, res => {
                        this.props.disableLoading()
                        this.setState({ flag: !this.state.flag })
                        if (res.status === STATUS_CODES.OK) {
                            toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
                            this.setState({ is_favourite: true })
                            this.getGlobalResponse()
                        }
                    })
                } 
            }
        } else {
            this.props.openLoginModel()
        }
    }


    renderRate = (rating) => {
        return (
            <div className='rate-section'>
                <Text>{rating ? rating : ''}</Text>
                {rating && rating === '1.0' && <Rate disabled defaultValue={1} />}
                {rating && rating === '2.0' && <Rate disabled defaultValue={2} />}
                {rating && rating === '3.0' && <Rate disabled defaultValue={3} />}
                {rating && rating === '4.0' && <Rate disabled defaultValue={4} />}
                {rating && rating === '5.0' && <Rate disabled defaultValue={5} />}
            </div>
        )
    }

    /**
     * @method contactModal
     * @description contact model
     */
    contactModal = (data) => {
        const { isLoggedIn,loggedInDetail} = this.props;
        if (isLoggedIn) {
            if(data.model_type === 'Retail'){
                if(data.quantity){
                    let requestData = {
                      ship_cost: 0,
                      available_qty: data.quantity,
                      qty: 1,
                      classified_id: data.classifiedid ? data.classifiedid : data.parent_categoryid,
                      user_id: loggedInDetail.id,
                    };
                    this.props.addToCartAPI(requestData, (res) => {
                      if (res.status === 200) {
                        if (res.data.status === 1) {
                          toastr.success(langs.success, MESSAGES.AD_TO_CART);
                          this.setState({openCartModel:true})
                        } else {
                          toastr.error(langs.error, res.data.msg);
                        }
                      }
                    });
                  }else {
                    toastr.warning('This product is out of stock')
                  }
            }else if(data.model_type === 'Classifieds'){
              this.setState({visible: true});
            }else if(data.model_type === 'Booking') {
                this.props.history.push(`/bookings-detail/${data.categoryname}/${data.category_id}/${data.user_id}`)
            }else if (data.model_type === 'Food'){
                this.props.history.push(`/food-product-detail/${data.product_id}`)
            }
        } else {
            this.props.openLoginModel()
        }
    };

    handleSelectCompare = () => {
        const { selectedCompareItem, setSelectedItem, data } = this.props;
        let itemArray = selectedCompareItem
        if (this.state.isItemSelected) {
          this.setState({ isItemSelected: false });
          const modifiedArray = itemArray.filter((val) => val.product_id === data.product_id);
          itemArray = modifiedArray
          setSelectedItem(itemArray)
        } else {
            console.log('itemArray',itemArray)
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

    /**
     * @method render
     * @description render component
     */
    render() {
        const {data, col, retail} = this.props;
        const {isItemSelected,openCartModel,visible, redirect, is_favourite } = this.state
        let rate = data && data.classified_hm_reviews && rating(data.classified_hm_reviews)
        let templatename = (data && data.template_slug !== undefined) ? data.template_slug : ''
        let cityname = ''
        let path = '',color= ''
        let cat_id = data.category_id
        let catName = data.categoryname
        let classifiedId = data.product_id;
        let templateName = data.template_slug;
        if (data.model_type === 'Retail') {
            path = getRetailDetailPageRoute(cat_id, catName, classifiedId)
            color = '#ca71b7'
        }else if (data.model_type === 'Classifieds' || templateName === TEMPLATE.GENERAL) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
        } else if (templateName === TEMPLATE.JOB) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
        } else if (templateName === TEMPLATE.REALESTATE) {
            path = getClassifiedDetailPageRoute(templateName, cat_id, catName, classifiedId)
        }else if(data.model_type === 'Booking'){
            path = `/bookings-detail/${catName}/${cat_id}/${data.user_id}`
            rate = data.valid_trader_ratings && rating(data.valid_trader_ratings)
            color = '#fec872'
        }else if(data.model_type === 'Restaurant'){
            color = '#fec872'
            path =`/bookings-restaurant-detail/${'Restaurant'}/${cat_id}/${classifiedId}`
        }else if(data.model_type === "Food"){
            color = '#98ce31'
            path = `/food-product-detail/${data.product_id}`
        }
        console.log('cityname',cityname)
        return (
            <Col className='gutter-row pad-btm-27 foodscanner-block-tile' md={6} >
                <Card
                    bordered={false}
                    className={'detail-card'}
                    cover={
                        <Link to={path}><img
                            src={data.imageurl ? data.imageurl : DEFAULT_IMAGE_CARD}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_IMAGE_CARD
                            }}
                            style={{ cursor: 'pointer' }}
                            alt={(data && data.label !== undefined) ? data.label : ''}
                        /></Link>
                    }

                    actions={[
                        <Icon
                            icon={templatename === (TEMPLATE.GENERAL) || (templatename === TEMPLATE.JOB) || (templatename === TEMPLATE.REALESTATE)
                                ? 'email' : 'cart'}
                            size='20'
                            onClick={() => this.contactModal(data)}
                        />
                        ,
                        <Icon
                            icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                            className={is_favourite ? 'active' : ''}
                            size='20' 
                            onClick={() => this.onSelection(data)}
                        />,
                        <Popover title={`Total Views : ${(data && data.views !== undefined) ? data.views : '0'}`}>
                            <Icon icon='view' size='20' />
                        </Popover>,
                    ]}
                >
                    <Link to={path}>
                        <div className='price-box' align="middle" 
                            style={{ cursor: 'pointer' }}>
                            <div className="rate-section">{rate ? this.renderRate(rate) : 'No reviews yet'}</div>
                            <div className='price'>
                                {!data.is_ad_free && (data && data.price !== undefined) ? `AU$${salaryNumberFormate(parseInt(data.price))}` : ''}
                                {data.is_ad_free ? 'Free' : ''}
                            </div>
                        </div>
                    </Link>
                    <Link to={path}>
                    <div className='title'
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }}
                    >
                        {(data && data.label !== undefined) ? capitalizeFirstLetter(data.label) : ''}
                    </div>
                    </Link>
                    <Link to={path}>
                    <div className='category-box' 
                        style={{ cursor: 'pointer' }}
                    >
                        <div className='category-name' style={{ color: color}}>
                            {(data && data.sub_categoryname !== undefined) ? data.sub_categoryname : ''}
                        </div>
                        <div className='location-name'>
                            {data.city &&<Icon icon='location' size='15' className='mr-5' />}
                            {data.model_type === 'Classifieds' || data.model_type === 'Retail' ?  (data.city && data.city.City) : data.city}
                        </div>
                    </div>
                    </Link>
                </Card>
                {/* {data.model_type === 'Food' && <div className="add-compare-block">
                {!isItemSelected ? <PlusCircleOutlined onClick={() => this.handleSelectCompare()} />
                    :
                    <CloseCircleOutlined onClick={() => this.handleSelectCompare()} />}
                <span>Add to Compare</span>
                </div>} */}
                {visible &&
                    <ContactModal
                        visible={visible}
                        onCancel={() => this.setState({visible: false})}
                        classifiedDetail={data}
                        receiverId={data.classified_users ? data.classified_users.id : ''}
                        classifiedid={classifiedId}
                    />}
            {openCartModel &&
                <CartModel
                    visible={openCartModel}
                    onCancel={() => this.setState({openCartModel: false})}
                    title={data ? data.title : ''}
                    price={data ? data.price : ''}
                    image={data && data.imageurl !== undefined && data.imageurl !== null ? data.imageurl : DEFAULT_IMAGE_CARD}
                />}
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
    mapStateToProps, {addToFavoriteFoodScanner,globalSearch,addToFavorite, removeToFavorite,addToCartAPI,removeToRetailWishlist,addToRetailWishList, enableLoading, disableLoading, openLoginModel, setFavoriteItemId, addToWishList, removeToWishList }
)(withRouter(DetailCard));

