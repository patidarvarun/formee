import React from 'react';
import { toastr } from 'react-redux-toastr'
import { Button, Modal, Divider, message, Tabs, Row, Input, Typography, Upload } from 'antd';
import { Form, Col } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
// import { deleteUploadedFile, getResume } from '../../../../actions'
import {
  CloseCircleOutlined,
} from '@ant-design/icons';
import { portfolioUpload, getPortfolioImages, getUserProfile, updatePortfolio, deletePortfolioFolder, deleteDocuments, uploadDocuments, viewBroucher, viewCertification, createPortfolio, viewPortfolio, saveTraderProfile, changeUserName, changeMobNo, logout, changeEmail, changeProfileImage, changeAddress, sendOtp } from '../../../../actions/index'
import { displayDateTimeFormate, validFileType, validFileSize } from '../../../common'
import { MESSAGES } from '../../../../config/Message'
import { langs } from '../../../../config/localization';
import { required } from '../../../../config/FormValidation'
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

class AddPortfolio extends React.Component {
  formRef = React.createRef();
  formRef2 = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      visible: false,
      invalid: false,
      fileList: [],
      uploading: false,
      allFileList: [],
      files: [],
      certificationList: [],
      brochureList: [],
      selectedPortfolio: false,
      portfolioList: '',
      imagesList: []
    }
  }

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    this.props.viewPortfolio()
    this.props.viewCertification()
    this.props.viewBroucher()
  }

  /**
  * @method showModal
  * @description show modal
  */
  showModal = () => {
    this.props.openResumeModal()
  };

  /**
  * @method HandlePortfolio Form
  * @description called to submit form create portfolio 
  */
  handlePortfolioForm = (values) => {
    const { portfolioList } = this.state;
    if (this.state.selectedPortfolio === false) {
      if (!portfolioList) {
        
        return toastr.error(langs.error, MESSAGES.PORTFOLIO_REQUIRED)
      }
      let reqData = {
        folder_name: values.folder_name,
        title: values.title,
      }
      let temp = []
      const formData = new FormData()
      for (var i = 0; i < portfolioList.length; i++) {
        formData.append('image', portfolioList[i]);
      }
      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key])
      })

      this.props.createPortfolio(formData, res => {
        
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.PORTFOLIO_CREATE_SUCCESS)
          this.props.viewPortfolio()
        }
      })
    } else {
      values.id = this.state.selectedPortfolio.id
      this.props.updatePortfolio(values, res => {
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.PORTFOLIO_UPDATE_SUCCESS)
          this.props.viewPortfolio()
          this.setState({
            selectedPortfolio: false,
            portfolioList: ''
          })
          this.formRef2.current && this.formRef2.current.setFieldsValue({
            folder_name: '',
            title: ''
          });
          // this.props.onCancel()
        }
      })
    }
  }

  /**
  * @method onFinish
  * @description called to submit form 
  */
  onFinish = (values) => {
    // this.props.createResume()
    this.props.nextStep(values)

  }

  /**
  * @method certificateFileSelectedHandler
  * @description Used to handle file selection
  */
  certificateFileSelectedHandler = (e, type) => {
    
    
    const { files, brochureList, certificationList } = this.state
    let file = e.target.files[0];
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      this.setState({ invalid: true })
    } else if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
      this.setState({ invalid: true })
    }
    if (isJpgOrPng && isLt2M) {
      let reqData = {
        upload_type: type === 2 ? 'certification' : 'brochure',
        image: e.target.files[0]
      }
      const formData = new FormData()
      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key])
      })

      let allFile = type === 2 ? certificationList : brochureList;
      allFile.push(e.target.files[0]);
      if (type === 2) {
        this.setState({
          certificationList: allFile,
        });
      } else {
        this.setState({
          brochureList: allFile,
        });
      }

      this.props.uploadDocuments(formData, (res) => {
        
        if (res.status === 200) {
          type === 2 ? this.props.viewCertification() : this.props.viewBroucher()
          toastr.success(langs.success, MESSAGES.FILE_UPLOAD_SUCCESS)
        }
      })

    }
  };

  /**
   * @method portfolioFileSelectedHandler
   * @description Used to handle file selection
   */
  portfolioFileSelectedHandler = (e, item) => {
    
    const { files } = this.state
    let file = e.target.files[0];
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      this.setState({ invalid: true })
    } else if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
      this.setState({ invalid: true })
    }
    if (isJpgOrPng && isLt2M) {
      // let allFile = this.state.portfolioList;
      // 
      // allFile.push(e.target.files[0]);
      // let reqData = {
      //   id:item.id,
      //   // upload_type: type === 2 ? 'certification' : 'brochure',
      //   image: e.target.files[0]
      // }

      this.setState({
        portfolioList: [...this.state.portfolioList, file],
      });
      // const formData = new FormData()
      // Object.keys(reqData).forEach((key) => {
      //   formData.append(key, reqData[key])
      // })
      // this.props.updatePortfolio(formData, (res) => {
      //   // conportfolioListole.log('res: ', res);
      // })

    }
    ///-----------------------------------------------------
    // 
    // const { files } = this.state
    // let file = e.target.files[0];
    // 
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isJpgOrPng) {
    //   message.error(MESSAGES.VALID_FILE_TYPE);
    //   this.setState({ invalid: true })
    // } else if (!isLt2M) {
    //   message.error(MESSAGES.VALID_FILE_SIZE);
    //   this.setState({ invalid: true })
    // }
    // if (isJpgOrPng && isLt2M) {
    //   // let allFile = this.state.portfolioList;
    //   // 
    //   // allFile.push(e.target.files[0]);
    //   this.setState({
    //     portfolioList: e.target.files[0],
    //   });
    //   // this.props.updatePortfolio(formData, (res) => {
    //   //     conportfolioListole.log('res: ', res);
    //   // })

    // }
  };

  portfolioUpdateHandler = (e, item) => {
    
    const { userDetails, loggedInUser } = this.props;
    const { files } = this.state
    let trader_user_id = userDetails.user.trader_profile.id;
    let existImage = item.folder_files.files.image
    if (Array.isArray(existImage) && existImage.length >= 8) {
      message.error('You can only upload only 8 images');
    } else {
      

      // Image Upload:
      let file = e.target.files[0];
      
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isJpgOrPng) {
        message.error('You can only upload JPG , JPEG  & PNG file!');
        this.setState({ invalid: true })
      } else if (!isLt2M) {
        message.error('Image must smaller than 4MB!');
        this.setState({ invalid: true })
      }
      if (isJpgOrPng && isLt2M) {
        let reqData = {
          parent_id: item.id,
          // trader_user_profile_id:trader_user_id,
          file: e.target.files[0]
        }

        this.setState({
          portfolioList: [...this.state.portfolioList, file],
        });
        const formData = new FormData()
        Object.keys(reqData).forEach((key) => {
          formData.append(key, reqData[key])
        })
        this.props.portfolioUpload(formData, (res) => {
          if (res.status === 200) {
            this.getPortFolioPics(item)
            toastr.success(langs.success, MESSAGES.PORTFOLIO_UPDATE_SUCCESS)
            this.props.viewPortfolio()
          }
        })

      }
    }

    //   }
    // })
  }

  getPortFolioPics = (el) => {
    const { loggedInUser } = this.props;
    const { imagesList } = this.state
    let trader_user_id = loggedInUser.id

    this.props.getPortfolioImages({ id: el.id, trader_user_id }, (res) => {
      if (res.status === 200) {
        
        let list = res.data.img_video.files.image ? res.data.img_video.files.image : []
        let images = { folderId: el.id, list: [...list] }
        let index = imagesList.findIndex((f) => f.folderId === el.id)
        if (images.list.length === 0) {
          toastr.warning(langs.warning, 'Images not found')
        } else if (index >= 0) {
          imagesList[index] = images;
          this.setState({ imagesList })
        } else {
          
          this.setState({ imagesList: [...imagesList, images] })
        }
      }
    })
  }
  /**
  * @method renderUploadedFiles
  * @description Used to render uploaded files
  */
  renderUploadedFiles = (list, type) => {
    
    if (list.length) {
      return list.map((el, i) => {
        return (
          <div className="add-portfolio-block-parent add-portfolio-parent-cus-width">
            <div className='padding resume-preview add-portfolio-block' >
              <Row gutter={20}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <img src={el.path} />
                  <div>
                    {/* <span>{el.original_name}</span> */}
                    <a className='blue-link'
                      onClick={(e) => {
                        toastr.confirm(`${MESSAGES.FILE_DELETE_CONFIRM}`, {
                          onOk: () =>
                            this.removeUploadedFile(el.id, type),
                          onCancel: () => {
                            
                          },
                        });
                      }}
                    >
                      <CloseCircleOutlined />
                    </a>
                  </div>
                </Col>

              </Row>
            </div>
          </div >
        );
      });
    }
  };

  /**
   * @method removeUploadedFile
   * @description remove uploaded files
   */
  removeUploadedFile = (id, type) => {
    if (type === 3) {
      this.props.deletePortfolioFolder(id, res => {
        
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.FILE_DELETE_SUCCESS)
          this.props.viewPortfolio()
        }
      })
    } else {
      this.props.deleteDocuments(id, res => {
        
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.FILE_DELETE_SUCCESS)
          if (type === 1) {
            this.props.viewBroucher()
          } else {
            this.props.viewCertification()
          }
        }
      })
    }
  }

  /**
  * @method renderImages
  * @description Used to render uploaded files
  */
  renderImages = (images, id) => {
    const { imagesList } = this.state;
    let index = imagesList.findIndex((i) => i.folderId === id)
    
    if (index >= 0 && imagesList[index]) {
      return imagesList[index].list.map((el, i) => {
        return (
          <Col xs={24} sm={24} md={24} lg={6} xl={6} className="mt-10">
            <div className="thumb-upload-result-block">
              <img src={el.path} />
            </div>
          </Col>
        );
      });
    }
  };

  renderFolderList = () => {
    const { uploadedFolderList, userDetails, loggedInUser } = this.props;
    const { imagesList } = this.state
    return uploadedFolderList.map((el, index) => {
      let isShowIndex = imagesList.findIndex((f) => f.folderId === el.id)
      return <div className="add-portfolio-block-parent ">
        <div className='padding resume-preview add-portfolio-block'>
          <Row gutter={0} >
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className="add-thumb"><img src={el.path} /></div>
              {imagesList.length >= 8 ? null : <div className='ant-upload-text float-left mt-20'>
                <Button className='fm-addbtn-update-view'>
                  <label
                    for={`portfolio-upload ${el.id}`}
                    style={{ cursor: 'pointer' }}>
                    <img src={require('../../../../assets/images/icons/upload-small.svg')} width="28" height="25" alt='Fitness' className="mb-10" />
                    <span className="upload-text">Add Photo</span>
                  </label>
                </Button>
              </div>}
            </Col>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <div>
                <div className="title">Folder Name</div>
                <Text className="subtitle">{el.folder_name}</Text>
                <div className="title mt-16">Title</div>
                <Text className="no-bold subtitle">{el.title}</Text>


                <div className="right-edit-link"
                  onClick={() => {
                    
                    this.setState({
                      selectedPortfolio: el
                    })
                    this.formRef2.current && this.formRef2.current.setFieldsValue({
                      folder_name: el.folder_name,
                      title: el.title
                    });
                  }} 
                >
                  <span className="edit-text">Edit</span>
                  <img src={require('../../../../assets/images/icons/edit-pencil-dark-blue.svg')} alt='Fitness' />

                </div>
              </div>
              <div className="add-remove-img">
                {/* <Text className='blue-link'
                  onClick={(e) => {
                    toastr.confirm(`${MESSAGES.FILE_DELETE_CONFIRM}`, {
                      onOk: () =>
                        this.removeUploadedFile(el.id, 3),
                      onCancel: () => {
                        
                      },
                    });
                  }}
                >
                  Remove
              </Text>
                <Text onClick={() => {
                  if (isShowIndex >= 0) {

                    //Logic to hide images
                    let temp = imagesList.filter((i) => i.folderId !== el.id)
                    this.setState({ imagesList: [...temp] })
                  } else {
                    
                    //show image
                    this.getPortFolioPics(el)
                  }
                }}>
                  {isShowIndex >= 0 ? 'Hide Images' : 'Show Images'}
                </Text>
                <Text onClick={() => {
                  
                  this.setState({
                    selectedPortfolio: el
                  })
                  this.formRef2.current && this.formRef2.current.setFieldsValue({
                    folder_name: el.folder_name,
                    title: el.title
                  });
                }} className='blue-link'>
                  Update
                   </Text> */}
                <input
                  type='file'
                  multiple
                  onChange={(e) => {
                    // let event = e
                    // this.props.getPortfolioImages({ id: el.id, trader_user_id: loggedInUser.id }, event, (res, ev) => {
                    //   if (res.status === 200) {
                    //     
                    //     if (Array.isArray(res.data.img_video.files.image) && res.data.img_video.files.image.length >= 8) {
                    //       message.error('You can only upload only 8 images');
                    //     } else {
                    this.portfolioUpdateHandler(e, el)
                    //     }
                    //   }
                    // })
                  }
                  }
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: 'none' }}
                  id={`portfolio-upload ${el.id}`}
                />
              </div>


            </Col>
            {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>

              {imagesList.length >= 8 ? null : <div className='ant-upload-text float-left mt-10'>


                <Button className='fm-addbtn-update'>
                  <label
                    for={`portfolio-upload ${el.id}`}
                    style={{ cursor: 'pointer' }}>
                    <img src={require('../../../../assets/images/icons/image.svg')} width="20" height="20" alt='Fitness' />
Choose File
</label>
                </Button>



              </div>}
            </Col> */}
          </Row>
          <Row gutter={20}>
            {this.renderImages(imagesList, el.id)}
          </Row>
        </div>
      </div>
    })
  }

  renderCreateFolderForm = () => {
    const { selectedPortfolio } = this.state;
    return (
      <Form
        onFinish={this.handlePortfolioForm}
        layout={'vertical'}
        ref={this.formRef2}
      >
        <div className="create-portfolio">
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              {/* <Upload
                name='avatar'
                listType='picture-card'
                className='avatar-uploader'
                id='fileButton'
              >
                <img src={require('../../../../assets/images/icons/upload-small.svg')} alt='upload' className="mb-10" />
                <span className="upload-text">Upload folder<br /> photo</span>
              </Upload> */}

              {selectedPortfolio == false && <div className='mt10'>
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

                  {/* <button type="button" htmlType="button" style={{ cursor: 'pointer', position: 'relative', top: '16px', color: '#fff' }}>
                    <label
                      for='portfolio2'
                      style={{ cursor: 'pointer' }}
                    >
                      Add Photo
                                                        </label>
                  </button> */}
                  <Button className='fm-addbtn-update-view'>
                    <label
                      for='portfolio2'
                      style={{ cursor: 'pointer' }}>
                      <img src={require('../../../../assets/images/icons/upload-small.svg')} alt='upload' className="mb-10" width="39" height="35" />
                      <span className="upload-text">Upload folder<br /> photo</span>
                    </label>
                  </Button>
                </div>
              </div>}
            </Col>
            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <Form.Item
                label='Folder Name'
                name={'folder_name'}
                className="label-big"
              // rules={[required('Folder name')]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <Form.Item
                label='Title'
                className='mb-5 label-big'
                name={'title'}
              // rules={[required('Title')]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={3} xl={3}>
              <Form.Item className='align-center' >
                <label>&nbsp;</label>
                <Button type='primary' htmlType='submit' danger>
                  {selectedPortfolio === false ? 'Create' : 'Update'}
                </Button>
              </Form.Item>
            </Col>

          </Row>
        </div>
      </Form>
    )
  }
  /**
   * @method render
   * @description render component
   */
  render() {
    const { uploadedFolderList, uploadedBrochureList, uploadedCertificationList } = this.props;
    const { selectedPortfolio, brochureList, openUpdateModal } = this.state
    return (
      <div className='card-container signup-tab add-portfolio'>
        <div>
          <Form
            onFinish={this.onFinish}
            layout={'vertical'}
          >
            <div className='inner-content'>
              <Row gutter={28}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <h2> Upload <span>(Optional)</span></h2>
                </Col>
                <Col md={24} lg={24}>
                  <Title level={4}>Create Portfolio</Title>
                  <Text className='fs-10'>Add up to 8 images or upgrade to include more.<br />
                    Hold and drag to reorder photos. Maximum file size 4MB.</Text>
                  <Form.Item
                    name='trade_certificate'
                    id='brochure'
                  >
                    <div className='mt-10'>
                      <div className='ant-upload-text float-left'>
                        {/* {selectedPortfolio && <Button
                          className='fm-addbtn-update'
                          htmlType='button'
                          onClick={() => {
                            this.formRef2.current && this.formRef2.current.setFieldsValue({
                              folder_name: '',
                              title: ''
                            });
                            this.setState({ selectedPortfolio: false })
                          }}
                        >
                          <label
                            // for='brochure'
                            style={{ cursor: 'pointer' }}
                          >
                            <img src={require('../../../../assets/images/icons/image.svg')} width="20" height="20" alt='Fitness' />
                            Create Portfolio
                          </label>
                        </Button>} */}
                      </div>

                      {this.renderCreateFolderForm()}
                      <div className="add-portfolio-block-g-parent">{this.renderFolderList()}</div>

                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className='inner-content'>
              <Row gutter={28}>
                <Col span={24}>
                  <Title level={4}>Add Brochure</Title>
                  <Text className='fs-10'>Add up to 8 images or upgrade to include more.
Hold and drag to reorder photos. Maximum file size 4MB.</Text>
                  <Form.Item
                    name='trade_certificate'
                    id='brochure'
                  >
                    <div className='mt-10'>
                      <input
                        type='file'
                        onChange={(e) => this.certificateFileSelectedHandler(e, 1)}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        style={{ display: 'none' }}
                        id='brochure'
                      />
                      {uploadedBrochureList.length >= 8 ? null : <div className='ant-upload-text float-left'>
                        <Button className='fm-addbtn-update'>
                          <label
                            for='brochure'
                            style={{ cursor: 'pointer' }}
                          >
                            <img src={require('../../../../assets/images/icons/image.svg')} width="20" height="20" alt='Fitness' />
                            Add Photo
                          </label>
                        </Button>
                      </div>}
                    </div>
                    <div className="add-portfolio-block-g-parent">
                      {this.renderUploadedFiles(uploadedBrochureList, 1)}
                    </div>

                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className='inner-content'>
              <Row gutter={28}>
                <Col span={24}>
                  <Title level={4}>Add Certificate</Title>
                  <Text className='fs-10'>Add up to 8 images or upgrade to include more.
Hold and drag to reorder photos. Maximum file size 4MB.</Text>
                  <Form.Item
                    name='trade_certificate'
                    id='certificate'
                  >
                    <div className='mt-10'>
                      <input
                        type='file'
                        onChange={(e) => this.certificateFileSelectedHandler(e, 2)}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        style={{ display: 'none' }}
                        id='certificate'
                      />
                      {uploadedCertificationList.length >= 8 ? null : <div className='ant-upload-text float-left'>
                        <Button className='fm-addbtn-update'>
                          <label
                            for='certificate'
                            style={{ cursor: 'pointer' }}>
                            <img src={require('../../../../assets/images/icons/image.svg')} width="20" height="20" alt='Fitness' />
                            Add Photo
                          </label>
                        </Button>
                      </div>}
                    </div>
                    <div className="add-portfolio-block-g-parent">
                      {this.renderUploadedFiles(uploadedCertificationList, 2)}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Divider className="mt-38 mb-73" />
            <div className='mt-50 mb-32'>
              <Row >
                <Col sxs={24} sm={24} md={24} lg={24} className='align-center'>
                  <Button className="btn-orange" htmlType='submit' type='primary' size='large'
                    style={{ minWidth: 110 }}
                  >Next</Button>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
      </div >
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
    uploadedBrochureList: Array.isArray(venderDetails.brochureList) ? venderDetails.brochureList : [],
    uploadedCertificationList: Array.isArray(venderDetails.certificateList) ? venderDetails.certificateList : [],
  };
};
export default connect(
  mapStateToProps,
  { getPortfolioImages, getUserProfile, portfolioUpload, updatePortfolio, deletePortfolioFolder, deleteDocuments, uploadDocuments, viewBroucher, viewCertification, createPortfolio, viewPortfolio, saveTraderProfile, logout, changeUserName, changeMobNo, changeEmail, changeProfileImage, changeAddress, sendOtp }
)(AddPortfolio);