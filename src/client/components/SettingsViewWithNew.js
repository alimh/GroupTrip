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
          <li key={value}>
            {value}
            &nbsp;
            <button value="x" onClick={() => this.props.onRemove(i)} />
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
