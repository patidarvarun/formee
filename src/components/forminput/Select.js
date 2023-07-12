import React from 'react';
import {Row, Col, Form, Select } from 'antd';
import { connect } from 'react-redux';
import { getChildInput } from '../../actions/classifieds/PostAd'
import { required, } from '../../config/FormValidation'
const { Option } = Select;
let attr_id = undefined;
let flag = false


class SelectInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitFromOutside: false,
            current: 0,
            subCategory: [],
            isVisible: false,
            isFloated: false
        };
    }

    getAlert() {
        alert('getAlert from Child');
    }

    /**
     * @method renderItem
     * @descriptionhandle render item
     */
    renderItem = (attr_AllValues, data) => {
        let value = {}
        if (attr_AllValues && Array.isArray(attr_AllValues)) {
            if (data.have_children) {
                attr_id = data.att_id
                flag = data.have_children
            }
            return attr_AllValues.length !== 0 && attr_AllValues.map((keyName, i) => {
                value.child_data = keyName
                value.parent_data = data;
                return (
                    <Option
                        key={i}
                        value={keyName.id}                   
                    >{keyName.name}</Option>
                )
            })
        } else {
            if(attr_AllValues){
                return  Object.keys(attr_AllValues).map((keyName, i) => {
                    return (
                        <Option key={i} value={keyName.id}>{keyName.name}</Option>
                    )
                })
            }
            
        }
    }

    /**
     * @method onChange
     * @descriptionhandle handle item change
     */
    onChange = (value) => {
        const { currentField } = this.props;
        let temp = currentField && currentField.getFieldsValue()
        this.setState({isFloated:true})
        console.log('ref',temp)
        if (flag) {
            const requestData = {
                attributeValueid: value,
                attribute_id: attr_id
            }
            this.props.getChildInput(requestData, res => {
                if (res.status === 200) {
                    const childData = res.data.data && Array.isArray(res.data.data.value) ? res.data.data.value : []
                    this.setState({ subCategory: childData, data2: res.data.data, isVisible: true })
                }
            })
        }
    }

    /**
     * @method renderSubCategory
     * @descriptionhandle render subcategory
     */
    renderSubCategory = (attr_AllValues) => {
        if (attr_AllValues && Array.isArray(attr_AllValues)) {
            return attr_AllValues.length !== 0 && attr_AllValues.map((keyName, i) => {
                return (
                    <Option key={i} value={keyName.id}>{keyName.name}</Option>
                )
            })
        } else {
            return attr_AllValues.length !== 0 && Object.keys(attr_AllValues).map((keyName, i) => {
                return (
                    <Option key={i} value={keyName.id}>{keyName.name}</Option>
                )
            })
        }
    }

    renderSelect = (noValidate,isLabelShow,data,attr_AllValues,value) => {
        return (
            <div className={!isLabelShow && value[data.att_name] ? "floating-label" : ''}>
                <Form.Item
                    label={data.att_name}
                    name={data.att_name}
                    rules={!noValidate && data.validation === 1 && [required('')]}
                    className="w-100"
                >
                    <Select
                        placeholder={!isLabelShow ?  data.att_name : 'Please Choose' }
                        onChange={this.onChange}
                        allowClear
                    >
                        {this.renderItem(attr_AllValues, data)}
                    </Select>
                </Form.Item>
            </div>
        )
    }

    renderChild = (noValidate,isLabelShow, data, data2, subCategory) => {
        return (
            <div className={!isLabelShow ? "floating-label" : ''}>
                <Form.Item
                    // label={isLabelShow && data2.att_name}
                    label={data2 ? data2.att_name : 'Model'}
                    name={data2 ? data2.att_name : 'Model'}
                    rules={!noValidate && data.validation === 1 && [required('')]}
                >
                    <Select
                        placeholder={!isLabelShow ?  data2.att_name : 'Please Choose'}
                        allowClear
                    >
                        {this.renderSubCategory(subCategory)}
                    </Select>
                </Form.Item>
            </div>
        )
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { data, attr_AllValues, noValidate,isLabelShow,currentField } = this.props;
        const {isFloated, isVisible, subCategory, data2 } = this.state
        let value = currentField && currentField.getFieldsValue()
        return (
            <>
            {data.have_children ? <Row gutter={12}>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {this.renderSelect(noValidate,isLabelShow, data, attr_AllValues, value)}
                </Col>
                {data.have_children  && 
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {this.renderChild(noValidate,isLabelShow, data,data2,subCategory)}
                </Col>}
            </Row> :  this.renderSelect(noValidate,isLabelShow, data,attr_AllValues,value)}
            </>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
    };
};
export default connect(
    mapStateToProps,
    { getChildInput }
)(SelectInput);