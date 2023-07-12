import React, { useRef, useState, useEffect } from "react";
// import { Button, Form, Input, Table } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { required } from '../../../../config/FormValidation'
import { Layout, Card, message, Upload, DatePicker, Space, Typography, Button, Tabs, Table, Avatar, Row, Col, Form, Select, Input } from 'antd';
import { TimePicker } from 'antd';
import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import { MESSAGES } from '../../../../config/Message';
import { langs } from '../../../../config/localization';

const { Column } = Table;
const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const DURATION = [1, 2, 3, 4, 5, 6, 7]

export const CreateMemberShipForm = (props) => {
  const myRef = useRef(null);
  const [totals, setTotals] = useState([]);

  const [form] = Form.useForm();
  const { fitnessPlan } = props;
  useEffect(() => {
    // Update the document title using the browser API
    
  }, [setTotals]);

  const onFinish = values => {
    
    values.membership[0].total = 12
    props.createClass(values)
  };

  const format = 'HH:mm';
  const rules = [{ required: true }];
 
 
  /**
   * @method calculateTotal
   * @description calculate Total
   */
  const calculateTotal = (currentField, field) => {
    let duration = currentField.membership[field.fieldKey].duration
    let count = currentField.membership[field.fieldKey].class_count
    if (duration !== undefined && count !== undefined) {
      let temp = totals
      temp[field.key] = duration * count;
      
      setTotals(temp)
    }
  }

  return (
    <Form
      layout="vertical"
      name="members"
      onFinish={onFinish}
      ref={myRef}
      autoComplete="off"
      initialValues={{
        name: "user 1",
        membership: [{ package_name: '' }],
      }}
    >

      <Form.List name="membership">
        {(fields, { add, remove }) => {
          return (
            <div>
              <Card
                className='profile-content-box'
                title='Membership Plan'
              >
                {fields.map(field => (
                  <div>
                    <Row gutter={24}>               

                      <Col xs={24} sm={24} md={24} lg={21} xl={20}>
                        <Row >
                          <Col span={24}>
                            <Form.Item
                              label='Select Fitness Type'
                              name='fitness_types'
                              {...field}
                              name={[field.name, 'fitness_types']}
                              fieldKey={[field.fieldKey, 'fitness_types']}
                              className="pad-btm"
                            // rules={[required('Category')]}
                            >
                              <p className="subtitle">*You can choose more then one</p>

                              <Select
                                placeholder='Select'
                                size='large'
                                mode='multiple'
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
                              label='Membership Plan Name'
                              name='package_name'
                              {...field}
                              name={[field.name, 'package_name']}
                              fieldKey={[field.fieldKey, 'package_name']}

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
                              name='detail'
                              {...field}
                              name={[field.name, 'detail']}
                              fieldKey={[field.fieldKey, 'detail']}

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
                              name='price'
                              {...field}
                              name={[field.name, 'price']}
                              fieldKey={[field.fieldKey, 'price']}
                            >
                              <Input type="number" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label='Quantity'
                              name='quantity'
                              {...field}
                              name={[field.name, 'quantity']}
                              fieldKey={[field.fieldKey, 'quantity']}

                            // rules={[required('Category')]}
                            >
                              <Input name='aa' type="number" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={0} className="date-picker">
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} className="start-date">
                            <Form.Item
                              label='Membership Duration'
                              name='available_from'
                              {...field}
                              name={[field.name, 'available_from']}
                              fieldKey={[field.fieldKey, 'available_from']}
                            >
                              <DatePicker />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} className="end-date">
                            <Form.Item
                              label=''
                              name='available_to'

                              {...field}
                              name={[field.name, 'available_to']}
                              fieldKey={[field.fieldKey, 'available_to']}
                            >
                              <DatePicker />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={14} className="duration-count">
                          <Col span={12}>
                            <Form.Item
                              label='Duration'
                              name='duration'
                              {...field}
                              name={[field.name, 'duration']}
                              fieldKey={[field.fieldKey, 'duration']}
                            >
                              <Select
                                placeholder='Select Duration'
                                size='large'
                                onChange={(e) => {
                                  let currentField = myRef.current.getFieldsValue()
                                  if (currentField.membership[field.fieldKey].available_from === undefined) {
                                    toastr.error(langs.error, 'Please select Membership start date first.');
                                  } else {
                                    let week = 7 * e
                                    var firstDay = new Date(currentField.membership[field.fieldKey].available_from);
                                    var nextWeek = new Date(firstDay.getTime() + week * 24 * 60 * 60 * 1000);
                                    currentField.membership[0].available_to = moment(nextWeek)
                                    myRef.current.setFieldsValue({ currentField })
                                  }

                                }}
                                allowClear
                              >
                                {
                                  DURATION.map((keyName, i) => {
                                    return (
                                      <Option key={keyName} value={keyName}>{keyName} weeks</Option>
                                    )
                                  })}

                              </Select>

                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label='Count Per Week'
                              name='class_count'
                              {...field}
                              name={[field.name, 'class_count']}
                              fieldKey={[field.fieldKey, 'class_count']}

                            // rules={[required('Category')]}
                            >
                              <Select
                                placeholder='Select Count'
                                size='large'
                                onChange={(e) => {
                                  let currentField = myRef.current.getFieldsValue()
                                  
                                  calculateTotal(currentField, field)
                                }}
                                allowClear
                              >
                                {
                                  DURATION.map((keyName, i) => {
                                    return (
                                      <Option key={keyName} value={keyName}>{keyName}</Option>
                                    )
                                  })}

                              </Select>

                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row gutter={14}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} >&nbsp;</Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                        <div className="total-block">
                          <Title>Total Class</Title>
                          <div className="total-count">{totals[field.key] !== undefined ? totals[field.key] : 0}</div>
                          {}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
                <Row gutter={14}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={4} >&nbsp;</Col>

                  <Col xs={24} sm={24} md={24} lg={12} xl={20} >
                    <Form.Item>
                      <Button
                        type="dashed"
                        className="add-btn"
                        onClick={() => {
                          add();
                        }}
                        block
                      >
                        Add
              </Button>
                    </Form.Item>
                  </Col>
                </Row>

              </Card>
            </div>

          );
        }}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn-purpol">
          SAVE AND NEXT
      </Button>
      </Form.Item>
    </Form>
  );
};
