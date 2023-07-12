import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { langs } from '../../../../config/localization';
import { MoreOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Layout,
  Card,
  Table,
  Menu,
  Dropdown,
  Typography,
  Button,
  Tabs,
  Row,
  Col,
  Input,
  Select,
} from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import {
  enableLoading,
  disableLoading,
  deleteMyOfferAPI,
  getGeneralVendorMyOfferList,
  deleteGeneralClassified,
  deleteClassifiedOfferReceivedAPI,
} from '../../../../actions';
import {
  salaryNumberFormate,
  dateFormate6,
} from '../../../common';
import { DEFAULT_IMAGE_CARD } from '../../../../config/Config';
import DeleteModel from '../../../common/DeleteModel';
import '../real-state/inspection.less';
const { Title } = Typography;
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
      activePage: 1,
      search_key: '',
      filter: 'recent',
      categoryList: [],
      category_id: '',
      delete_model: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getMyOffersList(1, '', 'recent', '');
  }

  /**
   * @method  get Offer List
   * @description get classified
   */
  getMyOffersList = (page, search_key, filter, category_id) => {
    const { id } = this.props.userDetails.user;
    let reqData = {
      vendor_id: id,
      page_size: 10,
      page: page !== undefined ? Number(page) : 1,
      search: search_key,
      filter: filter,
      category_id: category_id,
    };
    //
    this.props.getGeneralVendorMyOfferList(reqData, (res) => {
      this.props.disableLoading();
      if (
        res.status === 1 &&
        Array.isArray(res.data.data) &&
        res.data.data.length
      ) {
        console.log('res.data.categories', res);
        this.setState({
          search_key: search_key,
          filter: filter,
          currentList: res.data.data,
          total_ads: res.data.total,
          category_id: category_id,
          categoryList:
            Array.isArray(res.categories) && res.categories.length
              ? res.categories
              : [],
        });
      } else {
        this.setState({ currentList: [], categoryList: [] });
      }
    });
  };

  /**
   * @method blankCheck
   * @description Blanck check of undefined & not null
   */
  blankCheck = (value) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== 'Invalid date' &&
      value !== '' &&
      value !== 'null' &&
      value !== 'undefined'
    ) {
      return value;
    } else {
      return '';
    }
  };

  /**
   * @method onCategoryChange
   * @description on category change render records
   */
  onCategoryChange = (category_id) => {
    const { activePage, filter, search_key } = this.state;
    this.getMyOffersList(activePage, search_key, filter, category_id);
  };

  /**
   * @method deleteClassifiedMyOffer
   * @description delete classified ads
   */
  deleteClassifiedMyOffer = (id) => {
    const { activePage, filter, search_key, category_id } = this.state;
    let reqdata = {
      classified_id: id,
    };
    this.props.deleteClassifiedOfferReceivedAPI(reqdata, (res) => {
      console.log('res.status', res.status);
      if (res.status === 200 || res.status === 1) {
        this.getMyOffersList(activePage, search_key, filter, category_id);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      category_id,
      categoryList,
      total_ads,
      size,
      showSettings,
      activePage,
      filter,
      search_key,
      delete_model,
      classified_id,
      currentList,
    } = this.state;
    const { myOffers } = this.props;
    console.log('categoryList', currentList);
    const columns = [
      {
        title: '',
        dataIndex: 'id',
        key: 'name',
        render: (cell, row, index) => {
          let temp =
            row.spicification &&
            Array.isArray(row.spicification) &&
            row.spicification.length
              ? row.spicification
              : [];
          let temp2 = temp.filter((el) => el.slug === 'rent');
          let residential_rent = temp2 && temp2.length ? temp2[0].value : '';
          return (
            <div className='ad-magment-title'>
              <div style={{ minWidth: '320px' }}>
                <div className='thumb-block-left'>
                  <div className='thumb'>
                    <div className='status-sold'>
                      {row.is_sold === 1 ? 'SOLD' : ''}
                    </div>
                    <img
                      src={
                        row && row.image !== undefined && row.image !== null
                          ? row.image
                          : DEFAULT_IMAGE_CARD
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE_CARD;
                      }}
                      style={{ cursor: 'pointer' }}
                      alt={''}
                    />
                  </div>
                </div>

                <div className='thumb-block-right-detail'>
                  <Title level={4} className='title'>
                    <Link to={`/my-offer-details/${row.id}`}>{row.title}</Link>
                  </Title>
                  <div className='price'>{`AU$${salaryNumberFormate(
                    row.price
                  )}`}</div>
                  <div class='category-name blue-link'>{row.category_name}</div>
                </div>
              </div>

              <div className='booking-count'>
                <div class='ad-block'>
                  <div class='num-detail'>{row.offer_count}</div>
                  <div class='title'>Offers Reciived</div>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '',
        key: 'id',
        dataIndex: 'id',
        render: (cell, row, index) => {
          return (
            <div className='ad-inspection-block'>
              <div className='ad-block'>
                <div className='title'>Views</div>
                <div className='num-detail'>
                  {row.view_count ? row.view_count : 0}
                </div>
              </div>
              <div className='ad-block'>
                <div className='title'>Ad ID</div>
                <div className='num-detail'>#{cell}</div>
              </div>

              <div className='ad-block'>
                <div className='title'>Ad expires</div>
                <div className='num-detail'>
                  {dateFormate6(row.expiry_date)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '',
        key: 'id',
        dataIndex: 'id',
        render: (cell, row, index) => {
          let status = '';
          if (row.status === 0 && row.is_expired === 1) {
            status = 'Expired';
          } else if (row.status === 2 || row.status === 4) {
            status = 'Pending';
          } else if (row.status === 3) {
            status = 'Rejected';
          } else if (row.status === 1) {
            status = 'Live';
          } else {
            status = 'Inactive';
          }
          let showIcons = showSettings.includes(cell);
          const menu = (
            <Menu
              onClick={(e) => {
                if (e.key === '1') {
                  this.props.history.push(`/my-offer-details/${row.id}`);
                } else if (e.key === '3') {
                  this.setState({ delete_model: true, classified_id: row.id });
                }
              }}
            >
              <Menu.Item key={1}>
                <span className='action-icon'>
                  <img
                    src={require('../../../../assets/images/icons/view-action.svg')}
                    alt='View'
                  />
                </span>
                Overview
              </Menu.Item>
              <Menu.Item key={3}>
                <span className='action-icon'>
                  <img
                    src={require('../../../../assets/images/icons/delete-action.svg')}
                    alt='delete'
                  />
                </span>
                Delete
              </Menu.Item>
            </Menu>
          );

          if (row.status === '') {
            return '';
          }
          return (
            <div className='right-action'>
              <Row>
                <Col span={22}>
                  {row.status === 1 ? (
                    <Button type='default' size={size}>
                      {status}
                    </Button>
                  ) : (
                    <Button type='default' size={size}>
                      {status}
                    </Button>
                  )}
                </Col>
                <Col span={2} className='edit-delete-dot'>
                  <Dropdown
                    overlay={menu}
                    placement='bottomCenter'
                    arrow='true'
                    overlayClassName='right-action-dropedown'
                  >
                    <MoreOutlined
                      size={30}
                      onClick={() => {
                        if (!showIcons) {
                          showSettings.push(cell);
                          this.setState({ showSettings });
                        } else {
                          let temp = showSettings.filter((l) => l !== cell);
                          this.setState({ showSettings: temp });
                        }
                      }}
                    />
                  </Dropdown>
                </Col>
              </Row>
              {showIcons}
            </div>
          );
        },
      },
    ];

    return (
      <Layout>
        <Layout
          className={`inspection-list-v2 ad-managment-common-block offer-list-v2`}
        >
          <AppSidebar history={history} />
          <Layout>
            <div
              className='my-profile-box employee-dashborad-box employee-myad-box'
              style={{ minHeight: 800, background: '#fff' }}
            >
              <div className='card-container signup-tab'>
                <div className='profile-content-box mt-38'>
                  <div className='heading-search-block'>
                    <div className=''>
                      <Row gutter={0}>
                        <Col xs={24} md={24} lg={24} xl={24}>
                          <h1>
                            <span>Offers</span>
                          </h1>
                          <div className='search-block'>
                            <Input
                              placeholder='Search'
                              onChange={(e) =>
                                this.getMyOffersList(
                                  1,
                                  e.target.value,
                                  filter,
                                  category_id
                                )
                              }
                              prefix={
                                <SearchOutlined className='site-form-item-icon' />
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <Card
                    bordered={false}
                    className='add-content-box job-application'
                  >
                    <div className='card-header-select '>
                      <Row gutter={0}>
                        <Col xs={24} md={24} lg={14} xl={14}>
                          <label>&nbsp;</label>
                          <Select
                            dropdownMatchSelectWidth={false}
                            defaultValue='All Categories'
                            onChange={(e) => {
                              this.onCategoryChange(e);
                            }}
                            className='card-header-categories'
                          >
                            <Option value=''>All Categories</Option>
                            {categoryList &&
                              categoryList.map((el, i) => {
                                return (
                                  <Option key={el.id} value={el.id}>
                                    {el.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Col>
                        <Col xs={24} md={24} lg={10} xl={10}>
                          <label>Sort:&nbsp;</label>
                          <Select
                            dropdownMatchSelectWidth={false}
                            defaultValue='Most recent'
                            onChange={(e) =>
                              this.getMyOffersList(
                                1,
                                search_key,
                                e,
                                category_id
                              )
                            }
                          >
                            <Option value='recent'>Most recent</Option>
                            <Option value='old'>Old</Option>
                            <Option value='a'>A to Z</Option>
                            <Option value='z'>Z to A</Option>
                          </Select>
                        </Col>
                      </Row>
                    </div>

                    <Tabs
                      defaultActiveKey={1}
                      type='card'
                      className='genral-ven-tab-myad genral-ven-tab-myad-v2'
                    >
                      <Table
                        pagination={{
                          onChange: (page, pageSize) => {
                            this.setState({ activePage: page });
                          },
                          defaultPageSize: 10,
                          showSizeChanger: false,
                          total: total_ads,
                          hideOnSinglePage: true,
                        }}
                        dataSource={currentList}
                        columns={columns}
                        rowClassName={(record) =>
                          record.status === 3 ||
                          (record.status === 0 && record.is_expired === 1)
                            ? 'ant-table-row-reject'
                            : ''
                        }
                      ></Table>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {delete_model && (
          <DeleteModel
            visible={delete_model}
            onCancel={() => this.setState({ delete_model: false })}
            callDeleteAction={() => this.deleteClassifiedMyOffer(classified_id)}
            label={'AD'}
          />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
    privateUserDetails:
      profile.userProfile !== null ? profile.userProfile : null,
    myOffers: Array.isArray(store.classifiedsVendor.generalMyOffer)
      ? store.classifiedsVendor.generalMyOffer
      : [],
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  deleteMyOfferAPI,
  getGeneralVendorMyOfferList,
  deleteGeneralClassified,
  deleteClassifiedOfferReceivedAPI,
})(MyAds);
