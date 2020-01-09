import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoggedOutMessage } from './LoggedOutMessage';

export class LoginInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null
    };
  }

  componentDidMount() {
    Auth.deauthenticateUser();
    Axios.get('/auth/check-auth')
      .then((res) => {
        if (res.data.name) {
          Auth.authenticateUser(res.data.name);
          this.setState({ username: res.data.name });
        } else Auth.deauthenticateUser();
      })
      .catch((err) => {
        console.log(err.response);
        // TODO: display this error
        if (err.response.status === 401) {
          this.setState({
            relogin: true
          });
        }
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
