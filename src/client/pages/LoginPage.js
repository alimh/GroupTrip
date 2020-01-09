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
      messageObj: null
    };
  }

  handleMessage(msg) {
    this.setState({
      messageObj: msg
    });
  }

  handleLogin() {
    this.setState({ loginSuccess: true });
  }

  render() {
    return this.state.loginSuccess ? (
      <Redirect push to={{ pathname: '/', state: { refresh: true } }} />
    ) : (
      <div>
        <br />
        <Container>
          <h3>Login</h3>
          <Container>
            <DisappearingAlert messageObj={this.state.messageObj} />
          </Container>
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
