import React from 'react';
import { Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { TripDetailsDA } from '../data-access/TripDetailsDA';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { TripLinks } from '../data-access/TripLinksDA';

export class TripSettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: props.tripId || null,
      messages: {
        success: null,
        error: null,
      },
      redirect: null,
    };
  }
  handleMessage(k, m) {
    // display message
    this.setState({ messages: m }, () =>
      setTimeout(
        () => this.setState({ messages: { success: null, error: null } }),
        3000
      ));

    // if success message came from New Expense, reset both, otherwise just the one it came from
    if (m.success && k === this.state.keyNewExpense) {
      this.setState({
        keyNewExpense: Math.random(),
        keyExpenseList: Math.random(),
      });
    }
    if (m.success && k === this.state.keyExpenseList) {
      this.setState({
        keyExpenseList: Math.random(),
      });
    }
  }

  handleRedirect(path) {
    this.setState({ redirect: path });
  }

  render() {
    return (
      <div>
        <TripLinks tripId={this.state.tripId} />
        <Container>
          <DisappearingAlert msg={this.state.messages.error} variant="danger" />

          {this.state.redirect ? (
            <Redirect push to={this.state.redirect} />
          ) : (
            <TripDetailsDA
              key={this.state.keyNewTrip}
              tripId={this.state.tripId}
              message={message =>
                this.handleMessage(this.state.keyNewTrip, message)
              }
              redirect={path => this.handleRedirect(path)}
            />
          )}
        </Container>
      </div>
    );
  }
}

export default TripSettingsPage;
