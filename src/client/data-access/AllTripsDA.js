import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { TripsList } from '../components/TripsList';

export class AllTripsDA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trips: [],
    };

    this.getTripsFromServer();
  }

  // componentDidMount() {
  //   this.getTripsFromServer();
  // }

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
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.get('/api/trips/all', {
      headers: {
        Authorization: authorizationHeader,
      },
    })
      .then((response) => {
        const { data } = response;
        this.setState({ loading: false, trips: data });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ error: err.toString() });
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
