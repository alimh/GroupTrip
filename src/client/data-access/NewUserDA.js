/* eslint react/forbid-prop-types: "off" */

import React, { useContext } from 'react';
import Axios from 'axios';
import { FormBuilder } from '../components/FormComponents';
import {
  checkNotBlankError,
  checkValidEmailError,
} from '../utils/FormValidation';

import Auth from '../utils/Auth';
import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export const NewUser = (props) => {
  const context = useContext(MessageContext);

  const post = (fieldValues) => {
    if (fieldValues.password === fieldValues.confirm_password) {
      const payload = { ...fieldValues };
      Axios.post('/auth/signup', payload)
        .then((res) => {
          Auth.authenticateUser(res.data.token);
          props.onLogin();
        })
        .catch((err) => context.sendMessage(ErrToMessageObj(err)));
    }
  };

  const fields = [
    {
      id: 'name',
      label: 'Display Name',
      errorChecks: (value) => checkNotBlankError(value),
    },
    {
      id: 'email',
      label: 'Email',
      errorChecks: (value) => checkValidEmailError(value),
    },
    {
      id: 'password',
      label: 'Password',
      inputType: 'password',
      errorChecks: (value) => checkNotBlankError(value),
    },
    {
      id: 'confirm_password',
      label: 'Confirm Password',
      inputType: 'password',
    },
    {
      id: 'reminderQuestion',
      label: 'Password Reminder Question',
      errorChecks: (value) => checkNotBlankError(value),
    },
    {
      id: 'reminderAnswer',
      label: 'Password Reminder Answer',
      inputType: 'password',
      errorChecks: (value) => checkNotBlankError(value),
    },
  ];
  return (
    <FormBuilder fields={fields} onSave={(fieldValues) => post(fieldValues)} />
  );
};

export default NewUser;
