import React from 'react';

export const InputBox = props => (
  <div className="input-box-group">
    <label className="input-box-label" htmlFor={props.id}>{props.name}</label>
    <input
      className="input-box"
      id={props.name}
      type={props.inputType}
      value={props.value}
      onChange={e => props.onUpdate(e.target.value)}
      onBlur={e => props.onUpdate(e.target.value)}
      placeholder={props.placeholder}
      style={props.errMsg ? { border: '2px solid red' } : {}}
      disabled={props.disabled || false}
    />
    <span>{props.errMsg}</span>
  </div>
);

export const SelectBox = props => (
  <div className="select-box-group">
    <label className="select-box-label" htmlFor={props.id}>{props.name}</label>
    <select
      className="select-box"
      id={props.id}
      value={props.selected.key}
      onChange={e => (
          props.onUpdate({
            value: e.target.namedItem(e.target.value).innerText,
            key: e.target.value,
          })
        )}
      style={props.errMsg ? { border: '2px solid red' } : {}}
      disabled={props.disabled || false}
    >
      <option value="">{props.placeholder}</option>
      {props.options.map(option => (
        <option key={option.key} value={option.key} name={option.key}>{option.value}</option>
      ))}
    </select>
    <span>{props.errMsg}</span>
  </div>
);

export const MultiSelect = props => (
  <div className="multi-select-group">
    <label className="multi-select-label" htmlFor={props.id}>{props.name}</label>
    {props.options.map((option, n) => (
            // options: {
            //  name: String
            //  checked: Bool
            // }
      <Checkbox
        key={option.key || option.value}
        name={option.value}
        title={option.value}
        onUpdate={(checked) => {
            const newOptions = props.options;
            newOptions[n].checked = checked;
            return props.onUpdate(newOptions);
        }}
        checked={option.checked}
        disabled={props.disabled}
      />
    ))}
    <span>{props.errMsg}</span>
  </div>
);

export const Checkbox = props => (
  <div className="checkbox-group">
    <input
      className="check-box"
      name={props.name}
      onChange={e => props.onUpdate(e.target.checked)}
      checked={props.checked}
      type="checkbox"
    />{props.title}
  </div>
);

export class FormBuilder extends React.Component {
  constructor(props) {
    super();

    const initialState = props.fields.reduce((set, field) => {
      const noValidation = () => false;
      const values = { ...set.values, [field.id]: field.initialValue || '' };
      const errors = { ...set.errors, [field.id]: false };
      const errorChecks = { ...set.errorChecks, [field.id]: field.errorChecks || noValidation };
      return { values, errors, errorChecks };
    }, { values: { }, errors: { }, errorChecks: { } });

    this.state = initialState;
  }

  handleUpdate(field, value) {
    const errors = {
      ...this.state.errors,
      [field]: this.state.errorChecks[field](value),
    };
    const values = {
      ...this.state.values,
      [field]: value,
    };
    this.setState({ values, errors });
  }

  handleSave(e) {
    e.preventDefault();
    const { errors } = this.state;

    // loop through error checks and make sure they are all false
    const error = Object.keys(this.state.errorChecks).reduce((acc, field) => {
      errors[field] = this.state.errorChecks[field](this.state.values[field]);
      return acc || errors[field] !== false;
    }, false);

    if (error) this.setState({ errors });
    else {
      this.props.onSave(this.state.values);
    //   const blankValues = Object.keys(this.state.values).reduce((acc, field) => (
    //     { ...acc.values, [field]: '' }
    //   ), { });
    }
  }

  handleCancel(e) {
    e.preventDefault();

    this.props.onCancel();
  }

  render() {
    const noFormat = (field, key) => <div key={key}>{field}</div>;
    const saveButton = text => <button onClick={e => this.handleSave(e)}>{text}</button>;
    const cancelButton = text => <button onClick={e => this.handleCancel(e)}>{text}</button>;

    const saveButtonText = this.props.saveButtonText || 'Save';
    const cancelButtonText = this.props.cancelButtonText || 'Cancel';
    const format = this.props.format || noFormat;

    const elements = this.props.fields.map((field) => {
      if (field.type === 'multi-select') {
        return format(
          MultiSelect({
            id: field.id,
            name: field.name,
            options: field.options || [],
            onUpdate: options => this.handleUpdate(field.id, options),
            disabled: field.disabled,
            errMsg: this.state.errors[field.id],
          }),
          field.id,
        );
      }
      if (field.type === 'select-box') {
        return format(
          SelectBox({
            id: field.id,
            name: field.name,
            selected: this.state.values[field.id],
            onUpdate: value => this.handleUpdate(field.id, value),
            disabled: field.disabled,
            errMsg: this.state.errors[field.id],
            options: field.options || [],
            placeholder: field.placeholder,
          }),
          field.id,
        );
      }
      return format(
        InputBox({
          id: field.id,
          name: field.name,
          value: this.state.values[field.id],
          onUpdate: value => this.handleUpdate(field.id, value),
          placeholder: field.placeholder,
          disabled: field.disabled,
          errMsg: this.state.errors[field.id],
        }),
        field.id,
      );
    });

    return (
      <div>
        {elements}
        {saveButton(saveButtonText)}
        {cancelButton(cancelButtonText)}
      </div>
    );
  }
}
