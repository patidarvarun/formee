import React from "react";
import { connect } from 'react-redux';
// import { Button, Form, Input, Table } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { required } from '../../../../config/FormValidation'
import { Layout, Card, Space, Typography, Button, Tabs, Table, Avatar, Row, Col, Form, Select, Input } from 'antd';
import { TimePicker } from 'antd';
import moment from 'moment';
// import { WeekDayForm } from './WeekdayForm'

const { Column } = Table;
const { Option } = Select;
const { Title, Text } = Typography;
const format = 'HH:mm';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
// export const FormExample = (props) => {
const INITIAL_VALUES = {
    Monday: [{ start_time: '', end_time: '' }],
    Tuesday: [{ start_time: '', end_time: '' }],
    Wednesday: [{ start_time: '', end_time: '' }],
    Thursday: [{ start_time: '', end_time: '' }],
    Friday: [{ start_time: '', end_time: '' }],
    Saturday: [{ start_time: '', end_time: '' }],
    Sunday: [{ start_time: '', end_time: '' }]
}
class FormExample extends React.Component {

    //   const [form] = Form.useForm();
    //   const { fitnessPlan } = props;
    onFinish = values => {
        
        this.props.createClass(values)
    };
    formRef = React.createRef();
    renderWeekdays = (field) => {
        return WEEKDAYS.map((d) => {
            return (
                <Row>
                    <Col span={12}>
                        <Form.Item>
                            {this.WeekDayForm(d, field.key)}
                            {/* <WeekDayForm text={d} fieldKey={field.key} /> */}
                        </Form.Item>
                    </Col>
                </Row>

            )
        })
    }

    WeekDayForm = (text, fieldKey) => {
        return <Form.List name={[fieldKey, text]}>
            {(beds, { add, remove }) => {
                return (
                    <div>
                        {beds.map((bed, index) => (
                            <Space
                                key={bed.key}
                                style={{ display: "flex", marginBottom: 8 }}
                                align="start"
                            >
                                <Text>{text}</Text>
                                <Form.Item
                                    {...bed}
                                    name={[bed.name, "start_time"]}
                                    fieldKey={[bed.fieldKey, "start_time"]}
                                    key={index}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                // if (!value && getFieldValue("allocation") === "") {
                                                //   return Promise.reject("please input allocation!");
                                                // }
                                                // return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <TimePicker
                                        defaultValue={moment('00:00', format)}
                                        minuteStep={30}
                                        format={format}
                                        onChange={(e) => {
                                            
                                            this.formRef.current && this.formRef.current.setFieldsValue({
                                                dynamic_form_nest_item_classes_0_Monday_0_end_time: e
                                            });
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...bed}
                                    name={[bed.name, "end_time"]}
                                    fieldKey={[bed.fieldKey, "end_time"]}
                                    key={index}
                                >
                                    <TimePicker
                                        defaultValue={moment('00:00', format)}
                                        minuteStep={30}
                                        format={format}
                                    />
                                    {/* <Input /> */}
                                </Form.Item>

                                <MinusCircleOutlined
                                    onClick={() => {
                                        remove(bed.name);
                                    }}
                                />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => {
                                    add();
                                }}
                            >
                                <PlusOutlined /> Add Bed
                  </Button>
                        </Form.Item>
                    </div>
                );
            }}
        </Form.List>
    }
    render() {
        const { fitnessPlan } = this.props
        return (
            <Form
                layout="vertical"
                name="create_class"
                onFinish={this.onFinish}
                autoComplete="off"
                ref={this.formRef}
                initialValues={{
                    name: "user 1",
                    classes: [{
                        Monday: [{ start_time: '', end_time: '' }],
                        Tuesday: [{ start_time: '', end_time: '' }],
                        Wednesday: [{ start_time: '', end_time: '' }],
                        Thursday: [{ start_time: '', end_time: '' }],
                        Friday: [{ start_time: '', end_time: '' }],
                        Saturday: [{ start_time: '', end_time: '' }],
                        Sunday: [{ start_time: '', end_time: '' }]
                    }],
                }}
            >
                <Form.List name="classes">
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                                {fields.map(field => (
                                    <div>

                                        {this.renderWeekdays(field)}
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

                                                // rules={[required('Category')]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row >
                                            <Col span={6}>
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
                                                    name={[field.name, 'capacity']}
                                                    fieldKey={[field.fieldKey, 'capacity']}

                                                // rules={[required('Category')]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
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
                                            </Col>

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
                                            add(INITIAL_VALUES);
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
                        Submit
      </Button>
                </Form.Item>
            </Form>
        );
    }
};


const mapStateToProps = (store) => {
    const { auth, profile, bookings } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
        fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],

    };
};
export default connect(
    mapStateToProps,
    {
        // getFitnessTypes, getTraderProfile, createFitnessClass
    }
)(FormExample)