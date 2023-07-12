import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import moment from "moment";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Typography,
  Button,
  Input,
  Form,
  Collapse,
  Select,
  DatePicker,
} from "antd";
import {
  enableLoading,
  disableLoading,
  addMultiPassengerDetails,
  getFlightPnrNumber,
} from "../../../../../actions/index";
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/booking-form.less";
import BookingDetailBlock from "./BookingDetailsBlock";
import { validMobile9, required } from "../../../../../config/FormValidation";
import { NATIONALITY } from "../../../../../config/Constant";

const { Option } = Select;

const { Title, Paragraph, Text } = Typography;

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

function onChange(date, dateString) {
  console.log(date, dateString);
}
class TravellersDetails extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      months: [
        { label: "Jan", value: "01" },
        { label: "Feb", value: "02" },
        { label: "Mar", value: "03" },
        { label: "Apr", value: "04" },
        { label: "May", value: "05" },
        { label: "Jun", value: "06" },
        { label: "Jul", value: "07" },
        { label: "Aug", value: "08" },
        { label: "Sep", value: "09" },
        { label: "oct", value: "10" },
        { label: "Nov", value: "11" },
        { label: "Dec", value: "12" },
      ],
      nations: NATIONALITY,
    };
  }

  /**
   * @method onFinish
   * @description called to submit form
   */
  onFinish = async (values) => {
    const { search_params, selectedFlight, random_token } = this.props;
    console.log(search_params, "traveler", selectedFlight);
    console.log("values: ", values);
    let reqData = {};
    reqData.token = random_token;
    const user_info = [];
    values.travellers.map((el) => {
      const {
        title,
        first_name,
        last_name,
        middle_name,
        gender,
        nationality,
        dd,
        mm,
        yy,
        passprt_month,
        passprt_dob,
        passprtId,
        passprt_year,
        mobile_phone_no,
        mobile_phone_code,
      } = el;
      console.log(moment(yy).year, "passprt_year: ", passprt_year);
      user_info.push({
        title,
        first_name,
        last_name,
        middle_name,
        gender,
        nationality,
        dob: `${moment(yy).year()}-${mm}-${dd}`,
        id_proff: {
          expiration_date: `${moment(
            passprt_year
          ).year()}-${passprt_month}-${passprt_dob}`,
          type: "Passport",
          id: passprtId,
        },
      });
    });
    reqData.user_info = user_info;
    reqData.contact_info = {
      email: values.email,
      phone_no: `${values.mobile_phone_code}${values.mobile_phone_no}`,
      address: "indore",
    };
    reqData.flights_airSell = {
      passenger: search_params && search_params.reqData.passenger,
      paxPreferences: selectedFlight && selectedFlight.paxReferences,
      type: search_params && search_params.reqData.type,
      segment: selectedFlight && selectedFlight.segments,
    };
    console.log("reqData: ", reqData);
    this.props.enableLoading();


    let p1 = await new Promise((resolve, reject) => {
      this.props.addMultiPassengerDetails(reqData, (res) => {
        console.log("res: ", res);
        if (res.status === 200) {
          resolve({ isFav: res.data.data })
        } else {
          this.props.disableLoading()
          console.log('error pnr')
          toastr.warning('No PNR found.', 'Unable to proceed next step')
          reject()
        }
      })
    })

    let p2 = await new Promise((resolve, reject) => {
      this.props.getFlightPnrNumber({ token: reqData.token }, (res) => {
        this.props.disableLoading()
        if (res.data && res.data.code === 200) {
          console.log("res: pnr >>", res.data.PNR_number);
          this.props.changeNextStep(2, res.data.PNR_number);
          resolve()
        } else {
          reject()
        }
      });

    })

    // this.props.addMultiPassengerDetails(reqData, (res) => {
    //   this.props.disableLoading();
    //   console.log("res: ", res);
    //   if (res.status === 200) {
    //   }
    // })


    // this.props.addMultiPassengerDetails(reqData, (res) => {
    //   this.props.disableLoading();
    //   console.log("res: ", res);
    //   if (res.status === 200) {
    //     toastr.success("Passenger has been added successfully");

    //     this.props.getFlightPnrNumber({ token: reqData.token }, (res) => {
    //       if (res.data && res.data.code === 200) {
    //         console.log("res: pnr >>", res.data.PNR_number);
    //         this.props.changeNextStep(2, res.data.PNR_number);
    //       }
    //     });
    //   }
    // });
  };

  /**
   * @method renderFormModule
   * @description add passenger details
   */
  renderFormModule = () => {
    const { months, nations } = this.state;
    let currentField = this.getInitialValue().travellers
    console.log('currentField: ', currentField);

    return (
      <Fragment>
        <Form.List name="travellers">
          {(fields, { add, remove }) => {
            console.log('fields: ', fields);
            return (
              <div className="booking-form-box">
                <Collapse
                  className="passenger-form-collapse"
                  defaultActiveKey={[1]}
                  onChange={callback}
                >
                  {fields.map((field, index) => (
                    <Panel
                      //  activePanel={1}
                      key={field.fieldKey + 1}
                      header={
                        <div className="d-flex">
                          <img
                            src={require("../../../../../assets/images/icons/user-default-preview.svg")}
                            alt="user-default-preview"
                          />
                          {console.log(
                            "field.fieldKey + 1: ",
                            currentField[field.fieldKey].type
                          )}
                          {currentField[field.fieldKey] ? <p>{`${currentField[field.fieldKey].type} ${currentField[field.fieldKey].index}`} </p> : ''}
                        </div>
                      }
                    >
                      <div className="passenger-booking-form">
                        {/* <Form layout="vertical"> */}
                        <Row gutter={16}>
                          <Col md={24}>
                            <Form.Item
                              label="Title"
                              name={[field.name, "title"]}
                              fieldKey={[field.fieldKey, "title"]}
                              rules={[required("")]}
                            >
                              <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="..."
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                  optionA.children
                                    .toLowerCase()
                                    .localeCompare(
                                      optionB.children.toLowerCase()
                                    )
                                }
                              >
                                <Option value="Ms">Ms</Option>
                                <Option value="Miss">Miss</Option>
                                <Option value="Mrs">Mrs</Option>
                                <Option value="Mr">Mr</Option>
                                <Option value="Dr">Dr</Option>
                                <Option value="Prof">Prof</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col md={8}>
                            <Form.Item
                              label="First / Given name"
                              name={[field.name, "first_name"]}
                              fieldKey={[field.fieldKey, "first_name"]}
                              rules={[required("")]}
                            >
                              <Input placeholder="..." />
                            </Form.Item>
                          </Col>
                          <Col md={8}>
                            <Form.Item
                              label="Middle name"
                              name={[field.name, "middle_name"]}
                              fieldKey={[field.fieldKey, "middle_name"]}
                            //rules={[required("")]}
                            >
                              <Input placeholder="..." />
                            </Form.Item>
                          </Col>
                          <Col md={8}>
                            <Form.Item
                              label="Last name"
                              name={[field.name, "last_name"]}
                              fieldKey={[field.fieldKey, "last_name"]}
                              rules={[required("")]}
                            >
                              <Input placeholder="..." />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          {/* <Row gutter={16}> */}
                          <Col md={7}>
                            <Form.Item
                              label="Nationality"
                              name={[field.name, "nationality"]}
                              fieldKey={[field.fieldKey, "nationality"]}
                              rules={[required("")]}
                            >
                              <Select
                                showSearch
                                placeholder="..."
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                  optionA.children
                                    .toLowerCase()
                                    .localeCompare(
                                      optionB.children.toLowerCase()
                                    )
                                }
                              >
                                {nations &&
                                  nations.map((el) => {
                                    return <Option value={el}>{el}</Option>;
                                  })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col md={5}>
                            <Form.Item
                              label="Gender"
                              name={[field.name, "gender"]}
                              fieldKey={[field.fieldKey, "gender"]}
                              rules={[required("")]}
                            >
                              <Select
                                showSearch
                                placeholder="..."
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                  optionA.children
                                    .toLowerCase()
                                    .localeCompare(
                                      optionB.children.toLowerCase()
                                    )
                                }
                              >
                                <Option value="Male">Male</Option>
                                <Option value="Female">Female</Option>
                                <Option value="Nor specified">Not specified</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col md={12}>
                            <Col md={24} style={{ paddingLeft: "0", paddingBottom:"12px" }}>
                              <lable style={{ fontFamily: "Poppins" }}>
                                Date of birth
                                <span style={{ color: "red" }}>*</span>
                              </lable>
                            </Col>
                            <Row className="date-month-year-box" style={{margin:"0"}}>
                              <Col md={7}>
                                <Form.Item
                                  name={[field.name, "dd"]}
                                  fieldKey={[field.fieldKey, "dd"]}
                                  className="date-of-birth"
                                  rules={[required("")]}
                                >
                                  <Select
                                    showSearch
                                    placeholder="Date"
                                    optionFilterProp="children"
                                  >
                                    {Array.from(
                                      { length: 30 },
                                      (_, i) => i + 1
                                    ).map((el) => {
                                      let numLength = String(el).length;
                                      let val = numLength < 2 ? `0${el}` : el;
                                      return <Option value={val}>{val}</Option>;
                                    })}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col md={10}>
                                <Form.Item
                                  // label="Title:"
                                  name={[field.name, "mm"]}
                                  fieldKey={[field.fieldKey, "mm"]}
                                  className="month-of-birth"
                                  rules={[required("")]}
                                >
                                  <Select
                                    showSearch
                                    placeholder="Month"
                                    optionFilterProp="children"
                                  >
                                    {months.map((el) => {
                                      return (
                                        <Option value={el.value}>
                                          {el.label}
                                        </Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col md={7}>
                                <Form.Item
                                  // label="Date of birth"
                                  name={[field.name, "yy"]}
                                  fieldKey={[field.fieldKey, "yy"]}
                                  className="year-of-birth"
                                  rules={[required("")]}
                                >
                                  {/* <Space direction="vertical"> */}
                                  <DatePicker
                                    onChange={onChange}
                                    picker="year"
                                    placeholder="Year"
                                    disabledDate={(current) => {
                                      var d = new Date(current);
                                      var currentYear = new Date();
                                      return d.getFullYear() > currentYear.getFullYear()
                                    }}
                                  />
                                  {/* </Space> */}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          {/* </Row> */}
                        </Row>
                        <Row gutter={16}>
                          <Col md={12}>
                            <Form.Item
                              label="Passport or ID number"
                              name={[field.name, "passprtId"]}
                              fieldKey={[field.fieldKey, "passprtId"]}
                              rules={[required("")]}
                            >
                              <Input placeholder="..." />
                            </Form.Item>
                          </Col>
                          <Col md={12}>
                            <Col md={24} style={{ paddingLeft: "0" }}>
                              <Col md={24} style={{ paddingLeft: "0" , paddingBottom:"12px" }}>
                                <lable style={{ fontFamily: "Poppins" }}>
                                  Passport or ID expiry date
                                  <span style={{ color: "red" }}>*</span>
                                </lable>
                              </Col>
                              <Row className="date-month-year-box"  style={{margin:"0"}}>
                                <Col md={7}>
                                  <Form.Item
                                    // label="Date of birth"
                                    name={[field.name, "passprt_dob"]}
                                    fieldKey={[field.fieldKey, "passprt_dob"]}
                                    className="date-of-birth"
                                    rules={[required("")]}
                                  >
                                    <Select
                                      showSearch
                                      placeholder="Date"
                                      optionFilterProp="children"
                                    >
                                      {Array.from(
                                        { length: 30 },
                                        (_, i) => i + 1
                                      ).map((el) => {
                                        let numLength = String(el).length;
                                        let val = numLength < 2 ? `0${el}` : el;
                                        return (
                                          <Option value={val}>{val}</Option>
                                        );
                                      })}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col md={10}>
                                  <Form.Item
                                    // label="Title:"
                                    className="month-of-birth"
                                    rules={[required("")]}
                                    name={[field.name, "passprt_month"]}
                                    fieldKey={[field.fieldKey, "passprt_month"]}
                                  >
                                    <Select
                                      placeholder="Month"
                                      optionFilterProp="children"
                                    >
                                      {months.map((el) => {
                                        return (
                                          <Option value={el.value}>
                                            {el.label}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col md={7}>
                                  <Form.Item
                                    // label="Date of birth"
                                    name={[field.name, "passprt_year"]}
                                    fieldKey={[field.fieldKey, "passprt_year"]}
                                    className="year-of-birth"
                                    rules={[required("")]}
                                  >
                                    {/* <Space direction="vertical"> */}
                                    <DatePicker
                                      onChange={onChange}
                                      picker="year"
                                      placeholder="Year"
                                      disabledDate={(current) => {
                                        var d = new Date(current);
                                        var currentYear = new Date();
                                        return d.getFullYear() < currentYear.getFullYear()
                                      }}

                                    />
                                    {/* </Space> */}
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Col
                                md={24}
                                style={{
                                  paddingLeft: "25px",
                                  paddingTop: "10px",
                                }}
                              >
                                {/* <lable style={{ fontFamily: "Poppins" }}>
                                  No expiry
                                </lable> */}
                              </Col>
                            </Col>
                          </Col>
                        </Row>
                        {/* </Form> */}
                      </div>
                      <div className="collapse-footer">
                        {/* <Collapse defaultActiveKey={["1"]} onChange={callback}>
                          <Panel
                            defaultActiveKey={[`${field.key}-flyer`]}
                            header={
                              <div className="d-flex">
                                <img
                                  src={require("../../../../../assets/images/icons/blue-flight-star.svg")}
                                  alt="blue-flight-star"
                                />
                                <p>Add Frequent Flyer Number</p>
                              </div>
                            }
                            key={`${field.key}-flyer`}
                          >
                            <Row gutter={16}>
                              <Col md={12} className="label-height">
                                <Form.Item
                                  label="Card Type:"
                                >
                                  <Select
                                    showSearch
                                    placeholder="Select card type"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    filterSort={(optionA, optionB) =>
                                      optionA.children
                                        .toLowerCase()
                                        .localeCompare(
                                          optionB.children.toLowerCase()
                                        )
                                    }
                                  >
                                    <Option value="1">Not Identified</Option>
                                    <Option value="2">Closed</Option>
                                    <Option value="3">Communicated</Option>
                                    <Option value="4">Identified</Option>
                                    <Option value="5">Resolved</Option>
                                    <Option value="6">Cancelled</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col md={11}>
                                <Form.Item label="Card Number:">
                                  <Input placeholder="..." />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Panel>
                        </Collapse> */}
                      </div>
                    </Panel>
                  ))}

                  {/* <Row gutter={0}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        style={{ paddingBottom: "30px" }}
                        className="add-card-link-mb-0"
                      >
                        <Button
                          type="primary"
                          className="add-btn add-passenger"
                          onClick={() => {
                            console.log("ADDD btn >>");
                            // let currentField = this.formRef.current.getFieldsValue()
                            // this.setState({ activePanel: currentField.education.length + 1 })

                            // if (currentField.education.length >= 5) {
                            //   toastr.warning(langs.warning, langs.messages.education_length_warning)
                            // } else {
                            add();
                            // }
                          }}
                        >
                          Add Passenger
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row> */}
                </Collapse>
              </div>
            );
          }}
        </Form.List>
      </Fragment>
    );
  };

  /**
   * @method getInitialValue
   * @description get initial values
   */
  getInitialValue = () => {
    let data = this.props.search_params.reqData.passenger;
    console.log("data: ", data);
    if (data) {
      const initialArray = [];
      Array.from({ length: data.adult }, (_, i) => i + 1).map((el, i) => {
        initialArray.push({ type: "Adult", index: i + 1 });
      });
      Array.from({ length: data.child }, (_, i) => i + 1).map((el, i) => {
        initialArray.push({ type: "Child", index: i + 1 });
      });
      Array.from({ length: data.infant }, (_, i) => i + 1).map((el, i) => {
        initialArray.push({ type: "Infant", index: i + 1 });
      });

      console.log("initialArray: ", initialArray);
      let temp = {
        name: "passengers",
        travellers: initialArray,
      };
      return temp;
    }
  };

  render() {
    const { search_params, selectedFlight } = this.props;
    console.log(search_params, "traveler", selectedFlight);
    return (
      <div className="booking-tourism-box tourism-booking-form-box">
        <div>
          <div className="page-heading-container">
            <h2>Travellers</h2>
            <p>
              <Text type="danger">* = mandatory fields</Text>
            </p>
            <p>
              Please ensure that names entered match passport and/or photo
              identification or boarding maybe denied
            </p>
          </div>
          <div>
            <Form
              onFinish={this.onFinish}
              layout={"vertical"}
              ref={this.formRef}
              id={"add-passenger"}
              initialValues={this.getInitialValue()}
              scrollToFirstError={true}
            // {{
            //   name: "education",
            //   travellers: [{ id: 1, type: "adult" }],
            // }}
            >
              <Row gutter={16}>
                <Col md={16}>
                  <div className="contact-information-container">
                    <div className="contact-information-heading">
                      <h2>
                        <img
                          src={require("../../../../../assets/images/icons/email-orange.svg")}
                          alt="airline-logo"
                        />
                        Contact information for all passengers
                      </h2>
                    </div>

                    <div className="contact-information-form">
                      <Row gutter={16}>
                        <Col md={12}>
                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[required("")]}
                          >
                            <Input placeholder="..." />
                          </Form.Item>
                        </Col>

                        <Col md={4}>
                          <Form.Item
                            label="Mobile Phone"
                            name="mobile_phone_code"
                          //   rules={[required("")]}
                          >
                            <Select
                              allowClear
                              placeholder="+61 Aust..."
                              optionFilterProp="children"
                              defaultValue={+61}
                              disabled={true}
                            >
                              <Option value={61}>{"+61"}</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col md={8} className="label-height">
                          <Form.Item
                            label="Mobile Phone"
                            name="mobile_phone_no"
                            rules={[{ validator: validMobile9 }]}
                          >
                            <Input placeholder="Incase we need to reach you"/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {this.renderFormModule()}
                </Col>
                <Col md={8}>
                  <BookingDetailBlock {...this.props} />
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { tourism } = store;
  const { flight_search_params } = tourism;
  return {
    search_params: flight_search_params,
  };
};

export default connect(mapStateToProps, {
  addMultiPassengerDetails,
  enableLoading,
  disableLoading,
  getFlightPnrNumber,
})(withRouter(TravellersDetails));
