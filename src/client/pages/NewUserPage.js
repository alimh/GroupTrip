import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect } from 'react-router-dom';
import { NewUser } from '../data-access/NewUserDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class NewUserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageObj: null,
    };
  }

  handleMessage(m) {
    // display message
    this.setState({ messageObj: m });
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
          <Row>
            <Col>
              <DisappearingAlert messageObj={this.state.messageObj} />
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <h3>Create a new user</h3>
              <NewUser
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

export default NewUserPage;
