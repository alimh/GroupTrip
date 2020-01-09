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
  checkValidEmailError
} from '../utils/FormValidation';

import Auth from '../utils/Auth';

export class AccountPageDA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      fieldValues: {}
    };
  }

  componentDidMount() {
    this.getUserSettings();
  }

  getUserSettings() {
    this.setState({ loading: true });
    Axios.get('/api/users/settings')
      .then((res) => {
        this.setState({ loading: false, fieldValues: res.data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ text: err.toString(), variant: 'error' });
      });
  }

  postUserCommonSettings(fieldValues) {
    const payload = { ...fieldValues };
    Axios.post('/api/users/commonsettings', payload)
      .then(() => {
        this.getUserSettings();
        this.props.message({ text: 'Changes saved', variant: 'success' });
      })
      .catch((err) => {
        this.props.message({
          heading: err.toString(),
          text: err.response.data,
          variant: 'error'
        });
      });
  }

  postUserPassword(fieldValues) {
    const payload = { ...fieldValues };
    Axios.post('/api/users/password', payload)
      .then(() => {
        this.props.message({ text: 'Password changed', variant: 'success' });
      })
      .catch((err) => {
        this.props.message({
          heading: err.toString(),
          text: err.response.data,
          variant: 'error'
        });
      });
  }

  handleLogout() {
    Auth.deauthenticateUser();
    Axios.post('/auth/logout')
      .then(() => {
        this.props.onLogout();
      })
      .catch(err =>
        this.props.message({ text: err.toString(), variant: 'error' }));
  }

  render() {
    const fieldsCommon = [
      {
        id: 'name',
        label: 'Display Name',
        initialValue: this.state.fieldValues.name || '',
        errorChecks: value => checkNotBlankError(value)
      },
      {
        id: 'email',
        label: 'Email',
        initialValue: this.state.fieldValues.email || '',
        errorChecks: value => checkValidEmailError(value)
      }
    ];
    const fieldsPassword = [
      {
        id: 'current_password',
        label: 'Current Password',
        inputType: 'password',
        errorChecks: value => checkNotBlankError(value)
      },
      {
        id: 'password',
        label: 'New Password',
        inputType: 'password',
        errorChecks: value => checkNotBlankError(value)
      },
      {
        id: 'confirm_password',
        label: 'Confirm New Password',
        inputType: 'password'
      }
    ];
    return this.state.loading ? (
      <LoadingView />
    ) : (
      <div className="AccountPageDa">
        <Row>
          <Col>
            <FormBuilder
              fields={fieldsCommon}
              onSave={fieldValues => this.postUserCommonSettings(fieldValues)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormBuilder
              fields={fieldsPassword}
              onSave={fieldValues => this.postUserPassword(fieldValues)}
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

export default AccountPageDA;
