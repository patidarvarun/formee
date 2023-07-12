import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Modal, Layout, Button, Row, Col } from "antd";
import {
  sendFormmeInvoice,
  generateInvoice,
  enableLoading,
  disableLoading,
} from "../../actions";
import "ant-design-pro/dist/ant-design-pro.css";
// import '../vendorretail.less'
import DocsResume from "./pdf/DocsResume";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Document, Page, pdfjs } from "react-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PDFResumeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toUser: "",
      fromUser: "",
      messageData: "",
      subTotal: "",
      pageNumber: 1,
      numPages: null,
    };
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    if (!this.state.numPages)
      this.setState({
        numPages,
      });
  };
  // printDocument(type) {
  //   html2canvas(document.querySelector("#rootClass")).then((canvas) => {
  //     document.body.appendChild(canvas);
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, "PNG", 0, 0);
  //     if (type == "download") {
  //       pdf.save("download.pdf");
  //     } else {
  //       window.open(pdf.output("bloburl"), "_blank");
  //     }
  //   });
  // }
  handleZoomIn() {
    console.log("SSSSSSDDDDD");
  }
  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible } = this.props;
    const { pageNumber, numPages } = this.state;

    return (
      <Layout>
        <Modal
          title=""
          visible={visible}
          footer={false}
          onCancel={this.props.onClose}
          className="select-delivery-option payment-status-model payment-receipt-modal"
        >
          {/* <div
            className="receipt-modal-header"
            style={{
              position: "fixed",
              top: "0px",
              left: "0px",
              minWidth: "100%",
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              height: "70px",
              padding: "0px 100px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <ArrowLeftOutlined
                style={{
                  margin: "10px",
                }}
                onClick={this.props.onClose}
              />
              <FilePdfOutlined
                style={{
                  margin: "10px",
                }}
              />
              <span
                style={{
                  margin: "10px",
                }}
              >
                Invoice
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <PrinterOutlined
                style={{
                  margin: "10px",
                }}
                onClick={() => {
                  this.printDocument("print");
                }}
              />
              <DownloadOutlined
                style={{
                  margin: "10px",
                }}
                onClick={() => {
                  this.printDocument("download");
                }}
              />
            </div> */}
          {/* </div> */}
          {/* <div>
            <img src={require("./Booking detail.jpg")}></img>
          </div> */}
          <DocsResume
            onLoadSuccess={this.onDocumentLoadSuccess}
            isViewResume={this.props.isViewResume ? true : false}
            enquiryDetails={this.props.enquiryDetails}
            
            // orderData={this.props.orderData}
            // booking_type={this.props.booking_type}

            // order_id={this.props.order_id}
            // user_id={this.props.user_id}
           
          > 
            <Page pageNumber={pageNumber} />
          </DocsResume>
          {/* <Document
            file={{
              url: "https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf",
            }}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document> */}
          {/* <p>
            Page {pageNumber} of {numPages}
          </p> */}
          {/* <Button
            className="btn-close"
            onClick={() => {
              this.setState({ receiptModalEventBooking: false });
            }}
          >
            Close
          </Button> */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#ccc",
                width: "6em",
                borderRadius: "20px",
              }}
            >
              {/* <PlusCircleOutlined onClick={this.handleZoomIn} />
              <img
                src={require("../booking/checkout/magnifier.svg")}
                // src={require("./magnifier.svg")}
                style={{
                  height: "18px",
                }}
              />
              <MinusCircleOutlined onClick={this.handleZoomOut} /> */}
            </div>
          </div>
        </Modal>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
  };
};
export default connect(mapStateToProps, {
  sendFormmeInvoice,
  generateInvoice,
  enableLoading,
  disableLoading,
})(PDFResumeModal);
