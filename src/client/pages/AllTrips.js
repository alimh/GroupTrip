import React from 'react';
import { Link } from 'react-router-dom';
import { SuccessView } from '../components/SuccessView';
import { ErrorView } from '../components/ErrorView';
import { AllTripsDA } from '../data-access/AllTripsDA';

export class AllTrips extends React.Component {
  constructor() {
    super();

    this.state = {
      keys: {
        trips: Math.random(),
      },
      messages: {
        success: null,
        error: null,
      },
    };
  }

  handleMessage(k, m) {
    // display message
    this.setState({ messages: { ...m } });
  }

  render() {
    return (
      <div className="home">
        <Link to="/new">New Trip</Link>
        <h1>Trips</h1>
        <ErrorView error={this.state.messages.error} />
        <SuccessView msg={this.state.messages.success} />

        <div spacing={24}>
          <div sm={6}>
            <AllTripsDA
              key={this.state.keys.trips}
              message={m => this.handleMessage(this.state.keys.trips, m)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AllTrips;
