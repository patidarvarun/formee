import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
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
    Radio
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { required, whiteSpace, maxLengthC } from '../../../../config/FormValidation'
import { langs } from '../../../../config/localization';
import { leaveFeedback } from '../../../../actions'
import { MESSAGES } from '../../../../config/Message'
import { STATUS_CODES } from '../../../../config/StatusCode'
import {capitalizeFirstLetter, dateFormate5 } from '../../../common'
import { Fragment } from 'react';
const {Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15, offset: 1 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { offset: 7, span: 13 },
    className: 'align-center pt-20'
};

class LeaveFeedbackModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            accurate:0,
            communication:0,
            reasonable:0,
            postage:0
        };
    }

    /**
     * @method onFinish
     * @description handle on submit
     */
    onFinish = (values) => {
        const { classifiedDetail, loggedInDetail } = this.props
        const { accurate, reasonable, postage, communication} = this.state
        let label = accurate === 0 ? 'accurate description' : reasonable === 0 ? 'Reasonable postage costs' : postage === 0 ? 'Postage speed' : 'Communication'
        if(accurate && reasonable && postage && communication){
            const requestData = {
                retail_classified_id: classifiedDetail.id,
                title:values.title,
                user_id: loggedInDetail.id,
                comment: values.comment,
                accurate_description : accurate,
                reasonable_postage_costs : reasonable,
                postage_speed : postage,
                communication : communication
            }
            this.props.leaveFeedback(requestData, res => {
                if (res.status === STATUS_CODES.CREATED) {
                    this.props.callNext()
                    toastr.success(langs.success, MESSAGES.REVIEW_ADD_SUCCESS)
                    this.props.onCancel()
                }
            })
        }else {
            toastr.warning(`Please select rating for ${label}`)
        }
        
    }


    /**
     * @method render
     * @description render component
     */
    render() {
        const { visible, classifiedDetail } = this.props;
        return (
            <Modal
                title='Leave a Feedback'
                visible={visible}
                className={'custom-modal style1 retail-leave-feedback-style'}
                footer={false}
                onCancel={this.props.onCancel}
            >
               <div className='padding'>
                    <Row className='mb-15'>
                        <Col md={20}>
                             <div className='reviews-content-left'>
                                <div className='reviews-content-avatar'>
                                    <Avatar
                                        src={classifiedDetail.classified_users &&
                                            classifiedDetail.classified_users.image_thumbnail ?
                                            classifiedDetail.classified_users.image_thumbnail :
                                            <Avatar size={53} icon={<UserOutlined />} />}
                                            size={53}
                                            className=''
                                    />
                                </div>
                                <div className='reviews-content-avatar-detail'>
                                        <div className="name-tile">
                                            {`${classifiedDetail.classified_users && classifiedDetail.classified_users.name}`}
                                        </div>
                                        <div className="memeber-date">
                                             {classifiedDetail.classified_users &&
                                            `Member since  ${dateFormate5(classifiedDetail.classified_users.created_at)} Based in ${classifiedDetail.classified_users.business_state_id ? classifiedDetail.classified_users.business_state_id :''}`}
                                        </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    
                    <Form
                        {...layout}
                        name='basic'
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            label='Title'
                            name='title'
                            rules={[required(''), whiteSpace('Title'), maxLengthC(100)]}
                            className="custom-astrix"
                        >
                            <Input placeholder={'...'} className='shadow-input' />
                        </Form.Item>
                        <Form.Item
                            label='Comment'
                            name='comment'
                            rules={[required(''), whiteSpace('Review'), maxLengthC(300)]}
                            className="custom-astrix"
                        >
                            <TextArea rows={4} placeholder={'Write comments here...'} className='shadow-input' />
                        </Form.Item>
                        <Fragment>
                            <div className="pro-ratting-label">
                              <Row align="middle">
                                 <Col md={8}>
                                    <h2>Select your rating</h2>
                                 </Col>
                                 <Col md={14}>
                                   <div className="rating-comment">
                                      <div className="first">
                                     <p>1</p>
                                      <p>Terrible</p>
                                   </div>
                                    <div className="second">
                                     <p>2</p>
                                      <p>Poor</p>
                                   </div>
                                    <div className="third">
                                     <p>3</p>
                                      <p>Average</p>
                                   </div>
                                    <div className="four">
                                     <p>4</p>
                                      <p>Very good</p>
                                   </div>
                                    <div className="five">
                                     <p>5</p>
                                      <p>Excellent</p>
                                   </div>
                                   </div>
                                 </Col>
                                  <Col md={8}>
                                    <div className="label-title">Accurate description</div>
                                 </Col>
                                  <Col md={14}>
                                     <div className="rate-for-pro">
                                            <Rate allowHalf onChange={(e) => this.setState({accurate: e}) }/> 
                                        </div>
                                  </Col>

                                  <Col md={8}>
                                     <div className="label-title">Reasonable postage costs</div>
                                 </Col>
                                  <Col md={14}>
                                    <div className="rate-for-pro">
                                            <Rate allowHalf  onChange={(e) => this.setState({reasonable: e}) } />
                                        </div>
                                  </Col>

                                  <Col md={8}>
                                     <div className="label-title">Postage speed</div>
                                 </Col>
                                  <Col md={14}>
                                     <div className="rate-for-pro">
                                        <Rate allowHalf  onChange={(e) => this.setState({postage: e}) } /> 
                                    </div>
                                  </Col>

                                  <Col md={8}>
                                     <div className="label-title">Communication</div>
                                 </Col>
                                  <Col md={14}>
                                     <div className="rate-for-pro">
                                        <Rate allowHalf  onChange={(e) => this.setState({communication: e}) } />
                                    </div> 
                                  </Col>
                              </Row>
          
                            </div>                              
                        </Fragment>
                        <Fragment>
                            <Row>
                                <Col md={24}>
                                    <div className="pt-20 text-center">
                                        <Button type='default' htmlType='submit'>Send</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Fragment>
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
    };
};

export default connect(mapStateToProps, { leaveFeedback })(LeaveFeedbackModel);
