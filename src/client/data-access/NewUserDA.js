/* eslint react/forbid-prop-types: "off" */

import React from 'react';
import Axios from 'axios';
import { FormBuilder } from '../components/FormComponents';
import {
  checkNotBlankError,
  checkValidEmailError
} from '../utils/FormValidation';

import Auth from '../utils/Auth';

export const NewUser = (props) => {
  const post = (fieldValues) => {
    if (fieldValues.password === fieldValues.confirm_password) {
      const payload = { ...fieldValues };
      const authorizationHeader = 'bearer '.concat(Auth.getToken());
      Axios.post('/auth/signup', payload, {
        headers: { Authorization: authorizationHeader }
      })
        .then((res) => {
          Auth.authenticateUser(res.data.token);
          props.onLogin();
        })
        .catch((err) => {
          if (props.message) {
            props.message({
              text: err.response.data,
              variant: 'error'
            });
          } else throw err;
        });
    } else if (props.message) {
      props.message({
        text: 'Password do not match',
        variant: 'warning'
      });
    }
  };

  const fields = [
    {
      id: 'name',
      label: 'Display Name',
      errorChecks: value => checkNotBlankError(value)
    },
    {
      id: 'email',
      label: 'Email',
      errorChecks: value => checkValidEmailError(value)
    },
    {
      id: 'password',
      label: 'Password',
      inputType: 'password',
      errorChecks: value => checkNotBlankError(value)
    },
    {
      id: 'confirm_password',
      label: 'Confirm Password',
      inputType: 'password'
    }
  ];
  return (
    <FormBuilder fields={fields} onSave={fieldValues => post(fieldValues)} />
  );
};

export default NewUser;
