import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  Typography,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Checkbox,
  Radio,
  Card,
  Row,
  Col,
} from "antd";
import { required } from "../../../../../config/FormValidation";
import { getFoodTypes } from "../../../../../actions";
import moment from "moment";
import { convertTime24To12Hour } from "../../../../common";

const { Title, Text } = Typography;
const { TextArea } = Input;

class SelectDateForEvents extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      retailSelected: false,
      classifiedSelected: false,
      category: "",
      hasEventType: false,
      eventTypes: [],
      dietaries: [],
      selectedDietaries:
        this.props.reqData.dietaries.length > 0
          ? this.props.reqData.dietaries
          : [],
      cusines: [],
    };
  }

  componentDidMount() {
    this.props.getFoodTypes((res) => {
      //
      if (res.status === 200) {
        let cusines =
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length
            ? res.data.data
            : [];
        this.setState({ cusines: cusines });
      }
    });
    this.setState({ dietaries: this.props.reqData.dietaries });
  }

  /**
   * @method onClickNext
   * @description onClickNext
   */

  onFinish = (values) => {
    const { selectedDietaries, cusines } = this.state;
    if (this.onFinishFailed() !== undefined) {
      return true;
    } else {
      if (values !== undefined) {
        let req = {
          booking_date: moment(values.booking_date).format("DD-MM-YYYY"),
          start_time: moment(values.start_time).format("HH:mm"),
          end_time: moment(values.end_time).format("HH:mm"),
        };

        // call update api
        // this.props.onClose();
        this.props.onSuccess();
      }
    }
  };

  /**
   * @method onFinishFailed
   * @description handle form submission failed
   */
  onFinishFailed = (errorInfo) => {
    return errorInfo;
  };

  renderEventTypes = (eventTypes) => {
    if (eventTypes) {
      return eventTypes.map((el, i) => {
        return (
          <Select.Option key={i} value={el.id}>
            {el.name}
          </Select.Option>
        );
      });
    }
  };

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  onChangeStartTime = (time, timeString) => {
    //
  };

  onChangeEndTime = (time, timeString) => {
    //
  };

  onChangeServingStartTime = (timeString) => {
    //
  };
  renderDietaries = () => {
    const { dietaries } = this.state;
    return (
      Array.isArray(dietaries) &&
      dietaries.map((el, i) => {
        let isSelected = this.state.selectedDietaries.includes(el.id);
        return (
          <Checkbox
            key={`${i}_dietaries`}
            checked={isSelected}
            onClick={(e) => {
              let temp = this.state.selectedDietaries;
              if (!isSelected) {
                temp.push(el.id);
                this.setState({ selectedDietaries: temp });
              } else {
                temp = temp.filter((k) => k !== el.id);
                this.setState({ selectedDietaries: temp });
              }
            }}
          >
            {el.name}
          </Checkbox>
        );
      })
    );
  };

  renderCusines = (cusines) => {
    if (cusines) {
      return cusines.map((el, i) => {
        return (
          <Select.Option key={i} value={el.id}>
            {el.name}
          </Select.Option>
        );
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { subCategoryName } = this.props;
    const {
      booking_date,
      cusine,
      end_time,
      start_time,
      time,
      no_of_people,
      dietary,
    } = this.props.reqData;
    let formatedBookingDate =
      booking_date !== "" ? moment(booking_date, "DD-MM-YYYY") : "";
    let startTime = start_time != "" ? moment(start_time, "HH:mm") : "";
    let endTime = end_time != "" ? moment(end_time, "HH:mm") : "";
    let servingTime = time != "" ? moment(time, "HH:mm") : "";
    return (
      <Fragment>
        <div className="wrap fm-step-form fm-step-three step-third-block">
          <Form
            name="user-bookinginfo"
            initialValues={{
              booking_date: formatedBookingDate,
              start_time: startTime,
              end_time: endTime,
              time: servingTime,
              no_of_people: no_of_people,
              cusine: cusine,
            }}
            layout="horizontal"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            scrollToFirstError
            id="user-bookinginfo"
            ref={this.formRef}
          >
            <h4 className="fm-input-heading">Requesting Date &amp; Time</h4>
            <Form.Item label="Date" name="booking_date" rules={[required("")]}>
              <DatePicker
                getPopupContainer={(trigger) => trigger.parentElement}
                format={"MM/DD/YYYY"}
                onChange={(e) => {}}
                disabledDate={(current) => {
                  return moment().add(-1, "days") >= current;
                }}
              />
            </Form.Item>

            {(subCategoryName === "Venues" ||
              subCategoryName === "Caterers") && (
              <Form.Item label="Time" style={{ marginBottom: 0 }}>
                <div className="time-date-pick">
                  <div className="time-date-pick-left">
                    <label className="start-end-time-label">Start Time</label>
                    <Form.Item
                      name="start_time"
                      rules={[required("")]}
                      style={{
                        display: "inline-block",
                        width: "calc(97% - 8px)",
                      }}
                    >
                      {/* <TimePicker minuteStep={30} placeholder='Select Start Time' getPopupContainer={trigger => trigger.parentElement} use12Hours onChange={this.onChangeStartTime} /> */}
                      <TimePicker
                        format={"HH:mm A"}
                        placeholder="Select Start Time"
                        minuteStep={30}
                        onChange={this.onChangeStartTime}
                        getPopupContainer={(trigger) => trigger.parentElement}
                      />
                    </Form.Item>
                  </div>
                  <div className="time-date-pick-right">
                    <label className="start-end-time-label">End Time</label>
                    <Form.Item
                      name="end_time"
                      rules={[required("")]}
                      style={{
                        display: "inline-block",
                        width: "calc(100% - 1px)",
                      }}
                    >
                      {/* <TimePicker minuteStep={30} placeholder='Select End Time' getPopupContainer={trigger => trigger.parentElement} use12Hours onChange={this.onChangeEndTime} /> */}
                      <TimePicker
                        format={"HH:mm A"}
                        placeholder="Select End Time"
                        minuteStep={30}
                        onChange={this.onChangeEndTime}
                        getPopupContainer={(trigger) => trigger.parentElement}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form.Item>
            )}

            {subCategoryName !== "Venues" && subCategoryName !== "Caterers" && (
              <Form.Item
                label="Time to be ready by"
                name="time"
                rules={[
                  required(""),
                  // ({ getFieldValue }) => ({
                  //   validator(rule, value) {
                  //     let isServingtime = moment(value).isBetween(getFieldValue('start_time'), getFieldValue('end_time'))
                  //     if (isServingtime !== true) {
                  //       return Promise.reject('serving start time must be between start time and end time.');
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // }),
                ]}
              >
                {/* <TimePicker minuteStep={30} getPopupContainer={trigger => trigger.parentElement} use12Hours onChange={this.onChangeServingStartTime} /> */}
                <TimePicker
                  format={"HH:mm A"}
                  minuteStep={30}
                  onChange={this.onChangeServingStartTime}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            )}
            {/* {(subCategoryName === "Venues" ||
              subCategoryName === "Caterers") && (
              <Form.Item
                rules={[required("")]}
                label="No. of Guests"
                name="no_of_people"
              >
                <Input placeholder={"No. of Guests"} className="shadow-input" />
              </Form.Item>
            )} */}
            {/* {step2Data.permissions.enquire_dietary && <Form.Item className="dietary-label" label='Do you have any dietary required?' name='dietaries'>
              <Card>
                {this.renderDietaries()}
              </Card>
            </Form.Item>} */}
            {/* {step2Data.permissions.enquire_cusine &&
              <Form.Item rules={[required('')]} label='Preferred Cusine' name='cusine' className="preferred-cusine">
                <Select
                  placeholder='Select a Cusine'
                  size='large'
                  allowClear
                  getPopupContainer={trigger => trigger.parentElement}
                >
                  {this.renderCusines(cusines)}
                </Select>
              </Form.Item>} */}
            <Form.Item>
              <div className="steps-action">
                {/* <Button
                  onClick={() => {
                    this.props.preStep();
                  }}
                  type="primary"
                  size="middle"
                  className="btn-trans fm-btn"
                >
                  Back
                </Button> */}
                <Button
                  htmlType="submit"
                  type="primary"
                  size="middle"
                  className="btn-blue fm-btn"
                >
                  Update
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, { getFoodTypes })(SelectDateForEvents);
