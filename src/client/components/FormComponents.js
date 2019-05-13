import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export const InputBox = props => (
  <Form.Group controlId={props.id}>
    <Form.Label>
      {props.formatLabel ? props.formatLabel(props.label) : props.label}
    </Form.Label>
    <InputGroup>
      {props.prepend ? (
        <InputGroup.Prepend>
          <InputGroup.Text>{props.prepend}</InputGroup.Text>
        </InputGroup.Prepend>
      ) : (
        <div />
      )}
      <Form.Control
        className="input-box"
        type={props.inputType}
        value={props.value}
        onChange={e => props.onUpdate(e.target.value)}
        onBlur={e => props.onUpdate(e.target.value)}
        placeholder={props.placeholder}
        style={props.errMsg ? { border: '2px solid red' } : {}}
        disabled={props.disabled || false}
      />
      {props.append ? (
        <InputGroup.Append>
          <InputGroup.Text>{props.append}</InputGroup.Text>
        </InputGroup.Append>
      ) : (
        <div />
      )}
      {props.appendButton ? (
        <InputGroup.Append>{props.appendButton}</InputGroup.Append>
      ) : (
        <div />
      )}
      <Form.Control.Feedback type="invalid">
        {props.errMsg}
      </Form.Control.Feedback>
    </InputGroup>
  </Form.Group>
);

export const SelectBox = props => (
  <Form.Group>
    <Form.Label>{props.label}</Form.Label>
    <Form.Control
      as="select"
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
    </Form.Control>
    <Form.Control.Feedback type="invalid">{props.errMsg}</Form.Control.Feedback>
  </Form.Group>
);

export const MultiSelect = props => (
  <div>
    <div>{props.label}</div>
    <div>
      {props.options.map((option, n) => (
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
    <Form.Check
      className="check-box"
      name={props.id}
      onChange={() => props.onUpdate()}
      checked={props.checked}
      type="checkbox"
      label={props.label}
    />
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
      <Button key="save-button" type="submit" variant="primary">
        {text}
      </Button>
    );
    const cancelButton = text => (
      <Button
        key="cancel-button"
        type="cancel"
        variant="light"
        onClick={e => this.handleCancel(e)}
      >
        {text}
      </Button>
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
          ...field,
          value: this.state.values[field.id],
          onUpdate: value => this.handleUpdate(field.id, value),
          errMsg: this.state.errors[field.id],
        }),
        field.id
      );
    });

    const buttons = [
      saveButton(saveButtonText),
      cancelButton(cancelButtonText),
    ];

    const combine = [elements, buttons].map(e => e);

    return (
      <Form onSubmit={e => this.handleSave(e)}>{formatWrapper(combine)}</Form>
    );
  }
}
