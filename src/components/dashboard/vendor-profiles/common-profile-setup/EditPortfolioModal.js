
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import { Button, Modal, Divider, Row, Input, Form, Col } from 'antd';
import { enableLoading, disableLoading, updatePortfolio, portfolioUpload, viewPortfolio } from '../../../../actions'
import Dropzone from 'react-dropzone';
import { CloseOutlined } from '@ant-design/icons';
import { MESSAGES } from '../../../../config/Message'
import { langs } from '../../../../config/localization';

class EditPortfolio extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            bookingResponse: '',
            fileList: [],
            newlyUpload: []

        }
    }

    /**
     * @method componentDidMount
     * @description called after render the component
     */
    componentDidMount() {
        if (this.props.selectedPortfolio) {
            let uploadedFiles = []
            Array.isArray(this.props.selectedPortfolio.folder_files.files.image) && this.props.selectedPortfolio.folder_files.files.image.map((el, i) => {
                uploadedFiles.push({ id: i, preview: el.path })
            })
            this.setState({ fileList: uploadedFiles })
        }
    }
    /**
      * @method componentWillReceiveProps
      * @description receive props
      */
    componentWillReceiveProps(nextprops, prevProps) {
        let idInitial = this.props.selectedPortfolio.id
        let idNext = nextprops.selectedPortfolio.id
        if (idInitial !== idNext) {
            let uploadedFiles = []
            Array.isArray(this.props.selectedPortfolio.folder_files.files.image) && nextprops.selectedPortfolio.folder_files.files.image.map((el, i) => {
                uploadedFiles.push({ id: i, preview: el.path })
            })
            this.setState({ fileList: uploadedFiles })
        }
    }

    /**
    * @method onFinish
    * @description called to submit form 
    */
    onFinish = (values) => {
        const { newlyUpload } = this.state;
        values.id = this.props.selectedPortfolio.id
        this.props.enableLoading()
        this.props.updatePortfolio(values, res => {
            if (res.status === 200) {
                if (newlyUpload.length) {
                    let reqData = {
                        parent_id: values.id,
                        file: this.state.newlyUpload
                    }
                    const formData = new FormData()
                    for (var i = 0; i < reqData.file.length; i++) {
                        formData.append('file[]', reqData.file[i]);
                    }
                    Object.keys(reqData).forEach((key) => {
                        if (key !== 'file') {
                            formData.append(key, reqData[key])
                        }
                    })

                    this.props.portfolioUpload(formData, (res) => {
                        this.props.disableLoading()
                        if (res.status === 200) {
                            this.props.onCancel()
                            this.props.viewPortfolio()
                            toastr.success(langs.success, MESSAGES.PORTFOLIO_UPDATE_SUCCESS)
                        }
                    })
                } else {
                    this.props.viewPortfolio()
                    this.props.disableLoading()
                    toastr.success(langs.success, MESSAGES.PORTFOLIO_UPDATE_SUCCESS)
                }

            }
        })
    }

    render() {
        const { fileList, newlyUpload } = this.state;
        const { visibleEditModal, onCancel, handleOk, selectedPortfolio } = this.props

        return (
            <Modal
                className="edit-uploadpopup"
                visible={visibleEditModal}
                onOk={handleOk}
                onCancel={onCancel}
                width={800}
                footer={false}
                destroyOnClose={true}
            >
                <Form
                    layout="vertical"
                    onFinish={this.onFinish}
                    initialValues={{ folder_name: selectedPortfolio.folder_name ? selectedPortfolio.folder_name : '', title: selectedPortfolio.title ? selectedPortfolio.title : '' }}
                    ref={this.formRef} >
                    <Row gutter={[15]}>
                        <Col md={4}>
                            <img src={selectedPortfolio.path} />
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


                    <Divider />
                    <div className="uploader-list-block">
                        <Row>
                            <Col md={24}>
                                <div className="upload-section-popup">
                                    {fileList.length < 8 && <Dropzone
                                        customValidator={(file) => {
                                            console.log('file: vali %%% ', file);
                                        }}
                                        onDrop={(files) => {
                                            let file = files[0];
                                            console.log('file: %%% ', file);

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

                                            this.setState({ fileList: [...fileList, files[0]], newlyUpload: [...newlyUpload, file] })
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
                                        )}
                                    </Dropzone>}
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
                        <Row>
                            <Col>
                                <Button htmlType='submit'>Update</Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, profile } = store;

    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
        traderDetails: profile.traderProfile !== null ? profile.traderProfile : null

    };
};
export default connect(
    mapStateToProps,
    { enableLoading, disableLoading, updatePortfolio, portfolioUpload, viewPortfolio }
)(EditPortfolio);