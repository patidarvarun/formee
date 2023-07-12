import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import {
  Menu,
  Tooltip,
  Dropdown,
  Layout,
  Typography,
  Avatar,
  List,
  Tabs,
  Row,
  Col,
  Input,
  Button,
  Upload,
  message,
  Rate,
  Modal,
  Divider,
  Popover,
  Space,
} from "antd";
import Icon from "../../../components/customIcons/customIcons";
import { UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  getClassfiedCategoryDetail,
  getJobQuestions,
} from "../../../actions/classifieds";
import {
  getChildCategory,
  enableLoading,
  disableLoading,
  addToWishList,
  removeToWishList,
  openLoginModel,
} from "../../../actions/index";
import ReportAdModal from "../common/modals/ReportAdModal";
import { convertISOToUtcDateformate, salaryNumberFormate } from "../../common";
import { langs } from "../../../config/localization";
import { STATUS_CODES } from "../../../config/StatusCode";
import { MESSAGES } from "../../../config/Message";
import { SocialShare } from "../../common/social-share";
import { rating, ratingLabel } from "../CommanMethod";
import ContactModal from "../common/modals/ContactModal";
import ApplyJobModal from "../common/modals/ApplyJobModal";
import { capitalizeFirstLetter, convertHTMLToText } from "../../common";
import Review from "../common/ClassifiedReview";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../config/Config";
import {
  getClassifiedCatLandingRoute,
  getClassifiedSubcategoryRoute,
} from "../../../common/getRoutes";
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classifiedDetail: [],
      allData: [],
      visible: false,
      jobApplication: false,
      salary: "",
      salary_type: "",
      company_name: "",
      about_job: "",
      opportunity: "",
      apply: "",
      about_you: "",
      responsbility: "",
      is_favourite: false,
      btnDisable: false,
      subCategory: [],
      reportAdModel: false,
    };
  }

  /**
   * @method componentWillMount
   * @description get selected categorie details
   */
  componentWillMount() {
    this.props.enableLoading();
    const { isLoggedIn } = this.props;
    let parameter = this.props.parameters ?? this.props.match.params;
    let parentId = parameter.categoryId;
    this.getDetails();
    this.getChildCategory(parentId);
    if (isLoggedIn) {
      this.getQuestions();
    }
  }

  /**
   * @method getChildCategory
   * @description get getChildCategory records
   */
  getChildCategory = (id) => {
    this.props.getChildCategory({ pid: id }, (res1) => {
      if (res1.status === 200) {
        const data =
          Array.isArray(res1.data.newinsertcategories) &&
          res1.data.newinsertcategories;
        this.setState({
          subCategory: data,
          // isFilterPage: isFilterPage,
        });
      }
    });
  };

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let classified_id = this.props.parameters?.classified_id ?? this.props.match.params.classified_id;
    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        let wishlist =
          res.data.data && res.data.data.wishlist === 1 ? true : false;
        let data = res.data.data;
        this.setState(
          {
            classifiedDetail: res.data.data,
            allData: res.data,
            is_favourite: wishlist,
            categoryName: res.data.category_name
              ? res.data.category_name
              : data && data.categoriesname
              ? data.categoriesname.name
              : "",
            subCatName: res.data.sub_category_name
              ? res.data.sub_category_name
              : data && data.subcategoriesname
              ? data.subcategoriesname.name
              : "",
            catId: res.data.category_id
              ? res.data.category_id
              : data && data.categoriesname
              ? data.categoriesname.id
              : "",
            tempSlug: res.data.template_slug
              ? res.data.template_slug
              : "general",
            subCatId: res.data.sub_category_id
              ? res.data.sub_category_id
              : data && data.subcategoriesname
              ? data.subcategoriesname.id
              : "",
          },
          () => {
            this.renderSpecification(this.state.allData.spicification);
          }
        );
      }
    });
  };
  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  getQuestions = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let classified_id = this.props.parameters?.classified_id ?? this.props.match.params.classified_id;

    let reqData = {
      id: classified_id,
      user_id: isLoggedIn ? loggedInDetail.id : "",
    };
    this.props.getJobQuestions(reqData, (res) => {
      if (res.status === 200 && res.data.result) {
        let questions = Array.isArray(
          res.data.result.classified_hasmany_questions
        )
          ? res.data.result.classified_hasmany_questions
          : [];
        let ans = [];
        Array.isArray(questions) &&
          questions.map((el) => {
            if (el.ans_type !== "checkbox") {
              ans.push({
                qus_id: el.id,
                ans_value: "",
              });
            }
          });
        if (
          this.props.location.state &&
          this.props.location.state.isOpenResumeModel !== undefined
        ) {
          // isOpenResumeModel
          this.setState({
            jobApplication: this.props.location.state.isOpenResumeModel,
            questions,
            answer: ans,
          });
        } else {
          this.setState({ questions, answer: ans });
        }
      } else {
        this.setState({ btnDisable: true });
        // toastr.warning(langs.warning, MESSAGES.ALREADY_APPLIED_ON_A_JOB)
      }
    });
  };

  /**
   * @method contactModal
   * @description contact model
   */
  contactModal = () => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        visible: true,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method jobApplicationModal
   * @description handle make an offer model
   */
  jobApplicationModal = () => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        jobApplication: true,
      });
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  /**
   * @method handleJobModalCancel
   * @description handle cancel
   */
  handleJobModalCancel = (e) => {
    this.getQuestions();
    this.props.history.replace({ state: { isOpenResumeModel: false } });
    this.setState(
      {
        jobApplication: false,
      },
      () => {
        window.history.replaceState(null, "");
      }
    );
  };

  /**
   * @method onSelection
   * @description handle favorite unfavorite
   */
  onSelection = (data, classifiedid) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const { is_favourite } = this.state;
    if (isLoggedIn) {
      if (data.wishlist === 1 || is_favourite) {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: classifiedid,
        };
        this.props.removeToWishList(requestData, (res) => {
          if (res.status === STATUS_CODES.OK) {
            // toastr.success(langs.success,res.data.msg)
            toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS);
            // this.getDetails()
            this.setState({ is_favourite: false });
          }
        });
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          classifiedid: classifiedid,
        };
        this.props.addToWishList(requestData, (res) => {
          this.setState({ flag: !this.state.flag });
          if (res.status === STATUS_CODES.OK) {
            // toastr.success(langs.success,res.data.msg)
            toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS);
            // this.getDetails()
            this.setState({ is_favourite: true });
          }
        });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method renderSpecification
   * @description render specification
   */
  renderSpecification = (data) => {
    let temp1 = "",
      temp2 = "",
      temp3 = "",
      temp4 = "",
      temp5 = "",
      temp6 = "",
      temp7 = "",
      temp8 = "";
    data &&
      data.map((el, i) => {
        if (el.key === "Salary Range") {
          temp1 = el.value;
        } else if (el.slug === "salary_type") {
          temp2 = el.value;
        } else if (el.slug === "company_name") {
          temp3 = el.value;
        } else if (el.slug === "job_type") {
          temp4 = el.value;
        } else if (
          el.key === "Opportunity" ||
          el.key === "About the job role" ||
          el.key === "The benefit you will get"
        ) {
          temp5 = el.value;
        } else if (el.slug === "How_to_apply") {
          temp6 = el.value;
        } else if (el.slug === "about_you:") {
          temp7 = el.value;
        } else if (el.slug === "key_responsibilities:") {
          temp8 = el.value;
        }
      });
    this.setState({
      salary: temp1 ? temp1 : "",
      salary_type: temp2 ? temp2 : "",
      company_name: temp3 ? temp3 : "",
      about_job: temp4 ? temp4 : "",
      opportunity: temp5 ? temp5 : "",
      apply: temp6 ? temp6 : "",
      about_you: temp7 ? temp7 : "",
      responsbility: temp8 ? temp8 : "",
    });
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { loggedInDetail, isLoggedIn } = this.props;
    const {
      categoryName,
      tempSlug,
      subCatName,
      subCategory,
      subCatId,
      is_favourite,
      jobApplication,
      visible,
      responsbility,
      classifiedDetail,
      allData,
      salary,
      salary_type,
      company_name,
      about_job,
      opportunity,
      apply,
      about_you,
      btnDisable,
      reportAdModel,
    } = this.state;
    let clasified_user_id =
      classifiedDetail && classifiedDetail.classified_users
        ? classifiedDetail.classified_users.id
        : "";
    let isButtonVisible =
      isLoggedIn && loggedInDetail.id === clasified_user_id ? false : true;
    let rate =
      classifiedDetail &&
      classifiedDetail.classified_hm_reviews &&
      rating(classifiedDetail.classified_hm_reviews);
    let parameter = this.props.parameters ?? this.props.match.params;
    let cat_id = parameter.categoryId;
    let classified_id = parameter.classified_id;
    let formateSalary = salary && salary !== "" && salary.split(";");
    let range1 = formateSalary && formateSalary[0];
    let range2 = formateSalary && formateSalary[1];
    let totalSalary =
      range1 && range2 ? `$${range1} - $${range2}` : range1 && `$${range1}`;
    const menu = <SocialShare {...this.props} />;
    let subCategoryPagePath = classifiedDetail.categoriesname
      ? getClassifiedSubcategoryRoute(
          TEMPLATE.JOB,
          categoryName,
          classifiedDetail.categoriesname.id,
          subCatName,
          classifiedDetail.subcategoriesname.id
        )
      : "";
    let categoryPagePath = classifiedDetail.categoriesname
      ? getClassifiedCatLandingRoute(
          TEMPLATE.GENERAL,
          classifiedDetail.categoriesname.id,
          categoryName
        )
      : "";
    let temp =
      allData.spicification &&
      Array.isArray(allData.spicification) &&
      allData.spicification.length
        ? allData.spicification
        : [];
    let salary1 =
      temp.length && temp.filter((el) => el.key === "Minimum Salary");
    let salary_min = salary1 && salary1.length ? salary1[0].value : "";
    let salary2 =
      temp.length && temp.filter((el) => el.key === "Maximum Salary");
    let salary_max = salary2 && salary2.length ? salary2[0].value : "";
    let salary_range =
      salary_min &&
      salary_max &&
      `AU$${salaryNumberFormate(salary_min)} - AU$${salaryNumberFormate(
        salary_max
      )}`;

    let image =
      classifiedDetail.classified_image &&
      Array.isArray(classifiedDetail.classified_image) &&
      classifiedDetail.classified_image.length
        ? classifiedDetail.classified_image[0]
        : "";
    let contactNumber =
      classifiedDetail.contact_mobile && classifiedDetail.contact_mobile;
    let formatedNumber =
      contactNumber && contactNumber.replace(/\d{7}(?=\d{3})/g, "0 XXXX XXX ");
    const number = (
      <Menu>
        <Menu.Item key="0">
          {isLoggedIn ? (
            <span>
              {classifiedDetail.classified_users && (
                <Tooltip placement="bottomRight">
                  <div>
                    <b>
                      <span>
                        Contact {classifiedDetail.classified_users.name}{" "}
                      </span>
                    </b>
                    <span>
                      {" "}
                      {classifiedDetail.contact_mobile
                        ? classifiedDetail.contact_mobile
                        : "Number not found"}{" "}
                    </span>
                  </div>
                </Tooltip>
              )}
            </span>
          ) : (
            <span>
              <span>
                <b>Contact Seller</b>
              </span>
              <span>{formatedNumber}</span>
              <div>
                Please{" "}
                <span
                  className="blue-link ml-16 fs-16"
                  onClick={() => this.props.openLoginModel()}
                >
                  Login
                </span>
                <br />
                to view number{" "}
              </div>
            </span>
          )}
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="product-detail-parent-block job-detail-parent-block">
        <Fragment>
          <Layout className="common-left-right-padd product-detail-child-detail">
            <Layout>
              <Layout
                style={{ width: "calc(100% - 0px)", overflowX: "visible" }}
              >
                <Layout>
                  <div className="job-detail-content-block">
                    <Row gutter={15}>
                      <Col md={24}>
                        {this.props.match?.params && <div className="month-detail category-name">
                          {classifiedDetail.subcategoriesname && (
                            <Link to={subCategoryPagePath}>
                              <Button type="ghost" shape={"round"}>
                                <Icon
                                  icon="arrow-left"
                                  size="20"
                                  className="arrow-left-icon"
                                />
                                {classifiedDetail.subcategoriesname &&
                                  capitalizeFirstLetter(
                                    classifiedDetail.subcategoriesname.name
                                  )}
                              </Button>
                            </Link>
                          )}
                        </div>}
                      </Col>
                      <Col md={3}>
                        <div className="job-logo-img">
                          <img
                            src={
                              classifiedDetail.company_logo
                                ? classifiedDetail.company_logo
                                : DEFAULT_IMAGE_CARD
                            }
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_IMAGE_CARD;
                            }}
                            alt={""}
                          />
                        </div>
                        <div className="report-ad text-center">
                          <div className="view-map testing-content change-log">
                            {classifiedDetail.subcategoriesname && (
                              <p
                                onClick={() => {
                                  if (classifiedDetail.is_reported === 1) {
                                    toastr.warning(
                                      langs.warning,
                                      MESSAGES.REPORT_ADD_WARNING
                                    );
                                  } else {
                                    this.setState({ reportAdModel: true });
                                  }
                                }}
                                className="blue-p"
                              >
                                <ExclamationCircleOutlined /> Report this Ad
                              </p>
                            )}
                          </div>
                        </div>
                      </Col>

                      <Col md={1}> &nbsp;</Col>
                      <Col md={20}>
                        <div className="job-title-button-detail">
                          <div className="parent-left-block">
                            <Title level={2} className="title">
                              {classifiedDetail.title &&
                                capitalizeFirstLetter(classifiedDetail.title)}
                            </Title>
                            <div className="price-box">
                              <div className="price">
                                {salary_range
                                  ? salary_range
                                  : totalSalary
                                  ? `AU$${salaryNumberFormate(totalSalary)}`
                                  : ""}
                                {salary_type && (
                                  <Text className="text-grray">
                                    &nbsp;
                                    <span className="dark-color">
                                      {salary_type && salary_type}
                                    </span>
                                  </Text>
                                )}
                              </div>
                            </div>
                            <div className="info">
                              <div className="left-block">
                                <div className="info-detail">
                                  {classifiedDetail.created_at && (
                                    <Text>
                                      <span className="label">
                                        Date Listed:
                                      </span>
                                      <span className="dark-color">
                                        {classifiedDetail &&
                                          convertISOToUtcDateformate(
                                            classifiedDetail.created_at
                                          )}
                                      </span>
                                    </Text>
                                  )}
                                </div>
                                <div className="info-detail">
                                  {about_job && (
                                    <Text>
                                      <span className="label">Job Type:</span>
                                      <span className="dark-color">
                                        {about_job}
                                      </span>
                                    </Text>
                                  )}
                                </div>
                              </div>
                              <div className="right-block">
                                <div className="info-detail ad-details">
                                  {categoryName && (
                                    <Text>
                                      <span className="label">Ad Details:</span>
                                      <Link to={categoryPagePath}>
                                        <span className="light-btn">
                                          {categoryName}
                                        </span>
                                      </Link>
                                    </Text>
                                  )}
                                  <Text className="text-gray">{`AD No. ${classified_id}`}</Text>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="parent-right-block">
                            <div className="ant-card-actions">
                              <div className="left-block">
                                <div className="total-view">
                                  <Icon icon="view" size="20" />{" "}
                                  <Text>{classifiedDetail.count} Views</Text>
                                </div>
                              </div>
                              <div className="right-block">
                                <ul>
                                  {classifiedDetail &&
                                    classifiedDetail.hide_mob_number === 1 && (
                                      <li>
                                        <Dropdown
                                          overlay={number}
                                          trigger={["click"]}
                                          overlayClassName="contact-social-detail"
                                          placement="bottomCenter"
                                          arrow
                                        >
                                          <div
                                            className="ant-dropdown-link"
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            <Icon
                                              icon="call"
                                              size="27"
                                              onClick={(e) =>
                                                e.preventDefault()
                                              }
                                            />
                                          </div>
                                        </Dropdown>
                                      </li>
                                    )}
                                  <li>
                                    <Dropdown
                                      overlay={menu}
                                      trigger={["click"]}
                                      overlayClassName="contact-social-detail share-ad"
                                      placement="bottomCenter"
                                      arrow
                                    >
                                      <div
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                      >
                                        <Icon icon="share" size="27" />
                                      </div>
                                    </Dropdown>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {isButtonVisible && (
                              <div className="right-content">
                                <div className="action-btn-block">
                                  <Button
                                    type="default"
                                    onClick={this.contactModal}
                                    className="contact-btn"
                                  >
                                    {"Contact"}
                                  </Button>
                                  <Button
                                    type="default"
                                    disabled={btnDisable}
                                    onClick={this.jobApplicationModal}
                                    className="make-offer-btn"
                                  >
                                    {"Apply for this job"}
                                  </Button>
                                </div>
                              </div>
                            )}
                            <div>
                              <Button
                                type="default"
                                onClick={() =>
                                  this.onSelection(
                                    classifiedDetail,
                                    classified_id
                                  )
                                }
                                className="add-wishlist-btn"
                              >
                                {classifiedDetail && (
                                  <Icon
                                    icon={
                                      is_favourite
                                        ? "wishlist-fill"
                                        : "wishlist"
                                    }
                                    size="20"
                                    className={is_favourite ? "active" : ""}
                                    onClick={() =>
                                      this.onSelection(
                                        classifiedDetail,
                                        classified_id
                                      )
                                    }
                                  />
                                )}{" "}
                                Add to Wishlist
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Tabs
                      type="card"
                      className={"tab-style3 job-detail-content mt-0"}
                    >
                      <TabPane
                        tab={<span className="border-line">Details</span>}
                        key="1"
                      >
                        <Row gutter={[0, 0]}>
                          <Col md={20}>
                            <div className="content-detail-block">
                              <Title level={4}>Job Description</Title>
                              {
                                <Title level={4} className="sub-title mt-20">
                                  Opportunity!
                                </Title>
                              }
                              <Paragraph className="description">
                                {convertHTMLToText(
                                  classifiedDetail.description
                                )}
                              </Paragraph>

                              {responsbility && (
                                <Title level={4} className="sub-title mt-20">
                                  Key Responsbilities are but not limited to:
                                </Title>
                              )}
                              {responsbility && (
                                <Paragraph className="description">
                                  {responsbility &&
                                    convertHTMLToText(responsbility)}
                                </Paragraph>
                              )}
                              {about_you && (
                                <Title level={4} className="sub-title mt-20">
                                  About you:
                                </Title>
                              )}
                              {about_you && (
                                <Paragraph className="description">
                                  {about_you && convertHTMLToText(about_you)}
                                </Paragraph>
                              )}

                              {apply && (
                                <Title level={4} className="sub-title mt-20">
                                  How do I apply?
                                </Title>
                              )}
                              {apply && (
                                <Paragraph className="description">
                                  {apply && convertHTMLToText(apply)}
                                </Paragraph>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane
                        tab={
                          <span className="border-line">
                            Advertiser Information
                          </span>
                        }
                        key="4"
                      >
                        <Row className="reviews-content">
                          <Col md={14}>
                            <div className="reviews-content-left">
                              <div className="reviews-content-avatar">
                                <Avatar
                                  src={
                                    classifiedDetail.classified_users &&
                                    classifiedDetail.classified_users
                                      .image_thumbnail
                                      ? classifiedDetail.classified_users
                                          .image_thumbnail
                                      : require("../../../assets/images/avatar3.png")
                                  }
                                  size={69}
                                />
                              </div>
                              <div className="reviews-content-avatar-detail">
                                <Title level={4} className="mt-0 mb-4">
                                  {/* {classifiedDetail.classified_users && classifiedDetail.classified_users.name} */}
                                  {company_name}
                                </Title>
                                <Paragraph className="fs-10 text-gray">
                                  {classifiedDetail.classified_users &&
                                    `(Member since : ${classifiedDetail.classified_users.member_since})`}
                                </Paragraph>
                                <Link to="/" className="fs-10 underline">
                                  {`Found ${classifiedDetail.usercount} Ads`}
                                </Link>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    </Tabs>
                  </div>
                </Layout>
              </Layout>
            </Layout>
          </Layout>
          {reportAdModel && (
            <ReportAdModal
              visible={reportAdModel}
              onCancel={() => this.setState({ reportAdModel: false })}
              classifiedDetail={classifiedDetail && classifiedDetail}
              callNext={this.getDetails}
            />
          )}
          {visible && (
            <ContactModal
              visible={visible}
              onCancel={this.handleCancel}
              classifiedDetail={classifiedDetail && classifiedDetail}
              receiverId={
                classifiedDetail.classified_users
                  ? classifiedDetail.classified_users.id
                  : ""
              }
              classifiedid={classifiedDetail && classifiedDetail.id}
            />
          )}
          {jobApplication && (
            <ApplyJobModal
              visible={jobApplication}
              onJobCancel={this.handleJobModalCancel}
              classifiedDetail={classifiedDetail && classifiedDetail}
              companyName={company_name && company_name}
              {...this.props}
            />
          )}
        </Fragment>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, classifieds } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedclassifiedDetail: classifieds.classifiedsList,
  };
};

export default connect(mapStateToProps, {
  getChildCategory,
  getClassfiedCategoryDetail,
  getJobQuestions,
  addToWishList,
  removeToWishList,
  openLoginModel,
  enableLoading,
  disableLoading,
})(DetailPage);
