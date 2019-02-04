import React from 'react';
import { TripDetailsDA } from '../data-access/TripDetailsDA';
import { ErrorView } from '../components/ErrorView';
import { SuccessView } from '../components/SuccessView';

export class NewTripPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyNewTrip: Math.random(),
      messages: {
        success: null,
        error: null,
      },
    };
  }

  handleMessage(k, m) {
    // display message
    console.log('handling message');
    console.log(m);
    this.setState({ messages: { ...m } });
  }

  render() {
    return (
      <div>
        <h1>New Trip</h1>
        <ErrorView error={this.state.messages.error} />
        <SuccessView msg={this.state.messages.success} />

        <TripDetailsDA
          key={this.state.keyNewTrip}
          message={message =>
            this.handleMessage(this.state.keyNewTrip, message)
          }
        />
      </div>
    );
  }
}

export default NewTripPage;
