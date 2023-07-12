import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
    Form,
    Input,
    Typography,
    Row,
    Col,
    Button,
    Rate,
    Modal,
    Avatar,
    Radio,
} from "antd";
import { UserOutlined } from '@ant-design/icons';
import {
    required,
    whiteSpace,
    maxLengthC,
} from "../../../config/FormValidation";
import { langs } from "../../../config/localization";
import { editBookingReview, addBookingReview, postCarReview, openLoginModel } from "../../../actions";
import { MESSAGES } from "../../../config/Message";
import { STATUS_CODES } from "../../../config/StatusCode";
import { capitalizeFirstLetter, displayDateTimeFormate, dateFormate2 } from "../../common";
const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { offset: 3, span: 16 },
    className: 'align-center pt-20'
};

class LeaveReviewModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    /**
     * @method handleRatingChange
     * @description handle rating selection
     */
    handleRatingChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    /**
     * @method onFinish
     * @description handle on submit
     */
    onFinish = (values) => {
        console.log('values: ', values);
        const { loggedInUser, isLoggedIn, data } = this.props;
        if (!isLoggedIn) {
            this.props.openLoginModel();
            return;
        }
        let reqData = {
            user_id: loggedInUser.id,
            car_service_id: data.param.rateIdentifier,
            car_details: data,
            review_comment: values.review_comment,
            rating: values.rating,
        };
        const formData = new FormData();
        Object.keys(reqData).forEach((key) => {
            if (typeof reqData[key] == "object") {
                formData.append(key, JSON.stringify(reqData[key]));
            } else {
                formData.append(key, reqData[key]);
            }
        });
        this.props.postCarReview(formData, (res) => {
            console.log('res: ', res.status);
            if (res && res.status === STATUS_CODES.OK) {

                toastr.success(langs.success, MESSAGES.REVIEW_ADD_SUCCESS);
                this.props.checkFav()
                this.props.onCancel();
            }
        });
        // }
    };

    /**
     * @method getInitialValue
     * @description get initial values
     */
    getInitialValue = () => {
        let data = this.props.selectedReview
        if (data) {
            let temp = {
                title: data.title,
                review: data.review,
                rating: data.rating
            }
            return temp;
        }
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const { type, visible, bookingDetail } = this.props;
        const { value } = this.state;
        const radioStyle = {
            display: "block",
            height: "30px",
            lineHeight: "30px",
        };
        let image = '', name = ''
        if (type === 'restaurant') {
            name = bookingDetail && bookingDetail.user ? bookingDetail.user.name : ''
            image = bookingDetail && bookingDetail.user && bookingDetail.user.image_thumbnail ? bookingDetail.user.image_thumbnail : <Avatar size={53} icon={<UserOutlined />} />
        } else {
            name = bookingDetail && bookingDetail.name
            image = bookingDetail && bookingDetail.image_thumbnail ? bookingDetail.image_thumbnail : <Avatar size={53} icon={<UserOutlined />} />
        }
        return (
            <Modal
                title="Leave a Review"
                visible={visible}
                className={"custom-modal style1 leave-review-style1"}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <div className="padding">
                    <Row className="mb-15">
                        <Col md={20}>
                            <div className='reviews-content-left'>
                                {/* <div className='reviews-content-avatar'>
                        <Avatar
                            src={image}
                            size={53}
                            className=''
                        />
                    </div> */}
                                {/* <div className='reviews-content-avatar-detail'>
                        <Title level={4}>{bookingDetail && capitalizeFirstLetter(name)}</Title>
                        <p><Paragraph>
                            {bookingDetail && `Member Since  ${dateFormate2(bookingDetail.member_since)}`}
                        </Paragraph></p>
                    </div> */}
                            </div>
                        </Col>
                    </Row>
                    <Form
                        {...layout}
                        name="basic"
                        onFinish={this.onFinish}
                        initialValues={this.getInitialValue()}
                    >
                        {/* <Form.Item
                label={'Title'}
                name='title'
                rules={[required(''), whiteSpace('Review')]}
                className="custom-astrix"
            >
                <Input rows={5} placeholder={'...'} className='shadow-input' />
            </Form.Item> */}
                        <Form.Item
                            // label="Body of message (1500) characters remaining"
                            label={'Comment'}
                            name="review_comment"
                            rules={[required(""), whiteSpace("Review"), maxLengthC(300)]}
                            className="custom-astrix"
                        >
                            <TextArea
                                rows={4}
                                placeholder={"Write comments here..."}
                                className="shadow-input"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Select your rating"
                            name="rating"
                            rules={[required("")]}
                        >
                            <Radio.Group onChange={this.handleRatingChange} value={value}>
                                <Radio style={radioStyle} value={5}>
                                    <Rate disabled defaultValue={5} /> 5 Excelent
                                </Radio>
                                <Radio style={radioStyle} value={4}>
                                    <Rate disabled defaultValue={4} /> 4 vary good
                                </Radio>
                                <Radio style={radioStyle} value={3}>
                                    <Rate disabled defaultValue={3} /> 3 Average
                                </Radio>
                                <Radio style={radioStyle} value={2}>
                                    <Rate disabled defaultValue={2} /> 2 Very Poor
                                </Radio>
                                <Radio style={radioStyle} value={1}>
                                    <Rate disabled defaultValue={1} /> 1 Terrible
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
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

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser
    };
};

export default connect(mapStateToProps, { editBookingReview, addBookingReview, postCarReview, openLoginModel })(LeaveReviewModel);
