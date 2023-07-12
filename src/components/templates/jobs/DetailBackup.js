import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { Dropdown, Layout, Typography, Avatar, List, Tabs, Row, Col, Breadcrumb, Form, Input, Button, Upload, message, Rate, Modal, Divider, Popover, Space } from 'antd';
import Icon from '../../../components/customIcons/customIcons';
import { getClassfiedCategoryDetail, getJobQuestions } from '../../../actions/classifieds';
import { enableLoading, disableLoading, addToWishList, removeToWishList, openLoginModel } from '../../../actions/index'
import { DEFAULT_IMAGE_CARD } from '../../../config/Config'
import AppSidebar from '../../sidebar/SidebarInner';
import { getClassifiedCatLandingRoute, getClassifiedSubcategoryRoute } from '../../../common/getRoutes'
import { convertISOToUtcDateformate, salaryNumberFormate } from '../../common';
import { langs } from '../../../config/localization';
import { STATUS_CODES } from '../../../config/StatusCode';
import { MESSAGES } from '../../../config/Message'
import { SocialShare } from '../../common/social-share'
import history from '../../../common/History';
import { rating, ratingLabel } from '../CommanMethod'
import ContactModal from '../ContactModal'
import ApplyJobModal from './ApplyJobModal'
import { capitalizeFirstLetter } from '../../common'
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13, offset: 1 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { offset: 7, span: 13 },
    className: 'align-center pt-20'
};

const uploadprops = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    className: 'upload-list-top',
    listType: 'picture',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const classified_hasmany_questions = [{
    id: 40,
    classified_id: 430,
    question: 'Describe your skills',
    ans_type: 'text',
    created_at: '2018-03-08 13:46:52',
    updated_at: '2018-03-08 13:46:52',
    question_hasmany_options: []
},
{
    id: 41,
    classified_id: 430,
    question: 'Describe your skills',
    ans_type: 'radio',
    created_at: '2018-03-08 13:46:52',
    updated_at: '2018-03-08 13:46:52',
    options: ['Option 3000.1', 'Option 3000.2']
},
{
    id: 42,
    classified_id: 430,
    question: 'Describe your skills',
    ans_type: 'checkbox',
    created_at: '2018-03-08 13:46:52',
    updated_at: '2018-03-08 13:46:52',
    options: ['Option 3000.1', 'Option 3000.2', 'Option 3000.3', 'Option 3000.4']
}]

class DetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classifiedDetail: [],
            allData: [],
            visible: false,
            jobApplication: false,
            salary: '', salary_type: '', company_name: '', about_job: '', opportunity: '',
            apply: '',
            about_you: '',
            responsbility: '',
            is_favourite: false,
            btnDisable: false
        };
    }

    /**
     * @method componentWillMount
     * @description get selected categorie details
     */
    componentWillMount() {
        const { isLoggedIn } = this.props
        this.props.enableLoading()
        this.getDetails()
        if (isLoggedIn) {
            this.getQuestions()
        }
    }

    /**
     * @method getDetails
     * @description get details 
     */
    getDetails = () => {
        const { isLoggedIn, loggedInDetail } = this.props
        let classified_id = this.props.match.params.classified_id
        let reqData = {
            id: classified_id,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getClassfiedCategoryDetail(reqData, (res) => {
            this.props.disableLoading()
            if (res.status === 200) {
                let wishlist = res.data.data && res.data.data.wishlist === 1 ? true : false
                this.setState({ classifiedDetail: res.data.data, allData: res.data, is_favourite: wishlist }, () => {
                    this.renderSpecification(this.state.allData.spicification)
                })

            }
        })
    }
    /**
     * @method componentWillMount
     * @description called before mounting the component
     */
    getQuestions = () => {
        const { isLoggedIn, loggedInDetail } = this.props
        let classified_id = this.props.match.params.classified_id

        let reqData = {
            id: classified_id,
            user_id: isLoggedIn ? loggedInDetail.id : ''
        }
        this.props.getJobQuestions(reqData, (res) => {
            if (res.status === 200 && res.data.result) {
                let questions = Array.isArray(res.data.result.classified_hasmany_questions) ? res.data.result.classified_hasmany_questions : []
                let ans = []
                Array.isArray(questions) && questions.map((el) => {
                    
                    if (el.ans_type !== "checkbox") {
                        ans.push({
                            qus_id: el.id,
                            ans_value: ''
                        })
                    }
                })
                if (this.props.location.state && this.props.location.state.isOpenResumeModel !== undefined) {
                    
                    // isOpenResumeModel
                    this.setState({ jobApplication: this.props.location.state.isOpenResumeModel, questions, answer: ans })
                } else {
                    this.setState({ questions, answer: ans })
                }
            } else {
                this.setState({ btnDisable: true })
                // toastr.warning(langs.warning, MESSAGES.ALREADY_APPLIED_ON_A_JOB)

            }
        })
    }


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
            this.props.openLoginModel()
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
            this.props.openLoginModel()
        }
    };

    /**
     * @method handleCancel
     * @description handle cancel
     */
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    /**
    * @method handleJobModalCancel
    * @description handle cancel
    */
    handleJobModalCancel = e => {
        this.getQuestions()
        this.props.history.replace({ state: { isOpenResumeModel: false } });
        this.setState({
            jobApplication: false,
        }, () => {
            window.history.replaceState(null, '')
        });
    };

    /**
     * @method onSelection
     * @description handle favorite unfavorite
     */
    onSelection = (data, classifiedid) => {
        const { isLoggedIn, loggedInDetail } = this.props;
        const { is_favourite } = this.state
        if (isLoggedIn) {
            if (data.wishlist === 1 || is_favourite) {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: classifiedid,
                }
                this.props.removeToWishList(requestData, res => {
                    if (res.status === STATUS_CODES.OK) {
                        // toastr.success(langs.success,res.data.msg)
                        toastr.success(langs.success, MESSAGES.REMOVE_WISHLIST_SUCCESS)
                        // this.getDetails()
                        this.setState({ is_favourite: false })
                    }
                })
            } else {
                const requestData = {
                    user_id: loggedInDetail.id,
                    classifiedid: classifiedid,
                }
                this.props.addToWishList(requestData, res => {
                    this.setState({ flag: !this.state.flag })
                    if (res.status === STATUS_CODES.OK) {
                        // toastr.success(langs.success,res.data.msg)
                        toastr.success(langs.success, MESSAGES.ADD_WISHLIST_SUCCESS)
                        // this.getDetails()
                        this.setState({ is_favourite: true })
                    }
                })
            }
        } else {
            this.props.openLoginModel()
        }
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
        const { loggedInDetail, isLoggedIn } = this.props
        const { is_favourite, jobApplication, visible, responsbility, classifiedDetail, allData, salary, salary_type, company_name, about_job, opportunity, apply, about_you, btnDisable } = this.state;
        
        let clasified_user_id = classifiedDetail && classifiedDetail.classified_users ? classifiedDetail.classified_users.id : ''
        let isButtonVisible = isLoggedIn && loggedInDetail.id === clasified_user_id ? false : true
        let rate = classifiedDetail && classifiedDetail.classified_hm_reviews && rating(classifiedDetail.classified_hm_reviews)
        let parameter = this.props.match.params
        let cat_id = parameter.categoryId;
        let classified_id = parameter.classified_id
        let formateSalary = salary && salary !== '' && salary.split(';')
        let range1 = formateSalary && formateSalary[0]
        let range2 = formateSalary && formateSalary[1]
        let totalSalary = range1 && range2 ? `$${range1} - $${range2} ${salary_type}` : range1 && `$${range1} ${salary_type}`
        const menu = (
            <SocialShare {...this.props} />
        )
        return (
            <div>
                <Fragment>
                    <Layout>
                        <Layout>
                            <AppSidebar history={history} activeCategoryId={cat_id} moddule={1} />
                            <Layout style={{ width: 'calc(100% - 200px)', overflowX: 'visible' }}>
                                <Breadcrumb separator='|' className='pt-20 pb-30' style={{ paddingLeft: 50 }}>
                                    <Breadcrumb.Item>
                                        <Link to='/'>Home</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to='/classifieds'>Classified</Link>
                                    </Breadcrumb.Item>
                                    {classifiedDetail.categoriesname && <Breadcrumb.Item>
                                        <Link to={getClassifiedCatLandingRoute('job', cat_id, classifiedDetail.categoriesname.name)}>Jobs</Link>
                                    </Breadcrumb.Item>}
                                    {classifiedDetail.categoriesname && <Breadcrumb.Item>
                                        <Link to={getClassifiedSubcategoryRoute('job', classifiedDetail.categoriesname.name,
                                            cat_id,
                                            classifiedDetail.subcategoriesname.name, classifiedDetail.subcategoriesname.id)}>Accounting</Link>
                                    </Breadcrumb.Item>}
                                    <Breadcrumb.Item>
                                        AD No. {classified_id}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <Title level={2} className='inner-page-title'>
                                    <span>{classifiedDetail.categoriesname && classifiedDetail.categoriesname.name}</span>
                                </Title>
                                <Layout>
                                    <div className='wrap-inner mb-35'>
                                        <Tabs type='card' className={'tab-style3 job-detail-content'}>
                                            <TabPane tab={(<span className='border-line'>Details</span>)} key='1'>
                                                <Row>
                                                    <Col md={20}>
                                                        <Row>
                                                            <Col xl={10}>
                                                                <Text className='text-gray'>{`AD No. ${classified_id}`}</Text>
                                                                <Title level={2} className='title'>{classifiedDetail.title && capitalizeFirstLetter(classifiedDetail.title)}</Title>
                                                                {/* <div className='company-name'>
                                                                    {company_name && company_name}
                                                                </div> */}
                                                                <div className='location-name'>
                                                                    {classifiedDetail.location !== 'N/A' && classifiedDetail.location}
                                                                </div>
                                                                <div className='rate-section'>
                                                                    {rate ? rate : 'No reviews yet'}
                                                                    {rate && <Rate disabled defaultValue={rate && rate ? rate : ''} />}
                                                                </div>

                                                                <div className='price-box'>
                                                                    <div className='price'>{totalSalary ? `AU$${salaryNumberFormate(totalSalary)}` : ''} </div>
                                                                </div>
                                                                <div className='info'>
                                                                    {classifiedDetail.created_at && <Text className='text-gray'>Date Posted - &nbsp;&nbsp;{classifiedDetail && convertISOToUtcDateformate(classifiedDetail.created_at)}<br /></Text>}
                                                                    {classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname.name && <Text className='text-gray'>Category - &nbsp;&nbsp;{classifiedDetail.subcategoriesname && classifiedDetail.subcategoriesname.name}<br /></Text>}
                                                                    {about_job && <Text className='text-gray'>Job Type - &nbsp;&nbsp;{about_job}<br /></Text>}
                                                                    {salary_type && <Text className='text-gray'>Salary Type - &nbsp;&nbsp;{salary_type && salary_type}</Text>}
                                                                </div>
                                                                <ul className='ant-card-actions'>
                                                                    <li>
                                                                        <Icon
                                                                            icon={is_favourite ? 'wishlist-fill' : 'wishlist'}
                                                                            size='20'
                                                                            // className={classifiedDetail.wishlist === 1 ? 'active' : ''}
                                                                            className={is_favourite ? 'active' : ''}
                                                                            onClick={() => this.onSelection(classifiedDetail, classified_id)}
                                                                        />
                                                                    </li>
                                                                    <li>
                                                                        <Dropdown overlay={menu} trigger={['click']}>
                                                                            <div className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                                                                <Icon icon='share' size='20' />
                                                                            </div>
                                                                        </Dropdown>
                                                                    </li>
                                                                    <li>
                                                                        <Popover title={`Total Views : ${classifiedDetail.count}`}>
                                                                            <Icon icon='view' size='20' /> <Text>{classifiedDetail.count}</Text>
                                                                        </Popover>
                                                                    </li>
                                                                </ul>
                                                            </Col>
                                                            {isButtonVisible && <Col xl={14}>
                                                                <div className='right-content'>
                                                                    {/* {company_name && company_name} */}
                                                                    <Space className='action-btn'>
                                                                        <Button
                                                                            type='default'
                                                                            onClick={this.contactModal}
                                                                        >
                                                                            {'Contact'}
                                                                        </Button>

                                                                        <Button
                                                                            type='default'
                                                                            disabled={btnDisable}
                                                                            onClick={this.jobApplicationModal}
                                                                        >
                                                                            {'Apply for this job'}
                                                                        </Button>
                                                                    </Space>
                                                                </div>
                                                            </Col>}
                                                        </Row>

                                                        <Divider />
                                                        <Paragraph className='description'>
                                                            {classifiedDetail.description}
                                                        </Paragraph>
                                                        {opportunity && <p className='strong'>The Opportunity:</p>}
                                                        <p>{opportunity && opportunity}</p><br />
                                                        {responsbility && <p className='strong'>Key Responsbility:</p>}
                                                        <p>{responsbility && responsbility}</p><br />
                                                        {about_you && <p className='strong'>About you:</p>}
                                                        <p>{about_you && about_you}</p><br />
                                                        {apply && <p className='strong'>How do I apply?</p>}
                                                        <p>{apply && apply}</p>
                                                        <p></p>
                                                    </Col>
                                                </Row>
                                            </TabPane>

                                            <TabPane tab={(<span className='border-line'>Advertiser</span>)} key='4'>
                                                <Row className='reviews-content'>
                                                    <Col md={14}>
                                                        <div className='reviews-content-left'>
                                                            <div className='reviews-content-avatar'>
                                                                <Avatar
                                                                    src={classifiedDetail.classified_users &&
                                                                        classifiedDetail.classified_users.image_thumbnail ?
                                                                        classifiedDetail.classified_users.image_thumbnail :
                                                                        require('../../../assets/images/avatar3.png')}
                                                                    size={69}
                                                                />
                                                            </div>
                                                            <div className='reviews-content-avatar-detail'>
                                                                <div className='clearfix'>
                                                                    <Title level={4} className='mt-10'>
                                                                        {classifiedDetail.classified_users && classifiedDetail.classified_users.name}
                                                                        <Link to='/' className='pull-right fs-10 text-gray'>
                                                                            {`Found ${classifiedDetail.usercount} Ads`}
                                                                        </Link>
                                                                    </Title>
                                                                </div>
                                                                <Paragraph className='fs-10 text-gray'>
                                                                    {classifiedDetail.classified_users &&
                                                                        `(Member since : ${classifiedDetail.classified_users.member_since})`}
                                                                </Paragraph>
                                                                <div className='reviews-rating'>
                                                                    <div className='product-ratting mb-15'>
                                                                        <Text>{rate ? rate : 'No reviews yet'}</Text>
                                                                        {rate && <Rate allowHalf defaultValue={rate && rate ? rate : 0} className='fs-15 ml-6 mr-6' style={{ position: 'relative', top: '-1px' }} />}
                                                                        <Text>{rate ? `${rate} of 5.0 /` : ''}  {ratingLabel(rate)}</Text>
                                                                    </div>
                                                                </div>
                                                                <div className='address'>
                                                                    {classifiedDetail.location}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Title level={3} className='text-gray mt-30'>
                                                            {`Reviews (${classifiedDetail.classified_hm_reviews && classifiedDetail.classified_hm_reviews.length})`}
                                                        </Title>
                                                        <Divider style={{ marginTop: 0, backgroundColor: '#90A8BE' }} />
                                                        <List
                                                            itemLayout='vertical'
                                                            dataSource={classifiedDetail.classified_hm_reviews && classifiedDetail.classified_hm_reviews}
                                                            renderItem={item => (
                                                                <List.Item>
                                                                    <Rate allowHalf defaultValue={item.rating} className='fs-16 mb-7' />
                                                                    <List.Item.Meta
                                                                        avatar={<Avatar
                                                                            src={item.reviews_bt_users &&
                                                                                item.reviews_bt_users.image_thumbnail ?
                                                                                item.reviews_bt_users.image_thumbnail :
                                                                                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                                                            }
                                                                            alt={''}
                                                                            size={37}
                                                                        />}
                                                                        title={<a href='https://ant.design'>{item.reviews_bt_users && item.reviews_bt_users.fname}</a>}
                                                                        description={item.review}
                                                                    />
                                                                </List.Item>
                                                            )}
                                                        />
                                                        <div className='align-right'>
                                                            {classifiedDetail.classified_hm_reviews && classifiedDetail.classified_hm_reviews.length > 5 && <div className='red-link'>{'Read more reviews'}</div>}
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
                    {visible &&
                        <ContactModal
                            visible={visible}
                            onCancel={this.handleCancel}
                            classifiedDetail={classifiedDetail && classifiedDetail}
                            receiverId={classifiedDetail.classified_users ? classifiedDetail.classified_users.id : ''}
                            classifiedid={classifiedDetail && classifiedDetail.id}
                        />}
                    {jobApplication &&
                        <ApplyJobModal
                            visible={jobApplication}
                            onJobCancel={this.handleJobModalCancel}
                            classifiedDetail={classifiedDetail && classifiedDetail}
                            companyName={company_name && company_name}
                            questions={classified_hasmany_questions}
                            {...this.props}
                        />}
                </Fragment>
            </div >
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, classifieds } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedclassifiedDetail: classifieds.classifiedsList
    };
}

export default connect(
    mapStateToProps,
    { getClassfiedCategoryDetail, getJobQuestions, addToWishList, removeToWishList, openLoginModel, enableLoading, disableLoading }
)(DetailPage);