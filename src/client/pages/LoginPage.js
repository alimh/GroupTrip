import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect } from 'react-router-dom';
import { LoginPageDA } from '../data-access/LoginPageDA';

export class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginSuccess: false
    };
  }

  handleLogin() {
    this.setState({ loginSuccess: true });
  }

  render() {
    return this.state.loginSuccess ? (
      <Redirect
        push
        to={{
          pathname: '/',
          state: {
            refresh: true,
            messageObj: { text: 'You have been logged in', variant: 'success' }
          }
        }}
      />
    ) : (
      <div>
        <br />
        <Container>
          <h3>Login</h3>
          <Row className="justify-content-md-center">
            <Col>
              <LoginPageDA onLogin={() => this.handleLogin()} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default LoginPage;
