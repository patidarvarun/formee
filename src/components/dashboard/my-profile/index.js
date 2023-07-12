import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Link } from "react-router-dom";
import {
  Input,
  Select,
  Layout,
  Card,
  Upload,
  message,
  Avatar,
  Row,
  Typography,
  Space,
  Divider,
} from "antd";
import { LoadingOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import Icon from "../../customIcons/customIcons";
import { Form, Col } from "antd";
import { langs } from "../../../config/localization";
import {
  getUserProfile,
  changeUserName,
  changeProfileImage,
} from "../../../actions/index";
import AppSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import { DEFAULT_IMAGE_TYPE } from "../../../config/Config";
import history from "../../../common/History";
import { converInUpperCase } from "../../common";
const { Title, Text, Paragraph } = Typography;

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitFromOutside: false,
      submitBussinessForm: false,
      imageUrl: DEFAULT_IMAGE_TYPE,
      key: 1,
    };
  }
  formRef = React.createRef();

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
      });
    });
  }

  /**
   * @method onTabChange
   * @description handle ontabchange
   */
  onTabChange = () => {
    const { key } = this.state;
    if (key === 1) {
      this.setState({ key: 2 });
    } else if (key === 2) {
      this.setState({ key: 1 });
    }
  };

  /**
   * @method submitCustomForm
   * @description handle custum form
   */
  submitCustomForm = () => {
    this.setState({
      submitFromOutside: true,
      submitBussinessForm: true,
    });
  };

  /**
   * @method beforeUpload
   * @descriptionhandle handle photo change
   */
  beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG , JPEG & PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  /**
   * @method handleChange
   * @descriptionhandle handle photo change
   */
  handleChange = (info) => {
    const { id } = this.props.loggedInUser;
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    const isCorrectFormat =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    const isCorrectSize = info.file.size / 1024 / 1024 < 2;
    if (isCorrectSize && isCorrectFormat) {
      // if (info.file.status === 'done') {
      const formData = new FormData();
      formData.append("image", info.file.originFileObj);
      formData.append("user_id", id);
      this.props.changeProfileImage(formData, (res) => {
        if (res.status === 1) {
          toastr.success(
            langs.success,
            langs.messages.profile_image_update_success
          );
          this.props.getUserProfile({ user_id: id });
          this.setState({
            imageUrl: res.data.image,
            loading: false,
          });
        }
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { imageUrl, loading } = this.state;
    const { userDetails, loggedInUser } = this.props;
    const { Option } = Select;
    return (
      <Layout>
        <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className="my-profile-box">
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>My Profile</Title>
                  </div>
                  <div className="right"></div>
                </div>
                <div className="sub-head-section">
                  <Text>All Fields Required</Text>
                </div>
                <Card
                  className="profile-content-box"
                  title="Profile Set Up"
                  extra={
                    <Link
                      to={
                        loggedInUser.user_type === "business"
                          ? "/edit-business-Profile"
                          : "/editProfile"
                      }
                    >
                      <Space align={"center"} size={9}>
                        Edit <Icon icon="edit" size="12" />
                      </Space>
                    </Link>
                  }
                >
                  <div className="upload-profile--box">
                    <div className="upload-profile-pic">
                      {imageUrl ? (
                        <Avatar size={91} src={imageUrl} />
                      ) : (
                        <Avatar size={91} icon={<UserOutlined />} />
                      )}
                    </div>
                    <div className="upload-profile-content">
                      {/* <Title level={4} className='mb-10'>{`${userDetails.fname} ${userDetails.lname}`}</Title> */}
                      <Title level={4} className="mb-10">{`${converInUpperCase(
                        userDetails.name
                      )}`}</Title>
                      <Text className="fs-11">
                        {/* {userDetails.address} */}
                        (Member since {userDetails.member_since})
                      </Text>
                      <div className="mt-10">
                        <Upload
                          name="avatar"
                          listType="picture"
                          className="ml-2"
                          showUploadList={false}
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          beforeUpload={this.beforeUpload}
                          onChange={this.handleChange}
                        >
                          <div>
                            {loading && <LoadingOutlined />}
                            <div className="ant-upload-text float-left">
                              <Link to="#">Upload Photo</Link>
                            </div>
                          </div>
                        </Upload>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Title level={4} className="mb-30">
                        Profile Information
                      </Title>
                      <Link to="/change-password">
                        <LockOutlined /> Change Password
                      </Link>
                    </div>
                    <Text className="label">Contact Name :</Text>
                    {/* <Paragraph className='label-value'>{`${userDetails.fname} ${userDetails.lname}`}</Paragraph> */}
                    <Paragraph className="label-value">{`${converInUpperCase(
                      userDetails.name
                    )}`}</Paragraph>

                    <Text className="label">Email :</Text>
                    <Paragraph className="label-value">
                      {userDetails.email}
                    </Paragraph>

                    <Text className="label">Contact Number :</Text>
                    <Paragraph className="label-value">
                      {userDetails.mobile_no}
                    </Paragraph>

                    <Text className="label">Address :</Text>
                    <Paragraph className="label-value">
                      {userDetails.address}
                    </Paragraph>

                    <Divider />
                    <Title level={4} className="mb-26 mt-12">
                      Payment Methods
                    </Title>

                    <Form
                      name="creditCards"
                      layout={"vertical"}
                      className="pb-30"
                    >
                      <Row>
                        <Col span={12}>
                          <Form.Item label="Credit Card" name="crediCards">
                            <Input defaultValue={"5215-2635-52xx"} disabled />
                            {/* <Select
                              placeholder='5215-2635-52xx'
                              allowClear
                            >
                              <Option>5215-2635-52xx</Option>
                            </Select> */}
                          </Form.Item>
                          <div className="align-right add-card-link">
                            <Link to="/">
                              <Icon
                                icon="add-circle"
                                size="16"
                                className="mr-7"
                              />{" "}
                              Add new card
                            </Link>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
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
  getUserProfile,
  changeUserName,
  changeProfileImage,
})(MyProfile);
