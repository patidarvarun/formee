import React, { useState } from "react";
import { Calendar, Modal, Typography } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
const { Text, Title } = Typography;
const VendorTimeSlot = (props) => {
  const {
    selectedBookingDate,
    onDateClick,
    updateCurrentMonth,
    moment,
    currentMonth,
    currentYear,
  } = props;

  const [visibleManageSlotTime, setVisibleManageSlotTime] = useState(false);
  const [visibleSuccessModal, setVisibleSuccessModal] = useState(false);

  return (
    <div>
      <div className="appointments-slot mt-20 available-time-slots">
        <div className="appointments-heading">
          <div className="date">
            {/* {moment(selectedBookingDate).format("MMM D YYYY")} */}
            Available time slots
          </div>
          <div className="appointments-count">
            {/* {vendorBookingList &&
                                    vendorBookingList.length}{" "} */}

            {moment(selectedBookingDate).format("MMM D YYYY")}
          </div>
        </div>
        <div
          className="am-pm"
          // style={{
          //   margin: "10px 0",
          //   textAlign: "center",
          //   fontWeight: "bold",
          // }}
        >
          {/* {moment(selectedBookingDate).format("MMM D YYYY")} */}
          AM
        </div>
        <div className="">
          {/* {isDataAvailable == true
                              ? this.renderBokingCalenderItems()
                              : ""} */}
          <div className="available-time-slots">
            <div
              className="time-slot-row"
              // style={{
              //   display: "flex",
              //   justifyContent: "space-between",
              //   alignItems: "center",
              //   margin: "9px 0",
              // }}
            >
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                8: 00 am
              </button>
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                8: 30 am
              </button>
            </div>
            <div
              className="time-slot-row"
              // style={{
              //   display: "flex",
              //   justifyContent: "space-between",
              //   alignItems: "center",
              //   margin: "9px 0",
              // }}
            >
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                9: 00 am
              </button>
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                9: 30 am
              </button>
            </div>
            <div
              className="time-slot-row"
              // style={{
              //   display: "flex",
              //   justifyContent: "space-between",
              //   alignItems: "center",
              //   margin: "9px 0",
              // }}
            >
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                9: 00 am
              </button>
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                9: 30 am
              </button>
            </div>
          </div>
        </div>

        <div
          className="am-pm"
          // style={{
          //   margin: "10px 0",
          //   textAlign: "center",
          //   fontWeight: "bold",
          // }}
        >
          {/* {moment(selectedBookingDate).format("MMM D YYYY")} */}
          PM
        </div>
        <div className="">
          {/* {isDataAvailable == true
                              ? this.renderBokingCalenderItems()
                              : ""} */}
          <div className="available-time-slots">
            <div
              className="time-slot-row"
              // style={{
              //   display: "flex",
              //   justifyContent: "space-between",
              //   alignItems: "center",
              //   margin: "9px 0",
              // }}
            >
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 22px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                12: 00 pm
              </button>
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 22px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                12: 30 pm
              </button>
            </div>
            <div
              className="time-slot-row"
              // style={{
              //   display: "flex",
              //   justifyContent: "space-between",
              //   alignItems: "center",
              //   margin: "9px 0",
              // }}
            >
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                1: 00 pm
              </button>
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                1: 30 pm
              </button>
            </div>
            <div
              className="time-slot-row"
              // style={{
              //   display: "flex",
              //   justifyContent: "space-between",
              //   alignItems: "center",
              //   margin: "9px 0",
              // }}
            >
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                3: 00 pm
              </button>
              <button
              // style={{
              //   background: "#fff",
              //   padding: "4px 26px",
              //   border: "1px solid silver",
              //   borderRadius: "3px",
              // }}
              >
                3: 30 pm
              </button>
            </div>
          </div>
        </div>

        <button
          className="manage-time-slot-btn"
          onClick={() => setVisibleManageSlotTime(true)}
        >
          Manage my time slot
        </button>

        <Modal
          // title='Send Quote'
          visible={visibleManageSlotTime}
          className={"custom-modal fm-md-modal style1 time-slot-popup"}
          footer={false}
          onCancel={() => {
            setVisibleManageSlotTime(false);
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            Manage time slot
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              boxShadow: "2px 2px 11px #c4d2dc",
            }}
          >
            {/* Left side section */}
            <div style={{ width: "43%" }}>
              <Calendar
                onSelect={onDateClick}
                //disabledDate={this.disabledDate}
                fullscreen={false}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const month = value.month();
                  const year = value.year();
                  return (
                    <div
                      className="calender-month_name"
                      style={{
                        background: "#e1e1e1",
                        padding: "12.5px 35px",
                      }}
                    >
                      <LeftOutlined
                        onClick={() => {
                          const newValue = value.clone();
                          updateCurrentMonth(
                            moment(newValue).subtract(1, "M").startOf("month")
                          );
                          onChange(newValue.subtract(1, "month"));
                        }}
                      />
                      {moment(
                        `${currentMonth} ${currentYear}`,
                        "MM YYYY"
                      ).format("MMMM YYYY")}
                      <RightOutlined
                        onClick={() => {
                          const newValue = value.clone();
                          this.updateCurrentMonth(
                            moment(newValue).add(1, "M").startOf("month")
                          );
                          onChange(newValue.add(1, "month"));
                        }}
                      />
                    </div>
                  );
                }}
              />
            </div>

            {/* Right side section */}
            <div style={{ width: "57%" }}>
              <div
                style={{
                  background: "#e1e1e1",
                  padding: "10px 30px",
                }}
              >
                <span>Time availablity on Saturday, 4 Feb, 2020</span>
              </div>

              <div style={{ padding: "20px 30px" }}>
                {/* Select time radio button */}
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#6e6b6b",
                    }}
                  >
                    Please select the time for custom mamnage
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {" "}
                      <input name="time" type="radio" />
                      <span style={{ marginLeft: "12px" }}>Open all day</span>
                    </div>
                    <div>
                      <input name="time" type="radio" />
                      <span style={{ marginLeft: "12px" }}>Close all day</span>
                    </div>
                  </div>
                </div>

                {/* Select time AM PM */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                  }}
                >
                  <div>
                    <div
                      className="date"
                      style={{
                        margin: "10px 0",
                        fontWeight: "bold",
                      }}
                    >
                      AM
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                        }}
                      >
                        1: 00 pm
                      </span>
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                          marginLeft: "3px",
                        }}
                      >
                        1: 30 pm
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                        }}
                      >
                        1: 00 pm
                      </span>
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                          marginLeft: "3px",
                        }}
                      >
                        1: 30 pm
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                        }}
                      >
                        1: 00 pm
                      </span>
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                          marginLeft: "3px",
                        }}
                      >
                        1: 30 pm
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                        }}
                      >
                        1: 00 pm
                      </span>
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                          marginLeft: "3px",
                        }}
                      >
                        1: 30 pm
                      </span>
                    </div>
                  </div>

                  <div>
                    <div
                      className="date"
                      style={{
                        margin: "10px 0",
                        fontWeight: "bold",
                      }}
                    >
                      PM
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                          marginRight: "3px",
                        }}
                      >
                        1: 00 pm
                      </span>
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                        }}
                      >
                        1: 30 pm
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                          marginRight: "3px",
                        }}
                      >
                        1: 00 pm
                      </span>
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                        }}
                      >
                        1: 30 pm
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                          marginRight: "3px",
                        }}
                      >
                        1: 00 pm
                      </span>
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                        }}
                      >
                        1: 30 pm
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                          marginRight: "3px",
                        }}
                      >
                        1: 00 pm
                      </span>
                      <span
                        style={{
                          background: "#fff",
                          padding: "2px 4px",
                          border: "1px solid silver",
                          borderRadius: "3px",
                        }}
                      >
                        1: 30 pm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "38px",
            }}
          >
            <button
              style={{
                padding: "11px 60px",
                margin: "10px 0",
                border: "none",
                boxShadow: "2px 2px 11px #c4d2dc",
                color: "#fff",
                background: "orange",
                fontWeight: "bold",
                borderRadius: "3px",
              }}
              onClick={() => {
                setVisibleManageSlotTime(false);
                setVisibleSuccessModal(true);
              }}
            >
              Update
            </button>
          </div>
        </Modal>

        {/* Sucess modal */}
        <Modal
          // title='Send Quote'
          visible={visibleSuccessModal}
          className={"custom-modal style1 booking-confirmation-modal"}
          footer={false}
          onCancel={() => {
            setVisibleSuccessModal(false);
          }}
        >
          <div className="padding">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px 0",
              }}
            >
              <CheckCircleFilled
                style={{ fontSize: "35px", color: "#0cb50c" }}
              />
            </div>
            <Title level={3} style={{ color: "#0cb50c" }}>
              Your time slot has been updated
            </Title>
            <div style={{ marginTop: "20px" }}>
              <p style={{ textAlign: "center", marginBottom: "0px" }}>
                Saturday, 4 Feb, 2020
              </p>
              <p style={{ textAlign: "center", marginBottom: "0px" }}>
                Sunday, 5 Feb, 2020
              </p>
              <p style={{ textAlign: "center", marginBottom: "0px" }}>
                Monday, 6 Feb, 2020
              </p>
              <p style={{ textAlign: "center", marginBottom: "0px" }}>
                Wednesday, 8 Feb, 2020
              </p>
              <p style={{ textAlign: "center", marginBottom: "0px" }}>
                Friday, 9 Feb, 2020
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default VendorTimeSlot;
