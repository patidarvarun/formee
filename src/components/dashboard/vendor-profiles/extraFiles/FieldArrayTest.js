import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import validate from './validate'
import { connect, dispatch } from 'react-redux'
import { change } from 'redux-form';

import {
  renderText,
  renderNumberInputField,
  renderSelectField,
  renderTextAreaField,
  focusOnError,
  renderDatePicker
} from './FormInput';
import { Row, Col } from 'antd';
import moment from 'moment';
import { required } from './validations'
import TimeField from 'react-simple-timefield';
// import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import TimePickers from 'react-dropdown-timepicker';
// var TimePickers = require('basic-react-timepicker');
// const { RangePicker } = DatePicker;

// var TimePicker = require('basic-react-timepicker');

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  return (
    <div className={"form-group"}>
      <label>{label}</label>
      {}
      <div>
        <input {...input} type={type} placeholder={label} />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  )
}

const renderTimeField = ({ input, label, type, meta: { touched, error } }) => (
  <div className={"form-group"}>
    <label>{label}</label>
    <div>
      {/* <TimePickers
        {...input}
        defaultValue={'00:00'} 
      // displayFormat='12-hour'
      // />*/}
      <TimeField
        className='form-control'
        minuteStep={30}
        style={{ width: '100%' }}
        {...input}
      // value={time} 
      // onChange={this.onTimeChange} 
      />

      {touched && error && <span>{error}</span>}
    </div>
  </div>
)




const handleFormSubmit = (value) => {
  

}
const FieldArraysForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  const initialMember =
  {
    class_name: '',
    monday: [
      { start_time: "", end_time: "" }
    ],
    tuesday: [
      { start_time: "", end_time: "" }
    ],
    wednesday: [
      { start_time: "", end_time: "" }
    ],
    thursday: [
      { start_time: "", end_time: "" }
    ],
    friday: [
      { start_time: "", end_time: "" }
    ],
    saturday: [
      { start_time: "", end_time: "" }
    ],
    sunday: [
      { start_time: "", end_time: "" }
    ],
  }

  const renderHobbies = ({ fields, meta: { error }, text }) => (

    <ul>
      {fields.map((hobby, index) => (
        < li key={index} >
          <Row>
            <Col span={3}>
              {text}
            </Col>
            <Col span={3}>
              <Field
                className='col-md-4'
                name={`${hobby}.start_time`}
                // type="text"
                onChange={(e) => {
                  // this.props.fieldArrays['values']
                  
                  // this.props.change(`${hobby}.end_time`, "00:11");
                  // props.dispatch(change('fieldArrays', `${hobby}.end_time`, '00:11'));

                }}
                defaultValue={'00:00'}
                component={renderTimeField}
                label={`Start Time`}
              />
            </Col>
            <Col span={3}>
              <Field
                name={`${hobby}.end_time`}
                // type="text"
                component={renderTimeField}
                label={`End Time`}
              />
            </Col>
            <Col span={3}>
              <button
                type="button"
                onClick={() => fields.remove(index)}
              >Remove</button>
            </Col>
  
          </Row>
        </li>
      ))}
      <li>
        <button type="button" onClick={() => fields.push()}>
          Add Time
        </button>
      </li>
      { error && <li className="error">{error}</li>}
    </ul >
  )
  
  
  const renderMembers = ({ fields, meta: { error, submitFailed } }) => {
    const { fitnessPlan } = props;
    return (
      <ul>
        {fields.map((member, index) => (
          <li key={index}>
            <button
              type="button"
              title="Remove Member"
              onClick={() => fields.remove(index)}
            />
            <Row>
              <Col span={12}>
                <Field
                  name={`${member}.wellbeing_fitness_type_id`}
                  label="Select Categories"
                  required={true}
                  // options={[{ label: "USA", value: "USA" }]}
                  options={fitnessPlan}
                  component={renderSelectField}
                  placeholder="Select Categories"
                  optionValue={"id"}
                  optionLabel={"name"}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>

                <Field
                  name={`${member}.class_name`}
                  type="text"
                  // validate={[required]}
                  component={renderText}
                  label="Class Name"
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>

                <Field
                  name={`${member}.instructor_name`}
                  type="text"
                  component={renderText}
                  label="Instructor Name"
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Field
                  name={`${member}.description`}
                  type="text"
                  component={renderTextAreaField}
                  label="Details"
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Field
                  name={`${member}.room`}
                  type="number"
                  component={renderText}
                  label="Room"
                />
              </Col>
              <Col span={6}>
                <Field
                  name={`${member}.capacity`}
                  type="number"
                  component={renderText}
                  label="Capacity"
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Field
                  name={`${member}.price`}
                  type="number"
                  component={renderText}
                  label="Price AUD"
                />
              </Col>
              <Col span={6}>
                <Field
                  name={`${member}.time`}
                  type="number"
                  component={renderTimeField}
                  label="time"
                />
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Field
                  name={`${member}.available_from`}
                  // type="number"
                  component={renderDatePicker}
                  label="Duration"
                />
              </Col>
              <Col span={6}>
                <Field
                  name={`${member}.available_to`}
                  // type="number"
                  component={renderDatePicker}
                  label=""
                />
              </Col>
            </Row>
            <FieldArray text={'Monday'} name={`${member}.monday`} component={renderHobbies} />
            <FieldArray text={'Tuesday'} name={`${member}.tuesday`} component={renderHobbies} />
            <FieldArray text={'Wednesday'} name={`${member}.wednesday`} component={renderHobbies} />
            <FieldArray text={'Thursday'} name={`${member}.thursday`} component={renderHobbies} />
            <FieldArray text={'Friday'} name={`${member}.friday`} component={renderHobbies} />
            <FieldArray text={'Saturday'} name={`${member}.saturday`} component={renderHobbies} />
            <FieldArray text={'Sunday'} name={`${member}.sunday`} component={renderHobbies} />

          </li>

        ))}


        <li>
          <button type="button" onClick={() => fields.push(initialMember)}>
            Add
      </button>
          {submitFailed && error && <span>{error}</span>}
        </li>
      </ul>
    )
  }


  return (
    <form
      // ref={this.formRef}
      onSubmit={handleSubmit(handleFormSubmit.bind(this))}
    >
      <FieldArray name="members" component={renderMembers} />
      <div>
        <button type="submit" disabled={submitting}>
          Submit
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'fieldArrays', // a unique identifier for this form
  validate,
  // focusOnError,
  onSubmitFail: (errors) => {
    focusOnError(errors);
  },
  change: reduxForm.change,
  dispatch:reduxForm.dispatch,
  initialValues: {
    members: [{
      class_name: '',
      monday: [
        {
          start_time: "", end_time: ""
        }
      ],
      tuesday: [
        { start_time: "", end_time: "" }
      ],
      wednesday: [
        { start_time: "", end_time: "" }
      ],
      thursday: [
        { start_time: "", end_time: "" }
      ],
      friday: [
        { start_time: "", end_time: "" }
      ],
      saturday: [
        { start_time: "", end_time: "" }
      ],
      sunday: [
        { start_time: "", end_time: "" }
      ],
    }]
  }

})(FieldArraysForm)