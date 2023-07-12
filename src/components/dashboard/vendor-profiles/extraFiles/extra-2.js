import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import validator from 'validator'
import { Button, Upload, message, Avatar, form, Row, Typography, Divider, Space } from 'antd';
import { LoadingOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Col } from 'antd';
import { langs } from '../../../../config/localization';
import { getUserProfile, uploadDocuments, viewBroucher, viewCertification, createPortfolio, viewPortfolio, saveTraderProfile, changeUserName, changeMobNo, logout, changeEmail, changeProfileImage, changeAddress, sendOtp } from '../../../../actions/index'
import Icon from '../../../customIcons/customIcons';
import { SIZE } from '../../../../config/Config';
import './style.less';
import { validFileType, validFileSize } from '../../../common'
import { MESSAGES } from '../../../../config/Message'
import { converInUpperCase } from '../../../common'

const { Title, Text } = Typography;

class AddPortfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      certificate: [],
      files: [],
      loading: false,
      resumeFileList: [],
      invalid: false,
      submitBussinessForm: false,
      submitFromOutside: false,
      imageUrl: '',
      key: 1,
      value: '',
      address: '',
      postal_code: '',
      number: '',
      firstName: '',
      lastName: '',
      mobileNo: '',
      otpModalVisible: false, isNumberVarify: false, isVisible: true,
      brochureList: [], certificateList: [], portfolioList: []
    };
  }
  formRef = React.createRef();

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    const { userDetails } = this.props;
    this.props.viewPortfolio()
    this.props.viewCertification()
    this.props.viewBroucher()
  }

  // /**
  //  * @method componentDidUpdate
  //  * @description called to submit form 
  //  */
  // componentDidUpdate(prevProps, prevState) {
  //     if (prevProps.submitFromOutside !== this.props.submitFromOutside) {
  //         this.setState({ address: '' })
  //         this.onClearAll();
  //     }
  // }

  /** 
   * @method beforeUpload
   * @description handle image Loading 
   */
  beforeUpload(file) {
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  /** 
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields 
   */
  getInitialValue = () => {
    const { name, image, business_loc, mobile_no, email, pincode, fname, lname } = this.props.userDetails;
    const { userDetails } = this.props
    
    let Name = 'Arpt kanodia'
    let splitedName = []
    let lastNameArray = []
    let laname = ''
    let bussiness_loc = ''
    if (Name !== undefined) {
      splitedName = Name.split(' ');
      splitedName.map((el, index) => {
        if (index > 0) {
          lastNameArray.push(splitedName[index])
        }
      })
      laname = lastNameArray.toString().replace(',', ' ')
    }

    let firstName = (Array.isArray(splitedName) && splitedName.length) ? converInUpperCase(splitedName[0]) : ''
    let lastName = (Array.isArray(splitedName) && splitedName.length > 1) ? converInUpperCase(laname) : ''
    let temp = {
      name,
      bussiness_name: userDetails.user.business_name,
      email: userDetails.user.email,
      image,
      // address:'userDetails.user.business_location',
      mobile_no: userDetails.user.contact_number,
      pincode: userDetails.user.business_pincode,
      fname: firstName,
      lname: lastName,
    }
    return temp;
  }

  /**
* @method renderUploadField
* @description render upload input field
*/
  renderUploadField = (fileName, elId) => {
    const { submitBussinessForm } = this.props
    
    let oversizedImage = fileName && fileName.length !== 0 && fileName.size > SIZE;
    let fileType = fileName && fileName.length !== 0 && fileName.type
    let validType = fileType === 'image/png' ||
      fileType === 'image/jpeg'
    return (
      <div>
        <div className='form-control custom-file-upload'>
          {fileName && fileName.length !== 0 ?
            <div className='upload-file-name'>
              <span>{fileName.name}</span>
              <Icon icon='delete' size='20' onClick={(e) => this.removeFile(elId)} />
            </div>
            : <label htmlFor={elId}>{'Choose file to upload'}<Icon icon='upload' size='20' /></label>
          }
        </div>
        {submitBussinessForm && fileName && fileName.length === 0 && (
          <div className='ant-form-item-explain form-item-split'>
            {langs.validation_messages.imgRequired}
          </div>
        )}
        {fileName && fileName.length !== 0 && oversizedImage && validType && (
          <div className='ant-form-item-explain form-item-split'>
            {langs.validation_messages.imgSize}
          </div>
        )}
        {fileName && fileName.length !== 0 && !validType && (
          <div className='ant-form-item-explain form-item-split'>
            {langs.validation_messages.imgType}
          </div>
        )}
      </div>
    )
  }

  /**
   * @method on finish 
   * @description varify number
   */
  onFinish = (value) => {
    
    const { brochureList, certificateList, portfolioList } = this.state
    let data = {
      brochure: brochureList,
      certificate: certificateList,
      portfolio: portfolioList
    }
    
    
    


    this.props.nextStep(data)
    // this.props.saveTraderProfile(value, (res) => {

    // })
  }


  /**
  * @method handleBrochureImageUpload
  * @description handle image upload
  */
  handleBrochureImageUpload = ({ file, fileList }) => {
    
    //    return

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    }
    else {
      let temp = []
      fileList.map((el) => {
        el.originFileObj && temp.push(el.originFileObj)
      })
      

      // let reqData = {
      //     title: 'Test',
      //     folder_name: 'ddssafsd',
      //     // image: temp
      // }

      let reqData = {
        upload_type: 'certification',
        // image:temp[0]
      }
      const formData = new FormData()
      for (var i = 0; i < temp.length; i++) {
        formData.append('image', temp[i]);
        
      }

      Object.keys(reqData).forEach((key) => {
        formData.append(key, reqData[key])
      })

      this.props.uploadDocuments(formData, (res) => {
        

      })
      // this.setState({ brochureList: fileList });


    }
  }

  /**
   * @method handleCertificateImageUpload
   * @description handle image upload
   */
  handleCertificateImageUpload = ({ file, fileList }) => {
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      // this.setState({ certificateList: fileList });
    }
  }

  /**
   * @method handlePortfolioImageUpload
   * @description handle image upload
   */
  handlePortfolioImageUpload = ({ file, fileList }) => {
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      this.setState({ portfolioList: fileList });
    }
  }

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  handleRemoveId = id => {
    
    return null
    // if (id !== '-1') {
    //     return null;
    // } else {
    //     return (
    //         <DeleteOutlined />
    //     )
    // }
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { brochureList, certificateList, portfolioList, loading } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Fragment>
        {/* <Form onFinish={this.onFinish}> */}
        <div>
          <Row gutter={28}>
            <Col span={12}>
              <Title level={4} className='text-blue fs-18'>Add Brochure</Title>
              <Text className='fs-10'>Photos can be up to 4MB for the types .png .jpeg format</Text>
              {/* <Form.Item name={'c'}> */}
              {/* <Upload
                                        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        // listType="fileList"
                                        // listType="picture-card"
                                        // showUploadList={true}
                                        // url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        // listType="picture-card"
                                        // fileList={brochureList}
                                        // customRequest={this.dummyRequest}
                                        // onChange={this.handleBrochureImageUpload}
                                        name='avatar'
                                        // listType='picture'
                                        className='ml-2'
                                        onChange={(e) => {
                                            

                                        }}
                                    // multiple={true}
                                    // showUploadList={false}
                                    // action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                    // beforeUpload={this.beforeUpload}

                                    > */}
              <Upload
                name='avatar'
                listType='picture'
                className='ml-2'
                showUploadList={false}
                // action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                // beforeUpload={this.beforeUpload}
                onChange={this.handleBrochureImageUpload}
              >
                <div>
                  {loading && <LoadingOutlined />}
                  <div className='ant-upload-text float-left'><Link to='#'>
                    Upload Photo</Link></div>
                </div>
                {/* {brochureList.length >= 8 ? null :
                                            <div className='ant-upload-text float-left'>
                                                <Button danger>
                                                    <label
                                                        for='fileButton'
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        Add Photo
                                                </label>
                                                </Button>
                                            </div>
                                        } */}
              </Upload>
              {/* </Form.Item> */}
            </Col>
          </Row>
          <Row gutter={28}>
            <Col span={12}>
              <Title level={4} className='text-blue fs-18'>Add Certificate</Title>
              <Text className='fs-10'>Photos can be up to 4MB for the types .png .jpeg format</Text>
              {/* <Form.Item name={'a'}> */}
              <Upload
                listType="picture"
                name="certificate"
                showUploadList={true}
                fileList={certificateList}
                // customRequest={this.dummyRequest}
                onChange={(e) => {
                  
                  // let temp = certificateList.push(e.fileList[0])
                  this.setState({ certificateList: e.fileList });

                }}
              // onChange={this.handleCertificateImageUpload}
              >
                {certificateList.length >= 8 ? null : <div className='ant-upload-text float-left'>
                  <Button htmlType='button' danger>
                    <label
                      for='fileButton'
                      style={{ cursor: 'pointer' }}
                    >
                      Add Photo
                                                </label>
                  </Button>
                </div>}
              </Upload>
              {/* </Form.Item> */}
            </Col>
          </Row>
          <Row gutter={28}>
            <Col span={12}>
              <Title level={4} className='text-blue fs-18'>Add Portfolio</Title>
              <Text className='fs-10'>Photos can be up to 4MB for the types .png .jpeg format</Text>
              {/* <Form.Item name={'b'}> */}
              <Upload
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                name="portfolio"
                showUploadList={true}
                fileList={portfolioList}
                customRequest={this.dummyRequest}
                onChange={this.handlePortfolioImageUpload}
              >
                {portfolioList.length >= 8 ? null : <div className='ant-upload-text float-left'>
                  <Button htmlType='button' danger>
                    <label
                      for='fileButton'
                      style={{ cursor: 'pointer' }}
                    >
                      Add Photo
                                                </label>
                  </Button>
                </div>}
              </Upload>
              {/* </Form.Item> */}
            </Col>
          </Row>
        </div>
        <Button htmlType='submit' type='primary' size='middle' className='btn-blue'>
          NEXT
                    </Button>
        {/* </Form> */}
      </Fragment >
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {}
  };
};
export default connect(
  mapStateToProps,
  { getUserProfile, uploadDocuments, viewBroucher, viewCertification, createPortfolio, viewPortfolio, saveTraderProfile, logout, changeUserName, changeMobNo, changeEmail, changeProfileImage, changeAddress, sendOtp }
)(AddPortfolio);