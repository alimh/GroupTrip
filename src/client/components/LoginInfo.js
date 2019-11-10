import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Auth from '../utils/Auth';

export const LoginInfo = () => {
  const token = Auth.getToken();
  return token ? (
    <LinkContainer to="/account">
      <Nav.Link>Account Info</Nav.Link>
    </LinkContainer>
  ) : (
    <LinkContainer to="/login">
      <Nav.Link>Login</Nav.Link>
    </LinkContainer>
  );
};

export default LoginInfo;
