/* eslint react/forbid-prop-types: "off" */

import React from 'react';
import Axios from 'axios';
import { FormBuilder } from '../components/FormComponents';
import Auth from '../utils/Auth';

export const LoginPage = (props) => {
  const post = (fieldValues) => {
    console.table(fieldValues);
    const payload = { ...fieldValues };
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.post('/auth/login', payload, {
      headers: { Authorization: authorizationHeader },
    })
      .then((res) => {
        console.log('posted');
        console.log(res);
        props.onLogin(res.data.token, res.data.userName);
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };
  const fields = [
    { id: 'username', label: 'User Name' },
    { id: 'password', label: 'Password' },
  ];
  return (
    <FormBuilder fields={fields} onSave={fieldValues => post(fieldValues)} />
  );
};

export default LoginPage;
