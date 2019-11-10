import React from 'react';
import { AccountPage } from '../pages/AccountPage';
import { LoginPage } from '../pages/LoginPage';
import Auth from '../utils/Auth';

export const AccountRedirector = () => {
  const token = Auth.getToken();
  return token ? <AccountPage /> : <LoginPage />;
};

export default AccountRedirector;
