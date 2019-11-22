import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { TripsList } from '../components/TripsList';

export class AllTripsDA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorizationHeader: Auth.getToken()
        ? 'bearer '.concat(Auth.getToken())
        : null,
      trips: [],
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
    Axios.get('/api/trips/all', {
      headers: {
        Authorization: this.state.authorizationHeader,
      },
    })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, trips: data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (this.props.message) this.props.message({ error: err.toString() });
        else throw err;
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
