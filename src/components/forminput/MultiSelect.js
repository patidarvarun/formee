import React, { useState } from "react";
import { Form,Select } from 'antd';
import { required } from '../../config/FormValidation'
const { Option } = Select;

const MultiSelect = props => {
    let {data, noValidate, attr_AllValues, isLabelShow,currentField} = props
    const [isFloated, setFloated] = useState(false);
    console.log('currentField',currentField)
    let temp = '', temp2 = ''
    const handleChange = (value) =>  {
        console.log('value',value)
        if(value && value.length){
            setFloated(true)
        }else {
            setFloated(false)
        }
    }
    const renderItem = () => {

        if (attr_AllValues && Array.isArray(attr_AllValues)) {

            return attr_AllValues.length !== 0 && attr_AllValues.map((keyName, i) => {
                return (
                    <Option key={i} value={keyName.name}>{keyName.name}</Option>
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

    return (
        <div className={!isLabelShow && (isFloated) ? "floating-label" : ''}>
            <Form.Item
                label={data.att_name}
                name={data.att_name}
                rules={!noValidate && data.validation === 1 && [required('')]}
                placeholder={!isLabelShow ? data.att_name : 'Select'}
            >
                <Select
                    mode='multiple'
                    style={{ width: '100%' }}
                    placeholder={!isLabelShow ? data.att_name : 'Select'}
                    // onChange={handleChange}
                    onChange={handleChange}
                    optionLabelProp='label'
                    showArrow={true}
                    onClear={() =>  setFloated(false)}
                >
                    {renderItem()}
                </Select>
            </Form.Item>
        </div>
    )
}

export default MultiSelect
