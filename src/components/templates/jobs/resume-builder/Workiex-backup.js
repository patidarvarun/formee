import React, { Fragment } from 'react';
import { Button, Select, Tabs, Checkbox, DatePicker, Row, Typography } from 'antd';
import Icon from '../../../customIcons/customIcons';
import { Form, Input, Col } from 'antd';
import { connect } from 'react-redux';
import { required } from '../../../../config/FormValidation'
import 'react-quill/dist/quill.snow.css';
import moment from 'moment'
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
// import ReactQuill from 'react-quill';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { convertHTMLToText } from '../../../common'

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

class WorkExperience extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            submitBussinessForm: false,
            submitFromOutside: false,
            imageUrl: '',
            key: 1,
            value: '',
            address: '',
            postal_code: '',
            isOpenResumeModel: false,
            values: {},
            editorValue: '',
            showOtherModule: false,
            defaultCheck1: false,
            defaultCheck2: false,
            obj1: {
                job_title: '',
                company: '',
                city: '',
                currently_working: '',
                description: '',
                start_month: '',
                complete_month: '',
                start_year: '',
                complete_year: '',
            },
            // editorState2: BraftEditor.createEditorState(''),
            // editorState1: BraftEditor.createEditorState(''),
            editorState1: this.props.resumeDetails && this.props.resumeDetails.work_experience[0] ? BraftEditor.createEditorState(this.props.resumeDetails.work_experience[0].description) : BraftEditor.createEditorState(''),
            editorState2: this.props.resumeDetails && this.props.resumeDetails.work_experience[1] ? BraftEditor.createEditorState(this.props.resumeDetails.work_experience[1].description) : BraftEditor.createEditorState(''),
            obj2: {
                job_title: '',
                company: '',
                city: '',
                currently_working: '',
                description: '',
                start_month: '',
                complete_month: '',
                start_year: '',
                complete_year: '',
            },

            monthOptions: [{ id: 0, label: 'January' }, { id: 1, label: 'Februry' }, { id: 2, label: 'March' }, { id: 3, label: 'April' },
            { id: 4, label: 'May' }, { id: 5, label: 'June' }, { id: 6, label: 'July' }, { id: 7, label: 'Agust' }, { id: 8, label: 'September' }, { id: 9, label: 'October' }, { id: 10, label: 'November' }, { id: 11, label: 'December' }]
        };
        // this.handleEditorValue = this.handleEditorValue.bind(this);

    }

    /**
    * @method componentDidMount
    * @description called before mounting the component
    */
    componentDidMount() {
        
        if (this.props.resumeDetails) {
            let firstObj = this.props.resumeDetails.work_experience[0];
            let secondObj = this.props.resumeDetails.work_experience[1]
            
            let ob1, ob2;
            if (firstObj !== undefined) {
                ob1 = {
                    job_title: firstObj.job_title,
                    company: firstObj.company,
                    city: firstObj.city,
                    // description: firstObj.description,
                    description: this.state.editorState1,
                    start_month: firstObj.start_month,
                    complete_month: firstObj.complete_month,
                    start_year: firstObj.start_year,
                    complete_year: firstObj.complete_year,
                    currently_working: firstObj.currently_working,
                }
            }
            if (secondObj !== undefined) {
                ob2 = {
                    job_title: secondObj.job_title,
                    company: secondObj.company,
                    city: secondObj.city,
                    // description: secondObj.description,
                    description: this.state.editorState2,
                    start_month: secondObj.start_month,
                    complete_month: secondObj.complete_month,
                    start_year: secondObj.start_year,
                    complete_year: secondObj.complete_year,
                    currently_working: secondObj.currently_working,
                }
            }
            this.setState({
                obj1: firstObj === undefined ? { ...this.state.obj1 } : { ...ob1 },
                obj2: secondObj === undefined ? { ...this.state.obj2 } : { ...ob2 },
                showOtherModule: secondObj === undefined ? false : true,

                defaultCheck1: firstObj !== undefined && firstObj.currently_working == 1 ? true : false,

                defaultCheck2: secondObj !== undefined && secondObj.currently_working == 1 ? true : false
            })
        }
    }

    /** 
     * @method getUserDetails
     * @description call to get user details by Id 
     */
    getUserDetails = () => {
        const { id } = this.props.loggedInUser
        this.props.getUserProfile({ user_id: id }, (res) => { })
    }

    /**
     * @method onFinish
     * @description called to submit form 
     */
    onFinish = (values) => {
        const { obj1, obj2 } = this.state
        obj1.description = this.state.editorState1.toHTML()
        obj2.description = this.state.editorState2.toHTML()
        
        
        let reqData = [];
        const isEmpty1 = Object.values(obj1).every(x => (x === null || x === ''));
        const isEmpty2 = Object.values(obj2).every(x => (x === null || x === ''));
        !isEmpty1 && reqData.push(obj1)
        !isEmpty2 && reqData.push(obj2)
        
        this.props.next(reqData, 2)
    }

    handleEditorValue = (html) => {
        let htmlToText = convertHTMLToText(html)
        // this.setValue(html, 'description', i)
        
        this.setState({ editorValue: htmlToText })
    }

    /**
     * @method handleEditorChange
     * @description handle editor text value change
     */
    handleEditorChange = (editorState, i) => {
        if (i === 1) {
            this.setState({ editorState1: editorState })
            
        } else if (i === 2) {
            this.setState({ editorState2: editorState })
            
        }
    };

    /** 
     * @method setValue
     * @description returns Initial Value to set on its Fields 
     */
    setValue = (value, key, i) => {
        i == 1 ?
            this.setState({ obj1: { ...this.state.obj1, [key]: value } })
            :
            this.setState({ obj2: { ...this.state.obj2, [key]: value } })
    }

    /** 
     * @method getInitialValue
     * @description returns Initial Value to set on its Fields 
     */
    getInitialValue = () => {
        const { resumeDetails } = this.props;
        
        const { editorState1, editorState2 } = this.state
        if (this.props.resumeDetails) {
            let firstObj = this.props.resumeDetails.work_experience[0]
            let secondObj = this.props.resumeDetails.work_experience[1]

            let temp = {}
            if (firstObj !== undefined) {
                temp.job_title1 = firstObj.job_title
                temp.company1 = firstObj.company
                temp.city1 = firstObj.city
                // temp.description1 = firstObj.description
                temp.description1 = editorState1
                temp.start_month1 = firstObj.start_month
                temp.complete_month1 = firstObj.complete_month
                temp.start_year1 = moment(firstObj.start_year, 'YYYY')
                temp.complete_year1 = moment(firstObj.complete_year, 'YYYY')
            }
            if (secondObj !== undefined) {
                temp.job_title2 = secondObj.job_title
                temp.company2 = secondObj.company
                temp.city2 = secondObj.city
                // temp.description2 = secondObj.description
                temp.description2 = editorState2
                temp.start_month2 = secondObj.start_month
                temp.complete_month2 = secondObj.complete_month
                temp.start_year2 = moment(secondObj.start_year, 'YYYY')
                temp.complete_year2 = moment(secondObj.complete_year, 'YYYY')
            }
            return temp;
        }
    }

    renderFormModule = (i) => {
        const controls = ['bold', 'italic', 'underline', 'separator']
        const { showOtherModule, obj1, obj2, monthOptions, defaultCheck1, defaultCheck2 } = this.state
        return (
            <Fragment>
                <div className='inner-content shadow'>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item
                                label='Job Title'
                                name={`job_title${i}`}
                                rules={[required('Job Title')]}
                                onChange={(e) => {
                                    this.setValue(e.target.value, 'job_title', i)
                                }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={28}>
                        <Col span={24}>
                            <Form.Item
                                label='Company'
                                name={`company${i}`}
                                rules={[required('Company')]}
                                onChange={(e) => {
                                    this.setValue(e.target.value, 'company', i)
                                }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={28}>
                        <Col span={24}>
                            <Form.Item
                                label='City'
                                name={`city${i}`}
                                rules={[required('City')]}
                                onChange={(e) => {
                                    this.setValue(e.target.value, 'city', i)

                                }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={28}>
                        <Col span={24}>
                            <Form.Item
                                label='Time Period'
                                name={`currently_working${i}`}
                            >
                                <div className='mb-15'>
                                    <Checkbox defaultChecked={i == 2 ? defaultCheck2 : !defaultCheck1} onChange={(e) => {
                                        let check = e.target.checked ? 1 : 0
                                        this.setValue(check, 'currently_working', i)

                                    }}> I currently work here</Checkbox>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Input.Group compact>
                                        <Form.Item
                                            name={`start_month${i}`}
                                            noStyle
                                            rules={[required('Start Month')]}
                                        >
                                            {/* <DatePicker picker='month' bordered={true} /> */}
                                            <Select
                                                placeholder='Select'
                                                size='large'
                                                allowClear
                                                onChange={(e) => {
                                                    monthOptions[e] !== undefined && this.setValue(monthOptions[e].label, 'start_month', i)
                                                    if (i === 1 ? ((obj1.start_year >= obj1.complete_year) && (obj1.start_year !== '' && obj1.complete_year !== '')) : ((obj2.start_year >= obj2.complete_year) && (obj2.start_year !== '' && obj2.complete_year !== ''))) {
                                                        this.formRef.current.setFieldsValue({
                                                            [`complete_month${i}`]: ''
                                                        });
                                                    }
                                                }}
                                            >
                                                {this.state.monthOptions.map((keyName, i) => {
                                                    return (
                                                        <Option key={i} value={keyName.value}>{keyName.label}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name={`start_year${i}`}
                                            noStyle
                                            rules={[required('Start Year')]}
                                        >
                                            <DatePicker
                                                onChange={(e) => {
                                                    this.setValue(moment(e).format('YYYY'), 'start_year', i)
                                                    if (i === 1 ? (obj1.start_year >= obj1.complete_year) : (obj2.start_year >= obj2.complete_year)) {
                                                        this.formRef.current.setFieldsValue({
                                                            [`complete_month${i}`]: ''
                                                        });
                                                    }

                                                    this.formRef.current.setFieldsValue({
                                                        [`complete_year${i}`]: ''
                                                    });
                                                }}
                                                picker='year' />
                                        </Form.Item>
                                    </Input.Group>
                                    <Text className='pl-10 pr-10'>To</Text>
                                    <Input.Group compact>
                                        <Form.Item
                                            name={`complete_month${i}`}
                                            noStyle
                                            rules={[required('Complete Month')
                                            ]}
                                        >
                                            <Select
                                                placeholder='Select'
                                                size='large'
                                                onChange={(e) => {
                                                    monthOptions[e] !== undefined && this.setValue(monthOptions[e].label, 'complete_month', i)
                                                }}
                                                allowClear
                                            >
                                                {monthOptions.map((keyName, index) => {
                                                    let disabled = false
                                                    if (i === 1 && obj1.start_year === obj1.complete_year) {
                                                        let startMonthIndex = monthOptions.findIndex((el) => obj1.start_month == el.label)
                                                        if (startMonthIndex < index) {
                                                            disabled = true;
                                                        }
                                                    } else if (i === 2 && obj2.start_year === obj2.complete_year) {
                                                        let startMonthIndex = monthOptions.findIndex((el) => obj2.start_month == el.label)
                                                        if (startMonthIndex < index) {
                                                            disabled = true;
                                                        }
                                                    }
                                                    return (
                                                        <Option disabled={disabled} key={index} value={keyName.value}>{keyName.label}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name={`complete_year${i}`}
                                            noStyle
                                            rules={[required('Complete Year')]}
                                        >
                                            <DatePicker
                                                disabledDate={(current) =>
                                                    current && current < moment(i === 1 ? this.state.obj1.start_year : this.state.obj2.start_year, 'YYYY')
                                                }
                                                onChange={(e) => {
                                                    this.setValue(moment(e).format('YYYY'), 'complete_year', i)
                                                }}
                                                picker='year' />

                                        </Form.Item>
                                    </Input.Group>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={28}>
                        <Col span={24}>
                            <div className='ant-form-item-label pb-4'>
                                <label>Description</label>
                            </div>
                            <Paragraph className='fs-14'>Describe your position and any significant accomplishments.</Paragraph>
                            <Form.Item
                                //label='Description'
                                name={`description${i}`}
                                // onChange={(e) => {
                                //     
                                //     this.setValue(e.target.value, 'description', i)
                                // }}
                                rules={[required('Description')]}
                            >
                                {/* <ReactQuill
                                    name= {`hightlight${i}`}
                                    theme='snow'
                                    ref='comment'
                                    // onChange={(e) => this.handleEditorValue(e,i)}
                                    onChange={this.handleEditorValue}
                                    // value={editorValue}
                                    value={this.state.editorValue || ''}
                                /> */}
                                {/* <ReactQuill
                                name='editor'
                                theme={'snow'}
                                ref='comment'
                                onChange={this.handleEditorValue}
                                value={this.state.editorValue}
                                // modules={quillModules}
                                placeholder='add the discussion background (optional)'
                            /> */}
                                <BraftEditor
                                    value={this.state.editorState1}
                                    controls={controls}
                                    onChange={(e) => this.handleEditorChange(e, i)}
                                    // onSave={this.submitContent}
                                    contentStyle={{ height: 150 }}
                                    className={'input-editor'}
                                />
                                {/* <TextArea
                                    placeholder='Type here'
                                    className={'input-editor'}
                                /> */}
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                {i == 1 && <div className={`add-more-section shadow mt-20 ${showOtherModule ? 'active' : ''}`}>
                    <Row gutter={28}>
                        {showOtherModule ? <Button type='link' onClick={() => {
                            this.setState({ showOtherModule: false })
                        }}><Icon icon='minus-circle' size='20' /> Hide</Button> : <Button type='link' onClick={() => {
                            this.setState({ showOtherModule: true })
                        }}><Icon icon='add-circle' size='20' /> Add more</Button>}
                    </Row>
                </div>}
            </Fragment>
        )
    }


    /**
     * @method render
     * @description render component  
     */
    render() {
        const { showOtherModule } = this.state;
        return (
            <div className='card-container'>
                <Tabs type='card' className='workexperience-tab'>
                    <TabPane tab='Work Experience' key='2' >
                        <div>
                            <Form
                                onFinish={this.onFinish}
                                layout={'vertical'}
                                ref={this.formRef}
                                initialValues={this.getInitialValue()}
                            >
                                {this.renderFormModule(1)}

                                {showOtherModule && this.renderFormModule(2)}

                                <div className='steps-action align-center mb-32'>
                                    <Button htmlType='submit' type='primary' size='middle'
                                        className='btn-blue'
                                    >
                                        NEXT
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, profile, classifieds } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
        resumeDetails: classifieds.resumeDetails !== null ? classifieds.resumeDetails : ''
    };
};
export default connect(
    mapStateToProps, null
)(WorkExperience);