import React from 'react';
import { SettingsViewWithNew } from './SettingsViewWithNew';
import { InputBox } from './FormComponents';

export class NewTripView extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      categories: [],
      travelers: [],
    };
  }

  handleUpdateName(name) {
    this.setState({ name });
  }

  handleNewSetting(settingGroup, newValue) {
    const newSetting = this.state[settingGroup];
    newSetting[newSetting.length] = newValue;

    this.setState({ [settingGroup]: newSetting });
  }

  handleRemoveSetting(settingGroup, i) {
    console.log(i);
    // TODO: write code to remove at given i. either splice or slice
  }

  handleCreate(e) {
    e.preventDefault();
    const tripObj = {
      name: this.state.name,
      categories: this.state.categories,
      travelers: this.state.travelers,
    };
    this.props.onCreate(tripObj);
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleCreate(e)}>
          <strong>Give a name for your trip</strong>
          <br />
          <InputBox
            id="TripName"
            onUpdate={name => this.handleUpdateName(name)}
          />
          <strong>Who is going on the trip?</strong>
          <SettingsViewWithNew
            key="travelers"
            settings={this.state.travelers}
            onNew={newValue => this.handleNewSetting('travelers', newValue)}
            onRemove={i => this.handleRemoveSetting('travelers', i)}
          />
          <br />
          <strong>Add some categories</strong>
          <SettingsViewWithNew
            key="categories"
            settings={this.state.categories}
            onNew={newValue => this.handleNewSetting('categories', newValue)}
            onRemove={i => this.handleRemoveSetting('categories', i)}
          />
          <button
            key="save-button"
            type="submit"
            variant="contained"
            color="primary"
          >
            Create
          </button>
        </form>
      </div>
    );
  }
}

export default NewTripView;
