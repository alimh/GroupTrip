import React from 'react';
import { SettingsViewWithNew } from './SettingsViewWithNew';
import { InputBox } from './FormComponents';

export class TripDetailsView extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    const blankTripObj = {
      name: '',
      categories: [],
      travelers: [],
      tripId: null,
    };

    this.state = {
      tripObj: props.tripObj || blankTripObj,
    };
  }

  handleUpdateName(name) {
    const tripObj = { ...this.state.tripObj, name };
    this.setState({ tripObj });
  }

  handleNewSetting(settingGroup, newValue) {
    const newSetting = this.state.tripObj[settingGroup];
    newSetting[newSetting.length] = newValue;

    const tripObj = { ...this.state.tripObj, [settingGroup]: newSetting };
    this.setState({ tripObj });
  }

  handleRemoveSetting(settingGroup, i) {
    const newSetting = this.state.tripObj[settingGroup];
    newSetting.splice(i);

    const tripObj = { ...this.state.tripObj, [settingGroup]: newSetting };
    this.setState({ tripObj });
  }

  handleSave(e) {
    e.preventDefault();
    this.props.onSave(this.state.tripObj);
  }

  render() {
    console.log(this.state.tripObj);
    return (
      <div>
        <form onSubmit={e => this.handleSave(e)}>
          <strong>Give a name for your trip</strong>
          <br />
          <InputBox
            id="TripName"
            onUpdate={name => this.handleUpdateName(name)}
            value={this.state.tripObj.name}
          />
          <strong>Who is going on the trip?</strong>
          <SettingsViewWithNew
            key="travelers"
            settings={this.state.tripObj.travelers}
            onNew={newValue => this.handleNewSetting('travelers', newValue)}
            onRemove={i => this.handleRemoveSetting('travelers', i)}
          />
          <br />
          <strong>Add some categories</strong>
          <SettingsViewWithNew
            key="categories"
            settings={this.state.tripObj.categories}
            onNew={newValue => this.handleNewSetting('categories', newValue)}
            onRemove={i => this.handleRemoveSetting('categories', i)}
          />
          <button
            key="save-button"
            type="submit"
            variant="contained"
            color="primary"
          >
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default TripDetailsView;
