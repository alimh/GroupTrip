/* eslint react/forbid-prop-types: "off" */

import React from 'react';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { LoadingView } from '../components/LoadingView';
import { FormBuilder } from '../components/FormComponents';
import {
  checkNotBlankError,
  checkValidEmailError,
} from '../utils/FormValidation';
import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

import Auth from '../utils/Auth';

export class AccountPageDA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fieldValues: {},
    };
  }

  componentDidMount() {
    this.getUserSettings();
  }

  getUserSettings() {
    this.setState({ loading: true });
    const { sendMessage } = this.context;

    Axios.get('/api/users/settings')
      .then((res) => {
        this.setState({ loading: false, fieldValues: res.data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        sendMessage(ErrToMessageObj(err));
      });
  }

  postUserCommonSettings(fieldValues) {
    const payload = { ...fieldValues };
    const { sendMessage } = this.context;
    Axios.post('/api/users/commonsettings', payload)
      .then(() => {
        sendMessage({ text: 'Changes saved', variant: 'success' });
        this.getUserSettings();
      })
      .catch((err) => sendMessage(ErrToMessageObj(err)));
  }

  postUserPassword(fieldValues) {
    const payload = { ...fieldValues };
    const { sendMessage } = this.context;
    Axios.post('/api/users/password', payload)
      .then(() => {
        sendMessage({
          text: 'Password changed',
          variant: 'success',
        });
      })
      .catch((err) => sendMessage(ErrToMessageObj(err)));
  }

  postReminderSettings(fieldValues) {
    const payload = { ...fieldValues };
    const { sendMessage } = this.context;
    Axios.post('/api/users/reminder', payload)
      .then(() => {
        sendMessage({
          text: 'Settings changed',
          variant: 'success',
        });
      })
      .catch((err) => sendMessage(ErrToMessageObj(err)));
  }

  handleLogout() {
    const { onLogout } = this.props;
    const { sendMessage } = this.context;

    Auth.deauthenticateUser();
    Axios.post('/auth/logout')
      .then(() => {
        onLogout();
      })
      .catch((err) => sendMessage(ErrToMessageObj(err)));
  }

  render() {
    const { loading, fieldValues } = this.state;
    const fieldsCommon = [
      {
        id: 'name',
        label: 'Display Name',
        initialValue: fieldValues.name || '',
        errorChecks: (value) => checkNotBlankError(value),
      },
      {
        id: 'email',
        label: 'Email',
        initialValue: fieldValues.email || '',
        errorChecks: (value) => checkValidEmailError(value),
      },
    ];
    const fieldsReminder = [
      {
        id: 'currentPasswordReminder',
        label: 'Current Password',
        inputType: 'password',
        errorChecks: (value) => checkNotBlankError(value),
      },
      {
        id: 'reminderQuestion',
        label: 'Password Reminder Question',
        initialValue: fieldValues.reminderQuestion || '',
        errorChecks: (value) => checkNotBlankError(value),
      },
      {
        id: 'reminderAnswer',
        label: 'Password Reminder Answer',
        inputType: 'password',
        errorChecks: (value) => checkNotBlankError(value),
      },
    ];
    const fieldsPassword = [
      {
        id: 'currentPassword',
        label: 'Current Password',
        inputType: 'password',
        errorChecks: (value) => checkNotBlankError(value),
      },
      {
        id: 'password',
        label: 'New Password',
        inputType: 'password',
        errorChecks: (value) => checkNotBlankError(value),
      },
      {
        id: 'confirm_password',
        label: 'Confirm New Password',
        inputType: 'password',
      },
    ];
    return loading
      ? (
        <LoadingView />
      ) : (
        <div className="AccountPageDa">
          <hr />
          <Row>
            <Col>
              <h4>General Settings</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormBuilder
                fields={fieldsCommon}
                onSave={(newValues) => this.postUserCommonSettings(newValues)}
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <h4>Password Reminder Settings</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormBuilder
                fields={fieldsReminder}
                onSave={(newValues) => this.postReminderSettings(newValues)}
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <h4>Change Password</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormBuilder
                fields={fieldsPassword}
                onSave={(newValues) => this.postUserPassword(newValues)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="outline-danger"
                onClick={() => this.handleLogout()}
              >
                Logout
              </Button>
            </Col>
          </Row>
        </div>
      );
  }
}
AccountPageDA.contextType = MessageContext;

export default AccountPageDA;
