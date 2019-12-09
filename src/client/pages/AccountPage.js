import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
// import { AccountPageDA } from '../data-access/AccountPageDA';
import Auth from '../utils/Auth';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class AccountPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: {
        success: null,
        error: null
      },
      redirect: null
    };
  }

  handleMessage(m) {
    // display message
    this.setState({ messages: { ...m } });
  }

  handleLogout() {
    Auth.deauthenticateUser();
    this.setState({ redirect: true });
    Axios.post('/auth/logout')
      .then(() => this.setState({ redirect: true }))
      .catch(err => console.log(err));
  }

  render() {
    return this.state.redirect ? (
      <Redirect push to="/login" />
    ) : (
      <div>
        <br />
        <Container>
          <h3>Account</h3>
          <DisappearingAlert
            msg={this.state.messages.error}
            variant="danger"
            disappear={false}
          />
          <Row className="justify-content-md-center">
            <Col>
              <span>Account Info goes here</span>
              <Button
                variant="outline-danger"
                onClick={() => this.handleLogout()}
              >
                Logout
              </Button>
              {/* <LoginPageDA
                {...this.props}
                message={message => this.handleMessage(message)}
              /> */}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default AccountPage;
