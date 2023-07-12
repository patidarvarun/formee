import React, { Fragment } from 'react';
import { Button, Row, Select, Typography, DatePicker } from 'antd';
import Icon from '../../../../components/customIcons/customIcons';
import { Form, Input, Col, Tabs } from 'antd';
import { connect } from 'react-redux';
import { required } from '../../../../config/FormValidation'
import moment from 'moment'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { convertHTMLToText } from '../../../common'

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
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
            showOtherModule: false,
            editorValue: '',
            startYear: '',
            endYear: '',
            startMonth: '',
            endMonth: '',
            editorState1: this.props.resumeDetails && this.props.resumeDetails.education[0] ? BraftEditor.createEditorState(this.props.resumeDetails.education[0].highlight) : BraftEditor.createEditorState(''),
            editorState2: this.props.resumeDetails && this.props.resumeDetails.education[1] ? BraftEditor.createEditorState(this.props.resumeDetails.education[1].highlight) : BraftEditor.createEditorState(''),
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
            monthOptions: [{ id: 0, label: 'January' }, { id: 1, label: 'Februry' }, { id: 2, label: 'March' }, { id: 3, label: 'April' },
            { id: 4, label: 'May' }, { id: 5, label: 'June' }, { id: 6, label: 'July' }, { id: 7, label: 'Agust' }, { id: 8, label: 'September' }, { id: 9, label: 'October' }, { id: 10, label: 'November' }, { id: 11, label: 'December' }]
        };
    }

    /**
    * @method componentDidMount
    * @description called before mounting the component
    */
    componentDidMount() {
        if (this.props.resumeDetails) {
            const { editorState1, editorState2 } = this.state
            let firstObj = this.props.resumeDetails.education[0];
            let secondObj = this.props.resumeDetails.education[1]
            let ob1, ob2;
            if (firstObj !== undefined) {
                ob1 = {
                    institution: firstObj.institution,
                    course: firstObj.course,
                    level_of_qualification: firstObj.level_of_qualification,
                    // highlight: firstObj.highlight,
                    highlight: editorState1,
                    finished_from_month: firstObj.finished_from_month,
                    finished_to_month: firstObj.finished_to_month,
                    finished_from_year: firstObj.finished_from_year,
                    finished_to_year: firstObj.finished_to_year
                }
            }
            if (secondObj !== undefined) {
                ob2 = {
                    institution: secondObj.institution,
                    course: secondObj.course,
                    level_of_qualification: secondObj.level_of_qualification,
                    // highlight: secondObj.highlight,
                    highlight: editorState2,
                    finished_from_month: secondObj.finished_from_month,
                    finished_to_month: secondObj.finished_to_month,
                    finished_from_year: secondObj.finished_from_year,
                    finished_to_year: secondObj.finished_to_year,
                }
            }
            this.setState({
                obj1: firstObj == undefined ? { ...this.state.obj1 } : { ...ob1 },
                obj2: secondObj == undefined ? { ...this.state.obj2 } : { ...ob2 },
                showOtherModule: secondObj == undefined ? false : true
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
        obj1.highlight = this.state.editorState1.toHTML()
        obj2.highlight = this.state.editorState2.toHTML()
        
        
        let reqData = [];
        const isEmpty1 = Object.values(obj1).every(x => (x === null || x === ''));
        const isEmpty2 = Object.values(obj2).every(x => (x === null || x === ''));
        !isEmpty1 && reqData.push(obj1)
        !isEmpty2 && reqData.push(obj2)
        
        this.props.next(reqData, 3)
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


    /** 
     * @method getInitialValue
     * @description returns Initial Value to set on its Fields 
     */
    getInitialValue = () => {
        if (this.props.resumeDetails) {
            let firstObj = this.props.resumeDetails.education[0]
            let secondObj = this.props.resumeDetails.education[1]
            const { editorState1, editorState2 } = this.state
            let temp = {}

            if (firstObj !== undefined) {
                temp.institution1 = firstObj.institution
                temp.level_of_qualification1 = firstObj.level_of_qualification
                temp.course1 = firstObj.course
                // temp.highlight1 = firstObj.highlight,
                temp.highlight1 = editorState1
                temp.finished_from_month1 = firstObj.finished_from_month
                temp.finished_to_month1 = firstObj.finished_to_month
                temp.finished_from_year1 = moment(firstObj.finished_from_year, 'YYYY')
                temp.finished_to_year1 = moment(firstObj.finished_to_year, 'YYYY')
            }
            if (secondObj !== undefined) {
                temp.institution2 = secondObj.institution
                temp.level_of_qualification2 = secondObj.level_of_qualification
                temp.course2 = secondObj.course
                // temp.highlight2 = secondObj.highlight
                temp.highlight2 = editorState2
                temp.finished_from_month2 = secondObj.finished_from_month
                temp.finished_to_month2 = secondObj.finished_to_month
                temp.finished_from_year2 = moment(secondObj.finished_from_year, 'YYYY')
                temp.finished_to_year2 = moment(secondObj.finished_to_year, 'YYYY')
            }
            return temp;

        }
    }

    renderFormModule = (i) => {
        const controls = ['bold', 'italic', 'underline', 'separator']
        const { editorValue, obj1, obj2, monthOptions } = this.state;
        return (
            <Fragment>
                <div className='inner-content shadow'>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item
                                label='Institution'
                                name={`institution${i}`}
                                rules={[required('Intitution')]}
                                onChange={(e) => {
                                    this.setValue(e.target.value, 'institution', i)
                                }}                            >
                                <Input placeholder="Enter Institution" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={28}>
                        <Col span={24}>
                            <Form.Item
                                label='Course & Qualification'
                                name={`course${i}`}
                                rules={[required('Course & Qualification')]}
                                onChange={(e) => {
                                    this.setValue(e.target.value, 'course', i)
                                }}
                            // rules={[required('Course & Qualification')]}
                            >
                                <Input placeholder="Enter Course or Qualification" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={28}>
                        <Col span={24}>
                            <Form.Item
                                label='Level of Qualification'
                                name={`level_of_qualification${i}`}
                                rules={[required('Level of Qualification')]}
                                onChange={(e) => {
                                    this.setValue(e.target.value, 'level_of_qualification', i)
                                }}
                            // rules={[required('Level of Qualification')]}
                            >
                                <Input placeholder="Enter Level of Qualification" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={28}>
                        <Col span={24}>
                            <Form.Item
                                label='Finished'
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Input.Group compact>
                                        <Form.Item
                                            name={`finished_from_month${i}`}
                                            noStyle
                                            rules={[required('Start Month')]}
                                        >
                                            {/* <DatePicker picker='month' bordered={true} /> */}
                                            <Select
                                                placeholder='Month'
                                                size='large'
                                                onChange={(e) => {
                                                    monthOptions[e].label !== undefined && this.setValue(monthOptions[e].label, 'finished_from_month', i)
                                                    if (i === 1 ? ((obj1.finished_from_year >= obj1.finished_to_year) && (obj1.finished_from_year !== '' && obj1.finished_to_month !== '')) : ((obj2.finished_from_year >= obj2.finished_to_month) && (obj2.finished_from_year !== '' && obj2.finished_to_month !== ''))) {
                                                        this.formRef.current.setFieldsValue({
                                                            [`finished_to_month${i}`]: ''
                                                        });
                                                    }
                                                }}
                                                allowClear
                                            >
                                                {this.state.monthOptions.map((keyName, i) => {
                                                    return (
                                                        <Option key={i} value={keyName.value}>{keyName.label}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name={`finished_from_year${i}`}
                                            noStyle
                                            rules={[required('Start Year')]}
                                        >
                                            <DatePicker
                                                placeholder='Year'
                                                onChange={(e) => {
                                                    this.setValue(moment(e).format('YYYY'), 'finished_from_year', i)
                                                    if (i === 1 ? (obj1.finished_from_year >= obj1.finished_to_year) : (obj2.start_year >= obj2.complete_year)) {
                                                        this.formRef.current.setFieldsValue({
                                                            [`finished_to_year${i}`]: ''
                                                        });
                                                    }
                                                }
                                                } picker='year' />
                                        </Form.Item>
                                    </Input.Group>
                                    <Text className='pl-10 pr-10'>To</Text>
                                    <Input.Group compact>
                                        <Form.Item
                                            name={`finished_to_month${i}`}
                                            noStyle
                                            rules={[required('Complete Month')]}
                                        >
                                            {/* <DatePicker onChange={this.onChange} picker='month' /> */}
                                            <Select
                                                placeholder='Month'
                                                size='large'
                                                onChange={(e) => {
                                                    monthOptions[e] !== undefined && this.setValue(monthOptions[e].label, 'finished_to_month', i)
                                                }}
                                                allowClear
                                            >
                                                {monthOptions.map((keyName, index) => {
                                                    let disabled = false
                                                    if (i === 1 && obj1.finished_from_year === obj1.finished_to_year) {
                                                        let startMonthIndex = monthOptions.findIndex((el) => obj1.finished_from_month == el.label)
                                                        if (startMonthIndex < index) {
                                                            disabled = true;
                                                        }
                                                    } else if (i === 2 && obj2.start_year === obj2.complete_year) {
                                                        let startMonthIndex = monthOptions.findIndex((el) => obj2.finished_from_month == el.label)
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
                                            name={`finished_to_year${i}`}
                                            noStyle
                                            rules={[required('Complete Year')]}
                                        >
                                            <DatePicker
                                                placeholder='Year'
                                                disabledDate={(current) =>
                                                    current && current < moment(i === 1 ? this.state.obj1.finished_from_year : this.state.obj2.finished_from_year, 'YYYY')
                                                }
                                                onChange={(e) => {
                                                    this.setValue(moment(e).format('YYYY'), 'finished_to_year', i)
                                                }} picker='year' />
                                        </Form.Item>
                                    </Input.Group>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* <Row gutter={28}>
                        <Col span={12} style={{ height: 70 }}>
                            <Form.Item
                                label='Course Highlight'
                                name={`highlight${i}`}
                                // rules={[required('Course Highlight')]}
                            >
                                <ReactQuill theme='snow' />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    <Row gutter={28}>
                        <Col span={24}>
                            <div className='ant-form-item-label pb-4'>
                                <label className='ant-form-item-required'>Course Highlight</label>
                            </div>
                            <Paragraph className='fs-14'> Add activities, honours, awards or specialities achieved during your study.</Paragraph>
                            <Form.Item
                                //label='Course Highlight'
                                name={`highlight${i}`}
                                onChange={(e) => {
                                    this.setValue(e.target.value, 'highlight', i)
                                }}
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
                </div>
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
                                initialValues={this.getInitialValue()}
                            >
                                {this.renderFormModule(1)}
                                <div className={`add-more-section shadow mt-20 ${showOtherModule ? 'active' : ''}`}>
                                    <Row gutter={28}>
                                        {showOtherModule ? <Button type='link' onClick={() => {
                                            this.setState({ showOtherModule: false })
                                        }}><Icon icon='minus-circle' size='20' /> Hide</Button> : <Button type='link' onClick={() => {
                                            this.setState({ showOtherModule: true })
                                        }}><Icon icon='add-circle' size='20' /> Add more</Button>}
                                    </Row>
                                </div>
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