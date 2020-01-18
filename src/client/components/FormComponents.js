import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FormComponents.css";

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
        readOnly={!!props.disabled}
        isInvalid={!!props.errMsg}
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

export const DatePickerBox = props => (
  <Form.Group controlId={props.id}>
    <Form.Label>
      {props.formatLabel ? props.formatLabel(props.label) : props.label}
    </Form.Label>
    <InputGroup>
      <DatePicker
        className="date-picker-box form-control"
        selected={props.value}
        onSelect={d => props.onUpdate(d)}
        placeholderText={props.placeholder}
        disabled={props.disabled || false}
        isInvalid={!!props.errMsg}
      />
      <Form.Control.Feedback type="invalid">
        {props.errMsg}
      </Form.Control.Feedback>
    </InputGroup>
  </Form.Group>
);

export const SelectBox = props =>
  !props.disabled ? (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        as="select"
        value={props.value.key}
        isInvalid={!!props.errMsg}
        onChange={e => {
          props.onUpdate({
            value:
              e.target.value !== ""
                ? e.target.namedItem(e.target.value).innerText
                : "",
            key: e.target.value
          });
        }}
        inputprops={{
          name: props.id,
          id: props.id
        }}
      >
        <option key="0" value="" name="">
          {props.placeholder}
        </option>
        {props.options.map(option => (
          <option key={option.key} value={option.key} name={option.key}>
            {option.value}
          </option>
        ))}
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        {props.errMsg}
      </Form.Control.Feedback>
    </Form.Group>
  ) : (
    InputBox({
      value: props.value.key
        ? props.options.find(o => o.key === props.value.key).value
        : "",
      onUpdate: () => true,
      disabled: true,
      label: props.label
    })
  );

export const MultiSelect = props => (
  <div>
    <div>{props.label}</div>
    <div>
      {props.selectAll && !props.disabled ? (
        <CheckboxElement
          key="select-all"
          label="Select All"
          checked={props.options.reduce((acc, o) => o.checked && acc, true)}
          onUpdate={() => {
            const newOptions = props.options;
            const currentStatus = props.options.reduce(
              (acc, o) => o.checked && acc,
              true
            );
            newOptions.forEach(n => (n.checked = !currentStatus));
            return props.onUpdate(newOptions);
          }}
        />
      ) : (
        <div />
      )}
      {props.options.map((option, n) => (
        <CheckboxElement
          key={option.key}
          id={option.key}
          label={option.value}
          isInvalid={!!props.errMsg}
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
    <br />
  </div>
);

export const CheckboxElement = props => (
  <div>
    <Form.Check
      className="check-box"
      name={props.id}
      onChange={v => props.onUpdate(v.value)}
      checked={props.checked}
      type="checkbox"
      label={props.label}
      disabled={props.disabled}
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
        if (field.type === "select-box") {
          initialValue = field.initialValue || { key: "", value: "" };
        } else if (field.type === "multi-select") {
          const checked = field.initialValue || [];
          const kvp = checked.reduce((acc, element, n) => {
            acc[element.key] = n + 1; // to avoid 0 being counted as false
            return acc;
          }, {});
          initialValue = field.options.map(option => {
            const check = kvp[option.key] > 0; // if the option exists int he checked kvp
            return { key: option.key, value: option.value, checked: check };
          });
        } else {
          initialValue = field.initialValue || "";
        }
        const values = { ...set.values, [field.id]: initialValue };

        const errors = { ...set.errors, [field.id]: false };
        const errorChecks = {
          ...set.errorChecks,
          [field.id]: field.errorChecks || noValidation
        };

        return { values, errors, errorChecks };
      },
      { values: {}, errors: {}, errorChecks: {} }
    );

    const onCancel = props.onCancel || (() => this.resetForm());
    const viewOnly = props.viewOnly || false;

    this.state = {
      ...initialState,
      initial: initialState,
      handleCancel: onCancel,
      viewOnly,
      dirty: false
    };
  }

  resetForm() {
    this.setState({
      values: this.state.initial.values,
      errors: this.state.initial.errors,
      dirty: false
    });
  }

  handleUpdate(field, value) {
    const errors = {
      ...this.state.errors,
      [field]: this.state.errorChecks[field](value)
    };

    const values = {
      ...this.state.values,
      [field]: value
    };
    this.setState({ values, errors, dirty: true });
  }

  handleSave(e) {
    e.preventDefault();
    const { errors } = this.state;

    // loop through error checks and make sure they are all false
    const error = Object.keys(this.state.errorChecks).reduce((acc, field) => {
      errors[field] = this.state.errorChecks[field](this.state.values[field]);
      return acc || errors[field] !== false;
    }, false);

    const confirmPasswordCheck =
      this.state.values.confirm_password !== undefined &&
      this.state.values.confirm_password !== this.state.values.password
        ? "Passwords do not match"
        : false;
    if (confirmPasswordCheck) errors.confirm_password = confirmPasswordCheck;

    if (error || confirmPasswordCheck) {
      e.preventDefault();
      this.setState({ errors });
    } else {
      this.props.onSave(this.state.values);
      this.resetForm();
    }
  }

  handleCancel(e) {
    e.preventDefault();

    if (this.state.confirmRemove) {
      this.setState({ confirmRemove: false });
    } else {
      this.state.handleCancel();
    }
  }

  showConfirmRemoveButton(e) {
    e.preventDefault();

    this.setState({ confirmRemove: true });
  }

  handleRemove(e) {
    e.preventDefault();

    if (this.props.onRemove) this.props.onRemove();
  }
  render() {
    const noFormatItem = (field, key) => <div key={key}>{field}</div>;
    const noFormatWrapper = fields => <div>{fields}</div>;
    const saveButton = text => (
      <Button
        key="save-button"
        type="submit"
        variant="primary"
        disabled={!this.state.dirty}
      >
        {text}
      </Button>
    );
    const cancelButton = text => (
      <Button
        key="cancel-button"
        type="cancel"
        variant="outline-secondary"
        onClick={e => this.handleCancel(e)}
      >
        {text}
      </Button>
    );
    const removeButton = text => (
      <Button
        key="remove-button"
        variant="outline-danger"
        onClick={e => this.showConfirmRemoveButton(e)}
      >
        {text}
      </Button>
    );
    const confirmRemoveButton = text => (
      <Button
        key="confirm-remove-button"
        variant="danger"
        onClick={e => this.handleRemove(e)}
      >
        {text}
      </Button>
    );

    const space = <span key="space">&nbsp;</span>;
    const floatRight = e => (
      <div key="float-right" className="float-right">
        {e}
      </div>
    );

    const saveButtonText = this.props.saveButtonText || "Save";
    const cancelButtonText = this.props.cancelButtonText || "Cancel";
    const removeButtonText = this.props.removeButtonText || "Remove";
    const confirmRemoveButtonText =
      this.props.confirmRemoveButtonText || "Confirm";

    const formatItem = this.props.formatItem || noFormatItem;
    const formatWrapper = this.props.formatWrapper || noFormatWrapper;
    //    const formatButtons = this.props.formatButtons || formatItem;

    const elements = this.props.fields.map(field => {
      if (field.type === "date-picker") {
        return formatItem(
          DatePickerBox({
            ...field,
            value: this.state.values[field.id],
            onUpdate: value => this.handleUpdate(field.id, value),
            errMsg: this.state.errors[field.id],
            disabled: field.disabled || this.state.viewOnly
          }),
          field.id
        );
      }
      if (field.type === "multi-select") {
        return formatItem(
          MultiSelect({
            id: field.id,
            label: field.label,
            options: this.state.values[field.id],
            selectAll: field.selectAll || false,
            onUpdate: options => this.handleUpdate(field.id, options),
            disabled: field.disabled || this.state.viewOnly,
            errMsg: this.state.errors[field.id]
          }),
          field.id
        );
      }
      if (field.type === "select-box") {
        return formatItem(
          SelectBox({
            id: field.id,
            label: field.label,
            value: { key: this.state.values[field.id].key },
            onUpdate: selected => this.handleUpdate(field.id, selected),
            disabled: field.disabled || this.state.viewOnly,
            errMsg: this.state.errors[field.id],
            options: field.options || [],
            placeholder: field.placeholder
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
          disabled: field.disabled || this.state.viewOnly
        }),
        field.id
      );
    });

    const buttons = [
      !this.state.confirmRemove ? (
        saveButton(saveButtonText)
      ) : (
        <div key="blank-save-button" />
      ),
      space,
      !this.props.hideCancel || this.state.confirmRemove ? (
        cancelButton(cancelButtonText)
      ) : (
        <div key="blank-cancel-button" />
      )
    ];

    const removeButtonSelector = () => {
      if (this.props.onRemove && !this.state.confirmRemove) {
        return removeButton(removeButtonText);
      }
      if (this.state.confirmRemove) {
        return confirmRemoveButton(confirmRemoveButtonText);
      }
      return true;
    };

    const combine = !this.state.viewOnly
      ? [elements, removeButtonSelector(), floatRight(buttons)].map(e => e)
      : elements;

    return (
      <Form validated={false} onSubmit={e => this.handleSave(e)}>
        {formatWrapper(combine)}
      </Form>
    );
  }
}
