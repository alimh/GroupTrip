import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { InputBox } from './FormComponents';
import { checkNotBlankError } from '../utils/FormValidation';

export class SettingsViewWithNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: props.settings,
      newValue: '',
      error: false,
    };
  }

  handleChange(newValue) {
    // check for error

    this.setState({ newValue });
  }

  sendNewValue(e) {
    e.preventDefault();

    const error = checkNotBlankError(this.state.newValue);
    if (!error) {
      this.setState({ newValue: '', error: false });
      this.props.onNew(this.state.newValue);
    } else {
      this.setState({ error });
    }
  }

  render() {
    const noFormat = t => t;
    const formatDirty = this.props.formatDirty || noFormat;
    const formatRemove = this.props.formatRemove || noFormat;

    return (
      <div>
        <ListGroup>
          {this.state.settings.map((value, i) => (
            <ListGroup.Item key={value.id}>
              {!value.active
                ? formatRemove(value.label)
                : value.unsaved
                ? formatDirty(value.label)
                : value.label}
              <Button
                className="float-right"
                variant="outline-warning"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.onRemove(i);
                }}
              >
                {value.active ? 'x' : 'Reenable'}
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <InputBox
          id="New"
          name=""
          placeholder="New"
          value={this.state.newValue}
          onUpdate={newValue => this.handleChange(newValue)}
          errMsg={this.state.error}
          appendButton={
            <Button
              variant="outline-secondary"
              onClick={e => this.sendNewValue(e)}
            >
              Add
            </Button>
          }
        />
      </div>
    );
  }
}

export default SettingsViewWithNew;
