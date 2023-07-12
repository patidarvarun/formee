import React, { useState } from "react";
import {
  InputNumber,
  Slider,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  Checkbox,
  Upload,
  message,
  Button,
} from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import {
  required,
  email,
  validNumber,
  validSalary,
} from "../../config/FormValidation";
import TimePicker from "react-time-picker";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import validator from "validator";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

/**
 * @method renderPasswordInput
 * @description render password input field
 */
export const renderPasswordInput = (data, noValidate, isLabelShow) => {
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <Input.Password
          placeholder={!isLabelShow ? data.att_name : "Input Password"}
        />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderNumberInput
 * @description render number input field
 */
export const renderNumberInput = (data, noValidate, isLabelShow) => {
  function onChange(value) {}
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        // rules={!noValidate && data.validation === 1 && [required('')]}
        rules={
          !noValidate &&
          data.validation === 1 &&
          data.att_name === "Salary Range"
            ? [{ validator: validSalary }]
            : [{ validator: validNumber }]
        }
      >
        {data.slug === "minimum_salary" || data.slug === "maximum_salary" ? (
          <InputNumber
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            placeholder={!isLabelShow ? data.att_name : "Type here"}
          />
        ) : (
          <Input
            onChange={onChange}
            placeholder={!isLabelShow ? data.att_name : "Type here"}
          />
        )}
        {/* <Input onChange={onChange} /> */}
      </Form.Item>
    </div>
  );
};

/**
 * @method renderDatePicker
 * @description render date picker
 */
export const renderDatePicker = (data, noValidate, isLabelShow) => {
  function onChange(date, dateString) {}
  function disabledDate(current) {
    // Can not select days after today date
    return current && current.valueOf() < Date.now();
  }
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <DatePicker
          onChange={onChange}
          disabledDate={disabledDate}
          placeholder={!isLabelShow ? data.att_name : ""}
        />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderDatePicker
 * @description render date picker
 */
export const renderYearPicker = (data, noValidate, isLabelShow) => {
  function onChange(date, dateString) {}
  function disabledDate(current) {
    // Can not select days afterthe date
    return current && current.valueOf() > Date.now();
  }
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <DatePicker
          onChange={onChange}
          picker="year"
          disabledDate={disabledDate}
          placeholder={!isLabelShow ? data.att_name : "Please Choose"}
        />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderText
 * @description render text input field
 */
export const renderText = (data, noValidate, isLabelShow) => {
  let is_measure_unit =
    data.slug === "Land Size" ||
    data.slug === "Floor Size" ||
    data.slug === "Area Size";
  let measure_unit =
    data.measure_unit && Array.isArray(data.measure_unit)
      ? data.measure_unit
      : data.measure_unit.split(",");
  const selectAfter = (
    <Select defaultValue="sq meters" className="select-after">
      {measure_unit &&
        measure_unit.length !== 0 &&
        measure_unit.map((keyName, i) => {
          return (
            <Option key={i} value={keyName}>
              {keyName}
            </Option>
          );
        })}
    </Select>
  );
  return (
    <div className="area-size-block">
      <Form.Item
        className="select-label"
        label={
          <div style={{ display: "inline-flex" }}>
            {isLabelShow && data.att_name}
            {isLabelShow && is_measure_unit && (
              <Form.Item name={`${data.att_name}_measure_unit`}>
                <Select
                  defaultValue="sq meters"
                  dropdownClassName="true"
                  showArrow="true"
                >
                  {measure_unit &&
                    measure_unit.length !== 0 &&
                    measure_unit.map((keyName, i) => {
                      return (
                        <Option key={i} value={keyName}>
                          {keyName}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            )}
          </div>
        }
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        {isLabelShow ? (
          <Input placeholder={!isLabelShow ? data.att_name : "Type here"} />
        ) : (
          <Input
            placeholder={!isLabelShow ? data.att_name : "Type here"}
            addonAfter={selectAfter}
          />
        )}
      </Form.Item>
    </div>
  );
};

/**
 * @method renderEmail
 * @description render email input field
 */
export const renderEmail = (data, noValidate, isLabelShow) => {
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required(""), email]}
      >
        <Input placeholder={!isLabelShow ? data.att_name : ""} />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderTextArea
 * @description render text area input field
 */
export const renderTextArea = (data, noValidate, isLabelShow) => {
  const controls = ["bold", "italic", "underline", "separator"];
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        {/* <TextArea
                    placeholder={!isLabelShow ? data.att_name : 'Type here'}
                /> */}
        <BraftEditor
          value={""}
          controls={controls}
          contentStyle={{ height: 150 }}
          className={"input-editor"}
          language="en"
        />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderRadio
 * @description render radio button
 */
export const renderRadio = (data, noValidate, isLabelShow) => {
  console.log("radio option", data);
  function onChange(e) {
    // value=e.target.value
  }
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}

        // valuePropName='checked'
      >
        {/* <Radio onChange={onChange}>{data.att_name}</Radio> */}
        <Radio.Group onChange={onChange}>
          {data.value &&
            Array.isArray(data.value) &&
            data.value.length &&
            data.value.map((el, i) => {
              return (
                <Radio key={i} value={el.id}>
                  {el.name}
                </Radio>
              );
            })}
        </Radio.Group>
      </Form.Item>
    </div>
  );
};

/**
 * @method renderTimePicker
 * @description render time picker
 */
export const renderTimePicker = (data, noValidate, isLabelShow) => {
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        // rules={!noValidate && data.validation === 1 && [required('')]}
      >
        {/* <TimePicker /> */}
        <TimePicker
          minuteStep={30}
          // onChange={this.onChange}
          // value={this.state.time}
        />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderTimePicker
 * @description render time picker
 */
export const renderUrl = (data, noValidate, isLabelShow) => {
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <Input addonBefore="http:" addonAfter=".com" />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderTimePicker
 * @description render time picker
 */
export const renderColor = (data, noValidate, isLabelShow) => {
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <Input type="color" />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderRangePicker
 * @description render time picker
 */
export const renderRangePicker = (data, noValidate, isLabelShow) => {
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <Slider
          marks={{
            0: "10",
            20: "20",
            40: "40",
            60: "60",
            80: "80",
            100: "100",
          }}
        />
      </Form.Item>
    </div>
  );
};

/**
 * @method renderCheckBox
 * @description render checkbox
 */
export const renderCheckBox = (data, noValidate, isLabelShow) => {
  function onChange(e) {}
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <Checkbox onChange={onChange}>Checkbox</Checkbox>
      </Form.Item>
    </div>
  );
};

/**
 * @method renderFileInput
 * @description render file input field
 */
export const renderFileInput = (data, noValidate, isLabelShow) => {
  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <Upload {...props}>
          <Button>
            <UploadOutlined /> Click to Upload
          </Button>
        </Upload>
      </Form.Item>
    </div>
  );
};

/**
 * @method renderDragAndDropFileInput
 * @description render drag and drop file input field
 */
export const renderDragAndDropFileInput = (data, noValidate, isLabelShow) => {
  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <div>
      <Form.Item
        label={isLabelShow && data.att_name}
        name={data.att_name}
        rules={!noValidate && data.validation === 1 && [required("")]}
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
      </Form.Item>
    </div>
  );
};
