import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import moment from 'moment';
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message';
import Icon from '../../../../components/customIcons/customIcons';
import {
  Switch,
  Layout,
  Dropdown,
  Card,
  Typography,
  Table,
  Button,
  Select,
  Col,
  Row,
} from 'antd';
import AppSidebar from '../../../../components/dashboard-sidebar/DashboardSidebar';
import { LeftOutlined } from '@ant-design/icons';
import history from '../../../../common/History';
import { DEFAULT_IMAGE_CARD } from '../../../../config/Config';
import {
  sendEmailToBookInspection,
  markAsAttended,
  deleteInspectionAPI,
  getInspectionListAPI,
  getClassfiedCategoryDetail,
  changeApplicationStatus,
  getCandidatesList,
  disableLoading,
  enableLoading,
} from '../../../../actions';
import {
  salaryNumberFormate,
  convertISOToUtcDateformate,
  displayInspectionDate,
  formateTime,
} from '../../../common';
import { rating } from '../../../classified-templates/CommanMethod';
import SendEmailModal from './SendEmailToInspection';
import './inspection.less';
const { Title, Text } = Typography;
const { Option } = Select;

class ApplicationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      jobApplications: [],
      classifiedDetail: {},
      size: 'large',
      salary: '',
      salary_type: '',
      company_name: '',
      about_job: '',
      opportunity: '',
      carouselNav2: null,
      allData: '',
      inspectionList: [],
      inspections_times: [],
      defaultDate: '27 dec 2019 12am',
      visible: false,
      inspectionDetail: '',
      filter: langs.key.recent
    };
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getDetails();
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = () => {
    const { isLoggedIn, loggedInUser } = this.props;
    let classified_id = this.props.match.params.id;
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInUser.id : '',
    };
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ classifiedDetail: res.data.data, allData: res.data });
        this.getInspectionList(1, langs.key.recent);
      }
    });
  };

  /**
   * @method getInspectionList
   * @description get inspection list
   */
  getInspectionList = (page, filter) => {
    let classified_id = this.props.match.params.id;
    let reqData = {
      classified_id: classified_id,
      page: page,
      per_page: 10,
      filter: filter
    };
    this.props.getInspectionListAPI(reqData, (res) => {
      if (res.status === 200) {
        let item = res.data && res.data.data;
        let inspectionList =
        item && Array.isArray(item.data) && item.data.length ? item.data : [];
        let inspections_times =
        res.data &&
        res.data.inspections_times &&
        Array.isArray(res.data.inspections_times) &&
        res.data.inspections_times.length
        ? res.data.inspections_times
        : [];
        let date = inspections_times
        ? inspections_times[0].inspection_date_time
        : '';
        
        this.setState({
          inspectionList: inspectionList,
          total_ads: item.total,
          inspections_times: inspections_times,
          defaultDate: date,
        });
      }
    });
  };

  /**
   * @method getData
   * @description get inspection data
   */
  getData = (reqData) => {
    this.props.getInspectionListAPI(reqData, (res) => {
      if (res.status === 200) {
        let item = res.data && res.data.data;
        let inspectionList =
          item && Array.isArray(item.data) && item.data.length ? item.data : [];
        let inspections_times =
          res.data &&
          res.data.inspections_times &&
          Array.isArray(res.data.inspections_times) &&
          res.data.inspections_times.length
            ? res.data.inspections_times
            : [];
        this.setState({
          inspectionList: inspectionList,
          total_ads: item.total,
          inspections_times: inspections_times,
        });
      }
    });
  };

  /**
   * @method renderIcon
   * @description render icons
   */
  renderIcon = (data) => {
    const iconData = data.filter(el => el.slug === 'Land Size' || el.slug === 'Floor Size' ||  el.slug === 'bedroom' || el.slug === 'type-bathroom' || el.slug === 'Parking Type' || el.slug === 'Shower' || el.slug === 'Parking' || el.slug === 'Property Type' || el.slug === 'car_spaces' || el.slug === 'Area Size')
    return iconData && Array.isArray(iconData) && iconData.map((el, i) => {
    return (
        <li>
          {el.slug === 'Land Size' && <img src={require('../../../../assets/images/icons/unit-squre-first.svg')} alt='' />}
          {el.slug === 'Land Size' &&  <span className='unit-digit'>{el.value}</span>}
          {el.slug === 'Floor Size' && <img  src={require('../../../../assets/images/icons/unit-squre-second.svg')} alt='' />}
          {el.slug === 'Floor Size' &&  <span className='unit-digit'>{el.value}</span>}
          {el.slug === 'bedroom' && <img src={require('../../../../assets/images/icons/bedroom.svg')} alt='' />}
          {el.slug === 'bedroom' && <span className='unit-digit'>{el.value}</span>}
          {(el.slug === 'Shower' || el.slug === 'type-bathroom') && <img src={require('../../../../assets/images/icons/bathroom.svg')} alt='' />}
          {(el.slug === 'Shower' || el.slug === 'type-bathroom') && <span className='unit-digit'>{el.value}</span>}
          {(el.slug === 'Parking' || el.slug === 'Parking Type' || el.slug === 'car_spaces') && <img src={require('../../../../assets/images/icons/carpark.svg')} alt='' />}
          {(el.slug === 'Parking' || el.slug === 'Parking Type' || el.slug === 'car_spaces') && <span className='unit-digit'>{el.value}</span>}
          {(el.slug === 'Property Type' || el.slug === 'Area Size') && <img src={require('../../../../assets/images/icons/land-size.svg')} alt='' />}
          {(el.slug === 'Property Type' || el.slug === 'Area Size') && <span className='unit-digit'>{el.value}</span>}
        </li>
        )
    })
  };

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    const { filter } = this.state
    this.getInspectionList(e,filter);
  };

  /**
   * @method handleRecordChange
   * @description handle inspection date change
   */
  handleRecordChange = (item) => {
    this.setState({ defaultDate: item });

    let reqData = {
      classified_id: this.props.match.params.id,
      page: 1,
      per_page: 10,
      inspection_date_time: item,
    };
    this.getData(reqData);
  };

  /**
   * @method deleteInspection
   * @description delete inspection by id
   */
  deleteInspection = (id) => {
    const { filter } = this.state
    let reqData = {
      inspection_id: id,
    };
    this.props.deleteInspectionAPI(reqData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.INSPECTION_DELETE_SUCCESS);
        this.getInspectionList(1, filter);
      }
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      visible,
      inspectionDetail,
      defaultDate,
      inspections_times,
      inspectionList,
      total_ads,
      classifiedDetail,
      allData,
      company_name,
      filter
    } = this.state;
    let rate =
      classifiedDetail &&
      classifiedDetail.classified_hm_reviews &&
      rating(classifiedDetail.classified_hm_reviews);
    let parameter = this.props.match.params;
    let cat_id = parameter.categoryId;
    let classified_id = parameter.id;
    let inspectionTime = allData && allData.inspections_times;
    let imgLength = Array.isArray(classifiedDetail.classified_image)
      ? classifiedDetail.classified_image.length
      : 1;
    let inspectionData =
      inspectionTime && Array.isArray(inspectionTime) && inspectionTime.length
        ? inspectionTime[0]
        : '';
    let date = inspectionData.inspection_date
      ? displayInspectionDate(
          new Date(inspectionData.inspection_date).toISOString()
        )
      : '';
    let time = inspectionData.inspection_date
      ? `${formateTime(inspectionData.inspection_start_time)} - ${formateTime(
          inspectionData.inspection_end_time
        )}`
      : '';
    let temp = allData && allData.spicification && Array.isArray(allData.spicification) && allData.spicification.length ? allData.spicification : [];
    let temp2 = temp.filter((el) => el.slug === 'rent');
    let residential_rent = temp2 && temp2.length ? temp2[0].value : '';

    const dateTime = (
      <ul className='c-dropdown-content'>
        {inspections_times &&
          Array.isArray(inspections_times) &&
          inspections_times.length &&
          inspections_times.map((el, i) => (
            <li
              key={i}
              onClick={() => this.handleRecordChange(el.inspection_date_time)}
              style={{ cursor: 'pointer' }}
            >
              <Text>{el.inspection_date_time}</Text>
            </li>
          ))}
      </ul>
    );
    let crStyle =
      imgLength === 2 || imgLength === 1 || imgLength === 3
        ? 'product-gallery-nav hide-clone-slide'
        : 'product-gallery-nav ';
    let contactNumber =
      classifiedDetail.contact_mobile && classifiedDetail.contact_mobile;
    let formatedNumber =
      contactNumber && contactNumber.replace(/\d(?=\d{4})/g, '*');
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
              {row.name ? `${row.name}` : ''}{' '}
              <span className='new-user'>New</span>{' '}
            </div>
          );
        },
      },
      {
        title: 'Phone',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Attended',
        key: 'job_id',
        dataIndex: 'job_id',
        render: (cell, row, index) => {
          
          return (
            <div>
              <ul className='p-0 mb-0' style={{ padding: 0 }}>
                <li>
                  <div className='switch inpect-switch'>
                    <Switch
                      // disabled
                      checked={
                        row.is_atended === 1 ? true : false
                      }
                      onChange={(checked) => {
                        if(checked){
                          let isDateApplying =
                            moment(row.inspection_date).isBefore(moment()) ||
                            moment(row.inspection_date).isSame(moment());
                          if(!isDateApplying){
                            toastr.error('Date and time not applying')
                            return;
                          }
                          let isTimeApplying = moment().format('HH:mm:ss') > row.inspection_time 
                          console.log(moment().format('HH:mm:ss'),'isTimeApplying: ', isTimeApplying,row.inspection_time);
                          if(!isTimeApplying){
                            toastr.error('Date and time not applying')
                            return;
                          }
                        }
                        
                        let requestData = {
                          inspection_id: row.id,
                          is_attended: checked ? 1 : 0,
                        };
                        // if(row.looking_for_agent === 0){
                        this.props.markAsAttended(requestData, (res) => {
                          if (res.status === 200) {
                            toastr.success(
                              langs.success,
                              res.data && res.data.msg
                            );
                            this.getInspectionList(1, filter);
                          }
                        });
                        // }
                      }}
                    />
                  </div>
                </li>
              </ul>
            </div>
          );
        },
      },
      {
        title: '',
        key: 'job_id',
        dataIndex: 'job_id',
        render: (cell, row, index) => {
          return (
            <div className='inspection-details-sec'>
              <ul className='action'>
                <li
                  onClick={() =>
                    this.setState({ visible: true, inspectionDetail: row })
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={require('../../../dashboard-sidebar/icons/email.svg')}
                    alt=''
                    width='21'
                  />
                </li>
              </ul>
            </div>
          );
        },
      },
    ];

    return (
      <Layout>
        <Layout className='profile-vendor-retail-inspection-order view-inspection-detail-v2'>
          <AppSidebar history={history} />
          <Layout>
            <div
              className='my-profile-box employee-dashborad-box employee-myad-box'
              style={{ minHeight: 800 }}
            >
              <div className='card-container signup-tab'>
                <div className='go-back' style={{cursor:'pointer'}}
                  onClick={() => this.props.history.goBack()}>
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
                            <ul className='info-list'>
                              {allData &&
                                allData.spicification &&
                                this.renderIcon(allData.spicification)}
                            </ul>
                          </div>
                        </Col>
                        <Col xs={24} sm={24} md={6}>
                          <div className='status'>
                            <label className='mr-0'>
                              <Button
                                type='primary'
                                className={classifiedDetail.status === 1 ? 'btn-active-green' : 'btn-grey' }
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
                            <li>
                              <span className='label'>Sub Category:&nbsp;</span>
                              <span>{residential_rent}</span>
                            </li>
                          </ul>
                        </Col>
                      </Row>
                      <Row>
                        <Dropdown
                          overlay={dateTime}
                          className='c-dropdown mt-50'
                        >
                          <Button>
                            <Icon icon='clock' size='21' className='mr-10' />
                            <Text className='time'>Inspection Time</Text>{' '}
                            <Text className='date'>{defaultDate}</Text>
                            <Icon
                              icon='arrow-down'
                              size='14'
                              className='ml-12'
                            />
                          </Button>
                        </Dropdown>
                      </Row>
                    </div>

                    <Row className='grid-block' gutter={0}>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <h2>
                          Total Bookings{' '}
                          <span>{`(${inspectionList.length})`}</span>
                        </h2>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12}>
                         <div className='card-header-select'><label>Sort:&nbsp;</label>
                          <Select dropdownMatchSelectWidth={false} defaultValue='Most recent' onChange={(e) =>  this.getInspectionList(1, e)}>
                            <Option value={langs.key.recent}>Most recent</Option>
                            <Option value='old'>Old</Option>
                            <Option value='a'>A to Z</Option>
                            <Option value='z'>Z to A</Option>
                          </Select>
                        </div>
                      </Col>
                      <Col md={24}>
                        <Table
                          dataSource={inspectionList}
                          columns={columns}
                          className='inspectiondetail-table'
                          pagination={{
                            onChange: (page, pageSize) => {
                              this.setState({ activePage: page });
                            },
                            defaultPageSize: 10,
                            showSizeChanger: false,
                            total: total_ads,
                            hideOnSinglePage: true
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {visible && (
          <SendEmailModal
            visible={visible}
            onCancel={() => this.setState({ visible: false })}
            inspectionDetail={inspectionDetail}
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  sendEmailToBookInspection,
  markAsAttended,
  deleteInspectionAPI,
  getInspectionListAPI,
  getClassfiedCategoryDetail,
  changeApplicationStatus,
  getCandidatesList,
  enableLoading,
  disableLoading,
})(ApplicationDetail);
