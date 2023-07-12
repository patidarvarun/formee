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

const { Panel } = Collapse;
const { Option } = Select;
const { Title } = Typography;
const DURATION = [1, 2, 3, 4, 5, 6, 7];

export const EditMemberShipForm = (props) => {
  const myRef = useRef(null);
  const [totals, setTotals] = useState([0]);
  const [activePannel, setActivePannel] = useState(1);
  const [editablefield, setEditableField] = useState({});
  const [form] = Form.useForm();
  const { fitnessPlan, showOptionList = false } = props;
  useEffect(() => {
    // Update the document title using the browser API
    let filteredData = props.packageList.filter(
      (e) => Number(e.id) === Number(props.selectedMembershipId)
    );
    if (filteredData.length) {
      // getItemDetail(filteredData[0]);
    } else if (props.packageList.length) {
      // getItemDetail(props.packageList[0]);
    }
  }, [props.packageList]);

  const onFinish = (values) => {
    console.log("values: 1", values);
    let membership = values.membership;
    membership = membership.filter((el) => {
      el.quantity = !el.quantity ? 1 : el.quantity;
      console.log("el: ", el);
      return el;
    });
    // values.membership = membership;

    props.createClass(2, values);
  };
  const clearAll=()=>{
    myRef.current.resetFields()
    myRef.current.setFieldsValue({
      package_name: "",
      fitness_types:"",
      detail: "",
      price: "",
      quantity: "",
      available_from: "",
      available_to: "",
      duration: "",
      class_count: "",
   
    });
  }

  /**
   * @method calculateTotal
   * @description calculate Total
   */
  const calculateTotal = (currentField, field) => {
    let duration = currentField.membership[field.name].duration;
    let count = currentField.membership[field.name].class_count;
    if (duration !== undefined && count !== undefined) {
      let temp = totals;
      temp[field.name] = duration * count;
      currentField.membership[field.name].total = temp[field.name];
      console.log(
        [...totals, temp[field.name]],
        "currentField.membership[field.name]: **3",
        currentField.membership[field.name]
      );
      myRef.current.setFieldsValue({ ...currentField });
      // if(totals.length >1){
      //   setTotals([...totals, temp[field.name]])
      // }else{
      setTotals([...temp]);
      // }
    }
  };
  const addMemberShip = (item) => {
    console.log("ADDMEMBERSHIP", item);
    // const fitness = item.fitness_types.map(
    //   (el) => el.id
    // );
    // console.log(fitness);
    // let form=new FormData();
    // form.append("")
  };

  /**
   * @method getItemDetail
   * @description get menu item details by id
   */
  const getItemDetail = (item) => {
    console.log("item: ", item);
    let currentField = myRef.current.getFieldsValue();
    setActivePannel(1);
    currentField.membership[0].package_id = item.id;
    currentField.membership[0].fitness_types = item.fitness_types.map(
      (el) => el.id
    );
    currentField.membership[0].package_name = item.name;
    currentField.membership[0].detail = item.detail;
    currentField.membership[0].price = item.price;
    currentField.membership[0].quantity = item.quantity;
    currentField.membership[0].total = item.total;
    currentField.membership[0].duration = item.duration;
    currentField.membership[0].class_count = item.class_count;

    let d1 = moment(item.available_from, "DD-MM-YYYY");
    currentField.membership[0].available_from = d1;

    let d2 = moment(item.available_to, "DD-MM-YYYY");
    currentField.membership[0].available_to = d2;

    calculateTotal(currentField, { name: 0, key: 0, fieldKey: 0 });
    myRef.current.setFieldsValue({ currentField });
    setEditableField({ ...item });
  };
  if (myRef.current) {
    let currentField = myRef.current.getFieldsValue();
    console.log(currentField, "activePannel: ", activePannel);
    console.log("CURRENT FIELD", currentField);
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
        membership: [{ package_name: "", is_active: 1 }],
      }}
    >
      <Form.List name="membership">
        {(fields, { add, remove }) => {
          return (
            <div className="edit-memebership-plan">
              <Card
              //className="profile-content-box"
              // title='Membership Plan'
              >
                {fields.map((field) => (
                  <>
                    <div>
                      <Row>
                        <Col span={24}>
                          <Form.Item
                            label=""
                            {...field}
                            // rules={[required("Class type")]}
                            name={[field.name, "fitness_types"]}
                            fieldKey={[field.fieldKey, "fitness_types"]}
                            className="add-classed-type"
                          >
                            <div className="service-type-labels">
                              <span>
                                Select service types included in this plan
                              </span>
                              <label>*You can choose more than one</label>
                            </div>
                            <Select
                              placeholder="Please Choose"
                              size="large"
                              mode="multiple"
                              allowClear
                            >
                              {fitnessPlan &&
                                fitnessPlan.map((keyName, i) => {
                                  return (
                                    <Option
                                      key={keyName.id}
                                      value={keyName.name}
                                    >
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
                                {...field}
                                name={[field.name, "package_name"]}
                                fieldKey={[field.fieldKey, "package_name"]}
                                rules={[required("Membership Plan")]}
                              >
                                <Input placeholder="..." />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Form.Item
                                label="Details"
                                name="detail"
                                {...field}
                                name={[field.name, "detail"]}
                                fieldKey={[field.fieldKey, "detail"]}
                                rules={[required("Details")]}
                              >
                                <TextArea placeholder="..." />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={14}>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                              <Form.Item
                                label="Price AUD"
                                {...field}
                                name={[field.name, "price"]}
                                fieldKey={[field.fieldKey, "price"]}
                                rules={[required("Price")]}
                              >
                                <Input type="number" placeholder="..." />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                              <Form.Item
                                label="Quantity"
                                {...field}
                                name={[field.name, "quantity"]}
                                fieldKey={[field.fieldKey, "quantity"]}
                                // rules={[required('Quantity')]}
                              >
                                <Input
                                  name="aa"
                                  type="number"
                                  placeholder="..."
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
                                {...field}
                                name={[field.name, "available_from"]}
                                fieldKey={[field.fieldKey, "available_from"]}
                                rules={[required("Memeber ship date range")]}
                              >
                                <DatePicker
                                  onChange={(e) => {
                                    let currentField =
                                      myRef.current.getFieldsValue();
                                    if (
                                      currentField.membership[field.fieldKey]
                                        .duration === undefined
                                    ) {
                                      toastr.warning(
                                        langs.warning,
                                        "Please select Membership Duration first."
                                      );
                                      currentField.membership[
                                        field.fieldKey
                                      ].available_from = "";
                                      myRef.current.setFieldsValue({
                                        ...currentField,
                                      });
                                    } else {
                                      let weeks =
                                        currentField.membership[field.fieldKey]
                                          .duration;
                                      let duration = Number(weeks) * 7;
                                      let newDate = moment(e).add(
                                        duration,
                                        "d"
                                      );
                                      currentField.membership[
                                        field.fieldKey
                                      ].available_to = newDate;
                                      myRef.current.setFieldsValue({
                                        ...currentField,
                                      });
                                    }
                                    //
                                  }}
                                  disabledDate={(current) => {
                                    var dateObj = new Date();
                                    // subtract one day from current time
                                    dateObj.setDate(dateObj.getDate() - 1);
                                    return (
                                      current && current.valueOf() < dateObj
                                    );
                                  }}
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
                              <Form.Item
                                label=""
                                name="available_to"
                                {...field}
                                name={[field.name, "available_to"]}
                                fieldKey={[field.fieldKey, "available_to"]}
                                rules={[required("Memeber ship date range")]}
                              >
                                <DatePicker
                                  disabled={true}
                                  disabledDate={(current) => {
                                    let currentField =
                                      myRef.current.getFieldsValue();
                                    let startDate =
                                      currentField.membership[field.fieldKey]
                                        .available_from;
                                    return (
                                      current && current.valueOf() < startDate
                                    );
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={14} className="duration-count">
                            <Col span={12}>
                              <Form.Item
                                label="Duration"
                                name="duration"
                                {...field}
                                name={[field.name, "duration"]}
                                fieldKey={[field.fieldKey, "duration"]}
                                rules={[required("Duration")]}
                              >
                                <Select
                                  placeholder="Select Duration"
                                  className="add-class-type"
                                  size="large"
                                  onChange={(e) => {
                                    let currentField =
                                      myRef.current.getFieldsValue();
                                    if (
                                      currentField.membership[field.fieldKey]
                                        .available_from &&
                                      currentField.membership[field.fieldKey]
                                        .available_to
                                    ) {
                                      // toastr.error(langs.error, 'Please select Membership start date first.');
                                      let duration = Number(e) * 7;
                                      let newDate = moment(
                                        currentField.membership[field.fieldKey]
                                          .available_from
                                      ).add(duration, "d");
                                      currentField.membership[
                                        field.fieldKey
                                      ].available_to = newDate;
                                      myRef.current.setFieldsValue({
                                        ...currentField,
                                      });
                                    } else {
                                      let week = 7 * e;
                                      var firstDay = new Date(
                                        currentField.membership[
                                          field.fieldKey
                                        ].available_from
                                      );
                                      var nextWeek = new Date(
                                        firstDay.getTime() +
                                          week * 24 * 60 * 60 * 1000
                                      );
                                      currentField.membership[0].available_to =
                                        moment(nextWeek);
                                      myRef.current.setFieldsValue({
                                        currentField,
                                      });
                                      calculateTotal(currentField, field);
                                    }
                                  }}
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
                                {...field}
                                rules={[required("Count per week")]}
                                name={[field.name, "class_count"]}
                                fieldKey={[field.fieldKey, "class_count"]}
                              >
                                <Select
                                  placeholder="Select Count"
                                  className="add-class-type"
                                  size="large"
                                  onChange={(e) => {
                                    let currentField =
                                      myRef.current.getFieldsValue();
                                    calculateTotal(currentField, field);
                                  }}
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
                            <div className="total-count">
                              {totals[field.name] !== undefined
                                ? totals[field.name]
                                : 0}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    {field.key !== 0 && (
                      <Col flex="none">
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          title={"Add More"}
                          onClick={() => {
                            remove(field.name);
                            console.log("field.name: Remove ", field.name);
                            // let currentField = myRef.current.getFieldsValue()
                            setActivePannel(1);
                            // let currentField = myRef.current.getFieldsValue()
                            // setActivePannel(currentField.membership.length - 1)
                            // console.log(currentField, 'activePannel: ', activePannel);
                            // remove(field.fieldKey)
                          }}
                        />
                      </Col>
                    )}
                  </>
                ))}
                {
                  myRef.current &&
                    console.log("$$$", myRef.current.getFieldsValue()) // let currentField = myRef.current.getFieldsValue()
                }
                <Row gutter={14} className="class-form-btns">
                  <Col xs={12} sm={12} md={12} lg={24} xl={24}>
                    <Form.Item>
                      <Button className="clear-btn" onClick={clearAll}>Clear All</Button>
                      {/* <Button
                        type="dashed"
                        className="add-btn add-btn-trans"
                        onClick={() => {
                          let currentField = myRef.current.getFieldsValue();
                          setActivePannel(activePannel + 1);
                          console.log(
                            currentField,
                            "activePannel: ",
                            activePannel
                          );
                          add();
                          addMemberShip(currentField);
                        }}
                        block
                      >
                        Add
                      </Button> */}
                     
                        <Button
                          className="add-btn"
                          type="primary"
                          htmlType="submit"
                        >
                          Save
                        </Button>
                        
                      {/* <Button type="primary" htmlType="submit" className="add-btn">
                        Save and Next
                                                      </Button> */}
                    </Form.Item>
                  </Col>
                </Row>
                <div className="reformer-grid-block">
                  <table>
                    {Array.isArray(props.packageList) &&
                      props.packageList.map((el) => {
                        if (editablefield.id === el.id) {
                          return;
                        } else {
                          return (
                            <tr>
                              <td>
                                <div className="title">{el.name}</div>
                                <div className="subtitle">{el.detail}</div>
                              </td>
                              <td>
                                <div className="time">60 Mins</div>
                              </td>
                              <td>
                                <div className="amount">${el.price}.00</div>
                              </td>
                              <td>
                                <div className="switch">
                                  <Switch
                                    checked={el.is_active === 1 ? true : false}
                                    onChange={(e) => {
                                      props.updateClassStatus(2, e, el);
                                      // props.getFitnessMemberShip()
                                    }}
                                  />
                                </div>
                                <div className="edit-delete">
                                  <a href="javascript:void(0)">
                                    <img
                                      src={require("../../../../../assets/images/icons/edit-gray.svg")}
                                      alt="edit"
                                      onClick={() => getItemDetail(el)}
                                    />
                                  </a>
                                  <a href="javascript:void(0)">
                                    <img
                                      src={require("../../../../../assets/images/icons/delete.svg")}
                                      alt="delete"
                                      onClick={() => {
                                        props.deleteMemberShip(2, el);
                                        console.log("el:11 ", el);
                                      }}
                                    />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      })}
                    <tr>
                      <td colSpan="2">&nbsp;</td>
                      {props.showOptionList && (
                        <td className="align-right" colSpan="2">
                          <Select
                            className="custom-select"
                            onChange={(e) => {
                              console.log("e: ", e);
                              props.changeAllStatus(2, e);
                            }}
                            defaultValue="Select"
                            style={{ width: 220 }}
                          >
                            <Option value={0}>Deactive All</Option>
                            <Option value={1}>Active All</Option>
                            {/* <Option value="Active All">Active All</Option> */}
                          </Select>
                        </td>
                      )}
                    </tr>
                  </table>
                </div>
              </Card>
            </div>
          );
        }}
      </Form.List>
      {/* {console.log(props.isEditPage, 'props.isInitialProfileSetup: ', props.isInitialProfileSetup)} */}
      {/* {(!props.isEditPage) && <div className="step-button-block">
        <Button
          className='btn-blue'
          type="primary" htmlType="submit" >
          Add
        </Button>
      </div>} */}
      {/* {!props.isInitialProfileSetup && !props.isEditPage && (
        //  (Array.isArray(props.packageList) && props.packageList.length) &&
        <div className="step-button-block">
          {console.log(
            "props.isInitialProfileSetup: ",
            props.isInitialProfileSetup
          )}
          <Link
            onClick={() => props.nextStep()}
            className="skip-link uppercase"
            style={{ marginTop: "100px", marginRight: "100px" }}
          >
            Skip
          </Link>
        </div>
      )} */}
    </Form>
  );
};
