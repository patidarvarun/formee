import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { Layout, Menu, Dropdown, Card, Typography, Popover, Table, Button, Select, Input, Rate, Col, Row } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import { DownOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import history from '../../../../common/History';
import PostAdPermission from '../../../templates/PostAdPermission'
import { getClassfiedCategoryDetail, changeGeneralOfferStatus, getOfferDetailList, disableLoading, enableLoading, changeGeneralClassifiedStatus } from '../../../../actions'
import { salaryNumberFormate, convertISOToUtcDateformate, displayDateTimeFormate } from '../../../common';
import { GENERAL_APPICANT_STATUS } from '../../../../config/Config'
import { rating } from '../../../templates/CommanMethod'
import SendEmailModal from '../real-state/SendEmailToInspection'
import './general.less'

const { Title, Paragraph, Text } = Typography;
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
      visible: false,
      offerDetail: '',
      total: ''
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
        //45 
        this.props.getOfferDetailList({ classified_id: res.data.data.id }, (res2) => {

          if (res2.status === 1) {
            this.setState({ jobApplications: res2.data.data, classifiedDetail: res.data.data, total: res2.data.total })
          } else {
            this.setState({ classifiedDetail: res.data.data })
          }
        })
      }
    })
  }


  /**
  * @method change classified status
  * @description change classified status  
  */
  changeStatus = (status, id) => {
    let reqdata = {
      offer_id: id,
      status: status
    }
    this.props.enableLoading()
    this.props.changeGeneralOfferStatus(reqdata, (res) => {

      this.props.disableLoading()
      this.getDetails()
      toastr.success(langs.success, langs.messages.change_status)
    })
  }

  changeClassifiedStatus = (classifiedId, id) => {
    const { isLoggedIn, loggedInUser } = this.props
    let reqdata = {
      classified_id: classifiedId,
      user_id: isLoggedIn ? loggedInUser.id : ''
      // status: 'sold'
    }
    this.props.enableLoading()
    this.props.changeGeneralClassifiedStatus(reqdata, (res) => {

      this.props.disableLoading()
      this.getDetails()
      toastr.success(langs.success, langs.messages.change_status)
    })
  }


  /**
  * @method renderSpecification
  * @description render specification
  */
  renderSpecification = (data) => {
    let temp1 = '', temp2 = '', temp3 = '', temp4 = '', temp5 = '', temp6 = '', temp7 = '', temp8 = ''
    data && data.map((el, i) => {
      if (el.key === 'Salary Range') {
        temp1 = el.value
      } else if (el.key === 'Salary Type') {
        temp2 = el.value
      } else if (el.key === 'Company Name') {
        temp3 = el.value
      } else if (el.key === 'Job Type') {
        temp4 = el.value
      } else if (el.key === 'Opportunity') {
        temp5 = el.value
      } else if (el.key === 'How do I apply?') {
        temp6 = el.value
      } else if (el.key === 'About you') {
        temp7 = el.value
      } else if (el.key === 'Key Responsibilities') {
        temp8 = el.value
      }
    })
    this.setState({
      salary: temp1 ? temp1 : '',
      salary_type: temp2 ? temp2 : '',
      company_name: temp3 ? temp3 : '',
      about_job: temp4 ? temp4 : '',
      opportunity: temp5 ? temp5 : '',
      apply: temp6 ? temp6 : '',
      about_you: temp7 ? temp7 : '',
      responsbility: temp8 ? temp8 : ''
    })
  }


  /**
   * @method render
   * @description render component  
   */
  render() {
    // const { jobApplications, visible, size, responsbility, classifiedDetail, allData, salary, salary_type, company_name, about_job, opportunity, apply, about_you } = this.state;
    // let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
    const { total, offerDetail, visible, jobApplications, size, responsbility, classifiedDetail, allData, salary, salary_type, company_name, about_job, opportunity, apply, about_you } = this.state;
    let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
    let parameter = this.props.match.params
    let cat_id = parameter.categoryId;
    let classified_id = parameter.id
    let formateSalary = salary && salary !== '' && salary.split(';')
    let range1 = formateSalary && formateSalary[0]
    let range2 = formateSalary && formateSalary[1]
    let totalSalary = range1 !== undefined && range2 !== undefined ? `$${range1} - $${range2} ${salary_type}` : `$${range1} ${salary_type}`
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

          return <div>{`${row.sender.fname} ${row.sender.lname}`} <span className="new-user">New</span> </div>

        }
      },

      {
        title: 'Date',
        dataIndex: 'created_at',
        // key: 'created_at',
        render: (cell, row, index) => {
          return displayDateTimeFormate(row.created_at)
        }
      }, //
      {
        title: 'Offer',
        dataIndex: 'offer_price',
        render: (cell, row, index) => {
          return `AU$${salaryNumberFormate(row.offer_price)}`
        }
      },
      {
        title: 'Status',
        key: 'classifiedid',
        dataIndex: 'classifiedid',
        render: (cell, row, index) => {
          return <div className="view new-offer" style={{ cursor: "pointer", marginLeft: "3px" }}>{row.offer_status}</div>
        }
      },
      {
        title: 'Action',
        key: 'job_id',
        render: (cell, row, index) => {
          const menu = (
            <Menu onClick={(e) => {
              this.changeStatus(e.key, cell.id)
            }}>
              {GENERAL_APPICANT_STATUS.ACCEPT !== row.status && <Menu.Item key={GENERAL_APPICANT_STATUS.ACCEPT}>Accept Offer</Menu.Item>}
              {GENERAL_APPICANT_STATUS.REJECT !== row.status && <Menu.Item key={GENERAL_APPICANT_STATUS.REJECT}>Reject Offer</Menu.Item>}

            </Menu>
          );
          return (
            <div>
              <Row>
                <Col span={18}>
                  <Dropdown overlay={menu} placement='bottomLeft'>
                    <Button type='primary' size={size} className="btn-active-inactive btn-active">
                      {row.status ? row.status : 'Pending'}
                    </Button>
                  </Dropdown>
                </Col>

              </Row>
            </div>
          )
        }
      },
      {
        title: '',
        key: 'job_id',
        render: (cell, row, index) => {
          const menu = (
            <Menu onClick={(e) => {
              this.changeStatus(e.key, cell.id)
            }}>
              {GENERAL_APPICANT_STATUS.ACCEPT !== row.status && <Menu.Item key={GENERAL_APPICANT_STATUS.ACCEPT}>Accept Offer</Menu.Item>}
              {GENERAL_APPICANT_STATUS.REJECT !== row.status && <Menu.Item key={GENERAL_APPICANT_STATUS.REJECT}>Reject Offer</Menu.Item>}

            </Menu>
          );
          return (

            <Row >

              <Col span={8}>
                <img
                  src={require('../../../dashboard-sidebar/icons/message.png')}
                  alt='' width='18'
                  onClick={() => this.setState({ visible: true, offerDetail: row })}
                />
              </Col>
              {/* <Col span={8} offset={8} >
                  <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' width='20' className="pl-5" onClick={() => this.deleteClassified(cell)} />
                </Col> */}
            </Row>

          )
        }
      }

    ];

    const menu = (
      <Menu onClick={(e) => {
        this.changeClassifiedStatus(classifiedDetail.id, e.key)
      }}>
        {classifiedDetail.is_sold === 0 &&
          <Menu.Item key={GENERAL_APPICANT_STATUS.ACCEPT}>Sold</Menu.Item>
        }
        {/* {GENERAL_APPICANT_STATUS.REJECT !== row.status &&  */}
        {/* <Menu.Item key={GENERAL_APPICANT_STATUS.REJECT}>Active</Menu.Item> */}
        {/* } */}

      </Menu>
    );
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box employee-dashborad-box employee-myad-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>Offer Detail</Title>
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
                            placeholder="Search Dashboard"
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
                    <div className="application-detail">
                      <Row >
                        <img style={{ height: 100, width: 100 }} src={classifiedDetail && Array.isArray(classifiedDetail.classified_image) && classifiedDetail.classified_image.length ? classifiedDetail.classified_image[0].full_name : ''} />

                        <Col md={20} className="ml-10">
                          <Title level={2} className='title'>AU${salaryNumberFormate(classifiedDetail.price)}</Title>
                          {classifiedDetail && classifiedDetail.title &&
                            <div className='company-name'>
                              {classifiedDetail.title}
                            </div>
                          }
                          <Row gutter={10} align="middle" className="mt-10">
                            <Col>
                              {classifiedDetail.subcategoriesname &&
                                <div className='category-name blue-link'>
                                  {classifiedDetail.subcategoriesname.name}
                                </div>
                              }</Col>
                            <Col>
                              <span class="sep">|</span>
                              {classifiedDetail.condition && <div className='job-name blue-link'>
                                {classifiedDetail.condition}
                              </div>}</Col>
                            <Col>
                              <div className="days">{classifiedDetail && displayDateTimeFormate(classifiedDetail.created_at)}</div>
                            </Col></Row>
                          <div className='rate-section'>
                            {rate ? rate : 'No reviews yet'}
                            {rate !== undefined && <Rate disabled defaultValue={rate} />}
                          </div>

                        </Col>
                      </Row>
                      <Row>
                        <Col md={20}>
                          <ul className='ant-card-actions'>
                            <li>
                              <button>Category : <span>{classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname.name}</span></button>
                            </li>
                            <li>
                              <button>Last Posted : <span>{classifiedDetail && convertISOToUtcDateformate(classifiedDetail.created_at)}</span></button>
                            </li>
                            <li>
                              <button>Views : <span>{classifiedDetail.count}</span></button>
                            </li>
                            <li>
                              <button>Ad ID : <span>{classified_id}</span></button>
                            </li>
                          </ul>
                        </Col>
                        <Col md={4} className='align-right '>
                          <div className="status">
                            <label>Status</label>
                            {/* <Dropdown overlay={menu} placement='bottomLeft' arrow> */}
                            {/* <Button
                              className="btn-active-inactive btn-active"
                              // onClick={(e) => this.changeStatus(0, cell)}
                              type='primary' size={size}>
                              {classifiedDetail.status === 0 ? 'Inactive' : 'Active'}
                            </Button> */}
                            {/* </Dropdown> */}
                            <Dropdown overlay={menu} placement='bottomLeft'>
                              <Button type='primary' size={size} className="btn-active-inactive btn-active">
                                {classifiedDetail.is_sold === 1 ? 'Sold' : 'Active'}
                              </Button>
                            </Dropdown>
                            {company_name}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <Row className="grid-block">
                      <Col md={12}><h2>Recieved Offers <span>{`(You have ${total} candidates)`}</span></h2></Col>
                      {/* <Col md={12} >
                        <div className="card-header-select"><label>Show:</label>
                          <Select defaultValue="All" className="red-color">
                            <Option value="All Candidates">All Candidates</Option>
                            <Option value="All Candidates">All Candidates</Option>
                          </Select></div>
                      </Col> */}
                      <Col md={24} >
                        <Table dataSource={jobApplications} columns={columns} className="offerdetail-myjob" />
                      </Col>
                    </Row>
                  </Card >
                </div>
              </div>
            </div>
          </Layout>
          {visible &&
            <SendEmailModal
              visible={visible}
              onCancel={() => this.setState({ visible: false })}
              inspectionDetail={offerDetail}
            />}
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
  { getClassfiedCategoryDetail, changeGeneralOfferStatus, getOfferDetailList, enableLoading, disableLoading, changeGeneralClassifiedStatus }
)(ApplicationDetail)
