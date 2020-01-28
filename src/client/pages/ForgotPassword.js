import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect } from 'react-router-dom';
import { ForgotPasswordDA } from '../data-access/ForgotPasswordDA';

export class ForgotPassword extends React.Component {
  constructor() {
    super();

    this.state = {
      forgotPasswordSuccess: false,
    };
  }

  handleSuccess() {
    this.setState({ forgotPasswordSuccess: true });
  }

  render() {
    const { forgotPasswordSuccess } = this.state;

    return forgotPasswordSuccess
      ? (
        <Redirect
          push
          to={{
            pathname: '/',
            state: {
              refresh: true,
              messageObj: { text: 'Password Changed', variant: 'success' },
            },
          }}
        />
      ) : (
        <div>
          <br />
          <Container>
            <h3>Forgot Password</h3>
            <br />
            <Row className="justify-content-md-center">
              <Col>
                <ForgotPasswordDA
                  onSuccess={() => this.handleSuccess()}
                />
              </Col>
            </Row>
          </Container>
        </div>
      );
  }
}

export default ForgotPassword;
