import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../../config/localization';
import { Layout, Menu, Dropdown, Card, Typography, Popover, Table, Button, Select, Input, Rate, Col, Row } from 'antd';
import AppSidebar from '../../../../../components/dashboard-sidebar/DashboardSidebar';
import { DownOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import history from '../../../../../common/History';
import PostAdPermission from '../../../../templates/PostAdPermission'
import { getClassfiedCategoryDetail, getResumeDetail, changeApplicationStatus, getCandidatesList, disableLoading, enableLoading } from '../../../../../actions'
import { convertISOToUtcDateformate, displayDateTimeFormate, salaryNumberFormate } from '../../../../common';
import { JOB_APPICANT_STATUS } from '../../../../../config/Config'
import { rating, ratingLabel } from '../../../../templates/CommanMethod'
import { BACKEND_URL } from '../../../../../config/Config'
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
      opportunity: ''
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
        this.props.getCandidatesList({ job_id: res.data.data.id }, (res2) => {
          
          if (res2.status === 1) {
            this.setState({ jobApplications: res2.jobApplicants, classifiedDetail: res.data.data })
          } else {
            this.setState({ classifiedDetail: res.data.data })

          }
        })
        // this.setState({ classifiedDetail: res.data.data, allData: res.data }, () => {
        //     this.renderSpecification(this.state.allData.spicification)
        // })

      }
    })
  }


  /**
  * @method change classified status
  * @description change classified status  
  */
  changeStatus = (status, id) => {
    let reqdata = {
      applicationId: id,
      status: status
    }
    this.props.changeApplicationStatus(reqdata, (res) => {
      
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
  * @method getResume
  * @description get resume 
  */
  // getResume = (row) => {
  //   
  //   this.props.getResumeDetail({ applicant_id: row.job_id }, (res) => {
  //     
  //     this.setState({ downloadedFile: res.job_detail.resume_file })
  //   })
  // }

  /**
   * @method render
   * @description render component  
   */
  render() {
    // const { jobApplications, visible, size, responsbility, classifiedDetail, allData, salary, salary_type, company_name, about_job, opportunity, apply, about_you } = this.state;
    // let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
    const { jobApplications, size, responsbility, classifiedDetail, allData, salary, salary_type, company_name, about_job, opportunity, apply, about_you } = this.state;
    let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
    let parameter = this.props.match.params
    let cat_id = parameter.categoryId;
    let classified_id = parameter.id
    let formateSalary = salary && salary !== '' && salary.split(';')
    let range1 = formateSalary && formateSalary[0]
    let range2 = formateSalary && formateSalary[1]
    let totalSalary = range1 && range2 ? `$${range1} - $${range2} ${salary_type}` : range1 && `$${range1} ${salary_type}`
    const columns = [
      {
        title: 'No.',
        dataIndex: 'No',
        // key: 'posted_date',
        render: (cell, row, index) => {
          return index + 1
        }

      },
      {
        title: 'Name',
        dataIndex: 'classifiedid',
        // key: 'classifiedid',
        render: (cell, row, index) => {
          return <div>{`${row.fname} ${row.lname}`} <span className="new-user">New</span> </div>

        }
      },
      {
        title: 'Title',
        dataIndex: 'job_name',
        key: 'job_name',
      },
      {
        title: 'Date',
        dataIndex: 'created_at',
        // key: 'created_at',
        render: (cell, row, index) => {
          return displayDateTimeFormate(row.created_at)
        }
      },
      {
        title: 'Status',
        key: 'job_id',
        dataIndex: 'job_id',
        render: (cell, row, index) => {
          
          let allStatus = [JOB_APPICANT_STATUS.APPLICANT, JOB_APPICANT_STATUS.REJECT, JOB_APPICANT_STATUS.SPAM, JOB_APPICANT_STATUS.SHORTLIST]
          const menu = (
            <Menu onClick={(e) => {
              this.changeStatus(e.key, cell)
            }}>
              {(JOB_APPICANT_STATUS.APPLICANT !== row.application_status || row.application_status !== '') && <Menu.Item key={JOB_APPICANT_STATUS.APPLICANT}>Applicant</Menu.Item>}
              {JOB_APPICANT_STATUS.REJECT !== row.application_status && <Menu.Item key={JOB_APPICANT_STATUS.REJECT}>Rejected</Menu.Item>}
              {JOB_APPICANT_STATUS.SPAM !== row.application_status && <Menu.Item key={JOB_APPICANT_STATUS.SPAM}>Spam</Menu.Item>}
              {JOB_APPICANT_STATUS.SHORTLIST !== row.application_status && <Menu.Item key={JOB_APPICANT_STATUS.SHORTLIST}>Shortlisted</Menu.Item>}
              {JOB_APPICANT_STATUS.INTERVIEW !== row.application_status && <Menu.Item key={JOB_APPICANT_STATUS.INTERVIEW}>Interview</Menu.Item>}

            </Menu>
          );
          return (
            <div>
              <Row>
                <Col span={18}>
                  <Dropdown overlay={menu} placement='bottomLeft'>
                    <Button type='primary' size={size} className="btn-active-inactive ">
                      {row.application_status ? row.application_status : JOB_APPICANT_STATUS.APPLICANT}
                    </Button>
                  </Dropdown>
                </Col>
              </Row>
            </div>
          )
        }
      },
      {
        title: 'Resume',
        key: 'classifiedid',
        dataIndex: 'classifiedid',
        render: (cell, row, index) => {
          if (row.formee_resume_id) {
            let dowmloadableURL = `${BACKEND_URL}/generate-formee-resume/${row.formee_resume_id}`
            
            return <a href={dowmloadableURL} download>view</a>

            //  <Text>Applied with Formee Resume</Text>
          } else if (row.resume_file) {
            return <a href={row.resume_file} download="Resume">view</a>
          } else {
            return ''
          }
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
                    <Title level={2}>Job Application</Title>
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
                        <Col md={20}>
                          <Title level={2} className='title'>{classifiedDetail.title}</Title>
                          {company_name && company_name !== 'N/A' &&
                            <div className='company-name'>
                              {company_name}
                            </div>
                          }
                          {classifiedDetail && classifiedDetail.location !== 'N/A' &&
                            <div className='location-name'>
                              {classifiedDetail.location}
                            </div>
                          }
                          <div className='price-box'>
                            <div className='price'>{totalSalary ? `$${salaryNumberFormate(totalSalary)}` : ''} </div>
                          </div>
                          {classifiedDetail && classifiedDetail.description &&
                            <div className='description'>
                              {classifiedDetail.description}
                            </div>
                          }

                        </Col>
                        <Col md={4} className='align-right'>
                          <div className="days">{classifiedDetail && displayDateTimeFormate(classifiedDetail.created_at)}</div>

                          <div className='rate-section'>
                            <span className="rating-text"></span>
                            {rate ? rate : 'No reviews yet'}
                            {rate && <Rate disabled defaultValue={rate && rate ? rate : ''} />}
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
                            <Button
                              className="btn-active-inactive btn-active"
                              // onClick={(e) => this.changeStatus(0, cell)}
                              type='primary' size={size}>
                              {/* {applica} */}
                              {classifiedDetail.status === 0 ? 'Inactive' : 'Active'}
                            </Button>
                            {/* </Dropdown> */}
                            {company_name}</div>
                        </Col>
                      </Row>
                    </div>
                    <Row className="grid-block">
                      <Col md={12}><h2>Candidates <span>(You have {jobApplications.length} candidates)</span></h2></Col>
                      {/* <Col md={12} >
                        <div className="card-header-select"><label>Show:</label>
                          <Select defaultValue="All">
                            <Option value="All Candidates">All Candidates</Option>
                            <Option value="All Candidates">All Candidates</Option>
                          </Select></div>
                      </Col> */}
                      <Col md={24} >
                        <Table dataSource={jobApplications} columns={columns} />
                      </Col>
                    </Row>
                  </Card >
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    )
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
  { getClassfiedCategoryDetail, getResumeDetail, changeApplicationStatus, getCandidatesList, enableLoading, disableLoading }
)(ApplicationDetail)
