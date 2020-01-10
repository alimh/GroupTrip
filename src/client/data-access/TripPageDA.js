import React from 'react';
import Axios from 'axios';
import { LoadingView } from '../components/LoadingView';
import { LoggedOutMessage } from '../components/LoggedOutMessage';
import { TripIndexPage } from '../pages/TripIndexPage';

import MessageContext from '../components/MessageContext';

export class TripPageDA extends React.Component {
  static contextType = MessageContext;
  constructor(props) {
    super(props);

    this.state = {
      tripObj: null,
      loading: true
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
    Axios.get('/api/trips/get', {
      params: { id: this.props.tripId }
    })
      .then((response) => {
        const { data } = response;
        this.setState({ tripObj: data, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.context.sendMessage({
          text:
            err.response.status === 401
              ? LoggedOutMessage()
              : err.response.data,
          variant: 'error'
        });
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
