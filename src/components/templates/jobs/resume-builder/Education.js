import React, { Fragment } from 'react';
import { Button, Row, Select, Typography, DatePicker, Collapse } from 'antd';
import Icon from '../../../../components/customIcons/customIcons';
import { Form, Input, Col, Tabs } from 'antd';
import { connect } from 'react-redux';
import { required } from '../../../../config/FormValidation'
import moment from 'moment'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import ReactQuill from 'react-quill';
import { MinusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import 'react-quill/dist/quill.snow.css';
import { convertHTMLToText } from '../../../common'

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Panel } = Collapse;

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
            showOtherModule: false,
            editorValue: '',
            startYear: '',
            endYear: '',
            startMonth: '',
            endMonth: '',
            editorState1: this.props.resumeDetails && this.props.resumeDetails.education[0] ? BraftEditor.createEditorState(this.props.resumeDetails.education[0].highlight) : BraftEditor.createEditorState(''),
            editorState2: this.props.resumeDetails && this.props.resumeDetails.education[1] ? BraftEditor.createEditorState(this.props.resumeDetails.education[1].highlight) : BraftEditor.createEditorState(''),
            activePanel: 1,
            obj1: {
                institution: '',
                course: '',
                level_of_qualification: '',
                highlight: '',
                finished_from_month: '',
                finished_to_month: '',
                finished_from_year: '',
                finished_to_year: ''
            },
            obj2: {
                institution: '',
                course: '',
                level_of_qualification: '',
                highlight: '',
                finished_from_month: '',
                finished_to_month: '',
                finished_from_year: '',
                finished_to_year: ''
            },
            monthOptions: [{ id: 0, label: 'January' }, { id: 1, label: 'February' }, { id: 2, label: 'March' }, { id: 3, label: 'April' },
            { id: 4, label: 'May' }, { id: 5, label: 'June' }, { id: 6, label: 'July' }, { id: 7, label: 'August' }, { id: 8, label: 'September' }, { id: 9, label: 'October' }, { id: 10, label: 'November' }, { id: 11, label: 'December' }]
        };
    }

    /**
    * @method componentDidMount
    * @description called before mounting the component
    */
    componentDidMount() {
        const { resumeDetails } = this.props;

        if (this.props.resumeDetails && this.formRef.current) {
            let currentField = this.formRef.current.getFieldsValue()
            currentField.education = currentField.education.map((el, index) => {
                el = resumeDetails.education[index]

                el.finished_from_month_index = el.finished_from_month ? el.finished_from_month : ''
                el.finished_from_year_moment = (el.finished_from_year && el.finished_from_year !== 'Invalid date') ? moment(el.finished_from_year) : ''
                el.finished_to_month_index = el.finished_to_month ? el.finished_to_month : ''
                el.finished_to_year_moment = (el.finished_to_year && el.finished_to_year !== 'Invalid date') ? moment(el.finished_to_year) : ''
                el.highlight = BraftEditor.createEditorState(resumeDetails.education[index].highlight)

                return el
            })
            // currentField.experience = temp
            this.formRef.current.setFieldsValue({ ...currentField })
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

        let finalReqBody = []
        values.education.map((el, index) => {
            finalReqBody[index] = {
                course: el.course,
                finished_from_month: el.finished_from_month ? el.finished_from_month : '',
                finished_from_year: el.finished_from_year ? el.finished_from_year : '',
                finished_to_month: el.finished_to_month ? el.finished_to_month : '',
                finished_to_year: el.finished_to_year ? el.finished_to_year : '',
                highlight: el.highlight.toHTML(),
                institution: el.institution,
                level_of_qualification: el.level_of_qualification
            }
        })

        this.props.next(finalReqBody, 3)
    }

    handleEditorValue = (html) => {
        let htmlToText = convertHTMLToText(html)

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

    genExtra = (field, remove) => {
        return field.key !== 0 ?
            (<DeleteOutlined
                style={{ color: "#ff0000" }}
                onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation();
                    let currentField = this.formRef.current.getFieldsValue()
                    console.log('currentField: ', currentField);
                    let temp = currentField.education.filter((el, i) => i !== field.name)
                    //   this.formRef.current.setFieldsValue({ ...temp })
                    remove(field.fieldKey)
                    console.log(temp, '>>> field: >>> ', field);
                    this.setState({ activePanel: 1 })

                }}
            />
            ) : ''
    }

    /** 
     * @method getInitialValue
     * @description returns Initial Value to set on its Fields 
     */
    // getInitialValue = () => {
    //     if (this.props.resumeDetails) {
    //         let firstObj = this.props.resumeDetails.education[0]
    //         let secondObj = this.props.resumeDetails.education[1]
    //         const { editorState1, editorState2 } = this.state
    //         let temp = {}

    //         if (firstObj !== undefined) {
    //             temp.institution1 = firstObj.institution
    //             temp.level_of_qualification1 = firstObj.level_of_qualification
    //             temp.course1 = firstObj.course
    //             // temp.highlight1 = firstObj.highlight,
    //             temp.highlight1 = editorState1
    //             temp.finished_from_month1 = firstObj.finished_from_month
    //             temp.finished_to_month1 = firstObj.finished_to_month
    //             temp.finished_from_year1 = moment(firstObj.finished_from_year, 'YYYY')
    //             temp.finished_to_year1 = moment(firstObj.finished_to_year, 'YYYY')
    //         }
    //         if (secondObj !== undefined) {
    //             temp.institution2 = secondObj.institution
    //             temp.level_of_qualification2 = secondObj.level_of_qualification
    //             temp.course2 = secondObj.course
    //             // temp.highlight2 = secondObj.highlight
    //             temp.highlight2 = editorState2
    //             temp.finished_from_month2 = secondObj.finished_from_month
    //             temp.finished_to_month2 = secondObj.finished_to_month
    //             temp.finished_from_year2 = moment(secondObj.finished_from_year, 'YYYY')
    //             temp.finished_to_year2 = moment(secondObj.finished_to_year, 'YYYY')
    //         }
    //         return temp;

    //     }
    // }

    renderFormModule = (i) => {
        const controls = ['bold', 'italic', 'underline', 'separator']
        const { obj1, obj2, monthOptions, activePanel } = this.state;
        return (
            <Fragment>
                <Form.List name="education">
                    {(fields, { add, remove }) => {
                        return <div className='inner-content shadow'>
                            <Collapse
                                // accordion 
                                activeKey={activePanel}
                                onChange={(e) => {
                                    if (e[e.length - 1] == undefined) {
                                        this.setState({ activePanel: 1 })
                                    } else {
                                        this.setState({ activePanel: (e[e.length - 1]) })
                                    }
                                }}
                            >
                                {fields.map((field, index) => (
                                    <Panel
                                        key={field.fieldKey + 1}
                                        //   header={`Eductaion ${field.name + 1}`}
                                        header={`Eductaion`}
                                        extra={this.genExtra(field, remove)}
                                    >
                                        <Row gutter={12}>
                                            <Col span={24}>
                                                <Form.Item
                                                    label='Institution'
                                                    // name={`institution${i}`}
                                                    name={[field.name, "institution"]}
                                                    fieldKey={[field.fieldKey, "institution"]}
                                                    rules={[required('Intitution')]}

                                                // onChange={(e) => {
                                                //     this.setValue(e.target.value, 'institution', i)
                                                // }}                        
                                                >
                                                    <Input placeholder="Enter Institution" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={28}>
                                            <Col span={24}>
                                                <Form.Item
                                                    label='Course & Qualification'
                                                    // name={`course${i}`}
                                                    name={[field.name, "course"]}
                                                    fieldKey={[field.fieldKey, "course"]}
                                                    rules={[required('Course & Qualification')]}

                                                >
                                                    <Input placeholder="Enter Course or Qualification" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={28}>
                                            <Col span={24}>
                                                <Form.Item
                                                    label='Level of Qualification'
                                                    name={[field.name, "level_of_qualification"]}
                                                    fieldKey={[field.fieldKey, "level_of_qualification"]}
                                                    rules={[required('Level of Qualification')]}
                                                >
                                                    <Input placeholder="Enter Level of Qualification" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={28}>
                                            <Col span={24}>
                                                <Form.Item
                                                    label='Duration'
                                                    className="duration-label"
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Input.Group compact>
                                                            <Form.Item
                                                                name={[field.name, "finished_from_month_index"]}
                                                                fieldKey={[field.fieldKey, "finished_from_month_index"]}
                                                                noStyle
                                                            //rules={[required('Start Month')]}
                                                            >
                                                                <Select
                                                                    placeholder='Month'
                                                                    size='large'
                                                                    onChange={(e) => {
                                                                        let currentField = this.formRef.current.getFieldsValue()
                                                                        if (e !== undefined) {
                                                                            currentField.education[field.key].finished_from_month = monthOptions[e].label
                                                                        }

                                                                        //If Both year are same then clar compelet month
                                                                        let startYear = currentField.education[field.key].finished_from_year
                                                                        let completeYear = currentField.education[field.key].finished_to_year
                                                                        currentField.education[field.key].finished_to_year = ''
                                                                        currentField.education[field.key].finished_to_month_index = ''

                                                                        if (startYear && completeYear && startYear === completeYear) {
                                                                            currentField.education[field.key].finished_to_month = monthOptions[11].label;
                                                                            currentField.education[field.key].finished_to_month_index = monthOptions[11].label

                                                                        }
                                                                        this.formRef.current.setFieldsValue({ ...currentField })

                                                                    }}
                                                                    allowClear
                                                                >

                                                                    {monthOptions.map((keyName, index) => {
                                                                        let disabled = false
                                                                        let d = new Date();
                                                                        let currentMonth = d.getMonth();
                                                                        let currentYear = d.getFullYear()
                                                                        if (this.formRef.current) {
                                                                            let currentField = this.formRef.current.getFieldsValue()
                                                                            console.log(field.key, 'currentField.education[field.key]: ', currentField.education[field.key]);
                                                                            let startYear = currentField.education[field.key] === undefined ? '' : currentField.education[field.key].finished_from_year

                                                                            if (startYear === undefined || startYear === '') {
                                                                                if (currentMonth < index) {
                                                                                    disabled = true;
                                                                                }
                                                                            } else if (startYear == currentYear) {
                                                                                if (currentMonth < index) {
                                                                                    disabled = true;
                                                                                }
                                                                            } else {
                                                                                disabled = false;
                                                                            }
                                                                        } else {
                                                                            if (currentMonth < index) {
                                                                                disabled = true;
                                                                            }
                                                                        }
                                                                        return (
                                                                            <Option disabled={disabled} key={index} value={keyName.value}>{keyName.label}</Option>
                                                                        )
                                                                    })}
                                                                    {/* {this.state.monthOptions.map((keyName, i) => {
                                                                        return (
                                                                            <Option key={i} value={keyName.value}>{keyName.label}</Option>
                                                                        )
                                                                    })} */}
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item
                                                                // name={`finished_from_year${i}`}
                                                                noStyle
                                                                name={[field.name, "finished_from_year_moment"]}
                                                                fieldKey={[field.fieldKey, "finished_from_year_moment"]}
                                                                rules={[required('Start Year')]}
                                                            >
                                                                <DatePicker
                                                                    placeholder='Year'
                                                                    disabledDate={(current) =>
                                                                        current && current.valueOf() > Date.now()
                                                                    }
                                                                    onChange={(e) => {
                                                                        let currentField = this.formRef.current.getFieldsValue()
                                                                        if (e !== undefined) {
                                                                            let startDate = moment(e).format('YYYY');
                                                                            currentField.education[field.key].finished_from_year = startDate
                                                                            currentField.education[field.key].finished_to_year = ''
                                                                            currentField.education[field.key].finished_to_year_moment = ''

                                                                            this.formRef.current.setFieldsValue({ ...currentField })
                                                                        }
                                                                    }}
                                                                    picker='year' />
                                                            </Form.Item>
                                                        </Input.Group>
                                                        <Text className='pl-10 pr-10'>To</Text>
                                                        <Input.Group compact>
                                                            <Form.Item
                                                                noStyle
                                                                name={[field.name, "finished_to_month_index"]}
                                                                fieldKey={[field.fieldKey, "finished_to_month_index"]}

                                                            // rules={[required('Complete Month')]}
                                                            >
                                                                <Select
                                                                    placeholder='Month'
                                                                    size='large'
                                                                    onChange={(e) => {
                                                                        let currentField = this.formRef.current.getFieldsValue()
                                                                        if (e !== undefined) {
                                                                            currentField.education[field.key].finished_to_month = monthOptions[e].label
                                                                            this.formRef.current.setFieldsValue({ ...currentField })
                                                                        }
                                                                    }}
                                                                    allowClear
                                                                >
                                                                    {monthOptions.map((keyName, index) => {
                                                                        let disabled = false
                                                                        let d = new Date();
                                                                        let currentMonth = d.getMonth();
                                                                        let currentYear = d.getFullYear()
                                                                        if (this.formRef.current) {
                                                                            let currentField = this.formRef.current.getFieldsValue()
                                                                            if (currentField.education[field.key] && currentField.education[field.key].finished_from_year !== undefined && currentField.education[field.key].finished_to_year !== undefined) {
                                                                                let startYear = currentField.education[field.key].finished_from_year
                                                                                let completeYear = currentField.education[field.key].finished_to_year
                                                                                console.log(Number(currentYear), 'completeYear: ', Number(completeYear));
                                                                                // if (startYear && completeYear && startYear === completeYear) {
                                                                                //     let startMonthIndex = currentField.education[field.key].finished_from_month_index
                                                                                //     if (startMonthIndex < index) {
                                                                                //         disabled = true;
                                                                                //     }
                                                                                // }
                                                                                let startMonthIndex = currentField.education[field.key].finished_from_month_index
                                                                                if (completeYear === undefined || completeYear == '' || Number(completeYear) == Number(currentYear)) {
                                                                                    if (currentMonth > index || startMonthIndex > index) {
                                                                                        disabled = true;
                                                                                    }
                                                                                } else {
                                                                                    if (startMonthIndex > index) {
                                                                                        disabled = true;
                                                                                    }
                                                                                }
                                                                            }
                                                                        } else {
                                                                            if (currentMonth < index) {
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
                                                                // name={`finished_to_year${i}`}
                                                                name={[field.name, "finished_to_year_moment"]}
                                                                fieldKey={[field.fieldKey, "finished_to_year_moment"]}
                                                                noStyle
                                                            // rules={[required('Complete Year')]}
                                                            >
                                                                <DatePicker
                                                                    placeholder='Year'
                                                                    disabledDate={(current) => {
                                                                        let currentField = this.formRef.current.getFieldsValue()
                                                                        let startYear = currentField.education[field.fieldKey].finished_from_year

                                                                        //As per client comment we have removed this check
                                                                        let temp = moment(current.valueOf()).format('YYYY') < startYear

                                                                        //As per client comment - user not able to select past date
                                                                        // let temp = moment(current.valueOf()).format('YYYY') < moment().format('YYYY');
                                                                        return current && (current.valueOf() > Date.now() || temp)
                                                                    }}
                                                                    onChange={(e) => {
                                                                        let currentField = this.formRef.current.getFieldsValue()
                                                                        if (e !== undefined) {
                                                                            let completeDate = moment(e).format('YYYY');
                                                                            currentField.education[field.key].finished_to_year = completeDate
                                                                            this.formRef.current.setFieldsValue({ ...currentField })
                                                                        }
                                                                    }} picker='year' />
                                                            </Form.Item>
                                                        </Input.Group>
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={28}>
                                            <Col span={24}>
                                                <div className='ant-form-item-label pb-4'>
                                                    <label className='ant-form-item-required'>Course Highlight</label>
                                                </div>
                                                <Paragraph className='fs-14'> Add activities, honours, awards or specialities achieved during your study.</Paragraph>
                                                <Form.Item
                                                    //label='Course Highlight'
                                                    // name={`highlight${i}`}
                                                    name={[field.name, "highlight"]}
                                                    fieldKey={[field.fieldKey, "highlight"]}
                                                    // onChange={(e) => {
                                                    //     this.setValue(e.target.value, 'highlight', i)
                                                    // }}
                                                    rules={[required('Course Highlight')]}
                                                >
                                                    {/* <ReactQuill
                                    name={`hightlight${i}`}
                                    theme='snow'
                                    ref='comment'
                                    onChange={this.handleEditorValue}
                                    // value={editorValue}
                                    value={this.state.editorValue || ''}

                                /> */}
                                                    <BraftEditor
                                                        placeholder="Type here"
                                                        value={i === 1 ? this.state.editorState1 : this.state.editorState2}
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

                                        <Row gutter={0}>
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Form.Item style={{ paddingBottom: "30px" }} className="add-card-link-mb-0">
                                                    <Button
                                                        type='primary'
                                                        className="add-btn"
                                                        onClick={() => {
                                                            let currentField = this.formRef.current.getFieldsValue()
                                                            this.setState({ activePanel: currentField.education.length + 1 })

                                                            if (currentField.education.length >= 5) {
                                                                toastr.warning(langs.warning, langs.messages.education_length_warning)
                                                            } else {
                                                                add()
                                                            }
                                                        }}
                                                    >
                                                        Add
                        </Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {/* {field.key !== 0 && <Col flex="none">
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                    remove(field.name)

                                                    this.setState({ activePanel: 1 })
                                                    // let currentField = myRef.current.getFieldsValue()
                                                }}
                                            />
                                        </Col>} */}
                                    </Panel>))}
                            </Collapse>
                        </div>
                    }}
                </Form.List>
            </Fragment>
        )
    }

    /**
     * @method render
     * @description render component  
     */
    render() {
        const { name } = this.props.userDetails;
        const { showOtherModule } = this.state;
        return (
            <div className='card-container'>
                <Tabs type='card' className='education-tab'>
                    <TabPane tab='Education' key='3'>
                        <div>
                            <Form
                                onFinish={this.onFinish}
                                layout={'vertical'}
                                ref={this.formRef}
                                // initialValues={this.getInitialValue()}
                                initialValues={{
                                    name: 'education',
                                    education: [{}],
                                }}
                            >
                                {this.renderFormModule(1)}
                                {/* <div className={`add-more-section shadow mt-20 ${showOtherModule ? 'active' : ''}`}>
                                    <Row gutter={28}>
                                        {showOtherModule ? <Button type='link' onClick={() => {
                                            this.setState({ showOtherModule: false })
                                        }}><Icon icon='minus-circle' size='20' /> Hide</Button> : <Button type='link' onClick={() => {
                                            this.setState({ showOtherModule: true })
                                        }}><Icon icon='add-circle' size='20' /> Add more</Button>}
                                    </Row>
                                </div> */}
                                {/* {showOtherModule && this.renderFormModule(2)} */}

                                <div className='steps-action align-center mb-32'>
                                    <Button htmlType='submit' type='primary' size='middle'
                                        className='btn-blue'
                                    >
                                        NEXT
                                    </Button>
                                </div>
                            </Form>
                        </div>

                        {/* </Fragment> */}
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