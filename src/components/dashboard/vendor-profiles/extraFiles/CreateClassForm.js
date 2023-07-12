import React, { useRef } from "react";
// import { Button, Form, Input, Table } from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import { required } from '../../../../config/FormValidation'
import { TimePicker, DatePicker, message, Divider, Card, Space, Typography, Button, Tabs, Table, Switch, Row, Col, Form, Select, Input, Upload } from 'antd';
import moment from 'moment';


function onChange(checked) {
  
};
function handleChange(value) {
  
}

const { Column } = Table;
const { Option } = Select;
const { Title, Text } = Typography;
const INITIAL_VALUES = {
  Monday: [{ start_time: '', end_time: '' }],
  Tuesday: [{ start_time: '', end_time: '' }],
  Wednesday: [{ start_time: '', end_time: '' }],
  Thursday: [{ start_time: '', end_time: '' }],
  Friday: [{ start_time: '', end_time: '' }],
  Saturday: [{ start_time: '', end_time: '' }],
  Sunday: [{ start_time: '', end_time: '' }]
}
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const CreateClassForm = (props) => {
  const [form] = Form.useForm();
  const myRef = useRef(null);

  const { fitnessPlan } = props;
  const onFinish = values => {
    
    let finalReqData = []
    values.classes.map((cl, i) => {
      let clas = {
        class_date: {},
        class_name: ''
      }
      Object.keys(cl).map(function (key, index) {
        let temp = []
        if (WEEKDAYS.includes(key)) {
          cl[key].map((d) => {
            let test = Object.keys(d).every((k) => d[k] == "")
            // 
            if (test == false) {
              temp.push(d)
              // class_date[key] = d
              // values.classes[0]['Monday']
            }
          })
        } else {
          clas[key] = cl[key]
        }
        if (temp.length) {
          clas.class_date[key] = temp
        }
        finalReqData[i] = clas

      })
      // }
    })

    

    // return
    props.createClass(finalReqData)
  };
  // const formRef = React.createRef();
  const format = 'HH:mm';
  const renderWeekdays = (field) => {
    return WEEKDAYS.map((d) => {
      return (
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item>
              <WeekDayForm text={d} fieldKey={field.key} />
            </Form.Item>
          </Col>
        </Row>

      )
    })
  }

  const WeekDayForm = props => {
    return (
      <>
        <Form.List name={[props.fieldKey, props.text]}>
          {(beds, { add, remove }) => {
            return (
              <div className="manage-calendar-row">


                {beds.map((bed, index) => (
                  <Space
                    key={bed.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    {/* {index == 0 &&  */}
                    <Text className="day">{props.text}</Text>
                    {/* // } */}
                    <div>
                      <Form.Item
                        {...bed}
                        name={[bed.name, "start_time"]}
                        fieldKey={[bed.fieldKey, "start_time"]}
                        key={index}

                      >

                        <TimePicker
                          defaultValue={moment('00:00', format)}
                          minuteStep={30}
                          format={format}
                          onChange={(e) => {
                            
                            form.setFieldsValue({
                              // ['classes[0].class_name']: 'dg',
                            });
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div className="dashed">-</div>
                    <div className="end-time">

                      <Form.Item
                        // name={"aar"}
                        {...bed}
                        name={[bed.name, "end_time"]}
                        fieldKey={[bed.fieldKey, "end_time"]}
                        key={index}
                      // noStyle
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Beds Missing"
                      //   }
                      // ]}
                      >

                        <TimePicker
                          defaultValue={moment('00:00', format)}
                          minuteStep={30}
                          format={format}
                        />
                      </Form.Item>
                    </div>
                    <Form.Item className="delete-icoon">
                      <div
                        onClick={() => {
                          add({ start_time: '', end_time: '' });
                        }}
                        className="add-icon"
                      >
                        <img src={require('../../../../assets/images/icons/addd.svg')} alt='add' />

                      </div>
                    </Form.Item>
                    <div onClick={() => {
                      remove(bed.name);
                    }} className="remove-icon"><img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' /></div>

                  </Space>
                ))}


              </div>
            );
          }}
        </Form.List>
      </>
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className='ant-upload-text'>Upload</div>
    </div>
  );

  /**
  * @method handleImageChange
  * @description handle image change
  */
  const handleImageChange = ({ file, fileList }) => {
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else if (fileList.length > 1) {
      message.error('You can upload only one image');
      return false
    } else {
      this.setState({ fileList });
    }
  }


  /**
  * @method dummyRequest
  * @description dummy image upload request
  */
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };


  return (
    <Form
      layout="vertical"
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
      ref={myRef}
      initialValues={{
        name: "user 1",
        classes: [{
          Monday: [{ start_time: '', end_time: '' }],
          Tuesday: [{ start_time: '', end_time: '' }],
          Wednesday: [{ start_time: '', end_time: '' }],
          Thursday: [{ start_time: '', end_time: '' }],
          Friday: [{ start_time: '', end_time: '' }],
          Saturday: [{ start_time: '', end_time: '' }],
          Sunday: [{ start_time: '', end_time: '' }],
          isOpenCalendar: false
        },
        ],
      }}
    >
      <Form.List name="classes">
        {(fields, { add, remove }) => {
          return (
            <div className="create-class-name">
              <Card
                className='profile-content-box'
                title=''
              >
                {fields.map(field => (
                  <div className="create-class-field">
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={3} xl={4}>
                        <Form.Item
                          name={[field.name, "image"]}
                          fieldKey={[field.fieldKey, "image"]}
                        >
                          <Upload
                            name='image'
                            listType='picture-card'
                            className='avatar-uploader'
                            showUploadList={true}
                            // fileList={fileList}
                            customRequest={dummyRequest}
                            onChange={handleImageChange}
                          >
                            {uploadButton}
                          </Upload>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={24} lg={21} xl={20}>
                        <Row >
                          <Col span={24}>
                            <Form.Item
                              label='Add Class Type'
                              // name='class_name1'
                              {...field}
                              name={[field.name, 'welbeing_fitness_type_id']}
                              fieldKey={[field.fieldKey, 'welbeing_fitness_type_id']}
                            >
                              <Select
                                placeholder='Select'
                                size='large'
                                // mode='multiple'
                                onChange={(e) => {
                                  
                                  // this.onCategoryChange(e)
                                }}
                                allowClear
                              >
                                {fitnessPlan &&
                                  fitnessPlan.map((keyName, i) => {
                                    return (
                                      <Option key={keyName.id} value={keyName.id}>{keyName.name}</Option>
                                    )
                                  })}

                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row >
                          <Col span={24}>
                            <Form.Item
                              label='Class Name'
                              name='class_name'
                              {...field}
                              name={[field.name, 'class_name']}
                              fieldKey={[field.fieldKey, 'class_name']}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row >
                          <Col span={24}>
                            <Form.Item
                              label='Instructor Name'
                              name='instructor_name'
                              {...field}
                              name={[field.name, 'instructor_name']}
                              fieldKey={[field.fieldKey, 'instructor_name']}
                            // rules={[required('Category')]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row >
                          <Col span={24}>
                            <Form.Item
                              label='Details'
                              name='description'
                              {...field}
                              name={[field.name, 'description']}
                              fieldKey={[field.fieldKey, 'description']}

                            // rules={[required('Category')]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={14}>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label='Room'
                              name='room'
                              {...field}
                              name={[field.name, 'room']}
                              fieldKey={[field.fieldKey, 'room']}

                            // rules={[required('Category')]}
                            >
                              <Input type={"number"} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label='Capacity'
                              name='capacity'
                              {...field}
                              name={[field.name, 'capacity']}
                              fieldKey={[field.fieldKey, 'capacity']}

                            // rules={[required('Category')]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={14}>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label='Price AUD'
                              name='capacity'
                              {...field}
                              name={[field.name, 'capacity']}
                              fieldKey={[field.fieldKey, 'capacity']}

                            // rules={[required('Category')]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label='Time'
                              name='time'
                              {...field}
                              name={[field.name, 'time']}
                              fieldKey={[field.fieldKey, 'time']}

                            // rules={[required('Category')]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={0} className="date-picker">
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} className="start-date">
                            <Form.Item
                              label='Duration'
                              name='start_date'
                              {...field}
                              name={[field.name, 'start_date']}
                              fieldKey={[field.fieldKey, 'start_date']}

                            // rules={[required('Category')]}
                            >
                              <DatePicker />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} className="end-date">
                            <Form.Item
                              label=''
                              name='end_date'
                              {...field}
                              name={[field.name, 'end_date']}
                              fieldKey={[field.fieldKey, 'end_date']}

                            // rules={[required('Category')]}
                            >
                              <DatePicker />
                            </Form.Item>
                          </Col>

                        </Row>

                        <div className="manage-calander">
                          <Divider />
                          <h3>Manage Calendar</h3>
                          <div className="manage-calander-content-block">
                            <div className="head fr-cr-pointer" onClick={(e) => {

                              let currentField = myRef.current.getFieldsValue()
                              
                              currentField.classes[field.fieldKey].isOpenCalendar = !currentField.classes[field.fieldKey].isOpenCalendar

                              // if (currentField.membership[field.fieldKey].available_from === undefined) {
                              //   toastr.error(langs.error, 'Please select Membership start date first.');
                              // } else {
                              //   let week = 7 * e
                              //   var firstDay = new Date(currentField.membership[field.fieldKey].available_from);
                              //   var nextWeek = new Date(firstDay.getTime() + week * 24 * 60 * 60 * 1000);
                              //   currentField.membership[0].available_to = moment(nextWeek)
                              myRef.current.setFieldsValue({ currentField })
                              // }
                            }}>
                              <div><img src={require('../../../../assets/images/icons/calendar.svg')} alt='calendar' /></div>
                              <div><h5>Set weekly schedules</h5></div>
                              <div><DownOutlined /></div>
                            </div>

                            {myRef.current && <div className="body-block">
                              <div className="start-end-time">
                                <div className="day">&nbsp;</div>
                                <div><label>Start time</label></div>
                                <div className="dashed">&nbsp;</div>
                                <div><label>End time</label></div>
                                <div style={{ width: "36px" }}>&nbsp;</div>
                              </div>
                              {myRef.current.getFieldsValue().classes[field.fieldKey].isOpenCalendar && renderWeekdays(field)}
                              {}
                            </div>}

                          </div>

                        </div>

                      </Col>
                    </Row>

                  </div>
                ))}
                <Form.Item>
                  <Button
                    className="add-btn"
                    onClick={() => {
                      add(INITIAL_VALUES);
                    }}
                    block
                  >Add
              </Button>
                </Form.Item>
                <div className="reformer-grid-block">
                  <table>

                    <tr>
                      <td><div className="thumb"></div></td>
                      <td>
                        <div className="title">Reformer Pilates - INTRO</div>
                        <div className="subtitle">This class is designed for newbies, all levels are<br /> welcome. Calories burnt up to 350</div>
                      </td>
                      <td><div className="time">60 Mins</div></td>
                      <td><div className="amount">$50.00</div></td>
                      <td>
                        <div className="switch"><Switch defaultChecked onChange={onChange} /></div>
                        <div className="edit-delete">
                          <a href="javascript:void(0)">
                            <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' />
                          </a>
                          <a href="javascript:void(0)">
                            <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><div className="thumb"></div></td>
                      <td>
                        <div className="title">Reformer Pilates - INTRO</div>
                        <div className="subtitle">This class is designed for newbies, all levels are<br /> welcome. Calories burnt up to 350</div>
                      </td>
                      <td><div className="time">60 Mins</div></td>
                      <td><div className="amount">$50.00</div></td>
                      <td>
                        <div className="switch"><Switch defaultChecked onChange={onChange} /></div>
                        <div className="edit-delete">
                          <a href="javascript:void(0)">
                            <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' />
                          </a>
                          <a href="javascript:void(0)">
                            <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><div className="thumb"></div></td>
                      <td>
                        <div className="title">Reformer Pilates - INTRO</div>
                        <div className="subtitle">This class is designed for newbies, all levels are<br /> welcome. Calories burnt up to 350</div>
                      </td>
                      <td><div className="time">60 Mins</div></td>
                      <td><div className="amount">$50.00</div></td>
                      <td>
                        <div className="switch"><Switch defaultChecked onChange={onChange} /></div>
                        <div className="edit-delete">
                          <a href="javascript:void(0)">
                            <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' />
                          </a>
                          <a href="javascript:void(0)">
                            <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' />
                          </a>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="4">&nbsp;</td>
                      <td>
                        <Select defaultValue="Active All" style={{ width: 120 }} onChange={handleChange}>
                          <Option value="Active All">Active All</Option>
                          <Option value="Active All">Active All</Option>
                          <Option value="Active All">Active All</Option>
                        </Select>
                      </td>
                    </tr>
                  </table>
                </div>
              </Card>
            </div>
          );
        }}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn-purpol">
          Submit
      </Button>
      </Form.Item>
    </Form>
  );
};
