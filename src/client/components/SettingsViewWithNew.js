import React from 'react';
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
    return (
      <ul>
        {this.state.settings.map((value, i) => (
          <li key={value.id}>
            {value.label}
            &nbsp;
            <button
              onClick={(e) => {
                e.preventDefault();
                this.props.onRemove(i);
              }}
            >
              x
            </button>
            {value.active ? <div>active</div> : <div />}
            {value.unsaved !== undefined ? <div>unsaved</div> : <div />}
          </li>
        ))}
        <li key="new">
          <InputBox
            id="New"
            name=""
            placeholder="New"
            value={this.state.newValue}
            onUpdate={newValue => this.handleChange(newValue)}
          />
          <button onClick={e => this.sendNewValue(e)}>Add</button>
        </li>
      </ul>
    );
  }
}

export default SettingsViewWithNew;
