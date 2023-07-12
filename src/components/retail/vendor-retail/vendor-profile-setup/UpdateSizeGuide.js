import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import {
    Form,
    Row,
    Col,
    Button,
    Modal
} from 'antd';
import { enableLoading, disableLoading, contactAdSendMessageAPI, saveSizeGuide } from '../../../../actions'
import Container from './DropdownContainer';
import 'react-dropdown-tree-select/dist/styles.css'
import { STATUS_CODES } from '../../../../config/StatusCode';
import { MESSAGES } from '../../../../config/Message';
import { langs } from '../../../../config/localization';
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13, offset: 1 },
    labelAlign: 'left',
    colon: false,
};
const tailLayout = {
    wrapperCol: { span: 24 },
    className: 'align-center pt-20'
};

class UpdateSizeGuide extends React.Component {
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
            fileList: null
        };
    }

    /**
      * @method onFinish
      * @description handle on submit
      */
    onFinish = (values) => {
        this.props.enableLoading()
        const { selectedNodes, fileList, userDetails, editableGuide } = this.props;
        let reqData = {
            user_id: userDetails.id,
            size_guide_id: editableGuide.id,
            // size_guide_image: fileList.originFileObj,
            size_guide_categories: JSON.stringify(editableGuide.applicableTo)
        }

        const formData = new FormData();
        Object.keys(reqData).forEach((key) => {
            formData.append(key, reqData[key]);
        });
        this.props.saveSizeGuide(formData, (res) => {
            this.props.disableLoading()
            if (res.status === STATUS_CODES.OK) {
                this.props.onCancel()
                toastr.success(langs.success, MESSAGES.ADD_SIZE_GUIDE);
                this.props.recallTrader()
            }
        })
    }




    /**
     * @method render
     * @description render component
     */
    render() {
        const { visible, retailList, onSelectChange, selectedCat, editableGuide } = this.props;
        let selectOptions = []
        retailList.map((el) => {
            let parentIndex = editableGuide.applicableTo.findIndex((i) => el.id === i.category.id)
            let parentCat = {
                label: el.text,
                value: el.id,
                pid: 0,
                checked: parentIndex >= 0 ? true : false
            }
            let childCat = el.category_childs.map((c) => {
                let childIndex = editableGuide.applicableTo.findIndex((i) => c.id === i.category.id)
                return {
                    label: c.text,
                    value: c.id,
                    pid: c.pid,
                    checked: parentIndex >= 0 ? true : childIndex >= 0 ? true : false
                }
            })
            let expandIndex = childCat.findIndex((i) => i.checked === true)
            parentCat.expanded = expandIndex >= 0 ? true : false
            parentCat.children = childCat
            selectOptions.push(parentCat)
        })

        return (
            <Modal
                title='Edit Size Guide'
                visible={visible}
                className={'custom-modal style1 custom-modal-contactmodal-style'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <div className='padding'>
                    <Form
                        {...layout}
                        onFinish={this.onFinish}                   >
                        <Container data={selectOptions} onChange={onSelectChange} />
                        <Row className='mb-35'>
                            <Col md={11}>
                                <Form.Item {...tailLayout}>
                                    <Button type='default' onClick={() => this.props.onCancel()} htmlType='button'>
                                        Cancel
                        </Button>
                                </Form.Item>
                            </Col>
                            <Col md={11}>
                                <Form.Item {...tailLayout}>
                                    <Button type='default'  htmlType='submit'>
                                        Save
                        </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth, profile, common } = store;
    const { categoryData } = common;
    let retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
    return {
        loggedInDetail: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {},
        retailList
    };
};

export default connect(mapStateToProps, { contactAdSendMessageAPI, enableLoading, disableLoading, saveSizeGuide })(UpdateSizeGuide);
