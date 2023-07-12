
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Col, Input, Layout, Avatar, Row, Typography, Button, Menu, Dropdown, Pagination, Card, Tabs, Form, Select, Rate, Alert, Modal, DatePicker, TimePicker } from 'antd';
import { enableLoading, disableLoading, rescheduleHanymanBooking } from '../../../../../actions'
import { toastr } from 'react-redux-toastr';
import { MESSAGES } from '../../../../../config/Message';
import { langs } from '../../../../../config/localization';
import { required, whiteSpace, maxLengthC } from '../../../../../config/FormValidation';
import './profile-vendor-handyman.less';
import { DISPUTE_REASON } from '../../../../../config/Helper';
import moment from 'moment';

const tailLayout = {
    wrapperCol: { span: 24 },
    className: 'align-center pt-20'
};

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
    labelAlign: 'left',
    colon: false,
};
const { TextArea } = Input;

class DisputeModal extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            bookingResponse: '',

        }
    }

    // /**
    //  * @method componentWillReceiveProps
    //  * @description receive props
    //  */
    // componentWillReceiveProps(nextprops, prevProps) {
    //     const { selectedBookingDetail } = this.props
    //     let catIdInitial = selectedBookingDetail.id
    //     let catIdNext = nextprops.selectedBookingDetail.id
    //     if (catIdInitial !== catIdNext) {
    //         
    //         this.formRef.current.setFieldsValue({
    //             date: moment(nextprops.selectedBookingDetail.date, 'YYYY-MM-DD'),
    //             to: moment(nextprops.selectedBookingDetail.to, 'HH:mm:ss'),
    //             from: moment(nextprops.selectedBookingDetail.from, 'HH:mm:ss')
    //         });

    //     }
    // }


    // /** 
    //  * @method getInitialValue
    //  * @description returns Initial Value to set on its Fields 
    //  */
    // getInitialValue = () => {
    //     const { selectedBookingDetail } = this.props;
    //     return {
    //         date: moment(selectedBookingDetail.date, 'YYYY-MM-DD'),
    //         // date: selectedBookingDetail.date,
    //         from: moment(selectedBookingDetail.from, 'HH:mm:ss'),
    //         to: moment(selectedBookingDetail.to, 'HH:mm:ss')
    //     }
    // }

    renderDisputeReason = () => {
        return (
          <Select
            placeholder='Select'
            className="shadow-input"
            size='large'
            onChange={(e) => {
              if (e === 'Other') {
                this.setState({ isOtherDisputeResaon: true });
              } else {
                this.setState({ isOtherDisputeResaon: false });
              }
            }}
            allowClear
            getPopupContainer={trigger => trigger.parentElement}
          >
            {DISPUTE_REASON.map((val, i) => {
              return (
                <Select.Option key={`${i}_dispute_reason`} value={val.label}>{val.value}</Select.Option>
              )
            })}
          </Select>
        )
      }

    render() {
        const { visibleDisputeModal } = this.props
        return (
            <Modal
                title='Raise Dispute to Admin'
                visible={visibleDisputeModal}
                className={'custom-modal dispute-modal style1'}
                footer={false}
                onCancel={()=>this.props.handleClose()}
                destroyOnClose={true}
            >
                <div>
                    <Form
                        {...layout}
                        onFinish={(values)=>{
                            
                            this.props.submitDispute(values)
                        }}
                    >
                        <Form.Item
                            label='Select the issue'
                            name='reason'
                            rules={[required('')]}
                        >
                            {this.renderDisputeReason()}
                        </Form.Item>
                        {this.state.isOtherDisputeResaon &&
                            <Form.Item
                                label='Type your issue in detail'
                                name='other_reason'
                                rules={[required(''), whiteSpace('Message'), maxLengthC(100)]}
                            >
                                <TextArea rows={4} placeholder={'Type here'} className='shadow-input' />
                            </Form.Item>
                        }
                        <Form.Item {...tailLayout}>
                            <Button type='default' htmlType='submit'>Send</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>

        )
    }
}

const mapStateToProps = (store) => {
    const { auth, profile } = store;
    
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
        traderDetails: profile.traderProfile !== null ? profile.traderProfile : null

    };
};
export default connect(
    mapStateToProps,
    { enableLoading, disableLoading, rescheduleHanymanBooking }
)(DisputeModal);