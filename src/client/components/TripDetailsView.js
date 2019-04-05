import React from 'react';
import { Prompt } from 'react-router-dom';
import { SettingsViewWithNew } from './SettingsViewWithNew';
import { InputBox } from './FormComponents';
import { checkNotBlankError } from '../utils/FormValidation';

export class TripDetailsView extends React.Component {
  constructor(props) {
    super(props);

    const blankTripObj = {
      name: '',
      categories: [],
      travelers: [],
      tripId: null,
    };

    this.state = {
      tripObj: props.tripObj || blankTripObj,
      errors: { name: false },
      errorChecks: {
        name: f => checkNotBlankError(f),
      },
      unsaved: props.tripObj === null,
    };
  }

  handleUpdateName(name) {
    const tripObj = { ...this.state.tripObj, name };
    this.setState({ tripObj, unsaved: true });
  }

  handleNewSetting(settingGroup, newValue) {
    const newSetting = this.state.tripObj[settingGroup];
    newSetting[newSetting.length] = {
      label: newValue,
      id: newSetting.length,
      active: true,
      unsaved: true,
    };

    const tripObj = { ...this.state.tripObj, [settingGroup]: newSetting };
    this.setState({ tripObj });
  }

  handleRemoveSetting(settingGroup, i) {
    const currentSetting = this.state.tripObj[settingGroup];
    const newSettingItem = {
      ...currentSetting[i],
      active: !currentSetting[i].active,
      unsaved: true,
    };
    const newSetting = currentSetting;
    newSetting[i] = newSettingItem;
    const tripObj = { ...this.state.tripObj, [settingGroup]: newSetting };
    this.setState({ tripObj });
  }

  handleSave(e) {
    e.preventDefault();

    const { errors } = this.state;

    // loop through error checks and make sure they are all false
    const error = Object.keys(this.state.errorChecks).reduce((acc, field) => {
      errors[field] = this.state.errorChecks[field](this.state.tripObj[field]);
      return acc || errors[field] !== false;
    }, false);

    if (error) this.setState({ errors, unsaved: true });
    else {
      this.props.onSave(this.state.tripObj);
      this.setState({ unsaved: false });
    }
  }

  render() {
    console.log(this.state.tripObj);
    return (
      <div>
        <form onSubmit={e => this.handleSave(e)}>
          <Prompt
            when={this.state.unsaved}
            message="You have unsaved changes"
          />
          <strong>Give a name for your trip</strong>
          <br />
          <InputBox
            id="TripName"
            onUpdate={name => this.handleUpdateName(name)}
            value={this.state.tripObj.name}
            errMsg={this.state.errors.name}
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
