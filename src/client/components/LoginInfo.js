import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoggedOutMessage } from './LoggedOutMessage';

import { ErrToMessageObj } from './MessageContext';

export class LoginInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null,
    };
  }

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth() {
    const { sendMessage } = this.props;
    const username = Auth.getToken();

    // Auth.deauthenticateUser();
    Axios.get('/api/users/check-auth', {
      params: { username },
    })
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
            relogin: true,
          });
          sendMessage({ text: 'Your session has expired. Click above to relogin', variant: 'warning', disappear: false });
        } else sendMessage(ErrToMessageObj(err));
      });
  }

  render() {
    const { relogin, username } = this.state;

    if (relogin) return <LoggedOutMessage />;

    return username
      ? (
        <Nav>
          <LinkContainer to="/account">
            <Nav.Link active>
              Hi,
              {' '}
              {username}
            </Nav.Link>
          </LinkContainer>
        </Nav>
      )
      : (
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
