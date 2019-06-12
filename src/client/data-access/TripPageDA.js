import React from 'react';
import Axios from 'axios';
import Auth from '../utils/Auth';
import { LoadingView } from '../components/LoadingView';
import { TripIndexPage } from '../pages/TripIndexPage';

export class TripPageDA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tripObj: null,
      loading: true,
    };

    this.getTripFromServer();
  }

  getTripFromServer() {
    /* Gets an array of trips from the server
    [
      {
        tripId: String,
        tripName: String,
        expenses: [expenseObj],
        travelers: [String],
        categories: [String],
      }
    ]
    */
    const authorizationHeader = 'bearer '.concat(Auth.getToken());
    Axios.get('/api/trips/get', {
      headers: {
        Authorization: authorizationHeader,
      },
      params: { id: this.props.tripId },
    })
      .then((response) => {
        const { data } = response;
        this.setState({ tripObj: data, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.message({ error: err.toString() });
      });
  }

  render() {
    if (this.state.loading) return <LoadingView />;
    if (this.state.tripObj) {
      return <TripIndexPage tripObj={this.state.tripObj} />;
    }
    return <div />;
  }
}

export default TripPageDA;
