import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Magnifier from 'react-magnifier';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { MESSAGES } from '../../../../config/Message'
import Icon from '../../../../components/customIcons/customIcons';
import { Pagination, Switch, Carousel, Layout, Menu, Dropdown, Card, Typography, Popover, Table, Button, Select, Input, Rate, Col, Row } from 'antd';
import AppSidebar from '../../../../components/dashboard-sidebar/DashboardSidebar';
import { DownOutlined, SearchOutlined, EditOutlined, DeleteOutlined, DeleteFilled } from '@ant-design/icons';
import history from '../../../../common/History';
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../../config/Config';
import PostAdPermission from '../../../templates/PostAdPermission'
import { sendEmailToBookInspection, markAsAttended, deleteInspectionAPI, getInspectionListAPI, getClassfiedCategoryDetail, changeApplicationStatus, getCandidatesList, disableLoading, enableLoading } from '../../../../actions'
import { salaryNumberFormate, convertISOToUtcDateformate, displayDateTimeFormate, displayInspectionDate, formateTime } from '../../../common';
import { JOB_APPICANT_STATUS } from '../../../../config/Config'
import { rating, ratingLabel } from '../../../templates/CommanMethod'
import SendEmailModal from './SendEmailToInspection'
import './inspection.less'

const { Title, Paragraph, Text } = Typography;
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
      inspectionDetail: ''
    };
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    this.props.enableLoading()
    this.getDetails()
  }

  /**
   * @method getDetails
   * @description get details 
   */
  getDetails = () => {
    const { isLoggedIn, loggedInUser } = this.props
    let classified_id = this.props.match.params.id
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInUser.id : ''
    }
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading()
      if (res.status === 200) {
        this.setState({ classifiedDetail: res.data.data, allData: res.data })
        this.getInspectionList(1)
      }
    })
  }

  /**
  * @method getInspectionList
  * @description get inspection list
  */
  getInspectionList = (page) => {
    let classified_id = this.props.match.params.id
    let reqData = {
      classified_id: classified_id,
      page: page,
      per_page: 10
    }
    // this.getData(reqData)
    this.props.getInspectionListAPI(reqData, res => {
      if (res.status === 200) {
        let item = res.data && res.data.data
        let inspectionList = item && Array.isArray(item.data) && item.data.length ? item.data : []
        let inspections_times = res.data && res.data.inspections_times && Array.isArray(res.data.inspections_times) && res.data.inspections_times.length ? res.data.inspections_times : []
        let date = inspections_times ? inspections_times[0].inspection_date_time : ''
        this.setState({ inspectionList: inspectionList, total_ads: item.total, inspections_times: inspections_times, defaultDate: date })
      }
    })
  }

  /**
  * @method getData
  * @description get inspection data
  */
  getData = (reqData) => {
    this.props.getInspectionListAPI(reqData, res => {
      if (res.status === 200) {
        let item = res.data && res.data.data
        let inspectionList = item && Array.isArray(item.data) && item.data.length ? item.data : []
        let inspections_times = res.data && res.data.inspections_times && Array.isArray(res.data.inspections_times) && res.data.inspections_times.length ? res.data.inspections_times : []
        this.setState({ inspectionList: inspectionList, total_ads: item.total, inspections_times: inspections_times })
      }
    })
  }


  /**
  * @method renderIcon
  * @description render icons
  */
  renderIcon = (data) => {
    const iconData = data.filter(el => el.key === 'Bedrooms' || el.key === 'Shower' || el.key === 'Parking' || el.key === 'Property Type')
    if (iconData && iconData.length !== 0) {
      return iconData && Array.isArray(iconData) && iconData.map((el, i) => {
        return (
          <li>
            {el.key === 'Bedrooms' && <img src={require('../../../../assets/images/icons/bedroom.svg')} alt='' />}
            {el.key === 'Bedrooms' && <Text>{el.value}</Text>}
            {el.key === 'Shower' && <img src={require('../../../../assets/images/icons/bathroom.svg')} alt='' />}
            {el.key === 'Shower' && <Text>{el.value}</Text>}
            {el.key === 'Parking' && <img src={require('../../../../assets/images/icons/carpark.svg')} alt='' />}
            {el.key === 'Parking' && <Text>{el.value}</Text>}
            {el.key === 'Property Type' && <img src={require('../../../../assets/images/icons/land-size.svg')} alt='' />}
            {el.key === 'Property Type' && <Text>{el.value}</Text>}
          </li>
        )
      })
    }
  }

  /**
 * @method handlePageChange
 * @description handle page change
 */
  handlePageChange = (e) => {
    this.getInspectionList(e)
  }

  /**
 * @method handleRecordChange
 * @description handle inspection date change
 */
  handleRecordChange = (item) => {
    this.setState({ defaultDate: item })

    let reqData = {
      classified_id: this.props.match.params.id,
      page: 1,
      per_page: 10,
      inspection_date_time: item
    }
    this.getData(reqData)
  }



  /**
  * @method deleteInspection
  * @description delete inspection by id
  */
  deleteInspection = (id) => {
    let reqData = {
      inspection_id: id
    }
    this.props.deleteInspectionAPI(reqData, res => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.INSPECTION_DELETE_SUCCESS)
        this.getInspectionList(1)
      }
    })
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { visible, inspectionDetail, defaultDate, inspections_times, inspectionList, total_ads, jobApplications, size, responsbility, classifiedDetail, allData, salary, salary_type, company_name, about_job, opportunity, apply, about_you } = this.state;
    let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
    let parameter = this.props.match.params
    let cat_id = parameter.categoryId;
    let classified_id = parameter.id
    let inspectionTime = allData && allData.inspections_times
    let imgLength = Array.isArray(classifiedDetail.classified_image) ? classifiedDetail.classified_image.length : 1
    let inspectionData = inspectionTime && Array.isArray(inspectionTime) && inspectionTime.length ? inspectionTime[0] : ''
    let date = inspectionData.inspection_date ? displayInspectionDate(new Date(inspectionData.inspection_date).toISOString()) : ''
    let time = inspectionData.inspection_date ? `${formateTime(inspectionData.inspection_start_time)} - ${formateTime(inspectionData.inspection_end_time)}` : ''

    const dateTime = (
      <ul className='c-dropdown-content'>
        {inspections_times && Array.isArray(inspections_times) && inspections_times.length && inspections_times.map((el, i) =>
          <li key={i} onClick={() => this.handleRecordChange(el.inspection_date_time)} style={{ cursor: 'pointer' }}>
            <Text>{el.inspection_date_time}</Text>
          </li>
        )}
      </ul>
    )
    let crStyle = (imgLength === 2 || imgLength === 1 || imgLength === 3) ? 'product-gallery-nav hide-clone-slide' : 'product-gallery-nav '
    let contactNumber = classifiedDetail.contact_mobile && classifiedDetail.contact_mobile
    let formatedNumber = contactNumber && contactNumber.replace(/\d(?=\d{4})/g, '*')
    const columns = [
      {
        title: 'No.',
        dataIndex: 'No',
        render: (cell, row, index) => {
          return index + 1
        }

      },
      {
        title: 'Name',
        dataIndex: 'classifiedid',
        render: (cell, row, index) => {
          return <div>{row.name ? `${row.name}` : ''} <span className="new-user">New</span> </div>

        }
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
                  <div className="switch inpect-switch">
                    <Switch
                      // disabled 
                      defaultChecked={row.looking_for_agent === 1 ? true : false}
                      onChange={(checked) => {
                        let requestData = {
                          inspection_id: row.id,
                          is_attended: checked ? 1 : 0
                        }
                        // if(row.looking_for_agent === 0){
                        this.props.markAsAttended(requestData, res => {
                          if (res.status === 200) {
                            toastr.success(langs.success, res.data && res.data.msg)
                            this.getInspectionList(1)
                          }
                        })
                        // }
                      }}
                    />
                  </div>
                </li>

              </ul>
            </div>
          )
        }
      },
      {
        title: '',
        key: 'job_id',
        dataIndex: 'job_id',
        render: (cell, row, index) => {
          return (
            <div className="inspection-details-sec">
              <ul className='info-list'>

                <li onClick={() => this.setState({ visible: true, inspectionDetail: row })} style={{ cursor: 'pointer' }}>
                  <img src={require('../../../dashboard-sidebar/icons/message.png')} alt='' width='20' />
                </li>
                <li>
                  <span>

                    <DeleteOutlined
                      onClick={(e) => {
                        toastr.confirm(
                          `${MESSAGES.CONFIRM_DELETE}`,
                          {
                            onOk: () => this.deleteInspection(row.id),
                            onCancel: () => { }
                          })
                      }}
                    />
                  </span>
                </li>
              </ul>
            </div>
          )
        }
      }


    ];

    return (
      <Layout>
        <Layout className="profile-vendor-retail-inspection-order">
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box employee-dashborad-box employee-myad-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section'>
                  <div className='left'>
                    {/* <Title level={2}>My Ad's</Title>*/}
                    <Title level={2}>Ad Management</Title>

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
                      <Col xs={24} md={8} lg={8} xl={10} className="employer-right-block ">
                        <div className="right-view-text">
                          {/* <span>145 Views</span><span className="sep">|</span><span>7 Ads</span> */}
                          &nbsp;
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="profile-content-box">
                  <Card
                    bordered={false}
                    className='add-content-box job-application'
                  >
                    <div className="application-detail inpection-detail">
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          {classifiedDetail && Array.isArray(classifiedDetail.classified_image) && classifiedDetail.classified_image.length !== 0 ?
                            <Row gutter={24} className="thumb-block">
                              {classifiedDetail.classified_image.slice(0, 1).map((el) => {
                                return (
                                  <Col className="thumb">
                                    <img
                                      src={el.full_name ? el.full_name : DEFAULT_IMAGE_CARD}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = DEFAULT_IMAGE_CARD
                                      }}
                                      alt={''}
                                    />
                                  </Col>
                                )
                              })}
                            </Row> : <Col className="thumb">
                              <div>
                                <img src={DEFAULT_IMAGE_CARD} alt='' />
                              </div>
                            </Col>}

                        </Col>
                        <Col span={13}>
                          <div className='product-detail-right'>
                            <Title level={2} className='price'>
                              {'AU$'}{salaryNumberFormate(classifiedDetail.price)}
                            </Title>

                            <div className='address mb-12'>
                              <Text>{classifiedDetail.location}&nbsp;&nbsp;</Text>
                            </div>
                            <ul className='info-list'>
                              {allData && allData.spicification && this.renderIcon(allData.spicification)}
                            </ul>
                            <div className='product-ratting mb-15'>
                              <Text>{rate ? rate : 'No reviews yet'}</Text>
                              {rate && <Rate disabled defaultValue={rate ? rate : 0} />}

                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={20}>
                          <ul className='ant-card-actions'>
                            <li>
                              <button>Category: <span>{classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname.name}</span></button>
                            </li>
                            <li>
                              <button>Last Posted: <span>{classifiedDetail && convertISOToUtcDateformate(classifiedDetail.created_at)}</span></button>
                            </li>
                            <li>
                              <button>Views: <span>{classifiedDetail.count}</span></button>
                            </li>
                            <li>
                              <button>Ad Id: <span>{classified_id}</span></button>
                            </li>
                          </ul>
                        </Col>
                        <Col md={4} className='align-right '>
                          <div className="status">
                            <label>Status:
                              <Button
                                type='primary' className="btn-active-green ml-10" >
                                {classifiedDetail.status === 0 ? 'Inactive' : 'Active'}
                              </Button>
                            </label> {company_name}</div>
                        </Col>
                      </Row>
                      <Row>
                        <Dropdown overlay={dateTime} className='c-dropdown mt-50'>
                          <Button>
                            <Icon icon='clock' size='19' className='mr-10' />
                            <Text className='strong mr-10'>Inspection</Text> <Text>{defaultDate}</Text>
                            <Icon icon='arrow-down' size='16' className='ml-12' />
                          </Button>
                        </Dropdown>
                        {/* <Icon icon='clock' size='19' className='mr-10' />
                        <Select defaultValue={`${date} ${time}`} onChange={(e) => {this.handleRecordChange(e)}}>
                             {inspections_times &&
                                inspections_times.map((el, i) => {
                                  return (
                                    <Option key={i} value={el.inspection_date_time}>{el.inspection_date_time}</Option>
                                  )
                                })}
                          </Select> */}
                      </Row>
                    </div>

                    <Row className="grid-block">
                      <Col md={12}><h2>Inspection Bookings <span>{`You have (${inspectionList.length}) inspection`}</span></h2></Col>
                      <Col md={12} >
                        <div className="card-header-select"><label>Show:</label>
                          <Select style={{ color: '#EE4928' }} defaultValue="All">
                            <Option value="All Candidates">All Candidates</Option>
                            <Option value="All Candidates">All Candidates</Option>
                          </Select></div>
                      </Col>
                      <Col md={24} >
                        <Table dataSource={inspectionList} columns={columns} className="inspectiondetail-table" />
                        {total_ads > 12 && <Pagination
                          defaultCurrent={1}
                          defaultPageSize={12} //default size of page
                          onChange={this.handlePageChange}
                          total={total_ads} //total number of card data available
                          itemRender={itemRender}
                          className={'mb-20'}
                        />}
                      </Col>
                    </Row>
                  </Card >
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
        {visible &&
          <SendEmailModal
            visible={visible}
            onCancel={() => this.setState({ visible: false })}
            inspectionDetail={inspectionDetail}
          />}
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
  { sendEmailToBookInspection, markAsAttended, deleteInspectionAPI, getInspectionListAPI, getClassfiedCategoryDetail, changeApplicationStatus, getCandidatesList, enableLoading, disableLoading }
)(ApplicationDetail)
