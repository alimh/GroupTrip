import React from 'react';
import Container from 'react-bootstrap/Container';
import { Redirect } from 'react-router-dom';
import { AccountPageDA } from '../data-access/AccountPageDA';

export class AccountPage extends React.Component {
  constructor() {
    super();

    this.state = {
      redirect: false,
    };
  }

  handleLogout() {
    this.setState({ redirect: true });
  }

  render() {
    const { redirect } = this.state;
    return redirect
      ? (
        <Redirect
          push
          to={{
            pathname: '/',
            state: {
              refresh: true,
              messageObj: { text: 'You have been logged out', variant: 'success' },
            },
          }}
        />
      ) : (
        <div>
          <br />
          <Container>
            <h3>Account Info</h3>
            <AccountPageDA onLogout={() => this.handleLogout()} />
          </Container>
        </div>
      );
  }
}

export default AccountPage;
