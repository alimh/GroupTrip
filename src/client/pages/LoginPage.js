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
      messages: {
        success: null,
        error: null,
      },
    };
  }

  handleMessage(m) {
    // display message
    this.setState({ messages: { ...m } });
  }

  handleLogin() {
    this.setState({ loginSuccess: true });
  }

  render() {
    return this.state.loginSuccess ? (
      <Redirect push to="/" />
    ) : (
      <div>
        <br />
        <Container>
          <h3>Login</h3>
          <DisappearingAlert
            msg={this.state.messages.error}
            variant="danger"
            disappear={false}
          />
          <Row className="justify-content-md-center">
            <Col>
              <LoginPageDA
                onLogin={() => this.handleLogin()}
                message={message => this.handleMessage(message)}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default LoginPage;
