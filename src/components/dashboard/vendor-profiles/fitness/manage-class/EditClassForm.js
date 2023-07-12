import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusOutlined,
  DownOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { required } from "../../../../../config/FormValidation";
import {
  TimePicker,
  Collapse,
  DatePicker,
  message,
  Avatar,
  Divider,
  Card,
  Space,
  Typography,
  Button,
  Tabs,
  Table,
  Switch,
  Row,
  Col,
  Form,
  Select,
  Input,
  Upload,
} from "antd";
import { createFitnessClass, getServiceCategory } from "../../../../../actions";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { getFileItem } from "antd/lib/upload/utils";
import TextArea from "antd/lib/input/TextArea";
import { createYield } from "typescript";

const { Column } = Table;
const { Panel } = Collapse;
const { Option } = Select;
const { Title, Text } = Typography;
const INITIAL_VALUES = {
  Monday: [{ start_time: "", end_time: "" }],
  Tuesday: [{ start_time: "", end_time: "" }],
  Wednesday: [{ start_time: "", end_time: "" }],
  Thursday: [{ start_time: "", end_time: "" }],
  Friday: [{ start_time: "", end_time: "" }],
  Saturday: [{ start_time: "", end_time: "" }],
  Sunday: [{ start_time: "", end_time: "" }],
  // type: "Weekly",
  type: "Custom",
};

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export const EditClassForm = (props) => {
  console.log(props, "himanshu");
  const [form] = Form.useForm();
  const myRef = useRef(null);
  const [imageUrls, setImageUrls] = useState([
    { id: 0, file: "", imagePreviewUrl: "" },
  ]);
  const [openCalendarIndex, setOpenCalendarIndex] = useState([
    { index: 0, isOpen: false },
  ]);
  const [activePannel, setActivePannel] = useState(1);
  const [currentField2, setCurrentField2] = useState();
  const [editablefield, setEditableField] = useState({});
  const [durationOption, setDurationOption] = useState([]);

  const { fitnessPlan, showOptionList = false } = props;
  console.log("Fitness Plan", props.userDetails);

  useEffect(() => {
    // console.log('props.selectedClassId: ', props.selectedClassId);
    let filteredData =
      props.classList &&
      props.classList.filter(
        (e) => Number(e.id) === Number(props.selectedClassId)
      );
    if (filteredData && filteredData.length) {
      console.log("filteredData: ", filteredData);
      getItemDetail(filteredData[0]);
    }
    let temp = [];
    for (let i = 30; i <= 240; i = i + 30) {
      temp.push({ key: i, label: `${i} minutes` });
    }
    setDurationOption([...temp]);
  }, [props.selectedClassId]);

  // const onFinish = (values) => {
  //   console.log("values: $$", values);
  //   let finalReqData = [];
  //   let images = [];
  //   values.classes.map((cl, i) => {
  //     let clas = {
  //       class_date: {},
  //       class_name: "",
  //       // start_date: moment(cl.start_date).format('DD-MM-YYYY'),
  //       // end_date: moment(cl.end_date).format('DD-MM-YYYY')
  //     };
  //     console.log(clas, "cl: $$ 1");

  //     Object.keys(cl).map(function (key, index) {
  //       let temp = [];
  //       if (WEEKDAYS.includes(key)) {
  //         cl[key].map((d) => {
  //           //   console.log('cl[key]: $$', cl[key]);
  //           let test = Object.keys(d).every((k) => d[k] == "");
  //           if (test == false) {
  //             console.log(key, "d: ****", d);
  //             let start = moment(d.start_time).format("hh:mm a");
  //             // console.log('start: 3', start);
  //             let end = moment(d.end_time).format("hh:mm a");
  //             // console.log('end: 3', end);
  //             let timeStamp = {};
  //             timeStamp.start_time = start; //d.start_time
  //             timeStamp.end_time = end; //d.end_time
  //             timeStamp.class_day = key;
  //             timeStamp.id = d.id;
  //             timeStamp.parent_id = cl[key][0].id !== d.id ? cl[key][0].id : "";
  //             console.log(cl[key], "temp: ", temp);

  //             temp.push(timeStamp);
  //           }
  //         });
  //       } else if (cl[key] !== undefined) {
  //         clas[key] = cl[key];
  //         //Image Handling
  //         if (key === "image" && cl[key].file === undefined) {
  //           clas[key] = -1;
  //         } else if (key === "image") {
  //           images.push(cl[key].file);
  //           clas[key] = images.length - 1;
  //         }
  //       }
  //       if (temp.length) {
  //         clas.class_date[key] = temp;
  //       }
  //       clas.start_date = moment(cl.start_date).format("DD-MM-YYYY");
  //       clas.end_date = moment(cl.end_date).format("DD-MM-YYYY");
  //       finalReqData[i] = clas;
  //     });

  //     console.log(clas, "cl: $$2");
  //   });
  //   console.log(images, "form class_date: ", finalReqData);
  //   // return
  //   props.createClass(1, finalReqData, images);
  // };
  const addClass = (item) => {
    console.log("ITEM", item);
    let id = props.ids;
    let newid = props.fitnesstypeid;

    // form.append("trader_user_profile_id", 30);
    let form = {
      classes: [
        {
          class_name: item.classes[0].class_name,
          instructor_name: item.classes[0].instructor_name,
          description: item.classes[0].description,
          room: item.classes[0].room,
          capacity: item.classes[0].capacity,
          price: item.classes[0].price,
          time: item.classes[0].class_time,
          start_date: item.classes[0].start_date._d,
          end_date: item.classes[0].end_date._d,
          wellbeing_fitness_type_id: newid,
        },
      ],
      trader_user_profile_id: id,
    };

    // form.append("instructor_name", item.classes[0].instructor_name);
    // form.append("description", item.classes[0].description);
    // form.append("room", item.classes[0].room);
    // form.append("capacity", item.classes[0].capacity);
    // form.append("price", item.classes[0].price);
    // form.append("time", item.classes[0].class_time);
    // form.append("start_date", item.classes[0].start_date._d);
    // form.append("end_date", item.classes[0].end_date._d);
    createFitnessClass(form);
  };
  const format = "HH:mm";
  const renderWeekdays = (field) => {
    return WEEKDAYS.map((d) => {
      return (
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item>
              <WeekDayForm text={d} fieldKey={field.key} {...props} />
            </Form.Item>
          </Col>
        </Row>
      );
    });
  };
  const onFinish = (values) => {
    console.log("🚀 ~ file: EditClassForm.js ~ line 207 ~ onFinish ~ values", values)
    values.classes[0].wellbeing_fitness_type_id = props.selectedClassId
    let req = {
      trader_user_profile_id: props.ids,
      classes: [
        { class_name: values.classes[0].class_name,
         start_date: values.classes[0].start_date,
         end_date: values.classes[0].end_date,
         isOpenCalendar: values.classes[0].isOpenCalendar,
         type:values.classes[0].type,
         wellbeing_fitness_type_id: props.selectedClassId,
         service_category_id: props.selectedClassId,
         instructor_name:values.classes[0].instructor_name, 
         description: values.classes[0].description,
         room:values.classes[0].room,
         capacity: values.classes[0].capacity,
         price: values.classes[0].price,
         class_time:values.classes[0].class_time
         }
       ]
    };

    const formData = new FormData();
    formData.append("trader_user_profile_id", req.trader_user_profile_id);
    Object.keys(req).forEach((key) => {
      if (typeof req[key] == "object" && key === "classes") {
        formData.append("classes", `${JSON.stringify(req[key])}`);
      } else {
        formData.append(key, req[key]);
      }
    });

   props.EditNewClass(req)
  
  };

  const WeekDayForm = (props) => {
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
                    {index === 0 ? (
                      <Text className="day">{props.text}</Text>
                    ) : (
                      <span className="label-blank">&nbsp; </span>
                    )}
                    <div>
                      <Form.Item
                        {...bed}
                        name={[bed.name, "start_time"]}
                        fieldKey={[bed.fieldKey, "start_time"]}
                        key={index}
                      >
                        <TimePicker
                          use12Hours
                          format="h:mm a"
                          minuteStep={30}
                          defaultOpenValue={moment("24:00", "h:mm a")}
                        />
                        {/* <TimePicker
                          defaultValue={moment('01:00', format)}
                          // defaultOpenValue={moment('24:00', 'HH:mm')}
                          format={format}
                          minuteStep={30}
                          onChange={(e) => {
                            let currentField = myRef.current.getFieldsValue()
                            currentField.classes[props.fieldKey][props.text][bed.fieldKey].end_time = ''
                            myRef.current.setFieldsValue({ currentField })
                          }}
                        /> */}
                      </Form.Item>
                    </div>
                    <div className="dashed">-</div>
                    <div className="end-time">
                      <Form.Item
                        {...bed}
                        name={[bed.name, "end_time"]}
                        fieldKey={[bed.fieldKey, "end_time"]}
                        key={index}
                      // noStyle
                      >
                        <TimePicker
                          use12Hours
                          format="h:mm a"
                          minuteStep={30}
                          defaultOpenValue={moment("24:00", "h:mm a")}
                          onChange={(e) => {
                            let currentField = myRef.current.getFieldsValue();
                            if (e !== undefined) {
                              let start =
                                currentField.classes[props.fieldKey][
                                  props.text
                                ][bed.fieldKey].start_time;
                              let startTime = moment(start).format("HH:mm");
                              let endTime = moment(e).format("HH:mm");
                              if (startTime > endTime) {
                                currentField.classes[props.fieldKey][
                                  props.text
                                ][bed.fieldKey].end_time = "";
                                myRef.current.setFieldsValue({
                                  ...currentField,
                                });
                                console.log(
                                  startTime,
                                  "moment(e).forma: ",
                                  moment(e).format("HH:mm")
                                );
                                toastr.warning(
                                  "warning",
                                  "Start time can not be greater than end time."
                                );
                              }
                            } else {
                            }
                          }}
                        />
                        {/* <TimePicker
                          defaultValue={moment('00:00', format)}
                          format={format}
                          minuteStep={30}
                          disabledHours={() => {
                            let currentField = myRef.current.getFieldsValue()
                            let start = currentField.classes[props.fieldKey][props.text][bed.fieldKey].start_time
                            console.log('start: ', start);
                            const TimeSheet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                            if (start) {
                              let disableOne = TimeSheet.filter((el) => el < moment(start).format('HH'))
                              // console.log('disableOne: ', disableOne);
                              // console.log('moment(start).format(): ', moment(start).format('HH'));
                              return disableOne
                            } else {
                              return []
                            }
                          }}
                        /> */}
                      </Form.Item>
                    </div>
                    <Form.Item className="delete-icoon">
                      {/* {index === beds.length - 1 && ( */}
                      {index === 0 ? (
                        <div
                          onClick={() => {
                            add({ start_time: "", end_time: "" });
                          }}
                          className="add-icon"
                        >
                          <img
                            src={require("../../../../../assets/images/add-icon.svg")}
                            alt="add"
                          />
                        </div>
                      ) : (
                        <div className="blank-add-icon">&nbsp;</div>
                      )}
                    </Form.Item>
                    <div
                      onClick={() => {
                        let currentField = myRef.current.getFieldsValue();
                        let id =
                          currentField.classes[props.fieldKey][props.text][
                            bed.fieldKey
                          ].id;
                        console.log(props, "id: ", id);
                        props.removeClassTime(id, (res) => {
                          console.log("res: inCallback>>", res);
                          remove(bed.name);
                        });
                      }}
                      className="remove-icon"
                    >
                      <img
                        src={require("../../../../../assets/images/icons/delete-gray.svg")}
                        alt="delete"
                      />
                    </div>
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
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  /**
   * @method dummyRequest
   * @description dummy image upload request
   */
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  /**
   * @method setInitialWeekdays
   * @description get menu item details by id
   */
  const setInitialWeekdays = (days) => {
    let currentField = myRef.current.getFieldsValue();
    let mon = [],
      tues = [],
      wed = [],
      thurst = [],
      fri = [],
      sat = [],
      sun = [];
    days.map((time, i) => {
      if (time.day === "Monday") {
        console.log("time: $$$ ", time);
        if (time.is_active === 1) {
          let start = moment(time.start_time, "HH:mm");
          let end = moment(time.end_time, "HH:mm");
          mon.push({ start_time: start, end_time: end, id: time.id });
        }
        time.weekly_children_schedule.map((el) => {
          let start1 = moment(el.start_time, "HH:mm");
          if (el.is_active === 1) {
            let end1 = moment(el.end_time, "HH:mm");
            mon.push({
              start_time: start1,
              end_time: end1,
              id: el.id,
              parent_id: time.id,
            });
            console.log("mon: ", mon);
          }
        });
        currentField.classes[0]["Monday"] = [...mon];
      } else if (time.day === "Tuesday") {
        if (time.is_active === 1) {
          let start = moment(time.start_time, "HH:mm");
          let end = moment(time.end_time, "HH:mm");
          tues.push({ start_time: start, end_time: end, id: time.id });
        }
        time.weekly_children_schedule.map((el) => {
          console.log("el: $$$#", el);
          if (el.is_active === 1) {
            let start1 = moment(el.start_time, "HH:mm");
            let end1 = moment(el.end_time, "HH:mm");
            tues.push({
              start_time: start1,
              end_time: end1,
              id: el.id,
              parent_id: time.id,
            });
          }
        });
        currentField.classes[0]["Tuesday"] = [...tues];
      } else if (time.day === "Wednesday") {
        if (time.is_active === 1) {
          let start = moment(time.start_time, "HH:mm");
          let end = moment(time.end_time, "HH:mm");
          wed.push({ start_time: start, end_time: end, id: time.id });
          time.weekly_children_schedule.map((el) => {
            console.log("el: $$$#", el);
            if (el.is_active === 1) {
              let start1 = moment(el.start_time, "HH:mm");
              let end1 = moment(el.end_time, "HH:mm");
              wed.push({ start_time: start1, end_time: end1, id: el.id });
            }
          });
        }
        currentField.classes[0]["Wednesday"] = [...wed];
      } else if (time.day === "Thursday") {
        if (time.is_active === 1) {
          let start = moment(time.start_time, "HH:mm");
          let end = moment(time.end_time, "HH:mm");
          thurst.push({ start_time: start, end_time: end, id: time.id });
        }
        time.weekly_children_schedule.map((el) => {
          console.log("el: $$$#", el);
          if (el.is_active === 1) {
            let start1 = moment(el.start_time, "HH:mm");
            let end1 = moment(el.end_time, "HH:mm");
            thurst.push({ start_time: start1, end_time: end1, id: el.id });
          }
        });
        currentField.classes[0]["Thursday"] = [...thurst];
      } else if (time.day === "Friday") {
        if (time.is_active === 1) {
          let start = moment(time.start_time, "HH:mm");
          let end = moment(time.end_time, "HH:mm");
          fri.push({ start_time: start, end_time: end, id: time.id });
        }
        time.weekly_children_schedule.map((el) => {
          console.log("el: $$$#", el);
          if (el.is_active === 1) {
            let start1 = moment(el.start_time, "HH:mm");
            let end1 = moment(el.end_time, "HH:mm");
            fri.push({ start_time: start1, end_time: end1, id: el.id });
          }
        });
        currentField.classes[0]["Friday"] = [...fri];
      } else if (time.day === "Saturday") {
        if (time.is_active === 1) {
          let start = moment(time.start_time, "HH:mm");
          let end = moment(time.end_time, "HH:mm");
          sat.push({ start_time: start, end_time: end, id: time.id });
        }
        time.weekly_children_schedule.map((el) => {
          console.log("el: $$$#", el);
          if (el.is_active === 1) {
            let start1 = moment(el.start_time, "HH:mm");
            let end1 = moment(el.end_time, "HH:mm");
            sat.push({ start_time: start1, end_time: end1, id: el.id });
          }
        });
        currentField.classes[0]["Saturday"] = [...sat];
      } else if (time.day === "Sunday") {
        if (time.is_active === 1) {
          let start = moment(time.start_time, "HH:mm");
          let end = moment(time.end_time, "HH:mm");
          sun.push({ start_time: start, end_time: end, id: time.id });
        }
        time.weekly_children_schedule.map((el) => {
          if (el.is_active === 1) {
            let start1 = moment(el.start_time, "HH:mm");
            let end1 = moment(el.end_time, "HH:mm");
            sun.push({ start_time: start1, end_time: end1, id: el.id });
          }
        });
        currentField.classes[0]["Sunday"] = [...sun];
      }
    });
    myRef.current.setFieldsValue({ ...currentField });
  };
  const onChange = (e) => {
    console.log("FDGHFHFHHFH", e);
  };
  /**
   * @method getItemDetail
   * @description get menu item details by id
   */
  const getItemDetail = (item) => {
    let currentField = myRef.current.getFieldsValue();
    console.log("CURRENT FIELD", item);
    console.log("currentField: ", currentField);
    setActivePannel(1);
    console.log(
      "ITEMS Whic we want to Edit ",
      currentField.classes[0].class_name
    );
    currentField.classes[0].id = item.id;
    currentField.classes[0].class_name = item.class_name;
    currentField.classes[0].wellbeing_fitness_type_id =
      item.wellbeing_fitness_type_id;
    currentField.classes[0].instructor_name = item.instructor_name;
    currentField.classes[0].description = item.description;
    currentField.classes[0].room = item.room;
    currentField.classes[0].price = item.price;
    currentField.classes[0].capacity = item.capacity;
    currentField.classes[0].class_time = `${item.class_time} minutes`;
    currentField.classes[0].instructor_name = item.instructor_name;
    if (item && item !== undefined) {
      let temp = {
        fileList: [
          {
            uid: `1`,
            status: "done",
            url: item.image !== null ? item.image : "",
            isUploaded: true,
          },
        ],
      };
      currentField.classes[0].image = temp;
    }
    setCurrentField2({ ...currentField });
    console.log("CURRENT FIELD", currentField);

    currentField.classes[0].start_date = moment(item.start_date, "DD-MM-YYYY");
    currentField.classes[0].end_date = moment(item.end_date, "DD-MM-YYYY");
    // console.log('item.end_date: $$$$', moment(item.end_date,).format('YYYY-MM-DD'));
    console.log(
      "item.trader_weekly_classes_schedules $$$#: ",
      item.trader_weekly_classes_schedules
    );
    setInitialWeekdays(item.trader_weekly_classes_schedules);
    // console.log(tues, 'initialClass: $$$#', mon);
    myRef.current.setFieldsValue({ ...currentField });
    setEditableField({ ...item });
  };
  console.log("props.isInitialProfileSetup: ", props.isInitialProfileSetup);

  const clearAll = () => {
    myRef.current.resetFields()
    myRef.current.setFieldsValue({
      name: "",
      classes: [
        {
          Monday: [{ start_time: "", end_time: "" }],
          Tuesday: [{ start_time: "", end_time: "" }],
          Wednesday: [{ start_time: "", end_time: "" }],
          Thursday: [{ start_time: "", end_time: "" }],
          Friday: [{ start_time: "", end_time: "" }],
          Saturday: [{ start_time: "", end_time: "" }],
          Sunday: [{ start_time: "", end_time: "" }],
          isOpenCalendar: false,
          type: "Weekly",
        },
      ],
      class_name: "",
      instrcutor_name: "",
      description: "",
      room: "",
      capacity: "",
      price: "",
      class_time: "",
      start_date: "",
      end_date: "",
    });
  }
  return (
    <Form
      layout="vertical"
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      id="create_class"
      autoComplete="off"
      ref={myRef}
      initialValues={{
        name: "",
        classes: [
          {
            Monday: [{ start_time: "", end_time: "" }],
            Tuesday: [{ start_time: "", end_time: "" }],
            Wednesday: [{ start_time: "", end_time: "" }],
            Thursday: [{ start_time: "", end_time: "" }],
            Friday: [{ start_time: "", end_time: "" }],
            Saturday: [{ start_time: "", end_time: "" }],
            Sunday: [{ start_time: "", end_time: "" }],
            isOpenCalendar: false,
            type: "Weekly",
          },
        ],
        class_name: "",
        instrcutor_name: "",
        description: "",
        room: "",
        capacity: "",
        price: "",
        class_time: "",
        start_date: "",
        end_date: "",
      }}
    >
      <Form.List name="classes">
        {(fields, { add, remove }) => {
          console.log("fields: >>?", fields);
          return (
            <div className="create-class-name">
              <Card className="profile-content-box" title="">
                {myRef.current
                  ? console.log(" >>?", myRef.current.getFieldsValue())
                  : ""}
                {fields.map((field) => (
                  <div className="create-class-field">
                    <Row gutter={24}>
                      {/* <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                        <Form.Item
                          name={[field.name, "image"]}
                          fieldKey={[field.fieldKey, "image"]}
                        >
                          <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={true}
                            fileList={
                              currentField2 &&
                              currentField2.classes[field.key] &&
                              currentField2.classes[field.key].image
                                ? currentField2.classes[field.key].image
                                    .fileList
                                : []
                            }
                            customRequest={dummyRequest}
                            onChange={({ file, fileList }) => {
                              let currentField = myRef.current.getFieldsValue(); //Validations
                              let image = file;
                              const isJpgOrPng =
                                (image && image.type === "image/jpeg") ||
                                (image && image.type === "image/png");
                              const isLt2M =
                                image && image.size / 1024 / 1024 < 2;
                              if (file.isUploaded !== true) {
                                if (!isJpgOrPng) {
                                  message.error(
                                    "You can only upload JPG , JPEG  & PNG file!"
                                  );
                                  return false;
                                } else if (!isLt2M) {
                                  message.error("Image must smaller than 2MB!");
                                  return false;
                                } else {
                                  setCurrentField2(currentField);
                                  // this.setState({ currentField2: currentField })
                                }
                              } else {
                                setCurrentField2(currentField);
                                // this.setState({ currentField2: currentField })
                              }
                            }}
                          >
                            {currentField2 &&
                            currentField2.classes[field.key] &&
                            currentField2.classes[field.key].image &&
                            currentField2.classes[field.key].image.fileList
                              .length >= 1
                              ? null
                              : uploadButton}
                            {/* {uploadButton} }
                          </Upload>
                        </Form.Item>
                      </Col> */}

                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        {/* <Row>
                              <Col span={24}>
                                <Form.Item
                                  label="Add Class Type"
                                  {...field}
                                  rules={[required("Fitness type")]}
                                  name={[
                                    field.name,
                                    "wellbeing_fitness_type_id",
                                  ]}
                                  fieldKey={[
                                    field.fieldKey,
                                    "wellbeing_fitness_type_id",
                                  ]}
                                >
                                  <Select
                                    placeholder="Select"
                                    className="add-class-type"
                                    size="large"
                                    allowClear
                                  >
                                    {fitnessPlan &&
                                      fitnessPlan.map((keyName, i) => {
                                        return (
                                          <Option
                                            key={keyName.id}
                                            value={keyName.id}
                                          >
                                            {keyName.name}
                                          </Option>
                                        );
                                      })}
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row> */}
                        <Row gutter={14}>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label="Class Name"
                              name="class_name"
                              {...field}
                              name={[field.name, "class_name"]}
                              fieldKey={[field.fieldKey, "class_name"]}
                              rules={[required("Class name")]}
                            >
                              <Input placeholder="..." />
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label="Instructor Name"
                              name="instructor_name"
                              {...field}
                              name={[field.name, "instructor_name"]}
                              fieldKey={[field.fieldKey, "instructor_name"]}
                              rules={[required(" Instructor name")]}
                            >
                              <Input placeholder="..." />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              label="Details"
                              name="description"
                              {...field}
                              name={[field.name, "description"]}
                              fieldKey={[field.fieldKey, "description"]}
                              rules={[required("description")]}
                            >
                              <TextArea placeholder="..." />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={14}>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label="Room"
                              name="room"
                              {...field}
                              name={[field.name, "room"]}
                              fieldKey={[field.fieldKey, "room"]}
                              rules={[required("Room")]}
                            >
                              <Input type={"number"} placeholder="..." />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label="Capacity"
                              name="capacity"
                              {...field}
                              name={[field.name, "capacity"]}
                              fieldKey={[field.fieldKey, "capacity"]}
                              rules={[required("Capacity")]}
                            >
                              <Input type="number" placeholder="..." />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={14}>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item
                              label="Price AUD"
                              name="price"
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
                              label="Time"
                              // name='time'
                              {...field}
                              name={[field.name, "class_time"]}
                              fieldKey={[field.fieldKey, "class_time"]}
                            // rules={[required('Time')]}
                            >
                              {/* <Input /> */}
                              <Select
                                placeholder="0 Min"
                                className="add-class-type"
                                size="large"
                                allowClear
                              >
                                {durationOption &&
                                  durationOption.map((keyName) => {
                                    return (
                                      <Option key={keyName.key}>
                                        {keyName.label}
                                      </Option>
                                    );
                                  })}
                              </Select>
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
                              label="Duration"
                              {...field}
                              name={[field.name, "start_date"]}
                              fieldKey={[field.fieldKey, "start_date"]}
                              rules={[required("Start Date")]}
                            >
                              {/* <DatePicker  /> */}

                              <DatePicker
                                format={"DD-MM-YYYY"}
                                placeholder="Start Date"
                                onChange={(e) => {
                                  console.log("e: $$", e);
                                  let currentField =
                                    myRef.current.getFieldsValue();
                                  currentField.classes[
                                    field.fieldKey
                                  ].end_date = "";
                                  console.log(
                                    " currentField.classes[field.fieldKey]: $$",
                                    currentField.classes[field.fieldKey]
                                      .start_date
                                  );
                                  myRef.current.setFieldsValue({
                                    currentField,
                                  });
                                }}
                                disabledDate={(current) => {
                                  var dateObj = new Date();
                                  // subtract one day from current time
                                  dateObj.setDate(dateObj.getDate() - 1);
                                  return current && current.valueOf() < dateObj;
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
                            style={{ marginTop: "28px" }}
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, "end_date"]}
                              fieldKey={[field.fieldKey, "end_date"]}
                              rules={[required("End Date")]}
                            >
                              <DatePicker
                                format={"DD-MM-YYYY"}
                                placeholder="End Date"
                                disabledDate={(current) => {
                                  let currentField =
                                    myRef.current.getFieldsValue();
                                  let startDate =
                                    currentField.classes[field.fieldKey]
                                      .start_date;
                                  return (
                                    current && current.valueOf() < startDate
                                  );
                                }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <div className="manage-calander">
                          <Divider />
                          <h3>Manage Calendar</h3>
                          <div className="manage-calander-content-block">
                            <div
                              className={
                                openCalendarIndex[field.fieldKey] &&
                                  openCalendarIndex[field.fieldKey].isOpen
                                  ? "fr-cr-pointer head head-active"
                                  : "fr-cr-pointer head"
                              }
                              onClick={(e) => {
                                let currentField =
                                  myRef.current.getFieldsValue();
                                currentField.classes[
                                  field.fieldKey
                                ].isOpenCalendar =
                                  !currentField.classes[field.fieldKey]
                                    .isOpenCalendar;
                                openCalendarIndex[field.fieldKey].isOpen =
                                  !openCalendarIndex[field.fieldKey].isOpen;
                                setOpenCalendarIndex(openCalendarIndex);
                                myRef.current.setFieldsValue({
                                  currentField,
                                });
                              }}
                            >
                              <div>
                                <h5>Repeat weekly schedules</h5>
                              </div>
                              <div>
                                <svg
                                  width="11"
                                  height="6"
                                  viewBox="0 0 11 6"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M10.5 0.758182L9.76185 0L5.24318 4.506L4.76122 4.02545L4.76385 4.02818L0.749175 0.0245455L0 0.771273C1.10932 1.878 4.20735 4.96745 5.24318 6C6.01283 5.23309 5.2626 5.98091 10.5 0.758182Z"
                                    fill="#363B40"
                                  />
                                </svg>
                              </div>
                            </div>

                            {openCalendarIndex[field.fieldKey] &&
                              openCalendarIndex[field.fieldKey].isOpen && (
                                <div className="body-block">
                                  <div className="start-end-time">
                                    <div className="day">&nbsp;</div>
                                    <div className="start-label">
                                      <label>Start time</label>
                                    </div>
                                    <div className="dashed">&nbsp;</div>
                                    <div className="end-label">
                                      <label>End time</label>
                                    </div>
                                    <div style={{ width: "36px" }}>&nbsp;</div>
                                  </div>
                                  {renderWeekdays(field)}
                                </div>
                              )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
                <Row gutter="24" className="class-form-btns">
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item>
                      <Button className="clear-btn" onClick={clearAll}>Clear All</Button>
                      {/* <Button
                        className="add-btn"
                        onClick={() => {
                          let currentField = myRef.current.getFieldsValue();
                          console.log("CUrrent field", currentField);
                          setActivePannel(currentField.classes.length + 1);
                          setOpenCalendarIndex([
                            ...openCalendarIndex,
                            { id: currentField.classes.length, isOpen: false },
                          ]);
                          setImageUrls([
                            ...imageUrls,
                            {
                              id: currentField.classes.length,
                              file: "",
                              imagePreviewUrl: "",
                            },
                          ]);
                          add(INITIAL_VALUES);
                          console.log("currentField: Add @", currentField);
                          addClass(currentField);
                        }}
                        block
                      >
                        Add Class
                      </Button> */}


                      <Button
                        className="add-btn"
                        type="primary"
                        htmlType="submit"
                      >
                        Add Class
                      </Button>

                    </Form.Item>
                  </Col>
                </Row>
                {/* <div className="reformer-grid-block">
                  <table>
                    {Array.isArray(props.classList) &&
                      props.classList.map((el) => {
                        console.log("INside Array", el);
                        if (editablefield.id === el.id) {
                          return;
                        } else {
                          return (
                            <tr>
                              <td>
                                <div className="thumb">
                                  <img src={el.image} />
                                </div>
                              </td>
                              <td>
                                <div className="title">{el.class_name}</div>
                                <div className="subtitle">{el.description}</div>
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
                                      props.updateClassStatus(1, e, el);
                                      // props.getFitnessClasses()
                                    }}
                                  />
                                </div>
                                <div className="edit-delete">
                                  <a href="javascript:void(0)">
                                    <img
                                      src={require("../../../../../assets/images/icons/edit-gray.svg")}
                                      alt="edit"
                                      onClick={() => this.getItemDetail(el)}
                                    />
                                  </a>
                                  <a href="javascript:void(0)">
                                    <img
                                      src={require("../../../../../assets/images/icons/delete.svg")}
                                      alt="delete"
                                      onClick={() => props.deleteClass(1, el)}
                                    />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      })}

                    {showOptionList && (
                      <tr>
                        <td colSpan="3">&nbsp;</td>
                        <td colSpan="2" className="align-right">
                          <Select
                            className="custom-select"
                            onChange={(e) => {
                              console.log("e: ", e);
                              props.changeAllStatus(1, e);
                            }}
                            defaultValue="Select"
                            style={{ width: 220 }}
                          >
                            <Option value={0}>Deactive All</Option>
                            <Option value={1}>Active All</Option>
                            {/* <Option value="Active All">Active All</Option>}
                          </Select>
                        </td>
                      </tr>
                    )}
                  </table>
                </div> */}
              </Card>
            </div>
          );
        }}
      </Form.List>
      {/* {console.log(props.isEditPage, 'props.isInitialProfileSetup: ', props.isInitialProfileSetup)} */}
      {/* {!props.isEditPage && (
        <div className="step-button-block">
          <Button className="btn-blue" type="primary" htmlType="submit">
            Save and Next
          </Button>
        </div>
      )} */}
      {console.log("props.classList: ", props.classList)}

      {!props.isInitialProfileSetup && !props.isEditPage && (
        //  && (Array.isArray(props.classList) && props.classList.length)
        <div className="step-button-block">
          <Link
            onClick={() => props.nextStep()}
            className="skip-link uppercase"
            style={{ marginTop: "100px", marginRight: "100px" }}
          >
            Skip
          </Link>
        </div>
      )}

      {/* {(props.isInitialProfileSetup || props.isEditPage) && <Button
        className="add-btn"
        type="primary" htmlType="submit" >
        Skip
                       </Button>}    */}
    </Form>
  );
};
