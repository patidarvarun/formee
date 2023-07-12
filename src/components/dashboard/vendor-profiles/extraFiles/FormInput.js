import React from "react";
// import Select from "react-select";
// import "./FormInput.scss";
// import { TextField } from "@material-ui/core"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { convertISOToUtcDateformate3 } from "../../common"


/*
@method: renderMultiSelectField
@desc: Render multi select input
*/
export function renderMultiSelectField(field) {
  const {
    isTouched,
    meta: { touched, error, active }
  } = field;
  const inputbox = `inputbox ${active ? "active" : ""}`;
  const className = `form-group ${touched && error ? "has-danger" : ""}`;
  const InputClassName = `basic-multi-select ${field.className ? field.className : ""
    }`;
  const optionValue = field.optionValue;
  const optionLabel = field.optionLabel;
  const placeholder = field.placeholder ? field.placeholder : "";
  return (
    <div className={className}>
      <label>
        {field.label}
        {field.mendatory && field.mendatory === true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}
      </label>
      <div className={inputbox} onClick={field.onTouched}>
        {/* <Select
          className={InputClassName}
          getOptionLabel={optionLabel}
          getOptionValue={optionValue}
          value={field.selection}
          isMulti
          //  isDisabled={field.options}
          options={field.options}
          classNamePrefix="select"
          closeMenuOnSelect="false"
          onChange={field.selectionChanged}
          placeholder={placeholder}
        /> */}
      </div>
      <div className="text-help">
        {isTouched &&
          field.mendatory &&
          field.selection &&
          field.selection.length === 0
          ? "This field is required."
          : ""}
        {/* <div className="text-help">{field.isEmpty ? 'This field is required.' : ""}</div> */}
      </div>
    </div>
  );
}

/*
@method: renderTextInputField
@desc: Render text input
*/
export function renderTextInputField(field) {
  const {
    input,
    meta: { touched, error, active },
    ...others
  } = field;
  const inputbox = `inputbox ${active ? "active" : ""}`;
  const className = `form-group ${touched && error ? "has-danger" : ""}`;
  const inputStyle = field.inputStyle ? field.inputStyle : "";
  const inputIconStyle = field.inputIconStyle ? field.inputIconStyle : "";
  const InputClassName = `form-control ${field.className ? field.className : ""
    }`;
  return (
    <div className={`${className} ${inputStyle}`}>
      <label>
        {field.label}
        {field.value}
        {field.required && field.required === true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}
      </label>
      <div className={inputbox}>
        <input
          maxLength={field.maxLength}
          {...others}
          type="text"
          className={`form-control ${InputClassName}`}
          {...input}
        />
        {field.iconName && (
          <div className="input-group-prepend">
            <span className={`input-group-text ${inputIconStyle}`}>
              <i className={`fas fa-${field.iconName}`} />
            </span>
          </div>
        )}
      </div>
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );
}



/*
@method: renderSelectField
@desc: Render select input
*/
export function renderSelectField(field) {
  const {
    disabled,
    input,
    meta: { touched, error, active },
    required,
  } = field;
  const inputbox = `inputbox ${active ? "active" : ""}`;
  const className = `form-group ${touched && error ? "has-danger" : ""}`;
  const InputClassName = `form-control ${field.className ? field.className : ""
    }`;
  let optionKey = field.optionValue;
  let optionText = field.optionLabel;
  const disabledSelect = disabled ? true : false;
  return (
    <div className={className}>
      <label>
        {field.label}
        {required && required === true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}
      </label>
      <div className={inputbox}>
        <select
          disabled={disabledSelect}
          className={InputClassName}
          isMulti={true}
          value={field.Value}
          {...field.input}
        >
          {field.isSelect === false && !field.copiesDistributed && <option value="">Select</option>}
          {field.copiesDistributed && <option value="">How many copies distributed</option>}
          {field.flag && <option value="">{field.custumText}</option>}
          {field.options.map(data => {
            return (
              <option key={data[optionKey]} value={data[optionKey]}>
                {data[optionText]}
              </option>
            );
          })}
        </select>
      </div>
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );
}

/*
@method: renderNumberInputField
@desc: Render number input
*/
export function renderDateInputField(field) {
  const {
    input,
    style,
    placeholder,
    meta: { touched, error },
    ...others
  } = field;
  const InputClassName = `form-control ${field.className ? field.className : ""
    }`;
  delete input.value
  return (
    <div className={"form-group"}>
      <label>
        {field.label}
        {field.required && field.required === true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}
      </label>
      <input
        {...others}
        style={style}
        //type={field.type}
        className={InputClassName}
        maxLength={field.maxLength}
        value={field.Value}
        onChange={field.input.onChange}
        placeholder={placeholder}
        {...input}
      />
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );
}

/*
@method: renderNumberInputField
@desc: Render number input
*/
export function renderNumberInputField(field) {
  const {
    input,
    style,
    placeholder,
    meta: { touched, error },
    ...others
  } = field;
  const InputClassName = `form-control ${field.className ? field.className : ""
    }`;
  delete input.value
  return (
    <div className={"form-group"}>
      <label>
        {field.label}
        {field.required && field.required === true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}
      </label>
      <input
        {...others}
        style={style}
        //type={field.type}
        className={InputClassName}
        maxLength={field.maxLength}
        value={field.Value}
        onChange={field.input.onChange}
        placeholder={placeholder}
        {...input}
      />
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );
}

/*
@method: renderTextAreaField
@desc: Render textarea input
*/
export function renderTextAreaField(field) {
  const {
    input,
    meta: { touched, error }
  } = field;
  const className = `form-group inputbox ${touched && error ? "has-danger" : ""
    }`;
  const InputClassName = `form-control ${field.className ? field.className : ""
    }`;

  const placeholder = field.placeholder ? field.placeholder : "";
  return (
    <div className={"form-group"}>
      <label>
        {field.label}
        {field.required && field.required === true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}
      </label>
      <div className="inputbox ">
        <textarea
          maxLength={field.maxLength}
          value={field.value}
          className="form-control withoutBorder"
          {...input}
          placeholder={placeholder}
        />
      </div>
      {field.isVisible &&
        <div className="text-help">
          {touched && field.input.value === '' ? 'This field is required' : ''}
        </div>}
    </div>
  );
}

/*
@method: focusOnError
@desc: focus on the error input
*/
export const focusOnError = errors => {
  if (typeof errors !== "undefined" && errors !== null) {
    const errorEl = document.querySelector(
      Object.keys(errors)
        .map(fieldName => {
          return `[name="${fieldName}"]`;
        })
        .join(",")
    );

    if (errorEl && errorEl.focus) {
      errorEl.focus();
    }
  }
};

/*******************************
 Updated components
 ********************************/

export function renderText(field) {
  
  const {
    input,
    meta: { touched, error },
    required,
    ...others
  } = field;
  
  
  const InputClassName = `form-control  ${field.className ? field.className : ""
    }`;
  return (
    <div className={"form-group"}>
      <label >
        {field.label}
        {field.value}
        {required && required == true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}{" "}
      </label>
      <input
        maxLength={field.maxLength}
        {...input}
        {...others}
        //value={field.Value}
        className={InputClassName}
      />

      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );
}

export function renderNumberField(field) {
  const {
    input,
    meta: { touched, error },
    required,
    helpText = "",
    ...others
  } = field;
  const InputClassName = `form-control ${field.className ? field.className : ""
    }`;
  return (
    <div className={"form-group"}>
      <label>
        {field.label}
        {field.value}
        {required && required == true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}{" "}
      </label>
      <input
        type="number"
        maxLength="5"
        {...input}
        {...others}
        className={InputClassName}
      />
      <small style={{ fontSize: 8 }} className="form-text text-muted">{helpText}</small>
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );
}
export function renderDatePicker(field) {
  const {
    input,
    placeholder,
    defaultValue,
    value,
    meta: { touched, error }
  } = field;
  const InputClassName = `form-control ${field.className ? field.className : ""
    }`;

  return (
    <div className='form-group' >
      <label>
        {field.label}
        {field.required && field.required == true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}{" "}
      </label><br></br>
      <DatePicker
        selected={input.value ? new Date(input.value) : null}
        minDate={field.minDate !== undefined ? field.minDate : null}
        placeholderText="Select Date"
        {...input}
        autoComplete={'off'}
        disabled={field.disabled}
        className={InputClassName}
        onChange={field.input.onChange}

        onChangeRaw={e => e.preventDefault()}
      />
      {touched ? <div className="text-help mb-2">{error}</div> : ""}
    </div>
  );
}

export function renderTimeField(field) {
  const {
    input,
    meta: { touched, error },
    required,
    ...others
  } = field;
  const InputClassName = `form-control  ${field.className ? field.className : ""
    }`;
  return (
    <div className={"form-group"}>
      <label >
        {field.label}
        {field.value}
        {required && required == true ? (
          <span className="asterisk-required">*</span>
        ) : (
            ""
          )}{" "}
      </label>
      <input
        maxLength={field.maxLength}
        {...input}
        {...others}
        //value={field.Value}
        className={InputClassName}
      />

      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );
}
