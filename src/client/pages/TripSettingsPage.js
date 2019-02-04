import React from 'react';
import { TripDetailsDA } from '../data-access/TripDetailsDA';
import { ErrorView } from '../components/ErrorView';
import { SuccessView } from '../components/SuccessView';
import { TripLinks } from '../components/TripLinks';

export class TripSettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripId: props.tripId || null,
      messages: {
        success: null,
        error: null,
      },
    };
  }
  handleMessage(k, m) {
    // display message
    this.setState({ messages: m });

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

  render() {
    return (
      <div>
        <TripLinks tripId={this.state.tripId} />
        <h1>Trip Settings</h1>
        <ErrorView error={this.state.messages.error} />
        <SuccessView msg={this.state.messages.success} />

        <TripDetailsDA
          key={this.state.keyNewTrip}
          tripId={this.state.tripId}
          message={message =>
            this.handleMessage(this.state.keyNewTrip, message)
          }
        />
      </div>
    );
  }
}

export default TripSettingsPage;
