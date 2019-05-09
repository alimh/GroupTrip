import React from 'react';
import { Redirect } from 'react-router-dom';
import { TripDetailsDA } from '../data-access/TripDetailsDA';
import { DisappearingAlert } from '../components/DisappearingAlert';

export class NewTripPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyNewTrip: Math.random(),
      messages: {
        success: null,
        error: null,
      },
      redirect: null,
    };
  }

  handleMessage(k, m) {
    // display message
    this.setState({ messages: { ...m } });
  }

  handleRedirect(path) {
    this.setState({ redirect: path });
  }

  render() {
    return (
      <div>
        <h1>New Trip</h1>
        <DisappearingAlert msg={this.state.messages.error} variant="danger" />

        {this.state.redirect ? (
          <Redirect push to={this.state.redirect} />
        ) : (
          <TripDetailsDA
            key={this.state.keyNewTrip}
            message={message =>
              this.handleMessage(this.state.keyNewTrip, message)
            }
            redirect={path => this.handleRedirect(path)}
          />
        )}
      </div>
    );
  }
}

export default NewTripPage;
