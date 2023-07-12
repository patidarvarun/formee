import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { Input, Select, Layout, Card, Button, Upload, message, Avatar, Row, Typography, Space, Divider } from 'antd';
import { LoadingOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import Icon from '../../../customIcons/customIcons';
import { Form, Col } from 'antd';
import { langs } from '../../../../config/localization';
import { getUserProfile, viewBroucher, viewCertification, viewPortfolio, changeUserName, changeProfileImage } from '../../../../actions/index'
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import { DEFAULT_IMAGE_TYPE } from '../../../../config/Config'
import history from '../../../../common/History';
import { converInUpperCase } from '../../../common'
const { Title, Text, Paragraph } = Typography;

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitFromOutside: false,
            submitBussinessForm: false,
            imageUrl: DEFAULT_IMAGE_TYPE,
            key: 1,
            certificateList: []
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

    /**
     * @method onTabChange
     * @description handle ontabchange 
     */
    onTabChange = () => {
        const { key } = this.state
        if (key === 1) {
            this.setState({ key: 2 })
        } else if (key === 2) {
            this.setState({ key: 1 })
        }
    }

    /**
     * @method submitCustomForm
     * @description handle custum form  
     */
    submitCustomForm = () => {
        this.setState({
            submitFromOutside: true,
            submitBussinessForm: true
        });
    };

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
     * @descriptionhandle handle photo change
     */
    handleChange = info => {
        
        const { id } = this.props.loggedInUser
        this.setState({
            certificateList: [...info.fileList]
            // [...this.state.certificateList,info.file]
        });
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        const isCorrectFormat = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
        const isCorrectSize = info.file.size / 1024 / 1024 < 2;
        
        if (isCorrectSize && isCorrectFormat) {


            // if (info.file.status === 'done') {
            // const formData = new FormData()
            // formData.append('image', info.file.originFileObj);
            // formData.append('user_id', id)
            // this.props.changeProfileImage(formData, (res) => {
            //     
            //     if (res.status === 1) {
            //         toastr.success(langs.success, langs.messages.profile_image_update_success)
            //         this.props.getUserProfile({ user_id: id })
            //         this.setState({
            //             imageUrl: res.data.image,
            //             loading: false,
            //         })

            //     }
            // })

            // let temp = []
            // fileList.map((el) => {
            //     el.originFileObj && temp.push(el.originFileObj)
            // })
            // 

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
            // for (var i = 0; i < temp.length; i++) {
            //     formData.append('image', temp[i]);
            //     
            // }

            // Object.keys(reqData).forEach((key) => {
            //     formData.append(key, reqData[key])
            // })
            this.setState({
                certificateList: info.fileList
                // [...this.state.certificateList,info.file]
            });

            // this.props.uploadDocuments(formData, (res) => {
            //     

            // })
        }
    };

    /**
     * @method render
     * @description render component  
     */
    render() {
        const { imageUrl, loading, certificateList } = this.state;
        
        const { userDetails } = this.props
        const { Option } = Select;
        return (
            <Layout>
                <Layout>

                    <Layout>
                        <div className='my-profile-box'>
                            <div className='card-container signup-tab'>
                                <div className='top-head-section'>
                                    <div className='left'>
                                        <Title level={2}>My Profile</Title>
                                    </div>
                                    <div className='right'></div>
                                </div>
                                <Card
                                    className='profile-content-box'
                                    title='Profile Set Up'
                                    extra={<Link to='/editProfile'><Space align={'center'} size={9}>Edit <Icon icon='edit' size='12' /></Space></Link>}
                                >
                                    <div className='upload-profile--box'>

                                        <div className='upload-profile-content'>

                                            <div className='mt-10'>
                                                <Upload
                                                    name='avatar'
                                                    listType='picture'
                                                    className='ml-2'
                                                    showUploadList={false}
                                                    action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                                    beforeUpload={this.beforeUpload}
                                                    onChange={this.handleChange}
                                                    // onChange={(e) => {
                                                    //     
                                                    //     // let temp = certificateList.push(e.fileList[0])
                                                    //     // this.setState({ certificateList: e.fileList });

                                                    // }}
                                                    fileList={certificateList}
                                                >
                                                    {/* <div> */}
                                                    {/* {loading && <LoadingOutlined />} */}
                                                    {/* <div className='ant-upload-text float-left'><Link to='#'>
                              Upload Photo</Link> */}
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


                                                    {/* </div> */}
                                                </Upload>
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


                                            </div>
                                        </div>
                                    </div>

                                </Card>
                            </div>
                        </div>
                    </Layout>
                </Layout>
            </Layout >
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
    mapStateToProps,
    { getUserProfile, changeUserName, viewBroucher, viewCertification, viewPortfolio, changeProfileImage }
)(MyProfile);