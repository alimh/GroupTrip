import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect } from 'react-router-dom';
import { LoginPageDA } from '../data-access/LoginPageDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginSuccess: false,
      wrongPasswordMessageObj: null
    };
  }

  handleLogin() {
    this.setState({ loginSuccess: true });
  }

  handleWrongPassword() {
    this.setState({
      wrongPasswordMessageObj: {
        text: 'Incorrect email or password',
        variant: 'error'
      }
    });
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
          <Row>
            <Col>
              <DisappearingAlert
                messageObj={this.state.wrongPasswordMessageObj}
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
        </Container>
      </div>
    );
  }
}

export default LoginPage;
