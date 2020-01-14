import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoggedOutMessage } from './LoggedOutMessage';

import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export class LoginInfo extends React.Component {
  static contextType = MessageContext;

  constructor() {
    super();

    this.state = {
      username: null
    };
  }

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth() {
    // Auth.deauthenticateUser();
    Axios.get('/auth/check-auth')
      .then((res) => {
        if (res.data.name) {
          Auth.authenticateUser(res.data.name);
          this.setState({ username: res.data.name });
        } else Auth.deauthenticateUser();
      })
      .catch((err) => {
        Auth.deauthenticateUser();
        if (err.response && err.response.status === 401) {
          this.setState({
            relogin: true
          });
        } else this.context.sendMessage(ErrToMessageObj(err));
      });
  }

  render() {
    if (this.state.relogin) return <LoggedOutMessage />;

    return this.state.username ? (
      <Nav>
        <LinkContainer to="/account">
          <Nav.Link active>Hi, {this.state.username}</Nav.Link>
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
  }
}
export default LoginInfo;
