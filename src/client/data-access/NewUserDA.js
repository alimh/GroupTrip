/* eslint react/forbid-prop-types: "off" */

import React from 'react';
import Axios from 'axios';
import { FormBuilder } from '../components/FormComponents';
import Auth from '../utils/Auth';

export const NewUser = (props) => {
  const post = (fieldValues) => {
    console.log(fieldValues);
    // const payload = { ...fieldValues };
    // const authorizationHeader = 'bearer '.concat(Auth.getToken());
    // Axios.post('/auth/login', payload, {
    //   headers: { Authorization: authorizationHeader },
    // })
    //   .then((res) => {
    //     Auth.authenticateUser(res.data.token);
    //     props.onLogin();
    //   })
    //   .catch((err) => {
    //     props.message({ error: err.toString() });
    //   });
  };
  const fields = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'password', label: 'Password' },
    { id: 'confirm_password', label: 'Confirm Password' },
  ];
  return (
    <FormBuilder fields={fields} onSave={fieldValues => post(fieldValues)} />
  );
};

export default NewUser;
