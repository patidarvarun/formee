import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { MESSAGES } from '../../../../config/Message'
import { langs } from '../../../../config/localization';
import Icon from '../../../../components/customIcons/customIcons';
import { DownOutlined, MoreOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import {Pagination, Layout, Card, Table, Menu, Dropdown, Typography, Button, Tabs, Row, Col, Input, Select } from 'antd';
import AppSidebar from '../../../../components/dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
// import NoContentFound from '../../common/NoContentFound'
// import DetailCard from '../../templates/jobs/DetailCard'
import PostAdPermission from '../../../templates/PostAdPermission'
import {salaryNumberFormate, dateFormate1 } from '../../../common'
import {deleteAllInspectionAPI,getVendorAdListAPI, getAdManagementDetails, changeClassifiedStatus, deleteClassified} from '../../../../actions/vender/MyAds'
// import '../../employer.less'
import './inspection.less'
const { Title, Text } = Typography;
const { TabPane } = Tabs;
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

class InspectionList extends React.Component {

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
      activePage: 1,
      category: []
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.getVendorAdList(1)
  }


  /**
   * @method getVendorAdList
   * @description called after render the component
   */
  getVendorAdList = (page) => {
    const { loggedInUser } = this.props
    let reqData = {
    //  vendor_id: 1114,
    vendor_id: loggedInUser.id,
    //  page: page,
    //  per_page: 12
    }
    this.getData(reqData)
  }

  /**
   * @method getData
   * @description get ad list of inspection
   */
  getData = (reqData) => {
    this.props.getVendorAdListAPI(reqData, (res) => {
      if(res.status === 200){
        let item = res.data && res.data.data 
        let inspectionList = item && Array.isArray(item.data) && item.data.length ? item.data : []
        let category = res.data  && res.data.sub_categories && Array.isArray(res.data.sub_categories) && res.data.sub_categories.length ? res.data.sub_categories : []
        this.setState({ currentList: inspectionList, total_ads: item.total, category: category})
      }
    })
  }

  /**
   * @method deleteClassifiedInspection classified 
   * @description delete classified   
   */
  deleteClassifiedInspection = (id) => {
    let reqData = {
      classified_id: id
    }
    this.props.deleteAllInspectionAPI(reqData, res => {
      if(res.status === 200){
        toastr.success(langs.success, MESSAGES.INSPECTION_DELETE_SUCCESS)
        this.getVendorAdList(1)
      }
    })
  }

   /**
    * @method handlePageChange
    * @description handle page change
    */
  handlePageChange = (e) => {
    this.getVendorAdList(e)
  }

   /**
    * @method onCategoryChange
    * @description on category change render records
    */
  onCategoryChange = (item, page) => {
    const { loggedInUser } = this.props
    if(item !== 'all'){
      let reqData = {
        vendor_id: loggedInUser.id,
        page: page,
        per_page: 12,
        category_id: item
      }
      this.getData(reqData)
    }else {
      let reqData = {
        vendor_id: loggedInUser.id,
        page: page,
        per_page: 12,
      }
      this.getData(reqData)
    }
  }
  /**
   * @method render
   * @description render component  
   */
  render() {
    const {category, currentList, tabs_count, ads_view_count, total_ads, size, showSettings } = this.state;
    
    

    const columns = [
      {
        title: 'Ad Id',
        dataIndex: 'id',
        key: 'id',
        render: (cell, row, index) => {
          return (
            <Col md={24}>
              <Title level={4} className='title'>
                  {row.id}
              </Title>
            </Col>
          )
        }
      },
      {
        title: 'Category',
        dataIndex: 'category_name',
        key: 'category_name',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (cell, row, index) => {
          return (
              <span>{`AU$${salaryNumberFormate(row.price)}`}</span>
            //  <span>{`$${salaryNumberFormate(150000)}`}</span>
          )
        }
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (cell, row, index) => {
          return (
            <span>{row.created_at && `${dateFormate1(row.created_at)}`}</span>
          )
        }
      },
      {
        title: 'Inspection',
        key: 'id',
        dataIndex: 'id',
        render: (cell, row, index) => {
          return (
            <div className="right-action">
              <Link to={`/inspection-detail/${row.id}`}>View bookings</Link>
           </div>
          )
        }
      },
      {
        title: '',
        key: 'id',
        dataIndex: 'id',
        render: (cell, row, index) => {
          return (
            <div className="delete-action">
             
              <span><DeleteOutlined 
                onClick={(e) => {
                  toastr.confirm(
                    `${MESSAGES.CONFIRM_DELETE}`,
                    {
                      onOk: () => this.deleteClassifiedInspection(row.id),
                      onCancel: () => {  }
                    })
                }}
              /></span>
            </div>
          )
        }
      }
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
                    <Title level={2}>Inspection</Title>
                  </div>
                  <div className='right'>
                    <div className='right-content'>
                      <PostAdPermission title={'Post Ad'} />
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
                    // className='add-content-box'
                    className='add-content-box job-application'
                  >
                  <div className="application-detail">
                    <Row className="grid-block">
                      <Col md={12}><h2 className="pl-0">My Ad list <span>{`You have ${currentList.length} ads`}</span></h2></Col>
                      <Col md={12} >
                        <div className="card-header-select"><label>Show:</label>
                          <Select  defaultValue="All" onChange={(e) => {
                              this.onCategoryChange(e, 1)
                            }}>
                            
                             <Option value="all">All Categories</Option>
                             {category &&
                                category.map((el, i) => {
                                  return (
                                    <Option key={el.id} value={el.id}>{el.category_name}</Option>
                                  )
                                })}
                          </Select></div>
                      </Col>
                      <Col md={24} >
                      <Table dataSource={currentList} columns={columns} className="inspection-table" />
                      { total_ads > 12 && <Pagination
                            defaultCurrent={1}
                            defaultPageSize={12} //default size of page
                            onChange={this.handlePageChange}
                            total={total_ads} //total number of card data available
                            itemRender={itemRender}
                            className={'mb-20'}
                        />}
                      </Col>
                    </Row>
                  </div>   
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};
export default connect(
  mapStateToProps,
  {deleteAllInspectionAPI,getVendorAdListAPI, getAdManagementDetails, changeClassifiedStatus, deleteClassified }
)(InspectionList)