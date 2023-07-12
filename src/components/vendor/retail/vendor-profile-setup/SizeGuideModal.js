import React from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  Form,
  Input,
  Typography,
  Row,
  Col,
  Button,
  Modal,
  Upload,
  message,
} from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  contactAdSendMessageAPI,
  saveSizeGuide,
} from "../../../../actions";
import { STATUS_CODES } from "../../../../config/StatusCode";
import { MESSAGES } from "../../../../config/Message";
import { langs } from "../../../../config/localization";
import Container from "./DropdownContainer";
import "react-dropdown-tree-select/dist/styles.css";
const { Dragger } = Upload;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13, offset: 1 },
  labelAlign: "left",
  colon: false,
};
const tailLayout = {
  wrapperCol: { span: 24 },
  className: "align-center pt-20",
};

class ContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      inspection: 0,
      price: 0,
      sales: 0,
      property: 0,
      count: 1500,
      selectedNodes: [],
      fileList: null,
    };
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = () => {
    console.log("Hello >>");
    this.props.enableLoading();
    const { selectedNodes, fileList, userDetails } = this.props;
    let reqData = {
      user_id: userDetails.id,
      size_guide_image: fileList.originFileObj,
      size_guide_categories: JSON.stringify(selectedNodes),
    };

    const formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      formData.append(key, reqData[key]);
    });
    this.props.saveSizeGuide(formData, (res) => {
      this.props.disableLoading();
      if (res.status === STATUS_CODES.OK) {
        this.props.onCancel();
        toastr.success(langs.success, MESSAGES.ADD_SIZE_GUIDE);
        this.props.recallTrader();
      }
    });
  };

  /**
   * @method handleInspection
   * @description handle inspection
   */
  handleInspection = (e) => {
    this.setState({ inspection: e.target.checked });
  };

  /**
   * @method handleProperty
   * @description handle property
   */
  handleProperty = (e) => {
    this.setState({ property: e.target.checked });
  };

  /**
   * @method handleSale
   * @description handle sale
   */
  handleSale = (e) => {
    this.setState({ sales: e.target.checked });
  };

  /**
   * @method handlePrice
   * @description handle price
   */
  handlePrice = (e) => {
    this.setState({ price: e.target.checked });
  };

  /**
   * @method handleTextAreaChange
   * @description handle text area change
   */
  handleTextAreaChange = ({ target: { value } }) => {
    let count = "";
    if (value.length <= 1500) {
      count = 1500 - value.length;
    } else {
      count = 0;
    }
    this.setState({ message: value, count: count });
  };

  /**
   * @method dummyRequest
   * @description dummy request for images
   */
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
      visible,
      retailList,
      handleImageUpload,
      onSelectChange,
      fileList,
      selectedCat,
    } = this.props;
    let selectOptions = [];
    retailList.map((el) => {
      // let parentIndex = selectedCat.findIndex((i) => el.id === i.category.id)
      let parentCat = {
        label: el.text,
        value: el.id,
        pid: 0,
        // checked: parentIndex >= 0 ? true : false
      };
      let childCat = el.category_childs.map((c) => {
        // let childIndex = selectedCat.findIndex((i) => c.id === i.category.id)
        return {
          label: c.text,
          value: c.id,
          pid: c.pid,
          // checked: parentIndex >= 0 ? true : childIndex >= 0 ? true : false
        };
      });
      let expandIndex = childCat.findIndex((i) => i.checked === true);
      parentCat.expanded = expandIndex >= 0 ? true : false;
      parentCat.children = childCat;
      selectOptions.push(parentCat);
    });
    const fileProps = {
      name: "file",
      customRequest: this.dummyRequest,
      onChange: handleImageUpload,
      multiple: false,
    };
    return (
      <Modal
        title="+ Upload Size Guide"
        visible={visible}
        className={"custom-modal upload-size-guid-modal"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <Form {...layout} onFinish={this.onFinish}>
          <Row>
            <Col md={24} className="browse-file-btn">
              <Upload {...fileProps} multiple={false} showUploadList={false}>
                <Button icon={<UploadOutlined />}>
                  {fileList ? fileList.name : "BROWSE FILE FROM DEVICE"}
                </Button>
              </Upload>
            </Col>
            <Col md={24} className="pt-25 pb-20 text-center">
              <p className="mb-0 fs-18" style={{ fontFamily: "Poppins" }}>
                OR
              </p>
            </Col>
            <Col md={24} className="uploadDragBox">
              <Dragger {...fileProps} multiple={false} showUploadList={false}>
                {/* <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p> */}
                {fileList ? (
                  fileList.name
                ) : (
                  <p className="ant-upload-text">DRAG & DROP FILES HERE</p>
                )}
              </Dragger>
            </Col>
          </Row>
          <Container data={selectOptions} onChange={onSelectChange} />
          <Row className="Modalfooter">
            <Col md={12}>
              <Form.Item {...tailLayout}>
                <Button type="default" htmlType="submit" className="btn-blue">
                  Upload
                </Button>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item {...tailLayout}>
                <Button
                  type="default"
                  onClick={() => this.props.onCancel()}
                  htmlType="button"
                  className="cancel"
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, profile, common } = store;
  const { categoryData } = common;
  let retailList =
    categoryData && Array.isArray(categoryData.retail.data)
      ? categoryData.retail.data
      : [];
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    loggedInUser: auth.loggedInUser,
    retailList,
  };
};

export default connect(mapStateToProps, {
  contactAdSendMessageAPI,
  enableLoading,
  disableLoading,
  saveSizeGuide,
})(ContactModal);
