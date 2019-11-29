import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Auth from '../utils/Auth';

export const LoginInfo = () => {
  const token = Auth.getToken();
  return token ? (
    <Nav>
      <LinkContainer to="/account">
        <Nav.Link active>Account Info</Nav.Link>
      </LinkContainer>
    </Nav>
  ) : (
    <Nav>
      <Nav.Item>
        <LinkContainer to="/login">
          <Nav.Link active>Login</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link disabled>/</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/newuser">
          <Nav.Link active>Signup</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  );
};

export default LoginInfo;
