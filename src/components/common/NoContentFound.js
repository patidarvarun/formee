import React from "react";
import { Empty } from "antd";
import { Typography } from "antd";

const { Title } = Typography;

const NoContentFound = () => {
  return (
    <div className="mt-30 ml-30 no-records">
      {/* <Empty description={'No record found.'} /> */}
      {/* <img
        src={require("../../assets/images/no-record.png")}
        alt=""
        width="80"
      /> */}
      <Title level={3} className="text-black1">
        No records found
      </Title>
    </div>
  );
};

export default NoContentFound;
