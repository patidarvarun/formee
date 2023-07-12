import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Col,
  Input,
  Layout,
  Avatar,
  Row,
  Typography,
  Button,
  Menu,
  Dropdown,
  Pagination,
  Card,
  Tabs,
  Form,
  Select,
  Rate,
  Alert,
  Modal,
  DatePicker,
  TimePicker,
} from "antd";
import {
  enableLoading,
  disableLoading,
  rescheduleEventBooking,
  rescheduleHanymanBooking,
} from "../../../../actions";
import { toastr } from "react-redux-toastr";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import { STATUS_CODES } from "../../../../config/StatusCode";
import moment from "moment";

class RescheduleModal extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    const { selectedBookingDetail } = this.props;
    let catIdInitial = selectedBookingDetail.id;
    let catIdNext = nextprops.selectedBookingDetail.id;
    if (catIdInitial !== catIdNext && this.formRef.current) {
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          date: moment(nextprops.selectedBookingDetail.date, "YYYY-MM-DD"),
          to: moment(nextprops.selectedBookingDetail.to, "HH:mm:ss"),
          from: moment(nextprops.selectedBookingDetail.from, "HH:mm:ss"),
        });
    }
  }

  /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  getInitialValue = () => {
    const { selectedBookingDetail,booking } = this.props;
    
    return {
      date: moment(selectedBookingDetail.date, "YYYY-MM-DD"),
      // date: selectedBookingDetail.date,
      from: moment(selectedBookingDetail.from, "HH:mm:ss"),
      to: moment(selectedBookingDetail.to, "HH:mm:ss"),
    };
    // window.location.reload(true);
  };

  render() {
    const {
      visibleRescheduleModal,
      selectedBookingDetail,
      selectedBookingId,
      page,
      booking
    } = this.props;

console.log(selectedBookingDetail,"reeeeeeeeee",visibleRescheduleModal)
    return (
      <Modal
        title="Select new date & time"
        visible={visibleRescheduleModal}
        className={"custom-modal fm-md-modal style1"}
        footer={false}
        onCancel={this.props.handleClose}
      >
        <div className="padding fm-prh-modalwrap">
          <Form
            ref={this.formRef}
            initialValues={this.getInitialValue()}
            // name='basic'
            onFinish={(values) => {
              let reqData = {
                from: moment(values.from).format("HH:mm:ss"),
                to: moment(values.to).format("HH:mm:ss"),
                date: moment(values.date).format("YYYY-MM-DD"),
                event_booking_id: selectedBookingId,
              };
              this.props.enableLoading();
              this.props.rescheduleEventBooking(reqData, (res) => {
                this.props.disableLoading();
                if (res.status === STATUS_CODES.OK) {
                  if (this.props.isFromBooking) {
                    this.props.onChangeSuccess();
                  }
                  this.props.handleClose();
                  toastr.success(langs.success, MESSAGES.RESCHEDULE_BOOKING);
                }
              });
            }}
          >
            <Form.Item name="date">
              <DatePicker
                getPopupContainer={(trigger) => trigger.parentElement}
              />
            </Form.Item>
            <Form.Item name="from">
              <TimePicker
                minuteStep={30}
                getPopupContainer={(trigger) => trigger.parentElement}
                // disabled={selectedBookingDetail.status === "Accepted-Paid"}
              />
            </Form.Item>
            <Form.Item name="to">
              <TimePicker
                format={"HH:mm:ss"}
                minuteStep={30}
                // disabled={selectedBookingDetail.status === "Accepted-Paid"}
                getPopupContainer={(trigger) => trigger.parentElement}
              />
            </Form.Item>
            <Form.Item className="text-center fm-send-submit">
              <Button type="default" htmlType="submit">
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;

  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    traderDetails:
      profile.traderProfile !== null ? profile.traderProfile : null,
  };
};
export default connect(mapStateToProps, {
  enableLoading,
  disableLoading,
  rescheduleEventBooking,
  rescheduleHanymanBooking,
})(RescheduleModal);
