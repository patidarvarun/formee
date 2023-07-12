import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { MoreOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Layout,
  Card,
  Table,
  Menu,
  Dropdown,
  Button,
  Tabs,
  Row,
  Col,
  Input,
  Select,
  Switch,
} from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import {
  changeGeneralClassifiedStatus,
  enableLoading,
  disableLoading,
  deleteJobApplicationAPI,
  jobApplicationListAPI,
} from '../../../../actions';
import '../real-state/inspection.less';
import { dateFormate6 } from '../../../common';
import DeleteModel from '../../../common/DeleteModel';
const { TabPane } = Tabs;
const { Option } = Select;

class JobApplicationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'large',
      total: '',
      JobListing: [],
      showSettings: [],
      filter: '',
      search_key: '',
      delete_model: false,
      classified_id: '',
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    this.getJobApplicationList(1, langs.key.recent, '');
  }

  /**
   * @method getJobApplicationList
   * @description get job application list
   */
  getJobApplicationList = (page, filter, search_key) => {
    const { loggedInUser } = this.props;
    let reqData = {
      category_id: '',
      user_id: loggedInUser.id,
      page: page,
      per_page: 12,
      filter: filter,
      search: search_key,
    };
    this.props.jobApplicationListAPI(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let applicationList =
          res.data && Array.isArray(res.data.data) && res.data.data.length
            ? res.data.data
            : [];
        this.setState({
          JobListing: applicationList,
          total: res.data.total_ads,
          filter: filter,
          search_key: search_key,
        });
      }
    });
  };

  /**
   * @method delete classified
   * @description delete classified
   */
  deleteJobApplication = (id) => {
    const { filter, search_key } = this.state;
    const { loggedInUser } = this.props;
    let reqdata = {
      classified_id: id,
      user_id: loggedInUser.id,
    };
    this.props.deleteJobApplicationAPI(reqdata, (res) => {
      if (res.status === 200) {
        this.getJobApplicationList(1, filter, search_key);
        toastr.success(langs.success, res.data.message);
      }
    });
  };

  /**
   * @method change classified status
   * @description change classified status
   */
  changeStatus = (state, id) => {
    const { filter, search_key } = this.state;
    let reqdata = {
      id,
      state,
    };
    this.props.changeGeneralClassifiedStatus(reqdata, (res) => {
      this.getJobApplicationList(1, filter, search_key);
      toastr.success(langs.success, langs.messages.change_status);
    });
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { filter, search_key } = this.state;
    this.getJobApplicationList(e, filter, search_key);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      JobListing,
      total,
      showSettings,
      size,
      filter,
      search_key,
      delete_model,
      classified_id,
    } = this.state;
    const columns = [
      {
        title: '',
        key: 'classifiedid',
        dataIndex: 'classifiedid',
        render: (cell, row, index) => {
          return (
            <div className='switch'>
              {row.status !== 5 && row.status !== 3 && (
                <Switch
                  checked={row.status === 1 ? true : false}
                  onChange={(e) => {
                    this.changeStatus(!row.status ? 1 : '2', cell);
                  }}
                />
              )}
              <p className='active-inactive'>
                {row.status === 1 ? 'Active' : 'Inactive'}
              </p>
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: 'classifiedid',
        key: 'name',
        render: (cell, row, index) => {
          let temp =
            row.spicification &&
            Array.isArray(row.spicification) &&
            row.spicification.length
              ? row.spicification
              : [];
          let temp2 = temp.filter((el) => el.is_functional_area === 1);
          let functional_area = temp2 && temp2.length ? temp2[0].value : '';
          return (
            <div className='ad-magment-title'>
              <div style={{ minWidth: '360px' }}>
                <div className='thumb-block-right-detail'>
                  <div className='account-heading'>
                    <Link to={`/application-detail/${row.id}`}>
                      {row.title}
                    </Link>
                  </div>
                  <div className='location-text'>{`Post ended ${dateFormate6(
                    row.end_date
                  )}`}</div>
                  <div class='category-name blue-link'>{functional_area}</div>
                </div>
              </div>

              <div className='booking-count'>
                <div class='ad-block'>
                  <div class='num-detail'>{row.unprocessed_count}</div>
                  <div class='title'>Unprocessed</div>
                </div>
              </div>

              <div className='booking-count attended-count'>
                <div class='ad-block'>
                  <div class='num-detail'>{row.shortlist_count}</div>
                  <div class='title'>Shortlist</div>
                </div>
              </div>
              <div className='booking-count attended-count'>
                <div class='ad-block'>
                  <div class='num-detail'>{row.interview_count}</div>
                  <div class='title'>Interview</div>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '',
        key: 'classifiedid',
        dataIndex: 'classifiedid',
        render: (cell, row, index) => {
          return (
            <div className='ad-inspection-block' style={{ minWidth: '180px' }}>
              <div className='ad-block'>
                <div className='title'>Views</div>
                <div className='num-detail'>{row.view_count}</div>
              </div>
              <div className='ad-block'>
                <div className='title'>Applies</div>
                <div className='num-detail'>
                  {dateFormate6(row.posted_date)}
                </div>
              </div>
              <div className='ad-block'>
                <div className='title'>Ad ID</div>
                <div className='num-detail'>#{row.id}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '',
        key: 'classifiedid',
        dataIndex: 'classifiedid',
        render: (cell, row, index) => {
          let showIcons = showSettings.includes(cell);
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
          const menu = (
            <Menu
              onClick={(e) => {
                if (e.key === '1') {
                  this.props.history.push(
                    `/repost-ad/${langs.key.classified}/${cell}`
                  );
                } else if (e.key === '2') {
                  this.props.history.push(`/application-detail/${cell}`);
                } else if (e.key === '3') {
                  this.setState({ delete_model: true, classified_id: cell });
                }
              }}
            >
              {row.status === 3 && (
                <Menu.Item key={'1'}>
                  <span className='action-icon'>
                    <img
                      src={require('../../../../assets/images/icons/repost.svg')}
                      alt='repost'
                    />
                  </span>
                  Repost
                </Menu.Item>
              )}
              <Menu.Item key={'2'}>
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
                  ) : row.status === 2 ? (
                    <Button type='default' size={size}>
                      {status}
                    </Button>
                  ) : (
                    <Button type='default' danger size={size}>
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
          className={`inspection-list-v2 ad-managment-common-block ad-managment-common-block-v2 job-application-list-v2`}
        >
          <AppSidebar history={history} />
          <Layout>
            <div
              className='my-profile-box employee-dashborad-box employee-myad-box'
              style={{ background: '#fff' }}
            >
              <div className='card-container signup-tab'>
                <div className='profile-content-box mt-38'>
                  <div className='heading-search-block'>
                    <div className=''>
                      <Row gutter={0}>
                        <Col xs={24} md={24} lg={24} xl={24}>
                          <h1>
                            <span>Job Applications</span>
                          </h1>
                          <div className='search-block'>
                            <Input
                              placeholder='Search'
                              onChange={(e) =>
                                this.getJobApplicationList(
                                  1,
                                  filter,
                                  e.target.value
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
                    <div className='card-header-select'>
                      <label>Sort:&nbsp;</label>
                      <Select
                        dropdownMatchSelectWidth={false}
                        defaultValue='Most recent'
                        onChange={(e) =>
                          this.getJobApplicationList(1, e, search_key)
                        }
                      >
                        <Option value={langs.key.recent}>Most recent</Option>
                        <Option value='old'>Old</Option>
                        <Option value='a'>A to Z</Option>
                        <Option value='z'>Z to A</Option>
                      </Select>
                    </div>
                    <Tabs
                      defaultActiveKey='1'
                      type='card'
                      className='genral-ven-tab-myad genral-ven-tab-myad-v2 jobappli-genral-ven-tab-myad-v2'
                    >
                      <TabPane tab={`Jobs (${total})`} key='1'>
                        <Table
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.getJobApplicationList(page);
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: total,
                            hideOnSinglePage: true,
                          }}
                          dataSource={JobListing}
                          columns={columns}
                          rowClassName={(record) =>
                            record.status === 3 ||
                            (record.status === 0 && record.is_expired === 1)
                              ? 'ant-table-row-reject'
                              : ''
                          }
                        ></Table>
                      </TabPane>
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
            callDeleteAction={() => this.deleteJobApplication(classified_id)}
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
  };
};
export default connect(mapStateToProps, {
  deleteJobApplicationAPI,
  jobApplicationListAPI,
  enableLoading,
  disableLoading,
  changeGeneralClassifiedStatus,
})(withRouter(JobApplicationList));
