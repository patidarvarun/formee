import React, { Component, useRef } from "react";
import { connect } from "react-redux";
import "./style.css";
import {
  sendFormmeInvoice,
  generateInvoice,
  enableLoading,
  disableLoading,
  getBookingIdByEnquiryId,
  eventjobCheckoutSuccess,
  getPaymentOrder,
} from "../../../actions";
import {convertTime24To12Hour } from "../";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";

class DocsResume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      selectedPaymentMethod: "",
      stripePaymentGateWayResponse: "",
      invoiceDetails: "",
      orderInfo:{},
      orderDetails: [],
      promocodeValue: "",
      appliedPromoCode: "",
      promoCodeDiscount: "",
      isClicked: false,
      visible: false,
      enquiryDetails: this.props.isViewResume
              ? this.props.enquiryDetails
        : this.props.checkoutData.state.enquiryBooking,
      booking_type: this.props.booking_type,
      
    };
  }

  componentDidMount() {

    // const obj = {
    //   user_id : this.props.user_id ,
    //   order_id: this.props.order_id,
    // };
    // if(this.props.by !== "orderPage"){
    //   obj.user_id = this.props.orderData.user_id,
    //   obj.order_id = orderInfo.order_id
    // }else{
    //   obj.user_id = this.props.user_id,
    //   obj.order_id =this.props.order_id
    // }
    
    // this.props.getPaymentOrder(obj, (res) => {
    //   if (res.status === 200) {
    //     this.setState({ orderDetails: res.data.data });
    //   } else {
    //   }
    // });
  }

  printDocument(type) {
    html2canvas(document.querySelector("#rootClass")).then((canvas) => {
      document.body.appendChild(canvas);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      if (type == "download") {
        pdf.save("download.pdf");
      } else {
        window.open(pdf.output("bloburl"), "_blank");
      }
    });
  }


  render() {

    const { enquiryDetails,booking_type } = this.state;
    // const {mobile_no} = this.props.loggedInUser;
    // // const {eventjob} = this.props.eventjobCheckoutSuccess(reqData, (res) => {console.log(res,"response paypal")});
    console.log(this.props.loggedInUser,"this.props.logged")
    // console.log(booking_type,"booking_type")
    console.log("VVVVVVVVVVVAAAAAAAAAA", enquiryDetails);
   
    // let date = moment(enquiryDetails.booking_date).format("dddd, MMMM DD YYYY");
    // let time = convertTime24To12Hour(enquiryDetails.booking_time);


    //   // let unique_id = booking_type === "handymanBookingCheckout" ? (enquiryDetails.intent.metadata.job_id ? enquiryDetails.intent.metadata.job_id: enquiryDetails.intent.metadata.event_booking_id) : enquiryDetails.id;

    // let gstTotal = (enquiryDetails.gst_percentage?enquiryDetails.gst_percentage:0) + (enquiryDetails.taxes_fees?enquiryDetails.taxes_fees:0);
    // let sub_total_amout = enquiryDetails.total_amount ? enquiryDetails.total_amount : booking_type === "handymanBookingCheckout" ? (enquiryDetails.amount  ? enquiryDetails.amount : enquiryDetails.intent.amount) : booking_type === "fitness" ? enquiryDetails.sub_total : enquiryDetails.price ? enquiryDetails.price : "" ;
    // let total_amount = sub_total_amout+gstTotal;
    
    // let unique_id = booking_type === "handymanBookingCheckout" ? (enquiryDetails.data.job_data.id ? enquiryDetails.data.job_data.id : enquiryDetails.intent.metadata.event_booking_id) : enquiryDetails.id;

    return (
      <TransformWrapper
        initialScale={1}
        // initialPositionX={300}
        // initialPositionY={200}
      >
        {({ zoomIn, zoomOut, ...rest }) => (
          <React.Fragment>
            <TransformComponent>
              <div id="rootClass" className="invoice-pdf"> 
                 <span className="text-main">
                  <h1 style={{width:"auto", float:"left", color:"#90A8BE"}}>Resume</h1>
                  <span
              style={{
                float:"right"
              }}
            >
              {/* <PrinterOutlined
                style={{
                  margin: "10px",
                }}
                onClick={() => {
                  this.printDocument("print");
                }}
              /> */}
              {/* <DownloadOutlined
                style={{
                  margin: "10px",
                }}
                onClick={() => {
                  this.printDocument("download");
                }}
              /> */}
              <span className="download" style={{
                  margin: "10px",
                }}  onClick={() => {
                  this.printDocument("download");
                }}>Download Resume</span>
            </span>
                </span>
                 

                {/* <embed src={enquiryDetails} width="800px" height="2100px" /> */}
                 <iframe src={enquiryDetails} frameborder="0" width="640" scrolling="no">
                </iframe>
               
                
               {/* <div onClick={enquiryDetails}>
               
               </div> */}


                {/* <div className="textleft">
                  <div className="heading">
                    <span>
                      <h5>Receipt No </h5>
                      <p> {unique_id} </p>
                    </span>
                    <span>
                    
                     <h5>Booking Id </h5> 
                     <p>{unique_id}</p>
                    
                    </span>
                    <span>
                    
                      <h5>Customer Name </h5>
                       <p>{booking_type === "handyman" || booking_type === "event" || booking_type === "fitness" ? enquiryDetails.customer.name 
                            : booking_type === "spa" ? enquiryDetails.name : booking_type === "handymanBookingCheckout" ? enquiryDetails.data.customer_data.name : ""}</p>
                     
                    </span>
                    <span>
                      <h5>Customer Email </h5>
                      <p>{enquiryDetails.customer_email ?enquiryDetails.customer_email: booking_type === "handymanBookingCheckout" ? enquiryDetails.data.customer_data.email : enquiryDetails.customer.email }</p>
                    </span>
                    <span>
                      <h5>Customer Phone </h5>
                      <p>{enquiryDetails.phone_number ?enquiryDetails.phone_number:mobile_no}</p>
                    </span>
                    <span>
                      <h5>Date </h5>
                      <p>{moment(enquiryDetails.booking_date).format("DD/MM/YYYY")}</p>
                    </span>
                  </div>
                </div>
                <br />

                <h4 className="subHeading">Booking Details:</h4>
                <div className="textleft">
                  <div className="heading">
                    <span>
                      <h4> Vender Name </h4>
                      <p>{booking_type === "handyman" ?enquiryDetails.trader_service.name:booking_type === "handymanBookingCheckout" ? enquiryDetails.data.vendor_data.name: booking_type === "event" ?enquiryDetails.trader_profile.trader_service.name : booking_type === "spa" ? enquiryDetails.trader_user.vendor_name : booking_type === "fitness" ? enquiryDetails.vendor.name : ""}</p> 
                    </span>
                    <span>

                      {booking_type === "event" ? <h4>Event Type </h4> : booking_type === "handymanBookingCheckout" ? "" :booking_type === "fitness" ? <h4>Class Name</h4> : <h4>Service Name </h4>} 
                     <p>{booking_type === "event"?enquiryDetails.event_type.name:booking_type === "spa" ? enquiryDetails.service_sub_bookings[0].wellbeing_trader_service.name : booking_type === "fitness" ? enquiryDetails.trader_class.class_name : ""} </p> 
                    </span>
                    <span>
                      <h4>Date </h4>
                      <p>{date?date:""}{" "}</p>
                    </span>
                    <span>
                        {booking_type === "event" ? <h4>Venue</h4> :""}  
                        <p>{booking_type === "event" ? enquiryDetails.venue_of_event:""}</p>
                    </span>
                    <span>
                     {booking_type === "event" ? <h4> No. of Guest </h4>:""}
                     <p>{booking_type === "event" ? enquiryDetails.no_of_people : ""}</p>
                    </span>
                   
                    <span>
                      <h4>Task Detail </h4>
                      <p>Example</p>
                    </span>
                  </div>
                </div>
                <h4 className="subHeading">Payment Details:</h4>
                <div className="textleft">
                  <span className="heading">
                    <span>
                      <h4>Sub-total-charges </h4>
                      <p>AU$ {sub_total_amout }</p>
                    </span>
                    <span>
                      <h4>Taxes and Surcharges </h4>{" "}
                      <p>{"$"+(enquiryDetails.gst_percentage?enquiryDetails.gst_percentage:0)+" + "+"$"+(enquiryDetails.taxes_fees?enquiryDetails.taxes_fees:0 ) + " = " + "$" +(gstTotal)}</p>
                    </span>
                  </span>
                </div>
                <div className="netcharge">
                  <h3>Net Charges</h3>
                  <p>${total_amount}</p>
                </div> */}
              </div>
            </TransformComponent>
            {/* <div className="zoom-box">
              <img
                src={require("../../booking/checkout/icon/Subtract-1.svg")}
                style={{
                  height: "18px",
                }}
              />
              <img
                src={require("../../booking/checkout/icon/Vector.svg")}
                style={{
                  height: "18px",
                }}
              />
              <img
                src={require("../../booking/checkout/icon/Subtract.svg")}
                style={{
                  height: "18px",
                }}
              />
            </div> */}
          </React.Fragment>
        )}
      </TransformWrapper>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth, profile, retail, common } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : "",
    deliveryAddress: retail && retail.deliveryAddress,
    checkoutData: common.checkoutData,
  };
};
export default connect(mapStateToProps, {
  sendFormmeInvoice,
  generateInvoice,
  enableLoading,
  disableLoading,
  getBookingIdByEnquiryId,
  eventjobCheckoutSuccess,
  getPaymentOrder,
})(DocsResume);
