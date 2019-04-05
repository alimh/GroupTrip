import React from 'react';
// import {
//   Field,
//   Control,
//   Label,
//   Input,
//   Select,
//   Checkbox,
//   Help,
// } from 'react-bulma-components/lib/components/form';
// import Button from 'react-bulma-components/lib/components/button';

export const InputBox = props => (
  <div className="input-box-group">
    <label>{props.label}</label>
    <input
      className="input-box"
      id={props.id}
      type={props.inputType}
      value={props.value}
      onChange={e => props.onUpdate(e.target.value)}
      onBlur={e => props.onUpdate(e.target.value)}
      placeholder={props.placeholder}
      style={props.errMsg ? { border: '2px solid red' } : {}}
      disabled={props.disabled || false}
    />
    <div color="danger">{props.errMsg}</div>
  </div>
);

export const SelectBox = props => (
  <div>
    <label>{props.label}</label>
    <div>
      <select
        value={props.value.key}
        onChange={e =>
          props.onUpdate({
            value: e.target.namedItem(e.target.value).innerText,
            key: e.target.value,
          })
        }
        inputprops={{
          name: props.id,
          id: props.id,
        }}
      >
        <option key="0" value=" " name=" ">
          {props.placeholder}
        </option>
        {props.options.map(option => (
          <option key={option.key} value={option.key} name={option.key}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
    <div color="danger">{props.errMsg}</div>
  </div>
);

export const MultiSelect = props => (
  <div>
    <label>{props.label}</label>
    <div>
      {props.options.map((option, n) => (
        // options: {
        //  key: String
        //  value: String
        //  checked: Bool
        // }
        <CheckboxElement
          key={option.key}
          id={option.key}
          label={option.value}
          onUpdate={() => {
            const newOptions = props.options;
            newOptions[n].checked = !newOptions[n].checked;
            return props.onUpdate(newOptions);
          }}
          checked={option.checked}
          disabled={props.disabled}
        />
      ))}
    </div>
    <div color="danger">{props.errMsg}</div>
  </div>
);

export const CheckboxElement = props => (
  <div>
    <input
      className="check-box"
      name={props.id}
      onChange={() => props.onUpdate()}
      checked={props.checked}
      type="checkbox"
    />
    {props.label}
  </div>
);

export class FormBuilder extends React.Component {
  constructor(props) {
    super();

    const initialState = props.fields.reduce(
      (set, field) => {
        const noValidation = () => false;

        // set all the initial values for the multi-select
        // props.fields.forEach((field) => {
        //   if (field.type === 'multi-select') {
        //     // In order to pre-check the initial values:
        //     // 1. Create a key-value pair of all the options along with their index
        //     // 2. Loop through each of the initial values (the ones supposed to be checked)
        //     // 2a. if it is in the list, get the index and check it
        //     // 2b. if it is not in the list (old option that was removed), add to end?

        let initialValue = null;
        if (field.type === 'select-box') {
          initialValue = field.initialValue || { key: '', value: '' };
        } else if (field.type === 'multi-select') {
          const checked = field.initialValue || [];
          const kvp = checked.reduce((acc, element, n) => {
            acc[element.key] = n + 1; // to avoid 0 being counted as false
            return acc;
          }, {});
          initialValue = field.options.map((option) => {
            const check = kvp[option.key] > 0; // if the option exists int he checked kvp
            return { key: option.key, value: option.value, checked: check };
          });
        } else {
          initialValue = field.initialValue || '';
        }
        const values = { ...set.values, [field.id]: initialValue };

        const errors = { ...set.errors, [field.id]: false };
        const errorChecks = {
          ...set.errorChecks,
          [field.id]: field.errorChecks || noValidation,
        };

        return { values, errors, errorChecks };
      },
      { values: {}, errors: {}, errorChecks: {} }
    );

    const onCancel = props.onCancel || (() => this.resetForm());

    this.state = {
      ...initialState,
      initial: initialState,
      handleCancel: onCancel,
    };
  }

  resetForm() {
    this.setState({
      values: this.state.initial.values,
      errors: this.state.initial.errors,
    });
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
      this.resetForm();
    }
  }

  handleCancel(e) {
    e.preventDefault();

    this.state.handleCancel();
  }

  render() {
    const noFormatItem = (field, key) => <div key={key}>{field}</div>;
    const noFormatWrapper = fields => <div>{fields}</div>;
    const saveButton = text => (
      <button
        key="save-button"
        type="submit"
        variant="contained"
        color="primary"
      >
        {text}
      </button>
    );
    const cancelButton = text => (
      <button key="cancel-button" onClick={e => this.handleCancel(e)}>
        {text}
      </button>
    );

    const saveButtonText = this.props.saveButtonText || 'Save';
    const cancelButtonText = this.props.cancelButtonText || 'Cancel';
    const formatItem = this.props.formatItem || noFormatItem;
    const formatWrapper = this.props.formatWrapper || noFormatWrapper;
    //    const formatButtons = this.props.formatButtons || formatItem;

    const elements = this.props.fields.map((field) => {
      if (field.type === 'multi-select') {
        return formatItem(
          MultiSelect({
            id: field.id,
            label: field.label,
            options: this.state.values[field.id],
            onUpdate: options => this.handleUpdate(field.id, options),
            disabled: field.disabled,
            errMsg: this.state.errors[field.id],
          }),
          field.id
        );
      }
      if (field.type === 'select-box') {
        return formatItem(
          SelectBox({
            id: field.id,
            label: field.label,
            value: { key: this.state.values[field.id].key },
            onUpdate: selected => this.handleUpdate(field.id, selected),
            disabled: field.disabled,
            errMsg: this.state.errors[field.id],
            options: field.options || [],
            placeholder: field.placeholder,
          }),
          field.id
        );
      }
      return formatItem(
        InputBox({
          id: field.id,
          label: field.label,
          value: this.state.values[field.id],
          onUpdate: value => this.handleUpdate(field.id, value),
          placeholder: field.placeholder,
          disabled: field.disabled,
          errMsg: this.state.errors[field.id],
        }),
        field.id
      );
    });

    const buttons = [
      saveButton(saveButtonText),
      cancelButton(cancelButtonText),
    ];

    const elementsList = [elements, buttons];
    const combine = elementsList.map(e => e);

    return (
      <form onSubmit={e => this.handleSave(e)}>{formatWrapper(combine)}</form>
    );
  }
}
