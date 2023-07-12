import React from "react";
import { DownloadOutlined } from "@ant-design/icons";
export default (props) => {
  const bodyRef = React.createRef();
  const createPdf = () => props.createPdf(bodyRef.current);
  return (
    <section className="pdf-container">
      <section className="pdf-toolbar">
        <button onClick={createPdf}>
          {/* <DownloadOutlined /> */}
          <img
            src={require("../assets/images/icons/download-v3.svg")}
            alt="download"
          />
        </button>
      </section>
      <section className="pdf-body" ref={bodyRef}>
        {props.children}
      </section>
    </section>
  );
};
