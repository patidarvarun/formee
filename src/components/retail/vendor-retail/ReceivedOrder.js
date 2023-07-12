import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import moment from 'moment'
import { toastr } from 'react-redux-toastr'
import { connect } from 'react-redux';
import { MoreOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Pagination, Layout, Card, Typography, Button, Tabs, Table, Avatar, Row, Col, Input, Select } from 'antd';
import AppSidebar from '../../dashboard-sidebar/DashboardSidebar';
import history from '../../../common/History';
import Icon from '../../customIcons/customIcons';
import { UserRetailOrderList, enableLoading, disableLoading, updateOrderStatusAPI } from '../../../actions'
import { convertISOToUtcDateformate, salaryNumberFormate } from '../../common';
import 'ant-design-pro/dist/ant-design-pro.css';
import { DEFAULT_IMAGE_TYPE, DASHBOARD_TYPES } from '../../../config/Config';
import { langs } from '../../../config/localization';
import { DASHBOARD_KEYS } from '../../../config/Constant'
import { SearchOutlined } from '@ant-design/icons';
import ReceivedModal from './comman-modals/ReceiveModel'
import '../user-retail/userdetail.less'
const { Option } = Select;
const { Title, Text } = Typography;

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
class ReceivedOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardDetails: {},
      currentOrders: [],
      pastOrders: [],
      allOrders: [],
      receiveModal: false,
      orderDetail: '',
      search_keyword: ''
    };
  }

  /**
  * @method  componentDidMount
  * @description called after mounting the component 
  */
  componentDidMount() {
    this.getOrderList('')
  }

  /**
   * @method  getOrderList
   * @description get order list 
   */
  getOrderList = (search_keyword) => {
    const { loggedInUser } = this.props;
    this.setState({ search_keyword: search_keyword })
    let reqData = {
      user_id: '645',
      search_keyword: search_keyword,
      //user_id: loggedInUser.id
    }
    this.props.enableLoading()
    this.props.UserRetailOrderList(reqData, res => {
      this.props.disableLoading()
      if (res.status === 200) {

        let data = res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length ? res.data.data : []

        this.setState({ allOrders: data })
      }
    })
  }

  /**
  * @method change classified status
  * @description change classified status  
  */
  changeStatus = (status, item) => {
    const { loggedInUser } = this.props
    const { search_keyword } = this.state
    let reqdata = {
      user_id: loggedInUser.id,
      order_detail_id: item.id,
      update_by: status === 'Cancelled' ? 'Buyer' : 'Seller',
      order_status: status,
      reason: 'other reason'
    }
    this.props.updateOrderStatusAPI(reqdata, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, langs.messages.change_status)
        this.getOrderList(search_keyword)
      }
    })
  }

  /**
   * @method deleteOrders
   * @description delete orders
   */
  deleteOrders = (id) => {

  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { allOrders, receiveModal, orderDetail, search_keyword } = this.state

    const { TabPane } = Tabs;

    const columns = [
      {
        title: 'Order Id',
        dataIndex: 'order_id',
        key: 'order_id'
      },
      {
        title: 'Ad Id',
        dataIndex: 'classified_id',
        key: 'classified_id'
      },
      {
        title: 'Category',
        dataIndex: 'name',
        // key: 'name'
        render: (cell, row, index) => {
          return (
            <>
              <div className='user-icon d-flex userdetail-itemtable' >
                <div>{row.category_name} {row.sub_category_name}</div>
              </div>
            </>
          )
        }
      },
      {
        title: 'Items Name',
        dataIndex: 'item_name',
        key: 'item_name',
        render: (cell, row, index) => {
          return <div className="item-name">
            {(row.item_name)}
          </div>
        }

      },
      {
        title: 'Price',
        dataIndex: 'Price',
        key: 'Price',
        render: (cell, row, index) => {
          return <div className="price">
            AU$${salaryNumberFormate(row.item_price)}
          </div>
        }
      },
      {
        title: 'Status',
        dataIndex: 'order_status',
        render: (cell, row, index) => {
          let status = row.orders ? row.order_status : 'Cancelled'
          const menu = (
            <Menu onClick={(e) => {
              this.changeStatus(e.key, row)

            }}>
              <Menu.Item key={'Shipped'}>Shipped</Menu.Item>
              <Menu.Item key={'Delivered'}>Delivered</Menu.Item>
              {status !== 'Complete' && status !== 'Cancelled' && <Menu.Item key={'Complete'}>Complete</Menu.Item>}
              {status !== 'Complete' && status !== 'Cancelled' && <Menu.Item key={'Cancelled'}>Cancelled</Menu.Item>}
              <Menu.Item key="Accepted">Accepted</Menu.Item >
              <Menu.Item key="In Process">In Process</Menu.Item >
              <Menu.Item key="Done">Done</Menu.Item >
              <Menu.Item key="Rejected">Rejected</Menu.Item>
            </Menu>
          );
          if (status === '') {
            return ''
          }
          let btnClass = "retail-pending-btn"
          if (status === 'Pending' || status === 'In Process') {
            btnClass = "retail-pending-btn"
          } else if (status === 'Cancelled' || status === 'Rejected') {
            btnClass = "retail-cancel-btn"
          } else if (status === 'Shipped' || status === 'Complete' || status === 'Done' || status === 'Delivered') {
            btnClass = "retail-shipped-btn"
          }
          return (
            <div className="right-action">
              <Row className='user-retail'>
                <Col md={22}>
                  <Dropdown overlay={menu} placement='bottomLeft' arrow>
                    <Button type='primary' className={btnClass}>
                      {status}
                    </Button>
                  </Dropdown>

                  {/* <Button className="cancel-btn"> Cancel </Button>
                            <Button className="shipped-btn"> Shipped </Button> */}
                </Col>
              </Row>
            </div>
          )
        }
      },
      {
        title: 'Type',
        dataIndex: 'payment_method',
        key: 'payment_method',
        render: (cell, row, index) => {
          return <div className="payment-method">
            {(row.payment_method ? row.payment_method : 'Paypal')}
          </div>
        }

      },
      {
        title: 'Details',
        render: (cell, row, index) => {
          return <div> <a className="order" clhref="javascript:void(0)" onClick={() => this.setState({ orderDetail: row, receiveModal: true })}>View</a></div>
        }
      },
    ]
    return (
      <Layout>
        <Layout className="profile-vendor-retail-receiv-order">
          <AppSidebar history={history} activeTabKey={DASHBOARD_KEYS.DASH_BOARD} />
          <Layout>
            <div className='my-profile-box employee-dashborad-box employee-myad-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>Orders Received </Title>
                  </div>
                  <div className='right'>
                    <div className='right-content'>&nbsp;</div>
                  </div>
                </div>

                <div className='employsearch-block'>
                  <div className='employsearch-right-pad'>
                    <Row gutter={30}>
                      <Col xs={24} md={16} lg={16} xl={14}>
                        <div className='search-block'>
                          <Input
                            placeholder='Search'
                            prefix={<SearchOutlined className='site-form-item-icon' />}
                            onChange={(e) => {
                              const { selectedDate, flag } = this.state
                              this.getOrderList(e.target.value)
                            }}
                          />
                        </div>
                      </Col>
                      <Col xs={24} md={8} lg={8} xl={10} className='employer-right-block text-right'>
                        <div className='right-view-text'>
                          <span> <img src={require('../../../assets/images/Pin.png')} /> </span><span style={{ display: 'inline-block', paddingLeft: '15px', paddingRight: '34px' }}> <img src={require('../../../assets/images/menu_list.png')}></img> </span>
                          {/* <span>{'8'} Views</span><span className='sep'>|</span><span>{'9'} Ads</span> */}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className='profile-content-box'>
                  <Card
                    bordered={false}
                    className='add-content-box job-application'
                  // title='Orders Management'
                  >

                    <Row className="grid-block">
                      <Row style={{ height: '62px' }} className="w-100" align="middle" justify="space-between">
                        <Col md={12}><h2 className="mb-0 pb-0">Orders Management<span style={{ marginLeft: "25px" }}>{`You have ${allOrders.length} orders`}</span></h2></Col>
                        <Col md={12} >
                          <div className="card-header-select"><label>Show:</label>
                            <Select style={{ color: '#EE4928' }} defaultValue="All">
                              <Option value="All Candidates">All Candidates</Option>
                              <Option value="All Candidates">All Candidates</Option>
                            </Select></div>
                        </Col>
                      </Row>
                      <Col md={24} >
                        <Table dataSource={allOrders} columns={columns} className="inspectiondetail-table retail-order-table"></Table>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {receiveModal && orderDetail &&
          <ReceivedModal
            visible={receiveModal}
            orderDetail={orderDetail}
            onCancel={() => this.setState({ receiveModal: false })}
            callNext={() => this.getOrderList(search_keyword)}
          />
        }
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, common } = store;
  const { categoryData } = common;

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    retailList: categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
  };
};
export default connect(
  mapStateToProps,
  { UserRetailOrderList, enableLoading, disableLoading, updateOrderStatusAPI }
)(ReceivedOrder)
