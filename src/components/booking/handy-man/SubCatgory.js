import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../common/Sidebar';
import { Layout, Row, Col, Card, Select, Breadcrumb, Pagination } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { enableLoading, disableLoading, getBannerById, getChildCategory } from '../../../actions/index';
import { getClassfiedCategoryListing, classifiedGeneralSearch, getClassfiedCategoryDetail, newInBookings } from '../../../actions';
import DetailCard from '../common/Card'
import { langs } from '../../../config/localization'
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import ChildSubHeader from '../common/SubHeader'
import NoContentFound from '../../common/NoContentFound'
import { getBookingMapViewRoute, getBookingCatLandingRoute } from '../../../common/getRoutes'
import GeneralSearch from '../common/search-bar/WellbeingSearch'
import { TEMPLATE } from '../../../config/Config';
import { converInUpperCase } from '../../common'
import NewSidebar from '../NewSidebar';
const { Content } = Layout;
const { Option } = Select;


// Pagination
function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
  }
  if (type === 'next') {
    return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
  }
  return originalElement;
}

class SubCategory extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      key: 'tab1',
      noTitleKey: 'app',
      bookingList: [],
      sortBy: 0,
      searchKey: '',
      isSearch: false,
      filteredData: [],
      isFilterPage: false,
      distanceOptions: [0, 5, 10, 15, 20],
      selectedDistance: 0,
      isSearchResult: false,
      catName: '',
      searchLatLng: '',
      searchReqData: {},
      cat_id: '',
      sub_cat_id: '',
      data: '',
      isSidebarOpen:false
    };
  }

  /**
  * @method componentWillReceiveProps
  * @description receive props
  */
  componentWillReceiveProps(nextprops, prevProps) {
    let parameter = this.props.match.params
    let catId = parameter.categoryId
    let catIdInitial = parameter.subCategoryId
    let catIdNext = nextprops.match.params.subCategoryId
    let nextParameter = nextprops.match.params
    let cat_id = nextParameter.categoryId
    let sub_cat_id = nextParameter.subCategoryId
    if (catIdInitial !== catIdNext && nextprops.match.params.all === undefined) {
      this.props.enableLoading()
      const id = nextprops.match.params.subCategoryId ? nextprops.match.params.subCategoryId : nextprops.match.params.categoryId
      this.getBannerData(id)
      this.getAllData(cat_id, sub_cat_id, 1)
    }
    if ((nextprops.match.params.all === langs.key.all) && (parameter.all === undefined)) {
      this.props.enableLoading()
      this.getBannerData(nextprops.match.params.categoryId, nextprops.match.params.all)
      this.getAllData(cat_id, sub_cat_id)
    }
  }

  /**
  * @method componentWillMount
  * @description called before render the component
  */
  componentWillMount() {
    let parameter = this.props.match.params
    let cat_id = parameter.categoryId
    let sub_cat_id = parameter.subCategoryId
    this.getAllData(cat_id, sub_cat_id, 1)
    let id = parameter.subCategoryId ? parameter.subCategoryId : parameter.categoryId
    let categoryId = parameter.all === langs.key.all ? parameter.categoryId : id
    this.getBannerData(categoryId, parameter.all)
  }

  /**
  * @method getBannerData
  * @description get banner data
  */
  getBannerData = (categoryId, allData) => {
    let parameter = this.props.match.params;
    this.props.getBannerById(3, res => {
      if (res.status === 200) {
        this.props.disableLoading()
        let top = ''
        const banner = res.data.data && res.data.data.banners
        if (allData === langs.key.all) {
          top = banner.length !== 0 && banner.filter(el => el.categoryId == categoryId && el.subcategoryId !== '')
          
          if (top.length === 0) {
            top = banner.length !== 0 && banner.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
          }

        } else {
          let temp = [];
          top = banner.length !== 0 && banner.filter(el => el.subcategoryId == categoryId)
          temp = top
          if (temp.length === 0) {
            top = banner.length !== 0 && banner.filter(el => el.categoryId == parameter.categoryId && el.subcategoryId === '')
            
          }
          
        }
        this.setState({ topImages: top })
      }
    })
  }


  /**
 * @method getAllData
 * @description get all data
 */
  getAllData = (cat_id, sub_cat_id, page) => {
    this.setState({ cat_id: cat_id, sub_cat_id: sub_cat_id })
    const { isLoggedIn, loggedInDetail } = this.props
    let parameter = this.props.match.params
    const requestData = {
      user_id: isLoggedIn ? loggedInDetail.id : '',
      page: page,
      per_page: 12,
      cat_id,
      sub_cat_id
    }
    this.props.newInBookings(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        this.setState({ bookingList: data, data: res.data, total_record: res.data.total })
      }
    })
  }

  /**
   * @method onTabChange
   * @description manage tab change
   */
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    let id = this.props.match.params.subCategoryId
    const { sub_cat_id, cat_id } = this.state
    this.getAllData(cat_id, sub_cat_id, e)
  }

  /**
  * @method handleSort
  * @description handle sort
  */
  handleSort = (e) => {
    const { bookingList } = this.state;
    const { isLoggedIn, loggedInDetail, lat, long } = this.props
    let parameter = this.props.match.params
    const requestData = {
      user_id: isLoggedIn ? loggedInDetail.id : '',
      page: 1,
      per_page: 12,
      cat_id: parameter.categoryId,
      sub_cat_id: parameter.subCategoryId,
      // sort:e,
      sort: (e === 'price_high' || e === 'price_low') ? 'price' : e ? e : '',
      sort_order: e === 'price_high' ? 'DESC' : 'ASC',
    }
    if (e === 'distance') {
      requestData.lat = lat ? lat : isLoggedIn ? loggedInDetail.lat : ''
      requestData.lng = long ? long : isLoggedIn ? loggedInDetail.lng : ''
    }
    this.props.newInBookings(requestData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        this.setState({ bookingList: data })
      }
    })
  }

  /** 
   * @method handleSearchCall
   * @description Call Action for Classified Search
   */
  handleSearchCall = () => {
    // this.props.enableLoading()
    
    this.props.classifiedGeneralSearch(this.state.searchReqData, (res) => {

      // this.props.disableLoading()
      this.setState({ bookingList: res.data })
    })
  }

  /**
  * @method renderCard
  * @description render cards details
  */
  renderCard = () => {
    const { bookingList } = this.state;
    if (bookingList && bookingList.length) {
      return (
        <Fragment>
          <Row gutter={[38, 38]}>
            {bookingList.map((data, i) => {
              return (
                <DetailCard
                  data={data}
                  callNext={() => {
                    if (this.state.isSearchResult) {
                      this.handleSearchCall()
                    } else {
                      this.getAllData()
                    }
                  }}
                />
              )
            })}
          </Row>
        </Fragment>
      )
    } else {
      return <NoContentFound />
    }
  }

  /** 
  * @method handleSearchResponce
  * @description Call Action for Classified Search
  */
  handleSearchResponce = (res, resetFlag, reqData, total_record) => {
    
    let parameter = this.props.match.params
    if (resetFlag) {
      this.setState({ isSearchResult: false });
      this.getAllData(parameter.categoryId, parameter.subCategoryId)
    } else {
      
      this.setState({ bookingList: res, isSearchResult: true, searchReqData: reqData, total_record: total_record })
    }
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const {isSidebarOpen, data, total_record, bookingList, topImages, subCategory, redirectTo, isFilterPage, sortBy, selectedDistance, catName } = this.state;
    let templateName = bookingList.length && bookingList[0].template_slug
    let parameter = this.props.match.params;
    
    
    let total_count = data && data.total
    let parentName = parameter.categoryName;
    let pid = parameter.categoryId
    let subCategoryName = parameter.all === langs.key.all ? langs.key.All : parameter.subCategoryName
    let subCategoryId = parameter.subCategoryId
    let allData = parameter.all === langs.key.all ? true : false
    let path = getBookingMapViewRoute(parentName, parentName, pid, subCategoryName, subCategoryId, allData)
    let categoryPagePath = getBookingCatLandingRoute(parentName, pid, parentName, allData)
    return (
      <Layout className="common-sub-category-landing booking-sub-category-landing">
        <Layout className="yellow-theme booking-parent-sub-category">
          <Layout>
            {/* <AppSidebar 
              history={history} 
              activeCategoryId={subCategoryId ? subCategoryId : pid}
              isSubcategoryPage={true} 
              moddule={1} 
            /> */}
            <NewSidebar 
              history={history} 
              activeCategoryId={subCategoryId ? subCategoryId : pid}
              isSubcategoryPage={true}
              toggleSideBar={() => this.setState({ isSidebarOpen: !isSidebarOpen })}
            />
            <Layout className="right-parent-block">
              <ChildSubHeader
                showAll={true}
                categoryName={parentName}
              />
              <div className='inner-banner custom-inner-banner'>
                <CarouselSlider bannerItem={topImages} pathName='/' />
                <GeneralSearch handleSearchResponce={this.handleSearchResponce} />
              </div>

              <Content className='site-layout'>
                <div className='wrap-inner full-width-wrap-inner'>
                  <Row className='mb-20' align="middle">
                    <Col md={16}>
                      <Breadcrumb separator='|' className='ant-breadcrumb-pad ant-breadcrumb-pad-none'>
                        <Breadcrumb.Item>
                          <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                          <Link to='/bookings'>Bookings</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                          <Link to={categoryPagePath}>{converInUpperCase(parentName)}</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{converInUpperCase(subCategoryName)}</Breadcrumb.Item>
                      </Breadcrumb>
                    </Col>
                    <Col md={8}>
                      <div className='location-btn'>
                        {'Melbourne, 3000'} <Icon icon='location' size='15' className='ml-20' />
                      </div>
                    </Col>
                  </Row>
                  <Card
                    title={
                      <span className={'nostyle'}>{converInUpperCase(subCategoryName)}</span>}
                    bordered={false}
                    extra={
                      <ul className='panel-action'>
                        <li title={'List view'} className={'active'}><Icon icon='grid' size='18' /></li>
                        <li title={'Map view'} onClick={() => this.props.history.push(path)}>
                          <Icon icon='map' size='18' />
                        </li>
                        <li>
                          <label>{'Sort'}&nbsp;&nbsp;</label>
                          <Select
                            defaultValue={'Recommended'}
                            onChange={this.handleSort}
                            dropdownMatchSelectWidth={false}
                          >
                            <Option value='price_high'>Price (High-Low)</Option>
                            <Option value='price_low'>Price (Low-High)</Option>
                            <Option value='rating'>Rating</Option>
                            <Option value='most_viewed'>Most Reviewed</Option>
                            <Option value='name'>Name List A-Z</Option>
                            <Option value='distance'>Distance</Option>
                          </Select>
                        </li>
                      </ul>
                    }
                    className={'home-product-list header-nospace'}
                  >
                    {this.renderCard()}
                  </Card>
                  {!isFilterPage && total_record > 12 ?
                    <Pagination
                      defaultCurrent={1}
                      defaultPageSize={12} //default size of page
                      onChange={this.handlePageChange}
                      total={total_record} //total number of card data available
                      itemRender={itemRender}
                      className={'mb-20'}
                    />
                    : ''}
                </div>
              </Content>
            </Layout>
          </Layout>
          {redirectTo && <Redirect push to={{
            pathname: redirectTo,
          }}
          />}
        </Layout >
      </Layout>
    );
  }
}


const mapStateToProps = (store) => {
  const { auth, classifieds, common } = store;
  const { location } = common;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedbookingList: classifieds.classifiedsList,
    lat: location ? location.lat : '',
    long: location ? location.long : ''
  };
}

export default connect(
  mapStateToProps,
  { enableLoading, disableLoading, newInBookings, getClassfiedCategoryListing, getClassfiedCategoryDetail, getBannerById, classifiedGeneralSearch, getChildCategory }
)(SubCategory);