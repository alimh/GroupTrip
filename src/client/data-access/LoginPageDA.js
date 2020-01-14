/* eslint react/forbid-prop-types: "off" */

import React, { useContext } from 'react';
import Axios from 'axios';
import { FormBuilder } from '../components/FormComponents';
import {
  checkNotBlankError,
  checkValidEmailError
} from '../utils/FormValidation';

import Auth from '../utils/Auth';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export const LoginPageDA = (props) => {
  const context = useContext(MessageContext);

  const post = (fieldValues) => {
    const payload = { ...fieldValues };
    Axios.post('/auth/login', payload)
      .then((res) => {
        Auth.authenticateUser(res.data.token);
        props.onLogin();
      })
      .catch((err) => {
        if (err.response.status === 403) props.wrongPassword();
        else context.sendMessage(ErrToMessageObj(err));
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
