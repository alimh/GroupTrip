import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect } from 'react-router-dom';
import { NewUser } from '../data-access/NewUserDA';

export class NewUserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
            messageObj: { text: 'Account created', variant: 'success' }
          }
        }}
      />
    ) : (
      <div>
        <br />
        <Container>
          <Row className="justify-content-md-center">
            <Col>
              <h3>Signup</h3>
              <NewUser onLogin={() => this.handleLogin()} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default NewUserPage;
