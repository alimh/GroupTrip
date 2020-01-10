import React from 'react';
import Axios from 'axios';
import { LoadingView } from '../components/LoadingView';
import { TripsList } from '../components/TripsList';
import MessageContext, { ErrToMessageObj } from '../components/MessageContext';

export class AllTripsDA extends React.Component {
  static contextType = MessageContext;

  constructor(props) {
    super(props);

    this.state = {
      trips: []
    };
  }

  componentDidMount() {
    this.getTripsFromServer();
  }

  getTripsFromServer() {
    /* Gets an array of trips from the server
    [
      {
        tripId: String,
        tripName: String,
        travelers: [String],
        categories: [String],
      }
    ]
    */
    Axios.get('/api/trips/all')
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, trips: data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.context.sendMessage(ErrToMessageObj(err));
      });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    return this.state.trips.length > 0 ? (
      <TripsList trips={this.state.trips} />
    ) : (
      <div>No Trips</div>
    );
  }
}

export default AllTripsDA;
