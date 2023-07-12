import React, { Fragment } from 'react';
import { Button, Select, Tabs, Checkbox, Collapse, DatePicker, Row, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import Icon from '../../../../components/customIcons/customIcons';
import { Form, Input, Col } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { required } from '../../../../config/FormValidation'
import 'react-quill/dist/quill.snow.css';
import moment from 'moment'
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
// import ReactQuill from 'react-quill';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { convertHTMLToText } from '../../../common'

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
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
      editorValue: '',
      showOtherModule: false,
      defaultCheck1: false,
      defaultCheck2: false,
      activePanel: 1,
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

      monthOptions: [{ id: 0, label: 'January' }, { id: 1, label: 'February' }, { id: 2, label: 'March' }, { id: 3, label: 'April' },
      { id: 4, label: 'May' }, { id: 5, label: 'June' }, { id: 6, label: 'July' }, { id: 7, label: 'August' }, { id: 8, label: 'September' }, { id: 9, label: 'October' }, { id: 10, label: 'November' }, { id: 11, label: 'December' }]
    };
    // this.handleEditorValue = this.handleEditorValue.bind(this);

  }

  /**
  * @method componentDidMount
  * @description called before mounting the component
  */
  componentDidMount() {
    const { resumeDetails } = this.props;
    console.log('resumeDetails: ', resumeDetails);
    if (resumeDetails && this.formRef.current) {
      let currentField = this.formRef.current.getFieldsValue()
      currentField.experience = resumeDetails.work_experience.map((el, index) => {
        el = resumeDetails.work_experience[index]
        el.description = BraftEditor.createEditorState(resumeDetails.work_experience[index].description)
        el.start_month_index = el.start_month ? el.start_month : ''
        // el.complete_month_index = el.complete_month   
        // el.complete_year_moment = moment(el.complete_year)
        el.complete_month_index = el.complete_month ? el.complete_month : undefined
        el.complete_year_moment = (el.complete_year && el.complete_year !== 'Invalid date') ? moment(el.complete_year) : ''
        el.start_year_moment = (el.start_year && el.start_year !== 'Invalid date') ? moment(el.start_year) : ''
        return el
      })
      // currentField.experience = temp
      this.formRef.current.setFieldsValue({ ...currentField })
      console.log('currentField: ', currentField);
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
    console.log('values: ', values);
    let finalReqBody = []
    values.experience.map((el, index) => {
      finalReqBody[index] = {
        city: el.city,
        company: el.company,
        complete_month: el.complete_month && el.complete_month !== undefined ? el.complete_month : '',
        complete_year: el.complete_year ? el.complete_year : '',
        currently_working: el.currently_working,
        description: el.description.toHTML(),
        job_title: el.job_title,
        start_month: el.start_month,
        start_year: el.start_year,
      }
    })
    console.log('finalReqBody: ', finalReqBody);
    this.props.next(finalReqBody, 2)

  }

  handleEditorValue = (html) => {
    let htmlToText = convertHTMLToText(html)
    // this.setValue(html, 'description', i)
    console.log('htmlToText', html, htmlToText.props.children)
    this.setState({ editorValue: htmlToText })
  }

  /**
   * @method handleEditorChange
   * @description handle editor text value change
   */
  handleEditorChange = (editorState, i) => {
    if (i === 1) {
      this.setState({ editorState1: editorState })
      console.log('editorState', this.state.editorState1)
    } else if (i === 2) {
      this.setState({ editorState2: editorState })
      console.log('editorState', this.state.editorState2)
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
  // getInitialValue = () => {
  //     const { editorState1, editorState2 } = this.state
  //     if (this.props.resumeDetails) {
  //         let firstObj = this.props.resumeDetails.work_experience[0]
  //         let secondObj = this.props.resumeDetails.work_experience[1]

  //         let temp = {}
  //         if (firstObj !== undefined) {
  //             temp.job_title1 = firstObj.job_title
  //             temp.company1 = firstObj.company
  //             temp.city1 = firstObj.city
  //             // temp.description1 = firstObj.description
  //             temp.description1 = editorState1
  //             temp.start_month1 = firstObj.start_month
  //             temp.complete_month1 = firstObj.complete_month
  //             temp.start_year1 = moment(firstObj.start_year, 'YYYY')
  //             temp.complete_year1 = moment(firstObj.complete_year, 'YYYY')
  //         }
  //         if (secondObj !== undefined) {
  //             temp.job_title2 = secondObj.job_title
  //             temp.company2 = secondObj.company
  //             temp.city2 = secondObj.city
  //             // temp.description2 = secondObj.description
  //             temp.description2 = editorState2
  //             temp.start_month2 = secondObj.start_month
  //             temp.complete_month2 = secondObj.complete_month
  //             temp.start_year2 = moment(secondObj.start_year, 'YYYY')
  //             temp.complete_year2 = moment(secondObj.complete_year, 'YYYY')
  //         }
  //         return temp;
  //     }
  // }

  genExtra = (field, remove) => {
    return field.key !== 0 ?
      (<DeleteOutlined
        style={{ color: '#ff0000' }}
        onClick={event => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
          let currentField = this.formRef.current.getFieldsValue()
          console.log('currentField: ', currentField);
          let temp = currentField.experience.filter((el, i) => i !== field.name)
          //   this.formRef.current.setFieldsValue({ ...temp })
          remove(field.fieldKey)
          console.log(temp, '>>> field: >>> ', field);
          this.setState({ activePanel: 1 })

        }}
      />
      ) : ''
  }

  renderFormModule = (i) => {
    const controls = ['bold', 'italic', 'underline', 'separator']
    const { showOtherModule, activePanel, obj1, obj2, monthOptions, defaultCheck1, defaultCheck2 } = this.state
    // let currentField = this.formRef.current.getFieldsValue()
    return (
      <Fragment>
        <Form.List name='experience'>
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
                    // header={`Experience ${field.name + 1}`}
                    header={`Experience`}
                    extra={this.genExtra(field, remove)}
                  >
                    <Row gutter={12}>
                      <Col span={24}>
                        <Form.Item
                          label='Job Title'
                          name={[field.name, 'job_title']}
                          fieldKey={[field.fieldKey, 'job_title']}
                          rules={[required('Job Title')]}
                        >
                          <Input placeholder='Enter Your Job Title' />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={28}>
                      <Col span={24}>
                        <Form.Item
                          label='Company'
                          name={[field.name, 'company']}
                          fieldKey={[field.fieldKey, 'company']}
                          rules={[required('Company')]}
                        >
                          <Input placeholder='Enter Company' />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={28}>
                      <Col span={24}>
                        <Form.Item
                          label='City (e.g. Sydney)'
                          name={[field.name, 'city']}
                          fieldKey={[field.fieldKey, 'city']}
                          rules={[required('City')]}
                        >
                          <Input placeholder='Enter City' />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={28}>
                      <Col span={24}>
                        <Form.Item
                          label='Time Period'
                          name={[field.name, 'currently_working']}
                          fieldKey={[field.fieldKey, 'currently_working']}
                        >
                          <div className='mb-15'>
                            {this.formRef.current && console.log('this.formRef >>> ', this.formRef.current.getFieldsValue().experience)}

                            <Checkbox checked={
                              this.formRef.current && this.formRef.current.getFieldsValue().experience[field.name] && this.formRef.current.getFieldsValue().experience[field.name].currently_working !== undefined ? this.formRef.current.getFieldsValue().experience[field.name].currently_working : false
                            }
                              onChange={(e) => {
                                let currentField = this.formRef.current.getFieldsValue()
                                currentField.experience[field.key].currently_working = e.target.checked
                                if (e.target.checked) {
                                  currentField.experience[field.key].complete_month = null
                                  currentField.experience[field.key].complete_month_index = undefined
                                  currentField.experience[field.key].complete_year = ''
                                  currentField.experience[field.key].complete_year_moment = ''
                                }
                                this.formRef.current.setFieldsValue({ ...currentField })

                              }}> I currently work here</Checkbox>
                            {this.formRef.current && console.log('>>>', this.formRef.current.getFieldsValue().experience[field.fieldKey].currently_working)}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input.Group compact>
                              <Form.Item
                                name={[field.name, 'start_month_index']}
                                fieldKey={[field.fieldKey, 'start_month_index']}
                                noStyle
                                rules={[required('Start Month')]}
                              >
                                <Select
                                  placeholder='Month'
                                  size='large'
                                  allowClear
                                  onChange={(e) => {
                                    let currentField = this.formRef.current.getFieldsValue()
                                    if (e !== undefined) {
                                      console.log('currentField[field.key].start_date: ', currentField.experience[field.key].start_month);
                                      currentField.experience[field.key].start_month = monthOptions[e].label
                                    }

                                    //If Both year are same then clar compelet month
                                    let startYear = currentField.experience[field.key].start_year
                                    let completeYear = currentField.experience[field.key].complete_year
                                    currentField.experience[field.key].complete_year = ''
                                    currentField.experience[field.key].complete_month_index = ''

                                    if (startYear && completeYear && startYear === completeYear) {
                                      currentField.experience[field.key].complete_month = monthOptions[11].label;
                                      currentField.experience[field.key].complete_month_index = monthOptions[11].label
                                      console.log(startYear, 'completeYear: ', completeYear);
                                    }
                                    this.formRef.current.setFieldsValue({ ...currentField })

                                  }}
                                >
                                  {monthOptions.map((keyName, index) => {
                                    console.log('this.formRef.current', this.formRef.current)
                                    let disabled = false
                                    let d = new Date();
                                    let currentMonth = d.getMonth();
                                    let currentYear = d.getFullYear()
                                    if (this.formRef.current) {
                                      let currentField = this.formRef.current.getFieldsValue()
                                      let startYear = currentField.experience[field.key].start_year
                                      console.log('startYear', startYear, currentYear)
                                      if (startYear === undefined || startYear == '') {
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
                                name={[field.name, 'start_year_moment']}
                                fieldKey={[field.fieldKey, 'start_year_moment']}
                                noStyle
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
                                      console.log(e, 'currentField[field.key].start_date: ', currentField.experience[field.key].start_month);
                                      let startDate = moment(e).format('YYYY');
                                      console.log('startDate: ', startDate);
                                      currentField.experience[field.key].start_year = startDate
                                      currentField.experience[field.key].complete_year = ''
                                      currentField.experience[field.key].complete_year_moment = ''
                                      this.formRef.current.setFieldsValue({ ...currentField })
                                    }
                                  }}
                                  picker='year' />
                              </Form.Item>
                            </Input.Group>
                            <Text className='pl-10 pr-10'>To</Text>
                            <Input.Group compact>
                              <Form.Item
                                name={[field.name, 'complete_month_index']}
                                fieldKey={[field.fieldKey, 'complete_month_index']}
                                noStyle
                                rules={[{ required: (this.formRef.current && this.formRef.current.getFieldsValue().experience[field.fieldKey].currently_working) ? false : true, message: 'Complete month is required' }]}
                              >
                                <Select
                                  placeholder='Month'
                                  size='large'
                                  disabled={this.formRef.current && this.formRef.current.getFieldsValue().experience[field.fieldKey].currently_working ? true : false}
                                  onChange={(e) => {
                                    let currentField = this.formRef.current.getFieldsValue()
                                    if (e !== undefined) {
                                      console.log('currentField[field.key].start_date: ', currentField.experience[field.key].start_month);
                                      currentField.experience[field.key].complete_month = monthOptions[e].label
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
                                      let complete_year = currentField.experience[field.key].complete_year
                                      if (currentField.experience[field.key] && currentField.experience[field.key].start_year !== undefined && currentField.experience[field.key].complete_year !== undefined) {
                                        let startYear = currentField.experience[field.key].start_year
                                        let completeYear = currentField.experience[field.key].complete_year
                                        // if (startYear && completeYear && startYear === completeYear) {
                                        //   let startMonthIndex = currentField.experience[field.key].start_month_index
                                        //   if (startMonthIndex < index) {
                                        //     disabled = true;
                                        //   }
                                        // }
                                        let startMonthIndex = currentField.experience[field.key].start_month_index
                                        if (completeYear === undefined || completeYear == '' || completeYear == currentYear) {
                                          if (currentMonth < index || startMonthIndex > index) {
                                            disabled = true;
                                          }
                                        } else {
                                          if (startMonthIndex < index) {
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
                                name={[field.name, 'complete_year_moment']}
                                fieldKey={[field.fieldKey, 'complete_year_moment']}
                                noStyle
                                rules={[{ required: (this.formRef.current && this.formRef.current.getFieldsValue().experience[field.fieldKey].currently_working) ? false : true, message: 'Complete year is required' }]}
                              // rules={(this.formRef.current && this.formRef.current.getFieldsValue().experience[field.fieldKey].currently_working) && [required('Complete Year')]}
                              >
                                <DatePicker
                                  placeholder='Year'
                                  disabled={this.formRef.current && this.formRef.current.getFieldsValue().experience[field.fieldKey].currently_working ? true : false}
                                  disabledDate={(current) => {
                                    let currentField = this.formRef.current.getFieldsValue()
                                    let startYear = currentField.experience[field.fieldKey].start_year
                                    // let temp = moment(current.valueOf()).format('YYYY') < startYear

                                    //As per client comment - user not able to select past date
                                    let temp = moment(current.valueOf()).format('YYYY') <  moment().format('YYYY');                                   
                                    return current && (current.valueOf() > Date.now() || temp)
                                  }}
                                  onChange={(e) => {
                                    let currentField = this.formRef.current.getFieldsValue()
                                    if (e !== undefined) {
                                      console.log(e, 'currentField[field.key].start_date: ', currentField.experience[field.key].start_month);
                                      let completeDate = moment(e).format('YYYY');
                                      currentField.experience[field.key].complete_year = completeDate
                                      this.formRef.current.setFieldsValue({ ...currentField })
                                    }
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
                          name={[field.name, 'description']}
                          fieldKey={[field.fieldKey, 'description']}
                          // onChange={(e) => {
                          //     console.log('e.target.value',e.target.value )
                          //     this.setValue(e.target.value, 'description', i)
                          // }}
                          rules={[required('Description')]}
                        >

                          <BraftEditor
                            placeholder='Type here'
                            value={this.state.editorState1}
                            controls={controls}
                            onChange={(e) => this.handleEditorChange(e, i)}
                            // onSave={this.submitContent}
                            contentStyle={{ height: 150 }}
                            className={'input-editor'}
                            language='en'
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={0} justify='start'>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item style={{ paddingBottom: '30px' }} className='add-card-link-mb-0'>
                          <Button
                            type='primary'
                            className='add-btn'
                            onClick={() => {
                              let currentField = this.formRef.current.getFieldsValue()
                              this.setState({ activePanel: currentField.experience.length + 1 })
                              if (currentField.experience.length >= 10) {
                                toastr.warning(langs.warning, langs.messages.experience_length_warning)
                              } else {
                                add({ currently_working: false })
                              }
                            }}
                          >
                            Add
                        </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* {field.key !== 0 && <Col flex='none' className='workexp-remove'>
                      <MinusCircleOutlined
                        className='dynamic-delete-button'
                        onClick={() => {
                          let currentField = this.formRef.current.getFieldsValue()
                          console.log('currentField: ', currentField);
                          let temp = currentField.experience.filter((el, i) => i !== field.name)
                          //   this.formRef.current.setFieldsValue({ ...temp })
                          remove(field.fieldKey)
                          console.log(temp, '>>> field: >>> ', field);
                          this.setState({ activePanel: 1 })
                        }}
                      />
                    </Col>} */}

                  </Panel>
                ))}
              </Collapse>
            </div>
          }}
        </Form.List>

        {/* {i == 1 && <div className={`add-more-section shadow mt-20 ${showOtherModule ? 'active' : ''}`}>
                    <Row gutter={28}>
                        {showOtherModule ? <Button type='link' onClick={() => {
                            this.setState({ showOtherModule: false })
                        }}><Icon icon='minus-circle' size='20' /> Hide</Button> : <Button type='link' onClick={() => {
                            this.setState({ showOtherModule: true })
                        }}><Icon icon='add-circle' size='20' /> Add more</Button>}
                    </Row>
                </div>}
            */}

      </Fragment >
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
                initialValues={{
                  name: 'experience',
                  experience: [{ currently_working: false }],
                }}
              >
                {this.renderFormModule(1)}

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
