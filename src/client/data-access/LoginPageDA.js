/* eslint react/forbid-prop-types: "off" */

import React from 'react';
import Axios from 'axios';
import { FormBuilder } from '../components/FormComponents';
import {
  checkNotBlankError,
  checkValidEmailError
} from '../utils/FormValidation';

import Auth from '../utils/Auth';

export const LoginPageDA = (props) => {
  const post = (fieldValues) => {
    const payload = { ...fieldValues };
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/auth/login', payload, {
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
  };
  const fields = [
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
    }
  ];
  return (
    <FormBuilder
      fields={fields}
      saveButtonText="Login"
      onSave={fieldValues => post(fieldValues)}
    />
  );
};

export default LoginPageDA;
