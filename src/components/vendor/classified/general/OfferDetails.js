import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import {
  Layout,
  Card,
  Typography,
  Table,
  Button,
  Select,
  Col,
  Row,
} from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import { LeftOutlined } from '@ant-design/icons';
import history from '../../../../common/History';
import {
  getClassfiedCategoryDetail,
  changeGeneralOfferStatus,
  getOfferDetailList,
  disableLoading,
  enableLoading,
  changeGeneralClassifiedStatus,
} from '../../../../actions';
import {
  salaryNumberFormate,
  convertISOToUtcDateformate,
  displayDateTimeFormate,
} from '../../../common';
import { GENERAL_APPICANT_STATUS } from '../../../../config/Config';
import { rating } from '../../../classified-templates/CommanMethod';
import SendEmailModal from '../real-state/SendEmailToInspection';
import { DEFAULT_IMAGE_CARD } from '../../../../config/Config';
import './general.less';

const { Title } = Typography;
const { Option } = Select;

class ApplicationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      myOfferList: [],
      classifiedDetail: {},
      size: 'large',
      salary: '',
      salary_type: '',
      company_name: '',
      about_job: '',
      opportunity: '',
      visible: false,
      offerDetail: '',
      total: '',
      filter: langs.key.recent,
    };
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getDetails(langs.key.recent);
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = (filter) => {
    const { isLoggedIn, loggedInUser } = this.props;
    let classified_id = this.props.match.params.id;
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInUser.id : '',
    };
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let data = {
          classified_id: res.data.data.id,
          filter: filter,
        };
        this.props.getOfferDetailList(data, (res2) => {
          if (res2.status === 1) {
            this.setState({
              myOfferList: res2.data.data,
              classifiedDetail: res.data.data,
              total: res2.data.total,
              filter: filter,
            });
          } else {
            this.setState({ classifiedDetail: res.data.data });
          }
        });
      }
    });
  };

  /**
   * @method change classified status
   * @description change classified status
   */
  changeStatus = (status, id) => {
    let reqdata = {
      offer_id: id,
      status: status,
    };
    this.props.enableLoading();
    this.props.changeGeneralOfferStatus(reqdata, (res) => {
      this.props.disableLoading();
      this.getDetails();
      toastr.success(langs.success, langs.messages.change_status);
    });
  };

  changeClassifiedStatus = (classifiedId, id) => {
    const { isLoggedIn, loggedInUser } = this.props;
    let reqdata = {
      classified_id: classifiedId,
      user_id: isLoggedIn ? loggedInUser.id : '',
      // status: 'sold'
    };
    this.props.enableLoading();
    this.props.changeGeneralClassifiedStatus(reqdata, (res) => {
      this.props.disableLoading();
      this.getDetails();
      toastr.success(langs.success, langs.messages.change_status);
    });
  };

  /**
   * @method renderSpecification
   * @description render specification
   */
  renderSpecification = (data) => {
    let temp1 = '',
      temp2 = '',
      temp3 = '',
      temp4 = '',
      temp5 = '',
      temp6 = '',
      temp7 = '',
      temp8 = '';
    data &&
      data.map((el, i) => {
        if (el.key === 'Salary Range') {
          temp1 = el.value;
        } else if (el.key === 'Salary Type') {
          temp2 = el.value;
        } else if (el.key === 'Company Name') {
          temp3 = el.value;
        } else if (el.key === 'Job Type') {
          temp4 = el.value;
        } else if (el.key === 'Opportunity') {
          temp5 = el.value;
        } else if (el.key === 'How do I apply?') {
          temp6 = el.value;
        } else if (el.key === 'About you') {
          temp7 = el.value;
        } else if (el.key === 'Key Responsibilities') {
          temp8 = el.value;
        }
      });
    this.setState({
      salary: temp1 ? temp1 : '',
      salary_type: temp2 ? temp2 : '',
      company_name: temp3 ? temp3 : '',
      about_job: temp4 ? temp4 : '',
      opportunity: temp5 ? temp5 : '',
      apply: temp6 ? temp6 : '',
      about_you: temp7 ? temp7 : '',
      responsbility: temp8 ? temp8 : '',
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      total,
      offerDetail,
      visible,
      myOfferList,
      size,
      responsbility,
      classifiedDetail,
      allData,
      salary,
      salary_type,
      company_name,
    } = this.state;
    let rate =
      classifiedDetail &&
      classifiedDetail.classified_hm_reviews &&
      rating(classifiedDetail.classified_hm_reviews);
    let parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let classified_id = parameter.id;
    let formateSalary = salary && salary !== '' && salary.split(';');
    let range1 = formateSalary && formateSalary[0];
    let range2 = formateSalary && formateSalary[1];
    let totalSalary =
      range1 !== undefined && range2 !== undefined
        ? `$${range1} - $${range2} ${salary_type}`
        : `$${range1} ${salary_type}`;
    const columns = [
      {
        title: 'No.',
        dataIndex: 'No',
        render: (cell, row, index) => {
          return index + 1;
        },
      },
      {
        title: 'Name',
        dataIndex: 'classifiedid',
        render: (cell, row, index) => {
          return (
            <div>
              {`${row.sender.fname} ${row.sender.lname}`}{' '}
              <span className='new-user'>New</span>{' '}
            </div>
          );
        },
      },

      {
        title: 'Date',
        dataIndex: 'created_at',
        // key: 'created_at',
        render: (cell, row, index) => {
          return displayDateTimeFormate(row.created_at);
        },
      }, //
      {
        title: 'Offer Received',
        dataIndex: 'offer_price',
        render: (cell, row, index) => {
          return (
            <div className='prize-big-text'>{`AU$${salaryNumberFormate(
              row.offer_price
            )}`}</div>
          );
        },
      },
      {
        key: 'job_id',
        render: (cell, row, index) => {
          return (
            <div className='btn-block '>
              <div className='offer-declined'>
                {row.status === GENERAL_APPICANT_STATUS.REJECT && (
                  <div className='view new-offer'>
                    <img
                      src={require('../../../../assets/images/icons/offer-declined.svg')}
                      width='18'
                      alt='View'
                    />
                    {'Offer Declined'}
                  </div>
                )}
                {(row.status === 'Pending' ||
                  row.status === GENERAL_APPICANT_STATUS.ACCEPT) && (
                  <Button
                    type='primary'
                    className='decline'
                    size={size}
                    disabled={row.messages_classifieds && row.messages_classifieds.is_sold ? true : false}
                    onClick={() => {
                      this.changeStatus(
                        GENERAL_APPICANT_STATUS.REJECT,
                        cell.id
                      );
                    }}
                  >
                    Decline
                  </Button>
                )}
              </div>
              <div className='offer-accepted'>
                {row.status === GENERAL_APPICANT_STATUS.ACCEPT && (
                  <div className='view new-offer'>
                    <img
                      src={require('../../../../assets/images/icons/offer-accepted.svg')}
                      width='18'
                      alt='View'
                    />
                    {'Offer Accepted'}
                  </div>
                )}
                {(row.status === 'Pending' ||
                  row.status === GENERAL_APPICANT_STATUS.REJECT) && (
                  <Button
                    type='primary'
                    className='accept'
                    size={size}
                    disabled={row.messages_classifieds && row.messages_classifieds.is_sold ? true : false}
                    danger
                    onClick={() => {
                      this.changeStatus(
                        GENERAL_APPICANT_STATUS.ACCEPT,
                        cell.id
                      );
                    }}
                  >
                    Accept
                  </Button>
                )}
              </div>
            </div>
          );
        },
      },

      {
        title: '',
        key: 'job_id',
        render: (cell, row, index) => {
          return (
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <img
                  src={require('../../../dashboard-sidebar/icons/message.png')}
                  alt=''
                  width='21'
                  onClick={() =>
                    this.setState({ visible: true, offerDetail: row })
                  }
                />
              </Col>
            </Row>
          );
        },
      },
    ];
    return (
      <Layout>
        <Layout className='profile-vendor-retail-inspection-order view-inspection-detail-v2 view-offer-detail-v2'>
          <AppSidebar history={history} />
          <Layout>
            <div
              className='my-profile-box employee-dashborad-box employee-myad-box'
              style={{ minHeight: 800 }}
            >
              <div className='card-container signup-tab'>
                <div
                  className='go-back'
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.props.history.goBack()}
                >
                  <LeftOutlined /> Back
                </div>
                <div className='profile-content-box'>
                  <Card
                    bordered={false}
                    className='add-content-box job-application'
                  >
                    <div className='application-detail inpection-detail'>
                      <Row gutter={[0, 0]}>
                        <Col xs={24} sm={24} md={5} lg={5}>
                          {classifiedDetail &&
                          Array.isArray(classifiedDetail.classified_image) &&
                          classifiedDetail.classified_image.length !== 0 ? (
                            <Row gutter={0}>
                              {classifiedDetail.classified_image
                                .slice(0, 1)
                                .map((el) => {
                                  return (
                                    <Col>
                                      <div className='thumb-left-block test'>
                                        <img
                                          src={
                                            el.full_name
                                              ? el.full_name
                                              : DEFAULT_IMAGE_CARD
                                          }
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = DEFAULT_IMAGE_CARD;
                                          }}
                                          alt={''}
                                        />
                                      </div>
                                    </Col>
                                  );
                                })}
                            </Row>
                          ) : (
                            <Col className='thumb'>
                              <div>
                                <img src={DEFAULT_IMAGE_CARD} alt='' />
                              </div>
                            </Col>
                          )}
                        </Col>
                        <Col xs={24} sm={24} md={13}>
                          <div className='product-detail-right'>
                            <Title level={2}>{classifiedDetail.location}</Title>
                            <div className='price'>
                              {'AU$'}{' '}
                              {salaryNumberFormate(classifiedDetail.price)}
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} sm={24} md={6}>
                          <div className='status'>
                            <label className='mr-0'>
                              <Button
                                type='primary'
                                className='btn-active-green'
                              >
                                {classifiedDetail.status === 0
                                  ? 'Inactive'
                                  : 'Active'}
                              </Button>
                            </label>{' '}
                            {company_name}
                          </div>
                          <ul className='ad-post-detail'>
                            <li>
                              <span className='label'>Category:&nbsp;</span>{' '}
                              <span className='detail'>
                                {classifiedDetail.subcategoriesname &&
                                  classifiedDetail.subcategoriesname.name}
                              </span>
                            </li>
                            <li>
                              <span className='label'>Last Posted:&nbsp;</span>{' '}
                              <span className='detail'>
                                {classifiedDetail &&
                                  convertISOToUtcDateformate(
                                    classifiedDetail.created_at
                                  )}
                              </span>
                            </li>
                            <li>
                              <span className='label'>Views:&nbsp;</span>
                              <span>{classifiedDetail.count}</span>
                            </li>
                            <li>
                              <span className='label'>Ad Id:&nbsp;</span>
                              <span>{classified_id}</span>
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </div>
                    <Row className='grid-block' gutter={0}>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <h2>
                          Offer Received{' '}
                          <span>{`(${myOfferList.length})`}</span>
                        </h2>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <div className='card-header-select'>
                          <label>Sort:&nbsp;</label>
                          <Select
                            dropdownMatchSelectWidth={false}
                            defaultValue='Most recent'
                            onChange={(e) => this.getDetails(e)}
                          >
                            <Option value={langs.key.recent}>Most recent</Option>
                            <Option value='old'>Old</Option>
                            <Option value='a'>A to Z</Option>
                            <Option value='z'>Z to A</Option>
                          </Select>
                        </div>
                      </Col>
                      <Col md={24}>
                        <Table
                          dataSource={myOfferList}
                          columns={columns}
                          className='inspectiondetail-table'
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: total,
                            hideOnSinglePage: true,
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
          {visible && (
            <SendEmailModal
              visible={visible}
              onCancel={() => this.setState({ visible: false })}
              inspectionDetail={offerDetail}
            />
          )}
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  getClassfiedCategoryDetail,
  changeGeneralOfferStatus,
  getOfferDetailList,
  enableLoading,
  disableLoading,
  changeGeneralClassifiedStatus,
})(ApplicationDetail);
