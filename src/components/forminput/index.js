import React from 'react'
import { renderText, renderPasswordInput, renderDatePicker, renderNumberInput, renderTextArea, renderRadio, renderCheckBox, renderMultiSelect, renderFileInput, renderTimePicker, renderEmail, renderUrl, renderColor, renderRangePicker, renderYearPicker } from './FormInput'
import SelectInput from './Select'
import MultiSelect from './MultiSelect'
import NumberInput from './NumberInput'

// render input fields
export const renderField = (data, type, attr_AllValues, noValidate = false, isLabelShow=true, currentField, isClaerAll) => {
   // console.log('currentField',currentField)
    switch (type) {
        case 'text':
            return <div> {renderText(data, noValidate,isLabelShow)}</div>
        case 'Email':
            return <div> {renderEmail(data, noValidate,isLabelShow)}</div>
        case 'password':
            return <div>{renderPasswordInput(data, noValidate,isLabelShow)}</div>
        case 'Date':
            return <div>{renderDatePicker(data, noValidate,isLabelShow)}</div>
        case 'calendar':
            return <div>{renderYearPicker(data, noValidate,isLabelShow)}</div>
        case 'Numeric':
            // return <div>{renderNumberInput(data, noValidate)}</div>
            return (
                <div>
                    <NumberInput data={data} attr_AllValues={attr_AllValues} noValidate={noValidate} isLabelShow={isLabelShow}/>
                </div>
            )
        case 'textarea':
            return <div>{renderTextArea(data, noValidate,isLabelShow)}</div>
        case 'Radio-button':
            return <div>{renderRadio(data, noValidate,isLabelShow)}</div>
        case 'checkbox':
            return <div>{renderCheckBox(data, noValidate,isLabelShow)}</div>
        case 'Drop-Down':
            return (
                <div>
                    <SelectInput isClaerAll={isClaerAll} currentField={currentField} data={data} attr_AllValues={attr_AllValues} noValidate={noValidate} isLabelShow={isLabelShow} />
                </div>
            )
        case 'Multi-Select':
            return <div>
                    <MultiSelect currentField={currentField} data={data}  attr_AllValues={attr_AllValues} noValidate={noValidate} isLabelShow={isLabelShow}/>
                </div>
        case 'file':
            return <div>{renderFileInput(data,isLabelShow)}</div>
        case 'Video':
            return <div>{renderFileInput(data,isLabelShow)}</div>
        case 'Time':
            return <div>{renderTimePicker(data, noValidate,isLabelShow)}</div>
        case 'Url':
            return <div>{renderUrl(data,isLabelShow)}</div>
        case 'Color':
            return <div>{renderColor(data,isLabelShow)}</div>
        case 'Range':
            return <div>{renderRangePicker(data,isLabelShow)}</div>
        default:
            return ''
    }
}