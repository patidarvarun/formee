import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import {
  Layout,
  Menu,
  Dropdown,
  Card,
  Typography,
  Table,
  Button,
  Select,
  Rate,
  Col,
  Row,
  Modal,
  Switch,
} from 'antd';
import AppSidebar from '../../../../components/dashboard-sidebar/DashboardSidebar';
import { pdfjs } from 'react-pdf';
import { LeftOutlined } from '@ant-design/icons';
import history from '../../../../common/History';
import {
  getClassfiedCategoryDetail,
  getResumeDetail,
  changeApplicationStatus,
  getCandidatesList,
  disableLoading,
  enableLoading,
  getJobApplicantDetails,
  changeGeneralClassifiedStatus,
} from '../../../../actions';
import {
  convertISOToUtcDateformate,
  displayDateTimeFormate,
  salaryNumberFormate,
  convertHTMLToText,
} from '../../../common';
import { JOB_APPICANT_STATUS } from '../../../../config/Config';
import { rating } from '../../../classified-templates/CommanMethod';
import { BACKEND_URL } from '../../../../config/Config';

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
      applicantQuestionsAndAnswers: [],
      resumeDetails: null,
      isModalOpen: false,
      modalLink: '',
      viewResume: false,
      checkboxQuestions: [],
      pageSize: 5,
      filter: 'recent',
    };
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    this.props.enableLoading();
    this.getDetails('recent');
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
        this.renderSpecification(res.data && res.data.spicification);
        const reqData = {
          job_id: res.data.data.id,
          filter: filter,
        };
        this.props.getCandidatesList(reqData, (res2) => {
          if (res2.status === 1) {
            this.setState({
              jobApplications: res2.jobApplicants,
              classifiedDetail: res.data.data,
              filter: filter,
              allData: res.data,
            });
          } else {
            this.setState({
              classifiedDetail: res.data.data,
              allData: res.data,
            });
          }
        });
      }
    });
  };

  /**
   * @method handleQuestionPopup
   * @description handle question model
   */
  handleQuestionPopup = (applicantId) => {
    this.props.enableLoading();
    this.props.getJobApplicantDetails({ applicant_id: applicantId }, (res) => {
      if (res.data) {
        let jobApplyAnswer = res.data.job_detail.jobapply_answer;
        const checkboxes = jobApplyAnswer.filter((question) => {
          return question.jobapply_answer_question.ans_type === 'checkbox';
        });
        let output = [];
        checkboxes.forEach(function (item, index) {
          var existing = output.filter(function (v, i) {
            return v.question_id == item.question_id;
          });
          if (existing.length) {
            jobApplyAnswer = jobApplyAnswer.filter((question) => {
              return question.id !== item.id;
            });
            var existingIndex = output.indexOf(existing[0]);
            output[existingIndex].answers = output[
              existingIndex
            ].answers.concat(item.answer);
          } else {
            if (typeof item.answer == 'string') item.answers = [item.answer];
            output.push(item);
          }
        });
        this.setState(
          {
            applicantQuestionsAndAnswers: jobApplyAnswer,
            checkboxQuestions: output,
          },
          () => this.props.disableLoading()
        );
      } else {
        this.props.disableLoading();
      }
    });
  };

  /**
   * @method handleResumePopup
   * @description handle resume model
   */
  handleResumePopup = (jobId) => {
    if (this.state.jobApplications.length > 0) {
      const resume = this.state.jobApplications.find((jobApplication) => {
        return jobApplication.job_id === jobId;
      });
      this.setState({
        modalLink: `${BACKEND_URL}/generate-formee-resume/${resume.formee_resume_id}`,
        isModalOpen: true,
      });
    }
  };

  /**
   * @method change classified status
   * @description change classified status
   */
  changeStatus = (status, id) => {
    const { filter } = this.state;
    let reqdata = {
      applicationId: id,
      status: status,
    };
    this.props.changeApplicationStatus(reqdata, (res) => {
      this.getDetails(filter);
      toastr.success(langs.success, langs.messages.change_status);
    });
  };

  /**
   * @method change classified status
   * @description change classified status
   */
  changeADStatus = (state, id) => {
    const { filter } = this.state;
    let reqdata = {
      id,
      state,
    };
      this.props.changeGeneralClassifiedStatus(reqdata, (res) => {
      this.getDetails(filter);
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
        } else if (el.slug === 'salary_type') {
          temp2 = el.value;
        } else if (el.slug === 'company_name') {
          temp3 = el.value;
        } else if (el.slug === 'job_type') {
          temp4 = el.value;
        } else if (
          el.key === 'Opportunity' ||
          el.key === 'About the job role' ||
          el.key === 'The benefit you will get'
        ) {
          temp5 = el.value;
        } else if (el.slug === 'How_to_apply') {
          temp6 = el.value;
        } else if (el.slug === 'about_you:') {
          temp7 = el.value;
        } else if (el.slug === 'key_responsibilities:') {
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

  onDocumentLoadSuccess = ({ numPages }) => {};
  onDocumentLoadError = (error) => {};

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      jobApplications,
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
      range1 && range2
        ? `$${range1} - $${range2} ${salary_type}`
        : range1 && `$${range1} ${salary_type}`;
    let temp =
      allData &&
      allData.spicification &&
      Array.isArray(allData.spicification) &&
      allData.spicification.length
        ? allData.spicification
        : [];
    let salary1 =
      temp.length && temp.filter((el) => el.key === 'Minimum Salary');
    let salary_min = salary1 && salary1.length ? salary1[0].value : '';
    let salary2 =
      temp.length && temp.filter((el) => el.key === 'Maximum Salary');
    let salary_max = salary2 && salary2.length ? salary2[0].value : '';
    let salary_range =
      salary_min &&
      salary_max &&
      `AU$${salaryNumberFormate(salary_min)} - AU$${salaryNumberFormate(
        salary_max
      )}`;
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
        align: 'left',
        render: (cell, row, index) => {
          return (
            <div className='text-left td-modal-action'>
              <span className='new-user'>{`${row.fname} ${row.lname}`} </span>
              <Link to='#'> NEW </Link>
              <Row className=''>
                <Button
                  onClick={() => {
                    if (row.resume === 0) {
                      this.handleResumePopup(row.job_id);
                    } else {
                      this.setState({
                        modalLink: `${row.resume_file}`,
                        isModalOpen: true,
                      });
                    }
                  }}
                  className='text-black pl-0'
                >
                  <img
                    src={require('../../../../assets/images/icons/resume.svg')}
                    alt='resume'
                    className=''
                  />
                  <Text>Resume</Text>
                </Button>
                {row.cover_letter === 1 && (
                  <Button className='text-black pt-0'>
                    <Button
                      onClick={() => {
                        this.setState({
                          isModalOpen: true,
                          modalLink: row.cover_letter_file,
                        });
                      }}
                      className='pt-6'
                    >
                      <img
                        src={require('../../../../assets/images/icons/cover-letter.png')}
                        alt='Cover-Letter'
                      />
                      <Text>Cover Letter</Text>
                    </Button>
                  </Button>
                )}

                <Button
                  className='text-black'
                  onClick={() => {
                    this.handleQuestionPopup(row.job_id);
                  }}
                >
                  <img
                    src={require('../../../../assets/images/icons/quetion.svg')}
                    alt='View Questions'
                  />
                  <Text>View Questions</Text>
                </Button>
              </Row>
            </div>
          );
        },
      },
      {
        title: 'Title',
        dataIndex: 'job_name',
        key: 'job_name',
      },
      {
        title: 'Date Applied',
        dataIndex: 'created_at',
        render: (cell, row, index) => {
          return displayDateTimeFormate(row.created_at);
        },
      },
      {
        title: 'Action',
        key: 'job_id',
        className: 'text-center',
        dataIndex: 'job_id',
        render: (cell, row, index) => {
          let allStatus = [
            JOB_APPICANT_STATUS.APPLICANT,
            JOB_APPICANT_STATUS.REJECT,
            JOB_APPICANT_STATUS.SPAM,
            JOB_APPICANT_STATUS.SHORTLIST,
          ];
          const menu = (
            <Menu
              onClick={(e) => {
                this.changeStatus(e.key, cell);
              }}
            >
              {(JOB_APPICANT_STATUS.APPLICANT !== row.application_status ||
                row.application_status !== '') && (
                <Menu.Item key={JOB_APPICANT_STATUS.APPLICANT}>
                  Applicant
                </Menu.Item>
              )}
              {JOB_APPICANT_STATUS.REJECT !== row.application_status && (
                <Menu.Item key={JOB_APPICANT_STATUS.REJECT}>
                  Un Processed
                </Menu.Item>
              )}
              {JOB_APPICANT_STATUS.SPAM !== row.application_status && (
                <Menu.Item key={JOB_APPICANT_STATUS.SPAM}>
                  Not Suitable
                </Menu.Item>
              )}
              {JOB_APPICANT_STATUS.SHORTLIST !== row.application_status && (
                <Menu.Item key={JOB_APPICANT_STATUS.SHORTLIST}>
                  Shortlisted
                </Menu.Item>
              )}
              {JOB_APPICANT_STATUS.INTERVIEW !== row.application_status && (
                <Menu.Item key={JOB_APPICANT_STATUS.INTERVIEW}>
                  Interview
                </Menu.Item>
              )}
            </Menu>
          );
          return (
            <div>
              <Row>
                <Col span={24}>
                  <Dropdown
                    overlay={menu}
                    placement='bottomCenter'
                    className='td-active-action'
                  >
                    {row.application_status ===
                    JOB_APPICANT_STATUS.INTERVIEW ? (
                      <Button
                        default
                        type='primary'
                        className='btn-status btn-green'
                      >
                        {JOB_APPICANT_STATUS.INTERVIEW}{' '}
                        <span class='ant-select-arrow'>&nbsp;</span>
                      </Button>
                    ) : row.application_status ===
                      JOB_APPICANT_STATUS.REJECT ? (
                      <Button
                        default
                        type='primary'
                        className=' btn-status btn-grey '
                      >
                        {'Un Processed'}{' '}
                        <span class='ant-select-arrow'>&nbsp;</span>
                      </Button>
                    ) : row.application_status === JOB_APPICANT_STATUS.SPAM ? (
                      <Button type='primary' className=' btn-status btn-grey'>
                        {'Not Suitable'}{' '}
                        <span class='ant-select-arrow'>&nbsp;</span>
                      </Button>
                    ) : row.application_status ===
                      JOB_APPICANT_STATUS.SHORTLIST ? (
                      <Button
                        default
                        type='primary'
                        className='btn-status btn-yellow'
                      >
                        {JOB_APPICANT_STATUS.SHORTLIST}{' '}
                        <span class='ant-select-arrow'>&nbsp;</span>
                      </Button>
                    ) : (
                      <Button
                        default
                        type='primary'
                        className='btn-status btn-green'
                      >
                        {'Applicant'}{' '}
                        <span class='ant-select-arrow'>&nbsp;</span>
                      </Button>
                    )}
                  </Dropdown>
                </Col>
              </Row>
            </div>
          );
        },
      },
    ];

    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box employee-dashborad-box employee-myad-box employee-myad-box-v2'>
              <div className='card-container signup-tab'>
                <div
                  className='back'
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
                    <div className='application-detail'>
                      <Row>
                        <Col md={18}>
                          <Title level={2} className='title'>
                            {classifiedDetail.title}
                          </Title>
                          <div className='total-salary-box'>
                            <Title level={3}>
                              {salary_range
                                ? salary_range
                                : totalSalary
                                ? `AU$${salaryNumberFormate(totalSalary)}`
                                : ''}
                              &nbsp;{salary_type && salary_type}
                            </Title>
                          </div>
                          {company_name && (
                            <div className='company-name'>{company_name}</div>
                          )}
                          {classifiedDetail && (
                            <div className='location-name'>
                              {classifiedDetail.location}
                            </div>
                          )}
                          {classifiedDetail && classifiedDetail.description && (
                            <div className='description'>
                              {convertHTMLToText(classifiedDetail.description)}
                            </div>
                          )}
                        </Col>
                        <Col md={6} className='align-right'>
                          <div className='days'>
                            {classifiedDetail &&
                              displayDateTimeFormate(
                                classifiedDetail.created_at
                              )}
                          </div>

                          <div className='rate-section'>
                            <span className='rating-text'></span>
                            {rate ? rate : 'No reviews yet'}
                            {rate && (
                              <Rate
                                disabled
                                defaultValue={rate && rate ? rate : ''}
                              />
                            )}
                          </div>
                          <div className='mt-10 compamy-logo-img'>
                            {classifiedDetail &&
                            classifiedDetail.company_logo ? (
                              <img
                                src={
                                  classifiedDetail &&
                                  classifiedDetail.company_logo
                                }
                                alt='brand-logo'
                              />
                            ) : (
                              company_name
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={20}>
                          <ul className='ant-card-actions'>
                            <li>
                              <button>
                                Category :{' '}
                                <span>
                                  {classifiedDetail.subcategoriesname &&
                                    classifiedDetail.subcategoriesname.name}
                                </span>
                              </button>
                            </li>
                            <li>
                              <button>
                                Last Posted :{' '}
                                <span>
                                  {classifiedDetail &&
                                    convertISOToUtcDateformate(
                                      classifiedDetail.created_at
                                    )}
                                </span>
                              </button>
                            </li>
                            <li>
                              <button>
                                Views : <span>{classifiedDetail.count}</span>
                              </button>
                            </li>
                            <li>
                              <button>
                                Ad ID : <span>{classified_id}</span>
                              </button>
                            </li>
                          </ul>
                        </Col>
                        <Col md={4} className='align-right '>
                          <div className='status'>
                            <label>Status</label>
                            {classifiedDetail && (
                              <div className='job-status'>
                                <Switch
                                  checked={
                                    classifiedDetail.status === 1 ? true : false
                                  }
                                  onChange={(e) =>
                                    this.changeADStatus(
                                      !classifiedDetail.status ? 1 : '2',
                                      classified_id
                                    )
                                  }
                                />
                                <Text className='ml-5'>
                                  {classifiedDetail.status === 1
                                    ? 'Active'
                                    : 'Inctive'}
                                </Text>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <Row className='grid-block'>
                      <Col md={12}>
                        <h2>
                          Candidates{' '}
                          <span>
                            (You have {jobApplications.length} Applies)
                          </span>
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
                            <Option value='recent'>Most recent</Option>
                            <Option value='old'>Old</Option>
                            <Option value='a'>A to Z</Option>
                            <Option value='z'>Z to A</Option>
                          </Select>
                        </div>
                      </Col>
                      <Col md={24}>
                        <Table
                          dataSource={jobApplications.slice(
                            0,
                            this.state.pageSize
                          )}
                          columns={columns}
                          pagination={false}
                        />
                      </Col>
                      {this.state.jobApplications.length > 0 && (
                        <Row style={{ minWidth: '100%' }}>
                          <Col md={24}>
                            {this.state.jobApplications.length > 0 &&
                            this.state.pageSize <
                              this.state.jobApplications.length ? (
                              <Button
                                onClick={() => {
                                  this.setState({
                                    pageSize: this.state.pageSize + 5,
                                  });
                                }}
                                className='showmore-data'
                              >
                                Show more
                              </Button>
                            ) : (
                              this.state.jobApplications.length > 5 &&
                              this.state.pageSize !==
                                this.state.jobApplications.length && (
                                <Button
                                  onClick={() => {
                                    this.setState({
                                      pageSize: 5,
                                    });
                                  }}
                                  className='showmore-data'
                                >
                                  show less
                                </Button>
                              )
                            )}
                          </Col>
                        </Row>
                      )}
                    </Row>
                    <Modal
                      visible={
                        this.state.applicantQuestionsAndAnswers.length > 0
                      }
                      onCancel={() =>
                        this.setState({ applicantQuestionsAndAnswers: [] })
                      }
                      footer={null}
                      className='questionAnsModalBox'
                    >
                      {this.state.applicantQuestionsAndAnswers.map(
                        (question, index) => {
                          if (
                            question.jobapply_answer_question.ans_type ===
                            'checkbox'
                          ) {
                            const checkboxQuestion = this.state.checkboxQuestions.find(
                              (checkboxQuestion) => {
                                return (
                                  checkboxQuestion.question_id ===
                                  question.question_id
                                );
                              }
                            );
                            return (
                              <div
                                key={index.toString()}
                                className='questionAnsModal'
                              >
                                <h2>Question {index + 1}</h2>
                                <h3>
                                  {
                                    checkboxQuestion.jobapply_answer_question
                                      .question
                                  }
                                </h3>
                                {checkboxQuestion.answers.map(
                                  (checkboxQuestionAnswer) => {
                                    return <p> {checkboxQuestionAnswer} </p>;
                                  }
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={index.toString()}
                                className='questionAnsModal'
                              >
                                <h2>Question {index + 1}</h2>
                                <h3>
                                  {question.jobapply_answer_question.question}
                                </h3>
                                <p>{question.answer} </p>
                              </div>
                            );
                          }
                        }
                      )}
                    </Modal>
                    {this.state.isModalOpen && (
                      <Modal
                        visible={this.state.isModalOpen}
                        onCancel={() => this.setState({ isModalOpen: false })}
                        footer={null}
                        className='resumeModalBox'
                      >
                        <div>
                          <iframe
                            src={this.state.modalLink}
                            style={{ width: 500, height: 500 }}
                            frameborder='0'
                          ></iframe>
                        </div>
                      </Modal>
                    )}
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
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  getClassfiedCategoryDetail,
  getResumeDetail,
  changeApplicationStatus,
  getCandidatesList,
  enableLoading,
  disableLoading,
  changeGeneralClassifiedStatus,
  getJobApplicantDetails,
})(ApplicationDetail);
