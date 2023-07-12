import React, { Fragment } from 'react';
import { Button, Tabs, Row, Typography } from 'antd';
import { Form, Input, Col } from 'antd';
import { required } from '../../../../config/FormValidation'
import { connect } from 'react-redux';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
const { TabPane } = Tabs;
const { Paragraph } = Typography;
const { TextArea } = Input;

class Skills extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            skills: this.props.resumeDetails ? this.props.resumeDetails.skills : '',
            values: '',
            // editorState: BraftEditor.createEditorState(''),
            editorState: this.props.resumeDetails && this.props.resumeDetails.skills ? BraftEditor.createEditorState(this.props.resumeDetails.skills) : BraftEditor.createEditorState(''),
        }
    }
    /**
    * @method onFinish
    * @description called to submit form 
    */
    onFinish = (values) => {
        let htmlContent = this.state.editorState.toHTML()
        
        // this.props.next(this.state.skills, 4)
        this.props.next(htmlContent, 4)
    }

    /**
     * @method handleEditorChange
     * @description handle editor text value change
     */
    handleEditorChange = (editorState) => {
        this.setState({ editorState: editorState })
    };

    /** 
     * @method getInitialValue
     * @description returns Initial Value to set on its Fields 
     */
    getInitialValue = () => {
        const { editorState } = this.state
        let temp = {}
        if (this.props.resumeDetails) {
            temp = {
                // skills: this.props.resumeDetails.skills
                skills: editorState
            }
        }
        return temp
    }

    /**
     * @method render
     * @description render component  
     */
    render() {
        const controls = ['bold', 'italic', 'underline', 'separator']
        // const { name } = this.props.userDetails;
        // const { key, imageUrl, loading, isOpenResumeModel, values } = this.state;
        return (
            <div className='card-container'>
                <Tabs type='card' className='skills-tab'>
                    <TabPane tab='Skills' key='4'>
                        <div>
                            <Form
                                onFinish={this.onFinish}
                                initialValues={this.getInitialValue()}
                                layout={'vertical'}
                            >
                                <div className='inner-content shadow'>
                                    <Row gutter={28}>
                                        <Col span={24}>
                                            <div className='ant-form-item-label pb-4'>
                                            <label for='skills' className='ant-form-item-required' title='Add Skills'>Add Skills</label>
                                            </div>
                                    <Paragraph className='fs-14'>Help employers find you by showcasing all of your skills (e.g. Excel, Team building, French, etc.).</Paragraph>
                                    <Form.Item
                                        name='skills'
                                        rules={[required('Add Skills')]}
                                    >
                                        {/* <ReactQuill theme='snow' className='input-editor1' /> */}
                                        {/* <TextArea
                                                    placeholder='Type here'
                                                    className={'input-editor'}
                                                    onChange={(e) => {
                                                        
                                                        this.setState({ skills: e.target.value })
                                                    }}
                                                /> */}
                                        <BraftEditor
                                            value={this.state.editorState}
                                            controls={controls}
                                            onChange={this.handleEditorChange}
                                            // onSave={this.submitContent}
                                            contentStyle={{ height: 150 }}
                                            className={'input-editor'}
                                            language='en'
                                        />
                                    </Form.Item>
                                        </Col>
                                    </Row>
                        </div>
                        <div className='steps-action align-center mb-32'>
                            <Button htmlType='submit' type='primary' size='middle'
                                className='btn-blue'
                                onClick={this.onFinish}
                            >
                                NEXT
                                    </Button>
                        </div>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs >
            </div >
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, profile, classifieds } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
        resumeDetails: classifieds.resumeDetails !== null ? classifieds.resumeDetails : ''
    };
};
export default connect(
    mapStateToProps, null
)(Skills);