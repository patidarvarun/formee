import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Upload, Modal, message, Avatar, Tabs, Row, Checkbox, Select, Typography, Divider, DatePicker } from 'antd';
import { LoadingOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Col } from 'antd';
import { required } from '../../../../config/FormValidation'
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import { langs } from '../../../../config/localization';
import Icon from '../../../customIcons/customIcons';
import { SIZE } from '../../../../config/Config';
import 'react-quill/dist/quill.snow.css';
import Resume from './Resume'
import { TwitterShareButton } from 'react-share';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

class AddFiles extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: [],
      certificate: [],
      abnFile: [],
      docFile: [],
      subCategory: [],
      serviceType: '',
      occupationType: '',
      isEmpty: true,
      isRedirect: false,
      values: '',
      visible: false,
      invalid: false,
      fileList: [],
      uploading: false,
      allFileList: [],
      files: []
    }
  }


  showModal = () => {
    this.props.openResumeModal()
  };

  handleCancel = e => {
    
    this.setState({
      visible: false,
    });
  };


  /**
  * @method onFinish
  * @description called to submit form 
  */
  onFinish = (values) => {
    
    // this.props.next(values, 4)
    this.setState({ values })
    this.props.createResume()
  }

  /** 
   * @method handleResumeChange
   * @description handle resume change
   */
  handleResumeChange = info => {
    if (info.file.status !== 'uploading') {
    }
    const isCorrectFormat = info.file.type === 'application/pdf' || info.file.type === 'application/msword' || info.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || info.file.type === 'txt' || info.file.type === 'rtf';
    const isCorrectSize = info.file.size / 1024 / 1024 < 2;
    if (info.file.status === 'done' && isCorrectFormat && isCorrectSize) {
      message.success(`${info.file.name} file uploaded successfully`);
      this.setState({ resume: info.file.originFileObj })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // application/pdf means .pdf
  // application/msword means .doc
  // application/vnd.openxmlformats-officedocument.wordprocessingml.document means .docx

  /** 
   * @method beforeUpload
   * @description handle image Loading 
   */
  beforeUpload(file) {
    const isJpgOrPng = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'txt' || file.type === 'rtf';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload PDF , DOC, DOCX RTF & TXT file!');
      this.setState({ invalid: true })
    } else
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        this.setState({ invalid: true })
      }
    //return isJpgOrPng && isLt2M;
  }


  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    // reqwest({
    //   url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    //   method: 'post',
    //   processData: false,
    //   data: formData,
    //   success: () => {
    //     this.setState({
    //       fileList: [],
    //       uploading: false,
    //     });
    //     message.success('upload successfully.');
    //   },
    //   error: () => {
    //     this.setState({
    //       uploading: false,
    //     });
    //     message.error('upload failed.');
    //   },
    // });
  };

  /**
* @method fileSelectedHandler
* @description Used to handle file selection
*/
  fileSelectedHandler = (e) => {
    const { files } = this.state
    let file = e.target.files[0];
    const validType = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'txt' || file.type === 'rtf';
    const validSize = file.size / 1024 / 1024 < 2;
    if (!validType) {
      message.error('You can only upload PDF , DOC, DOCX RTF & TXT file!');
      this.setState({ invalid: true })
    } else
      if (!validSize) {
        message.error('Image must smaller than 2MB!');
        this.setState({ invalid: true })
      }
    if (validType && validSize) {
      let allFile = this.state.fileList;
      allFile.push(e.target.files[0]);
      this.setState({
        files: [...files, ...e.target.files],
        allFileList: allFile,
      });
    }
  };

  /**
 * @method renderPreviewImage
 * @description Used to render selected images
 */
  renderPreviewImage = () => {
    const { allFileList } = this.state;
    if (allFileList.length) {
      return allFileList.map((e, i) => {
        return (
          <Row>
            {/* <div className='form-control custom-file-upload'> */}
            <div className='upload-file-name'>
              <span>{e.name}</span>
              <Icon icon='delete' size='20' onClick={(e) => this.removeFile(i)} />
            </div>
            {/* </div> */}
          </Row>
        );
      });
    }
  };

  /**
   * @method removeFile
   * @description remove uploaded files
   */
  removeFile = (index) => {
    const { allFileList } = this.state;
    const list = allFileList;
    list.splice(index, 1);
    this.setState({ pictures: allFileList });

  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    // const { name } = this.props.userDetails;
    const { uploading, fileList } = this.state;
    const { certificate, isOpenResumeModel, values, invalid } = this.state;
    // const props = {
    //     onRemove: file => {
    //       this.setState(state => {
    //         const index = state.fileList.indexOf(file);
    //         const newFileList = state.fileList.slice();
    //         newFileList.splice(index, 1);
    //         return {
    //           fileList: newFileList,
    //         };
    //       });
    //     },
    //     beforeUpload: file => {
    //         const isJpgOrPng = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'txt' || file.type === 'rtf' ;
    //         const isLt2M = file.size / 1024 / 1024 < 2;
    //         if (!isJpgOrPng) {
    //             message.error('You can only upload PDF , DOC, DOCX RTF & TXT file!');
    //             this.setState({invalid: true})
    //         }else 
    //         if (!isLt2M) {
    //             message.error('Image must smaller than 2MB!');
    //             this.setState({invalid: true})
    //             return false;
    //         }
    //         if(isJpgOrPng && isLt2M){
    //             this.setState(state => ({
    //                 fileList: [...state.fileList, file],invalid: false
    //             }));
    //         }
    //     },
    //     fileList,
    //   };
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
                        <label>Do you have your own document? (optional)</label>
                      </div>
                      <Paragraph className='fs-14'>Accepted file type : Microsoft word (.doc or .docx), Adobe PDF (.pdf) or Text file (.txt or .rtf) 2MB file size limit</Paragraph>
                      <Form.Item
                        name='trade_certificate'
                        id='file'
                      >
                        {/* <div className='mt-10'>
                                                    <Upload 
                                                    // {...this.uploadProps}
                                                        name='file'
                                                        listType='picture'
                                                        className='custom-upload'
                                                        showUploadList={invalid ? false : true}
                                                        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                                        beforeUpload={this.beforeUpload}
                                                        onChange={this.handleChange}
                                                        accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                    >
                                                        <div>
                                                          
                                                            <div className='ant-upload-text float-left'>
                                                                <Button danger>
                                                                    Choose file
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Upload>
                                                </div> */}
                        {/* <div className='mt-10'>
                                                        <Upload {...props}
                                                        name='file'
                                                        listType='picture'
                                                        className='custom-upload'
                                                            showUploadList={invalid ? false : true}
                                                        >
                                                         <div>
                                                          
                                                          <div className='ant-upload-text float-left'>
                                                              <Button danger>
                                                                  Choose file
                                                              </Button>
                                                          </div>
                                                      </div>
                                                        </Upload>
                                                    </div> */}
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
                          <div className='ant-upload-text float-left'>
                            <label
                              for='fileButton'
                              style={{ marginBottom: 'auto', cursor: 'pointer' }}
                              className='btn btn-secondary'
                            >
                              Choose file
                                                            </label>
                          </div>
                        </div>
                        <Row className='my-2'>
                          {this.renderPreviewImage()}
                        </Row>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <div className='mt-50 mb-32'>
                  <Row gutter={[80, 0]}>
                    <Col span={12} className='align-right'>
                      <Button type='default' danger size='large'
                        style={{ minWidth: 160, fontSize: 14 }}
                        //onClick={this.onFinish}
                        onClick={this.showModal}
                      >
                        Preview
                                            </Button>
                    </Col>
                    <Col span={12} className='align-left'>
                      <Button htmlType='submit' type='primary' danger size='large'
                        style={{ minWidth: 160, fontSize: 14 }}
                      // onClick={this.onFinish}
                      >
                        Save
                                            </Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            </div>
          </TabPane>
        </Tabs>
        {/* <Modal
                    title='Resume'
                    visible={this.state.visible}
                    footer={false}
                    onCancel={this.handleCancel}
                    className='custom-modal style1'
                >
                    <div className='padding resume-preview'>
                        <Title level={2}>Kieth  Alan</Title>
                        <p className='fs-18'>Receptionist</p>
                        <p>
                            Address: 30 Fogarty Ave, South West Coast VIC, 3216<br/>
                            Mobile: 0484 835 877<br/>
                            Email: keithalan@yahoo.com
                        </p>
                        <Title level={4} className='sub-heading'>{'Work Experience'}</Title>
                        <Row>
                            <Col span={19}>
                                <p className='strong mb-5'>Accounting Coordinator</p>
                                <p>Nebraska Special Olympics Co.Ltd. <br/>Sydney</p>
                                <p>- Formulated monthly and year-end financial statements and generated various payroll records, including federal and state payroll reports, annual tax reports, W-2 and 1099 forms, etc.</p>
                                <p>- Tested accuracy of account balances and prepared supporting documentation for submission during a comprehensive three-year audit of financial operations.</p>
                            </Col>
                            <Col span={5} className='align-right'>
                                <Text className='strong'>{'May 2013 - April 2018'}</Text>
                            </Col>
                        </Row>
                        <Row className='mt-20'>
                            <Col span={19}>
                                <p className='strong mb-5'>Accounting Coordinator</p>
                                <p>Nebraska Special Olympics Co.Ltd. <br/>Sydney</p>
                                <p>- Formulated monthly and year-end financial statements and generated various payroll records, including federal and state payroll reports, annual tax reports, W-2 and 1099 forms, etc.</p>
                                <p>- Tested accuracy of account balances and prepared supporting documentation for submission during a comprehensive three-year audit of financial operations.</p>
                            </Col>
                            <Col span={5} className='align-right'>
                                <Text className='strong'>{'May 2013 - April 2018'}</Text>
                            </Col>
                        </Row>
                        <Title level={4} className='sub-heading'>{'Education'}</Title>
                        <Row>
                            <Col span={19}>
                                <p className='strong mb-5'>BS in Business Administration</p>
                                <p>Bellevue University <br />Master Degree</p>
                                <p>Principles of Marketing Internet Marketing Public Relations Aacademic Tutor (20xx to present) Bellevue University, Bellevue, NE Business Communication Consumer Behavior Business Policy & Stretegy</p>
                            </Col>
                            <Col span={5} className='align-right'>
                                <Text className='strong'>{'May 2013 - April 2018'}</Text>
                            </Col>
                        </Row>
                        <Row className='mt-20'>
                            <Col span={19}>
                                <p className='strong mb-5'>BS in Business Administration</p>
                                <p>Bellevue University <br />Master Degree</p>
                                <p>Principles of Marketing Internet Marketing Public Relations Aacademic Tutor (20xx to present) Bellevue University, Bellevue, NE Business Communication Consumer Behavior Business Policy & Stretegy</p>
                            </Col>
                            <Col span={5} className='align-right'>
                                <Text className='strong'>{'May 2013 - April 2018'}</Text>
                            </Col>
                        </Row>

                        <Title level={4} className='sub-heading'>{'Skills'}</Title>
                        <Row>
                            <Col span={19}>
                                <table>
                                    <tr>
                                        <td>Operating Systems:</td>
                                        <td>Windows 19xx/20xx/XP/NT, UNIX/Linux</td>
                                    </tr>
                                    <tr>
                                        <td>Technical Support:</td>
                                        <td>Installation, Configuration & Troubleshooting of Hardware & Software.</td>
                                    </tr>
                                    <tr>
                                        <td>Languages:</td>
                                        <td>Visual Basic, C, C++, Visual C++, Java, HTML, XML, ASP.NET</td>
                                    </tr>
                                    <tr>
                                        <td>Database Management:</td>
                                        <td>Relational Databases. SQL, PL/SQL, MS Access</td>
                                    </tr>
                                    <tr>
                                        <td>Applications:</td>
                                        <td>MS Office (Word, Excel, PowerPoint, Outlook), MS Project</td>
                                    </tr>
                                </table>
                            </Col>
                        </Row>
                        <Title level={4} className='sub-heading'>{'Reference files'}</Title>
                        <Row>
                            <Col span={18}>
                                <div className='files-item'>
                                    <span>Resume.pdf</span> (707 KB - Added about 1 day ago)
                                </div>
                                <div className='files-item'>
                                    <span>Cover Letter.pdf</span> (707 KB - Added about 1 day ago)
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-30'>
                            <Col span={18}>
                                &nbsp;
                            </Col>
                            <Col span={6} className='align-right'>
                                <Link to='/' className='download-link'><Icon icon='save' size='20' /> <span>Download Resume</span></Link>
                            </Col>
                        </Row>
                    </div>
                </Modal> */}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};
export default connect(
  mapStateToProps, null
)(AddFiles);