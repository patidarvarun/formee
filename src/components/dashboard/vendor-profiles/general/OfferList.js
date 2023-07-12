import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { DownOutlined, MoreOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Layout, Card, Table, Menu, Dropdown, Typography, Button, Tabs, Row, Col, Input, Select } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
// import NoContentFound from '../../common/NoContentFound'
// import DetailCard from '../../templates/jobs/DetailCard'
import PostAdPermission from '../../../templates/PostAdPermission'
import { getGeneralVendorMyOfferList, changeClassifiedStatus, deleteGeneralClassified } from '../../../../actions'
import { dateFormate1,salaryNumberFormate } from '../../../common';
import './general.less'

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class MyAds extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      category: '',
      subCategory: [],
      currentList: [],
      size: 'large',
      showSettings: [],
      activeFlag: langs.key.all,
      ads_view_count: '',
      total_ads: '',
      tabs_count: {},
      activePage: 1
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.getMyOffersList(1, this.state.activeFlag)
  }

  /**
  * @method  get Offer List
  * @description get classified   
  */
  getMyOffersList = (page, flag_status) => {
    const { id } = this.props.userDetails.user;
    let reqData = {
      vendor_id: id,
      page_size: 10,
      page: page !== undefined ? Number(page) : 1,
    }
    //
    this.props.getGeneralVendorMyOfferList(reqData, (res) => {
      
      if (res.status === 1 && Array.isArray(res.data.data)) {
        this.setState({ currentList: res.data.data, total_ads: res.data.total })
      } else {
        this.setState({ currentList: [] })
      }
    })
  }

  /**
  * @method delete classified 
  * @description delete classified   
  */
  deleteClassified = (id) => {
    const { flag, activePage } = this.state
    let reqdata = {
      id
    }
    this.props.deleteGeneralClassified(reqdata, (res) => {
      
      this.getMyOffersList(activePage, flag)
      toastr.success(langs.success, langs.messages.delete_classified_success)
    })
  }

  /**
   * @method blankCheck
   * @description Blanck check of undefined & not null
   */
  blankCheck = (value) => {
    if (value !== undefined && value !== null && value !== 'Invalid date' && value !== '' && value !== 'null' && value !== 'undefined') {
    return value
    } else {
    return ''
    }
    }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { currentList, tabs_count, ads_view_count, total_ads, size, showSettings } = this.state;
    const { myOffers } = this.props;
    

    const columns = [
      {
        title: 'Item',
        dataIndex: 'classifiedid',
        key: 'name',
        render: (cell, row, index) => {
          
         return (
            <Col md={20}>
              <div className='row my-jobs'>
                <div className='price-box'>
                  <img style={{ height: 'auto', width: 80 , marginRight:10 }} src={row.image}></img>
               <div className='price pl-5'>
              
                  <Link to={`/my-offer-details/${row.id}`}>{row.title}</Link>
             
              <div style={{color:'#55636d', fontWeight:'bold'}}>AU${salaryNumberFormate(row.price)}  </div>
            {row.category_name &&
                <div className='category-name blue-link'>
                  {row.category_name}
                </div>
              }
              <span class="sep">|</span>
              <div className='job-name blue-link'>
                {row.condition}
              </div>
              </div>
              </div>
              </div>
            </Col>
          )
        }
      },
      {
        title: 'Expire Date',
        dataIndex: 'premium_expiry_date',
        render: (cell, row, index) => {
          return this.blankCheck(row.premium_expiry_date) ? dateFormate1(row.premium_expiry_date) : ''
        }
      },
      {
        title: 'Name',
        dataIndex: 'classifiedid',
        key: 'classifiedid',
      },
      {
        title: 'Offers Total',
        dataIndex: 'offer_count',
        key: 'offer_count',
      },
      {
        title: 'Recieved Offers',
        key: 'classifiedid',
        dataIndex: 'classifiedid',
        render: (cell, row, index) => {
          return (
            <div className="right-action">
              <div className="edit-delete-icons align-center">
                <span style={{marginRight:0}}>
                  <Link to={`/my-offer-details/${row.id}`}>View offers</Link>
                  {/* <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' style={{ marginRight:26, position:'absolute', marginTop:6}} className="pl-30" onClick={() => this.deleteClassified(cell)} /> */}
                </span>
              </div>
            </div>
          )
        }
      },
      // {
      //   title: '',
      //   key: 'classifiedid',
      //   dataIndex: 'classifiedid',
      //   render: (cell, row, index) => {
      //     return (
      //       <div className="right-action">
      //         <div className="edit-delete-icons">
      //           <span>
                  
      //             <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' onClick={() => this.deleteClassified(cell)} />
      //           </span>
      //         </div>
      //       </div>
      //     )
      //   }
      // }
    ];

    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box employee-dashborad-box employee-myad-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>My Offer</Title>
                  </div>
                  <div className='right'>
                    <div className='right-content'>
                      <PostAdPermission title={'Post an Ad'} />
                    </div>
                  </div>
                </div>
                <div className="employsearch-block">
                  <div className="employsearch-right-pad">
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className="search-block">
                          <Input
                            placeholder="Search"
                            prefix={<SearchOutlined className="site-form-item-icon" />}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="profile-content-box">
                  <Card
                    bordered={false}
                    className='add-content-box'
                  >

                    
                    {/* <Tabs onTabClick={(tab) => {
                      
                      // this.getMyOffersList(1, tab)
                      this.setState({ activeFlag: tab, activePage: 1 })

                    }} type='card' > */}
                     <Row  className="p-20" align="middle">
                       <Col md={18} className="d-flex"  style={{alignItems:'center'}} ><Title level={4} className="red-text mb-0">My Ad list </Title> <label className="pl-10 mb-0">{` you have ${total_ads ? total_ads : 0} Ads`}</label></Col>
                       {/* key={langs.key.all} */}
                      {/*  <Col md={6} className="align-right d-flex" style={{justifyContent:'flex-end'}}><div className="card-header-select sort-section"><label>Sort By:</label>
                      <Select defaultValue="Most Recent">
                        <Option value="All Categories">All Categories</Option>
                        <Option value="All Categories">All Categories</Option>
                      </Select></div></Col> */}
                       </Row>
                        <Table
                        className="my-job-table"
                          pagination={{
                            onChange: (page, pageSize) => {
                              
                              this.setState({ activePage: page })
                              this.getMyOffersList(page, this.state.activeFlag)
                            }
                            , defaultPageSize: 10,
                            showSizeChanger: false,
                            total: total_ads
                          }}
                          dataSource={myOffers} columns={columns} />
                                    
                    {/* </Tabs> */}
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    myOffers: Array.isArray(store.classifiedsVendor.generalMyOffer) ? store.classifiedsVendor.generalMyOffer : []
  };
};
export default connect(
  mapStateToProps,
  { getGeneralVendorMyOfferList, deleteGeneralClassified }
)(MyAds)