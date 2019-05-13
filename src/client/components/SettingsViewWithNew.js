import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { InputBox } from './FormComponents';

export class SettingsViewWithNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: props.settings,
      newValue: '',
    };
  }

  handleChange(newValue) {
    this.setState({ newValue });
  }

  sendNewValue(e) {
    e.preventDefault();

    this.setState({ newValue: '' });
    this.props.onNew(this.state.newValue);
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
