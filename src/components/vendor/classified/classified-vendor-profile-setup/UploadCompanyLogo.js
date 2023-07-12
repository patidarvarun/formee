import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Upload, message, Avatar, Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { langs } from '../../../../config/localization';
import {
  getUserProfile,
  changeCompanyLogo,
  disableLoading,
  enableLoading,
} from '../../../../actions/index';
import { DEFAULT_IMAGE_TYPE } from '../../../../config/Config';
const { Title } = Typography;

class UploadCompanyLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyLogoUrl: DEFAULT_IMAGE_TYPE,
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    const { id } = this.props.loggedInUser;
    const { userDetails } = this.props;

    this.props.getUserProfile({ user_id: id }, (res) => {
      this.setState({
        imageUrl:
          userDetails.image !== undefined
            ? userDetails.image
            : DEFAULT_IMAGE_TYPE,
        companyLogoUrl: userDetails.company_logo
          ? userDetails.company_logo
          : DEFAULT_IMAGE_TYPE,
      });
    });
  }

  /**
   * @method beforeUpload
   * @descriptionhandle handle photo change
   */
  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG & PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  /**
   * @method handleChange
   * @descriptionhandle handle file type
   */
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  handleFileValidation = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    const isCorrectFormat =
      info.file.type === 'image/jpeg' || info.file.type === 'image/png';
    const isCorrectSize = info.file.size / 1024 / 1024 < 2;
    if (isCorrectSize && isCorrectFormat) {
      return true;
    }
  };
  handleUploadCompanyLogo = (info) => {
    const { id } = this.props.loggedInUser;
    const formData = new FormData();
    formData.append('company_logo', info.file.originFileObj);
    formData.append('user_id', id);
    // Get this url from response in real world.
    this.getBase64(info.file.originFileObj, (imageUrl) =>
      this.setState({
        imageUrl,
        loading: false,
      })
    );
    this.props.enableLoading();
    this.props.changeCompanyLogo(formData, (res) => {
      console.log('res: ', res);
      this.props.disableLoading();
      if (res.status === 1) {
        toastr.success(
          langs.success,
          langs.messages.profile_image_update_success
        );
        this.props.getUserProfile({ user_id: id });
        this.setState({
          companyLogoUrl: res.data
            ? res.data.company_logo
            : this.state.companyLogoUrl,
          loading: false,
        });
      }
    });
  };

  deleteCompanyLogo = () => {
    const { id } = this.props.loggedInUser;
    const formData = new FormData();
    formData.append('user_id', id);
    // formData.append('company_logo', '');
    this.setState({
      loading: true,
    });
    this.props.changeCompanyLogo(formData, (res) => {
      console.log('res: ', res);
      if (res.status === 1) {
        toastr.success(
          langs.success,
          langs.messages.profile_image_update_success
        );
        this.props.getUserProfile({ user_id: id });
        this.setState({
          companyLogoUrl: res.data.companyLogoUrl,
          loading: false,
        });
      }
    });
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { loggedInUser, userDetails } = this.props;
    const { companyLogoUrl, loading } = this.state;
    console.log(userDetails, 'companyLogoUrl: ', companyLogoUrl);

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className='ant-upload-text'>Upload</div>
        <img
          src={require('../../../../assets/images/icons/upload.svg')}
          alt='upload'
        />
      </div>
    );

    return (
      // <div className='emp-avatar-box with-logo'>
      <div
        className={
          userDetails.company_logo
            ? 'emp-avatar-box'
            : 'emp-avatar-box without-logo'
        }
      >
        <Upload
          name='avatar'
          listType='picture-card'
          className='avatar-uploader'
          showUploadList={false}
          //  fileList={fileList}
          customRequest={this.dummyRequest}
          //  onChange={this.handleImageUpload}
          onChange={(info) => {
            if (this.handleFileValidation(info)) {
              this.handleUploadCompanyLogo(info);
            }
          }}
          id='fileButton'
        >
          {userDetails.company_logo ? (
            <Avatar size={91} src={companyLogoUrl} />
          ) : (
            uploadButton
          )}
        </Upload>
        <div className='btn-upload-action'>
          <div className='btn-ant-upload-text'>
            <Title level={4}>Upload Company Logo</Title>
            <span className='subTitle'>Maximum file size 4MB.</span>
          </div>

          {userDetails.company_logo && (
            <div className='ant-upload-text upload-footer mt-15'>
              <label for='fileButton' className='btn-action btn-replace'>
                {' '}
                <Button>
                  <label for='fileButton'>Replace</label>
                </Button>
              </label>
              <Button
                onClick={this.deleteCompanyLogo}
                className='btn-action btn-delete'
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  changeCompanyLogo,
  getUserProfile,
  enableLoading,
  disableLoading,
})(UploadCompanyLogo);
