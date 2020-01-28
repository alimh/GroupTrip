import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Redirect, Link } from 'react-router-dom';
import { LoginPageDA } from '../data-access/LoginPageDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class LoginPage extends React.Component {
  constructor() {
    super();

    this.state = {
      loginSuccess: false,
      wrongPasswordMessageObj: null,
    };
  }

  handleLogin() {
    this.setState({ loginSuccess: true });
  }

  handleWrongPassword() {
    this.setState({
      wrongPasswordMessageObj: {
        text: 'Incorrect email or password',
        variant: 'error',
      },
    });
  }

  render() {
    const { loginSuccess, wrongPasswordMessageObj } = this.state;
    return loginSuccess
      ? (
        <Redirect
          push
          to={{
            pathname: '/',
            state: {
              refresh: true,
              messageObj: { text: 'You have been logged in', variant: 'success' },
            },
          }}
        />
      ) : (
        <div>
          <br />
          <Container>
            <h3>Login</h3>
            <Row>
              <Col>
                <DisappearingAlert
                  messageObj={wrongPasswordMessageObj}
                  disappear
                  timeout={2000}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col>
                <LoginPageDA
                  onLogin={() => this.handleLogin()}
                  wrongPassword={() => this.handleWrongPassword()}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button variant="link"><Link to="/forgot-password">Forgot Password?</Link></Button>
              </Col>
            </Row>
          </Container>
        </div>
      );
  }
}

export default LoginPage;
