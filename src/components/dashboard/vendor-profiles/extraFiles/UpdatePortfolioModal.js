import React from 'react';
import { toastr } from 'react-redux-toastr'
import { Button, Modal, Input, message, Tabs, Row, Typography } from 'antd';
import { Form, Col } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
// import { deleteUploadedFile, getResume } from '../../../../actions'
import { getUserProfile, deletePortfolioFolder, updatePortfolio, deleteDocuments, uploadDocuments, viewBroucher, viewCertification, createPortfolio, viewPortfolio, saveTraderProfile, changeUserName, changeMobNo, logout, changeEmail, changeProfileImage, changeAddress, sendOtp } from '../../../../actions/index'
import { displayDateTimeFormate, validFileType, validFileSize } from '../../../common'
import { MESSAGES } from '../../../../config/Message'
import { langs } from '../../../../config/localization';
import { required } from '../../../../config/FormValidation'

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

class UpdatePortfolio extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            openUpdateModal: false,
            selectedPortfolio: {},
            portfolioList: ''
        }
    }

    /**
     * @method onFinish
     * @description called to submit form 
     */
    onFinish = (values) => {
        if(!this.state.portfolioList){
            toastr.warn(langs.error, MESSAGES.PORTFOLIO_REQUIRED)
        }
       else if (this.props.selectedPortfolio === false) {

            
            

            let reqData = {
                folder_name: values.folder_name,
                title: values.title,
                image: this.state.portfolioList
            }
            
            const formData = new FormData()
            Object.keys(reqData).forEach((key) => {
                formData.append(key, reqData[key])
            })

            this.props.createPortfolio(formData, res => {
                if (res.status === 200) {
                    toastr.success(langs.success, MESSAGES.PORTFOLIO_CREATE_SUCCESS)
                    this.props.viewPortfolio()
                    this.props.onCancel()
                }
            })
        } else {
            values.id = this.props.selectedPortfolio.id
            this.props.updatePortfolio(values, res => {
                if (res.status === 200) {
                    toastr.success(langs.success, MESSAGES.PORTFOLIO_UPDATE_SUCCESS)
                    this.props.viewPortfolio()
                    this.props.onCancel()
                }
            })
        }

    }


    /**
     * @method portfolioFileSelectedHandler
     * @description Used to handle file selection
     */
    portfolioFileSelectedHandler = (e, item) => {
        
        const { files } = this.state
        let file = e.target.files[0];
        
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJpgOrPng) {
            message.error(MESSAGES.VALID_FILE_TYPE);
            this.setState({ invalid: true })
        } else if (!isLt2M) {
            message.error(MESSAGES.VALID_FILE_SIZE);
            this.setState({ invalid: true })
        }
        if (isJpgOrPng && isLt2M) {
            // let allFile = this.state.portfolioList;
            // 
            // allFile.push(e.target.files[0]);
            this.setState({
                portfolioList: e.target.files[0],
            });
            // this.props.updatePortfolio(formData, (res) => {
            //     conportfolioListole.log('res: ', res);
            // })

        }
    };

    /** 
     * @method getInitialValue
     * @description returns Initial Value to set on its Fields 
     */
    getInitialValue = () => {
        const { folder_name, title } = this.props.selectedPortfolio;
        
        return {
            folder_name,
            title
        }
    }

    /**
  * @method renderFiles
  * @description Used to render selected files
  */
    renderFiles = () => {
        const { portfolioList } = this.state;
        let today = Date.now()
        if (portfolioList) {
            // return portfolioList.map((e, i) => {
                return (
                    <div className='padding resume-preview '>
                        <div className='files-item'>
                            <span>{portfolioList.name}</span>{` ( ${portfolioList.size} KB - Added about ${displayDateTimeFormate(today)} )`}
                            {/* <a className='blue-link'
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
                        </a> */}
                        </div>
                    </div>
                );
            // });
        }
    };
    /**
     * @method render
     * @description render component  
     */
    render() {
        const { selectedPortfolio, showModal, onCancel } = this.props;
        const { portfolioList, openUpdateModal } = this.state
        return (
            <div className='card-container signup-tab'>
                <Modal
                    title={selectedPortfolio === false ? 'Create Portfolio' : 'Update Portfolio'}
                    visible={showModal}
                    className={'login-modal'}
                    footer={false}
                    onCancel={() => onCancel()}
                >
                    <React.Fragment>
                        <Form
                            ref={this.formRef}
                            onFinish={this.onFinish}
                            layout='vertical'
                            initialValues={this.getInitialValue()}
                        >
                            <Form.Item
                                label='Folder Name'
                                name={'folder_name'}

                                rules={[required('Folder name')]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label='Title'
                                className='mb-5'
                                name={'title'}
                                rules={[required('Title')]}
                            >
                                <Input />
                            </Form.Item>
                            {/* <div className='files-item'>
                                <img src={selectedPortfolio.path} style={{ height: 50, width: 50 }} />
                            </div> */}
                            {selectedPortfolio == false && <div className='mt-10'>
                                <input
                                    type='file'
                                    onChange={(e) => this.portfolioFileSelectedHandler(e, selectedPortfolio)}
                                    onClick={(event) => {
                                        event.target.value = null;
                                    }}
                                    style={{ display: 'none' }}
                                    id='portfolio2'
                                />
                                <div className='ant-upload-text float-left'>
                                    <Button danger>
                                        <label
                                            for='portfolio2'
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Choose file
                                                        </label>
                                    </Button>
                                </div>
                            </div>}
                            <Row>
                                <Col span={18}>{this.renderFiles()}</Col>
                            </Row>
                            <Form.Item className='align-center mt-20'>
                                <Button type='primary' htmlType='submit' danger>
                                    {selectedPortfolio === false ? 'Create' : 'Update'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </React.Fragment>

                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, profile, venderDetails } = store;
    
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
        uploadedFolderList: Array.isArray(venderDetails.portfolioFolderList) ? venderDetails.portfolioFolderList : [],
        uploadedportfolioList: Array.isArray(venderDetails.portfolioList) ? venderDetails.portfolioList : [],
        uploadedCertificationList: Array.isArray(venderDetails.certificateList) ? venderDetails.certificateList : [],
    };
};
export default connect(
    mapStateToProps,
    { getUserProfile, deletePortfolioFolder, updatePortfolio, deleteDocuments, uploadDocuments, viewBroucher, viewCertification, createPortfolio, viewPortfolio, saveTraderProfile, logout, changeUserName, changeMobNo, changeEmail, changeProfileImage, changeAddress, sendOtp }
)(UpdatePortfolio);