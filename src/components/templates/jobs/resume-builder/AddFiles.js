import React from 'react';
import { toastr } from 'react-redux-toastr'
import { Button, message, Tabs, Row, Typography } from 'antd';
import { Form, Col } from 'antd';
import { connect } from 'react-redux';
import { deleteUploadedFile, getResume } from '../../../../actions'
import './resume.less'
import { displayDateTimeFormate, validFileType, validFileSize } from '../../../common'
import { MESSAGES } from '../../../../config/Message'
import { langs } from '../../../../config/localization';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

class AddFiles extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: [],
            visible: false,
            invalid: false,
            fileList: [],
            uploading: false,
            allFileList: [],
            fileName: [],
            files: [], totalFiles: []
        }
    }


    /**
    * @method componentDidMount
    * @description called before mounting the component
    */
    componentDidMount() {
        const { resumeDetails } = this.props;
        if (resumeDetails) {
            let fileName = resumeDetails.documents.map((el) => el.original_name)
            
            // resumeDetails.documents.original_name
            
        }
    }

    /**
    * @method showModal
    * @description show modal
    */
    showModal = () => {
        this.props.openResumeModal()
    };

    /**
    * @method onFinish
    * @description called to submit form 
    */
    onFinish = (values) => {
        this.setState({ allFileList: [] })
        this.props.createResume()
    }

    /**
   * @method fileSelectedHandler
   * @description Used to handle file selection
   */
    fileSelectedHandler = (e) => {
        const { allFileList, totalFiles, fileName } = this.state
        const { resumeDetails } = this.props
        let file = e.target.files[0]
        
        let validType = validFileType(file)
        let validSize = validFileSize(file)
        // let uploadedfiles = resumeDetails && resumeDetails.documents && resumeDetails.documents.length !== 0 ? resumeDetails.documents : ''
        // let total = uploadedfiles.length ? [...allFileList, ...uploadedfiles] : allFileList
        // this.setState({totalFiles:total })
        // 
        // if(totalFiles && totalFiles.length > 5){
        //     toastr.warning('You can not upload more than 5 files.')
        //     return true
        // }else {
            
        if (!validType) {
            message.error(MESSAGES.VALID_FILE_TYPE);
            this.setState({ invalid: true })
        } else if (!validSize) {
            message.error(MESSAGES.VALID_FILE_SIZE);
            this.setState({ invalid: true })
        } else if (fileName.includes(file.name)) {            
            message.error(MESSAGES.DUPLICATE_FILE_NAME);
            this.setState({ invalid: true })
        }
        if (validType && validSize) {
            let allFile = this.state.files
            allFile.push(e.target.files[0]);
            this.setState({
                // files: [...files, ...e.target.files],
                allFileList: allFile,
            }, () => {
                this.props.next(allFile, 5)
            });
        }
        // } 
    };

    /**
   * @method renderFiles
   * @description Used to render selected files
   */
    renderFiles = () => {
        const { allFileList } = this.state;
        
        let today = Date.now()
        if (allFileList.length) {
            return allFileList.map((e, i) => {
                let fileInKb = Math.round(e.size / (1024))
                return (
                    <div className='padding resume-preview'>
                        <div className='files-item'>
                           <div><span>{e.name}</span>{` ( ${fileInKb} KB - Added about ${displayDateTimeFormate(today)} )`}</div>
                            <a className='blue-link'
                                onClick={(e) => {
                                    toastr.confirm(`${MESSAGES.FILE_DELETE_CONFIRM}`, {
                                        onOk: () =>
                                            this.removeFile(i),
                                        onCancel: () => {
                                            
                                        },
                                    });
                                }}
                            >
                                Remove
                            </a>
                        </div>
                    </div>
                );
            });
        }
    };

    /**
    * @method renderUploadedFiles
    * @description Used to render uploaded files
   */
    renderUploadedFiles = (list) => {
        if (list.length) {
            return list.map((el, i) => {
                return (
                    <div className='padding resume-preview'>
                        <div className='files-item'>
                            <span>{el.original_name}</span>
                            <a className='blue-link'
                                onClick={(e) => {
                                    toastr.confirm(`${MESSAGES.FILE_DELETE_CONFIRM}`, {
                                        onOk: () =>
                                            this.removeUploadedFile(el.document_id),
                                        onCancel: () => {
                                            
                                        },
                                    });
                                }}
                            >
                                Remove
                                </a>
                        </div>
                    </div>
                );
            });
        }
    };

    /**
     * @method removeUploadedFile
     * @description remove uploaded files
     */
    removeUploadedFile = (id) => {
        this.props.deleteUploadedFile(id, res => {
            if (res.status === 200) {
                toastr.success(langs.success, MESSAGES.FILE_DELETE_SUCCESS)
                this.props.getResume((res) => { })
            }
        })

    }

    /**
     * @method removeFile
     * @description remove uploaded files
     */
    removeFile = (index) => {
        const { allFileList } = this.state;
        const list = allFileList;
        list.splice(index, 1);
        this.setState({ allFileList: list }, () => {
            toastr.success(langs.success, MESSAGES.FILE_DELETE_SUCCESS)
        });

    }

    /**
     * @method render
     * @description render component  
     */
    render() {
        const { resumeDetails } = this.props
        const { allFileList } = this.state
        
        let uploadedfiles = resumeDetails && resumeDetails.documents && resumeDetails.documents.length !== 0 ? resumeDetails.documents : []
        let total = uploadedfiles.length ? [...allFileList, ...uploadedfiles] : allFileList
        return (
            <div className='card-container signup-tab'>
                <Tabs type='card' className='add-files-tab'>
                    <TabPane tab='Add files' key='5'>
                        <div>
                            <Form
                                onFinish={this.onFinish}
                                layout={'vertical'}
                            >
                                <div className='inner-content shadow'>
                                    <Row gutter={28}>
                                        <Col span={24}>
                                            <div className='ant-form-item-label pb-4'>
                                                <label>Do you have your own document? (Optional)</label>
                                            </div>
                                            <Paragraph className='fs-14 lgt-gray'>Accepted file type : Microsoft word (.doc or .docx), Adobe PDF (.pdf) or Text file (.txt or .rtf) 2MB file size limit</Paragraph>
                                            <Form.Item
                                                name='trade_certificate'
                                                id='file'
                                            >
                                                <div className='mt-10'>
                                                    <input
                                                        type='file'
                                                        onChange={this.fileSelectedHandler}
                                                        onClick={(event) => {
                                                            event.target.value = null;
                                                        }}
                                                        style={{ display: 'none' }}
                                                        id='fileButton'
                                                    />
                                                    {total.length >= 5 ? null : <div className='ant-upload-text chs-upload-text float-left'>
                                                        <Button danger>
                                                            <label
                                                                for='fileButton'
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                Choose file
                                                        </label>
                                                        </Button>
                                                    </div>}
                                                </div>
                                                <Row>
                                                    <Col span={24}>{this.renderFiles()}</Col>
                                                </Row>
                                                {resumeDetails && resumeDetails.documents && resumeDetails.documents.length !== 0 && <Row>
                                                    <Col span={24}>{this.renderUploadedFiles(resumeDetails.documents)}</Col>
                                                </Row>}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='mt-50 mb-32 resume-update-footerbtn'>
                                    <Row gutter={[80, 0]}>
                                        <Col span={12} className='align-right'>
                                            <Button className="pre-btn" type='default' danger size='large'
                                                style={{ minWidth: 160, fontSize: 14 }}
                                                onClick={this.showModal}
                                            >
                                                Preview
                                            </Button>
                                        </Col>
                                        <Col span={12} className='align-left'>
                                            <Button htmlType='submit' type='primary' danger size='large'
                                                style={{ minWidth: 160, fontSize: 14 }}
                                            >
                                                {resumeDetails ? 'Update' : 'Save'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
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
    mapStateToProps, { deleteUploadedFile, getResume }
)(AddFiles);