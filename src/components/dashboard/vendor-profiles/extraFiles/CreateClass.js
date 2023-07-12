import React from "react";
// import { Button, Form, Input, Table } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { required } from '../../../../config/FormValidation'
import { Layout, Card, DatePicker, Space, Typography, Button, Tabs, Table, Avatar, Row, Col, Form, Select, Input } from 'antd';
import { TimePicker } from 'antd';
import moment from 'moment';
const { Column } = Table;
const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thurstday', 'Friday', 'Saturday', 'Sunday']

export const FormExample = (props) => {
  const [form] = Form.useForm();
  const { fitnessPlan } = props;
  const onFinish = values => {
    
    props.createClass(values)
  };

  const format = 'HH:mm';
  const rules = [{ required: true }];
  return (
    <Form
      layout="vertical"
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{
        name: "user 1",
        users: [{ class_name: '' }],
      }}
    >
      <Form.List name="users">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map(field => (
                <div>
                  <Row >
                    <Col span={12}>
                      <Form.Item
                        label='Select Categories'
                        name='wellbeing_fitness_type_id'
                        {...field}
                        name={[field.name, 'wellbeing_fitness_type_id']}
                        fieldKey={[field.fieldKey, 'wellbeing_fitness_type_id']}

                      // rules={[required('Category')]}
                      >

                        <Select
                          placeholder='Select'
                          size='large'
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
                  {/* <Row>
                                        <Col>
                                            {renderWeek()}
                                        </Col>
                                    </Row> */}
                  <Row >
                    <Col span={12}>
                      <Form.Item
                        label='Class Name'
                        name='class_name'
                        {...field}
                        name={[field.name, 'class_name']}
                        fieldKey={[field.fieldKey, 'class_name']}

                      // rules={[required('Category')]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={12}>
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
                    <Col span={12}>
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
                  <Row >
                    <Col span={6}>
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
                    <Col span={6}>
                      <Form.Item
                        label='Capacity'
                        name='capacity'
                        {...field}
                        name={[field.name, 'capacity']}
                        fieldKey={[field.fieldKey, 'capacity']}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row >
                    <Col span={6}>
                      <Form.Item
                        label='Price AUD'
                        name='price'
                        {...field}
                        name={[field.name, 'price']}
                        fieldKey={[field.fieldKey, 'price']}

                      // rules={[required('Category')]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
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
                  <Row >
                    <Col span={6}>
                      <Form.Item
                        label='Duration'
                        name='start_date'
                        {...field}
                        name={[field.name, 'duration']}
                        fieldKey={[field.fieldKey, 'duration']}

                      // rules={[required('Category')]}
                      >
                        {/* <Input /> */}
                        <RangePicker />
                      </Form.Item>
                    </Col>
                    {/* <Col span={6}>
                      <Form.Item
                        label=''
                        name='end_date'
                        {...field}
                        name={[field.name, 'end_date']}
                        fieldKey={[field.fieldKey, 'end_date']}

                      // rules={[required('Category')]}
                      >
                        <Input />
                      </Form.Item>
                    </Col> */}

                  </Row>
                  {/* <div style={{ width: 500, border: '1px solid' }}> */}
                  {/* {renderTimings('Monday')} */}
                  {/* {renderTimings('Tuesday')}
                    {renderTimings('Wednesday')}
                    {renderTimings('Thursday')}
                    {renderTimings('Friday')}
                    {renderTimings('Saturday')}
                    {renderTimings('Sunday')} */}
                  {/* {renderWeek()} */}
                  {/* </div> */}
                </div>
                // </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Add field
              </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Next
      </Button>
      </Form.Item>
    </Form>
  );
};
