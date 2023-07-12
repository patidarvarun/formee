import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  Collapse,
  Switch,
  DatePicker,
  Typography,
  Button,
  Table,
  Row,
  Col,
  Form,
  Select,
  Input,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { langs } from "../../../../../config/localization";
import { required } from "../../../../../config/FormValidation";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { API } from "../../../../../config/Config";

const { Panel } = Collapse;
const { Option } = Select;
const { Title } = Typography;
const DURATION = [1, 2, 3, 4, 5, 6, 7];

export const MemberShipForm = (props) => {
  const myRef = useRef(null);
  const [totals, setTotals] = useState([0]);
  const [activePannel, setActivePannel] = useState(1);
  const [editablefield, setEditableField] = useState({});
  const [editMemberData, seteditMemberData] = useState({
    serviceType: props.editData.fitness_types,
    memberShipPlan: props.editData.name,
    Details: props.editData.detail,

    Price: props.editData.price,
    quantity: props.editData.quantity,
    startDate: props.editData.available_from,
    endDate: props.editData.available_to,
    Duration: props.editData.duration,
    Counts: props.editData.class_count,
  });
  const [form] = Form.useForm();
  const { fitnessPlan, showOptionList = false } = props;
  useEffect(() => {
    // Update the document title using the browser API

    console.log("----------", props);
  }, [props.packageList]);

  const onFinish = (values) => {
    console.log("values: 1", values);
    let obj = {};
    obj.package_id = props.editData.id;
    obj.package_name = editMemberData.memberShipPlan;
    obj.is_active = props.editData.is_active;
    obj.detail = editMemberData.Details;
    obj.fitnessPlan = editMemberData.serviceType;
    obj.price = editMemberData.Price;
    obj.quantity = editMemberData.quantity;
    obj.duration = editMemberData.Duration;
    obj.available_to = editMemberData.endDate;
    obj.class_count = editMemberData.Counts;
    obj.available_from = editMemberData.startDate;
    obj.total = props.editData.total;
    const formData = new FormData();
    console.log(obj);
    formData.append(
      "trader_user_profile_id",
      props.editData.trader_user_profile_id
    );
    formData.append("packages", JSON.stringify([obj]));

    // axios.post(`${API.createMembership}`, formData).then((res) => {
    //   alert(res.data.message);
    //   props.handleClose()
    // });

    props.onSubmit(formData)
    // values.membership = membership;
  };
  const handleFitnessType = (value) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFIT++++++", value);
    obj.serviceType = value;
    seteditMemberData(obj);
  };
  const handleMemberPlan = (e) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFIT++++++", e.target.value);
    obj.memberShipPlan = e.target.value;
    seteditMemberData(obj);
  };
  const handleDetail = (e) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFIT++++++", e.target.value);
    obj.Details = e.target.value;
    seteditMemberData(obj);
  };
  const handlePrice = (e) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFIT++++++", e.target.value);
    obj.Price = e.target.value;
    seteditMemberData(obj);
  };

  const handleQuantity = (e) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFIT++++++", e.target.value);
    obj.quantity = e.target.value;
    seteditMemberData(obj);
  };
  const handleStartDate = (date) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFITSTART++++++", date);
    obj.startDate = date;
    seteditMemberData(obj);
  };
  const handleEndDate = (date) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFITEND++++++", date);
    obj.endDate = date;
    seteditMemberData(obj);
  };
  const handleDuration = (value) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFIT++++++", value);
    obj.Duration = value;
    seteditMemberData(obj);
  };
  const handleCount = (value) => {
    const obj = { ...editMemberData };
    console.log("+++++CONSOLEFIT++++++", value);
    obj.Counts = value;
    seteditMemberData(obj);
  };

  return (
    <Form
      layout="vertical"
      name="members"
      onFinish={onFinish}
      ref={myRef}
      autoComplete="off"
      initialValues={{
        name: "user 1",
        membership: [{ package_name: "", is_active: 1 }],
        available_from: moment(editMemberData.startDate, "DD-MM-YYYY"),
        available_to: moment(editMemberData.endDate, "DD-MM-YYYY"),
        package_name: editMemberData.memberShipPlan,
        is_active: props.editData.is_active,
        detail: editMemberData.Details,
        fitnessPlan: editMemberData.serviceType,
        price: editMemberData.Price,
        quantity: editMemberData.quantity,
        duration: editMemberData.Duration,

        class_count: editMemberData.Counts,

        total: props.editData.total,
      }}
    >
      <div className="membership">
        <div className="edit-memebership-plan">
          <div>
            <Row>
              <Col span={24}>
                <Form.Item
                  label=""
                  // rules={[required("Class type")]}
                  name={"fitness_types"}
                  className="add-classed-type"
                >
                  <div className="service-type-labels">
                    <span>Select service types included in this plan</span>
                    <label>*You can choose more than one</label>
                  </div>
                  <Select
                    placeholder="Please Choose"
                    size="large"
                    onChange={handleFitnessType}
                    // defaultValue={editMemberData.serviceType}
                    mode="multiple"
                    allowClear
                  >
                    {fitnessPlan &&
                      fitnessPlan.map((keyName, i) => {
                        return (
                          <Option key={keyName.id} value={keyName.name}>
                            {keyName.name}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Membership Plan Name"
                      name="package_name"
                      name={"package_name"}
                      rules={[required("Membership Plan")]}
                    >
                      <Input
                        placeholder="..."
                        onChange={handleMemberPlan}
                        value={editMemberData.memberShipPlan}
                        defaultValue={editMemberData.memberShipPlan}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Details"
                      name="detail"
                      name={"detail"}
                      rules={[required("Details")]}
                    >
                      <TextArea
                        placeholder="..."
                        onChange={handleDetail}
                        value={editMemberData.Details}
                        defaultValue={editMemberData.Details}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={14}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="Price AUD"
                      name={"price"}
                      rules={[required("Price")]}
                    >
                      <Input
                        type="number"
                        placeholder="..."
                        onChange={handlePrice}
                        value={editMemberData.Price}
                        defaultValue={editMemberData.Price}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="Quantity"
                      name={"quantity"}

                      // rules={[required('Quantity')]}
                    >
                      <Input
                        name="aa"
                        type="number"
                        placeholder="..."
                        onChange={handleQuantity}
                        value={editMemberData.quantity}
                        defaultValue={editMemberData.quantity}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={0} className="date-picker">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    className="start-date"
                  >
                    <Form.Item
                      label="Membership Duration"
                      name="available_from"
                    >
                      <DatePicker
                        format="DD-MM-YYYY"
                        onChange={handleStartDate}
                        value={moment(editMemberData.startDate, "DD-MM-YYYY")}
                        defaultValue={moment(
                          editMemberData.startDate,
                          "DD-MM-YYYY"
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    className="end-date"
                  >
                    <Form.Item label="" name="available_to">
                      <DatePicker
                        format="DD-MM-YYYYY"
                        onChange={handleEndDate}
                        defaultValue={moment(
                          editMemberData.endDate,
                          "DD-MM-YYYY"
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={14} className="duration-count">
                  <Col span={12}>
                    <Form.Item
                      label="Duration"
                      name="duration"
                      name={"duration"}
                      rules={[required("Duration")]}
                    >
                      <Select
                        placeholder="Select Duration"
                        defaultValue={editMemberData.Duration}
                        className="add-class-type"
                        size="large"
                        onChange={handleDuration}
                        allowClear
                      >
                        {DURATION.map((keyName, i) => {
                          return (
                            <Option key={keyName} value={keyName}>
                              {keyName} weeks
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Count Per Week"
                      name="class_count"
                      rules={[required("Count per week")]}
                      name={"class_count"}
                    >
                      <Select
                        placeholder="Select Count"
                        className="add-class-type"
                        defaultValue={editMemberData.Counts}
                        size="large"
                        onChange={handleCount}
                        allowClear
                      >
                        {DURATION.map((keyName, i) => {
                          return (
                            <Option key={keyName} value={keyName}>
                              {keyName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row gutter={14}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                &nbsp;
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <div className="total-block">
                  <Title>Total Classes</Title>
                  <div className="total-count"> {editMemberData.Counts} </div>
                </div>
              </Col>
            </Row>
          </div>
          <Row gutter={14} className="class-form-btns">
            <Col xs={12} sm={12} md={12} lg={24} xl={24}>
              <Form.Item>
                <Button className="add-btn" type="primary" htmlType="submit">
                  Save
                </Button>

                {/* <Button type="primary" htmlType="submit" className="add-btn">
                        Save and Next
                                                      </Button> */}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
  );
};
