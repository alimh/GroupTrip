import React from 'react';
import { AccountPage } from '../pages/AccountPage';
import { LoginPage } from '../pages/LoginPage';
import Auth from '../utils/Auth';

export const AccountRedirector = props =>
  (Auth.isUserAuthenticated() ? (
    <AccountPage {...props} />
  ) : (
    <LoginPage {...props} />
  ));

export default AccountRedirector;
