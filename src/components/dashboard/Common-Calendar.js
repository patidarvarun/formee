import React from "react";
import { Calendar, Select, Radio, Col, Row, Badge } from "antd";
import Icon from "../customIcons/customIcons";
import moment from "moment";
// import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
//import styled from "styled-components";

function dateCellRender(value, props) {
  // console.log('value: ^ ', moment(value).format("D"));
  let index = -1;
  if (Array.isArray(props.events)) {
    index = props.events.findIndex(
      (x) =>
        moment(x.created_at).format("YYYY-MM-DD") ===
        moment(value).format("YYYY-MM-DD")
    );
  }

  return <div className='ant-picker-cell-inner ant-picker-calendar-date' onClick={() => {
    console.log('Hello ^^ ');
    props.onPanelChange(value, 'date')

  }}>
    <div class="ant-picker-calendar-date-value" >{moment(value).format("D")}</div>
    <div className='ant-picker-calendar-date-content'>
      {index >= 0 && <div className="events">
        <Badge status={"warning"} />
      </div>}
    </div>
  </div>
}

const StylingCalendar = (props) => (
  <Row className="hello">
    <Col span={24}>
      <div>
        <Calendar
          fullscreen={false}
          headerRender={({ value, type, onChange, onTypeChange }) => {
            console.log('value', value)
            const start = 0;
            const end = 12;
            const monthOptions = [];

            const current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i++) {
              current.month(i);
              months.push(localeData.months(current));
            }

            for (let index = start; index < end; index++) {
              monthOptions.push(
                <Select.Option className="month-item" key={`${index}`}>
                  {months[index]}
                </Select.Option>
              );
            }
            const month = value.month();

            const year = value.year();
            const options = [];
            for (let i = year - 10; i < year + 10; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>
              );
            }

            return (
              <div className="heading-block">
                <Row>
                  <Col span={2}>
                    <Icon
                      icon="arrow-left"
                      size="13"
                      className="icon"
                      onClick={() => {
                        const newValue = value.clone();
                        newValue.month(parseInt(month - 1, 10));
                        onChange(newValue);
                        props.onPanelChange(newValue, 'month')
                        console.log('mode: $$$ ', props);
                      }}
                    />
                  </Col>
                  <Col span={20}>
                    <h2>{`${String(months[month])} ${year}`}</h2>
                  </Col>
                  <Col span={2}>
                    <Icon
                      icon="arrow-right"
                      size="13"
                      className="icon"
                      onClick={() => {
                        const newValue = value.clone();
                        newValue.month(parseInt(month + 1, 10));
                        onChange(newValue);
                        props.onPanelChange(newValue, 'month')
                        console.log(newValue,'onIcon Click ^',value);
                        //  console.log(moment(8,'DD').format("YYYY-MM-DD"), 'mode: ^^ ', months[month + 1]);
                      }}
                    />
                  </Col>
                </Row>
              </div>
            );
          }}         
          dateFullCellRender={(value) => dateCellRender(value, props)}
        />
      </div>
    </Col>
  </Row>
);

// const RightArrow = styled(FaChevronRight)`
//   cursor: pointer;
// `;

// const LeftArrow = styled(FaChevronLeft)`
//   cursor: pointer;
// `;

export default StylingCalendar;
