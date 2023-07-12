import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  Button,
  Divider,
  message,
  Tabs,
  Row,
  Input,
  Typography,
  Upload,
  Form,
  Col,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import {
  portfolioUpload,
  getPortfolioImages,
  getUserProfile,
  updatePortfolio,
  deletePortfolioFolder,
  deleteDocuments,
  uploadDocuments,
  viewBroucher,
  viewCertification,
  viewGallery,
  createPortfolio,
  viewPortfolio,
  saveTraderProfile,
  changeUserName,
  changeMobNo,
  logout,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
  deletePortfolioImages
} from "../../../../actions/index";
import { setCustomLocalStorage } from "../../../../common/Methods";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import EditPortfolioModal from "./EditPortfolioModal";
const { Title, Text } = Typography;

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
      galleryList: [],
      selectedPortfolio: false,
      portfolioList: "",
      imagesList: [],
      fileList: [],
      folderThumbnailUrl: "",
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.viewPortfolio();
    this.props.viewCertification();
    this.props.viewBroucher();
    this.props.viewGallery();
  }
  componentWillReceiveProps = () => {
  }

  /**
   * @method componentDidUpdate
   * @description called to submit form
   */
   componentDidUpdate(prevProps, prevState) {
     console.log('ids',this.props.submitFromOutside)
    if (this.props.submitFromOutside) {
      this.onClearAll();
    }
  }
  onClearAll = () => {
    const { loggedInUser } = this.props;
    this.props.deletePortfolioImages({user_id: loggedInUser.id}, (res) => {
      if (res.status == 200) {
        this.props.viewCertification();
        this.props.viewBroucher();
        this.props.viewGallery();
        this.props.subimitEnd()
      }
    });
  }
  /**
   * @method showModal
   * @description show modal
   */
  showModal = () => {
    this.props.openResumeModal();
  };

  /**
   * @method HandlePortfolio Form
   * @description called to submit form create portfolio
   */
  handlePortfolioForm = (values) => {
    const { portfolioList } = this.state;
    // if (this.state.selectedPortfolio === false) {
    if (!portfolioList) {
      return toastr.error(langs.error, MESSAGES.PORTFOLIO_REQUIRED);
    }
    let reqData = {
      folder_name: values.folder_name,
      title: values.title,
    };
    let temp = [];
    const formData = new FormData();
    for (var i = 0; i < portfolioList.length; i++) {
      formData.append("image", portfolioList[i]);
    }

    Object.keys(reqData).forEach((key) => {
      formData.append(key, reqData[key]);
    });

    this.props.createPortfolio(formData, (res) => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.PORTFOLIO_CREATE_SUCCESS);
        this.props.viewPortfolio();
        // this.formRef2.current && this.formRef2.current.setFieldsValue({
        //   folder_name: '',
        //   title: ''
        // });
      }
    });
    // } else {
    //   values.id = this.state.selectedPortfolio.id
    //   this.props.updatePortfolio(values, res => {
    //     if (res.status === 200) {
    //       toastr.success(langs.success, MESSAGES.PORTFOLIO_UPDATE_SUCCESS)
    //       this.props.viewPortfolio()
    //       this.setState({
    //         selectedPortfolio: false,
    //         portfolioList: ''
    //       })
    //     }
    //   })
    // }
  };

  /**
   * @method onFinish
   * @description called to submit form
   */
  onFinish = (values) => {
  console.log("🚀 ~ file: AddPortfolio.js ~ line 141 ~ AddPortfolio ~ values", values)
    setCustomLocalStorage("uploaddoc", values)
    // this.props.createResume()
    this.props.nextStep(values);
  };

  /**
   * @method certificateFileSelectedHandler
   * @description Used to handle file selection
   */
  certificateFileSelectedHandler = (e, type) => {
    const { files, brochureList, certificationList , galleryList} = this.state;
    let file = e.target.files[0];
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG  & PNG file!");
      this.setState({ invalid: true });
    } else if (!isLt2M) {
      message.error("Image must smaller than 4MB!");
      this.setState({ invalid: true });
    }
    // if (isJpgOrPng && isLt2M) {
    //   let reqData = {
    //     upload_type: type === 2 ? "certification" : type === 1 ? "brochure" : "gallery",
    //     image: e.target.files[0],
    //   };
    //   const formData = new FormData();
    //   Object.keys(reqData).forEach((key) => {
    //     formData.append(key, reqData[key]);
    //   });

    //   let allFile = type === 2 ? certificationList : type === 1 ? brochureList : galleryList;
    //   allFile.push(e.target.files[0]);
    //   if (type === 2) {
    //     this.setState({
    //       certificationList: allFile,
    //     });
    //   } else if (type === 1) {
    //     this.setState({
    //       brochureList: allFile,
    //     });
    //   } else {
    //     this.setState({
    //       galleryList: allFile,
    //     });
    //   }
    if (isJpgOrPng && isLt2M) {
      let reqData = {
        upload_type: type === 2 ? "certification" : (type === 3 ? "gallery" : "brochure"),
        image: e.target.files[0],
      };
      const formData = new FormData();
      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key]);
      });

      let allFile = type === 2 ? certificationList : (type === 3 ? galleryList : brochureList);
      allFile.push(e.target.files[0]);
      if (type === 2) {
        this.setState({
          certificationList: allFile,
        });
      }  if (type === 3) {
        this.setState({
          galleryList: allFile,
        });
      }else {
        this.setState({
          brochureList: allFile,
        });
      }

      this.props.uploadDocuments(formData, (res) => {
        if (res.status === 200) {
          type === 2
            ? this.props.viewCertification()
            : (type === 3 ?
            this.props.viewGallery()
            : this.props.viewBroucher())
          toastr.success(langs.success, MESSAGES.FILE_UPLOAD_SUCCESS);
        }
      });
    }
  };

  /**
   * @method portfolioFileSelectedHandler
   * @description Used to handle file selection
   */
  portfolioFileSelectedHandler = (e, item) => {
    const { files } = this.state;
    let file = e.target.files[0];

    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG  & PNG file!");
      this.setState({ invalid: true });
    } else if (!isLt2M) {
      message.error("Image must smaller than 4MB!");
      this.setState({ invalid: true });
    }
    if (isJpgOrPng && isLt2M) {
      this.setState({
        folderThumbnailUrl: URL.createObjectURL(file),
        portfolioList: [...this.state.portfolioList, file],
      });
    }
  };

  portfolioUpdateHandler = (e, item) => {
    const { userDetails, loggedInUser } = this.props;
    const { files } = this.state;
    let trader_user_id = userDetails.user.trader_profile.id;
    let existImage = item.folder_files.files.image;
    if (Array.isArray(existImage) && existImage.length >= 8) {
      message.error("You can only upload only 8 images");
    } else {
      // Image Upload:
      let file = e.target.files[0];

      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isJpgOrPng) {
        message.error("You can only upload JPG , JPEG  & PNG file!");
        this.setState({ invalid: true });
      } else if (!isLt2M) {
        message.error("Image must smaller than 4MB!");
        this.setState({ invalid: true });
      }
      if (isJpgOrPng && isLt2M) {
        let reqData = {
          parent_id: item.id,
          // trader_user_profile_id:trader_user_id,
          file: e.target.files[0],
        };

        this.setState({
          portfolioList: [...this.state.portfolioList, file],
        });
        const formData = new FormData();
        Object.keys(reqData).forEach((key) => {
          formData.append(key, reqData[key]);
        });
        this.props.portfolioUpload(formData, (res) => {
          if (res.status === 200) {
            this.getPortFolioPics(item);
            toastr.success(langs.success, MESSAGES.PORTFOLIO_UPDATE_SUCCESS);
            this.props.viewPortfolio();
          }
        });
      }
    }
  };

  getPortFolioPics = (el) => {
    const { loggedInUser } = this.props;
    const { imagesList } = this.state;
    let trader_user_id = loggedInUser.id;

    this.props.getPortfolioImages({ id: el.id, trader_user_id }, (res) => {
      if (res.status === 200) {
        let list = res.data.img_video.files.image
          ? res.data.img_video.files.image
          : [];
        let images = { folderId: el.id, list: [...list] };
        let index = imagesList.findIndex((f) => f.folderId === el.id);
        if (images.list.length === 0) {
          toastr.warning(langs.warning, "Images not found");
        } else if (index >= 0) {
          imagesList[index] = images;
          this.setState({ imagesList });
        } else {
          this.setState({ imagesList: [...imagesList, images] });
        }
      }
    });
  };
  // upload image popup
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  /**
   * @method renderUploadedFiles
   * @description Used to render uploaded files
   */
  renderUploadedFiles = (list, type) => {
    if (list.length) {
      return list.map((el, i) => {
        return (
          <div className="add-portfolio-block-parent add-portfolio-parent-cus-width">
            <div className="padding resume-preview add-portfolio-block">
              <Row gutter={20}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <img src={el.path} width="60px" height="60px" />
                  <div>
                    {/* <span>{el.original_name}</span> */}
                    <a
                      className="blue-link"
                      onClick={(e) => {
                        toastr.confirm(`${MESSAGES.FILE_DELETE_CONFIRM}`, {
                          onOk: () => this.removeUploadedFile(el.id, type),
                          onCancel: () => {},
                        });
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.13788 13.3275C10.7087 13.3275 13.6034 10.4328 13.6034 6.862C13.6034 3.29119 10.7087 0.396484 7.13788 0.396484C3.56707 0.396484 0.672363 3.29119 0.672363 6.862C0.672363 10.4328 3.56707 13.3275 7.13788 13.3275ZM9.53472 5.37953C9.78721 5.12703 9.78721 4.71766 9.53472 4.46517C9.28222 4.21267 8.87285 4.21267 8.62035 4.46517L7.13788 5.94764L5.65541 4.46517C5.40291 4.21267 4.99354 4.21267 4.74104 4.46517C4.48855 4.71766 4.48855 5.12703 4.74104 5.37953L6.22352 6.862L4.74104 8.34448C4.48855 8.59697 4.48855 9.00634 4.74104 9.25884C4.99354 9.51133 5.40291 9.51133 5.65541 9.25884L7.13788 7.77636L8.62036 9.25884C8.87285 9.51133 9.28222 9.51133 9.53472 9.25884C9.78721 9.00634 9.78721 8.59697 9.53472 8.34448L8.05224 6.862L9.53472 5.37953Z"
                          fill="black"
                        />
                      </svg>
                    </a>
                  </div>
                </Col>
              </Row>
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
  removeUploadedFile = (id, type) => {
    if (type === 4) {
      this.props.deletePortfolioFolder(id, (res) => {
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.FILE_DELETE_SUCCESS);
          this.props.viewPortfolio();
        }
      });
    } else {
      this.props.deleteDocuments(id, (res) => {
        if (res.status === 200) {
          toastr.success(langs.success, MESSAGES.FILE_DELETE_SUCCESS);
          if (type === 1) {
            this.props.viewBroucher();
          } if (type === 3) {
            this.props.viewGallery()
          } else {
            this.props.viewCertification();
          }
        }
      });
    }
  };

  /**
   * @method renderImages
   * @description Used to render uploaded files
   */
  renderImages = (images, id) => {
    const { imagesList } = this.state;
    let index = imagesList.findIndex((i) => i.folderId === id);

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

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  /**
   * @method handleImageUpload
   * @description handle image upload
   */
  handleImageUpload = ({ file, fileList }) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG  & PNG file!");
      return false;
    } else if (!isLt2M) {
      message.error("Image must smaller than 4MB!");
      return false;
    } else {
      this.setState({ imagesList: fileList });
    }
  };

  renderFolderList = () => {
    const { uploadedFolderList, userDetails, loggedInUser } = this.props;
    const { imagesList } = this.state;

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
        <img
          src={require("../../../../assets/images/icons/upload-small.svg")}
          width="28"
          height="25"
          alt="Fitness"
          className="mb-10"
        />
        <span className="upload-text">Add Photo</span>
      </div>
    );
    return uploadedFolderList.map((el, index) => {
      let isShowIndex = imagesList.findIndex((f) => f.folderId === el.id);
      return (
        <div className="add-portfolio-block-parent ">
          <div className="padding resume-preview add-portfolio-block">
            <Row gutter={0}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <div className="add-thumb">
                  <img src={el.path} />
                </div>
                {/* {imagesList.length >= 8 ? null : <div className='ant-upload-text float-left mt-20'>
                <Button className='fm-addbtn-update-view'>
                  <label
                    for={`portfolio-upload ${el.id}`}
                    style={{ cursor: 'pointer' }}>
                    <img src={require('../../../../assets/images/icons/upload-small.svg')} width="28" height="25" alt='Fitness' className="mb-10" />
                    <span className="upload-text">Add Photo</span>
                  </label>
                </Button>
              </div>} */}
                {/* <Upload
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  fileList={imagesList}
                  customRequest={this.dummyRequest}
                  // onChange={this.handleImageUpload}
                  onChange={(e) => {this.portfolioUpdateHandler(e, el)}}
                  // id='fileButton'
                  multiple
              >
                {imagesList.length >= 8 ? null : uploadButton}
              </Upload> */}
              </Col>
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <div>
                  <div className="title">Folder Name</div>
                  <Text className="subtitle">{el.folder_name}</Text>
                  <div className="title mt-16">Title</div>
                  <Text className="no-bold subtitle">{el.title}</Text>
                  <div
                    className="right-edit-link"
                    onClick={() => {
                      this.setState(
                        {
                          selectedPortfolio: el,
                        },
                        () => {
                          this.showModal();
                        }
                      );
                      // this.formRef.current && this.formRef.current.setFieldsValue({
                      //   folder_name: el.folder_name,
                      //   title: el.title
                      // });
                      // console.log(this.formRef.current, 'this.formRef2.current: 11 ', this.formRef.current);
                    }}
                  >
                    <span className="edit-text">Edit</span>
                    <img
                      src={require("../../../../assets/images/icons/edit-pencil-dark-blue.svg")}
                      alt="Fitness"
                    />
                  </div>
                </div>
                <div className="add-remove-img">
                  <Text
                    className="blue-link"
                    onClick={(e) => {
                      toastr.confirm(`${MESSAGES.FILE_DELETE_CONFIRM}`, {
                        onOk: () => this.removeUploadedFile(el.id, 3),
                      });
                    }}
                  >
                    Remove
                  </Text>
                  <Text
                    onClick={() => {
                      if (isShowIndex >= 0) {
                        //Logic to hide images
                        let temp = imagesList.filter(
                          (i) => i.folderId !== el.id
                        );
                        this.setState({ imagesList: [...temp] });
                      } else {
                        //show image
                        this.getPortFolioPics(el);
                      }
                    }}
                  >
                    {isShowIndex >= 0 ? "Hide Images" : "Show Images"}
                  </Text>
                  {/* <Text onClick={() => {
                  
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
                    type="file"
                    multiple
                    onChange={(e) => {
                      this.portfolioUpdateHandler(e, el);
                    }}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    style={{ display: "none" }}
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
            <Row gutter={20}>{this.renderImages(imagesList, el.id)}</Row>
          </div>
        </div>
      );
    });
  };

  renderCreateFolderForm = () => {
    const { selectedPortfolio, folderThumbnailUrl } = this.state;
    return (
      <Form
        onFinish={this.handlePortfolioForm}
        layout={"vertical"}
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

              <div className="mt10">
                <input
                  type="file"
                  onChange={(e) =>
                    this.portfolioFileSelectedHandler(e, selectedPortfolio)
                  }
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: "none" }}
                  id="portfolio2"
                />
                <div className="ant-upload-text float-left">
                  <Button className="fm-addbtn-update-view">
                    <label for="portfolio2" style={{ cursor: "pointer" }}>
                      <img
                        src={
                          folderThumbnailUrl
                            ? folderThumbnailUrl
                            : require("../../../../assets/images/icons/upload-small.svg")
                        }
                        alt="upload"
                        className="mb-10"
                        width="39"
                        height="35"
                      />
                      {/* <img src={require('../../../../asses/images/icons/upload-small.svg')} alt='upload' className="mb-10" width="39" height="35" /> */}
                      <span className="upload-text">
                        Upload folder
                        <br /> photo
                      </span>
                    </label>
                  </Button>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <Form.Item
                label="Folder Name"
                name={"folder_name"}
                className="label-big"
                // rules={[required('Folder name')]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <Form.Item
                label="Title"
                className="mb-5 label-big"
                name={"title"}
                // rules={[required('Title')]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={3} xl={3}>
              <Form.Item className="align-center">
                <label>&nbsp;</label>
                <Button type="primary" htmlType="submit" danger>
                  {/* {selectedPortfolio === false ?  */}
                  Create
                  {/* // : 'Update'} */}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    );
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const {
      uploadedFolderList,
      uploadedBrochureList,
      uploadedGalleryList,
      uploadedCertificationList,
      loggedInUser
    } = this.props;
    const {
      selectedPortfolio,
      brochureList,
      galleryList,
      openUpdateModal,
      fileList,
      portfolioList,
    } = this.state;
    console.log("portfolioList: $$$", portfolioList);
    const { Dragger } = Upload;
    const props = {
      name: "file",
      // multiple: false,
      showUploadList: false,
      customRequest: this.dummyRequest,
      beforeUpload: (file) => {
        console.log("file: ", file);
        console.log("test: ", test);

        const reader = new FileReader();

        reader.onload = (e) => {
          // console.log(e.target.result);
          reader.readAsText(e.target.result);
        };
        let test = URL.createObjectURL(file);
        //  reader.readAsText(file);
        //  console.log('reader.readAsText(file): ', reader.readAsText(file));

        // Prevent upload
        return false;
      },
      // action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",
      // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      listType: "picture-card",

      // onChange(info) {
      //   console.log('info: ', info);
      //   let reader = new FileReader();
      //   reader.readAsDataURL(info.file);
      // const { status } = info.file;
      // if (status !== 'uploading') {

      // }
      // if (status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
      // },
    };
    return (
      <div className="card-container signup-tab add-portfolio">
        <div>
          <Form onFinish={this.onFinish} layout={"vertical"}>
            {/* <div className='inner-content'>
              <Row gutter={28}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <h2>
                    {" "}
                    Upload <span>(Optional)</span>
                  </h2>
                </Col>
                <Col md={24} lg={24}>
                  <Title level={4}>Create Portfolio</Title>
                  <Text className="fs-10">
                    Add up to 8 images or upgrade to include more.
                    <br />
                    Hold and drag to reorder photos. Maximum file size 4MB.
                  </Text>
                  <Form.Item name="trade_certificate" id="brochure">
                    <div className="mt-10">
                      <div className="ant-upload-text float-left"></div>

                      {this.renderCreateFolderForm()}
                      <div className="add-portfolio-block-g-parent">
                        {this.renderFolderList()}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div> */}
            {loggedInUser.user_type !== "fitness" && (<div className="inner-content">
              <Row gutter={28}>
                <Col span={24}>
                  <Title level={4}>Add Certifications</Title>
                  <Text className="fs-10">
                    Hold and drag to reorder photos. Maximum file size 4MB.
                  </Text>
                  <Form.Item name="trade_certificate" id="certificate">
                    <div className="add-portfolio-block-g-parent">
                      {uploadedCertificationList.length > 0 && this.renderUploadedFiles(uploadedCertificationList, 2)}
                    </div>
                    <div className="mt-10">
                      <input
                        type="file"
                        onChange={(e) =>
                          this.certificateFileSelectedHandler(e, 2)
                        }
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        style={{ display: "none" }}
                        id="certificate"
                      />
                      {uploadedCertificationList.length >= 8 ? null : (
                        <div className="ant-upload-text float-left">
                          <Button className="fm-addbtn-update">
                            <label
                              for="certificate"
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={require("../../../../assets/images/icons/image.svg")}
                                width="20"
                                height="20"
                                alt="Fitness"
                              />
                              Add Photo
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>)}
            {loggedInUser.user_type !== "fitness" && (<div className="inner-content">
              <Row gutter={28}>
                <Col span={24}>
                  <Title level={4}>Add Brochure</Title>
                  <Text className="fs-10">
                    Hold and drag to reorder photos. Maximum file size 4MB.
                  </Text>
                  <Form.Item name="trade_certificate" id="brochure">
                    <div className="add-portfolio-block-g-parent">
                      {uploadedBrochureList.length > 0 && this.renderUploadedFiles(uploadedBrochureList, 1)}
                    </div>
                    <div className="mt-10">
                      <input
                        type="file"
                        onChange={(e) =>
                          this.certificateFileSelectedHandler(e, 1)
                        }
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        style={{ display: "none" }}
                        id="brochure"
                      />
                      {uploadedBrochureList.length >= 8 ? null : (
                        <div className="ant-upload-text float-left">
                          <Button className="fm-addbtn-update">
                            <label for="brochure" style={{ cursor: "pointer" }}>
                              <img
                                src={require("../../../../assets/images/icons/image.svg")}
                                width="20"
                                height="20"
                                alt="Fitness"
                              />
                              Add Photo
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>)}
            <div className="inner-content">
              <Row gutter={28}>
                <Col span={24}>
                  <Title level={4}>Add Gallery</Title>
                  <Text className="fs-10">
                    Hold and drag to reorder photos. Maximum file size 4MB.
                  </Text>
                  <Form.Item name="trade_certificate" id="gallery">
                    <div className="add-portfolio-block-g-parent">
                      {uploadedGalleryList.length > 0 && this.renderUploadedFiles(uploadedGalleryList, 3)}
                    </div>
                    <div className="mt-10">
                      <input
                        type="file"
                        onChange={(e) =>
                          this.certificateFileSelectedHandler(e, 3)
                        }
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        style={{ display: "none" }}
                        id="gallery"
                      />
                      {uploadedGalleryList.length >= 8 ? null : (
                        <div className="ant-upload-text float-left">
                          <Button className="fm-addbtn-update">
                            <label for="gallery" style={{ cursor: "pointer" }}>
                              <img
                                src={require("../../../../assets/images/icons/image.svg")}
                                width="20"
                                height="20"
                                alt="Fitness"
                              />
                              Add Photo
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="button-block-row">
              <Row>
                <Col sxs={24} sm={24} md={24} lg={24} className="align-center">
                  <Button
                    className="btn-outlined"
                    htmlType="submit"
                    type="primary"
                    size="large"
                    onClick={() => this.props.previousStep()}
                  >
                    Previous Step
                  </Button>
                  <Button
                    className="btn-orange"
                    htmlType="submit"
                    type="primary"
                    size="large"
                    style={{ minWidth: 110 }}
                  >
                    Next Step
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
        {selectedPortfolio && (
          <EditPortfolioModal
            selectedPortfolio={selectedPortfolio}
            visibleEditModal={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          />
        )}
        {/* <Modal
          className="edit-uploadpopup"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
        >
          <Form layout="vertical" ref={this.formRef} >

            <Row gutter={[15]}>
              {console.log(this.formRef.current,'this.formRef2.current')}
              <Col md={4}>
                <img src={require('../../../../assets/images/upload-img.png')} />
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
                         </Row>
          </Form>


          <Divider />
          <div className="uploader-list-block">
            <Row>
              <Col md={24}>
                <div className="upload-section-popup">
                  <Dropzone
                    customValidator={(file) => {
                      console.log('file: vali %%% ', file);
                    }}
                    onDrop={(files) => {
                      let file = files[0];
                      console.log('file: %%% ', file.type);

                      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
                      const isLt2M = file.size / 1024 / 1024 < 4;
                      if (!isJpgOrPng) {
                        toastr.warning('You can only upload JPG , JPEG  & PNG file!');
                        return
                      } else if (!isLt2M) {
                        toastr.warning('Image must smaller than 4MB!');
                        return
                      }

                      files.map(file => Object.assign(file, {
                        preview: URL.createObjectURL(file)
                      }))
                      this.setState({ fileList: [...fileList, files[0]] })
                    }}>
                    {({ getRootProps, getInputProps }) => (
                      <section className="container">
                        <div {...getRootProps({
                        })}>
                          <p className="ant-upload-drag-icon">
                            <img src={require('../../../../assets/images/upload-icons-new.png')} />
                          </p>
                          <p className="ant-upload-text">Drag and Drop file </p>
                          <input {...getInputProps()} />
                          <Button className="browser-btn" > Browser</Button>
                        </div>
                      </section>
                      // <section className="container">
                      //   <div {...getRootProps({ className: 'dropzone' })}>
                      //     <input {...getInputProps()} />
                      //     <p>Drag 'n' drop some files here, or click to select files</p>
                      //   </div>
                      //   <aside>
                      //     <h4>Files</h4>
                      //     <ul>{files}</ul>
                      //   </aside>
                      // </section>
                    )}
                  </Dropzone>
             
                  <div className="upload-list-detail">
                    {fileList.map((f, i) => {
                      return (<div className="thumb-parent-block">
                        <div className="thumb">
                          <img src={f.preview} />
                        </div>
                        <div className="file-name">
                          {f.name} 225kb
                      </div>
                        <div className="close-icon">
                          <CloseOutlined size={10} onClick={() => {
                            fileList.splice(i, 1)
                            this.setState({ fileList })
                          }} />
                        </div>
                      </div>)
                    })}             
                  </div>
                </div>
              </Col>
            </Row>
          </div>
       
        </Modal>
     */}
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
    uploadedFolderList: Array.isArray(venderDetails.portfolioFolderList)
      ? venderDetails.portfolioFolderList
      : [],
    uploadedBrochureList: Array.isArray(venderDetails.brochureList)
      ? venderDetails.brochureList
      : [],
      uploadedGalleryList: Array.isArray(venderDetails.galleryList)
      ? venderDetails.galleryList
      : [],
    uploadedCertificationList: Array.isArray(venderDetails.certificateList)
      ? venderDetails.certificateList
      : [],
  };
};
export default connect(mapStateToProps, {
  getPortfolioImages,
  getUserProfile,
  portfolioUpload,
  updatePortfolio,
  deletePortfolioFolder,
  deleteDocuments,
  uploadDocuments,
  viewBroucher,
  viewCertification,
  viewGallery,
  createPortfolio,
  viewPortfolio,
  saveTraderProfile,
  logout,
  changeUserName,
  changeMobNo,
  changeEmail,
  changeProfileImage,
  changeAddress,
  sendOtp,
  deletePortfolioImages
})(AddPortfolio);
