import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { SettingsViewWithNew } from '../components/SettingsViewWithNew';
import { ErrorView } from '../components/ErrorView';
import { LoadingView } from '../components/LoadingView';

export class SettingsPage extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.getSettings();
  }

  getSettings() {
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.get('/api/settings/all', {
      headers: { Authorization: authorizationHeader },
    })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, settings: data });
      })
      .catch((err) => {
        this.setState({ loading: false, error: err.toString() });
      });
  }

  handleNewSetting(settingsObject) {
    // settingsObject: {
    //  category: String, name of the setting category
    //  value: String, value of the new setting
    const payload = settingsObject;
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/api/settings/new', payload, {
      headers: { Authorization: authorizationHeader },
    })
      .then(() => this.getSettings())
      .catch((err) => {
        this.setState({ loading: false, error: err.toString() });
      });
  }

  handleRemoveSetting(id) {
    // settingsObject: {
    //  category: String, name of the setting category
    //  value: String, value of the setting to remove
    const payload = { id };
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/api/settings/remove', payload, {
      headers: { Authorization: authorizationHeader },
    })
      .then(() => this.getSettings())
      .catch((err) => {
        this.setState({ loading: false, error: err.toString() });
      });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    if (this.state.error) return <ErrorView error={this.state.error} />;
    return (
      <SettingsViewWithNew
        settings={this.state.settings}
        onNew={settingsObject => this.handleNewSetting(settingsObject)}
        onRemove={settingsObject => this.handleRemoveSetting(settingsObject)}
      />
    );
  }
}

export default SettingsPage;
