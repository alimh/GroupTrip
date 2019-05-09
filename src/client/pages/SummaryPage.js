import React from 'react';
import { ExpenseSummaryDA } from '../data-access/ExpenseSummaryDA';
import { DisappearingAlert } from '../components/DisappearingAlert';
import { TripLinks } from '../components/TripLinks';

export class SummaryPage extends React.Component {
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

  handleMessage(m) {
    // display message
    this.setState({ messages: m });
  }

  render() {
    return (
      <div className="home">
        <TripLinks tripId={this.state.tripId} />
        <h2>Expense Summary</h2>
        <DisappearingAlert msg={this.state.messages.error} variant="danger" />
        <DisappearingAlert
          msg={this.state.messages.success}
          variant="success"
        />
        <ExpenseSummaryDA
          message={message => this.handleMessage(message)}
          tripId={this.state.tripId}
        />
      </div>
    );
  }
}

export default SummaryPage;
