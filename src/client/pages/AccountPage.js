import React from 'react';
import Container from 'react-bootstrap/Container';
import { Redirect } from 'react-router-dom';
import { AccountPageDA } from '../data-access/AccountPageDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class AccountPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageObj: null,
      redirect: false
    };
  }

  handleMessage(m) {
    // display message
    this.setState({ messageObj: m });
  }

  handleLogout() {
    this.setState({ redirect: true });
  }

  render() {
    return this.state.redirect ? (
      <Redirect
        push
        to={{
          pathname: '/',
          state: {
            refresh: true,
            messageObj: { text: 'You have been logged out', variant: 'success' }
          }
        }}
      />
    ) : (
      <div>
        <br />
        <Container>
          <DisappearingAlert messageObj={this.state.messageObj} />
        </Container>
        <Container>
          <h3>Account Info</h3>
          <AccountPageDA
            onLogout={() => this.handleLogout()}
            message={m => this.handleMessage(m)}
          />
        </Container>
      </div>
    );
  }
}

export default AccountPage;
