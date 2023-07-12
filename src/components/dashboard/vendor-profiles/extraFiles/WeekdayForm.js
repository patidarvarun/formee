import React from "react";
// import { Button, Form, Input, Table } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { required } from '../../../../config/FormValidation'
import { Layout, Card, Space, Typography, Button, Tabs, Table, Avatar, Row, Col, Form, Select, Input } from 'antd';
import { TimePicker } from 'antd';
import moment from 'moment';

const { Column } = Table;
const { Option } = Select;
const { Title, Text } = Typography;
const format = 'HH:mm';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


// export const WeekDayForm = this.props => {
export class WeekDayForm extends React.Component {
    formRef = React.createRef();

    render() {
        return (
            <>
                <Form.List name={[this.props.fieldKey, this.props.text]}>
                    {(beds, { add, remove }) => {
                        return (
                            <div>
                                {beds.map((bed, index) => (
                                    <Space
                                        key={bed.key}
                                        style={{ display: "flex", marginBottom: 8 }}
                                        align="start"
                                    >
                                        <Text>{this.props.text}</Text>
                                        <Form.Item
                                            // name={"aar"}
                                            {...bed}
                                            name={[bed.name, "start_time"]}
                                            fieldKey={[bed.fieldKey, "start_time"]}
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
                                                onChange={(e) => {
                                                    this.formRef.current && this.formRef.current.setFieldsValue({
                                                        end_time: ''
                                                    });

                                                }}
                                            />
                                        </Form.Item>
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
            </>
        );
    }
};