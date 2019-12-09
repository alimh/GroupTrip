import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import Auth from '../utils/Auth';

export class LoginInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null
    };
  }

  componentDidMount() {
    Axios.get('/auth/check-auth')
      .then((res) => {
        if (res.data.username) {
          Auth.authenticateUser(res.data.username);
          this.setState({ username: res.data.username });
        } else Auth.deauthenticateUser();
      })
      .catch((err) => {
        console.log(err.response);
        // if (err.response.status === 401) {
        //   this.setState({
        //     relogin: true,
        //     message: 'Your session has expired.'
        //   });
        // }
        Auth.deauthenticateUser();
        this.setState({
          error: err.response.data !== '' ? err.response.data : err.toString()
        });
      });
  }

  render() {
    // if (this.state.error) throw this.state.error;
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
